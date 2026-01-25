import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import {
  ChevronDownIcon,
  SeedlingIcon,
  BookOpenIcon,
  TargetIcon,
  TrophyIcon,
  GlobeEuropeIcon,
} from '../../lib/icons';

// Premium levels data with SVG icons
const PREMIUM_LEVELS = [
  {
    id: 'beginner',
    i18nKey: 'horariosV2_level_principiantes',
    descriptionKey: 'horariosV2_level_principiantes_desc',
    Icon: SeedlingIcon,
    color: 'text-green-400',
    bgColor: 'from-green-500/20 to-green-600/5',
    borderColor: 'border-green-500/30',
  },
  {
    id: 'basic',
    i18nKey: 'horariosV2_level_basico',
    descriptionKey: 'horariosV2_level_basico_desc',
    Icon: BookOpenIcon,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-blue-600/5',
    borderColor: 'border-blue-500/30',
  },
  {
    id: 'intermediate',
    i18nKey: 'horariosV2_level_intermedio',
    descriptionKey: 'horariosV2_level_intermedio_desc',
    Icon: TargetIcon,
    color: 'text-amber-400',
    bgColor: 'from-amber-500/20 to-amber-600/5',
    borderColor: 'border-amber-500/30',
  },
  {
    id: 'advanced',
    i18nKey: 'horariosV2_level_avanzado',
    descriptionKey: 'horariosV2_level_avanzado_desc',
    Icon: TrophyIcon,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-purple-600/5',
    borderColor: 'border-purple-500/30',
  },
  {
    id: 'all',
    i18nKey: 'horariosV2_level_open',
    descriptionKey: 'horariosV2_level_open_desc',
    Icon: GlobeEuropeIcon,
    color: 'text-cyan-400',
    bgColor: 'from-cyan-500/20 to-cyan-600/5',
    borderColor: 'border-cyan-500/30',
  },
];

/**
 * Premium level guide component
 * Explains what each class level means with 3D card effects
 */
export const LevelGuide: React.FC = () => {
  const { t } = useTranslation(['common']);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null);

  return (
    <section id="niveles" className="py-12 md:py-16 scroll-mt-24" aria-labelledby="levels-title">
      <div className="max-w-5xl mx-auto px-4">
        <AnimateOnScroll>
          <h2
            id="levels-title"
            className="text-2xl md:text-3xl font-bold text-center mb-4 text-neutral"
          >
            {t('horariosV2_levels_title')}
          </h2>
          <p className="text-center text-neutral/60 mb-10 max-w-2xl mx-auto">
            {t('horariosV2_levels_subtitle')}
          </p>
        </AnimateOnScroll>

        {/* Levels grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {PREMIUM_LEVELS.map((level, index) => (
            <AnimateOnScroll key={level.id} delay={index * 75}>
              <div className="[perspective:800px] h-full">
                <button
                  onClick={() => setExpandedLevel(expandedLevel === level.id ? null : level.id)}
                  className={`group relative w-full h-full flex flex-col items-center p-5 rounded-2xl border transition-all duration-500 text-center [transform-style:preserve-3d] ${
                    expandedLevel === level.id
                      ? `bg-gradient-to-br ${level.bgColor} ${level.borderColor} shadow-lg`
                      : 'bg-black/40 backdrop-blur-md border-white/10 hover:bg-white/5 hover:border-white/20 hover:[transform:translateY(-4px)_rotateX(5deg)] hover:shadow-lg'
                  }`}
                  aria-expanded={expandedLevel === level.id}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${
                      expandedLevel === level.id
                        ? 'bg-white/10'
                        : 'bg-white/5 group-hover:bg-white/10 group-hover:scale-110'
                    } ${level.color}`}
                  >
                    <level.Icon className="w-7 h-7" />
                  </div>
                  <span className="font-bold text-neutral text-sm mb-2">{t(level.i18nKey)}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      expandedLevel === level.id
                        ? `${level.color} bg-white/10`
                        : 'text-neutral/40 bg-white/5'
                    }`}
                  >
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform duration-300 ${
                        expandedLevel === level.id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {/* Expanded description */}
                  {expandedLevel === level.id && (
                    <div className="absolute top-full left-0 right-0 mt-3 p-4 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl z-10 shadow-xl">
                      <p className="text-sm text-neutral/80 text-left leading-relaxed">
                        {t(level.descriptionKey)}
                      </p>
                    </div>
                  )}
                </button>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Help text */}
        <AnimateOnScroll>
          <div className="mt-10 [perspective:1000px]">
            <div className="p-5 bg-gradient-to-br from-primary-accent/5 to-transparent border border-primary-accent/20 rounded-2xl [transform-style:preserve-3d] hover:[transform:translateY(-2px)] transition-all duration-500">
              <p className="text-sm text-neutral/70 text-center">
                {t('horariosV2_levels_helpText')}
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default LevelGuide;
