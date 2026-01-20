import React, { useState, useMemo, useCallback, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import {
  getSortedEvents,
  EVENT_COLORS,
  type CalendarEvent,
  type CalendarEventType,
  type CalendarIconType,
} from '../constants/calendar-events';
import {
  SunIcon,
  CalendarXIcon,
  SparklesIcon,
  AcademicCapIcon,
  MegaphoneIcon,
  RocketLaunchIcon,
  StarIcon,
} from '../lib/icons';

/**
 * Icon component map for calendar events
 */
const ICON_COMPONENTS: Record<CalendarIconType, React.FC<{ className?: string }>> = {
  sun: SunIcon,
  calendarX: CalendarXIcon,
  sparkles: SparklesIcon,
  academicCap: AcademicCapIcon,
  megaphone: MegaphoneIcon,
  rocket: RocketLaunchIcon,
  star: StarIcon,
};

/**
 * Render the appropriate icon for an event
 */
const EventIcon: React.FC<{ iconType: CalendarIconType; className?: string }> = memo(
  ({ iconType, className }) => {
    const IconComponent = ICON_COMPONENTS[iconType];
    return <IconComponent className={className} />;
  }
);

EventIcon.displayName = 'EventIcon';

// ============ TYPES ============

type FilterType = 'all' | CalendarEventType;

interface EventSchemaItem {
  '@type': 'Event';
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventStatus: string;
  eventAttendanceMode: string;
  location: {
    '@type': 'Place';
    name: string;
    address: {
      '@type': 'PostalAddress';
      streetAddress: string;
      addressLocality: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  organizer: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
}

// ============ HELPER FUNCTIONS ============

/**
 * Format date range
 */
const formatDateRange = (
  startDate: string,
  endDate: string | undefined,
  locale: string
): string => {
  const localeMap: Record<string, string> = {
    es: 'es-ES',
    ca: 'ca-ES',
    en: 'en-GB',
    fr: 'fr-FR',
  };
  const dateLocale = localeMap[locale] || 'es-ES';

  const start = new Date(startDate);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
  };

  if (endDate) {
    const end = new Date(endDate);
    if (end.getTime() !== start.getTime()) {
      const startStr = start.toLocaleDateString(dateLocale, options);
      const endStr = end.toLocaleDateString(dateLocale, {
        ...options,
        year: 'numeric',
      });
      return `${startStr} - ${endStr}`;
    }
  }

  return start.toLocaleDateString(dateLocale, { ...options, year: 'numeric' });
};

/**
 * Get relative time indicator
 */
const getTimeIndicator = (
  startDate: string,
  endDate: string | undefined,
  t: (key: string) => string
): { text: string; className: string } | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = endDate ? new Date(endDate) : start;
  end.setHours(0, 0, 0, 0);

  // Currently happening
  if (today >= start && today <= end) {
    return {
      text: t('calendar_happening_now'),
      className: 'bg-emerald-500 text-white animate-pulse',
    };
  }

  // Coming soon (within 7 days)
  const daysUntil = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil > 0 && daysUntil <= 7) {
    return {
      text: t('calendar_coming_soon'),
      className: 'bg-primary-accent/30 holographic-text border border-primary-accent/50',
    };
  }

  return null;
};

// ============ COMPONENTS ============

/**
 * Filter button component
 */
