/**
 * Article Configuration: Hombres y mujeres, ¿hablamos salsa?
 *
 * Guest article by Mar Guerrero (Copywriter & Dance Enthusiast).
 * Reflections on dance as a space for connection and expression.
 *
 * Category: Lifestyle
 * Target Keywords: clases de salsa barcelona, bailar salsa, pista de baile,
 *                  salsa pareja, aprender salsa barcelona
 */

import type { BlogArticleConfig } from '../types';

export const CLASES_SALSA_BARCELONA_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blogClasesSalsaBarcelona',
  slug: 'clases-de-salsa-barcelona',
  category: 'lifestyle',

  // === AUTHOR ===
  authorId: 'mar-guerrero',

  // === DATES ===
  datePublished: '2019-04-24',
  dateModified: '2019-04-24',

  // === READING METRICS ===
  readingTime: 5,
  wordCount: 650,

  // === SUMMARY (GEO Optimized) ===
  summaryBullets: [
    'blogClasesSalsaBarcelona_summaryBullet1',
    'blogClasesSalsaBarcelona_summaryBullet2',
    'blogClasesSalsaBarcelona_summaryBullet3',
  ],

  // === CONTENT SECTIONS ===
  sections: [
    // =====================================================
    // INTRODUCTION - Revolución y espacios de expresión
    // =====================================================
    {
      id: 'intro',
      type: 'paragraph',
      contentKey: 'blogClasesSalsaBarcelona_intro',
    },

    // =====================================================
    // SECTION 1: LA PISTA DE BAILE
    // =====================================================
    {
      id: 'pista-baile',
      type: 'heading',
      level: 2,
      contentKey: 'blogClasesSalsaBarcelona_section1Title',
    },
    {
      id: 'pista-baile-content',
      type: 'paragraph',
      contentKey: 'blogClasesSalsaBarcelona_section1Content',
    },

    // === IMAGE: Pareja bailando salsa ===
    {
      id: 'image-pareja',
      type: 'image',
      contentKey: 'blogClasesSalsaBarcelona_imagePareja',
      image: {
        src: '/images/blog/clases-salsa-barcelona/pareja-bailando.webp',
        alt: 'Pareja bailando salsa en Barcelona - conexión y expresión a través del baile',
        caption: 'blogClasesSalsaBarcelona_imagePareja',
        width: 800,
        height: 500,
      },
    },

    // =====================================================
    // SECTION 2: LA SALSA COMO LENGUAJE UNIVERSAL
    // =====================================================
    {
      id: 'lenguaje-universal',
      type: 'heading',
      level: 2,
      contentKey: 'blogClasesSalsaBarcelona_section2Title',
    },
    {
      id: 'lenguaje-universal-content1',
      type: 'paragraph',
      contentKey: 'blogClasesSalsaBarcelona_section2Content1',
    },
    {
      id: 'lenguaje-universal-content2',
      type: 'paragraph',
      contentKey: 'blogClasesSalsaBarcelona_section2Content2',
    },

    // === IMAGE: Cuban Salsa ===
    {
      id: 'image-cuban',
      type: 'image',
      contentKey: 'blogClasesSalsaBarcelona_imageCuban',
      image: {
        src: '/images/blog/clases-salsa-barcelona/cuban-salsa.webp',
        alt: 'Salsa cubana en Barcelona - lenguaje universal del baile',
        caption: 'blogClasesSalsaBarcelona_imageCuban',
        width: 800,
        height: 500,
      },
    },

    // =====================================================
    // SECTION 3: CONCLUSIÓN - HABLEMOS SALSA
    // =====================================================
    {
      id: 'hablemos-salsa',
      type: 'heading',
      level: 2,
      contentKey: 'blogClasesSalsaBarcelona_section3Title',
    },
    {
      id: 'hablemos-salsa-content',
      type: 'paragraph',
      contentKey: 'blogClasesSalsaBarcelona_section3Content',
    },

    // =====================================================
    // SECTION 4: APRENDE CON PROFESIONALES
    // =====================================================
    {
      id: 'aprende',
      type: 'heading',
      level: 2,
      contentKey: 'blogClasesSalsaBarcelona_section4Title',
    },
    {
      id: 'aprende-content',
      type: 'paragraph',
      contentKey: 'blogClasesSalsaBarcelona_section4Content',
    },

    // === CTA: Enlaces a clases de salsa ===
    {
      id: 'cta-clases',
      type: 'callout',
      calloutType: 'cta',
      contentKey: 'blogClasesSalsaBarcelona_ctaClases',
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/clases-salsa-barcelona/hero.webp',
    alt: "Clases de salsa en Barcelona - Farray's Dance Center",
    width: 1200,
    height: 630,
  },

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_lifestyle',
    categoryUrl: '/blog/lifestyle',
    currentKey: 'blogClasesSalsaBarcelona_breadcrumbCurrent',
  },

  // === RELATED ARTICLES ===
  relatedArticles: [
    {
      slug: 'historia-salsa-barcelona',
      category: 'historia',
      titleKey: 'blogHistoriaSalsa_title',
      excerptKey: 'blogHistoriaSalsa_excerpt',
      image: '/images/blog/historia-salsa/hero.webp',
    },
    {
      slug: 'beneficios-bailar-salsa',
      category: 'fitness',
      titleKey: 'blogBeneficiosSalsa_title',
      excerptKey: 'blogBeneficiosSalsa_excerpt',
      image: '/images/blog/beneficios-salsa/hero.webp',
    },
  ],

  // === RELATED CLASSES (internal linking for SEO) ===
  relatedClasses: ['salsa-cubana-barcelona', 'bachata-barcelona'],

  // === UX TOGGLES ===
  tableOfContents: {
    enabled: true,
    sticky: true,
  },
  progressBar: {
    enabled: true,
  },
  shareButtons: {
    enabled: true,
    platforms: ['whatsapp', 'facebook', 'twitter', 'linkedin', 'email'],
  },

  // === SPEAKABLE (Voice Search GEO) ===
  speakableSelectors: ['#article-summary', '#intro', '#lenguaje-universal', '#hablemos-salsa'],
};
