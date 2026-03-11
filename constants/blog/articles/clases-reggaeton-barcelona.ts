/**
 * Clases de Reggaetón Barcelona - Guía Completa
 *
 * Enterprise-level blog article about Reggaeton classes in Barcelona.
 * Author: Charlie Breezy (Instructor Reggaeton Cubano & Hip Hop)
 *
 * Real instructors:
 * - Charlie Breezy (Reggaeton Cubano + Hip Hop Reggaeton, ENA Cuba)
 * - Yasmina Fernández (Sexy Reggaeton, Método Farray® since 2016)
 *
 * GEO Optimizations:
 * - Answer capsules for AI citation (72% citation rate)
 * - Statistics with academic citations (E-E-A-T)
 * - Definitions for LLM extraction (3 reggaeton styles)
 * - FAQ schema for voice search
 * - Speakable selectors configured
 * - Comparison table (3 reggaeton styles)
 */

import type { BlogArticleConfig } from '../types';

export const CLASES_REGGAETON_BARCELONA_CONFIG: BlogArticleConfig = {
  // === BASIC INFO ===
  articleKey: 'blogReggaeton',
  slug: 'clases-reggaeton-barcelona-guia-completa',
  category: 'tips',
  authorId: 'charlie-breezy',
  datePublished: '2026-03-11',
  dateModified: '2026-03-11',
  readingTime: 14,
  wordCount: 3200,

  // === SUMMARY BULLETS ===
  summaryBullets: [
    'blogReggaeton_summaryBullet1',
    'blogReggaeton_summaryBullet2',
    'blogReggaeton_summaryBullet3',
    'blogReggaeton_summaryBullet4',
    'blogReggaeton_summaryBullet5',
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/clases-reggaeton/hero.webp',
    srcSet:
      '/images/blog/clases-reggaeton/hero-480.webp 480w, /images/blog/clases-reggaeton/hero-960.webp 960w, /images/blog/clases-reggaeton/hero.webp 1200w',
    alt: 'blogReggaeton_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/clases-reggaeton/og.jpg',

  // === GEO: SUMMARY STATS WITH CITATIONS ===
  summaryStats: [
    {
      value: '400-650',
      labelKey: 'blogReggaeton_stat1Label',
      citation: {
        source: 'FitnessBlender / San Francisco Conservatory of Dance',
        url: 'https://www.fitnessblender.com/articles/dancing-calories-burned-by-type-how-many-calories-does-dancing-burn',
        year: '2020',
        authors: 'FitnessBlender',
      },
    },
    {
      value: '119%',
      labelKey: 'blogReggaeton_stat2Label',
      citation: {
        source: 'Latin Times / Spotify data',
        url: 'https://www.latintimes.com/latin-music-how-reggaeton-became-global-phenomenon-spotify-423256',
        year: '2017',
        authors: 'Latin Times Editors',
      },
    },
    {
      value: '10M+',
      labelKey: 'blogReggaeton_stat3Label',
      citation: {
        source: 'Spotify Newsroom',
        url: 'https://newsroom.spotify.com/2020-05-14/after-7-years-of-breaking-boundaries-spotifys-baila-reggaeton-playlist-hits-10-million-f/',
        year: '2020',
        authors: 'Spotify',
      },
    },
    {
      value: '↑ autoestima',
      labelKey: 'blogReggaeton_stat4Label',
      citation: {
        source: 'Frontiers in Psychology',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12174144/',
        year: '2025',
        authors: 'Liu et al.',
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
      contentKey: 'blogReggaeton_intro',
    },

    // =====================================================
    // ANSWER CAPSULES (GEO)
    // =====================================================
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blogReggaeton_answerText1',
      answerCapsule: {
        questionKey: 'blogReggaeton_answerQuestion1',
        answerKey: 'blogReggaeton_answerText1',
        sourcePublisher: "Farray's International Dance Center",
        sourceYear: '2026',
        sourceUrl: 'https://www.farrayscenter.com/es/clases',
        confidence: 'high',
        icon: 'star',
      },
    },
    {
      id: 'answer-capsule-2',
      type: 'answer-capsule',
      contentKey: 'blogReggaeton_answerText2',
      answerCapsule: {
        questionKey: 'blogReggaeton_answerQuestion2',
        answerKey: 'blogReggaeton_answerText2',
        sourcePublisher: 'Wikipedia / Estudios sobre reggaeton como género urbano',
        sourceYear: '2024',
        sourceUrl: 'https://en.wikipedia.org/wiki/Reggaeton',
        confidence: 'verified',
        icon: 'info',
      },
    },
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blogReggaeton_answerText3',
      answerCapsule: {
        questionKey: 'blogReggaeton_answerQuestion3',
        answerKey: 'blogReggaeton_answerText3',
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
      contentKey: 'blogReggaeton_answerText4',
      answerCapsule: {
        questionKey: 'blogReggaeton_answerQuestion4',
        answerKey: 'blogReggaeton_answerText4',
        sourcePublisher: 'FitnessBlender / Frontiers in Psychology',
        sourceYear: '2020',
        sourceUrl:
          'https://www.fitnessblender.com/articles/dancing-calories-burned-by-type-how-many-calories-does-dancing-burn',
        confidence: 'verified',
        icon: 'lightbulb',
      },
    },

    // =====================================================
    // SECTION 1: Qué es el Reggaetón como estilo de baile
    // =====================================================
    {
      id: 'section-que-es',
      type: 'heading',
      level: 2,
      contentKey: 'blogReggaeton_section1Title',
    },
    {
      id: 'section-que-es-content1',
      type: 'paragraph',
      contentKey: 'blogReggaeton_section1Content1',
    },
    {
      id: 'section-que-es-content2',
      type: 'paragraph',
      contentKey: 'blogReggaeton_section1Content2',
    },

    // =====================================================
    // SECTION 2: Los 3 estilos de Reggaetón
    // =====================================================
    {
      id: 'section-estilos',
      type: 'heading',
      level: 2,
      contentKey: 'blogReggaeton_section2Title',
    },
    {
      id: 'section-estilos-intro',
      type: 'paragraph',
      contentKey: 'blogReggaeton_section2Intro',
    },

    // Reggaeton Cubano
    {
      id: 'estilo-cubano-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogReggaeton_estiloCubanoTitle',
    },
    {
      id: 'estilo-cubano-content',
      type: 'paragraph',
      contentKey: 'blogReggaeton_estiloCubanoContent',
    },

    // Sexy Reggaeton
    {
      id: 'estilo-sexy-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogReggaeton_estiloSexyTitle',
    },
    {
      id: 'estilo-sexy-content',
      type: 'paragraph',
      contentKey: 'blogReggaeton_estiloSexyContent',
    },

    // Hip Hop Reggaeton
    {
      id: 'estilo-hiphop-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogReggaeton_estiloHipHopTitle',
    },
    {
      id: 'estilo-hiphop-content',
      type: 'paragraph',
      contentKey: 'blogReggaeton_estiloHipHopContent',
    },

    // Links a clases
    {
      id: 'estilos-enlaces',
      type: 'paragraph',
      contentKey: 'blogReggaeton_estilosEnlaces',
    },

    // =====================================================
    // COMPARISON TABLE: 3 Estilos de Reggaetón
    // =====================================================
    {
      id: 'tabla-estilos',
      type: 'comparison-table',
      contentKey: 'blogReggaeton_tablaTitle',
      tableConfig: {
        headers: [
          'blogReggaeton_tablaHeaderAspecto',
          'blogReggaeton_tablaHeaderCubano',
          'blogReggaeton_tablaHeaderSexy',
          'blogReggaeton_tablaHeaderHipHop',
        ],
        rows: [
          [
            'blogReggaeton_tablaRowOrigen',
            'blogReggaeton_tablaCubanoOrigen',
            'blogReggaeton_tablaSexyOrigen',
            'blogReggaeton_tablaHipHopOrigen',
          ],
          [
            'blogReggaeton_tablaRowMusica',
            'blogReggaeton_tablaCubanoMusica',
            'blogReggaeton_tablaSexyMusica',
            'blogReggaeton_tablaHipHopMusica',
          ],
          [
            'blogReggaeton_tablaRowMovimiento',
            'blogReggaeton_tablaCubanoMovimiento',
            'blogReggaeton_tablaSexyMovimiento',
            'blogReggaeton_tablaHipHopMovimiento',
          ],
          [
            'blogReggaeton_tablaRowDificultad',
            'blogReggaeton_tablaCubanoDificultad',
            'blogReggaeton_tablaSexyDificultad',
            'blogReggaeton_tablaHipHopDificultad',
          ],
          [
            'blogReggaeton_tablaRowBeneficio',
            'blogReggaeton_tablaCubanoBeneficio',
            'blogReggaeton_tablaSexyBeneficio',
            'blogReggaeton_tablaHipHopBeneficio',
          ],
          [
            'blogReggaeton_tablaRowProfesor',
            'blogReggaeton_tablaCubanoProfesor',
            'blogReggaeton_tablaSexyProfesor',
            'blogReggaeton_tablaHipHopProfesor',
          ],
          [
            'blogReggaeton_tablaRowIdeal',
            'blogReggaeton_tablaCubanoIdeal',
            'blogReggaeton_tablaSexyIdeal',
            'blogReggaeton_tablaHipHopIdeal',
          ],
        ],
      },
    },

    // =====================================================
    // SECTION 3: Beneficios físicos
    // =====================================================
    {
      id: 'section-beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogReggaeton_section3Title',
    },
    {
      id: 'section-beneficios-content1',
      type: 'paragraph',
      contentKey: 'blogReggaeton_section3Content1',
    },
    {
      id: 'section-beneficios-list',
      type: 'list',
      contentKey: 'blogReggaeton_section3ListTitle',
      listItems: [
        'blogReggaeton_section3ListItem1',
        'blogReggaeton_section3ListItem2',
        'blogReggaeton_section3ListItem3',
      ],
    },
    {
      id: 'section-beneficios-content2',
      type: 'paragraph',
      contentKey: 'blogReggaeton_section3Content2',
    },

    // =====================================================
    // SECTION 4: Reggaetón para principiantes
    // =====================================================
    {
      id: 'section-principiantes',
      type: 'heading',
      level: 2,
      contentKey: 'blogReggaeton_section4Title',
    },
    {
      id: 'section-principiantes-intro',
      type: 'paragraph',
      contentKey: 'blogReggaeton_section4Intro',
    },
    {
      id: 'section-principiantes-list',
      type: 'list',
      contentKey: 'blogReggaeton_section4ListTitle',
      listItems: [
        'blogReggaeton_section4ListItem1',
        'blogReggaeton_section4ListItem2',
        'blogReggaeton_section4ListItem3',
        'blogReggaeton_section4ListItem4',
      ],
    },
    {
      id: 'section-principiantes-enlaces',
      type: 'paragraph',
      contentKey: 'blogReggaeton_section4Enlaces',
    },

    // =====================================================
    // SECTION 5: La escena del reggaetón en Barcelona
    // =====================================================
    {
      id: 'section-escena',
      type: 'heading',
      level: 2,
      contentKey: 'blogReggaeton_section5Title',
    },
    {
      id: 'section-escena-content1',
      type: 'paragraph',
      contentKey: 'blogReggaeton_section5Content1',
    },
    {
      id: 'section-escena-content2',
      type: 'paragraph',
      contentKey: 'blogReggaeton_section5Content2',
    },

    // =====================================================
    // DEFINITIONS (GEO - LLM Extraction)
    // =====================================================
    {
      id: 'definition-reggaeton-cubano',
      type: 'definition',
      definitionTermKey: 'blogReggaeton_defTerm1',
      contentKey: 'blogReggaeton_defContent1',
    },
    {
      id: 'definition-sexy-reggaeton',
      type: 'definition',
      definitionTermKey: 'blogReggaeton_defTerm2',
      contentKey: 'blogReggaeton_defContent2',
    },
    {
      id: 'definition-hiphop-reggaeton',
      type: 'definition',
      definitionTermKey: 'blogReggaeton_defTerm3',
      contentKey: 'blogReggaeton_defContent3',
    },

    // =====================================================
    // CONCLUSION
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogReggaeton_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogReggaeton_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogReggaeton_conclusionCTA',
    },

    // =====================================================
    // REFERENCES SECTION
    // =====================================================
    {
      id: 'references-section',
      type: 'references',
      contentKey: 'blogReggaeton_referencesIntro',
      references: [
        {
          id: 'fitnessblender',
          titleKey: 'blogReggaeton_refFitnessBlenderTitle',
          url: 'https://www.fitnessblender.com/articles/dancing-calories-burned-by-type-how-many-calories-does-dancing-burn',
          publisher: 'FitnessBlender',
          year: '2020',
          descriptionKey: 'blogReggaeton_refFitnessBlenderDesc',
        },
        {
          id: 'sfconservatory',
          titleKey: 'blogReggaeton_refSFConservatoryTitle',
          url: 'https://sfconservatoryofdance.org/how-to-dance/how-many-calories-does-dancing-burn/',
          publisher: 'San Francisco Conservatory of Dance',
          year: '2024',
          descriptionKey: 'blogReggaeton_refSFConservatoryDesc',
        },
        {
          id: 'latintimes',
          titleKey: 'blogReggaeton_refLatinTimesTitle',
          url: 'https://www.latintimes.com/latin-music-how-reggaeton-became-global-phenomenon-spotify-423256',
          publisher: 'Latin Times',
          year: '2017',
          descriptionKey: 'blogReggaeton_refLatinTimesDesc',
        },
        {
          id: 'spotify',
          titleKey: 'blogReggaeton_refSpotifyTitle',
          url: 'https://newsroom.spotify.com/2020-05-14/after-7-years-of-breaking-boundaries-spotifys-baila-reggaeton-playlist-hits-10-million-f/',
          publisher: 'Spotify Newsroom',
          year: '2020',
          descriptionKey: 'blogReggaeton_refSpotifyDesc',
        },
        {
          id: 'liu-autoestima',
          titleKey: 'blogReggaeton_refLiuTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12174144/',
          publisher: 'Frontiers in Psychology',
          year: '2025',
          descriptionKey: 'blogReggaeton_refLiuDesc',
        },
        {
          id: 'pepperdine',
          titleKey: 'blogReggaeton_refPepperdineTitle',
          url: 'https://digitalcommons.pepperdine.edu/cgi/viewcontent.cgi?article=1349&context=etd',
          publisher: 'Pepperdine University',
          year: '2010',
          descriptionKey: 'blogReggaeton_refPepperdineDesc',
        },
        {
          id: 'flanders',
          titleKey: 'blogReggaeton_refFlandersTitle',
          url: 'https://www.kunsten.be/en/now-in-the-arts/hop-until-you-drop-de-moeilijke-alliantie-tussen-urban-en-hedendaagse-dans/',
          publisher: 'Flanders Arts Institute',
          year: '2020',
          descriptionKey: 'blogReggaeton_refFlandersDesc',
        },
        {
          id: 'wikipedia-reggaeton',
          titleKey: 'blogReggaeton_refWikipediaTitle',
          url: 'https://en.wikipedia.org/wiki/Reggaeton',
          publisher: 'Wikipedia',
          year: '2024',
          descriptionKey: 'blogReggaeton_refWikipediaDesc',
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
    currentKey: 'blogReggaeton_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blogReggaeton_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogReggaeton_faq1Question',
        answerKey: 'blogReggaeton_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogReggaeton_faq2Question',
        answerKey: 'blogReggaeton_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogReggaeton_faq3Question',
        answerKey: 'blogReggaeton_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogReggaeton_faq4Question',
        answerKey: 'blogReggaeton_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogReggaeton_faq5Question',
        answerKey: 'blogReggaeton_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogReggaeton_faq6Question',
        answerKey: 'blogReggaeton_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogReggaeton_faq7Question',
        answerKey: 'blogReggaeton_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogReggaeton_faq8Question',
        answerKey: 'blogReggaeton_faq8Answer',
      },
      {
        id: '9',
        questionKey: 'blogReggaeton_faq9Question',
        answerKey: 'blogReggaeton_faq9Answer',
      },
      {
        id: '10',
        questionKey: 'blogReggaeton_faq10Question',
        answerKey: 'blogReggaeton_faq10Answer',
      },
    ],
  },

  // === SCHEMA: Course ===
  courseSchema: {
    enabled: true,
    courseNameKey: 'blogReggaeton_courseSchemaName',
    courseDescriptionKey: 'blogReggaeton_courseSchemaDesc',
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
      slug: 'danzas-urbanas-barcelona-guia-completa',
      category: 'tips',
      titleKey: 'blogDanzasUrbanas_title',
      excerptKey: 'blogDanzasUrbanas_excerpt',
      image: '/images/blog/danzas-urbanas/hero.webp',
    },
    {
      slug: 'clases-bachata-barcelona-guia-completa',
      category: 'tips',
      titleKey: 'blogBachata_title',
      excerptKey: 'blogBachata_excerpt',
      image: '/images/blog/clases-bachata/hero.webp',
    },
  ],

  // === RELATED CLASSES ===
  relatedClasses: [
    'reggaeton-cubano-barcelona',
    'sexy-reggaeton-barcelona',
    'hip-hop-reggaeton-barcelona',
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
};
