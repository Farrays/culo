import { describe, it, expect } from 'vitest';
import { imageUrls, getImageUrl } from '../imageConfig';

describe('imageUrls', () => {
  it('has classes category with all expected keys', () => {
    expect(imageUrls.classes).toBeDefined();
    expect(imageUrls.classes.latin).toBeDefined();
    expect(imageUrls.classes.urban).toBeDefined();
    expect(imageUrls.classes.fitness).toBeDefined();
    expect(imageUrls.classes.contemporaryJazz).toBeDefined();
    expect(imageUrls.classes.world).toBeDefined();
    expect(imageUrls.classes.morning).toBeDefined();
  });

  it('has teachers category with all expected keys', () => {
    expect(imageUrls.teachers).toBeDefined();
    expect(imageUrls.teachers.isabellaKing).toBeDefined();
    expect(imageUrls.teachers.davidAdeleke).toBeDefined();
    expect(imageUrls.teachers.carlosRodriguez).toBeDefined();
  });

  it('has testimonials category with all expected keys', () => {
    expect(imageUrls.testimonials).toBeDefined();
    expect(imageUrls.testimonials.marcoV).toBeDefined();
    expect(imageUrls.testimonials.chloeB).toBeDefined();
    expect(imageUrls.testimonials.fatouD).toBeDefined();
    expect(imageUrls.testimonials.liamS).toBeDefined();
    expect(imageUrls.testimonials.sofiaR).toBeDefined();
    expect(imageUrls.testimonials.miguelA).toBeDefined();
  });

  it('has videoPosters category with all expected keys', () => {
    expect(imageUrls.videoPosters).toBeDefined();
    expect(imageUrls.videoPosters.yunaisyPerformance).toBeDefined();
    expect(imageUrls.videoPosters.finalCta).toBeDefined();
    expect(imageUrls.videoPosters.bachata).toBeDefined();
    expect(imageUrls.videoPosters.dancehall).toBeDefined();
  });

  it('all URLs are valid Unsplash URLs', () => {
    const checkUrl = (url: string) => {
      expect(url).toMatch(/^https:\/\/images\.unsplash\.com\//);
    };

    Object.values(imageUrls.classes).forEach(checkUrl);
    Object.values(imageUrls.teachers).forEach(checkUrl);
    Object.values(imageUrls.testimonials).forEach(checkUrl);
    Object.values(imageUrls.videoPosters).forEach(checkUrl);
  });

  it('all URLs have proper query parameters', () => {
    const checkUrlParams = (url: string) => {
      expect(url).toContain('auto=format');
      expect(url).toContain('fit=crop');
      expect(url).toContain('q=80');
    };

    Object.values(imageUrls.classes).forEach(checkUrlParams);
    Object.values(imageUrls.teachers).forEach(checkUrlParams);
    Object.values(imageUrls.testimonials).forEach(checkUrlParams);
    Object.values(imageUrls.videoPosters).forEach(checkUrlParams);
  });
});

describe('getImageUrl', () => {
  it('returns correct URL for valid category and name', () => {
    const result = getImageUrl('classes', 'latin');
    expect(result).toBe(imageUrls.classes.latin);
  });

  it('returns correct URL for teachers category', () => {
    const result = getImageUrl('teachers', 'isabellaKing');
    expect(result).toBe(imageUrls.teachers.isabellaKing);
  });

  it('returns correct URL for testimonials category', () => {
    const result = getImageUrl('testimonials', 'marcoV');
    expect(result).toBe(imageUrls.testimonials.marcoV);
  });

  it('returns correct URL for videoPosters category', () => {
    const result = getImageUrl('videoPosters', 'bachata');
    expect(result).toBe(imageUrls.videoPosters.bachata);
  });

  it('returns empty string for non-existent name', () => {
    const result = getImageUrl('classes', 'nonexistent');
    expect(result).toBe('');
  });

  it('returns empty string for invalid name in category', () => {
    const result = getImageUrl('teachers', 'unknownTeacher');
    expect(result).toBe('');
  });
});
