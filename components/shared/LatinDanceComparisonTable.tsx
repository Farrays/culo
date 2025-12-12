import React from 'react';
import { useI18n } from '../../hooks/useI18n';

// Types for Latin dance styles that can be highlighted
export type LatinDanceStyle =
  | 'salsaCubana'
  | 'bachata'
  | 'timba'
  | 'salsaLadyStyle'
  | 'bachataLadyStyle'
  | 'timbaPareja'
  | 'folkloreCubano'
  | 'sonCubano'
  | 'salsaLadyTimba';

interface LatinDanceComparisonTableProps {
  highlightedStyle: LatinDanceStyle;
}

// Comparison data: ratings from 1-5 for each characteristic
// Row order: Musicalidad, Conexión pareja, Trabajo de caderas, Giros/Vueltas, Expresión corporal,
// Técnica de pies, Estilo libre/Impro, Folklore/Tradición, Sensualidad, Exigencia física, Baile social
const comparisonData = [
  {
    row: 1, // Musicalidad / Interpretación musical
    salsaCubana: 5,
    bachata: 4,
    timba: 5,
    salsaLadyStyle: 4,
    bachataLadyStyle: 4,
    timbaPareja: 5,
    folkloreCubano: 5,
    sonCubano: 5,
    salsaLadyTimba: 5,
  },
  {
    row: 2, // Conexión de pareja
    salsaCubana: 5,
    bachata: 5,
    timba: 4,
    salsaLadyStyle: 2,
    bachataLadyStyle: 2,
    timbaPareja: 5,
    folkloreCubano: 3,
    sonCubano: 4,
    salsaLadyTimba: 2,
  },
  {
    row: 3, // Trabajo de caderas / Movimiento corporal
    salsaCubana: 4,
    bachata: 5,
    timba: 5,
    salsaLadyStyle: 5,
    bachataLadyStyle: 5,
    timbaPareja: 4,
    folkloreCubano: 5,
    sonCubano: 3,
    salsaLadyTimba: 5,
  },
  {
    row: 4, // Giros y vueltas
    salsaCubana: 5,
    bachata: 4,
    timba: 4,
    salsaLadyStyle: 5,
    bachataLadyStyle: 4,
    timbaPareja: 4,
    folkloreCubano: 3,
    sonCubano: 3,
    salsaLadyTimba: 5,
  },
  {
    row: 5, // Expresión corporal / Estilo personal
    salsaCubana: 4,
    bachata: 4,
    timba: 5,
    salsaLadyStyle: 5,
    bachataLadyStyle: 5,
    timbaPareja: 4,
    folkloreCubano: 5,
    sonCubano: 4,
    salsaLadyTimba: 5,
  },
  {
    row: 6, // Técnica de pies (footwork)
    salsaCubana: 5,
    bachata: 3,
    timba: 5,
    salsaLadyStyle: 4,
    bachataLadyStyle: 3,
    timbaPareja: 5,
    folkloreCubano: 4,
    sonCubano: 4,
    salsaLadyTimba: 5,
  },
  {
    row: 7, // Estilo libre / Improvisación
    salsaCubana: 4,
    bachata: 3,
    timba: 5,
    salsaLadyStyle: 4,
    bachataLadyStyle: 3,
    timbaPareja: 4,
    folkloreCubano: 3,
    sonCubano: 3,
    salsaLadyTimba: 5,
  },
  {
    row: 8, // Folklore / Tradición cultural
    salsaCubana: 5,
    bachata: 4,
    timba: 4,
    salsaLadyStyle: 3,
    bachataLadyStyle: 3,
    timbaPareja: 4,
    folkloreCubano: 5,
    sonCubano: 5,
    salsaLadyTimba: 4,
  },
  {
    row: 9, // Sensualidad
    salsaCubana: 3,
    bachata: 5,
    timba: 4,
    salsaLadyStyle: 4,
    bachataLadyStyle: 5,
    timbaPareja: 4,
    folkloreCubano: 3,
    sonCubano: 3,
    salsaLadyTimba: 4,
  },
  {
    row: 10, // Exigencia física / Cardio
    salsaCubana: 4,
    bachata: 3,
    timba: 5,
    salsaLadyStyle: 4,
    bachataLadyStyle: 3,
    timbaPareja: 5,
    folkloreCubano: 4,
    sonCubano: 3,
    salsaLadyTimba: 5,
  },
  {
    row: 11, // Versatilidad para baile social
    salsaCubana: 5,
    bachata: 5,
    timba: 4,
    salsaLadyStyle: 3,
    bachataLadyStyle: 3,
    timbaPareja: 4,
    folkloreCubano: 2,
    sonCubano: 3,
    salsaLadyTimba: 3,
  },
];

