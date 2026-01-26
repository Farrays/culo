/**
 * useBookingFilters Hook
 * Manages filter state with URL synchronization for deep linking
 */
/* global URLSearchParams */

import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { FilterState } from '../types/booking';
import { INITIAL_FILTERS } from '../types/booking';
import { pushToDataLayer } from '../../../utils/analytics';

// Debounce delay for URL sync (ms)
const URL_SYNC_DEBOUNCE = 300;

// URL parameter keys
const FILTER_PARAMS = [
  'category',
  'style',
  'level',
  'day',
  'timeBlock',
  'instructor',
  'time',
] as const;

export interface UseBookingFiltersReturn {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  setFilters: (newFilters: Partial<FilterState>) => void;
  clearFilter: (key: keyof FilterState) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  directClassId: string | null;
  weekOffset: number;
  setWeekOffset: (week: number) => void;
  /** When true, filters UI should be hidden (user came from landing with pre-selected style) */
  filtersLocked: boolean;
}

export function useBookingFilters(): UseBookingFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Debounce timer ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Parse URL params into FilterState
  const urlFilters = useMemo((): FilterState => {
    return {
      category: searchParams.get('category') || '',
      style: searchParams.get('style') || '',
      level: searchParams.get('level') || '',
      day: searchParams.get('day') || '',
      timeBlock: searchParams.get('timeBlock') || '',
      instructor: searchParams.get('instructor') || '',
      time: searchParams.get('time') || '',
    };
  }, [searchParams]);

  // Local filter state (synced with URL)
  const [filters, setFiltersState] = useState<FilterState>(urlFilters);

  // Sync URL to state when URL changes externally (e.g., browser back/forward)
  useEffect(() => {
    setFiltersState(urlFilters);
  }, [urlFilters]);

  // Track deep link usage on mount
  useEffect(() => {
    const hasUrlFilters = FILTER_PARAMS.some(key => searchParams.get(key));
    if (hasUrlFilters) {
      pushToDataLayer({
        event: 'booking_deep_link_used',
        category: searchParams.get('category') || undefined,
        style: searchParams.get('style') || undefined,
        level: searchParams.get('level') || undefined,
        day: searchParams.get('day') || undefined,
        timeBlock: searchParams.get('timeBlock') || undefined,
        instructor: searchParams.get('instructor') || undefined,
        time: searchParams.get('time') || undefined,
      });
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update both state and URL (with debounced URL sync)
  const setFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      // Update state immediately for responsive UI
      setFiltersState(prev => {
        const updated = { ...prev, ...newFilters };

        // Clear any pending debounce
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Debounce URL sync and analytics
        debounceTimerRef.current = setTimeout(() => {
          // Update URL params
          const params = new URLSearchParams(searchParams);

          // Update filter params
          Object.entries(updated).forEach(([key, value]) => {
            if (value) {
              params.set(key, value);
            } else {
              params.delete(key);
            }
          });

          // Preserve classId if exists
          const classId = searchParams.get('classId');
          if (classId) {
            params.set('classId', classId);
          }

          // Preserve week if exists
          const week = searchParams.get('week');
          if (week) {
            params.set('week', week);
          }

          setSearchParams(params, { replace: true });

          // Track filter change
          pushToDataLayer({
            event: 'booking_filter_changed',
            ...updated,
            active_filter_count: Object.values(updated).filter(Boolean).length,
          });
        }, URL_SYNC_DEBOUNCE);

        return updated;
      });
    },
    [searchParams, setSearchParams]
  );

  // Set a single filter
  const setFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters({ [key]: value });
    },
    [setFilters]
  );

  // Clear single filter
  const clearFilter = useCallback(
    (key: keyof FilterState) => {
      setFilters({ [key]: '' });
    },
    [setFilters]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, [setFilters]);

  // Set week offset (also syncs to URL)
  const setWeekOffset = useCallback(
    (week: number) => {
      const params = new URLSearchParams(searchParams);
      if (week > 0) {
        params.set('week', String(week));
      } else {
        params.delete('week');
      }
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Check for direct classId navigation
  const directClassId = searchParams.get('classId');

  // Get week offset from URL (validated: 0-4 range)
  const rawWeekOffset = parseInt(searchParams.get('week') || '0', 10);
  const weekOffset = Math.min(4, Math.max(0, isNaN(rawWeekOffset) ? 0 : rawWeekOffset));

  // Check if filters should be locked (hidden UI but filter still applied)
  const filtersLocked = searchParams.get('locked') === 'true';

  // Active filter count for UI
  const activeFilterCount = useMemo(() => Object.values(filters).filter(Boolean).length, [filters]);

  const hasActiveFilters = activeFilterCount > 0;

  return {
    filters,
    setFilter,
    setFilters,
    clearFilter,
    clearAllFilters,
    hasActiveFilters,
    activeFilterCount,
    directClassId,
    weekOffset,
    setWeekOffset,
    filtersLocked,
  };
}
