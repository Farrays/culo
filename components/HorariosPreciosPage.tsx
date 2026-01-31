import { useState, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumb from './shared/Breadcrumb';
import AnimateOnScroll from './AnimateOnScroll';
import OptimizedImage from './OptimizedImage';
import HorariosScheduleSection from './HorariosScheduleSection';
import ScheduleImagesSection from './ScheduleImagesSection';
import { ReviewsSection } from './reviews';
import {
  CheckIcon,
  ChevronDownIcon,
  SparklesIcon,
  StarIcon,
  UserIcon,
  ClockIcon,
  HeartIcon,
  CheckCircleIcon,
  AcademicCapIcon,
} from '../lib/icons';
import {
  ENROLLMENT_FEE,
  MONTHLY_PLANS_REGULAR,
  MONTHLY_PLANS_PREMIUM,
  UNLIMITED_PLAN,
  FLEXIBLE_PLANS_REGULAR,
  FLEXIBLE_PLANS_PREMIUM,
  DROP_IN_PRICES,
  PERSONAL_TRAINING_PACKS,
  formatPrice,
  type MonthlyPlan,
  type FlexiblePlan,
} from '../constants/pricing-data';

/**
 * HorariosPreciosPage - Página de Horarios y Precios detallados
 * URL SEO: /horarios-precios
 * Terminología interna: Club Deportivo (cuotas, socio, actividades)
 */

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Plan Card for Monthly Plans
 */
const MonthlyPlanCard = memo(
  ({
    plan,
    t,
    isPremium,
    locale,
  }: {
    plan: MonthlyPlan;
    t: (key: string) => string;
    isPremium: boolean;
    locale: string;
  }) => {
    const isPopular = plan.isPopular;

    return (
      <div className="[perspective:1000px] h-full">
        <div
          className={`relative h-full flex flex-col bg-black/50 backdrop-blur-md rounded-2xl p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow ${
            isPopular
              ? 'border-2 border-primary-accent shadow-accent-glow'
              : 'border border-primary-dark/50 hover:border-primary-accent/50'
          }`}
        >
          {isPopular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-accent text-white text-xs font-bold px-4 py-1 rounded-full">
              {t('pricing_popular')}
            </div>
          )}

          <div className="text-center mb-4">
            <p className="text-neutral/70 text-sm mb-1">
              {plan.activitiesPerMonth} {t('pricing_activities_month')}
            </p>
            <p className="text-4xl font-black text-neutral">
              {formatPrice(plan.price)}
              <span className="text-lg font-normal text-neutral/70">/mes</span>
            </p>
            <p className="text-primary-accent text-sm mt-1">
              {formatPrice(plan.pricePerActivity)} / {t('pricing_per_activity')}
            </p>
          </div>

          <ul className="space-y-2 mb-6 text-sm flex-grow">
            <li className="flex items-center gap-2 text-neutral/90">
              <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0" />
              {plan.hoursPerWeek}h {t('pricing_per_week')}
            </li>
            <li className="flex items-center gap-2 text-neutral/90">
              <CheckIcon className="w-4 h-4 text-primary-accent flex-shrink-0" />
              {t('pricing_all_styles')}
            </li>
            {isPremium && (
              <li className="flex items-center gap-2 text-neutral/90">
                <StarIcon className="w-4 h-4 text-primary-accent flex-shrink-0" />
                {t('pricing_with_yunaisy')}
              </li>
            )}
          </ul>

          <Link
            to={`/${locale}/hazte-socio`}
            className={`block w-full text-center font-bold py-3 px-6 rounded-full transition-all duration-300 mt-auto ${
              isPopular
                ? 'bg-primary-accent text-white hover:shadow-accent-glow animate-glow'
                : 'bg-black/50 border border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-white'
            }`}
          >
            {t('pricing_select_plan')}
          </Link>
        </div>
      </div>
    );
  }
);

MonthlyPlanCard.displayName = 'MonthlyPlanCard';

/**
 * Flexible Plan Card
 */
