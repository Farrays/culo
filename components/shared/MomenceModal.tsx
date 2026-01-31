import React, { useEffect, useState, useCallback, memo } from 'react';

// URLs de Momence
const MOMENCE_BASE = 'https://momence.com';
const MOMENCE_HOST = "Farray's-International-Dance-Center";
export const MOMENCE_SIGN_IN = `${MOMENCE_BASE}/sign-in?hostId=36148`;

// Helper para generar deeplinks de clases
export const getClassDeeplink = (className: string, sessionId: number): string =>
  `${MOMENCE_BASE}/${MOMENCE_HOST}/${encodeURIComponent(className)}/${sessionId}?skipPreview=true`;

interface MomenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

/**
 * MomenceModal - Modal con iframe de Momence
 *
 * Features:
 * - iframe fullscreen dentro del modal
 * - URL dinámica (sign-in O deeplink de clase)
 * - History API (back button cierra modal)
 * - Escape key para cerrar
 * - Scroll lock mientras está abierto
 * - Loading spinner mientras carga el iframe
 */
const MomenceModal: React.FC<MomenceModalProps> = memo(function MomenceModal({
  isOpen,
  onClose,
  url,
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Handle History API para que el botón atrás cierre el modal
  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para la animación de entrada
      const timer = window.setTimeout(() => setShowContent(true), 10);

      // Push state al historial
      window.history.pushState({ modal: 'momence', url }, '');

      const handlePopState = () => {
        onClose();
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.clearTimeout(timer);
        window.removeEventListener('popstate', handlePopState);
      };
    } else {
      setShowContent(false);
      setIsLoading(true);
      return undefined;
    }
  }, [isOpen, onClose, url]);

  // Bloquear scroll del body cuando el modal está abierto
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

  // Cerrar con tecla Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = useCallback(() => {
    // Volver atrás en el historial si hay state de modal
    if (window.history.state?.modal === 'momence') {
      window.history.back();
    }
    onClose();
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
        showContent ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Momence"
      onClick={handleBackdropClick}
    >
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" aria-hidden="true" />

      {/* Container del iframe */}
      <div
        className={`relative z-10 w-full h-full max-w-5xl max-h-[90vh] mx-4 my-4 transition-all duration-300 ${
          showContent ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute -top-2 -right-2 sm:-right-12 sm:top-0 p-2 bg-black/50 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent rounded-full group z-20"
          aria-label="Cerrar"
        >
          <svg
            className="w-8 h-8 transition-transform group-hover:rotate-90 duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* iframe container */}
        <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl shadow-primary-accent/20 border border-primary-accent/30">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-dark via-primary-accent to-primary-dark rounded-2xl blur-lg opacity-30 -z-10" />

          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary-accent/30 rounded-full" />
                  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-accent border-t-transparent rounded-full animate-spin" />
                </div>
                <span className="text-neutral-600 text-sm">Cargando Momence...</span>
              </div>
            </div>
          )}

          {/* iframe de Momence */}
          <iframe
            src={url}
            className={`w-full h-full transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleIframeLoad}
            title="Momence"
            allow="payment"
          />
        </div>

        {/* Hint para cerrar - solo en desktop */}
        <p className="text-center text-white/50 text-sm mt-4 hidden sm:block">
          Pulsa ESC o fuera del modal para cerrar
        </p>
      </div>
    </div>
  );
});

export default MomenceModal;
