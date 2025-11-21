/**
 * Lazy-loaded translations
 * Each language is loaded on-demand to reduce initial bundle size
 */

import type { Locale } from '../../types';

// Type definition for translations (inferred from en.ts structure)
export type TranslationKeys = Record<string, string>;

// Lazy loading functions for each locale
export const loadTranslations = async (locale: Locale): Promise<TranslationKeys> => {
  switch (locale) {
    case 'en':
      return (await import('./en.js')).en;
    case 'es':
      return (await import('./es.js')).es;
    case 'ca':
      return (await import('./ca.js')).ca;
    case 'fr':
      return (await import('./fr.js')).fr;
    default:
      return (await import('./es.js')).es; // Default to Spanish
  }
};

// Preload function for critical locales (optional optimization)
export const preloadLocale = (locale: Locale): void => {
  loadTranslations(locale).catch(console.error);
};
