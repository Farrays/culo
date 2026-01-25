/**
 * FullDanceClassTemplateV2 - EXPERIMENTAL
 * ========================================
 * Template experimental para probar mejoras visuales:
 * - Hero con video de fondo
 * - Layout split (texto izq, media der)
 * - Menos texto en el hero
 * - Más fotos intercaladas
 *
 * NO USAR EN PRODUCCIÓN - Solo para pruebas en /test/clase-experimental
 */
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../../hooks/useI18n';
import { SUPPORTED_LOCALES } from '../../types';
import _Breadcrumb from '../shared/Breadcrumb';
import {
  StarRating,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  CalendarDaysIcon,
} from '../../lib/icons';
import { MapPinIcon } from '../shared/CommonIcons';
import ExpandableContent from '../shared/ExpandableContent';
import AnimateOnScroll from '../AnimateOnScroll';
import AnimatedCounter from '../AnimatedCounter';
import _CulturalHistorySection from '../CulturalHistorySection';
import ScheduleSection from '../ScheduleSection';
import FAQSection from '../FAQSection';
import { ReviewsSection } from '../reviews';
import LevelCardsSection, { type LevelConfig } from '../shared/LevelCardsSection';
import PrepareClassSection, { type PrepareConfig } from '../shared/PrepareClassSection';
import _WhyUsComparisonSection, {
  type WhyUsComparisonConfig,
} from '../shared/WhyUsComparisonSection';
import _LatinDanceComparisonTable, {
  type LatinDanceStyle,
} from '../shared/LatinDanceComparisonTable';
import _ArtisticDanceComparisonTable, {
  type ArtisticDanceStyle,
} from '../shared/ArtisticDanceComparisonTable';
import _YouTubeEmbed from '../YouTubeEmbed';
import {
  LocalBusinessSchema,
  CourseSchema,
  AggregateReviewsSchema,
  HowToSchema as _HowToSchema,
  SpeakableSchema as _SpeakableSchema,
  DefinedTermSchema as _DefinedTermSchema,
  EventSchema as _EventSchema,
  FAQPageSchema,
} from '../SchemaMarkup';
import {
  ANIMATION_DELAYS,
  BARCELONA_NEARBY_AREAS,
  FARRAYS_LOCATION,
  SOCIAL_PROOF,
} from '../../constants/shared';
import type { Testimonial } from '../../types';
import type { FAQ } from './ClassPageTemplate';
import LeadCaptureModal from '../shared/LeadCaptureModal';

// ============================================================================
// TYPES - Extended for V2 features
// ============================================================================

export interface ScheduleItem {
  id: string;
  dayKey: string;
  classNameKey?: string; // Translation key for class name (enterprise i18n)
  className?: string; // Direct class name (fallback for legacy configs)
  time: string;
  teacher: string;
  levelKey: string;
  note?: string;
}

export interface TeacherInfo {
  name: string;
  specialtyKey: string;
  bioKey: string;
  image?: string;
  imageSrcSet?: string;
  tags?: string[];
}

export interface BreadcrumbConfig {
  homeKey: string;
  classesKey: string;
  categoryKey: string;
  categoryUrl: string;
  currentKey: string;
}

// V2: Extended Hero config with video and layout options
export interface HeroConfigV2 {
  minutes?: number;
  calories?: number;
  funPercent?: number;
  customThirdStat?: {
    value: string;
    labelKey: string;
    icon?: 'heart' | 'star' | 'check';
  };
  gradientColor?: 'primary' | 'rose' | 'amber' | 'emerald' | 'violet';
  // V2 NEW: Video background
  videoUrl?: string;
  videoPoster?: string; // Imagen mientras carga el video
  // V2 NEW: Layout type
  layout?: 'centered' | 'split'; // Default: 'split' for V2
  // V2 NEW: Hero image (Enterprise format for OptimizedImage)
  heroImage?: {
    basePath: string; // Path without size/format
    alt: string; // Fallback alt text
    altKey?: string; // i18n key for alt text
    breakpoints?: number[]; // Default: [320, 640, 768, 1024, 1440, 1920]
    formats?: ('avif' | 'webp' | 'jpg')[]; // Default: ['avif', 'webp', 'jpg']
  };
}

export interface WhatIsSection {
  enabled: boolean;
  paragraphCount?: number;
  hasQuestionAnswer?: boolean;
  // V2: Soporte para video inline
  video?: {
    src: string;
    poster?: string;
  };
  image?: {
    src: string;
    srcSet?: string;
    alt: string;
  };
  // V2: Quote destacado
  showQuote?: boolean;
  // V2: CTA secundario
  showCTA?: boolean;
}

export interface IdentificationSection {
  enabled: boolean;
  itemCount?: number;
  hasTransition?: boolean;
  hasNeedEnroll?: boolean;
}

export interface TransformationSection {
  enabled: boolean;
  itemCount?: number;
}

export interface WhyChooseSection {
  enabled: boolean;
  itemOrder?: number[];
}

export interface WhyTodaySection {
  enabled: boolean;
  paragraphCount?: number;
}

export interface VideoSection {
  enabled: boolean;
  videos?: Array<{
    videoId: string;
    title: string;
  }>;
  placeholderCount?: number;
}

export interface LogosSection {
  enabled: boolean;
  logos?: Array<{
    src: string;
    alt: string;
    label: string;
  }>;
}

export interface ComparisonTableSection {
  enabled: boolean;
  columns: string[];
  rows: Array<{
    rowKey: string;
    values: number[];
  }>;
  meaningCount?: number;
}

export interface NearbyAreasConfig {
  enabled: boolean;
  areas?: ReadonlyArray<{ readonly name: string; readonly time: string }>;
  keyPrefix?: string;
}

