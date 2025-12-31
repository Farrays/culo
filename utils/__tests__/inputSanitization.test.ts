import { describe, it, expect } from 'vitest';
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  sanitizeTextarea,
  sanitizeUrl,
  sanitizeName,
} from '../inputSanitization';

describe('sanitizeString', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitizeString(null as unknown as string)).toBe('');
    expect(sanitizeString(undefined as unknown as string)).toBe('');
    expect(sanitizeString(123 as unknown as string)).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
    expect(sanitizeString('\n\ttest\n\t')).toBe('test');
  });

  it('removes < and > characters', () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    expect(sanitizeString('Hello <world>')).toBe('Hello world');
  });

  it('limits length to 1000 characters', () => {
    const longString = 'a'.repeat(2000);
    expect(sanitizeString(longString).length).toBe(1000);
  });

  it('returns the original string if already clean', () => {
    expect(sanitizeString('Hello World')).toBe('Hello World');
  });
});

describe('sanitizeEmail', () => {
  it('converts to lowercase', () => {
    expect(sanitizeEmail('Test@Example.COM')).toBe('test@example.com');
  });

  it('returns valid email', () => {
    expect(sanitizeEmail('user@example.com')).toBe('user@example.com');
    expect(sanitizeEmail('test.user@domain.org')).toBe('test.user@domain.org');
  });

  it('returns empty string for invalid email', () => {
    expect(sanitizeEmail('invalid')).toBe('');
    expect(sanitizeEmail('missing@domain')).toBe('');
    expect(sanitizeEmail('@nodomain.com')).toBe('');
    expect(sanitizeEmail('spaces in@email.com')).toBe('');
  });

  it('trims whitespace before validation', () => {
    expect(sanitizeEmail('  user@example.com  ')).toBe('user@example.com');
  });

  it('removes dangerous characters from email', () => {
    // After removing < and >, script@test.com is a valid email format
    expect(sanitizeEmail('<script>@test.com')).toBe('script@test.com');
    // The XSS tags are stripped but the email remains valid
    expect(sanitizeEmail('user<script>@test.com')).toBe('userscript@test.com');
  });
});

describe('sanitizePhone', () => {
  it('keeps only digits and + prefix', () => {
    expect(sanitizePhone('+1 (555) 123-4567')).toBe('+15551234567');
    expect(sanitizePhone('555.123.4567')).toBe('5551234567');
  });

  it('handles international formats', () => {
    expect(sanitizePhone('+34 666 555 444')).toBe('+34666555444');
    expect(sanitizePhone('+44-20-7946-0958')).toBe('+442079460958');
  });

  it('limits length to 20 characters', () => {
    expect(sanitizePhone('+123456789012345678901234567890').length).toBeLessThanOrEqual(20);
  });

  it('trims whitespace', () => {
    expect(sanitizePhone('  +15551234567  ')).toBe('+15551234567');
  });

  it('removes letters and special characters', () => {
    expect(sanitizePhone('555-CALL-NOW')).toBe('555');
  });
});

describe('sanitizeTextarea', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitizeTextarea(null as unknown as string)).toBe('');
    expect(sanitizeTextarea(undefined as unknown as string)).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeTextarea('  hello world  ')).toBe('hello world');
  });

  it('removes < and > characters', () => {
    expect(sanitizeTextarea('Hello <b>world</b>')).toBe('Hello bworld/b');
  });

  it('limits length to 5000 characters', () => {
    const longString = 'a'.repeat(10000);
    expect(sanitizeTextarea(longString).length).toBe(5000);
  });

  it('preserves line breaks', () => {
    expect(sanitizeTextarea('line1\nline2')).toBe('line1\nline2');
    expect(sanitizeTextarea('line1\r\nline2')).toBe('line1\r\nline2');
  });
});

describe('sanitizeUrl', () => {
  it('returns valid http URLs', () => {
    expect(sanitizeUrl('http://example.com')).toBe('http://example.com/');
    expect(sanitizeUrl('http://example.com/path')).toBe('http://example.com/path');
  });

  it('returns valid https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
    expect(sanitizeUrl('https://example.com/path?query=1')).toBe(
      'https://example.com/path?query=1'
    );
  });

  it('returns empty string for invalid URLs', () => {
    expect(sanitizeUrl('not a url')).toBe('');
    expect(sanitizeUrl('example.com')).toBe('');
  });

  it('rejects non-http/https protocols', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('');
    expect(sanitizeUrl('ftp://files.example.com')).toBe('');
    expect(sanitizeUrl('file:///etc/passwd')).toBe('');
  });

  it('trims whitespace before validation', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com/');
  });
});

describe('sanitizeName', () => {
  it('allows letters and spaces', () => {
    expect(sanitizeName('John Smith')).toBe('John Smith');
    expect(sanitizeName('María García')).toBe('María García');
  });

  it('allows hyphens and apostrophes', () => {
    expect(sanitizeName("O'Connor")).toBe("O'Connor");
    expect(sanitizeName('Mary-Jane')).toBe('Mary-Jane');
  });

  it('removes numbers and special characters', () => {
    expect(sanitizeName('John123')).toBe('John');
    expect(sanitizeName('Test@User!')).toBe('TestUser');
  });

  it('allows Spanish accented characters', () => {
    expect(sanitizeName('José Núñez')).toBe('José Núñez');
    expect(sanitizeName('Ángel Díaz')).toBe('Ángel Díaz');
  });

  it('limits length to 100 characters', () => {
    const longName = 'a'.repeat(200);
    expect(sanitizeName(longName).length).toBe(100);
  });

  it('trims whitespace', () => {
    expect(sanitizeName('  John Smith  ')).toBe('John Smith');
  });
});
