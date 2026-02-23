import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES } from '../../types';
import { CourseSchema } from '../SchemaMarkup';
import FAQSection from '../FAQSection';
import { ReviewsSection } from '../reviews';
import YouTubeEmbed from '../YouTubeEmbed';

export interface FAQ {
  id: string;
  questionKey: string;
  answerKey: string;
}

interface ClassPageTemplateProps {
  // Identificación de la página
  categoryKey: string; // 'dancehall', 'danza', 'salsaBachata', etc.
  categoryPath: string; // 'dancehall-barcelona', 'danza-barcelona', etc.

  // Configuración de contenido
  faqsConfig: FAQ[];

  // Breadcrumb configuration
  breadcrumbItems?: Array<{
    name: string;
    url: string;
  }>;

  // Schema configuration (optional overrides)
  courseSchemaConfig?: {
    teaches?: string;
    prerequisites?: string;
    lessons?: string;
    duration?: string;
  };

  // Secciones personalizadas (se insertan después del hero)
  heroContent?: React.ReactNode;
  customSections?: React.ReactNode;

  // Opciones adicionales
  ogImage?: string;
  showTestimonials?: boolean;
  showFAQs?: boolean;

  // Video section configuration
  videoConfig?: {
    videoId: string;
    title: string;
    description?: string;
    uploadDate?: string;
    duration?: string;
    sectionTitleKey?: string; // i18n key for section title
  };
}

const ClassPageTemplate: React.FC<ClassPageTemplateProps> = ({
  categoryKey,
  categoryPath,
  faqsConfig,
  breadcrumbItems,
  courseSchemaConfig,
  heroContent,
  customSections,
  ogImage,
  showTestimonials = true,
  showFAQs = true,
  videoConfig,
}) => {
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
  const pageUrl = `${baseUrl}/${locale}/clases/${categoryPath}`;

  // Generar FAQs dinámicamente traducidos
  const faqs = faqsConfig.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  // Generar breadcrumbs dinámicamente
  const defaultBreadcrumbs = [
    { name: t(`${categoryKey}_breadcrumb_home`), url: `/${locale}` },
    { name: t(`${categoryKey}_breadcrumb_classes`), url: `/${locale}/clases/baile-barcelona` },
    { name: t(`${categoryKey}_breadcrumb_current`), url: pageUrl },
  ];

  const breadcrumbs = breadcrumbItems || defaultBreadcrumbs;

  // Breadcrumb Schema
  const _breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  // FAQPage Schema is rendered by FAQSection component - no need for manual schema

  return (
    <>
      {/* Meta Tags */}
      <Helmet>
        <title>{t(`${categoryKey}_pageTitle`)} | Farray&apos;s Center</title>
        <meta name="description" content={t(`${categoryKey}_metaDescription`)} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta
          property="og:title"
          content={`${t(`${categoryKey}_pageTitle`)} | Farray&apos;s Center`}
        />
        <meta property="og:description" content={t(`${categoryKey}_metaDescription`)} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage || `${baseUrl}/images/og-classes.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${t(`${categoryKey}_pageTitle`)} | Farray's Center`} />
        <meta name="twitter:description" content={t(`${categoryKey}_metaDescription`)} />
        <meta name="twitter:image" content={ogImage || `${baseUrl}/images/og-classes.jpg`} />
      </Helmet>

      {/* BreadcrumbList generated at build-time by prerender.mjs */}

      {/* FAQPage Schema is rendered by FAQSection component below */}

      {/* LocalBusiness Schema removed - already injected at build-time by prerender.mjs */}

      {/* Course Schema */}
      <CourseSchema
        name={t(`${categoryKey}_courseSchemaName`) || t(`${categoryKey}_pageTitle`)}
        description={t(`${categoryKey}_courseSchemaDesc`) || t(`${categoryKey}_metaDescription`)}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel={t('schema_educationalLevel')}
        teaches={
          courseSchemaConfig?.teaches || t(`${categoryKey}_courseTeaches`) || 'Dance techniques'
        }
        coursePrerequisites={courseSchemaConfig?.prerequisites || t('schema_prerequisites')}
        numberOfLessons={courseSchemaConfig?.lessons || t('schema_weeklyClasses')}
        timeRequired={courseSchemaConfig?.duration || 'PT1H'}
        availableLanguage={SUPPORTED_LOCALES}
      />

      {/* AggregateReviews Schema - handled by ReviewsSection component */}

      <div className="pt-20 md:pt-24">
        {/* Hero Content (customizable) */}
        {heroContent}

        {/* Custom Sections (secciones específicas de cada página) */}
        {customSections}

        {/* Video Section */}
        {videoConfig && (
          <section className="py-12 md:py-16 bg-gradient-to-b from-black to-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {videoConfig.sectionTitleKey && (
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-white">
                  {t(videoConfig.sectionTitleKey)}
                </h2>
              )}
              <div className="max-w-4xl mx-auto">
                <YouTubeEmbed
                  videoId={videoConfig.videoId}
                  title={videoConfig.title}
                  description={videoConfig.description}
                  uploadDate={videoConfig.uploadDate}
                  duration={videoConfig.duration}
                  disableSchema
                />
              </div>
            </div>
          </section>
        )}

        {/* Reviews Section - Google Reviews */}
        {showTestimonials && (
          <ReviewsSection category="general" limit={6} showGoogleBadge={true} layout="grid" />
        )}

        {/* FAQs Section */}
        {showFAQs && faqs.length > 0 && (
          <FAQSection title={t(`${categoryKey}_faq_title`)} faqs={faqs} />
        )}
      </div>
    </>
  );
};

export default ClassPageTemplate;
