import React from 'react';
import { useTranslation } from 'react-i18next';

// Types for artistic dance styles that can be highlighted
export type ArtisticDanceStyle =
  | 'afrocontemporaneo'
  | 'contemporaneo'
  | 'modernjazz'
  | 'ballet'
  | 'afrojazz';

interface ArtisticDanceComparisonTableProps {
  highlightedStyle: ArtisticDanceStyle;
}

// Comparison data: ratings from 1-5 for each characteristic
// Row order: Alineación postural, Técnica pies/piernas, Trabajo suelo, Caderas/torso,
// Disociación corporal, Poliritmia, Expresión emocional, Fluidez, Grounding, Cardio, Versatilidad
const comparisonData = [
  {
    row: 1, // Alineación postural clásica
    afrocontemporaneo: 3,
    contemporaneo: 4,
    modernjazz: 4,
    ballet: 5,
    afrojazz: 3,
  },
  {
    row: 2, // Técnica de pies y piernas
    afrocontemporaneo: 4,
    contemporaneo: 4,
    modernjazz: 5,
    ballet: 5,
    afrojazz: 4,
  },
  {
    row: 3, // Trabajo de suelo
    afrocontemporaneo: 4,
    contemporaneo: 5,
    modernjazz: 3,
    ballet: 2,
    afrojazz: 3,
  },
  {
    row: 4, // Trabajo de caderas y torso
    afrocontemporaneo: 5,
    contemporaneo: 3,
    modernjazz: 4,
    ballet: 2,
    afrojazz: 5,
  },
  {
    row: 5, // Disociación corporal
    afrocontemporaneo: 5,
    contemporaneo: 4,
    modernjazz: 4,
    ballet: 3,
    afrojazz: 5,
  },
  {
    row: 6, // Poliritmia / Musicalidad compleja
    afrocontemporaneo: 5,
    contemporaneo: 3,
    modernjazz: 4,
    ballet: 3,
    afrojazz: 5,
  },
  {
    row: 7, // Expresión emocional
    afrocontemporaneo: 5,
    contemporaneo: 5,
    modernjazz: 4,
    ballet: 4,
    afrojazz: 5,
  },
  {
    row: 8, // Fluidez y continuidad
    afrocontemporaneo: 4,
    contemporaneo: 5,
    modernjazz: 4,
    ballet: 4,
    afrojazz: 4,
  },
  {
    row: 9, // Conexión tierra (grounding)
    afrocontemporaneo: 5,
    contemporaneo: 4,
    modernjazz: 3,
    ballet: 2,
    afrojazz: 5,
  },
  {
    row: 10, // Exigencia cardiovascular
    afrocontemporaneo: 5,
    contemporaneo: 4,
    modernjazz: 4,
    ballet: 4,
    afrojazz: 5,
  },
  {
    row: 11, // Versatilidad para otros estilos
    afrocontemporaneo: 5,
    contemporaneo: 4,
    modernjazz: 5,
    ballet: 4,
    afrojazz: 5,
  },
];

// Style keys for header columns (order matters for display)
const styleKeys: ArtisticDanceStyle[] = [
  'afrocontemporaneo',
  'contemporaneo',
  'modernjazz',
  'ballet',
  'afrojazz',
];

// Translation key prefixes for each style
const styleTranslationPrefixes: Record<ArtisticDanceStyle, string> = {
  afrocontemporaneo: 'afrocontemporaneo',
  contemporaneo: 'contemporaneo',
  modernjazz: 'modernjazz',
  ballet: 'ballet',
  afrojazz: 'afrojazz',
};

const ArtisticDanceComparisonTable: React.FC<ArtisticDanceComparisonTableProps> = ({
  highlightedStyle,
}) => {
  const { t } = useTranslation(['common']);
  const prefix = styleTranslationPrefixes[highlightedStyle];

  // Get short names for mobile view
  const getShortName = (style: ArtisticDanceStyle): string => {
    const shortNames: Record<ArtisticDanceStyle, string> = {
      afrocontemporaneo: 'Afro Cont.',
      contemporaneo: 'Cont. Lírico',
      modernjazz: 'Modern Jazz',
      ballet: 'Ballet',
      afrojazz: 'Afro Jazz',
    };
    return shortNames[style];
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-neutral mb-2 text-center holographic-text">
        {t(`${prefix}CompareTitle`)}
      </h3>
      <p className="text-base text-neutral/70 mb-6 text-center">{t(`${prefix}CompareSubtitle`)}</p>

      {/* Mobile: Cards view - show highlighted style vs others */}
      <div className="block lg:hidden space-y-4">
        {comparisonData.map(item => {
          // Select comparison styles (excluding the highlighted one)
          const compareStyles = styleKeys.filter(s => s !== highlightedStyle);

          return (
            <div key={item.row} className="p-4 bg-black/30 rounded-xl border border-neutral/20">
              <h4 className="font-bold text-neutral mb-3 text-sm">
                {t(`${prefix}CompareRow${item.row}`)}
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
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral/20">
              <th className="text-left py-3 px-2 text-neutral/70 font-semibold min-w-[160px]">
                {t(`${prefix}CompareCapacity`)}
              </th>
              {styleKeys.map(style => (
                <th
                  key={style}
                  className={`text-center py-3 px-2 font-semibold text-xs ${
                    style === highlightedStyle
                      ? 'text-primary-accent bg-primary-accent/10 rounded-t-lg font-bold'
                      : 'text-neutral/70'
                  }`}
                >
                  {getShortName(style)}
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
                <td className="py-3 px-2 text-neutral/80">{t(`${prefix}CompareRow${item.row}`)}</td>
                {styleKeys.map(style => (
                  <td
                    key={style}
                    className={`py-3 px-2 text-center ${
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
        <h4 className="text-lg font-bold text-neutral mb-4">{t(`${prefix}CompareMeaningTitle`)}</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(num => (
            <div key={num} className="space-y-1">
              <p className="text-sm font-semibold text-primary-accent">
                {t(`${prefix}CompareMeaning${num}Title`)}
              </p>
              <p className="text-sm text-neutral/70">{t(`${prefix}CompareMeaning${num}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conclusion */}
      <p className="mt-6 text-center text-neutral/70 text-sm italic">
        {t(`${prefix}CompareConclusion`)}
      </p>
    </div>
  );
};

export default ArtisticDanceComparisonTable;
