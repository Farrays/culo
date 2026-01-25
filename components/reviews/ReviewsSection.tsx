/**
 * ReviewsSection Component
 * Displays a section of Google reviews styled like TestimonialsSection
 * No external links - keeps users on site
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useReviews, useGoogleBusinessStats } from '../../hooks/useReviews';
import type { DanceCategory } from '../../constants/reviews-data';
import AnimateOnScroll from '../AnimateOnScroll';
import ReviewCard from './ReviewCard';

interface ReviewsSectionProps {
  category?: DanceCategory | DanceCategory[];
  teacher?: string;
  limit?: number;
  showGoogleBadge?: boolean;
  layout?: 'carousel' | 'grid' | 'list';
  title?: string;
  subtitle?: string;
  showCategory?: boolean;
  className?: string;
  id?: string;
  /** Curated list of author names - when provided, shows ONLY these reviews */
  selectedAuthors?: string[];
}

// Google Badge (no external link)
const GoogleRatingBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation([
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
  const googleStats = useGoogleBusinessStats();

  return (
    <div
      className={`
        inline-flex flex-col items-center
        ${className}
      `}
    >
      {/* EXCELENTE */}
      <div className="mb-4 text-3xl font-black text-neutral">{t('excellent')}</div>

      {/* Stars */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className="w-8 h-8 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      {/* Review count */}
      <div className="text-sm text-neutral/70">
        {t('basedOnReviews', { count: `${googleStats.totalReviews}+` })}
      </div>
      <div className="mt-2 text-xs text-neutral/70">{t('reviews_google')}</div>
    </div>
  );
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  category,
  teacher,
  limit = 6,
  showGoogleBadge = true,
  layout = 'grid',
  title,
  subtitle: _subtitle,
  showCategory = false,
  className = '',
  id = 'reviews',
  selectedAuthors,
}) => {
  const { t } = useTranslation([
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
  const { reviews } = useReviews({
    category,
    teacher,
    limit: selectedAuthors ? undefined : limit, // No limit when curated
    shuffle: !selectedAuthors, // Don't shuffle curated reviews
    minTextLength: selectedAuthors ? 0 : 50, // Allow all text lengths when curated
    selectedAuthors,
  });

  // Default title
  const sectionTitle =
    title || t('reviewsSectionTitle') || 'Testimonios No Solicitados de Nuestros Socios';

  if (reviews.length === 0) {
    return null;
  }

  // Grid layout based on number of reviews (matching TestimonialsSection)
  const getGridClass = () => {
    if (reviews.length === 1) return 'grid-cols-1 max-w-lg';
    if (reviews.length === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-3xl';
    if (reviews.length === 3) return 'grid-cols-1 md:grid-cols-3 max-w-5xl';
    if (reviews.length === 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl';
    if (reviews.length === 5) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl';
  };

  return (
    <section
      id={id}
      className={`py-10 md:py-14 bg-black overflow-hidden ${className}`}
      aria-labelledby="reviews-title"
    >
      <div className="container mx-auto px-6">
        {/* Header - matching TestimonialsSection style */}
        <AnimateOnScroll>
          <div className="text-center mb-8">
            <h2
              id="reviews-title"
              className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
              data-speakable="true"
            >
              {sectionTitle}
            </h2>
            {showGoogleBadge && <GoogleRatingBadge />}
          </div>
        </AnimateOnScroll>

        {/* Reviews Grid - matching TestimonialsSection grid */}
        {layout === 'grid' && (
          <div className={`grid gap-6 sm:gap-8 mx-auto ${getGridClass()}`}>
            {reviews.map((review, index) => (
              <AnimateOnScroll key={review.id} delay={index * 100} className="[perspective:1000px]">
                <ReviewCard review={review} variant="compact" showCategory={showCategory} />
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* Reviews List */}
        {layout === 'list' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {reviews.map((review, index) => (
              <AnimateOnScroll key={review.id} delay={index * 100} className="[perspective:1000px]">
                <ReviewCard review={review} variant="full" showCategory={showCategory} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
export { GoogleRatingBadge };
