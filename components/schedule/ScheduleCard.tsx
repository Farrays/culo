import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DAYS_I18N, getClassBadges, type BadgeType } from '../../constants/horarios-page-data';
import type { ScheduleClass, LevelKey } from '../../constants/schedule-data';
import {
  CalendarDaysIcon,
  ShareIcon,
  FireIcon,
  BoltIcon,
  SparklesIcon,
  UserGroupIcon,
} from '../../lib/icons';

// Premium badge configuration with SVG icons (no emojis)
const PREMIUM_BADGES: Record<
  BadgeType,
  { Icon: React.FC<{ className?: string }>; i18nKey: string; bgClass: string }
> = {
  popular: {
    Icon: FireIcon,
    i18nKey: 'horariosV2_badge_popular',
    bgClass: 'bg-orange-500/90',
  },
  limited: {
    Icon: BoltIcon,
    i18nKey: 'horariosV2_badge_limited',
    bgClass: 'bg-amber-500/90',
  },
  new: {
    Icon: SparklesIcon,
    i18nKey: 'horariosV2_badge_new',
    bgClass: 'bg-emerald-500/90',
  },
  'small-group': {
    Icon: UserGroupIcon,
    i18nKey: 'horariosV2_badge_smallGroup',
    bgClass: 'bg-blue-500/90',
  },
};

interface ScheduleCardProps {
  scheduleClass: ScheduleClass;
  showActions?: boolean;
  colorClass?: string;
}

/**
 * Individual schedule card component
 * Displays class info with badges, time, level, and optional actions
 */
export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  scheduleClass,
  showActions = true,
  colorClass = 'primary-accent',
}) => {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;
  const badges = getClassBadges(scheduleClass.className);

  const levelLabels: Record<LevelKey, string> = {
    beginner: t('horariosV2_level_principiantes'),
    basic: t('horariosV2_level_basico'),
    intermediate: t('horariosV2_level_intermedio'),
    advanced: t('horariosV2_level_avanzado'),
    all: t('horariosV2_level_open'),
    intermediateAdvanced: t('horariosV2_level_intermedioAvanzado'),
  };

  const handleShare = async () => {
    const shareData = {
      title: `${scheduleClass.className} - Farray Center`,
      text: `Clase de ${scheduleClass.className} - ${t(DAYS_I18N[scheduleClass.day])} ${scheduleClass.time}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
    }
  };

  const cardContent = (
    <>
      {/* Badges with SVG icons */}
      {badges.length > 0 && (
        <div className="absolute -top-2 -right-2 flex gap-1">
          {badges.map(badgeType => {
            const badge = PREMIUM_BADGES[badgeType];
            if (!badge) return null;
            return (
              <span
                key={badgeType}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white shadow-lg ${badge.bgClass}`}
                title={t(badge.i18nKey)}
              >
                <badge.Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{t(badge.i18nKey)}</span>
              </span>
            );
          })}
        </div>
      )}

      {/* Class name */}
      <h4 className="font-bold text-neutral text-lg mb-2 pr-8">{scheduleClass.className}</h4>

      {/* Day and time */}
      <div className="flex items-center gap-2 text-sm text-neutral/70 mb-2">
        <span className="capitalize">{t(DAYS_I18N[scheduleClass.day])}</span>
        <span className="text-neutral/70" aria-hidden="true">
          ·
        </span>
        <span className="font-mono">{scheduleClass.time}</span>
      </div>

      {/* Level */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${colorClass}/10 text-${colorClass}`}
        >
          {levelLabels[scheduleClass.level]}
        </span>
      </div>

      {/* Teacher */}
      <p className="text-sm text-neutral/60">
        <span className="text-neutral/60">{t('horariosV2_card_teacher')}:</span>{' '}
        {scheduleClass.teacher}
      </p>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10">
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              // Generate calendar reminder
              const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Clase de ${scheduleClass.className}`)}&details=${encodeURIComponent(`Clase en Farray Center`)}&location=${encodeURIComponent("Farray's International Dance Center, Barcelona")}`;
              window.open(calendarUrl, '_blank');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral/70 hover:text-neutral hover:bg-white/10 transition-colors"
            title={t('horariosV2_card_reminder')}
          >
            <CalendarDaysIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{t('horariosV2_card_reminder')}</span>
          </button>
          <button
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleShare();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral/70 hover:text-neutral hover:bg-white/10 transition-colors"
            title={t('horariosV2_card_share')}
          >
            <ShareIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{t('horariosV2_card_share')}</span>
          </button>
        </div>
      )}
    </>
  );

  // Wrap in link if class has a page
  if (scheduleClass.link) {
    return (
      <div className="[perspective:1000px]">
        <Link
          to={`/${locale}${scheduleClass.link}`}
          className="group relative block p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] hover:shadow-lg hover:shadow-primary-accent/10"
        >
          {cardContent}
        </Link>
      </div>
    );
  }

  return (
    <div className="relative p-5 rounded-2xl bg-white/5 border border-white/10">{cardContent}</div>
  );
};

export default ScheduleCard;
