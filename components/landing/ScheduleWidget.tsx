/**
 * ScheduleWidget - Widget de horarios para landing pages
 * Muestra todas las clases con filtros pero sin navegación (no clicables)
 * Diseñado para Jornada Puertas Abiertas y eventos similares
 */
import { useState, useMemo, useCallback, memo } from 'react';
import { useI18n } from '../../hooks/useI18n';
import {
  SCHEDULE_DATA,
  DAY_ORDER,
  filterClasses,
  getCountByCategory,
  getCountByLevel,
  type DayKey,
  type CategoryKey,
  type LevelKey,
  type ScheduleClass,
} from '../../constants/horarios-schedule-data';
import { ClockIcon, UserIcon, AcademicCapIcon } from '../../lib/icons';
import type { LandingTheme } from '../../constants/landing-template-config';

// ============================================================================
// TYPES
// ============================================================================

type FilterDay = DayKey | 'all';
type FilterCategory = CategoryKey | 'all';
type FilterLevel = LevelKey | 'all';
type FilterTimeOfDay = 'all' | 'morning' | 'evening';

interface ScheduleWidgetProps {
  /** Tema visual de la landing */
  theme: LandingTheme;
  /** Si las clases son clicables (default: false) */
  clickable?: boolean;
  /** Mostrar filtros (default: true) */
  showFilters?: boolean;
  /** Prefijo de traducción para títulos */
  translationPrefix?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DAY_LABELS: Record<DayKey | 'all', string> = {
  all: 'Todos',
  monday: 'Lun',
  tuesday: 'Mar',
  wednesday: 'Mié',
  thursday: 'Jue',
  friday: 'Vie',
  saturday: 'Sáb',
  sunday: 'Dom',
};

const CATEGORY_CONFIG: Record<
  CategoryKey,
  { labelKey: string; bgClass: string; textClass: string; borderClass: string }
> = {
  latino: {
    labelKey: 'schedule_category_latino',
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  urbano: {
    labelKey: 'schedule_category_urbano',
    bgClass: 'bg-brand-600/20',
    textClass: 'text-brand-400',
    borderClass: 'border-brand-500/30',
  },
  danza: {
    labelKey: 'schedule_category_danza',
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  fitness: {
    labelKey: 'schedule_category_fitness',
    bgClass: 'bg-sky-500/20',
    textClass: 'text-sky-400',
    borderClass: 'border-sky-500/30',
  },
};

const LEVEL_CONFIG: Record<LevelKey, { labelKey: string; colorClass: string }> = {
  beginner: { labelKey: 'schedule_level_beginner', colorClass: 'text-emerald-400' },
  basic: { labelKey: 'schedule_level_basic', colorClass: 'text-sky-400' },
  intermediate: { labelKey: 'schedule_level_intermediate', colorClass: 'text-amber-400' },
  advanced: { labelKey: 'schedule_level_advanced', colorClass: 'text-brand-400' },
  intermediateAdvanced: {
    labelKey: 'schedule_level_intermediateAdvanced',
    colorClass: 'text-purple-400',
  },
  all: { labelKey: 'schedule_level_all', colorClass: 'text-neutral/70' },
};

const TIME_OF_DAY_CONFIG: Record<
  FilterTimeOfDay,
  { labelKey: string; bgClass: string; textClass: string; borderClass: string }
> = {
  all: {
    labelKey: 'schedule_time_all',
    bgClass: 'bg-primary-accent/20',
    textClass: 'text-primary-accent',
    borderClass: 'border-primary-accent/50',
  },
  morning: {
    labelKey: 'schedule_time_morning',
    bgClass: 'bg-yellow-500/20',
    textClass: 'text-yellow-400',
    borderClass: 'border-yellow-500/30',
  },
  evening: {
    labelKey: 'schedule_time_evening',
    bgClass: 'bg-indigo-500/20',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/30',
  },
};

const isMorningClass = (time: string): boolean => {
  const hourPart = time.split(':')[0] ?? '0';
  const hour = parseInt(hourPart, 10);
  return hour < 14;
};

const LEVEL_FILTER_ORDER: LevelKey[] = ['beginner', 'basic', 'intermediate', 'advanced'];

const LEVEL_FILTER_CONFIG: Record<
  LevelKey,
  { labelKey: string; bgClass: string; textClass: string; borderClass: string }
> = {
  beginner: {
    labelKey: 'schedule_level_beginner',
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/30',
  },
  basic: {
    labelKey: 'schedule_level_basic',
    bgClass: 'bg-sky-500/20',
    textClass: 'text-sky-400',
    borderClass: 'border-sky-500/30',
  },
  intermediate: {
    labelKey: 'schedule_level_intermediate',
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500/30',
  },
  advanced: {
    labelKey: 'schedule_level_advanced',
    bgClass: 'bg-brand-600/20',
    textClass: 'text-brand-400',
    borderClass: 'border-brand-500/30',
  },
  intermediateAdvanced: {
    labelKey: 'schedule_level_intermediateAdvanced',
    bgClass: 'bg-purple-500/20',
    textClass: 'text-purple-400',
    borderClass: 'border-purple-500/30',
  },
  all: {
    labelKey: 'schedule_level_all',
    bgClass: 'bg-white/10',
    textClass: 'text-neutral/70',
    borderClass: 'border-white/20',
  },
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const DayTab = memo(
  ({
    label,
    isActive,
    onClick,
    count,
    theme,
  }: {
    label: string;
    isActive: boolean;
    onClick: () => void;
    count: number;
    theme: LandingTheme;
  }) => (
    <button
      onClick={onClick}
      className={`
        relative px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-medium text-sm
        transition-all duration-300 ease-out
        ${
          isActive
            ? `${theme.classes.bgPrimary} text-white shadow-lg ${theme.classes.shadowPrimary}`
            : 'bg-white/5 text-neutral/70 hover:bg-white/10 hover:text-neutral'
        }
      `}
      aria-pressed={isActive}
    >
      <span className="relative z-10">{label}</span>
      {count > 0 && (
        <span
          className={`
            absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
            flex items-center justify-center
            text-[10px] font-bold rounded-full
            ${isActive ? `bg-white ${theme.classes.textPrimary}` : `${theme.classes.bgPrimary} text-white`}
          `}
        >
          {count}
        </span>
      )}
    </button>
  )
);

DayTab.displayName = 'DayTab';

const CategoryChip = memo(
  ({
    category,
    label,
    isActive,
    onClick,
    count,
  }: {
    category: FilterCategory;
    label: string;
    isActive: boolean;
    onClick: () => void;
    count: number;
  }) => {
    const config = category !== 'all' ? CATEGORY_CONFIG[category] : null;

    return (
      <button
        onClick={onClick}
        className={`
          px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium
          transition-all duration-300 ease-out
          border flex items-center gap-1.5
          ${
            isActive
              ? config
                ? `${config.bgClass} ${config.textClass} ${config.borderClass}`
                : 'bg-primary-accent/20 text-primary-accent border-primary-accent/50'
              : 'bg-white/5 text-neutral/60 border-white/10 hover:border-white/30 hover:text-neutral/80'
          }
        `}
        aria-pressed={isActive}
      >
        <span>{label}</span>
        <span
          className={`
            px-1.5 py-0.5 rounded-full text-[10px] font-bold
            ${isActive ? 'bg-white/20' : 'bg-white/10'}
          `}
        >
          {count}
        </span>
      </button>
    );
  }
);

CategoryChip.displayName = 'CategoryChip';

const LevelChip = memo(
  ({
    level,
    label,
    isActive,
    onClick,
    count,
  }: {
    level: FilterLevel;
    label: string;
    isActive: boolean;
    onClick: () => void;
    count: number;
  }) => {
    const config = level !== 'all' ? LEVEL_FILTER_CONFIG[level] : null;

    return (
      <button
        onClick={onClick}
        className={`
          px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium
          transition-all duration-300 ease-out
          border flex items-center gap-1.5
          ${
            isActive
              ? config
                ? `${config.bgClass} ${config.textClass} ${config.borderClass}`
                : 'bg-primary-accent/20 text-primary-accent border-primary-accent/50'
              : 'bg-white/5 text-neutral/60 border-white/10 hover:border-white/30 hover:text-neutral/80'
          }
        `}
        aria-pressed={isActive}
      >
        <AcademicCapIcon className="w-3 h-3" />
        <span>{label}</span>
        <span
          className={`
            px-1.5 py-0.5 rounded-full text-[10px] font-bold
            ${isActive ? 'bg-white/20' : 'bg-white/10'}
          `}
        >
          {count}
        </span>
      </button>
    );
  }
);

LevelChip.displayName = 'LevelChip';

const TimeOfDayChip = memo(
  ({
    timeOfDay,
    label,
    isActive,
    onClick,
    count,
  }: {
    timeOfDay: FilterTimeOfDay;
    label: string;
    isActive: boolean;
    onClick: () => void;
    count: number;
  }) => {
    const config = TIME_OF_DAY_CONFIG[timeOfDay];

    return (
      <button
        onClick={onClick}
        className={`
          px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium
          transition-all duration-300 ease-out
          border flex items-center gap-1.5
          ${
            isActive
              ? `${config.bgClass} ${config.textClass} ${config.borderClass}`
              : 'bg-white/5 text-neutral/60 border-white/10 hover:border-white/30 hover:text-neutral/80'
          }
        `}
        aria-pressed={isActive}
      >
        <ClockIcon className="w-3 h-3" />
        <span>{label}</span>
        <span
          className={`
            px-1.5 py-0.5 rounded-full text-[10px] font-bold
            ${isActive ? 'bg-white/20' : 'bg-white/10'}
          `}
        >
          {count}
        </span>
      </button>
    );
  }
);

TimeOfDayChip.displayName = 'TimeOfDayChip';

/**
 * ClassCardStatic - Tarjeta de clase NO clicable (solo visualización)
 */
const ClassCardStatic = memo(
  ({ classData, t }: { classData: ScheduleClass; t: (key: string) => string }) => {
    const categoryConfig = CATEGORY_CONFIG[classData.category];
    const levelConfig = LEVEL_CONFIG[classData.level];

    return (
      <div
        className={`
          relative flex items-center gap-4 p-4
          bg-black/40 backdrop-blur-sm rounded-xl
          border border-white/5
        `}
      >
        {/* Time Column */}
        <div className="flex-shrink-0 w-14 text-center">
          <div className="text-lg font-bold text-neutral">{classData.time}</div>
        </div>

        {/* Divider */}
        <div className={`w-0.5 h-12 rounded-full ${categoryConfig.bgClass}`} />

        {/* Content */}
        <div className="flex-grow min-w-0">
          {/* Class Name */}
          <h4 className="font-bold text-neutral truncate">{classData.className}</h4>

          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral/60">
            {/* Teacher */}
            <span className="flex items-center gap-1">
              <UserIcon className="w-3 h-3" />
              {classData.teacher}
            </span>

            {/* Level */}
            <span className={`flex items-center gap-1 ${levelConfig.colorClass}`}>
              <AcademicCapIcon className="w-3 h-3" />
              {t(levelConfig.labelKey)}
            </span>
          </div>
        </div>

        {/* Category Badge */}
        <div
          className={`
            hidden sm:flex flex-shrink-0 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide
            ${categoryConfig.bgClass} ${categoryConfig.textClass}
          `}
        >
          {t(categoryConfig.labelKey)}
        </div>
      </div>
    );
  }
);

ClassCardStatic.displayName = 'ClassCardStatic';

const EmptyState = memo(({ t }: { t: (key: string) => string }) => (
  <div className="text-center py-12">
    <ClockIcon className="w-12 h-12 text-neutral/30 mx-auto mb-4" />
    <p className="text-neutral/70 text-lg">{t('schedule_no_classes')}</p>
    <p className="text-neutral/40 text-sm mt-1">{t('schedule_try_other_day')}</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({
  theme,
  showFilters = true,
  translationPrefix = 'jpaLanding',
}) => {
  const { t } = useI18n();

  // Filter state
  const [selectedDay, setSelectedDay] = useState<FilterDay>('all');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [selectedLevel, setSelectedLevel] = useState<FilterLevel>('all');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<FilterTimeOfDay>('all');

  // Get category counts
  const categoryCounts = useMemo(() => getCountByCategory(), []);

  // Get level counts
  const levelCounts = useMemo(() => getCountByLevel(), []);

  // Get time of day counts
  const timeOfDayCounts = useMemo(() => {
    const morningCount = SCHEDULE_DATA.filter(c => isMorningClass(c.time)).length;
    const eveningCount = SCHEDULE_DATA.filter(c => !isMorningClass(c.time)).length;
    return {
      all: SCHEDULE_DATA.length,
      morning: morningCount,
      evening: eveningCount,
    };
  }, []);

  // Get day counts for current category, level, and time of day
  const dayCountsForCategory = useMemo(() => {
    const counts: Record<DayKey | 'all', number> = {
      all: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0,
      sunday: 0,
    };

    SCHEDULE_DATA.forEach(c => {
      const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || c.level === selectedLevel;
      const matchesTimeOfDay =
        selectedTimeOfDay === 'all' ||
        (selectedTimeOfDay === 'morning' && isMorningClass(c.time)) ||
        (selectedTimeOfDay === 'evening' && !isMorningClass(c.time));
      if (matchesCategory && matchesLevel && matchesTimeOfDay) {
        counts[c.day]++;
        counts.all++;
      }
    });

    return counts;
  }, [selectedCategory, selectedLevel, selectedTimeOfDay]);

  // Filtered classes (including time of day filter)
  const filteredClasses = useMemo(() => {
    let classes = filterClasses(selectedDay, selectedCategory, selectedLevel);

    // Apply time of day filter
    if (selectedTimeOfDay === 'morning') {
      classes = classes.filter(c => isMorningClass(c.time));
    } else if (selectedTimeOfDay === 'evening') {
      classes = classes.filter(c => !isMorningClass(c.time));
    }

    return classes;
  }, [selectedDay, selectedCategory, selectedLevel, selectedTimeOfDay]);

  // Handlers
  const handleDayChange = useCallback((day: FilterDay) => {
    setSelectedDay(day);
  }, []);

  const handleCategoryChange = useCallback((category: FilterCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleLevelChange = useCallback((level: FilterLevel) => {
    setSelectedLevel(level);
  }, []);

  const handleTimeOfDayChange = useCallback((timeOfDay: FilterTimeOfDay) => {
    setSelectedTimeOfDay(timeOfDay);
  }, []);

  // Active days (All + Mon-Fri, excluding weekend as no classes)
  const activeDays: FilterDay[] = [
    'all',
    ...DAY_ORDER.filter(day => day !== 'saturday' && day !== 'sunday'),
  ];

  return (
    <section
      id="schedule-widget"
      className="py-12 md:py-16 bg-gradient-to-b from-black via-primary-dark/5 to-black"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4`}
          >
            {t(`${translationPrefix}ScheduleTitle`)}
          </h2>
          <p className="text-neutral/70 max-w-2xl mx-auto">
            {t(`${translationPrefix}ScheduleSubtitle`)}
          </p>
        </div>

        {/* Filters Container */}
        {showFilters && (
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            {/* Day Tabs */}
            <div className="flex justify-center">
              <div className="inline-flex gap-1.5 p-1.5 bg-black/50 backdrop-blur-md rounded-xl border border-white/10">
                {activeDays.map(day => (
                  <DayTab
                    key={day}
                    label={DAY_LABELS[day]}
                    isActive={selectedDay === day}
                    onClick={() => handleDayChange(day)}
                    count={dayCountsForCategory[day]}
                    theme={theme}
                  />
                ))}
              </div>
            </div>

            {/* Time of Day Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {(['all', 'morning', 'evening'] as FilterTimeOfDay[]).map(timeOfDay => (
                <TimeOfDayChip
                  key={timeOfDay}
                  timeOfDay={timeOfDay}
                  label={t(TIME_OF_DAY_CONFIG[timeOfDay].labelKey)}
                  isActive={selectedTimeOfDay === timeOfDay}
                  onClick={() => handleTimeOfDayChange(timeOfDay)}
                  count={timeOfDayCounts[timeOfDay]}
                />
              ))}
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              <CategoryChip
                category="all"
                label={t('schedule_category_all')}
                isActive={selectedCategory === 'all'}
                onClick={() => handleCategoryChange('all')}
                count={categoryCounts.all}
              />
              {(Object.keys(CATEGORY_CONFIG) as CategoryKey[]).map(cat => (
                <CategoryChip
                  key={cat}
                  category={cat}
                  label={t(CATEGORY_CONFIG[cat].labelKey)}
                  isActive={selectedCategory === cat}
                  onClick={() => handleCategoryChange(cat)}
                  count={categoryCounts[cat]}
                />
              ))}
            </div>

            {/* Level Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              <LevelChip
                level="all"
                label={t('schedule_level_all')}
                isActive={selectedLevel === 'all'}
                onClick={() => handleLevelChange('all')}
                count={levelCounts.all}
              />
              {LEVEL_FILTER_ORDER.map(lvl => (
                <LevelChip
                  key={lvl}
                  level={lvl}
                  label={t(LEVEL_FILTER_CONFIG[lvl].labelKey)}
                  isActive={selectedLevel === lvl}
                  onClick={() => handleLevelChange(lvl)}
                  count={levelCounts[lvl]}
                />
              ))}
            </div>

            {/* Results Counter */}
            <div className="text-center">
              <span className="text-sm text-neutral/70">
                {filteredClasses.length} {t('schedule_classes_found')}
              </span>
            </div>
          </div>
        )}

        {/* Schedule Grid */}
        <div className="max-w-3xl mx-auto">
          {filteredClasses.length > 0 ? (
            <div className="space-y-3">
              {filteredClasses.map((classData, index) => (
                <div
                  key={classData.id}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ClassCardStatic classData={classData} t={t} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState t={t} />
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(ScheduleWidget);
