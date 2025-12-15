import React, { useEffect, useState, useRef, memo } from 'react';

/**
 * Props for the AnimatedCounter component.
 */
interface AnimatedCounterProps {
  /** Target number to count up to */
  target: number;
  /** Animation duration in milliseconds (default: 2000) */
  duration?: number;
  /** Suffix to display after the number (e.g., '+', '%') */
  suffix?: string;
  /** Additional CSS classes */
  className?: string;
}

// Singleton IntersectionObserver for AnimatedCounter
// Uses threshold 0.5 (50% visible) and fires callback only once
type CounterCallback = () => void;
const counterCallbacks = new Map<Element, CounterCallback>();

let sharedCounterObserver: IntersectionObserver | null = null;

const getSharedCounterObserver = (): IntersectionObserver => {
  if (!sharedCounterObserver) {
    sharedCounterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const callback = counterCallbacks.get(entry.target);
            if (callback) {
              callback();
              // Once triggered, unobserve and remove callback
              sharedCounterObserver?.unobserve(entry.target);
              counterCallbacks.delete(entry.target);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
  }
  return sharedCounterObserver;
};

const observeCounter = (element: Element, callback: CounterCallback): void => {
  counterCallbacks.set(element, callback);
  getSharedCounterObserver().observe(element);
};

const unobserveCounter = (element: Element): void => {
  counterCallbacks.delete(element);
  sharedCounterObserver?.unobserve(element);
};

/**
 * Animated counter that counts up from 0 to a target number when visible.
 * Uses a singleton IntersectionObserver for optimal performance.
 * Animation uses easeOutQuart easing for a smooth deceleration effect.
 *
 * @param target - The number to count up to
 * @param duration - Animation duration in ms (default: 2000)
 * @param suffix - Text to show after the number (e.g., '+', '%', 'K')
 * @param className - Additional CSS classes
 *
 * @example
 * ```tsx
 * <AnimatedCounter target={500} suffix="+" />
 * <AnimatedCounter target={98} suffix="%" duration={1500} />
 * <AnimatedCounter target={15} suffix="K" className="text-4xl font-bold" />
 * ```
 */
const AnimatedCounter: React.FC<AnimatedCounterProps> = memo(function AnimatedCounter({
  target,
  duration = 2000,
  suffix = '',
  className = '',
}) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasAnimated) return;

    const startAnimation = () => {
      if (hasAnimated) return;
      setHasAnimated(true);

      const startTime = Date.now();

      const updateCount = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);

        // Easing function para animación más suave
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const currentCount = Math.floor(easeOutQuart * target);
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          setCount(target);
        }
      };

      requestAnimationFrame(updateCount);
    };

    observeCounter(element, startAnimation);

    return () => {
      unobserveCounter(element);
    };
  }, [target, duration, hasAnimated]);

  return (
    <div ref={elementRef} className={className}>
      {count}
      {suffix}
    </div>
  );
});

export default AnimatedCounter;
