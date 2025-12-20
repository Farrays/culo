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
    keys.add(match[1]);
  }
  return keys;
}

const esKeys = extractKeys(esContent);
const caKeys = extractKeys(caContent);
const enKeys = extractKeys(enContent);
const frKeys = extractKeys(frContent);

console.log('Keys in ES:', esKeys.size);
console.log('Keys in CA:', caKeys.size);
console.log('Keys in EN:', enKeys.size);
console.log('Keys in FR:', frKeys.size);

// Find keys missing from all non-ES files
const missingFromAll = [...esKeys].filter(key =>
  !caKeys.has(key) && !enKeys.has(key) && !frKeys.has(key)
);

console.log('Missing from all 3:', missingFromAll.length);

// Extract key-value pairs from ES content
function extractKeyValuePairs(content, keys) {
  const results = [];

  for (const key of keys) {
    // Create regex to match the key and its value
    // Handles: key: "value", key: 'value', key: `value`
    const patterns = [
      new RegExp(`^\\s*${key}\\s*:\\s*"([^"]*)"`, 'm'),
      new RegExp(`^\\s*${key}\\s*:\\s*'([^']*)'`, 'm'),
      new RegExp(`^\\s*${key}\\s*:\\s*\`([^\`]*)\``, 'm'),
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        results.push({
          key,
          value: match[1],
        });
        break;
      }
    }
  }

  return results;
}

const missingKeyValues = extractKeyValuePairs(esContent, missingFromAll);

console.log('Extracted key-value pairs:', missingKeyValues.length);

// Save to JSON
const outputPath = path.join(__dirname, '..', 'missing_translations.json');
fs.writeFileSync(outputPath, JSON.stringify(missingKeyValues, null, 2));
console.log('Saved to missing_translations.json');

// Show samples grouped by prefix
const byPrefix = {};
missingKeyValues.forEach(kv => {
  const prefix = kv.key.match(/^([a-zA-Z]+)/)?.[1] || 'other';
  byPrefix[prefix] = (byPrefix[prefix] || 0) + 1;
});

console.log('\nMissing keys by prefix:');
Object.entries(byPrefix)
  .sort((a, b) => b[1] - a[1])
  .forEach(([prefix, count]) => {
    console.log(`  ${prefix}: ${count}`);
  });
