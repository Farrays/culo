import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Afro Contemporáneo page (15 FAQs for comprehensive SEO)
export const AFRO_CONTEMPORANEO_FAQS_CONFIG: FAQ[] = [
  {
    id: 'afro-contemporaneo-1',
    questionKey: 'afrocontemporaneoFaqQ1',
    answerKey: 'afrocontemporaneoFaqA1',
  },
  {
    id: 'afro-contemporaneo-2',
    questionKey: 'afrocontemporaneoFaqQ2',
    answerKey: 'afrocontemporaneoFaqA2',
  },
  {
    id: 'afro-contemporaneo-3',
    questionKey: 'afrocontemporaneoFaqQ3',
    answerKey: 'afrocontemporaneoFaqA3',
  },
  {
    id: 'afro-contemporaneo-4',
    questionKey: 'afrocontemporaneoFaqQ4',
    answerKey: 'afrocontemporaneoFaqA4',
  },
  {
    id: 'afro-contemporaneo-5',
    questionKey: 'afrocontemporaneoFaqQ5',
    answerKey: 'afrocontemporaneoFaqA5',
  },
  {
    id: 'afro-contemporaneo-6',
    questionKey: 'afrocontemporaneoFaqQ6',
    answerKey: 'afrocontemporaneoFaqA6',
  },
  {
    id: 'afro-contemporaneo-7',
    questionKey: 'afrocontemporaneoFaqQ7',
    answerKey: 'afrocontemporaneoFaqA7',
  },
  {
    id: 'afro-contemporaneo-8',
    questionKey: 'afrocontemporaneoFaqQ8',
    answerKey: 'afrocontemporaneoFaqA8',
  },
  {
    id: 'afro-contemporaneo-9',
    questionKey: 'afrocontemporaneoFaqQ9',
    answerKey: 'afrocontemporaneoFaqA9',
  },
  {
    id: 'afro-contemporaneo-10',
    questionKey: 'afrocontemporaneoFaqQ10',
    answerKey: 'afrocontemporaneoFaqA10',
  },
  {
    id: 'afro-contemporaneo-11',
    questionKey: 'afrocontemporaneoFaqQ11',
    answerKey: 'afrocontemporaneoFaqA11',
  },
  {
    id: 'afro-contemporaneo-12',
    questionKey: 'afrocontemporaneoFaqQ12',
    answerKey: 'afrocontemporaneoFaqA12',
  },
  {
    id: 'afro-contemporaneo-13',
    questionKey: 'afrocontemporaneoFaqQ13',
    answerKey: 'afrocontemporaneoFaqA13',
  },
  {
    id: 'afro-contemporaneo-14',
    questionKey: 'afrocontemporaneoFaqQ14',
    answerKey: 'afrocontemporaneoFaqA14',
  },
  {
    id: 'afro-contemporaneo-15',
    questionKey: 'afrocontemporaneoFaqQ15',
    answerKey: 'afrocontemporaneoFaqA15',
  },
];

// Testimonials for Afro Contemporáneo page (extends Google reviews with specific testimonial)
export const AFRO_CONTEMPORANEO_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'María T.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Learning Afro Contemporary with Yunaisy has transformed my technique. Finally I understand what it means to really dance from the inside.',
      es: 'Aprender Afro Contemporáneo con Yunaisy ha transformado mi técnica. Por fin entiendo lo que significa bailar de verdad desde dentro.',
      ca: 'Aprendre Afro Contemporani amb Yunaisy ha transformat la meva tècnica. Per fi entenc què significa ballar de veritat des de dins.',
      fr: "Apprendre l'Afro Contemporain avec Yunaisy a transformé ma technique. Enfin je comprends ce que signifie vraiment danser de l'intérieur.",
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const AFRO_CONTEMPORANEO_COURSE_CONFIG = {
  teaches:
    'Afro Contemporáneo, técnica cubana ENA, disociación corporal, interpretación musical, folklore afrocubano',
  prerequisites: 'Ninguno - clases para todos los niveles',
  lessons: 'Clases semanales de perfeccionamiento',
  duration: 'PT1H',
};

