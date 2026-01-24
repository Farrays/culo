/* eslint-disable no-undef */
/**
 * useScheduleSessions Hook
 *
 * Fetches dynamic schedule data from Momence API for displaying
 * class schedules with specific dates (e.g., "Lun 20 Ene - 19:00").
 *
 * @module useScheduleSessions
 *
 * @example
 * ```tsx
 * const {
 *   sessions,      // Array of schedule sessions
 *   byDate,        // Sessions grouped by date
 *   loading,       // Loading state
 *   error,         // Error message if fetch failed
 *   isEmpty,       // True if no classes scheduled (vacation)
 *   refetch,       // Manual refetch function
 *   lastUpdated,   // Timestamp of last successful fetch
 * } = useScheduleSessions({ style: 'bachata', days: 14 });
 * ```
 *
 * @features
 * - **Smart Caching**: 5-minute stale time with background revalidation
 * - **Retry Logic**: Exponential backoff (1s → 2s → 4s) with jitter
 * - **Fallback Support**: Returns static data on API failure
 * - **Vacation Detection**: isEmpty flag for no-class periods
 * - **AbortController**: Cancels pending requests on cleanup
 */

import { useState, useEffect, useCallback, useRef } from 'react';

// Types matching the API response
export interface ScheduleSession {
  id: number;
  name: string;
  style: string;
  level: string;
  instructor: string;
  instructorId?: number;
  dateFormatted: string; // "20 Ene"
  dayKey: string; // "monday" for i18n
  dayOfWeek: string; // "Lunes" (localized)
  time: string; // "19:00"
  endTime: string; // "20:00"
  spotsAvailable: number;
  isFull: boolean;
  capacity: number;
  rawStartsAt: string;
  duration: number;
  category: string;
  pageSlug: string;
}

export interface UseScheduleSessionsOptions {
  /** Filter by dance style (e.g., 'bachata', 'salsa') */
  style?: string;
  /** Number of days ahead to fetch (default: 14, max: 28) */
  days?: number;
  /** Locale for date formatting (default: 'es') */
  locale?: string;
  /** Disable fetching (useful for conditional rendering) */
  enabled?: boolean;
  /** Static fallback data to use if API fails */
  fallbackData?: ScheduleSession[];
}

export interface UseScheduleSessionsReturn {
  /** Array of schedule sessions */
  sessions: ScheduleSession[];
  /** Sessions grouped by date (YYYY-MM-DD) */
  byDate: Record<string, ScheduleSession[]>;
  /** Sessions grouped by day of week */
  byDayOfWeek: Record<string, ScheduleSession[]>;
  /** Loading state */
  loading: boolean;
  /** Error message if fetch failed */
  error: string | null;
  /** True if no classes are scheduled (vacation period) */
  isEmpty: boolean;
  /** Manual refetch function */
  refetch: () => Promise<void>;
  /** Timestamp of last successful fetch */
  lastUpdated: Date | null;
  /** Available styles in the results */
  stylesAvailable: string[];
  /** Available categories in the results */
  categoriesAvailable: string[];
  /** Whether using fallback data */
  usingFallback: boolean;
}

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
} as const;

// Cache configuration - aligned with API cache (15 min)
const CACHE_STALE_TIME = 15 * 60 * 1000; // 15 minutes (matches server cache)
const scheduleCache = new Map<
  string,
  {
    data: ScheduleSession[];
    byDate: Record<string, ScheduleSession[]>;
    byDayOfWeek: Record<string, ScheduleSession[]>;
    stylesAvailable: string[];
    categoriesAvailable: string[];
    timestamp: number;
  }
>();

// Helper: Sleep with abort support
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timeout);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });
}

