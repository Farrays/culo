import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import { ScheduleCard } from './ScheduleCard';
import {
  getClassesByBlockConfig,
  getWhatsAppUrl,
  type ScheduleBlockConfig,
} from '../../constants/horarios-page-data';
import AnimateOnScroll from '../AnimateOnScroll';
import { SunIcon, ClockIcon, MusicalNoteIcon, FireIcon, ChatBubbleIcon } from '../../lib/icons';

// Block icon mapping (no emojis)
const BLOCK_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'morning-block': SunIcon,
  'evening-danza-block': ClockIcon,
  'salsa-bachata-block': MusicalNoteIcon,
  'urbano-block': FireIcon,
};

interface ScheduleBlockProps {
  config: ScheduleBlockConfig;
  showTestimonial?: boolean;
}

/**
 * Schedule block component
 * Groups classes by time/category with testimonial and CTA
 */
export const ScheduleBlock: React.FC<ScheduleBlockProps> = ({ config, showTestimonial = true }) => {
  const { t } = useI18n();

  // Get classes for this block
  const classes = getClassesByBlockConfig(config);

  const colorVariants: Record<string, string> = {
    emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
    rose: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  };

  const colorClass = colorVariants[config.colorClass] ?? colorVariants['amber'];

  return (
    <section
      id={config.anchorId}
      className="py-12 md:py-16 scroll-mt-24"
      aria-labelledby={`${config.id}-title`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <AnimateOnScroll>
          {/* Header with SVG icon */}
          <div className={`rounded-2xl bg-gradient-to-br ${colorClass} border p-6 md:p-8 mb-8`}>
            <div className="flex items-start gap-4">
              {(() => {
                const BlockIcon = BLOCK_ICONS[config.id];
                return BlockIcon ? (
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center">
                    <BlockIcon className="w-8 h-8 text-white/90" />
                  </div>
                ) : null;
              })()}
              <div>
                <h2
                  id={`${config.id}-title`}
                  className="text-2xl md:text-3xl font-bold text-neutral mb-2"
                >
                  {t(config.titleKey)}
                </h2>
                <p className="text-neutral/70">{t(config.subtitleKey)}</p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Classes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {classes.slice(0, 9).map((cls, index) => (
            <AnimateOnScroll key={cls.id} delay={index * 50}>
              <ScheduleCard scheduleClass={cls} colorClass={config.colorClass} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* Note: Additional classes beyond 9 are available via WhatsApp inquiry */}

        {/* Inline testimonial with SVG icon */}
        {showTestimonial && config.testimonialKey && (
          <AnimateOnScroll>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-accent/10 flex items-center justify-center">
                  <ChatBubbleIcon className="w-5 h-5 text-primary-accent/60" />
                </div>
                <div>
                  <p className="text-neutral/80 italic mb-2">
                    &ldquo;{t(config.testimonialKey)}&rdquo;
                  </p>
                  {config.testimonialAuthorKey && (
                    <p className="text-sm text-neutral/50">— {t(config.testimonialAuthorKey)}</p>
                  )}
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        )}

        {/* CTA with SVG icon */}
        <AnimateOnScroll>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppUrl(config.ctaContext)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-accent hover:bg-primary-accent/90 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-accent/20"
              data-track="cta_click"
              data-track-block={config.id}
            >
              <ChatBubbleIcon className="w-5 h-5" />
              {t(config.ctaKey)}
            </a>
          </div>
        </AnimateOnScroll>

        {/* Legal disclaimer */}
        <p className="text-center text-xs text-neutral/40 mt-6">
          {t('horariosV2_block_disclaimer')}
        </p>
      </div>
    </section>
  );
};

export default ScheduleBlock;
