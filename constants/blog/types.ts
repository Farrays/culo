/**
 * Blog Article Types and Interfaces
 *
 * This module defines the configuration structure for blog articles,
 * following the same pattern as FullDanceClassTemplate config.
 *
 * @example
 * ```typescript
 * const articleConfig: BlogArticleConfig = {
 *   articleKey: 'blogBeneficiosSalsa',
 *   slug: 'beneficios-bailar-salsa',
 *   category: 'fitness',
 *   // ... rest of config
 * };
 * ```
 */

// ============================================================================
// BLOG CATEGORIES
// ============================================================================

export type BlogCategory = 'tutoriales' | 'tips' | 'historia' | 'fitness' | 'lifestyle';

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  'tutoriales',
  'tips',
  'historia',
  'fitness',
  'lifestyle',
] as const;

// ============================================================================
// AUTHOR
// ============================================================================

export interface AuthorConfig {
  /** Unique identifier for the author */
  id: string;
  /** Display name */
  name: string;
  /** i18n key for localized name (if different per locale) */
  nameKey?: string;
  /** i18n key for role/title */
  roleKey: string;
  /** i18n key for short bio */
  bioKey: string;
  /** Author photo URL */
  image: string;
  /** Responsive image srcSet */
  imageSrcSet?: string;
  /** URL to author's profile page (relative, e.g., '/yunaisy-farray') */
  profileUrl: string;
  /** List of credentials/certifications */
  credentials: string[];
  /** Social media profile URLs for schema.org sameAs */
  sameAs: string[];
}

// ============================================================================
// IMAGES
// ============================================================================

export interface ArticleImage {
  /** Main image source URL */
  src: string;
  /** Responsive srcSet for different sizes */
  srcSet?: string;
  /** Alt text for accessibility */
  alt: string;
  /** Optional caption below image */
  caption?: string;
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
}

// ============================================================================
// CONTENT SECTIONS
// ============================================================================

export type ArticleSectionType =
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'numbered-list'
  | 'image'
  | 'video'
  | 'definition'
  | 'statistic'
  | 'quote'
  | 'callout'
  | 'comparison-table'
  | 'references'
  | 'answer-capsule'
  | 'testimonial';

export interface ArticleSection {
  /** Unique section ID (used for ToC linking) */
  id: string;
  /** Type of content section */
  type: ArticleSectionType;
  /** Heading level (2 or 3) - only for 'heading' type */
  level?: 2 | 3;
  /** i18n key for main content */
  contentKey: string;
  /** Image configuration - for 'image' type */
  image?: ArticleImage;
  /** List items - for 'list' type (array of i18n keys) */
  listItems?: string[];
  /** Definition term - for 'definition' type */
  definitionTermKey?: string;
  /** Statistic value - for 'statistic' type */
  statisticValue?: string;
  /** Statistic source/citation - for 'statistic' type */
  statisticSource?: string;
  /** Quote author - for 'quote' type */
  quoteAuthor?: string;
  /** Callout type - for 'callout' type */
  calloutType?: 'info' | 'tip' | 'warning' | 'cta';
  /** YouTube video ID - for 'video' type */
  videoId?: string;
  /** Video title key - for 'video' type */
  videoTitleKey?: string;
  /** Comparison table config - for 'comparison-table' type */
  tableConfig?: ComparisonTableConfig;
  /** References list - for 'references' type */
  references?: ReferenceItem[];

  // === ANSWER CAPSULE (GEO Critical - 72% AI citation rate) ===
  /** Answer capsule configuration - for 'answer-capsule' type */
  answerCapsule?: AnswerCapsuleConfig;

  // === TESTIMONIAL (Social Proof with Schema) ===
  /** Testimonial configuration - for 'testimonial' type */
  testimonial?: TestimonialConfig;

  // === NUMBERED LIST (Better for HowTo/Steps) ===
  /** Whether the numbered list should be rendered as steps (for HowTo schema) */
  isStepList?: boolean;
}

