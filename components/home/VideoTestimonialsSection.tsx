import React, { useState, memo, lazy, Suspense } from 'react';
import { useI18n } from '../../hooks/useI18n';
import AnimateOnScroll from '../AnimateOnScroll';
import VideoCard from '../shared/VideoCard';

// Lazy load modal para no afectar carga inicial
const VideoModal = lazy(() => import('../shared/VideoModal'));

export interface VideoTestimonial {
  id: string;
  videoSrc: string;
  thumbnail: string;
  titleKey: string;
  subtitleKey?: string;
}

interface VideoTestimonialsSectionProps {
  videos?: VideoTestimonial[];
  titleKey?: string;
  subtitleKey?: string;
}

// Videos por defecto de la academia
// Los archivos deben estar en /public/videos/
const defaultVideos: VideoTestimonial[] = [
  {
    id: 'video-1',
    videoSrc: '/videos/video-1.mp4',
    thumbnail: '/images/video-thumbs/video-1.webp',
    titleKey: 'videoTestimonial1Title',
  },
  {
    id: 'video-2',
    videoSrc: '/videos/video-2.mp4',
    thumbnail: '/images/video-thumbs/video-2.webp',
    titleKey: 'videoTestimonial2Title',
  },
  {
    id: 'video-3',
    videoSrc: '/videos/video-3.mp4',
    thumbnail: '/images/video-thumbs/video-3.webp',
    titleKey: 'videoTestimonial3Title',
  },
  {
    id: 'video-4',
    videoSrc: '/videos/video-4.mp4',
    thumbnail: '/images/video-thumbs/video-4.webp',
    titleKey: 'videoTestimonial4Title',
  },
  {
    id: 'video-5',
    videoSrc: '/videos/video-5.mp4',
    thumbnail: '/images/video-thumbs/video-5.webp',
    titleKey: 'videoTestimonial5Title',
  },
];

/**
 * VideoTestimonialsSection - Sección de videos testimoniales
 *
 * Features:
 * - SEO optimizado con Schema markup
 * - Lazy loading de imágenes y modal
 * - Scroll horizontal en mobile
 * - Grid responsivo en desktop
 * - 0 impacto en performance inicial (solo thumbnails)
 * - Videos self-hosted para reproducción instantánea
 */
const VideoTestimonialsSection: React.FC<VideoTestimonialsSectionProps> = memo(
  function VideoTestimonialsSection({
    videos = defaultVideos,
    titleKey = 'videoTestimonialsTitle',
    subtitleKey = 'videoTestimonialsSubtitle',
  }) {
    const { t } = useI18n();
    const [selectedVideo, setSelectedVideo] = useState<VideoTestimonial | null>(null);

    const handleOpenVideo = (video: VideoTestimonial) => {
      setSelectedVideo(video);
    };

    const handleCloseVideo = () => {
      setSelectedVideo(null);
    };

    return (
      <>
        <section
          className="py-20 md:py-32 bg-black relative overflow-hidden"
          aria-labelledby="video-testimonials-title"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Header */}
            <AnimateOnScroll>
              <div className="text-center mb-12 md:mb-16">
                <h2
                  id="video-testimonials-title"
                  className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-neutral mb-4 holographic-text"
                >
                  {t(titleKey)}
                </h2>
                <p className="text-lg sm:text-xl text-neutral/70 max-w-2xl mx-auto">
                  {t(subtitleKey)}
                </p>
              </div>
            </AnimateOnScroll>

            {/* Videos grid - Scroll horizontal en mobile, grid en desktop */}
            <div className="relative">
              {/* Mobile: Scroll horizontal */}
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:hidden -mx-4 px-4">
                {videos.map((video, index) => (
                  <AnimateOnScroll key={video.id} delay={index * 100}>
                    <div className="flex-shrink-0 w-48 snap-center">
                      <VideoCard
                        thumbnail={video.thumbnail}
                        title={t(video.titleKey)}
                        subtitle={video.subtitleKey ? t(video.subtitleKey) : undefined}
                        onClick={() => handleOpenVideo(video)}
                        aspectRatio="vertical"
                      />
                    </div>
                  </AnimateOnScroll>
                ))}
              </div>

              {/* Desktop: Grid */}
              <div className="hidden md:grid grid-cols-5 gap-6 max-w-6xl mx-auto">
                {videos.map((video, index) => (
                  <AnimateOnScroll key={video.id} delay={index * 100}>
                    <VideoCard
                      thumbnail={video.thumbnail}
                      title={t(video.titleKey)}
                      subtitle={video.subtitleKey ? t(video.subtitleKey) : undefined}
                      onClick={() => handleOpenVideo(video)}
                      aspectRatio="vertical"
                    />
                  </AnimateOnScroll>
                ))}
              </div>
            </div>

            {/* CTA */}
            <AnimateOnScroll delay={300}>
              <div className="text-center mt-12">
                <a
                  href="https://www.instagram.com/farrays_centerbcn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-white/90 hover:text-white border border-primary-accent/50 hover:border-primary-accent rounded-full transition-all duration-300 hover:bg-primary-accent/10 group"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span className="font-semibold">{t('videoTestimonialsCTA')}</span>
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Schema markup para SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Video testimonials de Farrays Center',
                description: 'Videos de alumnos y momentos en nuestra academia de baile',
                numberOfItems: videos.length,
                itemListElement: videos.map((video, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'VideoObject',
                    name: t(video.titleKey),
                    thumbnailUrl: `https://www.farrayscenter.com${video.thumbnail}`,
                    contentUrl: `https://www.farrayscenter.com${video.videoSrc}`,
                    uploadDate: new Date().toISOString(),
                    publisher: {
                      '@type': 'Organization',
                      name: 'Farrays Center',
                      logo: {
                        '@type': 'ImageObject',
                        url: 'https://www.farrayscenter.com/images/logo.png',
                      },
                    },
                  },
                })),
              }),
            }}
          />
        </section>

        {/* Modal - lazy loaded */}
        <Suspense fallback={null}>
          {selectedVideo && (
            <VideoModal
              isOpen={!!selectedVideo}
              onClose={handleCloseVideo}
              videoSrc={selectedVideo.videoSrc}
              title={t(selectedVideo.titleKey)}
            />
          )}
        </Suspense>

        {/* CSS para ocultar scrollbar pero mantener funcionalidad */}
        <style>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </>
    );
  }
);

export default VideoTestimonialsSection;
