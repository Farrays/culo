import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/**
 * Endpoint temporal para limpiar caché de booking (solo desarrollo)
 * DELETE /api/clear-booking-cache?email=xxx
 *
 * TODO: Eliminar este archivo después de las pruebas
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo permitir en desarrollo/staging
  const host = req.headers.host || '';
  if (!host.includes('vercel.app') && !host.includes('localhost')) {
    return res.status(403).json({ error: 'Not allowed in production' });
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed. Use DELETE.' });
  }

  const email = req.query.email as string;
  if (!email) {
    return res.status(400).json({ error: 'Email parameter required' });
  }

  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  try {
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
    });

    const bookingKey = `booking:${email.toLowerCase()}`;
    const deleted = await redis.del(bookingKey);

    await redis.quit();

    return res.status(200).json({
      success: true,
      key: bookingKey,
      deleted: deleted > 0,
    });
  } catch (error) {
    console.error('Redis error:', error);
    return res.status(500).json({ error: 'Redis error' });
  }
}