export interface CourseSchemaConfig {
  teachesKey?: string;
  prerequisitesKey?: string;
  lessonsKey?: string;
  duration?: string;
}

export interface HowToSchemaConfig {
  enabled: boolean;
  supplyKeys?: string[];
  stepCount?: number;
}

export interface DefinedTermConfig {
  name: string;
  descriptionKey: string;
}

export interface EventSchemaConfig {
  enabled: boolean;
  performerName?: string;
}

// V2: Main config (uses HeroConfigV2)
export interface FullDanceClassConfigV2 {
  styleKey: string;
  stylePath: string;
  faqsConfig: FAQ[];
  testimonials: Testimonial[];
  scheduleKeys: ScheduleItem[];
  teachers: TeacherInfo[];
  breadcrumbConfig: BreadcrumbConfig;
  levels?: LevelConfig[];
  prepareConfig?: PrepareConfig;
  nearbyAreas?: ReadonlyArray<{ readonly name: string; readonly time: string }>;
  hero?: HeroConfigV2; // V2 extended
  whatIsSection?: WhatIsSection;
  identificationSection?: IdentificationSection;
  transformationSection?: TransformationSection;
  whyChooseSection?: WhyChooseSection;
  whyTodaySection?: WhyTodaySection;
  videoSection?: VideoSection;
  logosSection?: LogosSection;
  comparisonTable?: ComparisonTableSection;
  whyUsComparison?: WhyUsComparisonConfig;
  nearbySection?: NearbyAreasConfig;
  testimonialsSection?: { enabled: boolean };
  faqSection?: { enabled: boolean };
  latinDanceComparison?: {
    enabled: boolean;
    highlightedStyle: LatinDanceStyle;
  };
  artisticDanceComparison?: {
    enabled: boolean;
    highlightedStyle: ArtisticDanceStyle;
  };
  culturalHistory?: {
    enabled: boolean;
    titleKey?: string;
    shortDescKey?: string;
    fullHistoryKey?: string;
  };
  courseConfig?: CourseSchemaConfig;
  howToSchema?: HowToSchemaConfig;
  definedTerms?: DefinedTermConfig[];
  eventSchema?: EventSchemaConfig;
  speakableSelectors?: string[];
  personSchemas?: Array<{
    name: string;
    jobTitleKey: string;
    descriptionKey: string;
    knowsAbout: string[];
  }>;
  videoSchema?: {
    titleKey: string;
    descKey: string;
    thumbnailUrl?: string;
    videoId?: string;
  };
}

// ============================================================================
// V2 HERO COMPONENT - Split Layout with Video Background
// ============================================================================

interface HeroV2Props {
  config: FullDanceClassConfigV2;
  hero: HeroConfigV2;
  gradientColor: string;
  gradientClasses: Record<string, string>;
  t: (key: string) => string;
  setIsLeadModalOpen: (open: boolean) => void;
  // breadcrumbItems removed - V2 hero is minimal without breadcrumbs
}

// ============================================================================
// CHEVRON DOWN ICON for scroll indicator
// ============================================================================
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className={className}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

// ============================================================================
// V2 HERO - ULTRA CLEAN DESIGN (Fullscreen + Video + Single CTA)
// ============================================================================
// Diseño basado en investigación de conversión para tráfico SEO:
// - Usuario forma opinión en 2.6 segundos
// - Un solo CTA reduce fricción
// - Video contextual confirma "estás en el lugar correcto"
// ============================================================================