/** Reference/source item for GEO citability */
export interface ReferenceItem {
  /** Reference ID for citation linking */
  id: string;
  /** i18n key for source name/title */
  titleKey: string;
  /** External URL to the source (optional) */
  url?: string;
  /** Publisher/organization name */
  publisher?: string;
  /** Publication year */
  year?: string;
  /** Access date in ISO format */
  accessDate?: string;
  /** Logo/image URL for the source */
  image?: string;
  /** i18n key for description */
  descriptionKey?: string;
}

export interface ComparisonTableConfig {
  /** i18n keys for column headers */
  headers: string[];
  /** 2D array of i18n keys for cell content */
  rows: string[][];
  /** Column index to highlight (0-based) */
  highlightColumn?: number;
}

// ============================================================================
// ANSWER CAPSULE (GEO Critical - 72% of AI-cited pages have these)
// ============================================================================

/**
 * Answer Capsule Configuration
 *
 * Answer capsules are the #1 predictor of AI citation (72% correlation).
 * They provide a concise, direct answer that LLMs can easily extract and cite.
 *
 * @example
 * ```typescript
 * answerCapsule: {
 *   questionKey: 'blogArticle_answerQuestion',
 *   answerKey: 'blogArticle_answerText',
 *   sourceUrl: 'https://source.com/study',
 *   sourcePublisher: 'Harvard Medical School',
 *   confidence: 'high',
 * }
 * ```
 */
export interface AnswerCapsuleConfig {
  /** i18n key for the question being answered */
  questionKey: string;
  /** i18n key for the direct answer (keep it 1-2 sentences) */
  answerKey: string;
  /** Optional source URL for the answer */
  sourceUrl?: string;
  /** Source publisher/organization name */
  sourcePublisher?: string;
  /** Year of the source */
  sourceYear?: string;
  /** Confidence level indicator */
  confidence?: 'high' | 'medium' | 'verified';
  /** Icon type for visual distinction */
  icon?: 'info' | 'check' | 'star' | 'lightbulb';
}

// ============================================================================
// TESTIMONIAL (Social Proof with Review Schema)
// ============================================================================

/**
 * Testimonial Configuration
 *
 * Testimonials with proper schema support for AggregateRating and Review.
 * Enhances E-E-A-T signals with real user experiences.
 */
export interface TestimonialConfig {
  /** Testimonial author name */
  authorName: string;
  /** Author's location (e.g., "Barcelona") */
  authorLocation?: string;
  /** i18n key for the testimonial text */
  textKey: string;
  /** Rating out of 5 */
  rating: number;
  /** Author avatar image URL */
  avatar?: string;
  /** Date of review in ISO format */
  datePublished?: string;
  /** What the review is about */
  reviewOf?: 'course' | 'instructor' | 'school';
}

// ============================================================================
// SUMMARY STATISTICS (GEO-Optimized with Citation Schema)
// ============================================================================

/**
 * Summary Statistic Configuration with Full Citation Support
 *
 * Statistics with proper citation are highly valued by AI search engines.
 * The Citation schema helps LLMs attribute data correctly.
 *
 * @example
 * ```typescript
 * summaryStats: [
 *   {
 *     value: '76%',
 *     labelKey: 'blogArticle_statDementiaLabel',
 *     citation: {
 *       source: 'New England Journal of Medicine',
 *       url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
 *       year: '2003',
 *       authors: 'Verghese et al.',
 *     },
 *   },
 * ]
 * ```
 */
export interface SummaryStatConfig {
  /** The statistic value (e.g., "76%", "2,400+", "1960s") */
  value: string;
  /** i18n key for the label/description */
  labelKey: string;
  /** Source name for display (backwards compatible) */
  source?: string;
  /** Full citation configuration for schema.org Citation markup */
  citation?: CitationConfig;
}

/**
 * Citation Configuration for Schema.org markup
 *
 * Provides proper attribution for statistics and claims.
 * LLMs use this to verify and cite information accurately.
 */
