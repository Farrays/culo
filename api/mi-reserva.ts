import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/**
 * API Route: /api/mi-reserva
 *
 * Obtiene los detalles de una reserva usando email + eventId (magic link).
 *
 * Query params:
 * - email: Email del usuario (requerido)
 * - event: Event ID de la reserva (requerido)
 *
 * Respuesta exitosa:
 * {
 *   success: true,
 *   booking: {
 *     firstName, lastName, email, phone,
 *     className, classDate, classTime,
 *     momenceEventId, bookedAt, category
 *   }
 * }
 */

// Lazy Redis
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

interface BookingDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  category: string;
  calendarEventId?: string;
  createdAt: string;
}

/**
 * Formatea fecha ISO a formato español legible
 * "2026-02-26" → "26 de febrero de 2026"
 */
function formatDateSpanish(isoDate: string): string {
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  // Intentar parsear como ISO date
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    // Si no es parseable, devolver el original
    return isoDate;
  }

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
}

// Rate limiting constants
const RATE_LIMIT_WINDOW_SECONDS = 60; // 1 minute window
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute per IP (viewing booking)
const RATE_LIMIT_MAX_FAILURES = 5; // 5 failed lookups per minute per IP (brute-force detection)

/**
 * Check and increment rate limit using Redis
 * Returns true if rate limited, false if allowed
 */
async function checkRateLimit(
  redis: Redis,
  ip: string,
  type: 'requests' | 'failures'
): Promise<{ limited: boolean; current: number; max: number }> {
  const key = `ratelimit:mi-reserva:${type}:${ip}`;
  const max = type === 'requests' ? RATE_LIMIT_MAX_REQUESTS : RATE_LIMIT_MAX_FAILURES;

  try {
    const current = await redis.incr(key);
    if (current === 1) {
      // First request, set expiry
      await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    }
    return { limited: current > max, current, max };
  } catch {
    // If Redis fails, allow the request (fail open)
    return { limited: false, current: 0, max };
  }
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const email = req.query['email'] as string;
  const eventId = req.query['event'] as string;

  if (!email) {
    return res.status(400).json({
      success: false,
      error: 'Email parameter required',
    });
  }

  if (!eventId) {
    return res.status(400).json({
      success: false,
      error: 'Event parameter required',
    });
  }

  const redis = getRedisClient();

  // Get client IP for rate limiting
  const forwardedFor = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const clientIp =
    (typeof forwardedFor === 'string' ? forwardedFor.split(',')[0]?.trim() : forwardedFor?.[0]) ||
    (typeof realIp === 'string' ? realIp : realIp?.[0]) ||
    'unknown';

  // Check rate limit (requests per minute)
  if (redis) {
    const rateCheck = await checkRateLimit(redis, clientIp, 'requests');
    if (rateCheck.limited) {
      console.warn(
        `[mi-reserva] Rate limited IP: ${clientIp} (${rateCheck.current}/${rateCheck.max})`
      );
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        message: 'Demasiadas solicitudes. Por favor espera un momento.',
        retryAfter: RATE_LIMIT_WINDOW_SECONDS,
      });
    }

    // Check if this IP has too many failed lookups (brute-force protection)
    const failureKey = `ratelimit:mi-reserva:failures:${clientIp}`;
    const currentFailures = parseInt((await redis.get(failureKey)) || '0', 10);
    if (currentFailures >= RATE_LIMIT_MAX_FAILURES) {
      console.warn(
        `[mi-reserva] 🚫 Blocked IP due to too many failures: ${clientIp} (${currentFailures} failures)`
      );
      return res.status(429).json({
        success: false,
        error: 'Too many failed attempts',
        message: 'Demasiados intentos fallidos. Por favor espera un momento.',
        retryAfter: RATE_LIMIT_WINDOW_SECONDS,
      });
    }
  }
  if (!redis) {
    console.error('[mi-reserva] Redis not configured');
    return res.status(500).json({
      success: false,
      error: 'Error de configuración del servidor',
    });
  }

  try {
    // Buscar booking_details por eventId
    const bookingDataStr = await redis.get(`booking_details:${eventId}`);

    if (!bookingDataStr) {
      // Track failed lookup (potential brute-force)
      const failCheck = await checkRateLimit(redis, clientIp, 'failures');
      if (failCheck.limited) {
        console.warn(
          `[mi-reserva] ⚠️ Brute-force detected from IP: ${clientIp} (${failCheck.current} failures)`
        );
      }
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        message: 'No se encontró ninguna reserva con este enlace',
      });
    }

    const booking: BookingDetails = JSON.parse(bookingDataStr);

    // Verificar que el email coincide (seguridad)
    if (booking.email.toLowerCase() !== email.toLowerCase()) {
      // Track failed lookup (potential brute-force - found booking but wrong email)
      const failCheck = await checkRateLimit(redis, clientIp, 'failures');
      if (failCheck.limited) {
        console.warn(
          `[mi-reserva] ⚠️ Email enumeration detected from IP: ${clientIp} (${failCheck.current} failures)`
        );
      }
      return res.status(404).json({
        success: false,
        error: 'Booking mismatch',
        message: 'El email no coincide con la reserva encontrada',
      });
    }

    // Devolver datos para MyBookingPage
    // (enmascarar phone por privacidad)
    return res.status(200).json({
      success: true,
      booking: {
        firstName: booking.firstName,
        lastName: booking.lastName,
        email: booking.email,
        phone: booking.phone ? booking.phone.slice(0, 4) + '***' + booking.phone.slice(-2) : null,
        className: booking.className,
        classDate: formatDateSpanish(booking.classDate),
        classTime: booking.classTime,
        momenceEventId: eventId,
        bookedAt: booking.createdAt,
        category: booking.category,
      },
    });
  } catch (error) {
    console.error('[mi-reserva] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
}
