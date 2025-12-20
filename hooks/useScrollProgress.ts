import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that tracks scroll progress of the page
 * Returns a value between 0 and 100 representing percentage scrolled
 *
 * @param throttleMs - Throttle interval in milliseconds (default: 50)
 * @returns Scroll progress percentage (0-100)
 *
 * @example
 * ```tsx
 * const progress = useScrollProgress();
 * return <div style={{ width: `${progress}%` }} className="progress-bar" />;
 * ```
 */
export function useScrollProgress(_throttleMs = 50): number {
  const [progress, setProgress] = useState(0);

  const calculateProgress = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (scrollHeight <= 0) {
      setProgress(0);
      return;
    }

    const scrolled = Math.min(Math.max((scrollTop / scrollHeight) * 100, 0), 100);
    setProgress(Math.round(scrolled));
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateProgress();
          ticking = false;
        });

        ticking = true;
      }
    };

    // Initial calculation
    calculateProgress();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [calculateProgress]);

  return progress;
}

export default useScrollProgress;
