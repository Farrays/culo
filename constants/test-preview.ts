import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for TestPreview page (15 FAQs for comprehensive SEO)
export const TEST_PREVIEW_FAQS_CONFIG: FAQ[] = [
  { id: 'test-preview-1', questionKey: 'testpreviewFaqQ1', answerKey: 'testpreviewFaqA1' },
  { id: 'test-preview-2', questionKey: 'testpreviewFaqQ2', answerKey: 'testpreviewFaqA2' },
  { id: 'test-preview-3', questionKey: 'testpreviewFaqQ3', answerKey: 'testpreviewFaqA3' },
  { id: 'test-preview-4', questionKey: 'testpreviewFaqQ4', answerKey: 'testpreviewFaqA4' },
  { id: 'test-preview-5', questionKey: 'testpreviewFaqQ5', answerKey: 'testpreviewFaqA5' },
  { id: 'test-preview-6', questionKey: 'testpreviewFaqQ6', answerKey: 'testpreviewFaqA6' },
  { id: 'test-preview-7', questionKey: 'testpreviewFaqQ7', answerKey: 'testpreviewFaqA7' },
  { id: 'test-preview-8', questionKey: 'testpreviewFaqQ8', answerKey: 'testpreviewFaqA8' },
  { id: 'test-preview-9', questionKey: 'testpreviewFaqQ9', answerKey: 'testpreviewFaqA9' },
  { id: 'test-preview-10', questionKey: 'testpreviewFaqQ10', answerKey: 'testpreviewFaqA10' },
  { id: 'test-preview-11', questionKey: 'testpreviewFaqQ11', answerKey: 'testpreviewFaqA11' },
  { id: 'test-preview-12', questionKey: 'testpreviewFaqQ12', answerKey: 'testpreviewFaqA12' },
  { id: 'test-preview-13', questionKey: 'testpreviewFaqQ13', answerKey: 'testpreviewFaqA13' },
  { id: 'test-preview-14', questionKey: 'testpreviewFaqQ14', answerKey: 'testpreviewFaqA14' },
  { id: 'test-preview-15', questionKey: 'testpreviewFaqQ15', answerKey: 'testpreviewFaqA15' },
];

// Testimonials for TestPreview page (extends Google reviews with specific testimonial)
export const TEST_PREVIEW_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: '[TODO: Nombre del testimonio]',
    image: '/images/testimonials/placeholder-f.jpg',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The TestPreview classes are amazing. Great atmosphere and the teacher explains very well.',
      es: 'Las clases de TestPreview son increíbles. El ambiente es genial y el profesor explica muy bien.',
      ca: 'Les classes de TestPreview són increïbles. L\'ambient és genial i el professor explica molt bé.',
      fr: 'Les cours de TestPreview sont incroyables. L\'ambiance est géniale et le professeur explique très bien.',
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const TEST_PREVIEW_COURSE_CONFIG = {
  teaches: 'TestPreview, técnica de danza, musicalidad, coreografía',
  prerequisites: 'Ninguno',
  lessons: '5 clases semanales',
  duration: 'PT1H',
};

// Schedule data for TestPreview classes
export const TEST_PREVIEW_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'TestPreview Principiantes',
    time: '19:00 - 20:00',
    teacher: 'Test',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'TestPreview Básico',
    time: '20:00 - 21:00',
    teacher: 'Test',
    levelKey: 'basicLevel',
  },
  {
    id: '3',
    dayKey: 'thursday',
    className: 'TestPreview Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Test',
    levelKey: 'intermediateLevel',
  },
  {
    id: '4',
    dayKey: 'friday',
    className: 'TestPreview Avanzado',
    time: '21:00 - 22:00',
    teacher: 'Test',
    levelKey: 'advancedLevel',
  },
];

// Breadcrumb custom keys for TestPreview (4 levels: Home > Classes > Urban > Current)
export const TEST_PREVIEW_BREADCRUMB_KEYS = {
  home: 'testpreviewBreadcrumbHome',
  classes: 'testpreviewBreadcrumbClasses',
  urban: 'testpreviewBreadcrumbUrban',
  current: 'testpreviewBreadcrumbCurrent',
};

// YouTube video ID for the page (update with real video)
export const TEST_PREVIEW_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID';

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const TEST_PREVIEW_GEO_KEYS = {
  origin: 'testpreviewCitableOrigen',
  statistics: 'testpreviewStatistics',
  globalEvolution: 'testpreviewCitableEvolucionGlobal',
  music: 'testpreviewCitableMusica',
  identityPower: 'testpreviewCitableIdentidadPoder',
  fact1: 'testpreviewCitableFact1',  // Calorías quemadas
  fact2: 'testpreviewCitableFact2',  // Beneficios cognitivos
  fact3: 'testpreviewCitableFact3',  // Valoración Google
};

// Hero Stats configuration (for AnimatedCounter)
export const TEST_PREVIEW_HERO_STATS = {
  minutes: 60,
  calories: 600,  // Approximate calories burned per class
  funPercent: 100,
};
