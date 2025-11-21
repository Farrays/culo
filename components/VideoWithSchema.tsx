import React from 'react';
import { Helmet } from 'react-helmet-async';

interface VideoWithSchemaProps {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601 format: PT1M30S = 1 min 30 sec
  contentUrl?: string;
  embedUrl?: string;
  className?: string;
  poster?: string;
  src?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  title?: string;
  children?: React.ReactNode;
}

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
