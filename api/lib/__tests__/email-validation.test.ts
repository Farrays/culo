/**
 * Tests for Email Validation Module
 *
 * Tests the comprehensive email validation including:
 * - Format validation (RFC-compliant)
 * - Disposable email detection
 * - Synchronous validation
 */

import { describe, it, expect } from 'vitest';
import { validateEmail, validateEmailSync } from '../email-validation';

describe('Email Validation - Format', () => {
  it('should accept valid email formats', async () => {
    const validEmails = [
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.com',
      'user@subdomain.example.com',
      'user123@example.org',
      'first.last@company.co.uk',
    ];

    for (const email of validEmails) {
      const result = await validateEmail(email, { checkMx: false });
      expect(result.valid, `Expected ${email} to be valid`).toBe(true);
    }
  });

  it('should reject invalid email formats', async () => {
    const invalidEmails = [
      'notanemail',
      '@example.com',
      'user@',
      'user@.com',
      'user@com',
      'user name@example.com',
      '',
      'user@@example.com',
    ];

    for (const email of invalidEmails) {
      const result = await validateEmail(email, { checkMx: false });
      expect(result.valid, `Expected ${email} to be invalid`).toBe(false);
      expect(result.reason).toBe('invalid_format');
    }
  });

  it('should reject emails exceeding max length (254 chars)', async () => {
    const longEmail = 'a'.repeat(250) + '@example.com';
    const result = await validateEmail(longEmail, { checkMx: false });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('invalid_format');
  });
});

describe('Email Validation - Disposable Emails', () => {
  it('should reject known disposable email domains', async () => {
    const disposableEmails = [
      'test@tempmail.com',
      'user@guerrillamail.com',
      'fake@mailinator.com',
      'spam@yopmail.com',
      'temp@10minutemail.com',
      'throw@throwaway.email',
    ];

    for (const email of disposableEmails) {
      const result = await validateEmail(email, { checkMx: false, blockDisposable: true });
      expect(result.valid, `Expected ${email} to be blocked`).toBe(false);
      expect(result.reason).toBe('disposable_email');
    }
  });

  it('should allow disposable emails when blockDisposable is false', async () => {
    const result = await validateEmail('test@tempmail.com', {
      checkMx: false,
      blockDisposable: false,
    });
    expect(result.valid).toBe(true);
  });

  it('should accept legitimate email providers', async () => {
    const legitimateEmails = [
      'user@gmail.com',
      'user@hotmail.com',
      'user@yahoo.com',
      'user@outlook.com',
      'user@icloud.com',
    ];

    for (const email of legitimateEmails) {
      const result = await validateEmail(email, { checkMx: false });
      expect(result.valid, `Expected ${email} to be valid`).toBe(true);
    }
  });
});

describe('Email Validation - Synchronous (validateEmailSync)', () => {
  it('should validate format synchronously', () => {
    const validResult = validateEmailSync('user@example.com');
    expect(validResult.valid).toBe(true);
    expect(validResult.email).toBe('user@example.com');

    const invalidResult = validateEmailSync('invalid');
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.reason).toBe('invalid_format');
  });

  it('should block disposable emails synchronously', () => {
    const result = validateEmailSync('test@mailinator.com');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('disposable_email');
  });

  it('should normalize email to lowercase', () => {
    const result = validateEmailSync('USER@EXAMPLE.COM');
    expect(result.valid).toBe(true);
    expect(result.email).toBe('user@example.com');
  });

  it('should trim whitespace', () => {
    const result = validateEmailSync('  user@example.com  ');
    expect(result.valid).toBe(true);
    expect(result.email).toBe('user@example.com');
  });
});

describe('Email Validation - Edge Cases', () => {
  it('should handle emails with special characters in local part', async () => {
    const specialEmails = [
      'user.name@example.com',
      'user+tag@example.com',
      'user_name@example.com',
      "user!#$%&'*+/=?^`{|}~@example.com",
    ];

    for (const email of specialEmails) {
      const result = await validateEmail(email, { checkMx: false });
      expect(result.valid, `Expected ${email} to be valid`).toBe(true);
    }
  });

  it('should handle international domains', async () => {
    const intlEmails = ['user@example.es', 'user@example.cat', 'user@example.fr'];

    for (const email of intlEmails) {
      const result = await validateEmail(email, { checkMx: false });
      expect(result.valid, `Expected ${email} to be valid`).toBe(true);
    }
  });
});
