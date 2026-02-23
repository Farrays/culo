/**
 * POST /api/conversations-read
 *
 * Toggle read/unread status for a conversation.
 *
 * Body: { phone: string, read: boolean }
 * - read=true  → marks conversation as read
 * - read=false → marks conversation as unread
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedisClient } from './lib/redis.js';
import { markConversationRead, markConversationUnread } from './lib/ai/human-takeover.js';

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

  const { phone, read } = req.body as { phone?: string; read?: boolean };

  if (!phone || typeof read !== 'boolean') {
    return res.status(400).json({ error: 'Missing phone or read (boolean)' });
  }

  try {
    const redis = getRedisClient();

    if (read) {
      await markConversationRead(redis, phone);
    } else {
      await markConversationUnread(redis, phone);
    }

    return res.status(200).json({ success: true, phone, read });
  } catch (error) {
    console.error('[conversations-read] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
