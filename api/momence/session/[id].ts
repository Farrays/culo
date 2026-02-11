/**
 * Momence Session Detail API
 *
 * GET /api/momence/session/[id] - Get session details
 * GET /api/momence/session/[id]?bookings=true - Get session bookings
 *
 * Calls:
 * - GET /api/v2/host/sessions/{sessionId}
 * - GET /api/v2/host/sessions/{sessionId}/bookings
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMomenceClient } from '../../lib/momence-client.js';
import { validateApiKey, handleCors } from '../../lib/momence-auth-middleware.js';
import { getRedis } from '../../lib/redis.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  // Handle CORS preflight
  if (handleCors(req, res)) return;

  // Validate API key
  if (!validateApiKey(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = getRedis();
    const client = getMomenceClient(redis);

    const sessionId = parseInt(String(req.query['id']), 10);
    if (isNaN(sessionId)) {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    // Check if requesting bookings
    if (req.query['bookings'] === 'true') {
      const page = parseInt(String(req.query['page'] || '0'), 10);
      const pageSize = parseInt(String(req.query['pageSize'] || '50'), 10);
      const includeCancelled = req.query['includeCancelled'] === 'true';

      const result = await client.getSessionBookings(sessionId, {
        page,
        pageSize: Math.min(pageSize, 100),
        includeCancelled,
      });

      return res.status(200).json(result);
    }

    // Get session details
    const session = await client.getSession(sessionId);
    return res.status(200).json(session);
  } catch (error) {
    console.error('[momence/session/[id]] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch session',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
