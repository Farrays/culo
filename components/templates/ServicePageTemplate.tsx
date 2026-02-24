/**
 * ServicePageTemplate - Enterprise Template for Service Pages
 *
 * A reusable, enterprise-grade template for generating service pages
 * (Team Building, Events Agency, Parties, etc.) following:
 * - SEO 2025 best practices
 * - WCAG 2.2 accessibility requirements
 * - E-E-A-T trust signals
 * - LLM optimization for citability
 * - Schema.org LocalBusiness + Service markup
 *
 * @see ROADMAP_ENTERPRISE.md for design decisions
 */

import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '../shared/Breadcrumb';
import AnimateOnScroll from '../AnimateOnScroll';
import AnimatedCounter from '../AnimatedCounter';
import FAQSection from '../FAQSection';
import Icon from '../Icon';
import { ReviewsSection } from '../reviews';
import LeadCaptureModal from '../shared/LeadCaptureModal';
import { PhoneIcon, CheckCircleIcon, ShieldCheckIcon } from '../../lib/icons';

import type {
  ServicePageTemplateProps,
  ServiceHeroProps,
  TrustBarProps,
  ProblemSolutionProps,
  FeaturesGridProps,
  BenefitsSectionProps,
  ProcessSectionProps,
  IdealForSectionProps,
  PackagesSectionProps,
  StatsSectionProps,
  SummaryTableProps,
  RelatedServicesSectionProps,
  FinalCTAProps,
  BreadcrumbItem,
} from './ServicePageTemplate.types';

// =============================================================================
// CONSTANTS
// =============================================================================

const BASE_URL = 'https://www.farrayscenter.com';
const LOCALES = ['es', 'ca', 'en', 'fr'] as const;
const DEFAULT_OG_IMAGE = '/images/og-image.jpg';

// Business info for schemas
const BUSINESS_INFO = {
  name: "Farray's International Dance Center",
  alternateName: "Farray's Center",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  telephone: '+34622247085',
  email: 'info@farrayscenter.com',
  foundingDate: '2017',
  address: {
    streetAddress: "Carrer d'Entença, 100, Local 1",
    addressLocality: 'Barcelona',
    addressRegion: 'Catalonia',
    postalCode: '08015',
    addressCountry: 'ES',
  },
  geo: {
    latitude: '41.380421',
    longitude: '2.148014',
  },
  // aggregateRating removed - only in build-time LocalBusiness (#danceschool)
  sameAs: [
    'https://www.instagram.com/farrays_centerbcn/',
    'https://www.facebook.com/farrayscenter/',
    'https://www.youtube.com/@farraysinternationaldance',
    'https://www.tiktok.com/@farrays_centerbcn',
  ],
};

// =============================================================================
// INTERNAL COMPONENTS
// =============================================================================

/**
 * Skip to Content Link (WCAG 2.2)
 */
