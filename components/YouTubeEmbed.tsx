import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  description?: string;
  uploadDate?: string;
  duration?: string;
}

// Declaración global para la API de YouTube
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string | HTMLElement,
        config: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayer {
  destroy: () => void;
  playVideo: () => void;
  pauseVideo: () => void;
}

/**
 * YouTube Embed Component with Thumbnail Placeholder
 *
 * Features:
 * - Lazy loading: Shows thumbnail initially, loads iframe only when clicked
 * - No suggested videos: Returns to thumbnail when video ends
 * - Performance: Saves bandwidth and improves initial page load
 * - Accessibility: Proper ARIA labels and semantic HTML
 * - Responsive: 16:9 aspect ratio maintained across all screen sizes
 */
const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title,
  description = '',
  uploadDate = new Date().toISOString().split('T')[0],
  duration = 'PT5M',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailError, setThumbnailError] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // maxresdefault may not exist for all videos, use hqdefault as fallback
  const thumbnailUrl = thumbnailError
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description: description || title,
    thumbnailUrl: [thumbnailUrl],
    uploadDate: uploadDate,
    duration: duration,
    embedUrl: embedUrl,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };

  // Cargar la API de YouTube cuando se necesite
  useEffect(() => {
    if (!isLoaded) return;

    // Función para inicializar el player
    const initPlayer = () => {
      if (!containerRef.current || playerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onStateChange: event => {
            // Cuando el video termina, volver al thumbnail
            if (event.data === window.YT.PlayerState.ENDED) {
              playerRef.current?.destroy();
              playerRef.current = null;
              setIsLoaded(false);
            }
          },
        },
      });
    };

    // Si la API ya está cargada, inicializar directamente
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Cargar la API de YouTube
      const existingScript = document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      );

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        document.body.appendChild(script);
      }

      // Callback cuando la API está lista
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isLoaded, videoId]);

  if (!isLoaded) {
    return (
      <>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
        </Helmet>
        <div
          className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary-accent/50 shadow-accent-glow cursor-pointer group"
          onClick={() => setIsLoaded(true)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsLoaded(true);
            }
          }}
          aria-label={`Load video: ${title}`}
        >
          <img
            src={thumbnailUrl}
            alt={title}
            width="1280"
            height="720"
            loading="lazy"
            className="w-full h-full object-cover"
            onLoad={e => {
              // YouTube returns 120x90 gray placeholder when maxresdefault doesn't exist
              const img = e.currentTarget;
              if (!thumbnailError && img.naturalWidth <= 120) {
                setThumbnailError(true);
              }
            }}
            onError={() => !thumbnailError && setThumbnailError(true)}
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-10 h-10 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
      </Helmet>
      <div className="aspect-video rounded-2xl overflow-hidden border-2 border-primary-accent/50 shadow-accent-glow">
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </>
  );
};

export default YouTubeEmbed;
