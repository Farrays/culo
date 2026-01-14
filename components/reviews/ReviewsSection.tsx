/**
 * ReviewsSection Component
 * Displays a section of Google reviews with optional filtering and layouts
 */

import React from 'react';
import { useI18n } from '../../hooks/useI18n';
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
}

// Google Reviews Badge Component
const GoogleReviewsBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  const googleStats = useGoogleBusinessStats();

  return (
    <a
      href={googleStats.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-3 px-5 py-3
        bg-white/10 backdrop-blur-md rounded-full
        border border-white/20 hover:border-primary-accent/50
        transition-all duration-300 hover:scale-105
        ${className}
      `}
      aria-label={`Ver ${googleStats.totalReviews} reseñas en Google`}
    >
      {/* Google Logo */}
      <svg className="w-6 h-6" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>

      {/* Rating */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-white font-bold">{googleStats.averageRating.toFixed(1)}</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map(star => (
              <svg
                key={star}
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <span className="text-neutral/70 text-xs">{googleStats.totalReviews}+ reseñas</span>
      </div>
    </a>
  );
};

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  category,
  teacher,
  limit = 6,
  showGoogleBadge = true,
  layout = 'grid',
  title,
  subtitle,
  showCategory = false,
  className = '',
  id = 'reviews',
}) => {
  const { t } = useI18n();
  const { reviews } = useReviews({
    category,
    teacher,
    limit,
    shuffle: true,
    minTextLength: 50,
  });

  // Default title and subtitle
  const sectionTitle = title || t('reviewsSectionTitle') || 'Lo que dicen nuestros alumnos';
  const sectionSubtitle =
    subtitle || t('reviewsSectionSubtitle') || 'Reseñas verificadas de Google';

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      className={`py-12 md:py-16 bg-black overflow-hidden ${className}`}
      aria-labelledby="reviews-title"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2
              id="reviews-title"
              className="text-3xl md:text-4xl font-black tracking-tighter text-white mb-4 holographic-text"
            >
              {sectionTitle}
            </h2>
            <p className="text-neutral/80 mb-6 max-w-2xl mx-auto">{sectionSubtitle}</p>
            {showGoogleBadge && <GoogleReviewsBadge className="mx-auto" />}
          </div>
        </AnimateOnScroll>

        {/* Reviews Grid */}
        {layout === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <AnimateOnScroll key={review.id} delay={index * 100}>
                <ReviewCard review={review} variant="compact" showCategory={showCategory} />
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* Reviews List */}
        {layout === 'list' && (
          <div className="max-w-3xl mx-auto space-y-6">
            {reviews.map((review, index) => (
              <AnimateOnScroll key={review.id} delay={index * 100}>
                <ReviewCard review={review} variant="full" showCategory={showCategory} />
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* CTA to Google Reviews */}
        <AnimateOnScroll delay={reviews.length * 100 + 200}>
          <div className="text-center mt-10">
            <a
              href="https://g.page/r/CWBvYu8J9aJAEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-accent hover:text-white transition-colors font-medium"
            >
              Ver todas las reseñas en Google
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ReviewsSection;
export { GoogleReviewsBadge };
