/**
 * =============================================================================
 * OFFERS CONFIGURATION SYSTEM
 * =============================================================================
 *
 * Sistema centralizado de ofertas promocionales para las landings.
 * Permite cambiar facilmente entre diferentes promociones por temporada.
 *
 * TIPOS DE OFERTAS:
 * - 'free'      : Clase de prueba gratis (actual)
 * - 'single'    : 1 clase por 10€
 * - 'trial-pack': 3 clases por 20€ (1 estilo especifico + 2 cualquier estilo)
 * - 'comparison': Muestra ambas opciones (single + trial-pack) lado a lado
 *
 * CAMBIAR TEMPORADA:
 * Solo cambia el valor de ACTIVE_OFFER al final de este archivo.
 */

// =============================================================================
// TYPES
// =============================================================================

/** Tipo de oferta individual */
export type OfferType = 'free' | 'single' | 'trial-pack';

/** Modo de presentacion de la oferta */
export type OfferDisplayMode = 'single' | 'comparison';

/** Claves de traduccion para una oferta */
export interface OfferTranslations {
  /** Titulo de la oferta */
  titleKey: string;
  /** Descripcion breve */
  descriptionKey: string;
  /** Texto del boton CTA */
  ctaKey: string;
  /** Badge opcional (ej: "Mejor valor") */
  badgeKey?: string;
  /** Lista de beneficios */
  benefitsKeys: string[];
}

/** Oferta especial al inscribirse */
export interface EnrollmentOffer {
  /** Condicion: "si te apuntas el mismo dia" / "durante los 7 dias" */
  conditionKey: string;
  /** Descripcion del beneficio */
  benefitKey: string;
}

/** Configuracion de una oferta individual */
export interface SingleOffer {
  type: OfferType;
  /** Precio de la oferta en euros */
  price: number;
  /** Valor original (para mostrar descuento tachado) */
  originalValue: number;
  /** Numero de clases incluidas */
  classCount: number;
  /** Dias de validez (solo para trial-pack) */
  validityDays?: number;
  /** Claves de traduccion */
  translations: OfferTranslations;
  /** Oferta especial al inscribirse */
  enrollmentOffer?: EnrollmentOffer;
}

/** Configuracion de oferta comparativa (2 opciones lado a lado) */
export interface ComparisonOffer {
  displayMode: 'comparison';
  options: {
    single: SingleOffer;
    trialPack: SingleOffer;
  };
  /** Cual destacar como "recomendada" */
  recommended: 'single' | 'trialPack';
  /** Claves de traduccion del contenedor */
  translations: {
    sectionTitleKey: string;
    sectionSubtitleKey: string;
    comparisonHelpKey: string;
  };
}

/** Configuracion de oferta para una landing (puede ser simple o comparativa) */
export type LandingOffer = SingleOffer | ComparisonOffer;

// =============================================================================
// OFERTAS PREDEFINIDAS
// =============================================================================

/** Oferta: Clase gratis (actual) */
export const OFFER_FREE: SingleOffer = {
  type: 'free',
  price: 0,
  originalValue: 20,
  classCount: 1,
  translations: {
    titleKey: 'offer_free_title',
    descriptionKey: 'offer_free_description',
    ctaKey: 'offer_free_cta',
    badgeKey: 'offer_free_badge',
    benefitsKeys: [
      'offer_free_benefit1',
      'offer_free_benefit2',
      'offer_free_benefit3',
      'offer_free_benefit4',
      'offer_free_benefit5',
    ],
  },
  enrollmentOffer: {
    conditionKey: 'offer_free_enrollment_condition',
    benefitKey: 'offer_free_enrollment_benefit',
  },
};

/** Oferta: 1 clase por 10€ */
export const OFFER_SINGLE_CLASS: SingleOffer = {
  type: 'single',
  price: 10,
  originalValue: 20,
  classCount: 1,
  validityDays: 7,
  translations: {
    titleKey: 'offer_single_title',
    descriptionKey: 'offer_single_description',
    ctaKey: 'offer_single_cta',
    badgeKey: 'offer_single_badge',
    benefitsKeys: [
      'offer_single_benefit1',
      'offer_single_benefit2',
      'offer_single_benefit3',
      'offer_single_benefit4',
    ],
  },
  enrollmentOffer: {
    conditionKey: 'offer_single_enrollment_condition',
    benefitKey: 'offer_single_enrollment_benefit',
  },
};

/** Oferta: Pack 3 clases por 20€ */
export const OFFER_TRIAL_PACK: SingleOffer = {
  type: 'trial-pack',
  price: 20,
  originalValue: 60,
  classCount: 3,
  validityDays: 7,
  translations: {
    titleKey: 'offer_pack_title',
    descriptionKey: 'offer_pack_description',
    ctaKey: 'offer_pack_cta',
    badgeKey: 'offer_pack_badge',
    benefitsKeys: [
      'offer_pack_benefit1',
      'offer_pack_benefit2',
      'offer_pack_benefit3',
      'offer_pack_benefit4',
    ],
  },
  enrollmentOffer: {
    conditionKey: 'offer_pack_enrollment_condition',
    benefitKey: 'offer_pack_enrollment_benefit',
  },
};

/** Oferta comparativa: Muestra las 2 opciones lado a lado */
export const OFFER_COMPARISON: ComparisonOffer = {
  displayMode: 'comparison',
  options: {
    single: OFFER_SINGLE_CLASS,
    trialPack: OFFER_TRIAL_PACK,
  },
  recommended: 'trialPack',
  translations: {
    sectionTitleKey: 'offer_comparison_title',
    sectionSubtitleKey: 'offer_comparison_subtitle',
    comparisonHelpKey: 'offer_comparison_help',
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Verifica si es una oferta comparativa */
export function isComparisonOffer(offer: LandingOffer): offer is ComparisonOffer {
  return 'displayMode' in offer && offer.displayMode === 'comparison';
}

/** Verifica si es una oferta simple */
export function isSingleOffer(offer: LandingOffer): offer is SingleOffer {
  return !isComparisonOffer(offer);
}

/** Calcula el ahorro en porcentaje */
export function calculateSavings(offer: SingleOffer): number {
  if (offer.originalValue === 0) return 0;
  return Math.round(((offer.originalValue - offer.price) / offer.originalValue) * 100);
}

/** Obtiene la oferta para una landing especifica (con posible override) */
export function getOfferForLanding(
  _landingId: string,
  landingOverride?: LandingOffer
): LandingOffer {
  // Si hay override especifico para esta landing, usarlo
  if (landingOverride) {
    return landingOverride;
  }
  // Si no, usar la oferta activa global
  return ACTIVE_OFFER;
}

// =============================================================================
// TEMPORADA ACTIVA
// =============================================================================

/**
 * TEMPORADA ACTIVA - Cambiar esto para modificar todas las landings a la vez
 *
 * Opciones disponibles:
 * - OFFER_FREE: Clase gratis (modo actual)
 * - OFFER_SINGLE_CLASS: Solo 1 clase por 10€
 * - OFFER_TRIAL_PACK: Solo 3 clases por 20€
 * - OFFER_COMPARISON: Muestra ambas opciones lado a lado (recomendado)
 */
export const ACTIVE_OFFER: LandingOffer = OFFER_COMPARISON;
