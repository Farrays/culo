/**
 * Test endpoint para crear una reserva de prueba en Redis
 * con fecha a 24h para probar el sistema de recordatorios 24h
 *
 * GET /api/test-booking-reminder-24h?phone=34622247085
 *
 * Query params:
 * - phone: Número de teléfono con código de país (default: 34622247085)
 * - firstName: Nombre (default: TestUser)
 * - className: Nombre de clase (default: Salsa Principiantes)
 * - action: create|delete (default: create)
 *
 * @note Este endpoint es solo para testing. Eliminar en producción.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

let redisClient: Redis | null = null;

function getRedis(): Redis {
  const redisUrl = process.env['STORAGE_REDIS_URL'];

  if (!redisUrl) {
    throw new Error('Missing STORAGE_REDIS_URL');
  }

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
  }

  return redisClient;
}

const TEST_BOOKING_KEY = 'booking:test-reminder-24h-12345';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    phone = '34622247085',
    firstName = 'TestUser',
    className = 'Salsa Principiantes',
    action = 'create',
  } = req.query;

  try {
    const redis = getRedis();

    if (action === 'delete') {
      // Eliminar reserva de prueba
      await redis.del(TEST_BOOKING_KEY);
      return res.status(200).json({
        success: true,
        message: 'Test booking deleted',
        key: TEST_BOOKING_KEY,
      });
    }

    // Crear fecha exactamente 24h desde ahora
    const classDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const classDateRaw = classDate.toISOString();

    // Formatear fecha y hora para el recordatorio
    const day = classDate.getDate().toString().padStart(2, '0');
    const month = (classDate.getMonth() + 1).toString().padStart(2, '0');
    const year = classDate.getFullYear();
    const hours = classDate.getHours().toString().padStart(2, '0');
    const minutes = classDate.getMinutes().toString().padStart(2, '0');
    const formattedDateTime = `${day}/${month}/${year}, ${hours}:${minutes}`;

    // Crear reserva de prueba
    const testBooking = {
      id: 'test-reminder-24h-12345',
      firstName: firstName as string,
      lastName: 'Test',
      email: 'test@example.com',
      phone: phone as string,
      className: className as string,
      classDateRaw,
      classDate: formattedDateTime,
      classTime: `${hours}:${minutes}`,
      category: 'bailes_sociales',
      reminderSent: true, // Ya envió el de 48h
      reminder24hSent: false, // Aún no envió el de 24h
      createdAt: new Date().toISOString(),
    };

    // Guardar en Redis con TTL de 1 hora (suficiente para la prueba)
    await redis.setex(TEST_BOOKING_KEY, 3600, JSON.stringify(testBooking));

    return res.status(200).json({
      success: true,
      message: 'Test booking created for 24h reminder',
      booking: testBooking,
      key: TEST_BOOKING_KEY,
      classDateTime: formattedDateTime,
      instructions: {
        testCron: 'GET /api/cron-reminders-24h',
        deleteBooking: `/api/test-booking-reminder-24h?action=delete`,
      },
    });
  } catch (error) {
    console.error('Error managing test booking:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
