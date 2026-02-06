/**
 * Consent Flow - GDPR/RGPD Consent Management
 *
 * Handles the collection and storage of user consents:
 * - Terms and Conditions (required)
 * - Privacy Policy (required)
 * - Marketing Communications (optional)
 *
 * @see AGENTE.md - Almacenamiento de Consentimientos
 */

import type { Redis } from '@upstash/redis';

// ============================================================================
// TYPES
// ============================================================================

export interface ConsentRecord {
  // Identification
  phone: string;
  email?: string;

  // Consents
  terms: boolean; // Terms and conditions
  privacy: boolean; // Privacy policy
  marketing: boolean; // Marketing communications (optional)

  // Metadata
  timestamp: string; // ISO timestamp when consents were given
  channel: 'whatsapp' | 'instagram' | 'email' | 'web';
  ipAddress?: string; // Only for web

  // Audit trail
  version: string; // Version of terms/privacy at time of consent
  userAgent?: string;
}

export interface ConsentValidation {
  isValid: boolean;
  missingRequired: string[];
  message?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CONSENT_KEY_PREFIX = 'consent:';
const CONSENT_TTL_SECONDS = 5 * 365 * 24 * 60 * 60; // 5 years (GDPR requirement)
const CURRENT_TERMS_VERSION = '2026-01-01'; // Update when terms change

// ============================================================================
// CONSENT MANAGER
// ============================================================================

export class ConsentManager {
  private redis: Redis | null;

  constructor(redis: Redis | null = null) {
    this.redis = redis;
  }

  /**
   * Save consent record
   */
  async saveConsent(consent: ConsentRecord): Promise<boolean> {
    if (!this.redis) {
      console.warn('[consent] Redis not available, consent not persisted');
      return false;
    }

    try {
      const key = `${CONSENT_KEY_PREFIX}${consent.phone}`;

      // Add version and ensure timestamp
      const record: ConsentRecord = {
        ...consent,
        version: CURRENT_TERMS_VERSION,
        timestamp: consent.timestamp || new Date().toISOString(),
      };

      await this.redis.setex(key, CONSENT_TTL_SECONDS, JSON.stringify(record));

      console.log(`[consent] Saved consent for ${consent.phone.slice(-4)}`);
      return true;
    } catch (error) {
      console.error('[consent] Error saving consent:', error);
      return false;
    }
  }

  /**
   * Get consent record for a phone number
   */
  async getConsent(phone: string): Promise<ConsentRecord | null> {
    if (!this.redis) return null;

    try {
      const key = `${CONSENT_KEY_PREFIX}${phone}`;
      const data = await this.redis.get(key);

      if (!data) return null;

      // Handle both string and object returns from Upstash
      if (typeof data === 'object') {
        return data as ConsentRecord;
      }
      return JSON.parse(String(data)) as ConsentRecord;
    } catch (error) {
      console.error('[consent] Error getting consent:', error);
      return null;
    }
  }

  /**
   * Check if user has given required consents
   */
  async hasRequiredConsents(phone: string): Promise<boolean> {
    const consent = await this.getConsent(phone);

    if (!consent) return false;

    return consent.terms && consent.privacy;
  }

  /**
   * Validate consent data before booking
   */
  validateConsents(consent: Partial<ConsentRecord>): ConsentValidation {
    const missingRequired: string[] = [];

    if (!consent.terms) {
      missingRequired.push('terms');
    }

    if (!consent.privacy) {
      missingRequired.push('privacy');
    }

    if (missingRequired.length > 0) {
      return {
        isValid: false,
        missingRequired,
        message: `Missing required consents: ${missingRequired.join(', ')}`,
      };
    }

    return {
      isValid: true,
      missingRequired: [],
    };
  }

  /**
   * Update marketing consent (user can change this anytime)
   */
  async updateMarketingConsent(phone: string, marketing: boolean): Promise<boolean> {
    const existing = await this.getConsent(phone);

    if (!existing) {
      console.warn('[consent] No existing consent record to update');
      return false;
    }

    return this.saveConsent({
      ...existing,
      marketing,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Revoke all consents (GDPR right to be forgotten)
   */
  async revokeConsents(phone: string): Promise<boolean> {
    if (!this.redis) return false;

    try {
      const key = `${CONSENT_KEY_PREFIX}${phone}`;
      await this.redis.del(key);

      console.log(`[consent] Revoked consents for ${phone.slice(-4)}`);
      return true;
    } catch (error) {
      console.error('[consent] Error revoking consents:', error);
      return false;
    }
  }

  /**
   * Export consent data (GDPR right to data portability)
   */
  async exportConsentData(phone: string): Promise<ConsentRecord | null> {
    return this.getConsent(phone);
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create a consent record from booking data
 */
export function createConsentRecord(
  phone: string,
  email: string,
  terms: boolean,
  privacy: boolean,
  marketing: boolean,
  channel: ConsentRecord['channel'] = 'whatsapp'
): ConsentRecord {
  return {
    phone,
    email,
    terms,
    privacy,
    marketing,
    timestamp: new Date().toISOString(),
    channel,
    version: CURRENT_TERMS_VERSION,
  };
}

/**
 * Format consent summary for display
 */
export function formatConsentSummary(
  consent: ConsentRecord,
  lang: 'es' | 'ca' | 'en' | 'fr' = 'es'
): string {
  const labels: Record<string, Record<string, string>> = {
    es: {
      terms: 'Términos y Condiciones',
      privacy: 'Política de Privacidad',
      marketing: 'Comunicaciones Comerciales',
      accepted: 'Aceptado',
      notAccepted: 'No aceptado',
    },
    ca: {
      terms: 'Termes i Condicions',
      privacy: 'Política de Privacitat',
      marketing: 'Comunicacions Comercials',
      accepted: 'Acceptat',
      notAccepted: 'No acceptat',
    },
    en: {
      terms: 'Terms and Conditions',
      privacy: 'Privacy Policy',
      marketing: 'Marketing Communications',
      accepted: 'Accepted',
      notAccepted: 'Not accepted',
    },
    fr: {
      terms: 'Conditions Générales',
      privacy: 'Politique de Confidentialité',
      marketing: 'Communications Marketing',
      accepted: 'Accepté',
      notAccepted: 'Non accepté',
    },
  };

  const l = labels[lang] ?? labels['es'] ?? labels['es'];

  return `📋 Consentimientos:
• ${l['terms']}: ${consent.terms ? '✅ ' + l['accepted'] : '❌ ' + l['notAccepted']}
• ${l['privacy']}: ${consent.privacy ? '✅ ' + l['accepted'] : '❌ ' + l['notAccepted']}
• ${l['marketing']}: ${consent.marketing ? '✅ ' + l['accepted'] : '❌ ' + l['notAccepted']}

📅 Fecha: ${new Date(consent.timestamp).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES')}`;
}

// ============================================================================
// SINGLETON
// ============================================================================

let consentManagerInstance: ConsentManager | null = null;

export function getConsentManager(redis: Redis | null = null): ConsentManager {
  if (!consentManagerInstance || redis) {
    consentManagerInstance = new ConsentManager(redis);
  }
  return consentManagerInstance;
}
