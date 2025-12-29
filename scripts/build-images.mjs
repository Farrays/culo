import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";

// ============================================================================
// ENTERPRISE IMAGE BUILD SCRIPT
// ============================================================================
// Generates AVIF, WebP, and JPEG at 6 responsive breakpoints
// Matching OptimizedImage component: [320, 640, 768, 1024, 1440, 1920]
// ============================================================================

const classes = ["dancehall", "twerk", "afrobeat", "hip-hop", "hip-hop-reggaeton", "sexy-reggaeton", "reggaeton-cubano", "femmology", "sexy-style", "modern-jazz", "ballet", "contemporaneo", "afro-contemporaneo", "afro-jazz", "bachata", "bachata-lady-style", "bum-bum", "folklore-cubano", "cuerpo-fit", "salsa-lady-style", "salsa-lady-timba", "heels", "timba", "salsa-cubana"]; // añade más clases aquí
const logos = true; // procesar logos
const teachers = true; // procesar fotos de profesores
const teacherSizes = [320, 640, 960]; // tamaños para fotos de profesores (cuadradas)

// Enterprise: 6 breakpoints matching OptimizedImage component
const sizesByAspect = {
  "16x9": [320, 640, 768, 1024, 1440, 1920],
  "1x1":  [320, 640, 768, 1024, 1440, 1920],
  "4x5":  [320, 640, 768, 1024, 1440, 1920],
  "3x4":  [320, 640, 768, 1024, 1440, 1920],
};
const logoSizes = [128, 256, 512, 1024]; // tamaños específicos para logos

// Asigna relación objetivo por archivo; si no, usa heurística 16:9
const guessAspect = (w, h) => {
  const r = w / h;
  if (Math.abs(r - 1) < 0.08) return "1x1";
  if (r > 1.6) return "16x9";
  if (r < 0.9) return "3x4"; // vertical
  return "4x5";
};

for (const cls of classes) {
  const rawDir = `public/images/classes/${cls}/raw`;
  const outDir = `public/images/classes/${cls}/img`;

  try {
    await mkdir(outDir, { recursive: true });

    let files = [];
    try {
      files = (await readdir(rawDir)).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
    } catch {
      console.log(`  ⚠️ No se encontró carpeta ${rawDir} - saltando...`);
      continue;
    }

    if (files.length === 0) {
      console.log(`  ℹ️ ${cls}: sin imágenes raw para procesar`);
      continue;
    }

    for (const file of files) {
      const inPath = join(rawDir, file);
      const meta = await sharp(inPath).metadata();
      const aspect = guessAspect(meta.width ?? 1920, meta.height ?? 1080);
      const sizes = sizesByAspect[aspect] ?? sizesByAspect["16x9"];
      const base = basename(file, extname(file)).toLowerCase().replace(/\s+/g, "-");

      console.log(`  Processing: ${file} (${meta.width}x${meta.height}) → ${aspect}`);

      for (const w of sizes) {
        // AVIF (best compression - Enterprise)
        await sharp(inPath)
          .resize({ width: w, withoutEnlargement: true })
          .avif({ quality: 65, effort: 4 })
          .toFile(join(outDir, `${base}_${w}.avif`));

        // WEBP (good compression, wide support)
        await sharp(inPath)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 78 })
          .toFile(join(outDir, `${base}_${w}.webp`));

        // JPEG fallback (universal support)
        await sharp(inPath)
          .resize({ width: w, withoutEnlargement: true })
          .jpeg({ quality: 78, mozjpeg: true })
          .toFile(join(outDir, `${base}_${w}.jpg`));

        console.log(`    ✓ Generated ${base}_${w} (.avif, .webp, .jpg)`);
      }
    }

    console.log(`✔ ${cls}: todas las imágenes generadas\n`);
  } catch (error) {
    console.error(`  ❌ Error procesando ${cls}:`, error.message);
  }
}

