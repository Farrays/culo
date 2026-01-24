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
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const MODERN_JAZZ_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'modernjazz',
  stylePath: 'modern-jazz-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: MODERN_JAZZ_FAQS_CONFIG,
  testimonials: MODERN_JAZZ_TESTIMONIALS,
  scheduleKeys: MODERN_JAZZ_SCHEDULE_KEYS,

  // Teachers (sistema centralizado de profesores)
  teachers: [getTeacherForClass('alejandro-minoso', 'modernjazz', ['Modern Jazz', 'ENA Cuba'])],

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

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/modern-jazz/img/clases-modern-jazz-barcelona',
      alt: "Clases de Modern Jazz en Barcelona - Farray's Center",
      altKey: 'styleImages.modernJazz.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'] as const,
    },
    heroVisuals: {
      imageOpacity: 45,
      objectPosition: 'center 25%',
      gradientStyle: 'dark' as const,
    },
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
    enabled: true, // Shows "Video Próximamente" placeholder
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

  // === ARTISTIC DANCE COMPARISON TABLE ===
  artisticDanceComparison: {
    enabled: true,
    highlightedStyle: 'modernjazz',
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
    teachesKey: 'schema_modernjazz_teaches',
    prerequisitesKey: 'schema_modernjazz_prerequisites',
    lessonsKey: 'schema_modernjazz_lessons',
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
      jobTitleKey: 'schema_modernjazz_alejandro_jobTitle',
      descriptionKey: 'schema_modernjazz_alejandro_description',
      knowsAbout: ['Modern Jazz', 'Jazz Dance', 'Ballet', 'Cuban Technique'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Modern Jazz -> Contemporáneo, Ballet, Afro Jazz
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'contemporaneo-barcelona',
        nameKey: 'relatedContemporaneoName',
        descriptionKey: 'relatedContemporaneoDesc',
      },
      {
        slug: 'ballet-barcelona',
        nameKey: 'relatedBalletName',
        descriptionKey: 'relatedBalletDesc',
      },
      {
        slug: 'afro-jazz-barcelona',
        nameKey: 'relatedAfroJazzName',
        descriptionKey: 'relatedAfroJazzDesc',
      },
    ],
  },
};
