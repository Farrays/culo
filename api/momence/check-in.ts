/**
 * Momence Check-in API
 *
 * POST /api/momence/check-in - Mark booking as checked-in
 * DELETE /api/momence/check-in - Remove check-in
 *
 * Calls:
 * - POST /api/v2/host/session-bookings/{bookingId}/check-in
 * - DELETE /api/v2/host/session-bookings/{bookingId}/check-in
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

    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        error: 'Missing required field: bookingId',
      });
    }

    if (req.method === 'POST') {
      // Mark as checked-in
      await client.checkIn(bookingId);
      return res.status(200).json({ success: true, checkedIn: true });
    }

    if (req.method === 'DELETE') {
      // Remove check-in
      await client.removeCheckIn(bookingId);
      return res.status(200).json({ success: true, checkedIn: false });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('[momence/check-in] Error:', error);
    return res.status(500).json({
      error: 'Failed to process check-in request',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