const HeroSectionV2: React.FC<HeroV2Props> = ({
  config,
  hero,
  gradientColor,
  gradientClasses,
  t,
  setIsLeadModalOpen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Handle reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    if (videoRef.current && mediaQuery.matches) {
      videoRef.current.pause();
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (videoRef.current) {
        if (e.matches) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Video URLs - placeholder de baile/fitness
  const placeholderVideoUrl =
    'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const videoUrl = hero.videoUrl || placeholderVideoUrl;
  // Enterprise: Use basePath with default size for poster fallback
  const posterImage =
    hero.videoPoster ||
    (hero.heroImage ? `${hero.heroImage.basePath}_1920.jpg` : '/images/og-default.jpg');

  return (
    <section
      id={`${config.styleKey}-hero`}
      aria-labelledby="hero-title"
      className="relative h-screen min-h-[600px] max-h-[1000px] overflow-hidden"
    >
      {/* ===== VIDEO BACKGROUND (Fullscreen) ===== */}
      <div className="absolute inset-0">
        {/* Video */}
        {!prefersReducedMotion && videoUrl && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            poster={posterImage}
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        )}

        {/* Poster fallback for reduced motion */}
        {prefersReducedMotion && (
          <img
            src={posterImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        )}

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Subtle gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${gradientClasses[gradientColor]} opacity-40`}
        ></div>
      </div>

      {/* ===== CONTENT - V1.5 HÍBRIDO (Video + Todo el SEO) ===== */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto">
        {/* Rating Badge */}
        <div className="mb-6 px-5 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
          <div className="flex items-center gap-3">
            <StarRating size="sm" />
            <span className="text-white font-semibold text-sm sm:text-base">
              {SOCIAL_PROOF.rating}/5 ({SOCIAL_PROOF.reviewCount} {t('reviews')})
            </span>
          </div>
        </div>

        {/* H1 - Título Principal (SEO) */}
        <h1
          id="hero-title"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-[0.95] mb-4 text-white drop-shadow-2xl"
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
        >
          {t(`${config.styleKey}HeroTitle`)}
        </h1>

        {/* Subtítulo (SEO - keyword secundario) */}
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 mb-4 drop-shadow-lg">
          {t(`${config.styleKey}HeroSubtitle`)}
        </p>

        {/* Descripción (SEO - contenido semántico) */}
        <p className="max-w-3xl text-base sm:text-lg md:text-xl text-white/80 mb-3 leading-relaxed drop-shadow-md">
          {t(`${config.styleKey}HeroDesc`)}
        </p>

        {/* Location/GEO + Autoridad (SEO Local) */}
        <p className="text-sm sm:text-base text-white/70 italic mb-6 drop-shadow-md">
          {t(`${config.styleKey}HeroLocation`)}
        </p>

        {/* Social Proof Row (SEO - señales de confianza) */}
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mb-8 text-white/80 text-sm">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-4 h-4 text-primary-accent" />
            <span>8+ {t('years_in_barcelona')}</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/30"></div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-primary-accent" />
            <span>Plaza España, Sants</span>
          </div>
        </div>

        {/* CTA Button - Puertas Abiertas */}
        <div className="flex flex-col items-center justify-center">
          <button
            onClick={() => setIsLeadModalOpen(true)}
            className="w-full sm:w-auto sm:min-w-[320px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
          >
            {t('puertasAbiertasCTA')}
          </button>
          <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
            {t('puertasAbiertasSubtext')}
          </p>
        </div>
      </div>

      {/* ===== SCROLL INDICATOR ===== */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a
          href="#what-is"
          aria-label="Scroll para más información"
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <ChevronDownIcon className="w-6 h-6 animate-bounce" />
        </a>
      </div>
    </section>
  );
};

// ============================================================================
// STATS BAR - Sticky info bar that appears after hero
// ============================================================================

interface StatsBarProps {
  hero: HeroConfigV2;
  t: (key: string) => string;
}

const StatsBar: React.FC<StatsBarProps> = ({ hero, t }) => {
  return (
    <div className="bg-primary-dark/95 backdrop-blur-md border-y border-primary-accent/20 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-primary-accent" />
            <span className="text-neutral">
              <span className="font-bold text-white">{hero.minutes || 60}</span> min/clase
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FlameIcon className="w-5 h-5 text-primary-accent" />
            <span className="text-neutral">
              <span className="font-bold text-white">~{hero.calories || 400}</span> calorías
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-primary-accent" />
            <span className="text-neutral">
              <span className="font-bold text-white">8+</span> {t('years_in_barcelona')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-primary-accent" />
            <span className="text-neutral">Plaza España, BCN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LEGACY: Keep old split layout code commented for reference
// ============================================================================
/*
  OLD SPLIT LAYOUT CODE - Kept for reference if needed later
  {layout === 'split' && (
    <div className="hidden lg:block">...</div>
  )}
*/

// ============================================================================
// HELPER COMPONENTS (same as original)
// ============================================================================

const TeacherCard: React.FC<{
  teacher: TeacherInfo;
  index: number;
  t: (key: string) => string;
}> = ({ teacher, index, t }) => (
  <AnimateOnScroll
    delay={(index + 1) * ANIMATION_DELAYS.STAGGER_SMALL}
    className="[perspective:1000px]"
  >
    <div className="group h-full bg-black/70 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
      <div className="flex flex-col items-center text-center">
        {teacher.image ? (
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-4 sm:mb-6">
            <picture>
              {teacher.imageSrcSet && (
                <source type="image/webp" srcSet={teacher.imageSrcSet} sizes="160px" />
              )}
              <img
                src={teacher.image}
                alt={teacher.name}
                width="160"
                height="160"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </picture>
          </div>
        ) : (
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-primary-accent/50 group-hover:border-primary-accent transition-colors duration-300 mb-4 sm:mb-6 bg-gradient-to-br from-primary-accent/30 to-primary-dark/50 flex items-center justify-center">
            <span className="text-3xl font-black text-primary-accent/60">
              {teacher.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </span>
          </div>
        )}
        <h3 className="text-xl sm:text-2xl font-bold text-neutral mb-2">{teacher.name}</h3>
        <p className="text-primary-accent font-semibold mb-3 sm:mb-4">{t(teacher.specialtyKey)}</p>
        <p className="text-neutral/90 leading-relaxed text-sm">{t(teacher.bioKey)}</p>
        {teacher.tags && teacher.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {teacher.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary-accent/20 text-primary-accent text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </AnimateOnScroll>
);

// ============================================================================
// MAIN COMPONENT V2
// ============================================================================

const FullDanceClassTemplateV2: React.FC<{ config: FullDanceClassConfigV2 }> = ({ config }) => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/test/${config.stylePath}`;
  const currentDate = new Date().toISOString().split('T')[0];

  // Defaults
  const hero = config.hero || { minutes: 60, calories: 400, funPercent: 100 };
  const nearbyAreas = config.nearbyAreas || BARCELONA_NEARBY_AREAS;
  const gradientColor = hero.gradientColor || 'primary';

  const gradientClasses: Record<string, string> = {
    primary: 'from-primary-dark/30 via-black to-black',
    rose: 'from-rose-900/30 via-black to-black',
    amber: 'from-amber-900/30 via-black to-black',
    emerald: 'from-emerald-900/30 via-black to-black',
    violet: 'from-violet-900/30 via-black to-black',
  };

  // Lead capture modal state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  // ===== MEMOIZED DATA =====
  const schedules = useMemo(
    () =>
      config.scheduleKeys.map(schedule => ({
        id: schedule.id,
        day: t(schedule.dayKey),
        className: schedule.classNameKey ? t(schedule.classNameKey) : schedule.className || '',
        time: schedule.time,
        teacher: schedule.teacher,
        level: t(schedule.levelKey),
        note: schedule.note,
      })),
    [config.scheduleKeys, t]
  );

  const faqs = useMemo(
    () =>
      config.faqsConfig.map(faq => ({
        id: faq.id,
        question: t(faq.questionKey),
        answer: t(faq.answerKey),
      })),
    [config.faqsConfig, t]
  );

  const reviewsSchemaData = useMemo(
    () =>
      config.testimonials.map(testimonial => ({
        itemReviewed: {
          name: `${t(`${config.styleKey}PageTitle`)} - Farray's Center`,
          type: 'Course',
        },
        author: testimonial.name,
        reviewRating: { ratingValue: testimonial.rating.toString(), bestRating: '5' },
        reviewBody: testimonial.quote[locale],
        datePublished: currentDate,
      })),
    [config.testimonials, locale, config.styleKey, t, currentDate]
  );

  const breadcrumbItems = useMemo(
    () => [
      { name: t(config.breadcrumbConfig.homeKey), url: `/${locale}` },
      { name: t(config.breadcrumbConfig.classesKey), url: `/${locale}/clases/baile-barcelona` },
      {
        name: t(config.breadcrumbConfig.categoryKey),
        url: `/${locale}${config.breadcrumbConfig.categoryUrl}`,
      },
      {
        name: t(config.breadcrumbConfig.currentKey),
        url: `/${locale}/test/${config.stylePath}`,
        isActive: true,
      },
    ],
    [config.breadcrumbConfig, locale, config.stylePath, t]
  );

  const breadcrumbSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${baseUrl}${item.url}`,
      })),
    }),
    [breadcrumbItems]
  );

  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* ===== HEAD / META ===== */}
      <Helmet>
        <title>[TEST V2] {t(`${config.styleKey}PageTitle`)} | Farray&apos;s Center</title>
        <meta name="description" content={t(`${config.styleKey}MetaDescription`)} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* ===== SCHEMA MARKUP ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />

      <LocalBusinessSchema
        name={`Farray's International Dance Center - ${t(`${config.styleKey}PageTitle`)}`}
        description={t(`${config.styleKey}MetaDescription`)}
        url={pageUrl}
        telephone={FARRAYS_LOCATION.telephone}
        email={FARRAYS_LOCATION.email}
        address={{
          streetAddress: t('schema_streetAddress'),
          addressLocality: FARRAYS_LOCATION.addressLocality,
          postalCode: FARRAYS_LOCATION.postalCode,
          addressCountry: FARRAYS_LOCATION.addressCountry,
          addressRegion: t('schema_addressRegion'),
        }}
        geo={FARRAYS_LOCATION.geo}
        priceRange={FARRAYS_LOCATION.priceRange}
        aggregateRating={{
          ratingValue: SOCIAL_PROOF.ratingValue.toString(),
          reviewCount: SOCIAL_PROOF.reviewCount.replace('+', ''),
        }}
        reserveActionName={t('schema_reserveActionName')}
      />

      <CourseSchema
        name={t(`${config.styleKey}CourseSchemaName`)}
        description={t(`${config.styleKey}CourseSchemaDesc`)}
        provider={{
          name: FARRAYS_LOCATION.name,
          url: baseUrl,
        }}
        educationalLevel={t('schema_educationalLevel')}
        teaches={
          config.courseConfig?.teachesKey
            ? t(config.courseConfig.teachesKey)
            : t(`${config.styleKey}CourseTeaches`)
        }
        coursePrerequisites={
          config.courseConfig?.prerequisitesKey
            ? t(config.courseConfig.prerequisitesKey)
            : t('schema_prerequisites')
        }
        numberOfLessons={
          config.courseConfig?.lessonsKey
            ? t(config.courseConfig.lessonsKey)
            : t('schema_weeklyClasses')
        }
        timeRequired={config.courseConfig?.duration || 'PT1H'}
        availableLanguage={SUPPORTED_LOCALES}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName={`${t(`${config.styleKey}PageTitle`)} - Farray's Center`}
        itemType="Course"
      />

      <FAQPageSchema
        faqs={config.faqsConfig.map(faq => ({
          question: t(faq.questionKey),
          answer: t(faq.answerKey),
        }))}
      />

      {/* ===== SKIP LINKS ===== */}
      <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold"
        >
          {t('skipToMainContent')}
        </a>
        <a
          href="#schedule"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-48 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold"
        >
          {t('skipToSchedule')}
        </a>
      </nav>

      <main id="main-content" className="pt-20 md:pt-24" role="main">
        {/* ===== V2 EXPERIMENTAL BANNER ===== */}
        <div className="bg-amber-500 text-black text-center py-2 text-sm font-bold">
          TEMPLATE V2 EXPERIMENTAL - Solo para pruebas visuales
        </div>

        {/* ===== 1. HERO SECTION V2 (Ultra-Clean Fullscreen) ===== */}
        <HeroSectionV2
          config={config}
          hero={hero}
          gradientColor={gradientColor}
          gradientClasses={gradientClasses}
          t={t}
          setIsLeadModalOpen={setIsLeadModalOpen}
        />

        {/* ===== 1b. STATS BAR (Info práctica post-hero) ===== */}
        <StatsBar hero={hero} t={t} />

        {/* ===== 2. WHAT IS X SECTION (V2 - Visual Split Layout) ===== */}
        {config.whatIsSection?.enabled && (
          <section
            id="what-is"
            aria-labelledby="what-is-title"
            className="py-12 md:py-16 bg-gradient-to-b from-black via-primary-dark/20 to-black"
          >
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                {/* Grid: Media izquierda, Texto derecha */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Media Side (Video o Imagen) */}
                  <AnimateOnScroll className="order-2 lg:order-1">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video group">
                      {/* Video si está configurado */}
                      {config.whatIsSection.video ? (
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          poster={config.whatIsSection.video.poster}
                          className="w-full h-full object-cover"
                        >
                          <source src={config.whatIsSection.video.src} type="video/mp4" />
                        </video>
                      ) : config.whatIsSection.image ? (
                        <picture>
                          {config.whatIsSection.image.srcSet && (
                            <source
                              type="image/webp"
                              srcSet={config.whatIsSection.image.srcSet}
                              sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                          )}
                          <img
                            src={config.whatIsSection.image.src}
                            alt={config.whatIsSection.image.alt}
                            width="960"
                            height="540"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </picture>
                      ) : (
                        /* Placeholder si no hay media */
                        <div className="w-full h-full bg-gradient-to-br from-primary-accent/20 to-primary-dark/40 flex items-center justify-center">
                          <span className="text-6xl">💃</span>
                        </div>
                      )}
                      {/* Overlay sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
                    </div>
                  </AnimateOnScroll>

                  {/* Text Side */}
                  <AnimateOnScroll
                    delay={ANIMATION_DELAYS.STAGGER_SMALL}
                    className="order-1 lg:order-2"
                  >
                    <div className="space-y-6">
                      {/* Título */}
                      <h2
                        id="what-is-title"
                        className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
                      >
                        {t(`${config.styleKey}WhatIsTitle`)}
                      </h2>

                      {/* Contenido con expansión para SEO */}
                      <ExpandableContent
                        expandLabel={t('expandStyleDetails')}
                        collapseLabel={t('collapseContent')}
                        visibleContent={
                          <div className="space-y-4 text-base sm:text-lg text-neutral/90 leading-relaxed">
                            <p className="text-lg sm:text-xl font-medium">
                              {t(`${config.styleKey}WhatIsP1`)}
                            </p>
                            <p>{t(`${config.styleKey}WhatIsP2`)}</p>
                          </div>
                        }
                        expandableContent={
                          <div className="space-y-4 text-base sm:text-lg text-neutral/90 leading-relaxed">
                            <p>{t(`${config.styleKey}WhatIsP3`)}</p>
                            <p>{t(`${config.styleKey}WhatIsP4`)}</p>
                            {(config.whatIsSection.paragraphCount || 4) >= 5 && (
                              <p>{t(`${config.styleKey}WhatIsP5`)}</p>
                            )}
                            {config.whatIsSection.hasQuestionAnswer !== false && (
                              <div className="mt-6 p-4 bg-primary-dark/20 rounded-xl">
                                <p className="text-xl font-bold text-neutral mb-2">
                                  {t(`${config.styleKey}WhatIsQuestionTitle`)}
                                </p>
                                <p className="text-lg text-neutral/90">
                                  {t(`${config.styleKey}WhatIsQuestionAnswer`)}
                                </p>
                              </div>
                            )}
                          </div>
                        }
                      />

                      {/* Quote destacado */}
                      {config.whatIsSection.showQuote !== false && (
                        <blockquote className="relative pl-6 py-4 my-6 border-l-4 border-primary-accent bg-primary-dark/30 rounded-r-xl">
                          <p className="text-xl sm:text-2xl italic font-semibold text-neutral">
                            &ldquo;{t(`${config.styleKey}WhatIsQuote`)}&rdquo;
                          </p>
                        </blockquote>
                      )}

                      {/* CTA secundario */}
                      {config.whatIsSection.showCTA !== false && (
                        <div className="pt-4">
                          <a
                            href="#schedule"
                            className="inline-flex items-center gap-2 bg-primary-dark/50 hover:bg-primary-accent text-neutral font-bold py-3 px-6 rounded-full border border-primary-accent/50 hover:border-primary-accent transition-all duration-300 group"
                          >
                            {t(`${config.styleKey}WhatIsCTA`)}
                            <svg
                              className="w-5 h-5 transition-transform group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== 3. SCHEDULE SECTION ===== */}
        <ScheduleSection
          titleKey={`${config.styleKey}ScheduleTitle`}
          subtitleKey={`${config.styleKey}ScheduleSubtitle`}
          schedules={schedules}
          t={t}
        />

        {/* ===== 3b. LEVELS SECTION ===== */}
        {config.levels && config.levels.length > 0 && (
          <LevelCardsSection titleKey={`${config.styleKey}LevelsTitle`} levels={config.levels} />
        )}

        {/* ===== 4. TEACHERS SECTION ===== */}
        <section
          id="teachers"
          aria-labelledby="teachers-title"
          className="py-12 md:py-16 bg-primary-dark/10"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                <h2
                  id="teachers-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text"
                >
                  {t(`${config.styleKey}TeachersTitle`)}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 mt-4">
                  {t(`${config.styleKey}TeachersSubtitle`)}
                </p>
              </div>
            </AnimateOnScroll>

            <div
              className={`grid ${config.teachers.length === 1 ? '' : config.teachers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 sm:gap-8 max-w-5xl mx-auto`}
            >
              {config.teachers.map((teacher, index) => (
                <TeacherCard key={teacher.name} teacher={teacher} index={index} t={t} />
              ))}
            </div>

            <AnimateOnScroll>
              <p className="text-center text-base sm:text-lg text-neutral/90 mt-8 sm:mt-10 max-w-2xl mx-auto">
                {t(`${config.styleKey}TeachersClosing`)}
              </p>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 4b. PREPARE CLASS SECTION ===== */}
        {config.prepareConfig && (
          <PrepareClassSection
            titleKey={`${config.styleKey}PrepareTitle`}
            subtitleKey={`${config.styleKey}PrepareSubtitle`}
            config={config.prepareConfig}
          />
        )}

        {/* ===== 5. IDENTIFICATION SECTION (V2 - Checks del tema) ===== */}
        {config.identificationSection?.enabled &&
          (() => {
            return (
              <section
                aria-labelledby="identify-title"
                className="py-12 md:py-16 bg-gradient-to-b from-black to-primary-dark/20"
              >
                <div className="container mx-auto px-4 sm:px-6">
                  <AnimateOnScroll>
                    <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
                      <h2
                        id="identify-title"
                        className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                      >
                        {t(`${config.styleKey}IdentifyTitle`)}
                      </h2>
                      <p className="text-lg text-neutral/70">
                        Si alguno de estos te suena, estás en el lugar correcto
                      </p>
                    </div>
                  </AnimateOnScroll>

                  {/* Grid de identificación con checks del tema */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
                    {Array.from(
                      { length: config.identificationSection.itemCount || 6 },
                      (_, i) => i + 1
                    ).map((num, index) => (
                      <AnimateOnScroll
                        key={num}
                        delay={index * ANIMATION_DELAYS.STAGGER_SMALL * 1.5}
                        className="[perspective:1000px]"
                      >
                        <div className="group relative h-full bg-gradient-to-br from-primary-dark/40 to-black/60 backdrop-blur-sm rounded-2xl border border-primary-accent/20 hover:border-primary-accent p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)] hover:shadow-accent-glow cursor-pointer">
                          {/* Check del tema */}
                          <div className="w-14 h-14 rounded-xl bg-primary-accent/20 flex items-center justify-center mb-4 group-hover:bg-primary-accent/40 group-hover:scale-110 transition-all duration-300">
                            <CheckCircleIcon className="w-7 h-7 text-primary-accent" />
                          </div>
                          {/* Texto del item */}
                          <p className="text-lg font-medium text-neutral leading-relaxed">
                            {t(`${config.styleKey}Identify${num}`)}
                          </p>
                        </div>
                      </AnimateOnScroll>
                    ))}
                  </div>

                  {/* Sección de transición y CTA */}
                  <AnimateOnScroll>
                    <div className="max-w-3xl mx-auto text-center space-y-6 bg-gradient-to-r from-primary-accent/10 via-primary-dark/30 to-primary-accent/10 rounded-2xl p-8 border border-primary-accent/20">
                      {config.identificationSection.hasTransition !== false && (
                        <p className="text-neutral/80 italic">
                          {t(`${config.styleKey}IdentifyTransition`)}
                        </p>
                      )}
                      {config.identificationSection.hasNeedEnroll !== false && (
                        <>
                          <h3 className="text-2xl sm:text-3xl font-black text-neutral holographic-text">
                            {t(`${config.styleKey}NeedEnrollTitle`)}
                          </h3>
                          <p className="text-lg text-neutral/90">
                            {t(`${config.styleKey}IdentifySolution`)}
                          </p>
                          {/* CTA Button - Puertas Abiertas */}
                          <div className="flex flex-col items-center mt-4">
                            <button
                              onClick={() => setIsLeadModalOpen(true)}
                              className="w-full sm:w-auto sm:min-w-[320px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                            >
                              {t('puertasAbiertasCTA')}
                            </button>
                            <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
                              {t('puertasAbiertasSubtext')}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </AnimateOnScroll>
                </div>
              </section>
            );
          })()}

        {/* ===== 6. TRANSFORMATION SECTION (V2 - Before/After Visual) ===== */}
        {config.transformationSection?.enabled &&
          (() => {
            return (
              <section
                aria-labelledby="transform-title"
                className="py-12 md:py-16 bg-gradient-to-b from-primary-dark/20 to-black overflow-hidden"
              >
                <div className="container mx-auto px-4 sm:px-6">
                  <AnimateOnScroll>
                    <div className="text-center mb-12 sm:mb-16 max-w-4xl mx-auto">
                      <h2
                        id="transform-title"
                        className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                      >
                        {t(`${config.styleKey}TransformTitle`)}
                      </h2>
                      <p className="text-lg text-neutral/70">
                        {t(`${config.styleKey}TransformSubtitle`) ||
                          'Lo que el baile puede hacer por ti'}
                      </p>
                    </div>
                  </AnimateOnScroll>

                  {/* Before/After Cards Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {Array.from(
                      { length: config.transformationSection.itemCount || 6 },
                      (_, i) => i + 1
                    ).map((num, index) => (
                      <AnimateOnScroll
                        key={num}
                        delay={index * ANIMATION_DELAYS.STAGGER_SMALL * 1.5}
                        className="[perspective:1000px]"
                      >
                        <div className="group relative h-full bg-gradient-to-br from-black/80 to-primary-dark/40 backdrop-blur-sm rounded-2xl border border-primary-accent/20 hover:border-primary-accent overflow-hidden transition-all duration-500 hover:shadow-accent-glow">
                          {/* Before/After Split */}
                          <div className="flex">
                            {/* BEFORE */}
                            <div className="flex-1 p-4 sm:p-5 border-r border-primary-dark/50 bg-red-950/20">
                              <div className="text-xs uppercase tracking-wider text-red-400/80 mb-3 font-bold">
                                Antes
                              </div>
                              <p className="text-sm text-neutral/60 line-through">
                                {t(`${config.styleKey}Transform${num}Before`)}
                              </p>
                            </div>

                            {/* AFTER */}
                            <div className="flex-1 p-4 sm:p-5 bg-emerald-950/20">
                              <div className="text-xs uppercase tracking-wider text-emerald-400/80 mb-3 font-bold">
                                Después
                              </div>
                              <p className="text-sm text-primary-accent font-medium">
                                {t(`${config.styleKey}Transform${num}After`)}
                              </p>
                            </div>
                          </div>

                          {/* Título y descripción SEO */}
                          <div className="px-5 py-4 bg-black/50 border-t border-primary-dark/30">
                            <h3 className="text-base font-bold text-neutral mb-1">
                              {t(`${config.styleKey}Transform${num}Title`)}
                            </h3>
                            {/* Descripción para SEO - contenido completo */}
                            <p className="text-sm text-neutral/70 leading-relaxed">
                              {t(`${config.styleKey}Transform${num}Desc`)}
                            </p>
                          </div>

                          {/* Hover arrow indicator */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <div className="w-8 h-8 rounded-full bg-primary-accent flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </AnimateOnScroll>
                    ))}
                  </div>

                  {/* CTA después de transformaciones */}
                  <AnimateOnScroll>
                    <div className="text-center mt-12">
                      <p className="text-xl text-neutral/80 mb-6">¿Listo para tu transformación?</p>
                      <a
                        href="#schedule"
                        className="inline-flex items-center justify-center gap-2 min-w-[280px] sm:min-w-[320px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                      >
                        Empezar Ahora
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </AnimateOnScroll>
                </div>
              </section>
            );
          })()}

        {/* ===== 7. WHY CHOOSE SECTION ===== */}
        {config.whyChooseSection?.enabled && (
          <section className="py-12 md:py-16 bg-primary-dark/10">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                    {t(`${config.styleKey}TransformCTA`)}
                  </h2>
                </div>
              </AnimateOnScroll>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-10 sm:mb-12">
                {(config.whyChooseSection.itemOrder || [1, 2, 3, 4, 5, 6]).map((num, index) => (
                  <AnimateOnScroll
                    key={num}
                    delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                    className="[perspective:1000px]"
                  >
                    <div className="group h-full min-h-[140px] sm:min-h-[160px] p-4 sm:p-6 bg-black/30 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                          <CheckCircleIcon className="w-6 h-6 text-primary-accent" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-bold text-neutral mb-2">
                            {t(`${config.styleKey}WhyChoose${num}Title`)}
                          </h3>
                          <p className="text-neutral/90 text-sm leading-relaxed">
                            {t(`${config.styleKey}WhyChoose${num}Desc`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              {/* Trust Bar */}
              <AnimateOnScroll>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 sm:gap-8 md:gap-16 max-w-5xl mx-auto mb-10 sm:mb-12">
                  <div className="text-center">
                    <AnimatedCounter
                      target={8}
                      suffix="+"
                      className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                    />
                    <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                      {t('yearsExperience')}
                    </p>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter
                      target={1500}
                      suffix="+"
                      className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                    />
                    <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                      {t('activeStudents')}
                    </p>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter
                      target={15000}
                      suffix="+"
                      className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 holographic-text"
                    />
                    <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                      {t('satisfiedStudents')}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Logos Section */}
              {config.logosSection?.enabled && (
                <AnimateOnScroll>
                  <div className="text-center max-w-4xl mx-auto">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 holographic-text">
                      {t(`${config.styleKey}LogosTitle`)}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto items-center mb-4 sm:mb-6">
                      {(
                        config.logosSection.logos || [
                          {
                            src: '/images/cid-unesco-logo.webp',
                            alt: 'CID UNESCO',
                            label: 'CID UNESCO',
                          },
                          {
                            src: '/images/Street-Dance-2.webp',
                            alt: 'Street Dance 2',
                            label: 'Street Dance 2',
                          },
                          {
                            src: '/images/the-dancer-espectaculo-baile-cuadrada.webp',
                            alt: 'The Dancer',
                            label: 'The Dancer',
                          },
                          { src: '/images/telecinco-logo.webp', alt: 'Telecinco', label: 'TV 5' },
                        ]
                      ).map((logo, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-primary-accent/20 hover:border-primary-accent transition-all duration-300 hover:scale-105"
                        >
                          <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden rounded-lg">
                            <img
                              src={logo.src}
                              alt={logo.alt}
                              width="64"
                              height="64"
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-neutral/90 font-bold text-xs sm:text-sm text-center">
                            {logo.label}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter holographic-text">
                      {t(`${config.styleKey}LogosIntlFestivalsText`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              )}
            </div>
          </section>
        )}

        {/* ===== 8. WHY TODAY SECTION (V2 - Urgencia Visual) ===== */}
        {config.whyTodaySection?.enabled && (
          <section className="relative py-12 md:py-16 overflow-hidden">
            {/* Background con gradiente de urgencia */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/20 via-black to-primary-dark/30"></div>

            <div className="container mx-auto px-4 sm:px-6 relative z-10">
              <div className="max-w-4xl mx-auto">
                {/* Grid: Contenido izquierda, Visual derecha */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Content Side */}
                  <AnimateOnScroll>
                    <div className="space-y-6">
                      {/* Badge de urgencia - dinámico */}
                      <div className="inline-flex items-center gap-2 bg-primary-accent/20 border border-primary-accent/50 rounded-full px-4 py-2">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-accent opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-accent"></span>
                        </span>
                        <span className="text-primary-accent font-bold text-sm uppercase tracking-wider">
                          {t(`${config.styleKey}WhyTodayBadge`) || t('limitedSpots')}
                        </span>
                      </div>

                      {/* Título */}
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral holographic-text">
                        {t(`${config.styleKey}WhyTodayFullTitle`)}
                      </h2>

                      {/* Contenido SEO completo con expansión */}
                      <ExpandableContent
                        expandLabel={t('expandWhyStart')}
                        collapseLabel={t('collapseContent')}
                        visibleContent={
                          <div className="space-y-4 text-lg sm:text-xl text-neutral/90 leading-relaxed">
                            <p>{t(`${config.styleKey}WhyToday1`)}</p>
                          </div>
                        }
                        expandableContent={
                          <div className="space-y-4 text-base sm:text-lg text-neutral/90 leading-relaxed">
                            {(config.whyTodaySection?.paragraphCount || 3) >= 2 && (
                              <p>{t(`${config.styleKey}WhyToday2`)}</p>
                            )}
                            {(config.whyTodaySection?.paragraphCount || 3) >= 3 && (
                              <p>{t(`${config.styleKey}WhyToday3`)}</p>
                            )}
                            {/* Closing statements - siempre incluidos para SEO */}
                            <div className="mt-4 p-4 bg-primary-dark/30 rounded-xl border-l-4 border-primary-accent">
                              <p className="font-semibold text-neutral">
                                {t(`${config.styleKey}WhyTodayClosing1`)}
                              </p>
                              <p className="text-neutral/80 mt-2">
                                {t(`${config.styleKey}WhyTodayClosing2`)}
                              </p>
                            </div>
                          </div>
                        }
                      />

                      {/* CTA Button - Puertas Abiertas */}
                      <div className="flex flex-col items-center mt-4">
                        <button
                          onClick={() => setIsLeadModalOpen(true)}
                          className="w-full sm:w-auto sm:min-w-[320px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                        >
                          {t('puertasAbiertasCTA')}
                        </button>
                        <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
                          {t('puertasAbiertasSubtext')}
                        </p>
                      </div>
                    </div>
                  </AnimateOnScroll>

                  {/* Visual Side - Imagen/Stats */}
                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="relative">
                      {/* Imagen de ambiente */}
                      <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-gradient-to-br from-primary-accent/20 to-primary-dark/40">
                        <img
                          src="/images/og-default.jpg"
                          alt="Clase de baile en acción"
                          className="w-full h-full object-cover opacity-80"
                          loading="lazy"
                        />
                        {/* Overlay con quote */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                          <blockquote className="text-white/90 italic text-lg">
                            &ldquo;{t(`${config.styleKey}WhyTodayClosing1`)}&rdquo;
                          </blockquote>
                        </div>
                      </div>

                      {/* Floating badge - dinámico */}
                      <div className="absolute -top-4 -right-4 bg-primary-accent text-white font-black py-3 px-6 rounded-full shadow-lg transform rotate-3 animate-pulse">
                        {t(`${config.styleKey}WhyTodayFloatingBadge`) || t('startToday')}
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== 10. REVIEWS SECTION - Google Reviews ===== */}
        {config.testimonialsSection?.enabled !== false && (
          <ReviewsSection category="general" limit={6} showGoogleBadge={true} layout="grid" />
        )}

        {/* ===== 12. FAQ SECTION ===== */}
        {config.faqSection?.enabled !== false && (
          <FAQSection title={t(`${config.styleKey}FaqTitle`)} faqs={faqs} pageUrl={pageUrl} />
        )}

        {/* ===== 14. LOCAL SEO / NEARBY AREAS SECTION ===== */}
        {config.nearbySection?.enabled !== false &&
          (() => {
            const nearbyKeyPrefix = config.nearbySection?.keyPrefix || config.styleKey;
            return (
              <section className="py-12 md:py-16 bg-black" aria-labelledby="nearby-title">
                <div className="container mx-auto px-4 sm:px-6">
                  <AnimateOnScroll>
                    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-black/30 rounded-2xl border border-neutral/20">
                      <h3
                        id="nearby-title"
                        className="text-xl sm:text-2xl font-bold text-neutral mb-4"
                      >
                        {t(`${nearbyKeyPrefix}NearbyTitle`)}
                      </h3>
                      <p className="text-neutral/80 mb-4 sm:mb-6 text-sm sm:text-base">
                        {t(`${nearbyKeyPrefix}NearbyDesc`)}
                      </p>
                      <p className="text-neutral/90 font-semibold mb-4 text-sm sm:text-base">
                        {t(`${nearbyKeyPrefix}NearbySearchText`)}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
                        {(config.nearbySection?.areas || nearbyAreas).map((area, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                          >
                            <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary-accent flex-shrink-0" />
                            <span className="text-neutral/80">
                              {area.name}: <span className="text-primary-accent">{area.time}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-neutral/70 text-xs sm:text-sm mt-4">
                        {t(`${nearbyKeyPrefix}NearbyMetro`)}
                      </p>
                    </div>
                  </AnimateOnScroll>
                </div>
              </section>
            );
          })()}

        {/* ===== 15. FINAL CTA SECTION (V2 - Video Fondo + 1 CTA) ===== */}
        <section
          id="final-cta"
          className="relative py-12 md:py-16 overflow-hidden min-h-[500px] flex items-center"
        >
          {/* Video Background (reutiliza el del hero) */}
          <div className="absolute inset-0">
            {hero.videoUrl && (
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={
                  hero.videoPoster ||
                  (hero.heroImage
                    ? `${hero.heroImage.basePath}_1920.jpg`
                    : '/images/og-default.jpg')
                }
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={hero.videoUrl} type="video/mp4" />
              </video>
            )}
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/70"></div>
            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${gradientClasses[gradientColor]} opacity-60`}
            ></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                {/* Testimonial destacado */}
                <div className="mb-8">
                  <div className="inline-flex items-center gap-1 mb-4">
                    <StarRating size="md" />
                  </div>
                  <blockquote className="text-xl sm:text-2xl italic text-white/90 mb-2">
                    &ldquo;
                    {config.testimonials[0]?.quote[locale] ||
                      t(`${config.styleKey}FinalCTATestimonial`)}
                    &rdquo;
                  </blockquote>
                  <p className="text-neutral/70">
                    — {config.testimonials[0]?.name || 'Alumno satisfecho'}
                  </p>
                </div>

                {/* Título principal */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white mb-8 drop-shadow-2xl">
                  {t(`${config.styleKey}FinalCTATitle`)}
                </h2>

                {/* CTA Button - Puertas Abiertas */}
                <div className="flex flex-col items-center justify-center">
                  <button
                    onClick={() => setIsLeadModalOpen(true)}
                    className="w-full sm:w-auto sm:min-w-[320px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t('puertasAbiertasCTA')}
                  </button>
                  <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
                    {t('puertasAbiertasSubtext')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </>
  );
};

export default FullDanceClassTemplateV2;
