/**
 * Image Build System - Image Processor
 * =====================================
 * Core image processing with Sharp
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import pLimit from 'p-limit';
import { CONFIG } from '../config.mjs';
import { ImageCache } from '../utils/cache.mjs';
import { generateSeoFilename, generateBasePath } from '../utils/naming.mjs';
import { generatePlaceholders } from './placeholder-gen.mjs';
import { generateManifest } from './manifest-gen.mjs';
import {
  createProgressBar,
  logSection,
  logSuccess,
  logWarning,
  logError,
  logInfo,
  formatBytes,
} from '../utils/progress.mjs';

/**
 * Parse aspect ratio string to object
 * @param {string} ratio - Aspect ratio like "16:9"
 * @returns {Object|null} { width, height } or null
 */
function parseAspectRatio(ratio) {
  if (!ratio) return null;
  const ar = CONFIG.aspectRatios[ratio];
  if (ar) return { width: ar.width, height: ar.height };

  const match = ratio.match(/^(\d+):(\d+)$/);
  if (match) {
    return { width: parseInt(match[1]), height: parseInt(match[2]) };
  }
  return null;
}

/**
 * Calculate dimensions with aspect ratio constraint
 */
function calculateDimensions(metadata, targetWidth, aspectRatio, focusPoint) {
  if (!aspectRatio) {
    // Maintain original aspect ratio
    const targetHeight = Math.round((targetWidth / metadata.width) * metadata.height);
    return { width: targetWidth, height: targetHeight, crop: null };
  }

  // Calculate target height from aspect ratio
  const targetHeight = Math.round((targetWidth * aspectRatio.height) / aspectRatio.width);

  // Calculate crop region if needed
  const sourceAspect = metadata.width / metadata.height;
  const targetAspect = aspectRatio.width / aspectRatio.height;

  let crop = null;

  if (Math.abs(sourceAspect - targetAspect) > 0.01) {
    // Need to crop
    const focus = CONFIG.focusPoints[focusPoint] || CONFIG.focusPoints.center;

    let cropWidth, cropHeight, cropLeft, cropTop;

    if (sourceAspect > targetAspect) {
      // Image is wider than target - crop sides
      cropHeight = metadata.height;
      cropWidth = Math.round(cropHeight * targetAspect);
      cropTop = 0;
      cropLeft = Math.round((metadata.width - cropWidth) * focus.x);
    } else {
      // Image is taller than target - crop top/bottom
      cropWidth = metadata.width;
      cropHeight = Math.round(cropWidth / targetAspect);
      cropLeft = 0;
      cropTop = Math.round((metadata.height - cropHeight) * focus.y);
    }

    crop = {
      left: Math.max(0, cropLeft),
      top: Math.max(0, cropTop),
      width: Math.min(cropWidth, metadata.width),
      height: Math.min(cropHeight, metadata.height),
    };
  }

  return { width: targetWidth, height: targetHeight, crop };
}

/**
 * Process a single image to multiple sizes and formats
 */
async function processImage(inputPath, outputDir, className, options = {}) {
  const { crop: cropRatio, focus = 'center', force = false } = options;

  const originalName = basename(inputPath);
  const metadata = await sharp(inputPath).metadata();
  const aspectRatio = parseAspectRatio(cropRatio);

  const outputs = [];
  const limit = pLimit(CONFIG.processing.maxConcurrency);

  // Generate all size/format combinations
  const tasks = [];

  for (const width of CONFIG.breakpointSizes) {
    // Skip sizes larger than original
    if (width > metadata.width && !aspectRatio) continue;

    const { height, crop } = calculateDimensions(metadata, width, aspectRatio, focus);

    for (const format of CONFIG.formatOrder) {
      const outputFilename = generateSeoFilename({
        originalName,
        className,
        width,
        format: format === 'jpeg' ? 'jpg' : format,
      });

      const outputPath = join(outputDir, outputFilename);

      tasks.push(
        limit(async () => {
          try {
            let pipeline = sharp(inputPath);

            // Apply crop if needed
            if (crop) {
              pipeline = pipeline.extract(crop);
            }

            // Resize
            pipeline = pipeline.resize(width, height, {
              fit: 'cover',
              position: focus,
              withoutEnlargement: true,
            });

            // Apply format-specific settings
            switch (format) {
              case 'avif':
                pipeline = pipeline.avif(CONFIG.formats.avif);
                break;
              case 'webp':
                pipeline = pipeline.webp(CONFIG.formats.webp);
                break;
              case 'jpeg':
                pipeline = pipeline.jpeg(CONFIG.formats.jpeg);
                break;
            }

            // Write output
            await pipeline.toFile(outputPath);

            // Get file size
            const stats = await stat(outputPath);

            outputs.push({
              width,
              height,
              format: format === 'jpeg' ? 'jpg' : format,
              filename: outputFilename,
              path: `/images/classes/${className}/img/${outputFilename}`,
              size: stats.size,
            });
          } catch (error) {
            logError(`Failed: ${outputFilename} - ${error.message}`);
          }
        })
      );
    }
  }

  await Promise.all(tasks);

  return outputs;
}

