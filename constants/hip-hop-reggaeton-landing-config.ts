/**
 * =============================================================================
 * HIP HOP REGGAETON LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Configuración de la landing page de captación para Hip Hop Reggaeton.
 * Usa el template genérico GenericDanceLanding con tema Amber.
 *
 * RUTA EN App.tsx:
 * import { HIP_HOP_REGGAETON_LANDING_CONFIG } from './constants/hip-hop-reggaeton-landing-config';
 * <Route path="/:locale/hip-hop-reggaeton" element={<GenericDanceLanding config={HIP_HOP_REGGAETON_LANDING_CONFIG} />} />
 *
 * TEMA: Amber (Hip-Hop, Afrobeats, Reggaeton)
 * PROFESOR: Charlie Breezy
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const HIP_HOP_REGGAETON_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'hip-hop-reggaeton-landing',
  slug: 'hip-hop-reggaeton',
  sourceId: 129131, // Momence modal ID
  estiloValue: 'Hip Hop Reggaeton',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_960.webp',
    showcase: '/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_960.webp',
    heroAlt: 'Clases de Hip Hop Reggaeton en Barcelona',
    showcaseAlt: 'Alumnos de Hip Hop Reggaeton en Barcelona bailando con Charlie Breezy',
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
  translationPrefix: 'hhrLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'hhrLandingValueItem1', price: 20, priceKey: 'hhrLandingValuePrice1' },
    { key: 'hhrLandingValueItem2', price: 0, priceKey: 'hhrLandingValueIncluded' },
    { key: 'hhrLandingValueItem3', price: 0, priceKey: 'hhrLandingValueIncluded' },
    { key: 'hhrLandingValueItem4', price: 0, priceKey: 'hhrLandingValueIncluded' },
    { key: 'hhrLandingValueItem5', price: 0, priceKey: 'hhrLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'hhrLandingWhyTitle1', descKey: 'hhrLandingWhyDesc1' },
    { titleKey: 'hhrLandingWhyTitle2', descKey: 'hhrLandingWhyDesc2' },
    { titleKey: 'hhrLandingWhyTitle3', descKey: 'hhrLandingWhyDesc3' },
    { titleKey: 'hhrLandingWhyTitle4', descKey: 'hhrLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'hhrLandingObjQ1', answerKey: 'hhrLandingObjA1' },
    { id: 'obj-2', questionKey: 'hhrLandingObjQ2', answerKey: 'hhrLandingObjA2' },
    { id: 'obj-3', questionKey: 'hhrLandingObjQ3', answerKey: 'hhrLandingObjA3' },
    { id: 'obj-4', questionKey: 'hhrLandingObjQ4', answerKey: 'hhrLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'David R.', quote: 'hhrLandingTestimonial1' },
    { id: 2, name: 'Andrea M.', quote: 'hhrLandingTestimonial2' },
    { id: 3, name: 'Carlos P.', quote: 'hhrLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS (basado en hip-hop-reggaeton.ts)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '22:00 - 23:00',
      levelKey: 'basicLevel',
      className: 'Hip Hop Reggaeton',
      teacher: 'Charlie Breezy',
    },
    {
      id: '2',
      dayKey: 'tuesday',
      time: '18:00 - 19:00',
      levelKey: 'beginnerLevel',
      className: 'Hip Hop Reggaeton',
      teacher: 'Charlie Breezy',
    },
    {
      id: '3',
      dayKey: 'wednesday',
      time: '19:00 - 20:00',
      levelKey: 'intermediateAdvancedLevel',
      className: 'Hip Hop Reggaeton',
      teacher: 'Charlie Breezy',
    },
    {
      id: '4',
      dayKey: 'thursday',
      time: '10:00 - 11:00',
      levelKey: 'beginnerLevel',
      className: 'Hip Hop Reggaeton',
      teacher: 'Charlie Breezy',
    },
    {
      id: '5',
      dayKey: 'friday',
      time: '19:00 - 20:00',
      levelKey: 'beginnerLevel',
      className: 'Hip Hop Reggaeton',
      teacher: 'Charlie Breezy',
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

  // =========================================================================
  // VIDEO (Bunny.net) - Enterprise Mode
  // =========================================================================
  video: {
    bunnyVideoId: '49199a2f-c69d-4be0-935e-66bf22cfe077',
    bunnyLibraryId: '571535',
    aspectRatio: '9:16',
    autoplay: false, // Facade pattern: muestra thumbnail, mejora LCP y rendimiento
    thumbnailUrl:
      'https://vz-3d56a778-175.b-cdn.net/49199a2f-c69d-4be0-935e-66bf22cfe077/thumbnail.jpg',
  },

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================
  bookingWidget: {
    styleFilter: 'hiphopreggaeton', // Filtra solo clases de Hip Hop Reggaeton en el widget
  },
});
