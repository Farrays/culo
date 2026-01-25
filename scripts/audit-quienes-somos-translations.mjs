/**
 * Enterprise Translation Audit Script - "Quienes Somos" Section
 *
 * Audits translation completeness for the 6 pages in the "Quienes Somos" menu:
 * 1. Sobre Nosotros (about_*)
 * 2. Yunaisy Farray (yunaisyFarray_*)
 * 3. Método Farray (metodoFarray_*)
 * 4. Profesores (teachersPage*, teacher.*)
 * 5. Instalaciones (facilities*)
 * 6. FAQ (faq_*)
 *
 * Usage: node scripts/audit-quienes-somos-translations.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

// ============================================================================
// CONFIGURATION
// ============================================================================

const QUIENES_SOMOS_PREFIXES = [
  'about_',
  'teachersPage',
  'teacher.',
  'yunaisyFarray_',
  'metodoFarray_',
  'faq_',
  'facilities',
];

const LOCALES = ['es', 'ca', 'en', 'fr'];

const COMPONENT_PATHS = [
  'components/AboutPage.tsx',
  'components/YunaisyFarrayPage.tsx',
  'components/MetodoFarrayPage.tsx',
  'components/pages/ProfesoresBaileBarcelonaPage.tsx',
  'components/FacilitiesPage.tsx',
  'components/FAQPage.tsx',
  'components/SocialAmenities.tsx', // Uses facilities keys
  'constants/teacher-registry.ts',
];

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Extract all translation keys from a locale file
 */
function extractKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Match patterns like:
  //   keyName: 'value',
  //   'key-name': 'value',
  //   keyName: `multiline
  //     value`,
  const keyPattern = /^\s+['"]?([a-zA-Z0-9_.\-]+)['"]?\s*:/gm;
  const keys = new Set();
  let match;

  while ((match = keyPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return keys;
}

/**
 * Filter keys that belong to "Quienes Somos" section
 */
function filterQuienesSomosKeys(allKeys) {
  return new Set(
    Array.from(allKeys).filter(key =>
      QUIENES_SOMOS_PREFIXES.some(prefix => key.startsWith(prefix))
    )
  );
}

/**
 * Extract t() calls from component files to find actually used keys
 */
async function extractUsedKeys(componentPaths) {
  const usedKeys = new Set();

  for (const componentPath of componentPaths) {
    const fullPath = path.join(ROOT_DIR, componentPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️  Component not found: ${componentPath}`);
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');

    // Match t('key'), t("key"), or t(`key`)
    const tCallPattern = /t\(['"` ]([a-zA-Z0-9_.\-]+)['"` ]\)/g;
    let match;

    while ((match = tCallPattern.exec(content)) !== null) {
      const key = match[1];
      // Only add keys that match our prefixes
      if (QUIENES_SOMOS_PREFIXES.some(prefix => key.startsWith(prefix))) {
        usedKeys.add(key);
      }
    }

    // Also match: canonicalSpecialtyKey: 'teacher.xxx.specialty'
    const canonicalPattern = /canonicalSpecialtyKey:\s*['"`]([^'"`]+)['"`]/g;
    while ((match = canonicalPattern.exec(content)) !== null) {
      usedKeys.add(match[1]);
    }

    const canonicalBioPattern = /canonicalBioKey:\s*['"`]([^'"`]+)['"`]/g;
    while ((match = canonicalBioPattern.exec(content)) !== null) {
      usedKeys.add(match[1]);
    }
  }

  return usedKeys;
}

/**
 * Group keys by prefix for better reporting
 */
function groupKeysByPrefix(keys) {
  const groups = {};

  for (const key of keys) {
    const prefix = QUIENES_SOMOS_PREFIXES.find(p => key.startsWith(p));
    if (prefix) {
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(key);
    }
  }

  // Sort keys within each group
  for (const prefix in groups) {
    groups[prefix].sort();
  }

  return groups;
}

// ============================================================================
// MAIN AUDIT FUNCTION
// ============================================================================

async function auditTranslations() {
  console.log('\n🔍 ENTERPRISE TRANSLATION AUDIT - "QUIENES SOMOS" SECTION\n');
  console.log('=' .repeat(70));

  const report = {
    timestamp: new Date().toISOString(),
    summary: {},
    missing: {},
    extra: {},
    unused: {},
    stats: {},
    usageAnalysis: {
      totalUsedKeys: 0,
      totalDefinedKeys: 0,
      unusedKeys: []
    },
  };

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 1: Extract keys from all locales
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n📂 Step 1: Extracting keys from locale files...\n');

  const localeData = {};
  LOCALES.forEach(locale => {
    const filePath = path.join(ROOT_DIR, `i18n/locales/${locale}.ts`);
    console.log(`   Reading ${locale}.ts...`);
    const allKeys = extractKeys(filePath);
    localeData[locale] = filterQuienesSomosKeys(allKeys);
    console.log(`   ✓ Found ${localeData[locale].size} "Quienes Somos" keys`);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 2: Extract actually used keys from components
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n🔎 Step 2: Analyzing component usage...\n');

  const usedKeys = await extractUsedKeys(COMPONENT_PATHS);
  console.log(`   ✓ Found ${usedKeys.size} keys actually used in components\n`);

  report.usageAnalysis.totalUsedKeys = usedKeys.size;
  report.usageAnalysis.totalDefinedKeys = localeData.es.size;

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 3: Generate statistics per locale
  // ──────────────────────────────────────────────────────────────────────────

  console.log('📊 Step 3: Generating statistics...\n');

  LOCALES.forEach(locale => {
    const keysByPrefix = groupKeysByPrefix(localeData[locale]);
    report.stats[locale] = {
      totalKeys: localeData[locale].size,
      byPrefix: {}
    };

    for (const prefix in keysByPrefix) {
      report.stats[locale].byPrefix[prefix] = keysByPrefix[prefix].length;
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 4: Find missing keys (keys in Spanish but not in other locales)
  // ──────────────────────────────────────────────────────────────────────────

  console.log('🔍 Step 4: Identifying missing translations...\n');

  const spanishKeys = localeData.es;

  LOCALES.filter(l => l !== 'es').forEach(locale => {
    const missing = Array.from(spanishKeys).filter(k => !localeData[locale].has(k));
    if (missing.length > 0) {
      report.missing[locale] = missing.sort();
      console.log(`   ⚠️  ${locale.toUpperCase()}: ${missing.length} keys missing`);
    } else {
      console.log(`   ✅ ${locale.toUpperCase()}: Complete (all Spanish keys present)`);
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 5: Find extra keys (keys in other locales but not in Spanish)
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n🔍 Step 5: Identifying extra keys in other locales...\n');

  LOCALES.filter(l => l !== 'es').forEach(locale => {
    const extra = Array.from(localeData[locale]).filter(k => !spanishKeys.has(k));
    if (extra.length > 0) {
      report.extra[locale] = extra.sort();
      console.log(`   ℹ️  ${locale.toUpperCase()}: ${extra.length} extra keys (not in Spanish)`);
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 6: Find keys missing in Spanish (CRITICAL)
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n🔍 Step 6: Checking if Spanish is missing keys (CRITICAL)...\n');

  const allOtherKeys = new Set();
  LOCALES.filter(l => l !== 'es').forEach(locale => {
    localeData[locale].forEach(k => allOtherKeys.add(k));
  });

  const missingInSpanish = Array.from(allOtherKeys).filter(k => !spanishKeys.has(k));
  if (missingInSpanish.length > 0) {
    report.missing.es = missingInSpanish.sort();
    console.log(`   ❌ CRITICAL: Spanish is missing ${missingInSpanish.length} keys!`);
    console.log(`   Keys: ${missingInSpanish.join(', ')}\n`);
  } else {
    console.log(`   ✅ Spanish has all keys from other locales\n`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 7: Identify unused (legacy) keys
  // ──────────────────────────────────────────────────────────────────────────

  console.log('🔍 Step 7: Identifying unused (legacy) keys...\n');

  const unusedInSpanish = Array.from(spanishKeys).filter(k => !usedKeys.has(k));
  if (unusedInSpanish.length > 0) {
    report.unused.es = unusedInSpanish.sort();
    console.log(`   ℹ️  Spanish has ${unusedInSpanish.length} defined but unused keys (legacy)`);
  }

  report.usageAnalysis.unusedKeys = unusedInSpanish;

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 8: Generate summary
  // ──────────────────────────────────────────────────────────────────────────

  const totalMissing = Object.values(report.missing).reduce((sum, arr) => sum + arr.length, 0);
  const localesWithMissing = Object.keys(report.missing).length;

  report.summary = {
    totalKeysInSpanish: spanishKeys.size,
    totalUsedKeys: usedKeys.size,
    totalUnusedKeys: unusedInSpanish.length,
    localesWithMissingKeys: localesWithMissing,
    totalMissingKeys: totalMissing,
    criticalIssue: missingInSpanish.length > 0
      ? `Spanish is missing ${missingInSpanish.length} keys!`
      : 'Spanish is complete',
    allLocalesComplete: localesWithMissing === 0,
  };

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 9: Save report
  // ──────────────────────────────────────────────────────────────────────────

  const reportsDir = path.join(ROOT_DIR, 'audit-reports');
  fs.mkdirSync(reportsDir, { recursive: true });

  const reportPath = path.join(reportsDir, 'quienes-somos-translations.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 10: Print final summary
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n' + '='.repeat(70));
  console.log('\n📋 FINAL SUMMARY\n');
  console.log(`   Total keys in Spanish:     ${spanishKeys.size}`);
  console.log(`   Actually used in code:     ${usedKeys.size}`);
  console.log(`   Unused (legacy) keys:      ${unusedInSpanish.length}`);
  console.log(`   Locales with missing keys: ${localesWithMissing}`);
  console.log(`   Total missing keys:        ${totalMissing}`);

  if (missingInSpanish.length > 0) {
    console.log(`\n   ❌ CRITICAL: Spanish is missing ${missingInSpanish.length} keys!`);
  }

  if (totalMissing === 0) {
    console.log(`\n   ✅ SUCCESS: All locales have complete translations!`);
  }

  console.log(`\n📄 Full report saved to: audit-reports/quienes-somos-translations.json\n`);
  console.log('='.repeat(70) + '\n');

  return report;
}

// ============================================================================
// RUN AUDIT
// ============================================================================

auditTranslations().catch(err => {
  console.error('❌ Audit failed:', err);
  process.exit(1);
});
