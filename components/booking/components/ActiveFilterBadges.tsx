/**
 * ActiveFilterBadges Component
 * Displays removable badge chips for active filters
 */

import React from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { FilterState } from '../types/booking';
import {
  getStyleLabel,
  getLevelLabelKey,
  getDayLabelKey,
  getTimeBlockLabelKey,
  CATEGORY_OPTIONS,
} from '../constants/bookingOptions';

// Close icon for badges
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
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

interface FilterBadgeProps {
  label: string;
  onRemove: () => void;
}

const FilterBadge: React.FC<FilterBadgeProps> = ({ label, onRemove }) => (
  <button
    type="button"
    onClick={onRemove}
    className="
      inline-flex items-center gap-1.5 px-3 py-1.5
      bg-primary-accent/20 text-primary-accent
      rounded-full text-sm font-medium
      hover:bg-primary-accent/30 transition-colors duration-150
      group
    "
    aria-label={`Remove filter: ${label}`}
  >
    <CloseIcon className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
    <span>{label}</span>
  </button>
);

interface ActiveFilterBadgesProps {
  filters: FilterState;
  onClearFilter: (key: keyof FilterState) => void;
  onClearAll: () => void;
}

export const ActiveFilterBadges: React.FC<ActiveFilterBadgesProps> = ({
  filters,
  onClearFilter,
  onClearAll,
}) => {
  const { t } = useI18n();

  // Build array of active filters with their display labels
  const activeFilters: Array<{ key: keyof FilterState; label: string }> = [];

  // Category filter badge (shown first as it's the primary filter)
  if (filters.category) {
    const categoryOption = CATEGORY_OPTIONS.find(c => c.value === filters.category);
    if (categoryOption) {
      activeFilters.push({
        key: 'category',
        label: t(categoryOption.labelKey),
      });
    }
  }

  if (filters.style) {
    activeFilters.push({
      key: 'style',
      label: getStyleLabel(filters.style),
    });
  }

  if (filters.level) {
    activeFilters.push({
      key: 'level',
      label: t(getLevelLabelKey(filters.level)),
    });
  }

  if (filters.day) {
    activeFilters.push({
      key: 'day',
      label: t(getDayLabelKey(filters.day)),
    });
  }

  if (filters.timeBlock) {
    activeFilters.push({
      key: 'timeBlock',
      label: t(getTimeBlockLabelKey(filters.timeBlock)),
    });
  }

  if (filters.instructor) {
    activeFilters.push({
      key: 'instructor',
      label: filters.instructor,
    });
  }

  if (filters.time) {
    activeFilters.push({
      key: 'time',
      label: filters.time,
    });
  }

  // Don't render if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map(({ key, label }) => (
        <FilterBadge key={key} label={label} onRemove={() => onClearFilter(key)} />
      ))}

      {/* Clear all button - always show when filters are active */}
      <button
        type="button"
        onClick={onClearAll}
        className="
          text-sm text-neutral/60 hover:text-neutral
          underline underline-offset-2
          transition-colors duration-150
          ml-2
        "
      >
        {t('booking_clear_all_filters')}
      </button>
    </div>
  );
};

export default ActiveFilterBadges;
