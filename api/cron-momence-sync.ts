/**
 * Cron Job: Momence Sync
 *
 * Sincroniza automáticamente profesores y estilos desde Momence
 * al Knowledge Base del agente Laura.
 *
 * Schedule: Cada 6 horas (cron: 0 0,6,12,18 * * *)
 *
 * @see ENTERPRISE_AGENT_PLAN.md - Fase 5
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { triggerSync } from './lib/ai/momence-sync.js';

// Initialize Redis
function getRedis(): Redis | null {
  const url = process.env['UPSTASH_REDIS_REST_URL'];
  const token = process.env['UPSTASH_REDIS_REST_TOKEN'];

  if (!url || !token) {
    console.warn('[cron-momence-sync] Redis credentials not configured');
    return null;
  }

  return new Redis({ url, token });
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const startTime = Date.now();

  // Verify cron secret (if configured)
  const cronSecret = process.env['CRON_SECRET'];
  if (cronSecret) {
    const authHeader = req.headers.authorization;
    const querySecret = req.query['secret'] as string;
    // Accept either header or query param for testing
    if (authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
      console.warn('[cron-momence-sync] Unauthorized request');
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  }

  console.log('[cron-momence-sync] Starting sync...');

  try {
    const redis = getRedis();

    // Check if force sync is requested
    const force = req.query['force'] === 'true';

    // Trigger sync
    const result = await triggerSync(redis, force);

    const elapsed = Date.now() - startTime;

    if (result.success) {
      console.log('[cron-momence-sync] Sync completed successfully');
      console.log(
        `[cron-momence-sync] Teachers: ${result.teachers.total} (${result.teachers.new} new)`
      );
      console.log(`[cron-momence-sync] Styles: ${result.styles.active} active`);
      console.log(`[cron-momence-sync] Elapsed: ${elapsed}ms`);

      res.status(200).json({
        success: true,
        message: 'Momence sync completed',
        stats: {
          teachers: result.teachers,
          styles: result.styles,
          elapsed: `${elapsed}ms`,
        },
        timestamp: result.timestamp,
      });
      return;
    } else {
      console.error('[cron-momence-sync] Sync failed:', result.errors);

      res.status(500).json({
        success: false,
        message: 'Momence sync failed',
        errors: result.errors,
        elapsed: `${elapsed}ms`,
        timestamp: result.timestamp,
      });
      return;
    }
  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error('[cron-momence-sync] Unexpected error:', error);

    res.status(500).json({
      success: false,
      message: 'Unexpected error during sync',
      error: error instanceof Error ? error.message : 'Unknown error',
      elapsed: `${elapsed}ms`,
    });
  }
}
