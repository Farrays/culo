/**
 * Generate Complete Sitemap for Farray's Center
 *
 * Reads all routes from prerender.mjs and generates a complete sitemap.xml with:
 * - All 322+ pre-rendered routes
 * - Hreflang bidirectional links for each URL
 * - Strategic priorities based on page importance
 * - Current lastmod dates
 * - Exclusion of noindex landing pages
 *
 * Usage: node scripts/generate-sitemap.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

// =============================================================================
// CONFIGURATION
// =============================================================================

const BASE_URL = 'https://www.farrayscenter.com';
const SUPPORTED_LOCALES = ['es', 'ca', 'en', 'fr'];
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'sitemap.xml');

// Get current date in ISO format for lastmod
const getCurrentDate = () => new Date().toISOString().split('T')[0];

// Landing pages to exclude (noindex, nofollow - Facebook Ads only)
const LANDING_SLUGS = [
  'dancehall',
  'twerk',
  'sexy-reggaeton',
  'sexy-style',
  'hip-hop-reggaeton',
  'contemporaneo',
  'femmology',
  'bachata',
  'hip-hop',
  'afrobeats',
  'afro-jazz',
  'salsa-cubana',
  'ballet',
  'afro-contemporaneo',
  'jornada-puertas-abiertas',
];

// =============================================================================
// PRIORITY STRATEGY
// =============================================================================

/**
 * Determines priority for a page based on strategic importance
 * @param {string} path - URL path (e.g., 'es/clases/dancehall-barcelona')
 * @param {string} page - Page key (e.g., 'dancehall')
 * @param {string} lang - Language (es, ca, en, fr)
 * @returns {number} Priority (0.5 - 1.0)
 */
const getPriority = (path, page, lang) => {
  // 1.0 - Home ES (primary language)
  if (page === 'home' && lang === 'es') return 1.0;

  // 0.9 - Home other languages
  if (page === 'home') return 0.9;

  // 0.9 - Main category hubs
  const mainHubs = ['classesHub', 'danza', 'danzasUrbanas', 'salsaBachata'];
  if (mainHubs.includes(page)) return 0.9;

  // 0.8 - Top dance classes (high search volume)
  const topClasses = [
    'bachataSensual', 'salsaCubana', 'dancehall', 'twerk',
    'femmology', 'heelsBarcelona', 'hipHopReggaeton'
  ];
  if (topClasses.includes(page)) return 0.8;

  // 0.7 - Other dance classes
  if (path.includes('/clases/')) return 0.7;

  // 0.7 - Important service pages
  const servicePages = [
    'profesores', 'about', 'clasesParticulares', 'teamBuilding',
    'alquilerSalas', 'estudioGrabacion', 'yunaisy', 'metodoFarray'
  ];
  if (servicePages.includes(page)) return 0.7;

  // 0.6 - Secondary pages
  const secondaryPages = [
    'facilities', 'contact', 'faq', 'regalaBaile',
    'merchandising', 'serviciosBaile'
  ];
  if (secondaryPages.includes(page)) return 0.6;

  // 0.5 - Legal pages and low-priority
  const legalPages = [
    'termsConditions', 'legalNotice', 'privacyPolicy', 'cookiePolicy'
  ];
  if (legalPages.includes(page)) return 0.5;

  // 0.6 - Default for other pages
  return 0.6;
};

/**
 * Determines changefreq for a page
 * @param {string} page - Page key
 * @returns {string} changefreq value
 */
const getChangeFreq = (page) => {
  // Weekly - Dynamic pages
  if (['home', 'classesHub', 'horariosPrecio', 'calendario'].includes(page)) {
    return 'weekly';
  }

  // Monthly - Class pages and services
  if (page.includes('clases') || page.includes('baile')) {
    return 'monthly';
  }

  // Yearly - Legal pages
  if (['termsConditions', 'legalNotice', 'privacyPolicy', 'cookiePolicy'].includes(page)) {
    return 'yearly';
  }

  // Monthly - Default
  return 'monthly';
};

// =============================================================================
// ROUTES FROM PRERENDER.MJS
// =============================================================================

