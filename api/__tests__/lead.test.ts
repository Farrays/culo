/**
 * Tests for Lead Capture API Endpoint
 *
 * Tests the /api/lead endpoint behavior including:
 * - Method restrictions
 * - Field validation
 * - Rate limiting
 * - GDPR consent requirement
 * - Email format validation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock ioredis
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      get: vi.fn().mockResolvedValue(null),
      setex: vi.fn().mockResolvedValue('OK'),
    })),
  };
});

// Mock rate limiter (now uses Redis)
vi.mock('../lib/rate-limit-helper.js', () => ({
  isRateLimitedRedis: vi.fn().mockResolvedValue(false),
}));

import handler from '../lead';
import { isRateLimitedRedis } from '../lib/rate-limit-helper.js';

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

// Valid lead data
const validLeadData = {
  firstName: 'María',
  lastName: 'López',
  email: 'maria@example.com',
  phoneNumber: '+34 612 345 678',
  discoveryAnswer: 'Instagram',
  estilo: 'bachata',
  acceptsMarketing: true,
};

// Rate limiting is now mocked via isRateLimitedRedis

describe('Lead Capture API Endpoint', () => {
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

  describe('Environment Configuration', () => {
    it('should return 500 when Momence config is missing', async () => {
      delete process.env['MOMENCE_API_URL'];
      delete process.env['MOMENCE_TOKEN'];
      delete process.env['MOMENCE_SOURCE_ID'];

      const req = createMockRequest({
        body: validLeadData,
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res._json).toEqual({ error: 'Server configuration error' });
    });
  });

  describe('Field Validation', () => {
    beforeEach(() => {
      process.env['MOMENCE_API_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_TOKEN'] = 'test-token';
      process.env['MOMENCE_SOURCE_ID'] = '1234';
    });

    it('should require firstName', async () => {
      const req = createMockRequest({
        body: { ...validLeadData, firstName: '' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toEqual({ error: 'Missing required fields' });
    });

    it('should require lastName', async () => {
      const req = createMockRequest({
        body: { ...validLeadData, lastName: '' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toEqual({ error: 'Missing required fields' });
    });

    it('should require email', async () => {
      const req = createMockRequest({
        body: { ...validLeadData, email: '' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toEqual({ error: 'Missing required fields' });
    });

    it('should require phoneNumber', async () => {
      const req = createMockRequest({
        body: { ...validLeadData, phoneNumber: '' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toEqual({ error: 'Missing required fields' });
    });

    it('should validate email format', async () => {
      const req = createMockRequest({
        body: { ...validLeadData, email: 'invalid-email' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toEqual({ error: 'Invalid email format' });
    });
  });

  describe('GDPR Compliance', () => {
    beforeEach(() => {
      process.env['MOMENCE_API_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_TOKEN'] = 'test-token';
      process.env['MOMENCE_SOURCE_ID'] = '1234';
    });

    it('should require marketing consent', async () => {
      const req = createMockRequest({
        body: { ...validLeadData, acceptsMarketing: false },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toEqual({ error: 'Consent required' });
    });
  });

  describe('Rate Limiting', () => {
    beforeEach(() => {
      process.env['MOMENCE_API_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_TOKEN'] = 'test-token';
      process.env['MOMENCE_SOURCE_ID'] = '1234';
    });

    it('should return 429 when rate limited', async () => {
      vi.mocked(isRateLimitedRedis).mockResolvedValueOnce(true);

      const req = createMockRequest({ body: validLeadData });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res._json).toEqual({ error: 'Too many requests. Please wait a minute.' });
    });

    it('should allow request when not rate limited', async () => {
      vi.mocked(isRateLimitedRedis).mockResolvedValueOnce(false);

      const req = createMockRequest({ body: validLeadData });
      const res = createMockResponse();

      await handler(req, res);

      // Should not be rate limited (mock returns false)
      expect(res._status).not.toBe(429);
    }, 10000);
  });

  describe('Custom Source ID', () => {
    beforeEach(() => {
      process.env['MOMENCE_API_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_TOKEN'] = 'test-token';
      process.env['MOMENCE_SOURCE_ID'] = '1234';
    });

    it('should accept custom sourceId in body', async () => {
      const req = createMockRequest({
        body: { ...validLeadData, sourceId: '9999' },
      });
      const res = createMockResponse();

      // This won't reach Momence API in test, but validates the code path
      await handler(req, res);

      // Should reach the Momence API call (502 without mock, or 200 with success)
      expect([200, 500, 502]).toContain(res._status);
    });
  });
});
