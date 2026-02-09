/**
 * Rate Limiting with Redis - Security Module
 *
 * Implements sliding window rate limiting using Upstash Redis.
 * Replaces in-memory rate limiting which doesn't persist across serverless invocations.
 *
 * @module security/rate-limit
 */

import { getRedis } from '../redis.js';

/**
 * Rate limit configuration per endpoint.
 */
interface RateLimitConfig {
  /** Time window in milliseconds */
  windowMs: number;
  /** Maximum requests allowed in the window */
  maxRequests: number;
}

/**
 * Rate limit configurations by endpoint path.
 * More restrictive for sensitive operations, more permissive for reads.
 */
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // Critical - very restrictive
  '/api/reservar': { windowMs: 300000, maxRequests: 5 }, // 5 per 5 min
  '/api/cancelar-reserva': { windowMs: 3600000, maxRequests: 10 }, // 10 per hour

  // Forms - moderately restrictive
  '/api/contact': { windowMs: 60000, maxRequests: 3 }, // 3 per minute
  '/api/lead': { windowMs: 60000, maxRequests: 5 }, // 5 per minute
  '/api/feedback': { windowMs: 3600000, maxRequests: 5 }, // 5 per hour

  // Reads - permissive
  '/api/clases': { windowMs: 60000, maxRequests: 60 }, // 60 per minute
  '/api/schedule': { windowMs: 60000, maxRequests: 60 }, // 60 per minute
  '/api/health': { windowMs: 60000, maxRequests: 120 }, // 120 per minute

  // Default for unlisted endpoints
  default: { windowMs: 60000, maxRequests: 30 }, // 30 per minute
};

/**
 * Result of a rate limit check.
 */
export interface RateLimitResult {
  /** Whether the request is allowed */
  allowed: boolean;
  /** Remaining requests in the current window */
  remaining: number;
  /** Seconds until the rate limit resets */
  resetIn: number;
  /** Total limit for this endpoint */
  limit: number;
}

/**
 * Checks if a request should be rate limited.
 * Uses Redis sorted sets for accurate sliding window implementation.
 *
 * @param endpoint - The API endpoint path (e.g., '/api/reservar')
 * @param identifier - Unique identifier (usually client IP)
 * @returns Rate limit check result
 */
export async function checkRateLimit(
  endpoint: string,
  identifier: string
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[endpoint] || RATE_LIMITS['default']!;
  const key = `ratelimit:${endpoint}:${identifier}`;
  const windowSeconds = Math.floor(config!.windowMs / 1000);
  const now = Date.now();
  const windowStart = now - config!.windowMs;

  try {
    const redis = getRedis();

    // Remove expired entries from the sliding window
    await redis.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const requestCount = await redis.zcard(key);

    if (requestCount >= config!.maxRequests) {
      // Rate limited - calculate when it resets
      const oldestRequest = await redis.zrange(key, 0, 0);
      let resetIn = windowSeconds;

      if (oldestRequest && oldestRequest.length > 0 && oldestRequest[0]) {
        // Parse the timestamp from the oldest request
        const oldestTime = parseInt(String(oldestRequest[0]!).split(':')[0]!, 10);
        if (!isNaN(oldestTime)) {
          resetIn = Math.max(1, Math.ceil((oldestTime + config!.windowMs - now) / 1000));
        }
      }

      return {
        allowed: false,
        remaining: 0,
        resetIn,
        limit: config!.maxRequests,
      };
    }

    // Add current request to the window
    const requestId = `${now}:${Math.random().toString(36).slice(2, 8)}`;
    await redis.zadd(key, { score: now, member: requestId });
    await redis.expire(key, windowSeconds + 1); // +1 for safety margin

    return {
      allowed: true,
      remaining: config!.maxRequests - requestCount - 1,
      resetIn: windowSeconds,
      limit: config!.maxRequests,
    };
  } catch (error) {
    // If Redis fails, allow the request but log the error
    // This prevents Redis outages from breaking the API
    console.error('[rate-limit] Redis error, allowing request:', error);
    return {
      allowed: true,
      remaining: config!.maxRequests,
      resetIn: windowSeconds,
      limit: config!.maxRequests,
    };
  }
}

/**
 * Sets rate limit headers on the response.
 * Follows standard rate limit header conventions.
 */
export function setRateLimitHeaders(
  res: { setHeader: (name: string, value: string) => void },
  result: RateLimitResult
): void {
  res.setHeader('X-RateLimit-Limit', result.limit.toString());
  res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
  res.setHeader('X-RateLimit-Reset', result.resetIn.toString());
}