const FilterButton: React.FC<{
  type: FilterType;
  isActive: boolean;
  onClick: () => void;
  label: string;
  count: number;
}> = memo(({ type: _type, isActive, onClick, label, count }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-300
        flex items-center gap-2
        border
        ${
          isActive
            ? 'bg-primary-accent/20 border-primary-accent text-white'
            : 'bg-neutral/5 border-neutral/20 text-neutral/70 hover:border-neutral/40 hover:text-neutral'
        }
      `}
    >
      <span>{label}</span>
      <span
        className={`
          px-1.5 py-0.5 rounded-full text-xs
          ${isActive ? 'bg-primary-accent text-white' : 'bg-neutral/10'}
        `}
      >
        {count}
      </span>
    </button>
  );
});

FilterButton.displayName = 'FilterButton';

/**
 * Timeline event card
 */
const TimelineEvent: React.FC<{
  event: CalendarEvent;
  locale: string;
  t: (key: string) => string;
  isLast: boolean;
}> = memo(({ event, locale, t, isLast }) => {
  const colors = EVENT_COLORS[event.type];
  const iconType = event.iconType || colors.iconType;
  const timeIndicator = getTimeIndicator(event.startDate, event.endDate, t);

  return (
    <div className="relative flex gap-4 md:gap-8">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div className="w-4 h-4 rounded-full bg-primary-accent ring-4 ring-black flex-shrink-0 z-10" />
        {/* Line */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-neutral/30 to-transparent min-h-[60px]" />
        )}
      </div>

      {/* Event card */}
      <div className="flex-1 mb-8 bg-black border border-neutral/20 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:border-primary-accent/30 group">
        {/* Header with date */}
        <div className="px-5 py-3 bg-neutral/5 border-b border-neutral/10">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="holographic-text font-semibold">
              {formatDateRange(event.startDate, event.endDate, locale)}
            </p>
            <div className="flex items-center gap-2">
              {timeIndicator && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${timeIndicator.className}`}
                >
                  {timeIndicator.text}
                </span>
              )}
              {event.noClasses && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-brand-600/30 text-brand-300 border border-brand-500/40">
                  {t('calendar_no_classes')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110 text-neutral">
              <EventIcon iconType={iconType} className="w-10 h-10" />
            </div>

            {/* Text content */}
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-neutral mb-2">
                {t(event.titleKey)}
              </h3>
              {event.descriptionKey && (
                <p className="text-neutral/70 leading-relaxed">{t(event.descriptionKey)}</p>
              )}
            </div>
          </div>

          {/* Add to calendar button */}
          <div className="mt-4 pt-4 border-t border-neutral/10">
            <button
              onClick={() => {
                // Generate ICS file for download
                const icsContent = [
                  'BEGIN:VCALENDAR',
                  'VERSION:2.0',
                  'PRODID:-//FIDC//Calendar//ES',
                  'BEGIN:VEVENT',
                  `DTSTART;VALUE=DATE:${event.startDate.replace(/-/g, '')}`,
                  `DTEND;VALUE=DATE:${(event.endDate || event.startDate).replace(/-/g, '')}`,
                  `SUMMARY:${t(event.titleKey)} - FIDC`,
                  event.descriptionKey ? `DESCRIPTION:${t(event.descriptionKey)}` : '',
                  "LOCATION:Farray's International Dance Center - Carrer d'Entença 100, 08015 Barcelona",
                  `UID:${event.id}@fidc.es`,
                  'END:VEVENT',
                  'END:VCALENDAR',
                ]
                  .filter(Boolean)
                  .join('\r\n');

                const blob = new window.Blob([icsContent], {
                  type: 'text/calendar;charset=utf-8',
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${event.id}.ics`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-neutral bg-neutral/5 hover:bg-primary-accent/10 border border-neutral/20 hover:border-primary-accent/50 transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {t('calendar_add_to_calendar')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

TimelineEvent.displayName = 'TimelineEvent';

// ============ MAIN COMPONENT ============

const CalendarPage: React.FC = () => {
  const { t, locale } = useI18n();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Get all events
  const allEvents = useMemo(() => getSortedEvents(), []);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (activeFilter === 'all') return allEvents;
    return allEvents.filter(event => event.type === activeFilter);
  }, [allEvents, activeFilter]);

  // Count events by type
  const eventCounts = useMemo(() => {
    const counts: Record<FilterType, number> = {
      all: allEvents.length,
      vacation: 0,
      holiday: 0,
      event: 0,
      workshop: 0,
      info: 0,
    };

    allEvents.forEach(event => {
      counts[event.type]++;
    });

    return counts;
  }, [allEvents]);

  // Generate Schema.org Event markup
  const eventsSchema = useMemo(() => {
    const schemaEvents: EventSchemaItem[] = allEvents.map(event => ({
      '@type': 'Event',
      name: t(event.titleKey),
      description: event.descriptionKey ? t(event.descriptionKey) : undefined,
      startDate: event.startDate,
      endDate: event.endDate || event.startDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: "Farray's International Dance Center",
        address: {
          '@type': 'PostalAddress',
          streetAddress: "Carrer d'Entença, 100",
          addressLocality: 'Barcelona',
          postalCode: '08015',
          addressCountry: 'ES',
        },
      },
      organizer: {
        '@type': 'Organization',
        name: "Farray's International Dance Center",
        url: 'https://www.fidcbarcelona.com',
      },
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: schemaEvents.map((event, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: event,
      })),
    };
  }, [allEvents, t]);

  const handleFilterClick = useCallback((filter: FilterType) => {
    setActiveFilter(filter);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('calendar_page_title')} | FIDC Barcelona</title>
        <meta name="description" content={t('calendar_page_description')} />
        <script type="application/ld+json">{JSON.stringify(eventsSchema)}</script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-b from-black via-primary-dark/20 to-black">
        <div className="container mx-auto px-6 text-center">
          <AnimateOnScroll>
            <h1
              className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
            >
              {t('calendar_page_heading')}
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll delay={100}>
            <p className="text-lg md:text-xl text-neutral/70 max-w-2xl mx-auto">
              {t('calendar_page_subheading')}
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-black border-b border-neutral/10">
        <div className="container mx-auto px-6">
          <AnimateOnScroll>
            <div className="flex flex-wrap justify-center gap-3">
              <FilterButton
                type="all"
                isActive={activeFilter === 'all'}
                onClick={() => handleFilterClick('all')}
                label={t('calendar_filter_all')}
                count={eventCounts.all}
              />
              {(Object.keys(EVENT_COLORS) as CalendarEventType[]).map(type => (
                <FilterButton
                  key={type}
                  type={type}
                  isActive={activeFilter === type}
                  onClick={() => handleFilterClick(type)}
                  label={t(`calendar_type_${type}`)}
                  count={eventCounts[type]}
                />
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 md:py-16 bg-black" aria-labelledby="timeline-heading">
        <div className="container mx-auto px-6">
          <h2 id="timeline-heading" className="sr-only">
            {t('calendar_timeline_heading')}
          </h2>
          <div className="max-w-3xl mx-auto">
            {filteredEvents.length === 0 ? (
              <AnimateOnScroll>
                <div className="text-center py-16">
                  <span className="text-6xl mb-4 block">📅</span>
                  <p className="text-neutral/70 text-lg">{t('calendar_no_events')}</p>
                </div>
              </AnimateOnScroll>
            ) : (
              filteredEvents.map((event, index) => (
                <AnimateOnScroll key={event.id} delay={index * 50}>
                  <TimelineEvent
                    event={event}
                    locale={locale}
                    t={t}
                    isLast={index === filteredEvents.length - 1}
                  />
                </AnimateOnScroll>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        {/* Background with stars */}
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <AnimateOnScroll>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 holographic-text">
              {t('calendar_cta_title')}
            </h2>
          </AnimateOnScroll>
          <div className="max-w-3xl mx-auto space-y-4 mb-12">
            <AnimateOnScroll delay={100}>
              <p className="text-lg md:text-xl text-neutral/90">{t('calendar_cta_subtitle')}</p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <p className="text-xl md:text-2xl font-bold text-neutral">
                {t('calendar_cta_line2')}
              </p>
            </AnimateOnScroll>
            <AnimateOnScroll delay={300}>
              <p className="text-2xl md:text-3xl font-bold holographic-text">
                {t('calendar_cta_line3')}
              </p>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll delay={400}>
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
              role="group"
              aria-label="Opciones de inscripción"
            >
              <div className="w-full sm:w-auto">
                <a
                  href={`/${locale}/clases/baile-barcelona`}
                  aria-describedby="calendar-cta1-desc"
                  className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] bg-primary-accent text-white font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  {t('calendar_cta_button1')}
                </a>
                <p id="calendar-cta1-desc" className="text-xs text-neutral/70 mt-2 text-center">
                  {t('calendar_cta_button1_subtext')}
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <a
                  href={`/${locale}/contacto`}
                  aria-describedby="calendar-cta2-desc"
                  className="block w-full sm:w-auto sm:min-w-[280px] min-h-[48px] border-2 border-neutral text-neutral font-bold text-base sm:text-lg py-4 sm:py-5 px-8 sm:px-12 rounded-full transition-all duration-300 hover:bg-neutral hover:text-black text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-95 motion-reduce:transform-none motion-reduce:transition-none"
                >
                  {t('calendar_cta_button2')}
                </a>
                <p id="calendar-cta2-desc" className="text-xs text-neutral/70 mt-2 text-center">
                  {t('calendar_cta_button2_subtext')}
                </p>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
};

export default CalendarPage;
