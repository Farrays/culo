/**
 * Image Build System - Cache Manager
 * ===================================
 * Intelligent caching to avoid reprocessing unchanged images
 */

import { createHash } from 'crypto';
import { readFile, writeFile, mkdir, access } from 'fs/promises';
import { dirname, join } from 'path';
import { CONFIG } from '../config.mjs';

const CACHE_FILE = join(CONFIG.paths.cache, 'image-cache.json');

export class ImageCache {
  constructor() {
    this.cache = new Map();
    this.dirty = false;
  }

  /**
   * Load cache from disk
   */
  async load() {
    try {
      await access(CACHE_FILE);
      const data = await readFile(CACHE_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      this.cache = new Map(Object.entries(parsed.entries || {}));
      console.log(`  Cache loaded: ${this.cache.size} entries`);
    } catch {
      this.cache = new Map();
      console.log('  Cache: Starting fresh');
    }
  }

  /**
   * Save cache to disk
   */
  async save() {
    if (!this.dirty) return;

    try {
      await mkdir(dirname(CACHE_FILE), { recursive: true });
      const data = {
        version: CONFIG.version,
        generatedAt: new Date().toISOString(),
        entries: Object.fromEntries(this.cache),
      };
      await writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
      console.log(`  Cache saved: ${this.cache.size} entries`);
    } catch (error) {
      console.error('  Cache save failed:', error.message);
    }
  }

  /**
   * Calculate MD5 hash of a file
   */
  async getFileHash(filePath) {
    try {
      const content = await readFile(filePath);
      return createHash('md5').update(content).digest('hex');
    } catch {
      return null;
    }
  }

  /**
   * Generate a unique cache key for an image
   */
  getCacheKey(filePath, options = {}) {
    const parts = [
      filePath,
      CONFIG.version,
      JSON.stringify(options),
    ];
    return createHash('md5').update(parts.join('|')).digest('hex').slice(0, 16);
  }

  /**
   * Check if an image needs processing
   * @returns {boolean} true if needs processing, false if cached
   */
  async needsProcessing(filePath, options = {}) {
    const cacheKey = this.getCacheKey(filePath, options);
    const currentHash = await this.getFileHash(filePath);

    if (!currentHash) {
      return true; // File doesn't exist or can't be read
    }

    const cached = this.cache.get(cacheKey);

    if (cached && cached.hash === currentHash) {
      return false; // File hasn't changed
    }

    // Mark for update
    this.cache.set(cacheKey, {
      hash: currentHash,
      processedAt: new Date().toISOString(),
      options,
    });
    this.dirty = true;

    return true;
  }

  /**
   * Mark an image as processed
   */
  markProcessed(filePath, options = {}, metadata = {}) {
    const cacheKey = this.getCacheKey(filePath, options);
    const existing = this.cache.get(cacheKey) || {};

    this.cache.set(cacheKey, {
      ...existing,
      ...metadata,
      processedAt: new Date().toISOString(),
    });
    this.dirty = true;
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.dirty = true;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      entries: this.cache.size,
      dirty: this.dirty,
    };
  }
}

export default ImageCache;
