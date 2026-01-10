import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =============================================================================
// ENTERPRISE LANDING CONFIGURATION
// =============================================================================
// Single source of truth for all landing pages (Facebook Ads campaigns)
// To add a new landing: just add the slug here, everything else is auto-generated

const SUPPORTED_LOCALES = ['es', 'ca', 'en', 'fr'];

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

// Helper: convert slug to page key (e.g., 'sexy-reggaeton' -> 'sexyReggaetonLanding')
const slugToPageKey = (slug) => {
  const camelCase = slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return `${camelCase}Landing`;
};

// Auto-generate landing routes (14 slugs × 4 languages = 56 routes)
const generateLandingRoutes = () =>
  SUPPORTED_LOCALES.flatMap(lang =>
    LANDING_SLUGS.map(slug => ({
      path: `${lang}/${slug}`,
      lang,
      page: slugToPageKey(slug),
    }))
  );

// Landing metadata templates per language
const LANDING_META_TEMPLATES = {
  es: {
    titleTemplate: (name) => `Clase de ${name} GRATIS en Barcelona | Farray's Center`,
    descTemplate: (name) => `Aprende ${name} en Barcelona con profesores expertos. Primera clase GRATIS. +15.000 alumnos satisfechos.`,
  },
  ca: {
    titleTemplate: (name) => `Classe de ${name} GRATIS a Barcelona | Farray's Center`,
    descTemplate: (name) => `Aprèn ${name} a Barcelona amb professors experts. Primera classe GRATIS. +15.000 alumnes satisfets.`,
  },
  en: {
    titleTemplate: (name) => `FREE ${name} Class in Barcelona | Farray's Center`,
    descTemplate: (name) => `Learn ${name} in Barcelona with expert instructors. First class FREE. +15,000 satisfied students.`,
  },
  fr: {
    titleTemplate: (name) => `Cours de ${name} GRATUIT à Barcelone | Farray's Center`,
    descTemplate: (name) => `Apprenez le ${name} à Barcelone avec des professeurs experts. Premier cours GRATUIT. +15 000 élèves satisfaits.`,
  },
};

// Display names for each style per language
const LANDING_DISPLAY_NAMES = {
  'dancehall': { es: 'Dancehall', ca: 'Dancehall', en: 'Dancehall', fr: 'Dancehall' },
  'twerk': { es: 'Twerk', ca: 'Twerk', en: 'Twerk', fr: 'Twerk' },
  'sexy-reggaeton': { es: 'Sexy Reggaeton', ca: 'Sexy Reggaeton', en: 'Sexy Reggaeton', fr: 'Sexy Reggaeton' },
  'sexy-style': { es: 'Sexy Style', ca: 'Sexy Style', en: 'Sexy Style', fr: 'Sexy Style' },
  'hip-hop-reggaeton': { es: 'Hip Hop Reggaeton', ca: 'Hip Hop Reggaeton', en: 'Hip Hop Reggaeton', fr: 'Hip Hop Reggaeton' },
  'contemporaneo': { es: 'Contemporáneo', ca: 'Contemporani', en: 'Contemporary Dance', fr: 'Danse Contemporaine' },
  'femmology': { es: 'Femmology', ca: 'Femmology', en: 'Femmology', fr: 'Femmology' },
  'bachata': { es: 'Bachata Sensual', ca: 'Bachata Sensual', en: 'Sensual Bachata', fr: 'Bachata Sensuelle' },
  'hip-hop': { es: 'Hip Hop', ca: 'Hip Hop', en: 'Hip Hop', fr: 'Hip Hop' },
  'afrobeats': { es: 'Afrobeats', ca: 'Afrobeats', en: 'Afrobeats', fr: 'Afrobeats' },
  'afro-jazz': { es: 'Afro Jazz', ca: 'Afro Jazz', en: 'Afro Jazz', fr: 'Afro Jazz' },
  'salsa-cubana': { es: 'Salsa Cubana', ca: 'Salsa Cubana', en: 'Cuban Salsa', fr: 'Salsa Cubaine' },
  'ballet': { es: 'Ballet Clásico', ca: 'Ballet Clàssic', en: 'Classical Ballet', fr: 'Ballet Classique' },
  'afro-contemporaneo': { es: 'Afro Contemporáneo', ca: 'Afro Contemporani', en: 'Afro Contemporary', fr: 'Afro Contemporain' },
  'jornada-puertas-abiertas': { es: 'Jornada Puertas Abiertas', ca: 'Jornada Portes Obertes', en: 'Open Doors Day', fr: 'Journée Portes Ouvertes' },
};

// Auto-generate landing metadata for all languages
const generateLandingMetadata = () => {
  const result = {};
  SUPPORTED_LOCALES.forEach(lang => {
    result[lang] = {};
    LANDING_SLUGS.forEach(slug => {
      const pageKey = slugToPageKey(slug);
      const displayName = LANDING_DISPLAY_NAMES[slug][lang];
      const templates = LANDING_META_TEMPLATES[lang];
      result[lang][pageKey] = {
        title: templates.titleTemplate(displayName),
        description: templates.descTemplate(displayName),
        robots: 'noindex, nofollow',
      };
    });
  });
  return result;
};

// Auto-generate landing HTML content for SSG
// NOTE: Landing pages use empty content to avoid React hydration mismatch errors.
// GenericDanceLanding component renders the full content client-side.
// Only metadata (title, description, robots) is prerendered for SEO.
const generateLandingContent = () => {
  const result = {};
  SUPPORTED_LOCALES.forEach(lang => {
    result[lang] = {};
    LANDING_SLUGS.forEach(slug => {
      const pageKey = slugToPageKey(slug);
      // Empty content - React will render GenericDanceLanding from scratch
      // This avoids hydration mismatch errors (React error #418)
      result[lang][pageKey] = '';
    });
  });
  return result;
};

// Generate all landing data
const LANDING_ROUTES = generateLandingRoutes();
const LANDING_METADATA = generateLandingMetadata();
const LANDING_CONTENT = generateLandingContent();

// =============================================================================
// AUTO-GENERATE INITIAL CONTENT FROM METADATA (SEO para LLMs)
// =============================================================================
// Genera contenido HTML mínimo desde la metadata existente para que los LLMs
// que no ejecutan JavaScript puedan ver contenido básico de la página.
// Ref: ROADMAP_ENTERPRISE.md - Sección 11 (SEO para LLMs)
//
// NOTA: Este contenido será reemplazado por React al hidratar. El usuario
// no verá diferencia, pero los crawlers que no ejecutan JS verán:
// - <h1> con el título de la página
// - <p> con la descripción meta
//
// Páginas excluidas (mantienen '' vacío):
// - home: muy dinámica, contenido complejo
// - horariosPrecio: datos en tiempo real
// - landings: tienen su propio sistema (LANDING_CONTENT)
// - páginas legales: ya tienen contenido manual

const PAGES_TO_EXCLUDE_FROM_AUTO_CONTENT = [
  'home',           // Muy dinámica
  'horariosPrecio', // Datos en tiempo real
  'calendario',     // Datos dinámicos
  'notFound',       // Ya tiene contenido
  // Páginas legales - ya tienen contenido manual
  'termsConditions',
  'legalNotice',
  'privacyPolicy',
  'cookiePolicy',
  'serviciosBaile',
];

/**
 * Genera HTML simple desde la metadata de una página.
 * @param {string} pageKey - Clave de la página (ej: 'dancehall')
 * @param {string} lang - Idioma (es, ca, en, fr)
 * @param {object} allMetadata - Objeto con toda la metadata por idioma
 * @returns {string} HTML string o '' si debe excluirse
 */
const generateContentFromMetadata = (pageKey, lang, allMetadata) => {
  // Si está en la lista de exclusión, retornar vacío
  if (PAGES_TO_EXCLUDE_FROM_AUTO_CONTENT.includes(pageKey)) {
    return '';
  }

  const meta = allMetadata[lang]?.[pageKey];
  if (!meta || !meta.title || !meta.description) {
    return '';
  }

  // Extraer título limpio (quitar "| Farray's Center" y similares)
  const cleanTitle = meta.title.split('|')[0].trim();

  // Generar HTML simple y semántico
  return `<main id="main-content"><h1>${cleanTitle}</h1><p>${meta.description}</p></main>`;
};

// =============================================================================

