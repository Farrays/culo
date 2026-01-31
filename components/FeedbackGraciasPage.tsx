import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

/**
 * FeedbackGraciasPage
 *
 * Página simple de agradecimiento después de recibir feedback.
 * Se muestra cuando el usuario hace clic en una carita del email de feedback
 * y su valoración es menor a 5 estrellas.
 */
const FeedbackGraciasPage: React.FC = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return (
    <>
      <Helmet>
        <title>Gracias por tu opinión | Farray&apos;s Center</title>
        <meta
          name="description"
          content="Tu opinión nos ayuda a mejorar. Gracias por tomarte el tiempo de compartir tu experiencia con nosotros."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-black text-neutral flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-2xl">
          {/* Heart emoji with animation */}
          <div className="mb-8">
            <span className="text-[120px] animate-pulse">💖</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            ¡Gracias por tu opinión!
          </h1>

          <p className="text-xl text-neutral/90 mb-4">Tu feedback es muy valioso para nosotros.</p>

          <p className="text-neutral/75 mb-12 text-lg max-w-xl mx-auto">
            Nos ayuda a mejorar cada día y ofrecerte la mejor experiencia de baile en Barcelona.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to={`/${locale}`}
              className="bg-primary-accent text-white font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent shadow-lg hover:shadow-accent-glow transform hover:scale-105"
            >
              Volver a la web
            </Link>
            <Link
              to={`/${locale}/horarios-clases-baile-barcelona`}
              className="bg-transparent border-2 border-primary-accent text-primary-accent font-bold py-4 px-10 rounded-full transition-all duration-300 hover:bg-primary-accent hover:text-white transform hover:scale-105"
            >
              Ver horarios
            </Link>
          </div>

          {/* Footer text */}
          <p className="mt-12 text-neutral/60 text-sm">
            ¿Tienes alguna sugerencia específica?{' '}
            <Link to={`/${locale}/contacto`} className="text-primary-accent hover:underline">
              Escríbenos
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default FeedbackGraciasPage;
