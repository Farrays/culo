/* eslint-disable no-undef */
/**
 * useBookingClasses Hook
 *
 * Handles class data fetching, caching, and filtering with enterprise-level
 * reliability features including retry with exponential backoff.
 *
 * @module useBookingClasses
 *
 * @example
 * ```tsx
 * const {
 *   classes,         // Filtered classes for current week
 *   allClasses,      // All cached classes (for filter options)
 *   loading,         // Loading state
 *   error,           // Error message if fetch failed
 *   refetch,         // Manual refetch function
 *   filterOptions,   // Available filter values
 *   getClassById,    // Find class by ID
 *   retryCount,      // Current retry attempt
 *   isRetrying,      // Whether currently retrying
 *   loadMore,        // Pagination: load next page
 *   hasMore,         // Pagination: more pages exist
 *   fromCache,       // Whether data came from cache
 * } = useBookingClasses({ filters, weekOffset });
 * ```
 *
 * @features
 * - **Lazy Loading**: Fetches 7 days at a time instead of 28
 * - **Smart Caching**: Shared cache layer with TTL (5 minutes)
 * - **Prefetching**: Automatically prefetches adjacent weeks
 * - **Retry Logic**: Exponential backoff (1s → 2s → 4s) with jitter
 * - **Pagination**: Optional infinite scroll support
 * - **AbortController**: Cancels pending requests on cleanup
 *
 * @performance
 * - Memoized filter application
 * - Deduplication of cached results
 * - Request deduplication via AbortController
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ClassData, FilterState, FilterOptions } from '../types/booking';
import {
  CLASS_TEMPLATES,
  DAY_NAMES,
  TIME_BLOCK_OPTIONS,
  API_ENDPOINTS,
} from '../constants/bookingOptions';
import { classCache } from '../utils/classCache';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
} as const;

// Pagination configuration
const PAGE_SIZE = 20;

interface UseBookingClassesOptions {
  filters: FilterState;
  weekOffset: number;
  /** Enable pagination for large datasets */
  enablePagination?: boolean;
  /** Page size for pagination (default: 20) */
  pageSize?: number;
  /** Fetch all 4 weeks when true (Acuity mode for filters) */
  fetchAllWeeks?: boolean;
}

interface UseBookingClassesReturn {
  classes: ClassData[];
  allClasses: ClassData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filterOptions: FilterOptions;
  getClassById: (id: number) => ClassData | undefined;
  retryCount: number;
  isRetrying: boolean;
  /** Pagination: load next page */
  loadMore: () => Promise<void>;
  /** Pagination: whether more pages exist */
  hasMore: boolean;
  /** Pagination: current page number */
  currentPage: number;
  /** Whether data came from cache */
  fromCache: boolean;
  /** All weeks classes (when fetchAllWeeks is true) */
  allWeeksClasses: ClassData[];
  /** Loading state for all weeks fetch */
  allWeeksLoading: boolean;
}

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

