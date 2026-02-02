/**
 * Dynamic Schedule Schema Component
 *
 * Generates JSON-LD structured data for dynamic schedule sessions from Momence.
 * Creates EventSchema for each session, optimized for:
 * - Google Rich Results (event snippets)
 * - Voice search (speakable)
 * - LLM/GEO optimization
 *
 * @module DynamicScheduleSchema
 *
 * @example
 * ```tsx
 * <DynamicScheduleSchema
 *   sessions={sessions}
 *   courseName="Bachata Barcelona"
 *   courseUrl="https://farrayscenter.com/es/clases/bachata-barcelona"
 * />
 * ```
 */

import React, { memo, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import type { ScheduleSession } from '../hooks/useScheduleSessions';
import { useTranslation } from 'react-i18next';

interface DynamicScheduleSchemaProps {
  /** Schedule sessions from Momence API */
  sessions: ScheduleSession[];
  /** Course/class name for the page */
  courseName: string;
  /** Full URL of the course page */
  courseUrl: string;
  /** Course description */
  courseDescription?: string;
  /** Base URL of the site */
  baseUrl?: string;
  /** Language code */
  locale?: string;
  /** Maximum events to include in schema (default: 10) */
  maxEvents?: number;
  /** Event image URL for Rich Results (1200x630 recommended) */
  eventImage?: string;
  /** Instructor image URL (optional, for Person schema) */
  instructorImage?: string;
  /** Translated street address (e.g., "Carrer d'Entença, 100, Local 1") */
  streetAddress?: string;
  /** Translated address region (e.g., 'Cataluña', 'Catalunya', 'Catalonia', 'Catalogne') */
  addressRegion?: string;
}

/**
 * Generates DanceEvent schema for each session
 * @see https://schema.org/DanceEvent
 */
const DynamicScheduleSchema: React.FC<DynamicScheduleSchemaProps> = memo(
  function DynamicScheduleSchema({
    sessions,
    courseName,
    courseUrl,
    courseDescription,
    baseUrl = 'https://www.farrayscenter.com',
    locale = 'es',
    maxEvents = 10,
    eventImage,
    instructorImage,
    streetAddress: streetAddressProp,
    addressRegion: addressRegionProp,
  }) {
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

    // Use translated defaults if props not provided
    const streetAddress = streetAddressProp || t('schema_streetAddress');
    const addressRegion = addressRegionProp || t('schema_addressRegion');

    // Generate translated default descriptions
    const defaultDescription = t('schema_dynamicSchedule_description').replace(
      '{courseName}',
      courseName
    );
    const itemListName = t('schema_dynamicSchedule_itemListName').replace(
      '{courseName}',
      courseName
    );
    const itemListDescription = t('schema_dynamicSchedule_itemListDescription').replace(
      '{courseName}',
      courseName
    );

    const schema = useMemo(() => {
      if (!sessions || sessions.length === 0) {
        return null;
      }

      // Limit events to prevent schema bloat
      const limitedSessions = sessions.slice(0, maxEvents);

      // Create Course schema with CourseInstances
      const courseSchema = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        '@id': `${courseUrl}#course`,
        name: courseName,
        description: courseDescription || defaultDescription,
        provider: {
          '@type': 'EducationalOrganization',
          '@id': `${baseUrl}/#organization`,
          name: "Farray's International Dance Center",
          url: baseUrl,
        },
        inLanguage: locale === 'ca' ? 'ca-ES' : `${locale}-ES`,
        hasCourseInstance: limitedSessions.map((session, index) => ({
          '@type': 'CourseInstance',
          '@id': `${courseUrl}#session-${session.id || index}`,
          name: session.name,
          courseMode: 'onsite',
          courseSchedule: {
            '@type': 'Schedule',
            byDay: `https://schema.org/${capitalizeFirstLetter(session.dayKey)}`,
            startTime: session.time,
            endTime: session.endTime,
            scheduleTimezone: 'Europe/Madrid',
            // Add specific date for the session
            startDate: session.rawStartsAt?.split('T')[0],
          },
          instructor: {
            '@type': 'Person',
            name: session.instructor,
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
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '41.380421',
              longitude: '2.148014',
            },
          },
          // Availability info for rich results
          ...(session.isFull
            ? {}
            : {
                offers: {
                  '@type': 'Offer',
                  price: '50',
                  priceCurrency: 'EUR',
                  availability: 'https://schema.org/InStock',
                  availableAtOrFrom: {
                    '@type': 'Place',
                    name: "Farray's International Dance Center",
                  },
                },
              }),
        })),
        // Add aggregate offer with pricing tiers
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'EUR',
          lowPrice: '50',
          highPrice: '195',
          offerCount: 8,
          availability: 'https://schema.org/InStock',
          url: `${courseUrl}#precios`,
          // Price specifications for different plans
          priceSpecification: [
            {
              '@type': 'UnitPriceSpecification',
              price: '50',
              priceCurrency: 'EUR',
              name: t('schema_price_1hourWeek'),
              unitText: t('schema_price_month'),
              referenceQuantity: {
                '@type': 'QuantitativeValue',
                value: '4',
                unitText: t('schema_price_classes'),
              },
            },
            {
              '@type': 'UnitPriceSpecification',
              price: '78',
              priceCurrency: 'EUR',
              name: t('schema_price_2hoursWeekPopular'),
              unitText: t('schema_price_month'),
              referenceQuantity: {
                '@type': 'QuantitativeValue',
                value: '8',
                unitText: t('schema_price_classes'),
              },
            },
            {
              '@type': 'UnitPriceSpecification',
              price: '145',
              priceCurrency: 'EUR',
              name: t('schema_price_5hoursWeek'),
              unitText: t('schema_price_month'),
              referenceQuantity: {
                '@type': 'QuantitativeValue',
                value: '20',
                unitText: t('schema_price_classes'),
              },
            },
          ],
        },
      };

      // Create ItemList schema for event listing
      const itemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${courseUrl}#schedule-list`,
        name: itemListName,
        description: itemListDescription,
        numberOfItems: limitedSessions.length,
        itemListElement: limitedSessions.map((session, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'DanceEvent',
            '@id': `${courseUrl}#event-${session.id || index}`,
            name: session.name,
            description: t('schema_dynamicSchedule_eventDescription')
              .replace('{sessionName}', session.name)
              .replace('{instructor}', session.instructor),
            startDate: session.rawStartsAt,
            endDate: calculateEndDate(session.rawStartsAt, session.duration),
            eventStatus: 'https://schema.org/EventScheduled',
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            // Image for Rich Results (Google Events)
            ...(eventImage && { image: eventImage }),
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
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 41.3851,
                longitude: 2.1519,
              },
            },
            organizer: {
              '@type': 'Organization',
              '@id': `${baseUrl}/#organization`,
              name: "Farray's International Dance Center",
              url: baseUrl,
            },
            performer: {
              '@type': 'Person',
              name: session.instructor,
              ...(instructorImage && { image: instructorImage }),
            },
            // Remaining capacity indicator
            ...(typeof session.spotsAvailable === 'number' && {
              remainingAttendeeCapacity: session.spotsAvailable,
            }),
            ...(session.isFull
              ? {
                  offers: {
                    '@type': 'Offer',
                    price: '50',
                    priceCurrency: 'EUR',
                    availability: 'https://schema.org/SoldOut',
                    validFrom: session.rawStartsAt,
                  },
                }
              : {
                  offers: {
                    '@type': 'Offer',
                    price: '50',
                    priceCurrency: 'EUR',
                    availability: 'https://schema.org/InStock',
                    url: courseUrl,
                    validFrom: session.rawStartsAt,
                  },
                }),
          },
        })),
      };

      return {
        '@context': 'https://schema.org',
        '@graph': [courseSchema, itemListSchema],
      };
    }, [
      sessions,
      courseName,
      courseUrl,
      courseDescription,
      defaultDescription,
      itemListName,
      itemListDescription,
      t,
      baseUrl,
      locale,
      maxEvents,
      eventImage,
      instructorImage,
      streetAddress,
      addressRegion,
    ]);

    if (!schema) {
      return null;
    }

    return (
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
    );
  }
);

/**
 * Capitalize first letter for schema.org day names
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Calculate end date from start date and duration
 */
function calculateEndDate(startDate: string | undefined, durationMinutes: number): string {
  if (!startDate) return '';

  try {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
    return end.toISOString();
  } catch {
    return '';
  }
}

/**
 * Schema for empty/vacation state
 * Shows that the business is temporarily not offering classes
 */
export const VacationSchema: React.FC<{
  courseName: string;
  courseUrl: string;
  baseUrl?: string;
}> = memo(function VacationSchema({
  courseName,
  courseUrl,
  baseUrl = 'https://www.farrayscenter.com',
}) {
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
  const vacationDescription = t('schema_vacation_description').replace('{courseName}', courseName);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${courseUrl}#course`,
    name: courseName,
    description: vacationDescription,
    provider: {
      '@type': 'EducationalOrganization',
      '@id': `${baseUrl}/#organization`,
      name: "Farray's International Dance Center",
    },
    // No hasCourseInstance when on vacation
    offers: {
      '@type': 'Offer',
      price: '50',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/OutOfStock',
      availabilityStarts: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Estimate 1 week
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
});

export default DynamicScheduleSchema;
