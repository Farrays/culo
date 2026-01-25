import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AnimateOnScroll from '../AnimateOnScroll';

interface Testimonial {
  id: string;
  nameKey: string;
  roleKey: string;
  quoteKey: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  avatarInitials: string;
  avatarColor: string;
}

/**
 * VideoTestimonialsSection - Social Proof Máximo
 *
 * Muestra testimonios en video con:
 * - Grid de videos/thumbnails
 * - Quotes destacadas
 * - Badge de Google Reviews
 * - Link a más opiniones
 */
const VideoTestimonialsSection: React.FC = () => {
  const { t } = useTranslation(['common']);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: '1',
      nameKey: 'testimonial1_name',
      roleKey: 'testimonial1_role',
      quoteKey: 'testimonial1_quote',
      videoUrl: '/videos/testimonial-maria.mp4',
      thumbnailUrl: '/images/testimonials/maria-thumb.jpg',
      avatarInitials: 'MG',
      avatarColor: 'from-brand-500 to-brand-700',
    },
    {
      id: '2',
      nameKey: 'testimonial2_name',
      roleKey: 'testimonial2_role',
      quoteKey: 'testimonial2_quote',
      videoUrl: '/videos/testimonial-carlos.mp4',
      thumbnailUrl: '/images/testimonials/carlos-thumb.jpg',
      avatarInitials: 'CR',
      avatarColor: 'from-blue-500 to-indigo-600',
    },
    {
      id: '3',
      nameKey: 'testimonial3_name',
      roleKey: 'testimonial3_role',
      quoteKey: 'testimonial3_quote',
      videoUrl: '/videos/testimonial-anna.mp4',
      thumbnailUrl: '/images/testimonials/anna-thumb.jpg',
      avatarInitials: 'AK',
      avatarColor: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-black">
      <div className="container mx-auto px-6">
        {/* Header */}
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text">
              {t('videotestimonials_title')}
            </h2>
            <p className="text-xl text-neutral/70 max-w-2xl mx-auto">
              {t('videotestimonials_subtitle')}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <AnimateOnScroll key={testimonial.id} delay={100 + index * 100}>
              <div className="group bg-black/50 backdrop-blur-md border border-primary-dark/50 rounded-2xl overflow-hidden hover:border-primary-accent/50 transition-all duration-500 hover:shadow-accent-glow">
                {/* Video/Thumbnail area */}
                <div className="relative aspect-video bg-primary-dark/30 overflow-hidden">
                  {playingVideo === testimonial.id ? (
                    <video
                      src={testimonial.videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      controls
                      onEnded={() => setPlayingVideo(null)}
                    />
                  ) : (
                    <>
                      {/* Thumbnail o placeholder */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/50 to-black/50 flex items-center justify-center">
                        <div
                          className={`w-20 h-20 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
                        >
                          {testimonial.avatarInitials}
                        </div>
                      </div>
                      {/* Play button overlay */}
                      <button
                        onClick={() => setPlayingVideo(testimonial.id)}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-label={`Play ${t(testimonial.nameKey)} testimonial`}
                      >
                        <div className="w-16 h-16 rounded-full bg-primary-accent/90 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                          <svg
                            className="w-8 h-8 text-white ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </button>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Stars */}
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-neutral/90 leading-relaxed mb-4 italic">
                    &ldquo;{t(testimonial.quoteKey)}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.avatarColor} flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {testimonial.avatarInitials}
                    </div>
                    <div>
                      <p className="font-bold text-neutral">{t(testimonial.nameKey)}</p>
                      <p className="text-sm text-neutral/60">{t(testimonial.roleKey)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Google Reviews Badge */}
        <AnimateOnScroll delay={400}>
          <div className="text-center">
            <a
              href="https://g.page/r/farrayscenter/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-primary-dark/50 rounded-full px-8 py-4 hover:border-primary-accent/50 transition-all duration-300 group"
            >
              {/* Google icon */}
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="font-bold text-neutral text-lg">4.9</span>
              </div>

              {/* Count */}
              <div className="text-neutral/70">
                <span className="font-bold text-neutral">509+</span>{' '}
                {t('videotestimonials_reviews')}
              </div>

              {/* Arrow */}
              <svg
                className="w-5 h-5 text-primary-accent group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default VideoTestimonialsSection;
