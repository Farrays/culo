import React, { memo, useState } from 'react';

interface VideoCardProps {
  thumbnail: string;
  title: string;
  subtitle?: string;
  onClick: () => void;
  aspectRatio?: 'vertical' | 'square';
}

/**
 * VideoCard - Tarjeta de video con thumbnail y efecto play
 *
 * Features:
 * - Lazy loading de imagen
 * - Efecto glow on hover
 * - Icono play animado
 * - Accesible con focus states
 * - Optimizado para mobile (touch friendly)
 * - Fallback visual si thumbnail no carga
 */
const VideoCard: React.FC<VideoCardProps> = memo(function VideoCard({
  thumbnail,
  title,
  subtitle,
  onClick,
  aspectRatio = 'vertical',
}) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-2xl bg-black focus:outline-none focus:ring-4 focus:ring-primary-accent/50 transition-all duration-500 [perspective:1000px] [transform-style:preserve-3d] hover:[transform:translateY(-0.5rem)_scale(1.02)_rotateY(5deg)_rotateX(2deg)]"
      aria-label={`Ver video: ${title}`}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary-dark via-primary-accent to-primary-dark rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10" />

      {/* Border glow */}
      <div className="absolute inset-0 rounded-2xl border border-primary-dark/50 group-hover:border-primary-accent/70 transition-colors duration-300" />

      {/* Thumbnail container */}
      <div
        className={`relative overflow-hidden ${
          aspectRatio === 'vertical' ? 'aspect-[9/16]' : 'aspect-square'
        }`}
      >
        {/* Thumbnail image or fallback */}
        {!imageError ? (
          <img
            src={thumbnail}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-dark via-black to-primary-accent/50 flex items-center justify-center">
            <svg className="w-16 h-16 text-white/30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073z" />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

        {/* Instagram icon badge */}
        <div className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full">
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>

        {/* Play button - center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Pulse ring */}
            <div className="absolute inset-0 bg-primary-accent/30 rounded-full animate-ping" />

            {/* Play button */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-primary-accent/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-primary-accent/50 group-hover:scale-110 group-hover:bg-primary-accent transition-all duration-300">
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Title overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-sm sm:text-base line-clamp-2 drop-shadow-lg">
            {title}
          </h3>
          {subtitle && (
            <p className="text-white/80 text-xs sm:text-sm mt-1 drop-shadow-lg">{subtitle}</p>
          )}
        </div>
      </div>
    </button>
  );
});

export default VideoCard;
