/**
 * Blog Categories Configuration
 *
 * Defines the available categories for blog articles.
 * Categories are organized by content type (not dance style).
 */

import type { BlogCategory } from './types';

/**
 * Category metadata with icons and colors
 */
export interface CategoryMeta {
  /** Category key */
  key: BlogCategory;
  /** URL-friendly slug */
  slug: string;
  /** i18n key for category name */
  nameKey: string;
  /** i18n key for category description */
  descriptionKey: string;
  /** Icon name from icon library */
  icon: 'book' | 'lightbulb' | 'clock' | 'heart' | 'star';
  /** Tailwind gradient class for category accent */
  gradient: string;
}

/**
 * All blog categories with their metadata
 */
export const BLOG_CATEGORY_META: Record<BlogCategory, CategoryMeta> = {
  tutoriales: {
    key: 'tutoriales',
    slug: 'tutoriales',
    nameKey: 'blog_category_tutoriales',
    descriptionKey: 'blog_category_tutoriales_desc',
    icon: 'book',
    gradient: 'from-violet-500 to-purple-600',
  },
  tips: {
    key: 'tips',
    slug: 'tips',
    nameKey: 'blog_category_tips',
    descriptionKey: 'blog_category_tips_desc',
    icon: 'lightbulb',
    gradient: 'from-amber-500 to-orange-600',
  },
  historia: {
    key: 'historia',
    slug: 'historia',
    nameKey: 'blog_category_historia',
    descriptionKey: 'blog_category_historia_desc',
    icon: 'clock',
    gradient: 'from-emerald-500 to-teal-600',
  },
  fitness: {
    key: 'fitness',
    slug: 'fitness',
    nameKey: 'blog_category_fitness',
    descriptionKey: 'blog_category_fitness_desc',
    icon: 'heart',
    gradient: 'from-rose-500 to-pink-600',
  },
  lifestyle: {
    key: 'lifestyle',
    slug: 'lifestyle',
    nameKey: 'blog_category_lifestyle',
    descriptionKey: 'blog_category_lifestyle_desc',
    icon: 'star',
    gradient: 'from-cyan-500 to-blue-600',
  },
};

/**
 * Get category meta by key
 */
export function getCategoryMeta(category: BlogCategory): CategoryMeta {
  return BLOG_CATEGORY_META[category];
}

/**
 * Get category URL path
 */
export function getCategoryUrl(category: BlogCategory, locale: string): string {
  return `/${locale}/blog/${BLOG_CATEGORY_META[category].slug}`;
}

/**
 * Get all categories as array
 */
export function getAllCategories(): CategoryMeta[] {
  return Object.values(BLOG_CATEGORY_META);
}
