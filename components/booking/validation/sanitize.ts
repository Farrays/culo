/* eslint-disable no-control-regex */
/**
 * Input Sanitization Utilities
 * Lightweight XSS protection for form inputs
 */

// HTML entities to escape
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
};

/**
 * Escape HTML special characters
 * Prevents XSS attacks when displaying user input
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'`=/]/g, char => HTML_ENTITIES[char] || char);
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Remove potentially dangerous characters and scripts
 */
export function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return '';

  return (
    str
      // Remove null bytes
      .replace(/\0/g, '')
      // Remove script tags and contents
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove event handlers
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      // Remove javascript: protocol
      .replace(/javascript:/gi, '')
      // Remove data: protocol (potential XSS vector)
      .replace(/data:/gi, '')
      // Strip remaining HTML tags
      .replace(/<[^>]*>/g, '')
      // Trim whitespace
      .trim()
  );
}

/**
 * Sanitize name field
 * Allows letters, spaces, accents, hyphens, apostrophes
 */
export function sanitizeName(str: string): string {
  if (typeof str !== 'string') return '';

  return (
    str
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Keep only valid name characters
      .replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]/g, '')
      // Collapse multiple spaces
      .replace(/\s+/g, ' ')
      // Trim
      .trim()
      // Limit length
      .slice(0, 50)
  );
}

/**
 * Sanitize email field
 */
export function sanitizeEmail(str: string): string {
  if (typeof str !== 'string') return '';

  return (
    str
      // Remove control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Remove whitespace
      .replace(/\s/g, '')
      // Convert to lowercase
      .toLowerCase()
      // Limit length (RFC 5321)
      .slice(0, 254)
  );
}

/**
 * Sanitize phone field
 * Keeps only digits, +, -, spaces, parentheses
 */
export function sanitizePhone(str: string): string {
  if (typeof str !== 'string') return '';

  return (
    str
      // Keep only valid phone characters
      .replace(/[^0-9+\-\s().]/g, '')
      // Collapse multiple spaces
      .replace(/\s+/g, ' ')
      // Trim
      .trim()
      // Limit length
      .slice(0, 20)
  );
}

/**
 * Sanitize all form data fields
 */
export function sanitizeFormData<T extends object>(data: T): T {
  const sanitized = { ...data } as Record<string, unknown>;

  for (const key in sanitized) {
    const value = sanitized[key];

    if (typeof value === 'string') {
      switch (key) {
        case 'firstName':
        case 'lastName':
          sanitized[key] = sanitizeName(value);
          break;
        case 'email':
          sanitized[key] = sanitizeEmail(value);
          break;
        case 'phone':
          sanitized[key] = sanitizePhone(value);
          break;
        default:
          sanitized[key] = sanitizeInput(value);
      }
    }
  }

  return sanitized as T;
}
