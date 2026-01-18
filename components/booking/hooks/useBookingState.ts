/**
 * useBookingState Hook
 *
 * Centralized state management for the booking widget using useReducer pattern.
 * Handles the complete booking flow: class selection → form → submission.
 *
 * @module useBookingState
 *
 * @example
 * ```tsx
 * const {
 *   step,
 *   selectedClass,
 *   formData,
 *   status,
 *   selectClass,
 *   goBack,
 *   updateFormData,
 *   submit,
 *   reset,
 * } = useBookingState();
 *
 * // Select a class (transitions to form step)
 * selectClass(classData);
 *
 * // Update form fields
 * updateFormData({ firstName: 'Juan' });
 *
 * // Submit the booking
 * await submit();
 * ```
 *
 * @features
 * - Type-safe state management with TypeScript
 * - Invalid field tracking for form validation
 * - Automatic heels consent detection
 * - Session persistence support via restore action
 * - Clean separation of concerns
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

// Fields that can be marked as invalid
export type InvalidField = 'firstName' | 'lastName' | 'email' | 'phone';

// Extended state with invalid fields tracking
interface ExtendedBookingState extends BookingState {
  invalidFields: InvalidField[];
}

// Extended actions
type ExtendedBookingAction =
  | BookingAction
  | { type: 'SET_INVALID_FIELDS'; payload: InvalidField[] }
  | { type: 'CLEAR_INVALID_FIELDS' }
  | {
      type: 'RESTORE_FORM';
      payload: { formData: BookingFormData; selectedClass: ClassData | null };
    };

// Initial state
const initialState: ExtendedBookingState = {
  step: 'class',
  status: 'idle',
  selectedClass: null,
  formData: INITIAL_FORM_DATA,
  errorMessage: '',
  weekOffset: 0,
  invalidFields: [],
};

// Reducer function
function bookingReducer(
  state: ExtendedBookingState,
  action: ExtendedBookingAction
): ExtendedBookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };

    case 'SELECT_CLASS':
      return {
        ...state,
        selectedClass: action.payload,
        step: 'form',
        errorMessage: '',
        invalidFields: [],
      };

    case 'CLEAR_CLASS':
      return {
        ...state,
        selectedClass: null,
        step: 'class',
        errorMessage: '',
        invalidFields: [],
      };

    case 'SET_STATUS':
      return { ...state, status: action.payload };

    case 'UPDATE_FORM': {
      // Clear invalid fields that are being updated
      const updatedKeys = Object.keys(action.payload) as InvalidField[];
      const clearedInvalidFields = state.invalidFields.filter(
        field => !updatedKeys.includes(field)
      );
      return {
        ...state,
        formData: { ...state.formData, ...action.payload },
        errorMessage: '', // Clear error on form change
        invalidFields: clearedInvalidFields,
      };
    }

    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, errorMessage: '' };

    case 'SET_WEEK':
      return { ...state, weekOffset: action.payload };

    case 'SET_INVALID_FIELDS':
      return { ...state, invalidFields: action.payload };

    case 'CLEAR_INVALID_FIELDS':
      return { ...state, invalidFields: [] };

    case 'RESTORE_FORM':
      return {
        ...state,
        formData: action.payload.formData,
        selectedClass: action.payload.selectedClass,
        step: action.payload.selectedClass ? 'form' : 'class',
      };

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
  invalidFields: InvalidField[];

  // Actions
  selectClass: (classData: ClassData) => void;
  goBack: () => void;
  setStep: (step: Step) => void;
  setStatus: (status: Status) => void;
  updateForm: (data: Partial<BookingFormData>) => void;
  setError: (message: string) => void;
  clearError: () => void;
  setWeek: (week: number) => void;
  setInvalidFields: (fields: InvalidField[]) => void;
  clearInvalidFields: () => void;
  restoreForm: (formData: BookingFormData, selectedClass: ClassData | null) => void;
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

  const setInvalidFields = useCallback((fields: InvalidField[]) => {
    dispatch({ type: 'SET_INVALID_FIELDS', payload: fields });
  }, []);

  const clearInvalidFields = useCallback(() => {
    dispatch({ type: 'CLEAR_INVALID_FIELDS' });
  }, []);

  const restoreForm = useCallback((formData: BookingFormData, selectedClass: ClassData | null) => {
    dispatch({ type: 'RESTORE_FORM', payload: { formData, selectedClass } });
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
    invalidFields: state.invalidFields,

    // Actions
    selectClass,
    goBack,
    setStep,
    setStatus,
    updateForm,
    setError,
    clearError,
    setWeek,
    setInvalidFields,
    clearInvalidFields,
    restoreForm,
    reset,
  };
}
