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
  acceptsMarketing: boolean;
}

interface DancehallLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// API route en Vercel - el token esta seguro en el servidor
const LEAD_API_URL = '/api/lead';

// Source ID específico para Dancehall Landing (para tracking en Momence)
const DANCEHALL_SOURCE_ID = 127831;

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * DancehallLeadModal - Modal específico para captación de leads de Dancehall
 *
 * Simplificado para la landing de Facebook Ads:
 * - Solo pide nombre, email y teléfono
 * - Pre-configura estilo=Dancehall y discovery=Facebook
 * - Mensajes específicos para clase de bienvenida de Dancehall
 * - Source ID 127831 para tracking
 */
const DancehallLeadModal: React.FC<DancehallLeadModalProps> = memo(function DancehallLeadModal({
  isOpen,
  onClose,
}) {
  const { t, locale } = useI18n();

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

  // Refs
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const historyPushedRef = useRef(false);

  // ============================================================================
  // HISTORY API - Para que el boton atras cierre el modal
  // ============================================================================

  useEffect(() => {
    if (isOpen) {
      window.history.pushState({ modal: 'dancehall-lead' }, '');
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
  }, [isOpen, onClose]);

  // ============================================================================
  // ANIMACION Y FOCUS
  // ============================================================================

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
      }, 300);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isOpen]);

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
  // HANDLERS
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
      setErrorMessage(t('dhLeadModal_error_firstName'));
      return false;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage(t('dhLeadModal_error_lastName'));
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage(t('dhLeadModal_error_email'));
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      setErrorMessage(t('dhLeadModal_error_phone'));
      return false;
    }
    if (!formData.acceptsMarketing) {
      setErrorMessage(t('dhLeadModal_error_consent'));
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
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        discoveryAnswer: 'Facebook',
        estilo: 'Dancehall',
        acceptsMarketing: formData.acceptsMarketing,
        url: window.location.href,
        sourceId: DANCEHALL_SOURCE_ID,
      };

      // En desarrollo local, simular exito
      if (import.meta.env.DEV) {
        console.warn('[DEV] Dancehall Lead form data:', payload);
        await new Promise(resolve => window.setTimeout(resolve, 1000));
        setStatus('success');

        // Track Facebook conversion
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {
            content_name: 'Dancehall Free Welcome Class',
            content_category: 'Dance Class',
            value: 0,
            currency: 'EUR',
          });
        }
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

        // Track Facebook conversion solo para leads nuevos
        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Lead', {
            content_name: 'Dancehall Free Welcome Class',
            content_category: 'Dance Class',
            value: 0,
            currency: 'EUR',
          });
        }
      }
    } catch (err) {
      console.error('Lead submission error:', err);
      setStatus('error');
      setErrorMessage(t('dhLeadModal_error_generic'));
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
      aria-labelledby="dancehall-lead-modal-title"
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
        {/* Glow effect - rose theme for Dancehall */}
        <div
          className="hidden md:block absolute -inset-1 bg-gradient-to-r from-rose-600 via-pink-500 to-rose-600 rounded-3xl blur-xl opacity-30 -z-10"
          aria-hidden="true"
        />

        {/* Modal Content */}
        <div className="relative bg-black md:bg-black/95 md:backdrop-blur-xl border-t md:border border-rose-500/30 md:rounded-3xl overflow-hidden shadow-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
          {/* Decorative top line - rose theme */}
          <div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"
            aria-hidden="true"
          />

          {/* Header */}
          <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-white/10 px-6 py-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2 id="dancehall-lead-modal-title" className="text-xl font-black text-neutral">
                  {status === 'success' || status === 'success_existing'
                    ? t('dhLeadModal_success_title')
                    : t('dhLeadModal_title')}
                </h2>
                {status !== 'success' && status !== 'success_existing' && (
                  <p className="text-sm text-neutral/70 mt-1">{t('dhLeadModal_subtitle')}</p>
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
              /* SUCCESS STATE */
              <div className="text-center py-4">
                {/* Success icon */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div
                      className="absolute inset-0 bg-rose-500/30 rounded-full blur-xl motion-reduce:blur-none"
                      aria-hidden="true"
                    />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-rose-600 to-pink-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-black text-neutral mb-4">
                  {status === 'success_existing'
                    ? t('dhLeadModal_existing_heading')
                    : t('dhLeadModal_success_heading')}
                </h3>

                {status === 'success_existing' ? (
                  /* Mensaje para leads duplicados */
                  <>
                    <p className="text-lg text-neutral/90 mb-2">
                      {t('dhLeadModal_existing_message')}
                    </p>
                    <p className="text-sm text-neutral/70 mb-6">
                      {t('dhLeadModal_existing_contact')}
                    </p>
                  </>
                ) : (
                  /* Mensaje para leads nuevos */
                  <>
                    <p className="text-lg text-neutral/90 mb-2">
                      {t('dhLeadModal_success_message')}
                    </p>
                    <p className="text-sm text-neutral/70 mb-6">
                      {t('dhLeadModal_success_check_email')}
                    </p>
                  </>
                )}

                {/* What happens next - solo para nuevos leads */}
                {status === 'success' && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6 text-left">
                    <p className="text-sm font-semibold text-neutral mb-3">
                      {t('dhLeadModal_success_next_title')}
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-neutral/80">
                        <CheckCircleIcon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{t('dhLeadModal_success_next_1')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-neutral/80">
                        <CheckCircleIcon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{t('dhLeadModal_success_next_2')}</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-neutral/80">
                        <CheckCircleIcon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{t('dhLeadModal_success_next_3')}</span>
                      </li>
                    </ul>
                  </div>
                )}

                <p className="text-xs text-neutral/50 mb-4">{t('dhLeadModal_success_spam_note')}</p>

                <button
                  onClick={handleClose}
                  className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-xl transition-colors"
                >
                  {t('dhLeadModal_success_close')}
                </button>
              </div>
            ) : !hasMicroCommitment ? (
              /* MICRO COMMITMENT STEP */
              <div className="text-center py-4">
                <p className="text-lg font-semibold text-neutral mb-6">
                  {t('dhLeadModal_microCommit_question')}
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setHasMicroCommitment(true)}
                    className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02]"
                  >
                    {t('dhLeadModal_microCommit_yes')}
                  </button>
                  <button
                    onClick={() => setHasMicroCommitment(true)}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 text-neutral/70 font-medium rounded-xl transition-all border border-white/10"
                  >
                    {t('dhLeadModal_microCommit_curious')}
                  </button>
                </div>
              </div>
            ) : (
              /* FORM STATE */
              <>
                {/* Intro */}
                <p className="text-neutral/70 text-sm mb-6">{t('dhLeadModal_intro')}</p>

                {/* Benefits */}
                <div className="bg-rose-500/10 rounded-xl p-4 mb-6 border border-rose-500/20">
                  <p className="text-sm font-semibold text-neutral mb-3">
                    {t('dhLeadModal_benefits_title')}
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{t('dhLeadModal_benefit1')}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{t('dhLeadModal_benefit3')}</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{t('dhLeadModal_benefit4')}</span>
                    </li>
                  </ul>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="dh-firstName"
                        className="block text-sm font-medium text-neutral/80 mb-1.5"
                      >
                        {t('dhLeadModal_field_firstName')} <span className="text-rose-400">*</span>
                      </label>
                      <input
                        ref={firstInputRef}
                        type="text"
                        id="dh-firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all disabled:opacity-50"
                        placeholder={t('dhLeadModal_placeholder_firstName')}
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="dh-lastName"
                        className="block text-sm font-medium text-neutral/80 mb-1.5"
                      >
                        {t('dhLeadModal_field_lastName')} <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="dh-lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={status === 'loading'}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all disabled:opacity-50"
                        placeholder={t('dhLeadModal_placeholder_lastName')}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="dh-email"
                      className="block text-sm font-medium text-neutral/80 mb-1.5"
                    >
                      {t('dhLeadModal_field_email')} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      id="dh-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all disabled:opacity-50"
                      placeholder={t('dhLeadModal_placeholder_email')}
                      autoComplete="email"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="dh-phoneNumber"
                      className="block text-sm font-medium text-neutral/80 mb-1.5"
                    >
                      {t('dhLeadModal_field_phone')} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      id="dh-phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      disabled={status === 'loading'}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-neutral placeholder-neutral/40 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all disabled:opacity-50"
                      placeholder={t('dhLeadModal_placeholder_phone')}
                      autoComplete="tel"
                    />
                  </div>

                  {/* RGPD Consent */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          id="dh-acceptsMarketing"
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
                        <div className="w-5 h-5 border-2 border-white/30 rounded bg-white/5 peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all peer-focus:ring-2 peer-focus:ring-rose-500/50 group-hover:border-white/50">
                          <CheckIcon className="w-full h-full text-white opacity-0 peer-checked:opacity-100 p-0.5" />
                        </div>
                        <CheckIcon className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 p-0.5 pointer-events-none" />
                      </div>
                      <span className="text-sm text-neutral/70 leading-tight">
                        {t('dhLeadModal_consent_text')}{' '}
                        <Link
                          to={`/${locale}/politica-privacidad`}
                          className="text-rose-400 hover:underline"
                          target="_blank"
                        >
                          {t('dhLeadModal_consent_link')}
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
                    className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/30 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 mt-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                          aria-hidden="true"
                        />
                        <span>{t('dhLeadModal_sending')}</span>
                      </>
                    ) : (
                      <span>{t('dhLeadModal_submit')}</span>
                    )}
                  </button>
                </form>

                {/* Legal text */}
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-[10px] leading-relaxed text-neutral/40">
                    {t('dhLeadModal_legal_text')}
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

export default DancehallLeadModal;
