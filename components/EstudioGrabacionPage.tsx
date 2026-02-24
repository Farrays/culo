import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import AnimatedCounter from './AnimatedCounter';
import FAQSection from './FAQSection';
import Icon, { type IconName } from './Icon';
import { ReviewsSection } from './reviews';

// ============================================================================
// ENTERPRISE IMAGE CONFIGURATION
// ============================================================================
// Images processed with build-estudio-grabacion-hero.mjs
// Formats: AVIF (best), WebP (wide support), JPEG (fallback)
// Breakpoints: 480w, 960w, 1440w, 1920w
// ============================================================================

const HERO_IMAGE = {
  basePath: '/images/estudio-grabacion/hero',
  srcSet: {
    avif: '/images/estudio-grabacion/hero-480.avif 480w, /images/estudio-grabacion/hero-960.avif 960w, /images/estudio-grabacion/hero-1440.avif 1440w, /images/estudio-grabacion/hero.avif 1920w',
    webp: '/images/estudio-grabacion/hero-480.webp 480w, /images/estudio-grabacion/hero-960.webp 960w, /images/estudio-grabacion/hero-1440.webp 1440w, /images/estudio-grabacion/hero.webp 1920w',
    jpeg: '/images/estudio-grabacion/hero-480.jpg 480w, /images/estudio-grabacion/hero-960.jpg 960w, /images/estudio-grabacion/hero-1440.jpg 1440w, /images/estudio-grabacion/hero.jpg 1920w',
  },
  width: 1920,
  height: 1080,
};

const OG_IMAGE = '/images/estudio-grabacion/og.jpg';

// LQIP (Low Quality Image Placeholder) - Generated from build script
// Provides instant visual feedback while high-res image loads
const LQIP_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23010001"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%230a0a0a"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1920" height="1080" fill="url(%23g)"%3E%3C/rect%3E%3C/svg%3E';

// Supported locales for hreflang
const SUPPORTED_LOCALES = ['es', 'ca', 'en', 'fr'] as const;

