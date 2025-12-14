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

// Testimonials for Twerk page (4 testimonials: 3 Google reviews + 1 specific)
export const TWERK_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Laura M.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "Sandra and Isabel are incredible teachers. I came with zero dance experience and in just a few months I've gained so much confidence. The classes are super fun!",
      es: 'Sandra e Isabel son profesoras increíbles. Llegué sin experiencia en baile y en pocos meses he ganado mucha confianza. ¡Las clases son súper divertidas!',
      ca: 'Sandra i Isabel són professores increïbles. Vaig arribar sense experiència en ball i en pocs mesos he guanyat molta confiança. Les classes són súper divertides!',
      fr: "Sandra et Isabel sont des professeures incroyables. Je suis arrivée sans expérience en danse et en quelques mois j'ai gagné beaucoup de confiance. Les cours sont super amusants !",
    },
  },
];

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

// Level descriptions for cards - 3 levels for Twerk
export const TWERK_LEVELS = [
  {
    id: 'principiante',
    levelKey: 'beginnerLevel',
    titleKey: 'twerkLevelBeginnerTitle',
    descKey: 'twerkLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'twerkLevelInterTitle',
    descKey: 'twerkLevelInterDesc',
    duration: '3-9 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'twerkLevelAdvancedTitle',
    descKey: 'twerkLevelAdvancedDesc',
    duration: '+9 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const TWERK_PREPARE_CONFIG = {
  prefix: 'twerkPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Sandra Gómez',
    credential: 'Especialista en Twerk',
    image: '/images/teachers/img/profesora-twerk-dancehall-sandra-gomez_320.webp',
  },
};
