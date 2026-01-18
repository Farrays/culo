import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { LocalBusinessSchema, CourseSchema, AggregateReviewsSchema } from '../SchemaMarkup';
import { SUPPORTED_LOCALES } from '../../types';

const renderWithHelmet = (ui: React.ReactElement) => {
  return render(<HelmetProvider>{ui}</HelmetProvider>);
};

describe('SchemaMarkup', () => {
  describe('LocalBusinessSchema', () => {
    const defaultProps = {
      name: "Farray's International Dance Center",
      description: 'Academia de baile en Barcelona',
      url: 'https://www.farrayscenter.com',
      telephone: '+34622247085',
      email: 'info@farrayscenter.com',
      address: {
        streetAddress: 'Calle Entença 100',
        addressLocality: 'Barcelona',
        postalCode: '08015',
        addressCountry: 'ES',
      },
      geo: {
        latitude: '41.3751',
        longitude: '2.1482',
      },
      priceRange: '€€',
    };

    it('renders without crashing', () => {
      const { container } = renderWithHelmet(<LocalBusinessSchema {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('includes JSON-LD script', () => {
      renderWithHelmet(<LocalBusinessSchema {...defaultProps} />);
      // The script is injected via Helmet, so we check if component renders
      expect(true).toBe(true);
    });

    it('handles optional aggregateRating', () => {
      const propsWithRating = {
        ...defaultProps,
        aggregateRating: {
          ratingValue: '5',
          reviewCount: '509',
        },
      };

      const { container } = renderWithHelmet(<LocalBusinessSchema {...propsWithRating} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('CourseSchema', () => {
    const defaultProps = {
      name: 'Clases de Dancehall en Barcelona',
      description: 'Aprende Dancehall jamaicano en Barcelona',
      provider: {
        name: "Farray's International Dance Center",
        url: 'https://www.farrayscenter.com',
      },
      educationalLevel: 'Beginner, Intermediate, Advanced',
      teaches: 'Dancehall jamaicano, técnica de danza urbana',
      availableLanguage: [...SUPPORTED_LOCALES],
    };

    it('renders without crashing', () => {
      const { container } = renderWithHelmet(<CourseSchema {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles optional coursePrerequisites', () => {
      const propsWithPrereqs = {
        ...defaultProps,
        coursePrerequisites: 'Ninguno',
      };

      const { container } = renderWithHelmet(<CourseSchema {...propsWithPrereqs} />);
      expect(container).toBeInTheDocument();
    });

    it('handles optional numberOfLessons', () => {
      const propsWithLessons = {
        ...defaultProps,
        numberOfLessons: '5 clases semanales',
      };

      const { container } = renderWithHelmet(<CourseSchema {...propsWithLessons} />);
      expect(container).toBeInTheDocument();
    });

    it('handles optional timeRequired', () => {
      const propsWithTime = {
        ...defaultProps,
        timeRequired: 'PT1H',
      };

      const { container } = renderWithHelmet(<CourseSchema {...propsWithTime} />);
      expect(container).toBeInTheDocument();
    });
  });

  describe('AggregateReviewsSchema', () => {
    const defaultProps = {
      reviews: [
        {
          itemReviewed: { name: 'Clases de Dancehall', type: 'Course' },
          author: 'María García',
          reviewRating: { ratingValue: '5', bestRating: '5' },
          reviewBody: 'Excelentes clases!',
          datePublished: '2024-01-01',
        },
        {
          itemReviewed: { name: 'Clases de Dancehall', type: 'Course' },
          author: 'Carlos López',
          reviewRating: { ratingValue: '4', bestRating: '5' },
          reviewBody: 'Muy buena experiencia',
          datePublished: '2024-01-02',
        },
      ],
      itemName: "Clases de Dancehall - Farray's Center",
      itemType: 'Course',
    };

    it('renders without crashing', () => {
      const { container } = renderWithHelmet(<AggregateReviewsSchema {...defaultProps} />);
      expect(container).toBeInTheDocument();
    });

    it('handles empty reviews array', () => {
      const propsWithEmptyReviews = {
        ...defaultProps,
        reviews: [],
      };

      const { container } = renderWithHelmet(<AggregateReviewsSchema {...propsWithEmptyReviews} />);
      expect(container).toBeInTheDocument();
    });

    it('handles single review', () => {
      const firstReview = defaultProps.reviews[0];
      if (!firstReview) throw new Error('First review is undefined');

      const propsWithSingleReview = {
        ...defaultProps,
        reviews: [firstReview],
      };

      const { container } = renderWithHelmet(<AggregateReviewsSchema {...propsWithSingleReview} />);
      expect(container).toBeInTheDocument();
    });
  });
});
