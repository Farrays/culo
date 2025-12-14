import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  HIP_HOP_REGGAETON_TESTIMONIALS,
  HIP_HOP_REGGAETON_FAQS_CONFIG,
  HIP_HOP_REGGAETON_SCHEDULE_KEYS,
  HIP_HOP_REGGAETON_LEVELS,
  HIP_HOP_REGGAETON_PREPARE_CONFIG,
} from '../constants/hip-hop-reggaeton';
import LevelCardsSection from './shared/LevelCardsSection';
import PrepareClassSection from './shared/PrepareClassSection';
import { ANIMATION_DELAYS, BARCELONA_NEARBY_AREAS } from '../constants/shared';
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
  CalendarDaysIcon,
} from '../lib/icons';
import { UsersIcon, MapPinIcon } from './shared/CommonIcons';

const HipHopReggaetonPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/hip-hop-reggaeton-barcelona`;

  // Schedule data - traducir las keys dinámicamente
  const schedules = HIP_HOP_REGGAETON_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
    note: 'note' in schedule ? (schedule.note as string) : undefined,
  }));

  // FAQs - traducir las keys dinámicamente desde constants
  const hhrFaqs = HIP_HOP_REGGAETON_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - usar desde constants
  const hhrTestimonials = HIP_HOP_REGGAETON_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = hhrTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Hip Hop Reggaeton - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: new Date().toISOString().split('T')[0],
  }));

  // VideoObject Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('hhrVideoTitle'),
    description: t('hhrVideoDesc'),
    thumbnailUrl: 'https://img.youtube.com/vi/VdEJ1Z-pJzY/maxresdefault.jpg',
    uploadDate: '2025-01-01',
    contentUrl: 'https://www.youtube.com/watch?v=VdEJ1Z-pJzY',
    embedUrl: 'https://www.youtube.com/embed/VdEJ1Z-pJzY',
  };

  // BreadcrumbList Schema (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('hhrBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('hhrBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('hhrBreadcrumbUrban'),
        item: `${baseUrl}/${locale}/clases/danzas-urbanas-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('hhrBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('hhrBreadcrumbHome'), url: `/${locale}` },
    { name: t('hhrBreadcrumbClasses'), url: `/${locale}/clases` },
    { name: t('hhrBreadcrumbUrban'), url: `/${locale}/clases/danzas-urbanas-barcelona` },
    {
      name: t('hhrBreadcrumbCurrent'),
      url: `/${locale}/clases/hip-hop-reggaeton-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('hhrPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('hhrMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${t('hhrPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('hhrMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-hip-hop-reggaeton.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('hhrPageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('hhrMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-hip-hop-reggaeton.jpg`} />
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
        name="Farray's International Dance Center - Clases de Hip Hop Reggaeton"
        description={t('hhrMetaDescription')}
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
        name={t('hhrCourseSchemaName')}
        description={t('hhrCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner, Intermediate, Advanced"
        teaches="Hip Hop Reggaeton, fusión urbana, técnica de danza, improvisación"
        coursePrerequisites="Ninguno"
        numberOfLessons="3 clases semanales"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de Hip Hop Reggaeton en Barcelona - Farray's Center"
        itemType="Course"
      />

      {/* Skip Links for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-accent focus:text-white focus:rounded-lg"
      >
        {t('skipToContent')}
      </a>
      <a
        href="#hhr-schedule"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-accent focus:text-white focus:rounded-lg"
      >
        {t('skipToSchedule')}
      </a>

      <main role="main" id="main-content" className="pt-20 md:pt-24">
        {/* HERO Section */}
        <section
          id="hhr-hero"
          aria-labelledby="hhr-hero-title"
          className="relative text-center py-24 sm:py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1
                id="hhr-hero-title"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text"
              >
                {t('hhrHeroTitle')}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('hhrHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral/90 mt-6 sm:mt-8 mb-4 sm:mb-6 leading-relaxed">
                {t('hhrHeroDesc')}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-neutral/90 italic mb-6">
                {t('hhrHeroLocation')}
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
                  <UsersIcon className="w-5 h-5 text-primary-accent" />
                  <span>+15.000 alumnos formados</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-accent" />
                  <span>8 años en Barcelona</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-10">
                <div className="w-full sm:w-auto">
                  <a
                    href="#contact"
                    className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('hhrCTA1')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('hhrCTA1Subtext')}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#trial"
                    className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('hhrCTA2')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('hhrCTA2Subtext')}</p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="mt-16" role="list" aria-label={t('classStats')}>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 max-w-4xl mx-auto">
                  {/* 60 Minutos */}
                  <AnimateOnScroll delay={0}>
                    <div className="text-center" role="listitem">
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

                  {/* ~500 Calorías */}
                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center" role="listitem">
                      <div className="mb-2 flex justify-center">
                        <FlameIcon className="w-10 h-10 text-primary-accent" />
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-3xl md:text-4xl font-black holographic-text">~</span>
                        <AnimatedCounter
                          target={500}
                          className="text-4xl md:text-5xl font-black holographic-text"
                        />
                      </div>
                      <div className="text-sm md:text-base text-neutral/90 font-semibold mt-1">
                        {t('caloriesBurned')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  {/* 100% Flow */}
                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}>
                    <div className="text-center" role="listitem">
                      <div className="mb-2 flex justify-center">
                        <StarIcon className="w-10 h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={100}
                        suffix="%"
                        className="text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-sm md:text-base text-neutral/90 font-semibold">
                        {t('hhrFlowGuaranteed')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* What is Hip Hop Reggaeton Section */}
        <section
          id="hhr-what-is"
          aria-labelledby="hhr-what-is-title"
          className="py-16 sm:py-20 md:py-32 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="hhr-what-is-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text"
                >
                  {t('hhrWhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-base sm:text-lg text-neutral/90 leading-relaxed">
                    <p className="text-lg sm:text-xl font-semibold holographic-text">
                      {t('hhrWhatIsP1')}
                    </p>
                    <p>{t('hhrWhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('hhrWhatIsP3')}</p>
                    <p>{t('hhrWhatIsP4')}</p>
                    <p className="text-center text-xl sm:text-2xl font-bold mt-8 holographic-text">
                      {t('hhrWhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-lg sm:text-xl font-semibold">
                      {t('hhrWhatIsQuestionAnswer')}
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <picture>
                      <source
                        srcSet="/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_640.webp 640w, /images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_960.webp 960w, /images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_1440.webp 1440w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        type="image/webp"
                      />
                      <source
                        srcSet="/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_640.jpg 640w, /images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_960.jpg 960w, /images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_1440.jpg 1440w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        type="image/jpeg"
                      />
                      <img
                        src="/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_960.jpg"
                        alt="Clases de Hip Hop Reggaeton en Barcelona - Estudiantes bailando en la academia"
                        width="960"
                        height="720"
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

        {/* Schedule Section - Position 3 */}
        <ScheduleSection
          id="hhr-schedule"
          titleKey="hhrScheduleTitle"
          subtitleKey="hhrScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* 3b. Level Cards - Using shared component */}
        <LevelCardsSection titleKey="hhrLevelsTitle" levels={HIP_HOP_REGGAETON_LEVELS} />

        {/* Teacher Section - Position 4 */}
        <section
          id="hhr-teachers"
          aria-labelledby="hhr-teachers-title"
          className="py-16 sm:py-20 md:py-32 bg-primary-dark/10 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
                <h2
                  id="hhr-teachers-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
                >
                  {t('hhrTeachersTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 mt-4">
                  {t('hhrTeachersSubtitle')}
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
                          srcSet="/images/teachers/img/profesor-charlie-breezy_320.webp 320w, /images/teachers/img/profesor-charlie-breezy_640.webp 640w"
                          sizes="192px"
                          type="image/webp"
                        />
                        <img
                          src="/images/teachers/img/profesor-charlie-breezy_640.jpg"
                          alt="Charlie Breezy - Profesor de Hip Hop Reggaeton"
                          width="192"
                          height="192"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-2">
                      Charlie Breezy
                    </h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('hhrTeacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t('hhrTeacher1Bio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-base sm:text-lg text-neutral/90 mt-12 max-w-2xl mx-auto">
                {t('hhrTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 4b. Prepara tu primera clase - Using shared component */}
        <PrepareClassSection
          titleKey="hhrPrepareTitle"
          subtitleKey="hhrPrepareSubtitle"
          config={HIP_HOP_REGGAETON_PREPARE_CONFIG}
        />

        {/* Identification Section - Position 5 */}
        <section
          id="hhr-identify"
          aria-labelledby="hhr-identify-title"
          className="pt-8 pb-16 md:pt-12 md:pb-24 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
                <h2
                  id="hhr-identify-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('hhrIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12"
              role="list"
              aria-label={t('hhrIdentifyTitle')}
            >
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <div
                    className="group relative h-full min-h-[100px] flex items-start gap-4 p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow"
                    role="listitem"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                      <CheckIcon className="w-5 h-5 text-primary-accent" />
                    </div>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`hhrIdentify${num}`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Necesitas apuntarte Section - Combined with Identification */}
        <section
          id="hhr-need-enroll"
          aria-labelledby="hhr-need-enroll-title"
          className="py-16 sm:py-20 md:py-32 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            {/* Texto de transición pequeño */}
            <AnimateOnScroll>
              <div className="text-center mb-8">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('hhrIdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="hhr-need-enroll-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('hhrNeedEnrollTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <p className="text-lg sm:text-xl font-semibold holographic-text">
                  {t('hhrIdentifyAgitate1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90">{t('hhrIdentifySolution')}</p>
                <p className="text-lg sm:text-xl text-neutral/90 italic">
                  {t('hhrIdentifyClosing')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Transformation Section - Position 6 */}
        <section
          id="hhr-transformation"
          aria-labelledby="hhr-transformation-title"
          className="py-12 md:py-16 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
                <h2
                  id="hhr-transformation-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('hhrTransformTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12"
              role="list"
              aria-label={t('hhrTransformTitle')}
            >
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <div
                    className="group h-full min-h-[180px] p-6 sm:p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow"
                    role="listitem"
                  >
                    <div className="text-5xl sm:text-6xl font-black text-primary-accent mb-4 holographic-text">
                      {num}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral mb-3">
                      {t(`hhrTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`hhrTransform${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Farray's Section - Position 7 */}
        <section
          id="hhr-why-choose"
          aria-labelledby="hhr-why-choose-title"
          className="py-16 sm:py-20 md:py-32 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="hhr-why-choose-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('hhrTransformCTA')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-16"
              role="list"
              aria-label={t('hhrTransformCTA')}
            >
              {[1, 7, 2, 3, 4, 5, 6].map((num, index, arr) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className={`[perspective:1000px] ${index === arr.length - 1 ? 'lg:col-start-2' : ''}`}
                >
                  <div
                    className="group h-full min-h-[120px] p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow"
                    role="listitem"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <CheckCircleIcon className="w-6 h-6 text-primary-accent" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-neutral mb-2">
                          {t(`hhrWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-xs sm:text-sm leading-relaxed">
                          {t(`hhrWhyChoose${num}Desc`)}
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

        {/* Logos Section - Position 8 */}
        <section
          id="hhr-logos"
          aria-labelledby="hhr-logos-title"
          className="py-12 sm:py-16 md:py-20 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="hhr-logos-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('hhrLogosTitle')}
                </h2>
                <div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 md:gap-12 max-w-5xl mx-auto items-center mb-8"
                  role="list"
                  aria-label={t('hhrLogosTitle')}
                >
                  <div
                    className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105"
                    role="listitem"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden rounded-lg">
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
                  <div
                    className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105"
                    role="listitem"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden rounded-lg">
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
                  <div
                    className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105"
                    role="listitem"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden rounded-lg">
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
                  <div
                    className="flex flex-col items-center gap-3 p-4 sm:p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105"
                    role="listitem"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center overflow-hidden rounded-lg">
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
                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter holographic-text">
                  {t('hhrLogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Why Today Section - Position 9 */}
        <section
          id="hhr-why-today"
          aria-labelledby="hhr-why-today-title"
          className="py-16 sm:py-20 md:py-32 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2
                  id="hhr-why-today-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('hhrWhyTodayFullTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/90">{t('hhrWhyToday1')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('hhrWhyToday2')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('hhrWhyToday3')}</p>
                <p className="text-xl sm:text-2xl font-bold holographic-text mt-8">
                  {t('hhrWhyTodayClosing1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 italic">
                  {t('hhrWhyTodayClosing2')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Video Section - Position 10 */}
        <section
          id="hhr-video"
          aria-labelledby="hhr-video-title"
          className="py-16 sm:py-20 md:py-32 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="hhr-video-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('hhrVideoTitle')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/70">{t('hhrVideoDesc')}</p>
              </div>
            </AnimateOnScroll>

            {/* Video centrado */}
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <YouTubeEmbed
                  videoId="VdEJ1Z-pJzY"
                  title="Clases de Hip Hop Reggaeton en Barcelona - Farray's Center"
                />
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Testimonials - Position 11 */}
        <section
          id="hhr-testimonials"
          aria-labelledby="hhr-testimonials-title"
          className="py-16 sm:py-20 md:py-32 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="hhr-testimonials-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('testimonialsNotRequested')}
                </h2>
                <div className="inline-block">
                  <div className="mb-4 text-2xl sm:text-3xl font-black text-neutral">
                    {t('excellent')}
                  </div>
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

            <div
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto"
              role="list"
              aria-label={t('testimonialsNotRequested')}
            >
              {hhrTestimonials.map((testimonial, index) => (
                <AnimateOnScroll
                  key={testimonial.id}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                >
                  <div
                    className="flex flex-col h-full min-h-[180px] p-4 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2"
                    role="listitem"
                  >
                    <div className="flex mb-3">
                      <StarRating size="md" />
                    </div>
                    <blockquote className="flex-grow text-neutral/90 mb-4">
                      <p className="text-xs sm:text-sm leading-relaxed">
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

        {/* Final CTA Section - Position 12 */}
        <section
          id="hhr-final-cta"
          aria-labelledby="hhr-final-cta-title"
          className="relative py-16 sm:py-20 md:py-32 overflow-hidden"
        >
          {/* Background like Hero */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2
                  id="hhr-final-cta-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('hhrFinalCTATitle')}
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-6 holographic-text">
                  {t('hhrFinalCTASubtitle')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-8 leading-relaxed">
                  {t('hhrFinalCTADesc')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 mb-10 italic">
                  {t('hhrFinalCTAFunny')}
                </p>

                {/* CTA Final */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                  <div className="w-full sm:w-auto">
                    <a
                      href="#contact"
                      className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('hhrCTA1')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('hhrCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#trial"
                      className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('hhrCTA2')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('hhrCTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Cultural History - Position 13 (before FAQ) */}
        <CulturalHistorySection
          titleKey=""
          shortDescKey="hhrCulturalShort"
          fullHistoryKey="hhrCulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* FAQ - Position 13 */}
        <FAQSection title={t('hhrFaqTitle')} faqs={hhrFaqs} pageUrl={pageUrl} />

        {/* 14. Local SEO Section - Cerca de ti */}
        <section className="py-10 md:py-14 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto p-6 bg-black/30 rounded-2xl border border-neutral/20">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-4">
                  {t('hhrNearbyTitle')}
                </h3>
                <p className="text-neutral/80 mb-6">{t('hhrNearbyDesc')}</p>
                <p className="text-neutral/90 font-semibold mb-4">{t('hhrNearbySearchText')}</p>
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
                <p className="text-neutral/70 text-sm mt-4">{t('hhrNearbyMetro')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default HipHopReggaetonPage;
