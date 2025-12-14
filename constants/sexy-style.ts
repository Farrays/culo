import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for SexyStyle page (15 FAQs for comprehensive SEO)
export const SEXY_STYLE_FAQS_CONFIG: FAQ[] = [
  { id: 'sexy-style-1', questionKey: 'sexystyleFaqQ1', answerKey: 'sexystyleFaqA1' },
  { id: 'sexy-style-2', questionKey: 'sexystyleFaqQ2', answerKey: 'sexystyleFaqA2' },
  { id: 'sexy-style-3', questionKey: 'sexystyleFaqQ3', answerKey: 'sexystyleFaqA3' },
  { id: 'sexy-style-4', questionKey: 'sexystyleFaqQ4', answerKey: 'sexystyleFaqA4' },
  { id: 'sexy-style-5', questionKey: 'sexystyleFaqQ5', answerKey: 'sexystyleFaqA5' },
  { id: 'sexy-style-6', questionKey: 'sexystyleFaqQ6', answerKey: 'sexystyleFaqA6' },
  { id: 'sexy-style-7', questionKey: 'sexystyleFaqQ7', answerKey: 'sexystyleFaqA7' },
  { id: 'sexy-style-8', questionKey: 'sexystyleFaqQ8', answerKey: 'sexystyleFaqA8' },
  { id: 'sexy-style-9', questionKey: 'sexystyleFaqQ9', answerKey: 'sexystyleFaqA9' },
  { id: 'sexy-style-10', questionKey: 'sexystyleFaqQ10', answerKey: 'sexystyleFaqA10' },
  { id: 'sexy-style-11', questionKey: 'sexystyleFaqQ11', answerKey: 'sexystyleFaqA11' },
  { id: 'sexy-style-12', questionKey: 'sexystyleFaqQ12', answerKey: 'sexystyleFaqA12' },
  { id: 'sexy-style-13', questionKey: 'sexystyleFaqQ13', answerKey: 'sexystyleFaqA13' },
  { id: 'sexy-style-14', questionKey: 'sexystyleFaqQ14', answerKey: 'sexystyleFaqA14' },
  { id: 'sexy-style-15', questionKey: 'sexystyleFaqQ15', answerKey: 'sexystyleFaqA15' },
];

// Testimonials for SexyStyle page (extends Google reviews with specific testimonial)
export const SEXY_STYLE_TESTIMONIALS: Testimonial[] = [
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
      en: 'Sexy Style classes have transformed how I see myself. I arrived feeling insecure about my body, and now I move with confidence. Yasmina creates a magical space where you can be yourself.',
      es: 'Las clases de Sexy Style han transformado cómo me veo a mí misma. Llegué sintiéndome insegura de mi cuerpo, y ahora me muevo con confianza. Yasmina crea un espacio mágico donde puedes ser tú misma.',
      ca: 'Les classes de Sexy Style han transformat com em veig a mi mateixa. Vaig arribar sentint-me insegura del meu cos, i ara em moc amb confiança. Yasmina crea un espai màgic on pots ser tu mateixa.',
      fr: 'Les cours de Sexy Style ont transformé la façon dont je me vois. Je suis arrivée en me sentant peu sûre de mon corps, et maintenant je bouge avec confiance. Yasmina crée un espace magique où tu peux être toi-même.',
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const SEXY_STYLE_COURSE_CONFIG = {
  teaches:
    'Sexy Style, sensualidad, expresión corporal, feminidad, coreografía, confianza, coordinación',
  prerequisites: 'Ninguno',
  lessons: '6 clases semanales',
  duration: 'PT1H',
};

// Schedule data for SexyStyle classes
export const SEXY_STYLE_SCHEDULE_KEYS = [
  // Mañanas
  {
    id: '1',
    dayKey: 'thursday',
    className: 'Sexy Style',
    time: '11:00 - 12:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'beginnerLevel',
  },
  // Tardes
  {
    id: '2',
    dayKey: 'monday',
    className: 'Sexy Style',
    time: '19:00 - 20:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'intermediateAdvancedLevel',
  },
  {
    id: '3',
    dayKey: 'monday',
    className: 'Sexy Style',
    time: '20:00 - 21:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'basicLevel',
  },
  {
    id: '4',
    dayKey: 'tuesday',
    className: 'Sexy Style',
    time: '18:00 - 19:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'basicLevel',
  },
  {
    id: '5',
    dayKey: 'tuesday',
    className: 'Sexy Style',
    time: '21:00 - 22:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'beginnerLevel',
  },
  {
    id: '6',
    dayKey: 'thursday',
    className: 'Sexy Style',
    time: '21:00 - 22:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'intermediateLevel',
  },
];

// Breadcrumb custom keys for SexyStyle (4 levels: Home > Classes > Urban > Current)
export const SEXY_STYLE_BREADCRUMB_KEYS = {
  home: 'sexystyleBreadcrumbHome',
  classes: 'sexystyleBreadcrumbClasses',
  urban: 'sexystyleBreadcrumbUrban',
  current: 'sexystyleBreadcrumbCurrent',
};

// YouTube video ID for the page
export const SEXY_STYLE_VIDEO_ID = '516fMKBEIKw';

// Level descriptions for cards - 3 levels
export const SEXY_STYLE_LEVELS = [
  {
    id: 'principiante',
    levelKey: 'beginnerLevel',
    titleKey: 'sexystyleLevelBeginnerTitle',
    descKey: 'sexystyleLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'sexystyleLevelInterTitle',
    descKey: 'sexystyleLevelInterDesc',
    duration: '3-9 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'sexystyleLevelAdvancedTitle',
    descKey: 'sexystyleLevelAdvancedDesc',
    duration: '+9 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const SEXY_STYLE_PREPARE_CONFIG = {
  prefix: 'sexystylePrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Yasmina Fernández',
    credential: 'Especialista en Sexy Style',
    image: undefined,
  },
};
