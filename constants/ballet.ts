import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Ballet page (17 FAQs for comprehensive SEO)
// Q16 (benefits) and Q17 (how it works) are placed first as most important
export const BALLET_FAQS_CONFIG: FAQ[] = [
  { id: 'ballet-16', questionKey: 'balletFaqQ16', answerKey: 'balletFaqA16' },
  { id: 'ballet-17', questionKey: 'balletFaqQ17', answerKey: 'balletFaqA17' },
  { id: 'ballet-1', questionKey: 'balletFaqQ1', answerKey: 'balletFaqA1' },
  { id: 'ballet-2', questionKey: 'balletFaqQ2', answerKey: 'balletFaqA2' },
  { id: 'ballet-3', questionKey: 'balletFaqQ3', answerKey: 'balletFaqA3' },
  { id: 'ballet-4', questionKey: 'balletFaqQ4', answerKey: 'balletFaqA4' },
  { id: 'ballet-5', questionKey: 'balletFaqQ5', answerKey: 'balletFaqA5' },
  { id: 'ballet-6', questionKey: 'balletFaqQ6', answerKey: 'balletFaqA6' },
  { id: 'ballet-7', questionKey: 'balletFaqQ7', answerKey: 'balletFaqA7' },
  { id: 'ballet-8', questionKey: 'balletFaqQ8', answerKey: 'balletFaqA8' },
  { id: 'ballet-9', questionKey: 'balletFaqQ9', answerKey: 'balletFaqA9' },
  { id: 'ballet-10', questionKey: 'balletFaqQ10', answerKey: 'balletFaqA10' },
  { id: 'ballet-11', questionKey: 'balletFaqQ11', answerKey: 'balletFaqA11' },
  { id: 'ballet-12', questionKey: 'balletFaqQ12', answerKey: 'balletFaqA12' },
  { id: 'ballet-13', questionKey: 'balletFaqQ13', answerKey: 'balletFaqA13' },
  { id: 'ballet-14', questionKey: 'balletFaqQ14', answerKey: 'balletFaqA14' },
  { id: 'ballet-15', questionKey: 'balletFaqQ15', answerKey: 'balletFaqA15' },
  { id: 'ballet-18', questionKey: 'balletFaqQ18', answerKey: 'balletFaqA18' },
];

// Testimonials for Ballet page (4 testimonials: 3 Google reviews + 1 specific)
export const BALLET_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Patricia L.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: "The quality of instruction at Farray's is exceptional. As a former dancer returning after years, I found the perfect balance between technical rigor and supportive environment.",
      es: "La calidad de la enseñanza en Farray's es excepcional. Como ex bailarina que vuelve después de años, encontré el equilibrio perfecto entre rigor técnico y un ambiente de apoyo.",
      ca: "La qualitat de l'ensenyament a Farray's és excepcional. Com a ex ballarina que torna després d'anys, vaig trobar l'equilibri perfecte entre rigor tècnic i un ambient de suport.",
      fr: "La qualité de l'enseignement chez Farray's est exceptionnelle. En tant qu'ancienne danseuse qui revient après des années, j'ai trouvé l'équilibre parfait entre rigueur technique et environnement bienveillant.",
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const BALLET_COURSE_CONFIG = {
  teaches:
    'Ballet clásico, danza clásica, técnica de ballet, posiciones de ballet, flexibilidad, postura, coordinación, expresión corporal',
  prerequisites: 'Ninguno',
  lessons: '2 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Ballet classes
export const BALLET_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Ballet Clásico Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Daniel Sené',
    levelKey: 'intermediateLevel',
  },
  {
    id: '2',
    dayKey: 'thursday',
    className: 'Ballet Principiantes',
    time: '11:00 - 12:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicLevel',
  },
];

// Breadcrumb custom keys for Ballet (4 levels: Home > Classes > Dance > Current)
export const BALLET_BREADCRUMB_KEYS = {
  home: 'balletBreadcrumbHome',
  classes: 'balletBreadcrumbClasses',
  dance: 'balletBreadcrumbDance',
  current: 'balletBreadcrumbCurrent',
};

// YouTube video ID for the page (can be updated when a video is available)
export const BALLET_VIDEO_ID = '';

// Nearby neighborhoods for local SEO
export const BALLET_NEARBY_AREAS = [
  { name: 'Plaza España', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estació', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const BALLET_GEO_KEYS = {
  definicion: 'balletCitableDefinicion', // Definición oficial Ballet Clásico
  origin: 'balletCitableOrigen', // Origen histórico (Italia, Francia, Rusia)
  tecnicas: 'balletCitableTecnicas', // Técnicas principales (5 posiciones, barra, puntas)
  metodologia: 'balletCitableMetodologia', // Metodología de enseñanza
  statistics: 'balletStatistics', // Estadísticas generales
  globalEvolution: 'balletCitableEvolucionGlobal', // Expansión mundial
  expressionBody: 'balletCitableExpresionCorporal', // Expresión corporal y gracia
  escuelaCubana: 'balletCitableEscuelaCubana', // Conexión con la Escuela Cubana
  fact1: 'balletCitableFact1', // Calorías: 300-500/hora
  fact2: 'balletCitableFact2', // Beneficios cognitivos de la danza
  fact3: 'balletCitableFact3', // Farray's y la técnica cubana
  legado: 'balletCitableLegado', // Legado artístico
};

// Hero Stats configuration (for AnimatedCounter)
export const BALLET_HERO_STATS = {
  minutes: '60', // Clases de 60 minutos
  calories: 400, // Calorías quemadas por clase
  techniquePercent: 100, // 100% Técnica Cubana
};

// Level descriptions for cards - 2 levels
export const BALLET_LEVELS = [
  {
    id: 'principiantes',
    levelKey: 'basicLevel',
    titleKey: 'balletLevelBasicTitle',
    descKey: 'balletLevelBasicDesc',
    duration: '0-6 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'balletLevelIntermediateTitle',
    descKey: 'balletLevelIntermediateDesc',
    duration: '+12 meses',
    color: 'primary-accent' as const,
  },
];

// Prepare class configuration
export const BALLET_PREPARE_CONFIG = {
  prefix: 'balletPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: {
    name: 'Daniel Sené',
    credential: 'Profesor de Ballet',
    image: undefined,
  },
};
