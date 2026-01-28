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

  try {
    const keys = await redis.keys('booking:test*');
    const data = [];

    for (const key of keys) {
      const value = await redis.get(key);
      data.push({
        key,
        value: value ? JSON.parse(value) : null,
      });
    }

    return res.status(200).json({
      success: true,
      count: keys.length,
      keys,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
