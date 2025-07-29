// Feature 2.7: Sistema de Tags e Categorias - Blog API (Server-side)
// @feature: Blog Tags and Categories
// @created: Feature 2.7
// @based-on: Next.js Blog Starter

import { join } from 'path';
import { readFileSync, readdirSync, existsSync } from 'fs';
import matter from 'gray-matter';
import { logger } from '@/lib/utils/logger';
import { BlogPost, Category, isValidCategory } from './types';

const FEATURE_NAME = '[Feature: BlogAPI]';
const postsDirectory = join(process.cwd(), '_posts');

export interface PostMetadata {
  title: string;
  date: string;
  slug: string;
  author?: {
    name: string;
    picture?: string;
  };
  coverImage?: string;
  excerpt?: string;
  ogImage?: {
    url: string;
  };
  category?: string;
  tags?: string[];
}

export interface Post extends PostMetadata {
  content: string;
}

function getPostSlugs(): string[] {
  try {
    if (!existsSync(postsDirectory)) {
      logger.warn(`${FEATURE_NAME} Posts directory not found`, { postsDirectory });
      return [];
    }
    
    const files = readdirSync(postsDirectory);
    const slugs = files.filter(name => name.endsWith('.md'));
    
    logger.debug(`${FEATURE_NAME} Found post files`, { 
      count: slugs.length,
      files: slugs 
    });
    
    return slugs.map(slug => slug.replace(/\.md$/, ''));
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error reading posts directory`, error as Error, {
      postsDirectory
    });
    return [];
  }
}

function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = join(postsDirectory, `${slug}.md`);
    
    if (!existsSync(fullPath)) {
      logger.warn(`${FEATURE_NAME} Post file not found`, { slug, fullPath });
      return null;
    }

    const fileContents = readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const post: Post = {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      content,
      author: data.author || { name: 'Anonymous' },
      coverImage: data.coverImage,
      excerpt: data.excerpt,
      ogImage: data.ogImage,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : []
    };

    logger.debug(`${FEATURE_NAME} Loaded post`, { 
      slug,
      hasCategory: !!post.category,
      tagsCount: post.tags?.length || 0
    });

    return post;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error loading post`, error as Error, { slug });
    return null;
  }
}

// Main function - Server-side only
export function getAllPosts(): BlogPost[] {
  try {
    const slugs = getPostSlugs();
    
    if (slugs.length === 0) {
      logger.warn(`${FEATURE_NAME} No posts found, returning mock data`);
      return getMockPosts();
    }
    
    const posts = slugs
      .map(slug => getPostBySlug(slug))
      .filter((post): post is Post => post !== null)
      .map(post => {
        // Convert to BlogPost with validated category
        const blogPost: BlogPost = {
          ...post,
          excerpt: post.excerpt || `Resumo do post: ${post.title}`,
          author: post.author || { name: 'Anonymous' },
          category: (post.category && isValidCategory(post.category)) 
            ? post.category as Category 
            : Category.EDUCACIONAL,
          tags: Array.isArray(post.tags) 
            ? post.tags.map(tag => String(tag).toLowerCase()) 
            : []
        };
        
        return blogPost;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    logger.info(`${FEATURE_NAME} Loaded all posts`, { 
      totalPosts: posts.length,
      postsWithCategory: posts.filter(p => p.category).length,
      postsWithTags: posts.filter(p => p.tags.length > 0).length
    });

    return posts;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error loading all posts`, error as Error);
    return getMockPosts();
  }
}

export function getPostsByCategory(category: Category): BlogPost[] {
  try {
    const allPosts = getAllPosts();
    const filteredPosts = allPosts.filter(post => post.category === category);
    
    logger.info(`${FEATURE_NAME} Filtered posts by category`, { 
      category,
      totalPosts: allPosts.length,
      filteredCount: filteredPosts.length
    });
    
    return filteredPosts;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error filtering by category`, error as Error, { category });
    return [];
  }
}

export function getPostsByTag(tag: string): BlogPost[] {
  try {
    const allPosts = getAllPosts();
    const normalizedTag = tag.toLowerCase();
    const filteredPosts = allPosts.filter(post => 
      post.tags.some(postTag => postTag.toLowerCase() === normalizedTag)
    );
    
    logger.info(`${FEATURE_NAME} Filtered posts by tag`, { 
      tag: normalizedTag,
      totalPosts: allPosts.length,
      filteredCount: filteredPosts.length
    });
    
    return filteredPosts;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error filtering by tag`, error as Error, { tag });
    return [];
  }
}

export function getPostBySlugPublic(slug: string): BlogPost | null {
  try {
    const allPosts = getAllPosts();
    const post = allPosts.find(p => p.slug === slug);
    
    if (!post) {
      logger.warn(`${FEATURE_NAME} Post not found`, { slug });
      return null;
    }
    
    logger.info(`${FEATURE_NAME} Loaded individual post`, { 
      slug,
      title: post.title,
      category: post.category
    });
    
    return post;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error loading individual post`, error as Error, { slug });
    return null;
  }
}

