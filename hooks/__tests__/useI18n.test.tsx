import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { I18nProvider, useI18n } from '../useI18n';

describe('useI18n', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Clear cookies
    document.cookie = 'fidc_locale=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides locale and t function', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.locale).toBeDefined();
    expect(typeof result.current.t).toBe('function');
    expect(typeof result.current.setLocale).toBe('function');
  });

  it('translates keys correctly', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const translation = result.current.t('navHome');
    expect(translation).toBeTruthy();
    expect(typeof translation).toBe('string');
  });

  it('returns key when translation is missing', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const missingKey = 'nonexistent.key';
    expect(result.current.t(missingKey)).toBe(missingKey);
  });

  it('provides a supported locale', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should be one of the supported locales
    expect(['en', 'es', 'ca', 'fr']).toContain(result.current.locale);
  });

  it('setLocale function is available', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.setLocale).toBe('function');
  });

  it('isLoading becomes false after translations load', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    // Eventually loading should be false
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('t function works for multiple keys', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Test multiple common translation keys
    const homeTranslation = result.current.t('navHome');
    const contactTranslation = result.current.t('navContact');

    expect(homeTranslation).toBeTruthy();
    expect(contactTranslation).toBeTruthy();
  });

  it('locale is a valid string', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.locale).toBe('string');
    expect(result.current.locale.length).toBe(2);
  });

  it('t returns string type', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nProvider,
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.t('navHome')).toBe('string');
    expect(typeof result.current.t('missing_key')).toBe('string');
  });
});
