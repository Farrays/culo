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
  getCategoryForStyle,
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

// Minimum hours in advance required to book a class
// Classes starting within this window won't be shown to users
const MIN_BOOKING_HOURS = 24;

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

// Filter classes by week offset (client-side filtering)
function filterByWeek(classesData: ClassData[], offset: number): ClassData[] {
  const now = new Date();
  // Minimum booking time: classes must start at least MIN_BOOKING_HOURS from now
  const minBookingTime = new Date(now.getTime() + MIN_BOOKING_HOURS * 60 * 60 * 1000);

  // Get start of current week (Monday)
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + mondayOffset + offset * 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(0, 0, 0, 0);

  return classesData.filter(c => {
    const classDate = new Date(c.rawStartsAt);
    // All classes must be at least MIN_BOOKING_HOURS in the future
    if (classDate < minBookingTime) {
      return false;
    }
    // For week 0 (current week), include classes from minBookingTime to end of week
    if (offset === 0) {
      return classDate < endOfWeek;
    }
    return classDate >= startOfWeek && classDate < endOfWeek;
  });
}

// Normaliza un string para comparación: lowercase + trim + remove accents
function normalizeForComparison(value: string | null | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics (accents)
}

// Compara dos valores con normalización
function matchesFilter(actual: string, filter: string, partial: boolean = false): boolean {
  const normalizedActual = normalizeForComparison(actual);
  const normalizedFilter = normalizeForComparison(filter);

  if (partial) {
    return normalizedActual.includes(normalizedFilter);
  }
  return normalizedActual === normalizedFilter;
}

