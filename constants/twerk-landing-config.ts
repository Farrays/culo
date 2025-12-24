/**
 * =============================================================================
 * TWERK LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Configuración de la landing page de captación para Twerk.
 * Usa el template genérico GenericDanceLanding con tema Rose.
 *
 * RUTA EN App.tsx:
 * import { TWERK_LANDING_CONFIG } from './constants/twerk-landing-config';
 * <Route path="/:locale/twerk-promo" element={<GenericDanceLanding config={TWERK_LANDING_CONFIG} />} />
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const TWERK_LANDING_CONFIG: LandingConfig = createLandingConfig('rose', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'twerk-landing',
  slug: 'twerk',
  sourceId: 127832, // Pedir nuevo sourceId a Momence si no existe
  estiloValue: 'Twerk',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/twerk/img/clases-twerk-barcelona_960.webp',
    showcase: '/images/classes/twerk/img/clases-twerk-barcelona_960.webp',
    heroAlt: 'Clases de Twerk en Barcelona',
    showcaseAlt: 'Alumnas de Twerk en Barcelona',
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
  translationPrefix: 'twLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'twLandingValueItem1', price: 20, priceKey: 'twLandingValuePrice1' },
    { key: 'twLandingValueItem2', price: 0, priceKey: 'twLandingValueIncluded' },
    { key: 'twLandingValueItem3', price: 0, priceKey: 'twLandingValueIncluded' },
    { key: 'twLandingValueItem4', price: 0, priceKey: 'twLandingValueIncluded' },
    { key: 'twLandingValueItem5', price: 0, priceKey: 'twLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'twLandingWhyTitle1', descKey: 'twLandingWhyDesc1' },
    { titleKey: 'twLandingWhyTitle2', descKey: 'twLandingWhyDesc2' },
    { titleKey: 'twLandingWhyTitle3', descKey: 'twLandingWhyDesc3' },
    { titleKey: 'twLandingWhyTitle4', descKey: 'twLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'twLandingObjQ1', answerKey: 'twLandingObjA1' },
    { id: 'obj-2', questionKey: 'twLandingObjQ2', answerKey: 'twLandingObjA2' },
    { id: 'obj-3', questionKey: 'twLandingObjQ3', answerKey: 'twLandingObjA3' },
    { id: 'obj-4', questionKey: 'twLandingObjQ4', answerKey: 'twLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Sandra M.', quote: 'twLandingTestimonial1' },
    { id: 2, name: 'Patricia R.', quote: 'twLandingTestimonial2' },
    { id: 3, name: 'Elena F.', quote: 'twLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS
  // =========================================================================
  schedule: [
    // Sandra
    {
      id: '1',
      dayKey: 'monday',
      time: '18:00 - 19:00',
      levelKey: 'basicLevel',
      className: 'Twerk',
      teacher: 'Sandra',
    },
    {
      id: '2',
      dayKey: 'tuesday',
      time: '22:00 - 23:00',
      levelKey: 'beginnerLevel',
      className: 'Twerk',
      teacher: 'Sandra',
    },
    {
      id: '3',
      dayKey: 'wednesday',
      time: '22:00 - 23:00',
      levelKey: 'intermediateLevel',
      className: 'Twerk',
      teacher: 'Sandra',
    },
    // Isabel
    {
      id: '4',
      dayKey: 'thursday',
      time: '11:00 - 12:00',
      levelKey: 'beginnerLevel',
      className: 'Twerk',
      teacher: 'Isabel',
    },
    {
      id: '5',
      dayKey: 'friday',
      time: '19:00 - 20:00',
      levelKey: 'beginnerLevel',
      className: 'Twerk',
      teacher: 'Isabel',
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
  // COUNTDOWN
  // =========================================================================
  countdown: {
    baseDate: '2025-01-06T23:59:59',
    intervalDays: 14,
  },
});
