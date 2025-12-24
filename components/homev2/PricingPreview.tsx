import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';

interface PricingPreviewProps {
  config: typeof HOMEPAGE_V2_CONFIG.pricingPreview;
}

/**
 * PricingPreview - Transparencia de Precios + Urgencia Suave
 *
 * Propósito: Reducir fricción mostrando precios,
 * crear urgencia sin ser agresivo.
 */
const PricingPreview: React.FC<PricingPreviewProps> = ({ config }) => {
  const { t, locale } = useI18n();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t(config.titleKey)}</h2>
            <p className="text-white/60 text-lg">{t(config.subtitleKey)}</p>
          </div>
        </AnimateOnScroll>

        {/* Highlights de precios */}
        <AnimateOnScroll delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {config.highlights.map((highlight, index) => (
              <div
                key={highlight.priceKey}
                className={`text-center p-6 rounded-xl border ${
                  index === 1
                    ? 'bg-primary-accent/10 border-primary-accent/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div
                  className={`text-3xl md:text-4xl font-black mb-2 ${
                    index === 1 ? 'text-primary-accent' : 'text-white'
                  }`}
                >
                  {t(highlight.priceKey)}
                </div>
                <div className="text-white/60 text-sm">{t(highlight.descKey)}</div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Urgencia suave */}
        <AnimateOnScroll delay={200}>
          <div className="text-center mb-8">
            <p className="text-white/70 text-base italic">{t(config.urgencyKey)}</p>
          </div>
        </AnimateOnScroll>

        {/* CTAs */}
        <AnimateOnScroll delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* CTA Primario */}
            <Link
              to={`/${locale}${config.ctaHref}`}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-primary-accent rounded-full hover:scale-105 transition-all duration-300 animate-glow"
            >
              {t(config.ctaTextKey)}
            </Link>

            {/* CTA Secundario */}
            <Link
              to={`/${locale}${config.secondaryHref}`}
              className="inline-flex items-center justify-center px-6 py-4 text-white/80 border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              {t(config.secondaryCtaKey)}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default PricingPreview;
