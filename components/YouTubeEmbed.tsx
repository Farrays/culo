import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { useTranslation } from 'react-i18next';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  description?: string;
  uploadDate?: string;
  duration?: string;
  priority?: boolean; // Load thumbnail eagerly (use for above-the-fold videos)
}

/** Metrics returned when video loads */
export interface YouTubeLoadMetrics {
  thumbnailLoadTime: number | null; // ms to load thumbnail (null if skipped)
  playerLoadTime: number | null; // ms from click to player ready
  totalTime: number; // total ms from component mount to playable
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
 * YouTube Embed Component with Thumbnail Placeholder (Enterprise)
 *
 * Features:
 * - Facade Pattern: Shows thumbnail initially, loads player only when clicked
 * - Performance: Saves ~500KB of JavaScript until user interacts
 * - Skeleton loader: Shows shimmer animation while thumbnail loads
 * - Loading spinner: Visual feedback while player initializes
 * - Lazy loading: Thumbnail loaded with native lazy loading (or eager with priority)
 * - No suggested videos: Returns to thumbnail when video ends
 * - Accessibility: Proper ARIA labels and keyboard navigation
 * - Cookie consent: GDPR compliant - requires functional cookies
 * - Privacy: Uses youtube-nocookie.com domain
 * - Responsive: 16:9 aspect ratio maintained across all screen sizes
 */
const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  videoId,
  title,
  description = '',
  uploadDate = '2025-01-01T00:00:00+01:00',
  duration = 'PT5M',
  priority = false,
}) => {
  const { t } = useTranslation([
    'common',
    'booking',
    'schedule',
    'calendar',
    'home',
    'classes',
    'blog',
    'faq',
    'about',
    'contact',
    'pages',
  ]);
  const { preferences, setShowBanner } = useCookieConsent();
  const hasFunctionalConsent = preferences?.functional ?? false;

  // Core state
  const [isLoaded, setIsLoaded] = useState(false);
  const [thumbnailLoading, setThumbnailLoading] = useState(true);
  const [playerLoading, setPlayerLoading] = useState(false);

  // Fallback chain: maxresdefault → hqdefault → mqdefault → default
  const [thumbnailFallback, setThumbnailFallback] = useState(0);
  const [thumbnailError, setThumbnailError] = useState(false);

  // Refs
  const playerRef = useRef<YTPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Metrics tracking
  const [mountTime] = useState(() => Date.now());
  const [_thumbnailLoadTime, setThumbnailLoadTime] = useState<number | null>(null);

  // YouTube thumbnail quality hierarchy (best to worst)
  const thumbnailQualities = ['maxresdefault', 'hqdefault', 'mqdefault', 'default'];
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/${thumbnailQualities[thumbnailFallback]}.jpg`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  // Enhanced Schema VideoObject for GEO/AIEO
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `https://www.youtube.com/watch?v=${videoId}`,
    name: title,
    description: description || title,
    thumbnailUrl: [
      `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    ],
    uploadDate: uploadDate,
    duration: duration,
    embedUrl: embedUrl,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
    publisher: {
      '@type': 'Organization',
      name: "Farray's International Dance Center",
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.farrayscenter.com/logo.svg',
      },
    },
    potentialAction: {
      '@type': 'WatchAction',
      target: `https://www.youtube.com/watch?v=${videoId}`,
    },
  };

  // Handle thumbnail load success
  const handleThumbnailLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      // YouTube returns 120x90 gray placeholder when high-res thumbnails don't exist
      if (thumbnailFallback < thumbnailQualities.length - 1 && img.naturalWidth <= 120) {
        setThumbnailFallback(prev => prev + 1);
      } else {
        setThumbnailLoading(false);
        setThumbnailLoadTime(Date.now() - mountTime);
      }
    },
    [thumbnailFallback, thumbnailQualities.length, mountTime]
  );

  // Handle thumbnail load error
  const handleThumbnailError = useCallback(() => {
    // Try next thumbnail quality if available
    if (thumbnailFallback < thumbnailQualities.length - 1) {
      setThumbnailFallback(prev => prev + 1);
    } else {
      setThumbnailError(true);
      setThumbnailLoading(false);
    }
  }, [thumbnailFallback, thumbnailQualities.length]);

  // Handle play click
  const handlePlay = useCallback(() => {
    setIsLoaded(true);
    setPlayerLoading(true);
  }, []);

  // Cargar la API de YouTube cuando se necesite
  useEffect(() => {
    if (!isLoaded) return;

    let isMounted = true;

    // Función para inicializar el player
    const initPlayer = () => {
      if (!containerRef.current || playerRef.current || !isMounted) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          rel: 0, // Solo videos del mismo canal (no externos)
          modestbranding: 1,
          playsinline: 1,
          controls: 1,
          fs: 1, // Permitir pantalla completa
          iv_load_policy: 3, // No mostrar anotaciones
          showinfo: 0, // No mostrar info del video
        },
        events: {
          onReady: event => {
            // Player listo - ocultar spinner
            if (isMounted) {
              setPlayerLoading(false);
            }
            // Asegurar que el video comienza a reproducirse
            event.target.playVideo();
          },
          onStateChange: event => {
            // Cuando el video termina, volver al thumbnail inmediatamente
            if (event.data === window.YT.PlayerState.ENDED) {
              if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
              }
              if (isMounted) {
                setIsLoaded(false);
                setPlayerLoading(false);
              }
            }
          },
        },
      });
    };

    // Si la API ya está cargada, inicializar directamente
    if (window.YT && window.YT.Player) {
      // Pequeño delay para asegurar que el DOM está listo
      window.setTimeout(initPlayer, 50);
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

      // Usar un array de callbacks para manejar múltiples componentes
      const win = window as unknown as { ytCallbacks?: (() => void)[] };
      const existingCallbacks = win.ytCallbacks || [];
      existingCallbacks.push(initPlayer);
      win.ytCallbacks = existingCallbacks;

      // Solo configurar el callback global si no existe
      if (!window.onYouTubeIframeAPIReady) {
        window.onYouTubeIframeAPIReady = () => {
          const w = window as unknown as { ytCallbacks?: (() => void)[] };
          const callbacks = w.ytCallbacks || [];
          callbacks.forEach(cb => cb());
          w.ytCallbacks = [];
        };
      }
    }

    return () => {
      isMounted = false;

      // Remover callback del array global para evitar memory leak
      const w = window as unknown as { ytCallbacks?: (() => void)[] };
      if (w.ytCallbacks) {
        w.ytCallbacks = w.ytCallbacks.filter(cb => cb !== initPlayer);
      }

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [isLoaded, videoId]);

  // Skeleton shimmer component
  const SkeletonLoader = () => (
    <div className="absolute inset-0 bg-neutral-900 overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-neutral-800/50 to-transparent" />
    </div>
  );

  // Show consent required placeholder if user hasn't accepted functional cookies
  if (!hasFunctionalConsent) {
    return (
      <>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
        </Helmet>
        <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-neutral/30 bg-black">
          {/* Skeleton while thumbnail loads */}
          {thumbnailLoading && !thumbnailError && <SkeletonLoader />}

          <img
            src={thumbnailUrl}
            alt={title}
            width="1280"
            height="720"
            loading="lazy"
            className={`w-full h-full object-cover opacity-30 transition-opacity duration-300 ${
              thumbnailLoading ? 'opacity-0' : 'opacity-30'
            }`}
            onLoad={e => {
              const img = e.currentTarget;
              if (!thumbnailError && img.naturalWidth <= 120) {
                setThumbnailError(true);
              }
              setThumbnailLoading(false);
            }}
            onError={() => !thumbnailError && setThumbnailError(true)}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <svg
              className="w-12 h-12 text-neutral/70 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="text-neutral/80 text-sm mb-4 max-w-xs">{t('cookies_youtube_blocked')}</p>
            <button
              onClick={() => setShowBanner(true)}
              className="px-4 py-2 bg-primary-accent text-white text-sm rounded-full font-medium hover:bg-primary-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-accent"
            >
              {t('cookies_configure')}
            </button>
          </div>
        </div>
      </>
    );
  }

  // Thumbnail/facade view
  if (!isLoaded) {
    return (
      <>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
        </Helmet>
        <div
          className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary-accent/50 shadow-accent-glow cursor-pointer group bg-black"
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
              width="1280"
              height="720"
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              fetchPriority={priority ? 'high' : 'auto'}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                thumbnailLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleThumbnailLoad}
              onError={handleThumbnailError}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/50 via-black to-red-600/30" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            {/* YouTube play button */}
            <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
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

  // Player view with loading spinner
  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
      </Helmet>
      <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary-accent/50 shadow-accent-glow bg-black">
        {/* Loading spinner while player initializes */}
        {playerLoading && (
          <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center z-10">
            <div className="w-10 h-10 border-3 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
          </div>
        )}

        <div ref={containerRef} className="w-full h-full" />
      </div>
    </>
  );
};

export default YouTubeEmbed;
