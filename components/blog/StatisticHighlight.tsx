/**
 * StatisticHighlight Component
 *
 * Displays a prominent statistic with source citation.
 * Optimized for GEO - AI search engines love citable statistics.
 */

import React from 'react';
import AnimateOnScroll from '../AnimateOnScroll';

interface StatisticHighlightProps {
  /** The statistic value (e.g., "400", "76%", "10x") */
  value: string;
  /** Description/label for the statistic */
  label: string;
  /** Source citation for credibility */
  source?: string;
  /** Animation delay in ms */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

const StatisticHighlight: React.FC<StatisticHighlightProps> = ({
  value,
  label,
  source,
  delay = 0,
  className = '',
}) => {
  return (
    <AnimateOnScroll delay={delay}>
      <div
        className={`relative p-8 my-8 bg-gradient-to-br from-primary-dark/30 to-black
                    border border-primary-accent/40 rounded-2xl overflow-hidden ${className}`}
      >
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10 text-center">
          {/* Value */}
          <div
            className="text-5xl md:text-6xl lg:text-7xl font-black text-primary-accent
                       mb-4 tracking-tight"
          >
            {value}
          </div>

          {/* Label */}
          <p className="text-lg md:text-xl text-neutral/90 leading-relaxed max-w-xl mx-auto">
            {label}
          </p>

          {/* Source citation */}
          {source && <p className="mt-4 text-sm text-neutral/60 italic">— {source}</p>}
        </div>
      </div>
    </AnimateOnScroll>
  );
};

export default StatisticHighlight;
