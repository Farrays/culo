import { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';
import LeadCaptureModal from '../shared/LeadCaptureModal';

/**
 * IrresistibleOfferSection - Oferta con Urgencia y Escasez
 *
 * Elementos de conversión:
 * - Lista de beneficios con checkmarks
 * - Valor monetario visible
 * - Urgencia: plazas limitadas
 * - Risk reversal: sin compromiso
 * - CTA prominente
 */
const IrresistibleOfferSection: React.FC = () => {
  const { t } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(7);

  // Simular escasez dinámica (en producción esto vendría de un backend)
  useEffect(() => {
    const storedSpots = sessionStorage.getItem('spotsLeft');
    if (storedSpots) {
      setSpotsLeft(parseInt(storedSpots, 10));
    } else {
      const randomSpots = Math.floor(Math.random() * 5) + 5; // 5-9 plazas
      setSpotsLeft(randomSpots);
      sessionStorage.setItem('spotsLeft', randomSpots.toString());
    }
  }, []);

  const benefits = [
    { textKey: 'offer_benefit1', valueKey: 'offer_value1' },
    { textKey: 'offer_benefit2', valueKey: 'offer_value2' },
    { textKey: 'offer_benefit3', valueKey: 'offer_value3' },
    { textKey: 'offer_benefit4', valueKey: 'offer_value4' },
    { textKey: 'offer_benefit5', valueKey: 'offer_value5' },
  ];

  return (
    <>
      <section id="offer-section" className="py-20 md:py-28 bg-primary-dark/10">
        <div className="container mx-auto px-6">
          <AnimateOnScroll>
            <div className="max-w-4xl mx-auto">
              {/* Header con badge */}
              <div className="text-center mb-10">
                <span className="inline-block px-4 py-2 bg-primary-accent/20 text-primary-accent font-bold text-sm uppercase tracking-wider rounded-full mb-4">
                  {t('offer_badge')}
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('offer_title')}
                </h2>
                <p className="text-xl text-neutral/70">{t('offer_subtitle')}</p>
              </div>

              {/* Card principal */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-accent/40 to-yellow-500/40 rounded-3xl blur-xl opacity-60" />
                <div className="relative bg-black/90 backdrop-blur-md border-2 border-primary-accent rounded-3xl p-8 md:p-12">
                  {/* Lista de beneficios */}
                  <ul className="space-y-5 mb-10">
                    {benefits.map((benefit, index) => (
                      <AnimateOnScroll key={benefit.textKey} delay={100 + index * 50}>
                        <li className="flex items-start gap-4">
                          <div className="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg
                              className="w-4 h-4 text-green-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <span className="text-neutral text-lg">{t(benefit.textKey)}</span>
                            <span className="ml-2 text-neutral/50 line-through text-sm">
                              {t(benefit.valueKey)}
                            </span>
                          </div>
                        </li>
                      </AnimateOnScroll>
                    ))}
                  </ul>

                  {/* Urgencia - Plazas limitadas */}
                  <AnimateOnScroll delay={400}>
                    <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                      <p className="text-red-400 font-bold">
                        {t('offer_urgency').replace('{spots}', spotsLeft.toString())}
                      </p>
                    </div>
                  </AnimateOnScroll>

                  {/* CTA Principal */}
                  <AnimateOnScroll delay={500}>
                    <div className="text-center">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full sm:w-auto bg-primary-accent text-white font-bold text-xl py-5 px-12 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                      >
                        {t('offer_cta')}
                      </button>

                      {/* Risk reversal */}
                      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-neutral/50 text-sm">
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {t('offer_trust1')}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {t('offer_trust2')}
                        </span>
                      </div>
                    </div>
                  </AnimateOnScroll>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Modal de captura de leads */}
      <LeadCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default IrresistibleOfferSection;
