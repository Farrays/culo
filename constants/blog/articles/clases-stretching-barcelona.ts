/**
 * Clases de Stretching Barcelona - Guía Completa
 *
 * Enterprise-level blog article about Stretching classes in Barcelona.
 * Author: CrisAg (Body Conditioning, Stretching & Fitness, Método Farray® since 2012)
 *
 * Real instructors:
 * - CrisAg (Body Conditioning, Cuerpo Fit, Stretching, Bum Bum — Método Farray® since 2012)
 * - Daniel Sené (Ballet, Yoga, Tai-Chi, Stretching — ENA Cuba)
 *
 * GEO Optimizations:
 * - Answer capsules for AI citation (72% citation rate)
 * - Statistics with academic citations (E-E-A-T)
 * - Definitions for LLM extraction (3 stretching concepts)
 * - FAQ schema for voice search
 * - Speakable selectors configured
 * - Comparison table (4 types of stretching)
 */

import type { BlogArticleConfig } from '../types';

export const CLASES_STRETCHING_BARCELONA_CONFIG: BlogArticleConfig = {
  // === BASIC INFO ===
  articleKey: 'blogStretching',
  slug: 'clases-stretching-barcelona-guia-completa',
  category: 'fitness',
  authorId: 'crisag',
  datePublished: '2026-03-12',
  dateModified: '2026-03-12',
  readingTime: 13,
  wordCount: 3000,

  // === SUMMARY BULLETS ===
  summaryBullets: [
    'blogStretching_summaryBullet1',
    'blogStretching_summaryBullet2',
    'blogStretching_summaryBullet3',
    'blogStretching_summaryBullet4',
    'blogStretching_summaryBullet5',
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/clases-stretching/hero.webp',
    srcSet:
      '/images/blog/clases-stretching/hero-480.webp 480w, /images/blog/clases-stretching/hero-960.webp 960w, /images/blog/clases-stretching/hero.webp 1200w',
    alt: 'blogStretching_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/clases-stretching/og.jpg',

  // === GEO: SUMMARY STATS WITH CITATIONS ===
  summaryStats: [
    {
      value: '↑ ROM',
      labelKey: 'blogStretching_stat1Label',
      citation: {
        source: 'Chronic effects of stretching on range of motion',
        url: 'https://pubmed.ncbi.nlm.nih.gov/37301370/',
        year: '2024',
        authors: 'Afonso et al.',
      },
    },
    {
      value: '11.4° vs 4.3°',
      labelKey: 'blogStretching_stat2Label',
      citation: {
        source: 'The effect of static stretch and dynamic range of motion on flexibility',
        url: 'https://pubmed.ncbi.nlm.nih.gov/9549713/',
        year: '1998',
        authors: 'Bandy et al.',
      },
    },
    {
      value: '≈6°/década',
      labelKey: 'blogStretching_stat3Label',
      citation: {
        source: 'Flexibility of Older Adults Aged 55–86 Years',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3703899/',
        year: '2013',
        authors: 'Stathokostas et al.',
      },
    },
    {
      value: '↓ rigidez',
      labelKey: 'blogStretching_stat4Label',
      citation: {
        source:
          'Chronic effects of a static stretching intervention program on ROM and tissue hardness',
        url: 'https://www.frontiersin.org/journals/medicine/articles/10.3389/fmed.2024.1505775/full',
        year: '2024',
        authors: 'Mizuno et al.',
      },
    },
    {
      value: '↑ serotonina',
      labelKey: 'blogStretching_stat5Label',
      citation: {
        source: 'The simple act of stretching',
        url: 'https://www.research.colostate.edu/healthyagingcenter/2021/06/23/the-simple-act-of-stretching/',
        year: '2021',
        authors: 'Colorado State University',
      },
    },
    {
      value: 'Sin efecto en DOMS',
      labelKey: 'blogStretching_stat6Label',
      citation: {
        source: 'Stretching and DOMS',
        url: 'https://digitalcommons.wku.edu/ijes/vol7/iss1/3/',
        year: '2014',
        authors: 'McGrath et al.',
      },
    },
  ],

  // === SPEAKABLE SELECTORS (Voice Search) ===
  speakableSelectors: [
    '#article-summary',
    '[data-answer-capsule="true"]',
    '#intro',
    '#section-que-es',
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
      contentKey: 'blogStretching_intro',
    },

    // =====================================================
    // ANSWER CAPSULES (GEO)
    // =====================================================
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blogStretching_answerText1',
      answerCapsule: {
        questionKey: 'blogStretching_answerQuestion1',
        answerKey: 'blogStretching_answerText1',
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
      contentKey: 'blogStretching_answerText2',
      answerCapsule: {
        questionKey: 'blogStretching_answerQuestion2',
        answerKey: 'blogStretching_answerText2',
        sourcePublisher: 'Frontiers in Medicine / Journal of Aging Research',
        sourceYear: '2024',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3703899/',
        confidence: 'verified',
        icon: 'lightbulb',
      },
    },
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blogStretching_answerText3',
      answerCapsule: {
        questionKey: 'blogStretching_answerQuestion3',
        answerKey: 'blogStretching_answerText3',
        sourcePublisher: 'Revisiones sobre mecanismos de mejora del rango de movimiento',
        sourceYear: '2025',
        sourceUrl:
          'https://www.fisiologiadelejercicio.com/wp-content/uploads/2025/04/Mechanisms-Underlying-Range-of-Motion-Improvements-Following-A.pdf',
        confidence: 'high',
        icon: 'info',
      },
    },
    {
      id: 'answer-capsule-4',
      type: 'answer-capsule',
      contentKey: 'blogStretching_answerText4',
      answerCapsule: {
        questionKey: 'blogStretching_answerQuestion4',
        answerKey: 'blogStretching_answerText4',
        sourcePublisher: "Farray's International Dance Center",
        sourceYear: '2026',
        sourceUrl: 'https://www.farrayscenter.com/es/horarios-clases-baile-barcelona',
        confidence: 'high',
        icon: 'check',
      },
    },

    // =====================================================
    // SECTION 1: Qué es el stretching como disciplina
    // =====================================================
    {
      id: 'section-que-es',
      type: 'heading',
      level: 2,
      contentKey: 'blogStretching_section1Title',
    },
    {
      id: 'section-que-es-content1',
      type: 'paragraph',
      contentKey: 'blogStretching_section1Content1',
    },
    {
      id: 'section-que-es-content2',
      type: 'paragraph',
      contentKey: 'blogStretching_section1Content2',
    },

    // =====================================================
    // SECTION 2: Tipos de stretching
    // =====================================================
    {
      id: 'section-tipos',
      type: 'heading',
      level: 2,
      contentKey: 'blogStretching_section2Title',
    },
    {
      id: 'section-tipos-intro',
      type: 'paragraph',
      contentKey: 'blogStretching_section2Intro',
    },
    {
      id: 'section-tipos-list',
      type: 'list',
      contentKey: 'blogStretching_section2ListTitle',
      listItems: [
        'blogStretching_section2ListItem1',
        'blogStretching_section2ListItem2',
        'blogStretching_section2ListItem3',
        'blogStretching_section2ListItem4',
        'blogStretching_section2ListItem5',
      ],
    },
    {
      id: 'section-tipos-backbending',
      type: 'paragraph',
      contentKey: 'blogStretching_section2Backbending',
    },

    // =====================================================
    // COMPARISON TABLE: Tipos de Stretching
    // =====================================================
    {
      id: 'tabla-tipos',
      type: 'comparison-table',
      contentKey: 'blogStretching_tablaTitle',
      tableConfig: {
        headers: [
          'blogStretching_tablaHeaderAspecto',
          'blogStretching_tablaHeaderActivo',
          'blogStretching_tablaHeaderPasivo',
          'blogStretching_tablaHeaderPNF',
          'blogStretching_tablaHeaderBackbending',
        ],
        rows: [
          [
            'blogStretching_tablaRowQueEs',
            'blogStretching_tablaActivoQueEs',
            'blogStretching_tablaPasivoQueEs',
            'blogStretching_tablaPNFQueEs',
            'blogStretching_tablaBackQueEs',
          ],
          [
            'blogStretching_tablaRowControla',
            'blogStretching_tablaActivoControla',
            'blogStretching_tablaPasivoControla',
            'blogStretching_tablaPNFControla',
            'blogStretching_tablaBackControla',
          ],
          [
            'blogStretching_tablaRowBeneficio',
            'blogStretching_tablaActivoBeneficio',
            'blogStretching_tablaPasivoBeneficio',
            'blogStretching_tablaPNFBeneficio',
            'blogStretching_tablaBackBeneficio',
          ],
          [
            'blogStretching_tablaRowRiesgo',
            'blogStretching_tablaActivoRiesgo',
            'blogStretching_tablaPasivoRiesgo',
            'blogStretching_tablaPNFRiesgo',
            'blogStretching_tablaBackRiesgo',
          ],
          [
            'blogStretching_tablaRowParaQuien',
            'blogStretching_tablaActivoParaQuien',
            'blogStretching_tablaPasivoParaQuien',
            'blogStretching_tablaPNFParaQuien',
            'blogStretching_tablaBackParaQuien',
          ],
          [
            'blogStretching_tablaRowUso',
            'blogStretching_tablaActivoUso',
            'blogStretching_tablaPasivoUso',
            'blogStretching_tablaPNFUso',
            'blogStretching_tablaBackUso',
          ],
        ],
      },
    },

    // =====================================================
    // SECTION 3: Beneficios del stretching
    // =====================================================
    {
      id: 'section-beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogStretching_section3Title',
    },
    {
      id: 'section-beneficios-content1',
      type: 'paragraph',
      contentKey: 'blogStretching_section3Content1',
    },
    {
      id: 'section-beneficios-content2',
      type: 'paragraph',
      contentKey: 'blogStretching_section3Content2',
    },
    {
      id: 'section-beneficios-content3',
      type: 'paragraph',
      contentKey: 'blogStretching_section3Content3',
    },
    {
      id: 'section-beneficios-enlaces',
      type: 'paragraph',
      contentKey: 'blogStretching_section3Enlaces',
    },

    // =====================================================
    // SECTION 4: Stretching para principiantes
    // =====================================================
    {
      id: 'section-principiantes',
      type: 'heading',
      level: 2,
      contentKey: 'blogStretching_section4Title',
    },
    {
      id: 'section-principiantes-intro',
      type: 'paragraph',
      contentKey: 'blogStretching_section4Intro',
    },
    {
      id: 'section-principiantes-list',
      type: 'list',
      contentKey: 'blogStretching_section4ListTitle',
      listItems: [
        'blogStretching_section4ListItem1',
        'blogStretching_section4ListItem2',
        'blogStretching_section4ListItem3',
        'blogStretching_section4ListItem4',
        'blogStretching_section4ListItem5',
      ],
    },
    {
      id: 'section-principiantes-enlaces',
      type: 'paragraph',
      contentKey: 'blogStretching_section4Enlaces',
    },

    // =====================================================
    // SECTION 5: Stretching para bailarines vs no bailarines
    // =====================================================
    {
      id: 'section-bailarines-vs',
      type: 'heading',
      level: 2,
      contentKey: 'blogStretching_section5Title',
    },
    {
      id: 'section-bailarines-content1',
      type: 'paragraph',
      contentKey: 'blogStretching_section5Content1',
    },
    {
      id: 'section-bailarines-content2',
      type: 'paragraph',
      contentKey: 'blogStretching_section5Content2',
    },

    // =====================================================
    // SECTION 6: La escena del stretching en Barcelona
    // =====================================================
    {
      id: 'section-escena',
      type: 'heading',
      level: 2,
      contentKey: 'blogStretching_section6Title',
    },
    {
      id: 'section-escena-content1',
      type: 'paragraph',
      contentKey: 'blogStretching_section6Content1',
    },

    // =====================================================
    // DEFINITIONS (GEO - LLM Extraction)
    // =====================================================
    {
      id: 'definition-stretching',
      type: 'definition',
      definitionTermKey: 'blogStretching_defTerm1',
      contentKey: 'blogStretching_defContent1',
    },
    {
      id: 'definition-flexibilidad-activa-pasiva',
      type: 'definition',
      definitionTermKey: 'blogStretching_defTerm2',
      contentKey: 'blogStretching_defContent2',
    },
    {
      id: 'definition-backbending',
      type: 'definition',
      definitionTermKey: 'blogStretching_defTerm3',
      contentKey: 'blogStretching_defContent3',
    },

    // =====================================================
    // CONCLUSION
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogStretching_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogStretching_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogStretching_conclusionCTA',
    },

    // =====================================================
    // REFERENCES SECTION
    // =====================================================
    {
      id: 'references-section',
      type: 'references',
      contentKey: 'blogStretching_referencesIntro',
      references: [
        {
          id: 'afonso-rom',
          titleKey: 'blogStretching_refAfonsoTitle',
          url: 'https://pubmed.ncbi.nlm.nih.gov/37301370/',
          publisher: 'Sports Medicine',
          year: '2024',
          descriptionKey: 'blogStretching_refAfonsoDesc',
        },
        {
          id: 'bandy-static',
          titleKey: 'blogStretching_refBandyTitle',
          url: 'https://pubmed.ncbi.nlm.nih.gov/9549713/',
          publisher: 'Medicine & Science in Sports & Exercise',
          year: '1998',
          descriptionKey: 'blogStretching_refBandyDesc',
        },
        {
          id: 'stathokostas-aging',
          titleKey: 'blogStretching_refStathokostasTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3703899/',
          publisher: 'Journal of Aging Research',
          year: '2013',
          descriptionKey: 'blogStretching_refStathokostasDesc',
        },
        {
          id: 'mizuno-hardness',
          titleKey: 'blogStretching_refMizunoTitle',
          url: 'https://www.frontiersin.org/journals/medicine/articles/10.3389/fmed.2024.1505775/full',
          publisher: 'Frontiers in Medicine',
          year: '2024',
          descriptionKey: 'blogStretching_refMizunoDesc',
        },
        {
          id: 'mcgrath-doms',
          titleKey: 'blogStretching_refMcGrathTitle',
          url: 'https://digitalcommons.wku.edu/ijes/vol7/iss1/3/',
          publisher: 'International Journal of Exercise Science',
          year: '2014',
          descriptionKey: 'blogStretching_refMcGrathDesc',
        },
        {
          id: 'colorado-serotonin',
          titleKey: 'blogStretching_refColoradoTitle',
          url: 'https://www.research.colostate.edu/healthyagingcenter/2021/06/23/the-simple-act-of-stretching/',
          publisher: 'Colorado State University – Center for Healthy Aging',
          year: '2021',
          descriptionKey: 'blogStretching_refColoradoDesc',
        },
        {
          id: 'rom-mechanisms',
          titleKey: 'blogStretching_refMechanismsTitle',
          url: 'https://www.fisiologiadelejercicio.com/wp-content/uploads/2025/04/Mechanisms-Underlying-Range-of-Motion-Improvements-Following-A.pdf',
          publisher: 'Fisiología del Ejercicio',
          year: '2025',
          descriptionKey: 'blogStretching_refMechanismsDesc',
        },
      ],
    },
  ],

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_fitness',
    categoryUrl: '/blog/fitness',
    currentKey: 'blogStretching_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blogStretching_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogStretching_faq1Question',
        answerKey: 'blogStretching_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogStretching_faq2Question',
        answerKey: 'blogStretching_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogStretching_faq3Question',
        answerKey: 'blogStretching_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogStretching_faq4Question',
        answerKey: 'blogStretching_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogStretching_faq5Question',
        answerKey: 'blogStretching_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogStretching_faq6Question',
        answerKey: 'blogStretching_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogStretching_faq7Question',
        answerKey: 'blogStretching_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogStretching_faq8Question',
        answerKey: 'blogStretching_faq8Answer',
      },
      {
        id: '9',
        questionKey: 'blogStretching_faq9Question',
        answerKey: 'blogStretching_faq9Answer',
      },
      {
        id: '10',
        questionKey: 'blogStretching_faq10Question',
        answerKey: 'blogStretching_faq10Answer',
      },
    ],
  },

  // === SCHEMA: Course ===
  courseSchema: {
    enabled: true,
    courseNameKey: 'blogStretching_courseSchemaName',
    courseDescriptionKey: 'blogStretching_courseSchemaDesc',
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
      slug: 'ballet-para-adultos-barcelona',
      category: 'tips',
      titleKey: 'blogBalletAdultos_title',
      excerptKey: 'blogBalletAdultos_excerpt',
      image: '/images/blog/ballet-adultos/hero.webp',
    },
    {
      slug: 'baile-salud-mental',
      category: 'fitness',
      titleKey: 'blogBaileSaludMental_title',
      excerptKey: 'blogBaileSaludMental_excerpt',
      image: '/images/blog/beneficios-salsa/hero.webp',
    },
  ],

  // === RELATED CLASSES ===
  relatedClasses: ['stretching-barcelona', 'body-conditioning-barcelona', 'ballet-barcelona'],

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