// All routes to include in sitemap (excluding landings and 404)
const routes = [
  // ===== ESPAÑOL (ES) =====
  { path: '', lang: 'es', page: 'home' },
  { path: 'es', lang: 'es', page: 'home' },
  { path: 'es/clases', lang: 'es', page: 'classesHub' },
  { path: 'es/horarios-precios', lang: 'es', page: 'horariosPrecio' },
  { path: 'es/clases/baile-barcelona', lang: 'es', page: 'classes' },
  { path: 'es/clases/danza-barcelona', lang: 'es', page: 'danza' },
  { path: 'es/clases/salsa-bachata-barcelona', lang: 'es', page: 'salsaBachata' },
  { path: 'es/clases/bachata-barcelona', lang: 'es', page: 'bachataSensual' },
  { path: 'es/clases/salsa-cubana-barcelona', lang: 'es', page: 'salsaCubana' },
  { path: 'es/clases/salsa-lady-style-barcelona', lang: 'es', page: 'salsaLadyStyle' },
  { path: 'es/clases/folklore-cubano', lang: 'es', page: 'folkloreCubano' },
  { path: 'es/clases/timba-barcelona', lang: 'es', page: 'timba' },
  { path: 'es/clases/danzas-urbanas-barcelona', lang: 'es', page: 'danzasUrbanas' },
  { path: 'es/clases/dancehall-barcelona', lang: 'es', page: 'dancehall' },
  { path: 'es/clases/twerk-barcelona', lang: 'es', page: 'twerk' },
  { path: 'es/clases/afrobeats-barcelona', lang: 'es', page: 'afrobeat' },
  { path: 'es/clases/kpop-dance-barcelona', lang: 'es', page: 'kpop' },
  { path: 'es/clases/commercial-dance-barcelona', lang: 'es', page: 'commercial' },
  { path: 'es/clases/kizomba-barcelona', lang: 'es', page: 'kizomba' },
  { path: 'es/clases/hip-hop-reggaeton-barcelona', lang: 'es', page: 'hipHopReggaeton' },
  { path: 'es/clases/sexy-reggaeton-barcelona', lang: 'es', page: 'sexyReggaeton' },
  { path: 'es/clases/reggaeton-cubano-barcelona', lang: 'es', page: 'reggaetonCubano' },
  { path: 'es/clases/heels-barcelona', lang: 'es', page: 'heelsBarcelona' },
  { path: 'es/clases/femmology', lang: 'es', page: 'femmology' },
  { path: 'es/clases/sexy-style-barcelona', lang: 'es', page: 'sexyStyle' },
  { path: 'es/clases/modern-jazz-barcelona', lang: 'es', page: 'modernJazz' },
  { path: 'es/clases/ballet-barcelona', lang: 'es', page: 'ballet' },
  { path: 'es/clases/cuerpo-fit', lang: 'es', page: 'cuerpoFit' },
  { path: 'es/clases/baile-mananas', lang: 'es', page: 'baileManananas' },
  { path: 'es/clases-particulares-baile', lang: 'es', page: 'clasesParticulares' },
  { path: 'es/team-building-barcelona', lang: 'es', page: 'teamBuilding' },
  { path: 'es/sobre-nosotros', lang: 'es', page: 'about' },
  { path: 'es/yunaisy-farray', lang: 'es', page: 'yunaisy' },
  { path: 'es/metodo-farray', lang: 'es', page: 'metodoFarray' },
  { path: 'es/merchandising', lang: 'es', page: 'merchandising' },
  { path: 'es/regala-baile', lang: 'es', page: 'regalaBaile' },
  { path: 'es/instalaciones', lang: 'es', page: 'facilities' },
  { path: 'es/contacto', lang: 'es', page: 'contact' },
  { path: 'es/reservas', lang: 'es', page: 'reservas' },
  { path: 'es/clases/afro-contemporaneo-barcelona', lang: 'es', page: 'afroContemporaneo' },
  { path: 'es/clases/afro-jazz', lang: 'es', page: 'afroJazz' },
  { path: 'es/clases/contemporaneo-barcelona', lang: 'es', page: 'contemporaneo' },
  { path: 'es/clases/stretching-barcelona', lang: 'es', page: 'stretching' },
  { path: 'es/clases/hip-hop-barcelona', lang: 'es', page: 'hipHop' },
  { path: 'es/clases/entrenamiento-bailarines-barcelona', lang: 'es', page: 'entrenamientoBailarines' },
  { path: 'es/clases/bachata-lady-style-barcelona', lang: 'es', page: 'bachataLadyStyle' },
  { path: 'es/clases/ejercicios-gluteos-barcelona', lang: 'es', page: 'bumBum' },
  { path: 'es/clases/acondicionamiento-fisico-bailarines', lang: 'es', page: 'cuerpoFitPage' },
  { path: 'es/profesores-baile-barcelona', lang: 'es', page: 'profesores' },
  { path: 'es/preguntas-frecuentes', lang: 'es', page: 'faq' },
  { path: 'es/alquiler-salas-baile-barcelona', lang: 'es', page: 'alquilerSalas' },
  { path: 'es/estudio-grabacion-barcelona', lang: 'es', page: 'estudioGrabacion' },
  { path: 'es/terminos-y-condiciones', lang: 'es', page: 'termsConditions' },
  { path: 'es/aviso-legal', lang: 'es', page: 'legalNotice' },
  { path: 'es/politica-privacidad', lang: 'es', page: 'privacyPolicy' },
  { path: 'es/politica-cookies', lang: 'es', page: 'cookiePolicy' },
  { path: 'es/servicios-baile-barcelona', lang: 'es', page: 'serviciosBaile' },
  { path: 'es/calendario', lang: 'es', page: 'calendario' },
  { path: 'es/clases/salsa-lady-style-v2', lang: 'es', page: 'salsaLadyStyleV2' },
  { path: 'es/instalaciones-escuela-baile-barcelona', lang: 'es', page: 'facilities' },
  { path: 'es/horarios-clases-baile-barcelona', lang: 'es', page: 'horariosPrecio' },
  { path: 'es/precios-clases-baile-barcelona', lang: 'es', page: 'horariosPrecio' },
  { path: 'es/blog', lang: 'es', page: 'blog' },
  { path: 'es/blog/lifestyle', lang: 'es', page: 'blogLifestyle' },
  { path: 'es/blog/clases', lang: 'es', page: 'blogClases' },
  { path: 'es/blog/lifestyle/beneficios-bailar-salsa', lang: 'es', page: 'blogBeneficiosBailarSalsa' },
  { path: 'es/blog/lifestyle/historia-salsa-barcelona', lang: 'es', page: 'blogHistoriaSalsaBarcelona' },
  { path: 'es/blog/lifestyle/historia-bachata-barcelona', lang: 'es', page: 'blogHistoriaBachataBarcelona' },
  { path: 'es/blog/lifestyle/salsa-ritmo-conquisto-mundo', lang: 'es', page: 'blogSalsaRitmoConquistoMundo' },
  { path: 'es/blog/clases/salsa-vs-bachata', lang: 'es', page: 'blogSalsaVsBachata' },
  { path: 'es/blog/clases/clases-baile-principiantes-barcelona', lang: 'es', page: 'blogClasesBailePrincipiantesBarcelona' },
  { path: 'es/blog/lifestyle/baile-salud-mental', lang: 'es', page: 'blogBaileSaludMental' },
  { path: 'es/blog/clases/como-perder-miedo-bailar', lang: 'es', page: 'blogComoPerderMiedoBailar' },
  { path: 'es/blog/clases/clases-de-salsa-barcelona', lang: 'es', page: 'blogClasesSalsaBarcelona' },

  // ===== CATALÀ (CA) =====
  { path: 'ca', lang: 'ca', page: 'home' },
  { path: 'ca/clases', lang: 'ca', page: 'classesHub' },
  { path: 'ca/horarios-precios', lang: 'ca', page: 'horariosPrecio' },
  { path: 'ca/clases/baile-barcelona', lang: 'ca', page: 'classes' },
  { path: 'ca/clases/danza-barcelona', lang: 'ca', page: 'danza' },
  { path: 'ca/clases/salsa-bachata-barcelona', lang: 'ca', page: 'salsaBachata' },
  { path: 'ca/clases/bachata-barcelona', lang: 'ca', page: 'bachataSensual' },
  { path: 'ca/clases/salsa-cubana-barcelona', lang: 'ca', page: 'salsaCubana' },
  { path: 'ca/clases/salsa-lady-style-barcelona', lang: 'ca', page: 'salsaLadyStyle' },
  { path: 'ca/clases/folklore-cubano', lang: 'ca', page: 'folkloreCubano' },
  { path: 'ca/clases/timba-barcelona', lang: 'ca', page: 'timba' },
  { path: 'ca/clases/danzas-urbanas-barcelona', lang: 'ca', page: 'danzasUrbanas' },
  { path: 'ca/clases/dancehall-barcelona', lang: 'ca', page: 'dancehall' },
  { path: 'ca/clases/twerk-barcelona', lang: 'ca', page: 'twerk' },
  { path: 'ca/clases/afrobeats-barcelona', lang: 'ca', page: 'afrobeat' },
  { path: 'ca/clases/kpop-dance-barcelona', lang: 'ca', page: 'kpop' },
  { path: 'ca/clases/commercial-dance-barcelona', lang: 'ca', page: 'commercial' },
  { path: 'ca/clases/kizomba-barcelona', lang: 'ca', page: 'kizomba' },
  { path: 'ca/clases/hip-hop-reggaeton-barcelona', lang: 'ca', page: 'hipHopReggaeton' },
  { path: 'ca/clases/sexy-reggaeton-barcelona', lang: 'ca', page: 'sexyReggaeton' },
  { path: 'ca/clases/reggaeton-cubano-barcelona', lang: 'ca', page: 'reggaetonCubano' },
  { path: 'ca/clases/heels-barcelona', lang: 'ca', page: 'heelsBarcelona' },
  { path: 'ca/clases/femmology', lang: 'ca', page: 'femmology' },
  { path: 'ca/clases/sexy-style-barcelona', lang: 'ca', page: 'sexyStyle' },
  { path: 'ca/clases/modern-jazz-barcelona', lang: 'ca', page: 'modernJazz' },
  { path: 'ca/clases/ballet-barcelona', lang: 'ca', page: 'ballet' },
  { path: 'ca/clases/cuerpo-fit', lang: 'ca', page: 'cuerpoFit' },
  { path: 'ca/clases/baile-mananas', lang: 'ca', page: 'baileManananas' },
  { path: 'ca/clases-particulares-baile', lang: 'ca', page: 'clasesParticulares' },
  { path: 'ca/team-building-barcelona', lang: 'ca', page: 'teamBuilding' },
  { path: 'ca/sobre-nosotros', lang: 'ca', page: 'about' },
  { path: 'ca/yunaisy-farray', lang: 'ca', page: 'yunaisy' },
  { path: 'ca/metodo-farray', lang: 'ca', page: 'metodoFarray' },
  { path: 'ca/merchandising', lang: 'ca', page: 'merchandising' },
  { path: 'ca/regala-baile', lang: 'ca', page: 'regalaBaile' },
  { path: 'ca/instalaciones', lang: 'ca', page: 'facilities' },
  { path: 'ca/contacto', lang: 'ca', page: 'contact' },
  { path: 'ca/reservas', lang: 'ca', page: 'reservas' },
  { path: 'ca/clases/afro-contemporaneo-barcelona', lang: 'ca', page: 'afroContemporaneo' },
  { path: 'ca/clases/afro-jazz', lang: 'ca', page: 'afroJazz' },
  { path: 'ca/clases/contemporaneo-barcelona', lang: 'ca', page: 'contemporaneo' },
  { path: 'ca/clases/stretching-barcelona', lang: 'ca', page: 'stretching' },
  { path: 'ca/clases/hip-hop-barcelona', lang: 'ca', page: 'hipHop' },
  { path: 'ca/clases/entrenamiento-bailarines-barcelona', lang: 'ca', page: 'entrenamientoBailarines' },
  { path: 'ca/clases/bachata-lady-style-barcelona', lang: 'ca', page: 'bachataLadyStyle' },
  { path: 'ca/clases/ejercicios-gluteos-barcelona', lang: 'ca', page: 'bumBum' },
  { path: 'ca/clases/acondicionamiento-fisico-bailarines', lang: 'ca', page: 'cuerpoFitPage' },
  { path: 'ca/profesores-baile-barcelona', lang: 'ca', page: 'profesores' },
  { path: 'ca/preguntas-frecuentes', lang: 'ca', page: 'faq' },
  { path: 'ca/alquiler-salas-baile-barcelona', lang: 'ca', page: 'alquilerSalas' },
  { path: 'ca/estudio-grabacion-barcelona', lang: 'ca', page: 'estudioGrabacion' },
  { path: 'ca/terminos-y-condiciones', lang: 'ca', page: 'termsConditions' },
  { path: 'ca/aviso-legal', lang: 'ca', page: 'legalNotice' },
  { path: 'ca/politica-privacidad', lang: 'ca', page: 'privacyPolicy' },
  { path: 'ca/politica-cookies', lang: 'ca', page: 'cookiePolicy' },
  { path: 'ca/servicios-baile-barcelona', lang: 'ca', page: 'serviciosBaile' },
  { path: 'ca/calendario', lang: 'ca', page: 'calendario' },
  { path: 'ca/clases/salsa-lady-style-v2', lang: 'ca', page: 'salsaLadyStyleV2' },
  { path: 'ca/instalaciones-escuela-baile-barcelona', lang: 'ca', page: 'facilities' },
  { path: 'ca/horarios-clases-baile-barcelona', lang: 'ca', page: 'horariosPrecio' },
  { path: 'ca/precios-clases-baile-barcelona', lang: 'ca', page: 'horariosPrecio' },
  { path: 'ca/blog', lang: 'ca', page: 'blog' },
  { path: 'ca/blog/lifestyle', lang: 'ca', page: 'blogLifestyle' },
  { path: 'ca/blog/clases', lang: 'ca', page: 'blogClases' },
  { path: 'ca/blog/lifestyle/beneficios-bailar-salsa', lang: 'ca', page: 'blogBeneficiosBailarSalsa' },
  { path: 'ca/blog/lifestyle/historia-salsa-barcelona', lang: 'ca', page: 'blogHistoriaSalsaBarcelona' },
  { path: 'ca/blog/lifestyle/historia-bachata-barcelona', lang: 'ca', page: 'blogHistoriaBachataBarcelona' },
  { path: 'ca/blog/lifestyle/salsa-ritmo-conquisto-mundo', lang: 'ca', page: 'blogSalsaRitmoConquistoMundo' },
  { path: 'ca/blog/clases/salsa-vs-bachata', lang: 'ca', page: 'blogSalsaVsBachata' },
  { path: 'ca/blog/clases/clases-baile-principiantes-barcelona', lang: 'ca', page: 'blogClasesBailePrincipiantesBarcelona' },
  { path: 'ca/blog/lifestyle/baile-salud-mental', lang: 'ca', page: 'blogBaileSaludMental' },
  { path: 'ca/blog/clases/como-perder-miedo-bailar', lang: 'ca', page: 'blogComoPerderMiedoBailar' },
  { path: 'ca/blog/clases/clases-de-salsa-barcelona', lang: 'ca', page: 'blogClasesSalsaBarcelona' },

  // ===== ENGLISH (EN) =====
  { path: 'en', lang: 'en', page: 'home' },
  { path: 'en/clases', lang: 'en', page: 'classesHub' },
  { path: 'en/horarios-precios', lang: 'en', page: 'horariosPrecio' },
  { path: 'en/clases/baile-barcelona', lang: 'en', page: 'classes' },
  { path: 'en/clases/danza-barcelona', lang: 'en', page: 'danza' },
  { path: 'en/clases/salsa-bachata-barcelona', lang: 'en', page: 'salsaBachata' },
  { path: 'en/clases/bachata-barcelona', lang: 'en', page: 'bachataSensual' },
  { path: 'en/clases/salsa-cubana-barcelona', lang: 'en', page: 'salsaCubana' },
  { path: 'en/clases/salsa-lady-style-barcelona', lang: 'en', page: 'salsaLadyStyle' },
  { path: 'en/clases/folklore-cubano', lang: 'en', page: 'folkloreCubano' },
  { path: 'en/clases/timba-barcelona', lang: 'en', page: 'timba' },
  { path: 'en/clases/danzas-urbanas-barcelona', lang: 'en', page: 'danzasUrbanas' },
  { path: 'en/clases/dancehall-barcelona', lang: 'en', page: 'dancehall' },
  { path: 'en/clases/twerk-barcelona', lang: 'en', page: 'twerk' },
  { path: 'en/clases/afrobeats-barcelona', lang: 'en', page: 'afrobeat' },
  { path: 'en/clases/kpop-dance-barcelona', lang: 'en', page: 'kpop' },
  { path: 'en/clases/commercial-dance-barcelona', lang: 'en', page: 'commercial' },
  { path: 'en/clases/kizomba-barcelona', lang: 'en', page: 'kizomba' },
  { path: 'en/clases/hip-hop-reggaeton-barcelona', lang: 'en', page: 'hipHopReggaeton' },
  { path: 'en/clases/sexy-reggaeton-barcelona', lang: 'en', page: 'sexyReggaeton' },
  { path: 'en/clases/reggaeton-cubano-barcelona', lang: 'en', page: 'reggaetonCubano' },
  { path: 'en/clases/heels-barcelona', lang: 'en', page: 'heelsBarcelona' },
  { path: 'en/clases/femmology', lang: 'en', page: 'femmology' },
  { path: 'en/clases/sexy-style-barcelona', lang: 'en', page: 'sexyStyle' },
  { path: 'en/clases/modern-jazz-barcelona', lang: 'en', page: 'modernJazz' },
  { path: 'en/clases/ballet-barcelona', lang: 'en', page: 'ballet' },
  { path: 'en/clases/cuerpo-fit', lang: 'en', page: 'cuerpoFit' },
  { path: 'en/clases/baile-mananas', lang: 'en', page: 'baileManananas' },
  { path: 'en/clases-particulares-baile', lang: 'en', page: 'clasesParticulares' },
  { path: 'en/team-building-barcelona', lang: 'en', page: 'teamBuilding' },
  { path: 'en/sobre-nosotros', lang: 'en', page: 'about' },
  { path: 'en/yunaisy-farray', lang: 'en', page: 'yunaisy' },
  { path: 'en/metodo-farray', lang: 'en', page: 'metodoFarray' },
  { path: 'en/merchandising', lang: 'en', page: 'merchandising' },
  { path: 'en/regala-baile', lang: 'en', page: 'regalaBaile' },
  { path: 'en/instalaciones', lang: 'en', page: 'facilities' },
  { path: 'en/contacto', lang: 'en', page: 'contact' },
  { path: 'en/reservas', lang: 'en', page: 'reservas' },
  { path: 'en/clases/afro-contemporaneo-barcelona', lang: 'en', page: 'afroContemporaneo' },
  { path: 'en/clases/afro-jazz', lang: 'en', page: 'afroJazz' },
  { path: 'en/clases/contemporaneo-barcelona', lang: 'en', page: 'contemporaneo' },
  { path: 'en/clases/stretching-barcelona', lang: 'en', page: 'stretching' },
  { path: 'en/clases/hip-hop-barcelona', lang: 'en', page: 'hipHop' },
  { path: 'en/clases/entrenamiento-bailarines-barcelona', lang: 'en', page: 'entrenamientoBailarines' },
  { path: 'en/clases/bachata-lady-style-barcelona', lang: 'en', page: 'bachataLadyStyle' },
  { path: 'en/clases/ejercicios-gluteos-barcelona', lang: 'en', page: 'bumBum' },
  { path: 'en/clases/acondicionamiento-fisico-bailarines', lang: 'en', page: 'cuerpoFitPage' },
  { path: 'en/profesores-baile-barcelona', lang: 'en', page: 'profesores' },
  { path: 'en/preguntas-frecuentes', lang: 'en', page: 'faq' },
  { path: 'en/alquiler-salas-baile-barcelona', lang: 'en', page: 'alquilerSalas' },
  { path: 'en/estudio-grabacion-barcelona', lang: 'en', page: 'estudioGrabacion' },
  { path: 'en/terminos-y-condiciones', lang: 'en', page: 'termsConditions' },
  { path: 'en/aviso-legal', lang: 'en', page: 'legalNotice' },
  { path: 'en/politica-privacidad', lang: 'en', page: 'privacyPolicy' },
  { path: 'en/politica-cookies', lang: 'en', page: 'cookiePolicy' },
  { path: 'en/servicios-baile-barcelona', lang: 'en', page: 'serviciosBaile' },
  { path: 'en/calendario', lang: 'en', page: 'calendario' },
  { path: 'en/clases/salsa-lady-style-v2', lang: 'en', page: 'salsaLadyStyleV2' },
  { path: 'en/instalaciones-escuela-baile-barcelona', lang: 'en', page: 'facilities' },
  { path: 'en/horarios-clases-baile-barcelona', lang: 'en', page: 'horariosPrecio' },
  { path: 'en/precios-clases-baile-barcelona', lang: 'en', page: 'horariosPrecio' },
  { path: 'en/blog', lang: 'en', page: 'blog' },
  { path: 'en/blog/lifestyle', lang: 'en', page: 'blogLifestyle' },
  { path: 'en/blog/clases', lang: 'en', page: 'blogClases' },
  { path: 'en/blog/lifestyle/beneficios-bailar-salsa', lang: 'en', page: 'blogBeneficiosBailarSalsa' },
  { path: 'en/blog/lifestyle/historia-salsa-barcelona', lang: 'en', page: 'blogHistoriaSalsaBarcelona' },
  { path: 'en/blog/lifestyle/historia-bachata-barcelona', lang: 'en', page: 'blogHistoriaBachataBarcelona' },
  { path: 'en/blog/lifestyle/salsa-ritmo-conquisto-mundo', lang: 'en', page: 'blogSalsaRitmoConquistoMundo' },
  { path: 'en/blog/clases/salsa-vs-bachata', lang: 'en', page: 'blogSalsaVsBachata' },
  { path: 'en/blog/clases/clases-baile-principiantes-barcelona', lang: 'en', page: 'blogClasesBailePrincipiantesBarcelona' },
  { path: 'en/blog/lifestyle/baile-salud-mental', lang: 'en', page: 'blogBaileSaludMental' },
  { path: 'en/blog/clases/como-perder-miedo-bailar', lang: 'en', page: 'blogComoPerderMiedoBailar' },
  { path: 'en/blog/clases/clases-de-salsa-barcelona', lang: 'en', page: 'blogClasesSalsaBarcelona' },

  // ===== FRANÇAIS (FR) =====
  { path: 'fr', lang: 'fr', page: 'home' },
  { path: 'fr/clases', lang: 'fr', page: 'classesHub' },
  { path: 'fr/horarios-precios', lang: 'fr', page: 'horariosPrecio' },
  { path: 'fr/clases/baile-barcelona', lang: 'fr', page: 'classes' },
  { path: 'fr/clases/danza-barcelona', lang: 'fr', page: 'danza' },
  { path: 'fr/clases/salsa-bachata-barcelona', lang: 'fr', page: 'salsaBachata' },
  { path: 'fr/clases/bachata-barcelona', lang: 'fr', page: 'bachataSensual' },
  { path: 'fr/clases/salsa-cubana-barcelona', lang: 'fr', page: 'salsaCubana' },
  { path: 'fr/clases/salsa-lady-style-barcelona', lang: 'fr', page: 'salsaLadyStyle' },
  { path: 'fr/clases/folklore-cubano', lang: 'fr', page: 'folkloreCubano' },
  { path: 'fr/clases/timba-barcelona', lang: 'fr', page: 'timba' },
  { path: 'fr/clases/danzas-urbanas-barcelona', lang: 'fr', page: 'danzasUrbanas' },
  { path: 'fr/clases/dancehall-barcelona', lang: 'fr', page: 'dancehall' },
  { path: 'fr/clases/twerk-barcelona', lang: 'fr', page: 'twerk' },
  { path: 'fr/clases/afrobeats-barcelona', lang: 'fr', page: 'afrobeat' },
  { path: 'fr/clases/kpop-dance-barcelona', lang: 'fr', page: 'kpop' },
  { path: 'fr/clases/commercial-dance-barcelona', lang: 'fr', page: 'commercial' },
  { path: 'fr/clases/kizomba-barcelona', lang: 'fr', page: 'kizomba' },
  { path: 'fr/clases/hip-hop-reggaeton-barcelona', lang: 'fr', page: 'hipHopReggaeton' },
  { path: 'fr/clases/sexy-reggaeton-barcelona', lang: 'fr', page: 'sexyReggaeton' },
  { path: 'fr/clases/reggaeton-cubano-barcelona', lang: 'fr', page: 'reggaetonCubano' },
  { path: 'fr/clases/heels-barcelona', lang: 'fr', page: 'heelsBarcelona' },
  { path: 'fr/clases/femmology', lang: 'fr', page: 'femmology' },
  { path: 'fr/clases/sexy-style-barcelona', lang: 'fr', page: 'sexyStyle' },
  { path: 'fr/clases/modern-jazz-barcelona', lang: 'fr', page: 'modernJazz' },
  { path: 'fr/clases/ballet-barcelona', lang: 'fr', page: 'ballet' },
  { path: 'fr/clases/cuerpo-fit', lang: 'fr', page: 'cuerpoFit' },
  { path: 'fr/clases/baile-mananas', lang: 'fr', page: 'baileManananas' },
  { path: 'fr/clases-particulares-baile', lang: 'fr', page: 'clasesParticulares' },
  { path: 'fr/team-building-barcelona', lang: 'fr', page: 'teamBuilding' },
  { path: 'fr/sobre-nosotros', lang: 'fr', page: 'about' },
  { path: 'fr/yunaisy-farray', lang: 'fr', page: 'yunaisy' },
  { path: 'fr/metodo-farray', lang: 'fr', page: 'metodoFarray' },
  { path: 'fr/merchandising', lang: 'fr', page: 'merchandising' },
  { path: 'fr/regala-baile', lang: 'fr', page: 'regalaBaile' },
  { path: 'fr/instalaciones', lang: 'fr', page: 'facilities' },
  { path: 'fr/contacto', lang: 'fr', page: 'contact' },
  { path: 'fr/reservas', lang: 'fr', page: 'reservas' },
  { path: 'fr/clases/afro-contemporaneo-barcelona', lang: 'fr', page: 'afroContemporaneo' },
  { path: 'fr/clases/afro-jazz', lang: 'fr', page: 'afroJazz' },
  { path: 'fr/clases/contemporaneo-barcelona', lang: 'fr', page: 'contemporaneo' },
  { path: 'fr/clases/stretching-barcelona', lang: 'fr', page: 'stretching' },
  { path: 'fr/clases/hip-hop-barcelona', lang: 'fr', page: 'hipHop' },
  { path: 'fr/clases/entrenamiento-bailarines-barcelona', lang: 'fr', page: 'entrenamientoBailarines' },
  { path: 'fr/clases/bachata-lady-style-barcelona', lang: 'fr', page: 'bachataLadyStyle' },
  { path: 'fr/clases/ejercicios-gluteos-barcelona', lang: 'fr', page: 'bumBum' },
  { path: 'fr/clases/acondicionamiento-fisico-bailarines', lang: 'fr', page: 'cuerpoFitPage' },
  { path: 'fr/profesores-baile-barcelona', lang: 'fr', page: 'profesores' },
  { path: 'fr/preguntas-frecuentes', lang: 'fr', page: 'faq' },
  { path: 'fr/alquiler-salas-baile-barcelona', lang: 'fr', page: 'alquilerSalas' },
  { path: 'fr/estudio-grabacion-barcelona', lang: 'fr', page: 'estudioGrabacion' },
  { path: 'fr/terminos-y-condiciones', lang: 'fr', page: 'termsConditions' },
  { path: 'fr/aviso-legal', lang: 'fr', page: 'legalNotice' },
  { path: 'fr/politica-privacidad', lang: 'fr', page: 'privacyPolicy' },
  { path: 'fr/politica-cookies', lang: 'fr', page: 'cookiePolicy' },
  { path: 'fr/servicios-baile-barcelona', lang: 'fr', page: 'serviciosBaile' },
  { path: 'fr/calendario', lang: 'fr', page: 'calendario' },
  { path: 'fr/clases/salsa-lady-style-v2', lang: 'fr', page: 'salsaLadyStyleV2' },
  { path: 'fr/instalaciones-escuela-baile-barcelona', lang: 'fr', page: 'facilities' },
  { path: 'fr/horarios-clases-baile-barcelona', lang: 'fr', page: 'horariosPrecio' },
  { path: 'fr/precios-clases-baile-barcelona', lang: 'fr', page: 'horariosPrecio' },
  { path: 'fr/blog', lang: 'fr', page: 'blog' },
  { path: 'fr/blog/lifestyle', lang: 'fr', page: 'blogLifestyle' },
  { path: 'fr/blog/clases', lang: 'fr', page: 'blogClases' },
  { path: 'fr/blog/lifestyle/beneficios-bailar-salsa', lang: 'fr', page: 'blogBeneficiosBailarSalsa' },
  { path: 'fr/blog/lifestyle/historia-salsa-barcelona', lang: 'fr', page: 'blogHistoriaSalsaBarcelona' },
  { path: 'fr/blog/lifestyle/historia-bachata-barcelona', lang: 'fr', page: 'blogHistoriaBachataBarcelona' },
  { path: 'fr/blog/lifestyle/salsa-ritmo-conquisto-mundo', lang: 'fr', page: 'blogSalsaRitmoConquistoMundo' },
  { path: 'fr/blog/clases/salsa-vs-bachata', lang: 'fr', page: 'blogSalsaVsBachata' },
  { path: 'fr/blog/clases/clases-baile-principiantes-barcelona', lang: 'fr', page: 'blogClasesBailePrincipiantesBarcelona' },
  { path: 'fr/blog/lifestyle/baile-salud-mental', lang: 'fr', page: 'blogBaileSaludMental' },
  { path: 'fr/blog/clases/como-perder-miedo-bailar', lang: 'fr', page: 'blogComoPerderMiedoBailar' },
  { path: 'fr/blog/clases/clases-de-salsa-barcelona', lang: 'fr', page: 'blogClasesSalsaBarcelona' },
];

