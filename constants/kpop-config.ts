/**
 * K-Pop Dance Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  KPOP_TESTIMONIALS,
  KPOP_FAQS_CONFIG,
  KPOP_SCHEDULE_KEYS,
  KPOP_LEVELS,
  // KPOP_PREPARE_CONFIG, // Uncomment when teacher is assigned
} from './kpop';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const KPOP_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'kpop',
  stylePath: 'kpop-dance-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: KPOP_FAQS_CONFIG,
  testimonials: KPOP_TESTIMONIALS,
  scheduleKeys: KPOP_SCHEDULE_KEYS,

  // Teachers (pending assignment - empty for now)
  teachers: [],

  // Breadcrumb (4 levels: Home > Classes > Urban > K-Pop)
  breadcrumbConfig: {
    homeKey: 'kpopBreadcrumbHome',
    classesKey: 'kpopBreadcrumbClasses',
    categoryKey: 'kpopBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'kpopBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: KPOP_LEVELS,
  // prepareConfig: KPOP_PREPARE_CONFIG, // Hidden until teacher is assigned

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 400,
    funPercent: 100,
    gradientColor: 'primary', // Default gradient like most classes
  },

  // Disable Momence sync until classes are scheduled
  useDynamicSchedule: false,

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // No image yet - will add when photos are available
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
    itemOrder: [1, 2, 3, 4, 5, 7], // 6 items (skipping item 6 as per user choice)
  },

  whyTodaySection: {
    enabled: true,
    paragraphCount: 3,
  },

  videoSection: {
    enabled: false, // Disabled until video is available
    videos: [],
    placeholderCount: 0,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'kpop',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'kpopCulturalHistoryTitle',
    shortDescKey: 'kpopCulturalShort',
    fullHistoryKey: 'kpopCulturalFull',
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
    teaches: 'K-Pop Dance, coreografías K-Pop, técnica de danza coreana',
    prerequisites: 'Ninguno',
    lessons: 'Próximamente',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'kpopVideoTitle',
    descKey: 'kpopVideoDesc',
    thumbnailUrl: '',
    videoId: '',
  },

  personSchemas: [], // No teachers assigned yet

  // === RELATED CLASSES (internal linking) ===
  // K-Pop -> Hip Hop, Afrobeats, Dancehall
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'hip-hop-barcelona',
        nameKey: 'relatedHipHopName',
        descriptionKey: 'relatedHipHopDesc',
      },
      {
        slug: 'afrobeats-barcelona',
        nameKey: 'relatedAfrobeatsName',
        descriptionKey: 'relatedAfrobeatsDesc',
      },
      {
        slug: 'dancehall-barcelona',
        nameKey: 'relatedDancehallName',
        descriptionKey: 'relatedDancehallDesc',
      },
    ],
  },
};
