import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../../hooks/useI18n';
import { SUPPORTED_LOCALES } from '../../types';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from '../SchemaMarkup';
import FAQSection from '../FAQSection';
import TestimonialsSection from '../TestimonialsSection';
import YouTubeEmbed from '../YouTubeEmbed';
import type { Testimonial } from '../../types';

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
  testimonials?: Testimonial[];

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
  testimonials,
  breadcrumbItems,
  courseSchemaConfig,
  heroContent,
  customSections,
  ogImage,
  showTestimonials = true,
  showFAQs = true,
  videoConfig,
}) => {
  const { t, locale } = useI18n();
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
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // Reviews Schema Data
  const reviewsSchemaData = testimonials
    ? testimonials.map(testimonial => ({
        itemReviewed: {
          name: `${t(`${categoryKey}_pageTitle`)} - Farray's Center`,
          type: 'Course',
        },
        author: testimonial.name,
        reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
        reviewBody: testimonial.quote[locale],
        datePublished: '2025-01-01',
      }))
    : [];

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

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* FAQPage Schema */}
      {showFAQs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* LocalBusiness Schema */}
      <LocalBusinessSchema
        name={`Farray's International Dance Center - ${t(`${categoryKey}_pageTitle`)}`}
        description={t(`${categoryKey}_metaDescription`)}
        url={pageUrl}
        telephone="+34622247085"
        email="info@farrayscenter.com"
        address={{
          streetAddress: 'Calle Entença 100',
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
        }}
        geo={{
          latitude: '41.3751',
          longitude: '2.1482',
        }}
        priceRange="€€"
        aggregateRating={{
          ratingValue: '5',
          reviewCount: '505',
        }}
      />

      {/* Course Schema */}
      <CourseSchema
        name={t(`${categoryKey}_courseSchemaName`) || t(`${categoryKey}_pageTitle`)}
        description={t(`${categoryKey}_courseSchemaDesc`) || t(`${categoryKey}_metaDescription`)}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner, Intermediate, Advanced"
        teaches={
          courseSchemaConfig?.teaches || t(`${categoryKey}_courseTeaches`) || 'Dance techniques'
        }
        coursePrerequisites={courseSchemaConfig?.prerequisites || 'Ninguno'}
        numberOfLessons={courseSchemaConfig?.lessons || 'Clases semanales'}
        timeRequired={courseSchemaConfig?.duration || 'PT1H'}
        availableLanguage={SUPPORTED_LOCALES}
      />

      {/* AggregateReviews Schema */}
      {testimonials && testimonials.length > 0 && (
        <AggregateReviewsSchema
          reviews={reviewsSchemaData}
          itemName={`${t(`${categoryKey}_pageTitle`)} - Farray's Center`}
          itemType="Course"
        />
      )}

      <div className="pt-20 md:pt-24">
        {/* Hero Content (customizable) */}
        {heroContent}

        {/* Custom Sections (secciones específicas de cada página) */}
        {customSections}

        {/* Video Section */}
        {videoConfig && (
          <section className="py-16 md:py-24 bg-gradient-to-b from-black to-gray-900">
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
                />
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {showTestimonials && testimonials && testimonials.length > 0 && (
          <TestimonialsSection
            titleKey={`${categoryKey}_testimonials_title`}
            testimonials={testimonials}
          />
        )}

        {/* FAQs Section */}
        {showFAQs && faqs.length > 0 && (
          <FAQSection
            title={t(`${categoryKey}_faq_title`)}
            faqs={faqs}
            pageUrl={`/clases/${categoryPath}`}
          />
        )}
      </div>
    </>
  );
};

export default ClassPageTemplate;
