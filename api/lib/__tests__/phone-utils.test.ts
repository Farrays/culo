/**
 * Tests for Phone Utilities Module
 *
 * Tests phone normalization and validation for:
 * - Spanish numbers (ES)
 * - French numbers (FR)
 * - International formats
 * - E.164 format conversions
 */

import { describe, it, expect } from 'vitest';
import {
  normalizePhone,
  formatPhoneForMomence,
  formatPhoneForWhatsApp,
  formatPhoneForMeta,
  isValidPhone,
  redactPhone,
} from '../phone-utils';

describe('Phone Normalization - normalizePhone', () => {
  describe('Spanish Numbers', () => {
    it('should normalize Spanish mobile numbers (6xx)', () => {
      expect(normalizePhone('622247085')).toBe('34622247085');
      expect(normalizePhone('612345678')).toBe('34612345678');
      expect(normalizePhone('699999999')).toBe('34699999999');
    });

    it('should normalize Spanish mobile numbers (7xx)', () => {
      expect(normalizePhone('712345678')).toBe('34712345678');
    });

    it('should normalize Spanish numbers with spaces', () => {
      expect(normalizePhone('622 247 085')).toBe('34622247085');
      expect(normalizePhone('622  247  085')).toBe('34622247085');
    });

    it('should handle Spanish numbers with + prefix', () => {
      expect(normalizePhone('+34622247085')).toBe('34622247085');
      expect(normalizePhone('+34 622 247 085')).toBe('34622247085');
    });

    it('should handle Spanish numbers already with country code', () => {
      expect(normalizePhone('34622247085')).toBe('34622247085');
    });

    it('should handle numbers with parentheses and dashes', () => {
      expect(normalizePhone('+34 (622) 247-085')).toBe('34622247085');
      expect(normalizePhone('(622) 247-085')).toBe('34622247085');
    });
  });

  describe('French Numbers', () => {
    it('should normalize French mobile numbers (06xx)', () => {
      expect(normalizePhone('0612345678')).toBe('33612345678');
      expect(normalizePhone('0698765432')).toBe('33698765432');
    });

    it('should normalize French mobile numbers (07xx)', () => {
      expect(normalizePhone('0712345678')).toBe('33712345678');
    });

    it('should normalize French numbers with spaces', () => {
      expect(normalizePhone('06 12 34 56 78')).toBe('33612345678');
    });

    it('should handle French numbers with + prefix', () => {
      expect(normalizePhone('+33612345678')).toBe('33612345678');
      expect(normalizePhone('+33 6 12 34 56 78')).toBe('33612345678');
    });
  });

  describe('International Numbers', () => {
    it('should handle already formatted E.164 numbers', () => {
      expect(normalizePhone('+1234567890')).toBe('1234567890');
      expect(normalizePhone('+447911123456')).toBe('447911123456');
    });

    it('should return unknown formats as-is', () => {
      expect(normalizePhone('1234567890123')).toBe('1234567890123');
    });
  });
});

describe('Phone Formatting Functions', () => {
  describe('formatPhoneForMomence', () => {
    it('should add + prefix to normalized phone', () => {
      expect(formatPhoneForMomence('622247085')).toBe('+34622247085');
      expect(formatPhoneForMomence('+34622247085')).toBe('+34622247085');
      expect(formatPhoneForMomence('0612345678')).toBe('+33612345678');
    });
  });

  describe('formatPhoneForWhatsApp', () => {
    it('should return digits only without + prefix', () => {
      expect(formatPhoneForWhatsApp('+34 622 247 085')).toBe('34622247085');
      expect(formatPhoneForWhatsApp('622247085')).toBe('34622247085');
    });
  });

  describe('formatPhoneForMeta', () => {
    it('should return digits only for Meta CAPI', () => {
      expect(formatPhoneForMeta('+34 622 247 085')).toBe('34622247085');
      expect(formatPhoneForMeta('622247085')).toBe('34622247085');
    });
  });
});

describe('Phone Validation - isValidPhone', () => {
  it('should accept valid phone formats', () => {
    const validPhones = [
      '+34612345678',
      '612345678',
      '34612345678',
      '+33612345678',
      '0612345678',
      '+447911123456',
      '1234567890',
    ];

    for (const phone of validPhones) {
      expect(isValidPhone(phone), `Expected ${phone} to be valid`).toBe(true);
    }
  });

  it('should reject invalid phone formats', () => {
    const invalidPhones = [
      '123', // Too short (< 7 digits)
      '12345', // Too short
      'abc123', // Contains letters
      '', // Empty
      '+', // Just plus sign
    ];

    for (const phone of invalidPhones) {
      expect(isValidPhone(phone), `Expected ${phone} to be invalid`).toBe(false);
    }
  });

  it('should accept phones with special formatting', () => {
    expect(isValidPhone('+34 (622) 247-085')).toBe(true);
    expect(isValidPhone('622.247.085')).toBe(true);
  });
});

describe('Phone Redaction - redactPhone', () => {
  it('should redact phone numbers for GDPR logging', () => {
    expect(redactPhone('+34622247085')).toBe('+346***85');
    expect(redactPhone('34622247085')).toBe('3462***85');
  });

  it('should handle short phone numbers', () => {
    expect(redactPhone('12345')).toBe('***');
  });

  it('should handle null/undefined', () => {
    expect(redactPhone(null)).toBe('N/A');
    expect(redactPhone(undefined)).toBe('N/A');
  });

  it('should remove spaces before redacting', () => {
    expect(redactPhone('+34 622 247 085')).toBe('+346***85');
  });
});