export interface CitationConfig {
  /** Source publication/organization name */
  source: string;
  /** URL to the original source */
  url?: string;
  /** Publication year */
  year?: string;
  /** Authors (e.g., "Verghese et al." or "World Health Organization") */
  authors?: string;
  /** DOI if available */
  doi?: string;
  /** Access date in ISO format */
  accessDate?: string;
}

// ============================================================================
// FAQ
// ============================================================================

export interface BlogFAQ {
  /** Unique FAQ ID */
  id: string;
  /** i18n key for question */
  questionKey: string;
  /** i18n key for answer (supports HTML) */
  answerKey: string;
}

// ============================================================================
// RELATED ARTICLES
// ============================================================================

export interface RelatedArticle {
  /** Article slug for URL */
  slug: string;
  /** Article category */
  category: BlogCategory;
  /** i18n key for title */
  titleKey: string;
  /** i18n key for excerpt/summary */
  excerptKey: string;
  /** Thumbnail image URL */
  image: string;
}

// ============================================================================
// BREADCRUMB
// ============================================================================

export interface BlogBreadcrumbConfig {
  /** i18n key for "Home" */
  homeKey: string;
  /** i18n key for "Blog" */
  blogKey: string;
  /** i18n key for category name */
  categoryKey: string;
  /** URL path for category (e.g., '/blog/fitness') */
  categoryUrl: string;
  /** i18n key for current article title (breadcrumb version) */
  currentKey: string;
}

// ============================================================================
// SCHEMA CONFIGURATION
// ============================================================================

export interface VideoSchemaConfig {
  /** Enable video schema */
  enabled: boolean;
  /** YouTube video ID */
  videoId: string;
  /** i18n key for video title */
  titleKey: string;
  /** i18n key for video description */
  descriptionKey: string;
  /** Thumbnail URL (auto-generated from YouTube if not provided) */
  thumbnailUrl?: string;
  /** Video duration in ISO 8601 format (e.g., 'PT5M30S') */
  duration?: string;
  /** Upload date in ISO 8601 format */
  uploadDate?: string;
}

export interface HowToSchemaConfig {
  /** Enable HowTo schema (for tutorial articles) */
  enabled: boolean;
  /** i18n key for HowTo name */
  nameKey: string;
  /** i18n key for HowTo description */
  descriptionKey: string;
  /** Total time in ISO 8601 format (e.g., 'PT30M') */
  totalTime?: string;
  /** Estimated cost */
  estimatedCost?: {
    currency: string;
    value: string;
  };
  /** i18n keys for supplies needed */
  supplies?: string[];
  /** i18n keys for tools needed */
  tools?: string[];
  /** Steps configuration */
  steps: Array<{
    nameKey: string;
    textKey: string;
    image?: string;
  }>;
}

// ============================================================================
// MAIN BLOG ARTICLE CONFIG
// ============================================================================

export interface BlogArticleConfig {
  // === IDENTIFICATION ===
  /** Translation prefix for all article i18n keys (e.g., 'blogBeneficiosSalsa') */
  articleKey: string;
  /** URL slug (e.g., 'beneficios-bailar-salsa') */
  slug: string;
  /** Article category */
  category: BlogCategory;

  // === DATES ===
  /** Publication date in ISO 8601 format (e.g., '2025-01-15') */
  datePublished: string;
  /** Last modification date in ISO 8601 format */
  dateModified: string;

  // === READING METRICS ===
  /** Estimated reading time in minutes */
  readingTime: number;
  /** Word count for schema */
  wordCount: number;

  // === CONTENT ===
  /** i18n keys for summary bullets (3-4 recommended for GEO) */
  summaryBullets: string[];
  /** Key statistics for summary box (holographic cards) with GEO-optimized citations */
  summaryStats?: SummaryStatConfig[];
  /** Article content sections */
  sections: ArticleSection[];

