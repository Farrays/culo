/**
 * GET /api/conversations-notifications?since=TIMESTAMP
 *
 * Obtiene notificaciones nuevas desde un timestamp dado.
 * El dashboard de farray-analytics hace polling cada 5s a este endpoint.
 *
 * Query params:
 * - since: Unix timestamp en ms (default 0 = todas)
 * - reset: "true" para resetear contador de no leídos
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedisClient } from './lib/redis.js';
import { getNotifications, resetUnreadCount } from './lib/ai/human-takeover.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = getRedisClient();
    const since = Number(req.query['since']) || 0;

    const result = await getNotifications(redis, since);

    // Si piden reset del contador
    if (req.query['reset'] === 'true') {
      await resetUnreadCount(redis);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('[conversations-notifications] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
