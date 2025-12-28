/**
 * Script para fusionar las traducciones generadas en los archivos de locale existentes
 * SOLO añade claves que no existen ya en el archivo
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '..', 'i18n', 'locales');
const generatedDir = path.join(__dirname, '..', 'i18n', 'generated');

// Función para extraer todas las claves existentes de un archivo de locale
function extractExistingKeys(content) {
  const keys = new Set();
  // Buscar patrones como: key: 'value', key: "value", key: `value`
  const regex = /^\s*(\w+):\s*[`'"]/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

// Leer las traducciones generadas
const languages = ['ca', 'en', 'fr'];

for (const lang of languages) {
  const generatedPath = path.join(generatedDir, `missing_${lang}.ts`);
  const localePath = path.join(localesDir, `${lang}.ts`);

  console.log(`\n📝 Processing ${lang.toUpperCase()}...`);

  // Leer archivo generado
  const generatedContent = fs.readFileSync(generatedPath, 'utf-8');

  // Extraer el objeto de traducciones del archivo generado
  const match = generatedContent.match(/export const generated_\w+ = ({[\s\S]*});/);
  if (!match) {
    console.log(`❌ Could not parse generated file for ${lang}`);
    continue;
  }

  let newTranslations;
  try {
    // Use Function constructor instead of eval (slightly safer, no access to local scope)
    // eslint-disable-next-line no-new-func
    newTranslations = new Function('return (' + match[1] + ')')();
  } catch (e) {
    console.log(`❌ Could not evaluate translations for ${lang}: ${e.message}`);
    continue;
  }

  // Leer archivo de locale existente
  let localeContent = fs.readFileSync(localePath, 'utf-8');

  // Extraer claves existentes
  const existingKeys = extractExistingKeys(localeContent);
  console.log(`   Found ${existingKeys.size} existing keys`);

  // Encontrar el final del objeto de exportación
  const lastBraceIndex = localeContent.lastIndexOf('};');

  if (lastBraceIndex === -1) {
    console.log(`❌ Could not find closing brace in ${lang}.ts`);
    continue;
  }

  // Filtrar solo las claves que NO existen
  const entries = Object.entries(newTranslations).filter(([key]) => !existingKeys.has(key));

  if (entries.length === 0) {
    console.log(`✅ No new translations needed for ${lang}.ts`);
    continue;
  }

  // Construir las nuevas entradas
  let newEntriesStr = '\n  // === Auto-generated translations (need review) ===\n';

  for (const [key, value] of entries) {
    const escapedValue =
      typeof value === 'string'
        ? value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${').replace(/\n/g, '\\n')
        : value;
    newEntriesStr += `  ${key}: \`${escapedValue}\`,\n`;
  }

  // Insertar antes del cierre
  const newContent =
    localeContent.slice(0, lastBraceIndex) + newEntriesStr + localeContent.slice(lastBraceIndex);

  // Escribir archivo actualizado
  fs.writeFileSync(localePath, newContent, 'utf-8');

  console.log(`✅ Added ${entries.length} NEW translations to ${lang}.ts (skipped ${Object.keys(newTranslations).length - entries.length} duplicates)`);
}

console.log('\n🎉 Merge complete!');
console.log('⚠️  Remember to review the auto-generated translations for quality.');
