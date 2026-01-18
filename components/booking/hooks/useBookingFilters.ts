/**
 * useBookingFilters Hook
 * Manages filter state with URL synchronization for deep linking
 */
/* global URLSearchParams */

import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FilterState } from '../types/booking';
import { INITIAL_FILTERS } from '../types/booking';
import { pushToDataLayer } from '../../../utils/analytics';

// URL parameter keys
const FILTER_PARAMS = ['style', 'level', 'day', 'timeBlock', 'instructor', 'time'] as const;

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
}

export function useBookingFilters(): UseBookingFiltersReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params into FilterState
  const urlFilters = useMemo((): FilterState => {
    return {
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

  // Update both state and URL
  const setFilters = useCallback(
    (newFilters: Partial<FilterState>) => {
      setFiltersState(prev => {
        const updated = { ...prev, ...newFilters };

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

  // Get week offset from URL
  const weekOffset = parseInt(searchParams.get('week') || '0', 10);

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
  };
}
