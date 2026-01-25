#!/usr/bin/env node
/**
 * Add Missing Translation Keys - Phase 3 i18next Migration
 * Enterprise-level script to add all missing translation keys
 */

import fs from 'fs';
import path from 'path';

const locales = ['es', 'ca', 'en', 'fr'];

// ============================================================================
// MISSING KEYS - PAGES.JSON
// ============================================================================
const pagesKeys = {
  // Femmology Levels - INTERMEDIO y AVANZADO
  femLevelInterTitle: 'Intermedio',
  femLevelInterDesc: 'Nivel intermedio para quienes ya dominan los fundamentos de Femmology. Coreografías más complejas y técnica refinada. Duración: 3-9 meses.',
  femLevelAdvancedTitle: 'Avanzado',
  femLevelAdvancedDesc: 'Nivel avanzado para bailarinas experimentadas. Floorwork avanzado, disociación corporal de élite y técnica de tacones de alto nivel. Duración: +9 meses.',

  // Salsa Lady Style V2 - Pillars Section (alternativa/duplicado)
  salsaLadyV2PillarsSectionTitle: 'El Método Farray®: Los 6 Pilares del Lady Style',
  salsaLadyV2PillarsSectionSubtitle: 'El sistema completo que desarrolla cada aspecto de tu técnica femenina',

  // Full Body Cardio - Video Section
  fullBodyCardioVideoTitle: 'Descubre el Entrenamiento Cuerpo-Fit en Acción',
  fullBodyCardioVideoDesc: 'Mira cómo nuestras clases combinan cardio intenso con movimientos funcionales al ritmo de la música. Verás ejercicios para todo el cuerpo, trabajo de core y tonificación. Todo en un ambiente divertido y motivador.',

  // Baile Mañanas - Prepare Section
  bailemanananasPrepareBe: 'Ven con ropa cómoda, zapatillas deportivas o pies descalzos (según la clase), agua y ganas de moverte. Todo lo demás lo ponemos nosotros.',
};

// ============================================================================
// MISSING KEYS - SCHEDULE.JSON
// ============================================================================
const scheduleKeys = {
  // Evening Danza Block Examples (con guiones y con underscores para compatibilidad)
  'horariosV2_block_evening-danza_ex1': 'Ballet Clásico 19:00h',
  'horariosV2_block_evening-danza_ex2': 'Afro Jazz 20:15h',
  'horariosV2_block_evening-danza_ex3': 'Contemporáneo 21:30h',
  horariosV2_block_evening_ex1: 'Ballet Clásico 19:00h',
  horariosV2_block_evening_ex2: 'Afro Jazz 20:15h',
  horariosV2_block_evening_ex3: 'Contemporáneo 21:30h',

  // Salsa Bachata Block Examples (con guiones y con underscores para compatibilidad)
  'horariosV2_block_salsa-bachata_ex1': 'Salsa Cubana 19:30h',
  'horariosV2_block_salsa-bachata_ex2': 'Bachata Sensual 20:30h',
  'horariosV2_block_salsa-bachata_ex3': 'Salsa Lady Style 21:30h',
  horariosV2_block_salsa_ex1: 'Salsa Cubana 19:30h',
  horariosV2_block_salsa_ex2: 'Bachata Sensual 20:30h',
  horariosV2_block_salsa_ex3: 'Salsa Lady Style 21:30h',
};

// ============================================================================
// FUNCTIONS
// ============================================================================

function addKeysToJSON(filePath, newKeys) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let added = 0;

    // Add missing keys
    for (const [key, value] of Object.entries(newKeys)) {
      if (!data[key]) {
        data[key] = value;
        added++;
      }
    }

    // Write back with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');

    return added;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

function copyKeysToOtherLanguages(sourceData, targetPath) {
  try {
    const targetData = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    let added = 0;

    // Copy keys from ES to other languages (using ES text temporarily)
    for (const key of Object.keys(sourceData)) {
      if (!targetData[key]) {
        targetData[key] = sourceData[key];
        added++;
      }
    }

    fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2) + '\n');
    return added;
  } catch (error) {
    console.error(`❌ Error processing ${targetPath}:`, error.message);
    return 0;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

console.log('🚀 Adding missing translation keys...\n');

// Add to pages.json
console.log('📄 Processing pages.json...');
for (const locale of locales) {
  const filePath = `i18n/locales/${locale}/pages.json`;
  const keys = locale === 'es' ? pagesKeys : pagesKeys; // Use ES text for all (temporary)
  const added = addKeysToJSON(filePath, keys);
  console.log(`   ${locale}: ${added} keys added to pages.json`);
}

// Add to schedule.json
console.log('\n📅 Processing schedule.json...');
for (const locale of locales) {
  const filePath = `i18n/locales/${locale}/schedule.json`;
  const keys = locale === 'es' ? scheduleKeys : scheduleKeys; // Use ES text for all (temporary)
  const added = addKeysToJSON(filePath, keys);
  console.log(`   ${locale}: ${added} keys added to schedule.json`);
}

console.log('\n✅ All missing keys have been added!');
console.log('\n📝 Summary:');
console.log(`   - Femmology levels: femLevelInterTitle/Desc, femLevelAdvancedTitle/Desc`);
console.log(`   - Salsa Lady V2: salsaLadyV2PillarsSectionTitle/Subtitle`);
console.log(`   - Full Body Cardio: fullBodyCardioVideoTitle/Desc`);
console.log(`   - Baile Mañanas: bailemanananasPrepareBe`);
console.log(`   - Schedule blocks: evening-danza_ex1/2/3, salsa-bachata_ex1/2/3`);
console.log(`   - Compatibility aliases: evening_ex1/2/3, salsa_ex1/2/3`);
console.log('\n🌍 Keys added to all 4 languages (ES, CA, EN, FR)');
console.log('⚠️  CA/EN/FR use Spanish text temporarily - translate later');
