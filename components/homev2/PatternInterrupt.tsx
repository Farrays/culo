import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';

interface PatternInterruptProps {
  textKey: string;
  variant?: 'subtle' | 'bold' | 'holographic';
}

/**
 * PatternInterrupt - Frases cortas entre secciones
 *
 * Propósito: Mantener engagement durante el scroll,
 * romper el "piloto automático" del usuario
 *
 * Variantes:
 * - subtle: Texto suave, sin fondo destacado
 * - bold: Texto en negrita con fondo
 * - holographic: Efecto holográfico (glow rosa)
 */
const PatternInterrupt: React.FC<PatternInterruptProps> = ({ textKey, variant = 'subtle' }) => {
  const { t } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);
  const text = t(textKey);

  // Si no hay traducción, no renderizar
  if (!text || text === textKey) {
    return null;
  }

  const baseClasses = 'py-12 md:py-16 px-4';

  const variantClasses = {
    subtle: 'bg-transparent',
    bold: 'bg-black/50',
    holographic: 'bg-gradient-to-r from-black via-gray-900 to-black',
  };

  const textClasses = {
    subtle: 'text-white/60 text-base md:text-lg font-light',
    bold: 'text-white text-lg md:text-xl font-medium',
    holographic: 'holographic-text text-lg md:text-xl font-semibold',
  };

  return (
    <section className={`${baseClasses} ${variantClasses[variant]}`}>
      <AnimateOnScroll>
        <div className="max-w-3xl mx-auto text-center">
          <p className={textClasses[variant]}>
            {text.split('\n').map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      </AnimateOnScroll>
    </section>
  );
};

export default PatternInterrupt;
