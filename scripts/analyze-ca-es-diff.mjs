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
function compareKeys(baseLocale, targetLocale, namespace) {
  const baseData = loadJSON(baseLocale, namespace);
  const targetData = loadJSON(targetLocale, namespace);

  const baseKeys = Object.keys(baseData);
  const targetKeys = Object.keys(targetData);

  const missing = baseKeys.filter(k => !targetKeys.includes(k));
  const extra = targetKeys.filter(k => !baseKeys.includes(k));

  return {
    missing,
    extra,
    baseCount: baseKeys.length,
    targetCount: targetKeys.length
  };
}

console.log('='.repeat(70));
console.log('ANÁLISIS DETALLADO: CA vs ES');
console.log('='.repeat(70));

// Analizar home.json
console.log('\n🏠 HOME.JSON');
console.log('-'.repeat(70));
const home = compareKeys('es', 'ca', 'home');
console.log(`ES: ${home.baseCount} keys | CA: ${home.targetCount} keys`);
console.log(`CA falta ${home.missing.length} keys de ES`);

if (home.missing.length > 0) {
  console.log('\nKeys que CA NO tiene pero ES sí:');
  home.missing.forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
}

if (home.extra.length > 0) {
  console.log(`\nCA tiene ${home.extra.length} keys extra que ES no tiene`);
  console.log('Keys extra en CA:');
  home.extra.slice(0, 10).forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
  if (home.extra.length > 10) {
    console.log(`  ... y ${home.extra.length - 10} más`);
  }
}

// Analizar classes.json
console.log('\n\n👨‍🏫 CLASSES.JSON');
console.log('-'.repeat(70));
const classes = compareKeys('es', 'ca', 'classes');
console.log(`ES: ${classes.baseCount} keys | CA: ${classes.targetCount} keys`);
console.log(`CA falta ${classes.missing.length} keys de ES`);

if (classes.missing.length > 0) {
  console.log('\nKeys que CA NO tiene pero ES sí:');
  classes.missing.forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
}

if (classes.extra.length > 0) {
  console.log(`\nCA tiene ${classes.extra.length} keys extra`);
}

// Analizar blog.json
console.log('\n\n📚 BLOG.JSON');
console.log('-'.repeat(70));
const blog = compareKeys('es', 'ca', 'blog');
console.log(`ES: ${blog.baseCount} keys | CA: ${blog.targetCount} keys`);
console.log(`CA falta ${blog.missing.length} keys de ES`);
console.log(`CA tiene ${blog.extra.length} keys extra que ES no tiene`);

if (blog.missing.length > 0) {
  console.log('\nPrimeras 15 keys que CA NO tiene:');
  blog.missing.slice(0, 15).forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
  if (blog.missing.length > 15) {
    console.log(`  ... y ${blog.missing.length - 15} más`);
  }
}

if (blog.extra.length > 0) {
  console.log('\nPrimeras 15 keys extra en CA:');
  blog.extra.slice(0, 15).forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
  if (blog.extra.length > 15) {
    console.log(`  ... y ${blog.extra.length - 15} más`);
  }
}

// Analizar pages.json
console.log('\n\n📄 PAGES.JSON');
console.log('-'.repeat(70));
const pages = compareKeys('es', 'ca', 'pages');
console.log(`ES: ${pages.baseCount} keys | CA: ${pages.targetCount} keys`);
console.log(`CA falta ${pages.missing.length} keys de ES`);
console.log(`CA tiene ${pages.extra.length} keys extra que ES no tiene`);

if (pages.missing.length > 0) {
  console.log('\nPrimeras 20 keys que CA NO tiene:');
  pages.missing.slice(0, 20).forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
  if (pages.missing.length > 20) {
    console.log(`  ... y ${pages.missing.length - 20} más`);
  }
}

if (pages.extra.length > 0) {
  console.log('\nPrimeras 20 keys extra en CA:');
  pages.extra.slice(0, 20).forEach((key, i) => {
    console.log(`  ${i + 1}. ${key}`);
  });
  if (pages.extra.length > 20) {
    console.log(`  ... y ${pages.extra.length - 20} más`);
  }
}

// Resumen
console.log('\n\n' + '='.repeat(70));
console.log('RESUMEN DE DIFERENCIAS CA vs ES');
console.log('='.repeat(70));

const summary = {
  home: { missing: home.missing.length, extra: home.extra.length },
  classes: { missing: classes.missing.length, extra: classes.extra.length },
  blog: { missing: blog.missing.length, extra: blog.extra.length },
  pages: { missing: pages.missing.length, extra: pages.extra.length }
};

console.log('\nNamespace       | CA falta | CA extra | Diferencia neta');
console.log('-'.repeat(70));
console.log(`home.json       | ${String(summary.home.missing).padStart(8)} | ${String(summary.home.extra).padStart(8)} | ${String(summary.home.extra - summary.home.missing).padStart(15)}`);
console.log(`classes.json    | ${String(summary.classes.missing).padStart(8)} | ${String(summary.classes.extra).padStart(8)} | ${String(summary.classes.extra - summary.classes.missing).padStart(15)}`);
console.log(`blog.json       | ${String(summary.blog.missing).padStart(8)} | ${String(summary.blog.extra).padStart(8)} | ${String(summary.blog.extra - summary.blog.missing).padStart(15)}`);
console.log(`pages.json      | ${String(summary.pages.missing).padStart(8)} | ${String(summary.pages.extra).padStart(8)} | ${String(summary.pages.extra - summary.pages.missing).padStart(15)}`);

const totalMissing = summary.home.missing + summary.classes.missing + summary.blog.missing + summary.pages.missing;
const totalExtra = summary.home.extra + summary.classes.extra + summary.blog.extra + summary.pages.extra;
console.log('-'.repeat(70));
console.log(`TOTAL           | ${String(totalMissing).padStart(8)} | ${String(totalExtra).padStart(8)} | ${String(totalExtra - totalMissing).padStart(15)}`);

console.log(`\nDiferencia total en el count: ${(13011 - 13049)} keys`);

// Guardar reporte
const report = {
  timestamp: new Date().toISOString(),
  comparison: 'CA vs ES',
  summary,
  details: {
    home: { missing: home.missing, extra: home.extra },
    classes: { missing: classes.missing, extra: classes.extra },
    blog: { missing: blog.missing, extra: blog.extra },
    pages: { missing: pages.missing, extra: pages.extra }
  }
};

const reportPath = path.join(__dirname, '../CA_ES_DIFFERENCES.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`\n📄 Reporte detallado guardado en: CA_ES_DIFFERENCES.json`);
