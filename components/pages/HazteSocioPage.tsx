/**
 * HazteSocioPage - Membership sign-up page (Landing Pura)
 *
 * Flow (5 pasos):
 * 1. Encuentra tu clase en el horario
 * 2. Pulsa en la clase que te interesa
 * 3. Selecciona tu membresía en Momence
 * 4. Completa el pago de forma segura
 * 5. Empieza a bailar
 *
 * Features:
 * - Uses BookingWidgetV2's ClassListStep
 * - Opens MomenceModal with deeplink when clicking a class
 * - Look and feel from HorariosPreciosPage (glass morphism, 3D effects)
 * - noindex, nofollow (post-lead page)
 */

import React, { useState, memo, useCallback, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import MomenceModal from '../shared/MomenceModal';

// Lazy load the booking components
const ClassListStep = lazy(() =>
  import('../booking/components/ClassListStep').then(m => ({ default: m.ClassListStep }))
);

// Hooks from booking system
import { useBookingFilters } from '../booking/hooks/useBookingFilters';
import { useBookingClasses } from '../booking/hooks/useBookingClasses';
import type { ClassData } from '../booking/types/booking';

// Icons
import {
  CheckIcon,
  ChevronDownIcon,
  StarIcon,
  ShieldCheckIcon,
  PhoneIcon,
  SearchIcon,
  CursorArrowRaysIcon,
  CreditCardIcon,
  UserPlusIcon,
  MusicalNoteIcon,
  SparklesIcon,
  BuildingOfficeIcon,
} from '../../lib/icons';

// Testimonials data - 6 real Google Reviews from reviews.json
const HAZTE_SOCIO_TESTIMONIALS = [
  {
    id: 1,
    name: 'Emma S',
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      es: 'Yunaisy Farray es una profesora estupenda: divertida y motivadora. Me alegro de haber salido de mi zona de confort para tomar esta clase, ¡la recomiendo!',
      en: "Yunaisy Farray is a wonderful teacher: fun and motivating. I'm glad I stepped out of my comfort zone to take this class, I recommend it!",
      ca: "Yunaisy Farray és una professora fantàstica: divertida i motivadora. M'alegro d'haver sortit de la meva zona de confort per fer aquesta classe, la recomano!",
      fr: "Yunaisy Farray est une professeure formidable : amusante et motivante. Je suis contente d'être sortie de ma zone de confort pour suivre ce cours, je le recommande !",
    },
  },
  {
    id: 2,
    name: 'Laia F',
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      es: '¡Muy contenta con la escuela! Yunaisy e Iro son super profesionales pero también divertidos, tienen paciencia mil con nosotros y enseñan a bailar a cualquier persona por muy patata que sea! ¡Esto tiene mucho mérito!',
      en: 'Very happy with the school! Yunaisy and Iro are super professional but also fun, they have endless patience with us and teach anyone to dance no matter how clumsy they are! That takes real skill!',
      ca: "Molt contenta amb l'escola! Yunaisy i Iro són súper professionals però també divertits, tenen molta paciència amb nosaltres i ensenyen a ballar a qualsevol persona per molt maldestre que sigui! Això té molt de mèrit!",
      fr: "Très contente de l'école ! Yunaisy et Iro sont super professionnels mais aussi amusants, ils ont une patience infinie avec nous et apprennent à danser à n'importe qui, peu importe son niveau ! Ça demande un vrai talent !",
    },
  },
  {
    id: 3,
    name: 'Rebeca Martinez Rodrigo',
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      es: 'Esta clase me reinicia la vida. Nunca había bailado y me daba mucha vergüenza bailar en público. Desde que empecé me siento mucho más yo. Es la mejor decisión que he tomado en mucho tiempo. Bailar es invertir en salud y felicidad.',
      en: "This class resets my life. I had never danced and was very embarrassed to dance in public. Since I started, I feel much more like myself. It's the best decision I've made in a long time. Dancing is investing in health and happiness.",
      ca: 'Aquesta classe em reinicia la vida. Mai havia ballat i em feia molta vergonya ballar en públic. Des que vaig començar em sento molt més jo. És la millor decisió que he pres en molt temps. Ballar és invertir en salut i felicitat.',
      fr: "Ce cours me réinitialise la vie. Je n'avais jamais dansé et j'avais très honte de danser en public. Depuis que j'ai commencé, je me sens beaucoup plus moi-même. C'est la meilleure décision que j'ai prise depuis longtemps. Danser, c'est investir dans la santé et le bonheur.",
    },
  },
  {
    id: 4,
    name: 'Ana Cid',
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      es: '5 estrellas y porque no hay más. Espectacular, desde el minuto en el que pisas recepción, hasta los profesores, la calidad y el buen rollo entre el alumnado. Muy muy recomendable.',
      en: '5 stars and only because there are no more. Spectacular, from the minute you step into reception, to the teachers, the quality and the great vibes among students. Highly recommended.',
      ca: "5 estrelles i perquè no n'hi ha més. Espectacular, des del minut en què trepitges recepció, fins als professors, la qualitat i el bon rotllo entre l'alumnat. Molt molt recomanable.",
      fr: "5 étoiles et seulement parce qu'il n'y en a pas plus. Spectaculaire, dès la minute où vous entrez à la réception, jusqu'aux professeurs, la qualité et la bonne ambiance entre les élèves. Très très recommandé.",
    },
  },
  {
    id: 5,
    name: 'Olga Folque Sanz',
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      es: 'Las clases en la escuela son súper divertidas y siempre me hacen sentir con mucha energía. Los profesores tienen una gran capacidad para enseñarnos mientras nos divertimos. Además, el recepcionista Augusto es increíblemente atento y amable. ¡Es un placer asistir!',
      en: "The classes at the school are super fun and always make me feel energized. The teachers have a great ability to teach us while we have fun. Plus, receptionist Augusto is incredibly attentive and kind. It's a pleasure to attend!",
      ca: "Les classes a l'escola són súper divertides i sempre em fan sentir amb molta energia. Els professors tenen una gran capacitat per ensenyar-nos mentre ens divertim. A més, el recepcionista Augusto és increïblement atent i amable. És un plaer assistir-hi!",
      fr: "Les cours à l'école sont super amusants et me font toujours me sentir pleine d'énergie. Les professeurs ont une grande capacité à nous enseigner tout en nous amusant. De plus, le réceptionniste Augusto est incroyablement attentionné et aimable. C'est un plaisir d'y assister !",
    },
  },
  {
    id: 6,
    name: 'Michelle Lu',
    city: {
      en: 'Barcelona, Spain',
      es: 'Barcelona, España',
      ca: 'Barcelona, Espanya',
      fr: 'Barcelone, Espagne',
    },
    quote: {
      es: 'Este era mi estudio de baile principal. Iba semanalmente a cinco clases diferentes y era mi segundo hogar. Me encanta la amplia variedad de clases de diferentes estilos con profesores increíbles. El equipo me recibió como si nunca hubiera estado fuera. ¡Definitivamente recomiendo este estudio!',
      en: 'This was my main dance studio. I went weekly to five different classes and it was my second home. I love the wide variety of classes in different styles with incredible teachers. The team welcomed me as if I had never been away. I definitely recommend this studio!',
      ca: "Aquest era el meu estudi de ball principal. Anava setmanalment a cinc classes diferents i era la meva segona llar. M'encanta l'àmplia varietat de classes de diferents estils amb professors increïbles. L'equip em va rebre com si mai hagués marxat. Definitivament recomano aquest estudi!",
      fr: "C'était mon studio de danse principal. J'allais chaque semaine à cinq cours différents et c'était ma deuxième maison. J'adore la grande variété de cours de différents styles avec des professeurs incroyables. L'équipe m'a accueillie comme si je n'étais jamais partie. Je recommande définitivement ce studio !",
    },
  },
] as const;

