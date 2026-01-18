/**
 * useBookingState Hook Tests
 * Tests for centralized state management using useReducer
 */

import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBookingState } from '../hooks/useBookingState';
import type { ClassData, BookingFormData } from '../types/booking';
import { INITIAL_FORM_DATA } from '../types/booking';

// Mock class data for testing
const mockClass: ClassData = {
  id: 1,
  name: 'Salsa Nivel Básico',
  date: '2025-01-20',
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
  description: 'Clase de salsa para principiantes',
};

const mockHeelsClass: ClassData = {
  ...mockClass,
  id: 2,
  name: 'Heels Dance',
  style: 'heels',
};

describe('useBookingState', () => {
  describe('initial state', () => {
    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useBookingState());

      expect(result.current.step).toBe('class');
      expect(result.current.status).toBe('idle');
      expect(result.current.selectedClass).toBeNull();
      expect(result.current.formData).toEqual(INITIAL_FORM_DATA);
      expect(result.current.errorMessage).toBe('');
      expect(result.current.weekOffset).toBe(0);
      expect(result.current.invalidFields).toEqual([]);
      expect(result.current.requiresHeelsConsent).toBe(false);
    });

    it('should accept initial week offset', () => {
      const { result } = renderHook(() => useBookingState(2));

      expect(result.current.weekOffset).toBe(2);
    });
  });

  describe('selectClass', () => {
    it('should select a class and move to form step', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.selectClass(mockClass);
      });

      expect(result.current.selectedClass).toEqual(mockClass);
      expect(result.current.step).toBe('form');
      expect(result.current.errorMessage).toBe('');
    });

    it('should clear invalid fields when selecting class', () => {
      const { result } = renderHook(() => useBookingState());

      // First set some invalid fields
      act(() => {
        result.current.setInvalidFields(['firstName', 'email']);
      });

      expect(result.current.invalidFields).toHaveLength(2);

      // Select class should clear them
      act(() => {
        result.current.selectClass(mockClass);
      });

      expect(result.current.invalidFields).toEqual([]);
    });
  });

  describe('goBack', () => {
    it('should clear class and return to class step', () => {
      const { result } = renderHook(() => useBookingState());

      // First select a class
      act(() => {
        result.current.selectClass(mockClass);
      });

      expect(result.current.step).toBe('form');

      // Then go back
      act(() => {
        result.current.goBack();
      });

      expect(result.current.selectedClass).toBeNull();
      expect(result.current.step).toBe('class');
      expect(result.current.invalidFields).toEqual([]);
    });
  });

  describe('setStep', () => {
    it('should update step directly', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.setStep('form');
      });

      expect(result.current.step).toBe('form');
    });
  });

  describe('setStatus', () => {
    it('should update status', () => {
      const { result } = renderHook(() => useBookingState());

      const statuses: Array<'idle' | 'loading' | 'success' | 'error'> = [
        'loading',
        'success',
        'error',
        'idle',
      ];

      statuses.forEach(status => {
        act(() => {
          result.current.setStatus(status);
        });
        expect(result.current.status).toBe(status);
      });
    });
  });

  describe('updateForm', () => {
    it('should update form data partially', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.updateForm({ firstName: 'Juan' });
      });

      expect(result.current.formData.firstName).toBe('Juan');
      expect(result.current.formData.lastName).toBe(''); // Unchanged
    });

    it('should clear error message on form update', () => {
      const { result } = renderHook(() => useBookingState());

      // Set an error first
      act(() => {
        result.current.setError('Some error');
      });

      expect(result.current.errorMessage).toBe('Some error');

      // Update form should clear it
      act(() => {
        result.current.updateForm({ firstName: 'Juan' });
      });

      expect(result.current.errorMessage).toBe('');
    });

    it('should clear invalid fields for updated fields only', () => {
      const { result } = renderHook(() => useBookingState());

      // Set invalid fields
      act(() => {
        result.current.setInvalidFields(['firstName', 'lastName', 'email']);
      });

      // Update firstName
      act(() => {
        result.current.updateForm({ firstName: 'Juan' });
      });

      // firstName should be cleared, others remain
      expect(result.current.invalidFields).toEqual(['lastName', 'email']);
    });

    it('should update multiple fields at once', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.updateForm({
          firstName: 'Juan',
          lastName: 'García',
          email: 'juan@example.com',
        });
      });

      expect(result.current.formData.firstName).toBe('Juan');
      expect(result.current.formData.lastName).toBe('García');
      expect(result.current.formData.email).toBe('juan@example.com');
    });

    it('should update boolean consent fields', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.updateForm({
          acceptsTerms: true,
          acceptsMarketing: true,
        });
      });

      expect(result.current.formData.acceptsTerms).toBe(true);
      expect(result.current.formData.acceptsMarketing).toBe(true);
    });
  });

  describe('setError and clearError', () => {
    it('should set error message', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.setError('Booking failed');
      });

      expect(result.current.errorMessage).toBe('Booking failed');
    });

    it('should clear error message', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.setError('Booking failed');
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.errorMessage).toBe('');
    });
  });

  describe('setWeek', () => {
    it('should update week offset', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.setWeek(3);
      });

      expect(result.current.weekOffset).toBe(3);
    });
  });

  describe('setInvalidFields and clearInvalidFields', () => {
    it('should set invalid fields', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.setInvalidFields(['firstName', 'email']);
      });

      expect(result.current.invalidFields).toEqual(['firstName', 'email']);
    });

    it('should clear all invalid fields', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.setInvalidFields(['firstName', 'email', 'phone']);
      });

      act(() => {
        result.current.clearInvalidFields();
      });

      expect(result.current.invalidFields).toEqual([]);
    });
  });

  describe('restoreForm', () => {
    it('should restore form data and selected class', () => {
      const { result } = renderHook(() => useBookingState());

      const savedFormData: BookingFormData = {
        ...INITIAL_FORM_DATA,
        firstName: 'Juan',
        lastName: 'García',
        email: 'juan@example.com',
        phone: '+34612345678',
      };

      act(() => {
        result.current.restoreForm(savedFormData, mockClass);
      });

      expect(result.current.formData).toEqual(savedFormData);
      expect(result.current.selectedClass).toEqual(mockClass);
      expect(result.current.step).toBe('form');
    });

    it('should stay on class step if no class selected', () => {
      const { result } = renderHook(() => useBookingState());

      const savedFormData: BookingFormData = {
        ...INITIAL_FORM_DATA,
        firstName: 'Juan',
      };

      act(() => {
        result.current.restoreForm(savedFormData, null);
      });

      expect(result.current.formData).toEqual(savedFormData);
      expect(result.current.selectedClass).toBeNull();
      expect(result.current.step).toBe('class');
    });
  });

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useBookingState(2));

      // Modify state
      act(() => {
        result.current.selectClass(mockClass);
        result.current.updateForm({ firstName: 'Juan' });
        result.current.setStatus('loading');
        result.current.setError('Error');
        result.current.setInvalidFields(['email']);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.step).toBe('class');
      expect(result.current.status).toBe('idle');
      expect(result.current.selectedClass).toBeNull();
      expect(result.current.formData).toEqual(INITIAL_FORM_DATA);
      expect(result.current.errorMessage).toBe('');
      expect(result.current.weekOffset).toBe(0); // Reset to 0, not initial
      expect(result.current.invalidFields).toEqual([]);
    });
  });

  describe('requiresHeelsConsent', () => {
    it('should be false when no class selected', () => {
      const { result } = renderHook(() => useBookingState());

      expect(result.current.requiresHeelsConsent).toBe(false);
    });

    it('should be false for non-heels class', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.selectClass(mockClass);
      });

      expect(result.current.requiresHeelsConsent).toBe(false);
    });

    it('should be true for heels class', () => {
      const { result } = renderHook(() => useBookingState());

      act(() => {
        result.current.selectClass(mockHeelsClass);
      });

      expect(result.current.requiresHeelsConsent).toBe(true);
    });

    it('should be true for girly class', () => {
      const { result } = renderHook(() => useBookingState());

      const girlyClass = {
        ...mockClass,
        style: 'girly-style',
      };

      act(() => {
        result.current.selectClass(girlyClass);
      });

      expect(result.current.requiresHeelsConsent).toBe(true);
    });
  });

  describe('action stability', () => {
    it('should have stable action references across renders', () => {
      const { result, rerender } = renderHook(() => useBookingState());

      const firstRender = {
        selectClass: result.current.selectClass,
        goBack: result.current.goBack,
        setStep: result.current.setStep,
        updateForm: result.current.updateForm,
        reset: result.current.reset,
      };

      rerender();

      // Actions should be the same reference (useCallback)
      expect(result.current.selectClass).toBe(firstRender.selectClass);
      expect(result.current.goBack).toBe(firstRender.goBack);
      expect(result.current.setStep).toBe(firstRender.setStep);
      expect(result.current.updateForm).toBe(firstRender.updateForm);
      expect(result.current.reset).toBe(firstRender.reset);
    });
  });
});
