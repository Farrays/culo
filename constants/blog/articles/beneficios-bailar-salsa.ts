/**
 * Article Configuration: 10 Beneficios de Bailar Salsa
 *
 * Pilot article for the FIDC blog.
 * Category: Lifestyle
 */

import type { BlogArticleConfig } from '../types';

export const BENEFICIOS_SALSA_CONFIG: BlogArticleConfig = {
  // === IDENTIFICATION ===
  articleKey: 'blogBeneficiosSalsa',
  slug: 'beneficios-bailar-salsa',
  category: 'lifestyle',

  // === DATES ===
  datePublished: '2025-01-15',
  dateModified: '2025-01-15',

  // === READING METRICS ===
  readingTime: 8,
  wordCount: 1800,

  // === SUMMARY (GEO Optimized) ===
  summaryBullets: [
    'blogBeneficiosSalsa_summaryBullet1',
    'blogBeneficiosSalsa_summaryBullet2',
    'blogBeneficiosSalsa_summaryBullet3',
  ],

  // === KEY STATISTICS (Holographic Cards) ===
  summaryStats: [
    {
      value: '400',
      labelKey: 'blogBeneficiosSalsa_statCaloriesLabel',
      source: 'Harvard Medical School',
    },
    {
      value: '76%',
      labelKey: 'blogBeneficiosSalsa_statDementiaLabel',
      source: 'NEJM 2003',
    },
  ],

  // === CONTENT SECTIONS ===
  sections: [
    // Intro
    {
      id: 'intro',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_intro',
    },

    // Benefit 1: Calories
    {
      id: 'beneficio-1',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit1Title',
    },
    {
      id: 'beneficio-1-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit1Content',
    },
    {
      id: 'stat-1',
      type: 'statistic',
      contentKey: 'blogBeneficiosSalsa_stat1Label',
      statisticValue: '400',
      statisticSource: 'Harvard Medical School, 2023',
    },

    // Benefit 2: Cardiovascular
    {
      id: 'beneficio-2',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit2Title',
    },
    {
      id: 'beneficio-2-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit2Content',
    },

    // Benefit 3: Muscles
    {
      id: 'beneficio-3',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit3Title',
    },
    {
      id: 'beneficio-3-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit3Content',
    },

    // === IMAGE 1: Fitness/Cardio ===
    {
      id: 'image-fitness',
      type: 'image',
      contentKey: 'blogBeneficiosSalsa_imageFitnessCaption',
      image: {
        src: '/images/blog/beneficios-salsa/fitness-cardio.webp',
        srcSet:
          '/images/blog/beneficios-salsa/fitness-cardio-480.webp 480w, /images/blog/beneficios-salsa/fitness-cardio-800.webp 800w',
        alt: 'Pareja bailando salsa con energía - beneficios cardiovasculares del baile',
        caption: 'blogBeneficiosSalsa_imageFitnessCaption',
        width: 800,
        height: 500,
      },
    },

    // Benefit 4: Brain
    {
      id: 'beneficio-4',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit4Title',
    },
    {
      id: 'beneficio-4-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit4Content',
    },
    {
      id: 'stat-2',
      type: 'statistic',
      contentKey: 'blogBeneficiosSalsa_stat2Label',
      statisticValue: '76%',
      statisticSource: 'New England Journal of Medicine',
    },

    // Benefit 5: Stress
    {
      id: 'beneficio-5',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit5Title',
    },
    {
      id: 'beneficio-5-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit5Content',
    },

    // Benefit 6: Confidence
    {
      id: 'beneficio-6',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit6Title',
    },
    {
      id: 'beneficio-6-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit6Content',
    },

    // === IMAGE 2: Transformation/Confidence ===
    {
      id: 'image-confidence',
      type: 'image',
      contentKey: 'blogBeneficiosSalsa_imageConfidenceCaption',
      image: {
        src: '/images/blog/beneficios-salsa/confidence-transform.webp',
        srcSet:
          '/images/blog/beneficios-salsa/confidence-transform-480.webp 480w, /images/blog/beneficios-salsa/confidence-transform-800.webp 800w',
        alt: 'Bailarina de salsa con expresión de confianza - transformación personal',
        caption: 'blogBeneficiosSalsa_imageConfidenceCaption',
        width: 800,
        height: 500,
      },
    },

    // Benefit 7: Posture
    {
      id: 'beneficio-7',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit7Title',
    },
    {
      id: 'beneficio-7-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit7Content',
    },

    // Benefit 8: Social
    {
      id: 'beneficio-8',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit8Title',
    },
    {
      id: 'beneficio-8-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit8Content',
    },

    // Benefit 9: Culture
    {
      id: 'beneficio-9',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit9Title',
    },
    {
      id: 'beneficio-9-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit9Content',
    },

    // === IMAGE 3: Social/Community ===
    {
      id: 'image-social',
      type: 'image',
      contentKey: 'blogBeneficiosSalsa_imageSocialCaption',
      image: {
        src: '/images/blog/beneficios-salsa/social-community.webp',
        srcSet:
          '/images/blog/beneficios-salsa/social-community-480.webp 480w, /images/blog/beneficios-salsa/social-community-800.webp 800w',
        alt: 'Grupo de alumnos sonriendo en clase de salsa - comunidad y conexión social',
        caption: 'blogBeneficiosSalsa_imageSocialCaption',
        width: 800,
        height: 500,
      },
    },

    // Benefit 10: Happiness
    {
      id: 'beneficio-10',
      type: 'heading',
      level: 2,
      contentKey: 'blogBeneficiosSalsa_benefit10Title',
    },
    {
      id: 'beneficio-10-content',
      type: 'paragraph',
      contentKey: 'blogBeneficiosSalsa_benefit10Content',
    },

    // === REFERENCES SECTION (E-E-A-T Authority) ===
    {
      id: 'references',
      type: 'references',
      contentKey: 'blogBeneficiosSalsa_referencesIntro',
      references: [
        {
          id: 'harvard',
          titleKey: 'blogBeneficiosSalsa_refHarvardTitle',
          url: 'https://www.health.harvard.edu/staying-healthy/the-health-benefits-of-dancing',
          publisher: 'Harvard Medical School',
          year: '2023',
          descriptionKey: 'blogBeneficiosSalsa_refHarvardDesc',
        },
        {
          id: 'nejm-2003',
          titleKey: 'blogBeneficiosSalsa_refNEJMTitle',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
          publisher: 'New England Journal of Medicine',
          year: '2003',
          descriptionKey: 'blogBeneficiosSalsa_refNEJMDesc',
        },
        {
          id: 'apa-dance',
          titleKey: 'blogBeneficiosSalsa_refAPATitle',
          url: 'https://www.apa.org/monitor/2019/06/benefit-dancing',
          publisher: 'American Psychological Association',
          year: '2019',
          descriptionKey: 'blogBeneficiosSalsa_refAPADesc',
        },
        {
          id: 'ncbi-dance-brain',
          titleKey: 'blogBeneficiosSalsa_refNCBITitle',
          url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5649320/',
          publisher: 'National Institutes of Health',
          year: '2017',
          descriptionKey: 'blogBeneficiosSalsa_refNCBIDesc',
        },
      ],
    },
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/beneficios-salsa/hero.webp',
    srcSet:
      '/images/blog/beneficios-salsa/hero-480.webp 480w, /images/blog/beneficios-salsa/hero-960.webp 960w, /images/blog/beneficios-salsa/hero.webp 1200w',
    alt: 'Pareja bailando salsa cubana en Barcelona - Beneficios del baile',
    width: 1200,
    height: 630,
  },

  // === NAVIGATION ===
  breadcrumbConfig: {
    homeKey: 'blog_breadcrumbHome',
    blogKey: 'blog_breadcrumbBlog',
    categoryKey: 'blog_category_lifestyle',
    categoryUrl: '/blog/lifestyle',
    currentKey: 'blogBeneficiosSalsa_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blogBeneficiosSalsa_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogBeneficiosSalsa_faq1Question',
        answerKey: 'blogBeneficiosSalsa_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogBeneficiosSalsa_faq2Question',
        answerKey: 'blogBeneficiosSalsa_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogBeneficiosSalsa_faq3Question',
        answerKey: 'blogBeneficiosSalsa_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogBeneficiosSalsa_faq4Question',
        answerKey: 'blogBeneficiosSalsa_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogBeneficiosSalsa_faq5Question',
        answerKey: 'blogBeneficiosSalsa_faq5Answer',
      },
    ],
  },

  // === RELATED ARTICLES ===
  relatedArticles: [],

  // === RELATED CLASSES (internal linking) ===
  relatedClasses: ['salsa-cubana-barcelona'],

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

  // === SPEAKABLE (Voice Search) ===
  speakableSelectors: ['#article-summary', '#intro', '#beneficio-1', '#beneficio-4'],
};
