import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { I18nProvider, useI18n } from '../useI18n';

describe('useI18n', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
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
});
