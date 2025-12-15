/**
 * Twerk Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  TWERK_TESTIMONIALS,
  TWERK_FAQS_CONFIG,
  TWERK_SCHEDULE_KEYS,
  TWERK_LEVELS,
  TWERK_PREPARE_CONFIG,
} from './twerk';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const TWERK_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'twerk',
  stylePath: 'twerk-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: TWERK_FAQS_CONFIG,
  testimonials: TWERK_TESTIMONIALS,
  scheduleKeys: TWERK_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Sandra Gómez',
      specialtyKey: 'twerkTeacher1Specialty',
      bioKey: 'twerkTeacher1Bio',
      image: '/images/teachers/img/profesora-twerk-dancehall-sandra-gomez_320.webp',
    },
    {
      name: 'Isabel López',
      specialtyKey: 'twerkTeacher2Specialty',
      bioKey: 'twerkTeacher2Bio',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Urban > Twerk)
  breadcrumbConfig: {
    homeKey: 'twerkBreadcrumbHome',
    classesKey: 'twerkBreadcrumbClasses',
    categoryKey: 'twerkBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'twerkBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: TWERK_LEVELS,
  prepareConfig: TWERK_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'primary',
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/classes/twerk/img/clases-twerk-barcelona_960.webp',
      srcSet:
        '/images/classes/twerk/img/clases-twerk-barcelona_480.webp 480w, /images/classes/twerk/img/clases-twerk-barcelona_960.webp 960w',
      alt: 'Clases de Twerk en Barcelona - Estudiantes bailando en la academia',
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
        videoId: '7QCgHDiGHg8',
        title: "Twerk Classes at Farray's Center Barcelona",
      },
    ],
    placeholderCount: 2,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'twerk',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'twerkCulturalHistoryTitle',
    shortDescKey: 'twerkCulturalShort',
    fullHistoryKey: 'twerkCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Twerk, técnica de danza, musicalidad',
    prerequisites: 'Ninguno',
    lessons: '4 clases semanales',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'twerkVideoTitle',
    descKey: 'twerkVideoDesc',
    thumbnailUrl: 'https://img.youtube.com/vi/7QCgHDiGHg8/maxresdefault.jpg',
    videoId: '7QCgHDiGHg8',
  },

  personSchemas: [
    {
      name: 'Sandra Gómez',
      jobTitle: 'Instructora de Twerk',
      description:
        'Especialista en Twerk y Dancehall con amplia experiencia en la enseñanza de danza urbana.',
      knowsAbout: ['Twerk', 'Dancehall', 'Urban Dance', 'Choreography'],
    },
    {
      name: 'Isabel López',
      jobTitle: 'Instructora de Twerk',
      description:
        'Profesora de Twerk y estilos urbanos con experiencia en competiciones internacionales.',
      knowsAbout: ['Twerk', 'Dancehall', 'Urban Dance', 'Jamaican Dance'],
    },
  ],
};
