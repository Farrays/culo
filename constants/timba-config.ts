/**
 * Timba Page Configuration
 * Unified page for Timba en Pareja + Lady Timba
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  TIMBA_TESTIMONIALS,
  TIMBA_FAQS_CONFIG,
  TIMBA_SCHEDULE_KEYS,
  TIMBA_LEVELS,
  TIMBA_PREPARE_CONFIG,
  TIMBA_NEARBY_AREAS,
} from './timba';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const TIMBA_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'timba',
  stylePath: 'timba-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: TIMBA_FAQS_CONFIG,
  testimonials: TIMBA_TESTIMONIALS,
  scheduleKeys: TIMBA_SCHEDULE_KEYS,

  // Teachers - 3 teachers for different classes
  teachers: [
    {
      name: 'Yunaisy Farray',
      specialtyKey: 'timbaTeacher1Specialty',
      bioKey: 'timbaTeacher1Bio',
      image: '/images/teachers/img/yunaisy-farray-directora_320.webp',
    },
    {
      name: 'Grechén Mendez',
      specialtyKey: 'timbaTeacher2Specialty',
      bioKey: 'timbaTeacher2Bio',
      image: undefined, // Will use initials
    },
    {
      name: 'Lia Valdés',
      specialtyKey: 'timbaTeacher3Specialty',
      bioKey: 'timbaTeacher3Bio',
      image: undefined, // Will use initials
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Latin > Timba)
  breadcrumbConfig: {
    homeKey: 'timbaBreadcrumbHome',
    classesKey: 'timbaBreadcrumbClasses',
    categoryKey: 'timbaBreadcrumbLatin',
    categoryUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'timbaBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: TIMBA_LEVELS,
  prepareConfig: TIMBA_PREPARE_CONFIG,
  nearbyAreas: TIMBA_NEARBY_AREAS,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 450,
    funPercent: 100,
    gradientColor: 'amber',
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 5,
    hasQuestionAnswer: true,
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
    keyPrefix: 'timba',
    areas: TIMBA_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'timbaCulturalHistoryTitle',
    shortDescKey: 'timbaCulturalShort',
    fullHistoryKey: 'timbaCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches:
      'Timba Cubana, Lady Timba, Timba en Pareja, Interpretación Musical, Improvisación, Despelote',
    prerequisites: 'Nivel intermedio de Salsa Cubana (mínimo 1 año bailando)',
    lessons: 'Clases semanales con 3 modalidades disponibles',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitle: "Directora de Farray's Center - Especialista en Lady Timba",
      description:
        'Bailarina profesional cubana, miembro del CID-UNESCO, especialista en Lady Timba y estilos femeninos de la salsa cubana.',
      knowsAbout: ['Lady Timba', 'Timba Cubana', 'Salsa Cubana', 'Despelote', 'Rumba'],
    },
    {
      name: 'Grechén Mendez',
      jobTitle: 'Maestra de Timba en Pareja y Folklore Cubano',
      description:
        'Bailarina profesional cubana, especialista en Timba en pareja y danzas folclóricas cubanas.',
      knowsAbout: ['Timba en Pareja', 'Folklore Cubano', 'Rumba', 'Son Cubano'],
    },
    {
      name: 'Lia Valdés',
      jobTitle: 'Profesora de Lady Timba Básico',
      description:
        'Bailarina cubana especializada en introducir a nuevas alumnas al mundo del Lady Timba.',
      knowsAbout: ['Lady Timba', 'Salsa Cubana', 'Estilo Femenino'],
    },
  ],
};
