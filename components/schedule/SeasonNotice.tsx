import React from 'react';
import { useTranslation } from 'react-i18next';
import { getCurrentSeason, SEASON_CONFIG } from '../../constants/horarios-page-data';

/**
 * Season notice component
 * Shows which schedule season is currently active
 */
export const SeasonNotice: React.FC = () => {
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
  const currentSeason = getCurrentSeason();
  const seasonInfo = SEASON_CONFIG[currentSeason];
  const otherSeason = currentSeason === 'winter' ? 'summer' : 'winter';
  const otherSeasonInfo = SEASON_CONFIG[otherSeason];

  return (
    <section className="py-8" aria-labelledby="season-notice-title">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary-accent/10 to-primary-dark/10 border border-primary-accent/20 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Current season */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{seasonInfo.icon}</span>
                <h3 id="season-notice-title" className="font-bold text-neutral">
                  {t(seasonInfo.i18nKey)}
                </h3>
                <span className="px-2 py-0.5 bg-primary-accent/20 text-primary-accent text-xs font-medium rounded-full">
                  {t('horariosV2_season_current')}
                </span>
              </div>
              <p className="text-sm text-neutral/70">{t(seasonInfo.descKey)}</p>
            </div>

            {/* Separator */}
            <div className="hidden md:block w-px h-16 bg-white/10" />

            {/* Other season info */}
            <div className="flex-1 opacity-60">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{otherSeasonInfo.icon}</span>
                <h4 className="font-medium text-neutral text-sm">{t(otherSeasonInfo.i18nKey)}</h4>
              </div>
              <p className="text-xs text-neutral/60">{t(otherSeasonInfo.descKey)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SeasonNotice;
