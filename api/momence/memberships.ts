/**
 * Momence Memberships API
 *
 * GET /api/momence/memberships - List available memberships
 *
 * Calls:
 * - GET /api/v2/host/memberships
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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const redis = getRedis();
    const client = getMomenceClient(redis);

    const page = parseInt(String(req.query['page'] || '0'), 10);
    const pageSize = parseInt(String(req.query['pageSize'] || '100'), 10);

    const result = await client.getMemberships({
      page,
      pageSize: Math.min(pageSize, 200),
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('[momence/memberships] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch memberships',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
