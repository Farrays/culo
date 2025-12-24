import React, { useEffect, useState, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { XMarkIcon, CheckIcon, CheckCircleIcon } from '../../lib/icons';

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
}

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: Partial<FormData>;
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
}) {
  const { t, locale } = useI18n();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: defaultValues.firstName || '',
    lastName: defaultValues.lastName || '',
    email: defaultValues.email || '',
    phoneNumber: defaultValues.phoneNumber || '',
    discoveryAnswer: defaultValues.discoveryAnswer || '',
    estilo: defaultValues.estilo || '',
    acceptsMarketing: false,
  });

  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showContent, setShowContent] = useState(false);

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);
  const historyPushedRef = useRef(false);

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
        if (historyPushedRef.current) {
          historyPushedRef.current = false;
          window.history.back();
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
      // Small delay to allow closing animation
      const timer = window.setTimeout(() => {
        setFormData({
          firstName: defaultValues.firstName || '',
          lastName: defaultValues.lastName || '',
          email: defaultValues.email || '',
          phoneNumber: defaultValues.phoneNumber || '',
          discoveryAnswer: defaultValues.discoveryAnswer || '',
          estilo: defaultValues.estilo || '',
          acceptsMarketing: false,
        });
        setStatus('idle');
        setErrorMessage('');
      }, 300);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isOpen, defaultValues]);

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
    if (!formData.phoneNumber.trim()) {
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
      // El token y sourceId se anaden en el backend (api/lead.ts)
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        discoveryAnswer: formData.discoveryAnswer || 'Not specified',
        estilo: formData.estilo || 'Not specified',
        acceptsMarketing: formData.acceptsMarketing,
        url: window.location.href,
      };

      // En desarrollo local, simular exito (la API solo funciona en Vercel)
      if (import.meta.env.DEV) {
        console.warn('[DEV] Lead form data:', payload);
        await new Promise(resolve => window.setTimeout(resolve, 1000)); // Simular delay
        setStatus('success');
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
      } else {
        // new o refresh - lead nuevo o re-registrado después de 90 días
        setStatus('success');
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

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-end md:items-center justify-center transition-all duration-300 motion-reduce:transition-none ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
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

      {/* Modal Container - Full screen en movil, centrado en desktop */}
      <div
        ref={modalRef}
        className={`relative z-10 w-full md:max-w-lg md:mx-4 transition-all duration-500 motion-reduce:transition-none ${
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
        <div className="relative bg-black md:bg-black/95 md:backdrop-blur-xl border-t md:border border-primary-accent/30 md:rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
          {/* Decorative top line */}
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent"
            aria-hidden="true"
          />

          {/* Header with close button */}
          <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/10 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2 id="lead-modal-title" className="text-xl font-black text-neutral">
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
                className="p-2 text-neutral/50 hover:text-neutral transition-colors rounded-full hover:bg-white/5 disabled:opacity-50 flex-shrink-0"
                aria-label={t('close')}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {status === 'success' || status === 'success_existing' ? (
              /* ============================================================
                 SUCCESS STATE - Confirmacion educativa
              ============================================================ */
              <div className="text-center py-6">
                {/* Success icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div
                      className="absolute inset-0 bg-primary-accent/30 rounded-full blur-xl motion-reduce:blur-none"
                      aria-hidden="true"
                    />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary-dark to-primary-accent rounded-full flex items-center justify-center">
                      <CheckIcon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Success title */}
                <h3 className="text-2xl font-black text-neutral mb-4">
                  {status === 'success_existing'
                    ? t('leadModal_existing_heading')
                    : t('leadModal_success_heading')}
                </h3>

                {status === 'success_existing' ? (
                  /* Mensaje para leads duplicados */
                  <>
                    <p className="text-lg text-neutral/90 mb-2">
                      {t('leadModal_existing_message')}
                    </p>
                    <p className="text-sm text-neutral/70 mb-6">
                      {t('leadModal_existing_contact')}
                    </p>
                  </>
                ) : (
                  /* Mensaje para leads nuevos */
                  <>
                    {/* Main message */}
                    <p className="text-lg text-neutral/90 mb-2">{t('leadModal_success_message')}</p>

                    {/* Secondary message */}
                    <p className="text-sm text-neutral/70 mb-6">
                      {t('leadModal_success_spam_note')}
                    </p>

                    {/* Promo badge */}
                    <div className="inline-flex items-center gap-2 bg-primary-accent/20 text-primary-accent px-5 py-3 rounded-xl text-sm font-semibold mb-6">
                      <CheckCircleIcon className="w-5 h-5" />
                      {t('leadModal_success_promo_included')}
                    </div>

                    {/* Deliverability tip */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
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
                {/* Intro text */}
                <p className="text-neutral/70 text-sm mb-6">{t('leadModal_intro')}</p>

                {/* Benefits preview */}
                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <p className="text-sm font-semibold text-neutral mb-3">
                    {t('leadModal_benefits_title')}
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('leadModal_benefit1')}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('leadModal_benefit2')}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('leadModal_benefit3')}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('leadModal_benefit4')}</span>
                    </li>
                  </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-neutral/80 mb-1.5"
                    >
                      {t('leadModal_field_phone')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-primary-accent focus:ring-2 focus:ring-primary-accent/20 transition-all disabled:opacity-50"
                      placeholder={t('leadModal_placeholder_phone')}
                      autoComplete="tel"
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
                        <Link
                          to={`/${locale}/politica-privacidad`}
                          className="text-primary-accent hover:underline"
                          target="_blank"
                        >
                          {t('leadModal_consent_link')}
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
                    className="w-full py-4 bg-primary-accent text-white font-bold rounded-xl transition-all duration-300 hover:shadow-accent-glow hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 mt-2"
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
                    <p className="text-xs text-center text-neutral/50">
                      {t('leadModal_error_retry')}
                    </p>
                  )}
                </form>

                {/* Legal text */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-[10px] leading-relaxed text-neutral/40">
                    {t('leadModal_legal_text')}
                  </p>
                  <Link
                    to={`/${locale}/aviso-legal`}
                    className="inline-block mt-2 text-[10px] text-primary-accent/70 hover:text-primary-accent transition-colors"
                  >
                    {t('leadModal_legal_link')}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default LeadCaptureModal;
