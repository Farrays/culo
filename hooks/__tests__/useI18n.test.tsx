import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useI18n } from '../useI18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import type { ReactNode } from 'react';

// Wrapper component for tests
const I18nTestWrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

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

  it('provides i18n instance and t function', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nTestWrapper,
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(result.current.i18n).toBeDefined();
    expect(result.current.i18n.language).toBeDefined();
    expect(typeof result.current.t).toBe('function');
    expect(typeof result.current.i18n.changeLanguage).toBe('function');
  });

  it('translates keys correctly', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nTestWrapper,
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    const translation = result.current.t('navHome');
    expect(translation).toBeTruthy();
    expect(typeof translation).toBe('string');
  });

  it('returns key when translation is missing', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nTestWrapper,
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    const missingKey = 'nonexistent.key';
    expect(result.current.t(missingKey)).toBe(missingKey);
  });

  it('provides a supported locale', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nTestWrapper,
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    // Should be one of the supported locales
    expect(['en', 'es', 'ca', 'fr']).toContain(result.current.i18n.language);
  });

  it('changeLanguage function is available', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nTestWrapper,
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(typeof result.current.i18n.changeLanguage).toBe('function');
  });

  it('ready becomes true after translations load', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nTestWrapper,
    });

    // Eventually ready should be true
    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });
  });

  it('t function works for multiple keys', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nTestWrapper,
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    // Test multiple common translation keys
    const homeTranslation = result.current.t('navHome');
    const contactTranslation = result.current.t('navContact');

    expect(homeTranslation).toBeTruthy();
    expect(contactTranslation).toBeTruthy();
  });

  it('language is a valid string', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nTestWrapper,
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(typeof result.current.i18n.language).toBe('string');
    expect(result.current.i18n.language.length).toBe(2);
  });

  it('t returns string type', async () => {
    const { result } = renderHook(() => useI18n(), {
      wrapper: I18nTestWrapper,
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });

    expect(typeof result.current.t('navHome')).toBe('string');
    expect(typeof result.current.t('missing_key')).toBe('string');
  });
});
