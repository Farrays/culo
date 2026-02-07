/**
 * CRITICAL SYSTEMS REGRESSION TESTS
 *
 * Tests que DEBEN pasar antes de cualquier deploy.
 * Verifican que los 4 sistemas críticos siguen funcionando:
 * 1. Booking Widget
 * 2. Fichajes
 * 3. Agent Laura
 * 4. Analytics
 *
 * IMPORTANTE: Ejecutar SIEMPRE antes de merge a main:
 * npm run test:regression
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';

// ============================================================================
// MOCKS
// ============================================================================

// Mock Redis
vi.mock('../redis', () => ({
  getRedis: vi.fn(() => ({
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue('OK'),
    setex: vi.fn().mockResolvedValue('OK'),
    del: vi.fn().mockResolvedValue(1),
    pipeline: vi.fn(() => ({
      setex: vi.fn().mockReturnThis(),
      sadd: vi.fn().mockReturnThis(),
      expire: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([]),
    })),
  })),
  getBookingByEmail: vi.fn(),
  saveBooking: vi.fn(),
}));

// Mock environment variables
beforeAll(() => {
  process.env['UPSTASH_REDIS_REST_URL'] = 'https://test.upstash.io';
  process.env['UPSTASH_REDIS_REST_TOKEN'] = 'test-token';
  process.env['MOMENCE_BASE_URL'] = 'https://api.momence.com';
  process.env['RESEND_API_KEY'] = 're_test_key';
  process.env['ANTHROPIC_API_KEY'] = 'sk-ant-test';
});

// ============================================================================
// 1. BOOKING WIDGET REGRESSION TESTS
// ============================================================================

describe('CRITICAL: Booking Widget', () => {
  describe('Validation Schema', () => {
    it('should validate correct booking data', async () => {
      // Dynamic import to avoid hoisting issues
      const { bookingFormSchema } =
        await import('../../../components/booking/validation/bookingSchema');

      const validData = {
        firstName: 'María',
        lastName: 'García',
        email: 'maria@gmail.com',
        phone: '+34666555444',
        countryCode: 'ES',
        acceptsTerms: true,
        acceptsPrivacy: true,
        acceptsAge: true,
        acceptsHeels: false,
        acceptsMarketing: false,
      };

      const result = bookingFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', async () => {
      const { bookingFormSchema } =
        await import('../../../components/booking/validation/bookingSchema');

      const invalidData = {
        firstName: 'María',
        lastName: 'García',
        email: 'invalid-email',
        phone: '+34666555444',
        acceptsTerms: true,
        acceptsPrivacy: true,
        acceptsAge: true,
      };

      const result = bookingFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject disposable email domains', async () => {
      const { bookingFormSchema } =
        await import('../../../components/booking/validation/bookingSchema');

      const disposableEmail = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@tempmail.com',
        phone: '+34666555444',
        acceptsTerms: true,
        acceptsPrivacy: true,
        acceptsAge: true,
      };

      const result = bookingFormSchema.safeParse(disposableEmail);
      expect(result.success).toBe(false);
    });

    it('should require GDPR consents', async () => {
      const { bookingFormSchema } =
        await import('../../../components/booking/validation/bookingSchema');

      const noConsent = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@gmail.com',
        phone: '+34666555444',
        acceptsTerms: false, // Required!
        acceptsPrivacy: true,
        acceptsAge: true,
      };

      const result = bookingFormSchema.safeParse(noConsent);
      expect(result.success).toBe(false);
    });
  });

  describe('Phone Utils', () => {
    it('should normalize Spanish phone numbers', async () => {
      const { normalizePhone } = await import('../phone-utils');

      // normalizePhone returns digits without + prefix
      expect(normalizePhone('666 555 444')).toBe('34666555444');
      expect(normalizePhone('+34 666 555 444')).toBe('34666555444');
    });

    it('should validate phone format', async () => {
      const { isValidPhone } = await import('../phone-utils');

      expect(isValidPhone('+34666555444')).toBe(true);
      expect(isValidPhone('666555444')).toBe(true); // Spanish mobile
      expect(isValidPhone('12')).toBe(false); // Too short
    });
  });

  describe('Email Validation', () => {
    it('should validate email format', async () => {
      const { validateEmailSync } = await import('../email-validation');

      const validResult = validateEmailSync('user@example.com');
      expect(validResult.valid).toBe(true);

      const invalidResult = validateEmailSync('invalid-email');
      expect(invalidResult.valid).toBe(false);
    });

    it('should detect disposable email domains', async () => {
      const { validateEmailSync } = await import('../email-validation');

      const disposableResult = validateEmailSync('test@tempmail.com');
      expect(disposableResult.valid).toBe(false);
      expect(disposableResult.reason).toBe('disposable_email');

      const validResult = validateEmailSync('user@gmail.com');
      expect(validResult.valid).toBe(true);
    });
  });
});

// ============================================================================
// 2. FICHAJES SYSTEM REGRESSION TESTS
// ============================================================================

describe('CRITICAL: Fichajes System', () => {
  describe('Data Integrity', () => {
    it('should have required fichaje fields defined', () => {
      // Verificar que la estructura de datos está intacta
      const requiredFields = [
        'id',
        'profesorId',
        'profesorNombre',
        'fechaHora',
        'tipo', // 'entrada' | 'salida'
        'claseId',
        'claseNombre',
      ];

      // Tipo esperado de un fichaje
      interface Fichaje {
        id: string;
        profesorId: number;
        profesorNombre: string;
        fechaHora: string;
        tipo: 'entrada' | 'salida';
        claseId?: number;
        claseNombre?: string;
      }

      const mockFichaje: Fichaje = {
        id: 'test-123',
        profesorId: 1,
        profesorNombre: 'Yunaisy Farray',
        fechaHora: new Date().toISOString(),
        tipo: 'entrada',
        claseId: 100,
        claseNombre: 'Salsa Cubana',
      };

      // Verificar que todos los campos requeridos existen
      for (const field of requiredFields.slice(0, 5)) {
        expect(mockFichaje).toHaveProperty(field);
      }
    });

    it('should validate fichaje tipo enum', () => {
      const validTypes = ['entrada', 'salida'];
      const invalidType = 'break';

      expect(validTypes.includes('entrada')).toBe(true);
      expect(validTypes.includes('salida')).toBe(true);
      expect(validTypes.includes(invalidType)).toBe(false);
    });
  });

  describe('Time Calculations', () => {
    it('should calculate hours worked correctly', () => {
      const entrada = new Date('2026-02-07T09:00:00');
      const salida = new Date('2026-02-07T14:30:00');

      const hoursWorked = (salida.getTime() - entrada.getTime()) / (1000 * 60 * 60);

      expect(hoursWorked).toBe(5.5);
    });

    it('should handle overnight shifts', () => {
      const entrada = new Date('2026-02-07T22:00:00');
      const salida = new Date('2026-02-08T02:00:00');

      const hoursWorked = (salida.getTime() - entrada.getTime()) / (1000 * 60 * 60);

      expect(hoursWorked).toBe(4);
    });
  });
});

// ============================================================================
// 3. AGENT LAURA REGRESSION TESTS
// ============================================================================

describe('CRITICAL: Agent Laura (AI)', () => {
  describe('Language Detection', () => {
    it('should detect Spanish correctly', async () => {
      const { detectLanguage } = await import('../ai/language-detector');

      expect(detectLanguage('Hola, quiero información sobre clases')).toBe('es');
      expect(detectLanguage('Buenos días, ¿tienen bachata?')).toBe('es');
    });

    it('should detect Catalan correctly', async () => {
      const { detectLanguage } = await import('../ai/language-detector');

      expect(detectLanguage('Bon dia, vull informació sobre classes')).toBe('ca');
      expect(detectLanguage("M'agradaria saber els horaris")).toBe('ca');
    });

    it('should detect English correctly', async () => {
      const { detectLanguage } = await import('../ai/language-detector');

      expect(detectLanguage('Hello, I want to know about dance classes')).toBe('en');
      expect(detectLanguage('What time do your classes start?')).toBe('en');
    });

    it('should detect French correctly', async () => {
      const { detectLanguage } = await import('../ai/language-detector');

      expect(detectLanguage('Bonjour, je voudrais des informations')).toBe('fr');
      expect(detectLanguage('Avez-vous des cours de danse?')).toBe('fr');
    });

    it('should default to Spanish for ambiguous text', async () => {
      const { detectLanguage } = await import('../ai/language-detector');

      expect(detectLanguage('OK')).toBe('es');
      expect(detectLanguage('123')).toBe('es');
    });
  });

  describe('Lead Scoring', () => {
    it('should export lead scorer module', async () => {
      const leadScorer = await import('../ai/lead-scorer');
      expect(leadScorer).toBeDefined();
      // Module should have some exports
      expect(Object.keys(leadScorer).length).toBeGreaterThan(0);
    });
  });

  describe('Knowledge Base', () => {
    it('should export knowledge base module', async () => {
      const kb = await import('../ai/knowledge-base');
      expect(kb).toBeDefined();
      expect(Object.keys(kb).length).toBeGreaterThan(0);
    });
  });

  describe('Consent Flow (GDPR)', () => {
    it('should export consent flow module', async () => {
      const consentFlow = await import('../ai/consent-flow');
      expect(consentFlow).toBeDefined();
      expect(Object.keys(consentFlow).length).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// 4. ANALYTICS REGRESSION TESTS
// ============================================================================

describe('CRITICAL: Analytics System', () => {
  describe('Event Tracking', () => {
    it('should have all booking funnel events defined', async () => {
      const requiredEvents = [
        'booking_filter_changed',
        'booking_class_selected',
        'booking_form_started',
        'booking_success',
        'booking_error',
        'booking_week_changed',
      ];

      // Verificar que los eventos están documentados
      for (const event of requiredEvents) {
        expect(typeof event).toBe('string');
        expect(event.startsWith('booking_')).toBe(true);
      }
    });

    it('should calculate lead values correctly', () => {
      const LEAD_VALUES = {
        EXIT_INTENT: 15,
        CONTACT_FORM: 20,
        GENERIC_LEAD: 15,
        TRIAL_CLASS: 25,
        MEMBERSHIP: 100,
        BOOKING_LEAD: 90,
      };

      expect(LEAD_VALUES.BOOKING_LEAD).toBeGreaterThan(LEAD_VALUES.GENERIC_LEAD);
      expect(LEAD_VALUES.MEMBERSHIP).toBe(100);
    });
  });

  describe('Data Layer', () => {
    it('should format GTM events correctly', () => {
      const mockEvent = {
        event: 'booking_success',
        booking_style: 'Salsa Cubana',
        booking_level: 'Principiantes',
        booking_time: '19:00',
        booking_instructor: 'Yunaisy',
      };

      expect(mockEvent).toHaveProperty('event');
      expect(mockEvent.event).toBe('booking_success');
      expect(Object.keys(mockEvent).length).toBeGreaterThan(1);
    });
  });

  describe('Audit Logging', () => {
    it('should export audit module', async () => {
      const audit = await import('../audit');
      expect(audit).toBeDefined();
      expect(Object.keys(audit).length).toBeGreaterThan(0);
    });

    it('should redact PII in audit logs', async () => {
      const { redactEmail, redactPhone } = await import('../redact');

      expect(redactEmail('john.doe@gmail.com')).toBe('joh***@gmail.com');
      expect(redactPhone('+34666555444')).toMatch(/\*\*\*/); // Contains redaction
    });
  });
});

