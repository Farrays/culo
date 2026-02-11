/**
 * GET /api/conversations
 *
 * Lista todas las conversaciones activas ordenadas por última actividad.
 * Usado por el dashboard de Farray Analytics.
 *
 * Query params:
 * - limit: número de conversaciones (default 50, max 100)
 * - offset: para paginación (default 0)
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedisClient } from './lib/redis.js';
import { getActiveConversations, getConversationCount } from './lib/ai/human-takeover.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  // CORS headers para farray-analytics
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
    const limit = Math.min(Number(req.query['limit']) || 50, 100);
    const offset = Number(req.query['offset']) || 0;

    const [conversations, total] = await Promise.all([
      getActiveConversations(redis, limit, offset),
      getConversationCount(redis),
    ]);

    return res.status(200).json({ conversations, total });
  } catch (error) {
    console.error('[conversations] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
