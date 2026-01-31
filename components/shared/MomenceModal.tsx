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
 * MomenceModal - Abre Momence en nueva pestaña
 *
 * Momence bloquea iframes por seguridad (X-Frame-Options).
 * Abrimos en nueva pestaña para mejor compatibilidad.
 */
const MomenceModal: React.FC<MomenceModalProps> = memo(function MomenceModal({
  isOpen,
  onClose,
  url,
}) {
  // Cuando se abre, redirigir a Momence en nueva pestaña
  useEffect(() => {
    if (isOpen && url) {
      // Abrir en nueva pestaña
      window.open(url, '_blank', 'noopener,noreferrer');
      // Cerrar el "modal" inmediatamente
      onClose();
    }
  }, [isOpen, url, onClose]);

  // No renderiza nada - solo abre en nueva pestaña
  return null;
});

export default MomenceModal;
