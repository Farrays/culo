/**
 * ScheduleImagesSection - Schedule 2026 Images Gallery with Tab Navigation
 * =========================================================================
 *
 * Features:
 * - Tab-based navigation for 4 schedule categories
 * - Single large image per category (optimized AVIF/WebP/JPG)
 * - Click to open full-screen lightbox with zoom
 * - Keyboard navigation (Arrow keys, Enter, Space)
 * - ARIA compliant (WCAG 2.1 AA)
 * - Responsive tabs (horizontal scroll on mobile)
 * - i18n support (es, ca, en, fr)
 * - Blur placeholders for smooth loading
 * - Smooth fade transitions between tabs
 *
 * @example
 * ```tsx
 * <ScheduleImagesSection />
 * ```
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import OptimizedImage from './OptimizedImage';
import ImageLightbox, { type LightboxImage } from './ImageLightbox';
import AnimateOnScroll from './AnimateOnScroll';
import { useTranslation } from 'react-i18next';
import { SCHEDULE_BLUR_PLACEHOLDERS } from '../constants/schedule-image-placeholders';

// ============================================================================
// TYPES
// ============================================================================

type ScheduleCategoryId = 'danza' | 'morning' | 'social' | 'urban';

interface ScheduleCategory {
  id: ScheduleCategoryId;
  labelKey: string;
  descriptionKey: string;
  imageBasePath: string;
  altKey: string;
  blurDataURL: string;
}

// ============================================================================
// SCHEDULE CATEGORIES DATA
// ============================================================================

const SCHEDULE_CATEGORIES: ScheduleCategory[] = [
  {
    id: 'danza',
    labelKey: 'horarios_tab_danza',
    descriptionKey: 'horarios_desc_danza',
    imageBasePath: '/images/horarios/danza-2026',
    altKey: 'horarios.schedules.danza2026',
    blurDataURL: SCHEDULE_BLUR_PLACEHOLDERS.danza,
  },
  {
    id: 'urban',
    labelKey: 'horarios_tab_urban',
    descriptionKey: 'horarios_desc_urban',
    imageBasePath: '/images/horarios/urban-2026',
    altKey: 'horarios.schedules.urban2026',
    blurDataURL: SCHEDULE_BLUR_PLACEHOLDERS.urban,
  },
  {
    id: 'social',
    labelKey: 'horarios_tab_social',
    descriptionKey: 'horarios_desc_social',
    imageBasePath: '/images/horarios/social-2026',
    altKey: 'horarios.schedules.social2026',
    blurDataURL: SCHEDULE_BLUR_PLACEHOLDERS.social,
  },
  {
    id: 'morning',
    labelKey: 'horarios_tab_morning',
    descriptionKey: 'horarios_desc_morning',
    imageBasePath: '/images/horarios/morning-2026',
    altKey: 'horarios.schedules.morning2026',
    blurDataURL: SCHEDULE_BLUR_PLACEHOLDERS.morning,
  },
];

// ============================================================================
// COMPONENT
// ============================================================================

const ScheduleImagesSection: React.FC = () => {
  const { t } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);
  const [activeTab, setActiveTab] = useState<ScheduleCategoryId>('danza');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Get active category object (guaranteed to exist as we default to first category)
  // Using useMemo to ensure TypeScript understands this will never be undefined
  const activeCategory = React.useMemo(() => {
    return SCHEDULE_CATEGORIES.find(cat => cat.id === activeTab) || SCHEDULE_CATEGORIES[0];
  }, [activeTab]) as ScheduleCategory;

  // Lightbox image (single image for active tab)
  const lightboxImages: LightboxImage[] = [
    {
      src: activeCategory.imageBasePath,
      altKey: activeCategory.altKey,
      index: 0,
    },
  ];

  const openLightbox = useCallback(() => {
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  // Keyboard navigation for tabs
  const handleKeyDown = useCallback((e: React.KeyboardEvent, categoryId: ScheduleCategoryId) => {
    const currentIndex = SCHEDULE_CATEGORIES.findIndex(cat => cat.id === categoryId);

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % SCHEDULE_CATEGORIES.length;
      const nextCategory = SCHEDULE_CATEGORIES[nextIndex];
      if (nextCategory) setActiveTab(nextCategory.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex =
        (currentIndex - 1 + SCHEDULE_CATEGORIES.length) % SCHEDULE_CATEGORIES.length;
      const prevCategory = SCHEDULE_CATEGORIES[prevIndex];
      if (prevCategory) setActiveTab(prevCategory.id);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveTab(categoryId);
    }
  }, []);

  // Focus management for accessibility
  useEffect(() => {
    const panelId = `panel-${activeTab}`;
    const panel = document.getElementById(panelId);
    if (panel) {
      panel.focus({ preventScroll: true });
    }
  }, [activeTab]);

  return (
    <section className="py-12 md:py-16 bg-black" aria-labelledby="schedule-images-title">
      <div className="container mx-auto px-6">
        <AnimateOnScroll>
          <div className="text-center mb-8 md:mb-12">
            <h2
              id="schedule-images-title"
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-neutral mb-3 md:mb-4 holographic-text"
            >
              {t('horarios_section_title')}
            </h2>
            <p className="text-lg md:text-xl text-neutral/70 max-w-3xl mx-auto">
              {t('horarios_section_subtitle')}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Tab Navigation */}
        <AnimateOnScroll delay={100}>
          <div
            ref={tabsRef}
            role="tablist"
            aria-label={t('horarios_tabs_label')}
            className="flex flex-nowrap md:flex-wrap justify-start md:justify-center gap-2 md:gap-4 mb-8 md:mb-12 overflow-x-auto overflow-y-visible scrollbar-hide snap-x snap-mandatory py-3 -my-3"
          >
            {SCHEDULE_CATEGORIES.map(category => (
              <button
                key={category.id}
                id={`tab-${category.id}`}
                role="tab"
                aria-selected={activeTab === category.id}
                aria-controls={`panel-${category.id}`}
                tabIndex={activeTab === category.id ? 0 : -1}
                onClick={() => setActiveTab(category.id)}
                onKeyDown={e => handleKeyDown(e, category.id)}
                className={`flex-shrink-0 snap-center w-[160px] md:w-[180px] lg:w-[200px] px-4 py-3 md:px-6 md:py-4 rounded-full text-sm md:text-base font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black ${
                  activeTab === category.id
                    ? 'bg-primary-accent text-white shadow-accent-glow border-2 border-primary-accent'
                    : 'bg-primary-dark/30 text-neutral/80 hover:bg-primary-dark/50 hover:text-neutral border-2 border-transparent'
                }`}
              >
                <div className="text-center">
                  <div className="font-bold">{t(category.labelKey)}</div>
                  <div className="text-[10px] md:text-xs opacity-80 mt-0.5">
                    {t(category.descriptionKey)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Active Schedule Image */}
        <AnimateOnScroll delay={200}>
          <div
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={-1}
            className="max-w-[600px] lg:max-w-[700px] mx-auto focus:outline-none"
          >
            <button
              onClick={openLightbox}
              className="relative group w-full rounded-lg md:rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black shadow-2xl hover:shadow-accent-glow/50 transition-all duration-300"
              aria-label={`${t(activeCategory.labelKey)} - ${t('horarios_click_to_enlarge')}`}
            >
              <OptimizedImage
                src={activeCategory.imageBasePath}
                altKey={activeCategory.altKey}
                sizes="(max-width: 640px) 95vw, (max-width: 1024px) 70vw, 700px"
                aspectRatio="4/5"
                objectFit="contain"
                width={1080}
                height={1350}
                priority="high"
                placeholder="blur"
                blurDataURL={activeCategory.blurDataURL}
                breakpoints={[320, 640, 1024, 1440, 1920]}
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Click hint */}
              <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-primary-accent/90 backdrop-blur-sm rounded-full text-white text-xs md:text-sm font-semibold uppercase tracking-wide shadow-lg">
                  <svg
                    className="w-4 h-4 md:w-5 md:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                  {t('horarios_click_to_enlarge')}
                </span>
              </div>
            </button>

            {/* Category description below image */}
            <div className="text-center mt-4 md:mt-6">
              <p className="text-neutral/60 text-sm md:text-base">
                <span className="font-semibold text-primary-accent">
                  {t(activeCategory.labelKey)}
                </span>
                {' · '}
                <span>{t(activeCategory.descriptionKey)}</span>
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Lightbox for full-screen zoom */}
      <ImageLightbox
        images={lightboxImages}
        currentIndex={0}
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        onNavigate={() => {}} // Single image, no navigation needed
      />
    </section>
  );
};

export default ScheduleImagesSection;
