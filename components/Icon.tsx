import React from 'react';

/**
 * Icon Component - Uses SVG Sprite for optimal performance
 *
 * Benefits:
 * - Reduces bundle size (icons defined once in sprite.svg)
 * - Better browser caching
 * - Easier maintenance
 * - Supports all SVG props (className, style, etc.)
 *
 * Available icons:
 * - globe, sparkles, building, star, trophy, academic-cap
 * - chart-bar, map-pin, clock, badge-check
 * - heart, users, calendar, gift, cake
 */

export type IconName =
  | 'globe'
  | 'sparkles'
  | 'building'
  | 'star'
  | 'trophy'
  | 'academic-cap'
  | 'chart-bar'
  | 'map-pin'
  | 'clock'
  | 'badge-check'
  | 'heart'
  | 'users'
  | 'calendar'
  | 'gift'
  | 'cake';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg">
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  );
};

export default Icon;
