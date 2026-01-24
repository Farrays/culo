/**
 * Cuerpo-Fit (Full Body Cardio Dance) Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete Cuerpo-Fit page.
 *
 * NOTA: Este archivo es para la NUEVA clase Cuerpo-Fit (cardio dance para todos).
 * URL: /clases/cuerpo-fit
 * No confundir con cuerpo-fit-config.ts que es Body Conditioning para bailarines.
 *
 * SEO Keywords:
 * - cuerpo fit barcelona
 * - entrenamiento full body barcelona
 * - cardio dance barcelona
 * - clases fitness barcelona
 * - quemar calorías bailando barcelona
 * - fitness dance barcelona
 * - ejercicios full body barcelona
 */
import {
  FULL_BODY_CARDIO_TESTIMONIALS,
  FULL_BODY_CARDIO_FAQS_CONFIG,
  FULL_BODY_CARDIO_SCHEDULE_KEYS,
  FULL_BODY_CARDIO_LEVELS,
  FULL_BODY_CARDIO_PREPARE_CONFIG,
} from './full-body-cardio';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const FULL_BODY_CARDIO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'fullBodyCardio',
  stylePath: 'cuerpo-fit',

  // === REQUIRED DATA ===
  faqsConfig: FULL_BODY_CARDIO_FAQS_CONFIG,
  testimonials: FULL_BODY_CARDIO_TESTIMONIALS,
  scheduleKeys: FULL_BODY_CARDIO_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [getTeacherForClass('cris-ag', 'fullBodyCardio', ['Cardio Dance', 'Full Body'])],

  // Breadcrumb (4 levels: Home > Classes > Fitness > Cuerpo-Fit)
  breadcrumbConfig: {
    homeKey: 'fullBodyCardioBreadcrumbHome',
    classesKey: 'fullBodyCardioBreadcrumbClasses',
    categoryKey: 'fullBodyCardioBreadcrumbCategory',
    categoryUrl: '/clases/entrenamiento-bailarines-barcelona',
    currentKey: 'fullBodyCardioBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: FULL_BODY_CARDIO_LEVELS,
  prepareConfig: FULL_BODY_CARDIO_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 450, // Promedio de 400-500 kcal
    funPercent: 100,
    gradientColor: 'amber', // Energía, vitalidad, fitness

    // Enterprise: Hero background image (shares image with body conditioning)
    heroImage: {
      basePath: '/images/classes/cuerpo-fit/img/cuerpo-fit-entrenamiento-bailarines',
      alt: "Alumnas realizando ejercicios de cardio dance Cuerpo-Fit en Barcelona - Entrenamiento full body en Farray's Center",
      altKey: 'styleImages.fullBodyCardio.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'] as const,
    },
    heroVisuals: {
      imageOpacity: 45,
      objectPosition: 'center 40%',
      gradientStyle: 'vibrant' as const,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // Enterprise OptimizedImage config (AVIF/WebP/JPG, 6 breakpoints)
    optimizedImage: {
      basePath: '/images/classes/cuerpo-fit/img/cuerpo-fit-entrenamiento-bailarines',
      alt: "Alumnas realizando ejercicios de cardio dance Cuerpo-Fit en Barcelona - Entrenamiento full body con música en Farray's Center",
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

  // Why Us vs Others Comparison Table - DISABLED
  whyUsComparison: {
    enabled: false,
    rowCount: 8,
    meaningCount: 4,
    showCTA: true,
  },

  videoSection: {
    enabled: true, // Shows "Video Próximamente" placeholder
  },

  logosSection: {
    enabled: true,
    // Uses default logos (UNESCO, Street Dance 2, The Dancer, Telecinco)
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'fullBodyCardio',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'fullBodyCardioCulturalHistoryTitle',
    shortDescKey: 'fullBodyCardioCulturalShort',
    fullHistoryKey: 'fullBodyCardioCulturalFull',
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
    teachesKey: 'schema_fullbodycardio_teaches',
    prerequisitesKey: 'schema_fullbodycardio_prerequisites',
    lessonsKey: 'schema_fullbodycardio_lessons',
    duration: 'PT1H',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Cris Ag',
      jobTitleKey: 'schema_fullbodycardio_cris_jobTitle',
      descriptionKey: 'schema_fullbodycardio_cris_description',
      knowsAbout: [
        'Full Body Training',
        'Cardio Dance',
        'Functional Fitness',
        'Método Farray',
        'Quema de Calorías',
        'Tonificación Integral',
      ],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Full Body Cardio -> Bum Bum, Stretching, Hip Hop Reggaeton (fitness + baile urbano)
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'ejercicios-gluteos-barcelona',
        nameKey: 'relatedBumBumName',
        descriptionKey: 'relatedBumBumDesc',
      },
      {
        slug: 'stretching-barcelona',
        nameKey: 'relatedStretchingName',
        descriptionKey: 'relatedStretchingDesc',
      },
      {
        slug: 'hip-hop-reggaeton-barcelona',
        nameKey: 'relatedHipHopReggaetonName',
        descriptionKey: 'relatedHipHopReggaetonDesc',
      },
    ],
  },
};
