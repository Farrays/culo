#!/usr/bin/env node
/**
 * Copy Teacher Keys to Other Languages
 * Quick script to copy teacher keys from ES to CA/EN/FR
 */

import fs from 'fs';

const esCommon = JSON.parse(fs.readFileSync('i18n/locales/es/common.json', 'utf-8'));
const caCommon = JSON.parse(fs.readFileSync('i18n/locales/ca/common.json', 'utf-8'));
const enCommon = JSON.parse(fs.readFileSync('i18n/locales/en/common.json', 'utf-8'));
const frCommon = JSON.parse(fs.readFileSync('i18n/locales/fr/common.json', 'utf-8'));

// Get all teacher keys from ES
const teacherKeys = Object.keys(esCommon).filter(key => key.startsWith('teacher.'));

console.log(`Found ${teacherKeys.length} teacher keys in ES`);

// Copy to CA (keeping ES text for now)
teacherKeys.forEach(key => {
  if (!caCommon[key]) {
    caCommon[key] = esCommon[key]; // Temporary: copy ES text
  }
});

// Copy to EN (keeping ES text for now)
teacherKeys.forEach(key => {
  if (!enCommon[key]) {
    enCommon[key] = esCommon[key]; // Temporary: copy ES text
  }
});

// Copy to FR (keeping ES text for now)
teacherKeys.forEach(key => {
  if (!frCommon[key]) {
    frCommon[key] = esCommon[key]; // Temporary: copy ES text
  }
});

// Write back
fs.writeFileSync('i18n/locales/ca/common.json', JSON.stringify(caCommon, null, 2) + '\n');
fs.writeFileSync('i18n/locales/en/common.json', JSON.stringify(enCommon, null, 2) + '\n');
fs.writeFileSync('i18n/locales/fr/common.json', JSON.stringify(frCommon, null, 2) + '\n');

console.log('✅ Teacher keys copied to CA, EN, FR');
console.log('📝 Note: Using ES text temporarily. Translate later if needed.');
