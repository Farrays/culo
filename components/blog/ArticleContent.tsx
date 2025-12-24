/**
 * ArticleContent Component
 *
 * Renders article content sections with markdown parsing.
 * Supports headings, paragraphs, lists, images, quotes, definitions, and statistics.
 */

import React from 'react';
import DOMPurify from 'dompurify';
import { useI18n } from '../../hooks/useI18n';
import type { ArticleSection } from '../../constants/blog/types';
import AnimateOnScroll from '../AnimateOnScroll';
import LazyImage from '../LazyImage';
import YouTubeEmbed from '../YouTubeEmbed';
import StatisticHighlight from './StatisticHighlight';
import DefinitionBox from './DefinitionBox';

interface ArticleContentProps {
  /** Content sections to render */
  sections: ArticleSection[];
  /** Additional CSS classes */
  className?: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ sections, className = '' }) => {
  const { t } = useI18n();

  /**
   * Parse markdown-like content to HTML
   * Supports: **bold**, *italic*, [links](url), lists
   */
  const parseMarkdown = (text: string): string => {
    let parsed = text;

    // Bold: **text**
    parsed = parsed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    parsed = parsed.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Links: [text](url)
    parsed = parsed.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary-accent hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Line breaks
    parsed = parsed.replace(/\n\n/g, '</p><p class="mt-4">');
    parsed = parsed.replace(/\n/g, '<br />');

    return DOMPurify.sanitize(parsed);
  };

  /**
   * Render a single section based on its type
   */
  const renderSection = (section: ArticleSection, index: number) => {
    const delay = index * 50;

    switch (section.type) {
      case 'heading': {
        const HeadingTag = section.level === 2 ? 'h2' : 'h3';
        const headingStyles =
          section.level === 2
            ? 'text-3xl md:text-4xl font-black text-neutral mt-12 mb-6'
            : 'text-2xl md:text-3xl font-bold text-neutral mt-8 mb-4';

        return (
          <AnimateOnScroll key={section.id} delay={delay}>
            <HeadingTag id={section.id} className={headingStyles}>
              {t(section.contentKey)}
            </HeadingTag>
          </AnimateOnScroll>
        );
      }

      case 'paragraph':
        return (
          <AnimateOnScroll key={section.id} delay={delay}>
            <div
              id={section.id}
              className="text-lg text-neutral/90 leading-relaxed mb-6"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(t(section.contentKey)) }}
            />
          </AnimateOnScroll>
        );

      case 'list':
        return (
          <AnimateOnScroll key={section.id} delay={delay}>
            <ul id={section.id} className="space-y-3 mb-6 ml-4">
              {section.listItems?.map((itemKey, idx) => (
                <li key={idx} className="flex items-start gap-3 text-lg text-neutral/90">
                  <span className="flex-shrink-0 w-2 h-2 mt-2.5 bg-primary-accent rounded-full" />
                  <span dangerouslySetInnerHTML={{ __html: parseMarkdown(t(itemKey)) }} />
                </li>
              ))}
            </ul>
          </AnimateOnScroll>
        );

      case 'image':
        if (!section.image) return null;
        return (
          <AnimateOnScroll key={section.id} delay={delay}>
            <figure id={section.id} className="my-8">
              <LazyImage
                src={section.image.src}
                srcSet={section.image.srcSet}
                alt={section.image.alt}
                width={section.image.width}
                height={section.image.height}
                className="w-full rounded-xl"
              />
              {section.image.caption && (
                <figcaption className="mt-3 text-center text-sm text-neutral/60 italic">
                  {t(section.image.caption)}
                </figcaption>
              )}
            </figure>
          </AnimateOnScroll>
        );

      case 'video':
        if (!section.videoId) return null;
        return (
          <AnimateOnScroll key={section.id} delay={delay}>
            <div id={section.id} className="my-8">
              <YouTubeEmbed
                videoId={section.videoId}
                title={section.videoTitleKey ? t(section.videoTitleKey) : 'Video'}
              />
            </div>
          </AnimateOnScroll>
        );

      case 'quote':
        return (
          <AnimateOnScroll key={section.id} delay={delay}>
            <blockquote id={section.id} className="my-8 pl-6 border-l-4 border-primary-accent">
              <p className="text-xl md:text-2xl text-neutral/90 italic leading-relaxed">
                &ldquo;{t(section.contentKey)}&rdquo;
              </p>
              {section.quoteAuthor && (
                <cite className="block mt-4 text-primary-accent font-medium not-italic">
                  — {section.quoteAuthor}
                </cite>
              )}
            </blockquote>
          </AnimateOnScroll>
        );

      case 'definition':
        return (
          <DefinitionBox
            key={section.id}
            term={section.definitionTermKey ? t(section.definitionTermKey) : ''}
            definition={t(section.contentKey)}
            delay={delay}
          />
        );

      case 'statistic':
        return (
          <StatisticHighlight
            key={section.id}
            value={section.statisticValue || ''}
            label={t(section.contentKey)}
            source={section.statisticSource}
            delay={delay}
          />
        );

      case 'callout': {
        const calloutStyles: Record<string, string> = {
          info: 'bg-blue-500/10 border-blue-500',
          tip: 'bg-emerald-500/10 border-emerald-500',
          warning: 'bg-amber-500/10 border-amber-500',
          cta: 'bg-primary-accent/10 border-primary-accent',
        };
        const calloutType = section.calloutType || 'info';

        return (
          <AnimateOnScroll key={section.id} delay={delay}>
            <div
              id={section.id}
              className={`my-8 p-6 rounded-xl border-l-4 ${calloutStyles[calloutType]}`}
            >
              <div
                className="text-lg text-neutral/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(t(section.contentKey)) }}
              />
            </div>
          </AnimateOnScroll>
        );
      }

      case 'comparison-table': {
        if (!section.tableConfig) return null;
        const { headers, rows, highlightColumn } = section.tableConfig;

        return (
          <AnimateOnScroll key={section.id} delay={delay}>
            <div id={section.id} className="my-8 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {headers.map((headerKey, idx) => (
                      <th
                        key={idx}
                        className={`px-4 py-3 text-left font-bold border-b border-primary-dark/50
                                   ${highlightColumn === idx ? 'text-primary-accent bg-primary-accent/10' : 'text-neutral'}`}
                      >
                        {t(headerKey)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-primary-dark/30">
                      {row.map((cellKey, cellIdx) => (
                        <td
                          key={cellIdx}
                          className={`px-4 py-3
                                     ${highlightColumn === cellIdx ? 'text-primary-accent bg-primary-accent/5' : 'text-neutral/80'}`}
                        >
                          {t(cellKey)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimateOnScroll>
        );
      }

      case 'references':
        if (!section.references || section.references.length === 0) return null;
        return (
          <AnimateOnScroll key={section.id} delay={delay}>
            <div id={section.id} className="my-12">
              {section.contentKey && (
                <p className="text-neutral/70 mb-8 text-base text-center max-w-2xl mx-auto">
                  {t(section.contentKey)}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.references.map(ref => (
                  <a
                    key={ref.id}
                    href={ref.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-gradient-to-br from-primary-dark/40 to-black/60
                               border border-primary-accent/20 rounded-2xl overflow-hidden
                               hover:border-primary-accent/50 hover:shadow-lg hover:shadow-primary-accent/10
                               transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Image Container */}
                    <div className="relative h-40 bg-gradient-to-br from-primary-dark/60 to-black/80 overflow-hidden">
                      {ref.image ? (
                        <img
                          src={ref.image}
                          alt={ref.publisher || ''}
                          className="w-full h-full object-cover opacity-90 group-hover:opacity-100
                                     group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div
                            className="text-5xl font-black text-primary-accent/30 group-hover:text-primary-accent/50
                                          transition-colors duration-300"
                          >
                            {ref.publisher?.charAt(0) || '?'}
                          </div>
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {/* External link icon */}
                      <div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50
                                      flex items-center justify-center opacity-0 group-hover:opacity-100
                                      transition-opacity duration-300"
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h4
                        className="font-bold text-neutral group-hover:text-primary-accent
                                     transition-colors duration-300 mb-2 line-clamp-2"
                      >
                        {t(ref.titleKey)}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-neutral/60">
                        <span className="font-medium">{ref.publisher}</span>
                        {ref.year && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-neutral/40" />
                            <span>{ref.year}</span>
                          </>
                        )}
                      </div>
                      {ref.descriptionKey && (
                        <p className="mt-3 text-sm text-neutral/70 line-clamp-2">
                          {t(ref.descriptionKey)}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </AnimateOnScroll>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`prose-content ${className}`}>
      {sections.map((section, index) => renderSection(section, index))}
    </div>
  );
};

export default ArticleContent;
