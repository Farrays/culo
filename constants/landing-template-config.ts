/**
 * =============================================================================
 * LANDING PAGE TEMPLATE CONFIGURATION
 * =============================================================================
 *
 * Este archivo sirve como TEMPLATE para crear nuevas landing pages de captación.
 *
 * INSTRUCCIONES DE USO:
 * 1. Copia este archivo y renómbralo (ej: salsa-landing-config.ts)
 * 2. Cambia LANDING_CONFIG con los datos de tu nuevo estilo
 * 3. Añade las traducciones en i18n/locales/ (ES, EN, CA, FR)
 * 4. Crea la ruta en App.tsx apuntando a GenericDanceLanding
 *
 * EJEMPLO DE RUTA EN App.tsx:
 * import { SALSA_LANDING_CONFIG } from './constants/salsa-landing-config';
 * <Route path="/:locale/salsa-promo" element={<GenericDanceLanding config={SALSA_LANDING_CONFIG} />} />
 */

import { ThemeName, getTheme, LandingThemeClasses } from './landing-themes';

// =============================================================================
// TYPES
// =============================================================================

export interface LandingTheme {
  /** Nombre del tema predefinido: 'rose', 'emerald', 'amber', 'violet', 'cyan', 'fuchsia' */
  name: ThemeName;
  /** Clases CSS del tema (se obtienen automáticamente de landing-themes.ts) */
  classes: LandingThemeClasses;
}

export interface LandingImage {
  /** Ruta de la imagen hero (960px) */
  hero: string;
  /** Ruta de la imagen de estudiantes/showcase */
  showcase: string;
  /** Alt text para SEO */
  heroAlt: string;
  showcaseAlt: string;
}

export interface LandingValueItem {
  /** Clave de traducción para el texto del item */
  key: string;
  /** Precio en euros (0 si es "incluido") */
  price: number;
  /** Clave de traducción para mostrar el precio */
  priceKey: string;
}

export interface LandingWhyItem {
  /** Clave de traducción para el título */
  titleKey: string;
  /** Clave de traducción para la descripción */
  descKey: string;
}

export interface LandingFaqItem {
  /** ID único para el FAQ */
  id: string;
  /** Clave de traducción para la pregunta */
  questionKey: string;
  /** Clave de traducción para la respuesta */
  answerKey: string;
}

export interface LandingTestimonial {
  /** ID único */
  id: number;
  /** Nombre del cliente */
  name: string;
  /** Clave de traducción para la cita */
  quote: string;
}

export interface LandingScheduleItem {
  /** ID único */
  id: string;
  /** Clave de traducción del día (monday, tuesday, etc.) */
  dayKey: string;
  /** Horario en formato "HH:MM - HH:MM" */
  time: string;
  /** Clave de traducción del nivel (beginnerLevel, intermediateLevel, etc.) */
  levelKey: string;
  /** Nombre de la clase */
  className: string;
  /** Nombre del profesor/a */
  teacher: string;
}

export interface LandingLogo {
  /** Ruta de la imagen del logo */
  src: string;
  /** Alt text */
  alt: string;
  /** Etiqueta visible */
  label: string;
}

export interface LandingConfig {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================

  /** ID único de la landing (usado para analytics, storage, etc.) */
  id: string;

  /** Slug de la URL (ej: 'dancehall', 'salsa', 'twerk') */
  slug: string;

  /** Source ID para Momence (cada landing debe tener uno único) */
  sourceId: number;

  /** Valor para el campo 'estilo' en el formulario de lead */
  estiloValue: string;

  /** Valor para el campo 'discoveryAnswer' (normalmente 'Facebook') */
  discoveryValue: string;

  // =========================================================================
  // TEMA VISUAL
  // =========================================================================

  theme: LandingTheme;

  // =========================================================================
  // IMÁGENES
  // =========================================================================

  images: LandingImage;

  // =========================================================================
  // LOGOS (As seen in...)
  // =========================================================================

  logos: LandingLogo[];

  // =========================================================================
  // CLAVES DE TRADUCCIÓN
  // =========================================================================

  /** Prefijo para todas las claves de traducción (ej: 'dhLanding' -> dhLandingHeadline) */
  translationPrefix: string;

  // =========================================================================
  // DATOS DE CONTENIDO
  // =========================================================================

