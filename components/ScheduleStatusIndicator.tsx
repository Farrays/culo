/**
 * ScheduleStatusIndicator - Enterprise Status Component
 *
 * Shows real-time sync status with theme colors and animations.
 * Displays either:
 * - Live/Real-time indicator (green pulse) when data is fresh
 * - Cached indicator (yellow) when using fallback data
 *
 * @module ScheduleStatusIndicator
 */

import React, { memo, useMemo } from 'react';

interface ScheduleStatusIndicatorProps {
  /** Translation function */
  t: (_key: string) => string;
  /** Whether using fallback/cached data */
  usingFallback: boolean;
  /** Last updated timestamp */
  lastUpdated: Date | null;
  /** Whether data has been fetched */
  hasFetched: boolean;
}

/**
 * Calculate minutes since last update
 */
function getMinutesSinceUpdate(lastUpdated: Date | null): number {
  if (!lastUpdated) return 0;
  return Math.floor((Date.now() - lastUpdated.getTime()) / 60000);
}

/**
 * Format the time since update message
 */
function formatUpdateTime(t: (_key: string) => string, minutes: number): string {
  if (minutes < 1) {
    return t('scheduleStatusUpdatedNow');
  }
  return t('scheduleStatusUpdatedMinutes').replace('{minutes}', minutes.toString());
}

const ScheduleStatusIndicator: React.FC<ScheduleStatusIndicatorProps> = memo(
  function ScheduleStatusIndicator({ t, usingFallback, lastUpdated, hasFetched }) {
    const minutesSinceUpdate = useMemo(() => getMinutesSinceUpdate(lastUpdated), [lastUpdated]);

    // Don't show anything if data hasn't been fetched yet
    if (!hasFetched) {
      return null;
    }

    // Cached/Fallback indicator (yellow - warning)
    if (usingFallback) {
      return (
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30"
          role="status"
          aria-live="polite"
        >
          {/* Warning icon */}
          <svg
            className="w-4 h-4 text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span className="text-sm font-medium text-yellow-400">{t('scheduleUsingCached')}</span>
        </div>
      );
    }

    // Real-time/Live indicator (brand colors with pulse)
    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-accent/10 border border-primary-accent/30"
        role="status"
        aria-live="polite"
      >
        {/* Live pulse indicator */}
        <span className="relative flex h-3 w-3" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-accent" />
        </span>

        {/* Status text */}
        <span className="text-sm font-medium text-primary-accent">{t('scheduleStatusLive')}</span>

        {/* Separator */}
        <span className="text-primary-accent/50" aria-hidden="true">
          •
        </span>

        {/* Sync status */}
        <span className="text-sm text-primary-accent/80">{t('scheduleStatusRealtime')}</span>

        {/* Update time (show if more than 0 minutes) */}
        {minutesSinceUpdate > 0 && (
          <>
            <span className="text-primary-accent/50" aria-hidden="true">
              •
            </span>
            <span className="text-xs text-primary-accent/60">
              {formatUpdateTime(t, minutesSinceUpdate)}
            </span>
          </>
        )}
      </div>
    );
  }
);

export default ScheduleStatusIndicator;
