import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'i18n', 'locales');

// Read all locale files
const esContent = fs.readFileSync(path.join(localesDir, 'es.ts'), 'utf8');
const caContent = fs.readFileSync(path.join(localesDir, 'ca.ts'), 'utf8');
const enContent = fs.readFileSync(path.join(localesDir, 'en.ts'), 'utf8');
const frContent = fs.readFileSync(path.join(localesDir, 'fr.ts'), 'utf8');

// Extract keys from each file
function extractKeys(content) {
  const keys = new Set();
  const regex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (!['export', 'default', 'const'].includes(match[1])) {
      keys.add(match[1]);
    }
  }
  return keys;
}

const esKeys = extractKeys(esContent);
const caKeys = extractKeys(caContent);
const enKeys = extractKeys(enContent);
const frKeys = extractKeys(frContent);

console.log('='.repeat(80));
console.log('ANÁLISIS INVERSO: CLAVES QUE ESTÁN EN OTROS IDIOMAS PERO NO EN ESPAÑOL');
console.log('='.repeat(80));
console.log();

// Find keys that are in other languages but NOT in Spanish
const extraInCA = [...caKeys].filter(key => !esKeys.has(key));
const extraInEN = [...enKeys].filter(key => !esKeys.has(key));
const extraInFR = [...frKeys].filter(key => !esKeys.has(key));

console.log('CLAVES EXTRA (no están en ES):');
console.log('-'.repeat(80));
console.log(`Claves extra en CA (catalán):  ${extraInCA.length} claves`);
console.log(`Claves extra en EN (inglés):   ${extraInEN.length} claves`);
console.log(`Claves extra en FR (francés):  ${extraInFR.length} claves`);
console.log('='.repeat(80));
console.log();

if (extraInCA.length > 0) {
  console.log('CLAVES EXTRA EN CA (catalán):');
  console.log('-'.repeat(80));
  extraInCA.sort().forEach(key => console.log(`  - ${key}`));
  console.log();
}

if (extraInEN.length > 0) {
  console.log('CLAVES EXTRA EN EN (inglés):');
  console.log('-'.repeat(80));
  extraInEN.sort().forEach(key => console.log(`  - ${key}`));
  console.log();
}

if (extraInFR.length > 0) {
  console.log('CLAVES EXTRA EN FR (francés):');
  console.log('-'.repeat(80));
  extraInFR.sort().forEach(key => console.log(`  - ${key}`));
  console.log();
}

// Now find what's ACTUALLY missing from other languages
const missingInCA = [...esKeys].filter(key => !caKeys.has(key));
const missingInEN = [...esKeys].filter(key => !enKeys.has(key));
const missingInFR = [...frKeys].filter(key => !frKeys.has(key));

console.log('='.repeat(80));
console.log('CLAVES QUE FALTAN EN OTROS IDIOMAS (están en ES pero no en otros):');
console.log('-'.repeat(80));
console.log(`Faltan en CA:  ${missingInCA.length} claves`);
console.log(`Faltan en EN:  ${missingInEN.length} claves`);
console.log(`Faltan en FR:  ${missingInFR.length} claves`);
console.log('='.repeat(80));
console.log();

if (missingInCA.length > 0) {
  console.log('FALTAN EN CA (catalán):');
  console.log('-'.repeat(80));
  missingInCA.sort().slice(0, 50).forEach(key => console.log(`  - ${key}`));
  if (missingInCA.length > 50) {
    console.log(`  ... y ${missingInCA.length - 50} más`);
  }
  console.log();
}

if (missingInEN.length > 0) {
  console.log('FALTAN EN EN (inglés):');
  console.log('-'.repeat(80));
  missingInEN.sort().slice(0, 50).forEach(key => console.log(`  - ${key}`));
  if (missingInEN.length > 50) {
    console.log(`  ... y ${missingInEN.length - 50} más`);
  }
  console.log();
}

if (missingInFR.length > 0) {
  console.log('FALTAN EN FR (francés):');
  console.log('-'.repeat(80));
  missingInFR.sort().slice(0, 50).forEach(key => console.log(`  - ${key}`));
  if (missingInFR.length > 50) {
    console.log(`  ... y ${missingInFR.length - 50} más`);
  }
  console.log();
}
