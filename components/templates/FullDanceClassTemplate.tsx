import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../../hooks/useI18n';
import { SUPPORTED_LOCALES } from '../../types';
import Breadcrumb from '../shared/Breadcrumb';
import {
  StarRating,
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  StarIcon,
  PlayIcon,
  CalendarDaysIcon,
} from '../../lib/icons';
import { UsersIcon, MapPinIcon } from '../shared/CommonIcons';
import AnimateOnScroll from '../AnimateOnScroll';
import AnimatedCounter from '../AnimatedCounter';
import CulturalHistorySection from '../CulturalHistorySection';
import ScheduleSection from '../ScheduleSection';
import FAQSection from '../FAQSection';
import TestimonialsSection from '../TestimonialsSection';
import LevelCardsSection, { type LevelConfig } from '../shared/LevelCardsSection';
import PrepareClassSection, { type PrepareConfig } from '../shared/PrepareClassSection';
import WhyUsComparisonSection, {
  type WhyUsComparisonConfig,
} from '../shared/WhyUsComparisonSection';
import LatinDanceComparisonTable, {
  type LatinDanceStyle,
} from '../shared/LatinDanceComparisonTable';
import ArtisticDanceComparisonTable, {
  type ArtisticDanceStyle,
} from '../shared/ArtisticDanceComparisonTable';
import YouTubeEmbed from '../YouTubeEmbed';
import {
  LocalBusinessSchema,
  CourseSchema,
  AggregateReviewsSchema,
  HowToSchema,
  SpeakableSchema,
  DefinedTermSchema,
  EventSchema,
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

// ============================================================================
// TYPES - Comprehensive configuration for all dance class pages
// ============================================================================

export interface ScheduleItem {
  id: string;
  dayKey: string;
  className: string;
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

export interface HeroConfig {
  // Stats shown in hero
  minutes?: number;
  calories?: number;
  funPercent?: number;
  // Third stat can be custom (e.g., "100% Cuban Technique")
  customThirdStat?: {
    value: string;
    labelKey: string;
    icon?: 'heart' | 'star' | 'check';
  };
  // Background gradient color (e.g., 'rose' for Ballet, 'primary' for default)
  gradientColor?: 'primary' | 'rose' | 'amber' | 'emerald' | 'violet';
}

export interface WhatIsSection {
  enabled: boolean;
  paragraphCount?: number; // Number of paragraphs (default 4)
  hasQuestionAnswer?: boolean; // Show question/answer at end
  image?: {
    src: string;
    srcSet?: string;
    alt: string;
  };
}

export interface IdentificationSection {
  enabled: boolean;
  itemCount?: number; // Number of identification items (default 6)
  hasTransition?: boolean; // Show transition text
  hasNeedEnroll?: boolean; // Show "Necesitas apuntarte" section
}

export interface TransformationSection {
  enabled: boolean;
  itemCount?: number; // Number of transformation items (default 6)
}

export interface WhyChooseSection {
  enabled: boolean;
  itemOrder?: number[]; // Custom order of items (default [1,7,2,3,4,5,6])
}

export interface WhyTodaySection {
  enabled: boolean;
  paragraphCount?: number; // Number of paragraphs (default 3)
}

export interface VideoSection {
  enabled: boolean;
  videos?: Array<{
    videoId: string;
    title: string;
  }>;
  placeholderCount?: number; // Number of "coming soon" placeholders
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
  columns: string[]; // e.g., ['Ballet', 'Cont. Lírico', 'Modern Jazz', 'Afro Cont.']
  rows: Array<{
    rowKey: string;
    values: number[]; // Stars for each column (1-5)
  }>;
  meaningCount?: number; // Number of meaning items (default 4)
}

export interface NearbyAreasConfig {
  enabled: boolean;
  areas?: ReadonlyArray<{ readonly name: string; readonly time: string }>;
  // Custom translation key prefix (defaults to styleKey)
  keyPrefix?: string;
}

export interface CourseSchemaConfig {
  teaches?: string;
  prerequisites?: string;
  lessons?: string;
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

// Main configuration interface
export interface FullDanceClassConfig {
  // === IDENTIFICATION ===
  styleKey: string; // Translation prefix: 'ballet', 'dancehall', 'twerk', etc.
  stylePath: string; // URL path: 'ballet-barcelona', 'dancehall-barcelona', etc.

  // === REQUIRED DATA ===
  faqsConfig: FAQ[];
  testimonials: Testimonial[];
  scheduleKeys: ScheduleItem[];
  teachers: TeacherInfo[];
  breadcrumbConfig: BreadcrumbConfig;

  // === OPTIONAL DATA ===
  levels?: LevelConfig[];
  prepareConfig?: PrepareConfig;
  nearbyAreas?: ReadonlyArray<{ readonly name: string; readonly time: string }>;

  // === SECTION TOGGLES ===
  hero?: HeroConfig;
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

  // === LATIN DANCE COMPARISON TABLE (for Latin styles like Salsa, Bachata, etc.) ===
  latinDanceComparison?: {
    enabled: boolean;
    highlightedStyle: LatinDanceStyle;
  };

  // === ARTISTIC DANCE COMPARISON TABLE (for Contemporáneo, Jazz, Ballet, Afro Jazz, etc.) ===
  artisticDanceComparison?: {
    enabled: boolean;
    highlightedStyle: ArtisticDanceStyle;
  };

  // === CULTURAL HISTORY ===
  culturalHistory?: {
    enabled: boolean;
    titleKey?: string;
    shortDescKey?: string;
    fullHistoryKey?: string;
  };

  // === SCHEMA MARKUP ===
  courseConfig?: CourseSchemaConfig;
  howToSchema?: HowToSchemaConfig;
  definedTerms?: DefinedTermConfig[];
  eventSchema?: EventSchemaConfig;
  speakableSelectors?: string[];
  personSchemas?: Array<{
    name: string;
    jobTitle: string;
    description: string;
    knowsAbout: string[];
  }>;

  // === VIDEO SCHEMA (separate from video section) ===
  videoSchema?: {
    titleKey: string;
    descKey: string;
    thumbnailUrl?: string;
    videoId?: string;
  };
}

// ============================================================================
// HELPER COMPONENTS
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
// MAIN COMPONENT
// ============================================================================

const FullDanceClassTemplate: React.FC<{ config: FullDanceClassConfig }> = ({ config }) => {
  const { t, locale } = useI18n();
  const baseUrl = 'https://www.farrayscenter.com';
  const pageUrl = `${baseUrl}/${locale}/clases/${config.stylePath}`;
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

  // ===== MEMOIZED DATA =====
  const schedules = useMemo(
    () =>
      config.scheduleKeys.map(schedule => ({
        ...schedule,
        day: t(schedule.dayKey),
        level: t(schedule.levelKey),
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
        url: `/${locale}/clases/${config.stylePath}`,
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

  // Video schema if provided
  const videoSchemaData = config.videoSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: t(config.videoSchema.titleKey),
        description: t(config.videoSchema.descKey),
        thumbnailUrl:
          config.videoSchema.thumbnailUrl ||
          `${baseUrl}/images/classes/${config.stylePath}/video-thumbnail.jpg`,
        uploadDate: '2025-01-01',
        contentUrl: config.videoSchema.videoId
          ? `https://www.youtube.com/watch?v=${config.videoSchema.videoId}`
          : `${baseUrl}/videos/${config.stylePath}-class-experience.mp4`,
        embedUrl: config.videoSchema.videoId
          ? `https://www.youtube.com/embed/${config.videoSchema.videoId}`
          : `${baseUrl}/videos/${config.stylePath}-class-experience.mp4`,
      }
    : null;

  // FAQ Page schema
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
        <title>{t(`${config.styleKey}PageTitle`)} | Farray&apos;s Center</title>
        <meta name="description" content={t(`${config.styleKey}MetaDescription`)} />
        <link rel="canonical" href={pageUrl} />
        {/* Hreflang */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/clases/${config.stylePath}`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/clases/${config.stylePath}`} />
        <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca/clases/${config.stylePath}`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/clases/${config.stylePath}`} />
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${baseUrl}/es/clases/${config.stylePath}`}
        />
        {/* Open Graph */}
        <meta
          property="og:title"
          content={`${t(`${config.styleKey}PageTitle`)} | Farray's Center`}
        />
        <meta property="og:description" content={t(`${config.styleKey}MetaDescription`)} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${baseUrl}/images/og-${config.stylePath}.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Farray's International Dance Center" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${t(`${config.styleKey}PageTitle`)} | Farray's Center`}
        />
        <meta name="twitter:description" content={t(`${config.styleKey}MetaDescription`)} />
        <meta name="twitter:image" content={`${baseUrl}/images/og-${config.stylePath}.jpg`} />
        {/* Additional SEO */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        {/* GEO Meta Tags for Local SEO */}
        <meta name="geo.region" content="ES-CT" />
        <meta name="geo.placename" content="Barcelona" />
        <meta
          name="geo.position"
          content={`${FARRAYS_LOCATION.geo.latitude};${FARRAYS_LOCATION.geo.longitude}`}
        />
        <meta
          name="ICBM"
          content={`${FARRAYS_LOCATION.geo.latitude}, ${FARRAYS_LOCATION.geo.longitude}`}
        />
        {/* Language and Locale */}
        <meta httpEquiv="content-language" content={locale} />
        <meta
          property="og:locale"
          content={
            locale === 'es'
              ? 'es_ES'
              : locale === 'ca'
                ? 'ca_ES'
                : locale === 'fr'
                  ? 'fr_FR'
                  : 'en_US'
          }
        />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="ca_ES" />
        <meta property="og:locale:alternate" content="fr_FR" />
        {/* Author and Publisher */}
        <meta name="author" content="Farray's International Dance Center" />
        <meta name="publisher" content="Farray's International Dance Center" />
        {/* Mobile optimization */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="theme-color" content="#000000" />
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
      {videoSchemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchemaData) }}
        />
      )}
      {config.personSchemas?.map((person, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: person.name,
              jobTitle: person.jobTitle,
              description: person.description,
              worksFor: {
                '@type': 'DanceSchool',
                name: "Farray's International Dance Center",
                url: baseUrl,
              },
              knowsAbout: person.knowsAbout,
            }),
          }}
        />
      ))}

      <LocalBusinessSchema
        name={`Farray's International Dance Center - ${t(`${config.styleKey}PageTitle`)}`}
        description={t(`${config.styleKey}MetaDescription`)}
        url={pageUrl}
        telephone={FARRAYS_LOCATION.telephone}
        email={FARRAYS_LOCATION.email}
        address={{
          streetAddress: FARRAYS_LOCATION.streetAddress,
          addressLocality: FARRAYS_LOCATION.addressLocality,
          postalCode: FARRAYS_LOCATION.postalCode,
          addressCountry: FARRAYS_LOCATION.addressCountry,
        }}
        geo={FARRAYS_LOCATION.geo}
        priceRange={FARRAYS_LOCATION.priceRange}
        aggregateRating={{
          ratingValue: SOCIAL_PROOF.ratingValue.toString(),
          reviewCount: SOCIAL_PROOF.reviewCount.replace('+', ''),
        }}
      />

      <CourseSchema
        name={t(`${config.styleKey}CourseSchemaName`)}
        description={t(`${config.styleKey}CourseSchemaDesc`)}
        provider={{
          name: FARRAYS_LOCATION.name,
          url: baseUrl,
        }}
        educationalLevel="Beginner, Intermediate, Advanced"
        teaches={config.courseConfig?.teaches || t(`${config.styleKey}CourseTeaches`)}
        coursePrerequisites={config.courseConfig?.prerequisites || 'Ninguno'}
        numberOfLessons={config.courseConfig?.lessons || 'Clases semanales'}
        timeRequired={config.courseConfig?.duration || 'PT1H'}
        availableLanguage={SUPPORTED_LOCALES}
      />

      <AggregateReviewsSchema
        reviews={reviewsSchemaData}
        itemName={`${t(`${config.styleKey}PageTitle`)} - Farray's Center`}
        itemType="Course"
      />

      {/* FAQPage Schema for rich snippets in search results */}
      <FAQPageSchema
        faqs={config.faqsConfig.map(faq => ({
          question: t(faq.questionKey),
          answer: t(faq.answerKey),
        }))}
      />

      {config.howToSchema?.enabled && (
        <HowToSchema
          name={t(`${config.styleKey}HowToName`)}
          description={t(`${config.styleKey}HowToDesc`)}
          totalTime="PT60M"
          estimatedCost={{ currency: 'EUR', value: '15' }}
          supply={(config.howToSchema.supplyKeys || []).map(key => t(key))}
          steps={Array.from({ length: config.howToSchema.stepCount || 5 }, (_, i) => ({
            name: t(`${config.styleKey}HowToStep${i + 1}Name`),
            text: t(`${config.styleKey}HowToStep${i + 1}Text`),
            url: i < 2 ? `${pageUrl}#schedule` : undefined,
          }))}
        />
      )}

      {config.speakableSelectors && (
        <SpeakableSchema
          name={t(`${config.styleKey}PageTitle`)}
          description={t(`${config.styleKey}MetaDescription`)}
          url={pageUrl}
          speakableSelectors={config.speakableSelectors}
        />
      )}

      {config.definedTerms && config.definedTerms.length > 0 && (
        <DefinedTermSchema
          terms={config.definedTerms.map(term => ({
            name: term.name,
            description: t(term.descriptionKey),
            url: pageUrl,
          }))}
        />
      )}

      {config.eventSchema?.enabled && (
        <EventSchema
          name={t(`${config.styleKey}EventName`)}
          description={t(`${config.styleKey}EventDesc`)}
          startDate={`${currentDate}T20:00:00+01:00`}
          location={{
            name: FARRAYS_LOCATION.name,
            address: `${FARRAYS_LOCATION.streetAddress}, ${FARRAYS_LOCATION.postalCode} ${FARRAYS_LOCATION.addressLocality}`,
          }}
          organizer={{
            name: FARRAYS_LOCATION.name,
            url: baseUrl,
          }}
          offers={{
            price: '15',
            priceCurrency: 'EUR',
            availability: 'InStock',
            url: `${pageUrl}#schedule`,
          }}
          performer={
            config.eventSchema.performerName
              ? {
                  name: config.eventSchema.performerName,
                  description: t(`${config.styleKey}Teacher1Bio`),
                }
              : undefined
          }
        />
      )}

      {/* ===== SKIP LINKS ===== */}
      <nav aria-label="Skip links" className="sr-only focus-within:not-sr-only">
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {t('skipToMainContent')}
        </a>
        <a
          href="#schedule"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:left-48 focus-visible:z-[100] focus-visible:bg-primary-accent focus-visible:text-white focus-visible:px-4 focus-visible:py-2 focus-visible:rounded-lg focus-visible:font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          {t('skipToSchedule')}
        </a>
      </nav>

      <main id="main-content" className="pt-20 md:pt-24" role="main">
        {/* ===== 1. HERO SECTION ===== */}
        <section
          id={`${config.styleKey}-hero`}
          aria-labelledby="hero-title"
          className="relative text-center py-24 md:py-32 overflow-hidden flex items-center justify-center min-h-[600px]"
        >
          <div className="absolute inset-0 bg-black">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradientColor]}`}
            ></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>

          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1
                id="hero-title"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 holographic-text"
              >
                {t(`${config.styleKey}HeroTitle`)}
              </h1>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 holographic-text">
                {t(`${config.styleKey}HeroSubtitle`)}
              </p>
              <p className="max-w-4xl mx-auto text-lg sm:text-xl md:text-2xl text-neutral/90 mt-6 sm:mt-8 mb-4 sm:mb-6 leading-relaxed">
                {t(`${config.styleKey}HeroDesc`)}
              </p>
              <p className="text-base sm:text-lg md:text-xl text-neutral/90 italic mb-6">
                {t(`${config.styleKey}HeroLocation`)}
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-8 text-neutral/80">
                <div className="flex items-center gap-2">
                  <StarRating size="sm" />
                  <span className="font-semibold">{SOCIAL_PROOF.rating}/5</span>
                  <span className="text-sm">
                    ({SOCIAL_PROOF.reviewCount} {t('reviews')})
                  </span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-primary-accent" />
                  <span className="text-sm">
                    {t(`${config.styleKey}HeroStudents`) || '+15.000 alumnos formados'}
                  </span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-primary-accent" />
                  <span className="text-sm">8 años en Barcelona</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10"
                role="group"
                aria-label={t(`${config.styleKey}CTAGroup`) || 'Opciones de inscripción'}
              >
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta1-subtext"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t(`${config.styleKey}CTA1`)}
                  </a>
                  <p id="cta1-subtext" className="text-xs text-neutral/70 mt-2 text-center">
                    {t(`${config.styleKey}CTA1Subtext`)}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#schedule"
                    aria-describedby="cta2-subtext"
                    className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                  >
                    {t(`${config.styleKey}CTA2`)}
                  </a>
                  <p id="cta2-subtext" className="text-xs text-neutral/70 mt-2 text-center">
                    {t(`${config.styleKey}CTA2Subtext`)}
                  </p>
                </div>
              </div>

              {/* Hero Stats */}
              <div className="mt-12 sm:mt-16">
                <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-12 max-w-4xl mx-auto">
                  <AnimateOnScroll delay={0}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <ClockIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <AnimatedCounter
                        target={hero.minutes || 60}
                        className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text"
                      />
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('classMinutes')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <FlameIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text">
                        ~<AnimatedCounter target={hero.calories || 400} className="inline" />
                      </div>
                      <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                        {t('caloriesBurned')}
                      </div>
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll delay={2 * ANIMATION_DELAYS.STAGGER_SMALL}>
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">
                        <StarIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-accent" />
                      </div>
                      {hero.customThirdStat ? (
                        <>
                          <div className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text">
                            {hero.customThirdStat.value}
                          </div>
                          <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                            {t(hero.customThirdStat.labelKey)}
                          </div>
                        </>
                      ) : (
                        <>
                          <AnimatedCounter
                            target={hero.funPercent || 100}
                            suffix="%"
                            className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 holographic-text"
                          />
                          <div className="text-xs sm:text-sm md:text-base text-neutral/90 font-semibold">
                            {t('funGuaranteed')}
                          </div>
                        </>
                      )}
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ===== 2. WHAT IS X SECTION ===== */}
        {config.whatIsSection?.enabled && (
          <section aria-labelledby="what-is-title" className="py-12 md:py-20 bg-primary-dark/10">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="max-w-4xl mx-auto">
                  <h2
                    id="what-is-title"
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 text-center holographic-text"
                  >
                    {t(`${config.styleKey}WhatIsTitle`)}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                    <div className="space-y-4 sm:space-y-6 text-base sm:text-lg text-neutral/90 leading-relaxed">
                      <p className="text-lg sm:text-xl font-semibold holographic-text">
                        {t(`${config.styleKey}WhatIsP1`)}
                      </p>
                      <p>{t(`${config.styleKey}WhatIsP2`)}</p>
                      <p className="italic font-medium text-neutral">
                        {t(`${config.styleKey}WhatIsP3`)}
                      </p>
                      <p>{t(`${config.styleKey}WhatIsP4`)}</p>
                      {(config.whatIsSection.paragraphCount || 4) >= 5 && (
                        <p>{t(`${config.styleKey}WhatIsP5`)}</p>
                      )}
                      {config.whatIsSection.hasQuestionAnswer !== false && (
                        <>
                          <p className="text-center text-xl sm:text-2xl font-bold mt-6 sm:mt-8 holographic-text">
                            {t(`${config.styleKey}WhatIsQuestionTitle`)}
                          </p>
                          <p className="text-center text-lg sm:text-xl font-semibold">
                            {t(`${config.styleKey}WhatIsQuestionAnswer`)}
                          </p>
                        </>
                      )}
                    </div>
                    {config.whatIsSection.image && (
                      <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] md:aspect-auto">
                        <picture>
                          {config.whatIsSection.image.srcSet && (
                            <source
                              type="image/webp"
                              srcSet={config.whatIsSection.image.srcSet}
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          )}
                          <img
                            src={config.whatIsSection.image.src}
                            alt={config.whatIsSection.image.alt}
                            width="960"
                            height="720"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover"
                          />
                        </picture>
                      </div>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>
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
          className="py-12 md:py-20 bg-primary-dark/10"
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

        {/* ===== 5. IDENTIFICATION SECTION ===== */}
        {config.identificationSection?.enabled && (
          <section aria-labelledby="identify-title" className="py-12 md:py-20 bg-primary-dark/10">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                  <h2
                    id="identify-title"
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 sm:mb-8 holographic-text"
                  >
                    {t(`${config.styleKey}IdentifyTitle`)}
                  </h2>
                </div>
              </AnimateOnScroll>

              <ul
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-8 sm:mb-10 list-none"
                role="list"
              >
                {Array.from(
                  { length: config.identificationSection.itemCount || 6 },
                  (_, i) => i + 1
                ).map((num, index) => (
                  <AnimateOnScroll
                    key={num}
                    as="li"
                    delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                    className="[perspective:1000px]"
                  >
                    <div className="group relative h-full min-h-[100px] flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-primary-dark/20 rounded-xl border border-primary-dark/50 hover:border-primary-accent transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-accent/20 flex items-center justify-center group-hover:bg-primary-accent/40 transition-colors duration-300">
                        <CheckIcon className="text-primary-accent" size="sm" />
                      </div>
                      <p className="text-neutral/90 leading-relaxed">
                        {t(`${config.styleKey}Identify${num}`)}
                      </p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </ul>

              {config.identificationSection.hasTransition !== false && (
                <AnimateOnScroll>
                  <div className="text-center mb-4 sm:mb-6">
                    <p className="text-sm text-neutral/75 italic max-w-2xl mx-auto">
                      {t(`${config.styleKey}IdentifyTransition`)}
                    </p>
                  </div>
                </AnimateOnScroll>
              )}

              {config.identificationSection.hasNeedEnroll !== false && (
                <>
                  <AnimateOnScroll>
                    <div className="text-center mb-6 sm:mb-8 max-w-4xl mx-auto">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 sm:mb-6 holographic-text">
                        {t(`${config.styleKey}NeedEnrollTitle`)}
                      </h3>
                    </div>
                  </AnimateOnScroll>

                  <AnimateOnScroll>
                    <div className="max-w-3xl mx-auto text-center space-y-3 sm:space-y-4">
                      <p className="text-lg sm:text-xl font-semibold holographic-text">
                        {t(`${config.styleKey}IdentifyAgitate1`)}
                      </p>
                      <p className="text-base sm:text-lg text-neutral/90">
                        {t(`${config.styleKey}IdentifySolution`)}
                      </p>
                      <p className="text-lg sm:text-xl text-neutral/90 italic">
                        {t(`${config.styleKey}IdentifyClosing`)}
                      </p>
                    </div>
                  </AnimateOnScroll>
                </>
              )}
            </div>
          </section>
        )}

        {/* ===== 6. TRANSFORMATION SECTION ===== */}
        {config.transformationSection?.enabled && (
          <section aria-labelledby="transform-title" className="py-12 md:py-20 bg-black">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="text-center mb-10 sm:mb-12 max-w-4xl mx-auto">
                  <h2
                    id="transform-title"
                    className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                  >
                    {t(`${config.styleKey}TransformTitle`)}
                  </h2>
                </div>
              </AnimateOnScroll>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
                {Array.from(
                  { length: config.transformationSection.itemCount || 6 },
                  (_, i) => i + 1
                ).map((num, index) => (
                  <AnimateOnScroll
                    key={num}
                    delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                    className="[perspective:1000px]"
                  >
                    <div className="group h-full min-h-[200px] sm:min-h-[220px] p-5 sm:p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 hover:border-primary-accent rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.05)_rotateY(5deg)] hover:shadow-accent-glow">
                      <div className="text-5xl sm:text-6xl font-black text-primary-accent mb-3 sm:mb-4 holographic-text">
                        {num}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-neutral mb-2 sm:mb-3">
                        {t(`${config.styleKey}Transform${num}Title`)}
                      </h3>
                      <p className="text-neutral/90 leading-relaxed text-sm sm:text-base">
                        {t(`${config.styleKey}Transform${num}Desc`)}
                      </p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== 7. WHY CHOOSE SECTION ===== */}
        {config.whyChooseSection?.enabled && (
          <section className="py-12 md:py-20 bg-primary-dark/10">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                    {t(`${config.styleKey}TransformCTA`)}
                  </h2>
                </div>
              </AnimateOnScroll>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-10 sm:mb-12">
                {(config.whyChooseSection.itemOrder || [1, 7, 2, 3, 4, 5, 6]).map((num, index) => (
                  <AnimateOnScroll
                    key={num}
                    delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                    className={`[perspective:1000px] ${index === 6 ? 'lg:col-start-2' : ''}`}
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

              {/* Trust Bar - Stats */}
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

        {/* ===== 8. WHY TODAY SECTION ===== */}
        {config.whyTodaySection?.enabled && (
          <section className="py-12 md:py-20 bg-black">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 sm:mb-6 holographic-text">
                    {t(`${config.styleKey}WhyTodayFullTitle`)}
                  </h2>
                  {Array.from(
                    { length: config.whyTodaySection.paragraphCount || 3 },
                    (_, i) => i + 1
                  ).map(num => (
                    <p key={num} className="text-lg sm:text-xl text-neutral/90">
                      {t(`${config.styleKey}WhyToday${num}`)}
                    </p>
                  ))}
                  <p className="text-xl sm:text-2xl font-bold holographic-text mt-4 sm:mt-6">
                    {t(`${config.styleKey}WhyTodayClosing1`)}
                  </p>
                  <p className="text-base sm:text-lg text-neutral/90 italic">
                    {t(`${config.styleKey}WhyTodayClosing2`)}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </section>
        )}

        {/* ===== 8b. WHY US COMPARISON SECTION ===== */}
        {config.whyUsComparison?.enabled && (
          <WhyUsComparisonSection styleKey={config.styleKey} config={config.whyUsComparison} />
        )}

        {/* ===== 9. VIDEO SECTION ===== */}
        {config.videoSection?.enabled && (
          <section id="video" className="py-12 md:py-20 bg-primary-dark/10">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <div className="text-center mb-8 sm:mb-12 max-w-4xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                    {t(`${config.styleKey}VideoTitle`)}
                  </h2>
                  <p className="text-base sm:text-lg text-neutral/70">
                    {t(`${config.styleKey}VideoDesc`)}
                  </p>
                </div>
              </AnimateOnScroll>

              <div
                className={`grid grid-cols-1 ${(config.videoSection.videos?.length ?? 0) > 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'max-w-4xl mx-auto'} gap-4 sm:gap-6 max-w-7xl mx-auto`}
              >
                {config.videoSection.videos?.map((video, index) => (
                  <AnimateOnScroll
                    key={video.videoId}
                    delay={(index + 1) * ANIMATION_DELAYS.STAGGER_SMALL}
                  >
                    <YouTubeEmbed videoId={video.videoId} title={video.title} />
                  </AnimateOnScroll>
                ))}
                {Array.from({ length: config.videoSection.placeholderCount || 0 }, (_, i) => (
                  <AnimateOnScroll
                    key={`placeholder-${i}`}
                    delay={
                      ((config.videoSection?.videos?.length ?? 0) + i + 1) *
                      ANIMATION_DELAYS.STAGGER_SMALL
                    }
                  >
                    <div className="aspect-video rounded-2xl overflow-hidden border-2 border-primary-accent/50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center p-4 sm:p-6">
                        <PlayIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-primary-accent/50" />
                        <p className="text-sm sm:text-base text-neutral/70 font-semibold">
                          Video próximamente
                        </p>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== 10. TESTIMONIALS SECTION ===== */}
        {config.testimonialsSection?.enabled !== false && (
          <TestimonialsSection
            testimonials={config.testimonials}
            titleKey="testimonialsNotRequested"
          />
        )}

        {/* ===== 11. CULTURAL HISTORY SECTION (SEO content) ===== */}
        {config.culturalHistory?.enabled && (
          <CulturalHistorySection
            titleKey={config.culturalHistory.titleKey || `${config.styleKey}CulturalHistoryTitle`}
            shortDescKey={config.culturalHistory.shortDescKey || `${config.styleKey}CulturalShort`}
            fullHistoryKey={
              config.culturalHistory.fullHistoryKey || `${config.styleKey}CulturalFull`
            }
            readMoreText={t('readMore')}
            readLessText={t('readLess')}
            t={t}
          />
        )}

        {/* ===== 11b. LATIN DANCE COMPARISON TABLE (for Latin styles) ===== */}
        {config.latinDanceComparison?.enabled && (
          <section className="py-14 md:py-20 bg-black">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <LatinDanceComparisonTable
                  highlightedStyle={config.latinDanceComparison.highlightedStyle}
                />
              </AnimateOnScroll>
            </div>
          </section>
        )}

        {/* ===== 11c. ARTISTIC DANCE COMPARISON TABLE (for Contemporary, Jazz, Ballet, etc.) ===== */}
        {config.artisticDanceComparison?.enabled && (
          <section className="py-14 md:py-20 bg-black">
            <div className="container mx-auto px-4 sm:px-6">
              <AnimateOnScroll>
                <ArtisticDanceComparisonTable
                  highlightedStyle={config.artisticDanceComparison.highlightedStyle}
                />
              </AnimateOnScroll>
            </div>
          </section>
        )}

        {/* ===== 12. FAQ SECTION (resolve objections) ===== */}
        {config.faqSection?.enabled !== false && (
          <FAQSection title={t(`${config.styleKey}FaqTitle`)} faqs={faqs} pageUrl={pageUrl} />
        )}

        {/* ===== 13. RELATED CLASSES SECTION (internal linking) ===== */}
        {/* TODO: Add RelatedClassesSection component when ready */}

        {/* ===== 14. LOCAL SEO / NEARBY AREAS SECTION ===== */}
        {config.nearbySection?.enabled !== false &&
          (() => {
            const nearbyKeyPrefix = config.nearbySection?.keyPrefix || config.styleKey;
            return (
              <section className="py-10 md:py-14 bg-black" aria-labelledby="nearby-title">
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

        {/* ===== 15. FINAL CTA SECTION (last chance to convert) ===== */}
        <section id="final-cta" className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[gradientColor]}`}
            ></div>
            <div className="absolute inset-0 bg-[url('/images/textures/stardust.png')] opacity-20"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t(`${config.styleKey}FinalCTATitle`)}
                </h2>
                <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 holographic-text">
                  {t(`${config.styleKey}FinalCTASubtitle`)}
                </p>
                <p className="text-lg sm:text-xl text-neutral/90 mb-5 sm:mb-6 leading-relaxed">
                  {t(`${config.styleKey}FinalCTADesc`)}
                </p>
                <p className="text-base sm:text-lg text-neutral/90 mb-6 sm:mb-8 italic">
                  {t(`${config.styleKey}FinalCTAFunny`)}
                </p>

                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
                  role="group"
                  aria-label="Inscripción"
                >
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none"
                    >
                      {t(`${config.styleKey}CTA1`)}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t(`${config.styleKey}CTA1Subtext`)}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#schedule"
                      className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none"
                    >
                      {t(`${config.styleKey}CTA2`)}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t(`${config.styleKey}CTA2Subtext`)}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </main>
    </>
  );
};

export default FullDanceClassTemplate;
