/**
 * Audit Log & Metrics Module
 *
 * Provides structured logging for booking actions and success rate metrics.
 * All data is stored in Redis with configurable TTL for GDPR compliance.
 *
 * Features:
 * - Audit log: Records all booking/cancellation events
 * - Metrics: Tracks success rates by channel (Momence vs Customer Leads)
 * - Query endpoints: Retrieve logs and metrics for monitoring
 */

import Redis from 'ioredis';

// ============================================================================
// TYPES
// ============================================================================

export type AuditAction =
  | 'booking_created'
  | 'booking_confirmed'
  | 'booking_failed'
  | 'booking_cancelled'
  | 'reminder_sent'
  | 'feedback_sent';

export type BookingChannel = 'momence_api' | 'customer_leads' | 'fallback';

export interface AuditEvent {
  id: string;
  timestamp: string;
  action: AuditAction;
  channel?: BookingChannel;
  eventId?: string;
  email?: string; // Redacted for GDPR
  phone?: string; // Redacted for GDPR
  className?: string;
  classDate?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface ChannelMetrics {
  channel: BookingChannel;
  total: number;
  success: number;
  failed: number;
  successRate: number;
}

export interface DailyMetrics {
  date: string;
  totalBookings: number;
  momenceApi: { success: number; failed: number };
  customerLeads: { success: number; failed: number };
  fallback: { success: number; failed: number };
  cancellations: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const AUDIT_LOG_TTL_DAYS = 90; // Keep audit logs for 90 days (GDPR compliance)
const AUDIT_LOG_TTL_SECONDS = AUDIT_LOG_TTL_DAYS * 24 * 60 * 60;

const METRICS_KEY_PREFIX = 'metrics:';
const AUDIT_KEY_PREFIX = 'audit:';

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Record an audit event
 */
export async function recordAuditEvent(
  redis: Redis,
  event: Omit<AuditEvent, 'id' | 'timestamp'>
): Promise<string> {
  const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const timestamp = new Date().toISOString();

  const auditEvent: AuditEvent = {
    id,
    timestamp,
    ...event,
  };

  const dateKey = timestamp.split('T')[0] ?? ''; // YYYY-MM-DD

  // Store in sorted set by timestamp for efficient querying
  await redis.zadd(`${AUDIT_KEY_PREFIX}events`, Date.now(), JSON.stringify(auditEvent));

  // Also index by date for daily queries
  await redis.sadd(`${AUDIT_KEY_PREFIX}by_date:${dateKey}`, id);
  await redis.setex(
    `${AUDIT_KEY_PREFIX}event:${id}`,
    AUDIT_LOG_TTL_SECONDS,
    JSON.stringify(auditEvent)
  );

  // Update metrics counters
  await updateMetrics(redis, event.action, event.channel, event.success);

  return id;
}

/**
 * Update daily metrics counters
 */
async function updateMetrics(
  redis: Redis,
  action: AuditAction,
  channel?: BookingChannel,
  success?: boolean
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const metricsKey = `${METRICS_KEY_PREFIX}daily:${today}`;

  // Increment total counter for action type
  await redis.hincrby(metricsKey, `${action}:total`, 1);

  // Track success/failure by channel for bookings
  if (channel && (action === 'booking_created' || action === 'booking_confirmed')) {
    const status = success ? 'success' : 'failed';
    await redis.hincrby(metricsKey, `${channel}:${status}`, 1);
    await redis.hincrby(metricsKey, `${channel}:total`, 1);
  }

  // Set TTL on metrics (keep for 365 days for historical analysis)
  await redis.expire(metricsKey, 365 * 24 * 60 * 60);
}

// ============================================================================
// METRICS QUERIES
// ============================================================================

/**
 * Get channel metrics for a specific date range
 */
export async function getChannelMetrics(
  redis: Redis,
  startDate?: string,
  endDate?: string
): Promise<ChannelMetrics[]> {
  const end = endDate || new Date().toISOString().split('T')[0] || '';
  const start = startDate || getDateDaysAgo(30);

  const channels: BookingChannel[] = ['momence_api', 'customer_leads', 'fallback'];
  const metrics: ChannelMetrics[] = [];

  for (const channel of channels) {
    let total = 0;
    let success = 0;
    let failed = 0;

    // Iterate through dates
    const dates = getDateRange(start, end);
    for (const date of dates) {
      const metricsKey = `${METRICS_KEY_PREFIX}daily:${date}`;
      const data = await redis.hgetall(metricsKey);

      total += parseInt(data[`${channel}:total`] || '0', 10);
      success += parseInt(data[`${channel}:success`] || '0', 10);
      failed += parseInt(data[`${channel}:failed`] || '0', 10);
    }

    metrics.push({
      channel,
      total,
      success,
      failed,
      successRate: total > 0 ? Math.round((success / total) * 100) : 0,
    });
  }

  return metrics;
}

/**
 * Get daily metrics for a specific date
 */
export async function getDailyMetrics(redis: Redis, date?: string): Promise<DailyMetrics> {
  const targetDate = date || new Date().toISOString().split('T')[0] || '';
  const metricsKey = `${METRICS_KEY_PREFIX}daily:${targetDate}`;

  const data = await redis.hgetall(metricsKey);

  return {
    date: targetDate,
    totalBookings:
      parseInt(data['booking_created:total'] || '0', 10) +
      parseInt(data['booking_confirmed:total'] || '0', 10),
    momenceApi: {
      success: parseInt(data['momence_api:success'] || '0', 10),
      failed: parseInt(data['momence_api:failed'] || '0', 10),
    },
    customerLeads: {
      success: parseInt(data['customer_leads:success'] || '0', 10),
      failed: parseInt(data['customer_leads:failed'] || '0', 10),
    },
    fallback: {
      success: parseInt(data['fallback:success'] || '0', 10),
      failed: parseInt(data['fallback:failed'] || '0', 10),
    },
    cancellations: parseInt(data['booking_cancelled:total'] || '0', 10),
  };
}

/**
 * Get recent audit events
 */
export async function getRecentAuditEvents(
  redis: Redis,
  limit: number = 50,
  action?: AuditAction
): Promise<AuditEvent[]> {
  // Get most recent events from sorted set
  const raw = await redis.zrevrange(`${AUDIT_KEY_PREFIX}events`, 0, limit - 1);

  const events: AuditEvent[] = raw.map(item => JSON.parse(item));

  // Filter by action if specified
  if (action) {
    return events.filter(e => e.action === action);
  }

  return events;
}

/**
 * Get audit events for a specific date
 */
export async function getAuditEventsByDate(redis: Redis, date: string): Promise<AuditEvent[]> {
  const eventIds = await redis.smembers(`${AUDIT_KEY_PREFIX}by_date:${date}`);
  const events: AuditEvent[] = [];

  for (const id of eventIds) {
    const eventData = await redis.get(`${AUDIT_KEY_PREFIX}event:${id}`);
    if (eventData) {
      events.push(JSON.parse(eventData));
    }
  }

  // Sort by timestamp descending
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0] ?? '';
}

function getDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);

  while (startDate <= endDate) {
    dates.push(startDate.toISOString().split('T')[0] ?? '');
    startDate.setDate(startDate.getDate() + 1);
  }

  return dates;
}

// ============================================================================
// CLEANUP (for GDPR compliance)
// ============================================================================

/**
 * Clean up old audit events (run periodically via cron)
 */
export async function cleanupOldAuditEvents(redis: Redis): Promise<number> {
  const cutoffTime = Date.now() - AUDIT_LOG_TTL_SECONDS * 1000;

  // Remove old events from sorted set
  const removed = await redis.zremrangebyscore(`${AUDIT_KEY_PREFIX}events`, 0, cutoffTime);

  return removed;
}