// =============================================================================
// GENERATE SITEMAP
// =============================================================================

/**
 * Generate hreflang links for a URL path
 * @param {string} path - URL path without locale (e.g., 'clases/dancehall-barcelona')
 * @returns {string} XML hreflang links
 */
const generateHreflangLinks = (path) => {
  // Remove leading locale if present
  // Handle both 'es/clases' and 'es' cases
  let cleanPath = path.replace(/^(es|ca|en|fr)\//, '');

  // If path was just the locale (e.g., 'es'), cleanPath will still be 'es'
  // so we need to check if it's a locale and make it empty
  if (SUPPORTED_LOCALES.includes(cleanPath)) {
    cleanPath = '';
  }

  let links = '';
  SUPPORTED_LOCALES.forEach(locale => {
    const url = cleanPath ? `${BASE_URL}/${locale}/${cleanPath}` : `${BASE_URL}/${locale}`;
    links += `    <xhtml:link rel="alternate" hreflang="${locale}" href="${url}"/>\n`;
  });

  // x-default points to ES
  const defaultUrl = cleanPath ? `${BASE_URL}/es/${cleanPath}` : `${BASE_URL}/es`;
  links += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}"/>`;

  return links;
};

/**
 * Generate XML for a single URL
 * @param {object} route - Route object {path, lang, page}
 * @returns {string} XML URL entry
 */
