import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  SEXY_REGGAETON_TESTIMONIALS,
  SEXY_REGGAETON_FAQS_CONFIG,
  SEXY_REGGAETON_SCHEDULE_KEYS,
} from '../constants/sexy-reggaeton';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import YouTubeEmbed from './YouTubeEmbed';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from './SchemaMarkup';
import {
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  StarRating,
} from './shared/Icons';
import { CalendarDaysIcon } from '../lib/icons';

const ANIMATION_DELAYS = {
  STAGGER_SMALL: 100,
  STAGGER_MEDIUM: 150,
};

// Local icons
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

// Nearby areas for Local SEO
const SXR_NEARBY_AREAS = [
  { name: 'Plaza España', time: '5 min' },
  { name: 'Hostafrancs', time: '5 min' },
  { name: 'Sants Estació', time: '10 min' },
  { name: 'Les Corts', time: '15 min' },
  { name: 'Eixample Esquerra', time: '15 min' },
  { name: 'Poble Sec', time: '10 min' },
  { name: 'Sant Antoni', time: '12 min' },
  { name: "L'Hospitalet", time: '10 min' },
];

const SexyReggaetonPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/sexy-reggaeton-barcelona`;

  // Schedule data - traducir las keys dinámicamente
  const schedules = SEXY_REGGAETON_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
    note: 'note' in schedule ? (schedule.note as string) : undefined,
  }));

  // FAQs - traducir las keys dinámicamente desde constants
  const sxrFaqs = SEXY_REGGAETON_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - usar desde constants
  const sxrTestimonials = SEXY_REGGAETON_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = sxrTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Sexy Reggaeton - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: '2025-01-01',
  }));

  // VideoObject Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('sxrVideoTitle'),
    description: t('sxrVideoDesc'),
    thumbnailUrl: 'https://img.youtube.com/vi/J5SI4u1SVsg/maxresdefault.jpg',
    uploadDate: '2025-01-01',
    contentUrl: 'https://www.youtube.com/watch?v=J5SI4u1SVsg',
    embedUrl: 'https://www.youtube.com/embed/J5SI4u1SVsg',
  };

  // BreadcrumbList Schema (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('sxrBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('sxrBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('sxrBreadcrumbUrban'),
        item: `${baseUrl}/${locale}/clases/danzas-urbanas-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('sxrBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('sxrBreadcrumbHome'), url: `/${locale}` },
    { name: t('sxrBreadcrumbClasses'), url: `/${locale}/clases` },
    { name: t('sxrBreadcrumbUrban'), url: `/${locale}/clases/danzas-urbanas-barcelona` },
    {
      name: t('sxrBreadcrumbCurrent'),
      url: `/${locale}/clases/sexy-reggaeton-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('sxrPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('sxrMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        {/* Preload LCP image for faster rendering */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.webp"
          imageSrcSet="/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_640.webp 640w, /images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.webp 960w, /images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_1440.webp 1440w"
          imageSizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Hreflang alternates for international SEO */}
        <link
          rel="alternate"
          hrefLang="es"
          href={`${baseUrl}/es/clases/sexy-reggaeton-barcelona`}
        />
        <link
          rel="alternate"
          hrefLang="en"
          href={`${baseUrl}/en/clases/sexy-reggaeton-barcelona`}
        />
        <link
          rel="alternate"
          hrefLang="ca"
          href={`${baseUrl}/ca/clases/sexy-reggaeton-barcelona`}
        />
        <link
          rel="alternate"
          hrefLang="fr"
          href={`${baseUrl}/fr/clases/sexy-reggaeton-barcelona`}
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es/clases/sexy-reggaeton-barcelona`}
        />
        <meta property="og:title" content={`${t('sxrPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('sxrMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={`${baseUrl}/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.jpg`}
        />
        <meta property="og:image:width" content="960" />
        <meta property="og:image:height" content="720" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('sxrPageTitle')} | Farray&apos;s Center`} />
        <meta name="twitter:description" content={t('sxrMetaDescription')} />
        <meta
          name="twitter:image"
          content={`${baseUrl}/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.jpg`}
        />
        <meta property="og:image:alt" content={t('sxrOgImageAlt')} />
        {/* VideoObject Schema */}
        <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {/* Person Schema for Yasmina Fernández */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Yasmina Fernández',
            jobTitle: 'Instructora de Sexy Reggaeton & Sexy Style',
            description:
              'Especialista en Sexy Reggaeton y Sexy Style con más de 8 años de experiencia. Energía, técnica y actitud empoderada.',
            image: `${baseUrl}/images/teachers/img/profesora-yasmina-fernandez_640.jpg`,
            worksFor: {
              '@type': 'DanceSchool',
              name: "Farray's International Dance Center",
              url: baseUrl,
            },
            knowsAbout: ['Sexy Reggaeton', 'Sexy Style', 'Perreo', 'Body Roll', 'Sensual Dance'],
          })}
        </script>
      </Helmet>

      {/* Schema Markup */}
      <LocalBusinessSchema
        name="Farray's International Dance Center - Clases de Sexy Reggaeton"
        description={t('sxrMetaDescription')}
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
        name={t('sxrCourseSchemaName')}
        description={t('sxrCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner, Intermediate, Advanced"
        teaches="Sexy Reggaeton, perreo, body roll, sensualidad, disociación corporal"
        coursePrerequisites="Ninguno"
        numberOfLessons="3 clases semanales"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de Sexy Reggaeton en Barcelona - Farray's Center"
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
        href="#sxr-schedule"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-48 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-accent focus:text-white focus:rounded-lg"
      >
        {t('skipToSchedule')}
      </a>

      <main role="main" id="main-content" className="pt-20 md:pt-24">
        {/* HERO Section */}
        <section
          id="sxr-hero"
          aria-labelledby="sxr-hero-title"
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
                id="sxr-hero-title"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text"
              >
                {t('sxrHeroTitle')}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('sxrHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral/90 mt-6 sm:mt-8 mb-4 sm:mb-6 leading-relaxed">
                {t('sxrHeroDesc')}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-neutral/90 italic mb-6">
                {t('sxrHeroLocation')}
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
                    href="#sxr-schedule"
                    aria-label={t('sxrCTA1AriaLabel')}
                    className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('sxrCTA1')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('sxrCTA1Subtext')}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#sxr-schedule"
                    aria-label={t('sxrCTA2AriaLabel')}
                    className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('sxrCTA2')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('sxrCTA2Subtext')}</p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="mt-16" role="list" aria-label={t('classStats')}>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 max-w-4xl mx-auto">
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

                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}>
                    <div className="text-center" role="listitem">
                      <div className="mb-2 flex justify-center">
                        <HeartIcon className="w-10 h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={100}
                        suffix="%"
                        className="text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-sm md:text-base text-neutral/90 font-semibold">
                        {t('sxrSensualityGuaranteed')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* What is Sexy Reggaeton Section */}
        <section
          id="sxr-what-is"
          aria-labelledby="sxr-what-is-title"
          className="py-16 sm:py-20 md:py-32 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="sxr-what-is-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text"
                >
                  {t('sxrWhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-base sm:text-lg text-neutral/90 leading-relaxed">
                    <p className="text-lg sm:text-xl font-semibold holographic-text">
                      {t('sxrWhatIsP1')}
                    </p>
                    <p>{t('sxrWhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('sxrWhatIsP3')}</p>
                    <p>{t('sxrWhatIsP4')}</p>
                    <p className="text-center text-xl sm:text-2xl font-bold mt-8 holographic-text">
                      {t('sxrWhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-lg sm:text-xl font-semibold">
                      {t('sxrWhatIsQuestionAnswer')}
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <picture>
                      <source
                        srcSet="/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_640.webp 640w, /images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.webp 960w, /images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_1440.webp 1440w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        type="image/webp"
                      />
                      <source
                        srcSet="/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_640.jpg 640w, /images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.jpg 960w, /images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_1440.jpg 1440w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        type="image/jpeg"
                      />
                      <img
                        src="/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_960.jpg"
                        alt={t('sxrImageAlt')}
                        width="960"
                        height="720"
                        loading="eager"
                        fetchPriority="high"
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
          id="sxr-schedule"
          titleKey="sxrScheduleTitle"
          subtitleKey="sxrScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* Level Cards */}
        <section className="py-14 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Básico */}
              <AnimateOnScroll delay={0}>
                <div className="h-full p-6 bg-primary-dark/20 border border-primary-dark/40 rounded-2xl hover:border-primary-dark/60 transition-colors">
                  <div className="inline-block px-3 py-1 bg-primary-dark/30 text-neutral text-sm font-semibold rounded-full mb-4">
                    BASICO
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">{t('sxrLevelBasicTitle')}</h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('sxrLevelBasicDesc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Intermedio */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <div className="h-full p-6 bg-primary-accent/15 border border-primary-accent/30 rounded-2xl hover:border-primary-accent/50 transition-colors">
                  <div className="inline-block px-3 py-1 bg-primary-accent/20 text-primary-accent text-sm font-semibold rounded-full mb-4">
                    INTERMEDIO
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">
                    {t('sxrLevelIntermediateTitle')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('sxrLevelIntermediateDesc')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Teacher Section - Position 4 */}
        <section
          id="sxr-teachers"
          aria-labelledby="sxr-teachers-title"
          className="py-16 sm:py-20 md:py-32 bg-primary-dark/10 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
                <h2
                  id="sxr-teachers-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
                >
                  {t('sxrTeachersTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 mt-4">
                  {t('sxrTeachersSubtitle')}
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
                          srcSet="/images/teachers/img/profesora-yasmina-fernandez_320.webp 320w, /images/teachers/img/profesora-yasmina-fernandez_640.webp 640w"
                          sizes="192px"
                          type="image/webp"
                        />
                        <img
                          src="/images/teachers/img/profesora-yasmina-fernandez_640.jpg"
                          alt="Yasmina Fernández - Profesora de Sexy Reggaeton"
                          width="192"
                          height="192"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-2">
                      Yasmina Fernández
                    </h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('sxrTeacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t('sxrTeacher1Bio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-base sm:text-lg text-neutral/90 mt-12 max-w-2xl mx-auto">
                {t('sxrTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 4b. Prepara tu primera clase */}
        <section className="py-14 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-neutral mb-2 text-center holographic-text">
                  {t('sxrPrepareTitle')}
                </h3>
                <p className="text-base text-neutral/70 mb-6 text-center">
                  {t('sxrPrepareSubtitle')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  <div className="p-5 bg-primary-accent/10 rounded-2xl border border-primary-accent/30 hover:border-primary-accent/50 transition-all duration-300">
                    <h4 className="text-base font-bold text-primary-accent mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-accent/20 flex items-center justify-center text-sm">
                        +
                      </span>
                      {t('sxrPrepareWhatToBring')}
                    </h4>
                    <ul className="space-y-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <li key={num} className="flex items-start gap-2 text-sm text-neutral/80">
                          <CheckIcon className="w-4 h-4 text-primary-accent mt-0.5 flex-shrink-0" />
                          <span>{t(`sxrPrepareItem${num}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5 bg-primary-dark/15 rounded-2xl border border-primary-dark/30 hover:border-primary-dark/50 transition-all duration-300">
                    <h4 className="text-base font-bold text-neutral mb-3 flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-primary-accent" />
                      {t('sxrPrepareBefore')}
                    </h4>
                    <ul className="space-y-2">
                      {[1, 2, 3].map(num => (
                        <li key={num} className="flex items-start gap-2 text-sm text-neutral/80">
                          <span className="w-4 h-4 rounded-full bg-primary-dark/30 flex items-center justify-center text-xs text-neutral mt-0.5 flex-shrink-0">
                            -
                          </span>
                          <span>{t(`sxrPrepareBeforeItem${num}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-5 bg-neutral/5 rounded-2xl border border-neutral/20 hover:border-neutral/40 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <h4 className="text-base font-bold text-neutral/70 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-neutral/10 flex items-center justify-center text-sm">
                        x
                      </span>
                      {t('sxrPrepareAvoid')}
                    </h4>
                    <ul className="space-y-2">
                      {[1, 2, 3].map(num => (
                        <li key={num} className="flex items-start gap-2 text-sm text-neutral/80">
                          <span className="w-4 h-4 rounded-full bg-neutral/10 flex items-center justify-center text-xs text-neutral/60 mt-0.5 flex-shrink-0">
                            x
                          </span>
                          <span>{t(`sxrPrepareAvoidItem${num}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-5 bg-gradient-to-r from-primary-accent/10 via-primary-dark/10 to-primary-accent/10 rounded-2xl border border-primary-accent/30">
                  <p className="text-sm font-bold text-primary-accent mb-2">
                    {t('sxrPrepareTeacherTip')}
                  </p>
                  <blockquote className="text-neutral/90 italic leading-relaxed text-sm">
                    &ldquo;{t('sxrPrepareTeacherQuote')}&rdquo;
                  </blockquote>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Identification Section - Position 5 */}
        <section
          id="sxr-identify"
          aria-labelledby="sxr-identify-title"
          className="pt-8 pb-16 md:pt-12 md:pb-24 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
                <h2
                  id="sxr-identify-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('sxrIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12"
              role="list"
              aria-label={t('sxrIdentifyTitle')}
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
                      {t(`sxrIdentify${num}`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Necesitas apuntarte Section */}
        <section
          id="sxr-need-enroll"
          aria-labelledby="sxr-need-enroll-title"
          className="py-16 sm:py-20 md:py-32 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('sxrIdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="sxr-need-enroll-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('sxrNeedEnrollTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <p className="text-lg sm:text-xl font-semibold holographic-text">
                  {t('sxrIdentifyAgitate1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90">{t('sxrIdentifySolution')}</p>
                <p className="text-lg sm:text-xl text-neutral/90 italic">
                  {t('sxrIdentifyClosing')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Transformation Section - Position 6 */}
        <section
          id="sxr-transformation"
          aria-labelledby="sxr-transformation-title"
          className="py-12 md:py-16 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
                <h2
                  id="sxr-transformation-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('sxrTransformTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12"
              role="list"
              aria-label={t('sxrTransformTitle')}
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
                      {t(`sxrTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`sxrTransform${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Farray's Section - Position 7 */}
        <section
          id="sxr-why-choose"
          aria-labelledby="sxr-why-choose-title"
          className="py-16 sm:py-20 md:py-32 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="sxr-why-choose-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('sxrTransformCTA')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-16"
              role="list"
              aria-label={t('sxrTransformCTA')}
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
                          {t(`sxrWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-xs sm:text-sm leading-relaxed">
                          {t(`sxrWhyChoose${num}Desc`)}
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
          id="sxr-logos"
          aria-labelledby="sxr-logos-title"
          className="py-12 sm:py-16 md:py-20 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="sxr-logos-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('sxrLogosTitle')}
                </h2>
                <div
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 md:gap-12 max-w-5xl mx-auto items-center mb-8"
                  role="list"
                  aria-label={t('sxrLogosTitle')}
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
                  {t('sxrLogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Why Today Section - Position 9 */}
        <section
          id="sxr-why-today"
          aria-labelledby="sxr-why-today-title"
          className="py-16 sm:py-20 md:py-32 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <h2
                  id="sxr-why-today-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text"
                >
                  {t('sxrWhyTodayFullTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/90">{t('sxrWhyToday1')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('sxrWhyToday2')}</p>
                <p className="text-lg sm:text-xl text-neutral/90">{t('sxrWhyToday3')}</p>
                <p className="text-xl sm:text-2xl font-bold holographic-text mt-8">
                  {t('sxrWhyTodayClosing1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 italic">
                  {t('sxrWhyTodayClosing2')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Video Section - Position 10 */}
        <section
          id="sxr-video"
          aria-labelledby="sxr-video-title"
          className="py-16 sm:py-20 md:py-32 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="sxr-video-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('sxrVideoTitle')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/70">{t('sxrVideoDesc')}</p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <YouTubeEmbed videoId="J5SI4u1SVsg" title={t('sxrVideoTitle')} />
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Testimonials - Position 11 */}
        <section
          id="sxr-testimonials"
          aria-labelledby="sxr-testimonials-title"
          className="py-16 sm:py-20 md:py-32 bg-black"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="sxr-testimonials-title"
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
              {sxrTestimonials.map((testimonial, index) => (
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
          id="sxr-final-cta"
          aria-labelledby="sxr-final-cta-title"
          className="relative py-16 sm:py-20 md:py-32 overflow-hidden"
        >
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2
                  id="sxr-final-cta-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('sxrFinalCTATitle')}
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-6 holographic-text">
                  {t('sxrFinalCTASubtitle')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-8 leading-relaxed">
                  {t('sxrFinalCTADesc')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 mb-10 italic">
                  {t('sxrFinalCTAFunny')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
                  <div className="w-full sm:w-auto">
                    <a
                      href="#sxr-schedule"
                      aria-label={t('sxrCTA1AriaLabel')}
                      className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('sxrCTA1')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('sxrCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#sxr-schedule"
                      aria-label={t('sxrCTA2AriaLabel')}
                      className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black active:scale-95 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('sxrCTA2')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('sxrCTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Cultural History - Position 13 */}
        <CulturalHistorySection
          titleKey=""
          shortDescKey="sxrCulturalShort"
          fullHistoryKey="sxrCulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* FAQ - Position 13 */}
        <FAQSection title={t('sxrFaqTitle')} faqs={sxrFaqs} pageUrl={pageUrl} />

        {/* 14. Local SEO Section - Cerca de ti */}
        <section className="py-10 md:py-14 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto p-6 bg-black/30 rounded-2xl border border-neutral/20">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-4">
                  {t('sxrNearbyTitle')}
                </h3>
                <p className="text-neutral/80 mb-6">{t('sxrNearbyDesc')}</p>
                <p className="text-neutral/90 font-semibold mb-4">{t('sxrNearbySearchText')}</p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {SXR_NEARBY_AREAS.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-primary-accent" />
                      <span className="text-neutral/80">
                        {area.name}: <span className="text-primary-accent">{area.time}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-neutral/70 text-sm mt-4">{t('sxrNearbyMetro')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default SexyReggaetonPage;
