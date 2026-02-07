/**
 * Tests for Audit Log & Metrics Module
 *
 * Tests structured logging and metrics:
 * - Audit event recording
 * - Channel metrics aggregation
 * - Daily metrics queries
 * - GDPR cleanup
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuditAction, BookingChannel, AuditEvent } from '../audit';
import {
  recordAuditEvent,
  getChannelMetrics,
  getDailyMetrics,
  getRecentAuditEvents,
  getAuditEventsByDate,
  cleanupOldAuditEvents,
} from '../audit';

// Create a mock Redis instance
function createMockRedis() {
  return {
    zadd: vi.fn().mockResolvedValue(1),
    sadd: vi.fn().mockResolvedValue(1),
    setex: vi.fn().mockResolvedValue('OK'),
    hincrby: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(1),
    hgetall: vi.fn().mockResolvedValue({}),
    zrevrange: vi.fn().mockResolvedValue([]),
    smembers: vi.fn().mockResolvedValue([]),
    get: vi.fn().mockResolvedValue(null),
    zremrangebyscore: vi.fn().mockResolvedValue(0),
  };
}

describe('Audit Module - Types', () => {
  it('should have valid AuditAction types', () => {
    const validActions: AuditAction[] = [
      'booking_created',
      'booking_confirmed',
      'booking_failed',
      'booking_cancelled',
      'reminder_sent',
      'feedback_sent',
    ];
    expect(validActions.length).toBe(6);
  });

  it('should have valid BookingChannel types', () => {
    const validChannels: BookingChannel[] = ['momence_api', 'customer_leads', 'fallback'];
    expect(validChannels.length).toBe(3);
  });
});

describe('Audit Module - recordAuditEvent', () => {
  let mockRedis: ReturnType<typeof createMockRedis>;

  beforeEach(() => {
    mockRedis = createMockRedis();
    vi.clearAllMocks();
  });

  it('should record an audit event and return an ID', async () => {
    const event = {
      action: 'booking_created' as AuditAction,
      channel: 'momence_api' as BookingChannel,
      eventId: 'evt-123',
      email: 'joh***@example.com',
      className: 'Salsa',
      success: true,
    };

    // @ts-expect-error - mock Redis type
    const id = await recordAuditEvent(mockRedis, event);

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(10);
  });

  it('should store event in sorted set', async () => {
    const event = {
      action: 'booking_created' as AuditAction,
      success: true,
    };

    // @ts-expect-error - mock Redis type
    await recordAuditEvent(mockRedis, event);

    expect(mockRedis.zadd).toHaveBeenCalledWith(
      'audit:events',
      expect.any(Number),
      expect.stringContaining('"action":"booking_created"')
    );
  });

  it('should index event by date', async () => {
    const event = {
      action: 'booking_confirmed' as AuditAction,
      success: true,
    };

    // @ts-expect-error - mock Redis type
    await recordAuditEvent(mockRedis, event);

    // Should call sadd with date-based key
    expect(mockRedis.sadd).toHaveBeenCalledWith(
      expect.stringMatching(/^audit:by_date:\d{4}-\d{2}-\d{2}$/),
      expect.any(String)
    );
  });

  it('should set TTL on individual event', async () => {
    const event = {
      action: 'booking_cancelled' as AuditAction,
      success: true,
    };

    // @ts-expect-error - mock Redis type
    await recordAuditEvent(mockRedis, event);

    // TTL should be 90 days in seconds = 7776000
    expect(mockRedis.setex).toHaveBeenCalledWith(
      expect.stringMatching(/^audit:event:/),
      7776000,
      expect.any(String)
    );
  });

  it('should update metrics for booking events', async () => {
    const event = {
      action: 'booking_created' as AuditAction,
      channel: 'momence_api' as BookingChannel,
      success: true,
    };

    // @ts-expect-error - mock Redis type
    await recordAuditEvent(mockRedis, event);

    // Should update action counter
    expect(mockRedis.hincrby).toHaveBeenCalledWith(
      expect.stringMatching(/^metrics:daily:\d{4}-\d{2}-\d{2}$/),
      'booking_created:total',
      1
    );

    // Should update channel success counter
    expect(mockRedis.hincrby).toHaveBeenCalledWith(
      expect.stringMatching(/^metrics:daily:/),
      'momence_api:success',
      1
    );
  });

  it('should track failed bookings correctly', async () => {
    const event = {
      action: 'booking_created' as AuditAction,
      channel: 'customer_leads' as BookingChannel,
      success: false,
      errorMessage: 'API timeout',
    };

    // @ts-expect-error - mock Redis type
    await recordAuditEvent(mockRedis, event);

    expect(mockRedis.hincrby).toHaveBeenCalledWith(
      expect.stringMatching(/^metrics:daily:/),
      'customer_leads:failed',
      1
    );
  });
});

describe('Audit Module - getDailyMetrics', () => {
  let mockRedis: ReturnType<typeof createMockRedis>;

  beforeEach(() => {
    mockRedis = createMockRedis();
  });

  it('should return zeroed metrics when no data exists', async () => {
    mockRedis.hgetall.mockResolvedValue({});

    // @ts-expect-error - mock Redis type
    const metrics = await getDailyMetrics(mockRedis, '2026-02-07');

    expect(metrics).toEqual({
      date: '2026-02-07',
      totalBookings: 0,
      momenceApi: { success: 0, failed: 0 },
      customerLeads: { success: 0, failed: 0 },
      fallback: { success: 0, failed: 0 },
      cancellations: 0,
    });
  });

  it('should aggregate metrics correctly', async () => {
    mockRedis.hgetall.mockResolvedValue({
      'booking_created:total': '10',
      'booking_confirmed:total': '5',
      'momence_api:success': '12',
      'momence_api:failed': '3',
      'customer_leads:success': '2',
      'customer_leads:failed': '1',
      'booking_cancelled:total': '2',
    });

    // @ts-expect-error - mock Redis type
    const metrics = await getDailyMetrics(mockRedis, '2026-02-07');

    expect(metrics.totalBookings).toBe(15); // 10 + 5
    expect(metrics.momenceApi.success).toBe(12);
    expect(metrics.momenceApi.failed).toBe(3);
    expect(metrics.customerLeads.success).toBe(2);
    expect(metrics.customerLeads.failed).toBe(1);
    expect(metrics.cancellations).toBe(2);
  });

  it('should use today if no date provided', async () => {
    mockRedis.hgetall.mockResolvedValue({});

    // @ts-expect-error - mock Redis type
    const metrics = await getDailyMetrics(mockRedis);

    // Should have today's date
    const today = new Date().toISOString().split('T')[0];
    expect(metrics.date).toBe(today);
  });
});

describe('Audit Module - getRecentAuditEvents', () => {
  let mockRedis: ReturnType<typeof createMockRedis>;

  beforeEach(() => {
    mockRedis = createMockRedis();
  });

  it('should return empty array when no events', async () => {
    mockRedis.zrevrange.mockResolvedValue([]);

    // @ts-expect-error - mock Redis type
    const events = await getRecentAuditEvents(mockRedis);

    expect(events).toEqual([]);
  });

  it('should parse and return events', async () => {
    const mockEvents = [
      JSON.stringify({
        id: '123',
        timestamp: '2026-02-07T10:00:00Z',
        action: 'booking_created',
        success: true,
      }),
      JSON.stringify({
        id: '124',
        timestamp: '2026-02-07T11:00:00Z',
        action: 'booking_confirmed',
        success: true,
      }),
    ];

    mockRedis.zrevrange.mockResolvedValue(mockEvents);

    // @ts-expect-error - mock Redis type
    const events = await getRecentAuditEvents(mockRedis);

    expect(events.length).toBe(2);
    expect(events[0]?.action).toBe('booking_created');
    expect(events[1]?.action).toBe('booking_confirmed');
  });

  it('should filter by action when specified', async () => {
    const mockEvents = [
      JSON.stringify({ id: '1', action: 'booking_created', success: true, timestamp: '' }),
      JSON.stringify({ id: '2', action: 'booking_cancelled', success: true, timestamp: '' }),
      JSON.stringify({ id: '3', action: 'booking_created', success: true, timestamp: '' }),
    ];

    mockRedis.zrevrange.mockResolvedValue(mockEvents);

    // @ts-expect-error - mock Redis type
    const events = await getRecentAuditEvents(mockRedis, 50, 'booking_created');

    expect(events.length).toBe(2);
    expect(events.every(e => e.action === 'booking_created')).toBe(true);
  });

  it('should respect limit parameter', async () => {
    // @ts-expect-error - mock Redis type
    await getRecentAuditEvents(mockRedis, 25);

    expect(mockRedis.zrevrange).toHaveBeenCalledWith('audit:events', 0, 24);
  });
});

describe('Audit Module - getAuditEventsByDate', () => {
  let mockRedis: ReturnType<typeof createMockRedis>;

  beforeEach(() => {
    mockRedis = createMockRedis();
  });

  it('should return empty array when no events for date', async () => {
    mockRedis.smembers.mockResolvedValue([]);

    // @ts-expect-error - mock Redis type
    const events = await getAuditEventsByDate(mockRedis, '2026-02-07');

    expect(events).toEqual([]);
  });

  it('should fetch and return events for date', async () => {
    const event1: AuditEvent = {
      id: '1',
      timestamp: '2026-02-07T10:00:00Z',
      action: 'booking_created',
      success: true,
    };
    const event2: AuditEvent = {
      id: '2',
      timestamp: '2026-02-07T12:00:00Z',
      action: 'booking_confirmed',
      success: true,
    };

    mockRedis.smembers.mockResolvedValue(['1', '2']);
    mockRedis.get
      .mockResolvedValueOnce(JSON.stringify(event1))
      .mockResolvedValueOnce(JSON.stringify(event2));

    // @ts-expect-error - mock Redis type
    const events = await getAuditEventsByDate(mockRedis, '2026-02-07');

    expect(events.length).toBe(2);
  });

  it('should sort events by timestamp descending', async () => {
    const event1: AuditEvent = {
      id: '1',
      timestamp: '2026-02-07T08:00:00Z',
      action: 'booking_created',
      success: true,
    };
    const event2: AuditEvent = {
      id: '2',
      timestamp: '2026-02-07T14:00:00Z',
      action: 'booking_confirmed',
      success: true,
    };

    mockRedis.smembers.mockResolvedValue(['1', '2']);
    mockRedis.get
      .mockResolvedValueOnce(JSON.stringify(event1))
      .mockResolvedValueOnce(JSON.stringify(event2));

    // @ts-expect-error - mock Redis type
    const events = await getAuditEventsByDate(mockRedis, '2026-02-07');

    // Event2 (14:00) should come before Event1 (08:00)
    expect(events[0]?.id).toBe('2');
    expect(events[1]?.id).toBe('1');
  });

  it('should skip events that no longer exist', async () => {
    mockRedis.smembers.mockResolvedValue(['1', '2', '3']);
    mockRedis.get
      .mockResolvedValueOnce(
        JSON.stringify({ id: '1', timestamp: '', action: 'booking_created', success: true })
      )
      .mockResolvedValueOnce(null) // Event 2 was deleted
      .mockResolvedValueOnce(
        JSON.stringify({ id: '3', timestamp: '', action: 'booking_created', success: true })
      );

    // @ts-expect-error - mock Redis type
    const events = await getAuditEventsByDate(mockRedis, '2026-02-07');

    expect(events.length).toBe(2);
    expect(events.map(e => e.id)).toEqual(['1', '3']);
  });
});

describe('Audit Module - cleanupOldAuditEvents', () => {
  let mockRedis: ReturnType<typeof createMockRedis>;

  beforeEach(() => {
    mockRedis = createMockRedis();
  });

  it('should remove old events and return count', async () => {
    mockRedis.zremrangebyscore.mockResolvedValue(15);

    // @ts-expect-error - mock Redis type
    const removed = await cleanupOldAuditEvents(mockRedis);

    expect(removed).toBe(15);
  });

  it('should use correct cutoff time (90 days)', async () => {
    // @ts-expect-error - mock Redis type
    await cleanupOldAuditEvents(mockRedis);

    // Verify zremrangebyscore was called with audit:events key
    expect(mockRedis.zremrangebyscore).toHaveBeenCalledWith('audit:events', 0, expect.any(Number));

    // The cutoff should be approximately 90 days ago in milliseconds
    const call = mockRedis.zremrangebyscore.mock.calls[0];
    const cutoffTime = call?.[2] as number;
    const expectedCutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;

    // Allow 1 second tolerance
    expect(Math.abs(cutoffTime - expectedCutoff)).toBeLessThan(1000);
  });

  it('should return 0 when no old events', async () => {
    mockRedis.zremrangebyscore.mockResolvedValue(0);

    // @ts-expect-error - mock Redis type
    const removed = await cleanupOldAuditEvents(mockRedis);

    expect(removed).toBe(0);
  });
});

describe('Audit Module - getChannelMetrics', () => {
  let mockRedis: ReturnType<typeof createMockRedis>;

  beforeEach(() => {
    mockRedis = createMockRedis();
  });

  it('should return metrics for all channels', async () => {
    mockRedis.hgetall.mockResolvedValue({
      'momence_api:total': '100',
      'momence_api:success': '95',
      'momence_api:failed': '5',
      'customer_leads:total': '20',
      'customer_leads:success': '18',
      'customer_leads:failed': '2',
    });

    // @ts-expect-error - mock Redis type
    const metrics = await getChannelMetrics(mockRedis, '2026-02-01', '2026-02-01');

    expect(metrics.length).toBe(3); // momence_api, customer_leads, fallback

    const momence = metrics.find(m => m.channel === 'momence_api');
    expect(momence?.total).toBe(100);
    expect(momence?.success).toBe(95);
    expect(momence?.failed).toBe(5);
    expect(momence?.successRate).toBe(95); // 95/100 = 95%
  });

  it('should calculate success rate correctly', async () => {
    mockRedis.hgetall.mockResolvedValue({
      'momence_api:total': '10',
      'momence_api:success': '7',
      'momence_api:failed': '3',
    });

    // @ts-expect-error - mock Redis type
    const metrics = await getChannelMetrics(mockRedis, '2026-02-01', '2026-02-01');

    const momence = metrics.find(m => m.channel === 'momence_api');
    expect(momence?.successRate).toBe(70); // 7/10 = 70%
  });

  it('should return 0 success rate when no data', async () => {
    mockRedis.hgetall.mockResolvedValue({});

    // @ts-expect-error - mock Redis type
    const metrics = await getChannelMetrics(mockRedis, '2026-02-01', '2026-02-01');

    expect(metrics.every(m => m.successRate === 0)).toBe(true);
  });
});
