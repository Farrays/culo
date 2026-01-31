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
    'https://www.instagram.com/farrays_centerbcn/',
    'https://www.facebook.com/farrayscenter/',
  ],
};

/**
 * Mar Guerrero - Guest Author (Copywriter & Dance Enthusiast)
 *
 * Guest author for selected blog articles.
 * Professional copywriter and student at Farray's Center.
 */
export const AUTHOR_MAR_GUERRERO: AuthorConfig = {
  id: 'mar-guerrero',
  name: 'Mar Guerrero',
  roleKey: 'blog_authorRoleMar',
  bioKey: 'blog_authorBioMar',
  image: '/images/authors/mar-guerrero.webp',
  profileUrl: '/blog', // Links to blog since she's a guest author
  credentials: ['blog_credential_alumna'],
  sameAs: [],
};

/**
 * Daniel Sené - Ballet & Contemporary Dance Expert
 *
 * Guest author for ballet and classical dance articles.
 * Trained at the National School of Ballet of Cuba.
 */
export const AUTHOR_DANIEL_SENE: AuthorConfig = {
  id: 'daniel-sene',
  name: 'Daniel Sené',
  roleKey: 'blog_authorRoleDaniel',
  bioKey: 'blog_authorBioDaniel',
  image: '/images/teachers/img/profesor-daniel-sene_320.webp',
  imageSrcSet:
    '/images/teachers/img/profesor-daniel-sene_320.webp 320w, /images/teachers/img/profesor-daniel-sene_640.webp 640w',
  profileUrl: '/es/profesores-baile-barcelona',
  credentials: [
    'blog_credential_escuelaNacionalBallet',
    'blog_credential_balletContemporaneo',
    'blog_credential_yogaBailarines',
  ],
  sameAs: [],
};

/**
 * Alejandro Miñoso - Contemporary Dance & Modern Jazz Expert
 *
 * Guest author for contemporary dance and modern jazz articles.
 * Former dancer with Compañía Carlos Acosta, trained at ENA Cuba.
 */
export const AUTHOR_ALEJANDRO_MINOSO: AuthorConfig = {
  id: 'alejandro-minoso',
  name: 'Alejandro Miñoso',
  roleKey: 'blog_authorRoleAlejandro',
  bioKey: 'blog_authorBioAlejandro',
  image: '/images/teachers/img/profesor-alejandro-minoso_320.webp',
  imageSrcSet:
    '/images/teachers/img/profesor-alejandro-minoso_320.webp 320w, /images/teachers/img/profesor-alejandro-minoso_640.webp 640w',
  profileUrl: '/es/profesores-baile-barcelona',
  credentials: [
    'blog_credential_companiaCarlosAcosta',
    'blog_credential_enaCuba',
    'blog_credential_contemporaneoModernJazz',
  ],
  sameAs: [],
};

/**
 * Default author for all blog articles
 */
export const DEFAULT_AUTHOR = AUTHOR_YUNAISY;
