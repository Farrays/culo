/**
 * SocialProofTicker Component
 *
 * Displays recent real bookings in an animated ticker format:
 * "María reservó Bachata hace 2 min"
 *
 * Features:
 * - Fetches real booking data from /api/social-proof
 * - Rotates through recent bookings with smooth animations
 * - Auto-refreshes every 60 seconds
 * - Respects reduced motion preferences
 * - Hides automatically if no recent bookings
 * - Analytics tracking for visibility and clicks (Enterprise)
 * - Click-through to scroll to booking content (Enterprise)
 */

import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useI18n } from '../../../hooks/useI18n';
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

// Rotation interval: 5 seconds between bookings
const ROTATION_INTERVAL = 5 * 1000;

// Animation duration
const ANIMATION_DURATION = 500;

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
    const { t } = useI18n();
    const [bookings, setBookings] = useState<SocialProofBooking[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const hasTrackedImpression = useRef(false);
    const impressionCount = useRef(0);

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Track impression when ticker becomes visible (only once per session)
    useEffect(() => {
      if (isVisible && !hasTrackedImpression.current && bookings.length > 0) {
        hasTrackedImpression.current = true;
        impressionCount.current = bookings.length;
        trackEvent('social_proof_impression', {
          event_category: 'engagement',
          event_label: 'social_proof_ticker',
          booking_count: bookings.length,
          first_booking_class: bookings[0]?.class || 'unknown',
        });
      }
    }, [isVisible, bookings]);

    // Handle click with analytics
    const handleClick = useCallback(() => {
      // Track click event
      const currentBooking = bookings[currentIndex];
      trackEvent('social_proof_click', {
        event_category: 'engagement',
        event_label: 'social_proof_ticker',
        booking_class: currentBooking?.class || 'unknown',
        booking_minutes_ago: currentBooking?.minutesAgo || 0,
      });

      // Execute callback if provided
      onClick?.();

      // Scroll to target element
      if (scrollTargetId) {
        const targetElement = document.getElementById(scrollTargetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetElement.focus({ preventScroll: true });
        }
      }
    }, [bookings, currentIndex, onClick, scrollTargetId]);

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
          if (!isVisible) {
            setIsVisible(true);
            onShow?.();
          }
        } else {
          setBookings([]);
          if (isVisible) {
            setIsVisible(false);
            onHide?.();
          }
        }
      } catch (err) {
        console.warn('Social proof fetch error:', err);
        // Don't hide on error - keep showing old data if available
      }
    }, [limit, isVisible, onShow, onHide]);

    // Initial fetch and refresh interval
    useEffect(() => {
      fetchBookings();

      const intervalId = setInterval(fetchBookings, REFRESH_INTERVAL);

      return () => clearInterval(intervalId);
    }, [fetchBookings]);

    // Rotate through bookings
    useEffect(() => {
      if (bookings.length <= 1) return;

      const rotateId = setInterval(() => {
        if (!prefersReducedMotion) {
          setIsAnimating(true);
          setTimeout(() => {
            setCurrentIndex(prev => (prev + 1) % bookings.length);
            setIsAnimating(false);
          }, ANIMATION_DURATION);
        } else {
          setCurrentIndex(prev => (prev + 1) % bookings.length);
        }
      }, ROTATION_INTERVAL);

      return () => clearInterval(rotateId);
    }, [bookings.length, prefersReducedMotion]);

    // Don't render if no bookings or hidden
    if (!isVisible || bookings.length === 0) {
      return null;
    }

    const currentBooking = bookings[currentIndex];
    if (!currentBooking) return null;

    // Format the time ago text
    const timeAgoText =
      currentBooking.minutesAgo <= 1
        ? t('socialProofJustNow')
        : t('socialProofMinutesAgo').replace('{minutes}', String(currentBooking.minutesAgo));

    // Format the booking text
    const bookingText = t('socialProofBooked')
      .replace('{name}', currentBooking.name)
      .replace('{className}', currentBooking.class);

    return (
      <button
        type="button"
        className={`social-proof-ticker w-full text-left ${className}`}
        onClick={handleClick}
        aria-label={`${bookingText} ${timeAgoText}. ${t('socialProofClickToBook') || 'Click to book your class'}`}
      >
        <div
          className={`
            flex items-center gap-2 px-3 py-2
            bg-gradient-to-r from-green-500/10 to-emerald-500/10
            border border-green-500/20 rounded-lg
            text-sm text-green-400
            transition-all duration-300
            hover:from-green-500/20 hover:to-emerald-500/20
            hover:border-green-500/40 hover:scale-[1.02]
            cursor-pointer group
            ${isAnimating ? 'opacity-0 transform -translate-y-2' : 'opacity-100 transform translate-y-0'}
          `}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Pulse indicator */}
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>

          {/* Booking info */}
          <span className="flex-1 truncate">
            <span className="font-medium">{bookingText}</span>
            <span className="text-green-400/70 ml-1">• {timeAgoText}</span>
          </span>

          {/* Arrow indicator on hover */}
          <svg
            className="w-4 h-4 text-green-400/50 group-hover:text-green-400 group-hover:translate-x-0.5 transition-all flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
    );
  }
);

SocialProofTicker.displayName = 'SocialProofTicker';

export default SocialProofTicker;
