/**
 * BookingWidget V2
 * Enterprise-level booking widget with deep linking and URL-synced filters
 *
 * Features:
 * - 2-step flow: Class Selection → Form
 * - URL parameters for deep linking campaigns
 * - Full filter support (style, level, day, timeBlock, instructor)
 * - Analytics tracking for all interactions
 * - Error Boundary for crash protection
 * - Retry with exponential backoff for API resilience
 */

import React, { useEffect, memo, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';

// Hooks
import { useBookingFilters } from './hooks/useBookingFilters';
import { useBookingState } from './hooks/useBookingState';
import { useBookingClasses } from './hooks/useBookingClasses';
import { useBookingAnalytics } from './hooks/useBookingAnalytics';
import { useCsrfToken } from './hooks/useCsrfToken';
import { useBookingPersistence } from './hooks/useBookingPersistence';
import type { InvalidField } from './hooks/useBookingState';

// Components
import { ClassListStep } from './components/ClassListStep';
import { BookingFormStep } from './components/BookingFormStep';
import { BookingSuccess } from './components/BookingSuccess';
import { BookingError } from './components/BookingError';
import { BookingErrorBoundary } from './components/BookingErrorBoundary';

// Types
import type { ClassData, BookingFormData } from './types/booking';
import { requiresHeelsConsent } from './types/booking';

// Validation
import { validateBookingForm, sanitizeFormData } from './validation';

// Utilities
import { trackLeadConversion, LEAD_VALUES } from '../../utils/analytics';

// Helper: Get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? (match[2] ?? null) : null;
}

// Global flag to track if a booking modal is open
// This prevents the BookingWidgetV2 popstate handler from interfering with modal history
declare global {
  interface Window {
    __bookingModalOpen?: boolean;
  }
}

// Helper: Generate unique event ID for Meta tracking
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Check icon component
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

