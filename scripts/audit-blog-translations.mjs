/**
 * Enterprise Translation Audit Script - "BLOG" Section
 *
 * Audits translation completeness for blog pages across 4 locales.
 *
 * Blog Structure:
 * - 5 Categories: tutoriales, tips, historia, fitness, lifestyle
 * - 9 Articles: Multiple blog posts with extensive content
 * - Generic blog keys: blog_*
 * - Category keys: blog_category_*
 * - Article-specific keys: blogArticleName_*
 *
 * Articles Audited:
 * 1. baile-salud-mental (fitness)
 * 2. beneficios-bailar-salsa (lifestyle)
 * 3. clases-baile-principiantes-barcelona (tips)
 * 4. clases-de-salsa-barcelona (lifestyle)
 * 5. como-perder-miedo-bailar (lifestyle)
 * 6. historia-bachata-barcelona (historia)
 * 7. historia-salsa-barcelona (historia)
 * 8. salsa-ritmo-conquisto-mundo (tutoriales)
 * 9. salsa-vs-bachata (tutoriales)
 *
 * Usage: node scripts/audit-blog-translations.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, '..');

// ============================================================================
// CONFIGURATION
// ============================================================================

// All blog-related key prefixes
const BLOG_KEY_PREFIXES = [
  // Generic blog keys
  'blog_',

  // Article-specific keys (camelCase from filenames)
  'blogBaileSaludMental_',
  'blogBeneficiosBailarSalsa_',
  'blogClasesBailePrincipiantesBarcelona_',
  'blogClasesDeSalsaBarcelona_',
  'blogComoPerderMiedoBailar_',
  'blogHistoriaBachataBarcelona_',
  'blogHistoriaSalsaBarcelona_',
  'blogSalsaRitmoConquistoMundo_',
  'blogSalsaVsBachata_',
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
 * Filter keys that belong to blog
 */
function filterBlogKeys(allKeys) {
  return new Set(
    Array.from(allKeys).filter(key =>
      BLOG_KEY_PREFIXES.some(prefix => key.startsWith(prefix))
    )
  );
}

/**
 * Group keys by article/category
 */
function groupKeysByArticle(keys) {
  const groups = {
    generic: [], // blog_* (non-article specific)
    articles: {}, // blogArticleName_*
  };

  for (const key of keys) {
    // Check if it's a generic blog key
    if (key.startsWith('blog_')) {
      groups.generic.push(key);
    } else {
      // It's an article-specific key
      const articlePrefix = BLOG_KEY_PREFIXES.find(
        p => p !== 'blog_' && key.startsWith(p)
      );
      if (articlePrefix) {
        if (!groups.articles[articlePrefix]) {
          groups.articles[articlePrefix] = [];
        }
        groups.articles[articlePrefix].push(key);
      }
    }
  }

  // Sort keys within each group
  groups.generic.sort();
  for (const article in groups.articles) {
    groups.articles[article].sort();
  }

  return groups;
}

/**
 * Find critical gaps (articles with large translation differences)
 */
