/**
 * Blog Constants Module
 *
 * Centralized exports for all blog-related constants, types, and configurations.
 */

// Types
export * from './types';

// Author
export { AUTHOR_YUNAISY, AUTHOR_MAR_GUERRERO, DEFAULT_AUTHOR } from './author';

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
export { HISTORIA_BACHATA_CONFIG } from './articles/historia-bachata-barcelona';
export { SALSA_RITMO_CONFIG } from './articles/salsa-ritmo-conquisto-mundo';
export { CLASES_SALSA_BARCELONA_CONFIG } from './articles/clases-de-salsa-barcelona';
export { CLASES_PRINCIPIANTES_CONFIG } from './articles/clases-baile-principiantes-barcelona';
export { SALSA_VS_BACHATA_CONFIG } from './articles/salsa-vs-bachata';
export { COMO_PERDER_MIEDO_BAILAR_CONFIG } from './articles/como-perder-miedo-bailar';

// Template Enterprise (Reference - Do not use in production routes)
export { TEMPLATE_ENTERPRISE_CONFIG } from './articles/_TEMPLATE_ENTERPRISE';
