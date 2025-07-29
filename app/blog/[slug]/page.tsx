// Feature 2.8: Páginas Individuais de Posts - Dynamic Route
// @feature: Individual Post Pages
// @created: Feature 2.8

import { notFound } from 'next/navigation';
import { Header } from "@/components/header";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { logger } from '@/lib/utils/logger';
import { 
  getAllPosts, 
  getPostBySlugPublic, 
  getAdjacentPosts, 
  getRelatedPosts 
} from '@/lib/blog/api';
import { getCategoryInfo } from '@/lib/blog/types';
import { Breadcrumbs } from '@/components/blog/breadcrumbs';
import { PostNavigation } from '@/components/blog/post-navigation';
import { ReadingProgress } from '@/components/blog/reading-progress';
import { RelatedPosts } from '@/components/blog/related-posts';
import { ShareButtons } from '@/components/blog/share-buttons';

const FEATURE_NAME = '[Feature: IndividualPost]';

interface BlogPostPageProps {
  params: { slug: string };
}

// Generate static params for all posts
export async function generateStaticParams() {
  try {
    const posts = getAllPosts();
    const params = posts.map((post) => ({
      slug: post.slug,
    }));
    
    logger.info(`${FEATURE_NAME} Generated static params`, { 
      count: params.length 
    });
    
    return params;
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error generating static params`, error as Error);
    return [];
  }
}

// Format date to Brazilian format
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
}

// Calculate read time based on content length
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

// Generate metadata for the post
export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = getPostBySlugPublic(params.slug);
  
  if (!post) {
    return {
      title: 'Post não encontrado - BetLink Blog',
    };
  }
  
  const categoryInfo = getCategoryInfo(post.category);
  
  return {
    title: `${post.title} - BetLink Blog`,
    description: post.excerpt,
    keywords: [...post.tags, categoryInfo.label, 'apostas esportivas', 'betlink'].join(', '),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
      images: post.coverImage ? [{
        url: post.coverImage,
        width: 800,
        height: 400,
        alt: post.title
      }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    logger.info(`${FEATURE_NAME} Loading individual post page`, { slug: params.slug });
    
    const post = getPostBySlugPublic(params.slug);
    
    if (!post) {
      logger.warn(`${FEATURE_NAME} Post not found`, { slug: params.slug });
      notFound();
    }
    
    const categoryInfo = getCategoryInfo(post.category);
    const { previousPost, nextPost } = getAdjacentPosts(params.slug);
    const relatedPosts = getRelatedPosts(post.category, params.slug, 3);
    const readTime = calculateReadTime(post.content);
    
    logger.info(`${FEATURE_NAME} Post page loaded successfully`, { 
      slug: params.slug,
      title: post.title,
      category: post.category,
      hasRelated: relatedPosts.length > 0
    });
    
    return (
      <PageWrapper>
        <ReadingProgress />
        <Header />
        <main className="flex-1">
          <article className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Breadcrumbs */}
            <Breadcrumbs
              category={post.category}
              categoryLabel={categoryInfo.label}
              postTitle={post.title}
            />
            
            {/* Back to Blog */}
            <div className="mb-6">
              <Button variant="ghost" asChild className="-ml-4">
                <Link href="/blog" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao Blog
                </Link>
              </Button>
            </div>
            
            {/* Post Header */}
            <header className="mb-8">
              {/* Category Badge */}
              <div className="mb-4">
                <Badge 
                  className={`bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800 border-0`}
                >
                  {categoryInfo.label}
                </Badge>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {post.title}
              </h1>
              
              {/* Excerpt */}
              <p className="text-xl text-muted-foreground mb-6">
                {post.excerpt}
              </p>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} de leitura</span>
                </div>
              </div>
              
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Share Buttons */}
              <ShareButtons
                url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://betlink.com'}/blog/${post.slug}`}
                title={post.title}
                excerpt={post.excerpt}
              />
            </header>
            
            {/* Cover Image */}
            {post.coverImage && (
              <div className="relative w-full h-[400px] md:h-[500px] mb-8 overflow-hidden rounded-lg">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-12">
              {/* Render markdown content - for now showing as plain text */}
              <div className="whitespace-pre-wrap">
                {post.content}
              </div>
            </div>
            
            {/* Post Navigation */}
            <PostNavigation 
              previousPost={previousPost}
              nextPost={nextPost}
              className="mb-12"
            />
            
            {/* Related Posts */}
            <RelatedPosts
              posts={relatedPosts}
              currentSlug={params.slug}
            />
          </article>
        </main>
      </PageWrapper>
    );
  } catch (error) {
    logger.error(`${FEATURE_NAME} Error loading post page`, error as Error, { 
      slug: params.slug 
    });
    
    // Fallback UI
    return (
      <PageWrapper>
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold mb-4">Erro ao carregar post</h1>
            <p className="text-muted-foreground mb-6">
              Ocorreu um erro ao carregar este post. Tente novamente mais tarde.
            </p>
            <Button asChild>
              <Link href="/blog">Voltar ao Blog</Link>
            </Button>
          </div>
        </main>
      </PageWrapper>
    );
  }
}

// Export for static generation
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour