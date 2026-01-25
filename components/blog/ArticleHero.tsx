/**
 * ArticleHero Component
 *
 * Hero section for blog articles with featured image,
 * title, metadata, and breadcrumbs.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { getCategoryMeta } from '../../constants/blog/categories';
import { DEFAULT_AUTHOR } from '../../constants/blog/author';
import type { BlogArticleConfig } from '../../constants/blog/types';
import Breadcrumb from '../shared/Breadcrumb';
import LazyImage from '../LazyImage';
import { ClockIcon, CalendarDaysIcon } from '../../lib/icons';

interface ArticleHeroProps {
  /** Article configuration */
  config: BlogArticleConfig;
  /** Additional CSS classes */
  className?: string;
}

const ArticleHero: React.FC<ArticleHeroProps> = ({ config, className = '' }) => {
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
  const categoryMeta = getCategoryMeta(config.category);
  const author = DEFAULT_AUTHOR;

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'es' ? 'es-ES' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { name: t(config.breadcrumbConfig.homeKey), url: `/${locale}` },
    { name: t(config.breadcrumbConfig.blogKey), url: `/${locale}/blog` },
    {
      name: t(config.breadcrumbConfig.categoryKey),
      url: `/${locale}${config.breadcrumbConfig.categoryUrl}`,
    },
    {
      name: t(config.breadcrumbConfig.currentKey),
      url: `/${locale}/blog/${config.category}/${config.slug}`,
      isActive: true,
    },
  ];

  return (
    <section className={`relative pt-20 md:pt-24 ${className}`}>
      {/* Background with featured image - LCP optimized */}
      <div className="absolute inset-0 h-[600px] md:h-[700px]">
        <LazyImage
          src={config.featuredImage.src}
          srcSet={config.featuredImage.srcSet}
          sizes="100vw"
          alt={
            config.featuredImage.altKey ? t(config.featuredImage.altKey) : config.featuredImage.alt
          }
          className="w-full h-full object-cover"
          width={config.featuredImage.width}
          height={config.featuredImage.height}
          priority="high"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/40 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-12 md:py-16">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

        {/* Category badge */}
        <div className="mt-8 mb-6">
          <span
            className={`inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider
                       rounded-full bg-gradient-to-r ${categoryMeta.gradient}
                       text-white shadow-lg`}
          >
            {t(categoryMeta.nameKey)}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-black text-neutral
                     tracking-tight leading-tight mb-8 max-w-4xl"
        >
          {t(`${config.articleKey}_title`)}
        </h1>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-6 text-neutral/80">
          {/* Author */}
          <div className="flex items-center gap-3">
            <img
              src={author.image}
              alt={author.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full border-2 border-primary-accent/50 object-cover"
            />
            <div>
              <span className="block font-medium text-neutral">{author.name}</span>
              <span className="block text-sm text-neutral/60">{t(author.roleKey)}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-10 bg-neutral/30" />

          {/* Published date */}
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-primary-accent" />
            <span>{t('blog_publishedOn').replace('{date}', formatDate(config.datePublished))}</span>
          </div>

          {/* Reading time */}
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-primary-accent" />
            <span>{t('blog_readingTime').replace('{minutes}', String(config.readingTime))}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleHero;
