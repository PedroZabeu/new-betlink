// Feature 2.9: Sistema de Busca no Blog - Search Logic
// @feature: Blog Search System
// @created: Feature 2.9

import { BlogPost, Category } from './types';
import { logger } from '@/lib/utils/logger';

const FEATURE_NAME = '[Feature: BlogSearch]';

/**
 * Interface para resultado de busca com score de relevância
 */
export interface SearchResult {
  post: BlogPost;
  relevanceScore: number;
  matchedFields: string[];
}

/**
 * Interface para estatísticas de busca
 */
export interface SearchStats {
  totalResults: number;
  searchTime: number;
  query: string;
  isEmpty: boolean;
}

/**
 * Busca posts baseado em uma query de texto
 * 
 * @param posts - Array de posts para buscar
 * @param query - Texto da busca
 * @returns Array de posts filtrados e ordenados por relevância
 */
export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  const startTime = performance.now();
  
  try {
    // Se query vazia, retorna todos os posts
    if (!query.trim()) {
      logger.debug(`${FEATURE_NAME} Empty query, returning all posts`, {
        totalPosts: posts.length
      });
      return posts;
    }

    // Normalizar query: lowercase e dividir em termos
    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 0)
      .map(term => term.trim());

    if (searchTerms.length === 0) {
      return posts;
    }

    // Filtrar e classificar posts
    const results = posts
      .map(post => {
        const result = calculatePostRelevance(post, searchTerms);
        return result.relevanceScore > 0 ? result : null;
      })
      .filter((result): result is SearchResult => result !== null)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .map(result => result.post);

    const searchTime = performance.now() - startTime;
    
    logger.info(`${FEATURE_NAME} Search completed`, {
      query,
      searchTerms,
      totalPosts: posts.length,
      resultsCount: results.length,
      searchTime: Math.round(searchTime * 100) / 100 // 2 decimal places
    });

    return results;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error during search`, error as Error, {
      query,
      postsCount: posts.length
    });
    return posts; // Fallback: retorna todos os posts em caso de erro
  }
}

/**
 * Calcula a relevância de um post para os termos de busca
 * 
 * @param post - Post para avaliar
 * @param searchTerms - Termos de busca normalizados
 * @returns Resultado com score e campos que fizeram match
 */
function calculatePostRelevance(post: BlogPost, searchTerms: string[]): SearchResult {
  let relevanceScore = 0;
  const matchedFields: string[] = [];
  
  // Preparar campos para busca (todos em lowercase)
  const searchableFields = {
    title: post.title.toLowerCase(),
    excerpt: post.excerpt.toLowerCase(),
    content: post.content.toLowerCase(),
    category: post.category.toLowerCase(),
    tags: post.tags.map(tag => tag.toLowerCase()),
    author: post.author.name.toLowerCase()
  };

  // Verificar cada termo de busca
  for (const term of searchTerms) {
    let termFound = false;
    
    // Buscar no título (peso 10)
    if (searchableFields.title.includes(term)) {
      relevanceScore += 10;
      if (!matchedFields.includes('title')) matchedFields.push('title');
      termFound = true;
    }
    
    // Buscar no excerpt (peso 7)
    if (searchableFields.excerpt.includes(term)) {
      relevanceScore += 7;
      if (!matchedFields.includes('excerpt')) matchedFields.push('excerpt');
      termFound = true;
    }
    
    // Buscar nas tags (peso 5)
    if (searchableFields.tags.some(tag => tag.includes(term))) {
      relevanceScore += 5;
      if (!matchedFields.includes('tags')) matchedFields.push('tags');
      termFound = true;
    }
    
    // Buscar na categoria (peso 4)
    if (searchableFields.category.includes(term)) {
      relevanceScore += 4;
      if (!matchedFields.includes('category')) matchedFields.push('category');
      termFound = true;
    }
    
    // Buscar no conteúdo (peso 2)
    if (searchableFields.content.includes(term)) {
      relevanceScore += 2;
      if (!matchedFields.includes('content')) matchedFields.push('content');
      termFound = true;
    }
    
    // Buscar no autor (peso 1)
    if (searchableFields.author.includes(term)) {
      relevanceScore += 1;
      if (!matchedFields.includes('author')) matchedFields.push('author');
      termFound = true;
    }
    
    // Se algum termo não foi encontrado em nenhum campo, score = 0 (AND logic)
    if (!termFound) {
      return {
        post,
        relevanceScore: 0,
        matchedFields: []
      };
    }
  }
  
  // Bonus por matches exatos no título
  const fullQuery = searchTerms.join(' ');
  if (searchableFields.title.includes(fullQuery)) {
    relevanceScore += 15;
  }
  
  // Bonus por matches exatos no excerpt
  if (searchableFields.excerpt.includes(fullQuery)) {
    relevanceScore += 10;
  }

  return {
    post,
    relevanceScore,
    matchedFields
  };
}

/**
 * Gera estatísticas de uma busca
 * 
 * @param originalPosts - Posts originais antes da busca
 * @param filteredPosts - Posts após busca
 * @param query - Query de busca
 * @param searchTime - Tempo de busca em ms
 * @returns Estatísticas da busca
 */
export function generateSearchStats(
  originalPosts: BlogPost[], 
  filteredPosts: BlogPost[], 
  query: string, 
  searchTime: number = 0
): SearchStats {
  return {
    totalResults: filteredPosts.length,
    searchTime,
    query: query.trim(),
    isEmpty: filteredPosts.length === 0 && query.trim().length > 0
  };
}

/**
 * Extrai termos únicos de busca de uma query
 * 
 * @param query - Query de busca
 * @returns Array de termos únicos
 */
export function extractSearchTerms(query: string): string[] {
  return Array.from(new Set(
    query
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 0)
      .map(term => term.trim())
  ));
}

/**
 * Valida se uma query de busca é válida
 * 
 * @param query - Query para validar
 * @returns true se válida, false caso contrário
 */
export function isValidSearchQuery(query: string): boolean {
  const trimmed = query.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
}