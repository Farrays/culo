/**
 * POST /api/conversations-reply
 *
 * Envía un mensaje humano a un cliente por WhatsApp.
 * Activa automáticamente el human takeover si no estaba activo.
 *
 * Body: { phone: string, text: string }
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedisClient } from './lib/redis.js';
import { sendTextMessage } from './lib/whatsapp.js';
import {
  saveHumanReply,
  activateTakeover,
  isHumanTakeover,
  trackConversationActivity,
} from './lib/ai/human-takeover.js';

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

  const { phone, text } = req.body as { phone?: string; text?: string };

  if (!phone || !text) {
    return res.status(400).json({ error: 'Missing phone or text' });
  }

  try {
    const redis = getRedisClient();

    // 1. Enviar mensaje por WhatsApp
    const result = await sendTextMessage(phone, text);
    if (!result.success) {
      return res.status(502).json({ error: 'WhatsApp send failed', detail: result.error });
    }

    // 2. Guardar en historial como respuesta de assistant (compatible con Laura)
    await saveHumanReply(redis, phone, text);

    // 3. Activar takeover si no estaba activo
    const alreadyTakeover = await isHumanTakeover(redis, phone);
    if (!alreadyTakeover) {
      await activateTakeover(redis, phone, 'admin');
    }

    // 4. Actualizar timestamp de actividad
    await trackConversationActivity(redis, phone);

    console.log(
      `[conversations-reply] Sent human reply to ${phone.slice(-4)}: "${text.slice(0, 50)}..."`
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[conversations-reply] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
