import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/**
 * API Route: /api/health
 *
 * Health check endpoint for monitoring system status.
 * Returns status of all critical dependencies.
 *
 * Response:
 * {
 *   status: 'healthy' | 'degraded' | 'unhealthy',
 *   checks: {
 *     redis: { status, latencyMs },
 *     momenceCircuit: { status, failures },
 *     resend: { configured }
 *   },
 *   timestamp: ISO string
 * }
 */

// Lazy Redis connection
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) return null;

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
    });
  }
  return redisClient;
}

// Circuit breaker keys (same as reservar.ts)
const CIRCUIT_BREAKER_KEY = 'momence:circuit:failures';
const CIRCUIT_BREAKER_COOLDOWN_KEY = 'momence:circuit:cooldown';

interface HealthCheck {
  status: 'ok' | 'degraded' | 'error';
  latencyMs?: number;
  error?: string;
  failures?: number;
  circuitOpen?: boolean;
  configured?: boolean;
}

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    redis: HealthCheck;
    momenceCircuit: HealthCheck;
    resend: HealthCheck;
    momenceApi: HealthCheck;
  };
  queues: {
    emailRetryPending: number;
  };
  timestamp: string;
  environment: string;
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  const checks: HealthResponse['checks'] = {
    redis: { status: 'error', error: 'Not configured' },
    momenceCircuit: { status: 'ok' },
    resend: { status: 'ok', configured: false },
    momenceApi: { status: 'ok', configured: false },
  };

  // 1. Check Redis
  const redis = getRedisClient();
  if (redis) {
    try {
      const start = Date.now();
      const pong = await redis.ping();
      const latency = Date.now() - start;

      if (pong === 'PONG') {
        checks.redis = {
          status: latency > 100 ? 'degraded' : 'ok',
          latencyMs: latency,
        };
      } else {
        checks.redis = { status: 'error', error: 'Unexpected ping response' };
      }
    } catch (error) {
      checks.redis = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  // 2. Check Momence Circuit Breaker state
  if (redis && checks.redis.status !== 'error') {
    try {
      const [failures, cooldown] = await Promise.all([
        redis.get(CIRCUIT_BREAKER_KEY),
        redis.get(CIRCUIT_BREAKER_COOLDOWN_KEY),
      ]);

      const failureCount = parseInt(failures || '0', 10);
      const circuitOpen = !!cooldown || failureCount >= 3;

      checks.momenceCircuit = {
        status: circuitOpen ? 'degraded' : 'ok',
        failures: failureCount,
        circuitOpen,
      };
    } catch {
      checks.momenceCircuit = { status: 'error', error: 'Failed to check circuit state' };
    }
  }

  // 3. Check Resend configuration
  checks.resend = {
    status: process.env['RESEND_API_KEY'] ? 'ok' : 'degraded',
    configured: !!process.env['RESEND_API_KEY'],
  };

  // 4. Check Momence API configuration
  const hasMomenceOAuth = !!(
    process.env['MOMENCE_CLIENT_ID'] &&
    process.env['MOMENCE_CLIENT_SECRET'] &&
    process.env['MOMENCE_USERNAME'] &&
    process.env['MOMENCE_PASSWORD']
  );
  const hasMomenceLeads = !!(process.env['MOMENCE_API_URL'] && process.env['MOMENCE_TOKEN']);

  checks.momenceApi = {
    status: hasMomenceOAuth || hasMomenceLeads ? 'ok' : 'degraded',
    configured: hasMomenceOAuth || hasMomenceLeads,
  };

  // 5. Check email retry queue
  let emailRetryPending = 0;
  if (redis && checks.redis.status !== 'error') {
    try {
      let cursor = '0';
      do {
        const [newCursor, keys] = await redis.scan(
          cursor,
          'MATCH',
          'email:retry:queue:*',
          'COUNT',
          100
        );
        cursor = newCursor;
        emailRetryPending += keys.length;
      } while (cursor !== '0');
    } catch {
      // Non-critical, ignore errors
    }
  }

  // Determine overall status
  const checkValues = Object.values(checks);
  let overallStatus: HealthResponse['status'] = 'healthy';

  if (checkValues.some(c => c.status === 'error')) {
    // If Redis is down, system is unhealthy (critical dependency)
    if (checks.redis.status === 'error') {
      overallStatus = 'unhealthy';
    } else {
      overallStatus = 'degraded';
    }
  } else if (checkValues.some(c => c.status === 'degraded')) {
    overallStatus = 'degraded';
  }

  const response: HealthResponse = {
    status: overallStatus,
    checks,
    queues: {
      emailRetryPending,
    },
    timestamp: new Date().toISOString(),
    environment: process.env['VERCEL_ENV'] || 'development',
  };

  // Return appropriate HTTP status
  const httpStatus = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;

  return res.status(httpStatus).json(response);
}