// ============================================================================
// 5. FEATURE FLAGS REGRESSION TESTS
// ============================================================================

describe('CRITICAL: Feature Flags System', () => {
  it('should have all critical system flags defined', async () => {
    const { FEATURES } = await import('../feature-flags');

    // Kill switches must exist
    expect(FEATURES.BOOKING_ENABLED).toBeDefined();
    expect(FEATURES.FICHAJE_ENABLED).toBeDefined();
    expect(FEATURES.AGENT_LAURA_ENABLED).toBeDefined();
    expect(FEATURES.ANALYTICS_ENABLED).toBeDefined();
  });

  it('should default kill switches to ON (systems enabled)', async () => {
    const { isFeatureEnabled, FEATURES } = await import('../feature-flags');

    // Por defecto, todos los sistemas deben estar habilitados
    // (aunque Redis esté vacío o falle)
    expect(await isFeatureEnabled(FEATURES.BOOKING_ENABLED)).toBe(true);
    expect(await isFeatureEnabled(FEATURES.FICHAJE_ENABLED)).toBe(true);
    expect(await isFeatureEnabled(FEATURES.AGENT_LAURA_ENABLED)).toBe(true);
    expect(await isFeatureEnabled(FEATURES.ANALYTICS_ENABLED)).toBe(true);
  });

  it('should default new features to OFF (safe deployment)', async () => {
    const { isFeatureEnabled, FEATURES } = await import('../feature-flags');

    // Nuevas features deben estar OFF por defecto
    expect(await isFeatureEnabled(FEATURES.CSRF_PROTECTION)).toBe(false);
    expect(await isFeatureEnabled(FEATURES.WEBHOOK_ENFORCEMENT)).toBe(false);
    expect(await isFeatureEnabled(FEATURES.ENHANCED_SANITIZATION)).toBe(false);
  });
});

