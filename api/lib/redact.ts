/**
 * PII Redaction utilities for GDPR-compliant logging
 *
 * Use these functions when logging user data to avoid storing
 * personally identifiable information in logs.
 */

/**
 * Redact email address for logging
 * "john.doe@example.com" → "joh***@example.com"
 */
export function redactEmail(email: string | null | undefined): string {
  if (!email) return 'N/A';
  const [local, domain] = email.split('@');
  if (!domain) return '***@invalid';
  const redactedLocal = local.length > 3 ? `${local.slice(0, 3)}***` : '***';
  return `${redactedLocal}@${domain}`;
}

/**
 * Redact phone number for logging
 * "+34612345678" → "+346***78"
 */
export function redactPhone(phone: string | null | undefined): string {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.length < 6) return '***';
  return `${cleaned.slice(0, 4)}***${cleaned.slice(-2)}`;
}

/**
 * Redact name for logging (just first 2 chars + initial of last name if present)
 * "John Doe" → "Jo*** D***"
 */
export function redactName(name: string | null | undefined): string {
  if (!name) return 'N/A';
  const parts = name.trim().split(' ');
  return parts.map(part => (part.length > 2 ? `${part.slice(0, 2)}***` : '***')).join(' ');
}

/**
 * Create a safe log object from booking data
 * Redacts all PII fields automatically
 */
export function safeBookingLog(booking: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  className?: string;
  classDate?: string;
  [key: string]: unknown;
}): Record<string, unknown> {
  return {
    email: redactEmail(booking.email),
    phone: redactPhone(booking.phone),
    firstName: redactName(booking.firstName),
    lastName: redactName(booking.lastName),
    className: booking.className,
    classDate: booking.classDate,
  };
}
