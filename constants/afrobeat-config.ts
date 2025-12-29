/**
 * Afrobeat Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  AFROBEAT_TESTIMONIALS,
  AFROBEAT_FAQS_CONFIG,
  AFROBEAT_SCHEDULE_KEYS,
  AFROBEAT_LEVELS,
  AFROBEAT_PREPARE_CONFIG,
} from './afrobeat';
import { getTeacherInfo } from './teacher-images';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const AFROBEAT_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'afro',
  stylePath: 'afrobeats-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: AFROBEAT_FAQS_CONFIG,
  testimonials: AFROBEAT_TESTIMONIALS,
  scheduleKeys: AFROBEAT_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [
    getTeacherInfo('redbhlue', 'afroTeacher1Specialty', 'afroTeacher1Bio', [
      'Afrobeats',
      'Afro Dance',
    ]),
    getTeacherInfo('charlie-breezy', 'afroTeacher2Specialty', 'afroTeacher2Bio', ['Afro', 'Urban']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Urban > Afrobeat)
  breadcrumbConfig: {
    homeKey: 'afroBreadcrumbHome',
    classesKey: 'afroBreadcrumbClasses',
    categoryKey: 'afroBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'afroBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: AFROBEAT_LEVELS,
  prepareConfig: AFROBEAT_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'rose',

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/afrobeat/img/clases-afrobeat-barcelona',
      alt: "Clases de Afrobeat en Barcelona - Farray's Center",
      altKey: 'styleImages.afrobeat.hero',
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
      basePath: '/images/classes/afrobeat/img/clases-afrobeat-barcelona',
      alt: 'Clases de Afrobeats en Barcelona - Estudiantes bailando en la academia',
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
    enabled: true,
    videos: [
      {
        videoId: '8ztKfzywfbA',
        title: "Afrobeats Classes at Farray's Center Barcelona",
      },
    ],
    placeholderCount: 0,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'afro',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'afroCulturalTitle',
    shortDescKey: 'afroCulturalShort',
    fullHistoryKey: 'afroCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Afrobeats, Afrodance, Amapiano, Ntcham, técnica de danza africana',
    prerequisites: 'Ninguno',
    lessons: '2 clases semanales',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'afroVideoTitle',
    descKey: 'afroVideoDesc',
    thumbnailUrl: 'https://img.youtube.com/vi/8ztKfzywfbA/maxresdefault.jpg',
    videoId: '8ztKfzywfbA',
  },

  personSchemas: [
    {
      name: 'Redblueh',
      jobTitle: 'Instructor de Afrobeats',
      description: 'Especialista en Afrobeats con raíces africanas y experiencia internacional.',
      knowsAbout: ['Afrobeats', 'Afrodance', 'Amapiano', 'African Dance'],
    },
    {
      name: 'Charlie Breezy',
      jobTitle: 'Instructor de Afrobeats',
      description: 'Profesor de danzas urbanas y afrobeats con experiencia en múltiples estilos.',
      knowsAbout: ['Afrobeats', 'Hip Hop', 'Reggaeton', 'Urban Dance'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Afrobeats -> Dancehall, Afro Contemporáneo, Hip Hop Reggaeton
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'dancehall-barcelona',
        nameKey: 'relatedDancehallName',
        descriptionKey: 'relatedDancehallDesc',
      },
      {
        slug: 'afro-contemporaneo-barcelona',
        nameKey: 'relatedAfroContemporaneoName',
        descriptionKey: 'relatedAfroContemporaneoDesc',
      },
      {
        slug: 'hip-hop-reggaeton-barcelona',
        nameKey: 'relatedHipHopReggaetonName',
        descriptionKey: 'relatedHipHopReggaetonDesc',
      },
    ],
  },
};
