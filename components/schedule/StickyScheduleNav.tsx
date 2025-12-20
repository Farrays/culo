import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import useScrollProgress from '../../hooks/useScrollProgress';
import useActiveSection, { useScrollToSection } from '../../hooks/useActiveSection';

interface NavItem {
  id: string;
  Icon?: React.FC<{ className?: string }>;
  icon?: string; // Legacy support for emoji strings
  labelKey: string;
  anchorId: string;
}

interface StickyScheduleNavProps {
  items: NavItem[];
  showAfterScroll?: number;
}

/**
 * Premium sticky navigation component with progress bar
 * Shows active section and allows quick navigation
 * Supports both SVG Icon components and legacy emoji strings
 */
export const StickyScheduleNav: React.FC<StickyScheduleNavProps> = ({
  items,
  showAfterScroll = 400,
}) => {
  const { t } = useI18n();
  const progress = useScrollProgress();
  const [isVisible, setIsVisible] = useState(false);

  const sectionIds = items.map(item => item.anchorId);
  const activeSection = useActiveSection({ sectionIds, offset: 150 });
  const scrollToSection = useScrollToSection();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfterScroll);
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfterScroll]);

  if (!isVisible) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
      role="navigation"
      aria-label={t('horariosV2_nav_ariaLabel')}
    >
      {/* Progress bar */}
      <div className="h-1 bg-black/80">
        <div
          className="h-full bg-gradient-to-r from-primary-accent via-primary-accent to-primary-dark transition-all duration-150 shadow-sm shadow-primary-accent/50"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('horariosV2_nav_progressLabel')}
        />
      </div>

      {/* Navigation items with glassmorphism */}
      <div className="bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-1 md:gap-2 py-2 overflow-x-auto scrollbar-hide">
            {items.map(item => {
              const isActive = activeSection === item.anchorId;
              const IconComponent = item.Icon;

              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.anchorId)}
                  className={`group flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-accent/20 text-primary-accent border border-primary-accent/40 shadow-sm shadow-primary-accent/20'
                      : 'text-neutral/70 hover:text-neutral hover:bg-white/5 border border-transparent hover:border-white/10'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {/* Render Icon component or fallback to emoji string */}
                  {IconComponent ? (
                    <IconComponent
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isActive ? '' : 'group-hover:scale-110'
                      }`}
                    />
                  ) : (
                    <span className="text-base">{item.icon}</span>
                  )}
                  <span className="hidden sm:inline">{t(item.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default StickyScheduleNav;
