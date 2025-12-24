/**
 * Article Configuration: Salsa - El Ritmo que Conquistó el Mundo
 *
 * Premium SEO-optimized article with GEO citability, internal links,
 * and comprehensive educational content about salsa dance styles.
 *
 * Category: Tutoriales
 * Target Keywords: salsa baile, estilos salsa, rueda casino, salsa cubana,
 *                  salsa barcelona, aprender salsa, clases salsa
 */

import type { BlogArticleConfig } from '../types';

export const SALSA_RITMO_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blogSalsaRitmo',
  slug: 'salsa-ritmo-conquisto-mundo',
  category: 'tutoriales',

  // === DATES ===
  datePublished: '2025-01-20',
  dateModified: '2025-01-20',

  // === READING METRICS ===
  readingTime: 10,
  wordCount: 2400,

  // === SUMMARY (GEO Optimized) ===
  summaryBullets: [
    'blogSalsaRitmo_summaryBullet1',
    'blogSalsaRitmo_summaryBullet2',
    'blogSalsaRitmo_summaryBullet3',
    'blogSalsaRitmo_summaryBullet4',
  ],

  // === KEY STATISTICS (Holographic Cards) ===
  summaryStats: [
    {
      value: '1960s',
      labelKey: 'blogSalsaRitmo_statNYCLabel',
      source: 'Ramos Gandía, 2023',
    },
    {
      value: '4+',
      labelKey: 'blogSalsaRitmo_statEstilosLabel',
      source: 'Estudios académicos',
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
      contentKey: 'blogSalsaRitmo_intro',
    },
    {
      id: 'intro-2',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_intro2',
    },

    // =====================================================
    // SECTION 1: ORÍGENES
    // =====================================================
    {
      id: 'origenes',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaRitmo_origenesTitle',
    },
    {
      id: 'origenes-content1',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_origenesContent1',
    },
    {
      id: 'origenes-content2',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_origenesContent2',
    },

    // =====================================================
    // SECTION 2: ESTILOS
    // =====================================================
    {
      id: 'estilos',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaRitmo_estilosTitle',
    },
    {
      id: 'estilos-intro',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_estilosIntro',
    },
    {
      id: 'estilos-lista',
      type: 'list',
      contentKey: 'blogSalsaRitmo_estilosListaTitle',
      listItems: [
        'blogSalsaRitmo_estiloCubana',
        'blogSalsaRitmo_estiloLinea',
        'blogSalsaRitmo_estiloCaleña',
        'blogSalsaRitmo_estiloPuertorriqueña',
      ],
    },
    {
      id: 'estilos-cierre',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_estilosCierre',
    },

    // === IMAGE: Estilos de Salsa ===
    {
      id: 'image-estilos',
      type: 'image',
      contentKey: 'blogSalsaRitmo_imageEstilosCaption',
      image: {
        src: '/images/blog/salsa-ritmo/estilos-salsa.webp',
        srcSet:
          '/images/blog/salsa-ritmo/estilos-salsa-480.webp 480w, /images/blog/salsa-ritmo/estilos-salsa-800.webp 800w',
        alt: 'Estilos de salsa: cubana, línea, caleña y puertorriqueña',
        caption: 'blogSalsaRitmo_imageEstilosCaption',
        width: 800,
        height: 500,
      },
    },

    // =====================================================
    // SECTION 3: RUEDA DE CASINO
    // =====================================================
    {
      id: 'rueda',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaRitmo_ruedaTitle',
    },
    {
      id: 'rueda-content1',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_ruedaContent1',
    },
    {
      id: 'rueda-content2',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_ruedaContent2',
    },

    // === IMAGE: Rueda de Casino ===
    {
      id: 'image-rueda',
      type: 'image',
      contentKey: 'blogSalsaRitmo_imageRuedaCaption',
      image: {
        src: '/images/blog/salsa-ritmo/rueda-casino.webp',
        srcSet:
          '/images/blog/salsa-ritmo/rueda-casino-480.webp 480w, /images/blog/salsa-ritmo/rueda-casino-800.webp 800w',
        alt: "Rueda de casino: baile grupal cubano en Farray's Barcelona",
        caption: 'blogSalsaRitmo_imageRuedaCaption',
        width: 800,
        height: 500,
      },
    },

    // =====================================================
    // SECTION 4: PROYECCIÓN Y ALMA
    // =====================================================
    {
      id: 'proyeccion',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaRitmo_proyeccionTitle',
    },
    {
      id: 'proyeccion-content1',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_proyeccionContent1',
    },
    {
      id: 'proyeccion-content2',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_proyeccionContent2',
    },

    // =====================================================
    // SECTION 5: VESTUARIO
    // =====================================================
    {
      id: 'vestuario',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaRitmo_vestuarioTitle',
    },
    {
      id: 'vestuario-content',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_vestuarioContent',
    },
    {
      id: 'vestuario-lista',
      type: 'list',
      contentKey: 'blogSalsaRitmo_vestuarioListaTitle',
      listItems: ['blogSalsaRitmo_vestuarioMujeres', 'blogSalsaRitmo_vestuarioHombres'],
    },
    {
      id: 'vestuario-cierre',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_vestuarioCierre',
    },

    // =====================================================
    // SECTION 6: BENEFICIOS - POR QUÉ APRENDER
    // =====================================================
    {
      id: 'beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaRitmo_beneficiosTitle',
    },
    {
      id: 'beneficios-intro',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_beneficiosIntro',
    },
    {
      id: 'beneficios-lista',
      type: 'list',
      contentKey: 'blogSalsaRitmo_beneficiosListaTitle',
      listItems: [
        'blogSalsaRitmo_beneficioSalud',
        'blogSalsaRitmo_beneficioCultura',
        'blogSalsaRitmo_beneficioComunidad',
        'blogSalsaRitmo_beneficioConfianza',
      ],
    },
    {
      id: 'beneficios-farrays',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_beneficiosFarrays',
    },

    // =====================================================
    // SECTION 7: CONCLUSIÓN
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogSalsaRitmo_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogSalsaRitmo_conclusionCTA',
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/salsa-ritmo/hero.webp',
    srcSet:
      '/images/blog/salsa-ritmo/hero-480.webp 480w, /images/blog/salsa-ritmo/hero-960.webp 960w, /images/blog/salsa-ritmo/hero.webp 1200w',
    alt: "Salsa: el ritmo que conquistó el mundo - Farray's Dance Center Barcelona",
    width: 1200,
    height: 630,
  },

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_tutoriales',
    categoryUrl: '/blog/tutoriales',
    currentKey: 'blogSalsaRitmo_breadcrumbCurrent',
  },

  // === FAQ SECTION (SEO Optimized) ===
  faqSection: {
    enabled: true,
    titleKey: 'blogSalsaRitmo_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogSalsaRitmo_faq1Question',
        answerKey: 'blogSalsaRitmo_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogSalsaRitmo_faq2Question',
        answerKey: 'blogSalsaRitmo_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogSalsaRitmo_faq3Question',
        answerKey: 'blogSalsaRitmo_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogSalsaRitmo_faq4Question',
        answerKey: 'blogSalsaRitmo_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogSalsaRitmo_faq5Question',
        answerKey: 'blogSalsaRitmo_faq5Answer',
      },
    ],
  },

  // === RELATED ARTICLES ===
  relatedArticles: [
    {
      slug: 'beneficios-bailar-salsa',
      category: 'fitness',
      titleKey: 'blogBeneficiosSalsa_title',
      excerptKey: 'blogBeneficiosSalsa_excerpt',
      image: '/images/blog/beneficios-salsa/hero.webp',
    },
    {
      slug: 'historia-salsa-barcelona',
      category: 'historia',
      titleKey: 'blogHistoriaSalsa_title',
      excerptKey: 'blogHistoriaSalsa_excerpt',
      image: '/images/blog/historia-salsa/hero.webp',
    },
  ],

  // === RELATED CLASSES (internal linking for SEO) ===
  relatedClasses: ['salsa-cubana-barcelona', 'bachata-barcelona', 'salsa-bachata-barcelona'],

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
    '#estilos',
    '#rueda',
    '#beneficios',
    '#conclusion',
  ],
};
