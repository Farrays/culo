import { useEffect, useRef, useState } from 'react';
import type Hls from 'hls.js';

interface UseHLSVideoOptions {
  /** HLS playlist URL (.m3u8) */
  hlsUrl: string;
  /** Delay before loading video after intersection (ms) */
  loadDelay?: number;
  /** Respect user's reduced motion preference */
  respectReducedMotion?: boolean;
  /** Respect data saver mode */
  respectDataSaver?: boolean;
}

interface UseHLSVideoReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isVideoReady: boolean;
  isVideoPlaying: boolean;
  shouldShowVideo: boolean;
  error: string | null;
}

/**
 * Hook for lazy-loading HLS video with performance optimizations
 *
 * Features:
 * - Dynamic import of hls.js (doesn't affect initial bundle)
 * - Intersection Observer for lazy loading
 * - Safari native HLS support (no hls.js needed)
 * - Respects prefers-reduced-motion
 * - Respects Save-Data header
 */
export const useHLSVideo = (options: UseHLSVideoOptions): UseHLSVideoReturn => {
  const { hlsUrl, loadDelay = 150, respectReducedMotion = true, respectDataSaver = true } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsInstanceRef = useRef<Hls | null>(null);

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isDataSaverMode, setIsDataSaverMode] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [respectReducedMotion]);

  // Detect data saver mode
  useEffect(() => {
    if (!respectDataSaver) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = (navigator as any).connection as { saveData?: boolean } | undefined;
    if (connection) {
      setIsDataSaverMode(connection.saveData === true);
    }
  }, [respectDataSaver]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Delay to prioritize LCP (poster image)
            setTimeout(() => {
              setIsIntersecting(true);
            }, loadDelay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [loadDelay]);

  // Initialize HLS when visible and allowed
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isIntersecting || prefersReducedMotion || isDataSaverMode) {
      return;
    }

    const initializeVideo = async () => {
      try {
        // Check if browser supports HLS natively (Safari)
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari: use native HLS support
          video.src = hlsUrl;
          video.addEventListener('loadeddata', () => setIsVideoReady(true));
          video.addEventListener('playing', () => setIsVideoPlaying(true));
          video.addEventListener('error', () => setError('Video playback error'));

          try {
            await video.play();
          } catch (playError) {
            // Autoplay blocked, video will show but not play
            console.warn('Autoplay blocked:', playError);
          }
        } else {
          // Chrome/Firefox: use hls.js
          const HlsModule = await import('hls.js');
          const Hls = HlsModule.default;

          if (!Hls.isSupported()) {
            setError('HLS not supported');
            return;
          }

          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            // Start with lower quality for faster start
            startLevel: 0,
            // Limit buffer to save bandwidth
            maxBufferLength: 30,
            maxMaxBufferLength: 60,
          });

          hlsInstanceRef.current = hls;

          hls.loadSource(hlsUrl);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, async () => {
            setIsVideoReady(true);
            try {
              await video.play();
              setIsVideoPlaying(true);
            } catch (playError) {
              console.warn('Autoplay blocked:', playError);
            }
          });

          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              console.error('HLS fatal error:', data.type, data.details);
              setError(`HLS error: ${data.details}`);
              hls.destroy();
            }
          });
        }
      } catch (err) {
        console.error('Failed to initialize video:', err);
        setError('Failed to load video');
      }
    };

    initializeVideo();

    // Cleanup
    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [hlsUrl, isIntersecting, prefersReducedMotion, isDataSaverMode]);

  // Determine if video should be shown
  const shouldShowVideo = !prefersReducedMotion && !isDataSaverMode && !error;

  return {
    videoRef,
    containerRef,
    isVideoReady,
    isVideoPlaying,
    shouldShowVideo,
    error,
  };
};

export default useHLSVideo;
