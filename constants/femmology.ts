import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Femmology page (15 FAQs for comprehensive SEO)
export const FEMMOLOGY_FAQS_CONFIG: FAQ[] = [
  { id: 'fem-1', questionKey: 'femFaqQ1', answerKey: 'femFaqA1' },
  { id: 'fem-2', questionKey: 'femFaqQ2', answerKey: 'femFaqA2' },
  { id: 'fem-3', questionKey: 'femFaqQ3', answerKey: 'femFaqA3' },
  { id: 'fem-4', questionKey: 'femFaqQ4', answerKey: 'femFaqA4' },
  { id: 'fem-5', questionKey: 'femFaqQ5', answerKey: 'femFaqA5' },
  { id: 'fem-6', questionKey: 'femFaqQ6', answerKey: 'femFaqA6' },
  { id: 'fem-7', questionKey: 'femFaqQ7', answerKey: 'femFaqA7' },
  { id: 'fem-8', questionKey: 'femFaqQ8', answerKey: 'femFaqA8' },
  { id: 'fem-9', questionKey: 'femFaqQ9', answerKey: 'femFaqA9' },
  { id: 'fem-10', questionKey: 'femFaqQ10', answerKey: 'femFaqA10' },
  { id: 'fem-11', questionKey: 'femFaqQ11', answerKey: 'femFaqA11' },
  { id: 'fem-12', questionKey: 'femFaqQ12', answerKey: 'femFaqA12' },
  { id: 'fem-13', questionKey: 'femFaqQ13', answerKey: 'femFaqA13' },
  { id: 'fem-14', questionKey: 'femFaqQ14', answerKey: 'femFaqA14' },
  { id: 'fem-15', questionKey: 'femFaqQ15', answerKey: 'femFaqA15' },
];

// Testimonials for Femmology page (extends Google reviews with specific testimonial)
export const FEMMOLOGY_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'María del Carmen R.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Femmology has been a before and after in my life. I came with fears and insecurities, and I leave each class feeling like a more complete woman. Yunaisy is not just a teacher, she is a guide on the path to self-love.',
      es: 'Femmology ha sido un antes y un después en mi vida. Llegué con miedos e inseguridades, y salgo de cada clase sintiéndome una mujer más completa. Yunaisy no es solo una profesora, es una guía en el camino hacia el amor propio.',
      ca: "Femmology ha estat un abans i un després a la meva vida. Vaig arribar amb pors i inseguretats, i surto de cada classe sentint-me una dona més completa. Yunaisy no és només una professora, és una guia en el camí cap a l'amor propi.",
      fr: "Femmology a été un avant et un après dans ma vie. Je suis arrivée avec des peurs et des insécurités, et je sors de chaque cours en me sentant une femme plus complète. Yunaisy n'est pas seulement une professeure, c'est une guide sur le chemin de l'amour de soi.",
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const FEMMOLOGY_COURSE_CONFIG = {
  teaches:
    'Femmology, danzaterapia, baile en tacones, feminidad, sensualidad, autoestima, postura, disociación corporal',
  prerequisites: 'Ninguno',
  lessons: '2 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Femmology classes
export const FEMMOLOGY_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'tuesday',
    className: 'Femmology Heels Technique Intermedio',
    time: '20:30 - 21:30',
    teacher: 'Yunaisy Farray',
    levelKey: 'intermediateLevel',
  },
  {
    id: '2',
    dayKey: 'tuesday',
    className: 'Femmology Heels Technique Avanzado',
    time: '21:30 - 23:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'advancedLevel',
  },
  {
    id: '3',
    dayKey: 'wednesday',
    className: 'Femmology Heels Technique Básico',
    time: '21:00 - 22:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'basicLevel',
  },
  {
    id: '4',
    dayKey: 'thursday',
    className: 'Femmology Heels Technique Principiantes',
    time: '21:30 - 22:30',
    teacher: 'Yunaisy Farray',
    levelKey: 'beginnerLevel',
  },
];

// Breadcrumb custom keys for Femmology (5 levels: Home > Classes > Urban > Heels > Current)
export const FEMMOLOGY_BREADCRUMB_KEYS = {
  home: 'femBreadcrumbHome',
  classes: 'femBreadcrumbClasses',
  urban: 'femBreadcrumbUrban',
  heels: 'femBreadcrumbHeels',
  current: 'femBreadcrumbCurrent',
};

// YouTube video ID for the page (Yunaisy Farray showcase)
export const FEMMOLOGY_VIDEO_ID = 'dQw4w9WgXcQ'; // Placeholder - replace with actual video

// Level descriptions for cards - 3 levels
export const FEMMOLOGY_LEVELS = [
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'femLevelBasicTitle',
    descKey: 'femLevelBasicDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'femLevelInterTitle',
    descKey: 'femLevelInterDesc',
    duration: '3-9 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'femLevelAdvancedTitle',
    descKey: 'femLevelAdvancedDesc',
    duration: '+9 meses',
    color: 'primary-accent' as const,
  },
];

import { getTeacherQuoteInfo } from './teacher-images';

// Prepare class configuration
export const FEMMOLOGY_PREPARE_CONFIG = {
  prefix: 'femPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: getTeacherQuoteInfo('yunaisy-farray', 'Creadora de Femmology'),
};
