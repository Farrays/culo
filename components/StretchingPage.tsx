import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  STRETCHING_TESTIMONIALS,
  STRETCHING_FAQS_CONFIG,
  STRETCHING_SCHEDULE_KEYS,
  STRETCHING_COMPARISON,
  STRETCHING_BENEFITS,
  STRETCHING_METHOD_PILLARS,
  STRETCHING_FOR_WHOM,
  STRETCHING_PRICING,
  STRETCHING_NEARBY_AREAS,
} from '../constants/stretching';
import AnimateOnScroll from './AnimateOnScroll';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from './SchemaMarkup';
import { StarRating, CheckIcon, CheckCircleIcon, ClockIcon } from './shared/Icons';
import { CalendarDaysIcon } from '../lib/icons';

// Simple inline icons for missing ones
const UsersIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
    />
  </svg>
);

const MapPinIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

// Alias for CalendarIcon
const CalendarIcon = CalendarDaysIcon;

// Animation delay constants for consistent UX
const ANIMATION_DELAYS = {
  STAGGER_SMALL: 100,
  STAGGER_MEDIUM: 150,
};

const StretchingPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/stretching-barcelona`;

  // Schedule data - translate keys dynamically
  const schedules = STRETCHING_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
  }));

  // FAQs - translate keys dynamically from constants
  const stretchingFaqs = STRETCHING_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - use from constants
  const stretchingTestimonials = STRETCHING_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = stretchingTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Stretching - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: '2025-01-01',
  }));

  // BreadcrumbList Schema (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('stretchingBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('stretchingBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('stretchingBreadcrumbTraining'),
        item: `${baseUrl}/${locale}/clases/entrenamiento-bailarines`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('stretchingBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('stretchingBreadcrumbHome'), url: `/${locale}` },
    { name: t('stretchingBreadcrumbClasses'), url: `/${locale}/clases` },
    { name: t('stretchingBreadcrumbTraining'), url: `/${locale}/clases/entrenamiento-bailarines` },
    {
      name: t('stretchingBreadcrumbCurrent'),
      url: `/${locale}/clases/stretching-barcelona`,
      isActive: true,
    },
  ];

  // Course instances for schema
  const courseInstances = STRETCHING_SCHEDULE_KEYS.map(schedule => ({
    '@type': 'CourseInstance',
    name: schedule.className,
    instructor: schedule.teacher,
    courseSchedule: {
      '@type': 'Schedule',
      byDay: schedule.dayKey.charAt(0).toUpperCase() + schedule.dayKey.slice(1),
      startTime: schedule.time.split(' - ')[0],
      endTime: schedule.time.split(' - ')[1],
    },
  }));

  // Course schema with instances
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: t('stretchingCourseSchemaName'),
    description: t('stretchingCourseSchemaDesc'),
    provider: {
      '@type': 'DanceSchool',
      name: "Farray's International Dance Center",
      url: baseUrl,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle Entenca 100',
        addressLocality: 'Barcelona',
        addressRegion: 'Cataluna',
        postalCode: '08015',
        addressCountry: 'ES',
      },
    },
    hasCourseInstance: courseInstances,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '505',
    },
  };

  return (
    <>
      <Helmet>
        <title>{t('stretchingPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('stretchingMetaDescription')} />
        <meta name="keywords" content={t('stretchingMetaKeywords')} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${t('stretchingPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('stretchingMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-stretching.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('stretchingPageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('stretchingMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-stretching.jpg`} />
      </Helmet>

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Course Schema with instances */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      {/* Schema Markup */}
      <LocalBusinessSchema
        name="Farray's International Dance Center - Clases de Stretching"
        description={t('stretchingMetaDescription')}
        url={pageUrl}
        telephone="+34622247085"
        email="info@farrayscenter.com"
        address={{
          streetAddress: 'Calle Entenca 100',
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
        }}
        geo={{
          latitude: '41.3751',
          longitude: '2.1482',
        }}
        priceRange="€€"
        aggregateRating={{
          ratingValue: '4.9',
          reviewCount: '505',
        }}
      />

      <CourseSchema
        name={t('stretchingCourseSchemaName')}
        description={t('stretchingCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner, Basic, Intermediate"
        teaches="Stretching, flexibilidad, backbending, splits, movilidad articular"
        coursePrerequisites="Ninguno"
        numberOfLessons="5 clases semanales"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de Stretching en Barcelona - Farray's Center"
        itemType="Course"
      />

      {/* Skip Links for Accessibility */}
      <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {t('skipToMain')}
        </a>
        <a
          href="#schedule"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-48 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {t('skipToSchedule')}
        </a>
      </nav>

      <main id="main-content" className="pt-20 md:pt-24" role="main">
        {/* 1. HERO Section */}
        <section
          id="stretching-hero"
          aria-labelledby="hero-title"
          className="relative text-center py-24 md:py-32 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            {/* Badge CID-UNESCO */}
            <AnimateOnScroll>
              <div className="inline-block mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-accent/20 border border-primary-accent/50 rounded-full text-sm text-neutral/90">
                  <img
                    src="/images/cid-unesco-logo.webp"
                    alt="CID UNESCO"
                    className="w-5 h-5 object-contain"
                    loading="eager"
                  />
                  {t('stretchingHeroBadge')}
                </span>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text"
              >
                {t('stretchingHeroTitle')}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('stretchingHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral/90 mt-6 sm:mt-8 mb-4 sm:mb-6 leading-relaxed">
                {t('stretchingHeroDesc')}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-neutral/90 italic mb-8 sm:mb-12">
                {t('stretchingHeroLocation')}
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-8 text-neutral/80">
                <div className="flex items-center gap-2">
                  <StarRating size="sm" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-sm">(505+ resenas)</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-primary-accent" />
                  <span>+15.000 alumnos formados</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary-accent" />
                  <span>8 anos en Barcelona</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
                role="group"
                aria-label="Opciones de inscripcion"
              >
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
                  >
                    {t('stretchingCTA1')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">
                    {t('stretchingCTA1Subtext')}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
                  >
                    {t('stretchingCTA2')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">
                    {t('stretchingCTA2Subtext')}
                  </p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="mt-12 sm:mt-16">
                <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-12 max-w-4xl mx-auto">
                  <AnimateOnScroll delay={0}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <ClockIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={60}
                        suffix="-90"
                        className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('stretchingStatMinutes')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <UsersIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={15000}
                        suffix="+"
                        className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('stretchingStatStudents')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={8}
                        suffix="+"
                        className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('stretchingStatYears')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2. Why Dance School Section */}
        <section aria-labelledby="why-dance-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="why-dance-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 text-center holographic-text"
                >
                  {t('stretchingWhyDanceTitle')}
                </h2>

                <p className="text-lg sm:text-xl text-neutral/90 mb-6 text-center">
                  {t('stretchingWhyDanceIntro')}
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-black/30 rounded-lg border border-neutral/20">
                    <p className="text-neutral/80">{t('stretchingWhyDanceGym')}</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-neutral/20">
                    <p className="text-neutral/80">{t('stretchingWhyDanceYoga')}</p>
                  </div>
                  <div className="p-4 bg-black/30 rounded-lg border border-neutral/20">
                    <p className="text-neutral/80">{t('stretchingWhyDancePilates')}</p>
                  </div>
                  <div className="p-4 bg-primary-accent/20 rounded-lg border border-primary-accent">
                    <p className="text-neutral font-bold text-lg">
                      {t('stretchingWhyDanceFarrays')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-base sm:text-lg text-neutral/90 leading-relaxed mb-8">
                  <p>{t('stretchingWhyDanceP1')}</p>
                  <p>{t('stretchingWhyDanceP2')}</p>
                </div>

                {/* Quote */}
                <blockquote className="border-l-4 border-primary-accent pl-6 py-4 my-8 bg-black/30 rounded-r-lg">
                  <p className="text-xl sm:text-2xl italic text-neutral mb-2">
                    &ldquo;{t('stretchingWhyDanceQuote')}&rdquo;
                  </p>
                  <cite className="text-neutral/70 not-italic">
                    — {t('stretchingWhyDanceQuoteAuthor')}
                  </cite>
                </blockquote>
              </div>
            </AnimateOnScroll>

            {/* Comparison Table */}
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto mt-12">
                <h3 className="text-2xl sm:text-3xl font-bold text-neutral mb-6 text-center">
                  {t('stretchingCompareTitle')}
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="p-4 bg-black/50 text-left text-neutral/70 font-semibold border-b border-neutral/20">
                          {t('stretchingCompareGymHeader')}
                        </th>
                        <th className="p-4 bg-primary-accent/20 text-left text-neutral font-semibold border-b border-primary-accent/50">
                          {t('stretchingCompareFarrayHeader')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {STRETCHING_COMPARISON.map((row, index) => (
                        <tr key={index} className="border-b border-neutral/10">
                          <td className="p-4 text-neutral/70">{t(row.gymKey)}</td>
                          <td className="p-4 text-neutral bg-primary-accent/5 font-medium">
                            {t(row.farrayKey)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 3. Schedule Section */}
        <ScheduleSection
          titleKey="stretchingScheduleTitle"
          subtitleKey="stretchingScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* 3b. Level Descriptions */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Principiantes */}
              <AnimateOnScroll delay={0}>
                <div className="h-full p-6 bg-green-900/20 border border-green-500/30 rounded-2xl">
                  <div className="inline-block px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full mb-4">
                    PRINCIPIANTES
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">
                    {t('stretchingLevelBeginnerTitle')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('stretchingLevelBeginnerDesc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Basico */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <div className="h-full p-6 bg-blue-900/20 border border-blue-500/30 rounded-2xl">
                  <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 text-sm font-semibold rounded-full mb-4">
                    BASICO
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">
                    {t('stretchingLevelBasicTitle')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('stretchingLevelBasicDesc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Intermedio */}
              <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}>
                <div className="h-full p-6 bg-orange-900/20 border border-orange-500/30 rounded-2xl">
                  <div className="inline-block px-3 py-1 bg-orange-500/20 text-orange-400 text-sm font-semibold rounded-full mb-4">
                    INTERMEDIO
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">
                    {t('stretchingLevelIntermediateTitle')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('stretchingLevelIntermediateDesc')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* 4. Pricing Section */}
        <section id="pricing" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text">
                {t('stretchingPriceTitle')}
              </h2>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {STRETCHING_PRICING.map((price, index) => (
                <AnimateOnScroll key={price.id} delay={index * ANIMATION_DELAYS.STAGGER_SMALL}>
                  <div
                    className={`h-full p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-2 ${
                      price.popular
                        ? 'bg-primary-accent/20 border-primary-accent shadow-accent-glow'
                        : 'bg-black/30 border-neutral/20 hover:border-primary-accent/50'
                    }`}
                  >
                    {price.popular && (
                      <div className="inline-block px-3 py-1 bg-primary-accent text-white text-xs font-bold rounded-full mb-3">
                        MAS ELEGIDA
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-neutral mb-2">{t(price.nameKey)}</h3>
                    <p className="text-2xl font-black text-primary-accent mb-2">{price.price}</p>
                    <p className="text-sm text-neutral/70">{t(price.descKey)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll>
              <div className="text-center mt-8">
                <a
                  href="#schedule"
                  className="inline-block bg-primary-accent text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-glow"
                >
                  {t('stretchingCTA1')}
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 5. Teachers Section */}
        <section
          id="teachers"
          aria-labelledby="teachers-title"
          className="py-12 md:py-20 bg-black relative overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="teachers-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
                >
                  {t('stretchingTeachersTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 mt-4">
                  {t('stretchingTeachersSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* CrisAg */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <div className="bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 mb-4">
                      <img
                        src="/images/teachers/placeholder-crisag.jpg"
                        alt="CrisAg - Profesora de Stretching"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral">
                      {t('stretchingTeacher1Name')}
                    </h3>
                    <p className="text-primary-accent font-semibold">
                      {t('stretchingTeacher1Specialty')}
                    </p>
                  </div>
                  <div className="space-y-4 text-sm text-neutral/90">
                    <p className="leading-relaxed">{t('stretchingTeacher1Bio')}</p>
                    <blockquote className="border-l-2 border-primary-accent pl-4 italic">
                      &ldquo;{t('stretchingTeacher1WhyTeaches')}&rdquo;
                    </blockquote>
                    <p className="text-xs text-neutral/60">{t('stretchingTeacher1Formation')}</p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Daniel Sene */}
              <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}>
                <div className="bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 mb-4">
                      <img
                        src="/images/teachers/placeholder-daniel-sene.jpg"
                        alt="Daniel Sene - Profesor de Stretching"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral">
                      {t('stretchingTeacher2Name')}
                    </h3>
                    <p className="text-primary-accent font-semibold">
                      {t('stretchingTeacher2Specialty')}
                    </p>
                  </div>
                  <div className="space-y-4 text-sm text-neutral/90">
                    <p className="leading-relaxed">{t('stretchingTeacher2Bio')}</p>
                    <blockquote className="border-l-2 border-primary-accent pl-4 italic">
                      &ldquo;{t('stretchingTeacher2WhyTeaches')}&rdquo;
                    </blockquote>
                    <p className="text-xs text-neutral/60">{t('stretchingTeacher2Formation')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* 6. Method Section */}
        <section className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('stretchingMethodTitle')}
                </h2>
                <p className="text-lg text-neutral/90">{t('stretchingMethodIntro')}</p>
              </div>
            </AnimateOnScroll>

            {/* Method Sources */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
              {[1, 2, 3, 4].map((num, index) => (
                <AnimateOnScroll key={num} delay={index * ANIMATION_DELAYS.STAGGER_SMALL}>
                  <div className="p-6 bg-black/30 rounded-xl border border-neutral/20 hover:border-primary-accent/50 transition-colors">
                    <h4 className="text-lg font-bold text-neutral mb-2">
                      {t(`stretchingMethodSource${num}Title`)}
                    </h4>
                    <p className="text-neutral/80 text-sm">
                      {t(`stretchingMethodSource${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Result */}
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center mb-12 p-6 bg-primary-accent/10 rounded-2xl border border-primary-accent/30">
                <h3 className="text-2xl font-bold text-neutral mb-4">
                  {t('stretchingMethodResultTitle')}
                </h3>
                <p className="text-neutral/90">{t('stretchingMethodResultDesc')}</p>
              </div>
            </AnimateOnScroll>

            {/* 3 Pillars */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {STRETCHING_METHOD_PILLARS.map((pillar, index) => (
                <AnimateOnScroll key={pillar.id} delay={index * ANIMATION_DELAYS.STAGGER_SMALL}>
                  <div className="text-center p-6 bg-black/30 rounded-xl border border-neutral/20">
                    <div className="w-16 h-16 mx-auto mb-4 bg-primary-accent/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-black text-primary-accent">{index + 1}</span>
                    </div>
                    <h4 className="text-xl font-bold text-neutral mb-3">{t(pillar.titleKey)}</h4>
                    <p className="text-neutral/80 text-sm">{t(pillar.descKey)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Benefits Section */}
        <section className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-12 text-center holographic-text">
                {t('stretchingBenefitsTitle')}
              </h2>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Body Benefits */}
              <AnimateOnScroll delay={0}>
                <div className="p-6 bg-black/50 border border-neutral/20 rounded-2xl">
                  <h3 className="text-xl font-bold text-neutral mb-4 flex items-center gap-2">
                    <span className="text-2xl">💪</span> {t('stretchingBenefitsBodyTitle')}
                  </h3>
                  <ul className="space-y-3">
                    {STRETCHING_BENEFITS.body.map((benefitKey, index) => (
                      <li key={index} className="flex items-start gap-2 text-neutral/80 text-sm">
                        <CheckIcon className="text-primary-accent flex-shrink-0 mt-0.5" size="sm" />
                        <span>{t(benefitKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>

              {/* Movement Benefits */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <div className="p-6 bg-black/50 border border-neutral/20 rounded-2xl">
                  <h3 className="text-xl font-bold text-neutral mb-4 flex items-center gap-2">
                    <span className="text-2xl">🩰</span> {t('stretchingBenefitsMovementTitle')}
                  </h3>
                  <ul className="space-y-3">
                    {STRETCHING_BENEFITS.movement.map((benefitKey, index) => (
                      <li key={index} className="flex items-start gap-2 text-neutral/80 text-sm">
                        <CheckIcon className="text-primary-accent flex-shrink-0 mt-0.5" size="sm" />
                        <span>{t(benefitKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>

              {/* Mind Benefits */}
              <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}>
                <div className="p-6 bg-black/50 border border-neutral/20 rounded-2xl">
                  <h3 className="text-xl font-bold text-neutral mb-4 flex items-center gap-2">
                    <span className="text-2xl">🧠</span> {t('stretchingBenefitsMindTitle')}
                  </h3>
                  <ul className="space-y-3">
                    {STRETCHING_BENEFITS.mind.map((benefitKey, index) => (
                      <li key={index} className="flex items-start gap-2 text-neutral/80 text-sm">
                        <CheckIcon className="text-primary-accent flex-shrink-0 mt-0.5" size="sm" />
                        <span>{t(benefitKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto mt-12 text-center">
                <blockquote className="text-lg italic text-neutral/90 mb-4">
                  &ldquo;{t('stretchingBenefitsQuote')}&rdquo;
                </blockquote>
                <p className="text-neutral/70">{t('stretchingBenefitsNeed')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 8. For Whom Section */}
        <section className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-12 text-center holographic-text">
                {t('stretchingForWhomTitle')}
              </h2>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {/* For Dancers */}
              <AnimateOnScroll delay={0}>
                <div className="p-6 bg-black/30 rounded-2xl border border-neutral/20">
                  <h3 className="text-xl font-bold text-neutral mb-4">
                    {t('stretchingForWhomDancerTitle')}
                  </h3>
                  <p className="text-neutral/80">{t('stretchingForWhomDancerDesc')}</p>
                </div>
              </AnimateOnScroll>

              {/* For Non-Dancers */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <div className="p-6 bg-black/30 rounded-2xl border border-neutral/20">
                  <h3 className="text-xl font-bold text-neutral mb-4">
                    {t('stretchingForWhomNonDancerTitle')}
                  </h3>
                  <p className="text-neutral/80">{t('stretchingForWhomNonDancerDesc')}</p>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Identification Checklist */}
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-bold text-neutral mb-6 text-center">
                  {t('stretchingForWhomIdentifyTitle')}
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {STRETCHING_FOR_WHOM.map((itemKey, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-black/20 rounded-lg border border-neutral/10"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span className="text-neutral/80 text-sm">{t(itemKey)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-black/30 rounded-xl border border-neutral/20">
                  <h4 className="font-bold text-neutral mb-2">{t('stretchingForWhomNotTitle')}</h4>
                  <p className="text-neutral/70 text-sm">{t('stretchingForWhomNotDesc')}</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 9. Testimonials */}
        <section
          id="testimonials"
          aria-labelledby="testimonials-title"
          className="py-12 md:py-20 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
                <h2
                  id="testimonials-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 sm:mb-6 holographic-text"
                >
                  {t('stretchingTestimonialsTitle')}
                </h2>
                <div className="inline-block">
                  <div className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-black text-neutral">
                    {t('excellent')}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <StarRating size="lg" />
                  </div>
                  <div className="text-xs sm:text-sm text-neutral/70">
                    {t('basedOnReviews').replace('{count}', '505')}
                  </div>
                  <div className="mt-2 text-xs text-neutral/50">Google</div>
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {stretchingTestimonials.map((testimonial, index) => (
                <AnimateOnScroll
                  key={testimonial.id}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                >
                  <div className="flex flex-col h-full min-h-[180px] sm:min-h-[200px] p-4 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2">
                    <div className="mb-2 sm:mb-3">
                      <StarRating size="sm" label="5 estrellas" />
                    </div>
                    <blockquote className="flex-grow text-neutral/90 mb-3 sm:mb-4">
                      <p className="text-xs sm:text-sm leading-relaxed">
                        &ldquo;{testimonial.quote[locale]}&rdquo;
                      </p>
                    </blockquote>
                    <div className="flex items-center gap-3 mt-auto pt-3 sm:pt-4 border-t border-primary-dark/30">
                      <div>
                        <cite className="font-bold text-neutral not-italic text-xs sm:text-sm">
                          {testimonial.name}
                        </cite>
                        <p className="text-xs text-neutral/75">{testimonial.city[locale]}</p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 10. Location & Local SEO Section */}
        <section className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 text-center holographic-text">
                  {t('stretchingLocationTitle')}
                </h2>
                <p className="text-lg text-neutral/90 text-center mb-8">
                  {t('stretchingLocationDesc')}
                </p>

                {/* Features */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[1, 2, 3, 4, 5].map(num => (
                    <div key={num} className="flex items-center gap-2 text-neutral/80">
                      <CheckCircleIcon className="w-5 h-5 text-primary-accent" />
                      <span className="text-sm">{t(`stretchingLocationFeature${num}`)}</span>
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  <MapPinIcon className="w-6 h-6 text-primary-accent" />
                  <div>
                    <p className="text-neutral font-bold">{t('stretchingLocationAddress')}</p>
                    <p className="text-neutral/70">{t('stretchingLocationBetween')}</p>
                  </div>
                </div>

                {/* Google Map Placeholder */}
                <div className="w-full h-[300px] bg-black/30 rounded-xl border border-neutral/20 flex items-center justify-center mb-8">
                  <p className="text-neutral/50">[Google Maps Embed]</p>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Local SEO Section */}
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto mt-12 p-6 bg-black/30 rounded-2xl border border-neutral/20">
                <h3 className="text-2xl font-bold text-neutral mb-4">
                  {t('stretchingNearbyTitle')}
                </h3>
                <p className="text-neutral/80 mb-6">{t('stretchingNearbyDesc')}</p>
                <p className="text-neutral/90 font-semibold mb-4">
                  {t('stretchingNearbySearchText')}
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {STRETCHING_NEARBY_AREAS.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-primary-accent" />
                      <span className="text-neutral/80">
                        {area.name}: <span className="text-primary-accent">{area.time}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-neutral/70 text-sm mt-4">{t('stretchingNearbyMetro')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 11. FAQ Section */}
        <FAQSection title={t('stretchingFaqTitle')} faqs={stretchingFaqs} pageUrl={pageUrl} />

        {/* 12. Final CTA Section */}
        <section id="final-cta" className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
          {/* Background like Hero */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('stretchingFinalCTATitle')}
                </h2>
                <div className="space-y-4 text-lg text-neutral/90 mb-8">
                  <p>{t('stretchingFinalCTAP1')}</p>
                  <p>{t('stretchingFinalCTAP2')}</p>
                  <p>{t('stretchingFinalCTAP3')}</p>
                  <p className="font-semibold">{t('stretchingFinalCTAP4')}</p>
                </div>
                <p className="text-2xl sm:text-3xl font-black mb-8 holographic-text">
                  {t('stretchingFinalCTAClosing')}
                </p>

                {/* CTA Final */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                  <a
                    href="#schedule"
                    className="w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center"
                  >
                    {t('stretchingCTA1')}
                  </a>
                  <a
                    href="#schedule"
                    className="w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center"
                  >
                    {t('stretchingCTA2')}
                  </a>
                </div>

                {/* Guarantees */}
                <p className="text-sm text-neutral/60">{t('stretchingFinalCTAGuarantees')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default StretchingPage;
