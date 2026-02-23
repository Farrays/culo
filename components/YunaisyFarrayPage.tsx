import React, { useState, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHLSVideo } from '../hooks/useHLSVideo';
import { YUNAISY_VIDEO_CONFIG } from '../constants/yunaisy-video-config';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import LeadCaptureModal from './shared/LeadCaptureModal';
import OptimizedImage from './OptimizedImage';
import ReviewsSection from './reviews/ReviewsSection';

// External links for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
// dofollow: true = Educational institutions (pass PageRank authority)
// dofollow: false = Wikipedia/IMDb (informational, no SEO value transfer)
const EXTERNAL_LINKS: { pattern: RegExp; url: string; title: string; dofollow?: boolean }[] = [
  {
    pattern: /Street Dance 2|STREET DANCE 2|StreetDance 2/gi,
    url: 'https://www.imdb.com/es-es/title/tt1718903/',
    title: 'Street Dance 2 on IMDb',
    dofollow: false,
  },
  {
    pattern: /CID-UNESCO|CID UNESCO/gi,
    url: 'https://cid-world.org/',
    title: 'International Dance Council - UNESCO',
    dofollow: true,
  },
  {
    pattern: /Got Talent España|Got Talent Spain/gi,
    url: 'https://es.wikipedia.org/wiki/Got_Talent_Espa%C3%B1a',
    title: 'Got Talent España - Wikipedia',
    dofollow: false,
  },
  {
    pattern: /The Dancer/gi,
    url: 'https://es.wikipedia.org/wiki/The_Dancer_(programa_de_televisi%C3%B3n)',
    title: 'The Dancer - Wikipedia',
    dofollow: false,
  },
  {
    pattern: /ENA Cuba|Escuela Nacional de Arte|Escuela Nacional de las Artes|ENA de Cuba/gi,
    url: 'https://www.ena.cult.cu/',
    title: 'Escuela Nacional de Arte de Cuba (ENA)',
    dofollow: true,
  },
  {
    pattern: /ISA Cuba|Instituto Superior de Arte|ISA de Cuba/gi,
    url: 'https://www.isa.cult.cu/',
    title: 'Instituto Superior de Arte de Cuba (ISA)',
    dofollow: true,
  },
  {
    pattern: /Compañía Carlos Acosta|Carlos Acosta Company|Acosta Danza/gi,
    url: 'https://www.carlosacostadanza.com/',
    title: 'Carlos Acosta Dance Company',
    dofollow: true,
  },
  {
    pattern: /Royal Ballet of London|Royal Ballet London|Royal Ballet/gi,
    url: 'https://www.roh.org.uk/about/the-royal-ballet',
    title: 'The Royal Ballet - Royal Opera House',
    dofollow: true,
  },
  {
    pattern:
      /Escuela Nacional de Ballet de Cuba|Ballet Nacional de Cuba|Cuban National Ballet School/gi,
    url: 'https://www.balletcuba.cult.cu/',
    title: 'Ballet Nacional de Cuba - Official Site',
    dofollow: true,
  },
  {
    pattern: /Ballet Folklórico de Camagüey|Ballet Folklorico de Camagüey/gi,
    url: 'http://www.pprincipe.cult.cu/ballet-folklorico-de-camaguey/',
    title: 'Ballet Folklórico de Camagüey - Official Site',
    dofollow: true,
  },
  {
    pattern: /Danza Contemporánea de Cuba|Danza Contemporanea de Cuba/gi,
    url: 'https://cubaescena.cult.cu/',
    title: 'Danza Contemporánea de Cuba - Cubaescena',
    dofollow: true,
  },
  {
    pattern: /The Cuban School of Arts|Cuban School of Arts London/gi,
    url: 'https://www.cubanschool.co.uk/',
    title: 'The Cuban School of Arts - London',
    dofollow: true,
  },
  {
    pattern: /El Rey León|Le Roi Lion/gi,
    url: 'https://www.stage-entertainment.fr/musicals-shows/le-roi-lion-le-musical-site-officiel',
    title: 'Le Roi Lion - Théâtre Mogador Paris',
    dofollow: true,
  },
];