/**
 * Process all images for a dance class
 */
export async function processClass(className, options = {}) {
  const paths = CONFIG.getClassPaths(className);
  const cache = new ImageCache();

  logSection(`Processing: ${className}`);

  // Ensure directories exist
  await mkdir(paths.img, { recursive: true });
  await mkdir(paths.manifest, { recursive: true });

  // Load cache
  await cache.load();

  // Get all raw images
  let files;
  try {
    files = (await readdir(paths.raw)).filter(
      (f) => CONFIG.patterns.input.test(f) && !CONFIG.patterns.ignore.test(f)
    );
  } catch (error) {
    logWarning(`No raw folder found for ${className}`);
    return { processed: 0, skipped: 0, generated: 0, totalBytes: 0 };
  }

  if (files.length === 0) {
    logInfo('No images to process');
    return { processed: 0, skipped: 0, generated: 0, totalBytes: 0 };
  }

  logInfo(`Found ${files.length} images`);

  const progressBar = createProgressBar();
  progressBar.start(files.length, 0, { filename: '' });

  let processed = 0;
  let skipped = 0;
  let totalGenerated = 0;
  let totalBytes = 0;

  for (const file of files) {
    const inputPath = join(paths.raw, file);

    progressBar.update(processed + skipped, { filename: file });

    // Check cache
    if (!options.force && !(await cache.needsProcessing(inputPath, options))) {
      skipped++;
      progressBar.update(processed + skipped, { filename: `[cached] ${file}` });
      continue;
    }

    // Process image
    const outputs = await processImage(inputPath, paths.img, className, options);

    // Generate placeholders
    const placeholders = await generatePlaceholders(inputPath);

    // Generate manifest
    await generateManifest({
      inputPath,
      className,
      outputs,
      placeholders,
      outputDir: paths.manifest,
    });

    // Update stats
    processed++;
    totalGenerated += outputs.length;
    totalBytes += outputs.reduce((sum, o) => sum + o.size, 0);

    // Mark as processed in cache
    cache.markProcessed(inputPath, options, {
      outputs: outputs.length,
      totalSize: outputs.reduce((sum, o) => sum + o.size, 0),
    });

    progressBar.update(processed + skipped, { filename: file });
  }

  progressBar.stop();

  // Save cache
  await cache.save();

  // Log summary
  logSuccess(`Processed ${processed} images`);
  if (skipped > 0) {
    logInfo(`Skipped ${skipped} cached images`);
  }
  logInfo(`Generated ${totalGenerated} files (${formatBytes(totalBytes)})`);

  return { processed, skipped, generated: totalGenerated, totalBytes };
}

/**
 * Process a single image with custom breakpoints (for special folders)
 */
async function processImageCustom(inputPath, outputDir, folderName, customBreakpoints, options = {}) {
  const { crop: cropRatio, focus = 'center' } = options;

  const originalName = basename(inputPath);
  const metadata = await sharp(inputPath).metadata();
  const aspectRatio = parseAspectRatio(cropRatio);

  const outputs = [];
  const limit = pLimit(CONFIG.processing.maxConcurrency);
  const tasks = [];

  for (const width of customBreakpoints) {
    if (width > metadata.width && !aspectRatio) continue;

    const { height, crop } = calculateDimensions(metadata, width, aspectRatio, focus);

    for (const format of CONFIG.formatOrder) {
      // Simple filename for special folders: {name}_{size}.{format}
      const baseName = basename(originalName, extname(originalName))
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-');
      const outputFilename = `${baseName}_${width}.${format === 'jpeg' ? 'jpg' : format}`;
      const outputPath = join(outputDir, outputFilename);

      tasks.push(
        limit(async () => {
          try {
            let pipeline = sharp(inputPath);

            if (crop) {
              pipeline = pipeline.extract(crop);
            }

            pipeline = pipeline.resize(width, height, {
              fit: 'cover',
              position: focus,
              withoutEnlargement: true,
            });

            switch (format) {
              case 'avif':
                pipeline = pipeline.avif(CONFIG.formats.avif);
                break;
              case 'webp':
                pipeline = pipeline.webp(CONFIG.formats.webp);
                break;
              case 'jpeg':
                pipeline = pipeline.jpeg(CONFIG.formats.jpeg);
                break;
            }

            await pipeline.toFile(outputPath);
            const stats = await stat(outputPath);

            outputs.push({
              width,
              height,
              format: format === 'jpeg' ? 'jpg' : format,
              filename: outputFilename,
              path: `/images/${folderName}/img/${outputFilename}`,
              size: stats.size,
            });
          } catch (error) {
            logError(`Failed: ${outputFilename} - ${error.message}`);
          }
        })
      );
    }
  }

  await Promise.all(tasks);
  return outputs;
}

