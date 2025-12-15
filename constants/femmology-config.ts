/**
 * Femmology Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  FEMMOLOGY_TESTIMONIALS,
  FEMMOLOGY_FAQS_CONFIG,
  FEMMOLOGY_SCHEDULE_KEYS,
  FEMMOLOGY_LEVELS,
  FEMMOLOGY_PREPARE_CONFIG,
} from './femmology';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const FEMMOLOGY_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'fem',
  stylePath: 'femmology-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: FEMMOLOGY_FAQS_CONFIG,
  testimonials: FEMMOLOGY_TESTIMONIALS,
  scheduleKeys: FEMMOLOGY_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Yunaisy Farray',
      specialtyKey: 'femTeacher1Specialty',
      bioKey: 'femTeacher1Bio',
      image: '/images/teachers/img/yunaisy-farray-directora_320.webp',
    },
  ],

  // Breadcrumb (5 levels: Home > Classes > Urban > Heels > Femmology)
  breadcrumbConfig: {
    homeKey: 'femBreadcrumbHome',
    classesKey: 'femBreadcrumbClasses',
    categoryKey: 'femBreadcrumbHeels',
    categoryUrl: '/clases/heels-barcelona',
    currentKey: 'femBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: FEMMOLOGY_LEVELS,
  prepareConfig: FEMMOLOGY_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 400,
    funPercent: 100,
    gradientColor: 'rose',
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/classes/femmology/img/clases-femmology-barcelona_960.webp',
      srcSet:
        '/images/classes/femmology/img/clases-femmology-barcelona_480.webp 480w, /images/classes/femmology/img/clases-femmology-barcelona_960.webp 960w',
      alt: 'Clases de Femmology en Barcelona - Creado por Yunaisy Farray',
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
    keyPrefix: 'fem',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'femCulturalHistoryTitle',
    shortDescKey: 'femCulturalShort',
    fullHistoryKey: 'femCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Femmology, danzaterapia, baile en tacones, feminidad, sensualidad, autoestima',
    prerequisites: 'Ninguno',
    lessons: '2 clases semanales',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitle: 'Creadora de Femmology',
      description:
        "Bailarina profesional y coreógrafa cubana, creadora de Femmology y directora de Farray's International Dance Center.",
      knowsAbout: ['Femmology', 'Heels Dance', 'Cuban Dance', 'Dance Therapy', 'Choreography'],
    },
  ],
};
