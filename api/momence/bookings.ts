/**
 * Momence Bookings API
 *
 * POST /api/momence/bookings - Create free booking
 * DELETE /api/momence/bookings - Cancel booking
 *
 * Calls:
 * - POST /api/v2/host/sessions/{sessionId}/bookings/free
 * - DELETE /api/v2/host/session-bookings/{bookingId}
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

    if (req.method === 'POST') {
      // Create free booking
      const { sessionId, memberId, useBoughtMembershipIds } = req.body;

      if (!sessionId || !memberId) {
        return res.status(400).json({
          error: 'Missing required fields: sessionId, memberId',
        });
      }

      const result = await client.createFreeBooking(sessionId, memberId, useBoughtMembershipIds);

      return res.status(201).json(result);
    }

    if (req.method === 'DELETE') {
      // Cancel booking
      const { bookingId, refund, disableNotifications, isLateCancellation } = req.body;

      if (!bookingId) {
        return res.status(400).json({
          error: 'Missing required field: bookingId',
        });
      }

      await client.cancelBooking(bookingId, {
        refund: refund ?? false,
        disableNotifications: disableNotifications ?? false,
        isLateCancellation: isLateCancellation ?? false,
      });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[momence/bookings] Error:', error);
    return res.status(500).json({
      error: 'Failed to process booking request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
