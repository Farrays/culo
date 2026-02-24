/**
 * =============================================================================
 * GENERIC LEAD MODAL COMPONENT
 * =============================================================================
 *
 * Modal reutilizable para captación de leads O flujo de reserva directa.
 * Se usa junto con GenericDanceLanding y recibe la misma configuración.
 *
 * FLUJO DE RESERVA DIRECTA (bookingWidget configurado):
 * 1. Micro-commitment → 2. CTA a widget de reservas con filtros
 *
 * FLUJO LEGACY (sin bookingWidget):
 * 1. Micro-commitment → 2. Formulario de lead → 3. Success
 */

import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, CheckIcon, CheckCircleIcon, CalendarIcon } from '../../lib/icons';
import type { LandingConfig, LandingScheduleItem } from '../../constants/landing-template-config';
import {
  trackLeadConversion,
  LEAD_VALUES,
  pushToDataLayer,
  getMetaCookies,
} from '../../utils/analytics';
import { CountryPhoneInput } from '../booking/components/CountryPhoneInput';
import { getDefaultCountry, findCountryByCode } from '../booking/constants/countries';
import type { CountryCode } from 'libphonenumber-js';

// =============================================================================
// TYPES
// =============================================================================

type FormStatus = 'idle' | 'loading' | 'success' | 'success_existing' | 'error';
type LeadResponseStatus = 'new' | 'existing' | 'refresh';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  acceptsMarketing: boolean;
}

// Mapping from translation dayKey to Spanish day name (used by booking widget URL params)
const DAY_KEY_TO_BOOKING_DAY: Record<string, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

interface GenericLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LandingConfig;
  selectedScheduleItem?: LandingScheduleItem | null;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const LEAD_API_URL = '/api/lead';

// =============================================================================
// COMPONENT
// =============================================================================

