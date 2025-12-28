import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import { HUB_CATEGORIES } from '../constants/danceClassesHub';
import { DANZA_TESTIMONIALS, DANZA_FAQS_CONFIG } from '../constants/danza';
import AnimateOnScroll from './AnimateOnScroll';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import Icon, { type IconName } from './Icon';
import type { ValuePillar } from '../types';
import { SUPPORTED_LOCALES } from '../types';
import TestimonialsSection from './TestimonialsSection';
import { CourseSchema, LocalBusinessSchema } from './SchemaMarkup';
import LeadCaptureModal from './shared/LeadCaptureModal';
import LazyImage from './LazyImage';
import OptimizedImage from './OptimizedImage';
import { getStyleImage, getContextualAltKey } from '../constants/style-images';

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
    titleKey: 'danzaBarcelona_why_reason7_title',
    contentKey: 'danzaBarcelona_why_reason7_desc',
    iconName: 'sparkles',
  },
  {
    id: 'cuban_school',
    titleKey: 'danzaWhyCubanSchoolTitle',
    contentKey: 'danzaWhyCubanSchoolContent',
    iconName: 'star',
  },
  {
    id: 'career',
    titleKey: 'danzaWhyCareerTitle',
    contentKey: 'danzaWhyCareerContent',
    iconName: 'trophy',
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

const DanzaBarcelonaPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Get the "contemporary" category data from HUB_CATEGORIES
  const danzaCategory = HUB_CATEGORIES.find(cat => cat.key === 'contemporary');

  if (!danzaCategory) {
    throw new Error('Category "contemporary" not found in HUB_CATEGORIES');
  }

  // Testimonials - usar desde constants
  const danzaTestimonials = DANZA_TESTIMONIALS;

  // FAQs - traducir las keys dinámicamente desde constants
  const danzaFaqs = DANZA_FAQS_CONFIG.map(faq => ({
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
        name: t('danzaBarcelona_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('danzaBarcelona_breadcrumb_classes'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('danzaBarcelona_breadcrumb_current'),
        item: `${baseUrl}/${locale}/clases/danza-barcelona`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('danzaBarcelona_breadcrumb_home'), url: `/${locale}` },
    { name: t('danzaBarcelona_breadcrumb_classes'), url: `/${locale}/clases/baile-barcelona` },
    {
      name: t('danzaBarcelona_breadcrumb_current'),
      url: `/${locale}/clases/danza-barcelona`,
      isActive: true,
    },
  ];

  // Schema Markup - ItemList (Dance Styles)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Estilos de Danza en Barcelona - Farray's Center",
    itemListElement: danzaCategory.allStyles.map((style, idx) => ({
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
    mainEntity: danzaFaqs.map(faq => ({
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
      {/* SEO metadata (title, description, og, hreflang) is handled by the global SEO.tsx component */}
      {/* Page-specific Schema Markup */}
      <CourseSchema
        name={t('danzaBarcelona_hero_title')}
        description={t('danzaBarcelona_description')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner to Advanced"
        teaches="Contemporary Dance, Modern Dance, Ballet"
        availableLanguage={SUPPORTED_LOCALES}
      />
      <LocalBusinessSchema
        name="Farray's International Dance Center"
        description={t('danzaBarcelona_description')}
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
        <title>{t('danzaBarcelona_title')} | Farray&apos;s Center</title>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section
          id="danza-barcelona-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
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
                {t('danzaBarcelona_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('danzaBarcelona_intro')}
              </p>
            </AnimateOnScroll>

            {/* CTA Button - Puertas Abiertas */}
            <AnimateOnScroll delay={200}>
              <div className="mt-12 flex flex-col items-center justify-center">
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('puertasAbiertasCTA')}
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
                </button>
                <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
                  {t('puertasAbiertasSubtext')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* What is Dance Section - SEO CRITICAL */}
        <section aria-labelledby="what-is-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-is-title"
                  className="text-3xl md:text-4xl font-black tracking-tighter mb-8 text-center holographic-text"
                >
                  {t('danzaBarcelona_whatIs_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
              <AnimateOnScroll delay={100}>
                <p className="text-lg">{t('danzaBarcelona_whatIs_definition')}</p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <p className="text-lg">{t('danzaBarcelona_whatIs_schools')}</p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <h3 className="text-2xl font-bold text-white mt-8 mb-4">
                  {t('danzaBarcelona_whatIs_contemporary_title')}
                </h3>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400}>
                <p className="text-lg">{t('danzaBarcelona_whatIs_contemporary_text')}</p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={500}>
                <p className="text-lg mt-6">{t('danzaBarcelona_whatIs_benefits')}</p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Dance Styles Grid Section */}
        <section aria-labelledby="styles-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="styles-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 holographic-text"
                >
                  {t('danzaBarcelona_styles_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12">
                {t('danzaBarcelona_styles_description')}
              </p>
            </AnimateOnScroll>

            {/* Grid of Dance Styles - Enterprise OptimizedImage with centralized config */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {danzaCategory.allStyles.map((style, index) => {
                // Get centralized image config from style-images.ts
                const styleImage = getStyleImage(style.key);

                return (
                  <AnimateOnScroll key={style.key} delay={index * 100}>
                    <Link
                      to={`/${locale}${style.url}`}
                      className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border border-white/10 hover:border-primary-accent flex flex-col"
                    >
                      {/* Background Image - Enterprise OptimizedImage with contextual SEO alt */}
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={styleImage.basePath}
                          altKey={getContextualAltKey(style.key, 'danza')}
                          altFallback={styleImage.fallbackAlt}
                          aspectRatio="4/3"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 3 ? 'high' : 'low'}
                          breakpoints={styleImage.breakpoints}
                          formats={styleImage.formats}
                          className="w-full h-full transition-all duration-500 ease-in-out group-hover:scale-110 opacity-60 group-hover:opacity-80"
                          placeholder="color"
                          placeholderColor="#111"
                        />
                        {/* Gradient overlay on image */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                      </div>

                      {/* Text Content - Always visible */}
                      <div className="p-6 space-y-3 flex-grow flex flex-col">
                        <h3 className="text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300">
                          {t(`danceClassesHub_style_${style.key}`)}
                        </h3>

                        {/* SEO Text - Always visible */}
                        <p className="text-neutral/90 text-sm leading-relaxed flex-grow">
                          {t(`danzaBarcelona_style_${style.key}_seo`)}
                        </p>

                        {/* CTA Link */}
                        <div className="pt-2 text-primary-accent font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300">
                          {t('danzaBarcelona_viewMore')}
                        </div>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* Which Style to Choose Section - UX + SEO CRITICAL */}
        <section aria-labelledby="which-style-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="which-style-title"
                  className="text-3xl md:text-4xl font-black tracking-tighter mb-6 text-center holographic-text"
                >
                  {t('danzaBarcelona_whichStyle_title')}
                </h2>
                <p className="max-w-3xl mx-auto text-center text-lg text-neutral/90 mb-12">
                  {t('danzaBarcelona_whichStyle_intro')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Comparison Table */}
            <AnimateOnScroll delay={200}>
              <div className="max-w-5xl mx-auto overflow-x-auto">
                <table className="w-full border-collapse bg-black/50 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
                  <thead>
                    <tr className="bg-primary-accent/20 border-b-2 border-primary-accent">
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        {t('danzaBarcelona_whichStyle_tableHeader_goal')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                        {t('danzaBarcelona_whichStyle_tableHeader_style')}
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell">
                        {t('danzaBarcelona_whichStyle_tableHeader_why')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {[
                      { goal: 'technique', style: 'technique', why: 'technique' },
                      { goal: 'expression', style: 'expression', why: 'expression' },
                      { goal: 'energy', style: 'energy', why: 'energy' },
                      { goal: 'cultural', style: 'cultural', why: 'cultural' },
                      { goal: 'flexibility', style: 'flexibility', why: 'flexibility' },
                      { goal: 'foundation', style: 'foundation', why: 'foundation' },
                    ].map((row, _idx) => (
                      <tr
                        key={row.goal}
                        className="hover:bg-primary-accent/10 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 text-neutral/90">
                          {t(`danzaBarcelona_whichStyle_${row.goal}_goal`)}
                        </td>
                        <td className="px-6 py-4 text-white font-bold">
                          {t(`danzaBarcelona_whichStyle_${row.style}_style`)}
                        </td>
                        <td className="px-6 py-4 text-neutral/80 text-sm hidden md:table-cell">
                          {t(`danzaBarcelona_whichStyle_${row.why}_why`)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimateOnScroll>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
              <AnimateOnScroll delay={300}>
                <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('danzaBarcelona_whichStyle_beginner_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('danzaBarcelona_whichStyle_beginner_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400}>
                <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('danzaBarcelona_whichStyle_adult_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('danzaBarcelona_whichStyle_adult_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={500}>
                <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('danzaBarcelona_whichStyle_combine_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('danzaBarcelona_whichStyle_combine_text')}
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
                  {t('whyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>
            <div className="flex flex-wrap justify-center -m-4">
              {valuePillars.map((pillar, index) => (
                <div key={pillar.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                  <AnimateOnScroll delay={index * 100} className="h-full">
                    <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
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
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('yearsExperience')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={1500}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('activeStudents')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={15000}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('satisfiedStudents')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialsSection
          titleKey="danzaBarcelona_testimonials_title"
          testimonials={danzaTestimonials}
        />

        {/* FAQ Section */}
        <FAQSection
          title={t('danzaBarcelona_faq_title')}
          faqs={danzaFaqs}
          pageUrl={`${baseUrl}/${locale}/clases/danza-barcelona`}
        />

        {/* Final CTA Section - Conversion Optimized */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background like Hero */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                  {t('danzaCTA_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                  {t('danzaCTA_subtitle')}
                </p>
                <p className="max-w-xl mx-auto text-lg text-neutral/75 mb-10">
                  {t('danzaCTA_description')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow"
                >
                  {t('puertasAbiertasCTA')}
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
                </button>
                <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
                  {t('puertasAbiertasSubtext')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Related Classes Section (Internal Linking) */}
        <section
          id="related-classes"
          aria-labelledby="related-classes-title"
          className="py-12 md:py-20"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <header className="text-center mb-8 sm:mb-12 relative z-10">
                <h2
                  id="related-classes-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('relatedClassesTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70">{t('relatedClassesSubtitle')}</p>
              </header>
            </AnimateOnScroll>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto relative z-0"
              role="list"
              aria-label={t('relatedClassesTitle')}
            >
              {/* Ballet */}
              <div role="listitem">
                <AnimateOnScroll delay={100} className="[perspective:1000px]">
                  <article className="h-full" aria-labelledby="related-ballet-title">
                    <Link
                      to={`/${locale}/clases/ballet-barcelona`}
                      className="group block h-full bg-black/70 backdrop-blur-md
                                 border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                                 transition-all duration-500
                                 [transform-style:preserve-3d]
                                 hover:border-primary-accent hover:shadow-accent-glow
                                 hover:[transform:translateY(-0.5rem)_scale(1.02)]
                                 focus:outline-none focus:ring-2 focus:ring-primary-accent
                                 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${t('relatedBalletName')} - ${t('relatedClassesViewClass')}`}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                        <LazyImage
                          src="/images/classes/ballet/img/clases-ballet-barcelona_480.webp"
                          alt={`Clase de ${t('relatedBalletName')} en Barcelona - Farray's Dance Center`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          width={480}
                          height={320}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3
                          id="related-ballet-title"
                          className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t('relatedBalletName')}
                        </h3>
                        <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                          {t('relatedBalletDesc')}
                        </p>
                        <div
                          className="flex items-center gap-2 text-primary-accent font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                          aria-hidden="true"
                        >
                          <span>{t('relatedClassesViewClass')}</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
                </AnimateOnScroll>
              </div>

              {/* Contemporáneo */}
              <div role="listitem">
                <AnimateOnScroll delay={200} className="[perspective:1000px]">
                  <article className="h-full" aria-labelledby="related-contemporaneo-title">
                    <Link
                      to={`/${locale}/clases/contemporaneo-barcelona`}
                      className="group block h-full bg-black/70 backdrop-blur-md
                                 border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                                 transition-all duration-500
                                 [transform-style:preserve-3d]
                                 hover:border-primary-accent hover:shadow-accent-glow
                                 hover:[transform:translateY(-0.5rem)_scale(1.02)]
                                 focus:outline-none focus:ring-2 focus:ring-primary-accent
                                 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${t('relatedContemporaneoName')} - ${t('relatedClassesViewClass')}`}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                        <OptimizedImage
                          src="/images/classes/contemporaneo/img/mgs_5189"
                          alt={`Clase de ${t('relatedContemporaneoName')} en Barcelona - Farray's Dance Center`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          width={480}
                          height={320}
                          breakpoints={[320, 640, 768]}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                          priority="auto"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3
                          id="related-contemporaneo-title"
                          className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t('relatedContemporaneoName')}
                        </h3>
                        <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                          {t('relatedContemporaneoDesc')}
                        </p>
                        <div
                          className="flex items-center gap-2 text-primary-accent font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                          aria-hidden="true"
                        >
                          <span>{t('relatedClassesViewClass')}</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
                </AnimateOnScroll>
              </div>

              {/* Modern Jazz */}
              <div role="listitem">
                <AnimateOnScroll delay={300} className="[perspective:1000px]">
                  <article className="h-full" aria-labelledby="related-modernjazz-title">
                    <Link
                      to={`/${locale}/clases/modern-jazz-barcelona`}
                      className="group block h-full bg-black/70 backdrop-blur-md
                                 border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                                 transition-all duration-500
                                 [transform-style:preserve-3d]
                                 hover:border-primary-accent hover:shadow-accent-glow
                                 hover:[transform:translateY(-0.5rem)_scale(1.02)]
                                 focus:outline-none focus:ring-2 focus:ring-primary-accent
                                 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${t('relatedModernJazzName')} - ${t('relatedClassesViewClass')}`}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                        <LazyImage
                          src="/images/classes/modern-jazz/img/clases-modern-jazz-barcelona_480.webp"
                          alt={`Clase de ${t('relatedModernJazzName')} en Barcelona - Farray's Dance Center`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          width={480}
                          height={320}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3
                          id="related-modernjazz-title"
                          className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t('relatedModernJazzName')}
                        </h3>
                        <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                          {t('relatedModernJazzDesc')}
                        </p>
                        <div
                          className="flex items-center gap-2 text-primary-accent font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                          aria-hidden="true"
                        >
                          <span>{t('relatedClassesViewClass')}</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </>
  );
};

export default DanzaBarcelonaPage;
