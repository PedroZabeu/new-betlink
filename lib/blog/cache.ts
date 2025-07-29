// Feature 2.10: Melhorias de Performance e UX - Blog Post Cache System
// @feature: Performance Optimization
// @created: Feature 2.10

import { BlogPost } from './types';
import { logger } from '@/lib/utils/logger';

const FEATURE_NAME = '[Feature: BlogCache]';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Maximum number of cached posts

interface CacheEntry {
  data: BlogPost;
  timestamp: number;
}

// Use Map for better performance than plain object
const postCache = new Map<string, CacheEntry>();

/**
 * Get a cached post by slug
 * Returns null if not found or expired
 */
export function getCachedPost(slug: string): BlogPost | null {
  const entry = postCache.get(slug);
  
  if (!entry) {
    logger.debug(`${FEATURE_NAME} Cache miss`, { slug });
    return null;
  }
  
  // Check if expired
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    postCache.delete(slug);
    logger.debug(`${FEATURE_NAME} Cache expired, removing`, { slug });
    return null;
  }
  
  logger.debug(`${FEATURE_NAME} Cache hit`, { slug });
  return entry.data;
}

/**
 * Cache a post by slug
 * Includes automatic cleanup to prevent memory leaks
 */
export function setCachedPost(slug: string, post: BlogPost): void {
  // Clean up expired entries if cache is getting too large
  if (postCache.size >= MAX_CACHE_SIZE) {
    cleanupExpiredEntries();
    
    // If still too large after cleanup, remove oldest entries
    if (postCache.size >= MAX_CACHE_SIZE) {
      const entriesToRemove = Math.floor(MAX_CACHE_SIZE * 0.2); // Remove 20%
      const sortedEntries = Array.from(postCache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      for (let i = 0; i < entriesToRemove; i++) {
        postCache.delete(sortedEntries[i][0]);
      }
      
      logger.info(`${FEATURE_NAME} Cache cleanup completed`, { 
        removedEntries: entriesToRemove,
        currentSize: postCache.size 
      });
    }
  }
  
  postCache.set(slug, {
    data: post,
    timestamp: Date.now(),
  });
  
  logger.debug(`${FEATURE_NAME} Post cached`, { 
    slug, 
    cacheSize: postCache.size 
  });
}

/**
 * Remove expired entries from cache
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  let removedCount = 0;
  
  for (const [slug, entry] of postCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      postCache.delete(slug);
      removedCount++;
    }
  }
  
  if (removedCount > 0) {
    logger.debug(`${FEATURE_NAME} Cleaned up expired entries`, { 
      removedCount,
      remainingSize: postCache.size 
    });
  }
}

/**
 * Clear all cached posts
 * Useful for testing or manual cache invalidation
 */
export function clearCache(): void {
  const previousSize = postCache.size;
  postCache.clear();
  
  logger.info(`${FEATURE_NAME} Cache cleared`, { 
    previousSize 
  });
}

/**
 * Get cache statistics
 * Useful for monitoring and debugging
 */
export function getCacheStats() {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;
  
  for (const entry of postCache.values()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      expiredEntries++;
    } else {
      validEntries++;
    }
  }
  
  return {
    totalEntries: postCache.size,
    validEntries,
    expiredEntries,
    hitRate: validEntries / Math.max(postCache.size, 1), // Avoid division by zero
  };
}