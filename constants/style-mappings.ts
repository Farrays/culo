/**
 * Style Mappings for Momence Integration
 *
 * This file contains all mappings between:
 * - Config styleKey → Momence API style
 * - Momence style → Category
 * - Momence style → Page slug
 *
 * Used by:
 * - useScheduleSessions hook (for filtering)
 * - FullDanceClassTemplate (for dynamic schedules)
 * - /api/schedule endpoint (for normalization)
 */

// Type definitions
export type CategoryKey = 'latino' | 'urbano' | 'danza' | 'fitness' | 'heels';

export type MomenceStyle =
  | 'bachata'
  | 'salsa'
  | 'timba'
  | 'salsaladystyle'
  | 'hiphop'
  | 'dancehall'
  | 'heels'
  | 'sexystyle'
  | 'femmology'
  | 'reparto'
  | 'sexyreggaeton'
  | 'hiphopreggaeton'
  | 'twerk'
  | 'bumbum'
  | 'afro'
  | 'afrocontemporaneo'
  | 'ballet'
  | 'contemporaneo'
  | 'jazz'
  | 'girly'
  | 'stretching'
  | 'fitness'
  | 'cuerpofit'
  | 'folklore'
  | 'kpop'
  | 'commercial'
  | 'house'
  | 'breaking'
  | 'locking'
  | 'popping'
  | 'waacking'
  | 'yoga'
  | 'pilates'
  | 'otros';

/**
 * Maps config styleKey to Momence API style filter
 *
 * Usage:
 * ```ts
 * const momenceStyle = CONFIG_TO_MOMENCE_STYLE[config.styleKey];
 * const { sessions } = useScheduleSessions({ style: momenceStyle });
 * ```
 */
export const CONFIG_TO_MOMENCE_STYLE: Record<string, MomenceStyle> = {
  // Bachata variants
  bachataV3: 'bachata',
  bachataLadyStyle: 'bachata',
  bachataSensual: 'bachata',

  // Salsa variants
  salsaCubana: 'salsa',
  salsaLadyStyle: 'salsa',
  timba: 'salsa',

  // Hip Hop variants
  hipHopV2: 'hiphop',
  urbanDance: 'hiphop',

  // Dancehall
  dancehallV2: 'dancehall',

  // Heels/Sexy Style/Femmology
  sexyStyle: 'sexystyle',
  heels: 'heels',
  stiletto: 'heels',
  femmology: 'femmology',

  // Reggaeton variants
  reparto: 'reparto',
  sexyReggaeton: 'sexyreggaeton',
  hipHopReggaeton: 'hiphopreggaeton',

  // Twerk
  twerk: 'twerk',
  bumBum: 'twerk',

  // Afro styles
  afrobeat: 'afro',
  afroContemporaneo: 'afro',
  afroContemporaneoV2: 'afro',
  afroJazz: 'afro',
  afroDance: 'afro',

  // Ballet
  ballet: 'ballet',
  balletClasico: 'ballet',

  // Contemporary/Jazz
  contemporaneo: 'contemporaneo',
  modernJazz: 'jazz',
  jazz: 'jazz',

  // Girly Style
  girlyStyle: 'girly',

  // Fitness
  stretching: 'stretching',
  stretchingV2: 'stretching',
  fullBodyCardio: 'fitness',
  cuerpoFit: 'fitness',
  fitness: 'fitness',

  // Folklore
  folkloreCubano: 'folklore',

  // Other urban
  kpop: 'kpop',
  commercial: 'commercial',
  house: 'house',
  breaking: 'breaking',
  locking: 'locking',
  popping: 'popping',
  waacking: 'waacking',

  // Wellness
  yoga: 'yoga',
  pilates: 'pilates',

  // Morning classes (maps to multiple, use 'otros' or specific)
  baileMananas: 'otros',
};

/**
 * Maps Momence style to category for filtering/grouping
 */
export const STYLE_TO_CATEGORY: Record<MomenceStyle, CategoryKey> = {
  // Latino
  salsa: 'latino',
  bachata: 'latino',
  timba: 'latino',
  salsaladystyle: 'latino',
  folklore: 'latino',

  // Urbano
  dancehall: 'urbano',
  twerk: 'urbano',
  reparto: 'urbano',
  sexyreggaeton: 'urbano',
  hiphopreggaeton: 'urbano',
  hiphop: 'urbano',
  afro: 'urbano',
  girly: 'urbano',
  kpop: 'urbano',
  commercial: 'urbano',
  breaking: 'urbano',
  house: 'urbano',
  locking: 'urbano',
  popping: 'urbano',
  waacking: 'urbano',

  // Heels (Sexy Style, Femmology)
  heels: 'heels',
  sexystyle: 'heels',
  femmology: 'heels',

  // Danza
  ballet: 'danza',
  contemporaneo: 'danza',
  afrocontemporaneo: 'danza',
  jazz: 'danza',

  // Fitness
  stretching: 'fitness',
  yoga: 'fitness',
  pilates: 'fitness',
  fitness: 'fitness',
  cuerpofit: 'fitness',
  bumbum: 'fitness',

  // Default
  otros: 'urbano',
};

/**
 * Maps Momence style to page slug for linking
 *
 * Usage:
 * ```ts
 * const pageSlug = STYLE_TO_PAGE_SLUG[session.style];
 * const link = `/${locale}/clases/${pageSlug}`;
 * ```
 */
