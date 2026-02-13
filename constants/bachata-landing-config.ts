/**
 * =============================================================================
 * BACHATA SENSUAL LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Landing page de captación para Bachata Sensual.
 * Usa el template genérico GenericDanceLanding con tema Fuchsia (Sensual).
 *
 * RUTA EN App.tsx:
 * import { BACHATA_LANDING_CONFIG } from './constants/bachata-landing-config';
 * <Route path="/:locale/bachata" element={<GenericDanceLanding config={BACHATA_LANDING_CONFIG} />} />
 *
 * NOINDEX: Esta landing NO se indexa (meta robots noindex, nofollow)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const BACHATA_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'bachata-landing',
  slug: 'bachata',
  sourceId: 127833, // TODO: Solicitar nuevo sourceId a Momence
  estiloValue: 'Bachata Sensual',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/Bachata/img/clases-bachata-sensual-barcelona_1024.webp',
    showcase: '/images/classes/Bachata/img/clases-bachata-sensual-barcelona_1024.webp',
    heroAlt: 'Clases de Bachata Sensual en Barcelona - Pareja bailando con conexión',
    showcaseAlt: "Alumnos de Bachata Sensual en Barcelona - Farray's Center",
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
  translationPrefix: 'baLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'baLandingValueItem1', price: 20, priceKey: 'baLandingValuePrice1' },
    { key: 'baLandingValueItem2', price: 0, priceKey: 'baLandingValueIncluded' },
    { key: 'baLandingValueItem3', price: 0, priceKey: 'baLandingValueIncluded' },
    { key: 'baLandingValueItem4', price: 0, priceKey: 'baLandingValueIncluded' },
    { key: 'baLandingValueItem5', price: 0, priceKey: 'baLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'baLandingWhyTitle1', descKey: 'baLandingWhyDesc1' },
    { titleKey: 'baLandingWhyTitle2', descKey: 'baLandingWhyDesc2' },
    { titleKey: 'baLandingWhyTitle3', descKey: 'baLandingWhyDesc3' },
    { titleKey: 'baLandingWhyTitle4', descKey: 'baLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS (Objection handling)
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'baLandingObjQ1', answerKey: 'baLandingObjA1' },
    { id: 'obj-2', questionKey: 'baLandingObjQ2', answerKey: 'baLandingObjA2' },
    { id: 'obj-3', questionKey: 'baLandingObjQ3', answerKey: 'baLandingObjA3' },
    { id: 'obj-4', questionKey: 'baLandingObjQ4', answerKey: 'baLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Laura y Marc', quote: 'baLandingTestimonial1' },
    { id: 2, name: 'Pablo R.', quote: 'baLandingTestimonial2' },
    { id: 3, name: 'Sandra M.', quote: 'baLandingTestimonial3' },
  ],

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================
  bookingWidget: {
    styleFilter: 'bachata',
  },

  // =========================================================================
  // HORARIOS - Bachata Sensual (de bachata.ts)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '22:00 - 23:00',
      levelKey: 'basicLevel',
      className: 'Bachata Sensual',
      teacher: 'Mathias & Eugenia',
    },
    {
      id: '2',
      dayKey: 'tuesday',
      time: '19:00 - 20:00',
      levelKey: 'beginnerLevel',
      className: 'Bachata Sensual',
      teacher: 'Mathias & Eugenia',
    },
    {
      id: '3',
      dayKey: 'tuesday',
      time: '20:00 - 21:00',
      levelKey: 'intermediateLevel',
      className: 'Bachata Sensual',
      teacher: 'Mathias & Eugenia',
    },
    {
      id: '4',
      dayKey: 'tuesday',
      time: '21:30 - 22:30',
      levelKey: 'advancedLevel',
      className: 'Bachata Sensual',
      teacher: 'Mathias & Eugenia',
    },
    {
      id: '5',
      dayKey: 'thursday',
      time: '20:00 - 21:00',
      levelKey: 'beginnerLevel',
      className: 'Bachata Sensual',
      teacher: 'Carlos & Noemí',
    },
    {
      id: '6',
      dayKey: 'friday',
      time: '19:00 - 20:00',
      levelKey: 'intermediateLevel',
      className: 'Bachata Sensual',
      teacher: 'Eugenia & Juanes',
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
