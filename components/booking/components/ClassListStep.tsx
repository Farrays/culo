/**
 * ClassListStep Component
 * Step 1: Class selection with filters and week navigation
 *
 * Features:
 * - Standard mode: Week navigation with single week view
 * - Acuity mode: When filters active, shows ALL 4 weeks grouped by week
 * - Virtualization for large lists (20+ items)
 * - Infinite scroll support
 * - Accessible with screen reader announcements
 */

import React, { useState, memo, useCallback, useRef, useEffect, useMemo } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { ClassData, FilterState, FilterOptions } from '../types/booking';
import { FilterBar } from './FilterBar';
import { ActiveFilterBadges } from './ActiveFilterBadges';
import { ClassCard } from './ClassCard';
import { WeekNavigation } from './WeekNavigation';
import { useVirtualList } from '../hooks/useVirtualList';
import { Portal } from './Portal';
import { registerModalOpen, registerModalClose } from '../utils/modalHistoryManager';
import { SkeletonClassList } from './SkeletonClassCard';

// Estimated height of each ClassCard (in pixels)
const CLASS_CARD_HEIGHT = 180;

/**
 * Day group structure for standard view with day separators
 */
interface DayGroup {
  dateKey: string; // YYYY-MM-DD
  dayLabel: string; // "Lunes 20 Ene"
  dayOfWeek: string; // "Lunes"
  classes: ClassData[];
}

/**
 * Groups classes by day based on rawStartsAt
 * Returns sorted array of day groups with localized labels
 */
function groupClassesByDay(classes: ClassData[], locale: string): DayGroup[] {
  if (classes.length === 0) return [];

  const dayMap = new Map<string, DayGroup>();

  classes.forEach(classData => {
    const classDate = new Date(classData.rawStartsAt);
    const dateKey = classDate.toISOString().split('T')[0] ?? '';

    if (!dayMap.has(dateKey)) {
      // Format day label: "Lunes 20 Ene"
      const dayOfWeek = classDate.toLocaleDateString(locale === 'ca' ? 'ca-ES' : `${locale}-ES`, {
        weekday: 'long',
      });
      const dateFormatted = classDate.toLocaleDateString(
        locale === 'ca' ? 'ca-ES' : `${locale}-ES`,
        {
          day: 'numeric',
          month: 'short',
        }
      );
      // Capitalize first letter
      const dayOfWeekCapitalized = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);

      dayMap.set(dateKey, {
        dateKey,
        dayLabel: `${dayOfWeekCapitalized} ${dateFormatted}`,
        dayOfWeek: dayOfWeekCapitalized,
        classes: [],
      });
    }

    dayMap.get(dateKey)?.classes.push(classData);
  });

  // Sort days chronologically and sort classes within each day
  return Array.from(dayMap.values())
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
    .map(group => ({
      ...group,
      classes: group.classes.sort(
        (a, b) => new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime()
      ),
    }));
}

/**
 * Calendar icon for week headers
 */
const CalendarWeekIcon: React.FC<{ className?: string }> = memo(({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
));
CalendarWeekIcon.displayName = 'CalendarWeekIcon';

/**
 * Day header component for standard view with day separators
 * Supports ref callback for IntersectionObserver tracking
 */
const DayHeader = memo(
  React.forwardRef<
    HTMLDivElement,
    {
      dayLabel: string;
      classCount: number;
      isFirst?: boolean;
      dateKey: string;
    }
  >(({ dayLabel, classCount, isFirst = false, dateKey }, ref) => {
    const { t } = useI18n();

    return (
      <div
        ref={ref}
        data-date-key={dateKey}
        className={`
          sticky top-0 z-10 flex items-center gap-2 py-2.5 px-3 sm:px-4
          bg-gradient-to-r from-primary-accent/20 via-black to-primary-accent/20
          backdrop-blur-md border-y border-primary-accent/30
          ${isFirst ? '' : 'mt-4'}
        `}
        role="heading"
        aria-level={3}
      >
        <CalendarWeekIcon className="w-4 h-4 text-primary-accent flex-shrink-0" />
        <span className="font-semibold text-neutral text-sm md:text-base truncate">{dayLabel}</span>
        <span className="ml-auto text-xs text-neutral/50 bg-white/5 px-2 py-0.5 rounded-full flex-shrink-0">
          {t('booking_classes_count', { count: classCount })}
        </span>
      </div>
    );
  })
);
DayHeader.displayName = 'DayHeader';

/**
 * Acuity mode header showing filter context
 */
const AcuityModeHeader: React.FC<{
  activeStyle?: string;
  totalClasses: number;
}> = memo(({ activeStyle, totalClasses }) => {
  const { t } = useI18n();

  return (
    <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-primary-accent/10 via-primary-accent/5 to-transparent border border-primary-accent/20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary-accent/20 flex items-center justify-center flex-shrink-0">
          <CalendarWeekIcon className="w-5 h-5 text-primary-accent" />
        </div>
        <div>
          <h3 className="font-semibold text-neutral">
            {activeStyle
              ? t('booking_all_weeks_title', { style: activeStyle })
              : t('booking_all_weeks_filtered')}
          </h3>
          <p className="text-sm text-neutral/60">
            {t('booking_all_weeks_subtitle', { count: totalClasses })}
          </p>
        </div>
      </div>
    </div>
  );
});
AcuityModeHeader.displayName = 'AcuityModeHeader';

// Memoized icon component
const XMarkIcon: React.FC<{ className?: string }> = memo(({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
));
XMarkIcon.displayName = 'XMarkIcon';

interface ClassInfoModalProps {
  classData: ClassData;
  onClose: () => void;
}

const ClassInfoModal: React.FC<ClassInfoModalProps> = ({ classData, onClose }) => {
  const { t } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const historyPushedRef = useRef(false);
  const isRegisteredRef = useRef(false); // Track if we've registered this modal
  const modalId = `class-info-modal-${classData.id}`;
  const titleId = `class-info-title-${classData.id}`;

  // Close with history support
  const handleClose = useCallback(() => {
    if (historyPushedRef.current) {
      window.history.back();
    } else {
      onClose();
    }
  }, [onClose]);

  // History management - must run immediately on mount
  useEffect(() => {
    // Register modal as open (reference counting) - only once
    if (!isRegisteredRef.current) {
      registerModalOpen();
      isRegisteredRef.current = true;
    }

    // Push history state for modal (only once)
    if (!historyPushedRef.current) {
      window.history.pushState({ modal: 'classInfo', bookingWidget: true }, '');
      historyPushedRef.current = true;
    }

    // Handle browser back button
    const handlePopState = () => {
      historyPushedRef.current = false;
      // Only unregister if we registered
      if (isRegisteredRef.current) {
        registerModalClose();
        isRegisteredRef.current = false;
      }
      onClose();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Only unregister in cleanup if still registered (not done by popstate)
      if (isRegisteredRef.current) {
        registerModalClose();
        isRegisteredRef.current = false;
      }
    };
  }, [onClose]);

  // Focus trap, keyboard handling, and body scroll lock
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;

    // Focus the close button on mount
    closeButtonRef.current?.focus();

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [handleClose]);

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        id={modalId}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal - better background and scroll */}
        <div
          ref={modalRef}
          className="relative bg-black border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-neutral/60 hover:text-neutral hover:bg-white/10 transition-colors"
            aria-label={t('booking_modal_close')}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Content */}
          <h3 id={titleId} className="text-xl font-bold text-neutral mb-2 pr-10">
            {classData.name}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-primary-accent/20 text-primary-accent rounded-full text-sm">
              {classData.style}
            </span>
            {classData.level && (
              <span className="px-3 py-1 bg-white/10 text-neutral/80 rounded-full text-sm">
                {classData.level}
              </span>
            )}
          </div>

          <div className="space-y-2 mb-4 text-sm text-neutral/70">
            <p>
              <strong className="text-neutral">{t('booking_info_day')}:</strong>{' '}
              {classData.dayOfWeek} {classData.date}
            </p>
            <p>
              <strong className="text-neutral">{t('booking_info_time')}:</strong> {classData.time}
            </p>
            {classData.instructor && (
              <p>
                <strong className="text-neutral">{t('booking_info_instructor')}:</strong>{' '}
                {classData.instructor}
              </p>
            )}
            <p>
              <strong className="text-neutral">{t('booking_info_location')}:</strong>{' '}
              {classData.location || "Farray's Center"}
            </p>
          </div>

          {classData.description && (
            <div className="pt-4 border-t border-white/10">
              <h4 className="font-medium text-neutral mb-2">{t('booking_info_description')}</h4>
              <p className="text-sm text-neutral/70 whitespace-pre-line">{classData.description}</p>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

interface ClassListStepProps {
  classes: ClassData[];
  filters: FilterState;
  filterOptions: FilterOptions;
  weekOffset: number;
  loading: boolean;
  error: string | null;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onClearFilter: (key: keyof FilterState) => void;
  onClearAllFilters: () => void;
  onWeekChange: (week: number) => void;
  onSelectClass: (classData: ClassData) => void;
  onRetry: () => void;
  /** Infinite scroll: load more handler */
  onLoadMore?: () => void;
  /** Infinite scroll: whether more items exist */
  hasMore?: boolean;
  /** Whether currently loading more */
  isLoadingMore?: boolean;
  /** Currently selected class ID for V1-style visual feedback */
  selectedClassId?: number | null;
  /** Show all weeks (Acuity mode when filters are active) */
  showAllWeeks?: boolean;
  /** All weeks classes when in Acuity mode */
  allWeeksClasses?: ClassData[];
  /** Loading state for all weeks fetch */
  allWeeksLoading?: boolean;
}

export const ClassListStep: React.FC<ClassListStepProps> = memo(
  ({
    classes,
    filters,
    filterOptions,
    weekOffset,
    loading,
    error,
    onFilterChange,
    onClearFilter,
    onClearAllFilters,
    onWeekChange,
    onSelectClass,
    onRetry,
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
    selectedClassId = null,
    showAllWeeks = false,
    allWeeksClasses = [],
    allWeeksLoading = false,
  }) => {
    const { t, locale } = useI18n();
    const [infoModal, setInfoModal] = useState<ClassData | null>(null);
    // State for dynamic day indicator: { dayOfWeek: "Jueves", dateFormatted: "19 ene" }
    const [currentVisibleDay, setCurrentVisibleDay] = useState<{
      dayOfWeek: string;
      dateFormatted: string;
    } | null>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const dayHeaderRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    // Reset scroll position and visible day when week changes
    useEffect(() => {
      if (listContainerRef.current) {
        listContainerRef.current.scrollTop = 0;
      }
      setCurrentVisibleDay(null);
    }, [weekOffset]);

    // Infinite scroll with IntersectionObserver
    useEffect(() => {
      if (!onLoadMore || !hasMore || isLoadingMore) return;

      const sentinel = sentinelRef.current;
      if (!sentinel) return;

      const observer = new IntersectionObserver(
        entries => {
          const [entry] = entries;
          if (entry?.isIntersecting && hasMore && !isLoadingMore) {
            onLoadMore();
          }
        },
        { rootMargin: '100px', threshold: 0.1 }
      );

      observer.observe(sentinel);
      return () => observer.disconnect();
    }, [onLoadMore, hasMore, isLoadingMore]);

    // Determine which classes to display based on mode
    const displayClasses = showAllWeeks && allWeeksClasses.length > 0 ? allWeeksClasses : classes;
    const isLoading = showAllWeeks ? allWeeksLoading : loading;

    // Group classes by day - works in ALL modes for day tracking
    // In standard mode: used for rendering day headers
    // In Acuity mode: used for tracking current visible day in header
    const dayGroups = useMemo(() => {
      if (displayClasses.length === 0) return [];
      return groupClassesByDay(displayClasses, locale);
    }, [displayClasses, locale]);

    // Use day grouping for rendering only in standard mode
    const useDayGrouping = !showAllWeeks && dayGroups.length > 0;

    // Track visible day using IntersectionObserver for dynamic week header
    // Works in both standard and Acuity modes
    useEffect(() => {
      if (dayGroups.length === 0) {
        setCurrentVisibleDay(null);
        return;
      }

      const container = listContainerRef.current;
      if (!container) return;

      // Helper to format date from dateKey
      const formatDateFromKey = (dateKey: string): string => {
        const date = new Date(dateKey);
        return date.toLocaleDateString(locale === 'ca' ? 'ca-ES' : `${locale}-ES`, {
          day: 'numeric',
          month: 'short',
        });
      };

      // Set initial visible day to first day
      if (dayGroups.length > 0 && !currentVisibleDay) {
        const firstGroup = dayGroups[0];
        if (firstGroup) {
          setCurrentVisibleDay({
            dayOfWeek: firstGroup.dayOfWeek,
            dateFormatted: formatDateFromKey(firstGroup.dateKey),
          });
        }
      }

      const observer = new IntersectionObserver(
        entries => {
          // Find all intersecting day headers
          const visibleEntries = entries.filter(entry => entry.isIntersecting);

          if (visibleEntries.length > 0) {
            // Get the topmost visible entry
            const topEntry = visibleEntries.reduce((closest, entry) => {
              const closestRect = closest.boundingClientRect;
              const entryRect = entry.boundingClientRect;
              return entryRect.top < closestRect.top ? entry : closest;
            });

            const dateKey = topEntry.target.getAttribute('data-date-key');
            if (dateKey) {
              const dayGroup = dayGroups.find(g => g.dateKey === dateKey);
              if (dayGroup) {
                setCurrentVisibleDay({
                  dayOfWeek: dayGroup.dayOfWeek,
                  dateFormatted: formatDateFromKey(dateKey),
                });
              }
            }
          }
        },
        {
          root: container,
          rootMargin: '-10% 0px -70% 0px', // Trigger when header enters top 30% of container
          threshold: 0,
        }
      );

      // Observe all day headers
      dayHeaderRefs.current.forEach(element => {
        observer.observe(element);
      });

      return () => observer.disconnect();
    }, [dayGroups, currentVisibleDay, locale]);

    // Virtualization disabled when using day grouping for better UX
    const { virtualItems, totalHeight, isVirtualizing } = useVirtualList<ClassData>({
      items: showAllWeeks || useDayGrouping ? [] : displayClasses,
      itemHeight: CLASS_CARD_HEIGHT,
      containerRef: listContainerRef,
      overscan: 3,
    });

    // Memoized handlers
    const handleCloseModal = useCallback(() => {
      setInfoModal(null);
    }, []);

    const handleShowInfo = useCallback((classData: ClassData) => {
      setInfoModal(classData);
    }, []);

    // Check if any filters are active
    const hasActiveFilters = Object.values(filters).some(Boolean);

    // Get active style for Acuity header (capitalize first letter)
    const activeStyle = filters.style
      ? filters.style.charAt(0).toUpperCase() + filters.style.slice(1)
      : undefined;

    return (
      <div className="animate-fade-in space-y-4">
        {/* Title */}
        <h2 className="text-2xl font-bold text-neutral text-center mb-2">
          {t('booking_step1_classes')}
        </h2>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          filterOptions={filterOptions}
          loading={loading}
        />

        {/* Active Filter Badges */}
        <ActiveFilterBadges
          filters={filters}
          onClearFilter={onClearFilter}
          onClearAll={onClearAllFilters}
        />

        {/* Week/Day Navigation - Always visible, with dynamic day indicator */}
        <WeekNavigation
          weekOffset={weekOffset}
          onWeekChange={onWeekChange}
          loading={loading}
          currentVisibleDay={currentVisibleDay}
        />

        {/* Acuity Mode Header - Additional info when viewing all weeks */}
        {showAllWeeks && displayClasses.length > 0 && (
          <AcuityModeHeader activeStyle={activeStyle} totalClasses={displayClasses.length} />
        )}

        {/* Classes List - aria-live for screen reader announcements */}
        <div
          className="mt-4"
          role="region"
          aria-label={t('booking_classes_region')}
          aria-busy={isLoading}
          aria-live="polite"
        >
          {/* Screen reader loading announcement */}
          <div className="sr-only" aria-live="assertive">
            {isLoading && t('booking_loading_classes')}
          </div>

          {isLoading ? (
            // Elaborated loading skeleton with shimmer effect and loading message
            <SkeletonClassList count={4} loadingMessage={t('booking_loading_please_wait')} />
          ) : error ? (
            // Error state
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <XMarkIcon className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                type="button"
                onClick={onRetry}
                className="px-6 py-2 bg-primary-accent text-white rounded-xl hover:bg-primary-accent/90 transition-colors"
              >
                {t('booking_class_retry')}
              </button>
            </div>
          ) : displayClasses.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-neutral/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-neutral/60 mb-4">
                {hasActiveFilters ? t('booking_no_classes_match') : t('booking_class_empty')}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={onClearAllFilters}
                  className="px-4 py-2 text-primary-accent hover:underline transition-colors"
                >
                  {t('booking_clear_filters')}
                </button>
              )}
            </div>
          ) : showAllWeeks && dayGroups.length > 0 ? (
            // Acuity mode: Classes grouped by day with sticky headers for scroll tracking
            <div
              ref={listContainerRef}
              className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar rounded-xl border border-white/5"
            >
              <div className="space-y-1">
                {dayGroups.map((group, groupIndex) => (
                  <div key={group.dateKey}>
                    {/* Day Header - Sticky, tracked for scroll detection */}
                    <DayHeader
                      ref={el => {
                        if (el) {
                          dayHeaderRefs.current.set(group.dateKey, el);
                        } else {
                          dayHeaderRefs.current.delete(group.dateKey);
                        }
                      }}
                      dateKey={group.dateKey}
                      dayLabel={group.dayLabel}
                      classCount={group.classes.length}
                      isFirst={groupIndex === 0}
                    />
                    {/* Classes for this day */}
                    <div className="grid gap-3 p-3 bg-white/[0.02]">
                      {group.classes.map(classData => (
                        <ClassCard
                          key={classData.id}
                          classData={classData}
                          onSelect={onSelectClass}
                          onShowInfo={handleShowInfo}
                          isSelected={selectedClassId === classData.id}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Standard mode: Class list grouped by day with sticky headers
            <div
              ref={listContainerRef}
              className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
              style={isVirtualizing ? { position: 'relative' } : undefined}
            >
              {isVirtualizing ? (
                // Virtualized list for 20+ items (fallback, rarely used now)
                <div style={{ height: totalHeight, position: 'relative' }}>
                  {virtualItems.map(({ item, style }) => (
                    <div key={item.id} style={{ ...style, paddingBottom: 12 }}>
                      <ClassCard
                        classData={item}
                        onSelect={onSelectClass}
                        onShowInfo={handleShowInfo}
                        isSelected={selectedClassId === item.id}
                      />
                    </div>
                  ))}
                </div>
              ) : useDayGrouping ? (
                // Day-grouped list with sticky day headers
                <div className="space-y-1">
                  {dayGroups.map((group, groupIndex) => (
                    <div key={group.dateKey}>
                      {/* Day Header - Sticky, tracked for scroll detection */}
                      <DayHeader
                        ref={el => {
                          if (el) {
                            dayHeaderRefs.current.set(group.dateKey, el);
                          } else {
                            dayHeaderRefs.current.delete(group.dateKey);
                          }
                        }}
                        dateKey={group.dateKey}
                        dayLabel={group.dayLabel}
                        classCount={group.classes.length}
                        isFirst={groupIndex === 0}
                      />
                      {/* Classes for this day */}
                      <div className="grid gap-3 py-2">
                        {group.classes.map(classData => (
                          <ClassCard
                            key={classData.id}
                            classData={classData}
                            onSelect={onSelectClass}
                            onShowInfo={handleShowInfo}
                            isSelected={selectedClassId === classData.id}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Flat list fallback (no classes or edge case)
                <div className="grid gap-3">
                  {displayClasses.map(classData => (
                    <ClassCard
                      key={classData.id}
                      classData={classData}
                      onSelect={onSelectClass}
                      onShowInfo={handleShowInfo}
                      isSelected={selectedClassId === classData.id}
                    />
                  ))}
                </div>
              )}

              {/* Infinite scroll sentinel */}
              {onLoadMore && !showAllWeeks && (
                <div ref={sentinelRef} className="py-4">
                  {isLoadingMore && (
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-primary-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {!hasMore && displayClasses.length > 0 && (
                    <p className="text-center text-sm text-neutral/40">
                      {t('booking_no_more_classes')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        {!isLoading && !error && displayClasses.length > 0 && (
          <p className="text-center text-sm text-neutral/50">
            {t('booking_classes_found', { count: displayClasses.length })}
          </p>
        )}

        {/* Info Modal */}
        {infoModal && <ClassInfoModal classData={infoModal} onClose={handleCloseModal} />}
      </div>
    );
  }
);

ClassListStep.displayName = 'ClassListStep';

export default ClassListStep;
