import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

/**
 * Cuerpo-Fit (Full Body Cardio Dance) Page Data
 *
 * NOTA: Este archivo es para la NUEVA clase Cuerpo-Fit (cardio dance para todos).
 * No confundir con cuerpo-fit.ts que es Body Conditioning para bailarines.
 *
 * SEO Keywords:
 * - cuerpo fit barcelona
 * - entrenamiento full body barcelona
 * - cardio dance barcelona
 * - clases fitness barcelona
 * - quemar calorías bailando
 * - fitness dance barcelona
 * - ejercicios full body barcelona
 * - clases de cardio para principiantes barcelona
 * - perder peso bailando barcelona
 */

// FAQs configuration for Cuerpo-Fit page (15 FAQs for comprehensive SEO & featured snippets)
export const FULL_BODY_CARDIO_FAQS_CONFIG: FAQ[] = [
  { id: 'fullbodycardio-1', questionKey: 'fullBodyCardioFaqQ1', answerKey: 'fullBodyCardioFaqA1' },
  { id: 'fullbodycardio-2', questionKey: 'fullBodyCardioFaqQ2', answerKey: 'fullBodyCardioFaqA2' },
  { id: 'fullbodycardio-3', questionKey: 'fullBodyCardioFaqQ3', answerKey: 'fullBodyCardioFaqA3' },
  { id: 'fullbodycardio-4', questionKey: 'fullBodyCardioFaqQ4', answerKey: 'fullBodyCardioFaqA4' },
  { id: 'fullbodycardio-5', questionKey: 'fullBodyCardioFaqQ5', answerKey: 'fullBodyCardioFaqA5' },
  { id: 'fullbodycardio-6', questionKey: 'fullBodyCardioFaqQ6', answerKey: 'fullBodyCardioFaqA6' },
  { id: 'fullbodycardio-7', questionKey: 'fullBodyCardioFaqQ7', answerKey: 'fullBodyCardioFaqA7' },
  { id: 'fullbodycardio-8', questionKey: 'fullBodyCardioFaqQ8', answerKey: 'fullBodyCardioFaqA8' },
  { id: 'fullbodycardio-9', questionKey: 'fullBodyCardioFaqQ9', answerKey: 'fullBodyCardioFaqA9' },
  {
    id: 'fullbodycardio-10',
    questionKey: 'fullBodyCardioFaqQ10',
    answerKey: 'fullBodyCardioFaqA10',
  },
  {
    id: 'fullbodycardio-11',
    questionKey: 'fullBodyCardioFaqQ11',
    answerKey: 'fullBodyCardioFaqA11',
  },
  {
    id: 'fullbodycardio-12',
    questionKey: 'fullBodyCardioFaqQ12',
    answerKey: 'fullBodyCardioFaqA12',
  },
  {
    id: 'fullbodycardio-13',
    questionKey: 'fullBodyCardioFaqQ13',
    answerKey: 'fullBodyCardioFaqA13',
  },
  {
    id: 'fullbodycardio-14',
    questionKey: 'fullBodyCardioFaqQ14',
    answerKey: 'fullBodyCardioFaqA14',
  },
  {
    id: 'fullbodycardio-15',
    questionKey: 'fullBodyCardioFaqQ15',
    answerKey: 'fullBodyCardioFaqA15',
  },
];

// Testimonials for Cuerpo-Fit page
export const FULL_BODY_CARDIO_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Marta López',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'After trying countless gyms, I finally found something that works. Cuerpo-Fit with Cris is intense but fun. I lost 5kg in 2 months without feeling like I was exercising!',
      es: 'Después de probar incontables gimnasios, finalmente encontré algo que funciona. Cuerpo-Fit con Cris es intenso pero divertido. ¡Perdí 5kg en 2 meses sin sentir que estaba haciendo ejercicio!',
      ca: 'Després de provar incomptables gimnasos, finalment vaig trobar alguna cosa que funciona. Cuerpo-Fit amb Cris és intens però divertit. Vaig perdre 5kg en 2 mesos sense sentir que estava fent exercici!',
      fr: "Après avoir essayé d'innombrables salles de sport, j'ai enfin trouvé quelque chose qui fonctionne. Cuerpo-Fit avec Cris est intense mais amusant. J'ai perdu 5kg en 2 mois sans avoir l'impression de faire du sport !",
    },
  },
];

// Course schema configuration
export const FULL_BODY_CARDIO_COURSE_CONFIG = {
  teaches:
    'Cuerpo-Fit, entrenamiento full body, cardio dance, tonificación integral, ejercicios funcionales con música, quema de calorías, acondicionamiento físico para todos los niveles',
  prerequisites:
    'Ninguno - clase abierta para todos los niveles sin experiencia previa en baile ni fitness',
  lessons: '1 clase semanal',
  duration: 'PT1H',
};

// Schedule data for Cuerpo-Fit classes (Lunes 20:00-21:00)
export const FULL_BODY_CARDIO_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Cuerpo-Fit',
    time: '20:00 - 21:00',
    teacher: 'Cris Ag',
    levelKey: 'allLevels',
  },
];

// Breadcrumb custom keys for Cuerpo-Fit (4 levels: Home > Classes > Fitness > Cuerpo-Fit)
export const FULL_BODY_CARDIO_BREADCRUMB_KEYS = {
  home: 'fullBodyCardioBreadcrumbHome',
  classes: 'fullBodyCardioBreadcrumbClasses',
  category: 'fullBodyCardioBreadcrumbCategory',
  current: 'fullBodyCardioBreadcrumbCurrent',
};

// Level descriptions - Cuerpo-Fit is open level (single level, todos bienvenidos)
export const FULL_BODY_CARDIO_LEVELS = [
  {
    id: 'todos',
    levelKey: 'allLevels',
    titleKey: 'fullBodyCardioLevelOpenTitle',
    descKey: 'fullBodyCardioLevelOpenDesc',
    duration: 'Siempre',
    color: 'primary-accent' as const,
  },
];

import { getTeacherQuoteInfo } from './teacher-images';

// Prepare class configuration
export const FULL_BODY_CARDIO_PREPARE_CONFIG = {
  prefix: 'fullBodyCardioPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: getTeacherQuoteInfo('cris-ag', 'Especialista en Entrenamiento Full Body y Cardio Dance'),
};

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, Gemini, etc.)
// Optimizadas para prominencia semántica y búsquedas por voz
export const FULL_BODY_CARDIO_GEO_KEYS = {
  definicion: 'fullBodyCardioCitableDefinicion', // Definición del método Cuerpo-Fit
  metodo: 'fullBodyCardioCitableMetodo', // Origen: condicionamiento de bailarines adaptado
  quema: 'fullBodyCardioCitableQuema', // Datos de quema calórica: 400-500 kcal
  stats: 'fullBodyCardioCitableStats', // Estadísticas de la clase
  beneficios: 'fullBodyCardioCitableBeneficios', // Beneficios científicos del full body
  ubicacion: 'fullBodyCardioCitableUbicacion', // Ubicación: Barcelona, Plaza España, Sants
  comparacion: 'fullBodyCardioCitableComparacion', // Comparación con gimnasio tradicional
  resultados: 'fullBodyCardioCitableResultados', // Resultados esperados en 4-8 semanas
};
