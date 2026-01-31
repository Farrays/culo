/**
 * useBookingFilters Hook Tests
 * Tests for filter state management with URL synchronization
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { useBookingFilters } from '../hooks/useBookingFilters';

// Mock analytics
vi.mock('../../../utils/analytics', () => ({
  pushToDataLayer: vi.fn(),
}));

// Wrapper with router
const createWrapper = (initialEntries: string[] = ['/']) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
  );
  return Wrapper;
};

describe('useBookingFilters', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return empty filters by default', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(),
      });

      expect(result.current.filters).toEqual({
        category: '',
        style: '',
        level: '',
        day: '',
        timeBlock: '',
        instructor: '',
        time: '',
      });
      expect(result.current.hasActiveFilters).toBe(false);
      expect(result.current.activeFilterCount).toBe(0);
    });

    it('should parse filters from URL on mount', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(['/?style=salsa&level=basico']),
      });

      expect(result.current.filters.style).toBe('salsa');
      expect(result.current.filters.level).toBe('basico');
      expect(result.current.hasActiveFilters).toBe(true);
      expect(result.current.activeFilterCount).toBe(2);
    });

    it('should parse classId from URL', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(['/?classId=123']),
      });

      expect(result.current.directClassId).toBe('123');
    });

    it('should parse week offset from URL', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(['/?week=2']),
      });

      expect(result.current.weekOffset).toBe(2);
    });
  });

  describe('setFilter', () => {
    it('should update a single filter', async () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setFilter('style', 'bachata');
      });

      expect(result.current.filters.style).toBe('bachata');
    });

    it('should update filter count', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setFilter('style', 'salsa');
      });

      expect(result.current.activeFilterCount).toBe(1);
      expect(result.current.hasActiveFilters).toBe(true);
    });
  });

  describe('setFilters', () => {
    it('should update multiple filters at once', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setFilters({
          style: 'salsa',
          level: 'intermedio',
          day: 'Lunes',
        });
      });

      expect(result.current.filters.style).toBe('salsa');
      expect(result.current.filters.level).toBe('intermedio');
      expect(result.current.filters.day).toBe('Lunes');
      expect(result.current.activeFilterCount).toBe(3);
    });
  });

  describe('clearFilter', () => {
    it('should clear a single filter', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(['/?style=salsa&level=basico']),
      });

      expect(result.current.filters.style).toBe('salsa');

      act(() => {
        result.current.clearFilter('style');
      });

      expect(result.current.filters.style).toBe('');
      expect(result.current.filters.level).toBe('basico');
    });
  });

  describe('clearAllFilters', () => {
    it('should clear all filters', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(['/?style=salsa&level=basico&day=Lunes']),
      });

      expect(result.current.activeFilterCount).toBe(3);

      act(() => {
        result.current.clearAllFilters();
      });

      expect(result.current.filters).toEqual({
        category: '',
        style: '',
        level: '',
        day: '',
        timeBlock: '',
        instructor: '',
        time: '',
      });
      expect(result.current.activeFilterCount).toBe(0);
      expect(result.current.hasActiveFilters).toBe(false);
    });
  });

  describe('setWeekOffset', () => {
    it('should provide setWeekOffset function', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(),
      });

      expect(result.current.setWeekOffset).toBeDefined();
      expect(typeof result.current.setWeekOffset).toBe('function');
    });

    it('should read week offset from URL', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(['/?week=2']),
      });

      expect(result.current.weekOffset).toBe(2);
    });

    it('should use smart default when no week in URL', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(),
      });

      // Smart default: Mon-Wed = week 0, Thu-Sun = week 1
      const today = new Date();
      const dayOfWeek = today.getDay();
      const expectedDefault = dayOfWeek === 0 || dayOfWeek >= 4 ? 1 : 0;

      expect(result.current.weekOffset).toBe(expectedDefault);
    });
  });

  describe('URL synchronization', () => {
    it('should debounce URL updates', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(),
      });

      // Multiple rapid filter changes
      act(() => {
        result.current.setFilter('style', 'salsa');
        result.current.setFilter('level', 'basico');
        result.current.setFilter('day', 'Lunes');
      });

      // State updates immediately
      expect(result.current.filters.style).toBe('salsa');
      expect(result.current.filters.level).toBe('basico');
      expect(result.current.filters.day).toBe('Lunes');

      // Advance timers to trigger debounce
      act(() => {
        vi.advanceTimersByTime(350);
      });

      // Filters should still be set
      expect(result.current.activeFilterCount).toBe(3);
    });
  });

  describe('hasActiveFilters', () => {
    it('should return false when no filters set', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(),
      });

      expect(result.current.hasActiveFilters).toBe(false);
    });

    it('should return true when at least one filter is set', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(['/?instructor=Carlos']),
      });

      expect(result.current.hasActiveFilters).toBe(true);
    });
  });

  describe('activeFilterCount', () => {
    it('should count only non-empty filters', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(['/?style=salsa&level=&day=Lunes']),
      });

      // level is empty string, should not count
      expect(result.current.activeFilterCount).toBe(2);
    });
  });

  describe('directClassId', () => {
    it('should be null when no classId in URL', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(),
      });

      expect(result.current.directClassId).toBeNull();
    });

    it('should return classId from URL', () => {
      const { result } = renderHook(() => useBookingFilters(), {
        wrapper: createWrapper(['/?classId=abc123']),
      });

      expect(result.current.directClassId).toBe('abc123');
    });
  });
});