// All language/page combinations to prerender
const routes = [
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
  { path: 'es/sobre-nosotros', lang: 'es', page: 'about' },
  { path: 'es/yunaisy-farray', lang: 'es', page: 'yunaisy' },
  { path: 'es/metodo-farray', lang: 'es', page: 'metodoFarray' },
  { path: 'es/merchandising', lang: 'es', page: 'merchandising' },
  { path: 'es/regala-baile', lang: 'es', page: 'regalaBaile' },
  { path: 'es/instalaciones', lang: 'es', page: 'facilities' },
  { path: 'es/contacto', lang: 'es', page: 'contact' },
  // Missing class pages
  { path: 'es/clases/afro-contemporaneo-barcelona', lang: 'es', page: 'afroContemporaneo' },
  { path: 'es/clases/afro-jazz', lang: 'es', page: 'afroJazz' },
  { path: 'es/clases/contemporaneo-barcelona', lang: 'es', page: 'contemporaneo' },
  { path: 'es/clases/stretching-barcelona', lang: 'es', page: 'stretching' },
  { path: 'es/clases/hip-hop-barcelona', lang: 'es', page: 'hipHop' },
  { path: 'es/clases/entrenamiento-bailarines-barcelona', lang: 'es', page: 'entrenamientoBailarines' },
  { path: 'es/clases/bachata-lady-style-barcelona', lang: 'es', page: 'bachataLadyStyle' },
  { path: 'es/clases/ejercicios-gluteos-barcelona', lang: 'es', page: 'bumBum' },
  { path: 'es/clases/acondicionamiento-fisico-bailarines', lang: 'es', page: 'cuerpoFitPage' },
  { path: 'es/clases/afro-jazz', lang: 'es', page: 'afroJazz' },
  // Missing non-class pages
  { path: 'es/profesores-baile-barcelona', lang: 'es', page: 'profesores' },
  { path: 'es/preguntas-frecuentes', lang: 'es', page: 'faq' },
  { path: 'es/alquiler-salas-baile-barcelona', lang: 'es', page: 'alquilerSalas' },
  { path: 'es/estudio-grabacion-barcelona', lang: 'es', page: 'estudioGrabacion' },
  // Legal pages
  { path: 'es/terminos-y-condiciones', lang: 'es', page: 'termsConditions' },
  { path: 'es/aviso-legal', lang: 'es', page: 'legalNotice' },
  { path: 'es/politica-privacidad', lang: 'es', page: 'privacyPolicy' },
  { path: 'es/politica-cookies', lang: 'es', page: 'cookiePolicy' },
  // Additional pages
  { path: 'es/servicios-baile', lang: 'es', page: 'serviciosBaile' },
  { path: 'es/calendario', lang: 'es', page: 'calendario' },
  { path: 'es/clases/salsa-lady-style-v2', lang: 'es', page: 'salsaLadyStyleV2' },
  // URL aliases (same content, different URL for SEO)
  { path: 'es/instalaciones-escuela-baile-barcelona', lang: 'es', page: 'facilities' },
  { path: 'es/horarios-clases-baile-barcelona', lang: 'es', page: 'horariosPrecio' },
  { path: 'es/precios-clases-baile-barcelona', lang: 'es', page: 'horariosPrecio' },
  // 404 page
  { path: 'es/404', lang: 'es', page: 'notFound' },

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
  { path: 'ca/sobre-nosotros', lang: 'ca', page: 'about' },
  { path: 'ca/yunaisy-farray', lang: 'ca', page: 'yunaisy' },
  { path: 'ca/metodo-farray', lang: 'ca', page: 'metodoFarray' },
  { path: 'ca/merchandising', lang: 'ca', page: 'merchandising' },
  { path: 'ca/regala-baile', lang: 'ca', page: 'regalaBaile' },
  { path: 'ca/instalaciones', lang: 'ca', page: 'facilities' },
  { path: 'ca/contacto', lang: 'ca', page: 'contact' },
  // Missing class pages
  { path: 'ca/clases/afro-contemporaneo-barcelona', lang: 'ca', page: 'afroContemporaneo' },
  { path: 'ca/clases/afro-jazz', lang: 'ca', page: 'afroJazz' },
  { path: 'ca/clases/contemporaneo-barcelona', lang: 'ca', page: 'contemporaneo' },
  { path: 'ca/clases/stretching-barcelona', lang: 'ca', page: 'stretching' },
  { path: 'ca/clases/hip-hop-barcelona', lang: 'ca', page: 'hipHop' },
  { path: 'ca/clases/entrenamiento-bailarines-barcelona', lang: 'ca', page: 'entrenamientoBailarines' },
  { path: 'ca/clases/bachata-lady-style-barcelona', lang: 'ca', page: 'bachataLadyStyle' },
  { path: 'ca/clases/ejercicios-gluteos-barcelona', lang: 'ca', page: 'bumBum' },
  { path: 'ca/clases/acondicionamiento-fisico-bailarines', lang: 'ca', page: 'cuerpoFitPage' },
  { path: 'ca/clases/afro-jazz', lang: 'ca', page: 'afroJazz' },
  // Missing non-class pages
  { path: 'ca/profesores-baile-barcelona', lang: 'ca', page: 'profesores' },
  { path: 'ca/preguntas-frecuentes', lang: 'ca', page: 'faq' },
  { path: 'ca/alquiler-salas-baile-barcelona', lang: 'ca', page: 'alquilerSalas' },
  { path: 'ca/estudio-grabacion-barcelona', lang: 'ca', page: 'estudioGrabacion' },
  // Legal pages
  { path: 'ca/terminos-y-condiciones', lang: 'ca', page: 'termsConditions' },
  { path: 'ca/aviso-legal', lang: 'ca', page: 'legalNotice' },
  { path: 'ca/politica-privacidad', lang: 'ca', page: 'privacyPolicy' },
  { path: 'ca/politica-cookies', lang: 'ca', page: 'cookiePolicy' },
  // Additional pages
  { path: 'ca/servicios-baile', lang: 'ca', page: 'serviciosBaile' },
  { path: 'ca/calendario', lang: 'ca', page: 'calendario' },
  { path: 'ca/clases/salsa-lady-style-v2', lang: 'ca', page: 'salsaLadyStyleV2' },
  // URL aliases (same content, different URL for SEO)
  { path: 'ca/instalaciones-escuela-baile-barcelona', lang: 'ca', page: 'facilities' },
  { path: 'ca/horarios-clases-baile-barcelona', lang: 'ca', page: 'horariosPrecio' },
  { path: 'ca/precios-clases-baile-barcelona', lang: 'ca', page: 'horariosPrecio' },
  // 404 page
  { path: 'ca/404', lang: 'ca', page: 'notFound' },

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
  { path: 'en/sobre-nosotros', lang: 'en', page: 'about' },
  { path: 'en/yunaisy-farray', lang: 'en', page: 'yunaisy' },
  { path: 'en/metodo-farray', lang: 'en', page: 'metodoFarray' },
  { path: 'en/merchandising', lang: 'en', page: 'merchandising' },
  { path: 'en/regala-baile', lang: 'en', page: 'regalaBaile' },
  { path: 'en/instalaciones', lang: 'en', page: 'facilities' },
  { path: 'en/contacto', lang: 'en', page: 'contact' },
  // Missing class pages
  { path: 'en/clases/afro-contemporaneo-barcelona', lang: 'en', page: 'afroContemporaneo' },
  { path: 'en/clases/afro-jazz', lang: 'en', page: 'afroJazz' },
  { path: 'en/clases/contemporaneo-barcelona', lang: 'en', page: 'contemporaneo' },
  { path: 'en/clases/stretching-barcelona', lang: 'en', page: 'stretching' },
  { path: 'en/clases/hip-hop-barcelona', lang: 'en', page: 'hipHop' },
  { path: 'en/clases/entrenamiento-bailarines-barcelona', lang: 'en', page: 'entrenamientoBailarines' },
  { path: 'en/clases/bachata-lady-style-barcelona', lang: 'en', page: 'bachataLadyStyle' },
  { path: 'en/clases/ejercicios-gluteos-barcelona', lang: 'en', page: 'bumBum' },
  { path: 'en/clases/acondicionamiento-fisico-bailarines', lang: 'en', page: 'cuerpoFitPage' },
  { path: 'en/clases/afro-jazz', lang: 'en', page: 'afroJazz' },
  // Missing non-class pages
  { path: 'en/profesores-baile-barcelona', lang: 'en', page: 'profesores' },
  { path: 'en/preguntas-frecuentes', lang: 'en', page: 'faq' },
  { path: 'en/alquiler-salas-baile-barcelona', lang: 'en', page: 'alquilerSalas' },
  { path: 'en/estudio-grabacion-barcelona', lang: 'en', page: 'estudioGrabacion' },
  // Legal pages
  { path: 'en/terminos-y-condiciones', lang: 'en', page: 'termsConditions' },
  { path: 'en/aviso-legal', lang: 'en', page: 'legalNotice' },
  { path: 'en/politica-privacidad', lang: 'en', page: 'privacyPolicy' },
  { path: 'en/politica-cookies', lang: 'en', page: 'cookiePolicy' },
  // Additional pages
  { path: 'en/servicios-baile', lang: 'en', page: 'serviciosBaile' },
  { path: 'en/calendario', lang: 'en', page: 'calendario' },
  { path: 'en/clases/salsa-lady-style-v2', lang: 'en', page: 'salsaLadyStyleV2' },
  // URL aliases (same content, different URL for SEO)
  { path: 'en/instalaciones-escuela-baile-barcelona', lang: 'en', page: 'facilities' },
  { path: 'en/horarios-clases-baile-barcelona', lang: 'en', page: 'horariosPrecio' },
  { path: 'en/precios-clases-baile-barcelona', lang: 'en', page: 'horariosPrecio' },
  // 404 page
  { path: 'en/404', lang: 'en', page: 'notFound' },

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
  { path: 'fr/sobre-nosotros', lang: 'fr', page: 'about' },
  { path: 'fr/yunaisy-farray', lang: 'fr', page: 'yunaisy' },
  { path: 'fr/metodo-farray', lang: 'fr', page: 'metodoFarray' },
  { path: 'fr/merchandising', lang: 'fr', page: 'merchandising' },
  { path: 'fr/regala-baile', lang: 'fr', page: 'regalaBaile' },
  { path: 'fr/instalaciones', lang: 'fr', page: 'facilities' },
  { path: 'fr/contacto', lang: 'fr', page: 'contact' },
  // Missing class pages
  { path: 'fr/clases/afro-contemporaneo-barcelona', lang: 'fr', page: 'afroContemporaneo' },
  { path: 'fr/clases/afro-jazz', lang: 'fr', page: 'afroJazz' },
  { path: 'fr/clases/contemporaneo-barcelona', lang: 'fr', page: 'contemporaneo' },
  { path: 'fr/clases/stretching-barcelona', lang: 'fr', page: 'stretching' },
  { path: 'fr/clases/hip-hop-barcelona', lang: 'fr', page: 'hipHop' },
  { path: 'fr/clases/entrenamiento-bailarines-barcelona', lang: 'fr', page: 'entrenamientoBailarines' },
  { path: 'fr/clases/bachata-lady-style-barcelona', lang: 'fr', page: 'bachataLadyStyle' },
  { path: 'fr/clases/ejercicios-gluteos-barcelona', lang: 'fr', page: 'bumBum' },
  { path: 'fr/clases/acondicionamiento-fisico-bailarines', lang: 'fr', page: 'cuerpoFitPage' },
  { path: 'fr/clases/afro-jazz', lang: 'fr', page: 'afroJazz' },
  // Missing non-class pages
  { path: 'fr/profesores-baile-barcelona', lang: 'fr', page: 'profesores' },
  { path: 'fr/preguntas-frecuentes', lang: 'fr', page: 'faq' },
  { path: 'fr/alquiler-salas-baile-barcelona', lang: 'fr', page: 'alquilerSalas' },
  { path: 'fr/estudio-grabacion-barcelona', lang: 'fr', page: 'estudioGrabacion' },
  // Legal pages
  { path: 'fr/terminos-y-condiciones', lang: 'fr', page: 'termsConditions' },
  { path: 'fr/aviso-legal', lang: 'fr', page: 'legalNotice' },
  { path: 'fr/politica-privacidad', lang: 'fr', page: 'privacyPolicy' },
  { path: 'fr/politica-cookies', lang: 'fr', page: 'cookiePolicy' },
  // Additional pages
  { path: 'fr/servicios-baile', lang: 'fr', page: 'serviciosBaile' },
  { path: 'fr/calendario', lang: 'fr', page: 'calendario' },
  { path: 'fr/clases/salsa-lady-style-v2', lang: 'fr', page: 'salsaLadyStyleV2' },
  // URL aliases (same content, different URL for SEO)
  { path: 'fr/instalaciones-escuela-baile-barcelona', lang: 'fr', page: 'facilities' },
  { path: 'fr/horarios-clases-baile-barcelona', lang: 'fr', page: 'horariosPrecio' },
  { path: 'fr/precios-clases-baile-barcelona', lang: 'fr', page: 'horariosPrecio' },
  // 404 page
  { path: 'fr/404', lang: 'fr', page: 'notFound' },

  // Blog routes
  { path: 'es/blog', lang: 'es', page: 'blog' },
  { path: 'es/blog/lifestyle', lang: 'es', page: 'blogLifestyle' },
  { path: 'es/blog/lifestyle/beneficios-bailar-salsa', lang: 'es', page: 'blogBeneficiosSalsa' },
  { path: 'es/blog/lifestyle/clases-de-salsa-barcelona', lang: 'es', page: 'blogClasesSalsaBarcelona' },
  { path: 'es/blog/historia', lang: 'es', page: 'blogHistoria' },
  { path: 'es/blog/historia/historia-salsa-barcelona', lang: 'es', page: 'blogHistoriaSalsa' },
  { path: 'es/blog/historia/historia-bachata-barcelona', lang: 'es', page: 'blogHistoriaBachata' },
  { path: 'es/blog/tutoriales', lang: 'es', page: 'blogTutoriales' },
  { path: 'es/blog/tutoriales/salsa-ritmo-conquisto-mundo', lang: 'es', page: 'blogSalsaRitmo' },
  { path: 'es/blog/tips', lang: 'es', page: 'blogTips' },
  { path: 'es/blog/tips/clases-baile-principiantes-barcelona-farrays', lang: 'es', page: 'blogClasesPrincipiantes' },

  { path: 'ca/blog', lang: 'ca', page: 'blog' },
  { path: 'ca/blog/lifestyle', lang: 'ca', page: 'blogLifestyle' },
  { path: 'ca/blog/lifestyle/beneficios-bailar-salsa', lang: 'ca', page: 'blogBeneficiosSalsa' },
  { path: 'ca/blog/lifestyle/clases-de-salsa-barcelona', lang: 'ca', page: 'blogClasesSalsaBarcelona' },
  { path: 'ca/blog/historia', lang: 'ca', page: 'blogHistoria' },
  { path: 'ca/blog/historia/historia-salsa-barcelona', lang: 'ca', page: 'blogHistoriaSalsa' },
  { path: 'ca/blog/historia/historia-bachata-barcelona', lang: 'ca', page: 'blogHistoriaBachata' },
  { path: 'ca/blog/tutoriales', lang: 'ca', page: 'blogTutoriales' },
  { path: 'ca/blog/tutoriales/salsa-ritmo-conquisto-mundo', lang: 'ca', page: 'blogSalsaRitmo' },
  { path: 'ca/blog/tips', lang: 'ca', page: 'blogTips' },
  { path: 'ca/blog/tips/clases-baile-principiantes-barcelona-farrays', lang: 'ca', page: 'blogClasesPrincipiantes' },

  { path: 'en/blog', lang: 'en', page: 'blog' },
  { path: 'en/blog/lifestyle', lang: 'en', page: 'blogLifestyle' },
  { path: 'en/blog/lifestyle/beneficios-bailar-salsa', lang: 'en', page: 'blogBeneficiosSalsa' },
  { path: 'en/blog/lifestyle/clases-de-salsa-barcelona', lang: 'en', page: 'blogClasesSalsaBarcelona' },
  { path: 'en/blog/historia', lang: 'en', page: 'blogHistoria' },
  { path: 'en/blog/historia/historia-salsa-barcelona', lang: 'en', page: 'blogHistoriaSalsa' },
  { path: 'en/blog/historia/historia-bachata-barcelona', lang: 'en', page: 'blogHistoriaBachata' },
  { path: 'en/blog/tutoriales', lang: 'en', page: 'blogTutoriales' },
  { path: 'en/blog/tutoriales/salsa-ritmo-conquisto-mundo', lang: 'en', page: 'blogSalsaRitmo' },
  { path: 'en/blog/tips', lang: 'en', page: 'blogTips' },
  { path: 'en/blog/tips/clases-baile-principiantes-barcelona-farrays', lang: 'en', page: 'blogClasesPrincipiantes' },

  { path: 'fr/blog', lang: 'fr', page: 'blog' },
  { path: 'fr/blog/lifestyle', lang: 'fr', page: 'blogLifestyle' },
  { path: 'fr/blog/lifestyle/beneficios-bailar-salsa', lang: 'fr', page: 'blogBeneficiosSalsa' },
  { path: 'fr/blog/lifestyle/clases-de-salsa-barcelona', lang: 'fr', page: 'blogClasesSalsaBarcelona' },
  { path: 'fr/blog/historia', lang: 'fr', page: 'blogHistoria' },
  { path: 'fr/blog/historia/historia-salsa-barcelona', lang: 'fr', page: 'blogHistoriaSalsa' },
  { path: 'fr/blog/historia/historia-bachata-barcelona', lang: 'fr', page: 'blogHistoriaBachata' },
  { path: 'fr/blog/tutoriales', lang: 'fr', page: 'blogTutoriales' },
  { path: 'fr/blog/tutoriales/salsa-ritmo-conquisto-mundo', lang: 'fr', page: 'blogSalsaRitmo' },
  { path: 'fr/blog/tips', lang: 'fr', page: 'blogTips' },
  { path: 'fr/blog/tips/clases-baile-principiantes-barcelona-farrays', lang: 'fr', page: 'blogClasesPrincipiantes' },

  // Facebook Ads Landing (promo)
  { path: 'es/promo/clase-gratis', lang: 'es', page: 'promoClaseGratis' },
  { path: 'ca/promo/clase-gratis', lang: 'ca', page: 'promoClaseGratis' },
  { path: 'en/promo/clase-gratis', lang: 'en', page: 'promoClaseGratis' },
  { path: 'fr/promo/clase-gratis', lang: 'fr', page: 'promoClaseGratis' },

  // Sexy Reggaeton Landing (FB Ads)
  { path: 'es/promo/sexy-reggaeton', lang: 'es', page: 'promoSexyReggaeton' },
  { path: 'ca/promo/sexy-reggaeton', lang: 'ca', page: 'promoSexyReggaeton' },
  { path: 'en/promo/sexy-reggaeton', lang: 'en', page: 'promoSexyReggaeton' },
  { path: 'fr/promo/sexy-reggaeton', lang: 'fr', page: 'promoSexyReggaeton' },

  // Generic Dance Landing Pages (auto-generated from LANDING_SLUGS)
  ...LANDING_ROUTES,
];

