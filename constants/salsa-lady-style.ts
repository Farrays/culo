import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Salsa Lady Style page (15 FAQs for comprehensive SEO)
export const SALSA_LADY_STYLE_FAQS_CONFIG: FAQ[] = [
  {
    id: 'salsa-lady-1',
    questionKey: 'salsaLadyFaqQ1',
    answerKey: 'salsaLadyFaqA1',
  },
  {
    id: 'salsa-lady-2',
    questionKey: 'salsaLadyFaqQ2',
    answerKey: 'salsaLadyFaqA2',
  },
  {
    id: 'salsa-lady-3',
    questionKey: 'salsaLadyFaqQ3',
    answerKey: 'salsaLadyFaqA3',
  },
  {
    id: 'salsa-lady-4',
    questionKey: 'salsaLadyFaqQ4',
    answerKey: 'salsaLadyFaqA4',
  },
  {
    id: 'salsa-lady-5',
    questionKey: 'salsaLadyFaqQ5',
    answerKey: 'salsaLadyFaqA5',
  },
  {
    id: 'salsa-lady-6',
    questionKey: 'salsaLadyFaqQ6',
    answerKey: 'salsaLadyFaqA6',
  },
  {
    id: 'salsa-lady-7',
    questionKey: 'salsaLadyFaqQ7',
    answerKey: 'salsaLadyFaqA7',
  },
  {
    id: 'salsa-lady-8',
    questionKey: 'salsaLadyFaqQ8',
    answerKey: 'salsaLadyFaqA8',
  },
  {
    id: 'salsa-lady-9',
    questionKey: 'salsaLadyFaqQ9',
    answerKey: 'salsaLadyFaqA9',
  },
  {
    id: 'salsa-lady-10',
    questionKey: 'salsaLadyFaqQ10',
    answerKey: 'salsaLadyFaqA10',
  },
  {
    id: 'salsa-lady-11',
    questionKey: 'salsaLadyFaqQ11',
    answerKey: 'salsaLadyFaqA11',
  },
  {
    id: 'salsa-lady-12',
    questionKey: 'salsaLadyFaqQ12',
    answerKey: 'salsaLadyFaqA12',
  },
  {
    id: 'salsa-lady-13',
    questionKey: 'salsaLadyFaqQ13',
    answerKey: 'salsaLadyFaqA13',
  },
  {
    id: 'salsa-lady-14',
    questionKey: 'salsaLadyFaqQ14',
    answerKey: 'salsaLadyFaqA14',
  },
  {
    id: 'salsa-lady-15',
    questionKey: 'salsaLadyFaqQ15',
    answerKey: 'salsaLadyFaqA15',
  },
];

// Testimonials for Salsa Lady Style page
export const SALSA_LADY_STYLE_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Laura G.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The Lady Style classes with Yunaisy transformed my way of dancing completely. Now I feel elegant, confident and my movements have a feminine quality I never thought possible. The Farray Method is unique.',
      es: 'Las clases de Lady Style con Yunaisy transformaron mi forma de bailar por completo. Ahora me siento elegante, segura y mis movimientos tienen una calidad femenina que nunca pensé posible. El Método Farray es único.',
      ca: 'Les classes de Lady Style amb Yunaisy van transformar la meva forma de ballar completament. Ara em sento elegant, segura i els meus moviments tenen una qualitat femenina que mai vaig pensar possible. El Mètode Farray és únic.',
      fr: "Les cours de Lady Style avec Yunaisy ont complètement transformé ma façon de danser. Maintenant je me sens élégante, confiante et mes mouvements ont une qualité féminine que je n'aurais jamais cru possible. La Méthode Farray est unique.",
    },
  },
];

// Course schema configuration
export const SALSA_LADY_STYLE_COURSE_CONFIG = {
  teaches:
    'Salsa Lady Style, Estilo Chica, técnica femenina, braceo, caminar con tacones, elegancia, musicalidad, Método Farray',
  prerequisites: 'Ninguno - clases para todos los niveles',
  lessons: 'Clases semanales con progresión por niveles',
  duration: 'PT1H',
};

// Schedule data for Salsa Lady Style classes
export const SALSA_LADY_STYLE_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'wednesday',
    className: 'Salsa Cubana Ladies Styling Open Level',
    time: '11:00 - 12:00',
    teacher: 'Yasmina Fernández',
    levelKey: 'openLevel',
  },
  {
    id: '2',
    dayKey: 'monday',
    className: 'Salsa Cubana Ladies Styling Intermedio',
    time: '19:00 - 20:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'intermediateLevel',
  },
  {
    id: '3',
    dayKey: 'wednesday',
    className: 'Salsa Cubana Ladies Styling Básico',
    time: '19:00 - 20:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'basicLevel',
  },
  {
    id: '4',
    dayKey: 'wednesday',
    className: 'Salsa Cubana Ladies Styling Principiantes',
    time: '20:00 - 21:00',
    teacher: 'Lía Valdes',
    levelKey: 'beginnerLevel',
  },
];

// Level descriptions for cards - 4 levels
export const SALSA_LADY_STYLE_LEVELS = [
  {
    id: 'principiante',
    levelKey: 'beginnerLevel',
    titleKey: 'salsaLadyLevelBeginnerTitle',
    descKey: 'salsaLadyLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'salsaLadyLevelBasicTitle',
    descKey: 'salsaLadyLevelBasicDesc',
    duration: '3-6 meses',
    color: 'primary-dark-mid' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'salsaLadyLevelIntermediateTitle',
    descKey: 'salsaLadyLevelIntermediateDesc',
    duration: '6-12 meses',
    color: 'primary-accent-light' as const,
  },
  {
    id: 'avanzado',
    levelKey: 'advancedLevel',
    titleKey: 'salsaLadyLevelAdvancedTitle',
    descKey: 'salsaLadyLevelAdvancedDesc',
    duration: '+12 meses',
    color: 'primary-accent' as const,
  },
];

