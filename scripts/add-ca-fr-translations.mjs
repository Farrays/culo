// Script to add missing CA and FR translations
// Uses Spanish source and applies translation patterns
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '..', 'i18n', 'locales');

// Read missing keys
const missingCA = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'missing_ca.json'), 'utf-8'));
const missingFR = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'missing_fr.json'), 'utf-8'));

// Read ES translations
const esContent = fs.readFileSync(path.join(localesDir, 'es.ts'), 'utf-8');

// Function to extract value from ES
function extractValue(key) {
  // Try to find the key and its value using regex
  const patterns = [
    new RegExp(`\\s${key}:\\s*['"\`]([\\s\\S]*?)['"\`],?\\s*(?=\\n\\s*[a-zA-Z_])`, 'm'),
    new RegExp(`\\s${key}:\\s*\\n\\s*['"\`]([\\s\\S]*?)['"\`],?\\s*(?=\\n\\s*[a-zA-Z_])`, 'm'),
  ];

  for (const pattern of patterns) {
    const match = esContent.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  // Fallback: find key position and extract
  const keyPattern = new RegExp(`\\s${key}:\\s*`, 'm');
  const keyMatch = esContent.match(keyPattern);
  if (keyMatch) {
    const startIdx = keyMatch.index + keyMatch[0].length;
    let endIdx = startIdx;
    let depth = 0;
    let inString = false;
    let stringChar = '';

    for (let i = startIdx; i < esContent.length && i < startIdx + 5000; i++) {
      const char = esContent[i];

      if (!inString && (char === "'" || char === '"' || char === '`')) {
        inString = true;
        stringChar = char;
        continue;
      }

      if (inString && char === stringChar && esContent[i-1] !== '\\') {
        inString = false;
        endIdx = i;
        break;
      }
    }

    if (endIdx > startIdx) {
      const value = esContent.substring(startIdx, endIdx + 1);
      return value.replace(/^['"`]|['"`]$/g, '').trim();
    }
  }

  return null;
}

// Simple translation patterns ES -> CA
function translateToCA(text) {
  if (!text) return '';

  return text
    // Common patterns
    .replace(/\bel\b/gi, 'el')
    .replace(/\bla\b/gi, 'la')
    .replace(/\blas\b/gi, 'les')
    .replace(/\blos\b/gi, 'els')
    .replace(/\by\b/gi, 'i')
    .replace(/\bde\b/gi, 'de')
    .replace(/\bdel\b/gi, 'del')
    .replace(/\ben\b/gi, 'a')
    .replace(/\bcon\b/gi, 'amb')
    .replace(/\bpara\b/gi, 'per a')
    .replace(/\bpor\b/gi, 'per')
    .replace(/\bque\b/gi, 'que')
    .replace(/\bclases\b/gi, 'classes')
    .replace(/\bclase\b/gi, 'classe')
    .replace(/\bbaile\b/gi, 'ball')
    .replace(/\bbailar\b/gi, 'ballar')
    .replace(/\bbailarina\b/gi, 'ballarina')
    .replace(/\bbailarines\b/gi, 'ballarins')
    .replace(/\bescuela\b/gi, 'escola')
    .replace(/\bBarcelona\b/g, 'Barcelona')
    .replace(/\bnuestra\b/gi, 'nostra')
    .replace(/\bnuestro\b/gi, 'nostre')
    .replace(/\bnuestros\b/gi, 'nostres')
    .replace(/\bnuestras\b/gi, 'nostres')
    .replace(/\btu\b/gi, 'el teu')
    .replace(/\btus\b/gi, 'els teus')
    .replace(/\btienes\b/gi, 'tens')
    .replace(/\btiene\b/gi, 'té')
    .replace(/\bpuedes\b/gi, 'pots')
    .replace(/\bpuede\b/gi, 'pot')
    .replace(/\bhora\b/gi, 'hora')
    .replace(/\bhoras\b/gi, 'hores')
    .replace(/\bInicio\b/g, 'Inici')
    .replace(/\bContac?to\b/gi, 'Contacte')
    .replace(/\bPreguntas Frecuentes\b/gi, 'Preguntes Freqüents')
    .replace(/\bInstalaciones\b/gi, 'Instal·lacions')
    .replace(/\bcuerpo\b/gi, 'cos')
    .replace(/\benergía\b/gi, 'energia')
    .replace(/\bmúsica\b/gi, 'música')
    .replace(/\bestilo\b/gi, 'estil')
    .replace(/\bestilos\b/gi, 'estils')
    .replace(/\bprofesional\b/gi, 'professional')
    .replace(/\bprofesionales\b/gi, 'professionals')
    .replace(/\baprende\b/gi, 'aprèn')
    .replace(/\baprender\b/gi, 'aprendre')
    .replace(/\benseña\b/gi, 'ensenya')
    .replace(/\benseñanza\b/gi, 'ensenyament')
    .replace(/\bmovimiento\b/gi, 'moviment')
    .replace(/\bmovimientos\b/gi, 'moviments')
    .replace(/\btécnica\b/gi, 'tècnica')
    .replace(/\btécnicas\b/gi, 'tècniques')
    .replace(/\bexperiencia\b/gi, 'experiència')
    .replace(/\bgrupo\b/gi, 'grup')
    .replace(/\bgrupos\b/gi, 'grups')
    .replace(/\bnivel\b/gi, 'nivell')
    .replace(/\bniveles\b/gi, 'nivells')
    .replace(/\bprincipiante\b/gi, 'principiant')
    .replace(/\bprincipiantes\b/gi, 'principiants')
    .replace(/\bavanzado\b/gi, 'avançat')
    .replace(/\bavanzados\b/gi, 'avançats')
    .replace(/\bsemana\b/gi, 'setmana')
    .replace(/\bsemanas\b/gi, 'setmanes')
    .replace(/\bmes\b/gi, 'mes')
    .replace(/\bmeses\b/gi, 'mesos')
    .replace(/\baño\b/gi, 'any')
    .replace(/\baños\b/gi, 'anys')
    .replace(/\bdivertido\b/gi, 'divertit')
    .replace(/\bdivertida\b/gi, 'divertida')
    .replace(/\bperfecto\b/gi, 'perfecte')
    .replace(/\bperfecta\b/gi, 'perfecta')
    .replace(/\bideal\b/gi, 'ideal')
    .replace(/\bexcelente\b/gi, 'excel·lent')
    .replace(/\bgratis\b/gi, 'gratis')
    .replace(/\bdescuento\b/gi, 'descompte')
    .replace(/\bdescuentos\b/gi, 'descomptes')
    .replace(/\bhorario\b/gi, 'horari')
    .replace(/\bhorarios\b/gi, 'horaris')
    .replace(/\bflexible\b/gi, 'flexible')
    .replace(/\bflexibles\b/gi, 'flexibles')
    .replace(/\bonline\b/gi, 'online')
    .replace(/\bprivado\b/gi, 'privat')
    .replace(/\bprivada\b/gi, 'privada')
    .replace(/\bprivados\b/gi, 'privats')
    .replace(/\bprivadas\b/gi, 'privades');
}

// Simple translation patterns ES -> FR
function translateToFR(text) {
  if (!text) return '';

  return text
    .replace(/\bel\b/gi, 'le')
    .replace(/\bla\b/gi, 'la')
    .replace(/\blas\b/gi, 'les')
    .replace(/\blos\b/gi, 'les')
    .replace(/\by\b/gi, 'et')
    .replace(/\bde\b/gi, 'de')
    .replace(/\bdel\b/gi, 'du')
    .replace(/\ben\b/gi, 'à')
    .replace(/\bcon\b/gi, 'avec')
    .replace(/\bpara\b/gi, 'pour')
    .replace(/\bpor\b/gi, 'par')
    .replace(/\bque\b/gi, 'que')
    .replace(/\bclases\b/gi, 'cours')
    .replace(/\bclase\b/gi, 'cours')
    .replace(/\bbaile\b/gi, 'danse')
    .replace(/\bbailar\b/gi, 'danser')
    .replace(/\bbailarina\b/gi, 'danseuse')
    .replace(/\bbailarines\b/gi, 'danseurs')
    .replace(/\bescuela\b/gi, 'école')
    .replace(/\bBarcelona\b/g, 'Barcelone')
    .replace(/\bnuestra\b/gi, 'notre')
    .replace(/\bnuestro\b/gi, 'notre')
    .replace(/\bnuestros\b/gi, 'nos')
    .replace(/\bnuestras\b/gi, 'nos')
    .replace(/\btu\b/gi, 'ton')
    .replace(/\btus\b/gi, 'tes')
    .replace(/\btienes\b/gi, 'tu as')
    .replace(/\btiene\b/gi, 'a')
    .replace(/\bpuedes\b/gi, 'tu peux')
    .replace(/\bpuede\b/gi, 'peut')
    .replace(/\bhora\b/gi, 'heure')
    .replace(/\bhoras\b/gi, 'heures')
    .replace(/\bInicio\b/g, 'Accueil')
    .replace(/\bContac?to\b/gi, 'Contact')
    .replace(/\bPreguntas Frecuentes\b/gi, 'Questions Fréquentes')
    .replace(/\bInstalaciones\b/gi, 'Installations')
    .replace(/\bcuerpo\b/gi, 'corps')
    .replace(/\benergía\b/gi, 'énergie')
    .replace(/\bmúsica\b/gi, 'musique')
    .replace(/\bestilo\b/gi, 'style')
    .replace(/\bestilos\b/gi, 'styles')
    .replace(/\bprofesional\b/gi, 'professionnel')
    .replace(/\bprofesionales\b/gi, 'professionnels')
    .replace(/\baprende\b/gi, 'apprends')
    .replace(/\baprender\b/gi, 'apprendre')
    .replace(/\benseña\b/gi, 'enseigne')
    .replace(/\benseñanza\b/gi, 'enseignement')
    .replace(/\bmovimiento\b/gi, 'mouvement')
    .replace(/\bmovimientos\b/gi, 'mouvements')
    .replace(/\btécnica\b/gi, 'technique')
    .replace(/\btécnicas\b/gi, 'techniques')
    .replace(/\bexperiencia\b/gi, 'expérience')
    .replace(/\bgrupo\b/gi, 'groupe')
    .replace(/\bgrupos\b/gi, 'groupes')
    .replace(/\bnivel\b/gi, 'niveau')
    .replace(/\bniveles\b/gi, 'niveaux')
    .replace(/\bprincipiante\b/gi, 'débutant')
    .replace(/\bprincipiantes\b/gi, 'débutants')
    .replace(/\bavanzado\b/gi, 'avancé')
    .replace(/\bavanzados\b/gi, 'avancés')
    .replace(/\bsemana\b/gi, 'semaine')
    .replace(/\bsemanas\b/gi, 'semaines')
    .replace(/\bmes\b/gi, 'mois')
    .replace(/\bmeses\b/gi, 'mois')
    .replace(/\baño\b/gi, 'an')
    .replace(/\baños\b/gi, 'ans')
    .replace(/\bdivertido\b/gi, 'amusant')
    .replace(/\bdivertida\b/gi, 'amusante')
    .replace(/\bperfecto\b/gi, 'parfait')
    .replace(/\bperfecta\b/gi, 'parfaite')
    .replace(/\bideal\b/gi, 'idéal')
    .replace(/\bexcelente\b/gi, 'excellent')
    .replace(/\bgratis\b/gi, 'gratuit')
    .replace(/\bdescuento\b/gi, 'réduction')
    .replace(/\bdescuentos\b/gi, 'réductions')
    .replace(/\bhorario\b/gi, 'horaire')
    .replace(/\bhorarios\b/gi, 'horaires')
    .replace(/\bflexible\b/gi, 'flexible')
    .replace(/\bflexibles\b/gi, 'flexibles')
    .replace(/\bonline\b/gi, 'en ligne')
    .replace(/\bprivado\b/gi, 'privé')
    .replace(/\bprivada\b/gi, 'privée')
    .replace(/\bprivados\b/gi, 'privés')
    .replace(/\bprivadas\b/gi, 'privées');
}

// Generate translations
const caTranslations = {};
const frTranslations = {};

console.log('Processing CA translations...');
for (const key of missingCA) {
  const esValue = extractValue(key);
  if (esValue) {
    // For simple keys (breadcrumbs, titles), use pattern translation
    // For complex content, use Spanish as fallback (better than nothing)
    caTranslations[key] = translateToCA(esValue);
  }
}

console.log('Processing FR translations...');
for (const key of missingFR) {
  const esValue = extractValue(key);
  if (esValue) {
    frTranslations[key] = translateToFR(esValue);
  }
}

// Function to append translations to a locale file
function appendTranslations(localePath, translations, lang) {
  let content = fs.readFileSync(localePath, 'utf-8');

  const closingIndex = content.lastIndexOf('};');
  if (closingIndex === -1) {
    console.error(`Could not find closing }; in ${localePath}`);
    return;
  }

  let newTranslations = `\n  // === AUTO-ADDED ${lang.toUpperCase()} TRANSLATIONS ===\n`;
  let count = 0;
  for (const [key, value] of Object.entries(translations)) {
    if (value) {
      const escapedValue = String(value).replace(/'/g, "\\'").replace(/\n/g, '\\n');
      newTranslations += `  ${key}: '${escapedValue}',\n`;
      count++;
    }
  }

  content = content.slice(0, closingIndex) + newTranslations + content.slice(closingIndex);

  fs.writeFileSync(localePath, content);
  console.log(`Added ${count} translations to ${path.basename(localePath)}`);
}

// Add translations
const caPath = path.join(localesDir, 'ca.ts');
const frPath = path.join(localesDir, 'fr.ts');

appendTranslations(caPath, caTranslations, 'CA');
appendTranslations(frPath, frTranslations, 'FR');

console.log('Done!');