const FlexiblePlanCard = memo(
  ({
    plan,
    t,
    isPremium,
    locale,
  }: {
    plan: FlexiblePlan;
    t: (key: string) => string;
    isPremium: boolean;
    locale: string;
  }) => (
    <div className="[perspective:1000px] h-full">
      <div className="h-full flex flex-col bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-5 hover:border-primary-accent/50 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-xl font-bold text-neutral">
              {plan.activities} {t('pricing_activities')}
            </p>
            <p className="text-sm text-neutral/70">
              {t('pricing_valid')} {plan.validityMonths} {t('pricing_months')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-neutral">{formatPrice(plan.price)}</p>
            <p className="text-xs text-primary-accent">
              {formatPrice(plan.pricePerActivity)} / {t('pricing_activity')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-neutral/70 mb-4">
          <ClockIcon className="w-4 h-4 flex-shrink-0" />
          {t('pricing_duration')}: {plan.duration}
          {isPremium && (
            <>
              <StarIcon className="w-4 h-4 text-primary-accent ml-2 flex-shrink-0" />
              <span className="text-primary-accent">{t('pricing_premium')}</span>
            </>
          )}
        </div>

        <Link
          to={`/${locale}/hazte-socio`}
          className="block w-full text-center font-bold py-3 px-6 rounded-full transition-all duration-300 mt-auto bg-black/50 border border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-white"
        >
          {t('pricing_select_plan')}
        </Link>
      </div>
    </div>
  )
);

FlexiblePlanCard.displayName = 'FlexiblePlanCard';

/**
 * Personal Training Pack Card
 */
const PersonalTrainingCard = memo(
  ({ pack, t }: { pack: (typeof PERSONAL_TRAINING_PACKS)[0]; t: (key: string) => string }) => (
    <div className="[perspective:1000px] h-full">
      <div className="h-full flex flex-col bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-6 hover:border-primary-accent/50 transition-all duration-500 text-center [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow">
        <p className="text-3xl font-black text-neutral mb-1">
          {pack.sessions} {pack.sessions === 1 ? t('pricing_session') : t('pricing_sessions')}
        </p>
        <p className="text-4xl font-black holographic-text mb-2">{formatPrice(pack.price)}</p>
        <p className="text-sm text-neutral/70 mb-4 flex-grow">
          {formatPrice(pack.pricePerSession)} / {t('pricing_session')}
        </p>
        {pack.savingsPercent && (
          <span className="inline-block bg-primary-accent/20 text-primary-accent text-xs font-bold px-3 py-1 rounded-full mt-auto">
            {t('pricing_save')} {pack.savingsPercent}%
          </span>
        )}
      </div>
    </div>
  )
);

PersonalTrainingCard.displayName = 'PersonalTrainingCard';

/**
 * FAQ Item Component
 */
const FAQItem = memo(
  ({
    question,
    answer,
    isOpen,
    onToggle,
  }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <div className="[perspective:1000px]">
      <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl overflow-hidden transition-all duration-500 hover:border-primary-accent [transform-style:preserve-3d] hover:[transform:translateY(-0.25rem)_rotateX(1deg)] hover:shadow-accent-glow">
        <button
          onClick={onToggle}
          className="w-full px-6 py-4 flex items-center justify-between text-left transition-colors duration-300 hover:bg-primary-dark/20"
          aria-expanded={isOpen}
        >
          <h3 className="text-lg font-bold text-neutral pr-4">{question}</h3>
          <ChevronDownIcon
            className={`w-5 h-5 text-primary-accent flex-shrink-0 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <p className="px-6 pb-4 text-neutral/90 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  )
);

FAQItem.displayName = 'FAQItem';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const HorariosPreciosPage: React.FC = () => {
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
  const baseUrl = 'https://www.farrayscenter.com';

  // State for tabs and accordions
  const [isPremiumTab, setIsPremiumTab] = useState(false);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  // Get current plans based on tab
  const currentMonthlyPlans = isPremiumTab ? MONTHLY_PLANS_PREMIUM : MONTHLY_PLANS_REGULAR;
  const currentFlexiblePlans = isPremiumTab ? FLEXIBLE_PLANS_PREMIUM : FLEXIBLE_PLANS_REGULAR;
  const displayedPlans = showAllPlans ? currentMonthlyPlans : currentMonthlyPlans.slice(0, 4);

  // Breadcrumb
  const breadcrumbItems = [
    { name: t('pricing_breadcrumb_home'), url: `/${locale}` },
    {
      name: t('pricing_breadcrumb_current'),
      url: `/${locale}/horarios-precios`,
      isActive: true,
    },
  ];

  // Schema Markup
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('pricing_breadcrumb_home'),
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('pricing_breadcrumb_current'),
        item: `${baseUrl}/${locale}/horarios-precios`,
      },
    ],
  };

  // Pricing Schema for Google
  const pricingSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t('pricing_schema_name'),
    description: t('pricing_schema_description'),
    brand: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: MONTHLY_PLANS_REGULAR[0]?.price ?? 50,
      highPrice: UNLIMITED_PLAN.price,
      offerCount: MONTHLY_PLANS_REGULAR.length + MONTHLY_PLANS_PREMIUM.length + 1,
    },
  };

  // FAQ data for pricing
  const pricingFAQs = [
    { id: 'faq1', question: t('pricing_faq1_q'), answer: t('pricing_faq1_a') },
    { id: 'faq2', question: t('pricing_faq2_q'), answer: t('pricing_faq2_a') },
    { id: 'faq3', question: t('pricing_faq3_q'), answer: t('pricing_faq3_a') },
    { id: 'faq4', question: t('pricing_faq4_q'), answer: t('pricing_faq4_a') },
    { id: 'faq5', question: t('pricing_faq5_q'), answer: t('pricing_faq5_a') },
    { id: 'faq6', question: t('pricing_faq6_q'), answer: t('pricing_faq6_a') },
    { id: 'faq7', question: t('pricing_faq7_q'), answer: t('pricing_faq7_a') },
    { id: 'faq8', question: t('pricing_faq8_q'), answer: t('pricing_faq8_a') },
    { id: 'faq9', question: t('pricing_faq9_q'), answer: t('pricing_faq9_a') },
    { id: 'faq10', question: t('pricing_faq10_q'), answer: t('pricing_faq10_a') },
    { id: 'faq11', question: t('pricing_faq11_q'), answer: t('pricing_faq11_a') },
    { id: 'faq12', question: t('pricing_faq12_q'), answer: t('pricing_faq12_a') },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pricingFAQs.map(faq => ({
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
        <title>{t('pricing_page_title')} | Farray&apos;s Center</title>
        <meta name="description" content={t('pricing_page_description')} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${baseUrl}/${locale}/horarios-precios`} />
        <meta property="og:title" content={t('pricing_page_title')} />
        <meta property="og:description" content={t('pricing_page_description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${baseUrl}/${locale}/horarios-precios`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(pricingSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-black pt-20 md:pt-24">
        {/* ================================================================
            SECTION 1: HERO - Enterprise Background Image
        ================================================================ */}
        <section className="relative text-center py-24 md:py-32 overflow-hidden flex items-center justify-center min-h-[70vh]">
          {/* Background Image - Enterprise Level */}
          <div className="absolute inset-0">
            <OptimizedImage
              src="/images/categories/hero/clases-salsa-bachata-barcelona"
              alt="Clases de salsa y bachata en Barcelona - Farray's Dance Center horarios y precios"
              sizes="100vw"
              className="w-full h-full object-cover"
              priority="high"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>

          <div className="relative z-20 container mx-auto px-4 sm:px-6">
            <Breadcrumb items={breadcrumbItems} textColor="text-neutral/75" />

            <AnimateOnScroll>
              <h1
                className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6 text-white"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 24px rgba(0,0,0,0.6)' }}
              >
                {t('pricing_hero_title')}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-neutral/90 mb-4">
                {t('pricing_hero_subtitle')}
              </p>

              {/* Social Proof */}
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-8 text-neutral/80">
                <div className="flex items-center gap-2">
                  <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-sm">({t('statsbar_reviews')})</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-primary-accent" />
                  <span>{t('horariosV2_authority_members')}</span>
                </div>
                <div className="hidden sm:block w-px h-6 bg-neutral/30"></div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary-accent" />
                  <span>8 {t('years_in_barcelona')}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="inline-flex items-center gap-2 bg-black/50 border border-primary-dark/50 px-4 py-2 rounded-full text-sm text-neutral/80">
                  <CheckCircleIcon className="w-4 h-4 text-primary-accent" />
                  {t('pricing_badge_no_permanence')}
                </span>
                <span className="inline-flex items-center gap-2 bg-black/50 border border-primary-dark/50 px-4 py-2 rounded-full text-sm text-neutral/80">
                  <HeartIcon className="w-4 h-4 text-primary-accent" />
                  {t('pricing_badge_cancel_anytime')}
                </span>
                <span className="inline-flex items-center gap-2 bg-black/50 border border-primary-dark/50 px-4 py-2 rounded-full text-sm text-neutral/80">
                  <SparklesIcon className="w-4 h-4 text-primary-accent" />
                  {t('pricing_badge_first_class_free')}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                <div className="w-full sm:w-auto">
                  <Link
                    to={`/${locale}/hazte-socio`}
                    className="block w-full sm:min-w-[280px] bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                  >
                    {t('pricing_cta_primary')}
                  </Link>
                  <p className="text-xs text-neutral/70 mt-2 text-center">
                    {t('pricing_cta_primary_subtext')}
                  </p>
                </div>
                <div className="w-full sm:w-auto">
                  <a
                    href="#cuota-inscripcion"
                    className="block w-full sm:min-w-[280px] bg-black/50 backdrop-blur-md border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white hover:scale-105 hover:shadow-accent-glow"
                  >
                    {t('pricing_cta_secondary')}
                  </a>
                  <p className="text-xs text-neutral/70 mt-2 text-center">
                    {t('pricing_cta_secondary_subtext')}
                  </p>
                  <p className="text-xs text-neutral/70 text-center">
                    {t('pricing_cta_secondary_subtitle')}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SCHEDULE IMAGES GALLERY 2026
        ================================================================ */}
        <ScheduleImagesSection />

        {/* ================================================================
            SECTION 2: SCHEDULE (Horarios)
        ================================================================ */}
        <HorariosScheduleSection />

        {/* ================================================================
            SECTION 3: ENROLLMENT FEE
        ================================================================ */}
        <section id="cuota-inscripcion" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto [perspective:1000px]">
                <div className="bg-gradient-to-br from-primary-dark/30 to-black border border-primary-accent/30 rounded-2xl p-8 md:p-12 [transform-style:preserve-3d] transition-all duration-500 hover:[transform:translateY(-0.5rem)_rotateY(2deg)_rotateX(2deg)] hover:shadow-accent-glow hover:border-primary-accent/50">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-neutral mb-4 holographic-text">
                        {t('pricing_enrollment_title')}
                      </h2>
                      <p className="text-neutral/90 mb-6">{t('pricing_enrollment_desc')}</p>
                      <ul className="space-y-3">
                        {ENROLLMENT_FEE.includes.map((includeKey, index) => (
                          <li key={index} className="flex items-center gap-3 text-neutral/90">
                            <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0" />
                            {t(includeKey)}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-center">
                      <p className="text-6xl md:text-7xl font-black holographic-text">
                        {formatPrice(ENROLLMENT_FEE.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: MONTHLY PLANS
        ================================================================ */}
        <section
          id="cuotas-mensuales"
          className="py-12 md:py-16 bg-gradient-to-b from-black to-primary-dark/10"
        >
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('pricing_monthly_title')}
                </h2>
                <p className="text-lg text-neutral/90 max-w-2xl mx-auto mb-8">
                  {t('pricing_monthly_subtitle')}
                </p>

                {/* Regular/Premium Tabs */}
                <div className="inline-flex bg-black/50 border border-primary-dark/50 rounded-full p-1">
                  <button
                    onClick={() => setIsPremiumTab(false)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                      !isPremiumTab
                        ? 'bg-primary-accent text-white'
                        : 'text-neutral/70 hover:text-neutral'
                    }`}
                  >
                    {t('pricing_tab_regular')}
                  </button>
                  <button
                    onClick={() => setIsPremiumTab(true)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                      isPremiumTab
                        ? 'bg-primary-accent text-white'
                        : 'text-neutral/70 hover:text-neutral'
                    }`}
                  >
                    <StarIcon className="w-4 h-4" />
                    {t('pricing_tab_premium')}
                  </button>
                </div>

                {/* Premium Note */}
                <p className="text-sm text-neutral/70 mt-4 max-w-2xl mx-auto">
                  Los cursos <strong className="text-primary-accent">Premium</strong> son impartidos
                  por la Maestra Yunaisy Farray
                </p>
              </div>
            </AnimateOnScroll>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {displayedPlans.map((plan, index) => (
                <AnimateOnScroll key={plan.id} delay={index * 100}>
                  <MonthlyPlanCard plan={plan} t={t} isPremium={isPremiumTab} locale={locale} />
                </AnimateOnScroll>
              ))}
            </div>

            {/* Show More Button */}
            {currentMonthlyPlans.length > 4 && (
              <AnimateOnScroll delay={400}>
                <div className="text-center mt-8">
                  <button
                    onClick={() => setShowAllPlans(!showAllPlans)}
                    className="inline-flex items-center gap-2 text-neutral hover:text-white transition-colors duration-300 font-semibold"
                  >
                    {showAllPlans ? t('pricing_show_less') : t('pricing_show_more')}
                    <ChevronDownIcon
                      className={`w-5 h-5 transition-transform duration-300 ${showAllPlans ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>
              </AnimateOnScroll>
            )}

            {/* Unlimited Plan Card */}
            <AnimateOnScroll delay={500}>
              <div className="max-w-2xl mx-auto mt-12 [perspective:1000px]">
                <div className="relative bg-gradient-to-r from-primary-accent/20 via-primary-dark/30 to-primary-accent/20 border-2 border-primary-accent rounded-2xl p-8 text-center [transform-style:preserve-3d] transition-all duration-500 hover:[transform:translateY(-0.5rem)_rotateY(2deg)_rotateX(2deg)] hover:shadow-accent-glow">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-accent text-white text-sm font-bold px-6 py-1 rounded-full">
                    {t('pricing_unlimited_badge')}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral mb-2">
                    {t('pricing_unlimited_title')}
                  </h3>
                  <p className="text-5xl md:text-6xl font-black holographic-text mb-2">
                    {formatPrice(UNLIMITED_PLAN.price)}
                    <span className="text-xl font-normal text-neutral/70">/mes</span>
                  </p>
                  <p className="text-neutral mb-4">
                    ~{formatPrice(UNLIMITED_PLAN.pricePerActivity)} / {t('pricing_per_activity')}
                  </p>
                  <p className="text-neutral/90 mb-6">{t('pricing_unlimited_desc')}</p>
                  <Link
                    to={`/${locale}/hazte-socio`}
                    className="inline-block bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                  >
                    {t('pricing_unlimited_cta')}
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SECTION 5: FLEXIBLE PLANS (BONOS)
        ================================================================ */}
        <section id="cuotas-flexibles" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('pricing_flexible_title')}
                </h2>
                <p className="text-lg text-neutral/90 max-w-2xl mx-auto mb-8">
                  {t('pricing_flexible_subtitle')}
                </p>

                {/* Regular/Premium Tabs */}
                <div className="inline-flex bg-black/50 border border-primary-dark/50 rounded-full p-1">
                  <button
                    onClick={() => setIsPremiumTab(false)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                      !isPremiumTab
                        ? 'bg-primary-accent text-white'
                        : 'text-neutral/70 hover:text-neutral'
                    }`}
                  >
                    {t('pricing_tab_regular')}
                  </button>
                  <button
                    onClick={() => setIsPremiumTab(true)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                      isPremiumTab
                        ? 'bg-primary-accent text-white'
                        : 'text-neutral/70 hover:text-neutral'
                    }`}
                  >
                    <StarIcon className="w-4 h-4" />
                    {t('pricing_tab_premium')}
                  </button>
                </div>

                {/* Premium Note */}
                <p className="text-sm text-neutral/70 mt-4 max-w-2xl mx-auto">
                  Los cursos <strong className="text-primary-accent">Premium</strong> son impartidos
                  por la Maestra Yunaisy Farray
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {currentFlexiblePlans.map((plan, index) => (
                <AnimateOnScroll key={plan.id} delay={index * 100}>
                  <FlexiblePlanCard plan={plan} t={t} isPremium={isPremiumTab} locale={locale} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 6: DROP-IN PRICES
        ================================================================ */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-neutral mb-8 text-center holographic-text">
                  {t('pricing_dropin_title')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {DROP_IN_PRICES.map((price, index) => (
                    <AnimateOnScroll key={price.id} delay={index * 50}>
                      <div className="[perspective:1000px] h-full">
                        <div className="h-full flex flex-col bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-4 text-center hover:border-primary-accent/50 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow">
                          <p className="text-sm text-neutral/70 mb-1">
                            {price.duration} -{' '}
                            {price.type === 'premium' ? t('pricing_premium') : t('pricing_regular')}
                          </p>
                          <p className="text-3xl font-black text-neutral mb-4">
                            {formatPrice(price.price)}
                          </p>
                          <Link
                            to={`/${locale}/hazte-socio`}
                            className="block w-full text-center font-bold py-2 px-4 rounded-full transition-all duration-300 mt-auto bg-black/50 border border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-white text-sm"
                          >
                            {t('pricing_select_plan')}
                          </Link>
                        </div>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SECTION 7: PERSONAL TRAINING
        ================================================================ */}
        <section id="entrenamientos" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('pricing_personal_title')}
                </h2>
                <p className="text-lg text-neutral/90 max-w-2xl mx-auto">
                  {t('pricing_personal_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {PERSONAL_TRAINING_PACKS.map((pack, index) => (
                <AnimateOnScroll key={pack.id} delay={index * 100}>
                  <PersonalTrainingCard pack={pack} t={t} />
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll delay={200}>
              <p className="text-center text-sm text-neutral/70 mt-6 max-w-2xl mx-auto">
                {t('pricing_personal_reference_note')}
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
              <div className="text-center mt-6">
                <Link
                  to={`/${locale}/clases-particulares-baile`}
                  className="inline-flex items-center gap-2 holographic-text hover:text-white transition-colors duration-300 font-bold text-lg"
                >
                  {t('pricing_personal_more')} →
                </Link>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SECTION 8: BENEFITS / VALUE PROPOSITION
        ================================================================ */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('pricing_benefits_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: AcademicCapIcon, key: 'benefit1' },
                { icon: UserIcon, key: 'benefit2' },
                { icon: SparklesIcon, key: 'benefit3' },
                { icon: HeartIcon, key: 'benefit4' },
                { icon: CheckCircleIcon, key: 'benefit5' },
                { icon: StarIcon, key: 'benefit6' },
              ].map((benefit, index) => (
                <AnimateOnScroll key={benefit.key} delay={index * 100}>
                  <div className="[perspective:1000px] h-full">
                    <div className="h-full flex flex-col bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-6 hover:border-primary-accent/50 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow">
                      <benefit.icon className="w-10 h-10 text-primary-accent mb-4 flex-shrink-0" />
                      <h3 className="text-lg font-bold text-neutral mb-2">
                        {t(`pricing_${benefit.key}_title`)}
                      </h3>
                      <p className="text-neutral/90 text-sm flex-grow">
                        {t(`pricing_${benefit.key}_desc`)}
                      </p>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            {/* ClassPass Differentiator */}
            <AnimateOnScroll delay={600}>
              <div className="max-w-2xl mx-auto mt-12 text-center [perspective:1000px]">
                <div className="inline-block bg-black/70 backdrop-blur-md border border-primary-accent/30 rounded-xl px-8 py-6 [transform-style:preserve-3d] transition-all duration-500 hover:[transform:translateY(-0.5rem)_rotateY(2deg)_rotateX(2deg)] hover:shadow-accent-glow hover:border-primary-accent/50">
                  <p className="text-neutral font-semibold text-lg">{t('pricing_no_classpass')}</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SECTION 10: EXCLUSIVE MEMBER BENEFITS
        ================================================================ */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black to-primary-dark/10">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('pricing_exclusive_title')}
                </h2>
                <p className="text-lg text-neutral/90 max-w-2xl mx-auto">
                  {t('pricing_exclusive_subtitle')}
                </p>
              </div>
            </AnimateOnScroll>

            <div className="max-w-5xl mx-auto">
              {/* Benefits Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Community Group */}
                <AnimateOnScroll delay={100}>
                  <div className="[perspective:1000px] h-full">
                    <div className="h-full bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-6 hover:border-primary-accent/50 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow">
                      <h3 className="text-xl font-bold text-neutral mb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-primary-accent" />
                        {t('pricing_exclusive_community')}
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_community_1')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_community_2')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_community_3')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Condiciones Especiales Group */}
                <AnimateOnScroll delay={200}>
                  <div className="[perspective:1000px] h-full">
                    <div className="h-full bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-6 hover:border-primary-accent/50 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow">
                      <h3 className="text-xl font-bold text-neutral mb-4 flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-primary-accent" />
                        {t('pricing_exclusive_conditions')}
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_conditions_1')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_conditions_2')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_conditions_3')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Discounts Group */}
                <AnimateOnScroll delay={300}>
                  <div className="[perspective:1000px] h-full">
                    <div className="h-full bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-6 hover:border-primary-accent/50 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow">
                      <h3 className="text-xl font-bold text-neutral mb-4 flex items-center gap-2">
                        <HeartIcon className="w-5 h-5 text-primary-accent" />
                        {t('pricing_exclusive_discounts')}
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_discounts_1')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_discounts_2')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_discounts_3')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Opportunities Group */}
                <AnimateOnScroll delay={400}>
                  <div className="[perspective:1000px] h-full">
                    <div className="h-full bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-6 hover:border-primary-accent/50 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow">
                      <h3 className="text-xl font-bold text-neutral mb-4 flex items-center gap-2">
                        <AcademicCapIcon className="w-5 h-5 text-primary-accent" />
                        {t('pricing_exclusive_opportunities')}
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_opportunities_1')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_opportunities_2')}</span>
                        </li>
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t('pricing_exclusive_opportunities_3')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>

              {/* Referral Program Highlight */}
              <AnimateOnScroll delay={500}>
                <div className="mt-8 [perspective:1000px]">
                  <div className="relative bg-gradient-to-r from-primary-accent/20 via-primary-dark/30 to-primary-accent/20 border-2 border-primary-accent rounded-2xl p-8 text-center [transform-style:preserve-3d] transition-all duration-500 hover:[transform:translateY(-0.5rem)_rotateY(2deg)_rotateX(2deg)] hover:shadow-accent-glow">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-accent text-white text-sm font-bold px-6 py-1 rounded-full">
                      {t('pricing_exclusive_referral_badge')}
                    </div>
                    <h3 className="text-2xl font-bold text-neutral mb-2">
                      {t('pricing_exclusive_referral_title')}
                    </h3>
                    <p className="text-3xl md:text-4xl font-black holographic-text mb-1">
                      {t('pricing_exclusive_referral_credits')}
                    </p>
                    <p className="text-lg text-neutral/80 mb-3">
                      {t('pricing_exclusive_referral_value')}
                    </p>
                    <p className="text-neutral/90">{t('pricing_exclusive_referral_desc')}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 11: TESTIMONIALS / SOCIAL PROOF - Google Reviews
        ================================================================ */}
        <ReviewsSection category="general" limit={6} showGoogleBadge={true} layout="grid" />

        {/* ================================================================
            SECTION 11: FAQ
        ================================================================ */}
        <section id="faq-precios" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('pricing_faq_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-3xl mx-auto space-y-4">
              {pricingFAQs.map((faq, index) => (
                <AnimateOnScroll key={faq.id} delay={index * 50}>
                  <FAQItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openFAQ === faq.id}
                    onToggle={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 12: FINAL CTA
        ================================================================ */}
        <section id="final-cta" className="relative py-12 md:py-16 overflow-hidden">
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 relative z-20">
            <AnimateOnScroll>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('pricing_cta_title')}
                </h2>

                {/* Emotional Copy */}
                <div className="mb-8 space-y-2 text-lg sm:text-xl text-neutral/80">
                  <p>{t('pricing_cta_emotional1')}</p>
                  <p>{t('pricing_cta_emotional2')}</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold mb-8 holographic-text">
                  {t('pricing_cta_emotional_close')}
                </p>

                {/* Visual Separator */}
                <div className="w-24 h-px bg-primary-accent/50 mx-auto mb-8"></div>

                {/* Technical Copy */}
                <p className="text-lg sm:text-xl text-neutral/90 mb-3">
                  {t('pricing_cta_technical1')}
                </p>
                <p className="text-base sm:text-lg text-neutral/80 mb-6 sm:mb-8 italic">
                  {t('pricing_cta_technical2')}
                </p>

                {/* Final CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                  <div className="w-full sm:w-auto">
                    <Link
                      to={`/${locale}/hazte-socio`}
                      className="block w-full sm:min-w-[280px] bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                    >
                      {t('pricing_cta_primary')}
                    </Link>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('pricing_cta_primary_subtext')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <a
                      href="#cuota-inscripcion"
                      className="block w-full sm:min-w-[280px] bg-black/50 backdrop-blur-md border-2 border-primary-accent text-primary-accent font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white hover:scale-105 hover:shadow-accent-glow"
                    >
                      {t('pricing_cta_secondary')}
                    </a>
                    <p className="text-xs text-neutral/70 mt-2 text-center">
                      {t('pricing_cta_secondary_subtext')}
                    </p>
                    <p className="text-xs text-neutral/70 text-center">
                      {t('pricing_cta_secondary_subtitle')}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>
      </div>
    </>
  );
};

export default HorariosPreciosPage;
