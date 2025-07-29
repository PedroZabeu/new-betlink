// Feature 2.8: Páginas Individuais de Posts - Breadcrumbs Component
// @feature: Individual Post Pages
// @created: Feature 2.8

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from '@/lib/utils';

interface BreadcrumbsProps {
  category: string;
  categoryLabel: string;
  postTitle: string;
  className?: string;
}

export function Breadcrumbs({ 
  category, 
  categoryLabel, 
  postTitle, 
  className 
}: BreadcrumbsProps) {
  return (
    <nav 
      className={cn(
        "flex items-center space-x-2 text-sm text-muted-foreground mb-6",
        className
      )}
      aria-label="Breadcrumb"
    >
      <Link 
        href="/" 
        className="flex items-center gap-1 hover:text-foreground transition-colors"
        aria-label="Ir para página inicial"
      >
        <Home className="h-3 w-3" />
        <span>Home</span>
      </Link>
      
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      
      <Link 
        href="/blog" 
        className="hover:text-foreground transition-colors"
      >
        Blog
      </Link>
      
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      
      <Link 
        href={`/blog?category=${category}`} 
        className="hover:text-foreground transition-colors"
      >
        {categoryLabel}
      </Link>
      
      <ChevronRight className="h-3 w-3" aria-hidden="true" />
      
      <span 
        className="text-foreground font-medium truncate max-w-[200px]" 
        title={postTitle}
      >
        {postTitle}
      </span>
    </nav>
  );
}