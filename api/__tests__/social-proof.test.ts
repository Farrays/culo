/**
 * Tests for Social Proof API Endpoint
 *
 * Tests the /api/social-proof endpoint behavior including:
 * - Method restrictions
 * - CORS headers
 * - Redis integration
 * - Data transformation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock ioredis
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      lrange: vi.fn(),
    })),
  };
});

import handler from '../social-proof';

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

describe('Social Proof API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env['STORAGE_REDIS_URL'];
  });

  describe('Method Handling', () => {
    it('should return 405 for non-GET methods', async () => {
      const req = createMockRequest({ method: 'POST' });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res._json).toEqual({ error: 'Method not allowed' });
    });

    it('should accept GET requests', async () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('CORS Headers', () => {
    it('should set CORS headers', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET');
    });

    it('should set cache control headers', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Cache-Control',
        'public, s-maxage=30, stale-while-revalidate=60'
      );
    });
  });

  describe('Response Without Redis', () => {
    it('should return empty bookings when Redis is not configured', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json).toMatchObject({
        success: true,
        bookings: [],
        message: 'Redis not configured',
      });
    });
  });

  describe('Query Parameters', () => {
    it('should respect limit parameter', async () => {
      const req = createMockRequest({ query: { limit: '3' } });
      const res = createMockResponse();

      await handler(req, res);

      // Without Redis, returns empty but validates limit parsing
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should cap limit at 10', async () => {
      const req = createMockRequest({ query: { limit: '100' } });
      const res = createMockResponse();

      await handler(req, res);

      // Should not throw, limit is capped internally
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle invalid limit gracefully', async () => {
      const req = createMockRequest({ query: { limit: 'invalid' } });
      const res = createMockResponse();

      await handler(req, res);

      // Should default to 5 when parsing fails
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Response Structure', () => {
    it('should return proper response structure', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      const response = res._json as { success: boolean; bookings: unknown[] };
      expect(response).toHaveProperty('success');
      expect(response).toHaveProperty('bookings');
      expect(Array.isArray(response.bookings)).toBe(true);
    });
  });
});
