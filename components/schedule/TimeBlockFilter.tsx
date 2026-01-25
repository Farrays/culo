import React from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollToSection } from '../../hooks/useActiveSection';
import { type TimeBlock } from '../../constants/horarios-page-data';
import type { CategoryKey } from '../../constants/schedule-data';
import {
  SunIcon,
  ClockIcon,
  MoonIcon,
  AcademicCapIcon,
  MusicalNoteIcon,
  FireIcon,
  HeartIcon,
} from '../../lib/icons';
import AnimateOnScroll from '../AnimateOnScroll';

// Premium time block data with SVG icons
const PREMIUM_TIME_BLOCKS = [
  {
    id: 'morning' as TimeBlock,
    i18nKey: 'horariosV2_filter_morning',
    Icon: SunIcon,
    anchorId: 'mananas',
    timeRange: '09:00 - 13:00',
    color: 'text-amber-400',
    bgColor: 'from-amber-500/20 to-amber-600/5',
    borderColor: 'border-amber-500/30 hover:border-amber-400/50',
  },
  {
    id: 'afternoon' as TimeBlock,
    i18nKey: 'horariosV2_filter_afternoon',
    Icon: ClockIcon,
    anchorId: 'tardes-danza',
    timeRange: '17:00 - 19:00',
    color: 'text-orange-400',
    bgColor: 'from-orange-500/20 to-orange-600/5',
    borderColor: 'border-orange-500/30 hover:border-orange-400/50',
  },
  {
    id: 'evening' as TimeBlock,
    i18nKey: 'horariosV2_filter_evening',
    Icon: MoonIcon,
    anchorId: 'salsa-bachata',
    timeRange: '19:00 - 22:00',
    color: 'text-indigo-400',
    bgColor: 'from-indigo-500/20 to-indigo-600/5',
    borderColor: 'border-indigo-500/30 hover:border-indigo-400/50',
  },
];

// Premium style category data with SVG icons
const PREMIUM_STYLE_CATEGORIES = [
  {
    id: 'danza' as CategoryKey,
    i18nKey: 'horariosV2_filter_danza',
    styles: ['Ballet', 'Jazz', 'Contemporaneo'],
    Icon: AcademicCapIcon,
    anchorId: 'tardes-danza',
    color: 'text-emerald-400',
    bgColor: 'from-emerald-500/10 to-emerald-600/5',
  },
  {
    id: 'latino' as CategoryKey,
    i18nKey: 'horariosV2_filter_latino',
    styles: ['Salsa', 'Bachata', 'Timba'],
    Icon: MusicalNoteIcon,
    anchorId: 'salsa-bachata',
    color: 'text-brand-400',
    bgColor: 'from-brand-600/10 to-brand-700/5',
  },
  {
    id: 'urbano' as CategoryKey,
    i18nKey: 'horariosV2_filter_urbano',
    styles: ['Dancehall', 'Hip Hop', 'Reggaeton'],
    Icon: FireIcon,
    anchorId: 'urbano',
    color: 'text-orange-400',
    bgColor: 'from-orange-500/10 to-orange-600/5',
  },
  {
    id: 'fitness' as CategoryKey,
    i18nKey: 'horariosV2_filter_fitness',
    styles: ['Stretching', 'Bum Bum'],
    Icon: HeartIcon,
    anchorId: 'mananas',
    color: 'text-brand-400',
    bgColor: 'from-brand-500/10 to-brand-600/5',
  },
];

interface TimeBlockFilterProps {
  onTimeSelect?: (timeBlock: TimeBlock) => void;
  onCategorySelect?: (category: CategoryKey) => void;
  selectedTime?: TimeBlock | null;
  selectedCategory?: CategoryKey | null;
}

/**
 * Premium visual filter component for schedule page
 * Allows filtering by time of day and dance style category
 * Features 3D card effects and SVG icons
 */
