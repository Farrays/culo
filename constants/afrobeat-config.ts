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
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const AFROBEAT_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'afro',
  stylePath: 'afrobeats-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: AFROBEAT_FAQS_CONFIG,
  testimonials: AFROBEAT_TESTIMONIALS,
  scheduleKeys: AFROBEAT_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Redblueh',
      specialtyKey: 'afroTeacher1Specialty',
      bioKey: 'afroTeacher1Bio',
      image: '/images/teachers/img/profesor-afrobeats-redblueh_320.webp',
    },
    {
      name: 'Charlie Breezy',
      specialtyKey: 'afroTeacher2Specialty',
      bioKey: 'afroTeacher2Bio',
      image: '/images/teachers/img/profesor-hip-hop-charlie-breezy_320.webp',
    },
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
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/classes/afrobeats/img/clases-afrobeats-barcelona_960.webp',
      srcSet:
        '/images/classes/afrobeats/img/clases-afrobeats-barcelona_480.webp 480w, /images/classes/afrobeats/img/clases-afrobeats-barcelona_960.webp 960w',
      alt: 'Clases de Afrobeats en Barcelona - Estudiantes bailando en la academia',
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
};
