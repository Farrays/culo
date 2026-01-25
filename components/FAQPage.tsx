import { useState, useMemo, useCallback, useTransition } from 'react';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import { ChevronDownIcon } from '../lib/icons';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  faqs: FAQ[];
}

const FAQPage: React.FC = () => {
  const { t, i18n } = useTranslation(['common']);
  const locale = i18n.language;
  const baseUrl = 'https://www.farrayscenter.com';
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [, startTransition] = useTransition();

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

  // Categorías de FAQ - memoized to avoid recreating on each render
  const faqCategories: FAQCategory[] = useMemo(
    () => [
      {
        id: 'reservas-altas',
        title: t('faq_category_reservas_title'),
        faqs: [
          {
            id: 'faq_reservas_1',
            question: t('faq_reservas_1_q'),
            answer: t('faq_reservas_1_a'),
          },
          {
            id: 'faq_reservas_2',
            question: t('faq_reservas_2_q'),
            answer: t('faq_reservas_2_a'),
          },
          {
            id: 'faq_reservas_3',
            question: t('faq_reservas_3_q'),
            answer: t('faq_reservas_3_a'),
          },
          {
            id: 'faq_reservas_4',
            question: t('faq_reservas_4_q'),
            answer: t('faq_reservas_4_a'),
          },
          {
            id: 'faq_reservas_5',
            question: t('faq_reservas_5_q'),
            answer: t('faq_reservas_5_a'),
          },
          {
            id: 'faq_reservas_6',
            question: t('faq_reservas_6_q'),
            answer: t('faq_reservas_6_a'),
          },
          {
            id: 'faq_reservas_7',
            question: t('faq_reservas_7_q'),
            answer: t('faq_reservas_7_a'),
          },
          {
            id: 'faq_reservas_8',
            question: t('faq_reservas_8_q'),
            answer: t('faq_reservas_8_a'),
          },
          {
            id: 'faq_reservas_9',
            question: t('faq_reservas_9_q'),
            answer: t('faq_reservas_9_a'),
          },
          {
            id: 'faq_reservas_10',
            question: t('faq_reservas_10_q'),
            answer: t('faq_reservas_10_a'),
          },
          {
            id: 'faq_reservas_11',
            question: t('faq_reservas_11_q'),
            answer: t('faq_reservas_11_a'),
          },
          {
            id: 'faq_reservas_12',
            question: t('faq_reservas_12_q'),
            answer: t('faq_reservas_12_a'),
          },
          {
            id: 'faq_reservas_13',
            question: t('faq_reservas_13_q'),
            answer: t('faq_reservas_13_a'),
          },
        ],
      },
      {
        id: 'cuenta-pagos',
        title: t('faq_category_cuenta_title'),
        faqs: [
          {
            id: 'faq_cuenta_1',
            question: t('faq_cuenta_1_q'),
            answer: t('faq_cuenta_1_a'),
          },
          {
            id: 'faq_cuenta_2',
            question: t('faq_cuenta_2_q'),
            answer: t('faq_cuenta_2_a'),
          },
          {
            id: 'faq_cuenta_3',
            question: t('faq_cuenta_3_q'),
            answer: t('faq_cuenta_3_a'),
          },
          {
            id: 'faq_cuenta_4',
            question: t('faq_cuenta_4_q'),
            answer: t('faq_cuenta_4_a'),
          },
          {
            id: 'faq_cuenta_5',
            question: t('faq_cuenta_5_q'),
            answer: t('faq_cuenta_5_a'),
          },
          {
            id: 'faq_cuenta_6',
            question: t('faq_cuenta_6_q'),
            answer: t('faq_cuenta_6_a'),
          },
          {
            id: 'faq_cuenta_7',
            question: t('faq_cuenta_7_q'),
            answer: t('faq_cuenta_7_a'),
          },
          {
            id: 'faq_cuenta_8',
            question: t('faq_cuenta_8_q'),
            answer: t('faq_cuenta_8_a'),
          },
          {
            id: 'faq_cuenta_9',
            question: t('faq_cuenta_9_q'),
            answer: t('faq_cuenta_9_a'),
          },
        ],
      },
      {
        id: 'otras-cuestiones',
        title: t('faq_category_otras_title'),
        faqs: [
          {
            id: 'faq_otras_1',
            question: t('faq_otras_1_q'),
            answer: t('faq_otras_1_a'),
          },
          {
            id: 'faq_otras_2',
            question: t('faq_otras_2_q'),
            answer: t('faq_otras_2_a'),
          },
          {
            id: 'faq_otras_3',
            question: t('faq_otras_3_q'),
            answer: t('faq_otras_3_a'),
          },
          {
            id: 'faq_otras_4',
            question: t('faq_otras_4_q'),
            answer: t('faq_otras_4_a'),
          },
          {
            id: 'faq_otras_5',
            question: t('faq_otras_5_q'),
            answer: t('faq_otras_5_a'),
          },
          {
            id: 'faq_otras_6',
            question: t('faq_otras_6_q'),
            answer: t('faq_otras_6_a'),
          },
        ],
      },
    ],
    [t]
  );

  // Pre-sanitize all answers once (expensive operation, memoized)
  const sanitizedAnswers = useMemo(
    () =>
      faqCategories.reduce(
        (acc, category) => {
          category.faqs.forEach(faq => {
            acc[faq.id] = DOMPurify.sanitize(faq.answer);
          });
          return acc;
        },
        {} as Record<string, string>
      ),
    [faqCategories]
  );

  // Schema Markup - BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('faq_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('faq_breadcrumb_current'),
        item: `${baseUrl}/${locale}/preguntas-frecuentes`,
      },
    ],
  };

  // Breadcrumb items for visual navigation with microdata
  const breadcrumbItems = [
    { name: t('faq_breadcrumb_home'), url: `/${locale}` },
    { name: t('faq_breadcrumb_current'), url: `/${locale}/preguntas-frecuentes`, isActive: true },
  ];

  // Generate FAQ Schema for Google
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqCategories.flatMap(category =>
      category.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      }))
    ),
  };

  return (
    <>
      <Helmet>
        <title>{t('faq_page_title')} | Farray&apos;s Center</title>
        <meta name="description" content={t('faq_page_description')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${baseUrl}/${locale}/preguntas-frecuentes`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-black pt-20 md:pt-24">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden min-h-[500px] flex items-center">
          {/* Background - Enterprise pattern */}
          <div className="absolute inset-0 bg-black">
            {/* Hero background image with configurable opacity */}
            <div className="absolute inset-0" style={{ opacity: 0.3 }}>
              <picture>
                <source srcSet="/images/optimized/foto1-scaled.webp" type="image/webp" />
                <img
                  src="/images/optimized/foto1-scaled.jpg"
                  alt={t('faq_hero_image_alt')}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 30%' }}
                  loading="eager"
                  fetchPriority="high"
                />
              </picture>
            </div>
            {/* Gradient overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/20 via-transparent to-black/50"></div>
          </div>
          <div className="container mx-auto px-6 relative z-10">
            {/* Breadcrumb with Microdata */}
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/70" />

            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h1
                  className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-6"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
                >
                  {t('faq_hero_title')}
                </h1>
                <p className="text-xl md:text-2xl text-neutral/90 leading-relaxed">
                  {t('faq_hero_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FAQ Categories Section */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto space-y-16">
              {faqCategories.map((category, categoryIndex) => (
                <AnimateOnScroll key={category.id} delay={categoryIndex * 100}>
                  <div className="space-y-6">
                    {/* Category Title */}
                    <div className="text-center mb-10 max-w-4xl mx-auto">
                      <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-2 holographic-text">
                        {category.title}
                      </h2>
                      <div className="w-24 h-1 bg-primary-accent mx-auto rounded-full"></div>
                    </div>

                    {/* FAQs in Category */}
                    <div className="space-y-4">
                      {category.faqs.map((faq, index) => {
                        const isOpen = openItems.has(faq.id);

                        return (
                          <AnimateOnScroll key={faq.id} delay={index * 30}>
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
                                  isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                }`}
                              >
                                <div
                                  className="px-6 pb-5 text-neutral/90 leading-relaxed prose prose-invert max-w-none"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizedAnswers[faq.id] || '',
                                  }}
                                />
                              </div>
                            </div>
                          </AnimateOnScroll>
                        );
                      })}
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black to-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-6">
                  {t('faq_cta_title')}
                </h2>
                <p className="text-lg text-neutral/90 mb-8">{t('faq_cta_subtitle')}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={`/${locale}/contacto`}
                    className="inline-block bg-primary-accent text-white font-bold text-lg py-4 px-8 rounded-full transition-all duration-300 hover:bg-primary-accent/90 hover:shadow-accent-glow"
                  >
                    {t('faq_cta_contact')}
                  </a>
                  <a
                    href="https://momence.com/sign-in?hostId=36148"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-black/50 backdrop-blur-md border border-primary-accent text-primary-accent font-bold text-lg py-4 px-8 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white"
                  >
                    {t('faq_cta_login')}
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default FAQPage;
