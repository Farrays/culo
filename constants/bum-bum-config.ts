/**
 * Bum Bum Glúteos Maravillosos Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete Bum Bum / Ejercicios de Glúteos page.
 *
 * SEO Keywords:
 * - ejercicios de glúteos
 * - ejercicios gluteos barcelona
 * - tonificar glúteos
 * - aumentar glúteos
 * - glúteos firmes
 * - hip thrust
 * - clases de glúteos barcelona
 */
import {
  BUM_BUM_TESTIMONIALS,
  BUM_BUM_FAQS_CONFIG,
  BUM_BUM_SCHEDULE_KEYS,
  BUM_BUM_LEVELS,
  BUM_BUM_PREPARE_CONFIG,
} from './bum-bum';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const BUM_BUM_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'bumbum',
  stylePath: 'ejercicios-gluteos-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: BUM_BUM_FAQS_CONFIG,
  testimonials: BUM_BUM_TESTIMONIALS,
  scheduleKeys: BUM_BUM_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [getTeacherForClass('cris-ag', 'bumBum', ['Bum Bum', 'Fitness'])],

  // Breadcrumb (4 levels: Home > Classes > Prep Física > Bum Bum)
  breadcrumbConfig: {
    homeKey: 'bumbumBreadcrumbHome',
    classesKey: 'bumbumBreadcrumbClasses',
    categoryKey: 'bumbumBreadcrumbCategory',
    categoryUrl: '/clases/entrenamiento-bailarines-barcelona',
    currentKey: 'bumbumBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: BUM_BUM_LEVELS,
  prepareConfig: BUM_BUM_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 350,
    funPercent: 100,
    gradientColor: 'rose', // Pink/rose for fitness/body sculpting

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/bum-bum/img/bum-bum',
      alt: 'Alumnas realizando ejercicios de glúteos Bum Bum en Barcelona - Método Farray con hip thrust y sentadillas',
      altKey: 'styleImages.bumBum.hero',
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
      basePath: '/images/classes/bum-bum/img/bum-bum-gluteos',
      alt: 'Grupo de alumnas tonificando glúteos con ejercicios Bum Bum en academia de Barcelona',
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
    enabled: false, // No video yet
    videos: [],
    placeholderCount: 0,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'bumbum',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'bumbumCulturalHistoryTitle',
    shortDescKey: 'bumbumCulturalShort',
    fullHistoryKey: 'bumbumCulturalFull',
  },

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'fitness',
    limit: 4,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches:
      'Ejercicios de glúteos, hip thrust, sentadillas, puente de glúteos, tonificación muscular, fortalecimiento tren inferior, técnicas de danza',
    prerequisites: 'Ninguno - clase abierta para todos los niveles',
    lessons: '1 clase semanal',
    duration: 'PT1H',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Cris Ag',
      jobTitle: 'Instructora de Bum Bum Glúteos Maravillosos',
      description:
        'Especialista en tonificación corporal y ejercicios de glúteos con el Método Farray. Experta en hip thrust, sentadillas y técnicas de fortalecimiento del tren inferior.',
      knowsAbout: [
        'Ejercicios de glúteos',
        'Hip Thrust',
        'Tonificación muscular',
        'Método Farray',
        'Fitness',
      ],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Bum Bum -> Cuerpo Fit, Sexy Style, Twerk (complementos fitness + sensualidad)
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'cuerpo-fit',
        nameKey: 'relatedFullBodyCardioName',
        descriptionKey: 'relatedFullBodyCardioDesc',
      },
      {
        slug: 'sexy-style-barcelona',
        nameKey: 'relatedSexyStyleName',
        descriptionKey: 'relatedSexyStyleDesc',
      },
      {
        slug: 'twerk-barcelona',
        nameKey: 'relatedTwerkName',
        descriptionKey: 'relatedTwerkDesc',
      },
    ],
  },
};
