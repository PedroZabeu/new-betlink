// Feature 2.8: Páginas Individuais de Posts - Related Posts Component
// @feature: Individual Post Pages
// @created: Feature 2.8

import Link from "next/link";
import Image from "next/image";
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';
import { BlogPost, getCategoryInfo } from '@/lib/blog/types';
import { cn } from '@/lib/utils';

interface RelatedPostsProps {
  posts: BlogPost[];
  currentSlug: string;
  className?: string;
}

// Format date to Brazilian format
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'short'
  });
}

// Calculate read time based on content length
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}

export function RelatedPosts({ posts, currentSlug, className }: RelatedPostsProps) {
  // Filter out current post and limit to 3
  const related = posts
    .filter(post => post.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className={cn("mb-12", className)}>
      <h2 className="text-2xl font-bold mb-6">Posts Relacionados</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {related.map((post) => {
          const categoryInfo = getCategoryInfo(post.category);
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative h-48">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge 
                        className={`bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800 border-0`}
                      >
                        {categoryInfo.label}
                      </Badge>
                    </div>
                  </div>
                )}
                
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{calculateReadTime(post.content)}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    </section>
  );
}