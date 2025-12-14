import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Dancehall page
export const DANCEHALL_FAQS_CONFIG: FAQ[] = [
  { id: 'dhv3-1', questionKey: 'dhV3FaqQ1', answerKey: 'dhV3FaqA1' },
  { id: 'dhv3-2', questionKey: 'dhV3FaqQ2', answerKey: 'dhV3FaqA2' },
  { id: 'dhv3-3', questionKey: 'dhV3FaqQ3', answerKey: 'dhV3FaqA3' },
  { id: 'dhv3-4', questionKey: 'dhV3FaqQ4', answerKey: 'dhV3FaqA4' },
  { id: 'dhv3-5', questionKey: 'dhV3FaqQ5', answerKey: 'dhV3FaqA5' },
  { id: 'dhv3-6', questionKey: 'dhV3FaqQ6', answerKey: 'dhV3FaqA6' },
  { id: 'dhv3-7', questionKey: 'dhV3FaqQ7', answerKey: 'dhV3FaqA7' },
  { id: 'dhv3-8', questionKey: 'dhV3FaqQ8', answerKey: 'dhV3FaqA8' },
  { id: 'dhv3-9', questionKey: 'dhV3FaqQ9', answerKey: 'dhV3FaqA9' },
  { id: 'dhv3-10', questionKey: 'dhV3FaqQ10', answerKey: 'dhV3FaqA10' },
  { id: 'dhv3-11', questionKey: 'dhV3FaqQ11', answerKey: 'dhV3FaqA11' },
  { id: 'dhv3-12', questionKey: 'dhV3FaqQ12', answerKey: 'dhV3FaqA12' },
  { id: 'dhv3-13', questionKey: 'dhV3FaqQ13', answerKey: 'dhV3FaqA13' },
  { id: 'dhv3-14', questionKey: 'dhV3FaqQ14', answerKey: 'dhV3FaqA14' },
  { id: 'dhv3-15', questionKey: 'dhV3FaqQ15', answerKey: 'dhV3FaqA15' },
];

// Testimonials for Dancehall page (extends Google reviews with specific testimonial)
// Note: images are empty as we use InitialsAvatar for rendering
export const DANCEHALL_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Paula Galindo Calanda',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Augusto is the best and the Yas classes are incredible. The best academy in Barcelona without a doubt.',
      es: 'Augusto es el mejor y las clases de Yas increíbles. La mejor academia de Barcelona sin duda.',
      ca: 'Augusto és el millor i les classes de Yas increïbles. La millor acadèmia de Barcelona sense dubte.',
      fr: 'Augusto est le meilleur et les cours de Yas sont incroyables. La meilleure académie de Barcelone sans aucun doute.',
    },
  },
];

// Course schema configuration
export const DANCEHALL_COURSE_CONFIG = {
  teaches: 'Dancehall jamaicano, técnica de danza urbana, musicalidad',
  prerequisites: 'Ninguno',
  lessons: '5 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Dancehall classes
export const DANCEHALL_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Dancehall Female Principiantes',
    time: '22:00 - 23:00',
    teacher: 'Sandra Gómez',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Dancehall Twerk Intermedio',
    time: '21:00 - 22:00',
    teacher: 'Isabel López',
    levelKey: 'intermediateLevel',
  },
  {
    id: '3',
    dayKey: 'thursday',
    className: 'Dancehall Female Avanzado',
    time: '21:00 - 22:00',
    teacher: 'Isabel López',
    levelKey: 'advancedLevel',
  },
  {
    id: '4',
    dayKey: 'thursday',
    className: 'Dancehall Female Básico',
    time: '22:00 - 23:00',
    teacher: 'Sandra Gómez',
    levelKey: 'basicLevel',
  },
  {
    id: '5',
    dayKey: 'friday',
    className: 'Dancehall Twerk Principiantes',
    time: '18:00 - 19:00',
    teacher: 'Isabel López',
    levelKey: 'beginnerLevel',
  },
];

// Breadcrumb custom keys for Dancehall (has 4 levels instead of 3)
export const DANCEHALL_BREADCRUMB_KEYS = {
  home: 'dhV3BreadcrumbHome',
  classes: 'dhV3BreadcrumbClasses',
  urban: 'dhV3BreadcrumbUrban',
  current: 'dhV3BreadcrumbCurrent',
};

// Level descriptions for cards - 3 levels for Dancehall
export const DANCEHALL_LEVELS = [
  {
    id: 'principiante',
    levelKey: 'beginnerLevel',
    titleKey: 'dancehallLevelBeginnerTitle',
    descKey: 'dancehallLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'dancehallLevelInterTitle',
    descKey: 'dancehallLevelInterDesc',
    duration: '3-9 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'dancehallLevelAdvancedTitle',
    descKey: 'dancehallLevelAdvancedDesc',
    duration: '+9 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const DANCEHALL_PREPARE_CONFIG = {
  prefix: 'dancehallPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Isabel López',
    credential: 'Especialista en Dancehall',
    image: undefined, // Will use initials avatar
  },
};
