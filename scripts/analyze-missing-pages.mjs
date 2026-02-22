import fs from 'fs';

const es = JSON.parse(fs.readFileSync('i18n/locales/es/pages.json', 'utf8'));
const ca = JSON.parse(fs.readFileSync('i18n/locales/ca/pages.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('i18n/locales/en/pages.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('i18n/locales/fr/pages.json', 'utf8'));

const esKeys = Object.keys(es);
const missingCA = esKeys.filter(k => ca[k] === undefined);
const missingEN = esKeys.filter(k => en[k] === undefined);
const missingFR = esKeys.filter(k => fr[k] === undefined);

console.log('CA missing:', missingCA.length);
console.log('EN missing:', missingEN.length);
console.log('FR missing:', missingFR.length);

// Output ALL missing keys with their ES values (truncated)
console.log('\n=== ALL FR MISSING KEYS (superset) ===');
missingFR.forEach(k => {
  const val = es[k] || '';
  const short = val.length > 100 ? val.substring(0, 100) + '...' : val;
  console.log(`${k}: ${JSON.stringify(short)}`);
});

// Keys only in CA
const onlyCA = missingCA.filter(k => !missingEN.includes(k) && !missingFR.includes(k));
console.log('\n=== ONLY in CA (not in EN/FR) ===', onlyCA.length);
onlyCA.forEach(k => console.log(k));

// Keys in EN but not CA
const onlyEN = missingEN.filter(k => !missingCA.includes(k));
console.log('\n=== In EN but not CA ===', onlyEN.length);
onlyEN.forEach(k => console.log(k));

// Keys only in FR (not in EN)
const onlyFR = missingFR.filter(k => !missingEN.includes(k));
console.log('\n=== Only in FR (not in EN) ===', onlyFR.length);
onlyFR.forEach(k => console.log(k));
