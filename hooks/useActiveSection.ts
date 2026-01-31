import { useState, useEffect, useCallback, useRef } from 'react';

interface UseActiveSectionOptions {
  /** IDs of sections to track */
  sectionIds: string[];
  /** Offset from top of viewport to consider section "active" (default: 100) */
  offset?: number;
  /** Throttle interval in milliseconds (default: 100) */
  throttleMs?: number;
}

/**
 * Hook that tracks which section is currently in view
 * Useful for sticky navigation highlighting
 *
 * @param options - Configuration options
 * @returns Currently active section ID or null
 *
 * @example
 * ```tsx
 * const activeSection = useActiveSection({
 *   sectionIds: ['hero', 'features', 'pricing', 'faq'],
 *   offset: 100
 * });
 *
 * return (
 *   <nav>
 *     {sections.map(section => (
 *       <a
 *         key={section.id}
 *         href={`#${section.id}`}
 *         className={activeSection === section.id ? 'active' : ''}
 *       >
 *         {section.label}
 *       </a>
 *     ))}
 *   </nav>
 * );
 * ```
 */
export function useActiveSection({
  sectionIds,
  offset = 100,
  throttleMs = 100,
}: UseActiveSectionOptions): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const lastUpdateRef = useRef<number>(0);
  // Use ref to avoid circular dependency in useCallback
  const activeSectionRef = useRef<string | null>(null);
  activeSectionRef.current = activeSection;

  const updateActiveSection = useCallback(() => {
    const now = Date.now();
    if (now - lastUpdateRef.current < throttleMs) return;
    lastUpdateRef.current = now;

    const scrollPosition = window.scrollY + offset;
    let currentSection: string | null = null;

    // Find the section that is currently in view
    // We iterate in reverse to find the last section that starts before the scroll position
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const sectionId = sectionIds[i];
      if (!sectionId) continue;
      const element = document.getElementById(sectionId);

      if (element) {
        const { top } = element.getBoundingClientRect();
        const absoluteTop = top + window.scrollY;

        if (absoluteTop <= scrollPosition) {
          currentSection = sectionId;
          break;
        }
      }
    }

    // If we're at the very top, use the first section
    if (!currentSection && sectionIds.length > 0) {
      const firstSectionId = sectionIds[0];
      if (firstSectionId) {
        const firstElement = document.getElementById(firstSectionId);
        if (firstElement) {
          const { top } = firstElement.getBoundingClientRect();
          if (top <= window.innerHeight / 2) {
            currentSection = firstSectionId;
          }
        }
      }
    }

    // Use ref to compare without causing circular dependency
    if (currentSection !== activeSectionRef.current) {
      setActiveSection(currentSection);
    }
  }, [sectionIds, offset, throttleMs]);

  useEffect(() => {
    // Initial check
    updateActiveSection();

    const handleScroll = () => {
      requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [updateActiveSection]);

  return activeSection;
}

/**
 * Hook to smoothly scroll to a section
 *
 * @returns Function to scroll to a section by ID
 *
 * @example
 * ```tsx
 * const scrollToSection = useScrollToSection();
 *
 * return (
 *   <button onClick={() => scrollToSection('pricing')}>
 *     Ver precios
 *   </button>
 * );
 * ```
 */
export function useScrollToSection(): (sectionId: string, offset?: number) => void {
  return useCallback((sectionId: string, offset = 80) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
    }
  }, []);
}

export default useActiveSection;
