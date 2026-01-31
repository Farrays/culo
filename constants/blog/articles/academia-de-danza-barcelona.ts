/**
 * Article Configuration: Academia de Danza en Barcelona - Guía Completa
 *
 * Enterprise SEO/GEO optimized article written in first person (Yunaisy voice).
 * Focuses on how to choose a professional dance academy with Método Farray.
 *
 * ENTERPRISE 10/10 - GEO Optimized with verified citations
 *
 * Category: Tips
 * Target Keywords: academia de danza en barcelona, academia de baile barcelona,
 *                  escuela de danza barcelona, centro de danza barcelona,
 *                  elegir academia de baile, método farray
 */

import type { BlogArticleConfig } from '../types';

export const ACADEMIA_DANZA_BARCELONA_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blogAcademiaDanza',
  slug: 'academia-de-danza-barcelona-guia-completa',
  category: 'tips',

  // === AUTHOR (E-E-A-T) ===
  authorId: 'yunaisy-farray',

  // === PILLAR/CLUSTER STRATEGY (2026 SEO) ===
  contentType: 'pillar',
  clusterSlugs: [
    'clases-baile-principiantes-barcelona-farrays',
    'como-perder-miedo-bailar',
    'salsa-vs-bachata-que-estilo-elegir',
  ],

  // === DATES ===
  datePublished: '2026-01-29',
  dateModified: '2026-01-29',

  // === READING METRICS ===
  readingTime: 12,
  wordCount: 2600,

  // === SUMMARY (GEO Optimized) ===
  summaryBullets: [
    'blogAcademiaDanza_summaryBullet1',
    'blogAcademiaDanza_summaryBullet2',
    'blogAcademiaDanza_summaryBullet3',
    'blogAcademiaDanza_summaryBullet4',
  ],

  // === KEY STATISTICS (Holographic Cards with GEO Citations) ===
  summaryStats: [
    {
      value: '1.73M',
      labelKey: 'blogAcademiaDanza_statPoblacionLabel',
      citation: {
        source: 'INE / Idealista',
        url: 'https://www.idealista.com/en/news/lifestyle-in-spain/2025/03/27/834965-what-is-the-population-of-barcelona-in-2025',
        year: '2025',
        authors: 'INE',
      },
    },
    {
      value: '274.636',
      labelKey: 'blogAcademiaDanza_statEixampleLabel',
      citation: {
        source: 'INE / Idealista',
        url: 'https://www.idealista.com/en/news/lifestyle-in-spain/2025/03/27/834965-what-is-the-population-of-barcelona-in-2025',
        year: '2025',
        authors: 'INE',
      },
    },
    {
      value: '48',
      labelKey: 'blogAcademiaDanza_statEstudiosLabel',
      citation: {
        source: 'Dance Research (Edinburgh University Press)',
        url: 'https://www.euppublishing.com/doi/10.3366/drs.2024.0432',
        year: '2024',
        authors: 'Dance Research systematic review',
      },
    },
    {
      value: '150h',
      labelKey: 'blogAcademiaDanza_statCIDLabel',
      citation: {
        source: 'International Dance Council (CID-UNESCO)',
        url: 'https://cid-world.org/certification/',
        year: '2019',
        authors: 'International Dance Council',
      },
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
      contentKey: 'blogAcademiaDanza_intro',
    },
    {
      id: 'intro-2',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_intro2',
    },

    // =====================================================
    // ANSWER CAPSULE 1: ¿Cómo elegir academia? (72% AI Citation)
    // =====================================================
    {
      id: 'answer-elegir',
      type: 'answer-capsule',
      contentKey: 'blogAcademiaDanza_answerElegir',
      answerCapsule: {
        questionKey: 'blogAcademiaDanza_answerElegirQ',
        answerKey: 'blogAcademiaDanza_answerElegirA',
        sourcePublisher: 'Experiencia directa de dirección académica - 20+ años',
        confidence: 'high',
        icon: 'star',
      },
    },

    // =====================================================
    // SECTION 1: ¿Qué es una academia profesional?
    // =====================================================
    {
      id: 'que-es-academia',
      type: 'heading',
      level: 2,
      contentKey: 'blogAcademiaDanza_section1Title',
    },
    {
      id: 'que-es-academia-content',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section1Content',
    },
    {
      id: 'que-es-academia-list',
      type: 'list',
      contentKey: 'blogAcademiaDanza_section1ListTitle',
      listItems: [
        'blogAcademiaDanza_list1Item1',
        'blogAcademiaDanza_list1Item2',
        'blogAcademiaDanza_list1Item3',
        'blogAcademiaDanza_list1Item4',
      ],
    },
    {
      id: 'que-es-academia-metodo',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section1Metodo',
    },

    // === DEFINITION: Academia de danza profesional ===
    {
      id: 'definition-academia',
      type: 'definition',
      contentKey: 'blogAcademiaDanza_defAcademia',
      definitionTermKey: 'blogAcademiaDanza_defAcademiaTerm',
    },

    // =====================================================
    // ANSWER CAPSULE 2: ¿Diferencia academia vs clases sueltas?
    // =====================================================
    {
      id: 'answer-diferencia',
      type: 'answer-capsule',
      contentKey: 'blogAcademiaDanza_answerDiferencia',
      answerCapsule: {
        questionKey: 'blogAcademiaDanza_answerDiferenciaQ',
        answerKey: 'blogAcademiaDanza_answerDiferenciaA',
        sourcePublisher: 'Experiencia con alumnos de otras escuelas',
        confidence: 'high',
        icon: 'lightbulb',
      },
    },

    // =====================================================
    // SECTION 2: Criterios para elegir
    // =====================================================
    {
      id: 'criterios',
      type: 'heading',
      level: 2,
      contentKey: 'blogAcademiaDanza_section2Title',
    },
    {
      id: 'criterios-intro',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section2Intro',
    },

    // Criterio 1: Formación profesores
    {
      id: 'criterio-profesores',
      type: 'heading',
      level: 3,
      contentKey: 'blogAcademiaDanza_criterio1Title',
    },
    {
      id: 'criterio-profesores-content',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_criterio1Content',
    },

    // Criterio 2: Método
    {
      id: 'criterio-metodo',
      type: 'heading',
      level: 3,
      contentKey: 'blogAcademiaDanza_criterio2Title',
    },
    {
      id: 'criterio-metodo-content',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_criterio2Content',
    },

    // Criterio 3: Niveles
    {
      id: 'criterio-niveles',
      type: 'heading',
      level: 3,
      contentKey: 'blogAcademiaDanza_criterio3Title',
    },
    {
      id: 'criterio-niveles-content',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_criterio3Content',
    },

    // Criterio 4: Variedad estilos
    {
      id: 'criterio-variedad',
      type: 'heading',
      level: 3,
      contentKey: 'blogAcademiaDanza_criterio4Title',
    },
    {
      id: 'criterio-variedad-content',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_criterio4Content',
    },

    // Criterio 5: Espacio
    {
      id: 'criterio-espacio',
      type: 'heading',
      level: 3,
      contentKey: 'blogAcademiaDanza_criterio5Title',
    },
    {
      id: 'criterio-espacio-content',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_criterio5Content',
    },

    // Criterio 6: Ubicación
    {
      id: 'criterio-ubicacion',
      type: 'heading',
      level: 3,
      contentKey: 'blogAcademiaDanza_criterio6Title',
    },
    {
      id: 'criterio-ubicacion-content',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_criterio6Content',
    },

    // === STATISTIC: Población Eixample ===
    {
      id: 'stat-eixample',
      type: 'statistic',
      contentKey: 'blogAcademiaDanza_statEixampleContent',
      statisticValue: '274.636',
      statisticSource: 'INE / Idealista, 2025',
    },

    // =====================================================
    // SECTION 3: Estilos de baile
    // =====================================================
    {
      id: 'estilos',
      type: 'heading',
      level: 2,
      contentKey: 'blogAcademiaDanza_section3Title',
    },
    {
      id: 'estilos-intro',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section3Intro',
    },
    {
      id: 'estilos-list',
      type: 'list',
      contentKey: 'blogAcademiaDanza_section3ListTitle',
      listItems: [
        'blogAcademiaDanza_estilo1',
        'blogAcademiaDanza_estilo2',
        'blogAcademiaDanza_estilo3',
      ],
    },
    {
      id: 'estilos-conclusion',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section3Conclusion',
    },

    // =====================================================
    // SECTION 4: Profesores - Escuela cubana
    // =====================================================
    {
      id: 'profesores',
      type: 'heading',
      level: 2,
      contentKey: 'blogAcademiaDanza_section4Title',
    },
    {
      id: 'profesores-intro',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section4Intro',
    },
    {
      id: 'profesores-list',
      type: 'list',
      contentKey: 'blogAcademiaDanza_section4ListTitle',
      listItems: [
        'blogAcademiaDanza_profesor1',
        'blogAcademiaDanza_profesor2',
        'blogAcademiaDanza_profesor3',
      ],
    },
    {
      id: 'profesores-conclusion',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section4Conclusion',
    },

    // === DEFINITION: Escuela cubana de danza ===
    {
      id: 'definition-escuela-cubana',
      type: 'definition',
      contentKey: 'blogAcademiaDanza_defEscuelaCubana',
      definitionTermKey: 'blogAcademiaDanza_defEscuelaCubanaTerm',
    },

    // =====================================================
    // SECTION 5: Método Farray
    // =====================================================
    {
      id: 'metodo-farray',
      type: 'heading',
      level: 2,
      contentKey: 'blogAcademiaDanza_section5Title',
    },
    {
      id: 'metodo-farray-intro',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section5Intro',
    },
    {
      id: 'metodo-farray-principios',
      type: 'numbered-list',
      contentKey: 'blogAcademiaDanza_section5PrincipiosTitle',
      listItems: [
        'blogAcademiaDanza_principio1',
        'blogAcademiaDanza_principio2',
        'blogAcademiaDanza_principio3',
      ],
    },
    {
      id: 'metodo-farray-conclusion',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section5Conclusion',
    },

    // === DEFINITION: Método Farray ===
    {
      id: 'definition-metodo-farray',
      type: 'definition',
      contentKey: 'blogAcademiaDanza_defMetodoFarray',
      definitionTermKey: 'blogAcademiaDanza_defMetodoFarrayTerm',
    },

    // =====================================================
    // ANSWER CAPSULE 3: ¿Qué sentir en primera visita?
    // =====================================================
    {
      id: 'answer-primera-visita',
      type: 'answer-capsule',
      contentKey: 'blogAcademiaDanza_answerPrimeraVisita',
      answerCapsule: {
        questionKey: 'blogAcademiaDanza_answerPrimeraVisitaQ',
        answerKey: 'blogAcademiaDanza_answerPrimeraVisitaA',
        sourcePublisher: 'Observación de cientos de primeras clases',
        confidence: 'high',
        icon: 'check',
      },
    },

    // =====================================================
    // SECTION 6: Comunidad de bailarines
    // =====================================================
    {
      id: 'comunidad',
      type: 'heading',
      level: 2,
      contentKey: 'blogAcademiaDanza_section6Title',
    },
    {
      id: 'comunidad-intro',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section6Intro',
    },
    {
      id: 'comunidad-list',
      type: 'list',
      contentKey: 'blogAcademiaDanza_section6ListTitle',
      listItems: [
        'blogAcademiaDanza_comunidad1',
        'blogAcademiaDanza_comunidad2',
        'blogAcademiaDanza_comunidad3',
      ],
    },
    {
      id: 'comunidad-conclusion',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section6Conclusion',
    },

    // =====================================================
    // SECTION 7: Ubicación en Barcelona
    // =====================================================
    {
      id: 'ubicacion-barcelona',
      type: 'heading',
      level: 2,
      contentKey: 'blogAcademiaDanza_section7Title',
    },
    {
      id: 'ubicacion-barcelona-content',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section7Content',
    },
    {
      id: 'ubicacion-barcelona-list',
      type: 'list',
      contentKey: 'blogAcademiaDanza_section7ListTitle',
      listItems: [
        'blogAcademiaDanza_ubicacion1',
        'blogAcademiaDanza_ubicacion2',
        'blogAcademiaDanza_ubicacion3',
      ],
    },
    {
      id: 'ubicacion-barcelona-conclusion',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_section7Conclusion',
    },

    // =====================================================
    // COMPARISON TABLE
    // =====================================================
    {
      id: 'tabla-comparativa',
      type: 'comparison-table',
      contentKey: 'blogAcademiaDanza_tablaTitle',
      tableConfig: {
        headers: [
          'blogAcademiaDanza_tablaHeader1',
          'blogAcademiaDanza_tablaHeader2',
          'blogAcademiaDanza_tablaHeader3',
        ],
        rows: [
          [
            'blogAcademiaDanza_tablaRow1Col1',
            'blogAcademiaDanza_tablaRow1Col2',
            'blogAcademiaDanza_tablaRow1Col3',
          ],
          [
            'blogAcademiaDanza_tablaRow2Col1',
            'blogAcademiaDanza_tablaRow2Col2',
            'blogAcademiaDanza_tablaRow2Col3',
          ],
          [
            'blogAcademiaDanza_tablaRow3Col1',
            'blogAcademiaDanza_tablaRow3Col2',
            'blogAcademiaDanza_tablaRow3Col3',
          ],
          [
            'blogAcademiaDanza_tablaRow4Col1',
            'blogAcademiaDanza_tablaRow4Col2',
            'blogAcademiaDanza_tablaRow4Col3',
          ],
          [
            'blogAcademiaDanza_tablaRow5Col1',
            'blogAcademiaDanza_tablaRow5Col2',
            'blogAcademiaDanza_tablaRow5Col3',
          ],
        ],
      },
    },

    // =====================================================
    // CONCLUSION
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogAcademiaDanza_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogAcademiaDanza_conclusionCTA',
    },

    // === CALLOUT TIP ===
    {
      id: 'callout-tip',
      type: 'callout',
      contentKey: 'blogAcademiaDanza_calloutTip',
      calloutType: 'tip',
    },

    // === CALLOUT CTA ===
    {
      id: 'callout-cta',
      type: 'callout',
      contentKey: 'blogAcademiaDanza_calloutCTA',
      calloutType: 'cta',
    },

    // =====================================================
    // REFERENCES SECTION (E-E-A-T)
    // =====================================================
    {
      id: 'references-section',
      type: 'references',
      contentKey: 'blogAcademiaDanza_referencesIntro',
      references: [
        {
          id: 'sports-medicine',
          titleKey: 'blogAcademiaDanza_ref1Title',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11127814/',
          publisher: 'Sports Medicine (Springer)',
          year: '2024',
          descriptionKey: 'blogAcademiaDanza_ref1Desc',
        },
        {
          id: 'dance-research',
          titleKey: 'blogAcademiaDanza_ref2Title',
          url: 'https://www.euppublishing.com/doi/10.3366/drs.2024.0432',
          publisher: 'Dance Research (Edinburgh University Press)',
          year: '2024',
          descriptionKey: 'blogAcademiaDanza_ref2Desc',
        },
        {
          id: 'frontiers-public-health',
          titleKey: 'blogAcademiaDanza_ref3Title',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12027262/',
          publisher: 'Frontiers in Public Health',
          year: '2025',
          descriptionKey: 'blogAcademiaDanza_ref3Desc',
        },
        {
          id: 'cid-certification',
          titleKey: 'blogAcademiaDanza_ref4Title',
          url: 'https://cid-world.org/certification/',
          publisher: 'International Dance Council (CID-UNESCO)',
          year: '2019',
          descriptionKey: 'blogAcademiaDanza_ref4Desc',
        },
        {
          id: 'cid-unesco',
          titleKey: 'blogAcademiaDanza_ref5Title',
          url: 'https://cid-world.org',
          publisher: 'International Dance Council',
          year: '2018',
          descriptionKey: 'blogAcademiaDanza_ref5Desc',
        },
        {
          id: 'ine-barcelona',
          titleKey: 'blogAcademiaDanza_ref6Title',
          url: 'https://www.idealista.com/en/news/lifestyle-in-spain/2025/03/27/834965-what-is-the-population-of-barcelona-in-2025',
          publisher: 'Idealista / INE',
          year: '2025',
          descriptionKey: 'blogAcademiaDanza_ref6Desc',
        },
        {
          id: 'ena-cuba',
          titleKey: 'blogAcademiaDanza_ref7Title',
          url: 'https://es.wikipedia.org/wiki/Escuela_Nacional_de_Arte_(Cuba)',
          publisher: 'Wikipedia / Fuentes estatales cubanas',
          year: '2018',
          descriptionKey: 'blogAcademiaDanza_ref7Desc',
        },
      ],
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/academia-danza-barcelona/hero.webp',
    srcSet:
      '/images/blog/academia-danza-barcelona/hero-480.webp 480w, /images/blog/academia-danza-barcelona/hero-960.webp 960w, /images/blog/academia-danza-barcelona/hero.webp 1200w',
    alt: 'Interior de academia de danza profesional en Barcelona con alumnos practicando diferentes estilos bajo la guía de profesores formados en la escuela cubana',
    altKey: 'blogAcademiaDanza_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/academia-danza-barcelona/og.jpg',

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_tips',
    categoryUrl: '/blog/tips',
    currentKey: 'blogAcademiaDanza_breadcrumbCurrent',
  },

  // === FAQ SECTION (8 FAQs for SEO Schema) ===
  faqSection: {
    enabled: true,
    titleKey: 'blogAcademiaDanza_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogAcademiaDanza_faq1Question',
        answerKey: 'blogAcademiaDanza_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogAcademiaDanza_faq2Question',
        answerKey: 'blogAcademiaDanza_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogAcademiaDanza_faq3Question',
        answerKey: 'blogAcademiaDanza_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogAcademiaDanza_faq4Question',
        answerKey: 'blogAcademiaDanza_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogAcademiaDanza_faq5Question',
        answerKey: 'blogAcademiaDanza_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogAcademiaDanza_faq6Question',
        answerKey: 'blogAcademiaDanza_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogAcademiaDanza_faq7Question',
        answerKey: 'blogAcademiaDanza_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogAcademiaDanza_faq8Question',
        answerKey: 'blogAcademiaDanza_faq8Answer',
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
    {
      slug: 'salsa-vs-bachata-que-estilo-elegir',
      category: 'tips',
      titleKey: 'blogSalsaVsBachata_title',
      excerptKey: 'blogSalsaVsBachata_excerpt',
      image: '/images/blog/salsa-vs-bachata/hero.webp',
    },
  ],

  // === RELATED CLASSES (internal linking for SEO) ===
  relatedClasses: [
    'salsa-cubana-barcelona',
    'bachata-barcelona',
    'contemporaneo-barcelona',
    'heels-barcelona',
    'clases-particulares-baile',
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
    '#answer-elegir',
    '#que-es-academia',
    '#criterios',
    '#metodo-farray',
    '#comunidad',
    '#conclusion',
  ],

  // === LOCAL BUSINESS SCHEMA (Local SEO) ===
  localBusinessSchema: {
    enabled: true,
  },

  // === AGGREGATE RATING SCHEMA (Rich Snippets) ===
  aggregateRatingSchema: {
    enabled: true,
    ratingValue: 4.9,
    reviewCount: 187,
    bestRating: 5,
    worstRating: 1,
  },

  // === GOOGLE DISCOVER OPTIMIZATION ===
  discoverOptimized: true,
};
