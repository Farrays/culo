/**
 * =============================================================================
 * AFRO CONTEMPORÁNEO LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Configuración de la landing page de captación para Afro Contemporáneo.
 * Usa el template genérico GenericDanceLanding con tema Brand (colores oficiales).
 *
 * RUTA EN App.tsx:
 * import { AFRO_CONTEMPORANEO_LANDING_CONFIG } from './constants/afro-contemporaneo-landing-config';
 * <Route path="/:locale/afro-contemporaneo" element={<GenericDanceLanding config={AFRO_CONTEMPORANEO_LANDING_CONFIG} />} />
 *
 * TEMA: Brand (Colores oficiales de Farray's)
 * PROFESORES: Yunaisy Farray, Charlie Breezy
 *
 * SEO: noindex, nofollow (landing de captación ads)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const AFRO_CONTEMPORANEO_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'afro-contemporaneo-landing',
  slug: 'afro-contemporaneo',
  sourceId: 0, // TODO: Asignar sourceId real de Momence cuando esté disponible
  estiloValue: 'Afro Contemporáneo',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/afro-contemporaneo/img/mgs_5260_1024.webp',
    showcase: '/images/classes/afro-contemporaneo/img/mgs_5260_1440.webp',
    heroAlt: 'Clases de Afro Contemporáneo en Barcelona - Método Farray',
    showcaseAlt: 'Estudiantes bailando Afro Contemporáneo con técnica cubana ENA en Barcelona',
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
  translationPrefix: 'acLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'acLandingValueItem1', price: 20, priceKey: 'acLandingValuePrice1' },
    { key: 'acLandingValueItem2', price: 0, priceKey: 'acLandingValueIncluded' },
    { key: 'acLandingValueItem3', price: 0, priceKey: 'acLandingValueIncluded' },
    { key: 'acLandingValueItem4', price: 0, priceKey: 'acLandingValueIncluded' },
    { key: 'acLandingValueItem5', price: 0, priceKey: 'acLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'acLandingWhyTitle1', descKey: 'acLandingWhyDesc1' },
    { titleKey: 'acLandingWhyTitle2', descKey: 'acLandingWhyDesc2' },
    { titleKey: 'acLandingWhyTitle3', descKey: 'acLandingWhyDesc3' },
    { titleKey: 'acLandingWhyTitle4', descKey: 'acLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'acLandingObjQ1', answerKey: 'acLandingObjA1' },
    { id: 'obj-2', questionKey: 'acLandingObjQ2', answerKey: 'acLandingObjA2' },
    { id: 'obj-3', questionKey: 'acLandingObjQ3', answerKey: 'acLandingObjA3' },
    { id: 'obj-4', questionKey: 'acLandingObjQ4', answerKey: 'acLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'María T.', quote: 'acLandingTestimonial1' },
    { id: 2, name: 'Claudia R.', quote: 'acLandingTestimonial2' },
    { id: 3, name: 'Ana P.', quote: 'acLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS (basado en afro-contemporaneo.ts)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '21:00 - 22:00',
      levelKey: 'basicLevel',
      className: 'Afro Contemporáneo Básico',
      teacher: 'Charlie Breezy',
    },
    {
      id: '2',
      dayKey: 'tuesday',
      time: '19:00 - 20:30',
      levelKey: 'intermediateAdvancedLevel',
      className: 'Afro Contemporáneo Int/Avanzado',
      teacher: 'Yunaisy Farray',
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
    bunnyVideoId: '9f2604a0-fed7-4133-bc56-dc1e8cfe95fa',
    bunnyLibraryId: '571535',
    aspectRatio: '9:16', // Reel vertical format
    autoplay: false, // Facade pattern: muestra thumbnail, mejora LCP y rendimiento
    thumbnailUrl:
      'https://vz-3d56a778-175.b-cdn.net/9f2604a0-fed7-4133-bc56-dc1e8cfe95fa/thumbnail_94c0fef4.jpg',
  },

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================
  bookingWidget: {
    styleFilter: 'afrocontemporaneo', // Filtra solo clases de Afro Contemporáneo en el widget
  },
});