  // === AUTHOR ===
  /** Custom author ID (defaults to Yunaisy if not set) */
  authorId?: string;

  // === IMAGES ===
  /** Featured/hero image configuration */
  featuredImage: ArticleImage;
  /** Open Graph image URL (defaults to featuredImage if not set) */
  ogImage?: string;

  // === NAVIGATION ===
  /** Breadcrumb configuration */
  breadcrumbConfig: BlogBreadcrumbConfig;

  // === FAQ ===
  /** FAQ section configuration */
  faqSection?: {
    enabled: boolean;
    /** i18n key for FAQ section title */
    titleKey: string;
    /** FAQ items */
    faqs: BlogFAQ[];
  };

  // === RELATED CONTENT ===
  /** Related articles to display at the end */
  relatedArticles?: RelatedArticle[];
  /** Related dance class slugs (for internal linking) */
  relatedClasses?: string[];

  // === UX TOGGLES ===
  /** Table of contents configuration */
  tableOfContents: {
    enabled: boolean;
    /** Show sticky ToC on desktop sidebar */
    sticky: boolean;
  };
  /** Reading progress bar configuration */
  progressBar: {
    enabled: boolean;
  };
  /** Social share buttons configuration */
  shareButtons: {
    enabled: boolean;
    platforms: Array<'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email'>;
  };

  // === SCHEMA EXTENSIONS ===
  /** Video schema for articles with embedded videos */
  videoSchema?: VideoSchemaConfig;
  /** HowTo schema for tutorial articles */
  howToSchema?: HowToSchemaConfig;
  /** CSS selectors for speakable content (voice search) */
  speakableSelectors?: string[];

  // === PILLAR/CLUSTER STRATEGY (2026) ===
  /** Content type for pillar/cluster strategy */
  contentType?: 'pillar' | 'cluster' | 'standalone';
  /** Pillar page slug (if this is a cluster page) */
  pillarSlug?: string;
  /** Cluster page slugs (if this is a pillar page) */
  clusterSlugs?: string[];

  // === ADDITIONAL SCHEMAS (2026 GEO) ===
  /** LocalBusiness schema for local SEO */
  localBusinessSchema?: {
    enabled: boolean;
  };
  /** Course schema for class-related articles */
  courseSchema?: {
    enabled: boolean;
    courseNameKey: string;
    courseDescriptionKey: string;
    provider: string;
    courseMode: 'Online' | 'OnSite' | 'Blended';
    offers?: {
      price: string;
      currency: string;
      availability?: string;
    };
  };
  /** Event schema for event-related articles */
  eventSchema?: {
    enabled: boolean;
    eventNameKey: string;
    startDate: string;
    endDate?: string;
    location: string;
    offers?: {
      price: string;
      currency: string;
    };
  };
  /** AggregateRating schema for reviews */
  aggregateRatingSchema?: {
    enabled: boolean;
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };

  // === GOOGLE DISCOVER (2026) ===
  /** Enable Google Discover optimization (adds max-image-preview:large meta) */
  discoverOptimized?: boolean;
}

// ============================================================================
// BLOG LIST PAGE
// ============================================================================

export interface BlogListConfig {
  /** Currently active category filter (undefined = all) */
  activeCategory?: BlogCategory;
  /** Number of articles per page */
  articlesPerPage: number;
  /** Current page number (1-based) */
  currentPage: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** Article metadata for list/card display */
export interface ArticleCardData {
  slug: string;
  category: BlogCategory;
  titleKey: string;
  excerptKey: string;
  image: string;
  readingTime: number;
  datePublished: string;
}

/** Extracts card data from full article config */
export function getArticleCardData(config: BlogArticleConfig): ArticleCardData {
  return {
    slug: config.slug,
    category: config.category,
    titleKey: `${config.articleKey}_title`,
    excerptKey: `${config.articleKey}_excerpt`,
    image: config.featuredImage.src,
    readingTime: config.readingTime,
    datePublished: config.datePublished,
  };
}
