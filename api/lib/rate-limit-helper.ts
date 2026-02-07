/**
 * Rate Limit Helper - Drop-in replacement for in-memory rate limiting
 *
 * Replaces Map-based rate limiting with Redis-based sliding window.
 * Designed to be a minimal change to existing code.
 *
 * Usage:
 * Before: const rateLimitMap = new Map(); isRateLimited(ip)
 * After:  import { isRateLimitedRedis } from './lib/rate-limit-helper.js';
 *         await isRateLimitedRedis(endpoint, ip)
 *
 * @module rate-limit-helper
 */

import { Redis } from '@upstash/redis';

// Lazy Redis connection
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env['UPSTASH_REDIS_REST_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'];

  if (!url || !token) {
    console.warn('[rate-limit] Redis not configured, falling back to allow');
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

/**
 * Default rate limits by endpoint type
 */
const RATE_LIMITS: Record<string, { windowMs: number; maxRequests: number }> = {
  // Critical - very restrictive
  '/api/reservar': { windowMs: 300000, maxRequests: 5 }, // 5 per 5 min
  '/api/cancelar-reserva': { windowMs: 3600000, maxRequests: 10 }, // 10 per hour

  // Forms - moderately restrictive
  '/api/contact': { windowMs: 60000, maxRequests: 3 }, // 3 per minute
  '/api/lead': { windowMs: 60000, maxRequests: 5 }, // 5 per minute
  '/api/exit-intent': { windowMs: 60000, maxRequests: 3 }, // 3 per minute
  '/api/feedback': { windowMs: 3600000, maxRequests: 5 }, // 5 per hour

  // Default for unlisted endpoints
  default: { windowMs: 60000, maxRequests: 30 }, // 30 per minute
};

/**
 * Check if a request should be rate limited (Redis-based).
 * Drop-in replacement for Map-based isRateLimited function.
 *
 * @param endpoint - The API endpoint path (e.g., '/api/reservar')
 * @param identifier - Unique identifier (usually client IP)
 * @returns Promise<boolean> - true if rate limited, false if allowed
 */
export async function isRateLimitedRedis(endpoint: string, identifier: string): Promise<boolean> {
  const redisClient = getRedis();

  // If Redis not available, allow request (fail open)
  if (!redisClient) {
    return false;
  }

  // Get config with guaranteed fallback to default
  const config = RATE_LIMITS[endpoint] ?? { windowMs: 60000, maxRequests: 30 };

  const key = `ratelimit:${endpoint}:${identifier}`;
  const windowSeconds = Math.floor(config.windowMs / 1000);
  const now = Date.now();
  const windowStart = now - config.windowMs;

  try {
    // Remove expired entries
    await redisClient.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const requestCount = await redisClient.zcard(key);

    if (requestCount >= config.maxRequests) {
      return true; // Rate limited
    }

    // Add current request
    const requestId = `${now}:${Math.random().toString(36).slice(2, 8)}`;
    await redisClient.zadd(key, { score: now, member: requestId });
    await redisClient.expire(key, windowSeconds + 1);

    return false; // Allowed
  } catch (error) {
    // If Redis fails, allow request but log
    console.error('[rate-limit] Redis error, allowing request:', error);
    return false;
  }
}

/**
 * Synchronous wrapper for backwards compatibility.
 * Starts the async check but doesn't block.
 * Use isRateLimitedRedis for proper rate limiting.
 *
 * @deprecated Use isRateLimitedRedis instead
 */
export function checkRateLimitAsync(
  endpoint: string,
  identifier: string,
  callback: (limited: boolean) => void
): void {
  isRateLimitedRedis(endpoint, identifier)
    .then(callback)
    .catch(() => callback(false));
}
