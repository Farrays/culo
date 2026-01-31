import { useEffect, memo } from 'react';

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
 * MomenceModal - Abre Momence en popup centrado
 *
 * Momence bloquea iframes (X-Frame-Options) en dominios no whitelisteados.
 * Usamos popup centrado para una experiencia más "modal-like".
 *
 * TODO: Cuando Momence whitelist el dominio, restaurar iframe.
 */
const MomenceModal: React.FC<MomenceModalProps> = memo(function MomenceModal({
  isOpen,
  onClose,
  url,
}) {
  // Cuando se abre, abrir popup centrado
  useEffect(() => {
    if (isOpen && url) {
      // Calcular dimensiones del popup (80% de la pantalla)
      const width = Math.min(1200, window.innerWidth * 0.9);
      const height = Math.min(800, window.innerHeight * 0.9);
      const left = (window.innerWidth - width) / 2 + window.screenX;
      const top = (window.innerHeight - height) / 2 + window.screenY;

      // Abrir popup centrado
      const popup = window.open(
        url,
        'MomenceCheckout',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      // Focus en el popup
      if (popup) {
        popup.focus();
      }

      // Cerrar el estado del modal
      onClose();
    }
  }, [isOpen, url, onClose]);

  // No renderiza nada - solo abre popup
  return null;
});

export default MomenceModal;
