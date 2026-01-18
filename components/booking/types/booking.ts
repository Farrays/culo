/**
 * Booking Widget Types
 * Enterprise-level type definitions for the booking system
 */

// Time block options for filtering
export type TimeBlock = 'morning' | 'afternoon' | 'evening' | '';

// Level options
export type Level = 'iniciacion' | 'basico' | 'intermedio' | 'avanzado' | 'abierto' | '';

// Step types (reduced from 3 to 2)
export type Step = 'class' | 'form';

// Status for async operations
export type Status = 'idle' | 'loading' | 'success' | 'error';

// URL parameters for deep linking
export interface BookingUrlParams {
  style?: string;
  day?: string;
  time?: string;
  timeBlock?: TimeBlock;
  instructor?: string;
  level?: Level;
  classId?: string;
  week?: string;
}

// Filter state (synced with URL)
export interface FilterState {
  style: string;
  level: string;
  day: string;
  timeBlock: string;
  instructor: string;
  time: string;
}

// Initial filter state
export const INITIAL_FILTERS: FilterState = {
  style: '',
  level: '',
  day: '',
  timeBlock: '',
  instructor: '',
  time: '',
};

// Class data from API
export interface ClassData {
  id: number;
  name: string;
  date: string;
  time: string;
  dayOfWeek: string;
  spotsAvailable: number;
  isFull: boolean;
  location: string;
  instructor: string;
  style: string;
  level: string;
  rawStartsAt: string;
  duration: number;
  description: string;
  /** Flag to mark class as new (shows badge) */
  isNew?: boolean;
  /** ISO date string - badge shows until this date (e.g., "2025-02-15") */
  newUntil?: string;
}

// Form data for booking submission
export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // RGPD Mandatory Consents
  acceptsTerms: boolean;
  acceptsMarketing: boolean;
  acceptsAge: boolean;
  acceptsNoRefund: boolean;
  acceptsPrivacy: boolean;
  // Conditional (Heels classes)
  acceptsHeels: boolean;
  // Optional
  acceptsImage: boolean;
}

// Initial form data
export const INITIAL_FORM_DATA: BookingFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  acceptsTerms: false,
  acceptsMarketing: false,
  acceptsAge: false,
  acceptsNoRefund: false,
  acceptsPrivacy: false,
  acceptsHeels: false,
  acceptsImage: false,
};

// Filter option type
export interface FilterOption {
  value: string;
  label: string;
  color?: string;
  icon?: string;
}

// Available filter options derived from classes
export interface FilterOptions {
  styles: string[];
  levels: string[];
  instructors: string[];
  days: string[];
}

// Analytics event types
export interface BookingAnalyticsEvent {
  event: string;
  filters?: Partial<FilterState>;
  class_id?: number;
  class_name?: string;
  class_style?: string;
  class_level?: string;
  class_instructor?: string;
  step?: Step;
}

// Booking state for useReducer
export interface BookingState {
  step: Step;
  status: Status;
  selectedClass: ClassData | null;
  formData: BookingFormData;
  errorMessage: string;
  weekOffset: number;
}

// Booking action types
export type BookingAction =
  | { type: 'SET_STEP'; payload: Step }
  | { type: 'SELECT_CLASS'; payload: ClassData }
  | { type: 'CLEAR_CLASS' }
  | { type: 'SET_STATUS'; payload: Status }
  | { type: 'UPDATE_FORM'; payload: Partial<BookingFormData> }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_WEEK'; payload: number }
  | { type: 'RESET' };

// Styles that require heels consent
export const HEELS_STYLES = ['heels', 'girly'];

// Check if a class requires heels consent
export function requiresHeelsConsent(classData: ClassData | null): boolean {
  if (!classData) return false;
  return HEELS_STYLES.some(s => classData.style.toLowerCase().includes(s));
}
