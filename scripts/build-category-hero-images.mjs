/**
 * Script para optimizar imágenes de hero de categorías
 * Genera AVIF, WebP, y JPEG en breakpoints responsive + OG image
 *
 * Enterprise-grade optimization for:
 * - SEO (OG images for social media)
 * - GEO/AIEO (proper alt text support)
 * - Performance (modern formats, responsive sizes)
 * - Accessibility (high contrast, proper sizing)
 *
 * Breakpoints: [320, 640, 768, 1024, 1440, 1920]
 * OG Image: 1200x630 (Facebook/LinkedIn standard)
 *
 * Usage: node scripts/build-category-hero-images.mjs
 */
import sharp from "sharp";
import { readdir, mkdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";

// ============================================================================
// CONFIGURATION
// ============================================================================
const RAW_DIR = "public/images/categories/hero-raw";
const OUTPUT_DIR = "public/images/categories/hero";

// Hero images need larger breakpoints for fullscreen backgrounds
const HERO_BREAKPOINTS = [320, 640, 768, 1024, 1440, 1920];

// OG image dimensions (Facebook/LinkedIn standard)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Quality settings (Enterprise-level - aligned with project standards)
const QUALITY = {
  avif: 65,    // Best compression, modern browsers
  webp: 82,    // Good compression, wide support (aligned with project)
  jpeg: 85,    // Universal fallback (aligned with project)
  og_jpeg: 90  // Higher quality for social media previews
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format file size in human-readable format
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Get dominant color from image
 */
async function getDominantColor(imagePath) {
  const { data } = await sharp(imagePath)
    .resize({ width: 10 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const r = data[0], g = data[1], b = data[2];
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// ============================================================================
// MAIN SCRIPT
// ============================================================================
async function buildCategoryHeroImages() {
  console.log("🖼️  Building category HERO images...\n");
  console.log(`   Source: ${RAW_DIR}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Breakpoints: ${HERO_BREAKPOINTS.join(", ")}px`);
  console.log(`   OG Image: ${OG_WIDTH}x${OG_HEIGHT}px`);
  console.log(`   Formats: AVIF, WebP, JPEG\n`);

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Get all image files
  let files = [];
  try {
    files = (await readdir(RAW_DIR)).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  } catch (error) {
    console.error(`❌ Error reading ${RAW_DIR}:`, error.message);
    console.log("   Please create the folder and add source images.");
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("ℹ️  No images found to process");
    console.log(`   Add images to: ${RAW_DIR}`);
    return;
  }

  console.log(`📁 Found ${files.length} images to process\n`);
  console.log("═".repeat(60));

  let totalOriginalSize = 0;
  let totalOutputSize = 0;

  for (const file of files) {
    const inPath = join(RAW_DIR, file);
    const ext = extname(file).toLowerCase();

    // Normalize filename: lowercase, replace spaces with hyphens
    const base = basename(file, ext)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "");

    try {
      const meta = await sharp(inPath).metadata();
      const originalStats = await stat(inPath);
      totalOriginalSize += originalStats.size;

      console.log(`\n📷 Processing: ${file}`);
      console.log(`   Original: ${meta.width}x${meta.height} (${formatSize(originalStats.size)})`);

      // Generate responsive hero images
      for (const width of HERO_BREAKPOINTS) {
        // Skip if image is smaller than target width
        if (meta.width < width) {
          console.log(`   ⚠️  Skipping ${width}px (original is smaller)`);
          continue;
        }

        // AVIF (best compression - modern browsers)
        const avifPath = join(OUTPUT_DIR, `${base}_${width}.avif`);
        await sharp(inPath)
          .resize({ width, withoutEnlargement: true })
          .avif({ quality: QUALITY.avif, effort: 6 })
          .toFile(avifPath);

        // WebP (good compression - wide support)
        const webpPath = join(OUTPUT_DIR, `${base}_${width}.webp`);
        await sharp(inPath)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: QUALITY.webp })
          .toFile(webpPath);

        // JPEG (universal fallback)
        const jpegPath = join(OUTPUT_DIR, `${base}_${width}.jpg`);
        await sharp(inPath)
          .resize({ width, withoutEnlargement: true })
          .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
          .toFile(jpegPath);

        // Track output size (using webp as reference)
        const webpStats = await stat(webpPath);
        totalOutputSize += webpStats.size;

        console.log(`   ✓ ${base}_${width} (.avif, .webp, .jpg)`);
      }

      // Generate OG image (1200x630, cropped to fit)
      console.log(`   📱 Generating OG image (${OG_WIDTH}x${OG_HEIGHT})...`);

      // OG AVIF
      await sharp(inPath)
        .resize(OG_WIDTH, OG_HEIGHT, {
          fit: 'cover',
          position: 'center'
        })
        .avif({ quality: QUALITY.avif + 5 })
        .toFile(join(OUTPUT_DIR, `${base}-og.avif`));

      // OG WebP
      await sharp(inPath)
        .resize(OG_WIDTH, OG_HEIGHT, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: QUALITY.webp + 5 })
        .toFile(join(OUTPUT_DIR, `${base}-og.webp`));

      // OG JPEG (critical for social media crawlers that don't support modern formats)
      const ogJpegPath = join(OUTPUT_DIR, `${base}-og.jpg`);
      await sharp(inPath)
        .resize(OG_WIDTH, OG_HEIGHT, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: QUALITY.og_jpeg, mozjpeg: true })
        .toFile(ogJpegPath);

      const ogStats = await stat(ogJpegPath);
      console.log(`   ✓ ${base}-og (.avif, .webp, .jpg) - ${formatSize(ogStats.size)}`);

      // Get dominant color for placeholder
      const dominantColor = await getDominantColor(inPath);
      console.log(`   🎨 Dominant color: ${dominantColor}`);

      // Generate blur placeholder (20px, base64)
      const placeholderBuffer = await sharp(inPath)
        .resize({ width: 20 })
        .webp({ quality: 20 })
        .toBuffer();
      const placeholder = `data:image/webp;base64,${placeholderBuffer.toString("base64")}`;
      console.log(`   🔲 Placeholder: ${placeholder.substring(0, 50)}...`);

      console.log(`   ✅ ${file} completed!`);

    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error.message);
    }
  }

  console.log("\n" + "═".repeat(60));
  console.log("🎉 Category hero images build complete!\n");
  console.log(`   Original total: ${formatSize(totalOriginalSize)}`);
  console.log(`   Output total:   ~${formatSize(totalOutputSize * 3)} (all formats)`);
  console.log(`   Compression:    ~${((1 - totalOutputSize / totalOriginalSize) * 100).toFixed(0)}% saved`);
  console.log(`\n   Output folder: ${OUTPUT_DIR}`);
  console.log("\n   Usage in code:");
  console.log('   heroImage="/images/categories/hero/clases-de-danza"');
  console.log('   ogImage="/images/categories/hero/clases-de-danza-og.jpg"');
}

buildCategoryHeroImages().catch(console.error);
