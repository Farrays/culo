#!/usr/bin/env node
/**
 * Fix Namespace Loading in Migrated Components
 *
 * Updates all components to load all necessary namespaces instead of just ['common'].
 * This ensures translations display correctly instead of showing keys.
 *
 * Usage:
 *   node scripts/fix-namespace-loading.mjs
 */

import fs from 'fs';
import { glob } from 'glob';

console.log('\n🔧 Fixing namespace loading in all components...\n');

// All available namespaces
const ALL_NAMESPACES = ['common', 'booking', 'schedule', 'calendar', 'home', 'classes', 'blog', 'faq', 'about', 'contact', 'pages'];

// Find all .tsx and .ts files in components directory
const files = glob.sync('components/**/*.{tsx,ts}', {
  ignore: ['**/*.test.tsx', '**/*.test.ts', '**/__tests__/**']
});

let fixedCount = 0;
let skippedCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;

  // Replace useTranslation(['common']) with all namespaces
  content = content.replace(
    /useTranslation\(\['common'\]\)/g,
    `useTranslation(['common', 'booking', 'schedule', 'calendar', 'home', 'classes', 'blog', 'faq', 'about', 'contact', 'pages'])`
  );

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Fixed: ${filePath}`);
    fixedCount++;
  } else {
    skippedCount++;
  }
});

console.log(`\n✅ Namespace loading fix complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Skipped: ${skippedCount} files (already correct or not using useTranslation)`);
console.log(`\n📝 All components now load all namespaces to ensure translations display correctly.\n`);
