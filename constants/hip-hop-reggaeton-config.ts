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
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const HIP_HOP_REGGAETON_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'hhr',
  stylePath: 'hip-hop-reggaeton-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: HIP_HOP_REGGAETON_FAQS_CONFIG,
  testimonials: HIP_HOP_REGGAETON_TESTIMONIALS,
  scheduleKeys: HIP_HOP_REGGAETON_SCHEDULE_KEYS,

  // Teachers
  teachers: [
    {
      name: 'Charlie Breezy',
      specialtyKey: 'hhrTeacher1Specialty',
      bioKey: 'hhrTeacher1Bio',
      image: '/images/teachers/img/profesor-hip-hop-charlie-breezy_320.webp',
    },
  ],

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
    gradientColor: 'primary',
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reggaeton-barcelona_960.webp',
      srcSet:
        '/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reggaeton-barcelona_480.webp 480w, /images/classes/hip-hop-reggaeton/img/clases-hip-hop-reggaeton-barcelona_960.webp 960w',
      alt: 'Clases de Hip Hop Reggaeton en Barcelona',
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
    placeholderCount: 2,
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
};
