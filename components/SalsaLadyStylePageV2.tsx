import React from 'react';
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
  SALSA_LADY_STYLE_PREPARE_CONFIG,
} from '../constants/salsa-lady-style';
import { ANIMATION_DELAYS } from '../constants/shared';
import AnimateOnScroll from './AnimateOnScroll';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import LevelCardsSection from './shared/LevelCardsSection';
import PrepareClassSection from './shared/PrepareClassSection';
import YouTubeEmbed from './YouTubeEmbed';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from './SchemaMarkup';
import { StarRating, CalendarDaysIcon } from '../lib/icons';
import { UsersIcon, MapPinIcon } from './shared/CommonIcons';

// Icon components for a clean, professional look
const CheckIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Pillar icons - elegant and minimal
const PillarIcon: React.FC<{ type: string; className?: string }> = ({ type, className = '' }) => {
  const icons: Record<string, React.ReactElement> = {
    braceo: (
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
          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
        />
      </svg>
    ),
    caderas: (
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
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    ),
    giros: (
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
          d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
        />
      </svg>
    ),
    tacones: (
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
          d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
        />
      </svg>
    ),
    musicalidad: (
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
          d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"
        />
      </svg>
    ),
    presencia: (
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
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    ),
  };
  return icons[type] || null;
};