// Step indicator component - V1 style with 3D effect and animations
const StepIndicator: React.FC<{
  currentStep: 'class' | 'form';
}> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {['class', 'form'].map((s, i) => {
        const isActive = currentStep === s;
        const isCompleted = s === 'class' && currentStep === 'form';

        return (
          <React.Fragment key={s}>
            <div
              className={`
                relative w-10 h-10 rounded-full flex items-center justify-center
                transition-all duration-500 transform
                ${
                  isActive
                    ? 'bg-primary-accent scale-110 shadow-lg shadow-primary-accent/50'
                    : isCompleted
                      ? 'bg-primary-accent/80'
                      : 'bg-white/10'
                }
              `}
              style={{
                transform: isActive ? 'perspective(500px) rotateY(10deg)' : 'none',
              }}
            >
              {isCompleted ? (
                <CheckIcon className="w-5 h-5 text-white" />
              ) : (
                <span className="text-sm font-bold text-white">{i + 1}</span>
              )}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-primary-accent/50 animate-ping" />
              )}
            </div>
            {i < 1 && (
              <div
                className={`w-12 h-1 rounded-full transition-all duration-500 ${
                  isCompleted ? 'bg-primary-accent' : 'bg-white/10'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Language selector component - V1 style
const LanguageSelector: React.FC<{
  locale: string;
  onLanguageChange: (lang: 'es' | 'ca' | 'en' | 'fr') => void;
}> = ({ locale, onLanguageChange }) => (
  <div className="flex justify-end mb-4">
    <div className="flex items-center gap-0.5 bg-white/5 rounded-lg p-1">
      {(['es', 'ca', 'en', 'fr'] as const).map(lang => (
        <button
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
            locale === lang
              ? 'bg-primary-accent text-white'
              : 'text-neutral/40 hover:text-neutral hover:bg-white/10'
          }`}
          title={
            lang === 'es'
              ? 'Español'
              : lang === 'ca'
                ? 'Català'
                : lang === 'en'
                  ? 'English'
                  : 'Français'
          }
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  </div>
);

const BookingWidgetV2: React.FC = memo(() => {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  // Track if we pushed a history state for the form step
  const historyPushedRef = useRef(false);

  // Language change handler
  const handleLanguageChange = (newLocale: 'es' | 'ca' | 'en' | 'fr') => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      const newPath = location.pathname.replace(/^\/(es|ca|en|fr)/, `/${newLocale}`);
      navigate(newPath + location.search, { replace: true });
    }
  };

  // Hooks
  const {
    filters,
    setFilter,
    clearFilter,
    clearAllFilters,
    directClassId,
    weekOffset,
    setWeekOffset,
  } = useBookingFilters();

  // CSRF protection (optional - gracefully handles missing backend endpoint)
  const { getCsrfHeaders } = useCsrfToken();

  const {
    step,
    status,
    selectedClass,
    formData,
    errorMessage,
    invalidFields,
    selectClass,
    goBack,
    setStatus,
    updateForm,
    setError,
    clearError,
    setInvalidFields,
    restoreForm,
    reset,
  } = useBookingState(weekOffset);

  // Persistence: localStorage, beforeunload warning, haptic feedback
  const { loadPersistedData, clearPersistedData, triggerHaptic } = useBookingPersistence(
    formData,
    selectedClass,
    status,
    t
  );

  // Restore persisted data on mount
  useEffect(() => {
    const persisted = loadPersistedData();
    if (persisted && (persisted.formData.firstName || persisted.formData.email)) {
      restoreForm(persisted.formData, persisted.selectedClass);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Intentionally run once on mount
  }, []);

  const {
    classes,
    loading,
    error: classesError,
    filterOptions,
    refetch,
    loadMore,
    hasMore,
    currentPage,
  } = useBookingClasses({ filters, weekOffset, enablePagination: true });

  const { trackClassSelected, trackBookingSuccess } = useBookingAnalytics();

  // Browser history management - push state when entering form step
  useEffect(() => {
    if (step === 'form' && !historyPushedRef.current) {
      window.history.pushState({ bookingStep: 'form', bookingWidget: true }, '');
      historyPushedRef.current = true;
    }
    if (step === 'class') {
      historyPushedRef.current = false;
    }
  }, [step]);

  // Handle browser back button (popstate event)
  const handlePopState = useCallback(
    (event: globalThis.PopStateEvent) => {
      // If a modal is open, let the modal handle the popstate
      if (window.__bookingModalOpen) {
        return;
      }

      // If booking is complete (success), prevent going back
      if (status === 'success') {
        // Push the success state back to prevent navigation
        window.history.pushState({ bookingStep: 'success', bookingWidget: true }, '');
        return;
      }

      // Check the state we're returning TO
      const state = event.state as {
        bookingStep?: string;
        modal?: string;
        bookingWidget?: boolean;
      } | null;

      // If returning to a modal state, ignore (modal will handle it)
      if (state && state.modal) {
        return;
      }

      // If we're on the form step and user presses back
      if (step === 'form') {
        // Check if returning TO form state (from a modal) - don't go back further
        if (state && state.bookingStep === 'form') {
          // Returning from a modal, stay on form
          return;
        }
        // Actually leaving form to step 1
        goBack();
        clearError();
        historyPushedRef.current = false;
      }
      // For step === 'class', we don't interfere with normal navigation
    },
    [step, status, goBack, clearError]
  );

  // Set up popstate listener
  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handlePopState]);

  // Handle direct classId navigation from URL
  useEffect(() => {
    if (directClassId && classes.length > 0) {
      const classById = classes.find(c => c.id === parseInt(directClassId, 10));
      if (classById) {
        selectClass(classById);
      }
    }
  }, [directClassId, classes, selectClass]);

  // Handle class selection
  const handleSelectClass = (classData: ClassData) => {
    selectClass(classData);
    trackClassSelected(classData);
  };

  // Handle going back to class list
  const handleBack = () => {
    // If we pushed history state, use history.back() for proper UX
    if (historyPushedRef.current) {
      window.history.back();
    } else {
      goBack();
      clearError();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass) return;

    // Detect empty required fields for highlighting
    const emptyFields: InvalidField[] = [];
    if (!formData.firstName.trim()) emptyFields.push('firstName');
    if (!formData.lastName.trim()) emptyFields.push('lastName');
    if (!formData.email.trim()) emptyFields.push('email');
    if (!formData.phone.trim()) emptyFields.push('phone');

    if (emptyFields.length > 0) {
      setInvalidFields(emptyFields);
      setError(t('booking_error_required_fields'));
      triggerHaptic('error');
      return;
    }

    // Sanitize form data before validation
    const sanitizedData = sanitizeFormData(formData);

    // Validate with Zod schema
    const needsHeelsConsent = requiresHeelsConsent(selectedClass);
    const validationResult = validateBookingForm(sanitizedData, needsHeelsConsent);

    if (!validationResult.success) {
      // Get the first error and translate it
      const firstError = validationResult.errors[0] ?? 'booking_error_generic';
      setError(t(firstError));
      triggerHaptic('error');
      return;
    }

    setStatus('loading');
    clearError();

    // Generate event ID for Meta tracking deduplication
    const eventId = generateEventId();

    try {
      // Build complete payload aligned with V1 and Momence requirements
      const payload = {
        // User data (sanitized and validated)
        firstName: validationResult.data.firstName,
        lastName: validationResult.data.lastName,
        email: validationResult.data.email,
        phone: validationResult.data.phone,

        // Class data
        sessionId: selectedClass.id,
        classId: selectedClass.id,
        className: selectedClass.name,
        classDate: selectedClass.rawStartsAt,
        classTime: selectedClass.time,
        estilo: selectedClass.style,
        classStyle: selectedClass.style,
        classLevel: selectedClass.level,
        classInstructor: selectedClass.instructor,

        // Consents (RGPD)
        acceptsTerms: validationResult.data.acceptsTerms,
        acceptsPrivacy: validationResult.data.acceptsPrivacy,
        acceptsMarketing: validationResult.data.acceptsMarketing,
        acceptsAge: validationResult.data.acceptsAge,
        acceptsNoRefund: validationResult.data.acceptsNoRefund,
        acceptsImage: validationResult.data.acceptsImage,
        acceptsHeels: validationResult.data.acceptsHeels,

        // Source tracking (Momence)
        comoconoce: 'Web - Sistema Reservas V2',

        // Meta tracking (CAPI deduplication)
        eventId,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        fbc: getCookie('_fbc'),
        fbp: getCookie('_fbp'),
      };

      const response = await fetch('/api/reservar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfHeaders(),
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('booking_error_generic'));
      }

      // Success
      setStatus('success');
      clearPersistedData();
      triggerHaptic('success');

      // Replace history state to prevent back navigation to form
      window.history.replaceState({ bookingStep: 'success', bookingWidget: true }, '');

      // Track conversion with analytics
      trackBookingSuccess(selectedClass);
      trackLeadConversion({
        leadSource: 'booking_widget',
        formName: `Booking - ${selectedClass.style || 'General'}`,
        leadValue: LEAD_VALUES.BOOKING_LEAD,
        pagePath: typeof window !== 'undefined' ? window.location.pathname : '',
      });
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : t('booking_error_generic'));
    }
  };

  // Handle retry
  const handleRetry = () => {
    reset();
    refetch();
  };

  // Handle form data change
  const handleFormChange = (data: Partial<BookingFormData>) => {
    updateForm(data);
  };

  // Render content based on status and step
  const renderContent = () => {
    if (status === 'success' && selectedClass) {
      return <BookingSuccess selectedClass={selectedClass} />;
    }

    if (status === 'error') {
      return <BookingError errorMessage={errorMessage} onRetry={handleRetry} />;
    }

    if (step === 'form' && selectedClass) {
      return (
        <BookingFormStep
          selectedClass={selectedClass}
          formData={formData}
          status={status}
          errorMessage={errorMessage}
          invalidFields={invalidFields}
          onBack={handleBack}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onTriggerHaptic={triggerHaptic}
        />
      );
    }

    return (
      <ClassListStep
        classes={classes}
        filters={filters}
        filterOptions={filterOptions}
        weekOffset={weekOffset}
        loading={loading}
        error={classesError}
        onFilterChange={setFilter}
        onClearFilter={clearFilter}
        onClearAllFilters={clearAllFilters}
        onWeekChange={setWeekOffset}
        onSelectClass={handleSelectClass}
        onRetry={refetch}
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoadingMore={loading && currentPage > 1}
        selectedClassId={selectedClass?.id ?? null}
      />
    );
  };

  return (
    <div className="relative">
      {/* Skip link for accessibility - visible only on focus */}
      <a
        href="#booking-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-accent focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
      >
        {t('booking_skip_to_content')}
      </a>

      {/* 3D Background glow */}
      <div
        className="absolute -inset-4 bg-gradient-to-r from-primary-dark/20 via-primary-accent/10 to-primary-dark/20 rounded-3xl blur-2xl -z-10"
        style={{ transform: 'translateZ(-20px)' }}
        aria-hidden="true"
      />

      {/* Main container */}
      <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
        {/* Decorative gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent"
          aria-hidden="true"
        />

        {/* Language selector */}
        <LanguageSelector locale={locale} onLanguageChange={handleLanguageChange} />

        {/* Header with Logo */}
        <div className="text-center mb-6">
          {/* Logo - prominent and mobile first */}
          <div className="flex justify-center mb-4">
            <img
              src="/images/logo/img/logo-fidc_256.webp"
              alt="Farray's Dance Center"
              className="h-16 sm:h-20 w-auto object-contain"
              loading="eager"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-neutral mb-2">
            {t('booking_title')}
          </h1>
          <p className="text-neutral/60">{t('booking_subtitle')}</p>
        </div>

        {/* Step indicator - hide on success/error */}
        {status !== 'success' && status !== 'error' && <StepIndicator currentStep={step} />}

        {/* Content */}
        <div id="booking-content" tabIndex={-1}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
});

BookingWidgetV2.displayName = 'BookingWidgetV2';

/**
 * BookingWidgetV2 wrapped with Error Boundary
 * Prevents crashes from propagating to the rest of the app
 */
const BookingWidgetV2WithErrorBoundary: React.FC = () => (
  <BookingErrorBoundary>
    <BookingWidgetV2 />
  </BookingErrorBoundary>
);

BookingWidgetV2WithErrorBoundary.displayName = 'BookingWidgetV2WithErrorBoundary';

export default BookingWidgetV2WithErrorBoundary;

// Also export the unwrapped version for testing or custom error handling
export { BookingWidgetV2 };
