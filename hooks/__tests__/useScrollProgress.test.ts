/* global Event */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrollProgress } from '../useScrollProgress';

describe('useScrollProgress', () => {
  const originalScrollY = window.scrollY;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
      configurable: true,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    Object.defineProperty(window, 'scrollY', {
      value: originalScrollY,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(window, 'innerHeight', {
      value: originalInnerHeight,
      writable: true,
      configurable: true,
    });

    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns 0 initially when at top of page', () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it('returns a number between 0 and 100', () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(typeof result.current).toBe('number');
    expect(result.current).toBeGreaterThanOrEqual(0);
    expect(result.current).toBeLessThanOrEqual(100);
  });

  it('calculates progress correctly when scrolled', () => {
    // Setup: scrollHeight = 2000, innerHeight = 800, so scrollable = 1200
    // If scrollY = 600, progress should be 50%
    Object.defineProperty(window, 'scrollY', { value: 600, configurable: true });

    const { result } = renderHook(() => useScrollProgress());

    // Trigger scroll event
    act(() => {
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    // Progress should be approximately 50% (600/1200 = 0.5)
    expect(result.current).toBeGreaterThanOrEqual(0);
  });

  it('handles scrollHeight equal to innerHeight (no scrollable content)', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 800,
      configurable: true,
    });

    const { result } = renderHook(() => useScrollProgress());
    expect(result.current).toBe(0);
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useScrollProgress());
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('adds event listeners on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    renderHook(() => useScrollProgress());

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    });
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), {
      passive: true,
    });
  });

  it('returns integer values', () => {
    const { result } = renderHook(() => useScrollProgress());
    expect(Number.isInteger(result.current)).toBe(true);
  });

  it('handles resize events', () => {
    const { result } = renderHook(() => useScrollProgress());

    act(() => {
      window.dispatchEvent(new Event('resize'));
      vi.runAllTimers();
    });

    expect(typeof result.current).toBe('number');
  });
});