  /** Items del value stack (lo que incluye la oferta) */
  valueStack: LandingValueItem[];

  /** Items de "Por qué elegirnos" */
  whyUs: LandingWhyItem[];

  /** FAQs / Objeciones */
  faqs: LandingFaqItem[];

  /** Testimoniales */
  testimonials: LandingTestimonial[];

  /** Horarios disponibles */
  schedule: LandingScheduleItem[];

  // =========================================================================
  // ESTADÍSTICAS
  // =========================================================================

  stats: {
    years: number;
    activeStudents: number;
    satisfiedStudents: number;
  };

  // =========================================================================
  // COUNTDOWN
  // =========================================================================

  countdown: {
    /** Fecha base para el countdown (formato ISO) */
    baseDate: string;
    /** Intervalo en días para reiniciar (14 = 2 semanas) */
    intervalDays: number;
  };

  // =========================================================================
  // WIDGET DE HORARIOS COMPLETO (Jornada Puertas Abiertas)
  // =========================================================================

  /** Mostrar widget completo de horarios (todas las clases, no clicables) */
  showFullSchedule?: boolean;

  // =========================================================================
  // VIDEO (Bunny.net)
  // =========================================================================

  /** Configuración del video de Bunny Stream (opcional) */
  video?: {
    /** ID del video en Bunny Stream (GUID) */
    bunnyVideoId: string;
    /** ID de la biblioteca en Bunny Stream */
    bunnyLibraryId: string;
    /** Aspect ratio del video: '16:9' (horizontal), '9:16' (reel/vertical), '1:1' (cuadrado) */
    aspectRatio?: '16:9' | '9:16' | '1:1';
    /** URL personalizada del thumbnail (opcional - obtener desde Bunny dashboard) */
    thumbnailUrl?: string;
    /** Cargar video directamente sin thumbnail facade */
    autoplay?: boolean;
  };

  // =========================================================================
  // BOOKING WIDGET (Direct booking flow - high conversion)
  // =========================================================================

  /**
   * Configuración para flujo de reserva directa (en lugar de captación de lead)
   * Después del micro-commitment, el usuario ve un CTA que lleva al widget de reservas
   * con filtros pre-aplicados para mostrar solo las clases relevantes.
   */
  bookingWidget?: {
    /** Filtro de estilo para el widget (e.g., 'afro', 'twerk', 'dancehall', 'hiphop') */
    styleFilter: string;
    /** Clave de traducción para el texto del CTA (default: 'booking_cta_reserve') */
    ctaKey?: string;
    /** Fecha objetivo para calcular el week offset automáticamente (ISO date, e.g. '2026-03-12') */
    targetDate?: string;
  };
}

// =============================================================================
// HELPER FUNCTION
// =============================================================================

/**
 * Helper para crear configuraciones de landing rápidamente
 */
export function createLandingConfig(
  themeName: ThemeName,
  config: Omit<LandingConfig, 'theme'>
): LandingConfig {
  return {
    ...config,
    theme: {
      name: themeName,
      classes: getTheme(themeName),
    },
  };
}

// =============================================================================
// TEMPLATE VACÍO PARA COPIAR
// =============================================================================

/**
 * =============================================================================
 * TEMPLATE VACÍO PARA COPIAR
 * =============================================================================
 *
 * Copia este template y rellena los datos para tu nueva landing.
 * Recuerda añadir las traducciones en los 4 idiomas.
 *
 * TEMAS DISPONIBLES:
 * - 'rose'    → Rosa/Pink (Dancehall, Twerk, Sexy Style)
 * - 'emerald' → Verde (Salsa, Bachata, Caribeño)
 * - 'amber'   → Ámbar/Naranja (Hip-Hop, Afrobeats, Reggaeton)
 * - 'violet'  → Violeta/Púrpura (Heels, Lady Style, Modern Jazz)
 * - 'cyan'    → Cian/Azul (Contemporáneo, Lírico)
 * - 'fuchsia' → Fucsia (Kizomba, Sensual)
 */
