import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCookieConsent, hasConsentFor } from '../useCookieConsent';

describe('useCookieConsent', () => {
  const COOKIE_CONSENT_KEY = 'cookie-consent';

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns initial state with no stored consent', async () => {
    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.preferences).toBeNull();
    expect(result.current.hasConsented).toBe(false);
  });

  it('shows banner when no consent stored', async () => {
    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.showBanner).toBe(true);
  });

  it('acceptAll saves all preferences as true', async () => {
    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.acceptAll();
    });

    expect(result.current.preferences).toEqual({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
    expect(result.current.showBanner).toBe(false);
    expect(result.current.hasConsented).toBe(true);
  });

  it('rejectAll saves only essential as true', async () => {
    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.rejectAll();
    });

    expect(result.current.preferences).toEqual({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
    expect(result.current.showBanner).toBe(false);
  });

  it('savePreferences saves custom preferences', async () => {
    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.savePreferences({
        analytics: true,
        marketing: false,
        functional: true,
      });
    });

    expect(result.current.preferences).toEqual({
      essential: true,
      analytics: true,
      marketing: false,
      functional: true,
    });
  });

  it('resetConsent clears preferences', async () => {
    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // First accept all
    act(() => {
      result.current.acceptAll();
    });

    expect(result.current.preferences).not.toBeNull();

    // Then reset
    act(() => {
      result.current.resetConsent();
    });

    expect(result.current.preferences).toBeNull();
    expect(result.current.showBanner).toBe(true);
  });

  it('setShowBanner toggles banner visibility', async () => {
    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.showBanner).toBe(true);

    act(() => {
      result.current.setShowBanner(false);
    });

    expect(result.current.showBanner).toBe(false);
  });

  it('handles invalid JSON in localStorage gracefully', async () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'invalid json');

    const { result } = renderHook(() => useCookieConsent());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.preferences).toBeNull();
    expect(result.current.showBanner).toBe(true);
  });

  it('dispatches cookieConsentChanged event on save', async () => {
    const { result } = renderHook(() => useCookieConsent());
    const eventHandler = vi.fn();
    window.addEventListener('cookieConsentChanged', eventHandler);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.acceptAll();
    });

    expect(eventHandler).toHaveBeenCalled();

    window.removeEventListener('cookieConsentChanged', eventHandler);
  });
});

describe('hasConsentFor', () => {
  const COOKIE_CONSENT_KEY = 'cookie-consent';

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('returns false when no consent stored', () => {
    expect(hasConsentFor('analytics')).toBe(false);
  });

  it('returns false when category is not consented', () => {
    const storedConsent = {
      version: '1.0',
      timestamp: Date.now(),
      preferences: {
        essential: true,
        analytics: false,
        marketing: false,
        functional: false,
      },
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(storedConsent));

    expect(hasConsentFor('analytics')).toBe(false);
    expect(hasConsentFor('marketing')).toBe(false);
  });
});
