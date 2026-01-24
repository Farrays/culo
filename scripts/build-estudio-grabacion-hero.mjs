/**
 * Script Enterprise para optimizar imagen hero del Estudio de Grabación
 * Genera AVIF, WebP, y JPEG en múltiples breakpoints responsive
 * Incluye imagen OG optimizada para SEO/Social
 *
 * Breakpoints Hero: [480, 960, 1440, 1920]
 * OG Image: 1200x630 (Facebook/LinkedIn standard)
 *
 * Usage: node scripts/build-estudio-grabacion-hero.mjs
 */
import sharp from "sharp";
import { mkdir, access, constants } from "node:fs/promises";
import { join } from "node:path";

// ============================================================================
// CONFIGURATION
// ============================================================================
const SOURCE_IMAGE = "public/images/nuevos/estudio de grabacion.jpg";
const OUTPUT_DIR = "public/images/estudio-grabacion";

// Hero breakpoints for responsive images
const HERO_BREAKPOINTS = [480, 960, 1440, 1920];

// OG Image dimensions (Facebook/LinkedIn optimal)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Enterprise-level quality settings
const QUALITY = {
  avif: 72,    // Best compression, modern browsers (slightly higher for hero)
  webp: 82,    // Good compression, wide support
  jpeg: 85     // Universal fallback, high quality for hero
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if source file exists
 */
async function fileExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// ============================================================================
// MAIN SCRIPT
// ============================================================================
async function buildEstudioGrabacionHero() {
  console.log("═".repeat(60));
  console.log("🎬 Estudio de Grabación Hero Image Builder");
  console.log("═".repeat(60));
  console.log(`\n📁 Source: ${SOURCE_IMAGE}`);
  console.log(`📂 Output: ${OUTPUT_DIR}`);
  console.log(`📐 Hero Breakpoints: ${HERO_BREAKPOINTS.join(", ")}px`);
  console.log(`🖼️  OG Image: ${OG_WIDTH}x${OG_HEIGHT}px`);
  console.log(`🎨 Formats: AVIF, WebP, JPEG\n`);

  // Check source file exists
  if (!await fileExists(SOURCE_IMAGE)) {
    console.error(`❌ Source image not found: ${SOURCE_IMAGE}`);
    process.exit(1);
  }

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`✓ Output directory ready: ${OUTPUT_DIR}\n`);

  // Load source image and get metadata
  const sourceImage = sharp(SOURCE_IMAGE);
  const metadata = await sourceImage.metadata();

  console.log(`📷 Source Image Details:`);
  console.log(`   Dimensions: ${metadata.width}x${metadata.height}`);
  console.log(`   Format: ${metadata.format}`);
  console.log(`   Space: ${metadata.space || 'sRGB'}\n`);

  // Track total savings
  let totalOriginal = 0;
  let totalOptimized = 0;

  // ============================================================================
  // Generate Hero Images (responsive breakpoints)
  // ============================================================================
  console.log("🖼️  Generating Hero Images...\n");

  for (const width of HERO_BREAKPOINTS) {
    if (metadata.width < width) {
      console.log(`   ⚠️  Skipping ${width}px (source is smaller)`);
      continue;
    }

    const isFullSize = width === Math.max(...HERO_BREAKPOINTS);
    const suffix = isFullSize ? '' : `-${width}`;

    // Calculate proportional height (16:9 aspect for hero)
    const height = Math.round(width * (9 / 16));

    // AVIF - Best compression for modern browsers
    const avifBuffer = await sharp(SOURCE_IMAGE)
      .resize({ width, height, fit: 'cover', position: 'center' })
      .avif({ quality: QUALITY.avif, effort: 6 })
      .toBuffer();

    const avifPath = join(OUTPUT_DIR, `hero${suffix}.avif`);
    await sharp(avifBuffer).toFile(avifPath);

    // WebP - Wide browser support
    const webpBuffer = await sharp(SOURCE_IMAGE)
      .resize({ width, height, fit: 'cover', position: 'center' })
      .webp({ quality: QUALITY.webp })
      .toBuffer();

    const webpPath = join(OUTPUT_DIR, `hero${suffix}.webp`);
    await sharp(webpBuffer).toFile(webpPath);

    // JPEG - Universal fallback
    const jpegBuffer = await sharp(SOURCE_IMAGE)
      .resize({ width, height, fit: 'cover', position: 'center' })
      .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
      .toBuffer();

    const jpegPath = join(OUTPUT_DIR, `hero${suffix}.jpg`);
    await sharp(jpegBuffer).toFile(jpegPath);

    // Calculate original size for this breakpoint (estimated)
    const origEstimate = width * height * 3; // RGB
    totalOriginal += origEstimate;
    totalOptimized += avifBuffer.length + webpBuffer.length + jpegBuffer.length;

    console.log(`   ✓ hero${suffix} (${width}x${height})`);
    console.log(`      AVIF: ${formatBytes(avifBuffer.length)}`);
    console.log(`      WebP: ${formatBytes(webpBuffer.length)}`);
    console.log(`      JPEG: ${formatBytes(jpegBuffer.length)}`);
  }

  // ============================================================================
  // Generate OG Image (1200x630 for social media)
  // ============================================================================
  console.log("\n📱 Generating OG Image (Social Media)...\n");

  // OG AVIF
  const ogAvifBuffer = await sharp(SOURCE_IMAGE)
    .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: 'cover', position: 'center' })
    .avif({ quality: QUALITY.avif })
    .toBuffer();
  await sharp(ogAvifBuffer).toFile(join(OUTPUT_DIR, 'og.avif'));

  // OG WebP
  const ogWebpBuffer = await sharp(SOURCE_IMAGE)
    .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: 'cover', position: 'center' })
    .webp({ quality: QUALITY.webp })
    .toBuffer();
  await sharp(ogWebpBuffer).toFile(join(OUTPUT_DIR, 'og.webp'));

  // OG JPEG (required for Facebook/LinkedIn crawlers)
  const ogJpegBuffer = await sharp(SOURCE_IMAGE)
    .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: 'cover', position: 'center' })
    .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
    .toBuffer();
  await sharp(ogJpegBuffer).toFile(join(OUTPUT_DIR, 'og.jpg'));

  console.log(`   ✓ og.avif: ${formatBytes(ogAvifBuffer.length)}`);
  console.log(`   ✓ og.webp: ${formatBytes(ogWebpBuffer.length)}`);
  console.log(`   ✓ og.jpg: ${formatBytes(ogJpegBuffer.length)}`);

  // ============================================================================
  // Generate LQIP Placeholder (20px for blur-up technique)
  // ============================================================================
  console.log("\n🎭 Generating LQIP Placeholder...\n");

  const lqipBuffer = await sharp(SOURCE_IMAGE)
    .resize({ width: 20 })
    .webp({ quality: 20 })
    .toBuffer();

  const lqipBase64 = `data:image/webp;base64,${lqipBuffer.toString("base64")}`;
  console.log(`   ✓ LQIP Base64 (${lqipBuffer.length} bytes):`);
  console.log(`     ${lqipBase64.substring(0, 80)}...`);

  // ============================================================================
  // Get Dominant Color
  // ============================================================================
  console.log("\n🎨 Extracting Dominant Color...\n");

  const { dominant } = await sharp(SOURCE_IMAGE)
    .resize({ width: 10 })
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(({ data }) => {
      const r = data[0], g = data[1], b = data[2];
      return {
        dominant: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
      };
    });

  console.log(`   ✓ Dominant color: ${dominant}`);

  // ============================================================================
  // Summary
  // ============================================================================
  console.log("\n" + "═".repeat(60));
  console.log("🎉 BUILD COMPLETE!");
  console.log("═".repeat(60));
  console.log(`\n📂 Output directory: ${OUTPUT_DIR}`);
  console.log(`📊 Files generated: ${HERO_BREAKPOINTS.length * 3 + 3} images`);

  console.log(`\n🔧 Implementation Code:`);
  console.log(`
// Hero Image srcSet (use in picture element):
const heroSrcSet = {
  avif: '/images/estudio-grabacion/hero-480.avif 480w, /images/estudio-grabacion/hero-960.avif 960w, /images/estudio-grabacion/hero-1440.avif 1440w, /images/estudio-grabacion/hero.avif 1920w',
  webp: '/images/estudio-grabacion/hero-480.webp 480w, /images/estudio-grabacion/hero-960.webp 960w, /images/estudio-grabacion/hero-1440.webp 1440w, /images/estudio-grabacion/hero.webp 1920w',
  jpeg: '/images/estudio-grabacion/hero-480.jpg 480w, /images/estudio-grabacion/hero-960.jpg 960w, /images/estudio-grabacion/hero-1440.jpg 1440w, /images/estudio-grabacion/hero.jpg 1920w'
};

// OG Image for meta tags:
const ogImage = '/images/estudio-grabacion/og.jpg';

// LQIP for blur-up:
const lqip = '${lqipBase64.substring(0, 60)}...';

// Dominant color for placeholder:
const dominantColor = '${dominant}';
`);

  console.log("\n✅ Ready for implementation in EstudioGrabacionPage.tsx");
}

// Run the script
buildEstudioGrabacionHero().catch(error => {
  console.error("\n❌ Build failed:", error);
  process.exit(1);
});
