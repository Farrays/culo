/**
 * =============================================================================
 * BALLET LANDING PAGE CONFIGURATION - ENTERPRISE
 * =============================================================================
 *
 * Landing page de captación para Ballet Clásico.
 * Usa el template genérico GenericDanceLanding con tema Brand (colores oficiales Farray's).
 * Optimizada para conversión con enfoque en técnica, elegancia y disciplina artística.
 *
 * RUTA EN App.tsx:
 * import { BALLET_LANDING_CONFIG } from './constants/ballet-landing-config';
 * <Route path="/:locale/ballet" element={<GenericDanceLanding config={BALLET_LANDING_CONFIG} />} />
 *
 * TEMA: Brand (colores oficiales de Farray's)
 * TARGET: Adultos 18-55 que buscan técnica clásica, postura, flexibilidad y expresión artística
 *
 * PROFESORES:
 * - Daniel Sené: Bailarín profesional formado en la Escuela Nacional de Arte de Cuba
 * - Alejandro Miñoso: Bailarín profesional con formación en la Escuela Nacional de Arte de Cuba
 *
 * NIVELES:
 * - Ballet Principiantes
 * - Ballet Intermedio
 *
 * SEO: noindex, nofollow (landing de captación ads)
 */

import { createLandingConfig, type LandingConfig } from './landing-template-config';

export const BALLET_LANDING_CONFIG: LandingConfig = createLandingConfig('brand', {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: 'ballet-landing',
  slug: 'ballet',
  sourceId: 0, // TODO: Asignar sourceId real de Momence cuando esté disponible
  estiloValue: 'Ballet Clásico',
  discoveryValue: 'Facebook',

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: {
    hero: '/images/classes/ballet/img/clases-ballet-barcelona_1440.webp',
    showcase: '/images/classes/ballet/img/clases-ballet-barcelona_1024.webp',
    heroAlt: 'Clases de Ballet Clásico en Barcelona - Método Farray',
    showcaseAlt: 'Estudiantes practicando ballet clásico en la barra en Barcelona',
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
  translationPrefix: 'btLanding',

  // =========================================================================
  // VALUE STACK - Lo que incluye la clase gratuita
  // =========================================================================
  valueStack: [
    { key: 'btLandingValueItem1', price: 20, priceKey: 'btLandingValuePrice1' },
    { key: 'btLandingValueItem2', price: 0, priceKey: 'btLandingValueIncluded' },
    { key: 'btLandingValueItem3', price: 0, priceKey: 'btLandingValueIncluded' },
    { key: 'btLandingValueItem4', price: 0, priceKey: 'btLandingValueIncluded' },
    { key: 'btLandingValueItem5', price: 0, priceKey: 'btLandingValueIncluded' },
  ],

  // =========================================================================
  // WHY US - Por qué elegir Farray's para Ballet
  // =========================================================================
  whyUs: [
    { titleKey: 'btLandingWhyTitle1', descKey: 'btLandingWhyDesc1' },
    { titleKey: 'btLandingWhyTitle2', descKey: 'btLandingWhyDesc2' },
    { titleKey: 'btLandingWhyTitle3', descKey: 'btLandingWhyDesc3' },
    { titleKey: 'btLandingWhyTitle4', descKey: 'btLandingWhyDesc4' },
  ],

  // =========================================================================
  // FAQS - Objeciones más comunes
  // =========================================================================
  faqs: [
    { id: 'obj-1', questionKey: 'btLandingObjQ1', answerKey: 'btLandingObjA1' },
    { id: 'obj-2', questionKey: 'btLandingObjQ2', answerKey: 'btLandingObjA2' },
    { id: 'obj-3', questionKey: 'btLandingObjQ3', answerKey: 'btLandingObjA3' },
    { id: 'obj-4', questionKey: 'btLandingObjQ4', answerKey: 'btLandingObjA4' },
  ],

  // =========================================================================
  // TESTIMONIALES
  // =========================================================================
  testimonials: [
    { id: 1, name: 'Patricia L.', quote: 'btLandingTestimonial1' },
    { id: 2, name: 'Carmen R.', quote: 'btLandingTestimonial2' },
    { id: 3, name: 'Elena M.', quote: 'btLandingTestimonial3' },
  ],

  // =========================================================================
  // HORARIOS - Clases de Ballet disponibles (datos reales 2025)
  // =========================================================================
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '20:00 - 21:00',
      levelKey: 'intermediateLevel',
      className: 'Ballet Clásico Intermedio',
      teacher: 'Daniel Sené',
    },
    {
      id: '2',
      dayKey: 'thursday',
      time: '11:00 - 12:00',
      levelKey: 'basicLevel',
      className: 'Ballet Principiantes',
      teacher: 'Alejandro Miñoso',
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
