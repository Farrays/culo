import React, { useMemo, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import AnimatedCounter from './AnimatedCounter';
import FAQSection from './FAQSection';

// Lazy load ReviewsSection for better performance
const ReviewsSection = lazy(() =>
  import('./reviews').then(module => ({ default: module.ReviewsSection }))
);
import {
  KeyIcon,
  CameraIcon,
  SparklesIcon,
  UserIcon,
  PlayCircleIcon,
  BuildingOfficeIcon,
  HeartIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
  UsersIcon,
  CheckIcon,
} from '../lib/icons';

// ============================================================================
// TYPES
// ============================================================================

interface ServiceCard {
  id: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
  url: string;
  category: 'spaces' | 'training' | 'professional' | 'merchandising';
}

interface ValuePillar {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  titleKey: string;
  descKey: string;
}

// ============================================================================
// DATA
// ============================================================================

const VALUE_PILLARS: ValuePillar[] = [
  {
    Icon: MapPinIcon,
    titleKey: 'serviciosBaile_pillar1_title',
    descKey: 'serviciosBaile_pillar1_desc',
  },
  {
    Icon: StarIcon,
    titleKey: 'serviciosBaile_pillar2_title',
    descKey: 'serviciosBaile_pillar2_desc',
  },
  {
    Icon: BuildingOfficeIcon,
    titleKey: 'serviciosBaile_pillar3_title',
    descKey: 'serviciosBaile_pillar3_desc',
  },
  {
    Icon: UsersIcon,
    titleKey: 'serviciosBaile_pillar4_title',
    descKey: 'serviciosBaile_pillar4_desc',
  },
  {
    Icon: ClockIcon,
    titleKey: 'serviciosBaile_pillar5_title',
    descKey: 'serviciosBaile_pillar5_desc',
  },
  {
    Icon: CheckIcon,
    titleKey: 'serviciosBaile_pillar6_title',
    descKey: 'serviciosBaile_pillar6_desc',
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

const ServiciosBailePage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  // Services data with categories
  const servicesData: ServiceCard[] = useMemo(
    () => [
      // Category: Spaces & Production
      {
        id: 'rental',
        Icon: KeyIcon,
        titleKey: 'serviceRentalTitle',
        descriptionKey: 'serviceRentalDesc',
        ctaKey: 'serviceRentalCTA',
        url: `/${locale}/alquiler-salas-baile-barcelona`,
        category: 'spaces',
      },
      {
        id: 'photo',
        Icon: CameraIcon,
        titleKey: 'servicePhotoTitle',
        descriptionKey: 'servicePhotoDesc',
        ctaKey: 'servicePhotoCTA',
        url: `/${locale}/estudio-grabacion-barcelona`,
        category: 'spaces',
      },
      // Category: Personalized Training
      {
        id: 'private',
        Icon: UserIcon,
        titleKey: 'servicePrivateTitle',
        descriptionKey: 'servicePrivateDesc',
        ctaKey: 'servicePrivateCTA',
        url: `/${locale}/clases-particulares-baile`,
        category: 'training',
      },
      {
        id: 'gift',
        Icon: HeartIcon,
        titleKey: 'serviceGiftTitle',
        descriptionKey: 'serviceGiftDesc',
        ctaKey: 'serviceGiftCTA',
        url: `/${locale}/regala-baile`,
        category: 'training',
      },
      {
        id: 'parties',
        Icon: SparklesIcon,
        titleKey: 'servicePartiesTitle',
        descriptionKey: 'servicePartiesDesc',
        ctaKey: 'servicePartiesCTA',
        url: `/${locale}/contacto`,
        category: 'training',
      },
      // Category: Professionals & Companies
      {
        id: 'agency',
        Icon: PlayCircleIcon,
        titleKey: 'serviceAgencyTitle',
        descriptionKey: 'serviceAgencyDesc',
        ctaKey: 'serviceAgencyCTA',
        url: `/${locale}/contacto`,
        category: 'professional',
      },
      {
        id: 'corporate',
        Icon: BuildingOfficeIcon,
        titleKey: 'serviceCorporateTitle',
        descriptionKey: 'serviceCorporateDesc',
        ctaKey: 'serviceCorporateCTA',
        url: `/${locale}/team-building-barcelona`,
        category: 'professional',
      },
      {
        id: 'events',
        Icon: CalendarDaysIcon,
        titleKey: 'serviceEventsTitle',
        descriptionKey: 'serviceEventsDesc',
        ctaKey: 'serviceEventsCTA',
        url: `/${locale}/contacto`,
        category: 'professional',
      },
      // Category: Merchandising (separate)
      {
        id: 'merchandising',
        Icon: ShoppingBagIcon,
        titleKey: 'serviceMerchandisingTitle',
        descriptionKey: 'serviceMerchandisingDesc',
        ctaKey: 'serviceMerchandisingCTA',
        url: `/${locale}/merchandising`,
        category: 'merchandising',
      },
    ],
    [locale]
  );

  // FAQs data
  const faqs = useMemo(
    () => [
      { id: '1', question: t('serviciosBaile_faq1_q'), answer: t('serviciosBaile_faq1_a') },
      { id: '2', question: t('serviciosBaile_faq2_q'), answer: t('serviciosBaile_faq2_a') },
      { id: '3', question: t('serviciosBaile_faq3_q'), answer: t('serviciosBaile_faq3_a') },
      { id: '4', question: t('serviciosBaile_faq4_q'), answer: t('serviciosBaile_faq4_a') },
      { id: '5', question: t('serviciosBaile_faq5_q'), answer: t('serviciosBaile_faq5_a') },
      { id: '6', question: t('serviciosBaile_faq6_q'), answer: t('serviciosBaile_faq6_a') },
      { id: '7', question: t('serviciosBaile_faq7_q'), answer: t('serviciosBaile_faq7_a') },
      { id: '8', question: t('serviciosBaile_faq8_q'), answer: t('serviciosBaile_faq8_a') },
    ],
    [t]
  );

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('serviciosBaile_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('serviciosBaile_breadcrumb_current'),
        item: `${baseUrl}/${locale}/servicios-baile-barcelona`,
      },
    ],
  };

  // Schema Markup - Service (main) - Enhanced for LLMs
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/${locale}/servicios-baile-barcelona#services`,
    name: t('serviciosBaile_h1'),
    description: t('serviciosBaile_metaDescription'),
    serviceType: 'Dance Services',
    provider: {
      '@type': 'DanceSchool',
      '@id': `${baseUrl}/#organization`,
      name: "Farray's International Dance Center",
      alternateName: "Farray's Center",
      description:
        'Academia de baile en Barcelona con más de 25 estilos, método exclusivo Farray® y reconocimiento CID-UNESCO.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: "Carrer d'Entença, 100, Local 1",
        addressLocality: 'Barcelona',
        addressRegion: 'Cataluña',
        postalCode: '08015',
        addressCountry: 'ES',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '41.380420',
        longitude: '2.148014',
      },
      telephone: '+34622247085',
      email: 'info@farrayscenter.com',
      url: baseUrl,
      sameAs: [
        'https://www.instagram.com/farrayscenter/',
        'https://www.facebook.com/farrayscenter/',
        'https://www.youtube.com/@farrayscenter',
        'https://www.tiktok.com/@farrayscenter',
      ],
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Thursday'],
          opens: '10:30',
          closes: '23:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Wednesday'],
          opens: '17:30',
          closes: '23:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Friday'],
          opens: '17:30',
          closes: '20:30',
        },
      ],
      priceRange: '€€',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '287',
        bestRating: '5',
        worstRating: '1',
      },
    },
    areaServed: [
      { '@type': 'City', name: 'Barcelona' },
      { '@type': 'AdministrativeArea', name: 'Área Metropolitana de Barcelona' },
    ],
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${baseUrl}/${locale}/contacto`,
      servicePhone: '+34622247085',
      availableLanguage: ['Spanish', 'Catalan', 'English', 'French'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo de Servicios de Baile en Barcelona',
      itemListElement: servicesData.map((service, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: t(service.titleKey),
          description: t(service.descriptionKey),
          url: `${baseUrl}${service.url}`,
        },
        position: idx + 1,
      })),
    },
  };

  // Schema Markup - ItemList for services
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Servicios de Baile en Barcelona - Farray's Center",
    description:
      'Lista completa de servicios profesionales de baile: alquiler de salas, clases particulares, eventos corporativos, agencia de bailarines y más.',
    numberOfItems: servicesData.length,
    itemListElement: servicesData.map((service, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: t(service.titleKey),
      description: t(service.descriptionKey),
      url: `${baseUrl}${service.url}`,
    })),
  };

  // Schema Markup - LocalBusiness with hasMap (geo-local SEO)
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}/#localbusiness`,
    name: "Farray's International Dance Center",
    alternateName: "Farray's Center",
    description:
      'Academia de baile en Barcelona con servicios profesionales: alquiler de salas, clases particulares, team building, estudio de grabación y agencia de bailarines.',
    url: baseUrl,
    telephone: '+34622247085',
    email: 'info@farrayscenter.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Carrer d'Entença, 100, Local 1",
      addressLocality: 'Barcelona',
      addressRegion: 'Cataluña',
      postalCode: '08015',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.380420',
      longitude: '2.148014',
    },
    hasMap:
      'https://maps.google.com/?q=Farray%27s+International+Dance+Center,+Carrer+d%27Enten%C3%A7a+100,+Barcelona',
    image: `${baseUrl}/images/og-image.jpg`,
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Thursday'],
        opens: '10:30',
        closes: '23:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Wednesday'],
        opens: '17:30',
        closes: '23:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Friday'],
        opens: '17:30',
        closes: '20:30',
      },
    ],
    areaServed: [
      { '@type': 'City', name: 'Barcelona' },
      { '@type': 'City', name: "L'Hospitalet de Llobregat" },
      { '@type': 'Place', name: 'Eixample Esquerre' },
      { '@type': 'Place', name: 'Poble Sec' },
      { '@type': 'Place', name: 'Sant Antoni' },
      { '@type': 'Place', name: 'Les Corts' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '287',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // Breadcrumb items for visual navigation
  const breadcrumbItems = [
    { name: t('serviciosBaile_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('serviciosBaile_breadcrumb_current'),
      url: `/${locale}/servicios-baile-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('serviciosBaile_pageTitle')}</title>
        <meta name="description" content={t('serviciosBaile_metaDescription')} />
        <meta
          name="keywords"
          content="servicios baile barcelona, alquiler salas danza barcelona, clases particulares baile, team building baile, agencia bailarines barcelona, estudio grabación baile"
        />
        <link rel="canonical" href={`${baseUrl}/${locale}/servicios-baile-barcelona`} />

        {/* hreflang alternates for SEO */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/servicios-baile-barcelona`} />
        <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca/servicios-baile-barcelona`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/servicios-baile-barcelona`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/servicios-baile-barcelona`} />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es/servicios-baile-barcelona`}
        />

        {/* Open Graph */}
        <meta property="og:title" content={t('serviciosBaile_pageTitle')} />
        <meta property="og:description" content={t('serviciosBaile_metaDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/${locale}/servicios-baile-barcelona`} />
        <meta property="og:site_name" content="Farray's International Dance Center" />
        <meta property="og:locale" content={locale === 'es' ? 'es_ES' : locale} />
        <meta property="og:image" content={`${baseUrl}/images/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Servicios de Baile en Barcelona - Farray's Center" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('serviciosBaile_pageTitle')} />
        <meta name="twitter:description" content={t('serviciosBaile_metaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-image.jpg`} />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-primary-accent text-white px-4 py-2 rounded-lg font-semibold"
      >
        {t('skipToContent') || 'Saltar al contenido principal'}
      </a>

      <main className="pt-20 md:pt-24" id="main-content">
        {/* ================================================================
            SECTION 1: HERO
        ================================================================ */}
        <header
          id="servicios-baile-hero"
          className="relative z-10 text-center py-24 md:py-32 overflow-hidden flex items-center justify-center min-h-[500px]"
          aria-labelledby="servicios-hero-title"
        >
          {/* Background - Enterprise pattern - z-0 to stay below header z-50 */}
          <div className="absolute inset-0 z-0 bg-black" aria-hidden="true">
            {/* Hero background image with configurable opacity */}
            <div className="absolute inset-0" style={{ opacity: 0.4 }}>
              <picture>
                <source srcSet="/images/optimized/mgs_3447.webp" type="image/webp" />
                <img
                  src="/images/optimized/mgs_3447.jpg"
                  alt={t('servicios_hero_image_alt')}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 30%' }}
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </div>
            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-transparent to-black/50"></div>
          </div>

          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb">
              <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />
            </nav>

            {/* H1 + Intro */}
            <AnimateOnScroll>
              <h1
                id="servicios-hero-title"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 text-white holographic-text"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {t('serviciosBaile_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-6 leading-relaxed">
                {t('serviciosBaile_intro')}
              </p>
            </AnimateOnScroll>

            {/* CTA Buttons */}
            <AnimateOnScroll delay={200}>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#servicios-grid"
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('serviciosBaile_services_title')}
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </a>
                <Link
                  to={`/${locale}/contacto`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('contact')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </header>

        {/* ================================================================
            SECTION 2: INTRO SEO (for LLMs and search engines)
        ================================================================ */}
        <section className="py-10 md:py-12 bg-black" aria-labelledby="intro-seo-title">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 id="intro-seo-title" className="sr-only">
                Servicios profesionales de baile en Barcelona
              </h2>
              <AnimateOnScroll>
                <p
                  className="text-lg md:text-xl text-neutral/90 leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: t('serviciosBaile_intro_p1') }}
                />
              </AnimateOnScroll>
              <AnimateOnScroll delay={100}>
                <p
                  className="text-lg md:text-xl text-neutral/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t('serviciosBaile_intro_p2') }}
                />
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: SERVICES GRID - EXACT COPY FROM HOME
        ================================================================ */}
        <section
          id="servicios-grid"
          aria-labelledby="services-title"
          className="py-12 md:py-16 bg-primary-dark/10"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2
                  id="services-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('serviciosBaile_services_title')}
                </h2>
                <p className="text-lg text-neutral/90">{t('serviciosBaile_services_subtitle')}</p>
              </div>
            </AnimateOnScroll>
            <div className="flex flex-wrap justify-center -m-4">
              {servicesData.map((service, index) => (
                <div key={service.id} className="w-full md:w-1/2 lg:w-1/3 p-4 [perspective:1000px]">
                  <AnimateOnScroll delay={index * 50} className="h-full">
                    <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow h-full flex flex-col">
                      <div className="mb-6">
                        <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <service.Icon className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                        {t(service.titleKey)}
                      </h3>
                      <p className="text-neutral/90 leading-relaxed flex-grow mb-6 group-hover:text-neutral/90 transition-colors duration-300">
                        {t(service.descriptionKey)}
                      </p>
                      <div className="mt-auto">
                        <Link
                          to={service.url}
                          className="inline-flex items-center gap-2 font-bold text-primary-accent hover:text-white transition-all duration-300 group-hover:gap-4 focus:outline-none focus:ring-2 focus:ring-primary-accent/50 rounded-lg p-2 -m-2"
                          aria-label={`${t(service.titleKey)} - ${t(service.ctaKey)}`}
                        >
                          <span>{t(service.ctaKey)}</span>
                          <span
                            className="inline-block transition-all duration-300 group-hover:translate-x-1 group-hover:scale-125"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3.5: SERVICES SUMMARY TABLE (for citability/snippets)
        ================================================================ */}
        <section className="py-8 md:py-10 bg-black/50" aria-labelledby="summary-title">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <h2 id="summary-title" className="sr-only">
                Resumen de servicios de baile en Barcelona
              </h2>
              <table className="w-full text-left border-collapse">
                <caption className="sr-only">
                  Tabla resumen de servicios disponibles en Farray&apos;s Center Barcelona
                </caption>
                <thead>
                  <tr className="border-b border-primary-dark/40">
                    <th className="py-3 px-4 text-neutral font-bold text-sm md:text-base">
                      {t('serviciosBaile_table_service') || 'Servicio'}
                    </th>
                    <th className="py-3 px-4 text-neutral font-bold text-sm md:text-base">
                      {t('serviciosBaile_table_ideal') || 'Ideal para'}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm md:text-base">
                  <tr className="border-b border-primary-dark/20">
                    <td className="py-3 px-4 text-neutral/90">Alquiler de Salas</td>
                    <td className="py-3 px-4 text-neutral/70">
                      Ensayos, castings, sesiones de fotos
                    </td>
                  </tr>
                  <tr className="border-b border-primary-dark/20">
                    <td className="py-3 px-4 text-neutral/90">Estudio de Grabación</td>
                    <td className="py-3 px-4 text-neutral/70">
                      Videoclips, reels, contenido profesional
                    </td>
                  </tr>
                  <tr className="border-b border-primary-dark/20">
                    <td className="py-3 px-4 text-neutral/90">Clases Particulares</td>
                    <td className="py-3 px-4 text-neutral/70">
                      Aprendizaje personalizado, coreografías
                    </td>
                  </tr>
                  <tr className="border-b border-primary-dark/20">
                    <td className="py-3 px-4 text-neutral/90">Regala Baile</td>
                    <td className="py-3 px-4 text-neutral/70">
                      Regalos originales, experiencias únicas
                    </td>
                  </tr>
                  <tr className="border-b border-primary-dark/20">
                    <td className="py-3 px-4 text-neutral/90">Fiestas y Despedidas</td>
                    <td className="py-3 px-4 text-neutral/70">
                      Cumpleaños, despedidas de soltera/o
                    </td>
                  </tr>
                  <tr className="border-b border-primary-dark/20">
                    <td className="py-3 px-4 text-neutral/90">Agencia de Bailarines</td>
                    <td className="py-3 px-4 text-neutral/70">Shows, eventos, producciones</td>
                  </tr>
                  <tr className="border-b border-primary-dark/20">
                    <td className="py-3 px-4 text-neutral/90">Team Building</td>
                    <td className="py-3 px-4 text-neutral/70">Empresas, grupos corporativos</td>
                  </tr>
                  <tr className="border-b border-primary-dark/20">
                    <td className="py-3 px-4 text-neutral/90">Agencia de Eventos</td>
                    <td className="py-3 px-4 text-neutral/70">Bodas, galas, fiestas privadas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: WHY SECTION (Value Pillars) - WITH HOVER
        ================================================================ */}
        <section className="py-12 md:py-16 bg-black" aria-labelledby="why-title">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h2
                  id="why-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('serviciosBaile_why_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {VALUE_PILLARS.map((pillar, index) => (
                <AnimateOnScroll key={pillar.titleKey} delay={index * 50}>
                  <div className="group p-6 bg-primary-dark/10 border border-primary-dark/30 rounded-xl transition-all duration-500 h-full hover:border-primary-accent hover:bg-primary-dark/20 hover:shadow-accent-glow hover:-translate-y-1 hover:scale-[1.02]">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary-accent/20 p-3 rounded-lg flex-shrink-0 transition-all duration-300 group-hover:bg-primary-accent/30 group-hover:scale-110">
                        <pillar.Icon
                          className="h-6 w-6 text-primary-accent transition-all duration-300 group-hover:scale-110"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300">
                          {t(pillar.titleKey)}
                        </h3>
                        <p className="text-neutral/80 text-sm leading-relaxed group-hover:text-neutral/90 transition-colors duration-300">
                          {t(pillar.descKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 5: STATS (semantic dl/dt/dd for accessibility)
        ================================================================ */}
        <section
          className="py-12 md:py-16 bg-gradient-to-b from-black to-primary-dark/20"
          aria-labelledby="stats-title"
        >
          <div className="container mx-auto px-6">
            <h2 id="stats-title" className="sr-only">
              Estadísticas de Farray&apos;s Center
            </h2>
            <dl className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto">
              <AnimateOnScroll delay={0}>
                <div className="text-center">
                  <dt className="sr-only">{t('serviciosBaile_stats_years')}</dt>
                  <dd>
                    <AnimatedCounter
                      target={8}
                      suffix="+"
                      className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                    />
                    <span className="block text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                      {t('serviciosBaile_stats_years')}
                    </span>
                  </dd>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={50}>
                <div className="text-center">
                  <dt className="sr-only">{t('serviciosBaile_stats_students')}</dt>
                  <dd>
                    <AnimatedCounter
                      target={15000}
                      suffix="+"
                      className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                    />
                    <span className="block text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                      {t('serviciosBaile_stats_students')}
                    </span>
                  </dd>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={100}>
                <div className="text-center">
                  <dt className="sr-only">{t('serviciosBaile_stats_events')}</dt>
                  <dd>
                    <AnimatedCounter
                      target={100}
                      suffix="+"
                      className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                    />
                    <span className="block text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                      {t('serviciosBaile_stats_events')}
                    </span>
                  </dd>
                </div>
              </AnimateOnScroll>
            </dl>
          </div>
        </section>

        {/* ================================================================
            SECTION 6: REVIEWS (lazy loaded)
        ================================================================ */}
        <Suspense
          fallback={
            <div className="py-16 text-center">
              <div className="animate-pulse text-neutral/50">{t('loading') || 'Cargando...'}</div>
            </div>
          }
        >
          <ReviewsSection category="general" limit={6} showGoogleBadge={true} layout="grid" />
        </Suspense>

        {/* ================================================================
            SECTION 7: FAQ
        ================================================================ */}
        <FAQSection
          title={t('serviciosBaile_faq_title')}
          faqs={faqs}
          pageUrl={`${baseUrl}/${locale}/servicios-baile-barcelona`}
        />

        {/* ================================================================
            SECTION 8: FINAL CTA
        ================================================================ */}
        <section className="relative py-12 md:py-20 overflow-hidden" aria-labelledby="cta-title">
          {/* Background */}
          <div className="absolute inset-0 bg-black" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>

          <div className="relative z-20 container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="cta-title"
                  className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text"
                >
                  {t('serviciosBaile_finalCTA_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-8">
                  {t('serviciosBaile_finalCTA_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <Link
                to={`/${locale}/contacto`}
                className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow"
              >
                {t('contact')}
                <svg
                  className="w-6 h-6 ml-2"
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
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default ServiciosBailePage;
