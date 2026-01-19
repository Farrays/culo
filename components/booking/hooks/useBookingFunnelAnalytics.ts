/**
 * useBookingFunnelAnalytics Hook
 * Advanced analytics for tracking funnel metrics:
 * - Time spent in each step
 * - Abandonment detection
 * - Performance metrics (load times)
 * - User engagement patterns
 */

import { useCallback, useEffect, useRef } from 'react';
import { pushToDataLayer } from '../../../utils/analytics';

/**
 * Funnel steps in order
 */
export type FunnelStep =
  | 'widget_opened'
  | 'class_list'
  | 'class_selected'
  | 'form_started'
  | 'form_completed';

/**
 * Step timing data
 */
interface StepTiming {
  step: FunnelStep;
  startTime: number;
  endTime?: number;
  duration?: number;
}

/**
 * Performance metrics
 */
interface PerformanceMetrics {
  classLoadTime?: number;
  formSubmitTime?: number;
  totalSessionTime?: number;
}

export interface UseBookingFunnelAnalyticsReturn {
  /** Start tracking a funnel step */
  startStep: (step: FunnelStep) => void;
  /** End tracking current step and optionally start next */
  endStep: (nextStep?: FunnelStep) => void;
  /** Track abandonment (call on unmount or navigation away) */
  trackAbandonment: (reason?: string) => void;
  /** Track class list load performance */
  trackClassLoadTime: (startTime: number) => void;
  /** Track form submission performance */
  trackFormSubmitTime: (startTime: number) => void;
  /** Track scroll depth in class list */
  trackScrollDepth: (depth: number, totalClasses: number) => void;
  /** Track retry attempts */
  trackRetryAttempt: (attemptNumber: number, error: string) => void;
  /** Track user interaction patterns */
  trackInteraction: (action: string, details?: Record<string, unknown>) => void;
  /** Get current step */
  getCurrentStep: () => FunnelStep | null;
  /** Get total session time in seconds */
  getSessionDuration: () => number;
}

/**
 * Advanced funnel analytics hook
 */