export const STYLE_TO_PAGE_SLUG: Record<MomenceStyle, string> = {
  bachata: 'bachata-barcelona',
  salsa: 'salsa-cubana-barcelona',
  timba: 'salsa-cubana-barcelona', // Grouped with salsa
  salsaladystyle: 'salsa-cubana-barcelona', // Grouped with salsa
  hiphop: 'hip-hop-barcelona',
  dancehall: 'dancehall-barcelona',
  heels: 'sexy-style-barcelona',
  sexystyle: 'sexy-style-barcelona',
  femmology: 'femmology-barcelona',
  reparto: 'sexy-reggaeton-barcelona',
  sexyreggaeton: 'sexy-reggaeton-barcelona',
  hiphopreggaeton: 'hip-hop-barcelona',
  twerk: 'twerk-barcelona',
  afro: 'afrobeat-barcelona',
  afrocontemporaneo: 'afro-contemporaneo-barcelona',
  ballet: 'ballet-clasico-barcelona',
  contemporaneo: 'contemporaneo-barcelona',
  jazz: 'modern-jazz-barcelona',
  girly: 'femmology-barcelona',
  stretching: 'stretching-barcelona',
  fitness: 'full-body-cardio-barcelona',
  cuerpofit: 'full-body-cardio-barcelona', // Grouped with fitness
  bumbum: 'full-body-cardio-barcelona', // Grouped with fitness
  folklore: 'folklore-cubano-barcelona',
  kpop: 'hip-hop-barcelona', // Grouped with hip hop
  commercial: 'hip-hop-barcelona', // Grouped with hip hop
  house: 'hip-hop-barcelona',
  breaking: 'hip-hop-barcelona',
  locking: 'hip-hop-barcelona',
  popping: 'hip-hop-barcelona',
  waacking: 'hip-hop-barcelona',
  yoga: 'stretching-barcelona',
  pilates: 'stretching-barcelona',
  otros: '',
};

/**
 * Keywords used to detect style from Momence class names
 * Used by /api/schedule.ts for normalization
 */
export const STYLE_KEYWORDS: Record<MomenceStyle, string[]> = {
  dancehall: ['dancehall', 'dance hall'],
  sexystyle: ['sexy style', 'sexy-style'],
  femmology: ['femmology', 'femme'],
  heels: ['heels', 'tacones', 'stiletto'],
  salsa: ['salsa cubana'],
  timba: ['timba', 'timba cubana'],
  salsaladystyle: ['salsa lady', 'lady style salsa', 'salsa lady timba'],
  bachata: ['bachata', 'bachata sensual', 'bachata lady'],
  hiphopreggaeton: ['hip hop reggaeton', 'hip-hop reggaeton', 'hiphop reggaeton'],
  sexyreggaeton: ['sexy reggaeton', 'sexy reggaetón'],
  reparto: ['reparto', 'reggaeton', 'reggaetón', 'perreo'],
  hiphop: ['hip hop', 'hip-hop', 'hiphop', 'urban'],
  afro: ['afrobeat', 'afrodance', 'afro jazz'],
  afrocontemporaneo: ['afro contemporáneo', 'afro contemporaneo'],
  commercial: ['commercial', 'comercial'],
  kpop: ['k-pop', 'kpop', 'k pop'],
  twerk: ['twerk', 'twerkeo'],
  bumbum: ['bum bum', 'bumbum', 'glúteos'],
  girly: ['girly'],
  breaking: ['breaking', 'breakdance', 'bboy'],
  house: ['house'],
  locking: ['locking'],
  popping: ['popping'],
  waacking: ['waacking'],
  yoga: ['yoga'],
  pilates: ['pilates'],
  stretching: ['stretching', 'estiramientos', 'flexibilidad'],
  ballet: ['ballet', 'ballet clásico'],
  contemporaneo: ['contemporáneo', 'contemporaneo', 'contemporary'],
  jazz: ['jazz', 'modern jazz'],
  folklore: ['folklore', 'folklore cubano'],
  fitness: ['fitness', 'full body', 'cardio'],
  cuerpofit: ['cuerpo fit', 'cuerpofit', 'body conditioning'],
  otros: [],
};

/**
 * Level keywords used to detect level from Momence class names
 */
export const LEVEL_KEYWORDS: Record<string, string[]> = {
  iniciacion: ['iniciación', 'iniciacion', 'principiante', 'beginner', 'intro'],
  basico: ['básico', 'basico', 'basic', 'nivel 1'],
  intermedio: ['intermedio', 'intermediate', 'nivel 2'],
  avanzado: ['avanzado', 'advanced', 'nivel 3', 'pro'],
  abierto: ['abierto', 'open', 'todos los niveles', 'all levels'],
};

/**
 * Helper function to get Momence style from config styleKey
 */
export function getMomenceStyle(styleKey: string): MomenceStyle {
  return CONFIG_TO_MOMENCE_STYLE[styleKey] || 'otros';
}

/**
 * Helper function to get category from Momence style
 */
export function getCategory(style: MomenceStyle): CategoryKey {
  return STYLE_TO_CATEGORY[style] || 'urbano';
}

/**
 * Helper function to get page slug from Momence style
 */
export function getPageSlug(style: MomenceStyle): string {
  return STYLE_TO_PAGE_SLUG[style] || '';
}

/**
 * Helper function to detect style from class name
 */
export function detectStyleFromName(name: string): MomenceStyle {
  const lowerName = name.toLowerCase();
  for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return style as MomenceStyle;
    }
  }
  return 'otros';
}

/**
 * Helper function to detect level from class name
 */
export function detectLevelFromName(name: string): string {
  const lowerName = name.toLowerCase();
  for (const [level, keywords] of Object.entries(LEVEL_KEYWORDS)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return level;
    }
  }
  return 'abierto';
}
