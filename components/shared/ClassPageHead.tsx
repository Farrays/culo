import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from '../SchemaMarkup';
import type { Testimonial, Locale } from '../../types';

interface ClassPageHeadProps {
  // Identificación
  categoryKey: string;
  categoryPath: string;
  locale: Locale;

  // Textos traducidos
  pageTitle: string;
  metaDescription: string;
  courseSchemaName?: string;
  courseSchemaDesc?: string;

  // Configuración
  ogImage?: string;
  courseSchemaConfig?: {
    teaches?: string;
    prerequisites?: string;
    lessons?: string;
    duration?: string;
  };

  // Reviews
  testimonials?: Testimonial[];

  // Schemas adicionales
  additionalSchemas?: React.ReactNode;
}

/**
 * Componente auxiliar para manejar meta tags, Open Graph y Schema Markup
 * de páginas de clases. Reduce duplicación sin afectar el contenido visual.
 */
const ClassPageHead: React.FC<ClassPageHeadProps> = ({
  categoryKey: _categoryKey,
  categoryPath,
  locale,
  pageTitle,
  metaDescription,
  courseSchemaName,
  courseSchemaDesc,
  ogImage,
  courseSchemaConfig,
  testimonials,
  additionalSchemas,
}) => {
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/${categoryPath}`;

  // Reviews Schema Data
  const reviewsSchemaData = testimonials
    ? testimonials.map(testimonial => ({
        itemReviewed: { name: `${pageTitle} - Farray's Center`, type: 'Course' },
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
        <title>{pageTitle} | Farray&apos;s Center</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:title" content={`${pageTitle} | Farray&apos;s Center`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImage || `${baseUrl}/images/og-classes.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${pageTitle} | Farray's Center`} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage || `${baseUrl}/images/og-classes.jpg`} />
      </Helmet>

      {/* LocalBusiness Schema */}
      <LocalBusinessSchema
        name={`Farray's International Dance Center - ${pageTitle}`}
        description={metaDescription}
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
        name={courseSchemaName || pageTitle}
        description={courseSchemaDesc || metaDescription}
        provider={{
          name: "Farray's International Dance Center",
          url: baseUrl,
        }}
        educationalLevel="Beginner, Intermediate, Advanced"
        teaches={courseSchemaConfig?.teaches || 'Dance techniques'}
        coursePrerequisites={courseSchemaConfig?.prerequisites || 'Ninguno'}
        numberOfLessons={courseSchemaConfig?.lessons || 'Clases semanales'}
        timeRequired={courseSchemaConfig?.duration || 'PT1H'}
        availableLanguage={['es', 'en', 'ca', 'fr']}
      />

      {/* AggregateReviews Schema */}
      {testimonials && testimonials.length > 0 && (
        <AggregateReviewsSchema
          reviews={reviewsSchemaData}
          itemName={`${pageTitle} - Farray's Center`}
          itemType="Course"
        />
      )}

      {/* Schemas adicionales (pasados como children) */}
      {additionalSchemas}
    </>
  );
};

export default ClassPageHead;
