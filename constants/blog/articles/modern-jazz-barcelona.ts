/**
 * Modern Jazz Barcelona - Complete Guide
 *
 * Enterprise-level blog article about Modern Jazz dance in Barcelona.
 * Author: Alejandro Miñoso (ENA Cuba, Carlos Acosta Company)
 *
 * GEO Optimizations:
 * - Answer capsules for AI citation (72% citation rate)
 * - Statistics with academic citations (E-E-A-T)
 * - Definitions for LLM extraction
 * - FAQ schema for voice search
 * - Speakable selectors configured
 */

import type { BlogArticleConfig } from '../types';

export const MODERN_JAZZ_BARCELONA_CONFIG: BlogArticleConfig = {
  // === BASIC INFO ===
  articleKey: 'blogModernJazz',
  slug: 'modern-jazz-barcelona-guia-completa',
  category: 'tips',
  authorId: 'alejandro-minoso',
  datePublished: '2026-02-11',
  dateModified: '2026-02-11',
  readingTime: 18,
  wordCount: 4500,

  // === SUMMARY BULLETS ===
  summaryBullets: [
    'blogModernJazz_summaryBullet1',
    'blogModernJazz_summaryBullet2',
    'blogModernJazz_summaryBullet3',
    'blogModernJazz_summaryBullet4',
    'blogModernJazz_summaryBullet5',
  ],

  // === FEATURED IMAGE ===
  featuredImage: {
    src: '/images/blog/modern-jazz/hero.webp',
    srcSet:
      '/images/blog/modern-jazz/hero-480.webp 480w, /images/blog/modern-jazz/hero-960.webp 960w, /images/blog/modern-jazz/hero.webp 1200w',
    alt: 'blogModernJazz_heroAlt',
    width: 1200,
    height: 630,
  },
  ogImage: '/images/blog/modern-jazz/og.jpg',

  // === GEO: SUMMARY STATS WITH CITATIONS ===
  summaryStats: [
    {
      value: '76%',
      labelKey: 'blogModernJazz_stat1Label',
      citation: {
        source: 'New England Journal of Medicine',
        url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
        year: '2003',
        authors: 'Verghese et al.',
        doi: '10.1056/NEJMoa022252',
      },
    },
    {
      value: '400-600',
      labelKey: 'blogModernJazz_stat2Label',
      citation: {
        source: 'University of Brighton / Harvard Health',
        url: 'https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-of-leisure-and-routine-activities',
        year: '2021',
      },
    },
    {
      value: '1942',
      labelKey: 'blogModernJazz_stat3Label',
      citation: {
        source: 'University of Florida Press',
        url: 'https://upress.ufl.edu/book.asp?id=9780813049298',
        year: '2014',
        authors: 'Loney, Glenn',
      },
    },
    {
      value: '46%',
      labelKey: 'blogModernJazz_stat4Label',
      citation: {
        source: 'American Journal of Preventive Medicine',
        url: 'https://pubmed.ncbi.nlm.nih.gov/27267275/',
        year: '2016',
      },
    },
  ],

  // === SPEAKABLE SELECTORS (Voice Search) ===
  speakableSelectors: [
    '#article-summary',
    '[data-answer-capsule="true"]',
    '#intro',
    '#section-pioneros',
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
      contentKey: 'blogModernJazz_intro',
    },
    {
      id: 'intro2',
      type: 'paragraph',
      contentKey: 'blogModernJazz_intro2',
    },
    {
      id: 'intro3',
      type: 'paragraph',
      contentKey: 'blogModernJazz_intro3',
    },

    // =====================================================
    // ANSWER CAPSULES (GEO)
    // =====================================================
    {
      id: 'answer-capsule-1',
      type: 'answer-capsule',
      contentKey: 'blogModernJazz_answerText1',
      answerCapsule: {
        questionKey: 'blogModernJazz_answerQuestion1',
        answerKey: 'blogModernJazz_answerText1',
        sourcePublisher: 'Encyclopaedia Britannica',
        sourceYear: '2024',
        sourceUrl: 'https://www.britannica.com/art/jazz-dance',
        confidence: 'verified',
        icon: 'check',
      },
    },
    {
      id: 'answer-capsule-2',
      type: 'answer-capsule',
      contentKey: 'blogModernJazz_answerText2',
      answerCapsule: {
        questionKey: 'blogModernJazz_answerQuestion2',
        answerKey: 'blogModernJazz_answerText2',
        sourcePublisher: 'University of Florida Press',
        sourceYear: '2014',
        sourceUrl: 'https://upress.ufl.edu/book.asp?id=9780813049298',
        confidence: 'verified',
        icon: 'star',
      },
    },
    {
      id: 'answer-capsule-3',
      type: 'answer-capsule',
      contentKey: 'blogModernJazz_answerText3',
      answerCapsule: {
        questionKey: 'blogModernJazz_answerQuestion3',
        answerKey: 'blogModernJazz_answerText3',
        sourcePublisher: 'New England Journal of Medicine',
        sourceYear: '2003',
        sourceUrl: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
        confidence: 'verified',
        icon: 'check',
      },
    },
    {
      id: 'answer-capsule-4',
      type: 'answer-capsule',
      contentKey: 'blogModernJazz_answerText4',
      answerCapsule: {
        questionKey: 'blogModernJazz_answerQuestion4',
        answerKey: 'blogModernJazz_answerText4',
        sourcePublisher: 'MasterClass',
        sourceYear: '2021',
        sourceUrl: 'https://www.masterclass.com/articles/jazz-dance-guide',
        confidence: 'verified',
        icon: 'info',
      },
    },
    {
      id: 'answer-capsule-5',
      type: 'answer-capsule',
      contentKey: 'blogModernJazz_answerText5',
      answerCapsule: {
        questionKey: 'blogModernJazz_answerQuestion5',
        answerKey: 'blogModernJazz_answerText5',
        sourcePublisher: 'Harvard Health',
        sourceYear: '2021',
        sourceUrl:
          'https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-of-leisure-and-routine-activities',
        confidence: 'verified',
        icon: 'lightbulb',
      },
    },

    // =====================================================
    // SECTION 1: Historia - Los Pioneros
    // =====================================================
    {
      id: 'section-pioneros',
      type: 'heading',
      level: 2,
      contentKey: 'blogModernJazz_section1Title',
    },
    {
      id: 'section-pioneros-intro',
      type: 'paragraph',
      contentKey: 'blogModernJazz_section1Content1',
    },

    // Jack Cole
    {
      id: 'section-jackcole-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_jackColeTitle',
    },
    {
      id: 'section-jackcole-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_jackColeContent',
    },

    // Katherine Dunham
    {
      id: 'section-dunham-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_dunhamTitle',
    },
    {
      id: 'section-dunham-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_dunhamContent',
    },

    // Bob Fosse
    {
      id: 'section-fosse-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_fosseTitle',
    },
    {
      id: 'section-fosse-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_fosseContent',
    },

    // Luigi & Matt Mattox
    {
      id: 'section-luigi-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_luigiMattoxTitle',
    },
    {
      id: 'section-luigi-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_luigiMattoxContent',
    },

    // Jerome Robbins
    {
      id: 'section-robbins-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_robbinsTitle',
    },
    {
      id: 'section-robbins-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_robbinsContent',
    },

    // =====================================================
    // SECTION 2: Coreógrafos Contemporáneos
    // =====================================================
    {
      id: 'section-contemporaneos',
      type: 'heading',
      level: 2,
      contentKey: 'blogModernJazz_section2Title',
    },
    {
      id: 'section-contemporaneos-intro',
      type: 'paragraph',
      contentKey: 'blogModernJazz_section2Intro',
    },
    {
      id: 'section-contemporaneos-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_contemporaneosContent',
    },

    // =====================================================
    // SECTION 3: Los 6 Estilos de Modern Jazz
    // =====================================================
    {
      id: 'section-estilos',
      type: 'heading',
      level: 2,
      contentKey: 'blogModernJazz_section3Title',
    },
    {
      id: 'section-estilos-intro',
      type: 'paragraph',
      contentKey: 'blogModernJazz_section3Intro',
    },

    // Lyrical Jazz
    {
      id: 'estilo-lyrical-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_estiloLyricalTitle',
    },
    {
      id: 'estilo-lyrical-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_estiloLyricalContent',
    },

    // Commercial Jazz
    {
      id: 'estilo-commercial-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_estiloCommercialTitle',
    },
    {
      id: 'estilo-commercial-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_estiloCommercialContent',
    },

    // Broadway Jazz
    {
      id: 'estilo-broadway-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_estiloBroadwayTitle',
    },
    {
      id: 'estilo-broadway-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_estiloBroadwayContent',
    },

    // Contemporary Jazz
    {
      id: 'estilo-contemporary-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_estiloContemporaryTitle',
    },
    {
      id: 'estilo-contemporary-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_estiloContemporaryContent',
    },

    // Jazz Funk
    {
      id: 'estilo-funk-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_estiloFunkTitle',
    },
    {
      id: 'estilo-funk-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_estiloFunkContent',
    },

    // Afro Jazz
    {
      id: 'estilo-afrojazz-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_estiloAfrojazzTitle',
    },
    {
      id: 'estilo-afrojazz-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_estiloAfrojazzContent',
    },

    // =====================================================
    // COMPARISON TABLE: 6 Estilos de Modern Jazz
    // =====================================================
    {
      id: 'tabla-estilos',
      type: 'comparison-table',
      contentKey: 'blogModernJazz_tablaTitle',
      tableConfig: {
        headers: [
          'blogModernJazz_tablaHeaderEstilo',
          'blogModernJazz_tablaHeaderCaracteristicas',
          'blogModernJazz_tablaHeaderMusica',
          'blogModernJazz_tablaHeaderIdeal',
        ],
        rows: [
          [
            'blogModernJazz_tablaLyrical',
            'blogModernJazz_tablaLyricalCaract',
            'blogModernJazz_tablaLyricalMusica',
            'blogModernJazz_tablaLyricalIdeal',
          ],
          [
            'blogModernJazz_tablaCommercial',
            'blogModernJazz_tablaCommercialCaract',
            'blogModernJazz_tablaCommercialMusica',
            'blogModernJazz_tablaCommercialIdeal',
          ],
          [
            'blogModernJazz_tablaBroadway',
            'blogModernJazz_tablaBroadwayCaract',
            'blogModernJazz_tablaBroadwayMusica',
            'blogModernJazz_tablaBroadwayIdeal',
          ],
          [
            'blogModernJazz_tablaContemporary',
            'blogModernJazz_tablaContemporaryCaract',
            'blogModernJazz_tablaContemporaryMusica',
            'blogModernJazz_tablaContemporaryIdeal',
          ],
          [
            'blogModernJazz_tablaFunk',
            'blogModernJazz_tablaFunkCaract',
            'blogModernJazz_tablaFunkMusica',
            'blogModernJazz_tablaFunkIdeal',
          ],
          [
            'blogModernJazz_tablaAfrojazz',
            'blogModernJazz_tablaAfrojazzCaract',
            'blogModernJazz_tablaAfrojazzMusica',
            'blogModernJazz_tablaAfrojazzIdeal',
          ],
        ],
      },
    },

    // =====================================================
    // SECTION 4: Técnica del Modern Jazz
    // =====================================================
    {
      id: 'section-tecnica',
      type: 'heading',
      level: 2,
      contentKey: 'blogModernJazz_section4Title',
    },
    {
      id: 'section-tecnica-intro',
      type: 'paragraph',
      contentKey: 'blogModernJazz_section4Content1',
    },

    // Isolations
    {
      id: 'tecnica-isolations-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_tecnicaIsolationsTitle',
    },
    {
      id: 'tecnica-isolations-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_tecnicaIsolationsContent',
    },

    // Contracciones
    {
      id: 'tecnica-contracciones-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_tecnicaContraccionesTitle',
    },
    {
      id: 'tecnica-contracciones-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_tecnicaContraccionesContent',
    },

    // Plié Jazz
    {
      id: 'tecnica-plie-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_tecnicaPlieTitle',
    },
    {
      id: 'tecnica-plie-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_tecnicaPlieContent',
    },

    // =====================================================
    // SECTION 5: Beneficios Científicos
    // =====================================================
    {
      id: 'section-beneficios',
      type: 'heading',
      level: 2,
      contentKey: 'blogModernJazz_section5Title',
    },
    {
      id: 'section-beneficios-intro',
      type: 'paragraph',
      contentKey: 'blogModernJazz_section5Content1',
    },

    // Neurocognitivos
    {
      id: 'beneficios-neuro-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_beneficiosNeuroTitle',
    },
    {
      id: 'beneficios-neuro-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_beneficiosNeuroContent',
    },

    // Cardiovasculares
    {
      id: 'beneficios-cardio-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_beneficiosCardioTitle',
    },
    {
      id: 'beneficios-cardio-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_beneficiosCardioContent',
    },

    // Salud Mental
    {
      id: 'beneficios-mental-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_beneficiosMentalTitle',
    },
    {
      id: 'beneficios-mental-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_beneficiosMentalContent',
    },

    // =====================================================
    // SECTION 6: Mi Formación Cubana
    // =====================================================
    {
      id: 'section-formacion',
      type: 'heading',
      level: 2,
      contentKey: 'blogModernJazz_section6Title',
    },
    {
      id: 'section-formacion-intro',
      type: 'paragraph',
      contentKey: 'blogModernJazz_section6Content1',
    },

    // ENA
    {
      id: 'formacion-ena-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_formacionENATitle',
    },
    {
      id: 'formacion-ena-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_formacionENAContent',
    },

    // Carlos Acosta
    {
      id: 'formacion-acosta-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_formacionAcostaTitle',
    },
    {
      id: 'formacion-acosta-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_formacionAcostaContent',
    },

    // =====================================================
    // SECTION 7: Dónde Aprender en Barcelona
    // =====================================================
    {
      id: 'section-escuelas',
      type: 'heading',
      level: 2,
      contentKey: 'blogModernJazz_section7Title',
    },
    {
      id: 'section-escuelas-intro',
      type: 'paragraph',
      contentKey: 'blogModernJazz_section7Content1',
    },

    // Barcelona
    {
      id: 'escuelas-barcelona-title',
      type: 'heading',
      level: 3,
      contentKey: 'blogModernJazz_escuelasBarcelonaTitle',
    },
    {
      id: 'escuelas-barcelona-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_escuelasBarcelonaContent',
    },

    // =====================================================
    // SECTION 8: Tu Primera Clase
    // =====================================================
    {
      id: 'section-primera-clase',
      type: 'heading',
      level: 2,
      contentKey: 'blogModernJazz_section8Title',
    },
    {
      id: 'section-primera-clase-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_section8Content1',
    },
    {
      id: 'section-primera-clase-list',
      type: 'list',
      contentKey: 'blogModernJazz_section8List',
      listItems: [
        'blogModernJazz_section8ListItem1',
        'blogModernJazz_section8ListItem2',
        'blogModernJazz_section8ListItem3',
        'blogModernJazz_section8ListItem4',
        'blogModernJazz_section8ListItem5',
      ],
    },
    {
      id: 'section-primera-clase-consejo',
      type: 'paragraph',
      contentKey: 'blogModernJazz_section8Content2',
    },

    // =====================================================
    // DEFINITIONS (GEO - LLM Extraction)
    // =====================================================
    {
      id: 'definition-modern-jazz',
      type: 'definition',
      definitionTermKey: 'blogModernJazz_defTerm1',
      contentKey: 'blogModernJazz_defContent1',
    },
    {
      id: 'definition-isolations',
      type: 'definition',
      definitionTermKey: 'blogModernJazz_defTerm2',
      contentKey: 'blogModernJazz_defContent2',
    },
    {
      id: 'definition-contractions',
      type: 'definition',
      definitionTermKey: 'blogModernJazz_defTerm3',
      contentKey: 'blogModernJazz_defContent3',
    },
    {
      id: 'definition-jazz-walk',
      type: 'definition',
      definitionTermKey: 'blogModernJazz_defTerm4',
      contentKey: 'blogModernJazz_defContent4',
    },
    {
      id: 'definition-jazz-hands',
      type: 'definition',
      definitionTermKey: 'blogModernJazz_defTerm5',
      contentKey: 'blogModernJazz_defContent5',
    },
    {
      id: 'definition-passe',
      type: 'definition',
      definitionTermKey: 'blogModernJazz_defTerm6',
      contentKey: 'blogModernJazz_defContent6',
    },

    // =====================================================
    // CONCLUSION
    // =====================================================
    {
      id: 'conclusion',
      type: 'heading',
      level: 2,
      contentKey: 'blogModernJazz_conclusionTitle',
    },
    {
      id: 'conclusion-content',
      type: 'paragraph',
      contentKey: 'blogModernJazz_conclusionContent',
    },
    {
      id: 'conclusion-cta',
      type: 'paragraph',
      contentKey: 'blogModernJazz_conclusionCTA',
    },

    // =====================================================
    // REFERENCES SECTION (Cards con enlaces)
    // =====================================================
    {
      id: 'references-section',
      type: 'references',
      contentKey: 'blogModernJazz_referencesIntro',
      references: [
        {
          id: 'nejm',
          titleKey: 'blogModernJazz_refNEJMTitle',
          url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa022252',
          publisher: 'New England Journal of Medicine',
          year: '2003',
          descriptionKey: 'blogModernJazz_refNEJMDesc',
        },
        {
          id: 'britannica',
          titleKey: 'blogModernJazz_refBritannicaTitle',
          url: 'https://www.britannica.com/art/jazz-dance',
          publisher: 'Encyclopaedia Britannica',
          year: '2024',
          descriptionKey: 'blogModernJazz_refBritannicaDesc',
        },
        {
          id: 'upress',
          titleKey: 'blogModernJazz_refUniversityPressTitle',
          url: 'https://upress.ufl.edu/book.asp?id=9780813049298',
          publisher: 'University of Florida Press',
          year: '2014',
          descriptionKey: 'blogModernJazz_refUniversityPressDesc',
        },
        {
          id: 'masterclass',
          titleKey: 'blogModernJazz_refMasterClassTitle',
          url: 'https://www.masterclass.com/articles/jazz-dance-guide',
          publisher: 'MasterClass',
          year: '2021',
          descriptionKey: 'blogModernJazz_refMasterClassDesc',
        },
        {
          id: 'harvard',
          titleKey: 'blogModernJazz_refHarvardTitle',
          url: 'https://www.health.harvard.edu/diet-and-weight-loss/calories-burned-in-30-minutes-of-leisure-and-routine-activities',
          publisher: 'Harvard Health Publishing',
          year: '2021',
          descriptionKey: 'blogModernJazz_refHarvardDesc',
        },
        {
          id: 'ajpm',
          titleKey: 'blogModernJazz_refAJPMTitle',
          url: 'https://pubmed.ncbi.nlm.nih.gov/27267275/',
          publisher: 'American Journal of Preventive Medicine',
          year: '2016',
          descriptionKey: 'blogModernJazz_refAJPMDesc',
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
    currentKey: 'blogModernJazz_breadcrumbCurrent',
  },

  // === FAQ SECTION ===
  faqSection: {
    enabled: true,
    titleKey: 'blogModernJazz_faqTitle',
    faqs: [
      {
        id: '1',
        questionKey: 'blogModernJazz_faq1Question',
        answerKey: 'blogModernJazz_faq1Answer',
      },
      {
        id: '2',
        questionKey: 'blogModernJazz_faq2Question',
        answerKey: 'blogModernJazz_faq2Answer',
      },
      {
        id: '3',
        questionKey: 'blogModernJazz_faq3Question',
        answerKey: 'blogModernJazz_faq3Answer',
      },
      {
        id: '4',
        questionKey: 'blogModernJazz_faq4Question',
        answerKey: 'blogModernJazz_faq4Answer',
      },
      {
        id: '5',
        questionKey: 'blogModernJazz_faq5Question',
        answerKey: 'blogModernJazz_faq5Answer',
      },
      {
        id: '6',
        questionKey: 'blogModernJazz_faq6Question',
        answerKey: 'blogModernJazz_faq6Answer',
      },
      {
        id: '7',
        questionKey: 'blogModernJazz_faq7Question',
        answerKey: 'blogModernJazz_faq7Answer',
      },
      {
        id: '8',
        questionKey: 'blogModernJazz_faq8Question',
        answerKey: 'blogModernJazz_faq8Answer',
      },
      {
        id: '9',
        questionKey: 'blogModernJazz_faq9Question',
        answerKey: 'blogModernJazz_faq9Answer',
      },
      {
        id: '10',
        questionKey: 'blogModernJazz_faq10Question',
        answerKey: 'blogModernJazz_faq10Answer',
      },
    ],
  },

  // === SCHEMA: Course ===
  courseSchema: {
    enabled: true,
    courseNameKey: 'blogModernJazz_courseSchemaName',
    courseDescriptionKey: 'blogModernJazz_courseSchemaDesc',
    provider: "Farray's International Dance Center",
    courseMode: 'OnSite',
  },

  // === SCHEMA: Aggregate Rating ===
  aggregateRatingSchema: {
    enabled: true,
    ratingValue: 4.9,
    reviewCount: 127,
  },

  // === RELATED ARTICLES ===
  relatedArticles: [
    {
      slug: 'danza-contemporanea-vs-modern-jazz-vs-ballet',
      category: 'tips',
      titleKey: 'blogDanzaContemporaneaVsJazzBallet_title',
      excerptKey: 'blogDanzaContemporaneaVsJazzBallet_excerpt',
      image: '/images/blog/danza-contemporanea-vs-jazz-ballet/hero.webp',
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
  relatedClasses: ['modern-jazz-barcelona', 'contemporaneo-barcelona', 'ballet-barcelona'],

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
