/**
 * Bachata Sensual Page Configuration for FullDanceClassTemplate
 * ==============================================================
 * Configuración completa para la página /clases/bachata-barcelona
 * Usa el template moderno FullDanceClassTemplate
 */
import {
  BACHATA_TESTIMONIALS,
  BACHATA_FAQS_CONFIG,
  BACHATA_SCHEDULE_KEYS,
  BACHATA_LEVELS,
  BACHATA_PREPARE_CONFIG,
  BACHATA_NEARBY_AREAS,
} from './bachata';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const BACHATA_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'bachataV3',
  stylePath: 'bachata-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: BACHATA_FAQS_CONFIG,
  testimonials: BACHATA_TESTIMONIALS,
  scheduleKeys: BACHATA_SCHEDULE_KEYS,

  // Teachers - 5 profesores de bachata sensual
  teachers: [
    {
      name: 'Mathias Font',
      specialtyKey: 'bachataV3Teacher1Specialty',
      bioKey: 'bachataV3Teacher1Bio',
      image: undefined, // Pendiente de foto
      tags: ['Campeón Mundial', 'Musicalidad', 'Conexión'],
    },
    {
      name: 'Eugenia Trujillo',
      specialtyKey: 'bachataV3Teacher2Specialty',
      bioKey: 'bachataV3Teacher2Bio',
      image: '/images/teachers/eugenia-trujillo_256.webp',
      tags: ['Campeona Mundial', 'Salsa LA', 'Bachata Sensual'],
    },
    {
      name: 'Carlos Canto',
      specialtyKey: 'bachataV3Teacher3Specialty',
      bioKey: 'bachataV3Teacher3Bio',
      image: undefined, // Pendiente de foto
      tags: ['Bachata Sensual', 'Principiantes'],
    },
    {
      name: 'Noemí',
      specialtyKey: 'bachataV3Teacher4Specialty',
      bioKey: 'bachataV3Teacher4Bio',
      image: undefined, // Pendiente de foto
      tags: ['Bachata Sensual', 'Lady Style'],
    },
    {
      name: 'Juan Álvarez',
      specialtyKey: 'bachataV3Teacher5Specialty',
      bioKey: 'bachataV3Teacher5Bio',
      image: undefined, // Pendiente de foto
      tags: ['Bachata Sensual', 'Contemporáneo'],
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Latin > Current)
  breadcrumbConfig: {
    homeKey: 'bachataV3BreadcrumbHome',
    classesKey: 'bachataV3BreadcrumbClasses',
    categoryKey: 'bachataV3BreadcrumbLatin',
    categoryUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'bachataV3BreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: BACHATA_LEVELS,
  prepareConfig: BACHATA_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 350,
    funPercent: 100,
    gradientColor: 'violet', // Color distintivo para bachata sensual
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
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
    enabled: false, // Habilitar cuando haya video de bachata sensual
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'bachataV3',
    areas: BACHATA_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'bachataV3CulturalHistoryTitle',
    shortDescKey: 'bachataV3CulturalShort',
    fullHistoryKey: 'bachataV3CulturalFull',
  },

  // === LATIN DANCE COMPARISON ===
  latinDanceComparison: {
    enabled: true,
    highlightedStyle: 'bachata', // Destacar bachata en la tabla comparativa
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches:
      'Bachata Sensual, ondulaciones, conexión en pareja, musicalidad, dips, waves, body movement, técnica de guía y seguimiento',
    prerequisites: 'Ninguno - clases para todos los niveles desde principiante absoluto',
    lessons: 'Clases semanales con progresión por niveles',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Mathias Font',
      jobTitle: 'Profesor de Bachata Sensual - Campeón Mundial Salsa LA',
      description:
        'Campeón mundial de Salsa LA junto a Eugenia Trujillo. Especialista en bachata sensual con enfoque en musicalidad y conexión.',
      knowsAbout: ['Bachata Sensual', 'Musicalidad', 'Conexión en pareja', 'Salsa LA'],
    },
    {
      name: 'Eugenia Trujillo',
      jobTitle: 'Profesora de Bachata Sensual - Campeona Mundial Salsa LA',
      description:
        "Maestra y bailarina internacional uruguaya, campeona mundial de Salsa LA. Profesora de bachata sensual en Farray's Center.",
      knowsAbout: ['Bachata Sensual', 'Bachata Lady Style', 'Salsa LA', 'Técnica femenina'],
    },
    {
      name: 'Carlos Canto',
      jobTitle: 'Profesor de Bachata Sensual',
      description:
        "Talento emergente de la escena de bachata de Barcelona. Especialista en clases para principiantes en Farray's Center.",
      knowsAbout: ['Bachata Sensual', 'Bachata para principiantes'],
    },
  ],
};
