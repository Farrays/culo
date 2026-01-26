import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para cargar un archivo JSON
function loadJSON(locale, namespace) {
  const filePath = path.join(__dirname, `../i18n/locales/${locale}/${namespace}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Función para comparar keys
function findMissingKeys(baseLocale, targetLocale, namespace) {
  const baseData = loadJSON(baseLocale, namespace);
  const targetData = loadJSON(targetLocale, namespace);

  const baseKeys = Object.keys(baseData);
  const targetKeys = Object.keys(targetData);

  const missing = baseKeys.filter(k => !targetKeys.includes(k));
  const extra = targetKeys.filter(k => !baseKeys.includes(k));

  return { missing, extra };
}

console.log('='.repeat(70));
console.log('ANÁLISIS DE KEYS FALTANTES');
console.log('='.repeat(70));

// 1. Blog: ES vs EN
console.log('\n📚 BLOG.JSON: ES → EN');
console.log('-'.repeat(70));
const blogEN = findMissingKeys('es', 'en', 'blog');
console.log(`Keys en ES pero NO en EN: ${blogEN.missing.length}`);
if (blogEN.missing.length > 0) {
  console.log('\nPrimeras 20 keys faltantes:');
  blogEN.missing.slice(0, 20).forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
  if (blogEN.missing.length > 20) {
    console.log(`  ... y ${blogEN.missing.length - 20} más`);
  }
}

console.log(`\nKeys en EN pero NO en ES: ${blogEN.extra.length}`);
if (blogEN.extra.length > 0) {
  console.log('Keys extra:');
  blogEN.extra.forEach(key => console.log(`  - ${key}`));
}

// 2. Blog: ES vs FR
console.log('\n\n📚 BLOG.JSON: ES → FR');
console.log('-'.repeat(70));
const blogFR = findMissingKeys('es', 'fr', 'blog');
console.log(`Keys en ES pero NO en FR: ${blogFR.missing.length}`);
if (blogFR.missing.length > 0) {
  console.log('\nPrimeras 20 keys faltantes:');
  blogFR.missing.slice(0, 20).forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
  if (blogFR.missing.length > 20) {
    console.log(`  ... y ${blogFR.missing.length - 20} más`);
  }
}

console.log(`\nKeys en FR pero NO en ES: ${blogFR.extra.length}`);
if (blogFR.extra.length > 0) {
  console.log('Keys extra:');
  blogFR.extra.forEach(key => console.log(`  - ${key}`));
}

// 3. Contact: ES vs FR
console.log('\n\n📧 CONTACT.JSON: ES → FR');
console.log('-'.repeat(70));
const contactFR = findMissingKeys('es', 'fr', 'contact');
console.log(`Keys en ES pero NO en FR: ${contactFR.missing.length}`);
if (contactFR.missing.length > 0) {
  console.log('\nKeys faltantes:');
  contactFR.missing.forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
}

console.log(`\nKeys en FR pero NO en ES: ${contactFR.extra.length}`);
if (contactFR.extra.length > 0) {
  console.log('Keys extra:');
  contactFR.extra.forEach(key => console.log(`  - ${key}`));
}

// 4. Comparar CA con ES para verificar integridad
console.log('\n\n🔍 VERIFICACIÓN: CA vs ES (todos los namespaces)');
console.log('-'.repeat(70));

const namespaces = [
  'common', 'booking', 'schedule', 'calendar',
  'home', 'classes', 'blog', 'faq',
  'about', 'contact', 'pages'
];

let totalDiscrepancies = 0;

for (const namespace of namespaces) {
  const result = findMissingKeys('es', 'ca', namespace);
  if (result.missing.length > 0 || result.extra.length > 0) {
    console.log(`\n❌ ${namespace}.json:`);
    if (result.missing.length > 0) {
      console.log(`   CA falta: ${result.missing.length} keys`);
      totalDiscrepancies += result.missing.length;
    }
    if (result.extra.length > 0) {
      console.log(`   CA tiene extra: ${result.extra.length} keys`);
    }
  }
}

if (totalDiscrepancies === 0) {
  console.log('\n✅ CA tiene todas las keys de ES en namespaces core');
}

// 5. Resumen final
console.log('\n\n' + '='.repeat(70));
console.log('RESUMEN FINAL');
console.log('='.repeat(70));
console.log(`\n📚 Blog EN: ${blogEN.missing.length} keys faltantes`);
console.log(`📚 Blog FR: ${blogFR.missing.length} keys faltantes`);
console.log(`📧 Contact FR: ${contactFR.missing.length} keys faltantes`);

// Guardar reporte detallado
const report = {
  timestamp: new Date().toISOString(),
  summary: {
    blogEN: { missing: blogEN.missing.length, extra: blogEN.extra.length },
    blogFR: { missing: blogFR.missing.length, extra: blogFR.extra.length },
    contactFR: { missing: contactFR.missing.length, extra: contactFR.extra.length }
  },
  details: {
    blogEN: { missing: blogEN.missing, extra: blogEN.extra },
    blogFR: { missing: blogFR.missing, extra: blogFR.extra },
    contactFR: { missing: contactFR.missing, extra: contactFR.extra }
  }
};

const reportPath = path.join(__dirname, '../MISSING_KEYS_REPORT.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n📄 Reporte detallado guardado en: MISSING_KEYS_REPORT.json`);