const SalsaLadyStylePageV2: React.FC = () => {
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

  // Breadcrumb items
  const breadcrumbItems = [
    { name: t('salsaLadyBreadcrumbHome'), url: `/${locale}` },
    { name: t('salsaLadyBreadcrumbClasses'), url: `/${locale}/clases/baile-barcelona` },
    { name: t('salsaLadyBreadcrumbLatin'), url: `/${locale}/clases/salsa-bachata-barcelona` },
    {
      name: t('salsaLadyBreadcrumbCurrent'),
      url: `/${locale}/clases/salsa-lady-style-barcelona`,
      isActive: true,
    },
  ];

  // 6 Technical Pillars - Metodo Farray para Lady Style
  const technicalPillars = [
    { id: 'braceo', icon: 'braceo' },
    { id: 'caderas', icon: 'caderas' },
    { id: 'giros', icon: 'giros' },
    { id: 'tacones', icon: 'tacones' },
    { id: 'musicalidad', icon: 'musicalidad' },
    { id: 'presencia', icon: 'presencia' },
  ];

  // Comparison rows for table
  const comparisonRows = [1, 2, 3, 4, 5, 6, 7, 8];

  // Before/After transformation items
  const transformationItems = [
    'brazos',
    'caderas',
    'giros',
    'tacones',
    'shines',
    'confianza',
    'estilo',
  ];

  // Teachers data
  const teachers = [
    {
      name: 'Yunaisy Farray',
      image: '/images/teachers/img/yunaisy-farray-directora_320.webp',
      credentialKey: 'salsaLadyTeacherCredential',
      bioKey: 'salsaLadyTeacherBio',
    },
    {
      name: 'Lia Valdes',
      image: null,
      initials: 'LV',
      credentialKey: 'salsaLadyTeacher2Specialty',
      bioKey: 'salsaLadyTeacher2Bio',
    },
    {
      name: 'Yasmina Fernandez',
      image: '/images/teachers/img/profesora-yasmina-fernandez_320.webp',
      credentialKey: 'salsaLadyTeacher3Specialty',
      bioKey: 'salsaLadyTeacher3Bio',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('salsaLadyV2PageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('salsaLadyV2MetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${t('salsaLadyV2PageTitle')} | Farray's Center`} />
        <meta property="og:description" content={t('salsaLadyV2MetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Schema Markup */}
      <LocalBusinessSchema
        name="Farray's International Dance Center - Clases de Salsa Lady Style"
        description={t('salsaLadyV2MetaDescription')}
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
        priceRange="$$"
      />
      <CourseSchema
        name="Clases de Salsa Lady Style Barcelona - Método Farray"
        description={t('salsaLadyV2MetaDescription')}
        provider={{ name: "Farray's International Dance Center", url: baseUrl }}
      />
      <AggregateReviewsSchema
        itemName="Clases de Salsa Lady Style - Farray's Center"
        itemType="Course"
        reviews={reviewsSchemaData}
      />

      <main className="bg-black text-neutral min-h-screen pt-20 md:pt-24">
        {/* ===== 1. HERO SECTION ===== */}
        <section
          id="hero"
          aria-labelledby="hero-title"
          className="relative min-h-[90vh] sm:min-h-[600px] flex items-center justify-center overflow-hidden py-16 sm:py-24 md:py-32"
        >
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/40 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>

          <div className="relative z-20 container mx-auto px-4 sm:px-6 text-center">
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1
                id="hero-title"
                className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-4 sm:mb-6 holographic-text"
              >
                {t('salsaLadyV2HeroTitle')}
              </h1>
              <p className="text-xl sm:text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('salsaLadyV2HeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-base sm:text-xl md:text-2xl text-neutral/90 mt-4 sm:mt-8 mb-6 leading-relaxed px-2">
                {t('salsaLadyV2HeroDesc')}
              </p>

              {/* Social Proof - Mobile optimized */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-8 mb-6 sm:mb-8 text-neutral/80">
                <div className="flex items-center gap-2">
                  <StarRating size="sm" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-sm">(505+ reseñas)</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-primary-accent" />
                  <span className="text-sm sm:text-base">+15.000 alumnas formadas</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-accent" />
                  <span className="text-sm sm:text-base">8 {t('years_in_barcelona')}</span>
                </div>
              </div>

              {/* CTA Buttons - Mobile first */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-10 px-4 sm:px-0">
                <a
                  href="#schedule"
                  className="w-full sm:w-auto sm:min-w-[280px] min-h-[52px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                >
                  {t('salsaLadyV2CTA1')}
                </a>
                <a
                  href="#pillars"
                  className="w-full sm:w-auto sm:min-w-[280px] min-h-[52px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50"
                >
                  {t('salsaLadyV2CTA2')}
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 2. QUE ES LADY STYLE + BENEFICIOS ===== */}
        <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-b from-primary-dark/20 via-black to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 sm:mb-6 holographic-text">
                  {t('salsaLadyV2WhatIsTitle')}
                </h2>
                <p className="text-base sm:text-xl text-neutral/90 leading-relaxed mb-6 sm:mb-8">
                  {t('salsaLadyV2WhatIsDesc')}
                </p>

                {/* Focus Areas - Elegant flowing design */}
                <div className="relative mb-10 sm:mb-14">
                  {/* Decorative line */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-accent/30 to-transparent hidden md:block"></div>

                  <div className="flex flex-wrap justify-center gap-x-1 gap-y-3 sm:gap-x-2 sm:gap-y-4">
                    {[1, 2, 3, 4, 5, 6].map((idx, i) => (
                      <div
                        key={idx}
                        className="group relative"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className="relative px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-black/60 via-primary-dark/20 to-black/60 backdrop-blur-sm rounded-full border border-primary-accent/20 hover:border-primary-accent/60 transition-all duration-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] cursor-default">
                          <span className="text-neutral/90 text-sm sm:text-base font-medium tracking-wide group-hover:text-primary-accent transition-colors">
                            {t(`salsaLadyV2Focus${idx}`)}
                          </span>
                        </div>
                        {/* Subtle glow on hover */}
                        <div className="absolute inset-0 rounded-full bg-primary-accent/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quote Card */}
                <div className="max-w-3xl mx-auto">
                  <div className="relative p-6 sm:p-10 bg-gradient-to-br from-primary-accent/20 via-black/80 to-primary-dark/25 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-primary-accent/50 shadow-2xl">
                    <blockquote className="relative z-10">
                      <p className="text-neutral text-base sm:text-xl md:text-2xl italic leading-relaxed">
                        &ldquo;{t('salsaLadyV2Quote')}&rdquo;
                      </p>
                    </blockquote>
                    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4">
                      <img
                        src="/images/teachers/img/yunaisy-farray-directora_320.webp"
                        alt="Yunaisy Farray"
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-primary-accent object-cover"
                        loading="lazy"
                      />
                      <div className="text-left">
                        <cite className="not-italic font-bold text-neutral text-sm sm:text-base">
                          Yunaisy Farray
                        </cite>
                        <p className="text-primary-accent text-xs sm:text-sm">
                          Creadora del Método Farray
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 3. HORARIOS ===== */}
        <ScheduleSection
          id="schedule"
          titleKey="salsaLadyScheduleTitle"
          subtitleKey="salsaLadyScheduleSubtitle"
          schedules={schedules}
          t={t}
        />

        {/* ===== 4. NIVELES ===== */}
        <LevelCardsSection titleKey="salsaLadyLevelsTitle" levels={SALSA_LADY_STYLE_LEVELS} />

        {/* ===== 5. PROFESORAS ===== */}
        <section className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
                  {t('salsaLadyTeachersTitle')}
                </h2>
                <p className="text-neutral/70 mt-3 text-sm sm:text-lg">
                  {t('salsaLadyTeachersSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {teachers.map((teacher, index) => (
                <AnimateOnScroll key={teacher.name} delay={index * ANIMATION_DELAYS.STAGGER_SMALL}>
                  <div className="h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl p-5 sm:p-6 transition-all duration-500 hover:shadow-accent-glow">
                    <div className="flex flex-col items-center text-center">
                      {teacher.image ? (
                        <img
                          src={teacher.image}
                          alt={teacher.name}
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-primary-accent/50 mb-3 sm:mb-4 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-primary-accent/50 mb-3 sm:mb-4 bg-primary-dark/30 flex items-center justify-center">
                          <span className="text-3xl sm:text-4xl font-black text-primary-accent/50">
                            {teacher.initials}
                          </span>
                        </div>
                      )}
                      <h3 className="text-lg sm:text-xl font-bold text-neutral mb-1 sm:mb-2">
                        {teacher.name}
                      </h3>
                      <p className="text-primary-accent font-semibold text-sm sm:text-base mb-2 sm:mb-3">
                        {t(teacher.credentialKey)}
                      </p>
                      <p className="text-neutral/90 text-xs sm:text-sm leading-relaxed">
                        {t(teacher.bioKey)}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 6. PREPARATE PARA TU CLASE ===== */}
        <PrepareClassSection
          titleKey="salsaLadyPrepareTitle"
          subtitleKey="salsaLadyPrepareSubtitle"
          config={SALSA_LADY_STYLE_PREPARE_CONFIG}
        />

        {/* ===== 6b. POR QUE ELEGIR FARRAY'S - Premium Section ===== */}
        <section className="py-14 sm:py-20 md:py-28 bg-gradient-to-b from-black via-primary-dark/5 to-black relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-primary-accent/10 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border border-primary-accent/5 rounded-full"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-14">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('salsaLadyV2WhyFarrayTitle')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/60 max-w-2xl mx-auto">
                  {t('salsaLadyV2WhyFarraySubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Why Farray's Grid - 6 reasons */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((num, i) => (
                <AnimateOnScroll key={num} delay={i * ANIMATION_DELAYS.STAGGER_SMALL}>
                  <div className="group h-full p-5 sm:p-6 bg-black/40 backdrop-blur-sm rounded-2xl border border-neutral/10 hover:border-primary-accent/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                    <div className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary-accent/20 to-primary-accent/5 flex items-center justify-center text-primary-accent font-black text-lg sm:text-xl group-hover:from-primary-accent/30 group-hover:to-primary-accent/10 transition-colors">
                        {num}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-neutral mb-1.5 sm:mb-2 group-hover:text-primary-accent transition-colors">
                          {t(`salsaLadyV2WhyFarray${num}Title`)}
                        </h3>
                        <p className="text-neutral/60 text-sm sm:text-base leading-relaxed">
                          {t(`salsaLadyV2WhyFarray${num}Desc`)}
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ===== BLOQUE PERSUASIVO DIVIDER - Elegant & Exclusive ===== */}
        <section className="relative py-10 sm:py-14 overflow-hidden">
          {/* Background with subtle animation effect */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-accent/5 via-primary-accent/10 to-primary-accent/5"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-accent/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-accent/50 to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex items-center justify-center gap-4 sm:gap-8">
              {/* Left decorative element */}
              <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent to-primary-accent/40"></div>
              {/* Title */}
              <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-center holographic-text tracking-wide">
                {t('salsaLadyV2PersuasiveBlockTitle')}
              </h2>
              {/* Right decorative element */}
              <div className="hidden sm:block flex-1 h-px bg-gradient-to-l from-transparent to-primary-accent/40"></div>
            </div>
          </div>
        </section>

        {/* ===== 7. EL PROBLEMA (PAS Framework) - Elegant & Exclusive ===== */}
        <section className="py-14 sm:py-20 md:py-28 bg-black relative overflow-hidden">
          {/* Subtle background texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/5 via-transparent to-primary-dark/5"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 sm:mb-12 text-center holographic-text">
                  {t('salsaLadyV2ProblemTitle')}
                </h2>

                {/* Story paragraphs with elegant typography */}
                <div className="space-y-4 sm:space-y-6 mb-10 sm:mb-14 text-center">
                  <p className="text-base sm:text-xl text-neutral/80 leading-relaxed">
                    {t('salsaLadyV2ProblemP1')}
                  </p>
                  <p className="text-base sm:text-xl text-neutral/80 leading-relaxed">
                    {t('salsaLadyV2ProblemP2')}
                  </p>
                  <p className="text-base sm:text-xl text-neutral/80 leading-relaxed">
                    {t('salsaLadyV2ProblemP3')}
                  </p>

                  {/* Trigger question - Holographic */}
                  <div className="pt-4 sm:pt-6">
                    <p className="text-xl sm:text-3xl md:text-4xl font-black holographic-text">
                      {t('salsaLadyV2ProblemTrigger')}
                    </p>
                  </div>
                </div>

                {/* Pain Points - Elegant minimal cards */}
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-10 sm:mb-14">
                  {[1, 2, 3, 4].map((num, i) => (
                    <div
                      key={num}
                      className="group relative p-4 sm:p-5 bg-gradient-to-br from-neutral/5 to-transparent rounded-xl border border-neutral/10 hover:border-primary-accent/30 transition-all duration-500"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-neutral/20 flex items-center justify-center text-neutral/40 text-xs sm:text-sm font-bold group-hover:border-primary-accent/40 group-hover:text-primary-accent/60 transition-colors">
                          {num}
                        </span>
                        <p className="text-neutral/70 text-sm sm:text-base leading-relaxed group-hover:text-neutral/90 transition-colors">
                          {t(`salsaLadyV2Pain${num}`)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* The Solution Reveal - Premium 3D card */}
                <div className="relative group [perspective:1000px]">
                  {/* Glow effect - enhanced on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-accent/20 via-primary-accent/10 to-primary-accent/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500"></div>

                  <div className="relative bg-black/80 backdrop-blur-sm border border-primary-accent/30 rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-center [transform-style:preserve-3d] transition-all duration-500 group-hover:[transform:rotateX(2deg)_rotateY(-2deg)_translateZ(10px)] group-hover:border-primary-accent/60 group-hover:shadow-[0_25px_50px_-12px_rgba(212,175,55,0.25)]">
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-neutral mb-3 sm:mb-4 tracking-tight [transform:translateZ(20px)]">
                      {t('salsaLadyV2ProblemNotYou')}
                    </p>
                    <p className="text-base sm:text-xl md:text-2xl text-primary-accent font-semibold tracking-wide [transform:translateZ(30px)]">
                      {t('salsaLadyV2ProblemRealCause')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 8. EL METODO FARRAY (6 PILARES) ===== */}
        <section id="pillars" className="py-12 sm:py-16 md:py-24 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-3 sm:mb-4 holographic-text">
                  {t('salsaLadyV2PillarsTitle')}
                </h2>
                <p className="text-sm sm:text-lg text-neutral/70 max-w-2xl mx-auto">
                  {t('salsaLadyV2PillarsSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {technicalPillars.map((pillar, index) => (
                <AnimateOnScroll key={pillar.id} delay={index * ANIMATION_DELAYS.STAGGER_SMALL}>
                  <div className="group h-full p-5 sm:p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 hover:shadow-accent-glow hover:-translate-y-1 sm:hover:-translate-y-2">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors">
                        <PillarIcon
                          type={pillar.icon}
                          className="w-5 h-5 sm:w-6 sm:h-6 text-primary-accent"
                        />
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-primary-accent/50">
                        {index + 1}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral mb-1 sm:mb-2">
                      {t(`salsaLadyV2Pillar${index + 1}Title`)}
                    </h3>
                    <p className="text-xs sm:text-sm text-primary-accent italic mb-2 sm:mb-3">
                      {t(`salsaLadyV2Pillar${index + 1}Subtitle`)}
                    </p>
                    <p className="text-neutral/80 text-xs sm:text-sm mb-3 sm:mb-4">
                      {t(`salsaLadyV2Pillar${index + 1}Desc`)}
                    </p>
                    <ul className="space-y-1.5 sm:space-y-2">
                      {[1, 2, 3].map(item => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs sm:text-sm text-neutral/70"
                        >
                          <span className="text-primary-accent mt-0.5">-</span>
                          {t(`salsaLadyV2Pillar${index + 1}Item${item}`)}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-primary-accent italic">
                      {t(`salsaLadyV2Pillar${index + 1}Result`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 9. TABLA COMPARATIVA ===== */}
        <section className="py-12 sm:py-16 md:py-24 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-6 sm:mb-10">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-3 sm:mb-4 holographic-text">
                  {t('salsaLadyV2CompareTitle')}
                </h2>
              </div>

              <div className="w-full flex justify-center">
                <div className="w-full max-w-5xl overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm min-w-[500px] mx-auto">
                    <thead>
                      <tr className="border-b border-neutral/20">
                        <th className="text-left py-3 sm:py-4 px-3 sm:px-4 text-neutral/70 font-semibold">
                          {t('salsaLadyV2CompareAspect')}
                        </th>
                        <th className="text-center py-3 sm:py-4 px-3 sm:px-4 text-red-400 font-semibold">
                          {t('salsaLadyV2CompareOthers')}
                        </th>
                        <th className="text-center py-3 sm:py-4 px-3 sm:px-4 text-primary-accent font-semibold">
                          {t('salsaLadyV2CompareFarray')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((rowId, idx) => (
                        <tr
                          key={rowId}
                          className={`border-b border-neutral/10 ${idx % 2 === 0 ? 'bg-black/20' : ''}`}
                        >
                          <td className="py-3 sm:py-4 px-3 sm:px-4 text-neutral/90 font-medium">
                            {t(`salsaLadyV2CompareRow${rowId}Label`)}
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-4 text-center">
                            <span className="inline-flex items-center gap-1 text-red-400/70">
                              <XIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">
                                {t(`salsaLadyV2CompareRow${rowId}Others`)}
                              </span>
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-4 text-center bg-primary-accent/10">
                            <span className="inline-flex items-center gap-1 text-primary-accent">
                              <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">
                                {t(`salsaLadyV2CompareRow${rowId}Farray`)}
                              </span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 10. PARA QUIEN ES / NO ES - Exclusive Design ===== */}
        <section className="py-14 sm:py-20 md:py-28 bg-black relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-accent/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-14">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
                  {t('salsaLadyV2ForWhoTitle')}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto [perspective:1200px]">
                {/* SI es para ti - Premium 3D card */}
                <div className="relative group [perspective:1000px]">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-accent/30 to-primary-accent/10 rounded-2xl blur opacity-50 group-hover:opacity-90 transition-opacity duration-500"></div>
                  <div className="relative p-6 sm:p-8 bg-black/90 backdrop-blur-sm rounded-2xl border border-primary-accent/20 [transform-style:preserve-3d] transition-all duration-500 group-hover:[transform:rotateX(2deg)_rotateY(3deg)_translateZ(15px)] group-hover:border-primary-accent/50 group-hover:shadow-[0_30px_60px_-15px_rgba(212,175,55,0.3)]">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary-accent mb-6 sm:mb-8 tracking-tight [transform:translateZ(25px)]">
                      {t('salsaLadyV2ForYesTitle')}
                    </h3>
                    <ul className="space-y-3 sm:space-y-4 [transform:translateZ(15px)]">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <li key={num} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-accent/20 flex items-center justify-center mt-0.5">
                            <CheckIcon className="w-3 h-3 text-primary-accent" />
                          </span>
                          <span className="text-neutral/80 text-sm sm:text-base leading-relaxed">
                            {t(`salsaLadyV2ForYes${num}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* NO es para ti - Subtle card with subtle 3D */}
                <div className="relative group [perspective:1000px]">
                  <div className="relative p-6 sm:p-8 bg-neutral/5 backdrop-blur-sm rounded-2xl border border-neutral/10 [transform-style:preserve-3d] transition-all duration-500 group-hover:[transform:rotateX(-1deg)_rotateY(-2deg)] group-hover:border-neutral/20">
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral/50 mb-6 sm:mb-8 tracking-tight">
                      {t('salsaLadyV2ForNoTitle')}
                    </h3>
                    <ul className="space-y-3 sm:space-y-4">
                      {[1, 2, 3, 4].map(num => (
                        <li key={num} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-neutral/10 flex items-center justify-center mt-0.5">
                            <XIcon className="w-3 h-3 text-neutral/40" />
                          </span>
                          <span className="text-neutral/50 text-sm sm:text-base leading-relaxed">
                            {t(`salsaLadyV2ForNo${num}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* CTA - Elegant */}
              <div className="text-center mt-12 sm:mt-16">
                <p className="text-base sm:text-lg text-neutral/70 mb-6 sm:mb-8 max-w-xl mx-auto">
                  {t('salsaLadyV2ForWhoCTA')}
                </p>
                <a
                  href="#schedule"
                  className="inline-block bg-primary-accent text-white font-bold text-base sm:text-lg py-4 px-10 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('salsaLadyV2CTA1')}
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 11. TRANSFORMACION BEFORE/AFTER ===== */}
        <section className="py-12 sm:py-16 md:py-24 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-6 sm:mb-10">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-3 sm:mb-4 holographic-text">
                  {t('salsaLadyV2TransformTitle')}
                </h2>
              </div>

              <div className="w-full flex justify-center">
                <div className="w-full max-w-4xl overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm min-w-[400px] mx-auto">
                    <thead>
                      <tr className="border-b border-neutral/20">
                        <th className="text-left py-3 px-3 sm:px-4 text-neutral/70 font-semibold">
                          {t('salsaLadyV2TransformAspect')}
                        </th>
                        <th className="text-center py-3 px-3 sm:px-4 text-red-400/70 font-semibold">
                          {t('salsaLadyV2TransformBefore')}
                        </th>
                        <th className="text-center py-3 px-3 sm:px-4 text-primary-accent font-semibold">
                          {t('salsaLadyV2TransformAfter')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transformationItems.map((itemId, idx) => (
                        <tr
                          key={itemId}
                          className={`border-b border-neutral/10 ${idx % 2 === 0 ? 'bg-black/20' : ''}`}
                        >
                          <td className="py-3 px-3 sm:px-4 text-neutral/90 font-medium capitalize">
                            {t(`salsaLadyV2Transform${itemId}Label`)}
                          </td>
                          <td className="py-3 px-3 sm:px-4 text-center text-red-400/60 text-xs sm:text-sm">
                            {t(`salsaLadyV2Transform${itemId}Before`)}
                          </td>
                          <td className="py-3 px-3 sm:px-4 text-center text-primary-accent bg-primary-accent/10 text-xs sm:text-sm">
                            {t(`salsaLadyV2Transform${itemId}After`)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 12. VIDEO SECTION ===== */}
        <section className="py-12 sm:py-16 md:py-24 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-6 sm:mb-10">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tighter text-neutral mb-3 sm:mb-4 holographic-text">
                  {t('salsaLadyVideoTitle')}
                </h2>
              </div>
              <div className="max-w-4xl mx-auto">
                <YouTubeEmbed
                  videoId={SALSA_LADY_STYLE_VIDEO_ID}
                  title={t('salsaLadyVideoTitle')}
                />
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 13. TESTIMONIALS ===== */}
        <section className="py-12 sm:py-16 md:py-24 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-3 sm:mb-4 holographic-text">
                  {t('testimonialsNotRequested')}
                </h2>
                <div className="flex items-center justify-center gap-1 mb-2">
                  <StarRating size="lg" />
                </div>
                <div className="text-xs sm:text-sm text-neutral/70">
                  {t('basedOnReviews').replace('{count}', '505')}
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-7xl mx-auto">
              {salsaLadyTestimonials.map((testimonial, index) => (
                <AnimateOnScroll
                  key={testimonial.id}
                  delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                >
                  <div className="h-full p-4 bg-black/50 border border-primary-dark/50 rounded-xl hover:border-primary-accent transition-all duration-300">
                    <StarRating size="sm" />
                    <p className="text-neutral/90 text-xs sm:text-sm mt-3 mb-3 sm:mb-4 leading-relaxed">
                      &ldquo;{testimonial.quote[locale]}&rdquo;
                    </p>
                    <cite className="font-bold text-neutral not-italic text-xs sm:text-sm">
                      {testimonial.name}
                    </cite>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 14. FAQ SECTION ===== */}
        <FAQSection title={t('salsaLadyFaqTitle')} faqs={salsaLadyFaqs} pageUrl={pageUrl} />

        {/* ===== 15. LOCAL SEO ===== */}
        <section className="py-8 sm:py-10 md:py-14 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-black/30 rounded-2xl border border-neutral/20">
                <h3 className="text-lg sm:text-xl font-bold text-neutral mb-3 sm:mb-4">
                  {t('salsaLadyNearbyTitle')}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {SALSA_LADY_STYLE_NEARBY_AREAS.map((area, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                      <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-accent flex-shrink-0" />
                      <span className="text-neutral/80">
                        {area.name}: <span className="text-primary-accent">{area.time}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 16. FINAL CTA ===== */}
        <section className="py-12 sm:py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/20 via-black to-primary-dark/20"></div>
          <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-10"></div>
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 sm:mb-6 holographic-text">
                  {t('salsaLadyV2FinalCTATitle')}
                </h2>
                <p className="text-base sm:text-xl text-neutral/80 mb-6 sm:mb-8">
                  {t('salsaLadyV2FinalCTADesc')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                  <a
                    href="https://wa.me/34622247085"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto sm:min-w-[280px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 px-8 sm:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
                  >
                    {t('salsaLadyV2FinalCTA1')}
                  </a>
                  <a
                    href="#schedule"
                    className="w-full sm:w-auto sm:min-w-[280px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 px-8 sm:px-10 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50"
                  >
                    {t('salsaLadyV2FinalCTA2')}
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default SalsaLadyStylePageV2;
