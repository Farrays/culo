// Script to safely add missing translations to CA and FR
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import ES translations directly
const esModule = await import('../i18n/locales/es.ts');
const es = esModule.es || esModule.default;

const caModule = await import('../i18n/locales/ca.ts');
const ca = caModule.ca || caModule.default;

const frModule = await import('../i18n/locales/fr.ts');
const fr = frModule.fr || frModule.default;

// Find missing keys
const esKeys = Object.keys(es);
const caKeys = new Set(Object.keys(ca));
const frKeys = new Set(Object.keys(fr));

const missingInCA = esKeys.filter(k => !caKeys.has(k));
const missingInFR = esKeys.filter(k => !frKeys.has(k));

console.log('Missing in CA:', missingInCA.length);
console.log('Missing in FR:', missingInFR.length);

// Helper to escape string for TypeScript
function escapeForTS(str) {
  if (typeof str !== 'string') return String(str);
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

// Build CA translations object - using ES values as placeholder
const caTranslations = {};
for (const key of missingInCA) {
  if (es[key] !== undefined && es[key] !== null) {
    caTranslations[key] = es[key];
  }
}

// Build FR translations object - using ES values as placeholder
const frTranslations = {};
for (const key of missingInFR) {
  if (es[key] !== undefined && es[key] !== null) {
    frTranslations[key] = es[key];
  }
}

// Function to add translations to file
function addTranslationsToFile(filePath, translations, lang) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Find the last line before };
  const closingMatch = content.match(/\n(\s*)\};?\s*$/);
  if (!closingMatch) {
    console.error('Could not find end of object in', filePath);
    return;
  }

  const insertPos = content.lastIndexOf('\n', content.lastIndexOf('};'));

  // Build new content
  let newLines = `\n\n  // === AUTO-ADDED ${lang.toUpperCase()} TRANSLATIONS (from ES) ===\n`;

  let count = 0;
  for (const [key, value] of Object.entries(translations)) {
    const escaped = escapeForTS(value);
    newLines += `  ${key}: '${escaped}',\n`;
    count++;
  }

  // Insert before closing
  content = content.slice(0, insertPos) + newLines + content.slice(insertPos);

  fs.writeFileSync(filePath, content);
  console.log(`Added ${count} translations to ${path.basename(filePath)}`);
}

const localesDir = path.join(__dirname, '..', 'i18n', 'locales');

addTranslationsToFile(path.join(localesDir, 'ca.ts'), caTranslations, 'CA');
addTranslationsToFile(path.join(localesDir, 'fr.ts'), frTranslations, 'FR');

console.log('Done!');
