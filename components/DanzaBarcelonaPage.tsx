import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import { HUB_CATEGORIES } from '../constants/danceClassesHub';
import { DANZA_FAQS_CONFIG } from '../constants/danza';
import AnimateOnScroll from './AnimateOnScroll';
import { SUPPORTED_LOCALES } from '../types';
import { CourseSchema, LocalBusinessSchema } from './SchemaMarkup';
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
    id: 'instructors',
    titleKey: 'whyPillar1Title',
    contentKey: 'whyPillar1Content',
    iconName: 'globe',
  },
  {
    id: 'farray_method',
    titleKey: 'danzaBarcelona_why_reason7_title',
    contentKey: 'danzaBarcelona_why_reason7_desc',
    iconName: 'sparkles',
  },
  {
    id: 'cuban_school',
    titleKey: 'danzaWhyCubanSchoolTitle',
    contentKey: 'danzaWhyCubanSchoolContent',
    iconName: 'star',
  },
  {
    id: 'career',
    titleKey: 'danzaWhyCareerTitle',
    contentKey: 'danzaWhyCareerContent',
    iconName: 'trophy',
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
    id: 'ballet',
    nameKey: 'relatedBalletName',
    descKey: 'relatedBalletDesc',
    url: '/clases/ballet-barcelona',
    imageSrc: getStyleImage('ballet_clasico').basePath,
    imageAlt: "Clase de Ballet en Barcelona - Farray's Dance Center",
    breakpoints: getStyleImage('ballet_clasico').breakpoints,
  },
  {
    id: 'contemporaneo',
    nameKey: 'relatedContemporaneoName',
    descKey: 'relatedContemporaneoDesc',
    url: '/clases/contemporaneo-barcelona',
    imageSrc: getStyleImage('danza_contemporanea').basePath,
    imageAlt: "Clase de Contemporáneo en Barcelona - Farray's Dance Center",
    breakpoints: getStyleImage('danza_contemporanea').breakpoints,
  },
  {
    id: 'modernjazz',
    nameKey: 'relatedModernJazzName',
    descKey: 'relatedModernJazzDesc',
    url: '/clases/modern-jazz-barcelona',
    imageSrc: getStyleImage('modern_jazz').basePath,
    imageAlt: "Clase de Modern Jazz en Barcelona - Farray's Dance Center",
    objectPosition: getStyleImage('modern_jazz').objectPosition || 'center 25%',
    breakpoints: getStyleImage('modern_jazz').breakpoints,
  },
];

// ============================================================================
// PAGE-SPECIFIC SECTIONS (Slots)
// ============================================================================

const WhatIsDanzaSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section aria-labelledby="what-is-title" className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto">
            <h2
              id="what-is-title"
              className="text-3xl md:text-4xl font-black tracking-tighter mb-8 text-center holographic-text"
            >
              {t('danzaBarcelona_whatIs_title')}
            </h2>
          </div>
        </AnimateOnScroll>

        <div className="max-w-4xl mx-auto space-y-6 text-neutral/90 leading-relaxed">
          <AnimateOnScroll delay={100}>
            <p className="text-lg">{t('danzaBarcelona_whatIs_definition')}</p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <p className="text-lg">{t('danzaBarcelona_whatIs_schools')}</p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300}>
            <h3 className="text-2xl font-bold text-white mt-8 mb-4">
              {t('danzaBarcelona_whatIs_contemporary_title')}
            </h3>
          </AnimateOnScroll>

          <AnimateOnScroll delay={400}>
            <p className="text-lg">{t('danzaBarcelona_whatIs_contemporary_text')}</p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={500}>
            <p className="text-lg mt-6">{t('danzaBarcelona_whatIs_benefits')}</p>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

