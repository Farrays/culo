/**
 * Bachata Sensual Page Configuration for FullDanceClassTemplate
 * ==============================================================
 * Configuración completa para la página /clases/bachata-barcelona
 * Usa el template moderno FullDanceClassTemplate
 */
import {
  BACHATA_TESTIMONIALS,
  BACHATA_FAQS_CONFIG,
  BACHATA_SCHEDULE_KEYS,
  BACHATA_LEVELS,
  BACHATA_PREPARE_CONFIG,
  BACHATA_NEARBY_AREAS,
} from './bachata';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const BACHATA_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'bachataV3',
  stylePath: 'bachata-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: BACHATA_FAQS_CONFIG,
  testimonials: BACHATA_TESTIMONIALS,
  scheduleKeys: BACHATA_SCHEDULE_KEYS,

  // Teachers - 4 profesores de bachata sensual (usando sistema centralizado)
  teachers: [
    getTeacherForClass('mathias-font', 'bachataV3', ['Campeón Mundial', 'Musicalidad', 'Conexión']),
    getTeacherForClass('eugenia-trujillo', 'bachataV3', [
      'Campeona Mundial',
      'Salsa LA',
      'Bachata Sensual',
    ]),
    getTeacherForClass('carlos-canto', 'bachataV3', ['Bachata Sensual', 'Principiantes']),
    getTeacherForClass('noemi', 'bachataV3', ['Bachata Sensual', 'Lady Style']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Latin > Current)
  breadcrumbConfig: {
    homeKey: 'bachataV3BreadcrumbHome',
    classesKey: 'bachataV3BreadcrumbClasses',
    categoryKey: 'bachataV3BreadcrumbLatin',
    categoryUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'bachataV3BreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: BACHATA_LEVELS,
  prepareConfig: BACHATA_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 350,
    funPercent: 100,
    gradientColor: 'violet', // Color distintivo para bachata sensual

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/Bachata/img/clases-bachata-sensual-barcelona-pareja',
      alt: "Pareja bailando bachata sensual en clase de Barcelona - conexión, ondulaciones y técnica profesional en Farray's Center",
      altKey: 'styleImages.bachata.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'] as const,
    },
    heroVisuals: {
      imageOpacity: 50,
      objectPosition: 'center 40%',
      gradientStyle: 'dark' as const,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // Enterprise: Legacy format with srcSet for aspect-auto on desktop
    image: {
      src: '/images/classes/Bachata/img/clases-bachata-sensual-barcelona-pareja_1024.webp',
      srcSet:
        '/images/classes/Bachata/img/clases-bachata-sensual-barcelona-pareja_640.webp 640w, /images/classes/Bachata/img/clases-bachata-sensual-barcelona-pareja_1024.webp 1024w',
      alt: "Pareja bailando bachata sensual en clase de Barcelona - conexión, ondulaciones y técnica profesional en Farray's Center",
      altKey: 'styleImages.bachata.whatIs',
    },
  },

  identificationSection: {
    enabled: true,
    itemCount: 6,
    hasTransition: true,
    hasNeedEnroll: true,
  },

  transformationSection: {
    enabled: true,
    itemCount: 6,
  },

  whyChooseSection: {
    enabled: true,
    itemOrder: [1, 2, 3, 4, 5, 6, 7],
  },

  whyTodaySection: {
    enabled: true,
    paragraphCount: 3,
  },

  videoSection: {
    enabled: false, // Habilitar cuando haya video de bachata sensual
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'bachataV3',
    areas: BACHATA_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'bachataV3CulturalHistoryTitle',
    shortDescKey: 'bachataV3CulturalShort',
    fullHistoryKey: 'bachataV3CulturalFull',
  },

  // === LATIN DANCE COMPARISON ===
  latinDanceComparison: {
    enabled: true,
    highlightedStyle: 'bachata', // Destacar bachata en la tabla comparativa
  },

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'bachata',
    limit: 4,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches:
      'Bachata Sensual, ondulaciones, conexión en pareja, musicalidad, dips, waves, body movement, técnica de guía y seguimiento',
    prerequisites: 'Ninguno - clases para todos los niveles desde principiante absoluto',
    lessons: 'Clases semanales con progresión por niveles',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Mathias Font',
      jobTitle: 'Profesor de Bachata Sensual - Campeón Mundial Salsa LA',
      description:
        'Campeón mundial de Salsa LA junto a Eugenia Trujillo. Especialista en bachata sensual con enfoque en musicalidad y conexión.',
      knowsAbout: ['Bachata Sensual', 'Musicalidad', 'Conexión en pareja', 'Salsa LA'],
    },
    {
      name: 'Eugenia Trujillo',
      jobTitle: 'Profesora de Bachata Sensual - Campeona Mundial Salsa LA',
      description:
        "Maestra y bailarina internacional uruguaya, campeona mundial de Salsa LA. Profesora de bachata sensual en Farray's Center.",
      knowsAbout: ['Bachata Sensual', 'Bachata Lady Style', 'Salsa LA', 'Técnica femenina'],
    },
    {
      name: 'Carlos Canto',
      jobTitle: 'Profesor de Bachata Sensual',
      description:
        "Talento emergente de la escena de bachata de Barcelona. Especialista en clases para principiantes en Farray's Center.",
      knowsAbout: ['Bachata Sensual', 'Bachata para principiantes'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Bachata -> Salsa Cubana, Timba, Salsa Lady Style
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'salsa-cubana-barcelona',
        nameKey: 'relatedSalsaCubanaName',
        descriptionKey: 'relatedSalsaCubanaDesc',
      },
      {
        slug: 'timba-barcelona',
        nameKey: 'relatedTimbaName',
        descriptionKey: 'relatedTimbaDesc',
      },
      {
        slug: 'salsa-lady-style-barcelona',
        nameKey: 'relatedSalsaLadyStyleName',
        descriptionKey: 'relatedSalsaLadyStyleDesc',
      },
    ],
  },
};
