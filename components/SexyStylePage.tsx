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
  SEXY_STYLE_TESTIMONIALS,
  SEXY_STYLE_FAQS_CONFIG,
  SEXY_STYLE_SCHEDULE_KEYS,
  SEXY_STYLE_VIDEO_ID,
} from '../constants/sexy-style';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import YouTubeEmbed from './YouTubeEmbed';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from './SchemaMarkup';

// Animation delay constants (in ms)
const ANIMATION_DELAYS = {
  STAGGER_SMALL: 100,
  STAGGER_MEDIUM: 150,
} as const;

const SexyStylePage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/sexy-style-barcelona`;

  // Dynamic date for schemas (current year)
  const currentDate = new Date().toISOString().split('T')[0];

  // Schedule data - traducir las keys dinámicamente
  const schedules = SEXY_STYLE_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
  }));

  // FAQs - traducir las keys dinámicamente desde constants
  const sexyStyleFaqs = SEXY_STYLE_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - usar desde constants
  const sexyStyleTestimonials = SEXY_STYLE_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = sexyStyleTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Sexy Style - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: currentDate,
  }));

  // VideoObject Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('sexystyleVideoTitle'),
    description: t('sexystyleVideoDesc'),
    thumbnailUrl: `https://img.youtube.com/vi/${SEXY_STYLE_VIDEO_ID}/maxresdefault.jpg`,
    uploadDate: currentDate,
    contentUrl: `https://www.youtube.com/watch?v=${SEXY_STYLE_VIDEO_ID}`,
    embedUrl: `https://www.youtube.com/embed/${SEXY_STYLE_VIDEO_ID}`,
    duration: 'PT3M',
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: 1000,
    },
  };

  // BreadcrumbList Schema (JSON-LD) - 4 levels for Sexy Style
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('sexystyleBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('sexystyleBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('sexystyleBreadcrumbUrban'),
        item: `${baseUrl}/${locale}/clases/danzas-urbanas-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('sexystyleBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // FAQPage Schema for rich snippets
  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: sexyStyleFaqs.map(faq => ({
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
    { name: t('sexystyleBreadcrumbHome'), url: `/${locale}` },
    { name: t('sexystyleBreadcrumbClasses'), url: `/${locale}/clases/baile-barcelona` },
    { name: t('sexystyleBreadcrumbUrban'), url: `/${locale}/clases/danzas-urbanas-barcelona` },
    {
      name: t('sexystyleBreadcrumbCurrent'),
      url: `/${locale}/clases/sexy-style-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('sexystylePageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('sexystyleMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        {/* Hreflang alternates for international SEO */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/clases/sexy-style-barcelona`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/clases/sexy-style-barcelona`} />
        <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca/clases/sexy-style-barcelona`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/clases/sexy-style-barcelona`} />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es/clases/sexy-style-barcelona`}
        />
        <meta property="og:title" content={`${t('sexystylePageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('sexystyleMetaDescription')} />
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
        <meta property="og:image" content={`${baseUrl}/images/og-sexy-style.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content={
            t('sexystyleOgImageAlt') || "Clases de Sexy Style en Barcelona - Farray's Center"
          }
        />
        <meta property="og:site_name" content="Farray's International Dance Center" />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="geo.region" content="ES-CT" />
        <meta name="geo.placename" content="Barcelona" />
        <meta name="geo.position" content="41.3751;2.1482" />
        <meta name="ICBM" content="41.3751, 2.1482" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('sexystylePageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('sexystyleMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-sexy-style.jpg`} />
        {/* Preload critical image for LCP optimization */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/images/classes/sexy-style/img/clases-de-sexy-style-barcelona_960.webp"
          imageSrcSet="/images/classes/sexy-style/img/clases-de-sexy-style-barcelona_640.webp 640w, /images/classes/sexy-style/img/clases-de-sexy-style-barcelona_960.webp 960w"
          imageSizes="(max-width: 768px) 100vw, 50vw"
        />
      </Helmet>

      {/* VideoObject Schema - Keep this for video SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />

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

      {/* Person Schema for Yasmina Fernández */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Yasmina Fernández',
            jobTitle: 'Instructora de Sexy Style',
            description:
              'Especialista en Sexy Style con años de experiencia. Técnica, flow y energía contagiosa en cada clase.',
            image: `${baseUrl}/images/teachers/img/profesora-yasmina-fernandez_640.jpg`,
            worksFor: {
              '@type': 'DanceSchool',
              name: "Farray's International Dance Center",
              url: baseUrl,
            },
            knowsAbout: ['Sexy Style', 'Choreography', 'Sensuality Dance', 'Urban Dance'],
          }),
        }}
      />

      {/* Schema Markup */}
      <LocalBusinessSchema
        name="Farray's International Dance Center - Clases de Sexy Style"
        description={t('sexystyleMetaDescription')}
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
        name={t('sexystyleCourseSchemaName')}
        description={t('sexystyleCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="All levels"
        teaches="Sexy Style, sensualidad, expresión corporal, coreografía, feminidad"
        coursePrerequisites="Ninguno"
        numberOfLessons="4 clases semanales"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de Sexy Style en Barcelona - Farray's Center"
        itemType="Course"
      />

      {/* Skip Links for Accessibility */}
      <nav aria-label={t('skipLinksLabel') || 'Skip links'} className="skip-links">
        <a
          href="#sexy-style-hero"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white min-h-[48px] flex items-center motion-reduce:transition-none"
        >
          {t('skipToContent')}
        </a>
        <a
          href="#schedule"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-48 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white min-h-[48px] flex items-center motion-reduce:transition-none"
        >
          {t('skipToSchedule') || 'Ir al horario'}
        </a>
      </nav>

      <div className="pt-20 md:pt-24">
        {/* HERO Section */}
        <section
          id="sexy-style-hero"
          aria-labelledby="sexy-style-hero-title"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1
                id="sexy-style-hero-title"
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text"
              >
                {t('sexystyleHeroTitle')}
              </h1>
              <p className="text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('sexystyleHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 mb-6 leading-relaxed">
                {t('sexystyleHeroDesc')}
              </p>
              <p className="text-lg md:text-xl text-neutral/90 italic mb-12">
                {t('sexystyleHeroLocation')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10">
                <div className="w-full sm:w-auto">
                  <p id="cta1-desc" className="sr-only">
                    {t('sexystyleCTA1Subtext')}
                  </p>
                  <a
                    href="#schedule"
                    aria-describedby="cta1-desc"
                    className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center min-h-[48px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('sexystyleCTA1')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center" aria-hidden="true">
                    {t('sexystyleCTA1Subtext')}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <p id="cta2-desc" className="sr-only">
                    {t('sexystyleCTA2Subtext')}
                  </p>
                  <a
                    href="#schedule"
                    aria-describedby="cta2-desc"
                    className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center min-h-[48px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('sexystyleCTA2')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center" aria-hidden="true">
                    {t('sexystyleCTA2Subtext')}
                  </p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="mt-16">
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 max-w-4xl mx-auto">
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

                  {/* Sensualidad */}
                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <FlameIcon className="w-10 h-10 text-primary-accent" />
                      </div>
                      <div className="text-4xl md:text-5xl font-black mb-1 holographic-text">
                        {t('sexystyleSensualityStat')}
                      </div>
                      <div className="text-sm md:text-base text-neutral/90 font-semibold mt-1">
                        {t('sexystyleEmpowerment')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  {/* 100% Confianza */}
                  <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <HeartIcon className="w-10 h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={100}
                        suffix="%"
                        className="text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-sm md:text-base text-neutral/90 font-semibold">
                        {t('sexystyleConfidenceGuaranteed')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* What is Sexy Style Section */}
        <section className="py-20 md:py-32 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text">
                  {t('sexystyleWhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90 leading-relaxed">
                    <p className="text-lg sm:text-xl font-semibold holographic-text">
                      {t('sexystyleWhatIsP1')}
                    </p>
                    <p>{t('sexystyleWhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('sexystyleWhatIsP3')}</p>
                    <p>{t('sexystyleWhatIsP4')}</p>
                    <p className="text-center text-xl sm:text-2xl font-bold mt-6 sm:mt-8 holographic-text">
                      {t('sexystyleWhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-lg sm:text-xl font-semibold">
                      {t('sexystyleWhatIsQuestionAnswer')}
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/images/classes/sexy-style/img/clases-de-sexy-style-barcelona_640.webp 640w, /images/classes/sexy-style/img/clases-de-sexy-style-barcelona_960.webp 960w, /images/classes/sexy-style/img/clases-de-sexy-style-barcelona_1440.webp 1440w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <img
                        src="/images/classes/sexy-style/img/clases-de-sexy-style-barcelona_960.jpg"
                        srcSet="/images/classes/sexy-style/img/clases-de-sexy-style-barcelona_640.jpg 640w, /images/classes/sexy-style/img/clases-de-sexy-style-barcelona_960.jpg 960w, /images/classes/sexy-style/img/clases-de-sexy-style-barcelona_1440.jpg 1440w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        alt={t('sexystyleImageAlt')}
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

        {/* Cultural History - Expandable (without title) */}
        <CulturalHistorySection
          titleKey=""
          shortDescKey="sexystyleCulturalShort"
          fullHistoryKey="sexystyleCulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* Identification Section - ¿Te identificas? */}
        <section
          id="identification"
          aria-labelledby="identification-title"
          className="pt-8 pb-16 md:pt-12 md:pb-24 bg-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2
                  id="identification-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('sexystyleIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <ul
              role="list"
              aria-label={t('sexystyleIdentifyListLabel') || 'Señales de que Sexy Style es para ti'}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12 list-none"
            >
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  as="li"
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="group relative h-full min-h-[140px] flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow motion-reduce:transform-none motion-reduce:transition-none [perspective:1000px]"
                >
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300"
                    aria-hidden="true"
                  >
                    <CheckIcon className="text-primary-accent" size="sm" />
                  </div>
                  <p className="text-neutral/90 leading-relaxed">{t(`sexystyleIdentify${num}`)}</p>
                </AnimateOnScroll>
              ))}
            </ul>
          </div>
        </section>

        {/* Necesitas apuntarte Section */}
        <section
          id="why-enroll"
          aria-labelledby="why-enroll-title"
          className="py-20 md:py-32 bg-primary-dark/10"
        >
          <div className="container mx-auto px-6">
            {/* Texto de transición pequeño */}
            <AnimateOnScroll>
              <div className="text-center mb-8">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('sexystyleIdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="why-enroll-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('sexystyleNeedEnrollTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <p className="text-xl font-semibold holographic-text">
                  {t('sexystyleIdentifyAgitate1')}
                </p>
                <p className="text-lg text-neutral/90">{t('sexystyleIdentifySolution')}</p>
                <p className="text-xl text-neutral/90 italic">{t('sexystyleIdentifyClosing')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Transformation Section - Benefits */}
        <section
          id="benefits"
          aria-labelledby="benefits-title"
          className="py-12 md:py-16 bg-primary-dark/10"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2
                  id="benefits-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('sexystyleTransformTitle')}
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
                      {t(`sexystyleTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`sexystyleTransform${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Farray's Section */}
        <section className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('sexystyleTransformCTA')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-16">
              {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <div className="group h-full min-h-[160px] p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="flex items-start gap-3 sm:gap-4 h-full">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <CheckCircleIcon className="w-6 h-6 text-primary-accent" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral mb-2">
                          {t(`sexystyleWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-sm leading-relaxed">
                          {t(`sexystyleWhyChoose${num}Desc`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Trust Bar - Stats */}
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

        {/* Logos Section - Nos has podido ver en */}
        <section className="py-16 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('sexystyleLogosTitle')}
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
                  {t('sexystyleLogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Teacher Section - Yasmina Fernández */}
        <section id="teachers" className="py-20 md:py-32 bg-black relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
                  {t('sexystyleTeachersTitle')}
                </h2>
                <p className="text-xl text-neutral/70 mt-4">{t('sexystyleTeachersSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-2xl mx-auto">
              <AnimateOnScroll
                delay={ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-6">
                      <picture>
                        <source
                          srcSet="/images/teachers/img/profesora-yasmina-fernandez_320.webp 320w, /images/teachers/img/profesora-yasmina-fernandez_640.webp 640w"
                          sizes="192px"
                          type="image/webp"
                        />
                        <img
                          src="/images/teachers/img/profesora-yasmina-fernandez_640.jpg"
                          alt="Yasmina Fernández - Instructora de Sexy Style"
                          width="192"
                          height="192"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-2">Yasmina Fernández</h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('sexystyleTeacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed">{t('sexystyleTeacher1Bio')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-lg text-neutral/90 mt-12 max-w-2xl mx-auto">
                {t('sexystyleTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Schedule */}
        <ScheduleSection
          titleKey="sexystyleScheduleTitle"
          subtitleKey="sexystyleScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* Testimonials */}
        <section id="testimonials" className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('testimonialsNotRequested')}
                </h2>
                <div className="inline-block">
                  <div className="mb-4 text-3xl font-black text-neutral">{t('excellent')}</div>
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

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-7xl mx-auto">
              {sexyStyleTestimonials.map((testimonial, index) => (
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

        {/* Video Section */}
        <section id="video" className="py-20 md:py-32 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('sexystyleVideoTitle')}
                </h2>
                <p className="text-lg text-neutral/70">{t('sexystyleVideoDesc')}</p>
              </div>
            </AnimateOnScroll>

            {/* Video centrado */}
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <YouTubeEmbed videoId={SEXY_STYLE_VIDEO_ID} title={t('sexystyleVideoTitle')} />
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Why Today Section */}
        <section className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('sexystyleWhyTodayFullTitle')}
                </h2>
                <p className="text-xl text-neutral/90">{t('sexystyleWhyToday1')}</p>
                <p className="text-xl text-neutral/90">{t('sexystyleWhyToday2')}</p>
                <p className="text-xl text-neutral/90">{t('sexystyleWhyToday3')}</p>
                <p className="text-2xl font-bold holographic-text mt-8">
                  {t('sexystyleWhyTodayClosing1')}
                </p>
                <p className="text-lg text-neutral/90 italic">{t('sexystyleWhyTodayClosing2')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="final-cta" className="relative py-12 sm:py-20 md:py-32 overflow-hidden">
          {/* Background like Hero */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('sexystyleFinalCTATitle')}
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 holographic-text">
                  {t('sexystyleFinalCTASubtitle')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-6 sm:mb-8 leading-relaxed">
                  {t('sexystyleFinalCTADesc')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 mb-8 sm:mb-10 italic">
                  {t('sexystyleFinalCTAFunny')}
                </p>

                {/* CTA Final */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center"
                    >
                      {t('sexystyleCTA1')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('sexystyleCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center"
                    >
                      {t('sexystyleCTA2')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('sexystyleCTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection title={t('sexystyleFaqTitle')} faqs={sexyStyleFaqs} pageUrl={pageUrl} />
      </div>
    </>
  );
};

export default SexyStylePage;
