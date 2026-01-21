import React, { useEffect, useRef, useCallback } from 'react';
import { XMarkIcon } from '../../lib/icons';
import { useI18n } from '../../hooks/useI18n';
import { Portal } from './components/Portal';
import { registerModalOpen, registerModalClose } from './utils/modalHistoryManager';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

/**
 * TermsModal - Modal de Términos y Condiciones
 * Muestra las condiciones de las clases de bienvenida
 * Includes browser history management for back button support
 */
const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const historyPushedRef = useRef(false);
  const isRegisteredRef = useRef(false); // Track if we've registered this modal

  // Store callbacks in refs to avoid effect re-runs when parent re-renders with filters
  const onCloseRef = useRef(onClose);
  const onAcceptRef = useRef(onAccept);
  onCloseRef.current = onClose;
  onAcceptRef.current = onAccept;

  // Close with history support - uses ref for stable reference
  const handleClose = useCallback(() => {
    if (historyPushedRef.current) {
      window.history.back();
    } else {
      onCloseRef.current();
    }
  }, []);

  // Accept and close - triggers checkbox check - uses ref for stable reference
  const handleAccept = useCallback(() => {
    onAcceptRef.current?.();
    handleClose();
  }, [handleClose]);

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
      window.history.pushState({ modal: 'terms', bookingStep: 'form', bookingWidget: true }, '');
      historyPushedRef.current = true;
    }

    // Handle browser back button
    // IMPORTANT: Don't unregister here - let cleanup handle it
    // This prevents race condition with BookingWidgetV2's popstate handler
    const handlePopState = () => {
      historyPushedRef.current = false;
      // Just close using ref - the effect cleanup will handle unregistration
      onCloseRef.current();
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
  }, [isOpen, handleClose]); // Removed onClose - using ref instead for stable reference

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen) return null;

  const terms = [
    t('terms_item_1'),
    t('terms_item_2'),
    t('terms_item_3'),
    t('terms_item_4'),
    t('terms_item_5'),
    t('terms_item_6'),
  ];

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        <div
          ref={modalRef}
          className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-black rounded-2xl border border-white/10 shadow-2xl animate-scaleIn"
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-black border-b border-white/10">
            <h2 id="terms-modal-title" className="text-lg font-bold text-neutral">
              {t('terms_modal_title')}
            </h2>
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
            <ul className="space-y-3">
              {terms.map((term, index) => (
                <li key={index} className="flex gap-3 text-sm text-neutral/80">
                  <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-primary-accent/20 text-primary-accent text-xs">
                    ✓
                  </span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>

            {/* Contact info */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-neutral/60">
                {t('terms_contact_info')}{' '}
                <span className="text-neutral/80 select-all">info@farrayscenter.com</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 p-4 bg-black border-t border-white/10">
            <button
              onClick={handleAccept}
              className="w-full py-3 px-4 bg-primary-accent hover:bg-primary-accent/90 text-white font-semibold rounded-xl transition-colors"
            >
              {t('terms_understood')}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default TermsModal;
