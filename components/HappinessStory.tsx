import React from 'react';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';

const HappinessStory: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="relative section-after-hero pb-12 md:pb-16 bg-black text-neutral">
      {/* Background - Enterprise pattern */}
      <div className="absolute inset-0 bg-black">
        {/* Background image with configurable opacity */}
        <div className="absolute inset-0" style={{ opacity: 0.2 }}>
          <picture>
            <source srcSet="/images/optimized/comunidad-grupo.webp" type="image/webp" />
            <img
              src="/images/optimized/comunidad-grupo.jpg"
              alt={t('happiness_story_bg_alt')}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 30%' }}
              loading="lazy"
            />
          </picture>
        </div>
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        {/* First line: Large white text - no animation to ensure visibility on load */}
        <p className="text-3xl md:text-4xl text-white mb-6 leading-relaxed">
          {t('happinessStoryLine1')}
        </p>

        {/* Second line: Large holographic text - no animation to ensure visibility on load */}
        <p className="text-3xl md:text-4xl holographic-text mb-8 leading-relaxed">
          {t('happinessStoryLine2')}
        </p>

        {/* Third line: Bold normal size */}
        <AnimateOnScroll delay={300}>
          <p className="text-lg md:text-xl font-bold mb-6 leading-relaxed">
            {t('happinessStoryLine3')}
          </p>
        </AnimateOnScroll>

        {/* Fourth line: Partial bold */}
        <AnimateOnScroll delay={400}>
          <p className="text-lg md:text-xl text-neutral/90 mb-8 leading-relaxed">
            {t('happinessStoryLine4Part1')}{' '}
            <span className="font-bold">{t('happinessStoryLine4Part2')}</span>
          </p>
        </AnimateOnScroll>

        {/* Fifth line: Holographic color, larger */}
        <AnimateOnScroll delay={500}>
          <p className="text-2xl md:text-3xl holographic-text mb-8 leading-relaxed font-bold">
            {t('happinessStoryLine5')}
          </p>
        </AnimateOnScroll>

        {/* Main narrative paragraphs */}
        <AnimateOnScroll delay={600}>
          <div className="space-y-6 text-lg md:text-xl text-neutral/90 leading-relaxed">
            <p>{t('happinessStoryPara1Part1')}</p>
          </div>
        </AnimateOnScroll>

        {/* Standalone holographic statement */}
        <AnimateOnScroll delay={650}>
          <p className="my-8 text-2xl md:text-3xl font-bold holographic-text leading-relaxed">
            {t('happinessStoryPara1Part2')}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={700}>
          <div className="space-y-6 text-lg md:text-xl text-neutral/90 leading-relaxed">
            <p>{t('happinessStoryPara2')}</p>

            <p>
              {t('happinessStoryPara3Part1')}{' '}
              <span className="font-bold">{t('happinessStoryPara3Part2')}</span>{' '}
              {t('happinessStoryPara3Part3')}{' '}
              <span className="font-bold">{t('happinessStoryPara3Part4')}</span>
              {t('happinessStoryPara3Part5')}{' '}
              <span className="font-bold">{t('happinessStoryPara3Part6')}</span>
              {t('happinessStoryPara3Part7')}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Final powerful statement */}
        <AnimateOnScroll delay={800}>
          <p className="mt-10 text-3xl md:text-4xl font-bold holographic-text leading-relaxed">
            {t('happinessStoryPara4')}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default HappinessStory;
