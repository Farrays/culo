import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/* eslint-disable no-undef */
// Note: Buffer and URLSearchParams are Node.js globals available in Vercel serverless functions

/**
 * API Route: /api/clases
 *
 * Devuelve las clases disponibles de Momence para los próximos 7 días.
 * Usa búsqueda binaria para encontrar eficientemente las sesiones actuales.
 *
 * Query params:
 * - style: Filtrar por estilo de baile (ej: "dancehall", "heels", "salsa")
 * - days: Número de días a mostrar (default: 7, max: 14)
 *
 * Variables de entorno requeridas:
 * - MOMENCE_CLIENT_ID
 * - MOMENCE_CLIENT_SECRET
 * - MOMENCE_USERNAME
 * - MOMENCE_PASSWORD
 * - STORAGE_REDIS_URL (opcional, para caché)
 */

const MOMENCE_API_URL = 'https://api.momence.com';
const MOMENCE_AUTH_URL = 'https://api.momence.com/api/v2/auth/token';

// Cache TTL: 30 minutos (las clases no cambian muy frecuentemente)
const CACHE_TTL_SECONDS = 30 * 60;
const CACHE_KEY = 'momence:sessions:cache';
const TOKEN_CACHE_KEY = 'momence:access_token';
const TOKEN_TTL_SECONDS = 3500; // Token expira en 3600s, refrescamos antes

// Timezone para España (hora de Madrid)
const SPAIN_TIMEZONE = 'Europe/Madrid';

// Lazy Redis connection
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

// Tipos
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

interface NormalizedClass {
  id: number;
  name: string;
  date: string;
  time: string;
  dayOfWeek: string;
  spotsAvailable: number;
  isFull: boolean;
  location: string;
  instructor: string;
  style: string;
  level: string;
  rawStartsAt: string;
  description: string;
  duration: number;
}

// Mapeo de estilos (normalización)
const STYLE_KEYWORDS: Record<string, string[]> = {
  dancehall: ['dancehall', 'dance hall'],
  heels: ['heels', 'tacones', 'stiletto'],
  salsa: ['salsa'],
  bachata: ['bachata'],
  hiphop: ['hip hop', 'hip-hop', 'hiphop', 'urban'],
  reggaeton: ['reggaeton', 'reggaetón', 'perreo'],
  afro: ['afro', 'afrobeat', 'afrodance'],
  commercial: ['commercial', 'comercial'],
  kpop: ['k-pop', 'kpop', 'k pop'],
  twerk: ['twerk', 'twerkeo'],
  girly: ['girly', 'sexy style'],
  breaking: ['breaking', 'breakdance', 'bboy'],
  house: ['house'],
  locking: ['locking'],
  popping: ['popping'],
  waacking: ['waacking', 'waacking'],
  yoga: ['yoga'],
  pilates: ['pilates'],
  stretching: ['stretching', 'estiramientos', 'flexibilidad'],
};

// Mapeo de niveles
const LEVEL_KEYWORDS: Record<string, string[]> = {
  iniciacion: ['iniciación', 'iniciacion', 'principiante', 'beginner', 'intro'],
  basico: ['básico', 'basico', 'basic', 'nivel 1'],
  intermedio: ['intermedio', 'intermediate', 'nivel 2'],
  avanzado: ['avanzado', 'advanced', 'nivel 3', 'pro'],
  abierto: ['abierto', 'open', 'todos los niveles', 'all levels'],
};

function detectStyle(name: string): string {
  const lowerName = name.toLowerCase();
  for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return style;
    }
  }
  return 'otros';
}

function detectLevel(name: string): string {
  const lowerName = name.toLowerCase();
  for (const [level, keywords] of Object.entries(LEVEL_KEYWORDS)) {
    if (keywords.some(kw => lowerName.includes(kw))) {
      return level;
    }
  }
  return 'abierto';
}

