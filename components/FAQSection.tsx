import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import AnimateOnScroll from './AnimateOnScroll';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
  pageUrl: string;
}

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const FAQSection: React.FC<FAQSectionProps> = ({ title, faqs }) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // Generate FAQ Schema for Google SGE
  const faqSchema = {
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
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section id="faq" className="py-20 md:py-32 bg-black">
        <div className="container mx-auto px-6">
          <AnimateOnScroll>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
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
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(faq.answer) }}
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
};

export default FAQSection;
