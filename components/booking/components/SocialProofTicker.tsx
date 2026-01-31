/**
 * SocialProofTicker Component
 *
 * Displays recent real bookings as toast notifications from the bottom:
 * "María reservó Bachata hace 2 min"
 *
 * Features:
 * - Fetches real booking data from /api/social-proof
 * - Shows as toast notification that slides up from bottom
 * - Auto-hides after display duration, then shows next booking
 * - Auto-refreshes data every 60 seconds
 * - Respects reduced motion preferences
 * - Hides automatically if no recent bookings
 * - Analytics tracking for visibility and clicks
 * - Click-through to scroll to booking content
 */

import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../../../utils/analytics';

interface SocialProofBooking {
  name: string;
  class: string;
  minutesAgo: number;
}

interface SocialProofResponse {
  success: boolean;
  bookings: SocialProofBooking[];
}

// API base URL for Vercel functions
const API_BASE = import.meta.env['VITE_API_URL'] || '';

// Refresh interval: 60 seconds
const REFRESH_INTERVAL = 60 * 1000;

// How long to show each notification: 7 seconds (enough time to read)
const DISPLAY_DURATION = 7 * 1000;

// How long to wait between notifications: 15 seconds
const PAUSE_BETWEEN = 15 * 1000;

// Animation duration for slide in/out
const ANIMATION_DURATION = 400;

export interface SocialProofTickerProps {
  /** Maximum number of bookings to fetch */
  limit?: number;
  /** Custom class name for styling */
  className?: string;
  /** Callback when ticker becomes visible (has bookings) */
  onShow?: () => void;
  /** Callback when ticker hides (no bookings) */
  onHide?: () => void;
  /** Callback when ticker is clicked */
  onClick?: () => void;
  /** Target element ID to scroll to on click */
  scrollTargetId?: string;
}

