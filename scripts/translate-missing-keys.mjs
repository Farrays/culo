#!/usr/bin/env node
/**
 * Translate Missing Keys to CA, EN, FR
 * Properly translates all keys that were added with Spanish text
 */

import fs from 'fs';

// Translations for all missing keys
const translations = {
  ca: {
    // Baile Mañanas - Prepare section
    bailemanananasPrepareBefore: 'Abans de venir',
    bailemanananasPrepareBe: 'Vine amb roba còmoda, sabatilles esportives o peus descalços (segons la classe), aigua i ganes de moure\'t. Tot la resta ho posem nosaltres.',

    // Femmology Levels
    femLevelInterTitle: 'Intermedi',
    femLevelInterDesc: 'Nivell intermedi per a qui ja dominen els fonaments de Femmology. Coreografies més complexes i tècnica refinada. Durada: 3-9 mesos.',
    femLevelAdvancedTitle: 'Avançat',
    femLevelAdvancedDesc: 'Nivell avançat per a balladores experimentades. Floorwork avançat, dissociació corporal d\'elit i tècnica de tacons d\'alt nivell. Durada: +9 mesos.',

    // Femmology Video
    femVideoTitle: 'Descobreix Femmology en Acció',

    // Salsa Lady V2
    salsaLadyV2PillarsSectionTitle: 'El Mètode Farray®: Els 6 Pilars del Lady Style',
    salsaLadyV2PillarsSectionSubtitle: 'El sistema complet que desenvolupa cada aspecte de la teva tècnica femenina',

    // Full Body Cardio
    fullBodyCardioVideoTitle: 'Descobreix l\'Entrenament Cuerpo-Fit en Acció',
    fullBodyCardioVideoDesc: 'Mira com les nostres classes combinen cardio intens amb moviments funcionals al ritme de la música. Veuràs exercicis per a tot el cos, treball de core i tonificació. Tot en un ambient divertit i motivador.',
  },

  en: {
    // Baile Mañanas - Prepare section
    bailemanananasPrepareBefore: 'Before arriving',
    bailemanananasPrepareBe: 'Come with comfortable clothing, sports shoes or bare feet (depending on the class), water and willingness to move. We provide everything else.',

    // Femmology Levels
    femLevelInterTitle: 'Intermediate',
    femLevelInterDesc: 'Intermediate level for those who already master the fundamentals of Femmology. More complex choreographies and refined technique. Duration: 3-9 months.',
    femLevelAdvancedTitle: 'Advanced',
    femLevelAdvancedDesc: 'Advanced level for experienced dancers. Advanced floorwork, elite body dissociation and high-level heels technique. Duration: +9 months.',

    // Femmology Video
    femVideoTitle: 'Discover Femmology in Action',

    // Salsa Lady V2
    salsaLadyV2PillarsSectionTitle: 'The Farray Method®: The 6 Pillars of Lady Style',
    salsaLadyV2PillarsSectionSubtitle: 'The complete system that develops every aspect of your feminine technique',

    // Full Body Cardio
    fullBodyCardioVideoTitle: 'Discover Cuerpo-Fit Training in Action',
    fullBodyCardioVideoDesc: 'Watch how our classes combine intense cardio with functional movements to the rhythm of music. You\'ll see full-body exercises, core work and toning. All in a fun and motivating atmosphere.',
  },

  fr: {
    // Baile Mañanas - Prepare section
    bailemanananasPrepareBefore: 'Avant d\'arriver',
    bailemanananasPrepareBe: 'Venez avec des vêtements confortables, des chaussures de sport ou pieds nus (selon le cours), de l\'eau et l\'envie de bouger. Nous fournissons tout le reste.',

    // Femmology Levels
    femLevelInterTitle: 'Intermédiaire',
    femLevelInterDesc: 'Niveau intermédiaire pour celles qui maîtrisent déjà les fondamentaux de Femmology. Chorégraphies plus complexes et technique raffinée. Durée: 3-9 mois.',
    femLevelAdvancedTitle: 'Avancé',
    femLevelAdvancedDesc: 'Niveau avancé pour danseuses expérimentées. Floorwork avancé, dissociation corporelle d\'élite et technique de talons de haut niveau. Durée: +9 mois.',

    // Femmology Video
    femVideoTitle: 'Découvrez Femmology en Action',

    // Salsa Lady V2
    salsaLadyV2PillarsSectionTitle: 'La Méthode Farray®: Les 6 Piliers du Lady Style',
    salsaLadyV2PillarsSectionSubtitle: 'Le système complet qui développe chaque aspect de votre technique féminine',

    // Full Body Cardio
    fullBodyCardioVideoTitle: 'Découvrez l\'Entraînement Cuerpo-Fit en Action',
    fullBodyCardioVideoDesc: 'Regardez comment nos cours combinent cardio intense avec des mouvements fonctionnels au rythme de la musique. Vous verrez des exercices pour tout le corps, travail du core et tonification. Le tout dans une ambiance amusante et motivante.',
  },
};

