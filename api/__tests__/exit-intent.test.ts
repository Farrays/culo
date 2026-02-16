/**
 * Tests for Exit Intent API Endpoint
 *
 * Tests the /api/exit-intent endpoint behavior including:
 * - Method restrictions
 * - Email validation
 * - Rate limiting
 * - Minimal form requirements (email only)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock dependencies
vi.mock('../lib/rate-limit-helper.js', () => ({
  isRateLimitedRedis: vi.fn().mockResolvedValue(false),
}));

vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
  },
}));

vi.mock('../lib/meta-capi.js', () => ({
  sendMetaConversionEvent: vi.fn().mockResolvedValue(undefined),
  generateServerEventId: vi.fn().mockReturnValue('test-event-id-123'),
}));

// Mock global fetch for Momence API calls
const mockFetchResponse = {
  ok: true,
  json: () => Promise.resolve({ success: true }),
  text: () => Promise.resolve('OK'),
};
vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockFetchResponse));

import handler from '../exit-intent';
import { isRateLimitedRedis } from '../lib/rate-limit-helper.js';
import { kv } from '@vercel/kv';

// Store original env
const originalEnv = process.env;

// Helper to create mock request
function createMockRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'POST',
    headers: {
      'x-forwarded-for': '192.168.1.1',
    },
    body: {},
    socket: { remoteAddress: '127.0.0.1' },
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

describe('Exit Intent API Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  describe('Method Handling', () => {
    it('should return 405 for non-POST methods', async () => {
      const req = createMockRequest({ method: 'GET' });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res._json).toEqual({ error: 'Method not allowed' });
    });
  });

  describe('Rate Limiting', () => {
    it('should return 429 when rate limited', async () => {
      vi.mocked(isRateLimitedRedis).mockResolvedValueOnce(true);

      const req = createMockRequest({
        body: { email: 'test@example.com' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res._json).toEqual({ error: 'Too many requests. Please wait a minute.' });
    });
  });

  describe('Environment Configuration', () => {
    it('should return 500 when Momence config is missing', async () => {
      delete process.env['MOMENCE_API_URL'];
      delete process.env['MOMENCE_TOKEN'];
      delete process.env['MOMENCE_EXIT_INTENT_SOURCE_ID'];

      const req = createMockRequest({
        body: { email: 'test@example.com' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res._json).toEqual({ error: 'Server configuration error' });
    });
  });

  describe('Email Validation', () => {
    beforeEach(() => {
      process.env['MOMENCE_API_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_TOKEN'] = 'test-token';
      process.env['MOMENCE_EXIT_INTENT_SOURCE_ID'] = '5678';
    });

    it('should require email', async () => {
      const req = createMockRequest({ body: {} });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toEqual({ error: 'Email is required' });
    });

    it('should validate email format', async () => {
      const req = createMockRequest({
        body: { email: 'not-an-email' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toEqual({ error: 'Invalid email format' });
    });

    it('should accept valid email', async () => {
      const req = createMockRequest({
        body: { email: 'user@example.com' },
      });
      const res = createMockResponse();

      await handler(req, res);

      // Should get past validation (may fail at Momence call without mock)
      expect(res._status).not.toBe(400);
    });
  });

  describe('Deduplication', () => {
    beforeEach(() => {
      process.env['MOMENCE_API_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_TOKEN'] = 'test-token';
      process.env['MOMENCE_EXIT_INTENT_SOURCE_ID'] = '5678';
    });

    it('should return existing status for duplicate emails', async () => {
      vi.mocked(kv.get).mockResolvedValueOnce({
        timestamp: Date.now() - 1000,
        promo: 'test-promo',
      });

      const req = createMockRequest({
        body: { email: 'duplicate@example.com' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json).toMatchObject({
        success: true,
        status: 'existing',
        message: 'Discount already reserved',
      });
    });

    it('should not call Momence API for duplicate emails', async () => {
      vi.mocked(kv.get).mockResolvedValueOnce({
        timestamp: Date.now() - 1000,
        promo: 'test-promo',
      });

      const fetchSpy = vi.spyOn(globalThis, 'fetch');

      const req = createMockRequest({
        body: { email: 'duplicate@example.com' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('Optional Fields', () => {
    beforeEach(() => {
      process.env['MOMENCE_API_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_TOKEN'] = 'test-token';
      process.env['MOMENCE_EXIT_INTENT_SOURCE_ID'] = '5678';
    });

    it('should accept optional page parameter', async () => {
      const req = createMockRequest({
        body: {
          email: 'test@example.com',
          page: '/es/clases/bachata',
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      // Should not fail validation
      expect(res._status).not.toBe(400);
    });

    it('should accept optional promo parameter', async () => {
      const req = createMockRequest({
        body: {
          email: 'test@example.com',
          promo: '15% descuento',
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      // Should not fail validation
      expect(res._status).not.toBe(400);
    });

    it('should accept optional locale parameter', async () => {
      const req = createMockRequest({
        body: {
          email: 'test@example.com',
          locale: 'ca',
        },
      });
      const res = createMockResponse();

      await handler(req, res);

      // Should not fail validation
      expect(res._status).not.toBe(400);
    });
  });
});
