/* eslint-disable no-undef */
/**
 * useVirtualList Hook Tests
 * Tests for lightweight virtualization
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVirtualList, useSimpleVirtual } from '../hooks/useVirtualList';
import { createRef } from 'react';

// Mock ResizeObserver
type ResizeObserverCallbackType = (
  entries: ResizeObserverEntry[],
  observer: ResizeObserver
) => void;

class MockResizeObserver {
  callback: ResizeObserverCallbackType;

  constructor(callback: ResizeObserverCallbackType) {
    this.callback = callback;
  }

  observe(target: Element) {
    // Simulate initial size observation
    this.callback(
      [
        {
          target,
          contentRect: { height: 500 } as DOMRectReadOnly,
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        } as ResizeObserverEntry,
      ],
      this as unknown as ResizeObserver
    );
  }

  unobserve() {}
  disconnect() {}
}

// Store original
const originalResizeObserver = globalThis.ResizeObserver;
const originalRAF = globalThis.requestAnimationFrame;

describe('useVirtualList', () => {
  beforeEach(() => {
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    }) as typeof requestAnimationFrame;
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    globalThis.requestAnimationFrame = originalRAF;
  });

  describe('virtualization threshold', () => {
    it('should not virtualize when items <= 20', () => {
      const items = Array.from({ length: 15 }, (_, i) => ({ id: i }));
      const containerRef = createRef<HTMLDivElement>();

      // Create a mock container element
      const container = document.createElement('div');
      Object.defineProperty(container, 'clientHeight', { value: 500 });
      (containerRef as { current: HTMLDivElement }).current = container;

      const { result } = renderHook(() =>
        useVirtualList({
          items,
          itemHeight: 100,
          containerRef,
        })
      );

      expect(result.current.isVirtualizing).toBe(false);
      expect(result.current.virtualItems).toHaveLength(15);
      // Non-virtualized items should have empty style
      expect(result.current.virtualItems[0].style).toEqual({});
    });

    it('should virtualize when items > 20', () => {
      const items = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const containerRef = createRef<HTMLDivElement>();

      const container = document.createElement('div');
      Object.defineProperty(container, 'clientHeight', { value: 500 });
      Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });
      (containerRef as { current: HTMLDivElement }).current = container;

      const { result } = renderHook(() =>
        useVirtualList({
          items,
          itemHeight: 100,
          containerRef,
        })
      );

      expect(result.current.isVirtualizing).toBe(true);
      // Should render less than total items
      expect(result.current.virtualItems.length).toBeLessThan(50);
    });
  });

  describe('totalHeight calculation', () => {
    it('should calculate total height correctly', () => {
      const items = Array.from({ length: 30 }, (_, i) => ({ id: i }));
      const containerRef = createRef<HTMLDivElement>();

      const container = document.createElement('div');
      Object.defineProperty(container, 'clientHeight', { value: 500 });
      (containerRef as { current: HTMLDivElement }).current = container;

      const { result } = renderHook(() =>
        useVirtualList({
          items,
          itemHeight: 100,
          containerRef,
        })
      );

      expect(result.current.totalHeight).toBe(3000); // 30 items * 100px
    });
  });

  describe('virtualItems', () => {
    it('should include item index and data', () => {
      const items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const containerRef = createRef<HTMLDivElement>();

      const container = document.createElement('div');
      Object.defineProperty(container, 'clientHeight', { value: 500 });
      (containerRef as { current: HTMLDivElement }).current = container;

      const { result } = renderHook(() =>
        useVirtualList<{ id: number; name: string }>({
          items,
          itemHeight: 100,
          containerRef,
        })
      );

      expect(result.current.virtualItems[0].index).toBe(0);
      expect(result.current.virtualItems[0].item).toEqual({ id: 1, name: 'Item 1' });
      expect(result.current.virtualItems[1].index).toBe(1);
      expect(result.current.virtualItems[1].item).toEqual({ id: 2, name: 'Item 2' });
    });

    it('should include positioning styles when virtualizing', () => {
      const items = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const containerRef = createRef<HTMLDivElement>();

      const container = document.createElement('div');
      Object.defineProperty(container, 'clientHeight', { value: 500 });
      Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });
      (containerRef as { current: HTMLDivElement }).current = container;

      const { result } = renderHook(() =>
        useVirtualList({
          items,
          itemHeight: 100,
          containerRef,
        })
      );

      const firstItem = result.current.virtualItems[0];
      expect(firstItem.style.position).toBe('absolute');
      expect(firstItem.style.height).toBe(100);
      expect(firstItem.style.transform).toBeDefined();
    });
  });

  describe('overscan', () => {
    it('should use default overscan of 5', () => {
      const items = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const containerRef = createRef<HTMLDivElement>();

      const container = document.createElement('div');
      Object.defineProperty(container, 'clientHeight', { value: 300 }); // Shows 3 items
      Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });
      (containerRef as { current: HTMLDivElement }).current = container;

      const { result } = renderHook(() =>
        useVirtualList({
          items,
          itemHeight: 100,
          containerRef,
        })
      );

      // With 300px container and 100px items: visible = 3
      // With overscan of 5: should render more items
      expect(result.current.virtualItems.length).toBeGreaterThan(3);
    });

    it('should respect custom overscan value', () => {
      const items = Array.from({ length: 50 }, (_, i) => ({ id: i }));
      const containerRef = createRef<HTMLDivElement>();

      const container = document.createElement('div');
      Object.defineProperty(container, 'clientHeight', { value: 300 });
      Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });
      (containerRef as { current: HTMLDivElement }).current = container;

      const { result } = renderHook(() =>
        useVirtualList({
          items,
          itemHeight: 100,
          containerRef,
          overscan: 2,
        })
      );

      // Should render fewer items with smaller overscan
      // Starting at 0, visible 3, + 2*2 overscan = ~7 items max
      expect(result.current.virtualItems.length).toBeLessThanOrEqual(10);
    });
  });

  describe('scroll handling', () => {
    it('should handle no container gracefully', () => {
      const items = Array.from({ length: 5 }, (_, i) => ({ id: i }));
      const containerRef = createRef<HTMLDivElement>();
      // Leave containerRef.current as null

      const { result } = renderHook(() =>
        useVirtualList({
          items,
          itemHeight: 100,
          containerRef,
        })
      );

      // Should not crash and return all items (below threshold)
      expect(result.current.virtualItems).toHaveLength(5);
    });
  });
});

describe('useSimpleVirtual', () => {
  beforeEach(() => {
    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    }) as typeof requestAnimationFrame;
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    globalThis.requestAnimationFrame = originalRAF;
  });

  it('should return containerRef', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: i }));

    const { result } = renderHook(() => useSimpleVirtual(items, 100));

    expect(result.current.containerRef).toBeDefined();
    expect(result.current.containerRef.current).toBeNull(); // Not mounted yet
  });

  it('should return virtualItems', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: i }));

    const { result } = renderHook(() => useSimpleVirtual(items, 100));

    expect(result.current.virtualItems).toBeDefined();
  });

  it('should provide container and inner styles', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: i }));

    const { result } = renderHook(() => useSimpleVirtual(items, 100));

    expect(result.current.containerStyle).toBeDefined();
    expect(result.current.innerStyle).toBeDefined();
  });

  it('should return empty styles when not virtualizing', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: i })); // Below threshold

    const { result } = renderHook(() => useSimpleVirtual(items, 100));

    expect(result.current.isVirtualizing).toBe(false);
    expect(result.current.containerStyle).toEqual({});
    expect(result.current.innerStyle).toEqual({});
  });
});
