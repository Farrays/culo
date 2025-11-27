import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import {
  REGGAETON_CUBANO_TESTIMONIALS,
  REGGAETON_CUBANO_FAQS_CONFIG,
  REGGAETON_CUBANO_SCHEDULE_KEYS,
  REGGAETON_CUBANO_VIDEO_ID,
} from '../constants/reggaeton-cubano';
import AnimateOnScroll from './AnimateOnScroll';
import CulturalHistorySection from './CulturalHistorySection';
import ScheduleSection from './ScheduleSection';
import FAQSection from './FAQSection';
import AnimatedCounter from './AnimatedCounter';
import YouTubeEmbed from './YouTubeEmbed';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from './SchemaMarkup';

const ReggaetonCubanoPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/reggaeton-cubano-barcelona`;

  // Schedule data - traducir las keys dinámicamente
  const schedules = REGGAETON_CUBANO_SCHEDULE_KEYS.map(schedule => ({
    ...schedule,
    day: t(schedule.dayKey),
    level: t(schedule.levelKey),
  }));

  // FAQs - traducir las keys dinámicamente desde constants
  const rcbFaqs = REGGAETON_CUBANO_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Testimonials - usar desde constants
  const rcbTestimonials = REGGAETON_CUBANO_TESTIMONIALS;

  // Schema Markup data for reviews
  const reviewsSchemaData = rcbTestimonials.map(testimonial => ({
    itemReviewed: { name: "Clases de Reggaeton Cubano - Farray's Center", type: 'Course' },
    author: testimonial.name,
    reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
    reviewBody: testimonial.quote[locale],
    datePublished: '2025-01-01',
  }));

  // VideoObject Schema
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: t('rcbVideoTitle'),
    description: t('rcbVideoDesc'),
    thumbnailUrl: `https://img.youtube.com/vi/${REGGAETON_CUBANO_VIDEO_ID}/maxresdefault.jpg`,
    uploadDate: '2025-01-01',
    contentUrl: `https://www.youtube.com/watch?v=${REGGAETON_CUBANO_VIDEO_ID}`,
    embedUrl: `https://www.youtube.com/embed/${REGGAETON_CUBANO_VIDEO_ID}`,
  };

  // BreadcrumbList Schema (JSON-LD)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('rcbBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('rcbBreadcrumbClasses'),
        item: `${baseUrl}/${locale}/clases`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('rcbBreadcrumbUrban'),
        item: `${baseUrl}/${locale}/clases/danzas-urbanas-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('rcbBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('rcbBreadcrumbHome'), url: `/${locale}` },
    { name: t('rcbBreadcrumbClasses'), url: `/${locale}/clases` },
    { name: t('rcbBreadcrumbUrban'), url: `/${locale}/clases/danzas-urbanas-barcelona` },
    {
      name: t('rcbBreadcrumbCurrent'),
      url: `/${locale}/clases/reggaeton-cubano-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('rcbPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('rcbMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${t('rcbPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('rcbMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-reggaeton-cubano.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('rcbPageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('rcbMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-reggaeton-cubano.jpg`} />
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
        name="Farray's International Dance Center - Clases de Reggaeton Cubano"
        description={t('rcbMetaDescription')}
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
        name={t('rcbCourseSchemaName')}
        description={t('rcbCourseSchemaDesc')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner, Intermediate, Advanced"
        teaches="Reggaeton Cubano, Reparto, Cubatón, disociación corporal, improvisación"
        coursePrerequisites="Ninguno"
        numberOfLessons="3 clases semanales"
        timeRequired="PT1H"
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName="Clases de Reggaeton Cubano en Barcelona - Farray's Center"
        itemType="Course"
      />

      <div className="pt-20 md:pt-24">
        {/* HERO Section */}
        <section
          id="rcb-hero"
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
                {t('rcbHeroTitle')}
              </h1>
              <p className="text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('rcbHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 mb-6 leading-relaxed">
                {t('rcbHeroDesc')}
              </p>
              <p className="text-lg md:text-xl text-neutral/90 italic mb-12">
                {t('rcbHeroLocation')}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
                <div className="w-full sm:w-auto">
                  <a
                    href="#contact"
                    className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center"
                  >
                    {t('rcbCTA1')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('rcbCTA1Subtext')}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#trial"
                    className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center"
                  >
                    {t('rcbCTA2')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('rcbCTA2Subtext')}</p>
                </div>
              </div>

              {/* Key Stats */}
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

                  {/* 100% Sabor Cubano */}
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
                        {t('rcbAuthenticGuaranteed')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* What is Reggaeton Cubano Section */}
        <section className="py-20 md:py-32 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text">
                  {t('rcbWhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p className="text-xl font-semibold holographic-text">{t('rcbWhatIsP1')}</p>
                    <p>{t('rcbWhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('rcbWhatIsP3')}</p>
                    <p>{t('rcbWhatIsP4')}</p>
                    <p className="text-center text-2xl font-bold mt-8 holographic-text">
                      {t('rcbWhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-xl font-semibold">
                      {t('rcbWhatIsQuestionAnswer')}
                    </p>
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg">
                    <picture>
                      <source
                        srcSet="/images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_640.webp 640w, /images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_960.webp 960w, /images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_1440.webp 1440w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        type="image/webp"
                      />
                      <source
                        srcSet="/images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_640.jpg 640w, /images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_960.jpg 960w, /images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_1440.jpg 1440w"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        type="image/jpeg"
                      />
                      <img
                        src="/images/classes/reggaeton-cubano/img/clases-reggaeton-cubano-barcelona_960.jpg"
                        alt="Clases de Reggaeton Cubano en Barcelona - Estudiantes bailando en la academia"
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

        {/* Cultural History - Expandable */}
        <CulturalHistorySection
          titleKey=""
          shortDescKey="rcbCulturalShort"
          fullHistoryKey="rcbCulturalFull"
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
                  {t('rcbIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {[1, 2, 3, 4, 5].map((num, index) => (
                <AnimateOnScroll key={num} delay={index * 100} className="[perspective:1000px]">
                  <div className="group relative h-full flex items-start gap-4 p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
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
                    <p className="text-neutral/90 leading-relaxed">{t(`rcbIdentify${num}`)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
              <AnimateOnScroll delay={500} className="[perspective:1000px]">
                <div className="group relative h-full flex items-start gap-4 p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
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
                  <p className="text-neutral/90 leading-relaxed">{t('rcbIdentify6')}</p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Necesitas apuntarte Section */}
        <section className="py-20 md:py-32 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            {/* Texto de transición pequeño */}
            <AnimateOnScroll>
              <div className="text-center mb-8">
                <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                  {t('rcbIdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('rcbNeedEnrollTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <p className="text-xl font-semibold holographic-text">{t('rcbIdentifyAgitate1')}</p>
                <p className="text-lg text-neutral/90">{t('rcbIdentifySolution')}</p>
                <p className="text-xl text-neutral/90 italic">{t('rcbIdentifyClosing')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Transformation Section */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('rcbTransformTitle')}
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
                      {t(`rcbTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed">{t(`rcbTransform${num}Desc`)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
              <AnimateOnScroll delay={500} className="[perspective:1000px]">
                <div className="group h-full p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="text-6xl font-black text-primary-accent mb-4 holographic-text">
                    6
                  </div>
                  <h3 className="text-xl font-bold text-neutral mb-3">{t('rcbTransform6Title')}</h3>
                  <p className="text-neutral/90 leading-relaxed">{t('rcbTransform6Desc')}</p>
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
                  {t('rcbTransformCTA')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
              {[1, 7, 2, 3, 4, 5, 6].map((num, index, arr) => (
                <AnimateOnScroll
                  key={num}
                  delay={index * 100}
                  className={`[perspective:1000px] ${index === arr.length - 1 ? 'lg:col-start-2' : ''}`}
                >
                  <div className="group h-full p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
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
                          {t(`rcbWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-sm leading-relaxed">
                          {t(`rcbWhyChoose${num}Desc`)}
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

        {/* Logos Section */}
        <section className="py-16 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('rcbLogosTitle')}
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
                  {t('rcbLogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Teacher Section - Charlie Breezy & Alejandro Miñoso */}
        <section id="teachers" className="py-20 md:py-32 bg-black relative overflow-hidden">
          {/* Cuba Flag Colors Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-red-600/20 to-blue-600/30"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
                  {t('rcbTeachersTitle')}
                </h2>
                <p className="text-xl text-neutral/70 mt-4">{t('rcbTeachersSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Charlie Breezy */}
              <AnimateOnScroll delay={100} className="[perspective:1000px]">
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-6">
                      <picture>
                        <source
                          srcSet="/images/teachers/img/profesor-charlie-breezy_320.webp 320w, /images/teachers/img/profesor-charlie-breezy_640.webp 640w"
                          sizes="160px"
                          type="image/webp"
                        />
                        <img
                          src="/images/teachers/img/profesor-charlie-breezy_640.jpg"
                          alt="Charlie Breezy - Profesor de Reggaeton Cubano y Reparto"
                          width="160"
                          height="160"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </picture>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-2">{t('rcbTeacher1Name')}</h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('rcbTeacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">{t('rcbTeacher1Bio')}</p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Alejandro Miñoso */}
              <AnimateOnScroll delay={200} className="[perspective:1000px]">
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-6 bg-gradient-to-br from-primary-dark/50 to-black flex items-center justify-center">
                      {/* Placeholder - add photo later */}
                      <svg
                        className="w-20 h-20 text-primary-accent/50"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-2">{t('rcbTeacher2Name')}</h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('rcbTeacher2Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed text-sm">{t('rcbTeacher2Bio')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-lg text-neutral/90 mt-12 max-w-2xl mx-auto">
                {t('rcbTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Schedule */}
        <ScheduleSection
          titleKey="rcbScheduleTitle"
          subtitleKey="rcbScheduleSubtitle"
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
              {rcbTestimonials.map((testimonial, index) => (
                <AnimateOnScroll key={testimonial.id} delay={index * 100}>
                  <div className="flex flex-col h-full p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2">
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
                  {t('rcbVideoTitle')}
                </h2>
                <p className="text-lg text-neutral/70">{t('rcbVideoDesc')}</p>
              </div>
            </AnimateOnScroll>

            {/* Video centrado */}
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={100}>
                <YouTubeEmbed
                  videoId={REGGAETON_CUBANO_VIDEO_ID}
                  title="Clases de Reggaeton Cubano en Barcelona - Farray's Center"
                />
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
                  {t('rcbWhyTodayFullTitle')}
                </h2>
                <p className="text-xl text-neutral/90">{t('rcbWhyToday1')}</p>
                <p className="text-xl text-neutral/90">{t('rcbWhyToday2')}</p>
                <p className="text-xl text-neutral/90">{t('rcbWhyToday3')}</p>
                <p className="text-2xl font-bold holographic-text mt-8">
                  {t('rcbWhyTodayClosing1')}
                </p>
                <p className="text-lg text-neutral/90 italic">{t('rcbWhyTodayClosing2')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="final-cta" className="relative py-20 md:py-32 overflow-hidden">
          {/* Background like Hero */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('rcbFinalCTATitle')}
                </h2>
                <p className="text-2xl font-bold mb-6 holographic-text">
                  {t('rcbFinalCTASubtitle')}
                </p>
                <p className="text-xl text-neutral/90 mb-8 leading-relaxed">
                  {t('rcbFinalCTADesc')}
                </p>
                <p className="text-lg text-neutral/90 mb-10 italic">{t('rcbFinalCTAFunny')}</p>

                {/* CTA Final */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                  <div className="w-full sm:w-auto">
                    <a
                      href="#contact"
                      className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center"
                    >
                      {t('rcbCTA1')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('rcbCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#trial"
                      className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center"
                    >
                      {t('rcbCTA2')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('rcbCTA2Subtext')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FAQ */}
        <FAQSection title={t('rcbFaqTitle')} faqs={rcbFaqs} pageUrl={pageUrl} />
      </div>
    </>
  );
};

export default ReggaetonCubanoPage;
