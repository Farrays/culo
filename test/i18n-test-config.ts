/**
 * i18next Configuration for Testing Environment
 * Enterprise-grade test setup for i18next integration
 *
 * This configuration:
 * - Loads translations directly from production JSON files
 * - Provides complete translation coverage automatically
 * - Matches production i18next configuration structure
 * - Enables fast test execution with real translations
 *
 * @see i18n/i18n.ts - Production configuration
 */

import i18n, { type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import fs from 'fs';
import path from 'path';

// ============================================================================
// LOAD PRODUCTION TRANSLATIONS
// ============================================================================
// Load real translations from production JSON files
// This ensures tests use the same translations as production

const loadTranslations = () => {
  const localesDir = path.join(process.cwd(), 'i18n', 'locales', 'es');

  const translations: Record<string, unknown> = {};

  // Load all translation namespaces (must match the ns array in config below)
  const namespaces = [
    'common',
    'home',
    'pages',
    'booking',
    'schedule',
    'calendar',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'test', // Test-specific translations
  ];

  for (const ns of namespaces) {
    const filePath = path.join(localesDir, `${ns}.json`);
    if (fs.existsSync(filePath)) {
      translations[ns] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  }

  return translations;
};

const mockTranslations = loadTranslations();

// ============================================================================
// i18next TEST CONFIGURATION
// ============================================================================

const testConfig: InitOptions = {
  // Use 'es' as default for tests (matches production and test expectations)
  lng: 'es',
  fallbackLng: 'es',
  supportedLngs: ['es', 'ca', 'en', 'fr'],

  // Namespace configuration matching production
  defaultNS: 'common',
  ns: [
    'common',
    'home',
    'pages',
    'booking',
    'schedule',
    'calendar',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'test',
  ],

  // Fallback to search in all namespaces if key not found
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
    'test',
  ],

  // Load resources synchronously (critical for tests)
  resources: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    en: mockTranslations as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    es: mockTranslations as any, // Use same translations for all languages in tests
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ca: mockTranslations as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fr: mockTranslations as any,
  },

  // React integration
  react: {
    useSuspense: false, // Disable suspense for synchronous tests
  },

  // Interpolation
  interpolation: {
    escapeValue: false, // React already escapes
  },

  // Testing-specific settings
  debug: false, // Set to true to debug i18n issues in tests
  initImmediate: false, // Load synchronously for tests

  // Return key as fallback (helps identify missing translations in tests)
  returnEmptyString: false,
  returnNull: false,
};

i18n.use(initReactI18next).init(testConfig);

export default i18n;
