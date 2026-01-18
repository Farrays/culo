/**
 * Booking Schema Validation Tests
 * Tests for Zod-based form validation
 */

import { describe, it, expect } from 'vitest';
import {
  validateBookingForm,
  validateField,
  isValidEmail,
  isValidPhone,
  isValidName,
} from '../validation/bookingSchema';

describe('bookingSchema', () => {
  // Valid form data for reuse
  const validFormData = {
    firstName: 'Juan',
    lastName: 'García',
    email: 'juan@example.com',
    phone: '+34612345678',
    acceptsTerms: true,
    acceptsMarketing: true,
    acceptsAge: true,
    acceptsNoRefund: true,
    acceptsPrivacy: true,
    acceptsHeels: false,
    acceptsImage: false,
  };

  describe('validateBookingForm', () => {
    it('should validate a complete valid form', () => {
      const result = validateBookingForm(validFormData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.firstName).toBe('Juan');
        expect(result.data.email).toBe('juan@example.com');
      }
    });

    it('should reject form with missing required fields', () => {
      const result = validateBookingForm({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });

    it('should reject form with invalid email', () => {
      const result = validateBookingForm({
        ...validFormData,
        email: 'invalid-email',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('booking_error_email_invalid');
      }
    });

    it('should reject form with short name', () => {
      const result = validateBookingForm({
        ...validFormData,
        firstName: 'J',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('booking_error_name_min');
      }
    });

    it('should reject form with invalid phone', () => {
      const result = validateBookingForm({
        ...validFormData,
        phone: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('booking_error_phone_min');
      }
    });

    it('should reject form without required consents', () => {
      const result = validateBookingForm({
        ...validFormData,
        acceptsTerms: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('booking_error_consent_required');
      }
    });

    it('should require heels consent for heels classes', () => {
      const result = validateBookingForm(
        {
          ...validFormData,
          acceptsHeels: false,
        },
        true // requiresHeels
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toContain('booking_error_heels_consent_required');
      }
    });

    it('should accept heels consent when provided', () => {
      const result = validateBookingForm(
        {
          ...validFormData,
          acceptsHeels: true,
        },
        true // requiresHeels
      );
      expect(result.success).toBe(true);
    });

    it('should lowercase email automatically', () => {
      const result = validateBookingForm({
        ...validFormData,
        email: 'JUAN@EXAMPLE.COM',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('juan@example.com');
      }
    });

    it('should accept names with accents', () => {
      const result = validateBookingForm({
        ...validFormData,
        firstName: 'José',
        lastName: 'Martínez-Álvarez',
      });
      expect(result.success).toBe(true);
    });

    it('should accept names with apostrophes', () => {
      const result = validateBookingForm({
        ...validFormData,
        lastName: "O'Brien",
      });
      expect(result.success).toBe(true);
    });
  });

  describe('validateField', () => {
    it('should validate individual firstName field', () => {
      const result = validateField('firstName', 'Juan');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid firstName', () => {
      const result = validateField('firstName', 'J');
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe('booking_error_name_min');
      }
    });

    it('should validate individual email field', () => {
      const result = validateField('email', 'test@example.com');
      expect(result.valid).toBe(true);
    });

    it('should reject invalid email', () => {
      const result = validateField('email', 'not-an-email');
      expect(result.valid).toBe(false);
    });

    it('should validate individual phone field', () => {
      const result = validateField('phone', '+34612345678');
      expect(result.valid).toBe(true);
    });

    it('should handle unknown field gracefully', () => {
      // @ts-expect-error Testing unknown field
      const result = validateField('unknownField', 'value');
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe('booking_error_unknown_field');
      }
    });
  });

  describe('isValidEmail', () => {
    it('should accept valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
    });

    it('should reject emails exceeding max length', () => {
      const longEmail = 'a'.repeat(250) + '@b.com';
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should accept valid phone numbers', () => {
      expect(isValidPhone('+34612345678')).toBe(true);
      expect(isValidPhone('612345678')).toBe(true);
      expect(isValidPhone('+1-555-123-4567')).toBe(true);
      expect(isValidPhone('(555) 123-4567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('phone')).toBe(false);
    });

    it('should reject phones exceeding max length', () => {
      const longPhone = '1'.repeat(25);
      expect(isValidPhone(longPhone)).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should accept valid names', () => {
      expect(isValidName('Juan')).toBe(true);
      expect(isValidName('María José')).toBe(true);
      expect(isValidName('José-Luis')).toBe(true);
      expect(isValidName("O'Connor")).toBe(true);
      expect(isValidName('Àngel')).toBe(true);
      expect(isValidName('François')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('')).toBe(false);
      expect(isValidName('J')).toBe(false); // Too short
      expect(isValidName('Juan123')).toBe(false); // Contains numbers
      expect(isValidName('Juan@García')).toBe(false); // Contains special chars
    });

    it('should reject names exceeding max length', () => {
      const longName = 'A'.repeat(51);
      expect(isValidName(longName)).toBe(false);
    });
  });
});
