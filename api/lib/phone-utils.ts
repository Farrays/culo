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
 * Generate phone number variants for lookup.
 * Given a normalized phone, produces multiple formats that might match Redis keys
 * or Momence records (with/without country code, with + prefix).
 *
 * Common country codes for Barcelona dance school clientele.
 *
 * @example
 * generatePhoneVariants('34622247085') // ['34622247085', '622247085', '+34622247085']
 * generatePhoneVariants('995591234567') // ['995591234567', '591234567', '+995591234567']
 */
// Country codes sorted by length descending to match longest first
const COUNTRY_CODES = [
  '995', // Georgia
  '380', // Ukraine
  '351', // Portugal
  '593', // Ecuador
  '57', // Colombia
  '58', // Venezuela
  '55', // Brazil
  '48', // Poland
  '40', // Romania
  '44', // UK
  '49', // Germany
  '39', // Italy
  '34', // Spain
  '33', // France
];

export function generatePhoneVariants(phone: string): string[] {
  const normalized = normalizePhone(phone);
  const variants = new Set<string>([normalized]);

  // Try to detect and strip country code → add local variant
  for (const cc of COUNTRY_CODES) {
    if (normalized.startsWith(cc) && normalized.length > cc.length + 5) {
      variants.add(normalized.slice(cc.length)); // local number without country code
      break;
    }
  }

  // If it looks like a local number (no country code detected), try adding Spain
  if (normalized.length <= 10 && /^[6789]\d{8}$/.test(normalized)) {
    variants.add('34' + normalized);
  }

  // Also try with + prefix (some systems store it that way)
  variants.add('+' + normalized);

  return [...variants];
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
