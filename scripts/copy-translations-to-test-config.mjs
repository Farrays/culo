#!/usr/bin/env node
/**
 * Copy all production translations to test config
 * This ensures test environment has all the same translations as production
 */

import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'i18n', 'locales', 'es');
const testConfigPath = path.join(process.cwd(), 'test', 'i18n-test-config.ts');

// Read all JSON files from es locale
const commonPath = path.join(localesDir, 'common.json');
const homePath = path.join(localesDir, 'home.json');
const pagesPath = path.join(localesDir, 'pages.json');
const classesPath = path.join(localesDir, 'classes.json');
const schedulePath = path.join(localesDir, 'schedule.json');
const bookingPath = path.join(localesDir, 'booking.json');

const common = JSON.parse(fs.readFileSync(commonPath, 'utf-8'));
const home = JSON.parse(fs.readFileSync(homePath, 'utf-8'));
const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf-8'));
const classes = JSON.parse(fs.readFileSync(classesPath, 'utf-8'));
const schedule = JSON.parse(fs.readFileSync(schedulePath, 'utf-8'));
const booking = JSON.parse(fs.readFileSync(bookingPath, 'utf-8'));

console.log('✅ Loaded production translations');
console.log(`   - common: ${Object.keys(common).length} keys`);
console.log(`   - home: ${Object.keys(home).length} keys`);
console.log(`   - pages: ${Object.keys(pages).length} keys`);
console.log(`   - classes: ${Object.keys(classes).length} keys`);
console.log(`   - schedule: ${Object.keys(schedule).length} keys`);
console.log(`   - booking: ${Object.keys(booking).length} keys`);

// Generate the new mockTranslations object
const mockTranslations = {
  common,
  home,
  pages,
  classes,
  schedule,
  booking,
};

// Read current test config
const testConfig = fs.readFileSync(testConfigPath, 'utf-8');

// Find the mockTranslations object and replace it
const newTestConfig = testConfig.replace(
  /const mockTranslations = \{[\s\S]*?\n\};\n\n\/\/ =+/,
  `const mockTranslations = ${JSON.stringify(mockTranslations, null, 2)};\n\n// ============================================================================`
);

// Write back
fs.writeFileSync(testConfigPath, newTestConfig, 'utf-8');

console.log('\n✅ Updated test/i18n-test-config.ts with all production translations');
console.log('   Test environment now has complete translation coverage');
