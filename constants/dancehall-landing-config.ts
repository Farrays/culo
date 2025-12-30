/**
 * =============================================================================
 * DANCEHALL LANDING PAGE CONFIGURATION
 * =============================================================================
 *
 * Configuración de la landing page de captación para Dancehall.
 * Landing optimizada para Facebook Ads - Captación de leads para clase de prueba VIP
 *
 * RUTA EN App.tsx:
 * import { DANCEHALL_LANDING_CONFIG } from './constants/dancehall-landing-config';
 * <Route path="/:locale/dancehall-promo" element={<GenericDanceLanding config={DANCEHALL_LANDING_CONFIG} />} />
 *
 * TEMA: Rose (Dancehall, Twerk, Sexy Style)
 * PROFESORAS: Sandra, Isabel
 *
 * SEO: noindex, nofollow (landing de captación ads)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

// =============================================================================
// MAIN LANDING CONFIG (NEW FORMAT)
// =============================================================================

export const DANCEHALL_LANDING_CONFIG: LandingConfig = createLandingConfig('rose', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'dancehall-landing',
  slug: 'dancehall',
  sourceId: 127831,
  estiloValue: 'Dancehall',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/dancehall/img/dancehall-classes-barcelona-01_960.webp',
    showcase: '/images/classes/dancehall/img/dancehall-dance-students-02_960.webp',
    heroAlt: 'Clases de Dancehall en Barcelona - Academia de baile jamaicano',
    showcaseAlt: 'Alumnas de Dancehall en Barcelona bailando en clase',
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
  translationPrefix: 'dhLanding',

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: [
    { key: 'dhLandingValueItem1', price: 20, priceKey: 'dhLandingValuePrice1' },
    { key: 'dhLandingValueItem2', price: 0, priceKey: 'dhLandingValueIncluded' },
    { key: 'dhLandingValueItem3', price: 0, priceKey: 'dhLandingValueIncluded' },
    { key: 'dhLandingValueItem4', price: 0, priceKey: 'dhLandingValueIncluded' },
    { key: 'dhLandingValueItem5', price: 0, priceKey: 'dhLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US
  // =========================================================================
  whyUs: [
    { titleKey: 'dhLandingWhyTitle1', descKey: 'dhLandingWhyDesc1' },
    { titleKey: 'dhLandingWhyTitle2', descKey: 'dhLandingWhyDesc2' },
    { titleKey: 'dhLandingWhyTitle4', descKey: 'dhLandingWhyDesc4' },
    { titleKey: 'dhLandingWhyTitle3', descKey: 'dhLandingWhyDesc3' },
  ],

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'dhLandingObjQ1', answerKey: 'dhLandingObjA1' },
    { id: 'obj-2', questionKey: 'dhLandingObjQ2', answerKey: 'dhLandingObjA2' },
    { id: 'obj-3', questionKey: 'dhLandingObjQ3', answerKey: 'dhLandingObjA3' },
    { id: 'obj-4', questionKey: 'dhLandingObjQ4', answerKey: 'dhLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Marta C.', quote: 'dhLandingTestimonial1' },
    { id: 2, name: 'Laura S.', quote: 'dhLandingTestimonial2' },
    { id: 3, name: 'Paula G.', quote: 'dhLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '22:00 - 23:00',
      levelKey: 'beginnerLevel',
      className: 'Dancehall Female',
      teacher: 'Sandra',
    },
    {
      id: '2',
      dayKey: 'wednesday',
      time: '12:00 - 13:00',
      levelKey: 'beginnerLevel',
      className: 'Dancehall Female',
      teacher: 'Isabel',
    },
    {
      id: '3',
      dayKey: 'wednesday',
      time: '21:00 - 22:00',
      levelKey: 'intermediateLevel',
      className: 'Dancehall Twerk',
      teacher: 'Isabel',
    },
    {
      id: '4',
      dayKey: 'thursday',
      time: '21:00 - 22:00',
      levelKey: 'beginnerLevel',
      className: 'Dancehall Female',
      teacher: 'Isabel',
    },
    {
      id: '5',
      dayKey: 'thursday',
      time: '22:00 - 23:00',
      levelKey: 'basicLevel',
      className: 'Dancehall Female',
      teacher: 'Sandra',
    },
    {
      id: '6',
      dayKey: 'friday',
      time: '18:00 - 19:00',
      levelKey: 'beginnerLevel',
      className: 'Dancehall Twerk',
      teacher: 'Isabel',
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
    bunnyVideoId: 'ee68f627-8330-41aa-b1a8-5307a8400fc6',
    bunnyLibraryId: '571535',
    aspectRatio: '9:16',
    autoplay: false, // Facade pattern: muestra thumbnail, mejora LCP y rendimiento
  },
});

// =============================================================================
// LEGACY EXPORTS (for backward compatibility with DancehallLanding.tsx)
// TODO: Remove these once DancehallLanding.tsx is fully deprecated
// =============================================================================

export const DANCEHALL_LANDING_VIMEO_ID = '1000399455';

export const DANCEHALL_VALUE_STACK = DANCEHALL_LANDING_CONFIG.valueStack;
export const DANCEHALL_WHY_FARRAYS = DANCEHALL_LANDING_CONFIG.whyUs;
export const DANCEHALL_OBJECTION_FAQS = DANCEHALL_LANDING_CONFIG.faqs;
export const DANCEHALL_TESTIMONIALS = DANCEHALL_LANDING_CONFIG.testimonials;
export const DANCEHALL_LANDING_SCHEDULE = DANCEHALL_LANDING_CONFIG.schedule;

export const DANCEHALL_PREPARE_ITEMS = [
  'dhLandingPrepare1',
  'dhLandingPrepare2',
  'dhLandingPrepare3',
  'dhLandingPrepare4',
];

export const DANCEHALL_LANDING_THEME = {
  primary: 'rose',
  accent: 'pink',
  gradient: 'from-rose-900/40 via-black to-pink-900/30',
} as const;
