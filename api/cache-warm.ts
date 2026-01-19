import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/* eslint-disable no-undef, no-console */
// Note: Buffer and URLSearchParams are Node.js globals available in Vercel serverless functions
// Console logging is intentional for cron job monitoring

/**
 * API Route: /api/cache-warm
 *
 * Warms the Momence classes cache via Vercel Cron Jobs.
 * This endpoint pre-fetches class data for all 4 weeks so users
 * always get instant responses from cache.
 *
 * Cron schedule: Every 10 minutes
 * Protected by: CRON_SECRET authorization header
 */

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';
const CACHE_KEY = 'momence:sessions:cache';
const TOKEN_CACHE_KEY = 'momence:access_token';
const CACHE_TTL_SECONDS = 30 * 60; // 30 minutes
const TOKEN_TTL_SECONDS = 3500;

// Redis client singleton
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) return null;

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
  }
  return redisClient;
}

// Types
interface MomenceTeacher {
  id: number;
  firstName: string;
  lastName: string;
  pictureUrl?: string | null;
}

interface MomenceSession {
  id: number;
  name: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
  bookingCount: number;
  locationName?: string;
  inPersonLocation?: string;
  teacher?: MomenceTeacher;
  description?: string;
}

// Get access token (with cache)
async function getAccessToken(): Promise<string | null> {
  const { MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD } =
    process.env;

  if (!MOMENCE_CLIENT_ID || !MOMENCE_CLIENT_SECRET || !MOMENCE_USERNAME || !MOMENCE_PASSWORD) {
    console.error('[cache-warm] Missing Momence OAuth credentials');
    return null;
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      const cachedToken = await redis.get(TOKEN_CACHE_KEY);
      if (cachedToken) {
        return cachedToken;
      }
    } catch (e) {
      console.warn('[cache-warm] Redis token cache lookup failed:', e);
    }
  }

  const basicAuth = Buffer.from(`${MOMENCE_CLIENT_ID}:${MOMENCE_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await fetch(MOMENCE_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: MOMENCE_USERNAME,
        password: MOMENCE_PASSWORD,
      }),
    });

    if (!response.ok) {
      console.error('[cache-warm] Momence auth failed:', response.status);
      return null;
    }

    const data = await response.json();
    const token = data.access_token;

    if (redis && token) {
      try {
        await redis.setex(TOKEN_CACHE_KEY, TOKEN_TTL_SECONDS, token);
      } catch (e) {
        console.warn('[cache-warm] Redis token cache save failed:', e);
      }
    }

    return token;
  } catch (error) {
    console.error('[cache-warm] Momence auth error:', error);
    return null;
  }
}

// Fetch sessions for a specific week (parallel page fetching)
async function fetchSessionsForWeek(
  accessToken: string,
  weekOffset: number,
  daysAhead: number = 7
): Promise<MomenceSession[]> {
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  const startDate = new Date(baseDate.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000);
  const futureLimit = new Date(startDate.getTime() + daysAhead * 24 * 60 * 60 * 1000);
  const filterFromDate = weekOffset === 0 ? new Date() : startDate;

  // Fetch first 5 pages in parallel (covers most use cases)
  const pagePromises = [0, 1, 2, 3, 4].map(async page => {
    try {
      const response = await fetch(
        `${MOMENCE_API_URL}/api/v2/host/sessions?page=${page}&pageSize=100`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) return [];
      const data = await response.json();
      return data.payload || [];
    } catch {
      return [];
    }
  });

  const results = await Promise.all(pagePromises);
  const allSessions: MomenceSession[] = results.flat();

  // Filter to the requested date range
  return allSessions
    .filter(s => {
      const d = new Date(s.startsAt);
      return d >= filterFromDate && d <= futureLimit;
    })
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}

// Warm cache for all week configurations
async function warmCache(): Promise<{
  success: boolean;
  warmed: number;
  skipped: number;
  errors: string[];
  duration: number;
}> {
  const startTime = Date.now();
  const redis = getRedisClient();

  if (!redis) {
    return {
      success: false,
      warmed: 0,
      skipped: 0,
      errors: ['Redis unavailable'],
      duration: Date.now() - startTime,
    };
  }

  const errors: string[] = [];
  let warmed = 0;
  let skipped = 0;

  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return {
        success: false,
        warmed: 0,
        skipped: 0,
        errors: ['Authentication failed'],
        duration: Date.now() - startTime,
      };
    }

    // Cache configurations to warm (all 4 weeks)
    const configs = [
      { daysAhead: 7, weekOffset: 0 },
      { daysAhead: 7, weekOffset: 1 },
      { daysAhead: 7, weekOffset: 2 },
      { daysAhead: 7, weekOffset: 3 },
    ];

    // Process all weeks in parallel for speed
    const warmPromises = configs.map(async config => {
      const cacheKey = `${CACHE_KEY}:${config.daysAhead}:week${config.weekOffset}`;

      try {
        // Check if cache is still valid (more than 5 min remaining)
        const ttl = await redis.ttl(cacheKey);
        if (ttl > 300) {
          console.log(
            `[cache-warm] Week ${config.weekOffset}: Cache valid (${ttl}s TTL), skipping`
          );
          return { status: 'skipped' as const };
        }

        // Fetch fresh data
        const sessions = await fetchSessionsForWeek(
          accessToken,
          config.weekOffset,
          config.daysAhead
        );

        // Store in cache
        await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(sessions));

        console.log(`[cache-warm] Week ${config.weekOffset}: Cached ${sessions.length} sessions`);
        return { status: 'warmed' as const };
      } catch (error) {
        const msg = `Week ${config.weekOffset} failed: ${error}`;
        console.error(`[cache-warm] ${msg}`);
        return { status: 'error' as const, error: msg };
      }
    });

    const results = await Promise.all(warmPromises);

    for (const result of results) {
      if (result.status === 'warmed') warmed++;
      else if (result.status === 'skipped') skipped++;
      else if (result.status === 'error') errors.push(result.error);
    }

    return {
      success: errors.length === 0,
      warmed,
      skipped,
      errors,
      duration: Date.now() - startTime,
    };
  } catch (error) {
    console.error('[cache-warm] Fatal error:', error);
    return {
      success: false,
      warmed,
      skipped,
      errors: [String(error)],
      duration: Date.now() - startTime,
    };
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Only allow GET (Vercel Cron uses GET)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify cron secret (Vercel automatically adds this header for cron jobs)
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env['CRON_SECRET'];

  // In production, verify the secret
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('[cache-warm] Unauthorized request');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('[cache-warm] Starting cache warming...');

  try {
    const result = await warmCache();

    console.log(
      `[cache-warm] Complete: ${result.warmed} warmed, ${result.skipped} skipped, ${result.errors.length} errors, ${result.duration}ms`
    );

    return res.status(result.success ? 200 : 207).json({
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[cache-warm] Handler error:', error);
    return res.status(500).json({ error: 'Internal error' });
  }
}
