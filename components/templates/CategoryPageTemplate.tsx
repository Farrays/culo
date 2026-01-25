import React, { ReactNode, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import Breadcrumb from '../shared/Breadcrumb';
import AnimateOnScroll from '../AnimateOnScroll';
import FAQSection from '../FAQSection';
import AnimatedCounter from '../AnimatedCounter';
import Icon, { type IconName } from '../Icon';
import { ReviewsSection } from '../reviews';
import LeadCaptureModal from '../shared/LeadCaptureModal';
import OptimizedImage from '../OptimizedImage';
import { getStyleImage, getContextualAltKey, type AltContext } from '../../constants/style-images';
import type { DanceCategory } from '../../constants/reviews-data';

// ============================================================================
// TYPES
// ============================================================================

export type ValuePillarWithIcon = {
  id: string;
  titleKey: string;
  contentKey: string;
  iconName: IconName;
};

export interface BreadcrumbItem {
  name: string;
  url: string;
  isActive?: boolean;
}

export interface StyleItem {
  key: string;
  url: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface RelatedClass {
  id: string;
  nameKey: string;
  descKey: string;
  url: string;
  imageSrc: string;
  imageAlt: string;
  objectPosition?: string;
  breakpoints?: number[];
}

// Category item for hub pages (like /clases/baile-barcelona)
export interface CategoryItem {
  key: string;
  titleKey: string;
  descriptionKey: string;
  pillarUrl: string;
  imageUrl: string;
}

// Hero image configuration (Enterprise format for OptimizedImage)
export interface HeroImageConfig {
  basePath: string; // Path without size/format (e.g., "/images/categories/hero/clases-de-danza")
  altKey?: string; // i18n key for alt text (for accessibility)
  altFallback: string; // Fallback alt text
  breakpoints?: number[]; // Default: [320, 640, 768, 1024, 1440, 1920]
  formats?: ('avif' | 'webp' | 'jpg')[]; // Default: ['avif', 'webp', 'jpg']
  objectPosition?: string; // CSS object-position (e.g., "center 30%")
  opacity?: number; // Background opacity (0-100, default: 40)
}

export interface CategoryPageTemplateProps {
  // Hero config
  heroGradient: string; // e.g., "from-emerald-900/30"
  heroTitleKey: string;
  heroSubtitleKey?: string;
  heroIntroKey: string;
  heroImage?: HeroImageConfig; // Optional hero background image

  // Data - styles OR categories (for hub page)
  styles?: StyleItem[];
  categories?: CategoryItem[]; // For hub page (shows category cards instead of style cards)
  categoryImages?: Record<string, string>; // Images for categories (hub page)
  categoryObjectPositions?: Record<string, string>; // Object positions for category images
  valuePillars: ValuePillarWithIcon[];
  faqs: FAQ[];
  relatedClasses?: RelatedClass[]; // Optional for hub page

  // SEO
  pageTitle: string;
  breadcrumbItems: BreadcrumbItem[];
  schemas: ReactNode;
  faqTitle: string;
  faqPageUrl: string;

  // Slots for page-specific content
  whatIsSection: ReactNode;
  whichStyleSection?: ReactNode;
  featuredStylesSection?: ReactNode; // For hub page - shows featured styles after table

  // Options
  gridColumns?: 2 | 3 | 4;
  reviewsCategory?: DanceCategory;
  reviewsLimit?: number;
  stylesSectionTitleKey: string;
  stylesDescriptionKey: string;
  styleContext?: AltContext; // For getContextualAltKey (e.g., 'danza', 'urban')
  styleTranslationPrefix?: string; // For translation keys (e.g., 'danzaBarcelona', 'danzasUrbanas')

  // CTA config
  ctaTitleKey: string;
  ctaSubtitleKey: string;
  ctaDescriptionKey?: string;
}

// ============================================================================
// INTERNAL COMPONENTS
// ============================================================================

interface CategoryHeroProps {
  gradient: string;
  titleKey: string;
  subtitleKey?: string;
  introKey: string;
  breadcrumbItems: BreadcrumbItem[];
  onCtaClick: () => void;
  heroImage?: HeroImageConfig;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({
  gradient,
  titleKey,
  subtitleKey,
  introKey,
  breadcrumbItems,
  onCtaClick,
  heroImage,
}) => {
  const { t } = useI18n();

  // Default hero image settings
  const heroBreakpoints = heroImage?.breakpoints || [320, 640, 768, 1024, 1440, 1920];
  const heroFormats = heroImage?.formats || ['avif', 'webp', 'jpg'];
  const heroOpacity = heroImage?.opacity ?? 40;

  return (
    <section
      id="category-hero"
      aria-labelledby="hero-title"
      className="relative text-center py-16 md:py-20 overflow-hidden flex items-center justify-center min-h-[450px] md:min-h-[500px]"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        {/* Hero Image (if provided) */}
        {heroImage && (
          <div
            className="absolute inset-0"
            style={{ opacity: heroOpacity / 100 }}
            aria-hidden="true"
          >
            <OptimizedImage
              src={heroImage.basePath}
              altKey={heroImage.altKey}
              altFallback={heroImage.altFallback}
              className="w-full h-full object-cover"
              objectPosition={heroImage.objectPosition || 'center center'}
              breakpoints={heroBreakpoints}
              formats={heroFormats}
              sizes="100vw"
              priority="high"
              placeholder="color"
              placeholderColor="#000"
            />
          </div>
        )}
        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} via-black/40 to-black/60`}
        />
      </div>
      <div className="relative z-20 container mx-auto px-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} textColor="text-neutral/90" />

        {/* H1 + Subheadline */}
        <AnimateOnScroll>
          <h1
            id="hero-title"
            className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight mb-4 min-h-[100px] md:min-h-[140px] flex flex-col items-center justify-center text-white"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
          >
            {t(titleKey)}
            {subtitleKey && (
              <>
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-normal mt-2 holographic-text">
                  {t(subtitleKey)}
                </span>
              </>
            )}
          </h1>
          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-neutral/90 mt-8 leading-relaxed">
            {t(introKey)}
          </p>
        </AnimateOnScroll>

        {/* CTA Button */}
        <AnimateOnScroll delay={200}>
          <div className="mt-12 flex flex-col items-center justify-center">
            <button
              onClick={onCtaClick}
              className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
            >
              {t('puertasAbiertasCTA')}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
              {t('puertasAbiertasSubtext')}
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

interface StylesGridProps {
  styles: StyleItem[];
  titleKey: string;
  descriptionKey: string;
  columns: 2 | 3 | 4;
  context?: AltContext;
  translationPrefix?: string; // For translation keys (e.g., 'danzaBarcelona', 'danzasUrbanas')
}

const StylesGrid: React.FC<StylesGridProps> = ({
  styles,
  titleKey,
  descriptionKey,
  columns,
  context,
  translationPrefix,
}) => {
  const { t, locale } = useI18n();
  const gridCols =
    columns === 2 ? 'lg:grid-cols-2' : columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

  return (
    <section
      aria-labelledby="styles-title"
      className="section-after-hero pb-12 md:pb-20 bg-primary-dark/10"
    >
      <div className="container mx-auto px-6 text-center">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto">
            <h2
              id="styles-title"
              className="text-4xl md:text-5xl font-black tracking-tighter mb-4 holographic-text"
            >
              {t(titleKey)}
            </h2>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll delay={200}>
          <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12">{t(descriptionKey)}</p>
        </AnimateOnScroll>

        {/* Grid of Styles */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-8`}>
          {styles.map((style, index) => {
            const styleImage = getStyleImage(style.key);

            return (
              <AnimateOnScroll key={style.key} delay={index * 100} className="[perspective:1000px]">
                <Link
                  to={`/${locale}${style.url}`}
                  className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:shadow-accent-glow border border-white/10 hover:border-primary-accent flex flex-col"
                >
                  {/* Background Image */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <OptimizedImage
                      src={styleImage.basePath}
                      altKey={context ? getContextualAltKey(style.key, context) : undefined}
                      altFallback={styleImage.fallbackAlt}
                      aspectRatio="4/3"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 3 ? 'high' : 'low'}
                      breakpoints={styleImage.breakpoints}
                      formats={styleImage.formats}
                      objectPosition={styleImage.objectPosition}
                      className="w-full h-full transition-all duration-500 ease-in-out group-hover:scale-110 opacity-60 group-hover:opacity-80"
                      placeholder="color"
                      placeholderColor="#111"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                  </div>

                  {/* Text Content */}
                  <div className="p-6 space-y-3 flex-grow flex flex-col">
                    <h3 className="text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300">
                      {t(`danceClassesHub_style_${style.key}`)}
                    </h3>

                    {/* SEO Text */}
                    <p className="text-neutral/90 text-sm leading-relaxed flex-grow">
                      {t(`${translationPrefix || 'category'}_style_${style.key}_seo`)}
                    </p>

                    {/* CTA Link */}
                    <div className="pt-2 text-primary-accent font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      {t('danzaBarcelona_viewMore')}
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// CategoriesGrid - For hub page showing category cards instead of individual styles
interface CategoriesGridProps {
  categories: CategoryItem[];
  titleKey: string;
  descriptionKey: string;
  categoryImages: Record<string, string>;
  categoryObjectPositions?: Record<string, string>;
}

const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  categories,
  titleKey,
  descriptionKey,
  categoryImages,
  categoryObjectPositions,
}) => {
  const { t, locale } = useI18n();

  return (
    <section
      aria-labelledby="categories-title"
      className="section-after-hero pb-12 md:pb-20 bg-primary-dark/10"
    >
      <div className="container mx-auto px-6 text-center">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto">
            <h2
              id="categories-title"
              className="text-4xl md:text-5xl font-black tracking-tighter mb-4 holographic-text"
            >
              {t(titleKey)}
            </h2>
          </div>
        </AnimateOnScroll>
        <AnimateOnScroll delay={200}>
          <p className="max-w-3xl mx-auto text-lg text-neutral/90 mb-12">{t(descriptionKey)}</p>
        </AnimateOnScroll>

        {/* Grid of Categories - 2x2 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <AnimateOnScroll
              key={category.key}
              delay={index * 100}
              className="[perspective:1000px]"
            >
              <Link
                to={`/${locale}${category.pillarUrl}`}
                className="group block relative h-full rounded-xl overflow-hidden shadow-lg bg-black text-white transition-all duration-500 ease-in-out [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:shadow-accent-glow border border-white/10 hover:border-primary-accent flex flex-col"
              >
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  <OptimizedImage
                    src={categoryImages[category.key] || category.imageUrl}
                    altFallback={`${t(category.titleKey)} - Clases en Barcelona`}
                    aspectRatio="4/3"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    priority={index < 2 ? 'high' : 'low'}
                    className="w-full h-full transition-all duration-500 ease-in-out group-hover:scale-110 opacity-60 group-hover:opacity-80"
                    placeholder="color"
                    placeholderColor="#111"
                    breakpoints={[320, 640, 768, 1024]}
                    objectPosition={categoryObjectPositions?.[category.key]}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                </div>

                {/* Text Content */}
                <div className="p-6 space-y-3 flex-grow flex flex-col">
                  <h3 className="text-2xl font-bold text-white group-hover:text-primary-accent transition-colors duration-300">
                    {t(category.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-neutral/90 text-sm leading-relaxed flex-grow">
                    {t(category.descriptionKey)}
                  </p>

                  {/* CTA Link */}
                  <div className="pt-2 text-primary-accent font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300">
                    {t('danzaBarcelona_viewMore')}
                  </div>
                </div>
              </Link>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

interface WhySectionProps {
  pillars: ValuePillarWithIcon[];
}

const WhySection: React.FC<WhySectionProps> = ({ pillars }) => {
  const { t } = useI18n();

  return (
    <section aria-labelledby="why-title" className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2
              id="why-title"
              className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
            >
              {t('whyTitle')}
            </h2>
          </div>
        </AnimateOnScroll>
        <div className="flex flex-wrap justify-center -m-4">
          {pillars.map((pillar, index) => (
            <div key={pillar.id} className="w-full sm:w-1/2 lg:w-1/3 p-4 [perspective:1000px]">
              <AnimateOnScroll delay={index * 100} className="h-full">
                <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:border-primary-accent hover:shadow-accent-glow h-full min-h-[180px] flex flex-col">
                  <div className="mb-6">
                    <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon
                        name={pillar.iconName}
                        className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                    {t(pillar.titleKey)}
                  </h3>
                  <p className="text-neutral/90 leading-relaxed flex-grow group-hover:text-neutral/90 transition-colors duration-300">
                    {t(pillar.contentKey)}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsWidget: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="py-8 md:py-12 bg-black">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto">
            <div className="text-center">
              <AnimatedCounter
                target={8}
                suffix="+"
                className="text-4xl md:text-5xl font-black mb-2 holographic-text"
              />
              <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                {t('yearsExperience')}
              </p>
            </div>
            <div className="text-center">
              <AnimatedCounter
                target={1500}
                suffix="+"
                className="text-4xl md:text-5xl font-black mb-2 holographic-text"
              />
              <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                {t('activeStudents')}
              </p>
            </div>
            <div className="text-center">
              <AnimatedCounter
                target={15000}
                suffix="+"
                className="text-4xl md:text-5xl font-black mb-2 holographic-text"
              />
              <p className="text-sm sm:text-base text-neutral/80 font-semibold uppercase tracking-wide">
                {t('satisfiedStudents')}
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

interface FinalCTAProps {
  gradient: string;
  titleKey: string;
  subtitleKey: string;
  descriptionKey?: string;
  onCtaClick: () => void;
}

const FinalCTA: React.FC<FinalCTAProps> = ({
  gradient,
  titleKey,
  subtitleKey,
  descriptionKey,
  onCtaClick,
}) => {
  const { t } = useI18n();

  return (
    <section className="relative py-12 md:py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} via-black to-black`}></div>
      </div>
      <div className="relative z-20 container mx-auto px-6 text-center">
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 holographic-text">
              {t(titleKey)}
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-neutral/90 mb-4">{t(subtitleKey)}</p>
            {descriptionKey && (
              <p className="max-w-xl mx-auto text-lg text-neutral/75 mb-10">{t(descriptionKey)}</p>
            )}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={onCtaClick}
              className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-accent-glow animate-glow"
            >
              {t('puertasAbiertasCTA')}
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
              {t('puertasAbiertasSubtext')}
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

interface RelatedClassesSectionProps {
  classes: RelatedClass[];
}

const RelatedClassesSection: React.FC<RelatedClassesSectionProps> = ({ classes }) => {
  const { t, locale } = useI18n();

  return (
    <section
      id="related-classes"
      aria-labelledby="related-classes-title"
      className="py-12 md:py-16"
    >
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <header className="text-center mb-8 sm:mb-12 relative z-10">
            <h2
              id="related-classes-title"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
            >
              {t('relatedClassesTitle')}
            </h2>
            <p className="text-lg sm:text-xl text-neutral/70">{t('relatedClassesSubtitle')}</p>
          </header>
        </AnimateOnScroll>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto relative z-0"
          role="list"
          aria-label={t('relatedClassesTitle')}
        >
          {classes.map((relatedClass, index) => (
            <div key={relatedClass.id} role="listitem">
              <AnimateOnScroll delay={(index + 1) * 100} className="[perspective:1000px]">
                <article className="h-full" aria-labelledby={`related-${relatedClass.id}-title`}>
                  <Link
                    to={`/${locale}${relatedClass.url}`}
                    className="group block h-full bg-black/70 backdrop-blur-md
                               border border-primary-dark/50 rounded-2xl shadow-lg overflow-hidden
                               transition-all duration-500
                               [transform-style:preserve-3d]
                               hover:border-primary-accent hover:shadow-accent-glow
                               hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)]
                               focus:outline-none focus:ring-2 focus:ring-primary-accent
                               focus:ring-offset-2 focus:ring-offset-black"
                    aria-label={`${t(relatedClass.nameKey)} - ${t('relatedClassesViewClass')}`}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '480/320' }}>
                      <OptimizedImage
                        src={relatedClass.imageSrc}
                        alt={relatedClass.imageAlt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        objectPosition={relatedClass.objectPosition}
                        width={480}
                        height={320}
                        breakpoints={relatedClass.breakpoints || [320, 640, 768]}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
                        priority="auto"
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3
                        id={`related-${relatedClass.id}-title`}
                        className="text-lg sm:text-xl font-bold text-neutral mb-2 group-hover:text-primary-accent transition-colors duration-300"
                      >
                        {t(relatedClass.nameKey)}
                      </h3>
                      <p className="text-sm text-neutral/80 leading-relaxed mb-4 line-clamp-2">
                        {t(relatedClass.descKey)}
                      </p>
                      <div
                        className="flex items-center gap-2 text-primary-accent font-semibold text-sm group-hover:gap-3 transition-all duration-300"
                        aria-hidden="true"
                      >
                        <span>{t('relatedClassesViewClass')}</span>
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </article>
              </AnimateOnScroll>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// MAIN TEMPLATE COMPONENT
// ============================================================================

const CategoryPageTemplate: React.FC<CategoryPageTemplateProps> = ({
  // Hero
  heroGradient,
  heroTitleKey,
  heroSubtitleKey,
  heroIntroKey,
  heroImage,
  // Data
  styles,
  categories,
  categoryImages,
  categoryObjectPositions,
  valuePillars,
  faqs,
  relatedClasses,
  // SEO
  pageTitle,
  breadcrumbItems,
  schemas,
  faqTitle,
  faqPageUrl,
  // Slots
  whatIsSection,
  whichStyleSection,
  featuredStylesSection,
  // Options
  gridColumns = 3,
  reviewsCategory = 'general',
  reviewsLimit = 6,
  stylesSectionTitleKey,
  stylesDescriptionKey,
  styleContext,
  styleTranslationPrefix,
  // CTA
  ctaTitleKey,
  ctaSubtitleKey,
  ctaDescriptionKey,
}) => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  const handleCtaClick = () => setIsLeadModalOpen(true);

  return (
    <>
      {/* Schema Markup (passed from page) */}
      {schemas}

      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <div className="pt-20 md:pt-24">
        {/* Hero Section */}
        <CategoryHero
          gradient={heroGradient}
          titleKey={heroTitleKey}
          subtitleKey={heroSubtitleKey}
          introKey={heroIntroKey}
          breadcrumbItems={breadcrumbItems}
          onCtaClick={handleCtaClick}
          heroImage={heroImage}
        />

        {/* Styles Grid OR Categories Grid Section */}
        {categories && categoryImages ? (
          <CategoriesGrid
            categories={categories}
            titleKey={stylesSectionTitleKey}
            descriptionKey={stylesDescriptionKey}
            categoryImages={categoryImages}
            categoryObjectPositions={categoryObjectPositions}
          />
        ) : styles ? (
          <StylesGrid
            styles={styles}
            titleKey={stylesSectionTitleKey}
            descriptionKey={stylesDescriptionKey}
            columns={gridColumns}
            context={styleContext}
            translationPrefix={styleTranslationPrefix}
          />
        ) : null}

        {/* What Is Section (slot - page-specific content) */}
        {whatIsSection}

        {/* Which Style Section (slot - page-specific content) */}
        {whichStyleSection}

        {/* Featured Styles Section (slot - for hub page) */}
        {featuredStylesSection}

        {/* Why Study at FIDC Section */}
        <WhySection pillars={valuePillars} />

        {/* Stats Widget Section */}
        <StatsWidget />

        {/* Reviews Section */}
        <ReviewsSection
          category={reviewsCategory}
          limit={reviewsLimit}
          showGoogleBadge={true}
          layout="grid"
        />

        {/* FAQ Section */}
        <FAQSection title={faqTitle} faqs={faqs} pageUrl={faqPageUrl} />

        {/* Final CTA Section */}
        <FinalCTA
          gradient={heroGradient}
          titleKey={ctaTitleKey}
          subtitleKey={ctaSubtitleKey}
          descriptionKey={ctaDescriptionKey}
          onCtaClick={handleCtaClick}
        />

        {/* Related Classes Section (optional - not shown on hub page) */}
        {relatedClasses && relatedClasses.length > 0 && (
          <RelatedClassesSection classes={relatedClasses} />
        )}
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </>
  );
};

export default CategoryPageTemplate;
