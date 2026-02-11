/**
 * Momence Waitlist API
 *
 * POST /api/momence/waitlist - Add member to session waitlist
 *
 * Calls:
 * - POST /api/v2/host/sessions/{sessionId}/waitlist/bookings
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getMomenceClient } from '../lib/momence-client.js';
import { validateApiKey, handleCors } from '../lib/momence-auth-middleware.js';
import { getRedis } from '../lib/redis.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse | void> {
  // Handle CORS preflight
  if (handleCors(req, res)) return;

  // Validate API key
  if (!validateApiKey(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = getRedis();
    const client = getMomenceClient(redis);

    const { sessionId, memberId, useBoughtMembershipIds } = req.body;

    if (!sessionId || !memberId) {
      return res.status(400).json({
        error: 'Missing required fields: sessionId, memberId',
      });
    }

    const result = await client.addToWaitlist(sessionId, memberId, useBoughtMembershipIds);

    return res.status(201).json(result);
  } catch (error) {
    console.error('[momence/waitlist] Error:', error);
    return res.status(500).json({
      error: 'Failed to add to waitlist',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
