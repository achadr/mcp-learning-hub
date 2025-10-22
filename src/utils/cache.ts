/**
 * Simple in-memory cache with TTL (Time To Live)
 * Used to cache API responses and improve performance
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class InMemoryCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private defaultTTL: number;

  /**
   * @param defaultTTL - Default time to live in milliseconds (default: 1 hour)
   */
  constructor(defaultTTL: number = 60 * 60 * 1000) {
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Set a value in the cache
   */
  set(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data: value, expiresAt });
    console.log(`[Cache] Set: ${key} (expires in ${Math.round((ttl || this.defaultTTL) / 1000)}s)`);
  }

  /**
   * Get a value from the cache
   * Returns undefined if key doesn't exist or has expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      console.log(`[Cache] Miss: ${key}`);
      return undefined;
    }

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      console.log(`[Cache] Expired: ${key}`);
      this.cache.delete(key);
      return undefined;
    }

    console.log(`[Cache] Hit: ${key}`);
    return entry.data;
  }

  /**
   * Check if a key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Delete a key from the cache
   */
  delete(key: string): boolean {
    console.log(`[Cache] Delete: ${key}`);
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    console.log(`[Cache] Clearing all entries (${this.cache.size} items)`);
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; keys: string[] } {
    // Clean up expired entries first
    this.cleanupExpired();

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Remove expired entries
   */
  private cleanupExpired(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`[Cache] Cleaned up ${removedCount} expired entries`);
    }
  }

  /**
   * Start automatic cleanup interval
   * @param interval - Cleanup interval in milliseconds (default: 5 minutes)
   */
  startAutoCleanup(interval: number = 5 * 60 * 1000): NodeJS.Timeout {
    console.log(`[Cache] Starting auto-cleanup (every ${interval / 1000}s)`);
    return setInterval(() => this.cleanupExpired(), interval);
  }
}

/**
 * Generate a cache key for performance searches
 */
export function generateCacheKey(artist: string, country?: string): string {
  const normalizedArtist = artist.toLowerCase().trim();
  const normalizedCountry = country?.toLowerCase().trim() || 'worldwide';
  return `${normalizedArtist}:${normalizedCountry}`;
}
