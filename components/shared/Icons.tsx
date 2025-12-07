// Re-export all icons from centralized library for backwards compatibility
// This file can be removed once all imports are updated to use '../lib/icons' directly
export {
  StarIcon,
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  HeartFilledIcon,
  StarRating,
  UserIcon,
} from '../../lib/icons';

// PlayIcon - not in centralized library, add inline for now
import React from 'react';

export const PlayIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
  </svg>
);
