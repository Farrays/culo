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
import { Portal } from './Portal';

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
  const historyPushedRef = useRef(false);
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
    // Set global flag to indicate modal is open
    window.__bookingModalOpen = true;

    // Push history state for modal (only once)
    if (!historyPushedRef.current) {
      window.history.pushState({ modal: 'classInfo', bookingWidget: true }, '');
      historyPushedRef.current = true;
    }

    // Handle browser back button
    const handlePopState = () => {
      historyPushedRef.current = false;
      window.__bookingModalOpen = false;
      onClose();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.__bookingModalOpen = false;
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
    const { t } = useI18n();
    const [infoModal, setInfoModal] = useState<ClassData | null>(null);
    const listContainerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

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

    // Virtualization for large lists
    const { virtualItems, totalHeight, isVirtualizing } = useVirtualList<ClassData>({
      items: displayClasses,
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

        {/* Week Navigation */}
        <WeekNavigation weekOffset={weekOffset} onWeekChange={onWeekChange} loading={loading} />

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
