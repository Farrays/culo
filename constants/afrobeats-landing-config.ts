/**
 * =============================================================================
 * AFROBEATS LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Configuración de la landing page de captación para Afrobeats.
 * Usa el template genérico GenericDanceLanding con tema Brand.
 *
 * RUTA EN App.tsx:
 * import { AFROBEATS_LANDING_CONFIG } from './constants/afrobeats-landing-config';
 * <Route path="/:locale/afrobeats" element={<GenericDanceLanding config={AFROBEATS_LANDING_CONFIG} />} />
 *
 * TEMA: Brand (colores oficiales de Farray's Center)
 * PROFESORES: Redblueh, Charlie Breezy
 *
 * SEO: noindex, nofollow (landing de captación ads)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const AFROBEATS_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'afrobeats-landing',
  slug: 'afrobeats',
  sourceId: 0, // TODO: Asignar sourceId real de Momence cuando esté disponible
  estiloValue: 'Afrobeats',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/afrobeat/img/clases-afrobeat-barcelona_960.webp',
    showcase: '/images/classes/afrobeat/img/clases-afrobeat-barcelona_1440.webp',
    heroAlt: 'Clases de Afrobeats en Barcelona - Academia de danza africana',
    showcaseAlt: 'Estudiantes bailando Afrobeats en Barcelona con Redblueh',
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
  translationPrefix: 'abLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'abLandingValueItem1', price: 20, priceKey: 'abLandingValuePrice1' },
    { key: 'abLandingValueItem2', price: 0, priceKey: 'abLandingValueIncluded' },
    { key: 'abLandingValueItem3', price: 0, priceKey: 'abLandingValueIncluded' },
    { key: 'abLandingValueItem4', price: 0, priceKey: 'abLandingValueIncluded' },
    { key: 'abLandingValueItem5', price: 0, priceKey: 'abLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'abLandingWhyTitle1', descKey: 'abLandingWhyDesc1' },
    { titleKey: 'abLandingWhyTitle2', descKey: 'abLandingWhyDesc2' },
    { titleKey: 'abLandingWhyTitle3', descKey: 'abLandingWhyDesc3' },
    { titleKey: 'abLandingWhyTitle4', descKey: 'abLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'abLandingObjQ1', answerKey: 'abLandingObjA1' },
    { id: 'obj-2', questionKey: 'abLandingObjQ2', answerKey: 'abLandingObjA2' },
    { id: 'obj-3', questionKey: 'abLandingObjQ3', answerKey: 'abLandingObjA3' },
    { id: 'obj-4', questionKey: 'abLandingObjQ4', answerKey: 'abLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'María G.', quote: 'abLandingTestimonial1' },
    { id: 2, name: 'Carlos R.', quote: 'abLandingTestimonial2' },
    { id: 3, name: 'Laura S.', quote: 'abLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS (basado en afrobeat.ts)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'tuesday',
      time: '18:00 - 19:00',
      levelKey: 'basicLevel',
      className: 'Afrobeat Básico',
      teacher: 'Redblueh',
    },
    {
      id: '2',
      dayKey: 'wednesday',
      time: '18:00 - 19:00',
      levelKey: 'beginnerLevel',
      className: 'Afrobeats Principiantes',
      teacher: 'Charlie Breezy',
    },
    {
      id: '3',
      dayKey: 'friday',
      time: '18:00 - 19:00',
      levelKey: 'basicLevel',
      className: 'Afrobeat Básico',
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
});
