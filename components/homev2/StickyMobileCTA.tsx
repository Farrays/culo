import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LeadCaptureModal from '../shared/LeadCaptureModal';

/**
 * StickyMobileCTA - CTA Fijo en Móvil
 *
 * Barra fija en la parte inferior de la pantalla (solo móvil)
 * que aparece después de hacer scroll pasando el hero.
 */
const StickyMobileCTA: React.FC = () => {
  const { t } = useTranslation(['common']);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar después de pasar el hero (aproximadamente 100vh)
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsVisible(scrollY > heroHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Sticky CTA - Solo visible en móvil */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        {/* Solid background - no backdrop-blur for better mobile performance */}
        <div className="absolute inset-0 bg-black/95" />

        {/* Content */}
        <div className="relative px-4 py-3 safe-area-inset-bottom">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-primary-accent text-white font-bold text-lg py-4 px-6 rounded-full transition-colors duration-200 shadow-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {t('sticky_cta')}
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-2 text-neutral/70 text-xs">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {t('sticky_trust1')}
            </span>
            <span className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              4.9/5
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default StickyMobileCTA;
