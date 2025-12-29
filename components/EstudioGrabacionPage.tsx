import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import AnimatedCounter from './AnimatedCounter';
import FAQSection from './FAQSection';
import Icon, { type IconName } from './Icon';

const EstudioGrabacionPage: React.FC = () => {
  const { t, locale } = useI18n();
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

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('estudioGrabacion_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('estudioGrabacion_breadcrumb_current'),
        item: `${baseUrl}/${locale}/estudio-grabacion-barcelona`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('estudioGrabacion_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('estudioGrabacion_breadcrumb_current'),
      url: `/${locale}/estudio-grabacion-barcelona`,
      isActive: true,
    },
  ];

  // Schema Markup - Service
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: t('estudioGrabacion_h1'),
    description: t('estudioGrabacion_intro'),
    provider: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
      url: 'https://www.farrayscenter.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle Entença 100',
        addressLocality: 'Barcelona',
        postalCode: '08015',
        addressCountry: 'ES',
      },
      telephone: '+34622247085',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '500',
      },
    },
    areaServed: {
      '@type': 'City',
      name: 'Barcelona',
    },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      priceCurrency: 'EUR',
    },
  };

  return (
    <>
      <Helmet>
        <title>{t('estudioGrabacion_h1')} | Farray&apos;s Center</title>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: studioFaqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          })}
        </script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section
          id="estudio-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>

          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/70" />

            {/* H1 + Intro */}
            <AnimateOnScroll>
              <h1
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

        {/* FAQ Section - Sin título redundante */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <FAQSection
                title={t('estudioGrabacion_faq_title')}
                faqs={studioFaqs}
                pageUrl="/servicios/estudio-grabacion"
              />
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
