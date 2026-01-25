/**
 * Enterprise Translation Audit Script - "Servicios" Section
 *
 * Audits translation completeness for service pages across 4 locales.
 *
 * Service Pages Audited:
 * - Clases Particulares: particularesPage_*
 * - Instalaciones: facilities*
 * - Horarios y Precios: horariosV2_*, horarios_*
 * - Team Building: teamBuilding*
 * - Eventos Privados: eventosPrivados*
 * - Servicios Baile: serviciosBaile*
 *
 * Usage: node scripts/audit-servicios-translations.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

// ============================================================================
// CONFIGURATION
// ============================================================================

// All service page key prefixes identified in the codebase
const SERVICE_PAGE_PREFIXES = [
  // Clases Particulares
  'particularesPage_',
  'particulares_',

  // Instalaciones
  'facilities',
  'facilitiesPage',

  // Horarios y Precios
  'horariosV2_',
  'horarios_',
  'pricing_',

  // Team Building
  'teamBuilding',
  'teamBuildingPage',

  // Eventos Privados
  'eventosPrivados',
  'eventosPrivadosPage',

  // Servicios de Baile
  'serviciosBaile',
  'serviciosBailePage',
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
 * Filter keys that belong to service pages
 */
function filterServiceKeys(allKeys) {
  return new Set(
    Array.from(allKeys).filter(key =>
      SERVICE_PAGE_PREFIXES.some(prefix => key.startsWith(prefix))
    )
  );
}

/**
 * Group keys by service page prefix
 */
