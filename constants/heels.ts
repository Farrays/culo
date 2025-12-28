import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// Heels style card configuration - Enterprise format for OptimizedImage
export interface HeelsStyleConfig {
  key: string;
  url: string;
  basePath: string;
  altKey: string;
  fallbackAlt: string;
}

// Heels styles for the hub page - Enterprise OptimizedImage format
export const HEELS_STYLES: HeelsStyleConfig[] = [
  {
    key: 'femmology',
    url: '/clases/femmology',
    basePath: '/images/classes/femmology/img/clases-de-femmology-barcelona',
    altKey: 'styleImages.femmology.cardHub',
    fallbackAlt: 'Clases de Femmology en Barcelona - Baile en tacones con Yunaisy Farray',
  },
  {
    key: 'sexy_style',
    url: '/clases/sexy-style-barcelona',
    basePath: '/images/classes/sexy-style/img/clases-de-sexy-style-barcelona',
    altKey: 'styleImages.sexyStyle.cardHub',
    fallbackAlt: 'Clases de Sexy Style en Barcelona - Sensualidad y expresión corporal',
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
