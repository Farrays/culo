import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import FAQSection from './FAQSection';
import Icon from './Icon';
import OptimizedImage from './OptimizedImage';
import { ReviewsSection } from './reviews';

const ClasesParticularesPage: React.FC = () => {
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

  // FAQ data
  const faqsParticulares = [
    {
      id: 'particulares-1',
      question: t('particularesPage_faqQ1'),
      answer: t('particularesPage_faqA1'),
    },
    {
      id: 'particulares-2',
      question: t('particularesPage_faqQ2'),
      answer: t('particularesPage_faqA2'),
    },
    {
      id: 'particulares-3',
      question: t('particularesPage_faqQ3'),
      answer: t('particularesPage_faqA3'),
    },
    {
      id: 'particulares-4',
      question: t('particularesPage_faqQ4'),
      answer: t('particularesPage_faqA4'),
    },
    {
      id: 'particulares-5',
      question: t('particularesPage_faqQ5'),
      answer: t('particularesPage_faqA5'),
    },
    {
      id: 'particulares-6',
      question: t('particularesPage_faqQ6'),
      answer: t('particularesPage_faqA6'),
    },
    {
      id: 'particulares-7',
      question: t('particularesPage_faqQ7'),
      answer: t('particularesPage_faqA7'),
    },
  ];

  // Benefits data (con iconos)
  const benefits = [
    {
      titleKey: 'particularesPage_benefit1_title',
      descKey: 'particularesPage_benefit1_desc',
      icon: 'users' as const,
    },
    {
      titleKey: 'particularesPage_benefit2_title',
      descKey: 'particularesPage_benefit2_desc',
      icon: 'chart-bar' as const,
    },
    {
      titleKey: 'particularesPage_benefit3_title',
      descKey: 'particularesPage_benefit3_desc',
      icon: 'clock' as const,
    },
    {
      titleKey: 'particularesPage_benefit4_title',
      descKey: 'particularesPage_benefit4_desc',
      icon: 'gift' as const,
    },
  ];

  // Comparison options
  const comparisonOptions = [
    {
      titleKey: 'particularesPage_particulares_title',
      descKey: 'particularesPage_particulares_desc',
      imageUrl: '/images/clases-particulares-card.jpg', // Placeholder
      accent: true,
    },
    {
      titleKey: 'particularesPage_premium_title',
      descKey: 'particularesPage_premium_desc',
      imageUrl: '/images/clases-premium-card.jpg', // Placeholder
      accent: false,
    },
  ];

  // Packages data (Regular y Premium)
  const packages = [
    {
      titleKey: 'particularesPage_pack_regular_title',
      descKey: 'particularesPage_pack_regular_desc',
      featuresKeys: [
        'particularesPage_pack_regular_feature1',
        'particularesPage_pack_regular_feature2',
        'particularesPage_pack_regular_feature3',
        'particularesPage_pack_regular_feature4',
        'particularesPage_pack_regular_feature5',
      ],
      tier: 'regular',
      popular: false,
    },
    {
      titleKey: 'particularesPage_pack_premium_title',
      descKey: 'particularesPage_pack_premium_desc',
      featuresKeys: [
        'particularesPage_pack_premium_feature1',
        'particularesPage_pack_premium_feature2',
        'particularesPage_pack_premium_feature3',
        'particularesPage_pack_premium_feature4',
        'particularesPage_pack_premium_feature5',
      ],
      tier: 'premium',
      popular: false,
    },
  ];

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('navHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('breadcrumb_services'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('navClasesParticulares'),
        item: `${baseUrl}/${locale}/clases-particulares-baile`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('navHome'), url: `/${locale}` },
    { name: t('breadcrumb_services'), url: `/${locale}` },
    {
      name: t('navClasesParticulares'),
      url: `/${locale}/clases-particulares-baile`,
      isActive: true,
    },
  ];

  // Schema Markup - Service (mejorado para SEO)
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: t('schema_particulares_serviceType'),
    name: t('schema_particulares_serviceName'),
    description: t('particularesPage_description'),
    provider: {
      '@type': 'EducationalOrganization',
      name: "Farray's International Dance Center",
      url: 'https://www.farrayscenter.com',
      logo: 'https://www.farrayscenter.com/logo.png',
      foundingDate: '2017',
      founder: {
        '@type': 'Person',
        name: 'Yunaisy Farray',
        jobTitle: t('schema_founderJobTitle'),
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: t('schema_streetAddress'),
        addressLocality: 'Barcelona',
        addressRegion: t('schema_addressRegion'),
        postalCode: '08015',
        addressCountry: 'ES',
      },
      telephone: '+34622247085',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '500+',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Barcelona',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: t('schema_addressRegion'),
      },
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: t('schema_streetAddress'),
          addressLocality: 'Barcelona',
          postalCode: '08015',
        },
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t('schema_particulares_catalogName'),
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: t('schema_particulares_offerRegularName'),
            description: t('schema_particulares_offerRegularDesc'),
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '65',
            priceCurrency: 'EUR',
            unitText: 'HOUR',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: t('schema_particulares_offerPremiumName'),
            description: t('schema_particulares_offerPremiumDesc'),
          },
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: '75',
            priceCurrency: 'EUR',
            unitText: 'HOUR',
          },
        },
      ],
    },
  };

  // Schema Markup - FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsParticulares.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{t('particularesPage_title')} | Farray&apos;s Center</title>
        <meta name="description" content={t('particularesPage_description')} />
        <link rel="canonical" href={`${baseUrl}/${locale}/clases-particulares-baile`} />

        {/* Open Graph */}
        <meta property="og:title" content={`${t('particularesPage_title')} | Farray's Center`} />
        <meta property="og:description" content={t('particularesPage_description')} />
        <meta property="og:url" content={`${baseUrl}/${locale}/clases-particulares-baile`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-clasesParticulares.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t('clases_particulares_og_image_alt')} />
        <meta
          property="og:locale"
          content={
            locale === 'es'
              ? 'es_ES'
              : locale === 'ca'
                ? 'ca_ES'
                : locale === 'fr'
                  ? 'fr_FR'
                  : 'en_US'
          }
        />
        <meta property="og:site_name" content="Farray's International Dance Center" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('particularesPage_title')} | Farray's Center`} />
        <meta name="twitter:description" content={t('particularesPage_description')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-clasesParticulares.jpg`} />

        {/* hreflang alternates */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/clases-particulares-baile`} />
        <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca/clases-particulares-baile`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/clases-particulares-baile`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/clases-particulares-baile`} />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es/clases-particulares-baile`}
        />

        {/* Preload hero image for LCP optimization */}
        <link
          rel="preload"
          as="image"
          type="image/avif"
          imageSrcSet="/images/clases-particulares/img/clase-particular-baile-barcelona_320.avif 320w, /images/clases-particulares/img/clase-particular-baile-barcelona_640.avif 640w, /images/clases-particulares/img/clase-particular-baile-barcelona_768.avif 768w, /images/clases-particulares/img/clase-particular-baile-barcelona_1024.avif 1024w, /images/clases-particulares/img/clase-particular-baile-barcelona_1440.avif 1440w, /images/clases-particulares/img/clase-particular-baile-barcelona_1920.avif 1920w"
          imageSizes="100vw"
        />

        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]">
          {/* Background - Enterprise pattern */}
          <div className="absolute inset-0 bg-black">
            {/* Hero background image with configurable opacity */}
            <div className="absolute inset-0" style={{ opacity: 0.5 }}>
              <picture>
                {/* AVIF - Best compression (Enterprise SEO-optimized filenames) */}
                <source
                  type="image/avif"
                  srcSet="/images/clases-particulares/img/clase-particular-baile-barcelona_320.avif 320w, /images/clases-particulares/img/clase-particular-baile-barcelona_640.avif 640w, /images/clases-particulares/img/clase-particular-baile-barcelona_768.avif 768w, /images/clases-particulares/img/clase-particular-baile-barcelona_1024.avif 1024w, /images/clases-particulares/img/clase-particular-baile-barcelona_1440.avif 1440w, /images/clases-particulares/img/clase-particular-baile-barcelona_1920.avif 1920w"
                  sizes="100vw"
                />
                {/* WebP - Universal modern browsers */}
                <source
                  type="image/webp"
                  srcSet="/images/clases-particulares/img/clase-particular-baile-barcelona_320.webp 320w, /images/clases-particulares/img/clase-particular-baile-barcelona_640.webp 640w, /images/clases-particulares/img/clase-particular-baile-barcelona_768.webp 768w, /images/clases-particulares/img/clase-particular-baile-barcelona_1024.webp 1024w, /images/clases-particulares/img/clase-particular-baile-barcelona_1440.webp 1440w, /images/clases-particulares/img/clase-particular-baile-barcelona_1920.webp 1920w"
                  sizes="100vw"
                />
                {/* JPG - Fallback */}
                <img
                  src="/images/clases-particulares/img/clase-particular-baile-barcelona_1440.jpg"
                  srcSet="/images/clases-particulares/img/clase-particular-baile-barcelona_320.jpg 320w, /images/clases-particulares/img/clase-particular-baile-barcelona_640.jpg 640w, /images/clases-particulares/img/clase-particular-baile-barcelona_768.jpg 768w, /images/clases-particulares/img/clase-particular-baile-barcelona_1024.jpg 1024w, /images/clases-particulares/img/clase-particular-baile-barcelona_1440.jpg 1440w, /images/clases-particulares/img/clase-particular-baile-barcelona_1920.jpg 1920w"
                  sizes="100vw"
                  alt={t('clases_particulares_hero_image_alt')}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 30%' }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={1920}
                  height={1280}
                />
              </picture>
            </div>
            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 via-transparent to-black/50"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/90" />

            {/* H1 + Intro */}
            <AnimateOnScroll>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {t('particularesPage_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('particularesPage_intro')}
              </p>
            </AnimateOnScroll>

            {/* CTA Button */}
            <AnimateOnScroll delay={200}>
              <div className="mt-10 flex justify-center">
                <Link
                  to={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('consultarDisponibilidad')}
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
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Contenido SEO - What to Expect */}
        <section aria-labelledby="what-to-expect-title" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-to-expect-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-8 text-center holographic-text"
                >
                  {t('particularesPage_whatToExpect_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6">
              <AnimateOnScroll delay={100}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('particularesPage_whatToExpect_p1')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('particularesPage_whatToExpect_p2')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('particularesPage_whatToExpect_p3')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Stats Section - Números de impacto */}
        <section
          aria-labelledby="stats-title"
          className="py-12 md:py-16 bg-gradient-to-br from-primary-dark/10 via-black to-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="stats-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-12 text-center holographic-text"
                >
                  {t('particularesPage_stats_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <AnimateOnScroll delay={100} className="h-full">
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 text-center hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full flex flex-col justify-center">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4 whitespace-nowrap">
                    {t('particularesPage_stat1_value')}
                  </div>
                  <div className="text-lg text-neutral/90">{t('particularesPage_stat1_label')}</div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200} className="h-full">
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 text-center hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full flex flex-col justify-center">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4 whitespace-nowrap">
                    {t('particularesPage_stat2_value')}
                  </div>
                  <div className="text-lg text-neutral/90">{t('particularesPage_stat2_label')}</div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300} className="h-full">
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 text-center hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full flex flex-col justify-center">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4 whitespace-nowrap">
                    {t('particularesPage_stat3_value')}
                  </div>
                  <div className="text-lg text-neutral/90">{t('particularesPage_stat3_label')}</div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400} className="h-full">
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 text-center hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full flex flex-col justify-center">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4 whitespace-nowrap">
                    {t('particularesPage_stat4_value')}
                  </div>
                  <div className="text-lg text-neutral/90">{t('particularesPage_stat4_label')}</div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Benefits Section - Cards estilo WhyFIDC con iconos SVG */}
        <section aria-labelledby="benefits-title" className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="benefits-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-center holographic-text"
                >
                  {t('particularesPage_benefitsTitle')}
                </h2>
                <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12 text-center">
                  {t('particularesPage_benefitsSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="flex flex-wrap justify-center -m-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/4 p-4">
                  <AnimateOnScroll delay={index * 100} className="h-full">
                    <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full flex flex-col">
                      <div className="mb-6">
                        <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <Icon
                            name={benefit.icon}
                            className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                        {t(benefit.titleKey)}
                      </h3>
                      <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                        {t(benefit.descKey)}
                      </p>
                    </div>
                  </AnimateOnScroll>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modalidad Section - Cards con botón Contactar */}
        <section aria-labelledby="comparison-title" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="comparison-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-center holographic-text"
                >
                  {t('particularesPage_comparisonTitle')}
                </h2>
                <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12 text-center">
                  {t('particularesPage_comparisonSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {comparisonOptions.map((option, index) => (
                <AnimateOnScroll key={index} delay={index * 100} className="h-full">
                  <article className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border border-white/10 hover:border-primary-accent flex flex-col">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/50 via-black/80 to-black"></div>
                    </div>

                    {/* Text Content */}
                    <div className="p-6 space-y-4 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300">
                        {t(option.titleKey)}
                      </h3>
                      <p className="text-neutral/90 text-sm leading-relaxed flex-grow">
                        {t(option.descKey)}
                      </p>

                      {/* Botón Contactar centrado y pulsante */}
                      <div className="flex justify-center pt-4">
                        <Link
                          to={`/${locale}/contacto`}
                          className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-base py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                        >
                          {t('particularesPage_contactButton')}
                        </Link>
                      </div>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Imagen decorativa con texto SEO */}
        <section aria-labelledby="why-choose-title" className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <AnimateOnScroll>
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <OptimizedImage
                    src="/images/clases-particulares/img/clase-particular-baile-barcelona"
                    alt={t('clases_particulares_hero_image_alt')}
                    aspectRatio="4/3"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    objectFit="cover"
                    placeholder="color"
                    placeholderColor="#1a0a1e"
                    className="w-full h-full"
                  />
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <div className="space-y-6">
                  <h2
                    id="why-choose-title"
                    className="text-3xl md:text-4xl font-black holographic-text"
                  >
                    {t('particularesPage_whyChoose_title')}
                  </h2>
                  <p className="text-lg text-neutral/90 leading-relaxed">
                    {t('particularesPage_whyChoose_p1')}
                  </p>
                  <p className="text-lg text-neutral/90 leading-relaxed">
                    {t('particularesPage_whyChoose_p2')}
                  </p>
                  <p className="text-lg text-neutral/90 leading-relaxed">
                    {t('particularesPage_whyChoose_p3')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Packages Section - Cards estilo DanceClassesPage */}
        <section id="packs" aria-labelledby="packs-title" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="packs-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-center holographic-text"
                >
                  {t('particularesPage_packsTitle')}
                </h2>
                <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12 text-center">
                  {t('particularesPage_packsSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <AnimateOnScroll key={index} delay={index * 100} className="h-full">
                  <article
                    className={`group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border flex flex-col ${
                      pkg.popular
                        ? 'border-primary-accent shadow-accent-glow'
                        : 'border-white/10 hover:border-primary-accent'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 right-6 bg-primary-accent text-white px-6 py-1 rounded-full text-sm font-bold z-10">
                        {t('particularesPage_pack_popular')}
                      </div>
                    )}

                    {/* Image Section */}
                    <div className="relative h-32 overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/50 via-black to-black"></div>
                    </div>

                    {/* Text Content */}
                    <div className="p-6 space-y-4 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300">
                        {t(pkg.titleKey)}
                      </h3>
                      <p className="text-neutral/90 text-sm leading-relaxed">{t(pkg.descKey)}</p>

                      <ul className="space-y-2 flex-grow">
                        {pkg.featuresKeys.map((featureKey, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-neutral/90">
                            <svg
                              className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{t(featureKey)}</span>
                          </li>
                        ))}
                      </ul>

                      <Link
                        to={`/${locale}/contacto`}
                        className={`mt-4 block w-full text-center font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow ${
                          pkg.popular
                            ? 'bg-primary-accent text-white animate-glow'
                            : 'bg-primary-accent text-white animate-glow'
                        }`}
                      >
                        {t('particularesPage_contactButton')}
                      </Link>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <ReviewsSection
          category="general"
          limit={6}
          showGoogleBadge={true}
          title="Lo que dicen nuestros alumnos"
          layout="grid"
          selectedAuthors={[
            'Anne Hein',
            'Marina T',
            'Katarzyna Bakuła-Soltani',
            'Annina Moser',
            'Arjan Hendrickx',
            'Michelle Lu',
          ]}
        />

        {/* FAQ Section - Sin fondo y más cerca de packs */}
        <section className="pt-2 pb-6 md:pt-4 md:pb-8 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <FAQSection
                title={t('particularesPage_faqTitle')}
                faqs={faqsParticulares}
                pageUrl={`${baseUrl}/${locale}/clases-particulares-baile`}
              />
            </div>
          </div>
        </section>

        {/* Final CTA - Estilo DanceClassesPage con background y pulsante */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Background with stars */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                  {t('particularesPage_finalCta_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                  {t('particularesPage_finalCta_subtitle')}
                </p>
                <p className="max-w-4xl mx-auto text-lg text-neutral/90 mb-10">
                  {t('particularesPage_finalCta_description')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex justify-center">
                <Link
                  to={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow"
                >
                  {t('consultarDisponibilidad')}
                  <svg
                    className="w-6 h-6 ml-2"
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
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default ClasesParticularesPage;
