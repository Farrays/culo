import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { Redis } from '@upstash/redis';

/* eslint-disable no-undef */
// Note: Buffer is a Node.js global available in Vercel serverless functions

/**
 * API Route: /api/cron-backup
 *
 * Daily backup of critical Redis data via email.
 * Scheduled via Vercel Cron: runs once daily at 3:00 AM UTC.
 *
 * Exports:
 * - Reservas (booking:*)
 * - Leads (lead:*)
 * - Feedback (feedback:*)
 *
 * @see vercel.json for cron configuration
 */

// Redis client
function getRedis(): Redis {
  const url = process.env['UPSTASH_REDIS_REST_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'];
  if (!url || !token) throw new Error('Missing Redis credentials');
  return new Redis({ url, token });
}

// Scan all keys matching a pattern
async function scanKeys(redis: Redis, pattern: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor = 0;

  do {
    const [nextCursor, batch] = await redis.scan(cursor, { match: pattern, count: 100 });
    cursor = Number(nextCursor);
    keys.push(...batch);
  } while (cursor !== 0);

  return keys;
}

// Get all data for a set of keys
async function getDataForKeys(redis: Redis, keys: string[]): Promise<Record<string, unknown>[]> {
  if (keys.length === 0) return [];

  const results: Record<string, unknown>[] = [];

  for (const key of keys) {
    try {
      const value = await redis.get(key);
      if (value) {
        results.push({
          _key: key,
          ...(typeof value === 'string' ? JSON.parse(value) : value),
        });
      }
    } catch {
      // Skip invalid entries
    }
  }

  return results;
}

// Format date for filename
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Generate backup report
function generateReport(data: {
  bookings: Record<string, unknown>[];
  leads: Record<string, unknown>[];
  feedback: Record<string, unknown>[];
  timestamp: string;
}): string {
  return `
# Backup Diario - Farray's Center
Fecha: ${data.timestamp}

## Resumen
- Reservas: ${data.bookings.length}
- Leads: ${data.leads.length}
- Feedback: ${data.feedback.length}

## Datos
Los datos completos están adjuntos en formato JSON.
  `.trim();
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // Verify cron secret (Vercel sets this header)
  const authHeader = req.headers.authorization;
  const cronSecret = process.env['CRON_SECRET'];

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    // Also allow Vercel cron header
    if (!req.headers['x-vercel-cron']) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const timestamp = new Date().toISOString();
  const dateStr = formatDate(new Date());

  try {
    const redis = getRedis();

    // Scan all critical data
    console.log('[backup] Scanning Redis keys...');

    const [bookingKeys, leadKeys, feedbackKeys] = await Promise.all([
      scanKeys(redis, 'booking:*'),
      scanKeys(redis, 'lead:*'),
      scanKeys(redis, 'feedback:*'),
    ]);

    console.log(
      `[backup] Found: ${bookingKeys.length} bookings, ${leadKeys.length} leads, ${feedbackKeys.length} feedback`
    );

    // Get all data
    const [bookings, leads, feedback] = await Promise.all([
      getDataForKeys(redis, bookingKeys),
      getDataForKeys(redis, leadKeys),
      getDataForKeys(redis, feedbackKeys),
    ]);

    // Prepare backup data
    const backupData = {
      timestamp,
      version: '1.0',
      counts: {
        bookings: bookings.length,
        leads: leads.length,
        feedback: feedback.length,
      },
      data: {
        bookings,
        leads,
        feedback,
      },
    };

    // Generate report
    const report = generateReport({
      bookings,
      leads,
      feedback,
      timestamp,
    });

    // Send email with backup
    const resendApiKey = process.env['RESEND_API_KEY'];
    const backupEmail = process.env['BACKUP_EMAIL'] || 'info@farrayscenter.com';

    if (!resendApiKey) {
      console.error('[backup] Missing RESEND_API_KEY');
      return res.status(500).json({ error: 'Email not configured' });
    }

    const resend = new Resend(resendApiKey);

    // Create JSON attachment
    const jsonContent = JSON.stringify(backupData, null, 2);
    const base64Content = Buffer.from(jsonContent).toString('base64');

    await resend.emails.send({
      from: "Farray's Backup <backup@farrayscenter.com>",
      to: backupEmail,
      subject: `[Backup] Datos ${dateStr} - ${bookings.length} reservas, ${leads.length} leads`,
      text: report,
      attachments: [
        {
          filename: `backup-${dateStr}.json`,
          content: base64Content,
        },
      ],
    });

    console.log(`[backup] Email sent to ${backupEmail}`);

    return res.status(200).json({
      success: true,
      timestamp,
      counts: backupData.counts,
      emailSent: true,
    });
  } catch (error) {
    console.error('[backup] Error:', error);
    return res.status(500).json({
      error: 'Backup failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
