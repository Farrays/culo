/**
 * DefinitionBox Component
 *
 * Displays a clear definition with term and explanation.
 * Optimized for GEO - AI search engines extract definitions easily.
 * Includes DefinedTerm schema markup.
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import AnimateOnScroll from '../AnimateOnScroll';

interface DefinitionBoxProps {
  /** The term being defined */
  term: string;
  /** The definition/explanation */
  definition: string;
  /** Animation delay in ms */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

const DefinitionBox: React.FC<DefinitionBoxProps> = ({
  term,
  definition,
  delay = 0,
  className = '',
}) => {
  // DefinedTerm schema for SEO
  const definedTermSchema = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term,
    description: definition,
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(definedTermSchema)}</script>
      </Helmet>

      <AnimateOnScroll delay={delay}>
        <div
          className={`relative my-8 pl-6 py-6 pr-8
                      bg-black/40 backdrop-blur-sm
                      border-l-4 border-primary-accent
                      rounded-r-xl ${className}`}
        >
          {/* Term */}
          <dt className="text-xl md:text-2xl font-bold text-primary-accent mb-3">{term}</dt>

          {/* Definition */}
          <dd className="text-lg text-neutral/90 leading-relaxed">{definition}</dd>
        </div>
      </AnimateOnScroll>
    </>
  );
};

export default DefinitionBox;
