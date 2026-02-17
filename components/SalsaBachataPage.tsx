import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { HUB_CATEGORIES } from '../constants/danceClassesHub';
import { SALSA_BACHATA_FAQS_CONFIG } from '../constants/salsa-bachata';
import AnimateOnScroll from './AnimateOnScroll';
import { SUPPORTED_LOCALES } from '../types';
import { CourseSchema, LocalBusinessSchema } from './SchemaMarkup';
import CategoryPageTemplate, {
  type ValuePillarWithIcon,
  type RelatedClass,
  type HeroImageConfig,
} from './templates/CategoryPageTemplate';
import { getStyleImage } from '../constants/style-images';

// ============================================================================
// HERO IMAGE CONFIGURATION (Enterprise Level - SEO/GEO Optimized)
// ============================================================================
const HERO_IMAGE_CONFIG: HeroImageConfig = {
  basePath: '/images/categories/hero/clases-salsa-bachata-barcelona',
  altKey: 'styleImages.salsaBachata.pageHero',
  altFallback:
    "Parejas bailando salsa cubana y bachata sensual en academia de Barcelona - Farray's Center",
  breakpoints: [320, 640, 768, 1024, 1440, 1920],
  formats: ['avif', 'webp', 'jpg'],
  objectPosition: 'center center',
  opacity: 100,
};

// OG Image path for social media (must match prerender.mjs naming: og-{pageName}.jpg)
const OG_IMAGE_PATH = '/images/og-salsaBachata.jpg';

// ============================================================================
// PAGE-SPECIFIC DATA
// ============================================================================

const valuePillars: ValuePillarWithIcon[] = [
  {
    id: 'instructors',
    titleKey: 'whyPillar1Title',
    contentKey: 'whyPillar1Content',
    iconName: 'globe',
  },
  {
    id: 'farray_method',
    titleKey: 'salsaBachataWhyFarrayMethodTitle',
    contentKey: 'salsaBachataWhyFarrayMethodContent',
    iconName: 'sparkles',
  },
  {
    id: 'family',
    titleKey: 'whyPillar4Title',
    contentKey: 'whyPillar4Content',
    iconName: 'star',
  },
  {
    id: 'partner_dance',
    titleKey: 'salsaBachataWhyPartnerTitle',
    contentKey: 'salsaBachataWhyPartnerContent',
    iconName: 'star',
  },
  {
    id: 'prestige',
    titleKey: 'whyPillar6Title',
    contentKey: 'whyPillar6Content',
    iconName: 'academic-cap',
  },
  {
    id: 'facilities',
    titleKey: 'whyPillar3Title',
    contentKey: 'whyPillar3Content',
    iconName: 'building',
  },
];

const relatedClasses: RelatedClass[] = [
  {
    id: 'salsacubana',
    nameKey: 'relatedSalsaCubanaName',
    descKey: 'relatedSalsaCubanaDesc',
    url: '/clases/salsa-cubana-barcelona',
    imageSrc: getStyleImage('salsa_cubana').basePath,
    imageAlt: "Clase de Salsa Cubana en Barcelona - Farray's Dance Center",
    breakpoints: getStyleImage('salsa_cubana').breakpoints,
  },
  {
    id: 'bachata',
    nameKey: 'relatedBachataName',
    descKey: 'relatedBachataDesc',
    url: '/clases/bachata-barcelona',
    imageSrc: getStyleImage('bachata_sensual').basePath,
    imageAlt: "Clase de Bachata en Barcelona - Farray's Dance Center",
    breakpoints: getStyleImage('bachata_sensual').breakpoints,
  },
  {
    id: 'timba',
    nameKey: 'relatedTimbaName',
    descKey: 'relatedTimbaDesc',
    url: '/clases/timba-barcelona',
    imageSrc: getStyleImage('timba_cubana').basePath,
    imageAlt: "Clase de Timba Cubana en Barcelona - Farray's Dance Center",
    breakpoints: getStyleImage('timba_cubana').breakpoints,
  },
];

// ============================================================================
// PAGE-SPECIFIC SECTIONS (Slots)
// ============================================================================

