// Feature 2.7: Sistema de Tags e Categorias - Client-side Filters
// @feature: Blog Tags and Categories
// @created: Feature 2.7

import { logger } from '@/lib/utils/logger';
import { 
  BlogPost, 
  Category, 
  FilterState, 
  PostCounts, 
  FilterResult
} from './types';

const FEATURE_NAME = '[Feature: BlogFilters]';

/**
 * Extrai todas as tags únicas de uma lista de posts
 */
export function extractUniqueTagsFromPosts(posts: BlogPost[]): string[] {
  try {
    const tagSet = new Set<string>();
    
    posts.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (typeof tag === 'string' && tag.trim()) {
            tagSet.add(tag.trim().toLowerCase());
          }
        });
      }
    });

    const uniqueTags = Array.from(tagSet).sort();
    
    logger.debug(`${FEATURE_NAME} Extracted unique tags`, { 
      totalPosts: posts.length,
      uniqueTagsCount: uniqueTags.length
    });

    return uniqueTags;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error extracting tags`, error as Error, { 
      postsCount: posts?.length || 0 
    });
    return [];
  }
}

/**
 * Conta posts por categoria
 */
export function countPostsByCategory(posts: BlogPost[]): Record<Category, number> {
  try {
    const counts: Record<Category, number> = {
      [Category.EDUCACIONAL]: 0,
      [Category.ESTRATEGIAS]: 0,
      [Category.GESTAO_BANCA]: 0,
      [Category.FERRAMENTAS]: 0
    };

    posts.forEach(post => {
      if (post.category && Object.values(Category).includes(post.category)) {
        counts[post.category]++;
      }
    });

    logger.debug(`${FEATURE_NAME} Counted posts by category`, { counts });
    return counts;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error counting by category`, error as Error);
    return {
      [Category.EDUCACIONAL]: 0,
      [Category.ESTRATEGIAS]: 0,
      [Category.GESTAO_BANCA]: 0,
      [Category.FERRAMENTAS]: 0
    };
  }
}

/**
 * Conta posts por tag
 */
export function countPostsByTag(posts: BlogPost[]): Record<string, number> {
  try {
    const counts: Record<string, number> = {};

    posts.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          if (typeof tag === 'string' && tag.trim()) {
            const normalizedTag = tag.trim().toLowerCase();
            counts[normalizedTag] = (counts[normalizedTag] || 0) + 1;
          }
        });
      }
    });

    logger.debug(`${FEATURE_NAME} Counted posts by tag`, { 
      uniqueTags: Object.keys(counts).length
    });

    return counts;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error counting by tag`, error as Error);
    return {};
  }
}

/**
 * Filtra posts baseado no estado de filtros
 */
export function filterPostsByFilters(posts: BlogPost[], filters: FilterState): BlogPost[] {
  try {
    let filteredPosts = [...posts];

    // Filtro por categorias (OR logic)
    if (filters.categories.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        filters.categories.includes(post.category)
      );
    }

    // Filtro por tags (AND logic - post deve ter TODAS as tags selecionadas)
    if (filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter(post => {
        if (!Array.isArray(post.tags)) return false;
        
        const postTags = post.tags.map(tag => tag.toLowerCase());
        return filters.tags.every(filterTag => 
          postTags.includes(filterTag.toLowerCase())
        );
      });
    }

    // Filtro por busca textual
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const searchTerm = filters.searchQuery.toLowerCase().trim();
      
      filteredPosts = filteredPosts.filter(post => {
        const searchableText = [
          post.title,
          post.excerpt,
          post.content,
          ...(post.tags || [])
        ].join(' ').toLowerCase();
        
        return searchableText.includes(searchTerm);
      });
    }

    logger.debug(`${FEATURE_NAME} Filter operation completed`, { 
      originalCount: posts.length,
      filteredCount: filteredPosts.length
    });

    return filteredPosts;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error filtering posts`, error as Error);
    return posts;
  }
}

/**
 * Combina lógica de filtragem e contagem
 */
export function combineFiltersLogic(posts: BlogPost[], filters: FilterState): FilterResult {
  try {
    const filteredPosts = filterPostsByFilters(posts, filters);
    
    const counts: PostCounts = {
      total: posts.length,
      byCategory: countPostsByCategory(posts),
      byTag: countPostsByTag(posts)
    };

    return {
      posts: filteredPosts,
      counts,
      appliedFilters: filters
    };
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error in combined filter logic`, error as Error);
    
    return {
      posts: posts,
      counts: {
        total: posts.length,
        byCategory: countPostsByCategory(posts),
        byTag: countPostsByTag(posts)
      },
      appliedFilters: filters
    };
  }
}

/**
 * Utilitário para limpar filtros
 */
export function clearAllFilters(): FilterState {
  return {
    categories: [],
    tags: [],
    searchQuery: undefined
  };
}

/**
 * Utilitário para verificar se há filtros ativos
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return filters.categories.length > 0 || 
         filters.tags.length > 0 || 
         !!filters.searchQuery?.trim();
}