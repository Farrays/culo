/**
 * ClassListStep Component
 * Step 1: Class selection with filters and week navigation
 */

import React, { useState, memo, useCallback, useRef, useEffect } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { ClassData, FilterState, FilterOptions } from '../types/booking';
import { FilterBar } from './FilterBar';
import { ActiveFilterBadges } from './ActiveFilterBadges';
import { ClassCard } from './ClassCard';
import { WeekNavigation } from './WeekNavigation';
import { useVirtualList } from '../hooks/useVirtualList';

// Estimated height of each ClassCard (in pixels)
const CLASS_CARD_HEIGHT = 180;

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
  const modalId = `class-info-modal-${classData.id}`;
  const titleId = `class-info-title-${classData.id}`;

  // Focus trap, keyboard handling, and browser back button
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    // Store previously focused element
    const previouslyFocused = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;

    // Focus the close button on mount
    closeButtonRef.current?.focus();

    // Push history state for modal
    window.history.pushState({ modal: 'classInfo' }, '');

    // Handle browser back button
    const handlePopState = () => {
      onClose();
    };

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Go back in history instead of just closing
        window.history.back();
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
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  // Close via backdrop click - use history.back() for consistency
  const handleBackdropClick = () => {
    window.history.back();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      id={modalId}
    >
      {/* Backdrop - solid dark */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-black border border-white/20 rounded-2xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => window.history.back()}
          className="absolute top-4 right-4 p-2 rounded-lg text-neutral/60 hover:text-neutral hover:bg-white/10 transition-colors z-10"
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
            <strong className="text-neutral">{t('booking_info_day')}:</strong> {classData.dayOfWeek}{' '}
            {classData.date}
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
  /** Show all weeks mode (Acuity style) */
  showAllWeeks?: boolean;
  /** All weeks classes when in Acuity mode */
  allWeeksClasses?: ClassData[];
  /** Loading state for all weeks */
  allWeeksLoading?: boolean;
}

// Helper: Group classes by week
function groupClassesByWeek(classes: ClassData[]): Map<string, ClassData[]> {
  const groups = new Map<string, ClassData[]>();

  classes.forEach(classData => {
    const date = new Date(classData.rawStartsAt);
    // Get the Monday of the week
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const weekKey = monday.toISOString().split('T')[0] || '';

    if (!groups.has(weekKey)) {
      groups.set(weekKey, []);
    }
    groups.get(weekKey)?.push(classData);
  });

  return groups;
}

// Helper: Format week header
function formatWeekHeader(weekKey: string, t: (key: string) => string): string {
  const date = new Date(weekKey);
  const day = date.getDate();
  const month = date.toLocaleDateString('es-ES', { month: 'short' });
  return `${t('booking_week_of')} ${day} ${month}`;
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
    const { t } = useI18n();
    const [infoModal, setInfoModal] = useState<ClassData | null>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Determine which classes to display
    const displayClasses = showAllWeeks ? allWeeksClasses : classes;
    const isLoading = showAllWeeks ? allWeeksLoading : loading;

    // Group classes by week when in all-weeks mode
    const groupedClasses = React.useMemo(() => {
      if (!showAllWeeks) return null;
      return groupClassesByWeek(allWeeksClasses);
    }, [showAllWeeks, allWeeksClasses]);

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

    // Virtualization for large lists
    const { virtualItems, totalHeight, isVirtualizing } = useVirtualList<ClassData>({
      items: classes,
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

        {/* Week Navigation - hidden in all-weeks mode */}
        {!showAllWeeks && (
          <WeekNavigation weekOffset={weekOffset} onWeekChange={onWeekChange} loading={loading} />
        )}

        {/* All weeks header - shown when filters active */}
        {showAllWeeks && !isLoading && (
          <div className="text-center py-3 px-4 bg-primary-accent/10 border border-primary-accent/20 rounded-xl">
            <p className="text-sm font-medium text-primary-accent">
              {t('booking_all_weeks_showing')}
            </p>
          </div>
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
            // Loading skeleton
            <div className="space-y-3" aria-hidden="true">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
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
          ) : showAllWeeks && groupedClasses ? (
            // Grouped by week view (Acuity mode)
            <div
              ref={listContainerRef}
              className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
            >
              {Array.from(groupedClasses.entries()).map(([weekKey, weekClasses]) => (
                <div key={weekKey} className="mb-6">
                  {/* Week header - sticky */}
                  <div className="sticky top-0 z-10 py-2 mb-3 bg-black/95 backdrop-blur-sm border-b border-white/10">
                    <h3 className="text-sm font-semibold text-primary-accent uppercase tracking-wide">
                      {formatWeekHeader(weekKey, t)}
                    </h3>
                  </div>
                  {/* Classes for this week */}
                  <div className="grid gap-4">
                    {weekClasses.map(classData => (
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
            // Class list with virtualization for large lists
            <div
              ref={listContainerRef}
              className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
              style={isVirtualizing ? { position: 'relative' } : undefined}
            >
              {isVirtualizing ? (
                // Virtualized list for 20+ items
                <div style={{ height: totalHeight, position: 'relative' }}>
                  {virtualItems.map(({ item, style }) => (
                    <div key={item.id} style={{ ...style, paddingBottom: 16 }}>
                      <ClassCard
                        classData={item}
                        onSelect={onSelectClass}
                        onShowInfo={handleShowInfo}
                        isSelected={selectedClassId === item.id}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                // Standard list for smaller lists
                <div className="grid gap-4">
                  {classes.map(classData => (
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
              {onLoadMore && (
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
        {!loading && !error && displayClasses.length > 0 && (
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
