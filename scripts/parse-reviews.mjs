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
  thomas: ['thomas'],
  ella: ['ella', ' ela '],
  natalie: ['natalie'],
  kristofer: ['kristofer'],
  // NOT included: silvio (not a teacher), yenifer/jenifer (not a teacher)
};

// Negative indicators - these are reviews with < 4 stars or negative sentiment despite 5 stars
// Be careful not to include phrases that could appear in positive contexts
const NEGATIVE_INDICATORS = [
  'lamentable', 'decepcionada', 'decepcionado',
  'experiencia muy negativa', 'experiencia negativa',
  'pésima', 'pésimo', 'nefasta', 'nefasto', 'horrible',
  'terrible', 'no vayas', 'no vayan', 'no recomiendo',
  'frustrante', 'desastre', 'peor experiencia', 'gentuza',
  'perdí la paciencia', 'no les importa nada',
  'impertinente', 'gosera', 'grosera', 'grosero', 'nunca más', // Negative despite 5 stars
];

// Exclude reviews mentioning former teachers who are no longer at the school
const EXCLUDED_TEACHER_MENTIONS = [
  'danger',
];

// Exclude reviews about online classes (we only offer in-person now)
const ONLINE_CLASS_INDICATORS = [
  'clases online', 'clase online', 'clases en línea',
  'online en la escuela', 'baile online', 'clases virtuales',
];

// =============================================================================
// SPELLING CORRECTIONS
// =============================================================================

const SPELLING_CORRECTIONS = [
  // Typos
  { from: /\bProfessoras\b/g, to: 'Profesoras' },
  { from: /\bsistena\b/gi, to: 'sistema' },
  { from: /\brl mejor\b/gi, to: 'el mejor' },
  { from: /\btrasmitir\b/gi, to: 'transmitir' },
  { from: /\brecepcion\b/gi, to: 'recepción' },
  { from: /\btambien\b/gi, to: 'también' },
  { from: /\batencion\b/gi, to: 'atención' },
  { from: /\bademas\b/gi, to: 'además' },
  { from: /\ba mas clases\b/gi, to: 'a más clases' },
  { from: /\bmas clases\b/gi, to: 'más clases' },
  // Common missing accents
  { from: /\bfacil\b/gi, to: 'fácil' },
  { from: /\bmusica\b/gi, to: 'música' },
  { from: /\bfantastico\b/gi, to: 'fantástico' },
  { from: /\bfantastica\b/gi, to: 'fantástica' },
  { from: /\binformacion\b/gi, to: 'información' },
  { from: /\bsolucion\b/gi, to: 'solución' },
  { from: /\bdiversion\b/gi, to: 'diversión' },
  { from: /\beducacion\b/gi, to: 'educación' },
  { from: /\blocacion\b/gi, to: 'locación' },
  { from: /\bpasion\b/gi, to: 'pasión' },
  // Double spaces
  { from: /  +/g, to: ' ' },
];

function correctSpelling(text) {
  let corrected = text;
  for (const { from, to } of SPELLING_CORRECTIONS) {
    corrected = corrected.replace(from, to);
  }
  return corrected;
}

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

function isNegativeReview(text) {
  const lowerText = text.toLowerCase();
  return NEGATIVE_INDICATORS.some(indicator => lowerText.includes(indicator.toLowerCase()));
}

function isOnlineClassReview(text) {
  const lowerText = text.toLowerCase();
  return ONLINE_CLASS_INDICATORS.some(indicator => lowerText.includes(indicator.toLowerCase()));
}

function mentionsExcludedTeacher(text) {
  const lowerText = text.toLowerCase();
  return EXCLUDED_TEACHER_MENTIONS.some(teacher => lowerText.includes(teacher.toLowerCase()));
}

function generateReviewId(author, index) {
  const sanitized = author
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 20);
  return `review-${sanitized}-${index}`;
}

function isOwnerResponse(line) {
  return line.includes("Farray's International Dance Center") &&
         (line.includes('propietario') || line.includes('(propietario)'));
}

function isDateLine(line) {
  // Match: "Hace X semanas/meses/años/días" where X can be a number, "un/una", or nothing
  return /^Hace\s+(un\s+|una\s+|\d+\s+)?(semana|mes|año|día)/i.test(line.trim()) ||
         /^Fecha de edición:\s+Hace/i.test(line.trim());
}

function isAuthorInfoLine(line) {
  return /^(Local Guide·)?\d+\s*reseñas?/i.test(line.trim()) ||
         /reseñas?·\d+\s*fotos?/i.test(line.trim());
}

function isSkipLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (trimmed === 'Reseñas' || trimmed === 'Todas') return true;
  if (/^[a-záéíóúñ]+\d+$/i.test(trimmed)) return true; // "clases58"
  if (/^\+\d+$/.test(trimmed)) return true; // "+6"
  if (/^Responder$/i.test(trimmed)) return true;
  if (/^Nueva$/i.test(trimmed)) return true;
  if (/^Traducido por Google/i.test(trimmed)) return true;
  if (/^Ver original/i.test(trimmed)) return true;
  if (/^[❤️🙏🤯💖💕🫶✨🔥💃🕺😍😊🫶🏼😃☺️❣️😘🩵💗🧡🤍😄😂👍👑🇯🇲🌍⭐]+\d*$/.test(trimmed)) return true; // Emoji reactions
  if (/^\d+$/.test(trimmed)) return true; // Just numbers (like reaction counts)
  return false;
}

// Check if a line looks like an author name (not review text)
function looksLikeAuthorName(line) {
  const trimmed = line.trim();

  // Too long for a name (names are usually < 40 chars)
  if (trimmed.length > 45) return false;

  // Too short
  if (trimmed.length < 2) return false;

  // Contains common review text patterns (not author names)
  const reviewTextPatterns = [
    // Common sentence starters
    /^(me |mi |muy |las |los |la |el |un |una |en |de |que |es |son |con |sin |por |para |al |del )/i,
    /^(hemos |nos |te |se |lo |le |he |ha |han |fue |fui |era |iba |voy |vas |van |hay )/i,
    /^(desde |hasta |cuando |donde |como |porque |aunque |pero |sin embargo)/i,

    // Review-specific words
    /\b(clase|escuela|profesor|academia|baile|bailar|experiencia|ambiente)\b/i,
    /\b(genial|increíble|encanta|recomiendo|maravill|fantástic|espectacular)\b/i,
    /\b(enseñ|aprend|disfrut|divert|trabaj|sentir)\b/i,

    // Sentence structure indicators
    /^\!/,      // Starts with exclamation
    /^¡/,       // Starts with inverted exclamation
    /^¿/,       // Starts with question mark
    /\.\s+\w/,  // Period followed by space and word (multiple sentences)
    /,\s+\w+\s+\w+\s+\w+/,  // Comma followed by 3+ words (sentence structure)
  ];

  for (const pattern of reviewTextPatterns) {
    if (pattern.test(trimmed)) return false;
  }

  return true;
}

// =============================================================================
// PARSER - IMPROVED VERSION
// =============================================================================

