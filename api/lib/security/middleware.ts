/**
 * Security Middleware - Unified Security Layer
 *
 * Combines CORS, CSRF, rate limiting, and origin validation
 * into a single, easy-to-use middleware wrapper.
 *
 * IMPORTANT: This middleware is designed to be backwards compatible.
 * Endpoints that don't use it will continue to work as before.
 * Apply it incrementally to endpoints, starting with non-critical ones.
 *
 * @module security/middleware
 * @example
 * // In your API endpoint:
 * import { withSecurity } from './lib/security/middleware.js';
 *
 * async function handler(req, res) {
 *   // Your endpoint logic here
 * }
 *
 * export default withSecurity(handler);
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders, handlePreflight } from './cors.js';
import { verifyCsrfToken } from './csrf.js';
import { checkRateLimit, setRateLimitHeaders } from './rate-limit.js';
import { validateOrigin, getClientIp, getSessionId, isServerRequest } from './validate.js';

/**
 * Configuration options for the security middleware.
 */
export interface SecurityOptions {
  /**
   * Require CSRF token for state-changing requests (POST, PUT, DELETE, PATCH).
   * Default: false (opt-in for now to avoid breaking existing clients)
   *
   * IMPORTANT: Enable this once your frontend sends CSRF tokens.
   */
  requireCsrf?: boolean;

  /**
   * Apply rate limiting to this endpoint.
   * Default: true
   */
  rateLimit?: boolean;

  /**
   * Validate request origin/referer.
   * Default: true
   */
  validateOrigin?: boolean;

  /**
   * Mark this as a public endpoint (allows any origin).
   * Useful for health checks, public APIs.
   * Default: false
   */
  publicEndpoint?: boolean;

  /**
   * Custom rate limit key extractor.
   * Default: uses client IP address.
   */
  rateLimitKeyFn?: (req: VercelRequest) => string;
}

/**
 * Handler function type for API endpoints.
 */
export type ApiHandler = (
  req: VercelRequest,
  res: VercelResponse
) => Promise<void | VercelResponse> | void | VercelResponse;

/**
 * Wraps an API handler with security protections.
 *
 * @param handler - The API handler function
 * @param options - Security configuration options
 * @returns Wrapped handler with security middleware
 *
 * @example
 * // Basic usage - applies CORS and rate limiting
 * export default withSecurity(handler);
 *
 * @example
 * // With CSRF protection (requires frontend integration)
 * export default withSecurity(handler, { requireCsrf: true });
 *
 * @example
 * // Public endpoint (no origin validation)
 * export default withSecurity(handler, { publicEndpoint: true });
 */
export function withSecurity(handler: ApiHandler, options: SecurityOptions = {}): ApiHandler {
  const {
    requireCsrf = false, // Opt-in to avoid breaking existing clients
    rateLimit = true,
    validateOrigin: shouldValidateOrigin = true,
    publicEndpoint = false,
    rateLimitKeyFn,
  } = options;

  return async (req: VercelRequest, res: VercelResponse) => {
    // 1. Always set CORS headers first
    setCorsHeaders(req, res);

    // 2. Handle OPTIONS preflight
    if (handlePreflight(req, res)) {
      return;
    }

    const endpoint = req.url?.split('?')[0] || '/api/unknown';
    const clientIp = rateLimitKeyFn ? rateLimitKeyFn(req) : getClientIp(req);

    // 3. Rate limiting
    if (rateLimit) {
      try {
        const rateLimitResult = await checkRateLimit(endpoint, clientIp);
        setRateLimitHeaders(res, rateLimitResult);

        if (!rateLimitResult.allowed) {
          console.warn(`[security] Rate limited: ${clientIp} on ${endpoint}`);
          return res.status(429).json({
            error: 'Too many requests',
            message: 'Por favor, espera un momento antes de intentar de nuevo.',
            retryAfter: rateLimitResult.resetIn,
          });
        }
      } catch (error) {
        // Log but don't block on rate limit errors
        console.error('[security] Rate limit error:', error);
      }
    }

    // 4. Origin validation (skip for public endpoints and server requests)
    if (shouldValidateOrigin && !publicEndpoint && !isServerRequest(req)) {
      const originCheck = validateOrigin(req);
      if (!originCheck.valid) {
        console.warn(`[security] Origin rejected: ${originCheck.reason}`, {
          ip: clientIp,
          endpoint,
          origin: req.headers.origin,
          referer: req.headers.referer,
        });
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Request origin not allowed',
        });
      }
    }

    // 5. CSRF validation for state-changing methods (if enabled)
    if (requireCsrf && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
      // Skip CSRF for server-to-server requests (they have their own auth)
      if (!isServerRequest(req)) {
        const sessionId = getSessionId(req);
        const csrfToken = req.headers['x-csrf-token'] as string | undefined;

        // Only validate if session exists (logged-in users)
        if (sessionId) {
          const csrfValid = await verifyCsrfToken(sessionId, csrfToken || '');
          if (!csrfValid) {
            console.warn(`[security] Invalid CSRF token`, {
              ip: clientIp,
              endpoint,
              hasToken: !!csrfToken,
              hasSession: !!sessionId,
            });
            return res.status(403).json({
              error: 'Invalid CSRF token',
              message: 'Tu sesión ha expirado. Por favor, recarga la página.',
            });
          }
        }
      }
    }

    // 6. Execute the actual handler
    try {
      return await handler(req, res);
    } catch (error) {
      // Log unexpected errors
      console.error(`[api-error] ${endpoint}:`, error);

      // Don't expose internal errors to clients
      if (!res.headersSent) {
        return res.status(500).json({
          error: 'Internal server error',
          message: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
        });
      }
    }
  };
}

/**
 * Re-export utilities for direct use in endpoints
 */
export { setCorsHeaders, handlePreflight } from './cors.js';
export { checkRateLimit, setRateLimitHeaders } from './rate-limit.js';
export { generateCsrfToken, verifyCsrfToken } from './csrf.js';
export { validateOrigin, getClientIp, getSessionId, isServerRequest } from './validate.js';
