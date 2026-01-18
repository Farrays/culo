import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import MethodInfographic from './MethodInfographic';

// Lazy load OptimizedImage for better initial page load
const OptimizedImage = lazy(() => import('./OptimizedImage'));

const About: React.FC = () => {
  const { t, locale } = useI18n();

  return (
    <section id="about" className="relative py-12 md:py-16 bg-black overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Sección superior: Texto a la izquierda, Foto a la derecha */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Columna izquierda: Texto sobre Yunaisy */}
          <div className="space-y-6">
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

          {/* Columna derecha: Foto artística de Yunaisy */}
          <AnimateOnScroll delay={300}>
            <div className="rounded-2xl overflow-hidden border border-primary-accent/30 shadow-lg">
              <Suspense
                fallback={<div className="aspect-[3/4] bg-primary-dark/30 animate-pulse" />}
              >
                <OptimizedImage
                  src="/images/yunaisy/img/yunaisy-artistica-4"
                  alt={t('aboutYunaisyPhotoAlt')}
                  aspectRatio="3/4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="w-full"
                  objectFit="cover"
                  objectPosition="top"
                  breakpoints={[320, 640, 768, 1024, 1440]}
                />
              </Suspense>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Sección inferior: Método Farray */}
        <AnimateOnScroll delay={400}>
          <div className="max-w-4xl mx-auto p-8 bg-black/50 backdrop-blur-md border border-primary-accent/20 rounded-2xl shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold holographic-text text-center mb-8">
              {t('aboutMethodTitle')}
            </h3>
            <MethodInfographic />
            <div className="text-center mt-8">
              <Link
                to={`/${locale}/metodo-farray`}
                className="group inline-flex items-center gap-3 bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
              >
                <span>{t('aboutMethodCTA')}</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default About;
