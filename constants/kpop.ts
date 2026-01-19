import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for K-Pop page (15 FAQs)
export const KPOP_FAQS_CONFIG: FAQ[] = [
  { id: 'kpop-1', questionKey: 'kpopFaqQ1', answerKey: 'kpopFaqA1' },
  { id: 'kpop-2', questionKey: 'kpopFaqQ2', answerKey: 'kpopFaqA2' },
  { id: 'kpop-3', questionKey: 'kpopFaqQ3', answerKey: 'kpopFaqA3' },
  { id: 'kpop-4', questionKey: 'kpopFaqQ4', answerKey: 'kpopFaqA4' },
  { id: 'kpop-5', questionKey: 'kpopFaqQ5', answerKey: 'kpopFaqA5' },
  { id: 'kpop-6', questionKey: 'kpopFaqQ6', answerKey: 'kpopFaqA6' },
  { id: 'kpop-7', questionKey: 'kpopFaqQ7', answerKey: 'kpopFaqA7' },
  { id: 'kpop-8', questionKey: 'kpopFaqQ8', answerKey: 'kpopFaqA8' },
  { id: 'kpop-9', questionKey: 'kpopFaqQ9', answerKey: 'kpopFaqA9' },
  { id: 'kpop-10', questionKey: 'kpopFaqQ10', answerKey: 'kpopFaqA10' },
  { id: 'kpop-11', questionKey: 'kpopFaqQ11', answerKey: 'kpopFaqA11' },
  { id: 'kpop-12', questionKey: 'kpopFaqQ12', answerKey: 'kpopFaqA12' },
  { id: 'kpop-13', questionKey: 'kpopFaqQ13', answerKey: 'kpopFaqA13' },
  { id: 'kpop-14', questionKey: 'kpopFaqQ14', answerKey: 'kpopFaqA14' },
  { id: 'kpop-15', questionKey: 'kpopFaqQ15', answerKey: 'kpopFaqA15' },
];

// Testimonials for K-Pop page (using Google Reviews)
export const KPOP_TESTIMONIALS: Testimonial[] = [...GOOGLE_REVIEWS_TESTIMONIALS];

// Course schema configuration
export const KPOP_COURSE_CONFIG = {
  teaches: 'K-Pop Dance, coreografías K-Pop, técnica de danza coreana',
  prerequisites: 'Ninguno',
  lessons: 'Próximamente',
  duration: 'PT1H',
};

// Schedule data for K-Pop classes (empty - waitlist mode)
export const KPOP_SCHEDULE_KEYS: Array<{
  id: string;
  dayKey: string;
  className: string;
  time: string;
  teacher: string;
  levelKey: string;
}> = [];

// Level descriptions for cards - 3 levels for K-Pop
export const KPOP_LEVELS = [
  {
    id: 'iniciacion',
    levelKey: 'beginnerLevel',
    titleKey: 'kpopLevelBeginnerTitle',
    descKey: 'kpopLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'kpopLevelInterTitle',
    descKey: 'kpopLevelInterDesc',
    duration: '3-9 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'kpopLevelAdvancedTitle',
    descKey: 'kpopLevelAdvancedDesc',
    duration: '+9 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration (placeholder teacher until assigned)
export const KPOP_PREPARE_CONFIG = {
  prefix: 'kpopPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: "Farray's Center",
    credential: 'Especialista en K-Pop Dance',
    image: '/images/teachers/placeholder-teacher.svg',
  },
};
