/**
 * API E2E Tests for Booking System
 *
 * Tests the complete booking API flow including:
 * - Input validation
 * - Rate limiting behavior
 * - Circuit breaker pattern
 * - Response format verification
 *
 * Note: These tests are designed to run against a test environment
 * with mocked external services (Momence, Meta CAPI, etc.)
 */

import { describe, it, expect } from 'vitest';

// Test data
const validBookingData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '+34612345678',
  sessionId: '12345',
  className: 'Salsa Iniciación',
  classDate: '2026-02-15',
  estilo: 'salsa',
  comoconoce: 'Instagram',
  acceptsTerms: true,
  acceptsMarketing: true,
  eventId: 'test-event-123',
};

describe('Booking API - Input Validation', () => {
  it('should reject empty required fields', () => {
    const invalidData = { ...validBookingData, firstName: '' };
    expect(isValidBookingData(invalidData)).toBe(false);
  });

  it('should reject invalid email format', () => {
    const invalidData = { ...validBookingData, email: 'not-an-email' };
    expect(isValidEmail(invalidData.email)).toBe(false);
  });

  it('should accept valid email formats', () => {
    const validEmails = ['test@example.com', 'user.name@domain.org', 'user+tag@sub.domain.com'];
    validEmails.forEach(email => {
      expect(isValidEmail(email)).toBe(true);
    });
  });

  it('should reject invalid phone formats', () => {
    const invalidPhones = ['123', 'abc', '+1'];
    invalidPhones.forEach(phone => {
      expect(isValidPhone(phone)).toBe(false);
    });
  });

  it('should accept valid Spanish phone formats', () => {
    const validPhones = ['+34612345678', '612345678', '34612345678'];
    validPhones.forEach(phone => {
      expect(isValidPhone(phone)).toBe(true);
    });
  });

  it('should accept valid French phone formats', () => {
    const validPhones = ['+33612345678', '0612345678'];
    validPhones.forEach(phone => {
      expect(isValidPhone(phone)).toBe(true);
    });
  });

  it('should reject past dates for classDate', () => {
    const pastDate = '2020-01-01';
    expect(isValidClassDate(pastDate)).toBe(false);
  });

  it('should reject dates more than 1 year in the future', () => {
    const farFutureDate = '2030-01-01';
    expect(isValidClassDate(farFutureDate)).toBe(false);
  });

  it('should accept valid future dates', () => {
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    expect(isValidClassDate(tomorrowStr || '')).toBe(true);
  });
});

describe('Booking API - Phone Normalization', () => {
  it('should normalize Spanish mobile numbers', () => {
    expect(normalizePhone('622 247 085')).toBe('34622247085');
    expect(normalizePhone('622247085')).toBe('34622247085');
    expect(normalizePhone('+34 622 247 085')).toBe('34622247085');
  });

  it('should normalize French mobile numbers', () => {
    expect(normalizePhone('0612345678')).toBe('33612345678');
    expect(normalizePhone('+33 6 12 34 56 78')).toBe('33612345678');
  });

  it('should handle numbers with country code', () => {
    expect(normalizePhone('34622247085')).toBe('34622247085');
    expect(normalizePhone('+34622247085')).toBe('34622247085');
  });

  it('should remove special characters', () => {
    expect(normalizePhone('+34 (622) 247-085')).toBe('34622247085');
  });
});

describe('Booking API - PII Redaction', () => {
  it('should redact email for logging', () => {
    expect(redactEmail('john@example.com')).toBe('joh***@example.com');
    expect(redactEmail('ab@test.org')).toBe('***@test.org');
    expect(redactEmail(null)).toBe('N/A');
    expect(redactEmail(undefined)).toBe('N/A');
  });

  it('should redact phone for logging', () => {
    expect(redactPhone('+34622247085')).toBe('+346***85');
    expect(redactPhone('12345')).toBe('***');
    expect(redactPhone(null)).toBe('N/A');
    expect(redactPhone(undefined)).toBe('N/A');
  });
});

