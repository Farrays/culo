import { useState, useEffect, useCallback } from 'react';

interface BunnyEmbedProps {
  videoId: string;
  libraryId: string;
  title?: string;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  thumbnailUrl?: string; // Custom thumbnail URL (optional)
  priority?: boolean; // Load thumbnail eagerly (use with preload link for best performance)
  autoplay?: boolean; // Skip thumbnail facade and load iframe directly
  onLoadMetrics?: (metrics: VideoLoadMetrics) => void; // Optional callback for load metrics
}

/** Metrics returned when video loads */
export interface VideoLoadMetrics {
  thumbnailLoadTime: number | null; // ms to load thumbnail (null if skipped)
  iframeLoadTime: number | null; // ms from click to iframe ready
  totalTime: number; // total ms from component mount to playable
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
 * - Skeleton loader: Shows shimmer animation while thumbnail loads
 * - Error recovery: Retry button if iframe fails to load
 * - Load metrics: Optional callback with timing data
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
  onLoadMetrics,
}) => {
  // Core state
  const [isLoaded, setIsLoaded] = useState(autoplay);
  const [thumbnailError, setThumbnailError] = useState(autoplay);
  const [thumbnailLoading, setThumbnailLoading] = useState(!autoplay);

  // Iframe state for error recovery
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Metrics tracking
  const [mountTime] = useState(() => Date.now());
  const [thumbnailLoadTime, setThumbnailLoadTime] = useState<number | null>(null);
  const [clickTime, setClickTime] = useState<number | null>(null);

  // Use custom thumbnail or generate from Bunny's embed thumbnail endpoint
  const thumbnailUrl =
    autoplay && !customThumbnailUrl
      ? ''
      : customThumbnailUrl ||
        `https://video.bunnycdn.com/play/${libraryId}/${videoId}/thumbnail.jpg`;

  // Aspect ratio styles
  const aspectRatioStyle = aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : '16/9';

  // Container max-width based on aspect ratio
  const containerClass =
    aspectRatio === '9:16'
      ? 'w-full max-w-[350px] sm:max-w-[400px]'
      : aspectRatio === '1:1'
        ? 'w-full max-w-[500px]'
        : 'w-full max-w-4xl';

  // Play button color based on aspect ratio
  const playButtonClass =
    aspectRatio === '9:16'
      ? 'bg-gradient-to-br from-orange-500 to-orange-600'
      : 'bg-primary-accent';

  // Handle thumbnail load success
  const handleThumbnailLoad = useCallback(() => {
    setThumbnailLoading(false);
    setThumbnailLoadTime(Date.now() - mountTime);
  }, [mountTime]);

  // Handle thumbnail load error
  const handleThumbnailError = useCallback(() => {
    setThumbnailError(true);
    setThumbnailLoading(false);
  }, []);

  // Handle play click
  const handlePlay = useCallback(() => {
    setClickTime(Date.now());
    setIsLoaded(true);
    setIframeLoading(true);
    setIframeError(false);
  }, []);

  // Handle iframe load success
  const handleIframeLoad = useCallback(() => {
    setIframeLoading(false);
    setIframeError(false);

    // Report metrics if callback provided
    if (onLoadMetrics && clickTime) {
      const iframeLoadTime = Date.now() - clickTime;
      onLoadMetrics({
        thumbnailLoadTime,
        iframeLoadTime,
        totalTime: Date.now() - mountTime,
      });
    }
  }, [onLoadMetrics, clickTime, thumbnailLoadTime, mountTime]);

  // Handle retry
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setIframeError(false);
    setIframeLoading(true);
  }, []);

  // Iframe timeout detection (10 seconds)
  useEffect(() => {
    if (!iframeLoading) return;

    const timeout = setTimeout(() => {
      if (iframeLoading) {
        setIframeError(true);
        setIframeLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [iframeLoading, retryCount]);

  // Skeleton shimmer component
  const SkeletonLoader = () => (
    <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-neutral-800/50 to-transparent" />
    </div>
  );

  // Thumbnail/facade view
  if (!isLoaded) {
    return (
      <div className={`mx-auto ${containerClass}`}>
        <div
          className="relative w-full rounded-2xl overflow-hidden border-2 border-primary-accent/30 shadow-lg cursor-pointer group hover:shadow-accent-glow transition-shadow duration-300 bg-black"
          style={{ aspectRatio: aspectRatioStyle }}
          onClick={handlePlay}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handlePlay();
            }
          }}
          aria-label={`Reproducir video: ${title}`}
        >
          {/* Skeleton loader while thumbnail loads */}
          {thumbnailLoading && !thumbnailError && <SkeletonLoader />}

          {/* Thumbnail or gradient fallback */}
          {!thumbnailError ? (
            <img
              src={thumbnailUrl}
              alt={title}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                thumbnailLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleThumbnailLoad}
              onError={handleThumbnailError}
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

          {/* Reel badge for vertical videos */}
          {aspectRatio === '9:16' && (
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium">
              Reel
            </div>
          )}
        </div>
      </div>
    );
  }

  // Error state with retry button
  if (iframeError) {
    return (
      <div className={`mx-auto ${containerClass}`}>
        <div
          className="relative w-full rounded-2xl overflow-hidden border-2 border-red-500/30 shadow-lg bg-neutral-900"
          style={{ aspectRatio: aspectRatioStyle }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            {/* Error icon */}
            <svg
              className="w-12 h-12 text-red-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-neutral/80 text-sm mb-4">Error al cargar el video</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-primary-accent text-white text-sm rounded-full font-medium hover:bg-primary-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent"
            >
              Reintentar
            </button>
            {retryCount > 0 && (
              <p className="text-neutral/50 text-xs mt-2">Intento {retryCount + 1}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Build iframe URL with proper parameters
  const iframeSrc = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=${autoplay || isLoaded}&muted=${autoplay}&preload=true&responsive=true&t=${retryCount}`;

  return (
    <div className={`mx-auto ${containerClass}`}>
      <div
        className="relative w-full rounded-2xl overflow-hidden border-2 border-primary-accent/30 shadow-lg hover:shadow-accent-glow transition-shadow duration-300 bg-black"
        style={{ aspectRatio: aspectRatioStyle }}
      >
        {/* Loading spinner while iframe loads */}
        {iframeLoading && (
          <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center z-10">
            <div className="w-10 h-10 border-3 border-primary-accent/30 border-t-primary-accent rounded-full animate-spin" />
          </div>
        )}

        <iframe
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-0 scale-[1.01]"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          title={title}
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
};

export default BunnyEmbed;
