/**
 * Folklore Cubano Page Configuration
 *
 * This file contains all the configuration needed for the FullDanceClassTemplate
 * to render the complete Folklore Cubano page.
 */
import {
  FOLKLORE_CUBANO_TESTIMONIALS,
  FOLKLORE_CUBANO_FAQS_CONFIG,
  FOLKLORE_CUBANO_SCHEDULE_KEYS,
  FOLKLORE_CUBANO_LEVELS,
  FOLKLORE_CUBANO_PREPARE_CONFIG,
} from './folklore-cubano';
import { getTeacherForClass } from './teacher-registry';
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';

export const FOLKLORE_CUBANO_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'folklore',
  stylePath: 'folklore-cubano',

  // === REQUIRED DATA ===
  faqsConfig: FOLKLORE_CUBANO_FAQS_CONFIG,
  testimonials: FOLKLORE_CUBANO_TESTIMONIALS,
  scheduleKeys: FOLKLORE_CUBANO_SCHEDULE_KEYS,

  // Teachers (sistema centralizado con fotos optimizadas)
  teachers: [
    getTeacherForClass('grechen-mendez', 'folkloreCubano', ['Folklore', 'Danzas Cubanas']),
  ],

  // Breadcrumb (4 levels: Home > Classes > Salsa/Bachata > Folklore Cubano)
  breadcrumbConfig: {
    homeKey: 'folkloreBreadcrumbHome',
    classesKey: 'folkloreBreadcrumbClasses',
    categoryKey: 'folkloreBreadcrumbCategory',
    categoryUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'folkloreBreadcrumbCurrent',
  },

  // === OPTIONAL DATA ===
  levels: FOLKLORE_CUBANO_LEVELS,
  prepareConfig: FOLKLORE_CUBANO_PREPARE_CONFIG,

  // === HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 450,
    funPercent: 100,
    gradientColor: 'amber',

    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/folklore-cubano/img/folklore-calle-habana',
      alt: "Bailarina ejecutando danza Yoruba de Folklore Cubano en las calles de La Habana - Tradición afrocubana en Farray's Center Barcelona",
      altKey: 'styleImages.folkloreCubano.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'] as const,
    },
    heroVisuals: {
      imageOpacity: 50,
      objectPosition: 'center 35%',
      gradientStyle: 'dark' as const,
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    optimizedImage: {
      basePath: '/images/classes/folklore-cubano/img/folklore-calle-habana',
      altKey: 'classes.folklore-cubano.whatIs',
      alt: 'Grupo de estudiantes aprendiendo danzas a los Orishas y folklore cubano tradicional en academia de Barcelona',
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
    enabled: false,
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
    enabled: false, // No video yet
  },

  logosSection: {
    enabled: true,
    // Uses default logos (UNESCO, Street Dance 2, The Dancer, Telecinco)
  },

  nearbySection: {
    enabled: true,
    keyPrefix: 'folklore',
  },

  // Disable testimonials and FAQ sections
  testimonialsSection: {
    enabled: false,
  },
  faqSection: {
    enabled: false,
  },

  culturalHistory: {
    enabled: true,
    titleKey: 'folkloreCulturalHistoryTitle',
    shortDescKey: 'folkloreCulturalShort',
    fullHistoryKey: 'folkloreCulturalFull',
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
    teaches: 'Folklore Cubano, danzas a los Orishas, Yoruba, rumba cubana, expresión corporal',
    prerequisites: 'Ninguno',
    lessons: '2 clases semanales',
    duration: 'PT1H',
  },

  // Person schemas for teachers (for rich snippets)
  personSchemas: [
    {
      name: 'Grechén Mendez',
      jobTitle: 'Maestra Internacional de Danzas Afrocubanas',
      description:
        'Maestra internacional de referencia en danzas afrocubanas con más de 25 años de experiencia. Formada en el Instituto Superior de Arte de Cuba (ISA), especializada en Folklore Cubano, danzas a los Orishas y ritmos afrocubanos.',
      knowsAbout: [
        'Folklore Cubano',
        'Danzas Yoruba',
        'Orishas',
        'Rumba Cubana',
        'Afrocubano',
        'Danzas Afrocubanas',
      ],
    },
  ],

  // === RELATED CLASSES (internal linking) ===
  // Folklore Cubano -> Salsa Cubana, Timba, Afro Contemporáneo
  relatedClasses: {
    enabled: true,
    classes: [
      {
        slug: 'salsa-cubana-barcelona',
        nameKey: 'relatedSalsaCubanaName',
        descriptionKey: 'relatedSalsaCubanaDesc',
      },
      {
        slug: 'timba-barcelona',
        nameKey: 'relatedTimbaName',
        descriptionKey: 'relatedTimbaDesc',
      },
      {
        slug: 'afro-contemporaneo-barcelona',
        nameKey: 'relatedAfroContemporaneoName',
        descriptionKey: 'relatedAfroContemporaneoDesc',
      },
    ],
  },
};
