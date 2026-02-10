/**
 * Momence Member Detail API
 *
 * GET /api/momence/member/[id] - Get member details
 * GET /api/momence/member/[id]?bookings=true - Get member session bookings
 * GET /api/momence/member/[id]?memberships=true - Get member bought memberships
 * PUT /api/momence/member/[id] - Update member (name, phone, email)
 *
 * Calls:
 * - GET /api/v2/host/members/{memberId}
 * - GET /api/v2/host/members/{memberId}/sessions (historial de reservas)
 * - GET /api/v2/host/members/{memberId}/bought-memberships/active
 * - PUT /api/v2/host/members/{memberId}/name
 * - PUT /api/v2/host/members/{memberId}/phone-number
 * - PUT /api/v2/host/members/{memberId}/email
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

  try {
    const redis = getRedis();
    const client = getMomenceClient(redis);

    const memberId = parseInt(String(req.query['id']), 10);
    if (isNaN(memberId)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    if (req.method === 'GET') {
      // Check if requesting bookings
      if (req.query['bookings'] === 'true') {
        const page = parseInt(String(req.query['page'] || '0'), 10);
        const pageSize = parseInt(String(req.query['pageSize'] || '50'), 10);
        const startAfter = req.query['startAfter'] as string | undefined;
        const startBefore = req.query['startBefore'] as string | undefined;
        const includeCancelled = req.query['includeCancelled'] === 'true';

        const result = await client.getMemberSessionBookings(memberId, {
          page,
          pageSize: Math.min(pageSize, 100),
          startAfter,
          startBefore,
          includeCancelled,
        });

        return res.status(200).json(result);
      }

      // Check if requesting memberships
      if (req.query['memberships'] === 'true') {
        const page = parseInt(String(req.query['page'] || '0'), 10);
        const pageSize = parseInt(String(req.query['pageSize'] || '50'), 10);
        const includeFrozen = req.query['includeFrozen'] === 'true';

        const result = await client.getMemberBoughtMemberships(memberId, {
          page,
          pageSize: Math.min(pageSize, 200),
          includeFrozen,
        });

        return res.status(200).json(result);
      }

      // Get member details
      const member = await client.getMember(memberId);
      return res.status(200).json(member);
    }

    if (req.method === 'PUT') {
      const { firstName, lastName, phoneNumber, email } = req.body;
      const updates: string[] = [];

      // Update name if provided
      if (firstName || lastName) {
        await client.updateMemberName(memberId, {
          firstName: firstName || '',
          lastName: lastName || '',
        });
        updates.push('name');
      }

      // Update phone if provided
      if (phoneNumber !== undefined) {
        if (phoneNumber === null || phoneNumber === '') {
          await client.deleteMemberPhone(memberId);
          updates.push('phone (deleted)');
        } else {
          await client.updateMemberPhone(memberId, phoneNumber);
          updates.push('phone');
        }
      }

      // Update email if provided
      if (email) {
        await client.updateMemberEmail(memberId, email);
        updates.push('email');
      }

      if (updates.length === 0) {
        return res.status(400).json({
          error: 'No valid fields to update. Provide firstName, lastName, phoneNumber, or email.',
        });
      }

      return res.status(200).json({
        success: true,
        updated: updates,
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[momence/member/[id]] Error:', error);
    return res.status(500).json({
      error: 'Failed to process member request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
