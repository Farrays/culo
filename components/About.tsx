import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import MethodInfographic from './MethodInfographic';

const About: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <section id="about" className="relative py-12 md:py-16 bg-black overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <AnimateOnScroll>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 holographic-text">
                {t('aboutTitle')}
              </h2>
              <p className="text-2xl md:text-3xl font-medium holographic-text">
                {t('aboutSubtitle')}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <div className="text-lg text-neutral/90 leading-relaxed space-y-4">
                {t('aboutBio')
                  .split('\n\n')
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </AnimateOnScroll>
          </div>
          <AnimateOnScroll delay={400}>
            <div className="space-y-8 p-8 bg-black/50 backdrop-blur-md border border-primary-accent/20 rounded-lg shadow-2xl">
              <h3 className="text-3xl font-bold holographic-text">{t('aboutMethodTitle')}</h3>
              <MethodInfographic />
              <Link
                to={`/${locale}/metodo-farray`}
                className="inline-block bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
              >
                {t('aboutMethodCTA')}
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default About;
