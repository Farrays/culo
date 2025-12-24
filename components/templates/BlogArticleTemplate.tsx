/**
 * BlogArticleTemplate Component
 *
 * Main template for rendering blog articles.
 * Follows the same configuration-driven pattern as FullDanceClassTemplate.
 *
 * Features:
 * - SEO/GEO optimized with structured data
 * - E-E-A-T signals (author box, credentials)
 * - Reading progress and ToC
 * - Premium UX with animations
 *
 * @example
 * ```tsx
 * import { BENEFICIOS_SALSA_CONFIG } from '../../constants/blog/articles/beneficios-bailar-salsa';
 *
 * const ArticlePage = () => (
 *   <BlogArticleTemplate config={BENEFICIOS_SALSA_CONFIG} />
 * );
 * ```
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../../hooks/useI18n';
import { SUPPORTED_LOCALES } from '../../types';
import type { BlogArticleConfig, AuthorConfig } from '../../constants/blog/types';
import { AUTHOR_YUNAISY, AUTHOR_MAR_GUERRERO } from '../../constants/blog/author';

// Author registry - add new authors here
const AUTHORS: Record<string, AuthorConfig> = {
  'yunaisy-farray': AUTHOR_YUNAISY,
  'mar-guerrero': AUTHOR_MAR_GUERRERO,
};

// Blog Components
import {
  ArticleHero,
  ArticleSummaryBox,
  TableOfContents,
  ReadingProgressBar,
  ArticleContent,
  AuthorBox,
  ShareButtons,
  RelatedArticles,
  BlogSchemas,
} from '../blog';

// Shared Components
import FAQSection from '../FAQSection';
import BackToTop from '../BackToTop';

interface BlogArticleTemplateProps {
  /** Article configuration */
  config: BlogArticleConfig;
}

const BlogArticleTemplate: React.FC<BlogArticleTemplateProps> = ({ config }) => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const articleUrl = `${baseUrl}/${locale}/blog/${config.category}/${config.slug}`;
  const ogImage = config.ogImage || config.featuredImage.src;

  // Get author (defaults to Yunaisy if not specified)
  const author = config.authorId ? AUTHORS[config.authorId] || AUTHOR_YUNAISY : AUTHOR_YUNAISY;

  // Transform FAQs for FAQSection component
  const transformedFaqs = config.faqSection?.faqs.map(faq => ({
    id: faq.id,
    question: t(faq.questionKey),
    answer: t(faq.answerKey),
  }));

  return (
    <>
      {/* ========== HEAD: Meta Tags ========== */}
      <Helmet>
        {/* Basic Meta */}
        <title>{t(`${config.articleKey}_title`)} | Farray&apos;s Center Blog</title>
        <meta name="description" content={t(`${config.articleKey}_metaDescription`)} />
        <link rel="canonical" href={articleUrl} />

        {/* Article Meta */}
        <meta property="article:published_time" content={config.datePublished} />
        <meta property="article:modified_time" content={config.dateModified} />
        <meta property="article:section" content={config.category} />
        <meta property="article:author" content={author.name} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={t(`${config.articleKey}_title`)} />
        <meta property="og:description" content={t(`${config.articleKey}_metaDescription`)} />
        <meta property="og:url" content={articleUrl} />
        <meta
          property="og:image"
          content={ogImage.startsWith('/') ? `${baseUrl}${ogImage}` : ogImage}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Farray's International Dance Center" />
        <meta property="og:locale" content={locale === 'es' ? 'es_ES' : locale} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t(`${config.articleKey}_title`)} />
        <meta name="twitter:description" content={t(`${config.articleKey}_metaDescription`)} />
        <meta
          name="twitter:image"
          content={ogImage.startsWith('/') ? `${baseUrl}${ogImage}` : ogImage}
        />

        {/* hreflang for multi-language */}
        {SUPPORTED_LOCALES.map(lang => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={`${baseUrl}/${lang}/blog/${config.category}/${config.slug}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es/blog/${config.category}/${config.slug}`}
        />
      </Helmet>

      {/* ========== SCHEMA MARKUP ========== */}
      <BlogSchemas config={config} author={author} />

      {/* ========== READING PROGRESS BAR ========== */}
      {config.progressBar.enabled && <ReadingProgressBar targetSelector="article" />}

      {/* ========== HERO SECTION ========== */}
      <ArticleHero config={config} />

      {/* ========== MAIN CONTENT ========== */}
      <article className="py-16 md:py-20 bg-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* ===== SIDEBAR: ToC (Desktop) ===== */}
            {config.tableOfContents.enabled && config.tableOfContents.sticky && (
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <TableOfContents sections={config.sections} sticky={true} />
              </aside>
            )}

            {/* ===== MAIN COLUMN ===== */}
            <div className="flex-1 max-w-3xl mx-auto lg:mx-0">
              {/* Summary Box (GEO Critical) */}
              <ArticleSummaryBox
                bulletKeys={config.summaryBullets}
                readingTime={config.readingTime}
                stats={config.summaryStats}
              />

              {/* ToC Inline (Mobile) */}
              {config.tableOfContents.enabled && !config.tableOfContents.sticky && (
                <TableOfContents sections={config.sections} sticky={false} />
              )}

              {/* Article Content */}
              <ArticleContent sections={config.sections} />

              {/* FAQ Section */}
              {config.faqSection?.enabled && transformedFaqs && transformedFaqs.length > 0 && (
                <section className="mt-16">
                  <FAQSection
                    title={t(config.faqSection.titleKey)}
                    faqs={transformedFaqs}
                    pageUrl={articleUrl}
                  />
                </section>
              )}

              {/* Author Box (E-E-A-T) */}
              <AuthorBox author={author} delay={100} />

              {/* Share Buttons */}
              {config.shareButtons.enabled && (
                <ShareButtons
                  title={t(`${config.articleKey}_title`)}
                  platforms={config.shareButtons.platforms}
                  className="mt-8"
                />
              )}
            </div>
          </div>

          {/* Related Articles */}
          {config.relatedArticles && config.relatedArticles.length > 0 && (
            <RelatedArticles articles={config.relatedArticles} />
          )}
        </div>
      </article>

      {/* ========== BACK TO TOP ========== */}
      <BackToTop />
    </>
  );
};

export default BlogArticleTemplate;
