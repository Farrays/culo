import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import { OrganizationSchema, WebSiteSchema, SiteNavigationElementSchema } from './SchemaMarkup';

/**
 * Global SEO component that manages meta tags, Open Graph, and hreflang.
 * Automatically detects the current page from the URL and applies
 * appropriate localized metadata.
 *
 * Features:
 * - Dynamic meta title and description based on route and locale
 * - Open Graph tags for social media sharing
 * - Canonical URLs to prevent duplicate content
 * - Hreflang links for multi-language SEO
 * - Automatic language/locale detection
 *
 * This component should be rendered once at the app root level.
 * Individual pages can override specific tags using their own Helmet.
 *
 * @example
 * ```tsx
 * // In App.tsx or layout component
 * <HelmetProvider>
 *   <SEO />
 *   <RouterProvider router={router} />
 * </HelmetProvider>
 * ```
 */
/**
 * Path-to-page mapping for O(1) lookup.
 * Ordered by specificity: longer/more specific paths first.
 * Uses array of tuples to maintain order (Map doesn't guarantee iteration order in all cases).
 */
const PATH_TO_PAGE: ReadonlyArray<readonly [string, string]> = [
  // Dance class pages (specific styles first - longer paths)
  ['/clases/bachata-barcelona', 'bachata'],
  ['/clases/folklore-cubano', 'folkloreCubano'],
  ['/clases/salsa-cubana-barcelona', 'salsaCubana'],
  ['/clases/salsa-lady-style-barcelona', 'salsaLadyStyle'],
  ['/clases/salsa-bachata-barcelona', 'salsaBachata'],
  ['/clases/hip-hop-reggaeton-barcelona', 'hipHopReggaeton'],
  ['/clases/sexy-reggaeton-barcelona', 'sexyReggaeton'],
  ['/clases/reggaeton-cubano-barcelona', 'reggaetonCubano'],
  ['/clases/afro-contemporaneo-barcelona', 'afroContemporaneo'],
  ['/clases/entrenamiento-bailarines-barcelona', 'prepFisica'],
  ['/clases/contemporaneo-barcelona', 'contemporaneo'],
  ['/clases/modern-jazz-barcelona', 'modernJazz'],
  ['/clases/sexy-style-barcelona', 'sexyStyle'],
  ['/clases/afro-jazz', 'afroJazz'],
  ['/clases/afrobeats-barcelona', 'afrobeat'],
  ['/clases/dancehall-barcelona', 'dancehall'],
  ['/clases/hip-hop-barcelona', 'hipHop'],
  ['/clases/ballet-barcelona', 'ballet'],
  ['/clases/heels-barcelona', 'heels'],
  ['/clases/twerk-barcelona', 'twerk'],
  ['/clases/femmology', 'femmology'],
  ['/clases/acondicionamiento-fisico-bailarines', 'cuerpofit'],
  ['/clases/baile-mananas', 'baileManananas'],
  // Hub pages (after specific styles - shorter paths)
  ['/clases/danzas-urbanas-barcelona', 'danzasUrbanas'],
  ['/clases/danza-barcelona', 'danza'],
  ['/clases/baile-barcelona', 'classes'],
  // Service pages
  ['/clases-particulares-baile', 'clasesParticulares'],
  ['/alquiler-salas-baile-barcelona', 'alquilerSalas'],
  ['/estudio-grabacion-barcelona', 'estudioGrabacion'],
  ['/servicios-baile', 'servicios'],
  ['/regala-baile', 'regalaBaile'],
  ['/merchandising', 'merchandising'],
  // Info pages
  ['/instalaciones-escuela-baile-barcelona', 'facilities'],
  ['/preguntas-frecuentes', 'faq'],
  ['/sobre-nosotros', 'about'],
  ['/yunaisy-farray', 'yunaisyFarray'],
  ['/contacto', 'contact'],
] as const;

/**
 * Detects the page type from a URL path.
 * Uses ordered pattern matching for specificity.
 * @param path - The URL pathname to analyze
 * @returns The page identifier or null if not recognized
 */
const getPageFromPath = (path: string): string | null => {
  // Fast path for home
  if (path === '/' || path === '' || path.match(/^\/[a-z]{2}\/?$/)) return 'home';

  // Find matching pattern (first match wins due to specificity ordering)
  for (const [pattern, page] of PATH_TO_PAGE) {
    if (path.includes(pattern)) return page;
  }

  return null;
};

