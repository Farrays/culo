#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES = ['es', 'ca', 'en', 'fr'];
const NAMESPACES = [
  'common', 'booking', 'schedule', 'calendar',
  'home', 'classes', 'blog', 'faq',
  'about', 'contact', 'pages'
];

console.log('╔═══════════════════════════════════════════════════════════════════╗');
console.log('║           VERIFICACIÓN RÁPIDA DE TRADUCCIONES                     ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝');

// Verificar que existan todos los archivos
console.log('\n📁 Verificando archivos...');
let allFilesExist = true;

for (const locale of LOCALES) {
  const localeDir = path.join(__dirname, `../i18n/locales/${locale}`);

  if (!fs.existsSync(localeDir)) {
    console.log(`❌ Directorio faltante: ${locale}/`);
    allFilesExist = false;
    continue;
  }

  for (const namespace of NAMESPACES) {
    const filePath = path.join(localeDir, `${namespace}.json`);
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Archivo faltante: ${locale}/${namespace}.json`);
      allFilesExist = false;
    }
  }
}

if (allFilesExist) {
  console.log(`✅ Todos los archivos existen (${LOCALES.length * NAMESPACES.length} archivos)`);
} else {
  console.log('\n⚠️  Algunos archivos no se encontraron');
  process.exit(1);
}

// Contar keys por namespace y locale
console.log('\n📊 Conteo de keys por namespace:\n');

const counts = {};
const totals = { es: 0, ca: 0, en: 0, fr: 0 };

for (const namespace of NAMESPACES) {
  counts[namespace] = {};

  for (const locale of LOCALES) {
    const filePath = path.join(__dirname, `../i18n/locales/${locale}/${namespace}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const keyCount = Object.keys(data).length;
    counts[namespace][locale] = keyCount;
    totals[locale] += keyCount;
  }
}

// Mostrar tabla
console.log('Namespace       │    ES │    CA │    EN │    FR │ Estado');
console.log('─'.repeat(70));

for (const namespace of NAMESPACES) {
  const es = counts[namespace].es;
  const ca = counts[namespace].ca;
  const en = counts[namespace].en;
  const fr = counts[namespace].fr;

  // Determinar estado
  let status = '✅';
  if (ca !== es || en !== es || fr !== es) {
    status = '⚠️';
  }

  console.log(
    `${namespace.padEnd(15)} │ ${String(es).padStart(5)} │ ${String(ca).padStart(5)} │ ${String(en).padStart(5)} │ ${String(fr).padStart(5)} │ ${status}`
  );
}

console.log('─'.repeat(70));
console.log(
  `${'TOTAL'.padEnd(15)} │ ${String(totals.es).padStart(5)} │ ${String(totals.ca).padStart(5)} │ ${String(totals.en).padStart(5)} │ ${String(totals.fr).padStart(5)} │`
);

// Resumen de diferencias
console.log('\n📈 Diferencias vs ES:\n');
console.log(`CA: ${totals.ca - totals.es >= 0 ? '+' : ''}${totals.ca - totals.es} keys (${((totals.ca / totals.es) * 100).toFixed(1)}% cobertura)`);
console.log(`EN: ${totals.en - totals.es >= 0 ? '+' : ''}${totals.en - totals.es} keys (${((totals.en / totals.es) * 100).toFixed(1)}% cobertura)`);
console.log(`FR: ${totals.fr - totals.es >= 0 ? '+' : ''}${totals.fr - totals.es} keys (${((totals.fr / totals.es) * 100).toFixed(1)}% cobertura)`);

// Identificar namespaces con diferencias
console.log('\n🔍 Namespaces con diferencias:\n');

let hasDifferences = false;
for (const namespace of NAMESPACES) {
  const es = counts[namespace].es;
  const ca = counts[namespace].ca;
  const en = counts[namespace].en;
  const fr = counts[namespace].fr;

  if (ca !== es || en !== es || fr !== es) {
    hasDifferences = true;
    console.log(`⚠️  ${namespace}.json`);
    if (ca !== es) console.log(`    CA: ${ca - es >= 0 ? '+' : ''}${ca - es} keys`);
    if (en !== es) console.log(`    EN: ${en - es >= 0 ? '+' : ''}${en - es} keys`);
    if (fr !== es) console.log(`    FR: ${fr - es >= 0 ? '+' : ''}${fr - es} keys`);
  }
}

