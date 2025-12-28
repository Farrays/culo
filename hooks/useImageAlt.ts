/**
 * useImageAlt Hook - Enterprise Image Alt Text System
 * ====================================================
 * Access localized alt texts for images from the central registry.
 *
 * Features:
 * - Centralized alt text management in IMAGE_ALT_TEXTS
 * - Multi-locale support (es, en, ca, fr)
 * - Development validation with console warnings
 * - Fallback chain: locale → Spanish → path
 *
 * @example
 * ```tsx
 * const { getAlt } = useImageAlt();
 *
 * // Get alt text for current locale
 * <img alt={getAlt('classes.dancehall.hero')} />
 *
 * // Get alt text from gallery array
 * <img alt={getAlt('classes.dancehall.gallery', 0)} />
 * ```
 */

import { useCallback } from 'react';
import { useI18n } from './useI18n';
import { IMAGE_ALT_TEXTS, type Locale } from '../constants/image-alt-texts';

// Development mode detection
const isDev = import.meta.env?.DEV ?? process.env['NODE_ENV'] === 'development';

// Track missing alt texts to avoid duplicate warnings
const missingAltTexts = new Set<string>();

/**
 * Get alt text by path for a specific locale
 * @param path - Dot-notation path to alt text (e.g., "classes.dancehall.hero")
 * @param locale - Target locale
 * @param index - Optional array index for gallery images
 * @returns Alt text string
 */
export function getImageAltByPath(path: string, locale: Locale, index?: number): string {
  const parts = path.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = IMAGE_ALT_TEXTS;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Path not found - log detailed warning in development
      if (isDev && !missingAltTexts.has(path)) {
        missingAltTexts.add(path);
        console.warn(
          `%c[useImageAlt] Missing alt text: "${path}"`,
          'color: #ff6b6b; font-weight: bold;',
          '\n→ Add this key to constants/image-alt-texts.ts',
          `\n→ Path parts: ${JSON.stringify(parts)}`,
          `\n→ Failed at: "${part}"`
        );
      }
      return path;
    }
  }

  // If it's an array (gallery), use the index
  if (Array.isArray(current)) {
    if (index !== undefined && current[index]) {
      current = current[index];
    } else {
      console.warn(`[useImageAlt] Array index ${index} not found for: ${path}`);
      return path;
    }
  }

  // Extract the alt for the locale
  if (current && typeof current === 'object') {
    // Direct locale key
    if (locale in current) {
      return current[locale] as string;
    }
    // Fallback to Spanish
    if ('es' in current) {
      return current.es as string;
    }
  }

  // If it's already a string, return it
  if (typeof current === 'string') {
    return current;
  }

  // Log missing locale in development
  if (isDev && !missingAltTexts.has(`${path}:${locale}`)) {
    missingAltTexts.add(`${path}:${locale}`);
    console.warn(
      `%c[useImageAlt] Missing locale "${locale}" for: "${path}"`,
      'color: #ffa500; font-weight: bold;',
      '\n→ Add this locale to constants/image-alt-texts.ts'
    );
  }
  return path;
}

/**
 * Validates that all required alt texts exist for all locales
 * Call this in development to catch missing translations
 */
export function validateAltTexts(requiredPaths: string[]): void {
  if (!isDev) return;

  const locales: Locale[] = ['es', 'en', 'ca', 'fr'];
  const missing: string[] = [];

  for (const path of requiredPaths) {
    for (const locale of locales) {
      const result = getImageAltByPath(path, locale);
      if (result === path) {
        missing.push(`${path} [${locale}]`);
      }
    }
  }

  if (missing.length > 0) {
    console.error(
      '%c[useImageAlt] Missing alt texts detected:',
      'color: #ff0000; font-weight: bold; font-size: 14px;',
      '\n' + missing.map(m => `  ❌ ${m}`).join('\n'),
      '\n\n→ Add these to constants/image-alt-texts.ts'
    );
  } else {
    // Validation passed - no logging needed in production
  }
}

interface UseImageAltReturn {
  getAlt: (path: string, index?: number) => string;
  getAltForLocale: (path: string, targetLocale: Locale, index?: number) => string;
  hasAlt: (path: string) => boolean;
  locale: Locale;
}

/**
 * Hook for accessing localized image alt texts
 */
export function useImageAlt(): UseImageAltReturn {
  const { locale } = useI18n();

  /**
   * Get alt text for the current locale
   * @param path - Dot-notation path to alt text
   * @param index - Optional array index for gallery images
   */
  const getAlt = useCallback(
    (path: string, index?: number): string => {
      return getImageAltByPath(path, locale as Locale, index);
    },
    [locale]
  );

  /**
   * Get alt text for a specific locale
   */
  const getAltForLocale = useCallback(
    (path: string, targetLocale: Locale, index?: number): string => {
      return getImageAltByPath(path, targetLocale, index);
    },
    []
  );

  /**
   * Check if an alt text exists for the given path
   */
  const hasAlt = useCallback((path: string): boolean => {
    const result = getImageAltByPath(path, 'es');
    return result !== path;
  }, []);

  return {
    getAlt,
    getAltForLocale,
    hasAlt,
    locale: locale as Locale,
  };
}

export default useImageAlt;
