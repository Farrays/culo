/**
 * Reggaeton Cubano Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  REGGAETON_CUBANO_TESTIMONIALS,
  REGGAETON_CUBANO_FAQS_CONFIG,
  REGGAETON_CUBANO_SCHEDULE_KEYS,
  REGGAETON_CUBANO_LEVELS,
  REGGAETON_CUBANO_PREPARE_CONFIG,
} from './reggaeton-cubano';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const REGGAETON_CUBANO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'rcb',
  stylePath: 'reggaeton-cubano-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: REGGAETON_CUBANO_FAQS_CONFIG,
  testimonials: REGGAETON_CUBANO_TESTIMONIALS,
  scheduleKeys: REGGAETON_CUBANO_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [
    getTeacherForClass('charlie-breezy', 'rcb', ['Reggaeton', 'Urban']),
    getTeacherForClass('alejandro-minoso', 'rcb', ['ENA Cuba', 'Afro']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Urban > Reggaeton Cubano)
  breadcrumbConfig: {
    homeKey: 'rcbBreadcrumbHome',
    classesKey: 'rcbBreadcrumbClasses',
    categoryKey: 'rcbBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'rcbBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: REGGAETON_CUBANO_LEVELS,
  prepareConfig: REGGAETON_CUBANO_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'rose',

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/reggaeton-cubano/img/mgs_8884',
      alt: "Clases de Reggaetón Cubano en Barcelona - Farray's Center",
      altKey: 'styleImages.reggaetonCubano.hero',
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
    optimizedImage: {
      basePath: '/images/classes/reggaeton-cubano/img/mgs_8884',
      altKey: 'styleImages.reggaetonCubano.hero',
      alt: "Clases de Reggaeton Cubano en Barcelona - Reparto y Cubatón en Farray's Center",
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
    enabled: false,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'rcb',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'rcbCulturalHistoryTitle',
    shortDescKey: 'rcbCulturalShort',
    fullHistoryKey: 'rcbCulturalFull',
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
    teaches: 'Reggaeton Cubano, Reparto, Cubatón, disociación corporal, improvisación',
    prerequisites: 'Ninguno',
    lessons: '3 clases semanales',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Charlie Breezy',
      jobTitle: 'Instructor de Reggaeton Cubano',
      description: 'Especialista en Reggaeton Cubano y estilos urbanos con raíces cubanas.',
      knowsAbout: ['Reggaeton Cubano', 'Reparto', 'Cubatón', 'Urban Dance'],
    },
    {
      name: 'Alejandro Miñoso',
      jobTitle: 'Instructor de Reggaeton Cubano',
      description: 'Bailarín profesional cubano con amplia experiencia en estilos urbanos.',
      knowsAbout: ['Reggaeton Cubano', 'Cuban Dance', 'Urban Dance'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Reggaeton Cubano -> Hip Hop Reggaeton, Salsa Cubana, Timba
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'hip-hop-reggaeton-barcelona',
        nameKey: 'relatedHipHopReggaetonName',
        descriptionKey: 'relatedHipHopReggaetonDesc',
      },
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
    ],
  },
};
