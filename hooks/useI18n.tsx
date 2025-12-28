import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
} from 'react';
import type { Locale } from '../types';
import { loadTranslations, type TranslationKeys } from '../i18n/locales';

interface I18nContextType {
  locale: Locale;
  setLocale: (_locale: Locale) => void;
  t: (_key: string) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = 'fidc_preferred_locale';
const LOCALE_COOKIE_NAME = 'fidc_locale';

// Translation cache to avoid reloading
const translationsCache: Partial<Record<Locale, TranslationKeys>> = {};

// Preload Spanish translations immediately (synchronous)
// This ensures translations are available on first render
const preloadSpanishTranslations = async () => {
  if (!translationsCache.es) {
    try {
      const translations = await loadTranslations('es');
      translationsCache.es = translations;
    } catch (error) {
      console.error('Failed to preload Spanish translations:', error);
    }
  }
};

// Start preloading immediately when module loads
preloadSpanishTranslations();

// Set cookie helper
const setCookie = (name: string, value: string, days: number = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

// Get cookie helper
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Helper to get initial locale (only call on client)
const getInitialLocale = (): Locale => {
  const supportedLocales: Locale[] = ['en', 'es', 'ca', 'fr'];

  // Try localStorage first
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
    if (stored && supportedLocales.includes(stored)) {
      return stored;
    }
  } catch {
    // localStorage not available
  }

  // Try cookie
  try {
    const cookieLocale = getCookie(LOCALE_COOKIE_NAME) as Locale | null;
    if (cookieLocale && supportedLocales.includes(cookieLocale)) {
      return cookieLocale;
    }
  } catch {
    // cookies not available
  }

  // Fallback to browser language
  try {
    const browserLang = navigator.language.split('-')[0];
    if (supportedLocales.includes(browserLang as Locale)) {
      return browserLang as Locale;
    }
  } catch {
    // navigator not available
  }

  return 'es'; // Default to Spanish
};

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with default 'es' to avoid hydration mismatch
  // The actual locale will be determined in useEffect after hydration
  const [locale, setLocaleState] = useState<Locale>('es');
  const [isHydrated, setIsHydrated] = useState(false);

  const [currentTranslations, setCurrentTranslations] = useState<TranslationKeys>(() => {
    // Initialize with cached translations if available
    return translationsCache[locale] || {};
  });
  const [isLoading, setIsLoading] = useState(() => {
    // Only loading if translations are not cached
    return !translationsCache[locale];
  });

  // After hydration, determine the correct locale from client storage
  useEffect(() => {
    if (!isHydrated) {
      setIsHydrated(true);
      const clientLocale = getInitialLocale();
      if (clientLocale !== locale) {
        setLocaleState(clientLocale);
      }
    }
  }, [isHydrated, locale]);

  // Load translations for current locale
  useEffect(() => {
    const loadLocale = async () => {
      // Check cache first - if cached, don't set loading state
      if (translationsCache[locale]) {
        const cachedTranslations = translationsCache[locale];
        if (cachedTranslations) {
          setCurrentTranslations(cachedTranslations);
          setIsLoading(false);
        }
        return;
      }

      // Only set loading if we need to fetch
      setIsLoading(true);

      try {
        // Load from module
        const translations = await loadTranslations(locale);
        translationsCache[locale] = translations;
        setCurrentTranslations(translations);
      } catch (error) {
        console.error(`Failed to load translations for locale: ${locale}`, error);
        // Fallback to Spanish on error
        if (locale !== 'es') {
          const fallback = await loadTranslations('es');
          translationsCache.es = fallback;
          setCurrentTranslations(fallback);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadLocale();
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);

    // Persist to localStorage
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);

    // Persist to cookie (for SSR/prerender)
    setCookie(LOCALE_COOKIE_NAME, newLocale);

    // Update html lang attribute
    document.documentElement.lang = newLocale;
  }, []);

  useEffect(() => {
    // Ensure html lang is set on mount
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback(
    (key: string): string => {
      const translation = currentTranslations[key];

      if (translation === undefined) {
        // Report missing key in development
        if (import.meta.env.DEV && Object.keys(currentTranslations).length > 0) {
          console.warn(`Missing translation key: ${key} for locale: ${locale}`);
        }
        return key;
      }

      return translation;
    },
    [currentTranslations, locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
