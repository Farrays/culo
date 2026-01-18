/**
 * ClassListStep Component
 * Step 1: Class selection with filters and week navigation
 */

import React, { useState } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { ClassData, FilterState, FilterOptions } from '../types/booking';
import { FilterBar } from './FilterBar';
import { ActiveFilterBadges } from './ActiveFilterBadges';
import { ClassCard } from './ClassCard';
import { WeekNavigation } from './WeekNavigation';

// Info modal icon
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface ClassInfoModalProps {
  classData: ClassData;
  onClose: () => void;
}

const ClassInfoModal: React.FC<ClassInfoModalProps> = ({ classData, onClose }) => {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-primary-dark border border-white/10 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-neutral/60 hover:text-neutral hover:bg-white/10 transition-colors"
          aria-label={t('booking_modal_close')}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Content */}
        <h3 className="text-xl font-bold text-neutral mb-2 pr-10">{classData.name}</h3>

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
}

export const ClassListStep: React.FC<ClassListStepProps> = ({
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
}) => {
  const { t } = useI18n();
  const [infoModal, setInfoModal] = useState<ClassData | null>(null);

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

      {/* Classes List */}
      <div className="mt-4">
        {loading ? (
          // Loading skeleton
          <div className="space-y-3">
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
        ) : classes.length === 0 ? (
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
          // Class list
          <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {classes.map(classData => (
              <ClassCard
                key={classData.id}
                classData={classData}
                onSelect={onSelectClass}
                onShowInfo={setInfoModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && !error && classes.length > 0 && (
        <p className="text-center text-sm text-neutral/50">
          {t('booking_classes_found', { count: classes.length })}
        </p>
      )}

      {/* Info Modal */}
      {infoModal && <ClassInfoModal classData={infoModal} onClose={() => setInfoModal(null)} />}
    </div>
  );
};

export default ClassListStep;
