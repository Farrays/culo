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
  heels: ['heels', 'tacones', 'stiletto', 'sexy style', 'femmology'],
  reggaeton: ['reggaeton', 'reggaetón', 'perreo', 'sexy reggaeton', 'reggaeton cubano'],
  hiphop: ['hip hop', 'hip-hop', 'hiphop', 'urban', 'hip hop reggaeton'],
  afro: ['afrobeat', 'afrodance', 'afro jazz', 'afro dance'],
  girly: ['girly', 'femme'],
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

// Mapeo de estilo a categoría
// IMPORTANTE: Debe coincidir con constants/style-mappings.ts STYLE_TO_CATEGORY
const STYLE_TO_CATEGORY: Record<string, string> = {
  // Latino
  salsa: 'latino',
  bachata: 'latino',
  timba: 'latino',
  salsaladystyle: 'latino',
  folklore: 'latino',

  // Urbano
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

  // Danza
  ballet: 'danza',
  contemporaneo: 'danza',
  afrocontemporaneo: 'danza',
  jazz: 'danza',

  // Fitness
  stretching: 'fitness',
  yoga: 'fitness',
  pilates: 'fitness',
  fitness: 'fitness',
  cuerpofit: 'fitness',
  bumbum: 'fitness',
};

// Mapeo de estilo a slug de página
// IMPORTANTE: Debe coincidir con constants/style-mappings.ts STYLE_TO_PAGE_SLUG
const STYLE_TO_PAGE_SLUG: Record<string, string> = {
  // Latino
  bachata: 'bachata-barcelona',
  salsa: 'salsa-cubana-barcelona',
  timba: 'salsa-cubana-barcelona',
  salsaladystyle: 'salsa-cubana-barcelona',
  folklore: 'folklore-cubano-barcelona',

  // Urbano
  hiphop: 'hip-hop-barcelona',
  dancehall: 'dancehall-barcelona',
  heels: 'sexy-style-barcelona',
  reggaeton: 'sexy-reggaeton-barcelona',
  twerk: 'twerk-barcelona',
  afro: 'afrobeat-barcelona',
  girly: 'femmology-barcelona',
  kpop: 'hip-hop-barcelona',
  commercial: 'hip-hop-barcelona',
  breaking: 'hip-hop-barcelona',
  house: 'hip-hop-barcelona',
  locking: 'hip-hop-barcelona',
  popping: 'hip-hop-barcelona',
  waacking: 'hip-hop-barcelona',

  // Danza
  ballet: 'ballet-clasico-barcelona',
  contemporaneo: 'contemporaneo-barcelona',
  afrocontemporaneo: 'afro-contemporaneo-barcelona',
  jazz: 'modern-jazz-barcelona',

  // Fitness
  stretching: 'stretching-barcelona',
  fitness: 'cuerpo-fit',
  cuerpofit: 'acondicionamiento-fisico-bailarines',
  bumbum: 'ejercicios-gluteos-barcelona',
  yoga: 'stretching-barcelona',
  pilates: 'stretching-barcelona',
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

  // Get day of week in Spain timezone using Intl formatter
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    timeZone: SPAIN_TIMEZONE,
  });
  const dayNameEn = dayFormatter.format(startDate).toLowerCase();
  const dayKey = dayNameEn as keyof (typeof DAY_NAMES)['es'];

  // Get localized day name
  const localeDayNames = DAY_NAMES[locale] || DAY_NAMES['es'];
  const dayOfWeek = localeDayNames?.[dayKey] ?? 'Lunes';

  // Format date: "20 Ene" - with explicit timezone
  const dateFormatted = startDate.toLocaleDateString(locale === 'ca' ? 'ca-ES' : `${locale}-ES`, {
    day: 'numeric',
    month: 'short',
    timeZone: SPAIN_TIMEZONE,
  });

  // Format time: "19:00" - with explicit timezone
  const time = startDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: SPAIN_TIMEZONE,
  });

  const endTime = endDate.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: SPAIN_TIMEZONE,
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

// Fetch sessions from Momence API with native date filtering
// Uses startAfter/startBefore params for efficient server-side filtering
// This replaces the old binary search approach which made 10-20+ API calls
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
        console.warn(`[schedule] Momence API returned ${response.status}`);
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
      console.warn('[schedule] Error fetching page:', error);
      break;
    }
  }

  // Sessions are already sorted by Momence API (sortBy=startsAt)
  return allSessions;
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
    const { style, days, locale, startHour, endHour } = req.query;
    const daysAhead = Math.min(28, Math.max(1, parseInt(days as string) || 14));
    const styleFilter = style ? String(style).toLowerCase() : null;
    const localeStr = (locale as string) || 'es';
    const startHourFilter = startHour ? parseInt(startHour as string) : null;
    const endHourFilter = endHour ? parseInt(endHour as string) : null;

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

    // Filtrar por rango horario (para páginas como "clases de mañanas")
    if (startHourFilter !== null || endHourFilter !== null) {
      scheduleSessions = scheduleSessions.filter(s => {
        const hour = parseInt(s.time.split(':')[0] ?? '0');
        if (startHourFilter !== null && hour < startHourFilter) return false;
        if (endHourFilter !== null && hour >= endHourFilter) return false;
        return true;
      });
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