const SEO: React.FC = () => {
  const { locale, t, isLoading: _isLoading } = useI18n();
  const location = useLocation();

  const page = getPageFromPath(location.pathname);

  const baseUrl = 'https://www.farrayscenter.com';

  // Map internal page names to URL paths
  const pageToPath: Record<string, string> = {
    home: '',
    classes: 'clases/baile-barcelona',
    danza: 'clases/danza-barcelona',
    salsaBachata: 'clases/salsa-bachata-barcelona',
    salsaCubana: 'clases/salsa-cubana-barcelona',
    salsaLadyStyle: 'clases/salsa-lady-style-barcelona',
    bachata: 'clases/bachata-barcelona',
    folkloreCubano: 'clases/folklore-cubano',
    danzasUrbanas: 'clases/danzas-urbanas-barcelona',
    dancehall: 'clases/dancehall-barcelona',
    twerk: 'clases/twerk-barcelona',
    afrobeat: 'clases/afrobeats-barcelona',
    hipHopReggaeton: 'clases/hip-hop-reggaeton-barcelona',
    hipHop: 'clases/hip-hop-barcelona',
    sexyReggaeton: 'clases/sexy-reggaeton-barcelona',
    reggaetonCubano: 'clases/reggaeton-cubano-barcelona',
    heels: 'clases/heels-barcelona',
    femmology: 'clases/femmology',
    sexyStyle: 'clases/sexy-style-barcelona',
    modernJazz: 'clases/modern-jazz-barcelona',
    ballet: 'clases/ballet-barcelona',
    contemporaneo: 'clases/contemporaneo-barcelona',
    afroContemporaneo: 'clases/afro-contemporaneo-barcelona',
    afroJazz: 'clases/afro-jazz',
    prepFisica: 'clases/entrenamiento-bailarines-barcelona',
    cuerpofit: 'clases/acondicionamiento-fisico-bailarines',
    baileManananas: 'clases/baile-mananas',
    clasesParticulares: 'clases-particulares-baile',
    alquilerSalas: 'alquiler-salas-baile-barcelona',
    estudioGrabacion: 'estudio-grabacion-barcelona',
    servicios: 'servicios-baile',
    regalaBaile: 'regala-baile',
    merchandising: 'merchandising',
    about: 'sobre-nosotros',
    yunaisyFarray: 'yunaisy-farray',
    facilities: 'instalaciones-escuela-baile-barcelona',
    contact: 'contacto',
    faq: 'preguntas-frecuentes',
  };

  // Metadata mapping per page
  const metaData: Record<string, { titleKey: string; descKey: string; image: string }> = {
    home: {
      titleKey: 'pageTitle',
      descKey: 'metaDescription',
      image: `${baseUrl}/images/og-home.jpg`,
    },
    classes: {
      titleKey: 'danceClassesHub_h1',
      descKey: 'danceClassesHub_description',
      image: `${baseUrl}/images/og-classes-hub.jpg`,
    },
    danza: {
      titleKey: 'danzaBarcelona_title',
      descKey: 'danzaBarcelona_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    salsaBachata: {
      titleKey: 'salsaBachataBarcelona_title',
      descKey: 'salsaBachataBarcelona_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    salsaCubana: {
      titleKey: 'salsaCubanaPageTitle',
      descKey: 'salsaCubanaMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    salsaLadyStyle: {
      titleKey: 'salsaLadyPageTitle',
      descKey: 'salsaLadyMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    bachata: {
      titleKey: 'bachataV3PageTitle',
      descKey: 'bachataV3MetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    danzasUrbanas: {
      titleKey: 'danzasUrbanas_title',
      descKey: 'danzasUrbanas_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    dancehall: {
      titleKey: 'dhV3PageTitle',
      descKey: 'dhV3MetaDescription',
      image: `${baseUrl}/images/og-dancehall.jpg`,
    },
    twerk: {
      titleKey: 'twerkPageTitle',
      descKey: 'twerkMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    afrobeat: {
      titleKey: 'afroPageTitle',
      descKey: 'afroMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    hipHopReggaeton: {
      titleKey: 'hhrPageTitle',
      descKey: 'hhrMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    hipHop: {
      titleKey: 'hiphopPageTitle',
      descKey: 'hiphopMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    sexyReggaeton: {
      titleKey: 'sxrPageTitle',
      descKey: 'sxrMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    reggaetonCubano: {
      titleKey: 'rcbPageTitle',
      descKey: 'rcbMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    heels: {
      titleKey: 'heelsBarcelona_title',
      descKey: 'heelsBarcelona_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    femmology: {
      titleKey: 'femPageTitle',
      descKey: 'femMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    sexyStyle: {
      titleKey: 'sexystylePageTitle',
      descKey: 'sexystyleMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    modernJazz: {
      titleKey: 'modernjazzPageTitle',
      descKey: 'modernjazzMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    ballet: {
      titleKey: 'balletPageTitle',
      descKey: 'balletMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    contemporaneo: {
      titleKey: 'contemporaneoPageTitle',
      descKey: 'contemporaneoMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    afroContemporaneo: {
      titleKey: 'afrocontemporaneoPageTitle',
      descKey: 'afrocontemporaneoMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    afroJazz: {
      titleKey: 'afrojazzPageTitle',
      descKey: 'afrojazzMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    prepFisica: {
      titleKey: 'prepFisica_title',
      descKey: 'prepFisica_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    cuerpofit: {
      titleKey: 'cuerpofitPageTitle',
      descKey: 'cuerpofitMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    baileManananas: {
      titleKey: 'bailemanananasPageTitle',
      descKey: 'bailemanananasMetaDescription',
      image: `${baseUrl}/images/og-baile-mananas.jpg`,
    },
    clasesParticulares: {
      titleKey: 'particularesPage_title',
      descKey: 'particularesPage_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    alquilerSalas: {
      titleKey: 'roomRental_pageTitle',
      descKey: 'roomRental_metaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    estudioGrabacion: {
      titleKey: 'estudioGrabacion_h1',
      descKey: 'estudioGrabacion_intro',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    regalaBaile: {
      titleKey: 'regalaBaile_page_title',
      descKey: 'regalaBaile_meta_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    merchandising: {
      titleKey: 'merchandising_page_title',
      descKey: 'merchandising_page_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    about: {
      titleKey: 'about_page_title',
      descKey: 'about_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    yunaisyFarray: {
      titleKey: 'yunaisyFarray_page_title',
      descKey: 'yunaisyFarray_meta_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    facilities: {
      titleKey: 'facilitiesPageTitle',
      descKey: 'facilitiesMetaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    contact: {
      titleKey: 'contact_page_title',
      descKey: 'contact_page_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    faq: {
      titleKey: 'faq_page_title',
      descKey: 'faq_page_description',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
    servicios: {
      titleKey: 'serviciosBaile_pageTitle',
      descKey: 'serviciosBaile_metaDescription',
      image: `${baseUrl}/images/og-classes.jpg`,
    },
  };

  const pagePath = page ? pageToPath[page] || '' : '';
  const currentUrl = `${baseUrl}/${locale}${pagePath ? `/${pagePath}` : ''}`;

  const pageMetaData = page ? metaData[page] : null;
  const titleKey = pageMetaData?.titleKey || '';
  const descKey = pageMetaData?.descKey || '';
  const image = pageMetaData?.image || '';

  // Get title and description
  const title = titleKey ? t(titleKey) : '';
  const description = descKey ? t(descKey) || t('metaDescription') : '';

  // Update document title directly as a fallback - must be called unconditionally
  useEffect(() => {
    if (title && title !== titleKey) {
      document.title = title;
    }
  }, [title, titleKey, location.pathname]);

  // If page is not recognized, don't render SEO component (let page-specific Helmet handle it)
  if (!page || !pageMetaData) {
    return null;
  }

  // If we don't have a valid translation yet, don't render
  if (!title || title === titleKey) {
    return null;
  }

  // OG locale mapping
  const ogLocaleMap: Record<string, string> = {
    es: 'es_ES',
    ca: 'ca_ES',
    en: 'en_US',
    fr: 'fr_FR',
  };

  return (
    <>
      {/* Global Schemas - render once for all pages */}
      <OrganizationSchema />
      <WebSiteSchema />
      <SiteNavigationElementSchema />
      <Helmet>
        {/* Basic meta tags */}
        <html lang={locale} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={currentUrl} />

        {/* hreflang alternates - bidirectional */}
        <link
          rel="alternate"
          hrefLang="es"
          href={`${baseUrl}/es${pagePath ? `/${pagePath}` : ''}`}
        />
        <link
          rel="alternate"
          hrefLang="ca"
          href={`${baseUrl}/ca${pagePath ? `/${pagePath}` : ''}`}
        />
        <link
          rel="alternate"
          hrefLang="en"
          href={`${baseUrl}/en${pagePath ? `/${pagePath}` : ''}`}
        />
        <link
          rel="alternate"
          hrefLang="fr"
          href={`${baseUrl}/fr${pagePath ? `/${pagePath}` : ''}`}
        />
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
    </>
  );
};

export default SEO;
