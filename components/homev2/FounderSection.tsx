import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';

interface FounderSectionProps {
  config: typeof HOMEPAGE_V2_CONFIG.founder;
}

/**
 * FounderSection - Pattern Interrupt con Autoridad
 *
 * Estilo visual coherente con HappinessStory:
 * - Narrativa fluida con holographic-text
 * - Imagen con efectos de glow
 * - Quote destacada
 */
const FounderSection: React.FC<FounderSectionProps> = ({ config }) => {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;

  return (
    <section id="founder-section" className="relative py-12 md:py-16 bg-black text-neutral">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary-dark/10 to-black opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Imagen de Yunaisy */}
          <AnimateOnScroll>
            <div className="relative group">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-primary-dark/50 group-hover:border-primary-accent/50 transition-all duration-500">
                <img
                  src={config.image}
                  alt="Yunaisy Farray - Fundadora de Farray's International Dance Center"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {/* Decorativo - Glow accent */}
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-primary-accent/20 rounded-full blur-3xl group-hover:bg-primary-accent/30 transition-all duration-500" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-dark/30 rounded-full blur-2xl" />
            </div>
          </AnimateOnScroll>

          {/* Contenido narrativo - Estilo HappinessStory */}
          <div className="text-center lg:text-left">
            {/* Título holográfico */}
            <AnimateOnScroll delay={100}>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 holographic-text">
                {t(config.titleKey)}
              </h2>
            </AnimateOnScroll>

            {/* Párrafos de storytelling con estilos variados */}
            {config.paragraphs.map((paraKey, index) => (
              <AnimateOnScroll key={paraKey} delay={200 + index * 100}>
                <p
                  className={`leading-relaxed mb-6 ${
                    index === 0
                      ? 'text-xl md:text-2xl text-neutral'
                      : index === config.paragraphs.length - 1
                        ? 'text-lg md:text-xl font-bold text-neutral'
                        : 'text-lg md:text-xl text-neutral/90'
                  }`}
                >
                  {t(paraKey)}
                </p>
              </AnimateOnScroll>
            ))}

            {/* Quote destacada - Holográfica */}
            <AnimateOnScroll delay={500}>
              <blockquote className="my-10">
                <p className="text-2xl md:text-3xl holographic-text font-bold leading-relaxed">
                  &ldquo;{t(config.quoteKey)}&rdquo;
                </p>
                <footer className="mt-4 text-neutral/60 text-sm">— {config.quoteAuthor}</footer>
              </blockquote>
            </AnimateOnScroll>

            {/* CTA */}
            <AnimateOnScroll delay={600}>
              <Link
                to={`/${locale}${config.ctaHref}`}
                className="inline-flex items-center gap-2 font-bold text-primary-accent hover:text-white transition-all duration-300 group"
              >
                <span>{t(config.ctaTextKey)}</span>
                <span className="inline-block transition-all duration-300 group-hover:translate-x-2">
                  →
                </span>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
