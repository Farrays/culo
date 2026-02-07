/**
 * Tests for Health Check Endpoint
 *
 * Tests the /api/health endpoint behavior including:
 * - Basic health response structure
 * - Method restrictions
 * - CORS headers
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock ioredis
vi.mock('ioredis', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      ping: vi.fn().mockResolvedValue('PONG'),
      get: vi.fn().mockResolvedValue(null),
      scan: vi.fn().mockResolvedValue(['0', []]),
    })),
  };
});

import handler from '../health';

// Helper to create mock request
function createMockRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'GET',
    headers: {},
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

describe('Health Check Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Method Handling', () => {
    it('should return 405 for non-GET methods', async () => {
      const req = createMockRequest({ method: 'POST' });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res._json).toEqual({ error: 'Method not allowed. Use GET.' });
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
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, OPTIONS');
    });
  });

  describe('Health Response Structure', () => {
    it('should return proper health response structure', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res._json).toMatchObject({
        status: expect.stringMatching(/^(healthy|degraded|unhealthy)$/),
        checks: {
          redis: expect.objectContaining({ status: expect.any(String) }),
          momenceCircuit: expect.objectContaining({ status: expect.any(String) }),
          resend: expect.objectContaining({ status: expect.any(String) }),
          momenceApi: expect.objectContaining({ status: expect.any(String) }),
        },
        queues: {
          emailRetryPending: expect.any(Number),
        },
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        environment: expect.any(String),
      });
    });

    it('should return appropriate HTTP status based on health', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      // Without Redis configured, Redis check will fail -> unhealthy (503)
      // This is expected behavior: Redis is a critical dependency
      expect([200, 503]).toContain(res._status);

      // Verify the status field matches the HTTP code
      const response = res._json as { status: string };
      if (res._status === 503) {
        expect(response.status).toBe('unhealthy');
      } else {
        expect(['healthy', 'degraded']).toContain(response.status);
      }
    });
  });

  describe('Dependency Checks', () => {
    it('should check Resend configuration', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      // Without RESEND_API_KEY, should be degraded
      delete process.env['RESEND_API_KEY'];

      await handler(req, res);

      const response = res._json as { checks: { resend: { configured: boolean } } };
      expect(response.checks.resend).toMatchObject({
        configured: false,
      });
    });

    it('should check Momence API configuration', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      // Without Momence config, should be degraded
      delete process.env['MOMENCE_CLIENT_ID'];
      delete process.env['MOMENCE_API_URL'];

      await handler(req, res);

      const response = res._json as { checks: { momenceApi: { configured: boolean } } };
      expect(response.checks.momenceApi).toMatchObject({
        configured: false,
      });
    });
  });
});
