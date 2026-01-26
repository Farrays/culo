#!/usr/bin/env node
/**
 * Add Baile Mañanas Video Keys
 * Adds missing video section keys for all languages
 */

import fs from 'fs';

const videoKeys = {
  es: {
    bailemanananasVideoTitle: 'Descubre las Clases de Baile de Mañanas en Acción',
    bailemanananasVideoDesc: 'Mira cómo nuestras clases matutinas combinan diferentes estilos de danza en un ambiente energizante y motivador. Desde Ballet y Contemporáneo hasta Afro Jazz y Sexy Style. Todo en horarios de mañana perfectos para empezar el día bailando.',
  },
  ca: {
    bailemanananasVideoTitle: 'Descobreix les Classes de Ball de Matins en Acció',
    bailemanananasVideoDesc: 'Mira com les nostres classes matinals combinen diferents estils de dansa en un ambient energitzant i motivador. Des de Ballet i Contemporani fins a Afro Jazz i Sexy Style. Tot en horaris de matí perfectes per començar el dia ballant.',
  },
  en: {
    bailemanananasVideoTitle: 'Discover Morning Dance Classes in Action',
    bailemanananasVideoDesc: 'Watch how our morning classes combine different dance styles in an energizing and motivating atmosphere. From Ballet and Contemporary to Afro Jazz and Sexy Style. All in perfect morning schedules to start your day dancing.',
  },
  fr: {
    bailemanananasVideoTitle: 'Découvrez les Cours de Danse du Matin en Action',
    bailemanananasVideoDesc: 'Regardez comment nos cours matinaux combinent différents styles de danse dans une atmosphère énergisante et motivante. Du Ballet et Contemporain à l\'Afro Jazz et Sexy Style. Tout dans des horaires matinaux parfaits pour commencer la journée en dansant.',
  },
};

function addKeysToJSON(filePath, keys) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let added = 0;

    for (const [key, value] of Object.entries(keys)) {
      if (!data[key]) {
        data[key] = value;
        added++;
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    return added;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

console.log('🎥 Adding Baile Mañanas video keys...\n');

for (const locale of ['es', 'ca', 'en', 'fr']) {
  const filePath = `i18n/locales/${locale}/pages.json`;
  const added = addKeysToJSON(filePath, videoKeys[locale]);
  console.log(`   ${locale.toUpperCase()}: ${added} video keys added`);
}

console.log('\n✅ Video keys added successfully!');
console.log('\n📝 Added:');
console.log('   - bailemanananasVideoTitle');
console.log('   - bailemanananasVideoDesc');
console.log('\n🌍 Languages: ES, CA, EN, FR');
