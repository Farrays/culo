/**
 * BookingWidget V2
 * Enterprise-level booking widget with deep linking and URL-synced filters
 *
 * Features:
 * - 2-step flow: Class Selection → Form
 * - URL parameters for deep linking campaigns
 * - Full filter support (style, level, day, timeBlock, instructor)
 * - Analytics tracking for all interactions
 */

import React, { useEffect, memo } from 'react';
import { useI18n } from '../../hooks/useI18n';

// Hooks
import { useBookingFilters } from './hooks/useBookingFilters';
import { useBookingState } from './hooks/useBookingState';
import { useBookingClasses } from './hooks/useBookingClasses';
import { useBookingAnalytics } from './hooks/useBookingAnalytics';

// Components
import { ClassListStep } from './components/ClassListStep';
import { BookingFormStep } from './components/BookingFormStep';
import { BookingSuccess } from './components/BookingSuccess';
import { BookingError } from './components/BookingError';

// Types
import type { ClassData, BookingFormData } from './types/booking';
import { requiresHeelsConsent } from './types/booking';

// Step indicator component
const StepIndicator: React.FC<{
  currentStep: 'class' | 'form';
  t: (key: string) => string;
}> = ({ currentStep, t }) => {
  const steps = [
    { key: 'class', label: t('booking_step1_classes') },
    { key: 'form', label: t('booking_step2_form') },
  ];

  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep;
        const isPast = currentStep === 'form' && step.key === 'class';

        return (
          <React.Fragment key={step.key}>
            {index > 0 && (
              <div className={`w-12 h-0.5 ${isPast ? 'bg-primary-accent' : 'bg-white/20'}`} />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-bold transition-all duration-300
                  ${
                    isActive
                      ? 'bg-primary-accent text-white scale-110'
                      : isPast
                        ? 'bg-primary-accent/20 text-primary-accent'
                        : 'bg-white/10 text-neutral/50'
                  }
                `}
              >
                {isPast ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`hidden sm:block text-sm ${
                  isActive ? 'text-neutral font-medium' : 'text-neutral/50'
                }`}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

const BookingWidgetV2: React.FC = memo(() => {
  const { t } = useI18n();

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

  const {
    step,
    status,
    selectedClass,
    formData,
    errorMessage,
    selectClass,
    goBack,
    setStatus,
    updateForm,
    setError,
    clearError,
    reset,
  } = useBookingState(weekOffset);

  const {
    classes,
    loading,
    error: classesError,
    filterOptions,
    refetch,
  } = useBookingClasses({ filters, weekOffset });

  const { trackClassSelected, trackBookingSuccess } = useBookingAnalytics();

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
    goBack();
    clearError();
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClass) return;

    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError(t('booking_error_required_fields'));
      return;
    }

    // Validate required consents
    if (
      !formData.acceptsTerms ||
      !formData.acceptsMarketing ||
      !formData.acceptsAge ||
      !formData.acceptsNoRefund ||
      !formData.acceptsPrivacy
    ) {
      setError(t('booking_error_consent_required'));
      return;
    }

    // Validate heels consent if required
    if (requiresHeelsConsent(selectedClass) && !formData.acceptsHeels) {
      setError(t('booking_error_heels_consent_required'));
      return;
    }

    setStatus('loading');
    clearError();

    try {
      const response = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classId: selectedClass.id,
          className: selectedClass.name,
          classDate: selectedClass.date,
          classTime: selectedClass.time,
          classStyle: selectedClass.style,
          classLevel: selectedClass.level,
          classInstructor: selectedClass.instructor,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t('booking_error_generic'));
      }

      // Success
      setStatus('success');

      // Track conversion
      trackBookingSuccess(selectedClass);
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
          onBack={handleBack}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
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
      />
    );
  };

  return (
    <div className="relative">
      {/* 3D Background glow */}
      <div
        className="absolute -inset-4 bg-gradient-to-r from-primary-dark/20 via-primary-accent/10 to-primary-dark/20 rounded-3xl blur-2xl -z-10"
        style={{ transform: 'translateZ(-20px)' }}
      />

      {/* Main container */}
      <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 overflow-hidden">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent" />

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-neutral mb-2">
            {t('booking_title')}
          </h1>
          <p className="text-neutral/60">{t('booking_subtitle')}</p>
        </div>

        {/* Step indicator - hide on success/error */}
        {status !== 'success' && status !== 'error' && <StepIndicator currentStep={step} t={t} />}

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
});

BookingWidgetV2.displayName = 'BookingWidgetV2';

export default BookingWidgetV2;