// Procesar logos
if (logos) {
  console.log("\n📍 Procesando logos...\n");
  const rawDir = `public/images/logo/raw`;
  const outDir = `public/images/logo/img`;
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(rawDir)).filter(f => /\.(jpe?g|png|webp|svg)$/i.test(f));

  for (const file of files) {
    const inPath = join(rawDir, file);
    const ext = extname(file).toLowerCase();
    const base = basename(file, ext).toLowerCase().replace(/\s+/g, "-");

    // Si es SVG, solo copiarlo (SVG ya es vectorial y escalable)
    if (ext === ".svg") {
      console.log(`  Skipping SVG (already optimized): ${file}`);
      continue;
    }

    const meta = await sharp(inPath).metadata();
    console.log(`  Processing logo: ${file} (${meta.width}x${meta.height})`);

    for (const w of logoSizes) {
      // PNG con transparencia (logos suelen necesitar transparencia)
      await sharp(inPath)
        .resize({ width: w, withoutEnlargement: true })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(join(outDir, `${base}_${w}.png`));

      // WEBP con transparencia
      await sharp(inPath)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 90, alphaQuality: 100 })
        .toFile(join(outDir, `${base}_${w}.webp`));

      console.log(`    ✓ Generated ${base}_${w}.png & .webp`);
    }
  }

  console.log(`✔ Logos: todas las imágenes generadas\n`);
}

// Procesar fotos de profesores
if (teachers) {
  console.log("\n👨‍🏫 Procesando fotos de profesores...\n");
  const rawDir = `public/images/teachers/raw`;
  const outDir = `public/images/teachers/img`;
  await mkdir(outDir, { recursive: true });

  let files = [];
  try {
    files = (await readdir(rawDir)).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
  } catch {
    console.log(`  ⚠️ No se encontró carpeta ${rawDir} o está vacía`);
  }

  for (const file of files) {
    const inPath = join(rawDir, file);
    const ext = extname(file).toLowerCase();
    const base = basename(file, ext).toLowerCase().replace(/\s+/g, "-");

    const meta = await sharp(inPath).metadata();
    console.log(`  Processing teacher: ${file} (${meta.width}x${meta.height})`);

    for (const w of teacherSizes) {
      // AVIF (best compression - Enterprise)
      await sharp(inPath)
        .resize({ width: w, height: w, fit: 'cover', position: 'north' })
        .avif({ quality: 75, effort: 4 })
        .toFile(join(outDir, `${base}_${w}.avif`));

      // WEBP
      await sharp(inPath)
        .resize({ width: w, height: w, fit: 'cover', position: 'north' })
        .webp({ quality: 85 })
        .toFile(join(outDir, `${base}_${w}.webp`));

      // JPEG fallback
      await sharp(inPath)
        .resize({ width: w, height: w, fit: 'cover', position: 'north' })
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(join(outDir, `${base}_${w}.jpg`));

      console.log(`    ✓ Generated ${base}_${w} (.avif, .webp, .jpg)`);
    }
  }

  console.log(`✔ Teachers: todas las imágenes generadas\n`);
}

// ============================================================================
// PROCESAR FOTOS DE SALAS DE ALQUILER
// ============================================================================
console.log("\n🏢 Procesando fotos de salas de alquiler...\n");
const salasRawDir = `public/images/salas/raw`;
const salasOutDir = `public/images/salas/img`;
await mkdir(salasOutDir, { recursive: true });

let salasFiles = [];
try {
  salasFiles = (await readdir(salasRawDir)).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
} catch {
  console.log(`  ⚠️ No se encontró carpeta ${salasRawDir} o está vacía`);
}

// Enterprise: 6 breakpoints for sala images
const salasSizes = [320, 640, 768, 1024, 1440, 1920];

for (const file of salasFiles) {
  const inPath = join(salasRawDir, file);
  const ext = extname(file).toLowerCase();
  const base = basename(file, ext).toLowerCase().replace(/\s+/g, "-");

  const meta = await sharp(inPath).metadata();
  console.log(`  Processing sala: ${file} (${meta.width}x${meta.height})`);

  for (const w of salasSizes) {
    // AVIF (best compression - Enterprise)
    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .avif({ quality: 70, effort: 4 })
      .toFile(join(salasOutDir, `${base}_${w}.avif`));

    // WEBP (good compression, wide support)
    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(join(salasOutDir, `${base}_${w}.webp`));

    // JPEG fallback (universal support)
    await sharp(inPath)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(join(salasOutDir, `${base}_${w}.jpg`));

    console.log(`    ✓ Generated ${base}_${w} (.avif, .webp, .jpg)`);
  }
}

console.log(`✔ Salas: todas las imágenes generadas\n`);

console.log("🎉 Build completo!");