// Style keys for header columns
const styleKeys: LatinDanceStyle[] = [
  'salsaCubana',
  'bachata',
  'timba',
  'salsaLadyStyle',
  'bachataLadyStyle',
  'timbaPareja',
  'folkloreCubano',
  'sonCubano',
  'salsaLadyTimba',
];

const LatinDanceComparisonTable: React.FC<LatinDanceComparisonTableProps> = ({
  highlightedStyle,
}) => {
  const { t } = useI18n();

  // Get short names for mobile view
  const getShortName = (style: LatinDanceStyle): string => {
    const shortNames: Record<LatinDanceStyle, string> = {
      salsaCubana: 'Salsa Cub.',
      bachata: 'Bachata',
      timba: 'Timba',
      salsaLadyStyle: 'Salsa Lady',
      bachataLadyStyle: 'Bach. Lady',
      timbaPareja: 'Timba Par.',
      folkloreCubano: 'Folklore',
      sonCubano: 'Son',
      salsaLadyTimba: 'Lady Timba',
    };
    return shortNames[style];
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-neutral mb-2 text-center holographic-text">
        {t('latinDanceCompareTitle')}
      </h3>
      <p className="text-base text-neutral/70 mb-6 text-center">{t('latinDanceCompareSubtitle')}</p>

      {/* Mobile: Cards view - show only highlighted style vs 3 main alternatives */}
      <div className="block xl:hidden space-y-4">
        {comparisonData.map(item => {
          // Select 3 comparison styles (excluding the highlighted one)
          const compareStyles = styleKeys.filter(s => s !== highlightedStyle).slice(0, 3);

          return (
            <div key={item.row} className="p-4 bg-black/30 rounded-xl border border-neutral/20">
              <h4 className="font-bold text-neutral mb-3 text-sm">
                {t(`latinDanceCompareRow${item.row}`)}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {/* Highlighted style first */}
                <div className="flex justify-between items-center p-2 bg-primary-accent/15 rounded-lg border border-primary-accent/30">
                  <span className="text-primary-accent font-semibold">
                    {getShortName(highlightedStyle)}
                  </span>
                  <span className="text-primary-accent/80">
                    {'★'.repeat(item[highlightedStyle])}
                  </span>
                </div>
                {/* Other styles */}
                {compareStyles.map(style => (
                  <div
                    key={style}
                    className="flex justify-between items-center p-2 bg-neutral/10 rounded-lg"
                  >
                    <span className="text-neutral/70">{getShortName(style)}</span>
                    <span className="text-neutral/60">{'★'.repeat(item[style])}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Full table view */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral/20">
              <th className="text-left py-3 px-2 text-neutral/70 font-semibold min-w-[140px]">
                {t('latinDanceCompareCapacity')}
              </th>
              {styleKeys.map(style => (
                <th
                  key={style}
                  className={`text-center py-3 px-1 font-semibold text-xs ${
                    style === highlightedStyle
                      ? 'text-primary-accent bg-primary-accent/10 rounded-t-lg font-bold'
                      : 'text-neutral/70'
                  }`}
                >
                  {t(`latinDanceCompare_${style}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((item, idx) => (
              <tr
                key={item.row}
                className={`border-b border-neutral/10 ${idx % 2 === 0 ? 'bg-black/20' : ''}`}
              >
                <td className="py-3 px-2 text-neutral/80">
                  {t(`latinDanceCompareRow${item.row}`)}
                </td>
                {styleKeys.map(style => (
                  <td
                    key={style}
                    className={`py-3 px-1 text-center ${
                      style === highlightedStyle
                        ? 'bg-primary-accent/10 text-primary-accent/80'
                        : 'text-neutral/60'
                    }`}
                  >
                    {'★'.repeat(item[style])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* What does this mean for you? */}
      <div className="mt-8 p-5 bg-black/30 rounded-2xl border border-neutral/20">
        <h4 className="text-lg font-bold text-neutral mb-4">
          {t('latinDanceCompareMeaningTitle')}
        </h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="space-y-1">
              <p className="text-sm font-semibold text-primary-accent">
                {t(`latinDanceCompareMeaning${num}Title_${highlightedStyle}`)}
              </p>
              <p className="text-sm text-neutral/70">
                {t(`latinDanceCompareMeaning${num}Desc_${highlightedStyle}`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <p className="mt-6 text-center text-neutral/70 text-sm italic">
        {t(`latinDanceCompareConclusion_${highlightedStyle}`)}
      </p>
    </div>
  );
};

export default LatinDanceComparisonTable;
