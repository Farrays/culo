/**
 * Article Configuration: Ballet para Adultos Barcelona
 *
 * Artículo sobre ballet para adultos en Barcelona, escrito desde la perspectiva
 * de Daniel Sené, profesor formado en la Escuela Nacional de Ballet de Cuba.
 *
 * Category: Tips
 * Type: Guía informativa con enfoque E-E-A-T
 *
 * Referencias principales:
 * - Journal of Dance Medicine & Science
 * - New England Journal of Medicine
 * - Royal Academy of Dance
 * - Escuela Nacional de Ballet de Cuba
 */

import type { BlogArticleConfig } from '../types';

export const BALLET_ADULTOS_BARCELONA_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blogBalletAdultos',
  slug: 'ballet-para-adultos-barcelona',
  category: 'tips',

  // === AUTHOR (E-E-A-T) ===
  authorId: 'daniel-sene',

  // === PILLAR/CLUSTER STRATEGY (2026 SEO) ===
  contentType: 'pillar',
  clusterSlugs: ['clases-baile-principiantes-barcelona-farrays', 'como-perder-miedo-bailar'],

  // === DATES ===
  datePublished: '2026-01-29',
  dateModified: '2026-01-29',

  // === READING METRICS ===
  readingTime: 12,
  wordCount: 2600,

  // === SUMMARY BOX (GEO Critical) ===
  summaryBullets: [
    'blogBalletAdultos_summaryBullet1',
    'blogBalletAdultos_summaryBullet2',
    'blogBalletAdultos_summaryBullet3',
    'blogBalletAdultos_summaryBullet4',
  ],

  // === KEY STATISTICS (Holographic Cards) ===
  summaryStats: [
    {
      value: '46%',
      labelKey: 'blogBalletAdultos_statCardioLabel',
      citation: {
        source: 'American Journal of Preventive Medicine',
        url: 'https://www.theballetacademy.com.sg/post/5-health-benefits-of-ballet-for-adults',
        year: '2016',
        authors: 'Merom et al.',
      },
    },
    {
      value: '76%',
      labelKey: 'blogBalletAdultos_statDementiaLabel',
      citation: {
        source: 'New England Journal of Medicine',
        url: 'https://www.balletpodiatry.com/articles/ballets-hidden-secrets-to-aging-well',
        year: '2003',
        authors: 'Verghese et al.',
      },
    },
    {
      value: '82%',
      labelKey: 'blogBalletAdultos_statInjuryLabel',
      citation: {
        source: 'Journal of Dance Medicine & Science',
        url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7388110/',
        year: '2020',
        authors: 'Vera et al.',
      },
    },
    {
      value: '1,7M',
      labelKey: 'blogBalletAdultos_statBarcelonaLabel',
      citation: {
        source: 'INE',
        url: 'https://www.idealista.com/en/news/lifestyle-in-spain/2025/03/27/834965-what-is-the-population-of-barcelona-in-2025',
        year: '2025',
        authors: 'INE',
      },
    },
  ],

  // === CONTENT SECTIONS ===
  sections: [
    // --- INTRO ---
    {
      id: 'intro',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_intro',
    },
    {
      id: 'intro-2',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_intro2',
    },

    // --- ANSWER CAPSULE 1: ¿Se puede empezar ballet de adulto? ---
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blogBalletAdultos_answerCapsule1',
      answerCapsule: {
        questionKey: 'blogBalletAdultos_answerQuestion1',
        answerKey: 'blogBalletAdultos_answerText1',
        confidence: 'high',
        icon: 'check',
      },
    },

    // --- SECTION 1: ¿Se puede empezar ballet de adulto? ---
    {
      id: 'empezar-adulto',
      type: 'heading',
      level: 2,
      contentKey: 'blogBalletAdultos_section1Title',
    },
    {
      id: 'empezar-adulto-content',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section1Content',
    },
    {
      id: 'empezar-adulto-content-2',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section1Content2',
    },

    // --- ANSWER CAPSULE 2: ¿A qué edad es tarde? ---
    {
      id: 'answer-capsule-2',
      type: 'answer-capsule',
      contentKey: 'blogBalletAdultos_answerCapsule2',
      answerCapsule: {
        questionKey: 'blogBalletAdultos_answerQuestion2',
        answerKey: 'blogBalletAdultos_answerText2',
        confidence: 'high',
        icon: 'lightbulb',
      },
    },

    // --- SECTION 2: Beneficios del ballet para adultos ---
    {
      id: 'beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogBalletAdultos_section2Title',
    },
    {
      id: 'beneficios-content',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section2Content',
    },

    // --- Subsection: Beneficios físicos ---
    {
      id: 'beneficios-fisicos',
      type: 'heading',
      level: 3,
      contentKey: 'blogBalletAdultos_section2aTitle',
    },
    {
      id: 'beneficios-fisicos-postura',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section2aPostura',
    },
    {
      id: 'beneficios-fisicos-fuerza',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section2aFuerza',
    },
    {
      id: 'beneficios-fisicos-equilibrio',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section2aEquilibrio',
    },
    {
      id: 'beneficios-fisicos-flexibilidad',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section2aFlexibilidad',
    },

    // --- Subsection: Beneficios mentales ---
    {
      id: 'beneficios-mentales',
      type: 'heading',
      level: 3,
      contentKey: 'blogBalletAdultos_section2bTitle',
    },
    {
      id: 'beneficios-mentales-memoria',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section2bMemoria',
    },
    {
      id: 'beneficios-mentales-estres',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section2bEstres',
    },
    {
      id: 'beneficios-mentales-conclusion',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section2bConclusion',
    },

    // --- ANSWER CAPSULE 3: Beneficios ---
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blogBalletAdultos_answerCapsule3',
      answerCapsule: {
        questionKey: 'blogBalletAdultos_answerQuestion3',
        answerKey: 'blogBalletAdultos_answerText3',
        confidence: 'verified',
        icon: 'star',
      },
    },

    // --- SECTION 3: Qué esperar en tu primera clase ---
    {
      id: 'primera-clase',
      type: 'heading',
      level: 2,
      contentKey: 'blogBalletAdultos_section3Title',
    },
    {
      id: 'primera-clase-content',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section3Content',
    },
    {
      id: 'primera-clase-barra',
      type: 'list',
      contentKey: 'blogBalletAdultos_barraTitle',
      listItems: [
        'blogBalletAdultos_barraItem1',
        'blogBalletAdultos_barraItem2',
        'blogBalletAdultos_barraItem3',
      ],
    },
    {
      id: 'primera-clase-centro',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_centroContent',
    },
    {
      id: 'primera-clase-centro-lista',
      type: 'list',
      contentKey: 'blogBalletAdultos_centroTitle',
      listItems: [
        'blogBalletAdultos_centroItem1',
        'blogBalletAdultos_centroItem2',
        'blogBalletAdultos_centroItem3',
      ],
    },
    {
      id: 'primera-clase-que-llevar',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_queLlevar',
    },
    {
      id: 'primera-clase-que-llevar-lista',
      type: 'list',
      contentKey: 'blogBalletAdultos_queLlevarTitle',
      listItems: [
        'blogBalletAdultos_queLlevarItem1',
        'blogBalletAdultos_queLlevarItem2',
        'blogBalletAdultos_queLlevarItem3',
      ],
    },
    {
      id: 'primera-clase-conclusion',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section3Conclusion',
    },

    // --- SECTION 4: Ballet clásico vs ballet fitness ---
    {
      id: 'ballet-vs-fitness',
      type: 'heading',
      level: 2,
      contentKey: 'blogBalletAdultos_section4Title',
    },
    {
      id: 'ballet-vs-fitness-content',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section4Content',
    },

    // --- Comparison Table ---
    {
      id: 'comparison-table',
      type: 'comparison-table',
      contentKey: 'blogBalletAdultos_comparisonTableTitle',
      tableConfig: {
        headers: [
          'blogBalletAdultos_tableHeaderAspecto',
          'blogBalletAdultos_tableHeaderClasico',
          'blogBalletAdultos_tableHeaderFitness',
        ],
        rows: [
          [
            'blogBalletAdultos_tableRowObjetivo',
            'blogBalletAdultos_tableClasicoObjetivo',
            'blogBalletAdultos_tableFitnessObjetivo',
          ],
          [
            'blogBalletAdultos_tableRowEstructura',
            'blogBalletAdultos_tableClasicoEstructura',
            'blogBalletAdultos_tableFitnessEstructura',
          ],
          [
            'blogBalletAdultos_tableRowFormacion',
            'blogBalletAdultos_tableClasicoFormacion',
            'blogBalletAdultos_tableFitnessFormacion',
          ],
          [
            'blogBalletAdultos_tableRowProgresion',
            'blogBalletAdultos_tableClasicoProgresion',
            'blogBalletAdultos_tableFitnessProgresion',
          ],
          [
            'blogBalletAdultos_tableRowPuntas',
            'blogBalletAdultos_tableClasicoPuntas',
            'blogBalletAdultos_tableFitnessPuntas',
          ],
          [
            'blogBalletAdultos_tableRowEnfoque',
            'blogBalletAdultos_tableClasicoEnfoque',
            'blogBalletAdultos_tableFitnessEnfoque',
          ],
          [
            'blogBalletAdultos_tableRowIdeal',
            'blogBalletAdultos_tableClasicoIdeal',
            'blogBalletAdultos_tableFitnessIdeal',
          ],
        ],
        highlightColumn: 1,
      },
    },

    // --- SECTION 5: Mitos sobre empezar ballet de adulto ---
    {
      id: 'mitos',
      type: 'heading',
      level: 2,
      contentKey: 'blogBalletAdultos_section5Title',
    },
    {
      id: 'mitos-content',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section5Content',
    },
    {
      id: 'mitos-lista',
      type: 'list',
      contentKey: 'blogBalletAdultos_mitosListaTitle',
      listItems: [
        'blogBalletAdultos_mitoItem1',
        'blogBalletAdultos_mitoItem2',
        'blogBalletAdultos_mitoItem3',
        'blogBalletAdultos_mitoItem4',
      ],
    },

    // --- DEFINITIONS ---
    {
      id: 'definicion-ballet-adultos',
      type: 'definition',
      definitionTermKey: 'blogBalletAdultos_defTerm1',
      contentKey: 'blogBalletAdultos_defContent1',
    },
    {
      id: 'definicion-barre',
      type: 'definition',
      definitionTermKey: 'blogBalletAdultos_defTerm2',
      contentKey: 'blogBalletAdultos_defContent2',
    },
    {
      id: 'definicion-plies',
      type: 'definition',
      definitionTermKey: 'blogBalletAdultos_defTerm3',
      contentKey: 'blogBalletAdultos_defContent3',
    },

    // --- SECTION 6: Cómo elegir una escuela de ballet ---
    {
      id: 'elegir-escuela',
      type: 'heading',
      level: 2,
      contentKey: 'blogBalletAdultos_section6Title',
    },
    {
      id: 'elegir-escuela-content',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section6Content',
    },
    {
      id: 'elegir-escuela-formacion',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section6Formacion',
    },
    {
      id: 'elegir-escuela-metodologia',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section6Metodologia',
    },
    {
      id: 'elegir-escuela-grupos',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section6Grupos',
    },
    {
      id: 'elegir-escuela-ubicacion',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section6Ubicacion',
    },
    {
      id: 'elegir-escuela-objetivos',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section6Objetivos',
    },
    {
      id: 'elegir-escuela-farrays',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_section6Farrays',
    },

    // --- TIP CALLOUT ---
    {
      id: 'tip-daniel',
      type: 'callout',
      calloutType: 'tip',
      contentKey: 'blogBalletAdultos_tipDaniel',
    },

    // --- CTA CALLOUT ---
    {
      id: 'cta-clases',
      type: 'callout',
      calloutType: 'cta',
      contentKey: 'blogBalletAdultos_ctaClases',
    },

    // --- CONCLUSIÓN ---
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogBalletAdultos_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogBalletAdultos_conclusionContent',
    },

    // --- REFERENCIAS (E-E-A-T) ---
    {
      id: 'referencias',
      type: 'references',
      contentKey: 'blogBalletAdultos_referencesIntro',
      references: [
        {
          id: 'ref-sports-medicine',
          titleKey: 'blogBalletAdultos_refSportsMedTitle',
          url: 'https://pubmed.ncbi.nlm.nih.gov/38270792/',
          publisher: 'Sports Medicine',
          year: '2024',
          descriptionKey: 'blogBalletAdultos_refSportsMedDesc',
        },
        {
          id: 'ref-dance-research',
          titleKey: 'blogBalletAdultos_refDanceResearchTitle',
          url: 'https://www.euppublishing.com/doi/10.3366/drs.2024.0432',
          publisher: 'Dance Research',
          year: '2024',
          descriptionKey: 'blogBalletAdultos_refDanceResearchDesc',
        },
        {
          id: 'ref-injury-prevention',
          titleKey: 'blogBalletAdultos_refInjuryTitle',
          url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7388110/',
          publisher: 'Journal of Dance Medicine & Science',
          year: '2020',
          descriptionKey: 'blogBalletAdultos_refInjuryDesc',
        },
        {
          id: 'ref-ballet-academy',
          titleKey: 'blogBalletAdultos_refBalletAcademyTitle',
          url: 'https://www.theballetacademy.com.sg/post/5-health-benefits-of-ballet-for-adults',
          publisher: 'The Ballet Academy Singapore',
          year: '2024',
          descriptionKey: 'blogBalletAdultos_refBalletAcademyDesc',
        },
        {
          id: 'ref-ballet-podiatry',
          titleKey: 'blogBalletAdultos_refBalletPodiatryTitle',
          url: 'https://www.balletpodiatry.com/articles/ballets-hidden-secrets-to-aging-well',
          publisher: 'Ballet Podiatry',
          year: '2025',
          descriptionKey: 'blogBalletAdultos_refBalletPodiatryDesc',
        },
        {
          id: 'ref-rad',
          titleKey: 'blogBalletAdultos_refRADTitle',
          url: 'https://www.royalacademyofdance.org/dance-classes/dance-school-in-london/adult-classes/',
          publisher: 'Royal Academy of Dance',
          year: '2026',
          descriptionKey: 'blogBalletAdultos_refRADDesc',
        },
        {
          id: 'ref-ena-cuba',
          titleKey: 'blogBalletAdultos_refENATitle',
          url: 'https://es.wikipedia.org/wiki/Escuela_Nacional_de_Arte_(Cuba)',
          publisher: 'Wikipedia',
          year: '2018',
          descriptionKey: 'blogBalletAdultos_refENADesc',
        },
      ],
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/ballet-adultos/hero.webp',
    srcSet:
      '/images/blog/ballet-adultos/hero-480.webp 480w, /images/blog/ballet-adultos/hero-960.webp 960w, /images/blog/ballet-adultos/hero.webp 1200w',
    alt: "Adultos practicando ballet en la barra en una clase de Farray's Center Barcelona, mostrando técnica clásica adaptada a cuerpos adultos",
    altKey: 'blogBalletAdultos_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/ballet-adultos/og.jpg',

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_tips',
    categoryUrl: '/blog/tips',
    currentKey: 'blogBalletAdultos_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blogBalletAdultos_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogBalletAdultos_faq1Question',
        answerKey: 'blogBalletAdultos_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogBalletAdultos_faq2Question',
        answerKey: 'blogBalletAdultos_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogBalletAdultos_faq3Question',
        answerKey: 'blogBalletAdultos_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogBalletAdultos_faq4Question',
        answerKey: 'blogBalletAdultos_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogBalletAdultos_faq5Question',
        answerKey: 'blogBalletAdultos_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogBalletAdultos_faq6Question',
        answerKey: 'blogBalletAdultos_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogBalletAdultos_faq7Question',
        answerKey: 'blogBalletAdultos_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogBalletAdultos_faq8Question',
        answerKey: 'blogBalletAdultos_faq8Answer',
      },
    ],
  },

  // === RELATED ARTICLES ===
  relatedArticles: [
    {
      slug: 'academia-de-danza-barcelona-guia-completa',
      category: 'tips',
      titleKey: 'blogAcademiaDanza_title',
      excerptKey: 'blogAcademiaDanza_excerpt',
      image: '/images/blog/academia-danza-barcelona/hero.webp',
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
    'ballet-barcelona',
    'contemporaneo-barcelona',
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
    courseNameKey: 'blogBalletAdultos_courseSchemaName',
    courseDescriptionKey: 'blogBalletAdultos_courseSchemaDesc',
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
    '#definicion-ballet-adultos',
    '#intro',
    '#conclusion',
  ],

  // === GOOGLE DISCOVER ===
  discoverOptimized: true,
};
