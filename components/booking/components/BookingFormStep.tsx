/**
 * BookingFormStep Component
 * Step 2: Booking form with user data and consents
 * Features: Invalid field highlighting, haptic feedback, legal modals
 */

import React, { useRef, useEffect, useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { ClassData, BookingFormData, Status } from '../types/booking';
import { requiresHeelsConsent } from '../types/booking';
import type { InvalidField } from '../hooks/useBookingState';
import { sanitizeName, sanitizeEmail, sanitizePhone } from '../validation/sanitize';
import TermsModal from '../TermsModal';
import PrivacyModal from '../PrivacyModal';

// Icons
const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface BookingFormStepProps {
  selectedClass: ClassData;
  formData: BookingFormData;
  status: Status;
  errorMessage: string;
  invalidFields?: InvalidField[];
  onBack: () => void;
  onFormChange: (data: Partial<BookingFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTriggerHaptic?: (type?: 'light' | 'medium' | 'heavy' | 'error' | 'success') => void;
}

export const BookingFormStep: React.FC<BookingFormStepProps> = ({
  selectedClass,
  formData,
  status,
  errorMessage,
  invalidFields = [],
  onBack,
  onFormChange,
  onSubmit,
  onTriggerHaptic,
}) => {
  const { t } = useI18n();
  const isLoading = status === 'loading';
  const needsHeelsConsent = requiresHeelsConsent(selectedClass);

  // Modal states
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Refs for invalid fields to scroll and focus
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const fieldRefs: Record<InvalidField, React.RefObject<HTMLInputElement | null>> = {
    firstName: firstNameRef,
    lastName: lastNameRef,
    email: emailRef,
    phone: phoneRef,
  };

  // Check if a field is invalid
  const isFieldInvalid = (field: InvalidField): boolean => invalidFields.includes(field);

  // Get input classes based on validity
  const getInputClasses = (field: InvalidField): string => {
    const baseClasses = `
      w-full px-4 py-3 bg-white/5 rounded-xl
      text-neutral placeholder-neutral/40
      focus:outline-none focus:ring-2
      transition-all disabled:opacity-50
    `;

    if (isFieldInvalid(field)) {
      return `${baseClasses} border-2 border-red-500 focus:border-red-500 focus:ring-red-500/20 animate-shake`;
    }

    return `${baseClasses} border border-white/20 focus:border-primary-accent focus:ring-primary-accent/20`;
  };

  // Scroll to and focus first invalid field
  useEffect(() => {
    if (invalidFields.length > 0) {
      const firstInvalidField = invalidFields[0] as InvalidField;
      const ref = fieldRefs[firstInvalidField];
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ref.current.focus();
      }
      // Trigger haptic feedback for error
      onTriggerHaptic?.('error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fieldRefs and onTriggerHaptic are stable
  }, [invalidFields]);

  // Handle input change with real-time sanitization
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      onFormChange({ [name]: checked });
      onTriggerHaptic?.('light');
      return;
    }

    // Apply field-specific sanitization on input
    let sanitizedValue = value;
    switch (name) {
      case 'firstName':
      case 'lastName':
        sanitizedValue = sanitizeName(value);
        break;
      case 'email':
        sanitizedValue = sanitizeEmail(value);
        break;
      case 'phone':
        sanitizedValue = sanitizePhone(value);
        break;
    }

    onFormChange({ [name]: sanitizedValue });
  };

  // Checkbox component
  const Checkbox: React.FC<{
    name: keyof BookingFormData;
    label: React.ReactNode;
    required?: boolean;
  }> = ({ name, label, required = true }) => (
    <label className="flex items-start gap-3 cursor-pointer group py-2">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          name={name}
          checked={formData[name] as boolean}
          onChange={handleInputChange}
          disabled={isLoading}
          className="peer sr-only"
        />
        <div
          className="
            w-5 h-5 border-2 rounded-md transition-all duration-200
            border-white/30 bg-white/5
            peer-checked:border-primary-accent peer-checked:bg-primary-accent
            peer-disabled:opacity-50
            group-hover:border-white/50
          "
        />
        <CheckIcon
          className="
            absolute inset-0 w-5 h-5 text-white opacity-0
            peer-checked:opacity-100 p-0.5 pointer-events-none
          "
        />
      </div>
      <span className="text-sm text-neutral/80 leading-tight">
        {label}
        {!required && <span className="ml-1 text-neutral/50">{t('booking_consent_optional')}</span>}
      </span>
    </label>
  );

  return (
    <div className="animate-fade-in">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-neutral/60 hover:text-neutral mb-4 transition-colors"
      >
        <ChevronLeftIcon className="w-5 h-5" />
        {t('booking_back_to_classes')}
      </button>

      {/* Selected class summary */}
      <div className="bg-primary-accent/10 border border-primary-accent/30 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-accent/20 flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-primary-accent" />
          </div>
          <div>
            <h3 className="font-bold text-neutral">{selectedClass.name}</h3>
            <p className="text-sm text-neutral/70">
              {selectedClass.dayOfWeek} {selectedClass.date} • {selectedClass.time}
            </p>
          </div>
        </div>
      </div>

      {/* Form title */}
      <h2 className="text-xl font-bold text-neutral mb-4">{t('booking_form_title')}</h2>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral/80 mb-1.5">
              {t('booking_field_firstName')} <span className="text-red-400">*</span>
            </label>
            <input
              ref={firstNameRef}
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              aria-invalid={isFieldInvalid('firstName')}
              aria-describedby={isFieldInvalid('firstName') ? 'firstName-error' : undefined}
              className={getInputClasses('firstName')}
              placeholder={t('booking_placeholder_firstName')}
              autoComplete="given-name"
            />
            {isFieldInvalid('firstName') && (
              <p id="firstName-error" className="mt-1 text-xs text-red-400">
                {t('booking_error_field_required')}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral/80 mb-1.5">
              {t('booking_field_lastName')} <span className="text-red-400">*</span>
            </label>
            <input
              ref={lastNameRef}
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              aria-invalid={isFieldInvalid('lastName')}
              aria-describedby={isFieldInvalid('lastName') ? 'lastName-error' : undefined}
              className={getInputClasses('lastName')}
              placeholder={t('booking_placeholder_lastName')}
              autoComplete="family-name"
            />
            {isFieldInvalid('lastName') && (
              <p id="lastName-error" className="mt-1 text-xs text-red-400">
                {t('booking_error_field_required')}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral/80 mb-1.5">
            {t('booking_field_email')} <span className="text-red-400">*</span>
          </label>
          <input
            ref={emailRef}
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            aria-invalid={isFieldInvalid('email')}
            aria-describedby={isFieldInvalid('email') ? 'email-error' : undefined}
            className={getInputClasses('email')}
            placeholder={t('booking_placeholder_email')}
            autoComplete="email"
          />
          {isFieldInvalid('email') && (
            <p id="email-error" className="mt-1 text-xs text-red-400">
              {t('booking_error_field_required')}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral/80 mb-1.5">
            {t('booking_field_phone')} <span className="text-red-400">*</span>
          </label>
          <input
            ref={phoneRef}
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            aria-invalid={isFieldInvalid('phone')}
            aria-describedby={isFieldInvalid('phone') ? 'phone-error' : undefined}
            className={getInputClasses('phone')}
            placeholder={t('booking_placeholder_phone')}
            autoComplete="tel"
          />
          {isFieldInvalid('phone') && (
            <p id="phone-error" className="mt-1 text-xs text-red-400">
              {t('booking_error_field_required')}
            </p>
          )}
        </div>

        {/* RGPD Consents - Simplified (3 checkboxes) */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          {/* Terms with explanation */}
          <div>
            <Checkbox
              name="acceptsTerms"
              label={
                <>
                  {t('booking_consent_terms')}{' '}
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowTermsModal(true);
                    }}
                    className="text-primary-accent hover:underline"
                  >
                    {t('booking_consent_terms_link')}
                  </button>
                </>
              }
            />
            <p className="ml-8 text-xs text-neutral/50 leading-relaxed">
              {t('booking_consent_terms_note')}
            </p>
          </div>

          {/* Heels consent (conditional) - before age */}
          {needsHeelsConsent && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
              <Checkbox name="acceptsHeels" label={t('booking_consent_heels')} />
            </div>
          )}

          {/* Age confirmation */}
          <Checkbox name="acceptsAge" label={t('booking_consent_age')} />

          {/* Privacy */}
          <Checkbox
            name="acceptsPrivacy"
            label={
              <>
                {t('booking_consent_privacy')}{' '}
                <button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowPrivacyModal(true);
                  }}
                  className="text-primary-accent hover:underline"
                >
                  {t('booking_consent_privacy_link')}
                </button>
              </>
            }
          />
        </div>

        {/* Error message - aria-live for screen reader announcements */}
        <div
          role="alert"
          aria-live="polite"
          aria-atomic="true"
          className={errorMessage ? '' : 'sr-only'}
        >
          {errorMessage && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full py-4 bg-primary-accent text-white font-bold rounded-xl
            transition-all duration-300
            hover:shadow-accent-glow hover:scale-[1.02]
            disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none
            flex items-center justify-center gap-2 mt-4
          "
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t('booking_submit_loading')}</span>
            </>
          ) : (
            <span>{t('booking_submit')}</span>
          )}
        </button>

        {/* Legal text */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-[10px] leading-relaxed text-neutral/40">
            {t('booking_legal_responsible')} {t('booking_legal_purpose')}{' '}
            {t('booking_legal_legitimation')} {t('booking_legal_recipients')}{' '}
            {t('booking_legal_rights')}{' '}
            <button
              type="button"
              onClick={e => {
                e.preventDefault();
                setShowPrivacyModal(true);
              }}
              className="text-primary-accent/70 hover:text-primary-accent"
            >
              {t('booking_legal_info')}
            </button>
          </p>
        </div>
      </form>

      {/* Legal Modals */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
};

export default BookingFormStep;
