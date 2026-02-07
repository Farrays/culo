/**
 * Tests for CSRF Token Endpoint
 *
 * Tests the /api/csrf endpoint behavior including:
 * - Token generation when feature is enabled
 * - Dummy token when feature is disabled
 * - Error handling
 * - CORS headers
 * - Method restrictions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock the dependencies
vi.mock('../lib/csrf.js', () => ({
  generateCsrfToken: vi.fn(),
  getSessionFromRequest: vi.fn(),
}));

vi.mock('../lib/feature-flags.js', () => ({
  isFeatureEnabled: vi.fn(),
  FEATURES: {
    CSRF_PROTECTION: 'CSRF_PROTECTION',
  },
}));

import handler from '../csrf';
import { generateCsrfToken, getSessionFromRequest } from '../lib/csrf.js';
import { isFeatureEnabled } from '../lib/feature-flags.js';

// Helper to create mock request
function createMockRequest(overrides: Partial<VercelRequest> = {}): VercelRequest {
  return {
    method: 'GET',
    headers: {
      origin: 'https://www.farrayscenter.com',
      'user-agent': 'test-agent',
    },
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

describe('CSRF Token Endpoint', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    it('should set CORS headers for allowed origin', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      vi.mocked(isFeatureEnabled).mockResolvedValue(false);

      await handler(req, res);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'https://www.farrayscenter.com'
      );
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Credentials', 'true');
    });

    it('should not set origin header for disallowed origins', async () => {
      const req = createMockRequest({
        headers: { origin: 'https://malicious-site.com' },
      });
      const res = createMockResponse();
      vi.mocked(isFeatureEnabled).mockResolvedValue(false);

      await handler(req, res);

      // Check that Access-Control-Allow-Origin was NOT called with the malicious origin
      const originCalls = vi
        .mocked(res.setHeader)
        .mock.calls.filter(call => call[0] === 'Access-Control-Allow-Origin');
      expect(originCalls.length).toBe(0);
    });
  });

  describe('Feature Flag Disabled', () => {
    it('should return dummy token when CSRF is disabled', async () => {
      const req = createMockRequest();
      const res = createMockResponse();
      vi.mocked(isFeatureEnabled).mockResolvedValue(false);

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json).toMatchObject({
        expiresIn: 900,
        enabled: false,
      });
      expect((res._json as { token: string }).token).toMatch(/^csrf_disabled_/);
    });
  });

  describe('Feature Flag Enabled', () => {
    it('should generate real token when CSRF is enabled', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      vi.mocked(isFeatureEnabled).mockResolvedValue(true);
      vi.mocked(getSessionFromRequest).mockReturnValue({
        ip: '192.168.1.1',
        userAgent: 'test-agent',
        sessionId: 'test-session-123',
      });
      vi.mocked(generateCsrfToken).mockResolvedValue('real-csrf-token-abc123');

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res._json).toEqual({
        token: 'real-csrf-token-abc123',
        expiresIn: 900,
        enabled: true,
      });
    });

    it('should call generateCsrfToken with session ID', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      vi.mocked(isFeatureEnabled).mockResolvedValue(true);
      vi.mocked(getSessionFromRequest).mockReturnValue({
        ip: '10.0.0.1',
        userAgent: 'Mozilla/5.0',
        sessionId: 'unique-session-456',
      });
      vi.mocked(generateCsrfToken).mockResolvedValue('token-xyz');

      await handler(req, res);

      expect(generateCsrfToken).toHaveBeenCalledWith('unique-session-456');
    });
  });

  describe('Error Handling', () => {
    it('should return error token when token generation fails', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      vi.mocked(isFeatureEnabled).mockResolvedValue(true);
      vi.mocked(getSessionFromRequest).mockReturnValue({
        ip: '192.168.1.1',
        userAgent: 'test-agent',
        sessionId: 'test-session',
      });
      vi.mocked(generateCsrfToken).mockRejectedValue(new Error('Redis connection failed'));

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(200); // Fail open for UX
      expect(res._json).toMatchObject({
        expiresIn: 900,
        enabled: false,
        error: 'Token generation failed, CSRF protection disabled for this request',
      });
      expect((res._json as { token: string }).token).toMatch(/^csrf_error_/);
    });
  });
});
