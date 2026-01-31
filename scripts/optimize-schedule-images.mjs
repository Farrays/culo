/**
 * Schedule Images Optimization Script - Enterprise Edition
 *
 * Generates responsive images in modern formats (AVIF, WebP, JPG)
 * for optimal performance across all browsers.
 *
 * Output formats:
 * - AVIF: Best compression (~30% smaller than WebP), Chrome/Firefox/Safari 16+
 * - WebP: Good compression, universal modern browser support
 * - JPG: Legacy browser fallback
 *
 * Also generates LQIP (Low Quality Image Placeholders) for blur effect.
 *
 * Usage: node scripts/optimize-schedule-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SOURCE_DIR = './public/images/horarios/sources';
const OUTPUT_DIR = './public/images/horarios';

// Image mapping: source filename -> base output name
const IMAGE_MAPPING = {
  'danza-2026-source.png': 'danza-2026',
  'morning-2026-source.png': 'morning-2026',
  'social-2026-source.png': 'social-2026',
  'urban-2026-source.png': 'urban-2026',
};

// Optimization config
const CONFIG = {
  responsive: [
    { suffix: '_320', width: 320 },
    { suffix: '_640', width: 640 },
    { suffix: '_1024', width: 1024 },
    { suffix: '_1440', width: 1440 },
    { suffix: '_1920', width: 1920 },
  ],
  formats: {
    avif: { quality: 70, effort: 4 }, // Higher quality for text readability
    webp: { quality: 88 }, // Higher quality for schedule details
    jpg: { quality: 90, mozjpeg: true }, // Highest quality for fallback
  },
  lqip: {
    width: 20,
    height: 15,
    blur: 5,
    quality: 20,
  },
};

async function optimizeScheduleImages() {
  console.log('='.repeat(65));
  console.log('  SCHEDULE IMAGE OPTIMIZATION - Enterprise Edition');
  console.log('  Formats: AVIF (best) + WebP (fallback) + JPG');
  console.log('='.repeat(65));
  console.log('');

  let totalSaved = 0;
  let processedCount = 0;
  const lqipPlaceholders = {};

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

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

    // Generate responsive images in AVIF, WebP, and JPG
    for (const size of CONFIG.responsive) {
      // AVIF (best compression, modern browsers)
      const avifPath = path.join(OUTPUT_DIR, `${outputBase}${size.suffix}.avif`);
      await sharp(sourcePath)
        .resize(size.width, null, { withoutEnlargement: true })
        .avif(CONFIG.formats.avif)
        .toFile(avifPath);
      const avifStats = await fs.stat(avifPath);

      // WebP (fallback for older browsers)
      const webpPath = path.join(OUTPUT_DIR, `${outputBase}${size.suffix}.webp`);
      await sharp(sourcePath)
        .resize(size.width, null, { withoutEnlargement: true })
        .webp(CONFIG.formats.webp)
        .toFile(webpPath);
      const webpStats = await fs.stat(webpPath);

      // JPG (legacy browser fallback)
      const jpgPath = path.join(OUTPUT_DIR, `${outputBase}${size.suffix}.jpg`);
      await sharp(sourcePath)
        .resize(size.width, null, { withoutEnlargement: true })
        .jpeg(CONFIG.formats.jpg)
        .toFile(jpgPath);
      const jpgStats = await fs.stat(jpgPath);

      const avifKB = (avifStats.size / 1024).toFixed(0);
      const webpKB = (webpStats.size / 1024).toFixed(0);
      const jpgKB = (jpgStats.size / 1024).toFixed(0);
      const savings = (((webpStats.size - avifStats.size) / webpStats.size) * 100).toFixed(0);
      console.log(`  -> ${outputBase}${size.suffix}: AVIF ${avifKB}KB | WebP ${webpKB}KB | JPG ${jpgKB}KB (AVIF ${savings}% smaller)`);
    }

    // Generate LQIP (Low Quality Image Placeholder) for blur effect
    const lqipBuffer = await sharp(sourcePath)
      .resize(CONFIG.lqip.width, CONFIG.lqip.height, { fit: 'cover' })
      .blur(CONFIG.lqip.blur)
      .webp({ quality: CONFIG.lqip.quality })
      .toBuffer();

    const lqipBase64 = `data:image/webp;base64,${lqipBuffer.toString('base64')}`;
    lqipPlaceholders[outputBase.replace('-2026', '')] = lqipBase64;
    console.log(`  -> LQIP: ${(lqipBuffer.length / 1024).toFixed(1)}KB (blur placeholder)`);

    processedCount++;
  }

  console.log('\n' + '='.repeat(65));
  console.log('  OPTIMIZATION COMPLETE');
  console.log('='.repeat(65));
  console.log(`  Images processed: ${processedCount}`);
  console.log(`  Total output files: ${processedCount * 15} (${processedCount} images × 5 sizes × 3 formats)`);
  console.log('');
  console.log('  Generated formats:');
  console.log('  - AVIF: Best compression, Chrome 85+, Firefox 93+, Safari 16+');
  console.log('  - WebP: Fallback, all modern browsers');
  console.log('  - JPG:  Legacy browser fallback');
  console.log('  - LQIP: Blur placeholders for instant loading feedback');
  console.log('='.repeat(65));

  // Output LQIP placeholders for copy-paste
  console.log('\n' + '='.repeat(65));
  console.log('  LQIP PLACEHOLDERS (copy to constants/schedule-image-placeholders.ts)');
  console.log('='.repeat(65));
  console.log('');
  console.log('export const SCHEDULE_BLUR_PLACEHOLDERS = {');
  for (const [key, value] of Object.entries(lqipPlaceholders)) {
    console.log(`  ${key}: '${value.substring(0, 80)}...',`);
  }
  console.log('};');
  console.log('');
  console.log('  ⚠️  Full base64 strings truncated above for readability.');
  console.log('  ⚠️  Copy the full output to schedule-image-placeholders.ts');
  console.log('='.repeat(65));

  // Write full LQIP placeholders to a file
  const placeholdersContent = `// Auto-generated LQIP placeholders for schedule images
// Generated by scripts/optimize-schedule-images.mjs
// Do not edit manually

export const SCHEDULE_BLUR_PLACEHOLDERS = {
${Object.entries(lqipPlaceholders)
  .map(([key, value]) => `  ${key}: '${value}',`)
  .join('\n')}
};
`;

  const placeholdersPath = './constants/schedule-image-placeholders.ts';
  await fs.writeFile(placeholdersPath, placeholdersContent);
  console.log(`\n✅ LQIP placeholders written to: ${placeholdersPath}`);
}

optimizeScheduleImages().catch(console.error);
