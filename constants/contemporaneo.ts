import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Contemporaneo page (15 FAQs for comprehensive SEO)
export const CONTEMPORANEO_FAQS_CONFIG: FAQ[] = [
  { id: 'contemporaneo-1', questionKey: 'contemporaneoFaqQ1', answerKey: 'contemporaneoFaqA1' },
  { id: 'contemporaneo-2', questionKey: 'contemporaneoFaqQ2', answerKey: 'contemporaneoFaqA2' },
  { id: 'contemporaneo-3', questionKey: 'contemporaneoFaqQ3', answerKey: 'contemporaneoFaqA3' },
  { id: 'contemporaneo-4', questionKey: 'contemporaneoFaqQ4', answerKey: 'contemporaneoFaqA4' },
  { id: 'contemporaneo-5', questionKey: 'contemporaneoFaqQ5', answerKey: 'contemporaneoFaqA5' },
  { id: 'contemporaneo-6', questionKey: 'contemporaneoFaqQ6', answerKey: 'contemporaneoFaqA6' },
  { id: 'contemporaneo-7', questionKey: 'contemporaneoFaqQ7', answerKey: 'contemporaneoFaqA7' },
  { id: 'contemporaneo-8', questionKey: 'contemporaneoFaqQ8', answerKey: 'contemporaneoFaqA8' },
  { id: 'contemporaneo-9', questionKey: 'contemporaneoFaqQ9', answerKey: 'contemporaneoFaqA9' },
  { id: 'contemporaneo-10', questionKey: 'contemporaneoFaqQ10', answerKey: 'contemporaneoFaqA10' },
  { id: 'contemporaneo-11', questionKey: 'contemporaneoFaqQ11', answerKey: 'contemporaneoFaqA11' },
  { id: 'contemporaneo-12', questionKey: 'contemporaneoFaqQ12', answerKey: 'contemporaneoFaqA12' },
  { id: 'contemporaneo-13', questionKey: 'contemporaneoFaqQ13', answerKey: 'contemporaneoFaqA13' },
  { id: 'contemporaneo-14', questionKey: 'contemporaneoFaqQ14', answerKey: 'contemporaneoFaqA14' },
  { id: 'contemporaneo-15', questionKey: 'contemporaneoFaqQ15', answerKey: 'contemporaneoFaqA15' },
];

// Testimonials for Contemporaneo page (extends Google reviews with specific testimonial)
export const CONTEMPORANEO_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Paula M.',
    image: '/images/testimonials/placeholder-f.jpg',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Contemporary dance classes here are incredible. Alejandro helps you discover your own body language while mastering technique.',
      es: 'Las clases de danza contemporánea son increíbles. Alejandro te ayuda a descubrir tu propio lenguaje corporal mientras dominas la técnica.',
      ca: "Les classes de dansa contemporània són increïbles. L'Alejandro t'ajuda a descobrir el teu propi llenguatge corporal mentre domines la tècnica.",
      fr: 'Les cours de danse contemporaine sont incroyables. Alejandro vous aide à découvrir votre propre langage corporel tout en maîtrisant la technique.',
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const CONTEMPORANEO_COURSE_CONFIG = {
  teaches: 'Danza Contemporánea, técnica de suelo, release, improvisación, expresión corporal',
  prerequisites: 'Ninguno',
  lessons: '4 clases semanales',
  duration: 'PT1H',
};

// Schedule data for Contemporaneo classes (Real schedules 2025)
// Profesores: Daniel Sené y Alejandro Miñoso - Bailarines profesionales formados en la Escuela Cubana
export const CONTEMPORANEO_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Contemporáneo Lírico Básico',
    time: '11:00 - 12:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicLevel',
  },
  {
    id: '2',
    dayKey: 'monday',
    className: 'Contemporáneo Lírico Básico',
    time: '19:00 - 20:00',
    teacher: 'Daniel Sené',
    levelKey: 'basicLevel',
  },
  {
    id: '3',
    dayKey: 'wednesday',
    className: 'Contemporáneo Suelo & Flow',
    time: '11:00 - 12:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicIntermediateLevel',
  },
  {
    id: '4',
    dayKey: 'wednesday',
    className: 'Contemporáneo Suelo & Flow',
    time: '18:00 - 19:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicIntermediateLevel',
  },
  {
    id: '5',
    dayKey: 'wednesday',
    className: 'Contemporáneo Lírico Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Daniel Sené',
    levelKey: 'intermediateLevel',
  },
  {
    id: '6',
    dayKey: 'thursday',
    className: 'Contemporáneo Lírico Básico',
    time: '18:00 - 19:00',
    teacher: 'Daniel Sené',
    levelKey: 'basicLevel',
  },
];