function groupKeysByService(keys) {
  const groups = {};

  for (const key of keys) {
    const prefix = SERVICE_PAGE_PREFIXES.find(p => key.startsWith(p));
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

/**
 * Find critical gaps (pages with large translation differences)
 */
function findCriticalGaps(localeData) {
  const criticalGaps = [];
  const serviceGroups = {};

  // Group keys by service for each locale
  for (const locale of LOCALES) {
    serviceGroups[locale] = groupKeysByService(localeData[locale]);
  }

  // Compare each service across locales
  const allServices = new Set();
  for (const locale of LOCALES) {
    for (const service in serviceGroups[locale]) {
      allServices.add(service);
    }
  }

  for (const service of allServices) {
    const counts = {};
    for (const locale of LOCALES) {
      counts[locale] = (serviceGroups[locale][service] || []).length;
    }

    const max = Math.max(...Object.values(counts));
    const min = Math.min(...Object.values(counts));
    const gap = max - min;

    if (gap >= 3) { // Critical gap threshold: 3+ keys difference
      criticalGaps.push({
        service,
        gap,
        counts,
        maxLocale: Object.keys(counts).find(l => counts[l] === max),
        minLocale: Object.keys(counts).find(l => counts[l] === min),
      });
    }
  }

  // Sort by gap size (largest first)
  criticalGaps.sort((a, b) => b.gap - a.gap);

  return criticalGaps;
}

// ============================================================================
// MAIN AUDIT FUNCTION
// ============================================================================

async function auditTranslations() {
  console.log('\n🔍 ENTERPRISE TRANSLATION AUDIT - "SERVICIOS" SECTION\n');
  console.log('='.repeat(70));

  const report = {
    timestamp: new Date().toISOString(),
    summary: {},
    missing: {},
    extra: {},
    serviceBreakdown: {},
    criticalGaps: [],
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
    localeData[locale] = filterServiceKeys(allKeys);
    console.log(`   ✓ Found ${localeData[locale].size} service page keys`);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 2: Generate service breakdown per locale
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n📊 Step 2: Generating service breakdown...\n');

  for (const locale of LOCALES) {
    const serviceGroups = groupKeysByService(localeData[locale]);
    report.serviceBreakdown[locale] = {};

    for (const service in serviceGroups) {
      report.serviceBreakdown[locale][service] = serviceGroups[service].length;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 3: Find critical gaps
  // ──────────────────────────────────────────────────────────────────────────

  console.log('🔍 Step 3: Identifying critical translation gaps...\n');

  report.criticalGaps = findCriticalGaps(localeData);

  if (report.criticalGaps.length > 0) {
    console.log(`   ⚠️  Found ${report.criticalGaps.length} services with significant translation gaps:\n`);

    report.criticalGaps.slice(0, 10).forEach(gap => {
      console.log(`   ${gap.service}:`);
      console.log(`      Gap: ${gap.gap} keys`);
      console.log(`      Most complete: ${gap.maxLocale} (${gap.counts[gap.maxLocale]} keys)`);
      console.log(`      Least complete: ${gap.minLocale} (${gap.counts[gap.minLocale]} keys)`);
      console.log(`      Breakdown: ES=${gap.counts.es} CA=${gap.counts.ca} EN=${gap.counts.en} FR=${gap.counts.fr}\n`);
    });

    if (report.criticalGaps.length > 10) {
      console.log(`   ... and ${report.criticalGaps.length - 10} more gaps\n`);
    }
  } else {
    console.log(`   ✅ No critical gaps found (all services have <3 key difference)\n`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 4: Find missing keys per locale (compared to ES)
  // ──────────────────────────────────────────────────────────────────────────

  console.log('🔍 Step 4: Identifying missing keys per locale...\n');

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
  // STEP 5: Find keys missing in Spanish (CRITICAL)
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n🔍 Step 5: Checking if Spanish is missing keys (CRITICAL)...\n');

  const allOtherKeys = new Set();
  LOCALES.filter(l => l !== 'es').forEach(locale => {
    localeData[locale].forEach(k => allOtherKeys.add(k));
  });

  const missingInSpanish = Array.from(allOtherKeys).filter(k => !spanishKeys.has(k));
  if (missingInSpanish.length > 0) {
    report.missing.es = missingInSpanish.sort();
    console.log(`   ❌ CRITICAL: Spanish is missing ${missingInSpanish.length} keys!`);

    // Group missing keys by service
    const missingByService = groupKeysByService(new Set(missingInSpanish));
    console.log(`\n   Missing keys breakdown:`);
    for (const service in missingByService) {
      console.log(`      ${service}: ${missingByService[service].length} keys`);
    }
    console.log();
  } else {
    console.log(`   ✅ Spanish has all keys from other locales\n`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 6: Generate statistics
  // ──────────────────────────────────────────────────────────────────────────

  console.log('📊 Step 6: Generating statistics...\n');

  LOCALES.forEach(locale => {
    report.stats[locale] = {
      totalKeys: localeData[locale].size,
      byService: report.serviceBreakdown[locale],
    };
  });

  const totalMissing = Object.values(report.missing).reduce((sum, arr) => sum + arr.length, 0);

  report.summary = {
    totalKeysInSpanish: spanishKeys.size,
    localesWithMissingKeys: Object.keys(report.missing).length,
    totalMissingKeys: totalMissing,
    criticalGapsCount: report.criticalGaps.length,
    topCriticalGap: report.criticalGaps[0] || null,
    allLocalesComplete: totalMissing === 0 && report.criticalGaps.length === 0,
  };

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 7: Save report
  // ──────────────────────────────────────────────────────────────────────────

  const reportsDir = path.join(ROOT_DIR, 'audit-reports');
  fs.mkdirSync(reportsDir, { recursive: true });

  const reportPath = path.join(reportsDir, 'servicios-translations.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 8: Print final summary
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n' + '='.repeat(70));
  console.log('\n📋 FINAL SUMMARY\n');
  console.log(`   Total service keys in Spanish: ${spanishKeys.size}`);
  console.log(`   Locales with missing keys:     ${Object.keys(report.missing).length}`);
  console.log(`   Total missing keys:            ${totalMissing}`);
  console.log(`   Critical gaps (≥3 keys):       ${report.criticalGaps.length}`);

  if (report.criticalGaps.length > 0) {
    const top = report.criticalGaps[0];
    console.log(`\n   ⚠️  TOP CRITICAL GAP:`);
    console.log(`       Service: ${top.service}`);
    console.log(`       Gap size: ${top.gap} keys`);
    console.log(`       ${top.maxLocale}: ${top.counts[top.maxLocale]} keys (most complete)`);
    console.log(`       ${top.minLocale}: ${top.counts[top.minLocale]} keys (least complete)`);
  }

  if (missingInSpanish.length > 0) {
    console.log(`\n   ❌ CRITICAL: Spanish is missing ${missingInSpanish.length} keys!`);
  }

  if (totalMissing === 0 && report.criticalGaps.length === 0) {
    console.log(`\n   ✅ SUCCESS: All locales have complete and balanced translations!`);
  }

  console.log(`\n📄 Full report saved to: audit-reports/servicios-translations.json\n`);
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
