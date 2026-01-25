import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface CountdownTimerProps {
  /** Target date for countdown */
  targetDate: Date;
  /** Callback when countdown expires */
  onExpire?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Show labels (d, h, m, s) */
  showLabels?: boolean;
  /** Compact mode (smaller text) */
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

/**
 * CountdownTimer - Accessible countdown component
 *
 * Features:
 * - Updates every second
 * - Accessible with aria-live for screen readers
 * - Supports motion-reduce preferences
 * - i18n support for labels
 * - Compact and full modes
 */
const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onExpire,
  className = '',
  showLabels = true,
  compact = false,
}) => {
  const { t } = useTranslation(['common']);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date().getTime();
    const target = targetDate.getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      expired: false,
    };
  }, [targetDate]);

  // Initialize with static values to avoid hydration mismatch
  // The actual time will be calculated in useEffect after mount
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });
  const [hasExpired, setHasExpired] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Calculate initial time after mount to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setTimeLeft(calculateTimeLeft());
  }, [calculateTimeLeft]);

  useEffect(() => {
    // Don't start interval until client-side or if already expired
    if (!isClient || hasExpired) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.expired && !hasExpired) {
        setHasExpired(true);
        onExpire?.();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, hasExpired, onExpire, isClient]);

  // Get translated labels
  const labels = {
    days: t('exitIntent_days') || 'd',
    hours: t('exitIntent_hours') || 'h',
    minutes: t('exitIntent_minutes') || 'm',
    seconds: t('exitIntent_seconds') || 's',
  };

  // If expired, show expired message
  if (timeLeft.expired) {
    return (
      <div
        className={`text-neutral/60 ${compact ? 'text-sm' : 'text-base'} ${className}`}
        role="timer"
        aria-live="polite"
      >
        {t('exitIntent_countdown_expired') || 'Oferta finalizada'}
      </div>
    );
  }

  // Accessibility: Create readable string for screen readers
  const accessibleTime = `${timeLeft.days} días, ${timeLeft.hours} horas, ${timeLeft.minutes} minutos, ${timeLeft.seconds} segundos`;

  return (
    <div
      className={`flex items-center gap-1 sm:gap-2 ${className}`}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
      aria-label={accessibleTime}
    >
      {/* Days */}
      {timeLeft.days > 0 && (
        <TimeUnit
          value={timeLeft.days}
          label={labels.days}
          showLabel={showLabels}
          compact={compact}
        />
      )}

      {/* Hours */}
      <TimeUnit
        value={timeLeft.hours}
        label={labels.hours}
        showLabel={showLabels}
        compact={compact}
      />

      {/* Separator */}
      <span
        className={`text-primary-accent font-bold ${compact ? 'text-lg' : 'text-xl'} motion-reduce:animate-none`}
        aria-hidden="true"
      >
        :
      </span>

      {/* Minutes */}
      <TimeUnit
        value={timeLeft.minutes}
        label={labels.minutes}
        showLabel={showLabels}
        compact={compact}
      />

      {/* Separator */}
      <span
        className={`text-primary-accent font-bold ${compact ? 'text-lg' : 'text-xl'} motion-reduce:animate-none`}
        aria-hidden="true"
      >
        :
      </span>

      {/* Seconds */}
      <TimeUnit
        value={timeLeft.seconds}
        label={labels.seconds}
        showLabel={showLabels}
        compact={compact}
        isSeconds
      />
    </div>
  );
};

// Individual time unit component
interface TimeUnitProps {
  value: number;
  label: string;
  showLabel: boolean;
  compact: boolean;
  isSeconds?: boolean;
}

const TimeUnit: React.FC<TimeUnitProps> = ({
  value,
  label,
  showLabel,
  compact,
  isSeconds = false,
}) => {
  const formattedValue = value.toString().padStart(2, '0');

  return (
    <div className="flex items-baseline gap-0.5">
      <span
        className={`
          font-mono font-bold tabular-nums
          ${compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'}
          ${isSeconds ? 'text-primary-accent' : 'text-neutral'}
          motion-reduce:transition-none
        `}
      >
        {formattedValue}
      </span>
      {showLabel && (
        <span
          className={`
            font-medium text-neutral/60
            ${compact ? 'text-xs' : 'text-sm'}
          `}
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default CountdownTimer;
