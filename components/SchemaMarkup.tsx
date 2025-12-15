/**
 * Schema.org structured data components for SEO.
 * These components inject JSON-LD scripts into the page head
 * to help search engines understand page content.
 *
 * Available schemas:
 * - OrganizationSchema - Global organization info (use once at app level)
 * - LocalBusinessSchema - Dance school business info
 * - CourseSchema - Dance class/course details
 * - ReviewSchema - Individual review
 * - AggregateReviewsSchema - Multiple reviews with average
 * - HowToSchema - Step-by-step guides
 * - SpeakableSchema - Voice search optimization
 * - DefinedTermSchema - Dance terminology definitions
 * - EventSchema - Dance events/workshops
 *
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data
 *
 * @example
 * ```tsx
 * <LocalBusinessSchema
 *   name="Farray's International Dance Center"
 *   description="Escuela de baile en Barcelona"
 *   url="https://farrays.com"
 *   telephone="+34 123 456 789"
 *   email="info@farrays.com"
 *   address={{ streetAddress: "C/ Example", addressLocality: "Barcelona", postalCode: "08001", addressCountry: "ES" }}
 *   geo={{ latitude: "41.3851", longitude: "2.1734" }}
 * />
 * ```
 */
import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Global Organization Schema - renders once at app level.
 * Provides search engines with core information about the organization.
 * This should be included in App.tsx or the main layout component.
 */
export const OrganizationSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://www.farrayscenter.com/#organization',
    name: "Farray's International Dance Center",
    alternateName: ['FIDC', "Farray's Dance Center", 'Farrays Center'],
    url: 'https://www.farrayscenter.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.farrayscenter.com/images/logo-fidc.png',
      width: '512',
      height: '512',
    },
    image: 'https://www.farrayscenter.com/images/og-home.jpg',
    description:
      'Escuela de baile en Barcelona especializada en Dancehall, Twerk, Afrobeats, Reggaeton, Hip Hop, Heels y más. Clases para todos los niveles con los mejores profesores.',
    foundingDate: '2015',
    founder: {
      '@type': 'Person',
      name: 'Yunaisy Farray',
      jobTitle: 'Directora y Fundadora',
      url: 'https://www.farrayscenter.com/es/yunaisy-farray',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Carrer de Pallars, 85',
      addressLocality: 'Barcelona',
      postalCode: '08018',
      addressRegion: 'Cataluña',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.3980',
      longitude: '2.1920',
    },
    telephone: '+34 644 55 06 20',
    email: 'info@farrayscenter.com',
    sameAs: [
      'https://www.instagram.com/farrays_international_dance/',
      'https://www.facebook.com/farraysinternationaldancecenter',
      'https://www.youtube.com/@FarraysDanceCenter',
      'https://www.tiktok.com/@farraysdancecenter',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34 644 55 06 20',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'Catalan', 'English', 'French'],
      areaServed: 'ES',
    },
    areaServed: {
      '@type': 'City',
      name: 'Barcelona',
      '@id': 'https://www.wikidata.org/wiki/Q1492',
    },
    knowsAbout: [
      'Dancehall',
      'Twerk',
      'Afrobeats',
      'Hip Hop',
      'Reggaeton',
      'Heels Dance',
      'Salsa Cubana',
      'Ballet',
      'Contemporary Dance',
      'Modern Jazz',
    ],
    slogan: 'Dance Your Dreams',
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Props for LocalBusinessSchema - Dance school business information.
 */
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

/**
 * Props for CourseSchema - Dance class/course information.
 */
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
  availableLanguage?: readonly string[];
}

/**
 * Props for ReviewSchema - Individual review.
 */
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

// HowTo Schema for step-by-step guides (GEO optimization)
interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration format (e.g., "PT30M" for 30 minutes)
  estimatedCost?: {
    currency: string;
    value: string;
  };
  supply?: string[];
  tool?: string[];
  steps: HowToStep[];
}

export const HowToSchema: React.FC<HowToSchemaProps> = props => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: props.name,
    description: props.description,
    ...(props.image && { image: props.image }),
    ...(props.totalTime && { totalTime: props.totalTime }),
    ...(props.estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: props.estimatedCost.currency,
        value: props.estimatedCost.value,
      },
    }),
    ...(props.supply && {
      supply: props.supply.map(item => ({
        '@type': 'HowToSupply',
        name: item,
      })),
    }),
    ...(props.tool && {
      tool: props.tool.map(item => ({
        '@type': 'HowToTool',
        name: item,
      })),
    }),
    step: props.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// Speakable Schema for Voice Search optimization (GEO)
interface SpeakableSchemaProps {
  name: string;
  description: string;
  speakableSelectors: string[]; // CSS selectors for speakable content
  url: string;
}

export const SpeakableSchema: React.FC<SpeakableSchemaProps> = props => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: props.name,
    description: props.description,
    url: props.url,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: props.speakableSelectors,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// DefinedTerm Schema for technical terms (GEO - helps AI understand terminology)
interface DefinedTermSchemaProps {
  terms: {
    name: string;
    description: string;
    url?: string;
  }[];
}

export const DefinedTermSchema: React.FC<DefinedTermSchemaProps> = props => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': props.terms.map(term => ({
      '@type': 'DefinedTerm',
      name: term.name,
      description: term.description,
      ...(term.url && { url: term.url }),
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Terminología de Danza',
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// Event Schema for dance classes/events
interface EventSchemaProps {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address: string;
  };
  organizer: {
    name: string;
    url: string;
  };
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
  };
  performer?: {
    name: string;
    description?: string;
  };
  eventStatus?: string;
  eventAttendanceMode?: string;
}

export const EventSchema: React.FC<EventSchemaProps> = props => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DanceEvent',
    name: props.name,
    description: props.description,
    startDate: props.startDate,
    ...(props.endDate && { endDate: props.endDate }),
    location: {
      '@type': 'Place',
      name: props.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: props.location.address,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: props.organizer.name,
      url: props.organizer.url,
    },
    ...(props.offers && {
      offers: {
        '@type': 'Offer',
        price: props.offers.price,
        priceCurrency: props.offers.priceCurrency,
        availability: `https://schema.org/${props.offers.availability}`,
        url: props.offers.url,
      },
    }),
    ...(props.performer && {
      performer: {
        '@type': 'Person',
        name: props.performer.name,
        ...(props.performer.description && { description: props.performer.description }),
      },
    }),
    eventStatus: props.eventStatus || 'https://schema.org/EventScheduled',
    eventAttendanceMode:
      props.eventAttendanceMode || 'https://schema.org/OfflineEventAttendanceMode',
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

// FAQPage Schema for FAQ sections (helps with rich snippets in search results)
interface FAQPageSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const FAQPageSchema: React.FC<FAQPageSchemaProps> = ({ faqs }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
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
