import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Twerk page
export const TWERK_FAQS_CONFIG: FAQ[] = [
  { id: 'twerk-1', questionKey: 'twerkFaqQ1', answerKey: 'twerkFaqA1' },
  { id: 'twerk-2', questionKey: 'twerkFaqQ2', answerKey: 'twerkFaqA2' },
  { id: 'twerk-3', questionKey: 'twerkFaqQ3', answerKey: 'twerkFaqA3' },
  { id: 'twerk-4', questionKey: 'twerkFaqQ4', answerKey: 'twerkFaqA4' },
];

// Testimonials for Twerk page (extends Google reviews with specific testimonial)
export const TWERK_TESTIMONIALS: Testimonial[] = [
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
      en: 'The Twerk classes are amazing. Great atmosphere and the teacher explains very well.',
      es: 'Las clases de Twerk son increíbles. El ambiente es genial y el profesor explica muy bien.',
      ca: 'Les classes de Twerk són increïbles. L\'ambient és genial i el professor explica molt bé.',
      fr: 'Les cours de Twerk sont incroyables. L\'ambiance est géniale et le professeur explique très bien.',
    },
  },
];

// Course schema configuration
export const TWERK_COURSE_CONFIG = {
  teaches: 'Twerk, técnica de danza, musicalidad',
  prerequisites: 'Ninguno',
  lessons: '5 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Twerk classes
export const TWERK_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Twerk Principiantes',
    time: '19:00 - 20:00',
    teacher: 'Sandra Gómez',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Twerk Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Sandra Gómez',
    levelKey: 'intermediateLevel',
  },
  {
    id: '3',
    dayKey: 'friday',
    className: 'Twerk Avanzado',
    time: '21:00 - 22:00',
    teacher: 'Sandra Gómez',
    levelKey: 'advancedLevel',
  },
];

// Breadcrumb custom keys for Twerk
export const TWERK_BREADCRUMB_KEYS = {
  home: 'twerkBreadcrumbHome',
  classes: 'twerkBreadcrumbClasses',
  current: 'twerkBreadcrumbCurrent',
};
