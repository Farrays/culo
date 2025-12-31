import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useHLSVideo } from '../useHLSVideo';

// Store original values
const originalMatchMedia = window.matchMedia;
const originalIntersectionObserver = globalThis.IntersectionObserver;

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  constructor() {}
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
  takeRecords = () => [];
}

// Mock matchMedia with working implementation
const createMockMatchMedia = (matches = false) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches: matches && query === '(prefers-reduced-motion: reduce)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('useHLSVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    globalThis.IntersectionObserver =
      MockIntersectionObserver as unknown as typeof IntersectionObserver;
    window.matchMedia = createMockMatchMedia(false);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('returns videoRef and containerRef', () => {
    const { result } = renderHook(() => useHLSVideo({ hlsUrl: 'https://example.com/video.m3u8' }));

    expect(result.current.videoRef).toBeDefined();
    expect(result.current.containerRef).toBeDefined();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useHLSVideo({ hlsUrl: 'https://example.com/video.m3u8' }));

    expect(result.current.isVideoReady).toBe(false);
    expect(result.current.isVideoPlaying).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('respects reduced motion preference when enabled', () => {
    // Set up reduced motion mock BEFORE rendering
    window.matchMedia = createMockMatchMedia(true);

    const { result } = renderHook(() =>
      useHLSVideo({
        hlsUrl: 'https://example.com/video.m3u8',
        respectReducedMotion: true,
      })
    );

    expect(result.current.shouldShowVideo).toBe(false);
  });

  it('shows video when respectReducedMotion is false', () => {
    window.matchMedia = createMockMatchMedia(true);

    const { result } = renderHook(() =>
      useHLSVideo({
        hlsUrl: 'https://example.com/video.m3u8',
        respectReducedMotion: false,
      })
    );

    expect(result.current.shouldShowVideo).toBe(true);
  });

  it('respects data saver mode', () => {
    // Mock navigator.connection with saveData
    const originalConnection = (navigator as unknown as { connection?: unknown }).connection;
    Object.defineProperty(navigator, 'connection', {
      value: { saveData: true },
      configurable: true,
      writable: true,
    });

    const { result } = renderHook(() =>
      useHLSVideo({
        hlsUrl: 'https://example.com/video.m3u8',
        respectDataSaver: true,
      })
    );

    expect(result.current.shouldShowVideo).toBe(false);

    // Cleanup
    Object.defineProperty(navigator, 'connection', {
      value: originalConnection,
      configurable: true,
      writable: true,
    });
  });

  it('shows video when data saver is not active', () => {
    const originalConnection = (navigator as unknown as { connection?: unknown }).connection;
    Object.defineProperty(navigator, 'connection', {
      value: { saveData: false },
      configurable: true,
      writable: true,
    });

    const { result } = renderHook(() =>
      useHLSVideo({
        hlsUrl: 'https://example.com/video.m3u8',
        respectDataSaver: true,
      })
    );

    expect(result.current.shouldShowVideo).toBe(true);

    Object.defineProperty(navigator, 'connection', {
      value: originalConnection,
      configurable: true,
      writable: true,
    });
  });

  it('cleans up on unmount without errors', () => {
    const { unmount } = renderHook(() => useHLSVideo({ hlsUrl: 'https://example.com/video.m3u8' }));

    // Should unmount without throwing errors
    expect(() => unmount()).not.toThrow();
  });

  it('accepts custom loadDelay option', () => {
    const { result } = renderHook(() =>
      useHLSVideo({
        hlsUrl: 'https://example.com/video.m3u8',
        loadDelay: 500,
      })
    );

    // Hook should initialize without error
    expect(result.current.isVideoReady).toBe(false);
  });

  it('returns shouldShowVideo true when no restrictions', () => {
    const { result } = renderHook(() =>
      useHLSVideo({
        hlsUrl: 'https://example.com/video.m3u8',
        respectReducedMotion: false,
        respectDataSaver: false,
      })
    );

    expect(result.current.shouldShowVideo).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('uses default options when not specified', () => {
    const { result } = renderHook(() => useHLSVideo({ hlsUrl: 'https://example.com/video.m3u8' }));

    // Should use default loadDelay of 150ms and respect user preferences
    expect(result.current.videoRef).toBeDefined();
    expect(result.current.containerRef).toBeDefined();
  });
});
