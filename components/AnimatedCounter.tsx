import React, { useEffect, useState, memo } from 'react';
import {
  useSharedIntersectionObserver,
  OBSERVER_CONFIGS,
} from '../hooks/useSharedIntersectionObserver';

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
  const [ref, isVisible] = useSharedIntersectionObserver<HTMLDivElement>(OBSERVER_CONFIGS.counter);

  useEffect(() => {
    if (!isVisible || hasAnimated) return;

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
  }, [isVisible, target, duration, hasAnimated]);

  return (
    <div ref={ref} className={className}>
      {count}
      {suffix}
    </div>
  );
});

export default AnimatedCounter;
