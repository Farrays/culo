import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import FAQSection from './FAQSection';
import Icon from './Icon';

const RegalaBailePage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  // Beneficios de regalar baile
  const benefits = [
    {
      iconName: 'heart' as const,
      titleKey: 'regalaBaile_benefit1_title',
      descKey: 'regalaBaile_benefit1_desc',
    },
    {
      iconName: 'sparkles' as const,
      titleKey: 'regalaBaile_benefit2_title',
      descKey: 'regalaBaile_benefit2_desc',
    },
    {
      iconName: 'users' as const,
      titleKey: 'regalaBaile_benefit3_title',
      descKey: 'regalaBaile_benefit3_desc',
    },
    {
      iconName: 'star' as const,
      titleKey: 'regalaBaile_benefit4_title',
      descKey: 'regalaBaile_benefit4_desc',
    },
    {
      iconName: 'calendar' as const,
      titleKey: 'regalaBaile_benefit5_title',
      descKey: 'regalaBaile_benefit5_desc',
    },
    {
      iconName: 'gift' as const,
      titleKey: 'regalaBaile_benefit6_title',
      descKey: 'regalaBaile_benefit6_desc',
    },
  ];

  // Ocasiones perfectas para regalar
  const occasions = [
    { iconName: 'cake' as const, titleKey: 'regalaBaile_occasion1' },
    { iconName: 'heart' as const, titleKey: 'regalaBaile_occasion2' },
    { iconName: 'academic-cap' as const, titleKey: 'regalaBaile_occasion3' },
    { iconName: 'star' as const, titleKey: 'regalaBaile_occasion4' },
    { iconName: 'users' as const, titleKey: 'regalaBaile_occasion5' },
    { iconName: 'sparkles' as const, titleKey: 'regalaBaile_occasion6' },
  ];

  // FAQs
  const faqs = [
    { id: 'regala-1', question: t('regalaBaile_faq1_q'), answer: t('regalaBaile_faq1_a') },
    { id: 'regala-2', question: t('regalaBaile_faq2_q'), answer: t('regalaBaile_faq2_a') },
    { id: 'regala-3', question: t('regalaBaile_faq3_q'), answer: t('regalaBaile_faq3_a') },
    { id: 'regala-4', question: t('regalaBaile_faq4_q'), answer: t('regalaBaile_faq4_a') },
    { id: 'regala-5', question: t('regalaBaile_faq5_q'), answer: t('regalaBaile_faq5_a') },
    { id: 'regala-6', question: t('regalaBaile_faq6_q'), answer: t('regalaBaile_faq6_a') },
    { id: 'regala-7', question: t('regalaBaile_faq7_q'), answer: t('regalaBaile_faq7_a') },
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
        name: t('headerGiftDance'),
        item: `${baseUrl}/${locale}/regala-baile`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('navHome'), url: `/${locale}` },
    { name: t('breadcrumb_services'), url: `/${locale}` },
    { name: t('headerGiftDance'), url: `/${locale}/regala-baile`, isActive: true },
  ];

  // Schema Markup - Product (Gift Card)
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Tarjeta Regalo - Clases de Baile',
    description: t('regalaBaile_meta_description'),
    brand: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: "Farray's International Dance Center",
      },
    },
  };

  // Schema Markup - FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section with Stellar Background */}
        <section className="relative min-h-[70vh] flex items-center justify-center bg-black overflow-hidden">
          {/* Stellar Background */}
          <div className="absolute inset-0 stellar-bg">
            <div className="stars"></div>
            <div className="stars2"></div>
            <div className="stars3"></div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black"></div>

          <div className="container mx-auto px-6 relative z-10 text-center">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/70" />

            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 holographic-text">
                  {t('regalaBaile_hero_title')}
                </h1>
                <p className="text-xl md:text-2xl text-neutral/90 leading-relaxed mb-8">
                  {t('regalaBaile_hero_subtitle')}
                </p>
                <p className="text-lg md:text-xl text-neutral/80 leading-relaxed max-w-3xl mx-auto mb-10">
                  {t('regalaBaile_hero_description')}
                </p>

                {/* Hero CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a
                    href="https://farrayscenter.momence.com/m/230682"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow min-w-[280px]"
                  >
                    <Icon name="gift" className="w-6 h-6 mr-3" />
                    {t('regalaBaile_cta_button')}
                  </a>
                  <a
                    href={`/${locale}/clases`}
                    className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white min-w-[280px]"
                  >
                    {t('regalaBaile_view_classes')}
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Benefits Section - Con Stellar Background */}
        <section className="relative py-20 md:py-28 bg-black overflow-hidden">
          {/* Stellar Background */}
          <div className="absolute inset-0 stellar-bg">
            <div className="stars"></div>
            <div className="stars2"></div>
            <div className="stars3"></div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

          <div className="container mx-auto px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('regalaBaile_benefits_title')}
                </h2>
                <p className="text-xl text-neutral/80 max-w-3xl mx-auto">
                  {t('regalaBaile_benefits_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {benefits.map((benefit, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 hover:-translate-y-2 h-full">
                    <div className="bg-primary-dark/30 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                      <Icon name={benefit.iconName} className="w-8 h-8 text-primary-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-4">{t(benefit.titleKey)}</h3>
                    <p className="text-neutral/80 leading-relaxed">{t(benefit.descKey)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Perfect Occasions Section */}
        <section className="py-16 md:py-20 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('regalaBaile_occasions_title')}
                </h2>
                <p className="text-xl text-neutral/80 max-w-3xl mx-auto">
                  {t('regalaBaile_occasions_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
              {occasions.map((occasion, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-6 text-center hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 hover:-translate-y-2">
                    <div className="bg-primary-dark/30 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
                      <Icon name={occasion.iconName} className="w-7 h-7 text-primary-accent" />
                    </div>
                    <p className="text-neutral font-semibold">{t(occasion.titleKey)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-black via-primary-dark/5 to-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('regalaBaile_how_title')}
                </h2>
                <p className="text-xl text-neutral/80 max-w-3xl mx-auto">
                  {t('regalaBaile_how_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {[1, 2, 3, 4].map((step, index) => (
                  <AnimateOnScroll key={step} delay={index * 150}>
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-accent to-primary-dark rounded-full flex items-center justify-center shadow-lg shadow-primary-accent/30">
                        <span className="text-3xl font-black text-white">{step}</span>
                      </div>
                      <div className="flex-1 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-6 md:p-8 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                        <h3 className="text-xl md:text-2xl font-bold text-neutral mb-3">
                          {t(`regalaBaile_step${step}_title`)}
                        </h3>
                        <p className="text-neutral/80 leading-relaxed text-base md:text-lg">
                          {t(`regalaBaile_step${step}_desc`)}
                        </p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial / Quote Section */}
        <section className="py-16 md:py-20 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-primary-dark/30 to-black border-2 border-primary-accent/50 rounded-2xl p-12 md:p-16 shadow-accent-glow text-center">
                  <Icon name="heart" className="w-16 h-16 text-primary-accent mx-auto mb-6" />
                  <blockquote className="text-2xl md:text-3xl font-semibold text-neutral mb-6 italic leading-relaxed">
                    &quot;{t('regalaBaile_quote')}&quot;
                  </blockquote>
                  <p className="text-lg text-neutral/70">{t('regalaBaile_quote_author')}</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection
          title={t('regalaBaile_faq_title')}
          faqs={faqs}
          pageUrl={`${baseUrl}/${locale}/regala-baile`}
        />

        {/* Delivery Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-black via-primary-dark/5 to-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('regalaBaile_delivery_title')}
                </h2>
                <p className="text-xl text-neutral/80 max-w-3xl mx-auto">
                  {t('regalaBaile_delivery_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <AnimateOnScroll delay={100}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary-dark/30 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="building" className="w-7 h-7 text-primary-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-neutral mb-3">
                        {t('regalaBaile_delivery_school_title')}
                      </h3>
                    </div>
                  </div>
                  <p className="text-neutral/80 leading-relaxed">
                    {t('regalaBaile_delivery_school_desc')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-primary-dark/30 w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon name="gift" className="w-7 h-7 text-primary-accent" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-neutral mb-3">
                        {t('regalaBaile_delivery_email_title')}
                      </h3>
                    </div>
                  </div>
                  <p className="text-neutral/80 leading-relaxed">
                    {t('regalaBaile_delivery_email_desc')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Final CTA Section - Con Stellar Background */}
        <section className="relative py-20 md:py-32 bg-black overflow-hidden">
          {/* Stellar Background */}
          <div className="absolute inset-0 stellar-bg">
            <div className="stars"></div>
            <div className="stars2"></div>
            <div className="stars3"></div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>

          <div className="container mx-auto px-6 text-center relative z-10">
            <AnimateOnScroll>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                {t('regalaBaile_final_cta_title')}
              </h2>
              <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                {t('regalaBaile_final_cta_subtitle')}
              </p>
              <p className="max-w-xl mx-auto text-lg text-neutral/75 mb-10">
                {t('regalaBaile_final_cta_description')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://farrayscenter.momence.com/m/230682"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow min-w-[280px]"
                >
                  <Icon name="gift" className="w-6 h-6 mr-3" />
                  {t('regalaBaile_cta_button')}
                </a>
                <a
                  href={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white min-w-[280px]"
                >
                  {t('regalaBaile_contact_us')}
                </a>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={400}>
              <p className="mt-8 text-sm text-neutral/60">{t('regalaBaile_cta_note')}</p>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default RegalaBailePage;