export function getAdjacentPosts(currentSlug: string): {
  previousPost?: { slug: string; title: string };
  nextPost?: { slug: string; title: string };
} {
  try {
    const allPosts = getAllPosts();
    const currentIndex = allPosts.findIndex(post => post.slug === currentSlug);
    
    if (currentIndex === -1) {
      logger.warn(`${FEATURE_NAME} Current post not found for adjacent`, { currentSlug });
      return {};
    }
    
    const result = {
      previousPost: currentIndex > 0 ? {
        slug: allPosts[currentIndex - 1].slug,
        title: allPosts[currentIndex - 1].title
      } : undefined,
      nextPost: currentIndex < allPosts.length - 1 ? {
        slug: allPosts[currentIndex + 1].slug,
        title: allPosts[currentIndex + 1].title
      } : undefined
    };
    
    logger.debug(`${FEATURE_NAME} Found adjacent posts`, { 
      currentSlug,
      hasPrevious: !!result.previousPost,
      hasNext: !!result.nextPost
    });
    
    return result;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error finding adjacent posts`, error as Error, { currentSlug });
    return {};
  }
}

export function getRelatedPosts(category: Category, currentSlug: string, limit: number = 3): BlogPost[] {
  try {
    const postsInCategory = getPostsByCategory(category);
    const related = postsInCategory
      .filter(post => post.slug !== currentSlug)
      .slice(0, limit);
    
    logger.info(`${FEATURE_NAME} Found related posts`, { 
      category,
      currentSlug,
      relatedCount: related.length
    });
    
    return related;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error finding related posts`, error as Error, { 
      category, 
      currentSlug 
    });
    return [];
  }
}

// Fallback mock data (only used if no markdown files found)
function getMockPosts(): BlogPost[] {
  const mockPosts: BlogPost[] = [
    {
      slug: 'metricas-essenciais-fallback',
      title: 'Métricas Essenciais para Apostadores: ROI, Yield e Muito Mais',
      excerpt: 'Entenda as principais métricas que todo apostador deve acompanhar para avaliar sua performance e tomar decisões mais inteligentes.',
      content: 'As métricas são fundamentais para qualquer apostador que deseja ter sucesso a longo prazo...',
      date: '2025-01-20',
      author: { name: 'João Silva' },
      category: Category.EDUCACIONAL,
      tags: ['iniciantes', 'métricas', 'roi', 'turnover', 'clv', 'gestão'],
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop'
    },
    {
      slug: 'entendendo-ev-positivo-fallback',
      title: 'Entendendo o EV+ (Valor Esperado Positivo) nas Apostas',
      excerpt: 'Aprenda o conceito mais importante das apostas esportivas: como identificar apostas com valor esperado positivo.',
      content: 'O EV+ (Expected Value) é o conceito mais fundamental das apostas esportivas profissionais...',
      date: '2025-01-18',
      author: { name: 'Maria Santos' },
      category: Category.ESTRATEGIAS,
      tags: ['avançado', 'ev+', 'value-betting', 'matemática', 'estratégia'],
      coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop'
    },
    {
      slug: 'estrategias-contas-ativas-fallback',
      title: 'Estratégias para Manter Contas Ativas: Fugindo da Limitação',
      excerpt: 'Descubra técnicas profissionais para evitar limitações e manter suas contas de apostas ativas por mais tempo.',
      content: 'A limitação de contas é um dos maiores desafios dos apostadores profissionais...',
      date: '2025-01-15',
      author: { name: 'Pedro Oliveira' },
      category: Category.GESTAO_BANCA,
      tags: ['limitação', 'casas-apostas', 'gestão', 'sharp-betting', 'longevidade'],
      coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop'
    },
    {
      slug: 'montando-carteira-tipsters-fallback',
      title: 'Montando uma Carteira de Tipsters: Guia Completo de Diversificação',
      excerpt: 'Aprenda como construir uma carteira diversificada de tipsters para maximizar lucros e minimizar riscos.',
      content: 'A diversificação é fundamental no mundo das apostas...',
      date: '2025-01-12',
      author: { name: 'Ana Costa' },
      category: Category.FERRAMENTAS,
      tags: ['tipsters', 'diversificação', 'gestão', 'roi', 'carteira'],
      coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
    }
  ];

  logger.info(`${FEATURE_NAME} Using fallback mock posts`, { 
    count: mockPosts.length 
  });

  return mockPosts;
}