import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';

interface MiniFAQProps {
  config: typeof HOMEPAGE_V2_CONFIG.miniFaq;
}

/**
 * MiniFAQ - Objection Buster
 *
 * Estilo visual coherente:
 * - Holographic text para título
 * - Cards con backdrop-blur
 * - Hover effects con glow
 */
const MiniFAQ: React.FC<MiniFAQProps> = ({ config }) => {
  const { t, i18n } = useTranslation([
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
  const locale = i18n.language;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16 bg-primary-dark/10">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimateOnScroll>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral text-center mb-12 holographic-text">
            {t(config.titleKey)}
          </h2>
        </AnimateOnScroll>

        {/* Acordeón de FAQs */}
        <div className="max-w-3xl mx-auto space-y-4">
          {config.questions.map((faq, index) => (
            <AnimateOnScroll key={faq.qKey} delay={100 + index * 50}>
              <div
                className={`group bg-black/50 backdrop-blur-md border rounded-2xl overflow-hidden transition-all duration-500 ${
                  openIndex === index
                    ? 'border-primary-accent shadow-accent-glow'
                    : 'border-primary-dark/50 hover:border-primary-accent/50'
                }`}
              >
                {/* Pregunta (botón) */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-neutral font-medium pr-4 group-hover:text-white transition-colors duration-300">
                    {t(faq.qKey)}
                  </span>
                  <div
                    className={`bg-primary-dark/30 group-hover:bg-primary-accent/20 p-2 rounded-lg transition-all duration-300 ${openIndex === index ? 'bg-primary-accent/20' : ''}`}
                  >
                    <svg
                      className={`w-5 h-5 text-primary-accent flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* Respuesta (expandible) */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 pb-5 text-neutral/80 leading-relaxed">{t(faq.aKey)}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Ver todas las FAQs */}
        <AnimateOnScroll delay={400}>
          <div className="mt-12 text-center">
            <Link
              to={`/${locale}${config.viewAllHref}`}
              className="inline-flex items-center gap-2 font-bold text-primary-accent hover:text-white transition-all duration-300 group"
            >
              <span>{t(config.viewAllKey)}</span>
              <span className="inline-block transition-all duration-300 group-hover:translate-x-2">
                →
              </span>
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default MiniFAQ;
