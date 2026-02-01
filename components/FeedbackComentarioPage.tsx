import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

/**
 * FeedbackComentarioPage
 *
 * Página donde el usuario puede dejar un comentario después de dar feedback.
 * Se accede desde el email de feedback con el token.
 */
const FeedbackComentarioPage: React.FC = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Token no válido');
      return;
    }

    if (!comment.trim()) {
      setError('Por favor, escribe un comentario');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/${locale}/feedback-gracias`);
      } else {
        setError(data.error || 'Error al enviar el comentario');
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <>
        <Helmet>
          <title>Enlace no válido | Farray&apos;s Center</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="min-h-screen bg-black text-neutral flex items-center justify-center px-6 py-16">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <span className="text-[80px]">🔗</span>
            </div>
            <h1 className="text-3xl font-bold mb-4 text-white">Enlace no válido</h1>
            <p className="text-neutral/70 mb-8">Este enlace ha expirado o no es válido.</p>
            <Link
              to={`/${locale}`}
              className="bg-primary-accent text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent"
            >
              Volver a la web
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Déjanos tu comentario | Farray&apos;s Center</title>
        <meta
          name="description"
          content="Cuéntanos tu experiencia en Farray's Center. Tu opinión nos ayuda a mejorar."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-black text-neutral flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="text-[80px]">💬</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white">Cuéntanos más</h1>
            <p className="text-neutral/80 text-lg">Tu opinión es muy valiosa para nosotros</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="comment" className="block text-white/80 mb-2 text-sm">
                ¿Qué te gustaría contarnos?
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Escribe tu comentario aquí..."
                rows={5}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-accent focus:ring-1 focus:ring-primary-accent resize-none"
                disabled={isSubmitting}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary-accent text-white font-bold py-4 px-8 rounded-full transition-all duration-300 hover:bg-white hover:text-primary-accent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar comentario'}
              </button>
              <Link
                to={`/${locale}/feedback-gracias`}
                className="flex-1 text-center bg-transparent border-2 border-white/30 text-white/80 font-bold py-4 px-8 rounded-full transition-all duration-300 hover:border-white hover:text-white"
              >
                Omitir
              </Link>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-10 text-center text-neutral/50 text-sm">
            Tu comentario nos ayuda a mejorar cada día
          </p>
        </div>
      </div>
    </>
  );
};

export default FeedbackComentarioPage;
