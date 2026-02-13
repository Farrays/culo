/**
 * =============================================================================
 * SALSA CUBANA LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Configuración de la landing page de captación para Salsa Cubana.
 * Usa el template genérico GenericDanceLanding con tema Brand (colores oficiales).
 *
 * RUTA EN App.tsx:
 * import { SALSA_CUBANA_LANDING_CONFIG } from './constants/salsa-cubana-landing-config';
 * <Route path="/:locale/salsa-cubana" element={<GenericDanceLanding config={SALSA_CUBANA_LANDING_CONFIG} />} />
 *
 * TEMA: Brand (Colores oficiales de Farray's)
 * PROFESORES: Yunaisy Farray, Iroel Bastarreche
 *
 * NOINDEX: Esta landing NO se indexa (meta robots noindex, nofollow)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const SALSA_CUBANA_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'salsa-cubana-landing',
  slug: 'salsa-cubana',
  sourceId: 0, // TODO: Asignar sourceId real de Momence cuando esté disponible
  estiloValue: 'Salsa Cubana',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/salsa-cubana/img/salsa-cubana_1024.webp',
    showcase: '/images/classes/salsa-cubana/img/salsa-cubana_1440.webp',
    heroAlt:
      "Pareja bailando salsa cubana en Barcelona - Aprende casino, rueda y son cubano con profesores auténticos en Farray's Center",
    showcaseAlt:
      "Pareja ejecutando giro de salsa cubana en Barcelona - Clases de casino y rueda con profesores cubanos en Farray's Center",
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
  translationPrefix: 'scLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'scLandingValueItem1', price: 20, priceKey: 'scLandingValuePrice1' },
    { key: 'scLandingValueItem2', price: 0, priceKey: 'scLandingValueIncluded' },
    { key: 'scLandingValueItem3', price: 0, priceKey: 'scLandingValueIncluded' },
    { key: 'scLandingValueItem4', price: 0, priceKey: 'scLandingValueIncluded' },
    { key: 'scLandingValueItem5', price: 0, priceKey: 'scLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'scLandingWhyTitle1', descKey: 'scLandingWhyDesc1' },
    { titleKey: 'scLandingWhyTitle2', descKey: 'scLandingWhyDesc2' },
    { titleKey: 'scLandingWhyTitle3', descKey: 'scLandingWhyDesc3' },
    { titleKey: 'scLandingWhyTitle4', descKey: 'scLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'scLandingObjQ1', answerKey: 'scLandingObjA1' },
    { id: 'obj-2', questionKey: 'scLandingObjQ2', answerKey: 'scLandingObjA2' },
    { id: 'obj-3', questionKey: 'scLandingObjQ3', answerKey: 'scLandingObjA3' },
    { id: 'obj-4', questionKey: 'scLandingObjQ4', answerKey: 'scLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Ana Cid', quote: 'scLandingTestimonial1' },
    { id: 2, name: 'Carlos M.', quote: 'scLandingTestimonial2' },
    { id: 3, name: 'Jordi P.', quote: 'scLandingTestimonial3' },
  ],

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================
  bookingWidget: {
    styleFilter: 'salsa',
  },

  // =========================================================================
  // HORARIOS (basado en salsa-cubana.ts)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '20:00 - 21:00',
      levelKey: 'advancedLevel',
      className: 'Salsa Cubana Avanzado',
      teacher: 'Yunaisy Farray',
    },
    {
      id: '2',
      dayKey: 'monday',
      time: '21:00 - 22:00',
      levelKey: 'basicLevel',
      className: 'Salsa Cubana Básico I',
      teacher: 'Yunaisy Farray',
    },
    {
      id: '3',
      dayKey: 'wednesday',
      time: '19:00 - 20:00',
      levelKey: 'intermediateLevel',
      className: 'Salsa Cubana Intermedio I',
      teacher: 'Iroel Bastarreche',
    },
    {
      id: '4',
      dayKey: 'wednesday',
      time: '20:00 - 21:00',
      levelKey: 'beginnerLevel',
      className: 'Salsa Cubana Principiantes',
      teacher: 'Iroel Bastarreche',
    },
    {
      id: '5',
      dayKey: 'thursday',
      time: '18:00 - 19:00',
      levelKey: 'basicLevel',
      className: 'Salsa Cubana Básico I',
      teacher: 'Iroel Bastarreche',
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