// Metadata for each page in each language
const metadata = {
  es: {
    home: {
      title: 'Farray\'s Center - Escuela de Baile Urbano en Barcelona',
      description: 'Descubre las mejores clases de baile urbano en Barcelona. Dancehall y más. Profesores experimentados y ambiente inclusivo.',
    },
    classes: {
      title: 'Clases de Baile - Farray\'s Center Barcelona',
      description: 'Clases de Dancehall y baile urbano para todos los niveles. Horarios flexibles en Barcelona.',
    },
    classesHub: {
      title: 'Todas las Clases de Baile en Barcelona | Farray\'s Center',
      description: 'Descubre todas nuestras clases de baile en Barcelona: Dancehall, Salsa, Bachata, Hip Hop, Twerk, Afrobeat y más. +40 estilos diferentes. Primera clase gratis.',
    },
    horariosPrecio: {
      title: 'Horarios y Precios | Clases de Baile Barcelona | Farray\'s Center',
      description: 'Consulta los horarios y precios de nuestras clases de baile en Barcelona. Bonos mensuales, clases sueltas y packs especiales. Escuela cerca de Plaza España.',
      robots: 'noindex, nofollow',
    },
    danza: {
      title: 'Clases de Danza en Barcelona | Ballet, Contemporáneo y Jazz | Farray\'s Center',
      description: 'Descubre nuestras clases de danza en Barcelona: Ballet Clásico Cubano, Danza Contemporánea, Modern Jazz, Afro Jazz y más. Academia reconocida por CID-UNESCO. Prueba una clase gratis.',
    },
    salsaBachata: {
      title: 'Clases de Salsa y Bachata en Barcelona | Salsa Cubana, Bachata Sensual y más | Farray\'s Center',
      description: 'Aprende a bailar Salsa Cubana, Bachata Sensual y Dominicana, Timba, Son y más en Barcelona. Escuela fundada por maestros cubanos con experiencia en las mejores academias de La Habana. Reserva tu clase de prueba.',
    },
    bachataSensual: {
      title: 'Clases de Bachata Sensual en Barcelona | Aprende con Campeones Mundiales | Farray\'s Center',
      description: 'Aprende bachata sensual en Barcelona con Mathias Font y Eugenia Trujillo, campeones mundiales de Salsa LA. Clases desde principiante hasta avanzado cerca de Plaza España.',
    },
    salsaCubana: {
      title: 'Clases de Salsa Cubana en Barcelona | Casino, Rueda y Son | Farray\'s Center',
      description: 'Aprende Salsa Cubana auténtica en Barcelona con maestros cubanos. Clases de Casino, Rueda de Casino y Son Cubano. Método Farray® con técnica de La Habana. ¡Reserva tu clase de prueba!',
    },
    salsaLadyStyle: {
      title: 'Clases de Salsa Lady Style en Barcelona | Estilo Femenino y Elegancia | Farray\'s Center',
      description: 'Clases de Salsa Lady Style en Barcelona con Yunaisy Farray. Desarrolla tu feminidad, elegancia y estilo personal bailando salsa. Método Farray® reconocido por CID-UNESCO. ¡Reserva tu clase!',
    },
    folkloreCubano: {
      title: 'Clases de Folklore Cubano en Barcelona | Danzas a los Orishas | Farray\'s Center',
      description: 'Aprende Folklore Cubano auténtico en Barcelona. Danzas a los Orishas, Yoruba, Rumba y más. Maestros cubanos especializados. Entre Plaza España y Sants. ¡Prueba gratis!',
    },
    timba: {
      title: 'Clases de Timba en Barcelona | Lady Timba y Timba en Pareja | Farray\'s Center',
      description: 'Aprende Timba Cubana en Barcelona con maestros cubanos. Lady Timba con Yunaisy Farray y Timba en Pareja con Grechén Mendez. Despelote, improvisación y sabor cubano. ¡Reserva tu clase!',
    },
    danzasUrbanas: {
      title: 'Clases de Danzas Urbanas en Barcelona | Hip Hop, Dancehall, K-Pop y Reggaeton | Farray\'s Center',
      description: 'Descubre nuestras clases de danzas urbanas en Barcelona: Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat y más. Academia de referencia en estilos urbanos. Prueba una clase gratis.',
    },
    dancehall: {
      title: 'Clases de Dancehall en Barcelona - Academia de Baile Urbano | Farray\'s Center',
      description: 'Aprende Dancehall auténtico en Barcelona con profesores expertos. Clases para todos los niveles. Descubre el ritmo de Jamaica.',
    },
    twerk: {
      title: 'Clases de Twerk en Barcelona | Farray\'s Center',
      description: 'Aprende Twerk y Perreo en Barcelona con Sandra Gómez. Clases de baile urbano para todos los niveles. ¡Libera tu energía y confianza!',
    },
    afrobeat: {
      title: 'Clases de Afrobeats y Afrodance en Barcelona | Farray\'s Center',
      description: 'Aprende Afrobeats y Afrodance en Barcelona con profesores nativos de África. Clases de Amapiano, Ntcham y danzas africanas modernas para todos los niveles.',
    },
    hipHopReggaeton: {
      title: 'Clases de Hip Hop Reggaeton en Barcelona | Farray\'s Center',
      description: 'Aprende Hip Hop Reggaeton en Barcelona con Charlie Breezy. Fusión única de hip-hop y reggaeton con mucho flow. Clases para todos los niveles cerca de Plaza España y Sants.',
    },
    sexyReggaeton: {
      title: 'Clases de Sexy Reggaeton en Barcelona | Farray\'s Center',
      description: 'Aprende Sexy Reggaeton en Barcelona con Yunaisy Farray. Perreo, body roll y sensualidad. Clases para todos los niveles cerca de Plaza España y Sants.',
    },
    reggaetonCubano: {
      title: 'Clases de Reggaeton Cubano en Barcelona | Reparto y Cubatón | Farray\'s Center',
      description: 'Aprende Reggaeton Cubano auténtico en Barcelona con Yunaisy Farray. Reparto, Cubatón, improvisación y disociación corporal. Clases para todos los niveles.',
    },
    heelsBarcelona: {
      title: 'Clases de Heels en Barcelona | Femmology y Sexy Style | Farray\'s Center',
      description: 'Aprende a bailar en tacones con elegancia y sensualidad en Barcelona. Clases de Femmology Heels y Sexy Style con Yunaisy Farray, reconocida por CID-UNESCO. Todos los niveles.',
    },
    femmology: {
      title: 'Clases de Femmology en Barcelona | Danza Terapéutica y Feminidad | Farray\'s Center',
      description: 'Descubre Femmology en Barcelona: danzaterapia con tacones creada por Yunaisy Farray. Conecta con tu feminidad, autoestima y sensualidad. Método Farray®. ¡Reserva tu clase!',
    },
    sexyStyle: {
      title: 'Clases de Sexy Style en Barcelona | Aprende a Bailar con Sensualidad | Farray\'s Center',
      description: 'Clases de Sexy Style en Barcelona con Yasmina Fernández. Aprende a expresarte con sensualidad, confianza y movimiento. Todos los niveles. ¡Reserva tu clase de prueba!',
    },
    modernJazz: {
      title: 'Clases de Modern Jazz en Barcelona | Técnica y Expresión con Alejandro Miñoso | Farray\'s Center',
      description: 'Clases de Modern Jazz en Barcelona con Alejandro Miñoso. Técnica, musicalidad y expresión corporal. Desde principiante hasta avanzado. ¡Reserva tu clase de prueba!',
    },
    ballet: {
      title: 'Clases de Ballet en Barcelona | Técnica Clásica y Elegancia | Farray\'s Center',
      description: 'Clases de ballet clásico en Barcelona para adultos. Aprende técnica, postura y elegancia con maestros formados en la ENA. Academia CID-UNESCO entre Plaza España y Sants.',
    },
    cuerpoFit: {
      title: 'Cuerpo-Fit Barcelona | Cardio Dance y Entrenamiento Full Body | Farray\'s Center',
      description: 'Quema 400-500 calorías bailando con Cuerpo-Fit en Barcelona. Entrenamiento full body con elementos de danza. Clase híbrida de cardio y tonificación para todos los niveles. Lunes 20h cerca de Plaza España.',
    },
    baileManananas: {
      title: 'Clases de Baile por las Mañanas en Barcelona | 13 Estilos de 10h a 13h | Farray\'s Center',
      description: 'Clases de baile por las mañanas en Barcelona: Contemporáneo, Ballet, Modern Jazz, Sexy Style, Reggaeton y más. Horario de 10h a 13h. Ideal para turnos de tarde. Cerca de Plaza España.',
    },
    clasesParticulares: {
      title: 'Clases Particulares de Baile en Barcelona | Personalizado y a Tu Ritmo | Farray\'s Center',
      description: 'Clases particulares de baile en Barcelona 100% personalizadas. Profesor exclusivo para ti, horarios flexibles, todos los estilos. Aprende 3x más rápido que en clases grupales. Bonos disponibles.',
    },
    about: {
      title: 'Sobre Nosotros | Farray\'s International Dance Center Barcelona',
      description: 'Conoce nuestra historia, valores y equipo. Academia de baile en Barcelona fundada en 2017 con método propio y profesores internacionales.',
    },
    yunaisy: {
      title: 'Yunaisy Farray | Fundadora y Directora | Farray\'s Center',
      description: 'Conoce a Yunaisy Farray, bailarina profesional cubana y fundadora de Farray\'s International Dance Center. Más de 20 años de experiencia en danza.',
    },
    metodoFarray: {
      title: 'Método Farray® | Sistema Pedagógico Exclusivo de Danza | Farray\'s Center',
      description: 'Descubre el Método Farray®, sistema pedagógico exclusivo que fusiona disciplina técnica cubana, ritmo afrocaribeño e innovación. Certificación CID-UNESCO. Aprende a bailar de verdad.',
    },
    merchandising: {
      title: 'Merchandising | Camisetas, Sudaderas y Accesorios | Farray\'s Center',
      description: 'Compra merchandising oficial de Farray\'s Center: camisetas, sudaderas, bolsas y más. Lleva tu pasión por el baile contigo.',
    },
    regalaBaile: {
      title: 'Regala Baile | Tarjetas Regalo para Clases de Baile | Farray\'s Center',
      description: 'Regala clases de baile con nuestras tarjetas regalo. El regalo perfecto para amantes del baile. Válido para todas las clases y niveles.',
    },
    facilities: {
      title: 'Instalaciones | Salas de Baile Profesionales en Barcelona | Farray\'s Center',
      description: 'Descubre nuestras instalaciones: 3 salas de baile equipadas con espejos, barras, suelo profesional y vestuarios. Ubicación céntrica en Barcelona.',
    },
    contact: {
      title: 'Contacto | Farray\'s International Dance Center Barcelona',
      description: 'Contacta con nosotros. Carrer d\'Entença 100, Barcelona. Tel: +34 622 24 70 85. Reserva tu clase de prueba gratuita.',
    },
    blog: {
      title: 'Blog de Baile | Consejos, Tutoriales e Historia del Baile | Farray\'s Center',
      description: 'Descubre consejos, tutoriales y la fascinante historia del baile. Asesoramiento experto de bailarines profesionales para mejorar tu técnica y disfrutar cada paso.',
    },
    blogLifestyle: {
      title: 'Lifestyle y Baile | Bienestar y Estilo de Vida | Farray\'s Center Blog',
      description: 'Descubre cómo el baile transforma tu vida. Artículos sobre bienestar, felicidad y estilo de vida a través del baile.',
    },
    blogBeneficiosSalsa: {
      title: '10 Beneficios de Bailar Salsa que Cambiarán Tu Vida | Farray\'s Center',
      description: 'Descubre los 10 beneficios científicamente probados de bailar salsa: quema 400 cal/hora, mejora la salud cardiovascular, reduce el estrés y aumenta la autoestima. Guía completa.',
    },
    blogHistoria: {
      title: 'Historia del Baile | Orígenes y Evolución | Farray\'s Center Blog',
      description: 'Descubre la fascinante historia del baile: orígenes, evolución y cómo llegó a Barcelona. Artículos sobre salsa, dancehall y más.',
    },
    blogHistoriaSalsa: {
      title: 'Historia de la Salsa en Barcelona: del Caribe y Nueva York a Farray\'s | Farray\'s Center',
      description: 'Descubre la fascinante historia de la salsa: desde sus orígenes en el Caribe y Nueva York hasta su llegada a Barcelona. Más de 60 años de ritmo que cambiaron el mundo.',
    },
    blogHistoriaBachata: {
      title: 'Historia de la Bachata: Del Barrio Dominicano a Barcelona | Farray\'s Center',
      description: 'Descubre la historia de la bachata: desde sus humildes orígenes en República Dominicana hasta convertirse en fenómeno mundial. Romeo Santos, bachata sensual y más.',
    },
    blogTutoriales: {
      title: 'Tutoriales de Baile | Farray\'s Center Blog',
      description: 'Guías y tutoriales para aprender a bailar: técnicas, pasos básicos y consejos de profesionales para salsa, bachata, dancehall y más estilos.',
    },
    blogSalsaRitmo: {
      title: 'Salsa: El Ritmo que Conquistó el Mundo | Farray\'s Center',
      description: 'Descubre los diferentes estilos de salsa: cubana, rueda de casino, salsa en línea y más. Guía completa para entender y bailar salsa en Barcelona.',
    },
    blogClasesSalsaBarcelona: {
      title: 'Hombres y mujeres, ¿hablamos salsa? | Farray\'s Center Blog',
      description: 'La salsa como lenguaje universal: reflexiones sobre la pista de baile como espacio de conexión entre hombres y mujeres. Por Mar Guerrero.',
    },
    blogTips: {
      title: 'Consejos para Bailar | Farray\'s Center Blog',
      description: 'Consejos prácticos y guías para principiantes y bailarines de todos los niveles en Barcelona.',
    },
    blogClasesPrincipiantes: {
      title: 'Clases de baile para principiantes en Barcelona | Farray\'s Center',
      description: 'Guía completa para empezar a bailar desde cero en Barcelona. Clase de bienvenida gratuita (promocional) o desde 10€. Participación puntual desde 20€.',
    },
    promoClaseGratis: {
      title: 'Tu Primera Clase de Baile GRATIS | Farray\'s Center Barcelona',
      description: 'Reserva tu clase de prueba gratis en la escuela de baile más completa de Barcelona. +15.000 alumnos, +40 estilos. ¡Plazas limitadas!',
      robots: 'noindex, nofollow',
    },
    promoSexyReggaeton: {
      title: 'Clase de Sexy Reggaeton GRATIS en Barcelona | Farray\'s Center',
      description: 'Aprende a moverte al ritmo de reggaeton con sensualidad y confianza. Primera clase GRATIS. +15.000 alumnos, profesora experta.',
      robots: 'noindex, nofollow',
    },
    // New class pages
    afroContemporaneo: {
      title: 'Clases de Afro Contemporáneo en Barcelona | Fusión de Danza Africana y Contemporánea | Farray\'s Center',
      description: 'Aprende Afro Contemporáneo en Barcelona: fusión de danza africana tradicional con técnica contemporánea. Clases para todos los niveles. Academia CID-UNESCO. ¡Reserva tu clase!',
    },
    afroJazz: {
      title: 'Clases de Afro Jazz en Barcelona | Ritmo Africano y Técnica de Jazz | Farray\'s Center',
      description: 'Clases de Afro Jazz en Barcelona: combina ritmos africanos con técnica de jazz moderno. Expresión corporal, musicalidad y energía. Todos los niveles. ¡Prueba gratis!',
    },
    contemporaneo: {
      title: 'Clases de Danza Contemporánea en Barcelona | Técnica y Expresión | Farray\'s Center',
      description: 'Clases de danza contemporánea en Barcelona para adultos. Desarrolla técnica, expresión corporal y creatividad. Academia reconocida por CID-UNESCO. ¡Reserva tu clase de prueba!',
    },
    stretching: {
      title: 'Clases de Stretching para Bailarines en Barcelona | Flexibilidad y Movilidad | Farray\'s Center',
      description: 'Clases de stretching especializadas para bailarines en Barcelona. Mejora tu flexibilidad, movilidad y previene lesiones. Complemento perfecto para cualquier estilo de baile.',
    },
    hipHop: {
      title: 'Clases de Hip Hop en Barcelona | Aprende con Profesionales | Farray\'s Center',
      description: 'Aprende Hip Hop en Barcelona con profesores expertos. Clases desde principiante hasta avanzado. Estilos: Old School, New Style, House y más. ¡Primera clase gratis!',
    },
    entrenamientoBailarines: {
      title: 'Entrenamiento para Bailarines en Barcelona | Técnica y Condición Física | Farray\'s Center',
      description: 'Entrenamiento especializado para bailarines en Barcelona. Mejora tu técnica, fuerza, resistencia y flexibilidad. Programa diseñado por profesionales de la danza.',
    },
    bachataLadyStyle: {
      title: 'Clases de Bachata Lady Style en Barcelona | Estilo Femenino y Sensualidad | Farray\'s Center',
      description: 'Clases de Bachata Lady Style en Barcelona. Desarrolla tu feminidad, elegancia y estilo personal bailando bachata. Movimientos sensuales y expresivos. ¡Reserva tu clase!',
    },
    bumBum: {
      title: 'Bum Bum - Ejercicios de Glúteos en Barcelona | Tonificación y Fitness | Farray\'s Center',
      description: 'Clases de Bum Bum en Barcelona: ejercicios especializados para glúteos y piernas. Tonifica, fortalece y moldea con música y energía. ¡Primera clase gratis!',
    },
    cuerpoFitPage: {
      title: 'Acondicionamiento Físico para Bailarines en Barcelona | Cuerpo Fit | Farray\'s Center',
      description: 'Clases de acondicionamiento físico para bailarines en Barcelona. Mejora fuerza, flexibilidad y resistencia con el Método Farray. Entrenamiento funcional especializado.',
    },
    // New non-class pages
    profesores: {
      title: 'Profesores de Baile en Barcelona | Equipo de Farray\'s Center',
      description: 'Conoce a nuestro equipo de profesores de baile en Barcelona. Bailarines profesionales de todo el mundo con años de experiencia. Formación CID-UNESCO.',
    },
    faq: {
      title: 'Preguntas Frecuentes | Farray\'s International Dance Center Barcelona',
      description: 'Resuelve tus dudas sobre nuestras clases de baile en Barcelona. Horarios, precios, niveles, inscripción y todo lo que necesitas saber antes de empezar.',
    },
    alquilerSalas: {
      title: 'Alquiler de Salas de Baile en Barcelona | Espacios Profesionales | Farray\'s Center',
      description: 'Alquila nuestras salas de baile profesionales en Barcelona. 3 espacios equipados con espejos, barras y suelo de danza. Ideal para ensayos, grabaciones y eventos.',
    },
    estudioGrabacion: {
      title: 'Estudio de Grabación de Baile en Barcelona | Producción Audiovisual | Farray\'s Center',
      description: 'Estudio de grabación para videos de baile en Barcelona. Equipamiento profesional, iluminación y sonido. Perfecto para videoclips, tutoriales y contenido para redes.',
    },
    // Legal pages
    termsConditions: {
      title: 'Términos y Condiciones | Farray\'s International Dance Center',
      description: 'Términos y condiciones de uso de los servicios de Farray\'s Center. Información legal sobre inscripciones, pagos y políticas de la academia.',
    },
    legalNotice: {
      title: 'Aviso Legal | Farray\'s International Dance Center',
      description: 'Aviso legal de Farray\'s Center. Información sobre la empresa, propiedad intelectual y condiciones de uso del sitio web.',
    },
    privacyPolicy: {
      title: 'Política de Privacidad | Farray\'s International Dance Center',
      description: 'Política de privacidad de Farray\'s Center. Información sobre el tratamiento de datos personales según el RGPD.',
    },
    cookiePolicy: {
      title: 'Política de Cookies | Farray\'s International Dance Center',
      description: 'Política de cookies de Farray\'s Center. Información sobre las cookies utilizadas en nuestro sitio web.',
    },
    // Additional pages
    serviciosBaile: {
      title: 'Servicios de Baile en Barcelona | Farray\'s Center',
      description: 'Servicios profesionales de baile en Barcelona: clases particulares, coreografías para eventos, shows y espectáculos. Contáctanos.',
    },
    calendario: {
      title: 'Calendario de Eventos | Farray\'s International Dance Center',
      description: 'Calendario de eventos, workshops y actividades especiales en Farray\'s Center Barcelona. Mantente al día de todas las novedades.',
    },
    salsaLadyStyleV2: {
      title: 'Clases de Salsa Lady Style en Barcelona | Farray\'s Center',
      description: 'Clases de Salsa Lady Style en Barcelona. Desarrolla tu feminidad, elegancia y estilo personal bailando salsa con el Método Farray®.',
    },
    notFound: {
      title: 'Página No Encontrada | 404 | Farray\'s Center',
      description: 'La página que buscas no existe. Vuelve a la página principal o explora nuestras clases de baile en Barcelona.',
      robots: 'noindex, nofollow',
    },
    // Generic Dance Landing Pages (auto-generated from LANDING_METADATA)
    ...LANDING_METADATA.es,
  },
  ca: {
    home: {
      title: 'Farray\'s Center - Escola de Ball Urbà a Barcelona',
      description: 'Descobreix les millors classes de ball urbà a Barcelona. Dancehall i més. Professors experimentats i ambient inclusiu.',
    },
    classes: {
      title: 'Classes de Ball - Farray\'s Center Barcelona',
      description: 'Classes de Dancehall i ball urbà per a tots els nivells. Horaris flexibles a Barcelona.',
    },
    classesHub: {
      title: 'Totes les Classes de Ball a Barcelona | Farray\'s Center',
      description: 'Descobreix totes les nostres classes de ball a Barcelona: Dancehall, Salsa, Bachata, Hip Hop, Twerk, Afrobeat i més. +40 estils diferents. Primera classe gratis.',
    },
    horariosPrecio: {
      title: 'Horaris i Preus | Classes de Ball Barcelona | Farray\'s Center',
      description: 'Consulta els horaris i preus de les nostres classes de ball a Barcelona. Bonos mensuals, classes soltes i packs especials. Escola a prop de Plaça Espanya.',
      robots: 'noindex, nofollow',
    },
    danza: {
      title: 'Classes de Dansa a Barcelona | Ballet, Contemporani i Jazz | Farray\'s Center',
      description: 'Descobreix les nostres classes de dansa a Barcelona: Ballet Clàssic Cubà, Dansa Contemporània, Modern Jazz, Afro Jazz i més. Acadèmia reconeguda per CID-UNESCO. Prova una classe gratis.',
    },
    salsaBachata: {
      title: 'Classes de Salsa i Bachata a Barcelona | Salsa Cubana, Bachata Sensual i més | Farray\'s Center',
      description: 'Aprèn a ballar Salsa Cubana, Bachata Sensual i Dominicana, Timba, Son i més a Barcelona. Escola fundada per mestres cubans amb experiència en les millors acadèmies de L\'Havana. Reserva la teva classe de prova.',
    },
    bachataSensual: {
      title: 'Classes de Bachata Sensual a Barcelona | Aprèn amb Campions Mundials | Farray\'s Center',
      description: 'Aprèn bachata sensual a Barcelona amb Mathias Font i Eugenia Trujillo, campions mundials de Salsa LA. Classes des de principiant fins a avançat prop de Plaça Espanya.',
    },
    salsaCubana: {
      title: 'Classes de Salsa Cubana a Barcelona | Casino, Rueda i Son | Farray\'s Center',
      description: 'Aprèn Salsa Cubana autèntica a Barcelona amb mestres cubans. Classes de Casino, Rueda de Casino i Son Cubà. Mètode Farray® amb tècnica de L\'Havana. Reserva la teva classe de prova!',
    },
    salsaLadyStyle: {
      title: 'Classes de Salsa Lady Style a Barcelona | Estil Femení i Elegància | Farray\'s Center',
      description: 'Classes de Salsa Lady Style a Barcelona amb Yunaisy Farray. Desenvolupa la teva feminitat, elegància i estil personal ballant salsa. Mètode Farray® reconegut per CID-UNESCO. Reserva la teva classe!',
    },
    folkloreCubano: {
      title: 'Classes de Folklore Cubà a Barcelona | Danses als Orixàs | Farray\'s Center',
      description: 'Aprèn Folklore Cubà autèntic a Barcelona. Danses als Orixàs, Yoruba, Rumba i més. Mestres cubans especialitzats. Entre Plaça Espanya i Sants. Prova gratuïta!',
    },
    timba: {
      title: 'Classes de Timba a Barcelona | Lady Timba i Timba en Parella | Farray\'s Center',
      description: 'Aprèn Timba Cubana a Barcelona amb mestres cubans. Lady Timba amb Yunaisy Farray i Timba en Parella amb Grechén Mendez. Despelote, improvisació i sabor cubà. Reserva la teva classe!',
    },
    danzasUrbanas: {
      title: 'Classes de Danses Urbanes a Barcelona | Hip Hop, Dancehall, K-Pop i Reggaeton | Farray\'s Center',
      description: 'Descobreix les nostres classes de danses urbanes a Barcelona: Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat i més. Acadèmia de referència en estils urbans. Prova una classe gratis.',
    },
    dancehall: {
      title: 'Classes de Dancehall a Barcelona - Acadèmia de Ball Urbà | Farray\'s Center',
      description: 'Aprèn Dancehall autèntic a Barcelona amb professors experts. Classes per a tots els nivells. Descobreix el ritme de Jamaica.',
    },
    twerk: {
      title: 'Classes de Twerk a Barcelona | Farray\'s Center',
      description: 'Aprèn Twerk i Perreo a Barcelona amb Sandra Gómez. Classes de ball urbà per a tots els nivells. Allibera la teva energia i confiança!',
    },
    afrobeat: {
      title: 'Classes d\'Afrobeats i Afrodance a Barcelona | Farray\'s Center',
      description: 'Aprèn Afrobeats i Afrodance a Barcelona amb professors natius d\'Àfrica. Classes d\'Amapiano, Ntcham i danses africanes modernes per a tots els nivells.',
    },
    hipHopReggaeton: {
      title: 'Classes de Hip Hop Reggaeton a Barcelona | Farray\'s Center',
      description: 'Aprèn Hip Hop Reggaeton a Barcelona amb Charlie Breezy. Fusió única de hip-hop i reggaeton amb molt de flow. Classes per a tots els nivells a prop de Plaça Espanya i Sants.',
    },
    sexyReggaeton: {
      title: 'Classes de Sexy Reggaeton a Barcelona | Farray\'s Center',
      description: 'Aprèn Sexy Reggaeton a Barcelona amb Yunaisy Farray. Perreo, body roll i sensualitat. Classes per a tots els nivells a prop de Plaça Espanya i Sants.',
    },
    reggaetonCubano: {
      title: 'Classes de Reggaeton Cubà a Barcelona | Reparto i Cubatón | Farray\'s Center',
      description: 'Aprèn Reggaeton Cubà autèntic a Barcelona amb Yunaisy Farray. Reparto, Cubatón, improvisació i disociació corporal. Classes per a tots els nivells.',
    },
    heelsBarcelona: {
      title: 'Classes de Heels a Barcelona | Femmology i Sexy Style | Farray\'s Center',
      description: 'Aprèn a ballar amb talons amb elegància i sensualitat a Barcelona. Classes de Femmology Heels i Sexy Style amb Yunaisy Farray, reconeguda per CID-UNESCO. Tots els nivells.',
    },
    femmology: {
      title: 'Classes de Femmology a Barcelona | Dansa Terapèutica i Feminitat | Farray\'s Center',
      description: 'Descobreix Femmology a Barcelona: dansateràpia amb talons creada per Yunaisy Farray. Connecta amb la teva feminitat, autoestima i sensualitat. Mètode Farray®. Reserva la teva classe!',
    },
    sexyStyle: {
      title: 'Classes de Sexy Style a Barcelona | Aprèn a Ballar amb Sensualitat | Farray\'s Center',
      description: 'Classes de Sexy Style a Barcelona amb Yasmina Fernández. Aprèn a expressar-te amb sensualitat, confiança i moviment. Tots els nivells. Reserva la teva classe de prova!',
    },
    modernJazz: {
      title: 'Classes de Modern Jazz a Barcelona | Tècnica i Expressió amb Alejandro Miñoso | Farray\'s Center',
      description: 'Classes de Modern Jazz a Barcelona amb Alejandro Miñoso. Tècnica, musicalitat i expressió corporal. Des de principiant fins a avançat. Reserva la teva classe de prova!',
    },
    ballet: {
      title: 'Classes de Ballet a Barcelona | Tècnica Clàssica i Elegància | Farray\'s Center',
      description: "Classes de ballet clàssic a Barcelona per a adults. Aprèn tècnica, postura i elegància amb mestres formats a l'ENA. Acadèmia CID-UNESCO entre Plaça Espanya i Sants.",
    },
    cuerpoFit: {
      title: 'Cuerpo-Fit Barcelona | Cardio Dance i Entrenament Full Body | Farray\'s Center',
      description: 'Crema 400-500 calories ballant amb Cuerpo-Fit a Barcelona. Entrenament full body amb elements de dansa. Classe híbrida de cardio i tonificació per a tots els nivells. Dilluns 20h prop de Plaça Espanya.',
    },
    baileManananas: {
      title: 'Classes de Ball pel Matí a Barcelona | 13 Estils de 10h a 13h | Farray\'s Center',
      description: 'Classes de ball pel matí a Barcelona: Contemporani, Ballet, Modern Jazz, Sexy Style, Reggaeton i més. Horari de 10h a 13h. Ideal per a torns de tarda. Prop de Plaça Espanya.',
    },
    clasesParticulares: {
      title: 'Classes Particulars de Ball a Barcelona | Personalitzat i al Teu Ritme | Farray\'s Center',
      description: 'Classes particulars de ball a Barcelona 100% personalitzades. Professor exclusiu per a tu, horaris flexibles, tots els estils. Aprèn 3x més ràpid que en classes grupals. Bons disponibles.',
    },
    about: {
      title: 'Sobre Nosaltres | Farray\'s International Dance Center Barcelona',
      description: 'Coneix la nostra història, valors i equip. Acadèmia de ball a Barcelona fundada el 2017 amb mètode propi i professors internacionals.',
    },
    yunaisy: {
      title: 'Yunaisy Farray | Fundadora i Directora | Farray\'s Center',
      description: 'Coneix Yunaisy Farray, ballarina professional cubana i fundadora de Farray\'s International Dance Center. Més de 20 anys d\'experiència en dansa.',
    },
    metodoFarray: {
      title: 'Mètode Farray® | Sistema Pedagògic Exclusiu de Dansa | Farray\'s Center',
      description: 'Descobreix el Mètode Farray®, sistema pedagògic exclusiu que fusiona disciplina tècnica cubana, ritme afrocaribeny i innovació. Certificació CID-UNESCO. Aprèn a ballar de veritat.',
    },
    merchandising: {
      title: 'Merchandising | Samarretes, Dessuadores i Accessoris | Farray\'s Center',
      description: 'Compra merchandising oficial de Farray\'s Center: samarretes, dessuadores, bosses i més. Porta la teva passió pel ball amb tu.',
    },
    regalaBaile: {
      title: 'Regala Ball | Targetes Regal per a Classes de Ball | Farray\'s Center',
      description: 'Regala classes de ball amb les nostres targetes regal. El regal perfecte per a amants del ball. Vàlid per a totes les classes i nivells.',
    },
    facilities: {
      title: 'Instal·lacions | Sales de Ball Professionals a Barcelona | Farray\'s Center',
      description: 'Descobreix les nostres instal·lacions: 3 sales de ball equipades amb miralls, barres, terra professional i vestidors. Ubicació cèntrica a Barcelona.',
    },
    contact: {
      title: 'Contacte | Farray\'s International Dance Center Barcelona',
      description: 'Contacta amb nosaltres. Carrer d\'Entença 100, Barcelona. Tel: +34 622 24 70 85. Reserva la teva classe de prova gratuïta.',
    },
    blog: {
      title: 'Blog de Ball | Consells, Tutorials i Història del Ball | Farray\'s Center',
      description: 'Descobreix consells, tutorials i la fascinant història del ball. Assessorament expert de ballarins professionals per millorar la teva tècnica i gaudir cada pas.',
    },
    blogLifestyle: {
      title: 'Lifestyle i Ball | Benestar i Estil de Vida | Farray\'s Center Blog',
      description: 'Descobreix com el ball transforma la teva vida. Articles sobre benestar, felicitat i estil de vida a través del ball.',
    },
    blogBeneficiosSalsa: {
      title: '10 Beneficis de Ballar Salsa que Canviaran la Teva Vida | Farray\'s Center',
      description: 'Descobreix els 10 beneficis científicament demostrats de ballar salsa: crema 400 cal/hora, millora la salut cardiovascular, redueix l\'estrès i augmenta l\'autoestima. Guia completa.',
    },
    blogHistoria: {
      title: 'Història del Ball | Orígens i Evolució | Farray\'s Center Blog',
      description: 'Descobreix la fascinant història del ball: orígens, evolució i com va arribar a Barcelona. Articles sobre salsa, dancehall i més.',
    },
    blogHistoriaSalsa: {
      title: 'Història de la Salsa a Barcelona: del Carib i Nova York a Farray\'s | Farray\'s Center',
      description: 'Descobreix la fascinant història de la salsa: des dels seus orígens al Carib i Nova York fins a la seva arribada a Barcelona. Més de 60 anys de ritme que van canviar el món.',
    },
    blogHistoriaBachata: {
      title: 'Història de la Bachata: Del Barri Dominicà a Barcelona | Farray\'s Center',
      description: 'Descobreix la història de la bachata: des dels seus humils orígens a la República Dominicana fins a convertir-se en fenomen mundial. Romeo Santos, bachata sensual i més.',
    },
    blogTutoriales: {
      title: 'Tutorials de Ball | Farray\'s Center Blog',
      description: 'Guies i tutorials per aprendre a ballar: tècniques, passos bàsics i consells de professionals per a salsa, bachata, dancehall i més estils.',
    },
    blogSalsaRitmo: {
      title: 'Salsa: El Ritme que Va Conquistar el Món | Farray\'s Center',
      description: 'Descobreix els diferents estils de salsa: cubana, roda de casino, salsa en línia i més. Guia completa per entendre i ballar salsa a Barcelona.',
    },
    blogClasesSalsaBarcelona: {
      title: 'Homes i dones, parlem salsa? | Farray\'s Center Blog',
      description: 'La salsa com a llenguatge universal: reflexions sobre la pista de ball com a espai de connexió entre homes i dones. Per Mar Guerrero.',
    },
    blogTips: {
      title: 'Consells per Ballar | Farray\'s Center Blog',
      description: 'Consells pràctics i guies per a principiants i balladors de tots els nivells a Barcelona.',
    },
    blogClasesPrincipiantes: {
      title: 'Classes de ball per a principiants a Barcelona | Farray\'s Center',
      description: 'Guia completa per començar a ballar des de zero a Barcelona. Classe de benvinguda gratuïta (promocional) o des de 10€. Participació puntual des de 20€.',
    },
    promoClaseGratis: {
      title: 'La Teva Primera Classe de Ball GRATIS | Farray\'s Center Barcelona',
      description: 'Reserva la teva classe de prova gratuïta a l\'escola de ball més completa de Barcelona. +15.000 alumnes, +40 estils. Places limitades!',
      robots: 'noindex, nofollow',
    },
    promoSexyReggaeton: {
      title: 'Classe de Sexy Reggaeton GRATIS a Barcelona | Farray\'s Center',
      description: 'Aprèn a moure\'t al ritme del reggaeton amb sensualitat i confiança. Primera classe GRATIS. +15.000 alumnes, professora experta.',
      robots: 'noindex, nofollow',
    },
    // New class pages
    afroContemporaneo: {
      title: 'Classes d\'Afro Contemporani a Barcelona | Fusió de Dansa Africana i Contemporània | Farray\'s Center',
      description: 'Aprèn Afro Contemporani a Barcelona: fusió de dansa africana tradicional amb tècnica contemporània. Classes per a tots els nivells. Acadèmia CID-UNESCO. Reserva la teva classe!',
    },
    afroJazz: {
      title: 'Classes d\'Afro Jazz a Barcelona | Ritme Africà i Tècnica de Jazz | Farray\'s Center',
      description: 'Classes d\'Afro Jazz a Barcelona: combina ritmes africans amb tècnica de jazz modern. Expressió corporal, musicalitat i energia. Tots els nivells. Prova gratis!',
    },
    contemporaneo: {
      title: 'Classes de Dansa Contemporània a Barcelona | Tècnica i Expressió | Farray\'s Center',
      description: 'Classes de dansa contemporània a Barcelona per a adults. Desenvolupa tècnica, expressió corporal i creativitat. Acadèmia reconeguda per CID-UNESCO. Reserva la teva classe de prova!',
    },
    stretching: {
      title: 'Classes d\'Stretching per a Ballarins a Barcelona | Flexibilitat i Mobilitat | Farray\'s Center',
      description: 'Classes d\'stretching especialitzades per a ballarins a Barcelona. Millora la teva flexibilitat, mobilitat i preveu lesions. Complement perfecte per a qualsevol estil de ball.',
    },
    hipHop: {
      title: 'Classes de Hip Hop a Barcelona | Aprèn amb Professionals | Farray\'s Center',
      description: 'Aprèn Hip Hop a Barcelona amb professors experts. Classes des de principiant fins a avançat. Estils: Old School, New Style, House i més. Primera classe gratis!',
    },
    entrenamientoBailarines: {
      title: 'Entrenament per a Ballarins a Barcelona | Tècnica i Condició Física | Farray\'s Center',
      description: 'Entrenament especialitzat per a ballarins a Barcelona. Millora la teva tècnica, força, resistència i flexibilitat. Programa dissenyat per professionals de la dansa.',
    },
    bachataLadyStyle: {
      title: 'Classes de Bachata Lady Style a Barcelona | Estil Femení i Sensualitat | Farray\'s Center',
      description: 'Classes de Bachata Lady Style a Barcelona. Desenvolupa la teva feminitat, elegància i estil personal ballant bachata. Moviments sensuals i expressius. Reserva la teva classe!',
    },
    bumBum: {
      title: 'Bum Bum - Exercicis de Glutis a Barcelona | Tonificació i Fitness | Farray\'s Center',
      description: 'Classes de Bum Bum a Barcelona: exercicis especialitzats per a glutis i cames. Tonifica, enforteix i modela amb música i energia. Primera classe gratis!',
    },
    cuerpoFitPage: {
      title: 'Acondicionament Físic per a Ballarins a Barcelona | Cuerpo Fit | Farray\'s Center',
      description: 'Classes d\'acondicionament físic per a ballarins a Barcelona. Millora força, flexibilitat i resistència amb el Mètode Farray. Entrenament funcional especialitzat.',
    },
    // New non-class pages
    profesores: {
      title: 'Professors de Ball a Barcelona | Equip de Farray\'s Center',
      description: 'Coneix el nostre equip de professors de ball a Barcelona. Ballarins professionals de tot el món amb anys d\'experiència. Formació CID-UNESCO.',
    },
    faq: {
      title: 'Preguntes Freqüents | Farray\'s International Dance Center Barcelona',
      description: 'Resol els teus dubtes sobre les nostres classes de ball a Barcelona. Horaris, preus, nivells, inscripció i tot el que necessites saber abans de començar.',
    },
    alquilerSalas: {
      title: 'Lloguer de Sales de Ball a Barcelona | Espais Professionals | Farray\'s Center',
      description: 'Lloga les nostres sales de ball professionals a Barcelona. 3 espais equipats amb miralls, barres i terra de dansa. Ideal per a assajos, gravacions i esdeveniments.',
    },
    estudioGrabacion: {
      title: 'Estudi de Gravació de Ball a Barcelona | Producció Audiovisual | Farray\'s Center',
      description: 'Estudi de gravació per a vídeos de ball a Barcelona. Equipament professional, il·luminació i so. Perfecte per a videoclips, tutorials i contingut per a xarxes.',
    },
    // Legal pages
    termsConditions: {
      title: 'Termes i Condicions | Farray\'s International Dance Center',
      description: 'Termes i condicions d\'ús dels serveis de Farray\'s Center. Informació legal sobre inscripcions, pagaments i polítiques de l\'acadèmia.',
    },
    legalNotice: {
      title: 'Avís Legal | Farray\'s International Dance Center',
      description: 'Avís legal de Farray\'s Center. Informació sobre l\'empresa, propietat intel·lectual i condicions d\'ús del lloc web.',
    },
    privacyPolicy: {
      title: 'Política de Privacitat | Farray\'s International Dance Center',
      description: 'Política de privacitat de Farray\'s Center. Informació sobre el tractament de dades personals segons el RGPD.',
    },
    cookiePolicy: {
      title: 'Política de Cookies | Farray\'s International Dance Center',
      description: 'Política de cookies de Farray\'s Center. Informació sobre les cookies utilitzades al nostre lloc web.',
    },
    // Additional pages
    serviciosBaile: {
      title: 'Serveis de Ball a Barcelona | Farray\'s Center',
      description: 'Serveis professionals de ball a Barcelona: classes particulars, coreografies per a esdeveniments, shows i espectacles.',
    },
    calendario: {
      title: 'Calendari d\'Esdeveniments | Farray\'s International Dance Center',
      description: 'Calendari d\'esdeveniments, workshops i activitats especials a Farray\'s Center Barcelona.',
    },
    salsaLadyStyleV2: {
      title: 'Classes de Salsa Lady Style a Barcelona | Farray\'s Center',
      description: 'Classes de Salsa Lady Style a Barcelona. Desenvolupa la teva feminitat, elegància i estil personal ballant salsa amb el Mètode Farray®.',
    },
    notFound: {
      title: 'Pàgina No Trobada | 404 | Farray\'s Center',
      description: 'La pàgina que busques no existeix. Torna a la pàgina principal o explora les nostres classes de ball a Barcelona.',
      robots: 'noindex, nofollow',
    },
    // Generic Dance Landing Pages (auto-generated from LANDING_METADATA)
    ...LANDING_METADATA.ca,
  },
  en: {
    home: {
      title: 'Farray\'s Center - Urban Dance School in Barcelona',
      description: 'Discover the best urban dance classes in Barcelona. Dancehall and more. Experienced teachers and inclusive atmosphere.',
    },
    classes: {
      title: 'Dance Classes - Farray\'s Center Barcelona',
      description: 'Dancehall and urban dance classes for all levels. Flexible schedules in Barcelona.',
    },
    classesHub: {
      title: 'All Dance Classes in Barcelona | Farray\'s Center',
      description: 'Discover all our dance classes in Barcelona: Dancehall, Salsa, Bachata, Hip Hop, Twerk, Afrobeat and more. +40 different styles. First class free.',
    },
    horariosPrecio: {
      title: 'Schedule & Prices | Dance Classes Barcelona | Farray\'s Center',
      description: 'Check our dance class schedules and prices in Barcelona. Monthly passes, single classes and special packs. School near Plaza España.',
      robots: 'noindex, nofollow',
    },
    danza: {
      title: 'Dance Classes in Barcelona | Ballet, Contemporary & Jazz | Farray\'s Center',
      description: 'Discover our dance classes in Barcelona: Cuban Classical Ballet, Contemporary Dance, Modern Jazz, Afro Jazz and more. CID-UNESCO accredited academy. Try a free class.',
    },
    salsaBachata: {
      title: 'Salsa and Bachata Classes in Barcelona | Cuban Salsa, Sensual Bachata & more | Farray\'s Center',
      description: 'Learn to dance Cuban Salsa, Sensual and Dominican Bachata, Timba, Son and more in Barcelona. School founded by Cuban masters with experience in Havana\'s best academies. Book your trial class.',
    },
    bachataSensual: {
      title: 'Sensual Bachata Classes in Barcelona | Learn with World Champions | Farray\'s Center',
      description: 'Learn sensual bachata in Barcelona with Mathias Font and Eugenia Trujillo, world champions in Salsa LA. Classes from beginner to advanced near Plaza España.',
    },
    salsaCubana: {
      title: 'Cuban Salsa Classes in Barcelona | Casino, Rueda & Son | Farray\'s Center',
      description: 'Learn authentic Cuban Salsa in Barcelona with Cuban masters. Casino, Rueda de Casino and Son Cubano classes. Farray Method® with Havana technique. Book your trial class!',
    },
    salsaLadyStyle: {
      title: 'Salsa Lady Style Classes in Barcelona | Feminine Style & Elegance | Farray\'s Center',
      description: 'Salsa Lady Style classes in Barcelona with Yunaisy Farray. Develop your femininity, elegance and personal style dancing salsa. Farray Method® recognized by CID-UNESCO. Book your class!',
    },
    folkloreCubano: {
      title: 'Cuban Folklore Classes in Barcelona | Dances to the Orishas | Farray\'s Center',
      description: 'Learn authentic Cuban Folklore in Barcelona. Dances to the Orishas, Yoruba, Rumba and more. Specialized Cuban masters. Between Plaza España and Sants. Free trial!',
    },
    timba: {
      title: 'Timba Classes in Barcelona | Lady Timba & Partner Timba | Farray\'s Center',
      description: 'Learn Cuban Timba in Barcelona with Cuban masters. Lady Timba with Yunaisy Farray and Partner Timba with Grechén Mendez. Despelote, improvisation and Cuban flavor. Book your class!',
    },
    danzasUrbanas: {
      title: 'Urban Dance Classes in Barcelona | Hip Hop, Dancehall, K-Pop & Reggaeton | Farray\'s Center',
      description: 'Discover our urban dance classes in Barcelona: Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat and more. Leading academy for urban styles. Try a free class.',
    },
    dancehall: {
      title: 'Dancehall Classes in Barcelona - Urban Dance Academy | Farray\'s Center',
      description: 'Learn authentic Dancehall in Barcelona with expert teachers. Classes for all levels. Discover the rhythm of Jamaica.',
    },
    twerk: {
      title: 'Twerk Classes in Barcelona | Farray\'s Center',
      description: 'Learn Twerk and Perreo in Barcelona with Sandra Gómez. Urban dance classes for all levels. Unleash your energy and confidence!',
    },
    afrobeat: {
      title: 'Afrobeats and Afrodance Classes in Barcelona | Farray\'s Center',
      description: 'Learn Afrobeats and Afrodance in Barcelona with native African instructors. Amapiano, Ntcham and modern African dance classes for all levels.',
    },
    hipHopReggaeton: {
      title: 'Hip Hop Reggaeton Classes in Barcelona | Farray\'s Center',
      description: 'Learn Hip Hop Reggaeton in Barcelona with Charlie Breezy. Unique fusion of hip-hop and reggaeton with lots of flow. Classes for all levels near Plaza España and Sants.',
    },
    sexyReggaeton: {
      title: 'Sexy Reggaeton Classes in Barcelona | Farray\'s Center',
      description: 'Learn Sexy Reggaeton in Barcelona with Yunaisy Farray. Perreo, body roll and sensuality. Classes for all levels near Plaza España and Sants.',
    },
    reggaetonCubano: {
      title: 'Cuban Reggaeton Classes in Barcelona | Reparto & Cubatón | Farray\'s Center',
      description: 'Learn authentic Cuban Reggaeton in Barcelona with Yunaisy Farray. Reparto, Cubatón, improvisation and body isolation. Classes for all levels.',
    },
    heelsBarcelona: {
      title: 'Heels Dance Classes in Barcelona | Femmology & Sexy Style | Farray\'s Center',
      description: 'Learn to dance in heels with elegance and sensuality in Barcelona. Femmology Heels and Sexy Style classes with Yunaisy Farray, CID-UNESCO recognized. All levels welcome.',
    },
    femmology: {
      title: 'Femmology Classes in Barcelona | Dance Therapy and Femininity | Farray\'s Center',
      description: 'Discover Femmology in Barcelona: dance therapy in heels created by Yunaisy Farray. Connect with your femininity, self-esteem and sensuality. Farray Method®. Book your class!',
    },
    sexyStyle: {
      title: 'Sexy Style Classes in Barcelona | Learn to Dance with Sensuality | Farray\'s Center',
      description: 'Sexy Style classes in Barcelona with Yasmina Fernández. Learn to express yourself with sensuality, confidence and movement. All levels. Book your trial class!',
    },
    modernJazz: {
      title: 'Modern Jazz Classes in Barcelona | Technique and Expression with Alejandro Miñoso | Farray\'s Center',
      description: 'Modern Jazz classes in Barcelona with Alejandro Miñoso. Technique, musicality and body expression. From beginner to advanced. Book your trial class!',
    },
    ballet: {
      title: 'Ballet Classes in Barcelona | Classical Technique and Elegance | Farray\'s Center',
      description: 'Classical ballet classes in Barcelona for adults. Learn technique, posture and elegance with ENA-trained masters. CID-UNESCO Academy between Plaza España and Sants.',
    },
    cuerpoFit: {
      title: 'Cuerpo-Fit Barcelona | Cardio Dance & Full Body Training | Farray\'s Center',
      description: 'Burn 400-500 calories dancing with Cuerpo-Fit in Barcelona. Full body workout with dance elements. Hybrid cardio and toning class for all levels. Mondays 8pm near Plaza España.',
    },
    baileManananas: {
      title: 'Morning Dance Classes in Barcelona | 13 Styles from 10am to 1pm | Farray\'s Center',
      description: 'Morning dance classes in Barcelona: Contemporary, Ballet, Modern Jazz, Sexy Style, Reggaeton and more. Schedule from 10am to 1pm. Ideal for afternoon shifts. Near Plaza España.',
    },
    clasesParticulares: {
      title: 'Private Dance Classes in Barcelona | Personalized and At Your Pace | Farray\'s Center',
      description: 'Private dance classes in Barcelona with 100% dedicated teacher. Salsa, Bachata, Dancehall, Contemporary Dance. Personalized teaching, flexible schedules and guaranteed results. Reserve your class now!',
    },
    about: {
      title: 'About Us | Farray\'s International Dance Center Barcelona',
      description: 'Learn about our history, values and team. Dance academy in Barcelona founded in 2017 with our own method and international teachers.',
    },
    yunaisy: {
      title: 'Yunaisy Farray | Founder and Director | Farray\'s Center',
      description: 'Meet Yunaisy Farray, Cuban professional dancer and founder of Farray\'s International Dance Center. Over 20 years of experience in dance.',
    },
    metodoFarray: {
      title: 'Farray Method® | Exclusive Dance Pedagogical System | Farray\'s Center',
      description: 'Discover the Farray Method®, an exclusive pedagogical system that combines Cuban technical discipline, Afro-Caribbean rhythm and innovation. CID-UNESCO certification. Learn to dance for real.',
    },
    merchandising: {
      title: 'Merchandising | T-Shirts, Hoodies and Accessories | Farray\'s Center',
      description: 'Buy official Farray\'s Center merchandise: t-shirts, hoodies, bags and more. Take your passion for dance with you.',
    },
    regalaBaile: {
      title: 'Gift Dance | Gift Cards for Dance Classes | Farray\'s Center',
      description: 'Gift dance classes with our gift cards. The perfect gift for dance lovers. Valid for all classes and levels.',
    },
    facilities: {
      title: 'Facilities | Professional Dance Studios in Barcelona | Farray\'s Center',
      description: 'Discover our facilities: 3 dance studios equipped with mirrors, bars, professional flooring and dressing rooms. Central location in Barcelona.',
    },
    contact: {
      title: 'Contact | Farray\'s International Dance Center Barcelona',
      description: 'Contact us. Carrer d\'Entença 100, Barcelona. Tel: +34 622 24 70 85. Book your free trial class.',
    },
    blog: {
      title: 'Dance Blog | Tips, Tutorials & Dance History | Farray\'s Center',
      description: 'Discover tips, tutorials and the fascinating history of dance. Expert advice from professional dancers to improve your technique and enjoy every step.',
    },
    blogLifestyle: {
      title: 'Lifestyle & Dance | Wellbeing & Life Balance | Farray\'s Center Blog',
      description: 'Discover how dance transforms your life. Articles about wellbeing, happiness and lifestyle through dance.',
    },
    blogBeneficiosSalsa: {
      title: '10 Benefits of Dancing Salsa That Will Change Your Life | Farray\'s Center',
      description: 'Discover the 10 scientifically proven benefits of dancing salsa: burn 400 cal/hour, improve cardiovascular health, reduce stress and boost self-esteem. Complete guide.',
    },
    blogHistoria: {
      title: 'Dance History | Origins & Evolution | Farray\'s Center Blog',
      description: 'Discover the fascinating history of dance: origins, evolution and how it arrived in Barcelona. Articles about salsa, dancehall and more.',
    },
    blogHistoriaSalsa: {
      title: 'History of Salsa in Barcelona: From the Caribbean and New York to Farray\'s | Farray\'s Center',
      description: 'Discover the fascinating history of salsa: from its origins in the Caribbean and New York to its arrival in Barcelona. Over 60 years of rhythm that changed the world.',
    },
    blogHistoriaBachata: {
      title: 'History of Bachata: From Dominican Barrios to Barcelona | Farray\'s Center',
      description: 'Discover the history of bachata: from its humble origins in the Dominican Republic to becoming a worldwide phenomenon. Romeo Santos, sensual bachata and more.',
    },
    blogTutoriales: {
      title: 'Dance Tutorials | Farray\'s Center Blog',
      description: 'Guides and tutorials to learn dancing: techniques, basic steps and professional tips for salsa, bachata, dancehall and more styles.',
    },
    blogSalsaRitmo: {
      title: 'Salsa: The Rhythm that Conquered the World | Farray\'s Center',
      description: 'Discover the different salsa styles: Cuban, rueda de casino, line salsa and more. Complete guide to understand and dance salsa in Barcelona.',
    },
    blogClasesSalsaBarcelona: {
      title: 'Men and Women, Shall We Speak Salsa? | Farray\'s Center Blog',
      description: 'Salsa as a universal language: reflections on the dance floor as a space of connection between men and women. By Mar Guerrero.',
    },
    blogTips: {
      title: 'Dance Tips | Farray\'s Center Blog',
      description: 'Practical tips and guides for beginners and dancers of all levels in Barcelona.',
    },
    blogClasesPrincipiantes: {
      title: 'Beginner Dance Classes in Barcelona | Farray\'s Center',
      description: 'Complete guide to start dancing from scratch in Barcelona. Free welcome class (promotional) or from €10. One-time participation from €17.',
    },
    promoClaseGratis: {
      title: 'Your First Dance Class FREE | Farray\'s Center Barcelona',
      description: 'Book your free trial class at Barcelona\'s most complete dance school. +15,000 students, +40 styles. Limited spots!',
      robots: 'noindex, nofollow',
    },
    promoSexyReggaeton: {
      title: 'FREE Sexy Reggaeton Class in Barcelona | Farray\'s Center',
      description: 'Learn to move to reggaeton with sensuality and confidence. First class FREE. +15,000 students, expert instructor.',
      robots: 'noindex, nofollow',
    },
    // New class pages
    afroContemporaneo: {
      title: 'Afro Contemporary Classes in Barcelona | African & Contemporary Dance Fusion | Farray\'s Center',
      description: 'Learn Afro Contemporary in Barcelona: fusion of traditional African dance with contemporary technique. Classes for all levels. CID-UNESCO Academy. Book your class!',
    },
    afroJazz: {
      title: 'Afro Jazz Classes in Barcelona | African Rhythm & Jazz Technique | Farray\'s Center',
      description: 'Afro Jazz classes in Barcelona: combining African rhythms with modern jazz technique. Body expression, musicality and energy. All levels. Free trial!',
    },
    contemporaneo: {
      title: 'Contemporary Dance Classes in Barcelona | Technique & Expression | Farray\'s Center',
      description: 'Contemporary dance classes in Barcelona for adults. Develop technique, body expression and creativity. CID-UNESCO accredited academy. Book your trial class!',
    },
    stretching: {
      title: 'Stretching Classes for Dancers in Barcelona | Flexibility & Mobility | Farray\'s Center',
      description: 'Specialized stretching classes for dancers in Barcelona. Improve your flexibility, mobility and prevent injuries. Perfect complement for any dance style.',
    },
    hipHop: {
      title: 'Hip Hop Classes in Barcelona | Learn with Professionals | Farray\'s Center',
      description: 'Learn Hip Hop in Barcelona with expert teachers. Classes from beginner to advanced. Styles: Old School, New Style, House and more. First class free!',
    },
    entrenamientoBailarines: {
      title: 'Training for Dancers in Barcelona | Technique & Fitness | Farray\'s Center',
      description: 'Specialized training for dancers in Barcelona. Improve your technique, strength, endurance and flexibility. Program designed by dance professionals.',
    },
    bachataLadyStyle: {
      title: 'Bachata Lady Style Classes in Barcelona | Feminine Style & Sensuality | Farray\'s Center',
      description: 'Bachata Lady Style classes in Barcelona. Develop your femininity, elegance and personal style dancing bachata. Sensual and expressive movements. Book your class!',
    },
    bumBum: {
      title: 'Bum Bum - Glute Exercises in Barcelona | Toning & Fitness | Farray\'s Center',
      description: 'Bum Bum classes in Barcelona: specialized exercises for glutes and legs. Tone, strengthen and sculpt with music and energy. First class free!',
    },
    cuerpoFitPage: {
      title: 'Body Conditioning for Dancers in Barcelona | Cuerpo Fit | Farray\'s Center',
      description: 'Body conditioning classes for dancers in Barcelona. Improve strength, flexibility and endurance with the Farray Method. Specialized functional training.',
    },
    // New non-class pages
    profesores: {
      title: 'Dance Teachers in Barcelona | Farray\'s Center Team',
      description: 'Meet our team of dance teachers in Barcelona. Professional dancers from around the world with years of experience. CID-UNESCO certified.',
    },
    faq: {
      title: 'Frequently Asked Questions | Farray\'s International Dance Center Barcelona',
      description: 'Get answers about our dance classes in Barcelona. Schedules, prices, levels, registration and everything you need to know before starting.',
    },
    alquilerSalas: {
      title: 'Dance Studio Rental in Barcelona | Professional Spaces | Farray\'s Center',
      description: 'Rent our professional dance studios in Barcelona. 3 spaces equipped with mirrors, bars and dance flooring. Ideal for rehearsals, recordings and events.',
    },
    estudioGrabacion: {
      title: 'Dance Video Studio in Barcelona | Audiovisual Production | Farray\'s Center',
      description: 'Recording studio for dance videos in Barcelona. Professional equipment, lighting and sound. Perfect for music videos, tutorials and social media content.',
    },
    // Legal pages
    termsConditions: {
      title: 'Terms and Conditions | Farray\'s International Dance Center',
      description: 'Terms and conditions for Farray\'s Center services. Legal information about registration, payments and academy policies.',
    },
    legalNotice: {
      title: 'Legal Notice | Farray\'s International Dance Center',
      description: 'Legal notice for Farray\'s Center. Information about the company, intellectual property and website terms of use.',
    },
    privacyPolicy: {
      title: 'Privacy Policy | Farray\'s International Dance Center',
      description: 'Privacy policy for Farray\'s Center. Information about personal data processing according to GDPR.',
    },
    cookiePolicy: {
      title: 'Cookie Policy | Farray\'s International Dance Center',
      description: 'Cookie policy for Farray\'s Center. Information about the cookies used on our website.',
    },
    // Additional pages
    serviciosBaile: {
      title: 'Dance Services in Barcelona | Farray\'s Center',
      description: 'Professional dance services in Barcelona: private lessons, event choreography, shows and performances. Contact us.',
    },
    calendario: {
      title: 'Events Calendar | Farray\'s International Dance Center',
      description: 'Calendar of events, workshops and special activities at Farray\'s Center Barcelona. Stay up to date with all the news.',
    },
    salsaLadyStyleV2: {
      title: 'Salsa Lady Style Classes in Barcelona | Farray\'s Center',
      description: 'Salsa Lady Style classes in Barcelona. Develop your femininity, elegance and personal style dancing salsa with the Farray Method®.',
    },
    notFound: {
      title: 'Page Not Found | 404 | Farray\'s Center',
      description: 'The page you are looking for does not exist. Go back to the home page or explore our dance classes in Barcelona.',
      robots: 'noindex, nofollow',
    },
    // Generic Dance Landing Pages (auto-generated from LANDING_METADATA)
    ...LANDING_METADATA.en,
  },
  fr: {
    home: {
      title: 'Farray\'s Center - École de Danse Urbaine à Barcelone',
      description: 'Découvrez les meilleurs cours de danse urbaine à Barcelone. Dancehall et plus. Professeurs expérimentés et ambiance inclusive.',
    },
    classes: {
      title: 'Cours de Danse - Farray\'s Center Barcelone',
      description: 'Cours de Dancehall et danse urbaine pour tous les niveaux. Horaires flexibles à Barcelone.',
    },
    classesHub: {
      title: 'Tous les Cours de Danse à Barcelone | Farray\'s Center',
      description: 'Découvrez tous nos cours de danse à Barcelone : Dancehall, Salsa, Bachata, Hip Hop, Twerk, Afrobeat et plus. +40 styles différents. Premier cours gratuit.',
    },
    horariosPrecio: {
      title: 'Horaires et Tarifs | Cours de Danse Barcelone | Farray\'s Center',
      description: 'Consultez les horaires et tarifs de nos cours de danse à Barcelone. Abonnements mensuels, cours à l\'unité et packs spéciaux. École près de Plaza España.',
      robots: 'noindex, nofollow',
    },
    danza: {
      title: 'Cours de Danse à Barcelone | Ballet, Contemporain et Jazz | Farray\'s Center',
      description: 'Découvrez nos cours de danse à Barcelone : Ballet Classique Cubain, Danse Contemporaine, Modern Jazz, Afro Jazz et plus. Académie accréditée par CID-UNESCO. Essayez un cours gratuit.',
    },
    salsaBachata: {
      title: 'Cours de Salsa et Bachata à Barcelone | Salsa Cubaine, Bachata Sensuelle et plus | Farray\'s Center',
      description: 'Apprenez à danser la Salsa Cubaine, la Bachata Sensuelle et Dominicaine, la Timba, le Son et plus à Barcelone. École fondée par des maîtres cubains avec expérience dans les meilleures académies de La Havane. Réservez votre cours d\'essai.',
    },
    bachataSensual: {
      title: 'Cours de Bachata Sensuelle à Barcelone | Apprenez avec des Champions du Monde | Farray\'s Center',
      description: 'Apprenez la bachata sensuelle à Barcelone avec Mathias Font et Eugenia Trujillo, champions du monde de Salsa LA. Cours du débutant à l\'avancé près de Plaza España.',
    },
    salsaCubana: {
      title: 'Cours de Salsa Cubaine à Barcelone | Casino, Rueda et Son | Farray\'s Center',
      description: 'Apprenez la Salsa Cubaine authentique à Barcelone avec des maîtres cubains. Cours de Casino, Rueda de Casino et Son Cubain. Méthode Farray® avec technique de La Havane. Réservez votre cours d\'essai!',
    },
    salsaLadyStyle: {
      title: 'Cours de Salsa Lady Style à Barcelone | Style Féminin et Élégance | Farray\'s Center',
      description: 'Cours de Salsa Lady Style à Barcelone avec Yunaisy Farray. Développez votre féminité, élégance et style personnel en dansant la salsa. Méthode Farray® reconnue par CID-UNESCO. Réservez votre cours!',
    },
    folkloreCubano: {
      title: 'Cours de Folklore Cubain à Barcelone | Danses aux Orishas | Farray\'s Center',
      description: 'Apprenez le Folklore Cubain authentique à Barcelone. Danses aux Orishas, Yoruba, Rumba et plus. Maîtres cubains spécialisés. Entre Plaza España et Sants. Essai gratuit!',
    },
    timba: {
      title: 'Cours de Timba à Barcelone | Lady Timba et Timba en Couple | Farray\'s Center',
      description: 'Apprenez la Timba Cubaine à Barcelone avec des maîtres cubains. Lady Timba avec Yunaisy Farray et Timba en Couple avec Grechén Mendez. Despelote, improvisation et saveur cubaine. Réservez votre cours!',
    },
    danzasUrbanas: {
      title: 'Cours de Danses Urbaines à Barcelone | Hip Hop, Dancehall, K-Pop et Reggaeton | Farray\'s Center',
      description: 'Découvrez nos cours de danses urbaines à Barcelone : Hip Hop, Dancehall, K-Pop, Reggaeton, Twerk, Afrobeat et plus. Académie de référence pour les styles urbains. Essayez un cours gratuit.',
    },
    dancehall: {
      title: 'Cours de Dancehall à Barcelone - Académie de Danse Urbaine | Farray\'s Center',
      description: 'Apprenez le Dancehall authentique à Barcelone avec des professeurs experts. Cours pour tous les niveaux. Découvrez le rythme de la Jamaïque.',
    },
    twerk: {
      title: 'Cours de Twerk à Barcelone | Farray\'s Center',
      description: 'Apprenez le Twerk et le Perreo à Barcelone avec Sandra Gómez. Cours de danse urbaine pour tous les niveaux. Libérez votre énergie et votre confiance!',
    },
    afrobeat: {
      title: 'Cours d\'Afrobeats et Afrodance à Barcelone | Farray\'s Center',
      description: 'Apprenez l\'Afrobeats et l\'Afrodance à Barcelone avec des professeurs natifs d\'Afrique. Cours d\'Amapiano, Ntcham et danses africaines modernes pour tous les niveaux.',
    },
    hipHopReggaeton: {
      title: 'Cours de Hip Hop Reggaeton à Barcelone | Farray\'s Center',
      description: 'Apprenez le Hip Hop Reggaeton à Barcelone avec Charlie Breezy. Fusion unique de hip-hop et reggaeton avec beaucoup de flow. Cours pour tous les niveaux près de Plaza España et Sants.',
    },
    sexyReggaeton: {
      title: 'Cours de Sexy Reggaeton à Barcelone | Farray\'s Center',
      description: 'Apprenez le Sexy Reggaeton à Barcelone avec Yunaisy Farray. Perreo, body roll et sensualité. Cours pour tous les niveaux près de Plaza España et Sants.',
    },
    reggaetonCubano: {
      title: 'Cours de Reggaeton Cubain à Barcelone | Reparto et Cubatón | Farray\'s Center',
      description: 'Apprenez le Reggaeton Cubain authentique à Barcelone avec Yunaisy Farray. Reparto, Cubatón, improvisation et isolation corporelle. Cours pour tous les niveaux.',
    },
    heelsBarcelona: {
      title: 'Cours de Heels à Barcelone | Femmology et Sexy Style | Farray\'s Center',
      description: 'Apprends à danser en talons avec élégance et sensualité à Barcelone. Cours de Femmology Heels et Sexy Style avec Yunaisy Farray, reconnue par CID-UNESCO. Tous les niveaux.',
    },
    femmology: {
      title: 'Cours de Femmology à Barcelone | Danse-Thérapie et Féminité | Farray\'s Center',
      description: 'Découvrez Femmology à Barcelone: danse-thérapie en talons créée par Yunaisy Farray. Connectez avec votre féminité, estime de soi et sensualité. Méthode Farray®. Réservez votre cours!',
    },
    sexyStyle: {
      title: 'Cours de Sexy Style à Barcelone | Apprenez à Danser avec Sensualité | Farray\'s Center',
      description: 'Cours de Sexy Style à Barcelone avec Yasmina Fernández. Apprenez à vous exprimer avec sensualité, confiance et mouvement. Tous niveaux. Réservez votre cours d\'essai!',
    },
    modernJazz: {
      title: 'Cours de Modern Jazz à Barcelone | Technique et Expression avec Alejandro Miñoso | Farray\'s Center',
      description: 'Cours de Modern Jazz à Barcelone avec Alejandro Miñoso. Technique, musicalité et expression corporelle. Du débutant à l\'avancé. Réservez votre cours d\'essai!',
    },
    ballet: {
      title: 'Cours de Ballet à Barcelone | Technique Classique et Élégance | Farray\'s Center',
      description: "Cours de ballet classique à Barcelone pour adultes. Apprenez la technique, la posture et l'élégance avec des maîtres formés à l'ENA. Académie CID-UNESCO entre Plaza España et Sants.",
    },
    cuerpoFit: {
      title: 'Cuerpo-Fit Barcelone | Cardio Dance et Entraînement Full Body | Farray\'s Center',
      description: 'Brûlez 400-500 calories en dansant avec Cuerpo-Fit à Barcelone. Entraînement full body avec éléments de danse. Cours hybride cardio et tonification pour tous niveaux. Lundis 20h près de Plaza España.',
    },
    baileManananas: {
      title: 'Cours de Danse le Matin à Barcelone | 13 Styles de 10h à 13h | Farray\'s Center',
      description: 'Cours de danse le matin à Barcelone: Contemporain, Ballet, Modern Jazz, Sexy Style, Reggaeton et plus. Horaire de 10h à 13h. Idéal pour les équipes de l\'après-midi. Près de Plaza España.',
    },
    clasesParticulares: {
      title: 'Cours Particuliers de Danse à Barcelone | Personnalisé et à Votre Rythme | Farray\'s Center',
      description: 'Cours particuliers de danse à Barcelone avec professeur 100% dédié. Salsa, Bachata, Dancehall, Danse Contemporaine. Enseignement personnalisé, horaires flexibles et résultats garantis. Réservez votre cours maintenant!',
    },
    about: {
      title: 'À Propos | Farray\'s International Dance Center Barcelone',
      description: 'Découvrez notre histoire, valeurs et équipe. Académie de danse à Barcelone fondée en 2017 avec méthode propre et professeurs internationaux.',
    },
    yunaisy: {
      title: 'Yunaisy Farray | Fondatrice et Directrice | Farray\'s Center',
      description: 'Rencontrez Yunaisy Farray, danseuse professionnelle cubaine et fondatrice de Farray\'s International Dance Center. Plus de 20 ans d\'expérience en danse.',
    },
    metodoFarray: {
      title: 'Méthode Farray® | Système Pédagogique Exclusif de Danse | Farray\'s Center',
      description: 'Découvrez la Méthode Farray®, système pédagogique exclusif qui fusionne discipline technique cubaine, rythme afro-caribéen et innovation. Certification CID-UNESCO. Apprenez à danser vraiment.',
    },
    merchandising: {
      title: 'Merchandising | T-Shirts, Sweats et Accessoires | Farray\'s Center',
      description: 'Achetez le merchandising officiel de Farray\'s Center : t-shirts, sweats, sacs et plus. Portez votre passion pour la danse avec vous.',
    },
    regalaBaile: {
      title: 'Offrez la Danse | Cartes Cadeaux pour Cours de Danse | Farray\'s Center',
      description: 'Offrez des cours de danse avec nos cartes cadeaux. Le cadeau parfait pour les amoureux de la danse. Valable pour tous les cours et niveaux.',
    },
    facilities: {
      title: 'Installations | Studios de Danse Professionnels à Barcelone | Farray\'s Center',
      description: 'Découvrez nos installations : 3 studios de danse équipés de miroirs, barres, sol professionnel et vestiaires. Emplacement central à Barcelone.',
    },
    contact: {
      title: 'Contact | Farray\'s International Dance Center Barcelone',
      description: 'Contactez-nous. Carrer d\'Entença 100, Barcelone. Tél: +34 622 24 70 85. Réservez votre cours d\'essai gratuit.',
    },
    blog: {
      title: 'Blog de Danse | Conseils, Tutoriels et Histoire de la Danse | Farray\'s Center',
      description: 'Découvrez conseils, tutoriels et la fascinante histoire de la danse. Conseils experts de danseurs professionnels pour améliorer votre technique et profiter de chaque pas.',
    },
    blogLifestyle: {
      title: 'Lifestyle et Danse | Bien-être et Art de Vivre | Farray\'s Center Blog',
      description: 'Découvrez comment la danse transforme votre vie. Articles sur le bien-être, le bonheur et l\'art de vivre à travers la danse.',
    },
    blogBeneficiosSalsa: {
      title: '10 Bienfaits de Danser la Salsa qui Changeront Votre Vie | Farray\'s Center',
      description: 'Découvrez les 10 bienfaits scientifiquement prouvés de danser la salsa : brûlez 400 cal/heure, améliorez la santé cardiovasculaire, réduisez le stress et boostez l\'estime de soi. Guide complet.',
    },
    blogHistoria: {
      title: 'Histoire de la Danse | Origines et Évolution | Farray\'s Center Blog',
      description: 'Découvrez la fascinante histoire de la danse : origines, évolution et comment elle est arrivée à Barcelone. Articles sur la salsa, le dancehall et plus.',
    },
    blogHistoriaSalsa: {
      title: 'Histoire de la Salsa à Barcelone : des Caraïbes et New York à Farray\'s | Farray\'s Center',
      description: 'Découvrez la fascinante histoire de la salsa : de ses origines caribéennes et new-yorkaises jusqu\'à son arrivée à Barcelone. Plus de 60 ans de rythme qui ont changé le monde.',
    },
    blogHistoriaBachata: {
      title: 'Histoire de la Bachata : Du Quartier Dominicain à Barcelone | Farray\'s Center',
      description: 'Découvrez l\'histoire de la bachata : de ses humbles origines en République Dominicaine jusqu\'à devenir un phénomène mondial. Romeo Santos, bachata sensuelle et plus.',
    },
    blogTutoriales: {
      title: 'Tutoriels de Danse | Farray\'s Center Blog',
      description: 'Guides et tutoriels pour apprendre à danser : techniques, pas de base et conseils de professionnels pour salsa, bachata, dancehall et plus de styles.',
    },
    blogSalsaRitmo: {
      title: 'Salsa : Le Rythme qui a Conquis le Monde | Farray\'s Center',
      description: 'Découvrez les différents styles de salsa : cubaine, rueda de casino, salsa en ligne et plus. Guide complet pour comprendre et danser la salsa à Barcelone.',
    },
    blogClasesSalsaBarcelona: {
      title: 'Hommes et femmes, parlons salsa ? | Farray\'s Center Blog',
      description: 'La salsa comme langage universel : réflexions sur la piste de danse comme espace de connexion entre hommes et femmes. Par Mar Guerrero.',
    },
    blogTips: {
      title: 'Conseils de Danse | Farray\'s Center Blog',
      description: 'Conseils pratiques et guides pour débutants et danseurs de tous niveaux à Barcelone.',
    },
    blogClasesPrincipiantes: {
      title: 'Cours de danse pour débutants à Barcelone | Farray\'s Center',
      description: 'Guide complet pour commencer à danser à Barcelone. Cours de bienvenue gratuit (promotionnel) ou dès 10€. Participation ponctuelle dès 20€.',
    },
    promoClaseGratis: {
      title: 'Votre Premier Cours de Danse GRATUIT | Farray\'s Center Barcelone',
      description: 'Réservez votre cours d\'essai gratuit dans l\'école de danse la plus complète de Barcelone. +15 000 élèves, +40 styles. Places limitées !',
      robots: 'noindex, nofollow',
    },
    promoSexyReggaeton: {
      title: 'Cours de Sexy Reggaeton GRATUIT à Barcelone | Farray\'s Center',
      description: 'Apprenez à bouger au rythme du reggaeton avec sensualité et confiance. Premier cours GRATUIT. +15 000 élèves, professeure experte.',
      robots: 'noindex, nofollow',
    },
    // New class pages
    afroContemporaneo: {
      title: 'Cours d\'Afro Contemporain à Barcelone | Fusion Danse Africaine et Contemporaine | Farray\'s Center',
      description: 'Apprenez l\'Afro Contemporain à Barcelone : fusion de danse africaine traditionnelle et technique contemporaine. Cours pour tous niveaux. Académie CID-UNESCO. Réservez votre cours !',
    },
    afroJazz: {
      title: 'Cours d\'Afro Jazz à Barcelone | Rythme Africain et Technique Jazz | Farray\'s Center',
      description: 'Cours d\'Afro Jazz à Barcelone : combinaison de rythmes africains et technique de jazz moderne. Expression corporelle, musicalité et énergie. Tous niveaux. Essai gratuit !',
    },
    contemporaneo: {
      title: 'Cours de Danse Contemporaine à Barcelone | Technique et Expression | Farray\'s Center',
      description: 'Cours de danse contemporaine à Barcelone pour adultes. Développez technique, expression corporelle et créativité. Académie accréditée CID-UNESCO. Réservez votre cours d\'essai !',
    },
    stretching: {
      title: 'Cours de Stretching pour Danseurs à Barcelone | Flexibilité et Mobilité | Farray\'s Center',
      description: 'Cours de stretching spécialisés pour danseurs à Barcelone. Améliorez votre flexibilité, mobilité et prévenez les blessures. Complément parfait pour tout style de danse.',
    },
    hipHop: {
      title: 'Cours de Hip Hop à Barcelone | Apprenez avec des Professionnels | Farray\'s Center',
      description: 'Apprenez le Hip Hop à Barcelone avec des professeurs experts. Cours du débutant à l\'avancé. Styles : Old School, New Style, House et plus. Premier cours gratuit !',
    },
    entrenamientoBailarines: {
      title: 'Entraînement pour Danseurs à Barcelone | Technique et Condition Physique | Farray\'s Center',
      description: 'Entraînement spécialisé pour danseurs à Barcelone. Améliorez votre technique, force, endurance et flexibilité. Programme conçu par des professionnels de la danse.',
    },
    bachataLadyStyle: {
      title: 'Cours de Bachata Lady Style à Barcelone | Style Féminin et Sensualité | Farray\'s Center',
      description: 'Cours de Bachata Lady Style à Barcelone. Développez votre féminité, élégance et style personnel en dansant la bachata. Mouvements sensuels et expressifs. Réservez votre cours !',
    },
    bumBum: {
      title: 'Bum Bum - Exercices Fessiers à Barcelone | Tonification et Fitness | Farray\'s Center',
      description: 'Cours de Bum Bum à Barcelone : exercices spécialisés pour fessiers et jambes. Tonifiez, renforcez et sculptez avec musique et énergie. Premier cours gratuit !',
    },
    cuerpoFitPage: {
      title: 'Conditionnement Physique pour Danseurs à Barcelone | Cuerpo Fit | Farray\'s Center',
      description: 'Cours de conditionnement physique pour danseurs à Barcelone. Améliorez force, flexibilité et endurance avec la Méthode Farray. Entraînement fonctionnel spécialisé.',
    },
    // New non-class pages
    profesores: {
      title: 'Professeurs de Danse à Barcelone | Équipe de Farray\'s Center',
      description: 'Rencontrez notre équipe de professeurs de danse à Barcelone. Danseurs professionnels du monde entier avec des années d\'expérience. Certifiés CID-UNESCO.',
    },
    faq: {
      title: 'Questions Fréquentes | Farray\'s International Dance Center Barcelone',
      description: 'Obtenez des réponses sur nos cours de danse à Barcelone. Horaires, tarifs, niveaux, inscription et tout ce que vous devez savoir avant de commencer.',
    },
    alquilerSalas: {
      title: 'Location de Studios de Danse à Barcelone | Espaces Professionnels | Farray\'s Center',
      description: 'Louez nos studios de danse professionnels à Barcelone. 3 espaces équipés de miroirs, barres et sol de danse. Idéal pour répétitions, enregistrements et événements.',
    },
    estudioGrabacion: {
      title: 'Studio de Tournage Vidéo Danse à Barcelone | Production Audiovisuelle | Farray\'s Center',
      description: 'Studio d\'enregistrement pour vidéos de danse à Barcelone. Équipement professionnel, éclairage et son. Parfait pour clips, tutoriels et contenu réseaux sociaux.',
    },
    // Legal pages
    termsConditions: {
      title: 'Conditions Générales | Farray\'s International Dance Center',
      description: 'Conditions générales d\'utilisation des services de Farray\'s Center. Informations légales sur les inscriptions, paiements et politiques de l\'académie.',
    },
    legalNotice: {
      title: 'Mentions Légales | Farray\'s International Dance Center',
      description: 'Mentions légales de Farray\'s Center. Informations sur l\'entreprise, propriété intellectuelle et conditions d\'utilisation du site.',
    },
    privacyPolicy: {
      title: 'Politique de Confidentialité | Farray\'s International Dance Center',
      description: 'Politique de confidentialité de Farray\'s Center. Informations sur le traitement des données personnelles selon le RGPD.',
    },
    cookiePolicy: {
      title: 'Politique de Cookies | Farray\'s International Dance Center',
      description: 'Politique de cookies de Farray\'s Center. Informations sur les cookies utilisés sur notre site web.',
    },
    // Additional pages
    serviciosBaile: {
      title: 'Services de Danse à Barcelone | Farray\'s Center',
      description: 'Services professionnels de danse à Barcelone : cours particuliers, chorégraphies pour événements, spectacles et performances.',
    },
    calendario: {
      title: 'Calendrier des Événements | Farray\'s International Dance Center',
      description: 'Calendrier des événements, workshops et activités spéciales à Farray\'s Center Barcelone.',
    },
    salsaLadyStyleV2: {
      title: 'Cours de Salsa Lady Style à Barcelone | Farray\'s Center',
      description: 'Cours de Salsa Lady Style à Barcelone. Développez votre féminité, élégance et style personnel en dansant la salsa avec la Méthode Farray®.',
    },
    notFound: {
      title: 'Page Non Trouvée | 404 | Farray\'s Center',
      description: 'La page que vous recherchez n\'existe pas. Retournez à la page d\'accueil ou explorez nos cours de danse à Barcelone.',
      robots: 'noindex, nofollow',
    },
    // Generic Dance Landing Pages (auto-generated from LANDING_METADATA)
    ...LANDING_METADATA.fr,
  },
};

