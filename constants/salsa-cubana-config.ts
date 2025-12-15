/**
 * Salsa Cubana Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  SALSA_CUBANA_TESTIMONIALS,
  SALSA_CUBANA_FAQS_CONFIG,
  SALSA_CUBANA_SCHEDULE_KEYS,
  SALSA_CUBANA_LEVELS,
  SALSA_CUBANA_PREPARE_CONFIG,
  SALSA_CUBANA_NEARBY_AREAS,
} from './salsa-cubana';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const SALSA_CUBANA_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'salsaCubana',
  stylePath: 'salsa-cubana-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: SALSA_CUBANA_FAQS_CONFIG,
  testimonials: SALSA_CUBANA_TESTIMONIALS,
  scheduleKeys: SALSA_CUBANA_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Yunaisy Farray',
      specialtyKey: 'salsaCubanaTeacher1Specialty',
      bioKey: 'salsaCubanaTeacher1Bio',
      image: '/images/teachers/img/yunaisy-farray-directora_320.webp',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Latin > Salsa Cubana)
  breadcrumbConfig: {
    homeKey: 'salsaCubanaBreadcrumbHome',
    classesKey: 'salsaCubanaBreadcrumbClasses',
    categoryKey: 'salsaCubanaBreadcrumbLatin',
    categoryUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'salsaCubanaBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: SALSA_CUBANA_LEVELS,
  prepareConfig: SALSA_CUBANA_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 400,
    funPercent: 100,
    gradientColor: 'primary',
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/classes/salsa-cubana/img/clases-salsa-cubana-barcelona_960.webp',
      srcSet:
        '/images/classes/salsa-cubana/img/clases-salsa-cubana-barcelona_480.webp 480w, /images/classes/salsa-cubana/img/clases-salsa-cubana-barcelona_960.webp 960w',
      alt: 'Clases de Salsa Cubana en Barcelona - Método Farray',
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
    keyPrefix: 'salsaCubana',
    areas: SALSA_CUBANA_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'salsaCubanaCulturalHistoryTitle',
    shortDescKey: 'salsaCubanaCulturalShort',
    fullHistoryKey: 'salsaCubanaCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Salsa Cubana, Casino, Rueda de Casino, guía y seguimiento, Método Farray',
    prerequisites: 'Ninguno - clases para todos los niveles desde principiante absoluto',
    lessons: 'Clases semanales con progresión por niveles',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitle: "Directora de Farray's Center - Creadora del Método Farray",
      description:
        "Bailarina profesional cubana, creadora del Método Farray para Salsa Cubana, directora de Farray's International Dance Center.",
      knowsAbout: ['Salsa Cubana', 'Casino', 'Rueda de Casino', 'Método Farray', 'Cuban Dance'],
    },
  ],
};
