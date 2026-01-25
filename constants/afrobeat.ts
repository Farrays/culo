import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Afrobeat page
export const AFROBEAT_FAQS_CONFIG: FAQ[] = [
  { id: 'afro-1', questionKey: 'afroFaqQ1', answerKey: 'afroFaqA1' },
  { id: 'afro-2', questionKey: 'afroFaqQ2', answerKey: 'afroFaqA2' },
  { id: 'afro-3', questionKey: 'afroFaqQ3', answerKey: 'afroFaqA3' },
  { id: 'afro-4', questionKey: 'afroFaqQ4', answerKey: 'afroFaqA4' },
  { id: 'afro-5', questionKey: 'afroFaqQ5', answerKey: 'afroFaqA5' },
  { id: 'afro-6', questionKey: 'afroFaqQ6', answerKey: 'afroFaqA6' },
  { id: 'afro-7', questionKey: 'afroFaqQ7', answerKey: 'afroFaqA7' },
  { id: 'afro-8', questionKey: 'afroFaqQ8', answerKey: 'afroFaqA8' },
  { id: 'afro-9', questionKey: 'afroFaqQ9', answerKey: 'afroFaqA9' },
  { id: 'afro-10', questionKey: 'afroFaqQ10', answerKey: 'afroFaqA10' },
  { id: 'afro-11', questionKey: 'afroFaqQ11', answerKey: 'afroFaqA11' },
  { id: 'afro-12', questionKey: 'afroFaqQ12', answerKey: 'afroFaqA12' },
  { id: 'afro-13', questionKey: 'afroFaqQ13', answerKey: 'afroFaqA13' },
  { id: 'afro-14', questionKey: 'afroFaqQ14', answerKey: 'afroFaqA14' },
  { id: 'afro-15', questionKey: 'afroFaqQ15', answerKey: 'afroFaqA15' },
];

// Testimonials for Afrobeat page (extends Google reviews with specific testimonial)
// Note: images are empty as we use InitialsAvatar for rendering
export const AFROBEAT_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'María García',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Afrobeats classes with Redblueh are incredible. His energy is contagious and you learn the African roots in every step.',
      es: 'Las clases de Afrobeats con Redblueh son increíbles. Su energía es contagiosa y aprendes las raíces africanas en cada paso.',
      ca: "Les classes d'Afrobeats amb Redblueh són increïbles. La seva energia és contagiosa i aprens les arrels africanes a cada pas.",
      fr: "Les cours d'Afrobeats avec Redblueh sont incroyables. Son énergie est contagieuse et on apprend les racines africaines à chaque pas.",
    },
  },
];

// Course schema configuration
export const AFROBEAT_COURSE_CONFIG = {
  teaches: 'Afrobeats, Afrodance, Amapiano, Ntcham, técnica de danza africana, musicalidad',
  prerequisites: 'Ninguno',
  lessons: '2 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Afrobeat classes
export const AFROBEAT_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'tuesday',
    className: 'Afrobeat Básico',
    time: '18:00 - 19:00',
    teacher: 'Redblueh',
    levelKey: 'basicLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Afrobeats Principiantes',
    time: '18:00 - 19:00',
    teacher: 'Charlie Breezy',
    levelKey: 'beginnerLevel',
  },
  {
    id: '3',
    dayKey: 'friday',
    className: 'Afrobeat Básico',
    time: '18:00 - 19:00',
    teacher: 'Charlie Breezy',
    levelKey: 'basicLevel',
  },
];

// Breadcrumb custom keys for Afrobeat
export const AFROBEAT_BREADCRUMB_KEYS = {
  home: 'afroBreadcrumbHome',
  classes: 'afroBreadcrumbClasses',
  urban: 'afroBreadcrumbUrban',
  current: 'afroBreadcrumbCurrent',
};

// Level descriptions for cards - 2 levels for Afrobeat
export const AFROBEAT_LEVELS = [
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'afroLevelBasicTitle',
    descKey: 'afroLevelBasicDesc',
    duration: '0-6 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'afroLevelIntermediateTitle',
    descKey: 'afroLevelIntermediateDesc',
    duration: '+6 meses',
    color: 'primary-accent' as const,
  },
];

import { getTeacherQuoteInfo } from './teacher-images';

// Prepare class configuration
export const AFROBEAT_PREPARE_CONFIG = {
  prefix: 'afroPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: getTeacherQuoteInfo('redblueh', 'Especialista en Afrobeats'),
};
