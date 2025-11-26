import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Sexy Reggaeton page (15 FAQs for comprehensive SEO)
export const SEXY_REGGAETON_FAQS_CONFIG: FAQ[] = [
  { id: 'sxr-1', questionKey: 'sxrFaqQ1', answerKey: 'sxrFaqA1' },
  { id: 'sxr-2', questionKey: 'sxrFaqQ2', answerKey: 'sxrFaqA2' },
  { id: 'sxr-3', questionKey: 'sxrFaqQ3', answerKey: 'sxrFaqA3' },
  { id: 'sxr-4', questionKey: 'sxrFaqQ4', answerKey: 'sxrFaqA4' },
  { id: 'sxr-5', questionKey: 'sxrFaqQ5', answerKey: 'sxrFaqA5' },
  { id: 'sxr-6', questionKey: 'sxrFaqQ6', answerKey: 'sxrFaqA6' },
  { id: 'sxr-7', questionKey: 'sxrFaqQ7', answerKey: 'sxrFaqA7' },
  { id: 'sxr-8', questionKey: 'sxrFaqQ8', answerKey: 'sxrFaqA8' },
  { id: 'sxr-9', questionKey: 'sxrFaqQ9', answerKey: 'sxrFaqA9' },
  { id: 'sxr-10', questionKey: 'sxrFaqQ10', answerKey: 'sxrFaqA10' },
  { id: 'sxr-11', questionKey: 'sxrFaqQ11', answerKey: 'sxrFaqA11' },
  { id: 'sxr-12', questionKey: 'sxrFaqQ12', answerKey: 'sxrFaqA12' },
  { id: 'sxr-13', questionKey: 'sxrFaqQ13', answerKey: 'sxrFaqA13' },
  { id: 'sxr-14', questionKey: 'sxrFaqQ14', answerKey: 'sxrFaqA14' },
  { id: 'sxr-15', questionKey: 'sxrFaqQ15', answerKey: 'sxrFaqA15' },
];

// Testimonials for Sexy Reggaeton page (extends Google reviews with specific testimonial)
export const SEXY_REGGAETON_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Laura S.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Sexy Reggaeton classes have transformed my confidence. You learn to move your body with sensuality and strength. The teacher is amazing!',
      es: 'Las clases de Sexy Reggaeton han transformado mi confianza. Aprendes a mover el cuerpo con sensualidad y fuerza. ¡La profe es increíble!',
      ca: 'Les classes de Sexy Reggaeton han transformat la meva confiança. Aprens a moure el cos amb sensualitat i força. La profe és increïble!',
      fr: 'Les cours de Sexy Reggaeton ont transformé ma confiance. Tu apprends à bouger ton corps avec sensualité et force. La prof est incroyable!',
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const SEXY_REGGAETON_COURSE_CONFIG = {
  teaches: 'Sexy Reggaeton, perreo, body roll, sensualidad, disociación corporal, flexibilidad',
  prerequisites: 'Ninguno',
  lessons: '3 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Sexy Reggaeton classes
export const SEXY_REGGAETON_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Sexy Reggaeton Básico',
    time: '20:00 - 21:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'basicLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Sexy Reggaeton Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'intermediateLevel',
  },
  {
    id: '3',
    dayKey: 'friday',
    className: 'Sexy Reggaeton Avanzado',
    time: '19:00 - 20:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'advancedLevel',
  },
];

// Breadcrumb custom keys for Sexy Reggaeton (4 levels: Home > Classes > Urban > Current)
export const SEXY_REGGAETON_BREADCRUMB_KEYS = {
  home: 'sxrBreadcrumbHome',
  classes: 'sxrBreadcrumbClasses',
  urban: 'sxrBreadcrumbUrban',
  current: 'sxrBreadcrumbCurrent',
};

// YouTube video ID for the page
export const SEXY_REGGAETON_VIDEO_ID = 'J5SI4u1SVsg';
