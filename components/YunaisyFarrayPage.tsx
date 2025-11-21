import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';

const YunaisyFarrayPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
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

  // Schema Markup - Person
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yunaisy Farray',
    jobTitle: 'Founder & Director',
    worksFor: {
      '@type': 'DanceSchool',
      name: "Farray's International Dance Center",
    },
    description: t('yunaisyFarray_meta_description'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Carrer d'Entença, 100, Local 1",
      addressLocality: 'Barcelona',
      addressRegion: 'Catalonia',
      postalCode: '08015',
      addressCountry: 'ES',
    },
  };

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
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section - Stellar Background */}
        <section
          id="yunaisy-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background with stars */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <div className="max-w-6xl mx-auto text-center mb-16">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text">
                  {t('yunaisyFarray_hero_title')}
                </h1>
                <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                  {t('yunaisyFarray_hero_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            {/* 3D Image Placeholder - Responsive */}
            <AnimateOnScroll delay={200}>
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative aspect-[3/4] md:aspect-square rounded-2xl overflow-hidden border-2 border-primary-accent/30 shadow-accent-glow bg-gradient-to-br from-primary-dark/30 to-black">
                  {/* Placeholder for image - will be replaced with actual photo */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-8xl mb-4 opacity-20">✨</div>
                      <p className="text-neutral/50 text-sm">Yunaisy Farray Photo</p>
                      <p className="text-neutral/30 text-xs mt-2">(3D Image Placeholder)</p>
                    </div>
                  </div>
                  {/* Holographic overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-accent/10 via-transparent to-primary-dark/10 pointer-events-none"></div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="pt-8 pb-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={100}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 md:p-12 shadow-lg hover:shadow-accent-glow/20 transition-shadow duration-500">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                    {t('yunaisyFarray_intro_title')}
                  </h2>
                  <div className="space-y-6 text-lg text-neutral/90 leading-relaxed">
                    <p className="text-xl font-semibold text-primary-accent">
                      {t('yunaisyFarray_intro_subtitle')}
                    </p>
                    <p>{t('yunaisyFarray_intro_p1')}</p>
                    <p>{t('yunaisyFarray_intro_p2')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Raíces en La Habana */}
        <section className="py-16 bg-gradient-to-b from-black via-primary-dark/5 to-black">
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

        {/* Carrera Internacional */}
        <section className="py-16 bg-black">
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
                    <p>{t('yunaisyFarray_career_p6')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Método Farray */}
        <section className="py-16 bg-gradient-to-b from-black via-primary-dark/5 to-black">
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
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Barcelona */}
        <section className="py-16 bg-black">
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
        <section className="py-16 bg-gradient-to-b from-black via-primary-dark/5 to-black">
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

        {/* Pionera Online */}
        <section className="py-16 bg-black">
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
        <section className="py-16 bg-gradient-to-b from-black via-primary-dark/5 to-black">
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
        <section className="py-16 bg-black">
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

        {/* CTA Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background with stars */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
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
                  <Link
                    to={`/${locale}#enroll`}
                    className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow min-w-[240px]"
                  >
                    {t('enrollNow')}
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
                  </Link>
                  <Link
                    to={`/${locale}/clases`}
                    className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white min-w-[240px]"
                  >
                    {t('yunaisyFarray_cta_classes')}
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default YunaisyFarrayPage;
