/**
 * Stretching Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete Stretching/Estiramientos page.
 *
 * SEO Keywords:
 * - stretching en barcelona
 * - estiramientos en barcelona
 * - clases de estiramientos
 * - clases de estiramientos en barcelona
 * - flexi
 * - flexibilidad
 * - backbending
 */
import {
  STRETCHING_TESTIMONIALS,
  STRETCHING_FAQS_CONFIG,
  STRETCHING_SCHEDULE_KEYS,
  STRETCHING_LEVELS,
  STRETCHING_PREPARE_CONFIG,
} from './stretching';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const STRETCHING_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'stretching',
  stylePath: 'stretching-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: STRETCHING_FAQS_CONFIG,
  testimonials: STRETCHING_TESTIMONIALS,
  scheduleKeys: STRETCHING_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Cris Ag',
      specialtyKey: 'stretchingTeacher1Specialty',
      bioKey: 'stretchingTeacher1Bio',
      // No image - will use initials avatar
    },
    {
      name: 'Daniel Sené',
      specialtyKey: 'stretchingTeacher2Specialty',
      bioKey: 'stretchingTeacher2Bio',
      // No image - will use initials avatar
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Prep Física > Stretching)
  breadcrumbConfig: {
    homeKey: 'stretchingBreadcrumbHome',
    classesKey: 'stretchingBreadcrumbClasses',
    categoryKey: 'stretchingBreadcrumbCategory',
    categoryUrl: '/clases/entrenamiento-bailarines-barcelona',
    currentKey: 'stretchingBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: STRETCHING_LEVELS,
  prepareConfig: STRETCHING_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 200,
    funPercent: 100,
    gradientColor: 'emerald', // Green for wellness/flexibility
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    optimizedImage: {
      basePath: '/images/categories/img/fitness',
      alt: 'Clase de stretching y flexibilidad para bailarines en Barcelona - estiramientos profesionales',
      altKey: 'classes.stretching.whatIs',
      breakpoints: [320, 640, 768, 1024],
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
    keyPrefix: 'stretching',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'stretchingCulturalHistoryTitle',
    shortDescKey: 'stretchingCulturalShort',
    fullHistoryKey: 'stretchingCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches:
      'Stretching, estiramientos, flexibilidad, backbending, elongación de piernas, fortalecimiento de core',
    prerequisites: 'Ninguno',
    lessons: '5 clases semanales',
    duration: 'PT1H',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Cris Ag',
      jobTitle: 'Instructora de Stretching y Backbending',
      description:
        'Especialista en flexibilidad y backbending con formación en el Método Farray. Experta en elongación de piernas y espalda.',
      knowsAbout: [
        'Stretching',
        'Backbending',
        'Flexibility',
        'Core Strengthening',
        'Método Farray',
      ],
    },
    {
      name: 'Daniel Sené',
      jobTitle: 'Instructor de Stretching y Ballet',
      description:
        'Bailarín profesional formado en la Escuela Nacional de Ballet de Cuba. Experto en técnica clásica y flexibilidad.',
      knowsAbout: ['Stretching', 'Ballet', 'Classical Technique', 'Flexibility', 'Posture'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Stretching -> Ballet, Contemporáneo, Modern Jazz (preparación física ideal)
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'ballet-barcelona',
        nameKey: 'relatedBalletName',
        descriptionKey: 'relatedBalletDesc',
      },
      {
        slug: 'contemporaneo-barcelona',
        nameKey: 'relatedContemporaneoName',
        descriptionKey: 'relatedContemporaneoDesc',
      },
      {
        slug: 'modern-jazz-barcelona',
        nameKey: 'relatedModernJazzName',
        descriptionKey: 'relatedModernJazzDesc',
      },
    ],
  },
};
