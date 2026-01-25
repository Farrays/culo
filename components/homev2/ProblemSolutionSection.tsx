import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';

/**
 * ProblemSolutionSection - Framework PAS (Problem-Agitation-Solution)
 *
 * Conecta emocionalmente con el dolor del visitante:
 * 1. Problema: "¿Te suena familiar?"
 * 2. Agitación: Intensifica el dolor
 * 3. Solución: Presenta el Método Farray
 */
const ProblemSolutionSection: React.FC = () => {
  const { t } = useTranslation([
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

  const problems = [
    {
      iconKey: 'clock',
      textKey: 'pas_problem1',
    },
    {
      iconKey: 'users',
      textKey: 'pas_problem2',
    },
    {
      iconKey: 'calendar',
      textKey: 'pas_problem3',
    },
    {
      iconKey: 'heart',
      textKey: 'pas_problem4',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-6">
        {/* PROBLEMA - Título */}
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t('pas_title')}
            </h2>
            <p className="text-xl text-neutral/70">{t('pas_subtitle')}</p>
          </div>
        </AnimateOnScroll>

        {/* Lista de problemas */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.map((problem, index) => (
              <AnimateOnScroll key={problem.textKey} delay={100 + index * 100}>
                <div className="flex items-start gap-4 p-5 bg-red-500/5 border border-red-500/20 rounded-xl hover:border-red-500/40 transition-all duration-300">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <p className="text-neutral/90 leading-relaxed">{t(problem.textKey)}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        {/* AGITACIÓN */}
        <AnimateOnScroll delay={500}>
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-xl md:text-2xl text-neutral/80 leading-relaxed italic">
              {t('pas_agitation1')}
            </p>
            <p className="text-2xl md:text-3xl font-bold text-neutral mt-4">
              {t('pas_agitation2')}
            </p>
          </div>
        </AnimateOnScroll>

        {/* SOLUCIÓN */}
        <AnimateOnScroll delay={600}>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-accent/30 to-green-500/30 rounded-3xl blur-xl opacity-50" />
            <div className="relative bg-black/80 backdrop-blur-md border border-primary-accent/50 rounded-2xl p-8 md:p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-accent/20 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <p className="text-xl md:text-2xl text-neutral/90 mb-4">{t('pas_solution1')}</p>
              <p className="text-3xl md:text-4xl font-black holographic-text">
                {t('pas_solution2')}
              </p>
              <button
                onClick={() => {
                  const element = document.querySelector('#method-section');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="mt-8 inline-flex items-center gap-2 bg-primary-accent text-white font-bold text-lg py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-accent-glow animate-glow"
              >
                {t('pas_cta')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ProblemSolutionSection;
