/**
 * Profesores de Baile Barcelona Page
 * Showcases all dance teachers at Farray's International Dance Center
 */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import OptimizedImage from '../OptimizedImage';
import { Breadcrumb } from '../shared/Breadcrumb';
import LeadCaptureModal from '../shared/LeadCaptureModal';
import {
  DIRECTOR_INFO,
  TEACHERS_LIST,
  TEACHERS_PAGE_STATS,
  TEACHERS_PERSON_SCHEMAS,
} from '../../constants/profesores-page-data';

// Avatar colors for teachers without photos
const AVATAR_COLORS = [
  'from-primary-accent to-primary-dark',
  'from-brand-500 to-brand-700',
  'from-amber-500 to-amber-700',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-cyan-500 to-cyan-700',
  'from-brand-400 to-brand-600',
  'from-indigo-500 to-indigo-700',
  'from-teal-500 to-teal-700',
  'from-orange-500 to-orange-700',
];

// Image positions - 'attention' crop handles all teachers now
const getImagePosition = (_teacherId: string): string => 'center';

// Get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const ProfesoresBaileBarcelonaPage: React.FC = () => {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageUrl = `${baseUrl}/${locale}/profesores-baile-barcelona`;

  // Breadcrumb items
  const breadcrumbItems = [
    { name: t('teachersPageBreadcrumbHome'), url: `/${locale}` },
    {
      name: t('teachersPageBreadcrumbCurrent'),
      url: `/${locale}/profesores-baile-barcelona`,
      isActive: true,
    },
  ];

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('teachersPageBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('teachersPageBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Person schemas for SEO with Geo-Local signals (i18n enabled)
  const personSchemas = TEACHERS_PERSON_SCHEMAS.map(teacher => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: teacher.name,
    jobTitle: t(teacher.jobTitleKey),
    description: t(teacher.descriptionKey),
    knowsAbout: teacher.knowsAbout,
    worksFor: {
      '@type': 'EducationalOrganization',
      name: "Farray's International Dance Center",
      url: baseUrl,
    },
    workLocation: {
      '@type': 'Place',
      name: "Farray's International Dance Center",
      address: {
        '@type': 'PostalAddress',
        streetAddress: t('schema_streetAddress'),
        addressLocality: 'Barcelona',
        addressRegion: t('schema_addressRegion'),
        postalCode: '08015',
        addressCountry: 'ES',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 41.380421,
        longitude: 2.148014,
      },
    },
  }));

  // ItemList schema
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('teachersPageH1'),
    description: t('teachersPageMetaDescription'),
    numberOfItems: TEACHERS_PAGE_STATS.totalTeachers,
    itemListElement: [DIRECTOR_INFO, ...TEACHERS_LIST].map((teacher, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Person',
        name: teacher.name,
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{t('teachersPageTitle')}</title>
        <meta name="description" content={t('teachersPageMetaDescription')} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={t('teachersPageTitle')} />
        <meta property="og:description" content={t('teachersPageMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={`${baseUrl}/images/teachers/img/yunaisy-farray-directora_320.webp`}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('teachersPageTitle')} />
        <meta name="twitter:description" content={t('teachersPageMetaDescription')} />

        {/* Hreflang */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/profesores-baile-barcelona`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/profesores-baile-barcelona`} />
        <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca/profesores-baile-barcelona`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/profesores-baile-barcelona`} />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es/profesores-baile-barcelona`}
        />
      </Helmet>

      {/* Schema Markup */}
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      {personSchemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section id="teachers-hero" className="relative text-center py-12 md:py-16 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>

          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-white mb-6"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {t('teachersPageH1')}
              </h1>
              <p className="max-w-3xl mx-auto text-lg md:text-xl text-neutral/90 mb-8">
                {t('teachersPageSubtitle')}
              </p>
            </AnimateOnScroll>

            {/* Stats */}
            <AnimateOnScroll delay={200}>
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black holographic-text">
                    +{TEACHERS_PAGE_STATS.yearsExperience}
                  </div>
                  <p className="text-neutral/80 text-sm">{t('teachersPageStatYears')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black holographic-text">
                    {TEACHERS_PAGE_STATS.totalTeachers}
                  </div>
                  <p className="text-neutral/80 text-sm">{t('teachersPageStatTeachers')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black holographic-text">
                    +{TEACHERS_PAGE_STATS.danceStyles}
                  </div>
                  <p className="text-neutral/80 text-sm">{t('teachersPageStatStyles')}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black holographic-text">
                    +{(TEACHERS_PAGE_STATS.totalStudents / 1000).toFixed(0)}K
                  </div>
                  <p className="text-neutral/80 text-sm">{t('teachersPageStatStudents')}</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Director Section */}
        <section id="director" className="py-10 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-center mb-4 holographic-text">
                {t('teachersPageDirectorTitle')}
              </h2>
              <p className="text-center text-neutral/80 mb-12 max-w-2xl mx-auto">
                {t('teachersPageDirectorSubtitle')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <div className="max-w-5xl mx-auto">
                <div className="bg-black/60 backdrop-blur-md border border-primary-accent/30 rounded-xl overflow-hidden hover:border-primary-accent transition-all">
                  <div className="flex flex-col md:flex-row">
                    {/* Director Photo - Rectangular */}
                    <div className="md:w-2/5 flex-shrink-0 [perspective:1000px]">
                      {DIRECTOR_INFO.image ? (
                        <div className="group relative h-64 md:h-full [transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                          <OptimizedImage
                            src={DIRECTOR_INFO.image.replace('_320.webp', '')}
                            altKey={`teachers.${DIRECTOR_INFO.id}.portrait`}
                            alt={`${DIRECTOR_INFO.name} - Directora de Farray's International Dance Center Barcelona`}
                            aspectRatio="3/4"
                            sizes="(max-width: 768px) 100vw, 40vw"
                            priority="high"
                            breakpoints={[320, 640, 960]}
                            className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
                            objectPosition={getImagePosition(DIRECTOR_INFO.id)}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-64 md:h-full bg-gradient-to-br from-primary-accent to-primary-dark flex items-center justify-center">
                          <span className="text-6xl md:text-7xl font-bold text-white">
                            {getInitials(DIRECTOR_INFO.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Director Info */}
                    <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold text-neutral mb-2">
                        {DIRECTOR_INFO.name}
                      </h3>
                      <p className="text-primary-accent font-semibold text-lg mb-4">
                        {t(DIRECTOR_INFO.specialtyKey)}
                      </p>
                      <p className="text-neutral/90 mb-6 leading-relaxed">
                        {t(DIRECTOR_INFO.bioKey)}
                      </p>

                      {/* Styles Tags */}
                      <div className="flex flex-wrap gap-2">
                        {DIRECTOR_INFO.styles.map(style => (
                          <span
                            key={style}
                            className="px-4 py-1.5 bg-primary-accent/20 border border-primary-accent/40 rounded text-sm text-neutral font-medium"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Commitment Section */}
        <section
          id="commitment"
          className="py-10 md:py-14 bg-gradient-to-b from-black to-primary-dark/20"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                {/* Shield Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-accent/20 border border-primary-accent/40 mb-6">
                  <svg
                    className="w-8 h-8 text-primary-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4">
                  {t('teachersPageCommitmentTitle')}
                </h2>
                <p className="text-neutral/80 mb-8 max-w-xl mx-auto">
                  {t('teachersPageCommitmentDescription')}
                </p>

                {/* 3 Points */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-8">
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary-accent flex-shrink-0"
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
                    <span className="text-neutral font-medium">
                      {t('teachersPageCommitmentPoint1')}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary-accent flex-shrink-0"
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
                    <span className="text-neutral font-medium">
                      {t('teachersPageCommitmentPoint2')}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary-accent flex-shrink-0"
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
                    <span className="text-neutral font-medium">
                      {t('teachersPageCommitmentPoint3')}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="mailto:info@farrays.com?subject=Candidatura%20Profesor"
                  className="inline-flex items-center gap-2 bg-transparent border border-primary-accent/60 text-primary-accent font-medium px-6 py-3 rounded-full transition-all duration-300 hover:bg-primary-accent/10 hover:border-primary-accent"
                >
                  {t('teachersPageCommitmentCta')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" className="py-10 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-center mb-4 holographic-text">
                {t('teachersPageTeamTitle')}
              </h2>
              <p className="text-center text-neutral/80 mb-12 max-w-2xl mx-auto">
                {t('teachersPageTeamSubtitle')}
              </p>
            </AnimateOnScroll>

            {/* Teachers Grid - Corporate Style with Accessibility */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              role="list"
              aria-label={t('teachersPageTeamTitle')}
            >
              {TEACHERS_LIST.map((teacher, index) => (
                <AnimateOnScroll key={teacher.id} delay={index * 50}>
                  <article
                    className="bg-black/60 backdrop-blur-md border border-primary-dark/50 rounded-xl overflow-hidden hover:border-primary-accent transition-all h-full flex flex-col group"
                    role="listitem"
                    aria-labelledby={`teacher-name-${teacher.id}`}
                  >
                    {/* Photo/Avatar - Portrait 3:4 */}
                    <div className="relative overflow-hidden [perspective:1000px]">
                      {teacher.image ? (
                        <div className="relative [transform-style:preserve-3d] transition-all duration-500 ease-in-out hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                          <OptimizedImage
                            src={teacher.image.replace('_320.webp', '')}
                            altKey={`teachers.${teacher.id}.portrait`}
                            alt={`${teacher.name} - Profesor de baile en Farray's Barcelona`}
                            aspectRatio="3/4"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 3 ? 'high' : 'auto'}
                            breakpoints={[320, 640, 960]}
                            className="w-full transition-transform duration-500 ease-in-out hover:scale-110"
                            objectPosition={getImagePosition(teacher.id)}
                          />
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                      ) : (
                        <div
                          className={`w-full bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center`}
                          style={{ aspectRatio: '3/4' }}
                        >
                          <span className="text-5xl font-bold text-white">
                            {getInitials(teacher.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3
                        id={`teacher-name-${teacher.id}`}
                        className="text-xl font-bold text-neutral mb-1"
                      >
                        {teacher.name}
                      </h3>
                      <p className="text-primary-accent font-medium mb-3">
                        {t(teacher.specialtyKey)}
                      </p>
                      <p className="text-neutral/80 text-sm mb-4 flex-1 leading-relaxed">
                        {t(teacher.bioKey)}
                      </p>

                      {/* Styles */}
                      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-primary-dark/30">
                        {teacher.styles.map(style => (
                          <span
                            key={style}
                            className="px-3 py-1 bg-primary-dark/40 rounded text-xs text-neutral/90 font-medium"
                          >
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          id="cta"
          className="py-10 md:py-16 bg-primary-dark/10"
          aria-labelledby="cta-heading"
        >
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <AnimateOnScroll>
              <h2
                id="cta-heading"
                className="text-3xl md:text-4xl font-black tracking-tighter mb-4 holographic-text"
              >
                {t('teachersPageCtaTitle')}
              </h2>
              <p className="text-neutral/80 mb-8 max-w-2xl mx-auto">
                {t('teachersPageCtaSubtitle')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                role="group"
                aria-label={t('teachersPageCtaTitle')}
              >
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                  aria-label={t('puertasAbiertasCTA')}
                >
                  {t('puertasAbiertasCTA')}
                </button>
                <Link
                  to={`/${locale}/clases/baile-barcelona`}
                  className="inline-flex items-center justify-center bg-black/50 backdrop-blur-md border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white hover:scale-105 hover:shadow-accent-glow"
                  aria-label={t('verClasesBaile')}
                >
                  {t('verClasesBaile')}
                </Link>
              </div>
              <p className="text-sm text-neutral/80 mt-3 text-center max-w-md mx-auto">
                {t('puertasAbiertasSubtext')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ProfesoresBaileBarcelonaPage;
