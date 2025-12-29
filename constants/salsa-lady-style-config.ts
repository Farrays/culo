/**
 * Salsa Lady Style Page Configuration for LadyStyleTemplate
 *
 * This file contains all the configuration needed for the LadyStyleTemplate
 * to render the complete Salsa Lady Style page.
 */
import type { LadyStyleTemplateConfig } from '../components/templates/LadyStyleTemplate';
import { GOOGLE_REVIEWS_TESTIMONIALS } from './testimonials';
import type { Testimonial } from '../types';
import { getTeacherInfo, getTeacherQuoteInfo } from './teacher-images';

// Testimonials for Salsa Lady Style page
const SALSA_LADY_STYLE_TESTIMONIALS: Testimonial[] = [
  ...GOOGLE_REVIEWS_TESTIMONIALS,
  {
    id: 4,
    name: 'Laura G.',
    image: '',
    rating: 5,
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      en: 'The Lady Style classes with Yunaisy transformed my way of dancing completely. Now I feel elegant, confident and my movements have a feminine quality I never thought possible. The Farray Method is unique.',
      es: 'Las clases de Lady Style con Yunaisy transformaron mi forma de bailar por completo. Ahora me siento elegante, segura y mis movimientos tienen una calidad femenina que nunca pensé posible. El Método Farray es único.',
      ca: 'Les classes de Lady Style amb Yunaisy van transformar la meva forma de ballar completament. Ara em sento elegant, segura i els meus moviments tenen una qualitat femenina que mai vaig pensar possible. El Mètode Farray és únic.',
      fr: "Les cours de Lady Style avec Yunaisy ont complètement transformé ma façon de danser. Maintenant je me sens élégante, confiante et mes mouvements ont une qualité féminine que je n'aurais jamais cru possible. La Méthode Farray est unique.",
    },
  },
];

// Style comparison data
const SALSA_LADY_COMPARISON_DATA = {
  styles: [
    { key: 'salsaCubanaPareja', nameKey: 'salsaLadyCompareSalsaPareja' },
    { key: 'salsaLadyTimba', nameKey: 'salsaLadyCompareSalsaLady' },
    { key: 'bachataLadyStyle', nameKey: 'salsaLadyCompareBachataLady' },
    { key: 'timba', nameKey: 'salsaLadyCompareTimba' },
  ],
  rows: [
    { rowKey: 'salsaLadyCompareRow1', values: [3, 5, 4, 3] },
    { rowKey: 'salsaLadyCompareRow2', values: [3, 5, 3, 4] },
    { rowKey: 'salsaLadyCompareRow3', values: [2, 5, 5, 2] },
    { rowKey: 'salsaLadyCompareRow4', values: [4, 5, 4, 5] },
    { rowKey: 'salsaLadyCompareRow5', values: [5, 3, 2, 5] },
    { rowKey: 'salsaLadyCompareRow6', values: [3, 5, 4, 4] },
    { rowKey: 'salsaLadyCompareRow7', values: [4, 4, 3, 5] },
    { rowKey: 'salsaLadyCompareRow8', values: [3, 5, 4, 3] },
  ],
};

export const SALSA_LADY_STYLE_CONFIG: LadyStyleTemplateConfig = {
  // SEO
  pageSlug: 'salsa-lady-style-barcelona',
  pageTitleKey: 'salsaLadyPageTitle',
  metaDescriptionKey: 'salsaLadyMetaDescription',
  ogImage: '/images/og-salsa-lady-style.jpg',
  courseSchemaDescKey: 'salsaLadyCourseSchemaDesc',

  // Breadcrumb
  breadcrumb: {
    homeKey: 'salsaLadyBreadcrumbHome',
    classesKey: 'salsaLadyBreadcrumbClasses',
    parentKey: 'salsaLadyBreadcrumbLatin',
    parentUrl: '/clases/salsa-bachata-barcelona',
    currentKey: 'salsaLadyBreadcrumbCurrent',
  },

  // Hero
  hero: {
    titleKey: 'salsaLadyHeroTitle',
    subtitleKey: 'salsaLadyHeroSubtitle',
    descKey: 'salsaLadyHeroDesc',
    ctaKey: 'puertasAbiertasCTA',
    ctaSubtextKey: 'puertasAbiertasSubtext',
    stats: {
      rating: '4.9/5',
      reviewCountKey: 'salsaLadyStatReviewCount',
      studentsKey: 'salsaLadyStatStudents',
      yearsTextKey: 'salsaLadyStatYears',
    },
  },

  // Enterprise Image Configuration
  // Maps to STYLE_IMAGES in constants/style-images.ts
  images: {
    styleKey: 'salsa_lady_style',
  },

  // Hero Visual Configuration - Enterprise-level optimization
  // Configured for the vibrant red Salsa Lady Style performance image
  heroVisuals: {
    imageOpacity: 55, // Increased from 40% for better visibility
    objectPosition: 'center 30%', // Focus on dancers' upper bodies and poses
    gradientStyle: 'vibrant', // Bottom-to-top gradient for readable text
    textShadow: true, // Enhanced text contrast against vibrant background
  },

  // What is section - Enterprise: Sistema centralizado con imágenes optimizadas
  whatIs: (() => {
    const yunaisy = getTeacherQuoteInfo('yunaisy-farray', "Directora de Farray's Center");
    return {
      titleKey: 'salsaLadyWhatIsTitle',
      descKey: 'salsaLadyWhatIsDesc',
      quoteKey: 'salsaLadyWhatIsQuote',
      quoteAuthor: {
        name: yunaisy.name,
        credentialKey: 'salsaLadyTeacherCredential',
        image: yunaisy.image,
        imageSrcSet: yunaisy.imageSrcSet,
        imageSrcSetAvif: yunaisy.imageSrcSetAvif,
        objectPosition: yunaisy.objectPosition,
      },
    };
  })(),

  // Schedule
  schedules: [
    {
      id: '1',
      dayKey: 'monday',
      classNameKey: 'salsaLadyScheduleClassIntermediate',
      time: '19:00 - 20:00',
      teacher: 'Yunaisy Farray',
      levelKey: 'intermediateLevel',
    },
    {
      id: '2',
      dayKey: 'wednesday',
      classNameKey: 'salsaLadyScheduleClassBeginner',
      time: '11:00 - 12:00',
      teacher: 'Yasmina Fernández',
      levelKey: 'beginnerLevel',
    },
    {
      id: '3',
      dayKey: 'wednesday',
      classNameKey: 'salsaLadyScheduleClassBasic',
      time: '19:00 - 20:00',
      teacher: 'Yunaisy Farray',
      levelKey: 'basicLevel',
    },
    {
      id: '4',
      dayKey: 'wednesday',
      classNameKey: 'salsaLadyScheduleClassBeginner',
      time: '20:00 - 21:00',
      teacher: 'Lía Valdes',
      levelKey: 'beginnerLevel',
    },
  ],
  scheduleTitleKey: 'salsaLadyScheduleTitle',
  scheduleSubtitleKey: 'salsaLadyScheduleSubtitle',

  // Levels
  levels: [
    {
      id: 'principiante',
      levelKey: 'beginnerLevel',
      titleKey: 'salsaLadyLevelBeginnerTitle',
      descKey: 'salsaLadyLevelBeginnerDesc',
      durationKey: 'salsaLadyDuration1',
      color: 'primary-dark',
    },
    {
      id: 'basico',
      levelKey: 'basicLevel',
      titleKey: 'salsaLadyLevelBasicTitle',
      descKey: 'salsaLadyLevelBasicDesc',
      durationKey: 'salsaLadyDuration2',
      color: 'primary-dark-mid',
    },
    {
      id: 'intermedio',
      levelKey: 'intermediateLevel',
      titleKey: 'salsaLadyLevelIntermediateTitle',
      descKey: 'salsaLadyLevelIntermediateDesc',
      durationKey: 'salsaLadyDuration3',
      color: 'primary-accent-light',
    },
    {
      id: 'avanzado',
      levelKey: 'advancedLevel',
      titleKey: 'salsaLadyLevelAdvancedTitle',
      descKey: 'salsaLadyLevelAdvancedDesc',
      durationKey: 'salsaLadyDuration4',
      color: 'primary-accent',
    },
  ],
  levelsTitleKey: 'salsaLadyLevelsTitle',

  // Teachers - Enterprise: Sistema centralizado con srcSet y AVIF
  teachers: (() => {
    const yunaisy = getTeacherInfo(
      'yunaisy-farray',
      'salsaLadyTeacherCredential',
      'salsaLadyTeacherBio'
    );
    const lia = getTeacherInfo('lia-valdes', 'salsaLadyTeacher2Specialty', 'salsaLadyTeacher2Bio');
    const yasmina = getTeacherInfo(
      'yasmina-fernandez',
      'salsaLadyTeacher3Specialty',
      'salsaLadyTeacher3Bio'
    );
    return [
      {
        name: yunaisy.name,
        specialty: yunaisy.specialtyKey,
        bio: yunaisy.bioKey,
        image: yunaisy.image,
        imageSrcSet: yunaisy.imageSrcSet,
        imageSrcSetAvif: yunaisy.imageSrcSetAvif,
        objectPosition: yunaisy.objectPosition,
      },
      {
        name: lia.name,
        specialty: lia.specialtyKey,
        bio: lia.bioKey,
        image: lia.image,
        imageSrcSet: lia.imageSrcSet,
        imageSrcSetAvif: lia.imageSrcSetAvif,
        objectPosition: lia.objectPosition,
      },
      {
        name: yasmina.name,
        specialty: yasmina.specialtyKey,
        bio: yasmina.bioKey,
        image: yasmina.image,
        imageSrcSet: yasmina.imageSrcSet,
        imageSrcSetAvif: yasmina.imageSrcSetAvif,
        objectPosition: yasmina.objectPosition,
      },
    ];
  })(),
  teachersTitleKey: 'salsaLadyTeachersTitle',
  teachersSubtitleKey: 'salsaLadyTeachersSubtitle',
  teachersClosingKey: 'salsaLadyTeachersClosing',

  // Prepare - Enterprise: Sistema centralizado con imágenes optimizadas
  prepareConfig: {
    prefix: 'salsaLadyPrepare',
    whatToBringCount: 5,
    beforeCount: 3,
    avoidCount: 3,
    teacher: getTeacherQuoteInfo('yunaisy-farray', "Directora de Farray's Center"),
  },
  prepareTitleKey: 'salsaLadyPrepareTitle',
  prepareSubtitleKey: 'salsaLadyPrepareSubtitle',

  // Identification
  identify: {
    titleKey: 'salsaLadyIdentifyTitle',
    count: 6,
    prefixKey: 'salsaLadyIdentify',
    transitionKey: 'salsaLadyIdentifyTransition',
    needTitleKey: 'salsaLadyIdentifyNeedTitle',
    solutionKey: 'salsaLadyIdentifySolution',
    closingKey: 'salsaLadyIdentifyClosing',
  },

  // Pillars
  pillars: [
    {
      id: 'braceo',
      icon: 'braceo',
      titleKey: 'salsaLadyV2Pillar1Title',
      subtitleKey: 'salsaLadyV2Pillar1Subtitle',
      descKey: 'salsaLadyV2Pillar1Desc',
      itemKeys: ['salsaLadyV2Pillar1Item1', 'salsaLadyV2Pillar1Item2', 'salsaLadyV2Pillar1Item3'],
      resultKey: 'salsaLadyV2Pillar1Result',
    },
    {
      id: 'caderas',
      icon: 'caderas',
      titleKey: 'salsaLadyV2Pillar2Title',
      subtitleKey: 'salsaLadyV2Pillar2Subtitle',
      descKey: 'salsaLadyV2Pillar2Desc',
      itemKeys: ['salsaLadyV2Pillar2Item1', 'salsaLadyV2Pillar2Item2', 'salsaLadyV2Pillar2Item3'],
      resultKey: 'salsaLadyV2Pillar2Result',
    },
    {
      id: 'giros',
      icon: 'giros',
      titleKey: 'salsaLadyV2Pillar3Title',
      subtitleKey: 'salsaLadyV2Pillar3Subtitle',
      descKey: 'salsaLadyV2Pillar3Desc',
      itemKeys: ['salsaLadyV2Pillar3Item1', 'salsaLadyV2Pillar3Item2', 'salsaLadyV2Pillar3Item3'],
      resultKey: 'salsaLadyV2Pillar3Result',
    },
    {
      id: 'tacones',
      icon: 'tacones',
      titleKey: 'salsaLadyV2Pillar4Title',
      subtitleKey: 'salsaLadyV2Pillar4Subtitle',
      descKey: 'salsaLadyV2Pillar4Desc',
      itemKeys: ['salsaLadyV2Pillar4Item1', 'salsaLadyV2Pillar4Item2', 'salsaLadyV2Pillar4Item3'],
      resultKey: 'salsaLadyV2Pillar4Result',
    },
    {
      id: 'musicalidad',
      icon: 'musicalidad',
      titleKey: 'salsaLadyV2Pillar5Title',
      subtitleKey: 'salsaLadyV2Pillar5Subtitle',
      descKey: 'salsaLadyV2Pillar5Desc',
      itemKeys: ['salsaLadyV2Pillar5Item1', 'salsaLadyV2Pillar5Item2', 'salsaLadyV2Pillar5Item3'],
      resultKey: 'salsaLadyV2Pillar5Result',
    },
    {
      id: 'presencia',
      icon: 'presencia',
      titleKey: 'salsaLadyV2Pillar6Title',
      subtitleKey: 'salsaLadyV2Pillar6Subtitle',
      descKey: 'salsaLadyV2Pillar6Desc',
      itemKeys: ['salsaLadyV2Pillar6Item1', 'salsaLadyV2Pillar6Item2', 'salsaLadyV2Pillar6Item3'],
      resultKey: 'salsaLadyV2Pillar6Result',
    },
  ],
  pillarsSectionTitleKey: 'salsaLadyV2PillarsSectionTitle',
  pillarsSectionSubtitleKey: 'salsaLadyV2PillarsSectionSubtitle',

  // Comparison
  comparison: {
    titleKey: 'salsaLadyV2CompareTitle',
    aspectKey: 'salsaLadyV2CompareAspect',
    othersColumnKey: 'salsaLadyV2CompareOthers',
    methodColumnKey: 'salsaLadyV2CompareFarray',
    rows: [
      {
        labelKey: 'salsaLadyV2CompareRow1Label',
        othersKey: 'salsaLadyV2CompareRow1Others',
        methodKey: 'salsaLadyV2CompareRow1Farray',
      },
      {
        labelKey: 'salsaLadyV2CompareRow2Label',
        othersKey: 'salsaLadyV2CompareRow2Others',
        methodKey: 'salsaLadyV2CompareRow2Farray',
      },
      {
        labelKey: 'salsaLadyV2CompareRow3Label',
        othersKey: 'salsaLadyV2CompareRow3Others',
        methodKey: 'salsaLadyV2CompareRow3Farray',
      },
      {
        labelKey: 'salsaLadyV2CompareRow4Label',
        othersKey: 'salsaLadyV2CompareRow4Others',
        methodKey: 'salsaLadyV2CompareRow4Farray',
      },
      {
        labelKey: 'salsaLadyV2CompareRow5Label',
        othersKey: 'salsaLadyV2CompareRow5Others',
        methodKey: 'salsaLadyV2CompareRow5Farray',
      },
      {
        labelKey: 'salsaLadyV2CompareRow6Label',
        othersKey: 'salsaLadyV2CompareRow6Others',
        methodKey: 'salsaLadyV2CompareRow6Farray',
      },
      {
        labelKey: 'salsaLadyV2CompareRow7Label',
        othersKey: 'salsaLadyV2CompareRow7Others',
        methodKey: 'salsaLadyV2CompareRow7Farray',
      },
      {
        labelKey: 'salsaLadyV2CompareRow8Label',
        othersKey: 'salsaLadyV2CompareRow8Others',
        methodKey: 'salsaLadyV2CompareRow8Farray',
      },
    ],
  },

  // For who
  forWho: {
    titleKey: 'salsaLadyV2ForWhoTitle',
    yesTitle: 'salsaLadyV2ForYesTitle',
    yesPrefixKey: 'salsaLadyV2ForYes',
    yesCount: 8,
    noTitle: 'salsaLadyV2ForNoTitle',
    noPrefixKey: 'salsaLadyV2ForNo',
    noCount: 4,
    ctaTextKey: 'salsaLadyV2ForWhoCTA',
  },

  // Transformation
  transformation: {
    titleKey: 'salsaLadyV2TransformTitle',
    aspectKey: 'salsaLadyV2TransformAspect',
    beforeKey: 'salsaLadyV2TransformBefore',
    afterKey: 'salsaLadyV2TransformAfter',
    rows: [
      {
        id: 'brazos',
        labelKey: 'salsaLadyV2TransformbrazosLabel',
        beforeKey: 'salsaLadyV2TransformbrazosBefore',
        afterKey: 'salsaLadyV2TransformbrazosAfter',
      },
      {
        id: 'caderas',
        labelKey: 'salsaLadyV2TransformcaderasLabel',
        beforeKey: 'salsaLadyV2TransformcaderasBefore',
        afterKey: 'salsaLadyV2TransformcaderasAfter',
      },
      {
        id: 'giros',
        labelKey: 'salsaLadyV2TransformgirosLabel',
        beforeKey: 'salsaLadyV2TransformgirosBefore',
        afterKey: 'salsaLadyV2TransformgirosAfter',
      },
      {
        id: 'tacones',
        labelKey: 'salsaLadyV2TransformtaconesLabel',
        beforeKey: 'salsaLadyV2TransformtaconesBefore',
        afterKey: 'salsaLadyV2TransformtaconesAfter',
      },
      {
        id: 'shines',
        labelKey: 'salsaLadyV2TransformshinesLabel',
        beforeKey: 'salsaLadyV2TransformshinesBefore',
        afterKey: 'salsaLadyV2TransformshinesAfter',
      },
      {
        id: 'confianza',
        labelKey: 'salsaLadyV2TransformconfianzaLabel',
        beforeKey: 'salsaLadyV2TransformconfianzaBefore',
        afterKey: 'salsaLadyV2TransformconfianzaAfter',
      },
      {
        id: 'estilo',
        labelKey: 'salsaLadyV2TransformestiloLabel',
        beforeKey: 'salsaLadyV2TransformestiloBefore',
        afterKey: 'salsaLadyV2TransformestiloAfter',
      },
    ],
  },

  // Why choose
  whyChoose: {
    titleKey: 'salsaLadyWhyChooseTitle',
    items: [
      { titleKey: 'salsaLadyWhyChoose1Title', descKey: 'salsaLadyWhyChoose1Desc' },
      { titleKey: 'salsaLadyWhyChoose2Title', descKey: 'salsaLadyWhyChoose2Desc' },
      { titleKey: 'salsaLadyWhyChoose3Title', descKey: 'salsaLadyWhyChoose3Desc' },
      { titleKey: 'salsaLadyWhyChoose4Title', descKey: 'salsaLadyWhyChoose4Desc' },
      { titleKey: 'salsaLadyWhyChoose5Title', descKey: 'salsaLadyWhyChoose5Desc' },
      { titleKey: 'salsaLadyWhyChoose6Title', descKey: 'salsaLadyWhyChoose6Desc' },
      { titleKey: 'salsaLadyWhyChoose7Title', descKey: 'salsaLadyWhyChoose7Desc' },
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
    titleKey: 'salsaLadyLogosTitle',
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
    festivalTextKey: 'salsaLadyLogosIntlFestivalsText',
  },

  // Video
  video: {
    id: 'C5sQnx-uNhI',
    titleKey: 'salsaLadyVideoTitle',
    descKey: 'salsaLadyVideoDesc',
  },

  // Testimonials
  testimonials: SALSA_LADY_STYLE_TESTIMONIALS,

  // Style comparison
  styleComparison: {
    titleKey: 'salsaLadyCompareTitle',
    subtitleKey: 'salsaLadyCompareSubtitle',
    featureKey: 'salsaLadyCompareFeature',
    data: SALSA_LADY_COMPARISON_DATA,
  },

  // Cultural history
  cultural: {
    titleKey: 'salsaLadyCulturalTitle',
    shortDescKey: 'salsaLadyCulturalShort',
    fullHistoryKey: 'salsaLadyCulturalFull',
  },

  // FAQs
  faqs: [
    { id: 'salsa-lady-1', questionKey: 'salsaLadyFaqQ1', answerKey: 'salsaLadyFaqA1' },
    { id: 'salsa-lady-2', questionKey: 'salsaLadyFaqQ2', answerKey: 'salsaLadyFaqA2' },
    { id: 'salsa-lady-3', questionKey: 'salsaLadyFaqQ3', answerKey: 'salsaLadyFaqA3' },
    { id: 'salsa-lady-4', questionKey: 'salsaLadyFaqQ4', answerKey: 'salsaLadyFaqA4' },
    { id: 'salsa-lady-5', questionKey: 'salsaLadyFaqQ5', answerKey: 'salsaLadyFaqA5' },
    { id: 'salsa-lady-6', questionKey: 'salsaLadyFaqQ6', answerKey: 'salsaLadyFaqA6' },
    { id: 'salsa-lady-7', questionKey: 'salsaLadyFaqQ7', answerKey: 'salsaLadyFaqA7' },
    { id: 'salsa-lady-8', questionKey: 'salsaLadyFaqQ8', answerKey: 'salsaLadyFaqA8' },
    { id: 'salsa-lady-9', questionKey: 'salsaLadyFaqQ9', answerKey: 'salsaLadyFaqA9' },
    { id: 'salsa-lady-10', questionKey: 'salsaLadyFaqQ10', answerKey: 'salsaLadyFaqA10' },
    { id: 'salsa-lady-11', questionKey: 'salsaLadyFaqQ11', answerKey: 'salsaLadyFaqA11' },
    { id: 'salsa-lady-12', questionKey: 'salsaLadyFaqQ12', answerKey: 'salsaLadyFaqA12' },
    { id: 'salsa-lady-13', questionKey: 'salsaLadyFaqQ13', answerKey: 'salsaLadyFaqA13' },
    { id: 'salsa-lady-14', questionKey: 'salsaLadyFaqQ14', answerKey: 'salsaLadyFaqA14' },
    { id: 'salsa-lady-15', questionKey: 'salsaLadyFaqQ15', answerKey: 'salsaLadyFaqA15' },
  ],
  faqTitleKey: 'salsaLadyFaqTitle',

  // Nearby areas
  nearby: {
    titleKey: 'salsaLadyNearbyTitle',
    descKey: 'salsaLadyNearbyDesc',
    searchTextKey: 'salsaLadyNearbySearchText',
    metroKey: 'salsaLadyNearbyMetro',
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
    titleKey: 'salsaLadyFinalCTATitle',
    descKey: 'salsaLadyFinalCTADesc',
    ctaKey: 'puertasAbiertasCTA',
    ctaSubtextKey: 'puertasAbiertasSubtext',
  },
};
