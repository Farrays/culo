import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/**
 * API endpoint para obtener datos de reserva por email
 * GET /api/mi-reserva?email=xxx&event=yyy
 *
 * Retorna los datos de la reserva almacenados en Redis
 * para mostrar en la página de gestión de reserva
 */

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  className: string;
  classDate: string;
  classTime: string;
  momenceEventId: string;
  bookedAt: string;
  category?: string;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const email = req.query['email'] as string;
  const eventId = req.query['event'] as string;

  if (!email) {
    return res.status(400).json({ error: 'Email parameter required' });
  }

  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  let redis: Redis | null = null;

  try {
    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
    });

    const bookingKey = `booking:${email.toLowerCase()}`;
    const bookingDataStr = await redis.get(bookingKey);

    if (!bookingDataStr) {
      return res.status(404).json({
        error: 'Booking not found',
        message: 'No se encontró ninguna reserva con este email',
      });
    }

    const bookingData: BookingData = JSON.parse(bookingDataStr);

    // Validar que el eventId coincida (si se proporciona)
    if (eventId && bookingData.momenceEventId !== eventId) {
      return res.status(404).json({
        error: 'Booking mismatch',
        message: 'El evento no coincide con la reserva encontrada',
      });
    }

    // No devolver datos sensibles completos
    return res.status(200).json({
      success: true,
      booking: {
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        email: bookingData.email,
        // Enmascarar teléfono parcialmente
        phone: bookingData.phone
          ? bookingData.phone.slice(0, 4) + '***' + bookingData.phone.slice(-2)
          : null,
        className: bookingData.className,
        classDate: bookingData.classDate,
        classTime: bookingData.classTime,
        momenceEventId: bookingData.momenceEventId,
        bookedAt: bookingData.bookedAt,
        category: bookingData.category,
      },
    });
  } catch (error) {
    console.error('Redis error:', error);
    return res.status(500).json({ error: 'Server error' });
  } finally {
    if (redis) {
      await redis.quit();
    }
  }
}
