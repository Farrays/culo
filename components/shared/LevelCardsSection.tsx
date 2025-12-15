import AnimateOnScroll from '../AnimateOnScroll';
import { ANIMATION_DELAYS } from '../../constants/shared';
import { useI18n } from '../../hooks/useI18n';

export interface LevelConfig {
  id: string;
  levelKey: string; // Translation key for level badge (beginnerLevel, basicLevel, etc.)
  titleKey: string; // Translation key for title
  descKey: string; // Translation key for description
  duration: string; // Duration text (e.g., "0-3 meses")
  color: 'primary-dark' | 'primary-dark-mid' | 'primary-accent-light' | 'primary-accent' | 'amber'; // Color theme progression
}

interface LevelCardsSectionProps {
  id?: string;
  titleKey: string;
  levels: LevelConfig[];
  className?: string;
}

/**
 * Premium Level Cards Section with 3D transforms and glow effects
 * Based on SalsaLadyStylePage design for visual consistency across all dance pages
 */
const LevelCardsSection: React.FC<LevelCardsSectionProps> = ({
  id = 'levels',
  titleKey,
  levels,
  className = '',
}) => {
  const { t } = useI18n();

  // Get styles based on level color progression

  const getCardStyles = (_color: LevelConfig['color'], index: number, total: number) => {
    const isFirst = index === 0;
    const isSecond = index === 1;
    const isThird = index === 2;

    // For 1 level (single open level): use primary-accent styling (same as theme)
    if (total === 1) {
      return {
        card: 'bg-gradient-to-br from-primary-accent/25 via-black/60 to-primary-accent/10 border border-primary-accent/50 hover:border-primary-accent/80',
        badge: 'bg-primary-accent/30 text-primary-accent border border-primary-accent/40',
        glow: 'bg-primary-accent/25',
        duration: 'text-primary-accent',
      };
    }

    // For 2 levels: primary-dark → primary-accent
    if (total === 2) {
      if (isFirst) {
        return {
          card: 'bg-gradient-to-br from-primary-dark/25 via-black/70 to-primary-dark/10 border border-primary-dark/50 hover:border-primary-dark/80',
          badge: 'bg-primary-dark/40 text-neutral border border-primary-dark/50',
          glow: 'bg-primary-dark/25',
          duration: 'text-primary-dark',
        };
      }
      // Last (Intermedio)
      return {
        card: 'bg-gradient-to-br from-primary-accent/25 via-black/60 to-primary-accent/10 border border-primary-accent/50 hover:border-primary-accent/80',
        badge: 'bg-primary-accent/30 text-primary-accent border border-primary-accent/40',
        glow: 'bg-primary-accent/25',
        duration: 'text-primary-accent',
      };
    }

    // For 3 levels: primary-dark → primary-accent-light → primary-accent
    // For 4 levels: primary-dark → primary-dark-mid → primary-accent-light → primary-accent
    if (total === 3) {
      if (isFirst) {
        return {
          card: 'bg-gradient-to-br from-primary-dark/25 via-black/70 to-primary-dark/10 border border-primary-dark/50 hover:border-primary-dark/80',
          badge: 'bg-primary-dark/40 text-neutral border border-primary-dark/50',
          glow: 'bg-primary-dark/25',
          duration: 'text-primary-dark',
        };
      }
      if (isSecond) {
        return {
          card: 'bg-gradient-to-br from-primary-accent/20 via-black/60 to-primary-dark/15 border border-primary-accent/40 hover:border-primary-accent/70',
          badge: 'bg-primary-accent/25 text-primary-accent border border-primary-accent/35',
          glow: 'bg-primary-accent/25',
          duration: 'text-primary-accent',
        };
      }
      // Last (Avanzado)
      return {
        card: 'bg-gradient-to-br from-primary-accent/30 via-black/60 to-primary-accent/15 border border-primary-accent/60 hover:border-primary-accent/90',
        badge: 'bg-primary-accent/35 text-primary-accent border border-primary-accent/50',
        glow: 'bg-primary-accent/25',
        duration: 'text-primary-accent',
      };
    }

    // For 4 levels (Salsa Lady Style pattern)
    if (isFirst) {
      return {
        card: 'bg-gradient-to-br from-primary-dark/25 via-black/70 to-primary-dark/10 border border-primary-dark/50 hover:border-primary-dark/80',
        badge: 'bg-primary-dark/40 text-neutral border border-primary-dark/50',
        glow: 'bg-primary-dark/25',
        duration: 'text-primary-dark',
      };
    }
    if (isSecond) {
      return {
        card: 'bg-gradient-to-br from-primary-dark/30 via-black/60 to-primary-accent/10 border border-primary-dark/60 hover:border-primary-accent/60',
        badge: 'bg-primary-dark/35 text-neutral border border-primary-dark/45',
        glow: 'bg-primary-dark/25',
        duration: 'text-primary-dark',
      };
    }
    if (isThird) {
      return {
        card: 'bg-gradient-to-br from-primary-accent/20 via-black/60 to-primary-dark/15 border border-primary-accent/40 hover:border-primary-accent/70',
        badge: 'bg-primary-accent/25 text-primary-accent border border-primary-accent/35',
        glow: 'bg-primary-accent/25',
        duration: 'text-primary-accent',
      };
    }
    // Last
    return {
      card: 'bg-gradient-to-br from-primary-accent/30 via-black/60 to-primary-accent/15 border border-primary-accent/60 hover:border-primary-accent/90',
      badge: 'bg-primary-accent/35 text-primary-accent border border-primary-accent/50',
      glow: 'bg-primary-accent/25',
      duration: 'text-primary-accent',
    };
  };

  // Get badge text based on levelKey
  const getBadgeText = (levelKey: string): string => {
    const badgeMap: Record<string, string> = {
      beginnerLevel: 'PRINCIPIANTE',
      basicLevel: 'BÁSICO',
      intermediateLevel: 'INTERMEDIO',
      advancedLevel: 'AVANZADO',
      allLevelsLevel: 'TODOS LOS NIVELES',
    };
    return badgeMap[levelKey] || levelKey.toUpperCase();
  };

  // Determine grid columns based on number of levels
  const getGridCols = (count: number): string => {
    if (count === 1) return 'max-w-md mx-auto'; // Center single card
    if (count === 2) return 'md:grid-cols-2 max-w-4xl';
    if (count === 3) return 'sm:grid-cols-2 lg:grid-cols-3 max-w-6xl';
    if (count === 4) return 'sm:grid-cols-2 lg:grid-cols-4 max-w-6xl';
    return 'sm:grid-cols-2 lg:grid-cols-3 max-w-6xl';
  };

  return (
    <section id={id} className={`py-14 md:py-20 bg-black ${className}`}>
      <div className="container mx-auto px-4 sm:px-6">
        <AnimateOnScroll>
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t(titleKey)}
            </h2>
          </div>
        </AnimateOnScroll>

        <div className={`grid ${getGridCols(levels.length)} gap-6 mx-auto`}>
          {levels.map((level, index) => {
            const styles = getCardStyles(level.color, index, levels.length);

            return (
              <AnimateOnScroll
                key={level.id}
                delay={index * ANIMATION_DELAYS.STAGGER_SMALL}
                className="[perspective:1000px]"
              >
                <div
                  className={`group h-full min-h-[240px] p-6 rounded-2xl transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.75rem)_rotateY(5deg)_rotateX(2deg)] hover:shadow-accent-glow relative overflow-hidden ${styles.card}`}
                >
                  {/* Glow effect */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl ${styles.glow}`}
                  ></div>

                  <div className="relative z-10">
                    <div
                      className={`inline-block px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full mb-4 ${styles.badge}`}
                    >
                      {getBadgeText(level.levelKey)}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral mb-3">
                      {t(level.titleKey)}
                    </h3>
                    <p className="text-neutral/80 text-sm leading-relaxed mb-4">
                      {t(level.descKey)}
                    </p>
                    <div className="mt-auto pt-3 border-t border-neutral/10">
                      <p className={`text-xs font-semibold ${styles.duration}`}>{level.duration}</p>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LevelCardsSection;
