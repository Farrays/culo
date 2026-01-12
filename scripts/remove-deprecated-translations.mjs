/**
 * Script para eliminar claves de traduccion marcadas como DEPRECATED
 *
 * Uso: node scripts/remove-deprecated-translations.mjs
 *
 * Lee las claves de deprecated-keys.txt y las elimina de todos los archivos de locale
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');
const localesDir = path.join(rootDir, 'i18n', 'locales');

console.log('=== Eliminando Claves DEPRECATED ===\n');

// Read deprecated keys
const deprecatedKeysPath = path.join(rootDir, 'deprecated-keys.txt');
if (!fs.existsSync(deprecatedKeysPath)) {
  console.error('Error: deprecated-keys.txt no encontrado. Ejecuta primero find-unused-translations.mjs');
  process.exit(1);
}

const deprecatedKeys = new Set(
  fs.readFileSync(deprecatedKeysPath, 'utf8')
    .split('\n')
    .map(k => k.trim())
    .filter(k => k.length > 0)
);

console.log(`Claves a eliminar: ${deprecatedKeys.size}`);

// Process each locale file
const locales = ['es', 'en', 'ca', 'fr'];
const stats = {};

for (const locale of locales) {
  const filePath = path.join(localesDir, `${locale}.ts`);
  console.log(`\nProcesando ${locale}.ts...`);

  let content = fs.readFileSync(filePath, 'utf8');
  const originalLength = content.length;
  const originalLines = content.split('\n').length;

  // Count removed keys
  let removedCount = 0;

  // Remove each deprecated key
  for (const key of deprecatedKeys) {
    const beforeLength = content.length;

    // Pattern 1: Key with simple string value on same line
    // key: 'value',
    // key: "value",
    const simplePattern = new RegExp(
      `^\\s*${escapeRegex(key)}\\s*:\\s*['"][^'"]*['"],?\\s*\\n`,
      'gm'
    );
    content = content.replace(simplePattern, '');
    if (content.length < beforeLength) {
      removedCount++;
      continue;
    }

    // Pattern 2: Key with template literal (backticks)
    // key: `template value`,
    const templatePattern = new RegExp(
      `^\\s*${escapeRegex(key)}\\s*:\\s*\`[^\`]*\`,?\\s*\\n`,
      'gm'
    );
    content = content.replace(templatePattern, '');
    if (content.length < beforeLength) {
      removedCount++;
      continue;
    }

    // Pattern 3: Key with value on next line (multi-line format)
    // key:
    //     "long value here",
    // or
    // key:
    //     'long value here',
    const nextLinePattern = new RegExp(
      `^\\s*${escapeRegex(key)}\\s*:\\s*\\n\\s*["'][^"']*["'],?\\s*\\n`,
      'gm'
    );
    content = content.replace(nextLinePattern, '');
    if (content.length < beforeLength) {
      removedCount++;
      continue;
    }

    // Pattern 4: Key with escaped quotes in value on next line
    // key:
    //     "value with \\'escaped\\' quotes",
    const escapedQuotesPattern = new RegExp(
      `^\\s*${escapeRegex(key)}\\s*:\\s*\\n\\s*"[^"]*(?:\\\\"[^"]*)*",?\\s*\\n`,
      'gm'
    );
    content = content.replace(escapedQuotesPattern, '');
    if (content.length < beforeLength) {
      removedCount++;
      continue;
    }

    // Pattern 5: Fallback - match key: followed by content until trailing comma
    // This is more aggressive but handles edge cases
    const fallbackPattern = new RegExp(
      `^(\\s*)${escapeRegex(key)}\\s*:[\\s\\S]*?',\\s*\\n`,
      'm'
    );
    content = content.replace(fallbackPattern, '');
    if (content.length < beforeLength) {
      removedCount++;
    }
  }

  // Remove DEPRECATED comments (but only the isolated ones, not inline)
  content = content.replace(/^\s*\/\/\s*DEPRECATED[^\n]*\n/gm, '');

  // Clean up any resulting double blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  const newLength = content.length;
  const newLines = content.split('\n').length;

  stats[locale] = {
    originalLines,
    newLines,
    linesRemoved: originalLines - newLines,
    bytesRemoved: originalLength - newLength,
    keysRemoved: removedCount
  };

  // Write back
  fs.writeFileSync(filePath, content);
  console.log(`  Lineas eliminadas: ${stats[locale].linesRemoved}`);
  console.log(`  Bytes eliminados: ${stats[locale].bytesRemoved}`);
}

// Summary
console.log('\n=== RESUMEN ===');
console.log('| Locale | Lineas Eliminadas | Bytes Eliminados |');
console.log('|--------|-------------------|------------------|');
for (const locale of locales) {
  console.log(
    `| ${locale.padEnd(6)} | ${String(stats[locale].linesRemoved).padStart(17)} | ${String(stats[locale].bytesRemoved).padStart(16)} |`
  );
}

const totalLines = Object.values(stats).reduce((sum, s) => sum + s.linesRemoved, 0);
const totalBytes = Object.values(stats).reduce((sum, s) => sum + s.bytesRemoved, 0);
console.log(`| TOTAL  | ${String(totalLines).padStart(17)} | ${String(totalBytes).padStart(16)} |`);

console.log('\nArchivos actualizados correctamente.');
console.log('Ejecuta "npm run build" para verificar que todo funciona.');

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
