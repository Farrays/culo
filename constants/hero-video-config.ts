/**
 * Hero Video Configuration
 * Video background for the homepage hero section using Bunny.net CDN
 */

export const HERO_VIDEO_CONFIG = {
  // HLS Stream from Bunny.net CDN
  hlsUrl: 'https://vz-3d56a778-175.b-cdn.net/0296f3a9-d785-461a-b188-e73ddecfa734/playlist.m3u8',

  // MP4 fallback (720p) for browsers that don't support HLS
  mp4Url: 'https://vz-3d56a778-175.b-cdn.net/0296f3a9-d785-461a-b188-e73ddecfa734/play_720p.mp4',

  // Local optimized poster for fast LCP (49KB WebP)
  posterUrl: '/images/hero/hero-video-poster.webp',

  // Fallback poster from Bunny CDN (if local fails)
  posterFallbackUrl:
    'https://vz-3d56a778-175.b-cdn.net/0296f3a9-d785-461a-b188-e73ddecfa734/thumbnail.jpg',

  // Optional: Preview animation (WebP)
  previewUrl:
    'https://vz-3d56a778-175.b-cdn.net/0296f3a9-d785-461a-b188-e73ddecfa734/preview.webp?v=1768662416',
} as const;

export type HeroVideoConfig = typeof HERO_VIDEO_CONFIG;
