/**
 * BlogArticlePage Component
 *
 * Wrapper page that loads article config and renders BlogArticleTemplate.
 * Handles routing and 404 for unknown articles.
 */

import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import BlogArticleTemplate from '../templates/BlogArticleTemplate';
import type { BlogArticleConfig } from '../../constants/blog/types';

// Import all article configs
// Add new articles here as they are created
import { BENEFICIOS_SALSA_CONFIG } from '../../constants/blog/articles/beneficios-bailar-salsa';
import { HISTORIA_SALSA_CONFIG } from '../../constants/blog/articles/historia-salsa-barcelona';

// Map of slug -> config for all articles
const ARTICLE_CONFIGS: Record<string, BlogArticleConfig> = {
  'beneficios-bailar-salsa': BENEFICIOS_SALSA_CONFIG,
  'historia-salsa-barcelona': HISTORIA_SALSA_CONFIG,
};

const BlogArticlePage: React.FC = () => {
  const { slug, category } = useParams<{ slug: string; category: string }>();
  const { locale } = useI18n();

  // Find article config by slug
  const config = slug ? ARTICLE_CONFIGS[slug] : undefined;

  // If article not found, redirect to 404
  if (!config) {
    return <Navigate to={`/${locale}/404`} replace />;
  }

  // Verify category matches (optional but good for SEO)
  if (category && config.category !== category) {
    // Redirect to correct category URL
    return <Navigate to={`/${locale}/blog/${config.category}/${config.slug}`} replace />;
  }

  return <BlogArticleTemplate config={config} />;
};

export default BlogArticlePage;
