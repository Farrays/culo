import React, { useState, memo, useMemo, useCallback, useTransition } from 'react';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import AnimateOnScroll from './AnimateOnScroll';
import { ChevronDownIcon } from '../lib/icons';

/**
 * Single FAQ item structure.
 */
interface FAQ {
  /** Unique identifier for the FAQ item */
  id: string;
  /** The question text */
  question: string;
  /** The answer text (supports HTML) */
  answer: string;
}

/**
 * Props for the FAQSection component.
 */
interface FAQSectionProps {
  /** Section title displayed above the FAQs */
  title: string;
  /** Array of FAQ items to display */
  faqs: FAQ[];
  /** Page URL for schema markup */
  pageUrl: string;
}

/**
 * Accessible FAQ accordion section with Schema.org markup for SEO.
 * Automatically generates FAQPage structured data for Google SGE/rich results.
 * Answers support HTML content (sanitized with DOMPurify).
 *
 * @param title - Section heading
 * @param faqs - Array of FAQ objects with id, question, and answer
 * @param pageUrl - Current page URL for schema
 *
 * @example
 * ```tsx
 * const faqs = [
 *   { id: '1', question: '¿Necesito experiencia?', answer: 'No, tenemos clases para todos los niveles.' },
 *   { id: '2', question: '¿Qué debo llevar?', answer: 'Ropa cómoda y <strong>zapatillas</strong>.' },
 * ];
 *
 * <FAQSection
 *   title="Preguntas Frecuentes"
 *   faqs={faqs}
 *   pageUrl="https://example.com/clases"
 * />
 * ```
 */
const FAQSection: React.FC<FAQSectionProps> = memo(function FAQSection({ title, faqs }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

  // Pre-sanitize all answers once (expensive operation, memoized)
  const sanitizedAnswers = useMemo(
    () =>
      faqs.reduce(
        (acc, faq) => {
          acc[faq.id] = DOMPurify.sanitize(faq.answer);
          return acc;
        },
        {} as Record<string, string>
      ),
    [faqs]
  );

  const toggleItem = useCallback(
    (id: string) => {
      // Use startTransition to mark this update as non-urgent (INP optimization)
      startTransition(() => {
        setOpenItems(prev => {
          const newOpenItems = new Set(prev);
          if (newOpenItems.has(id)) {
            newOpenItems.delete(id);
          } else {
            newOpenItems.add(id);
          }
          return newOpenItems;
        });
      });
    },
    [startTransition]
  );

  // Generate FAQ Schema for Google SGE - memoized to prevent re-computation
  const faqSchema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }),
    [faqs]
  );

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section id="faq" className="py-10 md:py-14 bg-black" aria-labelledby="faq-section-title">
        <div className="container mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-8 max-w-3xl mx-auto">
              <h2
                id="faq-section-title"
                className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
              >
                {title}
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openItems.has(faq.id);

              return (
                <AnimateOnScroll key={faq.id} delay={index * 50}>
                  <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl overflow-hidden transition-all duration-300 hover:border-primary-accent">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors duration-300 hover:bg-primary-dark/20"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <h3 className="text-lg md:text-xl font-bold text-neutral pr-8">
                        {faq.question}
                      </h3>
                      <ChevronDownIcon
                        className={`w-6 h-6 text-primary-accent flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div
                      id={`faq-answer-${faq.id}`}
                      className={`overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div
                        className="px-6 pb-5 text-neutral/90 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sanitizedAnswers[faq.id] }}
                      />
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
});

export default FAQSection;
