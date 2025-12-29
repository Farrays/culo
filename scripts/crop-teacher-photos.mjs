/**
 * Crop Teacher Photos Script
 * ==========================
 * Crops and resizes Iroel and Lia's photos to match Yasmina's style
 * (face-focused, tighter crop)
 *
 * Usage: node scripts/crop-teacher-photos.mjs
 */

import sharp from 'sharp';
import { mkdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

// Configuration for each teacher's crop
const TEACHERS_CONFIG = {
  'iroel-bastarreche': {
    // Foto RAW original: 5504x8256
    sourcePath: join(ROOT_DIR, 'public/images/teachers/raw/Profesor Iroel Bastarreche.jpg'),
    outputBaseName: 'profesor-iroel-bastarreche',
    // Crop más agresivo - subir más la cara como Yasmina
    crop: {
      left: 400,        // Centrar
      top: 900,         // Más abajo para subir la cara en el frame
      width: 4700,      // Ancho
      height: 4700,     // Cuadrado
    },
    outputSizes: [320, 640, 960],
  },
  'lia-valdes': {
    // Foto RAW original: 5504x8256
    sourcePath: join(ROOT_DIR, 'public/images/teachers/raw/Profesora Lia Valdes.jpg'),
    outputBaseName: 'profesora-lia-valdes',
    // Crop más agresivo - subir mucho más la cara
    crop: {
      left: 500,        // Centrar
      top: 900,         // Más abajo para subir la cara en el frame
      width: 4500,      // Ancho
      height: 4500,     // Cuadrado
    },
    outputSizes: [320, 640, 960],
  },
};

// Format settings (matching the main build system)
const FORMATS = {
  avif: { quality: 70, effort: 4, chromaSubsampling: '4:2:0' },
  webp: { quality: 80, effort: 4, smartSubsample: true },
  jpg: { quality: 82, mozjpeg: true, chromaSubsampling: '4:2:0' },
};

/**
 * Process a single teacher's photo
 */
async function processTeacherPhoto(teacherId, config) {
  console.log(`\n📸 Processing ${teacherId}...`);

  const outputDir = join(ROOT_DIR, 'public/images/teachers/img');
  await mkdir(outputDir, { recursive: true });

  // Read source image
  const sourceImage = sharp(config.sourcePath);
  const metadata = await sourceImage.metadata();

  console.log(`   Source: ${metadata.width}x${metadata.height}`);
  console.log(`   Crop: ${JSON.stringify(config.crop)}`);

  // Process each size and format
  const results = [];

  for (const size of config.outputSizes) {
    for (const [format, formatConfig] of Object.entries(FORMATS)) {
      const outputFilename = `${config.outputBaseName}_${size}.${format}`;
      const outputPath = join(outputDir, outputFilename);

      try {
        // Create pipeline: crop -> resize -> format
        let pipeline = sharp(config.sourcePath)
          .extract(config.crop)
          .resize(size, size, {
            fit: 'cover',
            position: 'top', // Focus on the top of the cropped area (face)
          });

        // Apply format-specific settings
        switch (format) {
          case 'avif':
            pipeline = pipeline.avif(formatConfig);
            break;
          case 'webp':
            pipeline = pipeline.webp(formatConfig);
            break;
          case 'jpg':
            pipeline = pipeline.jpeg(formatConfig);
            break;
        }

        await pipeline.toFile(outputPath);

        const stats = await stat(outputPath);
        results.push({
          filename: outputFilename,
          size: stats.size,
          dimensions: size,
          format,
        });

        console.log(`   ✅ ${outputFilename} (${formatBytes(stats.size)})`);
      } catch (error) {
        console.error(`   ❌ ${outputFilename}: ${error.message}`);
      }
    }
  }

  return results;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Main function
 */
async function main() {
  console.log('🎯 Teacher Photo Cropping Script');
  console.log('================================');
  console.log('This script crops Iroel and Lia photos to match Yasmina\'s style\n');

  const allResults = [];

  for (const [teacherId, config] of Object.entries(TEACHERS_CONFIG)) {
    const results = await processTeacherPhoto(teacherId, config);
    allResults.push({ teacherId, results });
  }

  // Summary
  console.log('\n📊 Summary');
  console.log('----------');
  for (const { teacherId, results } of allResults) {
    const totalSize = results.reduce((sum, r) => sum + r.size, 0);
    console.log(`${teacherId}: ${results.length} files (${formatBytes(totalSize)})`);
  }

  console.log('\n✨ Done! Photos have been cropped and resized.');
  console.log('   The CSS scale transforms can now be removed from SalsaCubanaPage.tsx');
}

main().catch(console.error);
