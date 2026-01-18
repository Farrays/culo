/* eslint-disable no-undef */
/**
 * useInfiniteScroll Hook
 * Implements infinite scroll using IntersectionObserver
 */

import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
  /** Callback when sentinel becomes visible */
  onLoadMore: () => void | Promise<void>;
  /** Whether more data can be loaded */
  hasMore: boolean;
  /** Whether currently loading */
  isLoading: boolean;
  /** Root margin for IntersectionObserver (default: '100px') */
  rootMargin?: string;
  /** Threshold for intersection (default: 0.1) */
  threshold?: number;
}

interface UseInfiniteScrollReturn {
  /** Ref to attach to the sentinel element */
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  /** Whether the sentinel is visible */
  isIntersecting: boolean;
}

export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '100px',
  threshold = 0.1,
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const loadMoreRef = useRef(onLoadMore);

  // Keep callback ref updated
  useEffect(() => {
    loadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      const intersecting = entry?.isIntersecting ?? false;
      setIsIntersecting(intersecting);

      if (intersecting && hasMore && !isLoading) {
        loadMoreRef.current();
      }
    },
    [hasMore, isLoading]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold,
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect, rootMargin, threshold]);

  return { sentinelRef, isIntersecting };
}
