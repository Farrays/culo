/**
 * =============================================================================
 * BACHATA VENTA DIRECTA - LANDING PAGE (Hormozi/Brunson Style)
 * =============================================================================
 *
 * Landing de TEST para venta directa de curso de Bachata.
 * Modelo: Vender curso directamente (no captación de lead)
 *
 * RUTA: /:locale/bachata-curso
 */

import { createDirectSaleConfig, type DirectSaleLandingConfig } from './direct-sale-landing-config';

export const BACHATA_VENTA_DIRECTA_CONFIG: DirectSaleLandingConfig = createDirectSaleConfig(
  'emerald',
  {
    // =========================================================================
    // IDENTIFICADORES
    // =========================================================================
    id: 'bachata-venta-directa',
    slug: 'bachata-curso',
    estiloValue: 'Bachata Sensual',

    // =========================================================================
    // IMÁGENES
    // =========================================================================
    images: {
      hero: '/images/classes/Bachata/img/clases-bachata-sensual-barcelona_1024.webp',
      showcase: '/images/classes/Bachata/img/clases-bachata-sensual-barcelona_1024.webp',
      heroAlt: 'Clases de Bachata Sensual en Barcelona - Pareja bailando con conexión',
      showcaseAlt: "Alumnos de Bachata Sensual en Farray's Center Barcelona",
    },

    // =========================================================================
    // TRADUCCIÓN
    // =========================================================================
    translationPrefix: 'bvLanding',

    // =========================================================================
    // HERO
    // =========================================================================
    hero: {
      duration: '8',
      bullets: ['bvLandingHeroBullet1', 'bvLandingHeroBullet2', 'bvLandingHeroBullet3'],
    },

    // =========================================================================
    // PROBLEMAS (Agitar el dolor)
    // =========================================================================
    problems: [
      { key: 'bvLandingProblem1', emoji: '😰' },
      { key: 'bvLandingProblem2', emoji: '😰' },
      { key: 'bvLandingProblem3', emoji: '😰' },
      { key: 'bvLandingProblem4', emoji: '😰' },
    ],

    // =========================================================================
    // MÉTODO (La solución)
    // =========================================================================
    method: {
      nameKey: 'bvLandingMethodName',
      steps: [
        { step: '1-2', titleKey: 'bvLandingStep1Title', descKey: 'bvLandingStep1Desc' },
        { step: '3-4', titleKey: 'bvLandingStep2Title', descKey: 'bvLandingStep2Desc' },
        { step: '5-6', titleKey: 'bvLandingStep3Title', descKey: 'bvLandingStep3Desc' },
        { step: '7-8', titleKey: 'bvLandingStep4Title', descKey: 'bvLandingStep4Desc' },
      ],
    },

    // =========================================================================
    // VALUE STACK
    // =========================================================================
    valueStack: [
      { key: 'bvLandingValue1', value: 160, included: true },
      { key: 'bvLandingValue2', value: 50, included: true },
      { key: 'bvLandingValue3', value: 40, included: true },
      { key: 'bvLandingValue4', value: 20, included: true },
      { key: 'bvLandingValue5', value: 15, included: true },
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
      refundStats: 'bvLandingGuaranteeStats',
    },

    // =========================================================================
    // TESTIMONIOS
    // =========================================================================
    testimonials: [
      {
        id: 1,
        name: 'Carlos M.',
        age: 47,
        profession: 'bvLandingTestimonialProf1',
        quoteKey: 'bvLandingTestimonial1',
        resultKey: 'bvLandingTestimonialResult1',
      },
      {
        id: 2,
        name: 'Laura S.',
        age: 32,
        profession: 'bvLandingTestimonialProf2',
        quoteKey: 'bvLandingTestimonial2',
        resultKey: 'bvLandingTestimonialResult2',
      },
      {
        id: 3,
        name: 'Marc & Anna',
        profession: 'bvLandingTestimonialProf3',
        quoteKey: 'bvLandingTestimonial3',
        resultKey: 'bvLandingTestimonialResult3',
      },
    ],

    // =========================================================================
    // FAQS
    // =========================================================================
    faqs: [
      { id: 'faq-1', questionKey: 'bvLandingFaq1Q', answerKey: 'bvLandingFaq1A' },
      { id: 'faq-2', questionKey: 'bvLandingFaq2Q', answerKey: 'bvLandingFaq2A' },
      { id: 'faq-3', questionKey: 'bvLandingFaq3Q', answerKey: 'bvLandingFaq3A' },
      { id: 'faq-4', questionKey: 'bvLandingFaq4Q', answerKey: 'bvLandingFaq4A' },
      { id: 'faq-5', questionKey: 'bvLandingFaq5Q', answerKey: 'bvLandingFaq5A' },
    ],

    // =========================================================================
    // HORARIOS
    // =========================================================================
    schedule: [
      {
        id: '1',
        dayKey: 'tuesday',
        time: '19:00 - 20:00',
        levelKey: 'beginnerLevel',
        className: 'Bachata Sensual',
        teacher: 'Mathias & Eugenia',
        spotsLeft: 4,
        momenceUrl: 'https://momence.com/Farrays-Center/class/bachata-iniciacion',
      },
      {
        id: '2',
        dayKey: 'thursday',
        time: '20:00 - 21:00',
        levelKey: 'beginnerLevel',
        className: 'Bachata Sensual',
        teacher: 'Carlos & Noemí',
        spotsLeft: 2,
        momenceUrl: 'https://momence.com/Farrays-Center/class/bachata-iniciacion',
      },
    ],

    // =========================================================================
    // URGENCIA
    // =========================================================================
    urgency: {
      deadline: '2025-02-15T23:59:59',
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
    // CONTACTO
    // =========================================================================
    contact: {
      whatsapp: '+34 644 066 456',
      address: "Farray's Center, Barcelona",
      responseTimeKey: 'bvLandingContactResponse',
    },
  }
);
