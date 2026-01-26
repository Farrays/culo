/**
 * WeekNavigation Component
 * Navigate between weeks with current/future week display
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { MAX_WEEKS } from '../constants/bookingOptions';

// Chevron left icon
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

// Chevron right icon
const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

// Calendar icon
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

interface WeekNavigationProps {
  weekOffset: number;
  onWeekChange: (week: number) => void;
  loading?: boolean;
}

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
  weekOffset,
  onWeekChange,
  loading = false,
}) => {
  const { t, i18n } = useTranslation([
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
  const locale = i18n.language;

  // Calculate week date range
  const getWeekRange = (offset: number): { start: Date; end: Date } => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + mondayOffset + offset * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return { start: weekStart, end: weekEnd };
  };

  // Format date range for display
  const formatWeekRange = (offset: number): string => {
    const { start, end } = getWeekRange(offset);

    const formatOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
    };

    const startStr = start.toLocaleDateString(locale, formatOptions);
    const endStr = end.toLocaleDateString(locale, formatOptions);

    return `${startStr} - ${endStr}`;
  };

  // Get week label
  const getWeekLabel = (offset: number): string => {
    if (offset === 0) return t('booking_week_current');
    if (offset === 1) return t('booking_week_next');
    return t('booking_week_future', { weeks: offset });
  };

  const canGoPrevious = weekOffset > 0;
  const canGoNext = weekOffset < MAX_WEEKS - 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-4 py-3">
        <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
        <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Previous week button */}
      <button
        type="button"
        onClick={() => onWeekChange(weekOffset - 1)}
        disabled={!canGoPrevious}
        className={`
          p-2.5 rounded-xl transition-all duration-200
          ${
            canGoPrevious
              ? 'bg-white/10 text-neutral/80 hover:bg-white/20 hover:text-neutral'
              : 'bg-white/5 text-neutral/30 cursor-not-allowed'
          }
        `}
        aria-label={t('booking_week_previous')}
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      {/* Current week display */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl min-w-[200px] justify-center">
        <CalendarIcon className="w-5 h-5 text-primary-accent" />
        <div className="text-center">
          <div className="text-sm font-medium text-neutral">{getWeekLabel(weekOffset)}</div>
          <div className="text-xs text-neutral/60">{formatWeekRange(weekOffset)}</div>
        </div>
      </div>

      {/* Next week button */}
      <button
        type="button"
        onClick={() => onWeekChange(weekOffset + 1)}
        disabled={!canGoNext}
        className={`
          p-2.5 rounded-xl transition-all duration-200
          ${
            canGoNext
              ? 'bg-white/10 text-neutral/80 hover:bg-white/20 hover:text-neutral'
              : 'bg-white/5 text-neutral/30 cursor-not-allowed'
          }
        `}
        aria-label={t('booking_week_next')}
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default WeekNavigation;
