import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, extname, basename } from "node:path";

const classes = ["dancehall", "twerk", "afrobeat"]; // añade más clases aquí: ["dancehall", "afrobeats", "bachata"]
const logos = true; // procesar logos
const sizesByAspect = {
  "16x9": [640, 1280, 1920],
  "1x1":  [480, 960, 1440],
  "4x5":  [640, 960, 1440],
  "3x4":  [640, 960, 1440],
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
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(rawDir)).filter(f => /\.(jpe?g|png|webp)$/i.test(f));

  for (const file of files) {
    const inPath = join(rawDir, file);
    const meta = await sharp(inPath).metadata();
    const aspect = guessAspect(meta.width ?? 1920, meta.height ?? 1080);
    const sizes = sizesByAspect[aspect] ?? sizesByAspect["16x9"];
    const base = basename(file, extname(file)).toLowerCase().replace(/\s+/g, "-");

    console.log(`  Processing: ${file} (${meta.width}x${meta.height}) → ${aspect}`);

    for (const w of sizes) {
      // WEBP
      await sharp(inPath)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(join(outDir, `${base}_${w}.webp`));

      // JPEG fallback
      await sharp(inPath)
        .resize({ width: w, withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(join(outDir, `${base}_${w}.jpg`));

      console.log(`    ✓ Generated ${base}_${w}.webp & .jpg`);
    }
  }

  console.log(`✔ ${cls}: todas las imágenes generadas\n`);
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

console.log("🎉 Build completo!");
