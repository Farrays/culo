/**
 * Reggaeton Cubano Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  REGGAETON_CUBANO_TESTIMONIALS,
  REGGAETON_CUBANO_FAQS_CONFIG,
  REGGAETON_CUBANO_SCHEDULE_KEYS,
  REGGAETON_CUBANO_LEVELS,
  REGGAETON_CUBANO_PREPARE_CONFIG,
} from './reggaeton-cubano';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const REGGAETON_CUBANO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'rcb',
  stylePath: 'reggaeton-cubano-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: REGGAETON_CUBANO_FAQS_CONFIG,
  testimonials: REGGAETON_CUBANO_TESTIMONIALS,
  scheduleKeys: REGGAETON_CUBANO_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Charlie Breezy',
      specialtyKey: 'rcbTeacher1Specialty',
      bioKey: 'rcbTeacher1Bio',
      image: '/images/teachers/img/profesor-hip-hop-charlie-breezy_320.webp',
    },
    {
      name: 'Alejandro Miñoso',
      specialtyKey: 'rcbTeacher2Specialty',
      bioKey: 'rcbTeacher2Bio',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Urban > Reggaeton Cubano)
  breadcrumbConfig: {
    homeKey: 'rcbBreadcrumbHome',
    classesKey: 'rcbBreadcrumbClasses',
    categoryKey: 'rcbBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'rcbBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: REGGAETON_CUBANO_LEVELS,
  prepareConfig: REGGAETON_CUBANO_PREPARE_CONFIG,

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
      src: '/images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_960.webp',
      srcSet:
        '/images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_480.webp 480w, /images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_960.webp 960w',
      alt: 'Clases de Reggaeton Cubano en Barcelona',
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
    keyPrefix: 'rcb',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'rcbCulturalHistoryTitle',
    shortDescKey: 'rcbCulturalShort',
    fullHistoryKey: 'rcbCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Reggaeton Cubano, Reparto, Cubatón, disociación corporal, improvisación',
    prerequisites: 'Ninguno',
    lessons: '3 clases semanales',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Charlie Breezy',
      jobTitle: 'Instructor de Reggaeton Cubano',
      description: 'Especialista en Reggaeton Cubano y estilos urbanos con raíces cubanas.',
      knowsAbout: ['Reggaeton Cubano', 'Reparto', 'Cubatón', 'Urban Dance'],
    },
    {
      name: 'Alejandro Miñoso',
      jobTitle: 'Instructor de Reggaeton Cubano',
      description: 'Bailarín profesional cubano con amplia experiencia en estilos urbanos.',
      knowsAbout: ['Reggaeton Cubano', 'Cuban Dance', 'Urban Dance'],
    },
  ],
};
