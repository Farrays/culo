/**
 * Style Images Configuration - Enterprise-level image mapping
 * ============================================================
 *
 * Centralized configuration for dance style images used across:
 * - DanceClassesPage (Featured Styles grid)
 * - DanzasUrbanasBarcelonaPage (Urban Styles grid)
 * - DanzaBarcelonaPage (Contemporary Styles grid)
 * - Related Classes cards
 *
 * Each style maps to:
 * - basePath: Path without size/format suffix (for OptimizedImage srcset)
 * - altKey: i18n key for alt text
 * - fallbackAlt: Fallback alt text if translation missing
 *
 * Images are processed by scripts/build-images.mjs with breakpoints:
 * - 4:5 aspect ratio: 640, 960, 1440
 * - Card display: typically 640-768px
 *
 * @example
 * ```tsx
 * import { getStyleImage, STYLE_IMAGES } from '../constants/style-images';
 *
 * // Get image config for dancehall
 * const config = getStyleImage('dancehall');
 * // => { basePath: '/images/classes/dancehall/img/dancehall-classes-barcelona-01', ... }
 *
 * // Use with OptimizedImage
 * <OptimizedImage
 *   src={config.basePath}
 *   alt={config.fallbackAlt}
 *   breakpoints={[640, 960, 1440]}
 * />
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface StyleImageConfig {
  /** Base path for image without size/format suffix */
  basePath: string;
  /** i18n key for alt text (e.g., "styleImages.dancehall.alt") */
  altKey: string;
  /** Fallback alt text if translation not found */
  fallbackAlt: string;
  /** Available breakpoints for this image */
  breakpoints: number[];
  /** Available formats */
  formats: ('avif' | 'webp' | 'jpg')[];
  /** Object position for CSS object-fit (e.g., "top", "center 30%") - useful for cropped images */
  objectPosition?: string;
}

export interface CategoryFallbackConfig {
  /** Base path for category fallback image */
  basePath: string;
  /** Fallback alt text */
  fallbackAlt: string;
}

// ============================================================================
// CATEGORY FALLBACKS
// ============================================================================

/**
 * Fallback images for each category when a style doesn't have a specific image
 */
export const CATEGORY_FALLBACK_IMAGES: Record<string, CategoryFallbackConfig> = {
  urban: {
    basePath: '/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona',
    fallbackAlt: 'Danzas Urbanas Barcelona - Clases de Hip Hop y Reggaeton',
  },
  contemporary: {
    basePath: '/images/categories/img/danza',
    fallbackAlt: "Danza Contemporánea Barcelona - Clases en Farray's Center",
  },
  latin: {
    basePath: '/images/categories/img/salsa-bachata',
    fallbackAlt: "Salsa y Bachata Barcelona - Clases en Farray's Center",
  },
  fitness: {
    basePath: '/images/categories/img/fitness',
    fallbackAlt:
      "Bailarina realizando ejercicios de preparación física y acondicionamiento corporal para danza en academia de Barcelona - entrenamiento funcional en Farray's Center",
  },
};

// ============================================================================
// STYLE IMAGES CONFIGURATION
// ============================================================================

/**
 * Master mapping of style keys to their image configurations
 *
 * Style keys match the keys used in:
 * - FEATURED_STYLES (danceClassesHub.ts)
 * - urbanCategory.allStyles
 * - Related classes configurations
 */