// =============================================================================
// INITIAL CONTENT GENERATION
// =============================================================================
// Genera contenido pre-renderizado para cada página.
// - Páginas con metadata: genera automáticamente desde title/description
// - Páginas excluidas: mantienen '' vacío (home, horarios, etc.)
// - Páginas legales: tienen contenido manual específico (mejor calidad)
// - Landings: usan LANDING_CONTENT (su propio sistema)

/**
 * Genera el objeto initialContent completo para un idioma.
 * Combina: contenido auto-generado + overrides manuales + landings
 */
const generateInitialContentForLang = (lang, manualOverrides) => {
  const result = {};

  // 1. Generar contenido automático para todas las páginas con metadata
  const langMetadata = metadata[lang] || {};
  for (const pageKey of Object.keys(langMetadata)) {
    result[pageKey] = generateContentFromMetadata(pageKey, lang, metadata);
  }

  // 2. Aplicar overrides manuales (páginas legales, notFound, etc.)
  Object.assign(result, manualOverrides);

  // 3. Añadir landings
  Object.assign(result, LANDING_CONTENT[lang] || {});

  return result;
};

// Overrides manuales por idioma (páginas que necesitan contenido específico)
const manualOverrides = {
  es: {
    termsConditions: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Términos y Condiciones</h1><p>Información legal sobre inscripciones, pagos y políticas de Farray's Center.</p></main>`,
    legalNotice: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Aviso Legal</h1><p>Información sobre la empresa, propiedad intelectual y condiciones de uso.</p></main>`,
    privacyPolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Política de Privacidad</h1><p>Información sobre el tratamiento de datos personales según el RGPD.</p></main>`,
    cookiePolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Política de Cookies</h1><p>Información sobre las cookies utilizadas en nuestro sitio web.</p></main>`,
    serviciosBaile: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Servicios de Baile</h1><p>Clases particulares, coreografías para eventos, shows y espectáculos profesionales.</p></main>`,
    calendario: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Calendario de Eventos</h1><p>Workshops, masterclasses y actividades especiales en Farray's Center Barcelona.</p></main>`,
    notFound: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Página No Encontrada</h1><p>La página que buscas no existe. Vuelve a la página principal o explora nuestras clases de baile.</p></main>`,
  },
  ca: {
    termsConditions: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Termes i Condicions</h1><p>Informació legal sobre inscripcions, pagaments i polítiques de Farray's Center.</p></main>`,
    legalNotice: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Avís Legal</h1><p>Informació sobre l'empresa, propietat intel·lectual i condicions d'ús.</p></main>`,
    privacyPolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Política de Privacitat</h1><p>Informació sobre el tractament de dades personals segons el RGPD.</p></main>`,
    cookiePolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Política de Cookies</h1><p>Informació sobre les cookies utilitzades al nostre lloc web.</p></main>`,
    serviciosBaile: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Serveis de Ball</h1><p>Classes particulars, coreografies per a esdeveniments, shows i espectacles professionals.</p></main>`,
    calendario: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Calendari d'Esdeveniments</h1><p>Workshops, masterclasses i activitats especials a Farray's Center Barcelona.</p></main>`,
    notFound: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Pàgina No Trobada</h1><p>La pàgina que busques no existeix. Torna a la pàgina principal o explora les nostres classes de ball.</p></main>`,
  },
  en: {
    termsConditions: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Terms and Conditions</h1><p>Legal information about registration, payments and policies at Farray's Center.</p></main>`,
    legalNotice: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Legal Notice</h1><p>Information about the company, intellectual property and terms of use.</p></main>`,
    privacyPolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Privacy Policy</h1><p>Information about personal data processing in accordance with GDPR.</p></main>`,
    cookiePolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cookie Policy</h1><p>Information about cookies used on our website.</p></main>`,
    serviciosBaile: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Dance Services</h1><p>Private lessons, event choreography, professional shows and performances.</p></main>`,
    calendario: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Events Calendar</h1><p>Workshops, masterclasses and special activities at Farray's Center Barcelona.</p></main>`,
    notFound: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Page Not Found</h1><p>The page you are looking for does not exist. Go back to the home page or explore our dance classes.</p></main>`,
  },
  fr: {
    termsConditions: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Conditions Générales</h1><p>Informations légales sur les inscriptions, paiements et politiques de Farray's Center.</p></main>`,
    legalNotice: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Mentions Légales</h1><p>Informations sur l'entreprise, propriété intellectuelle et conditions d'utilisation.</p></main>`,
    privacyPolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Politique de Confidentialité</h1><p>Informations sur le traitement des données personnelles conformément au RGPD.</p></main>`,
    cookiePolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Politique de Cookies</h1><p>Informations sur les cookies utilisés sur notre site web.</p></main>`,
    serviciosBaile: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Services de Danse</h1><p>Cours particuliers, chorégraphies pour événements, shows et spectacles professionnels.</p></main>`,
    calendario: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Calendrier des Événements</h1><p>Workshops, masterclasses et activités spéciales à Farray's Center Barcelone.</p></main>`,
    notFound: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Page Non Trouvée</h1><p>La page que vous recherchez n'existe pas. Retournez à la page d'accueil ou explorez nos cours de danse.</p></main>`,
  },
};

// Generar initialContent automáticamente para cada idioma
const initialContent = {
  es: generateInitialContentForLang('es', manualOverrides.es),
  ca: generateInitialContentForLang('ca', manualOverrides.ca),
  en: generateInitialContentForLang('en', manualOverrides.en),
  fr: generateInitialContentForLang('fr', manualOverrides.fr),
};

// Log de páginas con contenido generado (para debug)
const pagesWithContent = Object.keys(initialContent.es).filter(k => initialContent.es[k] !== '');
console.log(`📝 SEO para LLMs: ${pagesWithContent.length} páginas con contenido pre-renderizado`);

console.log('🚀 Starting prerendering process...\n');

// Read base HTML
const distPath = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('❌ Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// Find critical asset files for preloading
const assetsPath = path.join(distPath, 'assets');
const assetFiles = fs.readdirSync(assetsPath);

// Find the main chunks that should be preloaded
const criticalChunks = {
  index: assetFiles.find(f => f.startsWith('index-') && f.endsWith('.js')),
  reactVendor: assetFiles.find(f => f.startsWith('react-vendor-') && f.endsWith('.js')),
  routerVendor: assetFiles.find(f => f.startsWith('router-vendor-') && f.endsWith('.js')),
  mainCss: assetFiles.find(f => f.startsWith('style-') && f.endsWith('.css')),
  // Locale-specific i18n chunks (named i18n-{locale}-*.js by vite.config.ts)
  es: assetFiles.find(f => f.startsWith('i18n-es-') && f.endsWith('.js')),
  ca: assetFiles.find(f => f.startsWith('i18n-ca-') && f.endsWith('.js')),
  en: assetFiles.find(f => f.startsWith('i18n-en-') && f.endsWith('.js')),
  fr: assetFiles.find(f => f.startsWith('i18n-fr-') && f.endsWith('.js')),
};

// Generate preload hints for critical assets (common to all pages)
const commonPreloadHints = [];
if (criticalChunks.index) {
  commonPreloadHints.push(`<link rel="modulepreload" href="/assets/${criticalChunks.index}" />`);
}
if (criticalChunks.reactVendor) {
  commonPreloadHints.push(`<link rel="modulepreload" href="/assets/${criticalChunks.reactVendor}" />`);
}
if (criticalChunks.routerVendor) {
  commonPreloadHints.push(`<link rel="modulepreload" href="/assets/${criticalChunks.routerVendor}" />`);
}
// Note: CSS preload removed - it causes "preloaded but not used" warnings because
// the CSS is loaded via Vite's JS module system, not a direct <link rel="stylesheet">.
// By the time JS requests the CSS, the browser has already timed out the preload.

console.log(`📦 Found critical chunks:`);
console.log(`   - Main bundle: ${criticalChunks.index || 'not found'}`);
console.log(`   - React vendor: ${criticalChunks.reactVendor || 'not found'}`);
console.log(`   - Router vendor: ${criticalChunks.routerVendor || 'not found'}`);
console.log(`   - Main CSS: ${criticalChunks.mainCss || 'not found'}`);
console.log(`   - i18n chunks: es=${criticalChunks.es ? '✓' : '✗'}, ca=${criticalChunks.ca ? '✓' : '✗'}, en=${criticalChunks.en ? '✓' : '✗'}, fr=${criticalChunks.fr ? '✓' : '✗'}\n`);

let generatedCount = 0;

routes.forEach(route => {
  const { path: routePath, lang, page } = route;

  // Get metadata and content
  const meta = metadata[lang][page];
  const content = initialContent[lang]?.[page] || '';

  // Build preload hints for this specific page (common + locale-specific i18n)
  const pagePreloadHints = [...commonPreloadHints];
  if (criticalChunks[lang]) {
    pagePreloadHints.push(`<link rel="modulepreload" href="/assets/${criticalChunks[lang]}" />`);
  }
  
  const preloadHintsHtml = pagePreloadHints.length > 0 
    ? `\n    <!-- Preload critical chunks for faster LCP -->\n    ${pagePreloadHints.join('\n    ')}\n`
    : '';

  // Generate hreflang alternates
  let pagePath = '';
  if (page === 'home') {
    pagePath = '';
  } else if (page === 'classes') {
    pagePath = 'clases/baile-barcelona';
  } else if (page === 'danza') {
    pagePath = 'clases/danza-barcelona';
  } else if (page === 'salsaBachata') {
    pagePath = 'clases/salsa-bachata-barcelona';
  } else if (page === 'bachataSensual') {
    pagePath = 'clases/bachata-barcelona';
  } else if (page === 'salsaCubana') {
    pagePath = 'clases/salsa-cubana-barcelona';
  } else if (page === 'salsaLadyStyle') {
    pagePath = 'clases/salsa-lady-style-barcelona';
  } else if (page === 'folkloreCubano') {
    pagePath = 'clases/folklore-cubano';
  } else if (page === 'timba') {
    pagePath = 'clases/timba-barcelona';
  } else if (page === 'danzasUrbanas') {
    pagePath = 'clases/danzas-urbanas-barcelona';
  } else if (page === 'dancehall') {
    pagePath = 'clases/dancehall-barcelona';
  } else if (page === 'twerk') {
    pagePath = 'clases/twerk-barcelona';
  } else if (page === 'heelsBarcelona') {
    pagePath = 'clases/heels-barcelona';
  } else if (page === 'modernJazz') {
    pagePath = 'clases/modern-jazz-barcelona';
  } else if (page === 'clasesParticulares') {
    pagePath = 'clases-particulares-baile';
  } else if (page === 'blog') {
    pagePath = 'blog';
  } else if (page === 'blogLifestyle') {
    pagePath = 'blog/lifestyle';
  } else if (page === 'blogBeneficiosSalsa') {
    pagePath = 'blog/lifestyle/beneficios-bailar-salsa';
  } else if (page === 'blogHistoria') {
    pagePath = 'blog/historia';
  } else if (page === 'blogHistoriaSalsa') {
    pagePath = 'blog/historia/historia-salsa-barcelona';
  } else if (page === 'blogHistoriaBachata') {
    pagePath = 'blog/historia/historia-bachata-barcelona';
  } else if (page === 'blogTutoriales') {
    pagePath = 'blog/tutoriales';
  } else if (page === 'blogSalsaRitmo') {
    pagePath = 'blog/tutoriales/salsa-ritmo-conquisto-mundo';
  } else if (page === 'blogClasesSalsaBarcelona') {
    pagePath = 'blog/lifestyle/clases-de-salsa-barcelona';
  } else if (page === 'blogTips') {
    pagePath = 'blog/tips';
  } else if (page === 'blogClasesPrincipiantes') {
    pagePath = 'blog/tips/clases-baile-principiantes-barcelona-farrays';
  } else if (page === 'baileManananas') {
    pagePath = 'clases/baile-mananas';
  }

  const hreflangLinks = [
    `<link rel="alternate" hreflang="es" href="https://www.farrayscenter.com/es${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="ca" href="https://www.farrayscenter.com/ca${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="en" href="https://www.farrayscenter.com/en${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="fr" href="https://www.farrayscenter.com/fr${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="x-default" href="https://www.farrayscenter.com/es${pagePath ? `/${pagePath}` : ''}" />`,
  ].join('\n    ');

  const currentUrl = `https://www.farrayscenter.com/${routePath}`;

  // Locale persistence script - runs before React mounts
  // NOTE: This script is STATIC (same for all pages) to avoid CSP hash issues
  // It reads the locale from the HTML lang attribute which is set during prerendering
  const localeScript = `
    <script>
      (function(){var l=document.documentElement.lang||'es';localStorage.setItem('fidc_preferred_locale',l);document.cookie='fidc_locale='+l+';expires='+new Date(Date.now()+31536e6).toUTCString()+';path=/;SameSite=Lax';})();
    </script>
  `;

  // Create prerendered HTML
  let html = baseHtml;

  // Update lang attribute
  html = html.replace(/<html([^>]*)lang="[^"]*"/, `<html$1lang="${lang}"`);
  html = html.replace(/<html(?![^>]*lang=)/, `<html lang="${lang}"`);

  // Remove existing SEO meta tags to prevent duplicates
  // Remove title tags (after the first one from charset/viewport section)
  html = html.replace(/<title>.*?<\/title>/g, '');
  // Remove description meta tags
  html = html.replace(/<meta\s+name="description"[^>]*>/gi, '');
  // Remove canonical links
  html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
  // Remove hreflang links
  html = html.replace(/<link\s+rel="alternate"\s+hreflang="[^"]*"[^>]*>/gi, '');
  // Remove Open Graph tags
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, '');
  // Remove Twitter Card tags
  html = html.replace(/<meta\s+(?:name|property)="twitter:[^"]*"[^>]*>/gi, '');
  // Remove robots meta tag (will be replaced with page-specific value)
  html = html.replace(/<meta\s+name="robots"[^>]*>/gi, '');

  // Remove hero-video-poster preload for non-home pages (only home uses the hero video)
  // This prevents "resource was preloaded but not used" warnings
  if (page !== 'home') {
    html = html.replace(/<link[^>]*hero-video-poster\.webp[^>]*>/gi, '');
  }

  // Inject metadata in <head>
  const robotsContent = meta.robots || 'index, follow';
  html = html.replace('</head>', `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta name="robots" content="${robotsContent}" />
    <link rel="canonical" href="${currentUrl}" />
    ${hreflangLinks}

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${currentUrl}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="https://www.farrayscenter.com/images/og-${page}.jpg" />
    <meta property="og:locale" content="${lang}_ES" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${currentUrl}" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="https://www.farrayscenter.com/images/og-${page}.jpg" />
${preloadHintsHtml}
    ${localeScript}
  </head>`);

  // Inject prerendered content in <div id="root">
  // Content MUST be inside the div for SSG to work (not as HTML comment)
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root" data-prerendered="true">${content}</div>`
  );

  // Determine file path
  const filePath = routePath === ''
    ? path.join(distPath, 'index.html')
    : path.join(distPath, routePath, 'index.html');

  // Create directory if it doesn't exist
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // NOTE: Non-blocking CSS pattern removed - CSP hashes don't work for inline event handlers (onload)
  // Critical CSS is already inline, so render-blocking impact is minimal

  // Save file
  fs.writeFileSync(filePath, html);
  generatedCount++;

  console.log(`✅ Generated: /${routePath || '(root)'} [${lang}] → ${filePath}`);
});

console.log(`\n🎉 Prerendering complete! Generated ${generatedCount} pages.`);
console.log('\n📊 Summary:');
console.log(`   - Total pages: ${generatedCount}`);
console.log(`   - Languages: es, ca, en, fr (4)`);
console.log(`   - Pages per language: home, baile-barcelona, danza-barcelona, salsa-bachata-barcelona, danzas-urbanas-barcelona, dancehall-barcelona, twerk-barcelona, clases-particulares-baile (8)`);
console.log(`   - SEO: ✅ Metadata, ✅ hreflang, ✅ Canonical, ✅ Open Graph`);
console.log(`   - Locale: ✅ Pre-set via localStorage + cookie before React hydration`);
console.log('\n🔍 Verify: Run "npm run preview" and view page source to see prerendered content\n');
