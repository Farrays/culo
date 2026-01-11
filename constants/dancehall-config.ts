/**
 * Dancehall Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete Dancehall page. Migrating from 990 lines to ~100 lines of config.
 */
import {
  DANCEHALL_TESTIMONIALS,
  DANCEHALL_FAQS_CONFIG,
  DANCEHALL_SCHEDULE_KEYS,
  DANCEHALL_LEVELS,
  DANCEHALL_PREPARE_CONFIG,
} from './dancehall';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const DANCEHALL_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'dhV3',
  stylePath: 'dancehall-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: DANCEHALL_FAQS_CONFIG,
  testimonials: DANCEHALL_TESTIMONIALS,
  scheduleKeys: DANCEHALL_SCHEDULE_KEYS,

  // Teachers (using enterprise centralized system)
  // Specialty: contextual from dhV3.teacher.*.specialty
  // Bio: canonical from teacher.*.bio (source of truth)
  teachers: [
    getTeacherForClass('isabel-lopez', 'dhV3', ['Dancehall Female', 'Competidora Internacional']),
    getTeacherForClass('sandra-gomez', 'dhV3', ['Twerk', 'Dancehall']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Urban > Dancehall)
  breadcrumbConfig: {
    homeKey: 'dhV3BreadcrumbHome',
    classesKey: 'dhV3BreadcrumbClasses',
    categoryKey: 'dhV3BreadcrumbUrban',
    categoryUrl: '/clases/danzas-urbanas-barcelona',
    currentKey: 'dhV3BreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: DANCEHALL_LEVELS,
  prepareConfig: DANCEHALL_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'rose',

    // Enterprise: Hero background image (limited breakpoints - no avif)
    heroImage: {
      basePath: '/images/classes/dancehall/img/dancehall-classes-barcelona-01',
      alt: "Clases de Dancehall en Barcelona - Farray's International Dance Center",
      altKey: 'styleImages.dancehall.hero',
      breakpoints: [640, 960, 1440],
      formats: ['webp', 'jpg'] as const,
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
    image: {
      src: '/images/classes/dancehall/img/dancehall-classes-barcelona-01_960.webp',
      srcSet:
        '/images/classes/dancehall/img/dancehall-classes-barcelona-01_480.webp 480w, /images/classes/dancehall/img/dancehall-classes-barcelona-01_960.webp 960w',
      alt: 'Clases de Dancehall en Barcelona - Estudiantes bailando en la academia',
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

  // Why Us vs Others Comparison Table - DISABLED (redundant with other sections)
  whyUsComparison: {
    enabled: false,
    rowCount: 8,
    meaningCount: 4,
    showCTA: true,
  },

  videoSection: {
    enabled: true,
    videos: [
      {
        videoId: '79nTjrMB7_A',
        title: "Dancehall Classes at Farray's Center Barcelona",
      },
    ],
    placeholderCount: 0, // No placeholders, only real video
  },

  logosSection: {
    enabled: true,
    // Uses default logos (UNESCO, Street Dance 2, The Dancer, Telecinco)
  },

  nearbySection: {
    enabled: true,
    // Uses 'dancehall' prefix for translations (dancehallNearbyTitle, etc.)
    keyPrefix: 'dancehall',
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'dhV3CulturalTitle',
    shortDescKey: 'dhV3CulturalShort',
    fullHistoryKey: 'dhV3CulturalFull',
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Dancehall jamaicano, técnica de danza urbana, musicalidad',
    prerequisites: 'Ninguno',
    lessons: '6 clases semanales',
    duration: 'PT1H',
  },

  videoSchema: {
    titleKey: 'dhV3VideoTitle',
    descKey: 'dhV3VideoDesc',
    thumbnailUrl: 'https://www.farrayscenter.com/images/classes/dancehall/video-thumbnail.jpg',
    videoId: '79nTjrMB7_A',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Isabel López',
      jobTitle: 'Instructora de Dancehall',
      description:
        'Especialista en Dancehall con experiencia en competiciones internacionales y formación en Jamaica.',
      knowsAbout: ['Dancehall', 'Dancehall Female', 'Dancehall Twerk', 'Jamaican Dance'],
    },
    {
      name: 'Sandra Gómez',
      jobTitle: 'Instructora de Dancehall',
      description:
        'Profesora de Dancehall Female y estilos urbanos con amplia experiencia en pedagogía de la danza.',
      knowsAbout: ['Dancehall', 'Dancehall Female', 'Urban Dance', 'Choreography'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Dancehall -> Twerk, Afrobeats, Reggaeton Cubano
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'twerk-barcelona',
        nameKey: 'relatedTwerkName',
        descriptionKey: 'relatedTwerkDesc',
      },
      {
        slug: 'afrobeats-barcelona',
        nameKey: 'relatedAfrobeatsName',
        descriptionKey: 'relatedAfrobeatsDesc',
      },
      {
        slug: 'reggaeton-cubano-barcelona',
        nameKey: 'relatedReggaetonCubanoName',
        descriptionKey: 'relatedReggaetonCubanoDesc',
      },
    ],
  },
};
