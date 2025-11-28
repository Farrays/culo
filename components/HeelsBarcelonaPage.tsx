import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import { HEELS_STYLES, HEELS_TESTIMONIALS, HEELS_FAQS_CONFIG } from '../constants/heels';
import AnimateOnScroll from './AnimateOnScroll';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import Icon, { type IconName } from './Icon';
import type { ValuePillar } from '../types';
import TestimonialsSection from './TestimonialsSection';
import { CourseSchema, LocalBusinessSchema } from './SchemaMarkup';

// Type extension for ValuePillar with icon names instead of components
type ValuePillarWithIcon = Omit<ValuePillar, 'Icon'> & { iconName: IconName };

const valuePillars: ValuePillarWithIcon[] = [
  {
    id: 'unesco',
    titleKey: 'heelsBarcelona_why_reason1_title',
    contentKey: 'heelsBarcelona_why_reason1_desc',
    iconName: 'academic-cap',
  },
  {
    id: 'yunaisy',
    titleKey: 'heelsBarcelona_why_reason2_title',
    contentKey: 'heelsBarcelona_why_reason2_desc',
    iconName: 'star',
  },
  {
    id: 'femininity',
    titleKey: 'heelsBarcelona_why_reason3_title',
    contentKey: 'heelsBarcelona_why_reason3_desc',
    iconName: 'sparkles',
  },
  {
    id: 'posture',
    titleKey: 'heelsBarcelona_why_reason4_title',
    contentKey: 'heelsBarcelona_why_reason4_desc',
    iconName: 'heart',
  },
  {
    id: 'facilities',
    titleKey: 'heelsBarcelona_why_reason5_title',
    contentKey: 'heelsBarcelona_why_reason5_desc',
    iconName: 'building',
  },
  {
    id: 'location',
    titleKey: 'heelsBarcelona_why_reason6_title',
    contentKey: 'heelsBarcelona_why_reason6_desc',
    iconName: 'map-pin',
  },
];

const HeelsBarcelonaPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  // Testimonials
  const heelsTestimonials = HEELS_TESTIMONIALS;

  // FAQs - translate keys dynamically
  const heelsFaqs = HEELS_FAQS_CONFIG.map(faq => ({
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
        name: t('heelsBarcelona_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('heelsBarcelona_breadcrumb_classes'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('heelsBarcelona_breadcrumb_urban'),
        item: `${baseUrl}/${locale}/clases/danzas-urbanas-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('heelsBarcelona_breadcrumb_current'),
        item: `${baseUrl}/${locale}/clases/heels-barcelona`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('heelsBarcelona_breadcrumb_home'), url: `/${locale}` },
    { name: t('heelsBarcelona_breadcrumb_classes'), url: `/${locale}/clases/baile-barcelona` },
    {
      name: t('heelsBarcelona_breadcrumb_urban'),
      url: `/${locale}/clases/danzas-urbanas-barcelona`,
    },
    {
      name: t('heelsBarcelona_breadcrumb_current'),
      url: `/${locale}/clases/heels-barcelona`,
      isActive: true,
    },
  ];

  // Schema Markup - ItemList (Heels Styles)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Estilos de Heels en Barcelona - Farray's Center",
    itemListElement: HEELS_STYLES.map((style, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: t(`heelsBarcelona_style_${style.key}_title`),
      url: `${baseUrl}/${locale}${style.url}`,
    })),
  };

  // Schema Markup - FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: heelsFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Schema Markup - AggregateRating (based on Google Reviews)
  const aggregateRatingSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: "Farray's International Dance Center - Heels Barcelona",
    description: t('heelsBarcelona_description'),
    url: `${baseUrl}/${locale}/clases/heels-barcelona`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '3',
      reviewCount: '3',
    },
  };

  return (
    <>
      {/* SEO metadata (title, description, og, hreflang) is handled by the global SEO.tsx component */}
      {/* Page-specific Schema Markup */}
      <CourseSchema
        name={t('heelsBarcelona_title')}
        description={t('heelsBarcelona_description')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner to Advanced"
        teaches="High Heels Dance, Femmology, Sexy Style, Sensuality, Femininity"
        availableLanguage={['es', 'ca', 'en', 'fr']}
      />
      <LocalBusinessSchema
        name="Farray's International Dance Center"
        description={t('heelsBarcelona_description')}
        url={baseUrl}
        telephone="+34622247085"
        email="info@farrayscenter.com"
        address={{
          streetAddress: "Carrer d'Entença, 100, Local 1",
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
        }}
        geo={{
          latitude: '41.380420',
          longitude: '2.148014',
        }}
        priceRange="€€"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(aggregateRatingSchema)}</script>
      </Helmet>

      <main className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section
          id="heels-barcelona-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/90" />

            {/* H1 + Intro */}
            <AnimateOnScroll>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text">
                {t('heelsBarcelona_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('heelsBarcelona_intro')}
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

        {/* What are Heels Classes Section - SEO CRITICAL */}
        <section aria-labelledby="what-is-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-is-title"
                  className="text-3xl md:text-4xl font-black tracking-tighter mb-8 text-center holographic-text"
                >
                  {t('heelsBarcelona_whatIs_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
              <AnimateOnScroll delay={100}>
                <p className="text-lg">{t('heelsBarcelona_whatIs_definition')}</p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <h3 className="text-2xl font-bold text-white mt-8 mb-4">
                  {t('heelsBarcelona_whatIs_benefits_title')}
                </h3>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400}>
                <ul className="list-disc list-inside space-y-2 text-lg">
                  <li>{t('heelsBarcelona_whatIs_benefits_list1')}</li>
                  <li>{t('heelsBarcelona_whatIs_benefits_list2')}</li>
                  <li>{t('heelsBarcelona_whatIs_benefits_list3')}</li>
                  <li>{t('heelsBarcelona_whatIs_benefits_list4')}</li>
                  <li>{t('heelsBarcelona_whatIs_benefits_list5')}</li>
                  <li>{t('heelsBarcelona_whatIs_benefits_list6')}</li>
                </ul>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Heels Styles Grid Section - 2 Styles */}
        <section aria-labelledby="styles-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="styles-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 holographic-text"
                >
                  {t('heelsBarcelona_styles_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12">
                {t('heelsBarcelona_styles_description')}
              </p>
            </AnimateOnScroll>

            {/* Grid of 2 Heels Styles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {HEELS_STYLES.map((style, index) => (
                <AnimateOnScroll key={style.key} delay={index * 150}>
                  <Link
                    to={`/${locale}${style.url}`}
                    className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border border-white/10 hover:border-primary-accent flex flex-col"
                  >
                    {/* Background Image - Top half of card */}
                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-600/40 to-purple-900/40"></div>
                      {/* Gradient overlay on image */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                      {/* Centered Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon
                          name="sparkles"
                          className="w-24 h-24 text-white/30 group-hover:text-primary-accent/50 transition-colors duration-500"
                        />
                      </div>
                    </div>

                    {/* Text Content - Always visible */}
                    <div className="p-6 space-y-3 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300">
                        {t(`heelsBarcelona_style_${style.key}_title`)}
                      </h3>

                      {/* SEO Text - Always visible */}
                      <p className="text-neutral/90 text-sm leading-relaxed flex-grow">
                        {t(`heelsBarcelona_style_${style.key}_seo`)}
                      </p>

                      {/* CTA Link */}
                      <div className="pt-2 text-primary-accent font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        {t('heelsBarcelona_viewMore')}
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Which Style to Choose Section */}
        <section aria-labelledby="which-style-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="which-style-title"
                  className="text-3xl md:text-4xl font-black tracking-tighter mb-6 text-center holographic-text"
                >
                  {t('heelsBarcelona_whichStyle_title')}
                </h2>
                <p className="max-w-3xl mx-auto text-center text-lg text-neutral/90 mb-12">
                  {t('heelsBarcelona_whichStyle_intro')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <AnimateOnScroll delay={100}>
                <div className="h-full bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-8 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {t('heelsBarcelona_whichStyle_femmology_title')}
                  </h3>
                  <p className="text-primary-accent text-sm font-medium mb-3">
                    {t('heelsBarcelona_whichStyle_femmology_subtitle')}
                  </p>
                  <p className="text-neutral/70 text-xs uppercase tracking-wide mb-4">
                    {t('heelsBarcelona_whichStyle_femmology_for')}
                  </p>
                  <ul className="text-neutral/90 space-y-2 text-sm mb-6 flex-grow">
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_femmology_point1')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_femmology_point2')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_femmology_point3')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_femmology_point4')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_femmology_point5')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_femmology_point6')}
                    </li>
                  </ul>
                  <Link
                    to={`/${locale}/clases/femmology-sexy-style-en-barcelona`}
                    className="inline-flex items-center justify-center w-full bg-primary-accent text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-accent-glow"
                  >
                    {t('heelsBarcelona_whichStyle_femmology_cta')}
                    <svg
                      className="w-4 h-4 ml-2"
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

              <AnimateOnScroll delay={200}>
                <div className="h-full bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-8 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {t('heelsBarcelona_whichStyle_sexystyle_title')}
                  </h3>
                  <p className="text-primary-accent text-sm font-medium mb-3">
                    {t('heelsBarcelona_whichStyle_sexystyle_subtitle')}
                  </p>
                  <p className="text-neutral/70 text-xs uppercase tracking-wide mb-4">
                    {t('heelsBarcelona_whichStyle_sexystyle_for')}
                  </p>
                  <ul className="text-neutral/90 space-y-2 text-sm mb-6 flex-grow">
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_sexystyle_point1')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_sexystyle_point2')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_sexystyle_point3')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_sexystyle_point4')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_sexystyle_point5')}
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-accent mr-2 mt-0.5">✓</span>
                      {t('heelsBarcelona_whichStyle_sexystyle_point6')}
                    </li>
                  </ul>
                  <Link
                    to={`/${locale}/clases/clases-de-sexy-style`}
                    className="inline-flex items-center justify-center w-full bg-transparent border-2 border-primary-accent text-primary-accent font-bold py-3 px-6 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white hover:scale-105"
                  >
                    {t('heelsBarcelona_whichStyle_sexystyle_cta')}
                    <svg
                      className="w-4 h-4 ml-2"
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

            {/* Comparison Table */}
            <AnimateOnScroll delay={250}>
              <div className="mt-12 max-w-4xl mx-auto overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-primary-accent/30">
                      <th className="py-4 px-4 text-left text-neutral/70 font-medium">
                        {t('heelsBarcelona_table_aspect')}
                      </th>
                      <th className="py-4 px-4 text-center text-primary-accent font-bold">
                        {t('heelsBarcelona_table_femmology')}
                      </th>
                      <th className="py-4 px-4 text-center text-white font-bold">
                        {t('heelsBarcelona_table_sexystyle')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-neutral/90">
                        {t('heelsBarcelona_table_heels')}
                      </td>
                      <td className="py-3 px-4 text-center text-primary-accent font-medium">
                        {t('heelsBarcelona_table_heels_fem')}
                      </td>
                      <td className="py-3 px-4 text-center text-neutral/90">
                        {t('heelsBarcelona_table_heels_sexy')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-neutral/90">
                        {t('heelsBarcelona_table_level')}
                      </td>
                      <td className="py-3 px-4 text-center text-primary-accent font-medium">
                        {t('heelsBarcelona_table_level_fem')}
                      </td>
                      <td className="py-3 px-4 text-center text-neutral/90">
                        {t('heelsBarcelona_table_level_sexy')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-neutral/90">
                        {t('heelsBarcelona_table_focus')}
                      </td>
                      <td className="py-3 px-4 text-center text-primary-accent font-medium">
                        {t('heelsBarcelona_table_focus_fem')}
                      </td>
                      <td className="py-3 px-4 text-center text-neutral/90">
                        {t('heelsBarcelona_table_focus_sexy')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-neutral/90">
                        {t('heelsBarcelona_table_emotional')}
                      </td>
                      <td className="py-3 px-4 text-center text-primary-accent font-medium">
                        {t('heelsBarcelona_table_emotional_fem')}
                      </td>
                      <td className="py-3 px-4 text-center text-neutral/90">
                        {t('heelsBarcelona_table_emotional_sexy')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-neutral/90">
                        {t('heelsBarcelona_table_teacher')}
                      </td>
                      <td className="py-3 px-4 text-center text-primary-accent font-medium">
                        {t('heelsBarcelona_table_teacher_fem')}
                      </td>
                      <td className="py-3 px-4 text-center text-neutral/90">
                        {t('heelsBarcelona_table_teacher_sexy')}
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-neutral/90">
                        {t('heelsBarcelona_table_ideal')}
                      </td>
                      <td className="py-3 px-4 text-center text-primary-accent font-medium">
                        {t('heelsBarcelona_table_ideal_fem')}
                      </td>
                      <td className="py-3 px-4 text-center text-neutral/90">
                        {t('heelsBarcelona_table_ideal_sexy')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AnimateOnScroll>

            {/* Additional Info Card - Combine Styles */}
            <div className="mt-12 max-w-3xl mx-auto">
              <AnimateOnScroll delay={300}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-8 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 text-center">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('heelsBarcelona_whichStyle_combine_title')}
                  </h3>
                  <p className="text-neutral/90 leading-relaxed">
                    {t('heelsBarcelona_whichStyle_combine_text')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Why Study Heels at FIDC Section */}
        <section aria-labelledby="why-title" className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2
                  id="why-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('heelsBarcelona_why_title')}
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
          titleKey="heelsBarcelona_testimonials_title"
          testimonials={heelsTestimonials}
        />

        {/* FAQ Section */}
        <FAQSection
          title={t('heelsBarcelona_faq_title')}
          faqs={heelsFaqs}
          pageUrl={`${baseUrl}/${locale}/clases/heels-barcelona`}
        />

        {/* Final CTA Section - Conversion Optimized */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background like Hero */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                  {t('heelsBarcelona_cta_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                  {t('heelsBarcelona_cta_subtitle')}
                </p>
                <p className="max-w-xl mx-auto text-lg text-neutral/75 mb-10">
                  {t('heelsBarcelona_cta_description')}
                </p>
              </div>
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
      </main>
    </>
  );
};

export default HeelsBarcelonaPage;
