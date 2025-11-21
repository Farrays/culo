import { useState, useEffect } from 'react';
import { useI18n } from '../hooks/useI18n';
import { debounce } from '../utils/debounce';

const BackToTop: React.FC = () => {
  const { t } = useI18n();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Mostrar el botón después de hacer scroll 300px
      setIsVisible(window.scrollY > 300);
    };

    const debouncedToggle = debounce(toggleVisibility, 150); // 150ms debounce for better performance

    window.addEventListener('scroll', debouncedToggle);

    return () => {
      window.removeEventListener('scroll', debouncedToggle);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-40 bg-primary-accent text-white p-2 rounded-full shadow-lg hover:shadow-accent-glow transition-all duration-300 transform hover:scale-110 animate-glow ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
      }`}
      aria-label={t('backToTop') || 'Volver arriba'}
      title={t('backToTop') || 'Volver arriba'}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default BackToTop;
