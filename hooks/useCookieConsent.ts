import { useState, useEffect, useCallback, useMemo } from 'react';

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_CONSENT_VERSION = '1.0';

export interface CookiePreferences {
  essential: true; // Always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface StoredConsent {
  version: string;
  timestamp: number;
  preferences: CookiePreferences;
}

interface UseCookieConsentReturn {
  preferences: CookiePreferences | null;
  hasConsented: boolean;
  isLoading: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (preferences: Omit<CookiePreferences, 'essential'>) => void;
  resetConsent: () => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  functional: false,
};

const ALL_ACCEPTED: CookiePreferences = {
  essential: true,
  analytics: true,
  marketing: true,
  functional: true,
};

function getStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;

    const parsed: StoredConsent = JSON.parse(stored);

    // Validate version - if version changes, we need new consent
    if (parsed.version !== COOKIE_CONSENT_VERSION) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function saveConsent(preferences: CookiePreferences): void {
  if (typeof window === 'undefined') return;

  const consent: StoredConsent = {
    version: COOKIE_CONSENT_VERSION,
    timestamp: Date.now(),
    preferences,
  };

  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));

  // Dispatch custom event for other components to react
  window.dispatchEvent(
    new CustomEvent('cookieConsentChanged', {
      detail: preferences,
    })
  );
}

export function useCookieConsent(): UseCookieConsentReturn {
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setPreferences(stored.preferences);
      setShowBanner(false);
    } else {
      setPreferences(null);
      setShowBanner(true);
    }
    setIsLoading(false);
  }, []);

  const hasConsented = useMemo(() => preferences !== null, [preferences]);

  const acceptAll = useCallback(() => {
    setPreferences(ALL_ACCEPTED);
    saveConsent(ALL_ACCEPTED);
    setShowBanner(false);
  }, []);

  const rejectAll = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    saveConsent(DEFAULT_PREFERENCES);
    setShowBanner(false);
  }, []);

  const savePreferences = useCallback((prefs: Omit<CookiePreferences, 'essential'>) => {
    const fullPrefs: CookiePreferences = {
      essential: true,
      ...prefs,
    };
    setPreferences(fullPrefs);
    saveConsent(fullPrefs);
    setShowBanner(false);
  }, []);

  const resetConsent = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    }
    setPreferences(null);
    setShowBanner(true);
  }, []);

  return {
    preferences,
    hasConsented,
    isLoading,
    acceptAll,
    rejectAll,
    savePreferences,
    resetConsent,
    showBanner,
    setShowBanner,
  };
}

// Utility to check specific consent outside React components
export function hasConsentFor(category: keyof CookiePreferences): boolean {
  const stored = getStoredConsent();
  if (!stored) return false;
  return stored.preferences[category];
}

export default useCookieConsent;
