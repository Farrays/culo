import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../../hooks/useI18n';
import BookingWidget from '../booking/BookingWidget';

/**
 * BookingPage - Página de reservas de clases de bienvenida
 *
 * Features:
 * - Sistema de reservas enterprise con integración Momence
 * - Multi-step flow: estilo → clase → formulario
 * - RGPD compliant con todos los checkboxes requeridos
 * - Tracking Meta CAPI
 * - Multi-idioma (es, ca, en, fr)
 */
const BookingPage: React.FC = () => {
  const { t, locale } = useI18n();

  // SEO metadata
  const title = t('booking_meta_title');
  const description = t('booking_meta_description');
  const canonicalUrl = `https://www.farrayscenter.com/${locale}/reservas`;

  // Schema.org structured data
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: canonicalUrl,
    inLanguage: locale === 'ca' ? 'ca-ES' : locale === 'en' ? 'en' : locale === 'fr' ? 'fr' : 'es',
    isPartOf: {
      '@type': 'WebSite',
      name: "Farray's Center Barcelona",
      url: 'https://www.farrayscenter.com',
    },
    mainEntity: {
      '@type': 'Service',
      name:
        locale === 'en'
          ? 'Welcome Dance Class'
          : locale === 'fr'
            ? 'Cours de Bienvenue'
            : 'Clase de Bienvenida',
      description:
        locale === 'en'
          ? 'Free welcome class to try our dance styles'
          : locale === 'fr'
            ? 'Cours de bienvenue gratuit pour essayer nos styles de danse'
            : 'Clase de bienvenida gratuita para probar nuestros estilos de baile',
      provider: {
        '@type': 'LocalBusiness',
        name: "Farray's Center Barcelona",
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Carrer de Mallorca 179',
          addressLocality: 'Barcelona',
          postalCode: '08036',
          addressCountry: 'ES',
        },
        telephone: '+34933232567',
        priceRange: '€€',
      },
      areaServed: {
        '@type': 'City',
        name: 'Barcelona',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        validFrom: new Date().toISOString().split('T')[0],
      },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://www.farrayscenter.com/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: locale === 'en' ? 'Book' : locale === 'fr' ? 'Réservation' : 'Reservas',
          item: canonicalUrl,
        },
      ],
    },
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.farrayscenter.com/images/og/booking.jpg" />
        <meta
          property="og:locale"
          content={
            locale === 'ca'
              ? 'ca_ES'
              : locale === 'en'
                ? 'en_GB'
                : locale === 'fr'
                  ? 'fr_FR'
                  : 'es_ES'
          }
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        {/* Hreflang */}
        <link rel="alternate" hrefLang="es" href="https://www.farrayscenter.com/es/reservas" />
        <link rel="alternate" hrefLang="ca" href="https://www.farrayscenter.com/ca/reservas" />
        <link rel="alternate" hrefLang="en" href="https://www.farrayscenter.com/en/reservas" />
        <link rel="alternate" hrefLang="fr" href="https://www.farrayscenter.com/fr/reservas" />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://www.farrayscenter.com/es/reservas"
        />

        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <main
        id="main-content"
        className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black pt-24 pb-16"
      >
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          {/* Gradient orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(176, 30, 60, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(176, 30, 60, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <BookingWidget />
          </div>
        </div>
      </main>
    </>
  );
};

export default BookingPage;
