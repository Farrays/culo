/**
 * Input sanitization utilities for form security
 * Use these functions to sanitize user inputs before processing
 */

/**
 * Sanitize string input by removing dangerous HTML and trimming
 * @param input - Raw user input
 * @returns Sanitized string
 */
export const sanitizeString = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .slice(0, 1000); // Limit length to prevent abuse
};

/**
 * Sanitize email input
 * @param email - Raw email input
 * @returns Sanitized email or empty string if invalid
 */
export const sanitizeEmail = (email: string): string => {
  const sanitized = sanitizeString(email).toLowerCase();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitized) ? sanitized : '';
};

/**
 * Sanitize phone number
 * @param phone - Raw phone input
 * @returns Sanitized phone (digits only with optional + prefix)
 */
export const sanitizePhone = (phone: string): string => {
  const sanitized = sanitizeString(phone);

  // Keep only digits and + prefix
  return sanitized.replace(/[^0-9+]/g, '').slice(0, 20);
};

/**
 * Sanitize text area input (allows line breaks)
 * @param input - Raw textarea input
 * @returns Sanitized textarea content
 */
export const sanitizeTextarea = (input: string): string => {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .slice(0, 5000); // Limit length
};

/**
 * Validate and sanitize URL
 * @param url - Raw URL input
 * @returns Sanitized URL or empty string if invalid
 */
export const sanitizeUrl = (url: string): string => {
  const sanitized = sanitizeString(url);

  try {
    // eslint-disable-next-line no-undef
    const parsedUrl = new URL(sanitized);
    // Only allow http and https protocols
    if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
      return parsedUrl.toString();
    }
  } catch {
    // Invalid URL
  }

  return '';
};

/**
 * Sanitize name input (allows letters, spaces, hyphens, apostrophes)
 * @param name - Raw name input
 * @returns Sanitized name
 */
export const sanitizeName = (name: string): string => {
  const sanitized = sanitizeString(name);

  // Allow only letters, spaces, hyphens, and apostrophes
  return sanitized.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '').slice(0, 100);
};
