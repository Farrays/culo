/**
 * Email Validation Module
 *
 * Provides comprehensive email validation including:
 * - Format validation (RFC-compliant regex)
 * - MX record check (verifies domain can receive email)
 * - Disposable email detection (blocks temporary email services)
 *
 * @example
 * const result = await validateEmail('user@example.com');
 * if (!result.valid) {
 *   console.log(result.reason); // 'disposable_email' | 'invalid_domain' | etc.
 * }
 */

import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

// ============================================================================
// DISPOSABLE EMAIL DOMAINS
// ============================================================================

/**
 * List of known disposable/temporary email domains
 * These services provide throwaway email addresses
 */
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  // Popular disposable services
  '10minutemail.com',
  '10minutemail.net',
  'tempmail.com',
  'tempmail.net',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.org',
  'guerrillamail.net',
  'guerrillamail.biz',
  'sharklasers.com',
  'grr.la',
  'guerrillamail.de',
  'mailinator.com',
  'mailinator.net',
  'mailinator.org',
  'mailinator2.com',
  'mailinater.com',
  'throwaway.email',
  'throwawaymail.com',
  'getnada.com',
  'nada.email',
  'tempinbox.com',
  'fakeinbox.com',
  'trashmail.com',
  'trashmail.net',
  'trashmail.org',
  'dispostable.com',
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'cool.fr.nf',
  'jetable.fr.nf',
  'nospam.ze.tc',
  'nomail.xl.cx',
  'mega.zik.dj',
  'speed.1s.fr',
  'courriel.fr.nf',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'hide.biz.st',
  'mytrashmail.com',
  'emailondeck.com',
  'tempr.email',
  'discard.email',
  'discardmail.com',
  'spamgourmet.com',
  'spamgourmet.net',
  'spamgourmet.org',
  'mailnesia.com',
  'maildrop.cc',
  'mailsac.com',
  'mohmal.com',
  'fakemailgenerator.com',
  'emailfake.com',
  'crazymailing.com',
  'tempmailo.com',
  'burnermail.io',
  'mailcatch.com',
  'mintemail.com',
  'spambox.us',
  'mt2009.com',
  'filzmail.com',
  'mailexpire.com',
  'dontmail.me',
  'dontemail.me',
  'emailsensei.com',
  'fakemail.fr',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'wegwerfmail.org',
  'sofort-mail.de',
  'sofortmail.de',
  'spambog.com',
  'spambog.de',
  'spambog.ru',
  'anonymbox.com',
  'tempsky.com',
  'inboxalias.com',
  'tempmailaddress.com',
  'eelmail.com',
  'dropmail.me',
  'harakirimail.com',
  'mailforspam.com',
  'spamavert.com',
  'spamfree24.org',
  'spamfree24.de',
  'spamfree24.eu',
  'spamfree24.info',
  'spamfree24.net',
  'mailnull.com',
  'emailmiser.com',
  'emailtemporario.com.br',
  'emailtemporar.ro',
  'fakemailgenerator.net',
  'mytemp.email',
  'privaterelay.appleid.com', // Apple Hide My Email (legitimate but hides real email)
]);

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface EmailValidationResult {
  valid: boolean;
  email: string;
  reason?:
    | 'invalid_format'
    | 'invalid_domain'
    | 'no_mx_records'
    | 'disposable_email'
    | 'dns_error'
    | 'suspicious_pattern';
  details?: string;
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Basic email format validation using RFC-compliant regex
 */
function isValidFormat(email: string): boolean {
  // More comprehensive email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Check if domain is a known disposable email service
 */
function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

/**
 * Check for suspicious email patterns
 */
function hasSuspiciousPattern(email: string): { suspicious: boolean; reason?: string } {
  const localPart = email.split('@')[0]?.toLowerCase() || '';
  const domain = email.split('@')[1]?.toLowerCase() || '';

  // Check for keyboard patterns
  if (/^(asdf|qwerty|zxcv|1234|test|fake|spam)/i.test(localPart)) {
    return { suspicious: true, reason: 'Keyboard pattern or test email detected' };
  }

  // Check for repetitive characters
  if (/(.)\1{4,}/.test(localPart)) {
    return { suspicious: true, reason: 'Repetitive characters detected' };
  }

  // Check for random-looking strings (too many consonants in a row)
  if (/[bcdfghjklmnpqrstvwxyz]{6,}/i.test(localPart)) {
    return { suspicious: true, reason: 'Random string pattern detected' };
  }

  // Check for suspicious TLDs
  const suspiciousTlds = ['.xyz', '.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.work', '.click'];
  if (suspiciousTlds.some(tld => domain.endsWith(tld))) {
    return { suspicious: true, reason: `Suspicious TLD: ${domain.split('.').pop()}` };
  }

  return { suspicious: false };
}

/**
 * Check if domain has valid MX records (can receive email)
 */
async function hasMxRecords(domain: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const records = await resolveMx(domain);
    return { valid: records && records.length > 0 };
  } catch (error) {
    const err = error as { code?: string };
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') {
      return { valid: false, error: 'Domain does not exist or has no MX records' };
    }
    // DNS timeout or other error - don't block the user
    return { valid: true, error: `DNS check failed: ${err.code}` };
  }
}

