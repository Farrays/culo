/**
 * =============================================================================
 * AFRO JAZZ LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Configuración de la landing page de captación para Afro Jazz.
 * Usa el template genérico GenericDanceLanding con tema Violet.
 *
 * RUTA EN App.tsx:
 * import { AFRO_JAZZ_LANDING_CONFIG } from './constants/afro-jazz-landing-config';
 * <Route path="/:locale/afro-jazz" element={<GenericDanceLanding config={AFRO_JAZZ_LANDING_CONFIG} />} />
 *
 * TEMA: Brand (Colores oficiales de Farray's)
 * PROFESORES: Yunaisy Farray, Alejandro Miñoso
 *
 * SEO: noindex, nofollow (landing de captación ads)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const AFRO_JAZZ_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'afro-jazz-landing',
  slug: 'afro-jazz',
  sourceId: 0, // TODO: Asignar sourceId real de Momence cuando esté disponible
  estiloValue: 'Afro Jazz',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/afro-jazz/img/afro-jazz_1024.webp',
    showcase: '/images/classes/afro-jazz/img/afro-jazz_1440.webp',
    heroAlt: 'Clases de Afro Jazz en Barcelona - Método Farray',
    showcaseAlt: 'Estudiantes bailando Afro Jazz en Barcelona con el Método Farray',
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
  translationPrefix: 'ajLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'ajLandingValueItem1', price: 20, priceKey: 'ajLandingValuePrice1' },
    { key: 'ajLandingValueItem2', price: 0, priceKey: 'ajLandingValueIncluded' },
    { key: 'ajLandingValueItem3', price: 0, priceKey: 'ajLandingValueIncluded' },
    { key: 'ajLandingValueItem4', price: 0, priceKey: 'ajLandingValueIncluded' },
    { key: 'ajLandingValueItem5', price: 0, priceKey: 'ajLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'ajLandingWhyTitle1', descKey: 'ajLandingWhyDesc1' },
    { titleKey: 'ajLandingWhyTitle2', descKey: 'ajLandingWhyDesc2' },
    { titleKey: 'ajLandingWhyTitle3', descKey: 'ajLandingWhyDesc3' },
    { titleKey: 'ajLandingWhyTitle4', descKey: 'ajLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'ajLandingObjQ1', answerKey: 'ajLandingObjA1' },
    { id: 'obj-2', questionKey: 'ajLandingObjQ2', answerKey: 'ajLandingObjA2' },
    { id: 'obj-3', questionKey: 'ajLandingObjQ3', answerKey: 'ajLandingObjA3' },
    { id: 'obj-4', questionKey: 'ajLandingObjQ4', answerKey: 'ajLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Elena R.', quote: 'ajLandingTestimonial1' },
    { id: 2, name: 'Patricia M.', quote: 'ajLandingTestimonial2' },
    { id: 3, name: 'Laura S.', quote: 'ajLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS (basado en afro-jazz.ts)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'wednesday',
      time: '12:00 - 13:00',
      levelKey: 'beginnerLevel',
      className: 'Afro Jazz Principiantes',
      teacher: 'Alejandro Miñoso',
    },
    {
      id: '2',
      dayKey: 'thursday',
      time: '19:00 - 20:30',
      levelKey: 'intermediateAdvancedLevel',
      className: 'Afro Jazz Intermedio/Avanzado',
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
});
