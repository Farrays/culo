/**
 * UbicacionPage - Cómo Llegar a Farray's International Dance Center
 *
 * Enterprise-level location page with:
 * - Full transport information (Metro, Bus, Train, Bike, Car)
 * - Time estimates from different Barcelona zones
 * - Interactive Google Maps
 * - FAQ with structured schema
 * - Accessibility information
 *
 * SEO: /como-llegar-escuela-baile-barcelona
 */

import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import FAQSection from './FAQSection';
import { MapPinIcon, ClockIcon, PhoneIcon, BuildingOfficeIcon } from '../lib/icons';

// ============================================================================
// CONSTANTS
// ============================================================================

const GOOGLE_MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.7083603486235!2d2.148014315104171!3d41.38042057926481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a49882fa7aaaa9%3A0x47a79ab582164caf!2sFarray%E2%80%99s+International+Dance+Center+-+Escuela+de+Salsa+Cubana%2C+Bailes+Sociales+y+Danza!5e1!3m2!1ses!2ses!4v1504633190526';

const GOOGLE_MAPS_LINK =
  'https://www.google.com/maps/place/Farray%E2%80%99s+International+Dance+Center/@41.380421,2.148014,17z';

// Transport icons as inline SVGs for better performance
const MetroIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 10H8v-1h2v-2H8V9h8v2h-2v2h2v1z" />
  </svg>
);

const BusIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
  </svg>
);

const TrainIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zm0 2c3.51 0 4.96.48 5.57 1H6.43c.61-.52 2.06-1 5.57-1zM6 7h5v3H6V7zm12 8.5c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5V12h12v3.5zm0-5.5h-5V7h5v3z" />
  </svg>
);

const BikeIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
  </svg>
);

const CarIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const ScooterIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M7.82 16H15v-1c0-2.21 1.79-4 4-4h.74l-1.9-8.44A2.009 2.009 0 0 0 15.89 1H12v2h3.89l1.4 6.25h-.01A6.008 6.008 0 0 0 13.09 14H7.82a2.996 2.996 0 0 0-5.82 1c0 1.66 1.34 3 3 3s3-1.34 3-3zm-2 1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm1-3c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

// ============================================================================
// TYPES
// ============================================================================

interface TransportOption {
  id: string;
  Icon: React.FC;
  titleKey: string;
  descKey: string;
  details: string[];
}

interface ZoneTime {
  zoneKey: string;
  timeKey: string;
}

// ============================================================================
// DATA
// ============================================================================

const TRANSPORT_OPTIONS: TransportOption[] = [
  {
    id: 'metro',
    Icon: MetroIcon,
    titleKey: 'ubicacion_metroTitle',
    descKey: 'ubicacion_metroDesc',
    details: ['ubicacion_metroL1', 'ubicacion_metroL3L5', 'ubicacion_metroTarragona'],
  },
  {
    id: 'bus',
    Icon: BusIcon,
    titleKey: 'ubicacion_busTitle',
    descKey: 'ubicacion_busDesc',
    details: ['ubicacion_busLines', 'ubicacion_busStop'],
  },
  {
    id: 'train',
    Icon: TrainIcon,
    titleKey: 'ubicacion_trainTitle',
    descKey: 'ubicacion_trainDesc',
    details: ['ubicacion_trainSants', 'ubicacion_trainFGC'],
  },
  {
    id: 'bike',
    Icon: BikeIcon,
    titleKey: 'ubicacion_bikeTitle',
    descKey: 'ubicacion_bikeDesc',
    details: ['ubicacion_bikeBicing', 'ubicacion_bikeParking', 'ubicacion_bikeLock'],
  },
  {
    id: 'car',
    Icon: CarIcon,
    titleKey: 'ubicacion_carTitle',
    descKey: 'ubicacion_carDesc',
    details: ['ubicacion_carParking', 'ubicacion_carAccess', 'ubicacion_carZone'],
  },
  {
    id: 'scooter',
    Icon: ScooterIcon,
    titleKey: 'ubicacion_scooterTitle',
    descKey: 'ubicacion_scooterDesc',
    details: ['ubicacion_scooterParking', 'ubicacion_scooterLock'],
  },
];

const ZONE_TIMES: ZoneTime[] = [
  { zoneKey: 'ubicacion_fromPlazaEspana', timeKey: 'ubicacion_fromPlazaEspanaTime' },
  { zoneKey: 'ubicacion_fromSants', timeKey: 'ubicacion_fromSantsTime' },
  { zoneKey: 'ubicacion_fromEixample', timeKey: 'ubicacion_fromEixampleTime' },
  { zoneKey: 'ubicacion_fromGracia', timeKey: 'ubicacion_fromGraciaTime' },
  { zoneKey: 'ubicacion_fromBarceloneta', timeKey: 'ubicacion_fromBarcelonetaTime' },
  { zoneKey: 'ubicacion_fromAeropuerto', timeKey: 'ubicacion_fromAeropuertoTime' },
];

