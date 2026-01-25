/**
 * Script para optimizar imagen hero de la página de Horarios
 * Genera AVIF, WebP, JPEG en breakpoints responsive para hero full-width
 * + OG image optimizado para redes sociales (1200x630)
 *
 * Breakpoints Hero: [320, 640, 768, 1024, 1440, 1920]
 * Formatos: AVIF (best), WebP (wide support), JPEG (fallback)
 *
 * Usage: node scripts/build-horarios-hero.mjs
 */
import sharp from "sharp";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";

// ============================================================================
// CONFIGURATION - Enterprise Grade
// ============================================================================
const INPUT_FILE = "public/images/nuevos/horario clases de baile.jpg";
const OUTPUT_DIR = "public/images/horarios";
const BASE_NAME = "horarios-clases-baile-barcelona";

// Full-width hero breakpoints (larger for hero sections)
const HERO_BREAKPOINTS = [320, 640, 768, 1024, 1440, 1920];

// OG Image dimensions (Facebook/LinkedIn optimal)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Quality settings - Enterprise level (aligned with project standards)
const QUALITY = {
  avif: { quality: 65, effort: 6 },    // Best compression, modern browsers
  webp: { quality: 82, effort: 6 },    // Universal support
  jpeg: { quality: 85, mozjpeg: true }, // Fallback
  og: { quality: 90, mozjpeg: true }    // Higher quality for social sharing
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ============================================================================
// MAIN SCRIPT
// ============================================================================
async function buildHorariosHero() {
  console.log("═".repeat(60));
  console.log("🖼️  HORARIOS HERO IMAGE OPTIMIZER");
  console.log("   Enterprise-grade image optimization for SEO/GEO/AIEO");
  console.log("═".repeat(60));
  console.log("");

  // Check input file exists
  let inputStats;
  try {
    inputStats = await stat(INPUT_FILE);
    console.log(`📂 Input: ${INPUT_FILE}`);
    console.log(`   Size: ${formatBytes(inputStats.size)}`);
  } catch (error) {
    console.error(`❌ Input file not found: ${INPUT_FILE}`);
    process.exit(1);
  }

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log("");

  // Get image metadata
  const image = sharp(INPUT_FILE);
  const metadata = await image.metadata();
  console.log(`📷 Original dimensions: ${metadata.width}x${metadata.height}`);
  console.log(`   Format: ${metadata.format}`);
  console.log("");

  let totalOutputSize = 0;

  // =========================================================================
  // HERO IMAGES - Responsive breakpoints
  // =========================================================================
  console.log("🔄 Generating hero images...");
  console.log(`   Breakpoints: ${HERO_BREAKPOINTS.join(", ")}px`);
  console.log(`   Formats: AVIF, WebP, JPEG\n`);

  for (const width of HERO_BREAKPOINTS) {
    if (metadata.width < width) {
      console.log(`   ⚠️  Skipping ${width}px (original is smaller)`);
      continue;
    }

    // Calculate height maintaining aspect ratio
    const height = Math.round((metadata.height / metadata.width) * width);

    // AVIF - Best compression for modern browsers
    const avifPath = join(OUTPUT_DIR, `${BASE_NAME}_${width}.avif`);
    await sharp(INPUT_FILE)
      .resize({ width, height, fit: "cover" })
      .avif(QUALITY.avif)
      .toFile(avifPath);
    const avifStats = await stat(avifPath);

    // WebP - Wide browser support
    const webpPath = join(OUTPUT_DIR, `${BASE_NAME}_${width}.webp`);
    await sharp(INPUT_FILE)
      .resize({ width, height, fit: "cover" })
      .webp(QUALITY.webp)
      .toFile(webpPath);
    const webpStats = await stat(webpPath);

    // JPEG - Universal fallback (mozjpeg for better compression)
    const jpgPath = join(OUTPUT_DIR, `${BASE_NAME}_${width}.jpg`);
    await sharp(INPUT_FILE)
      .resize({ width, height, fit: "cover" })
      .jpeg(QUALITY.jpeg)
      .toFile(jpgPath);
    const jpgStats = await stat(jpgPath);

    totalOutputSize += avifStats.size + webpStats.size + jpgStats.size;

    console.log(`   ✓ ${width}px: AVIF(${formatBytes(avifStats.size)}) WebP(${formatBytes(webpStats.size)}) JPG(${formatBytes(jpgStats.size)})`);
  }

  // =========================================================================
  // OG IMAGE - Social media sharing (1200x630)
  // Standard enterprise location: /public/images/og-*.jpg
  // =========================================================================
  console.log("\n🔄 Generating OG image for social sharing...");

  // OG JPEG (required for most social crawlers) - MUST be in root images folder
  const ogJpgPath = "public/images/og-horarios-clases-baile.jpg";
  await sharp(INPUT_FILE)
    .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: "cover", position: "center" })
    .jpeg(QUALITY.og)
    .toFile(ogJpgPath);
  const ogJpgStats = await stat(ogJpgPath);

  // OG WebP (for modern crawlers)
  const ogWebpPath = "public/images/og-horarios-clases-baile.webp";
  await sharp(INPUT_FILE)
    .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: "cover", position: "center" })
    .webp({ quality: 85 })
    .toFile(ogWebpPath);
  const ogWebpStats = await stat(ogWebpPath);

  // OG AVIF (future-proof)
  const ogAvifPath = "public/images/og-horarios-clases-baile.avif";
  await sharp(INPUT_FILE)
    .resize({ width: OG_WIDTH, height: OG_HEIGHT, fit: "cover", position: "center" })
    .avif({ quality: 70 })
    .toFile(ogAvifPath);
  const ogAvifStats = await stat(ogAvifPath);

  totalOutputSize += ogJpgStats.size + ogWebpStats.size + ogAvifStats.size;

  console.log(`   ✓ OG 1200x630: JPG(${formatBytes(ogJpgStats.size)}) WebP(${formatBytes(ogWebpStats.size)}) AVIF(${formatBytes(ogAvifStats.size)})`);

  // =========================================================================
  // PLACEHOLDER - For blur-up lazy loading (LQIP)
  // =========================================================================
  console.log("\n🔄 Generating LQIP placeholder...");

  const placeholderBuffer = await sharp(INPUT_FILE)
    .resize({ width: 20 })
    .webp({ quality: 20 })
    .toBuffer();
  const placeholder = `data:image/webp;base64,${placeholderBuffer.toString("base64")}`;
  console.log(`   ✓ Placeholder (base64): ${placeholder.substring(0, 50)}...`);

  // =========================================================================
  // DOMINANT COLOR - For CSS background fallback
  // =========================================================================
  console.log("\n🔄 Extracting dominant color...");

  const colorData = await sharp(INPUT_FILE)
    .resize({ width: 10, height: 10, fit: "cover" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data } = colorData;
  const r = data[0], g = data[1], b = data[2];
  const dominantColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  console.log(`   ✓ Dominant color: ${dominantColor}`);

  // =========================================================================
  // SUMMARY
  // =========================================================================
  console.log("\n" + "═".repeat(60));
  console.log("📊 OPTIMIZATION SUMMARY");
  console.log("═".repeat(60));
  console.log(`   Original size:  ${formatBytes(inputStats.size)}`);
  console.log(`   Total output:   ${formatBytes(totalOutputSize)}`);
  console.log(`   Compression:    ${((1 - totalOutputSize / inputStats.size) * 100).toFixed(1)}% reduction (all formats combined)`);
  console.log("");
  console.log("📁 Generated files:");
  console.log(`   ${OUTPUT_DIR}/`);
  for (const width of HERO_BREAKPOINTS) {
    if (metadata.width >= width) {
      console.log(`     ├── ${BASE_NAME}_${width}.avif`);
      console.log(`     ├── ${BASE_NAME}_${width}.webp`);
      console.log(`     ├── ${BASE_NAME}_${width}.jpg`);
    }
  }
  console.log(`     ├── og-${BASE_NAME}.jpg   (Social OG)`);
  console.log(`     ├── og-${BASE_NAME}.webp  (Modern OG)`);
  console.log(`     └── og-${BASE_NAME}.avif  (Future OG)`);
  console.log("");
  console.log("🎨 Integration values:");
  console.log(`   Placeholder: ${placeholder.substring(0, 60)}...`);
  console.log(`   Dominant:    ${dominantColor}`);
  console.log("");
  console.log("✅ Horarios hero images build complete!");
  console.log("═".repeat(60));

  // Return values for programmatic use
  return {
    placeholder,
    dominantColor,
    baseName: BASE_NAME,
    outputDir: OUTPUT_DIR,
    breakpoints: HERO_BREAKPOINTS.filter(w => metadata.width >= w)
  };
}

buildHorariosHero().catch(console.error);
