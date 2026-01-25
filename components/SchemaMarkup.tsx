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
import { useTranslation } from 'react-i18next';

/**
 * Global Organization Schema - renders once at app level.
 * Provides search engines with core information about the organization.
 * This should be included in App.tsx or the main layout component.
 */
export const OrganizationSchema: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;

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
    description: t('schema_org_description'),
    foundingDate: '2017',
    founder: {
      '@type': 'Person',
      name: 'Yunaisy Farray',
      jobTitle: t('schema_founderJobTitle'),
      url: `https://www.farrayscenter.com/${locale}/yunaisy-farray`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: t('schema_streetAddress'),
      addressLocality: 'Barcelona',
      postalCode: '08015',
      addressRegion: t('schema_addressRegion'),
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.380421',
      longitude: '2.148014',
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
    priceRange: '€€',
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
    memberOf: {
      '@type': 'Organization',
      name: 'CID - International Dance Council UNESCO',
      url: 'https://www.cid-world.org/',
      description: 'Official partner of UNESCO for dance',
    },
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
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.farrayscenter.com/#website',
    url: 'https://www.farrayscenter.com',
    name: "Farray's International Dance Center",
    description: t('schema_website_description'),
    publisher: {
      '@id': 'https://www.farrayscenter.com/#organization',
    },
    inLanguage: ['es-ES', 'ca-ES', 'en', 'fr-FR'],
    datePublished: '2017-01-01',
    dateModified: '2026-01-25',
    copyrightYear: 2017,
    copyrightHolder: {
      '@id': 'https://www.farrayscenter.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `https://www.farrayscenter.com/${locale}/clases/baile-barcelona?q={search_term_string}`,
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
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;
  const baseUrl = 'https://www.farrayscenter.com';

  // Main navigation items matching the Header structure - translated and locale-aware
  const navigationItems: NavigationItem[] = [
    {
      name: t('schema_nav_home'),
      url: `${baseUrl}/${locale}`,
    },
    {
      name: t('schema_nav_danceClasses'),
      url: `${baseUrl}/${locale}/clases/baile-barcelona`,
    },
    {
      name: t('schema_nav_dance'),
      url: `${baseUrl}/${locale}/clases/danza-barcelona`,
    },
    {
      name: t('schema_nav_urbanDances'),
      url: `${baseUrl}/${locale}/clases/danzas-urbanas-barcelona`,
    },
    {
      name: t('schema_nav_salsaBachata'),
      url: `${baseUrl}/${locale}/clases/salsa-bachata-barcelona`,
    },
    {
      name: t('schema_nav_services'),
      url: `${baseUrl}/${locale}/servicios-baile-barcelona`,
    },
    {
      name: t('schema_nav_blog'),
      url: `${baseUrl}/${locale}/blog`,
    },
    {
      name: t('schema_nav_aboutUs'),
      url: `${baseUrl}/${locale}/sobre-nosotros`,
    },
    {
      name: t('schema_nav_contact'),
      url: `${baseUrl}/${locale}/contacto`,
    },
    {
      name: t('schema_nav_schedule'),
      url: `${baseUrl}/${locale}/horarios-clases-baile-barcelona`,
    },
    {
      name: t('schema_nav_prices'),
      url: `${baseUrl}/${locale}/precios-clases-baile-barcelona`,
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
    /** Translated address region (e.g., 'Cataluña', 'Catalunya', 'Catalonia', 'Catalogne') */
    addressRegion?: string;
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
  /** Booking URL for ReserveAction (enables Google "Book" button in search) */
  bookingUrl?: string;
  /** Translated reservation action name */
  reserveActionName?: string;
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
  const { t } = useTranslation(['common']);

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
      addressRegion: props.address.addressRegion,
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
    // ReserveAction for Google "Book" button in search results
    potentialAction: [
      {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: props.bookingUrl || 'https://www.farrayscenter.com/es/horarios-precios',
          inLanguage: ['es', 'ca', 'en', 'fr'],
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform',
          ],
        },
        result: {
          '@type': 'Reservation',
          name: props.reserveActionName || t('schema_reserveActionName'),
        },
      },
    ],
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
  /** Translated street address (e.g., "Carrer d'Entença, 100, Local 1") */
  streetAddress?: string;
  /** Translated address region (e.g., 'Cataluña', 'Catalunya', 'Catalonia', 'Catalogne') */
  addressRegion?: string;
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
  streetAddress: streetAddressProp,
  addressRegion: addressRegionProp,
}) => {
  const { t } = useTranslation(['common']);

  // Use translated defaults if props not provided
  const streetAddress = streetAddressProp || t('schema_streetAddress');
  const addressRegion = addressRegionProp || t('schema_addressRegion');

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
          streetAddress,
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressRegion,
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
  /** Translated name for the term set (e.g., 'Terminología de Danza', 'Dance Terminology') */
  termSetName?: string;
}

