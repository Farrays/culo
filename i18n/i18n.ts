/**
 * i18next Configuration - Namespace Splitting Strategy
 *
 * Bundle Size Impact:
 * - Before: 370KB (all translations loaded)
 * - After: ~100KB initial load (common + eager namespaces)
 * - Savings: -73% (-270KB)
 *
 * Namespace Strategy:
 * - CORE (common): Always loaded - Nav, footer, SEO (~50KB)
 * - EAGER (booking, schedule, calendar): Loaded with core - Dynamic keys (~50KB)
 * - LAZY: Loaded on demand per route (~10-20KB each)
 *
 * Language Detection Priority:
 * 1. localStorage (key: fidc_preferred_locale)
 * 2. cookie (key: fidc_locale)
 * 3. Browser language
 * 4. Fallback: 'es'
 *
 * Reference: docs/OPTIMIZATION_ROADMAP.md (Fase 1: Migración a i18next)
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';

// Custom language detection configuration matching existing behavior
const languageDetector = new LanguageDetector();
languageDetector.init({
  // Detection order: localStorage -> cookie -> browser language
  order: ['localStorage', 'cookie', 'navigator'],

  // Keys for detection
  lookupLocalStorage: 'fidc_preferred_locale',
  lookupCookie: 'fidc_locale',

  // Cookie configuration
  caches: ['localStorage', 'cookie'],
  cookieOptions: {
    path: '/',
    sameSite: 'lax',
    maxAge: 365 * 24 * 60 * 60, // 1 year
  },
});

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)
    )
  )
  .init({
    // Language settings
    fallbackLng: 'es',
    supportedLngs: ['es', 'ca', 'en', 'fr'],

    // Namespace configuration
    defaultNS: 'common',
    // Phase 3: LAZY LOADING ENABLED ✅
    // CORE + EAGER namespaces loaded on init, rest loaded on-demand
    ns: ['common', 'booking', 'schedule', 'calendar'], // ~100KB initial load
    // LAZY namespaces (loaded on-demand): home, classes, blog, faq, about, contact, pages

    // React integration
    react: {
      useSuspense: true, // Re-enabled for proper async loading
    },

    // Interpolation
    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Development
    debug: false, // Set to true for debugging

    // Performance
    load: 'currentOnly', // Only load current language (not fallback)
    preload: [], // Don't preload any languages (load on demand)

    // Detection
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      lookupLocalStorage: 'fidc_preferred_locale',
      lookupCookie: 'fidc_locale',
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