export const SocialProofTicker: React.FC<SocialProofTickerProps> = memo(
  ({ limit = 5, className = '', onShow, onHide, onClick, scrollTargetId = 'booking-content' }) => {
    const { t } = useTranslation([
      'common',
      'booking',
      'schedule',
      'calendar',
      'home',
      'classes',
      'blog',
      'faq',
      'about',
      'contact',
      'pages',
    ]);
    const [bookings, setBookings] = useState<SocialProofBooking[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasBookings, setHasBookings] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [isSliding, setIsSliding] = useState<'in' | 'out' | 'hidden'>('hidden');
    const hasTrackedImpression = useRef(false);
    const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Check for reduced motion preference - must be in useEffect to avoid hydration mismatch
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }, []);

    // Track impression when ticker becomes visible (only once per session)
    useEffect(() => {
      if (toastVisible && !hasTrackedImpression.current && bookings.length > 0) {
        hasTrackedImpression.current = true;
        trackEvent('social_proof_impression', {
          event_category: 'engagement',
          event_label: 'social_proof_ticker',
          booking_count: bookings.length,
          first_booking_class: bookings[0]?.class || 'unknown',
        });
      }
    }, [toastVisible, bookings]);

    // Handle click with analytics
    const handleClick = useCallback(() => {
      const currentBooking = bookings[currentIndex];
      trackEvent('social_proof_click', {
        event_category: 'engagement',
        event_label: 'social_proof_ticker',
        booking_class: currentBooking?.class || 'unknown',
        booking_minutes_ago: currentBooking?.minutesAgo || 0,
      });

      onClick?.();

      // Hide toast on click
      setIsSliding('out');
      setTimeout(() => {
        setToastVisible(false);
        setIsSliding('hidden');
      }, ANIMATION_DURATION);

      if (scrollTargetId) {
        const targetElement = document.getElementById(scrollTargetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetElement.focus({ preventScroll: true });
        }
      }
    }, [bookings, currentIndex, onClick, scrollTargetId]);

    // Dismiss toast
    const handleDismiss = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setIsSliding('out');
      setTimeout(() => {
        setToastVisible(false);
        setIsSliding('hidden');
      }, ANIMATION_DURATION);
    }, []);

    // Fetch recent bookings from API
    const fetchBookings = useCallback(async () => {
      try {
        const response = await fetch(`${API_BASE}/api/social-proof?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch social proof data');
        }
        const data: SocialProofResponse = await response.json();

        if (data.success && data.bookings.length > 0) {
          setBookings(data.bookings);
          if (!hasBookings) {
            setHasBookings(true);
            onShow?.();
          }
        } else {
          setBookings([]);
          if (hasBookings) {
            setHasBookings(false);
            onHide?.();
          }
        }
      } catch (err) {
        console.warn('Social proof fetch error:', err);
      }
    }, [limit, hasBookings, onShow, onHide]);

    // Initial fetch and refresh interval
    useEffect(() => {
      fetchBookings();
      const intervalId = setInterval(fetchBookings, REFRESH_INTERVAL);
      return () => clearInterval(intervalId);
    }, [fetchBookings]);

    // Show/hide toast cycle
    useEffect(() => {
      if (bookings.length === 0) return;

      const showToast = () => {
        // Slide in
        setToastVisible(true);
        setIsSliding('in');

        // After display duration, slide out
        cycleTimerRef.current = setTimeout(() => {
          setIsSliding('out');

          // After animation, hide and prepare next
          setTimeout(() => {
            setToastVisible(false);
            setIsSliding('hidden');
            setCurrentIndex(prev => (prev + 1) % bookings.length);

            // Schedule next toast
            cycleTimerRef.current = setTimeout(showToast, PAUSE_BETWEEN);
          }, ANIMATION_DURATION);
        }, DISPLAY_DURATION);
      };

      // Start the cycle with a small delay
      const initialTimer = setTimeout(showToast, 1000);

      return () => {
        clearTimeout(initialTimer);
        if (cycleTimerRef.current) clearTimeout(cycleTimerRef.current);
      };
    }, [bookings.length]);

    // Don't render if no bookings or toast not visible
    if (bookings.length === 0 || !toastVisible) {
      return null;
    }

    const currentBooking = bookings[currentIndex];
    if (!currentBooking) return null;

    // Format the time ago text
    const timeAgoText =
      currentBooking.minutesAgo <= 1
        ? t('socialProofJustNow')
        : t('socialProofMinutesAgo').replace('{minutes}', String(currentBooking.minutesAgo));

    // Get slide animation classes
    const getSlideClasses = () => {
      if (prefersReducedMotion) {
        return isSliding === 'in' ? 'opacity-100' : 'opacity-0';
      }
      switch (isSliding) {
        case 'in':
          return 'translate-y-0 opacity-100';
        case 'out':
          return 'translate-y-full opacity-0';
        default:
          return 'translate-y-full opacity-0';
      }
    };

    return (
      <div
        className={`fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm ${className}`}
        role="status"
        aria-live="polite"
      >
        <div
          className={`
            w-full
            bg-gradient-to-r from-green-600 to-emerald-600
            border border-green-400/30 rounded-xl shadow-2xl shadow-green-900/30
            transform transition-all duration-300
            hover:scale-[1.02] hover:shadow-green-900/50
            group relative
            ${getSlideClasses()}
          `}
        >
          {/* Close button - positioned outside clickable area */}
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 text-white/60 hover:text-white transition-colors z-10"
            aria-label={t('close') || 'Close'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Main clickable content */}
          <button
            type="button"
            className="w-full text-left p-4 pr-10 cursor-pointer"
            onClick={handleClick}
            aria-label={`${currentBooking.name} ${t('socialProofBookedShort')} ${currentBooking.class} ${timeAgoText}. ${t('socialProofClickToBook') || 'Click to book your class'}`}
          >
            <div className="flex items-start gap-3">
              {/* Pulse indicator */}
              <span className="relative flex h-3 w-3 flex-shrink-0 mt-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>

              {/* Booking info - text wraps on mobile */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm sm:text-base leading-snug">
                  <span className="font-bold">{currentBooking.name}</span>{' '}
                  {t('socialProofBookedShort')}{' '}
                  <span className="text-green-100">{currentBooking.class}</span>
                </p>
                <p className="text-green-100/80 text-xs sm:text-sm mt-0.5">{timeAgoText}</p>
              </div>

              {/* Arrow indicator */}
              <svg
                className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    );
  }
);

SocialProofTicker.displayName = 'SocialProofTicker';

export default SocialProofTicker;
