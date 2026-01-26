/**
 * i18next Configuration - Namespace Lazy Loading Strategy (Phase 2)
 *
 * Bundle Size Impact:
 * - Before: ~1.5MB (all 11 namespaces loaded)
 * - After: ~50KB initial load (common only)
 * - Savings: -97%
 *
 * Namespace Strategy:
 * - INITIAL (common): Always loaded - Nav, footer, shared UI (~16KB)
 * - LAZY: All others loaded on-demand per route via preloadNamespaces()
 *   - home, classes: HomePage
 *   - booking, schedule, calendar: BookingPage
 *   - blog: BlogPage
 *   - faq: FAQPage
 *   - about: AboutPage
 *   - contact: ContactPage
 *   - pages: Landing pages (~1.16MB - loaded only when needed)
 *
 * Language Detection Priority:
 * 1. localStorage (key: fidc_preferred_locale)
 * 2. cookie (key: fidc_locale)
 * 3. Browser language
 * 4. Fallback: 'es'
 *
 * Reference: docs/OPTIMIZATION_ROADMAP.md (Phase 2: Namespace Lazy Loading)
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
    // Fallback to search in all namespaces if key not found in default
    fallbackNS: [
      'home',
      'pages',
      'classes',
      'booking',
      'schedule',
      'calendar',
      'blog',
      'faq',
      'about',
      'contact',
    ],
    // Phase 2: Lazy loading - only load 'common' initially, others loaded on demand per route
    // This reduces initial bundle from ~1.5MB to ~50KB
    ns: ['common'],

    // React integration
    react: {
      useSuspense: false, // Disabled for synchronous component rendering
    },

    // Interpolation
    interpolation: {
      escapeValue: false, // React already escapes
    },

    // Development
    debug: false, // Set to true for debugging

    // Detection
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      lookupLocalStorage: 'fidc_preferred_locale',
      lookupCookie: 'fidc_locale',
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
