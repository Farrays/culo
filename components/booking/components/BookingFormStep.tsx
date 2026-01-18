/**
 * BookingFormStep Component
 * Step 2: Booking form with user data and consents
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../hooks/useI18n';
import type { ClassData, BookingFormData, Status } from '../types/booking';
import { requiresHeelsConsent } from '../types/booking';

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
  onBack: () => void;
  onFormChange: (data: Partial<BookingFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const BookingFormStep: React.FC<BookingFormStepProps> = ({
  selectedClass,
  formData,
  status,
  errorMessage,
  onBack,
  onFormChange,
  onSubmit,
}) => {
  const { t, locale } = useI18n();
  const isLoading = status === 'loading';
  const needsHeelsConsent = requiresHeelsConsent(selectedClass);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onFormChange({ [name]: type === 'checkbox' ? checked : value });
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
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="
                w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl
                text-neutral placeholder-neutral/40
                focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20
                transition-all disabled:opacity-50
              "
              placeholder={t('booking_placeholder_firstName')}
              autoComplete="given-name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral/80 mb-1.5">
              {t('booking_field_lastName')} <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={isLoading}
              required
              className="
                w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl
                text-neutral placeholder-neutral/40
                focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20
                transition-all disabled:opacity-50
              "
              placeholder={t('booking_placeholder_lastName')}
              autoComplete="family-name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral/80 mb-1.5">
            {t('booking_field_email')} <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            className="
              w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl
              text-neutral placeholder-neutral/40
              focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20
              transition-all disabled:opacity-50
            "
            placeholder={t('booking_placeholder_email')}
            autoComplete="email"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral/80 mb-1.5">
            {t('booking_field_phone')} <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isLoading}
            required
            className="
              w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl
              text-neutral placeholder-neutral/40
              focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20
              transition-all disabled:opacity-50
            "
            placeholder={t('booking_placeholder_phone')}
            autoComplete="tel"
          />
        </div>

        {/* RGPD Consents */}
        <div className="pt-4 border-t border-white/10 space-y-1">
          {/* Terms */}
          <Checkbox
            name="acceptsTerms"
            label={
              <>
                {t('booking_consent_terms')}{' '}
                <Link
                  to={`/${locale}/condiciones-generales`}
                  className="text-primary-accent hover:underline"
                  target="_blank"
                >
                  {t('booking_consent_terms_link')}
                </Link>
              </>
            }
          />

          {/* Marketing */}
          <Checkbox name="acceptsMarketing" label={t('booking_consent_marketing')} />

          {/* Age */}
          <Checkbox name="acceptsAge" label={t('booking_consent_age')} />

          {/* No Refund */}
          <Checkbox name="acceptsNoRefund" label={t('booking_consent_norefund')} />

          {/* Privacy */}
          <Checkbox
            name="acceptsPrivacy"
            label={
              <>
                {t('booking_consent_privacy')}{' '}
                <Link
                  to={`/${locale}/politica-privacidad`}
                  className="text-primary-accent hover:underline"
                  target="_blank"
                >
                  {t('booking_consent_privacy_link')}
                </Link>
              </>
            }
          />

          {/* Heels consent (conditional) */}
          {needsHeelsConsent && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mt-3">
              <Checkbox name="acceptsHeels" label={t('booking_consent_heels')} />
            </div>
          )}

          {/* Image consent (optional) */}
          <Checkbox name="acceptsImage" label={t('booking_consent_image')} required={false} />
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-sm text-red-400">{errorMessage}</p>
          </div>
        )}

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
            <Link
              to={`/${locale}/politica-privacidad`}
              className="text-primary-accent/70 hover:text-primary-accent"
            >
              {t('booking_legal_info')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default BookingFormStep;
