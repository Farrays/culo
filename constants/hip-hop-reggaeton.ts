import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Hip Hop Reggaeton page (15 FAQs for comprehensive SEO)
export const HIP_HOP_REGGAETON_FAQS_CONFIG: FAQ[] = [
  { id: 'hhr-1', questionKey: 'hhrFaqQ1', answerKey: 'hhrFaqA1' },
  { id: 'hhr-2', questionKey: 'hhrFaqQ2', answerKey: 'hhrFaqA2' },
  { id: 'hhr-3', questionKey: 'hhrFaqQ3', answerKey: 'hhrFaqA3' },
  { id: 'hhr-4', questionKey: 'hhrFaqQ4', answerKey: 'hhrFaqA4' },
  { id: 'hhr-5', questionKey: 'hhrFaqQ5', answerKey: 'hhrFaqA5' },
  { id: 'hhr-6', questionKey: 'hhrFaqQ6', answerKey: 'hhrFaqA6' },
  { id: 'hhr-7', questionKey: 'hhrFaqQ7', answerKey: 'hhrFaqA7' },
  { id: 'hhr-8', questionKey: 'hhrFaqQ8', answerKey: 'hhrFaqA8' },
  { id: 'hhr-9', questionKey: 'hhrFaqQ9', answerKey: 'hhrFaqA9' },
  { id: 'hhr-10', questionKey: 'hhrFaqQ10', answerKey: 'hhrFaqA10' },
  { id: 'hhr-11', questionKey: 'hhrFaqQ11', answerKey: 'hhrFaqA11' },
  { id: 'hhr-12', questionKey: 'hhrFaqQ12', answerKey: 'hhrFaqA12' },
  { id: 'hhr-13', questionKey: 'hhrFaqQ13', answerKey: 'hhrFaqA13' },
  { id: 'hhr-14', questionKey: 'hhrFaqQ14', answerKey: 'hhrFaqA14' },
  { id: 'hhr-15', questionKey: 'hhrFaqQ15', answerKey: 'hhrFaqA15' },
];

// Testimonials for Hip Hop Reggaeton page (extends Google reviews with specific testimonial)
export const HIP_HOP_REGGAETON_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Alejandro M.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The Hip Hop Reggaeton classes are incredible. Charlie Breezy teaches you the unique style and flow like no one else. Super recommended!',
      es: 'Las clases de Hip Hop Reggaeton son increíbles. Charlie Breezy te enseña el flow y el estilo único como nadie. ¡Super recomendado!',
      ca: "Les classes de Hip Hop Reggaeton són increïbles. Charlie Breezy t'ensenya el flow i l'estil únic com ningú. Super recomanat!",
      fr: "Les cours de Hip Hop Reggaeton sont incroyables. Charlie Breezy t'apprend le flow et le style unique comme personne. Super recommandé!",
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const HIP_HOP_REGGAETON_COURSE_CONFIG = {
  teaches: 'Hip Hop Reggaeton, fusión urbana, técnica de danza, improvisación, flow',
  prerequisites: 'Ninguno',
  lessons: '5 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Hip Hop Reggaeton classes
export const HIP_HOP_REGGAETON_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Hip Hop Reggaeton Básico',
    time: '22:00 - 23:00',
    teacher: 'Charlie Breezy',
    levelKey: 'basicLevel',
  },
  {
    id: '2',
    dayKey: 'tuesday',
    className: 'Hip Hop Reggaeton Principiantes',
    time: '18:00 - 19:00',
    teacher: 'Charlie Breezy',
    levelKey: 'beginnerLevel',
  },
  {
    id: '3',
    dayKey: 'wednesday',
    className: 'Hip Hop Reggaeton Básico',
    time: '18:00 - 19:00',
    teacher: 'Charlie Breezy',
    levelKey: 'basicLevel',
  },
  {
    id: '4',
    dayKey: 'wednesday',
    className: 'Hip Hop Reggaeton Intermedio/Avanzado',
    time: '19:00 - 20:00',
    teacher: 'Charlie Breezy',
    levelKey: 'intermediateAdvancedLevel',
  },
  {
    id: '5',
    dayKey: 'friday',
    className: 'Hip Hop Reggaeton Básico',
    time: '18:00 - 19:00',
    teacher: 'Charlie Breezy',
    levelKey: 'basicLevel',
  },
];

// Breadcrumb custom keys for Hip Hop Reggaeton (4 levels: Home > Classes > Urban > Current)
export const HIP_HOP_REGGAETON_BREADCRUMB_KEYS = {
  home: 'hhrBreadcrumbHome',
  classes: 'hhrBreadcrumbClasses',
  urban: 'hhrBreadcrumbUrban',
  current: 'hhrBreadcrumbCurrent',
};

// YouTube video ID for the page
export const HIP_HOP_REGGAETON_VIDEO_ID = 'VdEJ1Z-pJzY';

// Level descriptions for cards - 3 levels
export const HIP_HOP_REGGAETON_LEVELS = [
  {
    id: 'principiante',
    levelKey: 'beginnerLevel',
    titleKey: 'hhrLevelBeginnerTitle',
    descKey: 'hhrLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'hhrLevelInterTitle',
    descKey: 'hhrLevelInterDesc',
    duration: '3-9 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'hhrLevelAdvancedTitle',
    descKey: 'hhrLevelAdvancedDesc',
    duration: '+9 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const HIP_HOP_REGGAETON_PREPARE_CONFIG = {
  prefix: 'hhrPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Charlie Breezy',
    credential: 'Especialista en Hip Hop Reggaeton',
    image: '/images/teachers/img/profesor-hip-hop-charlie-breezy_320.webp',
  },
};
