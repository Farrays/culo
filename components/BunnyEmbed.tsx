import { useState } from 'react';

interface BunnyEmbedProps {
  videoId: string;
  libraryId: string;
  title?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  thumbnailUrl?: string; // Custom thumbnail URL (optional)
  priority?: boolean; // Load thumbnail eagerly (use with preload link for best performance)
  autoplay?: boolean; // Skip thumbnail facade and load iframe directly
}

/**
 * Bunny Stream Embed Component with Thumbnail Placeholder
 *
 * Features:
 * - Facade Pattern: Shows thumbnail initially, loads iframe only when clicked
 * - Performance: Saves ~100KB of JavaScript until user interacts
 * - Lazy loading: Thumbnail loaded with native lazy loading
 * - Supports vertical (9:16), horizontal (16:9), and square (1:1) videos
 * - Accessibility: Proper ARIA labels and keyboard navigation
 *
 * To get the thumbnail URL from Bunny:
 * 1. Go to your Video Library in Bunny dashboard
 * 2. Click on the video
 * 3. Copy the thumbnail URL from the video details
 * Or use: https://vz-{pull_zone}.b-cdn.net/{video_id}/thumbnail.jpg
 */
const BunnyEmbed: React.FC<BunnyEmbedProps> = ({
  videoId,
  libraryId,
  title = 'Video',
  aspectRatio = '16:9',
  thumbnailUrl: customThumbnailUrl,
  priority = false,
  autoplay = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(autoplay);
  // When autoplay is true, skip thumbnail loading entirely to avoid 404 errors
  // Bunny.net videos may not have thumbnails generated, and we don't need them for autoplay
  const [thumbnailError, setThumbnailError] = useState(autoplay);

  // Use custom thumbnail or generate from Bunny's embed thumbnail endpoint
  // Format: https://video.bunnycdn.com/play/{libraryId}/{videoId}/thumbnail.jpg
  // Only compute URL if we might use it (not autoplay mode without custom thumbnail)
  const thumbnailUrl =
    autoplay && !customThumbnailUrl
      ? '' // Don't generate URL if autoplay and no custom thumbnail - avoids 404
      : customThumbnailUrl ||
        `https://video.bunnycdn.com/play/${libraryId}/${videoId}/thumbnail.jpg`;

  // Aspect ratio styles
  const aspectRatioStyle = aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9';

  // Container max-width based on aspect ratio
  // w-full ensures the container takes available width up to max-width
  const containerClass =
    aspectRatio === '9:16'
      ? 'w-full max-w-[350px] sm:max-w-[400px]'
      : aspectRatio === '1:1'
        ? 'w-full max-w-[500px]'
        : 'w-full max-w-4xl';

  // Play button color based on aspect ratio (Bunny brand orange for vertical)
  const playButtonClass =
    aspectRatio === '9:16'
      ? 'bg-gradient-to-br from-orange-500 to-orange-600'
      : 'bg-primary-accent';

  // Note: Bunny.net is a first-party video CDN, not a third-party tracker
  // No cookie consent required for video playback

  if (!isLoaded) {
    return (
      <div className={`mx-auto ${containerClass}`}>
        <div
          className="relative w-full rounded-2xl overflow-hidden border-2 border-primary-accent/30 shadow-lg cursor-pointer group hover:shadow-accent-glow transition-shadow duration-300"
          style={{ aspectRatio: aspectRatioStyle }}
          onClick={() => setIsLoaded(true)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsLoaded(true);
            }
          }}
          aria-label={`Reproducir video: ${title}`}
        >
          {/* Thumbnail or gradient fallback */}
          {!thumbnailError ? (
            <img
              src={thumbnailUrl}
              alt={title}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setThumbnailError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-black to-primary-accent/30" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            {/* Play button */}
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 ${playButtonClass} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Video duration badge (optional future enhancement) */}
          {aspectRatio === '9:16' && (
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium">
              Reel
            </div>
          )}
        </div>
      </div>
    );
  }

  // Build iframe URL with proper parameters
  // Note: muted=true is required for autoplay to work in browsers
  const iframeSrc = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=${autoplay}&muted=${autoplay}&preload=true&responsive=true`;

  return (
    <div className={`mx-auto ${containerClass}`}>
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2 border-primary-accent/30 shadow-lg hover:shadow-accent-glow transition-shadow duration-300"
        style={{ aspectRatio: aspectRatioStyle }}
      >
        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          title={title}
        />
      </div>
    </div>
  );
};

export default BunnyEmbed;
