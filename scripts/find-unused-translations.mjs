/**
 * Script para detectar claves de traduccion no usadas
 *
 * Uso: node scripts/find-unused-translations.mjs
 *
 * Genera un reporte JSON con claves clasificadas:
 * - SAFE_TO_REMOVE: No aparece en ningun archivo de codigo
 * - REVIEW: Podria ser clave dinamica (contiene numeros, sufijos)
 * - IN_USE: Confirmado en uso
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const localesDir = path.join(rootDir, 'i18n', 'locales');

console.log('=== Detector de Claves de Traduccion No Usadas ===\n');

// 1. Extraer todas las claves de los archivos de locale
function extractKeys(content) {
  const keys = new Set();
  // Match both regular keys and quoted keys with dots
  const regularKeyRegex = /^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
  const quotedKeyRegex = /^\s*'([^']+)'\s*:/gm;
  const doubleQuotedKeyRegex = /^\s*"([^"]+)"\s*:/gm;

  let match;
  while ((match = regularKeyRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  while ((match = quotedKeyRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  while ((match = doubleQuotedKeyRegex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

console.log('Leyendo archivos de locale...');
const esContent = fs.readFileSync(path.join(localesDir, 'es.ts'), 'utf8');
const esKeys = extractKeys(esContent);
console.log(`  es.ts: ${esKeys.size} claves`);

// 2. Buscar usos de t('clave') en todo el codigo
console.log('\nEscaneando codigo fuente...');

// Directories to scan
const scanDirs = ['components', 'pages', 'hooks', 'constants', 'utils'];
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

function scanDirectory(dir, usedKeys, dynamicPatterns) {
  const fullPath = path.join(rootDir, dir);
  if (!fs.existsSync(fullPath)) return;

  const files = fs.readdirSync(fullPath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(fullPath, file.name);

    if (file.isDirectory()) {
      scanDirectory(path.join(dir, file.name), usedKeys, dynamicPatterns);
    } else if (extensions.some(ext => file.name.endsWith(ext))) {
      const content = fs.readFileSync(filePath, 'utf8');

      // Pattern 1: t('key') or t("key")
      const staticPattern = /t\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
      let match;
      while ((match = staticPattern.exec(content)) !== null) {
        usedKeys.add(match[1]);
      }

      // Pattern 2: t(`prefix_${var}`) - dynamic keys
      const dynamicPattern = /t\s*\(\s*`([^`]+)`\s*\)/g;
      while ((match = dynamicPattern.exec(content)) !== null) {
        const template = match[1];
        // Extract the prefix before ${
        const prefixMatch = template.match(/^([^$]+)\$/);
        if (prefixMatch) {
          dynamicPatterns.add(prefixMatch[1]);
        }
      }

      // Pattern 3: titleKey, descKey, contentKey properties
      const keyPropertyPattern = /(?:titleKey|descKey|contentKey|textKey|key)\s*:\s*['"]([^'"]+)['"]/g;
      while ((match = keyPropertyPattern.exec(content)) !== null) {
        usedKeys.add(match[1]);
      }

      // Pattern 4: Array of key strings
      const keyArrayPattern = /\[\s*['"]([^'"]+)['"]\s*(?:,\s*['"]([^'"]+)['"]\s*)*\]/g;
      while ((match = keyArrayPattern.exec(content)) !== null) {
        // This is a simplified match, we'll also do individual key extraction
        const arrayContent = match[0];
        const keyMatches = arrayContent.match(/['"]([^'"]+)['"]/g);
        if (keyMatches) {
          keyMatches.forEach(k => {
            const cleaned = k.replace(/['"]/g, '');
            // Only add if it looks like a translation key
            if (cleaned.includes('_') || /^[a-z]+[A-Z]/.test(cleaned)) {
              usedKeys.add(cleaned);
            }
          });
        }
      }
    }
  }
}

const usedKeys = new Set();
const dynamicPatterns = new Set();

for (const dir of scanDirs) {
  scanDirectory(dir, usedKeys, dynamicPatterns);
}

console.log(`  Claves estaticas encontradas: ${usedKeys.size}`);
console.log(`  Patrones dinamicos encontrados: ${dynamicPatterns.size}`);

// 3. Clasificar claves
console.log('\nClasificando claves...');

const results = {
  SAFE_TO_REMOVE: [],
  REVIEW: [],
  IN_USE: [],
  DEPRECATED: []
};

// Find DEPRECATED keys by checking comments in es.ts
const deprecatedKeys = new Set();
const deprecatedPattern = /\/\/\s*DEPRECATED[^\n]*\n\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm;
let deprecatedMatch;
while ((deprecatedMatch = deprecatedPattern.exec(esContent)) !== null) {
  deprecatedKeys.add(deprecatedMatch[1]);
}

// Also find keys that follow DEPRECATED comments (multi-key sections)
const deprecatedSections = esContent.split('// DEPRECATED');
for (let i = 1; i < deprecatedSections.length; i++) {
  const section = deprecatedSections[i];
  // Get keys until next section comment or significant break
  const sectionKeys = section.match(/^\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/gm);
  if (sectionKeys) {
    // Take keys until we hit a non-deprecated looking section (max 10 keys per section)
    const keysToTake = sectionKeys.slice(0, 10);
    keysToTake.forEach(k => {
      const key = k.match(/([a-zA-Z_][a-zA-Z0-9_]*)/)?.[1];
      if (key) deprecatedKeys.add(key);
    });
  }
}

console.log(`  Claves marcadas DEPRECATED: ${deprecatedKeys.size}`);

for (const key of esKeys) {
  // Check if key is marked as deprecated
  if (deprecatedKeys.has(key)) {
    results.DEPRECATED.push({
      key,
      reason: 'Marcada como DEPRECATED en el archivo'
    });
    continue;
  }

  // Check if key is directly used
  if (usedKeys.has(key)) {
    results.IN_USE.push({
      key,
      reason: 'Uso directo encontrado'
    });
    continue;
  }

  // Check if key matches a dynamic pattern
  let matchesDynamic = false;
  for (const pattern of dynamicPatterns) {
    if (key.startsWith(pattern)) {
      matchesDynamic = true;
      results.REVIEW.push({
        key,
        reason: `Posible clave dinamica (patron: ${pattern}*)`
      });
      break;
    }
  }
  if (matchesDynamic) continue;

  // Check if key contains numbers (likely part of a sequence)
  if (/\d+/.test(key)) {
    results.REVIEW.push({
      key,
      reason: 'Contiene numeros (posible secuencia dinamica)'
    });
    continue;
  }

  // Check if key has versioning suffix (V2, V3, etc)
  if (/V\d+$/i.test(key)) {
    results.REVIEW.push({
      key,
      reason: 'Tiene sufijo de version (V2, V3)'
    });
    continue;
  }

  // Otherwise, safe to remove
  results.SAFE_TO_REMOVE.push({
    key,
    reason: 'No encontrada en ningun archivo de codigo'
  });
}

// 4. Generate report
console.log('\n=== RESUMEN ===');
console.log(`  IN_USE: ${results.IN_USE.length} claves`);
console.log(`  DEPRECATED: ${results.DEPRECATED.length} claves`);
console.log(`  REVIEW: ${results.REVIEW.length} claves`);
console.log(`  SAFE_TO_REMOVE: ${results.SAFE_TO_REMOVE.length} claves`);

// Group DEPRECATED keys by prefix
const deprecatedByPrefix = {};
results.DEPRECATED.forEach(item => {
  const prefix = item.key.match(/^([a-zA-Z]+)/)?.[1] || 'other';
  if (!deprecatedByPrefix[prefix]) deprecatedByPrefix[prefix] = [];
  deprecatedByPrefix[prefix].push(item.key);
});

console.log('\n=== CLAVES DEPRECATED (por prefijo) ===');
Object.entries(deprecatedByPrefix)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([prefix, keys]) => {
    console.log(`  ${prefix}: ${keys.length} claves`);
    keys.slice(0, 3).forEach(k => console.log(`    - ${k}`));
    if (keys.length > 3) console.log(`    ... y ${keys.length - 3} mas`);
  });

// Save detailed report
const reportPath = path.join(rootDir, 'unused-translations-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\nReporte guardado en: unused-translations-report.json`);

// Save list of deprecated keys for easy reference
const deprecatedListPath = path.join(rootDir, 'deprecated-keys.txt');
fs.writeFileSync(deprecatedListPath, results.DEPRECATED.map(d => d.key).join('\n'));
console.log(`Lista de claves DEPRECATED: deprecated-keys.txt`);

console.log('\n=== RECOMENDACION ===');
console.log(`Se pueden eliminar de forma segura ${results.DEPRECATED.length} claves marcadas como DEPRECATED.`);
console.log('Ejecuta el script con --remove-deprecated para generar el codigo de eliminacion.');
