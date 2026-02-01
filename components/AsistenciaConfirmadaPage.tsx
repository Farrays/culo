import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

/**
 * AsistenciaConfirmadaPage
 *
 * Página de confirmación después de que el alumno confirma o cancela su asistencia.
 * Se muestra cuando el alumno hace clic en un link de confirmación desde email
 * o responde vía WhatsApp.
 *
 * Query params:
 * - status: 'confirmed' | 'not_attending' | 'error'
 * - reason: (opcional) razón del error
 */
const AsistenciaConfirmadaPage: React.FC = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [searchParams] = useSearchParams();

  const status = searchParams.get('status');
  const reason = searchParams.get('reason');

  // Determinar el contenido según el estado
  const getContent = () => {
    switch (status) {
      case 'confirmed':
        return {
          emoji: '✅',
          title: '¡Perfecto! Te esperamos',
          subtitle: 'Hemos registrado tu confirmación de asistencia.',
          description: 'Recuerda llegar 10 minutos antes para prepararte. ¡Nos vemos en clase!',
          ctaText: 'Ver mis reservas',
          ctaLink: `/${locale}/horarios-clases-baile-barcelona`,
          bgGradient: 'from-emerald-500/20 to-green-500/10',
        };

      case 'not_attending':
        return {
          emoji: '📅',
          title: 'Entendido',
          subtitle: 'Lamentamos que no puedas venir a esta clase.',
          description: '¿Te gustaría reservar otra fecha? Tenemos muchas clases disponibles.',
          ctaText: 'Ver horarios disponibles',
          ctaLink: `/${locale}/horarios-clases-baile-barcelona`,
          bgGradient: 'from-amber-500/20 to-orange-500/10',
        };

      case 'error':
        return {
          emoji: '⚠️',
          title: 'Algo salió mal',
          subtitle: getErrorMessage(reason),
          description: 'Por favor, contacta con nosotros si necesitas ayuda.',
          ctaText: 'Contactar',
          ctaLink: `/${locale}/contacto`,
          bgGradient: 'from-red-500/20 to-rose-500/10',
        };

      default:
        return {
          emoji: '❓',
          title: 'Estado desconocido',
          subtitle: 'No pudimos determinar el estado de tu confirmación.',
          description: 'Por favor, contacta con nosotros si necesitas ayuda.',
          ctaText: 'Volver al inicio',
          ctaLink: `/${locale}`,
          bgGradient: 'from-gray-500/20 to-slate-500/10',
        };
    }
  };

  const content = getContent();

  return (
    <>
      <Helmet>
        <title>Confirmación de Asistencia | Farray&apos;s Center</title>
        <meta
          name="description"
          content="Confirmación de asistencia a tu clase de baile en Farray's Center Barcelona."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        className={`min-h-screen bg-black text-neutral flex items-center justify-center px-6 py-16`}
      >
        <div className="text-center max-w-2xl">
          {/* Emoji con animación */}
          <div className="mb-8">
            <span className="text-[100px] sm:text-[120px] block animate-bounce-slow">
              {content.emoji}
            </span>
          </div>

          {/* Título */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            {content.title}
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl text-neutral/90 mb-4">{content.subtitle}</p>

          {/* Descripción */}
          <p className="text-neutral/75 mb-10 text-base sm:text-lg max-w-xl mx-auto">
            {content.description}
          </p>

          {/* Info card para confirmados */}
          {status === 'confirmed' && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 mb-10 max-w-md mx-auto">
              <h3 className="text-emerald-400 font-semibold mb-3">💡 Recuerda traer:</h3>
              <ul className="text-neutral/80 text-sm space-y-2 text-left">
                <li>• Ropa cómoda para bailar</li>
                <li>• Botella de agua</li>
                <li>• ¡Muchas ganas de pasarlo bien!</li>
              </ul>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={content.ctaLink}
              className="bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent shadow-lg hover:shadow-accent-glow transform hover:scale-105"
            >
              {content.ctaText}
            </Link>
            <Link
              to={`/${locale}`}
              className="bg-transparent border-2 border-primary-accent text-primary-accent font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white transform hover:scale-105"
            >
              Volver al inicio
            </Link>
          </div>

          {/* Footer text */}
          <p className="mt-12 text-neutral/60 text-sm">
            ¿Tienes alguna pregunta?{' '}
            <Link to={`/${locale}/contacto`} className="text-primary-accent hover:underline">
              Escríbenos
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

/**
 * Mapea códigos de error a mensajes amigables
 */
function getErrorMessage(reason: string | null): string {
  switch (reason) {
    case 'token_expired':
      return 'El enlace ha expirado o ya no es válido.';
    case 'booking_not_found':
      return 'No encontramos la reserva asociada.';
    case 'booking_cancelled':
      return 'Esta reserva ya fue cancelada anteriormente.';
    case 'server_error':
      return 'Hubo un problema en el servidor. Inténtalo de nuevo.';
    default:
      return 'Ocurrió un error inesperado.';
  }
}

export default AsistenciaConfirmadaPage;
