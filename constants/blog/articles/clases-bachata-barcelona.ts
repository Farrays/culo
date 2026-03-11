/**
 * Clases de Bachata Barcelona - Guía Completa
 *
 * Enterprise-level blog article about Bachata classes in Barcelona.
 * Author: Yunaisy Farray (Fundadora FIDC)
 *
 * Real instructors:
 * - Mathias Font & Eugenia Trujillo (World Champions Salsa LA)
 * - Carlos Canto & Noémie Guerin (Emerging Talent Barcelona)
 * - Juan Alvarez (Sensual Bachata specialist)
 *
 * GEO Optimizations:
 * - Answer capsules for AI citation (72% citation rate)
 * - Statistics with academic citations (E-E-A-T)
 * - Definitions for LLM extraction
 * - FAQ schema for voice search
 * - Speakable selectors configured
 * - Comparison table (3 bachata styles)
 */

import type { BlogArticleConfig } from '../types';

export const CLASES_BACHATA_BARCELONA_CONFIG: BlogArticleConfig = {
  // === BASIC INFO ===
  articleKey: 'blogBachata',
  slug: 'clases-bachata-barcelona-guia-completa',
  category: 'tips',
  authorId: 'yunaisy-farray',
  datePublished: '2026-03-11',
  dateModified: '2026-03-11',
  readingTime: 14,
  wordCount: 3300,

  // === SUMMARY BULLETS ===
  summaryBullets: [
    'blogBachata_summaryBullet1',
    'blogBachata_summaryBullet2',
    'blogBachata_summaryBullet3',
    'blogBachata_summaryBullet4',
    'blogBachata_summaryBullet5',
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/clases-bachata/hero.webp',
    srcSet:
      '/images/blog/clases-bachata/hero-480.webp 480w, /images/blog/clases-bachata/hero-960.webp 960w, /images/blog/clases-bachata/hero.webp 1200w',
    alt: 'blogBachata_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/clases-bachata/og.jpg',

  // === GEO: SUMMARY STATS WITH CITATIONS ===
  summaryStats: [
    {
      value: '330-400',
      labelKey: 'blogBachata_stat1Label',
      citation: {
        source: 'Harvard Health Publishing',
        url: 'https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-for-people-of-three-different-weights',
        year: '2004',
        authors: 'Harvard Health Publishing',
      },
    },
    {
      value: '8 sem.',
      labelKey: 'blogBachata_stat2Label',
      citation: {
        source: 'Journal of Cardiopulmonary Rehabilitation and Prevention',
        url: 'https://www.sciencedirect.com/science/article/abs/pii/S053155651830439X',
        year: '2018',
        authors: 'Rodrigues-Krause et al.',
      },
    },
    {
      value: '225',
      labelKey: 'blogBachata_stat3Label',
      citation: {
        source: 'Journal of Aging and Physical Activity',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5267615/',
        year: '2016',
        authors: 'Kattenstroth et al.',
      },
    },
    {
      value: '↓ cortisol',
      labelKey: 'blogBachata_stat4Label',
      citation: {
        source: 'The Arts in Psychotherapy',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6243712/',
        year: '2017',
        authors: 'Ho et al.',
      },
    },
  ],

  // === SPEAKABLE SELECTORS (Voice Search) ===
  speakableSelectors: [
    '#article-summary',
    '[data-answer-capsule="true"]',
    '#intro',
    '#section-estilos',
    '#section-beneficios',
    '#conclusion',
  ],

  // === SECTIONS ===
  sections: [
    // =====================================================
    // INTRODUCTION
    // =====================================================
    {
      id: 'intro',
      type: 'paragraph',
      contentKey: 'blogBachata_intro',
    },

    // =====================================================
    // ANSWER CAPSULES (GEO)
    // =====================================================
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blogBachata_answerText1',
      answerCapsule: {
        questionKey: 'blogBachata_answerQuestion1',
        answerKey: 'blogBachata_answerText1',
        sourcePublisher: "Farray's International Dance Center",
        sourceYear: '2026',
        sourceUrl: 'https://www.farrayscenter.com/es/clases/bachata-barcelona',
        confidence: 'high',
        icon: 'star',
      },
    },
    {
      id: 'answer-capsule-2',
      type: 'answer-capsule',
      contentKey: 'blogBachata_answerText2',
      answerCapsule: {
        questionKey: 'blogBachata_answerQuestion2',
        answerKey: 'blogBachata_answerText2',
        sourcePublisher: 'Wikipedia / Estudios de música popular caribeña',
        sourceYear: '2024',
        sourceUrl: 'https://en.wikipedia.org/wiki/Bachata_(music)',
        confidence: 'verified',
        icon: 'info',
      },
    },
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blogBachata_answerText3',
      answerCapsule: {
        questionKey: 'blogBachata_answerQuestion3',
        answerKey: 'blogBachata_answerText3',
        sourcePublisher: "Farray's International Dance Center",
        sourceYear: '2026',
        sourceUrl: 'https://www.farrayscenter.com/es/clases/salsa-bachata-barcelona',
        confidence: 'high',
        icon: 'check',
      },
    },
    {
      id: 'answer-capsule-4',
      type: 'answer-capsule',
      contentKey: 'blogBachata_answerText4',
      answerCapsule: {
        questionKey: 'blogBachata_answerQuestion4',
        answerKey: 'blogBachata_answerText4',
        sourcePublisher: "Farray's International Dance Center",
        sourceYear: '2026',
        sourceUrl: 'https://www.farrayscenter.com/es/blog',
        confidence: 'high',
        icon: 'lightbulb',
      },
    },

    // =====================================================
    // SECTION 1: Qué es la Bachata
    // =====================================================
    {
      id: 'section-que-es',
      type: 'heading',
      level: 2,
      contentKey: 'blogBachata_section1Title',
    },
    {
      id: 'section-que-es-content1',
      type: 'paragraph',
      contentKey: 'blogBachata_section1Content1',
    },
    {
      id: 'section-que-es-content2',
      type: 'paragraph',
      contentKey: 'blogBachata_section1Content2',
    },

    // =====================================================
    // SECTION 2: Los 3 Estilos de Bachata
    // =====================================================
    {
      id: 'section-estilos',
      type: 'heading',
      level: 2,
      contentKey: 'blogBachata_section2Title',
    },
    {
      id: 'section-estilos-intro',
      type: 'paragraph',
      contentKey: 'blogBachata_section2Intro',
    },

    // Bachata Sensual
    {
      id: 'estilo-sensual-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogBachata_estiloSensualTitle',
    },
    {
      id: 'estilo-sensual-content',
      type: 'paragraph',
      contentKey: 'blogBachata_estiloSensualContent',
    },

    // Bachata Dominicana
    {
      id: 'estilo-dominicana-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogBachata_estiloDominicanaTitle',
    },
    {
      id: 'estilo-dominicana-content',
      type: 'paragraph',
      contentKey: 'blogBachata_estiloDominicanaContent',
    },

    // Bachata Lady Style
    {
      id: 'estilo-ladystyle-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogBachata_estiloLadyStyleTitle',
    },
    {
      id: 'estilo-ladystyle-content',
      type: 'paragraph',
      contentKey: 'blogBachata_estiloLadyStyleContent',
    },

    // Links a clases
    {
      id: 'estilos-enlaces',
      type: 'paragraph',
      contentKey: 'blogBachata_estilosEnlaces',
    },

    // =====================================================
    // COMPARISON TABLE: 3 Estilos de Bachata
    // =====================================================
    {
      id: 'tabla-estilos',
      type: 'comparison-table',
      contentKey: 'blogBachata_tablaTitle',
      tableConfig: {
        headers: [
          'blogBachata_tablaHeaderAspecto',
          'blogBachata_tablaHeaderSensual',
          'blogBachata_tablaHeaderDominicana',
          'blogBachata_tablaHeaderLadyStyle',
        ],
        rows: [
          [
            'blogBachata_tablaRowOrigen',
            'blogBachata_tablaSensualOrigen',
            'blogBachata_tablaDominicanaOrigen',
            'blogBachata_tablaLadyStyleOrigen',
          ],
          [
            'blogBachata_tablaRowMovimiento',
            'blogBachata_tablaSensualMovimiento',
            'blogBachata_tablaDominicanaMovimiento',
            'blogBachata_tablaLadyStyleMovimiento',
          ],
          [
            'blogBachata_tablaRowMusica',
            'blogBachata_tablaSensualMusica',
            'blogBachata_tablaDominicanaMusica',
            'blogBachata_tablaLadyStyleMusica',
          ],
          [
            'blogBachata_tablaRowConexion',
            'blogBachata_tablaSensualConexion',
            'blogBachata_tablaDominicanaConexion',
            'blogBachata_tablaLadyStyleConexion',
          ],
          [
            'blogBachata_tablaRowDificultad',
            'blogBachata_tablaSensualDificultad',
            'blogBachata_tablaDominicanaDificultad',
            'blogBachata_tablaLadyStyleDificultad',
          ],
          [
            'blogBachata_tablaRowIdeal',
            'blogBachata_tablaSensualIdeal',
            'blogBachata_tablaDominicanaIdeal',
            'blogBachata_tablaLadyStyleIdeal',
          ],
        ],
      },
    },

    // =====================================================
    // SECTION 3: Beneficios
    // =====================================================
    {
      id: 'section-beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogBachata_section3Title',
    },
    {
      id: 'section-beneficios-content1',
      type: 'paragraph',
      contentKey: 'blogBachata_section3Content1',
    },
    {
      id: 'section-beneficios-content2',
      type: 'paragraph',
      contentKey: 'blogBachata_section3Content2',
    },
    {
      id: 'section-beneficios-content3',
      type: 'paragraph',
      contentKey: 'blogBachata_section3Content3',
    },

    // =====================================================
    // SECTION 4: Niveles
    // =====================================================
    {
      id: 'section-niveles',
      type: 'heading',
      level: 2,
      contentKey: 'blogBachata_section4Title',
    },
    {
      id: 'section-niveles-intro',
      type: 'paragraph',
      contentKey: 'blogBachata_section4Intro',
    },
    {
      id: 'section-niveles-list',
      type: 'list',
      contentKey: 'blogBachata_section4ListTitle',
      listItems: [
        'blogBachata_section4ListItem1',
        'blogBachata_section4ListItem2',
        'blogBachata_section4ListItem3',
      ],
    },
    {
      id: 'section-niveles-consejo',
      type: 'paragraph',
      contentKey: 'blogBachata_section4Consejo',
    },

    // =====================================================
    // SECTION 5: Tu Primera Clase
    // =====================================================
    {
      id: 'section-primera-clase',
      type: 'heading',
      level: 2,
      contentKey: 'blogBachata_section5Title',
    },
    {
      id: 'section-primera-clase-intro',
      type: 'paragraph',
      contentKey: 'blogBachata_section5Intro',
    },
    {
      id: 'section-primera-clase-list',
      type: 'list',
      contentKey: 'blogBachata_section5ListTitle',
      listItems: [
        'blogBachata_section5ListItem1',
        'blogBachata_section5ListItem2',
        'blogBachata_section5ListItem3',
        'blogBachata_section5ListItem4',
      ],
    },
    {
      id: 'section-primera-clase-quote',
      type: 'paragraph',
      contentKey: 'blogBachata_section5Quote',
    },
    {
      id: 'section-primera-clase-enlaces',
      type: 'paragraph',
      contentKey: 'blogBachata_section5Enlaces',
    },

    // =====================================================
    // SECTION 6: Escena en Barcelona
    // =====================================================
    {
      id: 'section-escena',
      type: 'heading',
      level: 2,
      contentKey: 'blogBachata_section6Title',
    },
    {
      id: 'section-escena-content1',
      type: 'paragraph',
      contentKey: 'blogBachata_section6Content1',
    },
    {
      id: 'section-escena-content2',
      type: 'paragraph',
      contentKey: 'blogBachata_section6Content2',
    },

    // =====================================================
    // DEFINITIONS (GEO - LLM Extraction)
    // =====================================================
    {
      id: 'definition-bachata-sensual',
      type: 'definition',
      definitionTermKey: 'blogBachata_defTerm1',
      contentKey: 'blogBachata_defContent1',
    },
    {
      id: 'definition-bachata-dominicana',
      type: 'definition',
      definitionTermKey: 'blogBachata_defTerm2',
      contentKey: 'blogBachata_defContent2',
    },
    {
      id: 'definition-bachata-ladystyle',
      type: 'definition',
      definitionTermKey: 'blogBachata_defTerm3',
      contentKey: 'blogBachata_defContent3',
    },

    // =====================================================
    // CONCLUSION
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogBachata_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogBachata_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogBachata_conclusionCTA',
    },

    // =====================================================
    // REFERENCES SECTION
    // =====================================================
    {
      id: 'references-section',
      type: 'references',
      contentKey: 'blogBachata_referencesIntro',
      references: [
        {
          id: 'harvard',
          titleKey: 'blogBachata_refHarvardTitle',
          url: 'https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-for-people-of-three-different-weights',
          publisher: 'Harvard Health Publishing',
          year: '2004',
          descriptionKey: 'blogBachata_refHarvardDesc',
        },
        {
          id: 'rodrigues-krause',
          titleKey: 'blogBachata_refRodriguesTitle',
          url: 'https://www.sciencedirect.com/science/article/abs/pii/S053155651830439X',
          publisher: 'ScienceDirect',
          year: '2018',
          descriptionKey: 'blogBachata_refRodriguesDesc',
        },
        {
          id: 'kattenstroth',
          titleKey: 'blogBachata_refKattenstrothTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5267615/',
          publisher: 'Journal of Aging and Physical Activity',
          year: '2016',
          descriptionKey: 'blogBachata_refKattenstrothDesc',
        },
        {
          id: 'ho-cortisol',
          titleKey: 'blogBachata_refHoTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6243712/',
          publisher: 'The Arts in Psychotherapy',
          year: '2017',
          descriptionKey: 'blogBachata_refHoDesc',
        },
        {
          id: 'li-wellbeing',
          titleKey: 'blogBachata_refLiTitle',
          url: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2022.864327/full',
          publisher: 'Frontiers in Psychology',
          year: '2022',
          descriptionKey: 'blogBachata_refLiDesc',
        },
        {
          id: 'chyle-social',
          titleKey: 'blogBachata_refChyleTitle',
          url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2021.635938/full',
          publisher: 'Frontiers in Psychology',
          year: '2021',
          descriptionKey: 'blogBachata_refChyleDesc',
        },
        {
          id: 'billboard',
          titleKey: 'blogBachata_refBillboardTitle',
          url: 'https://www.billboard.com/music/chart-beat/chayanne-no-1-tropical-airplay-bailando-bachata-1235383357/',
          publisher: 'Billboard',
          year: '2023',
          descriptionKey: 'blogBachata_refBillboardDesc',
        },
        {
          id: 'wikipedia-bachata',
          titleKey: 'blogBachata_refWikipediaTitle',
          url: 'https://en.wikipedia.org/wiki/Bachata_(music)',
          publisher: 'Wikipedia',
          year: '2024',
          descriptionKey: 'blogBachata_refWikipediaDesc',
        },
      ],
    },
  ],

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_tips',
    categoryUrl: '/blog/tips',
    currentKey: 'blogBachata_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blogBachata_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogBachata_faq1Question',
        answerKey: 'blogBachata_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogBachata_faq2Question',
        answerKey: 'blogBachata_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogBachata_faq3Question',
        answerKey: 'blogBachata_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogBachata_faq4Question',
        answerKey: 'blogBachata_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogBachata_faq5Question',
        answerKey: 'blogBachata_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogBachata_faq6Question',
        answerKey: 'blogBachata_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogBachata_faq7Question',
        answerKey: 'blogBachata_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogBachata_faq8Question',
        answerKey: 'blogBachata_faq8Answer',
      },
      {
        id: '9',
        questionKey: 'blogBachata_faq9Question',
        answerKey: 'blogBachata_faq9Answer',
      },
      {
        id: '10',
        questionKey: 'blogBachata_faq10Question',
        answerKey: 'blogBachata_faq10Answer',
      },
    ],
  },

  // === SCHEMA: Course ===
  courseSchema: {
    enabled: true,
    courseNameKey: 'blogBachata_courseSchemaName',
    courseDescriptionKey: 'blogBachata_courseSchemaDesc',
    provider: "Farray's International Dance Center",
    courseMode: 'OnSite',
  },

  // === SCHEMA: Aggregate Rating ===
  aggregateRatingSchema: {
    enabled: true,
    ratingValue: 4.9,
    reviewCount: 509,
  },

  // === RELATED ARTICLES ===
  relatedArticles: [
    {
      slug: 'historia-bachata-barcelona',
      category: 'historia',
      titleKey: 'blogHistoriaBachata_title',
      excerptKey: 'blogHistoriaBachata_excerpt',
      image: '/images/blog/historia-bachata/hero.webp',
    },
    {
      slug: 'salsa-vs-bachata-que-estilo-elegir',
      category: 'tips',
      titleKey: 'blogSalsaVsBachata_title',
      excerptKey: 'blogSalsaVsBachata_excerpt',
      image: '/images/blog/salsa-vs-bachata/hero.webp',
    },
  ],

  // === RELATED CLASSES ===
  relatedClasses: ['bachata-barcelona', 'bachata-lady-style-barcelona', 'salsa-bachata-barcelona'],

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
};