// =============================================================================
// CONSTANTS
// =============================================================================

const MOMENCE_HOST = "Farray's-International-Dance-Center";
const MOMENCE_BASE = 'https://momence.com';

// Generate deeplink for a specific class
const getClassDeeplink = (className: string, sessionId: number) =>
  `${MOMENCE_BASE}/${MOMENCE_HOST}/${encodeURIComponent(className)}/${sessionId}?skipPreview=true`;

// Steps for the sign-up process (5 pasos)
const STEPS = [
  { icon: 'search', titleKey: 'hazteSocio_step1_title', descKey: 'hazteSocio_step1_desc' },
  { icon: 'cursor', titleKey: 'hazteSocio_step2_title', descKey: 'hazteSocio_step2_desc' },
  { icon: 'membership', titleKey: 'hazteSocio_step3_title', descKey: 'hazteSocio_step3_desc' },
  { icon: 'payment', titleKey: 'hazteSocio_step4_title', descKey: 'hazteSocio_step4_desc' },
  { icon: 'dance', titleKey: 'hazteSocio_step5_title', descKey: 'hazteSocio_step5_desc' },
];

// Value stack items
const VALUE_ITEMS = [
  'hazteSocio_value1',
  'hazteSocio_value2',
  'hazteSocio_value3',
  'hazteSocio_value4',
  'hazteSocio_value5',
  'hazteSocio_value6',
  'hazteSocio_value7',
  'hazteSocio_value8',
  'hazteSocio_value9',
];

