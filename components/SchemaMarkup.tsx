/**
 * Schema.org structured data components for SEO.
 * These components inject JSON-LD scripts into the page head
 * to help search engines understand page content.
 *
 * Available schemas:
 * - OrganizationSchema - Global organization info (use once at app level)
 * - WebSiteSchema - Website info with SearchAction (use once at app level)
 * - SiteNavigationElementSchema - Main navigation structure
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
      streetAddress: 'Calle Entenca, 100',
      addressLocality: 'Barcelona',
      postalCode: '08015',
      addressRegion: 'Cataluña',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.3751',
      longitude: '2.1482',
    },
    telephone: '+34622247085',
    email: 'info@farrayscenter.com',
    sameAs: [
      'https://www.instagram.com/farrays_centerbcn/',
      'https://www.facebook.com/farrayscenter/',
      'https://www.youtube.com/@farraysinternationaldance',
      'https://www.tiktok.com/@farrays_centerbcn',
      'https://g.page/r/CQPRw_FarraysDanceBCN', // Google Business Profile
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+34622247085',
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
 * WebSite Schema - renders once at app level.
 * Provides search engines with website-level information and SearchAction for sitelinks.
 * This should be included in App.tsx or the main layout component.
 */
export const WebSiteSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.farrayscenter.com/#website',
    url: 'https://www.farrayscenter.com',
    name: "Farray's International Dance Center",
    description:
      'Escuela de baile en Barcelona con mas de 25 estilos: Dancehall, Twerk, Afrobeats, Reggaeton, Hip Hop, Salsa, Bachata, Ballet, Contemporaneo y mas.',
    publisher: {
      '@id': 'https://www.farrayscenter.com/#organization',
    },
    inLanguage: ['es-ES', 'ca-ES', 'en', 'fr-FR'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://www.farrayscenter.com/es/clases/baile-barcelona?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Navigation item structure for SiteNavigationElement
 */
interface NavigationItem {
  name: string;
  url: string;
}

/**
 * SiteNavigationElement Schema - renders main site navigation.
 * Helps search engines understand the site structure and navigation hierarchy.
 * This should be included in App.tsx or Header component.
 */
export const SiteNavigationElementSchema: React.FC = () => {
  const baseUrl = 'https://www.farrayscenter.com';

  // Main navigation items matching the Header structure
  const navigationItems: NavigationItem[] = [
    {
      name: 'Inicio',
      url: `${baseUrl}/es`,
    },
    {
      name: 'Clases de Baile',
      url: `${baseUrl}/es/clases/baile-barcelona`,
    },
    {
      name: 'Danza',
      url: `${baseUrl}/es/clases/danza-barcelona`,
    },
    {
      name: 'Danzas Urbanas',
      url: `${baseUrl}/es/clases/danzas-urbanas-barcelona`,
    },
    {
      name: 'Salsa y Bachata',
      url: `${baseUrl}/es/clases/salsa-bachata-barcelona`,
    },
    {
      name: 'Servicios',
      url: `${baseUrl}/es/servicios-baile`,
    },
    {
      name: 'Blog',
      url: `${baseUrl}/es/blog`,
    },
    {
      name: 'Sobre Nosotros',
      url: `${baseUrl}/es/sobre-nosotros`,
    },
    {
      name: 'Contacto',
      url: `${baseUrl}/es/contacto`,
    },
    {
      name: 'Horarios',
      url: `${baseUrl}/es/horarios-clases-baile-barcelona`,
    },
    {
      name: 'Precios',
      url: `${baseUrl}/es/precios-clases-baile-barcelona`,
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': navigationItems.map((item, index) => ({
      '@type': 'SiteNavigationElement',
      '@id': `${baseUrl}/#navigation-${index + 1}`,
      name: item.name,
      url: item.url,
    })),
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
    '@id': 'https://www.farrayscenter.com/#localbusiness',
    name: props.name,
    description: props.description,
    url: props.url,
    telephone: props.telephone,
    email: props.email,
    image: 'https://www.farrayscenter.com/images/og-home.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: props.address.streetAddress,
      addressLocality: props.address.addressLocality,
      postalCode: props.address.postalCode,
      addressCountry: props.address.addressCountry,
      addressRegion: 'Cataluña',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: props.geo.latitude,
      longitude: props.geo.longitude,
    },
    // Social profiles including Google Business Profile
    sameAs: [
      'https://www.instagram.com/farrays_centerbcn/',
      'https://www.facebook.com/farrayscenter/',
      'https://www.youtube.com/@farraysinternationaldance',
      'https://www.tiktok.com/@farrays_centerbcn',
      'https://g.page/r/CQPRw_FarraysDanceBCN',
    ],
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

/**
 * Schedule item for CourseSchemaEnterprise
 * Represents a single class schedule with day, time, and instructor
 */
export interface CourseScheduleItem {
  /** Translated class name */
  className: string;
  /** Day key (monday, tuesday, etc.) - will be converted to schema.org format */
  dayKey: string;
  /** Time range in format "HH:MM - HH:MM" */
  time: string;
  /** Instructor name */
  teacher: string;
}

/**
 * Props for CourseSchemaEnterprise - Enterprise-level course schema with hasCourseInstance
 * Includes detailed schedule information for each class instance
 */
