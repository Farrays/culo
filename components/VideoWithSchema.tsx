import React from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Props for the VideoWithSchema component.
 */
interface VideoWithSchemaProps {
  /** Video title for schema */
  name: string;
  /** Video description for schema */
  description: string;
  /** URL to video thumbnail image */
  thumbnailUrl: string;
  /** Upload date in ISO 8601 format (e.g., 2025-01-01) */
  uploadDate: string;
  /** Duration in ISO 8601 format (e.g., PT1M30S = 1 min 30 sec) */
  duration?: string;
  /** Direct URL to video file */
  contentUrl?: string;
  /** URL to embedded player */
  embedUrl?: string;
  /** Additional CSS classes */
  className?: string;
  /** Poster image URL */
  poster?: string;
  /** Video source URL */
  src?: string;
  /** Auto-play video (default: true) */
  autoPlay?: boolean;
  /** Loop video playback (default: true) */
  loop?: boolean;
  /** Mute video audio (default: true) */
  muted?: boolean;
  /** Allow inline playback on mobile (default: true) */
  playsInline?: boolean;
  /** Accessible title attribute */
  title?: string;
  /** Additional source elements */
  children?: React.ReactNode;
}

/**
 * Video element with Schema.org VideoObject markup for SEO.
 * Generates structured data for Google Video search results.
 * Default settings are optimized for background/hero videos.
 *
 * @param name - Video title for schema
 * @param description - Video description for schema
 * @param thumbnailUrl - Thumbnail image URL
 * @param uploadDate - Upload date in ISO 8601 format (e.g., 2025-01-01)
 * @param duration - Duration in ISO 8601 (default: PT30S)
 * @param src - Video source URL
 *
 * @example
 * ```tsx
 * <VideoWithSchema
 *   name="Clase de Dancehall en Barcelona"
 *   description="Aprende los movimientos básicos de Dancehall"
 *   thumbnailUrl="https://example.com/thumb.jpg"
 *   uploadDate="2024-01-15"
 *   duration="PT2M30S"
 *   src="/videos/dancehall-intro.mp4"
 *   poster="/images/dancehall-poster.jpg"
 *   className="w-full h-full object-cover"
 * />
 * ```
 */
const VideoWithSchema: React.FC<VideoWithSchemaProps> = ({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration = 'PT30S',
  contentUrl,
  embedUrl,
  className = '',
  poster,
  src,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  title = '',
  children,
}) => {
  const videoSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: name,
    description: description,
    thumbnailUrl: thumbnailUrl,
    uploadDate: uploadDate,
    duration: duration,
    ...(contentUrl && { contentUrl: contentUrl }),
    ...(embedUrl && { embedUrl: embedUrl }),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
      </Helmet>

      <video
        className={className}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        title={title}
      >
        {src && <source src={src} type="video/mp4" />}
        {children}
      </video>
    </>
  );
};

export default VideoWithSchema;
