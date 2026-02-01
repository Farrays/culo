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
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
        message: 'No se encontró ninguna reserva con este enlace',
      });
    }

    const booking: BookingDetails = JSON.parse(bookingDataStr);

    // Verificar que el email coincide (seguridad)
    if (booking.email.toLowerCase() !== email.toLowerCase()) {
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
        classDate: booking.classDate,
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
