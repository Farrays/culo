/**
 * Parse Google Reviews Script
 * Converts reviews_google.txt to structured JSON
 *
 * Usage: node scripts/parse-reviews.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================================================================
// CONFIGURATION
// =============================================================================

const INPUT_FILE = path.join(__dirname, '../data/reviews_google.txt');
const OUTPUT_FILE = path.join(__dirname, '../data/reviews.json');
const STATS_FILE = path.join(__dirname, '../data/reviews-stats.json');

// =============================================================================
// CONSTANTS
// =============================================================================

const CATEGORY_KEYWORDS = {
  'salsa-cubana': ['salsa cubana', 'salsa', 'cubana', 'casino', 'rueda', 'timba'],
  'bachata': ['bachata', 'sensual', 'bachata sensual', 'bachata moderna', 'bachata lady'],
  'heels-femmology': ['heels', 'tacones', 'femmology', 'sexy style', 'lady style', 'sexy reggaeton'],
  'urbanas': ['hip hop', 'hip-hop', 'dancehall', 'twerk', 'twerking', 'afrobeats', 'afrobeat', 'reggaeton', 'urbano', 'breaking', 'locking', 'popping'],
  'contemporaneo': ['contemporáneo', 'contemporanea', 'contemporary', 'ballet', 'modern jazz', 'jazz', 'danza moderna'],
  'afro': ['afro jazz', 'afro-jazz', 'afro dance', 'afro contemporáneo', 'afrocubano', 'folklore', 'folklórico', 'orishas', 'rumba', 'africano'],
  'fitness': ['stretching', 'yoga', 'body conditioning', 'glúteos', 'fit', 'cuerpo fit', 'bum bum', 'tai-chi', 'tai chi'],
};

const VALID_TEACHERS = {
  yunaisy: ['yunaisy', 'farray'],
  daniel: ['daniel sené', 'daniel sene'],
  alejandro: ['alejandro'],
  lia: ['lia valdes', 'lia valdés'],
  iroel: ['iroel', 'iro '],
  charlie: ['charlie', 'breezy'],
  grechen: ['grechen', 'grechén'],
  marcos: ['marcos'],
  crisag: ['crisag', 'cris '],
  yasmina: ['yasmina', 'yas '],
  redbhlue: ['redbhlue', 'redblueh'],
  sandra: ['sandra'],
  isabel: ['isabel lópez', 'isabel lopez'],
  eugenia: ['eugenia', 'euge '],
  mathias: ['mathias', 'mathi '],
  carlos: ['carlos canto'],
  noemi: ['noemi', 'noemí'],
  juan: ['juan alvarez'],
  augusto: ['augusto'],
  cristina: ['cristina'],
};

const EXCLUDED_TEACHERS = [
  'yenifer', 'lavin',
  'thomas', 'toams', 'keita',
  'ela arnal', ' ela ', 'ella arnal', ' ella ',
  'adrian', 'adrián',
  'makurya',
  'danger',
  'julio napoles', 'julio nápoles',
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function relativeToISO(relativeDate) {
  const now = new Date();
  const lower = relativeDate.toLowerCase();

  if (lower.includes('semana')) {
    const weeks = parseInt(lower.match(/\d+/)?.[0] || '1');
    now.setDate(now.getDate() - weeks * 7);
  } else if (lower.includes('mes')) {
    const months = parseInt(lower.match(/\d+/)?.[0] || '1');
    now.setMonth(now.getMonth() - months);
  } else if (lower.includes('año')) {
    const years = parseInt(lower.match(/\d+/)?.[0] || '1');
    now.setFullYear(now.getFullYear() - years);
  } else if (lower.includes('día')) {
    const days = parseInt(lower.match(/\d+/)?.[0] || '1');
    now.setDate(now.getDate() - days);
  }

  return now.toISOString().split('T')[0];
}

function detectCategories(text) {
  const lowerText = text.toLowerCase();
  const detected = [];

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        detected.push(category);
        break;
      }
    }
  }

  return detected.length > 0 ? detected : ['general'];
}

function detectTeachers(text) {
  const lowerText = text.toLowerCase();
  const mentioned = [];

  for (const [teacherName, keywords] of Object.entries(VALID_TEACHERS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        mentioned.push(teacherName);
        break;
      }
    }
  }

  return mentioned;
}

function hasExcludedTeacher(text) {
  const lowerText = text.toLowerCase();
  return EXCLUDED_TEACHERS.some(teacher => lowerText.includes(teacher.toLowerCase()));
}

function generateReviewId(author, date, index) {
  const sanitized = author
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 20);
  return `review-${sanitized}-${index}`;
}

// =============================================================================
// PARSER
// =============================================================================

function parseReviewsFromText(content) {
  // Remove line number prefixes
  const cleanContent = content.replace(/^\s*\d+→/gm, '');
  const lines = cleanContent.split('\n');

  const reviews = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty lines and headers
    if (!line || line === 'Reseñas' || line === 'Todas' || /^[a-záéíóúñ]+\d+$/i.test(line) || /^\+\d+$/.test(line)) {
      i++;
      continue;
    }

    // Skip owner responses
    if (line.includes("Farray's International Dance Center")) {
      // Skip until we find a new review
      i++;
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        // Check if this looks like a new author (followed by date pattern)
        let j = i + 1;
        while (j < lines.length && j < i + 4) {
          if (/^Hace\s+/i.test(lines[j]?.trim() || '')) {
            break;
          }
          j++;
        }
        if (j < i + 4 && /^Hace\s+/i.test(lines[j]?.trim() || '')) {
          break;
        }
        i++;
      }
      continue;
    }

    // Look for author pattern: Name, then optional info, then date
    // Check if next few lines contain a date
    let dateIndex = -1;
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      if (/^Hace\s+/i.test(lines[j]?.trim() || '')) {
        dateIndex = j;
        break;
      }
    }

    if (dateIndex === -1) {
      i++;
      continue;
    }

    // We found a potential review
    const author = line;
    let authorInfo = undefined;
    const date = lines[dateIndex].trim();

    // Check for author info between author and date
    if (dateIndex > i + 1) {
      const infoLine = lines[i + 1]?.trim() || '';
      if (/reseñas?|fotos?|Local Guide/i.test(infoLine)) {
        authorInfo = infoLine;
      }
    }

    // Collect review text
    let textLines = [];
    let j = dateIndex + 1;

    while (j < lines.length) {
      const textLine = lines[j].trim();

      // Stop conditions
      if (!textLine) {
        j++;
        continue;
      }

      // Skip "Nueva" tag
      if (/^Nueva$/i.test(textLine)) {
        j++;
        continue;
      }

      // Stop at owner response
      if (textLine.includes("Farray's International Dance Center")) {
        break;
      }

      // Stop at likes/reactions
      if (/^[❤️🙏🤯]+\d*$/.test(textLine)) {
        j++;
        continue;
      }

      // Skip "Responder"
      if (/^Responder$/i.test(textLine)) {
        j++;
        continue;
      }

      // Check for translation indicator
      if (/^Traducido por Google/i.test(textLine)) {
        j++;
        continue;
      }

      // Check if this is the start of a new review (name followed by date within 3 lines)
      let isNewReview = false;
      for (let k = j + 1; k < Math.min(j + 4, lines.length); k++) {
        if (/^Hace\s+/i.test(lines[k]?.trim() || '')) {
          isNewReview = true;
          break;
        }
      }
      if (isNewReview && !/^Hace\s+/i.test(textLine)) {
        break;
      }

      // Skip date lines
      if (/^Hace\s+/i.test(textLine)) {
        break;
      }

      // Skip author info patterns for new reviews
      if (/^(?:Local Guide·)?\d+\s*reseñas?/i.test(textLine)) {
        break;
      }

      textLines.push(textLine);
      j++;
    }

    const text = textLines.join(' ').trim();

    if (author && date && text && text.length > 10) {
      reviews.push({
        author,
        authorInfo,
        date,
        text,
        isTranslated: false,
      });
    }

    i = j;
  }

  return reviews;
}

// =============================================================================
// PROCESSING
// =============================================================================

function processReviews(rawReviews) {
  const processed = [];
  let index = 0;
  let excludedByTeacher = 0;
  let excludedByNegative = 0;

  for (const raw of rawReviews) {
    // Skip if mentions excluded teacher
    if (hasExcludedTeacher(raw.text)) {
      excludedByTeacher++;
      continue;
    }

    // Skip negative reviews
    const negativeIndicators = [
      'lamentable', 'decepcionada', 'decepcionado', 'negativa',
      'pésima', 'pésimo', 'nefasta', 'nefasto', 'horrible',
      'terrible', 'no vayas', 'no vayan', 'no recomiendo',
      'frustrante', 'desastre', 'peor experiencia',
    ];
    const isNegative = negativeIndicators.some(indicator =>
      raw.text.toLowerCase().includes(indicator)
    );
    if (isNegative) {
      excludedByNegative++;
      continue;
    }

    const categories = detectCategories(raw.text);
    const teachers = detectTeachers(raw.text);

    processed.push({
      id: generateReviewId(raw.author, raw.date, index++),
      author: raw.author,
      authorInfo: raw.authorInfo,
      rating: 5,
      date: raw.date,
      dateISO: relativeToISO(raw.date),
      text: raw.text,
      isTranslated: raw.isTranslated || false,
      categories,
      teachers,
      sentiment: 'positive',
    });
  }

  console.log(`  Excluded by teacher: ${excludedByTeacher}`);
  console.log(`  Excluded by negative: ${excludedByNegative}`);

  return processed;
}

// =============================================================================
// STATISTICS
// =============================================================================

function calculateStats(reviews) {
  const stats = {
    total: reviews.length,
    avgRating: 5.0,
    byCategory: {
      'salsa-cubana': 0,
      'bachata': 0,
      'heels-femmology': 0,
      'urbanas': 0,
      'contemporaneo': 0,
      'afro': 0,
      'fitness': 0,
      'general': 0,
    },
    byTeacher: {},
  };

  for (const review of reviews) {
    for (const category of review.categories) {
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
    }
    for (const teacher of review.teachers) {
      stats.byTeacher[teacher] = (stats.byTeacher[teacher] || 0) + 1;
    }
  }

  return stats;
}

// =============================================================================
// MAIN
// =============================================================================

console.log('='.repeat(60));
console.log('Google Reviews Parser');
console.log('='.repeat(60));

// Read input file
console.log(`\nReading: ${INPUT_FILE}`);
const content = fs.readFileSync(INPUT_FILE, 'utf-8');
console.log(`  File size: ${(content.length / 1024).toFixed(2)} KB`);

// Parse reviews
console.log('\nParsing reviews...');
const rawReviews = parseReviewsFromText(content);
console.log(`  Found ${rawReviews.length} raw reviews`);

// Process and filter
console.log('\nProcessing and filtering...');
const processedReviews = processReviews(rawReviews);
console.log(`  Kept ${processedReviews.length} valid reviews`);

// Calculate stats
console.log('\nCalculating statistics...');
const stats = calculateStats(processedReviews);

// Output stats
console.log('\n' + '-'.repeat(40));
console.log('STATISTICS');
console.log('-'.repeat(40));
console.log(`Total reviews: ${stats.total}`);
console.log(`Average rating: ${stats.avgRating}`);
console.log('\nBy Category:');
for (const [category, count] of Object.entries(stats.byCategory)) {
  if (count > 0) {
    console.log(`  ${category}: ${count}`);
  }
}
console.log('\nTop Teachers Mentioned:');
const sortedTeachers = Object.entries(stats.byTeacher).sort((a, b) => b[1] - a[1]);
for (const [teacher, count] of sortedTeachers.slice(0, 10)) {
  console.log(`  ${teacher}: ${count}`);
}

// Write output files
console.log('\n' + '-'.repeat(40));
console.log('Writing output files...');

fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(
    {
      generated: new Date().toISOString(),
      totalReviews: stats.total,
      averageRating: stats.avgRating,
      reviews: processedReviews,
    },
    null,
    2
  )
);
console.log(`  Written: ${OUTPUT_FILE}`);

fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
console.log(`  Written: ${STATS_FILE}`);

console.log('\n' + '='.repeat(60));
console.log('Done!');
console.log('='.repeat(60));