function findCriticalGaps(localeData) {
  const criticalGaps = [];
  const articleGroups = {};

  // Group keys by article for each locale
  for (const locale of LOCALES) {
    articleGroups[locale] = groupKeysByArticle(localeData[locale]);
  }

  // Compare generic blog keys across locales
  const genericCounts = {};
  for (const locale of LOCALES) {
    genericCounts[locale] = articleGroups[locale].generic.length;
  }

  const genericMax = Math.max(...Object.values(genericCounts));
  const genericMin = Math.min(...Object.values(genericCounts));
  const genericGap = genericMax - genericMin;

  if (genericGap >= 3) {
    criticalGaps.push({
      article: 'blog_generic',
      gap: genericGap,
      counts: genericCounts,
      maxLocale: Object.keys(genericCounts).find(l => genericCounts[l] === genericMax),
      minLocale: Object.keys(genericCounts).find(l => genericCounts[l] === genericMin),
    });
  }

  // Compare each article across locales
  const allArticles = new Set();
  for (const locale of LOCALES) {
    for (const article in articleGroups[locale].articles) {
      allArticles.add(article);
    }
  }

  for (const article of allArticles) {
    const counts = {};
    for (const locale of LOCALES) {
      counts[locale] = (articleGroups[locale].articles[article] || []).length;
    }

    const max = Math.max(...Object.values(counts));
    const min = Math.min(...Object.values(counts));
    const gap = max - min;

    if (gap >= 5) {
      // Critical gap threshold: 5+ keys for articles
      criticalGaps.push({
        article,
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
  console.log('\n🔍 ENTERPRISE TRANSLATION AUDIT - "BLOG" SECTION\n');
  console.log('='.repeat(70));

  const report = {
    timestamp: new Date().toISOString(),
    summary: {},
    missing: {},
    extra: {},
    breakdown: {},
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
    localeData[locale] = filterBlogKeys(allKeys);
    console.log(`   ✓ Found ${localeData[locale].size} blog keys`);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 2: Generate breakdown per locale
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n📊 Step 2: Generating breakdown by article...\n');

  for (const locale of LOCALES) {
    const grouped = groupKeysByArticle(localeData[locale]);
    report.breakdown[locale] = {
      generic: grouped.generic.length,
      articles: {},
    };

    for (const article in grouped.articles) {
      const cleanArticleName = article.replace(/^blog/, '').replace(/_$/, '');
      report.breakdown[locale].articles[cleanArticleName] = grouped.articles[article].length;
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 3: Find critical gaps
  // ──────────────────────────────────────────────────────────────────────────

  console.log('🔍 Step 3: Identifying critical translation gaps...\n');

  report.criticalGaps = findCriticalGaps(localeData);

  if (report.criticalGaps.length > 0) {
    console.log(`   ⚠️  Found ${report.criticalGaps.length} articles with significant translation gaps:\n`);

    report.criticalGaps.slice(0, 10).forEach(gap => {
      const cleanName = gap.article.replace(/^blog/, '').replace(/_$/, '');
      console.log(`   ${cleanName}:`);
      console.log(`      Gap: ${gap.gap} keys`);
      console.log(`      Most complete: ${gap.maxLocale} (${gap.counts[gap.maxLocale]} keys)`);
      console.log(`      Least complete: ${gap.minLocale} (${gap.counts[gap.minLocale]} keys)`);
      console.log(`      Breakdown: ES=${gap.counts.es} CA=${gap.counts.ca} EN=${gap.counts.en} FR=${gap.counts.fr}\n`);
    });

    if (report.criticalGaps.length > 10) {
      console.log(`   ... and ${report.criticalGaps.length - 10} more gaps\n`);
    }
  } else {
    console.log(`   ✅ No critical gaps found (all articles have <5 key difference)\n`);
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

    // Group missing keys by article
    const grouped = groupKeysByArticle(new Set(missingInSpanish));
    console.log(`\n   Missing keys breakdown:`);
    if (grouped.generic.length > 0) {
      console.log(`      blog_generic: ${grouped.generic.length} keys`);
    }
    for (const article in grouped.articles) {
      const cleanName = article.replace(/^blog/, '').replace(/_$/, '');
      console.log(`      ${cleanName}: ${grouped.articles[article].length} keys`);
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
      breakdown: report.breakdown[locale],
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

  const reportPath = path.join(reportsDir, 'blog-translations.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // ──────────────────────────────────────────────────────────────────────────
  // STEP 8: Print final summary
  // ──────────────────────────────────────────────────────────────────────────

  console.log('\n' + '='.repeat(70));
  console.log('\n📋 FINAL SUMMARY\n');
  console.log(`   Total blog keys in Spanish: ${spanishKeys.size}`);
  console.log(`   Locales with missing keys:  ${Object.keys(report.missing).length}`);
  console.log(`   Total missing keys:         ${totalMissing}`);
  console.log(`   Critical gaps (≥5 keys):    ${report.criticalGaps.length}`);

  if (report.criticalGaps.length > 0) {
    const top = report.criticalGaps[0];
    const cleanName = top.article.replace(/^blog/, '').replace(/_$/, '');
    console.log(`\n   ⚠️  TOP CRITICAL GAP:`);
    console.log(`       Article: ${cleanName}`);
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

  console.log(`\n📄 Full report saved to: audit-reports/blog-translations.json\n`);
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
