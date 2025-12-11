import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Stretching page (18 FAQs for maximum SEO)
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
  // Long-tail local SEO FAQs
  { id: 'stretching-13', questionKey: 'stretchingFaqQ13', answerKey: 'stretchingFaqA13' },
  { id: 'stretching-14', questionKey: 'stretchingFaqQ14', answerKey: 'stretchingFaqA14' },
  { id: 'stretching-15', questionKey: 'stretchingFaqQ15', answerKey: 'stretchingFaqA15' },
  { id: 'stretching-16', questionKey: 'stretchingFaqQ16', answerKey: 'stretchingFaqA16' },
  { id: 'stretching-17', questionKey: 'stretchingFaqQ17', answerKey: 'stretchingFaqA17' },
  { id: 'stretching-18', questionKey: 'stretchingFaqQ18', answerKey: 'stretchingFaqA18' },
];

// Testimonials for Stretching page (3 Google reviews + 1 specific)
export const STRETCHING_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Maria T.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, Espana',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'CrisAg transformed my flexibility completely. After 6 months I achieved my first split at 42 years old. The method is different from anything I had tried before.',
      es: 'CrisAg transformo mi flexibilidad por completo. Despues de 6 meses consegui mi primer split a los 42 anos. El metodo es diferente a todo lo que habia probado antes.',
      ca: 'CrisAg va transformar la meva flexibilitat completament. Despres de 6 mesos vaig aconseguir el meu primer split als 42 anys. El metode es diferent a tot el que havia provat abans.',
      fr: "CrisAg a completement transforme ma flexibilite. Apres 6 mois, j'ai reussi mon premier grand ecart a 42 ans. La methode est differente de tout ce que j'avais essaye avant.",
    },
  },
];

// Course schema configuration
export const STRETCHING_COURSE_CONFIG = {
  teaches: 'Stretching, flexibilidad, backbending, splits, movilidad articular',
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
    teacher: 'CrisAg',
    levelKey: 'beginnerLevel',
    duration: '60 min',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Stretching Principiantes',
    time: '18:00 - 19:00',
    teacher: 'CrisAg',
    levelKey: 'beginnerLevel',
    duration: '60 min',
  },
  {
    id: '3',
    dayKey: 'thursday',
    className: 'Stretching Basico',
    time: '19:00 - 20:00',
    teacher: 'Daniel Sene',
    levelKey: 'basicLevel',
    duration: '60 min',
  },
  {
    id: '4',
    dayKey: 'monday',
    className: 'Backbending & Legs Intermedio',
    time: '21:00 - 22:30',
    teacher: 'CrisAg',
    levelKey: 'intermediateLevel',
    duration: '90 min',
  },
  {
    id: '5',
    dayKey: 'wednesday',
    className: 'Backbending & Legs Intermedio',
    time: '20:00 - 21:30',
    teacher: 'CrisAg',
    levelKey: 'intermediateLevel',
    duration: '90 min',
  },
];

// Breadcrumb custom keys for Stretching
export const STRETCHING_BREADCRUMB_KEYS = {
  home: 'stretchingBreadcrumbHome',
  classes: 'stretchingBreadcrumbClasses',
  current: 'stretchingBreadcrumbCurrent',
};

// Pricing data for Stretching
export const STRETCHING_PRICING = [
  {
    id: 'trial',
    nameKey: 'stretchingPriceTrial',
    price: 'Gratis / Precio simbolico',
    descKey: 'stretchingPriceTrialDesc',
  },
  {
    id: 'single-1h',
    nameKey: 'stretchingPriceSingle1h',
    price: '17 EUR',
    descKey: 'stretchingPriceSingle1hDesc',
  },
  {
    id: 'single-1.5h',
    nameKey: 'stretchingPriceSingle15h',
    price: '20 EUR',
    descKey: 'stretchingPriceSingle15hDesc',
  },
  {
    id: 'monthly-1h',
    nameKey: 'stretchingPriceMonthly1h',
    price: '50 EUR/mes',
    descKey: 'stretchingPriceMonthly1hDesc',
    popular: true,
  },
  {
    id: 'monthly-1.5h',
    nameKey: 'stretchingPriceMonthly15h',
    price: '60 EUR/mes',
    descKey: 'stretchingPriceMonthly15hDesc',
  },
  {
    id: 'bono-10-1h',
    nameKey: 'stretchingPriceBono10_1h',
    price: '145 EUR',
    descKey: 'stretchingPriceBono10_1hDesc',
  },
  {
    id: 'bono-10-1.5h',
    nameKey: 'stretchingPriceBono10_15h',
    price: '170 EUR',
    descKey: 'stretchingPriceBono10_15hDesc',
  },
];

