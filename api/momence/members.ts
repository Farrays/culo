/**
 * Momence Members API
 *
 * GET /api/momence/members - List/search members
 * POST /api/momence/members - Create member
 *
 * Calls:
 * - GET /api/v2/host/members
 * - POST /api/v2/host/members/list (for advanced search)
 * - POST /api/v2/host/members (for creation)
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
      // List/search members
      const page = parseInt(String(req.query['page'] || '0'), 10);
      const pageSize = parseInt(String(req.query['pageSize'] || '50'), 10);
      const query = req.query['query'] as string | undefined;
      const sortBy = req.query['sortBy'] as
        | 'lastSeenAt'
        | 'firstSeenAt'
        | 'firstName'
        | 'lastName'
        | 'email'
        | undefined;
      const sortOrder = req.query['sortOrder'] as 'ASC' | 'DESC' | undefined;
      const filterPreset = req.query['filterPreset'] as 'with-active-membership' | undefined;

      const result = await client.getMembers({
        page,
        pageSize: Math.min(pageSize, 100), // Max 100 per Momence API
        query,
        sortBy,
        sortOrder,
        filterPreset,
      });

      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const body = req.body;

      // Check if this is a search request or create request
      if (body.filter || body.query) {
        // Advanced search using POST /api/v2/host/members/list
        const result = await client.searchMembers({
          page: body.page || 0,
          pageSize: body.pageSize || 50,
          query: body.query,
          filter: body.filter,
        });
        return res.status(200).json(result);
      }

      // Create new member
      if (!body.email || !body.firstName || !body.lastName) {
        return res.status(400).json({
          error: 'Missing required fields: email, firstName, lastName',
        });
      }

      const result = await client.createMember({
        email: body.email,
        firstName: body.firstName,
        lastName: body.lastName,
        phoneNumber: body.phoneNumber,
      });

      return res.status(201).json(result);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[momence/members] Error:', error);
    return res.status(500).json({
      error: 'Failed to process members request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
