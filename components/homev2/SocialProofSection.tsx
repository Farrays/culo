import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';

interface SocialProofSectionProps {
  config: typeof HOMEPAGE_V2_CONFIG.socialProof;
}

/**
 * SocialProofSection - Testimonios y Credenciales
 *
 * Elementos:
 * - Stats bar (estudiantes, años, estilos, m²)
 * - Google Reviews badge prominente
 * - Logos de apariciones (Got Talent, etc.)
 */
const SocialProofSection: React.FC<SocialProofSectionProps> = ({ config }) => {
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

  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-12">
            {t(config.titleKey)}
          </h2>
        </AnimateOnScroll>

        {/* Stats Bar */}
        <AnimateOnScroll delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {config.stats.map(stat => (
              <div
                key={stat.labelKey}
                className="text-center p-6 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="text-3xl md:text-4xl font-black text-primary-accent mb-2">
                  {stat.value}
                </div>
                <div className="text-white/60 text-sm">{t(stat.labelKey)}</div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Google Reviews Badge */}
        <AnimateOnScroll delay={200}>
          <div className="flex justify-center mb-16">
            <a
              href="https://g.page/r/CWgdDe92LVnmEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/10 hover:border-primary-accent/50 transition-all duration-300"
            >
              {/* Google Logo */}
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full">
                <svg className="w-10 h-10" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </div>

              {/* Rating y Reviews */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {/* Estrellas */}
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-white">
                    {config.googleReviews.rating}
                  </span>
                </div>
                <div className="text-white/60">
                  <span className="font-semibold text-white">{config.googleReviews.count}</span>{' '}
                  {t(config.googleReviews.linkKey)}
                </div>
              </div>

              {/* Arrow */}
              <svg
                className="w-6 h-6 text-white/40 group-hover:text-primary-accent group-hover:translate-x-1 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </AnimateOnScroll>

        {/* Logos de apariciones */}
        <AnimateOnScroll delay={300}>
          <div className="text-center">
            <p className="text-white/40 text-sm uppercase tracking-wider mb-6">Apariciones en</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {config.logos.map(logo => (
                <div
                  key={logo.name}
                  className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                >
                  <img
                    src={logo.src}
                    alt={logo.name}
                    className="h-10 md:h-12 w-auto object-contain"
                    loading="lazy"
                    onError={e => {
                      // Fallback a texto si la imagen no carga
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML = `<span class="text-white/60 font-medium">${logo.name}</span>`;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default SocialProofSection;
