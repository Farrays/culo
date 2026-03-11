import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateAllJsonLd, BLOG_ARTICLE_DATA } from './scripts/schema-generators.mjs';
import { SEO_META_KEYS } from './constants/seo-meta-keys.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 
// ENTERPRISE LANDING CONFIGURATION
// 
// Single source of truth for all landing pages (Facebook Ads campaigns)
// To add a new landing: just add the slug here, everything else is auto-generated

const SUPPORTED_LOCALES = ['es', 'ca', 'en', 'fr'];

// Load pages.json translations for rich pre-rendered content (class pages)
// These are read at build time to generate semantic HTML for crawlers
const pagesTranslations = {};
for (const locale of SUPPORTED_LOCALES) {
  try {
    const filePath = path.join(__dirname, 'i18n', 'locales', locale, 'pages.json');
    pagesTranslations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.warn(`Warning: Could not load pages.json for locale "${locale}":`, e.message);
    pagesTranslations[locale] = {};
  }
}

// Load blog.json translations for blog Article/FAQPage JSON-LD schemas
const blogTranslations = {};
for (const locale of SUPPORTED_LOCALES) {
  try {
    const filePath = path.join(__dirname, 'i18n', 'locales', locale, 'blog.json');
    blogTranslations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.warn(`Warning: Could not load blog.json for locale "${locale}":`, e.message);
    blogTranslations[locale] = {};
  }
}

// Load home.json translations for DanceClassesPage FAQ schemas
const homeTranslations = {};
for (const locale of SUPPORTED_LOCALES) {
  try {
    const filePath = path.join(__dirname, 'i18n', 'locales', locale, 'home.json');
    homeTranslations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.warn(`Warning: Could not load home.json for locale "${locale}":`, e.message);
    homeTranslations[locale] = {};
  }
}

// Load schedule.json translations for HorariosPageV2 FAQ schemas
const scheduleTranslations = {};
for (const locale of SUPPORTED_LOCALES) {
  try {
    const filePath = path.join(__dirname, 'i18n', 'locales', locale, 'schedule.json');
    scheduleTranslations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.warn(`Warning: Could not load schedule.json for locale "${locale}":`, e.message);
    scheduleTranslations[locale] = {};
  }
}

// Load faq.json translations for FAQ page rich pre-rendered content
const faqTranslations = {};
for (const locale of SUPPORTED_LOCALES) {
  try {
    const filePath = path.join(__dirname, 'i18n', 'locales', locale, 'faq.json');
    faqTranslations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.warn(`Warning: Could not load faq.json for locale "${locale}":`, e.message);
    faqTranslations[locale] = {};
  }
}

// Load about.json translations for About/Yunaisy rich pre-rendered content
const aboutTranslations = {};
for (const locale of SUPPORTED_LOCALES) {
  try {
    const filePath = path.join(__dirname, 'i18n', 'locales', locale, 'about.json');
    aboutTranslations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.warn(`Warning: Could not load about.json for locale "${locale}":`, e.message);
    aboutTranslations[locale] = {};
  }
}

// Load contact.json translations for Contact page rich pre-rendered content
const contactTranslations = {};
for (const locale of SUPPORTED_LOCALES) {
  try {
    const filePath = path.join(__dirname, 'i18n', 'locales', locale, 'contact.json');
    contactTranslations[locale] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.warn(`Warning: Could not load contact.json for locale "${locale}":`, e.message);
    contactTranslations[locale] = {};
  }
}

// Load additional i18n namespaces for SEO metadata (single source of truth)
const commonTranslations = {};
const classesTranslations = {};
const calendarTranslations = {};
const bookingTranslations = {};
for (const locale of SUPPORTED_LOCALES) {
  const load = (ns) => {
    try {
      return JSON.parse(fs.readFileSync(path.join(__dirname, 'i18n', 'locales', locale, `${ns}.json`), 'utf-8'));
    } catch { return {}; }
  };
  commonTranslations[locale] = load('common');
  classesTranslations[locale] = load('classes');
  calendarTranslations[locale] = load('calendar');
  bookingTranslations[locale] = load('booking');
}

// Helper: look up i18n translation by namespace
const I18N_NS_MAP = {
  common: commonTranslations,
  pages: pagesTranslations,
  blog: blogTranslations,
  home: homeTranslations,
  faq: faqTranslations,
  about: aboutTranslations,
  contact: contactTranslations,
  schedule: scheduleTranslations,
  classes: classesTranslations,
  calendar: calendarTranslations,
  booking: bookingTranslations,
};

function getI18nValue(locale, ns, key) {
  return I18N_NS_MAP[ns]?.[locale]?.[key] || '';
}

const LANDING_SLUGS = [
  'dancehall',
  'twerk',
  'sexy-reggaeton',
  'sexy-style',
  'hip-hop-reggaeton',
  'contemporaneo',
  'femmology',
  'bachata',
  'bachata-curso', // Direct sale landing (Hormozi style)
  'salsa-curso',   // Direct sale landing (Hormozi style)
  'hip-hop',
  'afrobeats',
  'afro-jazz',
  'salsa-cubana',
  'ballet',
  'afro-contemporaneo',
  'clase-bienvenida',
  'profesor-reynier',
  'commercial-dance',
  'broadway-jazz',
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
    titleTemplate: (name) => `Clase de ${name} en Barcelona | Farray's Center`,
    descTemplate: (name) => `Aprende ${name} en Barcelona con profesores expertos. +15.000 alumnos formados. Método Farray® CID-UNESCO. ¡Reserva!`,
  },
  ca: {
    titleTemplate: (name) => `Classe de ${name} a Barcelona | Farray's Center`,
    descTemplate: (name) => `Aprèn ${name} a Barcelona amb professors experts. +15.000 alumnes formats. Mètode Farray® CID-UNESCO. Reserva!`,
  },
  en: {
    titleTemplate: (name) => `${name} Class in Barcelona | Farray's Center`,
    descTemplate: (name) => `Learn ${name} in Barcelona with expert instructors. +15,000 students trained. Farray Method® CID-UNESCO. Book now!`,
  },
  fr: {
    titleTemplate: (name) => `Cours de ${name} à Barcelone | Farray's Center`,
    descTemplate: (name) => `Apprenez le ${name} à Barcelone avec professeurs experts. +15 000 élèves formés. Méthode Farray® CID-UNESCO. Réservez!`,
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
  'bachata-curso': { es: 'Curso de Bachata', ca: 'Curs de Bachata', en: 'Bachata Course', fr: 'Cours de Bachata' },
  'salsa-curso': { es: 'Curso de Salsa', ca: 'Curs de Salsa', en: 'Salsa Course', fr: 'Cours de Salsa' },
  'hip-hop': { es: 'Hip Hop', ca: 'Hip Hop', en: 'Hip Hop', fr: 'Hip Hop' },
  'afrobeats': { es: 'Afrobeats', ca: 'Afrobeats', en: 'Afrobeats', fr: 'Afrobeats' },
  'afro-jazz': { es: 'Afro Jazz', ca: 'Afro Jazz', en: 'Afro Jazz', fr: 'Afro Jazz' },
  'salsa-cubana': { es: 'Salsa Cubana', ca: 'Salsa Cubana', en: 'Cuban Salsa', fr: 'Salsa Cubaine' },
  'ballet': { es: 'Ballet Clásico', ca: 'Ballet Clàssic', en: 'Classical Ballet', fr: 'Ballet Classique' },
  'afro-contemporaneo': { es: 'Afro Contemporáneo', ca: 'Afro Contemporani', en: 'Afro Contemporary', fr: 'Afro Contemporain' },
  'clase-bienvenida': { es: 'Clase de Bienvenida', ca: 'Classe de Benvinguda', en: 'Welcome Class', fr: 'Cours de Bienvenue' },
  'profesor-reynier': { es: 'Broadway Jazz y Commercial Dance', ca: 'Broadway Jazz i Commercial Dance', en: 'Broadway Jazz & Commercial Dance', fr: 'Broadway Jazz et Commercial Dance' },
  'commercial-dance': { es: 'Commercial Dance', ca: 'Commercial Dance', en: 'Commercial Dance', fr: 'Commercial Dance' },
  'broadway-jazz': { es: 'Broadway Jazz', ca: 'Broadway Jazz', en: 'Broadway Jazz', fr: 'Broadway Jazz' },
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

// 
// OG IMAGE MAPPING - Mapeo inteligente de imágenes Open Graph por página
// 
// Cada pageKey se mapea a su imagen OG correspondiente.
// Las imágenes pueden estar en:
// - /images/og-{name}.jpg (imágenes OG dedicadas)
// - /images/{folder}/og.jpg (subcarpetas con og.jpg)
// - /images/classes/{style}/img/{image}_1920.jpg (hero de clases como fallback)
// Fallback final: og-home.jpg

const OG_IMAGE_MAP = {
  // === Páginas principales ===
  home: 'og-home.jpg',
  classesHub: 'og-classes.jpg',
  classes: 'og-classes.jpg',
  horariosPrecio: 'og-horarios-clases-baile.jpg',
  horariosClases: 'og-horarios-clases-baile.jpg',
  preciosClases: 'og-horarios-clases-baile.jpg',

  // === Páginas de información ===
  about: 'og-home.jpg', // Usa home como fallback
  yunaisy: 'og-yunaisy-farray.jpg',
  metodoFarray: 'og-home.jpg',
  facilities: 'og-home.jpg',
  contact: 'og-home.jpg',
  faq: 'og-home.jpg',
  profesores: 'og-home.jpg',
  merchandising: 'og-home.jpg',
  regalaBaile: 'og-home.jpg',
  reservas: 'og-home.jpg',
  miReserva: 'og-home.jpg',
  fichaje: 'og-home.jpg',
  adminFichajes: 'og-home.jpg',
  adminReservas: 'og-home.jpg',
  feedbackGracias: 'og-home.jpg',
  feedbackComentario: 'og-home.jpg',
  asistenciaConfirmada: 'og-home.jpg',
  calendario: 'og-horarios-clases-baile.jpg',
  serviciosBaile: 'og-classes.jpg',

  // === Categorías de clases ===
  danza: 'categories/hero/clases-de-danza-og.jpg',
  salsaBachata: 'og-salsaBachata.jpg',
  danzasUrbanas: 'og-dancehall.jpg',

  // === Estilos de baile - Salsa/Bachata ===
  bachataSensual: 'classes/Bachata/img/clases-bachata-sensual-barcelona_1920.jpg',
  salsaCubana: 'classes/salsa-cubana/img/salsa-cubana_1920.jpg',
  salsaLadyStyle: 'classes/Salsa-Lady-Style/img/clases-salsa-lady-style-barcelona_1920.jpg',
  folkloreCubano: 'classes/folklore-cubano/img/folklore-calle-habana_1920.jpg',
  timba: 'classes/timba/img/timba-cubana_1920.jpg',
  bachataLadyStyle: 'classes/bachata-lady-style/img/clases-bachata-lady-style-barcelona_1920.jpg',
  kizomba: 'og-salsaBachata.jpg', // Usa salsa/bachata como fallback

  // === Estilos de baile - Urbano ===
  dancehall: 'og-dancehall.jpg',
  twerk: 'classes/twerk/img/clases-twerk-barcelona_1920.jpg',
  afrobeat: 'og-afrobeat.jpg',
  kpop: 'og-dancehall.jpg', // Usa dancehall como fallback urbano
  commercial: 'og-dancehall.jpg',
  hipHopReggaeton: 'classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_1920.jpg',
  sexyReggaeton: 'classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_1920.jpg',
  reggaetonCubano: 'classes/reggaeton-cubano/img/mgs_8884_1920.jpg',
  hipHop: 'classes/hip-hop/img/clases-hip-hop-barcelona_1920.jpg',

  // === Estilos de baile - Sexy/Femenino ===
  heelsBarcelona: 'classes/Heels/img/clases-heels-barcelona_1920.jpg',
  femmology: 'og-femmology.jpg',
  sexyStyle: 'og-sexy-style.jpg',

  // === Estilos de baile - Danza/Ballet ===
  modernJazz: 'og-modern-jazz.jpg',
  ballet: 'og-ballet.jpg',
  contemporaneo: 'classes/contemporaneo/img/mgs_5189_1920.jpg',
  afroContemporaneo: 'classes/afro-contemporaneo/img/mgs_5260_1920.jpg',
  afroJazz: 'classes/afro-jazz/img/afro-jazz_1920.jpg',

  // === Estilos de baile - Fitness/Cuerpo ===
  cuerpoFit: 'classes/cuerpo-fit/img/cuerpo-fit-entrenamiento-bailarines_1920.jpg',
  cuerpoFitPage: 'classes/cuerpo-fit/img/cuerpo-fit-entrenamiento-bailarines_1920.jpg',
  bumBum: 'og-ejercicios-gluteos-barcelona.jpg',
  stretching: 'og-stretching.jpg',
  entrenamientoBailarines: 'og-entrenamiento-bailarines.jpg',
  baileManananas: 'og-baileManananas.jpg',

  // === Servicios ===
  clasesParticulares: 'og-clasesParticulares.jpg',
  teamBuilding: 'og-classes.jpg',
  alquilerSalas: 'alquiler-salas/og.jpg',
  estudioGrabacion: 'estudio-grabacion/og.jpg',

  // === Blog - Hub y categorías ===
  blog: 'og-home.jpg',
  blogLifestyle: 'og-home.jpg',
  blogHistoria: 'og-home.jpg',
  blogTutoriales: 'og-home.jpg',
  blogTips: 'og-home.jpg',
  blogFitness: 'og-home.jpg',

  // === Blog - Artículos ===
  blogBeneficiosSalsa: 'blog/beneficios-salsa/og.jpg',
  blogClasesSalsaBarcelona: 'blog/hablemos-salsa/og.jpg',
  blogPerderMiedoBailar: 'blog/como-perder-miedo/og.jpg',
  blogHistoriaSalsa: 'blog/historia-salsa/og.jpg',
  blogHistoriaBachata: 'blog/historia-bachata/og.jpg',
  blogSalsaRitmo: 'blog/salsa-ritmo/og.jpg',
  blogSalsaVsBachata: 'blog/salsa-vs-bachata/og.jpg',
  blogClasesPrincipiantes: 'blog/clases-principiantes/og.jpg',
  blogAcademiaDanza: 'blog/academia-danza-barcelona/og.jpg',
  blogBalletAdultos: 'blog/ballet-adultos/og.jpg',
  blogDanzaContemporaneaVsJazzBallet: 'blog/danza-contemporanea-vs-jazz-ballet/og.jpg',
  blogBaileSaludMental: 'blog/beneficios-salsa/og.jpg', // Reutiliza beneficios
  blogDanzasUrbanas: 'blog/danzas-urbanas/og.jpg',
  blogModernJazz: 'blog/modern-jazz/og.jpg',
  blogBachata: 'blog/clases-bachata/og.jpg',

  // === Páginas legales ===
  termsConditions: 'og-home.jpg',
  legalNotice: 'og-home.jpg',
  privacyPolicy: 'og-home.jpg',
  cookiePolicy: 'og-home.jpg',

  // === Landing pages (Facebook Ads) - usan imagen del estilo ===
  dancehallLanding: 'og-dancehall.jpg',
  twerkLanding: 'classes/twerk/img/clases-twerk-barcelona_1920.jpg',
  sexyReggaetonLanding: 'classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_1920.jpg',
  sexyStyleLanding: 'og-sexy-style.jpg',
  hipHopReggaetonLanding: 'classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_1920.jpg',
  contemporaneoLanding: 'classes/contemporaneo/img/mgs_5189_1920.jpg',
  femmologyLanding: 'og-femmologyLanding.jpg',
  bachataLanding: 'classes/Bachata/img/clases-bachata-sensual-barcelona_1920.jpg',
  hipHopLanding: 'classes/hip-hop/img/clases-hip-hop-barcelona_1920.jpg',
  afrobeatsLanding: 'og-afrobeat.jpg',
  afroJazzLanding: 'classes/afro-jazz/img/afro-jazz_1920.jpg',
  salsaCubanaLanding: 'classes/salsa-cubana/img/salsa-cubana_1920.jpg',
  balletLanding: 'og-ballet.jpg',
  afroContemporaneoLanding: 'classes/afro-contemporaneo/img/mgs_5260_1920.jpg',
  jornadaPuertasAbiertasLanding: 'og-home.jpg',

  // === Promociones ===
  promoClaseGratis: 'og-home.jpg',
  promoSexyReggaeton: 'classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_1920.jpg',

  // === 404 ===
  notFound: 'og-home.jpg',

  // === Y&R Project (Linktree) ===
  yrProject: 'artists/yr-project/hero.jpeg',
};

// Función helper para obtener la URL completa de la imagen OG
const getOgImageUrl = (pageKey) => {
  const imagePath = OG_IMAGE_MAP[pageKey] || 'og-home.jpg';
  return `https://www.farrayscenter.com/images/${imagePath}`;
};

// 
// AUTO-GENERATE INITIAL CONTENT FROM METADATA (SEO para LLMs)
// 
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
  'reservas',       // Widget interactivo con APIs del navegador - causa hydration mismatch
  'miReserva',      // Página dinámica con datos de Redis
  'feedbackGracias', // Página de agradecimiento de feedback
  'asistenciaConfirmada', // Página de confirmación de asistencia
  'notFound',       // Ya tiene contenido
  // Páginas legales - ya tienen contenido manual
  'termsConditions',
  'legalNotice',
  'privacyPolicy',
  'cookiePolicy',
  'serviciosBaile',
];

