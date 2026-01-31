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
