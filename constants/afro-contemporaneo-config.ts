/**
 * Afro Contemporáneo Page Configuration
 * All configuration needed for the FullDanceClassTemplate
 */
import {
  AFRO_CONTEMPORANEO_TESTIMONIALS,
  AFRO_CONTEMPORANEO_FAQS_CONFIG,
  AFRO_CONTEMPORANEO_SCHEDULE_KEYS,
  AFRO_CONTEMPORANEO_LEVELS,
  AFRO_CONTEMPORANEO_PREPARE_CONFIG,
  AFRO_CONTEMPORANEO_NEARBY_AREAS,
} from './afro-contemporaneo';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const AFRO_CONTEMPORANEO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'afrocontemporaneo',
  stylePath: 'afro-contemporaneo-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: AFRO_CONTEMPORANEO_FAQS_CONFIG,
  testimonials: AFRO_CONTEMPORANEO_TESTIMONIALS,
  scheduleKeys: AFRO_CONTEMPORANEO_SCHEDULE_KEYS,

  // Teachers (sistema centralizado de profesores)
  teachers: [
    getTeacherForClass('yunaisy-farray', 'afrocontemporaneo', [
      'Directora',
      'CID-UNESCO',
      'ENA Cuba',
    ]),
    getTeacherForClass('charlie-breezy', 'afrocontemporaneo', ['Afro', 'Urban']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Dance > Afro Contemporáneo)
  breadcrumbConfig: {
    homeKey: 'afrocontemporaneoBreadcrumbHome',
    classesKey: 'afrocontemporaneoBreadcrumbClasses',
    categoryKey: 'afrocontemporaneoBreadcrumbUrban',
    categoryUrl: '/clases/danza-barcelona',
    currentKey: 'afrocontemporaneoBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: AFRO_CONTEMPORANEO_LEVELS,
  prepareConfig: AFRO_CONTEMPORANEO_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'emerald',
    heroImage: {
      basePath: '/images/classes/afro-contemporaneo/img/mgs_5260',
      alt: 'Clases de Afro Contemporáneo en Barcelona - Técnica cubana ENA',
      altKey: 'styleImages.afroContemporaneo.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'],
    },
    heroVisuals: {
      imageOpacity: 45,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    // Enterprise OptimizedImage with i18n alt text support
    optimizedImage: {
      basePath: '/images/classes/afro-contemporaneo/img/mgs_5260',
      altKey: 'classes.afro-contemporaneo.whatIs',
      alt: "Clases de Afro Contemporáneo en Barcelona - Técnica cubana ENA en Farray's Center",
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
    bunnyVideo: {
      videoId: '9f2604a0-fed7-4133-bc56-dc1e8cfe95fa',
      libraryId: '571535',
      title: 'Clase de Afro Contemporáneo en Barcelona',
      aspectRatio: '9:16', // Formato vertical (Reel)
      thumbnailUrl:
        'https://vz-3d56a778-175.b-cdn.net/9f2604a0-fed7-4133-bc56-dc1e8cfe95fa/thumbnail_94c0fef4.jpg',
      // SEO: Campos para VideoObject schema (Google Video indexing)
      description:
        'Afro Contemporáneo en Barcelona. Fusión única de danza africana y contemporánea. Movimientos orgánicos y expresión emocional.',
      uploadDate: '2024-08-05',
      duration: 'PT1M25S', // 1 min 25 sec
    },
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'afrocontemporaneo',
    areas: AFRO_CONTEMPORANEO_NEARBY_AREAS,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'afrocontemporaneoCulturalHistoryTitle',
    shortDescKey: 'afrocontemporaneoCulturalShort',
    fullHistoryKey: 'afrocontemporaneoCulturalFull',
  },

  // === ARTISTIC DANCE COMPARISON TABLE ===
  artisticDanceComparison: {
    enabled: true,
    highlightedStyle: 'afrocontemporaneo',
  },

  // === GOOGLE REVIEWS SECTION ===
  googleReviewsSection: {
    enabled: true,
    category: 'general',
    limit: 6,
    showGoogleBadge: true,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teachesKey: 'schema_afroContemporaneo_teaches',
    prerequisitesKey: 'schema_afroContemporaneo_prerequisites',
    lessonsKey: 'schema_afroContemporaneo_lessons',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitleKey: 'schema_yunaisy_jobTitle_afroContemporaneo',
      descriptionKey: 'schema_yunaisy_description_afroContemporaneo',
      knowsAbout: ['Afro Contemporáneo', 'DCC', 'Cuban Dance', 'ENA Technique', 'Choreography'],
    },
    {
      name: 'Charlie Breezy',
      jobTitleKey: 'schema_charlie_jobTitle',
      descriptionKey: 'schema_charlie_description',
      knowsAbout: ['Afro Contemporáneo', 'Urban Dance', 'African Dance'],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Afro Contemporáneo -> Contemporáneo, Afro Jazz, Afrobeats
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'contemporaneo-barcelona',
        nameKey: 'relatedContemporaneoName',
        descriptionKey: 'relatedContemporaneoDesc',
      },
      {
        slug: 'afro-jazz-barcelona',
        nameKey: 'relatedAfroJazzName',
        descriptionKey: 'relatedAfroJazzDesc',
      },
      {
        slug: 'afrobeats-barcelona',
        nameKey: 'relatedAfrobeatsName',
        descriptionKey: 'relatedAfrobeatsDesc',
      },
    ],
  },
};
