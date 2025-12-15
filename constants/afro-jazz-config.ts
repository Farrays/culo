/**
 * Afro Jazz Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  AFRO_JAZZ_TESTIMONIALS,
  AFRO_JAZZ_FAQS_CONFIG,
  AFRO_JAZZ_SCHEDULE_KEYS,
  AFRO_JAZZ_LEVELS,
  AFRO_JAZZ_PREPARE_CONFIG,
} from './afro-jazz';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const AFRO_JAZZ_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'afrojazz',
  stylePath: 'afro-jazz-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: AFRO_JAZZ_FAQS_CONFIG,
  testimonials: AFRO_JAZZ_TESTIMONIALS,
  scheduleKeys: AFRO_JAZZ_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Yunaisy Farray',
      specialtyKey: 'afrojazzTeacher1Specialty',
      bioKey: 'afrojazzTeacher1Bio',
      image: '/images/teachers/img/yunaisy-farray-directora_320.webp',
    },
    {
      name: 'Alejandro Miñoso',
      specialtyKey: 'afrojazzTeacher2Specialty',
      bioKey: 'afrojazzTeacher2Bio',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Dance > Afro Jazz)
  breadcrumbConfig: {
    homeKey: 'afrojazzBreadcrumbHome',
    classesKey: 'afrojazzBreadcrumbClasses',
    categoryKey: 'afrojazzBreadcrumbUrban',
    categoryUrl: '/clases/danza-barcelona',
    currentKey: 'afrojazzBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: AFRO_JAZZ_LEVELS,
  prepareConfig: AFRO_JAZZ_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'emerald',
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/classes/afro-jazz/img/clases-afro-jazz-barcelona_960.webp',
      srcSet:
        '/images/classes/afro-jazz/img/clases-afro-jazz-barcelona_480.webp 480w, /images/classes/afro-jazz/img/clases-afro-jazz-barcelona_960.webp 960w',
      alt: 'Clases de Afro Jazz en Barcelona',
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
    keyPrefix: 'afrojazz',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'afrojazzCulturalHistoryTitle',
    shortDescKey: 'afrojazzCulturalShort',
    fullHistoryKey: 'afrojazzCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Afro Jazz, fusión Afro Contemporáneo + Jazz, técnica ENA, improvisación',
    prerequisites: 'Experiencia previa en danza recomendada',
    lessons: 'Clases semanales de perfeccionamiento',
    duration: 'PT1H30M',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitle: 'Creadora de Afro Jazz Fusión',
      description:
        'Bailarina profesional y coreógrafa cubana, creadora de la metodología Afro Jazz Fusión.',
      knowsAbout: ['Afro Jazz', 'Cuban Dance', 'Jazz', 'Choreography', 'ENA Technique'],
    },
    {
      name: 'Alejandro Miñoso',
      jobTitle: 'Profesor de Afro Jazz',
      description: 'Bailarín profesional cubano con formación en la ENA.',
      knowsAbout: ['Afro Jazz', 'Cuban Dance', 'Contemporary'],
    },
  ],
};