function parseReviewsFromText(content) {
  const lines = content.split('\n');
  const reviews = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    // Skip empty/irrelevant lines
    if (isSkipLine(line)) {
      i++;
      continue;
    }

    // Skip owner responses entirely
    if (isOwnerResponse(line)) {
      i++;
      // Skip all lines until we find a new potential author
      while (i < lines.length) {
        const nextLine = lines[i].trim();
        // Look for next author (line that looks like a name AND has date within 3 lines)
        if (!isSkipLine(nextLine) && !isOwnerResponse(nextLine) && !isDateLine(nextLine) && looksLikeAuthorName(nextLine)) {
          let hasDateAhead = false;
          for (let k = i + 1; k < Math.min(i + 4, lines.length); k++) {
            if (isDateLine(lines[k]?.trim() || '')) {
              hasDateAhead = true;
              break;
            }
          }
          if (hasDateAhead) break;
        }
        i++;
      }
      continue;
    }

    // Check if this line looks like an author name
    if (!looksLikeAuthorName(line)) {
      i++;
      continue;
    }

    // Look for date pattern in next few lines to identify a review start
    let dateIndex = -1;
    for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
      const potentialDate = lines[j]?.trim() || '';
      if (isDateLine(potentialDate)) {
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
    let dateRaw = lines[dateIndex].trim();

    // Clean up date
    if (dateRaw.startsWith('Fecha de edición:')) {
      dateRaw = dateRaw.replace('Fecha de edición:', '').trim();
    }

    // Check for author info between author and date
    if (dateIndex > i + 1) {
      const infoLine = lines[i + 1]?.trim() || '';
      if (isAuthorInfoLine(infoLine)) {
        authorInfo = infoLine;
      }
    }

    // Collect review text
    let textLines = [];
    let j = dateIndex + 1;

    while (j < lines.length) {
      const textLine = lines[j].trim();

      // Skip irrelevant lines but continue looking
      if (isSkipLine(textLine)) {
        j++;
        continue;
      }

      // Stop at owner response
      if (isOwnerResponse(textLine)) {
        break;
      }

      // Stop at date line (might be owner response date)
      if (isDateLine(textLine)) {
        break;
      }

      // Check if this looks like a new author (looks like a name AND has date within next 3 lines)
      if (looksLikeAuthorName(textLine) && !isAuthorInfoLine(textLine)) {
        let hasDateAhead = false;
        for (let k = j + 1; k < Math.min(j + 4, lines.length); k++) {
          if (isDateLine(lines[k]?.trim() || '')) {
            hasDateAhead = true;
            break;
          }
        }
        // If it looks like an author with upcoming date, stop collecting text
        if (hasDateAhead) {
          break;
        }
      }

      // Skip author info for new reviews
      if (isAuthorInfoLine(textLine)) {
        break;
      }

      textLines.push(textLine);
      j++;
    }

    const text = textLines.join(' ').trim();

    // Only add reviews with valid authors and text
    if (author && author.length > 1 && author.length < 60) {
      reviews.push({
        author,
        authorInfo,
        date: dateRaw,
        text: text || '', // Allow empty text (5-star only reviews)
        hasText: text.length > 0,
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
  const withoutText = [];
  let excludedByNegative = 0;
  let excludedByOnline = 0;
  let excludedByTeacher = 0;
  let index = 0;

  for (const raw of rawReviews) {
    // Track reviews without text separately
    if (!raw.hasText || raw.text.length < 10) {
      withoutText.push(raw.author);
      continue;
    }

    // Skip negative reviews (< 4 stars or negative sentiment)
    if (isNegativeReview(raw.text)) {
      excludedByNegative++;
      console.log(`  - Negative: ${raw.author.substring(0, 30)}`);
      continue;
    }

    // Skip reviews mentioning former teachers
    if (mentionsExcludedTeacher(raw.text)) {
      excludedByTeacher++;
      console.log(`  - Excluded teacher mention: ${raw.author.substring(0, 30)}`);
      continue;
    }

    // Skip online class reviews (we only offer in-person now)
    if (isOnlineClassReview(raw.text)) {
      excludedByOnline++;
      console.log(`  - Online: ${raw.author.substring(0, 30)}`);
      continue;
    }

    const categories = detectCategories(raw.text);
    const teachers = detectTeachers(raw.text);

    // Apply spelling corrections to the text
    const correctedText = correctSpelling(raw.text);

    processed.push({
      id: generateReviewId(raw.author, index++),
      author: raw.author,
      authorInfo: raw.authorInfo,
      rating: 5,
      date: raw.date,
      dateISO: relativeToISO(raw.date),
      text: correctedText,
      isTranslated: false,
      categories,
      teachers,
      sentiment: 'positive',
    });
  }

  console.log(`  Reviews without text: ${withoutText.length}`);
  console.log(`  Excluded by negative sentiment: ${excludedByNegative}`);
  console.log(`  Excluded by former teacher mention: ${excludedByTeacher}`);
  console.log(`  Excluded by online class mention: ${excludedByOnline}`);

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
console.log('Google Reviews Parser v2 - No teacher filtering');
console.log('='.repeat(60));

// Read input file
console.log(`\nReading: ${INPUT_FILE}`);
const content = fs.readFileSync(INPUT_FILE, 'utf-8');
console.log(`  File size: ${(content.length / 1024).toFixed(2)} KB`);

// Parse reviews
console.log('\nParsing reviews...');
const rawReviews = parseReviewsFromText(content);
console.log(`  Found ${rawReviews.length} raw reviews`);
console.log(`  With text: ${rawReviews.filter(r => r.hasText).length}`);
console.log(`  Without text (5-star only): ${rawReviews.filter(r => !r.hasText).length}`);

// Process and filter
console.log('\nProcessing and filtering...');
const processedReviews = processReviews(rawReviews);
console.log(`  Kept ${processedReviews.length} valid reviews with text`);

// Calculate stats
console.log('\nCalculating statistics...');
const stats = calculateStats(processedReviews);

// Output stats
console.log('\n' + '-'.repeat(40));
console.log('STATISTICS');
console.log('-'.repeat(40));
console.log(`Total reviews with text: ${stats.total}`);
console.log(`Average rating: ${stats.avgRating}`);
console.log('\nBy Category:');
for (const [category, count] of Object.entries(stats.byCategory)) {
  if (count > 0) {
    console.log(`  ${category}: ${count}`);
  }
}
console.log('\nTop Teachers Mentioned:');
const sortedTeachers = Object.entries(stats.byTeacher).sort((a, b) => b[1] - a[1]);
for (const [teacher, count] of sortedTeachers.slice(0, 15)) {
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
