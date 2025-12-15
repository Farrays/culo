/**
 * Ballet Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  BALLET_TESTIMONIALS,
  BALLET_FAQS_CONFIG,
  BALLET_SCHEDULE_KEYS,
  BALLET_LEVELS,
  BALLET_PREPARE_CONFIG,
  BALLET_NEARBY_AREAS,
} from './ballet';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const BALLET_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'ballet',
  stylePath: 'ballet-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: BALLET_FAQS_CONFIG,
  testimonials: BALLET_TESTIMONIALS,
  scheduleKeys: BALLET_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Daniel Sené',
      specialtyKey: 'balletTeacher1Specialty',
      bioKey: 'balletTeacher1Bio',
    },
    {
      name: 'Alejandro Miñoso',
      specialtyKey: 'balletTeacher2Specialty',
      bioKey: 'balletTeacher2Bio',
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Dance > Ballet)
  breadcrumbConfig: {
    homeKey: 'balletBreadcrumbHome',
    classesKey: 'balletBreadcrumbClasses',
    categoryKey: 'balletBreadcrumbDance',
    categoryUrl: '/clases/danza-barcelona',
    currentKey: 'balletBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: BALLET_LEVELS,
  prepareConfig: BALLET_PREPARE_CONFIG,

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
      src: '/images/classes/ballet/img/clases-ballet-barcelona_960.webp',
      srcSet:
        '/images/classes/ballet/img/clases-ballet-barcelona_480.webp 480w, /images/classes/ballet/img/clases-ballet-barcelona_960.webp 960w',
      alt: 'Clases de Ballet en Barcelona - Estudiantes practicando en la barra',
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
    keyPrefix: 'ballet',
    areas: BALLET_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'balletCulturalHistoryTitle',
    shortDescKey: 'balletCulturalShort',
    fullHistoryKey: 'balletCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches:
      'Ballet clásico, danza clásica, técnica de ballet, posiciones de ballet, flexibilidad, postura',
    prerequisites: 'Ninguno',
    lessons: '2 clases semanales',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Daniel Sené',
      jobTitle: 'Profesor de Ballet',
      description: 'Bailarín profesional formado en la Escuela Nacional de Arte de Cuba.',
      knowsAbout: ['Ballet Clásico', 'Técnica Cubana', 'Danza Contemporánea'],
    },
    {
      name: 'Alejandro Miñoso',
      jobTitle: 'Profesor de Ballet',
      description: 'Bailarín profesional con formación en la Escuela Nacional de Arte de Cuba.',
      knowsAbout: ['Ballet Clásico', 'Técnica Cubana', 'Contemporáneo'],
    },
  ],
};
