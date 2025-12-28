#!/usr/bin/env node

/**
 * Image Build System - CLI
 * ========================
 * Enterprise-level image optimization for Farray's Dance Center
 *
 * Usage:
 *   npm run build:images                       # Process all classes
 *   npm run build:images -- --class=dancehall  # Process single class
 *   npm run build:images -- --force            # Force reprocess (ignore cache)
 *   npm run build:images -- --crop=16:9        # Force aspect ratio
 *   npm run build:images -- --focus=center     # Set focus point for cropping
 *   npm run build:images -- --dry-run          # Simulate without writing
 *   npm run build:images -- --help             # Show help
 */

import { parseArgs } from 'node:util';
import { CONFIG } from './config.mjs';
import { processClass, processSpecialFolder, processAll } from './processors/image-processor.mjs';
import { logHeader, logStats, logSection, logInfo, logError, logWarning } from './utils/progress.mjs';

// Parse command line arguments
const { values: args } = parseArgs({
  options: {
    class: { type: 'string', short: 'c' },
    folder: { type: 'string', short: 'd' },
    force: { type: 'boolean', short: 'f', default: false },
    crop: { type: 'string' },
    focus: { type: 'string', default: 'center' },
    'dry-run': { type: 'boolean', default: false },
    verbose: { type: 'boolean', short: 'v', default: false },
    help: { type: 'boolean', short: 'h', default: false },
    list: { type: 'boolean', short: 'l', default: false },
    all: { type: 'boolean', short: 'a', default: false },
  },
  allowPositionals: true,
});

// Show help
if (args.help) {
  console.log(`
  Image Build System - Enterprise Edition
  =======================================

  Optimizes images for web with multiple formats and sizes.
  Generates AVIF, WebP, and JPEG in responsive breakpoints.

  Usage:
    npm run build:images [options]

  Options:
    -c, --class <name>    Process a specific dance class
    -d, --folder <name>   Process a special folder (categories, teachers, hero, blog)
    -a, --all             Process all classes AND special folders
    -f, --force           Ignore cache and reprocess all images
    --crop <ratio>        Force aspect ratio (16:9, 4:3, 1:1, etc.)
    --focus <point>       Focus point for cropping
    --dry-run             Simulate without writing files
    -v, --verbose         Show detailed output
    -l, --list            List available classes and folders
    -h, --help            Show this help message

  Examples:
    npm run build:images                           # All classes
    npm run build:images -- --class=dancehall      # Single class
    npm run build:images -- --folder=categories    # Categories folder
    npm run build:images -- --all --force          # Everything, force reprocess
    npm run build:images -- --crop=16:9            # With aspect ratio

  Special Folders:
    categories  - Category cards (Home/Hub) - 4:3 aspect ratio
    teachers    - Teacher photos - 1:1 square
    hero        - Hero banners - 16:9 widescreen
    blog        - Blog article images - 16:9
    logo        - Logo images - original aspect ratio

  Dance Classes: ${CONFIG.classes.length} available (use --list to see all)

  Output formats: AVIF (best), WebP (modern), JPEG (fallback)
  `);
  process.exit(0);
}

// List classes and special folders
if (args.list) {
  console.log('\n  Dance Classes:\n');
  CONFIG.classes.forEach((c, i) => {
    console.log(`    ${(i + 1).toString().padStart(2)}. ${c}`);
  });

  console.log('\n  Special Folders:\n');
  Object.entries(CONFIG.specialFolders).forEach(([key, config]) => {
    const ratio = config.aspectRatio || 'original';
    console.log(`    - ${key.padEnd(12)} ${config.description} (${ratio})`);
  });

  console.log(`\n  Total: ${CONFIG.classes.length} classes + ${Object.keys(CONFIG.specialFolders).length} special folders\n`);
  process.exit(0);
}

// Validate class name if provided
if (args.class && !CONFIG.classes.includes(args.class)) {
  logError(`Unknown class: ${args.class}`);
  console.log(`\nAvailable classes: ${CONFIG.classes.join(', ')}`);
  process.exit(1);
}

// Validate folder name if provided
if (args.folder && !CONFIG.specialFolders[args.folder]) {
  logError(`Unknown folder: ${args.folder}`);
  console.log(`\nAvailable folders: ${Object.keys(CONFIG.specialFolders).join(', ')}`);
  process.exit(1);
}

// Validate focus point
const validFocusPoints = Object.keys(CONFIG.focusPoints);
if (args.focus && !validFocusPoints.includes(args.focus)) {
  logError(`Invalid focus point: ${args.focus}`);
  console.log(`\nValid focus points: ${validFocusPoints.join(', ')}`);
  process.exit(1);
}

// Main execution
async function main() {
  const startTime = Date.now();

  logHeader('IMAGE BUILD SYSTEM');
  logInfo(`Version: ${CONFIG.version}`);
  logInfo(`Formats: ${CONFIG.formatOrder.join(', ').toUpperCase()}`);
  logInfo(`Breakpoints: ${CONFIG.breakpointSizes.join('px, ')}px`);

  if (args.crop) {
    logInfo(`Aspect ratio: ${args.crop}`);
  }
  if (args.focus !== 'center') {
    logInfo(`Focus point: ${args.focus}`);
  }
  if (args.force) {
    logInfo('Mode: Force reprocess (ignoring cache)');
  }
  if (args['dry-run']) {
    logInfo('Mode: Dry run (no files written)');
  }

  const options = {
    force: args.force,
    crop: args.crop,
    focus: args.focus,
    dryRun: args['dry-run'],
    verbose: args.verbose,
    includeSpecial: args.all,
  };

  let result;

  try {
    if (args.folder) {
      // Process single special folder
      result = await processSpecialFolder(args.folder, options);
    } else if (args.class) {
      // Process single class
      result = await processClass(args.class, options);
    } else if (args.all) {
      // Process everything
      logSection(`Processing ${CONFIG.classes.length} classes + ${Object.keys(CONFIG.specialFolders).length} special folders`);
      result = await processAll(options);
    } else {
      // Process all classes (default)
      logSection(`Processing ${CONFIG.classes.length} classes`);
      result = await processAll(options);
    }

    const duration = Date.now() - startTime;

    logStats({
      ...result,
      duration,
    });

    logHeader('COMPLETE');
  } catch (error) {
    logError(`Build failed: ${error.message}`);
    if (args.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

main();