function normalizeSession(session: MomenceSession): NormalizedClass {
  const startDate = new Date(session.startsAt);
  const endDate = new Date(session.endsAt);

  // Calculate duration in minutes
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationMinutes = Math.round(durationMs / (1000 * 60));

  // Formatear día de la semana con timezone de España
  const dayFormatter = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    timeZone: SPAIN_TIMEZONE,
  });
  const dayNameRaw = dayFormatter.format(startDate);
  // Capitalizar primera letra
  const dayOfWeek = dayNameRaw.charAt(0).toUpperCase() + dayNameRaw.slice(1);

  return {
    id: session.id,
    name: session.name,
    date: startDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      timeZone: SPAIN_TIMEZONE,
    }),
    time: startDate.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: SPAIN_TIMEZONE,
    }),
    dayOfWeek,
    spotsAvailable: Math.max(0, session.capacity - session.bookingCount),
    isFull: session.bookingCount >= session.capacity,
    location: session.locationName || "Farray's Center",
    instructor: session.teacher
      ? `${session.teacher.firstName} ${session.teacher.lastName}`.trim()
      : '',
    style: detectStyle(session.name),
    level: detectLevel(session.name),
    rawStartsAt: session.startsAt,
    description: session.description || '',
    duration: durationMinutes > 0 ? durationMinutes : 60, // Default 60 min if invalid
  };
}

// Obtener token de acceso (con caché)
async function getAccessToken(): Promise<string | null> {
  const { MOMENCE_CLIENT_ID, MOMENCE_CLIENT_SECRET, MOMENCE_USERNAME, MOMENCE_PASSWORD } =
    process.env;

  if (!MOMENCE_CLIENT_ID || !MOMENCE_CLIENT_SECRET || !MOMENCE_USERNAME || !MOMENCE_PASSWORD) {
    console.error('Missing Momence OAuth credentials');
    return null;
  }

  // Intentar obtener token de caché
  const redis = getRedisClient();
  if (redis) {
    try {
      const cachedToken = await redis.get(TOKEN_CACHE_KEY);
      if (cachedToken) {
        return cachedToken;
      }
    } catch (e) {
      console.warn('Redis token cache lookup failed:', e);
    }
  }

  // Obtener nuevo token
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
      console.error('Momence auth failed:', response.status);
      return null;
    }

    const data = await response.json();
    const token = data.access_token;

    // Guardar en caché
    if (redis && token) {
      try {
        await redis.setex(TOKEN_CACHE_KEY, TOKEN_TTL_SECONDS, token);
      } catch (e) {
        console.warn('Redis token cache save failed:', e);
      }
    }

    return token;
  } catch (error) {
    console.error('Momence auth error:', error);
    return null;
  }
}

