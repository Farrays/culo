import { useEffect, useRef, useState } from 'react';
import type Hls from 'hls.js';

interface UseHLSVideoOptions {
  /** HLS playlist URL (.m3u8) */
  hlsUrl: string;
  /** MP4 fallback URL for browsers that don't support HLS */
  mp4Url?: string;
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
 * - MP4 fallback when HLS fails
 * - Respects prefers-reduced-motion
 * - Respects Save-Data header
 */
export const useHLSVideo = (options: UseHLSVideoOptions): UseHLSVideoReturn => {
  const { hlsUrl, mp4Url, loadDelay = 150, respectReducedMotion = true, respectDataSaver = true } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsInstanceRef = useRef<Hls | null>(null);
  const hasTriedFallbackRef = useRef(false);

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

    // Reset fallback flag on new initialization
    hasTriedFallbackRef.current = false;

    const handleVideoReady = () => setIsVideoReady(true);
    const handleVideoPlaying = () => setIsVideoPlaying(true);

    const tryMp4Fallback = async () => {
      // Only try fallback once
      if (hasTriedFallbackRef.current || !mp4Url || !video) return false;
      hasTriedFallbackRef.current = true;

      console.log('Trying MP4 fallback:', mp4Url);
      video.src = mp4Url;

      try {
        await video.load();
        await video.play();
        setIsVideoReady(true);
        setIsVideoPlaying(true);
        return true;
      } catch (playError) {
        console.warn('MP4 fallback failed:', playError);
        setError('Video playback failed');
        return false;
      }
    };

    const initializeVideo = async () => {
      try {
        // Try hls.js first (works on Chrome, Firefox, Edge, and Safari)
        const HlsModule = await import('hls.js');
        const Hls = HlsModule.default;

        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false,
            startLevel: 0,
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

          hls.on(Hls.Events.ERROR, async (_event, data) => {
            if (data.fatal) {
              console.error('HLS fatal error:', data.type, data.details);
              hls.destroy();
              hlsInstanceRef.current = null;
              await tryMp4Fallback();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari native HLS support
          video.src = hlsUrl;
          video.addEventListener('loadeddata', handleVideoReady);
          video.addEventListener('playing', handleVideoPlaying);

          try {
            await video.play();
          } catch (playError) {
            console.warn('Safari HLS autoplay blocked, trying MP4:', playError);
            await tryMp4Fallback();
          }
        } else {
          // No HLS support, try MP4 directly
          await tryMp4Fallback();
        }
      } catch (err) {
        console.error('Failed to initialize video:', err);
        await tryMp4Fallback();
      }
    };

    initializeVideo();

    // Cleanup
    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
      video.removeEventListener('loadeddata', handleVideoReady);
      video.removeEventListener('playing', handleVideoPlaying);
    };
  }, [hlsUrl, mp4Url, isIntersecting, prefersReducedMotion, isDataSaverMode]);

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
