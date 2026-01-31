import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from './AnimateOnScroll';
import MethodInfographic from './MethodInfographic';

// Lazy load OptimizedImage for better initial page load
const OptimizedImage = lazy(() => import('./OptimizedImage'));

// External links for E-E-A-T verification (GEO optimization)
const EXTERNAL_LINKS = {
  cidUnesco: 'https://www.cid-portal.org/',
  streetDance2: 'https://www.imdb.com/es-es/title/tt1718903/',
};

const About: React.FC = () => {
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

  return (
    <section
      id="about"
      className="relative py-12 md:py-16 bg-black overflow-hidden"
      role="region"
      aria-labelledby="about-title"
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* Hidden microdata for SEO */}
      <meta itemProp="name" content="Yunaisy Farray" />
      <meta itemProp="jobTitle" content="Directora y Fundadora" />
      <meta itemProp="nationality" content="Cuba" />
      <link itemProp="sameAs" href="https://www.instagram.com/yunaisyfarray/" />
      <link itemProp="sameAs" href={EXTERNAL_LINKS.cidUnesco} />

      <div className="container mx-auto px-6 relative z-10">
        {/* Sección superior: Texto a la izquierda, Foto a la derecha */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Columna izquierda: Texto sobre Yunaisy */}
          <div className="space-y-6">
            <AnimateOnScroll>
              <h2
                id="about-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-2 holographic-text"
                data-speakable="true"
              >
                <span itemProp="name">{t('aboutTitle')}</span>
              </h2>
              <p
                id="about-subtitle"
                className="text-2xl md:text-3xl font-medium holographic-text"
                data-speakable="true"
              >
                {t('aboutSubtitle')}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <div
                id="about-bio"
                className="text-lg text-neutral/90 leading-relaxed space-y-4"
                itemProp="description"
                data-speakable="true"
              >
                {t('aboutBio')
                  .split('\n\n')
                  .map((paragraph: string, index: number) => (
                    <p key={index} id={`about-bio-para-${index + 1}`}>
                      {paragraph}
                    </p>
                  ))}
                {/* E-E-A-T: External verification links */}
                <p className="text-sm text-neutral/60 mt-4 flex flex-wrap gap-x-4 gap-y-1">
                  <a
                    href={EXTERNAL_LINKS.streetDance2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-accent transition-colors underline underline-offset-2"
                    aria-label={t('aboutVerifyStreetDance')}
                  >
                    Street Dance 2 (IMDb)
                  </a>
                  <a
                    href={EXTERNAL_LINKS.cidUnesco}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-accent transition-colors underline underline-offset-2"
                    aria-label={t('aboutVerifyCID')}
                  >
                    CID-UNESCO
                  </a>
                </p>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Columna derecha: Foto artística de Yunaisy */}
          <AnimateOnScroll delay={300}>
            <figure
              className="rounded-2xl overflow-hidden border border-primary-accent/30 shadow-lg relative"
              itemProp="image"
              itemScope
              itemType="https://schema.org/ImageObject"
              style={{ aspectRatio: '3/4', maxWidth: '450px', margin: '0 auto' }}
            >
              <Suspense
                fallback={<div className="aspect-[3/4] bg-primary-dark/30 animate-pulse" />}
              >
                <OptimizedImage
                  src="/images/yunaisy/img/yunaisy-artistica-4"
                  alt={t('aboutYunaisyPhotoAlt')}
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="absolute inset-0 w-full h-full"
                  objectFit="cover"
                  objectPosition="center center"
                  breakpoints={[320, 640, 768, 1024, 1440]}
                />
              </Suspense>
              <meta
                itemProp="url"
                content="https://www.farrayscenter.com/images/yunaisy/img/yunaisy-artistica-4_1024.webp"
              />
              <meta itemProp="width" content="1024" />
              <meta itemProp="height" content="1365" />
            </figure>
          </AnimateOnScroll>
        </div>

        {/* Sección inferior: Método Farray - Brand Schema */}
        <AnimateOnScroll delay={400}>
          <div
            id="metodo-farray-section"
            className="max-w-4xl mx-auto p-8 bg-black/50 backdrop-blur-md border border-primary-accent/20 rounded-2xl shadow-2xl"
            itemScope
            itemType="https://schema.org/Brand"
            data-speakable="true"
          >
            <meta itemProp="name" content="Método Farray®" />
            <link itemProp="url" href={`https://www.farrayscenter.com/${locale}/metodo-farray`} />
            <h3
              id="metodo-farray-title"
              className="text-3xl md:text-4xl font-bold holographic-text text-center mb-8"
              itemProp="slogan"
            >
              {t('aboutMethodTitle')}
            </h3>
            <MethodInfographic />
            <div className="text-center mt-8">
              <Link
                to={`/${locale}/metodo-farray`}
                className="group inline-flex items-center gap-3 bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
                aria-label={t('aboutMethodCTAAriaLabel')}
              >
                <span>{t('aboutMethodCTA')}</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