// Level descriptions for cards after schedule (3 types of classes)
export const CONTEMPORANEO_LEVELS = [
  {
    id: 'lirico-basico',
    levelKey: 'basicLevel',
    titleKey: 'contemporaneoLevelLiricoBasicoTitle',
    descKey: 'contemporaneoLevelLiricoBasicoDesc',
    teachers: 'Daniel Sené, Alejandro Miñoso',
    schedules: ['Lunes 11:00', 'Lunes 19:00', 'Jueves 18:00'],
    color: 'blue',
    icon: 'feather', // Lírico = suave, expresivo
  },
  {
    id: 'lirico-intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'contemporaneoLevelLiricoIntermedioTitle',
    descKey: 'contemporaneoLevelLiricoIntermedioDesc',
    teachers: 'Daniel Sené',
    schedules: ['Miércoles 20:00'],
    color: 'purple',
    icon: 'wind',
  },
  {
    id: 'suelo-flow',
    levelKey: 'basicIntermediateLevel',
    titleKey: 'contemporaneoLevelSueloFlowTitle',
    descKey: 'contemporaneoLevelSueloFlowDesc',
    teachers: 'Alejandro Miñoso',
    schedules: ['Miércoles 11:00', 'Miércoles 18:00'],
    color: 'orange',
    icon: 'ground', // Suelo = conexión con el piso
  },
];

// Nearby neighborhoods for local SEO
export const CONTEMPORANEO_NEARBY_AREAS = [
  { name: 'Plaza España', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estació', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];

// Comparison table data (Contemporáneo vs Ballet vs Yoga vs Pilates)
export const CONTEMPORANEO_COMPARISON_DATA = {
  headers: [
    'contemporaneoCompareFeature',
    'contemporaneoCompareContemporaneo',
    'contemporaneoCompareBallet',
    'contemporaneoCompareYoga',
    'contemporaneoComparePilates',
  ],
  rows: [
    { featureKey: 'contemporaneoCompareExpression', values: ['high', 'medium', 'low', 'low'] },
    { featureKey: 'contemporaneoCompareFloorwork', values: ['high', 'low', 'medium', 'medium'] },
    { featureKey: 'contemporaneoCompareMusicality', values: ['high', 'high', 'low', 'low'] },
    { featureKey: 'contemporaneoCompareImprovisation', values: ['high', 'low', 'low', 'none'] },
    { featureKey: 'contemporaneoCompareFlexibility', values: ['high', 'high', 'high', 'medium'] },
    { featureKey: 'contemporaneoCompareStrength', values: ['medium', 'high', 'medium', 'high'] },
  ],
};

// Breadcrumb custom keys for Contemporaneo (4 levels: Home > Classes > Danza > Current)
export const CONTEMPORANEO_BREADCRUMB_KEYS = {
  home: 'contemporaneoBreadcrumbHome',
  classes: 'contemporaneoBreadcrumbClasses',
  dance: 'contemporaneoBreadcrumbUrban',
  current: 'contemporaneoBreadcrumbCurrent',
};

// YouTube video ID for the page (update with real video)
export const CONTEMPORANEO_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID';

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const CONTEMPORANEO_GEO_KEYS = {
  definicion: 'contemporaneoCitableDefinicion', // Definición oficial danza contemporánea
  origin: 'contemporaneoCitableOrigen', // Origen histórico (Graham, Limón, Cunningham)
  tecnicas: 'contemporaneoCitableTecnicas', // Técnicas principales (release, floor work)
  metodologia: 'contemporaneoCitableMetodologia', // Metodología de enseñanza
  statistics: 'contemporaneoStatistics', // Estadísticas generales
  globalEvolution: 'contemporaneoCitableEvolucionGlobal', // Expansión mundial
  expressionBody: 'contemporaneoCitableExpresionCorporal', // Expresión corporal
  improvisation: 'contemporaneoCitableImprovisacion', // Improvisación
  fact1: 'contemporaneoCitableFact1', // Calorías: 300-450/hora
  fact2: 'contemporaneoCitableFact2', // Técnica de suelo y release
  fact3: 'contemporaneoCitableFact3', // Farray's técnica cubana
  legado: 'contemporaneoCitableLegado', // Legado artístico
};

// Hero Stats configuration (for AnimatedCounter)
export const CONTEMPORANEO_HERO_STATS = {
  minutes: '60', // Clases de 60 minutos
  calories: 500, // Calorías quemadas por clase
  techniquePercent: 100, // 100% Técnica de Danza
};
