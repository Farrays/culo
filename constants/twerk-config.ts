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
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const TWERK_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'twerk',
  stylePath: 'twerk-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: TWERK_FAQS_CONFIG,
  testimonials: TWERK_TESTIMONIALS,
  scheduleKeys: TWERK_SCHEDULE_KEYS,

  // Teachers (using enterprise centralized system)
  // Specialty: contextual from twerk.teacher.*.specialty
  // Bio: canonical from teacher.*.bio (source of truth)
  teachers: [
    getTeacherForClass('sandra-gomez', 'twerk', ['Twerk', 'Dancehall']),
    getTeacherForClass('isabel-lopez', 'twerk', ['Twerk', 'Urban']),
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
    gradientColor: 'rose',

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/twerk/img/clases-twerk-barcelona',
      alt: "Clases de Twerk en Barcelona - Farray's Center",
      altKey: 'styleImages.twerk.hero',
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
    placeholderCount: 0,
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

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'general',
    limit: 6,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teachesKey: 'schema_twerk_teaches',
    prerequisitesKey: 'schema_twerk_prerequisites',
    lessonsKey: 'schema_twerk_lessons',
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
      jobTitleKey: 'schema_twerk_sandra_jobTitle',
      descriptionKey: 'schema_twerk_sandra_description',
      knowsAbout: ['Twerk', 'Dancehall', 'Urban Dance', 'Choreography'],
    },
    {
      name: 'Isabel López',
      jobTitleKey: 'schema_twerk_isabel_jobTitle',
      descriptionKey: 'schema_twerk_isabel_description',
      knowsAbout: ['Twerk', 'Dancehall', 'Urban Dance', 'Jamaican Dance'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Twerk -> Dancehall, Sexy Reggaeton, Bum Bum
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'dancehall-barcelona',
        nameKey: 'relatedDancehallName',
        descriptionKey: 'relatedDancehallDesc',
      },
      {
        slug: 'sexy-reggaeton-barcelona',
        nameKey: 'relatedSexyReggaetonName',
        descriptionKey: 'relatedSexyReggaetonDesc',
      },
      {
        slug: 'ejercicios-gluteos-barcelona',
        nameKey: 'relatedBumBumName',
        descriptionKey: 'relatedBumBumDesc',
      },
    ],
  },
};
