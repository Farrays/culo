import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/**
 * API Route: /api/mi-reserva
 *
 * Obtiene los detalles de una reserva usando el magic link token.
 *
 * Query params:
 * - token: Token de gestión único (requerido)
 *
 * Respuesta exitosa:
 * {
 *   success: true,
 *   booking: {
 *     eventId, firstName, className, classDate, classTime,
 *     status, createdAt
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
  eventId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  sessionId: string | null;
  momenceBookingId: number | null;
  category: string;
  managementToken: string;
  createdAt: string;
  status: 'confirmed' | 'cancelled';
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
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Token requerido',
    });
  }

  const redis = getRedisClient();
  if (!redis) {
    console.error('[mi-reserva] Redis not configured');
    return res.status(500).json({
      success: false,
      error: 'Error de configuración del servidor',
    });
  }

  try {
    // 1. Buscar eventId por token
    const eventId = await redis.get(`mgmt:${token}`);

    if (!eventId) {
      return res.status(404).json({
        success: false,
        error: 'Reserva no encontrada o enlace expirado',
      });
    }

    // 2. Obtener detalles de la reserva
    const bookingData = await redis.get(`booking_details:${eventId}`);

    if (!bookingData) {
      return res.status(404).json({
        success: false,
        error: 'Datos de reserva no encontrados',
      });
    }

    const booking: BookingDetails = JSON.parse(bookingData);

    // Extract ISO date for calendar generation (YYYY-MM-DD)
    const classDateISOMatch = booking.classDate?.match(/\d{4}-\d{2}-\d{2}/);
    const classDateISO = classDateISOMatch ? classDateISOMatch[0] : undefined;

    // 3. Devolver datos públicos (sin datos sensibles como phone/email completos)
    return res.status(200).json({
      success: true,
      booking: {
        eventId: booking.eventId,
        firstName: booking.firstName,
        className: booking.className,
        classDate: booking.classDate,
        classDateISO, // For calendar generation
        classTime: booking.classTime,
        category: booking.category,
        status: booking.status,
        createdAt: booking.createdAt,
        // Para mostrar parcialmente
        emailMasked: maskEmail(booking.email),
      },
    });
  } catch (error) {
    console.error('[mi-reserva] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Error al obtener la reserva',
    });
  }
}

/**
 * Enmascara un email para mostrar parcialmente
 * ejemplo@gmail.com → ej***@gmail.com
 */
function maskEmail(email: string): string {
  const parts = email.split('@');
  const local = parts[0];
  const domain = parts[1];
  if (!local || !domain) return '***@***';

  const visibleChars = Math.min(2, local.length);
  const masked = local.substring(0, visibleChars) + '***';

  return `${masked}@${domain}`;
}
