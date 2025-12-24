/**
 * Article Configuration: Historia de la Bachata - Del Barrio Dominicano a Barcelona
 *
 * Premium SEO-optimized article with GEO citability, internal links,
 * and comprehensive historical content about bachata dance.
 *
 * Category: Historia
 * Target Keywords: historia bachata, origen bachata, bachata barcelona, bachata sensual,
 *                  clases bachata barcelona, aprender bachata, Romeo Santos
 */

import type { BlogArticleConfig } from '../types';

export const HISTORIA_BACHATA_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blogHistoriaBachata',
  slug: 'historia-bachata-barcelona',
  category: 'historia',

  // === DATES ===
  datePublished: '2025-01-20',
  dateModified: '2025-01-20',

  // === READING METRICS ===
  readingTime: 12,
  wordCount: 3000,

  // === SUMMARY (GEO Optimized) ===
  summaryBullets: [
    'blogHistoriaBachata_summaryBullet1',
    'blogHistoriaBachata_summaryBullet2',
    'blogHistoriaBachata_summaryBullet3',
    'blogHistoriaBachata_summaryBullet4',
  ],

  // === KEY STATISTICS (Holographic Cards) ===
  summaryStats: [
    {
      value: '1962',
      labelKey: 'blogHistoriaBachata_statCalderonLabel',
      source: 'José Manuel Calderón',
    },
    {
      value: '2019',
      labelKey: 'blogHistoriaBachata_statUNESCOLabel',
      source: 'UNESCO',
    },
  ],

  // === CONTENT SECTIONS ===
  sections: [
    // =====================================================
    // INTRODUCTION
    // =====================================================
    {
      id: 'intro',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_intro',
    },
    {
      id: 'intro-farrays',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_introFarrays',
    },

    // =====================================================
    // SECTION 1: ORÍGENES (1960s)
    // =====================================================
    {
      id: 'origenes',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaBachata_origenesTitle',
    },
    {
      id: 'origenes-content1',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_origenesContent1',
    },
    {
      id: 'origenes-content2',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_origenesContent2',
    },
    {
      id: 'origenes-barcelona',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_origenesBarcelona',
    },

    // =====================================================
    // SECTION 2: ETIMOLOGÍA DE "BACHATA"
    // =====================================================
    {
      id: 'etimologia',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaBachata_etimologiaTitle',
    },
    {
      id: 'etimologia-intro',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_etimologiaIntro',
    },

    // Teorías como lista
    {
      id: 'etimologia-teorias',
      type: 'list',
      contentKey: 'blogHistoriaBachata_etimologiaTeoriasTitle',
      listItems: [
        'blogHistoriaBachata_teoria1',
        'blogHistoriaBachata_teoria2',
        'blogHistoriaBachata_teoria3',
      ],
    },

    {
      id: 'etimologia-cierre',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_etimologiaCierre',
    },

    // =====================================================
    // SECTION 3: EVOLUCIÓN ESTILÍSTICA (TABLA COMPARATIVA)
    // =====================================================
    {
      id: 'evolucion',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaBachata_evolucionTitle',
    },
    {
      id: 'evolucion-intro',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_evolucionIntro',
    },

    // Tabla comparativa de evolución
    {
      id: 'evolucion-tabla',
      type: 'comparison-table',
      contentKey: 'blogHistoriaBachata_evolucionTableTitle',
      tableConfig: {
        headers: [
          'blogHistoriaBachata_tableHeaderEtapa',
          'blogHistoriaBachata_tableHeaderDecada',
          'blogHistoriaBachata_tableHeaderCaracteristicas',
          'blogHistoriaBachata_tableHeaderFiguras',
          'blogHistoriaBachata_tableHeaderBarcelona',
        ],
        rows: [
          [
            'blogHistoriaBachata_tableRow1Col1',
            'blogHistoriaBachata_tableRow1Col2',
            'blogHistoriaBachata_tableRow1Col3',
            'blogHistoriaBachata_tableRow1Col4',
            'blogHistoriaBachata_tableRow1Col5',
          ],
          [
            'blogHistoriaBachata_tableRow2Col1',
            'blogHistoriaBachata_tableRow2Col2',
            'blogHistoriaBachata_tableRow2Col3',
            'blogHistoriaBachata_tableRow2Col4',
            'blogHistoriaBachata_tableRow2Col5',
          ],
          [
            'blogHistoriaBachata_tableRow3Col1',
            'blogHistoriaBachata_tableRow3Col2',
            'blogHistoriaBachata_tableRow3Col3',
            'blogHistoriaBachata_tableRow3Col4',
            'blogHistoriaBachata_tableRow3Col5',
          ],
        ],
        highlightColumn: 4,
      },
    },

    // === IMAGE: Íconos de la Bachata ===
    {
      id: 'image-iconos',
      type: 'image',
      contentKey: 'blogHistoriaBachata_imageIconosCaption',
      image: {
        src: '/images/blog/historia-bachata/iconos-bachata.webp',
        srcSet:
          '/images/blog/historia-bachata/iconos-bachata-480.webp 480w, /images/blog/historia-bachata/iconos-bachata-800.webp 800w',
        alt: 'Íconos de la bachata: Calderón, Juan Luis Guerra, Romeo Santos',
        caption: 'blogHistoriaBachata_imageIconosCaption',
        width: 800,
        height: 500,
      },
    },

    // =====================================================
    // SECTION 4: ÍCONOS DE LA BACHATA
    // =====================================================
    {
      id: 'iconos',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaBachata_iconosTitle',
    },
    {
      id: 'iconos-intro',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_iconosIntro',
    },
    {
      id: 'iconos-lista',
      type: 'list',
      contentKey: 'blogHistoriaBachata_iconosListaTitle',
      listItems: [
        'blogHistoriaBachata_iconoCalderon',
        'blogHistoriaBachata_iconoSegura',
        'blogHistoriaBachata_iconoVictorVictor',
        'blogHistoriaBachata_iconoJuanLuis',
        'blogHistoriaBachata_iconoRomeo',
        'blogHistoriaBachata_iconoPrince',
      ],
    },
    {
      id: 'iconos-farrays',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_iconosFarrays',
    },

    // =====================================================
    // SECTION 5: BACHATA EN BARCELONA
    // =====================================================
    {
      id: 'barcelona',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaBachata_barcelonaTitle',
    },
    {
      id: 'barcelona-comunidad',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_barcelonaComunidad',
    },
    {
      id: 'barcelona-farrays',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_barcelonaFarrays',
    },

    // === IMAGE: Farray's Bachata Barcelona ===
    {
      id: 'image-barcelona',
      type: 'image',
      contentKey: 'blogHistoriaBachata_imageBarcelonaCaption',
      image: {
        src: '/images/blog/historia-bachata/farrays-bachata.webp',
        srcSet:
          '/images/blog/historia-bachata/farrays-bachata-480.webp 480w, /images/blog/historia-bachata/farrays-bachata-800.webp 800w',
        alt: "Clase de bachata sensual en Farray's International Dance Center Barcelona",
        caption: 'blogHistoriaBachata_imageBarcelonaCaption',
        width: 800,
        height: 500,
      },
    },

    // =====================================================
    // SECTION 6: BENEFICIOS CIENTÍFICOS
    // =====================================================
    {
      id: 'beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaBachata_beneficiosTitle',
    },
    {
      id: 'beneficios-intro',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_beneficiosIntro',
    },
    {
      id: 'beneficios-lista',
      type: 'list',
      contentKey: 'blogHistoriaBachata_beneficiosListaTitle',
      listItems: [
        'blogHistoriaBachata_beneficio1',
        'blogHistoriaBachata_beneficio2',
        'blogHistoriaBachata_beneficio3',
        'blogHistoriaBachata_beneficio4',
      ],
    },

    // =====================================================
    // SECTION 7: CONCLUSIÓN
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaBachata_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_conclusionContent',
    },

    // CTA Final natural
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogHistoriaBachata_conclusionCTA',
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/historia-bachata/hero.webp',
    srcSet:
      '/images/blog/historia-bachata/hero-480.webp 480w, /images/blog/historia-bachata/hero-960.webp 960w, /images/blog/historia-bachata/hero.webp 1200w',
    alt: "Historia de la bachata: del barrio dominicano a Barcelona - Farray's Dance Center",
    width: 1200,
    height: 630,
  },

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_historia',
    categoryUrl: '/blog/historia',
    currentKey: 'blogHistoriaBachata_breadcrumbCurrent',
  },

  // === FAQ SECTION (SEO Optimized) ===
  faqSection: {
    enabled: true,
    titleKey: 'blogHistoriaBachata_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogHistoriaBachata_faq1Question',
        answerKey: 'blogHistoriaBachata_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogHistoriaBachata_faq2Question',
        answerKey: 'blogHistoriaBachata_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogHistoriaBachata_faq3Question',
        answerKey: 'blogHistoriaBachata_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogHistoriaBachata_faq4Question',
        answerKey: 'blogHistoriaBachata_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogHistoriaBachata_faq5Question',
        answerKey: 'blogHistoriaBachata_faq5Answer',
      },
    ],
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
  relatedClasses: ['bachata-barcelona', 'salsa-cubana-barcelona', 'salsa-bachata-barcelona'],

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
  speakableSelectors: [
    '#article-summary',
    '#intro',
    '#origenes',
    '#etimologia',
    '#iconos',
    '#barcelona',
    '#beneficios',
    '#conclusion',
  ],
};
