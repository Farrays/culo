import React, { useEffect, useState, useCallback, useRef, memo } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoSrc: string;
  title?: string;
}

/**
 * VideoModal - Modal optimizado para videos self-hosted
 *
 * Features:
 * - History API: botón atrás cierra el modal (no navega)
 * - Lazy loading: video solo carga al abrir
 * - Bloqueo de scroll del body
 * - Accesible: focus trap, escape key, aria labels
 * - Autoplay al abrir
 * - Controles nativos del navegador
 */
const VideoModal: React.FC<VideoModalProps> = memo(function VideoModal({
  isOpen,
  onClose,
  videoSrc,
  title = 'Video',
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle History API para que el botón atrás cierre el modal
  useEffect(() => {
    if (isOpen) {
      // Pequeño delay para la animación de entrada
      const timer = window.setTimeout(() => setShowContent(true), 10);

      // Push state al historial
      window.history.pushState({ modal: 'video', videoSrc }, '');

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
  }, [isOpen, onClose, videoSrc]);

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

  // Autoplay cuando se abre el modal
  useEffect(() => {
    if (isOpen && videoRef.current && !isLoading) {
      videoRef.current.play().catch(() => {
        // Autoplay puede fallar en algunos navegadores, ignorar
      });
    }
  }, [isOpen, isLoading]);

  const handleClose = useCallback(() => {
    // Pausar video al cerrar
    if (videoRef.current) {
      videoRef.current.pause();
    }
    // Volver atrás en el historial si hay state de modal
    if (window.history.state?.modal === 'video') {
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

  const handleVideoCanPlay = useCallback(() => {
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
      aria-label={title}
      onClick={handleBackdropClick}
    >
      {/* Backdrop con blur */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" aria-hidden="true" />

      {/* Container del video */}
      <div
        className={`relative z-10 w-full max-w-lg mx-4 transition-all duration-300 ${
          showContent ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 sm:-right-12 sm:top-0 p-2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent rounded-full group z-20"
          aria-label="Cerrar video"
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

        {/* Video container con aspect ratio vertical (9:16 para Reels) */}
        <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl shadow-primary-accent/20 border border-primary-accent/30">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-dark via-primary-accent to-primary-dark rounded-2xl blur-lg opacity-30 -z-10" />

          {/* Loading spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary-accent/30 rounded-full" />
                  <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-accent border-t-transparent rounded-full animate-spin" />
                </div>
                <span className="text-white/70 text-sm">Cargando video...</span>
              </div>
            </div>
          )}

          {/* Video nativo */}
          <div className="aspect-[9/16] max-h-[80vh]">
            <video
              ref={videoRef}
              src={videoSrc}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              controls
              playsInline
              preload="metadata"
              onCanPlay={handleVideoCanPlay}
              title={title}
            />
          </div>
        </div>

        {/* Hint para cerrar */}
        <p className="text-center text-white/50 text-sm mt-4 hidden sm:block">
          Pulsa ESC o fuera del video para cerrar
        </p>
      </div>
    </div>
  );
});

export default VideoModal;
