/**
 * ArticleSummaryBox Component
 *
 * TL;DR box at the beginning of articles.
 * Critical for GEO - provides quick, scannable key points
 * that AI search engines can easily extract and cite.
 */

import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import { ClockIcon } from '../../lib/icons';
import AnimateOnScroll from '../AnimateOnScroll';

interface StatHighlight {
  value: string;
  labelKey: string;
  source?: string;
}

interface ArticleSummaryBoxProps {
  /** i18n keys for summary bullet points */
  bulletKeys: string[];
  /** Reading time in minutes */
  readingTime: number;
  /** Key statistics to highlight with holographic styling */
  stats?: StatHighlight[];
  /** Animation delay in ms */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

const ArticleSummaryBox: React.FC<ArticleSummaryBoxProps> = ({
  bulletKeys,
  readingTime,
  stats,
  delay = 0,
  className = '',
}) => {
  const { t } = useI18n();

  return (
    <AnimateOnScroll delay={delay}>
      <div
        className={`relative p-6 md:p-8 mb-10
                    bg-gradient-to-br from-primary-dark/40 to-black/60
                    backdrop-blur-md border border-primary-accent/30
                    rounded-2xl overflow-hidden ${className}`}
        id="article-summary"
      >
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 w-1 h-full bg-primary-accent" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-primary-accent">{t('blog_summary')}</h2>
          <div className="flex items-center gap-2 text-neutral/70">
            <ClockIcon className="w-5 h-5" />
            <span className="text-sm font-medium">
              {t('blog_readingTime').replace('{minutes}', String(readingTime))}
            </span>
          </div>
        </div>

        {/* Key Points */}
        <ul className="space-y-4">
          {bulletKeys.map((key, index) => (
            <li key={key} className="flex items-start gap-3 text-neutral/90">
              {/* Bullet number */}
              <span
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center
                           bg-primary-accent/20 text-primary-accent text-sm font-bold
                           rounded-full"
              >
                {index + 1}
              </span>
              {/* Text */}
              <span className="text-lg leading-relaxed">{t(key)}</span>
            </li>
          ))}
        </ul>

        {/* Statistics Cards with Holographic Effect */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative p-5 bg-gradient-to-br from-primary-dark/60 to-black/80
                           border border-primary-accent/50 rounded-xl overflow-hidden
                           hover:border-primary-accent transition-all duration-300"
              >
                {/* Glow effect */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-accent/20 rounded-full blur-2xl" />

                {/* Value with white color */}
                <div className="relative z-10 text-center">
                  <div className="text-white text-4xl md:text-5xl font-black mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-neutral/80 leading-snug">{t(stat.labelKey)}</p>
                  {stat.source && (
                    <p className="mt-2 text-xs text-neutral/50 italic">{stat.source}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimateOnScroll>
  );
};

export default ArticleSummaryBox;
