/**
 * ShareButtons Component
 *
 * Social sharing buttons for blog articles.
 * Supports WhatsApp, Facebook, Twitter/X, LinkedIn, and Email.
 */

import React from 'react';
import { useTranslation } from 'react-i18next';

type SharePlatform = 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'email';

interface ShareButtonsProps {
  /** URL to share (defaults to current page) */
  url?: string;
  /** Title/text to share */
  title: string;
  /** Platforms to display */
  platforms?: SharePlatform[];
  /** Additional CSS classes */
  className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title,
  platforms = ['whatsapp', 'facebook', 'twitter', 'linkedin', 'email'],
  className = '',
}) => {
  const { t } = useTranslation(['common']);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks: Record<
    SharePlatform,
    { href: string; label: string; icon: React.ReactElement }
  > = {
    whatsapp: {
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      label: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
    },
    facebook: {
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: 'Facebook',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    twitter: {
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      label: 'X (Twitter)',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    linkedin: {
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      label: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    email: {
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      label: 'Email',
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <h3 className="text-lg font-bold text-neutral">{t('blog_shareArticle')}</h3>
      <div className="flex flex-wrap gap-3">
        {platforms.map(platform => {
          const { href, label, icon } = shareLinks[platform];
          return (
            <a
              key={platform}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-12 h-12
                         bg-black/50 backdrop-blur-md border border-primary-dark/50
                         rounded-xl transition-all duration-300
                         hover:border-primary-accent hover:bg-primary-accent/10
                         hover:scale-110 hover:shadow-accent-glow"
              aria-label={`${t('blog_shareArticle')} ${label}`}
              title={label}
            >
              <span className="text-neutral/80 group-hover:text-primary-accent transition-colors duration-300">
                {icon}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ShareButtons;
