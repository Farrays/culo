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

// Cache TTL: 15 minutos (las clases no cambian muy frecuentemente)
const CACHE_TTL_SECONDS = 15 * 60;
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

// Obtener fecha mínima/máxima de una página
async function getPageDateRange(
  accessToken: string,
  page: number
): Promise<{
  minDate: Date;
  maxDate: Date;
  totalPages: number;
  sessions: MomenceSession[];
} | null> {
  const response = await fetch(
    `${MOMENCE_API_URL}/api/v2/host/sessions?page=${page}&pageSize=100`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) return null;

  const data = await response.json();
  const sessions = data.payload || [];

  if (sessions.length === 0) return null;

  const dates = sessions.map((s: MomenceSession) => new Date(s.startsAt).getTime());
  return {
    minDate: new Date(Math.min(...dates)),
    maxDate: new Date(Math.max(...dates)),
    totalPages: Math.ceil(data.pagination.totalCount / 100),
    sessions,
  };
}

// Búsqueda binaria para encontrar la página con sesiones actuales
async function findCurrentPage(
  accessToken: string,
  targetDate: Date
): Promise<{ page: number; totalPages: number }> {
  const firstPage = await getPageDateRange(accessToken, 0);
  if (!firstPage) return { page: 0, totalPages: 0 };

  const totalPages = firstPage.totalPages;
  let left = 0;
  let right = totalPages - 1;
  let resultPage = 0;
  let iterations = 0;

  while (left <= right && iterations < 20) {
    iterations++;
    const mid = Math.floor((left + right) / 2);

    const pageData = await getPageDateRange(accessToken, mid);
    if (!pageData) {
      right = mid - 1;
      continue;
    }

    if (pageData.minDate <= targetDate && targetDate <= pageData.maxDate) {
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

// Obtener sesiones futuras
async function fetchFutureSessions(
  accessToken: string,
  daysAhead: number,
  weekOffset: number = 0
): Promise<MomenceSession[]> {
  // Calcular fecha de inicio basada en weekOffset
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  const startDate = new Date(baseDate.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000);
  const futureLimit = new Date(startDate.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  // Para week 0, usar now; para otras semanas, usar startDate
  const filterFromDate = weekOffset === 0 ? new Date() : startDate;

  const { page: startPage, totalPages } = await findCurrentPage(accessToken, startDate);

  const allSessions: MomenceSession[] = [];
  let currentPage = startPage;
  const maxPagesToFetch = 10;
  let pagesWithFutureSessions = 0;

  while (currentPage < totalPages && pagesWithFutureSessions < maxPagesToFetch) {
    const response = await fetch(
      `${MOMENCE_API_URL}/api/v2/host/sessions?page=${currentPage}&pageSize=100`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) break;

    const data = await response.json();
    const sessions = data.payload || [];

    if (sessions.length === 0) break;

    const futureSessions = sessions.filter(
      (s: MomenceSession) => new Date(s.startsAt) >= filterFromDate
    );

    if (futureSessions.length > 0) {
      allSessions.push(...futureSessions);
      pagesWithFutureSessions++;

      const lastSession = futureSessions[futureSessions.length - 1];
      if (new Date(lastSession.startsAt) > futureLimit) {
        break;
      }
    }

    currentPage++;
  }

  // Filtrar al rango deseado y ordenar
  return allSessions
    .filter(s => {
      const d = new Date(s.startsAt);
      return d >= filterFromDate && d <= futureLimit;
    })
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
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
    const { style, days, week } = req.query;
    const daysAhead = Math.min(14, Math.max(1, parseInt(days as string) || 7));
    const weekOffset = Math.min(4, Math.max(0, parseInt(week as string) || 0));
    const styleFilter = style ? String(style).toLowerCase() : null;

    // Intentar obtener de caché (incluye weekOffset para cache diferenciado por semana)
    const redis = getRedisClient();
    const cacheKey = `${CACHE_KEY}:${daysAhead}:week${weekOffset}`;

    let sessions: MomenceSession[];

    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          sessions = JSON.parse(cached);
        } else {
          const accessToken = await getAccessToken();
          if (!accessToken) {
            return res.status(503).json({ error: 'Unable to authenticate with Momence' });
          }
          sessions = await fetchFutureSessions(accessToken, daysAhead, weekOffset);
          await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(sessions));
        }
      } catch (e) {
        console.warn('Redis cache error:', e);
        const accessToken = await getAccessToken();
        if (!accessToken) {
          return res.status(503).json({ error: 'Unable to authenticate with Momence' });
        }
        sessions = await fetchFutureSessions(accessToken, daysAhead, weekOffset);
      }
    } else {
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
