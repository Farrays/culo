/**
 * =============================================================================
 * JORNADA PUERTAS ABIERTAS LANDING PAGE CONFIGURATION - ENTERPRISE
 * =============================================================================
 *
 * Landing page para la Jornada de Puertas Abiertas de Farray's Center.
 * FECHAS: Del 7 al 31 de enero de 2025
 *
 * Muestra el widget completo de horarios (todas las clases) sin navegación.
 * Los usuarios pueden reservar UNA clase de prueba gratuita.
 * Si desean probar más clases, deben abonar el precio de clase suelta.
 *
 * RUTA EN App.tsx:
 * import { JORNADA_PUERTAS_ABIERTAS_LANDING_CONFIG } from './constants/jornada-puertas-abiertas-landing-config';
 * <Route path="/:locale/jornada-puertas-abiertas" element={<GenericDanceLanding config={JORNADA_PUERTAS_ABIERTAS_LANDING_CONFIG} />} />
 *
 * TEMA: Brand (colores oficiales de Farray's)
 * TARGET: Público general interesado en conocer todas las clases del centro
 * SOURCE ID: 129204 (Momence)
 * VIDEO: f9ad8f80-f1be-4c20-a40d-c6f007759db7 (Bunny Stream)
 *
 * CARACTERÍSTICAS ESPECIALES:
 * - showFullSchedule: true - Muestra widget de horarios completo con filtros
 * - Las clases NO son clicables (solo visualización)
 * - Registro mediante modal de captación
 * - Descuento exclusivo en primera mensualidad si se inscribe
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const JORNADA_PUERTAS_ABIERTAS_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'jornada-puertas-abiertas-landing',
  slug: 'jornada-puertas-abiertas',
  sourceId: 129204,
  estiloValue: 'Jornada Puertas Abiertas',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/categories/img/todas_1024.webp',
    showcase: '/images/categories/img/todas_1024.webp',
    heroAlt: "Jornada de Puertas Abiertas - Farray's Center Barcelona",
    showcaseAlt: 'Conoce todas nuestras clases de baile en Barcelona',
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
  translationPrefix: 'jpaLanding',

  // =========================================================================
  // WIDGET DE HORARIOS COMPLETO
  // =========================================================================
  showFullSchedule: true,

  // =========================================================================
  // VALUE STACK - Lo que incluye la clase de bienvenida
  // =========================================================================
  valueStack: [
    { key: 'jpaLandingValueItem1', price: 20, priceKey: 'jpaLandingValuePrice1' },
    { key: 'jpaLandingValueItem2', price: 0, priceKey: 'jpaLandingValueIncluded' },
    { key: 'jpaLandingValueItem3', price: 0, priceKey: 'jpaLandingValueIncluded' },
    { key: 'jpaLandingValueItem4', price: 0, priceKey: 'jpaLandingValueIncluded' },
    { key: 'jpaLandingValueItem5', price: 0, priceKey: 'jpaLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US - Por qué elegir Farray's
  // =========================================================================
  whyUs: [
    { titleKey: 'jpaLandingWhyTitle1', descKey: 'jpaLandingWhyDesc1' },
    { titleKey: 'jpaLandingWhyTitle2', descKey: 'jpaLandingWhyDesc2' },
    { titleKey: 'jpaLandingWhyTitle3', descKey: 'jpaLandingWhyDesc3' },
    { titleKey: 'jpaLandingWhyTitle4', descKey: 'jpaLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS - Preguntas frecuentes sobre la jornada
  // =========================================================================
  faqs: [
    { id: 'jpa-1', questionKey: 'jpaLandingObjQ1', answerKey: 'jpaLandingObjA1' },
    { id: 'jpa-2', questionKey: 'jpaLandingObjQ2', answerKey: 'jpaLandingObjA2' },
    { id: 'jpa-3', questionKey: 'jpaLandingObjQ3', answerKey: 'jpaLandingObjA3' },
    { id: 'jpa-4', questionKey: 'jpaLandingObjQ4', answerKey: 'jpaLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'María T.', quote: 'jpaLandingTestimonial1' },
    { id: 2, name: 'Carlos R.', quote: 'jpaLandingTestimonial2' },
    { id: 3, name: 'Laura P.', quote: 'jpaLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS - Vacío porque usamos showFullSchedule
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
  // COUNTDOWN - Fin de la jornada (31 de enero 2026)
  // =========================================================================
  countdown: {
    baseDate: '2026-01-31T23:59:59', // Fin de la Jornada de Puertas Abiertas
    intervalDays: 0, // No se reinicia, es una fecha fija
  },

  // =========================================================================
  // VIDEO (Bunny.net)
  // =========================================================================
  video: {
    bunnyVideoId: 'f9ad8f80-f1be-4c20-a40d-c6f007759db7',
    bunnyLibraryId: '571535',
    aspectRatio: '9:16',
    autoplay: true,
  },
});
