/**
 * BookingError Component
 * Error state for booking failures
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

// X icon
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface BookingErrorProps {
  errorMessage?: string;
  onRetry: () => void;
}

export const BookingError: React.FC<BookingErrorProps> = ({ errorMessage, onRetry }) => {
  const { t } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);

  return (
    <div className="animate-fade-in text-center py-8">
      {/* Error icon with glow effect */}
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-red-500/30 rounded-full blur-xl" />
        <div className="relative w-20 h-20 aspect-square rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
          <XMarkIcon className="w-10 h-10 text-white" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-neutral mb-4">{t('booking_error_title')}</h2>

      {/* Error message */}
      <p className="text-neutral/80 mb-6">{errorMessage || t('booking_error_message')}</p>

      {/* Retry button */}
      <button
        type="button"
        onClick={onRetry}
        className="
          px-6 py-3 bg-primary-accent text-white font-semibold
          rounded-xl hover:bg-primary-accent/90 transition-colors
        "
      >
        {t('booking_error_cta')}
      </button>
    </div>
  );
};

export default BookingError;
