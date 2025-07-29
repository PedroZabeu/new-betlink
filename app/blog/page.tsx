// Feature 2.7: Sistema de Tags e Categorias - Blog Page (Server Component)
// @feature: Blog Tags and Categories
// @created: Feature 2.7
// @enhanced: Feature 2.10 - Static Generation

import { Header } from "@/components/header";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { getAllPosts } from "@/lib/blog/api";
import { BlogClient } from "@/components/blog/blog-client";
import { ScrollToTop } from "@/components/blog/scroll-to-top";
import { logger } from '@/lib/utils/logger';

// Feature 2.10: Static Site Generation
// Generate static params for all blog categories and tags
export async function generateStaticParams() {
  try {
    logger.info('[Feature: BlogPage] Generating static params for blog');
    
    const posts = getAllPosts();
    logger.info('[Feature: BlogPage] Static params generated successfully', { 
      postsCount: posts.length 
    });
    
    // Return empty array since this is the main blog page
    // Dynamic filtering happens client-side
    return [];
  } catch (error) {
    logger.error('[Feature: BlogPage] Failed to generate static params', error as Error);
    // Return empty array to prevent build failure
    return [];
  }
}

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
        
        {/* Feature 2.10: Scroll to Top Button */}
        <ScrollToTop />
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