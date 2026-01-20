/**
 * Class Cache Module
 * Shared cache layer for booking class data
 * Implements TTL-based caching with automatic cleanup
 * Cache keys include today's date to ensure fresh data each day
 */

import type { ClassData } from '../types/booking';

interface CacheEntry {
  data: ClassData[];
  timestamp: number;
  expiresAt: number;
  dateKey: string; // Today's date when cached
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes (reduced for freshness)
const MAX_ENTRIES = 10;

// Get today's date in YYYY-MM-DD format (Spain timezone)
function getTodayKey(): string {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Madrid',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    // Fallback to local date
    return new Date().toISOString().split('T')[0] ?? '';
  }
}

class ClassCache {
  private cache: Map<string, CacheEntry> = new Map();
  private ttl: number;
  private lastDateKey: string = getTodayKey();

  constructor(ttl = DEFAULT_TTL) {
    this.ttl = ttl;
  }

  // Check if date changed and invalidate all cache if so
  private checkDateChange(): void {
    const currentDateKey = getTodayKey();
    if (currentDateKey !== this.lastDateKey) {
      console.warn('[classCache] Date changed, invalidating all cache');
      this.cache.clear();
      this.lastDateKey = currentDateKey;
    }
  }

  private getKey(weekOffset: number, page?: number): string {
    const dateKey = getTodayKey();
    return page !== undefined
      ? `${dateKey}_week_${weekOffset}_page_${page}`
      : `${dateKey}_week_${weekOffset}`;
  }

  private isValid(entry: CacheEntry): boolean {
    // Check both TTL and that it's from today
    return Date.now() < entry.expiresAt && entry.dateKey === getTodayKey();
  }

  get(weekOffset: number, page?: number): ClassData[] | null {
    this.checkDateChange(); // Invalidate if date changed

    const key = this.getKey(weekOffset, page);
    const entry = this.cache.get(key);

    if (entry && this.isValid(entry)) {
      return entry.data;
    }

    if (entry) this.cache.delete(key);
    return null;
  }

  set(weekOffset: number, data: ClassData[], page?: number): void {
    this.checkDateChange(); // Invalidate if date changed

    // Enforce max entries
    if (this.cache.size >= MAX_ENTRIES) {
      const oldest = [...this.cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      if (oldest) this.cache.delete(oldest[0]);
    }

    const key = this.getKey(weekOffset, page);
    const now = Date.now();
    const dateKey = getTodayKey();
    this.cache.set(key, { data, timestamp: now, expiresAt: now + this.ttl, dateKey });
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
