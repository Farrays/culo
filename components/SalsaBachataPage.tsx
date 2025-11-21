import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import { HUB_CATEGORIES } from '../constants/danceClassesHub';
import { SALSA_BACHATA_TESTIMONIALS, SALSA_BACHATA_FAQS_CONFIG } from '../constants/salsa-bachata';
import AnimateOnScroll from './AnimateOnScroll';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import Icon, { type IconName } from './Icon';
import type { ValuePillar } from '../types';
import TestimonialsSection from './TestimonialsSection';

// Type extension for ValuePillar with icon names instead of components
type ValuePillarWithIcon = Omit<ValuePillar, 'Icon'> & { iconName: IconName };

const valuePillars: ValuePillarWithIcon[] = [
  {
    id: 'instructors',
    titleKey: 'whyPillar1Title',
    contentKey: 'whyPillar1Content',
    iconName: 'globe',
  },
  {
    id: 'farray_method',
    titleKey: 'salsaBachataWhyFarrayMethodTitle',
    contentKey: 'salsaBachataWhyFarrayMethodContent',
    iconName: 'sparkles',
  },
  { id: 'family', titleKey: 'whyPillar4Title', contentKey: 'whyPillar4Content', iconName: 'star' },
  {
    id: 'partner_dance',
    titleKey: 'salsaBachataWhyPartnerTitle',
    contentKey: 'salsaBachataWhyPartnerContent',
    iconName: 'star',
  },
  {
    id: 'prestige',
    titleKey: 'whyPillar6Title',
    contentKey: 'whyPillar6Content',
    iconName: 'academic-cap',
  },
  {
    id: 'facilities',
    titleKey: 'whyPillar3Title',
    contentKey: 'whyPillar3Content',
    iconName: 'building',
  },
];

const SalsaBachataPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  // Get the "latin" category data from HUB_CATEGORIES
  const salsaBachataCategory = HUB_CATEGORIES.find(cat => cat.key === 'latin');

  if (!salsaBachataCategory) {
    throw new Error('Category "latin" not found in HUB_CATEGORIES');
  }

  // Testimonials - usar desde constants
  const salsaBachataTestimonials = SALSA_BACHATA_TESTIMONIALS;

  // FAQs - traducir las keys dinámicamente desde constants
  const salsaBachataFaqs = SALSA_BACHATA_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('salsaBachataBarcelona_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('salsaBachataBarcelona_breadcrumb_classes'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('salsaBachataBarcelona_breadcrumb_current'),
        item: `${baseUrl}/${locale}/clases/salsa-bachata-barcelona`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('salsaBachataBarcelona_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('salsaBachataBarcelona_breadcrumb_classes'),
      url: `/${locale}/clases/baile-barcelona`,
    },
    {
      name: t('salsaBachataBarcelona_breadcrumb_current'),
      url: `/${locale}/clases/salsa-bachata-barcelona`,
      isActive: true,
    },
  ];

  // Schema Markup - ItemList (Dance Styles)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Estilos de Salsa y Bachata en Barcelona - Farray's Center",
    itemListElement: salsaBachataCategory.allStyles.map((style, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: t(`danceClassesHub_style_${style.key}`),
      url: `${baseUrl}/${locale}${style.url}`,
    })),
  };

  // Schema Markup - FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: salsaBachataFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Schema Markup - Course
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: 'Clases de Salsa y Bachata en Barcelona',
    description: t('salsaBachataBarcelona_description'),
    provider: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
      sameAs: 'https://www.farrayscenter.com',
    },
    hasCourseInstance: salsaBachataCategory.allStyles.map(style => ({
      '@type': 'CourseInstance',
      name: t(`danceClassesHub_style_${style.key}`),
      courseMode: 'onsite',
      location: {
        '@type': 'Place',
        name: "Farray's International Dance Center",
        address: {
          '@type': 'PostalAddress',
          streetAddress: "Carrer d'Entença, 100, Local 1",
          addressLocality: 'Barcelona',
          addressRegion: 'Catalonia',
          postalCode: '08015',
          addressCountry: 'ES',
        },
      },
    })),
  };

  return (
    <>
      {/* SEO metadata (title, description, og, hreflang) is handled by the global SEO.tsx component */}
      {/* Page-specific Schema Markup */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section
          id="salsa-bachata-barcelona-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            {/* H1 + Intro */}
            <AnimateOnScroll>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text">
                {t('salsaBachataBarcelona_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('salsaBachataBarcelona_intro')}
              </p>
            </AnimateOnScroll>

            {/* CTA Buttons */}
            <AnimateOnScroll delay={200}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}#enroll`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('enrollNow')}
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
                  to={`/${locale}#enroll`}
                  className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('heroCTA1')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Point 1 - What is Salsa y Bachata Section */}
        <section aria-labelledby="what-is-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <h2
                id="what-is-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-8 text-neutral text-center holographic-text"
              >
                {t('salsaBachata_whatIs_title')}
              </h2>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6">
              <AnimateOnScroll delay={100}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('salsaBachata_whatIs_salsa')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('salsaBachata_whatIs_bachata')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <h3 className="text-2xl md:text-3xl font-bold text-neutral mt-8 mb-4">
                  {t('salsaBachata_whatIs_difference_title')}
                </h3>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('salsaBachata_whatIs_difference_text')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('salsaBachata_whatIs_benefits')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Dance Styles Grid Section */}
        <section aria-labelledby="styles-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <h2
                id="styles-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-4 holographic-text"
              >
                {t('salsaBachataBarcelona_styles_title')}
              </h2>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12">
                {t('salsaBachataBarcelona_styles_description')}
              </p>
            </AnimateOnScroll>

            {/* Grid of Dance Styles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {salsaBachataCategory.allStyles.map((style, index) => (
                <AnimateOnScroll key={style.key} delay={index * 100}>
                  <Link
                    to={`/${locale}${style.url}`}
                    className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border border-white/10 hover:border-primary-accent flex flex-col"
                  >
                    {/* Image Section - Fixed Height */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={salsaBachataCategory.imageUrl}
                        alt={`${t(`danceClassesHub_style_${style.key}`)} - Clases en Barcelona`}
                        className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110"
                        loading={index < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                    </div>

                    {/* Text Section - Always Visible, Flexible Height */}
                    <div className="p-6 space-y-3 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300">
                        {t(`danceClassesHub_style_${style.key}`)}
                      </h3>
                      <p className="text-neutral/90 text-sm leading-relaxed flex-grow">
                        {t(`salsaBachata_style_${style.key}_seo`)}
                      </p>
                      <div className="text-primary-accent font-bold text-sm group-hover:translate-x-1 transition-transform duration-300">
                        {t('salsaBachataBarcelona_viewMore')}
                      </div>
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Point 2 - Comparison Table Section */}
        <section aria-labelledby="which-style-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <h2
                id="which-style-title"
                className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-neutral text-center holographic-text"
              >
                {t('salsaBachata_whichStyle_title')}
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12 text-center">
                {t('salsaBachata_whichStyle_intro')}
              </p>
            </AnimateOnScroll>

            {/* Comparison Table */}
            <AnimateOnScroll delay={200}>
              <div className="overflow-x-auto mb-12">
                <table className="w-full max-w-5xl mx-auto bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl overflow-hidden shadow-lg">
                  <thead>
                    <tr className="bg-primary-accent/20 text-white">
                      <th className="py-4 px-6 text-left font-bold text-lg border-b border-primary-accent/30">
                        {t('salsaBachata_whichStyle_tableHeader_goal')}
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-lg border-b border-primary-accent/30">
                        {t('salsaBachata_whichStyle_tableHeader_style')}
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-lg border-b border-primary-accent/30">
                        {t('salsaBachata_whichStyle_tableHeader_why')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral/90">
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_social_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_social_style')}
                      </td>
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_social_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_romantic_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_romantic_style')}
                      </td>
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_romantic_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_advanced_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_advanced_style')}
                      </td>
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_advanced_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_traditional_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_traditional_style')}
                      </td>
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_traditional_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_solo_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_solo_style')}
                      </td>
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_solo_why')}</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_beginner_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_beginner_style')}
                      </td>
                      <td className="py-4 px-6">{t('salsaBachata_whichStyle_beginner_why')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AnimateOnScroll>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <AnimateOnScroll delay={300}>
                <div className="h-full bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('salsaBachata_whichStyle_beginner_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('salsaBachata_whichStyle_beginner_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400}>
                <div className="h-full bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('salsaBachata_whichStyle_adult_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('salsaBachata_whichStyle_adult_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={500}>
                <div className="h-full bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('salsaBachata_whichStyle_combine_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('salsaBachata_whichStyle_combine_text')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Why Study at FIDC Section */}
        <section aria-labelledby="why-title" className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2
                  id="why-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('salsaBachataBarcelona_why_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <div className="flex flex-wrap justify-center -m-4">
              {valuePillars.map((pillar, index) => (
                <div key={pillar.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                  <AnimateOnScroll delay={index * 100} className="h-full">
                    <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full flex flex-col">
                      <div className="mb-6">
                        <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <Icon
                            name={pillar.iconName}
                            className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                        {t(pillar.titleKey)}
                      </h3>
                      <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                        {t(pillar.contentKey)}
                      </p>
                    </div>
                  </AnimateOnScroll>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Widget Section */}
        <section className="py-8 md:py-12 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto">
                <div className="text-center">
                  <AnimatedCounter
                    target={8}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-4xl md:text-5xl text-neutral/90 font-bold uppercase tracking-wide">
                    {t('yearsExperience')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={1500}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-4xl md:text-5xl text-neutral/90 font-bold uppercase tracking-wide">
                    {t('activeStudents')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={15000}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-4xl md:text-5xl text-neutral/90 font-bold uppercase tracking-wide">
                    {t('satisfiedStudents')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection
          titleKey="salsaBachataBarcelona_testimonials_title"
          testimonials={salsaBachataTestimonials}
        />

        {/* FAQ Section */}
        <FAQSection
          title={t('salsaBachataBarcelona_faq_title')}
          faqs={salsaBachataFaqs}
          pageUrl={`${baseUrl}/${locale}/clases/salsa-bachata-barcelona`}
        />

        {/* Final CTA Section - Conversion Optimized */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background with stars */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                {t('salsaBachataCTA_title')}
              </h2>
              <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                {t('salsaBachataCTA_subtitle')}
              </p>
              <p className="max-w-xl mx-auto text-lg text-neutral/75 mb-10">
                {t('salsaBachataCTA_description')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}#enroll`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow"
                >
                  {t('enrollNow')}
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
                <Link
                  to={`/${locale}#enroll`}
                  className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('heroCTA1')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default SalsaBachataPage;
