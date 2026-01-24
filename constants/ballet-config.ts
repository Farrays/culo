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
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const BALLET_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'ballet',
  stylePath: 'ballet-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: BALLET_FAQS_CONFIG,
  testimonials: BALLET_TESTIMONIALS,
  scheduleKeys: BALLET_SCHEDULE_KEYS,

  // Teachers (sistema centralizado de profesores)
  teachers: [
    getTeacherForClass('daniel-sene', 'ballet', ['ENA Cuba', 'Técnica Cubana']),
    getTeacherForClass('alejandro-minoso', 'ballet', ['ENA Cuba', 'Modern Jazz']),
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
    gradientColor: 'emerald',

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/ballet/img/clases-ballet-barcelona',
      alt: "Clases de Ballet Clásico en Barcelona - Farray's Center",
      altKey: 'styleImages.ballet.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'] as const,
    },
    heroVisuals: {
      imageOpacity: 45,
      objectPosition: 'center 30%',
      gradientStyle: 'dark' as const,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // Enterprise: OptimizedImage with AVIF/WebP/JPG multi-format srcset
    optimizedImage: {
      basePath: '/images/classes/ballet/img/clases-ballet-barcelona',
      alt: 'Estudiantes de ballet clásico practicando posiciones en la barra en academia de Barcelona',
      altKey: 'styleImages.ballet.whatIs',
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
    enabled: true, // Shows "Video Próximamente" placeholder
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

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'general',
    limit: 6,
    showGoogleBadge: true,
  },

  // === ARTISTIC DANCE COMPARISON TABLE ===
  artisticDanceComparison: {
    enabled: true,
    highlightedStyle: 'ballet',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teachesKey: 'schema_ballet_teaches',
    prerequisitesKey: 'schema_ballet_prerequisites',
    lessonsKey: 'schema_ballet_lessons',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Daniel Sené',
      jobTitleKey: 'schema_daniel_jobTitle_ballet',
      descriptionKey: 'schema_daniel_description_ballet',
      knowsAbout: ['Ballet Clásico', 'Técnica Cubana', 'Danza Contemporánea'],
    },
    {
      name: 'Alejandro Miñoso',
      jobTitleKey: 'schema_alejandro_jobTitle_ballet',
      descriptionKey: 'schema_alejandro_description_ballet',
      knowsAbout: ['Ballet Clásico', 'Técnica Cubana', 'Contemporáneo'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Ballet -> Contemporáneo, Modern Jazz, Stretching
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'contemporaneo-barcelona',
        nameKey: 'relatedContemporaneoName',
        descriptionKey: 'relatedContemporaneoDesc',
      },
      {
        slug: 'modern-jazz-barcelona',
        nameKey: 'relatedModernJazzName',
        descriptionKey: 'relatedModernJazzDesc',
      },
      {
        slug: 'stretching-barcelona',
        nameKey: 'relatedStretchingName',
        descriptionKey: 'relatedStretchingDesc',
      },
    ],
  },
};
