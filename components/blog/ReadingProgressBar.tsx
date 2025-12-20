/**
 * ReadingProgressBar Component
 *
 * Displays a fixed progress bar at the top of the screen
 * that fills as the user scrolls through the article.
 */

import React, { useState, useEffect } from 'react';

interface ReadingProgressBarProps {
  /** Target element selector to track scroll progress */
  targetSelector?: string;
}

const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({ targetSelector = 'article' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const target = document.querySelector(targetSelector);
      if (!target) {
        // Fallback to document scroll if target not found
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        setProgress(Math.min((scrolled / documentHeight) * 100, 100));
        return;
      }

      const targetRect = target.getBoundingClientRect();
      const targetHeight = target.scrollHeight;
      const windowHeight = window.innerHeight;

      // Calculate how much of the article has been scrolled
      const scrolled = Math.max(0, -targetRect.top);
      const scrollableHeight = targetHeight - windowHeight;

      if (scrollableHeight <= 0) {
        setProgress(100);
        return;
      }

      const percentage = Math.min((scrolled / scrollableHeight) * 100, 100);
      setProgress(percentage);
    };

    // Calculate on mount and scroll
    calculateProgress();
    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [targetSelector]);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-primary-dark/30 z-50"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-gradient-to-r from-primary-accent to-primary-accent/80 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgressBar;
