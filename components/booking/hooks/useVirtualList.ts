/* eslint-disable no-undef */
/**
 * useVirtualList Hook
 * Lightweight virtualization for lists without external dependencies
 * Uses IntersectionObserver for efficient visibility detection
 */

import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Throttle function to limit how often a function can be called
 * Used to optimize scroll performance on older mobile devices
 */
function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): T {
  let inThrottle = false;
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

interface UseVirtualListOptions {
  /** Array of items to virtualize */
  items: unknown[];
  /** Estimated height of each item in pixels */
  itemHeight: number;
  /** Number of items to render above/below the visible area */
  overscan?: number;
  /** Container element ref */
  containerRef: React.RefObject<HTMLElement | null>;
}

interface UseVirtualListReturn<T> {
  /** Items currently visible (to render) */
  virtualItems: Array<{
    index: number;
    item: T;
    style: React.CSSProperties;
  }>;
  /** Total height of all items */
  totalHeight: number;
  /** Whether virtualization is active */
  isVirtualizing: boolean;
}

// Threshold to enable virtualization (items)
const VIRTUALIZATION_THRESHOLD = 20;

export function useVirtualList<T>({
  items,
  itemHeight,
  overscan = 5,
  containerRef,
}: UseVirtualListOptions): UseVirtualListReturn<T> {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  // Whether virtualization should be active
  const isVirtualizing = items.length > VIRTUALIZATION_THRESHOLD;

  // Total height of all items
  const totalHeight = items.length * itemHeight;

  // Update container height on resize
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      setContainerHeight(container.clientHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  // Handle scroll with throttle for better performance on older mobile devices
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isVirtualizing) return;

    // Throttle to ~60fps max (16ms) to prevent excessive re-renders on scroll
    const handleScroll = throttle(() => {
      requestAnimationFrame(() => {
        setScrollTop(container.scrollTop);
      });
    }, 16);

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [containerRef, isVirtualizing]);

  // Calculate visible items
  const virtualItems = useMemo(() => {
    // If not virtualizing, return all items
    if (!isVirtualizing) {
      return (items as T[]).map((item, index) => ({
        index,
        item,
        style: {} as React.CSSProperties,
      }));
    }

    // Calculate visible range
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

    // Generate virtual items
    const result: Array<{ index: number; item: T; style: React.CSSProperties }> = [];

    for (let i = startIndex; i <= endIndex; i++) {
      result.push({
        index: i,
        item: items[i] as T,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          transform: `translateY(${i * itemHeight}px)`,
          height: itemHeight,
        },
      });
    }

    return result;
  }, [items, itemHeight, overscan, scrollTop, containerHeight, isVirtualizing]);

  return {
    virtualItems,
    totalHeight,
    isVirtualizing,
  };
}

/**
 * VirtualizedList component for simpler usage
 * Wrap your list with this component for automatic virtualization
 */
export function useSimpleVirtual<T>(
  items: T[],
  itemHeight: number
): {
  containerRef: React.RefObject<HTMLDivElement | null>;
  virtualItems: Array<{ index: number; item: T }>;
  totalHeight: number;
  isVirtualizing: boolean;
  containerStyle: React.CSSProperties;
  innerStyle: React.CSSProperties;
} {
  const containerRef = useRef<HTMLDivElement>(null);
  const { virtualItems, totalHeight, isVirtualizing } = useVirtualList<T>({
    items,
    itemHeight,
    containerRef,
    overscan: 3,
  });

  const containerStyle: React.CSSProperties = isVirtualizing
    ? {
        overflow: 'auto',
        position: 'relative',
      }
    : {};

  const innerStyle: React.CSSProperties = isVirtualizing
    ? {
        height: totalHeight,
        position: 'relative',
      }
    : {};

  return {
    containerRef,
    virtualItems,
    totalHeight,
    isVirtualizing,
    containerStyle,
    innerStyle,
  };
}
