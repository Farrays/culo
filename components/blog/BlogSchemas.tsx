/**
 * BlogSchemas Component
 *
 * Centralizes all schema.org structured data for blog articles.
 * Includes Article, Person (author), BreadcrumbList, FAQPage, SpeakableSpecification,
 * Citation, DefinedTerm, and Review schemas for maximum GEO optimization.
 *
 * GEO Features:
 * - Citation schema for statistics with proper source attribution
 * - DefinedTerm schema with full @id and sameAs for definitions
 * - Priority-based SpeakableSpecification for voice search
 * - ItemList schema for answer capsules (LLM-friendly)
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../../hooks/useI18n';
import { DEFAULT_AUTHOR } from '../../constants/blog/author';
import type {
  BlogArticleConfig,
  AuthorConfig,
  SummaryStatConfig,
} from '../../constants/blog/types';

interface BlogSchemasProps {
  /** Article configuration */
  config: BlogArticleConfig;
  /** Author configuration (defaults to Yunaisy if not provided) */
  author?: AuthorConfig;
}

const BlogSchemas: React.FC<BlogSchemasProps> = ({ config, author: authorProp }) => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const author = authorProp || DEFAULT_AUTHOR;
  const articleUrl = `${baseUrl}/${locale}/blog/${config.category}/${config.slug}`;

  // Article Schema (BlogPosting)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${articleUrl}#article`,
    headline: t(`${config.articleKey}_title`),
    description: t(`${config.articleKey}_metaDescription`),
    image: config.featuredImage.src.startsWith('/')
      ? `${baseUrl}${config.featuredImage.src}`
      : config.featuredImage.src,
    datePublished: config.datePublished,
    dateModified: config.dateModified,
    wordCount: config.wordCount,
    articleSection: config.category,
    inLanguage:
      locale === 'es' ? 'es-ES' : locale === 'ca' ? 'ca-ES' : locale === 'fr' ? 'fr-FR' : 'en',
    author: {
      '@type': 'Person',
      '@id': `${baseUrl}/${locale}${author.profileUrl}#person`,
      name: author.name,
      url: `${baseUrl}/${locale}${author.profileUrl}`,
      image: author.image.startsWith('/') ? `${baseUrl}${author.image}` : author.image,
      jobTitle: t(author.roleKey),
      sameAs: author.sameAs,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${baseUrl}/#organization`,
      name: "Farray's International Dance Center",
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo-fidc.png`,
        width: '512',
        height: '512',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  // Person Schema (Author - E-E-A-T)
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${baseUrl}/${locale}${author.profileUrl}#person`,
    name: author.name,
    url: `${baseUrl}/${locale}${author.profileUrl}`,
    image: author.image.startsWith('/') ? `${baseUrl}${author.image}` : author.image,
    jobTitle: t(author.roleKey),
    description: t(author.bioKey),
    sameAs: author.sameAs,
    worksFor: {
      '@type': 'DanceSchool',
      name: "Farray's International Dance Center",
      url: baseUrl,
    },
    knowsAbout: [
      'Dance',
      'Salsa',
      'Dancehall',
      'Afrobeat',
      'Hip Hop',
      'Reggaeton',
      'Contemporary Dance',
      'Ballet',
    ],
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t(config.breadcrumbConfig.homeKey),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t(config.breadcrumbConfig.blogKey),
        item: `${baseUrl}/${locale}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t(config.breadcrumbConfig.categoryKey),
        item: `${baseUrl}/${locale}${config.breadcrumbConfig.categoryUrl}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t(config.breadcrumbConfig.currentKey),
        item: articleUrl,
      },
    ],
  };

  // FAQPage Schema (if FAQ section is enabled)
  const faqSchema = config.faqSection?.enabled
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faqSection.faqs.map(faq => ({
          '@type': 'Question',
          name: t(faq.questionKey),
          acceptedAnswer: {
            '@type': 'Answer',
            text: t(faq.answerKey),
          },
        })),
      }
    : null;

  // SpeakableSpecification Schema (for voice search)
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': articleUrl,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: config.speakableSelectors || [
        '#article-summary',
        'article h2',
        'article p:first-of-type',
      ],
    },
  };

  // VideoObject Schema (if video is present)
  const videoSchema = config.videoSchema?.enabled
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: t(config.videoSchema.titleKey),
        description: t(config.videoSchema.descriptionKey),
        thumbnailUrl:
          config.videoSchema.thumbnailUrl ||
          `https://img.youtube.com/vi/${config.videoSchema.videoId}/maxresdefault.jpg`,
        uploadDate: config.videoSchema.uploadDate || config.datePublished,
        duration: config.videoSchema.duration,
        contentUrl: `https://www.youtube.com/watch?v=${config.videoSchema.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${config.videoSchema.videoId}`,
        publisher: {
          '@type': 'Organization',
          name: "Farray's International Dance Center",
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/images/logo-fidc.png`,
          },
        },
      }
    : null;

  // HowTo Schema (for tutorial articles)
  const howToSchema = config.howToSchema?.enabled
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: t(config.howToSchema.nameKey),
        description: t(config.howToSchema.descriptionKey),
        totalTime: config.howToSchema.totalTime,
        estimatedCost: config.howToSchema.estimatedCost,
        supply: config.howToSchema.supplies?.map(key => ({
          '@type': 'HowToSupply',
          name: t(key),
        })),
        tool: config.howToSchema.tools?.map(key => ({
          '@type': 'HowToTool',
          name: t(key),
        })),
        step: config.howToSchema.steps.map((step, index) => ({
          '@type': 'HowToStep',
          position: index + 1,
          name: t(step.nameKey),
          text: t(step.textKey),
          image: step.image,
        })),
      }
    : null;

  // ============================================================================
  // GEO-OPTIMIZED SCHEMAS (For AI Search Engines)
  // ============================================================================

  /**
   * Citation Schema for Statistics
   * Helps LLMs attribute data correctly when citing statistics
   */
  const buildCitationSchema = (stat: SummaryStatConfig) => {
    if (!stat.citation) return null;
    return {
      '@type': 'Claim',
      claimReviewed: `${stat.value} - ${t(stat.labelKey)}`,
      appearance: {
        '@type': 'ScholarlyArticle',
        name: stat.citation.source,
        url: stat.citation.url,
        datePublished: stat.citation.year,
        author: stat.citation.authors
          ? {
              '@type': 'Person',
              name: stat.citation.authors,
            }
          : undefined,
        identifier: stat.citation.doi
          ? {
              '@type': 'PropertyValue',
              propertyID: 'DOI',
              value: stat.citation.doi,
            }
          : undefined,
      },
    };
  };

  // ItemList Schema for key facts (GEO - helps LLMs extract key information)
  const keyFactsSchema =
    config.summaryStats && config.summaryStats.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          '@id': `${articleUrl}#key-facts`,
          name: 'Key Facts',
          description: t(`${config.articleKey}_metaDescription`),
          numberOfItems: config.summaryStats.length,
          itemListElement: config.summaryStats.map((stat, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: t(stat.labelKey),
            description: stat.value,
            ...(stat.citation && {
              citation: buildCitationSchema(stat),
            }),
          })),
        }
      : null;

  /**
   * DefinedTerm Schema for definitions in content
   * Enhanced with @id, url, inLanguage, and sameAs for better GEO
   */
  const definitionSections = config.sections.filter(s => s.type === 'definition');
  const definedTermSchemas =
    definitionSections.length > 0
      ? definitionSections.map(section => ({
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          '@id': `${articleUrl}#${section.id}`,
          name: section.definitionTermKey ? t(section.definitionTermKey) : '',
          description: t(section.contentKey),
          inDefinedTermSet: {
            '@type': 'DefinedTermSet',
            name: 'Dance Terminology',
            '@id': `${baseUrl}/${locale}/glosario`,
          },
          inLanguage:
            locale === 'es'
              ? 'es-ES'
              : locale === 'ca'
                ? 'ca-ES'
                : locale === 'fr'
                  ? 'fr-FR'
                  : 'en',
          url: `${articleUrl}#${section.id}`,
        }))
      : [];

  /**
   * Answer Capsule Schema (ClaimReview-like for AI extraction)
   * Answer capsules are the #1 predictor of AI citation
   */
  const answerCapsuleSections = config.sections.filter(s => s.type === 'answer-capsule');
  const answerCapsuleSchemas =
    answerCapsuleSections.length > 0
      ? answerCapsuleSections
          .filter(section => section.answerCapsule)
          .map(section => {
            const capsule = section.answerCapsule;
            if (!capsule) return null;
            return {
              '@context': 'https://schema.org',
              '@type': 'Question',
              '@id': `${articleUrl}#${section.id}`,
              name: t(capsule.questionKey),
              acceptedAnswer: {
                '@type': 'Answer',
                text: t(capsule.answerKey),
                url: `${articleUrl}#${section.id}`,
                ...(capsule.sourceUrl && {
                  citation: {
                    '@type': 'CreativeWork',
                    name: capsule.sourcePublisher,
                    url: capsule.sourceUrl,
                    datePublished: capsule.sourceYear,
                  },
                }),
              },
            };
          })
          .filter(Boolean)
      : [];

  /**
   * Review Schema for testimonials
   * Enhances E-E-A-T with real user experiences
   */
  const testimonialSections = config.sections.filter(s => s.type === 'testimonial');
  const reviewSchemas =
    testimonialSections.length > 0
      ? testimonialSections
          .filter(section => section.testimonial)
          .map(section => {
            const testimonial = section.testimonial;
            if (!testimonial) return null;
            return {
              '@context': 'https://schema.org',
              '@type': 'Review',
              '@id': `${articleUrl}#${section.id}`,
              reviewBody: t(testimonial.textKey),
              reviewRating: {
                '@type': 'Rating',
                ratingValue: testimonial.rating,
                bestRating: 5,
              },
              author: {
                '@type': 'Person',
                name: testimonial.authorName,
                ...(testimonial.authorLocation && {
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: testimonial.authorLocation,
                  },
                }),
              },
              itemReviewed: {
                '@type': 'DanceSchool',
                name: "Farray's International Dance Center",
                '@id': `${baseUrl}/#organization`,
              },
              datePublished: testimonial.datePublished || config.datePublished,
            };
          })
          .filter(Boolean)
      : [];

  return (
    <Helmet>
      {/* Article Schema */}
      <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>

      {/* Person Schema */}
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>

      {/* FAQ Schema */}
      {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}

      {/* Speakable Schema */}
      <script type="application/ld+json">{JSON.stringify(speakableSchema)}</script>

      {/* Video Schema */}
      {videoSchema && <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>}

      {/* HowTo Schema */}
      {howToSchema && <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>}

      {/* ============================================================ */}
      {/* GEO-OPTIMIZED SCHEMAS (For AI Search Engines) */}
      {/* ============================================================ */}

      {/* Key Facts ItemList Schema */}
      {keyFactsSchema && (
        <script type="application/ld+json">{JSON.stringify(keyFactsSchema)}</script>
      )}

      {/* DefinedTerm Schemas */}
      {definedTermSchemas.map((schema, index) => (
        <script key={`defined-term-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {/* Answer Capsule Schemas (Critical for GEO) */}
      {answerCapsuleSchemas.map((schema, index) => (
        <script key={`answer-capsule-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {/* Review/Testimonial Schemas */}
      {reviewSchemas.map((schema, index) => (
        <script key={`review-${index}`} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default BlogSchemas;
