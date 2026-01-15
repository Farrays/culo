import React, { useState } from 'react';
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
import { SUPPORTED_LOCALES } from '../types';
import TestimonialsSection from './TestimonialsSection';
import { ReviewsSection } from './reviews';
import { CourseSchema, LocalBusinessSchema } from './SchemaMarkup';
import { CheckIcon } from '../lib/icons';
import LeadCaptureModal from './shared/LeadCaptureModal';
import OptimizedImage from './OptimizedImage';
import { getStyleImage, getContextualAltKey } from '../constants/style-images';

const ANIMATION_DELAYS = {
  STAGGER_SMALL: 100,
  STAGGER_MEDIUM: 150,
};

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
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

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

  return (
    <>
      {/* SEO metadata (title, description, og, hreflang) is handled by the global SEO.tsx component */}
      {/* Page-specific Schema Markup */}
      <CourseSchema
        name={t('salsaBachataBarcelona_h1')}
        description={t('salsaBachataBarcelona_description')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner to Advanced"
        teaches="Salsa Cubana, Salsa on2, Bachata Sensual, Bachata Dominicana"
        availableLanguage={SUPPORTED_LOCALES}
      />
      <LocalBusinessSchema
        name="Farray's International Dance Center"
        description={t('salsaBachataBarcelona_description')}
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
        <title>{t('salsaBachataBarcelona_title')} | Farray&apos;s Center</title>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Skip Links for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-accent focus:text-white focus:rounded-lg"
      >
        {t('skipToContent')}
      </a>
      <a
        href="#styles"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-accent focus:text-white focus:rounded-lg"
      >
        {t('skipToSchedule')}
      </a>

      <main role="main" id="main-content" className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section
          id="salsa-bachata-hero"
          aria-labelledby="salsa-bachata-hero-title"
          className="relative text-center py-24 sm:py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-black to-black"></div>
          </div>
          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            {/* H1 + Subheadline - Enterprise pattern with holographic */}
            <AnimateOnScroll>
              <h1
                id="salsa-bachata-hero-title"
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-4 min-h-[100px] md:min-h-[140px] flex flex-col items-center justify-center text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {t('salsaBachataBarcelona_h1')}
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-normal mt-2 holographic-text">
                  {t('salsaBachataBarcelona_h1_sub')}
                </span>
              </h1>
              <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('salsaBachataBarcelona_intro')}
              </p>
            </AnimateOnScroll>

            {/* CTA Button - Puertas Abiertas */}
            <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}>
              <div className="mt-12 flex flex-col items-center justify-center">
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-base sm:text-lg py-4 px-8 sm:px-10 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-accent-glow animate-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                >
                  {t('puertasAbiertasCTA')}
                  <CheckIcon className="w-5 h-5 ml-2" />
                </button>
                <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
                  {t('puertasAbiertasSubtext')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* What is Salsa y Bachata Section */}
        <section
          id="what-is-salsa-bachata"
          aria-labelledby="what-is-title"
          className="section-after-hero pb-12 sm:pb-16 md:pb-24 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-is-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-8 text-neutral text-center holographic-text"
                >
                  {t('salsaBachata_whatIs_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6">
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <p className="text-base sm:text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('salsaBachata_whatIs_salsa')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}>
                <p className="text-base sm:text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('salsaBachata_whatIs_bachata')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 3}>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral mt-8 mb-4">
                  {t('salsaBachata_whatIs_difference_title')}
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('salsaBachata_whatIs_difference_text')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 4}>
                <p className="text-base sm:text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('salsaBachata_whatIs_benefits')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Dance Styles Grid Section */}
        <section
          id="styles"
          aria-labelledby="styles-title"
          className="py-12 md:py-16 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="styles-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-4 holographic-text"
                >
                  {t('salsaBachataBarcelona_styles_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}>
              <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral/90 mb-12">
                {t('salsaBachataBarcelona_styles_description')}
              </p>
            </AnimateOnScroll>

            {/* Grid of Dance Styles */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              role="list"
              aria-label={t('salsaBachataBarcelona_styles_title')}
            >
              {salsaBachataCategory.allStyles.map((style, index) => {
                const styleImage = getStyleImage(style.key);
                return (
                  <AnimateOnScroll key={style.key} delay={index * ANIMATION_DELAYS.STAGGER_SMALL}>
                    <Link
                      to={`/${locale}${style.url}`}
                      className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border border-white/10 hover:border-primary-accent flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      role="listitem"
                    >
                      {/* Image Section - Fixed Height */}
                      <div className="relative h-40 sm:h-48 overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={styleImage.basePath}
                          altKey={getContextualAltKey(style.key, 'latin')}
                          altFallback={styleImage.fallbackAlt}
                          aspectRatio="4/3"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 3 ? 'high' : 'low'}
                          breakpoints={styleImage.breakpoints}
                          formats={styleImage.formats}
                          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                          placeholder="color"
                          placeholderColor="#111"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
                      </div>

                      {/* Text Section - Always Visible, Flexible Height */}
                      <div className="p-4 sm:p-6 space-y-3 flex-grow flex flex-col">
                        <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300">
                          {t(`danceClassesHub_style_${style.key}`)}
                        </h3>
                        <p className="text-neutral/90 text-xs sm:text-sm leading-relaxed flex-grow">
                          {t(`salsaBachata_style_${style.key}_seo`)}
                        </p>
                        <div className="text-primary-accent font-bold text-sm group-hover:translate-x-1 transition-transform duration-300">
                          {t('salsaBachataBarcelona_viewMore')}
                        </div>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section
          id="which-style"
          aria-labelledby="which-style-title"
          className="py-12 md:py-16 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="which-style-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-6 text-neutral text-center holographic-text"
                >
                  {t('salsaBachata_whichStyle_title')}
                </h2>
                <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral/90 mb-12 text-center">
                  {t('salsaBachata_whichStyle_intro')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Comparison Table */}
            <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}>
              <div className="overflow-x-auto mb-12">
                <table
                  className="w-full max-w-5xl mx-auto bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl overflow-hidden shadow-lg"
                  role="table"
                  aria-label={t('salsaBachata_whichStyle_title')}
                >
                  <thead>
                    <tr className="bg-primary-accent/20 text-white">
                      <th
                        className="py-3 sm:py-4 px-4 sm:px-6 text-left font-bold text-sm sm:text-lg border-b border-primary-accent/30"
                        scope="col"
                      >
                        {t('salsaBachata_whichStyle_tableHeader_goal')}
                      </th>
                      <th
                        className="py-3 sm:py-4 px-4 sm:px-6 text-left font-bold text-sm sm:text-lg border-b border-primary-accent/30"
                        scope="col"
                      >
                        {t('salsaBachata_whichStyle_tableHeader_style')}
                      </th>
                      <th
                        className="py-3 sm:py-4 px-4 sm:px-6 text-left font-bold text-sm sm:text-lg border-b border-primary-accent/30"
                        scope="col"
                      >
                        {t('salsaBachata_whichStyle_tableHeader_why')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral/90 text-sm sm:text-base">
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_social_goal')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_social_style')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_social_why')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_romantic_goal')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_romantic_style')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_romantic_why')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_advanced_goal')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_advanced_style')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_advanced_why')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_traditional_goal')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_traditional_style')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_traditional_why')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_solo_goal')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_solo_style')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_solo_why')}
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_beginner_goal')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-primary-accent">
                        {t('salsaBachata_whichStyle_beginner_style')}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-6">
                        {t('salsaBachata_whichStyle_beginner_why')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AnimateOnScroll>

            {/* Info Cards Grid */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto"
              role="list"
              aria-label={t('salsaBachata_whichStyle_title')}
            >
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 3}>
                <div
                  className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-4 sm:p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300"
                  role="listitem"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {t('salsaBachata_whichStyle_beginner_title')}
                  </h3>
                  <p className="text-neutral/90 text-xs sm:text-sm leading-relaxed">
                    {t('salsaBachata_whichStyle_beginner_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 4}>
                <div
                  className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-4 sm:p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300"
                  role="listitem"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {t('salsaBachata_whichStyle_adult_title')}
                  </h3>
                  <p className="text-neutral/90 text-xs sm:text-sm leading-relaxed">
                    {t('salsaBachata_whichStyle_adult_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 5}>
                <div
                  className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-4 sm:p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300"
                  role="listitem"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {t('salsaBachata_whichStyle_combine_title')}
                  </h3>
                  <p className="text-neutral/90 text-xs sm:text-sm leading-relaxed">
                    {t('salsaBachata_whichStyle_combine_text')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Why Study at FIDC Section */}
        <section id="why-fidc" aria-labelledby="why-title" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
                <h2
                  id="why-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('salsaBachataBarcelona_why_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <div
              className="flex flex-wrap justify-center -m-2 sm:-m-4"
              role="list"
              aria-label={t('salsaBachataBarcelona_why_title')}
            >
              {valuePillars.map((pillar, index) => (
                <div
                  key={pillar.id}
                  className="w-full sm:w-1/2 lg:w-1/3 p-2 sm:p-4"
                  role="listitem"
                >
                  <AnimateOnScroll
                    delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                    className="h-full"
                  >
                    <div className="group p-6 sm:p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
                      <div className="mb-4 sm:mb-6">
                        <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-3 sm:p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <Icon
                            name={pillar.iconName}
                            className="h-8 w-8 sm:h-10 sm:w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                        {t(pillar.titleKey)}
                      </h3>
                      <p className="text-neutral/90 text-sm sm:text-base leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
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
        <section id="stats" aria-labelledby="stats-title" className="py-8 md:py-12 bg-black">
          <h2 id="stats-title" className="sr-only">
            {t('trustStats')}
          </h2>
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div
                className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto"
                role="list"
                aria-label={t('trustStats')}
              >
                <div className="text-center" role="listitem">
                  <AnimatedCounter
                    target={8}
                    suffix="+"
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('yearsExperience')}
                  </p>
                </div>
                <div className="text-center" role="listitem">
                  <AnimatedCounter
                    target={1500}
                    suffix="+"
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('activeStudents')}
                  </p>
                </div>
                <div className="text-center" role="listitem">
                  <AnimatedCounter
                    target={15000}
                    suffix="+"
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
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
          titleKey="salsaBachataBarcelona_testimonials_title"
          testimonials={salsaBachataTestimonials}
        />

        {/* Google Reviews Section */}
        <ReviewsSection
          category={['salsa-cubana', 'bachata']}
          limit={4}
          showGoogleBadge={true}
          layout="grid"
        />

        {/* FAQ Section */}
        <FAQSection
          title={t('salsaBachataBarcelona_faq_title')}
          faqs={salsaBachataFaqs}
          pageUrl={`${baseUrl}/${locale}/clases/salsa-bachata-barcelona`}
        />

        {/* Final CTA Section - Conversion Optimized */}
        <section
          id="final-cta"
          aria-labelledby="final-cta-title"
          className="relative py-12 md:py-16 overflow-hidden"
        >
          {/* Background with stars */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-black to-black"></div>
          </div>
          <div className="relative z-20 container mx-auto px-4 sm:px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="final-cta-title"
                  className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text"
                >
                  {t('salsaBachataCTA_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-neutral/90 mb-4">
                  {t('salsaBachataCTA_subtitle')}
                </p>
                <p className="max-w-xl mx-auto text-base sm:text-lg text-neutral/75 mb-10">
                  {t('salsaBachataCTA_description')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}>
              <div className="flex flex-col items-center justify-center">
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg sm:text-xl py-4 sm:py-5 px-10 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-accent-glow animate-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                >
                  {t('puertasAbiertasCTA')}
                  <CheckIcon className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
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
          className="py-12 md:py-16"
        >
          <div className="container mx-auto px-4 sm:px-6">
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
              {/* Salsa Cubana */}
              <div role="listitem">
                <AnimateOnScroll
                  delay={ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <article className="h-full" aria-labelledby="related-salsacubana-title">
                    <Link
                      to={`/${locale}/clases/salsa-cubana-barcelona`}
                      className="group block h-full bg-black/70 backdrop-blur-md
                                 border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                                 transition-all duration-500
                                 [transform-style:preserve-3d]
                                 hover:border-primary-accent hover:shadow-accent-glow
                                 hover:[transform:translateY(-0.5rem)_scale(1.02)]
                                 focus:outline-none focus:ring-2 focus:ring-primary-accent
                                 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${t('relatedSalsaCubanaName')} - ${t('relatedClassesViewClass')}`}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                        <OptimizedImage
                          src={getStyleImage('salsa_cubana').basePath}
                          altKey={getContextualAltKey('salsa_cubana', 'latin')}
                          altFallback="Pareja bailando salsa cubana en Barcelona - ritmo caribeño y técnica casino en Farray's Center"
                          aspectRatio="3/2"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority="low"
                          breakpoints={getStyleImage('salsa_cubana').breakpoints}
                          formats={getStyleImage('salsa_cubana').formats}
                          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                          placeholder="color"
                          placeholderColor="#111"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3
                          id="related-salsacubana-title"
                          className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t('relatedSalsaCubanaName')}
                        </h3>
                        <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                          {t('relatedSalsaCubanaDesc')}
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

              {/* Bachata */}
              <div role="listitem">
                <AnimateOnScroll
                  delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}
                  className="[perspective:1000px]"
                >
                  <article className="h-full" aria-labelledby="related-bachata-title">
                    <Link
                      to={`/${locale}/clases/bachata-barcelona`}
                      className="group block h-full bg-black/70 backdrop-blur-md
                                 border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                                 transition-all duration-500
                                 [transform-style:preserve-3d]
                                 hover:border-primary-accent hover:shadow-accent-glow
                                 hover:[transform:translateY(-0.5rem)_scale(1.02)]
                                 focus:outline-none focus:ring-2 focus:ring-primary-accent
                                 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${t('relatedBachataName')} - ${t('relatedClassesViewClass')}`}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                        <OptimizedImage
                          src={getStyleImage('bachata_sensual').basePath}
                          altKey={getContextualAltKey('bachata_sensual', 'latin')}
                          altFallback={getStyleImage('bachata_sensual').fallbackAlt}
                          aspectRatio="3/2"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority="low"
                          breakpoints={getStyleImage('bachata_sensual').breakpoints}
                          formats={getStyleImage('bachata_sensual').formats}
                          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                          placeholder="color"
                          placeholderColor="#111"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3
                          id="related-bachata-title"
                          className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t('relatedBachataName')}
                        </h3>
                        <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                          {t('relatedBachataDesc')}
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

              {/* Timba */}
              <div role="listitem">
                <AnimateOnScroll
                  delay={ANIMATION_DELAYS.STAGGER_SMALL * 3}
                  className="[perspective:1000px]"
                >
                  <article className="h-full" aria-labelledby="related-timba-title">
                    <Link
                      to={`/${locale}/clases/timba-barcelona`}
                      className="group block h-full bg-black/70 backdrop-blur-md
                                 border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                                 transition-all duration-500
                                 [transform-style:preserve-3d]
                                 hover:border-primary-accent hover:shadow-accent-glow
                                 hover:[transform:translateY(-0.5rem)_scale(1.02)]
                                 focus:outline-none focus:ring-2 focus:ring-primary-accent
                                 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${t('relatedTimbaName')} - ${t('relatedClassesViewClass')}`}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                        <OptimizedImage
                          src={getStyleImage('timba_cubana').basePath}
                          altKey={getContextualAltKey('timba_cubana', 'latin')}
                          altFallback="Clase de Timba Cubana en Barcelona - ritmo cubano moderno con energía y sabor en Farray's Center"
                          aspectRatio="3/2"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority="low"
                          breakpoints={getStyleImage('timba_cubana').breakpoints}
                          formats={getStyleImage('timba_cubana').formats}
                          className="w-full h-full transition-transform duration-500 group-hover:scale-110"
                          placeholder="color"
                          placeholderColor="#111"
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3
                          id="related-timba-title"
                          className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t('relatedTimbaName')}
                        </h3>
                        <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                          {t('relatedTimbaDesc')}
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
      </main>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </>
  );
};

export default SalsaBachataPage;
