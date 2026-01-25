/**
 * Bachata Lady Style Page Configuration for LadyStyleTemplate
 *
 * Enterprise-grade configuration with:
 * - Dynamic Google Reviews filtering by 'bachata' category
 * - SEO/GEO/AIEO optimized structure
 * - Accessibility compliant
 * - Performance optimized (no dead code)
 */
import type { LadyStyleTemplateConfig } from '../components/templates/LadyStyleTemplate';

// Style comparison data for Bachata
const BACHATA_LADY_COMPARISON_DATA = {
  styles: [
    { key: 'bachataSensual', nameKey: 'bachataLadyCompareBachataSensual' },
    { key: 'bachataLadyStyle', nameKey: 'bachataLadyCompareBachataLady' },
    { key: 'salsaLadyStyle', nameKey: 'bachataLadyCompareSalsaLady' },
    { key: 'bachataModerna', nameKey: 'bachataLadyCompareBachataModerna' },
  ],
  rows: [
    { rowKey: 'bachataLadyCompareRow1', values: [4, 5, 3, 3] }, // Ondulaciones corporales
    { rowKey: 'bachataLadyCompareRow2', values: [4, 5, 5, 3] }, // Movimientos de cadera
    { rowKey: 'bachataLadyCompareRow3', values: [3, 5, 5, 2] }, // Uso de tacones
    { rowKey: 'bachataLadyCompareRow4', values: [5, 5, 5, 4] }, // Musicalidad - Salsa Lady: 5
    { rowKey: 'bachataLadyCompareRow5', values: [5, 3, 3, 5] }, // Conexión en pareja - Salsa Lady: 3
    { rowKey: 'bachataLadyCompareRow6', values: [5, 5, 4, 3] }, // Sensualidad - Salsa Lady: 4
    { rowKey: 'bachataLadyCompareRow7', values: [3, 4, 5, 5] }, // Ritmo y velocidad - Salsa Lady: 5
    { rowKey: 'bachataLadyCompareRow8', values: [4, 5, 5, 3] }, // Elegancia y estilo
  ],
};

