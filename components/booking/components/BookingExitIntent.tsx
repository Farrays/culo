/**
 * BookingExitIntent - Exit intent modal for booking page (Enterprise Mode)
 *
 * Shows when user tries to leave the booking page while in "locked" mode
 * (came from a landing page with a specific style pre-selected).
 *
 * Triggers:
 * - Desktop: Mouse leaves viewport towards top (mouseleave)
 * - Mobile: Quick scroll up towards top of page (with engagement check + delay)
 *
 * Enterprise features:
 * - Personalized messaging based on dance style
 * - Pull-to-refresh protection (requires prior engagement + confirmation delay)
 * - Session + 24h frequency limiting
 * - Analytics tracking at every step
 *
 * Offers to show all available classes instead of just the filtered ones.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { pushToDataLayer } from '../../../utils/analytics';
import { getStyleLabel, getStyleColor } from '../constants/bookingOptions';

// Storage keys
const STORAGE_KEY = 'booking_exit_intent_shown';
const SESSION_KEY = 'booking_exit_intent_session';
const STORAGE_EXPIRY_HOURS = 24;

// Mobile scroll detection config (enterprise tuned)
const SCROLL_THRESHOLD = 150; // Pixels scrolled up to trigger (increased for safety)
const SCROLL_SPEED_THRESHOLD = 40; // Pixels per 100ms to consider "fast" scroll
const MIN_ENGAGEMENT_SCROLL = 200; // User must scroll down this much first (pull-to-refresh protection)
const TRIGGER_DELAY_MS = 400; // Delay before triggering (prevents accidental activation)

// Debug logging (only in development - no-op in production)
const debugLog = import.meta.env.DEV
  ? // eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
    (...args: any[]) => console.log('[BookingExitIntent]', ...args)
  : () => {};

// Expose reset function for testing (call window.resetBookingExitIntent() in console)
if (typeof window !== 'undefined') {
  (window as unknown as { resetBookingExitIntent: () => void }).resetBookingExitIntent = () => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    debugLog('Reset! Refresh the page to test again.');
  };
}

interface BookingExitIntentProps {
  /** Delay in ms before enabling exit detection */
  delay?: number;
}

