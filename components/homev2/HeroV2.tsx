import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';
import LeadCaptureModal from '../shared/LeadCaptureModal';

interface HeroV2Props {
  config: typeof HOMEPAGE_V2_CONFIG.hero;
}

/**
 * HeroV2 - Above the fold con estilo coherente
 *
 * Soporte para:
 * - Video background (loop automático)
 * - Imagen de fallback
 * - Social proof inmediato
 * - CTAs prominentes
 * - Urgencia sutil
 */
const HeroV2: React.FC<HeroV2Props> = ({ config }) => {
  const { t, i18n } = useTranslation([
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
  const locale = i18n.language;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section
        className="relative h-screen w-full flex items-center justify-center overflow-hidden"
        aria-label="Hero section"
      >
        {/* Background - Video o Imagen */}
        <div className="absolute inset-0 bg-black" aria-hidden="true">
          {config.backgroundType === 'video' && config.backgroundVideo ? (
            <>
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                poster={config.backgroundImage}
              >
                <source src={config.backgroundVideo} type="video/mp4" />
              </video>
              {/* Overlay para legibilidad */}
              <div className="absolute inset-0 bg-black/50" />
            </>
          ) : (
            <>
              {config.backgroundImage && (
                <img
                  src={config.backgroundImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black" />
            </>
          )}
        </div>

        {/* Contenido */}
        <div className="relative z-10 text-center text-neutral px-6 max-w-5xl mx-auto">
          {/* Headline principal - Holographic */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-4 min-h-[120px] md:min-h-[180px] flex flex-col items-center justify-center text-white"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
          >
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

          {/* Urgencia sutil */}
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 backdrop-blur-sm rounded-full px-5 py-2 mb-8 border border-yellow-500/30">
            <span className="text-yellow-400 text-lg">🎁</span>
            <span className="text-neutral/90 text-sm md:text-base">{t('hero_urgency')}</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
            >
              {t(config.cta1.textKey)}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <Link
              to={`/${locale}/horarios-clases-baile-barcelona`}
              className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
            >
              {t('hero_cta_schedule')}
            </Link>
          </div>
        </div>
      </section>

      {/* Modal de captura de leads */}
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default HeroV2;
