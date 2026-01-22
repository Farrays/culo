import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';

/**
 * ManifestoBanner - Sección visual impactante con tipografía gigante
 *
 * Diseño "fuera de los patrones" pero coherente con la marca:
 * - Tipografía grande responsive con Tailwind breakpoints
 * - Rotación sutil para romper la monotonía
 * - Colores del tema (rosa primary-accent)
 * - Sin JavaScript, solo CSS para máximo rendimiento
 * - SEO friendly (texto real en HTML semántico)
 */
const ManifestoBanner: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      aria-label={t('manifesto_aria_label')}
      className="relative py-12 md:py-20 overflow-hidden bg-black"
    >
      {/* Background pattern - subtle diagonal lines with theme color */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 10px,
            rgba(200, 34, 96, 0.5) 10px,
            rgba(200, 34, 96, 0.5) 11px
          )`,
        }}
      />

      {/* Glow effect behind text - theme color */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[200px] bg-primary-accent/20 blur-[100px] rounded-full" />

      <div className="relative z-10 container mx-auto px-4">
        <AnimateOnScroll>
          {/* Main manifesto text */}
          <div className="text-center" style={{ transform: 'rotate(-2deg)' }}>
            {/* Línea 1 - BAILA HOY / DANCE TODAY */}
            <p
              className="font-black tracking-tighter leading-none text-primary-accent text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]"
              style={{
                textShadow: '0 0 60px rgba(200, 34, 96, 0.5), 0 0 120px rgba(200, 34, 96, 0.3)',
              }}
            >
              {t('manifesto_line1')}
            </p>

            {/* Línea 2 - TRANSFORMA / TRANSFORM */}
            <p
              className="font-black tracking-tighter leading-none text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl my-2"
              style={{
                textShadow: '0 0 40px rgba(200, 34, 96, 0.4)',
              }}
            >
              {t('manifesto_line2')}
            </p>

            {/* Línea 3 - TU MAÑANA / YOUR TOMORROW */}
            <p
              className="font-black tracking-tighter leading-none text-primary-accent text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]"
              style={{
                textShadow: '0 0 60px rgba(200, 34, 96, 0.5), 0 0 120px rgba(200, 34, 96, 0.3)',
              }}
            >
              {t('manifesto_line3')}
            </p>
          </div>

          {/* Decorative line - theme color */}
          <div className="flex justify-center mt-6 md:mt-8">
            <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-transparent via-primary-accent to-transparent rounded-full" />
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ManifestoBanner;
