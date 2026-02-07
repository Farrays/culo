/**
 * Tests for Metrics API Endpoint
 *
 * Tests the /api/metrics endpoint behavior including:
 * - Method restrictions
 * - Authorization requirements
 * - Query parameter handling
 * - Different metric types (channels, daily, audit)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock ioredis
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({})),
  };
});

// Mock audit functions
vi.mock('../lib/audit.js', () => ({
  getChannelMetrics: vi.fn(),
  getDailyMetrics: vi.fn(),
  getRecentAuditEvents: vi.fn(),
  getAuditEventsByDate: vi.fn(),
}));

import handler from '../metrics';
import {
  getChannelMetrics,
  getDailyMetrics,
  getRecentAuditEvents,
  getAuditEventsByDate,
} from '../lib/audit.js';

// Store original env
const originalEnv = process.env;

// Helper to create mock request
function createMockRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'GET',
    headers: {},
    query: {},
    ...overrides,
  } as VercelRequest;
}

// Helper to create mock response
function createMockResponse(): VercelResponse & { _json: unknown; _status: number } {
  const res = {
    _json: null as unknown,
    _status: 200,
    _headers: {} as Record<string, string>,
    setHeader: vi.fn((key: string, value: string) => {
      res._headers[key] = value;
      return res;
    }),
    status: vi.fn((code: number) => {
      res._status = code;
      return res;
    }),
    json: vi.fn((data: unknown) => {
      res._json = data;
      return res;
    }),
    end: vi.fn(() => res),
  };
  return res as unknown as VercelResponse & { _json: unknown; _status: number };
}

describe('Metrics API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env['STORAGE_REDIS_URL'] = 'redis://localhost:6379';
  });

  describe('Method Handling', () => {
    it('should return 405 for non-GET methods', async () => {
      const req = createMockRequest({ method: 'POST' });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res._json).toEqual({ error: 'Method not allowed' });
    });

    it('should handle OPTIONS preflight', async () => {
      const req = createMockRequest({ method: 'OPTIONS' });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('CORS Headers', () => {
    it('should set CORS headers', async () => {
      process.env['CRON_SECRET'] = 'test-secret';
      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      });
      const res = createMockResponse();

      vi.mocked(getChannelMetrics).mockResolvedValue([]);

      await handler(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, OPTIONS');
    });
  });

  describe('Authorization', () => {
    it('should return 401 when CRON_SECRET is set but auth header is missing', async () => {
      process.env['CRON_SECRET'] = 'test-secret';

      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res._json).toEqual({ error: 'Unauthorized' });
    });

    it('should return 401 when auth token is invalid', async () => {
      process.env['CRON_SECRET'] = 'test-secret';

      const req = createMockRequest({
        headers: { authorization: 'Bearer wrong-token' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('should allow access with valid token', async () => {
      process.env['CRON_SECRET'] = 'test-secret';

      const req = createMockRequest({
        headers: { authorization: 'Bearer test-secret' },
      });
      const res = createMockResponse();

      vi.mocked(getChannelMetrics).mockResolvedValue([]);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should allow access when CRON_SECRET is not set', async () => {
      delete process.env['CRON_SECRET'];

      const req = createMockRequest();
      const res = createMockResponse();

      vi.mocked(getChannelMetrics).mockResolvedValue([]);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Redis Configuration', () => {
    it('should return 500 when Redis is not configured', async () => {
      delete process.env['STORAGE_REDIS_URL'];
      delete process.env['CRON_SECRET'];

      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res._json).toEqual({ error: 'Redis not configured' });
    });
  });

  describe('Channel Metrics (default)', () => {
    it('should return channel metrics by default', async () => {
      delete process.env['CRON_SECRET'];

      const mockMetrics = [
        { channel: 'widget', total: 100, success: 95, failed: 5 },
        { channel: 'whatsapp', total: 50, success: 48, failed: 2 },
      ];

      vi.mocked(getChannelMetrics).mockResolvedValue(mockMetrics);

      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json).toMatchObject({
        success: true,
        type: 'channel_metrics',
        metrics: mockMetrics,
        totals: {
          total: 150,
          success: 143,
          failed: 7,
          successRate: 95,
        },
      });
    });

    it('should pass date range to getChannelMetrics', async () => {
      delete process.env['CRON_SECRET'];

      vi.mocked(getChannelMetrics).mockResolvedValue([]);

      const req = createMockRequest({
        query: { startDate: '2024-01-01', endDate: '2024-01-31' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(getChannelMetrics).toHaveBeenCalledWith(expect.anything(), '2024-01-01', '2024-01-31');
    });
  });

  describe('Daily Metrics', () => {
    it('should return daily metrics when type=daily', async () => {
      delete process.env['CRON_SECRET'];

      const mockDailyMetrics = {
        date: '2024-01-15',
        bookings: 25,
        cancellations: 2,
        revenue: 500,
      };

      vi.mocked(getDailyMetrics).mockResolvedValue(mockDailyMetrics);

      const req = createMockRequest({ query: { type: 'daily' } });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json).toMatchObject({
        success: true,
        type: 'daily_metrics',
        ...mockDailyMetrics,
      });
    });

    it('should pass date parameter to getDailyMetrics', async () => {
      delete process.env['CRON_SECRET'];

      vi.mocked(getDailyMetrics).mockResolvedValue({});

      const req = createMockRequest({
        query: { type: 'daily', date: '2024-01-15' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(getDailyMetrics).toHaveBeenCalledWith(expect.anything(), '2024-01-15');
    });
  });

  describe('Audit Events', () => {
    it('should return audit events when type=audit', async () => {
      delete process.env['CRON_SECRET'];

      const mockEvents = [
        { action: 'booking_created', timestamp: '2024-01-15T10:00:00Z' },
        { action: 'booking_cancelled', timestamp: '2024-01-15T11:00:00Z' },
      ];

      vi.mocked(getRecentAuditEvents).mockResolvedValue(mockEvents);

      const req = createMockRequest({ query: { type: 'audit' } });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json).toMatchObject({
        success: true,
        type: 'audit_events',
        count: 2,
        events: mockEvents,
      });
    });

    it('should use getAuditEventsByDate when date is provided', async () => {
      delete process.env['CRON_SECRET'];

      const mockEvents = [{ action: 'booking_created', timestamp: '2024-01-15T10:00:00Z' }];

      vi.mocked(getAuditEventsByDate).mockResolvedValue(mockEvents);

      const req = createMockRequest({
        query: { type: 'audit', date: '2024-01-15' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(getAuditEventsByDate).toHaveBeenCalledWith(expect.anything(), '2024-01-15');
      expect(getRecentAuditEvents).not.toHaveBeenCalled();
    });

    it('should respect limit parameter for audit events', async () => {
      delete process.env['CRON_SECRET'];

      vi.mocked(getRecentAuditEvents).mockResolvedValue([]);

      const req = createMockRequest({
        query: { type: 'audit', limit: '100' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(getRecentAuditEvents).toHaveBeenCalledWith(expect.anything(), 100, undefined);
    });
  });

  describe('Invalid Type', () => {
    it('should return 400 for invalid type parameter', async () => {
      delete process.env['CRON_SECRET'];

      const req = createMockRequest({ query: { type: 'invalid' } });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toMatchObject({
        error: 'Invalid type parameter',
        validTypes: ['channels', 'daily', 'audit'],
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle errors gracefully', async () => {
      delete process.env['CRON_SECRET'];

      vi.mocked(getChannelMetrics).mockRejectedValue(new Error('Redis connection failed'));

      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res._json).toMatchObject({
        error: 'Internal server error',
        details: 'Redis connection failed',
      });
    });
  });
});
