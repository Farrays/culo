/**
 * Class Cache Module
 * Shared cache layer for booking class data
 * Implements TTL-based caching with automatic cleanup
 */

import type { ClassData } from '../types/booking';

interface CacheEntry {
  data: ClassData[];
  timestamp: number;
  expiresAt: number;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_ENTRIES = 10;

class ClassCache {
  private cache: Map<string, CacheEntry> = new Map();
  private ttl: number;

  constructor(ttl = DEFAULT_TTL) {
    this.ttl = ttl;
  }

  private getKey(weekOffset: number, page?: number): string {
    return page !== undefined ? `week_${weekOffset}_page_${page}` : `week_${weekOffset}`;
  }

  private isValid(entry: CacheEntry): boolean {
    return Date.now() < entry.expiresAt;
  }

  get(weekOffset: number, page?: number): ClassData[] | null {
    const key = this.getKey(weekOffset, page);
    const entry = this.cache.get(key);

    if (entry && this.isValid(entry)) {
      return entry.data;
    }

    if (entry) this.cache.delete(key);
    return null;
  }

  set(weekOffset: number, data: ClassData[], page?: number): void {
    // Enforce max entries
    if (this.cache.size >= MAX_ENTRIES) {
      const oldest = [...this.cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      if (oldest) this.cache.delete(oldest[0]);
    }

    const key = this.getKey(weekOffset, page);
    const now = Date.now();
    this.cache.set(key, { data, timestamp: now, expiresAt: now + this.ttl });
  }

  append(weekOffset: number, newData: ClassData[]): void {
    const existing = this.get(weekOffset) || [];
    const existingIds = new Set(existing.map(c => c.id));
    const merged = [...existing, ...newData.filter(c => !existingIds.has(c.id))];
    this.set(weekOffset, merged);
  }

  has(weekOffset: number): boolean {
    return this.get(weekOffset) !== null;
  }

  invalidate(weekOffset?: number): void {
    if (weekOffset === undefined) {
      this.cache.clear();
    } else {
      for (const key of this.cache.keys()) {
        if (key.startsWith(`week_${weekOffset}`)) this.cache.delete(key);
      }
    }
  }
}

export const classCache = new ClassCache();
export { ClassCache };
