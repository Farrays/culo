import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LEAD_VALUES, getUTMParams, getStoredUTMParams } from '../analytics';

// Mock useCookieConsent
vi.mock('../../hooks/useCookieConsent', () => ({
  hasConsentFor: vi.fn(() => false),
}));

describe('analytics', () => {
  describe('LEAD_VALUES', () => {
    it('has correct values for each lead type', () => {
      expect(LEAD_VALUES.EXIT_INTENT).toBe(15);
      expect(LEAD_VALUES.CONTACT_FORM).toBe(20);
      expect(LEAD_VALUES.GENERIC_LEAD).toBe(15);
      expect(LEAD_VALUES.TRIAL_CLASS).toBe(25);
      expect(LEAD_VALUES.MEMBERSHIP).toBe(100);
    });

    it('is a readonly object', () => {
      expect(Object.isFrozen(LEAD_VALUES)).toBe(true);
    });

    it('has all expected keys', () => {
      const expectedKeys = [
        'EXIT_INTENT',
        'CONTACT_FORM',
        'GENERIC_LEAD',
        'TRIAL_CLASS',
        'MEMBERSHIP',
      ];
      expect(Object.keys(LEAD_VALUES)).toEqual(expectedKeys);
    });
  });

  describe('getUTMParams', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      sessionStorage.clear();
      // Mock window.location
      Object.defineProperty(window, 'location', {
        value: {
          ...originalLocation,
          search: '',
          href: 'https://example.com',
        },
        writable: true,
        configurable: true,
      });
    });

    afterEach(() => {
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
        configurable: true,
      });
      sessionStorage.clear();
    });

    it('returns empty object when no UTM params', () => {
      window.location.search = '';
      const result = getUTMParams();
      expect(result).toEqual({});
    });

    it('extracts utm_source parameter', () => {
      window.location.search = '?utm_source=google';
      const result = getUTMParams();
      expect(result['utm_source']).toBe('google');
    });

    it('extracts utm_medium parameter', () => {
      window.location.search = '?utm_medium=cpc';
      const result = getUTMParams();
      expect(result['utm_medium']).toBe('cpc');
    });

    it('extracts utm_campaign parameter', () => {
      window.location.search = '?utm_campaign=summer_sale';
      const result = getUTMParams();
      expect(result['utm_campaign']).toBe('summer_sale');
    });

    it('extracts utm_term parameter', () => {
      window.location.search = '?utm_term=dance+classes';
      const result = getUTMParams();
      expect(result['utm_term']).toBe('dance classes');
    });

    it('extracts utm_content parameter', () => {
      window.location.search = '?utm_content=banner_ad';
      const result = getUTMParams();
      expect(result['utm_content']).toBe('banner_ad');
    });

    it('extracts gclid parameter', () => {
      window.location.search = '?gclid=abc123';
      const result = getUTMParams();
      expect(result['gclid']).toBe('abc123');
    });

    it('extracts fbclid parameter', () => {
      window.location.search = '?fbclid=xyz789';
      const result = getUTMParams();
      expect(result['fbclid']).toBe('xyz789');
    });

    it('extracts multiple UTM params at once', () => {
      window.location.search = '?utm_source=google&utm_medium=cpc&utm_campaign=test';
      const result = getUTMParams();
      expect(result).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test',
      });
    });

    it('ignores non-UTM parameters', () => {
      window.location.search = '?utm_source=google&foo=bar&baz=qux';
      const result = getUTMParams();
      expect(result).toEqual({ utm_source: 'google' });
      expect(result).not.toHaveProperty('foo');
      expect(result).not.toHaveProperty('baz');
    });

    it('stores UTM params in sessionStorage', () => {
      window.location.search = '?utm_source=google';
      getUTMParams();
      const stored = sessionStorage.getItem('utm_params');
      expect(stored).toBe('{"utm_source":"google"}');
    });

    it('does not store empty params in sessionStorage', () => {
      window.location.search = '';
      getUTMParams();
      const stored = sessionStorage.getItem('utm_params');
      expect(stored).toBeNull();
    });
  });

  describe('getStoredUTMParams', () => {
    beforeEach(() => {
      sessionStorage.clear();
    });

    afterEach(() => {
      sessionStorage.clear();
    });

    it('returns empty object when no stored params', () => {
      const result = getStoredUTMParams();
      expect(result).toEqual({});
    });

    it('returns stored UTM params', () => {
      sessionStorage.setItem('utm_params', '{"utm_source":"facebook"}');
      const result = getStoredUTMParams();
      expect(result).toEqual({ utm_source: 'facebook' });
    });

    it('returns empty object for invalid JSON', () => {
      sessionStorage.setItem('utm_params', 'invalid json');
      const result = getStoredUTMParams();
      expect(result).toEqual({});
    });

    it('returns multiple stored params', () => {
      sessionStorage.setItem(
        'utm_params',
        '{"utm_source":"google","utm_medium":"cpc","utm_campaign":"test"}'
      );
      const result = getStoredUTMParams();
      expect(result).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'test',
      });
    });
  });
});
