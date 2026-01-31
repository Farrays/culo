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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Debug: Verificar que las variables de entorno existen
  const envCheck = {
    hasUrl: !!process.env['UPSTASH_REDIS_REST_URL'],
    hasToken: !!process.env['UPSTASH_REDIS_REST_TOKEN'],
    urlPreview: process.env['UPSTASH_REDIS_REST_URL']?.substring(0, 30) + '...',
  };

  try {
    // Importar dinámicamente para capturar errores de módulo
    const { Redis } = await import('@upstash/redis');

    const url = process.env['UPSTASH_REDIS_REST_URL'];
    const token = process.env['UPSTASH_REDIS_REST_TOKEN'];

    if (!url || !token) {
      return res.status(500).json({
        success: false,
        error: 'Missing environment variables',
        envCheck,
      });
    }

    // Crear cliente Redis directamente aquí para debug
    const redis = new Redis({ url, token });

    // Test 1: Ping
    const pingResult = await redis.ping();

    // Test 2: Set y Get
    const testKey = 'test:connection';
    const testValue = `test-${Date.now()}`;

    await redis.set(testKey, testValue, { ex: 60 });
    const getValue = await redis.get(testKey);

    // Test 3: Delete
    await redis.del(testKey);

    // Verificar resultados
    const success = pingResult === 'PONG' && getValue === testValue;

    return res.status(200).json({
      success,
      message: success ? 'Redis connection successful' : 'Redis tests failed',
      tests: {
        ping: pingResult,
        setGet: getValue === testValue ? 'PASS' : 'FAIL',
        delete: 'PASS',
      },
      envCheck,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Redis connection error:', error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      envCheck,
      hint: 'Check UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables',
    });
  }
}
