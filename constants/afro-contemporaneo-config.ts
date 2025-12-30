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
import { getTeacherInfo } from './teacher-images';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const AFRO_CONTEMPORANEO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'afrocontemporaneo',
  stylePath: 'afro-contemporaneo-barcelona',

  // === REQUIRED DATA ===
  faqsConfig: AFRO_CONTEMPORANEO_FAQS_CONFIG,
  testimonials: AFRO_CONTEMPORANEO_TESTIMONIALS,
  scheduleKeys: AFRO_CONTEMPORANEO_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [
    getTeacherInfo(
      'yunaisy-farray',
      'afrocontemporaneoTeacher1Specialty',
      'afrocontemporaneoTeacher1Bio',
      ['Directora', 'CID-UNESCO', 'ENA Cuba']
    ),
    getTeacherInfo(
      'charlie-breezy',
      'afrocontemporaneoTeacher2Specialty',
      'afrocontemporaneoTeacher2Bio',
      ['Afro', 'Urban']
    ),
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
      videoId: 'e5a3686f-1548-46bf-ba24-a46c4e053002',
      libraryId: '570522',
      title: 'Clase de Afro Contemporáneo en Barcelona',
      aspectRatio: '9:16', // Formato vertical (Reel)
      thumbnailUrl:
        'https://vz-c354d67e-cc3.b-cdn.net/e5a3686f-1548-46bf-ba24-a46c4e053002/thumbnail.jpg',
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

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Afro Contemporáneo, técnica cubana ENA, disociación corporal, folklore afrocubano',
    prerequisites: 'Ninguno - clases para todos los niveles',
    lessons: 'Clases semanales de perfeccionamiento',
    duration: 'PT1H',
  },

  personSchemas: [
    {
      name: 'Yunaisy Farray',
      jobTitle: "Directora de Farray's Center",
      description:
        'Bailarina profesional cubana formada en la ENA, especialista en Danza Contemporánea Cubana.',
      knowsAbout: ['Afro Contemporáneo', 'DCC', 'Cuban Dance', 'ENA Technique', 'Choreography'],
    },
    {
      name: 'Charlie Breezy',
      jobTitle: 'Profesor de Afro Contemporáneo',
      description: 'Bailarín profesional con experiencia en estilos afro y urbanos.',
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