const GenericLeadModal: React.FC<GenericLeadModalProps> = memo(function GenericLeadModal({
  isOpen,
  onClose,
  config,
  selectedScheduleItem,
}) {
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
  const navigate = useNavigate();
  const locale = i18n.language;
  const {
    translationPrefix: prefix,
    sourceId,
    estiloValue,
    discoveryValue,
    bookingWidget,
  } = config;
  const theme = config.theme.classes;

  // Check if using direct booking flow (high conversion) vs lead capture
  // Note: bookingWidget with empty styleFilter = show all classes (Jornada Puertas Abiertas)
  const useDirectBooking = !!bookingWidget;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    acceptsMarketing: false,
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showContent, setShowContent] = useState(false);
  const [hasMicroCommitment, setHasMicroCommitment] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>(() => getDefaultCountry(locale).code);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const historyPushedRef = useRef(false);

  // Prefijo para traducciones del modal
  const modalPrefix = prefix.replace('Landing', 'LeadModal');

  // =============================================================================
  // HISTORY API
  // =============================================================================

  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modal: `${config.id}-lead` }, '');
      historyPushedRef.current = true;

      const handlePopState = () => {
        if (historyPushedRef.current) {
          historyPushedRef.current = false;
          onClose();
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        if (historyPushedRef.current) {
          historyPushedRef.current = false;
          window.history.back();
        }
      };
    }
    return undefined;
  }, [isOpen, onClose, config.id]);

  // =============================================================================
  // ANIMATION & FOCUS
  // =============================================================================

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => {
        setShowContent(true);
        window.setTimeout(() => firstInputRef.current?.focus(), 100);
      }, 10);

      return () => window.clearTimeout(timer);
    } else {
      setShowContent(false);
      return undefined;
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = window.setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          acceptsMarketing: false,
        });
        setStatus('idle');
        setErrorMessage('');
        setHasMicroCommitment(false);
        setCountryCode(getDefaultCountry(locale).code);
        setIsPhoneValid(false);
      }, 300);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, locale]);

  // =============================================================================
  // SCROLL LOCK
  // =============================================================================

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [isOpen]);

  // =============================================================================
  // HANDLERS
  // =============================================================================

  const handleClose = useCallback(() => {
    if (status === 'loading') return;
    onClose();
  }, [onClose, status]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && status !== 'loading') {
        handleClose();
      }
    },
    [handleClose, status]
  );

  // =============================================================================
  // KEYBOARD NAVIGATION
  // =============================================================================

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && status !== 'loading') {
        handleClose();
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, status, handleClose]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errorMessage) setErrorMessage('');
    },
    [errorMessage]
  );

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setErrorMessage(t(`${modalPrefix}_error_firstName`));
      return false;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage(t(`${modalPrefix}_error_lastName`));
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage(t(`${modalPrefix}_error_email`));
      return false;
    }
    if (!formData.phoneNumber.trim() || !isPhoneValid) {
      setErrorMessage(t(`${modalPrefix}_error_phone`));
      return false;
    }
    if (!formData.acceptsMarketing) {
      setErrorMessage(t(`${modalPrefix}_error_consent`));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateForm()) return;

    setStatus('loading');

    try {
      // Format phone: Momence leads endpoint expects format like "34612345678" (no + sign)
      const country = findCountryByCode(countryCode);
      const cleanedPhone = formData.phoneNumber.trim().replace(/\D/g, '');
      const dialCodeDigits = country?.dialCode.replace('+', '') ?? '34';
      const formattedPhone = `${dialCodeDigits}${cleanedPhone}`;

      const { fbc, fbp } = getMetaCookies();
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formattedPhone,
        discoveryAnswer: discoveryValue,
        estilo: estiloValue,
        acceptsMarketing: formData.acceptsMarketing,
        url: window.location.href,
        sourceId: sourceId,
        fbc,
        fbp,
      };

      // En desarrollo local, simular exito
      if (import.meta.env.DEV) {
        console.warn(`[DEV] ${estiloValue} Lead form data:`, payload);
        await new Promise(resolve => window.setTimeout(resolve, 1000));
        setStatus('success');

        // Track conversion with full dataLayer + GA4 + Meta Pixel
        trackLeadConversion({
          leadSource: 'generic_modal',
          formName: `${estiloValue} Free Welcome Class`,
          leadValue: LEAD_VALUES.GENERIC_LEAD,
          pagePath: window.location.pathname,
        });
        return;
      }

      const response = await fetch(LEAD_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      const responseData = await response.json().catch(() => ({ success: true }));
      const leadStatus: LeadResponseStatus = responseData.status || 'new';

      if (leadStatus === 'existing') {
        setStatus('success_existing');
        // Track existing lead event for analytics (lower value)
        pushToDataLayer({
          event: 'lead_existing',
          lead_source: 'generic_modal',
          form_name: `${estiloValue} Free Welcome Class`,
          page_path: window.location.pathname,
        });
      } else {
        setStatus('success');

        // Track conversion with full dataLayer + GA4 + Meta Pixel
        trackLeadConversion({
          leadSource: 'generic_modal',
          formName: `${estiloValue} Free Welcome Class`,
          leadValue: LEAD_VALUES.GENERIC_LEAD,
          pagePath: window.location.pathname,
          eventId: responseData.eventId,
        });
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      setStatus('error');
      setErrorMessage(t(`${modalPrefix}_error_generic`));
    }
  };

  // =============================================================================
  // RENDER
  // =============================================================================

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 motion-reduce:transition-none ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${config.id}-lead-modal-title`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm motion-reduce:backdrop-blur-none"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`relative z-10 w-full md:max-w-md md:mx-4 transition-all duration-500 motion-reduce:transition-none ${
          showContent
            ? 'translate-y-0 md:scale-100'
            : 'translate-y-full md:translate-y-0 md:scale-95'
        }`}
      >
        {/* Glow effect */}
        <div
          className={`hidden md:block absolute -inset-1 bg-gradient-to-r ${theme.modalGlow} rounded-3xl blur-xl opacity-30 -z-10`}
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          className={`relative bg-black md:bg-black/95 md:backdrop-blur-xl border-t md:border ${theme.borderPrimary} md:rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto`}
        >
          {/* Decorative top line */}
          <div
            className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent ${theme.bgPrimary} to-transparent`}
            aria-hidden="true"
          />

          {/* Header */}
          <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2
                  id={`${config.id}-lead-modal-title`}
                  className="text-lg md:text-xl font-black text-neutral"
                >
                  {status === 'success' || status === 'success_existing'
                    ? t(`${modalPrefix}_success_title`)
                    : t(`${modalPrefix}_title`)}
                </h2>
                {status !== 'success' && status !== 'success_existing' && (
                  <p className="text-sm text-neutral/70 mt-1">{t(`${modalPrefix}_subtitle`)}</p>
                )}
              </div>
              <button
                onClick={handleClose}
                disabled={status === 'loading'}
                className="p-2 text-neutral/70 hover:text-neutral transition-colors rounded-full hover:bg-white/5 disabled:opacity-50 flex-shrink-0"
                aria-label={t('close')}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 md:p-6">
            {status === 'success' || status === 'success_existing' ? (
              /* SUCCESS STATE */
              <div className="min-h-[40vh] flex flex-col items-center justify-center text-center py-4">
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 ${status === 'success_existing' ? 'bg-amber-500/20' : theme.bgPrimaryLight} rounded-full blur-xl motion-reduce:blur-none`}
                      aria-hidden="true"
                    />
                    <div
                      className={`relative w-14 h-14 md:w-20 md:h-20 ${status === 'success_existing' ? 'bg-gradient-to-br from-amber-600 to-amber-500' : theme.bgPrimary} rounded-full flex items-center justify-center`}
                    >
                      {status === 'success_existing' ? (
                        <XMarkIcon className="w-7 h-7 md:w-10 md:h-10 text-white" />
                      ) : (
                        <CheckIcon className="w-7 h-7 md:w-10 md:h-10 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-neutral mb-3 md:mb-4">
                  {status === 'success_existing'
                    ? t(`${modalPrefix}_existing_heading`)
                    : t(`${modalPrefix}_success_heading`)}
                </h3>

                {status === 'success_existing' ? (
                  <>
                    <p className="text-lg text-neutral/90 mb-2">
                      {t(`${modalPrefix}_existing_message`)}
                    </p>
                    <p className="text-sm text-neutral/70 mb-6">
                      {t(`${modalPrefix}_existing_contact`)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-lg text-neutral/90 mb-2">
                      {t(`${modalPrefix}_success_message`)}
                    </p>
                    <p className="text-sm text-neutral/70 mb-6">
                      {t(`${modalPrefix}_success_check_email`)}
                    </p>
                  </>
                )}

                {status === 'success' && (
                  <div
                    className={`${theme.bgPrimaryLight} ${theme.borderPrimaryLight} border rounded-xl p-4 mb-6 text-left`}
                  >
                    <p className="text-sm font-semibold text-neutral mb-3">
                      {t(`${modalPrefix}_success_next_title`)}
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-neutral/80">
                        <CheckCircleIcon
                          className={`w-4 h-4 ${theme.textPrimary} flex-shrink-0 mt-0.5`}
                        />
                        <span>{t(`${modalPrefix}_success_next_1`)}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-neutral/80">
                        <CheckCircleIcon
                          className={`w-4 h-4 ${theme.textPrimary} flex-shrink-0 mt-0.5`}
                        />
                        <span>{t(`${modalPrefix}_success_next_2`)}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-neutral/80">
                        <CheckCircleIcon
                          className={`w-4 h-4 ${theme.textPrimary} flex-shrink-0 mt-0.5`}
                        />
                        <span>{t(`${modalPrefix}_success_next_3`)}</span>
                      </li>
                    </ul>
                  </div>
                )}

                <p className="text-xs text-neutral/70 mb-2">
                  {t(`${modalPrefix}_success_spam_note`)}
                </p>

                {/* Language note - only for success, not existing */}
                {status === 'success' && (
                  <p className="text-xs text-amber-400/80 mb-4">
                    {t('leadModal_success_language_note')}
                  </p>
                )}

                <button
                  onClick={handleClose}
                  className={`px-8 py-3 ${theme.bgPrimary} ${theme.bgPrimaryHover} text-white font-semibold rounded-xl transition-colors`}
                >
                  {t(`${modalPrefix}_success_close`)}
                </button>
              </div>
            ) : !hasMicroCommitment ? (
              /* MICRO COMMITMENT STEP */
              <div className="flex flex-col items-center justify-center text-center py-2 md:py-4">
                <p className="text-base md:text-lg font-semibold text-neutral mb-4 md:mb-6">
                  {t(`${modalPrefix}_microCommit_question`)}
                </p>
                <div className="space-y-3 w-full">
                  <button
                    onClick={() => {
                      if (useDirectBooking && bookingWidget) {
                        // Direct booking flow: go straight to booking widget
                        const bookingDay = selectedScheduleItem
                          ? DAY_KEY_TO_BOOKING_DAY[selectedScheduleItem.dayKey] || ''
                          : '';
                        const bookingTime = selectedScheduleItem
                          ? selectedScheduleItem.time.split(' - ')[0]
                          : '';

                        pushToDataLayer({
                          event: 'micro_commitment_booking',
                          lead_source: selectedScheduleItem ? 'schedule_card' : 'generic_modal',
                          style: bookingWidget.styleFilter,
                          ...(bookingDay && { day: bookingDay }),
                          ...(bookingTime && { time: bookingTime }),
                          page_path: window.location.pathname,
                        });

                        // Prevent cleanup from calling history.back() which would undo navigation
                        historyPushedRef.current = false;

                        // Build booking URL with optional day/time from selected schedule card
                        const params = new URLSearchParams();
                        if (bookingWidget.styleFilter)
                          params.set('style', bookingWidget.styleFilter);
                        params.set('locked', 'true');
                        if (bookingDay) params.set('day', bookingDay);
                        if (bookingTime) params.set('time', bookingTime);

                        // Calculate week offset to show the target date's week
                        if (bookingWidget.targetDate) {
                          const target = new Date(bookingWidget.targetDate + 'T00:00:00');
                          const now = new Date();
                          // Get Monday of current week
                          const dayOfWeek = now.getDay();
                          const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                          const currentMonday = new Date(now);
                          currentMonday.setDate(now.getDate() + mondayOffset);
                          currentMonday.setHours(0, 0, 0, 0);
                          // Get Monday of target week
                          const targetDayOfWeek = target.getDay();
                          const targetMondayOffset =
                            targetDayOfWeek === 0 ? -6 : 1 - targetDayOfWeek;
                          const targetMonday = new Date(target);
                          targetMonday.setDate(target.getDate() + targetMondayOffset);
                          targetMonday.setHours(0, 0, 0, 0);
                          // Week offset = difference in weeks
                          const diffMs = targetMonday.getTime() - currentMonday.getTime();
                          const weekOffset = Math.max(
                            0,
                            Math.min(4, Math.round(diffMs / (7 * 24 * 60 * 60 * 1000)))
                          );
                          params.set('week', String(weekOffset));
                        }

                        const bookingUrl = `/${locale}/reservas?${params.toString()}`;
                        navigate(bookingUrl);
                        onClose();
                      } else {
                        // Legacy flow: show lead form
                        setHasMicroCommitment(true);
                      }
                    }}
                    className={`w-full py-3 md:py-4 ${theme.bgPrimary} ${theme.bgPrimaryHover} text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02]`}
                  >
                    {t(`${modalPrefix}_microCommit_yes`)}
                  </button>
                </div>
              </div>
            ) : useDirectBooking ? (
              /* DIRECT BOOKING CTA - This branch is now unreachable for direct booking */
              /* Kept for backwards compatibility if micro-commitment state changes */
              <div className="min-h-[40vh] flex flex-col items-center justify-center text-center py-4">
                {/* Success icon */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 ${theme.bgPrimaryLight} rounded-full blur-xl motion-reduce:blur-none`}
                      aria-hidden="true"
                    />
                    <div
                      className={`relative w-14 h-14 md:w-20 md:h-20 ${theme.bgPrimary} rounded-full flex items-center justify-center`}
                    >
                      <CalendarIcon className="w-7 h-7 md:w-10 md:h-10 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-neutral mb-3 md:mb-4">
                  {t(`${modalPrefix}_booking_heading`)}
                </h3>

                <p className="text-lg text-neutral/90 mb-2">
                  {t(`${modalPrefix}_booking_message`)}
                </p>

                {/* Benefits reminder */}
                <div
                  className={`${theme.bgPrimaryLight} rounded-xl p-3 md:p-4 mb-6 ${theme.borderPrimaryLight} border text-left w-full`}
                >
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className={`w-4 h-4 ${theme.textPrimary} flex-shrink-0 mt-0.5`} />
                      <span>{t(`${modalPrefix}_benefit1`)}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className={`w-4 h-4 ${theme.textPrimary} flex-shrink-0 mt-0.5`} />
                      <span>{t(`${modalPrefix}_benefit3`)}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className={`w-4 h-4 ${theme.textPrimary} flex-shrink-0 mt-0.5`} />
                      <span>{t(`${modalPrefix}_benefit4`)}</span>
                    </li>
                  </ul>
                </div>

                {/* Booking CTA Button */}
                <button
                  onClick={() => {
                    const bookingDay = selectedScheduleItem
                      ? DAY_KEY_TO_BOOKING_DAY[selectedScheduleItem.dayKey] || ''
                      : '';
                    const bookingTime = selectedScheduleItem
                      ? selectedScheduleItem.time.split(' - ')[0]
                      : '';

                    pushToDataLayer({
                      event: 'micro_commitment_booking',
                      lead_source: selectedScheduleItem ? 'schedule_card' : 'generic_modal',
                      style: bookingWidget.styleFilter,
                      ...(bookingDay && { day: bookingDay }),
                      ...(bookingTime && { time: bookingTime }),
                      page_path: window.location.pathname,
                    });

                    // Navigate to booking widget with filters (locked mode - no filter UI)
                    const params = new URLSearchParams();
                    if (bookingWidget.styleFilter) params.set('style', bookingWidget.styleFilter);
                    params.set('locked', 'true');
                    if (bookingDay) params.set('day', bookingDay);
                    if (bookingTime) params.set('time', bookingTime);

                    const bookingUrl = `/${locale}/reservas?${params.toString()}`;
                    navigate(bookingUrl);
                    onClose();
                  }}
                  className={`w-full py-4 ${theme.bgPrimary} ${theme.bgPrimaryHover} text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 text-lg`}
                >
                  <CalendarIcon className="w-6 h-6" />
                  <span>{t(bookingWidget.ctaKey || `${modalPrefix}_booking_cta`)}</span>
                </button>

                <p className="text-xs text-neutral/50 mt-4">{t(`${modalPrefix}_booking_note`)}</p>
              </div>
            ) : (
              /* LEGACY LEAD FORM */
              <>
                <p className="text-neutral/70 text-sm mb-4 md:mb-6">{t(`${modalPrefix}_intro`)}</p>

                {/* Benefits */}
                <div
                  className={`${theme.bgPrimaryLight} rounded-xl p-3 md:p-4 mb-4 md:mb-6 ${theme.borderPrimaryLight} border`}
                >
                  <p className="text-sm font-semibold text-neutral mb-3">
                    {t(`${modalPrefix}_benefits_title`)}
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className={`w-4 h-4 ${theme.textPrimary} flex-shrink-0 mt-0.5`} />
                      <span>{t(`${modalPrefix}_benefit1`)}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className={`w-4 h-4 ${theme.textPrimary} flex-shrink-0 mt-0.5`} />
                      <span>{t(`${modalPrefix}_benefit3`)}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className={`w-4 h-4 ${theme.textPrimary} flex-shrink-0 mt-0.5`} />
                      <span>{t(`${modalPrefix}_benefit4`)}</span>
                    </li>
                  </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`${config.id}-firstName`}
                        className="block text-sm font-medium text-neutral/80 mb-1.5"
                      >
                        {t(`${modalPrefix}_field_firstName`)}{' '}
                        <span className={theme.textPrimary}>*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id={`${config.id}-firstName`}
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={status === 'loading'}
                        className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:${theme.borderPrimary} focus:ring-2 ${theme.ringPrimary} transition-all disabled:opacity-50`}
                        placeholder={t(`${modalPrefix}_placeholder_firstName`)}
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`${config.id}-lastName`}
                        className="block text-sm font-medium text-neutral/80 mb-1.5"
                      >
                        {t(`${modalPrefix}_field_lastName`)}{' '}
                        <span className={theme.textPrimary}>*</span>
                      </label>
                      <input
                        type="text"
                        id={`${config.id}-lastName`}
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={status === 'loading'}
                        className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:${theme.borderPrimary} focus:ring-2 ${theme.ringPrimary} transition-all disabled:opacity-50`}
                        placeholder={t(`${modalPrefix}_placeholder_lastName`)}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor={`${config.id}-email`}
                      className="block text-sm font-medium text-neutral/80 mb-1.5"
                    >
                      {t(`${modalPrefix}_field_email`)} <span className={theme.textPrimary}>*</span>
                    </label>
                    <input
                      type="email"
                      id={`${config.id}-email`}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      className={`w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:${theme.borderPrimary} focus:ring-2 ${theme.ringPrimary} transition-all disabled:opacity-50`}
                      placeholder={t(`${modalPrefix}_placeholder_email`)}
                      autoComplete="email"
                    />
                  </div>

                  {/* Phone with country selector */}
                  <div>
                    <label
                      htmlFor={`${config.id}-phoneNumber`}
                      className="block text-sm font-medium text-neutral/80 mb-1.5"
                    >
                      {t(`${modalPrefix}_field_phone`)} <span className={theme.textPrimary}>*</span>
                    </label>
                    <CountryPhoneInput
                      value={formData.phoneNumber}
                      countryCode={countryCode}
                      onChange={(phone, newCountryCode, valid) => {
                        setFormData(prev => ({ ...prev, phoneNumber: phone }));
                        setCountryCode(newCountryCode);
                        setIsPhoneValid(valid);
                        if (errorMessage) setErrorMessage('');
                      }}
                      disabled={status === 'loading'}
                      isInvalid={
                        !!errorMessage && errorMessage.includes(t(`${modalPrefix}_error_phone`))
                      }
                      placeholder={t('booking_placeholder_phone_number')}
                      id={`${config.id}-phoneNumber`}
                      name="phoneNumber"
                    />
                  </div>

                  {/* RGPD Consent */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          id={`${config.id}-acceptsMarketing`}
                          name="acceptsMarketing"
                          checked={formData.acceptsMarketing}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              acceptsMarketing: e.target.checked,
                            }))
                          }
                          disabled={status === 'loading'}
                          className="peer sr-only"
                        />
                        <div
                          className={`w-5 h-5 border-2 border-white/30 rounded bg-white/5 peer-checked:${theme.bgPrimary} peer-checked:${theme.borderPrimary} transition-all ${theme.ringPrimary} peer-focus:ring-2 group-hover:border-white/50`}
                        >
                          <CheckIcon className="w-full h-full text-white opacity-0 peer-checked:opacity-100 p-0.5" />
                        </div>
                        <CheckIcon className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 p-0.5 pointer-events-none" />
                      </div>
                      <span className="text-sm text-neutral/70 leading-tight">
                        {t(`${modalPrefix}_consent_text`)}{' '}
                        <Link
                          to={`/${locale}/politica-privacidad`}
                          className={`${theme.textPrimary} hover:underline`}
                          target="_blank"
                        >
                          {t(`${modalPrefix}_consent_link`)}
                        </Link>
                      </span>
                    </label>
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
                    disabled={status === 'loading'}
                    className={`w-full py-3 md:py-4 ${theme.bgPrimary} ${theme.bgPrimaryHover} text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 mt-2`}
                  >
                    {status === 'loading' ? (
                      <>
                        <div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                          aria-hidden="true"
                        />
                        <span>{t(`${modalPrefix}_sending`)}</span>
                      </>
                    ) : (
                      <span>{t(`${modalPrefix}_submit`)}</span>
                    )}
                  </button>
                </form>

                {/* Legal text */}
                <div className="hidden md:block mt-6 pt-4 border-t border-white/10">
                  <p className="text-[10px] leading-relaxed text-neutral/40">
                    {t(`${modalPrefix}_legal_text`)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default GenericLeadModal;
