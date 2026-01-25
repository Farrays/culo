/**
 * Script to capitalize author initials in reviews.json
 * Fixes names like "towy vaughns" -> "Towy Vaughns"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reviewsPath = path.join(__dirname, '..', 'data', 'reviews.json');
const data = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));

// Prepositions and articles that should stay lowercase (unless first word)
const lowercaseWords = ['de', 'del', 'da', 'la', 'el', 'los', 'las', 'y', 'e', 'a', 'en'];

// Function to capitalize each word in a name properly
function capitalizeInitials(name) {
  // Skip names that are clearly not person names
  if (name.includes('Gracias') || name.includes('reseñas') ||
      name.includes('Aspectos') || name.includes('EQUIPO') || name.length > 40) {
    return name;
  }

  const regex = /[a-záéíóúüñ]/i;

  return name.split(' ').map((word, index) => {
    if (word.length === 0) return word;
    // Handle special cases like emojis or numbers
    if (!regex.test(word[0])) return word;

    // Keep prepositions lowercase unless it's the first word
    const wordLower = word.toLowerCase();
    if (index > 0 && lowercaseWords.includes(wordLower)) {
      return wordLower;
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

// Preview mode (default) or apply mode
const applyChanges = process.argv.includes('--apply');

// Count how many names will be changed
let changedCount = 0;
const changes = [];

data.reviews.forEach(review => {
  const original = review.author;
  const capitalized = capitalizeInitials(original);
  if (original !== capitalized) {
    changedCount++;
    changes.push({ from: original, to: capitalized });
    if (applyChanges) {
      review.author = capitalized;
    }
  }
});

console.log('Total reviews:', data.reviews.length);
console.log('Names that will be changed:', changedCount);
console.log('\nAll changes:');
changes.forEach(c => console.log(`  "${c.from}" -> "${c.to}"`));

if (applyChanges) {
  fs.writeFileSync(reviewsPath, JSON.stringify(data, null, 2), 'utf8');
  console.log('\n✅ Changes applied to reviews.json');
} else {
  console.log('\nRun with --apply flag to apply changes');
}
