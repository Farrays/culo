import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  StarRating,
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
} from './shared/Icons';
import {
  MODERN_JAZZ_TESTIMONIALS,
  MODERN_JAZZ_FAQS_CONFIG,
  MODERN_JAZZ_SCHEDULE_KEYS,
  MODERN_JAZZ_VIDEO_ID,
  MODERN_JAZZ_NEARBY_AREAS,
} from '../constants/modern-jazz';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import YouTubeEmbed from './YouTubeEmbed';
import {
  LocalBusinessSchema,
  CourseSchema,
  AggregateReviewsSchema,
  HowToSchema,
  SpeakableSchema,
  DefinedTermSchema,
  EventSchema,
} from './SchemaMarkup';

// MapPinIcon for Local SEO section
const MapPinIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    />
  </svg>
);

// Animation delay constants (in ms)
const ANIMATION_DELAYS = {
  STAGGER_SMALL: 100,
  STAGGER_MEDIUM: 150,
} as const;

const ModernJazzPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/modern-jazz-barcelona`;

  // Dynamic date for schemas (current year)
  const currentDate = new Date().toISOString().split('T')[0];

  // Schedule data - traducir las keys dinámicamente
  const schedules = MODERN_JAZZ_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
  }));

  // FAQs - traducir las keys dinámicamente desde constants
  const modernJazzFaqs = MODERN_JAZZ_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - usar desde constants
  const modernJazzTestimonials = MODERN_JAZZ_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = modernJazzTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Modern Jazz - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: currentDate,
  }));

  // VideoObject Schema (only if video exists)
  const videoSchema = MODERN_JAZZ_VIDEO_ID
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: t('modernjazzVideoTitle'),
        description: t('modernjazzVideoDesc'),
        thumbnailUrl: `https://img.youtube.com/vi/${MODERN_JAZZ_VIDEO_ID}/maxresdefault.jpg`,
        uploadDate: currentDate,
        contentUrl: `https://www.youtube.com/watch?v=${MODERN_JAZZ_VIDEO_ID}`,
        embedUrl: `https://www.youtube.com/embed/${MODERN_JAZZ_VIDEO_ID}`,
        duration: 'PT3M',
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: { '@type': 'WatchAction' },
          userInteractionCount: 1000,
        },
      }
    : null;

  // BreadcrumbList Schema (JSON-LD) - 4 levels for Modern Jazz
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('modernjazzBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('modernjazzBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('modernjazzBreadcrumbDance'),
        item: `${baseUrl}/${locale}/clases/danza-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('modernjazzBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // FAQPage Schema for rich snippets
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: modernJazzFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('modernjazzBreadcrumbHome'), url: `/${locale}` },
    { name: t('modernjazzBreadcrumbClasses'), url: `/${locale}/clases/baile-barcelona` },
    { name: t('modernjazzBreadcrumbDance'), url: `/${locale}/clases/danza-barcelona` },
    {
      name: t('modernjazzBreadcrumbCurrent'),
      url: `/${locale}/clases/modern-jazz-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('modernjazzPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('modernjazzMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        {/* Hreflang alternates for international SEO */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/clases/modern-jazz-barcelona`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/clases/modern-jazz-barcelona`} />
        <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca/clases/modern-jazz-barcelona`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/clases/modern-jazz-barcelona`} />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es/clases/modern-jazz-barcelona`}
        />
        <meta property="og:title" content={`${t('modernjazzPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('modernjazzMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:locale"
          content={
            locale === 'es'
              ? 'es_ES'
              : locale === 'ca'
                ? 'ca_ES'
                : locale === 'fr'
                  ? 'fr_FR'
                  : 'en_US'
          }
        />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="ca_ES" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:image" content={`${baseUrl}/images/og-modern-jazz.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('modernjazzPageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('modernjazzMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-modern-jazz.jpg`} />
        {/* Additional SEO meta tags */}
        <meta property="og:site_name" content="Farray's International Dance Center" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="geo.region" content="ES-CT" />
        <meta name="geo.placename" content="Barcelona" />
        <meta name="geo.position" content="41.3751;2.1482" />
        <meta name="ICBM" content="41.3751, 2.1482" />
        <meta name="author" content="Farray's International Dance Center" />
        <meta property="og:image:alt" content={t('modernjazzImageAlt')} />
      </Helmet>

      {/* VideoObject Schema - Only if video exists */}
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      {/* Person Schema for Alejandro Miñoso */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Alejandro Miñoso',
            jobTitle: 'Instructor de Modern Jazz',
            description:
              'Especialista en Modern Jazz con amplia experiencia en técnica, musicalidad y expresión corporal.',
            worksFor: {
              '@type': 'DanceSchool',
              name: "Farray's International Dance Center",
              url: baseUrl,
            },
            knowsAbout: [
              'Modern Jazz',
              'Jazz Dance',
              'Broadway',
              'Contemporary Dance',
              'Choreography',
            ],
          }),
        }}
      />

      {/* Schema Markup */}
      <LocalBusinessSchema
        name="Farray's International Dance Center - Clases de Modern Jazz"
        description={t('modernjazzMetaDescription')}
        url={pageUrl}
        telephone="+34622247085"
        email="info@farrayscenter.com"
        address={{
          streetAddress: 'Calle Entença 100',
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
          ratingValue: '5',
          reviewCount: '505',
        }}
      />

      <CourseSchema
        name={t('modernjazzCourseSchemaName')}
        description={t('modernjazzCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="All levels"
        teaches="Modern Jazz, técnica de danza, musicalidad, expresión corporal, Broadway"
        coursePrerequisites="Ninguno"
        numberOfLessons="1 clase semanal"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de Modern Jazz en Barcelona - Farray's Center"
        itemType="Course"
      />

      {/* HowTo Schema - Cómo empezar en Modern Jazz (GEO Optimization) */}
      <HowToSchema
        name={t('modernjazzHowToName')}
        description={t('modernjazzHowToDesc')}
        totalTime="PT60M"
        estimatedCost={{
          currency: 'EUR',
          value: '15',
        }}
        supply={[
          t('modernjazzHowToSupply1'),
          t('modernjazzHowToSupply2'),
          t('modernjazzHowToSupply3'),
        ]}
        steps={[
          {
            name: t('modernjazzHowToStep1Name'),
            text: t('modernjazzHowToStep1Text'),
            url: `${pageUrl}#schedule`,
          },
          {
            name: t('modernjazzHowToStep2Name'),
            text: t('modernjazzHowToStep2Text'),
            url: `${pageUrl}#schedule`,
          },
          {
            name: t('modernjazzHowToStep3Name'),
            text: t('modernjazzHowToStep3Text'),
          },
          {
            name: t('modernjazzHowToStep4Name'),
            text: t('modernjazzHowToStep4Text'),
          },
          {
            name: t('modernjazzHowToStep5Name'),
            text: t('modernjazzHowToStep5Text'),
          },
        ]}
      />

      {/* Speakable Schema - Voice Search Optimization (GEO) */}
      <SpeakableSchema
        name={t('modernjazzPageTitle')}
        description={t('modernjazzMetaDescription')}
        url={pageUrl}
        speakableSelectors={['#hero-title', '#what-is-title', '.speakable-intro', '#faq']}
      />

      {/* DefinedTerm Schema - Technical Terms for AI understanding */}
      <DefinedTermSchema
        terms={[
          {
            name: 'Modern Jazz',
            description: t('modernjazzDefinedTermModernJazz'),
            url: pageUrl,
          },
          {
            name: 'Jazz Dance',
            description: t('modernjazzDefinedTermJazzDance'),
            url: pageUrl,
          },
          {
            name: 'Broadway Dance',
            description: t('modernjazzDefinedTermBroadway'),
            url: pageUrl,
          },
          {
            name: 'Técnica de danza',
            description: t('modernjazzDefinedTermTecnica'),
            url: pageUrl,
          },
          {
            name: 'Musicalidad',
            description: t('modernjazzDefinedTermMusicalidad'),
            url: pageUrl,
          },
        ]}
      />

      {/* Event Schema - Weekly Modern Jazz Class */}
      <EventSchema
        name={t('modernjazzEventName')}
        description={t('modernjazzEventDesc')}
        startDate={`${currentDate}T20:00:00+01:00`}
        location={{
          name: "Farray's International Dance Center",
          address: 'Calle Entença 100, 08015 Barcelona',
        }}
        organizer={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        offers={{
          price: '15',
          priceCurrency: 'EUR',
          availability: 'InStock',
          url: `${pageUrl}#schedule`,
        }}
        performer={{
          name: 'Alejandro Miñoso',
          description: t('modernjazzTeacher1Bio'),
        }}
      />

      {/* Skip Links for Accessibility - Enhanced */}
      <nav aria-label={t('skipLinks')} className="skip-links">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {t('skipToContent')}
        </a>
        <a
          href="#schedule"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-48 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {t('skipToSchedule')}
        </a>
      </nav>

      <main id="main-content" className="pt-20 md:pt-24" role="main">
        {/* HERO Section */}
        <section
          id="modern-jazz-hero"
          aria-labelledby="hero-title"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background - Blue/Purple tones for Jazz */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1
                id="hero-title"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text"
              >
                {t('modernjazzHeroTitle')}
              </h1>
              <p className="text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('modernjazzHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 mb-6 leading-relaxed speakable-intro">
                {t('modernjazzHeroDesc')}
              </p>
              <p className="text-lg md:text-xl text-neutral/90 italic mb-8">
                {t('modernjazzHeroLocation')}
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-8 text-neutral/80">
                <div className="flex items-center gap-2">
                  <StarRating size="sm" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-sm">(505+ reseñas)</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary-accent"
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
                  <span>+15.000 alumnos formados</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  <span>8 años en Barcelona</span>
                </div>
              </div>

              {/* CTA Buttons - Enhanced UX & A11y */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
                role="group"
                aria-label={t('modernjazzCTAGroup')}
              >
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta1-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('modernjazzCTA1')}
                  </a>
                  <p id="cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('modernjazzCTA1Subtext')}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta2-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('modernjazzCTA2')}
                  </a>
                  <p id="cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('modernjazzCTA2Subtext')}
                  </p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="mt-12 sm:mt-16">
                <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-12 max-w-4xl mx-auto">
                  {/* 60 Minutos */}
                  <AnimateOnScroll delay={0}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <ClockIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text">
                        60
                      </div>
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('classMinutes')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  {/* ~500 Calorías */}
                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <FlameIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text">
                        ~500/h
                      </div>
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('caloriesBurned')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  {/* 100% Técnica */}
                  <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <HeartIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={100}
                        suffix="%"
                        className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('modernjazzDanceStat')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* What is Modern Jazz Section */}
        <section aria-labelledby="what-is-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-is-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text"
                >
                  {t('modernjazzWhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90 leading-relaxed">
                    <p className="text-lg sm:text-xl font-semibold holographic-text">
                      {t('modernjazzWhatIsP1')}
                    </p>
                    <p>{t('modernjazzWhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('modernjazzWhatIsP3')}</p>
                    <p>{t('modernjazzWhatIsP4')}</p>
                    <p className="text-center text-xl sm:text-2xl font-bold mt-6 sm:mt-8 holographic-text">
                      {t('modernjazzWhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-lg sm:text-xl font-semibold">
                      {t('modernjazzWhatIsQuestionAnswer')}
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-indigo-900/50 via-black to-black aspect-square flex items-center justify-center border border-primary-accent/20">
                    <div className="text-center p-8">
                      <span className="text-8xl font-black holographic-text">MJ</span>
                      <p className="text-neutral/70 mt-4 text-lg">{t('modernjazzImageAlt')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Schedule Section - Position 3 */}
        <ScheduleSection
          id="schedule"
          titleKey="modernjazzScheduleTitle"
          subtitleKey="modernjazzScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* Level Cards Section */}
        <section className="py-14 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <AnimateOnScroll delay={0}>
                <div className="h-full p-6 bg-primary-dark/20 border border-primary-dark/40 rounded-2xl hover:border-primary-dark/60 transition-colors">
                  <div className="inline-block px-3 py-1 bg-primary-dark/30 text-neutral text-sm font-semibold rounded-full mb-4">
                    BÁSICO
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">
                    {t('modernjazzLevelBasicTitle')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('modernjazzLevelBasicDesc')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Teacher Section - Position 4 */}
        <section
          id="teachers"
          aria-labelledby="teachers-title"
          className="py-12 md:py-20 bg-black relative overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
                <h2
                  id="teachers-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
                >
                  {t('modernjazzTeachersTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 mt-4">
                  {t('modernjazzTeachersSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-2xl mx-auto">
              <AnimateOnScroll
                delay={ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-6">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="/images/teachers/img/profesor-alejandro-miñoso_320.webp 320w, /images/teachers/img/profesor-alejandro-miñoso_640.webp 640w"
                          sizes="192px"
                        />
                        <img
                          src="/images/teachers/img/profesor-alejandro-miñoso_320.jpg"
                          srcSet="/images/teachers/img/profesor-alejandro-miñoso_320.jpg 320w, /images/teachers/img/profesor-alejandro-miñoso_640.jpg 640w"
                          sizes="192px"
                          alt="Alejandro Miñoso - Profesor de Modern Jazz en Barcelona"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-2">
                      Alejandro Miñoso
                    </h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('modernjazzTeacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t('modernjazzTeacher1Bio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-base sm:text-lg text-neutral/90 mt-12 max-w-2xl mx-auto">
                {t('modernjazzTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Prepare Section - Prepara tu primera clase */}
        <section className="py-14 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-neutral mb-2 text-center holographic-text">
                  {t('modernjazzPrepareTitle')}
                </h3>
                <p className="text-base text-neutral/70 mb-6 text-center">
                  {t('modernjazzPrepareSubtitle')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {/* Qué traer - primary-accent */}
                  <div className="p-5 bg-primary-accent/10 rounded-2xl border border-primary-accent/30 hover:border-primary-accent/50 transition-all duration-300">
                    <h4 className="text-base font-bold text-primary-accent mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-accent/20 flex items-center justify-center text-sm">
                        +
                      </span>
                      {t('modernjazzPrepareWhatToBring')}
                    </h4>
                    <ul className="space-y-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <li key={num} className="flex items-start gap-2 text-sm text-neutral/80">
                          <CheckIcon className="w-4 h-4 text-primary-accent mt-0.5 flex-shrink-0" />
                          <span>{t(`modernjazzPrepareItem${num}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Antes de llegar - primary-dark */}
                  <div className="p-5 bg-primary-dark/15 rounded-2xl border border-primary-dark/30 hover:border-primary-dark/50 transition-all duration-300">
                    <h4 className="text-base font-bold text-neutral mb-3 flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-primary-accent" />
                      {t('modernjazzPrepareBefore')}
                    </h4>
                    <ul className="space-y-2">
                      {[1, 2, 3].map(num => (
                        <li key={num} className="flex items-start gap-2 text-sm text-neutral/80">
                          <span className="w-4 h-4 rounded-full bg-primary-dark/30 flex items-center justify-center text-xs text-neutral mt-0.5 flex-shrink-0">
                            -
                          </span>
                          <span>{t(`modernjazzPrepareBeforeItem${num}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Evita - neutral/muted */}
                  <div className="p-5 bg-neutral/5 rounded-2xl border border-neutral/20 hover:border-neutral/40 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <h4 className="text-base font-bold text-neutral/70 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-neutral/10 flex items-center justify-center text-sm">
                        x
                      </span>
                      {t('modernjazzPrepareAvoid')}
                    </h4>
                    <ul className="space-y-2">
                      {[1, 2, 3].map(num => (
                        <li key={num} className="flex items-start gap-2 text-sm text-neutral/80">
                          <span className="w-4 h-4 rounded-full bg-neutral/10 flex items-center justify-center text-xs text-neutral/60 mt-0.5 flex-shrink-0">
                            x
                          </span>
                          <span>{t(`modernjazzPrepareAvoidItem${num}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Consejo del profesor */}
                <div className="mt-6 p-5 bg-gradient-to-r from-primary-accent/10 via-primary-dark/10 to-primary-accent/10 rounded-2xl border border-primary-accent/30">
                  <p className="text-sm font-bold text-primary-accent mb-2">
                    {t('modernjazzPrepareTeacherTip')}
                  </p>
                  <blockquote className="text-neutral/90 italic leading-relaxed text-sm">
                    &ldquo;{t('modernjazzPrepareTeacherQuote')}&rdquo;
                  </blockquote>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Comparison Table - Modern Jazz vs Otras Disciplinas */}
        <section className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-neutral mb-2 text-center holographic-text">
                  {t('modernjazzCompareTitle')}
                </h3>
                <p className="text-base text-neutral/70 mb-6 text-center">
                  {t('modernjazzCompareSubtitle')}
                </p>

                {/* Mobile: Cards view - 11 rows unified criteria */}
                <div className="block lg:hidden space-y-4">
                  {[
                    { row: 1, jazz: 4, ballet: 5, lirico: 3, afro: 3 }, // Alineación postural clásica
                    { row: 2, jazz: 4, ballet: 5, lirico: 3, afro: 4 }, // Técnica de pies y piernas
                    { row: 3, jazz: 2, ballet: 1, lirico: 5, afro: 3 }, // Trabajo de suelo
                    { row: 4, jazz: 3, ballet: 2, lirico: 3, afro: 5 }, // Trabajo de caderas y torso
                    { row: 5, jazz: 3, ballet: 2, lirico: 3, afro: 5 }, // Disociación corporal
                    { row: 6, jazz: 3, ballet: 2, lirico: 3, afro: 5 }, // Poliritmia / Musicalidad compleja
                    { row: 7, jazz: 4, ballet: 3, lirico: 5, afro: 5 }, // Expresión emocional
                    { row: 8, jazz: 4, ballet: 4, lirico: 5, afro: 4 }, // Fluidez y continuidad
                    { row: 9, jazz: 3, ballet: 2, lirico: 4, afro: 5 }, // Conexión tierra (grounding)
                    { row: 10, jazz: 4, ballet: 3, lirico: 3, afro: 5 }, // Exigencia cardiovascular
                    { row: 11, jazz: 4, ballet: 5, lirico: 4, afro: 5 }, // Versatilidad para otros estilos
                  ].map(item => (
                    <div
                      key={item.row}
                      className="p-4 bg-black/30 rounded-xl border border-neutral/20"
                    >
                      <h4 className="font-bold text-neutral mb-3 text-sm">
                        {t(`modernjazzCompareRow${item.row}`)}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between items-center p-2 bg-primary-accent/15 rounded-lg border border-primary-accent/30">
                          <span className="text-primary-accent font-semibold">Modern Jazz</span>
                          <span className="text-primary-accent/80">{'★'.repeat(item.jazz)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-neutral/10 rounded-lg">
                          <span className="text-neutral/70">Ballet</span>
                          <span className="text-neutral/60">{'★'.repeat(item.ballet)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-neutral/10 rounded-lg">
                          <span className="text-neutral/70">Cont. Lírico</span>
                          <span className="text-neutral/60">{'★'.repeat(item.lirico)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-neutral/10 rounded-lg">
                          <span className="text-neutral/70">Afro Cont.</span>
                          <span className="text-neutral/60">{'★'.repeat(item.afro)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Table view */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral/20">
                        <th className="text-left py-3 px-2 text-neutral/70 font-semibold">
                          {t('modernjazzCompareCapacity')}
                        </th>
                        <th className="text-center py-3 px-2 text-primary-accent font-bold bg-primary-accent/10 rounded-t-lg">
                          Modern Jazz
                        </th>
                        <th className="text-center py-3 px-2 text-neutral/70 font-semibold">
                          Ballet
                        </th>
                        <th className="text-center py-3 px-2 text-neutral/70 font-semibold">
                          Cont. Lírico
                        </th>
                        <th className="text-center py-3 px-2 text-neutral/70 font-semibold">
                          Afro Cont.
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { row: 1, jazz: 4, ballet: 5, lirico: 3, afro: 3 }, // Alineación postural clásica
                        { row: 2, jazz: 4, ballet: 5, lirico: 3, afro: 4 }, // Técnica de pies y piernas
                        { row: 3, jazz: 2, ballet: 1, lirico: 5, afro: 3 }, // Trabajo de suelo
                        { row: 4, jazz: 3, ballet: 2, lirico: 3, afro: 5 }, // Trabajo de caderas y torso
                        { row: 5, jazz: 3, ballet: 2, lirico: 3, afro: 5 }, // Disociación corporal
                        { row: 6, jazz: 3, ballet: 2, lirico: 3, afro: 5 }, // Poliritmia / Musicalidad compleja
                        { row: 7, jazz: 4, ballet: 3, lirico: 5, afro: 5 }, // Expresión emocional
                        { row: 8, jazz: 4, ballet: 4, lirico: 5, afro: 4 }, // Fluidez y continuidad
                        { row: 9, jazz: 3, ballet: 2, lirico: 4, afro: 5 }, // Conexión tierra (grounding)
                        { row: 10, jazz: 4, ballet: 3, lirico: 3, afro: 5 }, // Exigencia cardiovascular
                        { row: 11, jazz: 4, ballet: 5, lirico: 4, afro: 5 }, // Versatilidad para otros estilos
                      ].map((item, idx) => (
                        <tr
                          key={item.row}
                          className={`border-b border-neutral/10 ${idx % 2 === 0 ? 'bg-black/20' : ''}`}
                        >
                          <td className="py-3 px-2 text-neutral/80">
                            {t(`modernjazzCompareRow${item.row}`)}
                          </td>
                          <td className="py-3 px-2 text-center bg-primary-accent/10 text-primary-accent/80">
                            {'★'.repeat(item.jazz)}
                          </td>
                          <td className="py-3 px-2 text-center text-neutral/60">
                            {'★'.repeat(item.ballet)}
                          </td>
                          <td className="py-3 px-2 text-center text-neutral/60">
                            {'★'.repeat(item.lirico)}
                          </td>
                          <td className="py-3 px-2 text-center text-neutral/60">
                            {'★'.repeat(item.afro)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* What does this mean for you? */}
                <div className="mt-8 p-5 bg-black/30 rounded-2xl border border-neutral/20">
                  <h4 className="text-lg font-bold text-neutral mb-4">
                    {t('modernjazzCompareMeaningTitle')}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(num => (
                      <div key={num} className="space-y-1">
                        <p className="text-sm font-semibold text-primary-accent">
                          {t(`modernjazzCompareMeaning${num}Title`)}
                        </p>
                        <p className="text-sm text-neutral/70">
                          {t(`modernjazzCompareMeaning${num}Desc`)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-primary-accent italic text-center">
                    {t('modernjazzCompareConclusion')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Identification Section - ¿Te identificas? */}
        <section aria-labelledby="identify-title" className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2
                  id="identify-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('modernjazzIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <ul
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12 list-none"
              role="list"
              aria-label={t('modernjazzIdentifyListLabel')}
            >
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <li className="group relative h-full min-h-[140px] flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow motion-reduce:transform-none motion-reduce:transition-colors">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300"
                      aria-hidden="true"
                    >
                      <CheckIcon className="text-primary-accent" size="sm" />
                    </div>
                    <p className="text-neutral/90 leading-relaxed">
                      {t(`modernjazzIdentify${num}`)}
                    </p>
                  </li>
                </AnimateOnScroll>
              ))}
            </ul>
          </div>
        </section>

        {/* Necesitas apuntarte Section */}
        <section className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            {/* Texto de transición pequeño */}
            <AnimateOnScroll>
              <div className="text-center mb-8">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('modernjazzIdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('modernjazzNeedEnrollTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <p className="text-xl font-semibold holographic-text">
                  {t('modernjazzIdentifyAgitate1')}
                </p>
                <p className="text-lg text-neutral/90">{t('modernjazzIdentifySolution')}</p>
                <p className="text-xl text-neutral/90 italic">{t('modernjazzIdentifyClosing')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Transformation Section - Benefits */}
        <section aria-labelledby="transform-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2
                  id="transform-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('modernjazzTransformTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto mb-12">
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <div className="group h-full min-h-[220px] p-5 sm:p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="text-5xl sm:text-6xl font-black text-primary-accent mb-4 holographic-text">
                      {num}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral mb-3">
                      {t(`modernjazzTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`modernjazzTransform${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Farray's Section */}
        <section className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('modernjazzTransformCTA')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-16">
              {/* Orden: 1-UNESCO, 7-Maestro cubano, 3-Ambiente, 5-Multidisciplinar, 4-Instalaciones, 2-Ubicación, 6-Gala (centrada) */}
              {[1, 7, 3, 5, 4, 2, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className={`[perspective:1000px] ${index === 6 ? 'lg:col-start-2' : ''}`}
                >
                  <div className="group h-full min-h-[160px] p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <CheckCircleIcon className="w-6 h-6 text-primary-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral mb-2">
                          {t(`modernjazzWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-sm leading-relaxed">
                          {t(`modernjazzWhyChoose${num}Desc`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Trust Bar - Stats */}
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

        {/* Logos Section - Nos has podido ver en */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('modernjazzLogosTitle')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto items-center mb-8">
                  <div className="flex flex-col items-center gap-3 p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/cid-unesco-logo.webp"
                        alt="CID UNESCO - Consejo Internacional de la Danza"
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-sm text-center">CID UNESCO</div>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/Street-Dance-2.webp"
                        alt="Street Dance 2 - Película de danza urbana"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-sm text-center">
                      Street Dance 2
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/the-dancer-espectaculo-baile-cuadrada.webp"
                        alt="The Dancer - Espectáculo de baile"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-sm text-center">The Dancer</div>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/telecinco-logo.webp"
                        alt="Telecinco - Cadena de televisión española"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-sm text-center">TV 5</div>
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-black tracking-tighter holographic-text">
                  {t('modernjazzLogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* WhyToday Section */}
        <section
          id="why-today"
          aria-labelledby="why-today-title"
          className="py-12 md:py-20 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2
                  id="why-today-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('modernjazzWhyTodayFullTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/90">{t('modernjazzWhyToday1')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('modernjazzWhyToday2')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('modernjazzWhyToday3')}</p>
                <p className="text-xl sm:text-2xl font-bold holographic-text mt-8">
                  {t('modernjazzWhyTodayClosing1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 italic">
                  {t('modernjazzWhyTodayClosing2')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Video Section - Only if video exists */}
        {MODERN_JAZZ_VIDEO_ID && (
          <section
            id="video"
            aria-labelledby="video-title"
            className="py-12 md:py-20 bg-primary-dark/10"
          >
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="text-center mb-12 max-w-4xl mx-auto">
                  <h2
                    id="video-title"
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                  >
                    {t('modernjazzVideoTitle')}
                  </h2>
                  <p className="text-base sm:text-lg text-neutral/70">{t('modernjazzVideoDesc')}</p>
                </div>
              </AnimateOnScroll>

              <div className="max-w-4xl mx-auto">
                <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                  <YouTubeEmbed videoId={MODERN_JAZZ_VIDEO_ID} title={t('modernjazzVideoTitle')} />
                </AnimateOnScroll>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        <section
          id="testimonials"
          aria-labelledby="testimonials-title"
          className="py-12 md:py-20 bg-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="testimonials-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('testimonialsNotRequested')}
                </h2>
                <div className="inline-block">
                  <div className="mb-4 text-3xl font-black text-neutral">{t('excellent')}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <StarRating size="xl" />
                  </div>
                  <div className="text-sm text-neutral/70">
                    {t('basedOnReviews').replace('{count}', '505')}
                  </div>
                  <div className="mt-2 text-xs text-neutral/50">Google</div>
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {modernJazzTestimonials.slice(0, 4).map((testimonial, index) => (
                <AnimateOnScroll
                  key={testimonial.id}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                >
                  <div className="flex flex-col h-full min-h-[200px] p-4 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2">
                    <div className="flex mb-3">
                      <StarRating size="md" />
                    </div>
                    <blockquote className="flex-grow text-neutral/90 mb-4">
                      <p className="text-sm leading-relaxed">
                        &ldquo;{testimonial.quote[locale]}&rdquo;
                      </p>
                    </blockquote>
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-primary-dark/30">
                      <div>
                        <cite className="font-bold text-neutral not-italic text-sm">
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

        {/* Final CTA Section */}
        <section id="final-cta" className="relative py-12 md:py-20 overflow-hidden">
          {/* Background like Hero - Indigo tones */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('modernjazzFinalCTATitle')}
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 holographic-text">
                  {t('modernjazzFinalCTASubtitle')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-6 sm:mb-8 leading-relaxed">
                  {t('modernjazzFinalCTADesc')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 mb-8 sm:mb-10 italic">
                  {t('modernjazzFinalCTAFunny')}
                </p>

                {/* CTA Final - Enhanced UX & A11y */}
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8"
                  role="group"
                  aria-label={t('modernjazzCTAGroup')}
                >
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta1-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('modernjazzCTA1')}
                    </a>
                    <p id="final-cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('modernjazzCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta2-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('modernjazzCTA2')}
                    </a>
                    <p id="final-cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('modernjazzCTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Cultural History Section */}
        <CulturalHistorySection
          id="cultural-history"
          titleKey="modernjazzCulturalTitle"
          shortDescKey="modernjazzCulturalShort"
          fullHistoryKey="modernjazzCulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* FAQ */}
        <FAQSection title={t('modernjazzFaqTitle')} faqs={modernJazzFaqs} pageUrl={pageUrl} />

        {/* Local SEO Section */}
        <section className="py-10 md:py-14 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto p-6 bg-black/30 rounded-2xl border border-neutral/20">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-4">
                  {t('modernjazzNearbyTitle')}
                </h3>
                <p className="text-neutral/80 mb-6">{t('modernjazzNearbyDesc')}</p>
                <p className="text-neutral/90 font-semibold mb-4">
                  {t('modernjazzNearbySearchText')}
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {MODERN_JAZZ_NEARBY_AREAS.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-primary-accent" />
                      <span className="text-neutral/80">
                        {area.name}: <span className="text-primary-accent">{area.time}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-neutral/70 text-sm mt-4">{t('modernjazzNearbyMetro')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default ModernJazzPage;
