import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '../../lib/icons';
import { useI18n } from '../../hooks/useI18n';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * TermsModal - Modal de Términos y Condiciones
 * Muestra las condiciones de las clases de bienvenida
 */
const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl animate-scaleIn"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-white/10">
          <h2 id="terms-modal-title" className="text-lg font-bold text-neutral">
            {t('terms_modal_title')}
          </h2>
          <button
            onClick={onClose}
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
        <div className="sticky bottom-0 p-4 bg-[#1a1a1a] border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary-accent hover:bg-primary-accent/90 text-white font-semibold rounded-xl transition-colors"
          >
            {t('terms_understood')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
