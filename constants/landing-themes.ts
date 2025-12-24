/**
 * =============================================================================
 * LANDING PAGE THEMES
 * =============================================================================
 *
 * Temas predefinidos para las landing pages.
 * Cada tema incluye todas las clases Tailwind necesarias.
 *
 * IMPORTANTE: Tailwind necesita ver las clases completas en el código
 * para generarlas. Por eso usamos clases completas en lugar de
 * interpolación de strings como `bg-${color}-500`.
 */

export interface LandingThemeClasses {
  // Background colors
  bgPrimary: string;
  bgPrimaryHover: string;
  bgPrimaryLight: string;
  bgPrimaryDark: string;
  bgAccentLight: string;

  // Text colors
  textPrimary: string;
  textPrimaryLight: string;

  // Border colors
  borderPrimary: string;
  borderPrimaryLight: string;
  borderPrimaryHover: string;

  // Shadow colors
  shadowPrimary: string;

  // Gradient
  gradient: string;
  modalGlow: string;

  // Ring colors (focus states)
  ringPrimary: string;
}

// =============================================================================
// TEMA: ROSE (Dancehall, Twerk, Sexy Style)
// =============================================================================

export const THEME_ROSE: LandingThemeClasses = {
  bgPrimary: 'bg-rose-600',
  bgPrimaryHover: 'hover:bg-rose-500',
  bgPrimaryLight: 'bg-rose-500/20',
  bgPrimaryDark: 'bg-rose-900/20',
  bgAccentLight: 'bg-pink-900/20',

  textPrimary: 'text-rose-400',
  textPrimaryLight: 'text-rose-300',

  borderPrimary: 'border-rose-500/30',
  borderPrimaryLight: 'border-rose-500/20',
  borderPrimaryHover: 'hover:border-rose-500/40',

  shadowPrimary: 'shadow-rose-500/50',

  gradient: 'from-rose-900/40 via-black to-pink-900/30',
  modalGlow: 'from-rose-600 via-pink-500 to-rose-600',

  ringPrimary: 'focus:ring-rose-500/20',
};

// =============================================================================
// TEMA: EMERALD (Salsa, Bachata, Caribeño)
// =============================================================================

export const THEME_EMERALD: LandingThemeClasses = {
  bgPrimary: 'bg-emerald-600',
  bgPrimaryHover: 'hover:bg-emerald-500',
  bgPrimaryLight: 'bg-emerald-500/20',
  bgPrimaryDark: 'bg-emerald-900/20',
  bgAccentLight: 'bg-teal-900/20',

  textPrimary: 'text-emerald-400',
  textPrimaryLight: 'text-emerald-300',

  borderPrimary: 'border-emerald-500/30',
  borderPrimaryLight: 'border-emerald-500/20',
  borderPrimaryHover: 'hover:border-emerald-500/40',

  shadowPrimary: 'shadow-emerald-500/50',

  gradient: 'from-emerald-900/40 via-black to-teal-900/30',
  modalGlow: 'from-emerald-600 via-teal-500 to-emerald-600',

  ringPrimary: 'focus:ring-emerald-500/20',
};

// =============================================================================
// TEMA: AMBER (Hip-Hop, Afrobeats, Reggaeton)
// =============================================================================

export const THEME_AMBER: LandingThemeClasses = {
  bgPrimary: 'bg-amber-600',
  bgPrimaryHover: 'hover:bg-amber-500',
  bgPrimaryLight: 'bg-amber-500/20',
  bgPrimaryDark: 'bg-amber-900/20',
  bgAccentLight: 'bg-orange-900/20',

  textPrimary: 'text-amber-400',
  textPrimaryLight: 'text-amber-300',

  borderPrimary: 'border-amber-500/30',
  borderPrimaryLight: 'border-amber-500/20',
  borderPrimaryHover: 'hover:border-amber-500/40',

  shadowPrimary: 'shadow-amber-500/50',

  gradient: 'from-amber-900/40 via-black to-orange-900/30',
  modalGlow: 'from-amber-600 via-orange-500 to-amber-600',

  ringPrimary: 'focus:ring-amber-500/20',
};

