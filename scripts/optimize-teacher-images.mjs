/**
 * Teacher Image Optimization Script - Enterprise Edition
 *
 * Generates responsive square teacher portraits in modern formats (AVIF, WebP, JPG)
 * for optimal performance across all browsers.
 *
 * Output formats:
 * - AVIF: Best compression (~30% smaller than WebP), Chrome 85+/Firefox 93+/Safari 16+
 * - WebP: Good compression, universal modern browser support
 * - JPG: Fallback for older browsers
 *
 * Quality settings (higher than blog due to portrait importance):
 * - AVIF: quality 75, effort 4
 * - WebP: quality 85
 * - JPG:  quality 85, mozjpeg enabled
 *
 * Usage: node scripts/optimize-teacher-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SOURCE_DIR = './public/images/teachers/raw';
const OUTPUT_DIR = './public/images/teachers/img';

// Filename mapping: RAW source -> normalized output base name
// Note: Source filenames have accents/spaces, output normalized
const FILENAME_MAPPING = {
  // === PROCESAR (15 profesores existentes) ===
  'Profesor Alejandro Minoso.png': 'profesor-alejandro-minoso',
  'Profesor Carlos Canto.png': 'profesor-carlos-canto',
  'Profesor Daniel Sene.png': 'profesor-daniel-sene',
  'Profesor Iroel Bastarreche.png': 'profesor-iroel-bastarreche',
  'Profesor Juan Alvarez.png': 'profesor-juan-alvarez',
  'Profesor Marcos Martinez.png': 'profesor-marcos-martinez',
  'Profesor Mathias Font.png': 'profesor-mathias-font',
  'Profesor Redblueh.png': 'profesor-redbhlue', // Note: ID is 'redbhlue' without 'e'
  'Profesora CrisAg.png': 'profesora-crisag',
  'Profesora Eugenia Trujillo.png': 'profesora-eugenia-trujillo',
  'Profesora Greechen Mendez.png': 'profesora-greechen-mendez', // Note: double 'e'
  'Profesora Isabel Lopez.png': 'profesora-isabel-lopez',
  'Profesora Lia Valdes.png': 'profesora-lia-valdes',
  'Profesora Noemie Guerin.png': 'profesora-noemie-guerin', // Note: with 'e' at end
  'Profesora Sandra Gomez.png': 'profesora-sandra-gomez',
  'Profesora Yasmina Fernandez.png': 'profesora-yasmina-fernandez',

  // === AGREGAR (Charlie Breezy nuevo RAW) ===
  'Profesor Charlie Breezzy.png': 'profesor-charlie-breezy', // Note: 3 'z' in RAW filename

  // === EXCLUIR (Yunaisy Farray - mantener existentes) ===
  // 'Maestra Yunaisy Farray.png': 'maestra-yunaisy-farray', // NOT PROCESSED
};

// Teacher portrait sizes (square crops)
const TEACHER_SIZES = [320, 640, 960];

// Optimization config (higher quality for portraits)
const FORMATS = {
  avif: { quality: 75, effort: 4 }, // Excellent compression with high quality
  webp: { quality: 85 }, // Very high quality for portraits
  jpg: { quality: 85, mozjpeg: true }, // High quality fallback
};

/**
 * Process a single teacher image: generate 3 sizes × 3 formats = 9 files
 */
async function processTeacherImage(sourceFile, outputBaseName) {
  const sourcePath = path.join(SOURCE_DIR, sourceFile);

  // Check if source exists
  try {
    await fs.access(sourcePath);
  } catch {
    console.log(`  [ERROR] ${sourceFile} - not found in ${SOURCE_DIR}`);
    return null;
  }

  console.log(`\n[PROCESSING] ${sourceFile}`);
  console.log(`  -> Output: ${outputBaseName}_*.{avif,webp,jpg}`);

  const stats = await fs.stat(sourcePath);
  const originalKB = stats.size / 1024;
  console.log(`  Original: ${originalKB.toFixed(0)} KB`);

  let totalAVIF = 0;
  let totalWebP = 0;
  let totalJPG = 0;

  // Generate 3 sizes × 3 formats = 9 files per teacher
  for (const size of TEACHER_SIZES) {
    // AVIF (best compression, modern browsers)
    const avifPath = path.join(OUTPUT_DIR, `${outputBaseName}_${size}.avif`);
    await sharp(sourcePath)
      .resize(size, size, { fit: 'cover', position: 'north' }) // Square crop, face-focused
      .avif(FORMATS.avif)
      .toFile(avifPath);
    const avifStats = await fs.stat(avifPath);
    totalAVIF += avifStats.size;

    // WebP (universal modern support)
    const webpPath = path.join(OUTPUT_DIR, `${outputBaseName}_${size}.webp`);
    await sharp(sourcePath)
      .resize(size, size, { fit: 'cover', position: 'north' })
      .webp(FORMATS.webp)
      .toFile(webpPath);
    const webpStats = await fs.stat(webpPath);
    totalWebP += webpStats.size;

    // JPG (fallback for older browsers)
    const jpgPath = path.join(OUTPUT_DIR, `${outputBaseName}_${size}.jpg`);
    await sharp(sourcePath)
      .resize(size, size, { fit: 'cover', position: 'north' })
      .jpeg(FORMATS.jpg)
      .toFile(jpgPath);
    const jpgStats = await fs.stat(jpgPath);
    totalJPG += jpgStats.size;

    const avifKB = (avifStats.size / 1024).toFixed(0);
    const webpKB = (webpStats.size / 1024).toFixed(0);
    const jpgKB = (jpgStats.size / 1024).toFixed(0);
    const avifVsWebp = (((webpStats.size - avifStats.size) / webpStats.size) * 100).toFixed(0);
    const avifVsJpg = (((jpgStats.size - avifStats.size) / jpgStats.size) * 100).toFixed(0);

    console.log(
      `    ${size}px: AVIF ${avifKB}KB | WebP ${webpKB}KB | JPG ${jpgKB}KB (AVIF: ${avifVsWebp}% vs WebP, ${avifVsJpg}% vs JPG)`
    );
  }

  const totalMB = ((totalAVIF + totalWebP + totalJPG) / (1024 * 1024)).toFixed(2);
  console.log(`  Total output: ${totalMB} MB (9 files)`);

  return {
    teacher: outputBaseName,
    originalKB,
    totalAVIF,
    totalWebP,
    totalJPG,
  };
}