const SkipLink: React.FC = () => {
  const { t } = useTranslation([
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

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-[9999] focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-primary-accent focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
    >
      {t('skip_to_content') || 'Saltar al contenido principal'}
    </a>
  );
};

/**
 * Hero Section with Breadcrumb, H1, Intro, and CTAs
 */
const ServiceHero: React.FC<ServiceHeroProps> = ({
  gradient,
  titleKey,
  subtitleKey,
  introKey,
  breadcrumbItems,
  heroImage,
  showPhoneButton = true,
  ctaPhone,
  ctaWhatsApp,
}) => {
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

  return (
    <section
      id="hero"
      className="relative text-center py-16 md:py-24 overflow-hidden flex items-center justify-center min-h-[500px]"
      aria-labelledby="hero-title"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        {heroImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        )}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} via-black to-black`} />
      </div>

      <div className="relative z-20 container mx-auto px-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} textColor="text-neutral/90" />

        {/* H1 + Subtitle */}
        <AnimateOnScroll>
          <h1
            id="hero-title"
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-4 min-h-[100px] md:min-h-[140px] flex flex-col items-center justify-center text-white"
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)',
            }}
          >
            {t(titleKey)}
            {subtitleKey && (
              <>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-normal mt-2 holographic-text">
                  {t(subtitleKey)}
                </span>
              </>
            )}
          </h1>

          {/* Intro paragraph (LLM-optimized) */}
          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
            {t(introKey)}
          </p>
        </AnimateOnScroll>

        {/* CTAs */}
        <AnimateOnScroll delay={200}>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary CTA - Link to contact page */}
            <Link
              to={`/${locale}/contacto`}
              className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              {t('contactUs')}
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
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>

            {/* Secondary CTA - Phone or WhatsApp (optional) */}
            {showPhoneButton && (ctaPhone || ctaWhatsApp) && (
              <a
                href={ctaWhatsApp ? `https://wa.me/${ctaWhatsApp}` : `tel:${ctaPhone}`}
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm text-white font-semibold text-lg py-4 px-8 rounded-full border border-white/20 transition-all duration-300 hover:bg-white/20 hover:border-white/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                target={ctaWhatsApp ? '_blank' : undefined}
                rel={ctaWhatsApp ? 'noopener noreferrer' : undefined}
              >
                <PhoneIcon className="w-5 h-5 mr-2" />
                {ctaPhone || ctaWhatsApp}
              </a>
            )}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

/**
 * Trust Bar (E-E-A-T signals) - Home-style pills
 */