// Map from pageKey (used in routes) to styleKey prefix (used in pages.json translation keys)
// Verified against actual translation keys in i18n/locales/*/pages.json
const STYLE_KEY_MAP = {
  bachataSensual: 'bachataV3',
  dancehall: 'dhV3',
  twerk: 'twerk',
  afrobeat: 'afro',
  hipHopReggaeton: 'hhr',
  commercial: 'commercial',
  cuerpoFit: 'cuerpofit',
  baileManananas: 'bailemanananas',
  sexyReggaeton: 'sxr',
  reggaetonCubano: 'rcb',
  femmology: 'fem',
  sexyStyle: 'sexystyle',
  modernJazz: 'modernjazz',
  ballet: 'ballet',
  salsaCubana: 'salsaCubana',
  folkloreCubano: 'folklore',
  timba: 'timba',
  salsaLadyStyle: 'salsaLady',
  bachataLadyStyle: 'bachataLady',
  afroContemporaneo: 'afrocontemporaneo',
  afroJazz: 'afrojazz',
  stretching: 'stretching',
  bumBum: 'bumbum',
  kpop: 'kpop',
  kizomba: 'kizomba',
  hipHop: 'hiphop',
  contemporaneo: 'contemporaneo',
};

// Map from blog page keys (used in routes) to blog.json translation key prefixes
// Verified against actual keys in i18n/locales/es/blog.json
const BLOG_ARTICLE_KEY_MAP = {
  blogBeneficiosSalsa: 'blogBeneficiosSalsa',
  blogHistoriaSalsa: 'blogHistoriaSalsa',
  blogClasesSalsaBarcelona: 'blogClasesSalsaBarcelona',
  blogSalsaVsBachata: 'blogSalsaVsBachata',
  blogBaileSaludMental: 'blogBaileSaludMental',
  blogHistoriaBachata: 'blogHistoriaBachata',
  blogSalsaRitmo: 'blogSalsaRitmo',
  blogAcademiaDanza: 'blogAcademiaDanza',
  blogBalletAdultos: 'blogBalletAdultos',
  blogClasesPrincipiantes: 'blogClasesPrincipiantes',
  blogPerderMiedoBailar: 'blogPerderMiedoBailar',
  blogDanzasUrbanas: 'blogDanzasUrbanas',
  blogModernJazz: 'blogModernJazz',
  blogBachata: 'blogBachata',
  blogDanzaContemporaneaVsJazzBallet: 'blog_danzaContemporaneaVsJazzBallet',
};

// Map from pageKey to FAQ translation prefix + namespace
// These are pages NOT in STYLE_KEY_MAP that have their own FAQ sections
// Used by generateFlexibleFAQSchema to generate FAQPage JSON-LD at build time
const FAQ_PAGE_MAP = {
  // Pattern A (pages.json) — ${prefix}FaqQ${i} / ${prefix}FaqA${i}
  home:                    { prefix: 'home', ns: 'pages' },
  entrenamientoBailarines: { prefix: 'prepFisica', ns: 'pages' },
  heelsBarcelona:          { prefix: 'heels', ns: 'pages' },
  danzaBarcelona:          { prefix: 'danza', ns: 'pages' },
  danzasUrbanas:           { prefix: 'urban', ns: 'pages' },
  salsaBachata:            { prefix: 'salsaBachata', ns: 'pages' },
  facilities:              { prefix: 'facilities', ns: 'pages' },
  // Pattern A (home.json)
  classes:                 { prefix: 'classes', ns: 'home' },
  // Pattern B (pages.json) — ${prefix}Q${i} / ${prefix}A${i}
  clasesParticulares:      { prefix: 'particularesPage_faq', ns: 'pages' },
  ubicacion:               { prefix: 'ubicacion_faq', ns: 'pages' },
  // Pattern C (pages.json) — ${prefix}_faq${i}_q / ${prefix}_faq${i}_a
  regalaBaile:             { prefix: 'regalaBaile', ns: 'pages' },
  estudioGrabacion:        { prefix: 'estudioGrabacion', ns: 'pages' },
  serviciosBaile:          { prefix: 'serviciosBaile', ns: 'pages' },
  alquilerSalas:           { prefix: 'roomRental', ns: 'pages' },
  preciosClases:           { prefix: 'pricing', ns: 'pages' },
  horariosPrecio:          { prefix: 'pricing', ns: 'pages' },
  // Pattern C (schedule.json)
  horariosClases:          { prefix: 'horariosV2', ns: 'schedule' },
  // Pattern D (pages.json) — ${prefix}_faq${i}_question / ${prefix}_faq${i}_answer
  teamBuilding:            { prefix: 'teamBuilding', ns: 'pages' },
  // Note: 'faq' page NOT here — FAQPage.tsx already generates its own FAQPage schema via React Helmet
};

/**
 * Converts basic Markdown formatting to HTML.
 * Handles: **bold**, *italic*, [links](url), paragraph breaks.
 */
const mdToHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, ' ');
};

/**
 * Generates rich HTML content for blog article pages using blog.json translations.
 * Extracts: title, summary bullets, intro, content sections (benefit/section patterns),
 * FAQ, and conclusion. Much richer than the fallback H1+description.
 *
 * @param {string} pageKey - Route page key (e.g., 'blogBeneficiosSalsa')
 * @param {string} lang - Language code (es, ca, en, fr)
 * @returns {string} Rich semantic HTML or '' if not a blog article
 */