export const LANDING_TEMPLATE: LandingConfig = createLandingConfig('rose', {
  // Identificadores
  id: 'CAMBIAR-landing',
  slug: 'CAMBIAR',
  sourceId: 0, // Pedir nuevo sourceId a Momence
  estiloValue: 'CAMBIAR',
  discoveryValue: 'Facebook',

  // Imágenes
  images: {
    hero: '/images/classes/CAMBIAR/img/CAMBIAR_960.webp',
    showcase: '/images/classes/CAMBIAR/img/CAMBIAR_960.webp',
    heroAlt: 'Clases de CAMBIAR en Barcelona',
    showcaseAlt: 'Alumnas de CAMBIAR en Barcelona',
  },

  // Logos (normalmente los mismos para todas)
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

  // Prefijo de traducciones (ej: 'twLanding' para Twerk, 'slLanding' para Salsa)
  translationPrefix: 'xxLanding',

  // Value Stack
  valueStack: [
    { key: 'xxLandingValueItem1', price: 20, priceKey: 'xxLandingValuePrice1' },
    { key: 'xxLandingValueItem2', price: 0, priceKey: 'xxLandingValueIncluded' },
    { key: 'xxLandingValueItem3', price: 0, priceKey: 'xxLandingValueIncluded' },
    { key: 'xxLandingValueItem4', price: 0, priceKey: 'xxLandingValueIncluded' },
    { key: 'xxLandingValueItem5', price: 0, priceKey: 'xxLandingValueIncluded' },
  ],

  // Why Us (4 items recomendado)
  whyUs: [
    { titleKey: 'xxLandingWhyTitle1', descKey: 'xxLandingWhyDesc1' },
    { titleKey: 'xxLandingWhyTitle2', descKey: 'xxLandingWhyDesc2' },
    { titleKey: 'xxLandingWhyTitle3', descKey: 'xxLandingWhyDesc3' },
    { titleKey: 'xxLandingWhyTitle4', descKey: 'xxLandingWhyDesc4' },
  ],

  // FAQs (4 items recomendado)
  faqs: [
    { id: 'obj-1', questionKey: 'xxLandingObjQ1', answerKey: 'xxLandingObjA1' },
    { id: 'obj-2', questionKey: 'xxLandingObjQ2', answerKey: 'xxLandingObjA2' },
    { id: 'obj-3', questionKey: 'xxLandingObjQ3', answerKey: 'xxLandingObjA3' },
    { id: 'obj-4', questionKey: 'xxLandingObjQ4', answerKey: 'xxLandingObjA4' },
  ],

  // Testimoniales (3 items recomendado)
  testimonials: [
    { id: 1, name: 'Nombre A.', quote: 'xxLandingTestimonial1' },
    { id: 2, name: 'Nombre B.', quote: 'xxLandingTestimonial2' },
    { id: 3, name: 'Nombre C.', quote: 'xxLandingTestimonial3' },
  ],

  // Horarios
  schedule: [
    {
      id: '1',
      dayKey: 'monday',
      time: '20:00 - 21:00',
      levelKey: 'beginnerLevel',
      className: 'CAMBIAR',
      teacher: 'Profesor/a',
    },
  ],

  // Estadísticas
  stats: {
    years: 8,
    activeStudents: 1500,
    satisfiedStudents: 15000,
  },

  // Countdown
  countdown: {
    baseDate: '2025-01-06T23:59:59',
    intervalDays: 14,
  },

  // Video (Bunny.net) - Opcional
  // Para obtener estos datos:
  // 1. Sube el video a Bunny Stream (dash.bunny.net)
  // 2. Copia el Video ID (GUID) y Library ID
  // 3. Para thumbnail: copia la URL desde el dashboard de Bunny
  // video: {
  //   bunnyVideoId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  //   bunnyLibraryId: '123456',
  //   aspectRatio: '9:16', // '16:9' horizontal, '9:16' reel/vertical, '1:1' cuadrado
  //   autoplay: true, // true = carga video directo, false = muestra thumbnail primero
  //   thumbnailUrl: 'https://vz-XXXXX.b-cdn.net/{videoId}/thumbnail.jpg', // opcional
  // },

  // =========================================================================
  // BOOKING WIDGET (High Conversion Flow)
  // =========================================================================
  // Flujo directo a reservas: Modal CTA → Widget con filtros pre-aplicados
  // Filtros disponibles: 'afro', 'twerk', 'dancehall', 'hiphop', 'bachata', 'salsa', etc.
  // Ver todos los filtros en: components/booking/constants/bookingOptions.ts
  bookingWidget: {
    styleFilter: 'CAMBIAR', // Filtro de estilo para el widget de reservas
  },
});
