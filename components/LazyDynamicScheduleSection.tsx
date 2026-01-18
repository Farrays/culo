/* eslint-disable no-undef */
/**
 * LazyDynamicScheduleSection - Enterprise Schedule Component
 *
 * Combines all enterprise features:
 * - Lazy loading (only fetches when approaching viewport)
 * - Prefetch on scroll intent
 * - Dynamic JSON-LD schema for SEO
 * - Performance tracking
 * - Error reporting
 *
 * @module LazyDynamicScheduleSection
 *
 * @example
 * ```tsx
 * <LazyDynamicScheduleSection
 *   t={t}
 *   style="bachata"
 *   courseName="Bachata Barcelona"
 *   courseUrl="https://farrayscenter.com/es/clases/bachata-barcelona"
 *   locale="es"
 * />
 * ```
 */

import React, { memo, useCallback } from 'react';
import DynamicScheduleSection, { ScheduleSkeleton, VacationNotice } from './DynamicScheduleSection';
import DynamicScheduleSchema, { VacationSchema } from './DynamicScheduleSchema';
import ScheduleStatusIndicator from './ScheduleStatusIndicator';
import { useLazyScheduleSessions } from '../hooks/useLazyScheduleSessions';
import type { ScheduleSession } from '../hooks/useScheduleSessions';
import { captureException, addBreadcrumb } from '../utils/sentry';

interface LazyDynamicScheduleSectionProps {
  /** Section id */
  id?: string;
  /** Translation function */
  t: (_key: string) => string;
  /** Dance style to filter (e.g., 'bachata', 'salsa') */
  style?: string;
  /** Number of days ahead to show */
  days?: number;
  /** Locale for date formatting */
  locale?: string;
  /** Course name for schema */
  courseName: string;
  /** Full course URL for schema */
  courseUrl: string;
  /** Course description for schema */
  courseDescription?: string;
  /** Static fallback data - SHOWN IMMEDIATELY for SEO */
  fallbackData?: ScheduleSession[];
  /** Title key for i18n */
  titleKey?: string;
  /** Subtitle key for i18n */
  subtitleKey?: string;
  /** Show availability info */
  showAvailability?: boolean;
  /** Callback when user wants to be notified */
  onNotifyMe?: () => void;
  /** Disable lazy loading (fetch immediately) */
  eager?: boolean;
  /** Enable prefetch on scroll intent */
  prefetch?: boolean;
  /** Callback when schedule is viewed (analytics) */
  onScheduleView?: (sessions: ScheduleSession[]) => void;
  /** Callback on fetch error */
  onError?: (error: string) => void;
  /**
   * SEO Strategy:
   * - 'skeleton': Show loading skeleton until data loads (default)
   * - 'static-first': Show fallbackData immediately, then hydrate with dynamic (BEST FOR SEO)
   * - 'dynamic-only': Only show dynamic data
   */
  seoStrategy?: 'skeleton' | 'static-first' | 'dynamic-only';
  /** Event image URL for schema Rich Results (1200x630 recommended) */
  eventImage?: string;
}

