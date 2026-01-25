import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ValuePillar } from '../types';
import AnimateOnScroll from './AnimateOnScroll';

// --- Icon Set for 7 Pillars ---

// 1. World-Class Instructors
const GlobeEuropeAfricaIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
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
      d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.111 1.157-4.418"
    />
  </svg>
);

// 2. Exclusive 'Método Farray®'
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

// 3. 700 m² Premium Facilities
const BuildingOffice2Icon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
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

// 4. Family Atmosphere & Events
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

// 5. Total Flexibility
const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
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
      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

// 6. CID-UNESCO Prestige
const AcademicCapIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
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
      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
    />
  </svg>
);

// 7. Privileged Location
const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </svg>
);

const valuePillars: ValuePillar[] = [
  {
    id: 'instructors',
    titleKey: 'whyPillar1Title',
    contentKey: 'whyPillar1Content',
    Icon: GlobeEuropeAfricaIcon,
  },
  {
    id: 'method',
    titleKey: 'whyPillar2Title',
    contentKey: 'whyPillar2Content',
    Icon: SparklesIcon,
  },
  {
    id: 'facilities',
    titleKey: 'whyPillar3Title',
    contentKey: 'whyPillar3Content',
    Icon: BuildingOffice2Icon,
  },
  {
    id: 'atmosphere',
    titleKey: 'whyPillar4Title',
    contentKey: 'whyPillar4Content',
    Icon: HeartIcon,
  },
  {
    id: 'flexibility',
    titleKey: 'whyPillar5Title',
    contentKey: 'whyPillar5Content',
    Icon: ClockIcon,
  },
  {
    id: 'prestige',
    titleKey: 'whyPillar6Title',
    contentKey: 'whyPillar6Content',
    Icon: AcademicCapIcon,
  },
  {
    id: 'location',
    titleKey: 'whyPillar7Title',
    contentKey: 'whyPillar7Content',
    Icon: MapPinIcon,
  },
];

const WhyFIDC: React.FC = () => {
  const { t } = useTranslation(['common']);

  return (
    <section id="why-fidc" className="relative py-12 md:py-16 bg-black overflow-hidden">
      {/* Background - Enterprise pattern */}
      <div className="absolute inset-0 bg-black">
        {/* Background image with configurable opacity */}
        <div className="absolute inset-0" style={{ opacity: 0.2 }}>
          <picture>
            <source srcSet="/images/optimized/mgs_4151.webp" type="image/webp" />
            <img
              src="/images/optimized/mgs_4151.jpg"
              alt={t('why_fidc_bg_alt')}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center 30%' }}
              loading="lazy"
            />
          </picture>
        </div>
        {/* Gradient overlays for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <AnimateOnScroll>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2
              id="why-fidc-title"
              className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
              data-speakable="true"
            >
              {t('whyTitle')}
            </h2>
          </div>
        </AnimateOnScroll>
        <div className="flex flex-wrap justify-center -m-4">
          {valuePillars.map((pillar, index) => (
            <div key={pillar.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
              <AnimateOnScroll delay={index * 100} className="h-full">
                <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full flex flex-col">
                  <div className="mb-6">
                    <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <pillar.Icon className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                    {t(pillar.titleKey)}
                  </h3>
                  <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                    {t(pillar.contentKey)}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFIDC;