// Schedule translations
const scheduleTranslations = {
  ca: {
    'horariosV2_block_evening-danza_ex1': 'Ballet Clàssic 19:00h',
    'horariosV2_block_evening-danza_ex2': 'Afro Jazz 20:15h',
    'horariosV2_block_evening-danza_ex3': 'Contemporani 21:30h',
    horariosV2_block_evening_ex1: 'Ballet Clàssic 19:00h',
    horariosV2_block_evening_ex2: 'Afro Jazz 20:15h',
    horariosV2_block_evening_ex3: 'Contemporani 21:30h',
    'horariosV2_block_salsa-bachata_ex1': 'Salsa Cubana 19:30h',
    'horariosV2_block_salsa-bachata_ex2': 'Bachata Sensual 20:30h',
    'horariosV2_block_salsa-bachata_ex3': 'Salsa Lady Style 21:30h',
    horariosV2_block_salsa_ex1: 'Salsa Cubana 19:30h',
    horariosV2_block_salsa_ex2: 'Bachata Sensual 20:30h',
    horariosV2_block_salsa_ex3: 'Salsa Lady Style 21:30h',
  },
  en: {
    'horariosV2_block_evening-danza_ex1': 'Classical Ballet 7:00 PM',
    'horariosV2_block_evening-danza_ex2': 'Afro Jazz 8:15 PM',
    'horariosV2_block_evening-danza_ex3': 'Contemporary 9:30 PM',
    horariosV2_block_evening_ex1: 'Classical Ballet 7:00 PM',
    horariosV2_block_evening_ex2: 'Afro Jazz 8:15 PM',
    horariosV2_block_evening_ex3: 'Contemporary 9:30 PM',
    'horariosV2_block_salsa-bachata_ex1': 'Cuban Salsa 7:30 PM',
    'horariosV2_block_salsa-bachata_ex2': 'Sensual Bachata 8:30 PM',
    'horariosV2_block_salsa-bachata_ex3': 'Salsa Lady Style 9:30 PM',
    horariosV2_block_salsa_ex1: 'Cuban Salsa 7:30 PM',
    horariosV2_block_salsa_ex2: 'Sensual Bachata 8:30 PM',
    horariosV2_block_salsa_ex3: 'Salsa Lady Style 9:30 PM',
  },
  fr: {
    'horariosV2_block_evening-danza_ex1': 'Ballet Classique 19h00',
    'horariosV2_block_evening-danza_ex2': 'Afro Jazz 20h15',
    'horariosV2_block_evening-danza_ex3': 'Contemporain 21h30',
    horariosV2_block_evening_ex1: 'Ballet Classique 19h00',
    horariosV2_block_evening_ex2: 'Afro Jazz 20h15',
    horariosV2_block_evening_ex3: 'Contemporain 21h30',
    'horariosV2_block_salsa-bachata_ex1': 'Salsa Cubaine 19h30',
    'horariosV2_block_salsa-bachata_ex2': 'Bachata Sensuelle 20h30',
    'horariosV2_block_salsa-bachata_ex3': 'Salsa Lady Style 21h30',
    horariosV2_block_salsa_ex1: 'Salsa Cubaine 19h30',
    horariosV2_block_salsa_ex2: 'Bachata Sensuelle 20h30',
    horariosV2_block_salsa_ex3: 'Salsa Lady Style 21h30',
  },
};

function translateKeys(filePath, translationsObj) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let updated = 0;

    for (const [key, value] of Object.entries(translationsObj)) {
      if (data[key]) {
        data[key] = value;
        updated++;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    return updated;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

console.log('🌍 Translating keys to CA, EN, FR...\n');

// Translate pages.json
console.log('📄 Translating pages.json...');
for (const locale of ['ca', 'en', 'fr']) {
  const filePath = `i18n/locales/${locale}/pages.json`;
  const updated = translateKeys(filePath, translations[locale]);
  console.log(`   ${locale.toUpperCase()}: ${updated} keys translated`);
}

// Translate schedule.json
console.log('\n📅 Translating schedule.json...');
for (const locale of ['ca', 'en', 'fr']) {
  const filePath = `i18n/locales/${locale}/schedule.json`;
  const updated = translateKeys(filePath, scheduleTranslations[locale]);
  console.log(`   ${locale.toUpperCase()}: ${updated} keys translated`);
}

console.log('\n✅ All keys properly translated!');
console.log('\n🌍 Translations applied:');
console.log('   CA - Català');
console.log('   EN - English');
console.log('   FR - Français');
