import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for AfroJazz page (15 FAQs for comprehensive SEO)
export const AFRO_JAZZ_FAQS_CONFIG: FAQ[] = [
  { id: 'afro-jazz-1', questionKey: 'afrojazzFaqQ1', answerKey: 'afrojazzFaqA1' },
  { id: 'afro-jazz-2', questionKey: 'afrojazzFaqQ2', answerKey: 'afrojazzFaqA2' },
  { id: 'afro-jazz-3', questionKey: 'afrojazzFaqQ3', answerKey: 'afrojazzFaqA3' },
  { id: 'afro-jazz-4', questionKey: 'afrojazzFaqQ4', answerKey: 'afrojazzFaqA4' },
  { id: 'afro-jazz-5', questionKey: 'afrojazzFaqQ5', answerKey: 'afrojazzFaqA5' },
  { id: 'afro-jazz-6', questionKey: 'afrojazzFaqQ6', answerKey: 'afrojazzFaqA6' },
  { id: 'afro-jazz-7', questionKey: 'afrojazzFaqQ7', answerKey: 'afrojazzFaqA7' },
  { id: 'afro-jazz-8', questionKey: 'afrojazzFaqQ8', answerKey: 'afrojazzFaqA8' },
  { id: 'afro-jazz-9', questionKey: 'afrojazzFaqQ9', answerKey: 'afrojazzFaqA9' },
  { id: 'afro-jazz-10', questionKey: 'afrojazzFaqQ10', answerKey: 'afrojazzFaqA10' },
  { id: 'afro-jazz-11', questionKey: 'afrojazzFaqQ11', answerKey: 'afrojazzFaqA11' },
  { id: 'afro-jazz-12', questionKey: 'afrojazzFaqQ12', answerKey: 'afrojazzFaqA12' },
  { id: 'afro-jazz-13', questionKey: 'afrojazzFaqQ13', answerKey: 'afrojazzFaqA13' },
  { id: 'afro-jazz-14', questionKey: 'afrojazzFaqQ14', answerKey: 'afrojazzFaqA14' },
  { id: 'afro-jazz-15', questionKey: 'afrojazzFaqQ15', answerKey: 'afrojazzFaqA15' },
];

// Testimonials for AfroJazz page (extends Google reviews with specific testimonial)
export const AFRO_JAZZ_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Elena R.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The Afro Jazz classes with Yunaisy have transformed my versatility as a dancer. The fusion of techniques is unique and the methodology is truly professional.',
      es: 'Las clases de Afro Jazz con Yunaisy han transformado mi versatilidad como bailarina. La fusión de técnicas es única y la metodología es realmente profesional.',
      ca: "Les classes d'Afro Jazz amb Yunaisy han transformat la meva versatilitat com a ballarina. La fusió de tècniques és única i la metodologia és realment professional.",
      fr: "Les cours d'Afro Jazz avec Yunaisy ont transformé ma polyvalence en tant que danseuse. La fusion des techniques est unique et la méthodologie est vraiment professionnelle.",
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const AFRO_JAZZ_COURSE_CONFIG = {
  teaches:
    'Afro Jazz, fusión Afro Contemporáneo + Jazz, técnica ENA, improvisación, interpretación musical',
  prerequisites: 'Experiencia previa en danza recomendada',
  lessons: 'Clases semanales de perfeccionamiento',
  duration: 'PT1H30M',
};

// Schedule data for AfroJazz classes
export const AFRO_JAZZ_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'wednesday',
    className: 'Afro Jazz Básico',
    time: '12:00 - 13:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicLevel',
  },
  {
    id: '2',
    dayKey: 'thursday',
    className: 'Afro Jazz Intermedio/Avanzado',
    time: '19:00 - 20:30',
    teacher: 'Yunaisy Farray',
    levelKey: 'intermediateAdvancedLevel',
  },
];

// Breadcrumb custom keys for AfroJazz (4 levels: Home > Classes > Urban > Current)
export const AFRO_JAZZ_BREADCRUMB_KEYS = {
  home: 'afrojazzBreadcrumbHome',
  classes: 'afrojazzBreadcrumbClasses',
  urban: 'afrojazzBreadcrumbUrban',
  current: 'afrojazzBreadcrumbCurrent',
};

// YouTube video ID for the page (update with real video)
export const AFRO_JAZZ_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID';

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const AFRO_JAZZ_GEO_KEYS = {
  origin: 'afrojazzCitableOrigen',
  statistics: 'afrojazzStatistics',
  globalEvolution: 'afrojazzCitableEvolucionGlobal',
  music: 'afrojazzCitableMusica',
  identityPower: 'afrojazzCitableIdentidadPoder',
  fact1: 'afrojazzCitableFact1', // Calorías quemadas
  fact2: 'afrojazzCitableFact2', // Beneficios cognitivos
  fact3: 'afrojazzCitableFact3', // Valoración Google
};

// Hero Stats configuration (for AnimatedCounter)
export const AFRO_JAZZ_HERO_STATS = {
  minutes: '60-90', // Clases de 60 o 90 minutos
  calories: 500, // Calorías quemadas por clase
  funPercent: 100,
};

// Level descriptions for cards - 2 levels
export const AFRO_JAZZ_LEVELS = [
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'afrojazzLevelBasicTitle',
    descKey: 'afrojazzLevelBasicDesc',
    duration: '0-6 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio-avanzado',
    levelKey: 'intermediateAdvancedLevel',
    titleKey: 'afrojazzLevelIntAdvTitle',
    descKey: 'afrojazzLevelIntAdvDesc',
    duration: '+6 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const AFRO_JAZZ_PREPARE_CONFIG = {
  prefix: 'afrojazzPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Yunaisy Farray',
    credential: 'Creadora de Afro Jazz Fusión',
    image: '/images/teachers/img/yunaisy-farray-directora_320.webp',
  },
};
