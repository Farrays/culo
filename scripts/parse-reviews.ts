/**
 * Parse Google Reviews Script
 * Converts reviews_google.txt to structured JSON
 *
 * Usage: npx ts-node scripts/parse-reviews.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  GoogleReview,
  DanceCategory,
  ReviewStats,
  detectCategories,
  detectTeachers,
  hasExcludedTeacher,
  relativeToISO,
  generateReviewId,
  EXCLUDED_TEACHERS,
} from '../constants/reviews-data';

// =============================================================================
// CONFIGURATION
// =============================================================================

const INPUT_FILE = path.join(__dirname, '../data/reviews_google.txt');
const OUTPUT_FILE = path.join(__dirname, '../data/reviews.json');
const STATS_FILE = path.join(__dirname, '../data/reviews-stats.json');

// Patterns to identify review components
const PATTERNS = {
  // Author info line (Local Guide·X reseñas·Y fotos) or (X reseñas·Y fotos)
  authorInfo: /^(?:Local Guide·)?(\d+\s*reseñas?(?:·\d+\s*fotos?)?|\d+\s*fotos?)$/i,
  // Date line
  date: /^Hace\s+(?:un\s+)?(?:\d+\s+)?(?:día|días|semana|semanas|mes|meses|año|años?)$/i,
  // Owner response indicator
  ownerResponse: /Farray's International Dance Center/i,
  // Translation indicator
  translated: /^Traducido por Google/i,
  // Response/Reply indicator
  reply: /^Responder$/i,
  // Likes indicator
  likes: /^[❤️🙏🤯]+\d*$/,
  // New review tag
  newTag: /^Nueva$/i,
  // Edit date
  editDate: /^Fecha de edición:/i,
};

// =============================================================================
// PARSER
// =============================================================================

interface RawReview {
  author: string;
  authorInfo?: string;
  date: string;
  text: string;
  isTranslated: boolean;
  originalLanguage?: string;
}

function parseReviewsFromText(content: string): RawReview[] {
  const lines = content.split('\n').map(line => {
    // Remove line number prefix (e.g., "    1→")
    const match = line.match(/^\s*\d+→(.*)$/);
    return match ? match[1] : line;
  });

  const reviews: RawReview[] = [];
  let currentReview: Partial<RawReview> | null = null;
  let textBuffer: string[] = [];
  let isInOwnerResponse = false;
  let skipNextLines = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines or header
    if (!line || line === 'Reseñas' || line === 'Todas') continue;

    // Skip filter tags at the beginning (clases58, alumnos29, etc.)
    if (/^[a-záéíóúñ]+\d+$/i.test(line) || /^\+\d+$/.test(line)) continue;

    // Skip lines if needed
    if (skipNextLines > 0) {
      skipNextLines--;
      continue;
    }

    // Check for owner response - skip until next review
    if (PATTERNS.ownerResponse.test(line)) {
      isInOwnerResponse = true;
      continue;
    }

    // Skip likes, reply buttons, new tags
    if (PATTERNS.likes.test(line) || PATTERNS.reply.test(line) || PATTERNS.newTag.test(line)) {
      continue;
    }

    // Skip edit date lines
    if (PATTERNS.editDate.test(line)) {
      continue;
    }

    // Check for translation indicator
    if (PATTERNS.translated.test(line)) {
      if (currentReview) {
        currentReview.isTranslated = true;
        const langMatch = line.match(/\(([^)]+)\)/);
        if (langMatch) {
          currentReview.originalLanguage = langMatch[1];
        }
      }
      continue;
    }

    // Check if this is a date line (indicates new review)
    if (PATTERNS.date.test(line)) {
      // Save previous review if exists
      if (currentReview && currentReview.author && textBuffer.length > 0) {
        currentReview.text = textBuffer.join(' ').trim();
        if (currentReview.text && currentReview.date) {
          reviews.push(currentReview as RawReview);
        }
      }

      // Start new review - look back for author info
      currentReview = {
        date: line,
        isTranslated: false,
      };
      textBuffer = [];
      isInOwnerResponse = false;

      // Look backwards for author name and info
      let authorFound = false;
      for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
        const prevLine = lines[j].trim();
        if (!prevLine) continue;

        if (PATTERNS.authorInfo.test(prevLine)) {
          currentReview.authorInfo = prevLine;
        } else if (
          !authorFound &&
          prevLine &&
          !PATTERNS.likes.test(prevLine) &&
          !PATTERNS.reply.test(prevLine) &&
          !PATTERNS.ownerResponse.test(prevLine) &&
          !PATTERNS.date.test(prevLine) &&
          !PATTERNS.translated.test(prevLine) &&
          !PATTERNS.editDate.test(prevLine) &&
          !/^[a-záéíóúñ]+\d+$/i.test(prevLine) &&
          !/^\+\d+$/.test(prevLine)
        ) {
          currentReview.author = prevLine;
          authorFound = true;
          break;
        }
      }
      continue;
    }

    // Skip if in owner response
    if (isInOwnerResponse) {
      // Check if we've reached a new author (not the owner)
      const nextLine = lines[i + 1]?.trim();
      const nextNextLine = lines[i + 2]?.trim();
      if (
        nextLine &&
        (PATTERNS.authorInfo.test(nextLine) || PATTERNS.date.test(nextLine)) &&
        !PATTERNS.ownerResponse.test(line)
      ) {
        isInOwnerResponse = false;
      } else {
        continue;
      }
    }

    // Check if this line looks like an author name (for next review)
    const nextLine = lines[i + 1]?.trim();
    const nextNextLine = lines[i + 2]?.trim();
    if (
      nextLine &&
      (PATTERNS.authorInfo.test(nextLine) ||
        PATTERNS.date.test(nextLine) ||
        PATTERNS.date.test(nextNextLine || ''))
    ) {
      // This might be the author of the next review, don't add to text
      continue;
    }

    // Add to text buffer if we have a current review
    if (currentReview && !isInOwnerResponse) {
      // Skip if it looks like author info
      if (!PATTERNS.authorInfo.test(line)) {
        textBuffer.push(line);
      }
    }
  }

  // Don't forget the last review
  if (currentReview && currentReview.author && textBuffer.length > 0) {
    currentReview.text = textBuffer.join(' ').trim();
    if (currentReview.text && currentReview.date) {
      reviews.push(currentReview as RawReview);
    }
  }

  return reviews;
}

// =============================================================================
// PROCESSING
// =============================================================================

function processReviews(rawReviews: RawReview[]): GoogleReview[] {
  const processed: GoogleReview[] = [];
  let index = 0;

  for (const raw of rawReviews) {
    // Skip if no text or very short
    if (!raw.text || raw.text.length < 10) continue;

    // Skip if mentions excluded teacher
    if (hasExcludedTeacher(raw.text)) {
      console.log(`  Excluded (teacher): ${raw.author} - mentions excluded teacher`);
      continue;
    }

    // Skip negative reviews (looking for negative sentiment indicators)
    const negativeIndicators = [
      'lamentable',
      'decepcionada',
      'decepcionado',
      'negativa',
      'pésima',
      'pésimo',
      'nefasta',
      'nefasto',
      'horrible',
      'terrible',
      'no vayas',
      'no vayan',
      'no recomiendo',
      'no lo recomiendo',
      'frustrante',
      'desastre',
      'peor',
    ];
    const isNegative = negativeIndicators.some(indicator =>
      raw.text.toLowerCase().includes(indicator)
    );
    if (isNegative) {
      console.log(`  Excluded (negative): ${raw.author}`);
      continue;
    }

    // Detect categories and teachers
    const categories = detectCategories(raw.text);
    const teachers = detectTeachers(raw.text);

    const review: GoogleReview = {
      id: generateReviewId(raw.author, raw.date, index++),
      author: raw.author,
      authorInfo: raw.authorInfo,
      rating: 5,
      date: raw.date,
      dateISO: relativeToISO(raw.date),
      text: raw.text,
      isTranslated: raw.isTranslated,
      originalLanguage: raw.originalLanguage,
      categories,
      teachers,
      sentiment: 'positive',
    };

    processed.push(review);
  }

  return processed;
}

// =============================================================================
// STATISTICS
// =============================================================================

function calculateStats(reviews: GoogleReview[]): ReviewStats {
  const stats: ReviewStats = {
    total: reviews.length,
    avgRating: 5.0,
    byCategory: {
      'salsa-cubana': 0,
      bachata: 0,
      'heels-femmology': 0,
      urbanas: 0,
      contemporaneo: 0,
      afro: 0,
      fitness: 0,
      general: 0,
    },
    byTeacher: {},
  };

  for (const review of reviews) {
    // Count by category
    for (const category of review.categories) {
      stats.byCategory[category]++;
    }

    // Count by teacher
    for (const teacher of review.teachers) {
      stats.byTeacher[teacher] = (stats.byTeacher[teacher] || 0) + 1;
    }
  }

  return stats;
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
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

  // Ensure data directory exists
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Write reviews.json
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

  // Write stats.json
  fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  console.log(`  Written: ${STATS_FILE}`);

  console.log('\n' + '='.repeat(60));
  console.log('Done!');
  console.log('='.repeat(60));
}

main().catch(console.error);
