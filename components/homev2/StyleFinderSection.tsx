import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';
import { HOMEPAGE_V2_CONFIG } from '../../constants/homepage-v2-config';

interface StyleFinderSectionProps {
  config: typeof HOMEPAGE_V2_CONFIG.styleFinder;
}

// Iconos para las personas
const PersonaIcons: Record<string, React.FC<{ className?: string }>> = {
  sparkles: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  heart: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  ),
  fire: ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
      />
    </svg>
  ),
  lightning: ({ className }) => (
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
 * StyleFinderSection - Segmentación de Targets
 *
 * 4 cards para diferentes motivaciones/personas:
 * 1. "Quiero sentirme poderosa" - Empoderamiento femenino
 * 2. "Quiero bailar en pareja" - Parejas salsa/bachata
 * 3. "Quiero soltar energía" - Jóvenes urbanos
 * 4. "Quiero cuidarme bailando" - Adultos fitness
 */
const StyleFinderSection: React.FC<StyleFinderSectionProps> = ({ config }) => {
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
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t(config.titleKey)}
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">{t(config.subtitleKey)}</p>
          </div>
        </AnimateOnScroll>

        {/* Cards de Personas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.personas.map((persona, index) => {
            const IconComponent = PersonaIcons[persona.icon] ?? PersonaIcons['sparkles'];

            return (
              <AnimateOnScroll
                key={persona.id}
                delay={100 + index * 100}
                className="[perspective:1000px]"
              >
                <Link to={`/${locale}${persona.href}`} className="group block h-full">
                  <div
                    className={`h-full bg-gradient-to-br ${persona.gradient} p-[1px] rounded-2xl [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)] transition-all duration-500`}
                  >
                    <div className="h-full bg-gray-900 rounded-2xl p-6 flex flex-col">
                      {/* Icono */}
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${persona.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        {IconComponent && <IconComponent className="w-7 h-7 text-white" />}
                      </div>

                      {/* Título de la persona */}
                      <h3 className="text-xl font-bold text-white mb-2">
                        &ldquo;{t(persona.titleKey)}&rdquo;
                      </h3>

                      {/* Descripción */}
                      <p className="text-white/70 text-sm mb-4 flex-grow">{t(persona.descKey)}</p>

                      {/* Estilos sugeridos */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {persona.styles.slice(0, 3).map(style => (
                            <span
                              key={style}
                              className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full"
                            >
                              {style}
                            </span>
                          ))}
                          {persona.styles.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded-full">
                              +{persona.styles.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center text-white group-hover:text-primary-accent transition-colors duration-300">
                        <span className="text-sm font-medium">{t(persona.ctaKey)}</span>
                        <svg
                          className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Ver todos los estilos */}
        <AnimateOnScroll delay={500}>
          <div className="mt-12 text-center">
            <Link
              to={`/${locale}${config.viewAllHref}`}
              className="inline-flex items-center text-white/70 hover:text-white transition-colors duration-300 group"
            >
              <span className="font-medium">{t(config.viewAllCtaKey)}</span>
              <svg
                className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default StyleFinderSection;
