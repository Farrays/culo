/**
 * Momence Tags API
 *
 * GET /api/momence/tags - List available tags
 * POST /api/momence/tags - Assign tag to member
 * DELETE /api/momence/tags - Remove tag from member
 *
 * Calls:
 * - GET /api/v2/host/tags
 * - POST /api/v2/host/members/{memberId}/tags/{tagId}
 * - DELETE /api/v2/host/members/{memberId}/tags/{tagId}
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

  try {
    const redis = getRedis();
    const client = getMomenceClient(redis);

    if (req.method === 'GET') {
      // List all tags
      const tags = await client.getTags();
      return res.status(200).json({ tags });
    }

    if (req.method === 'POST') {
      // Assign tag to member
      const { memberId, tagId } = req.body;

      if (!memberId || !tagId) {
        return res.status(400).json({
          error: 'Missing required fields: memberId, tagId',
        });
      }

      await client.assignTag(memberId, tagId);
      return res.status(200).json({ success: true, action: 'assigned' });
    }

    if (req.method === 'DELETE') {
      // Remove tag from member
      const { memberId, tagId } = req.body;

      if (!memberId || !tagId) {
        return res.status(400).json({
          error: 'Missing required fields: memberId, tagId',
        });
      }

      await client.removeTag(memberId, tagId);
      return res.status(200).json({ success: true, action: 'removed' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[momence/tags] Error:', error);
    return res.status(500).json({
      error: 'Failed to process tags request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
