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

// Fetch a single page with date range info
async function fetchPageWithDateRange(
  accessToken: string,
  page: number
): Promise<{
  sessions: MomenceSession[];
  totalPages: number;
  minDate: Date | null;
  maxDate: Date | null;
}> {
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

    if (!response.ok) {
      return { sessions: [], totalPages: 0, minDate: null, maxDate: null };
    }

    const data = await response.json();
    const sessions: MomenceSession[] = data.payload || [];
    const totalCount = data.pagination?.totalCount || 0;

    if (sessions.length === 0) {
      return {
        sessions: [],
        totalPages: Math.ceil(totalCount / 100),
        minDate: null,
        maxDate: null,
      };
    }

    const dates = sessions.map(s => new Date(s.startsAt).getTime());
    return {
      sessions,
      totalPages: Math.ceil(totalCount / 100),
      minDate: new Date(Math.min(...dates)),
      maxDate: new Date(Math.max(...dates)),
    };
  } catch {
    return { sessions: [], totalPages: 0, minDate: null, maxDate: null };
  }
}

// Binary search to find the page containing sessions for the target date
async function findStartPage(
  accessToken: string,
  targetDate: Date
): Promise<{ page: number; totalPages: number }> {
  const firstPage = await fetchPageWithDateRange(accessToken, 0);
  if (firstPage.totalPages === 0) return { page: 0, totalPages: 0 };

  const totalPages = firstPage.totalPages;

  if (firstPage.minDate && firstPage.minDate >= targetDate) {
    return { page: 0, totalPages };
  }
  if (firstPage.maxDate && firstPage.maxDate >= targetDate) {
    return { page: 0, totalPages };
  }

  let left = 0;
  let right = totalPages - 1;
  let resultPage = 0;
  let iterations = 0;

  while (left <= right && iterations < 20) {
    iterations++;
    const mid = Math.floor((left + right) / 2);
    const pageData = await fetchPageWithDateRange(accessToken, mid);

    if (!pageData.minDate) {
      right = mid - 1;
      continue;
    }

    if (pageData.minDate <= targetDate && pageData.maxDate && targetDate <= pageData.maxDate) {
      resultPage = mid;
      break;
    }

    if (pageData.minDate > targetDate) {
      right = mid - 1;
    } else {
      left = mid + 1;
      resultPage = mid;
    }
  }

  return { page: resultPage, totalPages };
}

// Fetch sessions for a specific week using binary search
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

  const { page: startPage, totalPages } = await findStartPage(accessToken, filterFromDate);

  if (totalPages === 0) return [];

  const allSessions: MomenceSession[] = [];
  let currentPage = startPage;
  const maxPagesToFetch = 10;
  let pagesFetched = 0;

  while (currentPage < totalPages && pagesFetched < maxPagesToFetch) {
    const pageData = await fetchPageWithDateRange(accessToken, currentPage);
    pagesFetched++;

    if (pageData.sessions.length === 0) break;

    const relevantSessions = pageData.sessions.filter(s => {
      const d = new Date(s.startsAt);
      return d >= filterFromDate && d <= futureLimit;
    });

    allSessions.push(...relevantSessions);

    if (pageData.maxDate && pageData.maxDate > futureLimit) {
      break;
    }

    currentPage++;
  }

  return allSessions.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
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
