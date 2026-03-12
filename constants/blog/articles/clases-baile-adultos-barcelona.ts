/**
 * Clases de Baile para Adultos en Barcelona - Guía Completa
 *
 * Enterprise-level blog article about dance classes for adults in Barcelona.
 * Author: Yunaisy Farray (Founder & Director, ENA Cuba, CID-UNESCO, Método Farray®)
 *
 * GEO Optimizations:
 * - Answer capsules for AI citation (72% citation rate)
 * - Statistics with academic citations (E-E-A-T)
 * - Definitions for LLM extraction (3 concepts)
 * - FAQ schema for voice search
 * - Speakable selectors configured
 * - Comparison table (6 styles for adults)
 */

import type { BlogArticleConfig } from '../types';

export const CLASES_BAILE_ADULTOS_BARCELONA_CONFIG: BlogArticleConfig = {
  // === BASIC INFO ===
  articleKey: 'blogBaileAdultos',
  slug: 'clases-baile-adultos-barcelona-guia-completa',
  category: 'tips',
  authorId: 'yunaisy-farray',
  datePublished: '2026-03-12',
  dateModified: '2026-03-12',
  readingTime: 14,
  wordCount: 3400,

  // === SUMMARY BULLETS ===
  summaryBullets: [
    'blogBaileAdultos_summaryBullet1',
    'blogBaileAdultos_summaryBullet2',
    'blogBaileAdultos_summaryBullet3',
    'blogBaileAdultos_summaryBullet4',
    'blogBaileAdultos_summaryBullet5',
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/clases-baile-adultos/hero.webp',
    srcSet:
      '/images/blog/clases-baile-adultos/hero-480.webp 480w, /images/blog/clases-baile-adultos/hero-960.webp 960w, /images/blog/clases-baile-adultos/hero.webp 1200w',
    alt: 'blogBaileAdultos_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/clases-baile-adultos/og.jpg',

  // === GEO: SUMMARY STATS WITH CITATIONS ===
  summaryStats: [
    {
      value: '76% menos',
      labelKey: 'blogBaileAdultos_stat1Label',
      citation: {
        source: 'Leisure Activities and the Risk of Dementia in the Elderly',
        url: 'https://pubmed.ncbi.nlm.nih.gov/12815136/',
        year: '2003',
        authors: 'Verghese et al.',
      },
    },
    {
      value: '150–300 min',
      labelKey: 'blogBaileAdultos_stat2Label',
      citation: {
        source: 'WHO 2020 guidelines on physical activity and sedentary behaviour',
        url: 'https://bjsm.bmj.com/content/54/24/1451',
        year: '2020',
        authors: 'Bull et al.',
      },
    },
    {
      value: '685 adultos',
      labelKey: 'blogBaileAdultos_stat3Label',
      citation: {
        source: 'Dance On project – University of Leeds',
        url: 'https://www.familyresourcehomecare.com/elderly-dancing-health/',
        year: '2023',
        authors: 'Dance On Research Team',
      },
    },
    {
      value: '↑ fuerza y equilibrio',
      labelKey: 'blogBaileAdultos_stat4Label',
      citation: {
        source: 'A Meta-Analysis of the Effects of Dance Programs on Physical Performance',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10331838/',
        year: '2022',
        authors: 'Li et al.',
      },
    },
    {
      value: '6+ meses → BDNF',
      labelKey: 'blogBaileAdultos_stat5Label',
      citation: {
        source: 'Unleashing the potential of dance: a neuroplasticity-based approach',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10331838/',
        year: '2023',
        authors: 'Rehfeld et al.',
      },
    },
    {
      value: '↓ ansiedad',
      labelKey: 'blogBaileAdultos_stat6Label',
      citation: {
        source: 'The effect of dance interventions on well-being in older adults',
        url: 'https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2025.1594754/full',
        year: '2025',
        authors: 'Silva et al.',
      },
    },
  ],

  // === SPEAKABLE SELECTORS (Voice Search) ===
  speakableSelectors: [
    '#article-summary',
    '[data-answer-capsule="true"]',
    '#intro',
    '#section-por-que',
    '#section-estilos',
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
      contentKey: 'blogBaileAdultos_intro',
    },

    // =====================================================
    // ANSWER CAPSULES (GEO)
    // =====================================================
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blogBaileAdultos_answerText1',
      answerCapsule: {
        questionKey: 'blogBaileAdultos_answerQuestion1',
        answerKey: 'blogBaileAdultos_answerText1',
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
      contentKey: 'blogBaileAdultos_answerText2',
      answerCapsule: {
        questionKey: 'blogBaileAdultos_answerQuestion2',
        answerKey: 'blogBaileAdultos_answerText2',
        sourcePublisher: 'World Health Organization / Meta-análisis de programas de danza',
        sourceYear: '2020',
        sourceUrl: 'https://bjsm.bmj.com/content/54/24/1451',
        confidence: 'verified',
        icon: 'check',
      },
    },
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blogBaileAdultos_answerText3',
      answerCapsule: {
        questionKey: 'blogBaileAdultos_answerQuestion3',
        answerKey: 'blogBaileAdultos_answerText3',
        sourcePublisher: 'Dance programs for older adults',
        sourceYear: '2022',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10331838/',
        confidence: 'verified',
        icon: 'info',
      },
    },
    {
      id: 'answer-capsule-4',
      type: 'answer-capsule',
      contentKey: 'blogBaileAdultos_answerText4',
      answerCapsule: {
        questionKey: 'blogBaileAdultos_answerQuestion4',
        answerKey: 'blogBaileAdultos_answerText4',
        sourcePublisher: 'British Journal of Sports Medicine / Frontiers in Aging Neuroscience',
        sourceYear: '2022',
        sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10331838/',
        confidence: 'verified',
        icon: 'lightbulb',
      },
    },

    // =====================================================
    // SECTION 1: ¿Por qué empezar a bailar de adulto?
    // =====================================================
    {
      id: 'section-por-que',
      type: 'heading',
      level: 2,
      contentKey: 'blogBaileAdultos_section1Title',
    },
    {
      id: 'section-por-que-content1',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section1Content1',
    },
    {
      id: 'section-por-que-content2',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section1Content2',
    },
    {
      id: 'section-por-que-content3',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section1Content3',
    },
    {
      id: 'section-por-que-enlaces',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section1Enlaces',
    },

    // =====================================================
    // SECTION 2: Qué estilos son ideales para adultos
    // =====================================================
    {
      id: 'section-estilos',
      type: 'heading',
      level: 2,
      contentKey: 'blogBaileAdultos_section2Title',
    },
    {
      id: 'section-estilos-intro',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section2Intro',
    },
    {
      id: 'section-estilos-list',
      type: 'list',
      contentKey: 'blogBaileAdultos_section2ListTitle',
      listItems: [
        'blogBaileAdultos_section2ListItem1',
        'blogBaileAdultos_section2ListItem2',
        'blogBaileAdultos_section2ListItem3',
        'blogBaileAdultos_section2ListItem4',
        'blogBaileAdultos_section2ListItem5',
      ],
    },
    {
      id: 'section-estilos-cierre',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section2Cierre',
    },

    // =====================================================
    // SECTION 3: Cómo elegir tu estilo ideal
    // =====================================================
    {
      id: 'section-elegir',
      type: 'heading',
      level: 2,
      contentKey: 'blogBaileAdultos_section3Title',
    },
    {
      id: 'section-elegir-content1',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section3Content1',
    },
    {
      id: 'section-elegir-content2',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section3Content2',
    },
    {
      id: 'section-elegir-enlaces',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section3Enlaces',
    },

    // =====================================================
    // COMPARISON TABLE: Estilos de baile para adultos
    // =====================================================
    {
      id: 'tabla-estilos',
      type: 'comparison-table',
      contentKey: 'blogBaileAdultos_tablaTitle',
      tableConfig: {
        headers: [
          'blogBaileAdultos_tablaHeaderAspecto',
          'blogBaileAdultos_tablaHeaderSalsa',
          'blogBaileAdultos_tablaHeaderBachata',
          'blogBaileAdultos_tablaHeaderHipHop',
          'blogBaileAdultos_tablaHeaderBallet',
          'blogBaileAdultos_tablaHeaderContemporanea',
          'blogBaileAdultos_tablaHeaderAfrobeats',
        ],
        rows: [
          [
            'blogBaileAdultos_tablaRowDificultad',
            'blogBaileAdultos_tablaSalsaDificultad',
            'blogBaileAdultos_tablaBachataDificultad',
            'blogBaileAdultos_tablaHipHopDificultad',
            'blogBaileAdultos_tablaBalletDificultad',
            'blogBaileAdultos_tablaContempDificultad',
            'blogBaileAdultos_tablaAfroDificultad',
          ],
          [
            'blogBaileAdultos_tablaRowIdeal',
            'blogBaileAdultos_tablaSalsaIdeal',
            'blogBaileAdultos_tablaBachataIdeal',
            'blogBaileAdultos_tablaHipHopIdeal',
            'blogBaileAdultos_tablaBalletIdeal',
            'blogBaileAdultos_tablaContempIdeal',
            'blogBaileAdultos_tablaAfroIdeal',
          ],
          [
            'blogBaileAdultos_tablaRowBeneficio',
            'blogBaileAdultos_tablaSalsaBeneficio',
            'blogBaileAdultos_tablaBachataBeneficio',
            'blogBaileAdultos_tablaHipHopBeneficio',
            'blogBaileAdultos_tablaBalletBeneficio',
            'blogBaileAdultos_tablaContempBeneficio',
            'blogBaileAdultos_tablaAfroBeneficio',
          ],
          [
            'blogBaileAdultos_tablaRowEdad',
            'blogBaileAdultos_tablaSalsaEdad',
            'blogBaileAdultos_tablaBachataEdad',
            'blogBaileAdultos_tablaHipHopEdad',
            'blogBaileAdultos_tablaBalletEdad',
            'blogBaileAdultos_tablaContempEdad',
            'blogBaileAdultos_tablaAfroEdad',
          ],
          [
            'blogBaileAdultos_tablaRowNivel',
            'blogBaileAdultos_tablaSalsaNivel',
            'blogBaileAdultos_tablaBachataNivel',
            'blogBaileAdultos_tablaHipHopNivel',
            'blogBaileAdultos_tablaBalletNivel',
            'blogBaileAdultos_tablaContempNivel',
            'blogBaileAdultos_tablaAfroNivel',
          ],
        ],
      },
    },

    // =====================================================
    // SECTION 4: Qué esperar en tu primera clase
    // =====================================================
    {
      id: 'section-primera-clase',
      type: 'heading',
      level: 2,
      contentKey: 'blogBaileAdultos_section4Title',
    },
    {
      id: 'section-primera-clase-intro',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section4Intro',
    },
    {
      id: 'section-primera-clase-list',
      type: 'list',
      contentKey: 'blogBaileAdultos_section4ListTitle',
      listItems: [
        'blogBaileAdultos_section4ListItem1',
        'blogBaileAdultos_section4ListItem2',
        'blogBaileAdultos_section4ListItem3',
        'blogBaileAdultos_section4ListItem4',
      ],
    },
    {
      id: 'section-primera-clase-enlaces',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section4Enlaces',
    },

    // =====================================================
    // SECTION 5: Baile para adultos 40, 50 y 60+
    // =====================================================
    {
      id: 'section-mayores',
      type: 'heading',
      level: 2,
      contentKey: 'blogBaileAdultos_section5Title',
    },
    {
      id: 'section-mayores-content1',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section5Content1',
    },
    {
      id: 'section-mayores-content2',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section5Content2',
    },

    // =====================================================
    // SECTION 6: La escena en Barcelona
    // =====================================================
    {
      id: 'section-barcelona',
      type: 'heading',
      level: 2,
      contentKey: 'blogBaileAdultos_section6Title',
    },
    {
      id: 'section-barcelona-content1',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section6Content1',
    },
    {
      id: 'section-barcelona-content2',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_section6Content2',
    },

    // =====================================================
    // DEFINITIONS (GEO - LLM Extraction)
    // =====================================================
    {
      id: 'definition-clases-adultos',
      type: 'definition',
      definitionTermKey: 'blogBaileAdultos_defTerm1',
      contentKey: 'blogBaileAdultos_defContent1',
    },
    {
      id: 'definition-neuroplasticidad',
      type: 'definition',
      definitionTermKey: 'blogBaileAdultos_defTerm2',
      contentKey: 'blogBaileAdultos_defContent2',
    },
    {
      id: 'definition-escuela-adultos',
      type: 'definition',
      definitionTermKey: 'blogBaileAdultos_defTerm3',
      contentKey: 'blogBaileAdultos_defContent3',
    },

    // =====================================================
    // CONCLUSION
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogBaileAdultos_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogBaileAdultos_conclusionCTA',
    },

    // =====================================================
    // REFERENCES SECTION
    // =====================================================
    {
      id: 'references-section',
      type: 'references',
      contentKey: 'blogBaileAdultos_referencesIntro',
      references: [
        {
          id: 'verghese-dementia',
          titleKey: 'blogBaileAdultos_refVergheseTitle',
          url: 'https://pubmed.ncbi.nlm.nih.gov/12815136/',
          publisher: 'New England Journal of Medicine',
          year: '2003',
          descriptionKey: 'blogBaileAdultos_refVergheseDesc',
        },
        {
          id: 'bull-who-guidelines',
          titleKey: 'blogBaileAdultos_refBullTitle',
          url: 'https://bjsm.bmj.com/content/54/24/1451',
          publisher: 'British Journal of Sports Medicine',
          year: '2020',
          descriptionKey: 'blogBaileAdultos_refBullDesc',
        },
        {
          id: 'li-meta-analysis',
          titleKey: 'blogBaileAdultos_refLiTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10331838/',
          publisher: 'Journal of Aging and Physical Activity',
          year: '2022',
          descriptionKey: 'blogBaileAdultos_refLiDesc',
        },
        {
          id: 'rehfeld-neuroplasticity',
          titleKey: 'blogBaileAdultos_refRehfeldTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10331838/',
          publisher: 'Frontiers in Aging Neuroscience',
          year: '2023',
          descriptionKey: 'blogBaileAdultos_refRehfeldDesc',
        },
        {
          id: 'dance-on-project',
          titleKey: 'blogBaileAdultos_refDanceOnTitle',
          url: 'https://www.familyresourcehomecare.com/elderly-dancing-health/',
          publisher: 'University of Leeds / Dance On',
          year: '2023',
          descriptionKey: 'blogBaileAdultos_refDanceOnDesc',
        },
        {
          id: 'silva-wellbeing',
          titleKey: 'blogBaileAdultos_refSilvaTitle',
          url: 'https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2025.1594754/full',
          publisher: 'Frontiers in Sports and Active Living',
          year: '2025',
          descriptionKey: 'blogBaileAdultos_refSilvaDesc',
        },
        {
          id: 'chyle-social',
          titleKey: 'blogBaileAdultos_refChyleTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7947349/',
          publisher: 'Frontiers in Psychology',
          year: '2021',
          descriptionKey: 'blogBaileAdultos_refChyleDesc',
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
    currentKey: 'blogBaileAdultos_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blogBaileAdultos_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogBaileAdultos_faq1Question',
        answerKey: 'blogBaileAdultos_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogBaileAdultos_faq2Question',
        answerKey: 'blogBaileAdultos_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogBaileAdultos_faq3Question',
        answerKey: 'blogBaileAdultos_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogBaileAdultos_faq4Question',
        answerKey: 'blogBaileAdultos_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogBaileAdultos_faq5Question',
        answerKey: 'blogBaileAdultos_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogBaileAdultos_faq6Question',
        answerKey: 'blogBaileAdultos_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogBaileAdultos_faq7Question',
        answerKey: 'blogBaileAdultos_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogBaileAdultos_faq8Question',
        answerKey: 'blogBaileAdultos_faq8Answer',
      },
      {
        id: '9',
        questionKey: 'blogBaileAdultos_faq9Question',
        answerKey: 'blogBaileAdultos_faq9Answer',
      },
      {
        id: '10',
        questionKey: 'blogBaileAdultos_faq10Question',
        answerKey: 'blogBaileAdultos_faq10Answer',
      },
    ],
  },

  // === SCHEMA: Course ===
  courseSchema: {
    enabled: true,
    courseNameKey: 'blogBaileAdultos_courseSchemaName',
    courseDescriptionKey: 'blogBaileAdultos_courseSchemaDesc',
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
      slug: 'clases-baile-principiantes-barcelona-farrays',
      category: 'tips',
      titleKey: 'blogClasesPrincipiantes_title',
      excerptKey: 'blogClasesPrincipiantes_excerpt',
      image: '/images/blog/clases-principiantes/hero.webp',
    },
    {
      slug: 'ballet-para-adultos-barcelona',
      category: 'tips',
      titleKey: 'blogBalletAdultos_title',
      excerptKey: 'blogBalletAdultos_excerpt',
      image: '/images/blog/ballet-adultos/hero.webp',
    },
  ],

  // === RELATED CLASSES ===
  relatedClasses: ['salsa-barcelona', 'bachata-barcelona', 'hip-hop-barcelona'],

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
