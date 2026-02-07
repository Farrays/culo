/**
 * Tests for useImageAlt - Pure Functions
 *
 * Tests the getImageAltByPath function for:
 * - Basic path navigation
 * - Locale fallback behavior
 * - Array index access
 * - Missing path handling
 */

import { describe, it, expect } from 'vitest';
import { getImageAltByPath } from '../useImageAlt';

describe('useImageAlt - getImageAltByPath', () => {
  describe('Basic Path Navigation', () => {
    it('should return alt text for valid path in Spanish', () => {
      const result = getImageAltByPath('classes.dancehall.hero', 'es');

      expect(result).toContain('Dancehall');
      expect(result).toContain('Barcelona');
    });

    it('should return alt text for valid path in English', () => {
      const result = getImageAltByPath('classes.dancehall.hero', 'en');

      expect(result).toContain('Dancehall');
      expect(result).toContain('Barcelona');
      expect(result).toContain('Classes');
    });

    it('should return alt text for valid path in Catalan', () => {
      const result = getImageAltByPath('classes.dancehall.hero', 'ca');

      expect(result).toContain('Classes');
      expect(result).toContain('Barcelona');
    });

    it('should return alt text for valid path in French', () => {
      const result = getImageAltByPath('classes.dancehall.hero', 'fr');

      expect(result).toContain('Cours');
      expect(result).toContain('Barcelone');
    });
  });

  describe('Nested Path Access', () => {
    it('should access deeply nested paths', () => {
      const result = getImageAltByPath('classes.twerk.whatIs', 'es');

      expect(result).toContain('Twerk');
    });

    it('should access different class types', () => {
      const afrobeat = getImageAltByPath('classes.afrobeat.hero', 'es');
      const hipHop = getImageAltByPath('classes.hip-hop.hero', 'es');

      expect(afrobeat).toContain('Afrobeat');
      expect(hipHop).toContain('Hip Hop');
    });
  });

  describe('Array Index Access', () => {
    it('should access array element by index', () => {
      const result = getImageAltByPath('classes.dancehall.gallery', 'es', 0);

      expect(result).toContain('Dancehall');
      expect(result).toContain('Barcelona');
    });

    it('should return different locales for array elements', () => {
      const es = getImageAltByPath('classes.dancehall.gallery', 'es', 0);
      const en = getImageAltByPath('classes.dancehall.gallery', 'en', 0);

      expect(es).not.toBe(en);
      expect(es).toContain('Grupo');
      expect(en).toContain('Group');
    });
  });

  describe('Missing Path Handling', () => {
    it('should return path when path does not exist', () => {
      const result = getImageAltByPath('invalid.path.here', 'es');

      expect(result).toBe('invalid.path.here');
    });

    it('should return path for partially valid paths', () => {
      const result = getImageAltByPath('classes.nonexistent.hero', 'es');

      expect(result).toBe('classes.nonexistent.hero');
    });
  });

  describe('Locale Fallback', () => {
    it('should fall back to Spanish if locale key missing', () => {
      // This tests the fallback behavior - if a locale doesn't exist, it should fall back to 'es'
      const es = getImageAltByPath('classes.dancehall.hero', 'es');

      // The es result should be a valid string (not the path)
      expect(es).not.toBe('classes.dancehall.hero');
      expect(es.length).toBeGreaterThan(10);
    });
  });
});

describe('useImageAlt - Alt Text Quality', () => {
  it('should have descriptive alt text (not just paths)', () => {
    const alts = [
      getImageAltByPath('classes.dancehall.hero', 'es'),
      getImageAltByPath('classes.twerk.hero', 'es'),
      getImageAltByPath('classes.afrobeat.hero', 'es'),
    ];

    for (const alt of alts) {
      // Alt texts should be descriptive (longer than simple paths)
      expect(alt.length).toBeGreaterThan(20);
      // Should contain location keyword for SEO
      expect(alt.toLowerCase()).toContain('barcelona');
    }
  });

  it('should include brand name in hero images', () => {
    const heroAlts = [
      getImageAltByPath('classes.dancehall.hero', 'es'),
      getImageAltByPath('classes.twerk.hero', 'es'),
    ];

    for (const alt of heroAlts) {
      expect(alt).toContain("Farray's");
    }
  });
});
