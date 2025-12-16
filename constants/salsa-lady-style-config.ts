/**
 * Salsa Lady Style Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete Salsa Lady Style page. Migrating from 967 lines to ~120 lines of config.
 */
import {
  SALSA_LADY_STYLE_TESTIMONIALS,
  SALSA_LADY_STYLE_FAQS_CONFIG,
  SALSA_LADY_STYLE_SCHEDULE_KEYS,
  SALSA_LADY_STYLE_LEVELS,
  SALSA_LADY_STYLE_PREPARE_CONFIG,
  SALSA_LADY_COMPARISON_DATA,
  SALSA_LADY_STYLE_VIDEO_ID,
  SALSA_LADY_STYLE_COURSE_CONFIG,
} from './salsa-lady-style';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const SALSA_LADY_STYLE_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'salsaLady',
  stylePath: 'salsa-lady-style-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: SALSA_LADY_STYLE_FAQS_CONFIG,
  testimonials: SALSA_LADY_STYLE_TESTIMONIALS,
  scheduleKeys: SALSA_LADY_STYLE_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Yunaisy Farray',
      specialtyKey: 'salsaLadyTeacherCredential',
      bioKey: 'salsaLadyTeacherBio',
      image: '/images/teachers/yunaisy-farray_256.webp',
      imageSrcSet:
        '/images/teachers/yunaisy-farray_256.webp 1x, /images/teachers/yunaisy-farray_512.webp 2x',
    },
    {
      name: 'Lia Valdes',
      specialtyKey: 'salsaLadyTeacher2Specialty',
      bioKey: 'salsaLadyTeacher2Bio',
      // No image - will use initials avatar "LV"
    },
  ],

  // Breadcrumb (4 levels: Home > Classes > Salsa/Bachata > Lady Style)
  breadcrumbConfig: {
    homeKey: 'salsaLadyBreadcrumbHome',
    classesKey: 'salsaLadyBreadcrumbClasses',
    categoryKey: 'salsaLadyBreadcrumbLatin',
    categoryUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'salsaLadyBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: SALSA_LADY_STYLE_LEVELS,
  prepareConfig: SALSA_LADY_STYLE_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 350,
    funPercent: 100,
    gradientColor: 'amber',
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 1,
    hasQuestionAnswer: false,
    // No image for this section - uses quote style
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
    enabled: false, // Salsa Lady Style doesn't have this section
  },

  videoSection: {
    enabled: true,
    videos: [
      {
        videoId: SALSA_LADY_STYLE_VIDEO_ID,
        title: 'Salsa Lady Style con Yunaisy Farray',
      },
    ],
  },

  logosSection: {
    enabled: true,
    // Uses default logos (UNESCO, Street Dance 2, The Dancer, Telecinco)
  },

  // Comparison table for Salsa styles
  comparisonTable: {
    enabled: true,
    columns: SALSA_LADY_COMPARISON_DATA.styles.map(s => s.nameKey),
    rows: SALSA_LADY_COMPARISON_DATA.rows.map(r => ({
      rowKey: r.rowKey,
      values: r.values,
    })),
    meaningCount: 0, // No meaning section for comparison
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'salsaLady',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'salsaLadyCulturalTitle',
    shortDescKey: 'salsaLadyCulturalShort',
    fullHistoryKey: 'salsaLadyCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: SALSA_LADY_STYLE_COURSE_CONFIG,

  videoSchema: {
    titleKey: 'salsaLadyVideoTitle',
    descKey: 'salsaLadyVideoDesc',
    thumbnailUrl: `https://img.youtube.com/vi/${SALSA_LADY_STYLE_VIDEO_ID}/maxresdefault.jpg`,
    videoId: SALSA_LADY_STYLE_VIDEO_ID,
  },

  // Person schemas for teachers
  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitle: 'Creadora del Método Farray®',
      description:
        "Fundadora y directora de Farray's International Dance Center. Creadora del revolucionario Método Farray para Salsa Lady Style.",
      knowsAbout: ['Salsa Lady Style', 'Método Farray', 'Salsa Cubana', 'Timba', 'Cabaret'],
    },
    {
      name: 'Lia Valdes',
      jobTitle: 'Maestra y Artista Internacional Cubana',
      description:
        'Con más de 20 años de carrera artística, formada en la Escuela Nacional de Arte de Cuba (ENA). Referente mundial en Cabaret y Lady Style.',
      knowsAbout: ['Cabaret', 'Lady Style', 'Cuban Dance', 'Salsa', 'Latin Dance'],
    },
  ],
};
