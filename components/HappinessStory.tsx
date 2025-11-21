import React from 'react';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';

const HappinessStory: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="relative py-12 md:py-16 bg-black text-neutral">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-primary-dark/10 to-black opacity-50"></div>
      <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
        {/* First line: Large white text */}
        <AnimateOnScroll>
          <p className="text-3xl md:text-4xl text-white mb-6 leading-relaxed">
            {t('happinessStoryLine1')}
          </p>
        </AnimateOnScroll>

        {/* Second line: Large holographic text */}
        <AnimateOnScroll delay={200}>
          <p className="text-3xl md:text-4xl holographic-text animate-glow mb-8 leading-relaxed">
            {t('happinessStoryLine2')}
          </p>
        </AnimateOnScroll>

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

        {/* Fifth line: Holographic color, slightly larger */}
        <AnimateOnScroll delay={500}>
          <p className="text-xl md:text-2xl holographic-text animate-glow mb-8 leading-relaxed">
            {t('happinessStoryLine5')}
          </p>
        </AnimateOnScroll>

        {/* Main narrative paragraphs */}
        <AnimateOnScroll delay={600}>
          <div className="space-y-6 text-lg md:text-xl text-neutral/90 leading-relaxed">
            <p>
              {t('happinessStoryPara1Part1')}{' '}
              <span className="font-bold">{t('happinessStoryPara1Part2')}</span>
            </p>

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

        {/* Final powerful statement with special visual effect */}
        <AnimateOnScroll delay={800}>
          <div className="mt-8 pt-6 border-t-2 border-primary-accent/30">
            <p className="text-2xl md:text-3xl font-bold holographic-text animate-glow leading-relaxed">
              {t('happinessStoryPara4')}
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default HappinessStory;
