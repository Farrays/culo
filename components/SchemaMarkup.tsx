import React from 'react';
import { Helmet } from 'react-helmet-async';

interface LocalBusinessSchemaProps {
  name: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: string;
    longitude: string;
  };
  priceRange?: string;
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
  openingHours?: string[];
}

interface CourseSchemaProps {
  name: string;
  description: string;
  provider: {
    name: string;
    url: string;
  };
  educationalLevel?: string;
  teaches?: string;
  coursePrerequisites?: string;
  numberOfLessons?: string;
  timeRequired?: string;
  availableLanguage?: string[];
}

interface ReviewSchemaProps {
  itemReviewed: {
    name: string;
    type: string;
  };
  author: string;
  reviewRating: {
    ratingValue: string;
    bestRating: string;
  };
  reviewBody: string;
  datePublished?: string;
}

export const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = props => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DanceSchool',
    name: props.name,
    description: props.description,
    url: props.url,
    telephone: props.telephone,
    email: props.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: props.address.streetAddress,
      addressLocality: props.address.addressLocality,
      postalCode: props.address.postalCode,
      addressCountry: props.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: props.geo.latitude,
      longitude: props.geo.longitude,
    },
    ...(props.priceRange && { priceRange: props.priceRange }),
    ...(props.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: props.aggregateRating.ratingValue,
        reviewCount: props.aggregateRating.reviewCount,
      },
    }),
    ...(props.openingHours && { openingHoursSpecification: props.openingHours }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const CourseSchema: React.FC<CourseSchemaProps> = props => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: props.name,
    description: props.description,
    provider: {
      '@type': 'Organization',
      name: props.provider.name,
      url: props.provider.url,
    },
    ...(props.educationalLevel && { educationalLevel: props.educationalLevel }),
    ...(props.teaches && { teaches: props.teaches }),
    ...(props.coursePrerequisites && { coursePrerequisites: props.coursePrerequisites }),
    ...(props.numberOfLessons && { numberOfLessons: props.numberOfLessons }),
    ...(props.timeRequired && { timeRequired: props.timeRequired }),
    ...(props.availableLanguage && { availableLanguage: props.availableLanguage }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const ReviewSchema: React.FC<ReviewSchemaProps> = props => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': props.itemReviewed.type,
      name: props.itemReviewed.name,
    },
    author: {
      '@type': 'Person',
      name: props.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: props.reviewRating.ratingValue,
      bestRating: props.reviewRating.bestRating,
    },
    reviewBody: props.reviewBody,
    ...(props.datePublished && { datePublished: props.datePublished }),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const AggregateReviewsSchema: React.FC<{
  reviews: ReviewSchemaProps[];
  itemName: string;
  itemType: string;
}> = ({ reviews, itemName, itemType }) => {
  const totalRating = reviews.reduce(
    (sum, review) => sum + parseFloat(review.reviewRating.ratingValue),
    0
  );
  const averageRating = (totalRating / reviews.length).toFixed(1);

  const schema = {
    '@context': 'https://schema.org',
    '@type': itemType,
    name: itemName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: averageRating,
      reviewCount: reviews.length.toString(),
      bestRating: '5',
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating.ratingValue,
        bestRating: review.reviewRating.bestRating,
      },
      reviewBody: review.reviewBody,
      ...(review.datePublished && { datePublished: review.datePublished }),
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
