/* eslint-disable no-undef */
/**
 * useLazyScheduleSessions Hook
 *
 * Enterprise wrapper around useScheduleSessions that adds:
 * - Lazy loading (only fetch when section is visible)
 * - Prefetch on scroll intent (starts loading when user approaches section)
 * - Performance tracking
 * - Error reporting integration
 *
 * @module useLazyScheduleSessions
 *
 * @example
 * ```tsx
 * const {
 *   ref,           // Attach to container element
 *   sessions,
 *   loading,
 *   isVisible,     // Whether section is in viewport
 *   hasFetched,    // Whether data has been fetched at least once
 * } = useLazyScheduleSessions({ style: 'bachata' });
 *
 * return <div ref={ref}>...</div>
 * ```
 */

import { useRef, useState, useEffect } from 'react';
import {
  useScheduleSessions,
  type UseScheduleSessionsOptions,
  type UseScheduleSessionsReturn,
  type ScheduleSession,
} from './useScheduleSessions';
import { useSharedIntersectionObserver, OBSERVER_CONFIGS } from './useSharedIntersectionObserver';

// Prefetch configuration - responsive margins for better mobile experience
const PREFETCH_ROOT_MARGIN_DESKTOP = '400px'; // Desktop: 400px prefetch
// Note: Mobile margin (200px) was removed to fix hydration mismatch - SSR always uses desktop margin
const LAZY_LOAD_ROOT_MARGIN = '100px'; // Consider visible when 100px from viewport

/**
 * Get responsive prefetch margin based on viewport width
 * Returns smaller margin on mobile to reduce unnecessary data fetching
 * NOTE: Always returns desktop margin during SSR to avoid hydration mismatch
 */
function getPrefetchRootMargin(): string {
  // Always use desktop margin - responsive adjustment happens client-side only
  // This prevents hydration mismatch between server and client
  return PREFETCH_ROOT_MARGIN_DESKTOP;
}

export interface UseLazyScheduleSessionsOptions extends UseScheduleSessionsOptions {
  /** Disable lazy loading (fetch immediately) */
  eager?: boolean;
  /** Enable prefetch when approaching section */
  prefetch?: boolean;
  /** Custom root margin for intersection observer */
  rootMargin?: string;
  /** Callback when section becomes visible */
  onVisible?: () => void;
  /** Callback when fetch completes */
  onFetchComplete?: (sessions: ScheduleSession[], duration: number) => void;
  /** Callback on fetch error */
  onFetchError?: (error: string) => void;
}

export interface UseLazyScheduleSessionsReturn extends UseScheduleSessionsReturn {
  /** Ref to attach to the container element */
  ref: React.RefObject<HTMLElement>;
  /** Whether the section is currently visible */
  isVisible: boolean;
  /** Whether data has been fetched at least once */
  hasFetched: boolean;
  /** Whether currently prefetching */
  isPrefetching: boolean;
  /** Time taken to fetch (ms) */
  fetchDuration: number | null;
}

/**
 * Get prefetch observer config with responsive margin
 * Uses larger margin on desktop, smaller on mobile
 */
function getPrefetchConfig() {
  return {
    threshold: 0,
    rootMargin: getPrefetchRootMargin(),
    once: true,
  };
}

/**
 * Hook for lazy-loaded schedule sessions with prefetch support
 */
export function useLazyScheduleSessions({
  style,
  days = 14,
  locale = 'es',
  fallbackData = [],
  startHour,
  endHour,
  eager = false,
  prefetch = true,
  rootMargin = LAZY_LOAD_ROOT_MARGIN,
  onVisible,
  onFetchComplete,
  onFetchError,
}: UseLazyScheduleSessionsOptions = {}): UseLazyScheduleSessionsReturn {
  // State
  const [shouldFetch, setShouldFetch] = useState(eager);
  const [hasFetched, setHasFetched] = useState(false);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [fetchDuration, setFetchDuration] = useState<number | null>(null);

  // Refs
  const fetchStartTime = useRef<number | null>(null);
  const hasCalledOnVisible = useRef(false);

  // Intersection observers
  const [lazyRef, isVisible] = useSharedIntersectionObserver<HTMLElement>({
    ...OBSERVER_CONFIGS.lazyLoad,
    rootMargin,
  });

  const [prefetchRef, isApproaching] =
    useSharedIntersectionObserver<HTMLElement>(getPrefetchConfig());

  // Combine refs
  const combinedRef = useRef<HTMLElement>(null);

  // Sync combined ref with both observers
  useEffect(() => {
    if (combinedRef.current) {
      // Manually set the refs (they're callback refs internally)
      (lazyRef as React.MutableRefObject<HTMLElement | null>).current = combinedRef.current;
      (prefetchRef as React.MutableRefObject<HTMLElement | null>).current = combinedRef.current;
    }
  }, [lazyRef, prefetchRef]);

  // Handle prefetch when approaching
  useEffect(() => {
    if (prefetch && isApproaching && !shouldFetch && !hasFetched) {
      setIsPrefetching(true);
      setShouldFetch(true);
      fetchStartTime.current = performance.now();
    }
  }, [prefetch, isApproaching, shouldFetch, hasFetched]);

  // Handle visible state
  useEffect(() => {
    if (isVisible && !shouldFetch) {
      setShouldFetch(true);
      if (!fetchStartTime.current) {
        fetchStartTime.current = performance.now();
      }
    }

    // Call onVisible callback once
    if (isVisible && !hasCalledOnVisible.current) {
      hasCalledOnVisible.current = true;
      onVisible?.();
    }
  }, [isVisible, shouldFetch, onVisible]);

  // Use the base hook with controlled enabled state
  const scheduleResult = useScheduleSessions({
    style,
    days,
    locale,
    fallbackData,
    startHour,
    endHour,
    enabled: shouldFetch,
  });

  // Track fetch completion
  useEffect(() => {
    if (!scheduleResult.loading && shouldFetch && !hasFetched) {
      setHasFetched(true);
      setIsPrefetching(false);

      // Calculate fetch duration
      if (fetchStartTime.current) {
        const duration = Math.round(performance.now() - fetchStartTime.current);
        setFetchDuration(duration);

        // Call completion callback
        if (scheduleResult.error) {
          onFetchError?.(scheduleResult.error);
        } else {
          onFetchComplete?.(scheduleResult.sessions, duration);
        }
      }
    }
  }, [
    scheduleResult.loading,
    scheduleResult.sessions,
    scheduleResult.error,
    shouldFetch,
    hasFetched,
    onFetchComplete,
    onFetchError,
  ]);

  return {
    ...scheduleResult,
    ref: combinedRef as React.RefObject<HTMLElement>,
    isVisible,
    hasFetched,
    isPrefetching,
    fetchDuration,
  };
}

/**
 * Prefetch schedule data for a specific style
 * Use this to warm the cache before navigation
 *
 * @example
 * ```tsx
 * // On link hover
 * <Link
 *   href="/bachata"
 *   onMouseEnter={() => prefetchSchedule('bachata')}
 * >
 * ```
 */
export async function prefetchSchedule(style?: string, days = 14, locale = 'es'): Promise<void> {
  try {
    const params = new URLSearchParams({
      days: days.toString(),
      locale,
    });

    if (style) {
      params.set('style', style);
    }

    // Use low priority fetch
    await fetch(`/api/schedule?${params.toString()}`, {
      priority: 'low',
    } as RequestInit);
  } catch {
    // Silently fail prefetch - it's an optimization, not critical
  }
}

export default useLazyScheduleSessions;
