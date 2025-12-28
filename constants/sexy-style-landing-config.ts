/**
 * =============================================================================
 * SEXY STYLE LANDING PAGE CONFIGURATION - ENTERPRISE
 * =============================================================================
 *
 * Landing page de captación para Sexy Style.
 * Usa el template genérico GenericDanceLanding con tema Rose.
 * Optimizada para conversión con enfoque en sensualidad, confianza y expresión corporal.
 *
 * RUTA EN App.tsx:
 * import { SEXY_STYLE_LANDING_CONFIG } from './constants/sexy-style-landing-config';
 * <Route path="/:locale/sexy-style" element={<GenericDanceLanding config={SEXY_STYLE_LANDING_CONFIG} />} />
 *
 * TEMA: Rose (sensual, empoderador, femenino)
 * TARGET: Mujeres 18-45 que buscan expresión corporal sensual y confianza
 *
 * NOINDEX: Esta landing NO se indexa (noindex, nofollow en Helmet)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const SEXY_STYLE_LANDING_CONFIG: LandingConfig = createLandingConfig('rose', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'sexy-style-landing',
  slug: 'sexy-style',
  sourceId: 127835, // Source ID para Momence tracking
  estiloValue: 'Sexy Style',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/sexy-style/img/clases-de-sexy-style-barcelona_1024.webp',
    showcase: '/images/classes/sexy-style/img/clases-de-sexy-style-barcelona_768.webp',
    heroAlt: "Clases de Sexy Style en Barcelona - Farray's Center",
    showcaseAlt: 'Alumnas bailando Sexy Style con expresión sensual en Barcelona',
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
  translationPrefix: 'ssLanding',

  // =========================================================================
  // VALUE STACK - Lo que incluye la clase gratuita
  // =========================================================================
  valueStack: [
    { key: 'ssLandingValueItem1', price: 20, priceKey: 'ssLandingValuePrice1' },
    { key: 'ssLandingValueItem2', price: 0, priceKey: 'ssLandingValueIncluded' },
    { key: 'ssLandingValueItem3', price: 0, priceKey: 'ssLandingValueIncluded' },
    { key: 'ssLandingValueItem4', price: 0, priceKey: 'ssLandingValueIncluded' },
    { key: 'ssLandingValueItem5', price: 0, priceKey: 'ssLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US - Por qué elegir Farray's para Sexy Style
  // =========================================================================
  whyUs: [
    { titleKey: 'ssLandingWhyTitle1', descKey: 'ssLandingWhyDesc1' },
    { titleKey: 'ssLandingWhyTitle2', descKey: 'ssLandingWhyDesc2' },
    { titleKey: 'ssLandingWhyTitle3', descKey: 'ssLandingWhyDesc3' },
    { titleKey: 'ssLandingWhyTitle4', descKey: 'ssLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS - Objeciones más comunes
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'ssLandingObjQ1', answerKey: 'ssLandingObjA1' },
    { id: 'obj-2', questionKey: 'ssLandingObjQ2', answerKey: 'ssLandingObjA2' },
    { id: 'obj-3', questionKey: 'ssLandingObjQ3', answerKey: 'ssLandingObjA3' },
    { id: 'obj-4', questionKey: 'ssLandingObjQ4', answerKey: 'ssLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Laura M.', quote: 'ssLandingTestimonial1' },
    { id: 2, name: 'Marta S.', quote: 'ssLandingTestimonial2' },
    { id: 3, name: 'Ana R.', quote: 'ssLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS - Clases de Sexy Style disponibles
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '12:00 - 13:00',
      levelKey: 'beginnerLevel',
      className: 'Sexy Style',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '2',
      dayKey: 'monday',
      time: '19:00 - 20:00',
      levelKey: 'intermediateAdvancedLevel',
      className: 'Sexy Style',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '3',
      dayKey: 'monday',
      time: '20:00 - 21:00',
      levelKey: 'basicLevel',
      className: 'Sexy Style',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '4',
      dayKey: 'tuesday',
      time: '18:00 - 19:00',
      levelKey: 'basicLevel',
      className: 'Sexy Style',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '5',
      dayKey: 'tuesday',
      time: '21:00 - 22:00',
      levelKey: 'beginnerLevel',
      className: 'Sexy Style',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '6',
      dayKey: 'thursday',
      time: '11:00 - 12:00',
      levelKey: 'beginnerLevel',
      className: 'Sexy Style',
      teacher: 'Yasmina Fernández',
    },
    {
      id: '7',
      dayKey: 'thursday',
      time: '21:00 - 22:00',
      levelKey: 'intermediateLevel',
      className: 'Sexy Style',
      teacher: 'Yasmina Fernández',
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
