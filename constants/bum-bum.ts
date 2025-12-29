import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

/**
 * Bum Bum Glúteos Maravillosos Page Configuration
 *
 * SEO Keywords:
 * - ejercicios de glúteos
 * - ejercicios gluteos barcelona
 * - tonificar glúteos
 * - aumentar glúteos
 * - glúteos firmes
 * - hip thrust
 * - clases de glúteos barcelona
 * - entrenamiento glúteos
 * - fortalecer glúteos
 */

// FAQs configuration for Bum Bum page (15 FAQs for comprehensive SEO)
export const BUM_BUM_FAQS_CONFIG: FAQ[] = [
  { id: 'bumbum-1', questionKey: 'bumbumFaqQ1', answerKey: 'bumbumFaqA1' },
  { id: 'bumbum-2', questionKey: 'bumbumFaqQ2', answerKey: 'bumbumFaqA2' },
  { id: 'bumbum-3', questionKey: 'bumbumFaqQ3', answerKey: 'bumbumFaqA3' },
  { id: 'bumbum-4', questionKey: 'bumbumFaqQ4', answerKey: 'bumbumFaqA4' },
  { id: 'bumbum-5', questionKey: 'bumbumFaqQ5', answerKey: 'bumbumFaqA5' },
  { id: 'bumbum-6', questionKey: 'bumbumFaqQ6', answerKey: 'bumbumFaqA6' },
  { id: 'bumbum-7', questionKey: 'bumbumFaqQ7', answerKey: 'bumbumFaqA7' },
  { id: 'bumbum-8', questionKey: 'bumbumFaqQ8', answerKey: 'bumbumFaqA8' },
  { id: 'bumbum-9', questionKey: 'bumbumFaqQ9', answerKey: 'bumbumFaqA9' },
  { id: 'bumbum-10', questionKey: 'bumbumFaqQ10', answerKey: 'bumbumFaqA10' },
  { id: 'bumbum-11', questionKey: 'bumbumFaqQ11', answerKey: 'bumbumFaqA11' },
  { id: 'bumbum-12', questionKey: 'bumbumFaqQ12', answerKey: 'bumbumFaqA12' },
  { id: 'bumbum-13', questionKey: 'bumbumFaqQ13', answerKey: 'bumbumFaqA13' },
  { id: 'bumbum-14', questionKey: 'bumbumFaqQ14', answerKey: 'bumbumFaqA14' },
  { id: 'bumbum-15', questionKey: 'bumbumFaqQ15', answerKey: 'bumbumFaqA15' },
];

// Testimonials for Bum Bum page
export const BUM_BUM_TESTIMONIALS: Testimonial[] = [
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
      en: 'After 3 months of Bum Bum classes, I finally see real results in my glutes. The combination of dance and specific exercises is incredibly effective.',
      es: 'Después de 3 meses de clases de Bum Bum, por fin veo resultados reales en mis glúteos. La combinación de danza y ejercicios específicos es increíblemente efectiva.',
      ca: 'Després de 3 mesos de classes de Bum Bum, per fi veig resultats reals als meus glutis. La combinació de dansa i exercicis específics és increïblement efectiva.',
      fr: "Après 3 mois de cours de Bum Bum, je vois enfin de vrais résultats sur mes fessiers. La combinaison de danse et d'exercices spécifiques est incroyablement efficace.",
    },
  },
];

// Course schema configuration
export const BUM_BUM_COURSE_CONFIG = {
  teaches:
    'Ejercicios de glúteos, hip thrust, sentadillas, puente de glúteos, tonificación muscular, fortalecimiento tren inferior',
  prerequisites: 'Ninguno - clase abierta para todos los niveles',
  lessons: '1 clase semanal',
  duration: 'PT1H',
};

// Schedule data for Bum Bum classes
export const BUM_BUM_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Bum Bum Cuerpo Fit Open Level',
    time: '20:00 - 21:00',
    teacher: 'Cris Ag',
    levelKey: 'openLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Bum Bum Glúteos Maravillosos Open Level',
    time: '19:00 - 20:00',
    teacher: 'Cris Ag',
    levelKey: 'openLevel',
  },
];

// Breadcrumb custom keys (4 levels: Home > Classes > Prep Física > Bum Bum)
export const BUM_BUM_BREADCRUMB_KEYS = {
  home: 'bumbumBreadcrumbHome',
  classes: 'bumbumBreadcrumbClasses',
  category: 'bumbumBreadcrumbCategory',
  current: 'bumbumBreadcrumbCurrent',
};

// Level descriptions - Single open level
export const BUM_BUM_LEVELS = [
  {
    id: 'open',
    levelKey: 'openLevel',
    titleKey: 'bumbumLevelOpenTitle',
    descKey: 'bumbumLevelOpenDesc',
    duration: 'Todos los niveles',
    color: 'primary-accent' as const,
  },
];

import { getTeacherQuoteInfo } from './teacher-images';

// Prepare class configuration
export const BUM_BUM_PREPARE_CONFIG = {
  prefix: 'bumbumPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: getTeacherQuoteInfo('cris-ag', 'Especialista en Tonificación y Glúteos'),
};

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const BUM_BUM_GEO_KEYS = {
  definicion: 'bumbumCitableDefinicion', // Definición del programa
  hipThrust: 'bumbumCitableHipThrust', // Hip thrust como ejercicio estrella
  beneficios: 'bumbumCitableBeneficios', // Beneficios científicos
  metodoFarray: 'bumbumCitableMetodoFarray', // Método Farray aplicado
  statistics: 'bumbumCitableStatistics', // Estadísticas
  fact1: 'bumbumCitableFact1', // Calorías quemadas
  fact2: 'bumbumCitableFact2', // Activación muscular
  fact3: 'bumbumCitableFact3', // Resultados en semanas
};

// Hero Stats configuration
export const BUM_BUM_HERO_STATS = {
  minutes: 60,
  calories: 350,
  funPercent: 100,
};
