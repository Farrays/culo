import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Commercial Dance page (15 FAQs)
export const COMMERCIAL_FAQS_CONFIG: FAQ[] = [
  { id: 'commercial-1', questionKey: 'commercialFaqQ1', answerKey: 'commercialFaqA1' },
  { id: 'commercial-2', questionKey: 'commercialFaqQ2', answerKey: 'commercialFaqA2' },
  { id: 'commercial-3', questionKey: 'commercialFaqQ3', answerKey: 'commercialFaqA3' },
  { id: 'commercial-4', questionKey: 'commercialFaqQ4', answerKey: 'commercialFaqA4' },
  { id: 'commercial-5', questionKey: 'commercialFaqQ5', answerKey: 'commercialFaqA5' },
  { id: 'commercial-6', questionKey: 'commercialFaqQ6', answerKey: 'commercialFaqA6' },
  { id: 'commercial-7', questionKey: 'commercialFaqQ7', answerKey: 'commercialFaqA7' },
  { id: 'commercial-8', questionKey: 'commercialFaqQ8', answerKey: 'commercialFaqA8' },
  { id: 'commercial-9', questionKey: 'commercialFaqQ9', answerKey: 'commercialFaqA9' },
  { id: 'commercial-10', questionKey: 'commercialFaqQ10', answerKey: 'commercialFaqA10' },
  { id: 'commercial-11', questionKey: 'commercialFaqQ11', answerKey: 'commercialFaqA11' },
  { id: 'commercial-12', questionKey: 'commercialFaqQ12', answerKey: 'commercialFaqA12' },
  { id: 'commercial-13', questionKey: 'commercialFaqQ13', answerKey: 'commercialFaqA13' },
  { id: 'commercial-14', questionKey: 'commercialFaqQ14', answerKey: 'commercialFaqA14' },
  { id: 'commercial-15', questionKey: 'commercialFaqQ15', answerKey: 'commercialFaqA15' },
];

// Testimonials for Commercial Dance page (using Google Reviews - urbanas category)
export const COMMERCIAL_TESTIMONIALS: Testimonial[] = [...GOOGLE_REVIEWS_TESTIMONIALS];

// Course schema configuration
export const COMMERCIAL_COURSE_CONFIG = {
  teaches: 'Commercial Dance, coreografías para videoclips, técnica de performance',
  prerequisites: 'Ninguno',
  lessons: 'Próximamente',
  duration: 'PT1H',
};

// Schedule data for Commercial Dance classes (empty - waitlist mode)
export const COMMERCIAL_SCHEDULE_KEYS: Array<{
  id: string;
  dayKey: string;
  className: string;
  time: string;
  teacher: string;
  levelKey: string;
}> = [];

// Level descriptions for cards - Only Iniciación for now
export const COMMERCIAL_LEVELS = [
  {
    id: 'iniciacion',
    levelKey: 'beginnerLevel',
    titleKey: 'commercialLevelBeginnerTitle',
    descKey: 'commercialLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  // Intermediate and Advanced levels hidden for now
  // {
  //   id: 'intermedio',
  //   levelKey: 'intermediateLevel',
  //   titleKey: 'commercialLevelInterTitle',
  //   descKey: 'commercialLevelInterDesc',
  //   duration: '3-9 meses',
  //   color: 'primary-accent-light' as const,
  // },
  // {
  //   id: 'avanzado',
  //   levelKey: 'advancedLevel',
  //   titleKey: 'commercialLevelAdvancedTitle',
  //   descKey: 'commercialLevelAdvancedDesc',
  //   duration: '+9 meses',
  //   color: 'primary-accent' as const,
  // },
];

// Prepare class configuration (placeholder teacher until assigned)
export const COMMERCIAL_PREPARE_CONFIG = {
  prefix: 'commercialPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: "Farray's Center",
    credential: 'Especialista en Commercial Dance',
    image: '/images/teachers/placeholder-teacher.svg',
  },
};
