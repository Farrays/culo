import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SiteNavigationElementSchema } from './SchemaMarkup';
import { SEO_META_KEYS } from '../constants/seo-meta-keys.mjs';

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
  ['/clases/stretching-barcelona', 'stretching'],
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
  ['/servicios-baile-barcelona', 'servicios'],
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
    stretching: 'clases/stretching-barcelona',
    prepFisica: 'clases/entrenamiento-bailarines-barcelona',
    cuerpofit: 'clases/acondicionamiento-fisico-bailarines',
    baileManananas: 'clases/baile-mananas',
    clasesParticulares: 'clases-particulares-baile',
    alquilerSalas: 'alquiler-salas-baile-barcelona',
    estudioGrabacion: 'estudio-grabacion-barcelona',
    servicios: 'servicios-baile-barcelona',
    regalaBaile: 'regala-baile',
    merchandising: 'merchandising',
    about: 'sobre-nosotros',
    yunaisyFarray: 'yunaisy-farray',
    facilities: 'instalaciones-escuela-baile-barcelona',
    contact: 'contacto',
    faq: 'preguntas-frecuentes',
  };

  // OG images per page (titleKey/descKey come from shared SEO_META_KEYS)
  const ogImages: Record<string, string> = {
    home: `${baseUrl}/images/og-home.jpg`,
    classes: `${baseUrl}/images/og-clases-baile-barcelona.jpg`,
    danza: `${baseUrl}/images/classes/contemporaneo/img/mgs_5189_1440.webp`,
    salsaBachata: `${baseUrl}/images/classes/Bachata/img/clases-bachata-sensual-barcelona_1440.webp`,
    salsaCubana: `${baseUrl}/images/classes/salsa-cubana/img/salsa-cubana_1440.webp`,
    salsaLadyStyle: `${baseUrl}/images/classes/Salsa-Lady-Style/img/clases-salsa-lady-style-barcelona_1440.webp`,
    bachata: `${baseUrl}/images/classes/Bachata/img/clases-bachata-sensual-barcelona_1440.webp`,
    danzasUrbanas: `${baseUrl}/images/classes/hip-hop/img/clases-hip-hop-barcelona_1440.webp`,
    dancehall: `${baseUrl}/images/classes/dancehall/img/dancehall-classes-barcelona-01_1440.webp`,
    twerk: `${baseUrl}/images/classes/twerk/img/clases-twerk-barcelona_1440.webp`,
    afrobeat: `${baseUrl}/images/classes/afrobeat/img/clases-afrobeat-barcelona_1440.webp`,
    hipHopReggaeton: `${baseUrl}/images/classes/hip-hop-reggaeton/img/clases-hip-hop-reaggaeton-barcelona_1440.webp`,
    hipHop: `${baseUrl}/images/classes/hip-hop/img/clases-hip-hop-barcelona_1440.webp`,
    sexyReggaeton: `${baseUrl}/images/classes/sexy-reggaeton/img/clases-sexy-reggaeton-barcelona_1440.webp`,
    reggaetonCubano: `${baseUrl}/images/classes/reggaeton-cubano/img/mgs_8884_1440.webp`,
    heels: `${baseUrl}/images/classes/Heels/img/clases-heels-barcelona_1440.webp`,
    femmology: `${baseUrl}/images/classes/femmology/img/femmology-hero-barcelona_1440.webp`,
    sexyStyle: `${baseUrl}/images/classes/sexy-style/img/clases-de-sexy-style-barcelona_1440.webp`,
    modernJazz: `${baseUrl}/images/classes/modern-jazz/img/clases-modern-jazz-barcelona_1440.webp`,
    ballet: `${baseUrl}/images/classes/ballet/img/clases-ballet-barcelona_1440.webp`,
    contemporaneo: `${baseUrl}/images/classes/contemporaneo/img/mgs_5189_1440.webp`,
    afroContemporaneo: `${baseUrl}/images/classes/afro-contemporaneo/img/mgs_5260_1440.webp`,
    afroJazz: `${baseUrl}/images/classes/afro-jazz/img/afro-jazz_1440.webp`,
    stretching: `${baseUrl}/images/og-stretching.jpg`,
    prepFisica: `${baseUrl}/images/og-entrenamiento-bailarines.jpg`,
    cuerpofit: `${baseUrl}/images/categories/img/body-conditioning-og.jpg`,
    baileManananas: `${baseUrl}/images/og-baile-mananas.jpg`,
  };
  const defaultOgImage = `${baseUrl}/images/og-home.jpg`;

  const pagePath = page ? pageToPath[page] || '' : '';
  const currentUrl = `${baseUrl}/${locale}${pagePath ? `/${pagePath}` : ''}`;

  const seoMeta = page
    ? (SEO_META_KEYS as Record<string, { titleKey: string; descKey: string; ns: string }>)[page]
    : null;
  const titleKey = seoMeta?.titleKey || '';
  const descKey = seoMeta?.descKey || '';
  const image = page ? ogImages[page] || defaultOgImage : '';

  // Get title and description from shared i18n keys
  const title = titleKey ? t(titleKey) : '';
  const description = descKey ? t(descKey) || t('metaDescription') : '';

  // Update document title directly as a fallback - must be called unconditionally
  useEffect(() => {
    if (title && title !== titleKey) {
      document.title = title;
    }
  }, [title, titleKey, location.pathname]);

  // If page is not recognized, don't render SEO component (let page-specific Helmet handle it)
  if (!page || !seoMeta) {
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
    en: 'en_GB',
    fr: 'fr_FR',
  };

  return (
    <>
      {/* Global Schemas - only SiteNavigation here; Organization, WebSite, and
          LocalBusiness (DanceSchoolWithRating) are already injected at build-time
          by prerender.mjs / schema-generators.mjs. Duplicating them causes
          Google to report "multiple aggregate ratings" errors. */}
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
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:locale" content={ogLocaleMap[locale]} />
        {/* og:locale:alternate for other languages */}
        {Object.entries(ogLocaleMap)
          .filter(([lang]) => lang !== locale)
          .map(([lang, ogLocale]) => (
            <meta key={lang} property="og:locale:alternate" content={ogLocale} />
          ))}
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
