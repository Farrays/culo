/**
 * Yunaisy Farray Page Video Configuration
 * Video background for the Yunaisy Farray hero section using Bunny.net CDN
 *
 * SEO/Performance optimizations:
 * - Local poster for fast LCP (no DNS/TLS latency)
 * - CDN fallback for reliability
 * - HLS streaming with MP4 fallback
 */

export const YUNAISY_VIDEO_CONFIG = {
  // Bunny.net Video ID
  videoId: '1bab760f-bc29-4732-9c1d-7cb930ac8f80',

  // HLS Stream from Bunny.net CDN (adaptive bitrate)
  hlsUrl: 'https://vz-3d56a778-175.b-cdn.net/1bab760f-bc29-4732-9c1d-7cb930ac8f80/playlist.m3u8',

  // MP4 fallback (480p) for browsers that don't support HLS
  mp4Url: 'https://vz-3d56a778-175.b-cdn.net/1bab760f-bc29-4732-9c1d-7cb930ac8f80/play_480p.mp4',

  // Local optimized poster for fast LCP (WebP, already optimized)
  posterUrl: '/images/teachers/img/maestra-yunaisy-farray_960.webp',

  // Fallback poster from Bunny CDN (if local fails)
  posterFallbackUrl:
    'https://vz-3d56a778-175.b-cdn.net/1bab760f-bc29-4732-9c1d-7cb930ac8f80/thumbnail.jpg',

  // Iframe embed URL (for reference, not used in this implementation)
  iframeUrl: 'https://iframe.mediadelivery.net/play/571535/1bab760f-bc29-4732-9c1d-7cb930ac8f80',
} as const;

export type YunaisyVideoConfig = typeof YUNAISY_VIDEO_CONFIG;
