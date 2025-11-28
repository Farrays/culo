import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// Heels styles for the hub page
export const HEELS_STYLES = [
  {
    key: 'femmology',
    url: '/clases/femmology-sexy-style-en-barcelona',
    imageUrl: '/images/classes/heels/femmology.webp',
  },
  {
    key: 'sexy_style',
    url: '/clases/clases-de-sexy-style',
    imageUrl: '/images/classes/heels/sexy-style.webp',
  },
];

// FAQs configuration for Heels Barcelona page (12 FAQs for AI search optimization)
export const HEELS_FAQS_CONFIG: FAQ[] = [
  { id: 'heels-1', questionKey: 'heelsFaqQ1', answerKey: 'heelsFaqA1' },
  { id: 'heels-2', questionKey: 'heelsFaqQ2', answerKey: 'heelsFaqA2' },
  { id: 'heels-3', questionKey: 'heelsFaqQ3', answerKey: 'heelsFaqA3' },
  { id: 'heels-4', questionKey: 'heelsFaqQ4', answerKey: 'heelsFaqA4' },
  { id: 'heels-5', questionKey: 'heelsFaqQ5', answerKey: 'heelsFaqA5' },
  { id: 'heels-6', questionKey: 'heelsFaqQ6', answerKey: 'heelsFaqA6' },
  { id: 'heels-7', questionKey: 'heelsFaqQ7', answerKey: 'heelsFaqA7' },
  { id: 'heels-8', questionKey: 'heelsFaqQ8', answerKey: 'heelsFaqA8' },
  { id: 'heels-9', questionKey: 'heelsFaqQ9', answerKey: 'heelsFaqA9' },
  { id: 'heels-10', questionKey: 'heelsFaqQ10', answerKey: 'heelsFaqA10' },
  { id: 'heels-11', questionKey: 'heelsFaqQ11', answerKey: 'heelsFaqA11' },
  { id: 'heels-12', questionKey: 'heelsFaqQ12', answerKey: 'heelsFaqA12' },
];

// Testimonials for Heels page (uses centralized Google reviews)
export const HEELS_TESTIMONIALS: Testimonial[] = GOOGLE_REVIEWS_TESTIMONIALS;

// Course schema configuration
export const HEELS_COURSE_CONFIG = {
  teaches: 'High Heels Dance, Femmology, Sexy Style, femininity, sensuality, posture',
  prerequisites: 'Ninguno',
  lessons: 'Clases semanales',
  duration: 'PT1H',
};