import { getTeacherQuoteInfo } from './teacher-images';

// Prepare class configuration
export const SALSA_LADY_STYLE_PREPARE_CONFIG = {
  prefix: 'salsaLadyPrepare',
  whatToBringCount: 5,
  beforeCount: 3,
  avoidCount: 3,
  teacher: getTeacherQuoteInfo('yunaisy-farray', "Directora de Farray's Center"),
};

// Nearby neighborhoods for local SEO
export const SALSA_LADY_STYLE_NEARBY_AREAS = [
  { name: 'Plaza España', time: '5 min' },
  { name: 'Hostafrancs', time: '5 min' },
  { name: 'Sants Estació', time: '10 min' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];

// Breadcrumb custom keys
export const SALSA_LADY_STYLE_BREADCRUMB_KEYS = {
  home: 'salsaLadyBreadcrumbHome',
  classes: 'salsaLadyBreadcrumbClasses',
  latin: 'salsaLadyBreadcrumbLatin',
  current: 'salsaLadyBreadcrumbCurrent',
};

// YouTube video ID for the page - Yunaisy Farray performing Lady Style
export const SALSA_LADY_STYLE_VIDEO_ID = 'C5sQnx-uNhI'; // Video de demostración Lady Style

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Optimizado para citabilidad por ChatGPT, Perplexity, Gemini y otros LLMs
export const SALSA_LADY_STYLE_GEO_KEYS = {
  definicion: 'salsaLadyCitableDefinicion',
  origen: 'salsaLadyCitableOrigen',
  rolFemenino: 'salsaLadyCitableRolFemenino',
  estiloCubano: 'salsaLadyCitableEstiloCubano',
  metodoFarray: 'salsaLadyCitableMetodoFarray',
  tecnicaFemenina: 'salsaLadyCitableTecnicaFemenina',
  beneficios: 'salsaLadyCitableBeneficios',
  statistics: 'salsaLadyStatistics',
  farrayCenter: 'salsaLadyCitableFarrayCenter',
  fact1: 'salsaLadyCitableFact1',
  fact2: 'salsaLadyCitableFact2',
  fact3: 'salsaLadyCitableFact3',
  empoderamiento: 'salsaLadyCitableEmpoderamiento',
};

// Hero Stats configuration
export const SALSA_LADY_STYLE_HERO_STATS = {
  minutes: 60,
  calories: 350,
  elegancePercent: 100,
};

// Benefits of Lady Style - 6 main benefits
export const SALSA_LADY_STYLE_BENEFITS = [
  {
    id: 1,
    titleKey: 'salsaLadyBenefit1Title',
    descKey: 'salsaLadyBenefit1Desc',
    icon: 'feminine',
  },
  {
    id: 2,
    titleKey: 'salsaLadyBenefit2Title',
    descKey: 'salsaLadyBenefit2Desc',
    icon: 'elegance',
  },
  {
    id: 3,
    titleKey: 'salsaLadyBenefit3Title',
    descKey: 'salsaLadyBenefit3Desc',
    icon: 'rhythm',
  },
  {
    id: 4,
    titleKey: 'salsaLadyBenefit4Title',
    descKey: 'salsaLadyBenefit4Desc',
    icon: 'posture',
  },
  {
    id: 5,
    titleKey: 'salsaLadyBenefit5Title',
    descKey: 'salsaLadyBenefit5Desc',
    icon: 'heels',
  },
  {
    id: 6,
    titleKey: 'salsaLadyBenefit6Title',
    descKey: 'salsaLadyBenefit6Desc',
    icon: 'fitness',
  },
];

// Comparison table: Salsa Cubana Pareja vs Salsa Lady/Timba vs Bachata Lady Style vs Timba
export const SALSA_LADY_COMPARISON_DATA = {
  styles: [
    { key: 'salsaCubanaPareja', nameKey: 'salsaLadyCompareSalsaPareja' },
    { key: 'salsaLadyTimba', nameKey: 'salsaLadyCompareSalsaLady' },
    { key: 'bachataLadyStyle', nameKey: 'salsaLadyCompareBachataLady' },
    { key: 'timba', nameKey: 'salsaLadyCompareTimba' },
  ],
  rows: [
    { rowKey: 'salsaLadyCompareRow1', values: [3, 5, 4, 3] }, // Técnica de brazos
    { rowKey: 'salsaLadyCompareRow2', values: [3, 5, 3, 4] }, // Movimientos de cadera
    { rowKey: 'salsaLadyCompareRow3', values: [2, 5, 5, 2] }, // Uso de tacones
    { rowKey: 'salsaLadyCompareRow4', values: [4, 5, 4, 5] }, // Musicalidad
    { rowKey: 'salsaLadyCompareRow5', values: [5, 3, 2, 5] }, // Conexión en pareja
    { rowKey: 'salsaLadyCompareRow6', values: [3, 5, 4, 4] }, // Expresión corporal femenina
    { rowKey: 'salsaLadyCompareRow7', values: [4, 4, 3, 5] }, // Ritmo y velocidad
    { rowKey: 'salsaLadyCompareRow8', values: [3, 5, 4, 3] }, // Elegancia y estilo
  ],
};