const FAQ_KEYS = [
  { questionKey: 'ubicacion_faqQ1', answerKey: 'ubicacion_faqA1' },
  { questionKey: 'ubicacion_faqQ2', answerKey: 'ubicacion_faqA2' },
  { questionKey: 'ubicacion_faqQ3', answerKey: 'ubicacion_faqA3' },
  { questionKey: 'ubicacion_faqQ4', answerKey: 'ubicacion_faqA4' },
  { questionKey: 'ubicacion_faqQ5', answerKey: 'ubicacion_faqA5' },
];

// ============================================================================
// COMPONENT
// ============================================================================

const UbicacionPage: React.FC = () => {
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

  // Breadcrumb items
  const breadcrumbItems = useMemo(
    () => [
      { name: t('ubicacion_breadcrumbHome'), url: `/${locale}` },
      { name: t('ubicacion_breadcrumbCurrent'), url: '' },
    ],
    [t, locale]
  );

  // Schema Markup
  const breadcrumbSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('ubicacion_breadcrumbHome'),
          item: `${baseUrl}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('ubicacion_breadcrumbCurrent'),
          item: `${baseUrl}/${locale}/como-llegar-escuela-baile-barcelona`,
        },
      ],
    }),
    [t, locale, baseUrl]
  );

  const localBusinessSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#organization`,
      name: "Farray's International Dance Center",
      description: t('ubicacion_pageDescription'),
      url: baseUrl,
      telephone: '+34622247085',
      email: 'info@farrayscenter.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: "Carrer d'Entença, 100, Local 1",
        addressLocality: 'Barcelona',
        postalCode: '08015',
        addressCountry: 'ES',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 41.380421,
        longitude: 2.148014,
      },
      hasMap: GOOGLE_MAPS_LINK,
      areaServed: [
        { '@type': 'City', name: 'Barcelona' },
        { '@type': 'AdministrativeArea', name: 'Eixample' },
        { '@type': 'AdministrativeArea', name: 'Sants-Montjuïc' },
        { '@type': 'AdministrativeArea', name: 'Les Corts' },
        { '@type': 'AdministrativeArea', name: 'Poble Sec' },
        { '@type': 'AdministrativeArea', name: 'Sant Antoni' },
      ],
      publicAccess: true,
      isAccessibleForFree: false,
    }),
    [t, baseUrl]
  );

  const faqSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_KEYS.map(faq => ({
        '@type': 'Question',
        name: t(faq.questionKey),
        acceptedAnswer: {
          '@type': 'Answer',
          text: t(faq.answerKey),
        },
      })),
    }),
    [t]
  );

  return (
    <>
      <Helmet>
        <title>{t('ubicacion_pageTitle')}</title>
        <meta name="description" content={t('ubicacion_pageDescription')} />
        <link rel="canonical" href={`${baseUrl}/${locale}/como-llegar-escuela-baile-barcelona`} />
        <meta property="og:title" content={t('ubicacion_pageTitle')} />
        <meta property="og:description" content={t('ubicacion_pageDescription')} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${baseUrl}/${locale}/como-llegar-escuela-baile-barcelona`}
        />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-black pt-28 md:pt-32">
        {/* ================================================================
            HERO SECTION
        ================================================================ */}
        <header className="relative py-16 md:py-24 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/20 via-black to-black" />

          <div className="container mx-auto px-6 relative z-10">
            <Breadcrumb items={breadcrumbItems} />

            <AnimateOnScroll>
              <div className="text-center max-w-4xl mx-auto mt-8">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('ubicacion_heroTitle')}
                </h1>
                <p className="text-xl md:text-2xl text-neutral/90 mb-8">
                  {t('ubicacion_heroSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </header>

        {/* ================================================================
            ADDRESS + MAP SECTION
        ================================================================ */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Left: Address Card */}
              <div className="w-full lg:w-1/3">
                <AnimateOnScroll>
                  <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8 h-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-primary-accent/20 p-4 rounded-xl">
                        <MapPinIcon className="h-8 w-8 text-primary-accent" />
                      </div>
                      <h2 className="text-2xl font-bold text-neutral">
                        {t('ubicacion_addressTitle')}
                      </h2>
                    </div>

                    <address className="not-italic text-neutral/90 text-lg leading-relaxed mb-6">
                      <p className="font-semibold text-neutral mb-1">
                        Farray&apos;s International Dance Center
                      </p>
                      <p>{t('ubicacion_addressFull')}</p>
                      <p>{t('ubicacion_addressCity')}</p>
                    </address>

                    <a
                      href={GOOGLE_MAPS_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full bg-primary-accent text-white font-bold py-4 px-6 rounded-full transition-all duration-300 hover:bg-primary-accent/80 hover:scale-105"
                    >
                      <MapPinIcon className="h-5 w-5 mr-2" />
                      {t('ubicacion_openMapsButton')}
                    </a>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Right: Map */}
              <div className="w-full lg:w-2/3 h-[400px] lg:h-[450px]">
                <AnimateOnScroll delay={100}>
                  <div className="overflow-hidden rounded-2xl border-2 border-primary-dark/50 shadow-lg h-full">
                    <iframe
                      src={GOOGLE_MAPS_EMBED_URL}
                      className="w-full h-full border-0"
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Farray's International Dance Center - Mapa de ubicación"
                    />
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            INTRO SEO SECTION
        ================================================================ */}
        <section className="py-10 md:py-12 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <AnimateOnScroll>
                <p
                  className="text-lg md:text-xl text-neutral/90 leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: t('ubicacion_introP1') }}
                />
              </AnimateOnScroll>
              <AnimateOnScroll delay={100}>
                <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
                  {t('ubicacion_introP2')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================
            TRANSPORT OPTIONS SECTION
        ================================================================ */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('ubicacion_transportTitle')}
                </h2>
                <p className="text-lg text-neutral/90">{t('ubicacion_transportSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {TRANSPORT_OPTIONS.map((transport, index) => (
                <AnimateOnScroll key={transport.id} delay={index * 50}>
                  <div className="group bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-6 h-full transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-primary-accent/20 p-3 rounded-xl text-primary-accent transition-all duration-300 group-hover:bg-primary-accent/30 group-hover:scale-110">
                        <transport.Icon />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral group-hover:text-primary-accent transition-colors">
                        {t(transport.titleKey)}
                      </h3>
                    </div>

                    <p className="text-neutral/80 mb-4 leading-relaxed">{t(transport.descKey)}</p>

                    <ul className="space-y-2">
                      {transport.details.map(detailKey => (
                        <li key={detailKey} className="flex items-start gap-2 text-neutral/90">
                          <span className="text-primary-accent mt-1">•</span>
                          <span>{t(detailKey)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            FROM YOUR ZONE SECTION
        ================================================================ */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('ubicacion_fromZonesTitle')}
                </h2>
                <p className="text-lg text-neutral/90">{t('ubicacion_fromZonesSubtitle')}</p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {ZONE_TIMES.map((zone, index) => (
                <AnimateOnScroll key={zone.zoneKey} delay={index * 50}>
                  <div className="bg-primary-dark/20 border border-primary-dark/40 rounded-xl p-5 h-full transition-all duration-300 hover:border-primary-accent/50 hover:bg-primary-dark/30">
                    <div className="flex items-start gap-3 mb-2">
                      <ClockIcon className="h-5 w-5 text-primary-accent flex-shrink-0 mt-0.5" />
                      <span className="text-neutral font-medium text-sm leading-tight">
                        {t(zone.zoneKey)}
                      </span>
                    </div>
                    <div className="pl-8">
                      <span className="text-primary-accent font-bold text-lg">
                        {t(zone.timeKey)}
                      </span>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            PARKING SECTION
        ================================================================ */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <AnimateOnScroll>
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                    {t('ubicacion_parkingTitle')}
                  </h2>
                  <p className="text-lg text-neutral/90">{t('ubicacion_parkingSubtitle')}</p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={100}>
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        <CarIcon />
                        <div>
                          <h3 className="text-xl font-bold text-neutral mb-2">Parking Público</h3>
                          <p className="text-neutral/80">{t('ubicacion_parkingPublic')}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-start gap-3 mb-4">
                        <BuildingOfficeIcon className="h-8 w-8 text-primary-accent flex-shrink-0" />
                        <div>
                          <h3 className="text-xl font-bold text-neutral mb-2">Zona Azul</h3>
                          <p className="text-neutral/80">{t('ubicacion_parkingZonaAzul')}</p>
                          <p className="text-primary-accent font-medium mt-2">
                            {t('ubicacion_parkingTip')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================
            ACCESSIBILITY SECTION
        ================================================================ */}
        <section className="py-10 md:py-12 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <AnimateOnScroll>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral mb-4">
                  {t('ubicacion_accessibilityTitle')}
                </h2>
                <p className="text-neutral/80 text-lg">{t('ubicacion_accessibilityDesc')}</p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================
            FAQ SECTION
        ================================================================ */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('ubicacion_faqTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-3xl mx-auto">
              <FAQSection
                title={t('ubicacion_faqTitle')}
                pageUrl={`https://www.farrayscenter.com/${locale}/como-llegar-escuela-baile-barcelona`}
                faqs={FAQ_KEYS.map((faq, index) => ({
                  id: `ubicacion-faq-${index + 1}`,
                  question: t(faq.questionKey),
                  answer: t(faq.answerKey),
                }))}
              />
            </div>
          </div>
        </section>

        {/* ================================================================
            CTA SECTION
        ================================================================ */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-black via-primary-dark/20 to-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('ubicacion_ctaTitle')}
                </h2>
                <p className="text-xl text-neutral/90 mb-8">{t('ubicacion_ctaSubtitle')}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={`/${locale}/reservas`}
                    className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent/80 hover:scale-105 shadow-accent-glow"
                  >
                    {t('ubicacion_ctaButtonPrimary')}
                  </Link>
                  <Link
                    to={`/${locale}/contacto`}
                    className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                  >
                    <PhoneIcon className="h-5 w-5 mr-2" />
                    {t('ubicacion_ctaButtonSecondary')}
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

export default UbicacionPage;