const TrustBar: React.FC<TrustBarProps> = ({ signals }) => {
  const { t } = useTranslation([
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

  if (!signals || signals.length === 0) return null;

  return (
    <section className="py-8 bg-black" aria-label={t('trust_signals') || 'Trust signals'}>
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {signals.map(signal => (
            <div
              key={signal.id}
              className="flex items-center gap-2 bg-neutral/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary-accent/30 transition-all duration-300 hover:border-primary-accent/60 hover:bg-neutral/15"
            >
              {signal.id === 'rating' ? (
                <>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-neutral font-bold text-sm">{t(signal.valueKey)}</span>
                  <span className="text-neutral/60 text-xs">{t(signal.labelKey)}</span>
                </>
              ) : signal.iconName ? (
                <>
                  <Icon name={signal.iconName} className="w-4 h-4 text-primary-accent" />
                  <span className="text-primary-accent font-bold text-sm">
                    {t(signal.valueKey)}
                  </span>
                  <span className="text-neutral/80 text-xs">{t(signal.labelKey)}</span>
                </>
              ) : (
                <>
                  <span className="text-primary-accent font-bold text-sm">
                    {t(signal.valueKey)}
                  </span>
                  <span className="text-neutral/80 text-xs">{t(signal.labelKey)}</span>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Problem/Solution Section
 */
const ProblemSolution: React.FC<ProblemSolutionProps> = ({
  problemTitleKey,
  problemDescKey,
  solutionTitleKey,
  solutionDescKey,
}) => {
  const { t } = useTranslation([
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

  return (
    <section className="py-12 md:py-16 bg-black" aria-labelledby="problem-solution-title">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Problem */}
          <AnimateOnScroll>
            <div className="p-6 bg-red-900/10 border border-red-900/30 rounded-2xl">
              <h2
                id="problem-solution-title"
                className="text-2xl md:text-3xl font-bold text-white mb-4"
              >
                {t(problemTitleKey)}
              </h2>
              <p className="text-neutral/80 leading-relaxed">{t(problemDescKey)}</p>
            </div>
          </AnimateOnScroll>

          {/* Solution */}
          <AnimateOnScroll delay={100}>
            <div className="p-6 bg-primary-accent/10 border border-primary-accent/30 rounded-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t(solutionTitleKey)}
              </h2>
              <p className="text-neutral/80 leading-relaxed">{t(solutionDescKey)}</p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

/**
 * Features Grid
 */
const FeaturesGrid: React.FC<FeaturesGridProps> = ({ titleKey, features, columns }) => {
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

  const gridCols =
    columns === 2 ? 'lg:grid-cols-2' : columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  return (
    <section className="py-12 md:py-16 bg-primary-dark/10" aria-labelledby="features-title">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <h2
            id="features-title"
            className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-12 holographic-text"
          >
            {t(titleKey)}
          </h2>
        </AnimateOnScroll>

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
          {features.map((feature, index) => (
            <AnimateOnScroll key={feature.id} delay={index * 100} className="[perspective:1000px]">
              <div
                className={`group h-full p-6 bg-black/50 backdrop-blur-md border rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow ${
                  feature.isHighlighted
                    ? 'border-primary-accent'
                    : 'border-primary-dark/50 hover:border-primary-accent'
                }`}
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-3 rounded-xl inline-block transition-all duration-300 group-hover:scale-110">
                    <Icon name={feature.iconName} className="w-8 h-8 text-primary-accent" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-accent transition-colors duration-300">
                  {t(feature.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-neutral/80 leading-relaxed">{t(feature.descriptionKey)}</p>

                {/* Optional Link */}
                {feature.linkUrl && (
                  <Link
                    to={`/${locale}${feature.linkUrl}`}
                    className="inline-flex items-center mt-4 text-primary-accent font-semibold text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black rounded"
                  >
                    {t('learnMore') || 'Saber m\u00E1s'}
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Benefits Section (Why Choose Us)
 */
const BenefitsSection: React.FC<BenefitsSectionProps> = ({ titleKey, benefits }) => {
  const { t } = useTranslation([
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

  return (
    <section className="py-12 md:py-16 bg-black" aria-labelledby="benefits-title">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <h2
            id="benefits-title"
            className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-12 holographic-text"
          >
            {t(titleKey)}
          </h2>
        </AnimateOnScroll>

        <div className="flex flex-wrap justify-center -m-4">
          {benefits.map((benefit, index) => (
            <div key={benefit.id} className="w-full sm:w-1/2 lg:w-1/3 p-4 [perspective:1000px]">
              <AnimateOnScroll delay={index * 100} className="h-full">
                <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_scale(1.02)] hover:border-primary-accent hover:shadow-accent-glow h-full min-h-[180px] flex flex-col">
                  <div className="mb-6">
                    <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110">
                      <Icon
                        name={benefit.iconName}
                        className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                    {t(benefit.titleKey)}
                  </h3>
                  <p className="text-neutral/90 leading-relaxed flex-grow">
                    {t(benefit.descriptionKey)}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Process Section (How It Works) - Premium with theme colors
 */
const ProcessSection: React.FC<ProcessSectionProps> = ({ titleKey, steps }) => {
  const { t } = useTranslation([
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

  return (
    <section className="py-16 md:py-24 bg-black" aria-labelledby="process-title">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <h2
            id="process-title"
            className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-16 md:mb-20 holographic-text"
          >
            {t(titleKey)}
          </h2>
        </AnimateOnScroll>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical line connector with theme color */}
            <div
              className="absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-primary-accent via-primary-dark to-primary-accent hidden md:block rounded-full opacity-40"
              aria-hidden="true"
            />

            {steps.map((step, index) => (
              <AnimateOnScroll key={step.id} delay={index * 150}>
                <div className="flex items-start gap-8 mb-16 last:mb-0 group">
                  {/* Step number with theme color */}
                  <div className="flex-shrink-0 w-16 h-16 bg-primary-accent rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg relative z-10 transition-all duration-500 group-hover:scale-110 group-hover:shadow-accent-glow">
                    {step.stepNumber}
                  </div>

                  {/* Content */}
                  <div className="flex-grow pt-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-primary-accent transition-colors duration-300">
                      {t(step.titleKey)}
                    </h3>
                    <p className="text-neutral/80 leading-relaxed text-lg">
                      {t(step.descriptionKey)}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Ideal For Section (Target Audience) - With premium hover effects
 */
const IdealForSection: React.FC<IdealForSectionProps> = ({ titleKey, items }) => {
  const { t } = useTranslation([
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

  return (
    <section className="py-12 md:py-16 bg-primary-dark/5" aria-labelledby="ideal-for-title">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <h2
            id="ideal-for-title"
            className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-12 holographic-text"
          >
            {t(titleKey)}
          </h2>
        </AnimateOnScroll>

        <div className="max-w-4xl mx-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="list">
            {items.map((item, index) => (
              <AnimateOnScroll key={item.id} delay={index * 50}>
                <li className="group flex items-start gap-4 p-5 bg-black/50 backdrop-blur-md border border-primary-dark/30 rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:border-primary-accent hover:shadow-accent-glow cursor-default">
                  <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-2 rounded-lg transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                    <CheckCircleIcon className="w-6 h-6 text-primary-accent" />
                  </div>
                  <span className="text-neutral/90 group-hover:text-white transition-colors duration-300 leading-relaxed pt-1">
                    {t(item.textKey)}
                  </span>
                </li>
              </AnimateOnScroll>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

/**
 * Packages Section
 */
const PackagesSection: React.FC<PackagesSectionProps> = ({ titleKey, packages }) => {
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

  return (
    <section className="py-12 md:py-16 bg-primary-dark/10" aria-labelledby="packages-title">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <h2
            id="packages-title"
            className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-12 holographic-text"
          >
            {t(titleKey)}
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg, index) => (
            <AnimateOnScroll key={pkg.id} delay={index * 100}>
              <div
                className={`group relative p-6 bg-black/50 backdrop-blur-md border rounded-2xl transition-all duration-500 h-full flex flex-col [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] ${
                  pkg.isPopular
                    ? 'border-primary-accent shadow-accent-glow'
                    : 'border-primary-dark/50 hover:border-primary-accent hover:shadow-accent-glow'
                }`}
              >
                {/* Popular badge */}
                {pkg.badgeKey && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-accent text-white text-sm font-bold rounded-full">
                    {t(pkg.badgeKey)}
                  </div>
                )}

                <h3 className="text-2xl font-bold text-white mb-2 mt-2 group-hover:text-primary-accent transition-colors duration-300">
                  {t(pkg.titleKey)}
                </h3>

                {pkg.priceKey && (
                  <p className="text-3xl font-black text-primary-accent mb-4">{t(pkg.priceKey)}</p>
                )}

                <p className="text-neutral/70 mb-6 group-hover:text-neutral/90 transition-colors duration-300">
                  {t(pkg.descriptionKey)}
                </p>

                <ul className="space-y-3 mb-6 flex-grow">
                  {pkg.featureKeys.map((featureKey, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircleIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-neutral/80 group-hover:text-neutral transition-colors duration-300">
                        {t(featureKey)}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/${locale}/contacto`}
                  className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black ${
                    pkg.isPopular
                      ? 'bg-primary-accent text-white hover:bg-primary-accent/90 hover:scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:scale-105'
                  }`}
                >
                  {t(pkg.ctaKey || 'contactUs')}
                </Link>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Stats Section
 */
const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const { t } = useTranslation([
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

  return (
    <section className="py-8 md:py-12 bg-black" aria-label="Statistics">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <dl className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto">
            {stats.map(stat => (
              <div key={stat.id} className="text-center">
                <dt className="sr-only">{t(stat.labelKey)}</dt>
                <dd>
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix || ''}
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t(stat.labelKey)}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

/**
 * Summary Table (LLM Citability)
 */
const SummaryTable: React.FC<SummaryTableProps> = ({ titleKey, headers, rows }) => {
  const { t } = useTranslation([
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

  return (
    <section className="py-12 md:py-16 bg-black" aria-labelledby="summary-table-title">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <h2
            id="summary-table-title"
            className="text-3xl md:text-4xl font-black tracking-tighter text-center mb-8 holographic-text"
          >
            {t(titleKey)}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={100}>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-black/50 border border-primary-dark/30 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-primary-dark/20">
                  <th className="px-4 py-3 text-left text-sm font-bold text-neutral uppercase tracking-wide">
                    {t(headers.serviceKey)}
                  </th>
                  {headers.durationKey && (
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral uppercase tracking-wide">
                      {t(headers.durationKey)}
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-sm font-bold text-neutral uppercase tracking-wide">
                    {t(headers.idealForKey)}
                  </th>
                  {headers.priceKey && (
                    <th className="px-4 py-3 text-left text-sm font-bold text-neutral uppercase tracking-wide">
                      {t(headers.priceKey)}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className="border-t border-primary-dark/20 hover:bg-primary-dark/10 transition-colors"
                  >
                    <td className="px-4 py-3 text-neutral/90">{t(row.serviceKey)}</td>
                    {row.durationKey && (
                      <td className="px-4 py-3 text-neutral/70">{t(row.durationKey)}</td>
                    )}
                    <td className="px-4 py-3 text-neutral/70">{t(row.idealForKey)}</td>
                    {row.priceKey && (
                      <td className="px-4 py-3 text-primary-accent font-semibold">
                        {t(row.priceKey)}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

/**
 * Related Services Section
 */
const RelatedServicesSection: React.FC<RelatedServicesSectionProps> = ({ titleKey, services }) => {
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

  return (
    <section className="py-12 md:py-16 bg-primary-dark/5" aria-labelledby="related-services-title">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <h2
            id="related-services-title"
            className="text-4xl md:text-5xl font-black tracking-tighter text-center mb-12 holographic-text"
          >
            {t(titleKey)}
          </h2>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <AnimateOnScroll key={service.id} delay={index * 100}>
              <Link
                to={`/${locale}${service.url}`}
                className="group block h-full bg-black/50 border border-primary-dark/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={service.imageSrc}
                    alt={service.imageAlt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-accent transition-colors">
                    {t(service.titleKey)}
                  </h3>
                  <p className="text-sm text-neutral/70 line-clamp-2">
                    {t(service.descriptionKey)}
                  </p>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Final CTA Section - Clean with optional contact info
 */
const FinalCTA: React.FC<FinalCTAProps> = ({
  gradient,
  titleKey,
  descKey,
  buttonKey,
  phone,
  whatsApp,
  email,
  showContactInfo = true,
}) => {
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

  return (
    <section className="relative py-16 md:py-24 overflow-hidden" id="contact">
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} via-black to-black`} />
      </div>

      <div className="relative z-20 container mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
            {t(titleKey)}
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-10">{t(descKey)}</p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <div className="flex flex-col items-center gap-6">
            {/* Main CTA - Link to contact page */}
            <Link
              to={`/${locale}/contacto`}
              className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              {t(buttonKey || 'contactUs')}
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

            {/* Contact info - optional */}
            {showContactInfo && (
              <>
                <div className="flex flex-wrap justify-center gap-4 text-neutral/70">
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="flex items-center gap-2 hover:text-primary-accent transition-colors"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      {phone}
                    </a>
                  )}
                  {whatsApp && (
                    <a
                      href={`https://wa.me/${whatsApp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 hover:text-primary-accent transition-colors"
                    >
                      <ShieldCheckIcon className="w-4 h-4" />
                      WhatsApp
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2 hover:text-primary-accent transition-colors"
                    >
                      {email}
                    </a>
                  )}
                </div>

                {/* Address */}
                <address className="not-italic text-sm text-neutral/60">
                  {BUSINESS_INFO.address.streetAddress}, {BUSINESS_INFO.address.addressLocality}{' '}
                  {BUSINESS_INFO.address.postalCode}
                </address>
              </>
            )}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

// =============================================================================
// MAIN TEMPLATE COMPONENT
// =============================================================================

const ServicePageTemplate: React.FC<ServicePageTemplateProps> = ({
  // Identification
  serviceId: _serviceId,
  // SEO
  pageTitleKey,
  metaDescriptionKey,
  keywords,
  canonicalPath,
  ogImage = DEFAULT_OG_IMAGE,
  // Hero
  heroTitleKey,
  heroSubtitleKey,
  heroIntroKey,
  heroGradient,
  heroImage,
  heroShowPhoneButton = true,
  // Trust Bar
  trustSignals,
  // Problem/Solution
  problemSectionEnabled = false,
  problemTitleKey,
  problemDescKey,
  solutionTitleKey,
  solutionDescKey,
  // Features
  featuresTitleKey,
  features,
  featuresColumns = 3,
  // Benefits
  benefitsTitleKey = 'whyTitle',
  benefits,
  // Process
  processSectionEnabled = false,
  processTitleKey,
  processSteps,
  // Ideal For
  idealForEnabled = false,
  idealForTitleKey,
  idealForItems,
  // Packages
  packagesEnabled = false,
  packagesTitleKey,
  packages,
  // Stats
  stats,
  // Summary Table
  summaryTableEnabled = false,
  summaryTableTitleKey,
  summaryTableHeaders,
  summaryTableRows,
  // Reviews
  reviewsCategory = 'general',
  reviewsLimit = 6,
  // FAQ
  faqTitleKey,
  faqs,
  // Related Services
  relatedServicesEnabled = false,
  relatedServicesTitleKey,
  relatedServices,
  // Final CTA
  ctaTitleKey,
  ctaDescKey,
  ctaButtonKey,
  ctaPhone = BUSINESS_INFO.telephone,
  ctaWhatsApp,
  ctaEmail = BUSINESS_INFO.email,
  ctaShowContactInfo = true,
  // Schema
  schemaOptions,
  customSchemas,
}) => {
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
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Build breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = useMemo(
    () => [
      { name: t('navHome'), url: `/${locale}` },
      { name: t('breadcrumb_services'), url: `/${locale}` },
      {
        name: t(heroTitleKey),
        url: `/${locale}${canonicalPath}`,
        isActive: true,
      },
    ],
    [t, locale, heroTitleKey, canonicalPath]
  );

  // Build FAQs with translations
  const translatedFaqs = useMemo(
    () =>
      faqs.map(faq => ({
        id: faq.id,
        question: t(faq.questionKey),
        answer: t(faq.answerKey),
      })),
    [faqs, t]
  );

  // Generate schemas
  const schemas = useMemo(() => {
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${BASE_URL}/${locale}${canonicalPath}#service`,
      serviceType: schemaOptions.serviceType,
      name: schemaOptions.serviceName,
      description: schemaOptions.serviceDescription,
      provider: {
        '@id': `${BASE_URL}/#danceschool`,
      },
      areaServed: {
        '@type': 'City',
        name: schemaOptions.areaServed || 'Barcelona',
      },
      ...(schemaOptions.priceRange && {
        priceRange: schemaOptions.priceRange,
      }),
    };

    // LocalBusiness schema removed - already injected at build-time by prerender.mjs (#danceschool)

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: BUSINESS_INFO.name,
      url: BUSINESS_INFO.url,
      logo: BUSINESS_INFO.logo,
      sameAs: BUSINESS_INFO.sameAs,
    };

    return [
      // breadcrumbSchema removed - generated at build-time by prerender.mjs
      serviceSchema,
      organizationSchema,
      ...(customSchemas || []),
    ];
  }, [locale, canonicalPath, schemaOptions, customSchemas]);

  return (
    <>
      {/* Skip Link (WCAG 2.2) */}
      <SkipLink />

      {/* SEO Head */}
      <Helmet>
        <title>{t(pageTitleKey)}</title>
        <meta name="description" content={t(metaDescriptionKey)} />
        <meta name="keywords" content={keywords.join(', ')} />

        {/* Canonical + hreflang */}
        <link rel="canonical" href={`${BASE_URL}/${locale}${canonicalPath}`} />
        {LOCALES.map(l => (
          <link key={l} rel="alternate" hrefLang={l} href={`${BASE_URL}/${l}${canonicalPath}`} />
        ))}
        <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}/es${canonicalPath}`} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t(pageTitleKey)} />
        <meta property="og:description" content={t(metaDescriptionKey)} />
        <meta property="og:url" content={`${BASE_URL}/${locale}${canonicalPath}`} />
        <meta property="og:image" content={`${BASE_URL}${ogImage}`} />
        <meta property="og:site_name" content={BUSINESS_INFO.name} />
        <meta
          property="og:locale"
          content={{ es: 'es_ES', ca: 'ca_ES', en: 'en_GB', fr: 'fr_FR' }[locale] || 'es_ES'}
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t(pageTitleKey)} />
        <meta name="twitter:description" content={t(metaDescriptionKey)} />
        <meta name="twitter:image" content={`${BASE_URL}${ogImage}`} />

        {/* Schemas */}
        {schemas.map((schema, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      <main id="main-content" className="pt-20 md:pt-24">
        {/* Hero Section */}
        <ServiceHero
          gradient={heroGradient}
          titleKey={heroTitleKey}
          subtitleKey={heroSubtitleKey}
          introKey={heroIntroKey}
          breadcrumbItems={breadcrumbItems}
          heroImage={heroImage}
          showPhoneButton={heroShowPhoneButton}
          ctaPhone={ctaPhone}
          ctaWhatsApp={ctaWhatsApp}
        />

        {/* Trust Bar (E-E-A-T) */}
        {trustSignals && trustSignals.length > 0 && <TrustBar signals={trustSignals} />}

        {/* Problem/Solution */}
        {problemSectionEnabled &&
          problemTitleKey &&
          problemDescKey &&
          solutionTitleKey &&
          solutionDescKey && (
            <ProblemSolution
              problemTitleKey={problemTitleKey}
              problemDescKey={problemDescKey}
              solutionTitleKey={solutionTitleKey}
              solutionDescKey={solutionDescKey}
            />
          )}

        {/* Features Grid */}
        <FeaturesGrid titleKey={featuresTitleKey} features={features} columns={featuresColumns} />

        {/* Benefits Section */}
        <BenefitsSection titleKey={benefitsTitleKey} benefits={benefits} />

        {/* Process Section */}
        {processSectionEnabled && processTitleKey && processSteps && (
          <ProcessSection titleKey={processTitleKey} steps={processSteps} />
        )}

        {/* Ideal For Section */}
        {idealForEnabled && idealForTitleKey && idealForItems && (
          <IdealForSection titleKey={idealForTitleKey} items={idealForItems} />
        )}

        {/* Packages Section */}
        {packagesEnabled && packagesTitleKey && packages && (
          <PackagesSection titleKey={packagesTitleKey} packages={packages} />
        )}

        {/* Stats Section */}
        <StatsSection stats={stats} />

        {/* Summary Table (LLM citability) */}
        {summaryTableEnabled && summaryTableTitleKey && summaryTableHeaders && summaryTableRows && (
          <SummaryTable
            titleKey={summaryTableTitleKey}
            headers={summaryTableHeaders}
            rows={summaryTableRows}
          />
        )}

        {/* Reviews Section */}
        <ReviewsSection
          category={reviewsCategory}
          limit={reviewsLimit}
          showGoogleBadge={true}
          layout="grid"
        />

        {/* FAQ Section */}
        <FAQSection title={t(faqTitleKey)} faqs={translatedFaqs} />

        {/* Related Services */}
        {relatedServicesEnabled &&
          relatedServicesTitleKey &&
          relatedServices &&
          relatedServices.length > 0 && (
            <RelatedServicesSection titleKey={relatedServicesTitleKey} services={relatedServices} />
          )}

        {/* Final CTA */}
        <FinalCTA
          gradient={heroGradient}
          titleKey={ctaTitleKey}
          descKey={ctaDescKey}
          buttonKey={ctaButtonKey}
          phone={ctaPhone}
          whatsApp={ctaWhatsApp}
          email={ctaEmail}
          showContactInfo={ctaShowContactInfo}
        />
      </main>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </>
  );
};

export default ServicePageTemplate;
