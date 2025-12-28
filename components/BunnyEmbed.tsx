import { useState } from 'react';

interface BunnyEmbedProps {
  videoId: string;
  libraryId: string;
  title?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  thumbnailUrl?: string; // Custom thumbnail URL (optional)
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
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);

  // Use custom thumbnail or fallback to Bunny's default thumbnail endpoint
  // Farray's pull zone: vz-c354d67e-cc3
  const thumbnailUrl =
    customThumbnailUrl || `https://vz-c354d67e-cc3.b-cdn.net/${videoId}/thumbnail.jpg`;

  // Aspect ratio styles
  const aspectRatioStyle = aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9';

  // Container max-width based on aspect ratio
  const containerClass =
    aspectRatio === '9:16'
      ? 'max-w-[350px] sm:max-w-[400px]'
      : aspectRatio === '1:1'
        ? 'max-w-[500px]'
        : 'max-w-4xl';

  // Play button color based on aspect ratio (Bunny brand orange for vertical)
  const playButtonClass =
    aspectRatio === '9:16'
      ? 'bg-gradient-to-br from-orange-500 to-orange-600'
      : 'bg-primary-accent';

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
              loading="lazy"
              decoding="async"
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

  return (
    <div className={`mx-auto ${containerClass}`}>
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2 border-primary-accent/30 shadow-lg hover:shadow-accent-glow transition-shadow duration-300"
        style={{ aspectRatio: aspectRatioStyle }}
      >
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&preload=false&responsive=true`}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    </div>
  );
};

export default BunnyEmbed;
