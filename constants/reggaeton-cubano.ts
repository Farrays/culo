import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Reggaeton Cubano page (15 FAQs for comprehensive SEO)
export const REGGAETON_CUBANO_FAQS_CONFIG: FAQ[] = [
  { id: 'rcb-1', questionKey: 'rcbFaqQ1', answerKey: 'rcbFaqA1' },
  { id: 'rcb-2', questionKey: 'rcbFaqQ2', answerKey: 'rcbFaqA2' },
  { id: 'rcb-3', questionKey: 'rcbFaqQ3', answerKey: 'rcbFaqA3' },
  { id: 'rcb-4', questionKey: 'rcbFaqQ4', answerKey: 'rcbFaqA4' },
  { id: 'rcb-5', questionKey: 'rcbFaqQ5', answerKey: 'rcbFaqA5' },
  { id: 'rcb-6', questionKey: 'rcbFaqQ6', answerKey: 'rcbFaqA6' },
  { id: 'rcb-7', questionKey: 'rcbFaqQ7', answerKey: 'rcbFaqA7' },
  { id: 'rcb-8', questionKey: 'rcbFaqQ8', answerKey: 'rcbFaqA8' },
  { id: 'rcb-9', questionKey: 'rcbFaqQ9', answerKey: 'rcbFaqA9' },
  { id: 'rcb-10', questionKey: 'rcbFaqQ10', answerKey: 'rcbFaqA10' },
  { id: 'rcb-11', questionKey: 'rcbFaqQ11', answerKey: 'rcbFaqA11' },
  { id: 'rcb-12', questionKey: 'rcbFaqQ12', answerKey: 'rcbFaqA12' },
  { id: 'rcb-13', questionKey: 'rcbFaqQ13', answerKey: 'rcbFaqA13' },
  { id: 'rcb-14', questionKey: 'rcbFaqQ14', answerKey: 'rcbFaqA14' },
  { id: 'rcb-15', questionKey: 'rcbFaqQ15', answerKey: 'rcbFaqA15' },
];

// Testimonials for Reggaeton Cubano page (extends Google reviews with specific testimonial)
export const REGGAETON_CUBANO_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Carlos M.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Cuban Reggaeton classes are incredible. You learn the authentic style that is danced in the streets of Cuba. The Cuban teachers are the best!',
      es: 'Las clases de Reggaeton Cubano son increíbles. Aprendes el estilo auténtico que se baila en las calles de Cuba. ¡Los maestros cubanos son los mejores!',
      ca: "Les classes de Reggaeton Cubà són increïbles. Aprens l'estil autèntic que es balla als carrers de Cuba. Els mestres cubans són els millors!",
      fr: 'Les cours de Reggaeton Cubain sont incroyables. Tu apprends le style authentique dansé dans les rues de Cuba. Les professeurs cubains sont les meilleurs!',
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const REGGAETON_CUBANO_COURSE_CONFIG = {
  teaches: 'Reggaeton Cubano, Reparto, Cubatón, disociación corporal, improvisación, musicalidad',
  prerequisites: 'Ninguno',
  lessons: '3 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Reggaeton Cubano classes
export const REGGAETON_CUBANO_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'tuesday',
    className: 'Reggaeton Cubano (Reparto) Open Level',
    time: '19:00 - 20:00',
    teacher: 'Charlie Breezy',
    levelKey: 'openLevel',
  },
  {
    id: '2',
    dayKey: 'thursday',
    className: 'Reggaeton Cubano Principiantes',
    time: '10:00 - 11:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'beginnerLevel',
  },
];

// Breadcrumb custom keys for Reggaeton Cubano (4 levels: Home > Classes > Urban > Current)
export const REGGAETON_CUBANO_BREADCRUMB_KEYS = {
  home: 'rcbBreadcrumbHome',
  classes: 'rcbBreadcrumbClasses',
  urban: 'rcbBreadcrumbUrban',
  current: 'rcbBreadcrumbCurrent',
};

// YouTube video ID for the page
export const REGGAETON_CUBANO_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID';

// Level descriptions for cards - 3 levels
export const REGGAETON_CUBANO_LEVELS = [
  {
    id: 'principiante',
    levelKey: 'beginnerLevel',
    titleKey: 'rcbLevelBeginnerTitle',
    descKey: 'rcbLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'rcbLevelInterTitle',
    descKey: 'rcbLevelInterDesc',
    duration: '3-9 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'rcbLevelAdvancedTitle',
    descKey: 'rcbLevelAdvancedDesc',
    duration: '+9 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const REGGAETON_CUBANO_PREPARE_CONFIG = {
  prefix: 'rcbPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Charlie Breezy',
    credential: 'Especialista en Reggaeton Cubano',
    image: '/images/teachers/img/profesor-hip-hop-charlie-breezy_320.webp',
  },
};