export const TimeBlockFilter: React.FC<TimeBlockFilterProps> = ({
  onTimeSelect,
  onCategorySelect,
  selectedTime,
  selectedCategory,
}) => {
  const { t } = useTranslation(['common']);
  const scrollToSection = useScrollToSection();

  const handleTimeClick = (block: (typeof PREMIUM_TIME_BLOCKS)[0]) => {
    scrollToSection(block.anchorId);
    onTimeSelect?.(block.id);
  };

  const handleCategoryClick = (category: (typeof PREMIUM_STYLE_CATEGORIES)[0]) => {
    scrollToSection(category.anchorId);
    onCategorySelect?.(category.id);
  };

  return (
    <section id="schedule-filter" className="py-12 md:py-16" aria-labelledby="filter-title">
      <div className="max-w-5xl mx-auto px-4">
        <AnimateOnScroll>
          <h2
            id="filter-title"
            className="text-2xl md:text-3xl font-bold text-center mb-4 text-neutral"
          >
            {t('horariosV2_filter_title')}
          </h2>
          <p className="text-center text-neutral/60 mb-10 max-w-2xl mx-auto">
            {t('horariosV2_filter_subtitle')}
          </p>
        </AnimateOnScroll>

        {/* Step 1: Time of day */}
        <div className="mb-10">
          <p className="text-sm text-neutral/70 mb-5 text-center font-medium uppercase tracking-wider">
            {t('horariosV2_filter_step1')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {PREMIUM_TIME_BLOCKS.map((block, index) => {
              const isSelected = selectedTime === block.id;
              return (
                <AnimateOnScroll key={block.id} delay={index * 100}>
                  <div className="[perspective:800px]">
                    <button
                      onClick={() => handleTimeClick(block)}
                      className={`group flex flex-col items-center gap-3 px-8 py-6 rounded-2xl border-2 transition-all duration-500 min-w-[140px] [transform-style:preserve-3d] ${
                        isSelected
                          ? `bg-gradient-to-br ${block.bgColor} border-primary-accent text-primary-accent shadow-lg shadow-primary-accent/20 [transform:translateY(-4px)]`
                          : `bg-black/40 backdrop-blur-md ${block.borderColor} text-neutral/80 hover:bg-white/5 hover:[transform:translateY(-6px)_rotateY(5deg)_rotateX(5deg)] hover:shadow-xl hover:shadow-white/5`
                      }`}
                      data-track="filter_time_click"
                      data-track-value={block.id}
                      aria-pressed={isSelected}
                    >
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-primary-accent/20'
                            : `bg-white/5 group-hover:bg-white/10 group-hover:scale-110`
                        } ${block.color}`}
                      >
                        <block.Icon className="w-7 h-7" />
                      </div>
                      <span className="font-bold text-lg">{t(block.i18nKey)}</span>
                      <span className="text-xs text-neutral/70 font-medium">{block.timeRange}</span>
                    </button>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 my-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-neutral/60 text-sm font-medium uppercase tracking-wider">
            {t('horariosV2_filter_or')}
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* Step 2: Style category */}
        <div>
          <p className="text-sm text-neutral/70 mb-5 text-center font-medium uppercase tracking-wider">
            {t('horariosV2_filter_step2')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PREMIUM_STYLE_CATEGORIES.map((category, index) => {
              const isSelected = selectedCategory === category.id;
              return (
                <AnimateOnScroll key={category.id} delay={index * 75}>
                  <div className="[perspective:800px] h-full">
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className={`group w-full h-full flex flex-col items-center gap-3 px-4 py-5 rounded-2xl border transition-all duration-500 [transform-style:preserve-3d] ${
                        isSelected
                          ? `bg-gradient-to-br ${category.bgColor} border-primary-accent text-primary-accent shadow-lg shadow-primary-accent/10`
                          : 'bg-black/40 backdrop-blur-md border-white/10 text-neutral/80 hover:bg-white/5 hover:border-white/20 hover:[transform:translateY(-4px)_rotateX(5deg)] hover:shadow-lg'
                      }`}
                      data-track="filter_style_click"
                      data-track-value={category.id}
                      aria-pressed={isSelected}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isSelected
                            ? 'bg-primary-accent/20'
                            : 'bg-white/5 group-hover:bg-white/10 group-hover:scale-110'
                        } ${category.color}`}
                      >
                        <category.Icon className="w-6 h-6" />
                      </div>
                      <span className="font-semibold">{t(category.i18nKey)}</span>
                      <span className="text-xs text-neutral/70 text-center leading-tight">
                        {category.styles.join(' · ')}
                      </span>
                    </button>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeBlockFilter;
