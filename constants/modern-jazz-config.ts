/**
 * Modern Jazz Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  MODERN_JAZZ_TESTIMONIALS,
  MODERN_JAZZ_FAQS_CONFIG,
  MODERN_JAZZ_SCHEDULE_KEYS,
  MODERN_JAZZ_LEVELS,
  MODERN_JAZZ_PREPARE_CONFIG,
  MODERN_JAZZ_NEARBY_AREAS,
  MODERN_JAZZ_VIDEO_ID,
} from './modern-jazz';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const MODERN_JAZZ_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'modernjazz',
  stylePath: 'modern-jazz-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: MODERN_JAZZ_FAQS_CONFIG,
  testimonials: MODERN_JAZZ_TESTIMONIALS,
  scheduleKeys: MODERN_JAZZ_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Alejandro Miñoso',
      specialtyKey: 'modernjazzTeacher1Specialty',
      bioKey: 'modernjazzTeacher1Bio',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Dance > Modern Jazz)
  breadcrumbConfig: {
    homeKey: 'modernjazzBreadcrumbHome',
    classesKey: 'modernjazzBreadcrumbClasses',
    categoryKey: 'modernjazzBreadcrumbDance',
    categoryUrl: '/clases/danza-barcelona',
    currentKey: 'modernjazzBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: MODERN_JAZZ_LEVELS,
  prepareConfig: MODERN_JAZZ_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'emerald',
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/classes/modern-jazz/img/clases-modern-jazz-barcelona_960.webp',
      srcSet:
        '/images/classes/modern-jazz/img/clases-modern-jazz-barcelona_480.webp 480w, /images/classes/modern-jazz/img/clases-modern-jazz-barcelona_960.webp 960w',
      alt: 'Clases de Modern Jazz en Barcelona',
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
        videoId: MODERN_JAZZ_VIDEO_ID,
        title: "Modern Jazz Classes at Farray's Center Barcelona",
      },
    ],
    placeholderCount: 2,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'modernjazz',
    areas: MODERN_JAZZ_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'modernjazzCulturalHistoryTitle',
    shortDescKey: 'modernjazzCulturalShort',
    fullHistoryKey: 'modernjazzCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Modern Jazz, técnica de danza, musicalidad, expresión corporal, giros, saltos',
    prerequisites: 'Ninguno',
    lessons: '1 clase semanal',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'modernjazzVideoTitle',
    descKey: 'modernjazzVideoDesc',
    thumbnailUrl: `https://img.youtube.com/vi/${MODERN_JAZZ_VIDEO_ID}/maxresdefault.jpg`,
    videoId: MODERN_JAZZ_VIDEO_ID,
  },

  personSchemas: [
    {
      name: 'Alejandro Miñoso',
      jobTitle: 'Profesor de Modern Jazz',
      description:
        'Bailarín profesional cubano con formación en la ENA, especialista en Modern Jazz.',
      knowsAbout: ['Modern Jazz', 'Jazz Dance', 'Ballet', 'Cuban Technique'],
    },
  ],
};
