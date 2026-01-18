/**
 * Sanitization Functions Tests
 * Tests for XSS protection and input sanitization
 */

import { describe, it, expect } from 'vitest';
import {
  escapeHtml,
  stripHtml,
  sanitizeInput,
  sanitizeName,
  sanitizeEmail,
  sanitizePhone,
  sanitizeFormData,
} from '../validation/sanitize';

describe('sanitize', () => {
  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(escapeHtml('"quotes"')).toBe('&quot;quotes&quot;');
      expect(escapeHtml("'apostrophe'")).toBe('&#x27;apostrophe&#x27;');
      expect(escapeHtml('a & b')).toBe('a &amp; b');
    });

    it('should handle multiple special characters', () => {
      const input = '<div onclick="alert(\'xss\')">test</div>';
      const escaped = escapeHtml(input);
      expect(escaped).not.toContain('<');
      expect(escaped).not.toContain('>');
      expect(escaped).toContain('&lt;');
      expect(escaped).toContain('&gt;');
    });

    it('should not modify safe strings', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World');
      expect(escapeHtml('test123')).toBe('test123');
    });

    it('should escape backticks and equals', () => {
      expect(escapeHtml('`code`')).toBe('&#x60;code&#x60;');
      expect(escapeHtml('a=b')).toBe('a&#x3D;b');
    });
  });

  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      expect(stripHtml('<p>Hello</p>')).toBe('Hello');
      expect(stripHtml('<div class="test">Content</div>')).toBe('Content');
    });

    it('should handle nested tags', () => {
      expect(stripHtml('<div><span><b>Text</b></span></div>')).toBe('Text');
    });

    it('should handle self-closing tags', () => {
      expect(stripHtml('Line1<br/>Line2')).toBe('Line1Line2');
    });

    it('should not modify strings without tags', () => {
      expect(stripHtml('Plain text')).toBe('Plain text');
    });
  });

  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      expect(sanitizeInput(input)).toBe('Hello');
    });

    it('should remove event handlers', () => {
      const input = '<img onerror="alert(\'xss\')" src="x">test';
      const result = sanitizeInput(input);
      expect(result).not.toContain('onerror');
    });

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert("xss")';
      expect(sanitizeInput(input)).not.toContain('javascript:');
    });

    it('should remove data: protocol', () => {
      const input = 'data:text/html,<script>alert("xss")</script>';
      expect(sanitizeInput(input)).not.toContain('data:');
    });

    it('should remove null bytes', () => {
      const input = 'Hello\0World';
      expect(sanitizeInput(input)).toBe('HelloWorld');
    });

    it('should trim whitespace', () => {
      expect(sanitizeInput('  Hello World  ')).toBe('Hello World');
    });

    it('should handle non-string input gracefully', () => {
      // @ts-expect-error Testing invalid input
      expect(sanitizeInput(null)).toBe('');
      // @ts-expect-error Testing invalid input
      expect(sanitizeInput(undefined)).toBe('');
      // @ts-expect-error Testing invalid input
      expect(sanitizeInput(123)).toBe('');
    });

    it('should handle complex XSS vectors', () => {
      const vectors = [
        '<img src=x onerror=alert(1)>',
        '<svg onload=alert(1)>',
        '<body onload=alert(1)>',
        '<iframe src="javascript:alert(1)">',
      ];

      vectors.forEach(input => {
        const result = sanitizeInput(input);
        expect(result).not.toContain('onerror');
        expect(result).not.toContain('onload');
        expect(result).not.toContain('javascript:');
      });
    });
  });

  describe('sanitizeName', () => {
    it('should keep valid name characters', () => {
      expect(sanitizeName('Juan García')).toBe('Juan García');
      expect(sanitizeName('José-Luis')).toBe('José-Luis');
      expect(sanitizeName("O'Brien")).toBe("O'Brien");
    });

    it('should handle accented characters', () => {
      expect(sanitizeName('Àngel')).toBe('Àngel');
      expect(sanitizeName('François')).toBe('François');
      expect(sanitizeName('Müller')).toBe('Müller');
      expect(sanitizeName('Niño')).toBe('Niño');
    });

    it('should remove numbers', () => {
      expect(sanitizeName('Juan123')).toBe('Juan');
    });

    it('should remove special characters', () => {
      expect(sanitizeName('Juan@García!')).toBe('JuanGarcía');
    });

    it('should collapse multiple spaces', () => {
      expect(sanitizeName('Juan    García')).toBe('Juan García');
    });

    it('should trim whitespace', () => {
      expect(sanitizeName('  Juan  ')).toBe('Juan');
    });

    it('should limit length to 50 characters', () => {
      const longName = 'A'.repeat(60);
      expect(sanitizeName(longName).length).toBe(50);
    });

    it('should remove control characters', () => {
      expect(sanitizeName('Juan\x00\x1FGarcía')).toBe('JuanGarcía');
    });

    it('should handle non-string input', () => {
      // @ts-expect-error Testing invalid input
      expect(sanitizeName(null)).toBe('');
      // @ts-expect-error Testing invalid input
      expect(sanitizeName(123)).toBe('');
    });
  });

  describe('sanitizeEmail', () => {
    it('should keep valid email characters', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
      expect(sanitizeEmail('user.name+tag@example.org')).toBe('user.name+tag@example.org');
    });

    it('should convert to lowercase', () => {
      expect(sanitizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
    });

    it('should remove whitespace', () => {
      expect(sanitizeEmail('test @ example.com')).toBe('test@example.com');
      expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com');
    });

    it('should remove control characters', () => {
      expect(sanitizeEmail('test\x00@example.com')).toBe('test@example.com');
    });

    it('should limit length to 254 characters (RFC 5321)', () => {
      const longEmail = 'a'.repeat(300) + '@b.com';
      expect(sanitizeEmail(longEmail).length).toBeLessThanOrEqual(254);
    });

    it('should handle non-string input', () => {
      // @ts-expect-error Testing invalid input
      expect(sanitizeEmail(null)).toBe('');
    });
  });

  describe('sanitizePhone', () => {
    it('should keep valid phone characters', () => {
      expect(sanitizePhone('+34612345678')).toBe('+34612345678');
      expect(sanitizePhone('(555) 123-4567')).toBe('(555) 123-4567');
      expect(sanitizePhone('+1-555-123-4567')).toBe('+1-555-123-4567');
    });

    it('should remove letters', () => {
      expect(sanitizePhone('555-CALL-NOW')).toBe('555--');
    });

    it('should remove special characters except phone chars', () => {
      expect(sanitizePhone('+34@612#345$678')).toBe('+34612345678');
    });

    it('should collapse multiple spaces', () => {
      expect(sanitizePhone('555   123   4567')).toBe('555 123 4567');
    });

    it('should trim whitespace', () => {
      expect(sanitizePhone('  +34612345678  ')).toBe('+34612345678');
    });

    it('should limit length to 20 characters', () => {
      const longPhone = '1'.repeat(30);
      expect(sanitizePhone(longPhone).length).toBe(20);
    });

    it('should handle non-string input', () => {
      // @ts-expect-error Testing invalid input
      expect(sanitizePhone(null)).toBe('');
    });
  });

  describe('sanitizeFormData', () => {
    it('should sanitize all string fields appropriately', () => {
      const formData = {
        firstName: '  Juan  ',
        lastName: 'García123',
        email: 'TEST@EXAMPLE.COM',
        phone: '+34 612 345 678 extra',
        acceptsTerms: true,
      };

      const sanitized = sanitizeFormData(formData);

      expect(sanitized.firstName).toBe('Juan');
      expect(sanitized.lastName).toBe('García');
      expect(sanitized.email).toBe('test@example.com');
      // Phone field sanitization keeps spaces and numbers
      expect(sanitized.phone).toMatch(/^\+34 612 345 678/);
      expect(sanitized.acceptsTerms).toBe(true);
    });

    it('should remove HTML-like characters from names', () => {
      const formData = {
        firstName: 'Juan<test>',
        lastName: 'García',
        email: 'test@example.com',
        phone: '+34612345678',
      };

      const sanitized = sanitizeFormData(formData);

      // sanitizeName keeps letters only (removes < and > but letters from "test" remain)
      expect(sanitized.firstName).toBe('Juantest');
    });

    it('should preserve non-string fields', () => {
      const formData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'test@example.com',
        phone: '+34612345678',
        acceptsTerms: true,
        acceptsMarketing: false,
        acceptsAge: true,
      };

      const sanitized = sanitizeFormData(formData);

      expect(sanitized.acceptsTerms).toBe(true);
      expect(sanitized.acceptsMarketing).toBe(false);
      expect(sanitized.acceptsAge).toBe(true);
    });

    it('should sanitize unknown string fields with generic sanitizer', () => {
      const formData = {
        firstName: 'Juan',
        lastName: 'García',
        email: 'test@example.com',
        phone: '+34612345678',
        customField: '<script>alert("xss")</script>Hello',
      };

      const sanitized = sanitizeFormData(formData);

      expect(sanitized.customField).toBe('Hello');
    });
  });
});
