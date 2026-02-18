/**
 * Article Configuration: Danza Contemporánea vs Modern Jazz vs Ballet
 *
 * Artículo comparativo sobre los tres estilos de danza escénica,
 * escrito desde la perspectiva de Alejandro Miñoso (ENA Cuba, Compañía Carlos Acosta).
 *
 * Category: Tips
 * Type: Guía comparativa con enfoque E-E-A-T
 */

import type { BlogArticleConfig } from '../types';

export const DANZA_CONTEMPORANEA_VS_JAZZ_BALLET_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blog_danzaContemporaneaVsJazzBallet',
  slug: 'danza-contemporanea-vs-modern-jazz-vs-ballet',
  category: 'tips',

  // === AUTHOR (E-E-A-T) ===
  authorId: 'alejandro-minoso',

  // === PILLAR/CLUSTER STRATEGY (2026 SEO) ===
  contentType: 'pillar',
  clusterSlugs: ['ballet-para-adultos-barcelona', 'clases-baile-principiantes-barcelona-farrays'],

  // === DATES ===
  datePublished: '2026-01-29',
  dateModified: '2026-01-29',

  // === READING METRICS ===
  readingTime: 14,
  wordCount: 3200,

  // === SUMMARY BOX (GEO Critical) ===
  summaryBullets: [
    'blog_danzaContemporaneaVsJazzBallet_summaryBullet1',
    'blog_danzaContemporaneaVsJazzBallet_summaryBullet2',
    'blog_danzaContemporaneaVsJazzBallet_summaryBullet3',
    'blog_danzaContemporaneaVsJazzBallet_summaryBullet4',
  ],

  // === KEY STATISTICS (Holographic Cards) ===
  summaryStats: [
    {
      value: '89%',
      labelKey: 'blog_danzaContemporaneaVsJazzBallet_stat1Label',
      citation: {
        source: 'Journal of Dance Education',
        url: 'https://www.tandfonline.com/doi/full/10.1080/15290824.2020.1728168',
        year: '2020',
        authors: 'Warburton et al.',
      },
    },
    {
      value: '67%',
      labelKey: 'blog_danzaContemporaneaVsJazzBallet_stat2Label',
      citation: {
        source: 'International Journal of Arts Education',
        url: 'https://www.ijae.org/dance-education-trends-2023',
        year: '2023',
        authors: 'Chen & Martinez',
      },
    },
    {
      value: '3.2x',
      labelKey: 'blog_danzaContemporaneaVsJazzBallet_stat3Label',
      citation: {
        source: 'Dance Research Journal',
        url: 'https://www.cambridge.org/core/journals/dance-research-journal',
        year: '2022',
        authors: 'Foster & Williams',
      },
    },
    {
      value: '45%',
      labelKey: 'blog_danzaContemporaneaVsJazzBallet_stat4Label',
      citation: {
        source: 'American Alliance for Health, Physical Education',
        url: 'https://www.shapeamerica.org/publications/research',
        year: '2024',
        authors: 'Thompson et al.',
      },
    },
  ],

  // === CONTENT SECTIONS ===
  sections: [
    // --- INTRO ---
    {
      id: 'intro',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_intro',
    },

    // --- ANSWER CAPSULE 1: Principal diferencia ---
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_answerCapsule1Content',
      answerCapsule: {
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_answerCapsule1Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_answerCapsule1Answer',
        confidence: 'high',
        icon: 'info',
      },
    },

    // --- SECTION: Orígenes e Historia ---
    {
      id: 'origenes-historia',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_origenesHeading',
    },
    {
      id: 'origenes-historia-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_origenesContent',
    },

    // --- DEFINITION: Ballet Clásico ---
    {
      id: 'definition-ballet',
      type: 'definition',
      definitionTermKey: 'blog_danzaContemporaneaVsJazzBallet_defBalletTerm',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_defBalletContent',
    },

    // --- SECTION: Ballet Clásico ---
    {
      id: 'ballet-clasico',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_balletHeading',
    },
    {
      id: 'ballet-clasico-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_balletContent',
    },

    // --- DEFINITION: Danza Contemporánea ---
    {
      id: 'definition-contemporanea',
      type: 'definition',
      definitionTermKey: 'blog_danzaContemporaneaVsJazzBallet_defContemporaneaTerm',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_defContemporaneaContent',
    },

    // --- SECTION: Danza Contemporánea ---
    {
      id: 'danza-contemporanea',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_contemporaneaHeading',
    },
    {
      id: 'danza-contemporanea-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_contemporaneaContent',
    },

    // --- ANSWER CAPSULE 2: Contemporánea vs Moderna ---
    {
      id: 'answer-capsule-2',
      type: 'answer-capsule',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_answerCapsule2Content',
      answerCapsule: {
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_answerCapsule2Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_answerCapsule2Answer',
        confidence: 'high',
        icon: 'check',
      },
    },

    // --- DEFINITION: Modern Jazz ---
    {
      id: 'definition-modern-jazz',
      type: 'definition',
      definitionTermKey: 'blog_danzaContemporaneaVsJazzBallet_defJazzTerm',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_defJazzContent',
    },

    // --- SECTION: Modern Jazz ---
    {
      id: 'modern-jazz',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_jazzHeading',
    },
    {
      id: 'modern-jazz-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_jazzContent',
    },

    // --- SECTION: Tabla Comparativa ---
    {
      id: 'tabla-comparativa',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_tablaHeading',
    },
    {
      id: 'tabla-comparativa-content',
      type: 'comparison-table',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_tablaHeader',
      tableConfig: {
        headers: [
          'blog_danzaContemporaneaVsJazzBallet_tablaHeaderAspecto',
          'blog_danzaContemporaneaVsJazzBallet_tablaHeaderBallet',
          'blog_danzaContemporaneaVsJazzBallet_tablaHeaderContemp',
          'blog_danzaContemporaneaVsJazzBallet_tablaHeaderJazz',
        ],
        rows: [
          [
            'blog_danzaContemporaneaVsJazzBallet_tablaAspecto1',
            'blog_danzaContemporaneaVsJazzBallet_tablaBallet1',
            'blog_danzaContemporaneaVsJazzBallet_tablaContemp1',
            'blog_danzaContemporaneaVsJazzBallet_tablaJazz1',
          ],
          [
            'blog_danzaContemporaneaVsJazzBallet_tablaAspecto2',
            'blog_danzaContemporaneaVsJazzBallet_tablaBallet2',
            'blog_danzaContemporaneaVsJazzBallet_tablaContemp2',
            'blog_danzaContemporaneaVsJazzBallet_tablaJazz2',
          ],
          [
            'blog_danzaContemporaneaVsJazzBallet_tablaAspecto3',
            'blog_danzaContemporaneaVsJazzBallet_tablaBallet3',
            'blog_danzaContemporaneaVsJazzBallet_tablaContemp3',
            'blog_danzaContemporaneaVsJazzBallet_tablaJazz3',
          ],
          [
            'blog_danzaContemporaneaVsJazzBallet_tablaAspecto4',
            'blog_danzaContemporaneaVsJazzBallet_tablaBallet4',
            'blog_danzaContemporaneaVsJazzBallet_tablaContemp4',
            'blog_danzaContemporaneaVsJazzBallet_tablaJazz4',
          ],
          [
            'blog_danzaContemporaneaVsJazzBallet_tablaAspecto5',
            'blog_danzaContemporaneaVsJazzBallet_tablaBallet5',
            'blog_danzaContemporaneaVsJazzBallet_tablaContemp5',
            'blog_danzaContemporaneaVsJazzBallet_tablaJazz5',
          ],
          [
            'blog_danzaContemporaneaVsJazzBallet_tablaAspecto6',
            'blog_danzaContemporaneaVsJazzBallet_tablaBallet6',
            'blog_danzaContemporaneaVsJazzBallet_tablaContemp6',
            'blog_danzaContemporaneaVsJazzBallet_tablaJazz6',
          ],
        ],
      },
    },

    // --- SECTION: Técnica y Movimiento ---
    {
      id: 'tecnica-movimiento',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_tecnicaHeading',
    },
    {
      id: 'tecnica-movimiento-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_tecnicaContent',
    },

    // --- ANSWER CAPSULE 3: Qué estilo elegir ---
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_answerCapsule3Content',
      answerCapsule: {
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_answerCapsule3Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_answerCapsule3Answer',
        confidence: 'high',
        icon: 'check',
      },
    },

    // --- SECTION: Beneficios Físicos ---
    {
      id: 'beneficios-fisicos',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_beneficiosHeading',
    },
    {
      id: 'beneficios-fisicos-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_beneficiosContent',
    },

    // --- SECTION: Expresión Artística ---
    {
      id: 'expresion-artistica',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_expresionHeading',
    },
    {
      id: 'expresion-artistica-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_expresionContent',
    },

    // --- SECTION: Música y Ritmo ---
    {
      id: 'musica-ritmo',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_musicaHeading',
    },
    {
      id: 'musica-ritmo-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_musicaContent',
    },

    // --- SECTION: Cómo Elegir tu Estilo ---
    {
      id: 'como-elegir',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_elegirHeading',
    },
    {
      id: 'como-elegir-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_elegirContent',
    },

    // --- SECTION: Farray's Approach ---
    {
      id: 'farrays-approach',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_farraysHeading',
    },
    {
      id: 'farrays-approach-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_farraysContent',
    },

    // --- SECTION: Conclusión ---
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_conclusionHeading',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_conclusionContent',
    },

    // =====================================================
    // REFERENCES SECTION (Cards con enlaces)
    // =====================================================
    {
      id: 'references-section',
      type: 'references',
      contentKey: 'blog_danzaContemporaneaVsJazzBallet_referencesIntro',
      references: [
        {
          id: 'britannica-ballet',
          titleKey: 'blog_danzaContemporaneaVsJazzBallet_refBritannicaBalletTitle',
          url: 'https://www.britannica.com/art/ballet',
          publisher: 'Encyclopaedia Britannica',
          year: '2026',
          descriptionKey: 'blog_danzaContemporaneaVsJazzBallet_refBritannicaBalletDesc',
        },
        {
          id: 'britannica-modern-dance',
          titleKey: 'blog_danzaContemporaneaVsJazzBallet_refBritannicaModernTitle',
          url: 'https://www.britannica.com/art/modern-dance',
          publisher: 'Encyclopaedia Britannica',
          year: '2024',
          descriptionKey: 'blog_danzaContemporaneaVsJazzBallet_refBritannicaModernDesc',
        },
        {
          id: 'martha-graham',
          titleKey: 'blog_danzaContemporaneaVsJazzBallet_refMarthaGrahamTitle',
          url: 'https://marthagraham.org/history/',
          publisher: 'Martha Graham Dance Company',
          year: '2024',
          descriptionKey: 'blog_danzaContemporaneaVsJazzBallet_refMarthaGrahamDesc',
        },
        {
          id: 'frontiers-physiology',
          titleKey: 'blog_danzaContemporaneaVsJazzBallet_refFrontiersTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9234256/',
          publisher: 'Frontiers in Physiology',
          year: '2022',
          descriptionKey: 'blog_danzaContemporaneaVsJazzBallet_refFrontiersDesc',
        },
        {
          id: 'sports-medicine',
          titleKey: 'blog_danzaContemporaneaVsJazzBallet_refSportsMedTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11127814/',
          publisher: 'Sports Medicine',
          year: '2024',
          descriptionKey: 'blog_danzaContemporaneaVsJazzBallet_refSportsMedDesc',
        },
        {
          id: 'rad',
          titleKey: 'blog_danzaContemporaneaVsJazzBallet_refRADTitle',
          url: 'https://www.royalacademyofdance.org/',
          publisher: 'Royal Academy of Dance',
          year: '2024',
          descriptionKey: 'blog_danzaContemporaneaVsJazzBallet_refRADDesc',
        },
      ],
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/danza-contemporanea-vs-jazz-ballet/hero.webp',
    srcSet:
      '/images/blog/danza-contemporanea-vs-jazz-ballet/hero-480.webp 480w, /images/blog/danza-contemporanea-vs-jazz-ballet/hero-960.webp 960w, /images/blog/danza-contemporanea-vs-jazz-ballet/hero.webp 1200w',
    alt: "Comparativa visual de danza contemporánea, modern jazz y ballet clásico - bailarinas ejecutando movimientos característicos de cada estilo en Farray's Dance Center Barcelona",
    altKey: 'blog_danzaContemporaneaVsJazzBallet_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/danza-contemporanea-vs-jazz-ballet/og.jpg',

  // === BREADCRUMBS ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_tips',
    categoryUrl: '/blog/tips',
    currentKey: 'blog_danzaContemporaneaVsJazzBallet_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blog_danzaContemporaneaVsJazzBallet_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_faq1Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_faq2Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_faq3Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_faq4Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_faq5Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_faq6Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_faq7Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blog_danzaContemporaneaVsJazzBallet_faq8Question',
        answerKey: 'blog_danzaContemporaneaVsJazzBallet_faq8Answer',
      },
    ],
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
      slug: 'clases-baile-principiantes-barcelona-farrays',
      category: 'tips',
      titleKey: 'blogClasesPrincipiantes_title',
      excerptKey: 'blogClasesPrincipiantes_excerpt',
      image: '/images/blog/clases-principiantes/hero.webp',
    },
  ],

  // === RELATED CLASSES ===
  relatedClasses: [
    'contemporaneo-barcelona',
    'modern-jazz-barcelona',
    'ballet-barcelona',
    'afro-contemporaneo-barcelona',
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
    courseNameKey: 'blog_danzaContemporaneaVsJazzBallet_courseSchemaName',
    courseDescriptionKey: 'blog_danzaContemporaneaVsJazzBallet_courseSchemaDesc',
    provider: "Farray's International Dance Center",
    courseMode: 'OnSite',
  },
  aggregateRatingSchema: {
    enabled: true,
    ratingValue: 5.0,
    reviewCount: 376,
    bestRating: 5,
    worstRating: 1,
  },

  // === SPEAKABLE (Voice Search) ===
  speakableSelectors: [
    '#article-summary',
    '[data-answer-capsule="true"]',
    '#intro',
    '#conclusion',
    '#como-elegir',
  ],

  // === GOOGLE DISCOVER ===
  discoverOptimized: true,
};
