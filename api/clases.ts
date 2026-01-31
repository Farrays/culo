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
const MOMENCE_BUSINESS_SLUG = "Farray's-International-Dance-Center";

// Cache TTL: 30 minutos (las clases no cambian muy frecuentemente)
const CACHE_TTL_SECONDS = 30 * 60;
const CACHE_KEY = 'momence:sessions:cache';
const TOKEN_CACHE_KEY = 'momence:access_token';
const TOKEN_TTL_SECONDS = 3500; // Token expira en 3600s, refrescamos antes

// Timezone para España (hora de Madrid)
const SPAIN_TIMEZONE = 'Europe/Madrid';

// Convertir nombre de clase a slug para URL de Momence
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Solo alfanuméricos, espacios y guiones
    .trim()
    .replace(/\s+/g, '-'); // Espacios a guiones
}

// Construir URL de checkout de Momence para una sesión específica
function buildMomenceCheckoutUrl(sessionId: number, sessionName: string): string {
  const nameSlug = slugify(sessionName);
  return `https://momence.com/${MOMENCE_BUSINESS_SLUG}/${nameSlug}/${sessionId}`;
}

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
  /** URL directa al checkout de Momence para esta sesión */
  checkoutUrl: string;
}

// Mapeo de estilos (normalización)
// IMPORTANTE: Debe coincidir con constants/style-mappings.ts STYLE_KEYWORDS
// El orden importa - los estilos más específicos deben ir primero
const STYLE_KEYWORDS: Record<string, string[]> = {
  // Danza - específicos primero
  afrocontemporaneo: ['afro contemporáneo', 'afro contemporaneo', 'afro contemp'],
  ballet: ['ballet', 'ballet clásico', 'ballet clasico'],
  contemporaneo: ['contemporáneo', 'contemporaneo', 'contemporary', 'contemp'],
  jazz: ['jazz', 'modern jazz', 'modern-jazz'],

  // Latino - específicos primero
  timba: ['timba', 'timba cubana'],
  salsaladystyle: ['salsa lady', 'lady style', 'salsa ladies', 'ladies styling'],
  salsa: ['salsa cubana', 'salsa'],
  bachata: ['bachata', 'bachata sensual', 'bachata lady'],
  folklore: ['folklore', 'folklore cubano'],

  // Urbano
  dancehall: ['dancehall', 'dance hall'],
  // Reggaeton variants - específicos primero
  hiphopreggaeton: ['hip hop reggaeton', 'hip-hop reggaeton', 'hiphop reggaeton'],
  sexyreggaeton: ['sexy reggaeton', 'sexy reggaetón'],
  reparto: ['reparto', 'reggaeton', 'reggaetón', 'perreo'],
  hiphop: ['hip hop', 'hip-hop', 'hiphop', 'urban'],
  afro: ['afrobeat', 'afrodance', 'afro jazz', 'afro dance'],
  girly: ['girly'],

  // Heels category - específicos primero
  sexystyle: ['sexy style', 'sexy-style'],
  femmology: ['femmology'],
  heels: ['heels', 'tacones', 'stiletto'],
  twerk: ['twerk', 'twerkeo'],
  commercial: ['commercial', 'comercial'],
  kpop: ['k-pop', 'kpop', 'k pop'],
  breaking: ['breaking', 'breakdance', 'bboy'],
  house: ['house dance'],
  locking: ['locking'],
  popping: ['popping'],
  waacking: ['waacking'],

  // Fitness - específicos primero
  cuerpofit: ['cuerpo fit', 'cuerpofit', 'body conditioning'],
  bumbum: ['bum bum', 'bumbum', 'glúteos', 'gluteos'],
  fitness: ['fitness', 'full body', 'cardio'],
  stretching: ['stretching', 'estiramientos', 'flexibilidad'],
  yoga: ['yoga'],
  pilates: ['pilates'],
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
    checkoutUrl: buildMomenceCheckoutUrl(session.id, session.name),
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

// Fetch sessions from Momence API with native date filtering
// Uses startAfter/startBefore params for efficient server-side filtering
async function fetchFutureSessions(
  accessToken: string,
  daysAhead: number
): Promise<MomenceSession[]> {
  const now = new Date();
  const futureLimit = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  // Format dates for Momence API (ISO 8601)
  const startAfter = now.toISOString();
  const startBefore = futureLimit.toISOString();

  const allSessions: MomenceSession[] = [];
  let page = 0;
  let hasMore = true;

  // Fetch pages until we have all sessions in the date range
  // Using Momence's native filtering: startAfter, startBefore, sortBy
  while (hasMore && page < 5) {
    // Max 5 pages (500 sessions) as safety limit
    try {
      const url = new URL(`${MOMENCE_API_URL}/api/v2/host/sessions`);
      url.searchParams.set('page', page.toString());
      url.searchParams.set('pageSize', '100');
      url.searchParams.set('startAfter', startAfter);
      url.searchParams.set('startBefore', startBefore);
      url.searchParams.set('sortBy', 'startsAt');
      url.searchParams.set('sortOrder', 'ASC');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`[clases] Momence API returned ${response.status}`);
        break;
      }

      const data = await response.json();
      const sessions = data.payload || [];
      allSessions.push(...sessions);

      // Check if there are more pages
      const totalCount = data.pagination?.totalCount || 0;
      const fetchedCount = (page + 1) * 100;
      hasMore = fetchedCount < totalCount && sessions.length === 100;
      page++;
    } catch (error) {
      console.warn('[clases] Error fetching page:', error);
      break;
    }
  }

  // Sessions are already sorted by Momence API (sortBy=startsAt)
  return allSessions;
}

// Background refresh function (stale-while-revalidate)
async function refreshCacheInBackground(
  redis: Redis,
  cacheKey: string,
  accessToken: string,
  daysAhead: number
): Promise<void> {
  try {
    const freshSessions = await fetchFutureSessions(accessToken, daysAhead);
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

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  try {
    const { style } = req.query;
    // Always fetch 28 days - frontend handles week filtering
    const daysAhead = 28;
    const styleFilter = style ? String(style).toLowerCase() : null;

    // Simple cache key - all data for 28 days
    const redis = getRedisClient();
    const cacheKey = `${CACHE_KEY}:${daysAhead}`;

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
              sessions = await fetchFutureSessions(accessToken, daysAhead);
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
                refreshCacheInBackground(redis, cacheKey, accessToken, daysAhead);
              }
            }
          }
        } else {
          // Cache miss - fetch fresh data
          const accessToken = await getAccessToken();
          if (!accessToken) {
            return res.status(503).json({ error: 'Unable to authenticate with Momence' });
          }
          sessions = await fetchFutureSessions(accessToken, daysAhead);
          await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(sessions));
        }
      } catch (e) {
        console.warn('Redis cache error:', e);
        // Fallback: fetch directly from Momence
        const accessToken = await getAccessToken();
        if (!accessToken) {
          return res.status(503).json({ error: 'Unable to authenticate with Momence' });
        }
        sessions = await fetchFutureSessions(accessToken, daysAhead);
      }
    } else {
      // No Redis - fetch directly
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return res.status(503).json({ error: 'Unable to authenticate with Momence' });
      }
      sessions = await fetchFutureSessions(accessToken, daysAhead);
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
