/**
 * Stretching Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete Stretching/Estiramientos page.
 *
 * SEO Keywords:
 * - stretching en barcelona
 * - estiramientos en barcelona
 * - clases de estiramientos
 * - clases de estiramientos en barcelona
 * - flexi
 * - flexibilidad
 * - backbending
 */
import {
  STRETCHING_TESTIMONIALS,
  STRETCHING_FAQS_CONFIG,
  STRETCHING_SCHEDULE_KEYS,
  STRETCHING_LEVELS,
  STRETCHING_PREPARE_CONFIG,
} from './stretching';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const STRETCHING_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'stretching',
  stylePath: 'stretching-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: STRETCHING_FAQS_CONFIG,
  testimonials: STRETCHING_TESTIMONIALS,
  scheduleKeys: STRETCHING_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [
    getTeacherForClass('cris-ag', 'stretching', ['Stretching', 'Backbending']),
    getTeacherForClass('daniel-sene', 'stretching', ['Stretching', 'Ballet']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Prep Física > Stretching)
  breadcrumbConfig: {
    homeKey: 'stretchingBreadcrumbHome',
    classesKey: 'stretchingBreadcrumbClasses',
    categoryKey: 'stretchingBreadcrumbCategory',
    categoryUrl: '/clases/entrenamiento-bailarines-barcelona',
    currentKey: 'stretchingBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: STRETCHING_LEVELS,
  prepareConfig: STRETCHING_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 200,
    funPercent: 100,
    gradientColor: 'emerald', // Green for wellness/flexibility

    // Enterprise: Hero background image (dedicated stretching image)
    heroImage: {
      basePath: '/images/categories/img/stretching',
      alt: "Bailarina realizando estiramientos y flexibilidad en clase de stretching Barcelona - Farray's Center",
      altKey: 'styleImages.stretching.hero',
      breakpoints: [320, 640, 768, 1024],
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
    optimizedImage: {
      basePath: '/images/categories/img/stretching',
      alt: 'Clase de stretching y flexibilidad para bailarines en Barcelona - estiramientos profesionales y técnicas de elongación',
      altKey: 'styleImages.stretching.whatIs',
      breakpoints: [320, 640, 768, 1024],
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
    keyPrefix: 'stretching',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'stretchingCulturalHistoryTitle',
    shortDescKey: 'stretchingCulturalShort',
    fullHistoryKey: 'stretchingCulturalFull',
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
    teachesKey: 'schema_stretching_teaches',
    prerequisitesKey: 'schema_stretching_prerequisites',
    lessonsKey: 'schema_stretching_lessons',
    duration: 'PT1H',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Cris Ag',
      jobTitleKey: 'schema_stretching_cris_jobTitle',
      descriptionKey: 'schema_stretching_cris_description',
      knowsAbout: [
        'Stretching',
        'Backbending',
        'Flexibility',
        'Core Strengthening',
        'Método Farray',
      ],
    },
    {
      name: 'Daniel Sené',
      jobTitleKey: 'schema_stretching_daniel_jobTitle',
      descriptionKey: 'schema_stretching_daniel_description',
      knowsAbout: ['Stretching', 'Ballet', 'Classical Technique', 'Flexibility', 'Posture'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Stretching -> Ballet, Contemporáneo, Modern Jazz (preparación física ideal)
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'ballet-barcelona',
        nameKey: 'relatedBalletName',
        descriptionKey: 'relatedBalletDesc',
      },
      {
        slug: 'contemporaneo-barcelona',
        nameKey: 'relatedContemporaneoName',
        descriptionKey: 'relatedContemporaneoDesc',
      },
      {
        slug: 'modern-jazz-barcelona',
        nameKey: 'relatedModernJazzName',
        descriptionKey: 'relatedModernJazzDesc',
      },
    ],
  },
};