/**
 * Main optimization function
 */
async function optimizeTeacherImages() {
  console.log('='.repeat(70));
  console.log('  TEACHER IMAGE OPTIMIZATION - Enterprise Edition v1.0');
  console.log('  Square portraits: 320×320, 640×640, 960×960');
  console.log('  Formats: AVIF (best) + WebP (modern) + JPG (fallback)');
  console.log('  Quality: High (AVIF 75, WebP 85, JPG 85)');
  console.log('='.repeat(70));
  console.log('');

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const results = [];
  let processedCount = 0;

  // Process all teachers
  for (const [sourceFile, outputBaseName] of Object.entries(FILENAME_MAPPING)) {
    const result = await processTeacherImage(sourceFile, outputBaseName);
    if (result) {
      results.push(result);
      processedCount++;
    }
  }

  // Summary statistics
  console.log('\n' + '='.repeat(70));
  console.log('  OPTIMIZATION COMPLETE');
  console.log('='.repeat(70));
  console.log(`  Teachers processed: ${processedCount} / ${Object.keys(FILENAME_MAPPING).length}`);
  console.log(`  Total files generated: ${processedCount * 9} (${processedCount} teachers × 9 files each)`);

  if (results.length > 0) {
    const totalOriginalMB = results.reduce((sum, r) => sum + r.originalKB, 0) / 1024;
    const totalAVIFMB = results.reduce((sum, r) => sum + r.totalAVIF, 0) / (1024 * 1024);
    const totalWebPMB = results.reduce((sum, r) => sum + r.totalWebP, 0) / (1024 * 1024);
    const totalJPGMB = results.reduce((sum, r) => sum + r.totalJPG, 0) / (1024 * 1024);
    const totalOutputMB = totalAVIFMB + totalWebPMB + totalJPGMB;

    console.log(`\n  Original RAW images: ${totalOriginalMB.toFixed(2)} MB`);
    console.log(`  Output images total: ${totalOutputMB.toFixed(2)} MB`);
    console.log(`    - AVIF: ${totalAVIFMB.toFixed(2)} MB (${processedCount * 3} files)`);
    console.log(`    - WebP: ${totalWebPMB.toFixed(2)} MB (${processedCount * 3} files)`);
    console.log(`    - JPG:  ${totalJPGMB.toFixed(2)} MB (${processedCount * 3} files)`);

    const avifSavingsVsWebP = (((totalWebPMB - totalAVIFMB) / totalWebPMB) * 100).toFixed(0);
    const avifSavingsVsJPG = (((totalJPGMB - totalAVIFMB) / totalJPGMB) * 100).toFixed(0);

    console.log(`\n  AVIF compression savings:`);
    console.log(`    - vs WebP: ${avifSavingsVsWebP}% smaller (~${(totalWebPMB - totalAVIFMB).toFixed(2)} MB saved)`);
    console.log(`    - vs JPG:  ${avifSavingsVsJPG}% smaller (~${(totalJPGMB - totalAVIFMB).toFixed(2)} MB saved)`);
  }

  console.log('\n  Browser support:');
  console.log('    - AVIF: Chrome 85+, Firefox 93+, Safari 16+ (best quality)');
  console.log('    - WebP: All modern browsers (good fallback)');
  console.log('    - JPG:  Universal support (legacy fallback)');

  console.log('\n  Next steps:');
  console.log('    1. Update teacher-images.ts basePaths');
  console.log('    2. Update profesores-page-data.ts image paths');
  console.log('    3. Run cleanup script for obsolete files (optional)');
  console.log('    4. Test on /es/profesores-baile-barcelona');

  console.log('='.repeat(70));
  console.log('');
}

optimizeTeacherImages().catch(console.error);
