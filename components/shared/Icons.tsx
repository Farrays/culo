import React from 'react';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const StarIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg
    className={`${sizeMap[size]} ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg
    className={`${sizeMap[size]} ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg
    className={`${sizeMap[size]} ${className}`}
    fill="currentColor"
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg
    className={`${sizeMap[size]} ${className}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
  </svg>
);

export const FlameIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg
    className={`${sizeMap[size]} ${className}`}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 2c1.5 2.5 3 5.5 3 8.5 0 3.5-2.5 6.5-6 6.5s-6-3-6-6.5c0-3 1.5-6 3-8.5 0 3 1.5 5 3 5s3-2 3-5zm0 15c2.21 0 4-1.79 4-4 0-1.5-1-3.5-2-5-.5 1.5-1.5 2.5-2 2.5s-1.5-1-2-2.5c-1 1.5-2 3.5-2 5 0 2.21 1.79 4 4 4z" />
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ className = '', size = 'md' }) => (
  <svg
    className={`${sizeMap[size]} ${className}`}
    fill="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// Star rating component for reuse
interface StarRatingProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  count = 5,
  size = 'md',
  className = 'text-yellow-400',
  label = '5 de 5 estrellas',
}) => (
  <div className="flex" role="img" aria-label={label}>
    {[...Array(count)].map((_, i) => (
      <StarIcon key={i} className={className} size={size} />
    ))}
  </div>
);
