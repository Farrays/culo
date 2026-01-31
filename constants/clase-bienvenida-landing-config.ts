/**
 * =============================================================================
 * CLASE DE BIENVENIDA LANDING PAGE CONFIGURATION - ENTERPRISE
 * =============================================================================
 *
 * Landing page general para captar nuevos alumnos en cualquier estilo de baile.
 * Ofrece una clase de bienvenida gratuita para probar sin compromiso.
 *
 * RUTA EN App.tsx:
 * import { CLASE_BIENVENIDA_LANDING_CONFIG } from './constants/clase-bienvenida-landing-config';
 * <Route path="/:locale/clase-bienvenida" element={<GenericDanceLanding config={CLASE_BIENVENIDA_LANDING_CONFIG} />} />
 *
 * TEMA: Brand (colores oficiales de Farray's)
 * TARGET: Público general interesado en probar cualquier estilo de baile
 * SOURCE ID: 129204 (Momence)
 * VIDEO: f9ad8f80-f1be-4c20-a40d-c6f007759db7 (Bunny Stream)
 *
 * CARACTERÍSTICAS:
 * - Muestra todas las clases disponibles en el booking widget
 * - Flujo directo de reserva (sin formulario de lead)
 * - Video enterprise con facade pattern
 * - Countdown recurrente cada 14 días
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const CLASE_BIENVENIDA_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'clase-bienvenida-landing',
  slug: 'clase-bienvenida',
  sourceId: 129204,
  estiloValue: 'Clase de Bienvenida',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/categories/img/todas_1024.webp',
    showcase: '/images/categories/img/todas_1024.webp',
    heroAlt: "Clase de Bienvenida Gratuita - Farray's Center Barcelona",
    showcaseAlt: 'Descubre tu estilo de baile en Barcelona',
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
  translationPrefix: 'cbLanding',

  // =========================================================================
  // VALUE STACK - Lo que incluye la clase de bienvenida
  // =========================================================================
  valueStack: [
    { key: 'cbLandingValueItem1', price: 20, priceKey: 'cbLandingValuePrice1' },
    { key: 'cbLandingValueItem2', price: 0, priceKey: 'cbLandingValueIncluded' },
    { key: 'cbLandingValueItem3', price: 0, priceKey: 'cbLandingValueIncluded' },
    { key: 'cbLandingValueItem4', price: 0, priceKey: 'cbLandingValueIncluded' },
    { key: 'cbLandingValueItem5', price: 0, priceKey: 'cbLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US - Por qué elegir Farray's
  // =========================================================================
  whyUs: [
    { titleKey: 'cbLandingWhyTitle1', descKey: 'cbLandingWhyDesc1' },
    { titleKey: 'cbLandingWhyTitle2', descKey: 'cbLandingWhyDesc2' },
    { titleKey: 'cbLandingWhyTitle3', descKey: 'cbLandingWhyDesc3' },
    { titleKey: 'cbLandingWhyTitle4', descKey: 'cbLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS - Preguntas frecuentes
  // =========================================================================
  faqs: [
    { id: 'cb-1', questionKey: 'cbLandingObjQ1', answerKey: 'cbLandingObjA1' },
    { id: 'cb-2', questionKey: 'cbLandingObjQ2', answerKey: 'cbLandingObjA2' },
    { id: 'cb-3', questionKey: 'cbLandingObjQ3', answerKey: 'cbLandingObjA3' },
    { id: 'cb-4', questionKey: 'cbLandingObjQ4', answerKey: 'cbLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'María T.', quote: 'cbLandingTestimonial1' },
    { id: 2, name: 'Carlos R.', quote: 'cbLandingTestimonial2' },
    { id: 3, name: 'Laura P.', quote: 'cbLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS - Vacío (se usa booking widget directo)
  // =========================================================================
  schedule: [],

  // =========================================================================
  // ESTADÍSTICAS
  // =========================================================================
  stats: {
    years: 8,
    activeStudents: 1500,
    satisfiedStudents: 15000,
  },

  // =========================================================================
  // COUNTDOWN - Oferta recurrente cada 14 días
  // =========================================================================
  countdown: {
    baseDate: '2025-01-06T23:59:59',
    intervalDays: 14, // Resetea cada 2 semanas
  },

  // =========================================================================
  // VIDEO (Bunny.net) - Enterprise Mode
  // =========================================================================
  video: {
    bunnyVideoId: 'f9ad8f80-f1be-4c20-a40d-c6f007759db7',
    bunnyLibraryId: '571535',
    aspectRatio: '9:16',
    autoplay: false, // Facade pattern: muestra thumbnail, mejora LCP y rendimiento
    thumbnailUrl:
      'https://vz-3d56a778-175.b-cdn.net/f9ad8f80-f1be-4c20-a40d-c6f007759db7/thumbnail.jpg',
  },

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================
  bookingWidget: {
    styleFilter: '', // Sin filtro = muestra todas las clases
  },
});
