/**
 * POST /api/conversations-takeover
 *
 * Activa o desactiva el human takeover para una conversación.
 * Cuando está activo, Laura deja de responder automáticamente.
 *
 * Body: { phone: string, active: boolean }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedisClient } from './lib/redis.js';
import { activateTakeover, deactivateTakeover, getTakeoverInfo } from './lib/ai/human-takeover.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, active } = req.body as { phone?: string; active?: boolean };

  if (!phone || typeof active !== 'boolean') {
    return res.status(400).json({ error: 'Missing phone or active (boolean)' });
  }

  try {
    const redis = getRedisClient();

    if (active) {
      const info = await activateTakeover(redis, phone, 'admin');
      return res.status(200).json({ success: true, takeover: info });
    } else {
      await deactivateTakeover(redis, phone);
      const info = await getTakeoverInfo(redis, phone);
      return res.status(200).json({ success: true, takeover: info || { active: false } });
    }
  } catch (error) {
    console.error('[conversations-takeover] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
