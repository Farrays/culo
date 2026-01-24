/**
 * Afro Jazz Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  AFRO_JAZZ_TESTIMONIALS,
  AFRO_JAZZ_FAQS_CONFIG,
  AFRO_JAZZ_SCHEDULE_KEYS,
  AFRO_JAZZ_LEVELS,
  AFRO_JAZZ_PREPARE_CONFIG,
} from './afro-jazz';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const AFRO_JAZZ_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'afrojazz',
  stylePath: 'afro-jazz-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: AFRO_JAZZ_FAQS_CONFIG,
  testimonials: AFRO_JAZZ_TESTIMONIALS,
  scheduleKeys: AFRO_JAZZ_SCHEDULE_KEYS,

  // Teachers (sistema centralizado de profesores)
  teachers: [
    getTeacherForClass('yunaisy-farray', 'afrojazz', [
      'Directora',
      'CID-UNESCO',
      'Creadora Método Farray',
    ]),
    getTeacherForClass('alejandro-minoso', 'afrojazz', ['ENA Cuba', 'Modern Jazz']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Dance > Afro Jazz)
  breadcrumbConfig: {
    homeKey: 'afrojazzBreadcrumbHome',
    classesKey: 'afrojazzBreadcrumbClasses',
    categoryKey: 'afrojazzBreadcrumbUrban',
    categoryUrl: '/clases/danza-barcelona',
    currentKey: 'afrojazzBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: AFRO_JAZZ_LEVELS,
  prepareConfig: AFRO_JAZZ_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'emerald',

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/afro-jazz/img/afro-jazz',
      alt: "Clases de Afro Jazz en Barcelona - Farray's Center",
      altKey: 'styleImages.afroJazz.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'] as const,
    },
    heroVisuals: {
      imageOpacity: 45,
      objectPosition: 'center 35%',
      gradientStyle: 'dark' as const,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/classes/afro-jazz/img/afro-jazz_1024.webp',
      srcSet:
        '/images/classes/afro-jazz/img/afro-jazz_320.webp 320w, /images/classes/afro-jazz/img/afro-jazz_640.webp 640w, /images/classes/afro-jazz/img/afro-jazz_768.webp 768w, /images/classes/afro-jazz/img/afro-jazz_1024.webp 1024w, /images/classes/afro-jazz/img/afro-jazz_1440.webp 1440w',
      alt: "Clases de Afro Jazz en Barcelona - Farray's Center",
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
    enabled: true, // Shows "Video Próximamente" placeholder
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'afrojazz',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'afrojazzCulturalHistoryTitle',
    shortDescKey: 'afrojazzCulturalShort',
    fullHistoryKey: 'afrojazzCulturalFull',
  },

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'general',
    limit: 6,
    showGoogleBadge: true,
  },

  // === ARTISTIC DANCE COMPARISON TABLE ===
  artisticDanceComparison: {
    enabled: true,
    highlightedStyle: 'afrojazz',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teachesKey: 'schema_afroJazz_teaches',
    prerequisitesKey: 'schema_afroJazz_prerequisites',
    lessonsKey: 'schema_afroJazz_lessons',
    duration: 'PT1H30M',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitleKey: 'schema_yunaisy_jobTitle_afroJazz',
      descriptionKey: 'schema_yunaisy_description_afroJazz',
      knowsAbout: ['Afro Jazz', 'Cuban Dance', 'Jazz', 'Choreography', 'ENA Technique'],
    },
    {
      name: 'Alejandro Miñoso',
      jobTitleKey: 'schema_alejandro_jobTitle_afroJazz',
      descriptionKey: 'schema_alejandro_description_afroJazz',
      knowsAbout: ['Afro Jazz', 'Cuban Dance', 'Contemporary'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Afro Jazz -> Afro Contemporáneo, Modern Jazz, Afrobeats
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'afro-contemporaneo-barcelona',
        nameKey: 'relatedAfroContemporaneoName',
        descriptionKey: 'relatedAfroContemporaneoDesc',
      },
      {
        slug: 'modern-jazz-barcelona',
        nameKey: 'relatedModernJazzName',
        descriptionKey: 'relatedModernJazzDesc',
      },
      {
        slug: 'afrobeats-barcelona',
        nameKey: 'relatedAfrobeatsName',
        descriptionKey: 'relatedAfrobeatsDesc',
      },
    ],
  },
};
