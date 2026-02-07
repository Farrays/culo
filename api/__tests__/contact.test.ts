/**
 * Tests for Contact Form API Endpoint
 *
 * Tests the /api/contact endpoint behavior including:
 * - Method restrictions
 * - Field validation
 * - CORS headers
 * - Input sanitization
 * - GDPR compliance (privacy acceptance required)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock dependencies
vi.mock('../lib/rate-limit-helper.js', () => ({
  isRateLimitedRedis: vi.fn().mockResolvedValue(false),
}));

vi.mock('../lib/csrf.js', () => ({
  validateCsrfRequest: vi.fn().mockResolvedValue(null),
}));

import handler from '../contact';
import { isRateLimitedRedis } from '../lib/rate-limit-helper.js';
import { validateCsrfRequest } from '../lib/csrf.js';

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

// Valid form data
const validFormData = {
  firstName: 'Juan',
  lastName: 'García',
  email: 'juan@example.com',
  phoneNumber: '+34 612 345 678',
  comoconoce: 'Google',
  Asunto: 'Información sobre clases',
  Mensaje: 'Me gustaría saber más sobre las clases de baile.',
  acceptsPrivacy: true,
};

describe('Contact Form API Endpoint', () => {
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

  describe('CORS Headers', () => {
    it('should set CORS headers for production origin', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await handler(req, res);

      expect(res.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'https://www.farrayscenter.com'
      );
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'POST');
    });
  });

  describe('Rate Limiting', () => {
    it('should return 429 when rate limited', async () => {
      vi.mocked(isRateLimitedRedis).mockResolvedValueOnce(true);

      const req = createMockRequest({ body: validFormData });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res._json).toEqual({ error: 'Too many requests. Please wait a minute.' });
    });
  });

  describe('CSRF Protection', () => {
    it('should return error when CSRF validation fails', async () => {
      vi.mocked(validateCsrfRequest).mockResolvedValueOnce({
        status: 403,
        error: 'Invalid CSRF token',
      });

      const req = createMockRequest({ body: validFormData });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('Environment Configuration', () => {
    it('should return 500 when Momence config is missing', async () => {
      delete process.env['MOMENCE_CONTACT_URL'];
      delete process.env['MOMENCE_CONTACT_TOKEN'];
      delete process.env['MOMENCE_CONTACT_SOURCE_ID'];

      const req = createMockRequest({ body: validFormData });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res._json).toEqual({ error: 'Server configuration error' });
    });
  });

  describe('Field Validation', () => {
    it('should require firstName', async () => {
      process.env['MOMENCE_CONTACT_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_CONTACT_TOKEN'] = 'test-token';
      process.env['MOMENCE_CONTACT_SOURCE_ID'] = '1234';

      const req = createMockRequest({
        body: { ...validFormData, firstName: '' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toMatchObject({ field: 'firstName' });
    });

    it('should require lastName', async () => {
      process.env['MOMENCE_CONTACT_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_CONTACT_TOKEN'] = 'test-token';
      process.env['MOMENCE_CONTACT_SOURCE_ID'] = '1234';

      const req = createMockRequest({
        body: { ...validFormData, lastName: '' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toMatchObject({ field: 'lastName' });
    });

    it('should require valid email', async () => {
      process.env['MOMENCE_CONTACT_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_CONTACT_TOKEN'] = 'test-token';
      process.env['MOMENCE_CONTACT_SOURCE_ID'] = '1234';

      const req = createMockRequest({
        body: { ...validFormData, email: 'invalid-email' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toMatchObject({ field: 'email' });
    });

    it('should require valid phone number', async () => {
      process.env['MOMENCE_CONTACT_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_CONTACT_TOKEN'] = 'test-token';
      process.env['MOMENCE_CONTACT_SOURCE_ID'] = '1234';

      const req = createMockRequest({
        body: { ...validFormData, phoneNumber: 'abc' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toMatchObject({ field: 'phoneNumber' });
    });

    it('should require Asunto (subject)', async () => {
      process.env['MOMENCE_CONTACT_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_CONTACT_TOKEN'] = 'test-token';
      process.env['MOMENCE_CONTACT_SOURCE_ID'] = '1234';

      const req = createMockRequest({
        body: { ...validFormData, Asunto: '' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toMatchObject({ field: 'Asunto' });
    });

    it('should require Mensaje with minimum length', async () => {
      process.env['MOMENCE_CONTACT_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_CONTACT_TOKEN'] = 'test-token';
      process.env['MOMENCE_CONTACT_SOURCE_ID'] = '1234';

      const req = createMockRequest({
        body: { ...validFormData, Mensaje: 'Short' },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toMatchObject({
        error: 'Message must be at least 10 characters',
        field: 'Mensaje',
      });
    });
  });

  describe('GDPR Compliance', () => {
    it('should require privacy policy acceptance', async () => {
      process.env['MOMENCE_CONTACT_URL'] = 'https://api.momence.com/test';
      process.env['MOMENCE_CONTACT_TOKEN'] = 'test-token';
      process.env['MOMENCE_CONTACT_SOURCE_ID'] = '1234';

      const req = createMockRequest({
        body: { ...validFormData, acceptsPrivacy: false },
      });
      const res = createMockResponse();

      await handler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res._json).toMatchObject({
        error: 'Privacy policy acceptance is required (LOPD/RGPD compliance)',
        field: 'acceptsPrivacy',
      });
    });
  });
});
