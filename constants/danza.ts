import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Danza Barcelona page
export const DANZA_FAQS_CONFIG: FAQ[] = [
  { id: 'danza-1', questionKey: 'danzaFaqQ1', answerKey: 'danzaFaqA1' },
  { id: 'danza-2', questionKey: 'danzaFaqQ2', answerKey: 'danzaFaqA2' },
  { id: 'danza-3', questionKey: 'danzaFaqQ3', answerKey: 'danzaFaqA3' },
  { id: 'danza-4', questionKey: 'danzaFaqQ4', answerKey: 'danzaFaqA4' },
  { id: 'danza-5', questionKey: 'danzaFaqQ5', answerKey: 'danzaFaqA5' },
  { id: 'danza-6', questionKey: 'danzaFaqQ6', answerKey: 'danzaFaqA6' },
  { id: 'danza-7', questionKey: 'danzaFaqQ7', answerKey: 'danzaFaqA7' },
  { id: 'danza-8', questionKey: 'danzaFaqQ8', answerKey: 'danzaFaqA8' },
  { id: 'danza-9', questionKey: 'danzaFaqQ9', answerKey: 'danzaFaqA9' },
  { id: 'danza-10', questionKey: 'danzaFaqQ10', answerKey: 'danzaFaqA10' },
];

// Testimonials for Danza page (uses centralized Google reviews)
export const DANZA_TESTIMONIALS = GOOGLE_REVIEWS_TESTIMONIALS;
