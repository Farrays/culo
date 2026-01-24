/**
 * Clases de Baile Barcelona Hero Image Optimization Script - Enterprise Edition
 *
 * Generates responsive hero images and OG images in modern formats (AVIF, WebP, JPG)
 * for optimal performance across all browsers and social media platforms.
 *
 * Output formats:
 * - AVIF: Best compression (~30% smaller than WebP), Chrome/Firefox/Safari 16+
 * - WebP: Good compression, universal modern browser support
 * - JPG: Fallback and OG images (social crawlers require JPG)
 *
 * Usage: node scripts/optimize-clases-baile-barcelona-hero.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

// Source image
const SOURCE_IMAGE = './public/images/nuevos/clases de baile barcelona.jpg';

// Output directories (following enterprise pattern)
const OUTPUT_DIR_HERO = './public/images/categories/hero';
const OUTPUT_DIR_OG = './public/images';

// Image base name (SEO-optimized filename)
const IMAGE_BASE_NAME = 'clases-baile-barcelona-hero';

// Optimization config - Enterprise Level
const CONFIG = {
  // Responsive breakpoints for hero images
  hero: {
    breakpoints: [
      { width: 320, suffix: '_320' },
      { width: 640, suffix: '_640' },
      { width: 768, suffix: '_768' },
      { width: 1024, suffix: '_1024' },
      { width: 1440, suffix: '_1440' },
      { width: 1920, suffix: '_1920' },
    ],
    formats: {
      avif: { quality: 60, effort: 6 }, // Higher effort for better compression
      webp: { quality: 80 },
      jpg: { quality: 85, mozjpeg: true },
    },
  },
  // OG image for social media (1200x630 standard)
  og: {
    width: 1200,
    height: 630,
    formats: {
      avif: { quality: 65, effort: 4 },
      webp: { quality: 82 },
      jpg: { quality: 88, mozjpeg: true }, // Higher quality for social previews
    },
  },
};

async function getImageMetadata(imagePath) {
  const metadata = await sharp(imagePath).metadata();
  return metadata;
}

async function optimizeClasesBaileBarcelonaHero() {
  console.log('='.repeat(70));
  console.log('  CLASES DE BAILE BARCELONA HERO IMAGE OPTIMIZATION - Enterprise Edition');
  console.log('  Formats: AVIF (best) + WebP (fallback) + JPG (OG/legacy)');
  console.log('='.repeat(70));
  console.log('');

  // Check source image exists
  try {
    await fs.access(SOURCE_IMAGE);
  } catch {
    console.error(`[ERROR] Source image not found: ${SOURCE_IMAGE}`);
    process.exit(1);
  }

  // Get source image info
  const stats = await fs.stat(SOURCE_IMAGE);
  const metadata = await getImageMetadata(SOURCE_IMAGE);
  const originalMB = stats.size / (1024 * 1024);

  console.log('[SOURCE IMAGE]');
  console.log(`  Path: ${SOURCE_IMAGE}`);
  console.log(`  Size: ${originalMB.toFixed(2)} MB`);
  console.log(`  Dimensions: ${metadata.width}x${metadata.height}`);
  console.log(`  Format: ${metadata.format}`);
  console.log('');

  // Create output directories
  await fs.mkdir(OUTPUT_DIR_HERO, { recursive: true });

  let totalOutputSize = 0;

  // ==========================================================================
  // GENERATE HERO IMAGES (Responsive)
  // ==========================================================================
  console.log('[GENERATING HERO IMAGES]');
  console.log(`  Output: ${OUTPUT_DIR_HERO}/${IMAGE_BASE_NAME}_*`);
  console.log('');

  for (const bp of CONFIG.hero.breakpoints) {
    const results = {};

    // AVIF - Best compression
    const avifPath = path.join(OUTPUT_DIR_HERO, `${IMAGE_BASE_NAME}${bp.suffix}.avif`);
    await sharp(SOURCE_IMAGE)
      .resize(bp.width, null, { withoutEnlargement: true, fit: 'cover' })
      .avif(CONFIG.hero.formats.avif)
      .toFile(avifPath);
    const avifStats = await fs.stat(avifPath);
    results.avif = avifStats.size;

    // WebP - Good fallback
    const webpPath = path.join(OUTPUT_DIR_HERO, `${IMAGE_BASE_NAME}${bp.suffix}.webp`);
    await sharp(SOURCE_IMAGE)
      .resize(bp.width, null, { withoutEnlargement: true, fit: 'cover' })
      .webp(CONFIG.hero.formats.webp)
      .toFile(webpPath);
    const webpStats = await fs.stat(webpPath);
    results.webp = webpStats.size;

    // JPG - Legacy fallback
    const jpgPath = path.join(OUTPUT_DIR_HERO, `${IMAGE_BASE_NAME}${bp.suffix}.jpg`);
    await sharp(SOURCE_IMAGE)
      .resize(bp.width, null, { withoutEnlargement: true, fit: 'cover' })
      .jpeg(CONFIG.hero.formats.jpg)
      .toFile(jpgPath);
    const jpgStats = await fs.stat(jpgPath);
    results.jpg = jpgStats.size;

    totalOutputSize += results.avif + results.webp + results.jpg;

    const avifKB = (results.avif / 1024).toFixed(0);
    const webpKB = (results.webp / 1024).toFixed(0);
    const jpgKB = (results.jpg / 1024).toFixed(0);
    const savings = (((results.webp - results.avif) / results.webp) * 100).toFixed(0);

    console.log(`  ${bp.width}px: AVIF ${avifKB}KB | WebP ${webpKB}KB | JPG ${jpgKB}KB (AVIF ${savings}% smaller)`);
  }

  // ==========================================================================
  // GENERATE OG IMAGE (Social Media)
  // ==========================================================================
  console.log('');
  console.log('[GENERATING OG IMAGE]');
  console.log(`  Size: ${CONFIG.og.width}x${CONFIG.og.height} (Facebook/Twitter/LinkedIn standard)`);
  console.log('');

  // OG AVIF
  const ogAvifPath = path.join(OUTPUT_DIR_OG, `og-clases-baile-barcelona.avif`);
  await sharp(SOURCE_IMAGE)
    .resize(CONFIG.og.width, CONFIG.og.height, { fit: 'cover', position: 'center' })
    .avif(CONFIG.og.formats.avif)
    .toFile(ogAvifPath);
  const ogAvifStats = await fs.stat(ogAvifPath);

  // OG WebP
  const ogWebpPath = path.join(OUTPUT_DIR_OG, `og-clases-baile-barcelona.webp`);
  await sharp(SOURCE_IMAGE)
    .resize(CONFIG.og.width, CONFIG.og.height, { fit: 'cover', position: 'center' })
    .webp(CONFIG.og.formats.webp)
    .toFile(ogWebpPath);
  const ogWebpStats = await fs.stat(ogWebpPath);

  // OG JPG - Required for social crawlers (Facebook, Twitter, LinkedIn)
  const ogJpgPath = path.join(OUTPUT_DIR_OG, `og-clases-baile-barcelona.jpg`);
  await sharp(SOURCE_IMAGE)
    .resize(CONFIG.og.width, CONFIG.og.height, { fit: 'cover', position: 'center' })
    .jpeg(CONFIG.og.formats.jpg)
    .toFile(ogJpgPath);
  const ogJpgStats = await fs.stat(ogJpgPath);

  totalOutputSize += ogAvifStats.size + ogWebpStats.size + ogJpgStats.size;

  console.log(`  OG: AVIF ${(ogAvifStats.size / 1024).toFixed(0)}KB | WebP ${(ogWebpStats.size / 1024).toFixed(0)}KB | JPG ${(ogJpgStats.size / 1024).toFixed(0)}KB`);

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  const totalOutputMB = totalOutputSize / (1024 * 1024);
  const compressionRatio = ((1 - totalOutputMB / originalMB) * 100).toFixed(1);

  console.log('');
  console.log('='.repeat(70));
  console.log('  OPTIMIZATION COMPLETE');
  console.log('='.repeat(70));
  console.log(`  Original: ${originalMB.toFixed(2)} MB`);
  console.log(`  Total output: ${totalOutputMB.toFixed(2)} MB (all sizes & formats)`);
  console.log(`  Overall compression: ${compressionRatio}%`);
  console.log('');
  console.log('  Generated files:');
  console.log(`  - Hero: ${OUTPUT_DIR_HERO}/${IMAGE_BASE_NAME}_*.{avif,webp,jpg}`);
  console.log(`  - OG: ${OUTPUT_DIR_OG}/og-clases-baile-barcelona.{avif,webp,jpg}`);
  console.log('');
  console.log('  Format support:');
  console.log('  - AVIF: Chrome 85+, Firefox 93+, Safari 16+, Edge 121+');
  console.log('  - WebP: All modern browsers (97%+ global support)');
  console.log('  - JPG:  Universal fallback & social media crawlers');
  console.log('='.repeat(70));
  console.log('');
  console.log('  Configuration for DanceClassesPage.tsx:');
  console.log(`  heroImage={{
    basePath: '/images/categories/hero/${IMAGE_BASE_NAME}',
    altKey: 'alt_hero_clases_baile_barcelona',
    altFallback: 'Clases de baile Barcelona...',
    objectPosition: 'center 35%',
    opacity: 100,
  }}`);
  console.log('='.repeat(70));
}

optimizeClasesBaileBarcelonaHero().catch(console.error);
