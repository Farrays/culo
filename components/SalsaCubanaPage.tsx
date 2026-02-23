import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from './shared/Breadcrumb';
import LazyImage from './LazyImage';
import OptimizedImage from './OptimizedImage';
import {
  getStyleImage,
  getContextualAltKey,
  getRelatedClassImageUrl,
} from '../constants/style-images';
import {
  SALSA_CUBANA_FAQS_CONFIG,
  SALSA_CUBANA_SCHEDULE_KEYS,
  SALSA_CUBANA_NEARBY_AREAS,
  SALSA_CUBANA_LEVELS,
  SALSA_CUBANA_PREPARE_CONFIG,
} from '../constants/salsa-cubana';
import { ANIMATION_DELAYS } from '../constants/shared';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import LevelCardsSection from './shared/LevelCardsSection';
import PrepareClassSection from './shared/PrepareClassSection';
import AnimatedCounter from './AnimatedCounter';
import { CourseSchema } from './SchemaMarkup';
import {
  StarRating,
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  StarIcon,
  CalendarDaysIcon,
} from '../lib/icons';
import LatinDanceComparisonTable from './shared/LatinDanceComparisonTable';
import { UsersIcon, MapPinIcon } from './shared/CommonIcons';
import { ReviewsSection } from './reviews';

// Enterprise: Get salsa cubana image config from centralized system
const salsaCubanaImage = getStyleImage('salsa_cubana');

