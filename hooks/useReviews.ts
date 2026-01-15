/**
 * useReviews Hook
 * Provides filtered Google reviews based on context (category, teacher, etc.)
 */

import { useMemo } from 'react';
import reviewsData from '../data/reviews.json';
import type { DanceCategory, GoogleReview } from '../constants/reviews-data';

// Re-export types for convenience
export type { DanceCategory, GoogleReview };

interface ReviewsData {
  generated: string;
  totalReviews: number;
  averageRating: number;
  reviews: GoogleReview[];
}

interface UseReviewsOptions {
  category?: DanceCategory | DanceCategory[];
  teacher?: string;
  limit?: number;
  shuffle?: boolean;
  minTextLength?: number;
  /** Curated list of author names to show (exact match, case-insensitive) */
  selectedAuthors?: string[];
}

interface UseReviewsResult {
  reviews: GoogleReview[];
  stats: {
    total: number;
    filtered: number;
    avgRating: number;
  };
  isLoading: boolean;
}

// Filter out reviews with invalid authors (responses from owner, emojis, etc.)
function isValidReview(review: GoogleReview): boolean {
  // Author should not be too long (owner responses are very long)
  if (review.author.length > 50) return false;

  // Author should not contain typical response phrases
  const invalidPhrases = [
    'gracias',
    'Farray',
    'abrazo',
    'encanta',
    'alegra',
    'escuela de baile',
    'academia',
    '❤️',
    '🧡',
  ];
  const lowerAuthor = review.author.toLowerCase();
  if (invalidPhrases.some(phrase => lowerAuthor.includes(phrase.toLowerCase()))) {
    return false;
  }

  // Author should have at least 2 characters that are letters
  const letterCount = (review.author.match(/[a-záéíóúüñ]/gi) || []).length;
  if (letterCount < 2) return false;

  // Text should be meaningful
  if (review.text.length < 20) return false;

  return true;
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j] as T;
    shuffled[j] = temp as T;
  }
  return shuffled;
}

/**
 * Hook to get filtered Google reviews
 *
 * @example
 * // Get all reviews
 * const { reviews, stats } = useReviews();
 *
 * @example
 * // Get salsa reviews
 * const { reviews } = useReviews({ category: 'salsa-cubana', limit: 10 });
 *
 * @example
 * // Get reviews mentioning a specific teacher
 * const { reviews } = useReviews({ teacher: 'iroel', shuffle: true });
 */
export function useReviews(options: UseReviewsOptions = {}): UseReviewsResult {
  const {
    category,
    teacher,
    limit,
    shuffle = false,
    minTextLength = 30,
    selectedAuthors,
  } = options;

  const result = useMemo(() => {
    const data = reviewsData as ReviewsData;
    let filtered = data.reviews.filter(isValidReview);

    // If selectedAuthors is provided, use ONLY those reviews (curated mode)
    if (selectedAuthors && selectedAuthors.length > 0) {
      const authorsLower = selectedAuthors.map(a => a.toLowerCase().trim());
      // Find reviews matching selected authors, maintaining the order
      const curatedReviews: GoogleReview[] = [];
      for (const authorName of authorsLower) {
        const review = filtered.find(r => r.author.toLowerCase().trim() === authorName);
        if (review) {
          curatedReviews.push(review);
        }
      }
      return {
        reviews: curatedReviews,
        stats: {
          total: data.totalReviews,
          filtered: curatedReviews.length,
          avgRating: data.averageRating,
        },
        isLoading: false,
      };
    }

    // Filter by minimum text length
    if (minTextLength > 0) {
      filtered = filtered.filter(review => review.text.length >= minTextLength);
    }

    // Filter by category
    if (category) {
      const categories = Array.isArray(category) ? category : [category];

      // If 'general' is included, show all reviews
      if (!categories.includes('general')) {
        filtered = filtered.filter(review =>
          review.categories.some(cat => categories.includes(cat))
        );
      }
    }

    // Filter by teacher
    if (teacher) {
      const teacherLower = teacher.toLowerCase();
      filtered = filtered.filter(review =>
        review.teachers.some(t => t.toLowerCase().includes(teacherLower))
      );
    }

    // Shuffle if requested
    if (shuffle) {
      filtered = shuffleArray(filtered);
    }

    // Limit results
    if (limit && limit > 0) {
      filtered = filtered.slice(0, limit);
    }

    return {
      reviews: filtered,
      stats: {
        total: data.totalReviews,
        filtered: filtered.length,
        avgRating: data.averageRating,
      },
      isLoading: false,
    };
  }, [category, teacher, limit, shuffle, minTextLength, selectedAuthors]);

  return result;
}

/**
 * Get reviews by page URL slug
 */
export function useReviewsByPage(pageSlug: string, limit = 10): UseReviewsResult {
  const categoryMap: Record<string, DanceCategory[]> = {
    'salsa-cubana': ['salsa-cubana'],
    'salsa-barcelona': ['salsa-cubana'],
    'bachata-barcelona': ['bachata'],
    'heels-barcelona': ['heels-femmology'],
    'danzas-urbanas-barcelona': ['urbanas'],
    'hip-hop-barcelona': ['urbanas'],
    'dancehall-barcelona': ['urbanas'],
    'clases-twerk-barcelona': ['urbanas'],
    'danza-contemporanea-barcelona': ['contemporaneo'],
    'afro-dance-barcelona': ['afro'],
    'clases-baile-barcelona': ['general'],
  };

  const category = categoryMap[pageSlug] || ['general'];

  return useReviews({ category, limit, shuffle: true });
}

/**
 * Get featured reviews for homepage
 */
export function useFeaturedReviews(limit = 8): GoogleReview[] {
  const { reviews } = useReviews({ limit: 100, minTextLength: 50 });

  // Sort by text length (longer reviews are usually better)
  const sorted = [...reviews].sort((a, b) => b.text.length - a.text.length);

  // Take top reviews and shuffle them
  return shuffleArray(sorted.slice(0, Math.min(limit * 2, sorted.length))).slice(0, limit);
}

/**
 * Get Google Business Profile stats
 */
export function useGoogleBusinessStats(): {
  url: string;
  totalReviews: number;
  averageRating: number;
  name: string;
} {
  return {
    url: 'https://g.page/r/CWBvYu8J9aJAEBM/review',
    totalReviews: 505,
    averageRating: 5.0,
    name: "Farray's International Dance Center",
  };
}

export default useReviews;