const WhichStyleSection: React.FC = () => {
  const { t } = useI18n();

  const tableRows = [
    { goal: 'technique', style: 'technique', why: 'technique' },
    { goal: 'expression', style: 'expression', why: 'expression' },
    { goal: 'energy', style: 'energy', why: 'energy' },
    { goal: 'cultural', style: 'cultural', why: 'cultural' },
    { goal: 'flexibility', style: 'flexibility', why: 'flexibility' },
    { goal: 'foundation', style: 'foundation', why: 'foundation' },
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
              {t('danzaBarcelona_whichStyle_title')}
            </h2>
            <p className="max-w-3xl mx-auto text-center text-lg text-neutral/90 mb-12">
              {t('danzaBarcelona_whichStyle_intro')}
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
                    {t('danzaBarcelona_whichStyle_tableHeader_goal')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    {t('danzaBarcelona_whichStyle_tableHeader_style')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider hidden md:table-cell">
                    {t('danzaBarcelona_whichStyle_tableHeader_why')}
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
                      {t(`danzaBarcelona_whichStyle_${row.goal}_goal`)}
                    </td>
                    <td className="px-6 py-4 text-white font-bold">
                      {t(`danzaBarcelona_whichStyle_${row.style}_style`)}
                    </td>
                    <td className="px-6 py-4 text-neutral/80 text-sm hidden md:table-cell">
                      {t(`danzaBarcelona_whichStyle_${row.why}_why`)}
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
                {t('danzaBarcelona_whichStyle_beginner_title')}
              </h3>
              <p className="text-neutral/90 text-sm leading-relaxed">
                {t('danzaBarcelona_whichStyle_beginner_text')}
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={400} className="[perspective:1000px]">
            <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('danzaBarcelona_whichStyle_adult_title')}
              </h3>
              <p className="text-neutral/90 text-sm leading-relaxed">
                {t('danzaBarcelona_whichStyle_adult_text')}
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={500} className="[perspective:1000px]">
            <div className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow">
              <h3 className="text-xl font-bold text-white mb-3">
                {t('danzaBarcelona_whichStyle_combine_title')}
              </h3>
              <p className="text-neutral/90 text-sm leading-relaxed">
                {t('danzaBarcelona_whichStyle_combine_text')}
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

const DanzaBarcelonaPage: React.FC = () => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';

  // Get the "contemporary" category data from HUB_CATEGORIES
  const danzaCategory = HUB_CATEGORIES.find(cat => cat.key === 'contemporary');

  if (!danzaCategory) {
    throw new Error('Category "contemporary" not found in HUB_CATEGORIES');
  }

  // FAQs - traducir las keys dinámicamente desde constants
  const danzaFaqs = DANZA_FAQS_CONFIG.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Breadcrumb items
  const breadcrumbItems = [
    { name: t('danzaBarcelona_breadcrumb_home'), url: `/${locale}` },
    { name: t('danzaBarcelona_breadcrumb_classes'), url: `/${locale}/clases/baile-barcelona` },
    {
      name: t('danzaBarcelona_breadcrumb_current'),
      url: `/${locale}/clases/danza-barcelona`,
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
        name: t('danzaBarcelona_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('danzaBarcelona_breadcrumb_classes'),
        item: `${baseUrl}/${locale}/clases/baile-barcelona`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('danzaBarcelona_breadcrumb_current'),
        item: `${baseUrl}/${locale}/clases/danza-barcelona`,
      },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('schema_danza_itemListName'),
    itemListElement: danzaCategory.allStyles.map((style, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: t(`danceClassesHub_style_${style.key}`),
      url: `${baseUrl}/${locale}${style.url}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: danzaFaqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Schemas component
  const schemas = (
    <>
      <CourseSchema
        name={t('danzaBarcelona_hero_title')}
        description={t('danzaBarcelona_description')}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel={t('schema_educationalLevelBeginnerAdvanced')}
        teaches={t('schema_danza_teaches')}
        availableLanguage={SUPPORTED_LOCALES}
      />
      <LocalBusinessSchema
        name="Farray's International Dance Center"
        description={t('danzaBarcelona_description')}
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
          ratingValue: '5',
          reviewCount: '509',
        }}
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
    </>
  );

  return (
    <CategoryPageTemplate
      // Hero
      heroGradient="from-emerald-900/30"
      heroTitleKey="danzaBarcelona_h1"
      heroSubtitleKey="danzaBarcelona_h1_sub"
      heroIntroKey="danzaBarcelona_intro"
      heroImage={{
        basePath: '/images/categories/hero/clases-de-danza',
        altKey: 'alt_hero_clases_danza',
        altFallback:
          "Clases de danza en Barcelona - Ballet, contemporáneo y jazz en Farray's Center",
        objectPosition: 'center 30%',
        opacity: 100,
      }}
      // Data
      styles={danzaCategory.allStyles}
      valuePillars={valuePillars}
      faqs={danzaFaqs}
      relatedClasses={relatedClasses}
      // SEO
      pageTitle={`${t('danzaBarcelona_title')} | Farray's Center`}
      breadcrumbItems={breadcrumbItems}
      schemas={schemas}
      faqTitle={t('danzaBarcelona_faq_title')}
      faqPageUrl={`${baseUrl}/${locale}/clases/danza-barcelona`}
      // Styles section
      stylesSectionTitleKey="danzaBarcelona_styles_title"
      stylesDescriptionKey="danzaBarcelona_styles_description"
      styleContext="danza"
      styleTranslationPrefix="danzaBarcelona"
      gridColumns={3}
      // Reviews
      reviewsCategory="general"
      reviewsLimit={6}
      // CTA
      ctaTitleKey="danzaCTA_title"
      ctaSubtitleKey="danzaCTA_subtitle"
      ctaDescriptionKey="danzaCTA_description"
      // Slots
      whatIsSection={<WhatIsDanzaSection />}
      whichStyleSection={<WhichStyleSection />}
    />
  );
};

export default DanzaBarcelonaPage;
