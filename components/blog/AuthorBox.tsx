/**
 * AuthorBox Component
 *
 * Displays author information with E-E-A-T signals.
 * Shows photo, bio, credentials, and social links.
 * Critical for SEO/GEO - establishes expertise and authority.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { AUTHOR_YUNAISY } from '../../constants/blog/author';
import type { AuthorConfig } from '../../constants/blog/types';
import AnimateOnScroll from '../AnimateOnScroll';

interface AuthorBoxProps {
  /** Author configuration (defaults to Yunaisy) */
  author?: AuthorConfig;
  /** Animation delay in ms */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

const AuthorBox: React.FC<AuthorBoxProps> = ({
  author = AUTHOR_YUNAISY,
  delay = 0,
  className = '',
}) => {
  const { t, locale } = useI18n();

  // Render credentials (some are i18n keys, some are plain text like CID-UNESCO)
  const renderCredential = (credential: string) => {
    // Check if it's an i18n key (starts with blog_)
    if (credential.startsWith('blog_')) {
      return t(credential);
    }
    return credential;
  };

  return (
    <AnimateOnScroll delay={delay}>
      <div
        className={`relative p-6 md:p-8 my-12
                    bg-black/50 backdrop-blur-md
                    border border-primary-dark/50 rounded-2xl
                    transition-all duration-300
                    hover:border-primary-accent/50 ${className}`}
      >
        <div className="flex flex-col md:flex-row gap-6">
          {/* Author Photo */}
          <div className="flex-shrink-0">
            <Link to={`/${locale}${author.profileUrl}`} className="block relative group">
              <div
                className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden
                           border-2 border-primary-accent/50
                           group-hover:border-primary-accent
                           transition-all duration-300
                           group-hover:shadow-accent-glow"
              >
                <img
                  src={author.image}
                  srcSet={author.imageSrcSet}
                  alt={author.name}
                  width={112}
                  height={112}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative ring */}
              <div
                className="absolute inset-0 rounded-full border-2 border-transparent
                           group-hover:border-primary-accent/30
                           group-hover:scale-110
                           transition-all duration-500"
              />
            </Link>
          </div>

          {/* Author Info */}
          <div className="flex-1">
            {/* Name & Role */}
            <div className="mb-3">
              <Link
                to={`/${locale}${author.profileUrl}`}
                className="text-xl md:text-2xl font-bold text-neutral
                           hover:text-primary-accent transition-colors duration-300"
              >
                {author.name}
              </Link>
              <p className="text-primary-accent font-medium mt-1">{t(author.roleKey)}</p>
            </div>

            {/* Bio */}
            <p className="text-neutral/80 leading-relaxed mb-4">{t(author.bioKey)}</p>

            {/* Credentials */}
            <div className="flex flex-wrap gap-2 mb-4">
              {author.credentials.map((credential, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs font-bold uppercase tracking-wider
                             bg-primary-accent/10 text-primary-accent
                             border border-primary-accent/30 rounded-full"
                >
                  {renderCredential(credential)}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {author.sameAs.map((url, index) => {
                const platform = getSocialPlatform(url);
                return (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center
                               bg-primary-dark/30 rounded-lg
                               text-neutral/60 hover:text-primary-accent
                               hover:bg-primary-accent/10
                               transition-all duration-300"
                    aria-label={`${author.name} en ${platform}`}
                  >
                    {getSocialIcon(platform)}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
};

// Helper to extract platform name from URL
function getSocialPlatform(url: string): string {
  if (url.includes('instagram')) return 'instagram';
  if (url.includes('facebook')) return 'facebook';
  if (url.includes('youtube')) return 'youtube';
  if (url.includes('tiktok')) return 'tiktok';
  if (url.includes('linkedin')) return 'linkedin';
  if (url.includes('twitter') || url.includes('x.com')) return 'twitter';
  return 'link';
}

// Social icons
function getSocialIcon(platform: string): React.ReactElement {
  switch (platform) {
    case 'instagram':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case 'twitter':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      );
  }
}

export default AuthorBox;
