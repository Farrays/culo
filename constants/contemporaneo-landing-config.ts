/**
 * =============================================================================
 * CONTEMPORANEO LANDING PAGE CONFIGURATION - ENTERPRISE
 * =============================================================================
 *
 * Landing page de captación para Danza Contemporánea.
 * Usa el template genérico GenericDanceLanding con tema Cyan.
 * Optimizada para conversión con enfoque en expresión artística, fluidez y conexión cuerpo-mente.
 *
 * RUTA EN App.tsx:
 * import { CONTEMPORANEO_LANDING_CONFIG } from './constants/contemporaneo-landing-config';
 * <Route path="/:locale/contemporaneo" element={<GenericDanceLanding config={CONTEMPORANEO_LANDING_CONFIG} />} />
 *
 * TEMA: Brand (colores oficiales de Farray's)
 * TARGET: Adultos 20-50 que buscan expresión artística, conexión cuerpo-mente, y desarrollo técnico
 * SOURCE ID: 129132 (Momence)
 * VIDEO: Bunny Stream 9:16 autoplay
 *
 * PROFESORES:
 * - Daniel Sené: Bailarín profesional formado en la Escuela Nacional de Arte de Cuba
 * - Alejandro Miñoso: Especialista en técnica de suelo y flow
 *
 * ESTILOS:
 * - Contemporáneo Lírico Principiantes
 * - Contemporáneo Lírico Básico
 * - Contemporáneo Lírico Intermedio
 * - Contemporáneo Suelo & Flow
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const CONTEMPORANEO_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'contemporaneo-landing',
  slug: 'contemporaneo',
  sourceId: 129132, // Source ID para Momence tracking
  estiloValue: 'Danza Contemporánea',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/contemporaneo/img/mgs_5189_1440.webp',
    showcase: '/images/classes/afro-contemporaneo/img/mgs_5260_1024.webp',
    heroAlt: "Clases de Danza Contemporánea en Barcelona - Farray's Center",
    showcaseAlt: 'Clase de Afro Contemporáneo con técnica cubana ENA en Barcelona',
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
  translationPrefix: 'ctLanding',

  // =========================================================================
  // VALUE STACK - Lo que incluye la clase gratuita
  // =========================================================================
  valueStack: [
    { key: 'ctLandingValueItem1', price: 20, priceKey: 'ctLandingValuePrice1' },
    { key: 'ctLandingValueItem2', price: 0, priceKey: 'ctLandingValueIncluded' },
    { key: 'ctLandingValueItem3', price: 0, priceKey: 'ctLandingValueIncluded' },
    { key: 'ctLandingValueItem4', price: 0, priceKey: 'ctLandingValueIncluded' },
    { key: 'ctLandingValueItem5', price: 0, priceKey: 'ctLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US - Por qué elegir Farray's para Contemporáneo
  // =========================================================================
  whyUs: [
    { titleKey: 'ctLandingWhyTitle1', descKey: 'ctLandingWhyDesc1' },
    { titleKey: 'ctLandingWhyTitle2', descKey: 'ctLandingWhyDesc2' },
    { titleKey: 'ctLandingWhyTitle3', descKey: 'ctLandingWhyDesc3' },
    { titleKey: 'ctLandingWhyTitle4', descKey: 'ctLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS - Objeciones más comunes
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'ctLandingObjQ1', answerKey: 'ctLandingObjA1' },
    { id: 'obj-2', questionKey: 'ctLandingObjQ2', answerKey: 'ctLandingObjA2' },
    { id: 'obj-3', questionKey: 'ctLandingObjQ3', answerKey: 'ctLandingObjA3' },
    { id: 'obj-4', questionKey: 'ctLandingObjQ4', answerKey: 'ctLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Paula M.', quote: 'ctLandingTestimonial1' },
    { id: 2, name: 'Andrea G.', quote: 'ctLandingTestimonial2' },
    { id: 3, name: 'Marta L.', quote: 'ctLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS - Clases de Contemporáneo y Afro Contemporáneo (datos reales 2025)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '11:00 - 12:00',
      levelKey: 'basicLevel',
      className: 'Contemporáneo Lírico',
      teacher: 'Alejandro Miñoso',
    },
    {
      id: '2',
      dayKey: 'monday',
      time: '19:00 - 20:00',
      levelKey: 'basicLevel',
      className: 'Contemporáneo Lírico',
      teacher: 'Daniel Sené',
    },
    {
      id: '3',
      dayKey: 'monday',
      time: '21:00 - 22:00',
      levelKey: 'basicLevel',
      className: 'Afro Contemporáneo',
      teacher: 'Charlie Breezy',
    },
    {
      id: '4',
      dayKey: 'tuesday',
      time: '19:00 - 20:30',
      levelKey: 'intermediateAdvancedLevel',
      className: 'Afro Contemporáneo',
      teacher: 'Yunaisy Farray',
    },
    {
      id: '5',
      dayKey: 'wednesday',
      time: '11:00 - 12:00',
      levelKey: 'basicIntermediateLevel',
      className: 'Contemporáneo Suelo & Flow',
      teacher: 'Alejandro Miñoso',
    },
    {
      id: '6',
      dayKey: 'wednesday',
      time: '20:00 - 21:00',
      levelKey: 'intermediateLevel',
      className: 'Contemporáneo Lírico',
      teacher: 'Daniel Sené',
    },
    {
      id: '7',
      dayKey: 'thursday',
      time: '18:00 - 19:00',
      levelKey: 'beginnerLevel',
      className: 'Contemporáneo Lírico',
      teacher: 'Daniel Sené',
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

  // =========================================================================
  // VIDEO (Bunny.net)
  // =========================================================================
  video: {
    bunnyVideoId: '75a74b09-277f-493f-b142-8a84df33a487',
    bunnyLibraryId: '571535',
    aspectRatio: '9:16',
    autoplay: true,
  },
});
