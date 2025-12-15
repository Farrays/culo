import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';

const FinalCTA: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <section id="enroll" className="relative py-20 md:py-32 overflow-hidden">
      {/* Background with stars */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      <div className="relative z-20 container mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 holographic-text">
            {t('finalCtaTitle')}
          </h2>
        </AnimateOnScroll>
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <AnimateOnScroll delay={100}>
            <p className="text-lg md:text-xl text-neutral/90">{t('finalCtaSubtitleLine1')}</p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="text-xl md:text-2xl font-bold text-neutral">
              {t('finalCtaSubtitleLine2')}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={300}>
            <p className="text-2xl md:text-3xl font-bold holographic-text">
              {t('finalCtaSubtitleLine3')}
            </p>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll delay={200}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/${locale}#enroll`}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
            >
              {t('finalCtaButton1')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <Link
              to={`/${locale}#enroll`}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
            >
              {t('finalCtaButton2')}
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default FinalCTA;
