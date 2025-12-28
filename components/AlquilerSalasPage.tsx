import { useState, useRef, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { useI18n } from '../hooks/useI18n';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import Icon, { type IconName } from './Icon';

// ============================================================================
// ENTERPRISE ROOM DATA - Salas con nomenclatura por letras (A, B, C, D)
// ============================================================================
// Las imágenes se procesan con el script enterprise build-images.mjs
// Generando AVIF, WebP y JPEG en 6 breakpoints: [320, 640, 768, 1024, 1440, 1920]
// ============================================================================

interface RoomImage {
  basePath: string;
  alt: string;
}

interface Room {
  id: string;
  name: string;
  size: string;
  sizeM2: number; // Para schema markup
  description: string;
  weekdayPrices: { type: string; price: string; priceValue: number }[];
  images: RoomImage[];
}

const rooms: Room[] = [
  {
    id: 'A',
    name: 'Sala A',
    size: '40 m²',
    sizeM2: 40,
    description:
      'Sala diáfana con suelo de madera flotante. Ideal para ensayos pequeños, clases en grupos reducidos, coaching individual o castings.',
    weekdayPrices: [
      { type: 'Compañías / ensayos', price: '14 €/hora', priceValue: 14 },
      { type: 'Clases', price: '22 €/hora', priceValue: 22 },
    ],
    images: [
      {
        basePath: '/images/salas/img/salaa-1',
        alt: 'Sala A - Vista principal del espacio de 40m² con suelo de madera flotante',
      },
      {
        basePath: '/images/salas/img/salaa-2',
        alt: 'Sala A - Vista lateral con espejos y equipo de sonido',
      },
      {
        basePath: '/images/salas/img/salaa-3',
        alt: 'Sala A - Detalle del suelo de madera profesional para danza',
      },
    ],
  },
  {
    id: 'B',
    name: 'Sala B',
    size: '120 m²',
    sizeM2: 120,
    description:
      'Nuestra sala más grande. Suelo de linóleo profesional instalado sobre madera flotante con aproximadamente un 60% de amortiguación. Perfecta para clases grandes, eventos, workshops, rodajes y entrenamientos de compañías.',
    weekdayPrices: [
      { type: 'Compañías / ensayos', price: '40 €/hora', priceValue: 40 },
      { type: 'Clases / eventos', price: '50 €/hora', priceValue: 50 },
    ],
    images: [
      {
        basePath: '/images/salas/img/salab-1',
        alt: 'Sala B - Amplio espacio de 120m² con suelo de linóleo profesional',
      },
      {
        basePath: '/images/salas/img/salab-2',
        alt: 'Sala B - Vista panorámica ideal para eventos y workshops',
      },
      {
        basePath: '/images/salas/img/salab-3',
        alt: 'Sala B - Detalle de la iluminación y equipamiento profesional',
      },
    ],
  },
  {
    id: 'C',
    name: 'Sala C',
    size: '80 m²',
    sizeM2: 80,
    description:
      'Sala diáfana con suelo de parquet especial para baile. Perfecta para grupos medianos, ensayos, cursos y entrenamientos técnicos.',
    weekdayPrices: [
      { type: 'Compañías / ensayos', price: '25 €/hora', priceValue: 25 },
      { type: 'Clases / eventos', price: '35 €/hora', priceValue: 35 },
    ],
    images: [
      {
        basePath: '/images/salas/img/salac-1',
        alt: 'Sala C - Espacio de 80m² con parquet especial para baile',
      },
      {
        basePath: '/images/salas/img/salac-2',
        alt: 'Sala C - Vista del área de ensayo con espejos de pared completa',
      },
      {
        basePath: '/images/salas/img/salac-3',
        alt: 'Sala C - Detalle del equipamiento de audio y ambiente',
      },
    ],
  },
  {
    id: 'D',
    name: 'Sala D',
    size: '80 m²',
    sizeM2: 80,
    description:
      'Sala diáfana con suelo de linóleo profesional. Muy versátil para danzas urbanas, contemporáneo, ensayos, castings, shootings y pequeños eventos.',
    weekdayPrices: [
      { type: 'Compañías / ensayos', price: '25 €/hora', priceValue: 25 },
      { type: 'Clases / eventos', price: '35 €/hora', priceValue: 35 },
    ],
    images: [
      {
        basePath: '/images/salas/img/salad-1',
        alt: 'Sala D - Espacio versátil de 80m² con linóleo profesional',
      },
      {
        basePath: '/images/salas/img/salad-2',
        alt: 'Sala D - Vista ideal para danzas urbanas y contemporáneo',
      },
      {
        basePath: '/images/salas/img/salad-3',
        alt: 'Sala D - Detalle del espacio para castings y shootings',
      },
    ],
  },
];

// ============================================================================
// ENTERPRISE IMAGE SYSTEM
// ============================================================================
const IMAGE_BREAKPOINTS = [320, 640, 768, 1024, 1440, 1920] as const;

/** LQIP placeholder - Dark gradient matching brand */
const LQIP_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%231a1a2e"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%230f0f23"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="1200" height="800" fill="url(%23g)"%3E%3C/rect%3E%3C/svg%3E';

const generateSrcSet = (basePath: string, format: string): string => {
  return IMAGE_BREAKPOINTS.map(w => `${basePath}_${w}.${format} ${w}w`).join(', ');
};

// ============================================================================
// ENTERPRISE ROOM GALLERY COMPONENT
// ============================================================================
// Features:
// - Intersection Observer for efficient lazy loading
// - LQIP blur placeholder with smooth transition
// - Multi-format (AVIF/WebP/JPEG) with srcset
// - Touch swipe for mobile
// - fetchPriority for LCP optimization
// - Preload support for critical images
// ============================================================================

interface RoomGalleryProps {
  images: RoomImage[];
  t: (key: string) => string;
  isFirstRoom?: boolean; // For LCP optimization
}

const RoomGallery: React.FC<RoomGalleryProps> = ({ images, t, isFirstRoom = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(isFirstRoom); // First room loads immediately
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (isFirstRoom) return; // First room doesn't need observer

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isFirstRoom]);

  // Navigation callbacks - must be before early return to follow Rules of Hooks
  const nextImage = useCallback(() => {
    setIsLoaded(false);
    setCurrentIndex(prev => (prev + 1) % (images?.length || 1));
  }, [images?.length]);

  const prevImage = useCallback(() => {
    setIsLoaded(false);
    setCurrentIndex(prev => (prev - 1 + (images?.length || 1)) % (images?.length || 1));
  }, [images?.length]);

  // Early return if no images
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] lg:min-h-[400px] bg-primary-dark/50 flex items-center justify-center">
        <span className="text-neutral/50">No images available</span>
      </div>
    );
  }

  // After the early return above, we know images has at least one element
  const selectedImage = images[currentIndex] ?? images[0];
  // Type guard ensures currentImage is always defined (we verified images.length > 0 above)
  if (!selectedImage) {
    return null;
  }
  const currentImage = selectedImage;

  // Swipe detection
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0]?.clientX ?? 0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? 0);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) nextImage();
    else if (isRightSwipe) prevImage();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] lg:min-h-[400px] bg-black/30 overflow-hidden group/gallery touch-pan-y"
      style={{ aspectRatio: '3/2' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* LQIP Blur Placeholder */}
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage: `url("${LQIP_PLACEHOLDER}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(20px)',
          transform: 'scale(1.1)',
          opacity: isLoaded ? 0 : 1,
        }}
      />

      {/* Enterprise Multi-Format Picture Element */}
      {isInView && (
        <picture>
          <source
            type="image/avif"
            srcSet={generateSrcSet(currentImage.basePath, 'avif')}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <source
            type="image/webp"
            srcSet={generateSrcSet(currentImage.basePath, 'webp')}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <img
            src={`${currentImage.basePath}_1024.jpg`}
            srcSet={generateSrcSet(currentImage.basePath, 'jpg')}
            sizes="(max-width: 768px) 100vw, 50vw"
            alt={currentImage.alt}
            width={1200}
            height={800}
            loading={isFirstRoom ? 'eager' : 'lazy'}
            decoding={isFirstRoom ? 'sync' : 'async'}
            fetchPriority={isFirstRoom && currentIndex === 0 ? 'high' : 'auto'}
            onLoad={() => setIsLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover select-none transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
          />
        </picture>
      )}

      {/* Loading spinner - only shows if taking long to load */}
      {isInView && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-3 border-primary-accent/20 border-t-primary-accent rounded-full animate-spin" />
        </div>
      )}

      {/* Navigation Buttons - Desktop only */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover/gallery:opacity-100 items-center justify-center"
            aria-label={t('roomRental_gallery_prev')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextImage}
            className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover/gallery:opacity-100 items-center justify-center"
            aria-label={t('roomRental_gallery_next')}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm px-3 py-2 rounded-full">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsLoaded(false);
                  setCurrentIndex(index);
                }}
                className={`rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-primary-accent w-6 h-2'
                    : 'bg-white/50 hover:bg-white/80 w-2 h-2'
                }`}
                aria-label={`${t('roomRental_gallery_view')} ${index + 1}`}
              />
            ))}
          </div>

          {/* Swipe instruction for mobile */}
          {currentIndex === 0 && (
            <div className="lg:hidden absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                />
              </svg>
              <span>{t('roomRental_gallery_swipe')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AlquilerSalasPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  // Target audience - use translations
  const targetAudienceKeys = [
    'roomRental_forWhom_item1',
    'roomRental_forWhom_item2',
    'roomRental_forWhom_item3',
    'roomRental_forWhom_item4',
    'roomRental_forWhom_item5',
    'roomRental_forWhom_item6',
  ];

  // Features - use translations
  const featuresData = [
    { icon: 'building' as IconName, key: 'roomRental_features_item1' },
    { icon: 'sparkles' as IconName, key: 'roomRental_features_item2' },
    { icon: 'heart' as IconName, key: 'roomRental_features_item3' },
    { icon: 'globe' as IconName, key: 'roomRental_features_item4' },
    { icon: 'users' as IconName, key: 'roomRental_features_item5' },
    { icon: 'chart-bar' as IconName, key: 'roomRental_features_item6' },
  ];

  // Benefits - use translations
  const benefitsData = [
    {
      icon: 'map-pin' as IconName,
      titleKey: 'roomRental_whyFarrays_item1_title',
      descKey: 'roomRental_whyFarrays_item1_desc',
    },
    {
      icon: 'building' as IconName,
      titleKey: 'roomRental_whyFarrays_item2_title',
      descKey: 'roomRental_whyFarrays_item2_desc',
    },
    {
      icon: 'badge-check' as IconName,
      titleKey: 'roomRental_whyFarrays_item3_title',
      descKey: 'roomRental_whyFarrays_item3_desc',
    },
    {
      icon: 'globe' as IconName,
      titleKey: 'roomRental_whyFarrays_item4_title',
      descKey: 'roomRental_whyFarrays_item4_desc',
    },
    {
      icon: 'clock' as IconName,
      titleKey: 'roomRental_whyFarrays_item5_title',
      descKey: 'roomRental_whyFarrays_item5_desc',
    },
    {
      icon: 'heart' as IconName,
      titleKey: 'roomRental_whyFarrays_item6_title',
      descKey: 'roomRental_whyFarrays_item6_desc',
    },
  ];

  // ============================================================================
  // ENTERPRISE SCHEMA MARKUP
  // ============================================================================

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('navHome'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('breadcrumb_services'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('headerRoomRental'),
        item: `${baseUrl}/${locale}/alquiler-salas-baile-barcelona`,
      },
    ],
  };

  // Schema Markup - Service with Offers for each room
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${baseUrl}/${locale}/alquiler-salas-baile-barcelona#service`,
    name: 'Alquiler de Salas de Baile',
    description: t('roomRental_metaDescription'),
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#organization`,
      name: "Farray's Center",
      image: `${baseUrl}/images/logo/farrays-logo.png`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Carrer de Mallorca, 323',
        addressLocality: 'Barcelona',
        postalCode: '08037',
        addressCountry: 'ES',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 41.3971,
        longitude: 2.1645,
      },
      telephone: '+34 644 67 02 25',
      priceRange: '€€',
    },
    areaServed: {
      '@type': 'City',
      name: 'Barcelona',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Salas de Baile Disponibles',
      itemListElement: rooms.map((room, index) => ({
        '@type': 'Offer',
        '@id': `${baseUrl}/${locale}/alquiler-salas-baile-barcelona#sala-${room.id}`,
        name: `${room.name} - ${room.size}`,
        description: room.description,
        image: `${baseUrl}${room.images[0]?.basePath}_1024.jpg`,
        priceSpecification: room.weekdayPrices.map(price => ({
          '@type': 'PriceSpecification',
          price: price.priceValue,
          priceCurrency: 'EUR',
          unitText: 'hora',
          name: price.type,
        })),
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString().split('T')[0],
        itemOffered: {
          '@type': 'Product',
          name: room.name,
          description: room.description,
          category: 'Sala de ensayo para danza',
          additionalProperty: [
            {
              '@type': 'PropertyValue',
              name: 'Superficie',
              value: room.sizeM2,
              unitCode: 'MTK',
            },
          ],
        },
        position: index + 1,
      })),
    },
  };

  // Schema Markup - ImageGallery for SEO
  const imageGallerySchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: "Galería de Salas de Baile - Farray's Center",
    description: 'Fotos de nuestras 4 salas de baile profesionales en Barcelona',
    image: rooms.flatMap(room =>
      room.images.map(img => ({
        '@type': 'ImageObject',
        contentUrl: `${baseUrl}${img.basePath}_1920.jpg`,
        thumbnailUrl: `${baseUrl}${img.basePath}_320.jpg`,
        name: img.alt,
        description: img.alt,
        width: 1920,
        height: 1280,
        encodingFormat: 'image/jpeg',
      }))
    ),
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('navHome'), url: `/${locale}` },
    { name: t('breadcrumb_services'), url: `/${locale}` },
    {
      name: t('headerRoomRental'),
      url: `/${locale}/alquiler-salas-baile-barcelona`,
      isActive: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('roomRental_pageTitle')}</title>
        <meta name="description" content={t('roomRental_metaDescription')} />
        <meta
          name="keywords"
          content="alquiler salas baile Barcelona, alquiler salas danza Barcelona, alquiler espacios baile Barcelona, salas ensayo Barcelona, alquiler sala baile"
        />
        {/* LCP Optimization - Preload first room image */}
        <link
          rel="preload"
          as="image"
          type="image/avif"
          imageSrcSet={generateSrcSet(rooms[0]?.images[0]?.basePath ?? '', 'avif')}
          imageSizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Enterprise Schema Markup */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(imageGallerySchema)}</script>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <section
          id="alquiler-hero"
          className="relative text-center py-32 md:py-40 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
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
                {t('roomRental_hero_title')}
              </h1>
              <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
                {t('roomRental_hero_subtitle')}
              </p>
            </AnimateOnScroll>

            {/* CTA Buttons */}
            <AnimateOnScroll delay={200}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow w-full sm:w-auto"
                >
                  {t('roomRental_hero_cta_availability')}
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
                <a
                  href="#salas"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white w-full sm:w-auto"
                >
                  {t('roomRental_hero_cta_view_rooms')}
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Intro Premium Section - SEO CRITICAL */}
        <section aria-labelledby="intro-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
              <AnimateOnScroll delay={100}>
                <p
                  className="text-lg"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(t('roomRental_intro_p1')) }}
                />
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                <p className="text-lg">{t('roomRental_intro_p2')}</p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={300}>
                <p className="text-lg font-semibold text-white">{t('roomRental_intro_p3')}</p>
              </AnimateOnScroll>

              <AnimateOnScroll delay={400}>
                <p className="text-base text-primary-accent/80 italic">
                  {t('roomRental_intro_ideal')}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* Para Quién Es Section */}
        <section aria-labelledby="para-quien-title" className="py-12 md:py-20 bg-primary-dark/10">
          <div className="container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="para-quien-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 holographic-text"
                >
                  {t('roomRental_forWhom_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            {/* Grid of Target Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {targetAudienceKeys.map((key, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div className="group block relative h-full min-h-[100px] rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow hover:scale-105 border border-white/10 hover:border-primary-accent flex flex-col p-6">
                    <div className="flex items-start gap-3">
                      <Icon
                        name="star"
                        className="w-6 h-6 text-primary-accent flex-shrink-0 mt-1"
                      />
                      <p className="text-neutral/90 leading-relaxed text-left">{t(key)}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll delay={600}>
              <p className="max-w-3xl mx-auto text-lg text-neutral/90 mt-12">
                {t('roomRental_forWhom_footer')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Características Section */}
        <section aria-labelledby="caracteristicas-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="caracteristicas-title"
                  className="text-3xl md:text-4xl font-black tracking-tighter mb-12 text-center holographic-text"
                >
                  {t('roomRental_features_main_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {featuresData.map((feature, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div className="bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300 h-full min-h-[80px]">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary-dark/30 p-3 rounded-xl">
                        <Icon name={feature.icon} className="w-6 h-6 text-primary-accent" />
                      </div>
                      <p className="text-neutral/90 leading-relaxed">{t(feature.key)}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll delay={600}>
              <p className="text-center text-lg text-neutral/90 mt-10 max-w-3xl mx-auto">
                {t('roomRental_features_footer')}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Por Qué Elegir Farray's Section */}
        <section aria-labelledby="why-title" className="pt-8 pb-20 md:pt-12 md:pb-32 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-16 max-w-3xl mx-auto">
                <h2
                  id="why-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t('roomRental_whyFarrays_title')}
                </h2>
              </div>
            </AnimateOnScroll>
            <div className="flex flex-wrap justify-center -m-4">
              {benefitsData.map((benefit, index) => (
                <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                  <AnimateOnScroll delay={index * 100} className="h-full">
                    <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full min-h-[180px] flex flex-col">
                      <div className="mb-6">
                        <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <Icon
                            name={benefit.icon}
                            className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                          />
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                        {t(benefit.titleKey)}
                      </h3>
                      <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                        {t(benefit.descKey)}
                      </p>
                    </div>
                  </AnimateOnScroll>
                </div>
              ))}
            </div>

            <AnimateOnScroll delay={600}>
              <div className="mt-12 max-w-3xl mx-auto bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-8 text-center">
                <p
                  className="text-lg text-neutral/90 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(t('roomRental_whyFarrays_footer')),
                  }}
                />
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Salas y Tarifas Section */}
        <section
          id="salas"
          aria-labelledby="salas-title"
          className="py-16 md:py-24 bg-primary-dark/10"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2
                  id="salas-title"
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-center holographic-text"
                >
                  {t('roomRental_rooms_title')}
                </h2>
                <p className="max-w-3xl mx-auto text-center text-lg text-neutral/90 mb-12">
                  {t('roomRental_rooms_choose_text')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="space-y-12 max-w-7xl mx-auto">
              {rooms.map((room, index) => (
                <AnimateOnScroll key={room.id} delay={index * 100}>
                  <div className="group relative rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out hover:shadow-accent-glow border-2 border-white/10 hover:border-primary-accent">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                      {/* Gallery */}
                      <div className="lg:order-1">
                        <RoomGallery images={room.images} t={t} isFirstRoom={index === 0} />
                      </div>

                      {/* Info */}
                      <div className="lg:order-2 flex flex-col p-8">
                        <div className="flex items-baseline gap-3 mb-4">
                          <h3 className="text-3xl font-bold holographic-text transition-colors duration-300">
                            {room.name}
                          </h3>
                          <span className="text-lg holographic-text font-semibold">
                            – {room.size}
                          </span>
                        </div>

                        <p className="text-neutral/90 leading-relaxed mb-6">{room.description}</p>

                        {/* Tarifas */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-neutral/60 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Icon name="calendar" className="w-4 h-4 text-primary-accent" />
                            {t('roomRental_weekday_hours')}
                          </h4>
                          <div className="space-y-2">
                            {room.weekdayPrices.map((price, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between items-center p-3 bg-primary-dark/30 rounded-lg border border-primary-accent/10"
                              >
                                <span className="text-neutral/80">{price.type}</span>
                                <span className="font-bold holographic-text text-lg">
                                  {price.price}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Festivos */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-neutral/60 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Icon name="star" className="w-4 h-4 text-primary-accent" />
                            {t('roomRental_holiday_hours')}
                          </h4>
                          <div className="p-3 bg-primary-dark/30 rounded-lg border border-primary-accent/10">
                            <span className="text-neutral/80">{t('roomRental_consult')}</span>
                          </div>
                        </div>

                        {/* CTA */}
                        <Link
                          to={`/${locale}/contacto`}
                          className="mt-auto block w-full text-center bg-primary-accent text-white px-6 py-3 rounded-full font-bold hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow transition-all duration-300"
                        >
                          {t('roomRental_request_room')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Descuentos Section */}
        <section aria-labelledby="descuentos-title" className="py-16 md:py-24 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-8 md:p-10">
                <h2
                  id="descuentos-title"
                  className="text-3xl md:text-4xl font-black tracking-tighter mb-6 holographic-text"
                >
                  {t('roomRental_discounts_title')}
                </h2>
                <p className="text-neutral/80 mb-4 text-lg">{t('roomRental_discounts_subtitle')}</p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <Icon
                      name="badge-check"
                      className="w-5 h-5 text-primary-accent flex-shrink-0 mt-1"
                    />
                    <span className="text-neutral/80">{t('roomRental_discounts_item1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon
                      name="badge-check"
                      className="w-5 h-5 text-primary-accent flex-shrink-0 mt-1"
                    />
                    <span className="text-neutral/80">{t('roomRental_discounts_item2')}</span>
                  </li>
                </ul>
                <p className="text-neutral/90 text-lg leading-relaxed mb-6">
                  {t('roomRental_discounts_explain')}
                </p>
                <Link
                  to={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('roomRental_cta_custom_quote')}
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
          </div>
          <div className="relative z-20 container mx-auto px-6 text-center">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
                  {t('roomRental_final_title')}
                </h2>
                <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">
                  {t('roomRental_final_subtitle')}
                </p>
                <p className="max-w-xl mx-auto text-lg text-neutral/75 mb-10">
                  {t('roomRental_final_description')}
                </p>
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={`/${locale}/contacto`}
                  className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow"
                >
                  {t('roomRental_cta_contact')}
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
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default AlquilerSalasPage;
