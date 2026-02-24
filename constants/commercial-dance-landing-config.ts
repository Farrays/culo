/**
 * =============================================================================
 * COMMERCIAL DANCE LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Landing page de captación para Commercial Dance con Reynier Ramirez Junco.
 * Bailarín profesional cubano con +15 años de experiencia internacional.
 * Giras por Colombia, España, Alemania, Turquía y Suiza.
 * Videoclips con Gente de Zona, Jerry Rivera, Tony Succar, Juan Magan y Belinda.
 *
 * CLASE (desde 12 marzo 2026):
 * - Jueves 18:00: Commercial Dance Principiantes
 *
 * RUTA EN App.tsx:
 * <Route path="/:locale/commercial-dance" element={<CommercialDanceLanding />} />
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const COMMERCIAL_DANCE_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'commercial-dance-landing',
  slug: 'commercial-dance',
  sourceId: 0, // TODO: Solicitar nuevo sourceId a Momence
  estiloValue: 'Commercial Dance',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/reynier/img/reynier-hero_960.webp',
    showcase: '/images/classes/reynier/img/reynier-showcase_960.webp',
    heroAlt:
      'Reynier Ramirez - Clases de Commercial Dance en Barcelona - Bailarín profesional cubano con experiencia en videoclips internacionales',
    showcaseAlt: "Clases de Commercial Dance con Reynier Ramirez en Farray's Center Barcelona",
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
  translationPrefix: 'cdLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'cdLandingValueItem1', price: 20, priceKey: 'cdLandingValuePrice1' },
    { key: 'cdLandingValueItem2', price: 0, priceKey: 'cdLandingValueIncluded' },
    { key: 'cdLandingValueItem3', price: 0, priceKey: 'cdLandingValueIncluded' },
    { key: 'cdLandingValueItem4', price: 0, priceKey: 'cdLandingValueIncluded' },
    { key: 'cdLandingValueItem5', price: 0, priceKey: 'cdLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'cdLandingWhyTitle1', descKey: 'cdLandingWhyDesc1' },
    { titleKey: 'cdLandingWhyTitle2', descKey: 'cdLandingWhyDesc2' },
    { titleKey: 'cdLandingWhyTitle3', descKey: 'cdLandingWhyDesc3' },
    { titleKey: 'cdLandingWhyTitle4', descKey: 'cdLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS (Objection handling)
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'cdLandingObjQ1', answerKey: 'cdLandingObjA1' },
    { id: 'obj-2', questionKey: 'cdLandingObjQ2', answerKey: 'cdLandingObjA2' },
    { id: 'obj-3', questionKey: 'cdLandingObjQ3', answerKey: 'cdLandingObjA3' },
    { id: 'obj-4', questionKey: 'cdLandingObjQ4', answerKey: 'cdLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Laura G.', quote: 'cdLandingTestimonial1' },
    { id: 2, name: 'Miguel R.', quote: 'cdLandingTestimonial2' },
    { id: 3, name: 'Sara P.', quote: 'cdLandingTestimonial3' },
  ],

  // =========================================================================
  // VIDEO (Bunny Stream)
  // =========================================================================
  video: {
    bunnyVideoId: '3caf2cdf-c2c8-4884-a12f-7b7b5e392573',
    bunnyLibraryId: '571535',
    aspectRatio: '9:16',
    autoplay: false,
    thumbnailUrl:
      'https://vz-3d56a778-175.b-cdn.net/3caf2cdf-c2c8-4884-a12f-7b7b5e392573/thumbnail_6ec7a039.jpg',
  },

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================
  bookingWidget: {
    styleFilter: 'commercial',
    targetDate: '2026-03-12',
  },

  // =========================================================================
  // HORARIOS - Commercial Dance (desde 12 marzo 2026)
  // =========================================================================
  schedule: [
    {
      id: '1',
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
    baseDate: '2026-03-12T23:59:59',
    intervalDays: 14,
  },
});