// =============================================================================
// TEMA: VIOLET (Heels, Lady Style, Modern Jazz)
// =============================================================================

export const THEME_VIOLET: LandingThemeClasses = {
  bgPrimary: 'bg-violet-600',
  bgPrimaryHover: 'hover:bg-violet-500',
  bgPrimaryLight: 'bg-violet-500/20',
  bgPrimaryDark: 'bg-violet-900/20',
  bgAccentLight: 'bg-purple-900/20',

  textPrimary: 'text-violet-400',
  textPrimaryLight: 'text-violet-300',

  borderPrimary: 'border-violet-500/30',
  borderPrimaryLight: 'border-violet-500/20',
  borderPrimaryHover: 'hover:border-violet-500/40',

  shadowPrimary: 'shadow-violet-500/50',

  gradient: 'from-violet-900/40 via-black to-purple-900/30',
  modalGlow: 'from-violet-600 via-purple-500 to-violet-600',

  ringPrimary: 'focus:ring-violet-500/20',
};

// =============================================================================
// TEMA: CYAN (Contemporáneo, Lírico)
// =============================================================================

export const THEME_CYAN: LandingThemeClasses = {
  bgPrimary: 'bg-cyan-600',
  bgPrimaryHover: 'hover:bg-cyan-500',
  bgPrimaryLight: 'bg-cyan-500/20',
  bgPrimaryDark: 'bg-cyan-900/20',
  bgAccentLight: 'bg-sky-900/20',

  textPrimary: 'text-cyan-400',
  textPrimaryLight: 'text-cyan-300',

  borderPrimary: 'border-cyan-500/30',
  borderPrimaryLight: 'border-cyan-500/20',
  borderPrimaryHover: 'hover:border-cyan-500/40',

  shadowPrimary: 'shadow-cyan-500/50',

  gradient: 'from-cyan-900/40 via-black to-sky-900/30',
  modalGlow: 'from-cyan-600 via-sky-500 to-cyan-600',

  ringPrimary: 'focus:ring-cyan-500/20',
};

// =============================================================================
// TEMA: FUCHSIA (Kizomba, Sensual)
// =============================================================================

export const THEME_FUCHSIA: LandingThemeClasses = {
  bgPrimary: 'bg-fuchsia-600',
  bgPrimaryHover: 'hover:bg-fuchsia-500',
  bgPrimaryLight: 'bg-fuchsia-500/20',
  bgPrimaryDark: 'bg-fuchsia-900/20',
  bgAccentLight: 'bg-pink-900/20',

  textPrimary: 'text-fuchsia-400',
  textPrimaryLight: 'text-fuchsia-300',

  borderPrimary: 'border-fuchsia-500/30',
  borderPrimaryLight: 'border-fuchsia-500/20',
  borderPrimaryHover: 'hover:border-fuchsia-500/40',

  shadowPrimary: 'shadow-fuchsia-500/50',

  gradient: 'from-fuchsia-900/40 via-black to-pink-900/30',
  modalGlow: 'from-fuchsia-600 via-pink-500 to-fuchsia-600',

  ringPrimary: 'focus:ring-fuchsia-500/20',
};

// =============================================================================
// MAPA DE TEMAS
// =============================================================================

export const LANDING_THEMES = {
  rose: THEME_ROSE,
  emerald: THEME_EMERALD,
  amber: THEME_AMBER,
  violet: THEME_VIOLET,
  cyan: THEME_CYAN,
  fuchsia: THEME_FUCHSIA,
} as const;

export type ThemeName = keyof typeof LANDING_THEMES;

/**
 * Obtiene las clases de un tema por nombre
 */
export function getTheme(themeName: ThemeName): LandingThemeClasses {
  return LANDING_THEMES[themeName];
}
