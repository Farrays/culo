/**
 * Hero Video Configuration
 * Video background for the homepage hero section using Bunny.net CDN
 */

export const HERO_VIDEO_CONFIG = {
  // HLS Stream from Bunny.net CDN
  hlsUrl: 'https://vz-c354d67e-cc3.b-cdn.net/44b29bf5-1e39-4442-9b78-efb65feee4a4/playlist.m3u8',

  // Local optimized poster for fast LCP (49KB WebP)
  posterUrl: '/images/hero/hero-video-poster.webp',

  // Fallback poster from Bunny CDN (if local fails)
  posterFallbackUrl:
    'https://vz-c354d67e-cc3.b-cdn.net/44b29bf5-1e39-4442-9b78-efb65feee4a4/thumbnail_eaafec29.jpg',

  // Optional: Preview animation (WebP)
  previewUrl:
    'https://vz-c354d67e-cc3.b-cdn.net/44b29bf5-1e39-4442-9b78-efb65feee4a4/preview.webp?v=1766886027',
} as const;

export type HeroVideoConfig = typeof HERO_VIDEO_CONFIG;
