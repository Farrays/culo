/**
 * useBookingState Hook
 * Centralized state management using useReducer
 */

import { useReducer, useCallback, useMemo } from 'react';
import type {
  BookingState,
  BookingAction,
  ClassData,
  BookingFormData,
  Step,
  Status,
} from '../types/booking';
import { INITIAL_FORM_DATA, requiresHeelsConsent } from '../types/booking';

// Initial state
const initialState: BookingState = {
  step: 'class',
  status: 'idle',
  selectedClass: null,
  formData: INITIAL_FORM_DATA,
  errorMessage: '',
  weekOffset: 0,
};

// Reducer function
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };

    case 'SELECT_CLASS':
      return {
        ...state,
        selectedClass: action.payload,
        step: 'form',
        errorMessage: '',
      };

    case 'CLEAR_CLASS':
      return {
        ...state,
        selectedClass: null,
        step: 'class',
        errorMessage: '',
      };

    case 'SET_STATUS':
      return { ...state, status: action.payload };

    case 'UPDATE_FORM':
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        errorMessage: '', // Clear error on form change
      };

    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, errorMessage: '' };

    case 'SET_WEEK':
      return { ...state, weekOffset: action.payload };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export interface UseBookingStateReturn {
  // State
  step: Step;
  status: Status;
  selectedClass: ClassData | null;
  formData: BookingFormData;
  errorMessage: string;
  weekOffset: number;
  requiresHeelsConsent: boolean;

  // Actions
  selectClass: (classData: ClassData) => void;
  goBack: () => void;
  setStep: (step: Step) => void;
  setStatus: (status: Status) => void;
  updateForm: (data: Partial<BookingFormData>) => void;
  setError: (message: string) => void;
  clearError: () => void;
  setWeek: (week: number) => void;
  reset: () => void;
}

export function useBookingState(initialWeekOffset = 0): UseBookingStateReturn {
  const [state, dispatch] = useReducer(bookingReducer, {
    ...initialState,
    weekOffset: initialWeekOffset,
  });

  // Memoized action creators
  const selectClass = useCallback((classData: ClassData) => {
    dispatch({ type: 'SELECT_CLASS', payload: classData });
  }, []);

  const goBack = useCallback(() => {
    dispatch({ type: 'CLEAR_CLASS' });
  }, []);

  const setStep = useCallback((step: Step) => {
    dispatch({ type: 'SET_STEP', payload: step });
  }, []);

  const setStatus = useCallback((status: Status) => {
    dispatch({ type: 'SET_STATUS', payload: status });
  }, []);

  const updateForm = useCallback((data: Partial<BookingFormData>) => {
    dispatch({ type: 'UPDATE_FORM', payload: data });
  }, []);

  const setError = useCallback((message: string) => {
    dispatch({ type: 'SET_ERROR', payload: message });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const setWeek = useCallback((week: number) => {
    dispatch({ type: 'SET_WEEK', payload: week });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Check if heels consent is required
  const heelsConsentRequired = useMemo(
    () => requiresHeelsConsent(state.selectedClass),
    [state.selectedClass]
  );

  return {
    // State
    step: state.step,
    status: state.status,
    selectedClass: state.selectedClass,
    formData: state.formData,
    errorMessage: state.errorMessage,
    weekOffset: state.weekOffset,
    requiresHeelsConsent: heelsConsentRequired,

    // Actions
    selectClass,
    goBack,
    setStep,
    setStatus,
    updateForm,
    setError,
    clearError,
    setWeek,
    reset,
  };
}
