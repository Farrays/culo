import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  AFRO_JAZZ_TESTIMONIALS,
  AFRO_JAZZ_FAQS_CONFIG,
  AFRO_JAZZ_SCHEDULE_KEYS,
  AFRO_JAZZ_LEVELS,
  AFRO_JAZZ_PREPARE_CONFIG,
} from '../constants/afro-jazz';
import { ANIMATION_DELAYS, BARCELONA_NEARBY_AREAS } from '../constants/shared';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import LevelCardsSection from './shared/LevelCardsSection';
import PrepareClassSection from './shared/PrepareClassSection';
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
} from '../lib/icons';
import { MapPinIcon } from './shared/CommonIcons';

const AfroJazzPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/afro-jazz`;

  // Schedule data - traducir las keys dinámicamente
  const schedules = AFRO_JAZZ_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
    note: 'note' in schedule ? (schedule as { note?: string }).note : undefined,
  }));

  // FAQs - traducir las keys dinámicamente desde constants
  const afrojazzFaqs = AFRO_JAZZ_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - usar desde constants
  const afrojazzTestimonials = AFRO_JAZZ_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = afrojazzTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de AfroJazz - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: new Date().toISOString().split('T')[0],
  }));

  // VideoObject Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('afrojazzVideoTitle'),
    description: t('afrojazzVideoDesc'),
    thumbnailUrl: 'https://img.youtube.com/vi/${AFRO_JAZZ_VIDEO_ID}/maxresdefault.jpg',
    uploadDate: '2025-01-01',
    contentUrl: 'https://www.youtube.com/watch?v=${AFRO_JAZZ_VIDEO_ID}',
    embedUrl: 'https://www.youtube.com/embed/${AFRO_JAZZ_VIDEO_ID}',
  };

  // BreadcrumbList Schema (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('afrojazzBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('afrojazzBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('afrojazzBreadcrumbUrban'),
        item: `${baseUrl}/${locale}/clases/danzas-urbanas-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('afrojazzBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('afrojazzBreadcrumbHome'), url: `/${locale}` },
    { name: t('afrojazzBreadcrumbClasses'), url: `/${locale}/clases/baile-barcelona` },
    { name: t('afrojazzBreadcrumbUrban'), url: `/${locale}/clases/danza-barcelona` },
    {
      name: t('afrojazzBreadcrumbCurrent'),
      url: `/${locale}/clases/afro-jazz`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('afrojazzPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('afrojazzMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${t('afrojazzPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('afrojazzMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-afro-jazz.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('afrojazzPageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('afrojazzMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-afro-jazz.jpg`} />
      </Helmet>

      {/* VideoObject Schema */}
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
        name="Farray's International Dance Center - Clases de AfroJazz"
        description={t('afrojazzMetaDescription')}
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
        name={t('afrojazzCourseSchemaName')}
        description={t('afrojazzCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner, Intermediate, Advanced"
        teaches="Twerk jamaicano, técnica de danza urbana, musicalidad"
        coursePrerequisites="Ninguno"
        numberOfLessons="5 clases semanales"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de AfroJazz en Barcelona - Farray's Center"
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
          id="twerk-hero"
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
                {t('afrojazzHeroTitle')}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('afrojazzHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral/90 mt-6 sm:mt-8 mb-4 sm:mb-6 leading-relaxed">
                {t('afrojazzHeroDesc')}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-neutral/90 italic mb-6 sm:mb-8">
                {t('afrojazzHeroLocation')}
              </p>

              {/* Social Proof - Mismo estilo que Modern Jazz */}
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
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                  <span>Concepto único mundial</span>
                </div>
              </div>

              {/* CTA Buttons - Enhanced UX & A11y */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
                role="group"
                aria-label={t('afrojazzCTAGroup') || 'Opciones de inscripción'}
              >
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta1-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('afrojazzCTA1')}
                  </a>
                  <p id="cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('afrojazzCTA1Subtext')}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta2-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('afrojazzCTA2')}
                  </a>
                  <p id="cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('afrojazzCTA2Subtext')}
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

                  {/* 100% Método Farray */}
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
                        {t('afrojazzMetodoFarray')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2. What is Twerk Section */}
        <section aria-labelledby="what-is-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-is-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 text-center holographic-text"
                >
                  {t('afrojazzWhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90 leading-relaxed">
                    <p className="text-lg sm:text-xl font-semibold holographic-text">
                      {t('afrojazzWhatIsP1')}
                    </p>
                    <p>{t('afrojazzWhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('afrojazzWhatIsP3')}</p>
                    <p>{t('afrojazzWhatIsP4')}</p>
                    <p className="text-center text-xl sm:text-2xl font-bold mt-6 sm:mt-8 holographic-text">
                      {t('afrojazzWhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-lg sm:text-xl font-semibold">
                      {t('afrojazzWhatIsQuestionAnswer')}
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
                        alt="Clases de AfroJazz en Barcelona - Estudiantes bailando en la academia"
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
          titleKey="afrojazzScheduleTitle"
          subtitleKey="afrojazzScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* 3b. Level Cards */}
        <LevelCardsSection titleKey="afrojazzLevelsTitle" levels={AFRO_JAZZ_LEVELS} />

        {/* 4. Teachers Section */}
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
                  {t('afrojazzTeachersTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 mt-4">
                  {t('afrojazzTeachersSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
              {/* Yunaisy Farray */}
              <AnimateOnScroll
                delay={ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-4 sm:mb-6">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="/images/teachers/img/yunaisy-farray-directora_320.webp 320w, /images/teachers/img/yunaisy-farray-directora_640.webp 640w"
                          sizes="160px"
                        />
                        <img
                          src="/images/teachers/img/yunaisy-farray-directora_640.jpg"
                          alt="Yunaisy Farray - Maestra de Afro Jazz CID-UNESCO"
                          width="160"
                          height="160"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-2">
                      Yunaisy Farray
                    </h3>
                    <p className="text-primary-accent font-semibold mb-3 sm:mb-4">
                      {t('afrojazzTeacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">
                      {t('afrojazzTeacher1Bio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Alejandro Miñoso */}
              <AnimateOnScroll
                delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-4 sm:mb-6">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="/images/teachers/img/alejandro-minoso_320.webp 320w, /images/teachers/img/alejandro-minoso_640.webp 640w"
                          sizes="160px"
                        />
                        <img
                          src="/images/teachers/img/alejandro-minoso_640.jpg"
                          alt="Alejandro Miñoso - Profesor de Afro Jazz"
                          width="160"
                          height="160"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-2">
                      Alejandro Miñoso
                    </h3>
                    <p className="text-primary-accent font-semibold mb-3 sm:mb-4">
                      {t('afrojazzTeacher2Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">
                      {t('afrojazzTeacher2Bio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-base sm:text-lg text-neutral/90 mt-8 sm:mt-10 max-w-2xl mx-auto">
                {t('afrojazzTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 4b. Prepara tu primera clase - Mismo diseño que Contemporaneo */}
        <PrepareClassSection
          titleKey="afrojazzPrepareTitle"
          subtitleKey="afrojazzPrepareSubtitle"
          config={AFRO_JAZZ_PREPARE_CONFIG}
        />

        {/* 4c. Comparison Table - Afro Jazz vs Otros Estilos */}
        <section className="py-14 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-neutral mb-2 text-center holographic-text">
                  {t('afrojazzCompareTitle')}
                </h3>
                <p className="text-base text-neutral/70 mb-6 text-center">
                  {t('afrojazzCompareSubtitle')}
                </p>

                {/* Mobile: Cards view - 11 rows unified criteria */}
                <div className="block lg:hidden space-y-4">
                  {[
                    { row: 1, afrojazz: 3, afrocont: 3, jazz: 4, lirico: 3 }, // Alineación postural clásica
                    { row: 2, afrojazz: 4, afrocont: 4, jazz: 4, lirico: 3 }, // Técnica de pies y piernas
                    { row: 3, afrojazz: 3, afrocont: 3, jazz: 2, lirico: 5 }, // Trabajo de suelo
                    { row: 4, afrojazz: 5, afrocont: 5, jazz: 3, lirico: 3 }, // Trabajo de caderas y torso
                    { row: 5, afrojazz: 5, afrocont: 5, jazz: 3, lirico: 3 }, // Disociación corporal
                    { row: 6, afrojazz: 5, afrocont: 5, jazz: 3, lirico: 3 }, // Poliritmia / Musicalidad compleja
                    { row: 7, afrojazz: 5, afrocont: 5, jazz: 4, lirico: 5 }, // Expresión emocional
                    { row: 8, afrojazz: 5, afrocont: 4, jazz: 4, lirico: 5 }, // Fluidez y continuidad
                    { row: 9, afrojazz: 5, afrocont: 5, jazz: 3, lirico: 4 }, // Conexión tierra (grounding)
                    { row: 10, afrojazz: 5, afrocont: 5, jazz: 4, lirico: 3 }, // Exigencia cardiovascular
                    { row: 11, afrojazz: 5, afrocont: 5, jazz: 4, lirico: 4 }, // Versatilidad para otros estilos
                  ].map(item => (
                    <div
                      key={item.row}
                      className="p-4 bg-primary-dark/20 rounded-xl border border-neutral/20"
                    >
                      <h4 className="font-bold text-neutral mb-3 text-sm">
                        {t(`afrojazzCompareRow${item.row}`)}
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between items-center p-2 bg-primary-accent/15 rounded-lg border border-primary-accent/30">
                          <span className="text-primary-accent font-semibold">Afro Jazz</span>
                          <span className="text-primary-accent/80">
                            {'★'.repeat(item.afrojazz)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-neutral/10 rounded-lg">
                          <span className="text-neutral/70">Afro Cont.</span>
                          <span className="text-neutral/60">{'★'.repeat(item.afrocont)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-neutral/10 rounded-lg">
                          <span className="text-neutral/70">Modern Jazz</span>
                          <span className="text-neutral/60">{'★'.repeat(item.jazz)}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-neutral/10 rounded-lg">
                          <span className="text-neutral/70">Cont. Lírico</span>
                          <span className="text-neutral/60">{'★'.repeat(item.lirico)}</span>
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
                          {t('afrojazzCompareCapacity')}
                        </th>
                        <th className="text-center py-3 px-2 text-primary-accent font-bold bg-primary-accent/10 rounded-t-lg">
                          Afro Jazz
                        </th>
                        <th className="text-center py-3 px-2 text-neutral/70 font-semibold">
                          Afro Cont.
                        </th>
                        <th className="text-center py-3 px-2 text-neutral/70 font-semibold">
                          Modern Jazz
                        </th>
                        <th className="text-center py-3 px-2 text-neutral/70 font-semibold">
                          Cont. Lírico
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { row: 1, afrojazz: 3, afrocont: 3, jazz: 4, lirico: 3 }, // Alineación postural clásica
                        { row: 2, afrojazz: 4, afrocont: 4, jazz: 4, lirico: 3 }, // Técnica de pies y piernas
                        { row: 3, afrojazz: 3, afrocont: 3, jazz: 2, lirico: 5 }, // Trabajo de suelo
                        { row: 4, afrojazz: 5, afrocont: 5, jazz: 3, lirico: 3 }, // Trabajo de caderas y torso
                        { row: 5, afrojazz: 5, afrocont: 5, jazz: 3, lirico: 3 }, // Disociación corporal
                        { row: 6, afrojazz: 5, afrocont: 5, jazz: 3, lirico: 3 }, // Poliritmia / Musicalidad compleja
                        { row: 7, afrojazz: 5, afrocont: 5, jazz: 4, lirico: 5 }, // Expresión emocional
                        { row: 8, afrojazz: 5, afrocont: 4, jazz: 4, lirico: 5 }, // Fluidez y continuidad
                        { row: 9, afrojazz: 5, afrocont: 5, jazz: 3, lirico: 4 }, // Conexión tierra (grounding)
                        { row: 10, afrojazz: 5, afrocont: 5, jazz: 4, lirico: 3 }, // Exigencia cardiovascular
                        { row: 11, afrojazz: 5, afrocont: 5, jazz: 4, lirico: 4 }, // Versatilidad para otros estilos
                      ].map((item, idx) => (
                        <tr
                          key={item.row}
                          className={`border-b border-neutral/10 ${idx % 2 === 0 ? 'bg-primary-dark/10' : ''}`}
                        >
                          <td className="py-3 px-2 text-neutral/80">
                            {t(`afrojazzCompareRow${item.row}`)}
                          </td>
                          <td className="py-3 px-2 text-center bg-primary-accent/10 text-primary-accent/80">
                            {'★'.repeat(item.afrojazz)}
                          </td>
                          <td className="py-3 px-2 text-center text-neutral/60">
                            {'★'.repeat(item.afrocont)}
                          </td>
                          <td className="py-3 px-2 text-center text-neutral/60">
                            {'★'.repeat(item.jazz)}
                          </td>
                          <td className="py-3 px-2 text-center text-neutral/60">
                            {'★'.repeat(item.lirico)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* What does this mean for you? */}
                <div className="mt-8 p-5 bg-primary-dark/20 rounded-2xl border border-neutral/20">
                  <h4 className="text-lg font-bold text-neutral mb-4">
                    {t('afrojazzCompareMeaningTitle')}
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(num => (
                      <div key={num} className="space-y-1">
                        <p className="text-sm font-semibold text-primary-accent">
                          {t(`afrojazzCompareMeaning${num}Title`)}
                        </p>
                        <p className="text-sm text-neutral/70">
                          {t(`afrojazzCompareMeaning${num}Desc`)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-primary-accent italic text-center">
                    {t('afrojazzCompareConclusion')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 5. Identification Section - Puntos de dolor */}
        <section aria-labelledby="identify-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="identify-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 holographic-text"
                >
                  {t('afrojazzIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <ul
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-8 sm:mb-10 list-none"
              role="list"
              aria-label={
                t('afrojazzIdentifyListLabel') || 'Situaciones con las que te identificas'
              }
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
                    <p className="text-neutral/90 leading-relaxed">{t(`afrojazzIdentify${num}`)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </ul>

            {/* Texto de transición + Necesitas apuntarte */}
            <AnimateOnScroll>
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('afrojazzIdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-6 sm:mb-8 max-w-4xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 sm:mb-6 holographic-text">
                  {t('afrojazzNeedEnrollTitle')}
                </h3>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
                <p className="text-lg sm:text-xl font-semibold holographic-text">
                  {t('afrojazzIdentifyAgitate1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90">
                  {t('afrojazzIdentifySolution')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 italic">
                  {t('afrojazzIdentifyClosing')}
                </p>
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
                  {t('afrojazzTransformTitle')}
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
                      {t(`afrojazzTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`afrojazzTransform${num}Desc`)}
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
                  {t('afrojazzTransformCTA')}
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
                          {t(`afrojazzWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-sm leading-relaxed">
                          {t(`afrojazzWhyChoose${num}Desc`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Trust Bar - Stats */}
            <AnimateOnScroll>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto mb-10 sm:mb-12">
                <div className="text-center">
                  <AnimatedCounter
                    target={8}
                    suffix="+"
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('yearsExperience')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={1500}
                    suffix="+"
                    className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('activeStudents')}
                  </p>
                </div>
                <div className="text-center">
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

            {/* Logos - Nos has podido ver en */}
            <AnimateOnScroll>
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 holographic-text">
                  {t('afrojazzLogosTitle')}
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
                    <div className="text-neutral/90 font-bold text-xs sm:text-sm text-center">
                      CID UNESCO
                    </div>
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
                    <div className="text-neutral/90 font-bold text-xs sm:text-sm text-center">
                      The Dancer
                    </div>
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
                    <div className="text-neutral/90 font-bold text-xs sm:text-sm text-center">
                      TV 5
                    </div>
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter holographic-text">
                  {t('afrojazzLogosIntlFestivalsText')}
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
                  {t('afrojazzWhyTodayFullTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/90">{t('afrojazzWhyToday1')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('afrojazzWhyToday2')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('afrojazzWhyToday3')}</p>
                <p className="text-xl sm:text-2xl font-bold holographic-text mt-4 sm:mt-6">
                  {t('afrojazzWhyTodayClosing1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 italic">
                  {t('afrojazzWhyTodayClosing2')}
                </p>
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
                  {t('afrojazzVideoTitle')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/70">{t('afrojazzVideoDesc')}</p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <YouTubeEmbed
                  videoId="${AFRO_JAZZ_VIDEO_ID}"
                  title="Clases de AfroJazz en Barcelona - Farray's Center"
                />
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
              {afrojazzTestimonials.slice(0, 4).map((testimonial, index) => (
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
                  {t('afrojazzFinalCTATitle')}
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 holographic-text">
                  {t('afrojazzFinalCTASubtitle')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-5 sm:mb-6 leading-relaxed">
                  {t('afrojazzFinalCTADesc')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 mb-6 sm:mb-8 italic">
                  {t('afrojazzFinalCTAFunny')}
                </p>

                {/* CTA Final - Enhanced UX & A11y */}
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                  role="group"
                  aria-label={t('afrojazzCTAGroup') || 'Opciones de inscripción'}
                >
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta1-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('afrojazzCTA1')}
                    </a>
                    <p id="final-cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('afrojazzCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta2-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('afrojazzCTA2')}
                    </a>
                    <p id="final-cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('afrojazzCTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 12. Cultural History - Contenido profundo SEO */}
        <CulturalHistorySection
          titleKey="afrojazzCulturalHistoryTitle"
          shortDescKey="afrojazzCulturalShort"
          fullHistoryKey="afrojazzCulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* 13. FAQ */}
        <FAQSection title={t('afrojazzFaqTitle')} faqs={afrojazzFaqs} pageUrl={pageUrl} />

        {/* 14. Local SEO Section - Cerca de ti */}
        <section className="py-10 md:py-14 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto p-6 bg-black/30 rounded-2xl border border-neutral/20">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-4">
                  {t('afrojazzNearbyTitle')}
                </h3>
                <p className="text-neutral/80 mb-6">{t('afrojazzNearbyDesc')}</p>
                <p className="text-neutral/90 font-semibold mb-4">
                  {t('afrojazzNearbySearchText')}
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {BARCELONA_NEARBY_AREAS.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-primary-accent" />
                      <span className="text-neutral/80">
                        {area.name}: <span className="text-primary-accent">{area.time}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-neutral/70 text-sm mt-4">{t('afrojazzNearbyMetro')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default AfroJazzPage;