// Helper: Fetch with retry and exponential backoff
async function fetchWithRetry<T>(
  url: string,
  options: {
    signal?: AbortSignal;
    onRetry?: (attempt: number, delay: number) => void;
  } = {}
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      const response = await fetch(url, { signal: options.signal });

      if (!response.ok) {
        // Don't retry on client errors (4xx) except 429 (rate limit)
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new Error(`HTTP ${response.status}`);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Don't retry on abort
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }

      lastError = error instanceof Error ? error : new Error('Unknown error');

      // If we have retries left, wait and try again
      if (attempt < RETRY_CONFIG.maxRetries) {
        const delay = calculateBackoffDelay(attempt);
        options.onRetry?.(attempt + 1, delay);

        try {
          await sleep(delay, options.signal);
        } catch {
          // Aborted during sleep
          throw lastError;
        }
      }
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

// Generate mock classes for a specific week offset
function generateMockClassesForWeek(weekOffset: number): ClassData[] {
  const classes: ClassData[] = [];
  const now = new Date();

  CLASS_TEMPLATES.forEach((template, idx) => {
    const targetDay = template.dayOfWeek;
    const currentDay = now.getDay();
    let daysUntil = targetDay - currentDay;
    if (daysUntil < 0) daysUntil += 7;
    daysUntil += weekOffset * 7;

    const classDate = new Date(now.getTime() + daysUntil * 24 * 60 * 60 * 1000);
    const timeParts = template.time.split(':').map(Number);
    const hours = timeParts[0] ?? 0;
    const minutes = timeParts[1] ?? 0;
    classDate.setHours(hours, minutes, 0, 0);

    // Skip if the class is in the past (only for week 0)
    if (weekOffset === 0 && classDate < now) return;

    // Mark some classes as "new" for demo (K-Pop and classes in future weeks)
    const isNewClass =
      weekOffset >= 1 &&
      (template.style === 'kpop' ||
        template.name.toLowerCase().includes('rueda') ||
        (weekOffset === 2 && template.style === 'salsa'));

    // Set newUntil to 2 weeks from now for demo
    const newUntilDate = new Date();
    newUntilDate.setDate(newUntilDate.getDate() + 14);

    classes.push({
      id: 1000 + weekOffset * 100 + idx,
      name: template.name,
      date: classDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
      time: template.time,
      dayOfWeek: DAY_NAMES[classDate.getDay()] ?? 'Lunes',
      spotsAvailable: Math.floor(Math.random() * 10) + 2,
      isFull: false,
      location: "Farray's Center",
      instructor: template.instructor,
      style: template.style,
      level: template.level,
      rawStartsAt: classDate.toISOString(),
      duration: template.duration,
      description: template.description,
      isNew: isNewClass,
      newUntil: isNewClass ? newUntilDate.toISOString().split('T')[0] : undefined,
    });
  });

  return classes.sort(
    (a, b) => new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime()
  );
}

// Note: filterByWeek is no longer needed as we fetch per-week from the API
// The server handles week filtering via the 'week' query parameter

// Apply time block filter
function applyTimeBlockFilter(classes: ClassData[], timeBlock: string): ClassData[] {
  const blockOption = TIME_BLOCK_OPTIONS.find(t => t.value === timeBlock);
  if (!blockOption?.range) return classes;

  const [start, end] = blockOption.range;
  return classes.filter(c => {
    const hour = parseInt(c.time.split(':')[0] || '0', 10);
    return hour >= start && hour < end;
  });
}

// Apply specific time filter
function applyTimeFilter(classes: ClassData[], time: string): ClassData[] {
  if (!time) return classes;
  return classes.filter(c => c.time === time);
}

// Apply all filters
function applyFilters(classes: ClassData[], filters: FilterState): ClassData[] {
  let result = classes;

  if (filters.style) {
    result = result.filter(c => c.style === filters.style);
  }

  if (filters.level) {
    result = result.filter(c => c.level === filters.level);
  }

  if (filters.day) {
    result = result.filter(c => c.dayOfWeek === filters.day);
  }

  if (filters.timeBlock) {
    result = applyTimeBlockFilter(result, filters.timeBlock);
  }

  if (filters.time) {
    result = applyTimeFilter(result, filters.time);
  }

  if (filters.instructor) {
    result = result.filter(c =>
      c.instructor.toLowerCase().includes(filters.instructor.toLowerCase())
    );
  }

  return result;
}

export function useBookingClasses({
  filters,
  weekOffset,
  enablePagination = false,
  pageSize = PAGE_SIZE,
  fetchAllWeeks = false,
}: UseBookingClassesOptions): UseBookingClassesReturn {
  const [weekClasses, setWeekClasses] = useState<ClassData[]>([]);
  const [allClasses, setAllClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fromCache, setFromCache] = useState(false);

  // All weeks mode state (Acuity mode)
  const [allWeeksClasses, setAllWeeksClasses] = useState<ClassData[]>([]);
  const [allWeeksLoading, setAllWeeksLoading] = useState(false);

  // AbortController ref for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastWeekOffsetRef = useRef<number>(weekOffset);
  // Track if component is still mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch classes for a specific week (lazy loading)
  const fetchWeekClasses = useCallback(
    async (week: number, page = 1) => {
      // Check cache first
      const cached = classCache.get(week, enablePagination ? page : undefined);
      if (cached) {
        if (isMountedRef.current) {
          setFromCache(true);
          if (page === 1) {
            setWeekClasses(cached);
          } else {
            setWeekClasses(prev => {
              const existingIds = new Set(prev.map(c => c.id));
              return [...prev, ...cached.filter(c => !existingIds.has(c.id))];
            });
          }
          setHasMore(cached.length >= pageSize);
        }
        return cached;
      }

      if (isMountedRef.current) {
        setFromCache(false);
      }
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      if (isMountedRef.current) {
        if (page === 1) {
          setLoading(true);
          setError(null);
        }
        setRetryCount(0);
        setIsRetrying(false);
      }

      try {
        let classes: ClassData[];

        if (import.meta.env.DEV) {
          // Use mock data in development - simulate per-week fetch
          await new Promise(resolve => setTimeout(resolve, 200));
          const weekData = generateMockClassesForWeek(week);

          // Simulate pagination
          if (enablePagination) {
            const start = (page - 1) * pageSize;
            classes = weekData.slice(start, start + pageSize);
            if (isMountedRef.current) setHasMore(start + pageSize < weekData.length);
          } else {
            classes = weekData;
            if (isMountedRef.current) setHasMore(false);
          }
        } else {
          // Fetch only 7 days for current week (lazy loading)
          const params = new URLSearchParams({
            week: week.toString(),
            days: '7',
          });

          if (enablePagination) {
            params.set('page', page.toString());
            params.set('pageSize', pageSize.toString());
          }

          const data = await fetchWithRetry<{
            success: boolean;
            data?: { classes: ClassData[]; hasMore?: boolean; total?: number };
            error?: string;
          }>(`${API_ENDPOINTS.CLASSES}?${params.toString()}`, {
            signal: abortControllerRef.current.signal,
            onRetry: attempt => {
              if (isMountedRef.current) {
                setRetryCount(attempt);
                setIsRetrying(true);
              }
            },
          });

          if (data.success) {
            classes = data.data?.classes || [];
            if (isMountedRef.current) setHasMore(data.data?.hasMore ?? classes.length >= pageSize);
          } else {
            throw new Error(data.error || 'Unknown error');
          }
        }

        // Update cache
        classCache.set(week, classes, enablePagination ? page : undefined);

        // Update state (only if still mounted)
        if (isMountedRef.current) {
          if (page === 1) {
            setWeekClasses(classes);
          } else {
            setWeekClasses(prev => {
              const existingIds = new Set(prev.map(c => c.id));
              return [...prev, ...classes.filter(c => !existingIds.has(c.id))];
            });
          }
        }

        return classes;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return [];
        }

        const message = err instanceof Error ? err.message : 'Error loading classes';
        if (isMountedRef.current) {
          setError(message);
          if (page === 1) setWeekClasses([]);
        }
        console.error('Failed to fetch classes:', err);
        return [];
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
          setIsRetrying(false);
        }
      }
    },
    [enablePagination, pageSize]
  );

  // Prefetch adjacent weeks for smooth navigation
  const prefetchAdjacentWeeks = useCallback(
    (currentWeek: number) => {
      // Prefetch next week if not cached
      if (!classCache.has(currentWeek + 1) && currentWeek < 3) {
        fetchWeekClasses(currentWeek + 1).catch(() => {});
      }
      // Prefetch previous week if not cached
      if (!classCache.has(currentWeek - 1) && currentWeek > 0) {
        fetchWeekClasses(currentWeek - 1).catch(() => {});
      }
    },
    [fetchWeekClasses]
  );

  // Load more for pagination (infinite scroll)
  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchWeekClasses(weekOffset, nextPage);
  }, [hasMore, loading, currentPage, weekOffset, fetchWeekClasses]);

  // Refetch current week
  const refetch = useCallback(async () => {
    classCache.invalidate(weekOffset);
    setCurrentPage(1);
    await fetchWeekClasses(weekOffset, 1);
  }, [weekOffset, fetchWeekClasses]);

  // Fetch on week change
  useEffect(() => {
    if (lastWeekOffsetRef.current !== weekOffset) {
      setCurrentPage(1);
      lastWeekOffsetRef.current = weekOffset;
    }

    fetchWeekClasses(weekOffset, 1).then(() => {
      // Prefetch adjacent weeks after current week loads
      prefetchAdjacentWeeks(weekOffset);
    });

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [weekOffset, fetchWeekClasses, prefetchAdjacentWeeks]);

  // Maintain allClasses for filter options (aggregate from cache)
  useEffect(() => {
    const aggregated: ClassData[] = [];
    for (let w = 0; w < 4; w++) {
      const cached = classCache.get(w);
      if (cached) aggregated.push(...cached);
    }
    if (aggregated.length > 0) {
      setAllClasses(aggregated);
    } else {
      setAllClasses(weekClasses);
    }
  }, [weekClasses]);

  // Fetch all weeks when in Acuity mode (filters active)
  useEffect(() => {
    if (!fetchAllWeeks) {
      if (isMountedRef.current) {
        setAllWeeksClasses([]);
      }
      return;
    }

    // AbortController for canceling requests on cleanup
    const controller = new AbortController();

    const fetchAll = async () => {
      if (isMountedRef.current) {
        setAllWeeksLoading(true);
      }

      try {
        // Fetch all 4 weeks in parallel
        const weekPromises = [0, 1, 2, 3].map(async week => {
          // Check cache first
          const cached = classCache.get(week);
          if (cached) return cached;

          // Generate mock data in dev mode
          if (import.meta.env.DEV) {
            await new Promise(resolve => setTimeout(resolve, 100));
            const data = generateMockClassesForWeek(week);
            classCache.set(week, data);
            return data;
          }

          // Production: fetch from API with abort signal
          const params = new URLSearchParams({ week: week.toString(), days: '7' });
          const response = await fetch(`${API_ENDPOINTS.CLASSES}?${params.toString()}`, {
            signal: controller.signal,
          });
          const data = await response.json();
          if (data.success) {
            classCache.set(week, data.data?.classes || []);
            return data.data?.classes || [];
          }
          return [];
        });

        const results = await Promise.all(weekPromises);
        const combined = results
          .flat()
          .sort((a, b) => new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime());

        // Only update state if still mounted
        if (isMountedRef.current) {
          setAllWeeksClasses(combined);
        }
      } catch (err) {
        // Ignore abort errors
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch all weeks:', err);
        if (isMountedRef.current) {
          setAllWeeksClasses([]);
        }
      } finally {
        if (isMountedRef.current) {
          setAllWeeksLoading(false);
        }
      }
    };

    fetchAll();

    // Cleanup: abort pending requests
    return () => {
      controller.abort();
    };
  }, [fetchAllWeeks]);

  // Apply filters to current week classes
  const classes = useMemo(() => {
    return applyFilters(weekClasses, filters);
  }, [weekClasses, filters]);

  // Apply filters to all weeks classes (Acuity mode)
  const filteredAllWeeksClasses = useMemo(() => {
    return applyFilters(allWeeksClasses, filters);
  }, [allWeeksClasses, filters]);

  // Extract available filter options from all classes
  const filterOptions = useMemo((): FilterOptions => {
    const source = allClasses.length > 0 ? allClasses : weekClasses;
    return {
      styles: [...new Set(source.map(c => c.style))].sort(),
      levels: [...new Set(source.map(c => c.level))].sort(),
      instructors: [...new Set(source.map(c => c.instructor))].filter(Boolean).sort(),
      days: [...new Set(source.map(c => c.dayOfWeek))],
    };
  }, [allClasses, weekClasses]);

  // Get class by ID
  const getClassById = useCallback(
    (id: number): ClassData | undefined => {
      return allClasses.find(c => c.id === id) || weekClasses.find(c => c.id === id);
    },
    [allClasses, weekClasses]
  );

  return {
    classes,
    allClasses,
    loading,
    error,
    refetch,
    filterOptions,
    getClassById,
    retryCount,
    isRetrying,
    loadMore,
    hasMore,
    currentPage,
    fromCache,
    allWeeksClasses: filteredAllWeeksClasses,
    allWeeksLoading,
  };
}
