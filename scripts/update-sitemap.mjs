#!/usr/bin/env node

/**
 * Auto-update sitemap.xml with current date
 * Run this script during build process to keep lastmod dates current
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const sitemapPath = join(projectRoot, 'sitemap.xml');

try {
  console.log('📝 Updating sitemap.xml with current date...');
  
  const currentDate = new Date().toISOString().split('T')[0];
  let content = readFileSync(sitemapPath, 'utf-8');
  
  // Replace all lastmod dates with current date
  const updated = content.replace(
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g,
    `<lastmod>${currentDate}</lastmod>`
  );
  
  // Count replacements
  const matches = content.match(/<lastmod>/g);
  const count = matches ? matches.length : 0;
  
  writeFileSync(sitemapPath, updated, 'utf-8');
  
  console.log(`✅ Updated ${count} <lastmod> entries to ${currentDate}`);
  console.log(`📍 Sitemap location: ${sitemapPath}`);
} catch (error) {
  console.error('❌ Failed to update sitemap:', error.message);
  process.exit(1);
}
