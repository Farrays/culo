import React from 'react';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import { ANIMATION_DELAYS } from '../../constants/shared';

// Arrow icon for CTA
const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
);

export interface WhyUsComparisonConfig {
  enabled: boolean;
  /** Number of comparison rows (default 8) */
  rowCount?: number;
  /** Number of "meaning" cards (default 4) */
  meaningCount?: number;
  /** Show CTA button at the end (default true) */
  showCTA?: boolean;
}

interface WhyUsComparisonSectionProps {
  /** Translation key prefix (e.g., 'dhV3' for Dancehall) */
  styleKey: string;
  /** Configuration options */
  config: WhyUsComparisonConfig;
}

const WhyUsComparisonSection: React.FC<WhyUsComparisonSectionProps> = ({ styleKey, config }) => {
  const { t } = useTranslation(['common']);
  const rowCount = config.rowCount || 8;
  const meaningCount = config.meaningCount || 4;
  const showCTA = config.showCTA !== false;

  return (
    <section
      id="why-us-comparison"
      aria-labelledby="why-us-title"
      className="py-12 md:py-16 bg-black"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Title */}
        <AnimateOnScroll>
          <div className="max-w-4xl mx-auto">
            <h2
              id="why-us-title"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-6 text-neutral text-center holographic-text"
            >
              {t(`${styleKey}CompareTitle`)}
            </h2>
            <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral/90 mb-12 text-center">
              {t(`${styleKey}CompareSubtitle`)}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Comparison Table - Same style as SalsaBachata */}
        <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * 2}>
          <div className="overflow-x-auto mb-12">
            <table
              className="w-full max-w-5xl mx-auto bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl overflow-hidden shadow-lg"
              role="table"
              aria-label={t(`${styleKey}CompareTitle`)}
            >
              <thead>
                <tr className="bg-primary-accent/20 text-white">
                  <th
                    className="py-3 sm:py-4 px-4 sm:px-6 text-left font-bold text-sm sm:text-lg border-b border-primary-accent/30"
                    scope="col"
                  >
                    Aspecto
                  </th>
                  <th
                    className="py-3 sm:py-4 px-4 sm:px-6 text-left font-bold text-sm sm:text-lg border-b border-primary-accent/30"
                    scope="col"
                  >
                    {t(`${styleKey}CompareColOthers`)}
                  </th>
                  <th
                    className="py-3 sm:py-4 px-4 sm:px-6 text-left font-bold text-sm sm:text-lg border-b border-primary-accent/30"
                    scope="col"
                  >
                    {t(`${styleKey}CompareColFarrays`)}
                  </th>
                </tr>
              </thead>
              <tbody className="text-neutral/90 text-sm sm:text-base">
                {Array.from({ length: rowCount }, (_, i) => i + 1).map((num, idx) => (
                  <tr
                    key={num}
                    className={`${idx === rowCount - 1 ? '' : 'border-b border-white/10'} hover:bg-white/5 transition-colors`}
                  >
                    <td className="py-3 sm:py-4 px-4 sm:px-6">
                      {t(`${styleKey}CompareRow${num}Label`)}
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 text-neutral/60">
                      {t(`${styleKey}CompareRow${num}Others`)}
                    </td>
                    <td className="py-3 sm:py-4 px-4 sm:px-6 font-semibold text-primary-accent">
                      {t(`${styleKey}CompareRow${num}Farrays`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimateOnScroll>

        {/* Info Cards Grid - Same style as SalsaBachata */}
        {meaningCount > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto"
            role="list"
            aria-label={t(`${styleKey}CompareMeaningTitle`)}
          >
            {Array.from({ length: meaningCount }, (_, i) => i + 1).map((num, idx) => (
              <AnimateOnScroll key={num} delay={ANIMATION_DELAYS.STAGGER_SMALL * (idx + 3)}>
                <div
                  className="h-full min-h-[120px] bg-black/50 backdrop-blur-md border border-primary-accent/30 rounded-xl p-4 sm:p-6 hover:border-primary-accent hover:shadow-accent-glow transition-all duration-300"
                  role="listitem"
                >
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {t(`${styleKey}CompareMeaning${num}Title`)}
                  </h3>
                  <p className="text-neutral/90 text-xs sm:text-sm leading-relaxed">
                    {t(`${styleKey}CompareMeaning${num}Desc`)}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        )}

        {/* CTA */}
        {showCTA && (
          <AnimateOnScroll delay={ANIMATION_DELAYS.STAGGER_SMALL * (meaningCount + 4)}>
            <div className="text-center mt-12">
              <a
                href="#schedule"
                className="inline-flex items-center justify-center bg-primary-accent text-white font-bold text-base sm:text-lg py-3 sm:py-4 px-8 sm:px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
              >
                {t(`${styleKey}CompareCTA`)}
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </a>
              <p className="text-neutral/70 text-sm mt-3">{t(`${styleKey}CompareNote`)}</p>
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
};

export default WhyUsComparisonSection;