const SalsaCubanaPage: React.FC = () => {
  const { t, i18n } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);
  const locale = i18n.language;
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

  // BreadcrumbList Schema (JSON-LD)
  const _breadcrumbSchema = {
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
        <meta property="og:title" content={`${t('salsaCubanaPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('salsaCubanaMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-salsa-cubana.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('salsaCubanaPageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('salsaCubanaMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-salsa-cubana.jpg`} />
      </Helmet>

      {/* BreadcrumbList generated at build-time by prerender.mjs */}

      {/* LocalBusiness Schema removed - already injected at build-time by prerender.mjs */}

      <CourseSchema
        name={t('salsaCubanaCourseSchemaName')}
        description={t('salsaCubanaCourseSchemaDesc')}
        provider={{
          name: t('salsaCubana_schema_providerName'),
          url: baseUrl,
        }}
        educationalLevel={t('salsaCubana_schema_educationalLevel')}
        teaches={t('salsaCubana_schema_teaches')}
        coursePrerequisites={t('salsaCubana_schema_prerequisites')}
        numberOfLessons={t('salsaCubana_schema_numberOfLessons')}
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
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
          {/* Background - Enterprise OptimizedImage with salsa cubana photo */}
          <div className="absolute inset-0 bg-black">
            {/* Hero background image with configurable opacity */}
            <div className="absolute inset-0" style={{ opacity: 0.45 }}>
              <OptimizedImage
                src={salsaCubanaImage.basePath}
                altKey={getContextualAltKey('salsa_cubana', 'hero')}
                altFallback={salsaCubanaImage.fallbackAlt}
                priority="high"
                sizes="100vw"
                aspectRatio="16/9"
                className="w-full h-full"
                objectPosition="center 40%"
                placeholder="color"
                placeholderColor="#111"
                breakpoints={salsaCubanaImage.breakpoints}
                formats={salsaCubanaImage.formats}
              />
            </div>
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 via-transparent to-black/50"></div>
          </div>
          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1
                id="hero-title"
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-6 text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {t('salsaCubanaHeroTitle')}
              </h1>
              {/* Línea emocional - Océano Azul */}
              <p className="text-xl sm:text-2xl md:text-3xl text-neutral/90 mb-3">
                {t('salsaCubanaHeroEmotional')}
              </p>
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
                  <span className="text-sm">{t('salsaCubana_socialProof_reviews')}</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-primary-accent" />
                  <span>{t('salsaCubana_socialProof_students')}</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-accent" />
                  <span>8 {t('years_in_barcelona')}</span>
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

                  {/* ~450 Calorías */}
                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <FlameIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text">
                        ~450
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
        <section aria-labelledby="what-is-title" className="py-12 md:py-16 bg-primary-dark/10">
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
                    <p>{t('salsaCubanaWhatIsP3')}</p>
                    <p>{t('salsaCubanaWhatIsP4')}</p>
                    <p className="text-center text-xl sm:text-2xl font-bold mt-6 sm:mt-8 holographic-text">
                      {t('salsaCubanaWhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-lg sm:text-xl font-semibold">
                      {t('salsaCubanaWhatIsQuestionAnswer')}
                    </p>
                  </div>
                  {/* Enterprise: OptimizedImage for "What is Salsa Cubana" section */}
                  <div className="rounded-2xl overflow-hidden shadow-xl border border-primary-accent/20 hover:border-primary-accent/40 transition-all duration-500 group">
                    <OptimizedImage
                      src={salsaCubanaImage.basePath}
                      altKey="styleImages.salsaCubana.alt"
                      altFallback={salsaCubanaImage.fallbackAlt}
                      priority="low"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      aspectRatio="4/3"
                      className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                      objectPosition="center 40%"
                      placeholder="blur"
                      breakpoints={[640, 768, 1024]}
                      formats={salsaCubanaImage.formats}
                    />
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 2b. Schedule */}
        <ScheduleSection
          titleKey="salsaCubanaScheduleTitle"
          subtitleKey="salsaCubanaScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* 2c. Level Cards - Sistema progresivo */}
        <LevelCardsSection titleKey="salsaCubanaLevelsTitle" levels={SALSA_CUBANA_LEVELS} />

        {/* 2d. Teachers Section - Yunaisy Farray */}
        <section
          id="teachers"
          aria-labelledby="teachers-title"
          className="py-12 md:py-16 bg-primary-dark/10 relative overflow-hidden"
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
                        type="image/avif"
                        srcSet="/images/teachers/img/maestra-yunaisy-farray_320.avif 320w, /images/teachers/img/maestra-yunaisy-farray_640.avif 640w, /images/teachers/img/maestra-yunaisy-farray_960.avif 960w"
                        sizes="192px"
                      />
                      <source
                        type="image/webp"
                        srcSet="/images/teachers/img/maestra-yunaisy-farray_320.webp 320w, /images/teachers/img/maestra-yunaisy-farray_640.webp 640w, /images/teachers/img/maestra-yunaisy-farray_960.webp 960w"
                        sizes="192px"
                      />
                      <img
                        src="/images/teachers/img/maestra-yunaisy-farray_320.webp"
                        alt={t('salsaCubana_alt_yunaisy')}
                        width="192"
                        height="192"
                        loading="lazy"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center 20%' }}
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
                      <span className="px-3 py-1 bg-primary-accent/20 text-primary-accent text-sm rounded-full">
                        CID-UNESCO
                      </span>
                      <span className="px-3 py-1 bg-primary-accent/20 text-primary-accent text-sm rounded-full">
                        {t('salsaCubana_tag_metodoFarray')}
                      </span>
                      <span className="px-3 py-1 bg-primary-accent/20 text-primary-accent text-sm rounded-full">
                        {t('salsaCubana_tag_experience')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Additional Teachers Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Iroel Bastarreche */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_MEDIUM}>
                <div className="group h-full bg-black/50 backdrop-blur-md border border-primary-dark/40 hover:border-primary-accent/50 rounded-2xl p-6 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-dark/50 group-hover:border-primary-accent/50 transition-colors duration-300 mb-4">
                      <picture>
                        <source
                          type="image/avif"
                          srcSet="/images/teachers/img/profesor-iroel-bastarreche_320.avif 320w, /images/teachers/img/profesor-iroel-bastarreche_640.avif 640w, /images/teachers/img/profesor-iroel-bastarreche_960.avif 960w"
                          sizes="96px"
                        />
                        <source
                          type="image/webp"
                          srcSet="/images/teachers/img/profesor-iroel-bastarreche_320.webp 320w, /images/teachers/img/profesor-iroel-bastarreche_640.webp 640w, /images/teachers/img/profesor-iroel-bastarreche_960.webp 960w"
                          sizes="96px"
                        />
                        <img
                          src="/images/teachers/img/profesor-iroel-bastarreche_320.webp"
                          alt={t('salsaCubana_alt_iroel')}
                          width="96"
                          height="96"
                          loading="lazy"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 20%' }}
                        />
                      </picture>
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
                          type="image/avif"
                          srcSet="/images/teachers/img/profesora-yasmina-fern%C3%A1ndez_320.avif 320w, /images/teachers/img/profesora-yasmina-fern%C3%A1ndez_640.avif 640w, /images/teachers/img/profesora-yasmina-fern%C3%A1ndez_960.avif 960w"
                          sizes="96px"
                        />
                        <source
                          type="image/webp"
                          srcSet="/images/teachers/img/profesora-yasmina-fern%C3%A1ndez_320.webp 320w, /images/teachers/img/profesora-yasmina-fern%C3%A1ndez_640.webp 640w, /images/teachers/img/profesora-yasmina-fern%C3%A1ndez_960.webp 960w"
                          sizes="96px"
                        />
                        <img
                          src="/images/teachers/img/profesora-yasmina-fern%C3%A1ndez_320.webp"
                          alt={t('salsaCubana_alt_yasmina')}
                          width="96"
                          height="96"
                          loading="lazy"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 15%' }}
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

              {/* Lia Valdes */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_MEDIUM * 3}>
                <div className="group h-full bg-black/50 backdrop-blur-md border border-primary-dark/40 hover:border-primary-accent/50 rounded-2xl p-6 transition-all duration-300">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-dark/50 group-hover:border-primary-accent/50 transition-colors duration-300 mb-4">
                      <picture>
                        <source
                          type="image/avif"
                          srcSet="/images/teachers/img/profesora-lia-valdes_320.avif 320w, /images/teachers/img/profesora-lia-valdes_640.avif 640w, /images/teachers/img/profesora-lia-valdes_960.avif 960w"
                          sizes="96px"
                        />
                        <source
                          type="image/webp"
                          srcSet="/images/teachers/img/profesora-lia-valdes_320.webp 320w, /images/teachers/img/profesora-lia-valdes_640.webp 640w, /images/teachers/img/profesora-lia-valdes_960.webp 960w"
                          sizes="96px"
                        />
                        <img
                          src="/images/teachers/img/profesora-lia-valdes_320.webp"
                          alt={t('salsaCubana_alt_lia')}
                          width="96"
                          height="96"
                          loading="lazy"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 20%' }}
                        />
                      </picture>
                    </div>
                    <h3 className="text-xl font-bold text-neutral mb-1">
                      {t('salsaCubanaTeacher4Name')}
                    </h3>
                    <p className="text-primary-accent font-semibold mb-3 text-sm">
                      {t('salsaCubanaTeacher4Specialty')}
                    </p>
                    <p className="text-neutral/80 text-sm leading-relaxed">
                      {t('salsaCubanaTeacher4Bio')}
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

        {/* 2e. Prepara tu primera clase - VIP Style */}
        <PrepareClassSection
          titleKey="salsaCubanaPrepareTitle"
          subtitleKey="salsaCubanaPrepareSubtitle"
          config={SALSA_CUBANA_PREPARE_CONFIG}
        />

        {/* 3. El Problema - PAS Framework */}
        <section aria-labelledby="problem-title" className="py-12 md:py-16 bg-black">
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
                  <p className="text-2xl font-bold text-primary-accent">
                    {t('salsaCubanaProblemP2')}
                  </p>
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
        <section aria-labelledby="compare-title" className="py-12 md:py-16 bg-black">
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

        {/* 4. Método Farray - Lo que nos hace únicos */}
        <section aria-labelledby="method-title" className="py-12 md:py-16 bg-black">
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
                        d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z"
                      />
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
              <AnimateOnScroll
                delay={ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
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
                        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                      />
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
              <AnimateOnScroll
                delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
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
                        d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                      />
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
              <AnimateOnScroll
                delay={3 * ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
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
              <AnimateOnScroll
                delay={4 * ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
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
                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                      />
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
              <AnimateOnScroll
                delay={5 * ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div className="group h-full min-h-[180px] p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center mb-3">
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
                        d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                      />
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

        {/* 6. Para quién es este método - Identification (Dos Océanos) */}
        <section aria-labelledby="identify-title" className="py-12 md:py-16 bg-primary-dark/10">
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

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-8 sm:mb-10">
              {/* Columna 1: Océano Azul - Buscando algo más que baile */}
              <AnimateOnScroll delay={0}>
                <div className="h-full p-6 sm:p-8 bg-black/50 border border-primary-accent/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center">
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
                          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-primary-accent">
                      {t('salsaCubanaIdentifyBlueOceanTitle')}
                    </h3>
                  </div>
                  <ul className="space-y-3" role="list">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <li key={num} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                        <span className="text-neutral/90 leading-relaxed">
                          {t(`salsaCubanaIdentifyBlue${num}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>

              {/* Columna 2: Océano Rojo - Del mundo del baile */}
              <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_MEDIUM}>
                <div className="h-full p-6 sm:p-8 bg-black/50 border border-neutral/30 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-neutral/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-neutral"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-neutral">
                      {t('salsaCubanaIdentifyRedOceanTitle')}
                    </h3>
                  </div>
                  <ul className="space-y-3" role="list">
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <li key={num} className="flex items-start gap-3">
                        <CheckIcon className="w-5 h-5 text-neutral/70 flex-shrink-0 mt-0.5" />
                        <span className="text-neutral/90 leading-relaxed">
                          {t(`salsaCubanaIdentifyRed${num}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-lg text-neutral/70 mb-2">{t('salsaCubanaIdentifyClose1')}</p>
                <p className="text-xl font-bold text-neutral mb-2">
                  {t('salsaCubanaIdentifyClose2')}
                </p>
                <p className="text-lg text-primary-accent font-semibold">
                  {t('salsaCubanaIdentifyClose3')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 7. Transformation - Qué conseguirás */}
        <section aria-labelledby="transform-title" className="py-12 md:py-16 bg-black">
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

            {/* Texto de cierre movido desde Para quién */}
            <AnimateOnScroll>
              <div className="text-center max-w-3xl mx-auto mt-12">
                <p className="text-xl sm:text-2xl font-bold holographic-text">
                  {t('salsaCubanaIdentifyClosing')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 8. Why Choose Farray's */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('salsaCubanaWhyChooseTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70">
                  {t('salsaCubanaWhyChooseSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-16 md:mb-20">
              {[1, 2, 3, 4, 5, 6, 7].map((num, index) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                  className={`[perspective:1000px]${num === 7 ? ' lg:col-start-2' : ''}`}
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
                        alt={t('salsaCubana_alt_cidUnesco')}
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
                        alt={t('salsaCubana_alt_streetDance')}
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
                        alt={t('salsaCubana_alt_theDancer')}
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
                        alt={t('salsaCubana_alt_telecinco')}
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
        <section id="video" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('salsaCubanaVideoTitle')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/70">{t('salsaCubanaVideoDesc')}</p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
              {/* Video Coming Soon Placeholder - Enterprise (Not clickable) */}
              <div className="max-w-2xl mx-auto">
                <div className="relative aspect-video bg-gradient-to-br from-primary-dark/40 via-black/60 to-primary-dark/30 rounded-2xl border border-primary-accent/20 overflow-hidden shadow-xl pointer-events-none select-none">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-accent/10 via-transparent to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                    {/* Play icon placeholder */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary-accent/20 border-2 border-primary-accent/40 flex items-center justify-center mb-4 backdrop-blur-sm">
                      <svg
                        className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent/60"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>

                    {/* Text */}
                    <p className="text-lg sm:text-xl font-bold text-neutral/90 mb-1">
                      {t('videoComingSoon')}
                    </p>
                    <p className="text-sm text-neutral/70">{t('videoComingSoonDesc')}</p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* 10. Reviews Section - Enterprise Professional System */}
        <ReviewsSection category="salsa-cubana" limit={8} showGoogleBadge={true} layout="grid" />

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
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <LatinDanceComparisonTable highlightedStyle="salsaCubana" />
            </AnimateOnScroll>
          </div>
        </section>

        {/* 12. FAQ */}
        <FAQSection title={t('salsaCubanaFaqTitle')} faqs={salsaCubanaFaqs} />

        {/* 13. Local SEO Section */}
        <section className="py-12 md:py-16 bg-black">
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

        {/* 14. Final CTA Section */}
        <section id="final-cta" className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('salsaCubanaFinalCTATitle')}
                </h2>

                {/* Copy Emocional - Océano Azul */}
                <div className="mb-8 space-y-2 text-lg sm:text-xl text-neutral/80">
                  <p>{t('salsaCubanaFinalCTAEmotional1')}</p>
                  <p>{t('salsaCubanaFinalCTAEmotional2')}</p>
                  <p>{t('salsaCubanaFinalCTAEmotional3')}</p>
                  <p>{t('salsaCubanaFinalCTAEmotional4')}</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold mb-8 holographic-text">
                  {t('salsaCubanaFinalCTAEmotionalClose')}
                </p>

                {/* Separador visual */}
                <div className="w-24 h-px bg-primary-accent/50 mx-auto mb-8"></div>

                {/* Copy Técnico - Océano Rojo */}
                <p className="text-lg sm:text-xl text-neutral/90 mb-3">
                  {t('salsaCubanaFinalCTATechnical1')}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-3">
                  {t('salsaCubanaFinalCTATechnical2')}
                </p>
                <p className="text-base sm:text-lg text-neutral/80 mb-6 sm:mb-8 italic">
                  {t('salsaCubanaFinalCTATechnical3')}
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

        {/* 15. Related Classes Section (Internal Linking) */}
        <section
          id="related-classes"
          aria-labelledby="related-classes-title"
          className="py-12 md:py-16"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <header className="text-center mb-8 sm:mb-12 relative z-10">
                <h2
                  id="related-classes-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('relatedClassesTitle')}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70">{t('relatedClassesSubtitle')}</p>
              </header>
            </AnimateOnScroll>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto relative z-0"
              role="list"
              aria-label={t('relatedClassesTitle')}
            >
              {/* Bachata */}
              <div role="listitem">
                <AnimateOnScroll
                  delay={ANIMATION_DELAYS.STAGGER_SMALL}
                  className="[perspective:1000px]"
                >
                  <article className="h-full" aria-labelledby="related-bachata-title">
                    <Link
                      to={`/${locale}/clases/bachata-barcelona`}
                      className="group block h-full bg-black/70 backdrop-blur-md
                                 border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                                 transition-all duration-500
                                 [transform-style:preserve-3d]
                                 hover:border-primary-accent hover:shadow-accent-glow
                                 hover:[transform:translateY(-0.5rem)_scale(1.02)]
                                 focus:outline-none focus:ring-2 focus:ring-primary-accent
                                 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${t('relatedBachataName')} - ${t('relatedClassesViewClass')}`}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                        <LazyImage
                          src={getRelatedClassImageUrl('bachata-barcelona')}
                          alt={`Clase de ${t('relatedBachataName')} en Barcelona - Farray's Dance Center`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          width={480}
                          height={320}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3
                          id="related-bachata-title"
                          className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t('relatedBachataName')}
                        </h3>
                        <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                          {t('relatedBachataDesc')}
                        </p>
                        <div
                          className="flex items-center gap-2 text-primary-accent font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                          aria-hidden="true"
                        >
                          <span>{t('relatedClassesViewClass')}</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
                </AnimateOnScroll>
              </div>

              {/* Timba */}
              <div role="listitem">
                <AnimateOnScroll
                  delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}
                  className="[perspective:1000px]"
                >
                  <article className="h-full" aria-labelledby="related-timba-title">
                    <Link
                      to={`/${locale}/clases/timba-barcelona`}
                      className="group block h-full bg-black/70 backdrop-blur-md
                                 border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                                 transition-all duration-500
                                 [transform-style:preserve-3d]
                                 hover:border-primary-accent hover:shadow-accent-glow
                                 hover:[transform:translateY(-0.5rem)_scale(1.02)]
                                 focus:outline-none focus:ring-2 focus:ring-primary-accent
                                 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${t('relatedTimbaName')} - ${t('relatedClassesViewClass')}`}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                        <LazyImage
                          src={getRelatedClassImageUrl('timba-barcelona')}
                          alt={`Clase de ${t('relatedTimbaName')} en Barcelona - Farray's Dance Center`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          width={480}
                          height={320}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3
                          id="related-timba-title"
                          className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t('relatedTimbaName')}
                        </h3>
                        <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                          {t('relatedTimbaDesc')}
                        </p>
                        <div
                          className="flex items-center gap-2 text-primary-accent font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                          aria-hidden="true"
                        >
                          <span>{t('relatedClassesViewClass')}</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
                </AnimateOnScroll>
              </div>

              {/* Folklore Cubano */}
              <div role="listitem">
                <AnimateOnScroll
                  delay={ANIMATION_DELAYS.STAGGER_SMALL * 3}
                  className="[perspective:1000px]"
                >
                  <article className="h-full" aria-labelledby="related-folklore-title">
                    <Link
                      to={`/${locale}/clases/folklore-cubano`}
                      className="group block h-full bg-black/70 backdrop-blur-md
                                 border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                                 transition-all duration-500
                                 [transform-style:preserve-3d]
                                 hover:border-primary-accent hover:shadow-accent-glow
                                 hover:[transform:translateY(-0.5rem)_scale(1.02)]
                                 focus:outline-none focus:ring-2 focus:ring-primary-accent
                                 focus:ring-offset-2 focus:ring-offset-black"
                      aria-label={`${t('relatedFolkloreCubanoName')} - ${t('relatedClassesViewClass')}`}
                    >
                      <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                        <LazyImage
                          src={getRelatedClassImageUrl('folklore-cubano')}
                          alt={`Clase de ${t('relatedFolkloreCubanoName')} en Barcelona - Farray's Dance Center`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          width={480}
                          height={320}
                        />
                        <div
                          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="p-4 sm:p-6">
                        <h3
                          id="related-folklore-title"
                          className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                        >
                          {t('relatedFolkloreCubanoName')}
                        </h3>
                        <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                          {t('relatedFolkloreCubanoDesc')}
                        </p>
                        <div
                          className="flex items-center gap-2 text-primary-accent font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                          aria-hidden="true"
                        >
                          <span>{t('relatedClassesViewClass')}</span>
                          <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </article>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default SalsaCubanaPage;