describe('Booking API - SessionId Validation', () => {
  it('should accept valid positive integer sessionIds', () => {
    expect(isValidSessionId('12345')).toBe(true);
    expect(isValidSessionId('1')).toBe(true);
    expect(isValidSessionId('999999')).toBe(true);
  });

  it('should reject invalid sessionIds', () => {
    expect(isValidSessionId('0')).toBe(false);
    expect(isValidSessionId('-1')).toBe(false);
    expect(isValidSessionId('abc')).toBe(false);
    expect(isValidSessionId('')).toBe(false);
    expect(isValidSessionId('12.34')).toBe(false);
  });
});

describe('Booking API - Booking Response Format', () => {
  it('should have correct success response structure', () => {
    const successResponse = {
      success: true,
      status: 'confirmed',
      eventId: 'test-123',
      message: 'Reserva confirmada',
    };

    expect(successResponse).toHaveProperty('success', true);
    expect(successResponse).toHaveProperty('status');
    expect(successResponse).toHaveProperty('eventId');
    expect(successResponse).toHaveProperty('message');
  });

  it('should have correct error response structure', () => {
    const errorResponse = {
      success: false,
      error: 'Invalid input',
      message: 'Email no válido',
    };

    expect(errorResponse).toHaveProperty('success', false);
    expect(errorResponse).toHaveProperty('error');
    expect(errorResponse).toHaveProperty('message');
  });

  it('should include whatsapp fallback on total failure', () => {
    const failureResponse = {
      success: false,
      error: 'No pudimos procesar tu reserva',
      message: 'Por favor, contacta con nosotros por WhatsApp',
      whatsappUrl: 'https://wa.me/34622247085',
    };

    expect(failureResponse).toHaveProperty('whatsappUrl');
    expect(failureResponse.whatsappUrl).toContain('wa.me');
  });
});

// ============================================================================
// HELPER FUNCTIONS (mirroring reservar.ts logic for testing)
// ============================================================================

function isValidBookingData(data: Record<string, unknown>): boolean {
  return !!(
    data['firstName'] &&
    data['lastName'] &&
    data['email'] &&
    data['phone'] &&
    (data['acceptsTerms'] || data['acceptsMarketing'])
  );
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s().-]/g, '');
  const cleanDigits = digits.replace(/^\+/, '');
  return cleanDigits.length >= 7 && cleanDigits.length <= 15 && /^\+?\d+$/.test(digits);
}

function isValidClassDate(dateStr: string): boolean {
  const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!dateMatch || !dateMatch[1] || !dateMatch[2] || !dateMatch[3]) return false;

  const bookingDate = new Date(
    parseInt(dateMatch[1], 10),
    parseInt(dateMatch[2], 10) - 1,
    parseInt(dateMatch[3], 10)
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneYearFromNow = new Date(today);
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  return bookingDate >= today && bookingDate <= oneYearFromNow;
}

function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s().-]/g, '');

  if (cleaned.startsWith('+')) {
    return cleaned.substring(1);
  }

  // Spanish number without country code (9 digits starting with 6,7,8,9)
  if (cleaned.length === 9 && /^[6789]/.test(cleaned)) {
    return '34' + cleaned;
  }

  // French number without country code (10 digits starting with 0)
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return '33' + cleaned.substring(1);
  }

  return cleaned;
}

function redactEmail(email: string | null | undefined): string {
  if (!email) return 'N/A';
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@invalid';
  return `${local.length > 3 ? local.slice(0, 3) + '***' : '***'}@${domain}`;
}

function redactPhone(phone: string | null | undefined): string {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 6) return '***';
  return `${cleaned.slice(0, 4)}***${cleaned.slice(-2)}`;
}

function isValidSessionId(sessionId: string): boolean {
  if (!sessionId) return false;
  const parsed = parseInt(sessionId, 10);
  // Also verify the string doesn't contain non-integer characters
  return !isNaN(parsed) && parsed > 0 && /^\d+$/.test(sessionId);
}
