/* eslint-disable no-undef */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/**
 * API Route: /api/schedule
 *
 * Devuelve los horarios de clases de Momence para mostrar en las páginas de clase.
 * Optimizado para mostrar sesiones con fechas específicas (ej: "Lun 20 Ene - 19:00").
 *
 * Query params:
 * - style: Filtrar por estilo de baile (ej: "bachata", "salsa", "hiphop")
 * - days: Número de días a mostrar (default: 14, max: 28)
 * - locale: Locale para formateo de fechas (default: "es")
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

// Cache TTL: 15 minutos
const CACHE_TTL_SECONDS = 15 * 60;
const SCHEDULE_CACHE_KEY = 'momence:schedule:cache';
const TOKEN_CACHE_KEY = 'momence:access_token';
const TOKEN_TTL_SECONDS = 3500;

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

// Response type for schedule endpoint
export interface ScheduleSession {
  id: number;
  name: string;
  style: string;
  level: string;
  instructor: string;
  instructorId?: number;
  // Date/time formatted for display
  dateFormatted: string; // "20 Ene"
  dayKey: string; // "monday" for i18n
  dayOfWeek: string; // "Lunes" (localized)
  time: string; // "19:00"
  endTime: string; // "20:00"
  // Availability
  spotsAvailable: number;
  isFull: boolean;
  capacity: number;
  // Raw data for sorting/filtering
  rawStartsAt: string;
  duration: number;
  // Derived
  category: string;
  pageSlug: string; // Link to class page
}

// Mapeo de estilos (normalización) - extendido
const STYLE_KEYWORDS: Record<string, string[]> = {
  dancehall: ['dancehall', 'dance hall'],
  heels: ['heels', 'tacones', 'stiletto', 'sexy style'],
  salsa: ['salsa', 'salsa cubana', 'timba'],
  bachata: ['bachata', 'bachata sensual', 'bachata lady'],
  hiphop: ['hip hop', 'hip-hop', 'hiphop', 'urban', 'hip hop reggaeton'],
  reggaeton: ['reggaeton', 'reggaetón', 'perreo', 'sexy reggaeton'],
  afro: ['afro', 'afrobeat', 'afrodance', 'afro contemporáneo', 'afro jazz'],
  commercial: ['commercial', 'comercial'],
  kpop: ['k-pop', 'kpop', 'k pop'],
  twerk: ['twerk', 'twerkeo', 'bum bum'],
  girly: ['girly', 'femmology', 'femme'],
  breaking: ['breaking', 'breakdance', 'bboy'],
  house: ['house'],
  locking: ['locking'],
  popping: ['popping'],
  waacking: ['waacking'],
  yoga: ['yoga'],
  pilates: ['pilates'],
  stretching: ['stretching', 'estiramientos', 'flexibilidad'],
  ballet: ['ballet', 'ballet clásico'],
  contemporaneo: ['contemporáneo', 'contemporaneo', 'contemporary', 'modern jazz'],
  jazz: ['jazz', 'modern jazz'],
  folklore: ['folklore', 'folklore cubano'],
  fitness: ['fitness', 'full body', 'cardio', 'cuerpo fit'],
};

// Mapeo de niveles
const LEVEL_KEYWORDS: Record<string, string[]> = {
  iniciacion: ['iniciación', 'iniciacion', 'principiante', 'beginner', 'intro'],
  basico: ['básico', 'basico', 'basic', 'nivel 1'],
  intermedio: ['intermedio', 'intermediate', 'nivel 2'],
  avanzado: ['avanzado', 'advanced', 'nivel 3', 'pro'],
  abierto: ['abierto', 'open', 'todos los niveles', 'all levels'],
};

// Mapeo de estilo a categoría
const STYLE_TO_CATEGORY: Record<string, string> = {
  salsa: 'latino',
  bachata: 'latino',
  timba: 'latino',
  folklore: 'latino',
  dancehall: 'urbano',
  heels: 'urbano',
  twerk: 'urbano',
  reggaeton: 'urbano',
  hiphop: 'urbano',
  afro: 'urbano',
  girly: 'urbano',
  kpop: 'urbano',
  commercial: 'urbano',
  breaking: 'urbano',
  house: 'urbano',
  locking: 'urbano',
  popping: 'urbano',
  waacking: 'urbano',
  ballet: 'danza',
  contemporaneo: 'danza',
  jazz: 'danza',
  stretching: 'fitness',
  yoga: 'fitness',
  pilates: 'fitness',
  fitness: 'fitness',
};

// Mapeo de estilo a slug de página
const STYLE_TO_PAGE_SLUG: Record<string, string> = {
  bachata: 'bachata-barcelona',
  salsa: 'salsa-cubana-barcelona',
  hiphop: 'hip-hop-barcelona',
  dancehall: 'dancehall-barcelona',
  heels: 'sexy-style-barcelona',
  reggaeton: 'sexy-reggaeton-barcelona',
  twerk: 'twerk-barcelona',
  afro: 'afrobeat-barcelona',
  ballet: 'ballet-clasico-barcelona',
  contemporaneo: 'contemporaneo-barcelona',
  jazz: 'modern-jazz-barcelona',
  girly: 'femmology-barcelona',
  stretching: 'stretching-barcelona',
  fitness: 'full-body-cardio-barcelona',
  folklore: 'folklore-cubano-barcelona',
};

// Day key mapping
const DAY_INDEX_TO_KEY: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
};

// Localized day names
const DAY_NAMES: Record<string, Record<string, string>> = {
  es: {
    sunday: 'Domingo',
    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
  },
  ca: {
    sunday: 'Diumenge',
    monday: 'Dilluns',
    tuesday: 'Dimarts',
    wednesday: 'Dimecres',
    thursday: 'Dijous',
    friday: 'Divendres',
    saturday: 'Dissabte',
  },
  en: {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
  },
  fr: {
    sunday: 'Dimanche',
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
  },
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

function normalizeSession(session: MomenceSession, locale: string = 'es'): ScheduleSession {
  const startDate = new Date(session.startsAt);
  const endDate = new Date(session.endsAt);

  // Calculate duration in minutes
  const durationMs = endDate.getTime() - startDate.getTime();
  const durationMinutes = Math.round(durationMs / (1000 * 60));

  // Get day key for i18n
  const dayIndex = startDate.getDay();
  const dayKey = DAY_INDEX_TO_KEY[dayIndex] ?? 'monday';

  // Get localized day name
  const localeDayNames = DAY_NAMES[locale] || DAY_NAMES['es'];
  const dayOfWeek = localeDayNames?.[dayKey] ?? 'Lunes';

  // Format date: "20 Ene"
  const dateFormatted = startDate.toLocaleDateString(locale === 'ca' ? 'ca-ES' : `${locale}-ES`, {
    day: 'numeric',
    month: 'short',
  });

  // Format time: "19:00"
  const time = startDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const endTime = endDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const style = detectStyle(session.name);
  const level = detectLevel(session.name);
  const category = STYLE_TO_CATEGORY[style] || 'urbano';
  const pageSlug = STYLE_TO_PAGE_SLUG[style] || '';

  return {
    id: session.id,
    name: session.name,
    style,
    level,
    instructor: session.teacher
      ? `${session.teacher.firstName} ${session.teacher.lastName}`.trim()
      : '',
    instructorId: session.teacher?.id,
    dateFormatted,
    dayKey,
    dayOfWeek,
    time,
    endTime,
    spotsAvailable: Math.max(0, session.capacity - session.bookingCount),
    isFull: session.bookingCount >= session.capacity,
    capacity: session.capacity,
    rawStartsAt: session.startsAt,
    duration: durationMinutes > 0 ? durationMinutes : 60,
    category,
    pageSlug,
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
  daysAhead: number
): Promise<MomenceSession[]> {
  const now = new Date();
  const futureLimit = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);

  const { page: startPage, totalPages } = await findCurrentPage(accessToken, now);

  const allSessions: MomenceSession[] = [];
  let currentPage = startPage;
  const maxPagesToFetch = 15; // Increased for more days
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

    const futureSessions = sessions.filter((s: MomenceSession) => new Date(s.startsAt) >= now);

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
      return d >= now && d <= futureLimit;
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

  // ISR-like caching strategy:
  // - s-maxage=300: CDN caches for 5 minutes
  // - stale-while-revalidate=900: Serve stale for 15 min while revalidating
  // - stale-if-error=86400: Serve stale for 24h if origin errors
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=900, stale-if-error=86400'
  );

  // Vary by query params for proper CDN caching
  res.setHeader('Vary', 'Accept-Encoding');

  try {
    const { style, days, locale } = req.query;
    const daysAhead = Math.min(28, Math.max(1, parseInt(days as string) || 14));
    const styleFilter = style ? String(style).toLowerCase() : null;
    const localeStr = (locale as string) || 'es';

    // Intentar obtener de caché
    const redis = getRedisClient();
    const cacheKey = `${SCHEDULE_CACHE_KEY}:${daysAhead}`;

    let sessions: MomenceSession[];

    if (redis) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          sessions = JSON.parse(cached);
        } else {
          const accessToken = await getAccessToken();
          if (!accessToken) {
            return res.status(503).json({
              success: false,
              error: 'Unable to authenticate with Momence',
              isEmpty: true,
              sessions: [],
            });
          }
          sessions = await fetchFutureSessions(accessToken, daysAhead);
          await redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(sessions));
        }
      } catch (e) {
        console.warn('Redis cache error:', e);
        const accessToken = await getAccessToken();
        if (!accessToken) {
          return res.status(503).json({
            success: false,
            error: 'Unable to authenticate with Momence',
            isEmpty: true,
            sessions: [],
          });
        }
        sessions = await fetchFutureSessions(accessToken, daysAhead);
      }
    } else {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        return res.status(503).json({
          success: false,
          error: 'Unable to authenticate with Momence',
          isEmpty: true,
          sessions: [],
        });
      }
      sessions = await fetchFutureSessions(accessToken, daysAhead);
    }

    // Normalizar sesiones
    let scheduleSessions = sessions.map(s => normalizeSession(s, localeStr));

    // Filtrar por estilo si se especifica
    if (styleFilter) {
      scheduleSessions = scheduleSessions.filter(s => s.style === styleFilter);
    }

    // Agrupar por fecha (para visualización)
    const byDate: Record<string, ScheduleSession[]> = {};
    scheduleSessions.forEach(s => {
      const dateKey = s.rawStartsAt.split('T')[0] ?? '';
      if (dateKey) {
        if (!byDate[dateKey]) byDate[dateKey] = [];
        byDate[dateKey].push(s);
      }
    });

    // Agrupar por día de la semana (para horario recurrente)
    const byDayOfWeek: Record<string, ScheduleSession[]> = {};
    scheduleSessions.forEach(s => {
      const key = s.dayKey;
      if (!byDayOfWeek[key]) byDayOfWeek[key] = [];
      byDayOfWeek[key].push(s);
    });

    // Obtener estilos únicos disponibles
    const stylesAvailable = [...new Set(scheduleSessions.map(s => s.style))].sort();

    // Obtener categorías disponibles
    const categoriesAvailable = [...new Set(scheduleSessions.map(s => s.category))].sort();

    const isEmpty = scheduleSessions.length === 0;

    return res.status(200).json({
      success: true,
      isEmpty,
      data: {
        sessions: scheduleSessions,
        byDate,
        byDayOfWeek,
        total: scheduleSessions.length,
        stylesAvailable,
        categoriesAvailable,
        filters: {
          style: styleFilter,
          days: daysAhead,
          locale: localeStr,
        },
      },
    });
  } catch (error) {
    console.error('Schedule API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      isEmpty: true,
      sessions: [],
    });
  }
}
