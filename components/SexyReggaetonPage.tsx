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

      <div className="pt-20 md:pt-24">
        {/* HERO Section - Without background image (like home) */}
        <section
          id="sxr-hero"
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
                {t('sxrHeroTitle')}
              </h1>
              <p className="text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t('sxrHeroSubtitle')}
              </p>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 mb-6 leading-relaxed">
                {t('sxrHeroDesc')}
              </p>
              <p className="text-lg md:text-xl text-neutral/90 italic mb-12">
                {t('sxrHeroLocation')}
              </p>

              {/* CTA Buttons: Date de Alta + Prueba Clase */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-label={t('sxrCTA1AriaLabel')}
                    className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center"
                  >
                    {t('sxrCTA1')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('sxrCTA1Subtext')}</p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-label={t('sxrCTA2AriaLabel')}
                    className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center"
                  >
                    {t('sxrCTA2')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">{t('sxrCTA2Subtext')}</p>
                </div>
              </div>

              {/* Key Stats - Lo que obtienes en cada clase */}
              <div className="mt-16">
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 max-w-4xl mx-auto">
                  {/* 60 Minutos */}
                  <AnimateOnScroll delay={0}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <ClockIcon className="w-10 h-10 text-primary-accent" size="lg" />
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
                        <FlameIcon className="w-10 h-10 text-primary-accent" size="lg" />
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

                  {/* 100% Sensualidad */}
                  <AnimateOnScroll delay={200}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <HeartIcon className="w-10 h-10 text-primary-accent" size="lg" />
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
        <section className="py-20 md:py-32 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text">
                  {t('sxrWhatIsTitle')}
                </h2>
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p className="text-xl font-semibold holographic-text">{t('sxrWhatIsP1')}</p>
                    <p>{t('sxrWhatIsP2')}</p>
                    <p className="italic font-medium text-neutral">{t('sxrWhatIsP3')}</p>
                    <p>{t('sxrWhatIsP4')}</p>
                    <p className="text-center text-2xl font-bold mt-8 holographic-text">
                      {t('sxrWhatIsQuestionTitle')}
                    </p>
                    <p className="text-center text-xl font-semibold">
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

        {/* Cultural History - Expandable (without title) */}
        <CulturalHistorySection
          titleKey=""
          shortDescKey="sxrCulturalShort"
          fullHistoryKey="sxrCulturalFull"
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
                  {t('sxrIdentifyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll key={num} delay={index * 100} className="[perspective:1000px]">
                  <div className="group relative h-full min-h-[100px] flex items-start gap-4 p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                      <CheckIcon className="text-primary-accent" size="sm" />
                    </div>
                    <p className="text-neutral/90 leading-relaxed">{t(`sxrIdentify${num}`)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
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
                  {t('sxrIdentifyTransition')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('sxrNeedEnrollTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <p className="text-xl font-semibold holographic-text">{t('sxrIdentifyAgitate1')}</p>
                <p className="text-lg text-neutral/90">{t('sxrIdentifySolution')}</p>
                <p className="text-xl text-neutral/90 italic">{t('sxrIdentifyClosing')}</p>
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
                  {t('sxrTransformTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll key={num} delay={index * 100} className="[perspective:1000px]">
                  <div className="group h-full p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="text-6xl font-black text-primary-accent mb-4 holographic-text">
                      {num}
                    </div>
                    <h3 className="text-xl font-bold text-neutral mb-3">
                      {t(`sxrTransform${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed">{t(`sxrTransform${num}Desc`)}</p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Farray's Section */}
        <section className="py-20 md:py-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('sxrTransformCTA')}
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
                  <div className="group h-full min-h-[120px] p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <CheckCircleIcon className="text-primary-accent" size="md" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-neutral mb-2">
                          {t(`sxrWhyChoose${num}Title`)}
                        </h3>
                        <p className="text-neutral/90 text-sm leading-relaxed">
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
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto">
                <div className="text-center">
                  <AnimatedCounter
                    target={8}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm md:text-base text-neutral/90 font-semibold uppercase tracking-wide">
                    {t('yearsExperience')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={1500}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm md:text-base text-neutral/90 font-semibold uppercase tracking-wide">
                    {t('activeStudents')}
                  </p>
                </div>
                <div className="text-center">
                  <AnimatedCounter
                    target={15000}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm md:text-base text-neutral/90 font-semibold uppercase tracking-wide">
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
                  {t('sxrLogosTitle')}
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
                  {t('sxrLogosIntlFestivalsText')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Teacher Section - Yasmina Fernández */}
        <section id="teachers" className="py-20 md:py-32 bg-black relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
                  {t('sxrTeachersTitle')}
                </h2>
                <p className="text-xl text-neutral/70 mt-4">{t('sxrTeachersSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-2xl mx-auto">
              <AnimateOnScroll delay={100} className="[perspective:1000px]">
                <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-6">
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
                    <h3 className="text-2xl font-bold text-neutral mb-2">Yasmina Fernández</h3>
                    <p className="text-primary-accent font-semibold mb-4">
                      {t('sxrTeacher1Specialty')}
                    </p>
                    <p className="text-neutral/90 leading-relaxed">{t('sxrTeacher1Bio')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll>
              <p className="text-center text-lg text-neutral/90 mt-12 max-w-2xl mx-auto">
                {t('sxrTeachersClosing')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Schedule */}
        <ScheduleSection
          titleKey="sxrScheduleTitle"
          subtitleKey="sxrScheduleSubtitle"
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
                    <StarRating count={5} size="lg" label="5 de 5 estrellas" />
                  </div>
                  <div className="text-sm text-neutral/70">
                    {t('basedOnReviews').replace('{count}', '505')}
                  </div>
                  <div className="mt-2 text-xs text-neutral/50">Google</div>
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {sxrTestimonials.map((testimonial, index) => (
                <AnimateOnScroll key={testimonial.id} delay={index * 100}>
                  <div className="flex flex-col h-full min-h-[180px] p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl shadow-lg transition-all duration-300 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-2">
                    <div className="mb-3">
                      <StarRating count={5} size="sm" label="5 de 5 estrellas" />
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
                  {t('sxrVideoTitle')}
                </h2>
                <p className="text-lg text-neutral/70">{t('sxrVideoDesc')}</p>
              </div>
            </AnimateOnScroll>

            {/* Video centrado */}
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={100}>
                <YouTubeEmbed videoId="J5SI4u1SVsg" title={t('sxrVideoTitle')} />
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
                  {t('sxrWhyTodayFullTitle')}
                </h2>
                <p className="text-xl text-neutral/90">{t('sxrWhyToday1')}</p>
                <p className="text-xl text-neutral/90">{t('sxrWhyToday2')}</p>
                <p className="text-xl text-neutral/90">{t('sxrWhyToday3')}</p>
                <p className="text-2xl font-bold holographic-text mt-8">
                  {t('sxrWhyTodayClosing1')}
                </p>
                <p className="text-lg text-neutral/90 italic">{t('sxrWhyTodayClosing2')}</p>
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
                  {t('sxrFinalCTATitle')}
                </h2>
                <p className="text-2xl font-bold mb-6 holographic-text">
                  {t('sxrFinalCTASubtitle')}
                </p>
                <p className="text-xl text-neutral/90 mb-8 leading-relaxed">
                  {t('sxrFinalCTADesc')}
                </p>
                <p className="text-lg text-neutral/90 mb-10 italic">{t('sxrFinalCTAFunny')}</p>

                {/* CTA Final: Date de Alta + Prueba Clase */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-label={t('sxrCTA1AriaLabel')}
                      className="block w-full sm:w-auto bg-primary-accent text-white font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center"
                    >
                      {t('sxrCTA1')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('sxrCTA1Subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      aria-label={t('sxrCTA2AriaLabel')}
                      className="block w-full sm:w-auto border-2 border-neutral text-neutral font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center"
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

        {/* FAQ */}
        <FAQSection title={t('sxrFaqTitle')} faqs={sxrFaqs} pageUrl={pageUrl} />
      </div>
    </>
  );
};

export default SexyReggaetonPage;
