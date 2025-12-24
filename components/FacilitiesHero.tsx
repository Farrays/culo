import React from 'react';
import AnimateOnScroll from './AnimateOnScroll';

interface FacilitiesHeroProps {
  t: (key: string) => string;
  locale: string;
}

const FacilitiesHero: React.FC<FacilitiesHeroProps> = ({ t, locale: _locale }) => {
  return (
    <section
      id="facilities-hero"
      className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="relative z-20 container mx-auto px-6">
        <AnimateOnScroll>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text">
            {t('facilitiesHeroTitle')}
          </h1>
          <p className="text-3xl md:text-4xl font-bold mb-4 holographic-text">
            {t('facilitiesHeroSubtitle')}
          </p>
          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 mb-6 leading-relaxed">
            {t('facilitiesHeroDesc')}
          </p>
          <p className="text-lg md:text-xl text-neutral/90 italic mb-12">
            {t('facilitiesHeroLocation')}
          </p>

          {/* CTA Button - Solicitar un Tour */}
          <div className="flex justify-center mt-10">
            <a
              href="#tour"
              className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
            >
              {t('solicitarTour')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default FacilitiesHero;
