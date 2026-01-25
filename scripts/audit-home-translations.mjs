/**
 * Enterprise Translation Audit Script - HOME PAGE
 *
 * Audits translation completeness for home page across 4 locales.
 *
 * Usage: node scripts/audit-home-translations.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

// ============================================================================
// CONFIGURATION
// ============================================================================

const HOME_PREFIXES = [
  'home',
  'hero',
];

const LOCALES = ['es', 'ca', 'en', 'fr'];

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Extract all translation keys from a locale file
 */
function extractKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const keyPattern = /^\s+['"]?([a-zA-Z0-9_.\\-]+)['"]?\s*:/gm;
  const keys = new Set();
  let match;

  while ((match = keyPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return keys;
}

/**
 * Filter keys that belong to home page
 */
function filterHomeKeys(allKeys) {
  return new Set(
    Array.from(allKeys).filter(key =>
      HOME_PREFIXES.some(prefix => key.startsWith(prefix))
    )
  );
}

// ============================================================================
// MAIN AUDIT FUNCTION
// ============================================================================

async function auditTranslations() {
  console.log('\n🔍 ENTERPRISE TRANSLATION AUDIT - HOME PAGE\n');
  console.log('='.repeat(70));

  const report = {
    timestamp: new Date().toISOString(),
    summary: {},
    missing: {},
    extra: {},
    stats: {},
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
    localeData[locale] = filterHomeKeys(allKeys);
    console.log(`   ✓ Found ${localeData[locale].size} home page keys`);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 2: Find missing keys per locale (compared to ES)
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n🔍 Step 2: Identifying missing keys per locale...\n');

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
  // STEP 3: Find keys missing in Spanish (CRITICAL)
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n🔍 Step 3: Checking if Spanish is missing keys (CRITICAL)...\n');

  const allOtherKeys = new Set();
  LOCALES.filter(l => l !== 'es').forEach(locale => {
    localeData[locale].forEach(k => allOtherKeys.add(k));
  });

  const missingInSpanish = Array.from(allOtherKeys).filter(k => !spanishKeys.has(k));
  if (missingInSpanish.length > 0) {
    report.missing.es = missingInSpanish.sort();
    console.log(`   ❌ CRITICAL: Spanish is missing ${missingInSpanish.length} keys!`);
    console.log(`\n   Keys:`);
    missingInSpanish.forEach(key => console.log(`      - ${key}`));
    console.log();
  } else {
    console.log(`   ✅ Spanish has all keys from other locales\n`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 4: Find extra keys in other locales
  // ──────────────────────────────────────────────────────────────────────────

  console.log('🔍 Step 4: Identifying extra keys in other locales...\n');

  LOCALES.filter(l => l !== 'es').forEach(locale => {
    const extra = Array.from(localeData[locale]).filter(k => !spanishKeys.has(k));
    if (extra.length > 0) {
      report.extra[locale] = extra.sort();
      console.log(`   ℹ️  ${locale.toUpperCase()}: ${extra.length} extra keys (not in Spanish)`);
      extra.slice(0, 10).forEach(key => console.log(`      - ${key}`));
      if (extra.length > 10) console.log(`      ... and ${extra.length - 10} more`);
    }
  });

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 5: Generate statistics
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n📊 Step 5: Generating statistics...\n');

  LOCALES.forEach(locale => {
    report.stats[locale] = {
      totalKeys: localeData[locale].size,
    };
  });

  const totalMissing = Object.values(report.missing).reduce((sum, arr) => sum + arr.length, 0);

  report.summary = {
    totalKeysInSpanish: spanishKeys.size,
    localesWithMissingKeys: Object.keys(report.missing).length,
    totalMissingKeys: totalMissing,
    criticalIssue: missingInSpanish.length > 0
      ? `Spanish is missing ${missingInSpanish.length} keys!`
      : 'Spanish is complete',
    allLocalesComplete: totalMissing === 0,
  };

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 6: Save report
  // ──────────────────────────────────────────────────────────────────────────

  const reportsDir = path.join(ROOT_DIR, 'audit-reports');
  fs.mkdirSync(reportsDir, { recursive: true });

  const reportPath = path.join(reportsDir, 'home-translations.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 7: Print final summary
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n' + '='.repeat(70));
  console.log('\n📋 FINAL SUMMARY\n');
  console.log(`   Total home page keys in Spanish: ${spanishKeys.size}`);
  console.log(`   Locales with missing keys:       ${Object.keys(report.missing).length}`);
  console.log(`   Total missing keys:              ${totalMissing}`);

  if (missingInSpanish.length > 0) {
    console.log(`\n   ❌ CRITICAL: Spanish is missing ${missingInSpanish.length} keys!`);
  }

  if (totalMissing === 0) {
    console.log(`\n   ✅ SUCCESS: All locales have complete translations!`);
  }

  console.log(`\n📄 Full report saved to: audit-reports/home-translations.json\n`);
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
