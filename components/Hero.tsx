import React from 'react';
import { useI18n } from '../hooks/useI18n';

const Hero: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="relative z-10 text-center text-neutral px-4">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-4 min-h-[120px] md:min-h-[180px] lg:min-h-[200px] flex flex-col items-center justify-center holographic-text">
          {t('heroTitle1')}
          <br />
          <span className="text-3xl md:text-5xl lg:text-6xl opacity-90 font-bold tracking-normal">
            {t('heroTitle2')}
          </span>
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-neutral/90 mb-6 italic">
          {t('heroSubtitle')}
        </p>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-neutral/90 mb-10 min-h-[60px]">
          {t('heroValue')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#classes"
            className="w-full sm:w-auto bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
          >
            {t('heroCTA2')}
          </a>
        </div>
      </div>

      <a
        href="#classes"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-2 text-neutral/70 animate-subtle-bob hover:text-neutral transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent/50 rounded-lg p-2"
      >
        <span>{t('heroScroll')}</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </a>
    </section>
  );
};

export default Hero;
