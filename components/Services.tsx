import React from 'react';
import { useI18n } from '../hooks/useI18n';
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

const servicesData: ServiceInfo[] = [
  {
    id: 'rental',
    Icon: KeyIcon,
    titleKey: 'serviceRentalTitle',
    descriptionKey: 'serviceRentalDesc',
    ctaKey: 'serviceRentalCTA',
  },
  {
    id: 'photo',
    Icon: CameraIcon,
    titleKey: 'servicePhotoTitle',
    descriptionKey: 'servicePhotoDesc',
    ctaKey: 'servicePhotoCTA',
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
  },
  {
    id: 'gift',
    Icon: HeartIcon,
    titleKey: 'serviceGiftTitle',
    descriptionKey: 'serviceGiftDesc',
    ctaKey: 'serviceGiftCTA',
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
  },
];

const Services: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="services" className="py-20 md:py-32 bg-primary-dark/10">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t('servicesTitle')}
            </h2>
            <p className="text-lg text-neutral/90">{t('servicesIntro')}</p>
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
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