// FAQ items
const FAQ_ITEMS = [
  { q: 'hazteSocio_faq1_q', a: 'hazteSocio_faq1_a' },
  { q: 'hazteSocio_faq2_q', a: 'hazteSocio_faq2_a' },
  { q: 'hazteSocio_faq3_q', a: 'hazteSocio_faq3_a' },
  { q: 'hazteSocio_faq4_q', a: 'hazteSocio_faq4_a' },
  { q: 'hazteSocio_faq5_q', a: 'hazteSocio_faq5_a' },
  { q: 'hazteSocio_faq6_q', a: 'hazteSocio_faq6_a' },
  { q: 'hazteSocio_faq7_q', a: 'hazteSocio_faq7_a' },
  { q: 'hazteSocio_faq8_q', a: 'hazteSocio_faq8_a' },
  { q: 'hazteSocio_faq9_q', a: 'hazteSocio_faq9_a' },
  { q: 'hazteSocio_faq10_q', a: 'hazteSocio_faq10_a' },
];

// =============================================================================
// ICON MAPPING
// =============================================================================

const STEP_ICONS: Record<string, React.FC<{ className?: string }>> = {
  search: SearchIcon,
  cursor: CursorArrowRaysIcon,
  membership: UserPlusIcon,
  payment: CreditCardIcon,
  dance: MusicalNoteIcon,
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * FAQ Accordion Item
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

/**
 * Step Card Component
 */
const StepCard = memo(
  ({ step, index, t }: { step: (typeof STEPS)[0]; index: number; t: (key: string) => string }) => {
    const IconComponent = STEP_ICONS[step.icon] || SearchIcon;

    return (
      <div className="[perspective:1000px] h-full">
        <div className="relative h-full bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl p-6 transition-all duration-500 [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_rotateY(3deg)_rotateX(2deg)] hover:shadow-accent-glow hover:border-primary-accent/50">
          {/* Step number badge */}
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-accent rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {index + 1}
          </div>

          {/* Icon */}
          <div className="w-12 h-12 bg-primary-accent/20 rounded-xl flex items-center justify-center mb-4">
            <IconComponent className="w-6 h-6 text-primary-accent" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-bold text-neutral mb-2">{t(step.titleKey)}</h3>
          <p className="text-sm text-neutral/70">{t(step.descKey)}</p>
        </div>
      </div>
    );
  }
);

StepCard.displayName = 'StepCard';

/**
 * Loading skeleton for class list
 */
const ClassListSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map(i => (
      <div
        key={i}
        className="h-32 bg-white/5 rounded-xl animate-pulse"
        style={{ animationDelay: `${i * 100}ms` }}
      />
    ))}
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const HazteSocioPage: React.FC = () => {
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

  // State
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [momenceUrl, setMomenceUrl] = useState<string>('');
  const [isMomenceOpen, setIsMomenceOpen] = useState(false);

  // Booking hooks (reusing existing infrastructure)
  const { filters, setFilter, clearFilter, clearAllFilters, weekOffset, setWeekOffset } =
    useBookingFilters();

  const hasActiveFilters = Object.values(filters).some(Boolean);

  const {
    classes,
    loading,
    error: classesError,
    filterOptions,
    refetch,
    loadMore,
    hasMore,
    currentPage,
    allWeeksClasses,
    allWeeksLoading,
  } = useBookingClasses({
    filters,
    weekOffset,
    enablePagination: true,
    fetchAllWeeks: hasActiveFilters,
  });

  // Handle class selection - open MomenceModal with deeplink
  const handleClassSelect = useCallback((classData: ClassData) => {
    const deeplink = getClassDeeplink(classData.name, classData.id);
    setMomenceUrl(deeplink);
    setIsMomenceOpen(true);
  }, []);

  // Close Momence modal
  const handleCloseMomence = useCallback(() => {
    setIsMomenceOpen(false);
    setMomenceUrl('');
  }, []);

  // Schema markup
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('hazteSocio_meta_title'),
    description: t('hazteSocio_meta_description'),
    url: `${baseUrl}/${locale}/hazte-socio`,
    mainEntity: {
      '@type': 'SportsActivityLocation',
      name: "Farray's International Dance Center",
      address: {
        '@type': 'PostalAddress',
        streetAddress: "Carrer d'Entença 100",
        addressLocality: 'Barcelona',
        postalCode: '08015',
        addressCountry: 'ES',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '509',
      },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '50',
        highPrice: '195',
        priceCurrency: 'EUR',
      },
    },
  };

  return (
    <>
      <Helmet>
        <title>{t('hazteSocio_meta_title')}</title>
        <meta name="description" content={t('hazteSocio_meta_description')} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${baseUrl}/${locale}/hazte-socio`} />

        {/* Open Graph */}
        <meta property="og:title" content={t('hazteSocio_meta_title')} />
        <meta property="og:description" content={t('hazteSocio_meta_description')} />
        <meta property="og:url" content={`${baseUrl}/${locale}/hazte-socio`} />
        <meta property="og:type" content="website" />

        {/* Hreflang */}
        <link rel="alternate" hrefLang="es" href={`${baseUrl}/es/hazte-socio`} />
        <link rel="alternate" hrefLang="ca" href={`${baseUrl}/ca/hazte-socio`} />
        <link rel="alternate" hrefLang="en" href={`${baseUrl}/en/hazte-socio`} />
        <link rel="alternate" hrefLang="fr" href={`${baseUrl}/fr/hazte-socio`} />
        <link rel="alternate" hrefLang="x-default" href={`${baseUrl}/es/hazte-socio`} />

        {/* Schema */}
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <div className="min-h-screen bg-black">
        {/* ================================================================
            SECTION 1: HERO
        ================================================================ */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center max-w-4xl mx-auto">
                {/* Trust badge */}
                <div className="inline-flex items-center gap-2 bg-black/50 border border-primary-dark/50 px-4 py-2 rounded-full text-sm text-neutral/80 mb-6">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{t('hazteSocio_hero_badge')}</span>
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter leading-tight mb-6">
                  <span className="text-neutral">{t('hazteSocio_hero_title_line1')}</span>
                  <br />
                  <span className="holographic-text">{t('hazteSocio_hero_title_line2')}</span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl sm:text-2xl text-neutral/80 mb-8">
                  {t('hazteSocio_hero_subtitle')}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 mb-8">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-neutral">4.9/5</span>
                    <span className="text-sm text-neutral/70">(509+ reviews)</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-neutral/30" />
                  <div className="text-neutral/80">Barcelona</div>
                  <div className="hidden sm:block w-px h-6 bg-neutral/30" />
                  <div className="text-neutral/80">8 {t('years_in_barcelona')}</div>
                  <div className="hidden sm:block w-px h-6 bg-neutral/30" />
                  <div className="text-neutral/80">+1.500 {t('hazteSocio_active_members')}</div>
                </div>

                {/* Scroll hint */}
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-neutral/50">{t('hazteSocio_scroll_hint')}</p>
                  <ChevronDownIcon className="w-5 h-5 text-neutral/40 animate-bounce" />
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SECTION 2: HOW IT WORKS - 5 Steps
        ================================================================ */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black to-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('hazteSocio_howItWorks_title')}
                </h2>
                <p className="text-lg text-neutral/80">{t('hazteSocio_howItWorks_subtitle')}</p>
              </div>
            </AnimateOnScroll>

            {/* Steps grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {STEPS.map((step, index) => (
                <AnimateOnScroll key={step.titleKey} delay={index * 100}>
                  <StepCard step={step} index={index} t={t} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 3: SCHEDULE - Find Your Class (Widget de Reservas)
        ================================================================ */}
        <section id="horarios" className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('hazteSocio_schedule_title')}
                </h2>
                <p className="text-lg text-neutral/80">{t('hazteSocio_schedule_subtitle')}</p>
              </div>
            </AnimateOnScroll>

            {/* Multi-Style Info Box */}
            <AnimateOnScroll delay={100}>
              <div className="max-w-2xl mx-auto mb-8 [perspective:1000px]">
                <div
                  className="relative bg-gradient-to-r from-primary-accent/10 via-black/50 to-primary-accent/10
                                backdrop-blur-md border border-primary-accent/30 rounded-2xl p-6
                                border-l-4 border-l-primary-accent
                                [transform-style:preserve-3d] transition-all duration-500
                                hover:[transform:translateY(-2px)] hover:shadow-accent-glow"
                >
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 bg-primary-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <SparklesIcon className="w-5 h-5 text-primary-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral">
                      {t('hazteSocio_multiStyle_title')}
                    </h3>
                  </div>

                  {/* 3 Steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                    <div className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-7 h-7 bg-primary-accent rounded-full
                                      flex items-center justify-center text-white text-sm font-bold"
                      >
                        1
                      </span>
                      <p className="text-sm text-neutral/90">{t('hazteSocio_multiStyle_step1')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-7 h-7 bg-primary-accent rounded-full
                                      flex items-center justify-center text-white text-sm font-bold"
                      >
                        2
                      </span>
                      <p className="text-sm text-neutral/90">{t('hazteSocio_multiStyle_step2')}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span
                        className="flex-shrink-0 w-7 h-7 bg-primary-accent rounded-full
                                      flex items-center justify-center text-white text-sm font-bold"
                      >
                        3
                      </span>
                      <p className="text-sm text-neutral/90">{t('hazteSocio_multiStyle_step3')}</p>
                    </div>
                  </div>

                  {/* Reception help link */}
                  <div className="flex items-center gap-2 text-sm text-neutral/60 pt-4 border-t border-white/10">
                    <BuildingOfficeIcon className="w-4 h-4 flex-shrink-0" />
                    <span>{t('hazteSocio_multiStyle_receptionHelp')}</span>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Class List from Booking System */}
            <div className="max-w-2xl mx-auto">
              <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 md:p-8">
                {/* Decorative gradient line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent" />

                <Suspense fallback={<ClassListSkeleton />}>
                  <ClassListStep
                    classes={classes}
                    filters={filters}
                    filterOptions={filterOptions}
                    weekOffset={weekOffset}
                    loading={loading}
                    error={classesError}
                    onFilterChange={setFilter}
                    onClearFilter={clearFilter}
                    onClearAllFilters={clearAllFilters}
                    onWeekChange={setWeekOffset}
                    onSelectClass={handleClassSelect}
                    onRetry={refetch}
                    onLoadMore={loadMore}
                    hasMore={hasMore}
                    isLoadingMore={loading && currentPage > 1}
                    selectedClassId={null}
                    showAllWeeks={hasActiveFilters}
                    allWeeksClasses={allWeeksClasses}
                    allWeeksLoading={allWeeksLoading}
                    hideFilters={false}
                  />
                </Suspense>

                {/* Hint text */}
                <p className="text-center text-sm text-neutral/50 mt-4">
                  {t('hazteSocio_schedule_hint')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 4: VALUE STACK
        ================================================================ */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black to-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('hazteSocio_valueStack_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-3xl mx-auto">
              <div className="[perspective:1000px]">
                <div className="bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl p-6 md:p-8 [transform-style:preserve-3d] transition-all duration-500 hover:[transform:translateY(-0.5rem)_rotateY(2deg)_rotateX(2deg)] hover:shadow-accent-glow hover:border-primary-accent/50">
                  <ul className="space-y-4">
                    {VALUE_ITEMS.map((itemKey, index) => (
                      <AnimateOnScroll key={itemKey} delay={index * 50}>
                        <li className="flex items-start gap-3 text-neutral/90">
                          <CheckIcon className="w-5 h-5 text-primary-accent flex-shrink-0 mt-0.5" />
                          <span>{t(itemKey)}</span>
                        </li>
                      </AnimateOnScroll>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Referral Program Highlight */}
            <AnimateOnScroll delay={500}>
              <div className="mt-8 max-w-3xl mx-auto [perspective:1000px]">
                <div className="relative bg-gradient-to-r from-primary-accent/20 via-primary-dark/30 to-primary-accent/20 border-2 border-primary-accent rounded-2xl p-8 text-center [transform-style:preserve-3d] transition-all duration-500 hover:[transform:translateY(-0.5rem)_rotateY(2deg)_rotateX(2deg)] hover:shadow-accent-glow">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-accent text-white text-sm font-bold px-6 py-1 rounded-full">
                    {t('pricing_exclusive_referral_badge')}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral mb-2">
                    {t('hazteSocio_referral_title')}
                  </h3>
                  <p className="text-3xl md:text-4xl font-black holographic-text mb-1">
                    {t('pricing_exclusive_referral_credits')}
                  </p>
                  <p className="text-lg text-neutral/80 mb-3">
                    {t('pricing_exclusive_referral_value')}
                  </p>
                  <p className="text-neutral/90">{t('hazteSocio_referral_desc')}</p>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SECTION 4.5: TESTIMONIALS
        ================================================================ */}
        <section className="py-12 md:py-16 bg-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('hazteSocio_testimonials_title')}
                </h2>
                <div className="inline-block">
                  <div className="mb-2 text-2xl font-black text-neutral">{t('excellent')}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <div className="text-xs text-neutral/70">
                    {t('basedOnReviews', { count: 509 })}
                  </div>
                  <div className="mt-1 text-xs text-neutral/60">Google</div>
                </div>
              </div>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
              {HAZTE_SOCIO_TESTIMONIALS.map((testimonial, index) => (
                <AnimateOnScroll key={testimonial.id} delay={index * 100}>
                  <div className="[perspective:1000px] h-full">
                    <div className="flex flex-col h-full min-h-[180px] p-5 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-xl [transform-style:preserve-3d] transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:[transform:translateY(-0.3rem)]">
                      <div className="mb-2 flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <blockquote className="flex-grow text-neutral/90 mb-3">
                        <p className="text-sm leading-relaxed">
                          &ldquo;
                          {testimonial.quote[locale as keyof typeof testimonial.quote] ||
                            testimonial.quote.es}
                          &rdquo;
                        </p>
                      </blockquote>
                      <div className="flex items-center gap-3 mt-auto pt-3 border-t border-primary-dark/30">
                        <div>
                          <cite className="font-bold text-neutral not-italic text-sm">
                            {testimonial.name}
                          </cite>
                          <p className="text-xs text-neutral/60">
                            {testimonial.city[locale as keyof typeof testimonial.city] ||
                              testimonial.city.es}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================
            SECTION 5: GUARANTEE
        ================================================================ */}
        <section className="py-12 md:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="max-w-3xl mx-auto [perspective:1000px]">
                <div className="bg-gradient-to-br from-primary-dark/30 to-black border border-primary-accent/30 rounded-2xl p-8 md:p-12 text-center [transform-style:preserve-3d] transition-all duration-500 hover:[transform:translateY(-0.5rem)_rotateY(2deg)_rotateX(2deg)] hover:shadow-accent-glow hover:border-primary-accent/50">
                  <ShieldCheckIcon className="w-16 h-16 text-primary-accent mx-auto mb-6" />
                  <h2 className="text-2xl md:text-3xl font-black text-neutral mb-4">
                    {t('hazteSocio_guarantee_title')}
                  </h2>
                  <p className="text-lg text-neutral/90 mb-4">{t('hazteSocio_guarantee_text')}</p>
                  <p className="text-sm text-neutral/60 mb-6">{t('hazteSocio_guarantee_note')}</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <span className="inline-flex items-center gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-primary-accent" />
                      {t('hazteSocio_guarantee_point1')}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-primary-accent" />
                      {t('hazteSocio_guarantee_point2')}
                    </span>
                    <span className="inline-flex items-center gap-2 text-sm text-neutral/80">
                      <CheckIcon className="w-4 h-4 text-primary-accent" />
                      {t('hazteSocio_guarantee_point3')}
                    </span>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SECTION 6: FAQ
        ================================================================ */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-black to-primary-dark/10">
          <div className="container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
                  {t('hazteSocio_faq_title')}
                </h2>
              </div>
            </AnimateOnScroll>

            <div className="max-w-3xl mx-auto space-y-4">
              {FAQ_ITEMS.map((faq, index) => (
                <AnimateOnScroll key={index} delay={index * 50}>
                  <FAQItem
                    question={t(faq.q)}
                    answer={t(faq.a)}
                    isOpen={openFAQ === index}
                    onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                  />
                </AnimateOnScroll>
              ))}
            </div>

            {/* WhatsApp contact */}
            <AnimateOnScroll delay={500}>
              <div className="text-center mt-8">
                <p className="text-neutral/70 mb-4">{t('hazteSocio_faq_moreQuestions')}</p>
                <a
                  href="https://wa.me/34622247085"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-accent text-white font-bold py-3 px-6 rounded-full hover:bg-primary-accent/80 transition-colors"
                >
                  <PhoneIcon className="w-5 h-5" />
                  +34 622 24 70 85
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            SECTION 7: FINAL CTA
        ================================================================ */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/30 via-black to-black" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6">
            <AnimateOnScroll>
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
                  {t('hazteSocio_finalCta_title')}
                </h2>
                <p className="text-xl text-neutral/80 mb-8">{t('hazteSocio_finalCta_subtitle')}</p>
                <a
                  href="#horarios"
                  className="inline-block bg-primary-accent text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
                >
                  {t('hazteSocio_cta_start')}
                </a>
                <p className="text-sm text-neutral/60 mt-4">{t('hazteSocio_cta_time')}</p>

                {/* Trust Badges - Payment Methods */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-xs text-neutral/50 mb-3">{t('hazteSocio_secure_payment')}</p>
                  <div className="flex flex-wrap justify-center items-center gap-4">
                    {/* Visa */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <svg className="h-5 w-auto" viewBox="0 0 1000 324" fill="none">
                        <path
                          d="M433 319L466 5H526L493 319H433ZM727 11C715 6 695 0 671 0C611 0 568 32 568 78C567 113 600 133 624 145C649 157 658 165 658 177C657 195 635 203 615 203C586 203 571 199 546 188L536 183L525 251C547 261 584 269 623 270C687 270 729 239 730 190C730 163 712 142 676 125C654 113 640 105 640 92C641 81 653 69 680 69C702 69 718 74 731 79L738 82L749 17L727 11ZM823 5C807 5 795 10 788 27L696 319H760L773 281H851L859 319H916L866 5H823ZM790 233L822 131C822 131 831 102 837 84L844 128L864 233H790ZM368 5L309 219L303 190C292 154 254 114 211 94L265 318L330 317L434 5H368ZM232 5H134L133 10C210 29 261 75 287 131L260 28C256 11 244 6 232 5Z"
                          fill="#1A1F71"
                        />
                      </svg>
                    </div>
                    {/* Mastercard */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                      <svg className="h-6 w-auto" viewBox="0 0 40 24" fill="none">
                        <circle cx="15" cy="12" r="10" fill="#EB001B" />
                        <circle cx="25" cy="12" r="10" fill="#F79E1B" />
                        <path
                          d="M20 5.5C22 7 23.5 9.3 23.5 12C23.5 14.7 22 17 20 18.5C18 17 16.5 14.7 16.5 12C16.5 9.3 18 7 20 5.5Z"
                          fill="#FF5F00"
                        />
                      </svg>
                    </div>
                    {/* SEPA */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                      <span className="text-xs font-bold text-neutral/80">SEPA</span>
                    </div>
                    {/* SSL Lock */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-1">
                      <ShieldCheckIcon className="w-4 h-4 text-primary-accent" />
                      <span className="text-xs font-medium text-neutral/80">SSL</span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        {/* ================================================================
            FOOTER MINIMAL
        ================================================================ */}
        <footer className="py-8 bg-black border-t border-white/10">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-neutral/60 mb-2">
              C/ Entença 100, Local 1 - 08015 Barcelona
            </p>
            <p className="text-sm text-neutral/60 mb-4">
              +34 622 24 70 85 (WhatsApp) | info@farrayscenter.com
            </p>
            <div className="flex justify-center gap-4 text-xs text-neutral/50">
              <Link to={`/${locale}/politica-privacidad`} className="hover:text-neutral">
                {t('sitemapPrivacy')}
              </Link>
              <span>|</span>
              <Link to={`/${locale}/terminos-y-condiciones`} className="hover:text-neutral">
                {t('sitemapTerms')}
              </Link>
              <span>|</span>
              <Link to={`/${locale}/politica-cookies`} className="hover:text-neutral">
                {t('sitemapCookies')}
              </Link>
            </div>
          </div>
        </footer>
      </div>

      {/* Momence Modal */}
      <MomenceModal isOpen={isMomenceOpen} onClose={handleCloseMomence} url={momenceUrl} />
    </>
  );
};

export default memo(HazteSocioPage);
