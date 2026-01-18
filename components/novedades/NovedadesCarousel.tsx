/**
 * NovedadesCarousel - Enterprise Carousel Component
 * ==================================================
 * "Últimas Novedades" carousel for homepage
 *
 * Features:
 * - CSS scroll-snap for native smooth scrolling
 * - Keyboard navigation (Arrow keys)
 * - Touch/swipe native support
 * - Auto-play with pause on hover/focus
 * - ARIA compliant for screen readers
 * - Respects prefers-reduced-motion
 * - Lazy loading with adjacent preload
 * - Progress indicators (dots)
 * - Navigation arrows
 */

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';
import NovedadCard from './NovedadCard';
import { getActiveNovedades } from '../../constants/novedades-data';
import type { Novedad } from '../../types/novedad';

interface NovedadesCarouselProps {
  /** Auto-play interval in ms (0 to disable) */
  autoPlayInterval?: number;
  /** Show navigation arrows */
  showArrows?: boolean;
  /** Show dot indicators */
  showDots?: boolean;
  /** Maximum items to display */
  maxItems?: number;
}

const NovedadesCarousel: React.FC<NovedadesCarouselProps> = ({
  autoPlayInterval = 5000,
  showArrows = true,
  showDots = true,
  maxItems = 6,
}) => {
  const { t } = useI18n();
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Get active novedades
  const novedades: Novedad[] = useMemo(() => {
    return getActiveNovedades().slice(0, maxItems);
  }, [maxItems]);

  // Calculate visible range for lazy loading (current + adjacent)
  const visibleRange = useMemo((): [number, number] => {
    return [Math.max(0, currentIndex - 1), Math.min(novedades.length - 1, currentIndex + 2)];
  }, [currentIndex, novedades.length]);

  // Handle scroll to update current index
  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const scrollLeft = track.scrollLeft;
    const itemWidth = track.querySelector('article')?.offsetWidth ?? 400;
    const gap = 24; // gap-6 = 24px
    const newIndex = Math.round(scrollLeft / (itemWidth + gap));

    setCurrentIndex(Math.min(Math.max(0, newIndex), novedades.length - 1));
    setIsAtStart(scrollLeft <= 10);
    setIsAtEnd(scrollLeft >= track.scrollWidth - track.clientWidth - 10);
  }, [novedades.length]);

  // Scroll to specific index using scrollLeft (avoids page scroll)
  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;

      const items = track.querySelectorAll('article');
      if (!items[index]) return;

      // Calculate scroll position based on item width + gap
      const itemWidth = items[0]?.offsetWidth ?? 380;
      const gap = 24; // gap-6 = 24px
      const targetScroll = index * (itemWidth + gap);

      track.scrollTo({
        left: targetScroll,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [prefersReducedMotion]
  );

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  }, [currentIndex, scrollToIndex]);

  const scrollNext = useCallback(() => {
    const newIndex = Math.min(novedades.length - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  }, [currentIndex, novedades.length, scrollToIndex]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  // Auto-play effect
  useEffect(() => {
    if (!autoPlayInterval || isPaused || prefersReducedMotion) return;

    const timer = setInterval(() => {
      if (currentIndex >= novedades.length - 1) {
        scrollToIndex(0);
      } else {
        scrollNext();
      }
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [
    autoPlayInterval,
    isPaused,
    prefersReducedMotion,
    currentIndex,
    novedades.length,
    scrollNext,
    scrollToIndex,
  ]);

  // Scroll listener
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    track.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => track.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (novedades.length === 0) {
    return null;
  }

  return (
    <section id="novedades" className="py-12 md:py-16 bg-black" aria-labelledby="novedades-title">
      <div className="container mx-auto px-6 overflow-visible">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center mb-10">
            <h2
              id="novedades-title"
              className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
            >
              {t('novedades_title')}
            </h2>
            <p className="text-lg text-neutral/90 max-w-2xl mx-auto">{t('novedades_subtitle')}</p>
          </div>
        </AnimateOnScroll>

        {/* Carousel Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          {showArrows && novedades.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={scrollPrev}
                disabled={isAtStart}
                aria-label={t('novedades_prev')}
                aria-controls="novedades-track"
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/80 backdrop-blur-sm border border-primary-accent/50 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-accent ${
                  isAtStart
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-primary-accent hover:border-primary-accent hover:scale-110'
                } hidden md:flex -ml-2 lg:-ml-6`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={scrollNext}
                disabled={isAtEnd}
                aria-label={t('novedades_next')}
                aria-controls="novedades-track"
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/80 backdrop-blur-sm border border-primary-accent/50 flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-accent ${
                  isAtEnd
                    ? 'opacity-30 cursor-not-allowed'
                    : 'hover:bg-primary-accent hover:border-primary-accent hover:scale-110'
                } hidden md:flex -mr-2 lg:-mr-6`}
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div
            ref={trackRef}
            id="novedades-track"
            role="list"
            aria-label={t('novedades_carouselLabel')}
            aria-live="polite"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="flex gap-6 overflow-x-auto overflow-y-visible scroll-snap-x-mandatory scrollbar-hide py-4 -mx-6 px-6 md:mx-0 md:px-0 focus:outline-none focus:ring-2 focus:ring-primary-accent/30 rounded-lg"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {novedades.map((novedad, index) => (
              <div key={novedad.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                <AnimateOnScroll delay={index * 100}>
                  <NovedadCard
                    novedad={novedad}
                    shouldLoadImage={index >= visibleRange[0] && index <= visibleRange[1]}
                    index={index}
                    total={novedades.length}
                  />
                </AnimateOnScroll>
              </div>
            ))}
            {/* End spacer for mobile */}
            <div className="flex-shrink-0 w-1 md:hidden" aria-hidden="true" />
          </div>

          {/* Dot Indicators */}
          {showDots && novedades.length > 1 && (
            <div
              role="tablist"
              aria-label={t('novedades_indicators')}
              className="flex justify-center gap-2 mt-6"
            >
              {novedades.map((_, index) => (
                <button
                  key={index}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={t('novedades_goToSlide', { n: index + 1 })}
                  onClick={() => scrollToIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-accent focus:ring-offset-2 focus:ring-offset-black ${
                    index === currentIndex
                      ? 'bg-primary-accent scale-125'
                      : 'bg-neutral/30 hover:bg-neutral/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar (optional - for auto-play visualization) */}
          {autoPlayInterval > 0 && !prefersReducedMotion && (
            <div className="h-1 bg-primary-dark/30 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-primary-accent rounded-full"
                style={{
                  width: `${((currentIndex + 1) / novedades.length) * 100}%`,
                  transition: isPaused ? 'none' : 'width 300ms ease-out',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default NovedadesCarousel;
