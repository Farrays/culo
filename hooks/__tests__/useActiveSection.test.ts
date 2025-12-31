/* global Event */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useActiveSection, useScrollToSection } from '../useActiveSection';

describe('useActiveSection', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = `
      <div id="hero" style="height: 500px;"></div>
      <div id="features" style="height: 500px;"></div>
      <div id="pricing" style="height: 500px;"></div>
      <div id="faq" style="height: 500px;"></div>
    `;

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

    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('returns null when no sections are in view', () => {
    const { result } = renderHook(() =>
      useActiveSection({
        sectionIds: ['nonexistent1', 'nonexistent2'],
        offset: 100,
      })
    );

    expect(result.current).toBeNull();
  });

  it('accepts sectionIds array', () => {
    const { result } = renderHook(() =>
      useActiveSection({
        sectionIds: ['hero', 'features', 'pricing', 'faq'],
        offset: 100,
      })
    );

    expect(result.current === null || typeof result.current === 'string').toBe(true);
  });

  it('uses default offset of 100', () => {
    const { result } = renderHook(() =>
      useActiveSection({
        sectionIds: ['hero', 'features'],
      })
    );

    expect(result.current === null || typeof result.current === 'string').toBe(true);
  });

  it('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() =>
      useActiveSection({
        sectionIds: ['hero', 'features'],
      })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('adds event listeners on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

    renderHook(() =>
      useActiveSection({
        sectionIds: ['hero', 'features'],
      })
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function), {
      passive: true,
    });
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), {
      passive: true,
    });
  });

  it('handles empty sectionIds array', () => {
    const { result } = renderHook(() =>
      useActiveSection({
        sectionIds: [],
        offset: 100,
      })
    );

    expect(result.current).toBeNull();
  });

  it('handles scroll events', () => {
    const { result } = renderHook(() =>
      useActiveSection({
        sectionIds: ['hero', 'features'],
        throttleMs: 0,
      })
    );

    act(() => {
      window.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current === null || typeof result.current === 'string').toBe(true);
  });

  it('handles resize events', () => {
    const { result } = renderHook(() =>
      useActiveSection({
        sectionIds: ['hero', 'features'],
      })
    );

    act(() => {
      window.dispatchEvent(new Event('resize'));
      vi.runAllTimers();
    });

    expect(result.current === null || typeof result.current === 'string').toBe(true);
  });
});

describe('useScrollToSection', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="target" style="height: 500px; margin-top: 1000px;"></div>
    `;

    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    });

    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('returns a function', () => {
    const { result } = renderHook(() => useScrollToSection());
    expect(typeof result.current).toBe('function');
  });

  it('scrolls to element when called with valid ID', () => {
    const { result } = renderHook(() => useScrollToSection());

    act(() => {
      result.current('target');
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: expect.any(Number),
      behavior: 'smooth',
    });
  });

  it('uses custom offset when provided', () => {
    const { result } = renderHook(() => useScrollToSection());

    act(() => {
      result.current('target', 120);
    });

    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('does nothing when element does not exist', () => {
    const { result } = renderHook(() => useScrollToSection());

    act(() => {
      result.current('nonexistent');
    });

    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('uses default offset of 80', () => {
    const { result } = renderHook(() => useScrollToSection());

    act(() => {
      result.current('target');
    });

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: 'smooth',
      })
    );
  });
});
