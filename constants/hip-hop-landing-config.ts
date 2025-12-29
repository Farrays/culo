/**
 * =============================================================================
 * HIP HOP LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Configuración de la landing page de captación para Hip Hop.
 * Usa el template genérico GenericDanceLanding con tema Brand.
 *
 * RUTA EN App.tsx:
 * import { HIP_HOP_LANDING_CONFIG } from './constants/hip-hop-landing-config';
 * <Route path="/:locale/hip-hop" element={<GenericDanceLanding config={HIP_HOP_LANDING_CONFIG} />} />
 *
 * TEMA: Brand (colores oficiales de Farray's Center)
 * PROFESOR: Marcos Martínez (Juez Internacional Hip Hop)
 *
 * SEO: noindex, nofollow (landing de captación ads)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const HIP_HOP_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'hip-hop-landing',
  slug: 'hip-hop',
  sourceId: 129130, // Momence modal ID
  estiloValue: 'Hip Hop',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/hip-hop/img/clases-hip-hop-barcelona_1024.webp',
    showcase: '/images/classes/hip-hop/img/clases-hip-hop-barcelona_1440.webp',
    heroAlt: 'Clases de Hip Hop en Barcelona - Street dance urbano con Marcos Martínez',
    showcaseAlt: 'Estudiantes practicando Hip Hop en Barcelona - Freestyle y coreografías urbanas',
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
  translationPrefix: 'hhLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'hhLandingValueItem1', price: 20, priceKey: 'hhLandingValuePrice1' },
    { key: 'hhLandingValueItem2', price: 0, priceKey: 'hhLandingValueIncluded' },
    { key: 'hhLandingValueItem3', price: 0, priceKey: 'hhLandingValueIncluded' },
    { key: 'hhLandingValueItem4', price: 0, priceKey: 'hhLandingValueIncluded' },
    { key: 'hhLandingValueItem5', price: 0, priceKey: 'hhLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'hhLandingWhyTitle1', descKey: 'hhLandingWhyDesc1' },
    { titleKey: 'hhLandingWhyTitle2', descKey: 'hhLandingWhyDesc2' },
    { titleKey: 'hhLandingWhyTitle3', descKey: 'hhLandingWhyDesc3' },
    { titleKey: 'hhLandingWhyTitle4', descKey: 'hhLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'hhLandingObjQ1', answerKey: 'hhLandingObjA1' },
    { id: 'obj-2', questionKey: 'hhLandingObjQ2', answerKey: 'hhLandingObjA2' },
    { id: 'obj-3', questionKey: 'hhLandingObjQ3', answerKey: 'hhLandingObjA3' },
    { id: 'obj-4', questionKey: 'hhLandingObjQ4', answerKey: 'hhLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Carlos R.', quote: 'hhLandingTestimonial1' },
    { id: 2, name: 'Andrea M.', quote: 'hhLandingTestimonial2' },
    { id: 3, name: 'David L.', quote: 'hhLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS (basado en hip-hop.ts)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'thursday',
      time: '20:00 - 21:00',
      levelKey: 'allLevels',
      className: 'Hip Hop Urbano',
      teacher: 'Marcos Martínez',
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
  // VIDEO (Bunny.net)
  // =========================================================================
  video: {
    bunnyVideoId: '54f2f015-18db-4535-b520-1c8cedde36b9',
    bunnyLibraryId: '570522',
    aspectRatio: '9:16',
    autoplay: false,
  },
});
