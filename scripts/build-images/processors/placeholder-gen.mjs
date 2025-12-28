/**
 * Image Build System - Placeholder Generator
 * ===========================================
 * Generate LQIP (Low Quality Image Placeholders) for progressive loading
 */

import sharp from 'sharp';
import { CONFIG } from '../config.mjs';

/**
 * Generate a LQIP (Low Quality Image Placeholder)
 * Creates a tiny, blurred version of the image as base64
 *
 * @param {string} inputPath - Path to source image
 * @returns {Promise<string>} Base64 data URL
 */
export async function generateLQIP(inputPath) {
  const { width, quality, blur, format } = CONFIG.placeholder;

  try {
    const buffer = await sharp(inputPath)
      .resize(width, null, { withoutEnlargement: true })
      .blur(blur)
      .toFormat(format, { quality })
      .toBuffer();

    return `data:image/${format};base64,${buffer.toString('base64')}`;
  } catch (error) {
    console.error(`Failed to generate LQIP for ${inputPath}:`, error.message);
    return null;
  }
}

/**
 * Generate a color placeholder
 * Extracts the dominant color from an image
 *
 * @param {string} inputPath - Path to source image
 * @returns {Promise<string>} Hex color code
 */
export async function generateColorPlaceholder(inputPath) {
  try {
    const { dominant } = await sharp(inputPath)
      .resize(1, 1)
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data }) => ({
        dominant: `#${data[0].toString(16).padStart(2, '0')}${data[1].toString(16).padStart(2, '0')}${data[2].toString(16).padStart(2, '0')}`,
      }));

    return dominant;
  } catch (error) {
    console.error(`Failed to extract dominant color for ${inputPath}:`, error.message);
    return '#111111'; // Default dark color
  }
}

/**
 * Generate a simple SVG placeholder
 * @param {number} width - Placeholder width
 * @param {number} height - Placeholder height
 * @param {string} color - Background color
 * @returns {string} Base64 data URL
 */
export function generateSvgPlaceholder(width, height, color = '#111') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${color}"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Generate all placeholder types for an image
 * @param {string} inputPath - Path to source image
 * @returns {Promise<Object>} Placeholder data
 */
export async function generatePlaceholders(inputPath) {
  const [lqip, dominantColor] = await Promise.all([
    generateLQIP(inputPath),
    generateColorPlaceholder(inputPath),
  ]);

  return {
    lqip,
    dominantColor,
    svg: generateSvgPlaceholder(400, 300, dominantColor),
  };
}

export default {
  generateLQIP,
  generateColorPlaceholder,
  generateSvgPlaceholder,
  generatePlaceholders,
};
