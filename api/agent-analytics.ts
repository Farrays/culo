/**
 * Agent Analytics API
 *
 * GET /api/agent-analytics?from=2026-01-01&to=2026-01-31
 *
 * Returns analytics summary for the AI sales agent including:
 * - Conversation and booking totals
 * - Conversion funnel metrics
 * - Lead tier distribution
 * - Top objections encountered
 * - Language breakdown
 * - Daily metrics
 *
 * @see AGENTE.md - Endpoint de Analytics
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRedisClient } from './lib/redis';
import { getAgentMetrics, type AnalyticsSummary } from './lib/ai/agent-metrics';

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).setHeader('Access-Control-Allow-Origin', '*').end();
    return;
  }

  // Only allow GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Check authorization (optional: add API key check)
  const authHeader = req.headers.authorization;
  const expectedKey = process.env['ANALYTICS_API_KEY'];

  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    // Parse query parameters
    const { from, to } = req.query;

    // Validate date parameters
    if (!from || !to) {
      // Default to last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      const fromDate = thirtyDaysAgo.toISOString().split('T')[0] ?? '';
      const toDate = today.toISOString().split('T')[0] ?? '';

      return getAnalytics(res, fromDate, toDate);
    }

    const fromDate = Array.isArray(from) ? (from[0] ?? '') : from;
    const toDate = Array.isArray(to) ? (to[0] ?? '') : to;

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromDate) || !dateRegex.test(toDate)) {
      res.status(400).json({
        error: 'Invalid date format. Use YYYY-MM-DD',
        example: '/api/agent-analytics?from=2026-01-01&to=2026-01-31',
      });
      return;
    }

    // Validate date range (max 90 days)
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    const daysDiff = (toDateObj.getTime() - fromDateObj.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > 90) {
      res.status(400).json({
        error: 'Date range too large. Maximum 90 days allowed.',
      });
      return;
    }

    if (daysDiff < 0) {
      res.status(400).json({
        error: 'Invalid date range. "from" must be before "to".',
      });
      return;
    }

    return getAnalytics(res, fromDate, toDate);
  } catch (error) {
    console.error('[agent-analytics] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getAnalytics(res: VercelResponse, from: string, to: string): Promise<void> {
  const redis = getRedisClient();
  const metrics = getAgentMetrics(redis);

  const analytics: AnalyticsSummary = await metrics.getAnalyticsSummary(from, to);

  // Add some calculated fields
  const response = {
    ...analytics,
    calculated: {
      avgConversionRate: analytics.summary.conversionRate,
      avgBookingsPerDay:
        analytics.daily.length > 0
          ? Math.round((analytics.summary.totalBookings / analytics.daily.length) * 10) / 10
          : 0,
      mostActiveLanguage: getMostActiveLanguage(analytics.byLanguage),
      topObjection:
        analytics.topObjections.length > 0 ? (analytics.topObjections[0]?.objection ?? null) : null,
      funnelDropoff: calculateFunnelDropoff(analytics.funnel),
    },
  };

  res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .setHeader('Cache-Control', 'max-age=300') // Cache for 5 minutes
    .json(response);
}

function getMostActiveLanguage(byLanguage: AnalyticsSummary['byLanguage']): string {
  let maxConversations = 0;
  let mostActive = 'es';

  for (const [lang, data] of Object.entries(byLanguage)) {
    if (data.conversations > maxConversations) {
      maxConversations = data.conversations;
      mostActive = lang;
    }
  }

  return mostActive;
}

function calculateFunnelDropoff(funnel: AnalyticsSummary['funnel']): Record<string, number> {
  const dropoff: Record<string, number> = {};

  if (funnel.started > 0) {
    dropoff['intentDetected'] = Math.round(
      ((funnel.started - funnel.intentDetected) / funnel.started) * 100
    );
  }

  if (funnel.intentDetected > 0) {
    dropoff['classSelected'] = Math.round(
      ((funnel.intentDetected - funnel.classSelected) / funnel.intentDetected) * 100
    );
  }

  if (funnel.classSelected > 0) {
    dropoff['dataCollected'] = Math.round(
      ((funnel.classSelected - funnel.dataCollected) / funnel.classSelected) * 100
    );
  }

  if (funnel.dataCollected > 0) {
    dropoff['consentsGiven'] = Math.round(
      ((funnel.dataCollected - funnel.consentsGiven) / funnel.dataCollected) * 100
    );
  }

  if (funnel.consentsGiven > 0) {
    dropoff['bookingCompleted'] = Math.round(
      ((funnel.consentsGiven - funnel.bookingCompleted) / funnel.consentsGiven) * 100
    );
  }

  return dropoff;
}
