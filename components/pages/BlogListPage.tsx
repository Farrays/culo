/**
 * BlogListPage Component
 *
 * Displays a list of blog articles with category filtering.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES } from '../../types';
import { getAllCategories, getCategoryMeta } from '../../constants/blog/categories';
import type { BlogCategory, ArticleCardData } from '../../constants/blog/types';
import { getArticleCardData } from '../../constants/blog/types';
import Breadcrumb from '../shared/Breadcrumb';
import AnimateOnScroll from '../AnimateOnScroll';
import ArticleCard from '../blog/ArticleCard';
import BackToTop from '../BackToTop';

// Import all article configs
import { BENEFICIOS_SALSA_CONFIG } from '../../constants/blog/articles/beneficios-bailar-salsa';
import { HISTORIA_SALSA_CONFIG } from '../../constants/blog/articles/historia-salsa-barcelona';
import { HISTORIA_BACHATA_CONFIG } from '../../constants/blog/articles/historia-bachata-barcelona';
import { SALSA_RITMO_CONFIG } from '../../constants/blog/articles/salsa-ritmo-conquisto-mundo';
import { SALSA_VS_BACHATA_CONFIG } from '../../constants/blog/articles/salsa-vs-bachata';
import { CLASES_SALSA_BARCELONA_CONFIG } from '../../constants/blog/articles/clases-de-salsa-barcelona';
import { CLASES_PRINCIPIANTES_CONFIG } from '../../constants/blog/articles/clases-baile-principiantes-barcelona';
import { COMO_PERDER_MIEDO_BAILAR_CONFIG } from '../../constants/blog/articles/como-perder-miedo-bailar';
import { BAILE_SALUD_MENTAL_CONFIG } from '../../constants/blog/articles/baile-salud-mental';
import { ACADEMIA_DANZA_BARCELONA_CONFIG } from '../../constants/blog/articles/academia-de-danza-barcelona';
import { BALLET_ADULTOS_BARCELONA_CONFIG } from '../../constants/blog/articles/ballet-para-adultos-barcelona';
import { DANZA_CONTEMPORANEA_VS_JAZZ_BALLET_CONFIG } from '../../constants/blog/articles/danza-contemporanea-vs-modern-jazz-vs-ballet';
import { DANZAS_URBANAS_BARCELONA_CONFIG } from '../../constants/blog/articles/danzas-urbanas-barcelona';

// Generate article card data from configs
const ALL_ARTICLES: ArticleCardData[] = [
  getArticleCardData(BENEFICIOS_SALSA_CONFIG),
  getArticleCardData(HISTORIA_SALSA_CONFIG),
  getArticleCardData(HISTORIA_BACHATA_CONFIG),
  getArticleCardData(SALSA_RITMO_CONFIG),
  getArticleCardData(SALSA_VS_BACHATA_CONFIG),
  getArticleCardData(CLASES_SALSA_BARCELONA_CONFIG),
  getArticleCardData(CLASES_PRINCIPIANTES_CONFIG),
  getArticleCardData(COMO_PERDER_MIEDO_BAILAR_CONFIG),
  getArticleCardData(BAILE_SALUD_MENTAL_CONFIG),
  getArticleCardData(ACADEMIA_DANZA_BARCELONA_CONFIG),
  getArticleCardData(BALLET_ADULTOS_BARCELONA_CONFIG),
  getArticleCardData(DANZA_CONTEMPORANEA_VS_JAZZ_BALLET_CONFIG),
  getArticleCardData(DANZAS_URBANAS_BARCELONA_CONFIG),
];

const BlogListPage: React.FC = () => {
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
  const { category } = useParams<{ category?: string }>();
  const baseUrl = 'https://www.farrayscenter.com';

  // Get active category filter
  const activeCategory = category as BlogCategory | undefined;
  const activeCategoryMeta = activeCategory ? getCategoryMeta(activeCategory) : null;

  // Filter articles by category
  const filteredArticles = activeCategory
    ? ALL_ARTICLES.filter(article => article.category === activeCategory)
    : ALL_ARTICLES;

  // Breadcrumb items
  const breadcrumbItems = [
    { name: t('blog_breadcrumbHome'), url: `/${locale}` },
    { name: t('blog_breadcrumbBlog'), url: `/${locale}/blog`, isActive: !activeCategory },
    ...(activeCategoryMeta
      ? [
          {
            name: t(activeCategoryMeta.nameKey),
            url: `/${locale}/blog/${activeCategory}`,
            isActive: true,
          },
        ]
      : []),
  ];

  // Page title and description
  const blogPageTitle = String(t('blog_pageTitle') || 'Blog');
  const [blogTitleFirst = 'Blog'] = blogPageTitle.split('|');
  const pageTitle = activeCategoryMeta
    ? `${t(activeCategoryMeta.nameKey)} | ${blogPageTitle}`
    : blogPageTitle;
  const pageDescription = activeCategoryMeta
    ? t(activeCategoryMeta.descriptionKey)
    : t('blog_metaDescription');
  const displayTitle = activeCategoryMeta
    ? String(t(activeCategoryMeta.nameKey))
    : blogTitleFirst.trim();
  const pageUrl = activeCategory
    ? `${baseUrl}/${locale}/blog/${activeCategory}`
    : `${baseUrl}/${locale}/blog`;

  return (
    <>
      {/* ========== HEAD: Meta Tags ========== */}
      <Helmet>
        <title>{pageTitle} | Farray&apos;s Center</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={`${baseUrl}/images/og-blog.jpg`} />
        <meta property="og:site_name" content="Farray's International Dance Center" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* hreflang */}
        {SUPPORTED_LOCALES.map(lang => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={lang}
            href={
              activeCategory
                ? `${baseUrl}/${lang}/blog/${activeCategory}`
                : `${baseUrl}/${lang}/blog`
            }
          />
        ))}
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* ========== HERO SECTION ========== */}
        <section className="relative py-12 md:py-16 bg-black overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black" />
          </div>

          <div className="relative z-10 container mx-auto px-6">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            {/* Title */}
            <AnimateOnScroll>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-black text-white mt-8 mb-6"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {displayTitle}
              </h1>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <p className="text-xl text-neutral/80 max-w-2xl">{pageDescription}</p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ========== CATEGORY FILTERS ========== */}
        <section className="py-8 bg-black border-b border-primary-dark/30">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap gap-3">
              {/* All categories */}
              <Link
                to={`/${locale}/blog`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                           ${
                             !activeCategory
                               ? 'bg-primary-accent text-white'
                               : 'bg-primary-dark/30 text-neutral/70 hover:text-neutral hover:bg-primary-dark/50'
                           }`}
              >
                {t('blog_allArticles')}
              </Link>

              {/* Category filters */}
              {getAllCategories().map(cat => (
                <Link
                  key={cat.key}
                  to={`/${locale}/blog/${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                             ${
                               activeCategory === cat.key
                                 ? `bg-gradient-to-r ${cat.gradient} text-white`
                                 : 'bg-primary-dark/30 text-neutral/70 hover:text-neutral hover:bg-primary-dark/50'
                             }`}
                >
                  {t(cat.nameKey)}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========== ARTICLES GRID ========== */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article, index) => (
                  <ArticleCard key={article.slug} article={article} delay={index * 100} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <AnimateOnScroll>
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-primary-dark/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-neutral/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-neutral mb-4">{t('blog_noArticles')}</h2>
                  <p className="text-neutral/60 mb-8">{t('blog_noArticlesDesc')}</p>
                  <Link
                    to={`/${locale}/blog`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary-accent text-white
                               font-bold rounded-full hover:scale-105 transition-transform duration-300"
                  >
                    {t('blog_viewAllArticles')}
                  </Link>
                </div>
              </AnimateOnScroll>
            )}
          </div>
        </section>
      </div>

      <BackToTop />
    </>
  );
};

export default BlogListPage;
