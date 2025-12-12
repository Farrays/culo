import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  SALSA_CUBANA_TESTIMONIALS,
  SALSA_CUBANA_FAQS_CONFIG,
  SALSA_CUBANA_SCHEDULE_KEYS,
  SALSA_CUBANA_NEARBY_AREAS,
  SALSA_CUBANA_VIDEO_ID,
  SALSA_CUBANA_LEVELS,
} from '../constants/salsa-cubana';
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
} from './shared/Icons';
import LatinDanceComparisonTable from './shared/LatinDanceComparisonTable';
import { CalendarDaysIcon } from '../lib/icons';

// Simple inline icons
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

// Animation delay constants for consistent UX
const ANIMATION_DELAYS = {
  STAGGER_SMALL: 100,
  STAGGER_MEDIUM: 150,
};

const SalsaCubanaPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/salsa-cubana-barcelona`;

  // Schedule data - traducir las keys dinámicamente
  const schedules = SALSA_CUBANA_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
    note: 'note' in schedule ? (schedule as { note?: string }).note : undefined,
  }));

  // FAQs - traducir las keys dinámicamente desde constants
  const salsaCubanaFaqs = SALSA_CUBANA_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - usar desde constants
  const salsaCubanaTestimonials = SALSA_CUBANA_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = salsaCubanaTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Salsa Cubana - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: '2025-01-01',
  }));

  // VideoObject Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('salsaCubanaVideoTitle'),
    description: t('salsaCubanaVideoDesc'),
    thumbnailUrl: `https://img.youtube.com/vi/${SALSA_CUBANA_VIDEO_ID}/maxresdefault.jpg`,
    uploadDate: '2025-01-01',
    contentUrl: `https://www.youtube.com/watch?v=${SALSA_CUBANA_VIDEO_ID}`,
    embedUrl: `https://www.youtube.com/embed/${SALSA_CUBANA_VIDEO_ID}`,
  };

  // BreadcrumbList Schema (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('salsaCubanaBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('salsaCubanaBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('salsaCubanaBreadcrumbLatin'),
        item: `${baseUrl}/${locale}/clases/salsa-bachata-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('salsaCubanaBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('salsaCubanaBreadcrumbHome'), url: `/${locale}` },
    { name: t('salsaCubanaBreadcrumbClasses'), url: `/${locale}/clases/baile-barcelona` },
    {
      name: t('salsaCubanaBreadcrumbLatin'),
      url: `/${locale}/clases/salsa-bachata-barcelona`,
    },
    {
      name: t('salsaCubanaBreadcrumbCurrent'),
      url: `/${locale}/clases/salsa-cubana-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('salsaCubanaPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('salsaCubanaMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        <meta
          property="og:title"
          content={`${t('salsaCubanaPageTitle')} | Farray&apos;s Center`}
        />
        <meta property="og:description" content={t('salsaCubanaMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-salsa-cubana.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${t('salsaCubanaPageTitle')} | Farray's Center`}
        />
        <meta name="twitter:description" content={t('salsaCubanaMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-salsa-cubana.jpg`} />
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
        name="Farray's International Dance Center - Clases de Salsa Cubana"
        description={t('salsaCubanaMetaDescription')}
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
          ratingValue: '5',
          reviewCount: '505',
        }}
      />

      <CourseSchema
        name={t('salsaCubanaCourseSchemaName')}
        description={t('salsaCubanaCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner, Intermediate, Advanced"
        teaches="Salsa Cubana, Casino, Rueda de Casino, guía y seguimiento, técnica de pareja"
        coursePrerequisites="Ninguno"
        numberOfLessons="5 clases semanales"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de Salsa Cubana en Barcelona - Farray's Center"
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
          id="salsa-hero"
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
                {t('salsaCubanaHeroTitle')}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('salsaCubanaHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral/90 mt-6 sm:mt-8 mb-4 sm:mb-6 leading-relaxed">
                {t('salsaCubanaHeroDesc')}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-neutral/90 italic mb-6">
                {t('salsaCubanaHeroLocation')}
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
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
                role="group"
                aria-label={t('salsaCubanaCTAGroup') || 'Opciones de inscripción'}
              >
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta1-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('salsaCubanaCTA1')}
                  </a>
                  <p id="cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('salsaCubanaCTA1Subtext')}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta2-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('salsaCubanaCTA2')}
                  </a>
                  <p id="cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('salsaCubanaCTA2Subtext')}
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

                  {/* ~400 Calorías */}
                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <FlameIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text">
                        ~400/h
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

        {/* 2. Bailar Salsa Cubana no es solo hacer figuras */}
        <section aria-labelledby="what-is-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="what-is-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 text-center holographic-text"
                >
                  {t('salsaCubanaWhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90 leading-relaxed">
                    <p className="text-lg sm:text-xl font-semibold holographic-text">
                      {t('salsaCubanaWhatIsP1')}
                    </p>
                    <p>{t('salsaCubanaWhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">
                      {t('salsaCubanaWhatIsP3')}
                    </p>
                    <p>{t('salsaCubanaWhatIsP4')}</p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-primary-accent/20 to-primary-dark/20 p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center">
                      <div className="flex justify-center gap-4 mb-4">
                        <svg className="w-16 h-16 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <p className="text-neutral/80 text-sm italic">{t('salsaCubanaWhatIsImageAlt')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 3. El Problema - PAS Framework */}
        <section aria-labelledby="problem-title" className="py-14 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="problem-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-2 text-center holographic-text"
                >
                  {t('salsaCubanaProblemTitle')}
                </h2>
                <p className="text-xl sm:text-2xl text-neutral/70 text-center mb-10">
                  {t('salsaCubanaProblemSubtitle')}
                </p>

                <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                  <p>{t('salsaCubanaProblemP1')}</p>
                  <p className="text-2xl font-bold text-primary-accent">{t('salsaCubanaProblemP2')}</p>
                  <p className="text-neutral/80">{t('salsaCubanaProblemP3')}</p>

                  <div className="my-8 p-6 bg-black/50 border-l-4 border-primary-accent rounded-r-xl">
                    <p className="text-xl sm:text-2xl font-bold text-neutral">
                      {t('salsaCubanaProblemConclusion')}
                    </p>
                  </div>

                  <p className="text-neutral/80">{t('salsaCubanaProblemExplanation')}</p>
                  <p className="text-xl font-semibold text-primary-accent text-center mt-8">
                    {t('salsaCubanaProblemSolution')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2b. Tabla Comparativa - Casino Social vs Método Farray */}
        <section aria-labelledby="compare-title" className="py-14 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 max-w-4xl mx-auto">
                <h2
                  id="compare-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('salsaCubanaCompareTitle')}
                </h2>
                <p className="text-lg text-neutral/70">{t('salsaCubanaCompareSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-5xl mx-auto overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 text-left bg-red-500/20 border border-red-500/30 text-red-400 font-bold rounded-tl-xl">
                        {t('salsaCubanaCompareCol1')}
                      </th>
                      <th className="p-4 text-left bg-primary-accent/20 border border-primary-accent/30 text-primary-accent font-bold rounded-tr-xl">
                        {t('salsaCubanaCompareCol2')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(row => (
                      <tr key={row} className="group">
                        <td className="p-4 border border-neutral/10 text-neutral/70 group-hover:bg-red-500/5 transition-colors">
                          <span className="mr-2 text-red-400">✕</span>
                          {t(`salsaCubanaCompareRow${row}Col1`)}
                        </td>
                        <td className="p-4 border border-neutral/10 text-neutral group-hover:bg-primary-accent/5 transition-colors">
                          <span className="mr-2 text-primary-accent">✓</span>
                          {t(`salsaCubanaCompareRow${row}Col2`)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2c. Programa Técnico - Hombre / Mujer / Musicalidad */}
        <section aria-labelledby="tech-program-title" className="py-14 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2
                  id="tech-program-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('salsaCubanaTechProgramTitle')}
                </h2>
                <p className="text-lg text-neutral/70">{t('salsaCubanaTechProgramSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Para el Hombre */}
              <AnimateOnScroll delay={0}>
                <div className="h-full p-6 bg-black/50 border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary-accent/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">{t('salsaCubanaTechMenTitle')}</h3>
                  <p className="text-neutral/80 text-sm mb-4">{t('salsaCubanaTechMenDesc')}</p>
                  <ul className="space-y-2 text-sm text-neutral/70">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechMenItem1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechMenItem2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechMenItem3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechMenItem4')}</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm font-semibold text-primary-accent">{t('salsaCubanaTechMenResult')}</p>
                </div>
              </AnimateOnScroll>

              {/* Para la Mujer */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_MEDIUM}>
                <div className="h-full p-6 bg-black/50 border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary-accent/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">{t('salsaCubanaTechWomenTitle')}</h3>
                  <p className="text-neutral/80 text-sm mb-4">{t('salsaCubanaTechWomenDesc')}</p>
                  <ul className="space-y-2 text-sm text-neutral/70">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechWomenItem1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechWomenItem2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechWomenItem3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechWomenItem4')}</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm font-semibold text-primary-accent">{t('salsaCubanaTechWomenResult')}</p>
                </div>
              </AnimateOnScroll>

              {/* Musicalidad */}
              <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_MEDIUM}>
                <div className="h-full p-6 bg-black/50 border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary-accent/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">{t('salsaCubanaTechMusicTitle')}</h3>
                  <p className="text-neutral/80 text-sm mb-4">{t('salsaCubanaTechMusicDesc')}</p>
                  <ul className="space-y-2 text-sm text-neutral/70">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechMusicItem1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechMusicItem2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechMusicItem3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaTechMusicItem4')}</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm font-semibold text-primary-accent">{t('salsaCubanaTechMusicResult')}</p>
                </div>
              </AnimateOnScroll>

              {/* Entrena tu cuerpo y tu oído */}
              <AnimateOnScroll delay={3 * ANIMATION_DELAYS.STAGGER_MEDIUM}>
                <div className="h-full p-6 bg-black/50 border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-primary-accent/20 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">{t('salsaCubanaBenefitsTitle')}</h3>
                  <p className="text-neutral/80 text-sm mb-4">{t('salsaCubanaBenefitsSubtitle')}</p>
                  <ul className="space-y-2 text-sm text-neutral/70">
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaBenefit1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaBenefit2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaBenefit3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaBenefit4')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span>{t('salsaCubanaBenefit5')}</span>
                    </li>
                  </ul>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* 4. Método Farray - Lo que nos hace únicos */}
        <section aria-labelledby="method-title" className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="method-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('salsaCubanaMetodoTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70">
                  {t('salsaCubanaMetodoSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {/* Pilar 1: Guía Perfecta */}
              <AnimateOnScroll delay={0} className="[perspective:1000px]">
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-neutral mb-2">
                    {t('salsaCubanaMetodoPillar1Title')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('salsaCubanaMetodoPillar1Desc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Pilar 2: Seguimiento Técnico */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL} className="[perspective:1000px]">
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-neutral mb-2">
                    {t('salsaCubanaMetodoPillar2Title')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('salsaCubanaMetodoPillar2Desc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Pilar 3: Musicalidad */}
              <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL} className="[perspective:1000px]">
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-neutral mb-2">
                    {t('salsaCubanaMetodoPillar3Title')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('salsaCubanaMetodoPillar3Desc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Pilar 4: Conexión de Pareja */}
              <AnimateOnScroll delay={3 * ANIMATION_DELAYS.STAGGER_SMALL} className="[perspective:1000px]">
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-neutral mb-2">
                    {t('salsaCubanaMetodoPillar4Title')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('salsaCubanaMetodoPillar4Desc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Pilar 5: Técnica Corporal */}
              <AnimateOnScroll delay={4 * ANIMATION_DELAYS.STAGGER_SMALL} className="[perspective:1000px]">
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-neutral mb-2">
                    {t('salsaCubanaMetodoPillar5Title')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('salsaCubanaMetodoPillar5Desc')}
                  </p>
                </div>
              </AnimateOnScroll>

              {/* Pilar 6: Cultura Cubana */}
              <AnimateOnScroll delay={5 * ANIMATION_DELAYS.STAGGER_SMALL} className="[perspective:1000px]">
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
                    <svg className="w-5 h-5 text-primary-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-neutral mb-2">
                    {t('salsaCubanaMetodoPillar6Title')}
                  </h3>
                  <p className="text-neutral/80 text-sm leading-relaxed">
                    {t('salsaCubanaMetodoPillar6Desc')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>

            {/* Quote del Método */}
            <AnimateOnScroll>
              <div className="mt-10 max-w-3xl mx-auto text-center">
                <blockquote className="text-xl sm:text-2xl font-bold text-neutral italic">
                  &ldquo;{t('salsaCubanaMetodoQuote')}&rdquo;
                </blockquote>
                <p className="mt-3 text-primary-accent font-semibold">— Yunaisy Farray</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 4. Schedule */}
        <ScheduleSection
          titleKey="salsaCubanaScheduleTitle"
          subtitleKey="salsaCubanaScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* 4b. Level Cards - Sistema progresivo */}
        <section className="py-14 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 max-w-4xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-neutral mb-2 holographic-text">
                  {t('salsaCubanaLevelsTitle')}
                </h3>
                <p className="text-neutral/70">{t('salsaCubanaLevelsSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {SALSA_CUBANA_LEVELS.map((level, index) => (
                <AnimateOnScroll key={level.id} delay={index * ANIMATION_DELAYS.STAGGER_SMALL}>
                  <div className="h-full p-5 rounded-2xl border transition-colors bg-black/50 border-primary-dark/40 hover:border-primary-accent/50">
                    <div className="inline-block px-3 py-1 text-sm font-semibold rounded-full mb-3 bg-primary-accent/20 text-primary-accent">
                      {level.duration}
                    </div>
                    <h4 className="text-lg font-bold text-neutral mb-2">
                      {t(level.titleKey)}
                    </h4>
                    <p className="text-neutral/80 text-sm leading-relaxed">
                      {t(level.descKey)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Teachers Section - Yunaisy Farray */}
        <section
          id="teachers"
          aria-labelledby="teachers-title"
          className="py-12 md:py-20 bg-primary-dark/10 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="teachers-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
                >
                  {t('salsaCubanaTeachersTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 mt-4">
                  {t('salsaCubanaTeachersSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Yunaisy Farray - Featured Teacher Card */}
            <AnimateOnScroll className="max-w-4xl mx-auto mb-8">
              <div className="group bg-black/70 backdrop-blur-md border border-primary-accent/50 hover:border-primary-accent rounded-2xl shadow-lg p-8 transition-all duration-500 hover:shadow-accent-glow">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 flex-shrink-0">
                    <picture>
                      <source
                        type="image/webp"
                        srcSet="/images/teachers/img/yunaisy-farray-directora_320.webp 320w, /images/teachers/img/yunaisy-farray-directora_640.webp 640w"
                        sizes="192px"
                      />
                      <img
                        src="/images/teachers/img/yunaisy-farray-directora_640.jpg"
                        alt="Yunaisy Farray - Creadora del Método Farray, Maestra CID-UNESCO"
                        width="192"
                        height="192"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </picture>
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl sm:text-3xl font-bold text-neutral mb-2">
                      Yunaisy Farray
                    </h3>
                    <p className="text-primary-accent font-semibold mb-4 text-lg">
                      {t('salsaCubanaTeacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed mb-4">
                      {t('salsaCubanaTeacher1Bio')}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="px-3 py-1 bg-primary-accent/20 text-primary-accent text-sm rounded-full">CID-UNESCO</span>
                      <span className="px-3 py-1 bg-primary-accent/20 text-primary-accent text-sm rounded-full">Método Farray</span>
                      <span className="px-3 py-1 bg-primary-accent/20 text-primary-accent text-sm rounded-full">+25 años exp.</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Additional Teachers Grid */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Iroel Bastarreche */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_MEDIUM}>
                <div className="group h-full bg-black/50 backdrop-blur-md border border-primary-dark/40 hover:border-primary-accent/50 rounded-2xl p-6 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-dark/50 group-hover:border-primary-accent/50 transition-colors duration-300 mb-4 bg-primary-dark/30 flex items-center justify-center">
                      {/* Placeholder icon for Iroel */}
                      <svg className="w-12 h-12 text-primary-accent/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral mb-1">
                      {t('salsaCubanaTeacher2Name')}
                    </h3>
                    <p className="text-primary-accent font-semibold mb-3 text-sm">
                      {t('salsaCubanaTeacher2Specialty')}
                    </p>
                    <p className="text-neutral/80 text-sm leading-relaxed">
                      {t('salsaCubanaTeacher2Bio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Yasmina Fernández */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_MEDIUM * 2}>
                <div className="group h-full bg-black/50 backdrop-blur-md border border-primary-dark/40 hover:border-primary-accent/50 rounded-2xl p-6 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-dark/50 group-hover:border-primary-accent/50 transition-colors duration-300 mb-4">
                      <picture>
                        <source
                          type="image/webp"
                          srcSet="/images/teachers/img/profesora-yasmina-fernandez_320.webp 320w, /images/teachers/img/profesora-yasmina-fernandez_640.webp 640w"
                          sizes="96px"
                        />
                        <img
                          src="/images/teachers/img/profesora-yasmina-fernandez_320.jpg"
                          alt="Yasmina Fernández - Profesora de Salsa Cubana"
                          width="96"
                          height="96"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-xl font-bold text-neutral mb-1">
                      {t('salsaCubanaTeacher3Name')}
                    </h3>
                    <p className="text-primary-accent font-semibold mb-3 text-sm">
                      {t('salsaCubanaTeacher3Specialty')}
                    </p>
                    <p className="text-neutral/80 text-sm leading-relaxed">
                      {t('salsaCubanaTeacher3Bio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-base sm:text-lg text-neutral/90 mt-8 sm:mt-10 max-w-2xl mx-auto">
                {t('salsaCubanaTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 5b. Prepara tu primera clase */}
        <section className="py-14 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-neutral mb-2 text-center holographic-text">
                  {t('salsaCubanaPrepareTitle')}
                </h3>
                <p className="text-base text-neutral/70 mb-6 text-center">
                  {t('salsaCubanaPrepareSubtitle')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                  {/* Que traer */}
                  <div className="p-5 bg-primary-accent/10 rounded-2xl border border-primary-accent/30 hover:border-primary-accent/50 transition-all duration-300">
                    <h4 className="text-base font-bold text-primary-accent mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary-accent/20 flex items-center justify-center text-sm">
                        +
                      </span>
                      {t('salsaCubanaPrepareWhatToBring')}
                    </h4>
                    <ul className="space-y-2">
                      {[1, 2, 3, 4].map(num => (
                        <li key={num} className="flex items-start gap-2 text-sm text-neutral/80">
                          <CheckIcon className="w-4 h-4 text-primary-accent mt-0.5 flex-shrink-0" />
                          <span>{t(`salsaCubanaPrepareItem${num}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Antes de llegar */}
                  <div className="p-5 bg-primary-dark/15 rounded-2xl border border-primary-dark/30 hover:border-primary-dark/50 transition-all duration-300">
                    <h4 className="text-base font-bold text-neutral mb-3 flex items-center gap-2">
                      <ClockIcon className="w-5 h-5 text-primary-accent" />
                      {t('salsaCubanaPrepareBefore')}
                    </h4>
                    <ul className="space-y-2">
                      {[1, 2, 3].map(num => (
                        <li key={num} className="flex items-start gap-2 text-sm text-neutral/80">
                          <span className="w-4 h-4 rounded-full bg-primary-dark/30 flex items-center justify-center text-xs text-neutral mt-0.5 flex-shrink-0">
                            -
                          </span>
                          <span>{t(`salsaCubanaPrepareBeforeItem${num}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nota especial */}
                  <div className="p-5 bg-neutral/5 rounded-2xl border border-neutral/20 hover:border-neutral/40 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                    <h4 className="text-base font-bold text-neutral/70 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-neutral/10 flex items-center justify-center text-sm">
                        💡
                      </span>
                      {t('salsaCubanaPrepareNote')}
                    </h4>
                    <p className="text-sm text-neutral/80 leading-relaxed">
                      {t('salsaCubanaPrepareNoteDesc')}
                    </p>
                  </div>
                </div>

                {/* Consejo de Yunaisy */}
                <div className="mt-6 p-5 bg-gradient-to-r from-primary-accent/10 via-primary-dark/10 to-primary-accent/10 rounded-2xl border border-primary-accent/30">
                  <p className="text-sm font-bold text-primary-accent mb-2">
                    {t('salsaCubanaPrepareTeacherTip')}
                  </p>
                  <blockquote className="text-neutral/90 italic leading-relaxed text-sm">
                    &ldquo;{t('salsaCubanaPrepareTeacherQuote')}&rdquo;
                  </blockquote>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 6. Para quién es este método - Identification */}
        <section aria-labelledby="identify-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="identify-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 holographic-text"
                >
                  {t('salsaCubanaIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <ul
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-8 sm:mb-10 list-none"
              role="list"
              aria-label={t('salsaCubanaIdentifyListLabel') || 'Perfiles ideales para el curso'}
            >
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  as="li"
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <div className="group relative h-full min-h-[100px] flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300"
                      aria-hidden="true"
                    >
                      <CheckIcon className="text-primary-accent" size="sm" />
                    </div>
                    <p className="text-neutral/90 leading-relaxed">
                      {t(`salsaCubanaIdentify${num}`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </ul>

            <AnimateOnScroll>
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-xl sm:text-2xl font-bold holographic-text mb-4">
                  {t('salsaCubanaIdentifyClosing')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 7. Transformation - Qué conseguirás */}
        <section aria-labelledby="transform-title" className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="transform-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('salsaCubanaTransformTitle')}
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
                  <div className="group h-full min-h-[200px] sm:min-h-[220px] p-5 sm:p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                    <div className="text-5xl sm:text-6xl font-black text-primary-accent mb-3 sm:mb-4 holographic-text">
                      {num}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral mb-2 sm:mb-3">
                      {t(`salsaCubanaTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`salsaCubanaTransform${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Why Choose Farray's */}
        <section className="py-16 md:py-24 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('salsaCubanaWhyChooseTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-primary-accent font-semibold">
                  {t('salsaCubanaWhyChooseSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-16 md:mb-20">
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <div className="group h-full min-h-[140px] sm:min-h-[160px] p-4 sm:p-6 bg-black/30 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <CheckCircleIcon className="w-6 h-6 text-primary-accent" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-neutral mb-2">
                          {t(`salsaCubanaWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-sm leading-relaxed">
                          {t(`salsaCubanaWhyChoose${num}Desc`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Trust Stats */}
            <AnimateOnScroll>
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-20 max-w-5xl mx-auto mb-16 md:mb-20">
                <div className="text-center">
                  <AnimatedCounter
                    target={8}
                    suffix="+"
                    className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('yearsExperience')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={1500}
                    suffix="+"
                    className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('activeStudents')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={15000}
                    suffix="+"
                    className="text-4xl sm:text-5xl md:text-6xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('satisfiedStudents')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Logos */}
            <AnimateOnScroll>
              <div className="text-center max-w-4xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 holographic-text">
                  {t('salsaCubanaLogosTitle')}
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
                        alt="Street Dance 2 - Película de danza"
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
                  {t('salsaCubanaLogosIntlText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 9. Video Section */}
        <section id="video" className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('salsaCubanaVideoTitle')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/70">
                  {t('salsaCubanaVideoDesc')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                <YouTubeEmbed
                  videoId={SALSA_CUBANA_VIDEO_ID}
                  title="Clases de Salsa Cubana en Barcelona - Farray's Center"
                />
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* 10. Testimonials */}
        <section
          id="testimonials"
          aria-labelledby="testimonials-title"
          className="py-12 md:py-20 bg-primary-dark/10"
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
              {salsaCubanaTestimonials.map((testimonial, index) => (
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

        {/* 11. Cultural History */}
        <CulturalHistorySection
          titleKey="salsaCubanaCulturalHistoryTitle"
          shortDescKey="salsaCubanaCulturalShort"
          fullHistoryKey="salsaCubanaCulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* 11b. Latin Dance Comparison Table */}
        <section className="py-14 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <LatinDanceComparisonTable highlightedStyle="salsaCubana" />
            </AnimateOnScroll>
          </div>
        </section>

        {/* 12. Final CTA Section */}
        <section id="final-cta" className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('salsaCubanaFinalCTATitle')}
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 holographic-text">
                  {t('salsaCubanaFinalCTASubtitle')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-5 sm:mb-6 leading-relaxed">
                  {t('salsaCubanaFinalCTADesc')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 mb-6 sm:mb-8 italic">
                  {t('salsaCubanaFinalCTAFunny')}
                </p>

                {/* Final CTAs */}
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                  role="group"
                  aria-label={t('salsaCubanaCTAGroup') || 'Opciones de inscripción'}
                >
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta1-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('salsaCubanaCTA1')}
                    </a>
                    <p id="final-cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('salsaCubanaCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta2-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                    >
                      {t('salsaCubanaCTA2')}
                    </a>
                    <p id="final-cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('salsaCubanaCTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 13. FAQ */}
        <FAQSection
          title={t('salsaCubanaFaqTitle')}
          faqs={salsaCubanaFaqs}
          pageUrl={pageUrl}
        />

        {/* 14. Local SEO Section */}
        <section className="py-10 md:py-14 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto p-6 bg-black/30 rounded-2xl border border-neutral/20">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-4">
                  {t('salsaCubanaNearbyTitle')}
                </h3>
                <p className="text-neutral/80 mb-6">{t('salsaCubanaNearbyDesc')}</p>
                <p className="text-neutral/90 font-semibold mb-4">
                  {t('salsaCubanaNearbySearchText')}
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {SALSA_CUBANA_NEARBY_AREAS.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-primary-accent" />
                      <span className="text-neutral/80">
                        {area.name}: <span className="text-primary-accent">{area.time}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-neutral/70 text-sm mt-4">{t('salsaCubanaNearbyMetro')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default SalsaCubanaPage;
