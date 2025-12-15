import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  SALSA_LADY_STYLE_TESTIMONIALS,
  SALSA_LADY_STYLE_FAQS_CONFIG,
  SALSA_LADY_STYLE_SCHEDULE_KEYS,
  SALSA_LADY_STYLE_NEARBY_AREAS,
  SALSA_LADY_STYLE_VIDEO_ID,
  SALSA_LADY_STYLE_LEVELS,
  SALSA_LADY_COMPARISON_DATA,
  SALSA_LADY_STYLE_PREPARE_CONFIG,
} from '../constants/salsa-lady-style';
import { ANIMATION_DELAYS } from '../constants/shared';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import LevelCardsSection from './shared/LevelCardsSection';
import PrepareClassSection from './shared/PrepareClassSection';
import AnimatedCounter from './AnimatedCounter';
import YouTubeEmbed from './YouTubeEmbed';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from './SchemaMarkup';
import { StarRating, CheckIcon, CheckCircleIcon, CalendarDaysIcon } from '../lib/icons';
import { UsersIcon, MapPinIcon } from './shared/CommonIcons';

const SalsaLadyStylePage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/salsa-lady-style-barcelona`;

  // Schedule data
  const schedules = SALSA_LADY_STYLE_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
  }));

  // FAQs
  const salsaLadyFaqs = SALSA_LADY_STYLE_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials
  const salsaLadyTestimonials = SALSA_LADY_STYLE_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = salsaLadyTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Salsa Lady Style - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: new Date().toISOString().split('T')[0],
  }));

  // VideoObject Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('salsaLadyVideoTitle'),
    description: t('salsaLadyVideoDesc'),
    thumbnailUrl: `https://img.youtube.com/vi/${SALSA_LADY_STYLE_VIDEO_ID}/maxresdefault.jpg`,
    uploadDate: '2025-01-01',
    contentUrl: `https://www.youtube.com/watch?v=${SALSA_LADY_STYLE_VIDEO_ID}`,
    embedUrl: `https://www.youtube.com/embed/${SALSA_LADY_STYLE_VIDEO_ID}`,
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('salsaLadyBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('salsaLadyBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('salsaLadyBreadcrumbLatin'),
        item: `${baseUrl}/${locale}/clases/salsa-bachata-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('salsaLadyBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Breadcrumb items for visual navigation
  const breadcrumbItems = [
    { name: t('salsaLadyBreadcrumbHome'), url: `/${locale}` },
    { name: t('salsaLadyBreadcrumbClasses'), url: `/${locale}/clases/baile-barcelona` },
    {
      name: t('salsaLadyBreadcrumbLatin'),
      url: `/${locale}/clases/salsa-bachata-barcelona`,
    },
    {
      name: t('salsaLadyBreadcrumbCurrent'),
      url: `/${locale}/clases/salsa-lady-style-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('salsaLadyPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('salsaLadyMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${t('salsaLadyPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('salsaLadyMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-salsa-lady-style.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('salsaLadyPageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('salsaLadyMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-salsa-lady-style.jpg`} />
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
        name="Farray's International Dance Center - Clases de Salsa Lady Style"
        description={t('salsaLadyMetaDescription')}
        url={pageUrl}
        telephone="+34622247085"
        email="info@farrayscenter.com"
        address={{
          streetAddress: 'Calle Entenca 100',
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
        }}
        geo={{ latitude: '41.3784', longitude: '2.1456' }}
        priceRange="€€"
      />
      <CourseSchema
        name="Clases de Salsa Lady Style Barcelona - Método Farray"
        description={t('salsaLadyCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: pageUrl,
        }}
      />
      <AggregateReviewsSchema
        itemName="Clases de Salsa Lady Style - Farray's Center"
        itemType="Course"
        reviews={reviewsSchemaData}
      />

      <main className="bg-black text-neutral min-h-screen pt-20 md:pt-24">
        {/* 1. Hero Section */}
        <section
          id="hero"
          aria-labelledby="hero-title"
          className="relative min-h-[600px] flex items-center justify-center overflow-hidden py-24 md:py-32"
        >
          {/* Background - Same as TwerkPage with stardust texture */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>

          <div className="relative z-20 container mx-auto px-4 sm:px-6 text-center">
            {/* Breadcrumb inside hero like other pages */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text"
              >
                {t('salsaLadyHeroTitle')}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('salsaLadyHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral/90 mt-6 sm:mt-8 mb-4 sm:mb-6 leading-relaxed">
                {t('salsaLadyHeroDesc')}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-neutral/90 italic mb-6">
                {t('salsaLadyHeroLocation')}
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
                  <span>+15.000 alumnas formadas</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-accent" />
                  <span>8 años en Barcelona</span>
                </div>
              </div>

              {/* CTA Buttons - Enhanced like TwerkPage */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
                role="group"
                aria-label="Opciones de inscripción"
              >
                <div className="w-full sm:w-auto">
                  <a
                    href="#contact"
                    aria-describedby="cta1-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
                  >
                    {t('salsaLadyCTA1')}
                  </a>
                  <p id="cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('salsaLadyCTA1Subtext')}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta2-desc"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
                  >
                    {t('salsaLadyCTA2')}
                  </a>
                  <p id="cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                    {t('salsaLadyCTA2Subtext')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2. What is Salsa Lady Style Section - Enhanced with better contrast */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary-dark/20 via-black to-black relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-accent/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary-dark/15 via-transparent to-transparent"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('salsaLadyWhatIsTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/90 leading-relaxed mb-12">
                  {t('salsaLadyWhatIsDesc')}
                </p>

                {/* Premium 3D Quote Card - Enhanced */}
                <div className="[perspective:1200px] max-w-3xl mx-auto">
                  <div className="group relative p-8 sm:p-10 bg-gradient-to-br from-primary-accent/20 via-black/80 to-primary-dark/25 backdrop-blur-xl rounded-3xl border border-primary-accent/50 shadow-2xl shadow-primary-accent/20 transition-all duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(-3deg)_rotateX(2deg)_translateY(-8px)] hover:shadow-accent-glow hover:border-primary-accent/70">
                    {/* Decorative elements */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 border-t-3 border-l-3 border-primary-accent/70 rounded-tl-xl"></div>
                    <div className="absolute -bottom-4 -right-4 w-10 h-10 border-b-3 border-r-3 border-primary-accent/70 rounded-br-xl"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="text-6xl text-primary-accent/50">&ldquo;</span>
                    </div>

                    <blockquote className="relative z-10">
                      <p className="text-neutral text-lg sm:text-xl md:text-2xl italic leading-relaxed font-light">
                        {t('salsaLadyWhatIsQuote')}
                      </p>
                    </blockquote>

                    <div className="mt-8 pt-6 border-t border-primary-accent/30 flex items-center justify-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-primary-accent/60 shadow-lg shadow-primary-accent/20">
                        <img
                          src="/images/teachers/yunaisy-farray_256.webp"
                          alt="Yunaisy Farray"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-left">
                        <cite className="not-italic font-bold text-neutral text-lg">
                          Yunaisy Farray
                        </cite>
                        <p className="text-primary-accent text-sm font-medium">
                          {t('salsaLadyTeacherCredential')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 3. Schedule Section */}
        <ScheduleSection
          id="schedule"
          titleKey="salsaLadyScheduleTitle"
          subtitleKey="salsaLadyScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* 4. Level Cards Section - Premium 3D */}
        <LevelCardsSection titleKey="salsaLadyLevelsTitle" levels={SALSA_LADY_STYLE_LEVELS} />

        {/* 5. Teachers Section - Like TwerkPage */}
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
                  {t('salsaLadyTeachersTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 mt-4">
                  {t('salsaLadyTeachersSubtitle')}
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
                          srcSet="/images/teachers/yunaisy-farray_256.webp 1x, /images/teachers/yunaisy-farray_512.webp 2x"
                        />
                        <img
                          src="/images/teachers/yunaisy-farray_256.png"
                          srcSet="/images/teachers/yunaisy-farray_256.png 1x, /images/teachers/yunaisy-farray_512.png 2x"
                          alt="Yunaisy Farray - Maestra de Salsa Lady Style y creadora del Método Farray®"
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
                      {t('salsaLadyTeacherCredential')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">
                      {t('salsaLadyTeacherBio')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Lia Valdes */}
              <AnimateOnScroll
                delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-4 sm:mb-6 bg-primary-dark/30 flex items-center justify-center">
                      <span className="text-4xl font-black text-primary-accent/50">LV</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-2">Lia Valdes</h3>
                    <p className="text-primary-accent font-semibold mb-3 sm:mb-4">
                      Maestra y Artista Internacional Cubana
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">
                      Con más de 20 años de carrera artística, formada en la Escuela Nacional de
                      Arte de Cuba (ENA). Referente mundial en Cabaret y Lady Style, ha llevado su
                      arte a escenarios internacionales.
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-base sm:text-lg text-neutral/90 mt-8 sm:mt-10 max-w-2xl mx-auto">
                {t('salsaLadyTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 7. Prepare Section - VIP Style like SalsaCubana */}
        <PrepareClassSection
          titleKey="salsaLadyPrepareTitle"
          subtitleKey="salsaLadyPrepareSubtitle"
          config={SALSA_LADY_STYLE_PREPARE_CONFIG}
        />

        {/* 8. Comparison Table Section */}
        <section className="py-14 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-5xl mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-neutral mb-2 text-center holographic-text">
                  {t('salsaLadyCompareTitle')}
                </h3>
                <p className="text-base text-neutral/70 mb-6 text-center">
                  {t('salsaLadyCompareSubtitle')}
                </p>

                {/* Mobile: Cards view */}
                <div className="block lg:hidden space-y-4">
                  {SALSA_LADY_COMPARISON_DATA.rows.map((row, rowIdx) => (
                    <div
                      key={rowIdx}
                      className="p-4 bg-black/30 rounded-xl border border-neutral/20"
                    >
                      <h4 className="font-bold text-neutral mb-3 text-sm">{t(row.rowKey)}</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {SALSA_LADY_COMPARISON_DATA.styles.map((style, styleIdx) => (
                          <div
                            key={style.key}
                            className={`flex justify-between items-center p-2 rounded-lg ${
                              styleIdx === 1
                                ? 'bg-primary-accent/15 border border-primary-accent/30'
                                : 'bg-neutral/10'
                            }`}
                          >
                            <span
                              className={
                                styleIdx === 1
                                  ? 'text-primary-accent font-semibold'
                                  : 'text-neutral/70'
                              }
                            >
                              {t(style.nameKey)}
                            </span>
                            <span
                              className={
                                styleIdx === 1 ? 'text-primary-accent/80' : 'text-neutral/60'
                              }
                            >
                              {'★'.repeat(row.values[styleIdx] ?? 0)}
                            </span>
                          </div>
                        ))}
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
                          {t('salsaLadyCompareFeature')}
                        </th>
                        {SALSA_LADY_COMPARISON_DATA.styles.map((style, idx) => (
                          <th
                            key={style.key}
                            className={`text-center py-3 px-2 font-semibold ${
                              idx === 1 ? 'text-primary-accent' : 'text-neutral/70'
                            }`}
                          >
                            {t(style.nameKey)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SALSA_LADY_COMPARISON_DATA.rows.map((row, rowIdx) => (
                        <tr
                          key={rowIdx}
                          className={`border-b border-neutral/10 ${rowIdx % 2 === 0 ? 'bg-black/20' : ''}`}
                        >
                          <td className="py-3 px-2 text-neutral/80">{t(row.rowKey)}</td>
                          {row.values.map((value, styleIdx) => (
                            <td
                              key={styleIdx}
                              className={`py-3 px-2 text-center ${
                                styleIdx === 1
                                  ? 'bg-primary-accent/10 text-primary-accent/80'
                                  : 'text-neutral/60'
                              }`}
                            >
                              {'★'.repeat(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 9. Identification Section - Puntos de dolor */}
        <section aria-labelledby="identify-title" className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="identify-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 holographic-text"
                >
                  {t('salsaLadyIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <ul
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-8 sm:mb-10 list-none"
              role="list"
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
                    <p className="text-neutral/90 leading-relaxed">
                      {t(`salsaLadyIdentify${num}`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </ul>

            {/* Transition text */}
            <AnimateOnScroll>
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('salsaLadyIdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Need Enroll */}
            <AnimateOnScroll>
              <div className="text-center mb-6 sm:mb-8 max-w-4xl mx-auto">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 sm:mb-6 holographic-text">
                  {t('salsaLadyNeedEnrollTitle')}
                </h3>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
                <p className="text-lg sm:text-xl font-semibold holographic-text">
                  {t('salsaLadyIdentifyAgitate1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/90">
                  {t('salsaLadyIdentifySolution')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 italic">
                  {t('salsaLadyIdentifyClosing')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 10. Transformation Section */}
        <section aria-labelledby="transform-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="transform-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('salsaLadyTransformTitle')}
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
                      {t(`salsaLadyTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                      {t(`salsaLadyTransform${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* 11. Why Choose + Stats + Logos Section */}
        <section className="py-12 md:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('salsaLadyWhyChooseTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-10 sm:mb-12">
              {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
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
                          {t(`salsaLadyWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-sm leading-relaxed">
                          {t(`salsaLadyWhyChoose${num}Desc`)}
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
                  {t('salsaLadyLogosTitle')}
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
                  {t('salsaLadyLogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 12. Video Section */}
        <section className="py-16 md:py-24 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('salsaLadyVideoTitle')}
                </h2>
                <p className="text-lg text-neutral/70 max-w-2xl mx-auto">
                  {t('salsaLadyVideoDesc')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <YouTubeEmbed
                  videoId={SALSA_LADY_STYLE_VIDEO_ID}
                  title={t('salsaLadyVideoTitle')}
                />
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 13. Testimonials - Same style as TwerkPage */}
        <section aria-labelledby="testimonials-title" className="py-16 md:py-24 bg-black">
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
              {salsaLadyTestimonials.map((testimonial, index) => (
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

        {/* 14. Cultural History Section */}
        <CulturalHistorySection
          titleKey="salsaLadyCulturalTitle"
          shortDescKey="salsaLadyCulturalShort"
          fullHistoryKey="salsaLadyCulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* 15. FAQ Section */}
        <FAQSection title={t('salsaLadyFaqTitle')} faqs={salsaLadyFaqs} pageUrl={pageUrl} />

        {/* 16. Local SEO Section */}
        <section className="py-10 md:py-14 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto p-6 bg-black/30 rounded-2xl border border-neutral/20">
                <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-4">
                  {t('salsaLadyNearbyTitle')}
                </h3>
                <p className="text-neutral/80 mb-6">{t('salsaLadyNearbyDesc')}</p>
                <p className="text-neutral/90 font-semibold mb-4">
                  {t('salsaLadyNearbySearchText')}
                </p>
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {SALSA_LADY_STYLE_NEARBY_AREAS.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-primary-accent" />
                      <span className="text-neutral/80">
                        {area.name}: <span className="text-primary-accent">{area.time}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-neutral/70 text-sm mt-4">{t('salsaLadyNearbyMetro')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 17. Final CTA Section */}
        <section
          id="contact"
          className="py-16 md:py-24 bg-gradient-to-br from-primary-accent/20 via-black to-primary-dark/20"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('salsaLadyFinalCTATitle')}
                </h2>
                <p className="text-xl text-neutral/80 mb-8 leading-relaxed whitespace-pre-line">
                  {t('salsaLadyFinalCTADesc')}
                </p>

                {/* CTA Buttons - Same structure as hero */}
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8"
                  role="group"
                  aria-label="Opciones de inscripción"
                >
                  <div className="w-full sm:w-auto">
                    <a
                      href="https://wa.me/34622247085"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-describedby="final-cta1-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
                    >
                      {t('salsaLadyFinalCTA1')}
                    </a>
                    <p id="final-cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('salsaLadyFinalCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-describedby="final-cta2-desc"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95"
                    >
                      {t('salsaLadyFinalCTA2')}
                    </a>
                    <p id="final-cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                      {t('salsaLadyFinalCTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default SalsaLadyStylePage;
