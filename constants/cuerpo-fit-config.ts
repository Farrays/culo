/**
 * Body Conditioning / Acondicionamiento Físico Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete Body Conditioning / Acondicionamiento Físico page.
 *
 * SEO Keywords:
 * - acondicionamiento físico para bailarines
 * - body conditioning barcelona
 * - preparación física danza
 * - entrenamiento funcional bailarines
 * - fuerza y flexibilidad para bailar
 */
import {
  CUERPO_FIT_TESTIMONIALS,
  CUERPO_FIT_FAQS_CONFIG,
  CUERPO_FIT_SCHEDULE_KEYS,
  CUERPO_FIT_LEVELS,
  CUERPO_FIT_PREPARE_CONFIG,
} from './cuerpo-fit';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const CUERPO_FIT_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'cuerpofit',
  stylePath: 'acondicionamiento-fisico-bailarines',

  // === REQUIRED DATA ===
  faqsConfig: CUERPO_FIT_FAQS_CONFIG,
  testimonials: CUERPO_FIT_TESTIMONIALS,
  scheduleKeys: CUERPO_FIT_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [getTeacherForClass('cris-ag', 'cuerpoFit', ['Body Conditioning', 'Método Farray'])],

  // Breadcrumb (4 levels: Home > Classes > Prep Física > Body Conditioning)
  breadcrumbConfig: {
    homeKey: 'cuerpofitBreadcrumbHome',
    classesKey: 'cuerpofitBreadcrumbClasses',
    categoryKey: 'cuerpofitBreadcrumbCategory',
    categoryUrl: '/clases/entrenamiento-bailarines-barcelona',
    currentKey: 'cuerpofitBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: CUERPO_FIT_LEVELS,
  prepareConfig: CUERPO_FIT_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 350,
    funPercent: 100,
    gradientColor: 'emerald', // Green for wellness/health

    // Enterprise: Hero background image (using new body-conditioning category image)
    heroImage: {
      basePath: '/images/categories/img/body-conditioning',
      alt: "Bailarinas realizando ejercicios de acondicionamiento físico y preparación corporal en Barcelona - Entrenamiento funcional para danza en Farray's Center",
      altKey: 'styleImages.bodyConditioning.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'] as const,
    },
    heroVisuals: {
      imageOpacity: 45,
      objectPosition: 'center 40%',
      gradientStyle: 'dark' as const,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // Enterprise OptimizedImage config (AVIF/WebP/JPG, 6 breakpoints for high-res displays)
    optimizedImage: {
      basePath: '/images/categories/img/body-conditioning',
      alt: 'Grupo de bailarines entrenando fuerza, core y resistencia con ejercicios de acondicionamiento físico en academia de danza de Barcelona',
      altKey: 'styleImages.bodyConditioning.whatIs',
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
    keyPrefix: 'cuerpofit',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'cuerpofitCulturalHistoryTitle',
    shortDescKey: 'cuerpofitCulturalShort',
    fullHistoryKey: 'cuerpofitCulturalFull',
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
    teachesKey: 'schema_cuerpofit_teaches',
    prerequisitesKey: 'schema_cuerpofit_prerequisites',
    lessonsKey: 'schema_cuerpofit_lessons',
    duration: 'PT1H',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Cris Ag',
      jobTitleKey: 'schema_cuerpofit_cris_jobTitle',
      descriptionKey: 'schema_cuerpofit_cris_description',
      knowsAbout: [
        'Body Conditioning',
        'Fuerza Funcional',
        'Flexibilidad',
        'Movilidad Articular',
        'Método Farray',
        'Prevención de Lesiones',
      ],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Body Conditioning -> Stretching, Bum Bum, Full Body Cardio (fitness complementario)
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'stretching-barcelona',
        nameKey: 'relatedStretchingName',
        descriptionKey: 'relatedStretchingDesc',
      },
      {
        slug: 'ejercicios-gluteos-barcelona',
        nameKey: 'relatedBumBumName',
        descriptionKey: 'relatedBumBumDesc',
      },
      {
        slug: 'cuerpo-fit',
        nameKey: 'relatedFullBodyCardioName',
        descriptionKey: 'relatedFullBodyCardioDesc',
      },
    ],
  },
};
