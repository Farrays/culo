/**
 * FilterBar Component - V1 Style
 * Collapsible on mobile, inline on desktop
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useI18n } from '../../../hooks/useI18n';
import type { FilterState, FilterOptions } from '../types/booking';
import {
  STYLE_OPTIONS,
  LEVEL_OPTIONS,
  DAY_OPTIONS,
  TIME_BLOCK_OPTIONS,
  getStyleColor,
} from '../constants/bookingOptions';

// Icons
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

const FilterIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
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
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LevelIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

interface FilterDropdownProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string; color?: string }>;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  icon?: React.ReactNode;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  onClose,
  icon,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const hasValue = value !== '';
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all ${
          hasValue
            ? 'bg-primary-accent/20 border-primary-accent text-neutral'
            : 'bg-white/5 border-white/20 text-neutral/70 hover:border-white/40'
        }`}
      >
        {selectedOption?.color ? (
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedOption.color }} />
        ) : (
          icon
        )}
        {label}
        <ChevronDownIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-20 top-full mt-1 left-0 min-w-[160px] max-h-[300px] overflow-y-auto bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl">
          {options.map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                onClose();
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                option.value === value
                  ? 'bg-primary-accent/20 text-primary-accent'
                  : 'text-neutral/80 hover:bg-white/10'
              }`}
            >
              {option.color && (
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: option.color }} />
              )}
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
  // Filters visible by default on mobile, click to hide
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClose = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const handleToggle = useCallback((dropdown: string) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  }, []);

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Build style options
  const styleOptions = [
    { value: '', label: t('booking_filter_all_styles'), color: undefined },
    ...STYLE_OPTIONS.filter(s => s.value !== '').map(style => ({
      value: style.value,
      label: style.label || t(style.labelKey || ''),
      color: getStyleColor(style.value),
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

  // Build instructor options
  const instructorOptions = [
    { value: '', label: t('booking_filter_all_instructors') },
    ...filterOptions.instructors.map(instructor => ({
      value: instructor,
      label: instructor,
    })),
  ];

  if (loading) {
    return (
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-9 w-24 bg-white/10 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  const filterContent = (
    <div className="flex flex-wrap gap-2">
      {/* Style Filter */}
      <FilterDropdown
        label={t('booking_filter_style')}
        value={filters.style}
        options={styleOptions}
        onChange={value => onFilterChange('style', value)}
        isOpen={openDropdown === 'style'}
        onToggle={() => handleToggle('style')}
        onClose={handleClose}
      />

      {/* Level Filter */}
      <FilterDropdown
        label={t('booking_filter_level')}
        value={filters.level}
        options={levelOptions}
        onChange={value => onFilterChange('level', value)}
        isOpen={openDropdown === 'level'}
        onToggle={() => handleToggle('level')}
        onClose={handleClose}
        icon={<LevelIcon className="w-4 h-4" />}
      />

      {/* Day Filter */}
      <FilterDropdown
        label={t('booking_filter_day')}
        value={filters.day}
        options={dayOptions}
        onChange={value => onFilterChange('day', value)}
        isOpen={openDropdown === 'day'}
        onToggle={() => handleToggle('day')}
        onClose={handleClose}
        icon={<CalendarIcon className="w-4 h-4" />}
      />

      {/* Time Filter */}
      <FilterDropdown
        label={t('booking_filter_time')}
        value={filters.timeBlock}
        options={timeBlockOptions}
        onChange={value => onFilterChange('timeBlock', value)}
        isOpen={openDropdown === 'timeBlock'}
        onToggle={() => handleToggle('timeBlock')}
        onClose={handleClose}
        icon={<ClockIcon className="w-4 h-4" />}
      />

      {/* Instructor Filter */}
      {filterOptions.instructors.length > 0 && (
        <FilterDropdown
          label={t('booking_filter_instructor')}
          value={filters.instructor}
          options={instructorOptions}
          onChange={value => onFilterChange('instructor', value)}
          isOpen={openDropdown === 'instructor'}
          onToggle={() => handleToggle('instructor')}
          onClose={handleClose}
          icon={<UserIcon className="w-4 h-4" />}
        />
      )}
    </div>
  );

  return (
    <>
      {/* Mobile: Collapsible filter toggle */}
      <div className="sm:hidden mb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all w-full justify-center ${
            activeFilterCount > 0
              ? 'bg-primary-accent/20 border border-primary-accent text-neutral'
              : 'bg-white/10 border border-white/20 text-neutral/80'
          }`}
        >
          <FilterIcon className="w-4 h-4" />
          <span>
            {t('booking_filters')}
            {activeFilterCount > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-primary-accent text-white rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ChevronDownIcon
            className={`w-4 h-4 ml-auto transition-transform ${isExpanded ? '' : 'rotate-180'}`}
          />
        </button>

        {/* Expanded filters on mobile */}
        {isExpanded && <div className="mt-3">{filterContent}</div>}
      </div>

      {/* Desktop: Always visible */}
      <div className="hidden sm:block">{filterContent}</div>
    </>
  );
};

export default FilterBar;
