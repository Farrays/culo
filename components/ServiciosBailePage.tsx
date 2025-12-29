import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import {
  KeyIcon,
  CameraIcon,
  SparklesIcon,
  UserIcon,
  PlayCircleIcon,
  BuildingOfficeIcon,
  HeartIcon,
  CalendarDaysIcon,
  ShoppingBagIcon,
} from '../lib/icons';

interface ServiceCard {
  id: string;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  titleKey: string;
  descriptionKey: string;
  ctaKey: string;
  url: string;
}

const ServiciosBailePage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  const servicesData: ServiceCard[] = [
    {
      id: 'rental',
      Icon: KeyIcon,
      titleKey: 'serviceRentalTitle',
      descriptionKey: 'serviceRentalDesc',
      ctaKey: 'serviceRentalCTA',
      url: `/${locale}/alquiler-salas`,
    },
    {
      id: 'photo',
      Icon: CameraIcon,
      titleKey: 'servicePhotoTitle',
      descriptionKey: 'servicePhotoDesc',
      ctaKey: 'servicePhotoCTA',
      url: `/${locale}/contacto`,
    },
    {
      id: 'parties',
      Icon: SparklesIcon,
      titleKey: 'servicePartiesTitle',
      descriptionKey: 'servicePartiesDesc',
      ctaKey: 'servicePartiesCTA',
      url: `/${locale}/contacto`,
    },
    {
      id: 'private',
      Icon: UserIcon,
      titleKey: 'servicePrivateTitle',
      descriptionKey: 'servicePrivateDesc',
      ctaKey: 'servicePrivateCTA',
      url: `/${locale}/clases-particulares-baile`,
    },
    {
      id: 'agency',
      Icon: PlayCircleIcon,
      titleKey: 'serviceAgencyTitle',
      descriptionKey: 'serviceAgencyDesc',
      ctaKey: 'serviceAgencyCTA',
      url: `/${locale}/contacto`,
    },
    {
      id: 'corporate',
      Icon: BuildingOfficeIcon,
      titleKey: 'serviceCorporateTitle',
      descriptionKey: 'serviceCorporateDesc',
      ctaKey: 'serviceCorporateCTA',
      url: `/${locale}/contacto`,
    },
    {
      id: 'gift',
      Icon: HeartIcon,
      titleKey: 'serviceGiftTitle',
      descriptionKey: 'serviceGiftDesc',
      ctaKey: 'serviceGiftCTA',
      url: `/${locale}/regala-baile`,
    },
    {
      id: 'events',
      Icon: CalendarDaysIcon,
      titleKey: 'serviceEventsTitle',
      descriptionKey: 'serviceEventsDesc',
      ctaKey: 'serviceEventsCTA',
      url: `/${locale}/contacto`,
    },
    {
      id: 'merchandising',
      Icon: ShoppingBagIcon,
      titleKey: 'serviceMerchandisingTitle',
      descriptionKey: 'serviceMerchandisingDesc',
      ctaKey: 'serviceMerchandisingCTA',
      url: `/${locale}/merchandising`,
    },
  ];

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('serviciosBaile_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('serviciosBaile_breadcrumb_current'),
        item: `${baseUrl}/${locale}/servicios-baile`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('serviciosBaile_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('serviciosBaile_breadcrumb_current'),
      url: `/${locale}/servicios-baile`,
      isActive: true,
    },
  ];

  // Schema Markup - ItemList
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: "Servicios de Baile en Barcelona - Farray's Center",
    itemListElement: servicesData.map((service, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: t(service.titleKey),
      url: `${baseUrl}${service.url}`,
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section
          id="servicios-baile-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            {/* H1 + Intro */}
            <AnimateOnScroll>
              <h1
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {t('serviciosBaile_h1')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('serviciosBaile_intro')}
              </p>
            </AnimateOnScroll>

            {/* CTA Buttons */}
            <AnimateOnScroll delay={200}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}#enroll`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
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
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('contact')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Services Grid Section */}
        <section aria-labelledby="services-title" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2
                  id="services-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('serviciosBaile_services_title')}
                </h2>
                <p className="text-lg text-neutral/90">{t('serviciosBaile_services_subtitle')}</p>
              </div>
            </AnimateOnScroll>
            <div className="flex flex-wrap justify-center -m-4">
              {servicesData.map((service, index) => (
                <div key={service.id} className="w-full md:w-1/2 lg:w-1/3 p-4">
                  <AnimateOnScroll delay={index * 100} className="h-full">
                    <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full flex flex-col">
                      <div className="mb-6">
                        <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <service.Icon className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                        {t(service.titleKey)}
                      </h3>
                      <p className="text-neutral/90 leading-relaxed flex-grow mb-6 group-hover:text-neutral/90 transition-colors duration-300">
                        {t(service.descriptionKey)}
                      </p>
                      <div className="mt-auto">
                        <Link
                          to={service.url}
                          className="inline-flex items-center gap-2 font-bold text-primary-accent hover:text-white transition-all duration-300 group-hover:gap-4 focus:outline-none focus:ring-2 focus:ring-primary-accent/50 rounded-lg p-2 -m-2"
                          aria-label={`${t(service.titleKey)} - ${t(service.ctaKey)}`}
                        >
                          <span>{t(service.ctaKey)}</span>
                          <span
                            className="inline-block transition-all duration-300 group-hover:translate-x-1 group-hover:scale-125"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          {/* Background with stars */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                  {t('serviciosBaile_finalCTA_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                  {t('serviciosBaile_finalCTA_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}/contacto`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('contact')}
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
                  to={`/${locale}#enroll`}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                >
                  {t('enrollNow')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServiciosBailePage;
