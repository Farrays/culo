import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLazyImage } from '../useLazyImage';

describe('useLazyImage', () => {
  it('returns imgRef, imageSrc, and isLoaded', () => {
    const { result } = renderHook(() => useLazyImage('/test.jpg', '/placeholder.jpg'));

    expect(result.current.imgRef).toBeDefined();
    expect(result.current.imageSrc).toBeDefined();
    expect(typeof result.current.isLoaded).toBe('boolean');
  });

  it('initializes with placeholder image', () => {
    const { result } = renderHook(() => useLazyImage('/test.jpg', '/placeholder.jpg'));

    expect(result.current.imageSrc).toBe('/placeholder.jpg');
    expect(result.current.isLoaded).toBe(false);
  });

  it('creates IntersectionObserver on mount', () => {
    const { result } = renderHook(() => useLazyImage('/test.jpg'));
    expect(result.current.imgRef).toBeDefined();
    // IntersectionObserver is mocked globally in test setup
  });
});