const generateRichBlogContent = (pageKey, lang) => {
  const articleKey = BLOG_ARTICLE_KEY_MAP[pageKey];
  if (!articleKey) return '';

  const t = blogTranslations[lang];
  if (!t) return '';

  const get = (key) => t[key] || '';
  const sections = [];

  // 1. Title + summary bullets
  const title = get(`${articleKey}_title`);
  if (!title) return '';

  let headerHtml = `<h1>${title}</h1>`;
  const summaryBullets = [];
  for (let i = 1; i <= 5; i++) {
    const bullet = get(`${articleKey}_summaryBullet${i}`);
    if (bullet) summaryBullets.push(bullet);
  }
  if (summaryBullets.length > 0) {
    headerHtml += `<ul id="article-summary">${summaryBullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
  }
  sections.push(`<header>${headerHtml}</header>`);

  // 2. Intro paragraph(s)
  const intro = get(`${articleKey}_intro`);
  if (intro) {
    let introHtml = `<p>${mdToHtml(intro)}</p>`;
    const intro2 = get(`${articleKey}_intro2`);
    if (intro2) introHtml += `<p>${mdToHtml(intro2)}</p>`;
    const introFarrays = get(`${articleKey}_introFarrays`);
    if (introFarrays) introHtml += `<p>${mdToHtml(introFarrays)}</p>`;
    sections.push(`<section id="intro">${introHtml}</section>`);
  }

  // 3. Content sections — try benefit{N} pattern, then section{N} pattern
  const contentParts = [];

  // benefit{N}Title / benefit{N}Content (e.g., blogBeneficiosSalsa)
  for (let i = 1; i <= 15; i++) {
    const bTitle = get(`${articleKey}_benefit${i}Title`);
    if (bTitle) {
      let html = `<h2>${bTitle}</h2>`;
      const bContent = get(`${articleKey}_benefit${i}Content`);
      if (bContent) html += `<p>${mdToHtml(bContent)}</p>`;
      contentParts.push(html);
    }
  }

  // section{N}Title / section{N}Content (e.g., blogDanzasUrbanas, blogModernJazz)
  if (contentParts.length === 0) {
    for (let i = 1; i <= 10; i++) {
      const sTitle = get(`${articleKey}_section${i}Title`);
      if (sTitle) {
        let html = `<h2>${sTitle}</h2>`;
        const sIntro = get(`${articleKey}_section${i}Intro`);
        if (sIntro) html += `<p>${mdToHtml(sIntro)}</p>`;
        const sContent = get(`${articleKey}_section${i}Content`);
        if (sContent) {
          html += `<p>${mdToHtml(sContent)}</p>`;
        } else {
          for (let j = 1; j <= 4; j++) {
            const sub = get(`${articleKey}_section${i}Content${j}`);
            if (sub) html += `<p>${mdToHtml(sub)}</p>`;
          }
        }
        contentParts.push(html);
      }
    }
  }

  if (contentParts.length > 0) {
    sections.push(`<section id="content">${contentParts.join('')}</section>`);
  }

  // 4. FAQ section (all articles have this)
  let faqHtml = '';
  let faqCount = 0;
  for (let i = 1; i <= 10; i++) {
    const q = get(`${articleKey}_faq${i}Question`);
    const a = get(`${articleKey}_faq${i}Answer`);
    if (q && a) {
      faqHtml += `<details><summary>${mdToHtml(q)}</summary><p>${mdToHtml(a)}</p></details>`;
      faqCount++;
    }
  }
  if (faqCount > 0) {
    const faqTitle = get(`${articleKey}_faqTitle`) || 'FAQ';
    sections.push(`<section id="faq"><h2>${faqTitle}</h2>${faqHtml}</section>`);
  }

  // 5. Conclusion
  const conclusionTitle = get(`${articleKey}_conclusionTitle`) || get(`${articleKey}_conclusionHeading`);
  if (conclusionTitle) {
    let concHtml = `<h2>${conclusionTitle}</h2>`;
    const conclusionContent = get(`${articleKey}_conclusionContent`);
    if (conclusionContent) concHtml += `<p>${mdToHtml(conclusionContent)}</p>`;
    const conclusionCTA = get(`${articleKey}_conclusionCTA`);
    if (conclusionCTA) concHtml += `<p>${mdToHtml(conclusionCTA)}</p>`;
    sections.push(`<section id="conclusion">${concHtml}</section>`);
  }

  if (sections.length <= 1) return ''; // Only header, no real content

  return `<article id="main-content">${sections.join('')}</article>`;
};

/**
 * Generates rich HTML content for class pages using pages.json translations.
 * This content is seen by crawlers (Google first-wave, AI bots like GPTBot, ClaudeBot).
 * React silently replaces it during hydration fallback - no risk of mismatch.
 *
 * @param {string} pageKey - Route page key (e.g., 'dancehall')
 * @param {string} lang - Language code (es, ca, en, fr)
 * @returns {string} Rich semantic HTML or '' if no translations found
 */
const generateRichClassContent = (pageKey, lang) => {
  const styleKey = STYLE_KEY_MAP[pageKey];
  if (!styleKey) return '';

  const t = pagesTranslations[lang];
  if (!t) return '';

  const get = (key) => t[key] || '';

  const sections = [];

  // Hero section - H1 title + subtitle + description
  const heroTitle = get(`${styleKey}HeroTitle`);
  if (!heroTitle) return ''; // No title means no translations for this style

  const heroSubtitle = get(`${styleKey}HeroSubtitle`);
  const heroDesc = get(`${styleKey}HeroDesc`);

  let heroHtml = `<h1>${heroTitle}</h1>`;
  if (heroSubtitle) heroHtml += `<p><strong>${heroSubtitle}</strong></p>`;
  if (heroDesc) heroHtml += `<p>${heroDesc}</p>`;
  sections.push(`<header id="hero">${heroHtml}</header>`);

  // "What is" section - educational content (critical for E-E-A-T)
  const whatIsTitle = get(`${styleKey}WhatIsTitle`);
  if (whatIsTitle) {
    let whatIsHtml = `<h2>${whatIsTitle}</h2>`;
    // Most styles use P1-P4 paragraphs
    let hasP = false;
    for (let i = 1; i <= 4; i++) {
      const p = get(`${styleKey}WhatIsP${i}`);
      if (p) { whatIsHtml += `<p>${p}</p>`; hasP = true; }
    }
    // Some styles use WhatIsDesc instead of P1-P4
    if (!hasP) {
      const desc = get(`${styleKey}WhatIsDesc`);
      if (desc) whatIsHtml += `<p>${desc}</p>`;
    }
    sections.push(`<section id="what-is">${whatIsHtml}</section>`);
  }

  // Teachers section
  const teachersTitle = get(`${styleKey}TeachersTitle`);
  if (teachersTitle) {
    let teachersHtml = `<h2>${teachersTitle}</h2>`;
    const teachersSubtitle = get(`${styleKey}TeachersSubtitle`);
    if (teachersSubtitle) teachersHtml += `<p>${teachersSubtitle}</p>`;
    const teachersClosing = get(`${styleKey}TeachersClosing`);
    if (teachersClosing) teachersHtml += `<p>${teachersClosing}</p>`;
    sections.push(`<section id="teachers">${teachersHtml}</section>`);
  }

  // FAQ section - up to 15 Q&A pairs (structured for featured snippets)
  const faqTitle = get(`${styleKey}FaqTitle`);
  if (faqTitle) {
    let faqHtml = `<h2>${faqTitle}</h2>`;
    let faqCount = 0;
    for (let i = 1; i <= 15; i++) {
      const q = get(`${styleKey}FaqQ${i}`);
      const a = get(`${styleKey}FaqA${i}`);
      if (q && a) {
        faqHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
        faqCount++;
      }
    }
    if (faqCount > 0) {
      sections.push(`<section id="faq">${faqHtml}</section>`);
    }
  }

  if (sections.length === 0) return '';

  return `<main id="main-content">${sections.join('')}</main>`;
};

/**
 * Generates rich HTML for category hub pages (salsaBachata, danzasUrbanas, danzaBarcelona).
 * Uses "Why" pillars and FAQ from pages.json translations.
 */
const CATEGORY_HUB_MAP = {
  salsaBachata: {
    prefix: 'salsaBachata',
    whyItems: ['CubanSchool', 'Partner', 'FarrayMethod'],
  },
  danzasUrbanas: {
    prefix: 'urban',
    whyItems: ['International', 'AuthenticStyle', 'Career', 'Diversity', 'Prestige', 'Facilities'],
  },
  danza: {
    prefix: 'danza',
    whyItems: ['CubanSchool', 'Career'],
  },
};

const generateRichCategoryHubContent = (pageKey, lang, allMetadata) => {
  const config = CATEGORY_HUB_MAP[pageKey];
  if (!config) return '';

  const t = pagesTranslations[lang];
  if (!t) return '';

  const get = (key) => t[key] || '';
  const meta = allMetadata[lang]?.[pageKey];
  if (!meta) return '';

  const sections = [];

  // Hero from metadata
  const cleanTitle = meta.title.split('|')[0].trim();
  sections.push(`<header id="hero"><h1>${cleanTitle}</h1><p>${meta.description}</p></header>`);

  // Why section with pillars
  const whyItems = config.whyItems
    .map((item) => {
      const title = get(`${config.prefix}Why${item}Title`);
      const content = get(`${config.prefix}Why${item}Content`);
      return title && content ? `<li><strong>${title}</strong>: ${content}</li>` : '';
    })
    .filter(Boolean);

  if (whyItems.length > 0) {
    const whyTitle = get(`${config.prefix}WhyTitle`) || get(`${config.prefix}_whyTitle`);
    sections.push(`<section id="why">${whyTitle ? `<h2>${whyTitle}</h2>` : ''}<ul>${whyItems.join('')}</ul></section>`);
  }

  // FAQ section
  let faqHtml = '';
  let faqCount = 0;
  for (let i = 1; i <= 10; i++) {
    const q = get(`${config.prefix}FaqQ${i}`);
    const a = get(`${config.prefix}FaqA${i}`);
    if (q && a) {
      faqHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
      faqCount++;
    }
  }
  if (faqCount > 0) {
    const faqTitle = get(`${config.prefix}FaqTitle`) || 'FAQ';
    sections.push(`<section id="faq"><h2>${faqTitle}</h2>${faqHtml}</section>`);
  }

  if (sections.length <= 1) return ''; // Only hero, no real content

  return `<main id="main-content">${sections.join('')}</main>`;
};

/**
 * Generates rich HTML for the classes hub page using home.json translations.
 * Shows class categories and FAQs.
 */
const generateRichClassesHubContent = (pageKey, lang, allMetadata) => {
  if (pageKey !== 'classesHub' && pageKey !== 'classes') return '';

  const t = homeTranslations[lang];
  if (!t) return '';

  const get = (key) => t[key] || '';
  const meta = allMetadata[lang]?.[pageKey];
  if (!meta) return '';

  const sections = [];

  // Hero
  const cleanTitle = meta.title.split('|')[0].trim();
  const intro = get('classesIntro');
  sections.push(`<header id="hero"><h1>${cleanTitle}</h1>${intro ? `<p>${intro}</p>` : `<p>${meta.description}</p>`}</header>`);

  // Class categories
  const categories = ['Latin', 'Urban', 'Contemporary', 'Fitness', 'Morning', 'World'];
  const catItems = categories
    .map((cat) => {
      const title = get(`classCat${cat}Title`);
      const desc = get(`classCat${cat}Desc`);
      return title && desc ? `<li><strong>${title}</strong>: ${desc}</li>` : '';
    })
    .filter(Boolean);

  if (catItems.length > 0) {
    const classesTitle = get('classesTitle');
    sections.push(`<section id="categories">${classesTitle ? `<h2>${classesTitle}</h2>` : ''}<ul>${catItems.join('')}</ul></section>`);
  }

  // FAQ section
  let faqHtml = '';
  let faqCount = 0;
  for (let i = 1; i <= 9; i++) {
    const q = get(`classesFaqQ${i}`);
    const a = get(`classesFaqA${i}`);
    if (q && a) {
      faqHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
      faqCount++;
    }
  }
  if (faqCount > 0) {
    sections.push(`<section id="faq"><h2>FAQ</h2>${faqHtml}</section>`);
  }

  if (sections.length <= 1) return '';

  return `<main id="main-content">${sections.join('')}</main>`;
};

/**
 * Generates rich HTML for the facilities page using pages.json translations.
 */
const generateRichFacilitiesContent = (pageKey, lang, allMetadata) => {
  if (pageKey !== 'facilities') return '';

  const t = pagesTranslations[lang];
  if (!t) return '';

  const get = (key) => t[key] || '';
  const meta = allMetadata[lang]?.[pageKey];
  if (!meta) return '';

  const sections = [];

  // Hero
  const heroTitle = get('facilitiesHeroTitle') || get('facilitiesH1');
  if (!heroTitle) return '';
  const heroSubtitle = get('facilitiesHeroSubtitle');
  const heroDesc = get('facilitiesHeroDesc');
  let heroHtml = `<h1>${heroTitle}</h1>`;
  if (heroSubtitle) heroHtml += `<p><strong>${heroSubtitle}</strong></p>`;
  if (heroDesc) heroHtml += `<p>${heroDesc}</p>`;
  sections.push(`<header id="hero">${heroHtml}</header>`);

  // Rooms section
  const roomsTitle = get('facilitiesRoomsTitle');
  if (roomsTitle) {
    let roomsHtml = `<h2>${roomsTitle}</h2>`;
    const roomsSubtitle = get('facilitiesRoomsSubtitle');
    if (roomsSubtitle) roomsHtml += `<p>${roomsSubtitle}</p>`;
    for (let i = 1; i <= 4; i++) {
      const roomTitle = get(`facilitiesRoom${i}Title`);
      const roomSize = get(`facilitiesRoom${i}Size`);
      const roomDesc = get(`facilitiesRoom${i}Desc`);
      if (roomTitle) {
        roomsHtml += `<h3>${roomTitle}${roomSize ? ` (${roomSize})` : ''}</h3>`;
        if (roomDesc) roomsHtml += `<p>${roomDesc}</p>`;
      }
    }
    sections.push(`<section id="rooms">${roomsHtml}</section>`);
  }

  // Why section
  const whyTitle = get('facilitiesWhyTitle');
  if (whyTitle) {
    let whyHtml = `<h2>${whyTitle}</h2><ul>`;
    for (let i = 1; i <= 6; i++) {
      const title = get(`facilitiesWhy${i}Title`);
      const desc = get(`facilitiesWhy${i}Desc`);
      if (title && desc) whyHtml += `<li><strong>${title}</strong>: ${desc}</li>`;
    }
    whyHtml += '</ul>';
    sections.push(`<section id="why">${whyHtml}</section>`);
  }

  // FAQ section
  let faqHtml = '';
  let faqCount = 0;
  for (let i = 1; i <= 7; i++) {
    const q = get(`facilitiesFaqQ${i}`);
    const a = get(`facilitiesFaqA${i}`);
    if (q && a) {
      faqHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
      faqCount++;
    }
  }
  if (faqCount > 0) {
    const faqTitle = get('facilitiesFaqTitle') || 'FAQ';
    sections.push(`<section id="faq"><h2>${faqTitle}</h2>${faqHtml}</section>`);
  }

  if (sections.length <= 1) return '';

  return `<main id="main-content">${sections.join('')}</main>`;
};

/**
 * Generates rich HTML for the FAQ page using faq.json translations.
 * Structured with categorized Q&A sections.
 */
const generateRichFaqPageContent = (pageKey, lang) => {
  if (pageKey !== 'faq') return '';

  const t = faqTranslations[lang];
  if (!t) return '';

  const get = (key) => t[key] || '';

  const sections = [];

  // Hero
  const heroTitle = get('faq_hero_title');
  if (!heroTitle) return '';
  const heroSubtitle = get('faq_hero_subtitle');
  sections.push(`<header id="hero"><h1>${heroTitle}</h1>${heroSubtitle ? `<p>${heroSubtitle}</p>` : ''}</header>`);

  // FAQ categories
  const categories = [
    { key: 'reservas', max: 13 },
    { key: 'cuenta', max: 9 },
    { key: 'otras', max: 6 },
  ];

  for (const cat of categories) {
    const catTitle = get(`faq_category_${cat.key}_title`);
    let catHtml = '';
    let catCount = 0;
    for (let i = 1; i <= cat.max; i++) {
      const q = get(`faq_${cat.key}_${i}_q`);
      const a = get(`faq_${cat.key}_${i}_a`);
      if (q && a) {
        catHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
        catCount++;
      }
    }
    if (catCount > 0) {
      sections.push(`<section id="faq-${cat.key}">${catTitle ? `<h2>${catTitle}</h2>` : ''}${catHtml}</section>`);
    }
  }

  if (sections.length <= 1) return '';

  return `<main id="main-content">${sections.join('')}</main>`;
};

/**
 * Generates rich HTML for info/service pages using their respective translation files.
 * Handles: about, yunaisy, profesores, metodoFarray, teamBuilding, regalaBaile,
 * estudioGrabacion, alquilerSalas, clasesParticulares, contact
 */
const generateRichInfoPageContent = (pageKey, lang, allMetadata) => {
  const meta = allMetadata[lang]?.[pageKey];
  if (!meta) return '';

  const cleanTitle = meta.title.split('|')[0].trim();
  const pt = pagesTranslations[lang] || {};
  const at = aboutTranslations[lang] || {};
  const ct = contactTranslations[lang] || {};

  const getP = (key) => pt[key] || '';
  const getA = (key) => at[key] || '';
  const getC = (key) => ct[key] || '';

  const sections = [];

  // ── about ──
  if (pageKey === 'about') {
    const h1 = getA('about_h1') || cleanTitle;
    const intro = getA('about_intro');
    sections.push(`<header id="hero"><h1>${h1}</h1>${intro ? `<p>${intro}</p>` : `<p>${meta.description}</p>`}</header>`);

    // Story
    const storyTitle = getA('about_story_title');
    if (storyTitle) {
      let storyHtml = `<h2>${storyTitle}</h2>`;
      for (let i = 1; i <= 3; i++) {
        const p = getA(`about_story_p${i}`);
        if (p) storyHtml += `<p>${p}</p>`;
      }
      sections.push(`<section id="story">${storyHtml}</section>`);
    }

    // Values
    const valuesTitle = getA('about_values_title');
    if (valuesTitle) {
      const valuePillars = ['love', 'community', 'wellbeing', 'opportunities', 'social', 'excellence'];
      let valuesHtml = `<h2>${valuesTitle}</h2><ul>`;
      for (const v of valuePillars) {
        const title = getA(`about_value_${v}_title`);
        const content = getA(`about_value_${v}_content`);
        if (title && content) valuesHtml += `<li><strong>${title}</strong>: ${content}</li>`;
      }
      valuesHtml += '</ul>';
      sections.push(`<section id="values">${valuesHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  // ── yunaisy ──
  if (pageKey === 'yunaisy') {
    const h1 = getA('yunaisyFarray_hero_title') || cleanTitle;
    const subtitle = getA('yunaisyFarray_hero_subtitle');
    sections.push(`<header id="hero"><h1>${h1}</h1>${subtitle ? `<p>${subtitle}</p>` : `<p>${meta.description}</p>`}</header>`);

    // Intro
    const introTitle = getA('yunaisyFarray_intro_title');
    if (introTitle) {
      let introHtml = `<h2>${introTitle}</h2>`;
      for (let i = 1; i <= 2; i++) {
        const p = getA(`yunaisyFarray_intro_p${i}`);
        if (p) introHtml += `<p>${p}</p>`;
      }
      sections.push(`<section id="intro">${introHtml}</section>`);
    }

    // Roots
    const rootsTitle = getA('yunaisyFarray_roots_title');
    if (rootsTitle) {
      let rootsHtml = `<h2>${rootsTitle}</h2>`;
      for (let i = 1; i <= 2; i++) {
        const p = getA(`yunaisyFarray_roots_p${i}`);
        if (p) rootsHtml += `<p>${p}</p>`;
      }
      sections.push(`<section id="roots">${rootsHtml}</section>`);
    }

    // Career
    const careerTitle = getA('yunaisyFarray_career_title');
    if (careerTitle) {
      let careerHtml = `<h2>${careerTitle}</h2>`;
      for (let i = 1; i <= 6; i++) {
        const p = getA(`yunaisyFarray_career_p${i}`);
        if (p) careerHtml += `<p>${p}</p>`;
      }
      sections.push(`<section id="career">${careerHtml}</section>`);
    }

    // Method
    const methodTitle = getA('yunaisyFarray_method_title');
    if (methodTitle) {
      let methodHtml = `<h2>${methodTitle}</h2>`;
      for (let i = 1; i <= 4; i++) {
        const p = getA(`yunaisyFarray_method_p${i}`);
        if (p) methodHtml += `<p>${p}</p>`;
      }
      sections.push(`<section id="method">${methodHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  // ── profesores ──
  if (pageKey === 'profesores') {
    const h1 = getP('teachersPageH1') || cleanTitle;
    const subtitle = getP('teachersPageSubtitle');
    sections.push(`<header id="hero"><h1>${h1}</h1>${subtitle ? `<p>${subtitle}</p>` : `<p>${meta.description}</p>`}</header>`);

    // Director
    const directorTitle = getP('teachersPageDirectorTitle');
    if (directorTitle) {
      const directorSubtitle = getP('teachersPageDirectorSubtitle');
      const directorSpecialty = getP('teachersPageDirectorSpecialty');
      let dirHtml = `<h2>${directorTitle}</h2>`;
      if (directorSubtitle) dirHtml += `<p>${directorSubtitle}</p>`;
      if (directorSpecialty) dirHtml += `<p>${directorSpecialty}</p>`;
      sections.push(`<section id="director">${dirHtml}</section>`);
    }

    // Team
    const teamTitle = getP('teachersPageTeamTitle');
    if (teamTitle) {
      let teamHtml = `<h2>${teamTitle}</h2>`;
      const teamSubtitle = getP('teachersPageTeamSubtitle');
      if (teamSubtitle) teamHtml += `<p>${teamSubtitle}</p>`;
      // List teacher specialties (compact, good for SEO)
      let teacherList = '<ul>';
      for (let i = 1; i <= 14; i++) {
        const specialty = getP(`teachersPageTeacher${i}Specialty`);
        if (specialty) teacherList += `<li>${specialty}</li>`;
      }
      // Named teachers
      const namedTeachers = ['Juan', 'Crisag', 'Gretchen'];
      for (const name of namedTeachers) {
        const specialty = getP(`teachersPageTeacher${name}Specialty`);
        if (specialty) teacherList += `<li>${specialty}</li>`;
      }
      teacherList += '</ul>';
      teamHtml += teacherList;
      sections.push(`<section id="team">${teamHtml}</section>`);
    }

    // Commitment
    const commitTitle = getP('teachersPageCommitmentTitle');
    if (commitTitle) {
      let commitHtml = `<h2>${commitTitle}</h2>`;
      const commitDesc = getP('teachersPageCommitmentDescription');
      if (commitDesc) commitHtml += `<p>${commitDesc}</p>`;
      sections.push(`<section id="commitment">${commitHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  // ── metodoFarray ──
  if (pageKey === 'metodoFarray') {
    const h1 = getA('metodoFarray_hero_title') || cleanTitle;
    const subtitle = getA('metodoFarray_hero_subtitle');
    sections.push(`<header id="hero"><h1>${h1}</h1>${subtitle ? `<p>${subtitle}</p>` : `<p>${meta.description}</p>`}</header>`);

    // Problem
    const problemTitle = getA('metodoFarray_problem_title');
    if (problemTitle) {
      let problemHtml = `<h2>${problemTitle}</h2>`;
      for (let i = 1; i <= 2; i++) {
        const p = getA(`metodoFarray_problem_p${i}`);
        if (p) problemHtml += `<p>${p}</p>`;
      }
      sections.push(`<section id="problem">${problemHtml}</section>`);
    }

    // Solution
    const solutionTitle = getA('metodoFarray_solution_title');
    if (solutionTitle) {
      let solHtml = `<h2>${solutionTitle}</h2>`;
      for (let i = 1; i <= 2; i++) {
        const p = getA(`metodoFarray_solution_p${i}`);
        if (p) solHtml += `<p>${p}</p>`;
      }
      sections.push(`<section id="solution">${solHtml}</section>`);
    }

    // Pillars
    const pillarsTitle = getA('metodoFarray_pillars_title');
    if (pillarsTitle) {
      let pillarsHtml = `<h2>${pillarsTitle}</h2><ul>`;
      for (let i = 1; i <= 3; i++) {
        const title = getA(`metodoFarray_pillar${i}_title`);
        const desc = getA(`metodoFarray_pillar${i}_desc`);
        if (title && desc) pillarsHtml += `<li><strong>${title}</strong>: ${desc}</li>`;
      }
      pillarsHtml += '</ul>';
      sections.push(`<section id="pillars">${pillarsHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  // ── teamBuilding ──
  if (pageKey === 'teamBuilding') {
    const h1 = getP('teamBuilding_heroTitle') || cleanTitle;
    const heroSubtitle = getP('teamBuilding_heroSubtitle');
    const heroIntro = getP('teamBuilding_heroIntro');
    let heroHtml = `<h1>${h1}</h1>`;
    if (heroSubtitle) heroHtml += `<p><strong>${heroSubtitle}</strong></p>`;
    if (heroIntro) heroHtml += `<p>${heroIntro}</p>`;
    sections.push(`<header id="hero">${heroHtml}</header>`);

    // Features
    const featuresTitle = getP('teamBuilding_features_title');
    if (featuresTitle) {
      const featureKeys = ['workshops', 'choreography', 'competitions', 'videoclip', 'flashmob', 'custom'];
      let featHtml = `<h2>${featuresTitle}</h2><ul>`;
      for (const fk of featureKeys) {
        const title = getP(`teamBuilding_feature_${fk}_title`);
        const desc = getP(`teamBuilding_feature_${fk}_desc`);
        if (title && desc) featHtml += `<li><strong>${title}</strong>: ${desc}</li>`;
      }
      featHtml += '</ul>';
      sections.push(`<section id="features">${featHtml}</section>`);
    }

    // Benefits
    const benefitsTitle = getP('teamBuilding_benefits_title');
    if (benefitsTitle) {
      const benefitKeys = ['experience', 'professionals', 'flexibility', 'results', 'fun', 'location'];
      let benHtml = `<h2>${benefitsTitle}</h2><ul>`;
      for (const bk of benefitKeys) {
        const title = getP(`teamBuilding_benefit_${bk}_title`);
        const desc = getP(`teamBuilding_benefit_${bk}_desc`);
        if (title && desc) benHtml += `<li><strong>${title}</strong>: ${desc}</li>`;
      }
      benHtml += '</ul>';
      sections.push(`<section id="benefits">${benHtml}</section>`);
    }

    // FAQ
    let faqHtml = '';
    let faqCount = 0;
    for (let i = 1; i <= 7; i++) {
      const q = getP(`teamBuilding_faq${i}_question`);
      const a = getP(`teamBuilding_faq${i}_answer`);
      if (q && a) {
        faqHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
        faqCount++;
      }
    }
    if (faqCount > 0) {
      const faqTitle = getP('teamBuilding_faq_title') || 'FAQ';
      sections.push(`<section id="faq"><h2>${faqTitle}</h2>${faqHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  // ── regalaBaile ──
  if (pageKey === 'regalaBaile') {
    const h1 = getP('regalaBaile_hero_title') || cleanTitle;
    const heroSubtitle = getP('regalaBaile_hero_subtitle');
    const heroDesc = getP('regalaBaile_hero_description');
    let heroHtml = `<h1>${h1}</h1>`;
    if (heroSubtitle) heroHtml += `<p><strong>${heroSubtitle}</strong></p>`;
    if (heroDesc) heroHtml += `<p>${heroDesc}</p>`;
    sections.push(`<header id="hero">${heroHtml}</header>`);

    // Benefits
    const benefitsTitle = getP('regalaBaile_benefits_title');
    if (benefitsTitle) {
      let benHtml = `<h2>${benefitsTitle}</h2><ul>`;
      for (let i = 1; i <= 6; i++) {
        const title = getP(`regalaBaile_benefit${i}_title`);
        const desc = getP(`regalaBaile_benefit${i}_desc`);
        if (title && desc) benHtml += `<li><strong>${title}</strong>: ${desc}</li>`;
      }
      benHtml += '</ul>';
      sections.push(`<section id="benefits">${benHtml}</section>`);
    }

    // How it works (steps)
    const howTitle = getP('regalaBaile_how_title');
    if (howTitle) {
      let howHtml = `<h2>${howTitle}</h2><ol>`;
      for (let i = 1; i <= 4; i++) {
        const title = getP(`regalaBaile_step${i}_title`);
        const desc = getP(`regalaBaile_step${i}_desc`);
        if (title) howHtml += `<li><strong>${title}</strong>${desc ? `: ${desc}` : ''}</li>`;
      }
      howHtml += '</ol>';
      sections.push(`<section id="how-it-works">${howHtml}</section>`);
    }

    // FAQ
    let faqHtml = '';
    let faqCount = 0;
    for (let i = 1; i <= 7; i++) {
      const q = getP(`regalaBaile_faq${i}_q`);
      const a = getP(`regalaBaile_faq${i}_a`);
      if (q && a) {
        faqHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
        faqCount++;
      }
    }
    if (faqCount > 0) {
      const faqTitle = getP('regalaBaile_faq_title') || 'FAQ';
      sections.push(`<section id="faq"><h2>${faqTitle}</h2>${faqHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  // ── estudioGrabacion ──
  if (pageKey === 'estudioGrabacion') {
    const h1 = getP('estudioGrabacion_h1') || cleanTitle;
    const intro = getP('estudioGrabacion_intro');
    sections.push(`<header id="hero"><h1>${h1}</h1>${intro ? `<p>${intro}</p>` : `<p>${meta.description}</p>`}</header>`);

    // Services
    const solutionTitle = getP('estudioGrabacion_solution_title');
    if (solutionTitle) {
      let servHtml = `<h2>${solutionTitle}</h2><ul>`;
      for (let i = 1; i <= 6; i++) {
        const title = getP(`estudioGrabacion_service${i}_title`);
        const desc = getP(`estudioGrabacion_service${i}_desc`);
        if (title && desc) servHtml += `<li><strong>${title}</strong>: ${desc}</li>`;
      }
      servHtml += '</ul>';
      sections.push(`<section id="services">${servHtml}</section>`);
    }

    // Benefits
    const benefitsTitle = getP('estudioGrabacion_benefits_title');
    if (benefitsTitle) {
      let benHtml = `<h2>${benefitsTitle}</h2><ul>`;
      for (let i = 1; i <= 6; i++) {
        const title = getP(`estudioGrabacion_benefit${i}_title`);
        const desc = getP(`estudioGrabacion_benefit${i}_desc`);
        if (title && desc) benHtml += `<li><strong>${title}</strong>: ${desc}</li>`;
      }
      benHtml += '</ul>';
      sections.push(`<section id="benefits">${benHtml}</section>`);
    }

    // FAQ
    let faqHtml = '';
    let faqCount = 0;
    for (let i = 1; i <= 8; i++) {
      const q = getP(`estudioGrabacion_faq${i}_q`);
      const a = getP(`estudioGrabacion_faq${i}_a`);
      if (q && a) {
        faqHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
        faqCount++;
      }
    }
    if (faqCount > 0) {
      const faqTitle = getP('estudioGrabacion_faq_title') || 'FAQ';
      sections.push(`<section id="faq"><h2>${faqTitle}</h2>${faqHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  // ── alquilerSalas ──
  if (pageKey === 'alquilerSalas') {
    const h1 = getP('roomRental_hero_title') || cleanTitle;
    const heroSubtitle = getP('roomRental_hero_subtitle');
    sections.push(`<header id="hero"><h1>${h1}</h1>${heroSubtitle ? `<p>${heroSubtitle}</p>` : `<p>${meta.description}</p>`}</header>`);

    // Intro
    const introTitle = getP('roomRental_intro_title');
    if (introTitle) {
      let introHtml = `<h2>${introTitle}</h2>`;
      for (let i = 1; i <= 3; i++) {
        const p = getP(`roomRental_intro_p${i}`);
        if (p) introHtml += `<p>${p}</p>`;
      }
      sections.push(`<section id="intro">${introHtml}</section>`);
    }

    // Rooms
    const roomsTitle = getP('roomRental_rooms_title');
    if (roomsTitle) {
      let roomsHtml = `<h2>${roomsTitle}</h2>`;
      const roomLetters = ['A', 'B', 'C', 'D'];
      for (const letter of roomLetters) {
        const name = getP(`roomRental_room${letter}_name`);
        const size = getP(`roomRental_room${letter}_size`);
        const desc = getP(`roomRental_room${letter}_desc`);
        if (name) {
          roomsHtml += `<h3>${name}${size ? ` (${size})` : ''}</h3>`;
          if (desc) roomsHtml += `<p>${desc}</p>`;
        }
      }
      sections.push(`<section id="rooms">${roomsHtml}</section>`);
    }

    // Why Farray's
    const whyTitle = getP('roomRental_whyFarrays_title');
    if (whyTitle) {
      let whyHtml = `<h2>${whyTitle}</h2><ul>`;
      for (let i = 1; i <= 6; i++) {
        const title = getP(`roomRental_whyFarrays_item${i}_title`);
        const desc = getP(`roomRental_whyFarrays_item${i}_desc`);
        if (title && desc) whyHtml += `<li><strong>${title}</strong>: ${desc}</li>`;
      }
      whyHtml += '</ul>';
      sections.push(`<section id="why">${whyHtml}</section>`);
    }

    // FAQ
    let faqHtml = '';
    let faqCount = 0;
    for (let i = 1; i <= 5; i++) {
      const q = getP(`roomRental_faq${i}_q`);
      const a = getP(`roomRental_faq${i}_a`);
      if (q && a) {
        faqHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
        faqCount++;
      }
    }
    if (faqCount > 0) {
      const faqTitle = getP('roomRental_faq_section_title') || 'FAQ';
      sections.push(`<section id="faq"><h2>${faqTitle}</h2>${faqHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  // ── clasesParticulares ──
  if (pageKey === 'clasesParticulares') {
    const h1 = getP('particularesPage_h1') || cleanTitle;
    const subtitle = getP('particularesPage_subtitle');
    const intro = getP('particularesPage_intro');
    let heroHtml = `<h1>${h1}</h1>`;
    if (subtitle) heroHtml += `<p><strong>${subtitle}</strong></p>`;
    if (intro) heroHtml += `<p>${intro}</p>`;
    sections.push(`<header id="hero">${heroHtml}</header>`);

    // Benefits
    const benefitsTitle = getP('particularesPage_benefits_title') || getP('particularesPage_benefitsTitle');
    if (benefitsTitle) {
      let benHtml = `<h2>${benefitsTitle}</h2><ul>`;
      for (let i = 1; i <= 4; i++) {
        const title = getP(`particularesPage_benefit${i}_title`);
        const desc = getP(`particularesPage_benefit${i}_desc`);
        if (title && desc) benHtml += `<li><strong>${title}</strong>: ${desc}</li>`;
      }
      benHtml += '</ul>';
      sections.push(`<section id="benefits">${benHtml}</section>`);
    }

    // What to expect
    const whatTitle = getP('particularesPage_whatToExpect_title');
    if (whatTitle) {
      let whatHtml = `<h2>${whatTitle}</h2>`;
      for (let i = 1; i <= 3; i++) {
        const p = getP(`particularesPage_whatToExpect_p${i}`);
        if (p) whatHtml += `<p>${p}</p>`;
      }
      sections.push(`<section id="what-to-expect">${whatHtml}</section>`);
    }

    // FAQ
    let faqHtml = '';
    let faqCount = 0;
    for (let i = 1; i <= 7; i++) {
      const q = getP(`particularesPage_faqQ${i}`);
      const a = getP(`particularesPage_faqA${i}`);
      if (q && a) {
        faqHtml += `<details><summary>${q}</summary><p>${a}</p></details>`;
        faqCount++;
      }
    }
    if (faqCount > 0) {
      const faqTitle = getP('particularesPage_faq_title') || getP('particularesPage_faqTitle') || 'FAQ';
      sections.push(`<section id="faq"><h2>${faqTitle}</h2>${faqHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  // ── contact ──
  if (pageKey === 'contact') {
    const h1 = getC('contact_hero_title') || cleanTitle;
    const heroSubtitle = getC('contact_hero_subtitle');
    sections.push(`<header id="hero"><h1>${h1}</h1>${heroSubtitle ? `<p>${heroSubtitle}</p>` : `<p>${meta.description}</p>`}</header>`);

    // Contact info
    const infoTitle = getC('contact_info_title');
    if (infoTitle) {
      let infoHtml = `<h2>${infoTitle}</h2><ul>`;
      const addressTitle = getC('contact_address_title');
      if (addressTitle) infoHtml += `<li><strong>${addressTitle}</strong></li>`;
      const phoneTitle = getC('contact_phone_title');
      if (phoneTitle) infoHtml += `<li><strong>${phoneTitle}</strong></li>`;
      const emailTitle = getC('contact_email_title');
      if (emailTitle) infoHtml += `<li><strong>${emailTitle}</strong></li>`;
      infoHtml += '</ul>';
      sections.push(`<section id="contact-info">${infoHtml}</section>`);
    }

    // Schedule
    const schedTitle = getC('contact_schedule_title');
    if (schedTitle) {
      let schedHtml = `<h2>${schedTitle}</h2><ul>`;
      const weekdays = getC('contact_schedule_weekdays');
      if (weekdays) schedHtml += `<li>${weekdays}</li>`;
      const saturday = getC('contact_schedule_saturday');
      if (saturday) schedHtml += `<li>${saturday}</li>`;
      schedHtml += '</ul>';
      sections.push(`<section id="schedule">${schedHtml}</section>`);
    }

    if (sections.length <= 1) return '';
    return `<main id="main-content">${sections.join('')}</main>`;
  }

  return ''; // Not an info page
};

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

  // Try rich content first (class pages with pages.json translations)
  const richContent = generateRichClassContent(pageKey, lang);
  if (richContent) return richContent;

  // Try rich blog content (blog articles with blog.json translations)
  const blogContent = generateRichBlogContent(pageKey, lang);
  if (blogContent) return blogContent;

  // Category hub pages (salsaBachata, danzasUrbanas, danzaBarcelona)
  const categoryContent = generateRichCategoryHubContent(pageKey, lang, allMetadata);
  if (categoryContent) return categoryContent;

  // Classes hub page
  const classesHubContent = generateRichClassesHubContent(pageKey, lang, allMetadata);
  if (classesHubContent) return classesHubContent;

  // Facilities page
  const facilitiesContent = generateRichFacilitiesContent(pageKey, lang, allMetadata);
  if (facilitiesContent) return facilitiesContent;

  // FAQ page
  const faqContent = generateRichFaqPageContent(pageKey, lang);
  if (faqContent) return faqContent;

  // Info/service pages (about, yunaisy, profesores, metodoFarray, teamBuilding, etc.)
  const infoContent = generateRichInfoPageContent(pageKey, lang, allMetadata);
  if (infoContent) return infoContent;

  // Fallback: simple H1 + description for non-class pages
  const meta = allMetadata[lang]?.[pageKey];
  if (!meta || !meta.title || !meta.description) {
    return '';
  }

  // Extraer título limpio (quitar "| Farray's Center" y similares)
  const cleanTitle = meta.title.split('|')[0].trim();

  // Generar HTML simple y semántico
  return `<main id="main-content"><h1>${cleanTitle}</h1><p>${meta.description}</p></main>`;
};

// 

// All language/page combinations to prerender
const routes = [
  { path: '', lang: 'es', page: 'home' },
  { path: 'es', lang: 'es', page: 'home' },
  // YR Project (Linktree-style, no locale)
  { path: 'yr-project', lang: 'es', page: 'yrProject' },
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
  { path: 'es/contacto', lang: 'es', page: 'contact' },
  { path: 'es/reservas', lang: 'es', page: 'reservas' },

  { path: 'es/hazte-socio', lang: 'es', page: 'hazteSocio' },

  // Y&R Project - Linktree-style artist page (no locale prefix for short URL)
  { path: 'yr-project', lang: 'es', page: 'yrProject' },

  { path: 'es/mi-reserva', lang: 'es', page: 'miReserva' },
  { path: 'es/fichaje', lang: 'es', page: 'fichaje' },
  { path: 'es/fichaje/resumen', lang: 'es', page: 'fichajeResumen' },
  { path: 'es/admin/fichajes', lang: 'es', page: 'adminFichajes' },
  { path: 'es/admin/reservas', lang: 'es', page: 'adminReservas' },
  { path: 'es/feedback-gracias', lang: 'es', page: 'feedbackGracias' },
  { path: 'es/feedback-comentario', lang: 'es', page: 'feedbackComentario' },
  { path: 'es/asistencia-confirmada', lang: 'es', page: 'asistenciaConfirmada' },

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
  { path: 'es/servicios-baile-barcelona', lang: 'es', page: 'serviciosBaile' },
  { path: 'es/como-llegar-escuela-baile-barcelona', lang: 'es', page: 'ubicacion' },
  { path: 'es/calendario', lang: 'es', page: 'calendario' },
  // URL aliases (same content, different URL for SEO)
  { path: 'es/instalaciones-escuela-baile-barcelona', lang: 'es', page: 'facilities' },
  { path: 'es/horarios-clases-baile-barcelona', lang: 'es', page: 'horariosClases' },
  { path: 'es/precios-clases-baile-barcelona', lang: 'es', page: 'preciosClases' },
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
  { path: 'ca/contacto', lang: 'ca', page: 'contact' },
  { path: 'ca/reservas', lang: 'ca', page: 'reservas' },

  { path: 'ca/hazte-socio', lang: 'ca', page: 'hazteSocio' },

  { path: 'ca/mi-reserva', lang: 'ca', page: 'miReserva' },
  { path: 'ca/fichaje', lang: 'ca', page: 'fichaje' },
  { path: 'ca/fichaje/resumen', lang: 'ca', page: 'fichajeResumen' },
  { path: 'ca/admin/fichajes', lang: 'ca', page: 'adminFichajes' },
  { path: 'ca/admin/reservas', lang: 'ca', page: 'adminReservas' },
  { path: 'ca/feedback-gracias', lang: 'ca', page: 'feedbackGracias' },
  { path: 'ca/feedback-comentario', lang: 'ca', page: 'feedbackComentario' },
  { path: 'ca/asistencia-confirmada', lang: 'ca', page: 'asistenciaConfirmada' },

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
  { path: 'ca/servicios-baile-barcelona', lang: 'ca', page: 'serviciosBaile' },
  { path: 'ca/como-llegar-escuela-baile-barcelona', lang: 'ca', page: 'ubicacion' },
  { path: 'ca/calendario', lang: 'ca', page: 'calendario' },
  // URL aliases (same content, different URL for SEO)
  { path: 'ca/instalaciones-escuela-baile-barcelona', lang: 'ca', page: 'facilities' },
  { path: 'ca/horarios-clases-baile-barcelona', lang: 'ca', page: 'horariosClases' },
  { path: 'ca/precios-clases-baile-barcelona', lang: 'ca', page: 'preciosClases' },
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
  { path: 'en/contacto', lang: 'en', page: 'contact' },
  { path: 'en/reservas', lang: 'en', page: 'reservas' },

  { path: 'en/hazte-socio', lang: 'en', page: 'hazteSocio' },

  { path: 'en/mi-reserva', lang: 'en', page: 'miReserva' },
  { path: 'en/fichaje', lang: 'en', page: 'fichaje' },
  { path: 'en/fichaje/resumen', lang: 'en', page: 'fichajeResumen' },
  { path: 'en/admin/fichajes', lang: 'en', page: 'adminFichajes' },
  { path: 'en/admin/reservas', lang: 'en', page: 'adminReservas' },
  { path: 'en/feedback-gracias', lang: 'en', page: 'feedbackGracias' },
  { path: 'en/feedback-comentario', lang: 'en', page: 'feedbackComentario' },
  { path: 'en/asistencia-confirmada', lang: 'en', page: 'asistenciaConfirmada' },

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
  { path: 'en/servicios-baile-barcelona', lang: 'en', page: 'serviciosBaile' },
  { path: 'en/como-llegar-escuela-baile-barcelona', lang: 'en', page: 'ubicacion' },
  { path: 'en/calendario', lang: 'en', page: 'calendario' },
  // URL aliases (same content, different URL for SEO)
  { path: 'en/instalaciones-escuela-baile-barcelona', lang: 'en', page: 'facilities' },
  { path: 'en/horarios-clases-baile-barcelona', lang: 'en', page: 'horariosClases' },
  { path: 'en/precios-clases-baile-barcelona', lang: 'en', page: 'preciosClases' },
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
  { path: 'fr/contacto', lang: 'fr', page: 'contact' },
  { path: 'fr/reservas', lang: 'fr', page: 'reservas' },

  { path: 'fr/hazte-socio', lang: 'fr', page: 'hazteSocio' },

  { path: 'fr/mi-reserva', lang: 'fr', page: 'miReserva' },
  { path: 'fr/fichaje', lang: 'fr', page: 'fichaje' },
  { path: 'fr/fichaje/resumen', lang: 'fr', page: 'fichajeResumen' },
  { path: 'fr/admin/fichajes', lang: 'fr', page: 'adminFichajes' },
  { path: 'fr/admin/reservas', lang: 'fr', page: 'adminReservas' },
  { path: 'fr/feedback-gracias', lang: 'fr', page: 'feedbackGracias' },
  { path: 'fr/feedback-comentario', lang: 'fr', page: 'feedbackComentario' },
  { path: 'fr/asistencia-confirmada', lang: 'fr', page: 'asistenciaConfirmada' },

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
  { path: 'fr/servicios-baile-barcelona', lang: 'fr', page: 'serviciosBaile' },
  { path: 'fr/como-llegar-escuela-baile-barcelona', lang: 'fr', page: 'ubicacion' },
  { path: 'fr/calendario', lang: 'fr', page: 'calendario' },
  // URL aliases (same content, different URL for SEO)
  { path: 'fr/instalaciones-escuela-baile-barcelona', lang: 'fr', page: 'facilities' },
  { path: 'fr/horarios-clases-baile-barcelona', lang: 'fr', page: 'horariosClases' },
  { path: 'fr/precios-clases-baile-barcelona', lang: 'fr', page: 'preciosClases' },
  // 404 page
  { path: 'fr/404', lang: 'fr', page: 'notFound' },

  // Blog routes
  { path: 'es/blog', lang: 'es', page: 'blog' },
  { path: 'es/blog/lifestyle', lang: 'es', page: 'blogLifestyle' },
  { path: 'es/blog/lifestyle/beneficios-bailar-salsa', lang: 'es', page: 'blogBeneficiosSalsa' },
  { path: 'es/blog/lifestyle/clases-de-salsa-barcelona', lang: 'es', page: 'blogClasesSalsaBarcelona' },
  { path: 'es/blog/lifestyle/como-perder-miedo-bailar', lang: 'es', page: 'blogPerderMiedoBailar' },
  { path: 'es/blog/historia', lang: 'es', page: 'blogHistoria' },
  { path: 'es/blog/historia/historia-salsa-barcelona', lang: 'es', page: 'blogHistoriaSalsa' },
  { path: 'es/blog/historia/historia-bachata-barcelona', lang: 'es', page: 'blogHistoriaBachata' },
  { path: 'es/blog/tutoriales', lang: 'es', page: 'blogTutoriales' },
  { path: 'es/blog/historia/salsa-ritmo-conquisto-mundo', lang: 'es', page: 'blogSalsaRitmo' },
  { path: 'es/blog/tips/salsa-vs-bachata-que-estilo-elegir', lang: 'es', page: 'blogSalsaVsBachata' },
  { path: 'es/blog/tips', lang: 'es', page: 'blogTips' },
  { path: 'es/blog/tips/clases-baile-principiantes-barcelona-farrays', lang: 'es', page: 'blogClasesPrincipiantes' },
  { path: 'es/blog/tips/academia-de-danza-barcelona-guia-completa', lang: 'es', page: 'blogAcademiaDanza' },
  { path: 'es/blog/tips/ballet-para-adultos-barcelona', lang: 'es', page: 'blogBalletAdultos' },
  { path: 'es/blog/tips/danza-contemporanea-vs-modern-jazz-vs-ballet', lang: 'es', page: 'blogDanzaContemporaneaVsJazzBallet' },
  { path: 'es/blog/tips/danzas-urbanas-barcelona-guia-completa', lang: 'es', page: 'blogDanzasUrbanas' },
  { path: 'es/blog/tips/modern-jazz-barcelona-guia-completa', lang: 'es', page: 'blogModernJazz' },
  { path: 'es/blog/tips/clases-bachata-barcelona-guia-completa', lang: 'es', page: 'blogBachata' },
  { path: 'es/blog/fitness', lang: 'es', page: 'blogFitness' },
  { path: 'es/blog/fitness/baile-salud-mental', lang: 'es', page: 'blogBaileSaludMental' },

  { path: 'ca/blog', lang: 'ca', page: 'blog' },
  { path: 'ca/blog/lifestyle', lang: 'ca', page: 'blogLifestyle' },
  { path: 'ca/blog/lifestyle/beneficios-bailar-salsa', lang: 'ca', page: 'blogBeneficiosSalsa' },
  { path: 'ca/blog/lifestyle/clases-de-salsa-barcelona', lang: 'ca', page: 'blogClasesSalsaBarcelona' },
  { path: 'ca/blog/lifestyle/como-perder-miedo-bailar', lang: 'ca', page: 'blogPerderMiedoBailar' },
  { path: 'ca/blog/historia', lang: 'ca', page: 'blogHistoria' },
  { path: 'ca/blog/historia/historia-salsa-barcelona', lang: 'ca', page: 'blogHistoriaSalsa' },
  { path: 'ca/blog/historia/historia-bachata-barcelona', lang: 'ca', page: 'blogHistoriaBachata' },
  { path: 'ca/blog/tutoriales', lang: 'ca', page: 'blogTutoriales' },
  { path: 'ca/blog/historia/salsa-ritmo-conquisto-mundo', lang: 'ca', page: 'blogSalsaRitmo' },
  { path: 'ca/blog/tips/salsa-vs-bachata-que-estilo-elegir', lang: 'ca', page: 'blogSalsaVsBachata' },
  { path: 'ca/blog/tips', lang: 'ca', page: 'blogTips' },
  { path: 'ca/blog/tips/clases-baile-principiantes-barcelona-farrays', lang: 'ca', page: 'blogClasesPrincipiantes' },
  { path: 'ca/blog/tips/academia-de-danza-barcelona-guia-completa', lang: 'ca', page: 'blogAcademiaDanza' },
  { path: 'ca/blog/tips/ballet-para-adultos-barcelona', lang: 'ca', page: 'blogBalletAdultos' },
  { path: 'ca/blog/tips/danza-contemporanea-vs-modern-jazz-vs-ballet', lang: 'ca', page: 'blogDanzaContemporaneaVsJazzBallet' },
  { path: 'ca/blog/tips/danzas-urbanas-barcelona-guia-completa', lang: 'ca', page: 'blogDanzasUrbanas' },
  { path: 'ca/blog/tips/modern-jazz-barcelona-guia-completa', lang: 'ca', page: 'blogModernJazz' },
  { path: 'ca/blog/tips/clases-bachata-barcelona-guia-completa', lang: 'ca', page: 'blogBachata' },
  { path: 'ca/blog/fitness', lang: 'ca', page: 'blogFitness' },
  { path: 'ca/blog/fitness/baile-salud-mental', lang: 'ca', page: 'blogBaileSaludMental' },

  { path: 'en/blog', lang: 'en', page: 'blog' },
  { path: 'en/blog/lifestyle', lang: 'en', page: 'blogLifestyle' },
  { path: 'en/blog/lifestyle/beneficios-bailar-salsa', lang: 'en', page: 'blogBeneficiosSalsa' },
  { path: 'en/blog/lifestyle/clases-de-salsa-barcelona', lang: 'en', page: 'blogClasesSalsaBarcelona' },
  { path: 'en/blog/lifestyle/como-perder-miedo-bailar', lang: 'en', page: 'blogPerderMiedoBailar' },
  { path: 'en/blog/historia', lang: 'en', page: 'blogHistoria' },
  { path: 'en/blog/historia/historia-salsa-barcelona', lang: 'en', page: 'blogHistoriaSalsa' },
  { path: 'en/blog/historia/historia-bachata-barcelona', lang: 'en', page: 'blogHistoriaBachata' },
  { path: 'en/blog/tutoriales', lang: 'en', page: 'blogTutoriales' },
  { path: 'en/blog/historia/salsa-ritmo-conquisto-mundo', lang: 'en', page: 'blogSalsaRitmo' },
  { path: 'en/blog/tips/salsa-vs-bachata-que-estilo-elegir', lang: 'en', page: 'blogSalsaVsBachata' },
  { path: 'en/blog/tips', lang: 'en', page: 'blogTips' },
  { path: 'en/blog/tips/clases-baile-principiantes-barcelona-farrays', lang: 'en', page: 'blogClasesPrincipiantes' },
  { path: 'en/blog/tips/academia-de-danza-barcelona-guia-completa', lang: 'en', page: 'blogAcademiaDanza' },
  { path: 'en/blog/tips/ballet-para-adultos-barcelona', lang: 'en', page: 'blogBalletAdultos' },
  { path: 'en/blog/tips/danza-contemporanea-vs-modern-jazz-vs-ballet', lang: 'en', page: 'blogDanzaContemporaneaVsJazzBallet' },
  { path: 'en/blog/tips/danzas-urbanas-barcelona-guia-completa', lang: 'en', page: 'blogDanzasUrbanas' },
  { path: 'en/blog/tips/modern-jazz-barcelona-guia-completa', lang: 'en', page: 'blogModernJazz' },
  { path: 'en/blog/tips/clases-bachata-barcelona-guia-completa', lang: 'en', page: 'blogBachata' },
  { path: 'en/blog/fitness', lang: 'en', page: 'blogFitness' },
  { path: 'en/blog/fitness/baile-salud-mental', lang: 'en', page: 'blogBaileSaludMental' },

  { path: 'fr/blog', lang: 'fr', page: 'blog' },
  { path: 'fr/blog/lifestyle', lang: 'fr', page: 'blogLifestyle' },
  { path: 'fr/blog/lifestyle/beneficios-bailar-salsa', lang: 'fr', page: 'blogBeneficiosSalsa' },
  { path: 'fr/blog/lifestyle/clases-de-salsa-barcelona', lang: 'fr', page: 'blogClasesSalsaBarcelona' },
  { path: 'fr/blog/lifestyle/como-perder-miedo-bailar', lang: 'fr', page: 'blogPerderMiedoBailar' },
  { path: 'fr/blog/historia', lang: 'fr', page: 'blogHistoria' },
  { path: 'fr/blog/historia/historia-salsa-barcelona', lang: 'fr', page: 'blogHistoriaSalsa' },
  { path: 'fr/blog/historia/historia-bachata-barcelona', lang: 'fr', page: 'blogHistoriaBachata' },
  { path: 'fr/blog/tutoriales', lang: 'fr', page: 'blogTutoriales' },
  { path: 'fr/blog/historia/salsa-ritmo-conquisto-mundo', lang: 'fr', page: 'blogSalsaRitmo' },
  { path: 'fr/blog/tips/salsa-vs-bachata-que-estilo-elegir', lang: 'fr', page: 'blogSalsaVsBachata' },
  { path: 'fr/blog/tips', lang: 'fr', page: 'blogTips' },
  { path: 'fr/blog/tips/clases-baile-principiantes-barcelona-farrays', lang: 'fr', page: 'blogClasesPrincipiantes' },
  { path: 'fr/blog/tips/academia-de-danza-barcelona-guia-completa', lang: 'fr', page: 'blogAcademiaDanza' },
  { path: 'fr/blog/tips/ballet-para-adultos-barcelona', lang: 'fr', page: 'blogBalletAdultos' },
  { path: 'fr/blog/tips/danza-contemporanea-vs-modern-jazz-vs-ballet', lang: 'fr', page: 'blogDanzaContemporaneaVsJazzBallet' },
  { path: 'fr/blog/tips/danzas-urbanas-barcelona-guia-completa', lang: 'fr', page: 'blogDanzasUrbanas' },
  { path: 'fr/blog/tips/modern-jazz-barcelona-guia-completa', lang: 'fr', page: 'blogModernJazz' },
  { path: 'fr/blog/tips/clases-bachata-barcelona-guia-completa', lang: 'fr', page: 'blogBachata' },
  { path: 'fr/blog/fitness', lang: 'fr', page: 'blogFitness' },
  { path: 'fr/blog/fitness/baile-salud-mental', lang: 'fr', page: 'blogBaileSaludMental' },

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

// ═══════════════════════════════════════════════════════════════════════════════
// METADATA GENERATION (Single Source of Truth from i18n files)
// ═══════════════════════════════════════════════════════════════════════════════
// Instead of ~1600 lines of hardcoded descriptions, we now read from i18n files.
// This ensures prerender.mjs and React Helmet (SEO.tsx) show the SAME meta tags.
// The mapping is defined in constants/seo-meta-keys.mjs.

// Pages that should have noindex, nofollow
const NOINDEX_PAGES = new Set([
  'horariosPrecio', 'hazteSocio', 'yrProject', 'miReserva',
  'fichaje', 'fichajeResumen', 'adminFichajes', 'adminReservas',
  'feedbackGracias', 'feedbackComentario', 'asistenciaConfirmada', 'notFound',
]);

// Generate metadata dynamically from i18n files
const metadata = {};
for (const locale of SUPPORTED_LOCALES) {
  metadata[locale] = {};
  for (const [pageKey, meta] of Object.entries(SEO_META_KEYS)) {
    const entry = {
      title: getI18nValue(locale, meta.ns, meta.titleKey),
      description: getI18nValue(locale, meta.ns, meta.descKey),
    };
    if (NOINDEX_PAGES.has(pageKey)) {
      entry.robots = 'noindex, nofollow';
    }
    metadata[locale][pageKey] = entry;
  }
  // Generic Dance Landing Pages (auto-generated from LANDING_METADATA)
  Object.assign(metadata[locale], LANDING_METADATA[locale] || {});
}

// Build-time SEO validation
let seoWarnings = 0;
for (const locale of SUPPORTED_LOCALES) {
  for (const [pageKey, meta] of Object.entries(SEO_META_KEYS)) {
    const desc = metadata[locale]?.[pageKey]?.description;
    if (!desc) {
      console.warn(`⚠️  SEO: Missing meta description for "${pageKey}" in ${locale} (key: ${meta.descKey}, ns: ${meta.ns})`);
      seoWarnings++;
    }
  }
}
if (seoWarnings > 0) {
  console.warn(`\n⚠️  SEO: ${seoWarnings} missing meta description(s) detected. Check i18n files.\n`);
}


// 
// INITIAL CONTENT GENERATION
// 
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
// NOTE: home uses createRoot (not hydrateRoot) so pre-rendered content is safely replaced by React
const manualOverrides = {
  es: {
    // Homepage pre-rendered content for crawlers — React replaces via createRoot (no hydration mismatch risk)
    // All text below comes from i18n/locales/es/home.json translations
    home: `<main id="main-content"><header id="hero"><h1>Tu Escuela de Baile en Barcelona</h1><p>Clases de Danza, Salsa, Bachata, Danza Urbana, y Más</p><p>No necesitas más clases de baile. Necesitas las clases correctas. Si buscas clases de baile en Barcelona donde por fin avances y no te sientas un número, estás en el sitio correcto. Con el Método Farray® aprendes bien, rápido y con estilo.</p></header><section id="classes"><h2>Clases de Baile para Adultos</h2><p>Descubre nuestras clases de baile para adultos y encuentra el estilo perfecto para ti. Calidad, profesionalidad y comunidad en el corazón de Barcelona, en una academia acreditada por CID-UNESCO.</p><h3>Clases de Salsa y Bachata</h3><p>Aprende a bailar en pareja con la auténtica técnica cubana. Desde salsa cubana y timba hasta bachata sensual.</p><h3>Clases de Danza Urbana y Hip Hop</h3><p>Siente la energía de la calle con Hip Hop, Dancehall, Reggaeton, Afrobeat, K-Pop y Commercial Dance.</p><h3>Ballet, Contemporáneo y Jazz</h3><p>Explora la técnica clásica y la expresión contemporánea con Ballet Clásico, Danza Contemporánea, Modern Jazz, Afro-Jazz y Afro-Contemporáneo.</p></section><section id="why"><h2>¿Por qué elegir nuestra Academia de danza en Barcelona?</h2><ul><li>Profesores de Clase Mundial</li><li>Exclusivo Método Farray®</li><li>700 m² de Instalaciones Premium</li><li>Centro acreditado CID-UNESCO</li><li>Ubicación privilegiada cerca de Plaza España y Sants</li></ul></section><section id="faq"><h2>Preguntas Frecuentes</h2><details><summary>¿Cuántos estilos de baile enseñan en Farray's Center?</summary><p>Ofrecemos formación en más de 25 estilos diferentes de baile incluyendo bailes latinos, danza urbana, estilos clásicos y preparación física para bailarines.</p></details><details><summary>¿Necesito experiencia previa para empezar?</summary><p>No, absolutamente no necesitas experiencia previa. Todos nuestros estilos de baile tienen clases para principiantes absolutos.</p></details><details><summary>¿Dónde está ubicado Farray's Center?</summary><p>Estamos en Carrer d'Entença 100, Barcelona 08015, a 5 minutos caminando de Plaza España y Estación de Sants.</p></details></section></main>`,
    yrProject: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Y&R | Yunaisy & Reynier</h1><p>Cuban International Dancers</p></main>`,
    termsConditions: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Términos y Condiciones</h1><p>Información legal sobre inscripciones, pagos y políticas de Farray's Center.</p></main>`,
    legalNotice: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Aviso Legal</h1><p>Información sobre la empresa, propiedad intelectual y condiciones de uso.</p></main>`,
    privacyPolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Política de Privacidad</h1><p>Información sobre el tratamiento de datos personales según el RGPD.</p></main>`,
    cookiePolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Política de Cookies</h1><p>Información sobre las cookies utilizadas en nuestro sitio web.</p></main>`,
    serviciosBaile: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Servicios de Baile</h1><p>Clases particulares, coreografías para eventos, shows y espectáculos profesionales.</p></main>`,
    ubicacion: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cómo Llegar a Farray's Center</h1><p>Estamos en Carrer d'Entença 100, Barcelona. Metro Rocafort (L1) a 4 min, Sants Estació a 8 min. Perfectamente conectado con toda la ciudad.</p></main>`,
    calendario: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Calendario de Eventos</h1><p>Workshops, masterclasses y actividades especiales en Farray's Center Barcelona.</p></main>`,
    notFound: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Página No Encontrada</h1><p>La página que buscas no existe. Vuelve a la página principal o explora nuestras clases de baile.</p></main>`,
  },
  ca: {
    // Homepage pre-rendered content for crawlers — React replaces via createRoot (no hydration mismatch risk)
    home: `<main id="main-content"><header id="hero"><h1>La Teva Escola de Ball a Barcelona</h1><p>Classes de Dansa, Salsa, Bachata, Dansa Urbana, i Més</p><p>No necessites més classes de ball. Necessites les classes correctes. Si busques classes de ball a Barcelona on per fi avancis i no et sentis un número, estàs al lloc correcte. Amb el Mètode Farray® aprens bé, ràpid i amb estil.</p></header><section id="classes"><h2>Classes de Ball per a Adults</h2><p>Descobreix les nostres classes de ball per a adults i troba l'estil perfecte per a tu. Qualitat, professionalitat i comunitat al cor de Barcelona, en una acadèmia acreditada per CID-UNESCO.</p><h3>Classes de Salsa i Bachata</h3><p>Aprèn a ballar en parella amb l'autèntica tècnica cubana. Des de salsa cubana i timba fins a bachata sensual.</p><h3>Classes de Dansa Urbana i Hip Hop</h3><p>Sent l'energia del carrer amb Hip Hop, Dancehall, Reggaeton, Afrobeat, K-Pop i Commercial Dance.</p><h3>Ballet, Contemporani i Jazz</h3><p>Explora la tècnica clàssica i l'expressió contemporània amb Ballet Clàssic, Dansa Contemporània, Modern Jazz, Afro-Jazz i Afro-Contemporani.</p></section><section id="why"><h2>Per què escollir la nostra escola de ball a Barcelona?</h2><ul><li>Professors de Classe Mundial</li><li>Exclusiu Mètode Farray®</li><li>700 m² d'Instal·lacions Premium</li><li>Centre acreditat CID-UNESCO</li><li>Ubicació privilegiada prop de Plaça Espanya i Sants</li></ul></section><section id="faq"><h2>Preguntes Freqüents</h2><details><summary>Quants estils de ball ensenyen a Farray's Center?</summary><p>Oferim formació en més de 25 estils diferents de ball incloent balls llatins, dansa urbana, estils clàssics i preparació física per a ballarins.</p></details><details><summary>Necessito experiència prèvia per començar?</summary><p>No, absolutament no necessites experiència prèvia. Tots els nostres estils de ball tenen classes per a principiants absoluts.</p></details><details><summary>On està ubicat Farray's Center?</summary><p>Som al Carrer d'Entença 100, Barcelona 08015, a 5 minuts caminant de Plaça Espanya i Estació de Sants.</p></details></section></main>`,
    yrProject: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Y&R | Yunaisy & Reynier</h1><p>Cuban International Dancers</p></main>`,
    termsConditions: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Termes i Condicions</h1><p>Informació legal sobre inscripcions, pagaments i polítiques de Farray's Center.</p></main>`,
    legalNotice: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Avís Legal</h1><p>Informació sobre l'empresa, propietat intel·lectual i condicions d'ús.</p></main>`,
    privacyPolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Política de Privacitat</h1><p>Informació sobre el tractament de dades personals segons el RGPD.</p></main>`,
    cookiePolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Política de Cookies</h1><p>Informació sobre les cookies utilitzades al nostre lloc web.</p></main>`,
    serviciosBaile: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Serveis de Ball</h1><p>Classes particulars, coreografies per a esdeveniments, shows i espectacles professionals.</p></main>`,
    ubicacion: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Com Arribar a Farray's Center</h1><p>Som al Carrer d'Entença 100, Barcelona. Metro Rocafort (L1) a 4 min, Sants Estació a 8 min. Perfectament connectat amb tota la ciutat.</p></main>`,
    calendario: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Calendari d'Esdeveniments</h1><p>Workshops, masterclasses i activitats especials a Farray's Center Barcelona.</p></main>`,
    notFound: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Pàgina No Trobada</h1><p>La pàgina que busques no existeix. Torna a la pàgina principal o explora les nostres classes de ball.</p></main>`,
  },
  en: {
    // Homepage pre-rendered content for crawlers — React replaces via createRoot (no hydration mismatch risk)
    home: `<main id="main-content"><header id="hero"><h1>Your Dance School in Barcelona</h1><p>Classes for Dance, Salsa, Bachata, Urban Dance, and More</p><p>You don't need more dance classes. You need the right classes. If you're looking for dance classes in Barcelona where you finally make progress and don't feel like just a number, you're in the right place. With the Farray Method® you learn well, fast and with style.</p></header><section id="classes"><h2>Dance Classes for Adults</h2><p>Discover our dance classes for adults and find the perfect style for you. Quality, professionalism, and community in the heart of Barcelona, at an academy accredited by CID-UNESCO.</p><h3>Salsa and Bachata Classes</h3><p>Learn to dance in pairs with authentic Cuban technique. From Cuban salsa and timba to sensual bachata.</p><h3>Urban & Hip Hop Classes</h3><p>Feel the street energy with Hip Hop, Dancehall, Reggaeton, Afrobeat, K-Pop, and Commercial Dance.</p><h3>Ballet, Contemporary & Jazz</h3><p>Explore classical technique and contemporary expression with Classical Ballet, Contemporary Dance, Modern Jazz, Afro-Jazz, and Afro-Contemporary.</p></section><section id="why"><h2>Why choose our dance school in Barcelona?</h2><ul><li>World-Class Instructors</li><li>Exclusive Farray Method®</li><li>700 m² Premium Facilities</li><li>CID-UNESCO Accredited Center</li><li>Privileged location near Plaza España and Sants Station</li></ul></section><section id="faq"><h2>Frequently Asked Questions</h2><details><summary>How many dance styles do you teach at Farray's Center?</summary><p>We offer training in over 25 different dance styles including Latin dances, urban dance, classical styles, and physical preparation for dancers.</p></details><details><summary>Do I need previous experience to start?</summary><p>No, you absolutely don't need any previous experience. All our dance styles have classes for absolute beginners.</p></details><details><summary>Where is Farray's Center located?</summary><p>We are at Carrer d'Entença 100, Barcelona 08015, a 5-minute walk from Plaza España and Sants Station.</p></details></section></main>`,
    yrProject: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Y&R | Yunaisy & Reynier</h1><p>Cuban International Dancers</p></main>`,
    termsConditions: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Terms and Conditions</h1><p>Legal information about registration, payments and policies at Farray's Center.</p></main>`,
    legalNotice: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Legal Notice</h1><p>Information about the company, intellectual property and terms of use.</p></main>`,
    privacyPolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Privacy Policy</h1><p>Information about personal data processing in accordance with GDPR.</p></main>`,
    cookiePolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Cookie Policy</h1><p>Information about cookies used on our website.</p></main>`,
    serviciosBaile: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Dance Services</h1><p>Private lessons, event choreography, professional shows and performances.</p></main>`,
    ubicacion: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">How to Get to Farray's Center</h1><p>We're at Carrer d'Entença 100, Barcelona. Metro Rocafort (L1) 4 min walk, Sants Station 8 min. Perfectly connected with the entire city.</p></main>`,
    calendario: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Events Calendar</h1><p>Workshops, masterclasses and special activities at Farray's Center Barcelona.</p></main>`,
    notFound: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Page Not Found</h1><p>The page you are looking for does not exist. Go back to the home page or explore our dance classes.</p></main>`,
  },
  fr: {
    // Homepage pre-rendered content for crawlers — React replaces via createRoot (no hydration mismatch risk)
    home: `<main id="main-content"><header id="hero"><h1>Votre École de Danse à Barcelone</h1><p>Cours de Danse, Salsa, Bachata, Danse Urbaine, et Plus</p><p>Vous n'avez pas besoin de plus de cours de danse. Vous avez besoin des bons cours. Si vous cherchez des cours de danse à Barcelone où vous progressez enfin et ne vous sentez pas comme un simple numéro, vous êtes au bon endroit. Avec la Méthode Farray®, vous apprenez bien, vite et avec style.</p></header><section id="classes"><h2>Cours de Danse pour Adultes</h2><p>Découvrez nos cours de danse pour adultes et trouvez le style parfait pour vous. Qualité, professionnalisme et communauté au cœur de Barcelone, dans une académie accréditée par le CID-UNESCO.</p><h3>Cours de Salsa et Bachata</h3><p>Apprenez à danser en couple avec l'authentique technique cubaine. De la salsa cubaine et timba à la bachata sensuelle.</p><h3>Cours de Danse Urbaine et Hip Hop</h3><p>Ressentez l'énergie de la rue avec Hip Hop, Dancehall, Reggaeton, Afrobeat, K-Pop et Commercial Dance.</p><h3>Ballet, Contemporain et Jazz</h3><p>Explorez la technique classique et l'expression contemporaine avec Ballet Classique, Danse Contemporaine, Modern Jazz, Afro-Jazz et Afro-Contemporain.</p></section><section id="why"><h2>Pourquoi choisir notre école de danse à Barcelone ?</h2><ul><li>Professeurs de Classe Mondiale</li><li>Méthode Exclusive Farray®</li><li>Installations Premium de 700 m²</li><li>Centre accrédité CID-UNESCO</li><li>Emplacement privilégié près de Plaza España et gare de Sants</li></ul></section><section id="faq"><h2>Questions Fréquentes</h2><details><summary>Combien de styles de danse enseignez-vous au Farray's Center ?</summary><p>Nous offrons une formation dans plus de 25 styles de danse différents, incluant danses latines, danse urbaine, styles classiques et préparation physique pour danseurs.</p></details><details><summary>Ai-je besoin d'une expérience préalable pour commencer ?</summary><p>Non, vous n'avez absolument pas besoin d'expérience préalable. Tous nos styles de danse ont des cours pour débutants absolus.</p></details><details><summary>Où se trouve le Farray's Center ?</summary><p>Nous sommes au Carrer d'Entença 100, Barcelone 08015, à 5 minutes à pied de la Plaza España et de la gare de Sants.</p></details></section></main>`,
    yrProject: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Y&R | Yunaisy & Reynier</h1><p>Cuban International Dancers</p></main>`,
    termsConditions: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Conditions Générales</h1><p>Informations légales sur les inscriptions, paiements et politiques de Farray's Center.</p></main>`,
    legalNotice: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Mentions Légales</h1><p>Informations sur l'entreprise, propriété intellectuelle et conditions d'utilisation.</p></main>`,
    privacyPolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Politique de Confidentialité</h1><p>Informations sur le traitement des données personnelles conformément au RGPD.</p></main>`,
    cookiePolicy: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Politique de Cookies</h1><p>Informations sur les cookies utilisés sur notre site web.</p></main>`,
    serviciosBaile: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Services de Danse</h1><p>Cours particuliers, chorégraphies pour événements, shows et spectacles professionnels.</p></main>`,
    ubicacion: `<main id="main-content"><h1 class="holographic-text text-4xl font-bold">Comment Venir à Farray's Center</h1><p>Nous sommes au Carrer d'Entença 100, Barcelone. Métro Rocafort (L1) à 4 min, Gare de Sants à 8 min. Parfaitement connecté avec toute la ville.</p></main>`,
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

// Auto-build page → pagePath map from routes array (replaces manual if/else chain)
// Uses first 'es' route for each page key, strips 'es/' prefix to get the shared path
const pageToPathMap = {};
for (const r of [...routes, ...LANDING_ROUTES]) {
  if (r.lang === 'es' && !Object.prototype.hasOwnProperty.call(pageToPathMap, r.page)) {
    if (r.path === '' || r.path === 'es') {
      pageToPathMap[r.page] = '';
    } else if (r.path.startsWith('es/')) {
      pageToPathMap[r.page] = r.path.slice(3);
    }
    // else: skip pages without locale prefix (e.g., yr-project)
  }
}

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

  // Generate hreflang alternates (auto-lookup from routes array)
  const pagePath = pageToPathMap[page];

  // Only generate hreflang for pages with locale-based paths
  const hreflangLinks = pagePath !== undefined ? [
    `<link rel="alternate" hreflang="es" href="https://www.farrayscenter.com/es${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="ca" href="https://www.farrayscenter.com/ca${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="en" href="https://www.farrayscenter.com/en${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="fr" href="https://www.farrayscenter.com/fr${pagePath ? `/${pagePath}` : ''}" />`,
    `<link rel="alternate" hreflang="x-default" href="https://www.farrayscenter.com/es${pagePath ? `/${pagePath}` : ''}" />`,
  ].join('\n    ') : '';

  const currentUrl = `https://www.farrayscenter.com/${routePath}`;

  // Locale persistence script - runs before React mounts
  // NOTE: This script is STATIC (same for all pages) to avoid CSP hash issues
  // It reads the locale from the HTML lang attribute which is set during prerendering
  const localeScript = `
    <script>
      (function(){var l=document.documentElement.lang||'es';localStorage.setItem('fidc_preferred_locale',l);document.cookie='fidc_locale='+l+';max-age=31536000;path=/;SameSite=Lax';})();
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

  // Generate JSON-LD structured data for SEO + GEO (AI crawlers)
  const jsonLdHtml = generateAllJsonLd({
    routePath,
    lang,
    page,
    meta,
    translations: pagesTranslations[lang] || {},
    blogTranslations: blogTranslations[lang] || {},
    homeTranslations: homeTranslations[lang] || {},
    scheduleTranslations: scheduleTranslations[lang] || {},
    faqJsonTranslations: faqTranslations[lang] || {},
    styleKeyMap: STYLE_KEY_MAP,
    faqPageMap: FAQ_PAGE_MAP,
  });

  html = html.replace('</head>', `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta name="robots" content="${robotsContent}" />
    <link rel="canonical" href="${currentUrl}" />
    ${hreflangLinks}

    <!-- Open Graph -->
    <meta property="og:type" content="${BLOG_ARTICLE_DATA[page] ? 'article' : 'website'}" />
    <meta property="og:url" content="${currentUrl}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:image" content="${getOgImageUrl(page)}" />
    <meta property="og:locale" content="${{ es: 'es_ES', ca: 'ca_ES', en: 'en_GB', fr: 'fr_FR' }[lang]}" />
    <meta property="og:site_name" content="Farray's International Dance Center" />${BLOG_ARTICLE_DATA[page] ? `
    <meta property="article:published_time" content="${BLOG_ARTICLE_DATA[page].datePublished}" />
    <meta property="article:modified_time" content="${BLOG_ARTICLE_DATA[page].dateModified}" />
    <meta property="article:author" content="Yunaisy Farray" />
    <meta property="article:section" content="${BLOG_ARTICLE_DATA[page].category}" />` : ''}

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${currentUrl}" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${getOgImageUrl(page)}" />
${preloadHintsHtml}
    ${localeScript}
    ${jsonLdHtml}
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

// ============================================================================
// COPY 404.html TO ROOT FOR VERCEL (SEO: Real HTTP 404)
// ============================================================================
// Vercel automatically serves 404.html with HTTP 404 status for unmatched routes
// This ensures search engines correctly identify 404 pages
const source404 = path.join(distPath, 'es/404/index.html');
const dest404 = path.join(distPath, '404.html');

if (fs.existsSync(source404)) {
  fs.copyFileSync(source404, dest404);
  console.log(`\n✅ Created 404.html for Vercel (HTTP 404 real)`);
} else {
  console.log(`\n⚠️  Warning: es/404/index.html not found, skipping 404.html creation`);
}

// ============================================================================
// AUTO-GENERATE SITEMAP (sync with pre-rendered routes)
// ============================================================================
const BASE_URL = 'https://www.farrayscenter.com';
const TODAY = new Date().toISOString().split('T')[0];
const sitemapUrls = [];

for (const route of routes) {
  const { path: routePath, lang, page } = route;

  // Skip root redirect ('' → /es)
  if (routePath === '') continue;

  // Skip noindex pages (404, legal, promo landings)
  const robotsValue = metadata[lang]?.[page]?.robots || 'index, follow';
  if (robotsValue.includes('noindex')) continue;

  const url = `${BASE_URL}/${routePath}`;

  // Determine lastmod: blog articles use their dateModified, rest use build date
  const blogData = BLOG_ARTICLE_DATA[page];
  const lastmod = blogData ? blogData.dateModified : TODAY;

  // Determine priority
  let priority = '0.5';
  if (page === 'home') priority = '1.0';
  else if (STYLE_KEY_MAP[page]) priority = '0.8';
  else if (blogData) priority = '0.7';
  else if (['classes', 'classesHub', 'horariosPrecio', 'horarios', 'precios'].includes(page)) priority = '0.8';

  // Build hreflang alternates using pageToPathMap
  const pagePath = pageToPathMap[page];
  const hreflangLinks = pagePath !== undefined ? [
    `      <xhtml:link rel="alternate" hreflang="es" href="${BASE_URL}/es${pagePath ? `/${pagePath}` : ''}"/>`,
    `      <xhtml:link rel="alternate" hreflang="ca" href="${BASE_URL}/ca${pagePath ? `/${pagePath}` : ''}"/>`,
    `      <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}/en${pagePath ? `/${pagePath}` : ''}"/>`,
    `      <xhtml:link rel="alternate" hreflang="fr" href="${BASE_URL}/fr${pagePath ? `/${pagePath}` : ''}"/>`,
    `      <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/es${pagePath ? `/${pagePath}` : ''}"/>`,
  ].join('\n') : '';

  sitemapUrls.push(`  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page === 'home' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${priority}</priority>
${hreflangLinks}
  </url>`);
}

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(distPath, 'sitemap-pages.xml'), sitemapXml);
console.log(`\n🗺️  Sitemap: Generated ${sitemapUrls.length} URLs in sitemap-pages.xml`);

console.log('\n📊 Summary:');
console.log(`   - Total pages: ${generatedCount}`);
console.log(`   - Sitemap: ${sitemapUrls.length} indexable URLs`);
console.log(`   - Languages: es, ca, en, fr (4)`);
console.log(`   - SEO: ✅ Metadata, ✅ hreflang, ✅ Canonical, ✅ Open Graph, ✅ Sitemap`);
console.log(`   - Locale: ✅ Pre-set via localStorage + cookie before React hydration`);
console.log(`   - 404: ✅ Real HTTP 404 (dist/404.html)`);
console.log('\n🔍 Verify: Run "npm run preview" and view page source to see prerendered content\n');
