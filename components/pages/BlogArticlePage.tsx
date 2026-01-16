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
import { HISTORIA_BACHATA_CONFIG } from '../../constants/blog/articles/historia-bachata-barcelona';
import { SALSA_RITMO_CONFIG } from '../../constants/blog/articles/salsa-ritmo-conquisto-mundo';
import { SALSA_VS_BACHATA_CONFIG } from '../../constants/blog/articles/salsa-vs-bachata';
import { CLASES_SALSA_BARCELONA_CONFIG } from '../../constants/blog/articles/clases-de-salsa-barcelona';
import { CLASES_PRINCIPIANTES_CONFIG } from '../../constants/blog/articles/clases-baile-principiantes-barcelona';
import { COMO_PERDER_MIEDO_BAILAR_CONFIG } from '../../constants/blog/articles/como-perder-miedo-bailar';

// Map of slug -> config for all articles
const ARTICLE_CONFIGS: Record<string, BlogArticleConfig> = {
  'beneficios-bailar-salsa': BENEFICIOS_SALSA_CONFIG,
  'historia-salsa-barcelona': HISTORIA_SALSA_CONFIG,
  'historia-bachata-barcelona': HISTORIA_BACHATA_CONFIG,
  'salsa-ritmo-conquisto-mundo': SALSA_RITMO_CONFIG,
  'salsa-vs-bachata-que-estilo-elegir': SALSA_VS_BACHATA_CONFIG,
  'clases-de-salsa-barcelona': CLASES_SALSA_BARCELONA_CONFIG,
  'clases-baile-principiantes-barcelona-farrays': CLASES_PRINCIPIANTES_CONFIG,
  'como-perder-miedo-bailar': COMO_PERDER_MIEDO_BAILAR_CONFIG,
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
