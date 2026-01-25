/**
 * Re-optimize Charlie Breezy ONLY
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SOURCE_FILE = './public/images/teachers/raw/Profesor Charlie Breezzy.png';
const OUTPUT_BASE = './public/images/teachers/img/profesor-charlie-breezy';
const SIZES = [320, 640, 960];
const FORMATS = {
  avif: { quality: 75, effort: 4 },
  webp: { quality: 85 },
  jpg: { quality: 85, mozjpeg: true },
};

console.log('🔄 Re-procesando SOLO Charlie Breezy...\n');

for (const size of SIZES) {
  // AVIF
  await sharp(SOURCE_FILE)
    .resize(size, size, { fit: 'cover', position: 'north' })
    .avif(FORMATS.avif)
    .toFile(`${OUTPUT_BASE}_${size}.avif`);
  
  // WebP
  await sharp(SOURCE_FILE)
    .resize(size, size, { fit: 'cover', position: 'north' })
    .webp(FORMATS.webp)
    .toFile(`${OUTPUT_BASE}_${size}.webp`);
  
  // JPG
  await sharp(SOURCE_FILE)
    .resize(size, size, { fit: 'cover', position: 'north' })
    .jpeg(FORMATS.jpg)
    .toFile(`${OUTPUT_BASE}_${size}.jpg`);
  
  console.log(`✅ ${size}px generado`);
}

console.log('\n✨ Charlie Breezy re-optimizado exitosamente!');