// Fetch a single page from Momence API with date range info
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
// Momence returns ALL sessions (past and future) sorted by date, so we need
// to find the right page instead of always starting from page 0
async function findStartPage(
  accessToken: string,
  targetDate: Date
): Promise<{ page: number; totalPages: number }> {
  const firstPage = await fetchPageWithDateRange(accessToken, 0);
  if (firstPage.totalPages === 0) return { page: 0, totalPages: 0 };

  const totalPages = firstPage.totalPages;

  // If page 0 already contains or is after our target date, start from 0
  if (firstPage.minDate && firstPage.minDate >= targetDate) {
    return { page: 0, totalPages };
  }
  if (firstPage.maxDate && firstPage.maxDate >= targetDate) {
    return { page: 0, totalPages };
  }

  // Binary search for the correct page
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

    // If target date is within this page's range, found it
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

// Fetch future sessions using binary search to find the correct starting page
async function fetchFutureSessions(
  accessToken: string,
  daysAhead: number,
  weekOffset: number = 0
): Promise<MomenceSession[]> {
  // Calculate date range based on weekOffset
  // Use Spain timezone for consistent date calculations
  const now = new Date();
  const spainFormatter = new Intl.DateTimeFormat('es-ES', {
    timeZone: SPAIN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const spainDateStr = spainFormatter.format(now);
  const parts = spainDateStr.split('/').map(Number);
  const day = parts[0] ?? 1;
  const month = parts[1] ?? 1;
  const year = parts[2] ?? new Date().getFullYear();
  const baseDate = new Date(year, month - 1, day, 0, 0, 0, 0);

  const startDate = new Date(baseDate.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000);
  const futureLimit = new Date(startDate.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  // For week 0, filter from NOW (Spain time); for other weeks, filter from startDate
  const filterFromDate = weekOffset === 0 ? now : startDate;

  console.warn('[clases] fetchFutureSessions params:', {
    weekOffset,
    daysAhead,
    now: now.toISOString(),
    baseDate: baseDate.toISOString(),
    startDate: startDate.toISOString(),
    futureLimit: futureLimit.toISOString(),
    filterFromDate: filterFromDate.toISOString(),
  });

  // Find the page that contains our target date using binary search
  const { page: startPage, totalPages } = await findStartPage(accessToken, filterFromDate);

  console.warn('[clases] Binary search result:', {
    startPage,
    totalPages,
    filterFromDate: filterFromDate.toISOString(),
  });

  if (totalPages === 0) {
    console.warn('[clases] No pages found in Momence');
    return [];
  }

  // Fetch pages starting from the found page until we have enough sessions
  const allSessions: MomenceSession[] = [];
  let currentPage = startPage;
  const maxPagesToFetch = 10;
  let pagesFetched = 0;

  while (currentPage < totalPages && pagesFetched < maxPagesToFetch) {
    const pageData = await fetchPageWithDateRange(accessToken, currentPage);
    pagesFetched++;

    if (pageData.sessions.length === 0) break;

    // Filter to only sessions within our date range
    const relevantSessions = pageData.sessions.filter(s => {
      const d = new Date(s.startsAt);
      return d >= filterFromDate && d <= futureLimit;
    });

    allSessions.push(...relevantSessions);

    if (pagesFetched === 1) {
      console.warn('[clases] First page sessions:', {
        page: currentPage,
        totalOnPage: pageData.sessions.length,
        filteredCount: relevantSessions.length,
        pageMinDate: pageData.minDate?.toISOString(),
        pageMaxDate: pageData.maxDate?.toISOString(),
        firstSessionDate: relevantSessions[0]
          ? new Date(relevantSessions[0].startsAt).toISOString()
          : null,
      });
    }

    // If the last session on this page is past our future limit, stop
    if (pageData.maxDate && pageData.maxDate > futureLimit) {
      break;
    }

    currentPage++;
  }

  // Sort by start time
  const sorted = allSessions.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );

  const lastSession = sorted.length > 0 ? sorted[sorted.length - 1] : null;
  console.warn('[clases] Final result:', {
    weekOffset,
    totalSessions: sorted.length,
    firstDate: sorted[0] ? new Date(sorted[0].startsAt).toISOString() : null,
    lastDate: lastSession ? new Date(lastSession.startsAt).toISOString() : null,
  });

  return sorted;
}

// Background refresh function (stale-while-revalidate)
async function refreshCacheInBackground(
  redis: Redis,
  cacheKey: string,
  accessToken: string,
  daysAhead: number,
  weekOffset: number
): Promise<void> {
  try {
    const freshSessions = await fetchFutureSessions(accessToken, daysAhead, weekOffset);
    await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(freshSessions));
  } catch (error) {
    console.warn('[clases] Background refresh failed:', error);
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers - NO CACHE to ensure fresh data
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');

  try {
    const { style, days, week } = req.query;
    const daysAhead = Math.min(14, Math.max(1, parseInt(days as string) || 7));
    const weekOffset = Math.min(4, Math.max(0, parseInt(week as string) || 0));
    const styleFilter = style ? String(style).toLowerCase() : null;

    console.warn('[clases] Request received:', {
      rawWeek: week,
      parsedWeekOffset: weekOffset,
      daysAhead,
      styleFilter,
    });

    // Get today's date in Spain timezone for cache key
    const now = new Date();
    const spainDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: SPAIN_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now); // Format: YYYY-MM-DD

    // Cache key includes today's date to ensure fresh data each day
    const redis = getRedisClient();
    const cacheKey = `${CACHE_KEY}:${spainDate}:${daysAhead}:week${weekOffset}`;

    let sessions: MomenceSession[];
    let fromCache = false;

    if (redis) {
      try {
        // Check cache and TTL in parallel for speed
        const [cached, ttl] = await Promise.all([redis.get(cacheKey), redis.ttl(cacheKey)]);

        if (cached) {
          const parsedSessions = JSON.parse(cached);

          // If cache has 0 sessions, it might be stale - fetch fresh data
          if (parsedSessions.length === 0) {
            const accessToken = await getAccessToken();
            if (accessToken) {
              sessions = await fetchFutureSessions(accessToken, daysAhead, weekOffset);
              // Only cache if we got results (don't cache empty results)
              if (sessions.length > 0) {
                await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(sessions));
              } else {
                // Delete the empty cache entry so next request tries again
                await redis.del(cacheKey);
              }
            } else {
              sessions = parsedSessions;
              fromCache = true;
            }
          } else {
            sessions = parsedSessions;
            fromCache = true;

            // STALE-WHILE-REVALIDATE: If cache expires in < 5 min, refresh in background
            // User gets instant response, cache stays fresh
            if (ttl > 0 && ttl < 300) {
              const accessToken = await getAccessToken();
              if (accessToken) {
                // Don't await - let it run in background
                refreshCacheInBackground(redis, cacheKey, accessToken, daysAhead, weekOffset);
              }
            }
          }
        } else {
          // Cache miss - fetch fresh data
          const accessToken = await getAccessToken();
          if (!accessToken) {
            return res.status(503).json({ error: 'Unable to authenticate with Momence' });
          }
          sessions = await fetchFutureSessions(accessToken, daysAhead, weekOffset);
          await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(sessions));
        }
      } catch (e) {
        console.warn('Redis cache error:', e);
        // Fallback: fetch directly from Momence
        const accessToken = await getAccessToken();
        if (!accessToken) {
          return res.status(503).json({ error: 'Unable to authenticate with Momence' });
        }
        sessions = await fetchFutureSessions(accessToken, daysAhead, weekOffset);
      }
    } else {
      // No Redis - fetch directly
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return res.status(503).json({ error: 'Unable to authenticate with Momence' });
      }
      sessions = await fetchFutureSessions(accessToken, daysAhead, weekOffset);
    }

    // Normalizar sesiones
    let classes = sessions.map(normalizeSession);

    // Filtrar por estilo si se especifica
    if (styleFilter) {
      classes = classes.filter(c => c.style === styleFilter);
    }

    // Filtrar solo clases con plazas disponibles
    const availableClasses = classes.filter(c => !c.isFull);

    // Agrupar por día para el frontend
    const byDay: Record<string, NormalizedClass[]> = {};
    availableClasses.forEach(c => {
      const dayKey = c.rawStartsAt.split('T')[0] ?? '';
      if (dayKey) {
        if (!byDay[dayKey]) byDay[dayKey] = [];
        byDay[dayKey].push(c);
      }
    });

    // Obtener estilos únicos disponibles
    const stylesAvailable = [...new Set(classes.map(c => c.style))].sort();

    return res.status(200).json({
      success: true,
      fromCache, // For monitoring cache hit rate
      data: {
        classes: availableClasses,
        byDay,
        total: availableClasses.length,
        totalWithFull: classes.length,
        stylesAvailable,
        filters: {
          style: styleFilter,
          days: daysAhead,
        },
      },
    });
  } catch (error) {
    console.error('Classes API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
