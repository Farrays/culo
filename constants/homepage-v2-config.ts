/**
 * Homepage V2 Configuration
 * Configuración centralizada para la nueva homepage con estrategia océano azul
 */

export const HOMEPAGE_V2_CONFIG = {
  // Meta información
  meta: {
    titleKey: 'homev2_pageTitle',
    descriptionKey: 'homev2_metaDescription',
    noindex: true, // Página de test, no indexar
  },

  // Hero Section
  hero: {
    headlineKey: 'homev2_heroHeadline',
    subheadlineKey: 'homev2_heroSubheadline',
    taglineKey: 'homev2_heroTagline',
    valuePropositionKey: 'homev2_heroValue',
    cta1: {
      textKey: 'homev2_heroCta1',
      subtextKey: 'homev2_heroCta1Subtext',
      href: '/horarios-clases-baile-barcelona',
    },
    cta2: {
      textKey: 'homev2_heroCta2',
      scrollTo: '#method-section',
    },
    socialProof: {
      rating: '4.9',
      reviewCount: '505+',
      studentsActive: '1500+',
      badge: 'CID-UNESCO',
    },
    // Placeholder para video - cuando esté listo, cambiar a video URL
    backgroundType: 'image' as const, // 'image' | 'video'
    backgroundImage: '/images/hero-bg.jpg',
    backgroundVideo: null, // '/videos/hero-loop.mp4' cuando esté listo
  },

  // Founder Section (Pattern Interrupt)
  founder: {
    titleKey: 'homev2_founderTitle',
    paragraphs: ['homev2_founderPara1', 'homev2_founderPara2', 'homev2_founderPara3'],
    quoteKey: 'homev2_founderQuote',
    quoteAuthor: 'P.T. Barnum',
    ctaTextKey: 'homev2_founderCta',
    ctaHref: '/yunaisy-farray',
    image: '/images/yunaisy-portrait.jpg',
  },

  // Method Section (Océano Azul)
  method: {
    problemTitleKey: 'homev2_methodProblemTitle',
    problemTextKey: 'homev2_methodProblemText',
    solutionTitleKey: 'homev2_methodSolutionTitle',
    pillars: [
      {
        iconKey: 'discipline',
        titleKey: 'homev2_methodPillar1Title',
        descKey: 'homev2_methodPillar1Desc',
      },
      {
        iconKey: 'rhythm',
        titleKey: 'homev2_methodPillar2Title',
        descKey: 'homev2_methodPillar2Desc',
      },
      {
        iconKey: 'innovation',
        titleKey: 'homev2_methodPillar3Title',
        descKey: 'homev2_methodPillar3Desc',
      },
    ],
    resultPromiseKey: 'homev2_methodResult',
    ctaTextKey: 'homev2_methodCta',
  },

  // Comparison Section (Nosotros vs Otros)
  comparison: {
    titleKey: 'homev2_comparisonTitle',
    subtitleKey: 'homev2_comparisonSubtitle',
    disclaimerKey: 'homev2_comparisonDisclaimer',
    rows: [
      {
        labelKey: 'homev2_compRow1Label',
        othersKey: 'homev2_compRow1Others',
        usKey: 'homev2_compRow1Us',
      },
      {
        labelKey: 'homev2_compRow2Label',
        othersKey: 'homev2_compRow2Others',
        usKey: 'homev2_compRow2Us',
      },
      {
        labelKey: 'homev2_compRow3Label',
        othersKey: 'homev2_compRow3Others',
        usKey: 'homev2_compRow3Us',
      },
      {
        labelKey: 'homev2_compRow4Label',
        othersKey: 'homev2_compRow4Others',
        usKey: 'homev2_compRow4Us',
      },
      {
        labelKey: 'homev2_compRow5Label',
        othersKey: 'homev2_compRow5Others',
        usKey: 'homev2_compRow5Us',
      },
      {
        labelKey: 'homev2_compRow6Label',
        othersKey: 'homev2_compRow6Others',
        usKey: 'homev2_compRow6Us',
      },
      {
        labelKey: 'homev2_compRow7Label',
        othersKey: 'homev2_compRow7Others',
        usKey: 'homev2_compRow7Us',
      },
      {
        labelKey: 'homev2_compRow8Label',
        othersKey: 'homev2_compRow8Others',
        usKey: 'homev2_compRow8Us',
      },
    ],
    ctaTextKey: 'homev2_comparisonCta',
    ctaSubtextKey: 'homev2_comparisonCtaSubtext',
  },

  // Style Finder Section (Segmentación de Targets)
  styleFinder: {
    titleKey: 'homev2_styleFinderTitle',
    subtitleKey: 'homev2_styleFinderSubtitle',
    personas: [
      {
        id: 'empowerment',
        titleKey: 'homev2_persona1Title',
        descKey: 'homev2_persona1Desc',
        styles: ['Femmology', 'Heels', 'Sexy Style', 'Salsa Lady Style'],
        ctaKey: 'homev2_persona1Cta',
        href: '/clases/heels-barcelona',
        icon: 'sparkles',
        gradient: 'from-pink-500 to-rose-600',
      },
      {
        id: 'couple',
        titleKey: 'homev2_persona2Title',
        descKey: 'homev2_persona2Desc',
        styles: ['Salsa Cubana', 'Bachata Sensual', 'Timba'],
        ctaKey: 'homev2_persona2Cta',
        href: '/clases/salsa-bachata-barcelona',
        icon: 'heart',
        gradient: 'from-red-500 to-orange-500',
      },
      {
        id: 'urban',
        titleKey: 'homev2_persona3Title',
        descKey: 'homev2_persona3Desc',
        styles: ['Hip Hop', 'Dancehall', 'Afrobeat', 'Twerk', 'Reggaeton'],
        ctaKey: 'homev2_persona3Cta',
        href: '/clases/danzas-urbanas-barcelona',
        icon: 'fire',
        gradient: 'from-purple-500 to-indigo-600',
      },
      {
        id: 'fitness',
        titleKey: 'homev2_persona4Title',
        descKey: 'homev2_persona4Desc',
        styles: ['Cuerpo-Fit', 'Full Body Cardio', 'Stretching'],
        ctaKey: 'homev2_persona4Cta',
        href: '/clases/entrenamiento-bailarines-barcelona',
        icon: 'lightning',
        gradient: 'from-emerald-500 to-teal-600',
      },
    ],
    viewAllCtaKey: 'homev2_styleFinderViewAll',
    viewAllHref: '/clases/baile-barcelona',
  },

  // Social Proof Section
  socialProof: {
    titleKey: 'homev2_socialProofTitle',
    stats: [
      { value: '1500+', labelKey: 'homev2_stat1Label' },
      { value: '15+', labelKey: 'homev2_stat2Label' },
      { value: '25+', labelKey: 'homev2_stat3Label' },
      { value: '700m²', labelKey: 'homev2_stat4Label' },
    ],
    googleReviews: {
      rating: '4.9',
      count: '505+',
      linkKey: 'homev2_googleReviewsLink',
    },
    logos: [
      { name: 'Got Talent', src: '/images/logos/got-talent.png' },
      { name: 'Street Dance 2', src: '/images/logos/street-dance.png' },
      { name: 'The Dancer', src: '/images/logos/the-dancer.png' },
      { name: 'CID-UNESCO', src: '/images/logos/cid-unesco.png' },
    ],
    testimonialCtaKey: 'homev2_testimonialsCta',
  },

  // Pricing Preview Section
  pricingPreview: {
    titleKey: 'homev2_pricingTitle',
    subtitleKey: 'homev2_pricingSubtitle',
    urgencyKey: 'homev2_pricingUrgency',
    highlights: [
      { priceKey: 'homev2_price1', descKey: 'homev2_price1Desc' },
      { priceKey: 'homev2_price2', descKey: 'homev2_price2Desc' },
      { priceKey: 'homev2_price3', descKey: 'homev2_price3Desc' },
    ],
    ctaTextKey: 'homev2_pricingCta',
    ctaHref: '/horarios-clases-baile-barcelona',
    secondaryCtaKey: 'homev2_pricingCtaSecondary',
    secondaryHref: '/precios-clases-baile-barcelona',
  },

  // Mini FAQ Section
  miniFaq: {
    titleKey: 'homev2_faqTitle',
    questions: [
      { qKey: 'homev2_faq1Q', aKey: 'homev2_faq1A' },
      { qKey: 'homev2_faq2Q', aKey: 'homev2_faq2A' },
      { qKey: 'homev2_faq3Q', aKey: 'homev2_faq3A' },
      { qKey: 'homev2_faq4Q', aKey: 'homev2_faq4A' },
      { qKey: 'homev2_faq5Q', aKey: 'homev2_faq5A' },
    ],
    viewAllKey: 'homev2_faqViewAll',
    viewAllHref: '/preguntas-frecuentes',
  },

  // Final CTA Section
  finalCta: {
    titleLine1Key: 'homev2_finalCtaTitle1',
    titleLine2Key: 'homev2_finalCtaTitle2',
    subtitleLine1Key: 'homev2_finalCtaSubtitle1',
    subtitleLine2Key: 'homev2_finalCtaSubtitle2',
    subtitleLine3Key: 'homev2_finalCtaSubtitle3',
    cta1TextKey: 'homev2_finalCta1',
    cta1Href: '/horarios-clases-baile-barcelona',
    cta2TextKey: 'homev2_finalCta2',
    cta2Href: '/precios-clases-baile-barcelona',
    trustLineKey: 'homev2_finalCtaTrust',
  },

  // Pattern Interrupts (frases entre secciones)
  patternInterrupts: {
    afterHero: 'homev2_interrupt1',
    afterFounder: 'homev2_interrupt2',
    afterMethod: 'homev2_interrupt3',
    afterComparison: 'homev2_interrupt4',
    afterStyles: 'homev2_interrupt5',
    beforeFinalCta: 'homev2_interrupt6',
  },
};

export type HomepageV2Config = typeof HOMEPAGE_V2_CONFIG;
