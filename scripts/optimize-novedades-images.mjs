/**
 * Novedades Image Optimization Script - Enterprise Edition
 *
 * Generates responsive images in modern formats (AVIF, WebP, JPG)
 * for the Novedades carousel.
 *
 * Usage: node scripts/optimize-novedades-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SOURCE_DIR = './public/images/novedades/img';
const OUTPUT_DIR = './public/images/novedades/img';

// Image mapping: source filename -> output base name
const IMAGE_MAPPING = {
  'inscripciones-abiertas-2026.jpg': 'inscripciones-abiertas-2026',
};

// Optimization config
const CONFIG = {
  responsive: [
    { suffix: '_320', width: 320 },
    { suffix: '_640', width: 640 },
    { suffix: '_768', width: 768 },
    { suffix: '_1024', width: 1024 },
  ],
  formats: {
    avif: { quality: 65, effort: 4 },
    webp: { quality: 82 },
    jpg: { quality: 85, mozjpeg: true },
  },
};

async function optimizeNovedadesImages() {
  console.log('='.repeat(65));
  console.log('  NOVEDADES IMAGE OPTIMIZATION - Enterprise Edition');
  console.log('  Formats: AVIF (best) + WebP (fallback) + JPG (legacy)');
  console.log('='.repeat(65));
  console.log('');

  let totalSaved = 0;
  let processedCount = 0;

  for (const [sourceFile, outputBase] of Object.entries(IMAGE_MAPPING)) {
    const sourcePath = path.join(SOURCE_DIR, sourceFile);

    // Check if source exists
    try {
      await fs.access(sourcePath);
    } catch {
      console.log(`[SKIP] ${sourceFile} - not found`);
      continue;
    }

    console.log(`\n[PROCESS] ${sourceFile}`);

    const stats = await fs.stat(sourcePath);
    const originalMB = stats.size / (1024 * 1024);
    console.log(`  Original: ${originalMB.toFixed(2)} MB`);

    // Generate responsive images in all formats
    for (const size of CONFIG.responsive) {
      const baseName = `${outputBase}${size.suffix}`;

      // AVIF
      const avifPath = path.join(OUTPUT_DIR, `${baseName}.avif`);
      await sharp(sourcePath)
        .resize(size.width, null, { withoutEnlargement: true, fit: 'inside' })
        .avif(CONFIG.formats.avif)
        .toFile(avifPath);
      const avifStats = await fs.stat(avifPath);

      // WebP
      const webpPath = path.join(OUTPUT_DIR, `${baseName}.webp`);
      await sharp(sourcePath)
        .resize(size.width, null, { withoutEnlargement: true, fit: 'inside' })
        .webp(CONFIG.formats.webp)
        .toFile(webpPath);
      const webpStats = await fs.stat(webpPath);

      // JPG
      const jpgPath = path.join(OUTPUT_DIR, `${baseName}.jpg`);
      await sharp(sourcePath)
        .resize(size.width, null, { withoutEnlargement: true, fit: 'inside' })
        .jpeg(CONFIG.formats.jpg)
        .toFile(jpgPath);
      const jpgStats = await fs.stat(jpgPath);

      const avifKB = (avifStats.size / 1024).toFixed(0);
      const webpKB = (webpStats.size / 1024).toFixed(0);
      const jpgKB = (jpgStats.size / 1024).toFixed(0);
      console.log(`  -> ${size.width}px: AVIF ${avifKB}KB | WebP ${webpKB}KB | JPG ${jpgKB}KB`);

      if (size.suffix === '_1024') {
        totalSaved += originalMB - webpStats.size / (1024 * 1024);
      }
    }

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
  console.log('  - JPG:  Legacy fallback');
  console.log('='.repeat(65));
}

optimizeNovedadesImages().catch(console.error);
