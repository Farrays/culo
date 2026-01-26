#!/usr/bin/env node
/**
 * Add missing salsaCubanaPrepareAvoid keys to all language files
 * These keys are used in the Prepare section of SalsaCubana pages
 */

import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'i18n', 'locales');

const avoidKeys = {
  es: {
    salsaCubanaPrepareAvoid: 'Evita:',
    salsaCubanaPrepareAvoidItem1: 'Joyas que puedan engancharse durante el baile en pareja',
    salsaCubanaPrepareAvoidItem2: 'Perfumes muy fuertes (estarás cerca de tu pareja)',
    salsaCubanaPrepareAvoidItem3: 'Miedo a equivocarte - aquí todos aprendemos juntos',
  },
  ca: {
    salsaCubanaPrepareAvoid: 'Evita:',
    salsaCubanaPrepareAvoidItem1: 'Joies que puguin enganxar-se durant el ball en parella',
    salsaCubanaPrepareAvoidItem2: 'Perfums molt forts (estaràs a prop de la teva parella)',
    salsaCubanaPrepareAvoidItem3: 'Por a equivocar-te - aquí tots aprenem junts',
  },
  en: {
    salsaCubanaPrepareAvoid: 'Avoid:',
    salsaCubanaPrepareAvoidItem1: 'Jewelry that could get caught while dancing with a partner',
    salsaCubanaPrepareAvoidItem2: 'Strong perfumes (you\'ll be close to your partner)',
    salsaCubanaPrepareAvoidItem3: 'Fear of making mistakes - we all learn together here',
  },
  fr: {
    salsaCubanaPrepareAvoid: 'Évitez :',
    salsaCubanaPrepareAvoidItem1: 'Les bijoux qui pourraient s\'accrocher pendant la danse en couple',
    salsaCubanaPrepareAvoidItem2: 'Les parfums trop forts (vous serez proche de votre partenaire)',
    salsaCubanaPrepareAvoidItem3: 'La peur de faire des erreurs - nous apprenons tous ensemble ici',
  },
};

const languages = ['es', 'ca', 'en', 'fr'];

languages.forEach((lang) => {
  const pagesFilePath = path.join(localesDir, lang, 'pages.json');

  if (!fs.existsSync(pagesFilePath)) {
    console.log(`⚠️  ${lang}/pages.json not found, skipping...`);
    return;
  }

  // Read existing pages.json
  const pagesData = JSON.parse(fs.readFileSync(pagesFilePath, 'utf-8'));

  // Add missing keys
  const keysToAdd = avoidKeys[lang];
  let addedCount = 0;

  Object.entries(keysToAdd).forEach(([key, value]) => {
    if (!pagesData[key]) {
      pagesData[key] = value;
      addedCount++;
      console.log(`✅ Added ${lang}: ${key}`);
    } else {
      console.log(`ℹ️  ${lang}: ${key} already exists`);
    }
  });

  if (addedCount > 0) {
    // Write back to file with proper formatting
    fs.writeFileSync(pagesFilePath, JSON.stringify(pagesData, null, 2) + '\n', 'utf-8');
    console.log(`✅ Updated ${lang}/pages.json with ${addedCount} keys\n`);
  } else {
    console.log(`ℹ️  No new keys added to ${lang}/pages.json\n`);
  }
});

console.log('🎉 Salsa Cubana avoid keys migration complete!');
