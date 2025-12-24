/**
 * Profesores de Baile Barcelona Page
 * Showcases all dance teachers at Farray's International Dance Center
 */
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';
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
  'from-rose-500 to-rose-700',
  'from-amber-500 to-amber-700',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-cyan-500 to-cyan-700',
  'from-pink-500 to-pink-700',
  'from-indigo-500 to-indigo-700',
  'from-teal-500 to-teal-700',
  'from-orange-500 to-orange-700',
];

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
  const { t, locale } = useI18n();
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

  // Person schemas for SEO
  const personSchemas = TEACHERS_PERSON_SCHEMAS.map(teacher => ({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: teacher.name,
    jobTitle: teacher.jobTitle,
    description: teacher.description,
    knowsAbout: teacher.knowsAbout,
    worksFor: {
      '@type': 'DanceGroup',
      name: "Farray's International Dance Center",
      url: baseUrl,
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
        <section id="teachers-hero" className="relative text-center py-20 md:py-32 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>

          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter holographic-text mb-6">
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
        <section id="director" className="py-16 md:py-24 bg-primary-dark/10">
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
                    <div className="md:w-2/5 flex-shrink-0">
                      {DIRECTOR_INFO.image ? (
                        <img
                          src={DIRECTOR_INFO.image}
                          alt={DIRECTOR_INFO.name}
                          className="w-full h-64 md:h-full object-cover"
                          loading="lazy"
                        />
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

        {/* Team Section */}
        <section id="team" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-center mb-4 holographic-text">
                {t('teachersPageTeamTitle')}
              </h2>
              <p className="text-center text-neutral/80 mb-12 max-w-2xl mx-auto">
                {t('teachersPageTeamSubtitle')}
              </p>
            </AnimateOnScroll>

            {/* Teachers Grid - Corporate Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {TEACHERS_LIST.map((teacher, index) => (
                <AnimateOnScroll key={teacher.id} delay={index * 50}>
                  <div className="bg-black/60 backdrop-blur-md border border-primary-dark/50 rounded-xl overflow-hidden hover:border-primary-accent transition-all h-full flex flex-col group">
                    {/* Photo/Avatar - Rectangular */}
                    <div className="relative h-72 overflow-hidden">
                      {teacher.image ? (
                        <img
                          src={teacher.image}
                          alt={teacher.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${AVATAR_COLORS[index % AVATAR_COLORS.length]} flex items-center justify-center`}
                        >
                          <span className="text-5xl font-bold text-white">
                            {getInitials(teacher.name)}
                          </span>
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-neutral mb-1">{teacher.name}</h3>
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
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta" className="py-16 md:py-24 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <AnimateOnScroll>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 holographic-text">
                {t('teachersPageCtaTitle')}
              </h2>
              <p className="text-neutral/80 mb-8 max-w-2xl mx-auto">
                {t('teachersPageCtaSubtitle')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('puertasAbiertasCTA')}
                </button>
                <Link
                  to={`/${locale}/clases/baile-barcelona`}
                  className="inline-flex items-center justify-center bg-black/50 backdrop-blur-md border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white hover:scale-105 hover:shadow-accent-glow"
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
