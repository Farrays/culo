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
import { useTranslation } from 'react-i18next';

// Hooks
import { useBookingFilters } from './hooks/useBookingFilters';
import { useBookingState } from './hooks/useBookingState';
import { useBookingClasses } from './hooks/useBookingClasses';
import { useBookingAnalytics } from './hooks/useBookingAnalytics';
import { useBookingFunnelAnalytics } from './hooks/useBookingFunnelAnalytics';
import { useCsrfToken } from './hooks/useCsrfToken';
import { useBookingPersistence } from './hooks/useBookingPersistence';
import type { InvalidField } from './hooks/useBookingState';

// Components
import { ClassListStep } from './components/ClassListStep';
import { BookingFormStep } from './components/BookingFormStep';
import { BookingSuccess } from './components/BookingSuccess';
import { BookingError } from './components/BookingError';
import { BookingErrorBoundary } from './components/BookingErrorBoundary';
import { SocialProofTicker } from './components/SocialProofTicker';
import { SkeletonClassListStep } from './components/SkeletonClassCard';
import { formatPhoneForAPI, validatePhoneNumber } from './components/CountryPhoneInput';

// Types
import type { ClassData, BookingFormData } from './types/booking';
import { requiresHeelsConsent } from './types/booking';

// Validation
import { validateBookingForm, sanitizeFormData } from './validation';

// Utilities
import { trackLeadConversion, LEAD_VALUES } from '../../utils/analytics';
import { isAnyModalOpen } from './utils/modalHistoryManager';

// Helper: Get cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? (match[2] ?? null) : null;
}

// Helper: Generate unique event ID for Meta tracking
function generateEventId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
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

// Form submission timeout in milliseconds (30 seconds)
const FORM_SUBMISSION_TIMEOUT_MS = 30000;

