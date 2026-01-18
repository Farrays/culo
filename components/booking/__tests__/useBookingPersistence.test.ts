/**
 * useBookingPersistence Hook Tests
 * Tests for localStorage persistence, unsaved changes, and haptic feedback
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookingPersistence } from '../hooks/useBookingPersistence';
import type { BookingFormData, ClassData } from '../types/booking';
import { INITIAL_FORM_DATA } from '../types/booking';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get _store() {
      return store;
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock navigator.vibrate
const mockVibrate = vi.fn();
Object.defineProperty(navigator, 'vibrate', { value: mockVibrate, writable: true });

// Mock class
const mockClass: ClassData = {
  id: 1,
  name: 'Salsa Nivel Básico',
  date: '20/01/2025',
  time: '19:00',
  dayOfWeek: 'Lunes',
  spotsAvailable: 10,
  isFull: false,
  location: "Farray's Center",
  instructor: 'Carlos',
  style: 'salsa',
  level: 'basico',
  rawStartsAt: '2025-01-20T19:00:00',
  duration: 60,
  description: 'Clase de salsa',
};

// Mock translation function
const mockT = (key: string) => key;

describe('useBookingPersistence', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('loadPersistedData', () => {
    it('should return null when no data persisted', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const data = result.current.loadPersistedData();
      expect(data).toBeNull();
    });

    it('should return persisted form data', () => {
      const savedData: BookingFormData = {
        ...INITIAL_FORM_DATA,
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
      };

      mockLocalStorage.setItem('booking_form_data', JSON.stringify(savedData));
      mockLocalStorage.setItem('booking_expiry', String(Date.now() + 30 * 60 * 1000));

      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const data = result.current.loadPersistedData();
      expect(data).not.toBeNull();
      expect(data?.formData.firstName).toBe('Juan');
      expect(data?.formData.lastName).toBe('García');
    });

    it('should return persisted class data', () => {
      mockLocalStorage.setItem('booking_form_data', JSON.stringify(INITIAL_FORM_DATA));
      mockLocalStorage.setItem('booking_selected_class', JSON.stringify(mockClass));
      mockLocalStorage.setItem('booking_expiry', String(Date.now() + 30 * 60 * 1000));

      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const data = result.current.loadPersistedData();
      expect(data?.selectedClass).not.toBeNull();
      expect(data?.selectedClass?.name).toBe('Salsa Nivel Básico');
    });

    it('should return null for expired data', () => {
      mockLocalStorage.setItem('booking_form_data', JSON.stringify({ firstName: 'Juan' }));
      mockLocalStorage.setItem('booking_expiry', String(Date.now() - 1000)); // Expired

      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const data = result.current.loadPersistedData();
      expect(data).toBeNull();
      // Should have cleared the expired data
      expect(mockLocalStorage.removeItem).toHaveBeenCalled();
    });

    it('should handle JSON parse errors gracefully', () => {
      mockLocalStorage.setItem('booking_form_data', 'invalid json');
      mockLocalStorage.setItem('booking_expiry', String(Date.now() + 30 * 60 * 1000));

      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const data = result.current.loadPersistedData();
      expect(data).toBeNull();
    });
  });

  describe('persistData', () => {
    it('should save form data to localStorage', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const formData = { ...INITIAL_FORM_DATA, firstName: 'Juan' };

      act(() => {
        result.current.persistData(formData, null);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'booking_form_data',
        expect.stringContaining('Juan')
      );
    });

    it('should save class data when provided', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const formData = { ...INITIAL_FORM_DATA, firstName: 'Juan' };

      act(() => {
        result.current.persistData(formData, mockClass);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'booking_selected_class',
        expect.stringContaining('Salsa')
      );
    });

    it('should not save empty form data', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      act(() => {
        result.current.persistData(INITIAL_FORM_DATA, null);
      });

      // Should not have been called with form data (only expiry calls are OK)
      const calls = mockLocalStorage.setItem.mock.calls;
      const formDataCalls = calls.filter((call: string[]) => call[0] === 'booking_form_data');
      expect(formDataCalls.length).toBe(0);
    });

    it('should set expiry 30 minutes in the future', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const now = Date.now();
      const formData = { ...INITIAL_FORM_DATA, firstName: 'Juan' };

      act(() => {
        result.current.persistData(formData, null);
      });

      const expiryCalls = mockLocalStorage.setItem.mock.calls.filter(
        (call: string[]) => call[0] === 'booking_expiry'
      );
      expect(expiryCalls.length).toBeGreaterThan(0);

      const expiryTime = parseInt(expiryCalls[0][1], 10);
      expect(expiryTime).toBeGreaterThanOrEqual(now + 29 * 60 * 1000);
      expect(expiryTime).toBeLessThanOrEqual(now + 31 * 60 * 1000);
    });
  });

  describe('clearPersistedData', () => {
    it('should remove all booking data from localStorage', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      act(() => {
        result.current.clearPersistedData();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('booking_form_data');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('booking_selected_class');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('booking_expiry');
    });
  });

  describe('hasUnsavedChanges', () => {
    it('should return false for empty form', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      expect(result.current.hasUnsavedChanges(INITIAL_FORM_DATA)).toBe(false);
    });

    it('should return true when firstName is filled', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const formData = { ...INITIAL_FORM_DATA, firstName: 'Juan' };
      expect(result.current.hasUnsavedChanges(formData)).toBe(true);
    });

    it('should return true when lastName is filled', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const formData = { ...INITIAL_FORM_DATA, lastName: 'García' };
      expect(result.current.hasUnsavedChanges(formData)).toBe(true);
    });

    it('should return true when email is filled', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const formData = { ...INITIAL_FORM_DATA, email: 'test@example.com' };
      expect(result.current.hasUnsavedChanges(formData)).toBe(true);
    });

    it('should return true when phone is filled', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const formData = { ...INITIAL_FORM_DATA, phone: '+34612345678' };
      expect(result.current.hasUnsavedChanges(formData)).toBe(true);
    });

    it('should return false for whitespace-only fields', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      const formData = {
        ...INITIAL_FORM_DATA,
        firstName: '   ',
        lastName: '   ',
      };
      expect(result.current.hasUnsavedChanges(formData)).toBe(false);
    });
  });

  describe('triggerHaptic', () => {
    it('should trigger light haptic feedback by default', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      act(() => {
        result.current.triggerHaptic();
      });

      expect(mockVibrate).toHaveBeenCalledWith(10);
    });

    it('should trigger medium haptic feedback', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      act(() => {
        result.current.triggerHaptic('medium');
      });

      expect(mockVibrate).toHaveBeenCalledWith(25);
    });

    it('should trigger heavy haptic feedback', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      act(() => {
        result.current.triggerHaptic('heavy');
      });

      expect(mockVibrate).toHaveBeenCalledWith(50);
    });

    it('should trigger error haptic pattern', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      act(() => {
        result.current.triggerHaptic('error');
      });

      expect(mockVibrate).toHaveBeenCalledWith([50, 30, 50, 30, 50]);
    });

    it('should trigger success haptic pattern', () => {
      const { result } = renderHook(() =>
        useBookingPersistence(INITIAL_FORM_DATA, null, 'idle', mockT)
      );

      act(() => {
        result.current.triggerHaptic('success');
      });

      expect(mockVibrate).toHaveBeenCalledWith([30, 50, 100]);
    });
  });

  describe('auto-save behavior', () => {
    it('should auto-save form data after debounce delay', async () => {
      const formData = { ...INITIAL_FORM_DATA, firstName: 'Juan' };

      renderHook(() => useBookingPersistence(formData, null, 'idle', mockT));

      // Advance timers past debounce delay (500ms)
      act(() => {
        vi.advanceTimersByTime(600);
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'booking_form_data',
        expect.stringContaining('Juan')
      );
    });

    it('should not auto-save during loading status', async () => {
      const formData = { ...INITIAL_FORM_DATA, firstName: 'Juan' };

      renderHook(() => useBookingPersistence(formData, null, 'loading', mockT));

      act(() => {
        vi.advanceTimersByTime(600);
      });

      // Should not have saved form data
      const calls = mockLocalStorage.setItem.mock.calls.filter(
        (call: string[]) => call[0] === 'booking_form_data'
      );
      expect(calls.length).toBe(0);
    });

    it('should not auto-save after success status', async () => {
      const formData = { ...INITIAL_FORM_DATA, firstName: 'Juan' };

      renderHook(() => useBookingPersistence(formData, null, 'success', mockT));

      act(() => {
        vi.advanceTimersByTime(600);
      });

      // Should not have saved form data
      const calls = mockLocalStorage.setItem.mock.calls.filter(
        (call: string[]) => call[0] === 'booking_form_data'
      );
      expect(calls.length).toBe(0);
    });
  });

  describe('clear on success', () => {
    it('should clear persisted data when status becomes success', () => {
      const formData = { ...INITIAL_FORM_DATA, firstName: 'Juan' };
      const { rerender } = renderHook(
        ({ status }) => useBookingPersistence(formData, null, status, mockT),
        { initialProps: { status: 'idle' as const } }
      );

      // Change to success
      rerender({ status: 'success' as const });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('booking_form_data');
    });
  });
});
