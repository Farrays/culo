/**
 * Tests for PII Redaction Module
 *
 * Tests GDPR-compliant redaction of:
 * - Email addresses
 * - Phone numbers
 * - Names
 * - Booking data objects
 */

import { describe, it, expect } from 'vitest';
import { redactEmail, redactPhone, redactName, safeBookingLog } from '../redact';

describe('Email Redaction - redactEmail', () => {
  it('should redact email showing first 3 chars + domain', () => {
    expect(redactEmail('john.doe@example.com')).toBe('joh***@example.com');
    expect(redactEmail('user@test.org')).toBe('use***@test.org');
    expect(redactEmail('longusername@domain.com')).toBe('lon***@domain.com');
  });

  it('should handle short local parts', () => {
    expect(redactEmail('ab@test.org')).toBe('***@test.org');
    expect(redactEmail('a@test.org')).toBe('***@test.org');
    expect(redactEmail('abc@test.org')).toBe('***@test.org');
  });

  it('should handle null/undefined', () => {
    expect(redactEmail(null)).toBe('N/A');
    expect(redactEmail(undefined)).toBe('N/A');
  });

  it('should handle invalid emails gracefully', () => {
    expect(redactEmail('invalid')).toBe('***@invalid');
    expect(redactEmail('')).toBe('N/A');
  });
});

describe('Phone Redaction - redactPhone', () => {
  it('should redact phone showing first 4 and last 2 chars', () => {
    expect(redactPhone('+34622247085')).toBe('+346***85');
    expect(redactPhone('34622247085')).toBe('3462***85');
  });

  it('should handle short phone numbers', () => {
    expect(redactPhone('12345')).toBe('***');
    expect(redactPhone('123')).toBe('***');
  });

  it('should handle null/undefined', () => {
    expect(redactPhone(null)).toBe('N/A');
    expect(redactPhone(undefined)).toBe('N/A');
  });

  it('should remove spaces before redacting', () => {
    expect(redactPhone('+34 622 247 085')).toBe('+346***85');
  });
});

describe('Name Redaction - redactName', () => {
  it('should redact names showing first 2 chars of each part', () => {
    expect(redactName('John Doe')).toBe('Jo*** Do***');
    expect(redactName('María García López')).toBe('Ma*** Ga*** Ló***'); // Preserves accents
  });

  it('should handle single names', () => {
    expect(redactName('John')).toBe('Jo***');
  });

  it('should handle short names', () => {
    expect(redactName('Jo')).toBe('***');
    expect(redactName('A')).toBe('***');
  });

  it('should handle null/undefined', () => {
    expect(redactName(null)).toBe('N/A');
    expect(redactName(undefined)).toBe('N/A');
  });

  it('should trim whitespace', () => {
    expect(redactName('  John Doe  ')).toBe('Jo*** Do***');
  });
});

describe('Safe Booking Log - safeBookingLog', () => {
  it('should redact all PII fields in booking data', () => {
    const booking = {
      email: 'john.doe@example.com',
      phone: '+34622247085',
      firstName: 'John',
      lastName: 'Doe',
      className: 'Salsa Iniciación',
      classDate: '2026-02-15',
    };

    const safe = safeBookingLog(booking);

    expect(safe['email']).toBe('joh***@example.com');
    expect(safe['phone']).toBe('+346***85');
    expect(safe['firstName']).toBe('Jo***');
    expect(safe['lastName']).toBe('Do***');
    expect(safe['className']).toBe('Salsa Iniciación'); // Not redacted
    expect(safe['classDate']).toBe('2026-02-15'); // Not redacted
  });

  it('should handle missing optional fields', () => {
    const booking = {
      className: 'Bachata',
    };

    const safe = safeBookingLog(booking);

    expect(safe['email']).toBe('N/A');
    expect(safe['phone']).toBe('N/A');
    expect(safe['firstName']).toBe('N/A');
    expect(safe['lastName']).toBe('N/A');
    expect(safe['className']).toBe('Bachata');
  });

  it('should handle empty booking object', () => {
    const safe = safeBookingLog({});

    expect(safe['email']).toBe('N/A');
    expect(safe['phone']).toBe('N/A');
    expect(safe['firstName']).toBe('N/A');
    expect(safe['lastName']).toBe('N/A');
  });
});