// ============================================================================
// MAIN VALIDATION FUNCTION
// ============================================================================

/**
 * Comprehensive email validation
 *
 * @param email - Email address to validate
 * @param options - Validation options
 * @returns Validation result with reason if invalid
 *
 * @example
 * const result = await validateEmail('user@tempmail.com');
 * // { valid: false, email: 'user@tempmail.com', reason: 'disposable_email' }
 */
export async function validateEmail(
  email: string,
  options: {
    checkMx?: boolean; // Check MX records (default: true)
    blockDisposable?: boolean; // Block disposable emails (default: true)
    checkSuspicious?: boolean; // Check suspicious patterns (default: false, just warn)
  } = {}
): Promise<EmailValidationResult> {
  const { checkMx = true, blockDisposable = true, checkSuspicious = false } = options;

  const normalizedEmail = email.trim().toLowerCase();

  // 1. Format validation
  if (!isValidFormat(normalizedEmail)) {
    return {
      valid: false,
      email: normalizedEmail,
      reason: 'invalid_format',
      details: 'Email format is invalid',
    };
  }

  // 2. Disposable email check
  if (blockDisposable && isDisposableEmail(normalizedEmail)) {
    return {
      valid: false,
      email: normalizedEmail,
      reason: 'disposable_email',
      details: 'Disposable/temporary email addresses are not allowed',
    };
  }

  // 3. Suspicious pattern check (optional blocking)
  const suspiciousCheck = hasSuspiciousPattern(normalizedEmail);
  if (checkSuspicious && suspiciousCheck.suspicious) {
    return {
      valid: false,
      email: normalizedEmail,
      reason: 'suspicious_pattern',
      details: suspiciousCheck.reason,
    };
  }

  // 4. MX record check
  if (checkMx) {
    const domain = normalizedEmail.split('@')[1];
    if (domain) {
      const mxResult = await hasMxRecords(domain);
      if (!mxResult.valid) {
        return {
          valid: false,
          email: normalizedEmail,
          reason: 'no_mx_records',
          details: mxResult.error || 'Domain cannot receive email',
        };
      }
    }
  }

  return {
    valid: true,
    email: normalizedEmail,
  };
}

/**
 * Quick synchronous validation (format + disposable check only)
 * Use when you need fast validation without DNS lookup
 */
export function validateEmailSync(
  email: string,
  options: { blockDisposable?: boolean } = {}
): EmailValidationResult {
  const { blockDisposable = true } = options;
  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidFormat(normalizedEmail)) {
    return {
      valid: false,
      email: normalizedEmail,
      reason: 'invalid_format',
      details: 'Email format is invalid',
    };
  }

  if (blockDisposable && isDisposableEmail(normalizedEmail)) {
    return {
      valid: false,
      email: normalizedEmail,
      reason: 'disposable_email',
      details: 'Disposable/temporary email addresses are not allowed',
    };
  }

  return {
    valid: true,
    email: normalizedEmail,
  };
}
