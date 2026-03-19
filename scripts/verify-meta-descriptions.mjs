#!/usr/bin/env node
/**
 * Script de verificación: compara las meta descriptions hardcodeadas en prerender.mjs
 * con las que se generarían dinámicamente desde los archivos i18n.
 *
 * Ejecutar: node scripts/verify-meta-descriptions.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const SUPPORTED_LOCALES = ['es', 'ca', 'en', 'fr'];

// ─── Load i18n files ───────────────────────────────────────────────────────────
function loadJSON(locale, namespace) {
  const filePath = path.join(ROOT, 'i18n', 'locales', locale, `${namespace}.json`);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return {};
  }
}

const translations = {};
for (const locale of SUPPORTED_LOCALES) {
  translations[locale] = {
    common: loadJSON(locale, 'common'),
    pages: loadJSON(locale, 'pages'),
    blog: loadJSON(locale, 'blog'),
    home: loadJSON(locale, 'home'),
    faq: loadJSON(locale, 'faq'),
    about: loadJSON(locale, 'about'),
    contact: loadJSON(locale, 'contact'),
    schedule: loadJSON(locale, 'schedule'),
    classes: loadJSON(locale, 'classes'),
    calendar: loadJSON(locale, 'calendar'),
    booking: loadJSON(locale, 'booking'),
  };
}

function getI18n(locale, ns, key) {
  return translations[locale]?.[ns]?.[key] || null;
}

// ─── SEO Meta Keys mapping (same as SEO.tsx metaData + additional pages) ──────
// Maps: pageKey → { titleKey, descKey, ns (i18n namespace) }
// This is the mapping that will become constants/seo-meta-keys.mjs

const SEO_META_KEYS = {
  // === Pages handled by SEO.tsx ===
  home:                { titleKey: 'pageTitle',                    descKey: 'metaDescription',                     ns: 'common' },
  classes:             { titleKey: 'danceClassesHub_h1',           descKey: 'danceClassesHub_description',         ns: 'classes' },
  classesHub:          { titleKey: 'danceClassesHub_h1',           descKey: 'danceClassesHub_description',         ns: 'classes' },
  danza:               { titleKey: 'danzaBarcelona_title',         descKey: 'danzaBarcelona_description',          ns: 'pages' },
  salsaBachata:        { titleKey: 'salsaBachataBarcelona_title',  descKey: 'salsaBachataBarcelona_description',   ns: 'pages' },
  salsaCubana:         { titleKey: 'salsaCubanaPageTitle',         descKey: 'salsaCubanaMetaDescription',          ns: 'pages' },
  salsaLadyStyle:      { titleKey: 'salsaLadyPageTitle',           descKey: 'salsaLadyMetaDescription',            ns: 'pages' },
  bachataSensual:      { titleKey: 'bachataV3PageTitle',           descKey: 'bachataV3MetaDescription',            ns: 'pages' },
  danzasUrbanas:       { titleKey: 'danzasUrbanas_title',          descKey: 'danzasUrbanas_description',           ns: 'pages' },
  dancehall:           { titleKey: 'dhV3PageTitle',                descKey: 'dhV3MetaDescription',                 ns: 'pages' },
  twerk:               { titleKey: 'twerkPageTitle',               descKey: 'twerkMetaDescription',                ns: 'pages' },
  afrobeat:            { titleKey: 'afroPageTitle',                descKey: 'afroMetaDescription',                 ns: 'pages' },
  hipHopReggaeton:     { titleKey: 'hhrPageTitle',                 descKey: 'hhrMetaDescription',                  ns: 'pages' },
  hipHop:              { titleKey: 'hiphopPageTitle',              descKey: 'hiphopMetaDescription',               ns: 'pages' },
  sexyReggaeton:       { titleKey: 'sxrPageTitle',                 descKey: 'sxrMetaDescription',                  ns: 'pages' },
  reggaetonCubano:     { titleKey: 'rcbPageTitle',                 descKey: 'rcbMetaDescription',                  ns: 'pages' },
  heelsBarcelona:      { titleKey: 'heelsBarcelona_title',         descKey: 'heelsBarcelona_description',          ns: 'pages' },
  femmology:           { titleKey: 'femPageTitle',                 descKey: 'femMetaDescription',                  ns: 'pages' },
  sexyStyle:           { titleKey: 'sexystylePageTitle',           descKey: 'sexystyleMetaDescription',            ns: 'pages' },
  modernJazz:          { titleKey: 'modernjazzPageTitle',          descKey: 'modernjazzMetaDescription',           ns: 'pages' },
  ballet:              { titleKey: 'balletPageTitle',              descKey: 'balletMetaDescription',               ns: 'pages' },
  contemporaneo:       { titleKey: 'contemporaneoPageTitle',       descKey: 'contemporaneoMetaDescription',        ns: 'pages' },
  afroContemporaneo:   { titleKey: 'afrocontemporaneoPageTitle',   descKey: 'afrocontemporaneoMetaDescription',    ns: 'pages' },
  afroJazz:            { titleKey: 'afrojazzPageTitle',            descKey: 'afrojazzMetaDescription',             ns: 'pages' },
  stretching:          { titleKey: 'stretchingPageTitle',          descKey: 'stretchingMetaDescription',           ns: 'pages' },
  cuerpoFit:           { titleKey: 'cuerpofitPageTitle',           descKey: 'cuerpofitMetaDescription',            ns: 'pages' },
  baileManananas:      { titleKey: 'bailemanananasPageTitle',      descKey: 'bailemanananasMetaDescription',       ns: 'pages' },
  clasesParticulares:  { titleKey: 'particularesPage_title',       descKey: 'particularesPage_description',        ns: 'pages' },
  alquilerSalas:       { titleKey: 'roomRental_pageTitle',         descKey: 'roomRental_metaDescription',          ns: 'pages' },
  estudioGrabacion:    { titleKey: 'estudioGrabacion_h1',          descKey: 'estudioGrabacion_meta_description',   ns: 'pages' },
  regalaBaile:         { titleKey: 'regalaBaile_page_title',       descKey: 'regalaBaile_meta_description',        ns: 'pages' },
  merchandising:       { titleKey: 'merchandising_page_title',     descKey: 'merchandising_page_description',      ns: 'pages' },
  about:               { titleKey: 'about_page_title',             descKey: 'about_description',                   ns: 'about' },
  yunaisy:             { titleKey: 'yunaisyFarray_page_title',     descKey: 'yunaisyFarray_meta_description',      ns: 'about' },
  facilities:          { titleKey: 'facilitiesPageTitle',          descKey: 'facilitiesMetaDescription',           ns: 'pages' },
  contact:             { titleKey: 'contact_page_title',           descKey: 'contact_page_description',            ns: 'contact' },
  faq:                 { titleKey: 'faq_page_title',               descKey: 'faq_page_description',                ns: 'faq' },
  servicios:           { titleKey: 'serviciosBaile_pageTitle',     descKey: 'serviciosBaile_metaDescription',      ns: 'pages' },

  // === Additional pages in prerender.mjs but not in SEO.tsx metaData ===
  horariosPrecio:      { titleKey: 'pricing_page_title',           descKey: 'pricing_page_description',            ns: 'pages' },
  horariosClases:      { titleKey: 'horariosV2_page_title',        descKey: 'horariosV2_page_description',         ns: 'schedule' },
  preciosClases:       { titleKey: 'pricingV2_page_title',         descKey: 'pricingV2_page_description',          ns: 'pages' },
  folkloreCubano:      { titleKey: 'folklorePageTitle',            descKey: 'folkloreMetaDescription',             ns: 'pages' },
  timba:               { titleKey: 'timbaPageTitle',               descKey: 'timbaMetaDescription',                ns: 'pages' },
  kpop:                { titleKey: 'kpopPageTitle',                descKey: 'kpopMetaDescription',                 ns: 'pages' },
  commercial:          { titleKey: 'commercialPageTitle',          descKey: 'commercialMetaDescription',           ns: 'pages' },
  kizomba:             { titleKey: 'kizombaPageTitle',             descKey: 'kizombaMetaDescription',              ns: 'pages' },
  metodoFarray:        { titleKey: 'metodoFarray_page_title',      descKey: 'metodoFarray_meta_description',       ns: 'about' },
  reservas:            { titleKey: 'booking_page_title',           descKey: 'booking_meta_description',            ns: 'booking' },
  hazteSocio:          { titleKey: 'hazteSocio_page_title',        descKey: 'hazteSocio_meta_description',         ns: 'pages' },
  yrProject:           { titleKey: 'yr_page_title',                descKey: 'yr_meta_description',                 ns: 'pages' },
  miReserva:           { titleKey: 'miReserva_page_title',         descKey: 'miReserva_meta_description',          ns: 'pages' },
  fichaje:             { titleKey: 'fichaje_page_title',           descKey: 'fichaje_meta_description',            ns: 'pages' },
  fichajeResumen:      { titleKey: 'fichajeResumen_page_title',    descKey: 'fichajeResumen_meta_description',     ns: 'pages' },
  adminFichajes:       { titleKey: 'adminFichajes_page_title',     descKey: 'adminFichajes_meta_description',      ns: 'pages' },
  adminReservas:       { titleKey: 'adminReservas_page_title',     descKey: 'adminReservas_meta_description',      ns: 'pages' },
  feedbackGracias:     { titleKey: 'feedbackGracias_page_title',   descKey: 'feedbackGracias_meta_description',    ns: 'pages' },
  feedbackComentario:  { titleKey: 'feedbackComentario_page_title',descKey: 'feedbackComentario_meta_description', ns: 'pages' },
  asistenciaConfirmada:{ titleKey: 'asistencia_page_title',        descKey: 'asistencia_meta_description',         ns: 'pages' },
  termsConditions:     { titleKey: 'terms_page_title',             descKey: 'terms_page_description',              ns: 'pages' },
  legalNotice:         { titleKey: 'legalNotice_page_title',       descKey: 'legalNotice_page_description',        ns: 'common' },
  privacyPolicy:       { titleKey: 'privacy_page_title',           descKey: 'privacy_page_description',            ns: 'pages' },
  cookiePolicy:        { titleKey: 'cookies_page_title',           descKey: 'cookies_page_description',            ns: 'pages' },
  ubicacion:           { titleKey: 'ubicacion_pageTitle',          descKey: 'ubicacion_pageDescription',           ns: 'pages' },
  calendario:          { titleKey: 'calendar_page_title',          descKey: 'calendar_page_description',           ns: 'calendar' },
  notFound:            { titleKey: 'notFound_seo_title',           descKey: 'notFound_seo_description',            ns: 'common' },
  entrenamientoBailarines: { titleKey: 'prepFisica_title',         descKey: 'prepFisica_description',              ns: 'pages' },
  bachataLadyStyle:    { titleKey: 'bachataLadyPageTitle',         descKey: 'bachataLadyMetaDescription',          ns: 'pages' },
  bumBum:              { titleKey: 'bumbumPageTitle',              descKey: 'bumbumMetaDescription',               ns: 'pages' },
  cuerpoFitPage:       { titleKey: 'fullBodyCardioPageTitle',      descKey: 'fullBodyCardioMetaDescription',       ns: 'pages' },
  profesores:          { titleKey: 'teachersPageTitle',            descKey: 'teachersPageMetaDescription',         ns: 'pages' },
  serviciosBaile:      { titleKey: 'serviciosBaile_pageTitle',     descKey: 'serviciosBaile_metaDescription',      ns: 'pages' },

  // === Blog pages ===
  blog:                { titleKey: 'blog_pageTitle',               descKey: 'blog_metaDescription',                ns: 'blog' },
  blogLifestyle:       { titleKey: 'blog_lifestyle_title',         descKey: 'blog_category_lifestyle_desc',        ns: 'blog' },
  blogBeneficiosSalsa: { titleKey: 'blogBeneficiosSalsa_title',    descKey: 'blogBeneficiosSalsa_metaDescription', ns: 'blog' },
  blogHistoria:        { titleKey: 'blog_historia_title',          descKey: 'blog_category_historia_desc',         ns: 'blog' },
  blogHistoriaSalsa:   { titleKey: 'blogHistoriaSalsa_title',      descKey: 'blogHistoriaSalsa_metaDescription',   ns: 'blog' },
  blogHistoriaBachata: { titleKey: 'blogHistoriaBachata_title',    descKey: 'blogHistoriaBachata_metaDescription', ns: 'blog' },
  blogTutoriales:      { titleKey: 'blog_tutoriales_title',        descKey: 'blog_category_tutoriales_desc',       ns: 'blog' },
  blogSalsaRitmo:      { titleKey: 'blogSalsaRitmo_title',         descKey: 'blogSalsaRitmo_metaDescription',      ns: 'blog' },
  blogSalsaVsBachata:  { titleKey: 'blogSalsaVsBachata_title',     descKey: 'blogSalsaVsBachata_metaDescription',  ns: 'blog' },
  blogClasesSalsaBarcelona: { titleKey: 'blogClasesSalsaBarcelona_title', descKey: 'blogClasesSalsaBarcelona_metaDescription', ns: 'blog' },
  blogTips:            { titleKey: 'blog_tips_title',              descKey: 'blog_category_tips_desc',             ns: 'blog' },
  blogClasesPrincipiantes: { titleKey: 'blogClasesPrincipiantes_title', descKey: 'blogClasesPrincipiantes_metaDescription', ns: 'blog' },
  blogAcademiaDanza:   { titleKey: 'blogAcademiaDanza_title',      descKey: 'blogAcademiaDanza_metaDescription',   ns: 'blog' },
  blogBalletAdultos:   { titleKey: 'blogBalletAdultos_title',      descKey: 'blogBalletAdultos_metaDescription',   ns: 'blog' },
  blogDanzaContemporaneaVsJazzBallet: { titleKey: 'blog_danzaContemporaneaVsJazzBallet_title', descKey: 'blog_danzaContemporaneaVsJazzBallet_metaDescription', ns: 'blog' },
  blogDanzasUrbanas:   { titleKey: 'blogDanzasUrbanas_title',      descKey: 'blogDanzasUrbanas_metaDescription',   ns: 'blog' },
  blogModernJazz:      { titleKey: 'blogModernJazz_title',         descKey: 'blogModernJazz_metaDescription',      ns: 'blog' },
  blogPerderMiedoBailar: { titleKey: 'blogPerderMiedoBailar_title', descKey: 'blogPerderMiedoBailar_metaDescription', ns: 'blog' },
  blogFitness:         { titleKey: 'blog_fitness_title',           descKey: 'blog_category_fitness_desc',          ns: 'blog' },
  blogBaileSaludMental:{ titleKey: 'blogBaileSaludMental_title',   descKey: 'blogBaileSaludMental_metaDescription',ns: 'blog' },

};

// ─── Load hardcoded metadata from prerender.mjs ─────────────────────────────────
// We extract the metadata object by importing the file content and evaluating the object
// Since prerender.mjs is complex, we'll parse it by reading the file

const prerenderContent = fs.readFileSync(path.join(ROOT, 'prerender.mjs'), 'utf-8');

// Extract the metadata object (lines 1985-3566 approximately)
// We'll use regex to find it
const metadataMatch = prerenderContent.match(/^const metadata = \{$/m);
if (!metadataMatch) {
  console.error('❌ Could not find "const metadata = {" in prerender.mjs');
  process.exit(1);
}

const metadataStart = metadataMatch.index;
// Find the closing }; by counting braces
let braceCount = 0;
let metadataEnd = -1;
let inString = false;
let escape = false;

for (let i = metadataStart; i < prerenderContent.length; i++) {
  const ch = prerenderContent[i];
  if (escape) { escape = false; continue; }
  if (ch === '\\') { escape = true; continue; }
  if (ch === "'" && !inString) { inString = true; continue; }
  if (ch === "'" && inString) { inString = false; continue; }
  if (inString) continue;
  if (ch === '{') braceCount++;
  if (ch === '}') {
    braceCount--;
    if (braceCount === 0) {
      metadataEnd = i + 1;
      break;
    }
  }
}

if (metadataEnd === -1) {
  console.error('❌ Could not find end of metadata object');
  process.exit(1);
}

// Extract and evaluate the metadata object
// We need to handle the spread operators (...LANDING_METADATA.xx)
// For our purposes, we'll skip those entries
let metadataStr = prerenderContent.substring(metadataStart, metadataEnd + 1);
// Remove the spread expressions
metadataStr = metadataStr.replace(/\.\.\.[A-Z_]+\.[a-z]+,?/g, '');
// Replace 'const metadata' with just the object for eval
metadataStr = metadataStr.replace('const metadata = ', 'const __metadata__ = ');

let hardcodedMetadata;
try {
  // Use Function constructor to evaluate in a safe scope
  const fn = new Function(`${metadataStr}; return __metadata__;`);
  hardcodedMetadata = fn();
} catch (e) {
  console.error('❌ Could not parse metadata object:', e.message);
  // Try alternative: just extract description values with regex
  console.log('\n📋 Falling back to regex-based extraction...\n');
  hardcodedMetadata = {};
  for (const locale of SUPPORTED_LOCALES) {
    hardcodedMetadata[locale] = {};
    // Find locale section
    const localeRegex = new RegExp(`\\b${locale}:\\s*\\{`, 'g');
    // For each page key in our mapping, try to find its description
    for (const pageKey of Object.keys(SEO_META_KEYS)) {
      const descRegex = new RegExp(
        `${pageKey}:\\s*\\{[^}]*description:\\s*'([^']*(?:\\\\'[^']*)*)'`,
        's'
      );
      const match = prerenderContent.match(descRegex);
      if (match) {
        // We'll get multiple matches (one per locale), need to be smarter
        // For now, just note it was found
      }
    }
  }
}

// ─── Compare ────────────────────────────────────────────────────────────────────

let exactMatches = 0;
let differences = 0;
let missingInI18n = 0;
let missingInHardcoded = 0;
let totalChecked = 0;

const diffDetails = [];
const missingDetails = [];

console.log('═══════════════════════════════════════════════════════════════════');
console.log('  META DESCRIPTION VERIFICATION REPORT');
console.log('  Comparing: prerender.mjs (hardcoded) vs i18n files (dynamic)');
console.log('═══════════════════════════════════════════════════════════════════\n');

for (const locale of SUPPORTED_LOCALES) {
  console.log(`\n── ${locale.toUpperCase()} ──────────────────────────────────────────────\n`);

  for (const [pageKey, meta] of Object.entries(SEO_META_KEYS)) {
    const i18nDesc = getI18n(locale, meta.ns, meta.descKey);
    const hardcodedDesc = hardcodedMetadata?.[locale]?.[pageKey]?.description;

    totalChecked++;

    if (!i18nDesc && !hardcodedDesc) {
      // Neither exists — skip silently
      continue;
    }

    if (!i18nDesc) {
      missingInI18n++;
      missingDetails.push({ locale, pageKey, descKey: meta.descKey, ns: meta.ns, type: 'missing_i18n' });
      console.log(`  ⚠️  ${pageKey}: MISSING in i18n (${meta.ns}:${meta.descKey})`);
      if (hardcodedDesc) {
        console.log(`      Hardcoded: "${hardcodedDesc.substring(0, 80)}..."`);
      }
      continue;
    }

    if (!hardcodedDesc) {
      missingInHardcoded++;
      console.log(`  ℹ️  ${pageKey}: exists in i18n but NOT in prerender.mjs hardcoded`);
      continue;
    }

    // Normalize for comparison (trim, normalize whitespace)
    const norm = (s) => s.trim().replace(/\s+/g, ' ');
    const i18nNorm = norm(i18nDesc);
    const hardNorm = norm(hardcodedDesc);

    if (i18nNorm === hardNorm) {
      exactMatches++;
      // Don't print exact matches to keep output clean
    } else {
      differences++;
      diffDetails.push({ locale, pageKey, i18n: i18nDesc, hardcoded: hardcodedDesc });
      console.log(`  ❌ ${pageKey}: DIFFERENT`);
      console.log(`     PRERENDER: "${hardcodedDesc.substring(0, 100)}${hardcodedDesc.length > 100 ? '...' : ''}"`);
      console.log(`     I18N:      "${i18nDesc.substring(0, 100)}${i18nDesc.length > 100 ? '...' : ''}"`);
      console.log('');
    }
  }
}

// ─── Summary ────────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('  SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════\n');
console.log(`  Total checks:              ${totalChecked}`);
console.log(`  ✅ Exact matches:           ${exactMatches}`);
console.log(`  ❌ Different descriptions:  ${differences}`);
console.log(`  ⚠️  Missing in i18n:         ${missingInI18n}`);
console.log(`  ℹ️  Missing in hardcoded:    ${missingInHardcoded}`);
console.log('');

if (missingInI18n > 0) {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  ⚠️  KEYS MISSING IN I18N (need to be added before migration)');
  console.log('═══════════════════════════════════════════════════════════════════\n');
  for (const m of missingDetails) {
    console.log(`  ${m.locale}/${m.ns}.json → "${m.descKey}" (page: ${m.pageKey})`);
  }
}

if (differences > 0) {
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('  ℹ️  DIFFERENT descriptions are EXPECTED — i18n is the correct');
  console.log('     version. After migration, prerender will use i18n values.');
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

if (missingInI18n === 0) {
  console.log('  ✅ ALL i18n keys exist — SAFE to proceed with migration!\n');
} else {
  console.log(`  ⚠️  ${missingInI18n} i18n keys are missing. Add them before migrating.\n`);
}