export const DefinedTermSchema: React.FC<DefinedTermSchemaProps> = props => {
  const { t } = useTranslation(['common']);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': props.terms.map(term => ({
      '@type': 'DefinedTerm',
      name: term.name,
      description: term.description,
      ...(term.url && { url: term.url }),
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: props.termSetName || t('schema_danceTerminology'),
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
  const { t } = useTranslation(['common']);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'DanceSchool',
    '@id': 'https://www.farrayscenter.com/#danceschool',
    name: "Farray's International Dance Center",
    alternateName: "Farray's Center",
    description: t('schema_danceschool_description'),
    url: 'https://www.farrayscenter.com',
    telephone: '+34622247085',
    email: 'info@farrayscenter.com',
    priceRange: '€€',
    image: 'https://www.farrayscenter.com/images/og-home.jpg',
    logo: 'https://www.farrayscenter.com/images/logo-fidc.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: t('schema_streetAddress'),
      addressLocality: 'Barcelona',
      postalCode: '08015',
      addressRegion: t('schema_addressRegion'),
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '41.380421',
      longitude: '2.148014',
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
      name: t('schema_catalog_danceClasses'),
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: t('schema_catalog_latinDances'),
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Salsa Cubana' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Bachata' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Salsa Lady Style' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: t('schema_catalog_urbanDances'),
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Hip Hop' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Dancehall' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Twerk' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Afrobeats' } },
          ],
        },
        {
          '@type': 'OfferCatalog',
          name: t('schema_catalog_dance'),
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

// ============================================================================
// GEO & LLM OPTIMIZATION SCHEMAS
// Schemas optimized for Generative Engine Optimization and Large Language Models
// ============================================================================

/**
 * WebPage Schema - Enhanced for GEO/LLM optimization
 * Provides search engines and LLMs with page-level metadata including:
 * - dateModified for freshness signals
 * - mainEntity linking to primary content
 * - isPartOf for website relationship
 * - primaryImageOfPage for visual context
 *
 * @see https://schema.org/WebPage
 */
interface WebPageSchemaProps {
  /** Full page URL */
  url: string;
  /** Page title */
  name: string;
  /** Meta description */
  description: string;
  /** ISO date when page was first published */
  datePublished?: string;
  /** ISO date when page was last modified (important for freshness) */
  dateModified: string;
  /** Language code (es, en, ca, fr) */
  inLanguage: string;
  /** URL of the main entity this page is about (e.g., Course schema @id) */
  mainEntityId?: string;
  /** URL of primary image on the page */
  primaryImageUrl?: string;
  /** Breadcrumb trail for this page */
  breadcrumb?: Array<{ name: string; url: string }>;
}

export const WebPageSchema: React.FC<WebPageSchemaProps> = ({
  url,
  name,
  description,
  datePublished = '2024-01-01',
  dateModified,
  inLanguage,
  mainEntityId,
  primaryImageUrl,
  breadcrumb,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    datePublished,
    dateModified,
    inLanguage,
    isPartOf: {
      '@id': 'https://www.farrayscenter.com/#website',
    },
    about: mainEntityId ? { '@id': mainEntityId } : undefined,
    mainEntity: mainEntityId ? { '@id': mainEntityId } : undefined,
    ...(primaryImageUrl && {
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: primaryImageUrl,
      },
    }),
    ...(breadcrumb &&
      breadcrumb.length > 0 && {
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumb.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        },
      }),
    // GEO: Helps LLMs understand this is authoritative content
    publisher: {
      '@id': 'https://www.farrayscenter.com/#organization',
    },
    // GEO: Potential actions help LLMs understand what users can do
    potentialAction: {
      '@type': 'ReadAction',
      target: url,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Lead Capture Action Schema - For "Descubre cómo empezar" flow
 * Models the actual user journey:
 * 1. User clicks CTA → Lead capture form
 * 2. User receives email
 * 3. User can book welcome class or enroll
 *
 * This is more accurate than ReserveAction since there's no direct booking.
 *
 * @see https://schema.org/InteractAction
 */
interface LeadCaptureActionSchemaProps {
  /** Page URL where the action is available */
  pageUrl: string;
  /** Name of the course/class */
  courseName: string;
  /** Description of what happens when user takes action */
  actionDescription?: string;
  /** Translated action name (e.g., 'Descubre cómo empezar') */
  actionName?: string;
  /** Translated result name (e.g., 'Email con información del curso') */
  resultName?: string;
  /** Translated result description */
  resultDescription?: string;
  /** Translated ask action name (e.g., 'Solicitar información') */
  askActionName?: string;
}

export const LeadCaptureActionSchema: React.FC<LeadCaptureActionSchemaProps> = ({
  pageUrl,
  courseName,
  actionDescription,
  actionName,
  resultName,
  resultDescription,
  askActionName,
}) => {
  const { t } = useTranslation(['common']);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${pageUrl}#course-action`,
    name: courseName,
    potentialAction: [
      {
        '@type': 'InteractAction',
        name: actionName || t('schema_leadCapture_name'),
        description: actionDescription || t('schema_leadCapture_defaultDescription'),
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${pageUrl}#descubre`,
          actionPlatform: [
            'https://schema.org/DesktopWebPlatform',
            'https://schema.org/MobileWebPlatform',
          ],
        },
        // Result is receiving information, not a direct reservation
        result: {
          '@type': 'Message',
          name: resultName || t('schema_leadCapture_resultName'),
          description: resultDescription || t('schema_leadCapture_resultDescription'),
        },
      },
      {
        '@type': 'AskAction',
        name: askActionName || t('schema_leadCapture_askActionName'),
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${pageUrl}#contacto`,
        },
      },
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Brand Schema - For "Método Farray" methodology
 * Establishes the unique teaching methodology as a recognized brand.
 *
 * @see https://schema.org/Brand
 */
interface BrandSchemaProps {
  /** Brand name */
  name: string;
  /** Brand description */
  description: string;
  /** URL to brand page */
  url?: string;
  /** Logo URL */
  logo?: string;
  /** Slogan or tagline */
  slogan?: string;
}

export const BrandSchema: React.FC<BrandSchemaProps> = ({
  name,
  description,
  url,
  logo,
  slogan,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `https://www.farrayscenter.com/#brand-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    description,
    ...(url && { url }),
    ...(logo && { logo }),
    ...(slogan && { slogan }),
    // Link to parent organization
    brand: {
      '@id': 'https://www.farrayscenter.com/#organization',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * LLM Optimized Article Schema - For content pages
 * Provides rich context that helps LLMs cite and reference content accurately.
 * Includes speakable sections, citations, and content categorization.
 *
 * @see https://schema.org/Article
 */
interface LLMArticleSchemaProps {
  /** Article headline/title */
  headline: string;
  /** Article description */
  description: string;
  /** Full article URL */
  url: string;
  /** Primary image URL */
  image?: string;
  /** Author name */
  author?: string;
  /** Date published (ISO format) */
  datePublished: string;
  /** Date modified (ISO format) */
  dateModified: string;
  /** Main topics/keywords */
  keywords?: string[];
  /** CSS selectors for speakable/citeable content */
  speakableSelectors?: string[];
  /** Word count (helps LLMs gauge content depth) */
  wordCount?: number;
  /** Article section/category */
  articleSection?: string;
}

export const LLMArticleSchema: React.FC<LLMArticleSchemaProps> = ({
  headline,
  description,
  url,
  image,
  author = "Farray's International Dance Center",
  datePublished,
  dateModified,
  keywords,
  speakableSelectors,
  wordCount,
  articleSection,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline,
    description,
    url,
    ...(image && { image }),
    author: {
      '@type': 'Organization',
      '@id': 'https://www.farrayscenter.com/#organization',
      name: author,
    },
    publisher: {
      '@id': 'https://www.farrayscenter.com/#organization',
    },
    datePublished,
    dateModified,
    ...(keywords && { keywords: keywords.join(', ') }),
    ...(wordCount && { wordCount }),
    ...(articleSection && { articleSection }),
    // GEO: Speakable helps voice assistants and LLMs identify key content
    ...(speakableSelectors &&
      speakableSelectors.length > 0 && {
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: speakableSelectors,
        },
      }),
    // GEO: inLanguage helps LLMs with multilingual content
    inLanguage: 'es-ES',
    // GEO: mainEntityOfPage links to the WebPage
    mainEntityOfPage: {
      '@id': `${url}#webpage`,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

/**
 * Educational Organization Credential Schema
 * For courses that provide certification (e.g., CID-UNESCO accreditation)
 *
 * @see https://schema.org/EducationalOccupationalCredential
 */
interface CredentialSchemaProps {
  /** Course URL */
  courseUrl: string;
  /** Credential name */
  credentialName: string;
  /** Credential category (Certificate, Diploma, etc.) */
  credentialCategory?: string;
  /** Accrediting organization */
  recognizedBy?: {
    name: string;
    url?: string;
  };
}

export const CredentialSchema: React.FC<CredentialSchemaProps> = ({
  courseUrl,
  credentialName,
  credentialCategory = 'Certificate',
  recognizedBy,
}) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${courseUrl}#course-credential`,
    educationalCredentialAwarded: {
      '@type': 'EducationalOccupationalCredential',
      name: credentialName,
      credentialCategory,
      ...(recognizedBy && {
        recognizedBy: {
          '@type': 'Organization',
          name: recognizedBy.name,
          ...(recognizedBy.url && { url: recognizedBy.url }),
        },
      }),
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};