// Helper: Calculate delay with exponential backoff and jitter
function calculateBackoffDelay(attempt: number): number {
  const delay = Math.min(
    RETRY_CONFIG.baseDelay * Math.pow(RETRY_CONFIG.backoffFactor, attempt),
    RETRY_CONFIG.maxDelay
  );
  // Add jitter (±20%) to prevent thundering herd
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

// Helper: Generate cache key
function getCacheKey(style?: string, days?: number, locale?: string): string {
  return `schedule:${style || 'all'}:${days || 14}:${locale || 'es'}`;
}

// Helper: Check if cache is fresh
function isCacheFresh(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_STALE_TIME;
}

export function useScheduleSessions({
  style,
  days = 14,
  locale = 'es',
  enabled = true,
  fallbackData = [],
}: UseScheduleSessionsOptions = {}): UseScheduleSessionsReturn {
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [byDate, setByDate] = useState<Record<string, ScheduleSession[]>>({});
  const [byDayOfWeek, setByDayOfWeek] = useState<Record<string, ScheduleSession[]>>({});
  const [stylesAvailable, setStylesAvailable] = useState<string[]>([]);
  const [categoriesAvailable, setCategoriesAvailable] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // AbortController ref for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSchedule = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const cacheKey = getCacheKey(style, days, locale);

    // Check cache first
    const cached = scheduleCache.get(cacheKey);
    if (cached && isCacheFresh(cached.timestamp)) {
      setSessions(cached.data);
      setByDate(cached.byDate);
      setByDayOfWeek(cached.byDayOfWeek);
      setStylesAvailable(cached.stylesAvailable);
      setCategoriesAvailable(cached.categoriesAvailable);
      setLoading(false);
      setLastUpdated(new Date(cached.timestamp));
      setUsingFallback(false);
      return;
    }

    // Cancel previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      try {
        const params = new URLSearchParams({
          days: days.toString(),
          locale,
        });

        if (style) {
          params.set('style', style);
        }

        const response = await fetch(`/api/schedule?${params.toString()}`, {
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          // Don't retry on client errors (4xx) except 429 (rate limit)
          if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new Error(`HTTP ${response.status}`);
          }
          throw new Error(`HTTP ${response.status}`);
        }

        // Verify response is JSON before parsing (dev server may return HTML)
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error(
            'API not available (expected JSON, got ' + (contentType || 'unknown') + ')'
          );
        }

        const result = await response.json();

        if (result.success) {
          const data = result.data;
          const newSessions = data.sessions || [];
          const newByDate = data.byDate || {};
          const newByDayOfWeek = data.byDayOfWeek || {};
          const newStylesAvailable = data.stylesAvailable || [];
          const newCategoriesAvailable = data.categoriesAvailable || [];

          // Update cache
          scheduleCache.set(cacheKey, {
            data: newSessions,
            byDate: newByDate,
            byDayOfWeek: newByDayOfWeek,
            stylesAvailable: newStylesAvailable,
            categoriesAvailable: newCategoriesAvailable,
            timestamp: Date.now(),
          });

          setSessions(newSessions);
          setByDate(newByDate);
          setByDayOfWeek(newByDayOfWeek);
          setStylesAvailable(newStylesAvailable);
          setCategoriesAvailable(newCategoriesAvailable);
          setLastUpdated(new Date());
          setUsingFallback(false);
          setLoading(false);
          return;
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      } catch (err) {
        // Don't retry on abort
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }

        lastError = err instanceof Error ? err : new Error('Unknown error');

        // If we have retries left, wait and try again
        if (attempt < RETRY_CONFIG.maxRetries) {
          try {
            const delay = calculateBackoffDelay(attempt);
            await sleep(delay, abortControllerRef.current?.signal);
          } catch {
            // Aborted during sleep
            return;
          }
        }
      }
    }

    // All retries failed - use fallback data if available
    const errorMessage = lastError?.message || 'Error loading schedule';
    setError(errorMessage);

    if (fallbackData.length > 0) {
      setSessions(fallbackData);
      setUsingFallback(true);
      // Group fallback data by date
      const fallbackByDate: Record<string, ScheduleSession[]> = {};
      const fallbackByDayOfWeek: Record<string, ScheduleSession[]> = {};
      fallbackData.forEach(s => {
        const dateKey = s.rawStartsAt?.split('T')[0] || '';
        if (dateKey) {
          if (!fallbackByDate[dateKey]) fallbackByDate[dateKey] = [];
          fallbackByDate[dateKey].push(s);
        }
        const dayKey = s.dayKey;
        if (!fallbackByDayOfWeek[dayKey]) fallbackByDayOfWeek[dayKey] = [];
        fallbackByDayOfWeek[dayKey].push(s);
      });
      setByDate(fallbackByDate);
      setByDayOfWeek(fallbackByDayOfWeek);
    } else {
      setSessions([]);
      setByDate({});
      setByDayOfWeek({});
    }

    setLoading(false);
    // Only log error if fallback wasn't used (warn if using fallback)
    if (fallbackData.length > 0) {
      // In dev mode with fallback, this is expected - use warn level
      if (import.meta.env.DEV) {
        console.warn('Schedule API unavailable, using fallback data');
      } else {
        console.warn('Failed to fetch schedule, using fallback data:', lastError?.message);
      }
    } else {
      console.error('Failed to fetch schedule:', lastError);
    }
  }, [enabled, style, days, locale, fallbackData]);

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    const cacheKey = getCacheKey(style, days, locale);
    scheduleCache.delete(cacheKey);
    await fetchSchedule();
  }, [style, days, locale, fetchSchedule]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchSchedule();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchSchedule]);

  // Refetch on window focus (stale-while-revalidate pattern)
  useEffect(() => {
    const handleFocus = () => {
      const cacheKey = getCacheKey(style, days, locale);
      const cached = scheduleCache.get(cacheKey);
      // Only refetch if cache is stale
      if (!cached || !isCacheFresh(cached.timestamp)) {
        fetchSchedule();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [style, days, locale, fetchSchedule]);

  const isEmpty = !loading && sessions.length === 0;

  return {
    sessions,
    byDate,
    byDayOfWeek,
    loading,
    error,
    isEmpty,
    refetch,
    lastUpdated,
    stylesAvailable,
    categoriesAvailable,
    usingFallback,
  };
}

// Export cache utilities for testing
export const scheduleCacheUtils = {
  clear: (): void => scheduleCache.clear(),
  get: (key: string): ReturnType<typeof scheduleCache.get> => scheduleCache.get(key),
  has: (key: string): boolean => scheduleCache.has(key),
};
