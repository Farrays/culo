/**
 * Femmology Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  FEMMOLOGY_TESTIMONIALS,
  FEMMOLOGY_FAQS_CONFIG,
  FEMMOLOGY_SCHEDULE_KEYS,
  FEMMOLOGY_LEVELS,
  FEMMOLOGY_PREPARE_CONFIG,
} from './femmology';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const FEMMOLOGY_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'fem',
  stylePath: 'femmology-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: FEMMOLOGY_FAQS_CONFIG,
  testimonials: FEMMOLOGY_TESTIMONIALS,
  scheduleKeys: FEMMOLOGY_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [getTeacherForClass('yunaisy-farray', 'femmology', ['Femmology', 'Creadora'])],

  // Breadcrumb (5 levels: Home > Classes > Urban > Heels > Femmology)
  breadcrumbConfig: {
    homeKey: 'femBreadcrumbHome',
    classesKey: 'femBreadcrumbClasses',
    categoryKey: 'femBreadcrumbHeels',
    categoryUrl: '/clases/heels-barcelona',
    currentKey: 'femBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: FEMMOLOGY_LEVELS,
  prepareConfig: FEMMOLOGY_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 400,
    funPercent: 100,
    gradientColor: 'rose',
    // Enterprise: Hero background image (nueva foto grupal escenario 2025)
    heroImage: {
      basePath: '/images/classes/femmology/img/femmology-hero-barcelona',
      alt: 'Yunaisy Farray y su grupo de bailarinas de Femmology en Barcelona - Pose dramática en escenario con tacones',
      altKey: 'styleImages.femmology.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'],
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // Enterprise: OptimizedImage with multi-format srcset (nueva foto grupal 2025)
    optimizedImage: {
      basePath: '/images/classes/femmology/img/femmology-hero-barcelona',
      alt: 'Grupo de bailarinas de Femmology en Barcelona ejecutando coreografía sincronizada con Yunaisy Farray',
      altKey: 'styleImages.femmology.whatIs',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'],
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
    keyPrefix: 'fem',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'femCulturalHistoryTitle',
    shortDescKey: 'femCulturalShort',
    fullHistoryKey: 'femCulturalFull',
  },

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'general',
    limit: 6,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teachesKey: 'schema_femmology_teaches',
    prerequisitesKey: 'schema_femmology_prerequisites',
    lessonsKey: 'schema_femmology_lessons',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitleKey: 'schema_femmology_yunaisy_jobTitle',
      descriptionKey: 'schema_femmology_yunaisy_description',
      knowsAbout: ['Femmology', 'Heels Dance', 'Cuban Dance', 'Dance Therapy', 'Choreography'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Femmology -> Sexy Style, Heels, Salsa Lady Style
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'sexy-style-barcelona',
        nameKey: 'relatedSexyStyleName',
        descriptionKey: 'relatedSexyStyleDesc',
      },
      {
        slug: 'heels-barcelona',
        nameKey: 'relatedHeelsName',
        descriptionKey: 'relatedHeelsDesc',
      },
      {
        slug: 'salsa-lady-style-barcelona',
        nameKey: 'relatedSalsaLadyStyleName',
        descriptionKey: 'relatedSalsaLadyStyleDesc',
      },
    ],
  },
};
