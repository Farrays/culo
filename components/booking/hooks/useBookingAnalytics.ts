/**
 * useBookingAnalytics Hook
 * Handles all analytics tracking for the booking widget
 */

import { useCallback } from 'react';
import { pushToDataLayer, trackLeadConversion, LEAD_VALUES } from '../../../utils/analytics';
import type { FilterState, ClassData } from '../types/booking';

export interface UseBookingAnalyticsReturn {
  trackFilterChange: (filters: FilterState) => void;
  trackClassSelected: (classData: ClassData) => void;
  trackClassShared: (classData: ClassData) => void;
  trackCalendarGoogle: (classData: ClassData) => void;
  trackCalendarICS: (classData: ClassData) => void;
  trackFormStarted: (classData: ClassData) => void;
  trackBookingSuccess: (classData: ClassData) => void;
  trackBookingError: (classData: ClassData, error: string) => void;
  trackDeepLinkUsed: (params: Partial<FilterState>) => void;
  trackWeekChange: (weekOffset: number) => void;
}

export function useBookingAnalytics(): UseBookingAnalyticsReturn {
  // Track filter changes
  const trackFilterChange = useCallback((filters: FilterState) => {
    pushToDataLayer({
      event: 'booking_filter_changed',
      booking_style: filters.style || 'all',
      booking_level: filters.level || 'all',
      booking_day: filters.day || 'all',
      booking_time_block: filters.timeBlock || 'all',
      booking_instructor: filters.instructor || 'all',
      booking_time: filters.time || 'all',
      active_filter_count: Object.values(filters).filter(Boolean).length,
    });
  }, []);

  // Track class selection
  const trackClassSelected = useCallback((classData: ClassData) => {
    pushToDataLayer({
      event: 'booking_class_selected',
      class_id: classData.id,
      class_name: classData.name,
      class_style: classData.style,
      class_level: classData.level,
      class_instructor: classData.instructor,
      class_day: classData.dayOfWeek,
      class_time: classData.time,
      class_spots_available: classData.spotsAvailable,
    });
  }, []);

  // Track class shared
  const trackClassShared = useCallback((classData: ClassData) => {
    pushToDataLayer({
      event: 'booking_class_shared',
      class_id: classData.id,
      class_name: classData.name,
      class_style: classData.style,
    });
  }, []);

  // Track Google Calendar click
  const trackCalendarGoogle = useCallback((classData: ClassData) => {
    pushToDataLayer({
      event: 'booking_calendar_google',
      class_id: classData.id,
      class_name: classData.name,
    });
  }, []);

  // Track ICS download
  const trackCalendarICS = useCallback((classData: ClassData) => {
    pushToDataLayer({
      event: 'booking_calendar_ics',
      class_id: classData.id,
      class_name: classData.name,
    });
  }, []);

  // Track form started (user begins filling form)
  const trackFormStarted = useCallback((classData: ClassData) => {
    pushToDataLayer({
      event: 'booking_form_started',
      class_id: classData.id,
      class_name: classData.name,
      class_style: classData.style,
    });
  }, []);

  // Track successful booking
  const trackBookingSuccess = useCallback((classData: ClassData) => {
    // Track lead conversion
    trackLeadConversion({
      leadSource: 'booking_widget',
      formName: `Booking - ${classData.style}`,
      leadValue: LEAD_VALUES.BOOKING_LEAD,
      pagePath: window.location.pathname,
    });

    // Also push to dataLayer for GTM
    pushToDataLayer({
      event: 'booking_success',
      class_id: classData.id,
      class_name: classData.name,
      class_style: classData.style,
      class_level: classData.level,
      class_instructor: classData.instructor,
      class_day: classData.dayOfWeek,
      class_time: classData.time,
    });
  }, []);

  // Track booking error
  const trackBookingError = useCallback((classData: ClassData, error: string) => {
    pushToDataLayer({
      event: 'booking_error',
      class_id: classData.id,
      class_name: classData.name,
      class_style: classData.style,
      error_message: error,
    });
  }, []);

  // Track deep link usage
  const trackDeepLinkUsed = useCallback((params: Partial<FilterState>) => {
    pushToDataLayer({
      event: 'booking_deep_link_used',
      ...params,
    });
  }, []);

  // Track week change
  const trackWeekChange = useCallback((weekOffset: number) => {
    pushToDataLayer({
      event: 'booking_week_changed',
      week_offset: weekOffset,
    });
  }, []);

  return {
    trackFilterChange,
    trackClassSelected,
    trackClassShared,
    trackCalendarGoogle,
    trackCalendarICS,
    trackFormStarted,
    trackBookingSuccess,
    trackBookingError,
    trackDeepLinkUsed,
    trackWeekChange,
  };
}
