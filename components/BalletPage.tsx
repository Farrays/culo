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
import { BALLET_TESTIMONIALS, BALLET_FAQS_CONFIG, BALLET_SCHEDULE_KEYS } from '../constants/ballet';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import {
  LocalBusinessSchema,
  CourseSchema,
  AggregateReviewsSchema,
  HowToSchema,
  SpeakableSchema,
  DefinedTermSchema,
  EventSchema,
} from './SchemaMarkup';

// Animation delay constants (in ms)
const ANIMATION_DELAYS = {
  STAGGER_SMALL: 100,
  STAGGER_MEDIUM: 150,
} as const;

const BalletPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/ballet-barcelona`;

  // Dynamic date for schemas (current year)
  const currentDate = new Date().toISOString().split('T')[0];

  // Schedule data - traducir las keys dinámicamente
  const schedules = BALLET_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
  }));

  // FAQs - traducir las keys dinámicamente desde constants
  const balletFaqs = BALLET_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - usar desde constants
  const balletTestimonials = BALLET_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = balletTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Ballet - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: currentDate,
  }));

  // BreadcrumbList Schema (JSON-LD) - 4 levels for Ballet
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('balletBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('balletBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('balletBreadcrumbDance'),
        item: `${baseUrl}/${locale}/clases/danza-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('balletBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // FAQPage Schema for rich snippets
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: balletFaqs.map(faq => ({
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
    { name: t('balletBreadcrumbHome'), url: `/${locale}` },
    { name: t('balletBreadcrumbClasses'), url: `/${locale}/clases/baile-barcelona` },
    { name: t('balletBreadcrumbDance'), url: `/${locale}/clases/danza-barcelona` },
    {
      name: t('balletBreadcrumbCurrent'),
      url: `/${locale}/clases/ballet-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('balletPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('balletMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        {/* Hreflang alternates for international SEO */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/clases/ballet-barcelona`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/clases/ballet-barcelona`} />
        <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca/clases/ballet-barcelona`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/clases/ballet-barcelona`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/es/clases/ballet-barcelona`} />
        <meta property="og:title" content={`${t('balletPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('balletMetaDescription')} />
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
        <meta property="og:image" content={`${baseUrl}/images/og-ballet.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('balletPageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('balletMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-ballet.jpg`} />
        {/* Additional SEO meta tags */}
        <meta property="og:site_name" content="Farray's International Dance Center" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="geo.region" content="ES-CT" />
        <meta name="geo.placename" content="Barcelona" />
        <meta name="geo.position" content="41.3751;2.1482" />
        <meta name="ICBM" content="41.3751, 2.1482" />
        <meta name="author" content="Farray's International Dance Center" />
        <meta property="og:image:alt" content={t('balletImageAlt')} />
        {/* Preload hero image for LCP optimization */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/images/classes/ballet/img/clases-ballet-barcelona_960.webp"
          imageSrcSet="/images/classes/ballet/img/clases-ballet-barcelona_480.webp 480w, /images/classes/ballet/img/clases-ballet-barcelona_960.webp 960w"
          imageSizes="(max-width: 768px) 100vw, 50vw"
        />
      </Helmet>

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

      {/* Person Schema for Daniel Sene */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Daniel Sene',
            jobTitle: 'Instructor de Ballet',
            description:
              'Especialista en Ballet clásico con formación profesional y amplia experiencia en técnica y pedagogía de la danza.',
            worksFor: {
              '@type': 'DanceSchool',
              name: "Farray's International Dance Center",
              url: baseUrl,
            },
            knowsAbout: ['Ballet', 'Danza Clásica', 'Técnica de Ballet', 'Puntas', 'Barra'],
          }),
        }}
      />

      {/* Person Schema for Alejandro Miñoso */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Alejandro Miñoso',
            jobTitle: 'Instructor de Ballet',
            description:
              'Maestro cubano formado en la ENA (Escuela Nacional de Arte de Cuba), ex solista de la compañía de Carlos Acosta.',
            worksFor: {
              '@type': 'DanceSchool',
              name: "Farray's International Dance Center",
              url: baseUrl,
            },
            knowsAbout: ['Ballet', 'Danza Clásica', 'Modern Jazz', 'Técnica Cubana', 'Coreografía'],
          }),
        }}
      />

      {/* Schema Markup */}
      <LocalBusinessSchema
        name="Farray's International Dance Center - Clases de Ballet"
        description={t('balletMetaDescription')}
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
        name={t('balletCourseSchemaName')}
        description={t('balletCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="All levels"
        teaches="Ballet clásico, danza clásica, técnica de ballet, postura, flexibilidad, coordinación"
        coursePrerequisites="Ninguno"
        numberOfLessons="2 clases semanales"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de Ballet en Barcelona - Farray's Center"
        itemType="Course"
      />

      {/* HowTo Schema - Cómo empezar en Ballet (GEO Optimization) */}
      <HowToSchema
        name={t('balletHowToName')}
        description={t('balletHowToDesc')}
        totalTime="PT60M"
        estimatedCost={{
          currency: 'EUR',
          value: '15',
        }}
        supply={[t('balletHowToSupply1'), t('balletHowToSupply2'), t('balletHowToSupply3')]}
        steps={[
          {
            name: t('balletHowToStep1Name'),
            text: t('balletHowToStep1Text'),
            url: `${pageUrl}#schedule`,
          },
          {
            name: t('balletHowToStep2Name'),
            text: t('balletHowToStep2Text'),
            url: `${pageUrl}#schedule`,
          },
          {
            name: t('balletHowToStep3Name'),
            text: t('balletHowToStep3Text'),
          },
          {
            name: t('balletHowToStep4Name'),
            text: t('balletHowToStep4Text'),
          },
          {
            name: t('balletHowToStep5Name'),
            text: t('balletHowToStep5Text'),
          },
        ]}
      />

      {/* Speakable Schema - Voice Search Optimization (GEO) */}
      <SpeakableSchema
        name={t('balletPageTitle')}
        description={t('balletMetaDescription')}
        url={pageUrl}
        speakableSelectors={['#hero-title', '#what-is-title', '.speakable-intro', '#faq']}
      />

      {/* DefinedTerm Schema - Technical Terms for AI understanding */}
      <DefinedTermSchema
        terms={[
          {
            name: 'Ballet',
            description: t('balletDefinedTermBallet'),
            url: pageUrl,
          },
          {
            name: 'Danza Clásica',
            description: t('balletDefinedTermDanzaClasica'),
            url: pageUrl,
          },
          {
            name: 'Barra de Ballet',
            description: t('balletDefinedTermBarra'),
            url: pageUrl,
          },
          {
            name: 'Posiciones de Ballet',
            description: t('balletDefinedTermPosiciones'),
            url: pageUrl,
          },
          {
            name: 'Plié',
            description: t('balletDefinedTermPlie'),
            url: pageUrl,
          },
        ]}
      />

      {/* Event Schema - Weekly Ballet Class (Intermedio) */}
      <EventSchema
        name={t('balletEventName')}
        description={t('balletEventDesc')}
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
          name: 'Daniel Sene',
          description: t('balletTeacher1Bio'),
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
        {/* 1. HERO Section */}
        <section
          id="ballet-hero"
          aria-labelledby="hero-title"
          className="relative text-center py-24 md:py-32 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background - Elegant Rose/Pink tones for Ballet */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-black to-black"></div>
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
                {t('balletHeroTitle')}
              </h1>
              <p className="text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('balletHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 mb-6 leading-relaxed speakable-intro">
                {t('balletHeroDesc')}
              </p>
              <p className="text-lg md:text-xl text-neutral/90 italic mb-12">
                {t('balletHeroLocation')}
              </p>

              {/* CTA Buttons - Enhanced UX & A11y */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
                role="group"
                aria-label={t('balletCTAGroup')}
              >
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta1-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('balletCTA1')}
                  </a>
                  <p id="cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('balletCTA1Subtext')}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta2-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('balletCTA2')}
                  </a>
                  <p id="cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('balletCTA2Subtext')}
                  </p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="mt-12">
                <div className="grid grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                  {/* 60 Minutos */}
                  <AnimateOnScroll delay={0}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <ClockIcon className="w-10 h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={60}
                        className="text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-sm md:text-base text-neutral/90 font-semibold">
                        {t('classMinutes')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  {/* ~400 Calorías */}
                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <FlameIcon className="w-10 h-10 text-primary-accent" />
                      </div>
                      <div className="text-4xl md:text-5xl font-black mb-1 holographic-text">
                        ~<AnimatedCounter target={400} className="inline" />
                      </div>
                      <div className="text-sm md:text-base text-neutral/90 font-semibold">
                        {t('balletCaloriesStat')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  {/* 100% técnica cubana */}
                  <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <HeartIcon className="w-10 h-10 text-primary-accent" />
                      </div>
                      <div className="text-4xl md:text-5xl font-black mb-1 holographic-text">
                        100%
                      </div>
                      <div className="text-sm md:text-base text-neutral/90 font-semibold">
                        {t('balletCubanTechnique')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2. What is Ballet Section - Micro presentación */}
        <section aria-labelledby="what-is-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-is-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text"
                >
                  {t('balletWhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90 leading-relaxed">
                    <p className="text-lg sm:text-xl font-semibold holographic-text">
                      {t('balletWhatIsP1')}
                    </p>
                    <p>{t('balletWhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('balletWhatIsP3')}</p>
                    <p>{t('balletWhatIsP4')}</p>
                    <p>{t('balletWhatIsP5')}</p>
                    <p className="text-center text-xl sm:text-2xl font-bold mt-6 sm:mt-8 holographic-text">
                      {t('balletWhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-lg sm:text-xl font-semibold">
                      {t('balletWhatIsQuestionAnswer')}
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/images/classes/ballet/img/clases-ballet-barcelona_480.webp 480w, /images/classes/ballet/img/clases-ballet-barcelona_960.webp 960w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <img
                        src="/images/classes/ballet/img/clases-ballet-barcelona_960.jpg"
                        srcSet="/images/classes/ballet/img/clases-ballet-barcelona_480.jpg 480w, /images/classes/ballet/img/clases-ballet-barcelona_960.jpg 960w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        alt={t('balletImageAlt')}
                        className="w-full h-auto object-cover aspect-square"
                        loading="eager"
                        fetchPriority="high"
                        width={960}
                        height={960}
                      />
                    </picture>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 3. Schedule - Horarios */}
        <ScheduleSection
          titleKey="balletScheduleTitle"
          subtitleKey="balletScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* 4. Teacher Section - Profesores */}
        <section id="teachers" className="py-12 md:py-20 bg-black relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
                  {t('balletTeachersTitle')}
                </h2>
                <p className="text-xl text-neutral/70 mt-4">{t('balletTeachersSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Daniel Sene */}
              <AnimateOnScroll
                delay={ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-6">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="/images/teachers/img/profesor-daniel-sené_320.webp 320w, /images/teachers/img/profesor-daniel-sené_640.webp 640w"
                          sizes="160px"
                        />
                        <img
                          src="/images/teachers/img/profesor-daniel-sené_320.jpg"
                          srcSet="/images/teachers/img/profesor-daniel-sené_320.jpg 320w, /images/teachers/img/profesor-daniel-sené_640.jpg 640w"
                          sizes="160px"
                          alt="Daniel Sené - Profesor de Ballet en Barcelona"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-2">Daniel Sené</h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('balletTeacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">
                      {t('balletTeacher1Bio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Alejandro Miñoso */}
              <AnimateOnScroll
                delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-6">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="/images/teachers/img/profesor-alejandro-miñoso_320.webp 320w, /images/teachers/img/profesor-alejandro-miñoso_640.webp 640w"
                          sizes="160px"
                        />
                        <img
                          src="/images/teachers/img/profesor-alejandro-miñoso_320.jpg"
                          srcSet="/images/teachers/img/profesor-alejandro-miñoso_320.jpg 320w, /images/teachers/img/profesor-alejandro-miñoso_640.jpg 640w"
                          sizes="160px"
                          alt="Alejandro Miñoso - Profesor de Ballet en Barcelona"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-2">Alejandro Miñoso</h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('balletTeacher2Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">
                      {t('balletTeacher2Bio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-lg text-neutral/90 mt-10 max-w-2xl mx-auto">
                {t('balletTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 5. Identification Section - Puntos de dolor */}
        <section aria-labelledby="identify-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="identify-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('balletIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <ul
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-10 list-none"
              role="list"
              aria-label={t('balletIdentifyListLabel')}
            >
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  as="li"
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="group relative h-full min-h-[140px] flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [perspective:1000px] [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow motion-reduce:transform-none motion-reduce:transition-colors"
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300"
                    aria-hidden="true"
                  >
                    <CheckIcon className="text-primary-accent" size="sm" />
                  </div>
                  <p className="text-neutral/90 leading-relaxed">{t(`balletIdentify${num}`)}</p>
                </AnimateOnScroll>
              ))}
            </ul>

            {/* Texto de transición + Necesitas apuntarte */}
            <AnimateOnScroll>
              <div className="text-center mb-6">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('balletIdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-8 max-w-4xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('balletNeedEnrollTitle')}
                </h3>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <p className="text-xl font-semibold holographic-text">
                  {t('balletIdentifyAgitate1')}
                </p>
                <p className="text-lg text-neutral/90">{t('balletIdentifySolution')}</p>
                <p className="text-xl text-neutral/90 italic">{t('balletIdentifyClosing')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 6. Transformation Section - Imagina tu Antes y Después */}
        <section aria-labelledby="transform-title" className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="transform-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('balletTransformTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
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
                      {t(`balletTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`balletTransform${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Why Choose Farray's + Logos Section - Autoridad */}
        <section className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('balletTransformCTA')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12">
              {/* Orden: 1-UNESCO, 7-Maestros ENA, 3-Ambiente, 5-Multidisciplinar, 4-Instalaciones, 2-Ubicación, 6-Gala (centrada) */}
              {[1, 7, 3, 5, 4, 2, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className={`[perspective:1000px] ${index === 6 ? 'lg:col-start-2' : ''}`}
                >
                  <div className="group h-full min-h-[160px] p-4 sm:p-6 bg-black/30 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <CheckCircleIcon className="w-6 h-6 text-primary-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral mb-2">
                          {t(`balletWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-sm leading-relaxed">
                          {t(`balletWhyChoose${num}Desc`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Trust Bar - Stats */}
            <AnimateOnScroll>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto mb-12">
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

            {/* Logos - Nos has podido ver en */}
            <AnimateOnScroll>
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('balletLogosTitle')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto items-center mb-6">
                  <div className="flex flex-col items-center gap-3 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/cid-unesco-logo.webp"
                        alt="CID UNESCO - Consejo Internacional de la Danza"
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-sm text-center">CID UNESCO</div>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg">
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
                  <div className="flex flex-col items-center gap-3 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/the-dancer-espectaculo-baile-cuadrada.webp"
                        alt="The Dancer - Espectáculo de baile"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-sm text-center">The Dancer</div>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-16 h-16 flex items-center justify-center overflow-hidden rounded-lg">
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
                <p className="text-3xl md:text-4xl font-black tracking-tighter holographic-text">
                  {t('balletLogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 8. Why Today Section */}
        <section className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-5">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('balletWhyTodayFullTitle')}
                </h2>
                <p className="text-xl text-neutral/90">{t('balletWhyToday1')}</p>
                <p className="text-xl text-neutral/90">{t('balletWhyToday2')}</p>
                <p className="text-xl text-neutral/90">{t('balletWhyToday3')}</p>
                <p className="text-2xl font-bold holographic-text mt-6">
                  {t('balletWhyTodayClosing1')}
                </p>
                <p className="text-lg text-neutral/90 italic">{t('balletWhyTodayClosing2')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 10. Testimonials */}
        <section
          id="testimonials"
          aria-labelledby="testimonials-title"
          className="py-12 md:py-20 bg-primary-dark/10"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 max-w-4xl mx-auto">
                <h2
                  id="testimonials-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text"
                >
                  {t('testimonialsNotRequested')}
                </h2>
                <div className="inline-block">
                  <div className="mb-3 text-3xl font-black text-neutral">{t('excellent')}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <StarRating size="lg" />
                  </div>
                  <div className="text-sm text-neutral/70">
                    {t('basedOnReviews').replace('{count}', '505')}
                  </div>
                  <div className="mt-2 text-xs text-neutral/50">Google</div>
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
              {balletTestimonials.map((testimonial, index) => (
                <AnimateOnScroll
                  key={testimonial.id}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                >
                  <div className="flex flex-col h-full min-h-[200px] p-4 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2">
                    <div className="mb-3">
                      <StarRating size="sm" label="5 estrellas" />
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

        {/* 11. Final CTA Section */}
        <section id="final-cta" className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
          {/* Background like Hero - Rose tones */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('balletFinalCTATitle')}
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 holographic-text">
                  {t('balletFinalCTASubtitle')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-5 sm:mb-6 leading-relaxed">
                  {t('balletFinalCTADesc')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 mb-6 sm:mb-8 italic">
                  {t('balletFinalCTAFunny')}
                </p>

                {/* CTA Final - Enhanced UX & A11y */}
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                  role="group"
                  aria-label={t('balletCTAGroup')}
                >
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta1-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('balletCTA1')}
                    </a>
                    <p id="final-cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('balletCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta2-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('balletCTA2')}
                    </a>
                    <p id="final-cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('balletCTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 12. Cultural History - Contenido profundo SEO */}
        <CulturalHistorySection
          titleKey="balletCulturalHistoryTitle"
          shortDescKey="balletCulturalShort"
          fullHistoryKey="balletCulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* 13. FAQ */}
        <FAQSection title={t('balletFaqTitle')} faqs={balletFaqs} pageUrl={pageUrl} />
      </main>
    </>
  );
};

export default BalletPage;
