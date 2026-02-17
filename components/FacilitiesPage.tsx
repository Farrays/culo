import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import FacilitiesHero from './FacilitiesHero';
import FacilityCard, { type FacilityRoom } from './FacilityCard';
import FacilityFeatureList from './FacilityFeatureList';
import SocialAmenities from './SocialAmenities';
import FacilitiesFullGallery from './FacilitiesFullGallery';
import FAQSection from './FAQSection';
import { ReviewsSection } from './reviews';
import AnimateOnScroll from './AnimateOnScroll';
import AnimatedCounter from './AnimatedCounter';
import { LocalBusinessSchema } from './SchemaMarkup';
import { REVIEW_STATS } from '../constants/reviews-config';

const FacilitiesPage: React.FC = () => {
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
  const pageUrl = `${baseUrl}/${locale}/instalaciones-escuela-baile-barcelona`;

  // 4 salas profesionales con galerías de imágenes
  // Mapeo corregido según fotos reales en cada carpeta
  const rooms: FacilityRoom[] = [
    {
      id: 'room-1',
      titleKey: 'facilitiesRoom1Title',
      sizeKey: 'facilitiesRoom1Size',
      floorTypeKey: 'facilitiesRoom1Floor',
      descKey: 'facilitiesRoom1Desc',
      icon: 'xlarge',
      areaId: 'salaB', // 120m² usa fotos de carpeta salaB
      imageCount: 3,
    },
    {
      id: 'room-2',
      titleKey: 'facilitiesRoom2Title',
      sizeKey: 'facilitiesRoom2Size',
      floorTypeKey: 'facilitiesRoom2Floor',
      descKey: 'facilitiesRoom2Desc',
      icon: 'large',
      areaId: 'salaD', // Ballet usa fotos de carpeta salaD
      imageCount: 3,
    },
    {
      id: 'room-3',
      titleKey: 'facilitiesRoom3Title',
      sizeKey: 'facilitiesRoom3Size',
      floorTypeKey: 'facilitiesRoom3Floor',
      descKey: 'facilitiesRoom3Desc',
      icon: 'large',
      areaId: 'salaC', // Latinos/Urbanos usa fotos de carpeta salaC
      imageCount: 3,
    },
    {
      id: 'room-4',
      titleKey: 'facilitiesRoom4Title',
      sizeKey: 'facilitiesRoom4Size',
      floorTypeKey: 'facilitiesRoom4Floor',
      descKey: 'facilitiesRoom4Desc',
      icon: 'large',
      areaId: 'salaA', // Fitness usa fotos de carpeta salaA
      imageCount: 3,
    },
  ];

  // Equipment features
  const equipmentFeatures = [
    {
      id: 'eq-1',
      titleKey: 'facilitiesEq1Title',
      descKey: 'facilitiesEq1Desc',
      icon: 'floor' as const,
    },
    {
      id: 'eq-2',
      titleKey: 'facilitiesEq2Title',
      descKey: 'facilitiesEq2Desc',
      icon: 'mirror' as const,
    },
    {
      id: 'eq-3',
      titleKey: 'facilitiesEq3Title',
      descKey: 'facilitiesEq3Desc',
      icon: 'ac' as const,
    },
    {
      id: 'eq-4',
      titleKey: 'facilitiesEq4Title',
      descKey: 'facilitiesEq4Desc',
      icon: 'barre' as const,
    },
    {
      id: 'eq-5',
      titleKey: 'facilitiesEq5Title',
      descKey: 'facilitiesEq5Desc',
      icon: 'fitness' as const,
    },
    {
      id: 'eq-6',
      titleKey: 'facilitiesEq6Title',
      descKey: 'facilitiesEq6Desc',
      icon: 'audio' as const,
    },
  ];

  // Social amenities con galería para el bar
  const amenities = [
    {
      id: 'am-1',
      titleKey: 'facilitiesAm1Title',
      descKey: 'facilitiesAm1Desc',
      icon: 'bar' as const,
      showGallery: true,
      galleryAreaId: 'bar' as const,
      galleryImageCount: 4,
    },
    {
      id: 'am-2',
      titleKey: 'facilitiesAm2Title',
      descKey: 'facilitiesAm2Desc',
      icon: 'locker' as const,
      showGallery: true,
      galleryAreaId: 'vestuario' as const,
      galleryImageCount: 4,
    },
    {
      id: 'am-3',
      titleKey: 'facilitiesAm3Title',
      descKey: 'facilitiesAm3Desc',
      icon: 'wifi' as const,
    },
  ];

  // FAQs optimized for AI search engines
  const facilitiesFaqs = [
    { id: 'fac-faq-1', question: t('facilitiesFaqQ1'), answer: t('facilitiesFaqA1') },
    { id: 'fac-faq-2', question: t('facilitiesFaqQ2'), answer: t('facilitiesFaqA2') },
    { id: 'fac-faq-3', question: t('facilitiesFaqQ3'), answer: t('facilitiesFaqA3') },
    { id: 'fac-faq-4', question: t('facilitiesFaqQ4'), answer: t('facilitiesFaqA4') },
    { id: 'fac-faq-5', question: t('facilitiesFaqQ5'), answer: t('facilitiesFaqA5') },
    { id: 'fac-faq-6', question: t('facilitiesFaqQ6'), answer: t('facilitiesFaqA6') },
    { id: 'fac-faq-7', question: t('facilitiesFaqQ7'), answer: t('facilitiesFaqA7') },
  ];

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('facilitiesBreadcrumbHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('facilitiesBreadcrumbCurrent'),
        item: pageUrl,
      },
    ],
  };

  // Place Schema for the facility
  const placeSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: "Farray's International Dance Center",
    description: t('facilitiesMetaDescription'),
    url: pageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: t('schema_streetAddress'),
      addressLocality: 'Barcelona',
      postalCode: '08015',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.380421',
      longitude: '2.148014',
    },
    amenityFeature: [
      {
        '@type': 'LocationFeatureSpecification',
        name: t('schema_facilities_danceStudios'),
        value: t('schema_facilities_danceStudiosValue'),
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: t('schema_facilities_totalArea'),
        value: '700+ m²',
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: t('schema_facilities_airConditioning'),
        value: t('schema_facilities_airConditioningValue'),
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: t('schema_facilities_wifi'),
        value: t('schema_facilities_wifiValue'),
      },
      {
        '@type': 'LocationFeatureSpecification',
        name: t('schema_facilities_lockerRooms'),
        value: t('schema_facilities_lockerRoomsValue'),
      },
    ],
  };

  // ImageGallery Schema for SEO
  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: t('facilitiesGalleryTitle'),
    description: t('facilitiesGallerySubtitle'),
    url: pageUrl,
    about: {
      '@type': 'Place',
      name: "Farray's International Dance Center",
    },
    image: [
      {
        '@type': 'ImageObject',
        contentUrl: `${baseUrl}/images/salas/img/salaa-1.jpg`,
        name: 'Sala Principal A - 120m²',
        description: t('schema_facilities_imageDesc_salaA'),
      },
      {
        '@type': 'ImageObject',
        contentUrl: `${baseUrl}/images/salas/img/salab-1.jpg`,
        name: 'Sala Ballet B - 80m²',
        description: t('schema_facilities_imageDesc_salaB'),
      },
      {
        '@type': 'ImageObject',
        contentUrl: `${baseUrl}/images/salas/img/salac-1.jpg`,
        name: 'Sala Latinos C - 80m²',
        description: t('schema_facilities_imageDesc_salaC'),
      },
      {
        '@type': 'ImageObject',
        contentUrl: `${baseUrl}/images/salas/img/salad-1.jpg`,
        name: 'Sala Fitness D - 40m²',
        description: t('schema_facilities_imageDesc_salaD'),
      },
      {
        '@type': 'ImageObject',
        contentUrl: `${baseUrl}/images/salas/img/bar1.jpg`,
        name: 'Bar & Social Area',
        description: t('schema_facilities_imageDesc_bar'),
      },
      {
        '@type': 'ImageObject',
        contentUrl: `${baseUrl}/images/salas/img/recepción1.jpg`,
        name: 'Reception',
        description: t('schema_facilities_imageDesc_reception'),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{t('facilitiesPageTitle')} | Farray&apos;s Center</title>
        <meta name="description" content={t('facilitiesMetaDescription')} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${t('facilitiesPageTitle')} | Farray&apos;s Center`} />
        <meta property="og:description" content={t('facilitiesMetaDescription')} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-facilities.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t('facilitiesPageTitle')} | Farray's Center`} />
        <meta name="twitter:description" content={t('facilitiesMetaDescription')} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-facilities.jpg`} />
      </Helmet>

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Place Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />

      {/* ImageGallery Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageGallerySchema) }}
      />

      {/* LocalBusiness Schema */}
      <LocalBusinessSchema
        name="Farray's International Dance Center - Instalaciones"
        description={t('facilitiesMetaDescription')}
        url={pageUrl}
        telephone="+34622247085"
        email="info@farrayscenter.com"
        address={{
          streetAddress: t('schema_streetAddress'),
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
          addressRegion: t('schema_addressRegion'),
        }}
        geo={{
          latitude: '41.380421',
          longitude: '2.148014',
        }}
        priceRange="€€"
        aggregateRating={{
          ratingValue: REVIEW_STATS.ratingValue,
          reviewCount: REVIEW_STATS.reviewCount,
        }}
      />

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <FacilitiesHero t={t} locale={locale} />

        {/* Introduction Section */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('facilitiesIntroTitle')}
                </h2>
                <p className="text-xl text-neutral/90 leading-relaxed mb-6">
                  {t('facilitiesIntroP1')}
                </p>
                <p className="text-lg text-neutral/80 leading-relaxed">{t('facilitiesIntroP2')}</p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Dance Rooms Section */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('facilitiesRoomsTitle')}
                </h2>
                <p className="text-xl text-neutral/70 max-w-3xl mx-auto">
                  {t('facilitiesRoomsSubtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {rooms.map((room, index) => (
                <FacilityCard key={room.id} room={room} t={t} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Full Gallery Section */}
        <FacilitiesFullGallery />

        {/* What Happens in Our Rooms Section */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('facilitiesActivitiesTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll key={num} delay={index * 100} className="[perspective:1000px]">
                  <div className="group h-full min-h-[100px] p-6 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <svg
                          className="w-6 h-6 text-primary-accent"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-neutral/90 leading-relaxed">
                        {t(`facilitiesActivity${num}`)}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Social Amenities Section */}
        <SocialAmenities amenities={amenities} t={t} />

        {/* Equipment Section */}
        <FacilityFeatureList features={equipmentFeatures} t={t} />

        {/* Trust Section with Stats */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('facilitiesTrustTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto">
              <AnimateOnScroll delay={0}>
                <div className="text-center">
                  <AnimatedCounter
                    target={8}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('yearsExperience')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={100}>
                <div className="text-center">
                  <AnimatedCounter
                    target={1500}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('activeStudents')}
                  </p>
                </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <div className="text-center">
                  <AnimatedCounter
                    target={15000}
                    suffix="+"
                    className="text-4xl md:text-5xl font-black mb-2 holographic-text"
                  />
                  <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                    {t('satisfiedStudents')}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Why Choose Our Facilities Section */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('facilitiesWhyTitle')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[1, 2, 3, 4, 5, 6].map((num, index) => (
                <AnimateOnScroll key={num} delay={index * 100} className="[perspective:1000px]">
                  <div className="group h-full min-h-[180px] p-8 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                    <div className="text-6xl font-black text-primary-accent mb-4 holographic-text">
                      {num}
                    </div>
                    <h3 className="text-xl font-bold text-neutral mb-3">
                      {t(`facilitiesWhy${num}Title`)}
                    </h3>
                    <p className="text-neutral/90 leading-relaxed">
                      {t(`facilitiesWhy${num}Desc`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Google Reviews Section */}
        <ReviewsSection
          category="general"
          limit={6}
          showGoogleBadge={true}
          title="Lo que dicen de nuestras instalaciones"
          layout="grid"
          selectedAuthors={[
            'garcia lam',
            'Annina Moser',
            'Yosefin Cabeza Carrillo',
            'Micaela Llull (MicaPower)',
            'Michelle Lu',
            'Alejandra Amorín',
          ]}
        />

        {/* FAQ Section */}
        <div className="-mt-20 md:-mt-24">
          <FAQSection title={t('facilitiesFaqTitle')} faqs={facilitiesFaqs} pageUrl={pageUrl} />
        </div>

        {/* Final CTA Section */}
        <section className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>

          <div className="container mx-auto px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-8 holographic-text">
                  {t('facilitiesCTATitle')}
                </h2>
                <p className="text-xl text-neutral/90 leading-relaxed mb-6">
                  {t('facilitiesCTAP1')}
                </p>
                <p className="text-2xl font-bold holographic-text mb-10">{t('facilitiesCTAP2')}</p>

                <div className="flex justify-center">
                  <a
                    href="#tour"
                    className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                  >
                    {t('solicitarTour')}
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
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default FacilitiesPage;
