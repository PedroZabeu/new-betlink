// Feature 2.8: Páginas Individuais de Posts - Post Navigation Component
// @feature: Individual Post Pages
// @created: Feature 2.8

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from '@/lib/utils';

interface PostNavigationProps {
  previousPost?: {
    slug: string;
    title: string;
  };
  nextPost?: {
    slug: string;
    title: string;
  };
  className?: string;
}

export function PostNavigation({ 
  previousPost, 
  nextPost, 
  className 
}: PostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }
  
  return (
    <nav 
      className={cn(
        "flex justify-between items-stretch gap-4 py-8 border-y",
        className
      )}
      aria-label="Navegação entre posts"
    >
      {previousPost ? (
        <Link 
          href={`/blog/${previousPost.slug}`} 
          className="group flex-1 text-left p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Post Anterior</span>
          </div>
          <div className="font-medium group-hover:text-primary transition-colors line-clamp-2">
            {previousPost.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      
      {nextPost ? (
        <Link 
          href={`/blog/${nextPost.slug}`} 
          className="group flex-1 text-right p-4 rounded-lg border hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
            <span>Próximo Post</span>
            <ArrowRight className="h-4 w-4" />
          </div>
          <div className="font-medium group-hover:text-primary transition-colors line-clamp-2">
            {nextPost.title}
          </div>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}