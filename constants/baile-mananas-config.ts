/**
 * Clases de Baile por las Mañanas en Barcelona - Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete morning dance classes landing page.
 *
 * SEO Keywords:
 * - clases de baile por las mañanas en barcelona
 * - clases baile mañanas barcelona
 * - escuela baile horario mañana
 * - academia baile turnos mañana
 * - baile matinal barcelona
 */
import {
  BAILE_MANANAS_TESTIMONIALS,
  BAILE_MANANAS_FAQS_CONFIG,
  BAILE_MANANAS_SCHEDULE_KEYS,
  BAILE_MANANAS_LEVELS,
  BAILE_MANANAS_PREPARE_CONFIG,
} from './baile-mananas';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const BAILE_MANANAS_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'bailemanananas',
  stylePath: 'baile-mananas',

  // === SCHEDULE MODE ===
  // "Baile Mañanas" is a time-based aggregation of multiple styles (Contemporáneo,
  // Ballet, Sexy Reggaeton, etc.) - no single Momence style filter applies.
  // Instead, fetch ALL sessions and filter by morning hours (10:00–14:00).
  momenceStyle: '', // Empty = no style filter (fetch all styles)
  scheduleStartHour: 10, // From 10:00
  scheduleEndHour: 14, // Until 14:00 (exclusive)

  // === REQUIRED DATA ===
  faqsConfig: BAILE_MANANAS_FAQS_CONFIG,
  testimonials: BAILE_MANANAS_TESTIMONIALS,
  scheduleKeys: BAILE_MANANAS_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [
    getTeacherForClass('alejandro-minoso', 'baileMananas', ['ENA Cuba', 'Ballet']),
    getTeacherForClass('yasmina-fernandez', 'baileMananas', ['Salsa Cubana', 'Lady Style']),
    getTeacherForClass('isabel-lopez', 'baileMananas', ['Dancehall', 'Twerk']),
  ],

  // Breadcrumb (4 levels: Home > Clases > Baile Barcelona > Clases de Mañanas)
  breadcrumbConfig: {
    homeKey: 'bailemanananasBreadcrumbHome',
    classesKey: 'bailemanananasBreadcrumbClasses',
    categoryKey: 'bailemanananasBreadcrumbCategory',
    categoryUrl: '/clases/baile-barcelona',
    currentKey: 'bailemanananasBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: BAILE_MANANAS_LEVELS,
  prepareConfig: BAILE_MANANAS_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 350,
    funPercent: 100, // Will be overridden with custom stat
    gradientColor: 'amber', // Warm, energetic, morning color
    // Enterprise: Hero background image (nueva foto 2025)
    heroImage: {
      basePath: '/images/classes/baile-mananas/img/clases-baile-mananas-hero-barcelona',
      alt: "Clases de baile por las mañanas en Barcelona - Grupo de alumnos bailando en Farray's Center",
      altKey: 'styleImages.baileMananas.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'],
    },
    // Enterprise: Hero Visual Configuration
    heroVisuals: {
      imageOpacity: 45,
      objectPosition: 'center 35%',
      gradientStyle: 'vibrant',
      textShadow: true,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // Enterprise: Optimized responsive image with AVIF/WebP/JPG formats
    image: {
      src: '/images/classes/baile-mananas/img/clases-baile-mananas-hero-barcelona_1024.webp',
      srcSet:
        '/images/classes/baile-mananas/img/clases-baile-mananas-hero-barcelona_320.avif 320w, /images/classes/baile-mananas/img/clases-baile-mananas-hero-barcelona_640.avif 640w, /images/classes/baile-mananas/img/clases-baile-mananas-hero-barcelona_768.avif 768w, /images/classes/baile-mananas/img/clases-baile-mananas-hero-barcelona_1024.avif 1024w',
      alt: 'Alumnas practicando coreografía en clase de baile por las mañanas en academia de Barcelona - Variedad de estilos en horario matinal',
    },
  },

  identificationSection: {
    enabled: true,
    itemCount: 6, // 6 puntos de dolor
    hasTransition: true,
    hasNeedEnroll: true,
  },

  transformationSection: {
    enabled: true,
    itemCount: 6, // 6 beneficios
  },

  whyChooseSection: {
    enabled: true,
    itemOrder: [2, 3, 4, 5, 6, 7],
  },

  whyTodaySection: {
    enabled: true,
    paragraphCount: 3,
  },

  // Why Us vs Others Comparison Table - DISABLED (not applicable)
  whyUsComparison: {
    enabled: false,
    rowCount: 0,
    meaningCount: 0,
    showCTA: false,
  },

  videoSection: {
    enabled: true, // Shows "Video Próximamente" placeholder
  },

  logosSection: {
    enabled: true,
    // Uses default logos (UNESCO, Street Dance 2, The Dancer, Telecinco)
  },

  testimonialsSection: {
    enabled: true,
    position: 'after-why-choose', // Show testimonials earlier, after Why Choose section
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'bailemanananas',
  },

  // Cultural History - DISABLED (not a dance style, it's a schedule-based landing)
  culturalHistory: {
    enabled: false,
    titleKey: '',
    shortDescKey: '',
    fullHistoryKey: '',
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
    teachesKey: 'schema_bailemananas_teaches',
    prerequisitesKey: 'schema_bailemananas_prerequisites',
    lessonsKey: 'schema_bailemananas_lessons',
    duration: 'PT1H',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Alejandro Miñoso',
      jobTitleKey: 'schema_bailemananas_alejandro_jobTitle',
      descriptionKey: 'schema_bailemananas_alejandro_description',
      knowsAbout: [
        'Danza Contemporánea',
        'Ballet Clásico',
        'Modern Jazz',
        'Afro Jazz',
        'Body Conditioning',
        'Stretching',
        'Floor Work',
        'Técnica Clásica',
      ],
    },
    {
      name: 'Yasmina Fernández',
      jobTitleKey: 'schema_bailemananas_yasmina_jobTitle',
      descriptionKey: 'schema_bailemananas_yasmina_description',
      knowsAbout: [
        'Sexy Style',
        'Sexy Reggaeton',
        'Salsa Lady Style',
        'Reggaeton Cubano',
        'Baile Sensual',
        'Empoderamiento Femenino',
        'Método Farray',
      ],
    },
    {
      name: 'Isabel López',
      jobTitleKey: 'schema_bailemananas_isabel_jobTitle',
      descriptionKey: 'schema_bailemananas_isabel_description',
      knowsAbout: [
        'Dancehall Female',
        'Twerk',
        'Dancehall',
        'Baile Urbano',
        'Ritmos Caribeños',
        'Empoderamiento Femenino',
        'Expresión Corporal',
      ],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Baile Mañanas -> Stretching, Ballet, Contemporáneo (clases matinales complementarias)
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'stretching-barcelona',
        nameKey: 'relatedStretchingName',
        descriptionKey: 'relatedStretchingDesc',
      },
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
    ],
  },
};
