/**
 * Booking Validation Module
 * Exports all validation and sanitization utilities
 */

export {
  bookingFormSchema,
  bookingFormSchemaWithHeels,
  validateBookingForm,
  validateField,
  isValidEmail,
  isValidPhone,
  isValidName,
  type ValidatedBookingForm,
} from './bookingSchema';

export {
  escapeHtml,
  stripHtml,
  sanitizeInput,
  sanitizeName,
  sanitizeEmail,
  sanitizePhone,
  sanitizeFormData,
} from './sanitize';
