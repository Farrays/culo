import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import {
  getUpcomingEvents,
  EVENT_COLORS,
  type CalendarEvent,
  type CalendarIconType,
} from '../constants/calendar-events';
import {
  ChevronRightIcon,
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

/**
 * Format date range for display
 */
const formatDateRange = (
  startDate: string,
  endDate: string | undefined,
  locale: string
): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
  };

  const localeMap: Record<string, string> = {
    es: 'es-ES',
    ca: 'ca-ES',
    en: 'en-GB',
    fr: 'fr-FR',
  };

  const dateLocale = localeMap[locale] || 'es-ES';

  if (end && end.getTime() !== start.getTime()) {
    const startStr = start.toLocaleDateString(dateLocale, options);
    const endStr = end.toLocaleDateString(dateLocale, options);
    return `${startStr} - ${endStr}`;
  }

  return start.toLocaleDateString(dateLocale, options);
};

/**
 * Single event card component
 */
const EventCard: React.FC<{
  event: CalendarEvent;
  locale: string;
  t: (key: string) => string;
}> = memo(({ event, locale, t }) => {
  const colors = EVENT_COLORS[event.type];
  const iconType = event.iconType || colors.iconType;

  return (
    <div className="relative overflow-hidden rounded-xl bg-black border border-neutral/20 transition-all duration-300 hover:scale-[1.02] hover:border-primary-accent/30 group">
      {/* Accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-accent" />

      <div className="p-4 pl-5">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 text-neutral">
            <EventIcon iconType={iconType} className="w-7 h-7" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Date */}
            <p className="text-sm font-medium holographic-text mb-1">
              {formatDateRange(event.startDate, event.endDate, locale)}
            </p>

            {/* Title */}
            <h3 className="text-neutral font-bold text-base leading-tight mb-1 truncate">
              {t(event.titleKey)}
            </h3>

            {/* No classes badge */}
            {event.noClasses && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-500/30 text-rose-300 border border-rose-500/40">
                {t('calendar_no_classes')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

EventCard.displayName = 'EventCard';

/**
 * CalendarWidget Component
 * Displays upcoming events on the Home page
 */
const CalendarWidget: React.FC = memo(() => {
  const { t, locale } = useI18n();

  // Get next 4 upcoming events
  const upcomingEvents = useMemo(() => getUpcomingEvents(4), []);

  if (upcomingEvents.length === 0) {
    return null;
  }

  return (
    <section id="calendario" className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-3 holographic-text">
              {t('calendar_widget_title')}
            </h2>
            <p className="text-neutral/70 max-w-2xl mx-auto">{t('calendar_widget_subtitle')}</p>
          </div>
        </AnimateOnScroll>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {upcomingEvents.map((event, index) => (
            <AnimateOnScroll key={event.id} delay={index * 100}>
              <EventCard event={event} locale={locale} t={t} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA */}
        <AnimateOnScroll delay={400}>
          <div className="text-center">
            <Link
              to={`/${locale}/calendario`}
              className="inline-flex items-center gap-2 text-primary-accent hover:text-white transition-colors duration-300 font-semibold group"
            >
              {t('calendar_view_full')}
              <ChevronRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
});

CalendarWidget.displayName = 'CalendarWidget';

export default CalendarWidget;
