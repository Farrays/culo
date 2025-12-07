import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  DANCEHALL_TESTIMONIALS,
  DANCEHALL_FAQS_CONFIG,
  DANCEHALL_SCHEDULE_KEYS,
} from '../constants/dancehall';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import YouTubeEmbed from './YouTubeEmbed';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from './SchemaMarkup';
import {
  StarRating,
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  StarIcon,
  PlayIcon,
  UserIcon,
} from './shared/Icons';

// Animation delay constants for consistent timing
const ANIMATION_DELAYS = {
  STAGGER_SMALL: 100,
  STAGGER_MEDIUM: 150,
};

const DancehallPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/dancehall-barcelona`;

  // Schedule data - traducir las keys dinámicamente
  const schedules = DANCEHALL_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
  }));

  // FAQs - traducir las keys dinámicamente desde constants
  const dancehallV3Faqs = DANCEHALL_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - usar desde constants
  const dancehallTestimonials = DANCEHALL_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = dancehallTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Dancehall - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: '2025-01-01',
  }));

  // VideoObject Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('dhV3VideoTitle'),
    description: t('dhV3VideoDesc'),
    thumbnailUrl: `${baseUrl}/images/classes/dancehall/video-thumbnail.jpg`,
    uploadDate: '2025-01-01',
    contentUrl: `${baseUrl}/videos/dancehall-class-experience.mp4`,
    embedUrl: `${baseUrl}/videos/dancehall-class-experience.mp4`,
  };

  // BreadcrumbList Schema (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('dhV3BreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('dhV3BreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('dhV3BreadcrumbUrban'),
        item: `${baseUrl}/${locale}/clases/danzas-urbanas-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('dhV3BreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('dhV3BreadcrumbHome'), url: `/${locale}` },
    { name: t('dhV3BreadcrumbClasses'), url: `/${locale}/clases` },
    { name: t('dhV3BreadcrumbUrban'), url: `/${locale}/clases/danzas-urbanas-barcelona` },
    {
      name: t('dhV3BreadcrumbCurrent'),
      url: `/${locale}/clases/dancehall-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('dhV3PageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('dhV3MetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${t('dhV3PageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('dhV3MetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-dancehall.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('dhV3PageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('dhV3MetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-dancehall.jpg`} />
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

      {/* Schema Markup */}
      <LocalBusinessSchema
        name="Farray's International Dance Center - Clases de Dancehall"
        description={t('dhV3MetaDescription')}
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
        name={t('dhV3CourseSchemaName')}
        description={t('dhV3CourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner, Intermediate, Advanced"
        teaches="Dancehall jamaicano, técnica de danza urbana, musicalidad"
        coursePrerequisites="Ninguno"
        numberOfLessons="5 clases semanales"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de Dancehall en Barcelona - Farray's Center"
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
          id="dancehall-hero"
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

            <AnimateOnScroll>
              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text"
              >
                {t('dhV3HeroTitle')}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('dhV3HeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral/90 mt-6 sm:mt-8 mb-4 sm:mb-6 leading-relaxed">
                {t('dhV3HeroDesc')}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-neutral/90 italic mb-8 sm:mb-12">
                {t('dhV3HeroLocation')}
              </p>

              {/* CTA Buttons - Enhanced UX & A11y */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
                role="group"
                aria-label={t('dhV3CTAGroup') || 'Opciones de inscripción'}
              >
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta1-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('dhV3CTA1')}
                  </a>
                  <p id="cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('dhV3CTA1Subtext')}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta2-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('dhV3CTA2')}
                  </a>
                  <p id="cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('dhV3CTA2Subtext')}
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
                      <AnimatedCounter
                        target={60}
                        className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
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
                        ~<AnimatedCounter target={500} className="inline" />
                      </div>
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('caloriesBurned')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  {/* 100% Diversión */}
                  <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <StarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={100}
                        suffix="%"
                        className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('funGuaranteed')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2. What is Dancehall Section */}
        <section aria-labelledby="what-is-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-is-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 text-center holographic-text"
                >
                  {t('dhV3WhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90 leading-relaxed">
                    <p className="text-lg sm:text-xl font-semibold holographic-text">
                      {t('dhV3WhatIsP1')}
                    </p>
                    <p>{t('dhV3WhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('dhV3WhatIsP3')}</p>
                    <p>{t('dhV3WhatIsP4')}</p>
                    <p className="text-center text-xl sm:text-2xl font-bold mt-6 sm:mt-8 holographic-text">
                      {t('dhV3WhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-lg sm:text-xl font-semibold">
                      {t('dhV3WhatIsQuestionAnswer')}
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/images/classes/dancehall/img/dancehall-classes-barcelona-01_480.webp 480w, /images/classes/dancehall/img/dancehall-classes-barcelona-01_960.webp 960w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <img
                        src="/images/classes/dancehall/img/dancehall-classes-barcelona-01_960.webp"
                        alt="Clases de Dancehall en Barcelona - Estudiantes bailando en la academia"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </picture>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 3. Schedule */}
        <ScheduleSection
          titleKey="dhV3ScheduleTitle"
          subtitleKey="dhV3ScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* 4. Teachers Section */}
        <section
          id="teachers"
          aria-labelledby="teachers-title"
          className="py-12 md:py-20 bg-black relative overflow-hidden"
        >
          {/* Jamaica Flag Background */}
          <div className="absolute inset-0 opacity-30" aria-hidden="true">
            <img
              src="/images/classes/dancehall/raw/Jamaica.webp"
              alt=""
              width="1920"
              height="1080"
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.9)' }}
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="teachers-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
                >
                  {t('dhV3TeachersTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 mt-4">
                  {t('dhV3TeachersSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {/* Isabel López */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL} className="[perspective:1000px]">
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-4 sm:mb-6 bg-gradient-to-br from-primary-accent/30 to-primary-dark/50 flex items-center justify-center">
                      <UserIcon className="w-16 h-16 sm:w-20 sm:h-20 text-primary-accent/60" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-2">Isabel López</h3>
                    <p className="text-primary-accent font-semibold mb-3 sm:mb-4">
                      {t('dhV3Teacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">{t('dhV3Teacher1Bio')}</p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Sandra Gómez */}
              <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL} className="[perspective:1000px]">
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-4 sm:mb-6 bg-gradient-to-br from-primary-accent/30 to-primary-dark/50 flex items-center justify-center">
                      <UserIcon className="w-16 h-16 sm:w-20 sm:h-20 text-primary-accent/60" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-2">Sandra Gómez</h3>
                    <p className="text-primary-accent font-semibold mb-3 sm:mb-4">
                      {t('dhV3Teacher2Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">{t('dhV3Teacher2Bio')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-base sm:text-lg text-neutral/90 mt-8 sm:mt-10 max-w-2xl mx-auto">
                {t('dhV3TeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 5. Identification Section - Puntos de dolor + Necesitas apuntarte */}
        <section aria-labelledby="identify-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="identify-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 holographic-text"
                >
                  {t('dhV3IdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <ul
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-8 sm:mb-10 list-none"
              role="list"
              aria-label={t('dhV3IdentifyListLabel') || 'Situaciones con las que te identificas'}
            >
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  as="li"
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <div className="group relative h-full min-h-[100px] flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300"
                      aria-hidden="true"
                    >
                      <CheckIcon className="text-primary-accent" size="sm" />
                    </div>
                    <p className="text-neutral/90 leading-relaxed">{t(`dhV3Identify${num}`)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </ul>

            {/* Texto de transición + Necesitas apuntarte */}
            <AnimateOnScroll>
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('dhV3IdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-6 sm:mb-8 max-w-4xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 sm:mb-6 holographic-text">
                  {t('dhV3NeedEnrollTitle')}
                </h3>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
                <p className="text-lg sm:text-xl font-semibold holographic-text">
                  {t('dhV3IdentifyAgitate1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90">{t('dhV3IdentifySolution')}</p>
                <p className="text-lg sm:text-xl text-neutral/90 italic">{t('dhV3IdentifyClosing')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 6. Transformation Section - Imagina tu Antes y Después */}
        <section aria-labelledby="transform-title" className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="transform-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('dhV3TransformTitle')}
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
                  <div className="group h-full min-h-[200px] sm:min-h-[220px] p-5 sm:p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="text-5xl sm:text-6xl font-black text-primary-accent mb-3 sm:mb-4 holographic-text">
                      {num}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral mb-2 sm:mb-3">
                      {t(`dhV3Transform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`dhV3Transform${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Why Choose Farray's + Logos Section */}
        <section className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('dhV3TransformCTA')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-10 sm:mb-12">
              {[1, 7, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className={`[perspective:1000px] ${index === 6 ? 'lg:col-start-2' : ''}`}
                >
                  <div className="group h-full min-h-[140px] sm:min-h-[160px] p-4 sm:p-6 bg-black/30 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <CheckCircleIcon className="w-6 h-6 text-primary-accent" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-neutral mb-2">
                          {t(`dhV3WhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-sm leading-relaxed">
                          {t(`dhV3WhyChoose${num}Desc`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Trust Bar - Stats */}
            <AnimateOnScroll>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-16 max-w-5xl mx-auto mb-10 sm:mb-12">
                <div className="text-center">
                  <AnimatedCounter
                    target={8}
                    suffix="+"
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-lg sm:text-xl md:text-2xl text-neutral/90 font-bold uppercase tracking-wide">
                    {t('yearsExperience')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={1500}
                    suffix="+"
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-lg sm:text-xl md:text-2xl text-neutral/90 font-bold uppercase tracking-wide">
                    {t('activeStudents')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={15000}
                    suffix="+"
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-lg sm:text-xl md:text-2xl text-neutral/90 font-bold uppercase tracking-wide">
                    {t('satisfiedStudents')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Logos - Nos has podido ver en */}
            <AnimateOnScroll>
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 holographic-text">
                  {t('dhV3LogosTitle')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto items-center mb-4 sm:mb-6">
                  <div className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/cid-unesco-logo.webp"
                        alt="CID UNESCO - Consejo Internacional de la Danza"
                        loading="lazy"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-xs sm:text-sm text-center">CID UNESCO</div>
                  </div>
                  <div className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/Street-Dance-2.webp"
                        alt="Street Dance 2 - Película de danza urbana"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-xs sm:text-sm text-center">
                      Street Dance 2
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/the-dancer-espectaculo-baile-cuadrada.webp"
                        alt="The Dancer - Espectáculo de baile"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-xs sm:text-sm text-center">The Dancer</div>
                  </div>
                  <div className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/telecinco-logo.webp"
                        alt="Telecinco - Cadena de televisión española"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-xs sm:text-sm text-center">TV 5</div>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter holographic-text">
                  {t('dhV3LogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 8. Why Today Section */}
        <section className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 sm:mb-6 holographic-text">
                  {t('dhV3WhyTodayFullTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/90">{t('dhV3WhyToday1')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('dhV3WhyToday2')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('dhV3WhyToday3')}</p>
                <p className="text-xl sm:text-2xl font-bold holographic-text mt-4 sm:mt-6">
                  {t('dhV3WhyTodayClosing1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 italic">{t('dhV3WhyTodayClosing2')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 9. Video Section */}
        <section id="video" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('dhV3VideoTitle')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/70">{t('dhV3VideoDesc')}</p>
              </div>
            </AnimateOnScroll>

            {/* Videos Grid - 3 horizontales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <YouTubeEmbed
                  videoId="TteV2if6Qso"
                  title="Clases de Dancehall en Barcelona - Farray's Center"
                />
              </AnimateOnScroll>

              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}>
                <div className="aspect-video rounded-2xl overflow-hidden border-2 border-primary-accent/50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-4 sm:p-6" aria-hidden="true">
                    <PlayIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-primary-accent/50" />
                    <p className="text-sm sm:text-base text-neutral/70 font-semibold">
                      Video próximamente
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 3}>
                <div className="aspect-video rounded-2xl overflow-hidden border-2 border-primary-accent/50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-4 sm:p-6" aria-hidden="true">
                    <PlayIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-primary-accent/50" />
                    <p className="text-sm sm:text-base text-neutral/70 font-semibold">
                      Video próximamente
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* 10. Testimonials */}
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
                  {t('testimonialsNotRequested')}
                </h2>
                <div className="inline-block">
                  <div className="mb-2 sm:mb-3 text-2xl sm:text-3xl font-black text-neutral">{t('excellent')}</div>
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
              {dancehallTestimonials.map((testimonial, index) => (
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

        {/* 11. Final CTA Section */}
        <section id="final-cta" className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
          {/* Background like Hero */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('dhV3FinalCTATitle')}
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 holographic-text">
                  {t('dhV3FinalCTASubtitle')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-5 sm:mb-6 leading-relaxed">
                  {t('dhV3FinalCTADesc')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 mb-6 sm:mb-8 italic">
                  {t('dhV3FinalCTAFunny')}
                </p>

                {/* CTA Final - Enhanced UX & A11y */}
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                  role="group"
                  aria-label={t('dhV3CTAGroup') || 'Opciones de inscripción'}
                >
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta1-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('dhV3CTA1')}
                    </a>
                    <p id="final-cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('dhV3CTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta2-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('dhV3CTA2')}
                    </a>
                    <p id="final-cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('dhV3CTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 12. Cultural History - Contenido profundo SEO */}
        <CulturalHistorySection
          titleKey="dhV3CulturalTitle"
          shortDescKey="dhV3CulturalShort"
          fullHistoryKey="dhV3CulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* 13. FAQ */}
        <FAQSection title={t('dhV3FaqTitle')} faqs={dancehallV3Faqs} pageUrl={pageUrl} />
      </main>
    </>
  );
};

export default DancehallPage;
