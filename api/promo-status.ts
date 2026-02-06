/**
 * Promo Job Status API
 *
 * GET /api/promo-status?jobId=promo_xxx
 *
 * Check the status of a promotional message job.
 *
 * @see AGENTE.md - Envíos Masivos de Promociones
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedisClient } from './lib/redis';

interface PromoJobStatus {
  jobId: string;
  templateName: string;
  targetAudience: string;
  totalTargets: number;
  sent: number;
  failed: number;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'scheduled';
  startedAt?: string;
  completedAt?: string;
  scheduledAt?: string;
  errors: Array<{ phone: string; error: string }>;
}

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { jobId } = req.query;

  if (!jobId || Array.isArray(jobId)) {
    res.status(400).json({ error: 'jobId parameter required' });
    return;
  }

  try {
    const redis = getRedisClient();

    if (!redis) {
      res.status(500).json({ error: 'Redis not available' });
      return;
    }

    const data = await redis.get(`promo:job:${jobId}`);

    if (!data) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    // Handle both string and object returns from Upstash
    const status = (typeof data === 'object' ? data : JSON.parse(String(data))) as PromoJobStatus;

    // Calculate progress percentage
    const progress =
      status.totalTargets > 0
        ? Math.round(((status.sent + status.failed) / status.totalTargets) * 100)
        : 0;

    res.status(200).json({
      ...status,
      progress,
      successRate:
        status.sent + status.failed > 0
          ? Math.round((status.sent / (status.sent + status.failed)) * 100)
          : 0,
    });
  } catch (error) {
    console.error('[promo-status] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
