import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../test/i18n-test-config';
import { getImageAltByPath, validateAltTexts, useImageAlt } from '../useImageAlt';
import type { ReactNode } from 'react';

// Wrapper component for hook tests
const wrapper = ({ children }: { children: ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

// Mock IMAGE_ALT_TEXTS
vi.mock('../../constants/image-alt-texts', () => ({
  IMAGE_ALT_TEXTS: {
    classes: {
      dancehall: {
        hero: {
          es: 'Clase de dancehall en acción',
          en: 'Dancehall class in action',
          ca: 'Classe de dancehall en acció',
          fr: 'Cours de dancehall en action',
        },
        gallery: [
          {
            es: 'Estudiantes bailando',
            en: 'Students dancing',
          },
          {
            es: 'Profesora enseñando',
            en: 'Teacher instructing',
          },
        ],
      },
    },
    home: {
      banner: {
        es: 'Banner principal',
        en: 'Main banner',
      },
    },
    stringValue: 'Direct string value',
  },
}));

describe('getImageAltByPath', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns alt text for valid path and locale', () => {
    const result = getImageAltByPath('classes.dancehall.hero', 'es');
    expect(result).toBe('Clase de dancehall en acción');
  });

  it('returns alt text for different locales', () => {
    expect(getImageAltByPath('classes.dancehall.hero', 'en')).toBe('Dancehall class in action');
    expect(getImageAltByPath('classes.dancehall.hero', 'ca')).toBe('Classe de dancehall en acció');
    expect(getImageAltByPath('classes.dancehall.hero', 'fr')).toBe('Cours de dancehall en action');
  });

  it('returns Spanish fallback when locale not found', () => {
    const result = getImageAltByPath('home.banner', 'fr');
    expect(result).toBe('Banner principal');
  });

  it('returns path when path not found', () => {
    const result = getImageAltByPath('nonexistent.path', 'es');
    expect(result).toBe('nonexistent.path');
  });

  it('handles array index for gallery images', () => {
    expect(getImageAltByPath('classes.dancehall.gallery', 'es', 0)).toBe('Estudiantes bailando');
    expect(getImageAltByPath('classes.dancehall.gallery', 'es', 1)).toBe('Profesora enseñando');
  });

  it('returns path when array index not found', () => {
    const result = getImageAltByPath('classes.dancehall.gallery', 'es', 99);
    expect(result).toBe('classes.dancehall.gallery');
  });

  it('handles direct string values', () => {
    const result = getImageAltByPath('stringValue', 'es');
    expect(result).toBe('Direct string value');
  });
});

describe('validateAltTexts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('is a function', () => {
    expect(typeof validateAltTexts).toBe('function');
  });

  it('accepts array of paths', () => {
    // Should not throw
    expect(() => validateAltTexts(['classes.dancehall.hero'])).not.toThrow();
  });

  it('handles empty array', () => {
    expect(() => validateAltTexts([])).not.toThrow();
  });
});

describe('useImageAlt', () => {
  it('returns getAlt function', () => {
    const { result } = renderHook(() => useImageAlt(), { wrapper });
    expect(typeof result.current.getAlt).toBe('function');
  });

  it('returns getAltForLocale function', () => {
    const { result } = renderHook(() => useImageAlt(), { wrapper });
    expect(typeof result.current.getAltForLocale).toBe('function');
  });

  it('returns hasAlt function', () => {
    const { result } = renderHook(() => useImageAlt(), { wrapper });
    expect(typeof result.current.hasAlt).toBe('function');
  });

  it('returns current locale', () => {
    const { result } = renderHook(() => useImageAlt(), { wrapper });
    expect(result.current.locale).toBe('es');
  });

  it('getAlt returns correct alt text', () => {
    const { result } = renderHook(() => useImageAlt(), { wrapper });
    const alt = result.current.getAlt('classes.dancehall.hero');
    expect(alt).toBe('Clase de dancehall en acción');
  });

  it('getAltForLocale returns alt for specified locale', () => {
    const { result } = renderHook(() => useImageAlt(), { wrapper });
    const alt = result.current.getAltForLocale('classes.dancehall.hero', 'en');
    expect(alt).toBe('Dancehall class in action');
  });

  it('hasAlt returns true for existing paths', () => {
    const { result } = renderHook(() => useImageAlt(), { wrapper });
    expect(result.current.hasAlt('classes.dancehall.hero')).toBe(true);
  });

  it('hasAlt returns false for non-existing paths', () => {
    const { result } = renderHook(() => useImageAlt(), { wrapper });
    expect(result.current.hasAlt('nonexistent.path')).toBe(false);
  });

  it('getAlt handles gallery images with index', () => {
    const { result } = renderHook(() => useImageAlt(), { wrapper });
    const alt = result.current.getAlt('classes.dancehall.gallery', 0);
    expect(alt).toBe('Estudiantes bailando');
  });
});
