/**
 * Hip Hop Reggaeton Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  HIP_HOP_REGGAETON_TESTIMONIALS,
  HIP_HOP_REGGAETON_FAQS_CONFIG,
  HIP_HOP_REGGAETON_SCHEDULE_KEYS,
  HIP_HOP_REGGAETON_LEVELS,
  HIP_HOP_REGGAETON_PREPARE_CONFIG,
  HIP_HOP_REGGAETON_VIDEO_ID,
} from './hip-hop-reggaeton';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const HIP_HOP_REGGAETON_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'hhr',
  stylePath: 'hip-hop-reggaeton-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: HIP_HOP_REGGAETON_FAQS_CONFIG,
  testimonials: HIP_HOP_REGGAETON_TESTIMONIALS,
  scheduleKeys: HIP_HOP_REGGAETON_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [getTeacherForClass('charlie-breezy', 'hhr', ['Hip Hop', 'Reggaeton'])],

  // Breadcrumb (4 levels: Home > Classes > Urban > Hip Hop Reggaeton)
  breadcrumbConfig: {
    homeKey: 'hhrBreadcrumbHome',
    classesKey: 'hhrBreadcrumbClasses',
    categoryKey: 'hhrBreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'hhrBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: HIP_HOP_REGGAETON_LEVELS,
  prepareConfig: HIP_HOP_REGGAETON_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'rose',
    // Enterprise: Hero background image with OptimizedImage multi-format srcset
    heroImage: {
      basePath:
        '/images/classes/hip-hop-reggaeton/img/hip-hop-reggaeton-clases-hip-hop-reaggaeton-barcelona',
      alt: "Clases de Hip Hop y Reggaetón en Barcelona - Estudiantes bailando con energía urbana en Farray's Center",
      altKey: 'styleImages.hipHopReggaeton.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'],
    },
    // Enterprise: Hero Visual Configuration - optimized for urban dance energy
    heroVisuals: {
      imageOpacity: 55, // Higher visibility to showcase dynamic urban dance movement
      objectPosition: 'center 35%', // Focus on dancers' upper bodies and choreography
      gradientStyle: 'vibrant', // Bottom-to-top gradient for energetic urban vibe
      textShadow: true, // Enhanced text contrast against vibrant dance imagery
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // Enterprise: OptimizedImage with AVIF/WebP/JPG multi-format srcset
    optimizedImage: {
      basePath: '/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona',
      alt: 'Estudiantes practicando coreografía de Hip Hop y Reggaetón en academia de Barcelona',
      altKey: 'styleImages.hipHopReggaeton.whatIs',
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
        videoId: HIP_HOP_REGGAETON_VIDEO_ID,
        title: "Hip Hop Reggaeton Classes at Farray's Center Barcelona",
      },
    ],
    placeholderCount: 0,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'hhr',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'hhrCulturalHistoryTitle',
    shortDescKey: 'hhrCulturalShort',
    fullHistoryKey: 'hhrCulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Hip Hop Reggaeton, fusión urbana, técnica de danza, improvisación, flow',
    prerequisites: 'Ninguno',
    lessons: '5 clases semanales',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'hhrVideoTitle',
    descKey: 'hhrVideoDesc',
    thumbnailUrl: `https://img.youtube.com/vi/${HIP_HOP_REGGAETON_VIDEO_ID}/maxresdefault.jpg`,
    videoId: HIP_HOP_REGGAETON_VIDEO_ID,
  },

  personSchemas: [
    {
      name: 'Charlie Breezy',
      jobTitle: 'Instructor de Hip Hop Reggaeton',
      description:
        'Especialista en fusión Hip Hop y Reggaeton con estilo único y flow característico.',
      knowsAbout: ['Hip Hop Reggaeton', 'Urban Dance', 'Reggaeton', 'Hip Hop'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Hip Hop Reggaeton -> Reggaeton Cubano, Sexy Reggaeton, Dancehall
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'reggaeton-cubano-barcelona',
        nameKey: 'relatedReggaetonCubanoName',
        descriptionKey: 'relatedReggaetonCubanoDesc',
      },
      {
        slug: 'sexy-reggaeton-barcelona',
        nameKey: 'relatedSexyReggaetonName',
        descriptionKey: 'relatedSexyReggaetonDesc',
      },
      {
        slug: 'dancehall-barcelona',
        nameKey: 'relatedDancehallName',
        descriptionKey: 'relatedDancehallDesc',
      },
    ],
  },
};
