import React, { useEffect, useRef } from 'react';
import { XMarkIcon, ShieldCheckIcon } from '../../lib/icons';
import { useI18n } from '../../hooks/useI18n';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * PrivacyModal - Modal de Política de Privacidad
 * Muestra información RGPD/LOPDGDD resumida
 * El enlace a la política completa NO es clicable para evitar que salgan del widget
 */
const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#1a1a1a] rounded-2xl border border-white/10 shadow-2xl animate-scaleIn"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#1a1a1a] border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-primary-accent" />
            <h2 id="privacy-modal-title" className="text-lg font-bold text-neutral">
              {t('privacy_modal_title')}
            </h2>
          </div>
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
            <p className="text-sm text-neutral/70 leading-relaxed">{t('privacy_purposes_text')}</p>
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
        <div className="sticky bottom-0 p-4 bg-[#1a1a1a] border-t border-white/10">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-primary-accent hover:bg-primary-accent/90 text-white font-semibold rounded-xl transition-colors"
          >
            {t('privacy_understood')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