const WhatIsSalsaBachataSection: React.FC = () => {
  const { t } = useTranslation([
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

  return (
    <section aria-labelledby="what-is-title" className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto">
            <h2
              id="what-is-title"
              className="text-3xl md:text-4xl font-black tracking-tighter mb-8 text-center holographic-text"
            >
              {t('salsaBachata_whatIs_title')}
            </h2>
          </div>
        </AnimateOnScroll>

        <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
          <AnimateOnScroll delay={100}>
            <p className="text-lg">{t('salsaBachata_whatIs_salsa')}</p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="text-lg">{t('salsaBachata_whatIs_bachata')}</p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300}>
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">
              {t('salsaBachata_whatIs_difference_title')}
            </h3>
            <p className="text-lg">{t('salsaBachata_whatIs_difference_text')}</p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={400}>
            <p className="text-lg">{t('salsaBachata_whatIs_benefits')}</p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

const WhichStyleSection: React.FC = () => {
  const { t } = useTranslation([
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

  const tableRows = [
    { goal: 'social', style: 'social', why: 'social' },
    { goal: 'romantic', style: 'romantic', why: 'romantic' },
    { goal: 'advanced', style: 'advanced', why: 'advanced' },
    { goal: 'traditional', style: 'traditional', why: 'traditional' },
    { goal: 'solo', style: 'solo', why: 'solo' },
    { goal: 'beginner', style: 'beginner', why: 'beginner' },
  ];

  return (
    <section aria-labelledby="which-style-title" className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto">
            <h2
              id="which-style-title"
              className="text-3xl md:text-4xl font-black tracking-tighter mb-6 text-center holographic-text"
            >
              {t('salsaBachata_whichStyle_title')}
            </h2>
            <p className="max-w-3xl mx-auto text-center text-lg text-neutral/90 mb-12">
              {t('salsaBachata_whichStyle_intro')}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Comparison Table */}
        <AnimateOnScroll delay={200}>
          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse bg-black/50 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl">
              <thead>
                <tr className="bg-primary-accent/20 border-b-2 border-primary-accent">
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    {t('salsaBachata_whichStyle_tableHeader_goal')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    {t('salsaBachata_whichStyle_tableHeader_style')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell">
                    {t('salsaBachata_whichStyle_tableHeader_why')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {tableRows.map(row => (
                  <tr
                    key={row.goal}
                    className="hover:bg-primary-accent/10 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-neutral/90">
                      {t(`salsaBachata_whichStyle_${row.goal}_goal`)}
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      {t(`salsaBachata_whichStyle_${row.style}_style`)}
                    </td>
                    <td className="px-6 py-4 text-neutral/80 text-sm hidden md:table-cell">
                      {t(`salsaBachata_whichStyle_${row.why}_why`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimateOnScroll>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          <AnimateOnScroll delay={300} className="[perspective:1000px]">
            <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('salsaBachata_whichStyle_beginner_title')}
              </h3>
              <p className="text-neutral/90 text-sm leading-relaxed">
                {t('salsaBachata_whichStyle_beginner_text')}
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={400} className="[perspective:1000px]">
            <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('salsaBachata_whichStyle_adult_title')}
              </h3>
              <p className="text-neutral/90 text-sm leading-relaxed">
                {t('salsaBachata_whichStyle_adult_text')}
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={500} className="[perspective:1000px]">
            <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('salsaBachata_whichStyle_combine_title')}
              </h3>
              <p className="text-neutral/90 text-sm leading-relaxed">
                {t('salsaBachata_whichStyle_combine_text')}
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const SalsaBachataPage: React.FC = () => {
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

  // Get the "latin" category data from HUB_CATEGORIES
  const salsaBachataCategory = HUB_CATEGORIES.find(cat => cat.key === 'latin');

  if (!salsaBachataCategory) {
    throw new Error('Category "latin" not found in HUB_CATEGORIES');
  }

  // FAQs - traducir las keys dinámicamente desde constants
  const salsaBachataFaqs = SALSA_BACHATA_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { name: t('salsaBachataBarcelona_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('salsaBachataBarcelona_breadcrumb_classes'),
      url: `/${locale}/clases/baile-barcelona`,
    },
    {
      name: t('salsaBachataBarcelona_breadcrumb_current'),
      url: `/${locale}/clases/salsa-bachata-barcelona`,
      isActive: true,
    },
  ];

  // Schema Markup
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('salsaBachataBarcelona_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('salsaBachataBarcelona_breadcrumb_classes'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('salsaBachataBarcelona_breadcrumb_current'),
        item: `${baseUrl}/${locale}/clases/salsa-bachata-barcelona`,
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('schema_salsaBachata_itemListName'),
    itemListElement: salsaBachataCategory.allStyles.map((style, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: t(`danceClassesHub_style_${style.key}`),
      url: `${baseUrl}/${locale}${style.url}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: salsaBachataFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // ImageObject Schema for SEO/GEO (helps AI search engines understand the image)
  const imageObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: `${baseUrl}${HERO_IMAGE_CONFIG.basePath}_1920.jpg`,
    url: `${baseUrl}/${locale}/clases/salsa-bachata-barcelona`,
    name: t('salsaBachataBarcelona_h1'),
    description: t('salsaBachataBarcelona_description'),
    width: 1920,
    height: 1280,
    encodingFormat: 'image/jpeg',
    creator: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
      url: baseUrl,
    },
    copyrightHolder: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
    },
    license: `${baseUrl}/aviso-legal`,
  };

  // Canonical URL for this page
  const canonicalUrl = `${baseUrl}/${locale}/clases/salsa-bachata-barcelona`;
  const ogImageUrl = `${baseUrl}${OG_IMAGE_PATH}`;

  // Schemas component
  const schemas = (
    <>
      <CourseSchema
        name={t('salsaBachataBarcelona_h1')}
        description={t('salsaBachataBarcelona_description')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel={t('schema_educationalLevelBeginnerAdvanced')}
        teaches={t('schema_salsaBachata_teaches')}
        availableLanguage={SUPPORTED_LOCALES}
      />
      <LocalBusinessSchema
        name="Farray's International Dance Center"
        description={t('salsaBachataBarcelona_description')}
        url={baseUrl}
        telephone="+34622247085"
        email="info@farrayscenter.com"
        address={{
          streetAddress: t('schema_streetAddress'),
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
        }}
        geo={{
          latitude: '41.380421',
          longitude: '2.148014',
        }}
        priceRange="€€"
        aggregateRating={{
          ratingValue: '4.9',
          reviewCount: '509',
        }}
      />
      <Helmet>
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:title"
          content={`${t('salsaBachataBarcelona_title')} | Farray's Center`}
        />
        <meta property="og:description" content={t('salsaBachataBarcelona_description')} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={t('salsaBachataBarcelona_h1')} />
        <meta
          property="og:locale"
          content={
            locale === 'es'
              ? 'es_ES'
              : locale === 'ca'
                ? 'ca_ES'
                : locale === 'fr'
                  ? 'fr_FR'
                  : 'en_GB'
          }
        />
        <meta property="og:site_name" content="Farray's International Dance Center" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${t('salsaBachataBarcelona_title')} | Farray's Center`}
        />
        <meta name="twitter:description" content={t('salsaBachataBarcelona_description')} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={t('salsaBachataBarcelona_h1')} />

        {/* Schema Markup */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(imageObjectSchema)}</script>
      </Helmet>
    </>
  );

  return (
    <CategoryPageTemplate
      // Hero
      heroGradient="from-amber-900/30"
      heroTitleKey="salsaBachataBarcelona_h1"
      heroSubtitleKey="salsaBachataBarcelona_h1_sub"
      heroIntroKey="salsaBachataBarcelona_intro"
      heroImage={HERO_IMAGE_CONFIG}
      // Data
      styles={salsaBachataCategory.allStyles}
      valuePillars={valuePillars}
      faqs={salsaBachataFaqs}
      relatedClasses={relatedClasses}
      // SEO
      pageTitle={`${t('salsaBachataBarcelona_title')} | Farray's Center`}
      breadcrumbItems={breadcrumbItems}
      schemas={schemas}
      faqTitle={t('salsaBachataBarcelona_faq_title')}
      faqPageUrl={`${baseUrl}/${locale}/clases/salsa-bachata-barcelona`}
      // Styles section
      stylesSectionTitleKey="salsaBachataBarcelona_styles_title"
      stylesDescriptionKey="salsaBachataBarcelona_styles_description"
      styleContext="latin"
      styleTranslationPrefix="salsaBachata"
      gridColumns={3}
      // Reviews
      reviewsCategory="general"
      reviewsLimit={6}
      // CTA
      ctaTitleKey="salsaBachataCTA_title"
      ctaSubtitleKey="salsaBachataCTA_subtitle"
      ctaDescriptionKey="salsaBachataCTA_description"
      // Slots
      whatIsSection={<WhatIsSalsaBachataSection />}
      whichStyleSection={<WhichStyleSection />}
    />
  );
};

export default SalsaBachataPage;
