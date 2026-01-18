/**
 * FilterBar Component
 * Horizontal bar with dropdown filters for the booking widget
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { FilterState, FilterOptions } from '../types/booking';
import {
  STYLE_OPTIONS,
  LEVEL_OPTIONS,
  DAY_OPTIONS,
  TIME_BLOCK_OPTIONS,
} from '../constants/bookingOptions';

// Chevron icon for dropdowns
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface FilterDropdownProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as HTMLElement)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Find selected option label
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption?.label || label;
  const hasValue = value !== '';

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`
          flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
          transition-all duration-200 whitespace-nowrap
          ${
            hasValue
              ? 'bg-primary-accent text-white shadow-lg shadow-primary-accent/30'
              : 'bg-white/10 text-neutral/80 hover:bg-white/20 hover:text-neutral'
          }
          ${isOpen ? 'ring-2 ring-primary-accent/50' : ''}
        `}
      >
        <span>{displayLabel}</span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 mt-2 z-50
            min-w-[180px] max-h-[300px] overflow-y-auto
            bg-primary-dark/95 backdrop-blur-xl rounded-xl
            border border-white/10 shadow-2xl
            animate-in fade-in slide-in-from-top-2 duration-200
          "
        >
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                onClose();
              }}
              className={`
                w-full text-left px-4 py-3 text-sm
                transition-colors duration-150
                first:rounded-t-xl last:rounded-b-xl
                ${
                  option.value === value
                    ? 'bg-primary-accent text-white'
                    : 'text-neutral/80 hover:bg-white/10 hover:text-neutral'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  filterOptions: FilterOptions;
  loading?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  filterOptions,
  loading = false,
}) => {
  const { t } = useI18n();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Close dropdown handler
  const handleClose = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  // Toggle dropdown handler
  const handleToggle = useCallback((dropdown: string) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  }, []);

  // Build style options with available styles from API
  const styleOptions = [
    { value: '', label: t('booking_filter_all_styles') },
    ...STYLE_OPTIONS.filter(s => s.value !== '').map(style => ({
      value: style.value,
      label: style.label || t(style.labelKey || ''),
    })),
  ];

  // Build level options
  const levelOptions = LEVEL_OPTIONS.map(level => ({
    value: level.value,
    label: t(level.labelKey),
  }));

  // Build day options
  const dayOptions = DAY_OPTIONS.map(day => ({
    value: day.value,
    label: t(day.labelKey),
  }));

  // Build time block options
  const timeBlockOptions = TIME_BLOCK_OPTIONS.map(time => ({
    value: time.value,
    label: t(time.labelKey),
  }));

  // Build instructor options from available instructors
  const instructorOptions = [
    { value: '', label: t('booking_filter_all_instructors') },
    ...filterOptions.instructors.map(instructor => ({
      value: instructor,
      label: instructor,
    })),
  ];

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 w-28 bg-white/10 rounded-xl animate-pulse flex-shrink-0" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {/* Style filter */}
      <FilterDropdown
        label={t('booking_filter_style')}
        value={filters.style}
        options={styleOptions}
        onChange={value => onFilterChange('style', value)}
        isOpen={openDropdown === 'style'}
        onToggle={() => handleToggle('style')}
        onClose={handleClose}
      />

      {/* Level filter */}
      <FilterDropdown
        label={t('booking_filter_level')}
        value={filters.level}
        options={levelOptions}
        onChange={value => onFilterChange('level', value)}
        isOpen={openDropdown === 'level'}
        onToggle={() => handleToggle('level')}
        onClose={handleClose}
      />

      {/* Day filter */}
      <FilterDropdown
        label={t('booking_filter_day')}
        value={filters.day}
        options={dayOptions}
        onChange={value => onFilterChange('day', value)}
        isOpen={openDropdown === 'day'}
        onToggle={() => handleToggle('day')}
        onClose={handleClose}
      />

      {/* Time block filter */}
      <FilterDropdown
        label={t('booking_filter_time')}
        value={filters.timeBlock}
        options={timeBlockOptions}
        onChange={value => onFilterChange('timeBlock', value)}
        isOpen={openDropdown === 'timeBlock'}
        onToggle={() => handleToggle('timeBlock')}
        onClose={handleClose}
      />

      {/* Instructor filter */}
      {filterOptions.instructors.length > 0 && (
        <FilterDropdown
          label={t('booking_filter_instructor')}
          value={filters.instructor}
          options={instructorOptions}
          onChange={value => onFilterChange('instructor', value)}
          isOpen={openDropdown === 'instructor'}
          onToggle={() => handleToggle('instructor')}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default FilterBar;
