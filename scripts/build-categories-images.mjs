/**
 * Script para optimizar imágenes de categorías
 * Genera AVIF, WebP, y JPEG en 4 breakpoints responsive
 * Breakpoints: [320, 640, 768, 1024]
 *
 * Usage: node scripts/build-categories-images.mjs
 */
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";

// ============================================================================
// CONFIGURATION
// ============================================================================
const RAW_DIR = "public/images/categories/raw";
const OUTPUT_DIR = "public/images/categories/img";
const BREAKPOINTS = [320, 640, 768, 1024];

// Quality settings (Enterprise-level)
const QUALITY = {
  avif: 70,    // Best compression, modern browsers
  webp: 80,    // Good compression, wide support
  jpeg: 82     // Universal fallback
};

// ============================================================================
// MAIN SCRIPT
// ============================================================================
async function buildCategoryImages() {
  console.log("🖼️  Building category images...\n");
  console.log(`   Source: ${RAW_DIR}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
  console.log(`   Breakpoints: ${BREAKPOINTS.join(", ")}px`);
  console.log(`   Formats: AVIF, WebP, JPEG\n`);

  // Create output directory
  await mkdir(OUTPUT_DIR, { recursive: true });

  // Get all image files
  let files = [];
  try {
    files = (await readdir(RAW_DIR)).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  } catch (error) {
    console.error(`❌ Error reading ${RAW_DIR}:`, error.message);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log("ℹ️  No images found to process");
    return;
  }

  console.log(`📁 Found ${files.length} images to process\n`);

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
      console.log(`📷 Processing: ${file}`);
      console.log(`   Original: ${meta.width}x${meta.height}`);

      for (const width of BREAKPOINTS) {
        // Skip if image is smaller than target width
        if (meta.width < width) {
          console.log(`   ⚠️  Skipping ${width}px (original is smaller)`);
          continue;
        }

        // AVIF (best compression - modern browsers)
        await sharp(inPath)
          .resize({ width, withoutEnlargement: true })
          .avif({ quality: QUALITY.avif, effort: 6 })
          .toFile(join(OUTPUT_DIR, `${base}_${width}.avif`));

        // WebP (good compression - wide support)
        await sharp(inPath)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: QUALITY.webp })
          .toFile(join(OUTPUT_DIR, `${base}_${width}.webp`));

        // JPEG (universal fallback)
        await sharp(inPath)
          .resize({ width, withoutEnlargement: true })
          .jpeg({ quality: QUALITY.jpeg, mozjpeg: true })
          .toFile(join(OUTPUT_DIR, `${base}_${width}.jpg`));

        console.log(`   ✓ Generated ${base}_${width} (.avif, .webp, .jpg)`);
      }

      // Generate placeholder for lazy loading (20px width, base64)
      const placeholderBuffer = await sharp(inPath)
        .resize({ width: 20 })
        .webp({ quality: 20 })
        .toBuffer();
      const placeholder = `data:image/webp;base64,${placeholderBuffer.toString("base64")}`;
      console.log(`   ✓ Placeholder: ${placeholder.substring(0, 60)}...`);

      // Get dominant color
      const { dominant } = await sharp(inPath)
        .resize({ width: 10 })
        .raw()
        .toBuffer({ resolveWithObject: true })
        .then(({ data, info }) => {
          const r = data[0], g = data[1], b = data[2];
          return { dominant: `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}` };
        });
      console.log(`   ✓ Dominant color: ${dominant}`);

      console.log(`   ✅ ${file} completed\n`);
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error.message, "\n");
    }
  }

  console.log("═".repeat(50));
  console.log("🎉 Category images build complete!");
  console.log(`   Output: ${OUTPUT_DIR}`);
}

buildCategoryImages().catch(console.error);
