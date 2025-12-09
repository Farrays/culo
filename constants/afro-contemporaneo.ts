import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs configuration for Afro Contemporáneo page (15 FAQs for comprehensive SEO)
export const AFRO_CONTEMPORANEO_FAQS_CONFIG: FAQ[] = [
  { id: 'afro-contemporaneo-1', questionKey: 'afrocontemporaneoFaqQ1', answerKey: 'afrocontemporaneoFaqA1' },
  { id: 'afro-contemporaneo-2', questionKey: 'afrocontemporaneoFaqQ2', answerKey: 'afrocontemporaneoFaqA2' },
  { id: 'afro-contemporaneo-3', questionKey: 'afrocontemporaneoFaqQ3', answerKey: 'afrocontemporaneoFaqA3' },
  { id: 'afro-contemporaneo-4', questionKey: 'afrocontemporaneoFaqQ4', answerKey: 'afrocontemporaneoFaqA4' },
  { id: 'afro-contemporaneo-5', questionKey: 'afrocontemporaneoFaqQ5', answerKey: 'afrocontemporaneoFaqA5' },
  { id: 'afro-contemporaneo-6', questionKey: 'afrocontemporaneoFaqQ6', answerKey: 'afrocontemporaneoFaqA6' },
  { id: 'afro-contemporaneo-7', questionKey: 'afrocontemporaneoFaqQ7', answerKey: 'afrocontemporaneoFaqA7' },
  { id: 'afro-contemporaneo-8', questionKey: 'afrocontemporaneoFaqQ8', answerKey: 'afrocontemporaneoFaqA8' },
  { id: 'afro-contemporaneo-9', questionKey: 'afrocontemporaneoFaqQ9', answerKey: 'afrocontemporaneoFaqA9' },
  { id: 'afro-contemporaneo-10', questionKey: 'afrocontemporaneoFaqQ10', answerKey: 'afrocontemporaneoFaqA10' },
  { id: 'afro-contemporaneo-11', questionKey: 'afrocontemporaneoFaqQ11', answerKey: 'afrocontemporaneoFaqA11' },
  { id: 'afro-contemporaneo-12', questionKey: 'afrocontemporaneoFaqQ12', answerKey: 'afrocontemporaneoFaqA12' },
  { id: 'afro-contemporaneo-13', questionKey: 'afrocontemporaneoFaqQ13', answerKey: 'afrocontemporaneoFaqA13' },
  { id: 'afro-contemporaneo-14', questionKey: 'afrocontemporaneoFaqQ14', answerKey: 'afrocontemporaneoFaqA14' },
  { id: 'afro-contemporaneo-15', questionKey: 'afrocontemporaneoFaqQ15', answerKey: 'afrocontemporaneoFaqA15' },
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
      ca: "Aprendre Afro Contemporani amb Yunaisy ha transformat la meva tècnica. Per fi entenc què significa ballar de veritat des de dins.",
      fr: "Apprendre l'Afro Contemporain avec Yunaisy a transformé ma technique. Enfin je comprends ce que signifie vraiment danser de l'intérieur.",
    },
  },
];

// Course schema configuration (optimized for SEO with keywords)
export const AFRO_CONTEMPORANEO_COURSE_CONFIG = {
  teaches: 'Afro Contemporáneo, técnica cubana ENA, disociación corporal, interpretación musical, folklore afrocubano',
  prerequisites: 'Ninguno - clases para todos los niveles',
  lessons: 'Clases semanales de perfeccionamiento',
  duration: 'PT1H',
};

// Schedule data for Afro Contemporáneo classes
// TODO: Actualizar con horarios reales cuando estén disponibles
export const AFRO_CONTEMPORANEO_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'wednesday',
    className: 'Afro Contemporáneo Iniciación',
    time: '19:00 - 20:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Afro Contemporáneo Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'intermediateLevel',
  },
  {
    id: '3',
    dayKey: 'saturday',
    className: 'Afro Contemporáneo Todos los niveles',
    time: '11:00 - 12:00',
    teacher: 'Yunaisy Farray',
    levelKey: 'allLevels',
  },
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

// ===== GEO OPTIMIZATION: Citable Statistics Keys =====
// Estas keys apuntan a datos citables por IAs (ChatGPT, Perplexity, etc.)
export const AFRO_CONTEMPORANEO_GEO_KEYS = {
  origin: 'afrocontemporaneoCitableOrigen',
  statistics: 'afrocontemporaneoStatistics',
  globalEvolution: 'afrocontemporaneoCitableEvolucionGlobal',
  music: 'afrocontemporaneoCitableMusica',
  identityPower: 'afrocontemporaneoCitableIdentidadPoder',
  fact1: 'afrocontemporaneoCitableFact1',  // Calorías quemadas
  fact2: 'afrocontemporaneoCitableFact2',  // Metodología ENA
  fact3: 'afrocontemporaneoCitableFact3',  // Única academia Barcelona
};

// Hero Stats configuration (for AnimatedCounter)
export const AFRO_CONTEMPORANEO_HERO_STATS = {
  minutes: '60-90',  // Clases de 60 o 90 minutos
  calories: 500,     // Calorías quemadas por clase
  funPercent: 100,
};
