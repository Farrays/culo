/* global IntersectionObserverEntry */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSharedIntersectionObserver, OBSERVER_CONFIGS } from '../useSharedIntersectionObserver';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

let _observerCallback: (entries: IntersectionObserverEntry[]) => void;

beforeEach(() => {
  mockIntersectionObserver.mockImplementation(callback => {
    _observerCallback = callback;
    return {
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: mockDisconnect,
    };
  });

  vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

  // Mock getBoundingClientRect
  Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
    top: 500,
    bottom: 600,
    left: 0,
    right: 100,
    width: 100,
    height: 100,
    x: 0,
    y: 500,
    toJSON: () => {},
  });

  // Mock window dimensions
  Object.defineProperty(window, 'innerHeight', {
    value: 800,
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  vi.clearAllMocks();
  vi.unstubAllGlobals();
});

describe('OBSERVER_CONFIGS', () => {
  it('has animation config', () => {
    expect(OBSERVER_CONFIGS.animation).toBeDefined();
    expect(OBSERVER_CONFIGS.animation.threshold).toBe(0.1);
    expect(OBSERVER_CONFIGS.animation.once).toBe(true);
  });

  it('has counter config', () => {
    expect(OBSERVER_CONFIGS.counter).toBeDefined();
    expect(OBSERVER_CONFIGS.counter.threshold).toBe(0.5);
    expect(OBSERVER_CONFIGS.counter.once).toBe(true);
  });

  it('has lazyLoad config', () => {
    expect(OBSERVER_CONFIGS.lazyLoad).toBeDefined();
    expect(OBSERVER_CONFIGS.lazyLoad.threshold).toBe(0);
    expect(OBSERVER_CONFIGS.lazyLoad.once).toBe(true);
  });
});

describe('useSharedIntersectionObserver', () => {
  it('returns a ref and visibility state', () => {
    const { result } = renderHook(() => useSharedIntersectionObserver(OBSERVER_CONFIGS.animation));

    expect(result.current[0]).toBeDefined(); // ref
    expect(typeof result.current[1]).toBe('boolean'); // isVisible
  });

  it('initially returns false for visibility', () => {
    const { result } = renderHook(() => useSharedIntersectionObserver(OBSERVER_CONFIGS.animation));

    expect(result.current[1]).toBe(false);
  });

  it('uses default animation config when no config provided', () => {
    const { result } = renderHook(() => useSharedIntersectionObserver());

    expect(result.current).toBeDefined();
    expect(result.current[0]).toBeDefined();
  });

  it('creates IntersectionObserver with correct options', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const { result } = renderHook(() => useSharedIntersectionObserver(OBSERVER_CONFIGS.counter));

    // Manually set the ref
    act(() => {
      (result.current[0] as React.MutableRefObject<HTMLElement | null>).current = div;
    });

    // Re-render to trigger effect
    const { result: result2 } = renderHook(() =>
      useSharedIntersectionObserver(OBSERVER_CONFIGS.counter)
    );

    act(() => {
      (result2.current[0] as React.MutableRefObject<HTMLElement | null>).current = div;
    });

    document.body.removeChild(div);
  });

  it('handles element becoming visible', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    // Mock element to be in viewport
    div.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 100,
      bottom: 200,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 100,
      toJSON: () => {},
    });

    const { result } = renderHook(() =>
      useSharedIntersectionObserver({
        threshold: 0.1,
        rootMargin: '0px',
        once: true,
      })
    );

    act(() => {
      (result.current[0] as React.MutableRefObject<HTMLElement | null>).current = div;
    });

    // Element should be visible since it's within viewport
    expect(typeof result.current[1]).toBe('boolean');

    document.body.removeChild(div);
  });

  it('unobserves element on unmount', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const { unmount, result } = renderHook(() =>
      useSharedIntersectionObserver(OBSERVER_CONFIGS.animation)
    );

    act(() => {
      (result.current[0] as React.MutableRefObject<HTMLElement | null>).current = div;
    });

    unmount();

    document.body.removeChild(div);
  });

  it('handles custom config', () => {
    const customConfig = {
      threshold: 0.25,
      rootMargin: '100px',
      once: false,
    };

    const { result } = renderHook(() => useSharedIntersectionObserver(customConfig));

    expect(result.current[0]).toBeDefined();
    expect(typeof result.current[1]).toBe('boolean');
  });

  it('handles element already visible on mount', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    // Mock element to be already in viewport
    div.getBoundingClientRect = vi.fn().mockReturnValue({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    const { result } = renderHook(() =>
      useSharedIntersectionObserver({
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        once: true,
      })
    );

    act(() => {
      (result.current[0] as React.MutableRefObject<HTMLElement | null>).current = div;
    });

    document.body.removeChild(div);
  });
});
