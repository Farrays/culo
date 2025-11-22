import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  description?: string;
  uploadDate?: string;
  duration?: string;
}

/**
 * YouTube Embed Component with Thumbnail Placeholder
 *
 * Features:
 * - Lazy loading: Shows thumbnail initially, loads iframe only when clicked
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
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

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
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  );
};

export default YouTubeEmbed;
