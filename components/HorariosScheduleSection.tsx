/**
 * HorariosScheduleSection - Schedule and booking for /horarios-precios
 * Enterprise-level integration with BookingWidgetV2
 */
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from './AnimateOnScroll';
import BookingWidgetV2 from './booking/BookingWidgetV2';

const HorariosScheduleSection = () => {
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

  return (
    <section className="py-16 min-h-screen bg-black">
      <div className="container mx-auto px-4">
        {/* Hero Section - Compact */}
        <AnimateOnScroll>
          <div className="text-center mb-10 max-w-5xl mx-auto">
            {/* Descripción */}
            <div className="max-w-3xl mx-auto mb-8">
              <p className="text-neutral/80 text-lg md:text-xl leading-relaxed">
                {t('schedule:horarios_intro_text')}{' '}
                <strong className="text-neutral">{t('schedule:horarios_intro_highlight')}</strong>
                {t('schedule:horarios_intro_suffix')}
              </p>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral/60">
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
                </svg>
                <span className="font-semibold">+80</span> {t('schedule_classes_weekly')}
              </span>
              <span className="hidden sm:inline text-neutral/30">•</span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                {t('schedule_expert_teachers')}
              </span>
              <span className="hidden sm:inline text-neutral/30">•</span>
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-primary-accent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {t('schedule_flexible_booking')}
              </span>
            </div>

            {/* Reviews Badge */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-sm text-neutral/60">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{t('schedule:horarios_reviews_based_on')}</span>
                </div>
                <div className="text-xs text-neutral/50 mt-1 font-medium">Google</div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* BookingWidget - Full functionality */}
        <div className="max-w-2xl mx-auto">
          <AnimateOnScroll delay={100}>
            <BookingWidgetV2 />
          </AnimateOnScroll>
        </div>

        {/* Pricing Section */}
        <div className="mt-16">
          <AnimateOnScroll delay={200}>
            <div className="text-center py-12 border-t border-white/10">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral mb-4">
                {t('pricing_cta_title')}
              </h2>
              <p className="text-neutral/70 mb-8 max-w-md mx-auto text-lg">
                {t('pricing_cta_subtitle')}
              </p>

              {/* CTA Hazte Socio - Dynamic locale link */}
              <Link
                to={`/${locale}/hazte-socio`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow focus:outline-none focus:ring-4 focus:ring-primary-accent/50"
              >
                {t('common:nav_hazte_socio', 'Hazte Socio')}
              </Link>

              <p className="text-xs text-neutral/70 mt-4 max-w-lg mx-auto">
                {t('pricing_cta_secondary_subtext')}
              </p>
              <p className="text-xs text-neutral/70">{t('pricing_cta_secondary_subtitle')}</p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default memo(HorariosScheduleSection);
