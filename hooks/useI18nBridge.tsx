/**
 * Bridge Hook: useI18n → i18next
 *
 * Provides the legacy useI18n API using i18next under the hood.
 * This allows all existing components to work without changes during migration.
 *
 * Phase 2 Strategy:
 * - All components continue using useI18n import
 * - This hook uses i18next internally
 * - Gradually migrate components to useTranslation for namespace loading
 */

import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import type { Locale } from '../types';

interface I18nContextType {
  locale: Locale;
  setLocale: (_locale: Locale) => void;
  t: (_key: string, _params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

/**
 * Namespace mapping for automatic namespace detection
 * Maps key prefixes to namespaces for backward compatibility
 */
const NAMESPACE_MAP: Record<string, string> = {
  // Common (always loaded)
  nav: 'common',
  footer: 'common',
  seo: 'common',
  social: 'common',
  cta: 'common',
  error: 'common',
  loading: 'common',
  accessibility: 'common',

  // Booking (eager loaded)
  booking: 'booking',

  // Schedule (eager loaded)
  schedule: 'schedule',
  teacher: 'schedule',

  // Calendar (eager loaded)
  calendar: 'calendar',

  // Home (lazy)
  home: 'home',
  hero: 'home',
  stats: 'home',
  videotestimonials: 'home',

  // Classes (lazy)
  classes: 'classes',

  // Blog (lazy)
  blog: 'blog',

  // FAQ (lazy)
  faq: 'faq',

  // About (lazy)
  about: 'about',
  method: 'about',
  team: 'about',
  facilities: 'about',

  // Contact (lazy)
  contact: 'contact',

  // Pages (lazy - fallback for everything else)
};

/**
 * Detect namespace from translation key
 * @param key Translation key (e.g., 'nav.home' or 'bookingWidget.title')
 */
const detectNamespace = (key: string): string => {
  const prefix = key.split('.')[0].toLowerCase();
  return NAMESPACE_MAP[prefix] || 'pages'; // Default to pages namespace
};

/**
 * Bridge hook that provides legacy useI18n API using i18next
 */
export const useI18n = (): I18nContextType => {
  // Load all namespaces to ensure backward compatibility
  // TODO: Optimize by loading only needed namespaces per component
  const {
    t: i18nextT,
    i18n,
    ready,
  } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);

  const locale = i18n.language as Locale;

  const setLocale = useCallback(
    (newLocale: Locale) => {
      i18n.changeLanguage(newLocale);

      // Update html lang attribute (for consistency with legacy behavior)
      document.documentElement.lang = newLocale;
    },
    [i18n]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      try {
        // Detect namespace from key
        const namespace = detectNamespace(key);

        // Try translation with detected namespace
        const nsKey = `${namespace}:${key}`;
        let translation = i18nextT(nsKey, { defaultValue: '__MISSING__' });

        // If not found in detected namespace, try all namespaces
        if (translation === '__MISSING__') {
          // Try key without namespace (i18next will search all loaded namespaces)
          translation = i18nextT(key, { defaultValue: '__MISSING__' });

          // Fallback: contextual teacher specialty → canonical teacher specialty
          // Pattern: [style].teacher.[teacherId].specialty → teacher.[teacherId].specialty
          if (
            translation === '__MISSING__' &&
            key.includes('.teacher.') &&
            key.endsWith('.specialty')
          ) {
            const parts = key.split('.');
            if (parts.length >= 4) {
              const teacherId = parts[2]; // e.g., 'isabelLopez'
              const canonicalKey = `teacher.${teacherId}.specialty`;
              translation = i18nextT(canonicalKey, { defaultValue: '__MISSING__' });
            }
          }

          // If still missing, return key
          if (translation === '__MISSING__') {
            if (import.meta.env.DEV) {
              console.warn(`Missing translation key: ${key} for locale: ${locale}`);
            }
            return key;
          }
        }

        // Interpolate params (i18next handles this, but keep for compatibility)
        if (params && translation) {
          return translation.replace(/\{(\w+)\}/g, (_, paramName) => {
            const value = params[paramName];
            return value !== undefined ? String(value) : `{${paramName}}`;
          });
        }

        return translation;
      } catch (error) {
        console.error(`Translation error for key: ${key}`, error);
        return key;
      }
    },
    [i18nextT, locale]
  );

  return {
    locale,
    setLocale,
    t,
    isLoading: !ready,
  };
};
