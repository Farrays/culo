import React from 'react';
import { useI18n } from '../hooks/useI18n';
import type { ServiceInfo } from '../types';
import AnimateOnScroll from './AnimateOnScroll';

// --- New, more professional and intuitive icons ---

// For "Alquiler de Salas" (Room Rentals)
const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
    />
  </svg>
);

// For "Grabaciones y Fotografía" (Recording & Photography)
const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
    />
  </svg>
);

// For "Fiestas y Despedidas" (Parties & Events)
const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
    />
  </svg>
);

// For "Clases Particulares" (Private Classes)
const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

// For "Agencia y Productora" (Agency & Production)
const PlayCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
    />
  </svg>
);

// For "Servicios para Empresas" (Corporate Services)
const BuildingOfficeIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 12h6m-6 5.25h6M5.25 6h.008v.008H5.25V6zm.75 0h.008v.008H6V6zm.75 0h.008v.008H6.75V6zm.75 0h.008v.008H7.5V6zm.75 0h.008v.008H8.25V6zm.75 0h.008v.008H9V6zm.75 0h.008v.008H9.75V6zm.75 0h.008v.008H10.5V6zm.75 0h.008v.008H11.25V6zm.75 0h.008v.008H12V6zm.75 0h.008v.008H12.75V6zm.75 0h.008v.008H13.5V6zm.75 0h.008v.008H14.25V6zm.75 0h.008v.008H15V6zm.75 0h.008v.008H15.75V6zm.75 0h.008v.008H16.5V6zm.75 0h.008v.008H17.25V6zm.75 0h.008v.008H18V6zm.75 0h.008v.008H18.75V6z"
    />
  </svg>
);

// For "Regala Baile" (Gift of Dance)
const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
    />
  </svg>
);

// For "Agencia de Eventos" (Event Agency)
const CalendarDaysIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
    />
  </svg>
);

// For "Merchandising de la Academia" (Academy Merchandising)
const ShoppingBagIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
    />
  </svg>
);

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
