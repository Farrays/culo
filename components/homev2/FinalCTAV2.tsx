import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';

interface FinalCTAV2Props {
  config: typeof HOMEPAGE_V2_CONFIG.finalCta;
}

/**
 * FinalCTAV2 - CTA Final Emotivo
 *
 * Estilo coherente con FinalCTA actual:
 * - Background stardust
 * - Holographic text
 * - Botones con animate-glow
 */
const FinalCTAV2: React.FC<FinalCTAV2Props> = ({ config }) => {
  const { t, locale } = useI18n();

  return (
    <section id="final-cta" className="relative py-12 md:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black" />
      </div>

      {/* Contenido */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        {/* Título holográfico */}
        <AnimateOnScroll>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 holographic-text">
            {t(config.titleLine1Key)}
          </h2>
        </AnimateOnScroll>

        {/* Subtítulos con variación de estilos */}
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <AnimateOnScroll delay={100}>
            <p className="text-lg md:text-xl text-neutral/90">{t(config.subtitleLine1Key)}</p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="text-xl md:text-2xl font-bold text-neutral">
              {t(config.subtitleLine2Key)}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={300}>
            <p className="text-2xl md:text-3xl font-bold holographic-text">
              {t(config.subtitleLine3Key)}
            </p>
          </AnimateOnScroll>
        </div>

        {/* CTAs */}
        <AnimateOnScroll delay={400}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* CTA Primario */}
            <Link
              to={`/${locale}${config.cta1Href}`}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
            >
              {t(config.cta1TextKey)}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            {/* CTA Secundario */}
            <Link
              to={`/${locale}${config.cta2Href}`}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
            >
              {t(config.cta2TextKey)}
            </Link>
          </div>
        </AnimateOnScroll>

        {/* Trust line */}
        <AnimateOnScroll delay={500}>
          <p className="mt-8 text-neutral/50 text-sm">{t(config.trustLineKey)}</p>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default FinalCTAV2;
