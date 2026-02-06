/**
 * CSRF Protection - Security Module
 *
 * Implements CSRF token generation and validation using Redis.
 * Tokens are tied to session IDs and have a configurable TTL.
 *
 * @module security/csrf
 */

/* eslint-disable no-undef */
// Note: Buffer is a Node.js global available in Vercel serverless functions

import * as crypto from 'crypto';
import { getRedis } from '../redis.js';

/** CSRF token time-to-live in seconds (1 hour) */
const CSRF_TTL_SECONDS = 3600;

/** Redis key prefix for CSRF tokens */
const CSRF_KEY_PREFIX = 'csrf:';

/**
 * Generates a new CSRF token for a session.
 * The token is stored in Redis with the session ID as key.
 *
 * @param sessionId - The session identifier to associate with the token
 * @returns The generated CSRF token
 */
export async function generateCsrfToken(sessionId: string): Promise<string> {
  if (!sessionId) {
    throw new Error('Session ID is required to generate CSRF token');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const redis = getRedis();
  const key = `${CSRF_KEY_PREFIX}${sessionId}`;

  await redis.setex(key, CSRF_TTL_SECONDS, token);

  return token;
}

/**
 * Verifies a CSRF token against the stored token for a session.
 * Uses timing-safe comparison to prevent timing attacks.
 *
 * @param sessionId - The session identifier
 * @param token - The token to verify
 * @returns Whether the token is valid
 */
export async function verifyCsrfToken(sessionId: string, token: string): Promise<boolean> {
  // Quick reject for missing values
  if (!sessionId || !token) {
    return false;
  }

  try {
    const redis = getRedis();
    const key = `${CSRF_KEY_PREFIX}${sessionId}`;
    const storedToken = await redis.get<string>(key);

    if (!storedToken) {
      return false;
    }

    // Use timing-safe comparison to prevent timing attacks
    const storedBuffer = Buffer.from(storedToken, 'utf-8');
    const providedBuffer = Buffer.from(token, 'utf-8');

    // Buffers must be same length for timingSafeEqual
    if (storedBuffer.length !== providedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(storedBuffer, providedBuffer);
  } catch (error) {
    console.error('[csrf] Error verifying token:', error);
    return false;
  }
}

/**
 * Invalidates (deletes) a CSRF token.
 * Call this when a session ends or token is used.
 *
 * @param sessionId - The session identifier
 */
export async function invalidateCsrfToken(sessionId: string): Promise<void> {
  if (!sessionId) return;

  try {
    const redis = getRedis();
    const key = `${CSRF_KEY_PREFIX}${sessionId}`;
    await redis.del(key);
  } catch (error) {
    console.error('[csrf] Error invalidating token:', error);
  }
}
