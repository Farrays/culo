import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { HUB_CATEGORIES } from '../constants/danceClassesHub';
import { DANZAS_URBANAS_FAQS_CONFIG } from '../constants/danzas-urbanas';
import AnimateOnScroll from './AnimateOnScroll';
import { SUPPORTED_LOCALES } from '../types';
import { CourseSchema } from './SchemaMarkup';
import CategoryPageTemplate, {
  type ValuePillarWithIcon,
  type RelatedClass,
} from './templates/CategoryPageTemplate';
import { getStyleImage } from '../constants/style-images';

// ============================================================================
// PAGE-SPECIFIC DATA
// ============================================================================

const valuePillars: ValuePillarWithIcon[] = [
  {
    id: 'international',
    titleKey: 'urbanWhyInternationalTitle',
    contentKey: 'urbanWhyInternationalContent',
    iconName: 'globe',
  },
  {
    id: 'farray_method',
    titleKey: 'danzasUrbanasWhyFarrayMethodTitle',
    contentKey: 'danzasUrbanasWhyFarrayMethodContent',
    iconName: 'sparkles',
  },
  {
    id: 'authentic_style',
    titleKey: 'urbanWhyAuthenticStyleTitle',
    contentKey: 'urbanWhyAuthenticStyleContent',
    iconName: 'star',
  },
  {
    id: 'career',
    titleKey: 'urbanWhyCareerTitle',
    contentKey: 'urbanWhyCareerContent',
    iconName: 'trophy',
  },
  {
    id: 'prestige',
    titleKey: 'urbanWhyPrestigeTitle',
    contentKey: 'urbanWhyPrestigeContent',
    iconName: 'academic-cap',
  },
  {
    id: 'facilities',
    titleKey: 'urbanWhyFacilitiesTitle',
    contentKey: 'urbanWhyFacilitiesContent',
    iconName: 'building',
  },
];

const relatedClasses: RelatedClass[] = [
  {
    id: 'hiphop',
    nameKey: 'relatedHipHopName',
    descKey: 'relatedHipHopDesc',
    url: '/clases/hip-hop-barcelona',
    imageSrc: getStyleImage('hip_hop').basePath,
    imageAlt: "Clase de Hip Hop en Barcelona - Farray's Dance Center",
    breakpoints: getStyleImage('hip_hop').breakpoints,
  },
  {
    id: 'dancehall',
    nameKey: 'relatedDancehallName',
    descKey: 'relatedDancehallDesc',
    url: '/clases/dancehall-barcelona',
    imageSrc: getStyleImage('dancehall').basePath,
    imageAlt: "Clase de Dancehall en Barcelona - Farray's Dance Center",
    breakpoints: getStyleImage('dancehall').breakpoints,
  },
  {
    id: 'afrobeats',
    nameKey: 'relatedAfrobeatsName',
    descKey: 'relatedAfrobeatsDesc',
    url: '/clases/afrobeats-barcelona',
    imageSrc: getStyleImage('afrobeat').basePath,
    imageAlt: "Clase de Afrobeats en Barcelona - Farray's Dance Center",
    breakpoints: getStyleImage('afrobeat').breakpoints,
  },
];

// ============================================================================
// PAGE-SPECIFIC SECTIONS (Slots)
// ============================================================================

const WhatIsUrbanSection: React.FC = () => {
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
              {t('danzasUrbanas_whatIs_title')}
            </h2>
          </div>
        </AnimateOnScroll>

        <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
          <AnimateOnScroll delay={100}>
            <p className="text-lg">{t('danzasUrbanas_whatIs_definition')}</p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="text-lg">{t('danzasUrbanas_whatIs_origin')}</p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300}>
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">
              {t('danzasUrbanas_whatIs_difference_title')}
            </h3>
          </AnimateOnScroll>

          <AnimateOnScroll delay={400}>
            <div className="space-y-4 pl-4 border-l-4 border-primary-accent/30">
              <p className="text-base">{t('danzasUrbanas_whatIs_difference_urban')}</p>
              <p className="text-base">{t('danzasUrbanas_whatIs_difference_street')}</p>
              <p className="text-base">{t('danzasUrbanas_whatIs_difference_commercial')}</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={500}>
            <p className="text-lg mt-6">{t('danzasUrbanas_whatIs_why_many_styles')}</p>
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
    { goal: 'flow', style: 'flow', why: 'flow' },
    { goal: 'sensual', style: 'sensual', why: 'sensual' },
    { goal: 'precision', style: 'precision', why: 'precision' },
    { goal: 'foundation', style: 'foundation', why: 'foundation' },
    { goal: 'power', style: 'power', why: 'power' },
    { goal: 'glutes', style: 'glutes', why: 'glutes' },
    { goal: 'commercial', style: 'commercial', why: 'commercial' },
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
              {t('danzasUrbanas_whichStyle_title')}
            </h2>
            <p className="max-w-3xl mx-auto text-center text-lg text-neutral/90 mb-12">
              {t('danzasUrbanas_whichStyle_intro')}
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
                    {t('danzasUrbanas_whichStyle_tableHeader_goal')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    {t('danzasUrbanas_whichStyle_tableHeader_style')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell">
                    {t('danzasUrbanas_whichStyle_tableHeader_why')}
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
                      {t(`danzasUrbanas_whichStyle_${row.goal}_goal`)}
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      {t(`danzasUrbanas_whichStyle_${row.style}_style`)}
                    </td>
                    <td className="px-6 py-4 text-neutral/80 text-sm hidden md:table-cell">
                      {t(`danzasUrbanas_whichStyle_${row.why}_why`)}
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
                {t('danzasUrbanas_whichStyle_beginner_title')}
              </h3>
              <p className="text-neutral/90 text-sm leading-relaxed">
                {t('danzasUrbanas_whichStyle_beginner_text')}
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={400} className="[perspective:1000px]">
            <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('danzasUrbanas_whichStyle_adult_title')}
              </h3>
              <p className="text-neutral/90 text-sm leading-relaxed">
                {t('danzasUrbanas_whichStyle_adult_text')}
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={500} className="[perspective:1000px]">
            <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('danzasUrbanas_whichStyle_combine_title')}
              </h3>
              <p className="text-neutral/90 text-sm leading-relaxed">
                {t('danzasUrbanas_whichStyle_combine_text')}
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