export const BookingExitIntent: React.FC<BookingExitIntentProps> = ({ delay = 3000 }) => {
  const { t, i18n } = useTranslation('booking');
  const locale = i18n.language;
  const [searchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [wasShownBefore, setWasShownBefore] = useState(false);
  const [shownThisSession, setShownThisSession] = useState(false);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Mobile scroll tracking refs
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollUpDistance = useRef(0);
  const maxScrollReached = useRef(0); // Track max scroll for engagement detection
  const triggerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingTrigger = useRef(false);

  // Only show exit intent if in locked mode (came from landing page)
  const isLocked = searchParams.get('locked') === 'true';
  const currentStyle = searchParams.get('style') || '';
  const styleLabel = getStyleLabel(currentStyle);
  const styleColor = getStyleColor(currentStyle);

  // Detect if device is touch-based (mobile/tablet)
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  // Check localStorage and sessionStorage on mount
  useEffect(() => {
    try {
      // Check session storage first (per-session limit)
      const sessionShown = sessionStorage.getItem(SESSION_KEY);
      if (sessionShown === 'true') {
        setShownThisSession(true);
        debugLog(' Already shown this session');
        return;
      }

      // Check localStorage (24h limit)
      const shown = localStorage.getItem(STORAGE_KEY);
      if (shown) {
        const shownTime = parseInt(shown, 10);
        const now = Date.now();
        const hoursDiff = (now - shownTime) / (1000 * 60 * 60);
        setWasShownBefore(hoursDiff < STORAGE_EXPIRY_HOURS);
        debugLog(
          'Was shown before:',
          hoursDiff < STORAGE_EXPIRY_HOURS,
          'hours ago:',
          hoursDiff.toFixed(1)
        );
      } else {
        debugLog(' Never shown before');
      }
    } catch {
      // Storage not available
    }
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (triggerTimeoutRef.current) {
        clearTimeout(triggerTimeoutRef.current);
      }
    };
  }, []);

  // Debug: Log state changes
  useEffect(() => {
    debugLog(' State:', {
      isLocked,
      isEnabled,
      wasShownBefore,
      shownThisSession,
      isOpen,
      currentStyle,
      styleLabel,
      isTouchDevice,
      maxEngagement: maxScrollReached.current,
    });
  }, [
    isLocked,
    isEnabled,
    wasShownBefore,
    shownThisSession,
    isOpen,
    currentStyle,
    styleLabel,
    isTouchDevice,
  ]);

  // Mark as shown (both localStorage and sessionStorage)
  const markAsShown = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
      sessionStorage.setItem(SESSION_KEY, 'true');
      setShownThisSession(true);
    } catch {
      // Storage not available
    }
  }, []);

  // Open modal
  const openModal = useCallback(() => {
    if (isOpen || shownThisSession) return;

    // Clear any pending trigger
    if (triggerTimeoutRef.current) {
      clearTimeout(triggerTimeoutRef.current);
      triggerTimeoutRef.current = null;
    }
    pendingTrigger.current = false;

    previousActiveElement.current = document.activeElement as HTMLElement;
    setIsOpen(true);
    markAsShown();

    pushToDataLayer({
      event: 'booking_exit_intent_shown',
      style: currentStyle,
      style_label: styleLabel,
      trigger: isTouchDevice ? 'mobile_scroll' : 'desktop_mouseleave',
      max_engagement_scroll: maxScrollReached.current,
      page_path: window.location.pathname,
    });
  }, [isOpen, shownThisSession, markAsShown, currentStyle, styleLabel, isTouchDevice]);

  // Close modal
  const closeModal = useCallback(() => {
    setIsOpen(false);

    pushToDataLayer({
      event: 'booking_exit_intent_dismissed',
      style: currentStyle,
      style_label: styleLabel,
      page_path: window.location.pathname,
    });

    setTimeout(() => {
      previousActiveElement.current?.focus();
    }, 100);
  }, [currentStyle, styleLabel]);

  // Handle CTA click
  const handleViewAllClasses = useCallback(() => {
    pushToDataLayer({
      event: 'booking_exit_intent_converted',
      style: currentStyle,
      style_label: styleLabel,
      page_path: window.location.pathname,
    });
  }, [currentStyle, styleLabel]);

  // Enable after delay
  useEffect(() => {
    if (!isLocked) return;

    const timer = setTimeout(() => {
      setIsEnabled(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, isLocked]);

  // Check if exit intent can be triggered
  const canTrigger = isEnabled && isLocked && !wasShownBefore && !shownThisSession && !isOpen;

  // Handle mouse leave (desktop exit intent)
  useEffect(() => {
    if (!canTrigger || isTouchDevice) {
      return;
    }

    debugLog(' Attaching desktop mouseleave listener');

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        debugLog(' Desktop trigger: mouse left at top');
        openModal();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canTrigger, isTouchDevice, openModal]);

  // Handle scroll up (mobile exit intent) - Enterprise mode with engagement check
  useEffect(() => {
    if (!canTrigger || !isTouchDevice) {
      return;
    }

    debugLog(' Attaching mobile scroll listener (enterprise mode)');

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTime.current;
      const scrollDiff = lastScrollY.current - currentScrollY; // Positive when scrolling up

      // Track maximum scroll for engagement detection
      if (currentScrollY > maxScrollReached.current) {
        maxScrollReached.current = currentScrollY;
      }

      // Check if user has engaged with the page (scrolled down enough)
      const hasEngaged = maxScrollReached.current >= MIN_ENGAGEMENT_SCROLL;

      // Only track upward scrolls near the top of the page AND if user has engaged
      if (scrollDiff > 0 && currentScrollY < 300 && hasEngaged) {
        // Calculate scroll speed (pixels per 100ms)
        const scrollSpeed = timeDiff > 0 ? (scrollDiff / timeDiff) * 100 : 0;

        // Accumulate scroll up distance if scrolling fast enough
        if (scrollSpeed > SCROLL_SPEED_THRESHOLD) {
          scrollUpDistance.current += scrollDiff;

          // Check trigger conditions
          if (scrollUpDistance.current > SCROLL_THRESHOLD && currentScrollY < 50) {
            // Start delayed trigger if not already pending
            if (!pendingTrigger.current && !triggerTimeoutRef.current) {
              debugLog(' Mobile trigger conditions met, starting delay...');
              pendingTrigger.current = true;

              triggerTimeoutRef.current = setTimeout(() => {
                // Double-check conditions still valid
                if (pendingTrigger.current && canTrigger) {
                  debugLog(' Mobile trigger confirmed after delay');
                  openModal();
                }
                triggerTimeoutRef.current = null;
                pendingTrigger.current = false;
              }, TRIGGER_DELAY_MS);
            }
          }
        }
      } else {
        // Reset accumulator and cancel pending trigger on downward scroll
        scrollUpDistance.current = 0;
        if (pendingTrigger.current) {
          debugLog(' Trigger cancelled - user scrolled down');
          pendingTrigger.current = false;
          if (triggerTimeoutRef.current) {
            clearTimeout(triggerTimeoutRef.current);
            triggerTimeoutRef.current = null;
          }
        }
      }

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [canTrigger, isTouchDevice, openModal]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeModal]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
    return undefined;
  }, [isOpen]);

  // Debug indicator (only in development)
  const showDebug = import.meta.env.DEV && isLocked && !isOpen;

  // Don't render if not in locked mode or modal is closed
  if (!isLocked || !isOpen) {
    // Show debug indicator in development
    if (showDebug) {
      return (
        <div className="fixed bottom-4 right-4 z-50 p-3 bg-black/90 border border-primary-accent/50 rounded-lg text-xs text-white/70 max-w-xs">
          <div className="font-bold text-primary-accent mb-1">Exit Intent Debug (Enterprise)</div>
          <div>isEnabled: {isEnabled ? '✅' : '⏳ (waiting 3s)'}</div>
          <div>isLocked: {isLocked ? '✅' : '❌'}</div>
          <div>wasShownBefore: {wasShownBefore ? '❌ (24h)' : '✅'}</div>
          <div>shownThisSession: {shownThisSession ? '❌ (session)' : '✅'}</div>
          <div>device: {isTouchDevice ? '📱 Mobile' : '🖥️ Desktop'}</div>
          <div>
            style: {styleLabel} ({currentStyle})
          </div>
          {isTouchDevice && (
            <div>
              engagement:{' '}
              {maxScrollReached.current >= MIN_ENGAGEMENT_SCROLL
                ? '✅'
                : `⏳ (${maxScrollReached.current}/${MIN_ENGAGEMENT_SCROLL}px)`}
            </div>
          )}
          <div className="mt-2 text-[10px] text-white/50">
            {!isEnabled && 'Wait 3s after page load...'}
            {isEnabled && canTrigger && !isTouchDevice && 'Move mouse above browser!'}
            {isEnabled &&
              canTrigger &&
              isTouchDevice &&
              maxScrollReached.current < MIN_ENGAGEMENT_SCROLL &&
              'Scroll down first to engage...'}
            {isEnabled &&
              canTrigger &&
              isTouchDevice &&
              maxScrollReached.current >= MIN_ENGAGEMENT_SCROLL &&
              'Scroll up fast at top!'}
            {(wasShownBefore || shownThisSession) && 'Run: resetBookingExitIntent()'}
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-exit-intent-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute top-3 right-3 p-2 text-neutral/70 hover:text-neutral transition-colors rounded-full hover:bg-white/10 z-10"
          aria-label={t('close')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="p-6 sm:p-8 text-center">
          {/* Style indicator with color */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="w-3 h-3 rounded-full ring-2 ring-white/20"
              style={{ backgroundColor: styleColor }}
            />
            <span className="text-sm font-medium" style={{ color: styleColor }}>
              {styleLabel}
            </span>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-accent/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3
            id="booking-exit-intent-title"
            className="text-xl sm:text-2xl font-black text-neutral mb-3"
          >
            {t('booking_exit_intent_title_personalized', { style: styleLabel })}
          </h3>

          <p className="text-neutral/70 text-sm sm:text-base mb-6 leading-relaxed">
            {t('booking_exit_intent_description_personalized', { style: styleLabel })}
          </p>

          <div className="space-y-3">
            {/* Primary CTA: See all classes */}
            <Link
              to={`/${locale}/reservas`}
              onClick={handleViewAllClasses}
              className="block w-full py-3.5 px-6 bg-primary-accent hover:bg-primary-accent/90 text-white font-bold rounded-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {t('booking_exit_intent_cta')}
            </Link>

            {/* Secondary: Continue with current style */}
            <button
              onClick={closeModal}
              className="block w-full py-3 px-6 bg-white/5 text-neutral/80 font-semibold rounded-xl transition-all border border-white/10 hover:bg-white/10"
            >
              {t('booking_exit_intent_continue', { style: styleLabel })}
            </button>
          </div>

          <p className="text-neutral/40 text-xs mt-4">{t('booking_exit_intent_hint')}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingExitIntent;