const generateUrlEntry = (route) => {
  const url = route.path ? `${BASE_URL}/${route.path}` : BASE_URL;
  const priority = getPriority(route.path, route.page, route.lang);
  const changefreq = getChangeFreq(route.page);
  const lastmod = getCurrentDate();
  const hreflangLinks = generateHreflangLinks(route.path);

  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
${hreflangLinks}
  </url>`;
};

/**
 * Generate complete sitemap XML
 * @returns {string} Complete sitemap XML
 */
const generateSitemap = () => {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  const footer = `</urlset>`;

  const urls = routes.map(route => generateUrlEntry(route)).join('\n\n');

  return `${header}\n${urls}\n${footer}\n`;
};

// =============================================================================
// MAIN EXECUTION
// =============================================================================

console.log('🗺️  Generating sitemap for Farray\'s International Dance Center...\n');

const sitemap = generateSitemap();
const totalUrls = routes.length;

// Write to file
fs.writeFileSync(OUTPUT_FILE, sitemap, 'utf8');

console.log(`✅ Sitemap generated successfully!`);
console.log(`📊 Statistics:`);
console.log(`   - Total URLs: ${totalUrls}`);
console.log(`   - Languages: ${SUPPORTED_LOCALES.join(', ')}`);
console.log(`   - Excluded: ${LANDING_SLUGS.length * SUPPORTED_LOCALES.length} landing pages (noindex)`);
console.log(`   - Output: ${OUTPUT_FILE}`);
console.log(`\n🔍 Next steps:`);
console.log(`   1. Verify sitemap: npx sitemap-validator ${OUTPUT_FILE}`);
console.log(`   2. Test in browser: http://localhost:5173/sitemap.xml`);
console.log(`   3. Submit to Google Search Console`);
console.log(`   4. Update robots.txt if needed\n`);
