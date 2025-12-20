/**
 * Blog Author Configuration
 *
 * Defines the author(s) for blog articles.
 * Currently only Yunaisy Farray is configured as the sole author
 * to maximize E-E-A-T signals.
 */

import type { AuthorConfig } from './types';

/**
 * Yunaisy Farray - Founder & Director of FIDC
 *
 * Primary author for all blog content.
 * Links to her existing profile page at /yunaisy-farray
 */
export const AUTHOR_YUNAISY: AuthorConfig = {
  id: 'yunaisy-farray',
  name: 'Yunaisy Farray',
  roleKey: 'blog_authorRole',
  bioKey: 'blog_authorBio',
  image: '/images/teachers/yunaisy-farray.webp',
  imageSrcSet:
    '/images/teachers/yunaisy-farray-96.webp 96w, /images/teachers/yunaisy-farray-192.webp 192w',
  profileUrl: '/yunaisy-farray',
  credentials: [
    'CID-UNESCO',
    'blog_credential_specialization',
    'blog_credential_experience',
    'blog_credential_founder',
  ],
  sameAs: [
    'https://www.instagram.com/farrays_international_dance/',
    'https://www.facebook.com/farraysinternationaldancecenter',
  ],
};

/**
 * Default author for all blog articles
 */
export const DEFAULT_AUTHOR = AUTHOR_YUNAISY;
