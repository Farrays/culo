/**
 * Blog Image Optimization Script - Enterprise Edition
 *
 * Generates responsive images in modern formats (AVIF, WebP, JPG)
 * for optimal performance across all browsers.
 *
 * Output formats:
 * - AVIF: Best compression (~30% smaller than WebP), Chrome/Firefox/Safari 16+
 * - WebP: Good compression, universal modern browser support
 * - JPG: Fallback for OG images (social crawlers)
 *
 * Usage: node scripts/optimize-blog-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SOURCE_DIR = './public/images/blog';
const OUTPUT_BASE = './public/images/blog';

// Image mapping: source filename -> article folder
const IMAGE_MAPPING = {
  'Beneficios de Bailar Salsa.jpg': 'beneficios-salsa',
  'Clases de Baile Para Principiantes.jpg': 'clases-principiantes',
  'Como Perder el miedo al Bailar.jpg': 'como-perder-miedo',
  'Hablemos Salsa.jpg': 'hablemos-salsa',
  'Historia de la Bachata.jpg': 'historia-bachata',
  'Historia de la Salsa 1.jpg': 'historia-salsa',
  'Salsa El Ritmo que conquistó el mundo.jpg': 'salsa-ritmo',
  'Salsa Vs Bachata.jpg': 'salsa-vs-bachata',
};

// Optimization config
const CONFIG = {
  responsive: [
    { suffix: '-480', width: 480 },
    { suffix: '-960', width: 960 },
    { suffix: '', width: 1200 },
  ],
  formats: {
    avif: { quality: 65, effort: 4 }, // AVIF: best compression
    webp: { quality: 82 }, // WebP: good balance
    jpg: { quality: 85, mozjpeg: true }, // JPG: fallback
  },
  og: {
    width: 1200,
    height: 630,
  },
};

async function optimizeBlogImages() {
  console.log('='.repeat(65));
  console.log('  BLOG IMAGE OPTIMIZATION - Enterprise Edition v2.0');
  console.log('  Formats: AVIF (best) + WebP (fallback) + JPG (OG)');
  console.log('='.repeat(65));
  console.log('');

  let totalSaved = 0;
  let processedCount = 0;

  for (const [sourceFile, outputFolder] of Object.entries(IMAGE_MAPPING)) {
    const sourcePath = path.join(SOURCE_DIR, sourceFile);

    // Check if source exists
    try {
      await fs.access(sourcePath);
    } catch {
      console.log(`[SKIP] ${sourceFile} - not found`);
      continue;
    }

    const outputDir = path.join(OUTPUT_BASE, outputFolder);
    await fs.mkdir(outputDir, { recursive: true });

    console.log(`\n[PROCESS] ${sourceFile}`);
    console.log(`  -> ${outputFolder}/`);

    const stats = await fs.stat(sourcePath);
    const originalMB = stats.size / (1024 * 1024);
    console.log(`  Original: ${originalMB.toFixed(2)} MB`);

    // Generate responsive images in AVIF and WebP
    for (const size of CONFIG.responsive) {
      // AVIF (best compression, modern browsers)
      const avifPath = path.join(outputDir, `hero${size.suffix}.avif`);
      await sharp(sourcePath)
        .resize(size.width, null, { withoutEnlargement: true, fit: 'cover' })
        .avif(CONFIG.formats.avif)
        .toFile(avifPath);
      const avifStats = await fs.stat(avifPath);

      // WebP (fallback for older browsers)
      const webpPath = path.join(outputDir, `hero${size.suffix}.webp`);
      await sharp(sourcePath)
        .resize(size.width, null, { withoutEnlargement: true, fit: 'cover' })
        .webp(CONFIG.formats.webp)
        .toFile(webpPath);
      const webpStats = await fs.stat(webpPath);

      if (size.suffix === '') {
        totalSaved += originalMB - webpStats.size / (1024 * 1024);
      }

      const avifKB = (avifStats.size / 1024).toFixed(0);
      const webpKB = (webpStats.size / 1024).toFixed(0);
      const savings = (((webpStats.size - avifStats.size) / webpStats.size) * 100).toFixed(0);
      console.log(`  -> hero${size.suffix}: AVIF ${avifKB}KB | WebP ${webpKB}KB (AVIF ${savings}% smaller)`);
    }

    // Generate OG images (1200x630 cropped)
    // AVIF for modern platforms
    const ogAvifPath = path.join(outputDir, 'og.avif');
    await sharp(sourcePath)
      .resize(CONFIG.og.width, CONFIG.og.height, { fit: 'cover', position: 'center' })
      .avif(CONFIG.formats.avif)
      .toFile(ogAvifPath);

    // WebP for compatibility
    const ogWebpPath = path.join(outputDir, 'og.webp');
    await sharp(sourcePath)
      .resize(CONFIG.og.width, CONFIG.og.height, { fit: 'cover', position: 'center' })
      .webp(CONFIG.formats.webp)
      .toFile(ogWebpPath);

    // JPG for social crawlers (required for some platforms)
    const ogJpgPath = path.join(outputDir, 'og.jpg');
    await sharp(sourcePath)
      .resize(CONFIG.og.width, CONFIG.og.height, { fit: 'cover', position: 'center' })
      .jpeg(CONFIG.formats.jpg)
      .toFile(ogJpgPath);

    const ogAvifStats = await fs.stat(ogAvifPath);
    const ogJpgStats = await fs.stat(ogJpgPath);
    console.log(`  -> OG: AVIF ${(ogAvifStats.size / 1024).toFixed(0)}KB | JPG ${(ogJpgStats.size / 1024).toFixed(0)}KB`);

    processedCount++;
  }

  console.log('\n' + '='.repeat(65));
  console.log('  OPTIMIZATION COMPLETE');
  console.log('='.repeat(65));
  console.log(`  Images processed: ${processedCount}`);
  console.log(`  Total space saved: ~${totalSaved.toFixed(2)} MB`);
  console.log('');
  console.log('  Generated formats:');
  console.log('  - AVIF: Best compression, Chrome 85+, Firefox 93+, Safari 16+');
  console.log('  - WebP: Fallback, all modern browsers');
  console.log('  - JPG:  OG images for social media crawlers');
  console.log('='.repeat(65));
}

optimizeBlogImages().catch(console.error);