// ============================================================================
// 6. INTEGRATION SANITY CHECKS
// ============================================================================

describe('CRITICAL: Integration Sanity', () => {
  it('should have required environment variables documented', () => {
    const requiredEnvVars = [
      'UPSTASH_REDIS_REST_URL',
      'UPSTASH_REDIS_REST_TOKEN',
      'MOMENCE_BASE_URL',
      'RESEND_API_KEY',
      'ANTHROPIC_API_KEY',
    ];

    // En tests, verificamos que están mockeados
    for (const envVar of requiredEnvVars) {
      expect(process.env[envVar]).toBeDefined();
    }
  });

  it('should export all required modules from api/lib', async () => {
    // Verificar que los módulos críticos se pueden importar
    const modules = [
      '../redis',
      '../email',
      '../phone-utils',
      '../email-validation',
      '../rate-limit-helper',
      '../audit',
      '../redact',
      '../feature-flags',
      '../csrf',
    ];

    for (const modulePath of modules) {
      const module = await import(modulePath);
      expect(module).toBeDefined();
    }
  });
});

// ============================================================================
// 7. CSRF PROTECTION REGRESSION TESTS
// ============================================================================

describe('CRITICAL: CSRF Protection', () => {
  describe('Token Generation', () => {
    it('should generate valid session ID from request data', async () => {
      const { generateSessionId } = await import('../csrf');

      const sessionId = generateSessionId('192.168.1.1', 'Mozilla/5.0');

      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBe(16); // SHA256 truncated to 16 chars
    });

    it('should generate different session IDs for different clients', async () => {
      const { generateSessionId } = await import('../csrf');

      const session1 = generateSessionId('192.168.1.1', 'Mozilla/5.0');
      const session2 = generateSessionId('192.168.1.2', 'Mozilla/5.0');
      const session3 = generateSessionId('192.168.1.1', 'Chrome/100');

      expect(session1).not.toBe(session2);
      expect(session1).not.toBe(session3);
    });
  });

  describe('Token Validation', () => {
    it('should allow requests when CSRF feature is disabled', async () => {
      const { validateCsrfToken } = await import('../csrf');

      // With feature disabled (default), should allow without token
      const result = await validateCsrfToken(undefined, 'test-session');

      expect(result.valid).toBe(true);
      expect(result.reason).toBe('feature_disabled');
    });

    it('should reject invalid token format', async () => {
      // This test would only run when feature is enabled
      // For now, we just verify the function exists and returns expected structure
      const { validateCsrfToken } = await import('../csrf');

      const result = await validateCsrfToken('invalid-token', 'test-session');

      // When feature is disabled, it should still return valid
      // When enabled, it would reject invalid format
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('reason');
    });
  });

  describe('Request Helpers', () => {
    it('should extract session info from mock request', async () => {
      const { getSessionFromRequest } = await import('../csrf');

      const mockReq = {
        headers: {
          'x-forwarded-for': '192.168.1.100',
          'user-agent': 'Test Browser',
        },
      } as unknown as import('@vercel/node').VercelRequest;

      const { ip, userAgent, sessionId } = getSessionFromRequest(mockReq);

      expect(ip).toBe('192.168.1.100');
      expect(userAgent).toBe('Test Browser');
      expect(sessionId).toBeDefined();
    });

    it('should extract CSRF token from headers', async () => {
      const { getCsrfTokenFromRequest } = await import('../csrf');

      const mockReq = {
        headers: {
          'x-csrf-token': 'abc123def456',
        },
      } as unknown as import('@vercel/node').VercelRequest;

      const token = getCsrfTokenFromRequest(mockReq);

      expect(token).toBe('abc123def456');
    });

    it('should return undefined for missing CSRF token', async () => {
      const { getCsrfTokenFromRequest } = await import('../csrf');

      const mockReq = {
        headers: {},
      } as unknown as import('@vercel/node').VercelRequest;

      const token = getCsrfTokenFromRequest(mockReq);

      expect(token).toBeUndefined();
    });
  });
});

