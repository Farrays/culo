/**
 * useBookingClasses Hook Tests
 * Tests for class data fetching, filtering, and retry logic
 * Note: Testing async hooks with mock data in development mode
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBookingClasses } from '../hooks/useBookingClasses';
import { INITIAL_FILTERS } from '../types/booking';

describe('useBookingClasses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading state', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      expect(result.current.loading).toBe(true);
    });

    it('should have empty classes initially', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      expect(result.current.classes).toEqual([]);
    });

    it('should have no error initially', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      expect(result.current.error).toBeNull();
    });

    it('should have zero retry count initially', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      expect(result.current.retryCount).toBe(0);
      expect(result.current.isRetrying).toBe(false);
    });
  });

  describe('return interface', () => {
    it('should return expected properties', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      // Check all expected properties exist
      expect(result.current.classes).toBeDefined();
      expect(result.current.allClasses).toBeDefined();
      expect(result.current.loading).toBeDefined();
      expect(result.current.error).toBeDefined();
      expect(result.current.refetch).toBeDefined();
      expect(result.current.filterOptions).toBeDefined();
      expect(result.current.getClassById).toBeDefined();
      expect(result.current.retryCount).toBeDefined();
      expect(result.current.isRetrying).toBeDefined();
    });

    it('should provide refetch as a function', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      expect(typeof result.current.refetch).toBe('function');
    });

    it('should provide getClassById as a function', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      expect(typeof result.current.getClassById).toBe('function');
    });

    it('should provide filter options with expected structure', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      expect(result.current.filterOptions).toHaveProperty('styles');
      expect(result.current.filterOptions).toHaveProperty('levels');
      expect(result.current.filterOptions).toHaveProperty('instructors');
      expect(result.current.filterOptions).toHaveProperty('days');
      expect(Array.isArray(result.current.filterOptions.styles)).toBe(true);
      expect(Array.isArray(result.current.filterOptions.levels)).toBe(true);
    });
  });

  describe('getClassById function', () => {
    it('should return undefined when classes are empty', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      // Before loading completes, allClasses is empty
      const found = result.current.getClassById(1);
      expect(found).toBeUndefined();
    });
  });

  describe('classes array behavior', () => {
    it('should start with empty classes array', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      expect(result.current.classes).toEqual([]);
    });

    it('should start with empty allClasses array', () => {
      const { result } = renderHook(() =>
        useBookingClasses({
          filters: INITIAL_FILTERS,
          weekOffset: 0,
        })
      );

      expect(result.current.allClasses).toEqual([]);
    });
  });
});