const DanzasUrbanasBarcelonaPage: React.FC = () => {
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

  // Get the "urban" category data from HUB_CATEGORIES
  const urbanCategory = HUB_CATEGORIES.find(cat => cat.key === 'urban');

  if (!urbanCategory) {
    throw new Error('Category "urban" not found in HUB_CATEGORIES');
  }

  // FAQs - traducir las keys dinámicamente desde constants
  const urbanFaqs = DANZAS_URBANAS_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { name: t('danzasUrbanas_breadcrumb_home'), url: `/${locale}` },
    { name: t('danzasUrbanas_breadcrumb_classes'), url: `/${locale}/clases/baile-barcelona` },
    {
      name: t('danzasUrbanas_breadcrumb_current'),
      url: `/${locale}/clases/danzas-urbanas-barcelona`,
      isActive: true,
    },
  ];

  // Schema Markup
  const _breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('danzasUrbanas_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('danzasUrbanas_breadcrumb_classes'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('danzasUrbanas_breadcrumb_current'),
        item: `${baseUrl}/${locale}/clases/danzas-urbanas-barcelona`,
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('schema_urbanas_itemListName'),
    itemListElement: urbanCategory.allStyles.map((style, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: t(`danceClassesHub_style_${style.key}`),
      url: `${baseUrl}/${locale}${style.url}`,
    })),
  };

  // Schemas component
  const schemas = (
    <>
      <CourseSchema
        name={t('danzasUrbanas_h1')}
        description={t('danzasUrbanas_description')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel={t('schema_educationalLevelBeginnerAdvanced')}
        teaches={t('schema_urbanas_teaches')}
        availableLanguage={SUPPORTED_LOCALES}
      />
      {/* LocalBusiness Schema removed - already injected at build-time by prerender.mjs */}
      <Helmet>
        {/* BreadcrumbList + FAQPage generated at build-time by prerender.mjs */}
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>
    </>
  );

  return (
    <CategoryPageTemplate
      // Hero
      heroGradient="from-rose-900/30"
      heroTitleKey="danzasUrbanas_h1"
      heroSubtitleKey="danzasUrbanas_h1_sub"
      heroIntroKey="danzasUrbanas_intro"
      heroImage={{
        basePath: '/images/categories/img/urbano',
        altKey: 'alt_hero_danzas_urbanas',
        altFallback:
          "Clases de danzas urbanas en Barcelona - Hip Hop, Dancehall, Reggaeton y más estilos en Farray's Center",
        breakpoints: [320, 640, 768, 1024],
        formats: ['avif', 'webp', 'jpg'],
        objectPosition: 'center center',
        opacity: 100,
      }}
      // Data
      styles={urbanCategory.allStyles}
      valuePillars={valuePillars}
      faqs={urbanFaqs}
      relatedClasses={relatedClasses}
      // SEO
      pageTitle={`${t('danzasUrbanas_title')} | Farray's Center`}
      breadcrumbItems={breadcrumbItems}
      schemas={schemas}
      faqTitle={t('danzasUrbanas_faq_title')}
      // Styles section
      stylesSectionTitleKey="danzasUrbanas_styles_title"
      stylesDescriptionKey="danzasUrbanas_styles_description"
      styleContext="urban"
      styleTranslationPrefix="danzasUrbanas"
      gridColumns={3}
      // Reviews
      reviewsCategory="general"
      reviewsLimit={6}
      // CTA
      ctaTitleKey="danzasUrbanas_finalCTA_title"
      ctaSubtitleKey="danzasUrbanas_finalCTA_subtitle"
      ctaDescriptionKey="danzasUrbanas_finalCTA_description"
      // Slots
      whatIsSection={<WhatIsUrbanSection />}
      whichStyleSection={<WhichStyleSection />}
    />
  );
};

export default DanzasUrbanasBarcelonaPage;
