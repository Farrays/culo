/**
 * Clases de Baile por las Mañanas en Barcelona - Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete morning dance classes landing page.
 *
 * SEO Keywords:
 * - clases de baile por las mañanas en barcelona
 * - clases baile mañanas barcelona
 * - escuela baile horario mañana
 * - academia baile turnos mañana
 * - baile matinal barcelona
 */
import {
  BAILE_MANANAS_TESTIMONIALS,
  BAILE_MANANAS_FAQS_CONFIG,
  BAILE_MANANAS_SCHEDULE_KEYS,
  BAILE_MANANAS_LEVELS,
  BAILE_MANANAS_PREPARE_CONFIG,
} from './baile-mananas';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const BAILE_MANANAS_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'bailemanananas',
  stylePath: 'baile-mananas',

  // === REQUIRED DATA ===
  faqsConfig: BAILE_MANANAS_FAQS_CONFIG,
  testimonials: BAILE_MANANAS_TESTIMONIALS,
  scheduleKeys: BAILE_MANANAS_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [
    getTeacherForClass('alejandro-minoso', 'baileMananas', ['ENA Cuba', 'Ballet']),
    getTeacherForClass('yasmina-fernandez', 'baileMananas', ['Salsa Cubana', 'Lady Style']),
    getTeacherForClass('isabel-lopez', 'baileMananas', ['Dancehall', 'Twerk']),
  ],

  // Breadcrumb (4 levels: Home > Clases > Baile Barcelona > Clases de Mañanas)
  breadcrumbConfig: {
    homeKey: 'bailemanananasBreadcrumbHome',
    classesKey: 'bailemanananasBreadcrumbClasses',
    categoryKey: 'bailemanananasBreadcrumbCategory',
    categoryUrl: '/clases/baile-barcelona',
    currentKey: 'bailemanananasBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: BAILE_MANANAS_LEVELS,
  prepareConfig: BAILE_MANANAS_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 350,
    funPercent: 100, // Will be overridden with custom stat
    gradientColor: 'amber', // Warm, energetic, morning color
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // No image yet - can be added later
  },

  identificationSection: {
    enabled: true,
    itemCount: 6, // 6 puntos de dolor
    hasTransition: true,
    hasNeedEnroll: true,
  },

  transformationSection: {
    enabled: true,
    itemCount: 6, // 6 beneficios
  },

  whyChooseSection: {
    enabled: true,
    itemOrder: [2, 3, 4, 5, 6, 7],
  },

  whyTodaySection: {
    enabled: true,
    paragraphCount: 3,
  },

  // Why Us vs Others Comparison Table - DISABLED (not applicable)
  whyUsComparison: {
    enabled: false,
    rowCount: 0,
    meaningCount: 0,
    showCTA: false,
  },

  videoSection: {
    enabled: false, // No video yet
    videos: [],
    placeholderCount: 0,
  },

  logosSection: {
    enabled: true,
    // Uses default logos (UNESCO, Street Dance 2, The Dancer, Telecinco)
  },

  testimonialsSection: {
    enabled: true,
    position: 'after-why-choose', // Show testimonials earlier, after Why Choose section
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'bailemanananas',
  },

  // Cultural History - DISABLED (not a dance style, it's a schedule-based landing)
  culturalHistory: {
    enabled: false,
    titleKey: '',
    shortDescKey: '',
    fullHistoryKey: '',
  },

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'general',
    limit: 4,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches:
      'Contemporáneo, Ballet, Modern Jazz, Afro Jazz, Sexy Style, Sexy Reggaeton, Salsa Lady Style, Stretching, Body Conditioning, Reggaeton Cubano, Dancehall Female, Twerk',
    prerequisites: 'Ninguno - clases para todos los niveles desde principiante',
    lessons: '15 clases semanales de lunes a jueves, horario de 10:00 a 13:00',
    duration: 'PT1H',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Alejandro Miñoso',
      jobTitle: 'Profesor de Danza Contemporánea, Ballet y Modern Jazz',
      description:
        "Bailarín profesional y coreógrafo formado en la Escuela Nacional de Arte de Cuba. Especialista en danza contemporánea, ballet clásico y modern jazz. Imparte clases matinales en Farray's Center.",
      knowsAbout: [
        'Danza Contemporánea',
        'Ballet Clásico',
        'Modern Jazz',
        'Afro Jazz',
        'Body Conditioning',
        'Stretching',
        'Floor Work',
        'Técnica Clásica',
      ],
    },
    {
      name: 'Yasmina Fernández',
      jobTitle: 'Profesora de Sexy Style, Reggaeton y Salsa Lady Style',
      description:
        'Profesora certificada en el Método Farray, especializada en estilos sensuales y latinos. Referente en Sexy Style y Reggaeton en Barcelona. Imparte clases matinales enfocadas en empoderamiento y expresión corporal.',
      knowsAbout: [
        'Sexy Style',
        'Sexy Reggaeton',
        'Salsa Lady Style',
        'Reggaeton Cubano',
        'Baile Sensual',
        'Empoderamiento Femenino',
        'Método Farray',
      ],
    },
    {
      name: 'Isabel López',
      jobTitle: 'Profesora de Dancehall Female y Twerk',
      description:
        "Profesora especializada en Dancehall y Twerk, con una energía contagiosa que transforma cada clase matinal en una fiesta. Imparte clases de Dancehall Female y Twerk en las mañanas de Farray's Center.",
      knowsAbout: [
        'Dancehall Female',
        'Twerk',
        'Dancehall',
        'Baile Urbano',
        'Ritmos Caribeños',
        'Empoderamiento Femenino',
        'Expresión Corporal',
      ],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Baile Mañanas -> Stretching, Ballet, Contemporáneo (clases matinales complementarias)
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'stretching-barcelona',
        nameKey: 'relatedStretchingName',
        descriptionKey: 'relatedStretchingDesc',
      },
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
    ],
  },
};
