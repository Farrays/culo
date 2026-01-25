/**
 * Contemporáneo Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  CONTEMPORANEO_TESTIMONIALS,
  CONTEMPORANEO_FAQS_CONFIG,
  CONTEMPORANEO_SCHEDULE_KEYS,
  CONTEMPORANEO_LEVELS,
  CONTEMPORANEO_PREPARE_CONFIG,
  CONTEMPORANEO_NEARBY_AREAS,
} from './contemporaneo';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const CONTEMPORANEO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'contemporaneo',
  stylePath: 'contemporaneo-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: CONTEMPORANEO_FAQS_CONFIG,
  testimonials: CONTEMPORANEO_TESTIMONIALS,
  scheduleKeys: CONTEMPORANEO_SCHEDULE_KEYS,

  // Teachers (sistema centralizado de profesores)
  teachers: [
    getTeacherForClass('daniel-sene', 'contemporaneo', ['Contemporáneo', 'ENA Cuba']),
    getTeacherForClass('alejandro-minoso', 'contemporaneo', ['Contemporáneo', 'Suelo & Flow']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Dance > Contemporáneo)
  breadcrumbConfig: {
    homeKey: 'contemporaneoBreadcrumbHome',
    classesKey: 'contemporaneoBreadcrumbClasses',
    categoryKey: 'contemporaneoBreadcrumbUrban',
    categoryUrl: '/clases/danza-barcelona',
    currentKey: 'contemporaneoBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: CONTEMPORANEO_LEVELS,
  prepareConfig: CONTEMPORANEO_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'emerald',
    // Enterprise: Hero background image with OptimizedImage multi-format srcset
    heroImage: {
      basePath: '/images/classes/contemporaneo/img/mgs_5189',
      alt: "Clase de Danza Contemporánea en Barcelona - Bailarines en movimiento fluido y expresivo en Farray's Center",
      altKey: 'styleImages.contemporaneo.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'],
    },
    // Enterprise: Hero Visual Configuration - optimized for artistic contemporary dance
    heroVisuals: {
      imageOpacity: 50, // Balanced visibility for elegant, fluid dance movement
      objectPosition: 'center 40%', // Focus on dancers' full body expression and lines
      gradientStyle: 'subtle', // Soft gradient for artistic, refined aesthetic
      textShadow: true, // Enhanced text contrast against dance imagery
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // Enterprise: OptimizedImage with multi-format srcset and i18n alt
    optimizedImage: {
      basePath: '/images/classes/contemporaneo/img/mgs_5189',
      alt: 'Clases de Danza Contemporánea en Barcelona', // Fallback
      altKey: 'styleImages.contemporaneo.hero', // i18n key for localized alt
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
    keyPrefix: 'contemporaneo',
    areas: CONTEMPORANEO_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'contemporaneoCulturalHistoryTitle',
    shortDescKey: 'contemporaneoCulturalShort',
    fullHistoryKey: 'contemporaneoCulturalFull',
  },

  // === ARTISTIC DANCE COMPARISON TABLE ===
  artisticDanceComparison: {
    enabled: true,
    highlightedStyle: 'contemporaneo',
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
    teachesKey: 'schema_contemporaneo_teaches',
    prerequisitesKey: 'schema_contemporaneo_prerequisites',
    lessonsKey: 'schema_contemporaneo_lessons',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Daniel Sené',
      jobTitleKey: 'schema_contemporaneo_daniel_jobTitle',
      descriptionKey: 'schema_contemporaneo_daniel_description',
      knowsAbout: ['Danza Contemporánea', 'Release Technique', 'Floor Work', 'Cuban Dance'],
    },
    {
      name: 'Alejandro Miñoso',
      jobTitleKey: 'schema_contemporaneo_alejandro_jobTitle',
      descriptionKey: 'schema_contemporaneo_alejandro_description',
      knowsAbout: ['Danza Contemporánea', 'Suelo & Flow', 'Cuban Technique'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Contemporáneo -> Ballet, Afro Contemporáneo, Modern Jazz
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'ballet-barcelona',
        nameKey: 'relatedBalletName',
        descriptionKey: 'relatedBalletDesc',
      },
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
    ],
  },
};
