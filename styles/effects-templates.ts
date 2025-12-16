/**
 * Efectos de Fondo Reutilizables
 * Templates de CSS/Tailwind para usar en diferentes secciones
 */

/**
 * EFECTO FONDO DE TEXTO 1
 * Gradiente vertical con transición suave de negro a primary-dark y vuelta a negro
 * Usado originalmente en la sección de Tacones (Lady Style)
 *
 * CSS Classes: bg-gradient-to-b from-black via-primary-dark/10 to-black
 *
 * Ejemplo de uso:
 * <section className="py-10 md:py-14 bg-gradient-to-b from-black via-primary-dark/10 to-black">
 *   <div className="container mx-auto px-4 sm:px-6">
 *     <div className="max-w-4xl mx-auto text-center">
 *       <!-- Contenido aquí -->
 *     </div>
 *   </div>
 * </section>
 */
export const EFECTO_FONDO_TEXTO_1 = {
  name: 'Efecto Fondo de Texto 1',
  description: 'Gradiente vertical suave con primary-dark en el centro',
  classes: 'bg-gradient-to-b from-black via-primary-dark/10 to-black',
  // Para secciones con padding estándar:
  sectionClasses: 'py-10 md:py-14 bg-gradient-to-b from-black via-primary-dark/10 to-black',
  // Decoración opcional con estrellas:
  decorativeStars: '★★★',
};

/**
 * Uso con componente React:
 *
 * import { EFECTO_FONDO_TEXTO_1 } from '../styles/effects-templates';
 *
 * <section className={EFECTO_FONDO_TEXTO_1.sectionClasses}>
 *   <div className="container mx-auto px-4 sm:px-6">
 *     <div className="max-w-4xl mx-auto text-center">
 *       <div className="inline-flex items-center gap-2 mb-4">
 *         <span className="text-2xl text-primary-accent">{EFECTO_FONDO_TEXTO_1.decorativeStars}</span>
 *       </div>
 *       <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-neutral mb-4 holographic-text">
 *         {t('tuTituloAqui')}
 *       </h3>
 *       <p className="text-base sm:text-lg text-neutral/80 leading-relaxed max-w-3xl mx-auto mb-6">
 *         {t('tuDescripcionAqui')}
 *       </p>
 *     </div>
 *   </div>
 * </section>
 */