const EstudioGrabacionPage: React.FC = () => {
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
  const baseUrl = 'https://www.farrayscenter.com';

  // Services data
  interface ServiceFeature {
    icon: IconName;
    titleKey: string;
    descKey: string;
  }

  const studioServices: ServiceFeature[] = [
    {
      icon: 'sparkles',
      titleKey: 'estudioGrabacion_service1_title',
      descKey: 'estudioGrabacion_service1_desc',
    },
    {
      icon: 'building',
      titleKey: 'estudioGrabacion_service2_title',
      descKey: 'estudioGrabacion_service2_desc',
    },
    {
      icon: 'star',
      titleKey: 'estudioGrabacion_service3_title',
      descKey: 'estudioGrabacion_service3_desc',
    },
    {
      icon: 'users',
      titleKey: 'estudioGrabacion_service4_title',
      descKey: 'estudioGrabacion_service4_desc',
    },
    {
      icon: 'globe',
      titleKey: 'estudioGrabacion_service5_title',
      descKey: 'estudioGrabacion_service5_desc',
    },
    {
      icon: 'trophy',
      titleKey: 'estudioGrabacion_service6_title',
      descKey: 'estudioGrabacion_service6_desc',
    },
  ];

  // Benefits data
  interface Benefit {
    icon: IconName;
    titleKey: string;
    descKey: string;
  }

  const benefits: Benefit[] = [
    {
      icon: 'building',
      titleKey: 'estudioGrabacion_benefit1_title',
      descKey: 'estudioGrabacion_benefit1_desc',
    },
    {
      icon: 'users',
      titleKey: 'estudioGrabacion_benefit2_title',
      descKey: 'estudioGrabacion_benefit2_desc',
    },
    {
      icon: 'clock',
      titleKey: 'estudioGrabacion_benefit3_title',
      descKey: 'estudioGrabacion_benefit3_desc',
    },
    {
      icon: 'sparkles',
      titleKey: 'estudioGrabacion_benefit4_title',
      descKey: 'estudioGrabacion_benefit4_desc',
    },
    {
      icon: 'badge-check',
      titleKey: 'estudioGrabacion_benefit5_title',
      descKey: 'estudioGrabacion_benefit5_desc',
    },
    {
      icon: 'gift',
      titleKey: 'estudioGrabacion_benefit6_title',
      descKey: 'estudioGrabacion_benefit6_desc',
    },
  ];

  // FAQ data
  const studioFaqs = [
    { id: 'eg-1', question: t('estudioGrabacion_faq1_q'), answer: t('estudioGrabacion_faq1_a') },
    { id: 'eg-2', question: t('estudioGrabacion_faq2_q'), answer: t('estudioGrabacion_faq2_a') },
    { id: 'eg-3', question: t('estudioGrabacion_faq4_q'), answer: t('estudioGrabacion_faq4_a') },
    { id: 'eg-4', question: t('estudioGrabacion_faq5_q'), answer: t('estudioGrabacion_faq5_a') },
    { id: 'eg-5', question: t('estudioGrabacion_faq6_q'), answer: t('estudioGrabacion_faq6_a') },
    { id: 'eg-6', question: t('estudioGrabacion_faq7_q'), answer: t('estudioGrabacion_faq7_a') },
    { id: 'eg-7', question: t('estudioGrabacion_faq8_q'), answer: t('estudioGrabacion_faq8_a') },
  ];

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('estudioGrabacion_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('estudioGrabacion_breadcrumb_current'),
      url: `/${locale}/estudio-grabacion-barcelona`,
      isActive: true,
    },
  ];

  // Schema Markup - Service (Enhanced for GEO/AIEO)
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/${locale}/estudio-grabacion-barcelona#service`,
    name: t('estudioGrabacion_h1'),
    description: t('estudioGrabacion_intro'),
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}${OG_IMAGE}`,
      width: 1200,
      height: 630,
      caption: t('estudioGrabacion_hero_image_alt'),
    },
    provider: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
      url: 'https://www.farrayscenter.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.farrayscenter.com/images/logo/farray-logo.webp',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: t('schema_streetAddress'),
        addressLocality: 'Barcelona',
        postalCode: '08015',
        addressRegion: t('schema_addressRegion'),
        addressCountry: 'ES',
      },
      telephone: '+34622247085',
      // aggregateRating removed - already in build-time LocalBusiness #danceschool schema
    },
    areaServed: {
      '@type': 'City',
      name: 'Barcelona',
      '@id': 'https://www.wikidata.org/wiki/Q1492',
    },
    serviceType: 'Recording Studio Rental',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'EUR',
      },
    },
  };

  // Schema Markup - ImageObject for hero (GEO optimization)
  const heroImageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${baseUrl}/${locale}/estudio-grabacion-barcelona#heroImage`,
    url: `${baseUrl}/images/estudio-grabacion/hero.jpg`,
    contentUrl: `${baseUrl}/images/estudio-grabacion/hero.jpg`,
    width: 1920,
    height: 1080,
    caption: t('estudioGrabacion_hero_image_alt'),
    description: t('estudioGrabacion_intro'),
    representativeOfPage: true,
    creditText: "Farray's International Dance Center",
    copyrightHolder: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
    },
  };

  // Schema Markup - WebPage with SpeakableSpecification (GEO/AIEO - Voice Search)
  // Required by Google for voice assistant optimization
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${baseUrl}/${locale}/estudio-grabacion-barcelona#webpage`,
    url: `${baseUrl}/${locale}/estudio-grabacion-barcelona`,
    name: t('estudioGrabacion_h1'),
    description: t('estudioGrabacion_meta_description'),
    inLanguage:
      locale === 'es' ? 'es-ES' : locale === 'ca' ? 'ca-ES' : locale === 'en' ? 'en-GB' : 'fr-FR',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      name: "Farray's International Dance Center",
      url: baseUrl,
    },
    primaryImageOfPage: {
      '@id': `${baseUrl}/${locale}/estudio-grabacion-barcelona#heroImage`,
    },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#estudio-h1', '#estudio-hero p', '#solution-title'],
    },
    mainEntity: {
      '@id': `${baseUrl}/${locale}/estudio-grabacion-barcelona#service`,
    },
  };

  // Canonical URL for hreflang
  const canonicalUrl = `${baseUrl}/${locale}/estudio-grabacion-barcelona`;

  // Hreflang URLs for international SEO
  const hreflangUrls = SUPPORTED_LOCALES.map(loc => ({
    locale: loc,
    url: `${baseUrl}/${loc}/estudio-grabacion-barcelona`,
    hreflang: loc === 'es' ? 'es' : loc === 'ca' ? 'ca' : loc === 'en' ? 'en' : 'fr',
  }));

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{t('estudioGrabacion_h1')} | Farray&apos;s Center</title>
        <meta name="description" content={t('estudioGrabacion_meta_description')} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Hreflang - International SEO (4 locales) */}
        {hreflangUrls.map(({ hreflang, url }) => (
          <link key={hreflang} rel="alternate" hrefLang={hreflang} href={url} />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es/estudio-grabacion-barcelona`}
        />

        {/* LCP Optimization - Preload Hero Image */}
        <link
          rel="preload"
          as="image"
          type="image/avif"
          href="/images/estudio-grabacion/hero.avif"
          imageSrcSet={HERO_IMAGE.srcSet.avif}
          imageSizes="100vw"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${t('estudioGrabacion_h1')} | Farray's Center`} />
        <meta property="og:description" content={t('estudioGrabacion_meta_description')} />
        <meta property="og:image" content={`${baseUrl}${OG_IMAGE}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t('estudioGrabacion_hero_image_alt')} />
        <meta
          property="og:locale"
          content={
            locale === 'es'
              ? 'es_ES'
              : locale === 'ca'
                ? 'ca_ES'
                : locale === 'en'
                  ? 'en_GB'
                  : 'fr_FR'
          }
        />
        <meta property="og:site_name" content="Farray's International Dance Center" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={`${t('estudioGrabacion_h1')} | Farray's Center`} />
        <meta name="twitter:description" content={t('estudioGrabacion_meta_description')} />
        <meta name="twitter:image" content={`${baseUrl}${OG_IMAGE}`} />
        <meta name="twitter:image:alt" content={t('estudioGrabacion_hero_image_alt')} />

        {/* Schema Markup - Enterprise SEO/GEO/AIEO/AIO */}
        {/* BreadcrumbList + FAQPage generated at build-time by prerender.mjs */}
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(heroImageSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webPageSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section - Enterprise LCP Optimized */}
        <section
          id="estudio-hero"
          aria-labelledby="estudio-h1"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background Image with Enterprise Multi-Format Picture Element */}
          <div className="absolute inset-0">
            {/* LQIP Blur Placeholder - Instant visual feedback */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url("${LQIP_PLACEHOLDER}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(20px)',
                transform: 'scale(1.1)',
              }}
            />
            <picture>
              {/* AVIF - Best compression for modern browsers */}
              <source type="image/avif" srcSet={HERO_IMAGE.srcSet.avif} sizes="100vw" />
              {/* WebP - Wide browser support */}
              <source type="image/webp" srcSet={HERO_IMAGE.srcSet.webp} sizes="100vw" />
              {/* JPEG - Universal fallback */}
              <img
                src="/images/estudio-grabacion/hero.jpg"
                srcSet={HERO_IMAGE.srcSet.jpeg}
                sizes="100vw"
                alt={t('estudioGrabacion_hero_image_alt')}
                className="absolute inset-0 w-full h-full object-cover z-10"
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                width={HERO_IMAGE.width}
                height={HERO_IMAGE.height}
              />
            </picture>
            {/* Dark Overlay for Text Readability - Accessibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-20"></div>
          </div>

          <div className="relative z-30 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/70" />

            {/* H1 + Intro - GEO Optimized with speakable content */}
            <AnimateOnScroll>
              <h1
                id="estudio-h1"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {t('estudioGrabacion_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('estudioGrabacion_intro')}
              </p>
            </AnimateOnScroll>

            {/* CTA Buttons */}
            <AnimateOnScroll delay={200}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('estudioGrabacion_cta_primary')}
                  <svg
                    className="w-5 h-5 ml-2"
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
                <Link
                  to={`/${locale}/alquiler-salas-baile-barcelona`}
                  className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('estudioGrabacion_cta_secondary')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Problem Section - Persuasion Framework */}
        <section
          aria-labelledby="problem-title"
          className="py-12 md:py-16 bg-gradient-to-br from-primary-dark/10 via-black to-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <h2
                id="problem-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-8 text-neutral text-center holographic-text"
              >
                {t('estudioGrabacion_problem_title')}
              </h2>
              <div className="max-w-4xl mx-auto text-lg md:text-xl text-neutral/80 space-y-6">
                <p>{t('estudioGrabacion_problem_p1')}</p>
                <p>{t('estudioGrabacion_problem_p2')}</p>
                <p className="text-xl md:text-2xl font-bold text-primary-accent">
                  {t('estudioGrabacion_problem_p3')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Solution Section */}
        <section aria-labelledby="solution-title" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <h2
                id="solution-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-neutral text-center holographic-text"
              >
                {t('estudioGrabacion_solution_title')}
              </h2>
              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-neutral/90 mb-16 text-center">
                {t('estudioGrabacion_solution_subtitle')}
              </p>
            </AnimateOnScroll>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {studioServices.map((service, idx) => (
                <AnimateOnScroll key={idx} delay={idx * 100}>
                  <div className="h-full min-h-[180px] bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg p-8 hover:border-primary-accent transition-all duration-300 hover:shadow-accent-glow flex flex-col">
                    <div className="w-16 h-16 bg-primary-accent/10 rounded-full flex items-center justify-center mb-6">
                      <Icon name={service.icon} className="w-8 h-8 text-primary-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-4">{t(service.titleKey)}</h3>
                    <p className="text-neutral/80 leading-relaxed flex-grow">
                      {t(service.descKey)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section
          aria-labelledby="stats-title"
          className="py-12 md:py-16 bg-gradient-to-br from-primary-dark/10 via-black to-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <h2
                id="stats-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-16 text-neutral text-center holographic-text"
              >
                {t('estudioGrabacion_stats_title')}
              </h2>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* Stat 1 - 700 metros cuadrados */}
              <AnimateOnScroll delay={0}>
                <div className="h-full min-h-[140px] text-center p-8 bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4">
                    <AnimatedCounter target={700} duration={2000} suffix="m²" />
                  </div>
                  <p className="text-lg text-neutral/90 font-semibold">
                    {t('estudioGrabacion_stat1_label')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Stat 2 - 4 salas */}
              <AnimateOnScroll delay={200}>
                <div className="h-full min-h-[140px] text-center p-8 bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4">
                    <AnimatedCounter target={4} duration={2000} />
                  </div>
                  <p className="text-lg text-neutral/90 font-semibold">
                    {t('estudioGrabacion_stat2_label')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Stat 3 - 200 producciones */}
              <AnimateOnScroll delay={400}>
                <div className="h-full min-h-[140px] text-center p-8 bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4">
                    <AnimatedCounter target={200} duration={2000} />
                  </div>
                  <p className="text-lg text-neutral/90 font-semibold">
                    {t('estudioGrabacion_stat3_label')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Stat 4 - 8 años */}
              <AnimateOnScroll delay={600}>
                <div className="h-full min-h-[140px] text-center p-8 bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg flex flex-col items-center justify-center">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4">
                    <AnimatedCounter target={8} duration={2000} />
                  </div>
                  <p className="text-lg text-neutral/90 font-semibold">
                    {t('estudioGrabacion_stat4_label')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section aria-labelledby="benefits-title" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <h2
                id="benefits-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-neutral text-center holographic-text"
              >
                {t('estudioGrabacion_benefits_title')}
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-neutral/90 mb-16 text-center">
                {t('estudioGrabacion_benefits_subtitle')}
              </p>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {benefits.map((benefit, idx) => (
                <AnimateOnScroll key={idx} delay={idx * 100}>
                  <div className="h-full bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg p-8 hover:border-primary-accent transition-all duration-300 flex flex-col">
                    <div className="w-16 h-16 bg-primary-accent/10 rounded-full flex items-center justify-center mb-6">
                      <Icon name={benefit.icon} className="w-8 h-8 text-primary-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-4">{t(benefit.titleKey)}</h3>
                    <p className="text-neutral/80 leading-relaxed flex-grow">
                      {t(benefit.descKey)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Equipment Section */}
        <section
          aria-labelledby="equipment-title"
          className="py-12 md:py-16 bg-gradient-to-br from-primary-dark/10 via-black to-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <h2
                id="equipment-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-neutral text-center holographic-text"
              >
                {t('estudioGrabacion_equipment_title')}
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-neutral/90 mb-16 text-center">
                {t('estudioGrabacion_equipment_subtitle')}
              </p>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Equipment List 1 */}
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(num => (
                      <div
                        key={num}
                        className="flex items-start gap-4 bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg p-4"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-accent rounded-full flex items-center justify-center mt-1">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-neutral/90">
                          {t(`estudioGrabacion_equipment_item${num}`)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Equipment List 2 */}
                  <div className="space-y-4">
                    {[6, 7, 8, 9, 10].map(num => (
                      <div
                        key={num}
                        className="flex items-start gap-4 bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg p-4"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-primary-accent rounded-full flex items-center justify-center mt-1">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <p className="text-neutral/90">
                          {t(`estudioGrabacion_equipment_item${num}`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <ReviewsSection
              category="general"
              limit={6}
              showGoogleBadge={true}
              title="Lo que dicen de nuestras instalaciones"
              layout="grid"
              selectedAuthors={[
                'Karina Indytska',
                'Yosefin Cabeza Carrillo',
                'Micaela Llull (MicaPower)',
                'Michelle Lu',
                'garcia lam',
              ]}
            />
          </div>
        </section>

        {/* FAQ Section - Sin título redundante */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <FAQSection title={t('estudioGrabacion_faq_title')} faqs={studioFaqs} />
            </div>
          </div>
        </section>

        {/* Ideal For Section */}
        <section
          aria-labelledby="ideal-for-title"
          className="py-12 md:py-16 bg-gradient-to-br from-primary-dark/10 via-black to-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <h2
                id="ideal-for-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-16 text-neutral text-center holographic-text"
              >
                {t('estudioGrabacion_idealFor_title')}
              </h2>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <AnimateOnScroll key={num} delay={num * 50}>
                  <div className="h-full min-h-[100px] bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg p-6 text-center hover:border-primary-accent transition-all duration-300 hover:shadow-accent-glow flex items-center justify-center">
                    <h3 className="text-lg font-bold text-neutral">
                      {t(`estudioGrabacion_idealFor_item${num}`)}
                    </h3>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section aria-labelledby="process-title" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <h2
                id="process-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-neutral text-center holographic-text"
              >
                {t('estudioGrabacion_process_title')}
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-neutral/90 mb-16 text-center">
                {t('estudioGrabacion_process_subtitle')}
              </p>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-8">
              {[1, 2, 3, 4].map(num => (
                <AnimateOnScroll key={num} delay={num * 100}>
                  <div className="flex items-start gap-6 bg-gradient-to-br from-primary-dark/20 to-black border border-primary-accent/30 rounded-lg p-8 hover:border-primary-accent transition-all duration-300">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-accent text-white rounded-full flex items-center justify-center text-2xl font-black">
                      {num}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-neutral mb-3">
                        {t(`estudioGrabacion_process_step${num}_title`)}
                      </h3>
                      <p className="text-neutral/80 leading-relaxed">
                        {t(`estudioGrabacion_process_step${num}_desc`)}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          id="final-cta"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[500px]"
        >
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>

          <div className="relative z-20 container mx-auto px-6">
            <AnimateOnScroll>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 holographic-text">
                {t('estudioGrabacion_finalCTA_title')}
              </h2>
              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-neutral/90 mb-12 leading-relaxed">
                {t('estudioGrabacion_finalCTA_subtitle')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('estudioGrabacion_finalCTA_button_primary')}
                  <svg
                    className="w-5 h-5 ml-2"
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
                <Link
                  to={`/${locale}/alquiler-salas-baile-barcelona`}
                  className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('estudioGrabacion_finalCTA_button_secondary')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default EstudioGrabacionPage;
