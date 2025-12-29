/**
 * Afro Contemporáneo V2 Test Configuration
 * =========================================
 * Configuración para probar el template V2 con datos reales de Afro Contemporáneo
 * Ruta: /test/afro-contemporaneo-v2
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
import type { FullDanceClassConfigV2 } from '../components/templates/FullDanceClassTemplateV2';

export const AFRO_CONTEMPORANEO_V2_CONFIG: FullDanceClassConfigV2 = {
  // === IDENTIFICATION ===
  styleKey: 'afrocontemporaneo',
  stylePath: 'afro-contemporaneo-v2',

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

  // Breadcrumb
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
  nearbyAreas: AFRO_CONTEMPORANEO_NEARBY_AREAS,

  // === V2 HERO CONFIG ===
  hero: {
    minutes: 60,
    calories: 500,
    funPercent: 100,
    gradientColor: 'emerald',
    // Video placeholder - reemplazar con video real de afro contemporáneo
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    // Enterprise: Hero background image
    heroImage: {
      basePath: '/images/classes/afro-contemporaneo/img/mgs_5260',
      alt: 'Clases de Afro Contemporáneo en Barcelona - Técnica cubana ENA',
      altKey: 'styleImages.afroContemporaneo.hero',
      breakpoints: [320, 640, 768, 1024, 1440, 1920],
      formats: ['avif', 'webp', 'jpg'],
    },
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 5,
    hasQuestionAnswer: true,
    showQuote: true,
    showCTA: true,
    image: {
      src: '/images/classes/afro-contemporaneo/img/clases-afro-contemporaneo-barcelona_960.webp',
      srcSet:
        '/images/classes/afro-contemporaneo/img/clases-afro-contemporaneo-barcelona_480.webp 480w, /images/classes/afro-contemporaneo/img/clases-afro-contemporaneo-barcelona_960.webp 960w',
      alt: 'Clases de Afro Contemporáneo en Barcelona - Técnica cubana ENA',
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
    keyPrefix: 'afrocontemporaneo',
    areas: AFRO_CONTEMPORANEO_NEARBY_AREAS,
  },

  // === SCHEMA MARKUP ===
  courseConfig: {
    teaches: 'Afro Contemporáneo, técnica cubana ENA, disociación corporal, folklore afrocubano',
    prerequisites: 'Ninguno - clases para todos los niveles',
    lessons: 'Clases semanales de perfeccionamiento',
    duration: 'PT1H',
  },
};
