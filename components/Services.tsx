import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ServiceInfo } from '../types';
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

// Extended type with optional route
interface ExtendedServiceInfo extends ServiceInfo {
  route?: string; // If set, uses Link instead of anchor
}

const servicesData: ExtendedServiceInfo[] = [
  {
    id: 'rental',
    Icon: KeyIcon,
    titleKey: 'serviceRentalTitle',
    descriptionKey: 'serviceRentalDesc',
    ctaKey: 'serviceRentalCTA',
    route: 'alquiler-salas-baile-barcelona',
  },
  {
    id: 'photo',
    Icon: CameraIcon,
    titleKey: 'servicePhotoTitle',
    descriptionKey: 'servicePhotoDesc',
    ctaKey: 'servicePhotoCTA',
    route: 'estudio-grabacion-barcelona',
  },
  {
    id: 'parties',
    Icon: SparklesIcon,
    titleKey: 'servicePartiesTitle',
    descriptionKey: 'servicePartiesDesc',
    ctaKey: 'servicePartiesCTA',
  },
  {
    id: 'private',
    Icon: UserIcon,
    titleKey: 'servicePrivateTitle',
    descriptionKey: 'servicePrivateDesc',
    ctaKey: 'servicePrivateCTA',
    route: 'clases-particulares-baile',
  },
  {
    id: 'agency',
    Icon: PlayCircleIcon,
    titleKey: 'serviceAgencyTitle',
    descriptionKey: 'serviceAgencyDesc',
    ctaKey: 'serviceAgencyCTA',
  },
  {
    id: 'corporate',
    Icon: BuildingOfficeIcon,
    titleKey: 'serviceCorporateTitle',
    descriptionKey: 'serviceCorporateDesc',
    ctaKey: 'serviceCorporateCTA',
    route: 'team-building-barcelona',
  },
  {
    id: 'gift',
    Icon: HeartIcon,
    titleKey: 'serviceGiftTitle',
    descriptionKey: 'serviceGiftDesc',
    ctaKey: 'serviceGiftCTA',
    route: 'regala-baile',
  },
  {
    id: 'events',
    Icon: CalendarDaysIcon,
    titleKey: 'serviceEventsTitle',
    descriptionKey: 'serviceEventsDesc',
    ctaKey: 'serviceEventsCTA',
  },
  {
    id: 'merchandising',
    Icon: ShoppingBagIcon,
    titleKey: 'serviceMerchandisingTitle',
    descriptionKey: 'serviceMerchandisingDesc',
    ctaKey: 'serviceMerchandisingCTA',
    route: 'merchandising',
  },
];

// IDs de los 3 servicios destacados para la homepage
const FEATURED_SERVICE_IDS = ['rental', 'corporate', 'gift'];

interface ServicesProps {
  showAll?: boolean;
}

const Services: React.FC<ServicesProps> = ({ showAll = false }) => {
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

  // Filtrar servicios: solo los destacados o todos
  const displayedServices = showAll
    ? servicesData
    : servicesData.filter(s => FEATURED_SERVICE_IDS.includes(s.id));

  return (
    <section id="services" className="py-12 md:py-16 bg-primary-dark/10">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2
              id="services-title"
              className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
              data-speakable="true"
            >
              {t('servicesTitle')}
            </h2>
            <p id="services-intro" className="text-lg text-neutral/90" data-speakable="true">
              {t('servicesIntro')}
            </p>
          </div>
        </AnimateOnScroll>
        <div className="flex flex-wrap justify-center -m-4">
          {displayedServices.map((service, index) => (
            <div key={service.id} className="w-full md:w-1/2 lg:w-1/3 p-4 [perspective:1000px]">
              <AnimateOnScroll delay={index * 100} className="h-full">
                <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow h-full flex flex-col">
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
                    {service.route ? (
                      <Link
                        to={`/${locale}/${service.route}`}
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
                    ) : (
                      <a
                        href={`#${service.id}`}
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
                      </a>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          ))}
        </div>

        {/* Botón "Ver todos los servicios" - solo cuando no se muestran todos */}
        {!showAll && (
          <AnimateOnScroll delay={400}>
            <div className="text-center mt-12">
              <Link
                to={`/${locale}/servicios-baile-barcelona`}
                className="group inline-flex items-center gap-3 bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
              >
                <span>{t('servicesViewAll')}</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
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
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
};

export default Services;
