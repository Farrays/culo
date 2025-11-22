import AnimateOnScroll from '../AnimateOnScroll';
import AnimatedCounter from '../AnimatedCounter';
import Breadcrumb, { BreadcrumbItem } from '../shared/Breadcrumb';

interface DancehallHeroSectionProps {
  t: (key: string) => string;
  breadcrumbItems: BreadcrumbItem[];
}

/**
 * Dancehall Hero Section - Main landing area
 * Includes: Title, subtitle, description, CTA buttons, key stats
 */
const DancehallHeroSection: React.FC<DancehallHeroSectionProps> = ({ t, breadcrumbItems }) => {
  return (
    <section
      id="dancehall-hero"
      className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="relative z-20 container mx-auto px-6">
        {/* Breadcrumb with Microdata */}
        <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

        <AnimateOnScroll>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text">
            {t('dhV3HeroTitle')}
          </h1>
          <p className="text-3xl md:text-4xl font-bold mb-4 holographic-text">
            {t('dhV3HeroSubtitle')}
          </p>
          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 mb-6 leading-relaxed">
            {t('dhV3HeroDesc')}
          </p>
          <p className="text-lg md:text-xl text-neutral/90 italic mb-12">{t('dhV3HeroLocation')}</p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            <div className="w-full sm:w-auto">
              <a
                href="#contact"
                className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center"
              >
                {t('dhV3CTA1')}
              </a>
              <p className="text-xs text-neutral/70 mt-2 text-center">{t('dhV3CTA1Subtext')}</p>
            </div>
            <div className="w-full sm:w-auto">
              <a
                href="#trial"
                className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center"
              >
                {t('dhV3CTA2')}
              </a>
              <p className="text-xs text-neutral/70 mt-2 text-center">{t('dhV3CTA2Subtext')}</p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="mt-16">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 max-w-4xl mx-auto">
              {/* 60 Minutes */}
              <AnimateOnScroll delay={0}>
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <svg
                      className="w-10 h-10 text-primary-accent"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <AnimatedCounter
                    target={60}
                    className="text-4xl md:text-5xl font-black mb-1 holographic-text"
                  />
                  <div className="text-sm md:text-base text-neutral/90 font-semibold">
                    {t('classMinutes')}
                  </div>
                </div>
              </AnimateOnScroll>

              {/* ~500 Calories */}
              <AnimateOnScroll delay={100}>
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <svg
                      className="w-10 h-10 text-primary-accent"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2c1.5 2.5 3 5.5 3 8.5 0 3.5-2.5 6.5-6 6.5s-6-3-6-6.5c0-3 1.5-6 3-8.5 0 3 1.5 5 3 5s3-2 3-5zm0 15c2.21 0 4-1.79 4-4 0-1.5-1-3.5-2-5-.5 1.5-1.5 2.5-2 2.5s-1.5-1-2-2.5c-1 1.5-2 3.5-2 5 0 2.21 1.79 4 4 4z" />
                    </svg>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl md:text-4xl font-black holographic-text">~</span>
                    <AnimatedCounter
                      target={500}
                      className="text-4xl md:text-5xl font-black holographic-text"
                    />
                  </div>
                  <div className="text-sm md:text-base text-neutral/90 font-semibold mt-1">
                    {t('caloriesBurned')}
                  </div>
                </div>
              </AnimateOnScroll>

              {/* 100% Fun */}
              <AnimateOnScroll delay={200}>
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <svg
                      className="w-10 h-10 text-primary-accent"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z" />
                    </svg>
                  </div>
                  <AnimatedCounter
                    target={100}
                    suffix="%"
                    className="text-4xl md:text-5xl font-black mb-1 holographic-text"
                  />
                  <div className="text-sm md:text-base text-neutral/90 font-semibold">
                    {t('funGuaranteed')}
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default DancehallHeroSection;