interface CourseSchemaEnterpriseProps {
  /** Course name */
  name: string;
  /** Course description */
  description: string;
  /** Page URL for @id */
  pageUrl: string;
  /** Base URL of the site */
  baseUrl: string;
  /** Array of schedule items - each becomes a CourseInstance */
  schedules: CourseScheduleItem[];
}

/**
 * Enterprise Course Schema with hasCourseInstance for each schedule.
 * Generates rich structured data with:
 * - Individual CourseInstance for each class schedule
 * - courseSchedule with day, start/end times, and timezone
 * - instructor information
 * - location with full address
 * - offers with availability
 *
 * @example
 * ```tsx
 * <CourseSchemaEnterprise
 *   name="Salsa Lady Style - Método Farray"
 *   description="Clases de Salsa Lady Style en Barcelona"
 *   pageUrl="https://www.farrayscenter.com/es/clases/salsa-lady-style-barcelona"
 *   baseUrl="https://www.farrayscenter.com"
 *   schedules={[
 *     { className: 'Salsa Lady Style Intermedio', dayKey: 'monday', time: '19:00 - 20:00', teacher: 'Yunaisy Farray' },
 *     { className: 'Salsa Lady Style Básico', dayKey: 'wednesday', time: '19:00 - 20:00', teacher: 'Yunaisy Farray' },
 *   ]}
 * />
 * ```
 */
export const CourseSchemaEnterprise: React.FC<CourseSchemaEnterpriseProps> = ({
  name,
  description,
  pageUrl,
  baseUrl,
  schedules,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${pageUrl}#course`,
    name,
    description,
    provider: {
      '@type': 'DanceSchool',
      '@id': `${baseUrl}/#organization`,
      name: "Farray's International Dance Center",
      url: baseUrl,
    },
    hasCourseInstance: schedules.map((schedule, index) => ({
      '@type': 'CourseInstance',
      '@id': `${pageUrl}#schedule-${index + 1}`,
      name: schedule.className,
      courseMode: 'onsite',
      courseSchedule: {
        '@type': 'Schedule',
        byDay: `https://schema.org/${schedule.dayKey.charAt(0).toUpperCase() + schedule.dayKey.slice(1)}`,
        startTime: schedule.time.split(' - ')[0],
        endTime: schedule.time.split(' - ')[1],
        scheduleTimezone: 'Europe/Madrid',
      },
      instructor: {
        '@type': 'Person',
        name: schedule.teacher,
      },
      location: {
        '@type': 'Place',
        name: "Farray's International Dance Center",
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Calle Entenca 100',
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
        },
      },
    })),
    offers: {
      '@type': 'Offer',
      category: 'Subscription',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
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

// BreadcrumbList Schema for navigation hierarchy (SEO - helps search engines understand site structure)
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbListSchemaProps {
  items: BreadcrumbItem[];
}

/**
 * BreadcrumbList Schema - renders navigation breadcrumb trail.
 * Helps search engines understand page hierarchy and can show breadcrumbs in search results.
 *
 * @example
 * ```tsx
 * <BreadcrumbListSchema
 *   items={[
 *     { name: 'Inicio', url: 'https://www.farrayscenter.com/es' },
 *     { name: 'Clases', url: 'https://www.farrayscenter.com/es/clases/baile-barcelona' },
 *     { name: 'Dancehall', url: 'https://www.farrayscenter.com/es/clases/dancehall-barcelona' },
 *   ]}
 * />
 * ```
 */
export const BreadcrumbListSchema: React.FC<BreadcrumbListSchemaProps> = ({ items }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * DanceSchoolWithRatingSchema - Global schema with AggregateRating
 * Combines DanceSchool type with Google Business Profile rating data.
 * This is the key schema for showing stars in Google search results.
 *
 * @see https://developers.google.com/search/docs/appearance/structured-data/local-business
 * @see https://schema.org/AggregateRating
 */
export const DanceSchoolWithRatingSchema: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DanceSchool',
    '@id': 'https://www.farrayscenter.com/#danceschool',
    name: "Farray's International Dance Center",
    alternateName: "Farray's Center",
    description:
      'Escuela de baile en Barcelona con más de 25 estilos: Salsa, Bachata, Dancehall, Twerk, Afrobeats, Hip Hop, Heels, Ballet, Contemporáneo y más. Formación profesional con los mejores maestros.',
    url: 'https://www.farrayscenter.com',
    telephone: '+34622247085',
    email: 'info@farrayscenter.com',
    priceRange: '€€',
    image: 'https://www.farrayscenter.com/images/og-home.jpg',
    logo: 'https://www.farrayscenter.com/images/logo-fidc.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Entenca, 100',
      addressLocality: 'Barcelona',
      postalCode: '08015',
      addressRegion: 'Cataluña',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.3751',
      longitude: '2.1482',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '10:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '20:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '509',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [
      'https://www.instagram.com/farrays_centerbcn/',
      'https://www.facebook.com/farrayscenter/',
      'https://www.youtube.com/@farraysinternationaldance',
      'https://www.tiktok.com/@farrays_centerbcn',
      'https://g.page/r/CWBvYu8J9aJAEBM',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Clases de Baile',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: 'Bailes Latinos',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Salsa Cubana' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Bachata' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Salsa Lady Style' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Danzas Urbanas',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Hip Hop' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Dancehall' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Twerk' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Afrobeats' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: 'Danza',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Contemporáneo' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Ballet' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Modern Jazz' } },
          ],
        },
      ],
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
