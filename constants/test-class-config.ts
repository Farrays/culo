/**
 * Test Class Page Configuration (EXPERIMENTAL)
 * =============================================
 * Configuración para probar el nuevo template V2
 * Ruta: /test/clase-experimental
 */
import type { FullDanceClassConfig } from '../components/templates/FullDanceClassTemplate';
import {
  TEST_CLASS_FAQS_CONFIG,
  TEST_CLASS_TESTIMONIALS,
  TEST_CLASS_SCHEDULE_KEYS,
  TEST_CLASS_LEVELS,
  TEST_CLASS_NEARBY_AREAS,
} from './test-class';

export const TEST_CLASS_PAGE_CONFIG: FullDanceClassConfig = {
  // === IDENTIFICATION ===
  styleKey: 'testClass',
  stylePath: 'test-experimental',

  // === REQUIRED DATA ===
  faqsConfig: TEST_CLASS_FAQS_CONFIG,
  testimonials: TEST_CLASS_TESTIMONIALS,
  scheduleKeys: TEST_CLASS_SCHEDULE_KEYS,
  teachers: [
    {
      name: 'Profesor Demo',
      specialtyKey: 'testClassTeacher1Specialty',
      bioKey: 'testClassTeacher1Bio',
      image: '/images/teachers/eugenia-trujillo_256.webp', // Usando imagen existente
      tags: ['Demo', 'Test'],
    },
  ],
  breadcrumbConfig: {
    homeKey: 'home',
    classesKey: 'classes',
    categoryKey: 'testClassCategory',
    categoryUrl: '/test',
    currentKey: 'testClassCurrent',
  },

  // === OPTIONAL DATA ===
  levels: TEST_CLASS_LEVELS,
  nearbyAreas: TEST_CLASS_NEARBY_AREAS,

  // === HERO CONFIG (V2 experimental) ===
  hero: {
    minutes: 60,
    calories: 400,
    funPercent: 100,
    gradientColor: 'violet',
    // V2: Nuevas opciones para video y layout split
    // videoUrl: 'https://example.com/video.mp4', // Placeholder
    // heroImage: '/images/test/hero-placeholder.webp',
    // layout: 'split', // 'centered' | 'split'
  },

  // === SECTION TOGGLES ===
  whatIsSection: {
    enabled: true,
    paragraphCount: 4,
    hasQuestionAnswer: true,
    image: {
      src: '/images/teachers/eugenia-trujillo_256.webp', // Placeholder con imagen existente
      alt: 'Clase experimental de baile',
    },
  },

  identificationSection: {
    enabled: true,
    itemCount: 6,
    hasTransition: true,
    hasNeedEnroll: true,
  },

  transformationSection: {
    enabled: true,
    itemCount: 6,
  },

  whyChooseSection: {
    enabled: true,
    itemOrder: [1, 2, 3, 4, 5, 6],
  },

  whyTodaySection: {
    enabled: true,
    paragraphCount: 3,
  },

  videoSection: {
    enabled: false, // Deshabilitado por ahora
    placeholderCount: 1,
  },

  logosSection: {
    enabled: true,
  },

  nearbySection: {
    enabled: true,
  },

  culturalHistory: {
    enabled: false,
  },

  // === SCHEMA ===
  courseConfig: {
    teaches: 'Clase experimental de prueba visual',
    prerequisites: 'Ninguno',
    lessons: 'Clases de prueba',
    duration: 'PT1H',
  },
};
