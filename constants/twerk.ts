import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Twerk page
export const TWERK_FAQS_CONFIG: FAQ[] = [
  { id: 'twerk-1', questionKey: 'twerkFaqQ1', answerKey: 'twerkFaqA1' },
  { id: 'twerk-2', questionKey: 'twerkFaqQ2', answerKey: 'twerkFaqA2' },
  { id: 'twerk-3', questionKey: 'twerkFaqQ3', answerKey: 'twerkFaqA3' },
  { id: 'twerk-4', questionKey: 'twerkFaqQ4', answerKey: 'twerkFaqA4' },
  { id: 'twerk-5', questionKey: 'twerkFaqQ5', answerKey: 'twerkFaqA5' },
  { id: 'twerk-6', questionKey: 'twerkFaqQ6', answerKey: 'twerkFaqA6' },
  { id: 'twerk-7', questionKey: 'twerkFaqQ7', answerKey: 'twerkFaqA7' },
  { id: 'twerk-8', questionKey: 'twerkFaqQ8', answerKey: 'twerkFaqA8' },
  { id: 'twerk-9', questionKey: 'twerkFaqQ9', answerKey: 'twerkFaqA9' },
  { id: 'twerk-10', questionKey: 'twerkFaqQ10', answerKey: 'twerkFaqA10' },
  { id: 'twerk-11', questionKey: 'twerkFaqQ11', answerKey: 'twerkFaqA11' },
  { id: 'twerk-12', questionKey: 'twerkFaqQ12', answerKey: 'twerkFaqA12' },
  { id: 'twerk-13', questionKey: 'twerkFaqQ13', answerKey: 'twerkFaqA13' },
  { id: 'twerk-14', questionKey: 'twerkFaqQ14', answerKey: 'twerkFaqA14' },
  { id: 'twerk-15', questionKey: 'twerkFaqQ15', answerKey: 'twerkFaqA15' },
];

// Testimonials for Twerk page - uses Google reviews
// Note: images are empty as we use InitialsAvatar for rendering
export const TWERK_TESTIMONIALS: Testimonial[] = [...GOOGLE_REVIEWS_TESTIMONIALS];

// Course schema configuration
export const TWERK_COURSE_CONFIG = {
  teaches: 'Twerk, técnica de danza, musicalidad',
  prerequisites: 'Ninguno',
  lessons: '4 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Twerk classes
export const TWERK_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Twerk Básico',
    time: '18:00 - 19:00',
    teacher: 'Sandra Gómez',
    levelKey: 'basicLevel',
  },
  {
    id: '2',
    dayKey: 'tuesday',
    className: 'Twerk Básico',
    time: '22:00 - 23:00',
    teacher: 'Sandra Gómez',
    levelKey: 'basicLevel',
  },
  {
    id: '3',
    dayKey: 'wednesday',
    className: 'Twerk Intermedio',
    time: '22:00 - 23:00',
    teacher: 'Sandra Gómez',
    levelKey: 'intermediateLevel',
  },
  {
    id: '4',
    dayKey: 'friday',
    className: 'Twerk Principiantes',
    time: '19:00 - 20:00',
    teacher: 'Isabel López',
    levelKey: 'beginnerLevel',
    note: 'A partir del 16 de enero',
  },
];

// Breadcrumb custom keys for Twerk
export const TWERK_BREADCRUMB_KEYS = {
  home: 'twerkBreadcrumbHome',
  classes: 'twerkBreadcrumbClasses',
  current: 'twerkBreadcrumbCurrent',
};
