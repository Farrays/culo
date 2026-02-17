/**
 * =============================================================================
 * DIRECT SALE LANDING PAGE COMPONENT (Hormozi/Brunson Style)
 * =============================================================================
 *
 * Landing page para VENTA DIRECTA de cursos de baile.
 * Diseñada siguiendo principios de Alex Hormozi y Russell Brunson:
 *
 * 1. Hook + Promesa específica
 * 2. Video/Prueba visual
 * 3. El Problema (agitar el dolor)
 * 4. La Solución (método único)
 * 5. Prueba Social (testimonios detallados)
 * 6. Value Stack (stack de valor)
 * 7. Garantía (eliminar riesgo)
 * 8. Urgencia (plazas limitadas)
 * 9. CTA + Horarios
 * 10. FAQ (manejo de objeciones)
 * 11. CTA Final
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES, type Locale } from '../../types';
import AnimateOnScroll from '../AnimateOnScroll';
import BunnyEmbed from '../BunnyEmbed';
import {
  CheckCircleIcon,
  ChevronDownIcon,
  GlobeIcon,
  StarIcon,
  UsersIcon,
  ClockIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from '../../lib/icons';
import type { DirectSaleLandingConfig } from '../../constants/direct-sale-landing-config';

// =============================================================================
// TYPES
// =============================================================================

interface DirectSaleLandingProps {
  config: DirectSaleLandingConfig;
}

// =============================================================================
// COUNTDOWN COMPONENT
// =============================================================================

interface CountdownProps {
  deadline: string;
  theme: DirectSaleLandingConfig['theme']['classes'];
  prefix: string;
}

const Countdown: React.FC<CountdownProps> = ({ deadline, theme, prefix }) => {
  const { t } = useTranslation(['common', 'pages']);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const target = new Date(deadline);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [deadline]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const units = [
    { value: timeLeft.days, label: t(`${prefix}CountdownDays`, { defaultValue: 'días' }) },
    { value: timeLeft.hours, label: t(`${prefix}CountdownHours`, { defaultValue: 'horas' }) },
    { value: timeLeft.minutes, label: t(`${prefix}CountdownMins`, { defaultValue: 'min' }) },
    { value: timeLeft.seconds, label: t(`${prefix}CountdownSecs`, { defaultValue: 'seg' }) },
  ];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {units.map((unit, idx) => (
        <React.Fragment key={unit.label}>
          <div className="flex flex-col items-center">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 bg-black/60 ${theme.borderPrimaryLight} border rounded-lg flex items-center justify-center`}
            >
              <span className={`text-xl sm:text-2xl font-black ${theme.textPrimary} tabular-nums`}>
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs text-neutral/60 mt-1 uppercase">
              {unit.label}
            </span>
          </div>
          {idx < units.length - 1 && (
            <span className={`${theme.textPrimary} opacity-60 text-xl font-bold mb-5`}>:</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const DirectSaleLanding: React.FC<DirectSaleLandingProps> = ({ config }) => {
  const { t, i18n } = useTranslation(['common', 'pages', 'booking', 'schedule']);
  const locale = i18n.language;
  const navigate = useNavigate();
  const location = useLocation();

  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const { images, translationPrefix: prefix } = config;
  const theme = config.theme.classes;
  const baseUrl = 'https://www.farrayscenter.com';

  // Calculate total value
  const totalValue = useMemo(
    () => config.valueStack.reduce((sum, item) => sum + item.value, 0),
    [config.valueStack]
  );

  // Language handling
  const getCurrentPath = useCallback((): string => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts[0] && (SUPPORTED_LOCALES as readonly string[]).includes(pathParts[0])) {
      pathParts.shift();
    }
    return pathParts.length > 0 ? `/${pathParts.join('/')}` : '/';
  }, [location.pathname]);

  const handleLangChange = useCallback(
    (newLocale: string) => {
      const currentPath = getCurrentPath();
      navigate(`/${newLocale}${currentPath === '/' ? '' : currentPath}`);
      setShowLangMenu(false);
    },
    [getCurrentPath, navigate]
  );

  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  const languages: { code: Locale; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'ca', label: 'CA' },
    { code: 'fr', label: 'FR' },
  ];

  // Handle CTA click - open Momence in new tab
  const handleCTAClick = (momenceUrl?: string) => {
    if (momenceUrl) {
      window.open(momenceUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback to general booking page
      navigate(`/${locale}/reservas?style=bachata`);
    }
  };

  return (
    <>
      <Helmet>
        <title>
          {t(`${prefix}PageTitle`, { defaultValue: `Curso de ${config.estiloValue}` })} |
          Farray&apos;s Center
        </title>
        <meta name="description" content={t(`${prefix}PageDescription`)} />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content={t(`${prefix}PageTitle`)} />
        <meta property="og:description" content={t(`${prefix}PageDescription`)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/${locale}/${config.slug}`} />
        <meta property="og:image" content={`${baseUrl}${images.hero}`} />
        <link rel="canonical" href={`${baseUrl}/${locale}/${config.slug}`} />
      </Helmet>

      <main className="bg-black min-h-screen">
        {/* Language Selector */}
        <div className="fixed top-4 right-4 z-50">
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/20 transition-all`}
            >
              <GlobeIcon className={`w-4 h-4 ${theme.textPrimary}`} />
              <span className="text-neutral text-sm font-medium uppercase">{locale}</span>
              <ChevronDownIcon
                className={`w-4 h-4 text-neutral/60 transition-transform ${showLangMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {showLangMenu && (
              <div className="absolute top-full right-0 mt-2 py-2 bg-black/90 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl min-w-[80px]">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      locale === lang.code
                        ? `${theme.textPrimary} ${theme.bgPrimaryLight}`
                        : 'text-neutral hover:bg-white/5'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================================================================= */}
        {/* 1. HERO - Hook + Promesa específica */}
        {/* ================================================================= */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={images.hero}
              alt={images.heroAlt}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center py-16 sm:py-20">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full ${theme.bgPrimaryLight} ${theme.borderPrimary} border backdrop-blur-md`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${theme.bgPrimary} opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-full w-full ${theme.bgPrimary}`}
                />
              </span>
              <span
                className={`${theme.textPrimaryLight} text-xs sm:text-sm font-semibold uppercase`}
              >
                {t(`${prefix}Badge`, { defaultValue: 'Plazas Limitadas' })}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] mb-6 holographic-text"
              style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
            >
              {t(`${prefix}Headline`, {
                defaultValue: `Aprende a bailar ${config.estiloValue} en ${config.hero.duration} semanas`,
              })}
            </h1>

            {/* Subheadline */}
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-neutral/80 mb-8">
              {t(`${prefix}Subheadline`, {
                defaultValue: '(aunque nunca hayas pisado una pista de baile)',
              })}
            </p>

            {/* Bullets */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10">
              {config.hero.bullets.map((bulletKey, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full ${theme.borderPrimaryLight} border`}
                >
                  <CheckCircleIcon className={`w-4 h-4 ${theme.textPrimary}`} />
                  <span className="text-neutral text-sm">
                    {t(bulletKey, { defaultValue: bulletKey })}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => handleCTAClick(config.schedule[0]?.momenceUrl)}
              className={`w-full sm:w-auto sm:min-w-[320px] min-h-[52px] ${theme.bgPrimary} text-white font-bold text-lg py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-2xl ${theme.shadowPrimary} animate-glow`}
            >
              {t(`${prefix}HeroCTA`, { defaultValue: 'RESERVAR MI PLAZA AHORA' })}
            </button>

            {/* Trust indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-neutral/70 text-sm">
              <span className="flex items-center gap-1">
                <StarIcon className={`w-4 h-4 ${theme.textPrimary}`} />
                <span className="text-neutral font-bold">4.9</span>
                <span>(509+ reseñas)</span>
              </span>
              <span className="text-neutral/40">·</span>
              <span className="flex items-center gap-1">
                <UsersIcon className={`w-4 h-4 ${theme.textPrimary}`} />
                <span>+{config.stats.totalStudents.toLocaleString()} alumnos</span>
              </span>
              <span className="text-neutral/40">·</span>
              <span className="flex items-center gap-1">
                <ClockIcon className={`w-4 h-4 ${theme.textPrimary}`} />
                <span>{config.stats.years} años de experiencia</span>
              </span>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. VIDEO / PRUEBA VISUAL */}
        {/* ================================================================= */}
        {config.video && (
          <section className="py-12 md:py-16 bg-primary-dark/10">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-2xl mx-auto">
                <AnimateOnScroll>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral text-center mb-6">
                    {t(`${prefix}VideoTitle`, {
                      defaultValue: 'Mira lo que conseguirás en pocas semanas',
                    })}
                  </h2>
                </AnimateOnScroll>
                <BunnyEmbed
                  videoId={config.video.bunnyVideoId}
                  libraryId={config.video.bunnyLibraryId}
                  title={t(`${prefix}VideoTitle`)}
                  aspectRatio={config.video.aspectRatio || '16:9'}
                  thumbnailUrl={config.video.thumbnailUrl}
                  autoplay={config.video.autoplay}
                  priority={true}
                />
              </div>
            </div>
          </section>
        )}

        {/* ================================================================= */}
        {/* 3. EL PROBLEMA (Agitar el dolor) */}
        {/* ================================================================= */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <AnimateOnScroll>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral text-center mb-3 holographic-text">
                  {t(`${prefix}ProblemTitle`, { defaultValue: '¿Te ha pasado esto?' })}
                </h2>
                <p className="text-neutral/60 text-center mb-8">
                  {t(`${prefix}ProblemSubtitle`, {
                    defaultValue: 'No estás solo/a. El 90% de nuestros alumnos empezaron igual.',
                  })}
                </p>
              </AnimateOnScroll>

              <div className="space-y-3">
                {config.problems.map((problem, idx) => (
                  <AnimateOnScroll key={idx} delay={idx * 80}>
                    <div
                      className={`flex items-start gap-4 p-4 bg-black/40 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all`}
                    >
                      <span className="text-2xl flex-shrink-0">{problem.emoji}</span>
                      <p className="text-neutral/90 text-sm sm:text-base">
                        {t(problem.key, { defaultValue: problem.key })}
                      </p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. LA SOLUCIÓN (Método único) */}
        {/* ================================================================= */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <AnimateOnScroll>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral text-center mb-2 holographic-text">
                  {t(`${prefix}MethodTitle`, { defaultValue: 'La Solución' })}
                </h2>
                <p className={`text-center ${theme.textPrimary} text-xl font-bold mb-8`}>
                  {t(config.method.nameKey, {
                    defaultValue: `El Método Farray's de ${config.hero.duration} Semanas`,
                  })}
                </p>
              </AnimateOnScroll>

              <div className="grid sm:grid-cols-2 gap-4">
                {config.method.steps.map((step, idx) => (
                  <AnimateOnScroll key={idx} delay={idx * 100}>
                    <div
                      className={`p-5 bg-black/40 rounded-xl ${theme.borderPrimaryLight} border hover:${theme.borderPrimary} transition-all`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-full ${theme.bgPrimary} flex items-center justify-center text-white font-bold text-sm`}
                        >
                          {step.step}
                        </div>
                        <h3 className="text-neutral font-bold">
                          {t(step.titleKey, { defaultValue: `Semana ${step.step}` })}
                        </h3>
                      </div>
                      <p className="text-neutral/70 text-sm">
                        {t(step.descKey, { defaultValue: step.descKey })}
                      </p>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              <AnimateOnScroll>
                <p className={`text-center ${theme.textPrimary} font-semibold mt-8 text-lg`}>
                  {t(`${prefix}MethodTagline`, {
                    defaultValue: '"No te enseñamos pasos sueltos. Te enseñamos a BAILAR."',
                  })}
                </p>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. TESTIMONIOS DETALLADOS */}
        {/* ================================================================= */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral text-center mb-2 holographic-text">
                {t(`${prefix}TestimonialsTitle`, { defaultValue: 'Lo que dicen nuestros alumnos' })}
              </h2>
              <div className="flex items-center justify-center gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className={`w-5 h-5 ${theme.textPrimary}`} />
                ))}
                <span className="text-neutral/70 text-sm ml-2">4.9 en Google (509+ reseñas)</span>
              </div>
            </AnimateOnScroll>

            {/* Showcase image */}
            <AnimateOnScroll>
              <div className="max-w-md mx-auto mb-10">
                <div
                  className={`rounded-2xl overflow-hidden ${theme.borderPrimary} border shadow-xl`}
                >
                  <img
                    src={images.showcase}
                    alt={images.showcaseAlt}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {config.testimonials.map((testimonial, idx) => (
                <AnimateOnScroll key={testimonial.id} delay={idx * 100}>
                  <div
                    className={`h-full p-5 bg-black/40 rounded-xl border border-white/10 hover:${theme.borderPrimary} transition-all`}
                  >
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-4 h-4 ${theme.textPrimary}`} />
                      ))}
                    </div>
                    <p className="text-neutral/80 text-sm italic mb-4">
                      &ldquo;{t(testimonial.quoteKey, { defaultValue: testimonial.quoteKey })}
                      &rdquo;
                    </p>
                    {testimonial.resultKey && (
                      <p className={`text-sm ${theme.textPrimary} font-semibold mb-3`}>
                        {t(testimonial.resultKey, { defaultValue: testimonial.resultKey })}
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-neutral font-semibold text-sm">{testimonial.name}</p>
                        {(testimonial.age || testimonial.profession) && (
                          <p className="text-neutral/60 text-xs">
                            {testimonial.age && `${testimonial.age} años`}
                            {testimonial.age && testimonial.profession && ', '}
                            {testimonial.profession &&
                              t(testimonial.profession, { defaultValue: testimonial.profession })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 6. VALUE STACK */}
        {/* ================================================================= */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <AnimateOnScroll>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral text-center mb-8 holographic-text">
                  {t(`${prefix}ValueTitle`, { defaultValue: '¿Qué incluye?' })}
                </h2>
              </AnimateOnScroll>

              <div className="space-y-3 mb-8">
                {config.valueStack.map((item, idx) => (
                  <AnimateOnScroll key={idx} delay={idx * 60}>
                    <div
                      className={`flex items-center justify-between p-4 bg-black/50 rounded-xl ${theme.borderPrimaryLight} border`}
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircleIcon className={`w-5 h-5 ${theme.textPrimary} flex-shrink-0`} />
                        <span className="text-neutral text-sm sm:text-base">
                          {t(item.key, { defaultValue: item.key })}
                        </span>
                      </div>
                      <span className={`${theme.textPrimary} font-bold`}>
                        {t(`${prefix}ValueAmount`, {
                          defaultValue: `Valor: ${item.value}€`,
                          value: item.value,
                        })}
                      </span>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              {/* Price comparison */}
              <AnimateOnScroll>
                <div
                  className={`bg-gradient-to-r ${theme.bgPrimaryDark} ${theme.bgAccentLight} rounded-2xl p-6 ${theme.borderPrimary} border mb-8 shadow-xl`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-neutral/60 text-sm">
                        {t(`${prefix}ValueTotal`, { defaultValue: 'Valor total' })}
                      </p>
                      <p className="text-3xl font-bold text-neutral line-through">{totalValue}€</p>
                    </div>
                    <div className={`text-3xl ${theme.textPrimary} opacity-50`}>→</div>
                    <div className="text-right">
                      <p className="text-neutral/60 text-sm">
                        {t(`${prefix}YourPrice`, { defaultValue: 'Tu precio hoy' })}
                      </p>
                      <p className={`text-4xl font-black ${theme.textPrimary}`}>
                        {config.pricing.firstMonthPrice}€
                        <span className="text-lg text-neutral/60">/mes</span>
                      </p>
                    </div>
                  </div>

                  <div className={`pt-4 border-t ${theme.borderPrimaryLight}`}>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                      <span className="flex items-center gap-2">
                        <CheckCircleIcon className={`w-4 h-4 ${theme.textPrimary}`} />
                        <span className="text-neutral">
                          1er mes: <strong>{config.pricing.firstMonthPrice}€</strong>{' '}
                          <span className="line-through text-neutral/50">
                            {config.pricing.normalPrice}€
                          </span>
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <CheckCircleIcon className={`w-4 h-4 ${theme.textPrimary}`} />
                        <span className="text-neutral">
                          Inscripción: <strong>GRATIS</strong>{' '}
                          <span className="line-through text-neutral/50">
                            {config.pricing.enrollmentFee}€
                          </span>
                        </span>
                      </span>
                    </div>
                    <p className={`text-center mt-4 text-lg font-bold ${theme.textPrimary}`}>
                      {t(`${prefix}TotalSavings`, {
                        defaultValue: `Ahorro total: ${config.pricing.totalSavings}€`,
                        savings: config.pricing.totalSavings,
                      })}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>

              {/* Urgency + Countdown */}
              {config.urgency.deadline && (
                <AnimateOnScroll>
                  <div className="text-center mb-8">
                    <p className="text-neutral/80 font-semibold mb-4">
                      {t(`${prefix}OfferEnds`, { defaultValue: 'Esta oferta termina en:' })}
                    </p>
                    <Countdown deadline={config.urgency.deadline} theme={theme} prefix={prefix} />
                  </div>
                </AnimateOnScroll>
              )}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 7. GARANTÍA */}
        {/* ================================================================= */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <AnimateOnScroll>
                <div
                  className={`p-6 sm:p-8 bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-2xl border border-green-500/30`}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <ShieldCheckIcon className="w-8 h-8 text-green-400" />
                    <h2 className="text-xl sm:text-2xl font-black text-neutral">
                      {t(`${prefix}GuaranteeTitle`, {
                        defaultValue: 'GARANTÍA "TE GUSTA O TE DEVOLVEMOS"',
                      })}
                    </h2>
                  </div>
                  <p className="text-neutral/80 text-center text-sm sm:text-base mb-4">
                    {t(`${prefix}GuaranteeDesc`, {
                      defaultValue:
                        'Si después de tu primera clase sientes que no es para ti, te devolvemos el 100% del dinero. Sin preguntas.',
                    })}
                  </p>
                  {config.guarantee.refundStats && (
                    <p className="text-green-400 text-center text-sm font-medium">
                      {t(config.guarantee.refundStats, {
                        defaultValue: '(En 12 años, solo 3 personas han pedido devolución)',
                      })}
                    </p>
                  )}
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 8. HORARIOS + CTA */}
        {/* ================================================================= */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto">
              <AnimateOnScroll>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral text-center mb-2 holographic-text">
                  {t(`${prefix}ScheduleTitle`, { defaultValue: 'Elige tu horario' })}
                </h2>
                <p className="text-neutral/60 text-center mb-8">
                  {t(`${prefix}ScheduleSubtitle`, {
                    defaultValue: 'Grupos reducidos (máx. 16 personas) para atención personalizada',
                  })}
                </p>
              </AnimateOnScroll>

              <div className="space-y-3 mb-8">
                {config.schedule.map((slot, idx) => (
                  <AnimateOnScroll key={slot.id} delay={idx * 80}>
                    <div
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-black/50 rounded-xl ${theme.borderPrimaryLight} border hover:${theme.borderPrimary} transition-all gap-4`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[80px]">
                          <span className="text-neutral font-bold block">
                            {t(slot.dayKey, { defaultValue: slot.dayKey })}
                          </span>
                          <span className="text-neutral/60 text-sm">
                            {slot.time.split(' - ')[0]}
                          </span>
                        </div>
                        <div className={`w-px h-10 ${theme.bgPrimaryLight} hidden sm:block`} />
                        <div>
                          <p className="text-neutral font-semibold">{slot.className}</p>
                          <p className="text-neutral/60 text-sm">{slot.teacher}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {slot.spotsLeft !== undefined && config.urgency.showSpotsLeft && (
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              slot.spotsLeft <= 3
                                ? 'bg-red-500/20 text-red-400'
                                : `${theme.bgPrimaryLight} ${theme.textPrimary}`
                            } font-medium`}
                          >
                            {t(`${prefix}SpotsLeft`, {
                              defaultValue: `Quedan ${slot.spotsLeft} plazas`,
                              spots: slot.spotsLeft,
                            })}
                          </span>
                        )}
                        <button
                          onClick={() => handleCTAClick(slot.momenceUrl)}
                          className={`px-6 py-2 ${theme.bgPrimary} text-white font-bold rounded-full text-sm hover:scale-105 transition-transform`}
                        >
                          {t(`${prefix}ReserveBtn`, { defaultValue: 'RESERVAR' })}
                        </button>
                      </div>
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              {/* Main CTA */}
              <AnimateOnScroll>
                <div className="text-center">
                  <button
                    onClick={() => handleCTAClick(config.schedule[0]?.momenceUrl)}
                    className={`w-full sm:w-auto sm:min-w-[320px] min-h-[52px] ${theme.bgPrimary} text-white font-bold text-lg py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-2xl ${theme.shadowPrimary} animate-glow`}
                  >
                    {t(`${prefix}MainCTA`, {
                      defaultValue: `EMPEZAR AHORA - ${config.pricing.firstMonthPrice}€`,
                    })}
                  </button>
                  <p className="text-neutral/60 text-sm mt-4">
                    {t(`${prefix}NoPermanence`, {
                      defaultValue: 'Sin permanencia. Cancela cuando quieras.',
                    })}
                  </p>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 9. FAQ */}
        {/* ================================================================= */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral text-center mb-8 holographic-text">
                {t(`${prefix}FaqTitle`, { defaultValue: 'Preguntas frecuentes' })}
              </h2>
            </AnimateOnScroll>

            <div className="max-w-2xl mx-auto space-y-3">
              {config.faqs.map(faq => (
                <AnimateOnScroll key={faq.id}>
                  <div
                    className={`bg-black/40 rounded-xl border border-white/10 overflow-hidden hover:${theme.borderPrimary} transition-all`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                    >
                      <span className="text-neutral font-semibold text-sm sm:text-base pr-4">
                        {t(faq.questionKey, { defaultValue: faq.questionKey })}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 ${theme.textPrimary} flex-shrink-0 transition-transform ${openFaq === faq.id ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openFaq === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <p className="px-5 pb-4 text-neutral/70 text-sm leading-relaxed">
                        {t(faq.answerKey, { defaultValue: faq.answerKey })}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 10. FINAL CTA */}
        {/* ================================================================= */}
        <section className="py-12 md:py-16 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />

          <div className="relative z-10 container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral mb-4 holographic-text">
                  {t(`${prefix}FinalTitle`, {
                    defaultValue: '¿Listo/a para empezar a bailar?',
                  })}
                </h2>
                <p className="text-neutral/70 text-lg mb-8">
                  {t(`${prefix}FinalDesc`, {
                    defaultValue:
                      'Únete a los +15.000 alumnos que ya han transformado su forma de bailar.',
                  })}
                </p>

                <button
                  onClick={() => handleCTAClick(config.schedule[0]?.momenceUrl)}
                  className={`w-full sm:w-auto sm:min-w-[320px] min-h-[52px] ${theme.bgPrimary} text-white font-bold text-lg py-4 px-8 rounded-full transition-all transform hover:scale-105 shadow-2xl ${theme.shadowPrimary} animate-glow relative overflow-hidden group`}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <span className="relative">
                    {t(`${prefix}FinalCTA`, {
                      defaultValue: `RESERVAR MI PLAZA - ${config.pricing.firstMonthPrice}€/mes`,
                    })}
                  </span>
                </button>

                <p className="text-neutral/60 text-sm mt-6">
                  {t(`${prefix}FinalTrust`, {
                    defaultValue: `Ahorra ${config.pricing.totalSavings}€ · Sin permanencia · Garantía de satisfacción`,
                  })}
                </p>

                {/* Contact */}
                <div className="mt-10 pt-8 border-t border-white/10">
                  <p className="text-neutral/70 text-sm mb-4">
                    {t(`${prefix}QuestionsTitle`, { defaultValue: '¿Todavía tienes dudas?' })}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <a
                      href={`https://wa.me/${config.contact.whatsapp.replace(/\s/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </a>
                    <span className="flex items-center gap-2 text-neutral/60">
                      <MapPinIcon className="w-4 h-4" />
                      {config.contact.address}
                    </span>
                  </div>
                  <p className="text-neutral/50 text-xs mt-3">
                    {t(config.contact.responseTimeKey, {
                      defaultValue: 'Respondemos en menos de 2 horas',
                    })}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-6 border-t border-white/10 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <p className="text-neutral/60 text-xs sm:text-sm text-center">
              Farray&apos;s International Dance Center © {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default DirectSaleLanding;