// Teachers data for Stretching
export const STRETCHING_TEACHERS = [
  {
    id: 'crisag',
    name: 'CrisAg',
    imageKey: '/images/teachers/img/profesora-stretching-crisag',
    specialtyKey: 'stretchingTeacher1Specialty',
    bioKey: 'stretchingTeacher1Bio',
    classes: ['Stretching Principiantes', 'Backbending & Legs Intermedio'],
  },
  {
    id: 'daniel-sene',
    name: 'Daniel Sene',
    imageKey: '/images/teachers/img/profesor-stretching-daniel-sene',
    specialtyKey: 'stretchingTeacher2Specialty',
    bioKey: 'stretchingTeacher2Bio',
    classes: ['Stretching Basico'],
  },
];

// Benefits grid for body, movement, and mind
export const STRETCHING_BENEFITS = {
  body: [
    'stretchingBenefitBody1',
    'stretchingBenefitBody2',
    'stretchingBenefitBody3',
    'stretchingBenefitBody4',
    'stretchingBenefitBody5',
    'stretchingBenefitBody6',
  ],
  movement: [
    'stretchingBenefitMovement1',
    'stretchingBenefitMovement2',
    'stretchingBenefitMovement3',
    'stretchingBenefitMovement4',
  ],
  mind: [
    'stretchingBenefitMind1',
    'stretchingBenefitMind2',
    'stretchingBenefitMind3',
    'stretchingBenefitMind4',
  ],
};

// Method pillars
export const STRETCHING_METHOD_PILLARS = [
  {
    id: 'progression',
    titleKey: 'stretchingMethodPillar1Title',
    descKey: 'stretchingMethodPillar1Desc',
  },
  {
    id: 'strength-flex',
    titleKey: 'stretchingMethodPillar2Title',
    descKey: 'stretchingMethodPillar2Desc',
  },
  {
    id: 'correction',
    titleKey: 'stretchingMethodPillar3Title',
    descKey: 'stretchingMethodPillar3Desc',
  },
];

// Comparison table data
export const STRETCHING_COMPARISON = [
  {
    gymKey: 'stretchingCompareGym1',
    farrayKey: 'stretchingCompareFarray1',
  },
  {
    gymKey: 'stretchingCompareGym2',
    farrayKey: 'stretchingCompareFarray2',
  },
  {
    gymKey: 'stretchingCompareGym3',
    farrayKey: 'stretchingCompareFarray3',
  },
  {
    gymKey: 'stretchingCompareGym4',
    farrayKey: 'stretchingCompareFarray4',
  },
  {
    gymKey: 'stretchingCompareGym5',
    farrayKey: 'stretchingCompareFarray5',
  },
  {
    gymKey: 'stretchingCompareGym6',
    farrayKey: 'stretchingCompareFarray6',
  },
];

// For whom section identifications
export const STRETCHING_FOR_WHOM = [
  'stretchingForWhom1',
  'stretchingForWhom2',
  'stretchingForWhom3',
  'stretchingForWhom4',
  'stretchingForWhom5',
  'stretchingForWhom6',
  'stretchingForWhom7',
];

// Nearby neighborhoods for local SEO
export const STRETCHING_NEARBY_AREAS = [
  { name: 'Plaza Espana', time: '5 min andando' },
  { name: 'Hostafrancs', time: '3 min andando' },
  { name: 'Sants Estacio', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];
