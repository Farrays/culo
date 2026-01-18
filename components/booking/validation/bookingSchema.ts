/**
 * Booking Form Validation Schema
 * Enterprise-level validation using Zod
 */

import { z } from 'zod';

// Email validation regex - RFC 5322 compliant
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone validation - International format (E.164 compatible)
// Accepts: +34612345678, 612345678, +1-555-123-4567, etc.
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

// Name validation - allows letters, spaces, accents, hyphens
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'-]{2,50}$/;

// Max lengths for security
const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MAX_PHONE_LENGTH = 20;

/**
 * Booking form validation schema
 */
export const bookingFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'booking_error_name_min')
    .max(MAX_NAME_LENGTH, 'booking_error_name_max')
    .regex(NAME_REGEX, 'booking_error_name_invalid'),

  lastName: z
    .string()
    .min(2, 'booking_error_name_min')
    .max(MAX_NAME_LENGTH, 'booking_error_name_max')
    .regex(NAME_REGEX, 'booking_error_name_invalid'),

  email: z
    .string()
    .min(1, 'booking_error_email_required')
    .max(MAX_EMAIL_LENGTH, 'booking_error_email_max')
    .regex(EMAIL_REGEX, 'booking_error_email_invalid')
    .toLowerCase(),

  phone: z
    .string()
    .min(6, 'booking_error_phone_min')
    .max(MAX_PHONE_LENGTH, 'booking_error_phone_max')
    .regex(PHONE_REGEX, 'booking_error_phone_invalid'),

  // RGPD Mandatory Consents (Simplified: 3 checkboxes)
  // Terms now includes: confirmations, marketing, no-refund, image consent
  acceptsTerms: z.boolean().refine(val => val === true, 'booking_error_consent_required'),
  acceptsAge: z.boolean().refine(val => val === true, 'booking_error_consent_required'),
  acceptsPrivacy: z.boolean().refine(val => val === true, 'booking_error_consent_required'),

  // Legacy fields - kept for backwards compatibility but not validated
  acceptsMarketing: z.boolean().optional().default(true),
  acceptsNoRefund: z.boolean().optional().default(true),
  acceptsImage: z.boolean().optional().default(true),

  // Conditional (validated separately when heels class)
  acceptsHeels: z.boolean(),
});

/**
 * Schema for heels classes (requires heels consent)
 */
export const bookingFormSchemaWithHeels = bookingFormSchema.extend({
  acceptsHeels: z.boolean().refine(val => val === true, 'booking_error_heels_consent_required'),
});

// Type inference from schema
export type ValidatedBookingForm = z.infer<typeof bookingFormSchema>;

/**
 * Validate booking form data
 * Returns validation result with translated error messages
 */
export function validateBookingForm(
  data: unknown,
  requiresHeels: boolean = false
): { success: true; data: ValidatedBookingForm } | { success: false; errors: string[] } {
  const schema = requiresHeels ? bookingFormSchemaWithHeels : bookingFormSchema;

  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Extract unique error messages (translation keys)
  // Zod v4 uses 'issues' instead of 'errors'
  const issues = result.error.issues || [];
  const errors = Array.from(new Set(issues.map((e: { message: string }) => e.message)));

  return { success: false, errors };
}

/**
 * Validate individual field
 * Useful for real-time validation
 */
export function validateField(
  field: keyof ValidatedBookingForm,
  value: unknown
): { valid: true } | { valid: false; error: string } {
  const fieldSchema = bookingFormSchema.shape[field];

  if (!fieldSchema) {
    return { valid: false, error: 'booking_error_unknown_field' };
  }

  const result = fieldSchema.safeParse(value);

  if (result.success) {
    return { valid: true };
  }

  // Zod v4 uses 'issues' instead of 'errors'
  const issues = result.error.issues || [];
  return { valid: false, error: issues[0]?.message || 'booking_error_invalid' };
}

/**
 * Quick email validation (standalone)
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

/**
 * Quick phone validation (standalone)
 */
export function isValidPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone) && phone.length <= MAX_PHONE_LENGTH;
}

/**
 * Quick name validation (standalone)
 */
export function isValidName(name: string): boolean {
  return NAME_REGEX.test(name) && name.length >= 2 && name.length <= MAX_NAME_LENGTH;
}
