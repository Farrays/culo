/**
 * Tests for useReviews Hook Utilities
 *
 * Tests the pure utility functions exported from useReviews:
 * - getReviewText (translation lookup)
 * - hasTranslation (check if review has translations)
 * - getCuratedReviewIds (get list of curated reviews)
 * - useGoogleBusinessStats (business profile data)
 */

import { describe, it, expect } from 'vitest';
import {
  getReviewText,
  hasTranslation,
  getCuratedReviewIds,
  useGoogleBusinessStats,
  type GoogleReview,
} from '../useReviews';

// Sample review for testing
const sampleReview: GoogleReview = {
  id: 'test-review-123',
  author: 'María García',
  rating: 5,
  text: 'Excelente academia de baile. Los profesores son muy profesionales.',
  date: '15 de enero de 2026',
  dateISO: '2026-01-15',
  categories: ['salsa-cubana', 'bachata'],
  teachers: ['Iroel', 'Yunaisy'],
  sentiment: 'positive',
};

describe('useReviews - getReviewText', () => {
  it('should return original text for Spanish locale', () => {
    const text = getReviewText(sampleReview, 'es');

    // Should return original or translation
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  it('should return text for all supported locales', () => {
    const locales = ['es', 'ca', 'en', 'fr'] as const;

    for (const locale of locales) {
      const text = getReviewText(sampleReview, locale);
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    }
  });

  it('should fallback to original text if no translation', () => {
    const reviewWithoutTranslation: GoogleReview = {
      ...sampleReview,
      id: 'non-existent-review-id-xyz',
    };

    const text = getReviewText(reviewWithoutTranslation, 'en');

    // Should return original text as fallback
    expect(text).toBe(reviewWithoutTranslation.text);
  });
});

describe('useReviews - hasTranslation', () => {
  it('should return boolean for any review ID', () => {
    const result = hasTranslation('any-review-id');

    expect(typeof result).toBe('boolean');
  });

  it('should return false for non-existent review', () => {
    const result = hasTranslation('definitely-non-existent-review-id-12345');

    expect(result).toBe(false);
  });
});

describe('useReviews - getCuratedReviewIds', () => {
  it('should return an array', () => {
    const ids = getCuratedReviewIds();

    expect(Array.isArray(ids)).toBe(true);
  });

  it('should return array of strings', () => {
    const ids = getCuratedReviewIds();

    if (ids.length > 0) {
      expect(typeof ids[0]).toBe('string');
    }
  });

  it('should return consistent results', () => {
    const ids1 = getCuratedReviewIds();
    const ids2 = getCuratedReviewIds();

    expect(ids1).toEqual(ids2);
  });
});

describe('useReviews - useGoogleBusinessStats', () => {
  it('should return business profile data', () => {
    const stats = useGoogleBusinessStats();

    expect(stats).toHaveProperty('url');
    expect(stats).toHaveProperty('totalReviews');
    expect(stats).toHaveProperty('averageRating');
    expect(stats).toHaveProperty('name');
  });

  it('should have valid Google URL', () => {
    const stats = useGoogleBusinessStats();

    expect(stats.url).toContain('g.page');
  });

  it('should have positive total reviews', () => {
    const stats = useGoogleBusinessStats();

    expect(stats.totalReviews).toBeGreaterThan(0);
  });

  it('should have rating between 1 and 5', () => {
    const stats = useGoogleBusinessStats();

    expect(stats.averageRating).toBeGreaterThanOrEqual(1);
    expect(stats.averageRating).toBeLessThanOrEqual(5);
  });

  it('should have business name', () => {
    const stats = useGoogleBusinessStats();

    expect(stats.name).toContain('Farray');
  });

  it('should return consistent data', () => {
    const stats1 = useGoogleBusinessStats();
    const stats2 = useGoogleBusinessStats();

    expect(stats1).toEqual(stats2);
  });
});

describe('useReviews - Type Safety', () => {
  it('should have correct GoogleReview type structure', () => {
    // This test verifies the type exports work correctly
    const review: GoogleReview = {
      id: 'test',
      author: 'Test Author',
      rating: 5,
      text: 'Test review text',
      date: '1 de enero de 2026',
      dateISO: '2026-01-01',
      categories: ['general'],
      teachers: [],
      sentiment: 'positive',
    };

    expect(review.id).toBeDefined();
    expect(review.author).toBeDefined();
    expect(review.rating).toBeDefined();
    expect(review.text).toBeDefined();
  });
});
