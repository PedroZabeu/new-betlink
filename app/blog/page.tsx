// Feature 2.7: Sistema de Tags e Categorias - Blog Page (Server Component)
// @feature: Blog Tags and Categories
// @created: Feature 2.7

import { Header } from "@/components/header";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { getAllPosts } from "@/lib/blog/api";
import { BlogClient } from "@/components/blog/blog-client";
import { logger } from '@/lib/utils/logger';

const FEATURE_NAME = '[Feature: BlogPage]';

// Server Component - loads data from markdown files
export default function BlogPage() {
  try {
    logger.info(`${FEATURE_NAME} Loading blog page with markdown posts`);
    
    // Server-side data loading (fs access works here)
    const posts = getAllPosts();
    
    logger.info(`${FEATURE_NAME} Blog page loaded successfully`, { 
      postsCount: posts.length,
      hasRealPosts: posts.length > 0 && !posts[0].slug.includes('fallback')
    });

    return (
      <PageWrapper>
        <Header />
        <main className="flex-1">
          {/* Pass data to Client Component */}
          <BlogClient posts={posts} />
        </main>
      </PageWrapper>
    );
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error loading blog page`, error as Error);
    
    // Fallback UI
    return (
      <PageWrapper>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold mb-4">Erro ao carregar blog</h1>
            <p className="text-muted-foreground">
              Ocorreu um erro ao carregar os posts. Tente novamente mais tarde.
            </p>
          </div>
        </main>
      </PageWrapper>
    );
  }
}