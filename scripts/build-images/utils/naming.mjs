/**
 * Image Build System - SEO Naming Utilities
 * ==========================================
 * Generate SEO-friendly filenames for images
 */

import { basename, extname } from 'path';
import { CONFIG } from '../config.mjs';

/**
 * Clean a string for use in URLs/filenames
 * @param {string} str - Input string
 * @returns {string} Cleaned string
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9-]/g, '-')     // Replace non-alphanumeric
    .replace(/-+/g, '-')              // Collapse multiple dashes
    .replace(/^-|-$/g, '');           // Trim dashes
}

/**
 * Generate SEO-friendly filename
 * Format: {class}-{descriptor}-barcelona-{size}.{format}
 *
 * @param {Object} options
 * @param {string} options.originalName - Original filename
 * @param {string} options.className - Dance class name
 * @param {number} options.width - Target width
 * @param {string} options.format - Output format (avif, webp, jpg)
 * @returns {string} SEO-optimized filename
 */
export function generateSeoFilename({ originalName, className, width, format }) {
  // Get base name without extension
  const base = basename(originalName, extname(originalName));

  // Clean the base name
  const cleanBase = slugify(base);

  // Get SEO keyword for class
  const seoKeyword = CONFIG.seoKeywords[className] || slugify(className);

  // Check if base already includes class reference and barcelona
  const hasClassRef = cleanBase.includes(slugify(className));
  const hasBarcelona = cleanBase.includes('barcelona');

  // Build the filename
  let name;
  if (hasClassRef && hasBarcelona) {
    // Already has class and barcelona, use as is
    name = cleanBase;
  } else if (hasClassRef) {
    // Has class but not barcelona
    name = `${cleanBase}-barcelona`;
  } else if (hasBarcelona) {
    // Has barcelona but not class
    name = `${seoKeyword}-${cleanBase}`;
  } else {
    // Has neither, add both
    name = `${seoKeyword}-${cleanBase}-barcelona`;
  }

  // Clean up double dashes and add size
  name = name.replace(/-+/g, '-');

  return `${name}_${width}.${format}`;
}

/**
 * Generate a base path for srcset generation
 * @param {Object} options
 * @param {string} options.originalName - Original filename
 * @param {string} options.className - Dance class name
 * @returns {string} Base path without size and extension
 */
export function generateBasePath({ originalName, className }) {
  const base = basename(originalName, extname(originalName));
  const cleanBase = slugify(base);
  const seoKeyword = CONFIG.seoKeywords[className] || slugify(className);

  const hasClassRef = cleanBase.includes(slugify(className));
  const hasBarcelona = cleanBase.includes('barcelona');

  let name;
  if (hasClassRef && hasBarcelona) {
    name = cleanBase;
  } else if (hasClassRef) {
    name = `${cleanBase}-barcelona`;
  } else if (hasBarcelona) {
    name = `${seoKeyword}-${cleanBase}`;
  } else {
    name = `${seoKeyword}-${cleanBase}-barcelona`;
  }

  return name.replace(/-+/g, '-');
}

/**
 * Generate manifest filename
 * @param {string} originalName - Original filename
 * @returns {string} Manifest filename
 */
export function generateManifestFilename(originalName) {
  const base = basename(originalName, extname(originalName));
  return `${slugify(base)}.json`;
}

/**
 * Parse a processed filename to extract metadata
 * @param {string} filename - Processed filename
 * @returns {Object} Parsed metadata
 */
export function parseFilename(filename) {
  const match = filename.match(/^(.+)_(\d+)\.(avif|webp|jpe?g|png)$/i);

  if (!match) {
    return null;
  }

  return {
    baseName: match[1],
    width: parseInt(match[2], 10),
    format: match[3].toLowerCase().replace('jpeg', 'jpg'),
  };
}

export default {
  slugify,
  generateSeoFilename,
  generateBasePath,
  generateManifestFilename,
  parseFilename,
};
