// Feature 2.8: Páginas Individuais de Posts - Dynamic Route
// @feature: Individual Post Pages
// @created: Feature 2.8
// @enhanced: Feature 2.10 - Dynamic Metadata

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from "@/components/header";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
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
import { ScrollToTop } from '@/components/blog/scroll-to-top';

const FEATURE_NAME = '[Feature: IndividualPost]';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
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

// Feature 2.10: Dynamic Metadata Generation
// Generate dynamic metadata for each post for SEO optimization
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    logger.info(`${FEATURE_NAME} Generating metadata for post`, { slug: resolvedParams.slug });
    
    const post = getPostBySlugPublic(resolvedParams.slug);
    
    if (!post) {
      logger.warn(`${FEATURE_NAME} Post not found for metadata generation`, { slug: resolvedParams.slug });
      return {
        title: 'Post não encontrado | BetLink Blog',
        description: 'O post solicitado não foi encontrado no BetLink Blog.',
      };
    }
    
    const categoryInfo = getCategoryInfo(post.category);
    const title = `${post.title} | BetLink Blog`;
    const description = post.excerpt || `${post.title} - Artigo sobre apostas esportivas no BetLink Blog.`;
    
    logger.info(`${FEATURE_NAME} Metadata generated successfully`, { 
      slug: resolvedParams.slug,
      title: post.title,
      category: post.category 
    });
    
    return {
      title,
      description,
      keywords: post.tags?.join(', ') || 'apostas esportivas, tipster, análise',
      authors: [{ name: post.author?.name || 'BetLink' }],
      openGraph: {
        title,
        description,
        type: 'article',
        publishedTime: post.date,
        tags: post.tags,
        authors: [post.author?.name || 'BetLink'],
        section: categoryInfo.name,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `/blog/${resolvedParams.slug}`,
      },
    };
  } catch (error) {
    const resolvedParams = await params;
    logger.error(`${FEATURE_NAME} Error generating metadata`, error as Error, { 
      slug: resolvedParams.slug 
    });
    
    // Fallback metadata to prevent build failure
    return {
      title: 'BetLink Blog',
      description: 'Artigos e análises sobre apostas esportivas e tipsters profissionais.',
    };
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

// Format post content with proper heading styles
function formatPostContent(content: string) {
  // Split content into lines
  const lines = content.split('\n');
  const formattedElements: React.JSX.Element[] = [];
  let currentList: string[] = [];
  
  const flushList = () => {
    if (currentList.length > 0) {
      formattedElements.push(
        <ul key={`list-${formattedElements.length}`} className="list-disc list-inside space-y-2 mb-6 text-gray-700">
          {currentList.map((item, index) => (
            <li key={index} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const formatMathExpression = (text: string) => {
    // Replace common math symbols with proper formatting
    return text
      .replace(/(\d+)\s*×\s*(\d+)/g, '$1 × $2') // Multiplication
      .replace(/(\d+)\s*÷\s*(\d+)/g, '$1 ÷ $2') // Division
      .replace(/(\d+)\s*\+\s*(\d+)/g, '$1 + $2') // Addition
      .replace(/(\d+)\s*-\s*(\d+)/g, '$1 - $2') // Subtraction
      .replace(/(\d+)\s*=\s*(\d+)/g, '$1 = $2') // Equality
      .replace(/\(([^)]+)\)/g, '($1)') // Parentheses
      .replace(/(\d+),(\d+)/g, '$1,$2'); // Decimal numbers
  };

  const formatBoldText = (text: string) => {
    // Replace **[text]** with bold formatting
    return text.replace(/\*\*\[([^\]]+)\]\*\*/g, '<strong>$1</strong>');
  };
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Check for different heading patterns
    if (trimmedLine.startsWith('### ')) {
      flushList();
      // H3 heading (### Title)
      const title = trimmedLine.replace('### ', '');
      formattedElements.push(
        <h3 key={index} className="text-2xl font-bold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2">
          {title}
        </h3>
      );
      return;
    }
    
    if (trimmedLine.startsWith('## ')) {
      flushList();
      // H2 heading (## Title)
      const title = trimmedLine.replace('## ', '');
      formattedElements.push(
        <h2 key={index} className="text-3xl font-bold mt-10 mb-6 text-gray-900 border-b-2 border-primary pb-3">
          {title}
        </h2>
      );
      return;
    }
    
    if (trimmedLine.startsWith('# ')) {
      flushList();
      // H1 heading (# Title)
      const title = trimmedLine.replace('# ', '');
      formattedElements.push(
        <h1 key={index} className="text-4xl font-bold mt-12 mb-8 text-gray-900 border-b-4 border-primary pb-4">
          {title}
        </h1>
      );
      return;
    }
    
    if (trimmedLine.startsWith('***') || trimmedLine.startsWith('---')) {
      flushList();
      // Horizontal rule
      formattedElements.push(
        <hr key={index} className="my-8 border-gray-300" />
      );
      return;
    }
    
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      flushList();
      // Bold text (entire line)
      const text = trimmedLine.replace(/\*\*/g, '');
      formattedElements.push(
        <p key={index} className="text-lg font-semibold text-gray-800 my-4">
          {text}
        </p>
      );
      return;
    }
    
    // Check for mathematical expressions
    if (trimmedLine.includes('=') && (trimmedLine.includes('×') || trimmedLine.includes('+') || trimmedLine.includes('-') || trimmedLine.includes('÷'))) {
      flushList();
      // Mathematical expression
      const formattedMath = formatMathExpression(trimmedLine);
      formattedElements.push(
        <div key={index} className="bg-gray-50 border-l-4 border-primary p-4 my-6 rounded-r-lg">
          <div className="font-mono text-lg text-gray-800 leading-relaxed">
            {formattedMath}
          </div>
        </div>
      );
      return;
    }
    
    // Check for calculation explanations
    if (trimmedLine.toLowerCase().includes('vamos calcular') || 
        trimmedLine.toLowerCase().includes('calcule') ||
        trimmedLine.toLowerCase().includes('resultado') ||
        trimmedLine.toLowerCase().includes('valor esperado')) {
      flushList();
      formattedElements.push(
        <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6 rounded-r-lg">
          <p className="text-gray-800 font-medium">
            {trimmedLine}
          </p>
        </div>
      );
      return;
    }
    
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      // List item - collect for grouping
      const text = trimmedLine.replace(/^[\*\-]\s/, '');
      currentList.push(text);
      return;
    }
    
    if (trimmedLine === '') {
      flushList();
      // Empty line
      formattedElements.push(
        <div key={index} className="h-4" />
      );
      return;
    }
    
    // Regular paragraph with bold formatting
    flushList();
    const formattedText = formatBoldText(line);
    formattedElements.push(
      <p key={index} className="text-gray-700 leading-relaxed mb-4" 
         dangerouslySetInnerHTML={{ __html: formattedText }} />
    );
  });
  
  // Flush any remaining list
  flushList();
  
  return formattedElements;
}


export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const resolvedParams = await params;
    logger.info(`${FEATURE_NAME} Loading individual post page`, { slug: resolvedParams.slug });
    
    const post = getPostBySlugPublic(resolvedParams.slug);
    
    if (!post) {
      logger.warn(`${FEATURE_NAME} Post not found`, { slug: resolvedParams.slug });
      notFound();
    }
    
    const categoryInfo = getCategoryInfo(post.category);
    const { previousPost, nextPost } = getAdjacentPosts(resolvedParams.slug);
    const relatedPosts = getRelatedPosts(post.category, resolvedParams.slug, 3);
    const readTime = calculateReadTime(post.content);
    
    logger.info(`${FEATURE_NAME} Post page loaded successfully`, { 
      slug: resolvedParams.slug,
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
            
            {/* Post Content */}
            <div className="prose prose-lg max-w-none mb-12">
              {/* Render formatted content */}
              <div className="space-y-4">
                {formatPostContent(post.content)}
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
              currentSlug={resolvedParams.slug}
            />
          </article>
        </main>
        
        {/* Feature 2.10: Scroll to Top Button */}
        <ScrollToTop />
      </PageWrapper>
    );
  } catch (error) {
    const resolvedParams = await params;
    logger.error(`${FEATURE_NAME} Error loading post page`, error as Error, { 
      slug: resolvedParams.slug 
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