/**
 * API Route: /api/metrics
 *
 * Returns booking metrics and audit log data.
 * Requires authentication via CRON_SECRET for security.
 *
 * Query parameters:
 * - type: 'channels' | 'daily' | 'audit' (default: 'channels')
 * - date: YYYY-MM-DD for daily/audit queries
 * - startDate: YYYY-MM-DD for channel metrics range
 * - endDate: YYYY-MM-DD for channel metrics range
 * - limit: number of audit events (default: 50)
 * - action: filter audit by action type
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';
import {
  getChannelMetrics,
  getDailyMetrics,
  getRecentAuditEvents,
  getAuditEventsByDate,
  type AuditAction,
} from './lib/audit.js';

// Lazy Redis client
let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  const redisUrl = process.env['STORAGE_REDIS_URL'];
  if (!redisUrl) return null;

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });
  }
  return redisClient;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require authentication
  const cronSecret = process.env['CRON_SECRET'];
  const authHeader = req.headers['authorization'];

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const redis = getRedisClient();
  if (!redis) {
    return res.status(500).json({ error: 'Redis not configured' });
  }

  try {
    const { type = 'channels', date, startDate, endDate, limit = '50', action } = req.query;

    switch (type) {
      case 'channels': {
        const metrics = await getChannelMetrics(
          redis,
          startDate as string | undefined,
          endDate as string | undefined
        );

        // Calculate totals
        const totals = metrics.reduce(
          (acc, m) => ({
            total: acc.total + m.total,
            success: acc.success + m.success,
            failed: acc.failed + m.failed,
          }),
          { total: 0, success: 0, failed: 0 }
        );

        return res.status(200).json({
          success: true,
          type: 'channel_metrics',
          dateRange: {
            start: startDate || 'last 30 days',
            end: endDate || 'today',
          },
          metrics,
          totals: {
            ...totals,
            successRate: totals.total > 0 ? Math.round((totals.success / totals.total) * 100) : 0,
          },
          timestamp: new Date().toISOString(),
        });
      }

      case 'daily': {
        const dailyMetrics = await getDailyMetrics(redis, date as string | undefined);

        return res.status(200).json({
          success: true,
          type: 'daily_metrics',
          ...dailyMetrics,
          timestamp: new Date().toISOString(),
        });
      }

      case 'audit': {
        let events;
        if (date) {
          events = await getAuditEventsByDate(redis, date as string);
        } else {
          events = await getRecentAuditEvents(
            redis,
            parseInt(limit as string, 10),
            action as AuditAction | undefined
          );
        }

        return res.status(200).json({
          success: true,
          type: 'audit_events',
          count: events.length,
          events,
          timestamp: new Date().toISOString(),
        });
      }

      default:
        return res.status(400).json({
          error: 'Invalid type parameter',
          validTypes: ['channels', 'daily', 'audit'],
        });
    }
  } catch (error) {
    console.error('[metrics] Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
