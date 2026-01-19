/**
 * Commercial Dance Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  COMMERCIAL_TESTIMONIALS,
  COMMERCIAL_FAQS_CONFIG,
  COMMERCIAL_SCHEDULE_KEYS,
  COMMERCIAL_LEVELS,
  // COMMERCIAL_PREPARE_CONFIG, // Uncomment when teacher is assigned
} from './commercial';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const COMMERCIAL_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'commercial',
  stylePath: 'commercial-dance-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: COMMERCIAL_FAQS_CONFIG,
  testimonials: COMMERCIAL_TESTIMONIALS,
  scheduleKeys: COMMERCIAL_SCHEDULE_KEYS,

  // Teachers (pending assignment - empty for now)
  teachers: [],

  // Breadcrumb (4 levels: Home > Classes > Urban > Commercial Dance)
  breadcrumbConfig: {
    homeKey: 'commercialBreadcrumbHome',
    classesKey: 'commercialBreadcrumbClasses',
    categoryKey: 'commercialBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'commercialBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: COMMERCIAL_LEVELS,
  // prepareConfig: COMMERCIAL_PREPARE_CONFIG, // Hidden until teacher is assigned

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 450,
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
    keyPrefix: 'commercial',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'commercialCulturalHistoryTitle',
    shortDescKey: 'commercialCulturalShort',
    fullHistoryKey: 'commercialCulturalFull',
  },

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'urbanas',
    limit: 6,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Commercial Dance, coreografías para videoclips, técnica de performance profesional',
    prerequisites: 'Ninguno',
    lessons: 'Próximamente',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'commercialVideoTitle',
    descKey: 'commercialVideoDesc',
    thumbnailUrl: '',
    videoId: '',
  },

  personSchemas: [], // No teachers assigned yet

  // === RELATED CLASSES (internal linking) ===
  // Commercial Dance -> Hip Hop, Sexy Style, Modern Jazz
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'hip-hop-barcelona',
        nameKey: 'relatedHipHopName',
        descriptionKey: 'relatedHipHopDesc',
      },
      {
        slug: 'sexy-style-barcelona',
        nameKey: 'relatedSexyStyleName',
        descriptionKey: 'relatedSexyStyleDesc',
      },
      {
        slug: 'modern-jazz-barcelona',
        nameKey: 'relatedModernJazzName',
        descriptionKey: 'relatedModernJazzDesc',
      },
    ],
  },
};
