/**
 * Kizomba Dance Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  KIZOMBA_TESTIMONIALS,
  KIZOMBA_FAQS_CONFIG,
  KIZOMBA_SCHEDULE_KEYS,
  KIZOMBA_LEVELS,
  // KIZOMBA_PREPARE_CONFIG, // Uncomment when teacher is assigned
} from './kizomba';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const KIZOMBA_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'kizomba',
  stylePath: 'kizomba-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: KIZOMBA_FAQS_CONFIG,
  testimonials: KIZOMBA_TESTIMONIALS,
  scheduleKeys: KIZOMBA_SCHEDULE_KEYS,

  // Teachers (pending assignment - empty for now)
  teachers: [],

  // Breadcrumb (4 levels: Home > Classes > Latinas > Kizomba)
  breadcrumbConfig: {
    homeKey: 'kizombaBreadcrumbHome',
    classesKey: 'kizombaBreadcrumbClasses',
    categoryKey: 'kizombaBreadcrumbLatinas',
    categoryUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'kizombaBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: KIZOMBA_LEVELS,
  // prepareConfig: KIZOMBA_PREPARE_CONFIG, // Hidden until teacher is assigned

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 350,
    funPercent: 100,
    gradientColor: 'primary',
  },

  // Disable Momence sync until classes are scheduled
  useDynamicSchedule: false,

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
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
    itemOrder: [1, 2, 3, 4, 5, 7],
  },

  whyTodaySection: {
    enabled: true,
    paragraphCount: 3,
  },

  videoSection: {
    enabled: false,
    videos: [],
    placeholderCount: 0,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'kizomba',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'kizombaCulturalHistoryTitle',
    shortDescKey: 'kizombaCulturalShort',
    fullHistoryKey: 'kizombaCulturalFull',
  },

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'latinas',
    limit: 6,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Kizomba, técnica de conexión en pareja, musicalidad africana, baile sensual',
    prerequisites: 'Ninguno',
    lessons: 'Próximamente',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'kizombaVideoTitle',
    descKey: 'kizombaVideoDesc',
    thumbnailUrl: '',
    videoId: '',
  },

  personSchemas: [],

  // === RELATED CLASSES (internal linking) ===
  // Kizomba -> Bachata, Salsa Cubana, Afrobeats
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'bachata-barcelona',
        nameKey: 'relatedBachataName',
        descriptionKey: 'relatedBachataDesc',
      },
      {
        slug: 'salsa-cubana-barcelona',
        nameKey: 'relatedSalsaCubanaName',
        descriptionKey: 'relatedSalsaCubanaDesc',
      },
      {
        slug: 'afrobeats-barcelona',
        nameKey: 'relatedAfrobeatsName',
        descriptionKey: 'relatedAfrobeatsDesc',
      },
    ],
  },

  // Latin dance comparison enabled for Kizomba
  latinDanceComparison: true,
};
