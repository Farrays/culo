/**
 * Security Module - Main Export
 *
 * Provides a unified security layer for API endpoints including:
 * - CORS protection (restricted origins)
 * - Rate limiting (Redis-based)
 * - CSRF protection (token-based)
 * - Origin/Referer validation
 *
 * @module security
 *
 * @example
 * // Import the middleware
 * import { withSecurity } from './lib/security/index.js';
 *
 * // Basic usage
 * export default withSecurity(handler);
 *
 * // With options
 * export default withSecurity(handler, {
 *   requireCsrf: true,
 *   rateLimit: true,
 * });
 */

// Main middleware
export { withSecurity, type SecurityOptions, type ApiHandler } from './middleware.js';

// CORS utilities
export { setCorsHeaders, handlePreflight, isAllowedOrigin } from './cors.js';

// Rate limiting
export { checkRateLimit, setRateLimitHeaders, type RateLimitResult } from './rate-limit.js';

// CSRF protection
export { generateCsrfToken, verifyCsrfToken, invalidateCsrfToken } from './csrf.js';

// Request validation
export {
  validateOrigin,
  getClientIp,
  getSessionId,
  isServerRequest,
  type ValidationResult,
} from './validate.js';
