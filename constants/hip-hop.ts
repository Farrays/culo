import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Hip Hop page (15 FAQs for comprehensive SEO)
export const HIPHOP_FAQS_CONFIG: FAQ[] = [
  { id: 'hiphop-1', questionKey: 'hiphopFaqQ1', answerKey: 'hiphopFaqA1' },
  { id: 'hiphop-2', questionKey: 'hiphopFaqQ2', answerKey: 'hiphopFaqA2' },
  { id: 'hiphop-3', questionKey: 'hiphopFaqQ3', answerKey: 'hiphopFaqA3' },
  { id: 'hiphop-4', questionKey: 'hiphopFaqQ4', answerKey: 'hiphopFaqA4' },
  { id: 'hiphop-5', questionKey: 'hiphopFaqQ5', answerKey: 'hiphopFaqA5' },
  { id: 'hiphop-6', questionKey: 'hiphopFaqQ6', answerKey: 'hiphopFaqA6' },
  { id: 'hiphop-7', questionKey: 'hiphopFaqQ7', answerKey: 'hiphopFaqA7' },
  { id: 'hiphop-8', questionKey: 'hiphopFaqQ8', answerKey: 'hiphopFaqA8' },
  { id: 'hiphop-9', questionKey: 'hiphopFaqQ9', answerKey: 'hiphopFaqA9' },
  { id: 'hiphop-10', questionKey: 'hiphopFaqQ10', answerKey: 'hiphopFaqA10' },
  { id: 'hiphop-11', questionKey: 'hiphopFaqQ11', answerKey: 'hiphopFaqA11' },
  { id: 'hiphop-12', questionKey: 'hiphopFaqQ12', answerKey: 'hiphopFaqA12' },
  { id: 'hiphop-13', questionKey: 'hiphopFaqQ13', answerKey: 'hiphopFaqA13' },
  { id: 'hiphop-14', questionKey: 'hiphopFaqQ14', answerKey: 'hiphopFaqA14' },
  { id: 'hiphop-15', questionKey: 'hiphopFaqQ15', answerKey: 'hiphopFaqA15' },
];

// Testimonials for Hip Hop page (4 testimonials: 3 Google reviews + 1 specific)
export const HIPHOP_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Carlos R.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Marcos is an incredible teacher. His experience as an international judge shows in every class. The best Hip Hop classes in Barcelona!',
      es: 'Marcos es un profesor increíble. Su experiencia como juez internacional se nota en cada clase. ¡Las mejores clases de Hip Hop de Barcelona!',
      ca: 'Marcos és un professor increïble. La seva experiència com a jutge internacional es nota a cada classe. Les millors classes de Hip Hop de Barcelona!',
      fr: 'Marcos est un professeur incroyable. Son expérience en tant que juge international se ressent dans chaque cours. Les meilleurs cours de Hip Hop à Barcelone !',
    },
  },
];

// Course schema configuration
export const HIPHOP_COURSE_CONFIG = {
  teaches: 'Hip Hop, Breaking, Locking, Popping, Freestyle, Urban Dance',
  prerequisites: 'Ninguno - clases para todos los niveles',
  lessons: '1 clase semanal',
  duration: 'PT1H',
};

// Schedule data for Hip Hop classes
export const HIPHOP_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'thursday',
    className: 'Hip Hop Urbano Open Level',
    time: '20:00 - 21:00',
    teacher: 'Marcos Martínez',
    levelKey: 'allLevels',
  },
];

// Level descriptions
export const HIPHOP_LEVELS = [
  {
    id: 'open',
    levelKey: 'allLevels',
    titleKey: 'hiphopLevelOpenTitle',
    descKey: 'hiphopLevelOpenDesc',
    teacher: 'Marcos Martínez',
    schedule: 'Jueves 20:00 - 21:00',
    color: 'purple',
  },
];

// Breadcrumb custom keys for Hip Hop (4 niveles)
export const HIPHOP_BREADCRUMB_KEYS = {
  home: 'hiphopBreadcrumbHome',
  classes: 'hiphopBreadcrumbClasses',
  urban: 'hiphopBreadcrumbUrban',
  current: 'hiphopBreadcrumbCurrent',
};

// Nearby neighborhoods for local SEO
export const HIPHOP_NEARBY_AREAS = [
  { name: 'Plaza España', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estació', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];

// YouTube video ID
export const HIPHOP_VIDEO_ID = 'dQw4w9WgXcQ';

// Hero Stats configuration
export const HIPHOP_HERO_STATS = {
  minutes: '60',
  calories: 500,
  funPercent: 100,
};
