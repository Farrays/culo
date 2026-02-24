/**
 * =============================================================================
 * BROADWAY JAZZ LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Landing page de captación para Broadway Jazz con Reynier Ramirez Junco.
 * Bailarín profesional cubano con +15 años de experiencia internacional.
 * Giras por Colombia, España, Alemania, Turquía y Suiza.
 * Videoclips con Gente de Zona, Jerry Rivera, Tony Succar, Juan Magan y Belinda.
 *
 * CLASE (desde 11 marzo 2026):
 * - Miércoles 18:00: Broadway Jazz Principiantes
 *
 * RUTA EN App.tsx:
 * <Route path="/:locale/broadway-jazz" element={<BroadwayJazzLanding />} />
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const BROADWAY_JAZZ_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'broadway-jazz-landing',
  slug: 'broadway-jazz',
  sourceId: 0, // TODO: Solicitar nuevo sourceId a Momence
  estiloValue: 'Broadway Jazz',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/reynier/img/reynier-hero_960.webp',
    showcase: '/images/classes/reynier/img/reynier-showcase_960.webp',
    heroAlt:
      'Reynier Ramirez - Clases de Broadway Jazz en Barcelona - Bailarín profesional cubano con experiencia en teatro musical internacional',
    showcaseAlt: "Clases de Broadway Jazz con Reynier Ramirez en Farray's Center Barcelona",
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
  translationPrefix: 'bjLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'bjLandingValueItem1', price: 20, priceKey: 'bjLandingValuePrice1' },
    { key: 'bjLandingValueItem2', price: 0, priceKey: 'bjLandingValueIncluded' },
    { key: 'bjLandingValueItem3', price: 0, priceKey: 'bjLandingValueIncluded' },
    { key: 'bjLandingValueItem4', price: 0, priceKey: 'bjLandingValueIncluded' },
    { key: 'bjLandingValueItem5', price: 0, priceKey: 'bjLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'bjLandingWhyTitle1', descKey: 'bjLandingWhyDesc1' },
    { titleKey: 'bjLandingWhyTitle2', descKey: 'bjLandingWhyDesc2' },
    { titleKey: 'bjLandingWhyTitle3', descKey: 'bjLandingWhyDesc3' },
    { titleKey: 'bjLandingWhyTitle4', descKey: 'bjLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS (Objection handling)
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'bjLandingObjQ1', answerKey: 'bjLandingObjA1' },
    { id: 'obj-2', questionKey: 'bjLandingObjQ2', answerKey: 'bjLandingObjA2' },
    { id: 'obj-3', questionKey: 'bjLandingObjQ3', answerKey: 'bjLandingObjA3' },
    { id: 'obj-4', questionKey: 'bjLandingObjQ4', answerKey: 'bjLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Laura G.', quote: 'bjLandingTestimonial1' },
    { id: 2, name: 'Miguel R.', quote: 'bjLandingTestimonial2' },
    { id: 3, name: 'Sara P.', quote: 'bjLandingTestimonial3' },
  ],

  // =========================================================================
  // VIDEO (Bunny Stream)
  // =========================================================================
  video: {
    bunnyVideoId: 'b4bfe05b-4058-4efa-80c9-9b0512423863',
    bunnyLibraryId: '571535',
    aspectRatio: '9:16',
    autoplay: false,
    thumbnailUrl:
      'https://vz-3d56a778-175.b-cdn.net/b4bfe05b-4058-4efa-80c9-9b0512423863/thumbnail_51f2310f.jpg',
  },

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================
  bookingWidget: {
    styleFilter: 'broadwayjazz',
  },

  // =========================================================================
  // HORARIOS - Broadway Jazz (desde 11 marzo 2026)
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
