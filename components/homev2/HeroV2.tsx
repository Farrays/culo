import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';

interface HeroV2Props {
  config: typeof HOMEPAGE_V2_CONFIG.hero;
}

/**
 * HeroV2 - Above the fold con estilo coherente
 *
 * Usa el mismo estilo visual que el Hero actual:
 * - Stardust texture background
 * - Holographic text
 * - Botón con animate-glow
 */
const HeroV2: React.FC<HeroV2Props> = ({ config }) => {
  const { t, locale } = useI18n();

  return (
    <section
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background con textura stardust */}
      <div className="absolute inset-0 bg-black" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center text-neutral px-6 max-w-5xl mx-auto">
        {/* Headline principal - Holographic */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-4 min-h-[120px] md:min-h-[180px] flex flex-col items-center justify-center holographic-text">
          {t(config.headlineKey)}
          <br />
          <span className="text-3xl md:text-5xl lg:text-6xl opacity-90 font-bold tracking-normal">
            {t(config.subheadlineKey)}
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl font-semibold text-neutral/90 mb-6 italic">
          {t(config.taglineKey)}
        </p>

        {/* Value proposition */}
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-neutral/90 mb-8">
          {t(config.valuePropositionKey)}
        </p>

        {/* Social proof badge inline */}
        <div className="inline-flex items-center gap-3 bg-neutral/10 backdrop-blur-sm rounded-full px-6 py-3 mb-10 border border-primary-accent/30">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-neutral font-bold">{config.socialProof.rating}</span>
          <span className="text-neutral/70">•</span>
          <span className="text-neutral/80">
            {config.socialProof.reviewCount}+ opiniones en Google
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={`/${locale}${config.cta1.href}`}
            className="w-full sm:w-auto bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
          >
            {t(config.cta1.textKey)}
          </Link>
          <button
            onClick={() => {
              const element = document.querySelector('#comparison-section');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
          >
            {t(config.cta2.textKey)}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#founder-section"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 text-neutral/70 animate-subtle-bob hover:text-neutral transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent/50 rounded-lg p-2"
      >
        <span>{t('heroScroll')}</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
};

export default HeroV2;
