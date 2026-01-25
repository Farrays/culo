/**
 * Generate AVIF from existing WebP images
 *
 * Usage: node scripts/generate-avif-from-webp.mjs
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const BLOG_DIR = './public/images/blog';

const FOLDERS = [
  'beneficios-salsa',
  'clases-principiantes',
  'como-perder-miedo',
  'hablemos-salsa',
  'historia-bachata',
  'historia-salsa',
  'salsa-ritmo',
  'salsa-vs-bachata',
];

const CONFIG = {
  avif: { quality: 65, effort: 4 },
};

async function generateAvif() {
  console.log('='.repeat(60));
  console.log('  AVIF GENERATION FROM WEBP');
  console.log('='.repeat(60));

  let totalGenerated = 0;

  for (const folder of FOLDERS) {
    const folderPath = path.join(BLOG_DIR, folder);

    try {
      await fs.access(folderPath);
    } catch {
      console.log(`[SKIP] ${folder} - not found`);
      continue;
    }

    console.log(`\n[PROCESS] ${folder}/`);

    // Get all WebP files
    const files = await fs.readdir(folderPath);
    const webpFiles = files.filter(f => f.endsWith('.webp'));

    for (const webpFile of webpFiles) {
      const webpPath = path.join(folderPath, webpFile);
      const avifFile = webpFile.replace('.webp', '.avif');
      const avifPath = path.join(folderPath, avifFile);

      // Check if AVIF already exists
      try {
        await fs.access(avifPath);
        console.log(`  [EXISTS] ${avifFile}`);
        continue;
      } catch {
        // AVIF doesn't exist, generate it
      }

      await sharp(webpPath)
        .avif(CONFIG.avif)
        .toFile(avifPath);

      const webpStats = await fs.stat(webpPath);
      const avifStats = await fs.stat(avifPath);
      const savings = (((webpStats.size - avifStats.size) / webpStats.size) * 100).toFixed(0);

      console.log(`  -> ${avifFile} (${(avifStats.size / 1024).toFixed(0)}KB, ${savings}% smaller than WebP)`);
      totalGenerated++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`  COMPLETE: Generated ${totalGenerated} AVIF files`);
  console.log('='.repeat(60));
}

generateAvif().catch(console.error);
