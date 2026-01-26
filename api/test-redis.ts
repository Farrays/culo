/**
 * Test endpoint para verificar conexión con Upstash Redis
 *
 * GET /api/test-redis
 *
 * Respuestas:
 * - 200: Conexión exitosa
 * - 500: Error de conexión
 *
 * @note Este endpoint es solo para testing. Eliminar o proteger en producción.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedis } from './lib/redis';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = getRedis();

    // Test 1: Ping
    const pingResult = await redis.ping();

    // Test 2: Set y Get
    const testKey = 'test:connection';
    const testValue = `test-${Date.now()}`;

    await redis.set(testKey, testValue, { ex: 60 }); // Expira en 60 segundos
    const getValue = await redis.get(testKey);

    // Test 3: Delete
    await redis.del(testKey);

    // Verificar resultados
    const success = pingResult === 'PONG' && getValue === testValue;

    if (success) {
      return res.status(200).json({
        success: true,
        message: 'Redis connection successful',
        tests: {
          ping: pingResult,
          setGet: getValue === testValue ? 'PASS' : 'FAIL',
          delete: 'PASS',
        },
        timestamp: new Date().toISOString(),
      });
    } else {
      throw new Error('Redis tests failed');
    }
  } catch (error) {
    console.error('Redis connection error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Check UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables',
    });
  }
}
