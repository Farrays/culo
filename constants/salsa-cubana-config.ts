/**
 * Salsa Cubana Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  SALSA_CUBANA_TESTIMONIALS,
  SALSA_CUBANA_FAQS_CONFIG,
  SALSA_CUBANA_SCHEDULE_KEYS,
  SALSA_CUBANA_LEVELS,
  SALSA_CUBANA_PREPARE_CONFIG,
  SALSA_CUBANA_NEARBY_AREAS,
} from './salsa-cubana';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const SALSA_CUBANA_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'salsaCubana',
  stylePath: 'salsa-cubana-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: SALSA_CUBANA_FAQS_CONFIG,
  testimonials: SALSA_CUBANA_TESTIMONIALS,
  scheduleKeys: SALSA_CUBANA_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [
    getTeacherForClass('yunaisy-farray', 'salsaCubana', [
      'Directora',
      'Creadora Método Farray',
      'CID-UNESCO',
    ]),
    getTeacherForClass('yasmina-fernandez', 'salsaCubana', ['Salsa Cubana', 'Lady Style']),
    getTeacherForClass('iroel-bastarreche', 'salsaCubana', ['Casino', 'Método Farray']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Latin > Salsa Cubana)
  breadcrumbConfig: {
    homeKey: 'salsaCubanaBreadcrumbHome',
    classesKey: 'salsaCubanaBreadcrumbClasses',
    categoryKey: 'salsaCubanaBreadcrumbLatin',
    categoryUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'salsaCubanaBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: SALSA_CUBANA_LEVELS,
  prepareConfig: SALSA_CUBANA_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 400,
    funPercent: 100,
    gradientColor: 'amber',
    // Enterprise: Hero background image with new salsa cubana photo
    heroImage: {
      basePath: '/images/classes/salsa-cubana/img/salsa-cubana',
      alt: "Pareja bailando salsa cubana en Barcelona - Clases de casino y rueda con profesores cubanos en Farray's Center",
      altKey: 'styleImages.salsaCubana.hero',
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
    image: {
      src: '/images/classes/salsa-cubana/img/salsa-cubana_1024.webp',
      srcSet:
        '/images/classes/salsa-cubana/img/salsa-cubana_640.webp 640w, /images/classes/salsa-cubana/img/salsa-cubana_768.webp 768w, /images/classes/salsa-cubana/img/salsa-cubana_1024.webp 1024w',
      alt: "Pareja ejecutando giro de salsa cubana en Barcelona - Técnica de casino y guía con profesores cubanos en Farray's Center",
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
    enabled: false,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'salsaCubana',
    areas: SALSA_CUBANA_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'salsaCubanaCulturalHistoryTitle',
    shortDescKey: 'salsaCubanaCulturalShort',
    fullHistoryKey: 'salsaCubanaCulturalFull',
  },

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'salsa-cubana',
    limit: 4,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Salsa Cubana, Casino, Rueda de Casino, guía y seguimiento, Método Farray',
    prerequisites: 'Ninguno - clases para todos los niveles desde principiante absoluto',
    lessons: 'Clases semanales con progresión por niveles',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitle: "Directora de Farray's Center - Creadora del Método Farray",
      description:
        "Bailarina profesional cubana, creadora del Método Farray para Salsa Cubana, directora de Farray's International Dance Center.",
      knowsAbout: ['Salsa Cubana', 'Casino', 'Rueda de Casino', 'Método Farray', 'Cuban Dance'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Salsa Cubana -> Bachata, Timba, Folklore Cubano
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'bachata-barcelona',
        nameKey: 'relatedBachataName',
        descriptionKey: 'relatedBachataDesc',
      },
      {
        slug: 'timba-barcelona',
        nameKey: 'relatedTimbaName',
        descriptionKey: 'relatedTimbaDesc',
      },
      {
        slug: 'folklore-cubano',
        nameKey: 'relatedFolkloreCubanoName',
        descriptionKey: 'relatedFolkloreCubanoDesc',
      },
    ],
  },
};
