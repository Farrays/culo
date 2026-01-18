import React, { memo } from 'react';
import AnimateOnScroll from './AnimateOnScroll';
import type { ScheduleSession } from '../hooks/useScheduleSessions';

interface DynamicScheduleSectionProps {
  id?: string;
  /** Translation function */
  t: (_key: string) => string;
  /** Schedule sessions to display */
  sessions: ScheduleSession[];
  /** Loading state */
  loading?: boolean;
  /** Error message */
  error?: string | null;
  /** Whether the schedule is empty (vacation) */
  isEmpty?: boolean;
  /** Title key for i18n */
  titleKey?: string;
  /** Subtitle key for i18n */
  subtitleKey?: string;
  /** Show availability info (spots available) */
  showAvailability?: boolean;
  /** Callback when user wants to be notified (for vacation state) */
  onNotifyMe?: () => void;
  /** Custom empty state message key */
  emptyMessageKey?: string;
  /** Custom empty state CTA key */
  emptyCTAKey?: string;
  /** Whether using fallback data */
  usingFallback?: boolean;
  /** Show section header (title/subtitle) - set false when embedded in LazyDynamicScheduleSection */
  showHeader?: boolean;
  /** Render as fragment without section wrapper - for embedding in parent section */
  embedded?: boolean;
}

