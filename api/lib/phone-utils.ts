/**
 * Phone Number Utilities
 *
 * Centralized phone normalization for consistent handling across the application.
 * Supports Spanish (ES), French (FR), and international formats.
 *
 * E.164 Format: +[country code][subscriber number]
 * Example: +34622247085 (Spain), +33612345678 (France)
 */

/**
 * Normalize phone to E.164 format WITHOUT the + prefix
 * Returns only digits with country code prepended if needed.
 *
 * @example
 * normalizePhone('+34 622 247 085') // '34622247085'
 * normalizePhone('622247085')        // '34622247085' (Spanish assumed)
 * normalizePhone('0612345678')       // '33612345678' (French assumed)
 * normalizePhone('34622247085')      // '34622247085' (already has country code)
 */
export function normalizePhone(phone: string): string {
  // Remove all whitespace, parentheses, dots, dashes
  const cleaned = phone.replace(/[\s().-]/g, '');

  // If starts with +, remove it and return digits only
  if (cleaned.startsWith('+')) {
    return cleaned.substring(1);
  }

  // Spanish number without country code (9 digits starting with 6,7,8,9)
  // Covers: móviles (6xx, 7xx), fijos especiales (8xx), premium (9xx)
  if (cleaned.length === 9 && /^[6789]/.test(cleaned)) {
    return '34' + cleaned;
  }

  // French number without country code (10 digits starting with 0)
  // Covers: móviles (06xx, 07xx) and landlines (01xx-05xx)
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return '33' + cleaned.substring(1);
  }

  // Already has country code or unknown format - return as-is
  return cleaned;
}

/**
 * Format phone for Momence API (E.164 WITH + prefix)
 *
 * @example
 * formatPhoneForMomence('622247085') // '+34622247085'
 */
export function formatPhoneForMomence(phone: string): string {
  const normalized = normalizePhone(phone);
  return '+' + normalized;
}

/**
 * Format phone for WhatsApp API (E.164 WITHOUT + prefix)
 *
 * @example
 * formatPhoneForWhatsApp('+34 622 247 085') // '34622247085'
 */
export function formatPhoneForWhatsApp(phone: string): string {
  return normalizePhone(phone);
}

/**
 * Format phone for Meta CAPI (E.164 WITHOUT + prefix, hashed separately)
 *
 * @example
 * formatPhoneForMeta('+34 622 247 085') // '34622247085'
 */
export function formatPhoneForMeta(phone: string): string {
  return normalizePhone(phone);
}

/**
 * Validate phone number has minimum required digits
 * Accepts formats: +34666555444, 666555444, +33612345678, 0612345678
 *
 * @example
 * isValidPhone('+34666555444') // true
 * isValidPhone('123')           // false (too short)
 */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/[\s().-]/g, '');
  const cleanDigits = digits.replace(/^\+/, '');
  // E.164 standard: 7-15 digits (excluding +)
  return cleanDigits.length >= 7 && cleanDigits.length <= 15 && /^\+?\d+$/.test(digits);
}

/**
 * Redact phone for GDPR-compliant logging
 *
 * @example
 * redactPhone('+34622247085') // '+346***85'
 */
export function redactPhone(phone: string | null | undefined): string {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 6) return '***';
  return `${cleaned.slice(0, 4)}***${cleaned.slice(-2)}`;
}

/**
 * INLINE VERSION for files that can't import from lib/ due to Vercel bundler
 * Copy this function directly into API route files that need it.
 *
 * ```typescript
 * // Copy this into your API route:
 * function normalizePhone(phone: string): string {
 *   const cleaned = phone.replace(/[\s().-]/g, '');
 *   if (cleaned.startsWith('+')) return cleaned.substring(1);
 *   if (cleaned.length === 9 && /^[6789]/.test(cleaned)) return '34' + cleaned;
 *   if (cleaned.length === 10 && cleaned.startsWith('0')) return '33' + cleaned.substring(1);
 *   return cleaned;
 * }
 * ```
 */
