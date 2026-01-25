import React from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollToSection } from '../../hooks/useActiveSection';
import {
  TIME_BLOCKS,
  WEEK_DAYS,
  DAYS_I18N,
  getWeeklyAvailability,
} from '../../constants/horarios-page-data';

/**
 * Weekly availability matrix component
 * Shows a visual grid of when classes are available
 */
export const WeeklyAvailabilityMatrix: React.FC = () => {
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
  const scrollToSection = useScrollToSection();
  const availability = getWeeklyAvailability();

  // Short day names for mobile
  const shortDays: Record<string, string> = {
    monday: 'L',
    tuesday: 'M',
    wednesday: 'X',
    thursday: 'J',
    friday: 'V',
    saturday: 'S',
  };

  return (
    <section className="py-8 md:py-12" aria-labelledby="availability-title">
      <div className="max-w-4xl mx-auto px-4">
        <h2
          id="availability-title"
          className="text-xl md:text-2xl font-bold text-center mb-6 text-neutral"
        >
          {t('horariosV2_matrix_title')}
        </h2>

        {/* Matrix */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 md:p-6 overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr>
                <th className="text-left text-sm text-neutral/60 pb-4 pr-4">
                  {/* Empty corner */}
                </th>
                {WEEK_DAYS.map(day => (
                  <th
                    key={day}
                    className="text-center text-sm font-medium text-neutral/80 pb-4 px-2"
                  >
                    <span className="hidden md:inline">{t(DAYS_I18N[day])}</span>
                    <span className="md:hidden">{shortDays[day]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_BLOCKS.map(block => (
                <tr key={block.id} className="border-t border-white/5">
                  <td className="py-4 pr-4">
                    <button
                      onClick={() => scrollToSection(block.anchorId)}
                      className="flex items-center gap-2 text-sm text-neutral/70 hover:text-neutral transition-colors"
                    >
                      <span>{block.icon}</span>
                      <span className="hidden sm:inline">{t(block.i18nKey)}</span>
                    </button>
                  </td>
                  {WEEK_DAYS.map(day => {
                    const hasClasses = availability[block.id][day];
                    return (
                      <td key={day} className="text-center py-4 px-2">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                            hasClasses
                              ? 'bg-primary-accent/20 text-primary-accent'
                              : 'bg-white/5 text-neutral/30'
                          }`}
                          title={
                            hasClasses
                              ? t('horariosV2_matrix_available')
                              : t('horariosV2_matrix_unavailable')
                          }
                          role="img"
                          aria-label={
                            hasClasses
                              ? `${t(DAYS_I18N[day])} ${t(block.i18nKey)}: ${t('horariosV2_matrix_available')}`
                              : `${t(DAYS_I18N[day])} ${t(block.i18nKey)}: ${t('horariosV2_matrix_unavailable')}`
                          }
                        >
                          {hasClasses ? '●' : '○'}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 text-sm text-neutral/60">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-accent/20 text-primary-accent text-xs">
                ●
              </span>
              <span>{t('horariosV2_matrix_available')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral/60">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/5 text-neutral/30 text-xs">
                ○
              </span>
              <span>{t('horariosV2_matrix_unavailable')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeeklyAvailabilityMatrix;
