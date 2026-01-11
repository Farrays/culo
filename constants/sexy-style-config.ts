/**
 * Sexy Style Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  SEXY_STYLE_TESTIMONIALS,
  SEXY_STYLE_FAQS_CONFIG,
  SEXY_STYLE_SCHEDULE_KEYS,
  SEXY_STYLE_LEVELS,
  SEXY_STYLE_PREPARE_CONFIG,
  SEXY_STYLE_VIDEO_ID,
} from './sexy-style';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const SEXY_STYLE_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'sexystyle',
  stylePath: 'sexy-style-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: SEXY_STYLE_FAQS_CONFIG,
  testimonials: SEXY_STYLE_TESTIMONIALS,
  scheduleKeys: SEXY_STYLE_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [getTeacherForClass('yasmina-fernandez', 'sexyStyle', ['Sexy Style', 'Método Farray'])],

  // Breadcrumb (4 levels: Home > Classes > Urban > Sexy Style)
  breadcrumbConfig: {
    homeKey: 'sexystyleBreadcrumbHome',
    classesKey: 'sexystyleBreadcrumbClasses',
    categoryKey: 'sexystyleBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'sexystyleBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: SEXY_STYLE_LEVELS,
  prepareConfig: SEXY_STYLE_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 450,
    funPercent: 100,
    gradientColor: 'rose',

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/sexy-style/img/clases-de-sexy-style-barcelona',
      alt: "Clases de Sexy Style en Barcelona - Farray's Center",
      altKey: 'styleImages.sexyStyle.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'] as const,
    },
    heroVisuals: {
      imageOpacity: 45,
      objectPosition: 'center 40%',
      gradientStyle: 'vibrant' as const,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    optimizedImage: {
      basePath: '/images/classes/sexy-style/img/clases-de-sexy-style-barcelona',
      alt: 'Alumnas practicando Sexy Style con expresión sensual y confianza en Barcelona',
      altKey: 'classes.sexy-style.whatIs',
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
    enabled: true,
    videos: [
      {
        videoId: SEXY_STYLE_VIDEO_ID,
        title: "Sexy Style Classes at Farray's Center Barcelona",
      },
    ],
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'sexystyle',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'sexystyleCulturalHistoryTitle',
    shortDescKey: 'sexystyleCulturalShort',
    fullHistoryKey: 'sexystyleCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Sexy Style, sensualidad, expresión corporal, feminidad, coreografía, confianza',
    prerequisites: 'Ninguno',
    lessons: '6 clases semanales',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'sexystyleVideoTitle',
    descKey: 'sexystyleVideoDesc',
    thumbnailUrl: `https://img.youtube.com/vi/${SEXY_STYLE_VIDEO_ID}/maxresdefault.jpg`,
    videoId: SEXY_STYLE_VIDEO_ID,
  },

  personSchemas: [
    {
      name: 'Yasmina Fernández',
      jobTitle: 'Instructora de Sexy Style',
      description: 'Especialista en Sexy Style y estilos sensuales con amplia experiencia.',
      knowsAbout: ['Sexy Style', 'Sensual Dance', 'Femininity', 'Urban Dance'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Sexy Style -> Femmology, Sexy Reggaeton, Heels
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'femmology-barcelona',
        nameKey: 'relatedFemmologyName',
        descriptionKey: 'relatedFemmologyDesc',
      },
      {
        slug: 'sexy-reggaeton-barcelona',
        nameKey: 'relatedSexyReggaetonName',
        descriptionKey: 'relatedSexyReggaetonDesc',
      },
      {
        slug: 'heels-barcelona',
        nameKey: 'relatedHeelsName',
        descriptionKey: 'relatedHeelsDesc',
      },
    ],
  },
};
