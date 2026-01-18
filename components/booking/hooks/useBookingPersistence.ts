/* eslint-disable no-undef */
/**
 * useBookingPersistence Hook
 * Handles localStorage persistence, beforeunload warning, and haptic feedback
 */

import { useEffect, useCallback, useRef } from 'react';
import type { BookingFormData, ClassData } from '../types/booking';
import { INITIAL_FORM_DATA } from '../types/booking';

// Storage keys
const STORAGE_KEY = 'booking_form_data';
const STORAGE_CLASS_KEY = 'booking_selected_class';
const STORAGE_EXPIRY_KEY = 'booking_expiry';

// Data expires after 30 minutes
const EXPIRY_MS = 30 * 60 * 1000;

export interface PersistedBookingData {
  formData: BookingFormData;
  selectedClass: ClassData | null;
}

export interface UseBookingPersistenceReturn {
  // Load persisted data
  loadPersistedData: () => PersistedBookingData | null;
  // Save data to localStorage
  persistData: (formData: BookingFormData, selectedClass: ClassData | null) => void;
  // Clear persisted data
  clearPersistedData: () => void;
  // Check if form has unsaved changes
  hasUnsavedChanges: (formData: BookingFormData) => boolean;
  // Trigger haptic feedback
  triggerHaptic: (type?: 'light' | 'medium' | 'heavy' | 'error' | 'success') => void;
}

/**
 * Check if form has meaningful data
 */
function formHasData(formData: BookingFormData): boolean {
  return !!(
    formData.firstName.trim() ||
    formData.lastName.trim() ||
    formData.email.trim() ||
    formData.phone.trim()
  );
}

/**
 * Custom hook for booking form persistence and UX enhancements
 */
export function useBookingPersistence(
  formData: BookingFormData,
  selectedClass: ClassData | null,
  status: 'idle' | 'loading' | 'success' | 'error',
  t: (key: string) => string
): UseBookingPersistenceReturn {
  const hasRegisteredBeforeUnload = useRef(false);

  /**
   * Load persisted data from localStorage
   */
  const loadPersistedData = useCallback((): PersistedBookingData | null => {
    try {
      // Check expiry
      const expiryStr = localStorage.getItem(STORAGE_EXPIRY_KEY);
      if (expiryStr) {
        const expiry = parseInt(expiryStr, 10);
        if (Date.now() > expiry) {
          // Data expired, clear it
          localStorage.removeItem(STORAGE_KEY);
          localStorage.removeItem(STORAGE_CLASS_KEY);
          localStorage.removeItem(STORAGE_EXPIRY_KEY);
          return null;
        }
      }

      const formDataStr = localStorage.getItem(STORAGE_KEY);
      const classDataStr = localStorage.getItem(STORAGE_CLASS_KEY);

      if (!formDataStr) return null;

      const savedFormData = JSON.parse(formDataStr) as BookingFormData;
      const savedClass = classDataStr ? (JSON.parse(classDataStr) as ClassData) : null;

      return {
        formData: { ...INITIAL_FORM_DATA, ...savedFormData },
        selectedClass: savedClass,
      };
    } catch {
      // If parsing fails, return null
      return null;
    }
  }, []);

  /**
   * Persist data to localStorage
   */
  const persistData = useCallback((data: BookingFormData, classData: ClassData | null) => {
    try {
      // Only persist if there's meaningful data
      if (formHasData(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        localStorage.setItem(STORAGE_EXPIRY_KEY, String(Date.now() + EXPIRY_MS));

        if (classData) {
          localStorage.setItem(STORAGE_CLASS_KEY, JSON.stringify(classData));
        }
      }
    } catch {
      // localStorage might be full or disabled
      console.warn('Could not persist booking data');
    }
  }, []);

  /**
   * Clear persisted data
   */
  const clearPersistedData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_CLASS_KEY);
      localStorage.removeItem(STORAGE_EXPIRY_KEY);
    } catch {
      // Ignore errors
    }
  }, []);

  /**
   * Check if form has unsaved changes
   */
  const hasUnsavedChanges = useCallback((data: BookingFormData): boolean => {
    return formHasData(data);
  }, []);

  /**
   * Trigger haptic feedback on mobile devices
   */
  const triggerHaptic = useCallback(
    (type: 'light' | 'medium' | 'heavy' | 'error' | 'success' = 'light') => {
      // Check if Vibration API is available
      if (!navigator.vibrate) return;

      // Different vibration patterns for different feedback types
      const patterns: Record<string, number | number[]> = {
        light: 10,
        medium: 25,
        heavy: 50,
        error: [50, 30, 50, 30, 50], // Three short pulses
        success: [30, 50, 100], // Short, pause, long
      };

      try {
        navigator.vibrate(patterns[type] || 10);
      } catch {
        // Vibration not supported or failed
      }
    },
    []
  );

  /**
   * Auto-save form data when it changes
   */
  useEffect(() => {
    // Don't persist during loading or after success
    if (status === 'loading' || status === 'success') return;

    // Debounce persistence to avoid too many writes
    const timeoutId = setTimeout(() => {
      persistData(formData, selectedClass);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, selectedClass, status, persistData]);

  /**
   * Clear persisted data on success
   */
  useEffect(() => {
    if (status === 'success') {
      clearPersistedData();
    }
  }, [status, clearPersistedData]);

  /**
   * beforeunload warning when form has unsaved data
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent): string | void => {
      // Only warn if in form step with data and not in success state
      if (status === 'success' || status === 'loading') return;

      if (hasUnsavedChanges(formData)) {
        // Standard way to trigger the browser's confirmation dialog
        e.preventDefault();
        // Some browsers require returnValue to be set
        const message = t('booking_unsaved_warning');
        e.returnValue = message;
        return message;
      }
    };

    // Only register once and when we have form data
    if (formHasData(formData) && !hasRegisteredBeforeUnload.current) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      hasRegisteredBeforeUnload.current = true;
    } else if (!formHasData(formData) && hasRegisteredBeforeUnload.current) {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      hasRegisteredBeforeUnload.current = false;
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      hasRegisteredBeforeUnload.current = false;
    };
  }, [formData, status, t, hasUnsavedChanges]);

  return {
    loadPersistedData,
    persistData,
    clearPersistedData,
    hasUnsavedChanges,
    triggerHaptic,
  };
}

export default useBookingPersistence;