// Schedule data for Afro Contemporáneo classes
export const AFRO_CONTEMPORANEO_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Afro Contemporáneo Básico',
    time: '21:00 - 22:00',
    teacher: 'Charlie Breezy',
    levelKey: 'basicLevel',
  },
  {
    id: '2',
    dayKey: 'tuesday',
    className: 'Afro Contemporáneo Intermedio/Avanzado',
    time: '19:00 - 20:30',
    teacher: 'Yunaisy Farray',
    levelKey: 'intermediateAdvancedLevel',
  },
];

// Level descriptions for cards after schedule
export const AFRO_CONTEMPORANEO_LEVELS = [
  {
    id: 'basico',
    levelKey: 'basicLevel',
    titleKey: 'afrocontemporaneoLevelBasicTitle',
    descKey: 'afrocontemporaneoLevelBasicDesc',
    teacher: 'Charlie Breezy',
    schedule: 'Lunes 21:00 - 22:00',
    color: 'blue',
  },
  {
    id: 'intermedio-avanzado',
    levelKey: 'intermediateAdvancedLevel',
    titleKey: 'afrocontemporaneoLevelIntAdvTitle',
    descKey: 'afrocontemporaneoLevelIntAdvDesc',
    teacher: 'Yunaisy Farray',
    schedule: 'Martes 19:00 - 20:30',
    color: 'orange',
  },
];

// Nearby neighborhoods for local SEO
export const AFRO_CONTEMPORANEO_NEARBY_AREAS = [
  { name: 'Plaza Espana', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estacio', time: '10 min andando' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];

// Breadcrumb custom keys for Afro Contemporáneo (4 levels: Home > Classes > Técnica > Current)
export const AFRO_CONTEMPORANEO_BREADCRUMB_KEYS = {
  home: 'afrocontemporaneoBreadcrumbHome',
  classes: 'afrocontemporaneoBreadcrumbClasses',
  urban: 'afrocontemporaneoBreadcrumbUrban',
  current: 'afrocontemporaneoBreadcrumbCurrent',
};

// YouTube video ID for the page
// Video de ejemplo de clases de Afro Contemporánea en Farray's
export const AFRO_CONTEMPORANEO_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID'; // TODO: Añadir ID real del video

// ===== GEO OPTIMIZATION: Citable Statistics Keys (DCC) =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const AFRO_CONTEMPORANEO_GEO_KEYS = {
  definicion: 'afrocontemporaneoCitableDefinicion', // Definición oficial DCC
  origin: 'afrocontemporaneoCitableOrigen', // Origen histórico ENA 1962
  fusion: 'afrocontemporaneoCitableFusion', // Fusión Graham/Limón + yoruba
  metodologia: 'afrocontemporaneoCitableMetodologia', // Metodología Yunaisy ENA
  statistics: 'afrocontemporaneoStatistics', // Estadísticas DCC
  globalEvolution: 'afrocontemporaneoCitableEvolucionGlobal', // Expansión mundial
  music: 'afrocontemporaneoCitableMusica', // Música afrocubana
  identityPower: 'afrocontemporaneoCitableIdentidadPoder', // Identidad/poder
  fact1: 'afrocontemporaneoCitableFact1', // Calorías: 300-480/hora
  fact2: 'afrocontemporaneoCitableFact2', // Metodología ENA reconocida
  fact3: 'afrocontemporaneoCitableFact3', // Farray's DCC CID-UNESCO
  legado: 'afrocontemporaneoCitableLegado', // Legado DCC 65 años
};

// Hero Stats configuration (for AnimatedCounter)
export const AFRO_CONTEMPORANEO_HERO_STATS = {
  minutes: '60-90', // Clases de 60 o 90 minutos
  calories: 500, // Calorías quemadas por clase
  funPercent: 100,
};