const LazyDynamicScheduleSection: React.FC<LazyDynamicScheduleSectionProps> = memo(
  function LazyDynamicScheduleSection({
    id = 'schedule',
    t,
    style,
    days = 14,
    locale = 'es',
    courseName,
    courseUrl,
    courseDescription,
    fallbackData = [],
    titleKey = 'scheduleTitle',
    subtitleKey = 'scheduleSubtitle',
    showAvailability = false,
    onNotifyMe,
    eager = false,
    prefetch = true,
    onScheduleView,
    onError,
    seoStrategy = 'static-first', // Default to SEO-safe strategy
    eventImage,
  }) {
    // Analytics and error callbacks
    const handleFetchComplete = useCallback(
      (sessions: ScheduleSession[], duration: number) => {
        // Log performance metric
        if (typeof window !== 'undefined' && window.performance) {
          performance.mark('schedule-fetch-complete');
          performance.measure('schedule-fetch-duration', {
            start: performance.now() - duration,
            end: performance.now(),
          });
        }

        // Analytics callback
        onScheduleView?.(sessions);

        // Log to Sentry as breadcrumb
        addBreadcrumb(`Schedule loaded: ${sessions.length} sessions in ${duration}ms`, {
          duration,
          sessionCount: sessions.length,
        });
      },
      [onScheduleView]
    );

    const handleFetchError = useCallback(
      (error: string) => {
        // Report to Sentry
        captureException(new Error(`Schedule fetch failed: ${error}`), {
          tags: { style, locale },
          extra: { days, courseUrl },
        });

        // User callback
        onError?.(error);
      },
      [style, locale, days, courseUrl, onError]
    );

    const handleVisible = useCallback(() => {
      // Track section visibility for analytics
      if (typeof window !== 'undefined' && 'gtag' in window) {
        (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag(
          'event',
          'schedule_section_view',
          {
            event_category: 'engagement',
            event_label: courseName,
            style,
          }
        );
      }
    }, [courseName, style]);

    // Use lazy loading hook
    const {
      ref,
      sessions,
      loading,
      error,
      isEmpty,
      usingFallback,
      isVisible,
      hasFetched,
      refetch,
      lastUpdated,
    } = useLazyScheduleSessions({
      style,
      days,
      locale,
      fallbackData,
      eager,
      prefetch,
      onVisible: handleVisible,
      onFetchComplete: handleFetchComplete,
      onFetchError: handleFetchError,
    });

    return (
      <>
        {/*
          Schema Strategy:
          - static-first: Show schema for fallbackData immediately (SSR/SEO friendly)
          - After fetch: Update with dynamic schema
        */}

        {/* Static Schema for initial render (SEO - Google sees this immediately) */}
        {seoStrategy === 'static-first' && !hasFetched && fallbackData.length > 0 && (
          <DynamicScheduleSchema
            sessions={fallbackData}
            courseName={courseName}
            courseUrl={courseUrl}
            courseDescription={courseDescription}
            locale={locale}
            eventImage={eventImage}
          />
        )}

        {/* Dynamic Schema - Replace static after data loads */}
        {hasFetched && !isEmpty && sessions.length > 0 && (
          <DynamicScheduleSchema
            sessions={sessions}
            courseName={courseName}
            courseUrl={courseUrl}
            courseDescription={courseDescription}
            locale={locale}
            eventImage={eventImage}
          />
        )}

        {/* Vacation Schema when empty */}
        {hasFetched && isEmpty && <VacationSchema courseName={courseName} courseUrl={courseUrl} />}

        {/* Schedule Section with ref for intersection observer */}
        <section
          ref={ref as React.RefObject<HTMLElement>}
          id={id}
          className="py-12 md:py-16 bg-primary-dark/10"
          data-testid="schedule-section"
          data-visible={isVisible}
          data-fetched={hasFetched}
        >
          <div className="container mx-auto px-6">
            {/* Header - Always visible */}
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                {t(titleKey)}
              </h2>
              <p className="text-lg text-neutral/90 mb-4">{t(subtitleKey)}</p>
              {/* Enterprise Status Indicator - Shows real-time sync status */}
              <ScheduleStatusIndicator
                t={t}
                usingFallback={usingFallback}
                lastUpdated={lastUpdated}
                hasFetched={hasFetched}
              />
            </div>

            {/* Content - SEO Strategy determines initial render */}
            <div className="max-w-5xl mx-auto">
              {/*
                SEO Strategy Logic:
                - 'skeleton': Show skeleton until dynamic data loads
                - 'static-first': Show fallback immediately, hydrate with dynamic (BEST FOR SEO)
                - 'dynamic-only': Only show dynamic data
              */}

              {/* SKELETON STRATEGY: Show loading state */}
              {seoStrategy === 'skeleton' && !hasFetched && <ScheduleSkeleton />}

              {/* STATIC-FIRST STRATEGY: Show fallback data IMMEDIATELY for SEO */}
              {seoStrategy === 'static-first' && !hasFetched && fallbackData.length > 0 && (
                <DynamicScheduleSection
                  t={t}
                  sessions={fallbackData}
                  loading={false}
                  isEmpty={false}
                  showAvailability={showAvailability}
                  usingFallback={false}
                  showHeader={false}
                  embedded={true}
                />
              )}

              {/* STATIC-FIRST with no fallback: Show skeleton */}
              {seoStrategy === 'static-first' && !hasFetched && fallbackData.length === 0 && (
                <ScheduleSkeleton />
              )}

              {/* DYNAMIC-ONLY STRATEGY: Show skeleton until loaded */}
              {seoStrategy === 'dynamic-only' && !hasFetched && <ScheduleSkeleton />}

              {/* Loading indicator during refetch (all strategies) */}
              {loading && hasFetched && <ScheduleSkeleton />}

              {/* Error state */}
              {error && !usingFallback && sessions.length === 0 && (
                <div className="text-center py-8 px-6">
                  <div className="max-w-md mx-auto">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                      onClick={() => refetch()}
                      className="px-4 py-2 bg-white/10 text-neutral rounded-lg hover:bg-white/20 transition-colors"
                    >
                      {t('retry')}
                    </button>
                  </div>
                </div>
              )}

              {/* Empty/Vacation state */}
              {!loading && hasFetched && isEmpty && !error && (
                <VacationNotice t={t} onNotifyMe={onNotifyMe} />
              )}

              {/* Schedule cards - Show dynamic data once fetched */}
              {!loading && hasFetched && !isEmpty && sessions.length > 0 && (
                <DynamicScheduleSection
                  t={t}
                  sessions={sessions}
                  loading={false}
                  isEmpty={false}
                  showAvailability={showAvailability}
                  usingFallback={usingFallback}
                  showHeader={false}
                  embedded={true}
                />
              )}
            </div>
          </div>
        </section>
      </>
    );
  }
);

export default LazyDynamicScheduleSection;

// Re-export for convenience
export { DynamicScheduleSchema, VacationSchema };
