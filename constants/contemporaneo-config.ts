/**
 * Contemporáneo Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  CONTEMPORANEO_TESTIMONIALS,
  CONTEMPORANEO_FAQS_CONFIG,
  CONTEMPORANEO_SCHEDULE_KEYS,
  CONTEMPORANEO_LEVELS,
  CONTEMPORANEO_PREPARE_CONFIG,
  CONTEMPORANEO_NEARBY_AREAS,
} from './contemporaneo';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const CONTEMPORANEO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'contemporaneo',
  stylePath: 'contemporaneo-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: CONTEMPORANEO_FAQS_CONFIG,
  testimonials: CONTEMPORANEO_TESTIMONIALS,
  scheduleKeys: CONTEMPORANEO_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Daniel Sené',
      specialtyKey: 'contemporaneoTeacher1Specialty',
      bioKey: 'contemporaneoTeacher1Bio',
    },
    {
      name: 'Alejandro Miñoso',
      specialtyKey: 'contemporaneoTeacher2Specialty',
      bioKey: 'contemporaneoTeacher2Bio',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Dance > Contemporáneo)
  breadcrumbConfig: {
    homeKey: 'contemporaneoBreadcrumbHome',
    classesKey: 'contemporaneoBreadcrumbClasses',
    categoryKey: 'contemporaneoBreadcrumbUrban',
    categoryUrl: '/clases/danza-barcelona',
    currentKey: 'contemporaneoBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: CONTEMPORANEO_LEVELS,
  prepareConfig: CONTEMPORANEO_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'primary',
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/classes/contemporaneo/img/clases-contemporaneo-barcelona_960.webp',
      srcSet:
        '/images/classes/contemporaneo/img/clases-contemporaneo-barcelona_480.webp 480w, /images/classes/contemporaneo/img/clases-contemporaneo-barcelona_960.webp 960w',
      alt: 'Clases de Danza Contemporánea en Barcelona',
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
    keyPrefix: 'contemporaneo',
    areas: CONTEMPORANEO_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'contemporaneoCulturalHistoryTitle',
    shortDescKey: 'contemporaneoCulturalShort',
    fullHistoryKey: 'contemporaneoCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Danza Contemporánea, técnica de suelo, release, improvisación, expresión corporal',
    prerequisites: 'Ninguno',
    lessons: '4 clases semanales',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Daniel Sené',
      jobTitle: 'Profesor de Danza Contemporánea',
      description:
        'Bailarín profesional formado en la Escuela Nacional de Arte de Cuba, especialista en contemporáneo lírico.',
      knowsAbout: ['Danza Contemporánea', 'Release Technique', 'Floor Work', 'Cuban Dance'],
    },
    {
      name: 'Alejandro Miñoso',
      jobTitle: 'Profesor de Danza Contemporánea',
      description: 'Bailarín profesional cubano especialista en técnica de suelo y flow.',
      knowsAbout: ['Danza Contemporánea', 'Suelo & Flow', 'Cuban Technique'],
    },
  ],
};
