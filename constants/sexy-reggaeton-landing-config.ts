/**
 * =============================================================================
 * SEXY REGGAETON LANDING PAGE CONFIGURATION - ENTERPRISE
 * =============================================================================
 *
 * Landing page de captación para Sexy Reggaeton.
 * Usa el template genérico GenericDanceLanding con tema Rose.
 * Optimizada para conversión con enfoque en sensualidad, confianza y expresión corporal.
 *
 * RUTA EN App.tsx:
 * import { SEXY_REGGAETON_LANDING_CONFIG } from './constants/sexy-reggaeton-landing-config';
 * <Route path="/:locale/sexy-reggaeton" element={<GenericDanceLanding config={SEXY_REGGAETON_LANDING_CONFIG} />} />
 *
 * TEMA: Rose (sensual, empoderador, femenino)
 * TARGET: Mujeres 18-45 que buscan expresión corporal sensual y confianza
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const SEXY_REGGAETON_LANDING_CONFIG: LandingConfig = createLandingConfig('rose', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'sexy-reggaeton-landing',
  slug: 'sexy-reggaeton',
  sourceId: 127834, // Source ID para Momence tracking
  estiloValue: 'Sexy Reggaeton',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.webp',
    showcase: '/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.webp',
    heroAlt: "Clases de Sexy Reggaeton en Barcelona - Farray's Center",
    showcaseAlt: 'Alumnas bailando Sexy Reggaeton en Barcelona',
  },

  // =========================================================================
  // LOGOS (As seen in...)
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
  // CLAVES DE TRADUCCIÓN
  // =========================================================================
  translationPrefix: 'sxrLanding',

  // =========================================================================
  // VALUE STACK - Lo que incluye la clase gratuita
  // =========================================================================
  valueStack: [
    { key: 'sxrLandingValueItem1', price: 20, priceKey: 'sxrLandingValuePrice1' },
    { key: 'sxrLandingValueItem2', price: 0, priceKey: 'sxrLandingValueIncluded' },
    { key: 'sxrLandingValueItem3', price: 0, priceKey: 'sxrLandingValueIncluded' },
    { key: 'sxrLandingValueItem4', price: 0, priceKey: 'sxrLandingValueIncluded' },
    { key: 'sxrLandingValueItem5', price: 0, priceKey: 'sxrLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US - Por qué elegir Farray's para Sexy Reggaeton
  // =========================================================================
  whyUs: [
    { titleKey: 'sxrLandingWhyTitle1', descKey: 'sxrLandingWhyDesc1' },
    { titleKey: 'sxrLandingWhyTitle2', descKey: 'sxrLandingWhyDesc2' },
    { titleKey: 'sxrLandingWhyTitle3', descKey: 'sxrLandingWhyDesc3' },
    { titleKey: 'sxrLandingWhyTitle4', descKey: 'sxrLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS - Objeciones más comunes
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'sxrLandingObjQ1', answerKey: 'sxrLandingObjA1' },
    { id: 'obj-2', questionKey: 'sxrLandingObjQ2', answerKey: 'sxrLandingObjA2' },
    { id: 'obj-3', questionKey: 'sxrLandingObjQ3', answerKey: 'sxrLandingObjA3' },
    { id: 'obj-4', questionKey: 'sxrLandingObjQ4', answerKey: 'sxrLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Laura S.', quote: 'sxrLandingTestimonial1' },
    { id: 2, name: 'Carmen R.', quote: 'sxrLandingTestimonial2' },
    { id: 3, name: 'Ana M.', quote: 'sxrLandingTestimonial3' },
  ],

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================
  bookingWidget: {
    styleFilter: 'sexyreggaeton',
  },

  // =========================================================================
  // HORARIOS - Clases de Sexy Reggaeton disponibles
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '11:00 - 12:00',
      levelKey: 'beginnerLevel',
      className: 'Sexy Reggaeton',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '2',
      dayKey: 'monday',
      time: '18:00 - 19:00',
      levelKey: 'beginnerLevel',
      className: 'Sexy Reggaeton',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '3',
      dayKey: 'monday',
      time: '21:00 - 22:00',
      levelKey: 'basicLevel',
      className: 'Sexy Reggaeton',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '5',
      dayKey: 'thursday',
      time: '10:00 - 11:00',
      levelKey: 'beginnerLevel',
      className: 'Sexy Reggaeton',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '6',
      dayKey: 'thursday',
      time: '19:00 - 20:00',
      levelKey: 'intermediateLevel',
      className: 'Sexy Reggaeton',
      teacher: 'Yasmina Fernández',
    },
  ],

  // =========================================================================
  // ESTADÍSTICAS
  // =========================================================================
  stats: {
    years: 8,
    activeStudents: 1500,
    satisfiedStudents: 15000,
  },

  // =========================================================================
  // COUNTDOWN - Oferta con urgencia
  // =========================================================================
  countdown: {
    baseDate: '2025-01-06T23:59:59',
    intervalDays: 14, // Resetea cada 2 semanas
  },
});