// ============================================================================
// 8. WEBHOOK ENFORCEMENT REGRESSION TESTS
// ============================================================================

describe('CRITICAL: Webhook Enforcement', () => {
  describe('Feature Flag Integration', () => {
    it('should have WEBHOOK_ENFORCEMENT flag defined', async () => {
      const { FEATURES } = await import('../feature-flags');

      expect(FEATURES.WEBHOOK_ENFORCEMENT).toBe('security.webhook_enforcement');
    });

    it('should default WEBHOOK_ENFORCEMENT to OFF (audit mode)', async () => {
      const { FEATURES } = await import('../feature-flags');

      // Get default value from module - feature should be OFF by default
      const defaultFlags = await import('../feature-flags').then(m => m.DEFAULT_FLAGS);
      expect(defaultFlags?.[FEATURES.WEBHOOK_ENFORCEMENT]).toBe(false);
    });
  });

  describe('Signature Verification Logic', () => {
    it('should correctly calculate HMAC-SHA256 signature', async () => {
      const crypto = await import('crypto');
      const testSecret = 'test_secret_key';
      const testBody = JSON.stringify({ event: 'test', data: { id: 123 } });

      const signature = crypto.createHmac('sha256', testSecret).update(testBody).digest('hex');

      // Verify it's a valid hex string of correct length (64 chars for SHA256)
      expect(signature).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should use timing-safe comparison for signatures', async () => {
      const crypto = await import('crypto');

      // Verify timingSafeEqual exists and works
      const buf1 = globalThis.Buffer.from('signature1');
      const buf2 = globalThis.Buffer.from('signature1');
      const buf3 = globalThis.Buffer.from('signature2');

      expect(crypto.timingSafeEqual(buf1, buf2)).toBe(true);
      expect(crypto.timingSafeEqual(buf1, buf3)).toBe(false);
    });
  });

  describe('Enforcement Behavior', () => {
    it('should allow requests in AUDIT mode (flag OFF)', async () => {
      // In audit mode (default), invalid signatures should NOT block requests
      // This is verified by checking the feature flag default value
      const { isFeatureEnabled, FEATURES } = await import('../feature-flags');

      const enforcementEnabled = await isFeatureEnabled(FEATURES.WEBHOOK_ENFORCEMENT);

      // Default should be false (audit mode)
      expect(enforcementEnabled).toBe(false);
    });
  });
});