export const BACHATA_LADY_STYLE_CONFIG: LadyStyleTemplateConfig = {
  // SEO
  pageSlug: 'bachata-lady-style-barcelona',
  pageTitleKey: 'bachataLadyPageTitle',
  metaDescriptionKey: 'bachataLadyMetaDescription',
  ogImage: '/images/og-bachata-lady-style.jpg',
  courseSchemaDescKey: 'bachataLadyCourseSchemaDesc',

  // Breadcrumb
  breadcrumb: {
    homeKey: 'bachataLadyBreadcrumbHome',
    classesKey: 'bachataLadyBreadcrumbClasses',
    parentKey: 'bachataLadyBreadcrumbLatin',
    parentUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'bachataLadyBreadcrumbCurrent',
  },

  // Hero
  hero: {
    titleKey: 'bachataLadyHeroTitle',
    subtitleKey: 'bachataLadyHeroSubtitle',
    descKey: 'bachataLadyHeroDesc',
    ctaKey: 'puertasAbiertasCTA',
    ctaSubtextKey: 'puertasAbiertasSubtext',
    stats: {
      rating: '4.9/5',
      reviewCount: '509+ reseñas',
      students: '+15.000 estudiantes formados',
      yearsText: '8 años en Barcelona',
    },
  },

  // Enterprise Image Configuration
  // Maps to STYLE_IMAGES in constants/style-images.ts
  images: {
    styleKey: 'bachata_lady_style',
  },

  // Hero Visual Configuration - Enterprise
  heroVisuals: {
    imageOpacity: 100,
    objectPosition: 'center 25%',
    gradientStyle: 'vibrant',
    textShadow: true,
    heroTextStyle: 'simple',
  },

  // What is section
  whatIs: {
    titleKey: 'bachataLadyWhatIsTitle',
    descKey: 'bachataLadyWhatIsDesc',
    quoteKey: 'bachataLadyWhatIsQuote',
    quoteAuthor: {
      name: 'Eugenia Trujillo',
      credentialKey: 'bachataLadyTeacherCredential',
      image: '/images/teachers/img/profesora-eugenio-trujillo_320.webp',
      objectPosition: 'center 35%',
    },
  },

  // Schedule
  schedules: [
    {
      id: '1',
      dayKey: 'thursday',
      className: 'Bachata Lady Style',
      time: '21:00 - 22:00',
      teacher: 'Eugenia Trujillo',
      levelKey: 'openLevel',
    },
  ],
  scheduleTitleKey: 'bachataLadyScheduleTitle',
  scheduleSubtitleKey: 'bachataLadyScheduleSubtitle',

  // Levels - Open Level only
  levels: [
    {
      id: 'open-level',
      levelKey: 'openLevel',
      titleKey: 'bachataLadyLevelOpenTitle',
      descKey: 'bachataLadyLevelOpenDesc',
      duration: 'Todos los niveles',
      color: 'primary-accent',
    },
  ],
  levelsTitleKey: 'bachataLadyLevelsTitle',

  // Teachers - Only Eugenia
  teachers: [
    {
      name: 'Eugenia Trujillo',
      specialty: 'bachataLadyTeacher2Specialty',
      bio: 'bachataLadyTeacher2Bio',
      image: '/images/teachers/img/profesora-eugenio-trujillo_320.webp',
      objectPosition: 'center 35%',
    },
  ],
  teachersTitleKey: 'bachataLadyTeachersTitle',
  teachersSubtitleKey: 'bachataLadyTeachersSubtitle',
  teachersClosingKey: 'bachataLadyTeachersClosing',

  // Prepare
  prepareConfig: {
    prefix: 'bachataLadyPrepare',
    whatToBringCount: 5,
    beforeCount: 3,
    avoidCount: 3,
    teacher: {
      name: 'Eugenia Trujillo',
      credential: 'Campeona Mundial Salsa LA | Especialista en Bachata',
      image: '/images/teachers/img/profesora-eugenio-trujillo_320.webp',
      objectPosition: 'center 35%',
    },
  },
  prepareTitleKey: 'bachataLadyPrepareTitle',
  prepareSubtitleKey: 'bachataLadyPrepareSubtitle',

  // Identification
  identify: {
    titleKey: 'bachataLadyIdentifyTitle',
    count: 6,
    prefixKey: 'bachataLadyIdentify',
    transitionKey: 'bachataLadyIdentifyTransition',
    needTitleKey: 'bachataLadyIdentifyNeedTitle',
    solutionKey: 'bachataLadyIdentifySolution',
    closingKey: 'bachataLadyIdentifyClosing',
  },

  // Pillars - Bachata specific: ondulación, sensualidad, caderas, brazos, musicalidad, presencia
  pillars: [
    {
      id: 'ondulacion',
      icon: 'ondulacion',
      titleKey: 'bachataLadyPillar1Title',
      subtitleKey: 'bachataLadyPillar1Subtitle',
      descKey: 'bachataLadyPillar1Desc',
      itemKeys: ['bachataLadyPillar1Item1', 'bachataLadyPillar1Item2', 'bachataLadyPillar1Item3'],
      resultKey: 'bachataLadyPillar1Result',
    },
    {
      id: 'sensualidad',
      icon: 'sensualidad',
      titleKey: 'bachataLadyPillar2Title',
      subtitleKey: 'bachataLadyPillar2Subtitle',
      descKey: 'bachataLadyPillar2Desc',
      itemKeys: ['bachataLadyPillar2Item1', 'bachataLadyPillar2Item2', 'bachataLadyPillar2Item3'],
      resultKey: 'bachataLadyPillar2Result',
    },
    {
      id: 'caderas',
      icon: 'caderas',
      titleKey: 'bachataLadyPillar3Title',
      subtitleKey: 'bachataLadyPillar3Subtitle',
      descKey: 'bachataLadyPillar3Desc',
      itemKeys: ['bachataLadyPillar3Item1', 'bachataLadyPillar3Item2', 'bachataLadyPillar3Item3'],
      resultKey: 'bachataLadyPillar3Result',
    },
    {
      id: 'braceo',
      icon: 'braceo',
      titleKey: 'bachataLadyPillar4Title',
      subtitleKey: 'bachataLadyPillar4Subtitle',
      descKey: 'bachataLadyPillar4Desc',
      itemKeys: ['bachataLadyPillar4Item1', 'bachataLadyPillar4Item2', 'bachataLadyPillar4Item3'],
      resultKey: 'bachataLadyPillar4Result',
    },
    {
      id: 'musicalidad',
      icon: 'musicalidad',
      titleKey: 'bachataLadyPillar5Title',
      subtitleKey: 'bachataLadyPillar5Subtitle',
      descKey: 'bachataLadyPillar5Desc',
      itemKeys: ['bachataLadyPillar5Item1', 'bachataLadyPillar5Item2', 'bachataLadyPillar5Item3'],
      resultKey: 'bachataLadyPillar5Result',
    },
    {
      id: 'presencia',
      icon: 'presencia',
      titleKey: 'bachataLadyPillar6Title',
      subtitleKey: 'bachataLadyPillar6Subtitle',
      descKey: 'bachataLadyPillar6Desc',
      itemKeys: ['bachataLadyPillar6Item1', 'bachataLadyPillar6Item2', 'bachataLadyPillar6Item3'],
      resultKey: 'bachataLadyPillar6Result',
    },
  ],
  pillarsSectionTitleKey: 'bachataLadyPillarsSectionTitle',
  pillarsSectionSubtitleKey: 'bachataLadyPillarsSectionSubtitle',

  // Comparison
  comparison: {
    titleKey: 'bachataLadyCompareTitle',
    aspectKey: 'bachataLadyCompareAspect',
    othersColumnKey: 'bachataLadyCompareOthers',
    methodColumnKey: 'bachataLadyCompareFarray',
    rows: [
      {
        labelKey: 'bachataLadyCompareRow1Label',
        othersKey: 'bachataLadyCompareRow1Others',
        methodKey: 'bachataLadyCompareRow1Farray',
      },
      {
        labelKey: 'bachataLadyCompareRow2Label',
        othersKey: 'bachataLadyCompareRow2Others',
        methodKey: 'bachataLadyCompareRow2Farray',
      },
      {
        labelKey: 'bachataLadyCompareRow3Label',
        othersKey: 'bachataLadyCompareRow3Others',
        methodKey: 'bachataLadyCompareRow3Farray',
      },
      {
        labelKey: 'bachataLadyCompareRow4Label',
        othersKey: 'bachataLadyCompareRow4Others',
        methodKey: 'bachataLadyCompareRow4Farray',
      },
      {
        labelKey: 'bachataLadyCompareRow5Label',
        othersKey: 'bachataLadyCompareRow5Others',
        methodKey: 'bachataLadyCompareRow5Farray',
      },
      {
        labelKey: 'bachataLadyCompareRow6Label',
        othersKey: 'bachataLadyCompareRow6Others',
        methodKey: 'bachataLadyCompareRow6Farray',
      },
      {
        labelKey: 'bachataLadyCompareRow7Label',
        othersKey: 'bachataLadyCompareRow7Others',
        methodKey: 'bachataLadyCompareRow7Farray',
      },
      {
        labelKey: 'bachataLadyCompareRow8Label',
        othersKey: 'bachataLadyCompareRow8Others',
        methodKey: 'bachataLadyCompareRow8Farray',
      },
    ],
  },

  // For who
  forWho: {
    titleKey: 'bachataLadyForWhoTitle',
    yesTitle: 'bachataLadyForYesTitle',
    yesPrefixKey: 'bachataLadyForYes',
    yesCount: 8,
    noTitle: 'bachataLadyForNoTitle',
    noPrefixKey: 'bachataLadyForNo',
    noCount: 4,
    ctaTextKey: 'bachataLadyForWhoCTA',
  },

  // Transformation
  transformation: {
    titleKey: 'bachataLadyTransformTitle',
    aspectKey: 'bachataLadyTransformAspect',
    beforeKey: 'bachataLadyTransformBefore',
    afterKey: 'bachataLadyTransformAfter',
    rows: [
      {
        id: 'ondulaciones',
        labelKey: 'bachataLadyTransformondulacionesLabel',
        beforeKey: 'bachataLadyTransformondulacionesBefore',
        afterKey: 'bachataLadyTransformondulacionesAfter',
      },
      {
        id: 'caderas',
        labelKey: 'bachataLadyTransformcaderasLabel',
        beforeKey: 'bachataLadyTransformcaderasBefore',
        afterKey: 'bachataLadyTransformcaderasAfter',
      },
      {
        id: 'brazos',
        labelKey: 'bachataLadyTransformbrazosLabel',
        beforeKey: 'bachataLadyTransformbrazosBefore',
        afterKey: 'bachataLadyTransformbrazosAfter',
      },
      {
        id: 'sensualidad',
        labelKey: 'bachataLadyTransformsensualidadLabel',
        beforeKey: 'bachataLadyTransformsensualidadBefore',
        afterKey: 'bachataLadyTransformsensualidadAfter',
      },
      {
        id: 'giros',
        labelKey: 'bachataLadyTransformgirosLabel',
        beforeKey: 'bachataLadyTransformgirosBefore',
        afterKey: 'bachataLadyTransformgirosAfter',
      },
      {
        id: 'confianza',
        labelKey: 'bachataLadyTransformconfianzaLabel',
        beforeKey: 'bachataLadyTransformconfianzaBefore',
        afterKey: 'bachataLadyTransformconfianzaAfter',
      },
      {
        id: 'estilo',
        labelKey: 'bachataLadyTransformestiloLabel',
        beforeKey: 'bachataLadyTransformestiloBefore',
        afterKey: 'bachataLadyTransformestiloAfter',
      },
    ],
  },

  // Why choose
  whyChoose: {
    titleKey: 'bachataLadyWhyChooseTitle',
    items: [
      { titleKey: 'bachataLadyWhyChoose1Title', descKey: 'bachataLadyWhyChoose1Desc' },
      { titleKey: 'bachataLadyWhyChoose2Title', descKey: 'bachataLadyWhyChoose2Desc' },
      { titleKey: 'bachataLadyWhyChoose3Title', descKey: 'bachataLadyWhyChoose3Desc' },
      { titleKey: 'bachataLadyWhyChoose4Title', descKey: 'bachataLadyWhyChoose4Desc' },
      { titleKey: 'bachataLadyWhyChoose5Title', descKey: 'bachataLadyWhyChoose5Desc' },
      { titleKey: 'bachataLadyWhyChoose6Title', descKey: 'bachataLadyWhyChoose6Desc' },
      { titleKey: 'bachataLadyWhyChoose7Title', descKey: 'bachataLadyWhyChoose7Desc' },
    ],
  },

  // Stats
  stats: {
    years: 8,
    activeStudents: 1500,
    totalStudents: 15000,
  },

  // Logos
  logos: {
    titleKey: 'bachataLadyLogosTitle',
    items: [
      {
        src: '/images/cid-unesco-logo.webp',
        alt: 'CID UNESCO - Consejo Internacional de la Danza',
        name: 'CID UNESCO',
      },
      {
        src: '/images/Street-Dance-2.webp',
        alt: 'Street Dance 2 - Película de danza urbana',
        name: 'Street Dance 2',
      },
      {
        src: '/images/the-dancer-espectaculo-baile-cuadrada.webp',
        alt: 'The Dancer - Espectáculo de baile',
        name: 'The Dancer',
      },
      {
        src: '/images/telecinco-logo.webp',
        alt: 'Telecinco - Cadena de televisión española',
        name: 'TV 5',
      },
    ],
    festivalTextKey: 'bachataLadyLogosIntlFestivalsText',
  },

  // Video - Enterprise: Shows "Video Próximamente" placeholder (not clickable)
  video: {
    id: '', // Empty = shows Coming Soon placeholder
    titleKey: 'bachataLadyVideoTitle',
    descKey: 'bachataLadyVideoDesc',
  },

  // Google Reviews Section - Enterprise mode with dynamic filtering
  googleReviewsSection: {
    enabled: true,
    category: 'bachata',
    limit: 6,
    showGoogleBadge: true,
    layout: 'grid',
  },

  // Style comparison
  styleComparison: {
    titleKey: 'bachataLadyStyleCompareTitle',
    subtitleKey: 'bachataLadyStyleCompareSubtitle',
    featureKey: 'bachataLadyStyleCompareFeature',
    data: BACHATA_LADY_COMPARISON_DATA,
  },

  // Cultural history
  cultural: {
    titleKey: 'bachataLadyCulturalTitle',
    shortDescKey: 'bachataLadyCulturalShort',
    fullHistoryKey: 'bachataLadyCulturalFull',
  },

  // FAQs
  faqs: [
    { id: 'bachata-lady-1', questionKey: 'bachataLadyFaqQ1', answerKey: 'bachataLadyFaqA1' },
    { id: 'bachata-lady-2', questionKey: 'bachataLadyFaqQ2', answerKey: 'bachataLadyFaqA2' },
    { id: 'bachata-lady-3', questionKey: 'bachataLadyFaqQ3', answerKey: 'bachataLadyFaqA3' },
    { id: 'bachata-lady-4', questionKey: 'bachataLadyFaqQ4', answerKey: 'bachataLadyFaqA4' },
    { id: 'bachata-lady-5', questionKey: 'bachataLadyFaqQ5', answerKey: 'bachataLadyFaqA5' },
    { id: 'bachata-lady-6', questionKey: 'bachataLadyFaqQ6', answerKey: 'bachataLadyFaqA6' },
    { id: 'bachata-lady-7', questionKey: 'bachataLadyFaqQ7', answerKey: 'bachataLadyFaqA7' },
    { id: 'bachata-lady-8', questionKey: 'bachataLadyFaqQ8', answerKey: 'bachataLadyFaqA8' },
    { id: 'bachata-lady-9', questionKey: 'bachataLadyFaqQ9', answerKey: 'bachataLadyFaqA9' },
    { id: 'bachata-lady-10', questionKey: 'bachataLadyFaqQ10', answerKey: 'bachataLadyFaqA10' },
    { id: 'bachata-lady-11', questionKey: 'bachataLadyFaqQ11', answerKey: 'bachataLadyFaqA11' },
    { id: 'bachata-lady-12', questionKey: 'bachataLadyFaqQ12', answerKey: 'bachataLadyFaqA12' },
    { id: 'bachata-lady-13', questionKey: 'bachataLadyFaqQ13', answerKey: 'bachataLadyFaqA13' },
    { id: 'bachata-lady-14', questionKey: 'bachataLadyFaqQ14', answerKey: 'bachataLadyFaqA14' },
    { id: 'bachata-lady-15', questionKey: 'bachataLadyFaqQ15', answerKey: 'bachataLadyFaqA15' },
  ],
  faqTitleKey: 'bachataLadyFaqTitle',

  // Nearby areas
  nearby: {
    titleKey: 'bachataLadyNearbyTitle',
    descKey: 'bachataLadyNearbyDesc',
    searchTextKey: 'bachataLadyNearbySearchText',
    metroKey: 'bachataLadyNearbyMetro',
    areas: [
      { name: 'Plaza España', time: '5 min' },
      { name: 'Hostafrancs', time: '5 min' },
      { name: 'Sants Estació', time: '10 min' },
      { name: 'Les Corts', time: '15 min' },
      { name: 'Eixample Esquerra', time: '15 min' },
      { name: 'Poble Sec', time: '10 min' },
      { name: 'Sant Antoni', time: '12 min' },
      { name: "L'Hospitalet", time: '10 min' },
    ],
  },

  // Final CTA
  finalCta: {
    titleKey: 'bachataLadyFinalCTATitle',
    descKey: 'bachataLadyFinalCTADesc',
    ctaKey: 'puertasAbiertasCTA',
    ctaSubtextKey: 'puertasAbiertasSubtext',
  },
};
