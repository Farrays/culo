import React, { useEffect, useRef, useCallback } from 'react';
import { XMarkIcon, ShieldCheckIcon } from '../../lib/icons';
import { useI18n } from '../../hooks/useI18n';
import { Portal } from './components/Portal';
import { registerModalOpen, registerModalClose } from './utils/modalHistoryManager';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

/**
 * PrivacyModal - Modal de Política de Privacidad
 * Muestra información RGPD/LOPDGDD resumida
 * El enlace a la política completa NO es clicable para evitar que salgan del widget
 * Includes browser history management for back button support
 */
const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onAccept }) => {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const historyPushedRef = useRef(false);
  const isRegisteredRef = useRef(false); // Track if we've registered this modal

  // Close with history support
  const handleClose = useCallback(() => {
    if (historyPushedRef.current) {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);

  // Accept and close - triggers checkbox check
  const handleAccept = useCallback(() => {
    onAccept?.();
    handleClose();
  }, [onAccept, handleClose]);

  // Handle escape key, body scroll lock, and history management
  useEffect(() => {
    if (!isOpen) {
      historyPushedRef.current = false;
      isRegisteredRef.current = false;
      return;
    }

    // Register modal as open (reference counting) - only once
    if (!isRegisteredRef.current) {
      registerModalOpen();
      isRegisteredRef.current = true;
    }

    // Push history state for modal (only once per open)
    if (!historyPushedRef.current) {
      window.history.pushState({ modal: 'privacy', bookingStep: 'form', bookingWidget: true }, '');
      historyPushedRef.current = true;
    }

    // Handle browser back button
    // IMPORTANT: Don't unregister here - let cleanup handle it
    // This prevents race condition with BookingWidgetV2's popstate handler
    const handlePopState = () => {
      historyPushedRef.current = false;
      // Just close - the effect cleanup will handle unregistration
      onClose();
    };
    window.addEventListener('popstate', handlePopState);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('popstate', handlePopState);
      // Only unregister in cleanup if still registered (not done by popstate)
      if (isRegisteredRef.current) {
        registerModalClose();
        isRegisteredRef.current = false;
      }
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handleClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
      >
        <div
          ref={modalRef}
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-black rounded-2xl border border-white/10 shadow-2xl animate-scaleIn"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-black border-b border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-primary-accent" />
              <h2 id="privacy-modal-title" className="text-lg font-bold text-neutral">
                {t('privacy_modal_title')}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label={t('close')}
            >
              <XMarkIcon className="w-5 h-5 text-neutral/60" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Data Controllers */}
            <section>
              <h3 className="text-sm font-semibold text-neutral mb-1.5">
                {t('privacy_data_controller')}
              </h3>
              <p className="text-sm text-neutral/70 leading-relaxed">
                {t('privacy_data_controller_text')}
              </p>
            </section>

            {/* Data Collected */}
            <section>
              <h3 className="text-sm font-semibold text-neutral mb-1.5">
                {t('privacy_data_collected')}
              </h3>
              <p className="text-sm text-neutral/70 leading-relaxed">
                {t('privacy_data_collected_text')}
              </p>
            </section>

            {/* Purposes */}
            <section>
              <h3 className="text-sm font-semibold text-neutral mb-1.5">{t('privacy_purposes')}</h3>
              <p className="text-sm text-neutral/70 leading-relaxed">
                {t('privacy_purposes_text')}
              </p>
            </section>

            {/* Image Rights */}
            <section>
              <h3 className="text-sm font-semibold text-neutral mb-1.5">
                {t('privacy_image_rights')}
              </h3>
              <p className="text-sm text-neutral/70 leading-relaxed">
                {t('privacy_image_rights_text')}
              </p>
            </section>

            {/* User Rights */}
            <section>
              <h3 className="text-sm font-semibold text-neutral mb-1.5">
                {t('privacy_user_rights')}
              </h3>
              <p className="text-sm text-neutral/70 leading-relaxed">
                {t('privacy_user_rights_text')}
              </p>
            </section>

            {/* Full Policy URL - NOT clickable */}
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-neutral/50 mb-1">{t('privacy_full_policy_url')}</p>
              <p className="text-xs text-neutral/70 font-mono break-all select-all">
                {t('privacy_full_policy_link')}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 p-4 bg-black border-t border-white/10">
            <button
              onClick={handleAccept}
              className="w-full py-3 px-4 bg-primary-accent hover:bg-primary-accent/90 text-white font-semibold rounded-xl transition-colors"
            >
              {t('privacy_understood')}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default PrivacyModal;
