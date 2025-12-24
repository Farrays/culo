/**
 * Cuerpo-Fit (Full Body Cardio Dance) Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete Cuerpo-Fit page.
 *
 * NOTA: Este archivo es para la NUEVA clase Cuerpo-Fit (cardio dance para todos).
 * URL: /clases/cuerpo-fit
 * No confundir con cuerpo-fit-config.ts que es Body Conditioning para bailarines.
 *
 * SEO Keywords:
 * - cuerpo fit barcelona
 * - entrenamiento full body barcelona
 * - cardio dance barcelona
 * - clases fitness barcelona
 * - quemar calorías bailando barcelona
 * - fitness dance barcelona
 * - ejercicios full body barcelona
 */
import {
  FULL_BODY_CARDIO_TESTIMONIALS,
  FULL_BODY_CARDIO_FAQS_CONFIG,
  FULL_BODY_CARDIO_SCHEDULE_KEYS,
  FULL_BODY_CARDIO_LEVELS,
  FULL_BODY_CARDIO_PREPARE_CONFIG,
} from './full-body-cardio';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const FULL_BODY_CARDIO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'fullBodyCardio',
  stylePath: 'cuerpo-fit',

  // === REQUIRED DATA ===
  faqsConfig: FULL_BODY_CARDIO_FAQS_CONFIG,
  testimonials: FULL_BODY_CARDIO_TESTIMONIALS,
  scheduleKeys: FULL_BODY_CARDIO_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Cris Ag',
      specialtyKey: 'fullBodyCardioTeacher1Specialty',
      bioKey: 'fullBodyCardioTeacher1Bio',
      // No image - will use initials avatar
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Fitness > Cuerpo-Fit)
  breadcrumbConfig: {
    homeKey: 'fullBodyCardioBreadcrumbHome',
    classesKey: 'fullBodyCardioBreadcrumbClasses',
    categoryKey: 'fullBodyCardioBreadcrumbCategory',
    categoryUrl: '/clases/entrenamiento-bailarines-barcelona',
    currentKey: 'fullBodyCardioBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: FULL_BODY_CARDIO_LEVELS,
  prepareConfig: FULL_BODY_CARDIO_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 450, // Promedio de 400-500 kcal
    funPercent: 100,
    gradientColor: 'amber', // Energía, vitalidad, fitness
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // No image yet - will be added later
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

  // Why Us vs Others Comparison Table - DISABLED
  whyUsComparison: {
    enabled: false,
    rowCount: 8,
    meaningCount: 4,
    showCTA: true,
  },

  videoSection: {
    enabled: false, // No video yet - recommended to add later
    videos: [],
    placeholderCount: 0,
  },

  logosSection: {
    enabled: true,
    // Uses default logos (UNESCO, Street Dance 2, The Dancer, Telecinco)
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'fullBodyCardio',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'fullBodyCardioCulturalHistoryTitle',
    shortDescKey: 'fullBodyCardioCulturalShort',
    fullHistoryKey: 'fullBodyCardioCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches:
      'Cuerpo-Fit, entrenamiento full body, cardio dance, tonificación integral, ejercicios funcionales, quema de calorías, fitness dance',
    prerequisites: 'Ninguno - clase abierta para todos los niveles sin experiencia previa',
    lessons: '1 clase semanal',
    duration: 'PT1H',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Cris Ag',
      jobTitle: 'Instructora de Cuerpo-Fit y Cardio Dance',
      description:
        'Especialista en entrenamiento full body y cardio dance con el Método Farray. Experta en ejercicios funcionales con música para quemar calorías de forma divertida.',
      knowsAbout: [
        'Full Body Training',
        'Cardio Dance',
        'Functional Fitness',
        'Método Farray',
        'Quema de Calorías',
        'Tonificación Integral',
      ],
    },
  ],
};
