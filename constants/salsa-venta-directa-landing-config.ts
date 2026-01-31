/**
 * =============================================================================
 * SALSA VENTA DIRECTA - LANDING PAGE (Hormozi/Brunson Style)
 * =============================================================================
 *
 * Landing de venta directa para curso de Salsa.
 * Modelo: Vender curso directamente (no captación de lead)
 * Colores: Brand (colores corporativos Farray's)
 *
 * RUTA: /:locale/salsa-curso
 */

import { createDirectSaleConfig, type DirectSaleLandingConfig } from './direct-sale-landing-config';

export const SALSA_VENTA_DIRECTA_CONFIG: DirectSaleLandingConfig = createDirectSaleConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'salsa-venta-directa',
  slug: 'salsa-curso',
  estiloValue: 'Salsa',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/salsa-cubana/img/salsa-cubana_1920.webp',
    showcase: '/images/classes/salsa-cubana/img/salsa-cubana_1024.webp',
    heroAlt: 'Clases de Salsa Cubana en Barcelona - Pareja bailando con energía y alegría',
    showcaseAlt: "Alumnos de Salsa Cubana disfrutando en Farray's Center Barcelona",
  },

  // =========================================================================
  // TRADUCCIÓN
  // =========================================================================
  translationPrefix: 'svLanding',

  // =========================================================================
  // HERO
  // =========================================================================
  hero: {
    duration: '8',
    bullets: ['svLandingHeroBullet1', 'svLandingHeroBullet2', 'svLandingHeroBullet3'],
  },

  // =========================================================================
  // PROBLEMAS (Agitar el dolor)
  // =========================================================================
  problems: [
    { key: 'svLandingProblem1', emoji: '😰' },
    { key: 'svLandingProblem2', emoji: '😰' },
    { key: 'svLandingProblem3', emoji: '😰' },
    { key: 'svLandingProblem4', emoji: '😰' },
  ],

  // =========================================================================
  // MÉTODO (La solución)
  // =========================================================================
  method: {
    nameKey: 'svLandingMethodName',
    steps: [
      { step: '1', titleKey: 'svLandingStep1Title', descKey: 'svLandingStep1Desc' },
      { step: '2', titleKey: 'svLandingStep2Title', descKey: 'svLandingStep2Desc' },
      { step: '3', titleKey: 'svLandingStep3Title', descKey: 'svLandingStep3Desc' },
      { step: '4', titleKey: 'svLandingStep4Title', descKey: 'svLandingStep4Desc' },
    ],
  },

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'svLandingValue1', value: 160, included: true },
    { key: 'svLandingValue2', value: 50, included: true },
    { key: 'svLandingValue3', value: 40, included: true },
    { key: 'svLandingValue4', value: 20, included: true },
    { key: 'svLandingValue5', value: 15, included: true },
  ],

  // =========================================================================
  // PRECIOS
  // =========================================================================
  pricing: {
    normalPrice: 50,
    firstMonthPrice: 37.5,
    enrollmentFee: 60,
    enrollmentFree: true,
    totalSavings: 72.5,
  },

  // =========================================================================
  // GARANTÍA
  // =========================================================================
  guarantee: {
    type: 'first-class',
    refundStats: 'svLandingGuaranteeStats',
  },

  // =========================================================================
  // TESTIMONIOS (con placeholders para videos)
  // =========================================================================
  testimonials: [
    {
      id: 1,
      name: 'Roberto G.',
      age: 52,
      profession: 'svLandingTestimonialProf1',
      quoteKey: 'svLandingTestimonial1',
      resultKey: 'svLandingTestimonialResult1',
      // VIDEO PLACEHOLDER: Añadir campo videoUrl cuando tengáis el video
      // videoUrl: 'https://...',
    },
    {
      id: 2,
      name: 'Marina L.',
      age: 28,
      profession: 'svLandingTestimonialProf2',
      quoteKey: 'svLandingTestimonial2',
      resultKey: 'svLandingTestimonialResult2',
      // VIDEO PLACEHOLDER
    },
    {
      id: 3,
      name: 'David & Cristina',
      profession: 'svLandingTestimonialProf3',
      quoteKey: 'svLandingTestimonial3',
      resultKey: 'svLandingTestimonialResult3',
      // VIDEO PLACEHOLDER
    },
  ],

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: [
    { id: 'faq-1', questionKey: 'svLandingFaq1Q', answerKey: 'svLandingFaq1A' },
    { id: 'faq-2', questionKey: 'svLandingFaq2Q', answerKey: 'svLandingFaq2A' },
    { id: 'faq-3', questionKey: 'svLandingFaq3Q', answerKey: 'svLandingFaq3A' },
    { id: 'faq-4', questionKey: 'svLandingFaq4Q', answerKey: 'svLandingFaq4A' },
    { id: 'faq-5', questionKey: 'svLandingFaq5Q', answerKey: 'svLandingFaq5A' },
  ],

  // =========================================================================
  // HORARIOS
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '20:00 - 21:00',
      levelKey: 'beginnerLevel',
      className: 'Salsa Cubana',
      teacher: 'Yunaisy Farray',
      spotsLeft: 5,
      momenceUrl: 'https://momence.com/Farrays-Center/class/salsa-iniciacion',
    },
    {
      id: '2',
      dayKey: 'wednesday',
      time: '19:00 - 20:00',
      levelKey: 'beginnerLevel',
      className: 'Salsa Cubana',
      teacher: 'Yunaisy Farray',
      spotsLeft: 3,
      momenceUrl: 'https://momence.com/Farrays-Center/class/salsa-iniciacion',
    },
    {
      id: '3',
      dayKey: 'friday',
      time: '20:00 - 21:00',
      levelKey: 'intermediateLevel',
      className: 'Salsa Cubana',
      teacher: 'Yunaisy Farray',
      spotsLeft: 6,
      momenceUrl: 'https://momence.com/Farrays-Center/class/salsa-intermedio',
    },
  ],

  // =========================================================================
  // URGENCIA
  // =========================================================================
  urgency: {
    deadline: '2025-02-28T23:59:59',
    showSpotsLeft: true,
    maxStudentsPerGroup: 16,
  },

  // =========================================================================
  // ESTADÍSTICAS
  // =========================================================================
  stats: {
    years: 12,
    totalStudents: 15000,
    satisfactionRate: 98,
  },

  // =========================================================================
  // LOGOS
  // =========================================================================
  logos: [
    { src: '/images/cid-unesco-logo.webp', alt: 'CID UNESCO', label: 'CID UNESCO' },
    { src: '/images/Street-Dance-2.webp', alt: 'Street Dance 2', label: 'Street Dance 2' },
    {
      src: '/images/the-dancer-espectaculo-baile-cuadrada.webp',
      alt: 'The Dancer',
      label: 'The Dancer',
    },
    { src: '/images/telecinco-logo.webp', alt: 'Telecinco', label: 'Telecinco' },
  ],

  // =========================================================================
  // VIDEO HERO (Placeholder - descomentar cuando tengáis video)
  // =========================================================================
  // video: {
  //   bunnyVideoId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  //   bunnyLibraryId: '123456',
  //   aspectRatio: '16:9',
  //   autoplay: false,
  //   thumbnailUrl: 'https://...',
  // },

  // =========================================================================
  // CONTACTO
  // =========================================================================
  contact: {
    whatsapp: '+34 644 066 456',
    address: "Farray's Center - C/ Entença 100, Barcelona",
    responseTimeKey: 'svLandingContactResponse',
  },
});
