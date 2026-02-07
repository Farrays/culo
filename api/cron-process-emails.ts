import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processEmailRetryQueue, getRetryQueueCount } from './lib/email.js';

/**
 * API Route: /api/cron-process-emails
 *
 * Processes the email retry queue for failed emails.
 * Scheduled via Vercel Cron: runs every 15 minutes.
 *
 * Features:
 * - Retries failed booking confirmations, reminders, cancellations, feedback
 * - Max 3 retry attempts per email
 * - Exponential backoff via cron interval
 * - Emails expire after 24 hours
 *
 * @see vercel.json for cron configuration
 * @see api/lib/email.ts for queue implementation
 */

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Only allow GET (for cron) and POST (for manual trigger)
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Verify cron secret for automated calls
  const cronSecret = process.env['CRON_SECRET'];
  const providedSecret = req.headers['authorization']?.replace('Bearer ', '');

  // Allow if no secret configured (dev) or if secret matches
  if (cronSecret && providedSecret !== cronSecret) {
    console.warn('[cron-process-emails] Unauthorized access attempt');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  console.log('[cron-process-emails] Starting email retry queue processing...');

  try {
    // Get queue count before processing
    const queuedBefore = await getRetryQueueCount();
    console.log(`[cron-process-emails] Queue size before: ${queuedBefore}`);

    if (queuedBefore === 0) {
      console.log('[cron-process-emails] No emails in retry queue, skipping');
      res.status(200).json({
        success: true,
        message: 'No emails to retry',
        queueSize: 0,
      });
      return;
    }

    // Process the queue
    const result = await processEmailRetryQueue();

    // Get queue count after processing
    const queuedAfter = await getRetryQueueCount();

    console.log('[cron-process-emails] Processing complete:', {
      ...result,
      queueSizeBefore: queuedBefore,
      queueSizeAfter: queuedAfter,
    });

    res.status(200).json({
      success: true,
      message: 'Email retry queue processed',
      result,
      queueSizeBefore: queuedBefore,
      queueSizeAfter: queuedAfter,
    });
  } catch (error) {
    console.error('[cron-process-emails] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
