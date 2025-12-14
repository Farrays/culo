import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  PREPARACION_FISICA_TESTIMONIALS,
  PREPARACION_FISICA_FAQS_CONFIG,
} from '../constants/preparacion-fisica';
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
    id: 'farray_method',
    titleKey: 'prepFisica_why_farray_method_title',
    contentKey: 'prepFisica_why_farray_method_content',
    iconName: 'sparkles',
  },
  {
    id: 'specialized',
    titleKey: 'prepFisica_why_specialized_title',
    contentKey: 'prepFisica_why_specialized_content',
    iconName: 'trophy',
  },
  {
    id: 'injury_prevention',
    titleKey: 'prepFisica_why_injury_title',
    contentKey: 'prepFisica_why_injury_content',
    iconName: 'badge-check',
  },
  {
    id: 'performance',
    titleKey: 'prepFisica_why_performance_title',
    contentKey: 'prepFisica_why_performance_content',
    iconName: 'star',
  },
  {
    id: 'flexibility',
    titleKey: 'prepFisica_why_flexibility_title',
    contentKey: 'prepFisica_why_flexibility_content',
    iconName: 'globe',
  },
  {
    id: 'strength',
    titleKey: 'prepFisica_why_strength_title',
    contentKey: 'prepFisica_why_strength_content',
    iconName: 'academic-cap',
  },
];

// Training activities offered
interface TrainingActivity {
  key: string;
  imageUrl: string;
}

const trainingActivities: TrainingActivity[] = [
  {
    key: 'body_conditioning',
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80&auto=format',
  },
  {
    key: 'bum_bum_gluteos',
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80&auto=format',
  },
  {
    key: 'bum_bum_fit',
    imageUrl:
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop&q=80&auto=format',
  },
  {
    key: 'yoga_flow',
    imageUrl:
      'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&h=600&fit=crop&q=80&auto=format',
  },
  {
    key: 'dance_barre',
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80&auto=format',
  },
  {
    key: 'mate_pilates',
    imageUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop&q=80&auto=format',
  },
];

const PreparacionFisicaBailarinesPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  // FAQ data for Preparación Física from constants
  const prepFisicaFaqs = PREPARACION_FISICA_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials from constants
  const preparacionFisicaTestimonials = PREPARACION_FISICA_TESTIMONIALS;

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('prepFisica_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('prepFisica_breadcrumb_classes'),
        item: `${baseUrl}/${locale}/clases`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('prepFisica_breadcrumb_current'),
        item: `${baseUrl}/${locale}/clases/entrenamiento-bailarines-barcelona`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('prepFisica_breadcrumb_home'), url: `/${locale}` },
    { name: t('prepFisica_breadcrumb_classes'), url: `/${locale}/clases` },
    {
      name: t('prepFisica_breadcrumb_current'),
      url: `/${locale}/clases/entrenamiento-bailarines-barcelona`,
      isActive: true,
    },
  ];

  // Schema Markup - ItemList (Training Activities)
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Actividades de Preparación Física para Bailarines en Barcelona - Farray's Center",
    itemListElement: trainingActivities.map((activity, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: t(`prepFisica_activity_${activity.key}_title`),
    })),
  };

  // Schema Markup - FAQPage
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: prepFisicaFaqs.map(faq => ({
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
    name: 'Preparación Física para Bailarines en Barcelona',
    description: t('prepFisica_description'),
    provider: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
      sameAs: 'https://www.farrayscenter.com',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      name: 'Preparación Física para Bailarines',
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
    },
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
          id="prep-fisica-hero"
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
                {t('prepFisica_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('prepFisica_intro')}
              </p>
            </AnimateOnScroll>

            {/* CTA Buttons */}
            <AnimateOnScroll delay={200}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}#enroll`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
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
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('heroCTA1')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Training Activities Grid Section */}
        <section aria-labelledby="activities-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="activities-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 holographic-text"
                >
                  {t('prepFisica_activities_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12">
                {t('prepFisica_activities_description')}
              </p>
            </AnimateOnScroll>

            {/* Grid of Training Activities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainingActivities.map((activity, index) => (
                <AnimateOnScroll key={activity.key} delay={index * 100}>
                  <div className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border border-white/10 hover:border-primary-accent flex flex-col">
                    {/* Background Image - Top half of card */}
                    <div className="relative h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={activity.imageUrl}
                        alt={`${t(`prepFisica_activity_${activity.key}_title`)} - Clases en Barcelona`}
                        width="800"
                        height="600"
                        className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-110 opacity-60 group-hover:opacity-80"
                        loading={index < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      {/* Gradient overlay on image */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                    </div>

                    {/* Text Content - Always visible */}
                    <div className="p-6 space-y-3 flex-grow flex flex-col">
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300">
                        {t(`prepFisica_activity_${activity.key}_title`)}
                      </h3>

                      {/* SEO Text - Always visible */}
                      <p className="text-neutral/90 text-sm leading-relaxed flex-grow">
                        {t(`prepFisica_activity_${activity.key}_desc`)}
                      </p>

                      {/* CTA Link */}
                      <div className="pt-2 text-primary-accent font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300">
                        {t('prepFisica_viewMore')}
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Which Activity to Choose Section - UX + SEO CRITICAL */}
        <section aria-labelledby="which-activity-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="which-activity-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-neutral text-center holographic-text"
                >
                  {t('prepFisica_whichActivity_title')}
                </h2>
                <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12 text-center">
                  {t('prepFisica_whichActivity_intro')}
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
                        {t('prepFisica_whichActivity_tableHeader_goal')}
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-lg border-b border-primary-accent/30">
                        {t('prepFisica_whichActivity_tableHeader_activity')}
                      </th>
                      <th className="py-4 px-6 text-left font-bold text-lg border-b border-primary-accent/30">
                        {t('prepFisica_whichActivity_tableHeader_why')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral/90">
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">
                        {t('prepFisica_whichActivity_flexibility_goal')}
                      </td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('prepFisica_whichActivity_flexibility_activity')}
                      </td>
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_flexibility_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_strength_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('prepFisica_whichActivity_strength_activity')}
                      </td>
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_strength_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_glutes_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('prepFisica_whichActivity_glutes_activity')}
                      </td>
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_glutes_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_fullBody_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('prepFisica_whichActivity_fullBody_activity')}
                      </td>
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_fullBody_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_balance_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('prepFisica_whichActivity_balance_activity')}
                      </td>
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_balance_why')}</td>
                    </tr>
                    <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_technique_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('prepFisica_whichActivity_technique_activity')}
                      </td>
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_technique_why')}</td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_core_goal')}</td>
                      <td className="py-4 px-6 font-semibold text-primary-accent">
                        {t('prepFisica_whichActivity_core_activity')}
                      </td>
                      <td className="py-4 px-6">{t('prepFisica_whichActivity_core_why')}</td>
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
                    {t('prepFisica_whichActivity_beginner_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('prepFisica_whichActivity_beginner_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400}>
                <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('prepFisica_whichActivity_complement_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('prepFisica_whichActivity_complement_text')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={500}>
                <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {t('prepFisica_whichActivity_combine_title')}
                  </h3>
                  <p className="text-neutral/90 text-sm leading-relaxed">
                    {t('prepFisica_whichActivity_combine_text')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Why Train at FIDC Section */}
        <section aria-labelledby="why-title" className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2
                  id="why-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('prepFisica_why_title')}
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
          titleKey="prepFisica_testimonials_title"
          testimonials={preparacionFisicaTestimonials}
        />

        {/* FAQ Section */}
        <FAQSection
          title={t('prepFisica_faq_title')}
          faqs={prepFisicaFaqs}
          pageUrl={`${baseUrl}/${locale}/clases/entrenamiento-bailarines-barcelona`}
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
                  {t('prepFisica_finalCTA_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                  {t('prepFisica_finalCTA_subtitle')}
                </p>
                <p className="max-w-xl mx-auto text-lg text-neutral/75 mb-10">
                  {t('prepFisica_finalCTA_description')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}#enroll`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
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
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
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

export default PreparacionFisicaBailarinesPage;
