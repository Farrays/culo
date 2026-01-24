/**
 * Script para optimizar imagen de Entrenamiento Bailarines
 * Genera hero images en múltiples breakpoints + OG image para social media
 *
 * Enterprise-level optimization for SEO, GEO, AIEO, AIO
 * - AVIF: Best compression, modern browsers
 * - WebP: Universal modern support
 * - JPG: Fallback + OG images for social crawlers
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SOURCE_FILE = './public/images/nuevos/Entrenamiento Bailarines.jpg';
const OUTPUT_DIR = './public/images/classes/entrenamiento-bailarines/img';
const BASE_NAME = 'entrenamiento-bailarines-hero';

// Breakpoints for responsive images (hero needs larger sizes)
const BREAKPOINTS = [320, 640, 768, 1024, 1440, 1920];

// Quality settings - Enterprise balanced for performance + quality
const CONFIG = {
  avif: { quality: 65, effort: 6 },       // Best compression
  webp: { quality: 82, effort: 6 },       // Universal support
  jpg: { quality: 85, mozjpeg: true },    // Fallback
};

// OG Image settings (1200x630 for social media)
const OG_CONFIG = {
  width: 1200,
  height: 630,
  fit: 'cover',
};

async function optimizeImage() {
  console.log('🖼️  Optimizando imagen de Entrenamiento Bailarines...\n');

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Check source file exists
  try {
    await fs.access(SOURCE_FILE);
  } catch {
    console.error(`❌ No se encontró el archivo fuente: ${SOURCE_FILE}`);
    process.exit(1);
  }

  // Get original metadata
  const image = sharp(SOURCE_FILE);
  const metadata = await image.metadata();
  const stats = await fs.stat(SOURCE_FILE);
  const originalSizeMB = stats.size / (1024 * 1024);

  console.log(`📷 Archivo fuente: ${SOURCE_FILE}`);
  console.log(`   Tamaño original: ${originalSizeMB.toFixed(2)} MB`);
  console.log(`   Dimensiones: ${metadata.width}x${metadata.height}\n`);

  let totalSavedMB = 0;
  let filesGenerated = 0;

  // Generate responsive images for each breakpoint
  console.log('📐 Generando imágenes responsivas...\n');

  for (const width of BREAKPOINTS) {
    if (width > metadata.width) {
      console.log(`   ⏭️  Saltando ${width}px (mayor que original)`);
      continue;
    }

    // AVIF
    const avifPath = path.join(OUTPUT_DIR, `${BASE_NAME}_${width}.avif`);
    await sharp(SOURCE_FILE)
      .resize(width, null, { withoutEnlargement: true })
      .avif(CONFIG.avif)
      .toFile(avifPath);
    filesGenerated++;

    // WebP
    const webpPath = path.join(OUTPUT_DIR, `${BASE_NAME}_${width}.webp`);
    await sharp(SOURCE_FILE)
      .resize(width, null, { withoutEnlargement: true })
      .webp(CONFIG.webp)
      .toFile(webpPath);
    filesGenerated++;

    // JPG
    const jpgPath = path.join(OUTPUT_DIR, `${BASE_NAME}_${width}.jpg`);
    await sharp(SOURCE_FILE)
      .resize(width, null, { withoutEnlargement: true })
      .jpeg(CONFIG.jpg)
      .toFile(jpgPath);
    filesGenerated++;

    // Calculate size savings for this breakpoint
    const avifStats = await fs.stat(avifPath);
    const webpStats = await fs.stat(webpPath);
    const jpgStats = await fs.stat(jpgPath);

    console.log(`   ✅ ${width}px: AVIF ${(avifStats.size/1024).toFixed(0)}KB | WebP ${(webpStats.size/1024).toFixed(0)}KB | JPG ${(jpgStats.size/1024).toFixed(0)}KB`);
  }

  // Generate OG image (1200x630 for social media - MUST be JPG)
  console.log('\n📱 Generando imagen OG para redes sociales...\n');

  const ogPath = './public/images/og-entrenamiento-bailarines.jpg';
  await sharp(SOURCE_FILE)
    .resize(OG_CONFIG.width, OG_CONFIG.height, { fit: OG_CONFIG.fit, position: 'center' })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(ogPath);

  const ogStats = await fs.stat(ogPath);
  console.log(`   ✅ OG Image: ${ogPath} (${(ogStats.size/1024).toFixed(0)}KB)`);

  // Also generate WebP and AVIF versions of OG for modern browsers
  const ogWebpPath = './public/images/og-entrenamiento-bailarines.webp';
  await sharp(SOURCE_FILE)
    .resize(OG_CONFIG.width, OG_CONFIG.height, { fit: OG_CONFIG.fit, position: 'center' })
    .webp({ quality: 85 })
    .toFile(ogWebpPath);

  const ogAvifPath = './public/images/og-entrenamiento-bailarines.avif';
  await sharp(SOURCE_FILE)
    .resize(OG_CONFIG.width, OG_CONFIG.height, { fit: OG_CONFIG.fit, position: 'center' })
    .avif({ quality: 70 })
    .toFile(ogAvifPath);

  console.log(`   ✅ OG WebP: ${ogWebpPath}`);
  console.log(`   ✅ OG AVIF: ${ogAvifPath}`);

  filesGenerated += 3;

  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log(`\n✨ Optimización completada!`);
  console.log(`   Archivos generados: ${filesGenerated}`);
  console.log(`   Directorio: ${OUTPUT_DIR}`);
  console.log(`   OG Image: ${ogPath}`);
  console.log('\n📋 Próximos pasos:');
  console.log('   1. Añadir configuración a style-images.ts');
  console.log('   2. Actualizar PreparacionFisicaBailarinesPage.tsx con hero image');
  console.log('   3. Actualizar prerender.mjs con OG image metadata');
  console.log('   4. Añadir traducciones de alt text en locales');
}

optimizeImage().catch(console.error);
