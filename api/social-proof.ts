import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

/**
 * API Route: /api/social-proof
 *
 * Devuelve las reservas recientes para mostrar en el Social Proof Ticker.
 * Los datos están anonimizados (solo primer nombre).
 *
 * Query params:
 * - limit: Número de reservas a devolver (default: 5, max: 10)
 *
 * Response:
 * {
 *   success: true,
 *   bookings: [
 *     { name: "María", class: "Bachata", minutesAgo: 2 },
 *     { name: "Carlos", class: "Hip Hop", minutesAgo: 15 }
 *   ]
 * }
 */

const RECENT_BOOKINGS_KEY = 'recent_bookings';

// Lazy Redis connection
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

interface RecentBooking {
  firstName: string;
  className: string;
  timestamp: number;
}

interface SocialProofEntry {
  name: string;
  class: string;
  minutesAgo: number;
}

function calculateMinutesAgo(timestamp: number): number {
  const now = Date.now();
  const diffMs = now - timestamp;
  return Math.max(1, Math.floor(diffMs / (1000 * 60)));
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Solo GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // Cache: 30 segundos (para no sobrecargar Redis)
  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  try {
    const { limit } = req.query;
    const maxLimit = Math.min(10, Math.max(1, parseInt(limit as string) || 5));

    const redis = getRedisClient();

    if (!redis) {
      // Si no hay Redis configurado, devolver array vacío
      return res.status(200).json({
        success: true,
        bookings: [],
        message: 'Redis not configured',
      });
    }

    // Obtener las últimas N reservas
    const rawBookings = await redis.lrange(RECENT_BOOKINGS_KEY, 0, maxLimit - 1);

    if (!rawBookings || rawBookings.length === 0) {
      return res.status(200).json({
        success: true,
        bookings: [],
      });
    }

    const now = Date.now();
    const maxAgeMinutes = 60; // Solo mostrar reservas de la última hora

    const bookings: SocialProofEntry[] = rawBookings
      .map(raw => {
        try {
          const booking: RecentBooking = JSON.parse(raw);
          const minutesAgo = calculateMinutesAgo(booking.timestamp);

          // Filtrar reservas muy antiguas
          if (minutesAgo > maxAgeMinutes) {
            return null;
          }

          return {
            name: booking.firstName,
            class: booking.className,
            minutesAgo,
          };
        } catch {
          return null;
        }
      })
      .filter((b): b is SocialProofEntry => b !== null);

    return res.status(200).json({
      success: true,
      bookings,
      timestamp: now,
    });
  } catch (error) {
    console.error('Social proof API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      bookings: [],
    });
  }
}
