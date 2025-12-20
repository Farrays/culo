/**
 * Blog Constants Module
 *
 * Centralized exports for all blog-related constants, types, and configurations.
 */

// Types
export * from './types';

// Author
export { AUTHOR_YUNAISY, DEFAULT_AUTHOR } from './author';

// Categories
export {
  BLOG_CATEGORY_META,
  getCategoryMeta,
  getCategoryUrl,
  getAllCategories,
} from './categories';
export type { CategoryMeta } from './categories';

// Articles
export { BENEFICIOS_SALSA_CONFIG } from './articles/beneficios-bailar-salsa';
export { HISTORIA_SALSA_CONFIG } from './articles/historia-salsa-barcelona';
