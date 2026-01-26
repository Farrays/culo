/**
 * ReviewCard Component
 * Displays a single Google review styled like TestimonialsSection cards
 * Now with enterprise-level i18n support for curated reviews
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getReviewText, hasTranslation } from '../../hooks/useReviews';
import type { GoogleReview } from '../../constants/reviews-data';
import type { Locale } from '../../types';

interface ReviewCardProps {
  review: GoogleReview;
  variant?: 'compact' | 'full';
  showCategory?: boolean;
  className?: string;
}

// Category keys mapping to i18n keys
const CATEGORY_KEYS: Record<string, string> = {
  'salsa-cubana': 'reviews_category_salsa',
  bachata: 'reviews_category_bachata',
  'heels-femmology': 'reviews_category_heels',
  urbanas: 'reviews_category_urbanas',
  contemporaneo: 'reviews_category_contemporaneo',
  afro: 'reviews_category_afro',
  fitness: 'reviews_category_fitness',
  general: 'reviews_category_general',
};

// Star rating component
function StarRating({ rating = 5, ariaLabel }: { rating?: number; ariaLabel: string }) {
  return (
    <div className="flex gap-0.5" aria-label={ariaLabel}>
      {[1, 2, 3, 4, 5].map(star => (
        <svg
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
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
  const { t, i18n } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);
  const locale = i18n.language as Locale;
  const [isExpanded, setIsExpanded] = useState(false);

  // Get translated text if available for current locale
  const reviewText = getReviewText(review, locale);
  const isTranslated = hasTranslation(review.id) && locale !== 'es';

  const maxLength = variant === 'compact' ? 180 : 300;
  const shouldTruncate = reviewText.length > maxLength;

  const displayText =
    shouldTruncate && !isExpanded ? reviewText.slice(0, maxLength) + '...' : reviewText;

  const primaryCategory = review.categories[0] || 'general';
  const categoryKey = CATEGORY_KEYS[primaryCategory] || 'reviews_category_general';

  return (
    <article
      className={`
        flex flex-col h-full min-h-[180px] p-5 sm:p-6
        bg-black/50 backdrop-blur-md
        border border-primary-dark/50 rounded-xl shadow-lg
        transition-all duration-500 [transform-style:preserve-3d]
        hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)]
        hover:border-primary-accent hover:shadow-accent-glow
        ${className}
      `}
    >
      {/* Stars */}
      <div className="flex mb-3">
        <StarRating
          rating={review.rating}
          ariaLabel={t('reviews_starRating', { rating: review.rating })}
        />
      </div>

      {/* Review Text */}
      <blockquote className="flex-grow text-neutral/90 mb-4">
        <p className="text-sm leading-relaxed">
          &ldquo;{displayText}&rdquo;
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 text-primary-accent hover:text-primary-accent/80 text-sm font-medium transition-colors"
            >
              {isExpanded ? t('reviews_seeLess') : t('reviews_seeMore')}
            </button>
          )}
        </p>
      </blockquote>

      {/* Footer: Author + Category */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-primary-dark/30">
        <div>
          <cite className="font-bold text-neutral not-italic text-sm">{review.author}</cite>
          {isTranslated && (
            <span className="block text-xs text-neutral/50 mt-0.5">
              {t('reviews_translatedFrom')}
            </span>
          )}
        </div>

        {/* Category Badge */}
        {showCategory && primaryCategory !== 'general' && (
          <span className="flex-shrink-0 px-2 py-1 bg-primary-accent/20 border border-primary-accent/40 rounded text-xs text-primary-accent font-medium">
            {t(categoryKey)}
          </span>
        )}
      </div>
    </article>
  );
};

export default ReviewCard;