// Skeleton loader for schedule cards
const ScheduleSkeleton = memo(function ScheduleSkeleton() {
  return (
    <div className="animate-pulse">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="mb-4 p-6 min-h-[140px] bg-black/30 backdrop-blur-md border border-primary-dark/30 rounded-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-primary-dark/20" />
              <div className="space-y-2">
                <div className="h-6 w-48 bg-primary-dark/20 rounded" />
                <div className="h-4 w-24 bg-primary-dark/20 rounded" />
              </div>
            </div>
            <div className="flex flex-col md:items-end gap-2">
              <div className="h-8 w-20 bg-primary-dark/20 rounded" />
              <div className="h-4 w-32 bg-primary-dark/20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

// Empty state component for vacation periods
const VacationNotice = memo(function VacationNotice({
  t,
  onNotifyMe,
  messageKey = 'scheduleVacationMessage',
  ctaKey = 'scheduleVacationCTA',
}: {
  t: (_key: string) => string;
  onNotifyMe?: () => void;
  messageKey?: string;
  ctaKey?: string;
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-accent/20 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-primary-accent"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-neutral mb-2">{t(messageKey)}</h3>
        <p className="text-neutral/70 mb-6">{t('scheduleVacationSubtext')}</p>
        {onNotifyMe && (
          <button
            onClick={onNotifyMe}
            className="px-6 py-3 bg-primary-accent text-black font-bold rounded-lg hover:bg-primary-accent/90 transition-colors"
          >
            {t(ctaKey)}
          </button>
        )}
      </div>
    </div>
  );
});

// Error state component
const ErrorNotice = memo(function ErrorNotice({
  t,
  error,
  onRetry,
}: {
  t: (_key: string) => string;
  error: string;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-8 px-6">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-red-400 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-white/10 text-neutral rounded-lg hover:bg-white/20 transition-colors"
          >
            {t('retry')}
          </button>
        )}
      </div>
    </div>
  );
});

// Schedule card component with date display
const ScheduleCard = memo(function ScheduleCard({
  session,
  t,
  showAvailability,
  index,
}: {
  session: ScheduleSession;
  t: (_key: string) => string;
  showAvailability?: boolean;
  index: number;
}) {
  // Get localized short day name using translation keys
  const dayShort = t(`dayShort_${session.dayKey}`) || session.dayOfWeek.slice(0, 3);

  return (
    <AnimateOnScroll delay={index * 80}>
      <div
        className={`group p-6 min-h-[140px] bg-black/50 backdrop-blur-md border rounded-xl transition-all duration-300 hover:shadow-accent-glow ${
          session.isFull
            ? 'border-red-500/50 hover:border-red-500'
            : 'border-primary-dark/50 hover:border-primary-accent'
        }`}
        data-testid="schedule-card"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left: Date box and class info */}
          <div className="flex items-center gap-4">
            <div
              className={`flex-shrink-0 w-20 h-20 rounded-lg flex flex-col items-center justify-center border-2 ${
                session.isFull
                  ? 'bg-red-500/20 border-red-500'
                  : 'bg-primary-accent/20 border-primary-accent'
              }`}
              data-testid="schedule-date"
            >
              <span
                className={`text-xs font-bold ${session.isFull ? 'text-red-400' : 'text-primary-accent'}`}
              >
                {dayShort}
              </span>
              <span
                className={`text-sm font-black text-center leading-tight ${session.isFull ? 'text-red-400' : 'text-primary-accent'}`}
              >
                {session.dateFormatted}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral">{session.name}</h3>
            </div>
          </div>

          {/* Right: Time and availability */}
          <div className="flex flex-col md:items-end gap-1">
            <span className="text-2xl font-bold holographic-text">{session.time}</span>
            <span className="text-sm text-neutral/90">{session.instructor}</span>

            {/* Availability info */}
            {showAvailability && (
              <div className="mt-1">
                {session.isFull ? (
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400">
                    {t('classFull')}
                  </span>
                ) : (
                  <span className="text-xs text-primary-accent">
                    {session.spotsAvailable} {t('spotsAvailable')}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
});

const DynamicScheduleSection: React.FC<DynamicScheduleSectionProps> = memo(
  function DynamicScheduleSection({
    id = 'schedule',
    t,
    sessions,
    loading = false,
    error = null,
    isEmpty = false,
    titleKey = 'scheduleTitle',
    subtitleKey = 'scheduleSubtitle',
    showAvailability = false,
    onNotifyMe,
    emptyMessageKey = 'scheduleVacationMessage',
    emptyCTAKey = 'scheduleVacationCTA',
    usingFallback = false,
    showHeader = true,
    embedded = false,
  }) {
    // Content to render (cards, skeleton, error, empty state)
    const content = (
      <>
        {/* Header - only when showHeader is true */}
        {showHeader && (
          <AnimateOnScroll>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                {t(titleKey)}
              </h2>
              <p className="text-lg text-neutral/90">{t(subtitleKey)}</p>
              {usingFallback && (
                <p className="text-sm text-yellow-400/80 mt-2">{t('scheduleUsingCached')}</p>
              )}
            </div>
          </AnimateOnScroll>
        )}

        {/* Content */}
        <div className={showHeader ? 'max-w-5xl mx-auto' : ''} aria-live="polite">
          {/* Loading state */}
          {loading && <ScheduleSkeleton />}

          {/* Error state (only show if not using fallback) */}
          {error && !usingFallback && sessions.length === 0 && <ErrorNotice t={t} error={error} />}

          {/* Empty/Vacation state */}
          {!loading && isEmpty && !error && (
            <VacationNotice
              t={t}
              onNotifyMe={onNotifyMe}
              messageKey={emptyMessageKey}
              ctaKey={emptyCTAKey}
            />
          )}

          {/* Schedule cards */}
          {!loading && !isEmpty && sessions.length > 0 && (
            <div className="grid gap-4" role="list" aria-label={t('scheduleListLabel')}>
              {sessions.map((session, index) => (
                <ScheduleCard
                  key={`${session.id}-${session.rawStartsAt}`}
                  session={session}
                  t={t}
                  showAvailability={showAvailability}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );

    // When embedded, return fragment without section wrapper
    if (embedded) {
      return content;
    }

    // Standalone: wrap in section
    return (
      <section id={id} className="py-12 md:py-16 bg-primary-dark/10" data-testid="schedule-section">
        <div className="container mx-auto px-6">{content}</div>
      </section>
    );
  }
);

export default DynamicScheduleSection;

// Export sub-components for flexible use
export { ScheduleSkeleton, VacationNotice, ErrorNotice, ScheduleCard };
