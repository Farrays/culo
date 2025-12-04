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

      <div className="pt-20 md:pt-24">
        {/* HERO Section - Without background image (like home) */}
        <section
          id="dancehall-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text">
                {t('dhV3HeroTitle')}
              </h1>
              <p className="text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('dhV3HeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 mb-6 leading-relaxed">
                {t('dhV3HeroDesc')}
              </p>
              <p className="text-lg md:text-xl text-neutral/90 italic mb-12">
                {t('dhV3HeroLocation')}
              </p>

              {/* CTA Buttons: Date de Alta + Prueba Clase */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
                <div className="w-full sm:w-auto">
                  <a
                    href="#contact"
                    className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center"
                  >
                    {t('dhV3CTA1')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('dhV3CTA1Subtext')}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#trial"
                    className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center"
                  >
                    {t('dhV3CTA2')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('dhV3CTA2Subtext')}</p>
                </div>
              </div>

              {/* Key Stats - Lo que obtienes en cada clase */}
              <div className="mt-16">
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 max-w-4xl mx-auto">
                  {/* 60 Minutos */}
                  <AnimateOnScroll delay={0}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <svg
                          className="w-10 h-10 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
                        </svg>
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
                  <AnimateOnScroll delay={100}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <svg
                          className="w-10 h-10 text-primary-accent"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2c1.5 2.5 3 5.5 3 8.5 0 3.5-2.5 6.5-6 6.5s-6-3-6-6.5c0-3 1.5-6 3-8.5 0 3 1.5 5 3 5s3-2 3-5zm0 15c2.21 0 4-1.79 4-4 0-1.5-1-3.5-2-5-.5 1.5-1.5 2.5-2 2.5s-1.5-1-2-2.5c-1 1.5-2 3.5-2 5 0 2.21 1.79 4 4 4z" />
                        </svg>
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

                  {/* 100% Diversión */}
                  <AnimateOnScroll delay={200}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <svg
                          className="w-10 h-10 text-primary-accent"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.7-6.3 4.7 2.3-7-6-4.6h7.6z" />
                        </svg>
                      </div>
                      <AnimatedCounter
                        target={100}
                        suffix="%"
                        className="text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-sm md:text-base text-neutral/90 font-semibold">
                        {t('funGuaranteed')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* What is Dancehall Section */}
        <section className="py-20 md:py-32 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text">
                  {t('dhV3WhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p className="text-xl font-semibold holographic-text">{t('dhV3WhatIsP1')}</p>
                    <p>{t('dhV3WhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('dhV3WhatIsP3')}</p>
                    <p>{t('dhV3WhatIsP4')}</p>
                    <p className="text-center text-2xl font-bold mt-8 holographic-text">
                      {t('dhV3WhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-xl font-semibold">
                      {t('dhV3WhatIsQuestionAnswer')}
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                      src="/images/classes/dancehall/img/dancehall-classes-barcelona-01_960.webp"
                      alt="Clases de Dancehall en Barcelona - Estudiantes bailando en la academia"
                      width="960"
                      height="640"
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Cultural History - Expandable (without title) */}
        <CulturalHistorySection
          titleKey=""
          shortDescKey="dhV3CulturalShort"
          fullHistoryKey="dhV3CulturalFull"
          readMoreText={t('readMore')}
          readLessText={t('readLess')}
          t={t}
        />

        {/* Identification Section - ¿Te identificas? */}
        <section className="pt-8 pb-16 md:pt-12 md:pb-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('dhV3IdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <AnimateOnScroll key={num} delay={index * 100} className="[perspective:1000px]">
                  <div className="group relative h-full min-h-[100px] flex items-start gap-4 p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                      <svg
                        className="w-5 h-5 text-primary-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-neutral/90 leading-relaxed">{t(`dhV3Identify${num}`)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
              <AnimateOnScroll delay={500} className="[perspective:1000px]">
                <div className="group relative h-full min-h-[100px] flex items-start gap-4 p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                    <svg
                      className="w-5 h-5 text-primary-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-neutral/90 leading-relaxed">{t('dhV3Identify6')}</p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Nueva Sección - Necesitas apuntarte */}
        <section className="py-20 md:py-32 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            {/* Texto de transición pequeño */}
            <AnimateOnScroll>
              <div className="text-center mb-8">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('dhV3IdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('dhV3NeedEnrollTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <p className="text-xl font-semibold holographic-text">
                  {t('dhV3IdentifyAgitate1')}
                </p>
                <p className="text-lg text-neutral/90">{t('dhV3IdentifySolution')}</p>
                <p className="text-xl text-neutral/90 italic">{t('dhV3IdentifyClosing')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Transformation Section - Imagina tu antes y después */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('dhV3TransformTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <AnimateOnScroll key={num} delay={index * 100} className="[perspective:1000px]">
                  <div className="group h-full p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="text-6xl font-black text-primary-accent mb-4 holographic-text">
                      {num}
                    </div>
                    <h3 className="text-xl font-bold text-neutral mb-3">
                      {t(`dhV3Transform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed">
                      {t(`dhV3Transform${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
              <AnimateOnScroll delay={500} className="[perspective:1000px]">
                <div className="group h-full p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="text-6xl font-black text-primary-accent mb-4 holographic-text">
                    6
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">
                    {t('dhV3Transform6Title')}
                  </h3>
                  <p className="text-neutral/90 leading-relaxed">{t('dhV3Transform6Desc')}</p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Why Choose Farray's Section */}
        <section className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('dhV3TransformCTA')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll key={num} delay={index * 100} className="[perspective:1000px]">
                  <div className="group h-full min-h-[120px] p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-primary-accent"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral mb-2">
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
              <AnimateOnScroll delay={500} className="[perspective:1000px] md:col-start-2">
                <div className="group h-full min-h-[120px] p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                      <svg
                        className="w-6 h-6 text-primary-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral mb-2">
                        {t(`dhV3WhyChoose${7}Title`)}
                      </h3>
                      <p className="text-neutral/90 text-sm leading-relaxed">
                        {t(`dhV3WhyChoose${7}Desc`)}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
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
                  {t('dhV3LogosTitle')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto items-center mb-8">
                  <div className="flex flex-col items-center gap-3 p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105">
                    <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded-lg">
                      <img
                        src="/images/cid-unesco-logo.webp"
                        alt="CID UNESCO - Consejo Internacional de la Danza"
                        width="80"
                        height="80"
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
                        width="80"
                        height="80"
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
                        width="80"
                        height="80"
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
                        width="80"
                        height="80"
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-neutral/90 font-bold text-sm text-center">TV 5</div>
                  </div>
                </div>
                <p className="text-4xl md:text-5xl font-black tracking-tighter holographic-text">
                  {t('dhV3LogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Teachers Section - REAL */}
        <section id="teachers" className="py-20 md:py-32 bg-black relative overflow-hidden">
          {/* Jamaica Flag Background */}
          <div className="absolute inset-0 opacity-30">
            <img
              src="/images/classes/dancehall/raw/Jamaica.webp"
              alt="Bandera de Jamaica - Origen del Dancehall"
              width="1920"
              height="1080"
              loading="lazy"
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.9)' }}
            />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
                  {t('dhV3TeachersTitle')}
                </h2>
                <p className="text-xl text-neutral/70 mt-4">{t('dhV3TeachersSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <AnimateOnScroll delay={100} className="[perspective:1000px]">
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-6 bg-gradient-to-br from-primary-accent/30 to-primary-dark/50 flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-primary-accent/60"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-2">Isabel López</h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('dhV3Teacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed">{t('dhV3Teacher1Bio')}</p>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200} className="[perspective:1000px]">
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-6 bg-gradient-to-br from-primary-accent/30 to-primary-dark/50 flex items-center justify-center">
                      <svg
                        className="w-24 h-24 text-primary-accent/60"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-2">Sandra Gómez</h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('dhV3Teacher2Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed">{t('dhV3Teacher2Bio')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-lg text-neutral/90 mt-12 max-w-2xl mx-auto">
                {t('dhV3TeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Schedule */}
        <ScheduleSection
          titleKey="dhV3ScheduleTitle"
          subtitleKey="dhV3ScheduleSubtitle"
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
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-8 h-8 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm text-neutral/70">
                    {t('basedOnReviews').replace('{count}', '505')}
                  </div>
                  <div className="mt-2 text-xs text-neutral/50">Google</div>
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {dancehallTestimonials.map((testimonial, index) => (
                <AnimateOnScroll key={testimonial.id} delay={index * 100}>
                  <div className="flex flex-col h-full min-h-[180px] p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2">
                    <div className="flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
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
                  {t('dhV3VideoTitle')}
                </h2>
                <p className="text-lg text-neutral/70">{t('dhV3VideoDesc')}</p>
              </div>
            </AnimateOnScroll>

            {/* Videos Grid - 3 horizontales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              <AnimateOnScroll delay={100}>
                <YouTubeEmbed
                  videoId="TteV2if6Qso"
                  title="Clases de Dancehall en Barcelona - Farray's Center"
                />
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <div className="aspect-video rounded-2xl overflow-hidden border-2 border-primary-accent/50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-6">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-primary-accent/50"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    <p className="text-neutral/70 font-semibold">Video próximamente</p>
                  </div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <div className="aspect-video rounded-2xl overflow-hidden border-2 border-primary-accent/50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center p-6">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-primary-accent/50"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    <p className="text-neutral/70 font-semibold">Video próximamente</p>
                  </div>
                </div>
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
                  {t('dhV3WhyTodayFullTitle')}
                </h2>
                <p className="text-xl text-neutral/90">{t('dhV3WhyToday1')}</p>
                <p className="text-xl text-neutral/90">{t('dhV3WhyToday2')}</p>
                <p className="text-xl text-neutral/90">{t('dhV3WhyToday3')}</p>
                <p className="text-2xl font-bold holographic-text mt-8">
                  {t('dhV3WhyTodayClosing1')}
                </p>
                <p className="text-lg text-neutral/90 italic">{t('dhV3WhyTodayClosing2')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="final-cta" className="relative pt-12 pb-20 md:pt-16 md:pb-32 overflow-hidden">
          {/* Background like Hero */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('dhV3FinalCTATitle')}
                </h2>
                <p className="text-2xl font-bold mb-6 holographic-text">
                  {t('dhV3FinalCTASubtitle')}
                </p>
                <p className="text-xl text-neutral/90 mb-8 leading-relaxed">
                  {t('dhV3FinalCTADesc')}
                </p>
                <p className="text-lg text-neutral/90 mb-10 italic">{t('dhV3FinalCTAFunny')}</p>

                {/* CTA Final: Date de Alta + Prueba Clase */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                  <div className="w-full sm:w-auto">
                    <a
                      href="#contact"
                      className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center"
                    >
                      {t('dhV3CTA1')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('dhV3CTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#trial"
                      className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center"
                    >
                      {t('dhV3CTA2')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('dhV3CTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection title={t('dhV3FaqTitle')} faqs={dancehallV3Faqs} pageUrl={pageUrl} />
      </div>
    </>
  );
};

export default DancehallPage;
