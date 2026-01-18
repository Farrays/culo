import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import AnimateOnScroll from './AnimateOnScroll';
import LeadCaptureModal from './shared/LeadCaptureModal';

const FinalCTA: React.FC = () => {
  const { t } = useI18n();
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

  return (
    <section id="enroll" className="relative py-12 md:py-16 overflow-hidden">
      {/* Background with stars */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
      </div>

      <div className="relative z-20 container mx-auto px-6 text-center">
        <AnimateOnScroll>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 holographic-text">
            {t('finalCtaTitle')}
          </h2>
        </AnimateOnScroll>
        <div className="max-w-3xl mx-auto space-y-4 mb-12">
          <AnimateOnScroll delay={100}>
            <p className="text-lg md:text-xl text-neutral/90">{t('finalCtaSubtitleLine1')}</p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <p className="text-xl md:text-2xl font-bold text-neutral">
              {t('finalCtaSubtitleLine2')}
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={300}>
            <p className="text-2xl md:text-3xl font-bold holographic-text">
              {t('finalCtaSubtitleLine3')}
            </p>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll delay={200}>
          <div className="flex flex-col items-center justify-center">
            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
            >
              <span>{t('puertasAbiertasCTA')}</span>
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
            <p className="text-sm text-neutral/80 mt-3 text-center max-w-md">
              {t('puertasAbiertasSubtext')}
            </p>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Lead Capture Modal */}
      <LeadCaptureModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
    </section>
  );
};

export default FinalCTA;