/**
 * Process a special folder (categories, teachers, hero, etc.)
 */
export async function processSpecialFolder(folderName, options = {}) {
  const folderConfig = CONFIG.specialFolders[folderName];
  if (!folderConfig) {
    logWarning(`Unknown special folder: ${folderName}`);
    return { processed: 0, skipped: 0, generated: 0, totalBytes: 0 };
  }

  const paths = CONFIG.getSpecialPaths(folderName);
  const cache = new ImageCache();

  logSection(`Processing: ${folderName} (${folderConfig.description})`);

  await mkdir(paths.img, { recursive: true });
  await mkdir(paths.manifest, { recursive: true });
  await cache.load();

  let files;
  try {
    files = (await readdir(paths.raw)).filter(
      (f) => CONFIG.patterns.input.test(f) && !CONFIG.patterns.ignore.test(f)
    );
  } catch {
    logWarning(`No raw folder found for ${folderName}`);
    return { processed: 0, skipped: 0, generated: 0, totalBytes: 0 };
  }

  if (files.length === 0) {
    logInfo('No images to process');
    return { processed: 0, skipped: 0, generated: 0, totalBytes: 0 };
  }

  logInfo(`Found ${files.length} images`);

  const progressBar = createProgressBar();
  progressBar.start(files.length, 0, { filename: '' });

  let processed = 0;
  let skipped = 0;
  let totalGenerated = 0;
  let totalBytes = 0;

  const processOptions = {
    ...options,
    crop: options.crop || folderConfig.aspectRatio,
    focus: options.focus || folderConfig.focus || 'center',
  };

  for (const file of files) {
    const inputPath = join(paths.raw, file);
    progressBar.update(processed + skipped, { filename: file });

    if (!options.force && !(await cache.needsProcessing(inputPath, processOptions))) {
      skipped++;
      progressBar.update(processed + skipped, { filename: `[cached] ${file}` });
      continue;
    }

    const outputs = await processImageCustom(
      inputPath,
      paths.img,
      folderName,
      folderConfig.breakpoints,
      processOptions
    );

    const placeholders = await generatePlaceholders(inputPath);

    // Custom manifest for special folders
    await generateManifest({
      inputPath,
      className: folderName,
      outputs,
      placeholders,
      outputDir: paths.manifest,
    });

    processed++;
    totalGenerated += outputs.length;
    totalBytes += outputs.reduce((sum, o) => sum + o.size, 0);

    cache.markProcessed(inputPath, processOptions, {
      outputs: outputs.length,
      totalSize: outputs.reduce((sum, o) => sum + o.size, 0),
    });

    progressBar.update(processed + skipped, { filename: file });
  }

  progressBar.stop();
  await cache.save();

  logSuccess(`Processed ${processed} images`);
  if (skipped > 0) {
    logInfo(`Skipped ${skipped} cached images`);
  }
  logInfo(`Generated ${totalGenerated} files (${formatBytes(totalBytes)})`);

  return { processed, skipped, generated: totalGenerated, totalBytes };
}

/**
 * Process all classes
 */
export async function processAll(options = {}) {
  const classes = options.classes || CONFIG.classes;

  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalGenerated = 0;
  let totalBytes = 0;

  // Process all dance classes
  for (const className of classes) {
    const result = await processClass(className, options);
    totalProcessed += result.processed;
    totalSkipped += result.skipped;
    totalGenerated += result.generated;
    totalBytes += result.totalBytes;
  }

  // Process special folders if requested
  if (options.includeSpecial) {
    for (const folderName of Object.keys(CONFIG.specialFolders)) {
      const result = await processSpecialFolder(folderName, options);
      totalProcessed += result.processed;
      totalSkipped += result.skipped;
      totalGenerated += result.generated;
      totalBytes += result.totalBytes;
    }
  }

  return {
    processed: totalProcessed,
    skipped: totalSkipped,
    generated: totalGenerated,
    totalBytes,
  };
}

export default {
  processImage,
  processImageCustom,
  processClass,
  processSpecialFolder,
  processAll,
};
