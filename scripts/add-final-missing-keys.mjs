#!/usr/bin/env node
/**
 * Add Final Missing Translation Keys
 * Fixes: bailemanananasPrepareBefore, femVideoTitle
 */

import fs from 'fs';

const locales = ['es', 'ca', 'en', 'fr'];

// Missing keys in pages.json
const pagesKeys = {
  // Baile Mañanas - Prepare section title (used by PrepareClassSection.tsx line 130)
  bailemanananasPrepareBefore: 'Antes de venir',

  // Femmology - Video section title
  femVideoTitle: 'Descubre Femmology en Acción',
};

function addKeysToJSON(filePath, newKeys) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let added = 0;

    for (const [key, value] of Object.entries(newKeys)) {
      if (!data[key]) {
        data[key] = value;
        added++;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    return added;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

console.log('🚀 Adding final missing keys...\n');

for (const locale of locales) {
  const filePath = `i18n/locales/${locale}/pages.json`;
  const added = addKeysToJSON(filePath, pagesKeys);
  console.log(`   ${locale}: ${added} keys added to pages.json`);
}

console.log('\n✅ Done!');
console.log('   - bailemanananasPrepareBefore: "Antes de venir"');
console.log('   - femVideoTitle: "Descubre Femmology en Acción"');
