/**
 * Script para optimizar imágenes de la carpeta varios
 * Convierte a WebP, redimensiona y comprime
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const SOURCE_DIR = './public/images/varios';
const OUTPUT_DIR = './public/images/optimized';

// Configuración de optimización
const CONFIG = {
  // Tamaño máximo (ancho)
  maxWidth: 1920,
  // Calidad WebP (0-100)
  webpQuality: 82,
  // Calidad JPG fallback
  jpgQuality: 85,
  // También crear versión pequeña para thumbnails
  thumbWidth: 600,
};

async function optimizeImages() {
  console.log('🖼️  Iniciando optimización de imágenes...\n');

  // Crear directorio de salida si no existe
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(`${OUTPUT_DIR}/thumbs`, { recursive: true });

  // Leer archivos del directorio fuente
  const files = await fs.readdir(SOURCE_DIR);
  const imageFiles = files.filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  );

  console.log(`📁 Encontradas ${imageFiles.length} imágenes para optimizar\n`);

  let totalSavedMB = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(SOURCE_DIR, file);
    const baseName = path.parse(file).name
      // Normalizar nombres (quitar caracteres especiales)
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-');

    const outputWebP = path.join(OUTPUT_DIR, `${baseName}.webp`);
    const outputJpg = path.join(OUTPUT_DIR, `${baseName}.jpg`);
    const outputThumb = path.join(OUTPUT_DIR, 'thumbs', `${baseName}-thumb.webp`);

    try {
      // Obtener tamaño original
      const stats = await fs.stat(inputPath);
      const originalSizeMB = stats.size / (1024 * 1024);

      // Leer imagen y obtener metadata
      const image = sharp(inputPath);
      const metadata = await image.metadata();

      console.log(`📷 ${file}`);
      console.log(`   Original: ${originalSizeMB.toFixed(2)} MB (${metadata.width}x${metadata.height})`);

      // Calcular nuevo ancho manteniendo aspect ratio
      const newWidth = Math.min(metadata.width, CONFIG.maxWidth);

      // Crear versión WebP optimizada
      await sharp(inputPath)
        .resize(newWidth, null, { withoutEnlargement: true })
        .webp({ quality: CONFIG.webpQuality })
        .toFile(outputWebP);

      // Crear versión JPG fallback
      await sharp(inputPath)
        .resize(newWidth, null, { withoutEnlargement: true })
        .jpeg({ quality: CONFIG.jpgQuality, mozjpeg: true })
        .toFile(outputJpg);

      // Crear thumbnail
      await sharp(inputPath)
        .resize(CONFIG.thumbWidth, null, { withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outputThumb);

      // Calcular ahorro
      const webpStats = await fs.stat(outputWebP);
      const newSizeMB = webpStats.size / (1024 * 1024);
      const savedMB = originalSizeMB - newSizeMB;
      totalSavedMB += savedMB;

      console.log(`   WebP: ${newSizeMB.toFixed(2)} MB (ahorro: ${savedMB.toFixed(2)} MB)`);
      console.log(`   ✅ Guardado como: ${baseName}.webp\n`);

    } catch (error) {
      console.error(`   ❌ Error procesando ${file}:`, error.message, '\n');
    }
  }

  console.log('═'.repeat(50));
  console.log(`\n✨ Optimización completada!`);
  console.log(`   Total ahorrado: ${totalSavedMB.toFixed(2)} MB`);
  console.log(`   Imágenes en: ${OUTPUT_DIR}`);
}

optimizeImages().catch(console.error);
