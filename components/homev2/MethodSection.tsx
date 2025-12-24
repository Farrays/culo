import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';

interface MethodSectionProps {
  config: typeof HOMEPAGE_V2_CONFIG.method;
}

// Iconos para los pilares
const PillarIcons: Record<string, React.FC<{ className?: string }>> = {
  discipline: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
  rhythm: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
      />
    </svg>
  ),
  innovation: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
};

/**
 * MethodSection - Océano Azul
 *
 * Estilo visual coherente con WhyFIDC:
 * - Cards con backdrop-blur y hover effects
 * - Holographic text para títulos
 * - Glow effects en hover
 */
const MethodSection: React.FC<MethodSectionProps> = ({ config }) => {
  const { t } = useI18n();

  return (
    <section id="method-section" className="py-20 md:py-32 bg-black">
      <div className="container mx-auto px-6">
        {/* PROBLEMA - Agitar el dolor */}
        <AnimateOnScroll>
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-6 holographic-text">
              {t(config.problemTitleKey)}
            </h2>
            <p className="text-lg md:text-xl text-neutral/90 leading-relaxed">
              {t(config.problemTextKey)}
            </p>
          </div>
        </AnimateOnScroll>

        {/* SOLUCIÓN - Los 3 Pilares */}
        <AnimateOnScroll delay={200}>
          <h3 className="text-2xl md:text-3xl font-bold text-center text-primary-accent mb-12">
            {t(config.solutionTitleKey)}
          </h3>
        </AnimateOnScroll>

        {/* Cards estilo WhyFIDC */}
        <div className="flex flex-wrap justify-center -m-4 mb-16">
          {config.pillars.map((pillar, index) => {
            const IconComponent = PillarIcons[pillar.iconKey] ?? PillarIcons['discipline'];

            return (
              <div key={pillar.titleKey} className="w-full md:w-1/2 lg:w-1/3 p-4">
                <AnimateOnScroll delay={300 + index * 100} className="h-full">
                  <div className="group p-8 bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl shadow-lg transition-all duration-500 hover:border-primary-accent hover:shadow-accent-glow hover:-translate-y-3 hover:scale-[1.02] h-full flex flex-col">
                    {/* Icono */}
                    <div className="mb-6">
                      <div className="bg-primary-dark/30 group-hover:bg-primary-accent/20 p-4 rounded-xl inline-block shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                        {IconComponent && (
                          <IconComponent className="h-10 w-10 text-primary-accent transition-all duration-500 group-hover:scale-110" />
                        )}
                      </div>
                    </div>

                    {/* Título del pilar */}
                    <h4 className="text-2xl font-bold mb-4 text-neutral group-hover:text-white transition-colors duration-300">
                      {t(pillar.titleKey)}
                    </h4>

                    {/* Descripción */}
                    <p className="text-neutral/90 leading-relaxed flex-grow">{t(pillar.descKey)}</p>
                  </div>
                </AnimateOnScroll>
              </div>
            );
          })}
        </div>

        {/* RESULTADO - Promesa */}
        <AnimateOnScroll delay={600}>
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl font-bold holographic-text leading-relaxed mb-8">
              {t(config.resultPromiseKey)}
            </p>

            <button
              onClick={() => {
                const element = document.querySelector('#comparison-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 font-bold text-primary-accent hover:text-white transition-all duration-300 group"
            >
              <span>{t(config.ctaTextKey)}</span>
              <span className="inline-block transition-all duration-300 group-hover:translate-x-2">
                →
              </span>
            </button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default MethodSection;
