/**
 * Cron Job: Agent Follow-up Messages
 *
 * Sends follow-up messages to leads before the 24h WhatsApp window closes.
 * Should run every hour via Vercel Cron.
 *
 * WhatsApp Business API Rule:
 * - After 24h without user response, can only send template messages
 * - We send follow-up at ~20-22h to stay within free-form message window
 *
 * @see AGENTE.md - Follow-up strategy
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedisClient } from './lib/redis.js';
import { SalesAgent } from './lib/ai/agent.js';

// ============================================================================
// WHATSAPP INLINE (same as webhook-whatsapp.ts)
// ============================================================================

const WHATSAPP_API_VERSION = 'v23.0';

function getWhatsAppConfig() {
  const token = process.env['WHATSAPP_TOKEN'];
  const phoneId = process.env['WHATSAPP_PHONE_ID'];

  if (!token || !phoneId) {
    return null;
  }

  return {
    token,
    phoneId,
    apiUrl: `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${phoneId}/messages`,
  };
}

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-().]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.substring(1);
  if (cleaned.length === 9 && /^[6789]/.test(cleaned)) cleaned = '34' + cleaned;
  if (cleaned.length === 10 && cleaned.startsWith('0')) cleaned = '33' + cleaned.substring(1);
  return cleaned;
}

async function sendTextMessage(
  to: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  const config = getWhatsAppConfig();
  if (!config) {
    return { success: false, error: 'WhatsApp not configured' };
  }

  const normalizedPhone = normalizePhone(to);

  const message = {
    messaging_product: 'whatsapp',
    to: normalizedPhone,
    type: 'text',
    text: { body: text },
  };

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.token}`,
      },
      body: JSON.stringify(message),
    });

    const data = (await response.json()) as { error?: { message: string } };

    if (!response.ok || data.error) {
      console.error('[cron-followup] WhatsApp API error:', data.error);
      return { success: false, error: data.error?.message || `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ============================================================================
// PII REDACTION
// ============================================================================

function redactPhone(phone: string | null | undefined): string {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 6) return '***';
  return `${cleaned.slice(0, 4)}***${cleaned.slice(-2)}`;
}

// ============================================================================
// HANDLER
// ============================================================================

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Verify cron secret (Vercel sends this header)
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env['CRON_SECRET'];

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    console.warn('[cron-followup] Unauthorized request');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('[cron-followup] Starting follow-up check...');

  const redis = getRedisClient();
  if (!redis) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  try {
    const agent = new SalesAgent(redis);

    // Get conversations needing follow-up
    const conversations = await agent.getConversationsNeedingFollowUp();

    console.log(`[cron-followup] Found ${conversations.length} conversations needing follow-up`);

    const results = {
      total: conversations.length,
      sent: 0,
      failed: 0,
      skipped: 0,
      details: [] as Array<{ phone: string; status: string; error?: string }>,
    };

    for (const conversation of conversations) {
      const phone = conversation.phone;

      try {
        // Generate personalized follow-up message
        const message = agent.generateFollowUpMessage(conversation);

        console.log(
          `[cron-followup] Sending follow-up to ${redactPhone(phone)}: "${message.substring(0, 50)}..."`
        );

        // Send the message
        const sendResult = await sendTextMessage(phone, message);

        if (sendResult.success) {
          // Mark as sent
          await agent.markFollowUpSent(phone);
          results.sent++;
          results.details.push({ phone: redactPhone(phone), status: 'sent' });
          console.log(`[cron-followup] Follow-up sent to ${redactPhone(phone)}`);
        } else {
          results.failed++;
          results.details.push({
            phone: redactPhone(phone),
            status: 'failed',
            error: sendResult.error,
          });
          console.error(
            `[cron-followup] Failed to send to ${redactPhone(phone)}:`,
            sendResult.error
          );
        }

        // Small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results.failed++;
        results.details.push({
          phone: redactPhone(phone),
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        console.error(`[cron-followup] Error processing ${redactPhone(phone)}:`, error);
      }
    }

    console.log(
      `[cron-followup] Completed: ${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`
    );

    // Log metrics to Redis for monitoring
    try {
      const today = new Date().toISOString().split('T')[0];
      await redis.hincrby(`agent:metrics:${today}`, 'followups_sent', results.sent);
      await redis.hincrby(`agent:metrics:${today}`, 'followups_failed', results.failed);
      await redis.expire(`agent:metrics:${today}`, 90 * 24 * 60 * 60); // 90 days TTL
    } catch (metricsError) {
      console.warn('[cron-followup] Failed to log metrics:', metricsError);
    }

    return res.status(200).json({
      success: true,
      message: `Processed ${results.total} conversations`,
      results,
    });
  } catch (error) {
    console.error('[cron-followup] Fatal error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
