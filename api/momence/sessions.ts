/**
 * Momence Sessions API
 *
 * GET /api/momence/sessions - List sessions
 * Calls: GET /api/v2/host/sessions
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

    // Parse query parameters
    const page = parseInt(String(req.query['page'] || '0'), 10);
    const pageSize = parseInt(String(req.query['pageSize'] || '50'), 10);
    const startAfter = req.query['startAfter'] as string | undefined;
    const startBefore = req.query['startBefore'] as string | undefined;
    const teacherId = req.query['teacherId']
      ? parseInt(String(req.query['teacherId']), 10)
      : undefined;
    const sortBy = req.query['sortBy'] as 'name' | 'startsAt' | 'endsAt' | undefined;
    const sortOrder = req.query['sortOrder'] as 'ASC' | 'DESC' | undefined;
    const includeCancelled = req.query['includeCancelled'] === 'true';

    const result = await client.getSessions({
      page,
      pageSize: Math.min(pageSize, 200), // Max 200 per Momence API
      startAfter,
      startBefore,
      teacherId,
      sortBy,
      sortOrder,
      includeCancelled,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('[momence/sessions] Error:', error);
    return res.status(500).json({
      error: 'Failed to fetch sessions',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