const BookingWidgetV2: React.FC = memo(() => {
  const { t, i18n } = useTranslation([
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
  const locale = i18n.language;
  const navigate = useNavigate();
  const location = useLocation();

  // Client-only rendering to prevent hydration mismatch
  // This is needed because the widget uses browser APIs (Date, window.matchMedia)
  // that produce different results on server vs client
  const [isClient, setIsClient] = React.useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track if we pushed a history state for the form step
  const historyPushedRef = useRef(false);

  // Track component mounted state for safe async updates
  const isMountedRef = useRef(true);

  // Track active form submission AbortController
  const formAbortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Abort any pending form submission
      if (formAbortControllerRef.current) {
        formAbortControllerRef.current.abort();
        formAbortControllerRef.current = null;
      }
    };
  }, []);

  // Language change handler
  const handleLanguageChange = (newLocale: 'es' | 'ca' | 'en' | 'fr') => {
    if (newLocale !== locale) {
      i18n.changeLanguage(newLocale);
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

  // Detect if any filter is active (for Acuity mode)
  const hasActiveFilters = Object.values(filters).some(Boolean);

  const {
    classes,
    loading,
    error: classesError,
    filterOptions,
    refetch,
    loadMore,
    hasMore,
    currentPage,
    allWeeksClasses,
    allWeeksLoading,
  } = useBookingClasses({
    filters,
    weekOffset,
    enablePagination: true,
    fetchAllWeeks: hasActiveFilters,
  });

  const { trackClassSelected, trackBookingSuccess } = useBookingAnalytics();

  // Funnel analytics for time tracking and abandonment
  const { startStep, endStep, trackClassLoadTime, trackFormSubmitTime, trackInteraction } =
    useBookingFunnelAnalytics();

  // Browser history management - push state when entering form step
  // Note: This effect uses window.history which is only available on client
  // The isClient check inside prevents SSR issues
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
      if (isAnyModalOpen()) {
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
    // Track funnel step transition
    endStep('class_selected');
    startStep('form_started');
  };

  // Track class load time when classes finish loading
  const classLoadStartRef = useRef<number>(Date.now());
  // Track if we've already attempted auto-advance to prevent loops
  const autoAdvanceAttemptedRef = useRef(false);

  useEffect(() => {
    if (!loading && classes.length > 0) {
      trackClassLoadTime(classLoadStartRef.current);
      startStep('class_list');
    }
  }, [loading, classes.length, trackClassLoadTime, startStep]);

  // Auto-advance to next week if current week has no classes (only on first load)
  useEffect(() => {
    // Only run when:
    // 1. Not loading
    // 2. No classes in current week
    // 3. We haven't already attempted auto-advance
    // 4. Currently on week 0 (first load scenario)
    // 5. No active filters (filtering might hide classes)
    if (
      !loading &&
      classes.length === 0 &&
      !autoAdvanceAttemptedRef.current &&
      weekOffset === 0 &&
      !hasActiveFilters
    ) {
      autoAdvanceAttemptedRef.current = true;
      // Advance to week 1 to show next week's classes
      setWeekOffset(1);
    }
  }, [loading, classes.length, weekOffset, hasActiveFilters, setWeekOffset]);

  // Handle going back to class list (via UI button)
  const handleBack = useCallback(() => {
    trackInteraction('back_to_class_list');
    // If we pushed history state, use history.back() for proper UX
    if (historyPushedRef.current) {
      window.history.back();
    } else {
      goBack();
      clearError();
    }
  }, [goBack, clearError, trackInteraction]);

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

    // Validate phone number with libphonenumber-js (country-specific validation)
    if (!validatePhoneNumber(formData.phone, formData.countryCode)) {
      setInvalidFields(['phone']);
      setError(t('booking_error_phone_invalid'));
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

    // Track form submit start time
    const submitStartTime = Date.now();

    // Abort any previous pending submission
    if (formAbortControllerRef.current) {
      formAbortControllerRef.current.abort();
    }

    // Create new AbortController for this submission
    const controller = new AbortController();
    formAbortControllerRef.current = controller;

    // Set up timeout
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, FORM_SUBMISSION_TIMEOUT_MS);

    // Generate event ID for Meta tracking deduplication
    const eventId = generateEventId();

    try {
      // Format phone number to E.164 format for Momence (+34612345678)
      // Cast countryCode since Zod returns string but libphonenumber expects CountryCode
      const formattedPhone = formatPhoneForAPI(
        validationResult.data.phone,
        validationResult.data.countryCode as import('libphonenumber-js').CountryCode
      );

      // Build complete payload aligned with V1 and Momence requirements
      const payload = {
        // User data (sanitized and validated)
        firstName: validationResult.data.firstName,
        lastName: validationResult.data.lastName,
        email: validationResult.data.email,
        phone: formattedPhone,

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
        signal: controller.signal,
      });

      // Clear timeout since request completed
      clearTimeout(timeoutId);

      // Check if component is still mounted before updating state
      if (!isMountedRef.current) return;

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('booking_error_generic'));
      }

      // Success - only update if still mounted
      if (isMountedRef.current) {
        setStatus('success');
        clearPersistedData();
        triggerHaptic('success');

        // Track form submit performance and complete funnel
        trackFormSubmitTime(submitStartTime);
        endStep('form_completed');

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
      }
    } catch (err) {
      // Clear timeout on error
      clearTimeout(timeoutId);

      // If aborted due to unmount or timeout, don't update state
      if (err instanceof DOMException && err.name === 'AbortError') {
        // Check if it was a timeout (component still mounted) vs unmount
        if (isMountedRef.current) {
          setStatus('error');
          setError(t('booking_error_timeout'));
        }
        return;
      }

      // Only update state if still mounted
      if (isMountedRef.current) {
        setStatus('error');
        setError(err instanceof Error ? err.message : t('booking_error_generic'));
      }
    } finally {
      // Clear the controller reference
      if (formAbortControllerRef.current === controller) {
        formAbortControllerRef.current = null;
      }
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
        showAllWeeks={hasActiveFilters}
        allWeeksClasses={allWeeksClasses}
        allWeeksLoading={allWeeksLoading}
      />
    );
  };

  // Show skeleton during SSR/hydration to prevent mismatch errors
  // The skeleton matches the visual structure so there's no layout shift
  if (!isClient) {
    return (
      <div className="relative">
        <div
          className="absolute -inset-4 bg-gradient-to-r from-primary-dark/20 via-primary-accent/10 to-primary-dark/20 rounded-3xl blur-2xl -z-10"
          aria-hidden="true"
        />
        <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 md:p-8">
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent"
            aria-hidden="true"
          />
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex justify-center mb-3 sm:mb-4">
              <img
                src="/images/logo/img/logo-fidc_256.webp"
                alt="Farray's Dance Center"
                className="h-20 sm:h-24 md:h-32 w-auto object-contain"
                loading="eager"
              />
            </div>
          </div>
          <SkeletonClassListStep cardCount={4} />
        </div>
      </div>
    );
  }

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
      <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 md:p-8">
        {/* Decorative gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent"
          aria-hidden="true"
        />

        {/* Language selector */}
        <LanguageSelector locale={locale} onLanguageChange={handleLanguageChange} />

        {/* Header with Logo */}
        <div className="text-center mb-4 sm:mb-6">
          {/* Logo - prominent and mobile first */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <img
              src="/images/logo/img/logo-fidc_256.webp"
              alt="Farray's Dance Center"
              className="h-20 sm:h-24 md:h-32 w-auto object-contain"
              loading="eager"
            />
          </div>
          {/* Title and subtitle - hide on success page */}
          {status !== 'success' && (
            <>
              <h1 className="text-2xl md:text-3xl font-black text-neutral mb-2">
                {t('booking_title')}
              </h1>
              <p className="text-neutral/60 text-sm md:text-base max-w-md mx-auto">
                {t('booking_subtitle_extended')}
              </p>
            </>
          )}

          {/* Social Proof Ticker - show recent bookings */}
          {status !== 'success' && status !== 'error' && (
            <div className="mt-4">
              <SocialProofTicker limit={5} />
            </div>
          )}
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
