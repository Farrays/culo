/**
 * Article Configuration: Salsa vs Bachata - ¿Qué Estilo Elegir?
 *
 * Enterprise SEO/GEO optimized article with comparison table,
 * internal links, verified references, and comprehensive FAQs.
 *
 * Category: Tutoriales
 * Target Keywords: salsa vs bachata, diferencias salsa bachata,
 *                  elegir estilo baile, comparativa bailes latinos,
 *                  aprender salsa o bachata barcelona
 */

import type { BlogArticleConfig } from '../types';

export const SALSA_VS_BACHATA_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blogSalsaVsBachata',
  slug: 'salsa-vs-bachata-que-estilo-elegir',
  category: 'tutoriales',

  // === DATES ===
  datePublished: '2026-01-16',
  dateModified: '2026-01-16',

  // === READING METRICS ===
  readingTime: 12,
  wordCount: 2800,

  // === SUMMARY (GEO Optimized) ===
  summaryBullets: [
    'blogSalsaVsBachata_summaryBullet1',
    'blogSalsaVsBachata_summaryBullet2',
    'blogSalsaVsBachata_summaryBullet3',
    'blogSalsaVsBachata_summaryBullet4',
  ],

  // === KEY STATISTICS (Holographic Cards) ===
  summaryStats: [
    {
      value: '1960s',
      labelKey: 'blogSalsaVsBachata_statSalsaOrigenLabel',
      source: 'Ramos Gandía, 2023',
    },
    {
      value: '1960s',
      labelKey: 'blogSalsaVsBachata_statBachataOrigenLabel',
      source: 'Pacini Hernández',
    },
    {
      value: 'UNESCO',
      labelKey: 'blogSalsaVsBachata_statUNESCOLabel',
      source: 'CRESPIAL, 2019',
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
      contentKey: 'blogSalsaVsBachata_intro',
    },
    {
      id: 'intro-2',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_intro2',
    },

    // =====================================================
    // SECTION 1: ORÍGENES - DOS HISTORIAS PARALELAS
    // =====================================================
    {
      id: 'origenes',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaVsBachata_origenesTitle',
    },
    {
      id: 'origenes-salsa',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_origenesSalsa',
    },
    {
      id: 'origenes-bachata',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_origenesBachata',
    },

    // =====================================================
    // SECTION 2: LA MÚSICA - RITMOS QUE HABLAN
    // =====================================================
    {
      id: 'musica',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaVsBachata_musicaTitle',
    },
    {
      id: 'musica-salsa',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_musicaSalsa',
    },
    {
      id: 'musica-bachata',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_musicaBachata',
    },

    // === IMAGE: Ritmos latinos ===
    {
      id: 'image-ritmos',
      type: 'image',
      contentKey: 'blogSalsaVsBachata_imageRitmosCaption',
      image: {
        src: '/images/blog/salsa-vs-bachata/ritmos-latinos.webp',
        srcSet:
          '/images/blog/salsa-vs-bachata/ritmos-latinos-480.webp 480w, /images/blog/salsa-vs-bachata/ritmos-latinos-800.webp 800w',
        alt: 'Comparación de ritmos: salsa y bachata, dos idiomas del corazón latino',
        caption: 'blogSalsaVsBachata_imageRitmosCaption',
        width: 800,
        height: 500,
      },
    },

    // =====================================================
    // SECTION 3: EL BAILE - MOVIMIENTO Y EXPRESIÓN
    // =====================================================
    {
      id: 'baile',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaVsBachata_baileTitle',
    },
    {
      id: 'baile-salsa',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_baileSalsa',
    },
    {
      id: 'baile-bachata',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_baileBachata',
    },

    // === COMPARISON TABLE ===
    {
      id: 'tabla-comparativa',
      type: 'comparison-table',
      contentKey: 'blogSalsaVsBachata_tablaTitle',
      tableConfig: {
        headers: [
          'blogSalsaVsBachata_tablaHeader1',
          'blogSalsaVsBachata_tablaHeader2',
          'blogSalsaVsBachata_tablaHeader3',
        ],
        rows: [
          [
            'blogSalsaVsBachata_tablaRow1Col1',
            'blogSalsaVsBachata_tablaRow1Col2',
            'blogSalsaVsBachata_tablaRow1Col3',
          ],
          [
            'blogSalsaVsBachata_tablaRow2Col1',
            'blogSalsaVsBachata_tablaRow2Col2',
            'blogSalsaVsBachata_tablaRow2Col3',
          ],
          [
            'blogSalsaVsBachata_tablaRow3Col1',
            'blogSalsaVsBachata_tablaRow3Col2',
            'blogSalsaVsBachata_tablaRow3Col3',
          ],
          [
            'blogSalsaVsBachata_tablaRow4Col1',
            'blogSalsaVsBachata_tablaRow4Col2',
            'blogSalsaVsBachata_tablaRow4Col3',
          ],
          [
            'blogSalsaVsBachata_tablaRow5Col1',
            'blogSalsaVsBachata_tablaRow5Col2',
            'blogSalsaVsBachata_tablaRow5Col3',
          ],
        ],
      },
    },

    // =====================================================
    // SECTION 4: ¿CUÁL ES MÁS FÁCIL APRENDER?
    // =====================================================
    {
      id: 'aprendizaje',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaVsBachata_aprendizajeTitle',
    },
    {
      id: 'aprendizaje-intro',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_aprendizajeIntro',
    },
    {
      id: 'aprendizaje-bachata',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_aprendizajeBachata',
    },
    {
      id: 'aprendizaje-salsa',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_aprendizajeSalsa',
    },

    // === IMAGE: Clases de baile ===
    {
      id: 'image-clases',
      type: 'image',
      contentKey: 'blogSalsaVsBachata_imageClasesCaption',
      image: {
        src: '/images/blog/salsa-vs-bachata/clases-baile.webp',
        srcSet:
          '/images/blog/salsa-vs-bachata/clases-baile-480.webp 480w, /images/blog/salsa-vs-bachata/clases-baile-800.webp 800w',
        alt: "Clases de salsa y bachata en Farray's Dance Center Barcelona",
        caption: 'blogSalsaVsBachata_imageClasesCaption',
        width: 800,
        height: 500,
      },
    },

    // =====================================================
    // SECTION 5: BENEFICIOS PARA LA SALUD
    // =====================================================
    {
      id: 'beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaVsBachata_beneficiosTitle',
    },
    {
      id: 'beneficios-intro',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_beneficiosIntro',
    },
    {
      id: 'beneficios-lista',
      type: 'list',
      contentKey: 'blogSalsaVsBachata_beneficiosListaTitle',
      listItems: [
        'blogSalsaVsBachata_beneficioCardio',
        'blogSalsaVsBachata_beneficioCognitivo',
        'blogSalsaVsBachata_beneficioEmocional',
        'blogSalsaVsBachata_beneficioSocial',
      ],
    },

    // =====================================================
    // SECTION 6: ¿POR QUÉ NO APRENDER AMBOS?
    // =====================================================
    {
      id: 'ambos',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaVsBachata_ambosTitle',
    },
    {
      id: 'ambos-content',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_ambosContent',
    },
    {
      id: 'ambos-farrays',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_ambosFarrays',
    },

    // =====================================================
    // SECTION 7: CONCLUSIÓN
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaVsBachata_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogSalsaVsBachata_conclusionCTA',
    },

    // =====================================================
    // REFERENCES SECTION (E-E-A-T)
    // =====================================================
    {
      id: 'references-section',
      type: 'references',
      contentKey: 'blogSalsaVsBachata_referencesIntro',
      references: [
        {
          id: 'ramos-gandia',
          titleKey: 'blogSalsaVsBachata_refRamosTitle',
          url: 'https://www.muchomasquebaile.es/wp-content/uploads/2021/11/Historia-de-la-salsa-desde-las-raices-hasta-el-1975.pdf',
          publisher: 'Mucho Más Que Baile',
          year: '2023',
          descriptionKey: 'blogSalsaVsBachata_refRamosDesc',
        },
        {
          id: 'pacini-hernandez',
          titleKey: 'blogSalsaVsBachata_refPaciniTitle',
          url: 'https://archive.org/details/bachatasocialhist00paci',
          publisher: 'Temple University Press',
          year: '1995',
          descriptionKey: 'blogSalsaVsBachata_refPaciniDesc',
        },
        {
          id: 'unesco-bachata',
          titleKey: 'blogSalsaVsBachata_refUNESCOTitle',
          url: 'https://ich.unesco.org/es/RL/la-bachata-dominicana-01514',
          publisher: 'UNESCO',
          year: '2019',
          descriptionKey: 'blogSalsaVsBachata_refUNESCODesc',
        },
        {
          id: 'nejm-dementia',
          titleKey: 'blogSalsaVsBachata_refNEJMTitle',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
          publisher: 'New England Journal of Medicine',
          year: '2003',
          descriptionKey: 'blogSalsaVsBachata_refNEJMDesc',
        },
        {
          id: 'harvard-calories',
          titleKey: 'blogSalsaVsBachata_refHarvardTitle',
          url: 'https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-for-people-of-three-different-weights',
          publisher: 'Harvard Health Publishing',
          year: '2021',
          descriptionKey: 'blogSalsaVsBachata_refHarvardDesc',
        },
        {
          id: 'frontiers-wellbeing',
          titleKey: 'blogSalsaVsBachata_refFrontiersTitle',
          url: 'https://www.frontiersin.org/articles/10.3389/fpsyg.2019.01221/full',
          publisher: 'Frontiers in Psychology',
          year: '2019',
          descriptionKey: 'blogSalsaVsBachata_refFrontiersDesc',
        },
        {
          id: 'sciencedirect-endorphins',
          titleKey: 'blogSalsaVsBachata_refEndorphinsTitle',
          url: 'https://www.sciencedirect.com/science/article/abs/pii/S1090513816300113',
          publisher: 'Evolution and Human Behavior',
          year: '2016',
          descriptionKey: 'blogSalsaVsBachata_refEndorphinsDesc',
        },
      ],
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/salsa-vs-bachata/hero.webp',
    srcSet:
      '/images/blog/salsa-vs-bachata/hero-480.webp 480w, /images/blog/salsa-vs-bachata/hero-960.webp 960w, /images/blog/salsa-vs-bachata/hero.webp 1200w',
    alt: "Salsa vs Bachata: ¿Qué estilo elegir? - Farray's Dance Center Barcelona",
    width: 1200,
    height: 630,
  },

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_tutoriales',
    categoryUrl: '/blog/tutoriales',
    currentKey: 'blogSalsaVsBachata_breadcrumbCurrent',
  },

  // === FAQ SECTION (8 FAQs for SEO Schema) ===
  faqSection: {
    enabled: true,
    titleKey: 'blogSalsaVsBachata_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogSalsaVsBachata_faq1Question',
        answerKey: 'blogSalsaVsBachata_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogSalsaVsBachata_faq2Question',
        answerKey: 'blogSalsaVsBachata_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogSalsaVsBachata_faq3Question',
        answerKey: 'blogSalsaVsBachata_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogSalsaVsBachata_faq4Question',
        answerKey: 'blogSalsaVsBachata_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogSalsaVsBachata_faq5Question',
        answerKey: 'blogSalsaVsBachata_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogSalsaVsBachata_faq6Question',
        answerKey: 'blogSalsaVsBachata_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogSalsaVsBachata_faq7Question',
        answerKey: 'blogSalsaVsBachata_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogSalsaVsBachata_faq8Question',
        answerKey: 'blogSalsaVsBachata_faq8Answer',
      },
    ],
  },

  // === RELATED ARTICLES ===
  relatedArticles: [
    {
      slug: 'salsa-ritmo-conquisto-mundo',
      category: 'tutoriales',
      titleKey: 'blogSalsaRitmo_title',
      excerptKey: 'blogSalsaRitmo_excerpt',
      image: '/images/blog/salsa-ritmo/hero.webp',
    },
    {
      slug: 'historia-bachata-barcelona',
      category: 'historia',
      titleKey: 'blogHistoriaBachata_title',
      excerptKey: 'blogHistoriaBachata_excerpt',
      image: '/images/blog/historia-bachata/hero.webp',
    },
    {
      slug: 'beneficios-bailar-salsa',
      category: 'lifestyle',
      titleKey: 'blogBeneficiosSalsa_title',
      excerptKey: 'blogBeneficiosSalsa_excerpt',
      image: '/images/blog/beneficios-salsa/hero.webp',
    },
  ],

  // === RELATED CLASSES (internal linking for SEO) ===
  relatedClasses: [
    'salsa-cubana-barcelona',
    'bachata-barcelona',
    'salsa-bachata-barcelona',
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

  // === SPEAKABLE (Voice Search GEO) ===
  speakableSelectors: [
    '#article-summary',
    '#intro',
    '#origenes',
    '#musica',
    '#baile',
    '#aprendizaje',
    '#beneficios',
    '#ambos',
    '#conclusion',
  ],
};
