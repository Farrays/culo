import React, { useEffect, useState, useCallback, useRef, memo, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, CheckIcon, CheckCircleIcon } from '../../lib/icons';
import { trackLeadConversion, LEAD_VALUES, pushToDataLayer, getMetaCookies } from '../../utils/analytics';
import { CountryPhoneInput } from '../booking/components/CountryPhoneInput';
import { getDefaultCountry, findCountryByCode } from '../booking/constants/countries';
import type { CountryCode } from 'libphonenumber-js';

// ============================================================================
// TYPES
// ============================================================================

type FormStatus = 'idle' | 'loading' | 'success' | 'success_existing' | 'error';

// Response status from API (KV deduplication)
type LeadResponseStatus = 'new' | 'existing' | 'refresh';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  discoveryAnswer: string;
  estilo: string;
  acceptsMarketing: boolean;
  acceptsWhatsApp: boolean;
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormData>;
  /** Full page mode - takes entire screen on all devices */
  fullPage?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// API route en Vercel - el token esta seguro en el servidor
const LEAD_API_URL = '/api/lead';

const DISCOVERY_OPTIONS = [
  { value: '', labelKey: 'leadModal_discovery_placeholder' },
  { value: 'Google', labelKey: 'leadModal_discovery_google' },
  { value: 'Instagram', labelKey: 'leadModal_discovery_instagram' },
  { value: 'Passing by', labelKey: 'leadModal_discovery_passingby' },
  { value: 'Friend', labelKey: 'leadModal_discovery_friend' },
  { value: 'Event', labelKey: 'leadModal_discovery_event' },
  { value: 'Other', labelKey: 'leadModal_discovery_other' },
];

const STYLE_OPTIONS = [
  { value: '', labelKey: 'leadModal_style_placeholder' },
  { value: 'Ritmos Latinos', labelKey: 'leadModal_style_latinos' },
  { value: 'Bailes Urbanos', labelKey: 'leadModal_style_urbanos' },
  { value: 'Danza', labelKey: 'leadModal_style_danza' },
  { value: 'Preparacion Fisica', labelKey: 'leadModal_style_fitness' },
  { value: 'Otros', labelKey: 'leadModal_style_other' },
];

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * LeadCaptureModal - Modal de captacion de leads con integracion Momence
 *
 * Features:
 * - History API: boton atras cierra el modal (no navega)
 * - Integracion real con Momence API
 * - Mobile-first: full-screen en movil, modal centrado en desktop
 * - Focus trap, cierre con Esc y click en overlay
 * - Confirmacion educativa tras envio
 * - Accesibilidad completa (ARIA, focus management)
 * - Respeta prefers-reduced-motion
 */
