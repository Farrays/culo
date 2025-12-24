import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the missing translations file
const missingTranslations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'missing_translations.json'), 'utf8')
);

console.log('='.repeat(100));
console.log('REPORTE DETALLADO DE TRADUCCIONES FALTANTES');
console.log('='.repeat(100));
console.log();
console.log(`Total de claves que faltan en TODOS los idiomas (CA, EN, FR): ${missingTranslations.length}`);
console.log();

// Group by prefix
const byPrefix = {};
missingTranslations.forEach(({ key, value }) => {
  const prefix = key.match(/^([a-zA-Z]+)/)?.[1] || 'other';
  if (!byPrefix[prefix]) {
    byPrefix[prefix] = [];
  }
  byPrefix[prefix].push({ key, value });
});

// Sort prefixes by count
const sortedPrefixes = Object.entries(byPrefix).sort((a, b) => b[1].length - a[1].length);

console.log('='.repeat(100));
console.log('RESUMEN POR PREFIJO (TODAS LAS CATEGORÍAS)');
console.log('='.repeat(100));
console.log();

sortedPrefixes.forEach(([prefix, items], index) => {
  console.log(`${(index + 1).toString().padStart(2)}. ${prefix.padEnd(35)} ${items.length.toString().padStart(4)} claves`);
});

console.log();
console.log('='.repeat(100));
console.log('DETALLES POR CATEGORÍA');
console.log('='.repeat(100));
console.log();

// Show top 15 categories with full details
sortedPrefixes.slice(0, 15).forEach(([prefix, items], index) => {
  console.log('-'.repeat(100));
  console.log(`${index + 1}. ${prefix.toUpperCase()} (${items.length} claves)`);
  console.log('-'.repeat(100));
  console.log();

  // Show all keys in this category
  items.forEach(({ key, value }) => {
    const displayValue = value.length > 80 ? value.substring(0, 77) + '...' : value;
    console.log(`  ${key}`);
    console.log(`    → "${displayValue}"`);
    console.log();
  });
});

// Generate a categorized report file
const categorizedReport = {
  summary: {
    totalMissingKeys: missingTranslations.length,
    totalCategories: sortedPrefixes.length,
    date: new Date().toISOString(),
  },
  byPrefix: {},
};

sortedPrefixes.forEach(([prefix, items]) => {
  categorizedReport.byPrefix[prefix] = {
    count: items.length,
    keys: items.map(({ key, value }) => ({ key, value })),
  };
});

const reportPath = path.join(__dirname, '..', 'missing_translations_categorized.json');
fs.writeFileSync(reportPath, JSON.stringify(categorizedReport, null, 2));

console.log('='.repeat(100));
console.log('ARCHIVOS GENERADOS');
console.log('='.repeat(100));
console.log();
console.log(`✓ missing_translations_categorized.json - Reporte organizado por categorías`);
console.log();

// Identify likely page associations
console.log('='.repeat(100));
console.log('PÁGINAS IDENTIFICADAS QUE NECESITAN TRADUCCIONES');
console.log('='.repeat(100));
console.log();

const pageMapping = {
  homev: 'Homepage V2',
  bachataV: 'Bachata V (nueva versión)',
  dhLeadModal: 'Dancehall - Lead Modal',
  dhLanding: 'Dancehall - Landing Page',
  dhExitIntent: 'Dancehall - Exit Intent Modal',
  dh: 'Dancehall',
  cuerpofit: 'Cuerpo-Fit',
  bailemanananas: 'Baile Mañanas',
  fullBodyCardio: 'Full Body Cardio',
  testClass: 'Test Class (Clase de Prueba)',
  fbLanding: 'Facebook Landing',
  danceClassesHub: 'Dance Classes Hub',
  blog: 'Blog',
  leadModal: 'Lead Modal (global)',
  nav: 'Navegación',
  twerkHero: 'Twerk - Hero',
  afroHero: 'Afro - Hero',
  sxrHero: 'Sexy Reggaeton - Hero',
  rcbHero: 'Reggaeton Cubano - Hero',
  femHero: 'Femenine Style - Hero',
  sexystyleHero: 'Sexy Style - Hero',
  modernjazzHero: 'Modern Jazz - Hero',
  balletHero: 'Ballet - Hero',
  contemporaneoHero: 'Contemporáneo - Hero',
  afrocontemporaneoHero: 'Afro Contemporáneo - Hero',
  afrojazzHero: 'Afro Jazz - Hero',
  hiphopHero: 'Hip Hop - Hero',
  salsaCubanaHero: 'Salsa Cubana - Hero',
};

const pageStats = {};
sortedPrefixes.forEach(([prefix, items]) => {
  // Try to match the prefix to a known page
  let matchedPage = null;
  for (const [key, pageName] of Object.entries(pageMapping)) {
    if (prefix.toLowerCase().startsWith(key.toLowerCase())) {
      matchedPage = pageName;
      break;
    }
  }

  if (matchedPage) {
    if (!pageStats[matchedPage]) {
      pageStats[matchedPage] = 0;
    }
    pageStats[matchedPage] += items.length;
  }
});

// Sort pages by number of missing keys
const sortedPages = Object.entries(pageStats).sort((a, b) => b[1] - a[1]);

sortedPages.forEach(([page, count], index) => {
  console.log(`${(index + 1).toString().padStart(2)}. ${page.padEnd(50)} ${count.toString().padStart(4)} claves`);
});

console.log();
console.log('='.repeat(100));
