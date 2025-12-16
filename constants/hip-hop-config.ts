/**
 * Hip Hop Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  HIPHOP_TESTIMONIALS,
  HIPHOP_FAQS_CONFIG,
  HIPHOP_SCHEDULE_KEYS,
  HIPHOP_LEVELS,
  HIPHOP_PREPARE_CONFIG,
  HIPHOP_NEARBY_AREAS,
} from './hip-hop';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const HIPHOP_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'hiphop',
  stylePath: 'hip-hop-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: HIPHOP_FAQS_CONFIG,
  testimonials: HIPHOP_TESTIMONIALS,
  scheduleKeys: HIPHOP_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Marcos Martínez',
      specialtyKey: 'hiphopTeacher1Specialty',
      bioKey: 'hiphopTeacher1Bio',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Urban > Hip Hop)
  breadcrumbConfig: {
    homeKey: 'hiphopBreadcrumbHome',
    classesKey: 'hiphopBreadcrumbClasses',
    categoryKey: 'hiphopBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'hiphopBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: HIPHOP_LEVELS,
  prepareConfig: HIPHOP_PREPARE_CONFIG,

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
      src: '/images/classes/hip-hop/img/clases-hip-hop-barcelona_960.webp',
      srcSet:
        '/images/classes/hip-hop/img/clases-hip-hop-barcelona_480.webp 480w, /images/classes/hip-hop/img/clases-hip-hop-barcelona_960.webp 960w',
      alt: 'Clases de Hip Hop en Barcelona',
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
    enabled: false,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'hiphop',
    areas: HIPHOP_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'hiphopCulturalHistoryTitle',
    shortDescKey: 'hiphopCulturalShort',
    fullHistoryKey: 'hiphopCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Hip Hop, Breaking, Locking, Popping, Freestyle, Urban Dance',
    prerequisites: 'Ninguno - clases para todos los niveles',
    lessons: '1 clase semanal',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Marcos Martínez',
      jobTitle: 'Instructor de Hip Hop',
      description:
        'Juez internacional de Hip Hop con amplia experiencia en competiciones y enseñanza.',
      knowsAbout: ['Hip Hop', 'Breaking', 'Locking', 'Popping', 'Urban Dance'],
    },
  ],
};