// Component for external link with proper accessibility and SEO
function ExternalLink({
  href,
  title,
  children,
  dofollow = true,
}: {
  href: string;
  title: string;
  children: ReactNode;
  dofollow?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel={dofollow ? 'noopener noreferrer' : 'nofollow noopener noreferrer'}
      title={title}
      className="text-primary-accent hover:text-white underline decoration-primary-accent/50 hover:decoration-white transition-colors duration-200"
    >
      {children}
    </a>
  );
}

// Function to render text with external links for E-E-A-T
function renderTextWithLinks(text: string): ReactNode {
  // Track which links we've already added to avoid duplicates in same text
  const usedPatterns = new Set<string>();

  // Build a combined regex to find all matches
  const result: ReactNode[] = [];
  let lastIndex = 0;

  // Find all matches and their positions
  const matches: { index: number; length: number; replacement: ReactNode; patternKey: string }[] =
    [];

  EXTERNAL_LINKS.forEach(link => {
    let match;
    const regex = new RegExp(link.pattern.source, link.pattern.flags);
    while ((match = regex.exec(text)) !== null) {
      const patternKey = link.url;
      // Only add first occurrence of each link type
      if (!usedPatterns.has(patternKey)) {
        usedPatterns.add(patternKey);
        matches.push({
          index: match.index,
          length: match[0].length,
          replacement: (
            <ExternalLink
              key={`${patternKey}-${match.index}`}
              href={link.url}
              title={link.title}
              dofollow={link.dofollow}
            >
              {match[0]}
            </ExternalLink>
          ),
          patternKey,
        });
      }
    }
  });

  // Sort matches by position
  matches.sort((a, b) => a.index - b.index);

  // Build result array
  matches.forEach(match => {
    // Add text before this match
    if (match.index > lastIndex) {
      result.push(text.substring(lastIndex, match.index));
    }
    // Add the linked text
    result.push(match.replacement);
    lastIndex = match.index + match.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result.length > 0 ? result : text;
}

const YunaisyFarrayPage: React.FC = () => {
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
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // HLS Video for hero background
  const { videoRef, containerRef, isVideoPlaying, shouldShowVideo } = useHLSVideo({
    hlsUrl: YUNAISY_VIDEO_CONFIG.hlsUrl,
    mp4Url: YUNAISY_VIDEO_CONFIG.mp4Url,
    loadDelay: 150, // Wait for poster LCP
    respectReducedMotion: true,
    respectDataSaver: true,
  });

  // Schema Markup - BreadcrumbList
  const _breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('yunaisyFarray_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('yunaisyFarray_breadcrumb_current'),
        item: `${baseUrl}/${locale}/yunaisy-farray`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('yunaisyFarray_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('yunaisyFarray_breadcrumb_current'),
      url: `/${locale}/yunaisy-farray`,
      isActive: true,
    },
  ];

  // Schema Markup - Person (Enhanced for E-E-A-T)
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/yunaisy-farray#person`,
    name: 'Yunaisy Farray',
    givenName: 'Yunaisy',
    familyName: 'Farray',
    jobTitle: t('schema_yunaisy_jobTitle_founder'),
    image: `${baseUrl}/images/yunaisy-portrait.jpg`,
    url: `${baseUrl}/${locale}/yunaisy-farray`,
    worksFor: {
      '@type': 'EducationalOrganization',
      name: "Farray's International Dance Center",
      url: baseUrl,
    },
    description: t('yunaisyFarray_meta_description'),
    knowsAbout: [
      'Cuban Dance',
      'Salsa',
      'Afro-Cuban Dance',
      'Latin Dance',
      'Dance Education',
      'Choreography',
    ],
    nationality: {
      '@type': 'Country',
      name: 'Cuba',
    },
    sameAs: [
      'https://www.instagram.com/farrays_centerbcn/',
      'https://www.facebook.com/farrayscenter/',
      'https://www.youtube.com/@farraysinternationaldance',
      'https://www.tiktok.com/@farrays_centerbcn',
      'https://www.imdb.com/es-es/title/tt1718903/',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: t('schema_streetAddress'),
      addressLocality: 'Barcelona',
      addressRegion: t('schema_addressRegion'),
      postalCode: '08015',
      addressCountry: 'ES',
    },
  };

  // Note: AggregateRating removed from Person schema
  // Google does not support AggregateRating for @type: Person
  // Reviews for Yunaisy are displayed visually but not in structured data
  // The business-level rating is in DanceSchoolWithRatingSchema (SchemaMarkup.tsx)

  return (
    <>
      <Helmet>
        <title>{t('yunaisyFarray_page_title')} | Farray&apos;s Center</title>
        <meta name="description" content={t('yunaisyFarray_meta_description')} />
        <link rel="canonical" href={`${baseUrl}/${locale}/yunaisy-farray`} />
        <meta
          property="og:title"
          content={`${t('yunaisyFarray_page_title')} | Farray&apos;s Center`}
        />
        <meta property="og:description" content={t('yunaisyFarray_meta_description')} />
        <meta property="og:url" content={`${baseUrl}/${locale}/yunaisy-farray`} />
        <meta property="og:type" content="profile" />
        <meta property="og:image" content={`${baseUrl}/images/og-yunaisy-farray.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('yunaisyFarray_page_title')} | Farray's Center`} />
        <meta name="twitter:description" content={t('yunaisyFarray_meta_description')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-yunaisy-farray.jpg`} />
        {/* BreadcrumbList generated at build-time by prerender.mjs */}
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section - Video Background */}
        <section
          id="yunaisy-hero"
          className="relative text-center py-12 md:py-16 overflow-hidden flex items-center justify-center min-h-[70vh]"
        >
          {/* Background with Video */}
          <div ref={containerRef} className="absolute inset-0 bg-black" aria-hidden="true">
            {/* Poster Image - Always rendered for LCP (local optimized WebP) */}
            <img
              src={YUNAISY_VIDEO_CONFIG.posterUrl}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                isVideoPlaying ? 'opacity-0' : 'opacity-100'
              }`}
              fetchPriority="high"
              decoding="sync"
              loading="eager"
              onError={e => {
                // Fallback to CDN if local image fails
                const target = e.currentTarget;
                if (target.src !== YUNAISY_VIDEO_CONFIG.posterFallbackUrl) {
                  target.src = YUNAISY_VIDEO_CONFIG.posterFallbackUrl;
                }
              }}
            />

            {/* Video - HLS streaming with lazy loading */}
            {shouldShowVideo && (
              <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  isVideoPlaying ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
              />
            )}

            {/* Overlays for text readability */}
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black/20 to-black/40" />
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <div className="max-w-6xl mx-auto text-center mb-8">
                <h1
                  className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 text-white"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
                >
                  {t('yunaisyFarray_hero_title')}
                </h1>
                <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                  {t('yunaisyFarray_hero_subtitle')}
                </p>
                {/* CTA Button */}
                <button
                  onClick={() => setIsLeadModalOpen(true)}
                  className="mt-10 inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('yunaisyFarray_hero_cta')}
                </button>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="pt-12 md:pt-16 pb-10 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-5 gap-8 items-start">
                {/* Photo Column */}
                <AnimateOnScroll delay={100} className="lg:col-span-2">
                  <div className="max-w-sm mx-auto lg:mx-0 [perspective:1000px]">
                    <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary-accent/30 shadow-accent-glow [transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow hover:border-primary-accent">
                      <OptimizedImage
                        src="/images/teachers/img/maestra-yunaisy-farray"
                        alt="Yunaisy Farray - Fundadora y Directora de Farray's International Dance Center"
                        breakpoints={[320, 640, 960]}
                        sizes="(max-width: 1024px) 384px, 384px"
                        aspectRatio="3/4"
                        objectFit="cover"
                        objectPosition="center top"
                        className="w-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />
                      {/* Holographic overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary-accent/10 via-transparent to-primary-dark/10 pointer-events-none"></div>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Text Column */}
                <AnimateOnScroll delay={200} className="lg:col-span-3">
                  <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-accent-glow/20 transition-shadow duration-500 h-full">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                      {t('yunaisyFarray_intro_title')}
                    </h2>
                    <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                      <p className="text-xl font-semibold text-primary-accent">
                        {t('yunaisyFarray_intro_subtitle')}
                      </p>
                      <p>{renderTextWithLinks(t('yunaisyFarray_intro_p1'))}</p>
                      <p>{t('yunaisyFarray_intro_p2')}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Raíces en La Habana */}
        <section className="py-10 bg-gradient-to-b from-black via-primary-dark/5 to-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={150}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-accent-glow/20 transition-shadow duration-500">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                    {t('yunaisyFarray_roots_title')}
                  </h2>
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p>{t('yunaisyFarray_roots_p1')}</p>
                    <p>{t('yunaisyFarray_roots_p2')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Artistic Photo - Vertical Jump */}
        <section className="py-10 md:py-16 bg-black overflow-hidden">
          <AnimateOnScroll>
            <div className="max-w-md mx-auto px-6 [perspective:1000px]">
              <div className="relative group rounded-2xl overflow-hidden border border-primary-accent/20 shadow-2xl shadow-primary-accent/10 [transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow hover:border-primary-accent">
                <OptimizedImage
                  src="/images/yunaisy/img/yunaisy-artistica-1"
                  alt="Yunaisy Farray ejecutando salto con extensión vertical - Directora de Farray's Dance Center Barcelona, maestra CID-UNESCO de danza cubana y contemporánea"
                  breakpoints={[320, 640, 768, 1024, 1440]}
                  sizes="(max-width: 768px) 100vw, 448px"
                  aspectRatio="4/5"
                  objectFit="cover"
                  className="w-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                {/* Diagonal hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-accent/5 to-primary-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Carrera Internacional */}
        <section className="py-10 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={100}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-accent-glow/20 transition-shadow duration-500">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                    {t('yunaisyFarray_career_title')}
                  </h2>
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p>{t('yunaisyFarray_career_p1')}</p>
                    <p>{t('yunaisyFarray_career_p2')}</p>
                    <p>{t('yunaisyFarray_career_p3')}</p>
                    <p>{t('yunaisyFarray_career_p4')}</p>
                    <p>{t('yunaisyFarray_career_p5')}</p>
                    <p>{renderTextWithLinks(t('yunaisyFarray_career_p6'))}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Artistic Photo - Backbend */}
        <section className="py-8 md:py-14 bg-gradient-to-b from-black via-primary-dark/5 to-black overflow-hidden">
          <AnimateOnScroll>
            <div className="max-w-md mx-auto px-4 [perspective:1000px]">
              <div className="relative group rounded-2xl overflow-hidden border border-primary-dark/30 shadow-2xl [transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow hover:border-primary-accent">
                <OptimizedImage
                  src="/images/yunaisy/img/yunaisy-artistica-2"
                  alt="Yunaisy Farray en backbend con extensión de pierna - Bailarina profesional y coreógrafa internacional, fundadora escuela de baile en Barcelona Eixample"
                  breakpoints={[320, 640, 768, 1024, 1440]}
                  sizes="(max-width: 768px) 100vw, 448px"
                  aspectRatio="4/5"
                  objectFit="cover"
                  className="w-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                {/* Diagonal hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-accent/5 to-primary-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Método Farray */}
        <section className="py-10 bg-gradient-to-b from-black via-primary-dark/5 to-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={150}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-accent-glow/20 transition-shadow duration-500">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                    {t('yunaisyFarray_method_title')}
                  </h2>
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p>{t('yunaisyFarray_method_p1')}</p>
                    <p>{t('yunaisyFarray_method_p2')}</p>
                    <p>{t('yunaisyFarray_method_p3')}</p>

                    {/* Quote Highlight */}
                    <div className="my-8 p-6 border-l-4 border-primary-accent bg-primary-dark/20 rounded-r-xl shadow-lg">
                      <p className="text-xl italic text-neutral font-medium">
                        {t('yunaisyFarray_method_quote')}
                      </p>
                      <p className="text-sm text-neutral/70 mt-2">— Félix Savón</p>
                    </div>

                    <p>{t('yunaisyFarray_method_p4')}</p>

                    <Link
                      to={`/${locale}/metodo-farray`}
                      className="inline-flex items-center gap-2 text-primary-accent hover:text-white transition-colors font-semibold mt-4"
                    >
                      {t('yunaisyFarray_method_link')}
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Artistic Photo - Split Jump - Wide */}
        <section className="py-10 md:py-20 bg-gradient-to-b from-black via-primary-dark/10 to-black overflow-hidden">
          <AnimateOnScroll>
            <div className="max-w-4xl mx-auto px-4 [perspective:1000px]">
              <div className="relative group rounded-3xl overflow-hidden border-2 border-primary-accent/30 shadow-[0_0_60px_rgba(var(--color-primary-accent-rgb),0.12)] [transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow hover:border-primary-accent">
                <OptimizedImage
                  src="/images/yunaisy/img/yunaisy-artistica-3"
                  alt="Yunaisy Farray realizando grand jeté split aéreo - Artista de danza contemporánea y cubana, profesora de baile Barcelona, actriz Street Dance 2"
                  breakpoints={[320, 640, 768, 1024, 1440]}
                  sizes="(max-width: 1024px) 100vw, 896px"
                  aspectRatio="16/10"
                  objectFit="cover"
                  className="w-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                {/* Diagonal hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-bl from-primary-accent/15 via-primary-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Barcelona */}
        <section className="py-10 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={100}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-accent-glow/20 transition-shadow duration-500">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                    {t('yunaisyFarray_barcelona_title')}
                  </h2>
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p>{t('yunaisyFarray_barcelona_p1')}</p>
                    <p>{t('yunaisyFarray_barcelona_p2')}</p>
                    <p>{t('yunaisyFarray_barcelona_p3')}</p>
                    <p>{t('yunaisyFarray_barcelona_p4')}</p>
                    <p>{t('yunaisyFarray_barcelona_p5')}</p>
                    <p className="font-semibold text-primary-accent">
                      {t('yunaisyFarray_barcelona_p6')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Igualdad y Mujer */}
        <section className="py-10 bg-gradient-to-b from-black via-primary-dark/5 to-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={150}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-accent-glow/20 transition-shadow duration-500">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                    {t('yunaisyFarray_equality_title')}
                  </h2>
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p>{t('yunaisyFarray_equality_p1')}</p>
                    <p>{t('yunaisyFarray_equality_p2')}</p>

                    <ul className="space-y-3 ml-6">
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_equality_point1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_equality_point2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_equality_point3')}</span>
                      </li>
                    </ul>

                    <p>{t('yunaisyFarray_equality_p3')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Artistic Photo - Pink Dress */}
        <section className="py-10 md:py-16 bg-black overflow-hidden">
          <AnimateOnScroll>
            <div className="max-w-lg mx-auto px-4 [perspective:1000px]">
              <div className="relative group rounded-3xl overflow-hidden border-2 border-primary-accent/25 shadow-[0_0_60px_rgba(var(--color-primary-accent-rgb),0.1)] [transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow hover:border-primary-accent">
                <OptimizedImage
                  src="/images/yunaisy/img/yunaisy-artistica-4"
                  alt="Yunaisy Farray en salto artístico con vestido rosa - Coreógrafa y maestra de baile cubano en Barcelona, finalista Got Talent España, formadora CID-UNESCO"
                  breakpoints={[320, 640, 768, 1024, 1440]}
                  sizes="(max-width: 768px) 100vw, 512px"
                  aspectRatio="4/5"
                  objectFit="cover"
                  className="w-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                {/* Diagonal hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary-accent/8 to-primary-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Pionera Online */}
        <section className="py-10 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={100}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-accent-glow/20 transition-shadow duration-500">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                    {t('yunaisyFarray_online_title')}
                  </h2>
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p>{t('yunaisyFarray_online_p1')}</p>
                    <p>{t('yunaisyFarray_online_p2')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Compromiso Social */}
        <section className="py-10 bg-gradient-to-b from-black via-primary-dark/5 to-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={150}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-accent-glow/20 transition-shadow duration-500">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                    {t('yunaisyFarray_social_title')}
                  </h2>
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p>{t('yunaisyFarray_social_intro')}</p>

                    <ul className="space-y-4 ml-6">
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_social_point1')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_social_point2')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_social_point3')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_social_point4')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_social_point5')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_social_point6')}</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-primary-accent mr-3 text-xl">•</span>
                        <span>{t('yunaisyFarray_social_point7')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Hoy - Closing Section */}
        <section className="py-10 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={100}>
                <div className="bg-gradient-to-br from-primary-dark/30 to-black border-2 border-primary-accent/50 rounded-2xl p-8 md:p-12 shadow-accent-glow">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                    {t('yunaisyFarray_today_title')}
                  </h2>
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p>{t('yunaisyFarray_today_p1')}</p>
                    <p className="font-semibold text-neutral">{t('yunaisyFarray_today_p2')}</p>

                    {/* Final Quote */}
                    <div className="mt-8 p-8 bg-black/50 rounded-xl border border-primary-accent/30 text-center shadow-lg">
                      <p className="text-2xl md:text-3xl italic text-neutral font-medium mb-4">
                        {t('yunaisyFarray_final_quote')}
                      </p>
                      <p className="text-primary-accent font-bold text-xl">— Yunaisy Farray 💛</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Artistic Photo - Floor Pose - Final Impact */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-black to-primary-dark/10 overflow-hidden">
          <AnimateOnScroll>
            <div className="max-w-4xl mx-auto px-4 [perspective:1000px]">
              <div className="relative group rounded-3xl overflow-hidden border border-primary-accent/20 shadow-[0_0_80px_rgba(var(--color-primary-accent-rgb),0.1)] [transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow hover:border-primary-accent">
                <OptimizedImage
                  src="/images/yunaisy/img/yunaisy-artistica-5"
                  alt="Yunaisy Farray en pose contemporánea de suelo - Bailarina y profesora de danza contemporánea Barcelona, técnica corporal avanzada, escuela Eixample"
                  breakpoints={[320, 640, 768, 1024, 1440]}
                  sizes="(max-width: 1024px) 100vw, 896px"
                  aspectRatio="4/3"
                  objectFit="cover"
                  className="w-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                {/* Diagonal hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-accent/5 to-primary-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          </AnimateOnScroll>
        </section>

        {/* Testimonials Section - Curated reviews that specifically mention Yunaisy */}
        <ReviewsSection
          selectedAuthors={[
            'Emma S', // "Yunaisy Farray es una profesora estupenda..."
            'Zhuqing Wang', // "sobre todo la directora Yunaisy..."
            'Violetta Pena Bagés', // "Magnífica profesora Yunaisy. Un talento increíble..."
            'Berta M', // "progresión en salsa increíble gracias a Yunaisy"
            'Karina Indytska', // "Yunaisy es una reina 👑"
            'Virginia Moreno', // "la mejor bailarina cubana Yunaisy Farray"
          ]}
          title={t('yunaisyFarray_testimonials_title')}
          showGoogleBadge={true}
          id="yunaisy-testimonials"
        />

        {/* CTA Section */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Background with stars */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('yunaisyFarray_cta_title')}
                </h2>
                <p className="text-lg md:text-xl text-neutral/90 mb-10 leading-relaxed">
                  {t('yunaisyFarray_cta_subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => setIsLeadModalOpen(true)}
                    className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow min-w-[240px]"
                  >
                    {t('puertasAbiertasCTA')}
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                  <Link
                    to={`/${locale}/clases/baile-barcelona`}
                    className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white min-w-[240px]"
                  >
                    {t('verClasesBaile')}
                  </Link>
                </div>
                <p className="text-sm text-neutral/80 mt-3 text-center max-w-md mx-auto">
                  {t('puertasAbiertasSubtext')}
                </p>
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

export default YunaisyFarrayPage;