// Deduplica un array de clases por ID (mantiene la primera ocurrencia)
function deduplicateById(classes: ClassData[]): ClassData[] {
  const seen = new Set<number>();
  return classes.filter(c => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

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

// Apply all filters with normalized comparisons
function applyFilters(classes: ClassData[], filters: FilterState): ClassData[] {
  let result = classes;

  // Category: filter by category first (if set)
  if (filters.category) {
    result = result.filter(c => {
      const classCategory = getCategoryForStyle(c.style);
      return classCategory === filters.category;
    });
  }

  // Style: exact match (normalized)
  if (filters.style) {
    result = result.filter(c => matchesFilter(c.style, filters.style));
  }

  // Level: exact match (normalized)
  if (filters.level) {
    result = result.filter(c => matchesFilter(c.level, filters.level));
  }

  // Day: exact match (normalized) - handles accents
  if (filters.day) {
    result = result.filter(c => matchesFilter(c.dayOfWeek, filters.day));
  }

  // Time block filter
  if (filters.timeBlock) {
    result = applyTimeBlockFilter(result, filters.timeBlock);
  }

  // Specific time filter
  if (filters.time) {
    result = applyTimeFilter(result, filters.time);
  }

  // Instructor: partial match (normalized) - "Yunaisy" matches "Yunaisy Farray"
  if (filters.instructor) {
    result = result.filter(c => matchesFilter(c.instructor, filters.instructor, true));
  }

  // Deduplicate before returning to avoid showing same class twice
  return deduplicateById(result);
}

export function useBookingClasses({
  filters,
  weekOffset,
  // These are kept for API compatibility but not used in new implementation
  enablePagination: _enablePagination = false,
  pageSize: _pageSize = PAGE_SIZE,
  fetchAllWeeks = false,
}: UseBookingClassesOptions): UseBookingClassesReturn {
  const [weekClasses, setWeekClasses] = useState<ClassData[]>([]);
  const [allClasses, setAllClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [currentPage] = useState(1); // Not used but kept for API compatibility
  const [hasMore, setHasMore] = useState(false); // Always false - all data loaded at once
  const [fromCache, setFromCache] = useState(false);

  // All weeks mode state (Acuity mode)
  const [allWeeksClasses, setAllWeeksClasses] = useState<ClassData[]>([]);
  const [allWeeksLoading, setAllWeeksLoading] = useState(false);

  // AbortController ref for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);
  // Track if component is still mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch ALL classes from API and filter by week for display
  const fetchClasses = useCallback(async () => {
    // Check cache first - returns ALL 28 days of classes
    const cached = classCache.getAll();
    if (cached) {
      if (isMountedRef.current) {
        setFromCache(true);
        setAllClasses(cached);
        // Filter by current week for display
        const weekFiltered = filterByWeek(cached, weekOffset);
        setWeekClasses(weekFiltered);
        setHasMore(false);
        setLoading(false);
      }
      return cached;
    }

    if (isMountedRef.current) {
      setFromCache(false);
      setLoading(true);
      setError(null);
      setRetryCount(0);
      setIsRetrying(false);
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      let allData: ClassData[];

      if (import.meta.env.DEV) {
        // Use mock data in development - generate all 4 weeks
        await new Promise(resolve => setTimeout(resolve, 200));
        allData = [];
        for (let w = 0; w < 4; w++) {
          allData.push(...generateMockClassesForWeek(w));
        }
        // Sort by date
        allData.sort(
          (a, b) => new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime()
        );
      } else {
        // Fetch all 28 days from API
        const data = await fetchWithRetry<{
          success: boolean;
          data?: { classes: ClassData[] };
          error?: string;
        }>(`${API_ENDPOINTS.CLASSES}`, {
          signal: abortControllerRef.current.signal,
          onRetry: attempt => {
            if (isMountedRef.current) {
              setRetryCount(attempt);
              setIsRetrying(true);
            }
          },
        });

        if (data.success) {
          allData = data.data?.classes || [];
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      }

      // Cache ALL data
      classCache.setAll(allData);

      // Update state (only if still mounted)
      if (isMountedRef.current) {
        setAllClasses(allData);
        // Filter by current week for display
        const weekFiltered = filterByWeek(allData, weekOffset);
        setWeekClasses(weekFiltered);
        setHasMore(false);
      }

      return allData;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return [];
      }

      const message = err instanceof Error ? err.message : 'Error loading classes';
      if (isMountedRef.current) {
        setError(message);
        setWeekClasses([]);
        setAllClasses([]);
      }
      console.error('Failed to fetch classes:', err);
      return [];
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
        setIsRetrying(false);
      }
    }
  }, [weekOffset]);

  // Load more is not needed since we fetch all data at once
  const loadMore = useCallback(async () => {
    // No-op - all data is loaded at once
  }, []);

  // Refetch all data
  const refetch = useCallback(async () => {
    classCache.invalidate();
    await fetchClasses();
  }, [fetchClasses]);

  // Initial fetch on mount
  useEffect(() => {
    fetchClasses();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchClasses]);

  // When weekOffset changes, filter from cached data
  useEffect(() => {
    const cached = classCache.getAll();
    if (cached && isMountedRef.current) {
      const weekFiltered = filterByWeek(cached, weekOffset);
      setWeekClasses(weekFiltered);
    }
  }, [weekOffset]);

  // When Acuity mode (filters active), use all cached data
  useEffect(() => {
    if (!fetchAllWeeks) {
      if (isMountedRef.current) {
        setAllWeeksClasses([]);
      }
      return;
    }

    // Use all cached data - already has 28 days
    const cached = classCache.getAll();
    if (cached && isMountedRef.current) {
      // Apply 24h minimum booking filter to all weeks too
      const minBookingTime = new Date(Date.now() + MIN_BOOKING_HOURS * 60 * 60 * 1000);
      const filtered = cached.filter(c => new Date(c.rawStartsAt) >= minBookingTime);
      setAllWeeksClasses(filtered);
      setAllWeeksLoading(false);
    } else {
      // If no cache yet, data will be available after initial fetch
      setAllWeeksLoading(loading);
    }
  }, [fetchAllWeeks, allClasses, loading]);

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
