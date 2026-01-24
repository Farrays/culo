/**
 * =============================================================================
 * FEMMOLOGY LANDING PAGE CONFIGURATION - ENTERPRISE
 * =============================================================================
 *
 * Landing page de captación para Femmology - Método exclusivo de Yunaisy Farray.
 * Usa el template genérico GenericDanceLanding con tema Fuchsia.
 * Optimizada para conversión con enfoque en empoderamiento femenino,
 * autoestima, sensualidad consciente y transformación personal.
 *
 * RUTA EN App.tsx:
 * import { FEMMOLOGY_LANDING_CONFIG } from './constants/femmology-landing-config';
 * <Route path="/:locale/femmology" element={<GenericDanceLanding config={FEMMOLOGY_LANDING_CONFIG} />} />
 *
 * TEMA: Fuchsia (feminidad, empoderamiento, transformación)
 * TARGET: Mujeres 25-55 que buscan reconectarse con su feminidad y autoestima
 *
 * NOINDEX: Esta landing NO se indexa (noindex, nofollow en Helmet)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const FEMMOLOGY_LANDING_CONFIG: LandingConfig = createLandingConfig('fuchsia', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'femmology-landing',
  slug: 'femmology',
  sourceId: 0, // TODO: Obtener sourceId de Momence cuando esté disponible
  estiloValue: 'Femmology',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES (Enterprise: nueva foto grupal escenario 2025)
  // =========================================================================
  images: {
    hero: '/images/classes/femmology/img/femmology-hero-barcelona_1024.webp',
    showcase: '/images/classes/femmology/img/femmology-hero-barcelona_768.webp',
    heroAlt:
      'Yunaisy Farray y su grupo de bailarinas de Femmology en pose dramática sobre escenario - Clases de baile en tacones Barcelona',
    showcaseAlt:
      'Grupo de bailarinas ejecutando coreografía de Femmology con tacones en escenario profesional Barcelona',
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
  translationPrefix: 'femLanding',

  // =========================================================================
  // VALUE STACK - Lo que incluye la clase gratuita
  // =========================================================================
  valueStack: [
    { key: 'femLandingValueItem1', price: 20, priceKey: 'femLandingValuePrice1' },
    { key: 'femLandingValueItem2', price: 0, priceKey: 'femLandingValueIncluded' },
    { key: 'femLandingValueItem3', price: 0, priceKey: 'femLandingValueIncluded' },
    { key: 'femLandingValueItem4', price: 0, priceKey: 'femLandingValueIncluded' },
    { key: 'femLandingValueItem5', price: 0, priceKey: 'femLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US - Por qué elegir Farray's para Femmology
  // =========================================================================
  whyUs: [
    { titleKey: 'femLandingWhyTitle1', descKey: 'femLandingWhyDesc1' },
    { titleKey: 'femLandingWhyTitle2', descKey: 'femLandingWhyDesc2' },
    { titleKey: 'femLandingWhyTitle3', descKey: 'femLandingWhyDesc3' },
    { titleKey: 'femLandingWhyTitle4', descKey: 'femLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS - Objeciones más comunes
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'femLandingObjQ1', answerKey: 'femLandingObjA1' },
    { id: 'obj-2', questionKey: 'femLandingObjQ2', answerKey: 'femLandingObjA2' },
    { id: 'obj-3', questionKey: 'femLandingObjQ3', answerKey: 'femLandingObjA3' },
    { id: 'obj-4', questionKey: 'femLandingObjQ4', answerKey: 'femLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'María del Carmen R.', quote: 'femLandingTestimonial1' },
    { id: 2, name: 'Laura M.', quote: 'femLandingTestimonial2' },
    { id: 3, name: 'Patricia S.', quote: 'femLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS - Clases de Femmology disponibles (con Yunaisy Farray)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'tuesday',
      time: '20:30 - 21:30',
      levelKey: 'intermediateLevel',
      className: 'Femmology Heels Technique',
      teacher: 'Yunaisy Farray',
    },
    {
      id: '2',
      dayKey: 'tuesday',
      time: '21:30 - 23:00',
      levelKey: 'advancedLevel',
      className: 'Femmology Heels Technique',
      teacher: 'Yunaisy Farray',
    },
    {
      id: '3',
      dayKey: 'wednesday',
      time: '21:00 - 22:00',
      levelKey: 'basicLevel',
      className: 'Femmology Heels Technique',
      teacher: 'Yunaisy Farray',
    },
    {
      id: '4',
      dayKey: 'thursday',
      time: '21:30 - 22:30',
      levelKey: 'beginnerLevel',
      className: 'Femmology Heels Technique',
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
  // COUNTDOWN - Oferta con urgencia
  // =========================================================================
  countdown: {
    baseDate: '2025-01-06T23:59:59',
    intervalDays: 14, // Resetea cada 2 semanas
  },
});
