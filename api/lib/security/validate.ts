/**
 * Request Validation - Security Module
 *
 * Validates request origin and referer headers to prevent
 * cross-site request forgery and unauthorized API access.
 *
 * @module security/validate
 */

import type { VercelRequest } from '@vercel/node';
import { isAllowedOrigin } from './cors.js';

/**
 * Result of origin validation.
 */
export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Headers that indicate server-to-server requests (bypass origin check).
 * These are set by trusted services like Vercel crons, Upstash, Momence webhooks.
 */
const SERVER_REQUEST_HEADERS = [
  'x-vercel-cron', // Vercel scheduled functions
  'upstash-signature', // Upstash QStash
  'x-momence-secret', // Momence webhooks
  'x-whatsapp-signature', // WhatsApp webhooks (Meta)
  'x-hub-signature-256', // Meta/Facebook webhooks
] as const;

/**
 * Checks if the request is from a trusted server (not browser).
 */
export function isServerRequest(req: VercelRequest): boolean {
  return SERVER_REQUEST_HEADERS.some(header => req.headers[header]);
}

/**
 * Validates the origin of the request.
 * Ensures requests come from allowed domains or are server-to-server.
 *
 * @param req - The incoming request
 * @returns Validation result
 */
export function validateOrigin(req: VercelRequest): ValidationResult {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  const method = req.method || 'GET';

  // Server-to-server requests bypass origin check
  if (isServerRequest(req)) {
    return { valid: true };
  }

  // For cross-origin requests, validate the origin header
  if (origin) {
    if (!isAllowedOrigin(origin)) {
      return {
        valid: false,
        reason: `Origin not allowed: ${origin}`,
      };
    }
    return { valid: true };
  }

  // Check referer as fallback
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      if (!isAllowedOrigin(refererUrl.origin)) {
        return {
          valid: false,
          reason: `Referer not allowed: ${refererUrl.origin}`,
        };
      }
      return { valid: true };
    } catch {
      return {
        valid: false,
        reason: `Invalid referer URL: ${referer}`,
      };
    }
  }

  // For state-changing methods without origin/referer, be cautious
  // But allow GET requests (they might be direct browser navigation)
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    // This could be a same-origin request (browser doesn't send origin)
    // or it could be a CSRF attempt. We'll rely on CSRF tokens for protection.
    // Log for monitoring but allow through.
    console.warn(`[security] ${method} request without origin/referer`, {
      url: req.url,
      userAgent: req.headers['user-agent']?.slice(0, 100),
    });
  }

  return { valid: true };
}

/**
 * Extracts the client IP address from the request.
 * Handles Vercel's forwarded headers correctly.
 *
 * @param req - The incoming request
 * @returns Client IP address
 */
export function getClientIp(req: VercelRequest): string {
  // Vercel sets the real client IP in x-forwarded-for
  const forwarded = req.headers['x-forwarded-for'];

  if (typeof forwarded === 'string') {
    // Take the first IP (client), not subsequent proxies
    const clientIp = forwarded.split(',')[0]?.trim();
    if (clientIp) return clientIp;
  }

  // Fallback to x-real-ip header
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string') {
    return realIp;
  }

  // Last resort: socket address
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Extracts a session ID from the request.
 * Checks cookies first, then headers.
 *
 * @param req - The incoming request
 * @returns Session ID or undefined
 */
export function getSessionId(req: VercelRequest): string | undefined {
  // Check cookie first (standard session management)
  const cookies = req.headers.cookie;
  if (cookies) {
    const sessionMatch = cookies.match(/sessionId=([^;]+)/);
    if (sessionMatch?.[1]) {
      return sessionMatch[1];
    }
  }

  // Fall back to header (for API clients)
  const headerSessionId = req.headers['x-session-id'];
  if (typeof headerSessionId === 'string') {
    return headerSessionId;
  }

  return undefined;
}
