import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Stretching page (15 FAQs for comprehensive SEO)
export const STRETCHING_FAQS_CONFIG: FAQ[] = [
  { id: 'stretching-1', questionKey: 'stretchingFaqQ1', answerKey: 'stretchingFaqA1' },
  { id: 'stretching-2', questionKey: 'stretchingFaqQ2', answerKey: 'stretchingFaqA2' },
  { id: 'stretching-3', questionKey: 'stretchingFaqQ3', answerKey: 'stretchingFaqA3' },
  { id: 'stretching-4', questionKey: 'stretchingFaqQ4', answerKey: 'stretchingFaqA4' },
  { id: 'stretching-5', questionKey: 'stretchingFaqQ5', answerKey: 'stretchingFaqA5' },
  { id: 'stretching-6', questionKey: 'stretchingFaqQ6', answerKey: 'stretchingFaqA6' },
  { id: 'stretching-7', questionKey: 'stretchingFaqQ7', answerKey: 'stretchingFaqA7' },
  { id: 'stretching-8', questionKey: 'stretchingFaqQ8', answerKey: 'stretchingFaqA8' },
  { id: 'stretching-9', questionKey: 'stretchingFaqQ9', answerKey: 'stretchingFaqA9' },
  { id: 'stretching-10', questionKey: 'stretchingFaqQ10', answerKey: 'stretchingFaqA10' },
  { id: 'stretching-11', questionKey: 'stretchingFaqQ11', answerKey: 'stretchingFaqA11' },
  { id: 'stretching-12', questionKey: 'stretchingFaqQ12', answerKey: 'stretchingFaqA12' },
  { id: 'stretching-13', questionKey: 'stretchingFaqQ13', answerKey: 'stretchingFaqA13' },
  { id: 'stretching-14', questionKey: 'stretchingFaqQ14', answerKey: 'stretchingFaqA14' },
  { id: 'stretching-15', questionKey: 'stretchingFaqQ15', answerKey: 'stretchingFaqA15' },
];

// Testimonials for Stretching page (extends Google reviews with specific testimonial)
export const STRETCHING_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Carmen Pérez',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'After years of back pain, Cris helped me regain flexibility I thought I had lost forever. The Método Farray approach is transformative.',
      es: 'Después de años con dolor de espalda, Cris me ayudó a recuperar flexibilidad que creía haber perdido para siempre. El enfoque del Método Farray es transformador.',
      ca: "Després d'anys amb dolor d'esquena, Cris em va ajudar a recuperar flexibilitat que creia haver perdut per sempre. L'enfocament del Mètode Farray és transformador.",
      fr: "Après des années de douleurs au dos, Cris m'a aidé à retrouver une flexibilité que je pensais avoir perdue à jamais. L'approche Méthode Farray est transformatrice.",
    },
  },
];

// Course schema configuration
export const STRETCHING_COURSE_CONFIG = {
  teaches:
    'Stretching, estiramientos, flexibilidad, backbending, elongación de piernas y espalda, core strengthening, prevención de lesiones',
  prerequisites: 'Ninguno',
  lessons: '5 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Stretching classes
export const STRETCHING_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Stretching Principiantes',
    time: '18:00 - 19:00',
    teacher: 'Cris Ag',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Stretching Principiantes',
    time: '18:00 - 19:00',
    teacher: 'Cris Ag',
    levelKey: 'beginnerLevel',
  },
  {
    id: '3',
    dayKey: 'thursday',
    className: 'Stretching Básico',
    time: '19:00 - 20:00',
    teacher: 'Daniel Sené',
    levelKey: 'basicLevel',
  },
  {
    id: '4',
    dayKey: 'monday',
    className: 'Backbending & Legs Intermedio/Avanzado',
    time: '21:00 - 22:30',
    teacher: 'Cris Ag',
    levelKey: 'intermediateAdvancedLevel',
    note: '1h30',
  },
  {
    id: '5',
    dayKey: 'wednesday',
    className: 'Backbending & Legs Intermedio',
    time: '20:00 - 21:30',
    teacher: 'Cris Ag',
    levelKey: 'intermediateLevel',
    note: '1h30',
  },
];

// Breadcrumb custom keys for Stretching (4 levels: Home > Classes > Prep Física > Stretching)
export const STRETCHING_BREADCRUMB_KEYS = {
  home: 'stretchingBreadcrumbHome',
  classes: 'stretchingBreadcrumbClasses',
  category: 'stretchingBreadcrumbCategory',
  current: 'stretchingBreadcrumbCurrent',
};

// Level descriptions for cards - 4 levels for Stretching
export const STRETCHING_LEVELS = [
  {
    id: 'principiantes',
    levelKey: 'beginnerLevel',
    titleKey: 'stretchingLevelBeginnerTitle',
    descKey: 'stretchingLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'stretchingLevelBasicTitle',
    descKey: 'stretchingLevelBasicDesc',
    duration: '3-6 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'stretchingLevelIntermediateTitle',
    descKey: 'stretchingLevelIntermediateDesc',
    duration: '6-12 meses',
    color: 'primary-accent' as const,
  },
  {
    id: 'intermedio-avanzado',
    levelKey: 'intermediateAdvancedLevel',
    titleKey: 'stretchingLevelInterAdvTitle',
    descKey: 'stretchingLevelInterAdvDesc',
    duration: '+12 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const STRETCHING_PREPARE_CONFIG = {
  prefix: 'stretchingPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Cris Ag',
    credential: 'Especialista en Flexibilidad y Backbending',
    image: undefined,
  },
};

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const STRETCHING_GEO_KEYS = {
  definicion: 'stretchingCitableDefinicion', // Definición científica
  origen: 'stretchingCitableOrigen', // Bob Anderson 1975
  pnf: 'stretchingCitablePNF', // Facilitación Neuromuscular Propioceptiva
  backbending: 'stretchingCitableBackbending', // Flexión posterior columna
  beneficios: 'stretchingCitableBeneficios', // Beneficios científicos
  metodoFarray: 'stretchingCitableMetodoFarray', // Método Farray
  statistics: 'stretchingCitableStatistics', // Estadísticas
  fact1: 'stretchingCitableFact1', // Quema calorías
  fact2: 'stretchingCitableFact2', // Mejora flexibilidad %
  fact3: 'stretchingCitableFact3', // Reduce lesiones %
};
