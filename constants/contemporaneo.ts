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

// Schedule data for Contemporaneo classes
export const CONTEMPORANEO_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Contemporaneo Principiantes',
    time: '19:00 - 20:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Contemporaneo Básico',
    time: '20:00 - 21:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'basicLevel',
  },
  {
    id: '3',
    dayKey: 'thursday',
    className: 'Contemporaneo Intermedio',
    time: '20:00 - 21:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'intermediateLevel',
  },
  {
    id: '4',
    dayKey: 'friday',
    className: 'Contemporaneo Avanzado',
    time: '21:00 - 22:00',
    teacher: 'Alejandro Miñoso',
    levelKey: 'advancedLevel',
  },
];

// Breadcrumb custom keys for Contemporaneo (4 levels: Home > Classes > Danza > Current)
export const CONTEMPORANEO_BREADCRUMB_KEYS = {
  home: 'contemporaneoBreadcrumbHome',
  classes: 'contemporaneoBreadcrumbClasses',
  dance: 'contemporaneoBreadcrumbUrban',
  current: 'contemporaneoBreadcrumbCurrent',
};

// YouTube video ID for the page (update with real video)
export const CONTEMPORANEO_VIDEO_ID = 'YOUR_YOUTUBE_VIDEO_ID';
