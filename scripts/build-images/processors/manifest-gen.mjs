/**
 * Image Build System - Manifest Generator
 * ========================================
 * Generate JSON manifests with image metadata for components
 */

import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { dirname, join, basename, extname } from 'path';
import { CONFIG } from '../config.mjs';
import { generateManifestFilename, generateBasePath } from '../utils/naming.mjs';

/**
 * Get metadata from an image
 * @param {string} inputPath - Path to source image
 * @returns {Promise<Object>} Image metadata
 */
export async function getImageMetadata(inputPath) {
  const metadata = await sharp(inputPath).metadata();

  return {
    width: metadata.width,
    height: metadata.height,
    aspectRatio: (metadata.width / metadata.height).toFixed(4),
    format: metadata.format,
    space: metadata.space,
    channels: metadata.channels,
    hasAlpha: metadata.hasAlpha,
    orientation: metadata.orientation,
  };
}

/**
 * Generate a manifest for a processed image
 * @param {Object} options
 * @param {string} options.inputPath - Original image path
 * @param {string} options.className - Dance class name
 * @param {Array} options.outputs - Generated output files
 * @param {Object} options.placeholders - Placeholder data
 * @param {string} options.outputDir - Manifest output directory
 * @returns {Promise<Object>} Generated manifest
 */
export async function generateManifest({
  inputPath,
  className,
  outputs,
  placeholders,
  outputDir,
}) {
  const metadata = await getImageMetadata(inputPath);
  const originalName = basename(inputPath);
  const basePath = generateBasePath({ originalName, className });

  const manifest = {
    // Identification
    id: generateManifestFilename(originalName).replace('.json', ''),
    className,
    originalFile: originalName,

    // Original image metadata
    original: metadata,

    // Placeholders for progressive loading
    placeholder: {
      lqip: placeholders.lqip,
      dominantColor: placeholders.dominantColor,
      svg: placeholders.svg,
    },

    // Base path for srcset generation (without size and extension)
    basePath: `/images/classes/${className}/img/${basePath}`,

    // All generated variants
    variants: outputs.map((output) => ({
      width: output.width,
      height: output.height,
      format: output.format,
      path: output.path,
      size: output.size,
    })),

    // Grouped by format for <picture> element
    srcSets: {
      avif: outputs
        .filter((o) => o.format === 'avif')
        .map((o) => `${o.path} ${o.width}w`)
        .join(', '),
      webp: outputs
        .filter((o) => o.format === 'webp')
        .map((o) => `${o.path} ${o.width}w`)
        .join(', '),
      jpeg: outputs
        .filter((o) => o.format === 'jpeg' || o.format === 'jpg')
        .map((o) => `${o.path} ${o.width}w`)
        .join(', '),
    },

    // Default src (medium size JPEG)
    defaultSrc: outputs.find((o) => o.format === 'jpeg' && o.width === 640)?.path ||
                outputs.find((o) => o.format === 'jpeg')?.path ||
                outputs[0]?.path,

    // Generation metadata
    generated: {
      at: new Date().toISOString(),
      version: CONFIG.version,
    },
  };

  // Write manifest file
  const manifestFilename = generateManifestFilename(originalName);
  const manifestPath = join(outputDir, manifestFilename);

  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2));

  return {
    manifest,
    path: manifestPath,
  };
}

/**
 * Generate a summary manifest for all images in a class
 * @param {string} className - Dance class name
 * @param {Array} manifests - Array of individual manifests
 * @returns {Object} Summary manifest
 */
export function generateClassSummary(className, manifests) {
  return {
    className,
    imageCount: manifests.length,
    images: manifests.map((m) => ({
      id: m.id,
      basePath: m.basePath,
      defaultSrc: m.defaultSrc,
      aspectRatio: m.original.aspectRatio,
    })),
    generated: new Date().toISOString(),
  };
}

export default {
  getImageMetadata,
  generateManifest,
  generateClassSummary,
};
