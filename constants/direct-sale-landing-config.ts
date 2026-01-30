/**
 * =============================================================================
 * DIRECT SALE LANDING PAGE CONFIGURATION (Hormozi/Brunson Style)
 * =============================================================================
 *
 * Configuración para landing pages de VENTA DIRECTA de cursos.
 * A diferencia de las landings de captación de leads, estas venden directamente.
 *
 * CARACTERÍSTICAS:
 * - Sección "El Problema" (agitar el dolor)
 * - Sección "La Solución" (método paso a paso)
 * - Stack de Valor con precios visibles
 * - Garantía de satisfacción
 * - Urgencia real (plazas limitadas)
 * - CTA de compra directa (no captación de lead)
 */

import { ThemeName, getTheme, LandingThemeClasses } from './landing-themes';

// =============================================================================
// TYPES
// =============================================================================

export interface DirectSaleTheme {
  name: ThemeName;
  classes: LandingThemeClasses;
}

export interface DirectSaleImage {
  hero: string;
  showcase: string;
  heroAlt: string;
  showcaseAlt: string;
  /** Imagen opcional para la sección del método */
  method?: string;
  methodAlt?: string;
}

/** Item del problema (dolor del cliente) */
export interface ProblemItem {
  /** Clave de traducción */
  key: string;
  /** Emoji para visual */
  emoji: string;
}

/** Paso del método/solución */
export interface MethodStep {
  /** Número de semana o paso */
  step: string;
  /** Clave de traducción del título */
  titleKey: string;
  /** Clave de traducción de la descripción */
  descKey: string;
}

/** Item del stack de valor */
export interface ValueStackItem {
  /** Clave de traducción */
  key: string;
  /** Valor en euros */
  value: number;
  /** Si está incluido o es un bonus */
  included: boolean;
}

/** Testimonio con más detalles */
export interface DetailedTestimonial {
  id: number;
  name: string;
  /** Edad (opcional) */
  age?: number;
  /** Profesión (opcional) */
  profession?: string;
  /** Clave de traducción de la cita */
  quoteKey: string;
  /** URL de foto (opcional) */
  photo?: string;
  /** Resultado específico conseguido */
  resultKey?: string;
}

/** FAQ / Objeción */
export interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

/** Configuración de precios */
export interface PricingConfig {
  /** Precio normal mensual */
  normalPrice: number;
  /** Precio primer mes (oferta) */
  firstMonthPrice: number;
  /** Cuota de inscripción normal */
  enrollmentFee: number;
  /** Si la inscripción es gratis en la oferta */
  enrollmentFree: boolean;
  /** Ahorro total calculado */
  totalSavings: number;
}

/** Horario disponible con plazas */
export interface ScheduleSlot {
  id: string;
  dayKey: string;
  time: string;
  levelKey: string;
  className: string;
  teacher: string;
  /** Plazas disponibles (para urgencia) */
  spotsLeft?: number;
  /** URL de checkout en Momence */
  momenceUrl?: string;
}

export interface DirectSaleLandingConfig {
  // =========================================================================
  // IDENTIFICADORES
  // =========================================================================
  id: string;
  slug: string;
  estiloValue: string;

  // =========================================================================
  // TEMA VISUAL
  // =========================================================================
  theme: DirectSaleTheme;

  // =========================================================================
  // IMÁGENES
  // =========================================================================
  images: DirectSaleImage;

  // =========================================================================
  // CLAVES DE TRADUCCIÓN
  // =========================================================================
  translationPrefix: string;

  // =========================================================================
  // SECCIÓN HERO
  // =========================================================================
  hero: {
    /** Duración del programa (ej: "8 semanas") */
    duration: string;
    /** Bullets de beneficios rápidos */
    bullets: string[];
  };

  // =========================================================================
  // SECCIÓN PROBLEMA
  // =========================================================================
  problems: ProblemItem[];

  // =========================================================================
  // SECCIÓN MÉTODO/SOLUCIÓN
  // =========================================================================
  method: {
    /** Nombre del método */
    nameKey: string;
    /** Pasos del método */
    steps: MethodStep[];
  };

  // =========================================================================
  // VALUE STACK
  // =========================================================================
  valueStack: ValueStackItem[];

  // =========================================================================
  // PRECIOS
  // =========================================================================
  pricing: PricingConfig;

  // =========================================================================
  // GARANTÍA
  // =========================================================================
  guarantee: {
    /** Tipo: 'first-class' | 'full-refund' | 'satisfaction' */
    type: 'first-class' | 'full-refund' | 'satisfaction';
    /** Días de garantía */
    days?: number;
    /** Estadística de devoluciones (para prueba social) */
    refundStats?: string;
  };

  // =========================================================================
  // TESTIMONIOS
  // =========================================================================
  testimonials: DetailedTestimonial[];

  // =========================================================================
  // FAQS
  // =========================================================================
  faqs: FaqItem[];

  // =========================================================================
  // HORARIOS CON PLAZAS
  // =========================================================================
  schedule: ScheduleSlot[];

  // =========================================================================
  // URGENCIA
  // =========================================================================
  urgency: {
    /** Fecha límite de la oferta */
    deadline?: string;
    /** Si mostrar plazas limitadas */
    showSpotsLeft: boolean;
    /** Máximo de alumnos por grupo */
    maxStudentsPerGroup: number;
  };

  // =========================================================================
  // ESTADÍSTICAS
  // =========================================================================
  stats: {
    years: number;
    totalStudents: number;
    satisfactionRate: number;
  };

  // =========================================================================
  // LOGOS
  // =========================================================================
  logos: {
    src: string;
    alt: string;
    label: string;
  }[];

  // =========================================================================
  // VIDEO (opcional)
  // =========================================================================
  video?: {
    bunnyVideoId: string;
    bunnyLibraryId: string;
    aspectRatio?: '16:9' | '9:16' | '1:1';
    thumbnailUrl?: string;
    autoplay?: boolean;
  };

  // =========================================================================
  // CONTACTO
  // =========================================================================
  contact: {
    whatsapp: string;
    address: string;
    /** Clave de traducción para texto de respuesta */
    responseTimeKey: string;
  };
}

// =============================================================================
// HELPER FUNCTION
// =============================================================================

export function createDirectSaleConfig(
  themeName: ThemeName,
  config: Omit<DirectSaleLandingConfig, 'theme'>
): DirectSaleLandingConfig {
  return {
    ...config,
    theme: {
      name: themeName,
      classes: getTheme(themeName),
    },
  };
}
