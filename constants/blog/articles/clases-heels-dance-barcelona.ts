/**
 * Clases de Heels Dance Barcelona - Guía Completa
 *
 * Enterprise-level blog article about Heels Dance classes in Barcelona.
 * Author: Yunaisy Farray (Creator of Femmology, ENA Cuba, CID-UNESCO)
 *
 * Real instructors:
 * - Yunaisy Farray (Femmology creator, ENA Cuba, CID-UNESCO Master)
 * - Yasmina Fernández (Sexy Style, Método Farray® since 2016)
 *
 * GEO Optimizations:
 * - Answer capsules for AI citation (72% citation rate)
 * - Statistics with academic citations (E-E-A-T)
 * - Definitions for LLM extraction (3 heels styles)
 * - FAQ schema for voice search
 * - Speakable selectors configured
 * - Comparison table (Femmology vs Sexy Style)
 */

import type { BlogArticleConfig } from '../types';

export const CLASES_HEELS_DANCE_BARCELONA_CONFIG: BlogArticleConfig = {
  // === BASIC INFO ===
  articleKey: 'blogHeels',
  slug: 'clases-heels-dance-barcelona-guia-completa',
  category: 'tips',
  authorId: 'yunaisy-farray',
  datePublished: '2026-03-11',
  dateModified: '2026-03-11',
  readingTime: 14,
  wordCount: 3200,

  // === SUMMARY BULLETS ===
  summaryBullets: [
    'blogHeels_summaryBullet1',
    'blogHeels_summaryBullet2',
    'blogHeels_summaryBullet3',
    'blogHeels_summaryBullet4',
    'blogHeels_summaryBullet5',
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/clases-heels/hero.webp',
    srcSet:
      '/images/blog/clases-heels/hero-480.webp 480w, /images/blog/clases-heels/hero-960.webp 960w, /images/blog/clases-heels/hero.webp 1200w',
    alt: 'blogHeels_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/clases-heels/og.jpg',

  // === GEO: SUMMARY STATS WITH CITATIONS ===
  summaryStats: [
    {
      value: '↑ actividad muscular',
      labelKey: 'blogHeels_stat1Label',
      citation: {
        source: 'EMG in People with Different Heel Height Condition',
        url: 'https://pdfs.semanticscholar.org/d699/1dfb81889e6deed4e4e727a3d4cdb584a8b0.pdf',
        year: '2015',
        authors: 'Li et al.',
      },
    },
    {
      value: '↓ equilibrio',
      labelKey: 'blogHeels_stat2Label',
      citation: {
        source: 'Effects of high-heeled shoes on lower extremity biomechanics and balance',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10120101/',
        year: '2023',
        authors: 'Zhang et al.',
      },
    },
    {
      value: '↑ fuerza reacción',
      labelKey: 'blogHeels_stat3Label',
      citation: {
        source: 'Biomechanical Effects of Flamenco Footwork',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8607768/',
        year: '2021',
        authors: 'Luque-Suárez et al.',
      },
    },
    {
      value: '↑ imagen corporal',
      labelKey: 'blogHeels_stat4Label',
      citation: {
        source: "Preliminary evaluation of a girls' empowerment program",
        url: 'https://digitalcommons.pepperdine.edu/cgi/viewcontent.cgi?article=1349&context=etd',
        year: '2010',
        authors: 'Block',
      },
    },
    {
      value: '↓ ansiedad física',
      labelKey: 'blogHeels_stat5Label',
      citation: {
        source: 'Effect of dance on social physique anxiety and physical self-esteem',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12174144/',
        year: '2025',
        authors: 'Liu et al.',
      },
    },
    {
      value: 'Cambios posturales',
      labelKey: 'blogHeels_stat6Label',
      citation: {
        source: 'Biomechanic of ballroom dance: corporate adaptations with different footwear',
        url: 'https://www.scielo.br/j/jpe/a/FY98JRbqVvYZ3hV7WJWnQvL/',
        year: '2020',
        authors: 'Martínez et al.',
      },
    },
  ],

  // === SPEAKABLE SELECTORS (Voice Search) ===
  speakableSelectors: [
    '#article-summary',
    '[data-answer-capsule="true"]',
    '#intro',
    '#section-femmology',
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
      contentKey: 'blogHeels_intro',
    },

    // =====================================================
    // ANSWER CAPSULES (GEO)
    // =====================================================
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blogHeels_answerText1',
      answerCapsule: {
        questionKey: 'blogHeels_answerQuestion1',
        answerKey: 'blogHeels_answerText1',
        sourcePublisher: "Farray's International Dance Center",
        sourceYear: '2026',
        sourceUrl: 'https://www.farrayscenter.com/es/clases/heels-barcelona',
        confidence: 'high',
        icon: 'star',
      },
    },
    {
      id: 'answer-capsule-2',
      type: 'answer-capsule',
      contentKey: 'blogHeels_answerText2',
      answerCapsule: {
        questionKey: 'blogHeels_answerQuestion2',
        answerKey: 'blogHeels_answerText2',
        sourcePublisher: "Farray's International Dance Center",
        sourceYear: '2026',
        sourceUrl: 'https://www.farrayscenter.com/es/clases/femmology',
        confidence: 'high',
        icon: 'info',
      },
    },
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blogHeels_answerText3',
      answerCapsule: {
        questionKey: 'blogHeels_answerQuestion3',
        answerKey: 'blogHeels_answerText3',
        sourcePublisher: "Farray's International Dance Center",
        sourceYear: '2026',
        sourceUrl: 'https://www.farrayscenter.com/es/horarios-clases-baile-barcelona',
        confidence: 'high',
        icon: 'check',
      },
    },
    {
      id: 'answer-capsule-4',
      type: 'answer-capsule',
      contentKey: 'blogHeels_answerText4',
      answerCapsule: {
        questionKey: 'blogHeels_answerQuestion4',
        answerKey: 'blogHeels_answerText4',
        sourcePublisher: 'Frontiers in Psychology / Pepperdine University',
        sourceYear: '2025',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12174144/',
        confidence: 'verified',
        icon: 'lightbulb',
      },
    },

    // =====================================================
    // SECTION 1: Qué es el heels dance
    // =====================================================
    {
      id: 'section-que-es',
      type: 'heading',
      level: 2,
      contentKey: 'blogHeels_section1Title',
    },
    {
      id: 'section-que-es-content1',
      type: 'paragraph',
      contentKey: 'blogHeels_section1Content1',
    },
    {
      id: 'section-que-es-content2',
      type: 'paragraph',
      contentKey: 'blogHeels_section1Content2',
    },
    {
      id: 'section-que-es-content3',
      type: 'paragraph',
      contentKey: 'blogHeels_section1Content3',
    },

    // =====================================================
    // SECTION 2: Femmology y Sexy Style
    // =====================================================
    {
      id: 'section-estilos',
      type: 'heading',
      level: 2,
      contentKey: 'blogHeels_section2Title',
    },
    {
      id: 'section-estilos-intro',
      type: 'paragraph',
      contentKey: 'blogHeels_section2Intro',
    },

    // Femmology
    {
      id: 'section-femmology',
      type: 'heading',
      level: 3,
      contentKey: 'blogHeels_femmologyTitle',
    },
    {
      id: 'section-femmology-content',
      type: 'paragraph',
      contentKey: 'blogHeels_femmologyContent',
    },
    {
      id: 'section-femmology-list',
      type: 'list',
      contentKey: 'blogHeels_femmologyListTitle',
      listItems: [
        'blogHeels_femmologyListItem1',
        'blogHeels_femmologyListItem2',
        'blogHeels_femmologyListItem3',
      ],
    },
    {
      id: 'section-femmology-niveles',
      type: 'paragraph',
      contentKey: 'blogHeels_femmologyNiveles',
    },

    // Sexy Style
    {
      id: 'section-sexystyle',
      type: 'heading',
      level: 3,
      contentKey: 'blogHeels_sexyStyleTitle',
    },
    {
      id: 'section-sexystyle-content',
      type: 'paragraph',
      contentKey: 'blogHeels_sexyStyleContent',
    },
    {
      id: 'section-sexystyle-list',
      type: 'list',
      contentKey: 'blogHeels_sexyStyleListTitle',
      listItems: [
        'blogHeels_sexyStyleListItem1',
        'blogHeels_sexyStyleListItem2',
        'blogHeels_sexyStyleListItem3',
      ],
    },
    {
      id: 'section-sexystyle-diferencia',
      type: 'paragraph',
      contentKey: 'blogHeels_sexyStyleDiferencia',
    },

    // =====================================================
    // COMPARISON TABLE: Femmology vs Sexy Style
    // =====================================================
    {
      id: 'tabla-estilos',
      type: 'comparison-table',
      contentKey: 'blogHeels_tablaTitle',
      tableConfig: {
        headers: [
          'blogHeels_tablaHeaderAspecto',
          'blogHeels_tablaHeaderFemmology',
          'blogHeels_tablaHeaderSexyStyle',
        ],
        rows: [
          [
            'blogHeels_tablaRowCreadora',
            'blogHeels_tablaFemmologyCreadora',
            'blogHeels_tablaSexyStyleCreadora',
          ],
          [
            'blogHeels_tablaRowOrigen',
            'blogHeels_tablaFemmologyOrigen',
            'blogHeels_tablaSexyStyleOrigen',
          ],
          [
            'blogHeels_tablaRowEnfoque',
            'blogHeels_tablaFemmologyEnfoque',
            'blogHeels_tablaSexyStyleEnfoque',
          ],
          [
            'blogHeels_tablaRowTerapeutico',
            'blogHeels_tablaFemmologyTerapeutico',
            'blogHeels_tablaSexyStyleTerapeutico',
          ],
          [
            'blogHeels_tablaRowTecnica',
            'blogHeels_tablaFemmologyTecnica',
            'blogHeels_tablaSexyStyleTecnica',
          ],
          [
            'blogHeels_tablaRowNiveles',
            'blogHeels_tablaFemmologyNiveles',
            'blogHeels_tablaSexyStyleNiveles',
          ],
          [
            'blogHeels_tablaRowIdeal',
            'blogHeels_tablaFemmologyIdeal',
            'blogHeels_tablaSexyStyleIdeal',
          ],
          [
            'blogHeels_tablaRowMusica',
            'blogHeels_tablaFemmologyMusica',
            'blogHeels_tablaSexyStyleMusica',
          ],
          [
            'blogHeels_tablaRowPerfil',
            'blogHeels_tablaFemmologyPerfil',
            'blogHeels_tablaSexyStylePerfil',
          ],
        ],
      },
    },

    // =====================================================
    // SECTION 3: Beneficios físicos y emocionales
    // =====================================================
    {
      id: 'section-beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogHeels_section3Title',
    },
    {
      id: 'section-beneficios-content1',
      type: 'paragraph',
      contentKey: 'blogHeels_section3Content1',
    },
    {
      id: 'section-beneficios-list',
      type: 'list',
      contentKey: 'blogHeels_section3ListTitle',
      listItems: [
        'blogHeels_section3ListItem1',
        'blogHeels_section3ListItem2',
        'blogHeels_section3ListItem3',
      ],
    },
    {
      id: 'section-beneficios-emocional',
      type: 'paragraph',
      contentKey: 'blogHeels_section3Emocional',
    },
    {
      id: 'section-beneficios-enlaces',
      type: 'paragraph',
      contentKey: 'blogHeels_section3Enlaces',
    },

    // =====================================================
    // SECTION 4: Heels dance para principiantes
    // =====================================================
    {
      id: 'section-principiantes',
      type: 'heading',
      level: 2,
      contentKey: 'blogHeels_section4Title',
    },
    {
      id: 'section-principiantes-intro',
      type: 'paragraph',
      contentKey: 'blogHeels_section4Intro',
    },
    {
      id: 'section-principiantes-list',
      type: 'list',
      contentKey: 'blogHeels_section4ListTitle',
      listItems: [
        'blogHeels_section4ListItem1',
        'blogHeels_section4ListItem2',
        'blogHeels_section4ListItem3',
        'blogHeels_section4ListItem4',
      ],
    },
    {
      id: 'section-principiantes-tacones',
      type: 'paragraph',
      contentKey: 'blogHeels_section4Tacones',
    },
    {
      id: 'section-principiantes-enlaces',
      type: 'paragraph',
      contentKey: 'blogHeels_section4Enlaces',
    },

    // =====================================================
    // SECTION 5: Femmology vs Sexy Style — cuál elegir
    // =====================================================
    {
      id: 'section-cual-elegir',
      type: 'heading',
      level: 2,
      contentKey: 'blogHeels_section5Title',
    },
    {
      id: 'section-cual-elegir-content',
      type: 'paragraph',
      contentKey: 'blogHeels_section5Content',
    },

    // =====================================================
    // SECTION 6: La escena del heels en Barcelona
    // =====================================================
    {
      id: 'section-escena',
      type: 'heading',
      level: 2,
      contentKey: 'blogHeels_section6Title',
    },
    {
      id: 'section-escena-content1',
      type: 'paragraph',
      contentKey: 'blogHeels_section6Content1',
    },
    {
      id: 'section-escena-content2',
      type: 'paragraph',
      contentKey: 'blogHeels_section6Content2',
    },

    // =====================================================
    // DEFINITIONS (GEO - LLM Extraction)
    // =====================================================
    {
      id: 'definition-heels-dance',
      type: 'definition',
      definitionTermKey: 'blogHeels_defTerm1',
      contentKey: 'blogHeels_defContent1',
    },
    {
      id: 'definition-femmology',
      type: 'definition',
      definitionTermKey: 'blogHeels_defTerm2',
      contentKey: 'blogHeels_defContent2',
    },
    {
      id: 'definition-sexy-style',
      type: 'definition',
      definitionTermKey: 'blogHeels_defTerm3',
      contentKey: 'blogHeels_defContent3',
    },

    // =====================================================
    // CONCLUSION
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogHeels_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogHeels_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogHeels_conclusionCTA',
    },

    // =====================================================
    // REFERENCES SECTION
    // =====================================================
    {
      id: 'references-section',
      type: 'references',
      contentKey: 'blogHeels_referencesIntro',
      references: [
        {
          id: 'zhang-heels',
          titleKey: 'blogHeels_refZhangTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10120101/',
          publisher: 'Journal of Foot and Ankle Research',
          year: '2023',
          descriptionKey: 'blogHeels_refZhangDesc',
        },
        {
          id: 'martinez-ballroom',
          titleKey: 'blogHeels_refMartinezTitle',
          url: 'https://www.scielo.br/j/jpe/a/FY98JRbqVvYZ3hV7WJWnQvL/',
          publisher: 'Journal of Physical Education',
          year: '2020',
          descriptionKey: 'blogHeels_refMartinezDesc',
        },
        {
          id: 'li-emg',
          titleKey: 'blogHeels_refLiTitle',
          url: 'https://pdfs.semanticscholar.org/d699/1dfb81889e6deed4e4e727a3d4cdb584a8b0.pdf',
          publisher: 'Conference Proceedings',
          year: '2015',
          descriptionKey: 'blogHeels_refLiDesc',
        },
        {
          id: 'luque-flamenco',
          titleKey: 'blogHeels_refLuqueTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8607768/',
          publisher: 'Sensors',
          year: '2021',
          descriptionKey: 'blogHeels_refLuqueDesc',
        },
        {
          id: 'block-empowerment',
          titleKey: 'blogHeels_refBlockTitle',
          url: 'https://digitalcommons.pepperdine.edu/cgi/viewcontent.cgi?article=1349&context=etd',
          publisher: 'Pepperdine University',
          year: '2010',
          descriptionKey: 'blogHeels_refBlockDesc',
        },
        {
          id: 'liu-selfesteem',
          titleKey: 'blogHeels_refLiuTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12174144/',
          publisher: 'Frontiers in Psychology',
          year: '2025',
          descriptionKey: 'blogHeels_refLiuDesc',
        },
        {
          id: 'adta-healing',
          titleKey: 'blogHeels_refADTATitle',
          url: 'https://adta.memberclicks.net/assets/docs/DMT-A-Healing-Modality-for-Women-Who-Have-Been-Subjected-to-Violence-English.pdf',
          publisher: 'American Dance Therapy Association',
          year: '2015',
          descriptionKey: 'blogHeels_refADTADesc',
        },
        {
          id: 'dancemagazine-heels',
          titleKey: 'blogHeels_refDanceMagTitle',
          url: 'https://www.dancemagazine.com/heels-dance-popularity/',
          publisher: 'Dance Magazine',
          year: '2023',
          descriptionKey: 'blogHeels_refDanceMagDesc',
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
    currentKey: 'blogHeels_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blogHeels_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogHeels_faq1Question',
        answerKey: 'blogHeels_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogHeels_faq2Question',
        answerKey: 'blogHeels_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogHeels_faq3Question',
        answerKey: 'blogHeels_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogHeels_faq4Question',
        answerKey: 'blogHeels_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogHeels_faq5Question',
        answerKey: 'blogHeels_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogHeels_faq6Question',
        answerKey: 'blogHeels_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogHeels_faq7Question',
        answerKey: 'blogHeels_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogHeels_faq8Question',
        answerKey: 'blogHeels_faq8Answer',
      },
      {
        id: '9',
        questionKey: 'blogHeels_faq9Question',
        answerKey: 'blogHeels_faq9Answer',
      },
      {
        id: '10',
        questionKey: 'blogHeels_faq10Question',
        answerKey: 'blogHeels_faq10Answer',
      },
    ],
  },

  // === SCHEMA: Course ===
  courseSchema: {
    enabled: true,
    courseNameKey: 'blogHeels_courseSchemaName',
    courseDescriptionKey: 'blogHeels_courseSchemaDesc',
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
      slug: 'clases-reggaeton-barcelona-guia-completa',
      category: 'tips',
      titleKey: 'blogReggaeton_title',
      excerptKey: 'blogReggaeton_excerpt',
      image: '/images/blog/clases-reggaeton/hero.webp',
    },
    {
      slug: 'danzas-urbanas-barcelona-guia-completa',
      category: 'tips',
      titleKey: 'blogDanzasUrbanas_title',
      excerptKey: 'blogDanzasUrbanas_excerpt',
      image: '/images/blog/danzas-urbanas/hero.webp',
    },
  ],

  // === RELATED CLASSES ===
  relatedClasses: ['femmology-barcelona', 'sexy-style-barcelona', 'heels-barcelona'],

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
