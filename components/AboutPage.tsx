import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import Icon, { type IconName } from './Icon';

// Value pillars for "Why Farray's" section
interface ValuePillar {
  id: string;
  titleKey: string;
  contentKey: string;
  iconName: IconName;
}

const valuePillars: ValuePillar[] = [
  {
    id: 'love',
    titleKey: 'about_value_love_title',
    contentKey: 'about_value_love_content',
    iconName: 'heart',
  },
  {
    id: 'community',
    titleKey: 'about_value_community_title',
    contentKey: 'about_value_community_content',
    iconName: 'users',
  },
  {
    id: 'wellbeing',
    titleKey: 'about_value_wellbeing_title',
    contentKey: 'about_value_wellbeing_content',
    iconName: 'sparkles',
  },
  {
    id: 'opportunities',
    titleKey: 'about_value_opportunities_title',
    contentKey: 'about_value_opportunities_content',
    iconName: 'trophy',
  },
  {
    id: 'social',
    titleKey: 'about_value_social_title',
    contentKey: 'about_value_social_content',
    iconName: 'globe',
  },
  {
    id: 'excellence',
    titleKey: 'about_value_excellence_title',
    contentKey: 'about_value_excellence_content',
    iconName: 'star',
  },
];

const AboutPage: React.FC = () => {
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
        name: t('about_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('about_breadcrumb_current'),
        item: `${baseUrl}/${locale}/sobre-nosotros`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('about_breadcrumb_home'), url: `/${locale}` },
    { name: t('about_breadcrumb_current'), url: `/${locale}/sobre-nosotros`, isActive: true },
  ];

  // Schema Markup - Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'DanceSchool',
    name: "Farray's International Dance Center",
    description: t('about_description'),
    foundingDate: '2017',
    founder: {
      '@type': 'Person',
      name: 'Yunaisy Farray',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: "Carrer d'Entença, 100, Local 1",
      addressLocality: 'Barcelona',
      addressRegion: 'Catalonia',
      postalCode: '08015',
      addressCountry: 'ES',
    },
    areaServed: 'Barcelona',
    numberOfEmployees: '20+',
    slogan: t('about_slogan'),
  };

  return (
    <>
      <Helmet>
        <title>{t('about_page_title')} | Farray&apos;s Center</title>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section
          id="about-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text">
                {t('about_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('about_intro')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}#enroll`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
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
                  to={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('about_cta_contact')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Our Story Section */}
        <section aria-labelledby="our-story-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="our-story-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-12 text-center holographic-text"
                >
                  {t('about_story_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
              <AnimateOnScroll delay={100}>
                <p className="text-lg">{t('about_story_p1')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={200}>
                <p className="text-lg">{t('about_story_p2')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={300}>
                <p className="text-lg">{t('about_story_p3')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={400}>
                <p className="text-lg font-semibold text-primary-accent">
                  {t('about_story_highlight')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Yunaisy's Vision Section */}
        <section
          aria-labelledby="vision-title"
          className="py-16 md:py-24 bg-gradient-to-br from-primary-dark/10 via-black to-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="vision-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-12 text-center holographic-text"
                >
                  {t('about_vision_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
              <AnimateOnScroll delay={100}>
                <p className="text-lg">{t('about_vision_p1')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={200}>
                <p className="text-lg">{t('about_vision_p2')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={300}>
                <p className="text-lg">{t('about_vision_p3')}</p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Today's Farray's Section */}
        <section aria-labelledby="today-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="today-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-12 text-center holographic-text"
                >
                  {t('about_today_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto mb-12">
              <AnimateOnScroll delay={100}>
                <p className="text-lg text-neutral/90 leading-relaxed text-center">
                  {t('about_today_intro')}
                </p>
              </AnimateOnScroll>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              <AnimateOnScroll delay={100}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 text-center hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full min-h-[120px]">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4">
                    700m²
                  </div>
                  <div className="text-lg text-neutral/90">{t('about_stat_space')}</div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 text-center hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full min-h-[120px]">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4">
                    1500+
                  </div>
                  <div className="text-lg text-neutral/90">{t('about_stat_active_students')}</div>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 text-center hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full min-h-[120px]">
                  <div className="text-5xl md:text-6xl font-black text-primary-accent mb-4">
                    15.000+
                  </div>
                  <div className="text-lg text-neutral/90">{t('about_stat_total_students')}</div>
                </div>
              </AnimateOnScroll>
            </div>

            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll delay={400}>
                <p className="text-lg text-neutral/90 leading-relaxed">
                  {t('about_today_description')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section
          aria-labelledby="mission-title"
          className="py-16 md:py-24 bg-gradient-to-br from-primary-dark/10 via-black to-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="mission-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-12 text-center holographic-text"
                >
                  {t('about_mission_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
              <AnimateOnScroll delay={100}>
                <p className="text-lg">{t('about_mission_p1')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={200}>
                <p className="text-lg">{t('about_mission_p2')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={300}>
                <p className="text-lg font-semibold text-primary-accent">
                  {t('about_mission_highlight')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Social Impact Section */}
        <section aria-labelledby="social-impact-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="social-impact-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-12 text-center holographic-text"
                >
                  {t('about_social_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
              <AnimateOnScroll delay={100}>
                <p className="text-lg">{t('about_social_p1')}</p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={200}>
                <p className="text-lg">{t('about_social_p2')}</p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section
          aria-labelledby="values-title"
          className="py-16 md:py-24 bg-gradient-to-br from-primary-dark/10 via-black to-black"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="values-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-center holographic-text"
                >
                  {t('about_values_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <p className="max-w-3xl mx-auto text-center text-lg text-neutral/90 mb-16">
                {t('about_values_intro')}
              </p>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {valuePillars.map((pillar, index) => (
                <AnimateOnScroll key={pillar.id} delay={index * 100}>
                  <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full min-h-[180px] flex flex-col">
                    <div className="mb-6 flex justify-center">
                      <div className="bg-primary-dark/30 p-4 rounded-2xl">
                        <Icon name={pillar.iconName} className="h-12 w-12 text-primary-accent" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-4 text-center">
                      {t(pillar.titleKey)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed text-center flex-grow">
                      {t(pillar.contentKey)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Statement Section */}
        <section className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <AnimateOnScroll>
                <p className="text-2xl md:text-3xl font-bold text-neutral leading-relaxed">
                  {t('about_closing_statement')}
                </p>
              </AnimateOnScroll>
              <AnimateOnScroll delay={200}>
                <p className="text-xl text-primary-accent font-semibold">
                  {t('about_closing_tagline')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                  {t('about_final_cta_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                  {t('about_final_cta_subtitle')}
                </p>
                <p className="max-w-xl mx-auto text-lg text-neutral/75 mb-10">
                  {t('about_final_cta_description')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}#enroll`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow"
                >
                  {t('enrollNow')}
                  <svg
                    className="w-6 h-6 ml-2"
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
                  to={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('about_cta_contact')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
