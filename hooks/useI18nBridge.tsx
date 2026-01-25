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
 * Bridge hook that provides legacy useI18n API using i18next
 */
export const useI18n = (): I18nContextType => {
  // Load all namespaces to ensure backward compatibility
  // Using default namespace to avoid TypeScript type instantiation depth error
  const { t: i18nextT, i18n, ready } = useTranslation();

  // Ensure all namespaces are loaded
  const namespaces = [
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
  ];
  namespaces.forEach(ns => {
    if (!i18n.hasResourceBundle(i18n.language, ns)) {
      i18n.loadNamespaces(ns);
    }
  });

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
        // Let i18next search all loaded namespaces automatically
        let translation = i18nextT(key, { defaultValue: '__MISSING__' });

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

        // Interpolate params (i18next handles this, but keep for compatibility)
        if (params && translation) {
          return translation.replace(/\{(\w+)\}/g, (_match: string, paramName: string) => {
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