const LeadCaptureModal: React.FC<LeadCaptureModalProps> = memo(function LeadCaptureModal({
  isOpen,
  onClose,
  defaultValues = {},
  fullPage = false,
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
  const locale = i18n.language;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: defaultValues.firstName || '',
    lastName: defaultValues.lastName || '',
    email: defaultValues.email || '',
    phoneNumber: defaultValues.phoneNumber || '',
    discoveryAnswer: defaultValues.discoveryAnswer || '',
    estilo: defaultValues.estilo || '',
    acceptsMarketing: false,
    acceptsWhatsApp: false,
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showContent, setShowContent] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>(() => getDefaultCountry(locale).code);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const historyPushedRef = useRef(false);

  // Transition for non-urgent updates (INP optimization)
  const [, startTransition] = useTransition();

  // ============================================================================
  // HISTORY API - Para que el boton atras cierre el modal
  // ============================================================================

  useEffect(() => {
    if (isOpen) {
      // Empujar estado al historial cuando el modal se abre
      window.history.pushState({ modal: 'lead-capture' }, '');
      historyPushedRef.current = true;

      const handlePopState = () => {
        // Si el usuario pulsa atras y el modal esta abierto, cerrarlo
        if (historyPushedRef.current) {
          historyPushedRef.current = false;
          onClose();
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
        // Si el modal se cierra sin usar el boton atras, limpiar el historial
        // Defer history.back() to avoid blocking main thread (INP optimization)
        if (historyPushedRef.current) {
          historyPushedRef.current = false;
          // Use requestIdleCallback if available, otherwise setTimeout
          const deferredBack = () => window.history.back();
          if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(deferredBack, { timeout: 100 });
          } else {
            setTimeout(deferredBack, 0);
          }
        }
      };
    }
    return undefined;
  }, [isOpen, onClose]);

  // ============================================================================
  // ANIMACION Y FOCUS
  // ============================================================================

  useEffect(() => {
    if (isOpen) {
      // Animacion de entrada
      const timer = window.setTimeout(() => {
        setShowContent(true);
        // Focus en el primer input
        window.setTimeout(() => firstInputRef.current?.focus(), 100);
      }, 10);

      return () => window.clearTimeout(timer);
    } else {
      setShowContent(false);
      return undefined;
    }
  }, [isOpen]);

  // Reset form when modal closes (separate effect to avoid dependency issues)
  useEffect(() => {
    if (!isOpen) {
      // Small delay to allow closing animation, then reset with low priority
      const timer = window.setTimeout(() => {
        startTransition(() => {
          setFormData({
            firstName: defaultValues.firstName || '',
            lastName: defaultValues.lastName || '',
            email: defaultValues.email || '',
            phoneNumber: defaultValues.phoneNumber || '',
            discoveryAnswer: defaultValues.discoveryAnswer || '',
            estilo: defaultValues.estilo || '',
            acceptsMarketing: false,
            acceptsWhatsApp: false,
          });
          setStatus('idle');
          setErrorMessage('');
          setCountryCode(getDefaultCountry(locale).code);
          setIsPhoneValid(false);
        });
      }, 300);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, defaultValues, startTransition, locale]);

  // ============================================================================
  // BLOQUEAR SCROLL
  // ============================================================================

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

  // ============================================================================
  // HANDLERS (defined before useEffects that use them)
  // ============================================================================

  const handleClose = useCallback(() => {
    if (status === 'loading') return;
    // Start visual fade-out immediately for perceived performance
    setShowContent(false);
    // Defer the actual close to next frame to avoid blocking INP
    requestAnimationFrame(() => {
      startTransition(() => {
        onClose();
      });
    });
  }, [onClose, status, startTransition]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && status !== 'loading') {
        handleClose();
      }
    },
    [handleClose, status]
  );

  // ============================================================================
  // KEYBOARD NAVIGATION
  // ============================================================================

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cerrar con Escape
      if (e.key === 'Escape' && status !== 'loading') {
        handleClose();
      }

      // Focus trap
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
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      // Limpiar error al escribir
      if (errorMessage) setErrorMessage('');
    },
    [errorMessage]
  );

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setErrorMessage(t('leadModal_error_firstName'));
      return false;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage(t('leadModal_error_lastName'));
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage(t('leadModal_error_email'));
      return false;
    }
    if (!formData.phoneNumber.trim() || !isPhoneValid) {
      setErrorMessage(t('leadModal_error_phone'));
      return false;
    }
    if (!formData.discoveryAnswer) {
      setErrorMessage(t('leadModal_error_discovery'));
      return false;
    }
    if (!formData.estilo) {
      setErrorMessage(t('leadModal_error_style'));
      return false;
    }
    if (!formData.acceptsMarketing) {
      setErrorMessage(t('leadModal_error_consent'));
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

      // El token y sourceId se anaden en el backend (api/lead.ts)
      const { fbc, fbp } = getMetaCookies();
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formattedPhone,
        discoveryAnswer: formData.discoveryAnswer || 'Not specified',
        estilo: formData.estilo || 'Not specified',
        acceptsMarketing: formData.acceptsMarketing,
        acceptsWhatsApp: formData.acceptsWhatsApp,
        url: window.location.href,
        fbc,
        fbp,
      };

      // En desarrollo local, simular exito (la API solo funciona en Vercel)
      if (import.meta.env.DEV) {
        console.warn('[DEV] Lead form data:', payload);
        await new Promise(resolve => window.setTimeout(resolve, 1000)); // Simular delay
        setStatus('success');

        // Track conversion with full dataLayer + GA4 + Meta Pixel
        trackLeadConversion({
          leadSource: 'generic_modal',
          formName: `Lead Capture - ${formData.estilo || 'General'}`,
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

      // Parse response to check lead status (KV deduplication)
      const responseData = await response.json().catch(() => ({ success: true }));
      const leadStatus: LeadResponseStatus = responseData.status || 'new';

      // Set appropriate success state based on lead status
      if (leadStatus === 'existing') {
        // Lead ya registrado dentro de 90 días - mostrar mensaje diferente
        setStatus('success_existing');
        // Track existing lead event for analytics
        pushToDataLayer({
          event: 'lead_existing',
          lead_source: 'generic_modal',
          form_name: `Lead Capture - ${formData.estilo || 'General'}`,
          page_path: window.location.pathname,
        });
      } else {
        // new o refresh - lead nuevo o re-registrado después de 90 días
        setStatus('success');

        // Track conversion with full dataLayer + GA4 + Meta Pixel
        trackLeadConversion({
          leadSource: 'generic_modal',
          formName: `Lead Capture - ${formData.estilo || 'General'}`,
          leadValue: LEAD_VALUES.GENERIC_LEAD,
          pagePath: window.location.pathname,
          eventId: responseData.eventId,
        });
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      setStatus('error');
      setErrorMessage(t('leadModal_error_generic'));
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!isOpen) return null;

  // Use portal to render modal at document.body level, avoiding stacking context issues
  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex justify-center transition-all duration-300 motion-reduce:transition-none ${
        fullPage ? 'items-stretch' : 'items-end md:items-center'
      } ${showContent ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm motion-reduce:backdrop-blur-none"
        aria-hidden="true"
      />

      {/* Modal Container - Full screen en movil, centrado en desktop (unless fullPage) */}
      <div
        ref={modalRef}
        className={`relative z-10 w-full transition-all duration-500 motion-reduce:transition-none ${
          fullPage ? 'h-full' : 'md:max-w-lg md:mx-4'
        } ${
          showContent
            ? 'translate-y-0 md:scale-100'
            : 'translate-y-full md:translate-y-0 md:scale-95'
        }`}
      >
        {/* Glow effect - solo desktop */}
        <div
          className="hidden md:block absolute -inset-1 bg-gradient-to-r from-primary-dark via-primary-accent to-primary-dark rounded-3xl blur-xl opacity-30 -z-10"
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div
          className={`relative bg-black md:bg-black/95 md:backdrop-blur-xl border-t md:border border-primary-accent/30 overflow-hidden shadow-2xl overflow-y-auto ${
            fullPage ? 'h-full rounded-none' : 'md:rounded-3xl max-h-[95vh] md:max-h-[90vh]'
          }`}
        >
          {/* Decorative top line */}
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent"
            aria-hidden="true"
          />

          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/10 px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2 id="lead-modal-title" className="text-lg md:text-xl font-black text-neutral">
                  {status === 'success' || status === 'success_existing'
                    ? t('leadModal_success_title')
                    : t('leadModal_title')}
                </h2>
                {status !== 'success' && status !== 'success_existing' && (
                  <p className="text-sm text-neutral/70 mt-1">{t('leadModal_subtitle')}</p>
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
              /* ============================================================
                 SUCCESS STATE - Centrado en pantalla
              ============================================================ */
              <div className="min-h-[40vh] flex flex-col items-center justify-center text-center py-4 md:py-6">
                {/* Icon - Check for success, X for duplicate */}
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-full blur-xl motion-reduce:blur-none ${
                        status === 'success_existing' ? 'bg-amber-500/30' : 'bg-primary-accent/30'
                      }`}
                      aria-hidden="true"
                    />
                    <div
                      className={`relative w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center ${
                        status === 'success_existing'
                          ? 'bg-gradient-to-br from-amber-600 to-amber-500'
                          : 'bg-gradient-to-br from-primary-dark to-primary-accent'
                      }`}
                    >
                      {status === 'success_existing' ? (
                        <XMarkIcon className="w-7 h-7 md:w-10 md:h-10 text-white" />
                      ) : (
                        <CheckIcon className="w-7 h-7 md:w-10 md:h-10 text-white" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-black text-neutral mb-4">
                  {status === 'success_existing'
                    ? t('leadModal_existing_heading')
                    : t('leadModal_success_heading')}
                </h3>

                {status === 'success_existing' ? (
                  /* Mensaje para leads duplicados */
                  <p className="text-sm md:text-base text-neutral/80 max-w-sm">
                    {t('leadModal_existing_message')}
                  </p>
                ) : (
                  /* Mensaje para leads nuevos */
                  <>
                    {/* Main message */}
                    <p className="text-base md:text-lg text-neutral/90 mb-2">
                      {t('leadModal_success_message')}
                    </p>

                    {/* Secondary message */}
                    <p className="text-sm text-neutral/70 mb-2">
                      {t('leadModal_success_spam_note')}
                    </p>

                    {/* Language note */}
                    <p className="text-xs text-amber-400/80 mb-4 md:mb-6">
                      {t('leadModal_success_language_note')}
                    </p>

                    {/* Promo badge - hidden on mobile */}
                    <div className="hidden md:inline-flex items-center gap-2 bg-primary-accent/20 text-primary-accent px-5 py-3 rounded-xl text-sm font-semibold mb-6">
                      <CheckCircleIcon className="w-5 h-5" />
                      {t('leadModal_success_promo_included')}
                    </div>

                    {/* Deliverability tip - hidden on mobile */}
                    <div className="hidden md:block bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-xs text-neutral/60">
                        {t('leadModal_success_deliverability')}
                      </p>
                    </div>
                  </>
                )}

                {/* Close button */}
                <button
                  ref={lastFocusableRef}
                  onClick={handleClose}
                  className="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 text-neutral font-semibold rounded-xl transition-colors"
                >
                  {t('leadModal_success_close')}
                </button>
              </div>
            ) : (
              /* ============================================================
                 FORM STATE
              ============================================================ */
              <>
                {/* Benefits - Responsive: compact on mobile, full box on desktop */}
                <div className="bg-white/5 rounded-xl p-3 md:p-4 mb-3 md:mb-6 border border-white/10">
                  <p className="text-xs md:text-sm font-semibold text-neutral mb-2 md:mb-3">
                    {t('leadModal_benefits_title')}
                  </p>
                  <ul className="space-y-1.5 md:space-y-2">
                    <li className="flex items-center gap-2 text-xs md:text-sm text-neutral/80">
                      <CheckIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-accent flex-shrink-0" />
                      <span>{t('leadModal_benefit1')}</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs md:text-sm text-neutral/80">
                      <CheckIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-accent flex-shrink-0" />
                      <span>{t('leadModal_benefit2')}</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs md:text-sm text-neutral/80">
                      <CheckIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-accent flex-shrink-0" />
                      <span>{t('leadModal_benefit3')}</span>
                    </li>
                    <li className="flex items-center gap-2 text-xs md:text-sm text-neutral/80">
                      <CheckIcon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary-accent flex-shrink-0" />
                      <span>{t('leadModal_benefit4')}</span>
                    </li>
                  </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-neutral/80 mb-1.5"
                      >
                        {t('leadModal_field_firstName')} <span className="text-red-400">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50"
                        placeholder={t('leadModal_placeholder_firstName')}
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-neutral/80 mb-1.5"
                      >
                        {t('leadModal_field_lastName')} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50"
                        placeholder={t('leadModal_placeholder_lastName')}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-neutral/80 mb-1.5"
                    >
                      {t('leadModal_field_email')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50"
                      placeholder={t('leadModal_placeholder_email')}
                      autoComplete="email"
                    />
                  </div>

                  {/* Phone with country selector */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-neutral/80 mb-1.5"
                    >
                      {t('leadModal_field_phone')} <span className="text-red-400">*</span>
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
                        !!errorMessage && errorMessage.includes(t('leadModal_error_phone'))
                      }
                      placeholder={t('booking_placeholder_phone_number')}
                      id="phoneNumber"
                      name="phoneNumber"
                    />
                  </div>

                  {/* Discovery source */}
                  <div>
                    <label
                      htmlFor="discoveryAnswer"
                      className="block text-sm font-medium text-neutral/80 mb-1.5"
                    >
                      {t('leadModal_field_discovery')}
                    </label>
                    <select
                      id="discoveryAnswer"
                      name="discoveryAnswer"
                      value={formData.discoveryAnswer}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '20px',
                      }}
                    >
                      {DISCOVERY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value} className="bg-black">
                          {t(option.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dance style */}
                  <div>
                    <label
                      htmlFor="estilo"
                      className="block text-sm font-medium text-neutral/80 mb-1.5"
                    >
                      {t('leadModal_field_style')}
                    </label>
                    <select
                      id="estilo"
                      name="estilo"
                      value={formData.estilo}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50 appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '20px',
                      }}
                    >
                      {STYLE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value} className="bg-black">
                          {t(option.labelKey)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* RGPD Consent checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          id="acceptsMarketing"
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
                        <div className="w-5 h-5 border-2 border-white/30 rounded bg-white/5 peer-checked:bg-primary-accent peer-checked:border-primary-accent transition-all peer-focus:ring-2 peer-focus:ring-primary-accent/50 group-hover:border-white/50">
                          <CheckIcon className="w-full h-full text-white opacity-0 peer-checked:opacity-100 p-0.5" />
                        </div>
                        <CheckIcon className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 p-0.5 pointer-events-none" />
                      </div>
                      <span className="text-sm text-neutral/70 leading-tight">
                        {t('leadModal_consent_text')}{' '}
                        <a
                          href={`/${locale}/politica-privacidad`}
                          className="text-primary-accent hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t('leadModal_consent_link')}
                        </a>
                      </span>
                    </label>
                  </div>

                  {/* WhatsApp consent checkbox (opcional) */}
                  <div className="pt-1">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          id="acceptsWhatsApp"
                          name="acceptsWhatsApp"
                          checked={formData.acceptsWhatsApp}
                          onChange={e =>
                            setFormData(prev => ({
                              ...prev,
                              acceptsWhatsApp: e.target.checked,
                            }))
                          }
                          disabled={status === 'loading'}
                          className="peer sr-only"
                        />
                        <div className="w-5 h-5 border-2 border-white/30 rounded bg-white/5 peer-checked:bg-green-500 peer-checked:border-green-500 transition-all peer-focus:ring-2 peer-focus:ring-green-500/50 group-hover:border-white/50">
                          <CheckIcon className="w-full h-full text-white opacity-0 peer-checked:opacity-100 p-0.5" />
                        </div>
                        <CheckIcon className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 p-0.5 pointer-events-none" />
                      </div>
                      <span className="text-sm text-neutral/70 leading-tight">
                        {t(
                          'leadModal_consent_whatsapp',
                          'También quiero recibir información por WhatsApp'
                        )}
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
                    className="w-full py-3 md:py-4 bg-primary-accent text-white font-bold rounded-xl transition-all duration-300 hover:shadow-accent-glow hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 mt-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                          aria-hidden="true"
                        />
                        <span>{t('leadModal_sending')}</span>
                      </>
                    ) : (
                      <span>{t('leadModal_submit')}</span>
                    )}
                  </button>

                  {/* Retry hint on error */}
                  {status === 'error' && (
                    <p className="text-xs text-center text-neutral/70">
                      {t('leadModal_error_retry')}
                    </p>
                  )}
                </form>

                {/* Legal text - hidden on mobile to save space */}
                <div className="hidden md:block mt-6 pt-4 border-t border-white/10">
                  <p className="text-[10px] leading-relaxed text-neutral/40">
                    {t('leadModal_legal_text')}
                  </p>
                  <a
                    href={`/${locale}/aviso-legal`}
                    className="inline-block mt-2 text-[10px] text-primary-accent/70 hover:text-primary-accent transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t('leadModal_legal_link')}
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal in portal to escape parent stacking contexts (transforms, etc.)
  return createPortal(modalContent, document.body);
});

export default LeadCaptureModal;
