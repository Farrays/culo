/**
 * CSRF Token Management
 *
 * Genera y valida tokens CSRF usando Redis para almacenamiento.
 * Los tokens expiran después de 15 minutos.
 *
 * @see https://owasp.org/www-community/attacks/csrf
 */

import crypto from 'crypto';
import { getRedis } from './redis';
import { isFeatureEnabled, FEATURES } from './feature-flags';

// ============================================================================
// CONFIGURATION
// ============================================================================

const CSRF_PREFIX = 'csrf:';
const TOKEN_LENGTH = 32; // 256 bits
const TOKEN_TTL_SECONDS = 15 * 60; // 15 minutes

// ============================================================================
// TOKEN GENERATION
// ============================================================================

/**
 * Genera un nuevo token CSRF y lo almacena en Redis
 *
 * @param sessionId - Identificador de sesión (IP + User-Agent hash)
 * @returns Token CSRF generado
 */
export async function generateCsrfToken(sessionId: string): Promise<string> {
  const token = crypto.randomBytes(TOKEN_LENGTH).toString('hex');
  const redis = getRedis();

  // Store token with session binding
  const key = `${CSRF_PREFIX}${token}`;
  await redis.setex(key, TOKEN_TTL_SECONDS, sessionId);

  return token;
}

/**
 * Genera un ID de sesión basado en IP y User-Agent
 * Esto vincula el token a una "sesión" específica
 */
export function generateSessionId(ip: string, userAgent: string | undefined): string {
  const data = `${ip}:${userAgent || 'unknown'}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
}

// ============================================================================
// TOKEN VALIDATION
// ============================================================================

export interface CsrfValidationResult {
  valid: boolean;
  reason?:
    | 'missing_token'
    | 'invalid_token'
    | 'expired_token'
    | 'session_mismatch'
    | 'feature_disabled';
}

/**
 * Valida un token CSRF
 *
 * @param token - Token a validar (del header X-CSRF-Token)
 * @param sessionId - ID de sesión actual
 * @returns Resultado de la validación
 */
export async function validateCsrfToken(
  token: string | undefined,
  sessionId: string
): Promise<CsrfValidationResult> {
  // Check if CSRF protection is enabled
  const csrfEnabled = await isFeatureEnabled(FEATURES.CSRF_PROTECTION);
  if (!csrfEnabled) {
    // Feature disabled - allow all requests (legacy behavior)
    return { valid: true, reason: 'feature_disabled' };
  }

  // Validate token presence
  if (!token) {
    return { valid: false, reason: 'missing_token' };
  }

  // Validate token format (should be 64 hex chars for 32 bytes)
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return { valid: false, reason: 'invalid_token' };
  }

  try {
    const redis = getRedis();
    const key = `${CSRF_PREFIX}${token}`;
    const storedSessionId = await redis.get<string>(key);

    // Token not found or expired
    if (!storedSessionId) {
      return { valid: false, reason: 'expired_token' };
    }

    // Session mismatch (token used from different client)
    if (storedSessionId !== sessionId) {
      console.warn(`[CSRF] Session mismatch: expected ${storedSessionId}, got ${sessionId}`);
      return { valid: false, reason: 'session_mismatch' };
    }

    // Token is valid - consume it (one-time use)
    await redis.del(key);

    return { valid: true };
  } catch (error) {
    console.error('[CSRF] Validation error:', error);
    // On Redis error, fail open if feature flag suggests it's safe
    // Otherwise fail closed for security
    return { valid: false, reason: 'invalid_token' };
  }
}

// ============================================================================
// EXPRESS/VERCEL MIDDLEWARE HELPERS
// ============================================================================

import type { VercelRequest } from '@vercel/node';

/**
 * Extrae información de sesión de una request de Vercel
 */
export function getSessionFromRequest(req: VercelRequest): {
  ip: string;
  userAgent: string | undefined;
  sessionId: string;
} {
  // Get client IP (Vercel provides x-forwarded-for)
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip =
    typeof forwardedFor === 'string' ? forwardedFor.split(',')[0]?.trim() || 'unknown' : 'unknown';

  const userAgent = req.headers['user-agent'];

  return {
    ip,
    userAgent,
    sessionId: generateSessionId(ip, userAgent),
  };
}

/**
 * Extrae el token CSRF del header de la request
 */
export function getCsrfTokenFromRequest(req: VercelRequest): string | undefined {
  const token = req.headers['x-csrf-token'];
  return typeof token === 'string' ? token : undefined;
}

/**
 * Helper completo para validar CSRF en un endpoint
 * Retorna null si es válido, o un objeto de error si no lo es
 */
export async function validateCsrfRequest(
  req: VercelRequest
): Promise<{ error: string; status: number } | null> {
  const { sessionId } = getSessionFromRequest(req);
  const token = getCsrfTokenFromRequest(req);

  const result = await validateCsrfToken(token, sessionId);

  if (!result.valid) {
    // Map reasons to user-friendly messages
    const messages: Record<string, string> = {
      missing_token: 'CSRF token is required',
      invalid_token: 'Invalid CSRF token',
      expired_token: 'CSRF token has expired. Please refresh and try again.',
      session_mismatch: 'Session mismatch. Please refresh and try again.',
    };

    return {
      error: messages[result.reason || 'invalid_token'] || 'CSRF validation failed',
      status: 403,
    };
  }

  return null; // Valid
}
