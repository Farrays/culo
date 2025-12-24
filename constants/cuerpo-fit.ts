import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

/**
 * Body Conditioning / Acondicionamiento Físico Page Configuration
 *
 * SEO Keywords:
 * - acondicionamiento físico para bailarines
 * - body conditioning barcelona
 * - preparación física danza
 * - entrenamiento funcional bailarines
 * - fuerza y flexibilidad para bailar
 * - fitness bailarines barcelona
 * - entrenamiento complementario danza
 */

// FAQs configuration for Body Conditioning page (15 FAQs for comprehensive SEO)
export const CUERPO_FIT_FAQS_CONFIG: FAQ[] = [
  { id: 'cuerpofit-1', questionKey: 'cuerpofitFaqQ1', answerKey: 'cuerpofitFaqA1' },
  { id: 'cuerpofit-2', questionKey: 'cuerpofitFaqQ2', answerKey: 'cuerpofitFaqA2' },
  { id: 'cuerpofit-3', questionKey: 'cuerpofitFaqQ3', answerKey: 'cuerpofitFaqA3' },
  { id: 'cuerpofit-4', questionKey: 'cuerpofitFaqQ4', answerKey: 'cuerpofitFaqA4' },
  { id: 'cuerpofit-5', questionKey: 'cuerpofitFaqQ5', answerKey: 'cuerpofitFaqA5' },
  { id: 'cuerpofit-6', questionKey: 'cuerpofitFaqQ6', answerKey: 'cuerpofitFaqA6' },
  { id: 'cuerpofit-7', questionKey: 'cuerpofitFaqQ7', answerKey: 'cuerpofitFaqA7' },
  { id: 'cuerpofit-8', questionKey: 'cuerpofitFaqQ8', answerKey: 'cuerpofitFaqA8' },
  { id: 'cuerpofit-9', questionKey: 'cuerpofitFaqQ9', answerKey: 'cuerpofitFaqA9' },
  { id: 'cuerpofit-10', questionKey: 'cuerpofitFaqQ10', answerKey: 'cuerpofitFaqA10' },
  { id: 'cuerpofit-11', questionKey: 'cuerpofitFaqQ11', answerKey: 'cuerpofitFaqA11' },
  { id: 'cuerpofit-12', questionKey: 'cuerpofitFaqQ12', answerKey: 'cuerpofitFaqA12' },
  { id: 'cuerpofit-13', questionKey: 'cuerpofitFaqQ13', answerKey: 'cuerpofitFaqA13' },
  { id: 'cuerpofit-14', questionKey: 'cuerpofitFaqQ14', answerKey: 'cuerpofitFaqA14' },
  { id: 'cuerpofit-15', questionKey: 'cuerpofitFaqQ15', answerKey: 'cuerpofitFaqA15' },
];

// Testimonials for Body Conditioning page (extends Google reviews with specific testimonial)
export const CUERPO_FIT_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Andrea L.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'After months of discomfort while dancing, body conditioning changed my life. My technique improved because my body finally responds to what I ask of it.',
      es: 'Después de meses con molestias al bailar, el body conditioning me cambió la vida. Mi técnica mejoró porque mi cuerpo por fin responde a lo que le pido.',
      ca: 'Després de mesos amb molèsties en ballar, el body conditioning em va canviar la vida. La meva tècnica va millorar perquè el meu cos per fi respon al que li demano.',
      fr: "Après des mois d'inconfort en dansant, le body conditioning a changé ma vie. Ma technique s'est améliorée car mon corps répond enfin à ce que je lui demande.",
    },
  },
];

// Course schema configuration
export const CUERPO_FIT_COURSE_CONFIG = {
  teaches:
    'Body conditioning, acondicionamiento físico, fuerza funcional, flexibilidad activa, movilidad articular, core stability, prevención lesiones',
  prerequisites: 'Ninguno - clase abierta para todos los niveles',
  lessons: '1 clase semanal',
  duration: 'PT1H',
};

// Schedule data for Body Conditioning classes (Lunes 19:00-20:00)
export const CUERPO_FIT_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Body Conditioning',
    time: '19:00 - 20:00',
    teacher: 'Cris Ag',
    levelKey: 'openLevel',
  },
];

// Breadcrumb custom keys for Body Conditioning (4 levels: Home > Classes > Prep Física > Body Conditioning)
export const CUERPO_FIT_BREADCRUMB_KEYS = {
  home: 'cuerpofitBreadcrumbHome',
  classes: 'cuerpofitBreadcrumbClasses',
  category: 'cuerpofitBreadcrumbCategory',
  current: 'cuerpofitBreadcrumbCurrent',
};

// Level descriptions for cards - 1 level for Body Conditioning (Open Level)
export const CUERPO_FIT_LEVELS = [
  {
    id: 'open',
    levelKey: 'openLevel',
    titleKey: 'cuerpofitLevelOpenTitle',
    descKey: 'cuerpofitLevelOpenDesc',
    duration: 'Todos los niveles',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const CUERPO_FIT_PREPARE_CONFIG = {
  prefix: 'cuerpofitPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Cris Ag',
    credential: 'Especialista en Acondicionamiento Físico para Bailarines',
    image: undefined,
  },
};

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const CUERPO_FIT_GEO_KEYS = {
  definicion: 'cuerpofitCitableDefinicion', // Definición científica
  origen: 'cuerpofitCitableOrigen', // Joseph Pilates 1940s
  beneficios: 'cuerpofitCitableBeneficios', // Beneficios científicos
  metodoFarray: 'cuerpofitCitableMetodoFarray', // Método Farray
  statistics: 'cuerpofitCitableStatistics', // Estadísticas
  fact1: 'cuerpofitCitableFact1', // Quema calorías
  fact2: 'cuerpofitCitableFact2', // Reduce lesiones %
  fact3: 'cuerpofitCitableFact3', // Reviews y ubicación
};
