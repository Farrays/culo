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
import { getTeacherInfo } from './teacher-images';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const TIMBA_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'timba',
  stylePath: 'timba-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: TIMBA_FAQS_CONFIG,
  testimonials: TIMBA_TESTIMONIALS,
  scheduleKeys: TIMBA_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [
    getTeacherInfo('yunaisy-farray', 'timbaTeacher1Specialty', 'timbaTeacher1Bio', [
      'Directora',
      'Timba',
      'Lady Timba',
    ]),
    getTeacherInfo('grechen-mendez', 'timbaTeacher2Specialty', 'timbaTeacher2Bio', [
      'Timba',
      'Salsa',
    ]),
    getTeacherInfo('lia-valdes', 'timbaTeacher3Specialty', 'timbaTeacher3Bio', [
      'Salsa Cubana',
      'Lady Style',
    ]),
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
    // Enterprise: Hero background image with OptimizedImage
    heroImage: {
      basePath: '/images/classes/timba/img/timba-cubana',
      alt: "Clases de Timba Cubana en Barcelona - Farray's Center",
      altKey: 'styleImages.timba.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'],
    },
    // Enterprise: Hero Visual Configuration
    heroVisuals: {
      imageOpacity: 45,
      objectPosition: 'center 40%',
      gradientStyle: 'vibrant',
      textShadow: true,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 5,
    hasQuestionAnswer: true,
    // Enterprise: Optimized image for whatIs section
    optimizedImage: {
      basePath: '/images/classes/timba/img/timba-cubana',
      alt: "Bailarines practicando Timba Cubana en academia de Barcelona - Farray's Center",
      altKey: 'styleImages.timba.whatIs',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
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

  // === RELATED CLASSES (internal linking) ===
  // Timba -> Salsa Cubana, Folklore Cubano, Reggaeton Cubano
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'salsa-cubana-barcelona',
        nameKey: 'relatedSalsaCubanaName',
        descriptionKey: 'relatedSalsaCubanaDesc',
      },
      {
        slug: 'folklore-cubano',
        nameKey: 'relatedFolkloreCubanoName',
        descriptionKey: 'relatedFolkloreCubanoDesc',
      },
      {
        slug: 'reggaeton-cubano-barcelona',
        nameKey: 'relatedReggaetonCubanoName',
        descriptionKey: 'relatedReggaetonCubanoDesc',
      },
    ],
  },
};
