/**
 * TableOfContents Component
 *
 * Displays a navigable table of contents for blog articles.
 * Supports sticky mode (sidebar) and inline mode (within content).
 * Highlights the currently visible section.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useI18n } from '../../hooks/useI18n';
import type { ArticleSection } from '../../constants/blog/types';

interface TableOfContentsProps {
  /** Article sections to generate ToC from */
  sections: ArticleSection[];
  /** Show as sticky sidebar (true) or inline (false) */
  sticky?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  sections,
  sticky = false,
  className = '',
}) => {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(!sticky);

  // Filter only heading sections for ToC
  const headings = sections.filter(
    section => section.type === 'heading' && (section.level === 2 || section.level === 3)
  );

  // Track active section with IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        // Find the first visible heading
        const visibleEntry = entries.find(entry => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    // Observe all heading elements
    headings.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  // Smooth scroll to section
  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  if (headings.length === 0) return null;

  // Inline mode (collapsible)
  if (!sticky) {
    return (
      <nav
        className={`mb-8 bg-black/40 backdrop-blur-md border border-primary-dark/50
                    rounded-xl overflow-hidden ${className}`}
        aria-label="Table of contents"
      >
        {/* Toggle button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-6 py-4 flex items-center justify-between
                     text-left hover:bg-primary-dark/20 transition-colors duration-300"
          aria-expanded={isExpanded}
        >
          <span className="text-lg font-bold text-neutral">{t('blog_tableOfContents')}</span>
          <svg
            className={`w-5 h-5 text-neutral/60 transition-transform duration-300
                       ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* ToC content */}
        <div
          className={`overflow-hidden transition-all duration-300
                     ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <ul className="px-6 pb-4 space-y-2">
            {headings.map(heading => (
              <li key={heading.id} className={heading.level === 3 ? 'ml-4' : ''}>
                <button
                  onClick={() => scrollToSection(heading.id)}
                  className={`text-left w-full py-1 text-sm transition-colors duration-200
                             ${
                               activeId === heading.id
                                 ? 'text-primary-accent font-medium'
                                 : 'text-neutral/70 hover:text-neutral'
                             }`}
                >
                  {t(heading.contentKey)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }

  // Sticky mode (sidebar)
  return (
    <nav
      className={`sticky top-24 bg-black/40 backdrop-blur-md
                  border border-primary-dark/50 rounded-xl p-6 ${className}`}
      aria-label="Table of contents"
    >
      <h3 className="text-lg font-bold text-neutral mb-4">{t('blog_tableOfContents')}</h3>

      <ul className="space-y-3">
        {headings.map(heading => (
          <li key={heading.id} className={heading.level === 3 ? 'ml-4' : ''}>
            <button
              onClick={() => scrollToSection(heading.id)}
              className={`text-left w-full py-1 text-sm transition-all duration-200
                         border-l-2 pl-3 -ml-[2px]
                         ${
                           activeId === heading.id
                             ? 'border-primary-accent text-primary-accent font-medium'
                             : 'border-transparent text-neutral/70 hover:text-neutral hover:border-neutral/30'
                         }`}
            >
              {t(heading.contentKey)}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
