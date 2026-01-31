import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from './AnimateOnScroll';

interface Pillar {
  id: 'discipline' | 'rhythm' | 'innovation';
  titleKey: string;
  descriptionKey: string;
  className: string;
}

const pillars: Pillar[] = [
  {
    id: 'discipline',
    titleKey: 'aboutMethodPillar1Title',
    descriptionKey: 'aboutMethodPillar1Desc',
    className: 'border-cyan-400',
  },
  {
    id: 'rhythm',
    titleKey: 'aboutMethodPillar2Title',
    descriptionKey: 'aboutMethodPillar2Desc',
    className: 'border-primary-accent',
  },
  {
    id: 'innovation',
    titleKey: 'aboutMethodPillar3Title',
    descriptionKey: 'aboutMethodPillar3Desc',
    className: 'border-amber-400',
  },
];

const MethodInfographic: React.FC = () => {
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
  const [activePillar, setActivePillar] = useState<Pillar | null>(null);

  const handlePillarClick = (pillar: Pillar) => {
    setActivePillar(pillar);
  };

  const handleClose = () => {
    setActivePillar(null);
  };

  return (
    <div className="relative w-full h-80 md:h-96 bg-primary-dark/20 rounded-md flex items-center justify-center p-4 overflow-hidden border border-primary-dark/50">
      {/* Visual Placeholder for 3D model */}
      <div className="absolute w-24 h-24 bg-primary-accent rounded-full animate-pulse-strong shadow-[0_0_25px_theme(colors.primary-accent)]"></div>

      {/* Orbiting elements */}
      {pillars.map((pillar, index) => (
        <button
          key={pillar.id}
          onClick={() => handlePillarClick(pillar)}
          className={`absolute w-20 h-20 md:w-24 md:h-24 rounded-full border-2 ${pillar.className} bg-black/50 backdrop-blur-sm flex items-center justify-center text-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_15px]`}
          style={{
            transform: `rotate(${index * 120}deg) translate(85px) rotate(-${index * 120}deg)`,
          }}
          aria-label={`Learn more about ${t(pillar.titleKey)}`}
        >
          <span className="text-xs md:text-sm font-bold text-white p-1.5">
            {t(pillar.titleKey)}
          </span>
        </button>
      ))}

      {/* Info Display */}
      <div
        className={`absolute inset-0 bg-black/90 backdrop-blur-lg p-6 flex flex-col justify-center items-center text-center transition-opacity duration-500 ease-in-out ${activePillar ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {activePillar && (
          <AnimateOnScroll className="w-full">
            <h4
              className={`text-2xl font-bold mb-4 ${activePillar.className.replace('border-', 'text-')}`}
            >
              {t(activePillar.titleKey)}
            </h4>
            <p className="text-neutral/90 mb-6">{t(activePillar.descriptionKey)}</p>
            <button
              onClick={handleClose}
              className="font-bold text-white border-2 border-white rounded-full px-6 py-2 hover:bg-white hover:text-black transition-colors"
              aria-label="Close details"
            >
              {t('closeButton')}
            </button>
          </AnimateOnScroll>
        )}
      </div>

      {!activePillar && (
        <p className="absolute bottom-4 text-neutral/70 text-sm animate-pulse">
          {t('aboutMethodPillarInfo')}
        </p>
      )}
    </div>
  );
};

export default MethodInfographic;
