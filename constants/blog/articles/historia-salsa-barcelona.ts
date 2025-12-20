/**
 * Article Configuration: Historia de la Salsa - Del Caribe al Corazón de Barcelona
 *
 * Premium SEO-optimized article with GEO citability, internal links,
 * and comprehensive historical content about salsa dance.
 *
 * Category: Historia
 * Target Keywords: historia salsa, origen salsa, salsa barcelona, fania records,
 *                  clases salsa barcelona, aprender salsa
 */

import type { BlogArticleConfig } from '../types';

export const HISTORIA_SALSA_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blogHistoriaSalsa',
  slug: 'historia-salsa-barcelona',
  category: 'historia',

  // === DATES ===
  datePublished: '2025-01-20',
  dateModified: '2025-01-20',

  // === READING METRICS ===
  readingTime: 12,
  wordCount: 2800,

  // === SUMMARY (GEO Optimized) ===
  summaryBullets: [
    'blogHistoriaSalsa_summaryBullet1',
    'blogHistoriaSalsa_summaryBullet2',
    'blogHistoriaSalsa_summaryBullet3',
    'blogHistoriaSalsa_summaryBullet4',
  ],

  // === KEY STATISTICS (Holographic Cards) ===
  summaryStats: [
    {
      value: '1964',
      labelKey: 'blogHistoriaSalsa_statFaniaLabel',
      source: 'Fania Records',
    },
    {
      value: '76%',
      labelKey: 'blogHistoriaSalsa_statDementiaLabel',
      source: 'NEJM 2003',
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
      contentKey: 'blogHistoriaSalsa_intro',
    },
    {
      id: 'intro-farrays',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_introFarrays',
    },

    // =====================================================
    // SECTION 1: ORÍGENES (1850-1970)
    // =====================================================
    {
      id: 'origenes',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaSalsa_section1Title',
    },
    {
      id: 'origenes-cuba',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section1Content1',
    },
    {
      id: 'origenes-generos',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section1Content2',
    },
    {
      id: 'origenes-nyc',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section1Content3',
    },

    // === IMAGE: Fania All-Stars ===
    {
      id: 'image-fania',
      type: 'image',
      contentKey: 'blogHistoriaSalsa_imageFaniaCaption',
      image: {
        src: '/images/blog/historia-salsa/fania-nyc.webp',
        srcSet:
          '/images/blog/historia-salsa/fania-nyc-480.webp 480w, /images/blog/historia-salsa/fania-nyc-800.webp 800w',
        alt: 'Fania All-Stars en el Yankee Stadium 1973 - origen de la salsa moderna',
        caption: 'blogHistoriaSalsa_imageFaniaCaption',
        width: 800,
        height: 500,
      },
    },

    {
      id: 'origenes-fania',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section1Content4',
    },

    // =====================================================
    // SECTION 2: ETIMOLOGÍA DE "SALSA"
    // =====================================================
    {
      id: 'etimologia',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaSalsa_section2Title',
    },
    {
      id: 'etimologia-intro',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section2Intro',
    },

    // Teorías como lista
    {
      id: 'etimologia-teorias',
      type: 'list',
      contentKey: 'blogHistoriaSalsa_section2TeoriasTitle',
      listItems: [
        'blogHistoriaSalsa_teoria1',
        'blogHistoriaSalsa_teoria2',
        'blogHistoriaSalsa_teoria3',
        'blogHistoriaSalsa_teoria4',
      ],
    },

    {
      id: 'etimologia-debate',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section2Debate',
    },

    // =====================================================
    // SECTION 3: EVOLUCIÓN ESTILÍSTICA (TABLA COMPARATIVA)
    // =====================================================
    {
      id: 'evolucion',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaSalsa_section3Title',
    },
    {
      id: 'evolucion-intro',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section3Intro',
    },

    // Tabla comparativa de estilos
    {
      id: 'evolucion-tabla',
      type: 'comparison-table',
      contentKey: 'blogHistoriaSalsa_section3TableTitle',
      tableConfig: {
        headers: [
          'blogHistoriaSalsa_tableHeaderEstilo',
          'blogHistoriaSalsa_tableHeaderEpoca',
          'blogHistoriaSalsa_tableHeaderCaracteristicas',
          'blogHistoriaSalsa_tableHeaderRepresentantes',
          'blogHistoriaSalsa_tableHeaderBarcelona',
        ],
        rows: [
          [
            'blogHistoriaSalsa_tableRow1Col1',
            'blogHistoriaSalsa_tableRow1Col2',
            'blogHistoriaSalsa_tableRow1Col3',
            'blogHistoriaSalsa_tableRow1Col4',
            'blogHistoriaSalsa_tableRow1Col5',
          ],
          [
            'blogHistoriaSalsa_tableRow2Col1',
            'blogHistoriaSalsa_tableRow2Col2',
            'blogHistoriaSalsa_tableRow2Col3',
            'blogHistoriaSalsa_tableRow2Col4',
            'blogHistoriaSalsa_tableRow2Col5',
          ],
          [
            'blogHistoriaSalsa_tableRow3Col1',
            'blogHistoriaSalsa_tableRow3Col2',
            'blogHistoriaSalsa_tableRow3Col3',
            'blogHistoriaSalsa_tableRow3Col4',
            'blogHistoriaSalsa_tableRow3Col5',
          ],
          [
            'blogHistoriaSalsa_tableRow4Col1',
            'blogHistoriaSalsa_tableRow4Col2',
            'blogHistoriaSalsa_tableRow4Col3',
            'blogHistoriaSalsa_tableRow4Col4',
            'blogHistoriaSalsa_tableRow4Col5',
          ],
        ],
        highlightColumn: 4,
      },
    },

    // =====================================================
    // SECTION 4: DE NUEVA YORK Y EL CARIBE A BARCELONA
    // =====================================================
    {
      id: 'barcelona',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaSalsa_section4Title',
    },
    {
      id: 'barcelona-escena',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section4Content1',
    },
    {
      id: 'barcelona-farrays',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section4Content2',
    },

    // === IMAGE: Barcelona Salsa Scene ===
    {
      id: 'image-barcelona',
      type: 'image',
      contentKey: 'blogHistoriaSalsa_imageBarcelonaCaption',
      image: {
        src: '/images/blog/historia-salsa/farrays-class.webp',
        srcSet:
          '/images/blog/historia-salsa/farrays-class-480.webp 480w, /images/blog/historia-salsa/farrays-class-800.webp 800w',
        alt: "Clase de salsa cubana en Farray's International Dance Center Barcelona",
        caption: 'blogHistoriaSalsa_imageBarcelonaCaption',
        width: 800,
        height: 500,
      },
    },

    // =====================================================
    // SECTION 5: BENEFICIOS - Más que ejercicio
    // =====================================================
    {
      id: 'beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaSalsa_section5Title',
    },
    {
      id: 'beneficios-intro',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section5Intro',
    },
    {
      id: 'beneficios-detalle',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_beneficiosDetalle',
    },

    // =====================================================
    // SECTION 6: CONCLUSIÓN - TRADICIÓN VIVA
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaSalsa_section6Title',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_section6Content1',
    },

    // CTA Final natural
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogHistoriaSalsa_conclusionCTA',
    },

    // =====================================================
    // REFERENCES SECTION (GEO Citability)
    // =====================================================
    {
      id: 'referencias',
      type: 'heading',
      level: 2,
      contentKey: 'blogHistoriaSalsa_referencesTitle',
    },
    {
      id: 'referencias-list',
      type: 'references',
      contentKey: 'blogHistoriaSalsa_referencesIntro',
      references: [
        // === FUENTES CIENTÍFICAS PRIMARIAS ===
        {
          id: 'ref-nejm',
          titleKey: 'blogHistoriaSalsa_refNEJMTitle',
          descriptionKey: 'blogHistoriaSalsa_refNEJMDesc',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
          publisher: 'New England Journal of Medicine',
          year: '2003',
          image: '/images/blog/historia-salsa/ref-nejm.webp',
        },
        {
          id: 'ref-harvard',
          titleKey: 'blogHistoriaSalsa_refHarvardTitle',
          descriptionKey: 'blogHistoriaSalsa_refHarvardDesc',
          url: 'https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-for-people-of-three-different-weights',
          publisher: 'Harvard Medical School',
          year: '2023',
          image: '/images/blog/historia-salsa/ref-harvard.webp',
        },
        {
          id: 'ref-jama',
          titleKey: 'blogHistoriaSalsa_refJAMATitle',
          descriptionKey: 'blogHistoriaSalsa_refJAMADesc',
          url: 'https://jamanetwork.com/journals/jamacardiology',
          publisher: 'JAMA Cardiology',
          year: '2008',
          image: '/images/blog/historia-salsa/ref-jama.webp',
        },
        {
          id: 'ref-bjsm',
          titleKey: 'blogHistoriaSalsa_refBJSMTitle',
          descriptionKey: 'blogHistoriaSalsa_refBJSMDesc',
          url: 'https://bjsm.bmj.com/content/51/19/1415',
          publisher: 'British Journal of Sports Medicine',
          year: '2017',
          image: '/images/blog/historia-salsa/ref-bjsm.webp',
        },
        {
          id: 'ref-cortisol',
          titleKey: 'blogHistoriaSalsa_refCortisolTitle',
          descriptionKey: 'blogHistoriaSalsa_refCortisolDesc',
          url: 'https://www.sciencedirect.com/science/article/abs/pii/S0306453009001180',
          publisher: 'Psychoneuroendocrinology',
          year: '2009',
          image: '/images/blog/historia-salsa/ref-cortisol.webp',
        },
        {
          id: 'ref-frontiers',
          titleKey: 'blogHistoriaSalsa_refFrontiersTitle',
          descriptionKey: 'blogHistoriaSalsa_refFrontiersDesc',
          url: 'https://www.frontiersin.org/journals/psychology',
          publisher: 'Frontiers in Psychology',
          year: '2016',
          image: '/images/blog/historia-salsa/ref-frontiers.webp',
        },
        // === FUENTES SECUNDARIAS AUTORIZADAS ===
        {
          id: 'ref-ace',
          titleKey: 'blogHistoriaSalsa_refACETitle',
          descriptionKey: 'blogHistoriaSalsa_refACEDesc',
          url: 'https://www.acefitness.org/resources/everyone/tools-calculators/calorie-burn-calculator/',
          publisher: 'American Council on Exercise',
          year: '2024',
          image: '/images/blog/historia-salsa/ref-ace.webp',
        },
        {
          id: 'ref-cdc',
          titleKey: 'blogHistoriaSalsa_refCDCTitle',
          descriptionKey: 'blogHistoriaSalsa_refCDCDesc',
          url: 'https://www.cdc.gov/physicalactivity/basics/adults/index.htm',
          publisher: 'Centers for Disease Control (CDC)',
          year: '2023',
          image: '/images/blog/historia-salsa/ref-cdc.webp',
        },
        // === FUENTES LOCALES/INSTITUCIONALES ===
        {
          id: 'ref-farrays',
          titleKey: 'blogHistoriaSalsa_refFarraysTitle',
          descriptionKey: 'blogHistoriaSalsa_refFarraysDesc',
          url: 'https://farrayscenter.com/es/clases/salsa-cubana-barcelona',
          publisher: "Farray's International Dance Center",
          year: '2025',
          image: '/images/blog/historia-salsa/ref-farrays.webp',
        },
        {
          id: 'ref-bcnactiva',
          titleKey: 'blogHistoriaSalsa_refBcnActivaTitle',
          descriptionKey: 'blogHistoriaSalsa_refBcnActivaDesc',
          url: 'https://www.barcelonactiva.cat/',
          publisher: 'Barcelona Activa',
          year: '2024',
          image: '/images/blog/historia-salsa/ref-bcnactiva.webp',
        },
      ],
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/historia-salsa/hero.webp',
    srcSet:
      '/images/blog/historia-salsa/hero-480.webp 480w, /images/blog/historia-salsa/hero-960.webp 960w, /images/blog/historia-salsa/hero.webp 1200w',
    alt: "Historia de la salsa: del Caribe a Barcelona - Farray's Dance Center",
    width: 1200,
    height: 630,
  },

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_historia',
    categoryUrl: '/blog/historia',
    currentKey: 'blogHistoriaSalsa_breadcrumbCurrent',
  },

  // === FAQ SECTION (SEO Optimized) ===
  faqSection: {
    enabled: true,
    titleKey: 'blogHistoriaSalsa_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogHistoriaSalsa_faq1Question',
        answerKey: 'blogHistoriaSalsa_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogHistoriaSalsa_faq2Question',
        answerKey: 'blogHistoriaSalsa_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogHistoriaSalsa_faq3Question',
        answerKey: 'blogHistoriaSalsa_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogHistoriaSalsa_faq4Question',
        answerKey: 'blogHistoriaSalsa_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogHistoriaSalsa_faq5Question',
        answerKey: 'blogHistoriaSalsa_faq5Answer',
      },
    ],
  },

  // === RELATED ARTICLES ===
  relatedArticles: [
    {
      slug: 'beneficios-bailar-salsa',
      category: 'fitness',
      titleKey: 'blogBeneficiosSalsa_title',
      excerptKey: 'blogBeneficiosSalsa_excerpt',
      image: '/images/blog/beneficios-salsa/hero.webp',
    },
  ],

  // === RELATED CLASSES (internal linking for SEO) ===
  relatedClasses: [
    'salsa-cubana-barcelona',
    'salsa-en-linea-barcelona',
    'bachata-sensual-barcelona',
  ],

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
    '#beneficios',
    '#conclusion',
  ],
};
