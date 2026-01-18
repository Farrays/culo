/**
 * useBookingClasses Hook
 * Handles class data fetching, caching, and filtering
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ClassData, FilterState, FilterOptions } from '../types/booking';
import {
  CLASS_TEMPLATES,
  DAY_NAMES,
  TIME_BLOCK_OPTIONS,
  API_ENDPOINTS,
} from '../constants/bookingOptions';

interface UseBookingClassesOptions {
  filters: FilterState;
  weekOffset: number;
}

interface UseBookingClassesReturn {
  classes: ClassData[];
  allClasses: ClassData[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  filterOptions: FilterOptions;
  getClassById: (id: number) => ClassData | undefined;
}

// Generate mock classes for development
function generateMockClasses(): ClassData[] {
  const classes: ClassData[] = [];
  const now = new Date();

  // Generate classes for 4 weeks
  for (let week = 0; week < 4; week++) {
    CLASS_TEMPLATES.forEach((template, idx) => {
      // Find the next occurrence of this weekday
      const targetDay = template.dayOfWeek;
      const currentDay = now.getDay();
      let daysUntil = targetDay - currentDay;
      if (daysUntil < 0) daysUntil += 7;
      daysUntil += week * 7; // Add weeks offset

      const classDate = new Date(now.getTime() + daysUntil * 24 * 60 * 60 * 1000);
      const timeParts = template.time.split(':').map(Number);
      const hours = timeParts[0] ?? 0;
      const minutes = timeParts[1] ?? 0;
      classDate.setHours(hours, minutes, 0, 0);

      // Skip if the class is in the past
      if (classDate < now) return;

      classes.push({
        id: 1000 + week * 100 + idx,
        name: template.name,
        date: classDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
        time: template.time,
        dayOfWeek: DAY_NAMES[classDate.getDay()] ?? 'Lunes',
        spotsAvailable: Math.floor(Math.random() * 10) + 2,
        isFull: false,
        location: "Farray's Center",
        instructor: template.instructor,
        style: template.style,
        level: template.level,
        rawStartsAt: classDate.toISOString(),
        duration: template.duration,
        description: template.description,
      });
    });
  }

  return classes.sort(
    (a, b) => new Date(a.rawStartsAt).getTime() - new Date(b.rawStartsAt).getTime()
  );
}

// Mock classes for development
const MOCK_CLASSES = generateMockClasses();

// Filter classes by week offset
function filterByWeek(classesData: ClassData[], offset: number): ClassData[] {
  const now = new Date();

  // Get start of current week (Monday)
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + mondayOffset + offset * 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  endOfWeek.setHours(0, 0, 0, 0);

  return classesData.filter(c => {
    const classDate = new Date(c.rawStartsAt);
    // For week 0 (current week), also include classes today even if we're mid-week
    if (offset === 0) {
      return classDate >= now && classDate < endOfWeek;
    }
    return classDate >= startOfWeek && classDate < endOfWeek;
  });
}

// Apply time block filter
function applyTimeBlockFilter(classes: ClassData[], timeBlock: string): ClassData[] {
  const blockOption = TIME_BLOCK_OPTIONS.find(t => t.value === timeBlock);
  if (!blockOption?.range) return classes;

  const [start, end] = blockOption.range;
  return classes.filter(c => {
    const hour = parseInt(c.time.split(':')[0] || '0', 10);
    return hour >= start && hour < end;
  });
}

// Apply specific time filter
function applyTimeFilter(classes: ClassData[], time: string): ClassData[] {
  if (!time) return classes;
  return classes.filter(c => c.time === time);
}

// Apply all filters
function applyFilters(classes: ClassData[], filters: FilterState): ClassData[] {
  let result = classes;

  if (filters.style) {
    result = result.filter(c => c.style === filters.style);
  }

  if (filters.level) {
    result = result.filter(c => c.level === filters.level);
  }

  if (filters.day) {
    result = result.filter(c => c.dayOfWeek === filters.day);
  }

  if (filters.timeBlock) {
    result = applyTimeBlockFilter(result, filters.timeBlock);
  }

  if (filters.time) {
    result = applyTimeFilter(result, filters.time);
  }

  if (filters.instructor) {
    result = result.filter(c =>
      c.instructor.toLowerCase().includes(filters.instructor.toLowerCase())
    );
  }

  return result;
}

export function useBookingClasses({
  filters,
  weekOffset,
}: UseBookingClassesOptions): UseBookingClassesReturn {
  const [allClasses, setAllClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch classes from API (or use mock data in dev)
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (import.meta.env.DEV) {
        // Use mock data in development
        await new Promise(resolve => setTimeout(resolve, 300));
        setAllClasses(MOCK_CLASSES);
      } else {
        // Fetch 4 weeks of data for week navigation
        const daysParam = 28;
        const response = await fetch(`${API_ENDPOINTS.CLASSES}?days=${daysParam}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setAllClasses(data.data.classes || []);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error loading classes';
      setError(message);
      setAllClasses([]);
      console.error('Failed to fetch classes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Apply filters and week selection
  const classes = useMemo(() => {
    // First filter by week
    const weekClasses = filterByWeek(allClasses, weekOffset);
    // Then apply other filters
    return applyFilters(weekClasses, filters);
  }, [allClasses, filters, weekOffset]);

  // Extract available filter options from all classes
  const filterOptions = useMemo((): FilterOptions => {
    return {
      styles: [...new Set(allClasses.map(c => c.style))].sort(),
      levels: [...new Set(allClasses.map(c => c.level))].sort(),
      instructors: [...new Set(allClasses.map(c => c.instructor))].filter(Boolean).sort(),
      days: [...new Set(allClasses.map(c => c.dayOfWeek))],
    };
  }, [allClasses]);

  // Get class by ID
  const getClassById = useCallback(
    (id: number): ClassData | undefined => {
      return allClasses.find(c => c.id === id);
    },
    [allClasses]
  );

  return {
    classes,
    allClasses,
    loading,
    error,
    refetch: fetchClasses,
    filterOptions,
    getClassById,
  };
}