export function useBookingFunnelAnalytics(): UseBookingFunnelAnalyticsReturn {
  // Track session start time
  const sessionStartRef = useRef<number>(Date.now());

  // Track current step and timing
  const currentStepRef = useRef<FunnelStep | null>(null);
  const stepTimingsRef = useRef<StepTiming[]>([]);
  const performanceRef = useRef<PerformanceMetrics>({});

  // Track max scroll depth reached
  const maxScrollDepthRef = useRef<number>(0);

  // Track if session was completed (not abandoned)
  const completedRef = useRef<boolean>(false);

  /**
   * Start tracking a funnel step
   */
  const startStep = useCallback((step: FunnelStep) => {
    const now = Date.now();

    // End previous step if exists
    if (currentStepRef.current) {
      const currentTiming = stepTimingsRef.current.find(
        t => t.step === currentStepRef.current && !t.endTime
      );
      if (currentTiming) {
        currentTiming.endTime = now;
        currentTiming.duration = now - currentTiming.startTime;
      }
    }

    // Start new step
    currentStepRef.current = step;
    stepTimingsRef.current.push({
      step,
      startTime: now,
    });

    // Track step start event
    pushToDataLayer({
      event: 'booking_funnel_step_start',
      funnel_step: step,
      step_index: stepTimingsRef.current.length,
      session_duration_ms: now - sessionStartRef.current,
    });
  }, []);

  /**
   * End current step and optionally start next
   */
  const endStep = useCallback(
    (nextStep?: FunnelStep) => {
      const now = Date.now();

      if (currentStepRef.current) {
        const currentTiming = stepTimingsRef.current.find(
          t => t.step === currentStepRef.current && !t.endTime
        );

        if (currentTiming) {
          currentTiming.endTime = now;
          currentTiming.duration = now - currentTiming.startTime;

          // Track step completion with duration
          pushToDataLayer({
            event: 'booking_funnel_step_complete',
            funnel_step: currentStepRef.current,
            step_duration_ms: currentTiming.duration,
            step_duration_seconds: Math.round(currentTiming.duration / 1000),
          });
        }
      }

      // Mark as completed if reaching form_completed
      if (currentStepRef.current === 'form_completed' || nextStep === 'form_completed') {
        completedRef.current = true;
      }

      // Start next step if provided
      if (nextStep) {
        startStep(nextStep);
      } else {
        currentStepRef.current = null;
      }
    },
    [startStep]
  );

  /**
   * Track abandonment with detailed context
   */
  const trackAbandonment = useCallback((reason?: string) => {
    // Don't track if completed successfully
    if (completedRef.current) return;

    const now = Date.now();
    const sessionDuration = now - sessionStartRef.current;

    // Calculate time spent in each step
    const stepDurations: Record<string, number> = {};
    stepTimingsRef.current.forEach(timing => {
      const duration = timing.duration || now - timing.startTime;
      stepDurations[timing.step] = Math.round(duration / 1000);
    });

    pushToDataLayer({
      event: 'booking_abandonment',
      abandoned_at_step: currentStepRef.current || 'unknown',
      abandonment_reason: reason || 'navigation_away',
      session_duration_seconds: Math.round(sessionDuration / 1000),
      steps_completed: stepTimingsRef.current.filter(t => t.endTime).length,
      max_scroll_depth_percent: maxScrollDepthRef.current,
      step_durations: stepDurations,
      // Performance context
      class_load_time_ms: performanceRef.current.classLoadTime,
    });
  }, []);

  /**
   * Track class list load performance
   */
  const trackClassLoadTime = useCallback((startTime: number) => {
    const loadTime = Date.now() - startTime;
    performanceRef.current.classLoadTime = loadTime;

    pushToDataLayer({
      event: 'booking_performance_class_load',
      load_time_ms: loadTime,
      load_time_seconds: Math.round(loadTime / 100) / 10, // 1 decimal
      is_slow: loadTime > 3000, // Flag if > 3s
    });
  }, []);

  /**
   * Track form submission performance
   */
  const trackFormSubmitTime = useCallback((startTime: number) => {
    const submitTime = Date.now() - startTime;
    performanceRef.current.formSubmitTime = submitTime;

    pushToDataLayer({
      event: 'booking_performance_form_submit',
      submit_time_ms: submitTime,
      submit_time_seconds: Math.round(submitTime / 100) / 10,
      is_slow: submitTime > 5000, // Flag if > 5s
    });
  }, []);

  /**
   * Track scroll depth in class list
   */
  const trackScrollDepth = useCallback((depth: number, totalClasses: number) => {
    const depthPercent = Math.round((depth / Math.max(totalClasses, 1)) * 100);

    // Only track if new max depth (avoid spamming)
    if (depthPercent > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = depthPercent;

      // Track at 25%, 50%, 75%, 100% thresholds
      const thresholds = [25, 50, 75, 100];
      const crossedThreshold = thresholds.find(
        t => depthPercent >= t && maxScrollDepthRef.current < t
      );

      if (crossedThreshold || depthPercent === 100) {
        pushToDataLayer({
          event: 'booking_scroll_depth',
          scroll_depth_percent: depthPercent,
          classes_viewed: depth,
          total_classes: totalClasses,
        });
      }
    }
  }, []);

  /**
   * Track retry attempts
   */
  const trackRetryAttempt = useCallback((attemptNumber: number, error: string) => {
    pushToDataLayer({
      event: 'booking_retry_attempt',
      attempt_number: attemptNumber,
      error_type: error,
      session_duration_ms: Date.now() - sessionStartRef.current,
    });
  }, []);

  /**
   * Track generic user interactions
   */
  const trackInteraction = useCallback((action: string, details?: Record<string, unknown>) => {
    pushToDataLayer({
      event: 'booking_interaction',
      interaction_action: action,
      session_duration_ms: Date.now() - sessionStartRef.current,
      current_step: currentStepRef.current,
      ...details,
    });
  }, []);

  /**
   * Get current funnel step
   */
  const getCurrentStep = useCallback(() => currentStepRef.current, []);

  /**
   * Get total session duration in seconds
   */
  const getSessionDuration = useCallback(() => {
    return Math.round((Date.now() - sessionStartRef.current) / 1000);
  }, []);

  /**
   * Track abandonment on unmount
   */
  useEffect(() => {
    // Start initial step
    startStep('widget_opened');

    // Handle page visibility change (tab switch)
    const handleVisibilityChange = () => {
      if (document.hidden && !completedRef.current) {
        trackAbandonment('tab_hidden');
      }
    };

    // Handle before unload (page close/navigation)
    const handleBeforeUnload = () => {
      if (!completedRef.current) {
        trackAbandonment('page_unload');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Track final abandonment if not completed
      if (!completedRef.current) {
        trackAbandonment('component_unmount');
      }
    };
  }, [startStep, trackAbandonment]);

  return {
    startStep,
    endStep,
    trackAbandonment,
    trackClassLoadTime,
    trackFormSubmitTime,
    trackScrollDepth,
    trackRetryAttempt,
    trackInteraction,
    getCurrentStep,
    getSessionDuration,
  };
}

export default useBookingFunnelAnalytics;
