/**
 * ReviewCard Component
 * Displays a single Google review with rating, author, and text
 */

import React, { useState } from 'react';
import type { GoogleReview } from '../../constants/reviews-data';

interface ReviewCardProps {
  review: GoogleReview;
  variant?: 'compact' | 'full';
  showCategory?: boolean;
  className?: string;
}

// Generate initials from author name
function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(n => n.length > 0)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Avatar gradient colors
const AVATAR_COLORS = [
  'from-primary-accent to-primary-dark',
  'from-rose-500 to-rose-700',
  'from-amber-500 to-amber-700',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-cyan-500 to-cyan-700',
  'from-pink-500 to-pink-700',
];

// Get consistent color based on author name
function getAvatarColor(name: string): string {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hash % AVATAR_COLORS.length;
  return AVATAR_COLORS[colorIndex] ?? 'from-primary-accent to-primary-dark';
}

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
  'salsa-cubana': 'Salsa',
  bachata: 'Bachata',
  'heels-femmology': 'Heels',
  urbanas: 'Urbanas',
  contemporaneo: 'Contemporáneo',
  afro: 'Afro',
  fitness: 'Fitness',
  general: 'General',
};

// Star rating component
function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  variant = 'compact',
  showCategory = false,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = variant === 'compact' ? 150 : 300;
  const shouldTruncate = review.text.length > maxLength;

  const displayText =
    shouldTruncate && !isExpanded ? review.text.slice(0, maxLength) + '...' : review.text;

  const primaryCategory = review.categories[0] || 'general';

  return (
    <article
      className={`
        bg-black/60 backdrop-blur-md border border-primary-dark/50 rounded-xl p-6
        hover:border-primary-accent/50 transition-all duration-300
        ${className}
      `}
    >
      {/* Header: Avatar + Author Info */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div
          className={`
            flex-shrink-0 w-12 h-12 rounded-full
            bg-gradient-to-br ${getAvatarColor(review.author)}
            flex items-center justify-center
          `}
        >
          <span className="text-white font-bold text-lg">{getInitials(review.author)}</span>
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-neutral truncate">{review.author}</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={review.rating} />
            <span className="text-neutral/60 text-sm">{review.date}</span>
          </div>
          {review.authorInfo && (
            <p className="text-neutral/50 text-xs mt-1 truncate">{review.authorInfo}</p>
          )}
        </div>

        {/* Category Badge */}
        {showCategory && primaryCategory !== 'general' && (
          <span className="flex-shrink-0 px-2 py-1 bg-primary-accent/20 border border-primary-accent/40 rounded text-xs text-primary-accent font-medium">
            {CATEGORY_LABELS[primaryCategory]}
          </span>
        )}
      </div>

      {/* Review Text */}
      <p className="text-neutral/90 leading-relaxed">
        {displayText}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 text-primary-accent hover:text-primary-accent/80 text-sm font-medium transition-colors"
          >
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </p>

      {/* Google Attribution */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary-dark/30">
        <svg className="w-4 h-4 text-neutral/60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span className="text-neutral/50 text-xs">Reseña de Google</span>
      </div>
    </article>
  );
};

export default ReviewCard;
