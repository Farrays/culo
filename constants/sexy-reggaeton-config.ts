/**
 * Sexy Reggaeton Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  SEXY_REGGAETON_TESTIMONIALS,
  SEXY_REGGAETON_FAQS_CONFIG,
  SEXY_REGGAETON_SCHEDULE_KEYS,
  SEXY_REGGAETON_LEVELS,
  SEXY_REGGAETON_PREPARE_CONFIG,
  SEXY_REGGAETON_VIDEO_ID,
} from './sexy-reggaeton';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const SEXY_REGGAETON_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'sxr',
  stylePath: 'sexy-reggaeton-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: SEXY_REGGAETON_FAQS_CONFIG,
  testimonials: SEXY_REGGAETON_TESTIMONIALS,
  scheduleKeys: SEXY_REGGAETON_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Yasmina Fernández',
      specialtyKey: 'sxrTeacher1Specialty',
      bioKey: 'sxrTeacher1Bio',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Urban > Sexy Reggaeton)
  breadcrumbConfig: {
    homeKey: 'sxrBreadcrumbHome',
    classesKey: 'sxrBreadcrumbClasses',
    categoryKey: 'sxrBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'sxrBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: SEXY_REGGAETON_LEVELS,
  prepareConfig: SEXY_REGGAETON_PREPARE_CONFIG,

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
      src: '/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.webp',
      srcSet:
        '/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_480.webp 480w, /images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.webp 960w',
      alt: 'Clases de Sexy Reggaeton en Barcelona',
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
        videoId: SEXY_REGGAETON_VIDEO_ID,
        title: "Sexy Reggaeton Classes at Farray's Center Barcelona",
      },
    ],
    placeholderCount: 2,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'sxr',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'sxrCulturalHistoryTitle',
    shortDescKey: 'sxrCulturalShort',
    fullHistoryKey: 'sxrCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Sexy Reggaeton, perreo, body roll, sensualidad, disociación corporal',
    prerequisites: 'Ninguno',
    lessons: '6 clases semanales',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'sxrVideoTitle',
    descKey: 'sxrVideoDesc',
    thumbnailUrl: `https://img.youtube.com/vi/${SEXY_REGGAETON_VIDEO_ID}/maxresdefault.jpg`,
    videoId: SEXY_REGGAETON_VIDEO_ID,
  },

  personSchemas: [
    {
      name: 'Yasmina Fernández',
      jobTitle: 'Instructora de Sexy Reggaeton',
      description: 'Especialista en Sexy Reggaeton y estilos sensuales con amplia experiencia.',
      knowsAbout: ['Sexy Reggaeton', 'Perreo', 'Sensual Dance', 'Urban Dance'],
    },
  ],
};
