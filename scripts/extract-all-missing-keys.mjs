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

// Extract keys from each file using an improved regex that handles nested objects
function extractKeys(content) {
  const keys = new Set();

  // Match top-level keys (not inside nested objects)
  const regex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    // Skip common object keywords
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
console.log('RESUMEN DE CLAVES DE TRADUCCIÓN');
console.log('='.repeat(80));
console.log(`Total de claves en ES (español): ${esKeys.size}`);
console.log(`Total de claves en CA (catalán):  ${caKeys.size}`);
console.log(`Total de claves en EN (inglés):   ${enKeys.size}`);
console.log(`Total de claves en FR (francés):  ${frKeys.size}`);
console.log('='.repeat(80));
console.log();

// Find missing keys for each language
const missingInCA = [...esKeys].filter(key => !caKeys.has(key));
const missingInEN = [...esKeys].filter(key => !enKeys.has(key));
const missingInFR = [...esKeys].filter(key => !frKeys.has(key));

console.log('CLAVES FALTANTES POR IDIOMA:');
console.log('-'.repeat(80));
console.log(`Faltan en CA (catalán):  ${missingInCA.length} claves`);
console.log(`Faltan en EN (inglés):   ${missingInEN.length} claves`);
console.log(`Faltan en FR (francés):  ${missingInFR.length} claves`);
console.log('='.repeat(80));
console.log();

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

// Group keys by prefix
function groupByPrefix(keys) {
  const byPrefix = {};
  keys.forEach(key => {
    const prefix = key.match(/^([a-zA-Z]+)/)?.[1] || 'other';
    if (!byPrefix[prefix]) {
      byPrefix[prefix] = [];
    }
    byPrefix[prefix].push(key);
  });
  return byPrefix;
}

// Create detailed report for each language
const report = {
  summary: {
    esTotal: esKeys.size,
    caTotal: caKeys.size,
    enTotal: enKeys.size,
    frTotal: frKeys.size,
    missingInCA: missingInCA.length,
    missingInEN: missingInEN.length,
    missingInFR: missingInFR.length,
  },
  catalán: {
    total: missingInCA.length,
    keys: missingInCA.sort(),
    byPrefix: groupByPrefix(missingInCA),
    keyValuePairs: extractKeyValuePairs(esContent, missingInCA),
  },
  inglés: {
    total: missingInEN.length,
    keys: missingInEN.sort(),
    byPrefix: groupByPrefix(missingInEN),
    keyValuePairs: extractKeyValuePairs(esContent, missingInEN),
  },
  francés: {
    total: missingInFR.length,
    keys: missingInFR.sort(),
    byPrefix: groupByPrefix(missingInFR),
    keyValuePairs: extractKeyValuePairs(esContent, missingInFR),
  },
};

// Save comprehensive report
const outputPath = path.join(__dirname, '..', 'missing_translations_detailed.json');
fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log(`✓ Reporte completo guardado en: missing_translations_detailed.json`);
console.log();

// Display detailed breakdown for each language
['catalán', 'inglés', 'francés'].forEach((lang) => {
  const data = report[lang];
  console.log('='.repeat(80));
  console.log(`CLAVES FALTANTES EN ${lang.toUpperCase()} (${data.total} claves)`);
  console.log('='.repeat(80));

  // Show top 20 prefixes by count
  const sortedPrefixes = Object.entries(data.byPrefix)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 20);

  console.log('\nTop 20 prefijos con más claves faltantes:');
  console.log('-'.repeat(80));
  sortedPrefixes.forEach(([prefix, keys]) => {
    console.log(`  ${prefix.padEnd(30)} ${keys.length.toString().padStart(4)} claves`);
  });

  console.log();

  // Show sample keys for top 5 prefixes
  console.log('Ejemplos de claves faltantes (top 5 prefijos):');
  console.log('-'.repeat(80));
  sortedPrefixes.slice(0, 5).forEach(([prefix, keys]) => {
    console.log(`\n  ${prefix}: (${keys.length} claves)`);
    keys.slice(0, 5).forEach(key => {
      console.log(`    - ${key}`);
    });
    if (keys.length > 5) {
      console.log(`    ... y ${keys.length - 5} más`);
    }
  });

  console.log('\n');
});

// Save individual files for easy import
const caOutputPath = path.join(__dirname, '..', 'missing_translations_ca.json');
const enOutputPath = path.join(__dirname, '..', 'missing_translations_en.json');
const frOutputPath = path.join(__dirname, '..', 'missing_translations_fr.json');

fs.writeFileSync(caOutputPath, JSON.stringify(report.catalán.keyValuePairs, null, 2));
fs.writeFileSync(enOutputPath, JSON.stringify(report.inglés.keyValuePairs, null, 2));
fs.writeFileSync(frOutputPath, JSON.stringify(report.francés.keyValuePairs, null, 2));

console.log('='.repeat(80));
console.log('ARCHIVOS GENERADOS:');
console.log('-'.repeat(80));
console.log(`✓ missing_translations_detailed.json  - Reporte completo`);
console.log(`✓ missing_translations_ca.json        - ${report.catalán.keyValuePairs.length} claves para catalán`);
console.log(`✓ missing_translations_en.json        - ${report.inglés.keyValuePairs.length} claves para inglés`);
console.log(`✓ missing_translations_fr.json        - ${report.francés.keyValuePairs.length} claves para francés`);
console.log('='.repeat(80));
console.log();

// Show overlap analysis
const missingInAll = missingInCA.filter(key =>
  missingInEN.includes(key) && missingInFR.includes(key)
);
const missingInCAEN = missingInCA.filter(key =>
  missingInEN.includes(key) && !missingInFR.includes(key)
);
const missingInCAFR = missingInCA.filter(key =>
  missingInFR.includes(key) && !missingInEN.includes(key)
);
const missingInENFR = missingInEN.filter(key =>
  missingInFR.includes(key) && !missingInCA.includes(key)
);

console.log('ANÁLISIS DE SOLAPAMIENTO:');
console.log('-'.repeat(80));
console.log(`Claves faltantes en los 3 idiomas (CA, EN, FR):    ${missingInAll.length}`);
console.log(`Claves faltantes solo en CA y EN:                  ${missingInCAEN.length}`);
console.log(`Claves faltantes solo en CA y FR:                  ${missingInCAFR.length}`);
console.log(`Claves faltantes solo en EN y FR:                  ${missingInENFR.length}`);
console.log(`Claves faltantes solo en CA:                       ${missingInCA.length - missingInAll.length - missingInCAEN.length - missingInCAFR.length}`);
console.log(`Claves faltantes solo en EN:                       ${missingInEN.length - missingInAll.length - missingInCAEN.length - missingInENFR.length}`);
console.log(`Claves faltantes solo en FR:                       ${missingInFR.length - missingInAll.length - missingInCAFR.length - missingInENFR.length}`);
console.log('='.repeat(80));
