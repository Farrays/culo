import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { useI18n } from '../hooks/useI18n';

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
  const { t } = useI18n();
  const { preferences, setShowBanner } = useCookieConsent();
  const hasFunctionalConsent = preferences?.functional ?? false;

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

  // Show consent required placeholder if user hasn't accepted functional cookies
  if (!hasFunctionalConsent) {
    return (
      <>
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
        </Helmet>
        <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-neutral/30 bg-dark-surface/50">
          <img
            src={thumbnailUrl}
            alt={title}
            width="1280"
            height="720"
            loading="lazy"
            className="w-full h-full object-cover opacity-30"
            onLoad={e => {
              const img = e.currentTarget;
              if (!thumbnailError && img.naturalWidth <= 120) {
                setThumbnailError(true);
              }
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
