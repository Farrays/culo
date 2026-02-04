/**
 * Article Configuration: Danzas Urbanas Barcelona - Guía Completa
 *
 * Artículo sobre danzas urbanas en Barcelona, escrito desde la perspectiva
 * de Marcos Martínez, profesor con más de 20 años de experiencia en
 * hip-hop old school, new style, popping y locking.
 *
 * Category: Tips
 * Type: Guía informativa pillar con enfoque E-E-A-T
 *
 * Referencias principales:
 * - American Journal of Preventive Medicine
 * - Ministerio de Cultura y Deporte de España
 * - Encyclopaedia Britannica
 * - Olympics.com
 */

import type { BlogArticleConfig } from '../types';

export const DANZAS_URBANAS_BARCELONA_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blogDanzasUrbanas',
  slug: 'danzas-urbanas-barcelona-guia-completa',
  category: 'tips',

  // === AUTHOR (E-E-A-T) ===
  authorId: 'marcos-martinez',

  // === PILLAR/CLUSTER STRATEGY (2026 SEO) ===
  contentType: 'pillar',
  clusterSlugs: ['clases-baile-principiantes-barcelona-farrays', 'como-perder-miedo-bailar'],

  // === DATES ===
  datePublished: '2026-02-04',
  dateModified: '2026-02-04',

  // === READING METRICS ===
  readingTime: 15,
  wordCount: 3100,

  // === SUMMARY BOX (GEO Critical) ===
  summaryBullets: [
    'blogDanzasUrbanas_summaryBullet1',
    'blogDanzasUrbanas_summaryBullet2',
    'blogDanzasUrbanas_summaryBullet3',
    'blogDanzasUrbanas_summaryBullet4',
  ],

  // === KEY STATISTICS (Holographic Cards) ===
  summaryStats: [
    {
      value: '46%',
      labelKey: 'blogDanzasUrbanas_stat1Label',
      citation: {
        source: 'American Journal of Preventive Medicine',
        url: 'https://pubmed.ncbi.nlm.nih.gov/26944521/',
        year: '2016',
        authors: 'Merom et al.',
        doi: '10.1016/j.amepre.2015.12.021',
      },
    },
    {
      value: '6,2%',
      labelKey: 'blogDanzasUrbanas_stat2Label',
      citation: {
        source: 'Ministerio de Cultura y Deporte de España',
        url: 'https://www.cultura.gob.es/dam/jcr:49661d3c-69bb-4c97-87d2-a30f699ff53d/encuesta-de-habitos-y-practicas-culturales-2018-2019-principales-resultados.pdf',
        year: '2019',
        authors: 'Encuesta de Hábitos y Prácticas Culturales',
      },
    },
    {
      value: '15,98%',
      labelKey: 'blogDanzasUrbanas_stat3Label',
      citation: {
        source: 'Proficient Market Insights',
        url: 'https://www.proficientmarketinsights.com/market-reports/dance-market-2833',
        year: '2025',
      },
    },
    {
      value: '7.500M',
      labelKey: 'blogDanzasUrbanas_stat4Label',
      citation: {
        source: 'Jade Times',
        url: 'https://www.jadetimes.com/post/the-influence-of-tiktok-on-modern-dance-trends',
        year: '2025',
      },
    },
  ],

  // === CONTENT SECTIONS ===
  sections: [
    // --- INTRO ---
    {
      id: 'intro',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_intro',
    },
    {
      id: 'intro-2',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_intro2',
    },
    {
      id: 'intro-3',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_intro3',
    },

    // --- ANSWER CAPSULE 1: ¿Qué son las danzas urbanas? ---
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blogDanzasUrbanas_answerCapsule1',
      answerCapsule: {
        questionKey: 'blogDanzasUrbanas_answerQuestion1',
        answerKey: 'blogDanzasUrbanas_answerText1',
        confidence: 'high',
        icon: 'check',
      },
    },

    // --- SECTION 1: Historia del Hip-Hop ---
    {
      id: 'historia-hiphop',
      type: 'heading',
      level: 2,
      contentKey: 'blogDanzasUrbanas_section1Title',
    },
    {
      id: 'historia-content-1',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section1Content1',
    },
    {
      id: 'historia-content-2',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section1Content2',
    },
    {
      id: 'historia-content-3',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section1Content3',
    },
    {
      id: 'historia-espana',
      type: 'heading',
      level: 3,
      contentKey: 'blogDanzasUrbanas_section1SubTitle',
    },
    {
      id: 'historia-espana-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section1Content4',
    },

    // --- ANSWER CAPSULE 2: ¿A qué edad se puede empezar? ---
    {
      id: 'answer-capsule-2',
      type: 'answer-capsule',
      contentKey: 'blogDanzasUrbanas_answerCapsule2',
      answerCapsule: {
        questionKey: 'blogDanzasUrbanas_answerQuestion2',
        answerKey: 'blogDanzasUrbanas_answerText2',
        confidence: 'high',
        icon: 'check',
      },
    },

    // --- SECTION 2: Los 8 Estilos de Danza Urbana ---
    {
      id: 'estilos-danza-urbana',
      type: 'heading',
      level: 2,
      contentKey: 'blogDanzasUrbanas_section2Title',
    },
    {
      id: 'estilos-intro',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section2Intro',
    },

    // Breaking
    {
      id: 'estilo-breaking',
      type: 'heading',
      level: 3,
      contentKey: 'blogDanzasUrbanas_estiloBreakingTitle',
    },
    {
      id: 'breaking-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_estiloBreakingContent',
    },

    // Popping
    {
      id: 'estilo-popping',
      type: 'heading',
      level: 3,
      contentKey: 'blogDanzasUrbanas_estiloPoppingTitle',
    },
    {
      id: 'popping-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_estiloPoppingContent',
    },

    // Locking
    {
      id: 'estilo-locking',
      type: 'heading',
      level: 3,
      contentKey: 'blogDanzasUrbanas_estiloLockingTitle',
    },
    {
      id: 'locking-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_estiloLockingContent',
    },

    // Hip-Hop Freestyle
    {
      id: 'estilo-hiphop',
      type: 'heading',
      level: 3,
      contentKey: 'blogDanzasUrbanas_estiloHipHopTitle',
    },
    {
      id: 'hiphop-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_estiloHipHopContent',
    },

    // House
    {
      id: 'estilo-house',
      type: 'heading',
      level: 3,
      contentKey: 'blogDanzasUrbanas_estiloHouseTitle',
    },
    {
      id: 'house-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_estiloHouseContent',
    },

    // Krumping
    {
      id: 'estilo-krumping',
      type: 'heading',
      level: 3,
      contentKey: 'blogDanzasUrbanas_estiloKrumpingTitle',
    },
    {
      id: 'krumping-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_estiloKrumpingContent',
    },

    // Dancehall
    {
      id: 'estilo-dancehall',
      type: 'heading',
      level: 3,
      contentKey: 'blogDanzasUrbanas_estiloDancehallTitle',
    },
    {
      id: 'dancehall-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_estiloDancehallContent',
    },

    // Afrobeats
    {
      id: 'estilo-afrobeats',
      type: 'heading',
      level: 3,
      contentKey: 'blogDanzasUrbanas_estiloAfrobeatsTitle',
    },
    {
      id: 'afrobeats-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_estiloAfrobeatsContent',
    },

    // --- TABLA COMPARATIVA ---
    {
      id: 'tabla-estilos',
      type: 'comparison-table',
      contentKey: 'blogDanzasUrbanas_tablaTitle',
      tableConfig: {
        headers: [
          'blogDanzasUrbanas_tablaHeaderEstilo',
          'blogDanzasUrbanas_tablaHeaderOrigen',
          'blogDanzasUrbanas_tablaHeaderMusica',
          'blogDanzasUrbanas_tablaHeaderDificultad',
          'blogDanzasUrbanas_tablaHeaderIdeal',
        ],
        rows: [
          [
            'blogDanzasUrbanas_tablaBreaking',
            'blogDanzasUrbanas_tablaBreakingOrigen',
            'blogDanzasUrbanas_tablaBreakingMusica',
            'blogDanzasUrbanas_tablaBreakingDificultad',
            'blogDanzasUrbanas_tablaBreakingIdeal',
          ],
          [
            'blogDanzasUrbanas_tablaPopping',
            'blogDanzasUrbanas_tablaPoppingOrigen',
            'blogDanzasUrbanas_tablaPoppingMusica',
            'blogDanzasUrbanas_tablaPoppingDificultad',
            'blogDanzasUrbanas_tablaPoppingIdeal',
          ],
          [
            'blogDanzasUrbanas_tablaLocking',
            'blogDanzasUrbanas_tablaLockingOrigen',
            'blogDanzasUrbanas_tablaLockingMusica',
            'blogDanzasUrbanas_tablaLockingDificultad',
            'blogDanzasUrbanas_tablaLockingIdeal',
          ],
          [
            'blogDanzasUrbanas_tablaHouse',
            'blogDanzasUrbanas_tablaHouseOrigen',
            'blogDanzasUrbanas_tablaHouseMusica',
            'blogDanzasUrbanas_tablaHouseDificultad',
            'blogDanzasUrbanas_tablaHouseIdeal',
          ],
          [
            'blogDanzasUrbanas_tablaHipHop',
            'blogDanzasUrbanas_tablaHipHopOrigen',
            'blogDanzasUrbanas_tablaHipHopMusica',
            'blogDanzasUrbanas_tablaHipHopDificultad',
            'blogDanzasUrbanas_tablaHipHopIdeal',
          ],
          [
            'blogDanzasUrbanas_tablaKrumping',
            'blogDanzasUrbanas_tablaKrumpingOrigen',
            'blogDanzasUrbanas_tablaKrumpingMusica',
            'blogDanzasUrbanas_tablaKrumpingDificultad',
            'blogDanzasUrbanas_tablaKrumpingIdeal',
          ],
          [
            'blogDanzasUrbanas_tablaDancehall',
            'blogDanzasUrbanas_tablaDancehallOrigen',
            'blogDanzasUrbanas_tablaDancehallMusica',
            'blogDanzasUrbanas_tablaDancehallDificultad',
            'blogDanzasUrbanas_tablaDancehallIdeal',
          ],
          [
            'blogDanzasUrbanas_tablaAfrobeats',
            'blogDanzasUrbanas_tablaAfrobeatsOrigen',
            'blogDanzasUrbanas_tablaAfrobeatsMusica',
            'blogDanzasUrbanas_tablaAfrobeatsDificultad',
            'blogDanzasUrbanas_tablaAfrobeatsIdeal',
          ],
        ],
      },
    },

    // --- ANSWER CAPSULE 3: ¿Cuál es el estilo más fácil? ---
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blogDanzasUrbanas_answerCapsule3',
      answerCapsule: {
        questionKey: 'blogDanzasUrbanas_answerQuestion3',
        answerKey: 'blogDanzasUrbanas_answerText3',
        confidence: 'high',
        icon: 'lightbulb',
      },
    },

    // --- SECTION 3: Beneficios Científicos ---
    {
      id: 'beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogDanzasUrbanas_section3Title',
    },
    {
      id: 'beneficios-intro',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section3Intro',
    },
    {
      id: 'beneficios-ciencia',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section3Content1',
    },
    {
      id: 'beneficios-experiencia',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section3Content2',
    },

    // --- ANSWER CAPSULE 4: ¿Es buen ejercicio? ---
    {
      id: 'answer-capsule-4',
      type: 'answer-capsule',
      contentKey: 'blogDanzasUrbanas_answerCapsule4',
      answerCapsule: {
        questionKey: 'blogDanzasUrbanas_answerQuestion4',
        answerKey: 'blogDanzasUrbanas_answerText4',
        confidence: 'verified',
        icon: 'check',
      },
    },

    // --- SECTION 4: Mitos Desmontados ---
    {
      id: 'mitos',
      type: 'heading',
      level: 2,
      contentKey: 'blogDanzasUrbanas_section4Title',
    },
    {
      id: 'mito-edad',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section4Content1',
    },
    {
      id: 'mito-ritmo',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section4Content2',
    },
    {
      id: 'mito-dificil',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section4Content3',
    },

    // --- SECTION 5: La Escena en Barcelona ---
    {
      id: 'escena-barcelona',
      type: 'heading',
      level: 2,
      contentKey: 'blogDanzasUrbanas_section5Title',
    },
    {
      id: 'barcelona-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section5Content',
    },

    // --- SECTION 6: Tu Primera Clase ---
    {
      id: 'primera-clase',
      type: 'heading',
      level: 2,
      contentKey: 'blogDanzasUrbanas_section6Title',
    },
    {
      id: 'clase-estructura',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section6Content1',
    },
    {
      id: 'clase-que-llevar',
      type: 'list',
      contentKey: 'blogDanzasUrbanas_section6List',
      listItems: [
        'blogDanzasUrbanas_section6ListItem1',
        'blogDanzasUrbanas_section6ListItem2',
        'blogDanzasUrbanas_section6ListItem3',
        'blogDanzasUrbanas_section6ListItem4',
        'blogDanzasUrbanas_section6ListItem5',
      ],
    },
    {
      id: 'clase-consejos',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_section6Content2',
    },

    // --- DEFINICIONES ---
    {
      id: 'definicion-danza-urbana',
      type: 'definition',
      definitionTermKey: 'blogDanzasUrbanas_defTerm1',
      contentKey: 'blogDanzasUrbanas_defContent1',
    },
    {
      id: 'definicion-breaking',
      type: 'definition',
      definitionTermKey: 'blogDanzasUrbanas_defTerm2',
      contentKey: 'blogDanzasUrbanas_defContent2',
    },
    {
      id: 'definicion-popping',
      type: 'definition',
      definitionTermKey: 'blogDanzasUrbanas_defTerm3',
      contentKey: 'blogDanzasUrbanas_defContent3',
    },
    {
      id: 'definicion-locking',
      type: 'definition',
      definitionTermKey: 'blogDanzasUrbanas_defTerm4',
      contentKey: 'blogDanzasUrbanas_defContent4',
    },

    // --- CONCLUSION ---
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogDanzasUrbanas_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogDanzasUrbanas_conclusionCTA',
    },

    // --- REFERENCES ---
    {
      id: 'referencias',
      type: 'references',
      contentKey: 'blogDanzasUrbanas_referencesTitle',
      references: [
        {
          id: 'ref-ajpm',
          titleKey: 'blogDanzasUrbanas_refAJPMTitle',
          url: 'https://pubmed.ncbi.nlm.nih.gov/26944521/',
          publisher: 'American Journal of Preventive Medicine',
          year: '2016',
          descriptionKey: 'blogDanzasUrbanas_refAJPMDesc',
        },
        {
          id: 'ref-britannica',
          titleKey: 'blogDanzasUrbanas_refBritannicaTitle',
          url: 'https://www.britannica.com/art/hip-hop',
          publisher: 'Encyclopaedia Britannica',
          year: '2025',
          descriptionKey: 'blogDanzasUrbanas_refBritannicaDesc',
        },
        {
          id: 'ref-olympics',
          titleKey: 'blogDanzasUrbanas_refOlympicsTitle',
          url: 'https://olympics.com/en/olympic-games/paris-2024/results/breaking',
          publisher: 'Olympics.com',
          year: '2024',
          descriptionKey: 'blogDanzasUrbanas_refOlympicsDesc',
        },
        {
          id: 'ref-ministerio',
          titleKey: 'blogDanzasUrbanas_refMinisterioTitle',
          url: 'https://www.cultura.gob.es/dam/jcr:49661d3c-69bb-4c97-87d2-a30f699ff53d/encuesta-de-habitos-y-practicas-culturales-2018-2019-principales-resultados.pdf',
          publisher: 'Ministerio de Cultura y Deporte',
          year: '2019',
          descriptionKey: 'blogDanzasUrbanas_refMinisterioDesc',
        },
        {
          id: 'ref-wikipedia-hiphop',
          titleKey: 'blogDanzasUrbanas_refWikipediaTitle',
          url: 'https://es.wikipedia.org/wiki/Hip_hop_espa%C3%B1ol',
          publisher: 'Wikipedia',
          year: '2026',
          descriptionKey: 'blogDanzasUrbanas_refWikipediaDesc',
        },
        {
          id: 'ref-tiktok',
          titleKey: 'blogDanzasUrbanas_refTikTokTitle',
          url: 'https://www.jadetimes.com/post/the-influence-of-tiktok-on-modern-dance-trends',
          publisher: 'Jade Times',
          year: '2025',
          descriptionKey: 'blogDanzasUrbanas_refTikTokDesc',
        },
        {
          id: 'ref-market',
          titleKey: 'blogDanzasUrbanas_refMarketTitle',
          url: 'https://www.proficientmarketinsights.com/market-reports/dance-market-2833',
          publisher: 'Proficient Market Insights',
          year: '2025',
          descriptionKey: 'blogDanzasUrbanas_refMarketDesc',
        },
      ],
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/danzas-urbanas/hero.webp',
    srcSet:
      '/images/blog/danzas-urbanas/hero-480.webp 480w, /images/blog/danzas-urbanas/hero-960.webp 960w, /images/blog/danzas-urbanas/hero.webp 1200w',
    alt: "Clase de hip-hop y danzas urbanas en Farray's Center Barcelona, alumnos practicando movimientos de breaking y popping",
    altKey: 'blogDanzasUrbanas_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/danzas-urbanas/og.jpg',

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_tips',
    categoryUrl: '/blog/tips',
    currentKey: 'blogDanzasUrbanas_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blogDanzasUrbanas_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogDanzasUrbanas_faq1Question',
        answerKey: 'blogDanzasUrbanas_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogDanzasUrbanas_faq2Question',
        answerKey: 'blogDanzasUrbanas_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogDanzasUrbanas_faq3Question',
        answerKey: 'blogDanzasUrbanas_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogDanzasUrbanas_faq4Question',
        answerKey: 'blogDanzasUrbanas_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogDanzasUrbanas_faq5Question',
        answerKey: 'blogDanzasUrbanas_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogDanzasUrbanas_faq6Question',
        answerKey: 'blogDanzasUrbanas_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogDanzasUrbanas_faq7Question',
        answerKey: 'blogDanzasUrbanas_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogDanzasUrbanas_faq8Question',
        answerKey: 'blogDanzasUrbanas_faq8Answer',
      },
    ],
  },

  // === RELATED ARTICLES ===
  relatedArticles: [
    {
      slug: 'clases-baile-principiantes-barcelona-farrays',
      category: 'tips',
      titleKey: 'blogClasesPrincipiantes_title',
      excerptKey: 'blogClasesPrincipiantes_excerpt',
      image: '/images/blog/clases-principiantes/hero.webp',
    },
    {
      slug: 'como-perder-miedo-bailar',
      category: 'lifestyle',
      titleKey: 'blogPerderMiedoBailar_title',
      excerptKey: 'blogPerderMiedoBailar_excerpt',
      image: '/images/blog/como-perder-miedo/hero.webp',
    },
  ],

  // === RELATED CLASSES ===
  relatedClasses: [
    'hip-hop-barcelona',
    'dancehall-barcelona',
    'clases-baile-principiantes-barcelona',
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

  // === SCHEMAS ===
  localBusinessSchema: {
    enabled: true,
  },
  courseSchema: {
    enabled: true,
    courseNameKey: 'blogDanzasUrbanas_courseSchemaName',
    courseDescriptionKey: 'blogDanzasUrbanas_courseSchemaDesc',
    provider: "Farray's International Dance Center",
    courseMode: 'OnSite',
  },
  aggregateRatingSchema: {
    enabled: true,
    ratingValue: 4.9,
    reviewCount: 412,
    bestRating: 5,
    worstRating: 1,
  },

  // === SPEAKABLE (Voice Search) ===
  speakableSelectors: [
    '#article-summary',
    '[data-answer-capsule="true"]',
    '#definicion-danza-urbana',
    '#intro',
    '#conclusion',
  ],

  // === GOOGLE DISCOVER ===
  discoverOptimized: true,
};
