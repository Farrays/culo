import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Kizomba page (15 FAQs)
export const KIZOMBA_FAQS_CONFIG: FAQ[] = [
  { id: 'kizomba-1', questionKey: 'kizombaFaqQ1', answerKey: 'kizombaFaqA1' },
  { id: 'kizomba-2', questionKey: 'kizombaFaqQ2', answerKey: 'kizombaFaqA2' },
  { id: 'kizomba-3', questionKey: 'kizombaFaqQ3', answerKey: 'kizombaFaqA3' },
  { id: 'kizomba-4', questionKey: 'kizombaFaqQ4', answerKey: 'kizombaFaqA4' },
  { id: 'kizomba-5', questionKey: 'kizombaFaqQ5', answerKey: 'kizombaFaqA5' },
  { id: 'kizomba-6', questionKey: 'kizombaFaqQ6', answerKey: 'kizombaFaqA6' },
  { id: 'kizomba-7', questionKey: 'kizombaFaqQ7', answerKey: 'kizombaFaqA7' },
  { id: 'kizomba-8', questionKey: 'kizombaFaqQ8', answerKey: 'kizombaFaqA8' },
  { id: 'kizomba-9', questionKey: 'kizombaFaqQ9', answerKey: 'kizombaFaqA9' },
  { id: 'kizomba-10', questionKey: 'kizombaFaqQ10', answerKey: 'kizombaFaqA10' },
  { id: 'kizomba-11', questionKey: 'kizombaFaqQ11', answerKey: 'kizombaFaqA11' },
  { id: 'kizomba-12', questionKey: 'kizombaFaqQ12', answerKey: 'kizombaFaqA12' },
  { id: 'kizomba-13', questionKey: 'kizombaFaqQ13', answerKey: 'kizombaFaqA13' },
  { id: 'kizomba-14', questionKey: 'kizombaFaqQ14', answerKey: 'kizombaFaqA14' },
  { id: 'kizomba-15', questionKey: 'kizombaFaqQ15', answerKey: 'kizombaFaqA15' },
];

// Testimonials for Kizomba page (using Google Reviews - latinas category)
export const KIZOMBA_TESTIMONIALS: Testimonial[] = [...GOOGLE_REVIEWS_TESTIMONIALS];

// Course schema configuration
export const KIZOMBA_COURSE_CONFIG = {
  teaches: 'Kizomba, técnica de conexión en pareja, musicalidad africana',
  prerequisites: 'Ninguno',
  lessons: 'Próximamente',
  duration: 'PT1H',
};

// Schedule data for Kizomba classes (empty - waitlist mode)
export const KIZOMBA_SCHEDULE_KEYS: Array<{
  id: string;
  dayKey: string;
  className: string;
  time: string;
  teacher: string;
  levelKey: string;
}> = [];

// Level descriptions for cards - Only Iniciación for now
export const KIZOMBA_LEVELS = [
  {
    id: 'iniciacion',
    levelKey: 'beginnerLevel',
    titleKey: 'kizombaLevelBeginnerTitle',
    descKey: 'kizombaLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
];

// Prepare class configuration (placeholder teacher until assigned)
export const KIZOMBA_PREPARE_CONFIG = {
  prefix: 'kizombaPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: "Farray's Center",
    credential: 'Especialista en Kizomba',
    image: '/images/teachers/placeholder-teacher.svg',
  },
};
