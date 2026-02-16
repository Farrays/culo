/**
 * Debug endpoint para ver qué hay en Redis
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

let redisClient: Redis | null = null;

function getRedis(): Redis {
  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) throw new Error('Missing STORAGE_REDIS_URL');

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
  }
  return redisClient;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  const redis = getRedis();
  const action = req.query['action'];

  try {
    // Si action=clear, limpia el token de Momence
    if (action === 'clear') {
      await redis.del('momence:access_token');
      await redis.del('momence:sessions:cache:28');
      return res.status(200).json({
        success: true,
        message: 'Momence token and sessions cache cleared',
      });
    }

    // Si action=bookings, lista todas las reservas
    if (action === 'bookings') {
      const bookingKeys = await redis.keys('booking:*');
      return res.status(200).json({
        success: true,
        count: bookingKeys.length,
        bookings: bookingKeys.map(k => k.replace('booking:', '')),
      });
    }

    // Si action=delete-booking&email=xxx, elimina una reserva específica
    if (action === 'delete-booking') {
      const email = req.query['email'] as string;
      if (!email) {
        return res.status(400).json({ success: false, error: 'Missing email parameter' });
      }
      const key = `booking:${email.toLowerCase()}`;
      const deleted = await redis.del(key);
      return res.status(200).json({
        success: true,
        deleted: deleted > 0,
        key,
      });
    }

    // Si action=tomorrow, muestra reservas de mañana
    if (action === 'tomorrow') {
      const SPAIN_TIMEZONE = 'Europe/Madrid';
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowDate = tomorrow.toLocaleDateString('sv-SE', { timeZone: SPAIN_TIMEZONE });

      const bookingKeys = await redis.keys('booking:*');
      const tomorrowBookings: Array<{
        nombre: string;
        email: string;
        telefono: string;
        clase: string;
        hora: string;
      }> = [];

      for (const key of bookingKeys) {
        try {
          const data = await redis.get(key);
          if (!data) continue;

          const booking = typeof data === 'string' ? JSON.parse(data) : data;

          // Verificar si la clase es mañana
          let classDateStr = null;
          if (booking.classDateRaw) {
            classDateStr = booking.classDateRaw.split('T')[0];
          } else if (booking.classDate && /^\d{4}-\d{2}-\d{2}/.test(booking.classDate)) {
            classDateStr = booking.classDate.split('T')[0];
          }

          if (classDateStr === tomorrowDate && booking.status !== 'cancelled') {
            tomorrowBookings.push({
              nombre: `${booking.firstName} ${booking.lastName}`,
              email: booking.email,
              telefono: booking.phone || 'No registrado',
              clase: booking.className,
              hora: booking.classTime,
            });
          }
        } catch {
          // Ignorar errores de parseo
        }
      }

      // Agrupar por clase
      const byClass: Record<string, number> = {};
      for (const b of tomorrowBookings) {
        const key = `${b.clase} (${b.hora})`;
        byClass[key] = (byClass[key] || 0) + 1;
      }

      return res.status(200).json({
        success: true,
        fecha: tomorrowDate,
        total: tomorrowBookings.length,
        porClase: byClass,
        reservas: tomorrowBookings,
      });
    }

    // Por defecto, muestra las keys de momence
    const momenceToken = await redis.get('momence:access_token');
    const sessionsCache = await redis.get('momence:sessions:cache:28');

    return res.status(200).json({
      success: true,
      momenceToken: momenceToken ? 'EXISTS (hidden)' : 'NOT FOUND',
      sessionsCache: sessionsCache ? 'EXISTS' : 'NOT FOUND',
      sessionsCacheLength: sessionsCache ? JSON.parse(sessionsCache).length : 0,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
