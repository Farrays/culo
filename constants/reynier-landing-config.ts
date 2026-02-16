/**
 * =============================================================================
 * REYNIER RAMIREZ - BROADWAY JAZZ & COMMERCIAL DANCE LANDING PAGE
 * =============================================================================
 *
 * Landing page de captación para las nuevas clases de Reynier Ramirez Junco.
 * Bailarín profesional cubano con experiencia internacional.
 *
 * CLASES (desde 11 marzo 2026):
 * - Miércoles 18:00: Broadway Jazz Principiantes
 * - Jueves 18:00: Commercial Dance Principiantes
 *
 * RUTA EN App.tsx:
 * <Route path="/:locale/profesor-reynier" element={<ReynierLanding />} />
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const REYNIER_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'reynier-landing',
  slug: 'profesor-reynier',
  sourceId: 0, // TODO: Solicitar nuevo sourceId a Momence
  estiloValue: 'Broadway Jazz / Commercial Dance',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/reynier/img/reynier-hero_960.webp',
    showcase: '/images/classes/reynier/img/reynier-showcase_960.webp',
    heroAlt:
      'Reynier Ramirez - Profesor de Broadway Jazz y Commercial Dance en Barcelona - Bailarín profesional cubano',
    showcaseAlt:
      "Clases de Broadway Jazz y Commercial Dance con Reynier Ramirez en Farray's Center Barcelona",
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
  translationPrefix: 'rrLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'rrLandingValueItem1', price: 20, priceKey: 'rrLandingValuePrice1' },
    { key: 'rrLandingValueItem2', price: 0, priceKey: 'rrLandingValueIncluded' },
    { key: 'rrLandingValueItem3', price: 0, priceKey: 'rrLandingValueIncluded' },
    { key: 'rrLandingValueItem4', price: 0, priceKey: 'rrLandingValueIncluded' },
    { key: 'rrLandingValueItem5', price: 0, priceKey: 'rrLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'rrLandingWhyTitle1', descKey: 'rrLandingWhyDesc1' },
    { titleKey: 'rrLandingWhyTitle2', descKey: 'rrLandingWhyDesc2' },
    { titleKey: 'rrLandingWhyTitle3', descKey: 'rrLandingWhyDesc3' },
    { titleKey: 'rrLandingWhyTitle4', descKey: 'rrLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS (Objection handling)
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'rrLandingObjQ1', answerKey: 'rrLandingObjA1' },
    { id: 'obj-2', questionKey: 'rrLandingObjQ2', answerKey: 'rrLandingObjA2' },
    { id: 'obj-3', questionKey: 'rrLandingObjQ3', answerKey: 'rrLandingObjA3' },
    { id: 'obj-4', questionKey: 'rrLandingObjQ4', answerKey: 'rrLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Carolina P.', quote: 'rrLandingTestimonial1' },
    { id: 2, name: 'David M.', quote: 'rrLandingTestimonial2' },
    { id: 3, name: 'Andrea S.', quote: 'rrLandingTestimonial3' },
  ],

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================
  bookingWidget: {
    styleFilter: 'broadway',
  },

  // =========================================================================
  // HORARIOS - Broadway Jazz & Commercial Dance (desde 11 marzo 2026)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'wednesday',
      time: '18:00 - 19:00',
      levelKey: 'beginnerLevel',
      className: 'Broadway Jazz',
      teacher: 'Reynier Ramirez',
    },
    {
      id: '2',
      dayKey: 'thursday',
      time: '18:00 - 19:00',
      levelKey: 'beginnerLevel',
      className: 'Commercial Dance',
      teacher: 'Reynier Ramirez',
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
    baseDate: '2026-03-11T23:59:59',
    intervalDays: 14,
  },
});