export const STYLE_IMAGES: Record<string, StyleImageConfig> = {
  // =========================================================================
  // URBAN STYLES
  // =========================================================================

  dancehall: {
    basePath: '/images/classes/dancehall/img/dancehall-classes-barcelona-01',
    altKey: 'styleImages.dancehall.alt',
    fallbackAlt: "Clases de Dancehall en Barcelona - Aprende con profesionales en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  afrobeat: {
    basePath: '/images/classes/afrobeat/img/clases-afrobeat-barcelona',
    altKey: 'styleImages.afrobeat.alt',
    fallbackAlt: "Clases de Afrobeat en Barcelona - Ritmos africanos en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  twerk: {
    basePath: '/images/classes/twerk/img/clases-twerk-barcelona',
    altKey: 'styleImages.twerk.alt',
    fallbackAlt: "Clases de Twerk en Barcelona - Empoderamiento y fitness en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  hip_hop: {
    basePath: '/images/classes/hip-hop/img/clases-hip-hop-barcelona',
    altKey: 'styleImages.hipHop.alt',
    fallbackAlt: "Clases de Hip Hop en Barcelona - Street dance en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  hip_hop_reggaeton: {
    basePath: '/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona',
    altKey: 'styleImages.hipHopReggaeton.alt',
    fallbackAlt: "Clases de Hip Hop y Reggaetón Barcelona - Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  sexy_reggaeton: {
    basePath: '/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona',
    altKey: 'styleImages.sexyReggaeton.alt',
    fallbackAlt: "Clases de Sexy Reggaetón Barcelona - Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  reggaeton_cubano: {
    basePath: '/images/classes/reggaeton-cubano/img/mgs_8884',
    altKey: 'styleImages.reggaetonCubano.alt',
    fallbackAlt: "Clases de Reggaetón Cubano Barcelona - Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  femmology_heels: {
    basePath: '/images/classes/femmology/img/femmology-hero-barcelona',
    altKey: 'styleImages.femmology.alt',
    fallbackAlt:
      'Yunaisy Farray y su grupo de bailarinas de Femmology en pose dramática - Clases de baile en tacones Barcelona',
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  heels_barcelona: {
    basePath: '/images/classes/Heels/img/clases-heels-barcelona',
    altKey: 'styleImages.heels.alt',
    fallbackAlt:
      "Bailarina ejecutando coreografía de Heels en Barcelona - Clases de baile con tacones, técnica y sensualidad en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  sexy_style: {
    basePath: '/images/classes/sexy-style/img/clases-de-sexy-style-barcelona',
    altKey: 'styleImages.sexyStyle.alt',
    fallbackAlt: "Clases de Sexy Style Barcelona - Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  // =========================================================================
  // CONTEMPORARY / DANCE STYLES
  // =========================================================================

  ballet_clasico: {
    basePath: '/images/classes/ballet/img/clases-ballet-barcelona',
    altKey: 'styleImages.ballet.alt',
    fallbackAlt: "Clases de Ballet Clásico en Barcelona - Técnica clásica en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  danza_contemporanea: {
    basePath: '/images/classes/contemporaneo/img/mgs_5189',
    altKey: 'styleImages.contemporaneo.alt',
    fallbackAlt: "Clases de Danza Contemporánea Barcelona - Técnica profesional en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  modern_jazz: {
    basePath: '/images/classes/modern-jazz/img/clases-modern-jazz-barcelona',
    altKey: 'styleImages.modernJazz.alt',
    fallbackAlt: "Clases de Modern Jazz Barcelona - Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
    objectPosition: 'center 25%', // Focus on dancer's face - adjusted positioning
  },

  afro_contemporaneo: {
    basePath: '/images/classes/afro-contemporaneo/img/mgs_5260',
    altKey: 'styleImages.afroContemporaneo.alt',
    fallbackAlt: "Clases de Afro Contemporáneo Barcelona - Técnica cubana ENA en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  afro_jazz: {
    basePath: '/images/classes/afro-jazz/img/afro-jazz',
    altKey: 'styleImages.afroJazz.alt',
    fallbackAlt: "Clases de Afro Jazz Barcelona - Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  // =========================================================================
  // LATIN STYLES (using salsa-bachata category fallback)
  // =========================================================================

  salsa_cubana: {
    basePath: '/images/classes/salsa-cubana/img/salsa-cubana',
    altKey: 'styleImages.salsaCubana.alt',
    fallbackAlt:
      "Pareja bailando salsa cubana en Barcelona - Aprende casino, rueda y son cubano con profesores auténticos en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  bachata_sensual: {
    basePath: '/images/classes/Bachata/img/clases-bachata-sensual-barcelona-pareja',
    altKey: 'styleImages.bachata.alt',
    fallbackAlt:
      "Pareja bailando bachata sensual en clase de Barcelona - conexión, ondulaciones y técnica profesional en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  salsa_bachata: {
    basePath: '/images/categories/img/salsa-bachata',
    altKey: 'styleImages.salsaBachata.alt',
    fallbackAlt: "Clases de Salsa y Bachata Barcelona - Farray's Center",
    breakpoints: [320, 640, 768, 1024],
    formats: ['avif', 'webp', 'jpg'],
  },

  salsa_lady_style: {
    basePath: '/images/classes/Salsa-Lady-Style/img/clases-salsa-lady-style-barcelona',
    altKey: 'styleImages.salsaLadyStyle.alt',
    fallbackAlt:
      "Clases de Salsa Lady Style Barcelona - Técnica femenina y styling en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  bachata_lady_style: {
    basePath: '/images/classes/bachata-lady-style/img/clases-bachata-lady-style-barcelona',
    altKey: 'styleImages.bachataLadyStyle.alt',
    fallbackAlt:
      "Bailarina ejecutando movimientos de Bachata Lady Style en Barcelona - ondulaciones, braceo y estilo femenino en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  timba_cubana: {
    basePath: '/images/classes/timba/img/timba-cubana',
    altKey: 'styleImages.timba.alt',
    fallbackAlt:
      "Bailarina ejecutando estilo Timba Cubana en Barcelona - Clases de baile cubano con energía y sabor auténtico en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
    objectPosition: 'center 25%',
  },

  salsa_lady_timba: {
    basePath: '/images/classes/salsa-lady-timba/img/clases-salsa-lady-timba-barcelona',
    altKey: 'styleImages.salsaLadyTimba.alt',
    fallbackAlt:
      "Clases de Salsa Lady Timba Barcelona - Técnica femenina cubana con sabor a timba en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  folklore_cubano: {
    basePath: '/images/classes/folklore-cubano/img/folklore-calle-habana',
    altKey: 'styleImages.folkloreCubano.alt',
    fallbackAlt:
      "Bailarina cubana de folklore en calle de La Habana - tradición afrocubana, danzas Yoruba y Orishas en Farray's Center Barcelona",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  // =========================================================================
  // FITNESS STYLES (using fitness category fallback)
  // =========================================================================

  stretching: {
    basePath: '/images/categories/img/stretching',
    altKey: 'styleImages.stretching.alt',
    fallbackAlt:
      "Bailarina realizando estiramientos profundos y ejercicios de flexibilidad en clase de stretching profesional para bailarines en Barcelona - técnicas de elongación, apertura de caderas y backbending en Farray's Center",
    breakpoints: [320, 640, 768, 1024],
    formats: ['avif', 'webp', 'jpg'],
  },

  bum_bum: {
    basePath: '/images/classes/bum-bum/img/bum-bum-gluteos-maravillosos',
    altKey: 'styleImages.bumBum.alt',
    fallbackAlt:
      "Alumnas realizando ejercicios de glúteos Bum Bum en academia de Barcelona - tonificación con hip thrust, sentadillas y técnicas del Método Farray en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  cuerpo_fit: {
    basePath: '/images/classes/cuerpo-fit/img/cuerpo-fit-entrenamiento-bailarines',
    altKey: 'styleImages.cuerpoFit.alt',
    fallbackAlt:
      "Bailarina realizando entrenamiento funcional de Cuerpo Fit en Barcelona - cardio dance y acondicionamiento físico para bailarines en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  full_body_cardio: {
    basePath: '/images/classes/cuerpo-fit/img/cuerpo-fit-entrenamiento-bailarines',
    altKey: 'styleImages.fullBodyCardio.alt',
    fallbackAlt:
      "Entrenamiento de Cuerpo-Fit Cardio Dance en Barcelona - ejercicio cardiovascular y baile para bailarines en Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  body_conditioning: {
    basePath: '/images/categories/img/body-conditioning',
    altKey: 'styleImages.bodyConditioning.alt',
    fallbackAlt:
      "Bailarinas realizando acondicionamiento físico y preparación corporal para danza en academia de Barcelona - Farray's Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },

  // =========================================================================
  // HERO IMAGES (Page-specific hero backgrounds)
  // =========================================================================

  entrenamiento_bailarines_hero: {
    basePath: '/images/classes/entrenamiento-bailarines/img/entrenamiento-bailarines-hero',
    altKey: 'styleImages.entrenamientoBailarinesHero.alt',
    fallbackAlt:
      "Bailarinas profesionales realizando entrenamiento físico especializado para danza en Barcelona - preparación corporal, flexibilidad y fuerza en Farray's International Dance Center",
    breakpoints: [320, 640, 768, 1024, 1440, 1920],
    formats: ['avif', 'webp', 'jpg'],
  },
};

// ============================================================================
// STYLE TO CATEGORY MAPPING
// ============================================================================

/**
 * Maps style keys to their parent category for fallback purposes
 */
export const STYLE_TO_CATEGORY: Record<string, string> = {
  // Urban
  dancehall: 'urban',
  afrobeat: 'urban',
  twerk: 'urban',
  hip_hop: 'urban',
  hip_hop_reggaeton: 'urban',
  sexy_reggaeton: 'urban',
  reggaeton_cubano: 'urban',
  femmology_heels: 'urban',
  heels_barcelona: 'urban',
  sexy_style: 'urban',

  // Contemporary
  ballet_clasico: 'contemporary',
  danza_contemporanea: 'contemporary',
  modern_jazz: 'contemporary',
  afro_contemporaneo: 'contemporary',
  afro_jazz: 'contemporary',

  // Latin
  salsa_cubana: 'latin',
  bachata_sensual: 'latin',
  salsa_bachata: 'latin',
  salsa_lady_style: 'latin',
  bachata_lady_style: 'latin',
  timba_cubana: 'latin',
  salsa_lady_timba: 'latin',
  folklore_cubano: 'latin',

  // Fitness
  stretching: 'fitness',
  bum_bum: 'fitness',
  cuerpo_fit: 'fitness',
  full_body_cardio: 'fitness',
  body_conditioning: 'fitness',
  entrenamiento_bailarines_hero: 'fitness',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets the image configuration for a style with fallback to category image
 *
 * @param styleKey - The style key (e.g., 'dancehall', 'afrobeat')
 * @returns StyleImageConfig with image path and alt text
 */
export function getStyleImage(styleKey: string): StyleImageConfig {
  // Check if we have a specific image for this style
  if (STYLE_IMAGES[styleKey]) {
    return STYLE_IMAGES[styleKey];
  }

  // Fallback to category image - 'urban' always exists as default
  const category = STYLE_TO_CATEGORY[styleKey] || 'urban';
  const fallback = CATEGORY_FALLBACK_IMAGES[category] ?? CATEGORY_FALLBACK_IMAGES['urban'];
  const basePath = fallback?.basePath ?? '/images/categories/img/urbano';
  const fallbackAlt = fallback?.fallbackAlt ?? "Clases de baile en Barcelona - Farray's Center";

  return {
    basePath,
    altKey: `styleImages.${styleKey}.alt`,
    fallbackAlt,
    breakpoints: [320, 640, 768, 1024],
    formats: ['avif', 'webp', 'jpg'],
  };
}

/**
 * Gets the best available image URL for a style at a specific size
 *
 * @param styleKey - The style key
 * @param size - Desired width (will use closest available breakpoint)
 * @param format - Desired format (default: 'webp')
 * @returns Full image URL
 */
export function getStyleImageUrl(
  styleKey: string,
  size: number = 640,
  format: 'avif' | 'webp' | 'jpg' = 'webp'
): string {
  const config = getStyleImage(styleKey);

  // Find closest available breakpoint
  const closestBreakpoint = config.breakpoints.reduce((prev, curr) =>
    Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev
  );

  // Use requested format if available, otherwise fall back to jpg
  const finalFormat = config.formats.includes(format) ? format : 'jpg';

  return `${config.basePath}_${closestBreakpoint}.${finalFormat}`;
}

/**
 * Checks if a style has a specific (non-fallback) image configured
 *
 * @param styleKey - The style key to check
 * @returns true if style has a specific image
 */
export function hasSpecificImage(styleKey: string): boolean {
  return styleKey in STYLE_IMAGES;
}

/**
 * Alt text context types for contextual SEO
 * - default: Generic alt text
 * - hub: Hub de clases de baile (/clases/baile-barcelona)
 * - urban: Categoría danzas urbanas (/clases/danzas-urbanas-barcelona)
 * - danza: Categoría danza contemporánea (/clases/danza-barcelona)
 * - latin: Categoría salsa/bachata (/clases/salsa-bachata-barcelona)
 * - fitness: Categoría fitness (/clases/entrenamiento-bailarines-barcelona)
 * - hero: Hero section de página de clase individual
 */
export type AltContext = 'default' | 'hub' | 'urban' | 'danza' | 'latin' | 'fitness' | 'hero';

/**
 * Style key to camelCase mapping for alt text lookup
 */
const STYLE_KEY_TO_CAMEL: Record<string, string> = {
  hip_hop: 'hipHop',
  hip_hop_reggaeton: 'hipHopReggaeton',
  sexy_reggaeton: 'sexyReggaeton',
  reggaeton_cubano: 'reggaetonCubano',
  femmology_heels: 'femmology',
  heels_barcelona: 'heels',
  sexy_style: 'sexyStyle',
  ballet_clasico: 'ballet',
  danza_contemporanea: 'contemporaneo',
  modern_jazz: 'modernJazz',
  afro_contemporaneo: 'afroContemporaneo',
  afro_jazz: 'afroJazz',
  salsa_cubana: 'salsaCubana',
  bachata_sensual: 'bachata',
  salsa_bachata: 'salsaBachata',
  salsa_lady_style: 'salsaLadyStyle',
  bachata_lady_style: 'bachataLadyStyle',
  timba_cubana: 'timba',
  salsa_lady_timba: 'salsaLadyTimba',
  folklore_cubano: 'folkloreCubano',
  bum_bum: 'bumBum',
  cuerpo_fit: 'cuerpoFit',
  full_body_cardio: 'fullBodyCardio',
  body_conditioning: 'bodyConditioning',
  entrenamiento_bailarines_hero: 'entrenamientoBailarinesHero',
};

/**
 * Gets contextual alt key for a style based on page context
 *
 * @param styleKey - The style key (e.g., 'hip_hop')
 * @param context - The page context ('hub' for baile-barcelona, 'urban' for danzas-urbanas, etc.)
 * @returns Contextual altKey path for IMAGE_ALT_TEXTS lookup
 *
 * @example
 * getContextualAltKey('hip_hop', 'hub')    // => 'styleImages.hipHop.cardHub'
 * getContextualAltKey('hip_hop', 'urban')  // => 'styleImages.hipHop.cardUrban'
 * getContextualAltKey('hip_hop', 'default') // => 'styleImages.hipHop.alt'
 */
export function getContextualAltKey(styleKey: string, context: AltContext = 'default'): string {
  const camelKey = STYLE_KEY_TO_CAMEL[styleKey] || styleKey;

  switch (context) {
    case 'hub':
      return `styleImages.${camelKey}.cardHub`;
    case 'urban':
      return `styleImages.${camelKey}.cardUrban`;
    case 'danza':
      return `styleImages.${camelKey}.cardDanza`;
    case 'latin':
      return `styleImages.${camelKey}.cardLatin`;
    case 'fitness':
      return `styleImages.${camelKey}.cardFitness`;
    case 'hero':
      return `styleImages.${camelKey}.hero`;
    default:
      return `styleImages.${camelKey}.alt`;
  }
}

// ============================================================================
// RELATED CLASSES - SLUG TO STYLE KEY MAPPING
// ============================================================================

/**
 * Maps URL slugs used in Related Classes to their corresponding style keys
 * Used by getRelatedClassImage() to fetch images from the centralized system
 *
 * @example
 * SLUG_TO_STYLE_KEY['salsa-cubana-barcelona'] // => 'salsa_cubana'
 * SLUG_TO_STYLE_KEY['hip-hop-barcelona'] // => 'hip_hop'
 */
export const SLUG_TO_STYLE_KEY: Record<string, string> = {
  // Urban styles
  'dancehall-barcelona': 'dancehall',
  'afrobeats-barcelona': 'afrobeat',
  'twerk-barcelona': 'twerk',
  'hip-hop-barcelona': 'hip_hop',
  'hip-hop-reggaeton-barcelona': 'hip_hop_reggaeton',
  'sexy-reggaeton-barcelona': 'sexy_reggaeton',
  'reggaeton-cubano-barcelona': 'reggaeton_cubano',
  'femmology-barcelona': 'femmology_heels',
  'heels-barcelona': 'heels_barcelona',
  'sexy-style-barcelona': 'sexy_style',

  // Contemporary / Dance styles
  'ballet-barcelona': 'ballet_clasico',
  'contemporaneo-barcelona': 'danza_contemporanea',
  'modern-jazz-barcelona': 'modern_jazz',
  'afro-contemporaneo-barcelona': 'afro_contemporaneo',
  'afro-jazz-barcelona': 'afro_jazz',

  // Latin styles
  'salsa-cubana-barcelona': 'salsa_cubana',
  'bachata-barcelona': 'bachata_sensual',
  'salsa-lady-style-barcelona': 'salsa_lady_style',
  'bachata-lady-style-barcelona': 'bachata_lady_style',
  'timba-barcelona': 'timba_cubana',
  'salsa-lady-timba-barcelona': 'salsa_lady_timba',
  'folklore-cubano': 'folklore_cubano',

  // Fitness styles
  'stretching-barcelona': 'stretching',
  'ejercicios-gluteos-barcelona': 'bum_bum',
  'cuerpo-fit': 'cuerpo_fit',
  'body-conditioning-barcelona': 'body_conditioning',
  'acondicionamiento-fisico-bailarines': 'body_conditioning', // Spanish URL slug
};

/**
 * Related class image configuration for OptimizedImage component
 */
export interface RelatedClassImageConfig {
  basePath: string;
  altKey: string;
  fallbackAlt: string;
  breakpoints: number[];
  formats: ('avif' | 'webp' | 'jpg')[];
  objectPosition?: string;
}

/**
 * Gets the image configuration for a Related Class card
 * Uses the centralized STYLE_IMAGES system via slug mapping
 *
 * @param slug - The URL slug (e.g., 'salsa-cubana-barcelona')
 * @returns RelatedClassImageConfig ready for OptimizedImage component
 *
 * @example
 * const imageConfig = getRelatedClassImage('salsa-cubana-barcelona');
 * // => { basePath: '/images/classes/salsa-cubana/img/salsa-cubana', ... }
 */
export function getRelatedClassImage(slug: string): RelatedClassImageConfig {
  const styleKey = SLUG_TO_STYLE_KEY[slug];

  if (styleKey && STYLE_IMAGES[styleKey]) {
    const config = STYLE_IMAGES[styleKey];
    return {
      basePath: config.basePath,
      altKey: config.altKey,
      fallbackAlt: config.fallbackAlt,
      breakpoints: config.breakpoints,
      formats: config.formats,
      objectPosition: config.objectPosition,
    };
  }

  // Fallback for unknown slugs - use latin category as default
  const fallback = CATEGORY_FALLBACK_IMAGES['latin'] ?? CATEGORY_FALLBACK_IMAGES['urban'];
  return {
    basePath: fallback?.basePath ?? '/images/categories/img/salsa-bachata',
    altKey: 'styleImages.salsaBachata.alt',
    fallbackAlt: fallback?.fallbackAlt ?? "Clases de baile en Barcelona - Farray's Center",
    breakpoints: [320, 640, 768, 1024],
    formats: ['avif', 'webp', 'jpg'],
  };
}

/**
 * Gets a single image URL for Related Class (for non-OptimizedImage usage)
 *
 * @param slug - The URL slug
 * @param size - Desired width (default: 640)
 * @param format - Desired format (default: 'webp')
 * @returns Image URL string
 */
export function getRelatedClassImageUrl(
  slug: string,
  size: number = 640,
  format: 'avif' | 'webp' | 'jpg' = 'webp'
): string {
  const config = getRelatedClassImage(slug);
  const closestBreakpoint = config.breakpoints.reduce((prev, curr) =>
    Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev
  );
  const finalFormat = config.formats.includes(format) ? format : 'jpg';
  return `${config.basePath}_${closestBreakpoint}.${finalFormat}`;
}

// ============================================================================
// RE-EXPORTS (types already exported above via export interface)
// ============================================================================
