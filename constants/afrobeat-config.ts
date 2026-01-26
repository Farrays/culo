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
import { getTeacherForClass } from './teacher-registry';
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
    getTeacherForClass('redblueh', 'afro', ['Afrobeats', 'Afro Dance']),
    getTeacherForClass('charlie-breezy', 'afro', ['Afro', 'Urban']),
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
    // Bunny Stream video (appears first, before YouTube)
    bunnyVideo: {
      videoId: '44f53623-e523-4f22-a19d-dffff0cc26c0',
      libraryId: '571535',
      title: "Clases de Afrobeats en Barcelona - Farray's Center",
      aspectRatio: '9:16',
      thumbnailUrl:
        'https://vz-3d56a778-175.b-cdn.net/44f53623-e523-4f22-a19d-dffff0cc26c0/thumbnail_7f0a80d5.jpg',
    },
    // YouTube videos (appear after Bunny video)
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

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'general',
    limit: 6,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teachesKey: 'schema_afrobeat_teaches',
    prerequisitesKey: 'schema_afrobeat_prerequisites',
    lessonsKey: 'schema_afrobeat_lessons',
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
      jobTitleKey: 'schema_afrobeat_redblueh_jobTitle',
      descriptionKey: 'schema_afrobeat_redblueh_description',
      knowsAbout: ['Afrobeats', 'Afrodance', 'Amapiano', 'African Dance'],
    },
    {
      name: 'Charlie Breezy',
      jobTitleKey: 'schema_afrobeat_charlie_jobTitle',
      descriptionKey: 'schema_afrobeat_charlie_description',
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
