/**
 * Test Class Data Configuration (EXPERIMENTAL)
 * =============================================
 * Datos ficticios para probar el nuevo template V2
 * Ruta: /test/clase-experimental
 */
import type { Testimonial } from '../types';
import type { FAQ } from '../components/templates/ClassPageTemplate';

// FAQs de prueba
export const TEST_CLASS_FAQS_CONFIG: FAQ[] = [
  {
    id: 'test-1',
    questionKey: 'testClassFaqQ1',
    answerKey: 'testClassFaqA1',
  },
  {
    id: 'test-2',
    questionKey: 'testClassFaqQ2',
    answerKey: 'testClassFaqA2',
  },
  {
    id: 'test-3',
    questionKey: 'testClassFaqQ3',
    answerKey: 'testClassFaqA3',
  },
];

// Testimonios de prueba
export const TEST_CLASS_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'María García',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'Amazing experience! The new visual design is stunning and makes learning so much more engaging.',
      es: 'Experiencia increíble! El nuevo diseño visual es impresionante y hace que aprender sea mucho más atractivo.',
      ca: 'Experiència increïble! El nou disseny visual és impressionant i fa que aprendre sigui molt més atractiu.',
      fr: "Expérience incroyable! Le nouveau design visuel est impressionnant et rend l'apprentissage beaucoup plus attrayant.",
    },
  },
  {
    id: 2,
    name: 'Carlos López',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The split layout hero is perfect! You see immediately what the class is about.',
      es: 'El hero con diseño dividido es perfecto! Ves inmediatamente de qué trata la clase.',
      ca: 'El hero amb disseny dividit és perfecte! Veus immediatament de què tracta la classe.',
      fr: 'Le hero avec design divisé est parfait! Vous voyez immédiatement de quoi parle le cours.',
    },
  },
];

// Horarios de prueba
export const TEST_CLASS_SCHEDULE_KEYS = [
  {
    id: '1',
    dayKey: 'monday',
    className: 'Clase Test Nivel 1',
    time: '19:00 - 20:00',
    teacher: 'Profesor Demo',
    levelKey: 'beginnerLevel',
  },
  {
    id: '2',
    dayKey: 'wednesday',
    className: 'Clase Test Nivel 2',
    time: '20:00 - 21:00',
    teacher: 'Profesor Demo',
    levelKey: 'intermediateLevel',
  },
];

// Niveles de prueba
export const TEST_CLASS_LEVELS = [
  {
    id: 'principiantes',
    levelKey: 'beginnerLevel',
    titleKey: 'testClassLevelBeginnerTitle',
    descKey: 'testClassLevelBeginnerDesc',
    duration: '0-3 meses',
    color: 'primary-dark' as const,
  },
  {
    id: 'intermedio',
    levelKey: 'intermediateLevel',
    titleKey: 'testClassLevelIntermediateTitle',
    descKey: 'testClassLevelIntermediateDesc',
    duration: '3-6 meses',
    color: 'primary-accent' as const,
  },
];

// Zonas cercanas
export const TEST_CLASS_NEARBY_AREAS = [
  { name: 'Plaza España', time: '5 min andando' },
  { name: 'Hostafrancs', time: '5 min andando' },
  { name: 'Sants Estació', time: '10 min andando' },
];
