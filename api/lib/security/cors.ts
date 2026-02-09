/**
 * CORS Configuration - Security Module
 *
 * Restricts cross-origin requests to allowed domains only.
 * Replaces the vulnerable `Access-Control-Allow-Origin: *` pattern.
 *
 * @module security/cors
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Allowed origins for CORS requests.
 * Production domains + local development (only in non-production).
 */
const ALLOWED_ORIGINS = new Set([
  'https://www.farrayscenter.com',
  'https://farrayscenter.com',
  'https://admin.farrayscenter.com',
  // Development origins (only added in non-production)
  ...(process.env['NODE_ENV'] !== 'production'
    ? [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:4173', // Vite preview
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
      ]
    : []),
]);

/**
 * Checks if an origin is allowed for CORS.
 */
export function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.has(origin);
}

/**
 * Sets CORS headers on the response.
 * Only sets Access-Control-Allow-Origin if the request origin is allowed.
 * If origin is not allowed, the header is NOT set (browser will block).
 */
export function setCorsHeaders(req: VercelRequest, res: VercelResponse): void {
  const origin = req.headers.origin;

  // Only set CORS header if origin is explicitly allowed
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  // If not allowed, don't set the header - browser will block the request

  // Always set these headers for preflight
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-CSRF-Token, X-Session-Id'
  );
  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24h
}

/**
 * Handles OPTIONS preflight requests.
 * Returns true if the request was a preflight and was handled.
 */
export function handlePreflight(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method === 'OPTIONS') {
    setCorsHeaders(req, res);
    res.status(200).end();
    return true;
  }
  return false;
}
