/**
 * FilterBar Component - V1 Style
 * Collapsible on mobile, inline on desktop
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { FilterState, FilterOptions } from '../types/booking';
import {
  STYLE_OPTIONS,
  LEVEL_OPTIONS,
  DAY_OPTIONS,
  TIME_BLOCK_OPTIONS,
  CATEGORY_OPTIONS,
  getStyleColor,
  getStylesByCategory,
} from '../constants/bookingOptions';
import type { Category } from '../types/booking';

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

const CategoryIcon: React.FC<{ className?: string }> = ({ className }) => (
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
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
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

  // Display the selected option label or the default label
  const displayLabel = hasValue && selectedOption ? selectedOption.label : label;

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
          hasValue
            ? 'bg-primary-accent/15 border-primary-accent/60 text-white shadow-sm shadow-primary-accent/20'
            : 'bg-neutral-900/80 border-neutral-700/50 text-neutral-300 hover:bg-neutral-800/80 hover:border-neutral-600/60 hover:text-white'
        }`}
      >
        {selectedOption?.color ? (
          <div
            className="w-3 h-3 rounded-full ring-1 ring-white/20"
            style={{ backgroundColor: selectedOption.color }}
          />
        ) : (
          icon && <span className="opacity-70">{icon}</span>
        )}
        <span className="whitespace-nowrap">{displayLabel}</span>
        <ChevronDownIcon
          className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-[100] top-full mt-2 left-0 min-w-[180px] max-h-[320px] overflow-y-auto bg-black border border-neutral-600 rounded-lg shadow-2xl shadow-black/80 pointer-events-auto"
          style={{ isolation: 'isolate' }}
        >
          <div className="py-1">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onMouseDown={e => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onClick={e => {
                  e.stopPropagation();
                  onChange(option.value);
                  onClose();
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-all duration-150 flex items-center gap-3 cursor-pointer ${
                  option.value === value
                    ? 'bg-primary-accent/20 text-white font-medium'
                    : 'text-neutral-300 hover:bg-neutral-800/80 hover:text-white'
                }`}
              >
                {option.color && (
                  <div
                    className="w-3 h-3 rounded-full ring-1 ring-white/10 flex-shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                )}
                <span>{option.label}</span>
                {option.value === value && (
                  <svg
                    className="w-4 h-4 ml-auto text-primary-accent"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // Filters visible by default on mobile, click to hide
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClose = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  const handleToggle = useCallback((dropdown: string) => {
    setOpenDropdown(prev => (prev === dropdown ? null : dropdown));
  }, []);

  // Handle category change - clear style if it's not in the new category
  const handleCategoryChange = useCallback(
    (value: string) => {
      onFilterChange('category', value);
      // Clear style if it doesn't belong to the new category
      if (filters.style && value) {
        const stylesInCategory = getStylesByCategory(value as Category);
        const styleExists = stylesInCategory.some(s => s.value === filters.style);
        if (!styleExists) {
          onFilterChange('style', '');
        }
      }
    },
    [filters.style, onFilterChange]
  );

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // Build category options
  const categoryOptions = CATEGORY_OPTIONS.map(cat => ({
    value: cat.value,
    label: t(cat.labelKey),
    color: cat.color,
  }));

  // Build style options - filtered by selected category
  const selectedCategory = filters.category as Category | '';
  const availableStyles = selectedCategory
    ? getStylesByCategory(selectedCategory)
    : STYLE_OPTIONS.filter(s => s.value !== '');

  const styleOptions = [
    { value: '', label: t('booking_filter_all_styles'), color: undefined },
    ...availableStyles.map(style => ({
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
      {/* Category Filter - Primary filter */}
      <FilterDropdown
        label={t('booking_filter_category')}
        value={filters.category}
        options={categoryOptions}
        onChange={handleCategoryChange}
        isOpen={openDropdown === 'category'}
        onToggle={() => handleToggle('category')}
        onClose={handleClose}
        icon={<CategoryIcon className="w-4 h-4" />}
      />

      {/* Style Filter - Shows styles based on selected category */}
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
      <div className="sm:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full justify-center ${
            activeFilterCount > 0
              ? 'bg-primary-accent/15 border border-primary-accent/60 text-white shadow-sm shadow-primary-accent/20'
              : 'bg-neutral-900/80 border border-neutral-700/50 text-neutral-300 hover:bg-neutral-800/80 hover:border-neutral-600/60'
          }`}
        >
          <FilterIcon className="w-4 h-4" />
          <span>
            {t('booking_filters')}
            {activeFilterCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-primary-accent text-white rounded-full font-semibold">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ChevronDownIcon
            className={`w-4 h-4 ml-auto transition-transform duration-200 ${isExpanded ? '' : 'rotate-180'}`}
          />
        </button>

        {/* Expanded filters on mobile */}
        {isExpanded && <div className="mt-3 space-y-2">{filterContent}</div>}
      </div>

      {/* Desktop: Always visible */}
      <div className="hidden sm:block">{filterContent}</div>
    </>
  );
};

export default FilterBar;
