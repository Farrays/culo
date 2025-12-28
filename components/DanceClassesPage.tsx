import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import { HUB_CATEGORIES, FEATURED_STYLES } from '../constants/danceClassesHub';
import { GOOGLE_REVIEWS_TESTIMONIALS } from '../constants/testimonials';
import { getStyleImage, getContextualAltKey } from '../constants/style-images';
import AnimateOnScroll from './AnimateOnScroll';
import FAQSection from './FAQSection';
import Icon from './Icon';
import AnimatedCounter from './AnimatedCounter';
import TestimonialsSection from './TestimonialsSection';
import LeadCaptureModal from './shared/LeadCaptureModal';
import OptimizedImage from './OptimizedImage';

// Category images mapping - Enterprise optimized (AVIF/WebP/JPEG srcsets)
// Uses local images with responsive breakpoints for optimal performance
const CATEGORY_IMAGES: Record<string, string> = {
  contemporary: '/images/categories/img/danza',
  urban: '/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona',
  latin: '/images/categories/img/salsa-bachata',
  fitness: '/images/categories/img/fitness',
};

const DanceClassesPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // FAQ data (EXPANDIDO para mejor SEO en motores de IA)
  const classesFaqs = [
    { id: 'cl-1', question: t('classesFaqQ1'), answer: t('classesFaqA1') },
    { id: 'cl-2', question: t('classesFaqQ2'), answer: t('classesFaqA2') },
    { id: 'cl-3', question: t('classesFaqQ3'), answer: t('classesFaqA3') },
    { id: 'cl-4', question: t('classesFaqQ4'), answer: t('classesFaqA4') },
    { id: 'cl-5', question: t('classesFaqQ5'), answer: t('classesFaqA5') },
    { id: 'cl-6', question: t('classesFaqQ6'), answer: t('classesFaqA6') },
    { id: 'cl-7', question: t('classesFaqQ7'), answer: t('classesFaqA7') },
    { id: 'cl-8', question: t('classesFaqQ8'), answer: t('classesFaqA8') },
  ];

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('danceClassesHub_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('danceClassesHub_breadcrumb_current'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('danceClassesHub_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('danceClassesHub_breadcrumb_current'),
      url: `/${locale}/clases/baile-barcelona`,
      isActive: true,
    },
  ];

  // Schema Markup - ItemList (Categories)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Categorías de clases de baile en Barcelona',
    itemListElement: HUB_CATEGORIES.map((cat, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: t(cat.titleKey),
      url: `${baseUrl}/${locale}${cat.pillarUrl}`,
    })),
  };

  // Schema Markup - FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: classesFaqs.map(faq => ({
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
      <Helmet>
        <title>{t('danceClassesHub_h1')} | Farray&apos;s Center</title>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section - Like DancehallPage */}
        <section
          id="classes-hub-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background like DancehallPage Hero */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/70" />

            {/* H1 + Intro */}
            <AnimateOnScroll>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text">
                {t('danceClassesHub_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('danceClassesHub_intro')}
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

        {/* What to Expect Section - SEO + UX CRITICAL */}
        <section aria-labelledby="what-to-expect-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-to-expect-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-8 text-neutral text-center holographic-text"
                >
                  {t('danceClassesHub_whatToExpect_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6">
              <AnimateOnScroll delay={100}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('danceClassesHub_whatToExpect_p1')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('danceClassesHub_whatToExpect_p2')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('danceClassesHub_whatToExpect_p3')}
                </p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('danceClassesHub_whatToExpect_p4')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Categories Grid Section */}
        <section aria-labelledby="categories-title" className="py-20 md:py-32 bg-primary-dark/10">
          <div className="container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="categories-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 holographic-text"
                >
                  {t('danceClassesHub_categories_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12">
                {t('danceClassesHub_categories_description')}
              </p>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {HUB_CATEGORIES.map((category, index) => (
                <AnimateOnScroll key={category.key} delay={index * 100} className="h-full">
                  <article
                    className="[perspective:1000px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 rounded-xl h-full"
                    aria-labelledby={`card-${category.key}-title`}
                  >
                    <Link
                      to={`/${locale}${category.pillarUrl}`}
                      className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border border-white/10 hover:border-primary-accent flex flex-col"
                    >
                      {/* Image Section - Top half - Enterprise Optimized */}
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={CATEGORY_IMAGES[category.key] || category.imageUrl}
                          alt={`${t(category.titleKey)} - Clases en Barcelona`}
                          aspectRatio="4/3"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 2 ? 'high' : 'low'}
                          className="w-full h-full transition-all duration-500 ease-in-out group-hover:scale-110 opacity-60 group-hover:opacity-80"
                          placeholder="color"
                          placeholderColor="#111"
                          breakpoints={[320, 640, 768, 1024]}
                        />
                        {/* Gradient overlay on image */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                      </div>

                      {/* Text Content - Always visible */}
                      <div className="p-6 space-y-3 flex-grow flex flex-col">
                        <h3
                          id={`card-${category.key}-title`}
                          className="text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t(category.titleKey)}
                        </h3>

                        {/* Description - Always visible */}
                        <p className="text-neutral/90 text-sm leading-relaxed flex-grow">
                          {t(category.descriptionKey)}
                        </p>

                        {/* CTA Link */}
                        <div className="pt-2 text-primary-accent font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300">
                          Ver estilos →
                        </div>
                      </div>
                    </Link>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Which Category to Choose Section - UX + SEO CRITICAL */}
        <section aria-labelledby="which-category-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="which-category-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-neutral text-center holographic-text"
                >
                  {t('danceClassesHub_whichCategory_title')}
                </h2>
                <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12 text-center">
                  {t('danceClassesHub_whichCategory_intro')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Comparison Table */}
            <AnimateOnScroll delay={200}>
              <div className="overflow-x-auto mb-12">
                <table className="w-full max-w-5xl mx-auto bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl overflow-hidden shadow-lg">
                  <thead>
                    <tr className="bg-primary-accent/20 text-white">
                      <th className="py-4 px-6 text-left font-bold text-lg border-b border-primary-accent/30">
                        {t('danceClassesHub_whichCategory_tableHeader_goal')}
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-lg border-b border-primary-accent/30">
                        {t('danceClassesHub_whichCategory_tableHeader_category')}
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-lg border-b border-primary-accent/30">
                        {t('danceClassesHub_whichCategory_tableHeader_why')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral/90">
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_couples_goal')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('danceClassesHub_whichCategory_couples_category')}
                      </td>
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_couples_why')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_expression_goal')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('danceClassesHub_whichCategory_expression_category')}
                      </td>
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_expression_why')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('danceClassesHub_whichCategory_urban_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('danceClassesHub_whichCategory_urban_category')}
                      </td>
                      <td className="py-4 px-6">{t('danceClassesHub_whichCategory_urban_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_fitness_goal')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('danceClassesHub_whichCategory_fitness_category')}
                      </td>
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_fitness_why')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_beginner_goal')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('danceClassesHub_whichCategory_beginner_category')}
                      </td>
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_beginner_why')}
                      </td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_morning_goal')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('danceClassesHub_whichCategory_morning_category')}
                      </td>
                      <td className="py-4 px-6">
                        {t('danceClassesHub_whichCategory_morning_why')}
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('danceClassesHub_whichCategory_world_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('danceClassesHub_whichCategory_world_category')}
                      </td>
                      <td className="py-4 px-6">{t('danceClassesHub_whichCategory_world_why')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AnimateOnScroll>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <AnimateOnScroll delay={300}>
                <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('danceClassesHub_whichCategory_beginner_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('danceClassesHub_whichCategory_beginner_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400}>
                <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('danceClassesHub_whichCategory_combine_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('danceClassesHub_whichCategory_combine_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={500}>
                <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('danceClassesHub_whichCategory_schedule_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('danceClassesHub_whichCategory_schedule_text')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Featured Styles Section - Cards with Descriptions */}
        <section aria-labelledby="featured-title" className="py-20 md:py-32 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="featured-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-center holographic-text"
                >
                  {t('danceClassesHub_featured_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12 text-center">
                {t('danceClassesHub_featured_description')}
              </p>
            </AnimateOnScroll>

            {/* Grid of Featured Styles with Descriptions - Enterprise OptimizedImage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURED_STYLES.map((style, index) => {
                const styleImage = getStyleImage(style.key);
                return (
                  <AnimateOnScroll key={style.key} delay={index * 50}>
                    <Link
                      to={`/${locale}${style.url}`}
                      className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border border-white/10 hover:border-primary-accent flex flex-col"
                    >
                      {/* Image Section - Enterprise OptimizedImage with contextual alt */}
                      <div className="relative h-48 overflow-hidden flex-shrink-0">
                        <OptimizedImage
                          src={styleImage.basePath}
                          altKey={getContextualAltKey(style.key, 'hub')}
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

                        {/* SEO Description - Always visible */}
                        <p className="text-neutral/90 text-sm leading-relaxed flex-grow">
                          {t(`danceClassesHub_style_${style.key}_desc`)}
                        </p>

                        {/* CTA Link */}
                        <div className="pt-2 text-primary-accent font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300">
                          Ver clase →
                        </div>
                      </div>
                    </Link>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why FIDC Barcelona Section - SEO + UX CRITICAL */}
        <section aria-labelledby="why-fidc-title" className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2
                  id="why-fidc-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-neutral holographic-text"
                >
                  {t('danceClassesHub_why_title')}
                </h2>
                <p className="text-xl text-neutral/80">{t('danceClassesHub_why_subtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="flex flex-wrap justify-center -m-4">
              {/* Reason 1: Variety */}
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <AnimateOnScroll delay={100} className="h-full">
                  <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
                    <div className="mb-6">
                      <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon
                          name="sparkles"
                          className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('danceClassesHub_why_variety_title')}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                      {t('danceClassesHub_why_variety_content')}
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Reason 2: Farray Method */}
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <AnimateOnScroll delay={200} className="h-full">
                  <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
                    <div className="mb-6">
                      <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon
                          name="sparkles"
                          className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('danceClassesHub_why_farray_method_title')}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                      {t('danceClassesHub_why_farray_method_content')}
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Reason 3: Cuban Technique */}
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <AnimateOnScroll delay={300} className="h-full">
                  <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
                    <div className="mb-6">
                      <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon
                          name="academic-cap"
                          className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('danceClassesHub_why_cuban_title')}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                      {t('danceClassesHub_why_cuban_content')}
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Reason 4: Real Levels */}
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <AnimateOnScroll delay={400} className="h-full">
                  <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
                    <div className="mb-6">
                      <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon
                          name="chart-bar"
                          className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('danceClassesHub_why_levels_title')}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                      {t('danceClassesHub_why_levels_content')}
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Reason 5: Location */}
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <AnimateOnScroll delay={500} className="h-full">
                  <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
                    <div className="mb-6">
                      <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon
                          name="map-pin"
                          className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('danceClassesHub_why_location_title')}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                      {t('danceClassesHub_why_location_content')}
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Reason 6: Schedule */}
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <AnimateOnScroll delay={600} className="h-full">
                  <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
                    <div className="mb-6">
                      <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon
                          name="clock"
                          className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('danceClassesHub_why_schedule_title')}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                      {t('danceClassesHub_why_schedule_content')}
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Reason 7: Accreditation */}
              <div className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <AnimateOnScroll delay={700} className="h-full">
                  <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
                    <div className="mb-6">
                      <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        <Icon
                          name="badge-check"
                          className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('danceClassesHub_why_accreditation_title')}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                      {t('danceClassesHub_why_accreditation_content')}
                    </p>
                  </div>
                </AnimateOnScroll>
              </div>
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
          titleKey="danceClassesHub_testimonials_title"
          testimonials={GOOGLE_REVIEWS_TESTIMONIALS}
        />

        {/* FAQ Section */}
        <FAQSection
          title={t('danceClassesHub_faq_title')}
          faqs={classesFaqs}
          pageUrl={`${baseUrl}/${locale}/clases/baile-barcelona`}
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
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                  {t('danceClassesHub_finalCTA_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                  {t('danceClassesHub_finalCTA_subtitle')}
                </p>
                <p className="max-w-xl mx-auto text-lg text-neutral/75 mb-10">
                  {t('danceClassesHub_finalCTA_description')}
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
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </>
  );
};

export default DanceClassesPage;
