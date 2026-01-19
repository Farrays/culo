/**
 * SkeletonClassCard Component
 * Elaborated skeleton state that mimics ClassCard structure
 *
 * Features:
 * - Shimmer animation effect
 * - Structure matches real ClassCard
 * - Variable widths for realistic appearance
 * - Accessible (hidden from screen readers)
 */

import React, { memo } from 'react';

/**
 * Base skeleton element with shimmer effect
 * Uses pseudo-element for the moving highlight
 */
const SkeletonElement: React.FC<{
  className?: string;
  width?: string;
  height?: string;
}> = memo(({ className = '', width, height }) => (
  <div
    className={`relative overflow-hidden bg-white/5 rounded ${className}`}
    style={{ width, height }}
    aria-hidden="true"
  >
    {/* Shimmer overlay */}
    <div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
      style={{ width: '100%' }}
    />
  </div>
));
SkeletonElement.displayName = 'SkeletonElement';

/**
 * Single skeleton class card matching ClassCard layout
 */
export const SkeletonClassCard: React.FC<{
  /** Variation index for width randomization */
  variant?: number;
}> = memo(({ variant = 0 }) => {
  // Vary widths based on variant for more realistic appearance
  const titleWidths = ['70%', '85%', '60%', '75%', '80%'];
  const detailWidths = ['45%', '50%', '40%', '55%', '48%'];
  const instructorWidths = ['35%', '40%', '30%', '45%', '38%'];

  const titleWidth = titleWidths[variant % titleWidths.length];
  const detailWidth = detailWidths[variant % detailWidths.length];
  const instructorWidth = instructorWidths[variant % instructorWidths.length];

  return (
    <div
      className="w-full p-4 rounded-2xl border-2 border-white/5 bg-white/[0.02]"
      aria-hidden="true"
      role="presentation"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        {/* Main content area */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Class name skeleton */}
          <SkeletonElement className="h-5 rounded-lg" width={titleWidth} />

          {/* Class details row - date, time, duration */}
          <div className="flex flex-wrap gap-3">
            {/* Date with icon */}
            <div className="flex items-center gap-1.5">
              <SkeletonElement className="w-4 h-4 rounded" />
              <SkeletonElement className="h-4 rounded" width={detailWidth} />
            </div>
            {/* Time with icon */}
            <div className="flex items-center gap-1.5">
              <SkeletonElement className="w-4 h-4 rounded" />
              <SkeletonElement className="h-4 w-12 rounded" />
            </div>
            {/* Duration */}
            <SkeletonElement className="h-4 w-10 rounded" />
          </div>

          {/* Instructor row */}
          <div className="flex items-center gap-1.5">
            <SkeletonElement className="w-4 h-4 rounded" />
            <SkeletonElement className="h-4 rounded" width={instructorWidth} />
          </div>
        </div>

        {/* Action buttons skeleton */}
        <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* +info button skeleton */}
            <SkeletonElement className="w-12 h-6 rounded-lg" />
            {/* Share button skeleton */}
            <SkeletonElement className="w-8 h-8 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
});
SkeletonClassCard.displayName = 'SkeletonClassCard';

/**
 * Group of skeleton cards for loading state
 */
export const SkeletonClassList: React.FC<{
  /** Number of skeleton cards to show */
  count?: number;
}> = memo(({ count = 4 }) => (
  <div className="space-y-4" aria-hidden="true" role="presentation">
    {Array.from({ length: count }, (_, i) => (
      <SkeletonClassCard key={i} variant={i} />
    ))}
  </div>
));
SkeletonClassList.displayName = 'SkeletonClassList';

/**
 * Skeleton for filter bar
 */
export const SkeletonFilterBar: React.FC = memo(() => (
  <div className="flex flex-wrap gap-2" aria-hidden="true" role="presentation">
    {/* Style filter */}
    <SkeletonElement className="h-10 w-32 rounded-xl" />
    {/* Level filter */}
    <SkeletonElement className="h-10 w-28 rounded-xl" />
    {/* Day filter */}
    <SkeletonElement className="h-10 w-24 rounded-xl" />
    {/* Instructor filter */}
    <SkeletonElement className="h-10 w-36 rounded-xl" />
  </div>
));
SkeletonFilterBar.displayName = 'SkeletonFilterBar';

/**
 * Skeleton for week navigation
 */
export const SkeletonWeekNavigation: React.FC = memo(() => (
  <div
    className="flex items-center justify-between gap-4 py-3"
    aria-hidden="true"
    role="presentation"
  >
    {/* Previous button */}
    <SkeletonElement className="w-10 h-10 rounded-xl" />
    {/* Week label */}
    <SkeletonElement className="h-6 w-48 rounded-lg" />
    {/* Next button */}
    <SkeletonElement className="w-10 h-10 rounded-xl" />
  </div>
));
SkeletonWeekNavigation.displayName = 'SkeletonWeekNavigation';

/**
 * Full page skeleton combining all elements
 */
export const SkeletonClassListStep: React.FC<{
  /** Number of class cards to show */
  cardCount?: number;
}> = memo(({ cardCount = 4 }) => (
  <div className="animate-fade-in space-y-4" aria-hidden="true" role="presentation">
    {/* Title skeleton */}
    <div className="flex justify-center">
      <SkeletonElement className="h-8 w-48 rounded-lg" />
    </div>

    {/* Filter bar skeleton */}
    <SkeletonFilterBar />

    {/* Week navigation skeleton */}
    <SkeletonWeekNavigation />

    {/* Class list skeleton */}
    <SkeletonClassList count={cardCount} />
  </div>
));
SkeletonClassListStep.displayName = 'SkeletonClassListStep';

export default SkeletonClassCard;
