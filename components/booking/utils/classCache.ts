/**
 * Class Cache Module
 * Simple cache for booking class data
 * Stores ALL classes and lets consumers filter by week
 * Cache key includes date to ensure fresh data each day
 */

import type { ClassData } from '../types/booking';

interface CacheEntry {
  data: ClassData[];
  timestamp: number;
  expiresAt: number;
  dateKey: string;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

// Get today's date in YYYY-MM-DD format
function getTodayKey(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

class ClassCache {
  private entry: CacheEntry | null = null;
  private ttl: number;

  constructor(ttl = DEFAULT_TTL) {
    this.ttl = ttl;
  }

  private isValid(): boolean {
    if (!this.entry) return false;
    // Check TTL and that it's from today
    const isNotExpired = Date.now() < this.entry.expiresAt;
    const isSameDay = this.entry.dateKey === getTodayKey();
    return isNotExpired && isSameDay;
  }

  // Get all cached classes (unfiltered)
  getAll(): ClassData[] | null {
    if (this.isValid() && this.entry) {
      return this.entry.data;
    }
    this.entry = null;
    return null;
  }

  // Store all classes
  setAll(data: ClassData[]): void {
    const now = Date.now();
    this.entry = {
      data,
      timestamp: now,
      expiresAt: now + this.ttl,
      dateKey: getTodayKey(),
    };
  }

  // Check if cache has valid data
  hasData(): boolean {
    return this.isValid();
  }

  // Clear the cache
  invalidate(): void {
    this.entry = null;
  }
}

export const classCache = new ClassCache();
export { ClassCache };
