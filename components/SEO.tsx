import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';

const SEO: React.FC = () => {
  const { locale, t, isLoading: _isLoading } = useI18n();
  const location = useLocation();

  // Detect current page from route
  const getPageFromPath = (path: string): string => {
    if (path === '/' || path === '') return 'home';
    // Order matters - more specific paths first to avoid false matches
    if (path.includes('/clases/danza-barcelona')) return 'danza';
    if (path.includes('/clases/salsa-bachata-barcelona')) return 'salsaBachata';
    if (path.includes('/clases/danzas-urbanas-barcelona')) return 'danzasUrbanas';
    if (path.includes('/clases/dancehall-barcelona')) return 'dancehall';
    if (path.includes('/clases/entrenamiento-bailarines-barcelona')) return 'prepFisica';
    if (path.includes('/clases-particulares-baile')) return 'clasesParticulares';
    if (path.includes('/clases/baile-barcelona')) return 'classes';
    return 'home';
  };

  const page = getPageFromPath(location.pathname);

  const baseUrl = 'https://www.farrayscenter.com';

  // Map internal page names to URL paths
  const pageToPath = {
    home: '',
    classes: 'clases/baile-barcelona',
    danza: 'clases/danza-barcelona',
    salsaBachata: 'clases/salsa-bachata-barcelona',
    danzasUrbanas: 'clases/danzas-urbanas-barcelona',
    dancehall: 'clases/dancehall-barcelona',
    prepFisica: 'clases/entrenamiento-bailarines-barcelona',
    clasesParticulares: 'clases-particulares-baile',
  };

  const pagePath = pageToPath[page as keyof typeof pageToPath] || '';
  const currentUrl = `${baseUrl}/${locale}${pagePath ? `/${pagePath}` : ''}`;

  // Metadata mapping per page
  // NOTE: OG images need to be created (see /docs/OG_IMAGES_NEEDED.md)
  const metaData = {
    home: {
      titleKey: 'pageTitle',
      descKey: 'metaDescription',
      image: `${baseUrl}/images/og-home.jpg`, // TODO: Create this image (1200x630px)
    },
    classes: {
      titleKey: 'danceClassesHub_title',
      descKey: 'danceClassesHub_description',
      image: `${baseUrl}/images/og-classes-hub.jpg`, // TODO: Create this image (1200x630px)
    },
    danza: {
      titleKey: 'danzaBarcelona_title',
      descKey: 'danzaBarcelona_description',
      image: `${baseUrl}/images/og-classes.jpg`, // TEMPORAL: Usar og-classes.jpg hasta crear og-danza-barcelona.jpg (1200x630px)
    },
    salsaBachata: {
      titleKey: 'salsaBachataBarcelona_title',
      descKey: 'salsaBachataBarcelona_description',
      image: `${baseUrl}/images/og-classes.jpg`, // TEMPORAL: Usar og-classes.jpg hasta crear og-salsa-bachata-barcelona.jpg (1200x630px)
    },
    danzasUrbanas: {
      titleKey: 'danzasUrbanas_title',
      descKey: 'danzasUrbanas_description',
      image: `${baseUrl}/images/og-classes.jpg`, // TEMPORAL: Usar og-classes.jpg hasta crear og-danzas-urbanas-barcelona.jpg (1200x630px)
    },
    dancehall: {
      titleKey: 'dancehallPageTitle',
      descKey: 'dancehallMetaDescription',
      image: `${baseUrl}/images/og-dancehall.jpg`, // TODO: Create this image (1200x630px)
    },
    prepFisica: {
      titleKey: 'prepFisica_title',
      descKey: 'prepFisica_description',
      image: `${baseUrl}/images/og-classes.jpg`, // TEMPORAL: Usar og-classes.jpg hasta crear og-prep-fisica.jpg (1200x630px)
    },
    clasesParticulares: {
      titleKey: 'particularesPage_title',
      descKey: 'particularesPage_description',
      image: `${baseUrl}/images/og-classes.jpg`, // TEMPORAL: Usar og-classes.jpg hasta crear og-clases-particulares.jpg (1200x630px)
    },
  };

  const { titleKey, descKey, image } = metaData[page as keyof typeof metaData];

  // Get title and description
  const title = t(titleKey);
  const description = t(descKey) || t('metaDescription');

  // Update document title directly as a fallback
  // This ensures the title updates even if React Helmet has issues
  useEffect(() => {
    if (title && title !== titleKey) {
      document.title = title;
    }
  }, [title, titleKey, location.pathname]);

  // If we don't have a valid translation yet, don't render
  // This prevents showing translation keys in the title
  if (!title || title === titleKey) {
    return null;
  }

  // OG locale mapping
  const ogLocaleMap = {
    es: 'es_ES',
    ca: 'ca_ES',
    en: 'en_US',
    fr: 'fr_FR',
  };

  return (
    <Helmet>
      {/* Basic meta tags */}
      <html lang={locale} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={currentUrl} />

      {/* hreflang alternates - bidirectional */}
      <link rel="alternate" hrefLang="es" href={`${baseUrl}/es${pagePath ? `/${pagePath}` : ''}`} />
      <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca${pagePath ? `/${pagePath}` : ''}`} />
      <link rel="alternate" hrefLang="en" href={`${baseUrl}/en${pagePath ? `/${pagePath}` : ''}`} />
      <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr${pagePath ? `/${pagePath}` : ''}`} />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/es${pagePath ? `/${pagePath}` : ''}`}
      />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={ogLocaleMap[locale]} />
      <meta property="og:site_name" content="Farray's International Dance Center" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO;
