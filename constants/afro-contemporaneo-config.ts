/**
 * Afro Contemporáneo Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  AFRO_CONTEMPORANEO_TESTIMONIALS,
  AFRO_CONTEMPORANEO_FAQS_CONFIG,
  AFRO_CONTEMPORANEO_SCHEDULE_KEYS,
  AFRO_CONTEMPORANEO_LEVELS,
  AFRO_CONTEMPORANEO_PREPARE_CONFIG,
  AFRO_CONTEMPORANEO_NEARBY_AREAS,
} from './afro-contemporaneo';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const AFRO_CONTEMPORANEO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'afrocontemporaneo',
  stylePath: 'afro-contemporaneo-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: AFRO_CONTEMPORANEO_FAQS_CONFIG,
  testimonials: AFRO_CONTEMPORANEO_TESTIMONIALS,
  scheduleKeys: AFRO_CONTEMPORANEO_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Yunaisy Farray',
      specialtyKey: 'afrocontemporaneoTeacher1Specialty',
      bioKey: 'afrocontemporaneoTeacher1Bio',
      image: '/images/teachers/img/yunaisy-farray-directora_320.webp',
    },
    {
      name: 'Charlie Breezy',
      specialtyKey: 'afrocontemporaneoTeacher2Specialty',
      bioKey: 'afrocontemporaneoTeacher2Bio',
      image: '/images/teachers/img/profesor-hip-hop-charlie-breezy_320.webp',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Dance > Afro Contemporáneo)
  breadcrumbConfig: {
    homeKey: 'afrocontemporaneoBreadcrumbHome',
    classesKey: 'afrocontemporaneoBreadcrumbClasses',
    categoryKey: 'afrocontemporaneoBreadcrumbUrban',
    categoryUrl: '/clases/danza-barcelona',
    currentKey: 'afrocontemporaneoBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: AFRO_CONTEMPORANEO_LEVELS,
  prepareConfig: AFRO_CONTEMPORANEO_PREPARE_CONFIG,

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
      src: '/images/classes/afro-contemporaneo/img/clases-afro-contemporaneo-barcelona_960.webp',
      srcSet:
        '/images/classes/afro-contemporaneo/img/clases-afro-contemporaneo-barcelona_480.webp 480w, /images/classes/afro-contemporaneo/img/clases-afro-contemporaneo-barcelona_960.webp 960w',
      alt: 'Clases de Afro Contemporáneo en Barcelona',
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
    keyPrefix: 'afrocontemporaneo',
    areas: AFRO_CONTEMPORANEO_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'afrocontemporaneoCulturalHistoryTitle',
    shortDescKey: 'afrocontemporaneoCulturalShort',
    fullHistoryKey: 'afrocontemporaneoCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Afro Contemporáneo, técnica cubana ENA, disociación corporal, folklore afrocubano',
    prerequisites: 'Ninguno - clases para todos los niveles',
    lessons: 'Clases semanales de perfeccionamiento',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitle: "Directora de Farray's Center",
      description:
        'Bailarina profesional cubana formada en la ENA, especialista en Danza Contemporánea Cubana.',
      knowsAbout: ['Afro Contemporáneo', 'DCC', 'Cuban Dance', 'ENA Technique', 'Choreography'],
    },
    {
      name: 'Charlie Breezy',
      jobTitle: 'Profesor de Afro Contemporáneo',
      description: 'Bailarín profesional con experiencia en estilos afro y urbanos.',
      knowsAbout: ['Afro Contemporáneo', 'Urban Dance', 'African Dance'],
    },
  ],
};
