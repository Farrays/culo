#!/usr/bin/env node

/**
 * Generate placeholder OG images
 * Dimensions: 1200x630px (Open Graph standard)
 *
 * Run: node scripts/generate-og-placeholders.mjs
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public', 'images');

// OG Image specifications
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Brand colors (from your Tailwind config)
const BRAND_COLORS = {
  black: '#000000',
  primaryAccent: '#FF4E88', // Your primary accent color
  primaryDark: '#1A1A1A',
  neutral: '#FFFFFF',
};

/**
 * Create a simple OG placeholder image
 */
async function createOGPlaceholder(filename, title, subtitle, bgColor = BRAND_COLORS.black) {
  const outputPath = path.join(publicDir, filename);

  console.log(`Creating placeholder: ${filename}...`);

  try {
    // Create SVG text
    const svg = `
      <svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="${bgColor}"/>

        <!-- Gradient overlay -->
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${BRAND_COLORS.primaryAccent};stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:${BRAND_COLORS.black};stop-opacity:0.8" />
          </linearGradient>
        </defs>
        <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="url(#grad)"/>

        <!-- Logo/Brand text (top) -->
        <text
          x="600"
          y="150"
          font-family="Arial, sans-serif"
          font-size="32"
          font-weight="bold"
          fill="${BRAND_COLORS.primaryAccent}"
          text-anchor="middle"
        >
          FarRays Center
        </text>

        <!-- Main title -->
        <text
          x="600"
          y="300"
          font-family="Arial, sans-serif"
          font-size="60"
          font-weight="900"
          fill="${BRAND_COLORS.neutral}"
          text-anchor="middle"
        >
          ${escapeXml(title)}
        </text>

        <!-- Subtitle -->
        <text
          x="600"
          y="380"
          font-family="Arial, sans-serif"
          font-size="36"
          font-weight="400"
          fill="${BRAND_COLORS.neutral}"
          fill-opacity="0.8"
          text-anchor="middle"
        >
          ${escapeXml(subtitle)}
        </text>

        <!-- Bottom line -->
        <rect x="400" y="500" width="400" height="4" fill="${BRAND_COLORS.primaryAccent}"/>

        <!-- Location -->
        <text
          x="600"
          y="560"
          font-family="Arial, sans-serif"
          font-size="28"
          font-weight="300"
          fill="${BRAND_COLORS.neutral}"
          fill-opacity="0.6"
          text-anchor="middle"
        >
          Barcelona
        </text>
      </svg>
    `;

    // Convert SVG to JPG using sharp
    // eslint-disable-next-line no-undef
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 85, progressive: true })
      .toFile(outputPath);

    console.log(`✅ Created: ${outputPath}`);

    // Check file size
    const stats = fs.statSync(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   Size: ${sizeKB} KB`);

  } catch (error) {
    console.error(`❌ Error creating ${filename}:`, error.message);
  }
}

/**
 * Escape XML special characters
 */
function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Generating OG placeholder images...\n');

  // Check if output directory exists
  if (!fs.existsSync(publicDir)) {
    console.error(`❌ Directory not found: ${publicDir}`);
    process.exit(1);
  }

  // Generate placeholders
  await createOGPlaceholder(
    'og-home.jpg',
    'Escuela de Baile',
    'Baile Urbano en Barcelona'
  );

  await createOGPlaceholder(
    'og-classes.jpg',
    'Nuestras Clases',
    'Todos los Estilos'
  );

  await createOGPlaceholder(
    'og-dancehall.jpg',
    'Dancehall',
    'Clases en Barcelona'
  );

  await createOGPlaceholder(
    'og-image.jpg',
    'FarRays Center',
    'Dance School Barcelona'
  );

  // Optional: Create Twitter image (same as og-image)
  console.log('\n📋 Copying og-image.jpg to twitter-image.jpg...');
  const ogImagePath = path.join(publicDir, 'og-image.jpg');
  const twitterImagePath = path.join(publicDir, 'twitter-image.jpg');
  fs.copyFileSync(ogImagePath, twitterImagePath);
  console.log('✅ Created: twitter-image.jpg');

  console.log('\n✨ Done! All OG placeholder images created.');
  console.log('\n⚠️  IMPORTANT: These are TEMPORARY placeholders.');
  console.log('   Replace them with professional designs using Canva, Figma, or Photoshop.');
  console.log('   See /docs/OG_IMAGES_NEEDED.md for specifications.\n');
}

main().catch(console.error);
