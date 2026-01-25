import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import LeadCaptureModal from './shared/LeadCaptureModal';

// Iconos para los pilares
const PillarIcons: Record<string, React.FC<{ className?: string }>> = {
  discipline: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  rhythm: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
      />
    </svg>
  ),
  innovation: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
};

const MetodoFarrayPage: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;
  const baseUrl = 'https://www.farrayscenter.com';
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('metodoFarray_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('metodoFarray_breadcrumb_current'),
        item: `${baseUrl}/${locale}/metodo-farray`,
      },
    ],
  };

  // Schema Markup - Course
  const courseSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: t('schema_metodoFarray_name'),
    description: t('metodoFarray_meta_description'),
    provider: {
      '@type': 'EducationalOrganization',
      name: "Farray's International Dance Center",
      sameAs: 'https://www.farrayscenter.com',
    },
    educationalCredentialAwarded: t('schema_metodoFarray_credential'),
    teaches: [
      t('schema_metodoFarray_teaches1'),
      t('schema_metodoFarray_teaches2'),
      t('schema_metodoFarray_teaches3'),
    ],
  };

  // Schema Markup - EducationalOccupationalCredential (Enterprise GEO)
  const credentialSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: t('schema_metodoFarray_name'),
    description: t('schema_metodoFarray_credentialDesc'),
    credentialCategory: 'Certificate',
    recognizedBy: {
      '@type': 'Organization',
      name: 'CID-UNESCO',
      url: 'https://cid-world.org/',
    },
    educationalLevel: t('schema_metodoFarray_educationalLevel'),
    competencyRequired: [
      t('schema_metodoFarray_competency1'),
      t('schema_metodoFarray_competency2'),
      t('schema_metodoFarray_competency3'),
    ],
  };

  // Schema Markup - SpeakableSpecification (Voice Search Optimization)
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('metodoFarray_page_title'),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#answer-capsule-metodo', '.metodo-origin-quote', '.metodo-adaptation-title'],
    },
    mainEntity: {
      '@type': 'EducationalOccupationalCredential',
      name: t('schema_metodoFarray_name'),
    },
  };

  const breadcrumbItems = [
    { name: t('metodoFarray_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('metodoFarray_breadcrumb_current'),
      url: `/${locale}/metodo-farray`,
      isActive: true,
    },
  ];

  const pillars = [
    {
      icon: 'discipline',
      titleKey: 'metodoFarray_pillar1_title',
      descKey: 'metodoFarray_pillar1_desc',
      originKey: 'metodoFarray_pillar1_origin',
    },
    {
      icon: 'rhythm',
      titleKey: 'metodoFarray_pillar2_title',
      descKey: 'metodoFarray_pillar2_desc',
      originKey: 'metodoFarray_pillar2_origin',
    },
    {
      icon: 'innovation',
      titleKey: 'metodoFarray_pillar3_title',
      descKey: 'metodoFarray_pillar3_desc',
      originKey: 'metodoFarray_pillar3_origin',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('metodoFarray_page_title')} | Farray&apos;s Center</title>
        <meta name="description" content={t('metodoFarray_meta_description')} />
        <link rel="canonical" href={`${baseUrl}/${locale}/metodo-farray`} />
        <meta
          property="og:title"
          content={`${t('metodoFarray_page_title')} | Farray&apos;s Center`}
        />
        <meta property="og:description" content={t('metodoFarray_meta_description')} />
        <meta property="og:url" content={`${baseUrl}/${locale}/metodo-farray`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-yunaisy-farray.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('metodoFarray_page_title')} | Farray's Center`} />
        <meta name="twitter:description" content={t('metodoFarray_meta_description')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-yunaisy-farray.jpg`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(credentialSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(speakableSchema)}</script>
      </Helmet>

      <div className="pt-16 md:pt-20">
        {/* SECCIÓN 1: HERO PREMIUM */}
        <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Background - Enterprise pattern */}
          <div className="absolute inset-0 bg-black">
            {/* Hero background image - Full opacity for maximum visual impact */}
            <div className="absolute inset-0" style={{ opacity: 1 }}>
              <picture>
                <source srcSet="/images/optimized/foto4.webp" type="image/webp" />
                <img
                  src="/images/optimized/foto4.jpg"
                  alt={t('metodo_hero_image_alt')}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 40%' }}
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </div>
            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-transparent to-black/50"></div>
          </div>

          {/* Glow decorativo */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-accent/20 rounded-full blur-[150px] pointer-events-none" />

          <div className="relative z-20 container mx-auto px-4 sm:px-6 text-center">
            <AnimateOnScroll>
              <Breadcrumb items={breadcrumbItems} textColor="text-neutral/60" />
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <span className="inline-block px-4 py-2 bg-primary-accent/20 backdrop-blur-sm text-primary-accent rounded-full text-xs sm:text-sm font-semibold mb-6 border border-primary-accent/30">
                {t('metodoFarray_hero_badge')}
              </span>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-6 text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {t('metodoFarray_hero_title')}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
              <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-neutral/90 leading-relaxed px-4">
                {t('metodoFarray_hero_subtitle')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={400}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-base sm:text-lg py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('metodoFarray_cta_button')}
                </button>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-subtle-bob">
            <svg
              className="w-6 h-6 text-neutral/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </section>

        {/* SECCIÓN 2: EL PROBLEMA */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black via-red-950/10 to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll>
                <div className="group bg-black/70 backdrop-blur-xl border border-red-500/30 hover:border-red-500/50 rounded-2xl p-6 sm:p-8 md:p-12 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral mb-6">
                    {t('metodoFarray_problem_title')}
                  </h2>
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90">
                    <p>{t('metodoFarray_problem_p1')}</p>
                    <p className="font-semibold text-red-400">{t('metodoFarray_problem_p2')}</p>
                    <ul className="space-y-3 mt-6">
                      {[1, 2, 3, 4].map(i => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
                            <svg
                              className="w-4 h-4 text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </span>
                          <span>{t(`metodoFarray_problem_point${i}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: HISTORIA DE ORIGEN - NUEVA */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll>
                <div className="relative bg-gradient-to-br from-primary-accent/10 via-black to-black border-l-4 border-primary-accent rounded-r-2xl p-6 sm:p-8 md:p-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral mb-6 holographic-text">
                    {t('metodoFarray_origin_title')}
                  </h2>
                  <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90">
                    <p className="text-lg sm:text-xl font-medium text-neutral">
                      {t('metodoFarray_origin_intro')}
                    </p>
                    <p>{t('metodoFarray_origin_p1')}</p>
                    <p>{t('metodoFarray_origin_p2')}</p>

                    {/* Quote destacada - Speakable for voice search */}
                    <div className="metodo-origin-quote my-6 sm:my-8 p-4 sm:p-6 bg-black/50 rounded-xl border border-primary-accent/30">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-primary-accent/50 mb-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <p className="text-base sm:text-lg md:text-xl italic text-neutral mb-3">
                        {t('metodoFarray_origin_quote')}
                      </p>
                      <p className="text-primary-accent font-semibold text-sm sm:text-base">
                        {t('metodoFarray_origin_quote_author')}
                      </p>
                    </div>

                    <p className="font-semibold text-primary-accent">
                      {t('metodoFarray_origin_conclusion')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: ANSWER CAPSULE GEO - NUEVA */}
        <section className="py-8 md:py-12 bg-gradient-to-b from-black to-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <AnimateOnScroll>
                <div
                  id="answer-capsule-metodo"
                  data-answer-capsule="true"
                  className="bg-black/70 backdrop-blur-xl border border-primary-accent/50 rounded-2xl p-6 sm:p-8 shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-accent/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 text-primary-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-neutral mb-2">
                        {t('metodoFarray_answerQ')}
                      </h3>
                      <p className="text-sm sm:text-base text-neutral/90 leading-relaxed">
                        {t('metodoFarray_answerA')}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: ADAPTACIÓN PARA EUROPA - NUEVA (Core Diferenciador) */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-primary-dark/10 via-black to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 md:mb-12">
                <h2 className="metodo-adaptation-title text-3xl sm:text-4xl md:text-5xl font-black text-neutral mb-4 holographic-text">
                  {t('metodoFarray_adaptation_title')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/80 max-w-3xl mx-auto px-4">
                  {t('metodoFarray_adaptation_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Grid de 3 cards de adaptación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 [perspective:1000px]">
              {/* Card 1: Base desde cero */}
              <AnimateOnScroll delay={100}>
                <div className="group h-full min-h-[300px] p-6 sm:p-8 bg-black/70 backdrop-blur-xl border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)] hover:shadow-accent-glow relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl bg-primary-accent/15 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6">
                      <div className="bg-primary-dark/40 group-hover:bg-primary-accent/30 p-4 rounded-xl inline-block transition-all duration-500 group-hover:scale-110">
                        <svg
                          className="h-8 w-8 sm:h-10 sm:w-10 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('metodoFarray_adapt1_title')}
                    </h4>
                    <p className="text-sm sm:text-base text-neutral/90 leading-relaxed flex-grow">
                      {t('metodoFarray_adapt1_desc')}
                    </p>
                    <p className="text-xs sm:text-sm text-red-400/80 mt-4 pt-4 border-t border-primary-dark/30 italic">
                      {t('metodoFarray_adapt1_vs')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Card 2: Metodología Analítica */}
              <AnimateOnScroll delay={200}>
                <div className="group h-full min-h-[300px] p-6 sm:p-8 bg-black/70 backdrop-blur-xl border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)] hover:shadow-accent-glow relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl bg-primary-accent/15 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6">
                      <div className="bg-primary-dark/40 group-hover:bg-primary-accent/30 p-4 rounded-xl inline-block transition-all duration-500 group-hover:scale-110">
                        <svg
                          className="h-8 w-8 sm:h-10 sm:w-10 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('metodoFarray_adapt2_title')}
                    </h4>
                    <p className="text-sm sm:text-base text-neutral/90 leading-relaxed flex-grow">
                      {t('metodoFarray_adapt2_desc')}
                    </p>
                    <p className="text-xs sm:text-sm text-red-400/80 mt-4 pt-4 border-t border-primary-dark/30 italic">
                      {t('metodoFarray_adapt2_vs')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Card 3: Progresión Estructurada */}
              <AnimateOnScroll delay={300}>
                <div className="group h-full min-h-[300px] p-6 sm:p-8 bg-black/70 backdrop-blur-xl border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)] hover:shadow-accent-glow relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl bg-primary-accent/15 pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6">
                      <div className="bg-primary-dark/40 group-hover:bg-primary-accent/30 p-4 rounded-xl inline-block transition-all duration-500 group-hover:scale-110">
                        <svg
                          className="h-8 w-8 sm:h-10 sm:w-10 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t('metodoFarray_adapt3_title')}
                    </h4>
                    <p className="text-sm sm:text-base text-neutral/90 leading-relaxed flex-grow">
                      {t('metodoFarray_adapt3_desc')}
                    </p>
                    <p className="text-xs sm:text-sm text-red-400/80 mt-4 pt-4 border-t border-primary-dark/30 italic">
                      {t('metodoFarray_adapt3_vs')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* SECCIÓN 6: LA SOLUCIÓN */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll>
                <div className="group relative bg-black/70 backdrop-blur-xl border border-primary-accent/50 rounded-2xl p-6 sm:p-8 md:p-12 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow overflow-hidden">
                  {/* Glow decoration */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl bg-primary-accent/10 pointer-events-none" />

                  <div className="relative z-10">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral mb-6 holographic-text">
                      {t('metodoFarray_solution_title')}
                    </h2>
                    <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary-accent">
                        {t('metodoFarray_solution_tagline')}
                      </p>
                      <p>{t('metodoFarray_solution_p1')}</p>
                      <p>{t('metodoFarray_solution_p2')}</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: LOS 3 PILARES - Con perspectiva 3D */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-black via-primary-dark/10 to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral mb-4 holographic-text">
                  {t('metodoFarray_pillars_title')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/80 max-w-2xl mx-auto px-4">
                  {t('metodoFarray_pillars_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Grid con perspectiva 3D */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 [perspective:1000px]">
              {pillars.map((pillar, index) => {
                const IconComponent = PillarIcons[pillar.icon];
                return (
                  <AnimateOnScroll key={pillar.titleKey} delay={100 + index * 150}>
                    <div className="group h-full min-h-[280px] sm:min-h-[320px] p-6 sm:p-8 bg-black/70 backdrop-blur-xl border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_rotateY(5deg)_rotateX(2deg)] hover:shadow-accent-glow relative overflow-hidden">
                      {/* Glow effect decorativo */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl bg-primary-accent/15 pointer-events-none" />

                      <div className="relative z-10 flex flex-col h-full">
                        {/* Icono */}
                        <div className="mb-6">
                          <div className="bg-primary-dark/40 group-hover:bg-primary-accent/30 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                            {IconComponent && (
                              <IconComponent className="h-8 w-8 sm:h-10 sm:w-10 text-primary-accent transition-all duration-500 group-hover:scale-110" />
                            )}
                          </div>
                        </div>

                        {/* Título */}
                        <h4 className="text-xl sm:text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                          {t(pillar.titleKey)}
                        </h4>

                        {/* Descripción */}
                        <p className="text-sm sm:text-base text-neutral/90 leading-relaxed flex-grow">
                          {t(pillar.descKey)}
                        </p>

                        {/* Origen */}
                        <p className="text-xs sm:text-sm text-primary-accent/70 mt-4 pt-4 border-t border-primary-dark/30 italic">
                          {t(pillar.originKey)}
                        </p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECCIÓN 4.5: POR QUÉ FRACASAS EN OTRAS ACADEMIAS - BRUTAL */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black via-red-950/20 to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                {/* Título Provocativo */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral text-center mb-6">
                  {t('metodoFarray_whyYouFail_title')}
                </h2>
                <p className="text-center text-neutral/80 text-lg mb-10 max-w-2xl mx-auto">
                  {t('metodoFarray_whyYouFail_subtitle')}
                </p>

                {/* Grid de 4 Razones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <AnimateOnScroll key={i} delay={i * 100}>
                      <div className="bg-black/70 backdrop-blur-xl border border-red-500/30 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                          {/* X Icon */}
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-red-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-neutral mb-2">
                              {t(`metodoFarray_whyYouFail_reason${i}_title`)}
                            </h4>
                            <p className="text-sm text-neutral/80">
                              {t(`metodoFarray_whyYouFail_reason${i}_desc`)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>

                {/* Testimonial de Migración */}
                <AnimateOnScroll delay={500}>
                  <div className="mt-10 bg-primary-dark/20 border border-primary-accent/30 rounded-xl p-6 sm:p-8">
                    <div className="flex items-start gap-4">
                      <svg
                        className="w-8 h-8 text-primary-accent flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <div>
                        <p className="text-lg italic text-neutral mb-3">
                          {t('metodoFarray_whyYouFail_testimonial')}
                        </p>
                        <p className="text-sm text-primary-accent font-semibold">
                          — Alumna real, Google Review verificado
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* SECCIÓN 5: COMPARATIVA PREMIUM */}
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-black via-primary-dark/5 to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 md:mb-10 max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral mb-4 holographic-text">
                  {t('metodoFarray_comparison_title')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/90 px-4">
                  {t('metodoFarray_comparison_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Grid comparativo con perspectiva - TRIPLE COMPARISON */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 [perspective:1000px]">
              {/* Columna 1: Academias Sin Método */}
              <AnimateOnScroll delay={50}>
                <div className="group relative h-full bg-black/70 backdrop-blur-xl border border-orange-500/30 hover:border-orange-500/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)]">
                  {/* Orange glow decoration */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                        {/* Alert Triangle Icon */}
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral/70">
                          {t('metodoFarray_comparison_noMethod_title')}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral/60 mt-1">
                          {t('metodoFarray_comparison_noMethod_subtitle')}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-3 sm:space-y-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center mt-0.5"
                            aria-hidden="true"
                          >
                            {/* Alert icon */}
                            <svg
                              className="w-3 h-3 text-orange-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M12 9v2m0 4h.01"
                              />
                            </svg>
                          </span>
                          <span className="text-sm sm:text-base text-neutral/70">
                            {t(`metodoFarray_comparison_noMethod_${i}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Columna 2: ENA Tradicional (ex Academia Típica) */}
              <AnimateOnScroll delay={150}>
                <div className="group relative h-full bg-black/70 backdrop-blur-xl border border-blue-500/30 hover:border-blue-500/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)]">
                  {/* Blue glow decoration */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                        {/* Info Circle Icon */}
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral/70">
                          {t('metodoFarray_comparison_others_title')}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral/60 mt-1">
                          {t('metodoFarray_comparison_others_subtitle')}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-3 sm:space-y-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5"
                            aria-hidden="true"
                          >
                            {/* Info icon (smaller) */}
                            <svg
                              className="w-3 h-3 text-blue-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M13 16h-1v-4h-1m1-4h.01"
                              />
                            </svg>
                          </span>
                          <span className="text-sm sm:text-base text-neutral/70">
                            {t(`metodoFarray_comparison_others_${i}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Columna 3: Método Farray */}
              <AnimateOnScroll delay={250}>
                <div className="group relative h-full bg-black/70 backdrop-blur-xl border border-primary-accent/50 hover:border-primary-accent rounded-2xl p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)] hover:shadow-accent-glow">
                  {/* Accent glow decoration */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-accent/20 to-green-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6 sm:mb-8">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-accent/20 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 sm:w-6 sm:h-6 text-primary-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral holographic-text">
                          {t('metodoFarray_comparison_us_title')}
                        </h3>
                        <p className="text-xs sm:text-sm text-primary-accent/70 mt-1">
                          {t('metodoFarray_comparison_us_subtitle')}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-3 sm:space-y-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-accent/20 flex items-center justify-center mt-0.5"
                            aria-hidden="true"
                          >
                            <svg
                              className="w-3 h-3 text-primary-accent"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                          <span className="text-sm sm:text-base text-neutral font-medium">
                            {t(`metodoFarray_comparison_us_${i}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5.5: TABLA COMPARATIVA DETALLADA - ENTERPRISE DATA */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-3xl sm:text-4xl font-black text-center mb-10 holographic-text">
                {t('metodoFarray_detailedComparison_title')}
              </h2>
            </AnimateOnScroll>

            {/* Tabla Responsive */}
            <div className="overflow-x-auto">
              <table className="w-full max-w-6xl mx-auto border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary-accent/50">
                    <th className="text-left p-4 text-neutral/80 text-sm font-semibold">
                      {t('metodoFarray_detailedComparison_criterion')}
                    </th>
                    <th className="p-4 text-orange-400 text-sm font-semibold">
                      {t('metodoFarray_comparison_noMethod_title')}
                    </th>
                    <th className="p-4 text-primary-accent text-sm font-semibold">
                      {t('metodoFarray_comparison_us_title')}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {/* ROW: Maestros Formación Cubana */}
                  <tr className="border-b border-neutral/10 hover:bg-primary-dark/10 transition-colors">
                    <td className="p-4 text-neutral">
                      {t('metodoFarray_detailedComparison_row1_criterion')}
                    </td>
                    <td className="p-4 text-center text-orange-400">0</td>
                    <td className="p-4 text-center text-primary-accent font-bold">7</td>
                  </tr>

                  {/* ROW: CID-UNESCO */}
                  <tr className="border-b border-neutral/10 hover:bg-primary-dark/10 transition-colors">
                    <td className="p-4 text-neutral">
                      {t('metodoFarray_detailedComparison_row2_criterion')}
                    </td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>

                  {/* ROW: Alumnos Formados */}
                  <tr className="border-b border-neutral/10 hover:bg-primary-dark/10 transition-colors">
                    <td className="p-4 text-neutral">
                      {t('metodoFarray_detailedComparison_row3_criterion')}
                    </td>
                    <td className="p-4 text-center text-neutral/50">
                      {t('metodoFarray_detailedComparison_row3_noMethod')}
                    </td>
                    <td className="p-4 text-center text-primary-accent font-bold">15,000+</td>
                  </tr>

                  {/* ROW: Reputación Verificada */}
                  <tr className="border-b border-neutral/10 hover:bg-primary-dark/10 transition-colors">
                    <td className="p-4 text-neutral">
                      {t('metodoFarray_detailedComparison_row4_criterion')}
                    </td>
                    <td className="p-4 text-center text-neutral/50">
                      {t('metodoFarray_detailedComparison_row4_noMethod')}
                    </td>
                    <td className="p-4 text-center text-primary-accent font-bold">
                      4.9/5 (509+ {t('metodoFarray_detailedComparison_reviews')})
                    </td>
                  </tr>

                  {/* ROW: Plan Pedagógico */}
                  <tr className="border-b border-neutral/10 hover:bg-primary-dark/10 transition-colors">
                    <td className="p-4 text-neutral">
                      {t('metodoFarray_detailedComparison_row5_criterion')}
                    </td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">
                      ✅ ({t('metodoFarray_detailedComparison_row5_farray')})
                    </td>
                  </tr>

                  {/* ROW: Adaptado para Europeos */}
                  <tr className="border-b border-neutral/10 hover:bg-primary-dark/10 transition-colors">
                    <td className="p-4 text-neutral">
                      {t('metodoFarray_detailedComparison_row6_criterion')}
                    </td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>

                  {/* ROW: Metodología Propia */}
                  <tr className="border-b border-neutral/10 hover:bg-primary-dark/10 transition-colors">
                    <td className="p-4 text-neutral">
                      {t('metodoFarray_detailedComparison_row7_criterion')}
                    </td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅ (Método Farray®)</td>
                  </tr>

                  {/* ROW: Niveles Estructurados */}
                  <tr className="border-b border-neutral/10 hover:bg-primary-dark/10 transition-colors">
                    <td className="p-4 text-neutral">
                      {t('metodoFarray_detailedComparison_row9_criterion')}
                    </td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>

                  {/* ROW: Estabilidad Profesores */}
                  <tr className="border-b border-neutral/10 hover:bg-primary-dark/10 transition-colors">
                    <td className="p-4 text-neutral">
                      {t('metodoFarray_detailedComparison_row11_criterion')}
                    </td>
                    <td className="p-4 text-center text-orange-400">
                      &lt;1 {t('metodoFarray_detailedComparison_year')}
                    </td>
                    <td className="p-4 text-center text-primary-accent font-bold">
                      3-8+ {t('metodoFarray_detailedComparison_years')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* CTA después de la tabla */}
            <AnimateOnScroll delay={300}>
              <div className="text-center mt-10">
                <p className="text-lg text-neutral/80 mb-6">
                  {t('metodoFarray_detailedComparison_cta_text')}
                </p>
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow"
                >
                  {t('metodoFarray_detailedComparison_cta_button')}
                </button>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* SECCIÓN 6: RESULTADOS CON STATS GRANDES */}
        <section className="py-12 md:py-16 lg:py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral mb-4 holographic-text">
                  {t('metodoFarray_results_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            {/* Stats Grid con diseño premium */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-10 [perspective:1000px]">
              {[
                { value: '15000+', key: 'students' },
                { value: '15+', key: 'years' },
                { value: '4.9', key: 'rating' },
                { value: '25+', key: 'styles' },
              ].map((stat, index) => (
                <AnimateOnScroll key={stat.key} delay={100 + index * 100}>
                  <div className="group text-center p-4 sm:p-6 bg-black/70 backdrop-blur-xl border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)] hover:shadow-accent-glow">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 transition-transform duration-300 group-hover:scale-110 holographic-text">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-neutral/70">
                      {t(`metodoFarray_stats_${stat.key}`)}
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* Quote destacado con diseño premium */}
            <AnimateOnScroll delay={500}>
              <div className="max-w-3xl mx-auto relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-accent/20 via-primary-dark/20 to-primary-accent/20 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-black/70 backdrop-blur-xl p-6 sm:p-8 md:p-10 border-l-4 border-primary-accent rounded-r-2xl">
                  <svg
                    className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent/30 mb-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-lg sm:text-xl md:text-2xl italic text-neutral mb-4 leading-relaxed">
                    {t('metodoFarray_featured_quote')}
                  </p>
                  <p className="text-primary-accent font-bold text-sm sm:text-base">
                    {t('metodoFarray_featured_quote_author')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* SECCIÓN 7: QUIÉN LO ENSEÑA */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black via-primary-dark/10 to-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral mb-4 holographic-text">
                  {t('metodoFarray_teachers_title')}
                </h2>
                <p className="text-base sm:text-lg text-neutral/80 max-w-2xl mx-auto px-4">
                  {t('metodoFarray_teachers_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="max-w-2xl mx-auto text-center bg-black/50 backdrop-blur-xl border border-primary-dark/50 rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow">
                <p className="text-sm sm:text-base text-neutral/90 mb-6">
                  {t('metodoFarray_teachers_text')}
                </p>
                <Link
                  to={`/${locale}/yunaisy-farray`}
                  className="inline-flex items-center gap-2 text-primary-accent hover:text-white transition-all duration-300 font-semibold group"
                >
                  <span>{t('metodoFarray_teachers_cta')}</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* SECCIÓN 8: CTA FINAL PREMIUM */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Background con gradient premium */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/40 via-black to-primary-dark/30" />

          {/* Glow central */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-accent/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-neutral mb-6 holographic-text">
                  {t('metodoFarray_cta_title')}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-neutral/90 mb-8 md:mb-10 px-4">
                  {t('metodoFarray_cta_subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setIsLeadModalOpen(true)}
                    className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-base sm:text-lg py-4 px-8 sm:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                  >
                    {t('metodoFarray_cta_button')}
                  </button>
                  <Link
                    to={`/${locale}/clases/baile-barcelona`}
                    className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-base sm:text-lg py-4 px-8 sm:px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                  >
                    {t('metodoFarray_cta_secondary')}
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </>
  );
};

export default MetodoFarrayPage;
