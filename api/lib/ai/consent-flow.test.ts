/**
 * Consent Flow Tests
 *
 * Tests GDPR/RGPD consent management.
 * Run with: npm test -- consent-flow.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  ConsentManager,
  createConsentRecord,
  formatConsentSummary,
  type ConsentRecord,
} from './consent-flow';
import type { Redis } from '@upstash/redis';

// Mock Redis
const createMockRedis = () => ({
  get: vi.fn(),
  setex: vi.fn(),
  del: vi.fn(),
});

describe('ConsentManager', () => {
  let mockRedis: ReturnType<typeof createMockRedis>;
  let manager: ConsentManager;

  beforeEach(() => {
    mockRedis = createMockRedis();
    manager = new ConsentManager(mockRedis as unknown as Redis);
  });

  describe('saveConsent', () => {
    it('should save consent record to Redis', async () => {
      const consent: ConsentRecord = {
        phone: '+34612345678',
        email: 'test@email.com',
        terms: true,
        privacy: true,
        marketing: false,
        timestamp: new Date().toISOString(),
        channel: 'whatsapp',
        version: '2026-01-01',
      };

      mockRedis.setex.mockResolvedValue('OK');

      const result = await manager.saveConsent(consent);

      expect(result).toBe(true);
      expect(mockRedis.setex).toHaveBeenCalledWith(
        'consent:+34612345678',
        expect.any(Number),
        expect.any(String)
      );
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedis.setex.mockRejectedValue(new Error('Redis error'));

      const consent: ConsentRecord = {
        phone: '+34612345678',
        terms: true,
        privacy: true,
        marketing: false,
        timestamp: new Date().toISOString(),
        channel: 'whatsapp',
        version: '2026-01-01',
      };

      const result = await manager.saveConsent(consent);

      expect(result).toBe(false);
    });

    it('should return false when Redis is not available', async () => {
      const managerWithoutRedis = new ConsentManager(null);

      const consent: ConsentRecord = {
        phone: '+34612345678',
        terms: true,
        privacy: true,
        marketing: false,
        timestamp: new Date().toISOString(),
        channel: 'whatsapp',
        version: '2026-01-01',
      };

      const result = await managerWithoutRedis.saveConsent(consent);

      expect(result).toBe(false);
    });
  });

  describe('getConsent', () => {
    it('should retrieve consent record from Redis', async () => {
      const storedConsent: ConsentRecord = {
        phone: '+34612345678',
        email: 'test@email.com',
        terms: true,
        privacy: true,
        marketing: true,
        timestamp: '2026-01-15T10:00:00Z',
        channel: 'whatsapp',
        version: '2026-01-01',
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(storedConsent));

      const result = await manager.getConsent('+34612345678');

      expect(result).toEqual(storedConsent);
      expect(mockRedis.get).toHaveBeenCalledWith('consent:+34612345678');
    });

    it('should return null when consent not found', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await manager.getConsent('+34999999999');

      expect(result).toBeNull();
    });

    it('should return null when Redis is not available', async () => {
      const managerWithoutRedis = new ConsentManager(null);

      const result = await managerWithoutRedis.getConsent('+34612345678');

      expect(result).toBeNull();
    });
  });

  describe('hasRequiredConsents', () => {
    it('should return true when terms and privacy are accepted', async () => {
      const storedConsent: ConsentRecord = {
        phone: '+34612345678',
        terms: true,
        privacy: true,
        marketing: false,
        timestamp: '2026-01-15T10:00:00Z',
        channel: 'whatsapp',
        version: '2026-01-01',
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(storedConsent));

      const result = await manager.hasRequiredConsents('+34612345678');

      expect(result).toBe(true);
    });

    it('should return false when terms are not accepted', async () => {
      const storedConsent: ConsentRecord = {
        phone: '+34612345678',
        terms: false,
        privacy: true,
        marketing: false,
        timestamp: '2026-01-15T10:00:00Z',
        channel: 'whatsapp',
        version: '2026-01-01',
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(storedConsent));

      const result = await manager.hasRequiredConsents('+34612345678');

      expect(result).toBe(false);
    });

    it('should return false when no consent record exists', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await manager.hasRequiredConsents('+34612345678');

      expect(result).toBe(false);
    });
  });

  describe('validateConsents', () => {
    it('should validate complete consents', () => {
      const result = manager.validateConsents({
        terms: true,
        privacy: true,
        marketing: false,
      });

      expect(result.isValid).toBe(true);
      expect(result.missingRequired).toHaveLength(0);
    });

    it('should detect missing terms', () => {
      const result = manager.validateConsents({
        terms: false,
        privacy: true,
        marketing: false,
      });

      expect(result.isValid).toBe(false);
      expect(result.missingRequired).toContain('terms');
    });

    it('should detect missing privacy', () => {
      const result = manager.validateConsents({
        terms: true,
        privacy: false,
        marketing: false,
      });

      expect(result.isValid).toBe(false);
      expect(result.missingRequired).toContain('privacy');
    });

    it('should detect multiple missing consents', () => {
      const result = manager.validateConsents({
        terms: false,
        privacy: false,
        marketing: true,
      });

      expect(result.isValid).toBe(false);
      expect(result.missingRequired).toContain('terms');
      expect(result.missingRequired).toContain('privacy');
    });
  });

  describe('updateMarketingConsent', () => {
    it('should update marketing consent', async () => {
      const storedConsent: ConsentRecord = {
        phone: '+34612345678',
        terms: true,
        privacy: true,
        marketing: false,
        timestamp: '2026-01-15T10:00:00Z',
        channel: 'whatsapp',
        version: '2026-01-01',
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(storedConsent));
      mockRedis.setex.mockResolvedValue('OK');

      const result = await manager.updateMarketingConsent('+34612345678', true);

      expect(result).toBe(true);
      expect(mockRedis.setex).toHaveBeenCalled();

      // Verify the saved data includes updated marketing consent
      const savedData = JSON.parse(mockRedis.setex.mock.calls[0]?.[2] ?? '{}');
      expect(savedData.marketing).toBe(true);
    });

    it('should return false when no existing consent', async () => {
      mockRedis.get.mockResolvedValue(null);

      const result = await manager.updateMarketingConsent('+34612345678', true);

      expect(result).toBe(false);
    });
  });

  describe('revokeConsents', () => {
    it('should delete consent record (GDPR right to be forgotten)', async () => {
      mockRedis.del.mockResolvedValue(1);

      const result = await manager.revokeConsents('+34612345678');

      expect(result).toBe(true);
      expect(mockRedis.del).toHaveBeenCalledWith('consent:+34612345678');
    });

    it('should return false when Redis is not available', async () => {
      const managerWithoutRedis = new ConsentManager(null);

      const result = await managerWithoutRedis.revokeConsents('+34612345678');

      expect(result).toBe(false);
    });
  });

  describe('exportConsentData', () => {
    it('should export consent data (GDPR right to data portability)', async () => {
      const storedConsent: ConsentRecord = {
        phone: '+34612345678',
        email: 'test@email.com',
        terms: true,
        privacy: true,
        marketing: true,
        timestamp: '2026-01-15T10:00:00Z',
        channel: 'whatsapp',
        version: '2026-01-01',
      };

      mockRedis.get.mockResolvedValue(JSON.stringify(storedConsent));

      const result = await manager.exportConsentData('+34612345678');

      expect(result).toEqual(storedConsent);
    });
  });
});

describe('createConsentRecord', () => {
  it('should create consent record with all fields', () => {
    const record = createConsentRecord(
      '+34612345678',
      'test@email.com',
      true,
      true,
      false,
      'whatsapp'
    );

    expect(record.phone).toBe('+34612345678');
    expect(record.email).toBe('test@email.com');
    expect(record.terms).toBe(true);
    expect(record.privacy).toBe(true);
    expect(record.marketing).toBe(false);
    expect(record.channel).toBe('whatsapp');
    expect(record.timestamp).toBeDefined();
    expect(record.version).toBeDefined();
  });

  it('should use default channel', () => {
    const record = createConsentRecord('+34612345678', '', true, true, false);

    expect(record.channel).toBe('whatsapp');
  });
});

describe('formatConsentSummary', () => {
  const consent: ConsentRecord = {
    phone: '+34612345678',
    terms: true,
    privacy: true,
    marketing: false,
    timestamp: '2026-01-15T10:00:00Z',
    channel: 'whatsapp',
    version: '2026-01-01',
  };

  it('should format in Spanish', () => {
    const summary = formatConsentSummary(consent, 'es');

    expect(summary).toContain('Términos y Condiciones');
    expect(summary).toContain('Aceptado');
    expect(summary).toContain('No aceptado');
  });

  it('should format in Catalan', () => {
    const summary = formatConsentSummary(consent, 'ca');

    expect(summary).toContain('Termes i Condicions');
    expect(summary).toContain('Acceptat');
  });

  it('should format in English', () => {
    const summary = formatConsentSummary(consent, 'en');

    expect(summary).toContain('Terms and Conditions');
    expect(summary).toContain('Accepted');
  });

  it('should format in French', () => {
    const summary = formatConsentSummary(consent, 'fr');

    expect(summary).toContain('Conditions Générales');
    expect(summary).toContain('Accepté');
  });
});