if (!hasDifferences) {
  console.log('✅ No hay diferencias entre idiomas');
}

// Validar formato JSON
console.log('\n🔍 Validando formato JSON...');

let allValid = true;
for (const locale of LOCALES) {
  for (const namespace of NAMESPACES) {
    const filePath = path.join(__dirname, `../i18n/locales/${locale}/${namespace}.json`);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      JSON.parse(content);

      // Verificar que no contenga "export default"
      if (content.includes('export default')) {
        console.log(`❌ ${locale}/${namespace}.json contiene 'export default' (debe ser JSON puro)`);
        allValid = false;
      }
    } catch (err) {
      console.log(`❌ Error al parsear ${locale}/${namespace}.json: ${err.message}`);
      allValid = false;
    }
  }
}

if (allValid) {
  console.log('✅ Todos los archivos son JSON válido');
}

// Verificar muestras de contenido
console.log('\n🧪 Verificando muestras de contenido:\n');

const samples = [
  { locale: 'ca', namespace: 'booking', key: 'booking_title', expected: 'Reserva la teva Classe de Benvinguda' },
  { locale: 'en', namespace: 'booking', key: 'booking_title', expected: 'Book Your Welcome Class' },
  { locale: 'fr', namespace: 'booking', key: 'booking_title', expected: 'Réservez votre Cours de Bienvenue' },
  { locale: 'ca', namespace: 'common', key: 'pageTitle', expected: null }, // Solo verificar que existe
  { locale: 'en', namespace: 'schedule', key: 'schedule_title', expected: null }, // Solo verificar que existe
  { locale: 'fr', namespace: 'schedule', key: 'schedule_title', expected: 'Horaires des Cours' },
];

let allSamplesValid = true;
for (const sample of samples) {
  const filePath = path.join(__dirname, `../i18n/locales/${sample.locale}/${sample.namespace}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  if (!(sample.key in data)) {
    console.log(`❌ ${sample.locale}/${sample.namespace}.json: key "${sample.key}" no encontrada`);
    allSamplesValid = false;
  } else if (sample.expected && data[sample.key] !== sample.expected) {
    console.log(`❌ ${sample.locale}/${sample.namespace}.json: "${sample.key}" valor incorrecto`);
    console.log(`   Esperado: "${sample.expected}"`);
    console.log(`   Obtenido: "${data[sample.key]}"`);
    allSamplesValid = false;
  } else {
    console.log(`✅ ${sample.locale}/${sample.namespace}.json: "${sample.key}" OK`);
  }
}

// Resumen final
console.log('\n╔═══════════════════════════════════════════════════════════════════╗');
console.log('║                      RESUMEN FINAL                                ║');
console.log('╚═══════════════════════════════════════════════════════════════════╝\n');

console.log(`✅ Archivos verificados: ${LOCALES.length * NAMESPACES.length}`);
console.log(`✅ Total keys: ${totals.es + totals.ca + totals.en + totals.fr}`);
console.log(`${allFilesExist ? '✅' : '❌'} Todos los archivos existen`);
console.log(`${allValid ? '✅' : '❌'} Formato JSON válido`);
console.log(`${allSamplesValid ? '✅' : '❌'} Contenido de muestras correcto`);
console.log(`${hasDifferences ? '⚠️' : '✅'} ${hasDifferences ? 'Hay diferencias entre idiomas' : 'Paridad perfecta entre idiomas'}`);

if (allFilesExist && allValid && allSamplesValid) {
  console.log('\n🎉 VERIFICACIÓN EXITOSA');
  process.exit(0);
} else {
  console.log('\n⚠️  VERIFICACIÓN COMPLETADA CON ADVERTENCIAS');
  process.exit(hasDifferences ? 0 : 1);
}
